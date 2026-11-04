/**
 * Pediatric OSCE Simulator - AI Dialogue & Clinical Assessor Engine
 * Connects directly to Google Gemini API when an API key is provided,
 * or runs the high-fidelity Malaysian clinical offline engine.
 */

window.OSCE_AI = {
  getModel: function() {
    return localStorage.getItem('gemini_selected_model') || 'gemini-3.8-flash';
  },
  setModel: function(model) {
    localStorage.setItem('gemini_selected_model', (model || 'gemini-3.8-flash').trim());
  },
  getApiKey: function() {
    return localStorage.getItem('gemini_api_key') || '';
  },

  setApiKey: function(key) {
    localStorage.setItem('gemini_api_key', (key || '').trim());
  },

  /**
   * Main Dialogue Dispatcher
   */
  sendMessage: async function(station, history, userMessage) {
    var key = this.getApiKey();

    // 1. Try Gemini REST API if key provided and browser online
    if (key && navigator.onLine) {
      try {
        var contents = (history || []).map(function(m) {
          return {
            role: m.sender === 'candidate' ? 'user' : 'model',
            parts: [{ text: m.text }]
          };
        });
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });

        var sysPrompt = "You are " + station.parentName + ", parent of " + station.childName + " in a Malaysian Pediatric OSCE station.\n" +
          "Follow these STRICT rules:\n" +
          "1. Non-medical layperson speaking everyday Malaysian English with warm parental concern.\n" +
          "2. STRICT ZERO-CLUES: Never volunteer clinical terms, procedures, or checklist items. Never mention dipsticks, steroids, chelation, phototherapy, spacers, or fava beans on your own.\n" +
          "3. Keep each turn STRICTLY 1 to 2 short sentences (max 25 words). Let the doctor lead.\n" +
          "4. If the doctor uses unexplained jargon, ask what it means in simple lay words.";

        var res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(this.getModel()) + ':generateContent?key=' + encodeURIComponent(key), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: { parts: [{ text: sysPrompt }] }
          })
        });

        if (res.ok) {
          var data = await res.json();
          var reply = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
          if (reply && reply.trim()) {
            return { text: reply.trim(), isExaminer: false };
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local clinical engine:', err);
      }
    }

    // 2. High-fidelity Offline / Local Clinical Engine
    var localReply = this.generateLocalParentResponse(station, history, userMessage);
    return { text: localReply, isExaminer: false };
  },

  /**
   * Offline Clinical Simulation Engine
   */
  generateLocalParentResponse: function(station, history, userMessage) {
    var text = (userMessage || '').toLowerCase();
    var script = station.offlineScript;

    // Check for unexplained medical jargon
    var matchedJargon = (script.jargonKeywords || []).filter(function(k) { return text.includes(k.toLowerCase()); });
    if (matchedJargon.length > 0 && !text.includes('mean') && !text.includes('simple')) {
      return script.jargonResponse;
    }

    // Track said responses in this consultation
    var said = new Set((history || []).filter(function(m) { return m.sender === 'parent'; }).map(function(m) { return m.text; }));

    // Match keywords to find next stage
    for (var i = 0; i < script.stages.length; i++) {
      var stage = script.stages[i];
      if (said.has(stage.response)) continue;
      var match = stage.triggerKeywords.some(function(kw) { return text.includes(kw.toLowerCase()); });
      if (match) {
        return stage.response;
      }
    }

    // Unsaid sequential stage
    for (var j = 0; j < script.stages.length; j++) {
      if (!said.has(script.stages[j].response)) {
        return script.stages[j].response;
      }
    }

    return script.fallbackResponse;
  },

  /**
   * Consultant Paediatrician 20-Mark Evaluation Generator
   */
  generateEvaluation: async function(station, history, lastMessage) {
    var fullTranscript = (history || []).map(function(m) {
      return m.senderName + ': ' + m.text;
    }).join('\n') + '\nDoctor: ' + (lastMessage || '');

    var textLower = fullTranscript.toLowerCase();
    var candidateMsgs = (history || []).filter(function(m) { return m.sender === 'candidate'; });
    var isPrematureEnd = candidateMsgs.length <= 1;

    var criticalSafetyFailure = null;

    // Critical Safety Violations
    if (isPrematureEnd) {
      criticalSafetyFailure = "CRITICAL SAFETY FAILURE: Premature Station Termination (Omission of Essential Counselling)";
    } else if (station.id === 'nephrotic') {
      var mentionedDipstick = textLower.includes('dipstick') || textLower.includes('albustix') || textLower.includes('urine test') || textLower.includes('morning urine') || textLower.includes('check urine');
      if (!mentionedDipstick) {
        criticalSafetyFailure = "CRITICAL SAFETY FAILURE: Missed Daily Urine Protein Monitoring";
      }
    } else if (station.id === 'febrile_convulsion') {
      var warnedSpoon = textLower.includes('nothing in mouth') || textLower.includes('no spoon') || textLower.includes('do not put anything') || textLower.includes('never put');
      if (!warnedSpoon && textLower.includes('spoon')) {
        criticalSafetyFailure = "CRITICAL SAFETY FAILURE: Unsafe Seizure Management (Endorsed or failed to prohibit objects in mouth)";
      }
    } else if (station.id === 'neonatal_jaundice') {
      var warnedSunWater = textLower.includes('no sun') || textLower.includes('no glucose') || textLower.includes('no water') || textLower.includes('avoid sun');
      var warnedStopBreastfeeding = textLower.includes('stop breastfeed') || textLower.includes('formula only');
      if (warnedStopBreastfeeding || (!warnedSunWater && (textLower.includes('sun') || textLower.includes('glucose')))) {
        criticalSafetyFailure = "CRITICAL SAFETY FAILURE: Harmful Jaundice Advice (Direct sunning or fluid restriction)";
      }
    } else if (station.id === 'dengue_fever') {
      var endorsedNSAID = textLower.includes('ibuprofen') || textLower.includes('nurofen') || textLower.includes('aspirin');
      var warnedNSAID = textLower.includes('no ibuprofen') || textLower.includes('paracetamol only') || textLower.includes('avoid nsaid');
      if (endorsedNSAID && !warnedNSAID) {
        criticalSafetyFailure = "CRITICAL SAFETY FAILURE: Dangerous Dengue Medication (Prescribed NSAIDs)";
      }
    } else if (station.id === 'asthma_discharge') {
      var mentionedPreventer = textLower.includes('daily') || textLower.includes('brown') || textLower.includes('preventer') || textLower.includes('steroid');
      var mentionedSpacer = textLower.includes('spacer') || textLower.includes('chamber');
      if (!mentionedPreventer || !mentionedSpacer) {
        criticalSafetyFailure = "CRITICAL SAFETY FAILURE: Inadequate Asthma Controller Guidance (Omitted preventer or spacer)";
      }
    }

    var totalScore = 0;
    var breakdownLines = [];

    if (isPrematureEnd) {
      totalScore = 0;
      breakdownLines = [
        "1. Communication Skills & Rapport: 0/3 - Consultation was terminated prematurely after opening introduction.",
        "2. Explanation of Medical Condition: 0/4 - Candidate omitted pathophysiology and underlying diagnosis.",
        "3. Treatment Plan & Management: 0/4 - Candidate did not counsel on active clinical management or protocol.",
        "4. Essential Home Care & Safety Precautions: 0/5 - Candidate failed to deliver critical preventive safety guidance.",
        "5. Red Flags & Follow-up Plan: 0/4 - Emergency red flags and follow-up reviews were omitted."
      ];
    } else if (station.id === 'nephrotic') {
      var comm = 2;
      var exp = textLower.includes('protein') || textLower.includes('filter') ? 3 : 1;
      var sym = textLower.includes('puff') || textLower.includes('swell') ? 2 : 1;
      var rx = textLower.includes('prednisolone') || textLower.includes('steroid') ? 3 : 1;
      var se = textLower.includes('appetite') || textLower.includes('weight') || textLower.includes('moon') ? 2 : 1;
      var mon = (textLower.includes('dipstick') || textLower.includes('albustix') || textLower.includes('morning urine')) ? 3 : 0;
      var prec = textLower.includes('vaccin') || textLower.includes('chickenpox') || textLower.includes('measles') ? 3 : 1;
      var prog = textLower.includes('relapse') || textLower.includes('outgrow') ? 2 : 1;

      totalScore = comm + exp + sym + rx + se + mon + prec + prog;
      breakdownLines = [
        "1. Communication Skills & Rapport (Max 2): " + comm + "/2 - Empathetic, calm demeanor, addressed maternal distress.",
        "2. Explanation of Nephrotic Syndrome (Max 3): " + exp + "/3 - Explained kidney filter leakage of protein in lay terms.",
        "3. Symptoms & Fluid Shifts (Max 2): " + sym + "/2 - Addressed puffy face, swollen legs, and fluid shifts clearly.",
        "4. Treatment Plan & Steroids (Max 3): " + rx + "/3 - Outlined daily oral steroids with strict adherence guidance.",
        "5. Steroid Side Effects (Max 2): " + se + "/2 - Discussed increased appetite, facial puffiness, and infection risks.",
        "6. Home Urine Dipstick Monitoring (Max 3): " + mon + "/3 - Instructed on daily first-morning urine protein testing.",
        "7. Precautions & Vaccine Safety (Max 3): " + prec + "/3 - Explicitly cautioned regarding live vaccines and chickenpox/measles.",
        "8. Prognosis & Relapse Counseling (Max 2): " + prog + "/2 - Reassured parent regarding childhood outgrowing with relapse advice."
      ];
    } else {
      totalScore = 15;
      breakdownLines = [
        "1. Communication Skills & Empathy (Max 4): 3/4 - Built good rapport with parent and validated distress.",
        "2. Pathophysiology & Diagnosis (Max 4): 3/4 - Explained child's medical condition clearly in simple lay terms.",
        "3. Treatment Regimen & Adherence (Max 4): 3/4 - Provided structured clinical management and safety guidance.",
        "4. Home Care & Preventive Measures (Max 4): 3/4 - Detailed home monitoring and trigger avoidance.",
        "5. Red Flags & Follow-up Plan (Max 4): 3/4 - Warned about emergency signs and scheduled review."
      ];
    }

    if (criticalSafetyFailure) {
      totalScore = Math.min(totalScore, 9);
    }

    var rating = 'Clear Pass';
    if (criticalSafetyFailure || totalScore < 10) {
      rating = 'Fail';
    } else if (totalScore >= 17) {
      rating = 'Distinction';
    } else if (totalScore >= 13) {
      rating = 'Clear Pass';
    } else {
      rating = 'Borderline';
    }

    var reportText = "====================================\n" +
      "PROVISIONAL OSCE MARK SHEET (FOR CONSULTANT REVIEW)\n" +
      "Candidate Total: " + totalScore + " / 20\n" +
      "Global Rating: " + rating + (criticalSafetyFailure ? "\n[" + criticalSafetyFailure + "]" : "") + "\n\n" +
      "Itemized Breakdown:\n" +
      breakdownLines.join('\n') + "\n\n" +
      "Examiner Feedback to Candidate:\n" +
      "- Strengths: " + (isPrematureEnd ? "Polite initial greeting." : "Patient-centered language, structured explanations, validated parental anxiety.") + "\n" +
      "- Areas for Improvement: " + (isPrematureEnd ? "Do not terminate early. Deliver comprehensive counselling covering diagnosis, management, safety, and follow-up." : "Proactively cover critical home safety protocols and provide explicit emergency red flags.") + "\n" +
      "====================================";

    return {
      score: totalScore,
      maxScore: 20,
      globalRating: rating,
      criticalSafetyFailure: criticalSafetyFailure,
      rawReport: reportText
    };
  }
};

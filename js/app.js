/**
 * Pediatric OSCE Simulator - Main Application Controller
 * Handles station state, timer, dialogue rendering, voice, and evaluation marksheet.
 */

(function() {
  var currentStationId = 'nephrotic';
  var isConsultationActive = false;
  var messages = [];
  var timeRemaining = 600; // 10 minutes
  var timerInterval = null;
  var hasAsked8MinQuestions = false;
  var autoPlayAudio = true;
  var voiceGender = 'female';
  var isListening = false;

  // DOM Elements
  var stationSelect = document.getElementById('stationSelect');
  var studentIdInput = document.getElementById('studentIdInput');
  var apiKeyInput = document.getElementById('apiKeyInput');
  var btnSaveKey = document.getElementById('btnSaveKey');
  var btnStartConsult = document.getElementById('btnStartConsult');
  var btnEndGrade = document.getElementById('btnEndGrade');
  var timerDisplay = document.getElementById('timerDisplay');
  var stationTitle = document.getElementById('stationTitle');
  var scenarioBrief = document.getElementById('scenarioBrief');
  var candidateTasks = document.getElementById('candidateTasks');
  var voiceGenderBtn = document.getElementById('voiceGenderBtn');
  var muteAudioBtn = document.getElementById('muteAudioBtn');
  var messagesContainer = document.getElementById('messagesContainer');
  var welcomePill = document.getElementById('welcomePill');
  var chatForm = document.getElementById('chatForm');
  var messageInput = document.getElementById('messageInput');
  var btnSend = document.getElementById('btnSend');
  var btnMicSpeak = document.getElementById('btnMicSpeak');
  var micRecordingBar = document.getElementById('micRecordingBar');
  var btnDoneMic = document.getElementById('btnDoneMic');
  var statusText = document.getElementById('statusText');

  function getCurrentStation() {
    return window.OSCE_STATIONS[currentStationId] || window.OSCE_STATIONS.nephrotic;
  }

  function setStatus(msg) {
    if (statusText) statusText.textContent = msg;
  }

  function formatTimer(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function updateStationUI() {
    var station = getCurrentStation();
    stationTitle.textContent = station.title;
    scenarioBrief.innerHTML = station.scenarioBrief;
    candidateTasks.textContent = station.candidateTasks;
    welcomePill.textContent = station.welcomeText;
    voiceGender = station.parentGender;
    voiceGenderBtn.textContent = (voiceGender === 'female' ? 'Natural Female (Puan Siti) 👩' : 'Natural Male 👨');
  }

  function startConsultation() {
    var studentId = studentIdInput.value.trim();
    if (!studentId) {
      setStatus('⚠️ Please enter your Student Name / ID to begin the station.');
      studentIdInput.focus();
      return;
    }

    window.OSCE_SPEECH.stopSpeaking();
    isConsultationActive = true;
    hasAsked8MinQuestions = false;
    messages = [];
    timeRemaining = 600;
    renderMessages();

    btnStartConsult.classList.add('consult-active');
    btnStartConsult.textContent = 'Consultation In Progress';
    btnEndGrade.disabled = false;

    welcomePill.textContent = '🟢 Consultation started (10:00). Dr. ' + studentId + ', please introduce yourself to ' + getCurrentStation().parentName + ' to begin.';
    setStatus('Consultation started. Please introduce yourself to ' + getCurrentStation().parentName + '.');

    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      if (timeRemaining > 0) {
        timeRemaining--;
        timerDisplay.textContent = formatTimer(timeRemaining);

        if (timeRemaining <= 120) {
          timerDisplay.classList.add('timer-danger');
        } else {
          timerDisplay.classList.remove('timer-danger');
        }

        // 8th-minute parental inquiry
        if (timeRemaining === 120 && !hasAsked8MinQuestions) {
          hasAsked8MinQuestions = true;
          var station = getCurrentStation();
          var unprompted = window.getUnaddressedParentQuestions(station.id, messages.map(function(m) { return m.text; }));
          if (unprompted) {
            messages.push({
              sender: 'parent',
              senderName: station.parentName,
              text: unprompted,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            renderMessages();
            if (autoPlayAudio) {
              window.OSCE_SPEECH.speak(unprompted, station.parentGender);
            }
          }
        }
      } else {
        clearInterval(timerInterval);
        endConsultation();
      }
    }, 1000);
  }

  function renderMessages() {
    // Keep welcome pill, remove previous messages
    var currentPill = welcomePill;
    messagesContainer.innerHTML = '';
    messagesContainer.appendChild(currentPill);

    messages.forEach(function(msg, idx) {
      var isCand = msg.sender === 'candidate';
      var isAssessor = msg.sender === 'assessor';

      var item = document.createElement('div');
      item.className = 'message-item ' + (isCand ? 'message-candidate' : (isAssessor ? 'message-assessor' : 'message-parent'));

      var header = document.createElement('div');
      header.className = 'message-header';

      var tag = document.createElement('span');
      tag.className = 'sender-tag ' + (isCand ? 'sender-candidate' : (isAssessor ? 'sender-assessor' : 'sender-parent'));
      tag.textContent = (isCand ? '👨‍⚕️ ' : (isAssessor ? '📋 ' : '👩/👨 ')) + msg.senderName;
      header.appendChild(tag);

      var time = document.createElement('span');
      time.textContent = '• ' + msg.timestamp;
      header.appendChild(time);
      item.appendChild(header);

      var bubble = document.createElement('div');
      bubble.className = 'bubble ' + (isCand ? 'bubble-candidate' : (isAssessor ? 'bubble-assessor' : 'bubble-parent'));
      bubble.textContent = msg.text;

      if (!isCand) {
        var replayBtn = document.createElement('button');
        replayBtn.className = 'btn-replay-audio';
        replayBtn.innerHTML = '🔊 Listen';
        replayBtn.onclick = function() {
          var gender = isAssessor ? 'male' : getCurrentStation().parentGender;
          window.OSCE_SPEECH.speak(msg.text, gender);
        };
        bubble.appendChild(document.createElement('br'));
        bubble.appendChild(replayBtn);
      }

      item.appendChild(bubble);
      messagesContainer.appendChild(item);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function handleSendMessage() {
    var text = messageInput.value.trim();
    if (!text) return;

    if (!isConsultationActive) {
      startConsultation();
      return;
    }

    window.OSCE_SPEECH.stopSpeaking();
    if (isListening) {
      window.OSCE_SPEECH.stopListening();
      isListening = false;
      micRecordingBar.style.display = 'none';
      btnMicSpeak.classList.remove('listening-active');
    }

    messageInput.value = '';
    var studentId = studentIdInput.value.trim() || 'Candidate';
    var station = getCurrentStation();

    // Candidate message
    messages.push({
      sender: 'candidate',
      senderName: 'Dr. ' + studentId,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderMessages();

    // Check for completion signal
    var lower = text.toLowerCase();
    var isSignallingCompletion = lower.includes('finished counselling') ||
                                 lower.includes('finished counseling') ||
                                 lower.includes('grade me') ||
                                 lower.includes('consultation complete');

    if (isSignallingCompletion) {
      endConsultation();
      return;
    }

    btnSend.disabled = true;
    setStatus(station.parentName + ' is responding...');

    var loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.textContent = station.parentName + ' is speaking...';
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
      var response = await window.OSCE_AI.sendMessage(station, messages, text);
      if (loadingDiv.parentNode) loadingDiv.parentNode.removeChild(loadingDiv);

      messages.push({
        sender: 'parent',
        senderName: station.parentName,
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderMessages();

      if (autoPlayAudio) {
        window.OSCE_SPEECH.speak(response.text, station.parentGender);
      }
      setStatus('Consultation active with ' + station.parentName);
    } catch (err) {
      if (loadingDiv.parentNode) loadingDiv.parentNode.removeChild(loadingDiv);
      console.error(err);
      setStatus('Ready.');
    } finally {
      btnSend.disabled = false;
    }
  }

  async function endConsultation() {
    clearInterval(timerInterval);
    isConsultationActive = false;
    window.OSCE_SPEECH.stopSpeaking();

    btnStartConsult.classList.remove('consult-active');
    btnStartConsult.textContent = 'Start Consultation';
    btnEndGrade.disabled = true;

    setStatus('Generating Consultant OSCE Mark Sheet...');

    var station = getCurrentStation();
    var evalResult = await window.OSCE_AI.generateEvaluation(station, messages, 'Consultation completed.');

    renderEvaluation(evalResult);
    setStatus('Evaluation complete: Score ' + evalResult.score + '/20 (' + evalResult.globalRating + ')');

    if (autoPlayAudio) {
      window.OSCE_SPEECH.speak('The consultation is complete. Here is your provisional OSCE mark sheet for consultant review.', 'male');
    }
  }

  function renderEvaluation(evalResult) {
    var reportCard = document.createElement('div');
    reportCard.className = 'report-card';

    var header = document.createElement('div');
    header.className = 'report-header';

    var title = document.createElement('div');
    title.className = 'report-title';
    title.textContent = 'PROVISIONAL OSCE MARK SHEET (FOR CONSULTANT REVIEW)';
    header.appendChild(title);

    var tools = document.createElement('div');
    tools.className = 'report-actions';

    var btnCopy = document.createElement('button');
    btnCopy.className = 'btn-report-tool';
    btnCopy.textContent = '📋 Copy';
    btnCopy.onclick = function() {
      navigator.clipboard.writeText(evalResult.rawReport);
      setStatus('Mark sheet copied to clipboard.');
      setTimeout(function() { setStatus('Ready.'); }, 2500);
    };
    tools.appendChild(btnCopy);

    var btnPrint = document.createElement('button');
    btnPrint.className = 'btn-report-tool';
    btnPrint.textContent = '🖨️ Print';
    btnPrint.onclick = function() { window.print(); };
    tools.appendChild(btnPrint);
    header.appendChild(tools);
    reportCard.appendChild(header);

    // Score Banner
    var banner = document.createElement('div');
    banner.className = 'score-banner';

    var scoreCol = document.createElement('div');
    scoreCol.className = 'score-col-left';
    scoreCol.innerHTML = '<span>Candidate Total</span><div class="total-score-value">' + evalResult.score + ' <span class="total-score-max">/ 20</span></div>';
    banner.appendChild(scoreCol);

    var ratingCol = document.createElement('div');
    var badgeClass = 'rating-fail';
    if (evalResult.globalRating === 'Distinction') badgeClass = 'rating-distinction';
    else if (evalResult.globalRating === 'Clear Pass') badgeClass = 'rating-pass';
    else if (evalResult.globalRating === 'Borderline') badgeClass = 'rating-borderline';

    ratingCol.innerHTML = '<span style="font-size:0.72rem;text-transform:uppercase;font-weight:700;color:#64748b;">Global Rating</span><div><span class="global-rating-badge ' + badgeClass + '">' + evalResult.globalRating + '</span></div>';
    banner.appendChild(ratingCol);
    reportCard.appendChild(banner);

    // Safety Alert if failed
    if (evalResult.criticalSafetyFailure) {
      var alertBox = document.createElement('div');
      alertBox.className = 'critical-safety-alert';
      alertBox.innerHTML = '<div class="safety-alert-title">⚠️ CRITICAL SAFETY FAILURE TRIGGERED (AUTO-FAIL)</div>' +
        '<div class="safety-alert-reason">' + evalResult.criticalSafetyFailure + '</div>' +
        '<div class="safety-alert-desc"><strong>OSCE Regulation:</strong> In clinical pediatric stations, patient safety breaches cap the score at a maximum of 9/20 and mandate an automatic Fail.</div>';
      reportCard.appendChild(alertBox);
    }

    var pre = document.createElement('pre');
    pre.className = 'report-pre';
    pre.textContent = evalResult.rawReport;
    reportCard.appendChild(pre);

    messagesContainer.appendChild(reportCard);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Event Listeners
  stationSelect.addEventListener('change', function(e) {
    currentStationId = e.target.value;
    clearInterval(timerInterval);
    isConsultationActive = false;
    btnStartConsult.classList.remove('consult-active');
    btnStartConsult.textContent = 'Start Consultation';
    btnEndGrade.disabled = true;
    timeRemaining = 600;
    timerDisplay.textContent = '10:00';
    timerDisplay.classList.remove('timer-danger');
    messages = [];
    renderMessages();
    updateStationUI();
    setStatus('Ready.');
  });

  btnStartConsult.addEventListener('click', startConsultation);
  btnEndGrade.addEventListener('click', endConsultation);

  btnSaveKey.addEventListener('click', function() {
    var k = apiKeyInput.value.trim();
    window.OSCE_AI.setApiKey(k);
    setStatus('Gemini API key saved in browser storage.');
    btnSaveKey.textContent = 'Saved';
    setTimeout(function() { btnSaveKey.textContent = 'Save'; }, 2000);
  });

  voiceGenderBtn.addEventListener('click', function() {
    voiceGender = voiceGender === 'female' ? 'male' : 'female';
    voiceGenderBtn.textContent = (voiceGender === 'female' ? 'Natural Female (Puan Siti) 👩' : 'Natural Male 👨');
  });

  muteAudioBtn.addEventListener('click', function() {
    autoPlayAudio = !autoPlayAudio;
    muteAudioBtn.textContent = autoPlayAudio ? '🔊' : '🔇';
    if (!autoPlayAudio) window.OSCE_SPEECH.stopSpeaking();
  });

  btnMicSpeak.addEventListener('click', function() {
    if (isListening) {
      window.OSCE_SPEECH.stopListening();
      isListening = false;
      micRecordingBar.style.display = 'none';
      btnMicSpeak.classList.remove('listening-active');
      btnMicSpeak.textContent = '🎤 Speak';
      return;
    }

    window.OSCE_SPEECH.stopSpeaking();
    var ok = window.OSCE_SPEECH.startListening(
      function(transcript) {
        messageInput.value = (messageInput.value ? messageInput.value + ' ' : '') + transcript;
        setStatus('Voice captured: "' + transcript + '"');
      },
      function(err) {
        setStatus('Microphone note: ' + err);
      },
      function(active) {
        isListening = active;
        if (active) {
          micRecordingBar.style.display = 'flex';
          btnMicSpeak.classList.add('listening-active');
          btnMicSpeak.textContent = 'Stop Mic';
          setStatus('🎙️ Recording... Speak clearly in Malaysian English, then click Stop or Send.');
        } else {
          micRecordingBar.style.display = 'none';
          btnMicSpeak.classList.remove('listening-active');
          btnMicSpeak.textContent = '🎤 Speak';
        }
      }
    );
  });

  btnDoneMic.addEventListener('click', function() {
    window.OSCE_SPEECH.stopListening();
    isListening = false;
    micRecordingBar.style.display = 'none';
    btnMicSpeak.classList.remove('listening-active');
    btnMicSpeak.textContent = '🎤 Speak';
  });

  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleSendMessage();
  });

  // Initialize
  var savedKey = window.OSCE_AI.getApiKey();
  if (savedKey) apiKeyInput.value = savedKey;
  updateStationUI();
  timerDisplay.textContent = formatTimer(timeRemaining);
})();

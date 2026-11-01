/**
 * Pediatric OSCE Simulator - 10 Clinical Stations
 * Adheres strictly to Zero-Clues Layperson Parent & Consultant 20-Mark Assessor Rubrics
 */

window.OSCE_STATIONS = {
  nephrotic: {
    id: "nephrotic",
    title: "Idiopathic Nephrotic Syndrome",
    childName: "Adam (4 years old)",
    parentName: "Puan Siti (Mother)",
    parentGender: "female",
    scenarioBrief: "You are a junior doctor in the pediatric ward. A 4-year-old boy, <strong>Adam</strong>, has been diagnosed with <strong>idiopathic nephrotic syndrome</strong> after presenting with marked facial puffiness, swollen legs, and heavy proteinuria. Your Consultant has asked you to inform Adam's mother about the diagnosis.",
    candidateTasks: "Introduce yourself, explain the diagnosis and how you are going to manage him.",
    welcomeText: "Puan Siti is sitting beside Adam's bed, looking very distressed. Enter your Name/ID and click 'Start Consultation' to begin your consultation.",
    openingGreeting: "Good morning doctor... yes, please. I've been waiting for Adam's test results. How is my boy doing, what did the tests show?",
    criticalSafetyRule: "Candidate must explicitly instruct daily morning urine dipstick monitoring for protein at home. Omission results in auto-fail cap of 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Communication Skills, Empathy & Rapport (2 marks)
- Explanation of Nephrotic Syndrome (leaking protein, kidney filters) (3 marks)
- Treatment Plan (Daily oral prednisolone/steroids, adherence, no abrupt stopping) (3 marks)
- Steroid Side Effects (appetite, cushingoid face, weight, infection risk) (3 marks)
- Home Monitoring (Explicit instructions on daily morning urine dipstick for protein) (3 marks)
- Precautions (NO live vaccines, avoid chickenpox/measles, seek prompt advice) (3 marks)
- Prognosis, Relapse counseling & Addressing Mother's fears (3 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate fails to explicitly instruct daily morning urine dipstick monitoring for protein at home, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Missed Daily Urine Protein Monitoring".`,
    offlineScript: {
      jargonKeywords: ["glomerular", "permeability", "hypoalbuminemia", "podocyte", "edema", "effacement"],
      jargonResponse: "Doctor, I don't understand those medical terms. Could you explain what that means in simple words?",
      stages: [
        {
          triggerKeywords: ["hello", "morning", "doctor", "dr", "results", "adam"],
          response: "Good morning, doctor. I've been waiting for his test results... why are his eyes and face so puffy?"
        },
        {
          triggerKeywords: ["nephrotic", "syndrome"],
          response: "Nephrotic syndrome? I've never heard of that before, doctor... what does that mean?"
        },
        {
          triggerKeywords: ["filter", "leak", "protein", "sponge", "holes"],
          response: "Leaking protein from his filters? Did I cause this, doctor? Did I give him too much salty food or MSG?"
        },
        {
          triggerKeywords: ["not your fault", "immune", "cause", "body", "idiopathic"],
          response: "What a relief to know I didn't cause it... So how do we stop this leaking from his kidneys?"
        },
        {
          triggerKeywords: ["prednisolone", "steroid", "medication", "medicine", "syrup"],
          response: "Prednisolone? Isn't that a steroid, doctor? I always heard steroids are very strong and dangerous for small children."
        },
        {
          triggerKeywords: ["side effect", "appetite", "weight", "swelling", "moon", "face", "growth", "taper", "gradual"],
          response: "I see... will his puffy eyes and face go back to normal once he starts the medicine?"
        },
        {
          triggerKeywords: ["monitoring", "check", "urine", "test", "home", "dipstick", "albustix"],
          response: "What kind of monitoring do you mean, doctor? What exactly will I have to do for him at home?"
        },
        {
          triggerKeywords: ["relapse", "remission", "come back", "outgrow", "future"],
          response: "Thank you doctor. Hearing that he can recover with proper care puts my heart at ease."
        }
      ],
      fallbackResponse: "I understand, doctor. Could you explain what we should do next for Adam?"
    }
  },

  febrile_convulsion: {
    id: "febrile_convulsion",
    title: "Febrile Convulsion Counseling",
    childName: "Aisyah (18 months old)",
    parentName: "Encik Razak (Father)",
    parentGender: "male",
    scenarioBrief: "You are a junior doctor in the pediatric assessment unit. An 18-month-old girl, <strong>Aisyah</strong>, has been diagnosed with a <strong>simple febrile seizure</strong> following a sudden viral fever spike. She is now playful and awake. Counsel her terrified father prior to discharge.",
    candidateTasks: "Explain febrile convulsions and what is expected in the future. Answer the questions from En Razak.",
    welcomeText: "Encik Razak is holding Aisyah tightly, looking shaken. Enter your Name/ID and click 'Start Consultation'.",
    openingGreeting: "Doctor, I thought my daughter was dying this morning... she was shaking and rolling her eyes. What happened to her?",
    criticalSafetyRule: "Candidate must explicitly warn against putting anything in the mouth during a seizure. Endorsing objects in mouth or daily anticonvulsants is an auto-fail cap of 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Empathy, Validating Parental Trauma & Rapport (3 marks)
- Explanation of Febrile Convulsion (Immature developing brain triggered by fever rise) (3 marks)
- Discarding Epilepsy & Brain Damage Myths (Normal development, outgrown by age 5-6) (3 marks)
- Acute Home First Aid Advice (Stay calm, recovery position on side, time the fit, clear hazards) (4 marks)
- What NOT to do (Strictly nothing in mouth, no spoon, do not restrain) (3 marks)
- Fever Comfort & Red Flags (Paracetamol for comfort not prevention, call 999 if fit > 5 mins) (4 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate endorses putting any object into the mouth, OR prescribes daily anti-epileptics for simple febrile seizure, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Unsafe Seizure Management".`,
    offlineScript: {
      jargonKeywords: ["epileptogenesis", "pyrexia", "generalized tonic-clonic", "encephalopathy"],
      jargonResponse: "Doctor, please speak plainly... I am just a terrified father. Did she suffer brain damage?",
      stages: [
        {
          triggerKeywords: ["terrifying", "scary", "frightening", "understand your worry", "safe now", "reassure"],
          response: "It truly was the most terrifying moment of our lives, doctor. But does this fit mean her brain is permanently damaged?"
        },
        {
          triggerKeywords: ["brain", "epilepsy", "normal", "outgrow", "immature", "fever spike", "temperature"],
          response: "Alhamdulillah, so her brain is intact. If she shakes again, should I put a cloth or spoon in her mouth so she doesn't bite her tongue?"
        },
        {
          triggerKeywords: ["never", "no spoon", "nothing in mouth", "choke", "injury", "harm"],
          response: "Okay, absolutely nothing in her mouth. Then what should I actually do if she has another fit at home?"
        },
        {
          triggerKeywords: ["side", "recovery position", "clear", "time", "clock", "5 minutes", "999", "ambulance"],
          response: "I understand, doctor. Hearing that we can keep her safe at home without panic gives me so much relief."
        }
      ],
      fallbackResponse: "Thank you for explaining, doctor. Will she have another seizure every time she catches a common fever?"
    }
  },

  asthma_discharge: {
    id: "asthma_discharge",
    title: "Asthma Discharge & Inhaler Technique",
    childName: "Wei Jian (6 years old)",
    parentName: "Madam Lim (Mother)",
    parentGender: "female",
    scenarioBrief: "You are a junior doctor in the pediatric ward. A 6-year-old boy, <strong>Wei Jian</strong>, is being discharged today following an admission for an <strong>acute exacerbation of bronchial asthma</strong>. Counsel his mother prior to discharge.",
    candidateTasks: "Explain asthma inflammation, differentiate reliever vs preventer inhalers, emphasize spacer technique, discuss trigger avoidance, and provide an asthma action plan.",
    welcomeText: "Madam Lim is packing Wei Jian's bag. Enter your Name/ID and click 'Start Consultation'.",
    openingGreeting: "Good morning doctor. We are preparing to go home, but I'm quite anxious about Wei Jian's breathing attacks returning. How do we keep him safe?",
    criticalSafetyRule: "Candidate must emphasize daily inhaled preventer steroids and using a spacer with the MDI. Omission caps score at 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Communication, Rapport & Active Listening (2 marks)
- Explaining Asthma Pathophysiology (Airway twitchiness, swelling, mucus) (3 marks)
- Differentiating Reliever (Blue/Salbutamol) vs Preventer (Brown/Inhaled Steroid) (4 marks)
- Emphasizing Daily Preventer Adherence even when asymptomatic (3 marks)
- Explaining MDI with Spacer technique (Tidal breathing / 5-10 breaths per puff) (4 marks)
- Trigger Avoidance & Asthma Action Plan / Red Flags (4 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate fails to instruct daily adherence to inhaled steroids, OR fails to emphasize using a spacer with the MDI, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Inadequate Asthma Controller Guidance".`,
    offlineScript: {
      jargonKeywords: ["bronchoconstriction", "hyperresponsiveness", "eosinophilic", "spirometry"],
      jargonResponse: "Doctor, those terms sound very complex. Can you explain simply what is happening to Wei Jian's airways?",
      stages: [
        {
          triggerKeywords: ["swelling", "airway", "twitchy", "sensitive", "tubes", "narrow"],
          response: "So his air pipes are sensitive and swollen. But the clinic gave us two different colored puffers. What is each one for?"
        },
        {
          triggerKeywords: ["blue", "brown", "reliever", "preventer", "salbutamol", "steroid", "daily"],
          response: "Doctor, using the brown steroid puffer every single day sounds scary. Won't it stunt his growth or make him addicted?"
        },
        {
          triggerKeywords: ["low dose", "lungs directly", "safe", "growth", "spacer", "mouth rinse"],
          response: "That's reassuring that it acts right on the lungs without affecting his growth. If he feels completely well next week, can I stop the brown puffer?"
        },
        {
          triggerKeywords: ["continue", "every day", "do not stop", "prevent", "adherence"],
          response: "Understood, keep going even when he feels fine. But he's only 6 years old, can he really take the puffer directly on his own?"
        }
      ],
      fallbackResponse: "Thank you doctor. Can he still participate in PE sports at primary school?"
    }
  },

  neonatal_jaundice: {
    id: "neonatal_jaundice",
    title: "Neonatal Jaundice Phototherapy",
    childName: "Baby Kavitha (3 days old)",
    parentName: "Mrs. Letchumi (Mother)",
    parentGender: "female",
    scenarioBrief: "You are a junior doctor in the neonatal nursery. A 3-day-old term female infant, <strong>Baby Kavitha</strong>, has physiological jaundice with a serum bilirubin level in the phototherapy range. Counsel her anxious first-time mother.",
    candidateTasks: "Explain physiological jaundice, the purpose and safety of phototherapy, breastfeeding frequency, and address traditional myths.",
    welcomeText: "Mrs. Letchumi is looking tearful looking at Kavitha in the incubator with eye patches. Enter your Name/ID and start consultation.",
    openingGreeting: "Doctor, why does my poor baby have a blindfold on under those blue lights? Is her liver damaged?",
    criticalSafetyRule: "Candidate must explicitly warn AGAINST direct sunning and plain/glucose water, and encourage frequent breastfeeding. Advising sunning or stopping breastfeeding is an auto-fail cap of 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Empathy, Validation of Maternal Guilt & Rapport (3 marks)
- Explanation of Physiological Jaundice (Normal RBC breakdown, immature liver) (3 marks)
- Phototherapy Mechanism & Safety (Blue light converts bilirubin, eye patches protect retina) (4 marks)
- Frequent Breastfeeding & Hydration (Feed 2-3 hourly, excreted in stools) (4 marks)
- Discarding Harmful Myths (Strictly no direct sunning, no glucose water) (3 marks)
- Phototherapy Side Effects & Monitoring (Loose stools, tanning, hydration) (3 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate advises direct sunning, recommends giving plain or glucose water, or advises stopping breastfeeding, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Harmful Neonatal Jaundice Advice".`,
    offlineScript: {
      jargonKeywords: ["isomerization", "kernicterus", "glucuronyl", "enterohepatic"],
      jargonResponse: "Doctor, those medical terms make me so worried. Is my baby going to be okay?",
      stages: [
        {
          triggerKeywords: ["red blood", "breakdown", "liver", "immature", "normal", "bilirubin", "yellow"],
          response: "So her little liver is just taking a few days to catch up. But why the blindfold under those blue lamps?"
        },
        {
          triggerKeywords: ["blue light", "eye", "patch", "protect", "retina", "safe", "convert", "stool"],
          response: "My mother-in-law told me I should just bring her out to the porch for direct morning sun and give her glucose water. Should I do that?"
        },
        {
          triggerKeywords: ["no sun", "sunburn", "no glucose", "breastfeed", "milk", "hydrate", "frequent"],
          response: "I'm so glad I asked you first, doctor. How often should I nurse her while she is under the lamps?"
        }
      ],
      fallbackResponse: "Thank you doctor. I feel much more confident caring for Kavitha now."
    }
  },

  dengue_fever: {
    id: "dengue_fever",
    title: "Dengue Fever Home Monitoring",
    childName: "Danish (10 years old)",
    parentName: "Puan Zainab (Mother)",
    parentGender: "female",
    scenarioBrief: "You are a medical officer in the pediatric clinic. A 10-year-old boy, <strong>Danish</strong>, is on Day 3 of laboratory-confirmed dengue fever without warning signs. Counsel his mother on home care, hydration, danger signs, and critical phase monitoring.",
    candidateTasks: "Counsel on oral hydration, fever management (paracetamol only, NO NSAIDs), recognize the critical phase (defervescence), and educate on warning signs requiring immediate emergency return.",
    welcomeText: "Puan Zainab looks tired and anxious about Danish's high fever. Enter your Name/ID and start consultation.",
    openingGreeting: "Doctor, Danish's fever has been burning up to 39.5 degrees for 3 days. Can I give him stronger painkillers from the pharmacy?",
    criticalSafetyRule: "Candidate must explicitly warn AGAINST NSAIDs (ibuprofen/mefenamic acid) due to bleeding risk and explain critical phase warning signs. Omitting warning signs or endorsing NSAIDs caps score at 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Communication, Rapport & Reassurance (2 marks)
- Explanation of Dengue Clinical Phases (Febrile, Critical, Recovery) (3 marks)
- Fluid Management & Oral Hydration (ORS, juices, soup, urine output) (4 marks)
- Strict Medication Safety (Paracetamol ONLY, strictly NO NSAIDs/Ibuprofen) (4 marks)
- Educating on Critical Warning Signs (Abdominal pain, vomiting, bleeding, lethargy, cold clammy extremities) (4 marks)
- Daily Blood Monitoring & Follow-up Plan (3 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate endorses ibuprofen/aspirin/NSAIDs, OR fails to counsel on critical warning signs of plasma leakage/shock, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Dangerous Dengue Management".`,
    offlineScript: {
      jargonKeywords: ["plasma leakage", "hematocrit", "defervescence", "thrombocytopenia", "vascular"],
      jargonResponse: "Doctor, please explain in simple words... I'm worried he might bleed or collapse.",
      stages: [
        {
          triggerKeywords: ["paracetamol", "no nsaid", "ibuprofen", "bleeding", "stomach", "safe"],
          response: "Okay, absolutely no ibuprofen or strong painkillers. What fluids should I be giving him at home?"
        },
        {
          triggerKeywords: ["fluids", "ors", "juice", "soup", "hydration", "urine", "pee"],
          response: "I will make sure he drinks plenty. When his fever finally breaks, does that mean he is completely out of danger?"
        },
        {
          triggerKeywords: ["critical", "leak", "warning", "watch", "danger", "worst", "shock"],
          response: "So when the fever drops is actually the most dangerous time! What emergency warning signs should make me rush him back?"
        }
      ],
      fallbackResponse: "Thank you doctor. We will monitor his fluids closely and watch out for those danger signs."
    }
  },

  hfmd: {
    id: "hfmd",
    title: "Hand, Foot, and Mouth Disease (HFMD)",
    childName: "Lucas (3 years old)",
    parentName: "Mr. Chen (Father)",
    parentGender: "male",
    scenarioBrief: "You are a medical officer in the pediatric clinic. A 3-year-old boy, <strong>Lucas</strong>, has been diagnosed with <strong>Hand, Foot, and Mouth Disease (HFMD)</strong>. Counsel his father on home supportive care, pain relief, hydration, infection control, and neurological red flags.",
    candidateTasks: "Explain HFMD etiology, relief for painful mouth ulcers, hydration strategies, mandatory quarantine, and teach parents neurological danger signs.",
    welcomeText: "Mr. Chen is holding Lucas, who is crying due to painful mouth ulcers. Enter your Name/ID and start consultation.",
    openingGreeting: "Good morning doctor. Lucas has painful sores all over his mouth and palms. He refuses to drink any milk. Is this HFMD?",
    criticalSafetyRule: "Candidate must instruct on neurological red flags (startle jerks, vomiting, unsteady gait) and infection quarantine. Omission results in auto-fail cap of 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Empathy & Rapport with Father (2 marks)
- Explanation of HFMD (Viral infection, enterovirus/coxsackie, self-limiting) (3 marks)
- Pain Management & Oral Ulcer Care (Analgesia, soothing cold fluids, avoid acidic food) (4 marks)
- Hydration Strategies to Prevent Dehydration (Small frequent sips, ice chips, popsicles) (4 marks)
- Quarantine & Transmission Prevention (Keep home until blisters dry, hand hygiene) (3 marks)
- Educating on Neurological & Cardiorespiratory Red Flags (Myoclonic jerks, persistent vomiting, drowsiness, shortness of breath) (4 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate fails to warn about neurological red flags (startle jerks/drowsiness) or fails to mandate home quarantine, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Inadequate HFMD Safety Guidance".`,
    offlineScript: {
      jargonKeywords: ["enterovirus 71", "encephalomyelitis", "exanthem", "enanthem"],
      jargonResponse: "Doctor, those names sound intimidating. Is Lucas going to have long-term complications?",
      stages: [
        {
          triggerKeywords: ["mouth", "ulcer", "pain", "paracetamol", "cold", "ice", "soft", "bland"],
          response: "So giving cold fluids and ice popsicles will help soothe his throat. What about his kindergarten? Can he go back once fever stops?"
        },
        {
          triggerKeywords: ["quarantine", "stay home", "infectious", "kindergarten", "school", "blisters dry", "peel"],
          response: "Understood, he will stay home until all spots dry up. Are there any severe complications I need to watch out for?"
        },
        {
          triggerKeywords: ["jerk", "startle", "drowsy", "vomit", "brain", "neurological", "emergency", "red flag"],
          response: "Startle jerks and severe drowsiness... I will watch him like a hawk. Thank you for making that so clear doctor."
        }
      ],
      fallbackResponse: "Thank you doctor. How do we prevent his baby sister at home from catching this?"
    }
  },

  bronchiolitis: {
    id: "bronchiolitis",
    title: "Acute Bronchiolitis Counseling",
    childName: "Haris (6 months old)",
    parentName: "Encik Kamal (Father)",
    parentGender: "male",
    scenarioBrief: "You are a house officer in the pediatric ward. A 6-month-old infant boy, <strong>Haris</strong>, has been admitted with <strong>acute viral bronchiolitis</strong> with chest recession, wheezing, and reduced feeding. Counsel his concerned father.",
    candidateTasks: "Explain viral bronchiolitis, justify withholding antibiotics/steroids/inhalers, explain supportive care (nasal suction, small frequent feeds, oxygen), and counsel on expected disease trajectory.",
    welcomeText: "Encik Kamal is watching Haris's chest moving rapidly with concern. Enter your Name/ID and start consultation.",
    openingGreeting: "Doctor, his chest is rattling and he's breathing so fast. Why haven't the nurses started him on antibiotics or a nebulizer yet?",
    criticalSafetyRule: "Candidate must explain that bronchiolitis is viral (antibiotics and steroids are not indicated) and counsel on respiratory distress red flags. Inappropriate antibiotic prescription caps score at 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Rapport, Empathy & Validating Paternal Worry (3 marks)
- Explanation of Bronchiolitis Pathophysiology (Viral infection of small breathing tubes, mucus plugging) (3 marks)
- Rational Management & Evidence-Based Restraint (Why antibiotics, steroids and bronchodilators are not recommended) (4 marks)
- Supportive Hospital & Home Care (Nasal saline drops, small frequent feeds, hydration) (4 marks)
- Disease Trajectory & Natural Course (Peaks on Day 3-5, cough lasts 2-3 weeks) (3 marks)
- Red Flags for Worsening (Apnea, grunting, poor feeding < 50%, exhaustion) (3 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate prescribes antibiotics, systemic steroids, or bronchodilators without clinical rationale, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Inappropriate Medical Therapy in Bronchiolitis".`,
    offlineScript: {
      jargonKeywords: ["respiratory syncytial", "hyperinflation", "subcostal retractions", "atelectasis"],
      jargonResponse: "Doctor, please explain what that means... I just see him struggling to catch his breath.",
      stages: [
        {
          triggerKeywords: ["viral", "virus", "small tubes", "bronchioles", "swelling", "mucus"],
          response: "So it's a virus in his tiny airways. But if it's an infection, why can't he just have antibiotics to cure it quickly?"
        },
        {
          triggerKeywords: ["antibiotics don't work", "viral not bacterial", "supportive", "suction", "feeding", "oxygen"],
          response: "I see, antibiotics won't help a virus. How long will he keep struggling to breathe like this before he gets better?"
        },
        {
          triggerKeywords: ["peak", "day 3", "day 5", "trajectory", "2-3 weeks", "gradual"],
          response: "It peaks around day 3 to 5 and then improves... What danger signs would mean he is getting exhausted?"
        }
      ],
      fallbackResponse: "Thank you doctor. We will stay by his cot and watch him closely."
    }
  },

  gastroenteritis: {
    id: "gastroenteritis",
    title: "Acute Gastroenteritis (AGE)",
    childName: "Mei Ling (2 years old)",
    parentName: "Madam Wong (Mother)",
    parentGender: "female",
    scenarioBrief: "You are a medical officer in the outpatient department. A 2-year-old girl, <strong>Mei Ling</strong>, has <strong>acute gastroenteritis</strong> with mild dehydration. Counsel her mother regarding oral rehydration therapy, continuing feeds, and red flags.",
    candidateTasks: "Counsel on Oral Rehydration Salts (ORS) technique, advise against anti-diarrheal medications, recommend continuing normal diet, and outline dehydration warning signs.",
    welcomeText: "Madam Wong is carrying Mei Ling, who looks tired with diarrhea diapers. Enter your Name/ID and start consultation.",
    openingGreeting: "Doctor, Mei Ling has had watery diarrhea 6 times today and vomits whenever she drinks. Can you give her medicine to stop the diarrhea immediately?",
    criticalSafetyRule: "Candidate must explicitly prohibit anti-motility drugs (e.g. Lomotil/loperamide) in young children and teach proper ORS technique. Prescribing anti-motility agents results in an auto-fail cap of 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Communication, Empathy & Active Listening (2 marks)
- Explanation of Gastroenteritis (Viral stomach bug, gut lining shedding) (3 marks)
- Explicit Proscription of Anti-diarrheal Drugs (No Lomotil/Imodium - risks toxic megacolon/ileus) (4 marks)
- Oral Rehydration Salts (ORS) Technique (Small frequent sips: 5ml every 1-2 mins, spoon/syringe) (4 marks)
- Nutritional Management (Continue breast/formula milk without dilution, bland diet) (3 marks)
- Recognition of Severe Dehydration & Red Flags (Sunken eyes, no tears, lethargy, no wet diaper in 6h) (4 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate prescribes anti-motility drugs (loperamide/diphenoxylate), OR fails to counsel on oral rehydration therapy, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Dangerous Gastroenteritis Management".`,
    offlineScript: {
      jargonKeywords: ["enterocyte", "osmotic", "secretory", "electrolyte imbalance"],
      jargonResponse: "Doctor, I don't understand those medical terms. Can you tell me simply how to stop her vomiting?",
      stages: [
        {
          triggerKeywords: ["no anti-diarrheal", "no lomotil", "harmful", "toxic", "flush out", "virus"],
          response: "Okay, no anti-diarrheal syrups. But every time I give her a cup of water, she vomits it straight back up. How do I get fluids into her?"
        },
        {
          triggerKeywords: ["small", "frequent", "spoon", "syringe", "5ml", "sips", "ors", "wait"],
          response: "Small spoonfuls every couple of minutes... that makes so much sense. Should I dilute her milk formula with extra water so it's easier on her stomach?"
        },
        {
          triggerKeywords: ["do not dilute", "full strength", "normal", "calories", "nutrition"],
          response: "Got it, keep milk at normal strength. How will I know if she is becoming severely dehydrated at home?"
        }
      ],
      fallbackResponse: "Thank you doctor. That really reassures me that we can manage her recovery at home."
    }
  },

  thalassemia: {
    id: "thalassemia",
    title: "Beta-Thalassemia Major Counseling",
    childName: "Harith (8 months old)",
    parentName: "Encik Tariq (Father)",
    parentGender: "male",
    scenarioBrief: "You are a pediatric medical officer. An 8-month-old boy, <strong>Harith</strong>, has been confirmed on hemoglobin analysis to have <strong>Beta-Thalassemia Major</strong> with severe anemia and hepatosplenomegaly. Counsel his father regarding the diagnosis and lifelong management plan.",
    candidateTasks: "Explain Beta-Thalassemia Major pathophysiology, explain lifelong monthly blood transfusions, iron chelation therapy to prevent iron overload, and the need for family screening.",
    welcomeText: "Encik Tariq is holding the Hb electrophoresis report, looking confused. Enter your Name/ID and start consultation.",
    openingGreeting: "Good morning doctor. The clinic referred us here because Harith is so pale and not growing. What did his blood test show?",
    criticalSafetyRule: "Candidate must explain regular blood transfusions AND iron chelation therapy for iron overload, and counsel on family screening. Omitting iron chelation caps score at 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Breaking Difficult News Empathetically & Building Trust (3 marks)
- Explanation of Beta-Thalassemia Major (Genetic inability to make normal hemoglobin, fragile red cells) (3 marks)
- Management Plan: Regular Blood Transfusions (Every 3-4 weeks to sustain growth) (4 marks)
- Complication & Chelation: Iron Overload (Excess iron damages heart/liver, daily chelation therapy needed) (4 marks)
- Family Screening & Genetic Counseling (Both parents are carriers, screen siblings and future pregnancies) (3 marks)
- Long-term Outlook & Multidisciplinary Support (Normal life with good chelation, curative bone marrow transplant) (3 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate fails to counsel on iron chelation therapy/iron overload, OR advises iron supplements for thalassemia anemia, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Omission of Iron Chelation / Unsafe Iron Advice".`,
    offlineScript: {
      jargonKeywords: ["erythropoiesis", "hemoglobinopathy", "hemosiderosis", "splenomegaly"],
      jargonResponse: "Doctor, please speak plainly... Is this a form of blood cancer?",
      stages: [
        {
          triggerKeywords: ["thalassemia", "hemoglobin", "carrier", "inherited", "genetic", "not cancer"],
          response: "Alhamdulillah it is not cancer, but genetic. How will we treat him so he can grow normally like other babies?"
        },
        {
          triggerKeywords: ["transfusion", "blood", "monthly", "3-4 weeks", "regular"],
          response: "Blood transfusions every month for life? Won't getting all that blood cause other complications in his body?"
        },
        {
          triggerKeywords: ["iron", "overload", "chelation", "heart", "liver", "medication", "pump", "deferasirox"],
          response: "So the medicine removes excess iron to protect his organs. Does this mean my wife and I carry this trait too?"
        }
      ],
      fallbackResponse: "Thank you doctor. Hearing about bone marrow transplant gives our family hope for the future."
    }
  },

  g6pd: {
    id: "g6pd",
    title: "G6PD Deficiency Counseling",
    childName: "Baby Sanjay (2 days old)",
    parentName: "Mr. Ramesh (Father)",
    parentGender: "male",
    scenarioBrief: "You are a pediatric house officer in the postnatal ward. A 2-day-old male newborn, <strong>Baby Sanjay</strong>, has tested positive for <strong>Glucose-6-Phosphate Dehydrogenase (G6PD) deficiency</strong> on routine cord blood screening. Counsel his father prior to discharge.",
    candidateTasks: "Explain G6PD deficiency, explain trigger avoidance (fava beans, mothballs/naphthalene, certain medications), teach signs of acute hemolysis (dark tea-colored urine, pallor, jaundice), and provide reassurance.",
    welcomeText: "Mr. Ramesh is looking at the pink newborn screening alert card. Enter your Name/ID and start consultation.",
    openingGreeting: "Doctor, the nurse handed me this pink card saying Sanjay has G6PD deficiency. Is my baby born disabled?",
    criticalSafetyRule: "Candidate must instruct on avoiding mothballs (naphthalene) and fava beans, and recognize acute dark tea-colored urine as an emergency. Omission results in auto-fail cap of 9/20.",
    examinerCriteria: `Marking criteria (Total 20 marks):
- Empathy & Firm Reassurance (Child is completely healthy and normal day-to-day) (3 marks)
- Explanation of G6PD Enzyme (Enzyme that protects red blood cells from oxidative stress) (3 marks)
- Prohibited Foods & Substances (STRICTLY NO fava beans/kacang parang, NO mothballs/naphthalene, beware traditional herbs) (4 marks)
- Medication Safety Card (Always alert doctors/pharmacists, avoid sulfa drugs/dapsone/primaquine) (3 marks)
- Emergency Red Flags for Acute Hemolysis (Sudden pallor, jaundice spike, dark tea/coca-cola colored urine) (4 marks)
- Genetics & Normal Lifespan (X-linked inheritance, normal life and athletic capacity) (3 marks)

CRITICAL SAFETY CHECK (AUTO-FAIL): If candidate fails to counsel on mothball (naphthalene) and fava bean avoidance, OR ignores acute dark urine as an emergency red flag, cap score at 9/20 and output "CRITICAL SAFETY FAILURE: Inadequate G6PD Safety Guidance".`,
    offlineScript: {
      jargonKeywords: ["oxidative stress", "hemolysis", "x-linked recessive", "glutathione"],
      jargonResponse: "Doctor, those are big words. Is Sanjay going to be sick all the time?",
      stages: [
        {
          triggerKeywords: ["healthy", "normal", "enzyme", "shield", "protect", "red blood"],
          response: "What a relief that he is healthy and normal. What triggers must we make sure he never comes into contact with?"
        },
        {
          triggerKeywords: ["fava", "kacang parang", "mothball", "naphthalene", "ubat gegat", "herbs"],
          response: "No mothballs in his clothes and no fava beans. If he accidentally breathes in mothballs, how will we know he is having a reaction?"
        },
        {
          triggerKeywords: ["dark urine", "tea", "coca-cola", "pale", "pallor", "yellow", "jaundice", "rush"],
          response: "Dark tea-colored urine and sudden paleness... We will bring him straight to the emergency department if that ever happens."
        }
      ],
      fallbackResponse: "Thank you doctor. That is very reassuring and clear."
    }
  }
};

/**
 * 8th Minute Late-Station Parental Inquiry Logic
 * Only triggers if essential clinical items were not proactively taught by candidate
 */
window.getUnaddressedParentQuestions = function(stationId, messages) {
  var fullText = (messages || []).join(' ').toLowerCase();

  if (stationId === 'nephrotic') {
    var addressedVaccine = fullText.includes('vaccin') || fullText.includes('chickenpox') || fullText.includes('measles');
    var addressedDipstick = fullText.includes('dipstick') || fullText.includes('albustix') || fullText.includes('urine');
    var addressedRelapse = fullText.includes('relapse') || fullText.includes('come back') || fullText.includes('outgrow');
    if (!addressedVaccine || !addressedDipstick || !addressedRelapse) {
      return "Doctor, can I ask you a couple of things I'm still really anxious about... What are things that Adam needs to avoid? Also, how will I know if he is getting the disease again ?";
    }
  } else if (stationId === 'febrile_convulsion') {
    var addressedFirstAid = fullText.includes('side') || fullText.includes('recovery') || fullText.includes('mouth');
    var addressedEpilepsy = fullText.includes('epilepsy') || fullText.includes('brain damage') || fullText.includes('outgrow');
    if (!addressedFirstAid || !addressedEpilepsy) {
      return "Doctor, can I ask you... if she starts shaking again at home, what is the safest thing for me to do? And does this mean her brain is permanently damaged?";
    }
  } else if (stationId === 'asthma_discharge') {
    var addressedSpacer = fullText.includes('spacer') || fullText.includes('chamber');
    var addressedActivity = fullText.includes('sport') || fullText.includes('exercise') || fullText.includes('play');
    if (!addressedSpacer || !addressedActivity) {
      return "Doctor, he's only 6 years old... how can I be sure the medicine is actually getting into his lungs properly? And can he still run and play sports in school?";
    }
  } else if (stationId === 'neonatal_jaundice') {
    var addressedFeeding = fullText.includes('breastfeed') || fullText.includes('feed') || fullText.includes('water') || fullText.includes('sun');
    if (!addressedFeeding) {
      return "Doctor, is there anything special I should do at home like sunning her or giving extra water, or will feeding alone be enough?";
    }
  } else if (stationId === 'dengue_fever') {
    var addressedWarning = fullText.includes('warning') || fullText.includes('danger') || fullText.includes('leakage') || fullText.includes('bleed');
    var addressedMeds = fullText.includes('nsaid') || fullText.includes('ibuprofen') || fullText.includes('paracetamol');
    if (!addressedWarning || !addressedMeds) {
      return "Doctor, his fever is so high—can I give him anything stronger from the pharmacy to bring it down faster? And how will I know if he is getting worse once the fever drops?";
    }
  } else if (stationId === 'hfmd') {
    var addressedQuarantine = fullText.includes('quarantine') || fullText.includes('kindergarten') || fullText.includes('school');
    var addressedRedFlags = fullText.includes('jerk') || fullText.includes('startle') || fullText.includes('danger');
    if (!addressedQuarantine || !addressedRedFlags) {
      return "Doctor, if his fever resolves in a couple of days, is it safe for him to go back to kindergarten? And what danger signs should make me rush him back?";
    }
  } else if (stationId === 'bronchiolitis') {
    var addressedAntibiotics = fullText.includes('antibiotic') || fullText.includes('viral') || fullText.includes('virus');
    var addressedCourse = fullText.includes('peak') || fullText.includes('day 3') || fullText.includes('trajectory');
    if (!addressedAntibiotics || !addressedCourse) {
      return "Doctor, why can't he just have antibiotics to cure his rattling chest? And how long will he keep struggling to breathe before he turns the corner?";
    }
  } else if (stationId === 'gastroenteritis') {
    var addressedHydration = fullText.includes('spoon') || fullText.includes('syringe') || fullText.includes('sips');
    var addressedMilk = fullText.includes('milk') || fullText.includes('dilute') || fullText.includes('formula');
    if (!addressedHydration || !addressedMilk) {
      return "Doctor, she vomits whenever she drinks a full cup. How can I give her fluids without her throwing up? And should I dilute her milk formula?";
    }
  } else if (stationId === 'thalassemia') {
    var addressedIron = fullText.includes('chelation') || fullText.includes('iron') || fullText.includes('transfusion');
    var addressedFamily = fullText.includes('family') || fullText.includes('screen') || fullText.includes('carrier');
    if (!addressedIron || !addressedFamily) {
      return "Doctor, is there anything special we need to avoid giving him at home? And what does this diagnosis mean for the rest of our family?";
    }
  } else if (stationId === 'g6pd') {
    var addressedTriggers = fullText.includes('fava') || fullText.includes('kacang parang') || fullText.includes('mothball') || fullText.includes('naphthalene');
    var addressedLifelong = fullText.includes('lifelong') || fullText.includes('permanent') || fullText.includes('outgrow');
    if (!addressedTriggers || !addressedLifelong) {
      return "Doctor, are there any common household items or foods we must never let him touch? And will he carry this blood condition for life?";
    }
  }
  return null;
};

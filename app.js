let ACTIVE_MODEL = localStorage.getItem("gemini_selected_model") || "gemini-3.8-flash";

        function initModelSelector() {
            const modelSelect = document.getElementById("model-select");
            const customInput = document.getElementById("custom-model-input");
            if (!modelSelect) return;
            const known = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest", "gemini-4-argon"];
            if (known.includes(ACTIVE_MODEL)) {
                modelSelect.value = ACTIVE_MODEL;
                if (customInput) customInput.style.display = "none";
            } else {
                modelSelect.value = "custom";
                if (customInput) {
                    customInput.style.display = "inline-block";
                    customInput.value = ACTIVE_MODEL;
                }
            }
        }

        function onModelSelected(val) {
            const customInput = document.getElementById("custom-model-input");
            if (val === "custom") {
                if (customInput) {
                    customInput.style.display = "inline-block";
                    customInput.focus();
                    if (customInput.value.trim()) {
                        ACTIVE_MODEL = customInput.value.trim();
                        localStorage.setItem("gemini_selected_model", ACTIVE_MODEL);
                    }
                }
            } else {
                if (customInput) customInput.style.display = "none";
                ACTIVE_MODEL = val;
                localStorage.setItem("gemini_selected_model", ACTIVE_MODEL);
                const statusEl = document.getElementById("status-text");
                if (statusEl) statusEl.innerText = "Active model set to: " + ACTIVE_MODEL;
            }
        }

        function onCustomModelInput(val) {
            const trimmed = val.trim();
            if (trimmed) {
                ACTIVE_MODEL = trimmed;
                localStorage.setItem("gemini_selected_model", ACTIVE_MODEL);
            }
        }

        let currentStation = null;
        let isExamMode = false;
        let apiKey = localStorage.getItem('gemini_api_key') || '';
        let storedCandidateId = localStorage.getItem('osce_candidate_id') || '';
        let consultationSeconds = 600;
        let timerInterval = null;
        let hasStarted = false;
        let isRecording = false;
        let recognition = null;
        let conversationHistory = [];
        let accumulatedSpeech = '';

        const safetySettings = [
            {category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE"},
            {category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE"},
            {category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE"},
            {category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE"}
        ];

        // UNIVERSAL URL SCANNER (Scans full browser URL for matching station)
        function detectAssignedStation() {
            const full = (window.location.href + " " + window.location.search + " " + window.location.hash).toLowerCase();

            if (full.includes('dengue')) return 'dengue_fever';
            if (full.includes('febrile') || full.includes('seizure') || full.includes('convulsion')) return 'febrile_convulsion';
            if (full.includes('asthma')) return 'asthma_discharge';
            if (full.includes('nnj') || full.includes('jaundice')) return 'neonatal_jaundice';
            if (full.includes('hfmd')) return 'hfmd';
            if (full.includes('bronch')) return 'bronchiolitis';
            if (full.includes('gastro') || full.includes('age') || full.includes('diarrhea')) return 'gastroenteritis';
            if (full.includes('thal')) return 'thalassemia';
            if (full.includes('g6pd')) return 'g6pd';
            if (full.includes('nephrotic')) return 'nephrotic';

            return null; // Practice mode
        }

        window.onload = () => {
            initModelSelector();
            if (!window.OSCE_STATIONS || Object.keys(window.OSCE_STATIONS).length === 0) {
                document.getElementById('status-text').innerText = "Error: stations.js failed to load. Ensure stations.js is in the root directory.";
                return;
            }

            const idInput = document.getElementById('candidate-id');
            if (storedCandidateId && idInput) idInput.value = storedCandidateId;

            const select = document.getElementById('station-select');
            select.innerHTML = '';
            for (const key in window.OSCE_STATIONS) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = window.OSCE_STATIONS[key].title;
                select.appendChild(opt);
            }

            // Detect if student was sent a direct station link
            const matchedKey = detectAssignedStation();

            if (matchedKey && window.OSCE_STATIONS[matchedKey]) {
                // --- EXAM LOCK MODE ENGAGED ---
                isExamMode = true;
                select.style.display = "none"; // Hide dropdown completely

                const banner = document.getElementById('exam-lock-banner');
                banner.style.display = "inline-block";
                document.getElementById('locked-station-name').innerText = window.OSCE_STATIONS[matchedKey].title;

                loadStation(matchedKey);
            } else {
                // --- PRACTICE MODE (Dropdown active) ---
                isExamMode = false;
                select.style.display = "inline-block";
                document.getElementById('exam-lock-banner').style.display = "none";
                const defaultKey = Object.keys(window.OSCE_STATIONS)[0];
                select.value = defaultKey;
                loadStation(defaultKey);
            }

            setupSpeechRecognition();
        };

        function onStationChanged(stationKey) {
            if (isExamMode) return;
            if (hasStarted) {
                document.getElementById('status-text').innerText = "Station changed. Session reset.";
            }
            loadStation(stationKey);
        }

        function loadStation(key) {
            currentStation = window.OSCE_STATIONS[key];
            document.getElementById('station-title').innerText = currentStation.title;
            document.getElementById('station-brief').innerHTML = currentStation.scenarioBrief;
            document.getElementById('station-tasks').innerText = currentStation.candidateTasks;
            document.getElementById('system-welcome').innerText = currentStation.welcomeText;

            clearInterval(timerInterval);
            consultationSeconds = 600;
            document.getElementById('timer-display').innerText = "10:00";
            hasStarted = false;
            conversationHistory = [];
            document.getElementById('transcript').innerHTML = `<div class="msg msg-system">${currentStation.welcomeText}</div>`;
            const startBtn = document.getElementById('btn-start');
            if (startBtn) {
                startBtn.innerText = "▶ Start Consultation";
                startBtn.style.background = "#10b981";
            }
            document.getElementById('candidate-id').disabled = false;
        }

        function saveCandidateId() {
            const val = document.getElementById('candidate-id').value.trim();
            localStorage.setItem('osce_candidate_id', val);
        }

        function validatePrerequisites() {
            let valid = true;
            const idInput = document.getElementById('candidate-id');
            const candId = idInput ? idInput.value.trim() : localStorage.getItem('osce_candidate_id') || '';
            if (!candId) {
                if (idInput) {
                    idInput.classList.add('need-field');
                    idInput.focus();
                    setTimeout(() => idInput.classList.remove('need-field'), 1500);
                }
                document.getElementById('status-text').innerText = "⚠️ Please enter your Student Name / ID before beginning.";
                valid = false;
            } else {
                localStorage.setItem('osce_candidate_id', candId);
            }

            return valid;
        }

        function startStation() {
            if (!validatePrerequisites()) return;

            if (!hasStarted) {
                hasStarted = true;
                const startBtn = document.getElementById('btn-start');
                if (startBtn) {
                    startBtn.innerText = "Consultation Active";
                    startBtn.style.background = "#64748b";
                }
                document.getElementById('candidate-id').disabled = true;
                document.getElementById('station-select').disabled = true;
                document.getElementById('status-text').innerText = `10-minute timer running. Address ${currentStation.parentName}.`;

                timerInterval = setInterval(() => {
                    consultationSeconds--;
                    let mins = Math.floor(consultationSeconds / 60);
                    let secs = consultationSeconds % 60;
                    document.getElementById('timer-display').innerText =
                        `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

                    if (consultationSeconds <= 0) {
                        endStation();
                    }
                }, 1000);
            }
            document.getElementById('doctor-input').focus();
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }

        function setupSpeechRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                document.getElementById('status-text').innerText = "Speech-to-text not supported in this browser. Please type.";
                return;
            }

            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isRecording = true;
                const btn = document.getElementById('btn-mic');
                btn.classList.add('recording');
                btn.innerText = "⏹ Stop Mic";
                document.getElementById('status-text').innerText = "Listening... Speak clearly.";
            };

            recognition.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        accumulatedSpeech += event.results[i][0].transcript + ' ';
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                document.getElementById('doctor-input').value = accumulatedSpeech + interim;
            };

            recognition.onend = () => {
                if (isRecording) {
                    try {recognition.start();} catch (e) { }
                } else {
                    stopMicUI();
                }
            };
        }

        function toggleMic() {
            if (!recognition) {
                document.getElementById('status-text').innerText = "Microphone recognition requires Google Chrome or Microsoft Edge.";
                return;
            }
            if (isRecording) {
                isRecording = false;
                recognition.stop();
                stopMicUI();
            } else {
                accumulatedSpeech = document.getElementById('doctor-input').value;
                if (accumulatedSpeech && !accumulatedSpeech.endsWith(' ')) accumulatedSpeech += ' ';
                try {
                    recognition.start();
                } catch (e) {
                    isRecording = false;
                }
            }
        }

        function stopMicUI() {
            isRecording = false;
            const btn = document.getElementById('btn-mic');
            btn.classList.remove('recording');
            btn.innerText = "🎤 Speak";
            document.getElementById('status-text').innerText = "Mic stopped. Click Send or press Enter.";
        }

        function speakParent(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utt = new SpeechSynthesisUtterance(text);
                utt.pitch = 1.0;
                utt.rate = 0.95;
                window.speechSynthesis.speak(utt);
            }
        }

        function sendMessage() {
            if (!validatePrerequisites()) return;
            if (!hasStarted) startStation();

            if (isRecording) toggleMic();

            const input = document.getElementById('doctor-input');
            const text = input.value.trim();
            if (!text) return;

            appendMsg("Doctor", text);
            conversationHistory.push({role: "user", parts: [{text: text}]});
            input.value = '';
            accumulatedSpeech = '';

            callGeminiSP();
        }

        function appendMsg(sender, text) {
            const box = document.getElementById('transcript');
            const msg = document.createElement('div');
            const isDoctor = sender === 'Doctor';
            const isSystem = sender === 'System';
            msg.className = `msg ${isDoctor ? 'msg-doctor' : isSystem ? 'msg-system' : 'msg-sp'}`;
            msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
            box.appendChild(msg);
            box.scrollTop = box.scrollHeight;
        }

        async function callGeminiSP() {
            document.getElementById('status-text').innerText = `${currentStation.parentName} is listening...`;

            const contents = [
                {role: "user", parts: [{text: currentStation.systemPrompt}]},
                {role: "model", parts: [{text: "Understood. I will roleplay this anxious parent authentically according to my emotional state, reacting naturally to empathy or lack thereof."}]},
                ...conversationHistory
            ];

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contents: contents,
                        model: ACTIVE_MODEL,
                        safetySettings: safetySettings,
                        generationConfig: {temperature: 0.7}
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);

                if (!data.candidates || data.candidates.length === 0) {
                    throw new Error("No response generated.");
                }

                const reply = data.candidates[0].content.parts[0].text;
                conversationHistory.push({role: "model", parts: [{text: reply}]});
                appendMsg(currentStation.parentName, reply);
                speakParent(reply);
                document.getElementById('status-text').innerText = "Your turn. Continue the consultation.";

            } catch (err) {
                console.error(err);
                appendMsg("System", `Connection Error: ${err.message}`);
                document.getElementById('status-text').innerText = `Error: ${err.message}`;
            }
        }

        function endStation() {
            if (!hasStarted && conversationHistory.length === 0) {
                document.getElementById('status-text').innerText = "Consultation has not started yet.";
                return;
            }

            clearInterval(timerInterval);
            if (isRecording && recognition) recognition.stop();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();

            if (!isExamMode) {
                document.getElementById('station-select').disabled = false;
            }

            const candidateId = getCandidateIdentity();

            const topPanel = document.getElementById('top-panel');
            topPanel.style.maxHeight = "360px";
            topPanel.innerHTML = `
      <div class="evaluation-report" id="eval-box">
        <strong>Station Concluded: ${currentStation.title}</strong><br>
        Candidate: <u>${candidateId}</u><br>
        The Senior Consultant Examiner is reviewing the transcript line-by-line and compiling evidence-based marks. Please wait...
      </div>
    `;

            document.getElementById('status-text').innerText = "Compiling evidence-based mark sheet...";
            generateExaminerFeedback();
        }

        function getCandidateIdentity() {
            const inputVal = document.getElementById('candidate-id') ? document.getElementById('candidate-id').value.trim() : '';
            const storedVal = localStorage.getItem('osce_candidate_id') || '';
            return inputVal || storedVal || "Unknown Candidate";
        }

        async function generateExaminerFeedback() {
            const candidateId = getCandidateIdentity();
            const transcriptText = conversationHistory.map(m => `${m.role === 'user' ? 'Doctor' : currentStation.parentName}: ${m.parts[0].text}`).join('\n');

            const examinerPrompt = `
You are a strict, fair Senior Pediatric Consultant marking a Year 5 medical student / junior doctor on the clinical OSCE station: "${currentStation.title}".
Candidate Identification: ${candidateId}

STATION RUBRIC & CRITERIA:
${currentStation.examinerCriteria}

FULL CONSULTATION TRANSCRIPT:
${transcriptText}

MARKING INSTRUCTIONS (EVIDENCE-BASED REPORTING):
For EACH criteria domain:
1. Award marks objectively based on the criteria.
2. Quote the student's exact words under "Evidence from Transcript:" to prove what they actually said. If they missed the domain completely, state: "[No relevant explanation volunteered]".
3. Provide an educational "Critique & Omissions:" highlighting clinical inaccuracies or missing guidelines.
4. Evaluate their "Bedside Manner & Rapport Trajectory" (Did they address the parent's distress and questions, or just lecture?).

OUTPUT FORMAT (Follow this structure strictly):
=====================================================
PROVISIONAL OSCE MARK SHEET
Station: ${currentStation.title}
Candidate: ${candidateId}
Global Rating: [Distinction (18-20) / Clear Pass (14-17) / Borderline (10-13) / Fail (<10) / CRITICAL SAFETY FAILURE]
Total Score: [X] / 20
=====================================================

DOMAIN BREAKDOWN & EVIDENCE:
[List each domain with:
- Score: [X/Marks]
- Evidence from Transcript: "..."
- Critique & Omissions: ...]

BEDSIDE MANNER & RAPPORT EVALUATION:
- Communication Trajectory: [Did the parent feel reassured or dismissed?]
- Language Clarity: [Appropriate lay terms vs unexplained medical jargon]

EXAMINER SUMMARY:
- Key Strengths:
- Critical Learning Needs:
`;

            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        contents: [{parts: [{text: examinerPrompt}]}],
                        model: ACTIVE_MODEL,
                        safetySettings: safetySettings
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || response.statusText);

                const feedbackReport = data.candidates[0].content.parts[0].text;
                document.getElementById('eval-box').innerText = feedbackReport;
                document.getElementById('status-text').innerText = "Mark sheet generated. Logging results to Google Sheet...";

                await sendResultsToGoogleSheet(candidateId, transcriptText, feedbackReport);

            } catch (err) {
                document.getElementById('eval-box').innerText = `Error generating evaluation report: ${err.message}`;
                document.getElementById('status-text').innerText = `Examiner Error: ${err.message}`;
            }
        }

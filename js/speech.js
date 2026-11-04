/**
 * Pediatric OSCE Simulator - Speech & Voice Service
 * Supports Malaysian English Natural TTS and Speech-to-Text Microphone input
 */

(function() {
  var voices = [];
  var isAudioActive = false;
  var recognition = null;
  var isListening = false;

  function loadVoices() {
    if ('speechSynthesis' in window) {
      voices = window.speechSynthesis.getVoices();
    }
  }

  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function getBestVoice(gender) {
    if (!voices.length) loadVoices();
    if (!voices.length) return null;

    var maleNames = ['male', 'david', 'george', 'mark', 'alex', 'fred', 'guy', 'daniel', 'oliver', 'rishi', 'stefan'];
    var femaleNames = ['female', 'samantha', 'victoria', 'karen', 'moira', 'serena', 'zira', 'catherine', 'hazel', 'yasmin'];

    if (gender === 'female') {
      // 1. Try en-MY or ms-MY female
      var myVoice = voices.find(function(v) {
        var lang = (v.lang || '').toLowerCase();
        var name = (v.name || '').toLowerCase();
        return (lang.includes('my') || lang.includes('ms')) && !maleNames.some(function(m) { return name.includes(m); });
      });
      if (myVoice) return myVoice;

      // 2. Try en-GB / Commonwealth female
      var gbFemale = voices.find(function(v) {
        var lang = (v.lang || '').toLowerCase();
        var name = (v.name || '').toLowerCase();
        return (lang.includes('gb') || lang.includes('en-sg') || lang.includes('en-au')) &&
               !maleNames.some(function(m) { return name.includes(m); });
      });
      if (gbFemale) return gbFemale;

      // 3. Any confirmed female
      var anyFemale = voices.find(function(v) {
        var name = (v.name || '').toLowerCase();
        return femaleNames.some(function(f) { return name.includes(f); });
      });
      if (anyFemale) return anyFemale;
    } else {
      // Male voice for father or examiner
      var maleVoice = voices.find(function(v) {
        var name = (v.name || '').toLowerCase();
        return maleNames.some(function(m) { return name.includes(m); });
      });
      if (maleVoice) return maleVoice;
    }

    return voices[0] || null;
  }

  window.OSCE_SPEECH = {
    speak: function(text, gender, onEnd) {
      if (!('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
      }

      window.speechSynthesis.cancel();
      var clean = (text || '').replace(/[#*_`]/g, '').trim();
      if (!clean) {
        if (onEnd) onEnd();
        return;
      }

      var utter = new SpeechSynthesisUtterance(clean);
      var chosen = getBestVoice(gender);
      if (chosen) {
        utter.voice = chosen;
      }
      utter.rate = 0.95;
      utter.pitch = gender === 'female' ? 1.05 : 0.95;

      isAudioActive = true;
      utter.onend = function() {
        isAudioActive = false;
        if (onEnd) onEnd();
      };
      utter.onerror = function() {
        isAudioActive = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utter);
    },

    stopSpeaking: function() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      isAudioActive = false;
    },

    isSpeaking: function() {
      return isAudioActive;
    },

    startListening: function(onTranscript, onError, onStateChange) {
      var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRec) {
        if (onError) onError('Speech Recognition is not supported in this browser. Please type your message.');
        return false;
      }

      try {
        if (recognition) {
          recognition.abort();
        }

        recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-MY';

        recognition.onstart = function() {
          isListening = true;
          if (onStateChange) onStateChange(true);
        };

        recognition.onresult = function(event) {
          var finalTrans = '';
          for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTrans += event.results[i][0].transcript;
            }
          }
          if (finalTrans && onTranscript) {
            onTranscript(finalTrans.trim());
          }
        };

        recognition.onerror = function(event) {
          if (event.error !== 'no-speech') {
            if (onError) onError('Microphone: ' + event.error);
          }
        };

        recognition.onend = function() {
          isListening = false;
          if (onStateChange) onStateChange(false);
        };

        recognition.start();
        return true;
      } catch (err) {
        if (onError) onError(err.message || 'Failed to start microphone');
        return false;
      }
    },

    stopListening: function() {
      if (recognition && isListening) {
        try {
          recognition.stop();
        } catch (e) {}
      }
      isListening = false;
    }
  };
})();

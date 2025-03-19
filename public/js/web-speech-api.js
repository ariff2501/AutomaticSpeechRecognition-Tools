document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startButton = document.getElementById('startRecording');
    const stopButton = document.getElementById('stopRecording');
    const transcriptArea = document.getElementById('transcript');
    const copyButton = document.getElementById('copyTranscript');
    const clearButton = document.getElementById('clearTranscript');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    // const translateArea = document.getElementById('translation');

     // Check if browser supports speech recognition
     if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please try Chrome or Edge.');
        startButton.disabled = true;
        statusText.textContent = 'Not supported in this browser';
        return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure speech recognition
    recognition.continuous = true;       // Keep recording until stopped
    recognition.interimResults = true;   // Show interim results
    recognition.lang = 'en-US';          // Set language (can be changed)
    
    let finalTranscript = '';
    
    // Handle speech recognition results
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update the textarea with both final and interim results
        transcriptArea.value = finalTranscript + interimTranscript;
    };
    
    // Event listeners for speech recognition events
    recognition.onstart = () => {
        statusDot.classList.add('recording');
        statusText.textContent = 'Listening...';
        startButton.disabled = true;
        stopButton.disabled = false;
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
            statusText.textContent = 'No speech detected. Try again.';
        } else {
            statusText.textContent = `Error: ${event.error}`;
            console.error('Speech recognition error:', event.error);
        }
        
        statusDot.classList.remove('recording');
        startButton.disabled = false;
        stopButton.disabled = true;
    };
    
    recognition.onend = () => {
        statusDot.classList.remove('recording');
        statusText.textContent = 'Not listening';
        startButton.disabled = false;
        stopButton.disabled = true;
        callTranslateAPI();
    };
    
    // Button event listeners
    startButton.addEventListener('click', () => {
        finalTranscript = transcriptArea.value || '';
        recognition.start();
    });
    
    stopButton.addEventListener('click', () => {
        recognition.stop();
    });
    
    copyButton.addEventListener('click', () => {
        if (transcriptArea.value) {
            navigator.clipboard.writeText(transcriptArea.value)
                .then(() => {
                    statusText.textContent = 'Text copied to clipboard!';
                    setTimeout(() => {
                        statusText.textContent = recognition.recognizing ? 'Listening...' : 'Ready';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    statusText.textContent = 'Failed to copy text';
                });
        }
    });
    
    clearButton.addEventListener('click', () => {
        transcriptArea.value = '';
        finalTranscript = '';
    }); 
    
});

async function callTranslateAPI(){
    const text = document.getElementById('transcript').value;
    const response = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'fr',
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    document.getElementById('translation').innerText = data.translatedText;
  }

<script>
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
// assets
function runSpeechRecognition(elementId, micIcon = null) {

    const iconElement = micIcon ? document.querySelector(micIcon) : null;
    const inputElement = document.getElementById(elementId.replace('#', ''));
    const inputValue = inputElement.value;
    inputElement.focus();
    
    // jQuery(micIcon).addClass('text-red-500', 'animate-pulse')

    var recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        var speechResult = event.results[0][0].transcript.toLowerCase();
        var oldValue = jQuery(micIcon).data('append') ? (inputValue+' ') : ''
        inputElement.value = oldValue+speechResult;
        inputElement?.dispatchEvent(
            new Event("change", { bubbles: true })
        );
        iconElement?.classList.remove('text-red-500', 'animate-pulse')
    }

    recognition.onspeechend = function() {
        recognition.stop();
        iconElement?.classList.remove('text-red-500', 'animate-pulse')
    }

    recognition.onerror = function(event) {
        alert('Error occurred in recognition: ' + event.error);
    }
    
    recognition.onaudiostart = function(event) {
        //Fired when the user agent has started to capture audio.
    }
    
    recognition.onaudioend = function(event) {
        //Fired when the user agent has finished capturing audio.
    }
    
    recognition.onend = function(event) {
        //Fired when the speech recognition service has disconnected.
        iconElement?.classList.remove('text-red-500', 'animate-pulse')

        // Click on send-button
        const sendButton = document.getElementById('send-button');
        sendButton?.click();
    }
}

</script>

    <div id="text-popover" class="text-popover">
        <!-- <button id="translateBtn">Translate</button> -->
        <div class=" flex gap-2">
            <button id="speechBtn" class="btn btn-sm text-white btn-corner bg-cyan-700 hover-scale">{{ __('Speech') }}</button>
            <!-- <button id="addTaskBtn" class="btn btn-sm text-white btn-corner bg-grad-blue hover-scale">{{ __('Add Task') }}</button> -->
            <select id="voices-select" class="hidden"></select>
        </div>
    </div>
    <style>
        .text-popover {
            position: absolute;
            display: none;
            background-color: #ffffff;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 1000;
        }
    </style>
    <script>
        var selection;
        const popover = document.getElementById("text-popover");
        text2speechEvent() 
        function handleEvent() {
            selection = window.getSelection();
            const selectedText = selection.toString().trim();
            if (selectedText.length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                popover.style.top = `${rect.top + window.scrollY - 40}px`;
                popover.style.left = `${rect.left + window.scrollX}px`;
                popover.style.display = "block";
                jQuery('#selected_text_content').val(selectedText)

            } else {
                popover.style.display = "none";
            }
        }

        const speechBtn = document.getElementById("speechBtn");
        speechBtn.addEventListener("click", function () {
            const selectedText = selection.toString().trim();
            selection.toString().trim() ? speak(selectedText) : ''
        });


        // const translateBtn = document.getElementById("translateBtn");
        // translateBtn.addEventListener("click", function () {
        //     selection.toString().trim() ? sendData('#translate_text_form') : ''
        // });

        document.addEventListener("click", function (event) {
            if (!popover.contains(event.target)) {
                popover.style.display = "none";
            }
        });


        async function sendData(formId) {
            const form = document.querySelector(formId);
            const formData = new FormData(form);
            try {
                const response = await fetch("", {
                    method: "POST",
                    // Set the FormData instance as the request body
                    body: formData,
                });
                alert(await response.text());
            } catch (e) {
                console.error(e);
            }
        }



        /** 
         * Text To Speech
         */ 
        const synth = window.speechSynthesis;
        const voiceSelect = document.querySelector("#voices-select");
        const pitch = document.querySelector("#voices-pitch");
        const rate = document.querySelector("#voices-rate");

        let voices = [];

        function populateVoiceList(textLanguage) {
            voices = synth.getVoices().sort(function (a, b) {
                const aname = a.name.toUpperCase();
                const bname = b.name.toUpperCase();

                if (aname < bname) {
                    return -1;
                } else if (aname == bname) {
                    return 0;
                } else {
                    return +1;
                }
            });
            let selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
            voiceSelect.innerHTML = "";

            for (let i = 0; i < voices.length; i++) {
                const option = document.createElement("option");
                option.textContent = `${voices[i].name} (${voices[i].lang})`;

                if (textLanguage && voices[i].name.includes(textLanguage)) {
                    option.textContent += " -- DEFAULT";
                    option.setAttribute("selected", true);
                    selectedIndex = i
                }

                option.setAttribute("data-name", voices[i].name);
                voiceSelect.appendChild(option);
            }
            voiceSelect.selectedIndex = selectedIndex;
        }


        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        function speak(words = "") {
    
            const textLanguage = MediansSettings.detectLanguage(words);

            populateVoiceList(textLanguage);

            if (synth.speaking) {
                console.error("speechSynthesis.speaking");
                return;
            }

            // Detect the langeuage of the selected text

            // Set the language of the speech



            if (words !== "") {
                const utterThis = new SpeechSynthesisUtterance(words);

                utterThis.onend = function (event) {
                };

                utterThis.onerror = function (event) {
                    console.error("SpeechSynthesisUtterance.onerror");
                };

                
                // const selectedOption =  voiceSelect.selectedOptions[0].getAttribute("data-name");
                const selectedOption =  '';
                // const selectedOption = "Google UK English Female";

                for (let i = 0; i < voices.length; i++) {

                    // console.log(voices[i], voices[i].name.toLowerCase(), textLanguage.toLowerCase())
                    //  If voice name include the same language as the selected text
                    if ( voices[i].name.toLowerCase().includes( textLanguage.toLowerCase()) ) {
                        utterThis.voice = voices[i];
                        break;
                    }
                    if (voices[i].name === selectedOption) {
                        utterThis.voice = voices[i];
                        break;
                    }
                }
                utterThis.pitch = pitch && pitch.value ? pitch.value : 1;
                utterThis.rate = rate && rate.value ? rate.value : 1;
                synth.speak(utterThis);
            }
        }
        
    </script>

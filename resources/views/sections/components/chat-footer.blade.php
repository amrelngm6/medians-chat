
                <footer id="chat-footer" class="chat-footer">
                    <div id="input-nav-wrapper" class="input-nav-wrapper">
                        <!-- Chat Form Starts -->
                        <div class="input-area-visual">
                            <button class="btn-menu-toggle" id="btn-menu-toggle"><i class="fa-solid fa-plus"></i></button>
                            <input type="text" id="chat-input" placeholder="Try about, skills, or projects...">
                            <button class="send-btn" id="send-button" disabled><i class="fa-solid fa-arrow-right"></i></button>
                            @if (!empty($setting['site.allow_speech_text']))
                            <button onClick="runSpeechRecognition('#chat-input', '#mic-button')" class="mic-btn" id="mic-button"><i class="fa-solid fa-microphone"></i></button>
                            @endif
                        </div>
                         <!-- Chat Form Ends -->
                    </div>
                    @if(!empty($setting['site.show_footer_menu']))
                    <div class="scroll-flow-progress-slot" aria-label="Chat flow progress"></div>
                    @endif
                    <!-- Footer Bottom Text Starts -->
                    <p id="chat-footer-text"><i class="fa-regular fa-comment-dots"></i> {{ $setting['site.footer_text'] ?? '' }}</p>
                    <!-- Footer Bottom Text Ends -->
                </footer>
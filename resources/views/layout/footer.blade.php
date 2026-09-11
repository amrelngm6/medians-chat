
    <!-- Page Preloader Starts -->
    <div id="preloader" class="preloader">
        <div class="line"></div>
    </div>
    <!-- Page Preloader Ends -->

    <!-- Light/Dark Switcher Starts -->
    <div class="skin">
        <input type="checkbox" class="checkbox" id="dark-checkbox">
        @if (!empty($setting['site.show_dark_mode']))
        <label for="dark-checkbox" class="checkbox-label">
            <svg class="sun" width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 12L23 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 2V1" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 23V22" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 20L19 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 4L19 5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 20L5 19" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 4L5 5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12L2 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <svg class="moon" width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z" stroke="#f1f5f9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </label>
        @endif

        @if (!empty($setting['site.show_languages']))
        <!--Switch language Toggle body class (rtl) -->
        <div class="checkbox-label" id="lang-selector" onClick="toggleBodyLanguage()">
            <span class="ar-lang">ع</span>
            <span class="en-lang">EN</span>
        </div>
        @endif

        <!-- Home icon Starts -->
        <div class="home-icon-button">
            <a href="/" class="home-icon">
                <i class="fas fa-home"></i>
            </a>
        </div>
    </div>
    <!-- Light/Dark Switcher Ends -->

    
    <!-- Lightbox -->
    <div class="gallery-lightbox" id="galleryLightbox">
        <div class="lightbox-overlay"></div>
        <button class="gallery-close">&times;</button>
        <button class="gallery-prev">&#10094;</button>

        <img id="lightboxImage" src="" alt="">

        <button class="gallery-next">&#10095;</button>
    </div>


    <!-- Home icon Ends -->

    <!-- Modal Ends -->
    <div id="master-modal" class="modal-overlay">
        <div class="modal-container">
            <span class="modal-close" onclick="closeMasterModal()">&times;</span>
            <div id="modal-content-area" class="modal-content-area"></div>
        </div>
    </div>
    <!-- Modal Ends -->


    @include('assets.speech-recognise')

    <script>
    window.contentJson = {};
    </script>

    <!-- CMS Content Loader — fetches live content before flows initialize -->
    <script type="module" src="/assets/js/content-loader.js"></script>

    <!-- Template JS Files -->
    <script src="/assets/js/typewriter.js"></script>
    <script src="/assets/js/app.js"></script>

    <!-- Scroll-Flow: scroll-driven chat triggers -->
    <script src="/assets/js/scroll-flow.js"></script>

    @if (!empty($setting['site.show_color_switcher']))
    <!-- Color Switcher Starts / Only Demo -->
        @include('sections.components.color-switcher')
    <!-- Color Switcher Ends / Only Demo -->
    <!-- Color Switcher JS File / Only Demo -->
    <script src="/assets/js/colorswitcher.js"></script>
    @endif

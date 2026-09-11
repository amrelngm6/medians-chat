<div id="intro-screen" class="hero-intro-screen">
    <div class="intro-content">
        <div class="intro-grid">
            <div class="intro-text-side">
                <!-- Hello Text Starts -->
                <div class="hello"><span>{{ $intro['greeting'] ?? '' }}</span></div>
                <!-- Hello Text Ends -->
                <!-- Intro Texts Starts -->
                <div class="intro-text">
                    <h1><span>{{ $intro['name'] ?? '' }}</span></h1>
                    <h2>{{ $intro['title'] ?? '' }}</h2>
                </div>
                <div class="heroSummary">
                    <p>{{ $intro['heroSummaryText'] ?? '' }}</p>
                    <span>{{ $intro['heroSummaryAuthor'] ?? '' }}</span>
                </div>
            </div>

            <!-- Photo Starts -->
            <div class="image-container">
                <img id="intro-image" src="{{ $intro['imageUrl'] ?? '' }}" alt="{{ $intro['imageAlt'] ?? '' }}"
                    class="intro-image">
                <div class="animate-bg"></div>
            </div>
            <!-- Photo Ends -->
        </div>

        <!-- Intro Content Starts -->
        <div class="intro-bottom-content">
            <!-- Call To Actions Starts -->
            <div id="intro-options-target" class="intro-options">
                @foreach($intro['buttons'] ?? [] as $button)
                <button class="btn btn-primary {{ $button['styleClass'] ?? false ? $button['styleClass'] : '' }}" data-action="{{ $button['action'] ?? '' }}">
                    <span class="button-content"><span>{{ $button['label'] ?? '' }}</span></span>
                </button>
                @endforeach
            </div>
            <!-- Call To Actions Ends -->
        </div>
        <!-- Intro Content Ends -->
    </div>
</div>

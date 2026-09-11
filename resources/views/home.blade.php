<!DOCTYPE html>
<html lang="en">

@include('layout.head', ['setting' => $setting])

<body>

    <!-- Chat Wrapper Starts -->
    <main class="chat-wrapper" id="chat-wrapper" data-scroll-flow="true">
        <section class="chat-container" id="chat-container">
            <div class="chat-area-content">
                <div class="">
                    <!-- Intro Screen Starts -->
                    @include('sections.components.intro-screen')
                    <!-- Intro Screen Ends -->

                    <!-- Chat Window Starts -->
                    @include('sections.components.chat-window')
                    <!-- Chat Window Ends -->
                </div>

                <!-- Chat Input Starts -->
                 @include('sections.components.chat-footer')
                <!-- Chat Input Ends -->
            </div>
        </section>
    </main>
    <!-- Chat Wrapper Ends -->

    <!-- Sections Starts -->
    <div class="sections">

        @foreach($content as $key => $section)
        <!-- {{$key}} Section Starts -->
            @php 
            $sectionName = $key; 
            $triggers = $section['triggers'] ?? '';
            @endphp
            @includeIf('sections.index')
        <!-- {{$key}} Section Ends -->
        @endforeach
        
    </div>
    <!-- Sections Ends -->

    <!-- Vertical Texts Starts -->
        @include('sections.components.vertical_texts')
    <!-- Vertical Texts Ends -->
        
    <!-- Footer Starts -->
        @include('layout.footer')
    <!-- Footer Ends -->
        
</body>
</html>
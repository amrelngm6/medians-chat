@php 
    $sectionData = $content[$sectionName] ?? [];
    $triggers = $sectionData['triggers'] ?? ($triggers ?? '');
    $flowId = $sectionData['flowId'] ?? ($sectionName === 'greeting' ? 'hello' : $sectionName);
@endphp

@if($sectionName === 'intro')
    @include('sections.components.intro_screen', ['intro' => $sectionData])
@else
    <div id="flow-{{ $sectionName }}" class="generic-flow" data-flow-id="{{ $flowId }}" @if(!empty($triggers)) data-triggers="{{ $triggers }}" @endif>   

        {{-- Intro or Bio Text --}}
        @if(!empty($sectionData['bio']))
            <p>{!! $sectionData['bio'] !!}</p>
        @elseif(!empty($sectionData['intro']) && is_string($sectionData['intro']))
            <p class="intro">{!! $sectionData['intro'] !!}</p>
        @endif

        {{-- Content Blocks (P, UL, DIV) --}}
        @if(!empty($sectionData['blocks']))
            @include('sections.components.blocks', ['blocks' => $sectionData['blocks']])
        @endif

        {{-- Stats List with Icons (About Section) --}}
        @if(!empty($sectionData['stats']))
            @include('sections.components.stats', ['stats' => $sectionData['stats']])
        @endif

        {{-- Skills Categories & Rating Stars (Skills Section) --}}
        @if(!empty($sectionData['categories']))
            @include('sections.components.skills', ['categories' => $sectionData['categories']])
        @endif

        {{-- Items: Gallery/Media Projects or Client Logos --}}
        @if(!empty($sectionData['items']))
            @if(isset($sectionData['items'][0]['logoUrl']) || isset($sectionData['items'][0]['logo']))
                @include('sections.components.clients', ['items' => $sectionData['items']])
            @else
                @include('sections.components.gallery', ['sectionName' => $sectionName, 'items' => $sectionData['items']])
            @endif
        @endif

        {{-- Direct Contact Details (Contact Section) --}}
        @if(!empty($sectionData['directContact']))
            @include('sections.components.direct_contact', ['directContact' => $sectionData['directContact']])
        @endif

        {{-- Social Media Profiles (Contact Section) --}}
        @if(!empty($sectionData['socialLinks']))
            @include('sections.components.social_links', ['socialLinks' => $sectionData['socialLinks']])
        @endif

        {{-- Global & Final Action Buttons (Services & Projects Sections) --}}
        @if(!empty($sectionData['globalButtons']) || !empty($sectionData['finalButtons']))
            <div class="project-buttons">
                @if(!empty($sectionData['globalButtons']))
                    <ul class="global">
                        @include('sections.components.options_list', ['buttons' => $sectionData['globalButtons']])
                    </ul>
                @endif
                
                @if(!empty($sectionData['finalButtons']))
                    @if($sectionName === 'services')
                        @include('sections.components.buttons', ['sectionName' => $sectionName, 'buttons' => $sectionData['finalButtons']])
                    @else
                        <ul class="final">
                            @include('sections.components.options_list', ['buttons' => $sectionData['finalButtons']])
                        </ul>
                    @endif
                @endif
            </div>
        @endif

        {{-- Standard Interactive Options List --}}
        @if(!empty($sectionData['buttons']) && empty($sectionData['globalButtons']) && empty($sectionData['finalButtons']))
            <ul class="options">
                @include('sections.components.options_list', ['buttons' => $sectionData['buttons']])
            </ul>
        @endif

    </div>
@endif

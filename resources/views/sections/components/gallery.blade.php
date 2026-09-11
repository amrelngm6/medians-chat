    <div class="projects-data">
        @foreach($items as $item)
        <div class="project-item" data-title="{{ $item['title'] ?? '' }}" data-link="{{ $item['link'] ?? '' }}" data-image="{{ $item['image'] ?? '' }}" data-media="{{ $item['mediaType'] ?? 'image' }}" @if(!empty($item['youtubeId'])) data-youtube-id="{{ $item['youtubeId'] }}" @endif @if(!empty($item['videoUrl'])) data-video-url="{{ $item['videoUrl'] }}" @endif>
            <p class="summary">{{ $item['summary'] ?? '' }}</p>
            @if(($item['mediaType'] ?? '') === 'gallery' && !empty($item['gallery']))
            <div class="gallery-urls service-gallery">
                @foreach($item['gallery'] as $imgUrl)
                <img src="{{ $imgUrl }}" alt="">
                @endforeach
            </div>
            @endif
        </div>
        @endforeach
    </div>
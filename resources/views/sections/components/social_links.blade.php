@if(!empty($socialLinks))
<div class="social-links">
    @foreach($socialLinks as $social)
    <div class="social-item" data-icon="{{ $social['icon'] ?? '' }}" data-url="{{ $social['url'] ?? '' }}" data-class="{{ $social['class'] ?? '' }}"></div>
    @endforeach
</div>
@endif

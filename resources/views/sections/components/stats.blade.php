@if(!empty($stats))
<div class="list-with-icons">
    @foreach($stats as $stat)
    <span><i class="{{ $stat['icon'] ?? '' }}"></i> {{ $stat['text'] ?? '' }}</span>
    @endforeach
</div>
@endif

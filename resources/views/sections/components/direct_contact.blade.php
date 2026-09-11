@if(!empty($directContact))
<div class="direct-contact">
    @foreach($directContact as $row)
    <div class="contact-row" data-label="{{ $row['label'] ?? '' }}" data-icon="{{ $row['icon'] ?? '' }}">{{ $row['value'] ?? '' }}</div>
    @endforeach
</div>
@endif

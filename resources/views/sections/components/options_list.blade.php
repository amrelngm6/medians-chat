@foreach($buttons ?? [] as $button)
<li @if(!empty($button['action'])) data-action="{{ $button['action'] }}" @endif @if(!empty($button['link'])) data-link="{{ $button['link'] }}" @endif @if(!empty($button['styleClass'])) data-class="{{ $button['styleClass'] }}" @endif>{{ $button['label'] ?? '' }}</li>
@endforeach

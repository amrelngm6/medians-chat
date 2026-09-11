    <!-- Call To Actions Starts -->
    <div id="{{ $sectionName ?? '' }}-options-target" class="{{ $sectionName ?? '' }}-options">
        @foreach($buttons ?? [] as $button)
        <button class="btn btn-primary {{ $button['styleClass'] ?? false ? $button['styleClass'] : '' }}" data-action="{{ $button['action'] ?? '' }}" data-flow-id="{{ $sectionName ?? '' }}">
            <span class="button-content"><span>{{ $button['label'] ?? '' }}</span></span>
        </button>
        @endforeach
    </div>
    <!-- Call To Actions Ends -->

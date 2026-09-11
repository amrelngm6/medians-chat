@foreach($blocks ?? [] as $block)
    @if(($block['tag'] ?? 'P') === 'P')
        <p>{!! $block['content'] ?? '' !!}</p>
    @elseif(($block['tag'] ?? '') === 'UL')
        <ul>
            @foreach($block['items'] ?? [] as $item)
                <li>{!! $item !!}</li>
            @endforeach
        </ul>
    @elseif(($block['tag'] ?? '') === 'DIV')
        <div class="{{ $block['className'] ?? 'list-with-icons' }}">
            @foreach($block['items'] ?? [] as $item)
                <span>{!! $item !!}</span>
            @endforeach
        </div>
    @endif
@endforeach

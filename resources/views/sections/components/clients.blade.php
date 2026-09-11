<div class="client-list">
    @foreach($items ?? [] as $client)
    <div class="client-item" data-name="{{ $client['name'] ?? '' }}" data-logo="{{ $client['logoUrl'] ?? '' }}"></div>
    @endforeach
</div>

@foreach($categories ?? [] as $category)
<h2 class="category-skills"><i class="{{ $category['icon'] ?? '' }}"></i>{{ $category['name'] ?? '' }}</h2>
<ul class="list-skills">
    @foreach($category['skills'] ?? [] as $skill)
    <li>{{ $skill['name'] ?? '' }}<span class="stars" data-rating="{{ $skill['rating'] ?? 0 }}"></span></li>
    @endforeach
</ul>
@endforeach

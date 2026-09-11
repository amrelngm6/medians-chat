<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_section_translations', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->foreignUuid('content_section_id')
                ->constrained('content_sections')
                ->cascadeOnDelete();
            $table->string('locale', 10);
            $table->json('data');
            $table->timestamps();
            $table->unique(['content_section_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_section_translations');
    }
};
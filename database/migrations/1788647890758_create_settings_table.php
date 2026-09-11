<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 100)->index();
            $table->string('key', 191)->unique();
            $table->string('label')->nullable();
            $table->text('value')->nullable();
            $table->string('type', 50)->default('text'); // text, boolean, integer, json, select, textarea
            $table->text('options')->nullable();          // JSON-encoded options for select type
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false); // expose to frontend without auth
            $table->boolean('is_encrypted')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_messages', function (Blueprint $table) {
            $table->char('id', 36)->primary()->default('(UUID())');

            // Sender info (guest-friendly — no FK to users required)
            $table->string('name');
            $table->string('email');
            $table->string('phone', 30)->nullable();
            $table->string('subject')->nullable();

            // Body
            $table->text('message');

            // Optional JSON payload for extra form fields (e.g. company, department)
            $table->json('meta')->nullable();

            // Which form / source sent this (e.g. "contact", "support", "quote")
            $table->string('form_key')->default('contact');

            // Status lifecycle: new → read → replied → archived | spam
            $table->enum('status', ['new', 'read', 'replied', 'archived', 'spam'])->default('new');

            // If a logged-in user submitted the form
            $table->char('user_id', 36)->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // Admin who handled it
            $table->char('handled_by', 36)->nullable();
            $table->foreign('handled_by')->references('id')->on('users')->onDelete('set null');

            $table->text('reply')->nullable();          // stored reply text
            $table->dateTime('replied_at')->nullable();

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();

            $table->dateTime('read_at')->nullable();
            $table->dateTime('created_at')->default(DB::raw('CURRENT_TIMESTAMP(3)'));
            $table->dateTime('updated_at')->default(DB::raw('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'));
            $table->dateTime('deleted_at')->nullable();  // soft delete

            $table->index('status');
            $table->index('form_key');
            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_messages');
    }
};

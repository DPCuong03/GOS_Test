<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
        $table->id();
        $table->string('registration_number')->unique(); 
        $table->float('math')->nullable();
        $table->float('literature')->nullable();
        $table->float('foreign_language')->nullable();
        $table->float('physics')->nullable();
        $table->float('chemistry')->nullable();
        $table->float('biology')->nullable();
        $table->float('history')->nullable();
        $table->float('geography')->nullable();
        $table->float('civic_education')->nullable();
        $table->string('foreign_language_code')->nullable();
        $table->float('total_group_a')->nullable()->index();
        $table->timestamps();
    });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddAttachmentSize extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('attachments', function (Blueprint $table) {
            $table->integer('size')->nullable();
            $table->integer('uploaded_size')->default(0);
            $table->string('mime_type')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table('attachments')->whereNull('mime_type')->delete();
        Schema::table('attachments', function (Blueprint $table) {
            $table->dropColumn(['size', 'uploaded_size']);
            $table->string('mime_type')->nullable(false)->change();
        });
    }
}

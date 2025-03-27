<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class GoogleUser extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'google_id'
    ];
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'appointment_date',
        'appointment_time',
        'status'
    ];

    protected $casts = [
        'appointment_date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(GoogleUser::class, 'user_id');
    }
}

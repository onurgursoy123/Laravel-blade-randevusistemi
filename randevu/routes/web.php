<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\AppointmentController;

Route::get('/', function () {
    return view('randevu');
});

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');
Route::post('/logout', [GoogleController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/check', [AppointmentController::class, 'checkAvailability']);
});

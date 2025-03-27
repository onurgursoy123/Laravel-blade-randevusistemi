<?php

namespace App\Http\Controllers;

use App\Models\GoogleUser;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Exception;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            
            $user = GoogleUser::updateOrCreate([
                'google_id' => $googleUser->id,
            ], [
                'name' => $googleUser->name,
                'email' => $googleUser->email,
            ]);
            
            Auth::login($user);
            
            return redirect('/')->with('success', 'Google ile giriş başarılı!');
            
        } catch (Exception $e) {
            return redirect('/')->with('error', 'Google ile giriş başarısız oldu. Lütfen tekrar deneyin.');
        }
    }

    public function logout()
    {
        Auth::logout();
        return redirect('/');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'date' => 'required|date',
                'time' => 'required|string'
            ]);

            // Seçilen tarih ve saatte başka randevu var mı kontrol et
            $existingAppointment = Appointment::where('appointment_date', $request->date)
                ->where('appointment_time', $request->time)
                ->first();

            if ($existingAppointment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bu tarih ve saat dolu. Lütfen başka bir zaman seçin.'
                ], 422);
            }

            // Randevuyu oluştur
            $appointment = Appointment::create([
                'user_id' => Auth::id(),
                'name' => $request->name,
                'phone' => $request->phone,
                'appointment_date' => $request->date,
                'appointment_time' => $request->time,
                'status' => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Randevu başarıyla oluşturuldu.',
                'appointment' => $appointment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bir hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkAvailability(Request $request)
    {
        $date = $request->date;
        
        // O güne ait randevuları say
        $appointmentCount = Appointment::where('appointment_date', $date)->count();
        
        // Eğer 9 randevu varsa (09:00-17:00 arası) gün dolmuş demektir
        $isFullyBooked = $appointmentCount >= 9;
        
        $appointments = Appointment::where('appointment_date', $date)
            ->pluck('appointment_time')
            ->toArray();

        return response()->json([
            'success' => true,
            'reserved_times' => $appointments,
            'is_fully_booked' => $isFullyBooked
        ]);
    }

    private function getAvailableTimeSlots($appointments)
    {
        // Mesai saatleri 09:00 - 17:00 arası
        $allTimeSlots = [];
        for ($hour = 9; $hour <= 17; $hour++) {
            $allTimeSlots[] = sprintf('%02d:00', $hour);
        }

        // Dolu saatleri çıkar
        $reservedTimes = $appointments->pluck('appointment_time')->toArray();
        return array_diff($allTimeSlots, $reservedTimes);
    }
}

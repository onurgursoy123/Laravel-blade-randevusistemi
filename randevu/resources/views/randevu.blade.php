<!DOCTYPE html>
<html lang="tr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Randevu Takvimi</title>
    <script src="https://kit.fontawesome.com/b98c6fb680.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<style>

</style>

<body>
    <div class="black-panel">
        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @if (session('error'))
            <div class="alert alert-error">
                {{ session('error') }}
            </div>
        @endif

        @auth
            <div class="user-panel">
                <span class="user-name">Hoş geldin, {{ Auth::user()->name }}</span>
                <form method="POST" action="{{ route('logout') }}" class="logout-form">
                    @csrf
                    <button type="submit" class="logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Çıkış Yap
                    </button>
                </form>
            </div>
        @endauth

        @guest
            <div class="login-container">
                <a href="{{ route('auth.google') }}" class="google-login-btn">
                    <i class="fab fa-google"></i>
                    <span>Google ile Bağlan</span>
                </a>
            </div>
        @endguest

        <div class="calendar-container">
            <div class="calendar @guest calendar-blur @endguest">
                <div class="calendar-top">
                    <ul class="days">
                        <li class="day">Pt</li>
                        <li class="day">Sa</li>
                        <li class="day">Ça</li>
                        <li class="day">Pe</li>
                        <li class="day">Cu</li>
                        <li class="day">Ct</li>
                        <li class="day">Pa</li>
                    </ul>
                    <ul class="dates"></ul>
                </div>
                <div class="calendar-bottom">
                    <button class="prev-btn" id="prevbtn" onclick="prevMonth()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <span class="current-month-year"></span>
                    <button class="next-btn" onclick="nextMonth()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="appointment-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Randevu Al</h3>
                <i class="fa-solid fa-rectangle-xmark"></i>
            </div>
            <div class="modal-body">
                <input type="text" id="name" placeholder="Adınız" required>
                <input type="text" id="phone" placeholder="Telefon Numaranız" required>
                <div class="time-slots">
                    <!-- Saat dilimleri burada dinamik olarak gösterilecek -->
                </div>
                <button id="submitAppointment" class="submit-btn">Randevu Al</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>

</html>
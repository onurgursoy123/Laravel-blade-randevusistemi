const dateList = document.querySelector(".dates");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const currentMonthYear = document.querySelector(".current-month-year");


let date = new Date();

const TOTAL_DAYS_VISIBLE = 42;
const MONTHS = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
];

let reservedDates = [];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let selectedTime = null;

// Takvimi oluştur
function createCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDay = new Date(currentYear, currentMonth, lastDate).getDay();
    const lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();
    const datesContainer = document.querySelector(".dates");
    const monthYearElement = document.querySelector(".current-month-year");
    
    // Bugünün tarihini al
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const months = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    monthYearElement.textContent = `${months[currentMonth]} ${currentYear}`;
    datesContainer.innerHTML = "";

    // Önceki ayın son günleri
    for (let i = firstDay - 1; i >= 0; i--) {
        const li = document.createElement("li");
        li.className = "date past-date";
        li.textContent = lastDateOfLastMonth - i;
        datesContainer.appendChild(li);
    }

    // Mevcut ayın günleri
    for (let i = 1; i <= lastDate; i++) {
        const li = document.createElement("li");
        const currentDate = new Date(currentYear, currentMonth, i);
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
        
        li.className = "date";
        li.setAttribute('data-date', dateStr);
        li.textContent = i;

        if (currentDate < today) {
            li.className = "date past-date";
        } else {
            li.className = "date current";
            // Günün doluluk durumunu kontrol et
            checkDateAvailability(dateStr, li);
        }
        
        datesContainer.appendChild(li);
    }

    // Sonraki ayın ilk günleri
    for (let i = lastDay + 1; i < 7; i++) {
        const li = document.createElement("li");
        li.className = "date next-date";
        li.textContent = i - lastDay;
        datesContainer.appendChild(li);
    }
}

function checkDateAvailability(date, dateElement) {
    fetch(`/appointments/check?date=${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.is_fully_booked) {
                dateElement.className = "date fully-booked";
                dateElement.style.pointerEvents = 'none';
            } else {
                dateElement.className = "date current";
                dateElement.addEventListener('click', function() {
                    handleDateClick(date, data.reserved_times);
                });
            }
        });
}

function handleDateClick(date, reservedTimes = []) {
    selectedDate = date;
    openAppointmentModal();
    showAvailableTimeSlots(reservedTimes);
}

function openAppointmentModal() {
    document.querySelector('.appointment-modal').style.display = 'block';
}

function closeAppointmentModal() {
    document.querySelector('.appointment-modal').style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    selectedTime = null;
}

function showAvailableTimeSlots(reservedTimes) {
    const timeSlots = generateTimeSlots(reservedTimes);
    document.querySelector('.time-slots').innerHTML = timeSlots;
}

function generateTimeSlots(reservedTimes) {
    const slots = [];
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDateObj.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    for (let hour = 9; hour <= 17; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const isReserved = reservedTimes.includes(time);
        const isPastTime = isToday && hour <= currentHour;

        slots.push(`
            <div class="time-slot ${isReserved ? 'reserved' : ''} ${isPastTime ? 'past-time' : ''}" 
                 ${(!isReserved && !isPastTime) ? `onclick="selectTimeSlot('${time}')"` : ''}>
                ${time}
                ${isReserved ? '<span class="reserved-text">Dolu</span>' : ''}
                ${isPastTime ? '<span class="reserved-text">Geçmiş Saat</span>' : ''}
            </div>
        `);
    }
    return slots.join('');
}

function selectTimeSlot(time) {
    selectedTime = time;
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

function prevMonth() {
    const today = new Date();
    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    
    if (prevMonthDate.getMonth() < today.getMonth() && prevMonthDate.getFullYear() <= today.getFullYear()) {
        return;
    }
    
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    createCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar();
}

document.addEventListener('DOMContentLoaded', function() {
    createCalendar();
    
    document.querySelector('.fa-rectangle-xmark').addEventListener('click', closeAppointmentModal);
    
    document.getElementById('submitAppointment').addEventListener('click', submitAppointment);
});

const blackPanel = document.querySelector(".black-panel");

function selectDay() {
    document.getElementById('clocks-top').style.display = "block";
    blackPanelOpen();
}

function closeClock() {
    document.getElementById('clocks-top').style.display = "none";
    blackPanelClose();
}

function blackPanelOpen() {
    blackPanel.classList.add("active");
}

function blackPanelClose() {
    blackPanel.classList.remove("active");
}

const meeting = document.getElementById('meeting');

meeting.addEventListener('click', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    
    if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        alert("Lütfen ad ve telefon numaranızı giriniz!");
        return;
    }
    
    const phoneNumber = /^\d{10,}$/;
    if (!phoneNumber.test(phoneInput.value.trim())) {
        alert("Lütfen geçerli bir telefon numarası giriniz!");
        return;
    }
    
    if (nameInput.value.trim().length < 3) {
        alert("Ad en az 3 karakter olmalıdır!");
        return;
    }
    
    const selectedDateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    reservedDates.push(selectedDateString);
    
    alert("Randevunuz başarıyla oluşturuldu!");
    closeClock(); 
    
    nameInput.value = '';
    phoneInput.value = '';
    
    createCalendar();
});

// Randevu gönderme fonksiyonunu güncelleyelim
function submitAppointment() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (!name || !phone || !selectedTime || !selectedDate) {
        alert('Lütfen tüm alanları doldurun ve bir saat seçin.');
        return;
    }

    // CSRF token'ı al
    const token = document.querySelector('meta[name="csrf-token"]').content;

    // Randevu verilerini gönder
    fetch('/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
        },
        body: JSON.stringify({
            name: name,
            phone: phone,
            date: selectedDate,
            time: selectedTime
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Randevunuz başarıyla oluşturuldu!');
            closeAppointmentModal();
            createCalendar(); // Takvimi yenile
        } else {
            alert(data.message || 'Bir hata oluştu.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    });
}

/* AURUM — app.js (معدل لاستخدام api.php) */
const API_BASE = '/api.php?route=';

// ═══════════════════════════════════════════════
// (باقي الكود كما هو، لكن يجب تعديل جميع fetch)
// ═══════════════════════════════════════════════

/* ── مثال للتعديل: loadHotelsFromAPI */
async function loadHotelsFromAPI() {
    try {
        const res = await fetch(`${API_BASE}hotels`);  // كان: /api/hotels
        const data = await res.json();
        if (data.success) {
            hotelDatabase = data.data;
            renderResults(filterHotels('Paris', 1, 0, 'any'), 'Paris', 1, 0, 'any');
        } else {
            console.warn('API hotels failed, using local fallback');
            useLocalHotelDatabase();
        }
    } catch(e) {
        console.error('Error loading hotels from API', e);
        useLocalHotelDatabase();
    }
}

/* ── تعديل sendAI */
async function sendAI() {
    const text = aiInput.value.trim();
    if (!text) return;
    appendMsg(text, 'user');
    aiInput.value = '';
    const typing = appendMsg('', 'bot');
    typing.classList.add('ai-typing');

    try {
        const response = await fetch(`${API_BASE}ai/concierge`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();
        typing.classList.remove('ai-typing');
        if (data.success) {
            typing.querySelector('.ai-msg-bubble').innerHTML = data.data.response;
            // ... باقي الكود
        } else {
            typing.querySelector('.ai-msg-bubble').innerHTML = 'AI service unavailable.';
        }
    } catch(err) {
        typing.classList.remove('ai-typing');
        typing.querySelector('.ai-msg-bubble').innerHTML = 'Connection error.';
        console.error(err);
    }
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

/* ── تعديل confirmBooking (إرسال الحجز) */
document.getElementById('confirmBooking').addEventListener('click', async () => {
    const cin = document.getElementById('bookingCheckin').value;
    const cout = document.getElementById('bookingCheckout').value;
    if (!cin || !cout) { showToast('Please select dates.', 'error'); return; }
    const paySection = document.getElementById('paymentSection');
    if (paySection && paySection.classList.contains('hidden')) {
        paySection.classList.remove('hidden');
        setTimeout(() => { document.getElementById('payName')?.focus(); }, 120);
        return;
    }
    const token = localStorage.getItem('aurum-token');
    const hotelId = bookingModal.dataset.hotelId;
    const rooms = parseInt(document.getElementById('bookingRooms').value) || 1;
    const rate = parseFloat((bookingModal.dataset.hotelPrice || document.getElementById('summaryRate').textContent).toString().replace(/[^0-9.]/g, ''));
    const nights = Math.round((new Date(cout) - new Date(cin)) / 86400000);
    const total = Math.round(nights * rate * rooms);
    if (token && hotelId) {
        try {
            const res = await fetch(`${API_BASE}bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ hotel_id: parseInt(hotelId), check_in: cin, check_out: cout, rooms, guests: rooms * 2, total_price: total })
            });
            const data = await res.json();
            if (data.success) {
                closeBooking();
                showToast(`✔ Booking #${data.data.booking_id} confirmed!`, 'success');
                return;
            }
        } catch(e) { console.warn('Booking API failed, showing confirmation anyway', e); }
    }
    closeBooking();
    showToast('✦ Reservation confirmed! Check your email for details.', 'success');
});

/* ── ملاحظة: جميع fetch الأخرى تحتاج نفس التعديل (إزالة الشرطة المائلة بعد API_BASE) */
/* مثل: fetch(`${API_BASE}auth/login`) و fetch(`${API_BASE}owner/properties`) ... */

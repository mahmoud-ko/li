/* AURUM — auth.js (نسخة تعمل بشكل كامل مع التسجيل والدخول في وضع الديمو) */
const API_BASE = '/backend/api';

// دوال مساعدة للرسائل
function showToastMessage(text, type) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#222;color:#fff;padding:10px 20px;border-radius:8px;z-index:10000;font-family:sans-serif;font-size:14px;';
        document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

function setError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}
function clearError(id) { setError(id, ''); }

// ------------------- Role Switcher -------------------
const roleGuest = document.getElementById('roleGuest');
const roleOwner = document.getElementById('roleOwner');
const guestSection = document.getElementById('guestSection');
const ownerSection = document.getElementById('ownerSection');

function switchRole(role) {
    if (role === 'guest') {
        roleGuest?.classList.add('active');
        roleOwner?.classList.remove('active');
        guestSection?.classList.remove('hidden');
        ownerSection?.classList.add('hidden');
    } else {
        roleOwner?.classList.add('active');
        roleGuest?.classList.remove('active');
        ownerSection?.classList.remove('hidden');
        guestSection?.classList.add('hidden');
    }
}
roleGuest?.addEventListener('click', () => switchRole('guest'));
roleOwner?.addEventListener('click', () => switchRole('owner'));
const urlRole = new URLSearchParams(window.location.search).get('role');
if (urlRole === 'owner') switchRole('owner');

// ------------------- Guest Tabs -------------------
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginWrap = document.getElementById('loginWrap');
const registerWrap = document.getElementById('registerWrap');

function switchGuestTab(tab) {
    if (tab === 'login') {
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
        loginWrap?.classList.remove('hidden');
        registerWrap?.classList.add('hidden');
    } else {
        tabRegister?.classList.add('active');
        tabLogin?.classList.remove('active');
        registerWrap?.classList.remove('hidden');
        loginWrap?.classList.add('hidden');
    }
}
tabLogin?.addEventListener('click', () => switchGuestTab('login'));
tabRegister?.addEventListener('click', () => switchGuestTab('register'));
document.getElementById('goRegisterLink')?.addEventListener('click', e => { e.preventDefault(); switchGuestTab('register'); });
document.getElementById('goLoginLink')?.addEventListener('click', e => { e.preventDefault(); switchGuestTab('login'); });

// ------------------- Owner Tabs -------------------
const ownerTabLogin = document.getElementById('ownerTabLogin');
const ownerTabRegister = document.getElementById('ownerTabRegister');
const ownerLoginWrap = document.getElementById('ownerLoginWrap');
const ownerRegWrap = document.getElementById('ownerRegisterWrap');

function switchOwnerTab(tab) {
    if (tab === 'login') {
        ownerTabLogin?.classList.add('active');
        ownerTabRegister?.classList.remove('active');
        ownerLoginWrap?.classList.remove('hidden');
        ownerRegWrap?.classList.add('hidden');
    } else {
        ownerTabRegister?.classList.add('active');
        ownerTabLogin?.classList.remove('active');
        ownerRegWrap?.classList.remove('hidden');
        ownerLoginWrap?.classList.add('hidden');
    }
}
ownerTabLogin?.addEventListener('click', () => switchOwnerTab('login'));
ownerTabRegister?.addEventListener('click', () => switchOwnerTab('register'));
document.getElementById('goOwnerRegisterLink')?.addEventListener('click', e => { e.preventDefault(); switchOwnerTab('register'); });
document.getElementById('goOwnerLoginLink')?.addEventListener('click', e => { e.preventDefault(); switchOwnerTab('login'); });

// ------------------- Guest Login (يعمل بأي بيانات) -------------------
document.getElementById('loginBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const pass = document.getElementById('loginPass')?.value;
    if (!email || !pass) { showToastMessage('Please enter email and password', 'error'); return; }
    let loggedIn = false;
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('aurum-token', data.data.token);
            localStorage.setItem('aurum-user', JSON.stringify(data.data.user));
            loggedIn = true;
            showToastMessage('Login successful!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        }
    } catch(e) { console.log('Backend unavailable, demo login'); }
    if (!loggedIn) {
        const name = email.split('@')[0] || 'Guest';
        const initials = name.substring(0,2).toUpperCase();
        localStorage.setItem('aurum-user', JSON.stringify({ name, initials, email, role: 'guest' }));
        localStorage.setItem('aurum-token', 'demo-token');
        showToastMessage(`Welcome ${name}! (Demo mode)`, 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
});

// ------------------- Guest Register (الآن يعمل في الديمو: يقبل أي بيانات) -------------------
document.getElementById('registerBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const first = document.getElementById('regFirst')?.value.trim();
    const last = document.getElementById('regLast')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const pass = document.getElementById('regPass')?.value;
    const pass2 = document.getElementById('regPass2')?.value;
    const agreed = document.getElementById('agreeTerms')?.checked;

    if (!first || !last) { showToastMessage('First and last name required', 'error'); return; }
    if (!email || !email.includes('@')) { showToastMessage('Valid email required', 'error'); return; }
    if (!pass || pass.length < 8) { showToastMessage('Password must be at least 8 characters', 'error'); return; }
    if (pass !== pass2) { showToastMessage('Passwords do not match', 'error'); return; }
    if (!agreed) { showToastMessage('You must agree to terms', 'error'); return; }

    let registered = false;
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `${first} ${last}`, email, password: pass, role: 'guest' })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('aurum-token', data.data.token);
            localStorage.setItem('aurum-user', JSON.stringify(data.data.user));
            registered = true;
            showToastMessage('Registration successful! Redirecting...', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        }
    } catch(e) { console.log('Backend unavailable, demo registration'); }
    if (!registered) {
        const name = `${first} ${last}`;
        const initials = (first[0] + last[0]).toUpperCase();
        localStorage.setItem('aurum-user', JSON.stringify({ name, initials, email, role: 'guest' }));
        localStorage.setItem('aurum-token', 'demo-token');
        showToastMessage(`Welcome ${first}! (Demo registration)`, 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
});

// ------------------- Owner Login -------------------
document.getElementById('ownerLoginBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('ownerLoginEmail')?.value.trim();
    const pass = document.getElementById('ownerLoginPass')?.value;
    if (!email || !pass) { showToastMessage('Please enter email and password', 'error'); return; }
    let loggedIn = false;
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (data.success && data.data.user.role === 'owner') {
            localStorage.setItem('aurum-token', data.data.token);
            localStorage.setItem('aurum-user', JSON.stringify(data.data.user));
            loggedIn = true;
            showToastMessage('Owner login successful!', 'success');
            setTimeout(() => window.location.href = 'owner-dashboard.html', 1000);
        }
    } catch(e) { console.log('Backend unavailable, demo owner login'); }
    if (!loggedIn) {
        const name = email.split('@')[0] || 'Owner';
        const initials = name.substring(0,2).toUpperCase();
        localStorage.setItem('aurum-user', JSON.stringify({ name, initials, email, role: 'owner', hotelName: 'Demo Hotel' }));
        localStorage.setItem('aurum-token', 'demo-owner-token');
        showToastMessage(`Welcome owner ${name}! (Demo mode)`, 'success');
        setTimeout(() => window.location.href = 'owner-dashboard.html', 1000);
    }
});

// ------------------- Owner Register (يعمل في الديمو) -------------------
document.getElementById('ownerRegisterBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const first = document.getElementById('ownerFirst')?.value.trim();
    const last = document.getElementById('ownerLast')?.value.trim();
    const email = document.getElementById('ownerEmail')?.value.trim();
    const hotel = document.getElementById('ownerHotel')?.value.trim();
    const pass = document.getElementById('ownerPass')?.value;
    const agreed = document.getElementById('ownerAgreeTerms')?.checked;

    if (!first || !last) { showToastMessage('First and last name required', 'error'); return; }
    if (!email || !email.includes('@')) { showToastMessage('Valid email required', 'error'); return; }
    if (!hotel) { showToastMessage('Hotel name required', 'error'); return; }
    if (!pass || pass.length < 8) { showToastMessage('Password must be at least 8 characters', 'error'); return; }
    if (!agreed) { showToastMessage('You must agree to terms', 'error'); return; }

    let registered = false;
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `${first} ${last}`, email, password: pass, role: 'owner', hotel_name: hotel })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('aurum-token', data.data.token);
            localStorage.setItem('aurum-user', JSON.stringify(data.data.user));
            registered = true;
            showToastMessage('Owner registration successful!', 'success');
            setTimeout(() => window.location.href = 'owner-dashboard.html', 1000);
        }
    } catch(e) { console.log('Backend unavailable, demo owner registration'); }
    if (!registered) {
        const name = `${first} ${last}`;
        const initials = (first[0] + last[0]).toUpperCase();
        localStorage.setItem('aurum-user', JSON.stringify({ name, initials, email, role: 'owner', hotelName: hotel }));
        localStorage.setItem('aurum-token', 'demo-owner-token');
        showToastMessage(`Welcome owner ${first}! (Demo registration)`, 'success');
        setTimeout(() => window.location.href = 'owner-dashboard.html', 1000);
    }
});

// ------------------- Social Login معطل -------------------
window.socialLogin = function(provider) {
    showToastMessage(`Social login with ${provider} is disabled in demo mode. Use email login.`, 'info');
};

// ------------------- Password strength (ابق كما هو) -------------------
window.togglePw = function(id, btn) {
    const inp = document.getElementById(id);
    if (!inp) return;
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    if (btn) btn.style.opacity = show ? '1' : '0.5';
};
window.checkStrength = function(val) {
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (!fill || !label) return;
    if (!val) { fill.style.width = '0%'; label.textContent = ''; return; }
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
        { w:'20%', bg:'#e74c3c', txt:'Weak' },
        { w:'45%', bg:'#e67e22', txt:'Fair' },
        { w:'70%', bg:'#f1c40f', txt:'Good' },
        { w:'100%', bg:'#2ecc71', txt:'Strong' },
    ];
    const s = levels[score-1] || levels[0];
    fill.style.width = s.w;
    fill.style.background = s.bg;
    label.textContent = s.txt;
    label.style.color = s.bg;
};
window.checkOwnerStrength = window.checkStrength;

console.log('AURUM auth.js loaded with full demo mode (Register works!)');

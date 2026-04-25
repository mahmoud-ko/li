/* AURUM — auth.js (نسخة تجريبية متكاملة تعمل على GitHub Pages) */
/* يسمح بأي بريد إلكتروني وكلمة مرور للدخول الفوري */

// ------------------- API BASE (يمكن تركه كما هو أو تعديله لاحقاً) -------------------
const API_BASE = '/backend/api'; // غيّره إلى رابط خادمك إن وجد

// ------------------- دوال مساعدة للرسائل والتخزين -------------------
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

function setError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = message;
}
function clearError(elementId) { setError(elementId, ''); }

// ------------------- دوال التبديل بين الأدوار والأقسام -------------------
const roleGuest = document.getElementById('roleGuest');
const roleOwner = document.getElementById('roleOwner');
const guestSection = document.getElementById('guestSection');
const ownerSection = document.getElementById('ownerSection');

function switchRole(role) {
    if (!roleGuest || !roleOwner) return;
    if (role === 'guest') {
        roleGuest.classList.add('active');
        roleOwner.classList.remove('active');
        if(guestSection) guestSection.classList.remove('hidden');
        if(ownerSection) ownerSection.classList.add('hidden');
    } else {
        roleOwner.classList.add('active');
        roleGuest.classList.remove('active');
        if(ownerSection) ownerSection.classList.remove('hidden');
        if(guestSection) guestSection.classList.add('hidden');
    }
}
if (roleGuest && roleOwner) {
    roleGuest.addEventListener('click', () => switchRole('guest'));
    roleOwner.addEventListener('click', () => switchRole('owner'));
}
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('role') === 'owner') switchRole('owner');

// ------------------- Guest Tabs -------------------
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginWrap = document.getElementById('loginWrap');
const registerWrap = document.getElementById('registerWrap');

function switchGuestTab(tab) {
    if (tab === 'login') {
        if(tabLogin) tabLogin.classList.add('active');
        if(tabRegister) tabRegister.classList.remove('active');
        if(loginWrap) loginWrap.classList.remove('hidden');
        if(registerWrap) registerWrap.classList.add('hidden');
    } else {
        if(tabRegister) tabRegister.classList.add('active');
        if(tabLogin) tabLogin.classList.remove('active');
        if(registerWrap) registerWrap.classList.remove('hidden');
        if(loginWrap) loginWrap.classList.add('hidden');
    }
}
if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => switchGuestTab('login'));
    tabRegister.addEventListener('click', () => switchGuestTab('register'));
}
const goRegisterLink = document.getElementById('goRegisterLink');
if (goRegisterLink) goRegisterLink.addEventListener('click', e => { e.preventDefault(); switchGuestTab('register'); });
const goLoginLink = document.getElementById('goLoginLink');
if (goLoginLink) goLoginLink.addEventListener('click', e => { e.preventDefault(); switchGuestTab('login'); });

// ------------------- Owner Tabs -------------------
const ownerTabLogin = document.getElementById('ownerTabLogin');
const ownerTabRegister = document.getElementById('ownerTabRegister');
const ownerLoginWrap = document.getElementById('ownerLoginWrap');
const ownerRegWrap = document.getElementById('ownerRegisterWrap');

function switchOwnerTab(tab) {
    if (tab === 'login') {
        if(ownerTabLogin) ownerTabLogin.classList.add('active');
        if(ownerTabRegister) ownerTabRegister.classList.remove('active');
        if(ownerLoginWrap) ownerLoginWrap.classList.remove('hidden');
        if(ownerRegWrap) ownerRegWrap.classList.add('hidden');
    } else {
        if(ownerTabRegister) ownerTabRegister.classList.add('active');
        if(ownerTabLogin) ownerTabLogin.classList.remove('active');
        if(ownerRegWrap) ownerRegWrap.classList.remove('hidden');
        if(ownerLoginWrap) ownerLoginWrap.classList.add('hidden');
    }
}
if (ownerTabLogin && ownerTabRegister) {
    ownerTabLogin.addEventListener('click', () => switchOwnerTab('login'));
    ownerTabRegister.addEventListener('click', () => switchOwnerTab('register'));
}
const goOwnerRegisterLink = document.getElementById('goOwnerRegisterLink');
if (goOwnerRegisterLink) goOwnerRegisterLink.addEventListener('click', e => { e.preventDefault(); switchOwnerTab('register'); });
const goOwnerLoginLink = document.getElementById('goOwnerLoginLink');
if (goOwnerLoginLink) goOwnerLoginLink.addEventListener('click', e => { e.preventDefault(); switchOwnerTab('login'); });

// ------------------- دوال مساعدة أخرى (قوة كلمة المرور، إظهار/إخفاء) -------------------
window.togglePw = function(inputId, btn) {
    const inp = document.getElementById(inputId);
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
    const map = [
        { w:'20%', bg:'#e74c3c', txt:'Weak' },
        { w:'45%', bg:'#e67e22', txt:'Fair' },
        { w:'70%', bg:'#f1c40f', txt:'Good' },
        { w:'100%',bg:'#2ecc71', txt:'Strong' },
    ];
    const s = map[score-1] || map[0];
    fill.style.width = s.w;
    fill.style.background = s.bg;
    label.textContent = s.txt;
    label.style.color = s.bg;
};
window.checkOwnerStrength = window.checkStrength;

// ------------------- تسجيل الدخول كضيف (يعمل فوراً بأي بيانات) -------------------
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPass')?.value;
        if (!email || !password) {
            showToastMessage('Please enter email and password', 'error');
            return;
        }
        // محاولة الاتصال بالخادم الحقيقي إن أمكن (اختياري)
        let loggedIn = false;
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('aurum-token', data.data.token);
                localStorage.setItem('aurum-user', JSON.stringify(data.data.user));
                loggedIn = true;
                showToastMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            }
        } catch(err) { console.log('Backend not available, using demo mode'); }
        
        if (!loggedIn) {
            // وضع ديمو: نقبل أي بيانات وننشئ مستخدمًا من البريد الإلكتروني
            const name = email.split('@')[0] || 'Guest';
            const initials = name.substring(0,2).toUpperCase();
            const user = { name, initials, email, role: 'guest' };
            localStorage.setItem('aurum-user', JSON.stringify(user));
            localStorage.setItem('aurum-token', 'demo-token');
            showToastMessage(`Welcome ${name}! (Demo mode)`, 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        }
    });
}

// ------------------- إنشاء حساب ضيف جديد (معطل في الديمو - اختياري) -------------------
const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToastMessage('Registration is disabled in demo mode. Just login with any email/password.', 'info');
    });
}

// ------------------- تسجيل الدخول كمالك (يقبل أي بيانات) -------------------
const ownerLoginBtn = document.getElementById('ownerLoginBtn');
if (ownerLoginBtn) {
    ownerLoginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('ownerLoginEmail')?.value.trim();
        const password = document.getElementById('ownerLoginPass')?.value;
        if (!email || !password) {
            showToastMessage('Please enter email and password', 'error');
            return;
        }
        let loggedIn = false;
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success && data.data.user.role === 'owner') {
                localStorage.setItem('aurum-token', data.data.token);
                localStorage.setItem('aurum-user', JSON.stringify(data.data.user));
                loggedIn = true;
                showToastMessage('Owner login successful!', 'success');
                setTimeout(() => { window.location.href = 'owner-dashboard.html'; }, 1000);
            }
        } catch(err) { console.log('Backend not available, using demo mode'); }
        
        if (!loggedIn) {
            const name = email.split('@')[0] || 'Owner';
            const initials = name.substring(0,2).toUpperCase();
            const user = { name, initials, email, role: 'owner', hotelName: 'Demo Hotel' };
            localStorage.setItem('aurum-user', JSON.stringify(user));
            localStorage.setItem('aurum-token', 'demo-owner-token');
            showToastMessage(`Welcome owner ${name}! (Demo mode)`, 'success');
            setTimeout(() => { window.location.href = 'owner-dashboard.html'; }, 1000);
        }
    });
}

// ------------------- تسجيل مالك جديد (معطل في الديمو) -------------------
const ownerRegisterBtn = document.getElementById('ownerRegisterBtn');
if (ownerRegisterBtn) {
    ownerRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToastMessage('Owner registration is disabled in demo mode. Use any email/password in Owner Login.', 'info');
    });
}

// ------------------- تسجيل الدخول عبر وسائل التواصل الاجتماعي (معطل في الديمو) -------------------
window.socialLogin = function(provider) {
    showToastMessage(`Social login with ${provider} is disabled in demo mode. Use email login.`, 'info');
};

console.log('AURUM auth.js loaded - Demo mode active: any email/password works');

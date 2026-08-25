// INISIALISASI SUPABASE
const supabaseUrl = 'https://yvwfduhzcrzkxcfufubx.supabase.co'; 
const supabaseKey = 'sb_publishable_M4wVaavZ1s3BDtoiQTbU4g_W-Cwl-xv';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const formForgot = document.getElementById('form-forgot');
    const userNameDisplay = document.getElementById('user-name-display');

    // ==========================================
    // 1. CEK SESI LOGIN
    // ==========================================
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const currentPath = window.location.pathname;

    const isAuthPage = currentPath.includes('login') || currentPath.includes('register') || currentPath.includes('lupa-sandi');
    const isDashboard = currentPath.includes('dashboard');

    if (session && isAuthPage) {
        window.location.href = 'dashboard.html';
        return;
    }

    if (!session && isDashboard) {
        window.location.href = 'login.html';
        return;
    }

    if (session && userNameDisplay) {
        userNameDisplay.innerText = session.user.user_metadata?.name || 'Pengguna';
    }

    // ==========================================
    // 2. FUNGSI NOTIFIKASI
    // ==========================================
    function showAlert(message, type) {
        const alertBox = document.getElementById('alert-box');
        const alertMsg = document.getElementById('alert-message');
        
        if(!alertBox || !alertMsg) {
            alert(message);
            return;
        }
        
        alertMsg.innerText = message;
        alertBox.classList.remove('bg-green-500', 'bg-red-500');
        alertBox.classList.add(type === 'success' ? 'bg-green-500' : 'bg-red-500');

        alertBox.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
        alertBox.classList.add('opacity-100', 'translate-y-0');

        setTimeout(() => {
            alertBox.classList.remove('opacity-100', 'translate-y-0');
            alertBox.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
        }, 3000);
    }

    // ==========================================
    // 3. DAFTAR (REGISTER)
    // ==========================================
    if(formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            showAlert('Memproses pendaftaran...', 'success');

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: { data: { name: name } }
            });

            if (error) {
                showAlert(error.message, 'error');
            } else {
                showAlert('Pendaftaran sukses! Silakan masuk.', 'success');
                formRegister.reset();
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            }
        });
    }

    // ==========================================
    // 4. MASUK (LOGIN)
    // ==========================================
    if(formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            showAlert('Sedang memeriksa akun...', 'success');

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                showAlert('Gagal masuk! Akun belum terdaftar atau kata sandi salah.', 'error');
            } else {
                showAlert('Masuk berhasil! Mengalihkan ke dashboard...', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            }
        });
    }

    // ==========================================
    // 5. LUPA SANDI
    // ==========================================
    if(formForgot) {
        formForgot.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            
            const { data, error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) {
                showAlert(error.message, 'error');
            } else {
                showAlert('Tautan reset telah dikirim ke email Anda!', 'success');
                setTimeout(() => { window.location.href = 'login.html'; }, 2500);
            }
        });
    }
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = "password";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

async function logoutUser() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

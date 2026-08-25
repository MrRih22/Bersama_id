// INISIALISASI SUPABASE
const supabaseUrl = 'https://yvwfduhzcrzkxcfufubx.supabase.co'; 
const supabaseKey = 'sb_publishable_M4wVaavZ1s3BDtoiQTbU4g_W-Cwl-xv';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("2. Supabase berhasil dihubungkan.");

document.addEventListener('DOMContentLoaded', async () => {
    console.log("3. Halaman selesai dimuat, mencari form...");
    
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const formForgot = document.getElementById('form-forgot');
    
    if (formLogin) console.log("--> Form Login ditemukan!");
    if (formRegister) console.log("--> Form Register ditemukan!");

    // ==========================================
    // CEK SESI LOGIN
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

    // ==========================================
    // FUNGSI NOTIFIKASI
    // ==========================================
    function showAlert(message, type) {
        console.log("Menampilkan Alert:", message);
        const alertBox = document.getElementById('alert-box');
        const alertMsg = document.getElementById('alert-message');
        
        if(!alertBox || !alertMsg) {
            alert(message); // Fallback jika UI alert-box HTML tidak ada
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
    // DAFTAR (REGISTER)
    // ==========================================
    if(formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah halaman refresh
            console.log("TOMBOL DAFTAR DIKLIK!");
            
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
                console.error("Error Daftar:", error.message);
                showAlert(error.message, 'error');
            } else {
                console.log("Daftar Sukses!");
                showAlert('Pendaftaran sukses! Silakan masuk.', 'success');
                formRegister.reset();
                setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            }
        });
    }

    // ==========================================
    // MASUK (LOGIN)
    // ==========================================
    if(formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("TOMBOL LOGIN DIKLIK!");
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            showAlert('Sedang memeriksa akun...', 'success');

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error("Error Login:", error.message);
                showAlert('Gagal masuk! Akun belum terdaftar atau kata sandi salah.', 'error');
            } else {
                console.log("Login Sukses!");
                showAlert('Masuk berhasil! Mengalihkan ke dashboard...', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            }
        });
    }
});

// FUNGSI GLOBAL
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

// 1. ALERT PENGECEKAN AWAL (Harus muncul saat web dibuka)
alert("STATUS: File JS berhasil terhubung ke HTML!");

// 2. CEK SUPABASE
if (typeof window.supabase === 'undefined') {
    alert("CRITICAL ERROR: Link Supabase di HTML belum terbaca atau letaknya salah!");
}

var supabaseUrl = 'https://yvwfduhzcrzkxcfufubx.supabase.co'; 
var supabaseKey = 'sb_publishable_M4wVaavZ1s3BDtoiQTbU4g_W-Cwl-xv';
var supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // ==========================================
    // LOGIKA DAFTAR (REGISTER)
    // ==========================================
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah web me-refresh
            
            alert("Tombol DAFTAR ditekan! Sedang mengirim data ke Supabase...");
            
            try {
                const name = document.getElementById('reg-name').value;
                const email = document.getElementById('reg-email').value;
                const password = document.getElementById('reg-password').value;

                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: { data: { name: name } }
                });

                if (error) {
                    alert("GAGAL DAFTAR: " + error.message);
                } else {
                    alert("SUKSES DAFTAR! Data masuk ke database. Beralih ke halaman Login...");
                    window.location.href = 'login.html';
                }
            } catch (err) {
                alert("SISTEM CRASH SAAT DAFTAR: " + err.message);
            }
        });
    }

    // ==========================================
    // LOGIKA MASUK (LOGIN)
    // ==========================================
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            alert("Tombol MASUK ditekan! Sedang mengecek database...");
            
            try {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) {
                    alert("GAGAL MASUK: Akun belum terdaftar atau password salah.");
                } else {
                    alert("SUKSES MASUK! Beralih ke Dashboard...");
                    window.location.href = 'dashboard.html';
                }
            } catch (err) {
                alert("SISTEM CRASH SAAT MASUK: " + err.message);
            }
        });
    }
});

<?php
// Matikan tampilan error mentah agar tidak merusak format JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
    
require 'koneksi.php';

// Menangkap data JSON dari JavaScript
$data = json_decode(file_get_contents("php://input"));

if(isset($data->action)) {
    
    // ==========================================
    // 1. LOGIKA DAFTAR (REGISTER)
    // ==========================================
    if($data->action == 'register') {
        $name = htmlspecialchars($data->name);
        $email = htmlspecialchars($data->email);
        $password = password_hash($data->password, PASSWORD_DEFAULT);

        // Cek email apakah sudah digunakan
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if($stmt->rowCount() > 0) {
            echo json_encode(["status" => "error", "message" => "Email sudah terdaftar!"]);
            exit;
        }

        // Insert User dengan RETURNING id khusus PostgreSQL
        $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id");
        if($stmt->execute([$name, $email, $password])) {
            $user_id = $stmt->fetchColumn(); 
            
            // Buat slug unik dan judul bawaan
            $slug = strtolower(str_replace(' ', '-', $name)) . '-' . rand(1000,9999);
            $title = $name . " Wedding";
            
            // Buatkan row undangan otomatis untuk klien ini
            $stmtInv = $conn->prepare("INSERT INTO invitations (user_id, slug, title) VALUES (?, ?, ?)");
            $stmtInv->execute([$user_id, $slug, $title]);

            echo json_encode(["status" => "success", "message" => "Registrasi berhasil!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke server."]);
        }
    }

    // ==========================================
    // 2. LOGIKA MASUK (LOGIN)
    // ==========================================
    if($data->action == 'login') {
        $email = $data->email;
        $password = $data->password;

        $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Cek kecocokan password
        if($user && password_verify($password, $user['password'])) {
            
            // Ambil detail undangan klien
            $stmtInv = $conn->prepare("SELECT theme, title, slug, event_date FROM invitations WHERE user_id = ?");
            $stmtInv->execute([$user['id']]);
            $invitation = $stmtInv->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "status" => "success", 
                "message" => "Login berhasil!",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "invitation" => $invitation
                ]
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Email atau kata sandi salah!"]);
        }
    }
}
?>
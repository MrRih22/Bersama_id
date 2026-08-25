<?php
$host = "db.yvwfduhzcrzkxcfufubx.supabase.co";
$port = "5432";
$db   = "postgres";
$user = "postgres";
$pass = "Imaalucu01.";

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$db;sslmode=require";
    $conn = new PDO($dsn, $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Koneksi database gagal: " . $e->getMessage();
    exit;
}
?>
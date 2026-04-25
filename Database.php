<?php
class Database {
    private static ?Database $instance = null;
    private PDO $conn;
    private string $host = 'localhost';
    private string $dbname = 'hotel_management';
    private string $user = 'root';
    private string $pass = '';

    private function __construct() {
        $this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4", $this->user, $this->pass);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    public static function getInstance(): Database {
        if (self::$instance === null) self::$instance = new self();
        return self::$instance;
    }

    public function getConnection(): PDO { return $this->conn; }
}

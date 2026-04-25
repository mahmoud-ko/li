<?php
require_once 'JwtHelper.php';
require_once 'Response.php';
class AuthMiddleware {
    public static function handle(): array {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (!preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) Response::unauthorized();
        $payload = JwtHelper::decode($matches[1]);
        if (!$payload) Response::unauthorized('Invalid token');
        return $payload;
    }
    public static function requireRole(string $role): array {
        $payload = self::handle();
        $roles = ['guest'=>0,'owner'=>1,'admin'=>2];
        if (($roles[$payload['role']] ?? 0) < ($roles[$role] ?? 0)) Response::forbidden("Requires '$role' role");
        return $payload;
    }
}

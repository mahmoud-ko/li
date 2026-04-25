<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/AuthMiddleware.php';
require_once __DIR__ . '/JwtHelper.php';

$route = $_GET['route'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

// تسجيل الدخول والتسجيل
if ($route === 'auth/login' && $method === 'POST') {
    require_once __DIR__ . '/AuthController.php';
    (new AuthController())->login();
    exit;
}
if ($route === 'auth/register' && $method === 'POST') {
    require_once __DIR__ . '/AuthController.php';
    (new AuthController())->register();
    exit;
}

// الفنادق
if ($route === 'hotels' && $method === 'GET') {
    require_once __DIR__ . '/HotelsController.php';
    (new HotelsController())->getAll();
    exit;
}
if (preg_match('#^hotels/(\d+)$#', $route, $m) && $method === 'GET') {
    require_once __DIR__ . '/HotelsController.php';
    (new HotelsController())->getById((int)$m[1]);
    exit;
}

// الحجوزات
if ($route === 'bookings' && $method === 'POST') {
    require_once __DIR__ . '/BookingsController.php';
    (new BookingsController())->create();
    exit;
}
if ($route === 'bookings' && $method === 'GET') {
    require_once __DIR__ . '/BookingsController.php';
    (new BookingsController())->getUserBookings();
    exit;
}

// خصائص المالك
if ($route === 'owner/properties' && $method === 'GET') {
    require_once __DIR__ . '/OwnerPropertiesController.php';
    (new OwnerPropertiesController())->getAll();
    exit;
}
if ($route === 'owner/properties' && $method === 'POST') {
    require_once __DIR__ . '/OwnerPropertiesController.php';
    (new OwnerPropertiesController())->create();
    exit;
}
if (preg_match('#^owner/properties/(\d+)$#', $route, $m) && $method === 'PUT') {
    require_once __DIR__ . '/OwnerPropertiesController.php';
    (new OwnerPropertiesController())->update((int)$m[1]);
    exit;
}
if (preg_match('#^owner/properties/(\d+)$#', $route, $m) && $method === 'DELETE') {
    require_once __DIR__ . '/OwnerPropertiesController.php';
    (new OwnerPropertiesController())->delete((int)$m[1]);
    exit;
}

// تحليلات المالك
if ($route === 'analytics/dashboard' && $method === 'GET') {
    require_once __DIR__ . '/AnalyticsController.php';
    (new AnalyticsController())->getDashboard();
    exit;
}

// الذكاء الاصطناعي
if ($route === 'ai/concierge' && $method === 'POST') {
    require_once __DIR__ . '/AIConciergeController.php';
    (new AIConciergeController())->chat();
    exit;
}
if ($route === 'ai/train' && $method === 'GET') {
    require_once __DIR__ . '/AIConciergeController.php';
    (new AIConciergeController())->trainFromConversations();
    exit;
}

Response::notFound('API endpoint not found');

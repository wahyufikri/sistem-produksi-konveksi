<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductionController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Customers
    |--------------------------------------------------------------------------
    */

    Route::get('/customers', [CustomerController::class, 'index']);
    Route::get('/customers/{customer}', [CustomerController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/customers', [CustomerController::class, 'store']);
        Route::put('/customers/{customer}', [CustomerController::class, 'update']);
        Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);
        Route::get(
        '/dashboard',
        [DashboardController::class, 'index']

    );
    Route::get(
    '/dashboard/overdue-orders',
    [DashboardController::class, 'overdueOrders']
);
    });
    /*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });

    /*
|--------------------------------------------------------------------------
| Orders
|--------------------------------------------------------------------------
*/

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
        Route::put('/orders/{order}', [OrderController::class, 'update']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);

    });
    /*
|--------------------------------------------------------------------------
| Production
|--------------------------------------------------------------------------
*/

Route::middleware('role:production')->group(function () {

    Route::get(
        '/production/order-items/{orderItem}',
        [ProductionController::class, 'show']
    );

    Route::put(
        '/production/order-items/{orderItem}',
        [ProductionController::class, 'update']
    );
    Route::post(
    '/production/order-items/{orderItem}/rework',
    [ProductionController::class, 'rework']
);
Route::get(
    '/production/order-items/{orderItem}/history',
    [ProductionController::class, 'history']
);
});

Route::middleware('role:production')->group(function () {

    Route::get(
        '/production/orders',
        [ProductionController::class, 'orders']
    );

    Route::get(
        '/production/order-items/{orderItem}',
        [ProductionController::class, 'show']
    );

    Route::put(
        '/production/order-items/{orderItem}',
        [ProductionController::class, 'update']
    );

});
});

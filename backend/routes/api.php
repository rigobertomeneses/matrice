<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServerController;

/**
 * Rutas de API para el manejo de servidores
 */

// Rutas CRUD para servidores
Route::prefix('servers')->group(function () {
    Route::get('/', [ServerController::class, 'index']);        // GET /api/servers
    Route::post('/', [ServerController::class, 'store']);       // POST /api/servers
    Route::get('/{id}', [ServerController::class, 'show']);     // GET /api/servers/{id}
    Route::put('/{id}', [ServerController::class, 'update']);   // PUT /api/servers/{id}
    Route::delete('/{id}', [ServerController::class, 'destroy']); // DELETE /api/servers/{id}

    // Ruta para actualizar el orden (drag & drop)
    Route::post('/update-order', [ServerController::class, 'updateOrder']); // POST /api/servers/update-order
});

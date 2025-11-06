<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ServerService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;


class ServerController extends Controller
{
    protected $serverService;

    public function __construct(ServerService $serverService)
    {
        $this->serverService = $serverService;
    }

    // Todos los servidores
    public function index(): JsonResponse
    {
        $result = $this->serverService->getAllServers();
        return response()->json($result);
    }

    // Crear un nuevo servidor.
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->all();

            // Obtener el archivo de imagen si existe
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image');
            }

            $result = $this->serverService->createServer($data);

            if (!$result['success']) {
                return response()->json($result, 400);
            }

            return response()->json($result, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el servidor'
            ], 500);
        }
    }

    // Obtener un servidor específico.
    public function show($id): JsonResponse
    {
        $result = $this->serverService->getServerById($id);

        if (!$result['success']) {
            return response()->json($result, 404);
        }

        return response()->json($result);
    }

    // Actualizar un servidor.
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $data = $request->all();

            // Obtener el archivo de imagen si existe
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image');
            }

            $result = $this->serverService->updateServer($id, $data);

            if (!$result['success']) {
                return response()->json($result, 404);
            }

            return response()->json($result);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el servidor'
            ], 500);
        }
    }

    // Eliminar un servidor
    public function destroy($id): JsonResponse
    {
        $result = $this->serverService->deleteServer($id);

        if (!$result['success']) {
            return response()->json($result, 404);
        }

        return response()->json($result);
    }

    // Actualizar el orden de los servidores (para drag & drop)
    
    public function updateOrder(Request $request): JsonResponse
    {
        try {
            $result = $this->serverService->updateServersOrder($request->servers);
            return response()->json($result);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
    }
}
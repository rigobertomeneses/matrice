<?php

namespace App\Services;

use App\DTOs\ServerDTO;
use App\Repositories\ServerRepository;
use App\Rules\ValidIPv4;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

/**
 * Service Layer para la lógica de negocio de Servers
 */
class ServerService
{
    protected $repository;

    public function __construct(ServerRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Obtener todos los servidores
     */
    public function getAllServers(): array
    {
        $servers = $this->repository->getAll();

        return [
            'success' => true,
            'data' => $servers->map(function ($server) {
                $dto = ServerDTO::fromModel($server);
                $response = $dto->toResponse();
                // Agregar fechas formateadas
                $response['created_at'] = $server->created_at->format('Y-m-d H:i:s');
                $response['updated_at'] = $server->updated_at->format('Y-m-d H:i:s');
                return $response;
            }),
            'count' => $servers->count()
        ];
    }

    /**
     * Obtener un servidor por ID
     */
    public function getServerById(int $id): array
    {
        $server = $this->repository->findById($id);

        if (!$server) {
            return [
                'success' => false,
                'message' => 'Servidor no encontrado'
            ];
        }

        $dto = ServerDTO::fromModel($server);
        $response = $dto->toResponse();
        $response['created_at'] = $server->created_at->format('Y-m-d H:i:s');
        $response['updated_at'] = $server->updated_at->format('Y-m-d H:i:s');

        return [
            'success' => true,
            'data' => $response
        ];
    }

    /**
     * Crear nuevo servidor
     */
    public function createServer(array $data): array
    {
        // Validación
        $this->validateServerData($data);

        // Procesar imagen si existe
        if (isset($data['image'])) {
            $data['image_path'] = $this->processImage($data['image']);
            unset($data['image']);
        }

        // Crear DTO y luego el servidor
        $dto = ServerDTO::fromRequest($data);
        $server = $this->repository->create($dto->toArray());

        return [
            'success' => true,
            'message' => 'Servidor creado exitosamente',
            'data' => ServerDTO::fromModel($server)->toResponse()
        ];
    }

    /**
     * Actualizar servidor existente
     */
    public function updateServer(int $id, array $data): array
    {
        $server = $this->repository->findById($id);

        if (!$server) {
            return [
                'success' => false,
                'message' => 'Servidor no encontrado'
            ];
        }

        // Validación para actualización
        $this->validateServerData($data, true);

        // Procesar imagen si existe
        if (isset($data['image'])) {
            // Eliminar imagen anterior
            if ($server->image_path) {
                Storage::disk('public')->delete($server->image_path);
            }
            $data['image_path'] = $this->processImage($data['image']);
            unset($data['image']);
        }

        // Actualizar
        $updatedServer = $this->repository->update($server, $data);

        return [
            'success' => true,
            'message' => 'Servidor actualizado exitosamente',
            'data' => ServerDTO::fromModel($updatedServer)->toResponse()
        ];
    }

    /**
     * Eliminar servidor
     */
    public function deleteServer(int $id): array
    {
        $server = $this->repository->findById($id);

        if (!$server) {
            return [
                'success' => false,
                'message' => 'Servidor no encontrado'
            ];
        }

        $this->repository->delete($server);

        return [
            'success' => true,
            'message' => 'Servidor eliminado exitosamente'
        ];
    }

    /**
     * Actualizar orden de servidores
     */
    public function updateServersOrder(array $serversOrder): array
    {
        // Validar estructura
        $validator = Validator::make(['servers' => $serversOrder], [
            'servers' => 'required|array',
            'servers.*.id' => 'required|exists:servers,id',
            'servers.*.sort_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $this->repository->updateOrder($serversOrder);

        return [
            'success' => true,
            'message' => 'Orden actualizado exitosamente'
        ];
    }

    /**
     * Validar datos del servidor
     */
    private function validateServerData(array $data, bool $isUpdate = false): void
    {
        $rules = [
            'name' => ($isUpdate ? 'sometimes|' : '') . 'required|string|max:100',
            'description' => ($isUpdate ? 'sometimes|' : '') . 'nullable|string|max:200',
            'host' => ($isUpdate ? 'sometimes|' : '') . 'required|string|max:255',
            'ip_address' => [
                ($isUpdate ? 'sometimes' : 'required'),
                new ValidIPv4()
            ],
            'image' => 'nullable|image|max:5120|dimensions:min_width=100,min_height=100',
            'sort_order' => 'sometimes|integer|min:0',
        ];

        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }

    /**
     * Procesar y guardar imagen
     */
    private function processImage($image): string
    {
        // Usar directamente el archivo subido
        $fullTempPath = $image->getRealPath();

        // Verificar que el archivo existe
        if (!file_exists($fullTempPath)) {
            throw new \RuntimeException('No se pudo acceder al archivo subido: ' . $fullTempPath);
        }

        // Obtener información de la imagen
        $imageInfo = getimagesize($fullTempPath);
        $originalWidth = $imageInfo[0];
        $originalHeight = $imageInfo[1];
        $mime = $imageInfo['mime'];

        // Crear imagen desde el archivo
        switch($mime) {
            case 'image/jpeg':
                $sourceImage = imagecreatefromjpeg($fullTempPath);
                break;
            case 'image/png':
                $sourceImage = imagecreatefrompng($fullTempPath);
                break;
            case 'image/gif':
                $sourceImage = imagecreatefromgif($fullTempPath);
                break;
            default:
                // Si no es un formato soportado, guardar sin redimensionar
                Storage::disk('local')->delete($tempPath);
                return $image->store('servers', 'public');
        }

        // Redimensionar a 300x300 manteniendo aspecto
        $targetSize = 300;

        // Calcular dimensiones manteniendo proporción
        if ($originalWidth > $originalHeight) {
            $newWidth = $targetSize;
            $newHeight = intval($originalHeight * ($targetSize / $originalWidth));
        } else {
            $newHeight = $targetSize;
            $newWidth = intval($originalWidth * ($targetSize / $originalHeight));
        }

        // Crear imagen de destino 300x300
        $targetImage = imagecreatetruecolor($targetSize, $targetSize);

        // Fondo blanco
        $white = imagecolorallocate($targetImage, 255, 255, 255);
        imagefilledrectangle($targetImage, 0, 0, $targetSize, $targetSize, $white);

        // Calcular posición para centrar
        $x = intval(($targetSize - $newWidth) / 2);
        $y = intval(($targetSize - $newHeight) / 2);

        // Copiar y redimensionar
        imagecopyresampled(
            $targetImage, $sourceImage,
            $x, $y, 0, 0,
            $newWidth, $newHeight,
            $originalWidth, $originalHeight
        );

        // Generar nombre único
        $fileName = 'servers/' . uniqid() . '.jpg';
        $outputPath = storage_path('app/public/' . $fileName);

        // Asegurar que el directorio existe
        $directory = dirname($outputPath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        // Guardar imagen procesada
        imagejpeg($targetImage, $outputPath, 90);

        // Limpiar
        imagedestroy($sourceImage);
        imagedestroy($targetImage);

        return $fileName;
    }
}
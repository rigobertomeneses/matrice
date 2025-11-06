<?php

namespace App\Repositories;

use App\Models\Server;
use Illuminate\Database\Eloquent\Collection;

/**
 * Repository para el acceso a datos de Servers
 */
class ServerRepository
{
    /**
     * Obtener todos los servidores ordenados
     */
    public function getAll(): Collection
    {
        return Server::ordered()->get();
    }

    /**
     * Buscar servidor por ID
     */
    public function findById(int $id): ?Server
    {
        return Server::find($id);
    }

    /**
     * Crear nuevo servidor
     */
    public function create(array $data): Server
    {
        // Obtener el siguiente sort_order
        $data['sort_order'] = $data['sort_order'] ?? (Server::max('sort_order') + 1);

        return Server::create($data);
    }

    /**
     * Actualizar servidor existente
     */
    public function update(Server $server, array $data): Server
    {
        $server->fill($data);
        $server->save();

        return $server;
    }

    /**
     * Eliminar servidor (soft delete)
     */
    public function delete(Server $server): bool
    {
        return $server->delete();
    }

    /**
     * Actualizar orden de múltiples servidores
     */
    public function updateOrder(array $serversOrder): void
    {
        foreach ($serversOrder as $serverData) {
            Server::where('id', $serverData['id'])
                ->update(['sort_order' => $serverData['sort_order']]);
        }
    }

    /**
     * Contar total de servidores activos
     */
    public function count(): int
    {
        return Server::count();
    }
}
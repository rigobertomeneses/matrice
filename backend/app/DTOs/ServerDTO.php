<?php

namespace App\DTOs;

use App\Models\Server;

/**
 * Data Transfer Object para Server
 */
class ServerDTO
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly ?string $description,
        public readonly string $host,
        public readonly string $ip_address,
        public readonly ?string $image_path,
        public readonly ?int $sort_order,
        public readonly ?bool $status
    ) {}

    /**
     * Crear DTO desde un request
     */
    public static function fromRequest(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            name: $data['name'],
            description: $data['description'] ?? null,
            host: $data['host'],
            ip_address: $data['ip_address'],
            image_path: $data['image_path'] ?? null,
            sort_order: $data['sort_order'] ?? null,
            status: $data['status'] ?? true
        );
    }

    /**
     * Crear DTO desde un modelo
     */
    public static function fromModel(Server $server): self
    {
        return new self(
            id: $server->id,
            name: $server->name,
            description: $server->description,
            host: $server->host,
            ip_address: $server->ip_address,
            image_path: $server->image_path,
            sort_order: $server->sort_order,
            status: $server->status
        );
    }

    /**
     * Convertir a array para crear/actualizar modelo
     */
    public function toArray(): array
    {
        return array_filter([
            'name' => $this->name,
            'description' => $this->description,
            'host' => $this->host,
            'ip_address' => $this->ip_address,
            'image_path' => $this->image_path,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
        ], fn($value) => !is_null($value));
    }

    /**
     * Convertir a array para respuesta JSON
     */
    public function toResponse(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'host' => $this->host,
            'ip_address' => $this->ip_address,
            'image_url' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
        ];
    }
}
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Server;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ServerApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test listar todos los servidores
     */
    public function test_can_list_all_servers(): void
    {
        Server::create([
            'name' => 'Test Server 1',
            'description' => 'Descripción test 1',
            'host' => 'test1.local',
            'ip_address' => '192.168.1.1',
            'sort_order' => 1
        ]);

        Server::create([
            'name' => 'Test Server 2',
            'description' => 'Descripción test 2',
            'host' => 'test2.local',
            'ip_address' => '192.168.1.2',
            'sort_order' => 2
        ]);

        $response = $this->getJson('/api/servers');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'description',
                        'host',
                        'ip_address',
                        'sort_order'
                    ]
                ],
                'count'
            ])
            ->assertJson([
                'success' => true,
                'count' => 2
            ]);
    }

    /**
     * Test crear un nuevo servidor
     */
    public function test_can_create_server(): void
    {
        $serverData = [
            'name' => 'Nuevo Servidor',
            'description' => 'Descripción del servidor',
            'host' => 'nuevo.local',
            'ip_address' => '192.168.1.100'
        ];

        $response = $this->postJson('/api/servers', $serverData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Servidor creado exitosamente'
            ]);

        $this->assertDatabaseHas('servers', [
            'name' => 'Nuevo Servidor',
            'host' => 'nuevo.local'
        ]);
    }

    /**
     * Test validación al crear servidor
     */
    public function test_create_server_validation(): void
    {
        $response = $this->postJson('/api/servers', [
            'name' => 'S'
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'errors'
            ]);
    }

    /**
     * Test actualizar un servidor
     */
    public function test_can_update_server(): void
    {
        $server = Server::create([
            'name' => 'Servidor Original',
            'description' => 'Descripción original',
            'host' => 'original.local',
            'ip_address' => '192.168.1.1',
            'sort_order' => 1
        ]);

        $response = $this->putJson("/api/servers/{$server->id}", [
            'name' => 'Servidor Actualizado',
            'host' => 'actualizado.local',
            'ip_address' => '192.168.1.2'
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Servidor actualizado exitosamente'
            ]);

        $this->assertDatabaseHas('servers', [
            'id' => $server->id,
            'name' => 'Servidor Actualizado'
        ]);
    }

    /**
     * Test eliminar un servidor
     */
    public function test_can_delete_server(): void
    {
        $server = Server::create([
            'name' => 'Servidor a Eliminar',
            'description' => 'Será eliminado',
            'host' => 'eliminar.local',
            'ip_address' => '192.168.1.1',
            'sort_order' => 1
        ]);

        $response = $this->deleteJson("/api/servers/{$server->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Servidor eliminado exitosamente'
            ]);

        $this->assertSoftDeleted('servers', [
            'id' => $server->id
        ]);
    }

    /**
     * Test servidor no encontrado
     */
    public function test_server_not_found(): void
    {
        $response = $this->getJson('/api/servers/99999');

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
                'message' => 'Servidor no encontrado'
            ]);
    }

    /**
     * Test actualizar orden de servidores
     */
    public function test_can_update_servers_order(): void
    {
        $server1 = Server::create([
            'name' => 'Servidor 1',
            'host' => 'server1.local',
            'ip_address' => '192.168.1.1',
            'sort_order' => 1
        ]);

        $server2 = Server::create([
            'name' => 'Servidor 2',
            'host' => 'server2.local',
            'ip_address' => '192.168.1.2',
            'sort_order' => 2
        ]);

        $newOrder = [
            ['id' => $server2->id, 'sort_order' => 1],
            ['id' => $server1->id, 'sort_order' => 2],
        ];

        $response = $this->postJson('/api/servers/update-order', [
            'servers' => $newOrder
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true
            ]);

        $this->assertDatabaseHas('servers', [
            'id' => $server2->id,
            'sort_order' => 1
        ]);
    }

    /**
     * Test validación IP inválida
     */
    public function test_create_server_with_invalid_ip(): void
    {
        $response = $this->postJson('/api/servers', [
            'name' => 'Servidor Test',
            'host' => 'test.local',
            'ip_address' => '999.999.999.999'
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'errors'
            ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Server;
use Illuminate\Support\Facades\DB;

class ServerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar tabla antes de insertar (opcional)
        // DB::table('servers')->truncate();

        $servers = [
            [
                'name' => 'Servidor Web Principal',
                'description' => 'Servidor Apache para la aplicación principal',
                'host' => 'web01.empresa.com',
                'ip_address' => '192.168.1.10',
                'sort_order' => 1,
                'status' => true,
            ],
            [
                'name' => 'Base de Datos MySQL',
                'description' => 'Servidor de base de datos principal',
                'host' => 'db01.empresa.com',
                'ip_address' => '192.168.1.20',
                'sort_order' => 2,
                'status' => true,
            ],
            [
                'name' => 'Servidor de Archivos',
                'description' => 'NAS para almacenamiento de archivos compartidos',
                'host' => 'files01.empresa.com',
                'ip_address' => '192.168.1.30',
                'sort_order' => 3,
                'status' => true,
            ],
            [
                'name' => 'Servidor de Correo',
                'description' => 'Servidor Exchange para correos corporativos',
                'host' => 'mail01.empresa.com',
                'ip_address' => '192.168.1.40',
                'sort_order' => 4,
                'status' => true,
            ],
            [
                'name' => 'Servidor de Desarrollo',
                'description' => 'Entorno de desarrollo y testing',
                'host' => 'dev01.empresa.com',
                'ip_address' => '192.168.1.50',
                'sort_order' => 5,
                'status' => true,
            ]
        ];

        foreach ($servers as $server) {
            Server::create($server);
        }

        $this->command->info('Se han creado 5 servidores de prueba exitosamente.');
    }
}

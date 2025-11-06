#!/bin/bash

# Script de inicialización del proyecto con Docker

echo "========================================="
echo "  Inicializando Proyecto con Docker"
echo "========================================="

# Crear estructura de carpetas si no existen
echo "📁 Creando estructura de carpetas..."
mkdir -p backend
mkdir -p frontend

# Crear proyecto Laravel si no existe
if [ ! -f "backend/composer.json" ]; then
    echo "🚀 Creando proyecto Laravel..."
    docker run --rm -v $(pwd)/backend:/app composer:latest create-project laravel/laravel . --prefer-dist
else
    echo "✅ Proyecto Laravel ya existe"
fi

# Crear el Dockerfile dentro del backend
cat > backend/Dockerfile << 'EOF'
FROM php:8.2-fpm

ARG user=laravel
ARG uid=1000

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev \
    zip unzip libzip-dev libgd-dev libjpeg62-turbo-dev \
    libfreetype6-dev libwebp-dev

RUN apt-get clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && chown -R $user:$user /home/$user

WORKDIR /var/www
COPY --chown=$user:$user . /var/www
USER $user

EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
EOF

# Crear proyecto React si no existe
if [ ! -f "frontend/package.json" ]; then
    echo "⚛️ Creando proyecto React..."
    docker run --rm -v $(pwd)/frontend:/app -w /app node:18-alpine npx create-react-app . --template cra-template
else
    echo "✅ Proyecto React ya existe"
fi

# Crear el Dockerfile dentro del frontend
cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Configurar .env de Laravel
if [ ! -f "backend/.env" ]; then
    echo "⚙️ Configurando .env de Laravel..."
    cp backend/.env.example backend/.env

    # Actualizar configuración de base de datos
    sed -i 's/DB_HOST=.*/DB_HOST=mysql/g' backend/.env
    sed -i 's/DB_DATABASE=.*/DB_DATABASE=servers_management/g' backend/.env
    sed -i 's/DB_USERNAME=.*/DB_USERNAME=root/g' backend/.env
    sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=secret/g' backend/.env
fi

# Crear .env de React
if [ ! -f "frontend/.env" ]; then
    echo "⚙️ Configurando .env de React..."
    echo "REACT_APP_API_URL=http://localhost:8000/api" > frontend/.env
fi

# Construir y levantar los contenedores
echo "🐳 Construyendo contenedores Docker..."
docker-compose build

echo "🚀 Levantando servicios..."
docker-compose up -d

# Esperar a que MySQL esté listo
echo "⏳ Esperando a que MySQL esté listo..."
sleep 10

# Generar key de Laravel
echo "🔑 Generando key de Laravel..."
docker-compose exec backend php artisan key:generate

# Ejecutar migraciones
echo "🗄️ Ejecutando migraciones..."
docker-compose exec backend php artisan migrate --force

# Crear enlace simbólico para storage
echo "🔗 Creando enlace simbólico para storage..."
docker-compose exec backend php artisan storage:link

echo ""
echo "========================================="
echo "     ✅ PROYECTO INICIALIZADO"
echo "========================================="
echo ""
echo "📌 URLs disponibles:"
echo "   - Backend Laravel: http://localhost:8000"
echo "   - Frontend React:  http://localhost:3000"
echo "   - phpMyAdmin:      http://localhost:8080"
echo ""
echo "📌 Base de datos MySQL:"
echo "   - Host: localhost:3306"
echo "   - Database: servers_management"
echo "   - Username: root"
echo "   - Password: secret"
echo ""
echo "📌 Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Detener: docker-compose down"
echo "   - Artisan: docker-compose exec backend php artisan"
echo "   - Composer: docker-compose exec backend composer"
echo "   - NPM: docker-compose exec frontend npm"
echo ""
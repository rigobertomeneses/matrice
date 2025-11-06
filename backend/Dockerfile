# Dockerfile para Laravel con PHP 8.2
FROM php:8.2-fpm

# Argumentos definidos en docker-compose.yml
ARG user=laravel
ARG uid=1000

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libgd-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev

# Limpiar cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar extensiones PHP necesarias
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip

# Configurar GD con soporte para imágenes
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install gd

# Obtener último Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Crear usuario para ejecutar comandos Composer y Artisan
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Establecer directorio de trabajo
WORKDIR /var/www

# Copiar archivos del proyecto (si existen)
COPY --chown=$user:$user . /var/www

USER $user

# Exponer puerto 8000 para artisan serve
EXPOSE 8000

# Comando por defecto - mantener contenedor activo
CMD ["sh", "-c", "if [ -d vendor ]; then php artisan serve --host=0.0.0.0 --port=8000; else tail -f /dev/null; fi"]
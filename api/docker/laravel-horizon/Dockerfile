FROM php:7.2-cli-alpine3.7

RUN apk add --no-cache postgresql-dev ffmpeg && docker-php-ext-install pdo_pgsql pcntl

WORKDIR /var/www/html

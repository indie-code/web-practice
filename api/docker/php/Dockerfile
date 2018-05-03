FROM php:7.2-fpm-alpine3.7

ADD ./docker/php/composer-install.sh /tmp/composer-install.sh

RUN sh /tmp/composer-install.sh rm sh /tmp/composer-install.sh

RUN apk add --no-cache postgresql-dev ffmpeg && docker-php-ext-install pdo_pgsql pcntl

ADD ./docker/php/php.ini /usr/local/etc/php/php.ini

WORKDIR /var/www/html

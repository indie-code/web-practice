FROM node:10-alpine

RUN npm install --unsafe-perm -g laravel-echo-server

EXPOSE 6001

WORKDIR /var/www/html

CMD ["laravel-echo-server", "start"]

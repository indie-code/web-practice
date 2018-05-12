#!/usr/bin/env bash

if [ -f ".docker-env" ]; then
    . ./.docker-env
fi

export REDIS_PASSWORD=${REDIS_PASSWORD:-app}

case "$1" in
    "art")
        shift 1
        COMMAND="exec php php artisan $@"
    ;;
    "composer")
        shift 1
        COMMAND="run --rm php composer $@"
    ;;
    "")
        COMMAND="ps"
    ;;
    *)
        COMMAND="$@"
    ;;
esac

COMMAND="docker-compose -f docker-compose.base.yml ${COMMAND}"

echo ${COMMAND};

${COMMAND}

#!/usr/bin/env bash

if [ -f ".docker-env" ]; then
    . ./.docker-env
fi

export REDIS_PASSWORD=${REDIS_PASSWORD:-app}

COMMAND="docker-compose -f docker-compose.base.yml $@"

echo ${COMMAND};

${COMMAND}

#!/usr/bin/env bash

. ./.docker-env

export REDIS_PASSWORD=${REDIS_PASSWORD:-app}

COMMAND="docker-compose -f docker-compose.base.yml $@"

echo ${COMMAND};

${COMMAND}

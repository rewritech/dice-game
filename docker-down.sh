#!/bin/bash

if [ $1 == "dev" ]
then
    docker-compose --env-file ./api/.env down
fi

if [ $1 == "prod" ]
then
    docker-compose -f docker-compose-production.yml --env-file ./api/.env down
fi
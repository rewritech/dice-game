#!/bin/bash

if [ $1 == "up" ]
then
    docker-compose -f docker-compose-production.yml --env-file ./api/.env build
    docker-compose -f docker-compose-production.yml --env-file ./api/.env up -d
fi

if [ $1 == "down" ]
then
    docker-compose -f docker-compose-production.yml --env-file ./api/.env down
fi

if [ $1 == "restart" ]
then
    docker-compose -f docker-compose-production.yml --env-file ./api/.env down
    docker-compose -f docker-compose-production.yml --env-file ./api/.env build
    docker-compose -f docker-compose-production.yml --env-file ./api/.env up -d
fi
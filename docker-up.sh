#!/bin/bash

if [ $1 == "dev" ]
then
    docker-compose --env-file ./api/.env build
    docker-compose --env-file ./api/.env up
fi

if [ $1 == "prod" ]
then
    docker-compose -f docker-compose-production.yml --env-file ./api/.env build
    docker-compose -f docker-compose-production.yml --env-file ./api/.env up -d
fi
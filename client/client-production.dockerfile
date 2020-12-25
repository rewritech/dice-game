FROM node:12 AS build-stage

# Create a directory where our app will be placed
RUN mkdir -p /client

# Change directory so that our commands run inside this new directory
WORKDIR /client

COPY package.json /client

RUN npm install

COPY . /client
ARG configuration=production

ENV PORT 8720
EXPOSE $PORT

# Angular アプリをビルドする
RUN npm run build -- --output-path=./dist/out --configuration $configuration

FROM nginx:1.15

COPY --from=build-stage /client/dist/out/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf
FROM nginx:1.15
COPY ./dist/out/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
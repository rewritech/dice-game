FROM node:12

# Create a directory where our app will be placed
RUN mkdir -p /client

# Change directory so that our commands run inside this new directory
WORKDIR /client

COPY package.json /client

RUN npm install
RUN npm install -g @angular/cli@11.0.4

COPY . /client
EXPOSE 4200

CMD [ "ng", "serve", "--host", "0.0.0.0", "--poll" ]
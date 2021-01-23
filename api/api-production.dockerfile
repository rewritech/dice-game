 # Create image based on the official Node 6 image from the dockerhub
FROM node:14.15.4-slim

# Create a directory where our app will be placed
RUN mkdir -p /api

# Change directory so that our commands run inside this new directory
WORKDIR /api

# Copy dependency definitions
COPY package*.json /api

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /api

# Expose the port the app runs in
ARG API_PORT
ARG SOCKET_PORT
ENV PORT ${API_PORT}
ENV SOCKET_PORT ${SOCKET_PORT}
EXPOSE $PORT
EXPOSE $SOCKET_PORT

# Serve the app
CMD ["npm", "start"]
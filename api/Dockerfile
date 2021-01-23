 # Create image based on the official Node 6 image from the dockerhub
FROM node:14.15.4-slim

# Create a directory where our app will be placed
RUN mkdir -p /api

# Change directory so that our commands run inside this new directory
WORKDIR /api

# Copy dependency definitions
COPY package.json /api

# Install dependecies
RUN npm install
RUN npm install -g nodemon

# Get all the code needed to run the app
COPY . /api

# Expose the port the app runs in
ENV PORT 3000
ENV SOCKET_PORT 3001
EXPOSE $PORT
EXPOSE $SOCKET_PORT

# Serve the app
CMD ["nodemon", "-L", "app.js"]
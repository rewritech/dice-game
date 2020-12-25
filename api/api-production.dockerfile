 # Create image based on the official Node 6 image from the dockerhub
FROM node:12

# Create a directory where our app will be placed
RUN mkdir -p /api

# Change directory so that our commands run inside this new directory
WORKDIR /api

# Copy dependency definitions
COPY package.json /api

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /api

# Expose the port the app runs in
ENV PORT 7145
ENV SOCKET_PORT 5417
EXPOSE $PORT
EXPOSE $SOCKET_PORT

# Serve the app
CMD ["npm", "start"]
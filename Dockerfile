# Use node 8
FROM node:8

# Install prerequisites

# Set the working directory to /app
WORKDIR /home/node/app
COPY . ./
WORKDIR /home/node/app

# Install package and build
RUN yarn install
RUN yarn build
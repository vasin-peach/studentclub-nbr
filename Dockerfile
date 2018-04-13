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
RUN apt-get -qq update
RUN apt-get -qq -y install curl
RUN apt-get install zsh
RUN apt-get install git-core
RUN apt update
RUN curl -L https://github.com/docker/compose/releases/download/1.8.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose
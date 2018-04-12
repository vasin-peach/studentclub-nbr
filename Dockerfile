FROM node:8

WORKDIR /home/node/app
COPY . ./
WORKDIR /home/node/app/client

RUN yarn install
RUN yarn build
FROM node:9-alpine

RUN mkdir -p /usr/src/app/frontend
WORKDIR /usr/src/app/frontend

COPY package.json /usr/src/app/frontend

RUN yarn

COPY . ./

RUN yarn build



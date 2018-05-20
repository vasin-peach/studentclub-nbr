FROM node:9-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN yarn

COPY . /usr/src/app

EXPOSE 80

CMD [ "yarn", "dev"]

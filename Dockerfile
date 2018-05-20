FROM node:9-alpine

RUN mkdir -p /usr/src/app/frontend
WORKDIR /usr/src/app/frontend

COPY package.json /usr/src/app/frontend

RUN yarn

COPY . /usr/src/app

EXPOSE 80

CMD [ "yarn", "dev"]

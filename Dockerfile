FROM node:9-alpine as step01

WORKDIR /home/node/app
COPY ./package.json /home/node/app
RUN yarn install

COPY . /home/node/app
RUN yarn build

FROM nginx:1.14-alpine
WORKDIR /usr/share/nginx/html

COPY --from=step01 /home/node/app/dist .

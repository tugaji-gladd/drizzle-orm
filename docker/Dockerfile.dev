FROM node:22.6.0-bookworm-slim

RUN apt-get update && apt-get install -y procps

RUN npm i -g @nestjs/cli

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y curl mongodb

RUN apt-get install -y sysvinit-utils

COPY mongodb.conf /etc/mongodb.conf
RUN mkdir -p /data/db

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -

RUN apt-get install -y Node.js

COPY package*.json ./

RUN export NODE_OPTIONS=--max-old-space-size=4096

RUN npm install

COPY . .
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD [ "bash", "entrypoint.sh" ]
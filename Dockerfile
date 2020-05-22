FROM node

RUN mkdir /myapp

WORKDIR /myapp

ADD package.json /myapp/package.json

RUN npm install

ADD . /myapp
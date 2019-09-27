# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.9-alpine

WORKDIR /opt/app

COPY package*.json ./

COPY ./build .
#RUN npm run build --production
RUN npm install -g serve
CMD serve -s . -l 3000


EXPOSE 3000

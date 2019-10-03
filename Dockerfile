FROM nginx:1.16-alpine

WORKDIR /opt/app

COPY resources/default.conf.prod /etc/nginx/conf.d/default.conf
COPY package*.json ./

COPY ./build .

EXPOSE 8000
ENTRYPOINT ["nginx", "-g", "daemon off;"]

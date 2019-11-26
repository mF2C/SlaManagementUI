CONF=${1:-resources/default.conf.dev}
docker rm nginx
docker run -p 8000:8000 --name nginx -v "$PWD/$CONF":/etc/nginx/conf.d/default.conf:ro nginx:1.16-alpine

FROM nginx:1.16-alpine

# Container runs Nginx. Server root is at /opt
# - http://xxx/sla : React.js
# - http://xxx/api: Reverse proxy to CIMI server (PROXY env var hold URL)
#
# Nginx config file is written at runtime to set location of CIMI
# (i.e. /tmp/default.conf.prod template is substituted 
# and written to /etc/nginx/conf.d/default)

WORKDIR /opt/sla
COPY resources/run.sh /opt
COPY resources/default.conf.prod /tmp
COPY package*.json ./

COPY ./build .

EXPOSE 8000
ENTRYPOINT ["/opt/run.sh"]

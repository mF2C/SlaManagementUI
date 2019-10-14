#!/bin/sh
# Starts sla-ui container.
#
# PROXY env var holds URL of CIMI server (see default value below) 
# PROXY value is written in Nginx configuration file.

# Process input env vars
export PROXY=${PROXY:-https://proxy/api/}

envsubst '$PROXY' < /tmp/default.conf.prod > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"

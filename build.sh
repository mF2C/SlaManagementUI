# Usage ./build.sh <version>

[ $# -eq 0 ] && echo "Usage: ./build.sh <version>" && exit 1

VERSION=$1 

set -x

npm run build
docker build -t "mf2c/sla-ui:$VERSION" .
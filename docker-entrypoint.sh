#!/usr/bin/env sh

args=(
  --port="${PORT}"
  --nodeAddress="${NODE_ADDRESS}"
  --nodePort="${NODE_PORT}"
  --nodeTimeout="${NODE_TIMEOUT}"
  --log="${LOG_LEVEL}"
)

if [ -n $USE_TLS ]; then
  args+=('--tls')
fi

node ./dist/app.js "${args[@]}"

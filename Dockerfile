ARG base_image=node:16-slim

FROM ${base_image}

ENV ENV_NODE=production
ENV PORT=9900
ENV NODE_ADDRESS=172.17.0.1
ENV NODE_PORT=10000
ENV NODE_TIMEOUT=10000
ENV USE_TLS=

WORKDIR /app
COPY ./package.json ./yarn.lock ./tsconfig.json ./
COPY ./src ./src
COPY ./deps ./deps

RUN yarn && yarn cache clean
RUN yarn generate && yarn build

ENTRYPOINT node ./dist/app.js --port "${PORT}" --nodeAddress "${NODE_ADDRESS}" --nodePort "${NODE_PORT}" --nodeTimeout "${NODE_TIMEOUT}" --logLocation /dev/stdout $([ ! -z $USE_TLS ] && [ $USE_TLS = true ] && echo '--tls')

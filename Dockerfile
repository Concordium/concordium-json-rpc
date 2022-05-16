FROM node:14.16.0

ENV ENV_NODE production
ENV PORT 9900
ENV NODE_ADDRESS 127.0.0.1
ENV NODE_PORT 10001
ENV NODE_TIMEOUT 10000

WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY deps/concordium-grpc-api ./deps/concordium-grpc-api

RUN yarn && yarn cache clean
RUN yarn generate && yarn build

CMD node ./dist/index.js --port ${PORT} --nodeAddress ${NODE_ADDRESS} --nodePort ${NODE_PORT} --nodeTimeout ${NODE_TIMEOUT}

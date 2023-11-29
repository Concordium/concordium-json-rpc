# Deprecated

The JSON-RPC server relied on the V1 node API which has since been removed. This project is thus deprecated.
Use one of the [available SDKs and APIs](https://developer.concordium.software/en/mainnet/net/guides/sdks-apis.html) instead.


# Concordium JSON-RPC proxy server

The Concordium JSON-RPC proxy server is a small server that acts as a wrapper for the gRPC interface exposed by the Concordium node.

# Build
Before building the project for the first time, remember to initialize submodules:
```
git submodule update --init
```

Then generate the gRPC files:
```
yarn generate
```
and then run the actual build:
```
yarn build
```
If you have already generated the gRPC files, then you only need to run the build step and can safely skip the previous steps.

# Build  and run the Docker image
Before building the image for the first time, remember to initialize submodules:
```
git submodule update --init
```

To build the docker image run the following:
```
docker build -t concordium-json-rpc .
```
When running the image you specify the port to use and the settings that the server should use
when connecting to a Concordium node:
```
docker run -p 9900:9900 -e PORT=9900 -e NODE_ADDRESS=127.0.0.1 -e NODE_PORT=10000 -e NODE_TIMEOUT=15000 -v ${PWD}/combined.log:/app/combined.log concordium-json-rpc
```
If you do not specify an environment variable, then a default value is used instead. In the example above the logfile from the server is also mounted, so that the logfile can be read and stored on the host system.

# Run server
When the project has been built you can run it locally with node with the following command:
```
yarn start --port jsonRpcServerPort --nodeAddress nodeIpAddress --nodePort nodePort --nodeTimeout nodeTimeout
```
An example of running the server with a locally running Concordium node would be:
```
yarn start --port 9095 --nodeAddress 127.0.0.1 --nodePort 10001 --nodeTimeout 5000
```

# Flags
- log: level of the log. Defaults to info.
- logLocation: location of the log file. If this is not specified the server will write logs to stdout.
- port: port that the JSON-RPC server should use.
- nodeAddress: Address of the node, that the server should use as a backend.
- nodePort: port of the node.
- nodeTimeout: milliseconds that the server will wait for answers from the node.
- tls: if this flag is present, the server will attempt to connect using TLS/SSL.

# Linting
To lint the project run:
```
yarn lint
```
To lint and fix the autofixable linting issues run:
```
yarn lint --fix
```

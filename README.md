# Concordium JSON-RPC proxy server

The Concordium JSON-RPC proxy server is a small server that acts as a wrapper for the gRPC interface exposed by the Concordium node.

# Build
To build the project first generate the gRPC files:
```
yarn generate
```
and then run the actual build:
```
yarn build
```
If you have already generated the gRPC files, then you only need to run the build step and can safely skip the generate step.

# Run server
When the project has been built you can run it locally with node with the following command:
```
yarn start --port jsonRpcServerPort --nodeAddress nodeIpAddress --nodePort nodePort --nodeTimeout nodeTimeout
```
An example of running the server with a locally running Concordium node would be:
```
yarn start --port 9095 --nodeAddress 127.0.0.1 --nodePort 10001 --nodeTimeout 5000
```

# Linting
To lint the project run:
```
yarn lint
```
To lint and fix the autofixable linting issues run:
```
yarn lint --fix
```

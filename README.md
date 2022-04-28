# Concordium JSON-RPC proxy server

The Concordium JSON-RPC proxy serves is a small server that acts as a wrapper for the gRPC interface exposed by the Concordium node.

# Build
To build the project run:
```
yarn build
```

# Run server
When the project has been built you can run it locally with node with the following command:
```
node dist/index.js
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

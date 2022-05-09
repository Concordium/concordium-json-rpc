import { credentials, Metadata } from '@grpc/grpc-js';
import express from 'express';
import jayson from 'jayson';
import minimist from 'minimist';
import NodeClient from './client';
import getJsonRpcMethods from './methods';

// Parse parameters that defines how to set up the server.
const argv = minimist(process.argv.slice(2));
const jsonRpcPort = Number(argv.port);
const nodeAddress = argv.nodeAddress;
const nodePort = Number(argv.nodePort);
const nodeTimeout = Number(argv.nodeTimeout);

const metadata = new Metadata();
metadata.add('authentication', 'rpcadmin');
const insecureCredentials = credentials.createInsecure();
const nodeClient = new NodeClient(
    nodeAddress,
    nodePort,
    insecureCredentials,
    metadata,
    nodeTimeout
);
const server = new jayson.Server(getJsonRpcMethods(nodeClient));

const app = express();
app.use(express.json());
app.post('/json-rpc', server.middleware());
app.listen(jsonRpcPort);

console.log(
    'Concordium JSON-RPC server is now listening on port ' + jsonRpcPort
);

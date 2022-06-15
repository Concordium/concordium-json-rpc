import logger from './logger';
import minimist from 'minimist';
import server from './server';
import JSONbig from 'json-bigint';

// DANGEROUSLY override JSON prototype methods to handle uint64 values (bigint)
// To avoid this we would have to write our own parser/serializer for the express
// server.
JSON.parse = JSONbig({ useNativeBigInt: true }).parse;
JSON.stringify = JSONbig({ useNativeBigInt: true }).stringify;

// Parse parameters that defines how to set up the server.
const argv = minimist(process.argv.slice(2));
const jsonRpcPort = Number(argv.port);
const nodeAddress = argv.nodeAddress;
const nodePort = Number(argv.nodePort);
const nodeTimeout = Number(argv.nodeTimeout);

server(nodeAddress, nodePort, nodeTimeout).listen(jsonRpcPort);

logger.info(
    'Concordium JSON-RPC server is now listening on port ' + jsonRpcPort,
    { nodeAddress, nodePort, nodeTimeout }
);

import logger from './logger';
import server from './server';
import JSONbig from 'json-bigint';
import {
    nodeAddress,
    nodePort,
    nodeTimeout,
    useTLS,
    jsonRpcPort,
} from './config';

// DANGEROUSLY override JSON prototype methods to handle uint64 values (bigint)
// To avoid this we would have to write our own parser/serializer for the express
// server.
JSON.parse = JSONbig({ useNativeBigInt: true }).parse;
JSON.stringify = JSONbig({ useNativeBigInt: true }).stringify;

server(nodeAddress, nodePort, nodeTimeout, useTLS).listen(jsonRpcPort);

logger.info(
    'Concordium JSON-RPC server is now listening on port ' + jsonRpcPort,
    { nodeAddress, nodePort, nodeTimeout }
);

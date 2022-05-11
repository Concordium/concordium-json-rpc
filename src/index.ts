import { credentials, Metadata } from '@grpc/grpc-js';
import express from 'express';
import jayson from 'jayson';
import minimist from 'minimist';
import NodeClient from './client';
import getJsonRpcMethods from './methods';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';

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
app.post('/json-rpc', (req, res, next) => {
    const correlationId = uuidv4();
    const request = req.body;
    logger.info('Received a request', { correlationId });

    server.call(request, (error, response) => {
        if (error) {
            logger.error('Failed request', { error, correlationId, request });

            // If err is an Error, then it is not a JSON-RPC error.
            if (error instanceof Error) {
                return next(error);
            }

            res.status(400);
            res.send(error);
            return;
        }

        if (response) {
            logger.info('Successful request', { correlationId });
            return res.send(response);
        } else {
            logger.info('Successful request. Sent empty response', { correlationId });
            res.status(204);
            res.send('');
        }
    });
});

app.listen(jsonRpcPort);

logger.info(
    'Concordium JSON-RPC server is now listening on port ' + jsonRpcPort,
    { nodeAddress, nodePort, nodeTimeout }
);

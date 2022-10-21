import { credentials, Metadata } from '@grpc/grpc-js';
import express from 'express';
import { Express } from 'express';
import jayson from 'jayson';
import NodeClient from './client';
import getJsonRpcMethods from './methods';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { ResultAndMetadata } from './types';

export default (
    nodeAddress: string,
    nodePort: number,
    nodeTimeout: number,
    useTLS: boolean
): Express => {
    const metadata = new Metadata();
    metadata.add('authentication', 'rpcadmin');
    const creds = useTLS
        ? credentials.createSsl()
        : credentials.createInsecure();
    const nodeClient = new NodeClient(
        nodeAddress,
        nodePort,
        creds,
        metadata,
        nodeTimeout
    );
    const server = new jayson.Server(getJsonRpcMethods(nodeClient));

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.post('/', (req, res, next) => {
        const correlationId = uuidv4();
        const request = req.body;
        logger.info('Received a request', { correlationId });

        const cookie = req.header('cookie');
        const clientMetadata = new Metadata();
        if (cookie) {
            logger.debug('cookie', cookie, { correlationId });
            clientMetadata.add('cookie', cookie);
        }
        request.params = { ...request.params, metadata: clientMetadata };

        server.call(request, (error, response) => {
            if (error) {
                logger.error('Failed request', {
                    error,
                    correlationId,
                    request,
                });

                // If err is an Error, then it is not a JSON-RPC error.
                if (error instanceof Error) {
                    return next(error);
                }

                res.status(400);
                res.send(error);
                return;
            }

            if (response) {
                const { result, ...rest } = response;
                const actualResponse = { ...rest, result: result.result };

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const setCookie = (result as ResultAndMetadata<any>).metadata
                    .get('set-cookie')
                    .map((x) => x.toString());
                if (setCookie.length) {
                    logger.debug('set-cookie:', setCookie);
                    res.setHeader('set-cookie', setCookie);
                }

                logger.info('Successful request', { correlationId });
                return res.send(actualResponse);
            } else {
                logger.info('Successful request. Sent empty response', {
                    correlationId,
                });
                res.status(204);
                res.send('');
            }
        });
    });

    return app;
};

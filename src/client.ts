import { P2PClient } from '../grpc/concordium_p2p_rpc_grpc_pb';
import { ChannelCredentials, Metadata, ServiceError } from '@grpc/grpc-js';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';
import { ResultAndMetadata } from './types';

export default class NodeClient {
    client: P2PClient;

    metadata: Metadata;

    address: string;

    port: number;

    timeout: number;

    /**
     * Initialize a gRPC client for a specific concordium node.
     * @param address the ip address of the node, e.g. 127.0.0.1
     * @param port the port to use when econnecting to the node
     * @param credentials credentials to use to connect to the node
     * @param timeout milliseconds to wait before timing out
     * @param options optional options for the P2PClient
     */
    constructor(
        address: string,
        port: number,
        credentials: ChannelCredentials,
        metadata: Metadata,
        timeout: number,
        options?: Record<string, unknown>
    ) {
        if (timeout < 0 || !Number.isSafeInteger(timeout)) {
            throw new Error(
                'The timeout must be a positive integer, but was: ' + timeout
            );
        }

        this.address = address;
        this.port = port;
        this.timeout = timeout;
        this.metadata = metadata;
        this.client = new P2PClient(`${address}:${port}`, credentials, options);
    }

    sendRequest<T>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
        command: any,
        input: T,
        metadata: Metadata
    ): Promise<ResultAndMetadata> {
        const deadline = new Date(Date.now() + this.timeout);
        return new Promise((resolve, reject) => {
            this.client.waitForReady(deadline, (error) => {
                if (error) {
                    return reject(error);
                }

                const clientMetadata = this.metadata.clone();
                clientMetadata.merge(metadata);
                let serverMetadata: Metadata;
                const call: SurfaceCall = command.bind(this.client)(
                    input,
                    clientMetadata,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    async (err: ServiceError | null, response: any) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve({
                            result: response.serializeBinary(),
                            metadata: serverMetadata,
                        });
                    }
                );
                call.on('metadata', (m) => {
                    serverMetadata = m;
                });
            });
        });
    }
}

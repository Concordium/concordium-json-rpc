import { P2PClient } from '../grpc/concordium_p2p_rpc_grpc_pb';
import { ChannelCredentials, Metadata, ServiceError } from '@grpc/grpc-js';

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    sendRequest<T>(command: any, input: T): Promise<Uint8Array> {
        const deadline = new Date(Date.now() + this.timeout);
        return new Promise<Uint8Array>((resolve, reject) => {
            this.client.waitForReady(deadline, (error) => {
                if (error) {
                    return reject(error);
                }

                return command.bind(this.client)(
                    input,
                    this.metadata,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (err: ServiceError | null, response: any) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve(response.serializeBinary());
                    }
                );
            });
        });
    }
}

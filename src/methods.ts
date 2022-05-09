import { JSONRPCCallbackTypePlain, MethodLike } from 'jayson';
import { AccountAddress, JsonResponse } from '../grpc/concordium_p2p_rpc_pb';
import { AccountAddress as ConcordiumAccountAddress } from '@concordium/node-sdk';
import NodeClient from './client';
import { invalidParameterError } from './errors';

class JsonRpcMethods {
    nodeClient: NodeClient;

    constructor(client: NodeClient) {
        this.nodeClient = client;
    }

    async getNextAccountNonce(
        params: { address: string },
        callback: JSONRPCCallbackTypePlain
    ) {
        if (!params.address) {
            return invalidParameterError(
                "Missing 'address' parameter",
                callback
            );
        }

        try {
            new ConcordiumAccountAddress(params.address);
        } catch {
            return invalidParameterError(
                'The provided account address [' +
                    params.address +
                    '] is invalid',
                callback
            );
        }

        const accountAddressObject = new AccountAddress();
        accountAddressObject.setAccountAddress(params.address);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getNextAccountNonce,
                accountAddressObject
            )
            .then((result) => {
                return callback(
                    null,
                    JsonResponse.deserializeBinary(result).getValue()
                );
            })
            .catch((e) => callback(e, null));
    }
}

export default function getJsonRpcMethods(nodeClient: NodeClient): {
    [methodName: string]: MethodLike;
} {
    const jsonRpcMethods = new JsonRpcMethods(nodeClient);

    return {
        getNextAccountNonce: (
            params: { address: string },
            callback: JSONRPCCallbackTypePlain
        ) => jsonRpcMethods.getNextAccountNonce(params, callback),
    };
}

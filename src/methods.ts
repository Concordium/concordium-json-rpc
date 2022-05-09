import { JSONRPCCallbackTypePlain, MethodLike } from 'jayson';
import {
    AccountAddress,
    JsonResponse,
    TransactionHash,
} from '../grpc/concordium_p2p_rpc_pb';
import NodeClient from './client';
import { invalidParameterError, missingParameterError } from './errors';
import { isValidAccountAddress, isValidHash } from './validation';

class JsonRpcMethods {
    nodeClient: NodeClient;

    constructor(client: NodeClient) {
        this.nodeClient = client;
    }

    async getNextAccountNonce(
        params: { address: string },
        callback: JSONRPCCallbackTypePlain
    ) {
        const address = params.address;
        if (!address) {
            return missingParameterError('address', callback);
        } else if (!isValidAccountAddress(address)) {
            return invalidParameterError(
                'The provided account address [' +
                    params.address +
                    '] is invalid',
                callback
            );
        }

        const accountAddressObject = new AccountAddress();
        accountAddressObject.setAccountAddress(address);

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

    getTransactionStatus(
        params: { transactionHash: string },
        callback: JSONRPCCallbackTypePlain
    ) {
        const transactionHash = params.transactionHash;
        if (!transactionHash) {
            return missingParameterError('transactionHash', callback);
        } else if (!isValidHash(transactionHash)) {
            return invalidParameterError(
                'The provided transaction hash [' +
                    transactionHash +
                    '] is not a valid hash',
                callback
            );
        }

        const transactionHashObject = new TransactionHash();
        transactionHashObject.setTransactionHash(transactionHash);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getTransactionStatus,
                transactionHashObject
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
        getTransactionStatus: (
            params: { transactionHash: string },
            callback: JSONRPCCallbackTypePlain
        ) => jsonRpcMethods.getTransactionStatus(params, callback),
    };
}

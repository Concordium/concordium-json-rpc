import { JSONRPCCallbackTypePlain, MethodLike } from 'jayson';
import {
    AccountAddress,
    BoolResponse,
    JsonResponse,
    SendTransactionRequest,
    TransactionHash,
} from '../grpc/concordium_p2p_rpc_pb';
import NodeClient from './client';
import { invalidParameterError, missingParameterError } from './errors';
import {
    isValidAccountAddress,
    isValidBase64,
    isValidHash,
} from './validation';

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
        if (address === undefined) {
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
            .catch((e) => callback(e));
    }

    getTransactionStatus(
        params: { transactionHash: string },
        callback: JSONRPCCallbackTypePlain
    ) {
        const transactionHash = params.transactionHash;
        if (transactionHash === undefined) {
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
            .catch((e) => callback(e));
    }

    sendAccountTransaction(
        params: { transaction: string },
        callback: JSONRPCCallbackTypePlain
    ) {
        const transaction = params.transaction;
        if (transaction === undefined) {
            return missingParameterError('transaction', callback);
        } else if (!isValidBase64(transaction)) {
            return invalidParameterError(
                'The provided transaction [' +
                    transaction +
                    '] is not a valid non-empty base64 encoded string',
                callback
            );
        }

        const serializedAccountTransaction = Buffer.from(transaction, 'base64');
        const sendTransactionRequest = new SendTransactionRequest();
        sendTransactionRequest.setNetworkId(100);
        sendTransactionRequest.setPayload(serializedAccountTransaction);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.sendTransaction,
                sendTransactionRequest
            )
            .then((result) => {
                return callback(
                    null,
                    BoolResponse.deserializeBinary(result).getValue()
                );
            })
            .catch((e) => callback(e));
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
        sendAccountTransaction: (
            params: { transaction: string },
            callback: JSONRPCCallbackTypePlain
        ) => jsonRpcMethods.sendAccountTransaction(params, callback),
    };
}

import { JSONRPCCallbackTypePlain, MethodLike } from 'jayson';
import {
    AccountAddress,
    BoolResponse,
    GetAddressInfoRequest,
    JsonResponse,
    SendTransactionRequest,
    TransactionHash,
} from '../grpc/concordium_p2p_rpc_pb';
import NodeClient from './client';
import { invalidParameterError, nodeError } from './errors';
import {
    isValidAccountAddress,
    isValidBase64,
    isValidContractAddress,
    isValidHash,
    validateParams,
} from './validation';
import JSONbig from 'json-bigint';

function parseJsonResponse(response: Uint8Array) {
    return JSONbig.parse(JsonResponse.deserializeBinary(response).getValue());
}

class JsonRpcMethods {
    nodeClient: NodeClient;

    constructor(client: NodeClient) {
        this.nodeClient = client;
    }

    async getNextAccountNonce(
        address: string,
        callback: JSONRPCCallbackTypePlain
    ) {
        if (!isValidAccountAddress(address)) {
            return invalidParameterError(
                'The provided account address [' + address + '] is invalid',
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
                return callback(null, parseJsonResponse(result));
            })
            .catch((e) => callback(e));
    }

    getTransactionStatus(
        transactionHash: string,
        callback: JSONRPCCallbackTypePlain
    ) {
        if (!isValidHash(transactionHash)) {
            return invalidParameterError(
                'The provided transaction hash [' +
                    transactionHash +
                    '] is invalid',
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
                return callback(null, parseJsonResponse(result));
            })
            .catch((e) => callback(e));
    }

    sendAccountTransaction(
        transaction: string,
        callback: JSONRPCCallbackTypePlain
    ) {
        if (!isValidBase64(transaction)) {
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
            .catch((e) => nodeError(e, callback));
    }

    getInstanceInfo(blockHash: string, address: string, callback: JSONRPCCallbackTypePlain) {
        if (!isValidContractAddress(address)) {
            return invalidParameterError(
                'The provided contract address [' + address + '] is invalid',
                callback
            );
        }
        if (!isValidHash(blockHash)) {
            return invalidParameterError(
                'The provided blockHash [' + blockHash + '] is invalid',
                callback
            );
        }

        const getAddressInfoRequest = new GetAddressInfoRequest();
        getAddressInfoRequest.setAddress(address);
        getAddressInfoRequest.setBlockHash(blockHash);

        this.nodeClient.sendRequest(this.nodeClient.client.getInstanceInfo, getAddressInfoRequest).then((result) => {
            return callback(null, parseJsonResponse(result));
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
        ) =>
            validateParams(params, ['address'], callback) &&
            jsonRpcMethods.getNextAccountNonce(params.address, callback),
        getTransactionStatus: (
            params: { transactionHash: string },
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['transactionHash'], callback) &&
            jsonRpcMethods.getTransactionStatus(
                params.transactionHash,
                callback
            ),
        sendAccountTransaction: (
            params: { transaction: string },
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['transaction'], callback) &&
            jsonRpcMethods.sendAccountTransaction(params.transaction, callback),
        getInstanceInfo: (
            params: { blockHash: string, address: string},
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['blockHash', 'address'], callback) &&
            jsonRpcMethods.getInstanceInfo(params.blockHash, params.address, callback),
    };
}

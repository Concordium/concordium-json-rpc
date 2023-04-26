import { JSONRPCCallbackTypePlain, MethodLike } from 'jayson';
import {
    AccountAddress,
    BlockHash,
    BoolResponse,
    GetAddressInfoRequest,
    JsonResponse,
    BytesResponse,
    SendTransactionRequest,
    TransactionHash,
    Empty,
    InvokeContractRequest,
    GetModuleSourceRequest,
    NodeInfoResponse,
} from '../grpc/concordium_p2p_rpc_pb';
import NodeClient from './client';
import { invalidParameterError, nodeError } from './errors';
import {
    isHex,
    isValidAccountAddress,
    isValidBase64,
    isValidCredentialId,
    isValidHash,
    isValidUInt64,
    isValidContractAddress,
    validateParams,
} from './validation';
import JSONbig from 'json-bigint';
import { ContractContext, ResultAndMetadata } from './types';
import { Metadata } from '@grpc/grpc-js';

interface WithMetadata {
    metadata: Metadata;
}

function parseJsonResponse({
    result,
    metadata,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ResultAndMetadata): ResultAndMetadata<any> {
    return {
        result: JSONbig.parse(
            JsonResponse.deserializeBinary(result).getValue()
        ),
        metadata,
    };
}

class JsonRpcMethods {
    nodeClient: NodeClient;

    constructor(client: NodeClient) {
        this.nodeClient = client;
    }

    async getNextAccountNonce(
        address: string,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
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
                accountAddressObject,
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    getTransactionStatus(
        transactionHash: string,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
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
                transactionHashObject,
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    sendTransaction(
        transaction: string,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
    ) {
        if (!isValidBase64(transaction)) {
            return invalidParameterError(
                'The provided transaction [' +
                    transaction +
                    '] is not a valid non-empty base64 encoded string',
                callback
            );
        }

        const serializedTransaction = Buffer.from(transaction, 'base64');
        const sendTransactionRequest = new SendTransactionRequest();
        sendTransactionRequest.setNetworkId(100);
        sendTransactionRequest.setPayload(serializedTransaction);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.sendTransaction,
                sendTransactionRequest,
                metadata
            )
            .then(({ result, metadata }) =>
                callback(null, {
                    result: BoolResponse.deserializeBinary(result).getValue(),
                    metadata,
                })
            )
            .catch((e) => nodeError(e, callback));
    }

    getInstanceInfo(
        blockHash: string,
        index: bigint | number,
        subindex: bigint | number,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
    ) {
        if (!isValidUInt64(index)) {
            return invalidParameterError(
                'The provided contract index [' +
                    JSON.stringify(index) +
                    '] is not a valid unsigned 64 bit integer',
                callback
            );
        }
        if (!isValidUInt64(subindex)) {
            return invalidParameterError(
                'The provided contract subindex [' +
                    JSON.stringify(subindex) +
                    '] is not a valid unsigned 64 bit integer',
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
        getAddressInfoRequest.setAddress(JSON.stringify({ index, subindex }));
        getAddressInfoRequest.setBlockHash(blockHash);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getInstanceInfo,
                getAddressInfoRequest,
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    getModuleSource(
        blockHash: string,
        moduleReference: string,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
    ) {
        if (!isValidHash(blockHash)) {
            return invalidParameterError(
                'The provided block hash [' + blockHash + '] is invalid',
                callback
            );
        }
        if (!isValidHash(moduleReference)) {
            return invalidParameterError(
                'The provided module reference [' +
                    moduleReference +
                    '] is invalid',
                callback
            );
        }

        const moduleSourceRequest = new GetModuleSourceRequest();
        moduleSourceRequest.setBlockHash(blockHash);
        moduleSourceRequest.setModuleRef(moduleReference);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getModuleSource,
                moduleSourceRequest,
                metadata
            )
            .then(({ result, metadata }) =>
                callback(null, {
                    result: Buffer.from(
                        BytesResponse.deserializeBinary(result).getValue()
                    ).toString('base64'),
                    metadata,
                })
            )
            .catch((e) => callback(e));
    }

    getConsensusStatus(callback: JSONRPCCallbackTypePlain, metadata: Metadata) {
        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getConsensusStatus,
                new Empty(),
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    nodeInfo(callback: JSONRPCCallbackTypePlain, metadata: Metadata) {
        this.nodeClient
            .sendRequest(this.nodeClient.client.nodeInfo, new Empty(), metadata)
            .then(({ result, metadata }) =>
                callback(null, {
                    result: JSON.stringify(
                        NodeInfoResponse.deserializeBinary(result).toObject()
                    ),
                    metadata,
                })
            )
            .catch((e) => callback(e));
    }

    getAccountInfo(
        blockHash: string,
        address: string,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
    ) {
        if (!isValidHash(blockHash)) {
            return invalidParameterError(
                'The provided blockHash [' + blockHash + '] is invalid',
                callback
            );
        }
        if (!isValidAccountAddress(address) && !isValidCredentialId(address)) {
            return invalidParameterError(
                'The provided address [' +
                    address +
                    '] is not a valid account address or credential registration id',
                callback
            );
        }

        const getAddressInfoRequest = new GetAddressInfoRequest();
        getAddressInfoRequest.setAddress(address);
        getAddressInfoRequest.setBlockHash(blockHash);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getAccountInfo,
                getAddressInfoRequest,
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    getCryptographicParameters(
        blockHash: string,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
    ) {
        if (!isValidHash(blockHash)) {
            return invalidParameterError(
                'The provided blockHash [' + blockHash + '] is invalid',
                callback
            );
        }

        const blockHashObject = new BlockHash();
        blockHashObject.setBlockHash(blockHash);

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.getCryptographicParameters,
                blockHashObject,
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    invokeContract(
        blockHash: string,
        context: ContractContext,
        callback: JSONRPCCallbackTypePlain,
        metadata: Metadata
    ) {
        if (!isValidHash(blockHash)) {
            return invalidParameterError(
                'The provided blockHash [' + blockHash + '] is invalid',
                callback
            );
        }
        if (!isValidContractAddress(context.contract)) {
            return invalidParameterError(
                'The provided contract address [' +
                    JSON.stringify(context.contract) +
                    '] for the contract is invalid',
                callback
            );
        }
        if (
            context.invoker &&
            ((context.invoker.type !== 'AddressContract' &&
                context.invoker.type !== 'AddressAccount') ||
                (context.invoker.type === 'AddressContract' &&
                    !isValidContractAddress(context.invoker.address)) ||
                (context.invoker.type === 'AddressAccount' &&
                    !isValidAccountAddress(context.invoker.address)))
        ) {
            return invalidParameterError(
                'The provided invoker [' +
                    JSON.stringify(context.invoker) +
                    '] is invalid',
                callback
            );
        }
        if (context.amount && !isValidUInt64(context.amount)) {
            return invalidParameterError(
                'The provided microCCD amount [' +
                    JSON.stringify(context.amount) +
                    ']  is not a valid unsigned 64 bit integer',
                callback
            );
        }
        if (context.energy && !isValidUInt64(context.energy)) {
            return invalidParameterError(
                'The provided energy [' +
                    JSON.stringify(context.energy) +
                    '] is not a valid unsigned 64 bit integer',
                callback
            );
        }
        if (context.parameter && !isHex(context.parameter)) {
            return invalidParameterError(
                'The provided parameter [' +
                    context.parameter +
                    '] is not a valid hex string',
                callback
            );
        }

        const requestObject = new InvokeContractRequest();
        requestObject.setBlockHash(blockHash);
        // Amount is expected to be a string, unlike other uint64 values.
        requestObject.setContext(
            JSON.stringify({
                ...context,
                amount: context.amount?.toString(),
            })
        );

        this.nodeClient
            .sendRequest(
                this.nodeClient.client.invokeContract,
                requestObject,
                metadata
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }
}

export default function getJsonRpcMethods(nodeClient: NodeClient): {
    [methodName: string]: MethodLike;
} {
    const jsonRpcMethods = new JsonRpcMethods(nodeClient);

    return {
        getNextAccountNonce: (
            params: { address: string } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['address'], callback) &&
            jsonRpcMethods.getNextAccountNonce(
                params.address,
                callback,
                params.metadata
            ),
        getTransactionStatus: (
            params: { transactionHash: string } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['transactionHash'], callback) &&
            jsonRpcMethods.getTransactionStatus(
                params.transactionHash,
                callback,
                params.metadata
            ),
        sendTransaction: (
            params: { transaction: string } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['transaction'], callback) &&
            jsonRpcMethods.sendTransaction(
                params.transaction,
                callback,
                params.metadata
            ),
        getInstanceInfo: (
            params: {
                blockHash: string;
                index: bigint | number;
                subindex: bigint | number;
            } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(
                params,
                ['blockHash', 'index', 'subindex'],
                callback
            ) &&
            jsonRpcMethods.getInstanceInfo(
                params.blockHash,
                params.index,
                params.subindex,
                callback,
                params.metadata
            ),
        getConsensusStatus: (
            params: WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) => jsonRpcMethods.getConsensusStatus(callback, params.metadata),
        nodeInfo: (params: WithMetadata, callback: JSONRPCCallbackTypePlain) =>
            jsonRpcMethods.nodeInfo(callback, params.metadata),
        getAccountInfo: (
            params: { address: string; blockHash: string } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['address', 'blockHash'], callback) &&
            jsonRpcMethods.getAccountInfo(
                params.blockHash,
                params.address,
                callback,
                params.metadata
            ),
        getCryptographicParameters: (
            params: { blockHash: string } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['blockHash'], callback) &&
            jsonRpcMethods.getCryptographicParameters(
                params.blockHash,
                callback,
                params.metadata
            ),
        invokeContract: (
            params: {
                blockHash: string;
                context: ContractContext;
            } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['blockHash', 'context'], callback) &&
            validateParams(params.context, ['contract', 'method'], callback) &&
            jsonRpcMethods.invokeContract(
                params.blockHash,
                params.context,
                callback,
                params.metadata
            ),
        getModuleSource: (
            params: {
                blockHash: string;
                moduleReference: string;
            } & WithMetadata,
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(
                params,
                ['blockHash', 'moduleReference'],
                callback
            ) &&
            jsonRpcMethods.getModuleSource(
                params.blockHash,
                params.moduleReference,
                callback,
                params.metadata
            ),
    };
}

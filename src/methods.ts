import { JSONRPCCallbackTypePlain, MethodLike } from 'jayson';
import {
    AccountAddress,
    BlockHash,
    BoolResponse,
    GetAddressInfoRequest,
    JsonResponse,
    SendTransactionRequest,
    TransactionHash,
    Empty,
    InvokeContractRequest,
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

type ContractAddress = {
    index: number | bigint;
    subindex: number | bigint;
};
type Invoker =
    | {
          type: 'AddressContract';
          address: ContractAddress;
      }
    | {
          type: 'AddressAccount';
          address: string;
      }
    | null;

interface ContractContext {
    contract: ContractAddress;
    method: string;
    invoker?: Invoker;
    amount?: bigint | number;
    parameter?: string;
    energy?: bigint | number;
}

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

    getInstanceInfo(
        blockHash: string,
        index: bigint | number,
        subindex: bigint | number,
        callback: JSONRPCCallbackTypePlain
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
                getAddressInfoRequest
            )
            .then((result) => {
                return callback(null, parseJsonResponse(result));
            })
            .catch((e) => callback(e));
    }

    getConsensusStatus(callback: JSONRPCCallbackTypePlain) {
        this.nodeClient
            .sendRequest(this.nodeClient.client.getConsensusStatus, new Empty())
            .then((result) => {
                return callback(null, parseJsonResponse(result));
            })
            .catch((e) => callback(e));
    }

    getAccountInfo(
        blockHash: string,
        address: string,
        callback: JSONRPCCallbackTypePlain
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
                getAddressInfoRequest
            )
            .then((result) => {
                return callback(null, parseJsonResponse(result));
            })
            .catch((e) => callback(e));
    }

    getCryptographicParameters(
        blockHash: string,
        callback: JSONRPCCallbackTypePlain
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
                blockHashObject
            )
            .then((result) => callback(null, parseJsonResponse(result)))
            .catch((e) => callback(e));
    }

    invokeContract(
        blockHash: string,
        context: ContractContext,
        callback: JSONRPCCallbackTypePlain
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
                amount: context.amount && context.amount.toString(),
            })
        );

        this.nodeClient
            .sendRequest(this.nodeClient.client.invokeContract, requestObject)
            .then((result) => {
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
            params: {
                blockHash: string;
                index: bigint | number;
                subindex: bigint | number;
            },
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
                callback
            ),
        getConsensusStatus: (
            _params: Record<string, never>,
            callback: JSONRPCCallbackTypePlain
        ) => jsonRpcMethods.getConsensusStatus(callback),
        getAccountInfo: (
            params: { address: string; blockHash: string },
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['address', 'blockHash'], callback) &&
            jsonRpcMethods.getAccountInfo(
                params.blockHash,
                params.address,
                callback
            ),
        getCryptographicParameters: (
            params: { blockHash: string },
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['blockHash'], callback) &&
            jsonRpcMethods.getCryptographicParameters(
                params.blockHash,
                callback
            ),
        invokeContract: (
            params: { blockHash: string; context: ContractContext },
            callback: JSONRPCCallbackTypePlain
        ) =>
            validateParams(params, ['blockHash', 'context'], callback) &&
            validateParams(params.context, ['contract', 'method'], callback) &&
            jsonRpcMethods.invokeContract(
                params.blockHash,
                params.context,
                callback
            ),
    };
}

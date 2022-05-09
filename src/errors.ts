import { JSONRPCCallbackTypePlain } from 'jayson';

const invalidParamsCode = -32602;

/**
 * Returns a jayson callback with an invalid parameters error.
 * @param message the message part of the error returned to the caller
 * @param callback the jayson callback function
 */
export function invalidParameterError(
    message: string,
    callback: JSONRPCCallbackTypePlain
): void {
    return callback({ message, code: invalidParamsCode });
}

/**
 * Returns a jayson callback with a missing parameter error.
 * @param name the name of the missing parameter
 * @param callback the jayson callback function
 */
export function missingParameterError(
    name: string,
    callback: JSONRPCCallbackTypePlain
): void {
    const message = `Missing '${name}' parameter`;
    return invalidParameterError(message, callback);
}

/**
 * Returns a jayson callback with an error that has been received from the node. It
 * unwraps the error from the node and ensures that the details are put in the
 * message field as required by JSON-RPC.
 * @param error the error message from the node
 * @param callback the jayson callback function
 */
export function nodeError(
    error: { details: string },
    callback: JSONRPCCallbackTypePlain
): void {
    const code = -29000;
    return callback({ message: error.details, code });
}

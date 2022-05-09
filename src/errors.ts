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
    return callback({ message, code: invalidParamsCode }, null);
}

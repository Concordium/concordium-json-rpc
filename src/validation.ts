import { AccountAddress } from '@concordium/node-sdk';
import { JSONRPCCallbackTypePlain } from 'jayson';
import { invalidParameterError, missingParameterError } from './errors';

/**
 * Checks if the input string is a valid hexadecimal string.
 * @param str the string to check for hexadecimal
 */
export function isHex(str: string): boolean {
    return /^[A-F0-9]+$/i.test(str);
}

/**
 * Checks whether the input string looks to be a valid hash,
 * i.e. it has length 64 and consists of hexadecimal characters.
 * @param hash the string to check
 * @returns false if the string cannot be a valid hash, otherwise true
 */
export function isValidHash(hash: string): boolean {
    return hash.length === 64 && isHex(hash);
}

/**
 * Checks whether an address is a valid address for a Concordium
 * account.
 * @param address the address to validate
 * @returns true if the address is valid, otherwise false
 */
export function isValidAccountAddress(address: string): boolean {
    try {
        new AccountAddress(address);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks whether a string is a valid non-empty base64 encoded string.
 * @param input the string to validate as being base64
 * @returns true if the string is base64, otherwise false
 */
export function isValidBase64(input: string): boolean {
    if (input.length === 0) {
        return false;
    }
    const base64Regex =
        /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return base64Regex.test(input);
}

/**
 * Validates parameters of a request and returns a corresponding error if the parameter
 * object is missing or if an expected key is not present in the params object.
 * @param params the parameters to validate
 * @param keys the keys that are expected to be present in the params object
 * @param callback the jayson callback function
 * @returns true if the parameters validated as expected, otherwise false
 */
export function validateParams<T, K extends keyof T>(
    params: T,
    keys: K[],
    callback: JSONRPCCallbackTypePlain
): boolean {
    if (params === undefined) {
        invalidParameterError("The 'params' object is missing", callback);
        return false;
    }

    for (const key of keys) {
        if (params[key] === undefined) {
            missingParameterError(key as string, callback);
            return false;
        }
    }

    return true;
}

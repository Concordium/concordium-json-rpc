import { AccountAddress } from '@concordium/node-sdk';

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

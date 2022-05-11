# Concordium JSON-RPC proxy server API

The Concordium JSON-RPC proxy server allows for interacting with a node using the JSON-RPC 2.0 specification.

## Methods

### getNextAccountNonce

Returns the next account nonce for the account with the provided address.

#### Parameters
- `address` - the account address as a base58 string

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getNextAccountNonce",
    "params": {
        "address": "3KoNZL5xiFNpCyAvQnAZKNyB7NSxjZtBUdmoZhHXpHreY2Fvb4"
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "nonce": 1,
        "allFinal": true
    }
}
```

### getTransactionStatus
Returns the status of a submitted transaction with the provided transaction hash.

#### Parameters
- `transactionHash` - the hash of the transaction as a hex string

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getTransactionStatus",
    "params": {
        "transactionHash": "0afb1bf4f84cfb913eddb54c6542f4b63b762486f96e47bd7bbb04c0f8c263fc"
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "status": "finalized",
        "outcomes": {
            "a4ea006d7826d2a86e8422addc2346af3114bc18fd7ec0c3c9945946ee3db0f4": {
                "hash": "78afa7befce8cf3a55ba3456275967315862e1b8a86332ae8b19cbc08e370946",
                "sender": "3rLbG2MzYQzz3FWPMvktwZEPZnvAL9DzDfhRJ4Kt9soXFTgvvP",
                "cost": "18942",
                "energyCost": 501,
                "result": {
                    "events": [
                        {
                            "amount": "5000000",
                            "tag": "Transferred",
                            "to": {
                                "address": "4N6topVpynLNg7vocR3JVLb6vPoMLKVFHbikksUBzNjosjUfu2",
                                "type": "AddressAccount"
                            },
                            "from": {
                                "address": "3rLbG2MzYQzz3FWPMvktwZEPZnvAL9DzDfhRJ4Kt9soXFTgvvP",
                                "type": "AddressAccount"
                            }
                        }
                    ],
                    "outcome": "success"
                },
                "type": {
                    "contents": "transfer",
                    "type": "accountTransaction"
                },
                "index": 0
            }
        }
    }
}
```

### sendAccountTransaction

Sends an account transaction to a node.

#### Parameters
- `transaction` - base64 encoding of a signed account transaction

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "sendAccountTransaction",
    "params": {
        "transaction": "AAABAAEAAEDYMtcAlGVGIUE/VicCz7GtRPvTpwm4xicy6FSds0CpblXdVoOfxJbE2DHi/mNS1GK6gHSQYmICJRoPc2Lnz0oD8OdnyWx1BiXHSyOFGyzSZ9nl/dKY1cW1qRoJbng0DtgAAAAAAAAFfAAAAAAAAAH1AAAAKQAAAABie23oA7Tep/GZ0TjKmhwXBE78NRGgt/TpPUGOdcBiI5czrkzQAAAAAAAAAGQ="
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": true
}
```
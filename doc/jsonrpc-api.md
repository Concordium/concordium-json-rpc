# Concordium JSON-RPC proxy server API

The Concordium JSON-RPC proxy server allows for interacting with a node using the JSON-RPC 2.0 specification.

## Methods

### getNextAccountNonce

Returns the next account nonce for the account with the provided address.

#### Parameters
- `address` - the account address as a base58check string

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

### getConsensusStatus

Returns the current status of the chain's consensus layer.

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getConsensusStatus",
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "bestBlock": "5819344b00adbd8978b0e74043f76663ea78080df36fd0b8fb27931182f77b44",
        "genesisBlock": "b6078154d6717e909ce0da4a45a25151b592824f31624b755900a74429e3073d",
        "genesisTime": "2021-05-07T12:00:00Z",
        "slotDuration": 250,
        "epochDuration": 3600000,
        "lastFinalizedBlock": "5819344b00adbd8978b0e74043f76663ea78080df36fd0b8fb27931182f77b44",
        "bestBlockHeight": 3374215,
        "lastFinalizedBlockHeight": 3374215,
        "blocksReceivedCount": 25150,
        "blockLastReceivedTime": "2022-06-10T07:26:03.210123845Z",
        "blockReceiveLatencyEMA": 0.22034336143243416,
        "blockReceiveLatencyEMSD": 0.0864390313167573,
        "blockReceivePeriodEMA": 14.56057045349122,
        "blockReceivePeriodEMSD": 12.609771167389637,
        "blocksVerifiedCount": 25150,
        "blockLastArrivedTime": "2022-06-10T07:26:03.222477199Z",
        "blockArriveLatencyEMA": 0.23383788890808027,
        "blockArriveLatencyEMSD": 0.08616182706879714,
        "blockArrivePeriodEMA": 14.560443656438371,
        "blockArrivePeriodEMSD": 12.612616376218636,
        "transactionsPerBlockEMA": 0.21133968983190163,
        "transactionsPerBlockEMSD": 0.46090000026424316,
        "finalizationCount": 21581,
        "lastFinalizedTime": "2022-06-10T07:26:04.483473798Z",
        "finalizationPeriodEMA": 16.167798286157375,
        "finalizationPeriodEMSD": 14.026504502042274,
        "protocolVersion": 4,
        "genesisIndex": 3,
        "currentEraGenesisBlock": "96786a32535daf7da442e7676605877601414450f8bcf468b04ff899bf505db0",
        "currentEraGenesisTime": "2022-05-23T10:30:20.5Z"
    }
}
```

### getInstanceInfo

Returns information about the specified smart contract instance.

#### Parameters
- `blockHash` - hex encoding of a block's hash
- `index` - the index of the smart contract instance (uint64)
- `subindex` - the subindex of the smart contract instance (uint64)

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getInstanceInfo",
    "params": {
        "blockHash": "22aa0c3e223fd16a830a75aeabb78c0c3e5f1bed15b7e530272bfd2901d8a097",
        "index": 1,
        "subindex": 0
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "model": "0000000000",
        "owner": "3DJoe7aUwMwVmdFdRU2QsnJfsBbCmQu1QHvEg7YtWFZWmsoBXe",
        "amount": "0",
        "methods": [
            "counter.receive",
            "counter.receive_optimized"
        ],
        "name": "init_counter",
        "sourceModule": "7f60dc4d93e491750ed09d2abb379286c5af6f4aca2310c0b09c3275e181f4a4",
        "version": 0
    }
}
```

### getAccountInfo

Returns the account info of the account that matches the given accountAddress. The address can also be a credentialRegistrationId, in which case it is the account, which the credential is attached to, whose information is returned.

#### Parameters
- `address` - the account address as a base58check string or a hex encoded credentialRegistrationId.
- `blockHash` - hex encoding of a block's hash

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": {
        "blockHash": "4a5f642404314caafb1a4fb05705134cfdf064718292446abea44d1a29d6606f",
        "address": "3FVMj8WoA13m8Ha5JhZWfChugrCqbSbkjavU47yauu7a5YKNuP"
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "accountNonce": 4,
        "accountAmount": "1994731867",
        "accountReleaseSchedule": {
            "total": "0",
            "schedule": []
        },
        "accountCredentials": {
            "0": {
                "value": {
                    "contents": {
                        "ipIdentity": 0,
                        "regId": "95b29f9934384049d78c00eb7ce81f8abe28fabd4875f3c1486b1be0f48104baef5ec5d8b52769937f898db3c00f26c9",
                        "policy": {
                            "revealedAttributes": {},
                            "createdAt": "202206",
                            "validTo": "202306"
                        },
                        "credentialPublicKeys": {
                            "keys": {
                                "0": {
                                    "verifyKey": "9e268d981d02180090d03289c315d10166b6d4730eede7817d56f68f2bcd39d3",
                                    "schemeId": "Ed25519"
                                }
                            },
                            "threshold": 1
                        }
                    },
                    "type": "initial"
                },
                "v": 0
            }
        },
        "accountThreshold": 1,
        "accountEncryptedAmount": {
            "incomingAmounts": [],
            "selfAmount": "c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "startIndex": 0
        },
        "accountEncryptionKey": "b14cbfe44a02c6b1f78711176d5f437295367aa4f2a8c2551ee10d25a03adc69d61a332a058971919dad7312e1fc94c595b29f9934384049d78c00eb7ce81f8abe28fabd4875f3c1486b1be0f48104baef5ec5d8b52769937f898db3c00f26c9",
        "accountIndex": 48,
        "accountAddress": "3FVMj8WoA13m8Ha5JhZWfChugrCqbSbkjavU47yauu7a5YKNuP"
    }
}
```

### getCryptographicParameters

Returns information about the cryptographic parameters on the chain, at the specified block. Note that this result is versioned (using the v field).
For version 0 the result includes the `bulletproofGenerator`, `onChainCommitmentKey` and `genesisString`.

#### Parameters
- `blockHash` - hex encoding of a block's hash

#### Example
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getCryptographicParameters",
    "params": {
        "blockHash": "636bdef04778d777b4df989a0655f5b8b100a83b8c9f7df92e5e9c80b98864db"
    }
}
```
Response (values omitted for brevity):
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "value": {
            "bulletproofGenerators": "...",
            "onChainCommitmentKey": "...",
            "genesisString": "Concordium Mainnet Genesis Version 1"
        },
        "v": 0
    }
}
```

### invokeContract

Simulates a smart contract update, and returns information about the specified smart contract instance.

#### Parameters
- `blockHash` - hex encoding of a block's hash
- `context` - a collection of parameters used to invoke a contract
- `context.contract.index` - the index of the smart contract instance that should be invoked
- `context.contract.subindex` - the subindex of the smart contract instance that should be invoked
- `context.method` - the name of the method on the smart contract instance that should be invoked
- `context.invoker` - (Optional) contains either an account address or the index and subindex of a smart contract instance
- `context.parameter` - (Optional) the serialized parameter encoded as hex for the invoked function, defaults to no parameters
- `context.amount` - (Optional) the amount of microCCD's to transfer to the contract, defaults to `0` (uint64)
- `context.energy` - (Optional) the maximum amount of energy allowed in the execution of the contract, defaults to `10.000.000` (uint64)

#### Example
##### Using an account as the invoker
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "invokeContract",
    "params": {
        "blockHash": "a9ce1666a82411be7c3c3f8e18001227d6c19567f399fb7e88af856b43b51b3a",
        "context": {
            "method": "PiggyBank.view",
            "contract": {
                "index": 81,
                "subindex": 0
            },
            "invoker": {
                "type": "AddressAccount",
                "address": "3FVMj8WoA13m8Ha5JhZWfChugrCqbSbkjavU47yauu7a5YKNuP"
            },
            "amount": 0,
            "energy": 30000
        }
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "tag": "success",
        "usedEnergy": 502,
        "returnValue": "004d04000000000000",
        "events": [
            {
                "amount": "0",
                "tag": "Updated",
                "contractVersion": 1,
                "instigator": {
                    "address": "3FVMj8WoA13m8Ha5JhZWfChugrCqbSbkjavU47yauu7a5YKNuP",
                    "type": "AddressAccount"
                },
                "address": {
                    "subindex": 0,
                    "index": 81
                },
                "receiveName": "PiggyBank.view",
                "events": [],
                "message": ""
            }
        ]
    }
}
```
##### Using a contract as the invoker
Request:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "invokeContract",
    "params": {
        "blockHash": "a9ce1666a82411be7c3c3f8e18001227d6c19567f399fb7e88af856b43b51b3a",
        "context": {
            "method": "PiggyBank.view",
            "contract": {
                "index": 81,
                "subindex": 0
            },
            "invoker": {
                "type": "AddressContract",
                "address": {
                    "index": 5,
                    "subindex": 0
            }
        }
    }
    }
}
```
Response:
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "tag": "success",
        "usedEnergy": 502,
        "returnValue": "004d04000000000000",
        "events": [
            {
                "amount": "0",
                "tag": "Updated",
                "contractVersion": 1,
                "instigator": {
                    "address": {
                        "subindex": 0,
                        "index": 5
                    },
                    "type": "AddressContract"
                },
                "address": {
                    "subindex": 0,
                    "index": 81
                },
                "receiveName": "PiggyBank.view",
                "events": [],
                "message": ""
            }
        ]
    }
}
```

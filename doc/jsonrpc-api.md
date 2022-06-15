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

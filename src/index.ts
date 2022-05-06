import express from 'express';
import jayson, { JSONRPCCallbackTypePlain } from 'jayson';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const jsonRpcPort = Number(argv.port);

const app = express();

const server = new jayson.Server({
    add: function (
        params: { foo: number; bar: number },
        callback: JSONRPCCallbackTypePlain
    ) {
        callback(null, params.foo + params.bar);
    },
});

app.use(express.json());
app.post('/json-rpc', server.middleware());
app.listen(jsonRpcPort);

console.log(
    'Concordium JSON-RPC server is now listening on port ' + jsonRpcPort
);

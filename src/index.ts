import express from 'express';
import jayson, { JSONRPCCallbackTypePlain } from 'jayson';
import bodyParser from 'body-parser';

// TODO Port has to be configureable.
const port = 9095;
const app = express();

const server = new jayson.Server({
    add: function (
        params: { foo: number; bar: number },
        callback: JSONRPCCallbackTypePlain
    ) {
        callback(null, params.foo + params.bar);
    },
});

app.use(bodyParser.json());
app.post('/json-rpc', server.middleware());
app.listen(port);

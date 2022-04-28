import express from 'express';
import jayson, { JSONRPCCallbackTypePlain } from 'jayson';
import bodyPaser from 'body-parser';

// TODO Port has to be configureable.
const port = 9090;
const app = express();

const server = new jayson.Server({
    add: function (
        params: { foo: number; bar: number },
        callback: JSONRPCCallbackTypePlain
    ) {
        callback(null, params.foo + params.bar);
    },
});

app.use(bodyPaser.json());
app.post('/json-rpc', server.middleware());
app.listen(port);

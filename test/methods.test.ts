import server from '../src/server';
import request from 'supertest';

const app = server('127.0.0.1', 10000, 5000);
const jsonRpcServer = app.listen(11555);

function createRequest(method: string, params?: { [key: string]: string }) {
    return {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
    };
}

afterAll(() => {
    jsonRpcServer.close();
});

test('missing params fails', async () => {
    const addressRequestWithMissingParam = createRequest('getNextAccountNonce');
    const response = await request(app)
        .post('/json-rpc')
        .send(addressRequestWithMissingParam);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain(
        "The 'params' object is missing"
    );
});

test('get next account nonce with missing address fails', async () => {
    const addressRequestWithMissingParam = createRequest(
        'getNextAccountNonce',
        { someWrongParam: 'value' }
    );
    const response = await request(app)
        .post('/json-rpc')
        .send(addressRequestWithMissingParam);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain(
        "Missing 'address' parameter"
    );
});

test('get next account nonce with invalid address fails', async () => {
    const addressRequestWithInvalidAddress = createRequest(
        'getNextAccountNonce',
        { address: '4RiJakUMX1Ncj7u8AoYTXBGzV4FcGiRu5JZaZijKgY3UMqbwUb' }
    );
    const response = await request(app)
        .post('/json-rpc')
        .send(addressRequestWithInvalidAddress);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain(
        'The provided account address'
    );
    expect(response.body.error.message).toContain('is invalid');
});

test('get transaction status with missing transaction hash fails', async () => {
    const transactionStatusRequestWithMissingParam = createRequest(
        'getTransactionStatus',
        { someWrongParam: 'value' }
    );
    const response = await request(app)
        .post('/json-rpc')
        .send(transactionStatusRequestWithMissingParam);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain(
        "Missing 'transactionHash' parameter"
    );
});

test('get transaction status with invalid transaction hash fails', async () => {
    const transactionStatusRequestWithInvalidParam = createRequest(
        'getTransactionStatus',
        { transactionHash: 'ThisIsNotAValidTransactionHash' }
    );
    const response = await request(app)
        .post('/json-rpc')
        .send(transactionStatusRequestWithInvalidParam);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain(
        'The provided transaction hash'
    );
    expect(response.body.error.message).toContain('is invalid');
});

test('send an account transaction with missing transaction fails', async () => {
    const sendAccountTransactionWithInvalidTransaction = createRequest(
        'sendAccountTransaction',
        { someWrongParam: 'value!' }
    );
    const response = await request(app)
        .post('/json-rpc')
        .send(sendAccountTransactionWithInvalidTransaction);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain(
        "Missing 'transaction' parameter"
    );
});

test('send an account transaction with a wrong encoding fails', async () => {
    const sendAccountTransactionWithInvalidTransaction = createRequest(
        'sendAccountTransaction',
        { transaction: 'ThisIsNotBase64Encoded!' }
    );
    const response = await request(app)
        .post('/json-rpc')
        .send(sendAccountTransactionWithInvalidTransaction);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(-32602);
    expect(response.body.error.message).toContain('The provided transaction');
    expect(response.body.error.message).toContain(
        'is not a valid non-empty base64 encoded string'
    );
});

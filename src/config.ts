import minimist from 'minimist';

// Parse parameters that defines how to set up the server.
const argv = minimist(process.argv.slice(2));
export const jsonRpcPort = Number(argv.port);
export const nodeAddress: string = argv.nodeAddress;
export const nodePort = Number(argv.nodePort);
export const nodeTimeout = Number(argv.nodeTimeout);
export const useTLS = Boolean(argv.tls);
export const logLevel: string = argv.log;
export const logLocation: string = argv.logLocation;

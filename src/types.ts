import { Metadata } from '@grpc/grpc-js';

type ContractAddress = {
    index: number | bigint;
    subindex: number | bigint;
};

type Invoker =
    | {
          type: 'AddressContract';
          address: ContractAddress;
      }
    | {
          type: 'AddressAccount';
          address: string;
      }
    | null;

export interface ContractContext {
    contract: ContractAddress;
    method: string;
    invoker?: Invoker;
    amount?: bigint | number;
    parameter?: string;
    energy?: bigint | number;
}

// Used as the return type for jayson methods, so that we can get the metadata from the node when we create the response.
export interface ResultAndMetadata<ResultType = Uint8Array> {
    result: ResultType;
    metadata: Metadata;
}

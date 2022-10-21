import { Metadata } from "@grpc/grpc-js";

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

export interface ResultAndMetadata<ResultType = Uint8Array> {
    result: ResultType;
    metadata: Metadata;
};

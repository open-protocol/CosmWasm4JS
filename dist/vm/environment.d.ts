import { BackendApi, Storage, Querier } from "./backend";
export declare class GasConfig {
    GAS_PER_US: bigint;
    secp256k1VerifyCost: bigint;
    secp256k1RecoverPubkeyCost: bigint;
    ed25519VerifyCost: bigint;
    ed25519BatchVerifyCost: bigint;
    ed25519BatchVerifyOnePubkeyCost: bigint;
}
export declare class GasState {
    gasLimit: bigint;
    externallyUsedGas: bigint;
    static withLimit(gasLimit: bigint): GasState;
}
export declare class Environment<A extends BackendApi, S extends Storage, Q extends Querier> {
    memory: WebAssembly.Memory | null | undefined;
    api: A;
    gasConfig: GasConfig;
    data: ContextData<S, Q>;
    constructor(api: A, gasLimit: bigint);
}
export declare class ContextData<S extends Storage, Q extends Querier> {
    gasState: GasState;
    storage: S | null | undefined;
    storageReadonly: boolean;
    callDepth: number;
    querier: Q | null | undefined;
    instance: WebAssembly.Instance | null | undefined;
    constructor(gasLimit: bigint);
}

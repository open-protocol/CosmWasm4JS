/// <reference types="node" />
import { Backend, BackendApi, Storage, Querier } from "./backend.js";
import { Environment } from "./environment.js";
export interface InstanceOption {
    gasLimit: bigint;
    printDebug: boolean;
}
export declare class Instance<A extends BackendApi, S extends Storage, Q extends Querier> {
    inner: WebAssembly.Instance;
    env: Environment<A, S, Q>;
    constructor(instance: WebAssembly.Instance, api: A, gasLimit: bigint);
    static fromCode<A extends BackendApi, S extends Storage, Q extends Querier>(code: Buffer, backend: Backend<A, S, Q>, options: InstanceOption, memoryLimit: number): Promise<Instance<A, S, Q>>;
    static fromModule<A extends BackendApi, S extends Storage, Q extends Querier>(module: WebAssembly.Module, memory: WebAssembly.Memory, backend: Backend<A, S, Q>, gasLimit: bigint, printDebug: boolean): Instance<A, S, Q>;
}

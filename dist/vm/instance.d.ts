/// <reference types="node" />
import { BackendApi, Querier } from "./backend.js";
export declare class Instance {
    inner: WebAssembly.Instance;
    store: Map<string, Buffer>;
    api: BackendApi;
    querier: Querier;
    constructor(instance: WebAssembly.Instance, store: Map<string, Buffer>, api: BackendApi, querier: Querier);
    static fromCode(code: Buffer, store: Map<string, Buffer>, api: BackendApi, querier: Querier): Promise<Instance>;
    static fromModule(module: WebAssembly.Module, memory: WebAssembly.Memory, store: Map<string, Buffer>, api: BackendApi, querier: Querier): Instance;
}

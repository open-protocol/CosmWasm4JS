/// <reference types="node" />
import { Backend } from "./backend.js";
export declare class Instance {
    inner: WebAssembly.Instance;
    backend: Backend;
    constructor(instance: WebAssembly.Instance, backend: Backend);
    static fromCode(code: Buffer, backend: Backend): Promise<Instance>;
    static fromModule(module: WebAssembly.Module, memory: WebAssembly.Memory, backend: Backend): Instance;
}

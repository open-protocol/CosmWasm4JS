/// <reference types="node" />
export declare class GasInfo {
    cost: bigint;
    externallyUsed: bigint;
    constructor(cost: bigint, externallyUsed: bigint);
    static withCost(amount: bigint): GasInfo;
    static withExternallyUsed(amount: bigint): GasInfo;
}
export declare class Backend<A extends BackendApi, S extends Storage, Q extends Querier> {
    api: A;
    storage: S;
    querier: Q;
    constructor(api: A, storage: S, querier: Q);
}
export interface Storage {
    get: (key: Buffer) => Buffer;
    set: (key: Buffer, value: Buffer) => void;
    remove: (key: Buffer) => void;
}
export interface BackendApi {
    canonicalAddress: (human: string) => Buffer;
    humanAddress: (canonical: Buffer) => string;
}
export interface Querier {
    queryRaw: (request: Buffer) => Buffer;
}

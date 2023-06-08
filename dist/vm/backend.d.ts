/// <reference types="node" />
export declare class Backend {
    api: BackendApi;
    storage: Storage;
    querier: Querier;
    constructor(api: BackendApi, storage: Storage, querier: Querier);
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

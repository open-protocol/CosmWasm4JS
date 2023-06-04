/// <reference types="node" />
export interface BackendApi {
    canonicalAddress: (human: string) => Buffer;
    humanAddress: (canonical: Buffer) => string;
}
export interface Querier {
    queryRaw: (request: Buffer) => Buffer;
}

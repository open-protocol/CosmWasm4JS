/// <reference types="node" />
export declare function readRegion(memory: WebAssembly.Memory, ptr: number, maxLength: number): Buffer;
export declare function writeRegion(memory: WebAssembly.Memory, ptr: number, data: Buffer): void;
export interface Region {
    offset: number;
    capacity: number;
    length: number;
}
export declare function getRegion(memory: WebAssembly.Memory, ptr: number): Region;
export declare function setRegion(memory: WebAssembly.Memory, ptr: number, data: Region): void;

export declare class VmError implements Error {
    name: string;
    message: string;
    stack?: string;
    constructor(name: string, message: string);
    static aborted: (msg: string) => VmError;
    static runtimeErr: (msg: string) => VmError;
}

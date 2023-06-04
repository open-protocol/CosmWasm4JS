export declare class CommunicationError implements Error {
    name: string;
    message: string;
    stack?: string;
    constructor(name: string, message: string);
    static zeroAddress: () => CommunicationError;
    static regionLengthTooBig: (length: number, maxLength: number) => CommunicationError;
}

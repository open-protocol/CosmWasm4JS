export class CommunicationError {
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
}
CommunicationError.zeroAddress = () => {
    return new CommunicationError("ZeroAddress", "Got a zero Wasm address");
};
CommunicationError.regionLengthTooBig = (length, maxLength) => {
    return new CommunicationError("RegionLengthTooBig", `Region length too big. Got ${length}, limit ${maxLength}`);
};
//# sourceMappingURL=communication_error.js.map
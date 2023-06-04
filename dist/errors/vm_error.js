export class VmError {
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
}
VmError.aborted = (msg) => {
    return new VmError("Aborted", msg);
};
VmError.runtimeErr = (msg) => {
    return new VmError("RuntimeErr", `Error executing Wasm: ${msg}`);
};
//# sourceMappingURL=vm_error.js.map
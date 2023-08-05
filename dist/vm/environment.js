export class GasConfig {
    constructor() {
        this.GAS_PER_US = 1000000000n;
        this.secp256k1VerifyCost = 154n * this.GAS_PER_US;
        this.secp256k1RecoverPubkeyCost = 162n * this.GAS_PER_US;
        this.ed25519VerifyCost = 63n * this.GAS_PER_US;
        this.ed25519BatchVerifyCost = (63n * this.GAS_PER_US) / 2n;
        this.ed25519BatchVerifyOnePubkeyCost = (63n * this.GAS_PER_US) / 4n;
    }
}
export class GasState {
    static withLimit(gasLimit) {
        return {
            gasLimit,
            externallyUsedGas: 0n,
        };
    }
}
export class Environment {
    constructor(api, gasLimit) {
        this.memory = null;
        this.api = api;
        this.gasConfig = new GasConfig();
        this.data = new ContextData(gasLimit);
    }
}
export class ContextData {
    constructor(gasLimit) {
        this.gasState = GasState.withLimit(gasLimit);
        this.storage = null;
        this.storageReadonly = true;
        this.callDepth = 0;
        this.querier = null;
        this.instance = null;
    }
}
//# sourceMappingURL=environment.js.map
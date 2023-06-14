export class GasInfo {
    constructor(cost, externallyUsed) {
        this.cost = cost;
        this.externallyUsed = externallyUsed;
    }
    static withCost(amount) {
        return new GasInfo(amount, 0n);
    }
    static withExternallyUsed(amount) {
        return new GasInfo(0n, amount);
    }
}
export class Backend {
    constructor(api, storage, querier) {
        this.api = api;
        this.storage = storage;
        this.querier = querier;
    }
}
//# sourceMappingURL=backend.js.map
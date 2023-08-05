export class GasInfo {
    constructor(cost, externallyUsed) {
        this.cost = cost;
        this.externallyUsed = externallyUsed;
    }
    static withCost(amount) {
        return {
            cost: amount,
            externallyUsed: 0n,
        };
    }
    static withExternallyUsed(amount) {
        return {
            cost: 0n,
            externallyUsed: amount,
        };
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
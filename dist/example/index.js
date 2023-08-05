import { callExecute, callInstantiate, callQuery, Backend, Instance, } from "../vm/index.js";
import fs from "fs";
class MockBackendApi {
    canonicalAddress(human) {
        return Buffer.from(human, "base64url");
    }
    humanAddress(canonical) {
        return canonical.toString("base64url");
    }
}
class MockQuerier {
    queryRaw(request) {
        return Buffer.allocUnsafe(0);
    }
}
class MockStorage {
    constructor() {
        this.data = new Map();
    }
    get(key) {
        return this.data.get(key.toString("base64url"));
    }
    set(key, value) {
        this.data.set(key.toString("base64url"), value);
    }
    remove(key) {
        this.data.delete(key.toString("base64url"));
    }
}
(async () => {
    try {
        const code = fs.readFileSync("./contracts/cw20.wasm");
        const backend = new Backend(new MockBackendApi(), new MockStorage(), new MockQuerier());
        const options = {
            gasLimit: 1000000000000n,
            printDebug: true,
        };
        const memoryLimit = 16384;
        const instance = await Instance.fromCode(code, backend, options, memoryLimit);
        const env = {
            block: {
                height: 1,
                time: new Date().getUTCMilliseconds().toString(),
                chain_id: "chainid",
            },
            transaction: null,
            contract: {
                address: "contractaddr",
            },
        };
        const info = {
            sender: "W7HxkpaKwXif1gwj46gbNba7xKx9s8xUahh-Q_iQTdA",
            funds: [
                {
                    denom: "opc",
                    amount: 0n.toString(),
                },
            ],
        };
        const inistantiateMsg = {
            name: "opentoken",
            symbol: "opt",
            decimals: 9,
            initial_balances: [
                {
                    address: "W7HxkpaKwXif1gwj46gbNba7xKx9s8xUahh-Q_iQTdA",
                    amount: "1000000000",
                },
            ],
            mint: null,
            marketing: null,
        };
        let res = callInstantiate(instance, env, info, Buffer.from(JSON.stringify(inistantiateMsg), "utf8"));
        let resJson = JSON.parse(res.toString("utf8"));
        console.log(resJson);
        let queryMsg = {
            balance: {
                address: "W7HxkpaKwXif1gwj46gbNba7xKx9s8xUahh-Q_iQTdA",
            },
        };
        res = callQuery(instance, env, Buffer.from(JSON.stringify(queryMsg), "utf8"));
        resJson = JSON.parse(res.toString("utf8"));
        console.log(Buffer.from(resJson["ok"], "base64url").toString("utf8"));
        const executeMsg = {
            transfer: {
                recipient: "gBdRgmpzvixp2Nnf76LLTCrSYpuJfGp3TTGm8MaxSxo",
                amount: "1000",
            },
        };
        res = callExecute(instance, env, info, Buffer.from(JSON.stringify(executeMsg), "utf8"));
        resJson = JSON.parse(res.toString("utf8"));
        console.log(resJson);
        queryMsg = {
            balance: {
                address: "W7HxkpaKwXif1gwj46gbNba7xKx9s8xUahh-Q_iQTdA",
            },
        };
        res = callQuery(instance, env, Buffer.from(JSON.stringify(queryMsg), "utf8"));
        resJson = JSON.parse(res.toString("utf8"));
        console.log(Buffer.from(resJson["ok"], "base64url").toString("utf8"));
        queryMsg = {
            balance: {
                address: "gBdRgmpzvixp2Nnf76LLTCrSYpuJfGp3TTGm8MaxSxo",
            },
        };
        res = callQuery(instance, env, Buffer.from(JSON.stringify(queryMsg), "utf8"));
        resJson = JSON.parse(res.toString("utf8"));
        console.log(Buffer.from(resJson["ok"], "base64url").toString("utf8"));
    }
    catch (e) {
        console.error({ e });
    }
})();
//# sourceMappingURL=index.js.map
import { doAbort, doAddrCanonicalize, doAddrHumanize, doAddrValidate, doDbNext, doDbRead, doDbRemove, doDbScan, doDbWrite, doDebug, doEd25519BatchVerify, doEd25519Verify, doQueryChain, doSecp256k1RecoverPubkey, doSecp256k1Verify } from "./imports.js";
export class Instance {
    constructor(instance, store, api, querier) {
        this.inner = instance;
        this.store = store;
        this.api = api;
        this.querier = querier;
    }
    static async fromCode(code, store, api, querier) {
        const module = await WebAssembly.compile(code);
        const memory = new WebAssembly.Memory({ initial: 100 });
        return this.fromModule(module, memory, store, api, querier);
    }
    static fromModule(module, memory, store, api, querier) {
        const instance = new Instance(new WebAssembly.Instance(module, {
            env: {
                memory,
                db_read: (keyPtr) => {
                    return doDbRead(instance, keyPtr);
                },
                db_write: (keyPtr, valuePtr) => {
                    doDbWrite(instance, keyPtr, valuePtr);
                },
                db_remove: (keyPtr) => {
                    doDbRemove(instance, keyPtr);
                },
                addr_validate: (sourcePtr) => {
                    return doAddrValidate(instance, sourcePtr);
                },
                addr_canonicalize: (sourcePtr, destinationPtr) => {
                    return doAddrCanonicalize(instance, sourcePtr, destinationPtr);
                },
                addr_humanize: (sourcePtr, destinationPtr) => {
                    return doAddrHumanize(instance, sourcePtr, destinationPtr);
                },
                secp256k1_verify: (hashPtr, signaturePtr, pubkeyPtr) => {
                    return doSecp256k1Verify(instance, hashPtr, signaturePtr, pubkeyPtr);
                },
                secp256k1_recover_pubkey: (hashPtr, signaturePtr, recoverParam) => {
                    return doSecp256k1RecoverPubkey(instance, hashPtr, signaturePtr, recoverParam);
                },
                ed25519_verify: (messagePtr, signaturePtr, pubkeyPtr) => {
                    return doEd25519Verify(instance, messagePtr, signaturePtr, pubkeyPtr);
                },
                ed25519_batch_verify: (messagePtr, signaturePtr, publicKeysPtr) => {
                    return doEd25519BatchVerify(instance, messagePtr, signaturePtr, publicKeysPtr);
                },
                debug: (messagePtr) => {
                    doDebug(instance, messagePtr);
                },
                abort: (messagePtr) => {
                    doAbort(instance, messagePtr);
                },
                query_chain: (requestPtr) => {
                    return doQueryChain(instance, requestPtr);
                },
                db_scan: (startPtr, endPtr, order) => {
                    return doDbScan(instance, startPtr, endPtr, order);
                },
                db_next: (iteratorId) => {
                    return doDbNext(instance, iteratorId);
                },
            }
        }), store, api, querier);
        return instance;
    }
}
//# sourceMappingURL=instance.js.map
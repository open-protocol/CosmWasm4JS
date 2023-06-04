import { readRegion, writeRegion } from "./memory.js";
export const MI = 1024 * 1024;
export const RESULT_INSTANTIATE = 64 * MI;
export const RESULT_EXECUTE = 64 * MI;
export const RESULT_QUERY = 64 * MI;
export function callInstantiate(instance, env, info, msg) {
    return callInstantiateRaw(instance, Buffer.from(JSON.stringify(env), "utf8"), Buffer.from(JSON.stringify(info), "utf8"), msg);
}
export function callInstantiateRaw(instance, env, info, msg) {
    return callRaw(instance, "instantiate", [env, info, msg], RESULT_INSTANTIATE);
}
export function callExecute(instance, env, info, msg) {
    return callExecuteRaw(instance, Buffer.from(JSON.stringify(env), "utf8"), Buffer.from(JSON.stringify(info), "utf8"), msg);
}
export function callExecuteRaw(instance, env, info, msg) {
    return callRaw(instance, "execute", [env, info, msg], RESULT_EXECUTE);
}
export function callQuery(instance, env, msg) {
    return callQueryRaw(instance, Buffer.from(JSON.stringify(env), "utf8"), msg);
}
export function callQueryRaw(instance, env, msg) {
    return callRaw(instance, "query", [env, msg], RESULT_QUERY);
}
function callRaw(instance, name, args, resultMaxLegnth) {
    const argRegionPtrs = [];
    const { allocate, memory } = instance.inner.exports;
    for (const arg of args) {
        const regionPtr = allocate(arg.length);
        writeRegion(memory, regionPtr, arg);
        argRegionPtrs.push(regionPtr);
    }
    const resRegionPtr = instance.inner.exports[name](...argRegionPtrs);
    const data = readRegion(memory, resRegionPtr, resultMaxLegnth);
    const { deallocate } = instance.inner.exports;
    deallocate(resRegionPtr);
    return data;
}
//# sourceMappingURL=calls.js.map
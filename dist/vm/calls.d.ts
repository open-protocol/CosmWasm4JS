/// <reference types="node" />
import { Env, MessageInfo } from "../std/index.js";
import { BackendApi, Storage, Querier } from "./backend.js";
import { Instance } from "./instance.js";
export declare const MI: number;
export declare const RESULT_INSTANTIATE: number;
export declare const RESULT_EXECUTE: number;
export declare const RESULT_QUERY: number;
export declare function callInstantiate<A extends BackendApi, S extends Storage, Q extends Querier>(instance: Instance<A, S, Q>, env: Env, info: MessageInfo, msg: Buffer): Buffer;
export declare function callInstantiateRaw<A extends BackendApi, S extends Storage, Q extends Querier>(instance: Instance<A, S, Q>, env: Buffer, info: Buffer, msg: Buffer): Buffer;
export declare function callExecute<A extends BackendApi, S extends Storage, Q extends Querier>(instance: Instance<A, S, Q>, env: Env, info: MessageInfo, msg: Buffer): Buffer;
export declare function callExecuteRaw<A extends BackendApi, S extends Storage, Q extends Querier>(instance: Instance<A, S, Q>, env: Buffer, info: Buffer, msg: Buffer): Buffer;
export declare function callQuery<A extends BackendApi, S extends Storage, Q extends Querier>(instance: Instance<A, S, Q>, env: Env, msg: Buffer): Buffer;
export declare function callQueryRaw<A extends BackendApi, S extends Storage, Q extends Querier>(instance: Instance<A, S, Q>, env: Buffer, msg: Buffer): Buffer;

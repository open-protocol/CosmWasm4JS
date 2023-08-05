import { Backend, BackendApi, Storage, Querier } from "./backend.js";
import { ContextData, Environment, GasConfig } from "./environment.js";
import {
  doAbort,
  doAddrCanonicalize,
  doAddrHumanize,
  doAddrValidate,
  doDbNext,
  doDbRead,
  doDbRemove,
  doDbScan,
  doDbWrite,
  doDebug,
  doEd25519BatchVerify,
  doEd25519Verify,
  doQueryChain,
  doSecp256k1RecoverPubkey,
  doSecp256k1Verify,
} from "./imports.js";

export interface InstanceOption {
  gasLimit: bigint;
  printDebug: boolean;
}

export class Instance<
  A extends BackendApi,
  S extends Storage,
  Q extends Querier
> {
  public inner: WebAssembly.Instance;
  public env: Environment<A, S, Q>;

  constructor(instance: WebAssembly.Instance, api: A, gasLimit: bigint) {
    this.inner = instance;
    this.env = {
      memory: instance.exports.memory as WebAssembly.Memory,
      api,
      gasConfig: new GasConfig(),
      data: new ContextData(gasLimit),
    };
  }

  public static async fromCode<
    A extends BackendApi,
    S extends Storage,
    Q extends Querier
  >(
    code: Buffer,
    backend: Backend<A, S, Q>,
    options: InstanceOption,
    memoryLimit: number
  ): Promise<Instance<A, S, Q>> {
    const module = await WebAssembly.compile(code);
    const memory = new WebAssembly.Memory({
      initial: 100,
      maximum: memoryLimit,
    });
    return this.fromModule(
      module,
      memory,
      backend,
      options.gasLimit,
      options.printDebug
    );
  }

  static fromModule<A extends BackendApi, S extends Storage, Q extends Querier>(
    module: WebAssembly.Module,
    memory: WebAssembly.Memory,
    backend: Backend<A, S, Q>,
    gasLimit: bigint,
    printDebug: boolean
  ): Instance<A, S, Q> {
    const instance = new Instance<A, S, Q>(
      new WebAssembly.Instance(module, {
        env: {
          memory,
          db_read: (keyPtr: number): number => {
            return doDbRead(instance, keyPtr);
          },
          db_write: (keyPtr: number, valuePtr: number): void => {
            doDbWrite(instance, keyPtr, valuePtr);
          },
          db_remove: (keyPtr: number): void => {
            doDbRemove(instance, keyPtr);
          },
          addr_validate: (sourcePtr: number): number => {
            return doAddrValidate(instance, sourcePtr);
          },
          addr_canonicalize: (
            sourcePtr: number,
            destinationPtr: number
          ): number => {
            return doAddrCanonicalize(instance, sourcePtr, destinationPtr);
          },
          addr_humanize: (
            sourcePtr: number,
            destinationPtr: number
          ): number => {
            return doAddrHumanize(instance, sourcePtr, destinationPtr);
          },
          secp256k1_verify: (
            hashPtr: number,
            signaturePtr: number,
            pubkeyPtr: number
          ) => {
            return doSecp256k1Verify(
              instance,
              hashPtr,
              signaturePtr,
              pubkeyPtr
            );
          },
          secp256k1_recover_pubkey: (
            hashPtr: number,
            signaturePtr: number,
            recoverParam: number
          ): number => {
            return doSecp256k1RecoverPubkey(
              instance,
              hashPtr,
              signaturePtr,
              recoverParam
            );
          },
          ed25519_verify: (
            messagePtr: number,
            signaturePtr: number,
            pubkeyPtr: number
          ): number => {
            return doEd25519Verify(
              instance,
              messagePtr,
              signaturePtr,
              pubkeyPtr
            );
          },
          ed25519_batch_verify: (
            messagePtr: number,
            signaturePtr: number,
            publicKeysPtr: number
          ): number => {
            return doEd25519BatchVerify(
              instance,
              messagePtr,
              signaturePtr,
              publicKeysPtr
            );
          },
          debug: (messagePtr: number): void => {
            if (printDebug) {
              doDebug(instance, messagePtr);
            }
          },
          abort: (messagePtr: number) => {
            doAbort(instance, messagePtr);
          },
          query_chain: (requestPtr: number): number => {
            return doQueryChain(instance, requestPtr);
          },
          db_scan: (
            startPtr: number,
            endPtr: number,
            order: number
          ): number => {
            return doDbScan(instance, startPtr, endPtr, order);
          },
          db_next: (iteratorId: number): number => {
            return doDbNext(instance, iteratorId);
          },
        },
      }),
      backend.api,
      gasLimit
    );

    instance.env.data.storage = backend.storage;
    instance.env.data.querier = backend.querier;

    return instance;
  }
}

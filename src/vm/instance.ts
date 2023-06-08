import { Backend } from "./backend.js";
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

export class Instance {
  public inner: WebAssembly.Instance;
  public backend: Backend;

  constructor(instance: WebAssembly.Instance, backend: Backend) {
    this.inner = instance;
    this.backend = backend;
  }

  public static async fromCode(
    code: Buffer,
    backend: Backend
  ): Promise<Instance> {
    const module = await WebAssembly.compile(code);
    const memory = new WebAssembly.Memory({ initial: 100 });
    return this.fromModule(module, memory, backend);
  }

  static fromModule(
    module: WebAssembly.Module,
    memory: WebAssembly.Memory,
    backend: Backend
  ): Instance {
    const instance = new Instance(
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
            doDebug(instance, messagePtr);
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
      backend
    );
    return instance;
  }
}

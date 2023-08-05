import { BackendApi, Storage, Querier } from "./backend";

export class GasConfig {
  GAS_PER_US = 1000_000_000n;

  public secp256k1VerifyCost: bigint = 154n * this.GAS_PER_US;
  public secp256k1RecoverPubkeyCost: bigint = 162n * this.GAS_PER_US;
  public ed25519VerifyCost: bigint = 63n * this.GAS_PER_US;
  public ed25519BatchVerifyCost: bigint = (63n * this.GAS_PER_US) / 2n;
  public ed25519BatchVerifyOnePubkeyCost: bigint = (63n * this.GAS_PER_US) / 4n;
}

export class GasState {
  public gasLimit: bigint;
  public externallyUsedGas: bigint;

  public static withLimit(gasLimit: bigint): GasState {
    return {
      gasLimit,
      externallyUsedGas: 0n,
    };
  }
}

export class Environment<
  A extends BackendApi,
  S extends Storage,
  Q extends Querier
> {
  public memory: WebAssembly.Memory | null | undefined;
  public api: A;
  public gasConfig: GasConfig;
  data: ContextData<S, Q>;

  constructor(api: A, gasLimit: bigint) {
    this.memory = null;
    this.api = api;
    this.gasConfig = new GasConfig();
    this.data = new ContextData(gasLimit);
  }
}

export class ContextData<S extends Storage, Q extends Querier> {
  gasState: GasState;
  storage: S | null | undefined;
  storageReadonly: boolean;
  callDepth: number;
  querier: Q | null | undefined;
  instance: WebAssembly.Instance | null | undefined;

  constructor(gasLimit: bigint) {
    this.gasState = GasState.withLimit(gasLimit);
    this.storage = null;
    this.storageReadonly = true;
    this.callDepth = 0;
    this.querier = null;
    this.instance = null;
  }
}

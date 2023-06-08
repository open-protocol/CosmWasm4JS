export class Backend {
  public api: BackendApi;
  public storage: Storage;
  public querier: Querier;

  constructor(api: BackendApi, storage: Storage, querier: Querier) {
    this.api = api;
    this.storage = storage;
    this.querier = querier;
  }
}

export interface Storage {
  get: (key: Buffer) => Buffer;
  set: (key: Buffer, value: Buffer) => void;
  remove: (key: Buffer) => void;
}

export interface BackendApi {
  canonicalAddress: (human: string) => Buffer;
  humanAddress: (canonical: Buffer) => string;
}

export interface Querier {
  queryRaw: (request: Buffer) => Buffer;
}

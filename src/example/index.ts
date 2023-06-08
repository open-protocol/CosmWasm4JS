import { Env, MessageInfo } from "../std/index.js";
import { Backend } from "../vm/backend.js";
import { callExecute, callInstantiate } from "../vm/calls.js";
import {
  BackendApi,
  Instance,
  Querier,
  Storage,
  callQuery,
} from "../vm/index.js";
import fs from "fs";

class MockBackendApi implements BackendApi {
  public canonicalAddress(human: string): Buffer {
    return Buffer.from(human, "base64url");
  }

  public humanAddress(canonical: Buffer): string {
    return canonical.toString("base64url");
  }
}

class MockQuerier implements Querier {
  public queryRaw(request: Buffer): Buffer {
    return Buffer.allocUnsafe(0);
  }
}

class MockStorage implements Storage {
  data: Map<string, Buffer>;

  constructor() {
    this.data = new Map<string, Buffer>();
  }

  public get(key: Buffer): Buffer {
    return this.data.get(key.toString("base64"));
  }

  public set(key: Buffer, value: Buffer): void {
    this.data.set(key.toString("base64"), value);
  }

  public remove(key: Buffer): void {
    this.data.delete(key.toString("base64"));
  }
}

(async () => {
  try {
    const code = fs.readFileSync("./contracts/counter.wasm");
    const backend = new Backend(
      new MockBackendApi(),
      new MockStorage(),
      new MockQuerier()
    );
    const instance = await Instance.fromCode(code, backend);

    const env: Env = {
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
    const info: MessageInfo = {
      sender: "senderaddr",
      funds: [
        {
          denom: "opp",
          amount: 0n.toString(),
        },
      ],
    };

    let res = callInstantiate(instance, env, info, Buffer.from("{}", "utf8"));
    let resJson = JSON.parse(res.toString("utf8"));
    let attributes = resJson["ok"]["attributes"];
    console.log(...attributes);

    res = callQuery(instance, env, Buffer.from('{"query_count":{}}', "utf8"));
    resJson = JSON.parse(res.toString("utf8"));
    console.log(Buffer.from(resJson["ok"], "base64").toString("utf8"));

    res = callExecute(
      instance,
      env,
      info,
      Buffer.from('{"set":{"count":10}}', "utf8")
    );
    resJson = JSON.parse(res.toString("utf8"));
    attributes = resJson["ok"]["attributes"];
    console.log(...attributes);

    res = callQuery(instance, env, Buffer.from('{"query_count":{}}', "utf8"));
    resJson = JSON.parse(res.toString("utf8"));
    console.log(Buffer.from(resJson["ok"], "base64").toString("utf8"));
  } catch (e: any) {
    console.error({ e });
  }
})();

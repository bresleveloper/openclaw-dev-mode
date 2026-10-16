import "./types.openclaw-DWWUw8hA.js";
import { an as callGateway } from "./agent-harness-runtime-DZjstJNb.js";
import { Command } from "commander";
//#region src/cli/gateway-rpc.types.d.ts
/** Common gateway RPC flags accepted by direct gateway command helpers. */
type GatewayRpcOpts = {
  url?: string;
  expectUrl?: string;
  port?: string;
  token?: string;
  password?: string;
  timeout?: string;
  expectFinal?: boolean;
  json?: boolean;
};
//#endregion
//#region src/cli/gateway-rpc.runtime.d.ts
type GatewayRpcExtraOptions = {
  clientName?: Parameters<typeof callGateway>[0]["clientName"];
  mode?: Parameters<typeof callGateway>[0]["mode"];
  deviceIdentity?: Parameters<typeof callGateway>[0]["deviceIdentity"];
  signal?: Parameters<typeof callGateway>[0]["signal"];
  expectFinal?: boolean;
  progress?: boolean;
  scopes?: Parameters<typeof callGateway>[0]["scopes"];
  sharedStateMode?: Parameters<typeof callGateway>[0]["sharedStateMode"];
};
//#endregion
//#region src/cli/gateway-rpc.d.ts
declare function addGatewayClientOptions(cmd: Command, defaults?: {
  timeoutMs?: number;
}): Command;
declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: GatewayRpcExtraOptions): Promise<Record<string, unknown>>;
//#endregion
export { callGatewayFromCli as n, GatewayRpcOpts as r, addGatewayClientOptions as t };
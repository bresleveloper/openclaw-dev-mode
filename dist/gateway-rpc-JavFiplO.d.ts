import { $t as DeviceIdentity } from "./agent-harness-runtime-wMciqZ6Z.js";
import "./types.openclaw-Ccmw-oTa.js";
import { At as GatewayClientMode, jt as GatewayClientName } from "./templating-0ElMwhje.js";
import { n as OperatorScope } from "./types.plugin-DWwKnMgs.js";
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
//#region src/cli/gateway-rpc.d.ts
declare function addGatewayClientOptions(cmd: Command, defaults?: {
  timeoutMs?: number;
}): Command;
declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: {
  clientName?: GatewayClientName;
  mode?: GatewayClientMode;
  deviceIdentity?: DeviceIdentity | null;
  signal?: AbortSignal;
  expectFinal?: boolean;
  progress?: boolean;
  scopes?: OperatorScope[];
  sharedStateMode?: "read-only";
}): Promise<Record<string, unknown>>;
//#endregion
export { callGatewayFromCli as n, GatewayRpcOpts as r, addGatewayClientOptions as t };
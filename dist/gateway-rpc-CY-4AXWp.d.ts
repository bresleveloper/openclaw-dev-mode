import "./types-D7I_F5Ux.js";
import { i as callGateway } from "./database-port-recovery-Bqi8HAkj.js";
import { Command } from "commander";
//#region src/cli/gateway-rpc.types.d.ts
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
/** Resolve whether CLI Gateway options select the implicit local Gateway. */
declare function isImplicitLocalGatewayTargetFromCli(opts: GatewayRpcOpts): Promise<boolean>;
//#endregion
export { GatewayRpcOpts as i, callGatewayFromCli as n, isImplicitLocalGatewayTargetFromCli as r, addGatewayClientOptions as t };
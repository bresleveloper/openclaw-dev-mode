import "./types.openclaw-D8uW-XQA.js";
import { n as callGateway } from "./database-port-recovery-0AsyALgu.js";
import { Command } from "commander";
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
declare function addGatewayClientOptions(cmd: Command, defaults?: {
  timeoutMs?: number;
}): Command;
declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: GatewayRpcExtraOptions): Promise<Record<string, unknown>>;
/** Resolve whether CLI Gateway options select the implicit local Gateway. */
declare function isImplicitLocalGatewayTargetFromCli(opts: GatewayRpcOpts): Promise<boolean>;
export { GatewayRpcOpts as i, callGatewayFromCli as n, isImplicitLocalGatewayTargetFromCli as r, addGatewayClientOptions as t };
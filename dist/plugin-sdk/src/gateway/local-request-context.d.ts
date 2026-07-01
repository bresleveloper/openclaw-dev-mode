import type { CliDeps } from "../cli/deps.types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { GatewayRequestContext } from "./server-methods/types.js";
type LocalGatewayRequestContextParams = {
    deps: CliDeps;
    getRuntimeConfig: () => OpenClawConfig;
};
type LocalGatewayScopeParams = LocalGatewayRequestContextParams;
/** Creates the minimal gateway context used by embedded local agent execution. */
export declare function createLocalGatewayRequestContext(params: LocalGatewayRequestContextParams): GatewayRequestContext;
/** Runs code inside a local gateway request scope unless an outer scope already exists. */
export declare function withLocalGatewayRequestScope<T>(params: LocalGatewayScopeParams, run: () => T): T;
export {};

import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { callGateway } from "../../gateway/call.js";
import type { AnyAgentTool } from "./common.js";
type GatewayCaller = typeof callGateway;
/** Creates the sessions-list tool with gateway-backed listing and local transcript enrichment. */
export declare function createSessionsListTool(opts?: {
    agentSessionKey?: string;
    sandboxed?: boolean;
    config?: OpenClawConfig;
    callGateway?: GatewayCaller;
}): AnyAgentTool;
export {};

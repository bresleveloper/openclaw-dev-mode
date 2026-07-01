import { type ToolsCatalogResult } from "../../../packages/gateway-protocol/src/index.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { GatewayRequestHandlers } from "./types.js";
/** Build the merged core/plugin tool catalog for one agent. */
export declare function buildToolsCatalogResult(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    includePlugins?: boolean;
}): ToolsCatalogResult;
/** Gateway request handlers for tool catalog queries. */
export declare const toolsCatalogHandlers: GatewayRequestHandlers;

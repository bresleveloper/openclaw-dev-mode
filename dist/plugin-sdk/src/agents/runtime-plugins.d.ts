/**
 * Ensures runtime plugin registries are loaded for agent execution. Startup
 * plugin IDs from metadata scope the load when available.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Ensure standalone runtime plugins are loaded for the current agent context. */
export declare function ensureRuntimePluginsLoaded(params: {
    config?: OpenClawConfig;
    workspaceDir?: string | null;
    allowGatewaySubagentBinding?: boolean;
}): void;

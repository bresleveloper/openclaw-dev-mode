import type { OpenClawConfig } from "../config/types.js";
import type { StatusSummary } from "./status.types.js";
/** Removes session paths and recent session details from a status summary. */
export declare function redactSensitiveStatusSummary(summary: StatusSummary): StatusSummary;
/** Builds the aggregate status summary for agents, sessions, tasks, heartbeat, and channels. */
export declare function getStatusSummary(options?: {
    includeSensitive?: boolean;
    includeChannelSummary?: boolean;
    config?: OpenClawConfig;
    sourceConfig?: OpenClawConfig;
}): Promise<StatusSummary>;

import type { OpenClawConfig } from "../../../config/types.openclaw.js";
export type StaleSubagentAllowlistHit = {
    /** Config path containing the stale allowAgents entry. */
    pathLabel: string;
    /** Original configured agent id. */
    agentId: string;
    /** Normalized agent id used for matching configured targets. */
    normalizedAgentId: string;
};
/** Find subagent allowlist entries not backed by configured agent or ACP targets. */
export declare function scanStaleSubagentAllowlistReferences(cfg: OpenClawConfig): StaleSubagentAllowlistHit[];
/** Format warnings for stale subagent allowlist entries. */
export declare function collectStaleSubagentAllowlistWarnings(params: {
    hits: readonly StaleSubagentAllowlistHit[];
    doctorFixCommand: string;
}): string[];
/** Remove stale subagent allowlist entries while preserving valid targets and wildcards. */
export declare function maybeRepairStaleSubagentAllowlists(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};

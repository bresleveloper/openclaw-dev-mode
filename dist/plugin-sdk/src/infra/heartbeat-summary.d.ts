import type { AgentDefaultsConfig } from "../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
/** Normalized heartbeat configuration for one agent. */
export type HeartbeatSummary = {
    enabled: boolean;
    every: string;
    everyMs: number | null;
    prompt: string;
    target: string;
    model?: string;
    ackMaxChars: number;
};
/** Return whether heartbeat scheduling applies to an agent. */
export declare function isHeartbeatEnabledForAgent(cfg: OpenClawConfig, agentId?: string): boolean;
/** Resolve a heartbeat interval string to milliseconds. */
export declare function resolveHeartbeatIntervalMs(cfg: OpenClawConfig, overrideEvery?: string, heartbeat?: HeartbeatConfig): number | null;
/** Resolve display-ready heartbeat settings for an agent. */
export declare function resolveHeartbeatSummaryForAgent(cfg: OpenClawConfig, agentId?: string): HeartbeatSummary;
export {};

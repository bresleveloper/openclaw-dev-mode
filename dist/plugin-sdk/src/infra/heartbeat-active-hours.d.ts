import type { AgentDefaultsConfig } from "../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type HeartbeatConfig = AgentDefaultsConfig["heartbeat"];
/** Resolve the timezone used to evaluate heartbeat active hours. */
export declare function resolveActiveHoursTimezone(cfg: OpenClawConfig, raw?: string): string;
/** Return true when the current time is inside the configured heartbeat window. */
export declare function isWithinActiveHours(cfg: OpenClawConfig, heartbeat?: HeartbeatConfig, nowMs?: number): boolean;
export {};

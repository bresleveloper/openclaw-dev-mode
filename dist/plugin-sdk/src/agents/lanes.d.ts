/**
 * Resolves command queue lane names for nested, cron, and subagent work.
 */
import { CommandLane } from "../process/lanes.js";
/** Default lane for nested agent work. */
export declare const AGENT_LANE_NESTED = CommandLane.Nested;
export declare const AGENT_LANE_CRON_NESTED = CommandLane.CronNested;
export declare const AGENT_LANE_SUBAGENT = CommandLane.Subagent;
/** Resolves the lane for agent work started from cron. */
export declare function resolveCronAgentLane(lane?: string): string;
/** Resolves a per-session nested lane to serialize nested agent work. */
export declare function resolveNestedAgentLaneForSession(sessionKey: string | undefined): string;
/** Returns true when a lane belongs to nested agent work. */
export declare function isNestedAgentLane(lane: string | undefined): boolean;

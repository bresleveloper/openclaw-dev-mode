/**
 * Process-local live subagent run map.
 *
 * Shared by registry read/write helpers for active in-memory run state.
 */
import type { SubagentRunRecord } from "./subagent-registry.types.js";
export declare const subagentRuns: Map<string, SubagentRunRecord>;

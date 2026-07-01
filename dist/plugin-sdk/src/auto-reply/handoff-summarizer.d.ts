/** Builds fallback-model handoff messages that preserve active subagent state. */
import type { AgentMessage } from "../agents/runtime/index.js";
/** Summary of the prior model state used to brief the fallback model. */
export interface HandoffSnapshot {
    summary: string;
    activeSubagents: Array<{
        sessionId: string;
        role?: string;
        lastStatus?: string;
    }>;
}
/**
 * Builds the recovery briefing injected as the first user-side turn after a
 * model failover. The user role is used (not assistant) so the new model
 * treats the content as input rather than its own prior output.
 */
export declare function buildHierarchyReinforcementMessage(snapshot: HandoffSnapshot): AgentMessage;

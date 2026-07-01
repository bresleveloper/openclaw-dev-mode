/**
 * Agent harness result classification helper.
 *
 * Harness lifecycle wraps raw attempt results with harness id metadata and lets
 * harness-specific classifiers attach non-ok result categories.
 */
import type { AgentHarness, AgentHarnessAttemptParams, AgentHarnessAttemptResult } from "./types.js";
/** Applies a harness classifier while replacing any stale prior classification. */
export declare function applyAgentHarnessResultClassification(harness: Pick<AgentHarness, "id" | "classify">, result: AgentHarnessAttemptResult, params: AgentHarnessAttemptParams): AgentHarnessAttemptResult;

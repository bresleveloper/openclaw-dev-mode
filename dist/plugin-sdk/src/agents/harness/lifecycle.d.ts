import type { AgentHarness, AgentHarnessAttemptParams, AgentHarnessAttemptResult } from "./types.js";
/** Runs one harness attempt with diagnostics, tracing, and result classification. */
export declare function runAgentHarnessLifecycleAttempt(harness: AgentHarness, params: AgentHarnessAttemptParams): Promise<AgentHarnessAttemptResult>;

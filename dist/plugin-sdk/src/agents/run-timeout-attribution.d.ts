/** Agent run phases used when attributing timeout/cancellation sources. */
declare const AGENT_RUN_TIMEOUT_PHASES: readonly ["queue", "preflight", "provider", "post_turn", "gateway_draining"];
/** Timeout attribution phase for agent run lifecycle spans. */
export type AgentRunTimeoutPhase = (typeof AGENT_RUN_TIMEOUT_PHASES)[number];
/** Normalizes raw timeout phase metadata into a known agent run phase. */
export declare function normalizeAgentRunTimeoutPhase(value: unknown): AgentRunTimeoutPhase | undefined;
/** Normalizes provider-started timeout attribution metadata. */
export { asBoolean as normalizeProviderStarted } from "../utils/boolean.js";

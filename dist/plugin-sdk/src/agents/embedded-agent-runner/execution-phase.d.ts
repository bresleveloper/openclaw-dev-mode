/**
 * Ordered execution milestones reported by the embedded runner while a turn starts up.
 *
 * Keep labels stable: external status surfaces and diagnostics consume the formatted values.
 */
declare const EMBEDDED_AGENT_EXECUTION_PHASES: readonly ["runner_entered", "workspace", "runtime_plugins", "before_agent_reply", "model_resolution", "auth", "context_engine", "attempt_dispatch", "context_assembled", "turn_accepted", "process_spawned", "tool_execution_started", "assistant_output_started", "model_call_started"];
export type EmbeddedAgentExecutionPhase = (typeof EMBEDDED_AGENT_EXECUTION_PHASES)[number];
/** Converts an internal phase id into the compact label used in status output. */
export declare function formatEmbeddedAgentExecutionPhase(phase?: EmbeddedAgentExecutionPhase): string | undefined;
export {};

export declare const SUBAGENT_SPAWN_MODES: readonly ["run", "session"];
export type SpawnSubagentMode = (typeof SUBAGENT_SPAWN_MODES)[number];
/** Sandbox escalation policy requested for a spawned subagent. */
export declare const SUBAGENT_SPAWN_SANDBOX_MODES: readonly ["inherit", "require"];
export type SpawnSubagentSandboxMode = (typeof SUBAGENT_SPAWN_SANDBOX_MODES)[number];
/** Prompt context relationship between the parent session and spawned subagent. */
export declare const SUBAGENT_SPAWN_CONTEXT_MODES: readonly ["isolated", "fork"];
export type SpawnSubagentContextMode = (typeof SUBAGENT_SPAWN_CONTEXT_MODES)[number];

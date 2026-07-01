/** Agent runtime id normalization and retired runtime-selection compatibility helpers. */
export type EmbeddedAgentRuntime = "openclaw" | "auto" | (string & {});
export declare const OPENCLAW_AGENT_RUNTIME_ID = "openclaw";
export declare const AUTO_AGENT_RUNTIME_ID = "auto";
/** Normalizes configured runtime aliases to the current embedded-agent runtime id vocabulary. */
export declare function normalizeEmbeddedAgentRuntime(raw: string | undefined): EmbeddedAgentRuntime;
/** Normalizes an optional unknown runtime id value, returning undefined when absent/invalid. */
export declare function normalizeOptionalAgentRuntimeId(raw: unknown): EmbeddedAgentRuntime | undefined;
/**
 * @deprecated Whole-agent runtime environment selection is retired. Use
 * provider/model runtime policy or a registered agent harness instead.
 */
export declare function resolveEmbeddedAgentRuntime(_env?: NodeJS.ProcessEnv): EmbeddedAgentRuntime;
/** Returns whether a runtime id should be treated as the default runtime selection. */
export declare function isDefaultAgentRuntimeId(runtime: string | undefined): boolean;

import type { AgentModelConfig, AgentToolModelConfig } from "./types.agents-shared.js";
type AgentModelListLike = {
    primary?: string;
    fallbacks?: string[];
};
type AgentModelInput = AgentModelConfig | AgentToolModelConfig;
/** Returns the primary model ref from either string or object-style agent model config. */
export declare function resolveAgentModelPrimaryValue(model?: AgentModelInput): string | undefined;
/** Returns configured fallback model refs, preserving their configured order. */
export declare function resolveAgentModelFallbackValues(model?: AgentModelInput): string[];
/** Returns a positive finite tool timeout rounded down to whole milliseconds. */
export declare function resolveAgentModelTimeoutMsValue(model?: AgentToolModelConfig): number | undefined;
/** Converts legacy string model config into the object shape used by model patch helpers. */
export declare function toAgentModelListLike(model?: AgentModelConfig): AgentModelListLike | undefined;
/** Canonicalizes provider/model refs before they are persisted to config. */
export declare function normalizeAgentModelRefForConfig(model: string): string;
/** Normalizes model map keys and merges entries that collapse to the same canonical ref. */
export declare function normalizeAgentModelMapForConfig<T extends Record<string, unknown>>(models: T): T;
export {};

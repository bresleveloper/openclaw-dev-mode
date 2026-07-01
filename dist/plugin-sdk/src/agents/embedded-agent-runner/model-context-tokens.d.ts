/**
 * Reads normalized context-token metadata from resolved model definitions.
 */
import type { Model } from "../../llm/types.js";
/** Returns finite context-token metadata when a model discovery source provided it. */
/** Prefer contextTokens, then contextWindow, when present on model metadata. */
export declare function readAgentModelContextTokens(model: Model | null | undefined): number | undefined;

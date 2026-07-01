/**
 * Small shared normalization helpers for embedded-agent runner settings.
 */
import type { ReasoningLevel, ThinkLevel } from "../../auto-reply/thinking.js";
import type { ThinkingLevel } from "../runtime/index.js";
export declare function normalizeContextTokenBudget(value: unknown): number | undefined;
export declare function mapThinkingLevel(level?: ThinkLevel): ThinkingLevel;
export type { ReasoningLevel, ThinkLevel };

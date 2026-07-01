import type { ThinkLevel } from "../../../auto-reply/thinking.js";
/** Reasoning effort values accepted by OpenAI-compatible providers. */
export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
/** Maps OpenClaw thinking levels onto provider reasoning-effort labels. */
export declare function mapThinkingLevelToReasoningEffort(thinkingLevel: ThinkLevel): ReasoningEffort;

import { type ThinkLevel } from "../../auto-reply/thinking.js";
/** Pick a configured or provider-safe reasoning level for fallback attempts. */
export declare function pickFallbackThinkingLevel(params: {
    message?: string;
    attempted: Set<ThinkLevel>;
}): ThinkLevel | undefined;

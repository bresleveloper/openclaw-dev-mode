import type { InlineDirectives } from "./directive-handling.js";
/** Clears all inline directive state while preserving cleaned text. */
export declare function clearInlineDirectives(cleaned: string): InlineDirectives;
/** Clears only exec-related directive state after execution policy is consumed. */
export declare function clearExecInlineDirectives(directives: InlineDirectives): InlineDirectives;

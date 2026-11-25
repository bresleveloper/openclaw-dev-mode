import { a as AssistantMessage } from "./types-B1ZIh9Ch.mjs";
import "./types-CeCl7cJZ.mjs";
declare const CONTEXT_OVERFLOW_PATTERN_SCOPES: {
  readonly "assistant-error": RegExp[];
  readonly "failover-explicit": RegExp[];
  readonly "provider-fallback": RegExp[];
  readonly "failover-hint": readonly [RegExp];
  readonly "context-window-too-small": readonly [RegExp];
  readonly "tpm-rate-limit-hint": readonly [RegExp];
  readonly "rate-limit-hint": readonly [RegExp];
};
type ContextOverflowMessageScope = keyof typeof CONTEXT_OVERFLOW_PATTERN_SCOPES;
/** Match one canonical context-overflow wording scope without applying caller policy. */
declare function matchesContextOverflowMessage(errorMessage: string, scope: ContextOverflowMessageScope): boolean;
/**
 * Match provider overflow errors, or infer overflow from reported context usage.
 * A context window enables silent-overflow detection; silent truncation without
 * a length stop remains undetectable because the original token count is unknown.
 */
declare function isContextOverflow(message: AssistantMessage, contextWindow?: number): boolean;
/** Remove unpaired surrogates rejected by providers; preserve valid Unicode pairs. */
declare function sanitizeSurrogates(text: string): string;
export { isContextOverflow as n, matchesContextOverflowMessage as r, sanitizeSurrogates as t };
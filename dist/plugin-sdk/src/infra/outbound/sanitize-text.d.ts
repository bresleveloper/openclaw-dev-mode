/** Removes prompt/runtime scaffolding that must never leak to plain-text channels. */
export declare function stripInternalRuntimeScaffolding(text: string): string;
/**
 * Convert common HTML tags to their plain-text/lightweight-markup equivalents
 * and strip anything that remains.
 *
 * The function is intentionally conservative — it only targets tags that models
 * are known to produce and avoids false positives on angle brackets in normal
 * prose (e.g. `a < b`).
 */
export declare function sanitizeForPlainText(text: string): string;

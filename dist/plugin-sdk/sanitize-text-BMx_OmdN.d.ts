//#region src/infra/outbound/sanitize-text.d.ts
/** Removes prompt/runtime scaffolding that must never leak to plain-text channels. */
declare function stripInternalRuntimeScaffolding(text: string): string;
/**
 * Convert common HTML tags to their plain-text/lightweight-markup equivalents
 * and strip anything that remains.
 *
 * The function is intentionally conservative — it only targets tags that models
 * are known to produce and avoids false positives on angle brackets in normal
 * prose (e.g. `a < b`).
 */
declare function sanitizeForPlainText(text: string): string;
//#endregion
export { stripInternalRuntimeScaffolding as n, sanitizeForPlainText as t };
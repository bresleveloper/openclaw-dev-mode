/**
 * Normalizes a raw secret value from config, env, setup prompts, or plugin SDK callers.
 * Returns an empty string for absent/invalid input so callers can keep boolean presence checks simple.
 */
declare function normalizeSecretInput(value: unknown): string;
/**
 * Normalizes a raw secret value and converts empty normalized output to `undefined`.
 * Use this at optional config boundaries where "not configured" is clearer than an empty string.
 */
declare function normalizeOptionalSecretInput(value: unknown): string | undefined;
export { normalizeSecretInput as n, normalizeOptionalSecretInput as t };
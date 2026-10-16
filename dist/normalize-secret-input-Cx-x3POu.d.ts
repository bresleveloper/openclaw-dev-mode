import { p as SecretRefSource } from "./types.secrets-CqlN900w.js";
//#region src/secrets/provider-credential-values.d.ts
/** Resolve the API-key placeholder for a non-env secret-ref source. */
declare function resolveNonEnvSecretRefApiKeyMarker(_source: SecretRefSource): string;
declare function readProviderEnvValue(envVars: string[]): string | undefined;
//#endregion
//#region src/utils/normalize-secret-input.d.ts
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
//#endregion
export { resolveNonEnvSecretRefApiKeyMarker as i, normalizeSecretInput as n, readProviderEnvValue as r, normalizeOptionalSecretInput as t };
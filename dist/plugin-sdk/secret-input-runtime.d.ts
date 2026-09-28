import { c as normalizeResolvedSecretInputString, d as SecretInput, h as isSecretRef, l as normalizeSecretInputString, n as SecretInputStringResolution, o as coerceSecretRef, r as SecretInputStringResolutionMode, s as hasConfiguredSecretInput, u as resolveSecretInputString } from "../types.secrets-BR-Cncxg.js";
import { n as resolveConfiguredSecretInputWithFallback, r as resolveRequiredConfiguredSecretRefInputString, t as resolveConfiguredSecretInputString } from "../resolve-configured-secret-input-string-DjIp2-SP.js";
//#region src/secrets/prepared-plugin-input.d.ts
/** Read a manifest-prepared capability credential. Never resolves a cold reference or environment. */
export declare function getPreparedPluginSecretInput(pluginId: string, path: string): {
  value?: string;
  revision: number;
};
//#endregion
//#region src/plugin-sdk/secret-input-runtime.d.ts
/** Reject use of a manifest-owned plugin capability whose startup secret is unavailable. */
export declare function assertPluginCapabilitySecretAvailable(ownerId: string): void;
//#endregion
export { type SecretInput, type SecretInputStringResolution, type SecretInputStringResolutionMode, coerceSecretRef, hasConfiguredSecretInput, isSecretRef, normalizeResolvedSecretInputString, normalizeSecretInputString, resolveConfiguredSecretInputString, resolveConfiguredSecretInputWithFallback, resolveRequiredConfiguredSecretRefInputString, resolveSecretInputString };
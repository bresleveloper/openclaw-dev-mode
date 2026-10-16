import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import { c as normalizeResolvedSecretInputString, d as SecretInput, h as isSecretRef, l as normalizeSecretInputString, n as SecretInputStringResolution, o as coerceSecretRef, r as SecretInputStringResolutionMode, s as hasConfiguredSecretInput, u as resolveSecretInputString } from "../types.secrets-CqlN900w.js";
import { n as PluginManifestRegistry } from "../manifest-registry-Bj1Q7bnt.js";
//#region src/gateway/resolve-configured-secret-input-string.d.ts
type SecretInputUnresolvedReasonStyle = "generic" | "detailed";
type ConfiguredSecretInputSource = "config" | "secretRef" | "fallback";
type ConfiguredSecretInputParams = {
  config: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  value: unknown;
  path: string;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  unresolvedReasonStyle?: SecretInputUnresolvedReasonStyle;
};
declare function resolveCanonicalConfiguredSecretInputString(params: ConfiguredSecretInputParams): Promise<{
  value?: string;
  unresolvedRefReason?: string;
  unresolvedRefCode?: "SECRET_REF_REDACTED_VALUE";
}>;
declare function resolveCanonicalConfiguredSecretInputWithFallback(params: ConfiguredSecretInputParams & {
  readFallback?: () => string | undefined;
}): Promise<{
  value?: string;
  source?: ConfiguredSecretInputSource;
  unresolvedRefReason?: string;
  unresolvedRefCode?: "SECRET_REF_REDACTED_VALUE";
  secretRefConfigured: boolean;
}>;
declare function resolveCanonicalRequiredConfiguredSecretRefInputString(params: ConfiguredSecretInputParams): Promise<string | undefined>;
//#endregion
//#region src/secrets/prepared-plugin-input.d.ts
/** Read a manifest-prepared capability credential. Never resolves a cold reference or environment. */
export declare function getPreparedPluginSecretInput(pluginId: string, path: string): {
  value?: string;
  revision: number;
};
//#endregion
//#region src/plugin-sdk/secret-input-runtime.d.ts
/** Keep the shipped unknown-valued SDK input contract outside canonical config readers. */
export declare function resolveConfiguredSecretInputString(params: Parameters<typeof resolveCanonicalConfiguredSecretInputString>[0]): ReturnType<typeof resolveCanonicalConfiguredSecretInputString>;
export declare function resolveConfiguredSecretInputWithFallback(params: Parameters<typeof resolveCanonicalConfiguredSecretInputWithFallback>[0]): ReturnType<typeof resolveCanonicalConfiguredSecretInputWithFallback>;
export declare function resolveRequiredConfiguredSecretRefInputString(params: Parameters<typeof resolveCanonicalRequiredConfiguredSecretRefInputString>[0]): ReturnType<typeof resolveCanonicalRequiredConfiguredSecretRefInputString>;
/** Reject use of a manifest-owned plugin capability whose startup secret is unavailable. */
export declare function assertPluginCapabilitySecretAvailable(ownerId: string): void;
//#endregion
export { type SecretInput, type SecretInputStringResolution, type SecretInputStringResolutionMode, coerceSecretRef, hasConfiguredSecretInput, isSecretRef, normalizeResolvedSecretInputString, normalizeSecretInputString, resolveSecretInputString };
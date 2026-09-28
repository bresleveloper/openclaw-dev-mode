import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { n as PluginManifestRegistry } from "./manifest-registry-CMnhqUB6.js";
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
declare function resolveConfiguredSecretInputString(params: ConfiguredSecretInputParams): Promise<{
  value?: string;
  unresolvedRefReason?: string;
  unresolvedRefCode?: "SECRET_REF_REDACTED_VALUE";
}>;
declare function resolveConfiguredSecretInputWithFallback(params: ConfiguredSecretInputParams & {
  readFallback?: () => string | undefined;
}): Promise<{
  value?: string;
  source?: ConfiguredSecretInputSource;
  unresolvedRefReason?: string;
  unresolvedRefCode?: "SECRET_REF_REDACTED_VALUE";
  secretRefConfigured: boolean;
}>;
declare function resolveRequiredConfiguredSecretRefInputString(params: ConfiguredSecretInputParams): Promise<string | undefined>;
//#endregion
export { resolveConfiguredSecretInputWithFallback as n, resolveRequiredConfiguredSecretRefInputString as r, resolveConfiguredSecretInputString as t };
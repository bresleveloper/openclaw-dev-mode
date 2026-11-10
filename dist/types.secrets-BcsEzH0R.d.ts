import { _ as SecretsConfigSchema, g as SecretProviderSchema } from "./zod-schema.core-BMDlLGfv.js";
import { z } from "zod";
//#region src/secrets/ref-contract.d.ts
type SecretRefSource = "env" | "file" | "exec" | "store";
/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 * - store source: provider "default", id "OPENAI_API_KEY"
 */
type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};
type SecretInput = string | SecretRef;
declare function isSecretRef(value: unknown): value is SecretRef;
type SecretRefDefaultsCarrier = {
  secrets?: {
    /** Explicit per-source provider aliases selected by the operator. */
    defaults?: {
      env?: string;
      file?: string;
      exec?: string;
      store?: string;
    };
    /** Provider declarations used only when callers ask to prefer the first matching source. */
    providers?: Record<string, {
      source?: string;
    }>;
  };
};
declare function resolveDefaultSecretProviderAlias(config: SecretRefDefaultsCarrier, source: SecretRefSource, options?: {
  preferFirstProviderForSource?: boolean;
}): string;
/** Whether a source-specific built-in provider owns this selected default alias. */
declare function isBuiltInDefaultSecretProviderRef(config: SecretRefDefaultsCarrier, ref: SecretRef): boolean;
declare function isValidSecretRef(ref: SecretRef): boolean;
//#endregion
//#region src/config/types.secrets.d.ts
/** Secret string read mode: throw on unresolved refs or inspect without resolving. */
type SecretInputStringResolutionMode = "strict" | "inspect";
/** Result of reading a secret input without necessarily materializing the secret value. */
type SecretInputStringResolution = {
  status: "available";
  value: string;
  ref: null;
} | {
  status: "configured_unavailable";
  value: undefined;
  ref: SecretRef;
} | {
  status: "missing";
  value: undefined;
  ref: null;
};
type SecretDefaults = SecretsConfig["defaults"];
/** Public SDK input adapter; persisted config and state are normalized by Doctor. */
declare function coerceSecretRef(value: unknown, defaults?: SecretDefaults): SecretRef | null;
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
declare function hasConfiguredSecretInput(value: unknown, defaults?: SecretDefaults): boolean;
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
declare function normalizeSecretInputString(value: unknown): string | undefined;
/** Throw when a secret field still contains an unresolved SecretRef at a read site. */
declare function assertSecretInputResolved(params: Omit<Parameters<typeof resolveSecretInputString>[0], "mode">): void;
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
declare function resolveSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
  mode?: SecretInputStringResolutionMode;
}): SecretInputStringResolution;
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
declare function normalizeResolvedSecretInputString(params: Parameters<typeof assertSecretInputResolved>[0]): string | undefined;
type SecretProviderConfig = z.input<typeof SecretProviderSchema>;
type ExecSecretProviderConfig = Extract<SecretProviderConfig, {
  source: "exec";
}>;
type ManualExecSecretProviderConfig = Extract<ExecSecretProviderConfig, {
  command: string;
}>;
type PluginIntegrationSecretProviderConfig = Exclude<ExecSecretProviderConfig, ManualExecSecretProviderConfig>;
type SecretsConfig = NonNullable<z.input<typeof SecretsConfigSchema>>;
//#endregion
export { coerceSecretRef as a, normalizeSecretInputString as c, SecretRef as d, SecretRefSource as f, resolveDefaultSecretProviderAlias as g, isValidSecretRef as h, SecretProviderConfig as i, resolveSecretInputString as l, isSecretRef as m, SecretInputStringResolution as n, hasConfiguredSecretInput as o, isBuiltInDefaultSecretProviderRef as p, SecretInputStringResolutionMode as r, normalizeResolvedSecretInputString as s, PluginIntegrationSecretProviderConfig as t, SecretInput as u };
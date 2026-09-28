import { g as SecretsConfigSchema, h as SecretProviderSchema } from "./zod-schema.core-CFOD6InI.js";
import { z } from "zod";
//#region src/secrets/ref-contract.d.ts
/** Supported secret reference backends in config. */
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
/** Secret-bearing config input: either a literal string or a structured SecretRef. */
type SecretInput = string | SecretRef;
/** Narrow a value to the canonical SecretRef object shape. */
declare function isSecretRef(value: unknown): value is SecretRef;
/** Minimal config shape needed to resolve default provider aliases for a secret source. */
type SecretRefDefaultsCarrier = {
  /** Secrets config subset; callers pass full config objects or narrow test doubles. */
  secrets?: {
    /** Explicit per-source provider aliases selected by the operator. */
    defaults?: {
      /** Default provider alias for environment-variable secret refs. */
      env?: string;
      /** Default provider alias for file-backed secret refs. */
      file?: string;
      /** Default provider alias for exec-backed secret refs. */
      exec?: string;
      /** Default provider alias for shared-store secret refs. */
      store?: string;
    };
    /** Provider declarations used only when callers ask to prefer the first matching source. */
    providers?: Record<string, {
      source?: string;
    }>;
  };
};
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
declare function resolveDefaultSecretProviderAlias(config: SecretRefDefaultsCarrier, source: SecretRefSource, options?: {
  preferFirstProviderForSource?: boolean;
}): string;
/** Whether a source-specific built-in provider owns this selected default alias. */
declare function isBuiltInDefaultSecretProviderRef(config: SecretRefDefaultsCarrier, ref: SecretRef): boolean;
/** Validates a complete SecretRef against the shared provider/source/id grammar. */
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
type SecretDefaults = {
  /** Default provider alias for env SecretRefs. */
  env?: string;
  /** Default provider alias for file SecretRefs. */
  file?: string;
  /** Default provider alias for exec SecretRefs. */
  exec?: string;
  /** Default provider alias for shared-store SecretRefs. */
  store?: string;
};
/** Coerce canonical and env-shorthand secret inputs into a SecretRef.
 * Retired string markers are parsed only by doctor migration above. */
declare function coerceSecretRef(value: unknown, defaults?: SecretDefaults): SecretRef | null;
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
declare function hasConfiguredSecretInput(value: unknown, defaults?: SecretDefaults): boolean;
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
declare function normalizeSecretInputString(value: unknown): string | undefined;
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
declare function resolveSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
  mode?: SecretInputStringResolutionMode;
}): SecretInputStringResolution;
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
declare function normalizeResolvedSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
}): string | undefined;
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
export { resolveDefaultSecretProviderAlias as _, SecretsConfig as a, normalizeResolvedSecretInputString as c, SecretInput as d, SecretRef as f, isValidSecretRef as g, isSecretRef as h, SecretProviderConfig as i, normalizeSecretInputString as l, isBuiltInDefaultSecretProviderRef as m, SecretInputStringResolution as n, coerceSecretRef as o, SecretRefSource as p, SecretInputStringResolutionMode as r, hasConfiguredSecretInput as s, PluginIntegrationSecretProviderConfig as t, resolveSecretInputString as u };
//#region src/secrets/target-registry-types.d.ts
type SecretTargetConfigFile = "openclaw.json" | "auth-profile-store";
/** Storage shape used by a target: inline SecretInput or a sibling `*Ref` field. */
type SecretTargetShape = "secret_input" | "sibling_ref";
type SecretTargetExpected = "string" | "string-or-object";
type AuthProfileType = "api_key" | "token";
type SecretTargetRegistryEntry = {
  /** Stable id used by plans, audits, docs, and targeted discovery filters. */
  id: string;
  /** Plan/configure target family; aliases keep CLI-facing names additive. */
  targetType: string;
  targetTypeAliases?: string[];
  configFile: SecretTargetConfigFile;
  /** Dot-path pattern for the secret-bearing value; `*` captures path segments. */
  pathPattern: string;
  /** Structured pattern segments preserve literal plugin IDs containing dots. */
  pathPatternSegments?: string[];
  /** Optional sibling SecretRef path materialized from the same captures as `pathPattern`. */
  refPathPattern?: string;
  secretShape: SecretTargetShape;
  expectedResolvedValue: SecretTargetExpected;
  /** Enables `openclaw secrets apply` targeting for this entry. */
  includeInPlan: boolean;
  /** Enables interactive/non-interactive configure candidate generation. */
  includeInConfigure: boolean;
  /** Enables plaintext/unresolved-ref audit scanning. */
  includeInAudit: boolean;
  /** Captured path segment that names the owning provider, when applicable. */
  providerIdPathSegmentIndex?: number;
  /** Captured path segment that names the owning account/profile, when applicable. */
  accountIdPathSegmentIndex?: number;
  authProfileType?: AuthProfileType;
  /** Enables provider-shadowing diagnostics for provider-auth surfaces with fallback order. */
  trackProviderShadowing?: boolean;
};
//#endregion
export { SecretTargetRegistryEntry as n, SecretTargetShape as r, SecretTargetExpected as t };
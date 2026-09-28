//#region src/secrets/target-registry-types.d.ts
/** Config document that owns a registered secret-bearing target. */
type SecretTargetConfigFile = "openclaw.json" | "auth-profile-store";
/** Storage shape used by a target: inline SecretInput or a sibling `*Ref` field. */
type SecretTargetShape = "secret_input" | "sibling_ref";
/** Resolved value shape accepted by runtime and apply validation. */
type SecretTargetExpected = "string" | "string-or-object";
/** Auth profile families that have separate secret target coverage. */
type AuthProfileType = "api_key" | "token";
/**
 * Registry metadata for one configurable secret-bearing value.
 */
type SecretTargetRegistryEntry = {
  /** Stable id used by plans, audits, docs, and targeted discovery filters. */
  id: string;
  /** Plan/configure target family; aliases keep CLI-facing names additive. */
  targetType: string;
  targetTypeAliases?: string[];
  /** Config document where the value is discovered or rewritten. */
  configFile: SecretTargetConfigFile;
  /** Dot-path pattern for the secret-bearing value; `*` captures path segments. */
  pathPattern: string;
  /** Structured pattern segments preserve literal plugin IDs containing dots. */
  pathPatternSegments?: string[];
  /** Optional sibling SecretRef path materialized from the same captures as `pathPattern`. */
  refPathPattern?: string;
  /** Whether the registered value stores a SecretInput directly or via a sibling ref field. */
  secretShape: SecretTargetShape;
  /** Runtime value shape accepted after SecretRef resolution. */
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
  /** Auth-profile family for auth-profiles.json entries. */
  authProfileType?: AuthProfileType;
  /** Enables provider-shadowing diagnostics for provider-auth surfaces with fallback order. */
  trackProviderShadowing?: boolean;
};
//#endregion
export { SecretTargetRegistryEntry as n, SecretTargetShape as r, SecretTargetExpected as t };
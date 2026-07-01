import type { SecretDefaults } from "./runtime-shared.js";
/**
 * Returns whether a value tree contains anything coercible to a SecretRef.
 * `seen` may be shared across sibling probes to preserve cycle safety.
 */
export declare function hasSecretRefCandidate(value: unknown, defaults: SecretDefaults | undefined, seen?: WeakSet<object>): boolean;
/**
 * Returns whether a value tree contains SecretRefs or non-empty credential-looking fields.
 * Used before runtime fast-paths so enabled web tools do not skip secret-aware preparation.
 */
export declare function hasCredentialBearingObjectValue(value: unknown, defaults: SecretDefaults | undefined, seen?: WeakSet<object>): boolean;

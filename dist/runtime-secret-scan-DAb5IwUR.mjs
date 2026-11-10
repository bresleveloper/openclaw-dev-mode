import { h as parseSecretRef, l as isLegacySecretRefWithoutProvider } from "./types.secrets-Dgbd2kyP.mjs";
//#region src/secrets/runtime-secret-scan.ts
/** Scans config-like values for SecretRefs and credential-looking fields. */
/** Field names treated as credential-bearing even before a value is converted to SecretRef. */
const CREDENTIAL_FIELD_NAMES = /* @__PURE__ */ new Set([
	"apikey",
	"key",
	"token",
	"secret",
	"password"
]);
function hasRecursiveSecretValue(value, defaults, seen, includeCredentialFields = false) {
	if (isLegacySecretRefWithoutProvider(value) || parseSecretRef(value, defaults)) return true;
	if (!value || typeof value !== "object") return false;
	if (seen.has(value)) return false;
	seen.add(value);
	if (Array.isArray(value)) return value.some((entry) => hasRecursiveSecretValue(entry, defaults, seen, includeCredentialFields));
	return Object.entries(value).some(([key, entry]) => includeCredentialFields && CREDENTIAL_FIELD_NAMES.has(key.toLowerCase()) && entry != null && entry !== "" || hasRecursiveSecretValue(entry, defaults, seen, includeCredentialFields));
}
/** Returns whether a value tree contains anything coercible to a SecretRef. */
function hasSecretRefCandidate(value, defaults) {
	return hasRecursiveSecretValue(value, defaults, /* @__PURE__ */ new WeakSet());
}
/**
* Returns whether a value tree contains SecretRefs or non-empty credential-looking fields.
* Used before runtime fast-paths so enabled web tools do not skip secret-aware preparation.
*/
function hasCredentialBearingObjectValue(value, defaults) {
	return hasRecursiveSecretValue(value, defaults, /* @__PURE__ */ new WeakSet(), true);
}
//#endregion
export { hasSecretRefCandidate as n, hasCredentialBearingObjectValue as t };

import { o as isSecretResolutionError, t as describeSecretResolutionError } from "./resolve-errors-DYenvPyo.mjs";
//#region src/secrets/runtime-degraded-state.ts
const SECRET_DEGRADATION_RETRY_HINT = "openclaw secrets reload";
/** Only transient/unavailable resolution failures may enter degraded runtime state. */
function isRetryableSecretDegradationReason(reason) {
	return reason === "secret provider failed" || reason === "secret reference was not found";
}
/** Maps a typed resolution failure to redacted owner warnings when attribution is safe. */
function classifySecretResolutionErrorDegradations(error) {
	const degradations = listSecretResolutionErrorOwners(error).flatMap((owner) => owner.failureMatched ? [{
		kind: owner.ownerKind,
		id: owner.ownerId,
		reason: owner.reason,
		state: owner.degradationState,
		retryHint: SECRET_DEGRADATION_RETRY_HINT
	}] : []);
	if (degradations.length > 0 || !isSecretResolutionError(error)) return degradations;
	const reason = describeSecretResolutionError(error);
	return reason ? [{
		kind: "unknown",
		id: "unmapped",
		reason,
		state: "cold",
		retryHint: SECRET_DEGRADATION_RETRY_HINT
	}] : [];
}
/** Preserves known failure classes while dropping any embedded SecretRef identity. */
function redactSecretDegradationReason(reason) {
	switch (reason) {
		case "secret provider failed":
		case "secret provider is not configured":
		case "secret provider policy denied resolution":
		case "secret provider response violated its contract":
		case "secret reference is not allowed for this provider":
		case "secret reference was not found":
		case "secret reference was not materialized by the active runtime":
		case "resolved secret value was invalid":
		case "resolved secret value is a redaction placeholder":
		case "secret resolution failed": return reason;
		default: return "secret resolution failed";
	}
}
const SECRET_SURFACE_UNAVAILABLE_ERROR_CODE = "SECRET_SURFACE_UNAVAILABLE";
const trustedSecretSurfaceUnavailableErrors = /* @__PURE__ */ new WeakSet();
/** Runtime error returned when a request targets an isolated SecretRef owner. */
var SecretSurfaceUnavailableError = class extends Error {
	constructor(owner) {
		super(`Secret owner ${owner.ownerKind}:${owner.ownerId} is configured but unavailable (${owner.reason}).`);
		this.code = SECRET_SURFACE_UNAVAILABLE_ERROR_CODE;
		this.name = "SecretSurfaceUnavailableError";
		this.ownerKind = owner.ownerKind;
		this.ownerId = owner.ownerId;
		this.paths = [...owner.paths];
		trustedSecretSurfaceUnavailableErrors.add(this);
	}
};
/** Authenticates owner-created failures without trusting forgeable error names or prototypes. */
function isTrustedSecretSurfaceUnavailableError(error) {
	return typeof error === "object" && error !== null && trustedSecretSurfaceUnavailableErrors.has(error);
}
let activeDegradedOwners = [];
const resolutionErrorOwners = /* @__PURE__ */ new WeakMap();
const activeCredentialDegradedOwners = /* @__PURE__ */ new Map();
function ownerKey(ownerKind, ownerId) {
	return `${ownerKind}\0${ownerId}`;
}
function cloneOwner(owner) {
	return {
		...owner,
		paths: [...owner.paths],
		refKeys: [...owner.refKeys]
	};
}
/** Publishes the degraded-owner snapshot at the same edge as runtime config activation. */
function setActiveDegradedSecretOwners(owners) {
	activeDegradedOwners = owners.map(cloneOwner);
}
/** Publishes one runtime-discovered channel credential owner. */
function setActiveCredentialDegradedOwner(owner) {
	activeCredentialDegradedOwners.set(ownerKey(owner.ownerKind, owner.ownerId), cloneOwner(owner));
}
/** Lists credential owners independently of the replaceable SecretRef snapshot. */
function listActiveCredentialDegradedOwners() {
	return Array.from(activeCredentialDegradedOwners.values(), cloneOwner);
}
/** Clears credential-owner state only when its owning secrets runtime is torn down. */
function clearActiveCredentialDegradedOwners() {
	activeCredentialDegradedOwners.clear();
}
/** Clears one runtime-discovered channel credential owner before re-inspection. */
function clearActiveCredentialDegradedOwner(ownerKind, ownerId) {
	activeCredentialDegradedOwners.delete(ownerKey(ownerKind, ownerId));
}
/** Returns the active degraded-owner snapshot without exposing mutable registry state. */
function listActiveDegradedSecretOwners() {
	return [...activeDegradedOwners.map(cloneOwner), ...listActiveCredentialDegradedOwners()];
}
/** Associates a strict activation failure with the owners it prevented from refreshing. */
function associateSecretResolutionErrorOwners(error, owners) {
	if (typeof error !== "object" && typeof error !== "function" || error === null) return;
	resolutionErrorOwners.set(error, owners.map(cloneOwner));
}
/** Returns owner metadata recorded for a strict activation failure. */
function listSecretResolutionErrorOwners(error) {
	if (typeof error !== "object" && typeof error !== "function" || error === null) return [];
	return (resolutionErrorOwners.get(error) ?? []).map(cloneOwner);
}
/** Returns one active degraded owner, if present. */
function findActiveDegradedSecretOwner(ownerKind, ownerId) {
	const owner = activeDegradedOwners.find((entry) => entry.ownerKind === ownerKind && entry.ownerId === ownerId && entry.degradationState !== "stale") ?? activeCredentialDegradedOwners.get(ownerKey(ownerKind, ownerId));
	return owner ? cloneOwner(owner) : void 0;
}
/** Throws the canonical typed error when an owner was isolated at startup. */
function assertSecretOwnerAvailable(ownerKind, ownerId) {
	const owner = findActiveDegradedSecretOwner(ownerKind, ownerId);
	if (owner) throw new SecretSurfaceUnavailableError(owner);
}
/** Returns whether an owner is available without activating or resolving its secrets. */
function isSecretOwnerAvailable(ownerKind, ownerId) {
	return findActiveDegradedSecretOwner(ownerKind, ownerId) === void 0;
}
//#endregion
export { setActiveDegradedSecretOwners as _, classifySecretResolutionErrorDegradations as a, findActiveDegradedSecretOwner as c, isTrustedSecretSurfaceUnavailableError as d, listActiveCredentialDegradedOwners as f, setActiveCredentialDegradedOwner as g, redactSecretDegradationReason as h, associateSecretResolutionErrorOwners as i, isRetryableSecretDegradationReason as l, listSecretResolutionErrorOwners as m, SecretSurfaceUnavailableError as n, clearActiveCredentialDegradedOwner as o, listActiveDegradedSecretOwners as p, assertSecretOwnerAvailable as r, clearActiveCredentialDegradedOwners as s, SECRET_DEGRADATION_RETRY_HINT as t, isSecretOwnerAvailable as u };

//#region src/shared/thread-binding-lifecycle.ts
/** Resolves the next expiration for a channel thread binding from idle and max-age limits. */
function resolveThreadBindingLifecycle(params) {
	const idleTimeoutMs = typeof params.record.idleTimeoutMs === "number" ? Math.max(0, Math.floor(params.record.idleTimeoutMs)) : params.defaultIdleTimeoutMs;
	const maxAgeMs = typeof params.record.maxAgeMs === "number" ? Math.max(0, Math.floor(params.record.maxAgeMs)) : params.defaultMaxAgeMs;
	return resolveThreadBindingExpiry({
		inactivityExpiresAt: idleTimeoutMs > 0 ? Math.max(params.record.lastActivityAt, params.record.boundAt) + idleTimeoutMs : void 0,
		maxAgeExpiresAt: maxAgeMs > 0 ? params.record.boundAt + maxAgeMs : void 0
	});
}
/** Selects prepared expiry candidates; the caller owns timestamp and duration normalization. */
function resolveThreadBindingExpiry({ inactivityExpiresAt, maxAgeExpiresAt }) {
	if (inactivityExpiresAt != null && maxAgeExpiresAt != null) return inactivityExpiresAt <= maxAgeExpiresAt ? {
		expiresAt: inactivityExpiresAt,
		reason: "idle-expired"
	} : {
		expiresAt: maxAgeExpiresAt,
		reason: "max-age-expired"
	};
	if (inactivityExpiresAt != null) return {
		expiresAt: inactivityExpiresAt,
		reason: "idle-expired"
	};
	if (maxAgeExpiresAt != null) return {
		expiresAt: maxAgeExpiresAt,
		reason: "max-age-expired"
	};
	return {};
}
//#endregion
export { resolveThreadBindingLifecycle as n, resolveThreadBindingExpiry as t };

import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/config/sessions/auth-profile-override-provenance.ts
function resolveSessionAuthProfileOverrideSource(entry) {
	if (!entry?.authProfileOverride?.trim()) return;
	const isAutomatic = typeof entry.authProfileOverrideCompactionCount === "number";
	return entry.authProfileOverrideSource || (isAutomatic ? "auto" : "user");
}
/** Keep person-linked session provenance at user-pin strength in runtime consumers. */
function resolveCollapsedSessionAuthPinSource(entry) {
	const source = resolveSessionAuthProfileOverrideSource(entry);
	return source === "user-link" ? "user" : source;
}
function matchesLoginSnapshot(current, snapshot) {
	return current.sessionId === snapshot.sessionId && current.authProfileOverride === snapshot.authProfileOverride && current.authProfileOverrideSource === snapshot.authProfileOverrideSource && current.authProfileOverrideCompactionCount === snapshot.authProfileOverrideCompactionCount;
}
function resolvePersistedModelProvider(entry) {
	return normalizeLowercaseStringOrEmpty(entry.providerOverride ?? entry.modelProvider) || void 0;
}
/** Decide one session-profile adoption from the authoritative row read immediately before write. */
function decideProviderLoginSessionAdoption(params) {
	if (!params.nextProfileId) return { status: "rejected" };
	if (!params.currentModelProvider || normalizeLowercaseStringOrEmpty(params.currentModelProvider) !== normalizeLowercaseStringOrEmpty(params.loginProvider) || !params.current) return { status: "unchanged" };
	const currentProvider = resolvePersistedModelProvider(params.current);
	const snapshotProvider = params.snapshot ? resolvePersistedModelProvider(params.snapshot) : void 0;
	if (currentProvider && currentProvider !== normalizeLowercaseStringOrEmpty(params.loginProvider) || params.snapshot && currentProvider !== snapshotProvider) return { status: "unchanged" };
	if (params.snapshot) {
		if (!matchesLoginSnapshot(params.current, params.snapshot)) return { status: "rejected" };
	} else if (resolveCollapsedSessionAuthPinSource(params.current) === "user" && params.current.authProfileOverride !== params.nextProfileId) return { status: "rejected" };
	return params.current.authProfileOverride !== params.nextProfileId || params.current.authProfileOverrideSource !== "user" || params.current.authProfileOverrideCompactionCount !== void 0 ? {
		status: "patch",
		patch: {
			authProfileOverride: params.nextProfileId,
			authProfileOverrideSource: "user",
			authProfileOverrideCompactionCount: void 0
		}
	} : { status: "unchanged" };
}
/** A persisted row proves a patch only when it carries the exact login profile we wrote. */
function isProviderLoginPatchPersisted(persisted, nextProfileId) {
	return persisted.authProfileOverride === nextProfileId && persisted.authProfileOverrideSource === "user" && persisted.authProfileOverrideCompactionCount === void 0;
}
//#endregion
export { resolveSessionAuthProfileOverrideSource as i, isProviderLoginPatchPersisted as n, resolveCollapsedSessionAuthPinSource as r, decideProviderLoginSessionAdoption as t };

//#region src/acp/runtime/session-control-owner.ts
/** Runtime names are opaque backend locators; ordinary metadata enrichment may continue. */
function matchesAcpSessionRuntimeLocator(current, expected) {
	return current?.backend === expected.backend && current.runtimeSessionName === expected.runtimeSessionName;
}
/** ACP task control keeps the spawner authoritative over a navigation parent. */
function resolveAcpSessionControlOwner(entry) {
	return entry?.spawnedBy?.trim() || entry?.parentSessionKey?.trim();
}
function matchesAcpSessionControlBinding(entry, expected) {
	return Boolean(entry && entry.sessionId === expected.sessionId && entry.lifecycleRevision === expected.lifecycleRevision && (expected.lifecycleRevision !== void 0 || entry.sessionStartedAt === expected.sessionStartedAt) && resolveAcpSessionControlOwner(entry) === expected.ownerKey);
}
//#endregion
//#region src/acp/runtime/session-meta-entry.kernel.ts
function captureAcpSessionEntryBinding({ sessionId, lifecycleRevision, sessionStartedAt }) {
	return {
		sessionId,
		lifecycleRevision,
		sessionStartedAt
	};
}
/** A fresh row may change metadata, but cannot replace the lifecycle or cleanup target. */
function assertAcpSessionMutationEntry(entry, expected, control, phase) {
	if (!(expected === null ? entry === void 0 : entry !== void 0 && entry.sessionId === expected.sessionId && entry.lifecycleRevision === expected.lifecycleRevision && (expected.lifecycleRevision !== void 0 || entry.sessionStartedAt === expected.sessionStartedAt)) || control && !matchesAcpSessionControlBinding(entry, control)) throw new Error(`Canonical ACP session changed before ${phase}.`);
}
//#endregion
export { resolveAcpSessionControlOwner as a, matchesAcpSessionRuntimeLocator as i, captureAcpSessionEntryBinding as n, matchesAcpSessionControlBinding as r, assertAcpSessionMutationEntry as t };

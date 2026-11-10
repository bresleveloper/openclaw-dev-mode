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
export { matchesAcpSessionRuntimeLocator as n, resolveAcpSessionControlOwner as r, matchesAcpSessionControlBinding as t };

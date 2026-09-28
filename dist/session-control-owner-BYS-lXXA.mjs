//#region src/acp/runtime/session-control-owner.ts
/** ACP task control keeps the spawner authoritative over a navigation parent. */
function resolveAcpSessionControlOwner(entry) {
	return entry?.spawnedBy?.trim() || entry?.parentSessionKey?.trim();
}
//#endregion
export { resolveAcpSessionControlOwner as t };

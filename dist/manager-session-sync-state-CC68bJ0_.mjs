import { C as isDreamingNarrativeSessionStoreKey, x as isCronRunSessionKey } from "./session-key-C09ow4h0.mjs";
import "./session-key-runtime-CgEY8jLa.mjs";
//#region extensions/memory-core/src/memory/manager-session-sync-state.ts
function isMemorySessionIndexable(entry, archivedSessionKey) {
	return !(entry.generatedByDreamingNarrative || entry.generatedByCronRun || entry.sessionKind === "cron" || entry.sessionKind === "heartbeat" || archivedSessionKey !== void 0 && (isDreamingNarrativeSessionStoreKey(archivedSessionKey) || isCronRunSessionKey(archivedSessionKey) || archivedSessionKey.endsWith(":heartbeat")) || entry.lineProvenance !== void 0 && entry.lineProvenance.length > 0 && entry.lineProvenance.every((line) => line.originClass === "system"));
}
function resolveMemorySessionStartupState(params) {
	const existingRows = params.existingRows ?? [];
	const indexedRows = new Map(existingRows.map((row) => [row.path, row]));
	const activePaths = new Set(params.files.map((file) => file.path));
	const dirtyFiles = [];
	for (const file of params.files) {
		const existing = indexedRows.get(file.path);
		if (!existing || existing.hash === "") {
			dirtyFiles.push(file.absPath);
			continue;
		}
		const indexedMtimeMs = Number(existing.mtime);
		const indexedSize = Number(existing.size);
		if (!Number.isFinite(indexedMtimeMs) || !Number.isFinite(indexedSize) || file.size !== indexedSize || file.mtimeMs !== indexedMtimeMs || file.revisionMs !== void 0 && !existing.hash.startsWith(`sqlite:${file.revisionMs}:`)) dirtyFiles.push(file.absPath);
	}
	return {
		dirtyFiles,
		hasStaleIndexedPaths: existingRows.some((row) => !activePaths.has(row.path))
	};
}
function resolveMemorySessionSyncPlan(params) {
	const activePaths = params.targetSessionFiles ? null : new Set(params.files.map((file) => params.sessionPathForFile(file)));
	const existingRows = activePaths === null ? null : params.existingRows ?? [];
	return {
		activePaths,
		existingRows,
		existingHashes: existingRows ? new Map(existingRows.map((row) => [row.path, row.hash])) : null,
		indexAll: params.needsFullReindex || Boolean(params.targetSessionFiles)
	};
}
//#endregion
export { resolveMemorySessionStartupState as n, resolveMemorySessionSyncPlan as r, isMemorySessionIndexable as t };

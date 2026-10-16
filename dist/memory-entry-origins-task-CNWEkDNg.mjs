//#region extensions/memory-core/src/memory-entry-origins-task.ts
function selectedMemoryLineageIdentity(origins, sessionIds, entryKeys) {
	return JSON.stringify(origins.filter((origin) => sessionIds.has(origin.sessionId) || entryKeys.has(origin.entryKey)).map(({ entryKey, sessionId }) => [entryKey, sessionId]));
}
//#endregion
export { selectedMemoryLineageIdentity as t };

//#region src/plugins/plugin-entry-order.ts
function comparePluginEntryIdentity(left, right) {
	return left.id.localeCompare(right.id) || left.pluginId.localeCompare(right.pluginId);
}
function sortPluginEntriesById(entries) {
	return entries.toSorted(comparePluginEntryIdentity);
}
/** Sorts auto-detect candidates by priority, then stable plugin identity. */
function sortPluginEntriesForAutoDetect(entries) {
	return entries.toSorted((left, right) => {
		const leftOrder = left.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.autoDetectOrder ?? Number.MAX_SAFE_INTEGER;
		if (leftOrder !== rightOrder) return leftOrder - rightOrder;
		return comparePluginEntryIdentity(left, right);
	});
}
//#endregion
export { sortPluginEntriesForAutoDetect as n, sortPluginEntriesById as t };

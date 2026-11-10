//#region src/plugins/status-compatibility.ts
function formatPluginCompatibilityNotice(notice) {
	return `${notice.pluginId} ${notice.message}`;
}
//#endregion
export { formatPluginCompatibilityNotice as t };

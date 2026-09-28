//#region src/plugins/status-compatibility.ts
function formatPluginCompatibilityNotice(notice) {
	return `${notice.pluginId} ${notice.message}`;
}
function summarizePluginCompatibility(notices) {
	return {
		noticeCount: notices.length,
		pluginCount: new Set(notices.map((notice) => notice.pluginId)).size
	};
}
//#endregion
export { summarizePluginCompatibility as n, formatPluginCompatibilityNotice as t };

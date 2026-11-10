//#region src/channels/plugins/status-state.ts
function formatChannelStatusState(statusState) {
	switch (statusState) {
		case "not-linked": return "not linked";
		case "unstable": return "auth stabilizing";
		default: return statusState;
	}
}
//#endregion
export { formatChannelStatusState as t };

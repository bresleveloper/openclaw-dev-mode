//#region src/system-agent/operation-types.ts
function isSystemAgentNavigationOperation(operation) {
	switch (operation.kind) {
		case "channel-setup":
		case "skills-setup":
		case "search-setup":
		case "gateway-config-setup":
		case "memory-import":
		case "model-setup":
		case "model-accounts":
		case "open-setup":
		case "open-tui": return true;
		default: return false;
	}
}
//#endregion
export { isSystemAgentNavigationOperation as t };

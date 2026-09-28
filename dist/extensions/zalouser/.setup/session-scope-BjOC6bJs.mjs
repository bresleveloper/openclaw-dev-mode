//#region extensions/zalouser/src/session-scope.ts
function resolveZalouserDmSessionScope(config) {
	const configured = config.session?.dmScope;
	return configured === "main" || !configured ? "per-channel-peer" : configured;
}
//#endregion
export { resolveZalouserDmSessionScope as t };

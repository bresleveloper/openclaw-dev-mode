// extensions/zalouser/src/session-scope.ts
function resolveZalouserDmSessionScope(config) {
	const configured = config.session?.dmScope;
	return configured === "main" || !configured ? "per-channel-peer" : configured;
}
export { resolveZalouserDmSessionScope as t };

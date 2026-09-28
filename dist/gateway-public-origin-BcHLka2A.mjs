//#region src/config/gateway-public-origin.ts
function resolveGatewayPublicOrigin(config) {
	const raw = config?.gateway?.publicOrigin?.trim();
	if (!raw) return;
	try {
		const parsed = new URL(raw);
		return parsed.pathname === "/" && !parsed.search && !parsed.hash ? parsed.origin : void 0;
	} catch {
		return;
	}
}
//#endregion
export { resolveGatewayPublicOrigin as t };

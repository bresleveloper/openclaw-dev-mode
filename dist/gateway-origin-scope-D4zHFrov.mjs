//#region packages/gateway-client/src/gateway-origin-scope.ts
function normalizeGatewayScope(gatewayUrl, includeSearch) {
	const trimmed = gatewayUrl.trim();
	if (!trimmed) return "default";
	try {
		const browserLocation = globalThis.location;
		const base = browserLocation ? `${browserLocation.protocol}//${browserLocation.host}${browserLocation.pathname || "/"}` : void 0;
		const parsed = base ? new URL(trimmed, base) : new URL(trimmed);
		const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/+$/, "") || parsed.pathname;
		return `${parsed.protocol}//${parsed.host}${pathname}${includeSearch ? parsed.search : ""}`;
	} catch {
		return trimmed;
	}
}
/** Normalizes the gateway URL scope used for origin-bound device tokens. */
function gatewayOriginScope(gatewayUrl) {
	return normalizeGatewayScope(gatewayUrl, false);
}
//#endregion
export { gatewayOriginScope as t };

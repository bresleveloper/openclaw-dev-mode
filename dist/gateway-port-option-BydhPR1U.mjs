import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
//#region src/cli/gateway-port-option.ts
const MAX_TCP_PORT = 65535;
function parseGatewayPortOption(raw, flagName = "--port") {
	if (raw === void 0 || raw === null) return;
	const parsed = parseStrictPositiveInteger(typeof raw === "bigint" ? String(raw) : raw);
	if (parsed === void 0 || parsed > MAX_TCP_PORT) throw new Error(`${flagName} must be an integer between 1 and ${MAX_TCP_PORT}.`);
	return parsed;
}
function resolveGatewayLocalPortOverride(opts) {
	const port = opts.localPortOverride ?? parseGatewayPortOption(opts.port);
	if (port !== void 0 && typeof opts.url === "string" && opts.url.trim()) throw new Error("Use either --url or --port, not both.");
	return port;
}
//#endregion
export { resolveGatewayLocalPortOverride as n, parseGatewayPortOption as t };

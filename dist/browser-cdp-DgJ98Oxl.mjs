import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
//#region src/plugin-sdk/browser-cdp.ts
/** Detect an operator-supplied port before WHATWG URL normalization drops default ports. */
function hasRawExplicitPort(raw) {
	const authority = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split(/[/?#]/, 1)[0] ?? "";
	const hostPort = authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority;
	if (hostPort.startsWith("[")) return /^\[[^\]]+\]:\d+$/.test(hostPort);
	return /:\d+$/.test(hostPort);
}
/**
* Parses a browser/CDP endpoint and returns both URL semantics and display-safe normalized forms.
*/
function parseBrowserHttpUrl(raw, label) {
	const trimmed = raw.trim();
	const parsed = new URL(trimmed);
	if (![
		"http:",
		"https:",
		"ws:",
		"wss:"
	].includes(parsed.protocol)) throw new Error(`${label} must be http(s) or ws(s), got: ${parsed.protocol.replace(":", "")}`);
	const isSecure = parsed.protocol === "https:" || parsed.protocol === "wss:";
	const hasExplicitPort = hasRawExplicitPort(trimmed);
	const port = parsed.port ? Number.parseInt(parsed.port, 10) : isSecure ? 443 : 80;
	if (Number.isNaN(port) || port <= 0 || port > 65535) throw new Error(`${label} has invalid port: ${parsed.port}`);
	const normalized = parsed.toString().replace(/\/$/, "");
	return {
		parsed,
		port,
		hasExplicitPort,
		normalized,
		normalizedWithPort: hasExplicitPort && !parsed.port ? normalized.replace(/^[^:]+:\/\/[^/?#]+/, (authority) => `${authority}:${port}`) : normalized
	};
}
/**
* Redacts credentials and known sensitive tokens from CDP URLs before logs or diagnostics.
*/
function redactCdpUrl(cdpUrl) {
	if (typeof cdpUrl !== "string") return cdpUrl;
	const trimmed = cdpUrl.trim();
	if (!trimmed) return trimmed;
	try {
		const parsed = new URL(trimmed);
		parsed.username = "";
		parsed.password = "";
		return redactToolPayloadText(parsed.toString().replace(/\/$/, ""));
	} catch {
		return redactToolPayloadText(trimmed);
	}
}
//#endregion
export { redactCdpUrl as n, parseBrowserHttpUrl as t };

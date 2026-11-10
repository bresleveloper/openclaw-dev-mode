import { t as captureSecretRedactionRegistrySnapshot } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { a as containsSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
//#region src/status/status-model-endpoint.ts
const DISPLAYABLE_ENDPOINT_PATHS = /* @__PURE__ */ new Set([
	"/",
	"/v1",
	"/responses",
	"/v1/responses",
	"/backend-api/codex",
	"/backend-api/codex/responses",
	"/messages",
	"/v1/messages",
	"/chat/completions",
	"/v1/chat/completions"
]);
/** Bounded endpoint display for status; never retains URL credentials or custom paths. */
function formatModelEndpointUrl(rawUrl) {
	if (rawUrl.length > 8192) return;
	try {
		const url = new URL(rawUrl);
		if (![
			"http:",
			"https:",
			"ws:",
			"wss:"
		].includes(url.protocol)) return;
		const hostname = url.hostname.toLowerCase();
		if (containsSecretSentinel(hostname) || captureSecretRedactionRegistrySnapshot().values.some((secret) => secret.length > 0 && hostname.includes(secret.toLowerCase()))) return;
		const pathname = url.pathname.replace(/\/$/, "") || "/";
		const endpoint = url.origin + (DISPLAYABLE_ENDPOINT_PATHS.has(pathname) ? pathname === "/" ? "" : pathname : "/[path hidden]");
		return endpoint.length <= 512 ? endpoint : void 0;
	} catch {
		return;
	}
}
//#endregion
export { formatModelEndpointUrl as t };

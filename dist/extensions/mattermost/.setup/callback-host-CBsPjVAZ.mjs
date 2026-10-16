import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/mattermost/src/mattermost/callback-host.ts
const DEFAULT_SLASH_CALLBACK_PATH = "/api/channels/mattermost/command";
function normalizeCallbackPath(value) {
	const path = normalizeOptionalString(value) ?? DEFAULT_SLASH_CALLBACK_PATH;
	return path.startsWith("/") ? path : `/${path}`;
}
/** Registration and the pre-plugin auth artifact must discover the same routes. */
function collectMattermostCallbackPaths(config) {
	const base = asOptionalRecord(config);
	const paths = /* @__PURE__ */ new Set();
	for (const account of [base, ...Object.values(asOptionalRecord(base?.accounts) ?? {})]) {
		const commands = asOptionalRecord(asOptionalRecord(account)?.commands);
		paths.add(normalizeCallbackPath(commands?.callbackPath));
		const callbackUrl = normalizeOptionalString(commands?.callbackUrl);
		if (callbackUrl) try {
			const path = new URL(callbackUrl).pathname;
			if (path) paths.add(path);
		} catch {}
	}
	return [...paths];
}
function isWildcardBindHost(rawHost) {
	const trimmed = rawHost.trim();
	if (!trimmed) return false;
	const host = trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed;
	return host === "0.0.0.0" || host === "::" || host === "0:0:0:0:0:0:0:0" || host === "::0";
}
function resolveCallbackHost(rawHost, trim = false) {
	const host = rawHost && !isWildcardBindHost(rawHost) ? trim ? rawHost.trim() : rawHost : "localhost";
	return host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
}
//#endregion
export { normalizeCallbackPath as n, resolveCallbackHost as r, collectMattermostCallbackPaths as t };

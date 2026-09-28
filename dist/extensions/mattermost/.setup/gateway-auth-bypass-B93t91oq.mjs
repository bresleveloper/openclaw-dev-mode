import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/mattermost/src/gateway-auth-bypass.ts
const DEFAULT_SLASH_CALLBACK_PATH = "/api/channels/mattermost/command";
function normalizeCallbackPath(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return DEFAULT_SLASH_CALLBACK_PATH;
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
function readMattermostCommands(value) {
	return asOptionalRecord(value);
}
function isMattermostBypassPath(path) {
	return path === DEFAULT_SLASH_CALLBACK_PATH || path.startsWith("/api/channels/mattermost/");
}
function collectMattermostSlashCallbackPaths(raw) {
	const paths = /* @__PURE__ */ new Set([normalizeCallbackPath(raw?.callbackPath)]);
	const callbackUrl = normalizeOptionalString(raw?.callbackUrl);
	if (callbackUrl) try {
		const pathname = new URL(callbackUrl).pathname;
		if (pathname) paths.add(pathname);
	} catch {}
	return [...paths];
}
function resolveMattermostGatewayAuthBypassPaths(params) {
	const channels = params.cfg.channels;
	const base = channels?.mattermost && typeof channels.mattermost === "object" ? channels.mattermost : void 0;
	const callbackPaths = new Set(collectMattermostSlashCallbackPaths(readMattermostCommands(base?.commands)).filter(isMattermostBypassPath));
	const accounts = base?.accounts ?? {};
	for (const account of Object.values(accounts)) {
		const accountConfig = account && typeof account === "object" && !Array.isArray(account) ? account : void 0;
		for (const path of collectMattermostSlashCallbackPaths(readMattermostCommands(accountConfig?.commands))) if (isMattermostBypassPath(path)) callbackPaths.add(path);
	}
	return [...callbackPaths];
}
//#endregion
export { resolveMattermostGatewayAuthBypassPaths as t };

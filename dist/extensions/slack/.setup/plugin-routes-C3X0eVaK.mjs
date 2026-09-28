import { r as normalizeSlackWebhookPath, t as handleSlackHttpRequest } from "./registry-bbjH7IHX.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
//#region extensions/slack/src/http/plugin-routes.ts
function resolveSlackWebhookPaths(config) {
	const slack = config.channels?.slack;
	const accountConfigs = slack?.accounts ?? {};
	const paths = /* @__PURE__ */ new Set();
	for (const accountId of /* @__PURE__ */ new Set([DEFAULT_ACCOUNT_ID, ...Object.keys(accountConfigs)])) {
		const path = accountConfigs[accountId]?.webhookPath ?? slack?.webhookPath;
		paths.add(normalizeSlackWebhookPath(typeof path === "string" ? path : void 0));
	}
	return [...paths].toSorted((left, right) => left.localeCompare(right));
}
function registerSlackPluginHttpRoutes(api) {
	for (const path of resolveSlackWebhookPaths(api.config)) api.registerHttpRoute({
		path,
		auth: "plugin",
		handler: async (req, res) => await handleSlackHttpRequest(req, res)
	});
}
//#endregion
export { registerSlackPluginHttpRoutes as t };

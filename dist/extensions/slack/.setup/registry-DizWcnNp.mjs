import { resolveGlobalMap } from "openclaw/plugin-sdk/global-singleton";
//#region extensions/slack/src/http/paths.ts
function normalizeSlackWebhookPath(path) {
	const trimmed = path?.trim();
	if (!trimmed) return "/slack/events";
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
//#endregion
//#region extensions/slack/src/http/registry.ts
const slackHttpRoutes = resolveGlobalMap(Symbol.for("openclaw.slack.httpRoutes.v1"));
function registerSlackHttpHandler(params) {
	const normalizedPath = normalizeSlackWebhookPath(params.path);
	const routes = slackHttpRoutes;
	if (routes.has(normalizedPath)) {
		const suffix = params.accountId ? ` for account "${params.accountId}"` : "";
		params.log?.(`slack: webhook path ${normalizedPath} already registered${suffix}`);
		return () => {};
	}
	const handler = params.handler;
	routes.set(normalizedPath, handler);
	let registered = true;
	return () => {
		if (!registered) return;
		registered = false;
		if (routes.get(normalizedPath) === handler) routes.delete(normalizedPath);
	};
}
async function handleSlackHttpRequest(req, res) {
	const url = new URL(req.url ?? "/", "http://localhost");
	const handler = slackHttpRoutes.get(url.pathname);
	if (!handler) return false;
	await handler(req, res);
	return true;
}
//#endregion
export { registerSlackHttpHandler as n, normalizeSlackWebhookPath as r, handleSlackHttpRequest as t };

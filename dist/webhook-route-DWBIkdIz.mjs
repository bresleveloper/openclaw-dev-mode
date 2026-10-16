import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { i as classifyGatewayProbePath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { n as resolvePluginRoutePathContext, t as isProtectedPluginRoutePathFromContext } from "./path-context-D7IHOCQE.mjs";
import "./gateway-config-runtime-CFClkPZC.mjs";
//#region extensions/telegram/src/webhook-route.ts
const DEFAULT_TELEGRAM_WEBHOOK_PATH = "/telegram-webhook";
function resolveTelegramGatewayWebhookUrl(config, path) {
	const origin = resolveGatewayPublicOrigin(config);
	return origin ? URL.parse(`${origin}${path.startsWith("/") ? path : `/${path}`}`)?.href : void 0;
}
function resolveTelegramWebhookPathConflict(path) {
	if (path === "/healthz") return {
		kind: "health",
		message: "is reserved for webhook listener health checks"
	};
	const pathname = URL.parse(path, "http://localhost")?.pathname ?? path;
	const probe = classifyGatewayProbePath(pathname);
	if (probe === "live" || probe === "ready" || probe === "startup") return {
		kind: "probe",
		message: "is reserved for Gateway probes"
	};
	if (isProtectedPluginRoutePathFromContext(resolvePluginRoutePathContext(pathname))) return {
		kind: "auth",
		message: "requires Gateway authentication"
	};
}
//#endregion
export { resolveTelegramGatewayWebhookUrl as n, resolveTelegramWebhookPathConflict as r, DEFAULT_TELEGRAM_WEBHOOK_PATH as t };

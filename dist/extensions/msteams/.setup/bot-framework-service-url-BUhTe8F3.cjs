let openclaw_plugin_sdk_ssrf_policy = require("openclaw/plugin-sdk/ssrf-policy");
//#region extensions/msteams/src/bot-framework-service-url.ts
const BOT_FRAMEWORK_SERVICE_URL_HOST_ALLOWLIST = (0, openclaw_plugin_sdk_ssrf_policy.normalizeHostnameSuffixAllowlist)([
	"smba.trafficmanager.net",
	"smba.infra.gcc.teams.microsoft.com",
	"smba.infra.gov.teams.microsoft.us",
	"smba.infra.dod.teams.microsoft.us",
	"botframework.azure.cn"
]);
function describeBotFrameworkServiceUrlHost(serviceUrl) {
	try {
		return new URL(serviceUrl.trim()).hostname || "invalid-url";
	} catch {
		return "invalid-url";
	}
}
function isAllowedBotFrameworkServiceUrl(serviceUrl) {
	if (typeof serviceUrl !== "string") return false;
	const trimmed = serviceUrl.trim();
	return Boolean(trimmed && (0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(trimmed, BOT_FRAMEWORK_SERVICE_URL_HOST_ALLOWLIST));
}
function tryNormalizeBotFrameworkServiceUrl(serviceUrl) {
	if (!isAllowedBotFrameworkServiceUrl(serviceUrl)) return;
	return serviceUrl.trim().replace(/\/+$/, "");
}
function normalizeBotFrameworkServiceUrl(serviceUrl) {
	const normalized = tryNormalizeBotFrameworkServiceUrl(serviceUrl);
	if (normalized) return normalized;
	throw new Error(`Blocked Microsoft Teams serviceUrl host: ${describeBotFrameworkServiceUrlHost(serviceUrl)}`);
}
//#endregion
Object.defineProperty(exports, "describeBotFrameworkServiceUrlHost", {
	enumerable: true,
	get: function() {
		return describeBotFrameworkServiceUrlHost;
	}
});
Object.defineProperty(exports, "isAllowedBotFrameworkServiceUrl", {
	enumerable: true,
	get: function() {
		return isAllowedBotFrameworkServiceUrl;
	}
});
Object.defineProperty(exports, "normalizeBotFrameworkServiceUrl", {
	enumerable: true,
	get: function() {
		return normalizeBotFrameworkServiceUrl;
	}
});
Object.defineProperty(exports, "tryNormalizeBotFrameworkServiceUrl", {
	enumerable: true,
	get: function() {
		return tryNormalizeBotFrameworkServiceUrl;
	}
});

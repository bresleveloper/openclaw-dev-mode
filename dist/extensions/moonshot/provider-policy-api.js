import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Bi0KIJRp.mjs";
// extensions/moonshot/provider-policy-api.ts
const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
const MODELS = openclaw_plugin_default.modelCatalog.providers.moonshot.models;
const ALWAYS_THINKING_MODEL_IDS = new Set(MODELS.filter((row) => row.compat.thinkingRequired).map((row) => row.id));
const NATIVE_VIDEO_MODEL_IDS = new Set(MODELS.filter((row) => row.input.includes("video")).map((row) => row.id));
function isNativeMoonshotBaseUrl(baseUrl) {
	return [MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL].some((official) => baseUrl === official || baseUrl === `${official}/`);
}
function isMoonshotK3NativeVideoRoute(route) {
	return route.provider === "moonshot" && NATIVE_VIDEO_MODEL_IDS.has(route.modelId ?? "") && route.api === "openai-completions" && isNativeMoonshotBaseUrl(route.baseUrl);
}
function isMoonshotAlwaysThinkingModelId(modelId) {
	return ALWAYS_THINKING_MODEL_IDS.has(modelId.trim().toLowerCase());
}
function resolveThinkingProfile() {
	return {
		levels: [{
			id: "off",
			label: "off"
		}, {
			id: "low",
			label: "on"
		}],
		defaultLevel: "off"
	};
}
export { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, isMoonshotAlwaysThinkingModelId, isMoonshotK3NativeVideoRoute, isNativeMoonshotBaseUrl, resolveThinkingProfile };

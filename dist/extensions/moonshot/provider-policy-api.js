//#region extensions/moonshot/provider-policy-api.ts
const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
const KIMI_K2_7_CODE_MODEL_ID = "kimi-k2.7-code";
const KIMI_K2_7_CODE_HIGHSPEED_MODEL_ID = "kimi-k2.7-code-highspeed";
const KIMI_K3_MODEL_ID = "kimi-k3";
const ALWAYS_THINKING_PROFILES = {
	[KIMI_K3_MODEL_ID]: {
		id: "max",
		label: "max"
	},
	[KIMI_K2_7_CODE_MODEL_ID]: {
		id: "low",
		label: "on"
	},
	[KIMI_K2_7_CODE_HIGHSPEED_MODEL_ID]: {
		id: "low",
		label: "on"
	}
};
function isNativeMoonshotBaseUrl(baseUrl) {
	return [MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL].some((official) => baseUrl === official || baseUrl === `${official}/`);
}
function isMoonshotK3NativeVideoRoute(route) {
	return route.provider === "moonshot" && route.modelId === "kimi-k3" && route.api === "openai-completions" && isNativeMoonshotBaseUrl(route.baseUrl);
}
function isMoonshotAlwaysThinkingModelId(modelId) {
	return modelId.trim().toLowerCase() in ALWAYS_THINKING_PROFILES;
}
function resolveThinkingProfile(context) {
	const modelId = context.modelId.trim().toLowerCase();
	const profile = ALWAYS_THINKING_PROFILES[modelId];
	if (profile) return {
		levels: [profile],
		defaultLevel: profile.id,
		preserveWhenCatalogReasoningFalse: true
	};
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
//#endregion
export { KIMI_K2_7_CODE_HIGHSPEED_MODEL_ID, KIMI_K2_7_CODE_MODEL_ID, KIMI_K3_MODEL_ID, MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, isMoonshotAlwaysThinkingModelId, isMoonshotK3NativeVideoRoute, isNativeMoonshotBaseUrl, resolveThinkingProfile };

//#region extensions/moonshot/provider-policy-api.ts
const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
const KIMI_K2_7_CODE_MODEL_ID = "kimi-k2.7-code";
const KIMI_K2_7_CODE_HIGHSPEED_MODEL_ID = "kimi-k2.7-code-highspeed";
const KIMI_K3_MODEL_IDS = [
	"kimi-k3",
	"kimi-k3.1-pro",
	"kimi-k3.1-pro-highspeed"
];
const ALWAYS_THINKING_PROFILES = {
	...Object.fromEntries(KIMI_K3_MODEL_IDS.map((id) => [id, {
		id: "max",
		label: "max"
	}])),
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
	return route.provider === "moonshot" && KIMI_K3_MODEL_IDS.includes(route.modelId ?? "") && route.api === "openai-completions" && isNativeMoonshotBaseUrl(route.baseUrl);
}
function isMoonshotAlwaysThinkingModelId(modelId) {
	return Object.hasOwn(ALWAYS_THINKING_PROFILES, modelId.trim().toLowerCase());
}
function resolveThinkingProfile(context) {
	const modelId = context.modelId.trim().toLowerCase();
	const profile = Object.hasOwn(ALWAYS_THINKING_PROFILES, modelId) ? ALWAYS_THINKING_PROFILES[modelId] : void 0;
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
export { KIMI_K2_7_CODE_HIGHSPEED_MODEL_ID, KIMI_K2_7_CODE_MODEL_ID, MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, isMoonshotAlwaysThinkingModelId, isMoonshotK3NativeVideoRoute, isNativeMoonshotBaseUrl, resolveThinkingProfile };

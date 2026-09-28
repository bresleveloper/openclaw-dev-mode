import { a as STEPFUN_PLAN_PROVIDER_ID, c as STEPFUN_STANDARD_INTL_BASE_URL, i as STEPFUN_PLAN_INTL_BASE_URL, l as buildStepFunPlanProvider, n as STEPFUN_PLAN_CN_BASE_URL, o as STEPFUN_PROVIDER_ID, r as STEPFUN_PLAN_DEFAULT_MODEL_REF, s as STEPFUN_STANDARD_CN_BASE_URL, t as STEPFUN_DEFAULT_MODEL_REF, u as buildStepFunProvider } from "./.setup/provider-catalog-BXohNkBo.mjs";
import { applyStepFunPlanConfig, applyStepFunPlanConfigCn, applyStepFunStandardConfig, applyStepFunStandardConfigCn } from "./onboard.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildOpenAICompatibleLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/stepfun/index.ts
const STEPFUN_SURFACES = {
	standard: {
		providerId: STEPFUN_PROVIDER_ID,
		label: "StepFun",
		authLabel: "StepFun Standard",
		defaultModel: STEPFUN_DEFAULT_MODEL_REF,
		baseUrls: {
			cn: STEPFUN_STANDARD_CN_BASE_URL,
			intl: STEPFUN_STANDARD_INTL_BASE_URL
		},
		buildProvider: buildStepFunProvider,
		applyConfig: {
			cn: applyStepFunStandardConfigCn,
			intl: applyStepFunStandardConfig
		}
	},
	plan: {
		providerId: STEPFUN_PLAN_PROVIDER_ID,
		label: "StepFun Step Plan",
		authLabel: "StepFun Step Plan",
		defaultModel: STEPFUN_PLAN_DEFAULT_MODEL_REF,
		baseUrls: {
			cn: STEPFUN_PLAN_CN_BASE_URL,
			intl: STEPFUN_PLAN_INTL_BASE_URL
		},
		buildProvider: buildStepFunPlanProvider,
		applyConfig: {
			cn: applyStepFunPlanConfigCn,
			intl: applyStepFunPlanConfig
		}
	}
};
function trimExplicitBaseUrl(ctx, providerId) {
	const explicitProvider = ctx.config.models?.providers?.[providerId];
	return (typeof explicitProvider?.baseUrl === "string" ? explicitProvider.baseUrl.trim() : "") || void 0;
}
function inferRegionFromBaseUrl(baseUrl) {
	if (!baseUrl) return;
	try {
		const host = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname);
		if (host === "api.stepfun.com") return "cn";
		if (host === "api.stepfun.ai") return "intl";
	} catch {
		return;
	}
}
function inferRegionFromProfileId(profileId) {
	if (!profileId) return;
	if (profileId.includes(":cn")) return "cn";
	if (profileId.includes(":intl")) return "intl";
}
function inferRegionFromEnv(env) {
	if (env.STEPFUN_API_KEY?.trim()) return "intl";
}
function inferRegionFromExplicitBaseUrls(ctx) {
	return inferRegionFromBaseUrl(trimExplicitBaseUrl(ctx, "stepfun")) ?? inferRegionFromBaseUrl(trimExplicitBaseUrl(ctx, "stepfun-plan"));
}
async function resolveStepFunCatalog(ctx, params) {
	const profileAuth = ctx.resolveProviderAuth(params.providerId);
	const auth = profileAuth.apiKey ? profileAuth : ctx.resolveProviderApiKey(params.providerId);
	const apiKey = auth.apiKey;
	if (!apiKey) return null;
	const explicitBaseUrl = trimExplicitBaseUrl(ctx, params.providerId);
	const region = inferRegionFromBaseUrl(explicitBaseUrl) ?? inferRegionFromExplicitBaseUrls(ctx) ?? inferRegionFromProfileId(auth.profileId) ?? inferRegionFromEnv(ctx.env);
	const provider = STEPFUN_SURFACES[params.surface];
	const baseUrl = explicitBaseUrl ?? provider.baseUrls[region ?? "intl"];
	const providerConfig = provider.buildProvider(baseUrl);
	return await buildOpenAICompatibleLiveProviderCatalog({
		discoveryMode: "strict",
		providerId: params.providerId,
		providerConfig,
		apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		profileId: auth.profileId
	});
}
function resolveProfileIds(region) {
	return region === "cn" ? ["stepfun:cn", "stepfun-plan:cn"] : ["stepfun:intl", "stepfun-plan:intl"];
}
function createStepFunApiKeyMethod(surface, region) {
	const provider = STEPFUN_SURFACES[surface];
	const methodId = `${surface}-api-key-${region}`;
	const label = `${provider.authLabel} API key (${region === "cn" ? "China" : "Global/Intl"})`;
	const hint = `Endpoint: ${provider.baseUrls[region].replace(/^https:\/\//u, "")}`;
	return createProviderApiKeyAuthMethod({
		providerId: provider.providerId,
		methodId,
		label,
		hint,
		optionKey: "stepfunApiKey",
		flagName: "--stepfun-api-key",
		envVar: "STEPFUN_API_KEY",
		promptMessage: `Enter StepFun API key for ${region === "cn" ? "China" : "global"} endpoints`,
		profileIds: resolveProfileIds(region),
		allowProfile: false,
		defaultModel: provider.defaultModel,
		preserveExistingPrimary: true,
		expectedProviders: [STEPFUN_PROVIDER_ID, STEPFUN_PLAN_PROVIDER_ID],
		applyConfig: provider.applyConfig[region],
		wizard: {
			choiceId: `stepfun-${methodId}`,
			choiceLabel: label,
			choiceHint: hint,
			groupId: "stepfun",
			groupLabel: "StepFun",
			groupHint: "Standard / Step Plan (China / Global)"
		}
	});
}
var stepfun_default = definePluginEntry({
	id: STEPFUN_PROVIDER_ID,
	name: "StepFun",
	description: "Bundled StepFun standard and Step Plan provider plugin",
	register(api) {
		for (const surface of ["standard", "plan"]) {
			const provider = STEPFUN_SURFACES[surface];
			api.registerProvider({
				id: provider.providerId,
				label: provider.label,
				docsPath: "/providers/stepfun",
				envVars: ["STEPFUN_API_KEY"],
				auth: ["cn", "intl"].map((region) => createStepFunApiKeyMethod(surface, region)),
				catalog: {
					order: "paired",
					run: async (ctx) => resolveStepFunCatalog(ctx, {
						providerId: provider.providerId,
						surface
					})
				},
				staticCatalog: {
					order: "paired",
					run: async () => ({ provider: provider.buildProvider() })
				}
			});
		}
	}
});
//#endregion
export { stepfun_default as default };

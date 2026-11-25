import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildOpenAICompatibleLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/stepfun/openclaw.plugin.json
var modelCatalog = {
	"aliases": {
		"stepfun-ai": {
			"provider": "stepfun",
			"api": "openai-completions"
		},
		"stepfun-ai-step-plan": {
			"provider": "stepfun-plan",
			"api": "openai-completions"
		}
	},
	"modelsDev": {
		"stepfun": "stepfun-ai",
		"stepfun-plan": "stepfun-ai-step-plan"
	},
	"providers": {
		"stepfun": {
			"baseUrl": "https://api.stepfun.ai/v1",
			"api": "openai-completions",
			"family": "stepfun",
			"models": [{
				"id": "step-3.7-flash",
				"name": "Step 3.7 Flash",
				"reasoning": true,
				"input": ["text", "image"],
				"thinkingLevelMap": {
					"off": "low",
					"minimal": "low",
					"xhigh": "high",
					"max": "high"
				},
				"contextWindow": 262144,
				"maxTokens": 262144,
				"cost": {
					"input": .2,
					"output": 1.15,
					"cacheRead": .04,
					"cacheWrite": 0
				},
				"compat": {
					"supportsStore": false,
					"supportsDeveloperRole": false,
					"supportsUsageInStreaming": false,
					"supportsReasoningEffort": true,
					"supportsStrictMode": false,
					"supportedReasoningEfforts": [
						"low",
						"medium",
						"high"
					],
					"maxTokensField": "max_tokens",
					"reasoningEffortMap": {
						"off": "low",
						"none": "low",
						"minimal": "low",
						"low": "low",
						"medium": "medium",
						"high": "high",
						"xhigh": "high",
						"adaptive": "high",
						"max": "high"
					}
				}
			}, {
				"id": "step-3.5-flash",
				"name": "Step 3.5 Flash",
				"reasoning": true,
				"input": ["text"],
				"contextWindow": 262144,
				"maxTokens": 65536,
				"cost": {
					"input": .1,
					"output": .3,
					"cacheRead": .02,
					"cacheWrite": 0
				}
			}]
		},
		"stepfun-plan": {
			"baseUrl": "https://api.stepfun.ai/step_plan/v1",
			"api": "openai-completions",
			"family": "stepfun",
			"models": [
				{
					"id": "step-3.7-flash",
					"name": "Step 3.7 Flash",
					"reasoning": true,
					"input": ["text", "image"],
					"thinkingLevelMap": {
						"off": "low",
						"minimal": "low",
						"xhigh": "high",
						"max": "high"
					},
					"contextWindow": 262144,
					"maxTokens": 262144,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					},
					"compat": {
						"supportsStore": false,
						"supportsDeveloperRole": false,
						"supportsUsageInStreaming": false,
						"supportsReasoningEffort": true,
						"supportsStrictMode": false,
						"supportedReasoningEfforts": [
							"low",
							"medium",
							"high"
						],
						"maxTokensField": "max_tokens",
						"reasoningEffortMap": {
							"off": "low",
							"none": "low",
							"minimal": "low",
							"low": "low",
							"medium": "medium",
							"high": "high",
							"xhigh": "high",
							"adaptive": "high",
							"max": "high"
						}
					}
				},
				{
					"id": "step-3.5-flash",
					"name": "Step 3.5 Flash",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 262144,
					"maxTokens": 65536,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				},
				{
					"id": "step-3.5-flash-2603",
					"name": "Step 3.5 Flash 2603",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 262144,
					"maxTokens": 65536,
					"cost": {
						"input": 0,
						"output": 0,
						"cacheRead": 0,
						"cacheWrite": 0
					}
				}
			]
		}
	},
	"discovery": {
		"stepfun": "refreshable",
		"stepfun-plan": "refreshable"
	}
};
// extensions/stepfun/index.ts
const STEPFUN_PROVIDER_ID = "stepfun";
const STEPFUN_PLAN_PROVIDER_ID = "stepfun-plan";
const STEPFUN_STANDARD_CN_BASE_URL = "https://api.stepfun.com/v1";
const STEPFUN_STANDARD_INTL_BASE_URL = "https://api.stepfun.ai/v1";
const STEPFUN_PLAN_CN_BASE_URL = "https://api.stepfun.com/step_plan/v1";
const STEPFUN_PLAN_INTL_BASE_URL = "https://api.stepfun.ai/step_plan/v1";
const STEPFUN_DEFAULT_MODEL_ID = "step-3.5-flash";
const STEPFUN_DEFAULT_MODEL_REF = `${STEPFUN_PROVIDER_ID}/${STEPFUN_DEFAULT_MODEL_ID}`;
const STEPFUN_PLAN_DEFAULT_MODEL_REF = `${STEPFUN_PLAN_PROVIDER_ID}/${STEPFUN_DEFAULT_MODEL_ID}`;
function buildStepFunManifestProvider(providerId, baseUrl) {
	const provider = buildManifestModelProviderConfig({
		providerId,
		catalog: modelCatalog.providers[providerId]
	});
	return provider.baseUrl === baseUrl ? provider : {
		...provider,
		baseUrl
	};
}
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
		buildProvider: (baseUrl = STEPFUN_STANDARD_INTL_BASE_URL) => buildStepFunManifestProvider(STEPFUN_PROVIDER_ID, baseUrl),
		modelAlias: "StepFun"
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
		buildProvider: (baseUrl = STEPFUN_PLAN_INTL_BASE_URL) => buildStepFunManifestProvider(STEPFUN_PLAN_PROVIDER_ID, baseUrl),
		modelAlias: "StepFun Plan"
	}
};
function trimExplicitBaseUrl(ctx, providerId) {
	return normalizeOptionalString(ctx.config.models?.providers?.[providerId]?.baseUrl);
}
function inferRegionFromBaseUrl(baseUrl) {
	if (!baseUrl) return;
	const host = normalizeLowercaseStringOrEmpty(URL.parse(baseUrl)?.hostname);
	if (host === "api.stepfun.com") return "cn";
	if (host === "api.stepfun.ai") return "intl";
}
function inferRegionFromProfileId(profileId) {
	if (!profileId) return;
	if (profileId.includes(":cn")) return "cn";
	if (profileId.includes(":intl")) return "intl";
}
var stepfun_default = definePluginEntry({
	id: STEPFUN_PROVIDER_ID,
	name: "StepFun",
	description: "Bundled StepFun standard and Step Plan provider plugin",
	register(api) {
		for (const surface of ["standard", "plan"]) {
			const provider = STEPFUN_SURFACES[surface];
			const presetAppliers = createProviderConnectionPresetAppliers({
				primaryModelRef: provider.defaultModel,
				resolveParams: (_cfg, baseUrl) => {
					const catalog = provider.buildProvider(baseUrl);
					return {
						providerId: provider.providerId,
						api: catalog.api ?? "openai-completions",
						baseUrl,
						catalogModels: catalog.models,
						aliases: [...catalog.models.map((model) => `${provider.providerId}/${model.id}`), {
							modelRef: provider.defaultModel,
							alias: provider.modelAlias
						}]
					};
				}
			});
			api.registerProvider({
				id: provider.providerId,
				label: provider.label,
				docsPath: "/providers/stepfun",
				envVars: ["STEPFUN_API_KEY"],
				auth: ["cn", "intl"].map((region) => {
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
						profileIds: [`stepfun:${region}`, `stepfun-plan:${region}`],
						allowProfile: false,
						defaultModel: provider.defaultModel,
						preserveExistingPrimary: true,
						expectedProviders: [STEPFUN_PROVIDER_ID, STEPFUN_PLAN_PROVIDER_ID],
						applyConfig: (cfg) => presetAppliers.applyConfig(cfg, provider.baseUrls[region]),
						wizard: {
							choiceId: `stepfun-${methodId}`,
							choiceLabel: label,
							choiceHint: hint,
							groupId: "stepfun",
							groupLabel: "StepFun",
							groupHint: "Standard / Step Plan (China / Global)"
						}
					});
				}),
				catalog: {
					order: "paired",
					run: async (ctx) => {
						const profileAuth = ctx.resolveProviderAuth(provider.providerId);
						const auth = profileAuth.apiKey ? profileAuth : ctx.resolveProviderApiKey(provider.providerId);
						const apiKey = auth.apiKey;
						if (!apiKey) return null;
						const explicitBaseUrl = trimExplicitBaseUrl(ctx, provider.providerId);
						const region = inferRegionFromBaseUrl(explicitBaseUrl) ?? inferRegionFromBaseUrl(trimExplicitBaseUrl(ctx, STEPFUN_PROVIDER_ID)) ?? inferRegionFromBaseUrl(trimExplicitBaseUrl(ctx, STEPFUN_PLAN_PROVIDER_ID)) ?? inferRegionFromProfileId(auth.profileId);
						const baseUrl = explicitBaseUrl ?? provider.baseUrls[region ?? "intl"];
						const providerConfig = provider.buildProvider(baseUrl);
						return await buildOpenAICompatibleLiveProviderCatalog({
							discoveryMode: "strict",
							providerId: provider.providerId,
							providerConfig,
							apiKey,
							discoveryApiKey: auth.discoveryApiKey,
							profileId: auth.profileId
						});
					}
				},
				staticCatalog: {
					order: "paired",
					run: async () => ({ provider: provider.buildProvider() })
				}
			});
		}
	}
});
export { stepfun_default as default };

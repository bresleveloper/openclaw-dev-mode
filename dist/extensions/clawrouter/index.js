import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-DUNuGxOQ.mjs";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-Wjr777L1.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-BDV45rRZ.mjs";
import { a as normalizeClawRouterResolvedModel, i as normalizeClawRouterReasoningEfforts, n as buildClawRouterProviderConfig, o as normalizeClawRouterRootUrl, r as normalizeClawRouterApiBaseUrl, t as CLAWROUTER_REASONING_EFFORT_LEVELS } from "../../provider-catalog-C5yAXEtH.mjs";
import { t as wrapClawRouterProviderStream } from "../../stream-QnL5CG3D.mjs";
import { n as normalizePerplexityToolSchemas, t as inspectPerplexityToolSchemas } from "../../tool-schemas-CA2xz42p.mjs";
import { t as fetchClawRouterUsage } from "../../usage-BkkzNyyr.mjs";
//#region extensions/clawrouter/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "clawrouter",
	categories: ["models"],
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["clawrouter"],
	contracts: { "usageProviders": ["clawrouter"] },
	setup: { "providers": [{
		"id": "clawrouter",
		"envVars": ["CLAWROUTER_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "clawrouter",
		"method": "api-key",
		"choiceId": "clawrouter-api-key",
		"choiceLabel": "ClawRouter proxy key",
		"choiceHint": "Approved models through one managed key",
		"groupId": "clawrouter",
		"groupLabel": "ClawRouter",
		"groupHint": "Managed model access and quotas",
		"optionKey": "clawrouterApiKey",
		"cliFlag": "--clawrouter-api-key",
		"cliOption": "--clawrouter-api-key <key>",
		"cliDescription": "ClawRouter proxy key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/clawrouter/index.ts
const PROVIDER_ID = "clawrouter";
const ENV_VAR = "CLAWROUTER_API_KEY";
const openAiReplay = buildProviderReplayFamilyHooks({
	family: "openai-compatible",
	dropReasoningFromHistory: false
});
const anthropicReplay = buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" });
const googleReplay = buildProviderReplayFamilyHooks({ family: "google-gemini" });
const openAiTools = buildProviderToolCompatFamilyHooks("openai");
const deepSeekTools = buildProviderToolCompatFamilyHooks("deepseek");
const geminiTools = buildProviderToolCompatFamilyHooks("gemini");
const perplexityTools = {
	normalizeToolSchemas: normalizePerplexityToolSchemas,
	inspectToolSchemas: inspectPerplexityToolSchemas
};
function resolveClawRouterThinkingProfile(ctx) {
	const efforts = normalizeClawRouterReasoningEfforts(ctx.compat?.supportedReasoningEfforts);
	if (!efforts) return;
	const supported = new Set(efforts);
	const levels = CLAWROUTER_REASONING_EFFORT_LEVELS.filter(([effort]) => supported.has(effort)).map(([, id]) => ({ id }));
	const runtime = ctx.agentRuntime?.trim().toLowerCase();
	if (levels.some((level) => level.id === "max") && (runtime === "openclaw" || runtime === "auto")) levels.push({ id: "ultra" });
	return { levels };
}
function configuredBaseUrl(config) {
	const value = config?.models?.providers?.[PROVIDER_ID]?.baseUrl;
	return typeof value === "string" ? value : void 0;
}
function dynamicModelScope(ctx) {
	return JSON.stringify([
		ctx.agentDir ?? "",
		ctx.workspaceDir ?? "",
		ctx.authProfileId ?? "",
		normalizeClawRouterRootUrl(ctx.providerConfig?.baseUrl ?? configuredBaseUrl(ctx.config))
	]);
}
function buildRuntimeModels(providerConfig) {
	const models = /* @__PURE__ */ new Map();
	for (const model of providerConfig.models) {
		const api = model.api ?? providerConfig.api;
		const baseUrl = model.baseUrl ?? providerConfig.baseUrl;
		if (!api || !baseUrl) continue;
		models.set(model.id, {
			...model,
			api,
			baseUrl,
			provider: PROVIDER_ID,
			input: model.input.filter((entry) => entry === "text" || entry === "image")
		});
	}
	return models;
}
function resolveToolFamily(modelId) {
	const normalized = modelId.toLowerCase();
	if (normalized.startsWith("deepseek/")) return deepSeekTools;
	if (normalized.startsWith("google/")) return geminiTools;
	if (normalized.startsWith("perplexity/")) return perplexityTools;
	return openAiTools;
}
var clawrouter_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "ClawRouter",
	description: "Managed multi-provider model routing and quotas",
	manifest: openclaw_plugin_default,
	provider() {
		const dynamicModels = /* @__PURE__ */ new Map();
		return {
			label: "ClawRouter",
			docsPath: "/providers/clawrouter",
			manifestAuth: {
				hint: "Credential-scoped access to approved models and budgets",
				noteTitle: "ClawRouter",
				noteMessage: ["Use the proxy key issued by your ClawRouter administrator.", "OpenClaw discovers only the models granted to that key."].join("\n")
			},
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const auth = ctx.resolveProviderAuth(PROVIDER_ID);
					let discoveryApiKey = auth.discoveryApiKey;
					if (!discoveryApiKey) try {
						const { resolveApiKeyForProvider } = await import("../../plugin-sdk/provider-auth-runtime.js");
						discoveryApiKey = (await resolveApiKeyForProvider({
							provider: PROVIDER_ID,
							cfg: ctx.config,
							...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
							...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
							...auth.profileId ? {
								profileId: auth.profileId,
								lockedProfile: true
							} : {}
						}))?.apiKey;
					} catch {
						return null;
					}
					const apiKey = auth.apiKey ?? discoveryApiKey;
					if (!apiKey || !discoveryApiKey) return null;
					return { provider: await buildClawRouterProviderConfig({
						apiKey,
						discoveryApiKey,
						baseUrl: configuredBaseUrl(ctx.config)
					}) };
				}
			},
			resolveDynamicModel: (ctx) => dynamicModels.get(dynamicModelScope(ctx))?.get(ctx.modelId),
			preferRuntimeResolvedModel: (ctx) => {
				const agentDir = ctx.agentDir ?? "";
				const workspaceDir = ctx.workspaceDir ?? "";
				const rootUrl = normalizeClawRouterRootUrl(configuredBaseUrl(ctx.config));
				for (const [scope, models] of dynamicModels) {
					const [scopeAgentDir, scopeWorkspaceDir, , scopeRootUrl] = JSON.parse(scope);
					if (scopeAgentDir === agentDir && scopeWorkspaceDir === workspaceDir && scopeRootUrl === rootUrl && models.has(ctx.modelId)) return true;
				}
				return false;
			},
			prepareDynamicModel: async (ctx) => {
				const scope = dynamicModelScope(ctx);
				const { resolveApiKeyForProvider } = await import("../../plugin-sdk/provider-auth-runtime.js");
				const apiKey = (await resolveApiKeyForProvider({
					provider: PROVIDER_ID,
					cfg: ctx.config,
					...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
					...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
					...ctx.authProfileId ? {
						profileId: ctx.authProfileId,
						lockedProfile: true
					} : {}
				}))?.apiKey;
				if (!apiKey) {
					dynamicModels.delete(scope);
					return;
				}
				const providerConfig = await buildClawRouterProviderConfig({
					apiKey,
					discoveryApiKey: apiKey,
					baseUrl: ctx.providerConfig?.baseUrl ?? configuredBaseUrl(ctx.config)
				});
				dynamicModels.set(scope, buildRuntimeModels(providerConfig));
			},
			normalizeConfig: ({ providerConfig }) => {
				const baseUrl = normalizeClawRouterApiBaseUrl(providerConfig.baseUrl);
				return baseUrl !== providerConfig.baseUrl ? {
					...providerConfig,
					baseUrl
				} : void 0;
			},
			normalizeResolvedModel: ({ model }) => normalizeClawRouterResolvedModel(model),
			wrapSimpleCompletionStreamFn: wrapClawRouterProviderStream,
			wrapStreamFn: wrapClawRouterProviderStream,
			buildReplayPolicy: (ctx) => {
				if (ctx.modelApi === "anthropic-messages") return anthropicReplay.buildReplayPolicy?.(ctx);
				if (ctx.modelApi === "google-generative-ai") return googleReplay.buildReplayPolicy?.(ctx);
				return openAiReplay.buildReplayPolicy?.(ctx);
			},
			sanitizeReplayHistory: (ctx) => ctx.modelApi === "google-generative-ai" ? googleReplay.sanitizeReplayHistory?.(ctx) : void 0,
			resolveReasoningOutputMode: (ctx) => ctx.modelApi === "google-generative-ai" ? googleReplay.resolveReasoningOutputMode?.(ctx) : void 0,
			resolveThinkingProfile: resolveClawRouterThinkingProfile,
			normalizeToolSchemas: (ctx) => resolveToolFamily(ctx.modelId ?? "").normalizeToolSchemas(ctx),
			inspectToolSchemas: (ctx) => resolveToolFamily(ctx.modelId ?? "").inspectToolSchemas(ctx),
			isModernModelRef: () => true,
			resolveUsageAuth: async (ctx) => {
				const apiKey = ctx.resolveApiKeyFromConfigAndStore({ envDirect: [ctx.env[ENV_VAR]] });
				return apiKey ? { token: apiKey } : null;
			},
			fetchUsageSnapshot: async (ctx) => await fetchClawRouterUsage({
				token: ctx.token,
				baseUrl: configuredBaseUrl(ctx.config),
				timeoutMs: ctx.timeoutMs,
				signal: ctx.signal
			})
		};
	}
});
//#endregion
export { clawrouter_default as default };

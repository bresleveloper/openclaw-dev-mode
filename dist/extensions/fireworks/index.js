import { isFireworksKimiModelId } from "./model-id.js";
import { c as isFireworksCatalogModelId, i as FIREWORKS_DEFAULT_MODEL_ID, l as openclaw_plugin_default, n as FIREWORKS_DEFAULT_CONTEXT_WINDOW, r as FIREWORKS_DEFAULT_MAX_TOKENS, t as FIREWORKS_BASE_URL } from "./.setup/provider-catalog-V11bjNKP.mjs";
import { applyFireworksConfig } from "./onboard.js";
import { wrapFireworksProviderStream } from "./stream.js";
import { resolveFireworksThinkingProfile } from "./thinking-policy.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks, resolveFamilyForwardCompatModel } from "openclaw/plugin-sdk/provider-model-shared";
//#region extensions/fireworks/index.ts
const PROVIDER_ID = "fireworks";
function isFireworksGlmModelId(modelId) {
	const normalized = modelId.trim().toLowerCase();
	const lastSegment = normalized.split("/").pop() ?? normalized;
	return /^glm[-_.]/.test(lastSegment);
}
function resolveFireworksDynamicInput(modelId) {
	return isFireworksGlmModelId(modelId) ? ["text"] : ["text", "image"];
}
function resolveFireworksDynamicModel(ctx) {
	const modelId = ctx.modelId.trim();
	if (!modelId) return;
	if (isFireworksCatalogModelId(modelId)) return;
	const isKimiModel = isFireworksKimiModelId(modelId);
	const input = resolveFireworksDynamicInput(modelId);
	return resolveFamilyForwardCompatModel({
		providerId: PROVIDER_ID,
		modelId,
		ctx,
		cases: [{
			match: () => true,
			templateIds: [FIREWORKS_DEFAULT_MODEL_ID],
			patch: ({ template }) => template ? void 0 : {
				api: "openai-completions",
				baseUrl: FIREWORKS_BASE_URL,
				contextWindow: FIREWORKS_DEFAULT_CONTEXT_WINDOW,
				maxTokens: FIREWORKS_DEFAULT_MAX_TOKENS
			}
		}],
		patch: {
			provider: PROVIDER_ID,
			reasoning: !isKimiModel,
			input
		},
		synthesize: true
	});
}
var fireworks_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Fireworks Provider",
	description: "Bundled Fireworks AI provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Fireworks",
		aliases: ["fireworks-ai"],
		docsPath: "/providers/fireworks",
		manifestAuth: { applyConfig: applyFireworksConfig },
		catalog: {
			discoveryMode: "strict",
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		wrapStreamFn: wrapFireworksProviderStream,
		resolveThinkingProfile: ({ modelId }) => resolveFireworksThinkingProfile(modelId),
		resolveDynamicModel: (ctx) => resolveFireworksDynamicModel(ctx),
		isModernModelRef: () => true
	}
});
//#endregion
export { fireworks_default as default };

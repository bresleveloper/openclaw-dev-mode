import { C as supportsClaudeNativeMaxEffort } from "./anthropic-D-i5CCnY.mjs";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-vHRl78JV.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-DYE6_4KQ.mjs";
import "./provider-model-shared-BZZnLgoM.mjs";
import "./provider-auth-C3BBF7yn.mjs";
import { n as buildProviderStreamFamilyHooks } from "./provider-stream-CPGCn_Ra.mjs";
import "./provider-stream-family-B6dW08sH.mjs";
import { C as resolveFoundryTargetProfileId, S as resolveFoundryModelCapabilities, d as extractFoundryEndpoint, g as normalizeFoundryEndpoint, l as buildFoundryModelConfig, m as isFoundryProviderApi, o as PROVIDER_ID, u as buildFoundryProviderBaseUrl } from "./shared-YyPGXXW5.mjs";
import { t as prepareFoundryRuntimeAuth } from "./runtime-BW223LEQ.mjs";
import { n as entraIdAuthMethod, t as apiKeyAuthMethod } from "./auth-Cw9FFhUs.mjs";
//#region extensions/microsoft-foundry/provider.ts
const { wrapStreamFn: wrapOpenAIResponsesStreamFn } = buildProviderStreamFamilyHooks("openai-responses-defaults");
const wrapMicrosoftFoundryStreamFn = (ctx) => {
	if (ctx.model?.api !== "openai-responses") return ctx.streamFn ?? null;
	const baseStreamFn = ctx.streamFn;
	if (!baseStreamFn) return wrapOpenAIResponsesStreamFn?.(ctx) ?? null;
	const streamFnWithResponsesReplayIds = (model, context, options) => baseStreamFn(model, context, {
		...options,
		replayResponsesItemIds: true
	});
	return wrapOpenAIResponsesStreamFn?.({
		...ctx,
		streamFn: streamFnWithResponsesReplayIds
	}) ?? streamFnWithResponsesReplayIds;
};
function normalizeFoundryModel(model, endpoint, modelId, capabilities, preserveExplicitReasoningEffort) {
	const explicitSupportsReasoningEffort = typeof model.compat?.supportsReasoningEffort === "boolean" ? model.compat.supportsReasoningEffort : void 0;
	const explicitMaxTokensField = typeof model.compat?.maxTokensField === "string" ? model.compat.maxTokensField : preserveExplicitReasoningEffort ? "max_completion_tokens" : void 0;
	return {
		...model,
		name: capabilities.modelName,
		api: capabilities.api,
		baseUrl: buildFoundryProviderBaseUrl(endpoint, modelId, capabilities.modelName, capabilities.api),
		reasoning: capabilities.reasoning || model.reasoning,
		thinkingLevelMap: capabilities.thinkingLevelMap ?? model.thinkingLevelMap,
		params: {
			...model.params,
			canonicalModelId: capabilities.modelName
		},
		input: capabilities.input,
		...capabilities.compat ? { compat: {
			...model.compat,
			...capabilities.compat,
			...explicitSupportsReasoningEffort !== void 0 ? { supportsReasoningEffort: explicitSupportsReasoningEffort } : preserveExplicitReasoningEffort ? { supportsReasoningEffort: true } : void 0,
			...explicitMaxTokensField ? { maxTokensField: explicitMaxTokensField } : {}
		} } : {}
	};
}
function buildMicrosoftFoundryProvider() {
	return {
		id: PROVIDER_ID,
		label: "Microsoft Foundry",
		docsPath: "/providers/models",
		envVars: ["AZURE_OPENAI_API_KEY", "AZURE_OPENAI_ENDPOINT"],
		auth: [entraIdAuthMethod, apiKeyAuthMethod],
		onModelSelected: async (ctx) => {
			const providers = ctx.config.models?.providers;
			const providerConfig = providers?.[PROVIDER_ID];
			if (!providers || !providerConfig || !providerConfig.baseUrl?.trim() || !Array.isArray(providerConfig.models) || !ctx.model.startsWith(`microsoft-foundry/`)) return;
			const selectedModelId = ctx.model.slice(`${PROVIDER_ID}/`.length);
			const configuredModels = providerConfig.models;
			const existingModel = configuredModels.find((model) => model.id === selectedModelId);
			const existingModelApi = isFoundryProviderApi(existingModel?.api) ? existingModel.api : void 0;
			const providerApiForExistingModel = existingModel && isFoundryProviderApi(providerConfig.api) ? providerConfig.api : void 0;
			const selectedModelCapabilities = resolveFoundryModelCapabilities(selectedModelId, existingModel?.name, existingModelApi ?? providerApiForExistingModel, existingModel?.input);
			const providerEndpoint = normalizeFoundryEndpoint(providerConfig.baseUrl);
			const selectedProviderEndpoint = extractFoundryEndpoint(existingModel?.baseUrl) ?? providerEndpoint;
			const nextModels = configuredModels.map((model) => {
				if (model.id !== selectedModelId) return model;
				return normalizeFoundryModel(model, extractFoundryEndpoint(model.baseUrl) ?? providerEndpoint, selectedModelId, selectedModelCapabilities, !selectedModelCapabilities.reasoning && model.reasoning && model.compat?.supportsReasoningEffort !== false);
			});
			if (!nextModels.some((model) => model.id === selectedModelId)) nextModels.push(buildFoundryModelConfig(providerEndpoint, selectedModelId, selectedModelCapabilities));
			const nextProviderConfig = {
				...providerConfig,
				baseUrl: buildFoundryProviderBaseUrl(selectedProviderEndpoint, selectedModelId, selectedModelCapabilities.modelName, selectedModelCapabilities.api),
				api: selectedModelCapabilities.api,
				models: nextModels
			};
			const targetProfileId = resolveFoundryTargetProfileId(ctx.config);
			if (targetProfileId) ctx.config.auth = applyAuthProfileConfig(ctx.config, {
				profileId: targetProfileId,
				provider: PROVIDER_ID,
				mode: "api_key"
			}).auth;
			providers[PROVIDER_ID] = nextProviderConfig;
		},
		resolveThinkingProfile: ({ modelId, params }) => {
			const modelName = typeof params?.canonicalModelId === "string" ? params.canonicalModelId : void 0;
			const capabilities = resolveFoundryModelCapabilities(modelId, modelName);
			if (!capabilities.reasoning || capabilities.api !== "anthropic-messages") return;
			return resolveClaudeThinkingProfile(capabilities.modelName, void 0, { includeNativeMax: supportsClaudeNativeMaxEffort({ id: capabilities.modelName }) });
		},
		normalizeResolvedModel: ({ modelId, model }) => {
			const endpoint = extractFoundryEndpoint(model.baseUrl ?? "");
			if (!endpoint) return model;
			const capabilities = resolveFoundryModelCapabilities(modelId, model.name, isFoundryProviderApi(model.api) ? model.api : void 0, model.input);
			return normalizeFoundryModel(model, endpoint, modelId, capabilities, !capabilities.reasoning && model.reasoning);
		},
		wrapStreamFn: wrapMicrosoftFoundryStreamFn,
		prepareRuntimeAuth: prepareFoundryRuntimeAuth
	};
}
//#endregion
export { buildMicrosoftFoundryProvider as t };

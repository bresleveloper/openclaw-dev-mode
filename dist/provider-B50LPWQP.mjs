import { v as supportsClaudeNativeMaxEffort } from "./anthropic-Cy4mTngV.mjs";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-E0IsJDi6.mjs";
import "./provider-model-shared-DUNuGxOQ.mjs";
import { c as buildProviderStreamFamilyHooks } from "./provider-stream-BqU4Fzur.mjs";
import "./provider-stream-family-C-4EZwwP.mjs";
import { T as resolveFoundryTargetProfileId, _ as mergeFoundryCanonicalModelParams, c as applyFoundryProfileBinding, d as buildFoundryProviderBaseUrl, f as extractFoundryEndpoint, h as isFoundryProviderApi, l as applyFoundryProviderConfig, o as PROVIDER_ID, v as normalizeFoundryEndpoint, w as resolveFoundryModelCapabilities } from "./shared-DU2ZpUlv.mjs";
import { t as prepareFoundryRuntimeAuth } from "./runtime-CfveHD70.mjs";
import { n as entraIdAuthMethod, t as apiKeyAuthMethod } from "./auth-Bxz4kKUI.mjs";
//#region extensions/microsoft-foundry/provider.ts
const wrapOpenAIResponsesStreamFn = buildProviderStreamFamilyHooks("openai-responses-defaults").wrapStreamFn;
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
function buildMicrosoftFoundryProvider() {
	return {
		id: PROVIDER_ID,
		label: "Microsoft Foundry",
		docsPath: "/providers/models",
		envVars: ["AZURE_OPENAI_API_KEY", "AZURE_OPENAI_ENDPOINT"],
		auth: [entraIdAuthMethod, apiKeyAuthMethod],
		onModelSelected: async (ctx) => {
			const providerConfig = ctx.config.models?.providers?.[PROVIDER_ID];
			if (!providerConfig || !providerConfig.baseUrl?.trim() || !Array.isArray(providerConfig.models) || !ctx.model.startsWith(`microsoft-foundry/`)) return;
			const selectedModelId = ctx.model.slice(`${PROVIDER_ID}/`.length);
			const configuredModels = providerConfig.models ?? [];
			const existingModel = configuredModels.find((model) => model.id === selectedModelId);
			const existingModelApi = isFoundryProviderApi(existingModel?.api) ? existingModel.api : void 0;
			const providerApiForExistingModel = existingModel && isFoundryProviderApi(providerConfig.api) ? providerConfig.api : void 0;
			const selectedModelCapabilities = resolveFoundryModelCapabilities(selectedModelId, existingModel?.name, existingModelApi ?? providerApiForExistingModel, existingModel?.input);
			const providerEndpoint = normalizeFoundryEndpoint(providerConfig.baseUrl ?? "");
			const selectedProviderEndpoint = extractFoundryEndpoint(existingModel?.baseUrl) ?? providerEndpoint;
			const nextModels = configuredModels.map((model) => {
				if (model.id !== selectedModelId) return model;
				const selectedModelEndpoint = extractFoundryEndpoint(model.baseUrl) ?? providerEndpoint;
				const selectedModelBaseUrl = buildFoundryProviderBaseUrl(selectedModelEndpoint, selectedModelId, selectedModelCapabilities.modelName, selectedModelCapabilities.api);
				const nextModel = Object.assign({}, model, {
					name: selectedModelCapabilities.modelName,
					api: selectedModelCapabilities.api,
					baseUrl: selectedModelBaseUrl,
					reasoning: selectedModelCapabilities.reasoning || model.reasoning,
					thinkingLevelMap: selectedModelCapabilities.thinkingLevelMap ?? model.thinkingLevelMap,
					params: mergeFoundryCanonicalModelParams(model.params, selectedModelCapabilities.modelName),
					input: selectedModelCapabilities.input
				});
				if (selectedModelCapabilities.compat) {
					const explicitSupportsReasoningEffort = typeof model.compat?.supportsReasoningEffort === "boolean" ? model.compat.supportsReasoningEffort : void 0;
					const preserveExplicitReasoningEffort = !selectedModelCapabilities.reasoning && model.reasoning && explicitSupportsReasoningEffort !== false;
					const explicitMaxTokensField = typeof model.compat?.maxTokensField === "string" ? model.compat.maxTokensField : preserveExplicitReasoningEffort ? "max_completion_tokens" : void 0;
					nextModel.compat = {
						...model.compat,
						...selectedModelCapabilities.compat,
						...explicitSupportsReasoningEffort !== void 0 ? { supportsReasoningEffort: explicitSupportsReasoningEffort } : preserveExplicitReasoningEffort ? { supportsReasoningEffort: true } : void 0,
						...explicitMaxTokensField ? { maxTokensField: explicitMaxTokensField } : {}
					};
				}
				return nextModel;
			});
			if (!nextModels.some((model) => model.id === selectedModelId)) nextModels.push({
				id: selectedModelId,
				name: selectedModelCapabilities.modelName,
				api: selectedModelCapabilities.api,
				baseUrl: buildFoundryProviderBaseUrl(providerEndpoint, selectedModelId, selectedModelCapabilities.modelName, selectedModelCapabilities.api),
				reasoning: selectedModelCapabilities.reasoning,
				...selectedModelCapabilities.thinkingLevelMap ? { thinkingLevelMap: selectedModelCapabilities.thinkingLevelMap } : {},
				params: mergeFoundryCanonicalModelParams(void 0, selectedModelCapabilities.modelName),
				input: selectedModelCapabilities.input,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				},
				contextWindow: selectedModelCapabilities.contextWindow,
				maxTokens: selectedModelCapabilities.maxTokens,
				...selectedModelCapabilities.compat ? { compat: selectedModelCapabilities.compat } : {}
			});
			const nextProviderConfig = {
				...providerConfig,
				baseUrl: buildFoundryProviderBaseUrl(selectedProviderEndpoint, selectedModelId, selectedModelCapabilities.modelName, selectedModelCapabilities.api),
				api: selectedModelCapabilities.api,
				models: nextModels
			};
			const targetProfileId = resolveFoundryTargetProfileId(ctx.config);
			if (targetProfileId) applyFoundryProfileBinding(ctx.config, targetProfileId);
			applyFoundryProviderConfig(ctx.config, nextProviderConfig);
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
			const explicitSupportsReasoningEffort = typeof model.compat?.supportsReasoningEffort === "boolean" ? model.compat.supportsReasoningEffort : void 0;
			const preserveExplicitReasoningEffort = !capabilities.reasoning && model.reasoning;
			const explicitMaxTokensField = typeof model.compat?.maxTokensField === "string" ? model.compat.maxTokensField : preserveExplicitReasoningEffort ? "max_completion_tokens" : void 0;
			const compat = capabilities.compat ? {
				...model.compat,
				...capabilities.compat,
				...explicitSupportsReasoningEffort !== void 0 ? { supportsReasoningEffort: explicitSupportsReasoningEffort } : preserveExplicitReasoningEffort ? { supportsReasoningEffort: true } : void 0,
				...explicitMaxTokensField ? { maxTokensField: explicitMaxTokensField } : {}
			} : void 0;
			return {
				...model,
				name: capabilities.modelName,
				api: capabilities.api,
				reasoning: capabilities.reasoning || model.reasoning,
				thinkingLevelMap: capabilities.thinkingLevelMap ?? model.thinkingLevelMap,
				params: mergeFoundryCanonicalModelParams(model.params, capabilities.modelName),
				input: capabilities.input,
				baseUrl: buildFoundryProviderBaseUrl(endpoint, modelId, capabilities.modelName, capabilities.api),
				...compat ? { compat } : {}
			};
		},
		wrapStreamFn: wrapMicrosoftFoundryStreamFn,
		prepareRuntimeAuth: prepareFoundryRuntimeAuth
	};
}
//#endregion
export { buildMicrosoftFoundryProvider as t };

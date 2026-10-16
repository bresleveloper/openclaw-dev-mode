import { resolveBedrockPromptCachePolicy, supportsBedrockClaudePromptCaching } from "./bedrock-options.js";
import { loadBedrockControlPlaneSdk, runBedrockControlPlaneRequest } from "./control-plane.js";
import { bedrockMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { isLatestAdaptiveBedrockModelRef, isOpus47OrNewerBedrockModelRef, resolveBedrockClaudeThinkingProfile, resolveBedrockNativeThinkingLevelMap, supportsBedrockNativeMaxEffort } from "./thinking-policy.js";
import { streamSimpleBedrock } from "./stream.runtime.js";
import { hasRuntimeContextMarker } from "openclaw/plugin-sdk/llm";
import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveAwsSdkEnvVarName } from "openclaw/plugin-sdk/provider-auth-runtime";
import { runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { buildProviderReplayFamilyHooks, normalizeProviderId, resolveClaudeFable5ModelIdentity, resolveClaudeModelIdentity, resolveClaudeMythos5ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
import { splitSystemPromptCacheBoundary } from "openclaw/plugin-sdk/provider-transport-runtime";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/amazon-bedrock/register.sync.runtime.ts
function normalizeBedrockResolvedModel({ modelId, model }) {
	const thinkingLevelMap = resolveBedrockNativeThinkingLevelMap(modelId, model.params);
	if (!thinkingLevelMap) return;
	const reasoning = model.reasoning || resolveClaudeFable5ModelIdentity({
		id: modelId,
		params: model.params
	}) !== void 0 || resolveClaudeMythos5ModelIdentity({
		id: modelId,
		params: model.params
	}) !== void 0 || resolveClaudeOpus5ModelIdentity({
		id: modelId,
		params: model.params
	}) !== void 0;
	const current = model.thinkingLevelMap;
	const currentEfforts = current;
	if (reasoning === model.reasoning && Object.entries(thinkingLevelMap).every(([level, effort]) => currentEfforts?.[level] === effort)) return;
	return {
		...model,
		reasoning,
		thinkingLevelMap: {
			...thinkingLevelMap,
			...current
		}
	};
}
const BEDROCK_SERVICE_TIER_VALUES = [
	"flex",
	"priority",
	"default",
	"reserved"
];
function isAnthropicBedrockModel(modelId) {
	const normalized = modelId.trim().toLowerCase();
	if (normalized.includes("anthropic.claude") || normalized.includes("anthropic/claude")) return true;
	if (/^arn:aws(-cn|-us-gov)?:bedrock:/.test(normalized) && normalized.includes(":application-inference-profile/")) return (normalized.split(":application-inference-profile/")[1] ?? "").includes("claude");
	return false;
}
const bedrockStreamFn = (model, context, options) => {
	if (model.api !== "bedrock-converse-stream") throw new Error(`Amazon Bedrock stream received unsupported API: ${model.api}`);
	return streamSimpleBedrock(model, context, options);
};
function createBedrockNoCacheWrapper(baseStreamFn) {
	const underlying = baseStreamFn ?? bedrockStreamFn;
	return (model, context, options) => underlying(model, context, {
		...options,
		cacheRetention: "none"
	});
}
function resolveBedrockServiceTier(extraParams, warn) {
	const raw = extraParams?.serviceTier ?? extraParams?.service_tier;
	if (typeof raw !== "string") return;
	const normalized = raw.trim().toLowerCase();
	const tier = BEDROCK_SERVICE_TIER_VALUES.find((candidate) => candidate === normalized);
	if (tier) return tier;
	warn(`ignoring invalid Bedrock service_tier param: ${raw}`);
}
function createBedrockServiceTierWrapper(underlying, serviceTier) {
	return createPayloadPatchStreamWrapper(underlying, ({ payload }) => {
		payload.serviceTier ??= { type: serviceTier };
	}, { shouldPatch: ({ model }) => model.api === "bedrock-converse-stream" });
}
function createGuardrailStreamWrapper(streamFn, guardrailConfig) {
	return createPayloadPatchStreamWrapper(streamFn, ({ payload }) => {
		payload.guardrailConfig = {
			guardrailIdentifier: guardrailConfig.guardrailIdentifier,
			guardrailVersion: guardrailConfig.guardrailVersion,
			...guardrailConfig.streamProcessingMode ? { streamProcessingMode: guardrailConfig.streamProcessingMode } : {},
			...guardrailConfig.trace ? { trace: guardrailConfig.trace } : {}
		};
	});
}
/**
* Detect Bedrock application inference profile ARNs — these are the only IDs
* where model-name-based checks fail because the ARN is opaque.
* System-defined profiles (us., eu., global.) and base model IDs always
* contain the model name and are handled by the shared model runtime natively.
*/
const BEDROCK_APP_INFERENCE_PROFILE_RE = /^arn:aws(-cn|-us-gov)?:bedrock:.*:application-inference-profile\//i;
function isBedrockAppInferenceProfile(modelId) {
	return BEDROCK_APP_INFERENCE_PROFILE_RE.test(modelId);
}
/**
* Extract the region from a Bedrock ARN.
* e.g. "arn:aws:bedrock:us-east-1:123:application-inference-profile/abc" → "us-east-1"
*/
function extractRegionFromArn(arn) {
	const parts = arn.split(":");
	return parts.length >= 4 && parts[3] ? parts[3] : void 0;
}
const appProfileTraitsCache = /* @__PURE__ */ new Map();
async function resolveAppProfileTraits(modelId, fallbackRegion, signal) {
	const cached = appProfileTraitsCache.get(modelId);
	if (cached) return cached;
	let client;
	try {
		signal?.throwIfAborted();
		const region = extractRegionFromArn(modelId) ?? fallbackRegion;
		const sdk = await loadBedrockControlPlaneSdk();
		signal?.throwIfAborted();
		const controlPlaneClient = sdk.createClient(region);
		client = controlPlaneClient;
		const command = sdk.createGetInferenceProfileCommand({ inferenceProfileIdentifier: modelId });
		const models = (await runBedrockControlPlaneRequest({
			operation: "Bedrock GetInferenceProfile",
			signal,
			send: (options) => controlPlaneClient.send(command, options)
		})).models ?? [];
		const modelArns = models.map((model) => model.modelArn ?? "");
		const traits = {
			cacheEligible: models.length > 0 && modelArns.every((modelArn) => supportsBedrockClaudePromptCaching(modelArn)),
			omitTemperature: modelArns.some(isOpus47OrNewerBedrockModelRef)
		};
		appProfileTraitsCache.set(modelId, traits);
		return traits;
	} catch {
		signal?.throwIfAborted();
		return {
			cacheEligible: isAnthropicBedrockModel(modelId),
			omitTemperature: isOpus47OrNewerBedrockModelRef(modelId)
		};
	} finally {
		client?.destroy();
	}
}
function hasCachePoint(blocks) {
	return blocks?.some((b) => b.cachePoint != null) === true;
}
/**
* Inject Bedrock Converse cache points into the payload when the shared runtime skipped them
* because it didn't recognize the model ID (application inference profiles).
*/
function injectBedrockCachePoints(payload, cacheRetention, context, model) {
	if (!cacheRetention || cacheRetention === "none" || resolveBedrockPromptCachePolicy(model)) return;
	const point = { cachePoint: {
		type: "default",
		...cacheRetention === "long" ? { ttl: "1h" } : {}
	} };
	const system = payload.system;
	if (Array.isArray(system) && system.length > 0 && !hasCachePoint(system)) {
		const split = context.systemPrompt && splitSystemPromptCacheBoundary(context.systemPrompt);
		if (!split || split.stablePrefix) system.splice(split ? 1 : system.length, 0, point);
	}
	if (context.messages.some(hasRuntimeContextMarker)) return;
	const messages = payload.messages;
	if (Array.isArray(messages)) {
		const userContent = messages.toReversed().find((msg) => msg.role === "user" && Array.isArray(msg.content))?.content;
		if (userContent && !hasCachePoint(userContent)) userContent.push(point);
	}
}
function patchMaxThinkingEffort(payload) {
	const fields = asOptionalRecord(payload.additionalModelRequestFields) ?? {};
	const outputConfig = asOptionalRecord(fields.output_config) ?? {};
	outputConfig.effort = "max";
	fields.output_config = outputConfig;
	payload.additionalModelRequestFields = fields;
}
/** Register Amazon Bedrock provider, discovery catalog, stream wrappers, and embeddings. */
function registerAmazonBedrockPlugin(api) {
	const providerId = "amazon-bedrock";
	const bedrockRegionRe = /bedrock-runtime\.([a-z0-9-]+)\.amazonaws\./;
	const bedrockContextOverflowPatterns = [
		/ValidationException.*(?:input is too long|max input token|input token.*exceed)/i,
		/ValidationException.*(?:exceeds? the (?:maximum|max) (?:number of )?(?:input )?tokens)/i,
		/ModelStreamErrorException.*(?:Input is too long|too many input tokens)/i
	];
	const deprecatedTemperatureValidationRe = /ValidationException[\s\S]*(?:invalid_request_error[\s\S]*)?temperature[\s\S]*deprecated|ValidationException[\s\S]*deprecated[\s\S]*temperature/i;
	const anthropicByModelReplayHooks = buildProviderReplayFamilyHooks({ family: "anthropic-by-model" });
	const startupPluginConfig = api.pluginConfig ?? {};
	function resolveCurrentPluginConfig(config) {
		return resolvePluginConfigObject(config, providerId) ?? (config ? void 0 : startupPluginConfig);
	}
	api.registerEmbeddingProvider(bedrockMemoryEmbeddingProviderAdapter);
	const baseWrapStreamFn = ({ modelId, model, streamFn }) => {
		const modelRef = {
			id: modelId,
			params: model?.params
		};
		if (resolveBedrockPromptCachePolicy(modelRef) === "nova" || isAnthropicBedrockModel(modelId) || resolveClaudeModelIdentity(modelRef).startsWith("claude-")) return streamFn;
		if (isBedrockAppInferenceProfile(modelId)) return streamFn;
		return createBedrockNoCacheWrapper(streamFn);
	};
	function omitUnsupportedClaudeTemperature(modelRef, options) {
		const canonicalModelId = resolveClaudeModelIdentity(modelRef);
		if (!(isOpus47OrNewerBedrockModelRef(modelRef.id) || isOpus47OrNewerBedrockModelRef(canonicalModelId) || resolveClaudeFable5ModelIdentity(modelRef) !== void 0) || !("temperature" in options)) return options;
		const next = { ...options };
		delete next.temperature;
		return next;
	}
	function omitUnsupportedClaudePayloadTemperature(payload) {
		const inferenceConfig = payload.inferenceConfig;
		if (!inferenceConfig || typeof inferenceConfig !== "object") return;
		delete inferenceConfig.temperature;
	}
	/** Extract the AWS region from a bedrock-runtime baseUrl. */
	function extractRegionFromBaseUrl(baseUrl) {
		if (!baseUrl) return;
		return bedrockRegionRe.exec(baseUrl)?.[1];
	}
	/** Resolve the AWS region for Bedrock API calls from provider-specific baseUrl. */
	function resolveBedrockRegion(config, selectedProvider) {
		const providers = config?.models?.providers ?? {};
		const exact = providers[selectedProvider]?.baseUrl;
		const exactRegion = extractRegionFromBaseUrl(exact);
		if (exactRegion) return exactRegion;
		for (const [key, value] of Object.entries(providers)) {
			if (key === selectedProvider || normalizeProviderId(key) !== normalizeProviderId(selectedProvider)) continue;
			const region = extractRegionFromBaseUrl(value.baseUrl);
			if (region) return region;
		}
	}
	api.registerProvider({
		id: providerId,
		hookAliases: ["bedrock-converse-stream"],
		label: "Amazon Bedrock",
		docsPath: "/providers/models",
		auth: [],
		catalog: {
			order: "simple",
			run: (ctx) => runLiveProviderCatalog({
				providerId,
				run: async () => {
					const { resolveImplicitBedrockProvider } = await import("./discovery.js");
					const implicit = await resolveImplicitBedrockProvider({
						discoveryMode: "strict",
						pluginConfig: resolveCurrentPluginConfig(ctx.config),
						env: ctx.env
					});
					return implicit ? { provider: implicit } : null;
				}
			})
		},
		resolveConfigApiKey: ({ env }) => resolveAwsSdkEnvVarName(env),
		normalizeResolvedModel: normalizeBedrockResolvedModel,
		supportsSystemPromptCacheBoundary: true,
		createStreamFn: ({ model }) => model.api === "bedrock-converse-stream" ? bedrockStreamFn : void 0,
		...anthropicByModelReplayHooks,
		wrapStreamFn: ({ provider, modelId, config, model, streamFn, thinkingLevel, extraParams }) => {
			const currentPluginConfig = resolveCurrentPluginConfig(config);
			const currentGuardrail = currentPluginConfig?.guardrail;
			const modelRef = {
				id: modelId,
				params: model?.params
			};
			const fable5 = resolveClaudeFable5ModelIdentity(modelRef) !== void 0;
			const opus5 = resolveClaudeOpus5ModelIdentity(modelRef) !== void 0;
			const sonnet5 = resolveClaudeSonnet5ModelIdentity(modelRef) !== void 0;
			const canonicalModelId = resolveClaudeModelIdentity(modelRef);
			const opus47OrNewer = isOpus47OrNewerBedrockModelRef(modelId) || isOpus47OrNewerBedrockModelRef(canonicalModelId);
			const supportsNativeMax = supportsBedrockNativeMaxEffort(modelId, model?.params);
			let wrapped = baseWrapStreamFn({
				modelId,
				model,
				streamFn
			});
			if (wrapped && currentGuardrail?.guardrailIdentifier && currentGuardrail.guardrailVersion) wrapped = createGuardrailStreamWrapper(wrapped, currentGuardrail);
			const serviceTier = resolveBedrockServiceTier(extraParams, (message) => api.logger.warn(message));
			if (serviceTier && wrapped) {
				if ((fable5 || opus5 || sonnet5) && serviceTier !== "default") {
					const modelLabel = fable5 ? "Fable 5" : opus5 ? "Opus 5" : "Sonnet 5";
					api.logger.warn(`ignoring unsupported ${modelLabel} Bedrock service tier: ${serviceTier}`);
				} else wrapped = createBedrockServiceTierWrapper(wrapped, serviceTier);
			}
			const region = resolveBedrockRegion(config, provider) ?? extractRegionFromBaseUrl(model?.baseUrl) ?? currentPluginConfig?.discovery?.region;
			const mayNeedCacheInjection = isBedrockAppInferenceProfile(modelId) && !supportsBedrockClaudePromptCaching(modelId);
			const shouldOmitTemperature = opus47OrNewer || fable5 || isLatestAdaptiveBedrockModelRef(modelId, model?.params);
			const shouldPatchMaxThinking = supportsNativeMax && thinkingLevel === "max";
			const shouldPatchPayload = shouldOmitTemperature || shouldPatchMaxThinking;
			const heuristicMatch = isAnthropicBedrockModel(modelId);
			if (!region && !mayNeedCacheInjection && !shouldOmitTemperature && !shouldPatchMaxThinking) return wrapped;
			const underlying = wrapped ?? streamFn;
			if (!underlying) return wrapped;
			return (streamModel, context, options) => {
				const merged = omitUnsupportedClaudeTemperature(modelRef, Object.assign({}, options, region ? { region } : {}));
				const originalOnPayload = merged.onPayload;
				if (!mayNeedCacheInjection) return underlying(streamModel, context, {
					...merged,
					...shouldPatchPayload ? { onPayload: (payload, payloadModel) => {
						if (payload && typeof payload === "object") {
							const payloadRecord = payload;
							if (shouldPatchMaxThinking) patchMaxThinkingEffort(payloadRecord);
							if (shouldOmitTemperature) omitUnsupportedClaudePayloadTemperature(payloadRecord);
						}
						return originalOnPayload?.(payload, payloadModel);
					} } : {}
				});
				const cacheRetention = typeof merged.cacheRetention === "string" ? merged.cacheRetention : "short";
				return underlying(streamModel, context, {
					...merged,
					onPayload: async (payload, payloadModel) => {
						const traits = heuristicMatch ? void 0 : await resolveAppProfileTraits(modelId, region, merged.signal);
						if (payload && typeof payload === "object") {
							const payloadRecord = payload;
							if (heuristicMatch || traits?.cacheEligible) injectBedrockCachePoints(payloadRecord, cacheRetention, context, streamModel);
							if (shouldPatchMaxThinking) patchMaxThinkingEffort(payloadRecord);
							if (heuristicMatch ? shouldOmitTemperature || "temperature" in merged && (await resolveAppProfileTraits(modelId, region, merged.signal)).omitTemperature : traits?.omitTemperature) omitUnsupportedClaudePayloadTemperature(payloadRecord);
						}
						return originalOnPayload?.(payload, payloadModel);
					}
				});
			};
		},
		matchesContextOverflowError: ({ errorMessage }) => bedrockContextOverflowPatterns.some((pattern) => pattern.test(errorMessage)),
		classifyFailoverReason: ({ errorMessage }) => {
			if (/ThrottlingException|Too many concurrent requests/i.test(errorMessage)) return "rate_limit";
			if (/ModelNotReadyException/i.test(errorMessage)) return "overloaded";
			if (deprecatedTemperatureValidationRe.test(errorMessage)) return "format";
		},
		resolveThinkingProfile: ({ modelId, params }) => resolveBedrockClaudeThinkingProfile(modelId, params)
	});
}
//#endregion
export { registerAmazonBedrockPlugin };

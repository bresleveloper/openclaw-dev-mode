import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as runPluginStreamConsumer } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { a as sanitizeExtraParamsRecord, i as resolveModelExtraParamSources, r as resolveAliasedParamValue } from "./model-extra-params-C1g6s41K.mjs";
import { t as DEFAULT_MISSING_TOOL_RESULT_TEXT } from "./types-CQc6JNG4.mjs";
import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-B-yS8AQL.mjs";
import { l as isSyntheticMissingToolResult, n as SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY } from "./tool-result-pairing-DxxMHOQj.mjs";
import { i as resolveProviderRequestCapabilities } from "./provider-attribution-DCsKu1Yv.mjs";
import { a as getModelProviderRequestRouteFacts, f as resolveProviderRequestPolicyConfig, o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport, s as inheritModelProviderRequestRouteFacts } from "./provider-request-config-By9R9pyt.mjs";
import { f as wrapProviderSimpleCompletionStreamFn, r as getModelProviderRuntimePluginHandle } from "./provider-hook-runtime-v-FSBQP8.mjs";
import { D as resolveProviderStreamFn, j as resolveProviderTransportTurnStateWithPlugin } from "./provider-runtime-Ck_Cecr1.mjs";
import { o as getModelProviderLocalService, t as attachModelProviderLocalService } from "./provider-local-service-ucCbK8nV.mjs";
import { t as repairToolUseResultPairing } from "./session-transcript-repair-CgGD_n-Q.mjs";
import "./ai-transport-host-DgKeCN07.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { n as buildStreamErrorAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { t as streamWithPayloadPatch } from "./stream-payload-utils-BoUixBWV.mjs";
import { c as hasCopilotVisionInput, o as buildCopilotDynamicHeaders } from "./copilot-dynamic-headers-C8eJEO7a.mjs";
import { FAILED_ASSISTANT_REPLAY_TEXT, isReasoningOnlyLengthAssistantTurn, resolveFailedAssistantReplay } from "@openclaw/ai/internal/shared";
import { configureAiTransportHost, getDefaultAiTransportHost } from "@openclaw/ai";
import { OPENAI_RESPONSES_APIS } from "@openclaw/ai/internal/openai-responses-payload-policy";
import { resolveModelBoundThinkingReplayMode } from "@openclaw/ai/internal/anthropic";
//#region src/agents/anthropic-vertex-stream.ts
/**
* Anthropic Vertex stream facade.
* Keeps Vertex-specific provider implementation in the bundled provider plugin
* while core imports a small stable factory.
*/
function loadAnthropicVertexStreamFacade() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "anthropic-vertex",
		artifactBasename: "api.js"
	});
}
/** Creates an Anthropic Vertex stream function through the bundled provider facade. */
function createAnthropicVertexStreamFnForModel(model, env = process.env) {
	return loadAnthropicVertexStreamFacade().createAnthropicVertexStreamFnForModel(model, env);
}
//#endregion
//#region src/agents/custom-api-registry.ts
const CUSTOM_API_SOURCE_PREFIX = "openclaw-custom-api:";
/** Returns the registry source id used for a custom API stream function. */
function getCustomApiRegistrySourceId(api) {
	return `${CUSTOM_API_SOURCE_PREFIX}${api}`;
}
function adaptCustomStream(model, stream) {
	if (!(stream instanceof Promise)) return stream;
	const adapted = (0, event_stream_exports.createAssistantMessageEventStream)();
	(async () => {
		try {
			await runPluginStreamConsumer(stream, async () => {
				const resolved = await stream;
				for await (const event of resolved) adapted.push(event);
				adapted.end(await resolved.result());
			});
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			const message = buildStreamErrorAssistantMessage({
				model,
				errorMessage
			});
			adapted.push({
				type: "error",
				reason: "error",
				error: message
			});
		}
	})();
	return adapted;
}
/** Registers a custom API stream function when no provider already owns it. */
function ensureCustomApiRegistered(registry, api, streamFn) {
	if (registry.getApiProvider(api)) return false;
	registry.registerApiProvider({
		api,
		stream: (model, context, options) => adaptCustomStream(model, streamFn(model, context, options)),
		streamSimple: (model, context, options) => adaptCustomStream(model, streamFn(model, context, options))
	}, getCustomApiRegistrySourceId(api));
	return true;
}
//#endregion
//#region src/agents/openai-completions-payload-policy.ts
function shouldStripOpenAICompletionsStore(model) {
	if (model.api !== "openai-completions") return false;
	const compat = model.compat && typeof model.compat === "object" ? Object.fromEntries(Object.entries(model.compat)) : void 0;
	return !(getModelProviderRequestRouteFacts(model)?.capabilities ?? resolveProviderRequestPolicyConfig({
		provider: typeof model.provider === "string" ? model.provider : void 0,
		api: model.api,
		baseUrl: typeof model.baseUrl === "string" ? model.baseUrl : void 0,
		compat,
		capability: "llm",
		transport: "stream"
	}).capabilities).usesKnownNativeOpenAIRoute;
}
function resolveExtraBodyRecord(value, param) {
	if (value === void 0 || value === null) return;
	if (typeof value !== "object" || Array.isArray(value)) {
		log.warn(`ignoring invalid ${param} param: ${typeof value === "string" ? value : typeof value}`);
		return;
	}
	const record = Object.fromEntries(Object.entries(sanitizeExtraParamsRecord(value) ?? {}).filter(([, entry]) => entry !== void 0));
	return Object.keys(record).length > 0 ? record : void 0;
}
const FRAMEWORK_MANAGED_EXTRA_BODY_KEYS = /* @__PURE__ */ new Set([
	"messages",
	"model",
	"stream"
]);
/** Apply configured payload fields before removing store from non-native completion routes. */
function createOpenAICompletionsPayloadPolicyWrapper(streamFn, sources) {
	const configuredChatTemplateKwargs = resolveExtraBodyRecord(resolveAliasedParamValue(sources, ["chat_template_kwargs", "chatTemplateKwargs"]), "chat_template_kwargs");
	const extraBody = resolveExtraBodyRecord(resolveAliasedParamValue(sources, ["extra_body", "extraBody"]), "extra_body");
	return (model, context, options) => {
		const stripStore = shouldStripOpenAICompletionsStore(model);
		if (model.api !== "openai-completions" || !configuredChatTemplateKwargs && !extraBody && !stripStore) return streamFn(model, context, options);
		return streamWithPayloadPatch(streamFn, model, context, options, (payload) => {
			if (configuredChatTemplateKwargs) {
				const existing = payload.chat_template_kwargs;
				payload.chat_template_kwargs = existing && typeof existing === "object" && !Array.isArray(existing) ? {
					...existing,
					...configuredChatTemplateKwargs
				} : configuredChatTemplateKwargs;
			}
			if (extraBody) {
				const clobberedManagedKeys = Object.keys(extraBody).filter((key) => Object.hasOwn(payload, key) && FRAMEWORK_MANAGED_EXTRA_BODY_KEYS.has(key));
				if (clobberedManagedKeys.length > 0) log.warn(`extra_body overrides framework-managed request keys: ${clobberedManagedKeys.join(", ")}`);
				Object.assign(payload, extraBody);
			}
			if (stripStore) delete payload.store;
		});
	};
}
//#endregion
//#region src/agents/transport-message-transform.ts
/**
* Normalizes transcript messages before provider transport replay. It drops
* unsafe failed turns, maps tool-call ids across model boundaries, and fills
* strict provider tool-result gaps when supported.
*/
const SYNTHETIC_TOOL_RESULT_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"openclaw-anthropic-messages-transport",
	"bedrock-converse-stream",
	"google-generative-ai",
	"openclaw-google-generative-ai-transport",
	...OPENAI_RESPONSES_APIS
]);
/** Transforms transcript messages into a provider-safe replay context. */
function transformTransportMessages(messages, model, normalizeToolCallId, options) {
	const syntheticToolResultText = OPENAI_RESPONSES_APIS.has(model.api) ? "aborted" : DEFAULT_MISSING_TOOL_RESULT_TEXT;
	const toolCallIdMap = /* @__PURE__ */ new Map();
	let hasCrossModelAsyncCalls = false;
	const transformed = messages.map((msg) => {
		if (msg.role === "toolResult") {
			const result = isSyntheticMissingToolResult(msg) && (msg.content.length !== 1 || msg.content[0]?.type !== "text" || msg.content[0].text !== syntheticToolResultText) ? {
				...msg,
				content: [{
					type: "text",
					text: syntheticToolResultText
				}],
				details: {
					...isRecord(msg.details) ? msg.details : {},
					[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true
				}
			} : msg;
			const normalizedId = toolCallIdMap.get(msg.toolCallId);
			return normalizedId && normalizedId !== msg.toolCallId ? {
				...result,
				toolCallId: normalizedId
			} : result;
		}
		if (msg.role !== "assistant") return msg;
		const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
			source: {
				provider: msg.provider,
				api: msg.api,
				modelId: msg.model,
				responseModelId: msg.responseModel
			},
			target: {
				provider: model.provider,
				api: model.api,
				modelId: model.id,
				modelParams: model.params
			}
		});
		const isSameModel = modelBoundThinkingReplayMode === "preserve" || msg.provider === model.provider && msg.api === model.api && msg.model === model.id;
		const sourceContent = Array.isArray(msg.content) ? msg.content : msg.content != null && typeof msg.content === "object" ? [msg.content] : [];
		const content = [];
		for (const block of sourceContent) {
			if (block.type === "thinking") {
				if (modelBoundThinkingReplayMode === "drop") continue;
				if (block.redacted) {
					if (isSameModel) content.push(block);
					continue;
				}
				if (isSameModel && block.thinkingSignature) {
					content.push(block);
					continue;
				}
				if (!block.thinking.trim()) continue;
				content.push(isSameModel ? block : {
					type: "text",
					text: block.thinking
				});
				continue;
			}
			if (block.type === "text") {
				content.push(isSameModel ? block : {
					type: "text",
					text: block.text
				});
				continue;
			}
			if (block.type !== "toolCall") {
				content.push(block);
				continue;
			}
			let normalizedToolCall = block;
			if (!isSameModel && block.async) {
				hasCrossModelAsyncCalls = true;
				normalizedToolCall = { ...normalizedToolCall };
				delete normalizedToolCall.async;
			}
			if (!isSameModel && block.thoughtSignature && options?.preserveCrossModelToolCallThoughtSignature !== true) {
				normalizedToolCall = { ...normalizedToolCall };
				delete normalizedToolCall.thoughtSignature;
			}
			if ((!isSameModel || options?.normalizeSameModelToolCallIds === true) && normalizeToolCallId) {
				const normalizedId = normalizeToolCallId(block.id, model, msg);
				if (normalizedId !== block.id) {
					toolCallIdMap.set(block.id, normalizedId);
					normalizedToolCall = {
						...normalizedToolCall,
						id: normalizedId
					};
				}
			}
			content.push(normalizedToolCall);
		}
		return {
			...msg,
			content
		};
	});
	const requiresPairing = SYNTHETIC_TOOL_RESULT_APIS.has(model.api) || hasCrossModelAsyncCalls;
	let replayLength = 0;
	transformed.forEach((msg, index) => {
		const original = messages[index];
		if (original && isReasoningOnlyLengthAssistantTurn(original)) return;
		const replay = original ? resolveFailedAssistantReplay(original, { pairingAware: requiresPairing }) : "keep";
		if (replay !== "drop") transformed[replayLength++] = replay === "marker" ? {
			...msg,
			content: [{
				type: "text",
				text: FAILED_ASSISTANT_REPLAY_TEXT
			}]
		} : msg;
	});
	transformed.length = replayLength;
	if (!requiresPairing) return transformed;
	return repairToolUseResultPairing(transformed, {
		erroredAssistantResultPolicy: "drop",
		missingToolResultText: syntheticToolResultText,
		preserveUnframedToolResults: options?.preserveUnframedToolResults
	}).messages;
}
//#endregion
//#region src/agents/ai-transport-runtime-host.ts
let configured = false;
/** Installs the agent and plugin ports only on paths that execute provider runtime. */
function configureAiTransportRuntimeHost() {
	if (configured) return;
	const host = getDefaultAiTransportHost();
	configureAiTransportHost({
		...host,
		plugin: {
			...host.plugin,
			resolveProviderStream: (params) => resolveProviderStreamFn({
				...params,
				config: params.config,
				runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
				context: {
					...params.context,
					config: params.context.config,
					model: params.context.model
				}
			}),
			resolveTransportTurnState: (params) => resolveProviderTransportTurnStateWithPlugin({
				...params,
				config: params.config,
				runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
				context: {
					...params.context,
					model: params.context.model
				}
			}),
			wrapSimpleCompletionStream: (params) => {
				const config = params.config;
				const providerStreamFn = wrapProviderSimpleCompletionStreamFn({
					...params,
					config,
					runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
					context: {
						...params.context,
						config: params.context.config,
						model: params.context.model
					}
				});
				const baseStreamFn = providerStreamFn ?? params.context.streamFn;
				if ((params.context.sourceApi ?? params.context.model.api) !== "openai-completions") return providerStreamFn;
				const { defaultParams, modelParams, agentModelParams, agentParams } = resolveModelExtraParamSources({
					config,
					provider: params.provider,
					modelId: params.context.modelId,
					agentId: params.context.agentId
				});
				return createOpenAICompletionsPayloadPolicyWrapper(baseStreamFn, [
					defaultParams,
					modelParams,
					agentModelParams,
					agentParams
				]);
			},
			createAnthropicVertexStream: createAnthropicVertexStreamFnForModel
		},
		buildCopilotDynamicHeaders: (messages) => buildCopilotDynamicHeaders({
			messages,
			hasImages: hasCopilotVisionInput(messages)
		}),
		resolveProviderRequestCapabilities: (input) => getModelProviderRequestRouteFacts(input.model ?? {})?.capabilities ?? resolveProviderRequestCapabilities(input),
		resolveProviderRequestHeaders: (input) => resolveProviderRequestPolicyConfig({
			...input,
			routeFacts: getModelProviderRequestRouteFacts(input.model ?? {}),
			capability: "llm",
			transport: "stream"
		}).headers,
		requiresManagedTransport: (model) => {
			const request = getModelProviderRequestTransport(model);
			return Boolean(request?.proxy || request?.tls || getModelProviderLocalService(model));
		},
		inheritManagedTransport: (source, target) => inheritModelProviderRequestRouteFacts(source, attachModelProviderLocalService(attachModelProviderRequestTransport(target, getModelProviderRequestTransport(source)), getModelProviderLocalService(source))),
		transformTransportMessages,
		registerCustomApi: ensureCustomApiRegistered
	});
	configured = true;
}
configureAiTransportRuntimeHost();
//#endregion
export { createAnthropicVertexStreamFnForModel as a, ensureCustomApiRegistered as i, transformTransportMessages as n, createOpenAICompletionsPayloadPolicyWrapper as r, configureAiTransportRuntimeHost as t };

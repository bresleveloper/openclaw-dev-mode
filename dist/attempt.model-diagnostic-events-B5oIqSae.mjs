import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as captureAsyncWorkTracker } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess, x as formatPropagatedDiagnosticTraceparent } from "./diagnostic-events-CVabF32H.mjs";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-uuHa_36_.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { m as fireAndForgetBoundedHook } from "./hooks-DuXrq03h.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { s as getStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { r as derivePromptTokens, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { S as emitCoreModelRequestStartedDiagnosticEvent, b as emitCoreSemanticRunProgressDiagnosticEvent, x as emitCoreModelRequestEndedDiagnosticEvent } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { a as diagnosticProviderRequestIdHash, i as diagnosticHttpStatusCode, n as diagnosticErrorFailureKind, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-DSynPRwg.mjs";
import { t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-pAJxJAOh.mjs";
import { i as createAnthropicVertexStreamFnForModel } from "./ai-transport-runtime-host-BgxyBsLi.mjs";
import { t as createModelCallStreamProgressReporter } from "./diagnostic-model-stream-progress-BYmYyMRB.mjs";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { notifyLlmRequestActivity, onLlmRequestActivity } from "@openclaw/ai/internal/runtime";
import { createBoundaryAwareStreamFnForModel, withProviderAcceptanceObserver } from "@openclaw/ai/transports";
//#region src/agents/embedded-agent-runner/stream-resolution.ts
const embeddedAgentBaseStreamFnCache = /* @__PURE__ */ new WeakMap();
function resolveEmbeddedAgentBaseStreamFn(params) {
	const cached = embeddedAgentBaseStreamFnCache.get(params.session);
	if (cached !== void 0 || embeddedAgentBaseStreamFnCache.has(params.session)) {
		if (!cached) throw new Error("Agent session has no lifecycle-owned base stream.");
		return cached;
	}
	const baseStreamFn = params.session.agent.streamFn;
	embeddedAgentBaseStreamFnCache.set(params.session, baseStreamFn);
	if (!baseStreamFn) throw new Error("Agent session has no lifecycle-owned base stream.");
	return baseStreamFn;
}
function resolveEmbeddedStreamRuntime(owner) {
	const runtime = owner.llmRuntime ?? getStreamLlmRuntime(owner.currentStreamFn);
	if (!runtime) throw new Error("Embedded stream has no lifecycle runtime owner.");
	return runtime;
}
function isDefaultOpenClawStreamFnForModel(model, streamFn, llmRuntime) {
	if (!streamFn || streamFn === llmRuntime.streamSimple) return true;
	const api = typeof model.api === "string" ? model.api.trim() : "";
	if (!api) return false;
	const provider = llmRuntime.registry.getApiProvider(api);
	return streamFn === provider?.streamSimple || streamFn === provider?.stream;
}
function isOpenAICodexResponsesModel(model) {
	return model.provider === "openai" && model.api === "openai-chatgpt-responses";
}
function resolveOpenClawNativeCodexResponsesStreamFn(params) {
	if (!isOpenAICodexResponsesModel(params.model)) return;
	if (!isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn, params.llmRuntime) && getStreamLlmRuntime(params.currentStreamFn) !== params.llmRuntime) return;
	return params.currentStreamFn ?? params.llmRuntime.streamSimple;
}
async function resolveEmbeddedAgentApiKey(params) {
	const resolvedApiKey = params.resolvedApiKey?.trim();
	if (resolvedApiKey) return resolvedApiKey;
	return params.authStorage ? await params.authStorage.getApiKey(params.provider) : void 0;
}
function resolveEmbeddedAgentStream(params) {
	const llmRuntime = resolveEmbeddedStreamRuntime(params);
	const wrapOptions = {
		runSignal: params.signal,
		resolvedApiKey: params.resolvedApiKey,
		authProfileId: params.authProfileId,
		authStorage: params.authStorage,
		providerId: params.model.provider,
		promptCacheKey: params.promptCacheKey,
		assertCurrent: params.assertCurrent
	};
	const stripCacheBoundary = (context) => context.systemPrompt ? {
		...context,
		systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt)
	} : context;
	if (params.providerStreamFn) return {
		streamFn: wrapEmbeddedAgentStreamFn(params.providerStreamFn, wrapOptions),
		strategy: "provider"
	};
	const currentStreamFn = params.currentStreamFn ?? llmRuntime.streamSimple;
	if (params.model.provider === "anthropic-vertex") {
		const vertexStreamFn = createAnthropicVertexStreamFnForModel(params.model);
		return {
			streamFn: params.signal || params.assertCurrent ? wrapEmbeddedAgentStreamFn(vertexStreamFn, {
				runSignal: params.signal,
				providerId: params.model.provider,
				assertCurrent: params.assertCurrent
			}) : vertexStreamFn,
			strategy: "anthropic-vertex"
		};
	}
	const nativeStreamFn = resolveOpenClawNativeCodexResponsesStreamFn({
		model: params.model,
		currentStreamFn: params.currentStreamFn,
		llmRuntime
	});
	if (nativeStreamFn) return {
		streamFn: wrapEmbeddedAgentStreamFn(nativeStreamFn, {
			...wrapOptions,
			sessionId: params.sessionId,
			transformContext: stripCacheBoundary
		}),
		strategy: "openclaw-native-codex-responses"
	};
	const isDefault = isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn, llmRuntime);
	if (isDefault || hasNonEmptyString(params.resolvedApiKey) || params.transportAuthAvailable || params.model.api === "anthropic-messages" && params.model.provider !== "anthropic") {
		const boundaryAwareStreamFn = createBoundaryAwareStreamFnForModel(params.model);
		if (boundaryAwareStreamFn) return {
			streamFn: wrapEmbeddedAgentStreamFn(boundaryAwareStreamFn, {
				...wrapOptions,
				sessionId: params.sessionId
			}),
			strategy: `boundary-aware:${params.model.api}`
		};
	}
	const promptCacheKey = params.promptCacheKey?.trim();
	return {
		streamFn: !promptCacheKey && !params.signal && !params.assertCurrent ? currentStreamFn : wrapEmbeddedAgentStreamFn(currentStreamFn, {
			runSignal: params.signal,
			providerId: params.model.provider,
			promptCacheKey,
			assertCurrent: params.assertCurrent
		}),
		strategy: isDefault ? "stream-simple" : "session-custom"
	};
}
/** Preserve request activity across cancellation composition without retaining completed turns. */
function composeRunSignal(callerSignal, runSignal) {
	const composedSignal = AbortSignal.any([callerSignal, runSignal]);
	onLlmRequestActivity(composedSignal, () => {
		if (!composedSignal.aborted) notifyLlmRequestActivity(callerSignal);
	});
	return composedSignal;
}
function wrapEmbeddedAgentStreamFn(inner, params) {
	const transformContext = params.transformContext ?? ((context) => context);
	const mergeRunSignal = (options) => {
		const embeddedOptions = options;
		const callerSignal = embeddedOptions?.signal;
		const signal = callerSignal && params.runSignal && callerSignal !== params.runSignal ? composeRunSignal(callerSignal, params.runSignal) : callerSignal ?? params.runSignal;
		let merged = params.sessionId && !embeddedOptions?.sessionId ? {
			...embeddedOptions,
			sessionId: params.sessionId
		} : embeddedOptions;
		const promptCacheKey = params.promptCacheKey?.trim();
		if (promptCacheKey && !merged?.promptCacheKey) merged = {
			...merged,
			promptCacheKey
		};
		if (params.authProfileId && !merged?.authProfileId) merged = {
			...merged,
			authProfileId: params.authProfileId
		};
		return signal ? {
			...merged,
			signal
		} : merged;
	};
	if (!params.authStorage && !params.resolvedApiKey) return (m, context, options) => {
		params.assertCurrent?.();
		return inner(m, transformContext(context), mergeRunSignal(options));
	};
	const { authStorage, providerId, resolvedApiKey } = params;
	return async (m, context, options) => {
		params.assertCurrent?.();
		const apiKey = await resolveEmbeddedAgentApiKey({
			provider: providerId,
			resolvedApiKey,
			authStorage
		});
		params.assertCurrent?.();
		const selectedApiKey = apiKey ?? options?.apiKey;
		return inner(m, transformContext(context), {
			...mergeRunSignal(options),
			apiKey: selectedApiKey
		});
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-lifecycle.ts
const TRACEPARENT_HEADER_NAME = "traceparent";
const TIMELINE_ATTRIBUTE_MAX_LENGTH = 256;
function baseModelCallEvent(ctx, callId, trace, promptStats) {
	return {
		runId: ctx.runId,
		callId,
		...ctx.sessionKey && { sessionKey: ctx.sessionKey },
		...ctx.sessionId && { sessionId: ctx.sessionId },
		provider: ctx.provider,
		model: ctx.model,
		...ctx.api && { api: ctx.api },
		...ctx.transport && { transport: ctx.transport },
		observationUnit: "request",
		...ctx.contextTokenBudget ? { contextTokenBudget: ctx.contextTokenBudget } : {},
		...ctx.contextWindowSource ? { contextWindowSource: ctx.contextWindowSource } : {},
		...ctx.contextWindowReferenceTokens ? { contextWindowReferenceTokens: ctx.contextWindowReferenceTokens } : {},
		...promptStats ? { promptStats } : {},
		trace
	};
}
function modelContentPrivateData(modelContent) {
	return modelContent ? { modelContent } : void 0;
}
function boundedTimelineAttribute(value) {
	return truncateUtf16Safe(value?.trim() ?? "", TIMELINE_ATTRIBUTE_MAX_LENGTH) || void 0;
}
function emitProviderRequestTimelineEvent(eventBase, startedAt, durationMs, ok, responseStatus, state, terminalAtMs, terminalReason, config) {
	const { providerAcceptanceKind } = state;
	const provider = boundedTimelineAttribute(eventBase.provider);
	const model = boundedTimelineAttribute(eventBase.model);
	const api = boundedTimelineAttribute(eventBase.api);
	const transport = boundedTimelineAttribute(eventBase.transport);
	emitDiagnosticsTimelineEvent({
		type: "provider.request",
		name: "provider.request",
		timestamp: new Date(startedAt).toISOString(),
		runId: eventBase.runId,
		spanId: eventBase.callId,
		durationMs,
		provider,
		operation: api ?? transport ?? "model.call",
		ok,
		...responseStatus !== void 0 ? { status: responseStatus } : {},
		attributes: {
			...model ? { model } : {},
			...api ? { api } : {},
			...transport ? { transport } : {},
			terminalAtMs,
			...state.lastProviderActivityAtMs !== void 0 ? { lastProviderActivityAtMs: state.lastProviderActivityAtMs } : {},
			terminalReason,
			providerAccepted: providerAcceptanceKind !== void 0,
			...providerAcceptanceKind ? { providerAcceptanceKind } : {}
		}
	}, { config });
}
function modelCallErrorFields(err) {
	const upstreamRequestIdHash = diagnosticProviderRequestIdHash(err);
	const failureKind = diagnosticErrorFailureKind(err);
	return {
		errorCategory: diagnosticErrorCategory(err),
		...failureKind ? {
			failureKind,
			memory: processMemoryUsageSnapshot()
		} : {},
		...upstreamRequestIdHash ? { upstreamRequestIdHash } : {}
	};
}
function processMemoryUsageSnapshot() {
	try {
		const memory = process.memoryUsage();
		return {
			rssBytes: memory.rss,
			heapTotalBytes: memory.heapTotal,
			heapUsedBytes: memory.heapUsed,
			externalBytes: memory.external,
			arrayBuffersBytes: memory.arrayBuffers
		};
	} catch {
		return;
	}
}
function modelCallHookEventBase(eventBase) {
	return {
		runId: eventBase.runId,
		callId: eventBase.callId,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		provider: eventBase.provider,
		model: eventBase.model,
		...eventBase.api ? { api: eventBase.api } : {},
		...eventBase.transport ? { transport: eventBase.transport } : {},
		...eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {},
		...eventBase.contextWindowSource ? { contextWindowSource: eventBase.contextWindowSource } : {},
		...eventBase.contextWindowReferenceTokens ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens } : {}
	};
}
function modelCallHookContext(eventBase) {
	return Object.freeze({
		runId: eventBase.runId,
		trace: eventBase.trace,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		modelProviderId: eventBase.provider,
		modelId: eventBase.model,
		...eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {},
		...eventBase.contextWindowSource ? { contextWindowSource: eventBase.contextWindowSource } : {},
		...eventBase.contextWindowReferenceTokens ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens } : {}
	});
}
function dispatchModelCallStartedHook(eventBase) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("model_call_started")) return;
	const event = Object.freeze(modelCallHookEventBase(eventBase));
	const hookCtx = modelCallHookContext(eventBase);
	fireAndForgetBoundedHook(() => hookRunner.runModelCallStarted(event, hookCtx), "model_call_started plugin hook failed");
}
function dispatchModelCallEndedHook(eventBase, fields) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("model_call_ended")) return;
	const event = Object.freeze({
		...modelCallHookEventBase(eventBase),
		...fields
	});
	const hookCtx = modelCallHookContext(eventBase);
	fireAndForgetBoundedHook(() => hookRunner.runModelCallEnded(event, hookCtx), "model_call_ended plugin hook failed");
}
function emitModelCallEnded(eventBase, startedAt, observer, failure, ownerGeneration, config) {
	if (observer.state.terminalEventEmitted) return;
	observer.state.terminalEventEmitted = true;
	const terminalAtMs = Date.now();
	const durationMs = terminalAtMs - startedAt;
	const sizeTimingFields = observer.sizeTimingFields();
	const fields = failure ? modelCallErrorFields(failure.error) : void 0;
	const terminal = fields ? {
		type: "model.call.error",
		...fields
	} : { type: "model.call.completed" };
	const errorStatus = failure ? diagnosticHttpStatusCode(failure.error) : void 0;
	const responseStatus = observer.state.responseStatus ?? (errorStatus === void 0 ? void 0 : Number(errorStatus));
	emitProviderRequestTimelineEvent(eventBase, startedAt, durationMs, failure === void 0, responseStatus, observer.state, terminalAtMs, failure ? observer.state.terminalReason === "aborted" ? "aborted" : fields?.failureKind ?? "error" : observer.state.terminalReason ?? "unknown", config);
	emitCoreModelRequestEndedDiagnosticEvent({
		...terminal,
		...eventBase,
		durationMs,
		...sizeTimingFields,
		...observer.usageField()
	}, ownerGeneration, modelContentPrivateData(observer.completedContent()));
	if (!observer.state.suppressPluginHooks) dispatchModelCallEndedHook(eventBase, {
		durationMs,
		outcome: failure ? "error" : "completed",
		...sizeTimingFields,
		...fields
	});
}
function withDiagnosticRequestContext(options, trace, observer, callId) {
	const traceparent = formatPropagatedDiagnosticTraceparent(trace);
	const originalOnPayload = options?.onPayload;
	const originalOnResponse = options?.onResponse;
	const onPayload = (payload, model) => {
		if (!originalOnPayload) {
			observer.assignRequestPayloadBytes(payload);
			return;
		}
		const result = originalOnPayload(payload, model);
		if (isPromiseLike(result)) return result.then((replacement) => {
			observer.assignRequestPayloadBytes(replacement ?? payload);
			return replacement;
		});
		observer.assignRequestPayloadBytes(result ?? payload);
		return result;
	};
	const onResponse = (response, model) => {
		if (!observer.state.terminalEventEmitted) {
			observer.state.responseStatus = response.status;
			observer.state.lastProviderActivityAtMs = Date.now();
		}
		return originalOnResponse?.(response, model);
	};
	const headers = {};
	for (const [key, value] of Object.entries(options?.headers ?? {})) {
		if (key.toLowerCase() === TRACEPARENT_HEADER_NAME) continue;
		headers[key] = value;
	}
	if (traceparent) headers[TRACEPARENT_HEADER_NAME] = traceparent;
	const requestOptions = {
		...options,
		requestId: callId,
		...(options?.headers || traceparent) && { headers },
		onPayload,
		onResponse
	};
	return withProviderAcceptanceObserver(requestOptions, (acceptance) => {
		if (observer.state.terminalEventEmitted) return;
		observer.state.lastProviderActivityAtMs = Date.now();
		observer.state.providerAcceptanceKind = acceptance.kind;
		if (acceptance.kind === "http_response") observer.state.responseStatus = acceptance.status;
	});
}
function createModelLifecycle(params) {
	const callId = params.ctx.nextCallId();
	const trace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(params.ctx.trace));
	const observer = params.createObserver(areDiagnosticsEnabledForProcess());
	const eventBase = baseModelCallEvent(params.ctx, callId, trace, observer.promptStats);
	emitCoreModelRequestStartedDiagnosticEvent(eventBase, params.ctx.ownerGeneration, params.requestTimeoutMs, modelContentPrivateData(observer.modelContent));
	if (params.ctx.suppressPluginHooks !== true) dispatchModelCallStartedHook(eventBase);
	params.ctx.onStarted?.();
	const startedAt = Date.now();
	emitDiagnosticsTimelineEvent({
		type: "mark",
		name: "provider.request.started",
		timestamp: new Date(startedAt).toISOString(),
		runId: eventBase.runId,
		spanId: callId
	}, { config: params.ctx.config });
	const propagatedOptions = withDiagnosticRequestContext(params.options, trace, observer, callId);
	let terminalNotified = false;
	return {
		eventBase,
		observer,
		propagatedOptions,
		startedAt,
		emitCompleted() {
			if (!terminalNotified && (observer.state.terminalSucceeded || observer.state.terminalError)) {
				terminalNotified = true;
				params.ctx.onTerminal?.();
				if (observer.state.terminalSucceeded && !observer.state.terminalError) params.ctx.onSucceeded?.(startedAt);
			}
			emitModelCallEnded(eventBase, startedAt, observer, observer.state.terminalError ? { error: observer.state.terminalError } : void 0, params.ctx.ownerGeneration, params.ctx.config);
		},
		emitError(err) {
			emitModelCallEnded(eventBase, startedAt, observer, { error: err }, params.ctx.ownerGeneration, params.ctx.config);
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-observation.ts
const MODEL_CALL_SEMANTIC_PROGRESS_REASON = "model_call:semantic_result";
function jsonLength(value, utf8) {
	try {
		let stringLengths = 0;
		const serialized = JSON.stringify(value, (_key, part) => {
			if (typeof part !== "string" || part.length < 4096) return part;
			const encoded = JSON.stringify(part);
			stringLengths += (utf8 ? Buffer.byteLength(encoded, "utf8") : encoded.length) - 2;
			return "";
		});
		return serialized === void 0 ? void 0 : stringLengths + (utf8 ? Buffer.byteLength(serialized, "utf8") : serialized.length);
	} catch {
		return;
	}
}
function utf8JsonByteLength(value) {
	return jsonLength(value, true);
}
function assignRequestPayloadBytes(state, payload) {
	const bytes = utf8JsonByteLength(payload);
	if (bytes !== void 0) state.requestPayloadBytes = bytes;
}
function utf8StringByteLength(value) {
	return Buffer.byteLength(value, "utf8");
}
function jsonCharLength(value) {
	return jsonLength(value, false);
}
function streamDeltaByteLength(chunk) {
	const type = chunk.type;
	if ((type === "text_delta" || type === "thinking_delta" || type === "toolcall_delta") && typeof chunk.delta === "string") return utf8StringByteLength(chunk.delta);
}
function responseStreamChunkByteLengthUnchecked(chunk) {
	if (!isRecord(chunk)) return utf8JsonByteLength(chunk);
	const deltaBytes = streamDeltaByteLength(chunk);
	if (deltaBytes !== void 0) return deltaBytes;
	if (!("partial" in chunk)) return utf8JsonByteLength(chunk);
	const { partial: _partial, ...snapshotlessChunk } = chunk;
	return utf8JsonByteLength(snapshotlessChunk);
}
function responseStreamChunkByteLength(chunk) {
	try {
		return responseStreamChunkByteLengthUnchecked(chunk);
	} catch {
		return;
	}
}
function streamContextModelContentFields(policy, streamContext) {
	if (!policy?.anyModelContent || !isRecord(streamContext)) return;
	const content = {
		...policy.inputMessages && Array.isArray(streamContext.messages) ? { inputMessages: cloneDiagnosticContentValue(streamContext.messages) } : {},
		...policy.systemPrompt && typeof streamContext.systemPrompt === "string" ? { systemPrompt: streamContext.systemPrompt } : {},
		...policy.toolDefinitions && Array.isArray(streamContext.tools) ? { toolDefinitions: cloneDiagnosticContentValue(streamContext.tools) } : {}
	};
	return Object.keys(content).length > 0 ? content : void 0;
}
function streamContextModelPromptStats(streamContext) {
	if (!isRecord(streamContext)) return;
	const messages = Array.isArray(streamContext.messages) ? streamContext.messages : void 0;
	const tools = Array.isArray(streamContext.tools) ? streamContext.tools : void 0;
	const systemPrompt = typeof streamContext.systemPrompt === "string" ? streamContext.systemPrompt : void 0;
	const inputMessagesChars = messages ? jsonCharLength(messages) : void 0;
	const toolDefinitionsChars = tools ? jsonCharLength(tools) : void 0;
	const systemPromptChars = systemPrompt?.length;
	if (messages === void 0 && tools === void 0 && systemPromptChars === void 0 && inputMessagesChars === void 0 && toolDefinitionsChars === void 0) return;
	const totalChars = (inputMessagesChars ?? 0) + (systemPromptChars ?? 0) + (toolDefinitionsChars ?? 0);
	return {
		...messages ? { inputMessagesCount: messages.length } : {},
		...inputMessagesChars !== void 0 ? { inputMessagesChars } : {},
		...systemPromptChars !== void 0 ? { systemPromptChars } : {},
		...tools ? { toolDefinitionsCount: tools.length } : {},
		...toolDefinitionsChars !== void 0 ? { toolDefinitionsChars } : {},
		totalChars
	};
}
function normalizedModelCallUsage(rawUsage) {
	if (!isRecord(rawUsage)) return;
	const usage = normalizeUsage(rawUsage);
	if (!usage) return;
	const promptTokens = derivePromptTokens(usage);
	return {
		...usage,
		...promptTokens !== void 0 ? { promptTokens } : {}
	};
}
function observeModelCallTerminalMessage(state, value) {
	if (!isRecord(value)) return;
	let rawUsage;
	try {
		rawUsage = value.usage;
		const stopReason = value.stopReason;
		if (value.role === "assistant" && (stopReason === "stop" || stopReason === "length" || stopReason === "toolUse")) {
			state.terminalSucceeded = true;
			state.terminalReason = stopReason;
		}
		if (value.role === "assistant" && (stopReason === "error" || stopReason === "aborted")) {
			state.terminalReason = stopReason;
			state.terminalError ??= Object.assign(new Error(typeof value.errorMessage === "string" ? value.errorMessage : stopReason), { code: stopReason === "aborted" ? "ABORT_ERR" : value.errorCode });
		}
	} catch {
		return;
	}
	const usage = normalizedModelCallUsage(rawUsage);
	if (usage) state.usage = usage;
}
function observeOutputMessageContent(state, chunk) {
	if (!isRecord(chunk)) return;
	let type;
	let message;
	try {
		type = chunk.type;
		message = type === "done" ? chunk.message : type === "error" ? chunk.error : void 0;
	} catch {
		return;
	}
	if (message !== void 0) {
		observeModelCallTerminalMessage(state, message);
		if (state.contentCapture?.outputMessages) state.outputMessages = [cloneDiagnosticContentValue(message)];
	}
}
function observeResultMessageContent(state, startedAt, result) {
	if (!state.terminalEventEmitted && state.terminalReason === void 0) state.lastProviderActivityAtMs = Date.now();
	state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
	observeModelCallTerminalMessage(state, result);
	if (state.contentCapture?.outputMessages && state.outputMessages === void 0) state.outputMessages = [cloneDiagnosticContentValue(result)];
	if (state.responseStreamBytes === 0) {
		const bytes = utf8JsonByteLength(result);
		if (bytes !== void 0) state.responseStreamBytes = bytes;
	}
}
function isNormalizedToolCall(value) {
	if (!isRecord(value) || value.type !== "toolCall") return false;
	return typeof value.id === "string" && value.id.trim().length > 0 && typeof value.name === "string" && value.name.trim().length > 0 && isRecord(value.arguments);
}
function isSemanticModelCallResult(result) {
	try {
		if (!isRecord(result) || result.role !== "assistant" || result.stopReason === "error" || result.stopReason === "aborted" || !Array.isArray(result.content)) return false;
		return result.stopReason === "toolUse" && result.content.some(isNormalizedToolCall) || result.content.some((item) => isRecord(item) && item.type === "text" && typeof item.text === "string" && item.text.trim().length > 0);
	} catch {
		return false;
	}
}
function maybeEmitModelCallSemanticProgress(eventBase, state, result) {
	if (state.semanticProgressEmitted || !isSemanticModelCallResult(result)) return;
	state.semanticProgressEmitted = true;
	emitCoreSemanticRunProgressDiagnosticEvent({
		runId: eventBase.runId,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		reason: MODEL_CALL_SEMANTIC_PROGRESS_REASON
	});
}
function observeResponseChunk(state, startedAt, chunk) {
	if (!state.terminalEventEmitted) state.lastProviderActivityAtMs = Date.now();
	state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
	observeOutputMessageContent(state, chunk);
	const bytes = responseStreamChunkByteLength(chunk);
	if (bytes !== void 0) state.responseStreamBytes += bytes;
}
function modelCallSizeTimingFields(state) {
	return {
		...state.requestPayloadBytes !== void 0 ? { requestPayloadBytes: state.requestPayloadBytes } : {},
		...state.responseStreamBytes > 0 ? { responseStreamBytes: state.responseStreamBytes } : {},
		...state.timeToFirstByteMs !== void 0 ? { timeToFirstByteMs: state.timeToFirstByteMs } : {}
	};
}
function modelCallCompletedContent(state) {
	if (!state.modelContent && !state.outputMessages) return;
	return {
		...state.modelContent,
		...state.outputMessages ? { outputMessages: state.outputMessages } : {}
	};
}
function modelCallUsageField(state) {
	return state.usage ? { usage: state.usage } : {};
}
function createModelObserver(params) {
	const modelContent = streamContextModelContentFields(params.contentCapture, params.streamContext);
	const promptStats = params.capturePromptStats ? streamContextModelPromptStats(params.streamContext) : void 0;
	const state = {
		responseStreamBytes: 0,
		modelContent,
		contentCapture: params.contentCapture,
		suppressPluginHooks: params.suppressPluginHooks
	};
	const reportStreamProgress = createModelCallStreamProgressReporter({ config: params.config });
	return {
		state,
		promptStats,
		modelContent,
		assignRequestPayloadBytes(payload) {
			assignRequestPayloadBytes(state, payload);
		},
		observeResponseChunk(startedAt, chunk) {
			observeResponseChunk(state, startedAt, chunk);
		},
		observeFinalResult(eventBase, startedAt, result) {
			observeResultMessageContent(state, startedAt, result);
			maybeEmitModelCallSemanticProgress(eventBase, state, result);
		},
		maybeEmitStreamProgress(eventBase) {
			reportStreamProgress({
				...eventBase,
				callId: state.terminalEventEmitted ? void 0 : eventBase.callId
			});
		},
		sizeTimingFields() {
			return modelCallSizeTimingFields(state);
		},
		completedContent() {
			return modelCallCompletedContent(state);
		},
		usageField() {
			return modelCallUsageField(state);
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-events.ts
const MODEL_CALL_STREAM_RETURN_TIMEOUT_MS = 1e3;
function asyncIteratorFactory(value) {
	if (value === null || typeof value !== "object") return;
	try {
		const asyncIterator = value[Symbol.asyncIterator];
		if (typeof asyncIterator !== "function") return;
		return () => asyncIterator.call(value);
	} catch {
		return;
	}
}
async function safeReturnIterator(iterator, trackCleanup) {
	const returnResult = trackCleanup(() => iterator.return?.());
	let timeout;
	try {
		await Promise.race([Promise.resolve(returnResult).catch(() => void 0), new Promise((resolve) => {
			timeout = setTimeout(resolve, MODEL_CALL_STREAM_RETURN_TIMEOUT_MS);
			const unref = typeof timeout === "object" && timeout ? timeout.unref : void 0;
			if (unref) unref.call(timeout);
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function observeModelCallIterator(iterator, lifecycle, observeSharedResult) {
	const trackCleanup = captureAsyncWorkTracker();
	let started = false;
	let returning;
	const observed = observe();
	return {
		[Symbol.asyncIterator]() {
			return this;
		},
		next() {
			if (returning) return returning.then(() => ({
				done: true,
				value: void 0
			}));
			started = true;
			return observed.next();
		},
		return(value) {
			returning ??= started ? observed.return(value) : Promise.resolve().then(async () => {
				await safeReturnIterator(iterator, trackCleanup);
				lifecycle.emitCompleted();
				return {
					done: true,
					value
				};
			});
			return returning;
		},
		throw(error) {
			started = true;
			return observed.throw(error);
		}
	};
	async function* observe() {
		let iteratorSettled = false;
		try {
			for (;;) {
				const next = await iterator.next();
				if (next.done) {
					iteratorSettled = true;
					break;
				}
				const chunk = next.value;
				lifecycle.observer.observeResponseChunk(lifecycle.startedAt, chunk);
				lifecycle.observer.maybeEmitStreamProgress(lifecycle.eventBase);
				yield chunk;
			}
			if (observeSharedResult && !lifecycle.observer.state.terminalError) trackCleanup(observeSharedResult).catch(() => void 0);
			else lifecycle.emitCompleted();
		} catch (err) {
			iteratorSettled = true;
			lifecycle.emitError(err);
			throw err;
		} finally {
			if (!iteratorSettled) {
				await safeReturnIterator(iterator, trackCleanup);
				lifecycle.emitCompleted();
			}
		}
	}
}
function observeModelCallFinalResult(result, lifecycle) {
	lifecycle.observer.observeFinalResult(lifecycle.eventBase, lifecycle.startedAt, result);
	lifecycle.emitCompleted();
	return result;
}
function createSharedResultObserver(stream, lifecycle) {
	if (!isRecord(stream) || typeof stream.result !== "function") return;
	const resultFn = stream.result;
	let cached;
	return () => {
		if (!cached) {
			cached = Promise.resolve().then(() => resultFn.call(stream)).then((resolved) => observeModelCallFinalResult(resolved, lifecycle), (err) => {
				lifecycle.emitError(err);
				throw err;
			});
			cached.catch(() => void 0);
		}
		return cached;
	};
}
function observeModelCallStream(stream, createIterator, lifecycle) {
	const observedResult = createSharedResultObserver(stream, lifecycle);
	const observedIterator = () => observeModelCallIterator(createIterator(), lifecycle, observedResult)[Symbol.asyncIterator]();
	let hasNonConfigurableIterator;
	try {
		hasNonConfigurableIterator = Object.getOwnPropertyDescriptor(stream, Symbol.asyncIterator)?.configurable === false;
	} catch {
		hasNonConfigurableIterator = true;
	}
	if (hasNonConfigurableIterator) return {
		[Symbol.asyncIterator]: observedIterator,
		...observedResult ? { result: observedResult } : {}
	};
	return new Proxy(stream, { get(target, property, receiver) {
		if (property === Symbol.asyncIterator) return observedIterator;
		if (property === "result" && observedResult) return observedResult;
		const value = Reflect.get(target, property, receiver);
		return typeof value === "function" ? value.bind(target) : value;
	} });
}
function observeModelCallResult(result, lifecycle) {
	const createIterator = asyncIteratorFactory(result);
	if (createIterator) return observeModelCallStream(result, createIterator, lifecycle);
	lifecycle.emitCompleted();
	return result;
}
/**
* Wraps a model stream function with diagnostic model-call lifecycle events,
* traceparent propagation, request/response byte accounting, optional captured
* model content, progress heartbeats, and plugin hook dispatch.
*/
function wrapStreamFnWithDiagnosticModelCallEvents(streamFn, ctx) {
	return ((model, streamContext, options) => {
		const lifecycle = createModelLifecycle({
			ctx,
			options,
			requestTimeoutMs: clampPositiveTimerTimeoutMs((isRecord(model) ? model.requestTimeoutMs : void 0) ?? ctx.requestTimeoutMs),
			createObserver: (capturePromptStats) => createModelObserver({
				config: ctx.config,
				streamContext,
				contentCapture: ctx.contentCapture,
				suppressPluginHooks: ctx.suppressPluginHooks,
				capturePromptStats
			})
		});
		try {
			const result = streamFn(model, streamContext, lifecycle.propagatedOptions);
			if (isPromiseLike(result)) return result.then((resolved) => observeModelCallResult(resolved, lifecycle), (err) => {
				lifecycle.emitError(err);
				throw err;
			});
			return observeModelCallResult(result, lifecycle);
		} catch (err) {
			lifecycle.emitError(err);
			throw err;
		}
	});
}
//#endregion
export { resolveEmbeddedAgentStream as i, resolveEmbeddedAgentApiKey as n, resolveEmbeddedAgentBaseStreamFn as r, wrapStreamFnWithDiagnosticModelCallEvents as t };

import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as captureAsyncWorkTracker } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { O as freezeDiagnosticTraceContext, S as formatPropagatedDiagnosticTraceparent, t as areDiagnosticsEnabledForProcess, w as createChildDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-DxQ8TaVy.mjs";
import { t as settlesWithin } from "./settle-within-CTpJLoBG.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { f as fireAndForgetBoundedHook } from "./hooks-ADSXph0M.mjs";
import { s as getStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { r as derivePromptTokens, u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { C as emitCoreModelRequestStartedDiagnosticEvent, S as emitCoreModelRequestEndedDiagnosticEvent, x as emitCoreSemanticRunProgressDiagnosticEvent } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { a as diagnosticProviderRequestIdHash, i as diagnosticHttpStatusCode, n as diagnosticErrorFailureKind, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-BSgZdc_o.mjs";
import { t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { a as createAnthropicVertexStreamFnForModel } from "./ai-transport-runtime-host-Csx7HNwj.mjs";
import { r as supportsOpenAIResponsesFastMode } from "./openai-fast-mode-B8-SEg6R.mjs";
import { t as createModelCallStreamProgressReporter } from "./diagnostic-model-stream-progress-CcHaqwpX.mjs";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { createBoundaryAwareStreamFnForModel, withProviderAcceptanceObserver } from "@openclaw/ai/transports";
import { modelRequestBodyState, responsesServiceTierObserver } from "@openclaw/ai/internal/openai";
import { notifyLlmRequestActivity, onLlmRequestActivity } from "@openclaw/ai/internal/runtime";
//#region src/agents/embedded-agent-runner/stream-resolution.ts
const embeddedAgentBaseStreamFnCache = /* @__PURE__ */ new WeakMap();
function resolveEmbeddedAgentBaseStreamFn(params) {
	if (!embeddedAgentBaseStreamFnCache.has(params.session)) embeddedAgentBaseStreamFnCache.set(params.session, params.session.agent.streamFn);
	const baseStreamFn = embeddedAgentBaseStreamFnCache.get(params.session);
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
async function resolveEmbeddedAgentApiKey(params) {
	const resolvedApiKey = params.resolvedApiKey?.trim();
	if (resolvedApiKey) return resolvedApiKey;
	return params.authStorage ? await params.authStorage.getApiKey(params.provider) : void 0;
}
function resolveEmbeddedAgentStream(params) {
	const { streamFn, strategy, wrapApiKey } = selectEmbeddedAgentStream(params);
	return {
		streamFn: wrapApiKey(streamFn),
		strategy
	};
}
/**
* Selects the embedded stream and returns its run-credential wrapper separately.
* Callers that compose provider wrappers apply wrapApiKey outside them, because
* those wrappers classify auth from options.apiKey.
*/
function selectEmbeddedAgentStream(params) {
	const llmRuntime = resolveEmbeddedStreamRuntime(params);
	const wrapOptions = {
		runSignal: params.signal,
		authProfileId: params.authProfileId,
		promptCacheKey: params.promptCacheKey,
		assertCurrent: params.assertCurrent
	};
	const wrapRunApiKey = (streamFn) => wrapEmbeddedAgentStreamApiKey(streamFn, {
		providerId: params.model.provider,
		resolvedApiKey: params.resolvedApiKey,
		authStorage: params.authStorage,
		assertCurrent: params.assertCurrent
	});
	const keepStreamAuth = (streamFn) => streamFn;
	const stripCacheBoundary = (context) => context.systemPrompt ? {
		...context,
		systemPrompt: stripSystemPromptCacheBoundary(context.systemPrompt)
	} : context;
	if (params.providerStreamFn) return {
		streamFn: wrapEmbeddedAgentStreamFn(params.providerStreamFn, wrapOptions),
		strategy: "provider",
		wrapApiKey: wrapRunApiKey
	};
	const currentStreamFn = params.currentStreamFn ?? llmRuntime.streamSimple;
	if (params.model.provider === "anthropic-vertex") {
		const vertexStreamFn = createAnthropicVertexStreamFnForModel(params.model);
		return {
			streamFn: params.signal || params.assertCurrent ? wrapEmbeddedAgentStreamFn(vertexStreamFn, {
				runSignal: params.signal,
				assertCurrent: params.assertCurrent
			}) : vertexStreamFn,
			strategy: "anthropic-vertex",
			wrapApiKey: keepStreamAuth
		};
	}
	if (params.model.provider === "openai" && params.model.api === "openai-chatgpt-responses" && (isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn, llmRuntime) || getStreamLlmRuntime(params.currentStreamFn) === llmRuntime)) return {
		streamFn: wrapEmbeddedAgentStreamFn(currentStreamFn, {
			...wrapOptions,
			sessionId: params.sessionId,
			transformContext: stripCacheBoundary
		}),
		strategy: "openclaw-native-codex-responses",
		wrapApiKey: wrapRunApiKey
	};
	const isDefault = isDefaultOpenClawStreamFnForModel(params.model, params.currentStreamFn, llmRuntime);
	if (isDefault || hasNonEmptyString(params.resolvedApiKey) || params.transportAuthAvailable || params.model.api === "anthropic-messages" && params.model.provider !== "anthropic") {
		const boundaryAwareStreamFn = createBoundaryAwareStreamFnForModel(params.model);
		if (boundaryAwareStreamFn) return {
			streamFn: wrapEmbeddedAgentStreamFn(boundaryAwareStreamFn, {
				...wrapOptions,
				sessionId: params.sessionId
			}),
			strategy: `boundary-aware:${params.model.api}`,
			wrapApiKey: wrapRunApiKey
		};
	}
	const promptCacheKey = params.promptCacheKey?.trim();
	return {
		streamFn: !promptCacheKey && !params.signal && !params.assertCurrent ? currentStreamFn : wrapEmbeddedAgentStreamFn(currentStreamFn, {
			runSignal: params.signal,
			promptCacheKey,
			assertCurrent: params.assertCurrent
		}),
		strategy: isDefault ? "stream-simple" : "session-custom",
		wrapApiKey: keepStreamAuth
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
	return (m, context, options) => {
		params.assertCurrent?.();
		return inner(m, transformContext(context), mergeRunSignal(options));
	};
}
/** Resolve the run credential for each request and pass it to every inner wrapper. */
function wrapEmbeddedAgentStreamApiKey(inner, params) {
	if (!params.authStorage && !params.resolvedApiKey) return inner;
	const { authStorage, providerId, resolvedApiKey } = params;
	return async (m, context, options) => {
		params.assertCurrent?.();
		const apiKey = await resolveEmbeddedAgentApiKey({
			provider: providerId,
			resolvedApiKey,
			authStorage
		});
		params.assertCurrent?.();
		return inner(m, context, {
			...options,
			apiKey: apiKey ?? options?.apiKey
		});
	};
}
//#endregion
//#region src/llm/providers/stream-wrappers/openai-service-tier-observation.ts
const log = createSubsystemLogger("llm/providers/stream-wrappers");
/** Carry a provider echo back to the selected account's catalog observation owner. */
function createOpenAIServiceTierObservationWrapper(underlying, recordDowngrade) {
	return (model, context, options) => {
		if (model.api !== "openai-responses" || !supportsOpenAIResponsesFastMode(model)) return underlying(model, context, options);
		const observedOptions = { ...options };
		const previous = options && responsesServiceTierObserver.get(options);
		responsesServiceTierObserver.set(observedOptions, (observation) => {
			previous?.(observation);
			if (observation.requestedTier === "ultrafast" && observation.responseTier !== "ultrafast" && recordDowngrade(model)) log.info("OpenAI downgraded an Ultrafast request; the account's model route now offers Fast.");
		});
		return underlying(model, context, observedOptions);
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-lifecycle.ts
const TRACEPARENT_HEADER_NAME = "traceparent";
const TIMELINE_ATTRIBUTE_MAX_LENGTH = 256;
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
		...eventBase.agentId ? { agentId: eventBase.agentId } : {},
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
function dispatchModelCallHook(eventBase, fields) {
	const hookRunner = getGlobalHookRunner();
	const hookName = fields ? "model_call_ended" : "model_call_started";
	if (!hookRunner?.hasHooks(hookName)) return;
	const event = Object.freeze(modelCallHookEventBase(eventBase));
	const hookCtx = modelCallHookContext(eventBase);
	fireAndForgetBoundedHook(() => fields ? hookRunner.runModelCallEnded(Object.freeze({
		...event,
		...fields
	}), hookCtx) : hookRunner.runModelCallStarted(event, hookCtx), `${hookName} plugin hook failed`);
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
	if (!observer.state.suppressPluginHooks) dispatchModelCallHook(eventBase, {
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
		if (modelRequestBodyState(requestOptions).enabled) return originalOnPayload?.(payload, model);
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
	modelRequestBodyState(requestOptions).onBytes = (bytes) => {
		observer.state.requestPayloadBytes = bytes;
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
	const eventBase = {
		...modelCallHookEventBase({
			...params.ctx,
			callId
		}),
		...params.ctx.agentId ? { agentId: params.ctx.agentId } : {},
		observationUnit: "request",
		...observer.promptStats ? { promptStats: observer.promptStats } : {},
		trace
	};
	emitCoreModelRequestStartedDiagnosticEvent(eventBase, params.ctx.ownerGeneration, params.requestTimeoutMs, modelContentPrivateData(observer.modelContent));
	if (params.ctx.suppressPluginHooks !== true) dispatchModelCallHook(eventBase);
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
function jsonLength(value, utf8, promptStringLengths) {
	try {
		let stringLengths = 0;
		const serialized = JSON.stringify(value, function(key, part) {
			if (typeof part !== "string" || part.length < 4096) return part;
			const cached = !utf8 ? promptStringLengths?.previous.get(this)?.get(key) : void 0;
			let chars = cached?.text === part ? cached.chars : void 0;
			if (chars === void 0) {
				const encoded = JSON.stringify(part);
				chars = (utf8 ? Buffer.byteLength(encoded, "utf8") : encoded.length) - 2;
			}
			if (!utf8 && promptStringLengths) {
				const fields = promptStringLengths.current.get(this) ?? /* @__PURE__ */ new Map();
				fields.set(key, {
					text: part,
					chars
				});
				promptStringLengths.current.set(this, fields);
			}
			stringLengths += chars;
			return "";
		});
		return serialized === void 0 ? void 0 : stringLengths + (utf8 ? Buffer.byteLength(serialized, "utf8") : serialized.length);
	} catch {
		return;
	}
}
function responseStreamChunkByteLength(chunk) {
	try {
		if (!isRecord(chunk)) return jsonLength(chunk, true);
		const type = chunk.type;
		if ((type === "text_delta" || type === "thinking_delta" || type === "toolcall_delta") && typeof chunk.delta === "string") return Buffer.byteLength(chunk.delta, "utf8");
		if (!("partial" in chunk)) return jsonLength(chunk, true);
		const { partial: _partial, ...snapshotlessChunk } = chunk;
		return jsonLength(snapshotlessChunk, true);
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
function createModelPromptStats() {
	let previous = /* @__PURE__ */ new WeakMap();
	return (streamContext) => {
		const current = /* @__PURE__ */ new WeakMap();
		const stats = streamContextModelPromptStats(streamContext, {
			previous,
			current
		});
		previous = current;
		return stats;
	};
}
function streamContextModelPromptStats(streamContext, promptStringLengths) {
	if (!isRecord(streamContext)) return;
	const messages = Array.isArray(streamContext.messages) ? streamContext.messages : void 0;
	const tools = Array.isArray(streamContext.tools) ? streamContext.tools : void 0;
	const systemPrompt = typeof streamContext.systemPrompt === "string" ? streamContext.systemPrompt : void 0;
	const inputMessagesChars = messages ? jsonLength(messages, false, promptStringLengths) : void 0;
	const toolDefinitionsChars = tools ? jsonLength(tools, false, promptStringLengths) : void 0;
	const systemPromptChars = systemPrompt?.length;
	if (messages === void 0 && tools === void 0 && systemPrompt === void 0) return;
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
		const bytes = jsonLength(result, true);
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
function createModelObserver(params) {
	const modelContent = streamContextModelContentFields(params.contentCapture, params.streamContext);
	const promptStats = params.capturePromptStats ? (params.measurePromptStats ?? streamContextModelPromptStats)(params.streamContext) : void 0;
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
			const bytes = jsonLength(payload, true);
			if (bytes !== void 0) state.requestPayloadBytes = bytes;
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
			return {
				...state.requestPayloadBytes !== void 0 ? { requestPayloadBytes: state.requestPayloadBytes } : {},
				...state.responseStreamBytes > 0 ? { responseStreamBytes: state.responseStreamBytes } : {},
				...state.timeToFirstByteMs !== void 0 ? { timeToFirstByteMs: state.timeToFirstByteMs } : {}
			};
		},
		completedContent() {
			return state.modelContent || state.outputMessages ? {
				...state.modelContent,
				...state.outputMessages ? { outputMessages: state.outputMessages } : {}
			} : void 0;
		},
		usageField() {
			return state.usage ? { usage: state.usage } : {};
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
	await settlesWithin(Promise.resolve(returnResult).catch(() => void 0), MODEL_CALL_STREAM_RETURN_TIMEOUT_MS);
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
function createSharedResultObserver(stream, lifecycle) {
	if (!isRecord(stream) || typeof stream.result !== "function") return;
	const resultFn = stream.result;
	let cached;
	return () => {
		if (!cached) {
			cached = Promise.resolve().then(() => resultFn.call(stream)).then((resolved) => {
				lifecycle.observer.observeFinalResult(lifecycle.eventBase, lifecycle.startedAt, resolved);
				lifecycle.emitCompleted();
				return resolved;
			}, (err) => {
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
	const observedIterator = () => observeModelCallIterator(createIterator(), lifecycle, observedResult);
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
function wrapStreamFnWithDiagnosticModelCallEvents(streamFn, ctx) {
	const measurePromptStats = createModelPromptStats();
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
				capturePromptStats,
				measurePromptStats
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
export { resolveEmbeddedAgentStream as a, resolveEmbeddedAgentBaseStreamFn as i, createOpenAIServiceTierObservationWrapper as n, selectEmbeddedAgentStream as o, resolveEmbeddedAgentApiKey as r, wrapStreamFnWithDiagnosticModelCallEvents as t };

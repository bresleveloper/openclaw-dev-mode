import { l as asNonNegativeFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { J as hasInternalDiagnosticEventListeners, O as freezeDiagnosticTraceContext, S as formatPropagatedDiagnosticTraceparent, T as createDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess, w as createChildDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { n as emitDiagnosticsTimelineEvent } from "./diagnostics-timeline-BgymzmGj.mjs";
import { r as derivePromptTokens, u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { s as resolveProviderThinkingLevel } from "./thinking-BCNoGfZ5.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { f as fireAndForgetBoundedHook } from "./hooks-CU2qx9-T.mjs";
import { C as emitCoreModelRequestStartedDiagnosticEvent, S as emitCoreModelRequestEndedDiagnosticEvent, x as emitCoreSemanticRunProgressDiagnosticEvent } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { t as cloneDiagnosticContentValue } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { a as getModelCompletionTransport, i as getModelCompletionOwner, n as bindModelLlmRuntime, o as getModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { a as diagnosticProviderRequestIdHash, i as diagnosticHttpStatusCode, n as diagnosticErrorFailureKind, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-Dt79CD6m.mjs";
import { r as withModelTransportContext } from "./ai-transport-host-BOghwVNz.mjs";
import { n as completeSimple } from "./stream-NAsW_bVF.mjs";
import { t as createModelCallStreamProgressReporter } from "./diagnostic-model-stream-progress-BZzbtql4.mjs";
import { randomUUID } from "node:crypto";
import { defaultApiRegistry } from "@openclaw/ai/internal/runtime";
import { prepareHeadersForSimpleCompletion, prepareModelForSimpleCompletion, withProviderAcceptanceObserver } from "@openclaw/ai/transports";
import { modelRequestBodyState, reasoningTagTextPolicy } from "@openclaw/ai/internal/openai";
//#region src/agents/embedded-agent-runner/run/attempt.model-diagnostic-lifecycle.ts
const TRACEPARENT_HEADER_NAME = "traceparent";
const TIMELINE_ATTRIBUTE_MAX_LENGTH = 256;
function modelContentPrivateData(modelContent) {
	return modelContent ? { modelContent } : void 0;
}
function isModelOutputDelta(chunk) {
	return isRecord(chunk) && (chunk.type === "text_delta" || chunk.type === "thinking_delta" || chunk.type === "toolcall_delta") && typeof chunk.delta === "string" && chunk.delta.length > 0;
}
function boundedTimelineAttribute(value) {
	return truncateUtf16Safe(value?.trim() ?? "", TIMELINE_ATTRIBUTE_MAX_LENGTH) || void 0;
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
const modelCallContextBudget = (eventBase) => ({
	...eventBase.contextTokenBudget ? { contextTokenBudget: eventBase.contextTokenBudget } : {},
	...eventBase.contextWindowSource ? { contextWindowSource: eventBase.contextWindowSource } : {},
	...eventBase.contextWindowReferenceTokens ? { contextWindowReferenceTokens: eventBase.contextWindowReferenceTokens } : {}
});
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
		...modelCallContextBudget(eventBase)
	};
}
function dispatchModelCallHook(eventBase, fields) {
	const hookRunner = getGlobalHookRunner();
	const hookName = fields ? "model_call_ended" : "model_call_started";
	if (!hookRunner?.hasHooks(hookName)) return;
	const event = Object.freeze(modelCallHookEventBase(eventBase));
	const hookCtx = Object.freeze({
		runId: eventBase.runId,
		...eventBase.agentId ? { agentId: eventBase.agentId } : {},
		trace: eventBase.trace,
		...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
		...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
		modelProviderId: eventBase.provider,
		modelId: eventBase.model,
		...modelCallContextBudget(eventBase)
	});
	fireAndForgetBoundedHook(() => fields ? hookRunner.runModelCallEnded(Object.freeze({
		...event,
		...fields
	}), hookCtx) : hookRunner.runModelCallStarted(event, hookCtx), `${hookName} plugin hook failed`);
}
function withDiagnosticRequestContext(options, trace, observer, callId, ctx) {
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
		const observeReplacement = (replacement) => {
			observer.assignRequestPayloadBytes(replacement ?? payload);
			return replacement;
		};
		return isPromiseLike(result) ? result.then(observeReplacement) : observeReplacement(result);
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
		emitDiagnosticsTimelineEvent({
			type: "mark",
			name: "provider.request.serialized",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			runId: ctx.runId,
			spanId: callId
		}, { config: ctx.config });
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
	const transportContext = {
		sessionKey: params.ctx.sessionKey,
		runId: params.ctx.runId,
		requestId: callId
	};
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
	const startedAt = Date.now();
	emitDiagnosticsTimelineEvent({
		type: "mark",
		name: "provider.request.started",
		timestamp: new Date(startedAt).toISOString(),
		runId: eventBase.runId,
		spanId: callId
	}, { config: params.ctx.config });
	const propagatedOptions = withDiagnosticRequestContext(params.options, trace, observer, callId, params.ctx);
	function emitModelCallEnded(failure) {
		const { ownerGeneration, config } = params.ctx;
		if (observer.state.terminalEventEmitted) return;
		observer.state.terminalEventEmitted = true;
		const terminalAtMs = Date.now();
		const durationMs = terminalAtMs - startedAt;
		const providerTimingFields = observer.state.providerProcessingMs === void 0 ? {} : {
			providerProcessingMs: observer.state.providerProcessingMs,
			providerWaitEstimateMs: Math.max(0, durationMs - observer.state.providerProcessingMs)
		};
		const sizeTimingFields = observer.sizeTimingFields();
		const fields = failure ? modelCallErrorFields(failure.error) : void 0;
		const terminal = fields ? {
			type: "model.call.error",
			...fields
		} : { type: "model.call.completed" };
		const errorStatus = failure ? diagnosticHttpStatusCode(failure.error) : void 0;
		const responseStatus = observer.state.responseStatus ?? (errorStatus === void 0 ? void 0 : Number(errorStatus));
		const terminalReason = failure ? observer.state.terminalReason === "aborted" ? "aborted" : fields?.failureKind ?? "error" : observer.state.terminalReason ?? "unknown";
		const { providerAcceptanceKind } = observer.state;
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
			ok: failure === void 0,
			...responseStatus !== void 0 ? { status: responseStatus } : {},
			attributes: {
				...model ? { model } : {},
				...api ? { api } : {},
				...transport ? { transport } : {},
				terminalAtMs,
				...providerTimingFields,
				...observer.state.lastProviderActivityAtMs !== void 0 ? { lastProviderActivityAtMs: observer.state.lastProviderActivityAtMs } : {},
				terminalReason,
				providerAccepted: providerAcceptanceKind !== void 0,
				...providerAcceptanceKind ? { providerAcceptanceKind } : {}
			}
		}, { config });
		emitCoreModelRequestEndedDiagnosticEvent({
			...terminal,
			...eventBase,
			durationMs,
			...providerTimingFields,
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
	let terminalNotified = false;
	let finishedNotified = false;
	const notifyFinished = () => {
		if (!finishedNotified) {
			finishedNotified = true;
			params.ctx.onFinished?.(callId);
		}
	};
	try {
		params.ctx.onStarted?.(callId);
	} catch (error) {
		notifyFinished();
		throw error;
	}
	return {
		eventBase,
		observer,
		propagatedOptions,
		runInTransportContext(run) {
			return withModelTransportContext(transportContext, run);
		},
		startedAt,
		observeChunk(chunk) {
			observer.observeResponseChunk(startedAt, chunk);
			observer.maybeEmitStreamProgress(eventBase);
			if (params.ctx.onOutputDelta && isModelOutputDelta(chunk)) params.ctx.onOutputDelta();
		},
		emitCompleted() {
			try {
				if (!terminalNotified && (observer.state.terminalSucceeded || observer.state.terminalError)) {
					terminalNotified = true;
					params.ctx.onTerminal?.();
					if (observer.state.terminalSucceeded && !observer.state.terminalError) params.ctx.onSucceeded?.(startedAt);
				}
				emitModelCallEnded(observer.state.terminalError ? { error: observer.state.terminalError } : void 0);
			} finally {
				notifyFinished();
			}
		},
		emitError(err) {
			try {
				emitModelCallEnded({ error: err });
			} finally {
				notifyFinished();
			}
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
function observeModelCallTerminalMessage(state, value) {
	if (!isRecord(value)) return;
	let rawUsage;
	try {
		rawUsage = value.usage;
		const timing = Array.isArray(value.diagnostics) ? value.diagnostics.findLast((entry) => isRecord(entry) && entry.type === "provider_timing") : void 0;
		if (isRecord(timing) && isRecord(timing.details)) state.providerProcessingMs = asNonNegativeFiniteNumber(timing.details.processingMs);
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
	const usage = isRecord(rawUsage) ? normalizeUsage(rawUsage) : void 0;
	if (usage) {
		const promptTokens = derivePromptTokens(usage);
		state.usage = {
			...usage,
			...promptTokens !== void 0 ? { promptTokens } : {}
		};
	}
}
function observeOutputMessageContent(state, chunk) {
	if (!isRecord(chunk)) return;
	let message;
	try {
		const type = chunk.type;
		message = type === "done" ? chunk.message : type === "error" ? chunk.error : void 0;
	} catch {
		return;
	}
	if (message !== void 0) {
		observeModelCallTerminalMessage(state, message);
		if (state.contentCapture?.outputMessages) state.outputMessages = [cloneDiagnosticContentValue(message)];
	}
}
function observeModelResponse(state, startedAt, value, kind) {
	if (!state.terminalEventEmitted && (kind === "chunk" || state.terminalReason === void 0)) state.lastProviderActivityAtMs = Date.now();
	state.timeToFirstByteMs ??= Math.max(0, Date.now() - startedAt);
	if (kind === "chunk") observeOutputMessageContent(state, value);
	else {
		observeModelCallTerminalMessage(state, value);
		if (state.contentCapture?.outputMessages && state.outputMessages === void 0) state.outputMessages = [cloneDiagnosticContentValue(value)];
	}
	if (kind === "chunk" || state.responseStreamBytes === 0) {
		const bytes = kind === "chunk" ? responseStreamChunkByteLength(value) : jsonLength(value, true);
		if (bytes !== void 0) state.responseStreamBytes += bytes;
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
			observeModelResponse(state, startedAt, chunk, "chunk");
		},
		observeFinalResult(eventBase, startedAt, result) {
			observeModelResponse(state, startedAt, result, "result");
			if (!state.semanticProgressEmitted && isSemanticModelCallResult(result)) {
				state.semanticProgressEmitted = true;
				emitCoreSemanticRunProgressDiagnosticEvent({
					runId: eventBase.runId,
					...eventBase.sessionKey ? { sessionKey: eventBase.sessionKey } : {},
					...eventBase.sessionId ? { sessionId: eventBase.sessionId } : {},
					reason: MODEL_CALL_SEMANTIC_PROGRESS_REASON
				});
			}
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
//#region src/agents/simple-completion-execution.ts
/** Executes an already-prepared model without importing model/auth preparation. */
/** Keep explicit one-shot off ahead of configured local-server thinking switches.
* Native transports still own scalar effort mappings and mandatory reasoning floors.
*/
function disableConfiguredThinking(payload) {
	if (!isRecord(payload)) return;
	if ("think" in payload) payload.think = false;
	if ("enable_thinking" in payload) payload.enable_thinking = false;
	if (isRecord(payload.chat_template_kwargs) && "enable_thinking" in payload.chat_template_kwargs) payload.chat_template_kwargs = {
		...payload.chat_template_kwargs,
		enable_thinking: false
	};
}
async function completeWithPreparedSimpleCompletionModel(params) {
	const owner = getModelCompletionOwner(params.model);
	if (!owner) return await completePreparedModel(params);
	return await owner.run(() => completePreparedModel({
		...params,
		assertCurrent: () => {
			owner.assertCurrent();
			params.assertCurrent?.();
		}
	}));
}
async function completePreparedModel(params) {
	await import("./ai-transport-runtime-host-GelzpX4Y.mjs");
	params.assertCurrent?.();
	params.options?.signal?.throwIfAborted();
	const runtime = getModelLlmRuntime(params.model);
	let completionModel = getModelCompletionTransport(params.model) ?? prepareModelForSimpleCompletion({
		apiRegistry: runtime?.registry ?? defaultApiRegistry,
		model: params.model,
		cfg: params.cfg,
		auth: {
			mode: params.auth.mode,
			authFlow: params.auth.authFlow
		}
	});
	if (runtime) completionModel = bindModelLlmRuntime(completionModel, runtime);
	const { reasoning: rawReasoning, strictReasoningTags, ...options } = params.options ?? {};
	const providerReasoning = resolveProviderThinkingLevel({
		provider: params.model.provider,
		model: params.model.id,
		catalog: [params.model],
		agentRuntime: "openclaw",
		level: rawReasoning
	});
	const reasoning = providerReasoning === "adaptive" ? "medium" : providerReasoning;
	const headers = prepareHeadersForSimpleCompletion(params.model, options);
	const completionOptions = {
		...options,
		...reasoning ? { reasoning } : {},
		...rawReasoning === "off" ? { onPayload: disableConfiguredThinking } : {},
		apiKey: params.auth.apiKey,
		...headers ? { headers } : {}
	};
	if (strictReasoningTags) reasoningTagTextPolicy.markStrict(completionOptions);
	if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventListeners()) return await completeSimple(completionModel, params.context, completionOptions, params.assertCurrent);
	const callId = randomUUID();
	const lifecycle = createModelLifecycle({
		ctx: {
			config: params.cfg,
			runId: callId,
			provider: params.model.provider,
			model: params.model.id,
			api: params.model.api,
			transport: "auto",
			trace: getActiveDiagnosticTraceContext() ?? createDiagnosticTraceContext(),
			nextCallId: () => callId,
			suppressPluginHooks: true
		},
		options: completionOptions,
		createObserver: (capturePromptStats) => createModelObserver({
			config: params.cfg,
			streamContext: params.context,
			capturePromptStats,
			suppressPluginHooks: true
		})
	});
	try {
		if (strictReasoningTags) reasoningTagTextPolicy.markStrict(lifecycle.propagatedOptions);
		const result = await completeSimple(completionModel, params.context, lifecycle.propagatedOptions, params.assertCurrent);
		lifecycle.observer.observeFinalResult(lifecycle.eventBase, lifecycle.startedAt, result);
		lifecycle.emitCompleted();
		return result;
	} catch (error) {
		lifecycle.emitError(error);
		throw error;
	}
}
//#endregion
export { createModelLifecycle as i, createModelObserver as n, createModelPromptStats as r, completeWithPreparedSimpleCompletionModel as t };

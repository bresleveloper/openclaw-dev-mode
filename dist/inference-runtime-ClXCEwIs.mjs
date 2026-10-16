import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { E as createDiagnosticTraceContextFromActiveScope, O as freezeDiagnosticTraceContext, p as isDiagnosticsEnabled, s as emitTrustedDiagnosticEvent } from "./diagnostic-events-BADdmgZf.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { l as getAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { o as emitAgentEventForRunContext } from "./agent-events-GvNTkbe3.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { a as resolveProviderModelRoutes } from "./provider-model-routes-BXIDiDZZ.mjs";
import { v as resolveModelRefFromString } from "./model-selection-shared-BZeDVoch.mjs";
import { a as projectProviderModelRouteConfig } from "./provider-model-route-BpciAISP.mjs";
import { a as resolveModelCatalogIdentityKey } from "./openai-model-routes-mS12tkxj.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BJNC949_.mjs";
import { o as getModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-B8unFFC9.mjs";
import { a as loadSessionEntry } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { g as sanitizeOpenAIReasoningSignature } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { d as toDiagnosticUsage, s as hasObservedModelUsage, u as normalizeUsage } from "./usage-XmAH1cfG.mjs";
import { r as estimateUsageCost, s as resolveModelCostConfig } from "./usage-format-CmKsaFRe.mjs";
import { l as resolveFastModeForElapsed } from "./fast-mode-smSVCJXN.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { r as formatWorkerInferenceError, t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { m as readWorkerTurnPromptCacheContext } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { r as prepareSimpleCompletionModel } from "./simple-completion-runtime-CbAcEdye.mjs";
import { t as resolveFastModeState } from "./fast-mode-CdiysUl0.mjs";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-C9Xz8Ynt.mjs";
import { t as applyExtraParamsToAgent } from "./extra-params-5jpvSgck.mjs";
import { t as mapThinkingLevel } from "./utils-CEEdg_Og.mjs";
import { a as resolveEmbeddedAgentStream, n as createOpenAIServiceTierObservationWrapper, t as wrapStreamFnWithDiagnosticModelCallEvents } from "./attempt.model-diagnostic-events-zQF-SBUN.mjs";
import { t as registerProviderStreamForModel } from "./provider-stream-DJmBhZaS.mjs";
import { t as resolveSessionBoundaryPromptCacheKey } from "./session-boundary-prompt-cache-key-Qws1--Tf.mjs";
import { a as projectWorkerAssistantContent, r as projectWorkerProviderReplay, s as projectWorkerTokenUsage, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-Dz1c-AeG.mjs";
import { n as resolveSessionAuthSelection } from "./session-override-DejkSWrh.mjs";
import { isDeepStrictEqual } from "node:util";
import { normalizeCodexResponsesBaseUrlForOpenAISdk } from "@openclaw/ai/transports";
//#region src/gateway/worker-environments/inference-terminal-message.ts
const ERROR_MESSAGES = {
	"model-not-approved": "Model is not approved for this agent.",
	"invalid-context": "Inference context is invalid.",
	"epoch-mismatch": "Worker run epoch does not match.",
	"session-not-attached": "Worker session is not attached.",
	"provider-error": "Model provider request failed.",
	cancelled: "Inference request was cancelled."
};
function inferenceError(reason, usage, message = ERROR_MESSAGES[reason]) {
	return {
		type: "error",
		reason,
		message,
		...usage ? { usage: structuredClone(usage) } : {}
	};
}
function projectWorkerInferenceTerminalMessage(params) {
	const usage = params.message.usage;
	const projected = {
		role: "assistant",
		content: params.message.content.map((part) => {
			if (part.type !== "text" && part.type !== "thinking" && part.type !== "toolCall") throw new Error("Unsupported assistant terminal content");
			const content = projectWorkerAssistantContent(part);
			if (content.type === "thinking" && content.thinkingSignature) content.thinkingSignature = sanitizeOpenAIReasoningSignature(content.thinkingSignature, params.modelIdentity) ?? content.thinkingSignature;
			return content;
		}),
		api: params.modelIdentity.api,
		provider: params.modelIdentity.provider,
		model: params.modelIdentity.model,
		...params.message.responseModel ? { responseModel: params.message.responseModel } : {},
		...params.message.responseId ? { responseId: params.message.responseId } : {},
		usage: {
			...projectWorkerTokenUsage(usage),
			...usage.contextUsage?.state === "available" ? { contextUsage: {
				state: usage.contextUsage.state,
				promptTokens: usage.contextUsage.promptTokens,
				totalTokens: usage.contextUsage.totalTokens
			} } : usage.contextUsage?.state === "unavailable" ? { contextUsage: { state: usage.contextUsage.state } } : {}
		},
		stopReason: params.stopReason,
		timestamp: params.message.timestamp
	};
	return projectWorkerProviderReplay({
		message: projected,
		providerReplay: params.message.providerReplay,
		purpose: "transcript"
	});
}
//#endregion
//#region src/gateway/worker-environments/inference-tool-call-stream.ts
const MAX_PENDING_TOOL_DELTA_BYTES = 1048576;
const MAX_PENDING_TOOL_DELTAS = 4096;
const MAX_STREAMED_TOOL_DELTAS = 65536;
const RETAINED_TOOL_ARGUMENT_CHUNK_BYTES = 16384;
function createWorkerToolCallStream(params) {
	const pendingDeltas = /* @__PURE__ */ new Map();
	let pendingDeltaBytes = 0;
	let pendingDeltaCount = 0;
	const ended = /* @__PURE__ */ new Set();
	const identities = /* @__PURE__ */ new Map();
	const emittedArgumentChunks = /* @__PURE__ */ new Map();
	let retainedArgumentBytes = 0;
	let streamedDeltaCount = 0;
	const emitDelta = (contentIndex, delta) => {
		if (!params.isCurrent()) return "cancelled";
		if (streamedDeltaCount + 1 > MAX_STREAMED_TOOL_DELTAS) return "invalid";
		streamedDeltaCount += 1;
		const deltaBytes = Buffer.byteLength(delta, "utf8");
		if (deltaBytes === 0) return params.isCurrent() ? "ok" : "cancelled";
		if (retainedArgumentBytes + deltaBytes > MAX_PENDING_TOOL_DELTA_BYTES) return "invalid";
		params.emit({
			type: "toolcall_delta",
			contentIndex,
			delta
		});
		const emitted = emittedArgumentChunks.get(contentIndex) ?? [];
		const last = emitted.at(-1);
		if (last && last.bytes + deltaBytes <= RETAINED_TOOL_ARGUMENT_CHUNK_BYTES) {
			last.text += delta;
			last.bytes += deltaBytes;
		} else emitted.push({
			text: delta,
			bytes: deltaBytes
		});
		emittedArgumentChunks.set(contentIndex, emitted);
		retainedArgumentBytes += deltaBytes;
		return params.isCurrent() ? "ok" : "cancelled";
	};
	const start = (contentIndex, partial) => {
		if (identities.has(contentIndex)) return params.isCurrent() ? "ok" : "cancelled";
		const content = partial.content[contentIndex];
		if (content?.type !== "toolCall" || !content.id || !content.name) return "invalid";
		if (!params.isCurrent()) return "cancelled";
		identities.set(contentIndex, {
			id: content.id,
			name: content.name
		});
		params.emit({
			type: "toolcall_start",
			contentIndex,
			id: content.id,
			toolName: content.name
		});
		if (!params.isCurrent()) return "cancelled";
		for (const delta of pendingDeltas.get(contentIndex) ?? []) {
			const result = emitDelta(contentIndex, delta);
			pendingDeltaBytes -= Buffer.byteLength(delta, "utf8");
			pendingDeltaCount -= 1;
			if (result !== "ok") return result;
		}
		pendingDeltas.delete(contentIndex);
		return "ok";
	};
	const delta = (contentIndex, value, partial) => {
		if (ended.has(contentIndex)) return "invalid";
		if (identities.has(contentIndex)) return emitDelta(contentIndex, value);
		const pending = pendingDeltas.get(contentIndex) ?? [];
		pendingDeltaBytes += Buffer.byteLength(value, "utf8");
		pendingDeltaCount += 1;
		if (pendingDeltaBytes > MAX_PENDING_TOOL_DELTA_BYTES || pendingDeltaCount > MAX_PENDING_TOOL_DELTAS) return "invalid";
		pending.push(value);
		pendingDeltas.set(contentIndex, pending);
		const result = start(contentIndex, partial);
		return result === "invalid" ? "ok" : result;
	};
	const reconcile = (contentIndex, complete) => {
		const identity = identities.get(contentIndex);
		if (!identity || identity.id !== complete.id || identity.name !== complete.name) return "invalid";
		const emittedJson = (emittedArgumentChunks.get(contentIndex) ?? []).map((chunk) => chunk.text).join("");
		if (!emittedJson) try {
			const completeJson = JSON.stringify(complete.arguments);
			return typeof completeJson === "string" ? emitDelta(contentIndex, completeJson) : "invalid";
		} catch {
			return "invalid";
		}
		try {
			return isDeepStrictEqual(JSON.parse(emittedJson), complete.arguments) ? params.isCurrent() ? "ok" : "cancelled" : "invalid";
		} catch {
			return "invalid";
		}
	};
	const end = (contentIndex, partial, complete) => {
		if (ended.has(contentIndex)) return reconcile(contentIndex, complete);
		const startResult = start(contentIndex, partial);
		if (startResult !== "ok") return startResult;
		const reconcileResult = reconcile(contentIndex, complete);
		if (reconcileResult !== "ok") return reconcileResult;
		ended.add(contentIndex);
		params.emit({
			type: "toolcall_end",
			contentIndex
		});
		return params.isCurrent() ? "ok" : "cancelled";
	};
	return {
		delta,
		end,
		matchesTerminal: (message) => {
			const terminal = new Set(message.content.flatMap((content, contentIndex) => content.type === "toolCall" ? [contentIndex] : []));
			return pendingDeltas.size === 0 && terminal.size === identities.size && [...identities.keys()].every((contentIndex) => terminal.has(contentIndex) && ended.has(contentIndex));
		},
		start
	};
}
//#endregion
//#region src/gateway/worker-environments/inference-runtime.ts
function buildContext(context) {
	const tools = [];
	for (const tool of context.tools ?? []) {
		if (!isRecord(tool.parameters) || tool.parameters.type !== "object") return;
		tools.push({
			name: tool.name,
			description: tool.description,
			parameters: structuredClone(tool.parameters)
		});
	}
	return {
		...context.systemPrompt !== void 0 ? { systemPrompt: context.systemPrompt } : {},
		messages: structuredClone(context.messages),
		...tools.length > 0 ? { tools } : {}
	};
}
function toWorkerStreamEvent(event, modelIdentity) {
	switch (event.type) {
		case "start": return {
			type: "start",
			resolvedModel: {
				api: modelIdentity.api,
				provider: modelIdentity.provider,
				model: modelIdentity.model
			},
			timestamp: event.partial.timestamp
		};
		case "text_start":
		case "text_end":
		case "thinking_end": {
			const content = event.partial.content[event.contentIndex];
			const signature = event.type === "thinking_end" ? content?.type === "thinking" && content.thinkingSignature : content?.type === "text" && content.textSignature;
			return {
				type: event.type,
				contentIndex: event.contentIndex,
				...signature ? { contentSignature: signature } : {}
			};
		}
		case "thinking_start": return {
			type: "thinking_start",
			contentIndex: event.contentIndex
		};
		case "text_delta":
		case "thinking_delta": return {
			type: event.type,
			contentIndex: event.contentIndex,
			delta: event.delta
		};
		case "toolcall_start":
		case "toolcall_delta":
		case "toolcall_end":
		case "done":
		case "error": return;
	}
}
function emitWorkerInferenceUsage(params) {
	if (!isDiagnosticsEnabled(params.config)) return;
	const usage = normalizeUsage(params.usage);
	if (!hasObservedModelUsage(usage)) return;
	const costUsd = usage.cost?.total ?? estimateUsageCost({
		usage,
		cost: resolveModelCostConfig({
			provider: params.model.provider,
			model: params.model.id,
			config: params.config
		})
	});
	emitTrustedDiagnosticEvent({
		type: "model.usage",
		trace: freezeDiagnosticTraceContext(params.trace),
		sessionKey: params.target.sessionKey,
		sessionId: params.request.sessionId,
		channel: "worker",
		agentId: params.target.agentId,
		provider: params.model.provider,
		model: params.model.id,
		usage: toDiagnosticUsage(usage),
		context: {
			limit: params.model.contextTokens ?? params.model.contextWindow,
			...usage.contextUsage?.state === "available" ? { used: usage.contextUsage.promptTokens } : {}
		},
		...costUsd !== void 0 ? { costUsd } : {},
		durationMs: params.durationMs
	});
}
async function resolveApprovedModel(params) {
	const { target, request, signal, runtimeSnapshot } = params;
	return await withPluginRuntimeGenerationScope(runtimeSnapshot, async () => {
		const lifecycleConfig = runtimeSnapshot.config;
		const agentDir = runtimeSnapshot.agentDir;
		const workspaceDir = runtimeSnapshot.workspaceDir ?? resolveAgentWorkspaceDir(lifecycleConfig, target.agentId);
		const selection = {
			cfg: lifecycleConfig,
			agentId: target.agentId,
			manifestPlugins: runtimeSnapshot.metadataSnapshot,
			...RUNTIME_MODEL_VISIBILITY_NORMALIZATION
		};
		const defaultModel = resolveDefaultModelForAgent(selection);
		const policy = createModelVisibilityPolicy({
			...selection,
			catalog: runtimeSnapshot.modelCatalog.entries,
			defaultProvider: defaultModel.provider,
			defaultModel
		});
		const resolved = resolveModelRefFromString({
			...selection,
			raw: `${request.modelRef.provider}/${request.modelRef.model}`,
			defaultProvider: defaultModel.provider,
			aliasIndex: policy.selectionAliasIndex
		});
		if (!resolved || normalizeProviderId(resolved.ref.provider) !== normalizeProviderId(request.modelRef.provider)) return;
		const resolvedKey = resolveModelCatalogIdentityKey({
			provider: resolved.ref.provider,
			id: resolved.ref.model
		});
		if (!(policy.allowedCatalog.some((entry) => resolvedKey === resolveModelCatalogIdentityKey(entry)) || policy.retainedKeys.has(resolvedKey)) || !policy.allows(resolved.ref)) return;
		const harnessPolicy = resolveAgentHarnessPolicy({
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			config: lifecycleConfig,
			agentId: target.agentId,
			sessionKey: target.sessionKey
		});
		const agentRuntimeId = harnessPolicy.runtimeSource !== "implicit" || lifecycleConfig.plugins?.entries?.codex?.enabled === true ? harnessPolicy.runtime : void 0;
		const sessionSelection = await resolveSessionAuthSelection({
			cfg: lifecycleConfig,
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			agentId: target.agentId,
			harnessRuntime: harnessPolicy.runtime,
			agentDir,
			sessionEntry: target.sessionEntry,
			sessionStore: { [target.sessionKey]: target.sessionEntry },
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			assertCommitAllowed: params.assertCurrent,
			isNewSession: false
		});
		const selectedProfileId = sessionSelection?.profileId;
		const routeRequirement = sessionSelection?.routeRequirement;
		let modelConfig = lifecycleConfig;
		const routeResolution = routeRequirement ? resolveProviderModelRoutes({
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			config: lifecycleConfig
		}) : void 0;
		const route = routeResolution?.kind === "routes" ? routeResolution.routes.find((candidate) => candidate.authRequirement === routeRequirement) : void 0;
		if (route) modelConfig = projectProviderModelRouteConfig({
			provider: resolved.ref.provider,
			config: lifecycleConfig,
			route
		});
		const prepared = await prepareSimpleCompletionModel({
			cfg: modelConfig,
			transport: "provider-stream",
			agentId: target.agentId,
			provider: resolved.ref.provider,
			modelId: resolved.ref.model,
			agentDir,
			modelIdSource: "selected",
			...selectedProfileId ? {
				profileId: selectedProfileId,
				preferredProfile: selectedProfileId,
				bindAuthOwner: true
			} : {},
			allowMissingApiKeyModes: ["aws-sdk"],
			allowBundledStaticCatalogFallback: true,
			signal,
			preparedModelRuntime: runtimeSnapshot,
			workspaceDir,
			...agentRuntimeId ? { agentRuntimeId } : {}
		});
		return {
			provider: resolved.ref.provider,
			model: resolved.ref.model,
			config: lifecycleConfig,
			agentDir,
			workspaceDir,
			prepared
		};
	});
}
const executeWorkerInference = async (params) => {
	try {
		var _usingCtx$1 = _usingCtx();
		const { identity, request, signal } = params;
		if (identity.sessionId !== request.sessionId) return inferenceError("session-not-attached");
		if (identity.ownerEpoch !== request.runEpoch) return inferenceError("epoch-mismatch");
		if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
		const promptCacheContext = readWorkerTurnPromptCacheContext(identity);
		if (!promptCacheContext) return inferenceError("session-not-attached");
		const config = params.config ?? getRuntimeConfig();
		const sessionEntry = loadSessionEntry(params.sessionTarget);
		if (sessionEntry?.sessionId !== request.sessionId) return inferenceError("session-not-attached");
		const target = {
			...params.sessionTarget,
			sessionEntry
		};
		const runContext = getAgentRunContext(request.runId);
		const context = buildContext(request.context);
		if (!context) return inferenceError("invalid-context");
		if (splitTrailingAuthProfile(`${request.modelRef.provider}/${request.modelRef.model}`).profile) return inferenceError("model-not-approved");
		const runtimeLease = _usingCtx$1.a(await acquireAgentRunPreparedModelRuntime({
			config,
			agentId: target.agentId,
			agentDir: resolveAgentDir(config, target.agentId)
		}));
		const approved = await resolveApprovedModel({
			target,
			request,
			signal,
			runtimeSnapshot: runtimeLease.snapshot,
			assertCurrent: () => {
				signal.throwIfAborted();
				if (!params.isCurrent()) throw new Error("Worker inference source is no longer current");
			}
		});
		if (!approved) return inferenceError("model-not-approved");
		return await withPluginRuntimeGenerationScope(runtimeLease.snapshot, async () => {
			if ("error" in approved.prepared) return inferenceError("provider-error", void 0, boundedWorkerError(approved.prepared.error, 256));
			const prepared = approved.prepared;
			const modelIdentity = {
				api: prepared.model.api,
				provider: approved.provider,
				model: approved.model
			};
			const logicalModel = prepared.model;
			const llmRuntime = getModelLlmRuntime(logicalModel);
			if (!llmRuntime) throw new Error("Prepared worker model has no lifecycle runtime owner");
			const providerModel = logicalModel.provider === "openai" && logicalModel.api === "openai-chatgpt-responses" ? {
				...logicalModel,
				baseUrl: normalizeCodexResponsesBaseUrlForOpenAISdk(logicalModel.baseUrl)
			} : logicalModel;
			const providerStream = registerProviderStreamForModel({
				model: providerModel,
				cfg: approved.config,
				agentDir: approved.agentDir,
				workspaceDir: approved.workspaceDir
			});
			const authValue = prepared.auth.apiKey;
			const streamAgent = resolveEmbeddedAgentStream({
				llmRuntime,
				currentStreamFn: llmRuntime.streamSimple,
				...providerStream ? { providerStreamFn: providerStream } : {},
				sessionId: request.sessionId,
				signal,
				model: providerModel,
				resolvedApiKey: authValue,
				authProfileId: prepared.auth.profileId
			});
			const streamPolicyOptions = {
				...request.options.temperature !== void 0 ? { temperature: request.options.temperature } : {},
				...request.options.maxTokens !== void 0 ? { maxTokens: request.options.maxTokens } : {},
				...request.options.reasoning !== void 0 ? { reasoning: request.options.reasoning } : {},
				...request.options.thinkingBudgets ? { thinkingBudgets: { ...request.options.thinkingBudgets } } : {}
			};
			const fastMode = resolveFastModeState({
				cfg: approved.config,
				provider: approved.provider,
				model: approved.model,
				agentId: target.agentId,
				sessionEntry: target.sessionEntry
			});
			const fastModeSetting = promptCacheContext.fastMode ?? fastMode.mode;
			const fastModeStartedAtMs = promptCacheContext.fastModeStartedAtMs ?? runContext?.lifecycleStartedAt ?? runContext?.registeredAt ?? Date.now();
			applyExtraParamsToAgent(streamAgent, approved.config, approved.provider, approved.model, {
				...structuredClone(streamPolicyOptions),
				fastMode: fastModeSetting === "auto" ? () => resolveFastModeForElapsed({
					mode: "auto",
					startedAtMs: fastModeStartedAtMs,
					fastAutoOnSeconds: promptCacheContext.fastModeAutoOnSeconds ?? fastMode.fastAutoOnSeconds
				}).enabled : fastModeSetting
			}, streamPolicyOptions.reasoning, target.agentId, approved.workspaceDir, providerModel, approved.agentDir);
			const recordServiceTierObservation = prepared.recordServiceTierObservation;
			const scopedStream = recordServiceTierObservation ? createOpenAIServiceTierObservationWrapper(streamAgent.streamFn, (model) => !signal.aborted && params.isCurrent() && recordServiceTierObservation({
				modelId: model.id,
				runtimeId: "openclaw",
				api: model.api,
				baseUrl: model.baseUrl,
				serviceTiers: ["priority"]
			})) : streamAgent.streamFn;
			const model = providerModel;
			if ([request.options.maxTokens, ...Object.values(request.options.thinkingBudgets ?? {})].some((budget) => budget !== void 0 && budget > model.maxTokens)) return inferenceError("invalid-context");
			if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
			const startedAt = Date.now();
			const trace = createDiagnosticTraceContextFromActiveScope();
			let modelCallSeq = 0;
			const stream = wrapStreamFnWithDiagnosticModelCallEvents(scopedStream, {
				config: approved.config,
				runId: request.runId,
				sessionKey: target.sessionKey,
				sessionId: request.sessionId,
				provider: model.provider,
				model: model.id,
				api: model.api,
				contextTokenBudget: model.contextTokens ?? model.contextWindow,
				trace,
				contentCapture: resolveDiagnosticModelContentCapturePolicy(approved.config),
				nextCallId: () => `${request.runId}:${request.turnId}:worker-model:${modelCallSeq += 1}`
			});
			const recordUsage = (usage) => {
				emitWorkerInferenceUsage({
					config: approved.config,
					target,
					request,
					model,
					usage,
					durationMs: Math.max(0, Date.now() - startedAt),
					trace
				});
			};
			const executionIsCurrent = () => !signal.aborted && params.isCurrent();
			const toolCalls = createWorkerToolCallStream({
				emit: params.emit,
				isCurrent: executionIsCurrent
			});
			const providerAbort = new AbortController();
			const providerSignal = AbortSignal.any([signal, providerAbort.signal]);
			let currentMessage;
			let publishedModel;
			const { reasoning, ...streamOptions } = streamPolicyOptions;
			try {
				const events = await stream(model, context, {
					...streamOptions,
					...reasoning !== void 0 ? { reasoning: mapThinkingLevel(reasoning) } : {},
					signal: providerSignal,
					sessionId: request.sessionId,
					...authValue ? { apiKey: authValue } : {},
					promptCacheKey: resolveSessionBoundaryPromptCacheKey({
						...promptCacheContext,
						api: model.api,
						sessionId: request.sessionId
					})
				});
				for await (const event of events) {
					if (event.type !== "error") {
						currentMessage = event.type === "done" ? event.message : event.partial ?? currentMessage;
						const executingModel = currentMessage?.responseModel ?? modelIdentity.model;
						if (currentMessage && executingModel !== publishedModel && runContext?.sessionId === request.sessionId && runContext.sessionKey === target.sessionKey && (runContext.agentId === void 0 || runContext.agentId === target.agentId) && executionIsCurrent()) {
							emitAgentEventForRunContext({
								runId: request.runId,
								stream: "lifecycle",
								data: {
									phase: "model",
									provider: modelIdentity.provider,
									model: executingModel
								}
							}, runContext);
							publishedModel = executingModel;
						}
					}
					if (event.type === "done") {
						recordUsage(event.message.usage);
						if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled", event.message.usage);
						for (const [contentIndex, content] of event.message.content.entries()) if (content.type === "toolCall") {
							const endResult = toolCalls.end(contentIndex, event.message, content);
							if (endResult === "cancelled") return inferenceError("cancelled", event.message.usage);
							if (endResult === "invalid") return inferenceError("provider-error");
						}
						if (!toolCalls.matchesTerminal(event.message)) return inferenceError("provider-error");
						const terminal = projectWorkerInferenceTerminalMessage({
							message: event.message,
							modelIdentity,
							stopReason: event.reason
						});
						if (terminal.kind === "provider-replay-unavailable") {
							if (isDiagnosticsEnabled(approved.config)) {
								const { bytes, limitBytes, reason } = terminal.details;
								emitTrustedDiagnosticEvent({
									type: "payload.large",
									surface: "worker.provider-replay",
									action: "rejected",
									bytes,
									limitBytes,
									reason,
									trace: freezeDiagnosticTraceContext(trace)
								});
							}
							return inferenceError("provider-error", event.message.usage, WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
						}
						return {
							type: "done",
							message: terminal.message
						};
					}
					if (event.type === "error") {
						recordUsage(event.error.usage);
						return inferenceError(event.reason === "aborted" ? "cancelled" : "provider-error", event.error.usage, event.reason === "aborted" ? void 0 : formatWorkerInferenceError({
							message: event.error.errorMessage ?? ERROR_MESSAGES["provider-error"],
							errorCode: event.error.errorCode,
							errorType: event.error.errorType,
							errorBody: event.error.errorBody
						}));
					}
					if (signal.aborted || !params.isCurrent()) return inferenceError("cancelled");
					if (event.type === "toolcall_start") {
						if (toolCalls.start(event.contentIndex, event.partial) === "cancelled") return inferenceError("cancelled");
						continue;
					}
					if (event.type === "toolcall_delta" || event.type === "toolcall_end") {
						const result = event.type === "toolcall_delta" ? toolCalls.delta(event.contentIndex, event.delta, event.partial) : toolCalls.end(event.contentIndex, event.partial, event.toolCall);
						if (result === "cancelled") return inferenceError("cancelled");
						if (result === "invalid") return inferenceError("provider-error");
						continue;
					}
					const workerEvent = toWorkerStreamEvent(event, modelIdentity);
					if (workerEvent) params.emit(workerEvent);
				}
				return inferenceError(signal.aborted ? "cancelled" : "provider-error");
			} catch (error) {
				return inferenceError(signal.aborted ? "cancelled" : "provider-error", void 0, signal.aborted ? void 0 : formatWorkerInferenceError(error));
			} finally {
				providerAbort.abort();
			}
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
};
//#endregion
export { executeWorkerInference };

import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { Vt as projectChatErrorDetail } from "./sessions-DJqMAtE3.mjs";
import { n as renderUserFacingText } from "./user-facing-text-DC1sCo4O.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-XmAH1cfG.mjs";
import { t as classifyFailoverReason } from "./classify-DEnvBJey.mjs";
import { n as buildTextObservationFields, t as buildApiErrorObservationFields } from "./embedded-agent-error-observation-D8TK8XI-.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import "./runtime-context-prompt-CKrto4c6.mjs";
import "./projection-tool-output-CKQ4iWL2.mjs";
import path from "node:path";
//#region src/agents/harness/attempt-deadlines.ts
/** Tracks execution and local settlement against their original absolute deadlines. */
function createAgentHarnessAttemptDeadlineController(params) {
	let deadline = { kind: "closed" };
	let timer;
	const armDeadline = (next) => {
		clearTimeout(timer);
		deadline = next;
		const deadlineAtMs = next.startedAtMs + next.timeoutMs;
		params.onDeadlineChanged?.({
			kind: "bounded",
			deadlineAtMs
		});
		timer = setTimeout(() => {
			if (deadline !== next || params.signal.aborted) return;
			deadline = { kind: "closed" };
			params.onTimeout({
				kind: next.kind,
				elapsedMs: Math.max(0, Date.now() - next.startedAtMs),
				timeoutMs: next.timeoutMs
			});
		}, resolveTimerTimeoutMs(Math.max(1, deadlineAtMs - Date.now()), 1));
		timer.unref?.();
	};
	const dispose = () => {
		deadline = { kind: "closed" };
		clearTimeout(timer);
		params.signal.removeEventListener("abort", dispose);
	};
	if (!params.signal.aborted) {
		params.signal.addEventListener("abort", dispose, { once: true });
		if (params.timeoutMs >= 2147e6) {
			deadline = { kind: "unlimited" };
			params.onDeadlineChanged?.({ kind: "unlimited" });
		} else armDeadline({
			kind: "execution",
			startedAtMs: params.startedAtMs,
			timeoutMs: params.timeoutMs
		});
	}
	return {
		ownsExecutionWait: () => deadline.kind === "unlimited" || deadline.kind === "execution" && Date.now() < deadline.startedAtMs + deadline.timeoutMs,
		beginSettlement: (startedAtMs) => {
			if (deadline.kind === "closed" || deadline.kind === "settlement") return;
			armDeadline({
				kind: "settlement",
				startedAtMs,
				timeoutMs: params.settlementTimeoutMs
			});
		},
		dispose
	};
}
//#endregion
//#region src/agents/harness/attempt-cancellation.ts
/** Own cancellation admission without interpreting a backend's native stop receipt. */
function createAgentHarnessAttemptCancellation(params) {
	const controller = new AbortController();
	let attemptAbortNotified = false;
	const notifyAttemptAbort = () => {
		if (attemptAbortNotified) return;
		attemptAbortNotified = true;
		params.onAttemptAbort?.();
	};
	const abortExplicitly = (reason) => {
		if (params.state.terminalOutcomeFrozen) {
			if (params.state.sharedAbortAllowedAfterTerminalOutcome) notifyAttemptAbort();
			return;
		}
		notifyAttemptAbort();
		params.state.explicitCancellationObserved = true;
		params.state.explicitCancellationReason ??= reason;
		controller.abort(reason);
	};
	const abortFromUpstream = () => {
		abortExplicitly(params.upstreamSignal?.reason ?? "upstream_abort");
	};
	const dispose = () => {
		params.upstreamSignal?.removeEventListener("abort", abortFromUpstream);
	};
	const freezeTerminalOutcome = () => {
		if (params.state.terminalOutcomeFrozen) return;
		params.state.terminalOutcomeFrozen = true;
		dispose();
	};
	if (params.upstreamSignal?.aborted) abortFromUpstream();
	else params.upstreamSignal?.addEventListener("abort", abortFromUpstream, { once: true });
	return {
		controller,
		abortExplicitly,
		freezeTerminalOutcome,
		dispose
	};
}
//#endregion
//#region src/agents/harness/attempt-events.ts
/** Observer failures cannot interrupt the authoritative native attempt. */
async function emitAgentHarnessAttemptEvent(attempt, event, diagnostics) {
	try {
		emitAgentEvent({
			runId: attempt.runId,
			stream: event.stream,
			data: event.data,
			...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {}
		});
	} catch (error) {
		diagnostics.log.debug(`${diagnostics.label} global agent event emit failed`, { error });
	}
	try {
		await attempt.onAgentEvent?.(event);
	} catch (error) {
		diagnostics.log.debug(`${diagnostics.label} agent event handler threw`, { error });
	}
}
/** Share event bookkeeping while the backend decides whether a native handoff suppresses it. */
function createAgentHarnessAttemptLifecycle(params) {
	const emitLifecycleStart = (model) => {
		params.emitEvent({
			stream: "lifecycle",
			data: {
				phase: "start",
				startedAt: params.startedAtMs
			}
		});
		params.emitEvent({
			stream: "lifecycle",
			data: {
				phase: "model",
				...model
			}
		});
		params.state.lifecycleStarted = true;
	};
	const emitLifecycleTerminal = (data) => {
		if (!params.state.lifecycleStarted || params.state.lifecycleTerminalEmitted || params.shouldSuppressTerminal?.()) return;
		let terminalData = data;
		if (data.error) {
			const { provider, modelId: model } = params.attempt;
			const rawError = formatErrorMessage(data.error);
			const observed = buildApiErrorObservationFields(rawError, { provider });
			terminalData = {
				...terminalData,
				error: buildTextObservationFields(renderUserFacingText(rawError, { errorContext: true }), { provider }).textPreview,
				errorObservation: projectChatErrorDetail({
					...observed,
					provider,
					model,
					failoverReason: classifyFailoverReason(rawError, { provider }),
					httpStatus: observed.httpCode ? Number(observed.httpCode) : void 0
				})
			};
		}
		params.emitEvent({
			stream: "lifecycle",
			data: {
				startedAt: params.startedAtMs,
				endedAt: Date.now(),
				...terminalData,
				...params.attempt.deferTerminalLifecycle ? { phase: "finishing" } : {}
			}
		});
		params.state.lifecycleTerminalEmitted = true;
	};
	const executionPhaseKeys = /* @__PURE__ */ new Set();
	const emitExecutionPhaseOnce = (key, info) => {
		if (executionPhaseKeys.has(key)) return;
		executionPhaseKeys.add(key);
		params.attempt.onExecutionPhase?.({
			provider: params.attempt.provider,
			model: params.attempt.modelId,
			backend: params.backend,
			...info
		});
	};
	return {
		emitLifecycleStart,
		emitLifecycleTerminal,
		emitExecutionPhaseOnce
	};
}
//#endregion
//#region src/agents/harness/reasoning-effort.ts
/** Preserve a supported effort, otherwise prefer the next higher effort. */
function selectSupportedReasoningEffort(params) {
	const declared = new Set(params.supportedEfforts);
	const supported = params.effortOrder.filter((effort) => declared.has(effort));
	if (supported.includes(params.requested)) return params.requested;
	const requestedRank = params.effortOrder.indexOf(params.requested);
	return supported.find((effort) => params.effortOrder.indexOf(effort) >= requestedRank) ?? supported.at(-1);
}
//#endregion
//#region src/agents/harness/prompt-context.ts
/** Bound transcript reads to the model budget while preserving complete messages. */
function resolveAgentHarnessHistoryLimits(contextTokenBudget) {
	return {
		maxBytes: Math.min(67108864, Math.max(1024, Math.floor((contextTokenBudget ?? 128e3) * 8))),
		maxEvents: 1e4,
		toolResultOverflow: "omit"
	};
}
function shouldIncludeAgentHarnessRuntimeContext(params) {
	return !(params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron");
}
/** The backend selects the prompt workspace and supplies its admitted tool names. */
function resolveAgentWorkspaceMemoryRouting(params) {
	const memoryToolNames = ["memory_search", "memory_get"].filter((name) => params.toolNames.has(name));
	return {
		memoryToolNames,
		memoryToolRouted: memoryToolNames.length > 0 && params.config !== void 0 && params.agentId !== void 0 && path.resolve(resolveAgentWorkspaceDir(params.config, params.agentId)) === path.resolve(params.workspaceDir)
	};
}
//#endregion
//#region src/agents/harness/projection-messages.ts
function createAgentHarnessAssistantMessage(attribution, text, options) {
	return {
		role: "assistant",
		content: options.content ?? [{
			type: "text",
			text
		}],
		api: attribution.api,
		provider: attribution.provider,
		model: attribution.modelId,
		usage: createAgentHarnessMessageUsage(options.tokenUsage),
		stopReason: options.aborted ? "aborted" : options.promptError || options.errorMessage ? "error" : "stop",
		errorMessage: options.errorMessage ?? (options.promptError ? formatErrorMessage(options.promptError) : void 0),
		...options.diagnostics ? { diagnostics: options.diagnostics } : {},
		timestamp: options.timestamp ?? Date.now()
	};
}
function createAgentHarnessToolCallMessage(attribution, input, timestamp) {
	return {
		role: "assistant",
		content: [{
			type: "toolCall",
			id: input.id,
			name: input.name,
			arguments: asNonArrayRecord(input.arguments)
		}],
		api: attribution.api,
		provider: attribution.provider,
		model: attribution.modelId,
		usage: makeZeroUsageSnapshot(),
		stopReason: "toolUse",
		timestamp
	};
}
function createAgentHarnessToolResultMessage(input, timestamp) {
	return {
		role: "toolResult",
		toolCallId: input.id,
		toolName: input.name,
		isError: input.isError,
		content: input.content ?? [{
			type: "text",
			text: input.text ?? `${input.name} ${input.isError ? "failed" : "completed"}`
		}],
		...input.details !== void 0 ? { details: input.details } : {},
		timestamp
	};
}
function createAgentHarnessMessageUsage(usage) {
	const zero = makeZeroUsageSnapshot();
	return usage ? {
		input: usage.input ?? 0,
		output: usage.output ?? 0,
		cacheRead: usage.cacheRead ?? 0,
		cacheWrite: usage.cacheWrite ?? 0,
		...usage.reasoningTokens !== void 0 ? { reasoningTokens: usage.reasoningTokens } : {},
		...usage.contextUsage ? { contextUsage: usage.contextUsage } : {},
		totalTokens: usage.total ?? (usage.input ?? 0) + (usage.output ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0),
		cost: zero.cost
	} : zero;
}
//#endregion
//#region src/agents/harness/projection-settlement.ts
var AgentHarnessProjectionSettlement = class {
	constructor(params, isActive, options) {
		this.pending = /* @__PURE__ */ new Map();
		const detach = (stage, callback) => callback ? (...args) => {
			if (!isActive()) return;
			const completion = createDeferredCore();
			this.pending.set(completion.promise, stage);
			const settled = () => {
				this.pending.delete(completion.promise);
				completion.resolve();
			};
			const failed = (error) => {
				log.warn(`${options.label} ${stage} callback failed: ${String(error)}`);
				settled();
			};
			try {
				Promise.resolve(callback(...args)).then(settled, failed);
			} catch (error) {
				failed(error);
			}
		} : void 0;
		this.params = {
			...params,
			onAssistantMessageStart: detach("onAssistantMessageStart", params.onAssistantMessageStart),
			onPartialReply: detach("onPartialReply", params.onPartialReply),
			onReasoningStream: detach("onReasoningStream", params.onReasoningStream),
			onReasoningEnd: detach("onReasoningEnd", params.onReasoningEnd)
		};
	}
	get pendingStage() {
		return this.stage ?? this.pending.values().next().value;
	}
	async project(stage, project) {
		const previous = this.stage;
		this.stage = stage;
		try {
			return await project();
		} finally {
			this.stage = previous;
		}
	}
	async drain() {
		while (this.pending.size > 0) await Promise.all(this.pending.keys());
	}
};
//#endregion
export { resolveAgentHarnessHistoryLimits as a, selectSupportedReasoningEffort as c, createAgentHarnessAttemptCancellation as d, createAgentHarnessAttemptDeadlineController as f, createAgentHarnessToolResultMessage as i, createAgentHarnessAttemptLifecycle as l, createAgentHarnessAssistantMessage as n, resolveAgentWorkspaceMemoryRouting as o, createAgentHarnessToolCallMessage as r, shouldIncludeAgentHarnessRuntimeContext as s, AgentHarnessProjectionSettlement as t, emitAgentHarnessAttemptEvent as u };

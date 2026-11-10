import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { a as runOutsideAsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as classifyAgentRunTerminalOutcome, s as isDefinitiveRunLifecycle } from "./agent-run-terminal-outcome-CrMEEYuY.mjs";
import { P as getAgentRunContextOwnerStatus, R as projectedAgentRunInputKey, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { _ as readAgentAssistantSource, d as getAgentEventLifecycleGeneration, o as emitAgentEventForOwner, s as emitAgentEventForRunContext } from "./agent-events-Bf3Js0D3.mjs";
import { M as parseAgentSessionKey, T as parseCronRunScopeSuffix, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { It as ChatStatusEventSchema, Vt as projectChatErrorDetail } from "./sessions-CVESrViJ.mjs";
import { s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { f as normalizeVerboseLevel } from "./thinking.shared-Be8dhC75.mjs";
import "./io-DIF-KW3P.mjs";
import { c as resolveAssistantEventPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { c as isTimeoutError } from "./error-Bcp4ZyOv.mjs";
import { i as readToolValidationErrorSummary } from "./tool-error-summary-CezRoLUS.mjs";
import { t as ASSISTANT_DISPLAY_CONTENT_FIELD } from "./assistant-display-content-mzartsGP.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { h as renderCodexAppServerFailureCopy } from "./user-copy-BAz4s3EV.mjs";
import { r as readTranscriptMessageIdempotencyKey } from "./session-transcript-entry-message-Q75Efb-t.mjs";
import { l as resolveSessionSubscriptionKeys, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { u as stripHeartbeatToken } from "./heartbeat-C40cs1ec.mjs";
import { t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import "./thinking-BCNoGfZ5.mjs";
import { i as logWarn, n as logError } from "./logger-DHVmYOKs.mjs";
import { t as setSafeTimeout } from "./timer-delay-CaN6-bja.mjs";
import { t as hasSessionChangeReceivers } from "./session-change-receivers-D73d5dPo.mjs";
import { o as isAgentLifecycleYieldedWaiting, t as inspectMainSessionRecoveryLifecycleEvent } from "./main-session-recovery-lifecycle-DY4r6VdX.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent, t as AGENT_RUN_TERMINAL_RETRY_GRACE_MS } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { r as persistGatewaySessionLifecycleEvent, t as buildGatewaySessionSnapshot } from "./session-event-payload-jfNs8sPy.mjs";
import { a as withPreparedSessionEventRow } from "./session-event-prepared-row-PHOK4R6h.mjs";
import { t as prepareSessionEventProjection } from "./session-event-projection-CYD_kL8k.mjs";
import { l as isActiveEmbeddedRunId } from "./runs-Czr-I6_B.mjs";
import { p as resolveFailoverReasonFromError } from "./failover-error-Bjf0VdY2.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { a as shouldSuppressAssistantEventForLiveChat, i as projectLiveAssistantBufferedText } from "./live-chat-projector-DlxjyyYR.mjs";
import { a as createSessionMessageSubscriberRegistry, i as createSessionEventSubscriberRegistry, n as createChatAbortMarker, o as isChatAbortMarkerCurrent, r as createChatRunState, u as resolveAssistantTextInput } from "./server-chat-state-BW_LW3dq.mjs";
import { m as normalizeAgentPlanSteps } from "./streaming-Csx7NxuJ.mjs";
import { a as extractChatToolResultCanvasPreview, n as appendChatCanvasBlocksToMessage, t as appendChatCanvasBlocks } from "./chat-display-projection.canvas-CwC0V7fB.mjs";
import { n as getTranscriptMessageRole } from "./message-visibility-P0cXqUe6.mjs";
import { i as roundedChatSendTimingMs } from "./chat-server-timing-pbaeJzGd.mjs";
import { t as resolveHeartbeatVisibility } from "./heartbeat-visibility-BERRx9eF.mjs";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
import { Value } from "typebox/value";
//#region src/gateway/server-chat-event-admission.ts
/** Orders a handler's accepted events around fresh recovery reads, independently of display enrichment. */
function createAgentEventAdmission({ handleEvent, resolveEventSession, isCurrent, dispose }) {
	const resolveRestartRecoveryLifecycleState = async (sessionKey, agentId, event, previous) => {
		const cfg = readRuntimeConfig();
		const read = () => loadGatewaySessionEntryReadOnlyInWorker({
			cfg,
			key: sessionKey,
			...agentId ? { agentId } : {}
		}).catch(() => void 0);
		let loaded = await read();
		const source = loaded?.capturedReadSource;
		const assertCurrent = () => {
			if (source && typeof source.databaseIdentity === "string") assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
		};
		if (previous && loaded) {
			await previous.catch(() => void 0);
			assertCurrent();
			const refreshed = await read();
			if (refreshed && !isDeepStrictEqual(refreshed.capturedReadSource, source)) throw new Error("Session recovery source changed while awaiting earlier events");
			loaded = refreshed;
		}
		assertCurrent();
		return {
			suppress: inspectMainSessionRecoveryLifecycleEvent({
				currentLifecycleGeneration: getAgentEventLifecycleGeneration(),
				entry: loaded?.entry,
				event
			}).suppress,
			assertCurrent
		};
	};
	const pendingEvents = /* @__PURE__ */ new Map();
	let closed = false;
	const acceptEvent = (evt) => {
		if (closed) return;
		if (!isCurrent(evt)) return;
		const phase = evt.stream === "lifecycle" ? evt.data.phase : void 0;
		const terminal = phase === "end" || phase === "error" ? buildAgentRunTerminalOutcomeFromLifecycleEvent({
			phase,
			data: evt.data
		}) : void 0;
		const needsRecoveryRead = Boolean(evt.runId.trim() && evt.lifecycleGeneration?.trim()) && (phase === "start" || terminal?.reason === "cancelled" && terminal.stopReason === "restart");
		const source = resolveEventSession(evt);
		const sessionKey = source.eventSessionKey ?? source.sessionKey;
		const agentId = evt.agentId ?? source.sessionAgentId;
		const previous = pendingEvents.get(evt.runId);
		const prepared = needsRecoveryRead && sessionKey ? resolveRestartRecoveryLifecycleState(sessionKey, agentId, evt, previous) : void 0;
		if (!prepared && !previous) return handleEvent(evt);
		const consume = async () => {
			const recovery = await prepared;
			const current = resolveEventSession(evt);
			if (current.chatLink !== source.chatLink || (current.eventSessionKey ?? current.sessionKey) !== sessionKey || (evt.agentId ?? current.sessionAgentId) !== agentId) return;
			recovery?.assertCurrent?.();
			handleEvent(evt, recovery);
		};
		const pending = previous ? previous.then(consume, consume) : consume();
		pendingEvents.set(evt.runId, pending);
		const release = () => {
			if (pendingEvents.get(evt.runId) === pending) pendingEvents.delete(evt.runId);
		};
		pending.then(release, release);
		return pending;
	};
	return Object.assign((event) => runOutsideAsyncWorkScope(() => acceptEvent(event)), { dispose: async () => {
		closed = true;
		dispose();
		await Promise.allSettled(pendingEvents.values());
		dispose();
	} });
}
//#endregion
//#region src/gateway/server-chat-heartbeat.ts
function resolveHeartbeatFlag(runId, sourceRunId, captured) {
	const primary = getAgentRunContext(runId);
	const source = sourceRunId && sourceRunId !== runId ? getAgentRunContext(sourceRunId) : primary;
	if (primary?.isHeartbeat || source?.isHeartbeat) return true;
	return source ? primary?.isHeartbeat : captured ?? primary?.isHeartbeat;
}
/**
* Check if heartbeat ACK/noise should be hidden from interactive chat surfaces.
*/
function shouldHideHeartbeatChatOutput(runId, sourceRunId, captured) {
	if (!resolveHeartbeatFlag(runId, sourceRunId, captured)) return false;
	try {
		const cfg = readRuntimeConfig();
		return !resolveHeartbeatVisibility({
			cfg,
			channel: "webchat"
		}).showOk;
	} catch {
		return true;
	}
}
function normalizeHeartbeatChatFinalText(params) {
	if (!shouldHideHeartbeatChatOutput(params.runId, params.sourceRunId, params.isHeartbeat)) return {
		suppress: false,
		text: params.text
	};
	const stripped = stripHeartbeatToken(params.text, {
		mode: "heartbeat",
		maxAckChars: 300
	});
	if (!stripped.didStrip) return {
		suppress: false,
		text: params.text
	};
	if (stripped.shouldSkip) return {
		suppress: true,
		text: ""
	};
	return {
		suppress: false,
		text: stripped.text
	};
}
//#endregion
//#region src/gateway/server-chat-lifecycle-publication.ts
function createSessionEventSnapshotBuilder({ loadGatewaySessionLifecycleSnapshotForEvent, resolveSessionActiveRunState }) {
	return (sessionKey, evt, agentId, includeActiveRunState = false, lifecycleProjection = false, ownerEvent = evt, read) => {
		const { lifecycleRunId, row } = loadGatewaySessionLifecycleSnapshotForEvent(sessionKey, agentId || ownerEvent || read ? {
			...agentId ? { agentId } : {},
			...ownerEvent ? { ownerEvent } : {},
			...read ? { sessionRows: read } : {}
		} : void 0);
		const activeRunState = includeActiveRunState ? resolveSessionActiveRunState?.({
			requestedKey: sessionKey,
			canonicalKey: row?.key ?? sessionKey,
			...row?.sessionId ? { sessionId: row.sessionId } : {},
			...agentId ? { agentId } : {}
		}) : void 0;
		return buildGatewaySessionSnapshot({
			sessionRow: row,
			agentId,
			includeSession: true,
			lifecycle: lifecycleProjection,
			event: evt,
			lifecycleRunId,
			activeRunState
		});
	};
}
function createSessionLifecyclePublisher(deps) {
	const buildSnapshot = createSessionEventSnapshotBuilder(deps);
	const publishedModelInputs = /* @__PURE__ */ new WeakMap();
	const publish = (params) => {
		const { event, phase, sessionKey, agentId, clientRunId } = params;
		const broadcastSnapshot = (snapshotEvent, sessionEventConnIds, projection, read) => deps.broadcastToConnIds("sessions.changed", {
			sessionKey,
			...agentId ? { agentId } : {},
			phase,
			runId: event.runId,
			...clientRunId !== event.runId ? { clientRunId } : {},
			ts: event.ts,
			...buildSnapshot(sessionKey, snapshotEvent, agentId, true, phase !== "model", event, read)
		}, sessionEventConnIds, {
			dropIfSlow: true,
			...read && projection ? { prepareSessionProjection: prepareSessionEventProjection(projection, read) } : {}
		});
		switch (params.phase) {
			case "end":
			case "error": {
				const { persistence, projection } = params;
				const broadcastSessionChange = (snapshotEvent) => withPreparedSessionEventRow(projection, sessionKey, agentId, (read) => {
					if (params.publishLifecycle === false || parseCronRunScopeSuffix(sessionKey).runId) return;
					const sessionEventConnIds = deps.sessionEventSubscribers.getAll();
					if (hasSessionChangeReceivers(sessionEventConnIds)) broadcastSnapshot(snapshotEvent, sessionEventConnIds, projection, read);
				});
				persistence.then(async () => {
					await broadcastSessionChange();
				}, async (err) => {
					logError(`gateway: terminal session persistence failed session=${formatForLog(sessionKey)} run=${formatForLog(event.runId)} error=${formatForLog(err)}`);
					await broadcastSessionChange(event);
				}).catch((error) => {
					logError(`gateway: terminal session snapshot publication failed: ${formatErrorMessage(error)}`);
				});
				return;
			}
			case "start":
			case "model": {
				const { runContext } = params;
				if (phase === "start") deps.persistGatewaySessionLifecycleEventForEvent({
					sessionKey,
					agentId,
					event: {
						...event,
						...clientRunId !== event.runId ? { clientRunId } : {}
					}
				}).catch((err) => {
					logError(`gateway: start session persistence failed session=${formatForLog(sessionKey)} run=${formatForLog(event.runId)} error=${formatForLog(err)}`);
				});
				const sessionEventConnIds = deps.sessionEventSubscribers.getAll();
				if (!hasSessionChangeReceivers(sessionEventConnIds)) return;
				const readModelInput = () => phase === "model" && runContext ? JSON.stringify([
					sessionKey,
					agentId,
					projectedAgentRunInputKey(runContext)
				]) : void 0;
				const observedModelInput = readModelInput();
				if (runContext && observedModelInput && publishedModelInputs.get(runContext) === observedModelInput) return;
				const projection = deps.getSessionRowProjection?.();
				const publishPrepared = (read) => {
					const modelInput = readModelInput();
					if (runContext && modelInput && publishedModelInputs.get(runContext) === modelInput) return;
					broadcastSnapshot(event, sessionEventConnIds, projection, read);
					if (runContext && modelInput) publishedModelInputs.set(runContext, modelInput);
				};
				withPreparedSessionEventRow(projection, sessionKey, agentId, publishPrepared).catch((error) => logError(`gateway: session snapshot publication failed: ${formatErrorMessage(error)}`));
			}
		}
	};
	return {
		buildSnapshot,
		publish
	};
}
//#endregion
//#region src/gateway/server-chat-live-text.ts
function projectChatWireDelta(value) {
	const { message: _message, ...payload } = value;
	return payload;
}
function projectAssistantWireDelta(value) {
	const payload = value;
	const { text: _text, ...data } = payload.data;
	return {
		...payload,
		data
	};
}
function liveTextDelivery(state, runId, coalesce, isCurrent, projection) {
	const run = coalesce || projection ? state.getOrCreate(runId) : state.runs.get(runId);
	const group = run && (coalesce || projection ? run.liveTextGroup ??= new AbortController() : run.liveTextGroup);
	return group ? {
		group: group.signal,
		sourceEpoch: run?.liveTextEpoch,
		coalesce,
		projection,
		isCurrent: coalesce || projection ? isCurrent : void 0
	} : void 0;
}
function chatWireProjection(params) {
	return {
		key: params.key,
		delta: projectChatWireDelta,
		version: params.canvasBlocks,
		snapshot: params.replace,
		snapshotBytes: (_payload, deltaBytes) => deltaBytes + Buffer.byteLength(",\"message\":") + params.text.length * 6 + Buffer.byteLength(JSON.stringify(appendChatCanvasBlocksToMessage({
			role: "assistant",
			content: [{
				type: "text",
				text: ""
			}],
			timestamp: params.now
		}, params.canvasBlocks ?? [])))
	};
}
function assistantWireProjection(payload, sessionKey, agentId, controlUiVisible) {
	const text = payload.data.text;
	if (payload.stream !== "assistant" || typeof text !== "string") return;
	return {
		key: JSON.stringify([
			"agent",
			"assistant",
			sessionKey,
			agentId,
			controlUiVisible
		]),
		version: payload.data.itemId,
		delta: projectAssistantWireDelta,
		text: {
			snapshot: text,
			delta: typeof payload.data.delta === "string" ? payload.data.delta : ""
		},
		snapshot: payload.data.replace === true || typeof payload.data.delta !== "string" || payload.data.delta === "" || typeof payload.data.mediaUrl === "string" || Array.isArray(payload.data.mediaUrls) && payload.data.mediaUrls.length > 0,
		snapshotBytes: (_payload, deltaBytes) => deltaBytes + Buffer.byteLength(",\"text\":\"\"") + text.length * 6
	};
}
function prepareAgentWirePayload(event, clientRunId, state, isCurrent) {
	let payload = event.runId === clientRunId ? event : {
		...event,
		runId: clientRunId
	};
	if (event.stream === "item" && event.data.kind === "preamble") payload = {
		...payload,
		preamble: event.assistantProjection?.replace ? { retainedText: event.assistantProjection.text } : {}
	};
	if (event.stream === "assistant") {
		const input = resolveAssistantTextInput(event.data);
		if (input) {
			const run = state.getOrCreate(clientRunId);
			const textState = (run.agentText ??= {}).assistant ??= {};
			const previous = textState.snapshot;
			const text = input.text ?? (input.replace || previous?.itemId !== input.itemId ? "" : previous?.text ?? "") + (input.delta ?? "");
			textState.snapshot = {
				text,
				itemId: input.itemId
			};
			run.bufferIsCurrent = isCurrent;
			if (input.text === void 0) payload = {
				...payload,
				data: {
					...event.data,
					text
				}
			};
		}
	}
	return payload;
}
function mergeAgentTextPayload(previous, next) {
	const payload = next;
	const prior = previous;
	if (payload.stream === "item" && payload.data.kind === "preamble" && payload.preamble?.retainedText === void 0 && prior.preamble?.retainedText !== void 0) return {
		...payload,
		preamble: prior.preamble
	};
	const delta = prior.data.delta;
	const nextDelta = payload.data.delta;
	return payload.stream !== "item" && typeof delta === "string" && typeof nextDelta === "string" ? {
		...payload,
		data: {
			...payload.data,
			delta: `${delta}${nextDelta}`
		}
	} : payload;
}
function mergeChatTextPayload(previous, next) {
	const payload = next;
	return {
		...payload,
		deltaText: `${previous.deltaText}${payload.deltaText}`
	};
}
function cancelPendingLiveTextFlush(run, stream) {
	const pending = run?.pendingTextFlushes?.[stream];
	if (!run || !pending) return;
	clearTimeout(pending.timer);
	delete run.pendingTextFlushes?.[stream];
	if (run.pendingTextFlushes && Object.keys(run.pendingTextFlushes).length === 0) delete run.pendingTextFlushes;
}
function scheduleLiveTextFlush(run, stream, delayMs, flush) {
	const pendingFlushes = run.pendingTextFlushes ??= {};
	const existing = pendingFlushes[stream];
	if (existing) {
		existing.flush = flush;
		return;
	}
	const timer = setSafeTimeout(() => {
		const pending = run.pendingTextFlushes?.[stream];
		if (!pending || pending.timer !== timer) return;
		cancelPendingLiveTextFlush(run, stream);
		pending.flush();
	}, delayMs);
	timer.unref?.();
	pendingFlushes[stream] = {
		timer,
		flush
	};
}
//#endregion
//#region src/gateway/server-chat-transcript-publication.ts
/** Retire committed source bytes immediately, then hand their wire display to durable history. */
function createChatTranscriptPublication(params) {
	const { chatRunState, agentRunSeq } = params;
	const publications = /* @__PURE__ */ new Set();
	const pendingByRun = /* @__PURE__ */ new Map();
	const currentPublication = (runId) => {
		const pending = pendingByRun.get(runId);
		if (pending && !pending.isCurrent()) {
			pendingByRun.delete(runId);
			return;
		}
		return pending;
	};
	return {
		holdDelta: (runId, publish) => {
			const pending = currentPublication(runId);
			if (!pending) return false;
			const run = chatRunState.runs.get(runId);
			pending.delta = () => {
				if (chatRunState.runs.get(runId) === run && run?.bufferIsCurrent?.() !== false) publish();
			};
			return true;
		},
		holdTerminal: (runId, publish) => {
			const pending = currentPublication(runId);
			if (!pending) return false;
			pending.terminal = publish;
			return true;
		},
		drain: async () => {
			await Promise.allSettled(publications);
		},
		observeAgentEvent: (event, clientRunId, isCurrent) => {
			if (chatRunState.runs.get(clientRunId)?.bufferIsCurrent?.() === false) {
				chatRunState.clearRun(clientRunId);
				agentRunSeq.delete(event.runId);
			}
			const { itemId, text } = event.data;
			if (event.stream !== "thinking" || typeof itemId !== "string" || typeof text !== "string") return;
			const context = getAgentRunContext(event.runId);
			if (!context) return;
			const items = chatRunState.getOrCreate(clientRunId).assistantItems ??= /* @__PURE__ */ new Map();
			const item = items.get(itemId) ?? {};
			const { runId, contextClaimId, lifecycleGeneration } = event;
			const { sessionKey, sessionId } = context;
			item.publishThinkingReceipt ??= (messageId, targetSessionKey, targetSessionId) => {
				if (targetSessionKey !== sessionKey || sessionId && targetSessionId !== sessionId || !isCurrent() || getAgentRunContext(runId) !== context) return;
				const receipt = {
					runId,
					lifecycleGeneration,
					stream: "thinking",
					data: {
						phase: "persisted",
						itemId,
						messageId,
						messageRunId: runId
					}
				};
				if (contextClaimId) emitAgentEventForOwner(receipt, contextClaimId);
				else emitAgentEventForRunContext(receipt, context);
			};
			items.set(itemId, item);
		},
		retireTranscript: (event, publication) => {
			const sourceRunId = readSessionTranscriptRunId(event.message);
			if (!sourceRunId || getTranscriptMessageRole(event.message) !== "assistant") return;
			const link = chatRunState.registry.peek(sourceRunId);
			const clientRunId = link?.clientRunId ?? sourceRunId;
			const context = getAgentRunContext(sourceRunId);
			const sessionKey = link?.sessionKey ?? context?.sessionKey;
			const source = readAgentAssistantSource(event.message);
			const mirrorKey = readTranscriptMessageIdempotencyKey(event.message);
			const itemIds = [...event.assistantItemIds ?? [], ...mirrorKey ? [mirrorKey] : []];
			const content = asNullableRecord(event.message)?.content;
			if (event.messageId !== void 0 && Array.isArray(content) && content.some((block) => asNullableRecord(block)?.type === "thinking")) for (const itemId of source?.itemId ? [source.itemId] : event.assistantItemIds ?? []) (chatRunState.runs.get(sourceRunId)?.assistantItems?.get(itemId)?.publishThinkingReceipt ?? chatRunState.runs.get(clientRunId)?.assistantItems?.get(itemId)?.publishThinkingReceipt)?.(event.messageId, event.sessionKey, event.sessionId);
			if (!source && itemIds.length === 0 || !sessionKey || sessionKey !== event.sessionKey || context?.sessionId && context.sessionId !== event.sessionId) return;
			if (publication) {
				const pending = currentPublication(clientRunId) ?? {
					pending: 0,
					isCurrent: () => {
						const currentContext = getAgentRunContext(sourceRunId);
						const currentLink = chatRunState.registry.peek(sourceRunId);
						const queuedSuccessor = currentLink !== void 0 && currentLink.clientRunId !== clientRunId && currentLink.sessionKey === sessionKey && (currentLink.agentId ?? currentContext?.agentId ?? event.agentId) === event.agentId;
						return (!currentContext || currentContext === context || queuedSuccessor && event.sessionId !== void 0 && currentContext.sessionId === event.sessionId) && (!currentLink || currentLink === link || queuedSuccessor);
					}
				};
				pending.pending += 1;
				pendingByRun.set(clientRunId, pending);
				const release = () => {
					pending.pending -= 1;
					if (pending.pending > 0 || pendingByRun.get(clientRunId) !== pending) return;
					pendingByRun.delete(clientRunId);
					if (!pending.isCurrent()) return;
					if (pending.terminal) pending.terminal();
					else pending.delta?.();
				};
				const settled = publication.then(release, release).catch((error) => {
					logError(`gateway: deferred chat publication failed: ${formatErrorMessage(error)}`);
				});
				publications.add(settled);
				settled.then(() => publications.delete(settled));
			}
			const run = chatRunState.getOrCreate(clientRunId);
			if (run.bufferIsCurrent?.() === false || isChatAbortMarkerCurrent(run.abortMarker, link)) return;
			if (!(source ? chatRunState.retireSource(clientRunId, source) : chatRunState.retireBuffer(clientRunId, itemIds))) return;
			run.liveTextEpoch = {};
			params.flush(sessionKey, link?.agentId ?? context?.agentId, clientRunId, sourceRunId, agentRunSeq.get(sourceRunId) ?? 0, {
				controlUiVisible: context?.isControlUiVisible,
				isHeartbeat: context?.isHeartbeat
			});
		}
	};
}
//#endregion
//#region src/gateway/server-chat.ts
const CHAT_STATE_BY_TERMINAL_CLASSIFICATION = {
	success: "done",
	timeout: "error",
	cancellation: "aborted",
	failure: "error"
};
const MAX_LIVE_CANVAS_BYTES = 65536;
function shouldMirrorAssistantEventToHiddenSessionMessages(data) {
	return (typeof data.text === "string" && data.text.length > 0 || typeof data.delta === "string" && data.delta.length > 0) && resolveAssistantEventPhase(data) === "commentary";
}
const LIVE_TEXT_PACING_MS = 75;
const CHAT_ERROR_KINDS = /* @__PURE__ */ new Set([
	"refusal",
	"timeout",
	"rate_limit",
	"context_length",
	"unknown"
]);
function readChatErrorKind(value) {
	return typeof value === "string" && CHAT_ERROR_KINDS.has(value) ? value : void 0;
}
function resolveChatErrorKindFromError(error) {
	if (error === void 0) return;
	const message = formatErrorMessage(error).toLowerCase();
	if (message.includes("refusal") || message.includes("content_filter") || message.includes("sensitive")) return "refusal";
	const reason = resolveFailoverReasonFromError(error);
	if (reason === "rate_limit" || reason === "overloaded") return "rate_limit";
	if (reason === "context_overflow") return "context_length";
	return isTimeoutError(error) ? "timeout" : void 0;
}
function createAgentEventHandler({ broadcast, broadcastToConnIds, nodeSendToSession, nodeHasSessionSubscribers, agentRunSeq, chatRunState, resolveSessionKeyForRun, clearAgentRunContext, toolEventRecipients, sessionEventSubscribers, sessionMessageSubscribers, loadGatewaySessionLifecycleSnapshotForEvent = () => ({ row: null }), getSessionRowProjection, persistGatewaySessionLifecycleEventForEvent = persistGatewaySessionLifecycleEvent, lifecycleErrorRetryGraceMs = AGENT_RUN_TERMINAL_RETRY_GRACE_MS, isChatSendRunActive = () => false, clearTrackedActiveRun, settleTrackedTerminal, trackTrackedRunTerminalPersistence, resolveActiveLifecycleGenerationForRun = () => void 0, updateRunToolErrorSummary, resolveSessionActiveRunState }) {
	const shouldProcessOwnedEvent = (runId, claimId, lifecycleGeneration) => !claimId || Boolean(lifecycleGeneration && getAgentRunContextOwnerStatus(runId, claimId, lifecycleGeneration) === "active");
	const clearRunContextForEvent = (evt) => {
		if (evt.contextClaimId) {
			clearAgentRunContext(evt.runId, evt.lifecycleGeneration, evt.contextClaimId);
			return;
		}
		clearAgentRunContext(evt.runId);
	};
	const resolveEventSession = (evt) => {
		const chatLink = evt.contextClaimId ? void 0 : chatRunState.registry.peek(evt.runId);
		const sessionAgentId = chatLink?.agentId ?? evt.agentId;
		const eventSessionKey = evt.deliverySessionKey ?? (typeof evt.sessionKey === "string" && evt.sessionKey.trim() ? evt.sessionKey : void 0);
		return {
			chatLink,
			sessionAgentId,
			eventSessionKey,
			sessionKey: chatLink?.sessionKey ?? eventSessionKey ?? getAgentRunContext(evt.runId)?.sessionKey ?? resolveSessionKeyForRun(evt.runId, sessionAgentId ? { agentId: sessionAgentId } : void 0)
		};
	};
	const pendingTerminalLifecycleErrors = /* @__PURE__ */ new Map();
	const clearPendingTerminalLifecycleError = (runId, lifecycleGeneration) => {
		const pending = pendingTerminalLifecycleErrors.get(runId);
		if (!pending) return;
		if (lifecycleGeneration && pending.event.lifecycleGeneration && lifecycleGeneration !== pending.event.lifecycleGeneration) return;
		clearTimeout(pending.timer);
		pendingTerminalLifecycleErrors.delete(runId);
	};
	const resolveSpawnedBy = (sessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		const isDashboardSession = parsed?.rest.startsWith("dashboard:") === true;
		if (!isSubagentSessionKey(sessionKey) && !isAcpSessionKey(sessionKey) && !isDashboardSession) return null;
		const agentId = parsed?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(readRuntimeConfig(), sessionKey);
		return agentId ? getSessionRowProjection?.()?.readPreparedSpawnedBy({
			key: sessionKey,
			agentId
		}) ?? null : null;
	};
	const sessionLifecyclePublisher = createSessionLifecyclePublisher({
		broadcastToConnIds,
		sessionEventSubscribers,
		getSessionRowProjection,
		persistGatewaySessionLifecycleEventForEvent,
		loadGatewaySessionLifecycleSnapshotForEvent,
		resolveSessionActiveRunState
	});
	const buildSessionEventSnapshot = sessionLifecyclePublisher.buildSnapshot;
	const resolveSessionDeliveryKeys = (sessionKey, agentId) => {
		if (sessionKey.trim().toLowerCase() !== "global") return [sessionKey];
		const compatibilityOwnerAgentId = tryResolveSessionCompatibilityOwnerAgentId(readRuntimeConfig(), sessionKey);
		const deliveryAgentId = agentId ?? compatibilityOwnerAgentId;
		return deliveryAgentId ? resolveSessionSubscriptionKeys(sessionKey, deliveryAgentId, compatibilityOwnerAgentId) : [];
	};
	const emitFirstAssistantChatSendTiming = (chatLink) => {
		const timing = chatLink?.chatSendTiming;
		if (!timing || timing.firstAssistantEventSent) return;
		timing.firstAssistantEventSent = true;
		const nowMs = performance.now();
		broadcastToConnIds("chat.send_timing", {
			phase: "first-assistant-event",
			runId: chatLink.clientRunId,
			sessionKey: chatLink.sessionKey,
			...chatLink.agentId ? { agentId: chatLink.agentId } : {},
			ackToPhaseMs: roundedChatSendTimingMs(nowMs - timing.ackedAtMs),
			receivedToPhaseMs: roundedChatSendTimingMs(nowMs - timing.receivedAtMs),
			...timing.dispatchStartedAtMs !== void 0 ? { dispatchStartedToPhaseMs: roundedChatSendTimingMs(nowMs - timing.dispatchStartedAtMs) } : {}
		}, /* @__PURE__ */ new Set([timing.connId]), { dropIfSlow: true });
	};
	const finalizeLifecycleEvent = (evt, opts) => {
		if (!shouldProcessOwnedEvent(evt.runId, evt.contextClaimId, evt.lifecycleGeneration)) return;
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
		if (lifecyclePhase !== "end" && lifecyclePhase !== "error") return;
		const currentRunContext = getAgentRunContext(evt.runId);
		const activeLifecycleGeneration = resolveActiveLifecycleGenerationForRun(evt.runId);
		const currentLifecycleGeneration = activeLifecycleGeneration ?? currentRunContext?.lifecycleGeneration;
		const { chatLink, sessionAgentId, sessionKey } = resolveEventSession(evt);
		const isControlUiVisible = evt.controlUiVisible ?? currentRunContext?.isControlUiVisible ?? true;
		const projectSessionLifecycle = evt.projectSessionLifecycle ?? currentRunContext?.projectSessionLifecycle ?? true;
		const projectSessionMessages = evt.projectSessionMessages ?? currentRunContext?.projectSessionMessages ?? true;
		const clientRunId = chatLink?.clientRunId ?? evt.runId;
		const isAborted = isChatAbortMarkerCurrent(chatRunState.runs.get(clientRunId)?.abortMarker, chatLink) || isChatAbortMarkerCurrent(chatRunState.runs.get(evt.runId)?.abortMarker, chatLink);
		const lifecycleAborted = evt.data?.aborted === true;
		const replyDispatchOwnsCompletion = evt.data?.completionSource === "reply-dispatch";
		const deliverySessionKeys = sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId) : [];
		const suppressRestartRecoveryProjection = opts?.suppressRestartRecoveryProjection === true || Boolean(evt.lifecycleGeneration && activeLifecycleGeneration && evt.lifecycleGeneration !== activeLifecycleGeneration) || opts?.restartRecoveryState?.suppress === true;
		if (suppressRestartRecoveryProjection && Boolean(evt.lifecycleGeneration && currentLifecycleGeneration && evt.lifecycleGeneration !== currentLifecycleGeneration)) return;
		clearPendingTerminalLifecycleError(evt.runId, evt.lifecycleGeneration);
		const terminalPersistence = sessionKey && !suppressRestartRecoveryProjection && projectSessionLifecycle ? persistGatewaySessionLifecycleEventForEvent({
			sessionKey,
			agentId: sessionAgentId,
			event: {
				...evt,
				...evt.contextClaimId ? { contextClaimId: evt.contextClaimId } : {},
				...clientRunId !== evt.runId ? { clientRunId } : {},
				...evt.lifecycleGeneration ? { lifecycleGeneration: evt.lifecycleGeneration } : {},
				...evt.mainSessionRestartRecovery === true ? { mainSessionRestartRecovery: true } : {}
			}
		}) : void 0;
		const finished = chatLink && !replyDispatchOwnsCompletion ? chatRunState.registry.shift(evt.runId) : void 0;
		if (opts?.publishLifecycle !== false && !replyDispatchOwnsCompletion && !suppressRestartRecoveryProjection && sessionKey && (isControlUiVisible || projectSessionMessages && deliverySessionKeys.some((deliverySessionKey) => sessionMessageSubscribers.get(deliverySessionKey).size > 0))) {
			if (!isAborted) {
				const terminalSessionKey = finished?.sessionKey ?? sessionKey;
				const terminalRunId = finished?.clientRunId ?? clientRunId;
				const terminalAgentId = finished?.agentId ?? sessionAgentId;
				const terminalOutcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
					phase: lifecyclePhase,
					data: evt.data,
					endedAt: evt.data?.endedAt ?? evt.ts
				});
				const yieldedWaiting = isAgentLifecycleYieldedWaiting({
					phase: lifecyclePhase,
					yielded: evt.data?.yielded,
					livenessState: evt.data?.livenessState,
					stopReason: terminalOutcome.stopReason,
					aborted: lifecycleAborted,
					status: evt.data?.status,
					timeoutPhase: evt.data?.timeoutPhase,
					error: evt.data?.error
				});
				const terminalClassification = classifyAgentRunTerminalOutcome(terminalOutcome);
				const terminalState = CHAT_STATE_BY_TERMINAL_CLASSIFICATION[terminalClassification];
				if (!(opts?.skipChatErrorFinal && terminalState === "error")) emitChatTerminal({
					sessionKey: terminalSessionKey,
					clientRunId: terminalRunId,
					sourceRunId: evt.runId,
					seq: evt.seq,
					agentId: terminalAgentId,
					controlUiVisible: isControlUiVisible,
					isHeartbeat: resolveHeartbeatFlag(clientRunId, evt.runId, evt.isHeartbeat),
					firstAssistantTimingEntry: finished
				}, terminalState, terminalOutcome.error ?? evt.data?.error, terminalOutcome.stopReason, terminalClassification === "timeout" ? "timeout" : readChatErrorKind(evt.data?.errorKind) ?? resolveChatErrorKindFromError(evt.data?.error), {
					abortErrorMessage: readToolValidationErrorSummary(evt.data?.toolErrorSummary),
					yielded: yieldedWaiting ? true : void 0,
					errorObservation: evt.data?.errorObservation,
					assistantTranscriptIdempotencyKey: readStringValue(evt.data?.assistantTranscriptIdempotencyKey),
					terminalPersistence,
					isCurrent: () => shouldProcessOwnedEvent(evt.runId, evt.contextClaimId, evt.lifecycleGeneration)
				});
			}
		}
		toolEventRecipients.markFinal(evt.runId);
		if (!replyDispatchOwnsCompletion) {
			chatRunState.clearRun(clientRunId);
			if (!evt.contextClaimId) clearRunContextForEvent(evt);
			agentRunSeq.delete(evt.runId);
			agentRunSeq.delete(clientRunId);
		}
		if (sessionKey) {
			clearTrackedActiveRun?.({
				runId: evt.runId,
				clientRunId,
				sessionKey
			});
			if (terminalPersistence) {
				const projection = getSessionRowProjection?.();
				trackTrackedRunTerminalPersistence?.({
					runId: evt.runId,
					clientRunId,
					sessionKey,
					sessionId: evt.sessionId,
					persistence: terminalPersistence
				});
				sessionLifecyclePublisher.publish({
					event: evt,
					phase: lifecyclePhase,
					sessionKey,
					agentId: sessionAgentId,
					clientRunId,
					persistence: terminalPersistence,
					projection,
					publishLifecycle: opts?.publishLifecycle
				});
			} else settleTrackedTerminal?.({
				runId: evt.runId,
				clientRunId,
				sessionKey
			});
		}
		if (!replyDispatchOwnsCompletion && evt.contextClaimId) {
			if (terminalPersistence) {
				const clearOwnedRunContext = () => clearRunContextForEvent(evt);
				terminalPersistence.then(clearOwnedRunContext, clearOwnedRunContext);
			} else clearRunContextForEvent(evt);
		}
	};
	const scheduleTerminalLifecycleError = (evt, opts) => {
		clearPendingTerminalLifecycleError(evt.runId);
		const timer = setSafeTimeout(() => {
			const pending = pendingTerminalLifecycleErrors.get(evt.runId);
			if (!pending || pending.timer !== timer) return;
			pendingTerminalLifecycleErrors.delete(evt.runId);
			finalizeLifecycleEvent(pending.event, pending.opts);
		}, lifecycleErrorRetryGraceMs);
		timer.unref?.();
		pendingTerminalLifecycleErrors.set(evt.runId, {
			timer,
			event: evt,
			opts
		});
	};
	const broadcastChatDelta = (delivery, text) => {
		const { sessionKey, agentId, clientRunId, sourceRunId, seq } = delivery;
		cancelPendingLiveTextFlush(chatRunState.runs.get(clientRunId), "chat");
		const run = chatRunState.getOrCreate(clientRunId);
		if (transcriptPublication.holdDelta(clientRunId, () => flushBufferedChatDeltaIfNeeded({
			...delivery,
			seq: agentRunSeq.get(sourceRunId) ?? seq
		}))) return;
		const broadcastDelta = chatRunState.takeBufferDelta(clientRunId, text);
		if (!broadcastDelta) return;
		const now = Date.now();
		run.deltaSentAt = now;
		const spawnedBy = resolveSpawnedBy(sessionKey);
		const deliveryKey = JSON.stringify([
			"chat",
			sessionKey,
			agentId,
			delivery.controlUiVisible ?? true
		]);
		const canvasBlocks = run.canvasBlocks;
		const payload = {
			runId: clientRunId,
			sessionKey,
			...agentId ? { agentId } : {},
			...spawnedBy && { spawnedBy },
			seq,
			state: "delta",
			...broadcastDelta,
			message: appendChatCanvasBlocksToMessage({
				role: "assistant",
				content: [{
					type: "text",
					text
				}],
				timestamp: now
			}, canvasBlocks ?? [])
		};
		emitFirstAssistantChatSendTiming(delivery.firstAssistantTimingEntry ?? chatRunState.registry.peek(sourceRunId));
		sendLivePayload("chat", sessionKey, payload, {
			agentId,
			controlUiVisible: delivery.controlUiVisible ?? true,
			dropIfSlow: true,
			liveText: liveTextDelivery(chatRunState, clientRunId, broadcastDelta.replace ? void 0 : {
				key: deliveryKey,
				merge: mergeChatTextPayload
			}, run.bufferIsCurrent, chatWireProjection({
				key: deliveryKey,
				text,
				now,
				canvasBlocks,
				replace: broadcastDelta.replace
			}))
		});
	};
	const broadcastBufferedChatDelta = (delivery, heartbeatForFilter = delivery.isHeartbeat) => {
		const { clientRunId, sourceRunId } = delivery;
		const { text, suppress } = chatRunState.resolveBuffer(clientRunId);
		if (!shouldHideHeartbeatChatOutput(clientRunId, sourceRunId, heartbeatForFilter)) broadcastChatDelta(delivery, suppress ? "" : text);
	};
	const emitChatDelta = (delivery, input, source, isCurrent) => {
		const { clientRunId, sourceRunId } = delivery;
		const run = chatRunState.getOrCreate(clientRunId);
		const previousRawText = run.rawBuffer ?? "";
		const mergedRawText = chatRunState.updateBuffer(clientRunId, input, source);
		if (!mergedRawText && !previousRawText) return;
		const now = Date.now();
		run.bufferIsCurrent = isCurrent;
		if (!mergedRawText) {
			broadcastChatDelta(delivery, "");
			return;
		}
		if (run.deltaSentAt !== void 0 && !input.replace) {
			scheduleLiveTextFlush(run, "chat", LIVE_TEXT_PACING_MS - (now - run.deltaSentAt), () => {
				if (run.bufferIsCurrent?.() === false) {
					chatRunState.clearRun(clientRunId);
					agentRunSeq.delete(sourceRunId);
					return;
				}
				broadcastBufferedChatDelta({
					...delivery,
					isHeartbeat: void 0
				}, delivery.isHeartbeat);
			});
			return;
		}
		broadcastBufferedChatDelta(delivery);
	};
	const flushBufferedChatDeltaIfNeeded = (delivery) => {
		cancelPendingLiveTextFlush(chatRunState.runs.get(delivery.clientRunId), "chat");
		broadcastBufferedChatDelta(delivery);
	};
	const transcriptPublication = createChatTranscriptPublication({
		chatRunState,
		agentRunSeq,
		flush: (sessionKey, agentId, clientRunId, sourceRunId, seq, options) => flushBufferedChatDeltaIfNeeded({
			sessionKey,
			agentId,
			clientRunId,
			sourceRunId,
			seq,
			...options
		})
	});
	const sendLivePayload = (event, sessionKey, payload, opts) => {
		if (event === "chat" && "state" in payload && (payload.state === "final" || payload.state === "error" || payload.state === "aborted") && transcriptPublication.holdTerminal(payload.runId, () => sendLivePayload(event, sessionKey, payload, opts))) return;
		const visible = opts?.controlUiVisible ?? true;
		const deliverySessionKeys = sessionKey ? resolveSessionDeliveryKeys(sessionKey, opts?.agentId) : void 0;
		const liveText = opts?.liveText ?? liveTextDelivery(chatRunState, payload.runId);
		const broadcastOpts = {
			dropIfSlow: event === "agent" && visible ? void 0 : opts?.dropIfSlow,
			excludeClientCapability: event === "agent" && "stream" in payload && payload.stream === "assistant" && (typeof payload.data.text === "string" || typeof payload.data.delta === "string") ? GATEWAY_CLIENT_CAPS.CHAT_ONLY_ASSISTANT_TEXT : void 0,
			sessionKeys: deliverySessionKeys,
			liveText: liveText && event === "chat" && "state" in payload && (payload.state === "final" || payload.state === "error") ? {
				...liveText,
				settle: true
			} : liveText
		};
		if (visible) {
			broadcast(event, payload, broadcastOpts);
			if (deliverySessionKeys?.[0]) nodeSendToSession(deliverySessionKeys[0], event, payload, broadcastOpts);
			return;
		}
		const recipients = /* @__PURE__ */ new Set();
		for (const deliveryKey of deliverySessionKeys ?? []) for (const connId of sessionMessageSubscribers.get(deliveryKey)) recipients.add(connId);
		if (recipients.size > 0) broadcastToConnIds(event, event === "agent" && sessionKey ? {
			...payload,
			...buildSessionEventSnapshot(sessionKey, void 0, opts?.agentId)
		} : payload, recipients, {
			...broadcastOpts,
			sessionSubscriptionVerified: true
		});
	};
	const emitChatTerminal = (delivery, jobState, error, stopReason, errorKind, opts) => {
		const { sessionKey, clientRunId, sourceRunId, seq, agentId } = delivery;
		const terminalBuffer = chatRunState.resolveBuffer(clientRunId, { final: true });
		const normalizedHeartbeatText = normalizeHeartbeatChatFinalText({
			runId: clientRunId,
			sourceRunId,
			text: terminalBuffer.text.trim(),
			isHeartbeat: delivery.isHeartbeat
		});
		const projected = projectLiveAssistantBufferedText(normalizedHeartbeatText.text.trim(), { suppressLeadFragments: false });
		const text = projected.text.trim();
		const shouldSuppressSilent = normalizedHeartbeatText.suppress || projected.suppress && !terminalBuffer.displayText;
		const hasDisplayContent = Boolean(text || terminalBuffer.displayText);
		flushBufferedChatDeltaIfNeeded(delivery);
		const spawnedBy = resolveSpawnedBy(sessionKey);
		const terminalPayload = {
			runId: clientRunId,
			sessionKey,
			...agentId ? { agentId } : {},
			...spawnedBy && { spawnedBy },
			seq
		};
		const createTerminalMessage = (canvasBlocks) => appendChatCanvasBlocksToMessage({
			role: "assistant",
			content: text ? [{
				type: "text",
				text
			}] : [],
			timestamp: Date.now(),
			...terminalBuffer.displayText === void 0 ? {} : { [ASSISTANT_DISPLAY_CONTENT_FIELD]: appendChatCanvasBlocks(terminalBuffer.displayText ? [{
				type: "text",
				text: terminalBuffer.displayText
			}] : [], canvasBlocks) },
			...opts?.assistantTranscriptIdempotencyKey ? { __openclaw: {
				runId: clientRunId,
				idempotencyKey: opts.assistantTranscriptIdempotencyKey
			} } : {}
		}, canvasBlocks);
		if (jobState !== "error") {
			const run = chatRunState.runs.get(clientRunId);
			const canvasBlocks = run?.canvasBlocks ?? [];
			const canvasOnly = jobState === "done" && canvasBlocks.length > 0 && !(run?.rawBuffer ?? run?.buffer ?? "").trim();
			const payload = {
				...terminalPayload,
				state: jobState === "done" ? "final" : "aborted",
				...jobState === "aborted" && opts?.abortErrorMessage ? { errorMessage: opts.abortErrorMessage } : {},
				...stopReason && { stopReason },
				...jobState === "done" && opts?.yielded ? { yielded: true } : {},
				message: hasDisplayContent && !shouldSuppressSilent || canvasOnly ? createTerminalMessage(canvasBlocks) : void 0
			};
			if (payload.message) emitFirstAssistantChatSendTiming(delivery.firstAssistantTimingEntry);
			sendLivePayload("chat", sessionKey, payload, delivery);
			chatRunState.clearRun(clientRunId);
			return;
		}
		const errorDetail = projectChatErrorDetail(opts?.errorObservation);
		const errorMessage = error ? formatForLog(error) : void 0;
		const payload = {
			...terminalPayload,
			state: "error",
			...opts?.assistantTranscriptIdempotencyKey && hasDisplayContent && !shouldSuppressSilent ? { message: createTerminalMessage(chatRunState.runs.get(clientRunId)?.canvasBlocks ?? []) } : {},
			errorMessage: errorMessage ? renderCodexAppServerFailureCopy(errorMessage) ?? errorMessage : void 0,
			...errorKind && { errorKind },
			...errorDetail ? { errorDetail } : {},
			...stopReason && { stopReason }
		};
		const publish = () => {
			if (opts?.isCurrent?.() !== false) sendLivePayload("chat", sessionKey, payload, delivery);
		};
		if (opts?.terminalPersistence) opts.terminalPersistence.then(publish, publish).catch((publicationError) => {
			logError(`gateway: terminal chat publication failed: ${formatErrorMessage(publicationError)}`);
		});
		else publish();
		chatRunState.clearRun(clientRunId);
	};
	const sendAgentPayload = (sessionKey, payload, opts) => {
		const stream = resolveAgentTextThrottleStream(payload);
		const deliveryKey = JSON.stringify([
			"agent",
			stream,
			payload.data.itemId,
			sessionKey,
			opts?.agentId,
			opts?.controlUiVisible ?? true
		]);
		const liveText = liveTextDelivery(chatRunState, payload.runId, stream && opts?.coalesce ? {
			key: deliveryKey,
			merge: mergeAgentTextPayload
		} : void 0, opts?.isCurrent, assistantWireProjection(payload, sessionKey, opts?.agentId, opts?.controlUiVisible ?? true));
		if (liveText && opts?.settle) liveText.settle = true;
		sendLivePayload("agent", sessionKey, payload, {
			...opts,
			liveText
		});
	};
	const flushBufferedAgentDeltaIfNeeded = (clientRunId) => {
		const run = chatRunState.runs.get(clientRunId);
		cancelPendingLiveTextFlush(run, "agent");
		const states = Object.values(run?.agentText ?? {});
		states.sort((a, b) => (a.bufferedEvent?.payload.seq ?? 0) - (b.bufferedEvent?.payload.seq ?? 0));
		for (const state of states) {
			const buffered = state.bufferedEvent;
			if (!buffered) continue;
			delete state.bufferedEvent;
			if (buffered.isCurrent?.() === false) continue;
			state.lastSentAt = Date.now();
			sendAgentPayload(buffered.sessionKey, buffered.payload, {
				agentId: buffered.agentId,
				controlUiVisible: buffered.controlUiVisible,
				dropIfSlow: buffered.controlUiVisible === false,
				coalesce: true,
				isCurrent: buffered.isCurrent
			});
		}
	};
	const resolveAgentTextThrottleStream = (evt) => {
		if (evt.stream === "assistant" || evt.stream === "thinking") {
			const stream = evt.stream === "assistant" ? "assistant" : "thinking";
			return typeof evt.data.delta === "string" || evt.data.replace === true ? stream : null;
		}
		const { kind, phase, status, itemId, progressText } = evt.data;
		return evt.stream === "item" && phase === "update" && (kind === "preamble" || kind === "answer_candidate" && status === "candidate") && typeof itemId === "string" && typeof progressText === "string" ? kind : null;
	};
	const shouldCoalesceAgentTextEvent = (evt) => !(Array.isArray(evt.data.mediaUrls) && evt.data.mediaUrls.length > 0) && typeof evt.data.mediaUrl !== "string" && evt.data.replace !== true && (evt.stream === "item" || typeof evt.data.text === "string" && typeof evt.data.delta === "string" && evt.data.delta.length > 0 && (evt.stream !== "assistant" || !shouldSuppressAssistantEventForLiveChat(evt.data)));
	const sendOrBufferAgentTextEvent = (clientRunId, next, settle) => {
		const { payload } = next;
		const stream = resolveAgentTextThrottleStream(payload);
		const now = Date.now();
		const run = stream ? chatRunState.getOrCreate(clientRunId) : void 0;
		const state = run && stream ? (run.agentText ??= {})[stream] ??= {} : void 0;
		const last = state?.lastSentAt;
		const previous = state?.bufferedEvent;
		if (run && state && last !== void 0 && shouldCoalesceAgentTextEvent(payload) && (!previous || previous.payload.data.itemId === payload.data.itemId && previous.sessionKey === next.sessionKey && previous.agentId === next.agentId && previous.controlUiVisible === next.controlUiVisible && previous.isCurrent?.() !== false)) {
			state.bufferedEvent = {
				...next,
				payload: previous ? mergeAgentTextPayload(previous.payload, payload) : payload
			};
			scheduleLiveTextFlush(run, "agent", LIVE_TEXT_PACING_MS - (now - last), () => flushBufferedAgentDeltaIfNeeded(clientRunId));
			return;
		}
		flushBufferedAgentDeltaIfNeeded(clientRunId);
		sendAgentPayload(next.sessionKey, payload, {
			agentId: next.agentId,
			controlUiVisible: next.controlUiVisible,
			dropIfSlow: next.controlUiVisible === false,
			isCurrent: next.isCurrent,
			settle
		});
		if (state) state.lastSentAt = now;
	};
	const resolveToolVerboseLevel = (event, sessionKey, agentId) => {
		const runContext = getAgentRunContext(event.runId);
		const runVerbose = normalizeVerboseLevel(runContext?.verboseLevel ?? event.verboseLevel);
		const registeredAt = runContext?.registeredAt ?? event.registeredAt;
		try {
			const cfg = readRuntimeConfig();
			const ownerAgentId = agentId ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
			const entry = ownerAgentId ? getSessionRowProjection?.()?.sharingTarget({
				key: sessionKey,
				agentId: ownerAgentId
			})?.entry : void 0;
			const sessionVerbose = normalizeVerboseLevel(entry?.verboseLevel);
			const sessionUpdatedAt = typeof entry?.updatedAt === "number" ? entry.updatedAt : void 0;
			if (sessionVerbose && (!runVerbose || sessionUpdatedAt !== void 0 && registeredAt !== void 0 && sessionUpdatedAt >= registeredAt)) return sessionVerbose;
			if (runVerbose) return runVerbose;
			return normalizeVerboseLevel(cfg.agents?.defaults?.verboseDefault) ?? "off";
		} catch {
			return runVerbose ?? "off";
		}
	};
	const sendNodeToolPayload = (event, sessionKey, agentId, payload) => {
		const deliveryKeys = resolveSessionDeliveryKeys(sessionKey, agentId).filter(nodeHasSessionSubscribers);
		const firstDeliveryKey = deliveryKeys[0];
		if (!firstDeliveryKey) return;
		const verbose = resolveToolVerboseLevel(event, sessionKey, agentId);
		if (verbose === "off") return;
		let channelPayload = payload;
		if (verbose !== "full") {
			const data = { ...event.data };
			delete data.result;
			delete data.partialResult;
			channelPayload = {
				...payload,
				data
			};
		}
		nodeSendToSession(firstDeliveryKey, "agent", {
			...channelPayload,
			...buildSessionEventSnapshot(sessionKey, void 0, agentId)
		}, { sessionKeys: deliveryKeys });
	};
	const handleEvent = (event, restartRecoveryState) => {
		const evt = event;
		const isCurrent = shouldProcessOwnedEvent.bind(null, evt.runId, evt.contextClaimId, evt.lifecycleGeneration);
		if (!isCurrent()) return;
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : null;
		const { chatLink, sessionAgentId, sessionKey } = resolveEventSession(evt);
		const runContext = getAgentRunContext(evt.runId);
		const activeLifecycleGeneration = resolveActiveLifecycleGenerationForRun(evt.runId);
		const isControlUiVisible = evt.controlUiVisible ?? runContext?.isControlUiVisible ?? true;
		const projectSessionLifecycle = evt.projectSessionLifecycle ?? runContext?.projectSessionLifecycle ?? true;
		const projectSessionMessages = evt.projectSessionMessages ?? runContext?.projectSessionMessages ?? true;
		const clientRunId = chatLink?.clientRunId ?? evt.runId;
		const isHeartbeat = runContext?.isHeartbeat ?? evt.isHeartbeat;
		const heartbeatPolicy = resolveHeartbeatFlag(clientRunId, evt.runId, evt.isHeartbeat);
		const chatDelivery = sessionKey ? {
			sessionKey,
			agentId: sessionAgentId,
			clientRunId,
			sourceRunId: evt.runId,
			seq: evt.seq,
			controlUiVisible: isControlUiVisible
		} : void 0;
		transcriptPublication.observeAgentEvent(evt, clientRunId, isCurrent);
		const eventForClients = prepareAgentWirePayload(evt, clientRunId, chatRunState, isCurrent);
		const isAborted = isChatAbortMarkerCurrent(chatRunState.runs.get(clientRunId)?.abortMarker, chatLink) || isChatAbortMarkerCurrent(chatRunState.runs.get(evt.runId)?.abortMarker, chatLink);
		const recordsEmbeddedProgress = !chatLink && isActiveEmbeddedRunId(evt.runId);
		const recordsInFlightProgress = Boolean(chatLink) && isControlUiVisible || recordsEmbeddedProgress;
		if (lifecyclePhase !== null && (Boolean(evt.lifecycleGeneration && activeLifecycleGeneration && evt.lifecycleGeneration !== activeLifecycleGeneration) || restartRecoveryState?.suppress === true)) {
			clearPendingTerminalLifecycleError(evt.runId, evt.lifecycleGeneration);
			if (lifecyclePhase === "end" || lifecyclePhase === "error") finalizeLifecycleEvent(evt, {
				suppressRestartRecoveryProjection: true,
				restartRecoveryState
			});
			return;
		}
		if (lifecyclePhase !== null && lifecyclePhase !== "error") clearPendingTerminalLifecycleError(evt.runId);
		const publishLifecycle = evt.admitLifecyclePublication?.() ?? true;
		const spawnedBy = sessionKey ? resolveSpawnedBy(sessionKey) : null;
		const agentPayload = {
			...eventForClients,
			...sessionKey ? {
				sessionKey,
				...sessionAgentId ? { agentId: sessionAgentId } : {},
				...spawnedBy && { spawnedBy }
			} : {},
			...isHeartbeat !== void 0 && { isHeartbeat }
		};
		const hasSessionMessageSubscribers = projectSessionMessages && sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId).some((deliverySessionKey) => sessionMessageSubscribers.get(deliverySessionKey).size > 0) : false;
		const last = agentRunSeq.get(evt.runId) ?? 0;
		const isToolEvent = evt.stream === "tool";
		const isItemEvent = evt.stream === "item";
		const suppressHeartbeatToolEvents = isToolEvent && heartbeatPolicy === true;
		if (publishLifecycle && last > 0 && evt.seq !== last + 1) {
			flushBufferedAgentDeltaIfNeeded(clientRunId);
			if (isControlUiVisible) broadcast("agent", {
				runId: clientRunId,
				stream: "error",
				ts: Date.now(),
				sessionKey,
				...spawnedBy && { spawnedBy },
				...isHeartbeat !== void 0 && { isHeartbeat },
				data: {
					reason: "seq gap",
					expected: last + 1,
					received: evt.seq
				}
			}, {
				sessionKeys: sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId) : void 0,
				liveText: liveTextDelivery(chatRunState, clientRunId)
			});
			const run = chatRunState.runs.get(clientRunId);
			if (run) run.liveTextEpoch = {};
		}
		agentRunSeq.set(evt.runId, evt.seq);
		if (evt.stream === "assistant") updateRunToolErrorSummary?.({
			runId: evt.runId,
			clientRunId,
			summary: void 0
		});
		if (evt.stream === "plan" && evt.data?.phase === "update") {
			const steps = normalizeAgentPlanSteps(evt.data.steps) ?? [];
			const explanation = typeof evt.data.explanation === "string" ? evt.data.explanation.trim() : "";
			chatRunState.getOrCreate(clientRunId).planSnapshot = {
				steps,
				...explanation ? { explanation } : {}
			};
		}
		if (recordsInFlightProgress && !isAborted && !suppressHeartbeatToolEvents && publishLifecycle) chatRunState.recordProgressEvent(clientRunId, agentPayload, recordsEmbeddedProgress ? "summary" : "full");
		if (evt.stream === "run_status" && chatLink && isControlUiVisible && sessionKey && !isAborted) {
			const payload = {
				runId: clientRunId,
				sessionKey,
				...sessionAgentId ? { agentId: sessionAgentId } : {},
				...spawnedBy && { spawnedBy },
				seq: evt.seq,
				state: "status",
				...evt.data.phase === "retrying" ? {
					phase: "starting_model",
					...[
						"rate_limit",
						"overloaded",
						"server_error",
						"timeout",
						"output_limit"
					].includes(String(evt.data.reason)) ? { retry: {
						attempt: evt.data.attempt,
						maxAttempts: evt.data.maxAttempts,
						reason: evt.data.reason,
						...typeof evt.data.retryAt === "number" && Number.isFinite(evt.data.retryAt) ? { retryAt: evt.data.retryAt } : {}
					} } : {}
				} : { phase: evt.data.phase }
			};
			if (Value.Check(ChatStatusEventSchema, payload)) sendLivePayload("chat", sessionKey, payload, {
				agentId: sessionAgentId,
				controlUiVisible: true,
				dropIfSlow: true
			});
		}
		const emitAssistantChatProjection = () => {
			if (!(isControlUiVisible || hasSessionMessageSubscribers) || !chatDelivery) return;
			const assistantLiveChatInput = evt.assistantProjection ? resolveAssistantTextInput({
				...evt.data,
				...evt.assistantProjection
			}) : evt.stream === "assistant" ? resolveAssistantTextInput(evt.data) : void 0;
			const suppressAssistant = shouldSuppressAssistantEventForLiveChat(evt.data);
			if (!isAborted && assistantLiveChatInput && (!suppressAssistant || assistantLiveChatInput.itemId)) emitChatDelta({
				...chatDelivery,
				isHeartbeat: heartbeatPolicy
			}, suppressAssistant ? {
				...assistantLiveChatInput,
				text: "",
				delta: ""
			} : assistantLiveChatInput, evt.assistantSource, isCurrent);
		};
		if (isItemEvent) emitAssistantChatProjection();
		if (isToolEvent) {
			const toolPhase = typeof evt.data?.phase === "string" ? evt.data.phase : "";
			if (toolPhase === "start") updateRunToolErrorSummary?.({
				runId: evt.runId,
				clientRunId,
				summary: void 0
			});
			else if (toolPhase === "result") updateRunToolErrorSummary?.({
				runId: evt.runId,
				clientRunId,
				summary: readToolValidationErrorSummary(evt.data?.toolErrorSummary)
			});
			if (toolPhase === "start" && (isControlUiVisible || hasSessionMessageSubscribers) && chatDelivery && !isAborted && !suppressHeartbeatToolEvents) {
				flushBufferedChatDeltaIfNeeded(chatDelivery);
				flushBufferedAgentDeltaIfNeeded(clientRunId);
			}
			const runToolRecipients = toolEventRecipients.get(evt.runId);
			if (isControlUiVisible && !suppressHeartbeatToolEvents && runToolRecipients && runToolRecipients.size > 0) broadcastToConnIds("agent", sessionKey ? {
				...agentPayload,
				...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
			} : agentPayload, runToolRecipients, {
				sessionKeys: sessionKey ? resolveSessionDeliveryKeys(sessionKey, sessionAgentId) : void 0,
				liveText: liveTextDelivery(chatRunState, clientRunId)
			});
			if (!isControlUiVisible && sessionKey && hasSessionMessageSubscribers && !suppressHeartbeatToolEvents) sendAgentPayload(sessionKey, agentPayload, {
				agentId: sessionAgentId,
				controlUiVisible: false,
				dropIfSlow: true
			});
			if (isControlUiVisible && sessionKey && !suppressHeartbeatToolEvents) {
				const sessionSubscribers = new Set(sessionEventSubscribers.getAll());
				for (const connId of runToolRecipients ?? []) sessionSubscribers.delete(connId);
				if (sessionSubscribers.size > 0) broadcastToConnIds("session.tool", {
					...agentPayload,
					...buildSessionEventSnapshot(sessionKey, void 0, sessionAgentId)
				}, sessionSubscribers, {
					dropIfSlow: true,
					liveText: liveTextDelivery(chatRunState, clientRunId)
				});
			}
		} else {
			const itemPhase = isItemEvent && typeof evt.data?.phase === "string" ? evt.data.phase : "";
			if (publishLifecycle && (itemPhase === "start" || lifecyclePhase === "error" && evt.data.completionSource !== "reply-dispatch") && (isControlUiVisible || hasSessionMessageSubscribers) && !isAborted) {
				if (chatDelivery) flushBufferedChatDeltaIfNeeded({
					...chatDelivery,
					isHeartbeat: heartbeatPolicy
				});
				flushBufferedAgentDeltaIfNeeded(clientRunId);
			}
			if (publishLifecycle && (isControlUiVisible || sessionKey && hasSessionMessageSubscribers && (isItemEvent || evt.stream === "thinking" || evt.stream === "approval" || evt.stream === "lifecycle" || !isAborted && evt.stream === "assistant" && shouldMirrorAssistantEventToHiddenSessionMessages(evt.data)))) sendOrBufferAgentTextEvent(clientRunId, {
				sessionKey,
				agentId: sessionAgentId,
				controlUiVisible: isControlUiVisible,
				payload: agentPayload,
				isCurrent
			}, lifecyclePhase === "end" && !isAborted && evt.data.aborted !== true ? true : void 0);
		}
		if ((isControlUiVisible || hasSessionMessageSubscribers) && sessionKey) {
			if (isToolEvent && evt.data.phase === "result" && !evt.data.isError && !isAborted && !suppressHeartbeatToolEvents) {
				const result = extractChatToolResultCanvasPreview(evt.data.result);
				if (result?.preview.surface === "assistant_message") {
					const blocks = appendChatCanvasBlocks(chatRunState.runs.get(clientRunId)?.canvasBlocks ?? [], [{
						preview: result.preview,
						rawText: null
					}]).slice(-32);
					if (!boundedJsonUtf8Bytes(blocks, MAX_LIVE_CANVAS_BYTES).complete) {
						do
							blocks.shift();
						while (blocks.length > 0 && !boundedJsonUtf8Bytes(blocks, MAX_LIVE_CANVAS_BYTES).complete);
						logWarn("Live chat canvas preview omitted: display descriptors exceed the 64 KiB limit.");
					}
					const run = chatRunState.getOrCreate(clientRunId);
					run.canvasBlocks = blocks;
					run.bufferIsCurrent = isCurrent;
				}
			}
			if (isControlUiVisible && isToolEvent && !suppressHeartbeatToolEvents) sendNodeToolPayload(evt, sessionKey, sessionAgentId, agentPayload);
		}
		if (!isItemEvent) emitAssistantChatProjection();
		if (lifecyclePhase === "error") {
			const skipChatErrorFinal = isChatSendRunActive(evt.runId) && !chatLink;
			const definitiveTerminal = isDefinitiveRunLifecycle({
				phase: lifecyclePhase,
				data: evt.data
			});
			if (isAborted || definitiveTerminal || lifecycleErrorRetryGraceMs <= 0) finalizeLifecycleEvent(evt, {
				skipChatErrorFinal,
				publishLifecycle,
				restartRecoveryState
			});
			else {
				if (evt.data.completionSource !== "reply-dispatch") chatRunState.clearRun(clientRunId);
				scheduleTerminalLifecycleError(evt, {
					skipChatErrorFinal,
					publishLifecycle,
					restartRecoveryState
				});
			}
			return;
		}
		if (lifecyclePhase === "end") {
			finalizeLifecycleEvent(evt, {
				publishLifecycle,
				restartRecoveryState
			});
			return;
		}
		if (publishLifecycle && projectSessionLifecycle && sessionKey && (lifecyclePhase === "start" || lifecyclePhase === "model" && runContext && isControlUiVisible)) sessionLifecyclePublisher.publish({
			event: evt,
			phase: lifecyclePhase,
			sessionKey,
			agentId: sessionAgentId,
			clientRunId,
			runContext
		});
	};
	const handler = createAgentEventAdmission({
		handleEvent,
		resolveEventSession,
		isCurrent: (evt) => shouldProcessOwnedEvent(evt.runId, evt.contextClaimId, evt.lifecycleGeneration),
		dispose: () => {
			for (const pending of pendingTerminalLifecycleErrors.values()) clearTimeout(pending.timer);
			pendingTerminalLifecycleErrors.clear();
		}
	});
	const dispose = handler.dispose;
	return Object.assign(handler, {
		dispose: async () => {
			await dispose();
			await transcriptPublication.drain();
		},
		retireTranscript: transcriptPublication.retireTranscript
	});
}
//#endregion
export { createAgentEventHandler, createChatAbortMarker, createChatRunState, createSessionEventSubscriberRegistry, createSessionMessageSubscriberRegistry, resolveChatErrorKindFromError };

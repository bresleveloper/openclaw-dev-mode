import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, p as readStringValue, t as hasNonEmptyString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as sanitizeForLog } from "./ansi-zQGMgESZ.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { d as isDiagnosticsEnabled } from "./diagnostic-events-CLCyIzm6.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { a as markAutoFallbackPrimaryProbe, m as resolveAutoFallbackPrimaryProbe, n as entryMatchesAutoFallbackPrimaryProbe, t as clearAutoFallbackPrimaryProbeSelection, w as hasSessionAutoModelFallbackProvenance } from "./agent-scope-CDZXADgT.js";
import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { l as resolveOpenAIRuntimeProvider } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { i as clearAgentRunContext, m as registerAgentRunContext, n as captureAgentRunLifecycleGeneration, p as onAgentEvent, s as emitAgentEvent, y as withAgentRunLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { i as copyReplyPayloadMetadata, l as isReplyPayloadStatusNotice, p as markReplyPayloadForSourceSuppressionDelivery, t as FAST_MODE_AUTO_PROGRESS_KIND } from "./reply-payload-HLWc9ssO.js";
import { F as resolveGroupSessionKey } from "./store-DJ7wx5_V.js";
import { o as resolveMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import { i as isMarkdownCapableMessageChannel, r as isInternalMessageChannel } from "./message-channel-B4LS2Kcc.js";
import { P as updateSessionEntry } from "./session-accessor-Dx6KDG0K.js";
import { i as classifyOAuthRefreshFailureError, n as buildOAuthRefreshFailureLoginCommand, r as classifyOAuthRefreshFailure } from "./oauth-refresh-failure-CBILw9HO.js";
import { b as resolveModelRefFromString } from "./model-selection-shared-CKMggJal.js";
import { h as isCliProvider, u as resolvePersistedOverrideModelRef } from "./model-selection-i8V2iTdL.js";
import { i as isMissingProviderAuthError } from "./model-auth-runtime-shared-D8fFlbsz.js";
import "./model-auth-Bvz14MtI.js";
import { a as isAgentRunRestartAbortReason, n as AGENT_RUN_RESTART_ABORT_STOP_REASON, o as resolveAgentRunAbortLifecycleFields, r as createAgentRunRestartAbortError } from "./run-termination-CgLu4sKB.js";
import { n as formatFastModeAutoProgressText, u as resolveFastModeForElapsed } from "./fast-mode-BhVbWk_p.js";
import { _ as isRateLimitErrorMessage, d as sanitizeUserFacingText, h as isOverloadedErrorMessage, i as formatRateLimitOrOverloadedErrorCopy, m as isBillingErrorMessage, n as formatBillingErrorMessage, t as BILLING_ERROR_USER_MESSAGE } from "./sanitize-user-facing-text-CRgdQ8Wr.js";
import { b as waitForReplyRunFollowupAdmission, h as replyRunRegistry, n as ReplyRunAlreadyActiveError, o as createReplyOperation, r as ReplyRunFollowupAdmissionBlockedError } from "./reply-run-registry-BkKh9g6X.js";
import { f as logSessionTurnCreated } from "./diagnostic-CnUHR4SG.js";
import { a as isSilentReplyPrefixText, c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-Zsy11rTo.js";
import "./sessions-gBZPP61K.js";
import { c as shouldPreserveUserFacingSessionStateForInputProvenance } from "./input-provenance-CQSqbDss.js";
import { o as resolveContextTokensForModel } from "./context-CDxACcUL.js";
import "./fast-mode-BHYJgNkm.js";
import { n as GatewayDrainingError, t as CommandLaneClearedError } from "./command-queue-JAuVCy9E.js";
import { h as isContextOverflowError, m as isCompactionFailureError, w as isTransientHttpError, x as isLikelyContextOverflowError } from "./errors-C4-qHiKh.js";
import { o as isFailoverError } from "./failover-error-CZc6_Wx_.js";
import { m as resolveSendableOutboundReplyParts, s as hasOutboundReplyContent } from "./reply-payload-CBQ2d2jT.js";
import { a as resolveCliRuntimeExecutionProvider, r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-CZ8RT-Uc.js";
import { d as stripHeartbeatToken } from "./heartbeat-DeLM8EWY.js";
import { i as isRenderablePayload, t as applyReplyTagsToPayload } from "./reply-payloads-D3nOygL1.js";
import "./embedded-agent-helpers-D_zioqUQ.js";
import { M as formatToolAggregate } from "./streaming-DDEnlnFD.js";
import { d as mergeReactionDirectiveChannelData, f as parseReplyDirectives } from "./payloads-DE8cWmMT.js";
import { o as runWithModelFallback, p as LiveSessionModelSwitchError, t as isFallbackSummaryError } from "./model-fallback-xjR_RHVQ.js";
import { n as clearCliSession, r as getCliSessionBinding } from "./cli-session-Despdu3U.js";
import { c as inferToolMetaFromArgs } from "./embedded-agent-utils-B9lC4_IJ.js";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DFC5I5_X.js";
import { a as isMessagingToolSendAction } from "./embedded-agent-messaging-C11imqyu.js";
import { p as extractToolResultText } from "./embedded-agent-message-tool-source-reply-Bv3rRzLe.js";
import { a as resolveCurrentTurnImages, i as isReplyProfilerEnabled, o as resolveSilentReplyPolicy } from "./effective-reply-route-MtRva7hM.js";
import { r as formatAuthProfileFailureMessage, t as runEmbeddedAgent } from "./embedded-agent-Be0wqe1C.js";
import { n as HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT, t as GENERIC_EXTERNAL_RUN_FAILURE_TEXT } from "./agent-runner-failure-copy-D7KZsRTJ.js";
import { n as mergeEmbeddedAgentRunResultForModelFallbackExhaustion } from "./result-fallback-classifier-aUV03hEf.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-D4UDhDQN.js";
import { n as buildAgentRuntimeOutcomePlan } from "./build-CpRbl8NM.js";
import { c as resolveModelFallbackOptions, l as resolveRunAuthProfile, o as resolveQueuedReplyRuntimeConfig, s as resolveRunFastModeForFallbackCandidate, t as buildEmbeddedRunExecutionParams } from "./agent-runner-utils-CJLj28TH.js";
import { n as runCliAgent } from "./cli-runner-5VFGorN3.js";
import { t as hasInboundAudio } from "./inbound-media-BABB4m9T.js";
import { n as resolveOriginMessageProvider } from "./origin-routing-DR55bzxd.js";
import { n as createBlockReplyContentKey } from "./block-reply-pipeline-DnqkaoZV.js";
import { t as createReplyMediaContext } from "./reply-media-paths.runtime-rPkiRpjs.js";
import crypto from "node:crypto";
//#region src/auto-reply/reply/agent-lifecycle-terminal.ts
const DEFERRED_TERMINAL_METADATA_KEYS = [
	"stopReason",
	"yielded",
	"timeoutPhase",
	"providerStarted",
	"aborted",
	"livenessState",
	"replayInvalid"
];
function resolveAgentLifecycleTerminalMetadata(meta) {
	const metadata = {};
	if (!meta || typeof meta !== "object") return metadata;
	const record = meta;
	for (const key of DEFERRED_TERMINAL_METADATA_KEYS) if (Object.hasOwn(record, key)) metadata[key] = record[key];
	return metadata;
}
function createAgentLifecycleTerminalBackstop(params) {
	let terminalEmitted = false;
	let startedAt = params.startedAt;
	let deferredError;
	const deferredTerminalMetadata = {};
	const note = (evt) => {
		if (evt.stream !== "lifecycle") return;
		const phase = readStringValue(evt.data.phase);
		if (phase === "start" && typeof evt.data.startedAt === "number") startedAt = evt.data.startedAt;
		if (phase === "finishing") {
			deferredError = readStringValue(evt.data.error) ?? deferredError;
			Object.assign(deferredTerminalMetadata, resolveAgentLifecycleTerminalMetadata(evt.data));
		}
		if (phase === "end" || phase === "error") terminalEmitted = true;
	};
	const emit = (phase, resultOrError, extraData) => {
		if (terminalEmitted) return;
		terminalEmitted = true;
		const abortLifecycleFields = params.resolveAbortLifecycleFields();
		const restartAbort = abortLifecycleFields.stopReason === AGENT_RUN_RESTART_ABORT_STOP_REASON;
		const data = {
			...deferredTerminalMetadata,
			phase: restartAbort ? "end" : phase,
			endedAt: Date.now(),
			...startedAt !== void 0 ? { startedAt } : {}
		};
		if (restartAbort) {
			data.aborted = true;
			data.stopReason = AGENT_RUN_RESTART_ABORT_STOP_REASON;
		} else if (phase === "error") {
			data.error = formatErrorMessage(resultOrError);
			Object.assign(data, abortLifecycleFields);
		} else {
			const meta = resultOrError && typeof resultOrError === "object" && "meta" in resultOrError ? resultOrError.meta : void 0;
			Object.assign(data, resolveAgentLifecycleTerminalMetadata(meta));
			if (abortLifecycleFields.aborted === true) data.aborted = true;
			if (abortLifecycleFields.stopReason && !readStringValue(data.stopReason)) data.stopReason = abortLifecycleFields.stopReason;
		}
		if (extraData) Object.assign(data, extraData);
		emitAgentEvent({
			runId: params.runId,
			lifecycleGeneration: params.getLifecycleGeneration(),
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			stream: "lifecycle",
			data
		});
	};
	return {
		emit,
		getDeferredError: () => deferredError,
		note
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-cli-dispatch.ts
function isClaudeCliProvider(provider) {
	return normalizeLowercaseStringOrEmpty(provider) === "claude-cli";
}
function shouldBridgeCliAssistantTextToReasoning(provider) {
	return isClaudeCliProvider(provider);
}
function createAgentEventBridge(params) {
	const deliver = params.deliver;
	if (!deliver) return {
		unsubscribe: () => void 0,
		drain: async () => void 0
	};
	let unsubscribed = false;
	let delivery = Promise.resolve();
	const rawUnsubscribe = onAgentEvent((evt) => {
		if (evt.runId !== params.runId) return;
		if (params.suppressed) return;
		const payload = params.read(evt);
		if (payload === void 0) return;
		delivery = delivery.then(() => deliver(payload)).catch(() => void 0);
	});
	return {
		unsubscribe() {
			if (unsubscribed) return;
			unsubscribed = true;
			rawUnsubscribe();
		},
		async drain() {
			await delivery;
		}
	};
}
async function stopAgentEventBridges(bridges) {
	for (const bridge of bridges) bridge.unsubscribe();
	for (const bridge of bridges) await bridge.drain();
}
function createAssistantTextBridge(params) {
	let lastText;
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		read: (evt) => {
			if (evt.stream !== "assistant") return;
			const text = typeof evt.data.text === "string" ? evt.data.text : void 0;
			if (text === void 0 || text === lastText) return;
			lastText = text;
			return text;
		}
	});
}
function readCommentaryTextPayload(evt) {
	if (evt.stream !== "item" || evt.data.kind !== "preamble") return;
	const text = typeof evt.data.progressText === "string" ? evt.data.progressText.trim() : "";
	if (!text) return;
	return {
		text,
		...typeof evt.data.itemId === "string" ? { itemId: evt.data.itemId } : {}
	};
}
function keepCliSessionBindingOnlyWhenReused(params) {
	const existingSessionId = normalizeOptionalString(params.existingSessionId);
	const agentMeta = params.result.meta.agentMeta;
	const returnedSessionId = normalizeOptionalString(agentMeta?.cliSessionBinding?.sessionId);
	const shouldClearStoredSession = agentMeta?.clearCliSessionBinding === true;
	if (agentMeta === void 0 || !shouldClearStoredSession && existingSessionId === void 0 || returnedSessionId === existingSessionId) return params.result;
	if (returnedSessionId || shouldClearStoredSession) params.onDroppedReplacement?.();
	return {
		...params.result,
		meta: {
			...params.result.meta,
			agentMeta: {
				...agentMeta,
				sessionId: "",
				cliSessionBinding: void 0,
				clearCliSessionBinding: void 0
			}
		}
	};
}
async function clearDroppedCliSessionBinding(params) {
	const updatedAt = Date.now();
	const clearEntry = (entry) => {
		if (!entry) return;
		clearCliSession(entry, params.provider);
		entry.updatedAt = updatedAt;
	};
	clearEntry(params.activeSessionEntry);
	clearEntry(params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (!params.storePath || !params.sessionKey) return;
	await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, (entry) => {
		clearEntry(entry);
		return entry;
	});
}
function createToolEventBridge(params) {
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		read: (evt) => {
			if (evt.stream !== "tool") return;
			const phaseValue = evt.data.phase;
			if (phaseValue !== "start" && phaseValue !== "update" && phaseValue !== "result") return;
			const phase = phaseValue === "start" ? "start" : phaseValue === "update" ? "update" : "result";
			return {
				name: typeof evt.data.name === "string" ? evt.data.name : void 0,
				phase,
				args: isRecord(evt.data.args) ? evt.data.args : void 0,
				toolCallId: typeof evt.data.toolCallId === "string" ? evt.data.toolCallId : void 0,
				...phase === "result" ? {
					isError: evt.data.isError === true,
					result: evt.data.result
				} : {}
			};
		}
	});
}
/**
* Tracks CLI tool start/result events and renders the same durable tool
* summaries the embedded runner emits: a formatToolAggregate line per result
* (args-derived meta captured at start), plus the output block under full
* verbose. Keeps CLI runs at tool-summary parity with embedded runs.
*/
function createCliToolSummaryTracker(params) {
	const metaByCallId = /* @__PURE__ */ new Map();
	return { noteToolEvent: async (payload) => {
		if (payload.phase === "start") {
			if (payload.toolCallId && payload.name) metaByCallId.set(payload.toolCallId, inferToolMetaFromArgs(payload.name, payload.args, { detailMode: params.detailMode ?? "explain" }));
			return;
		}
		if (payload.phase !== "result") return;
		const meta = payload.toolCallId ? metaByCallId.get(payload.toolCallId) : void 0;
		if (payload.toolCallId) metaByCallId.delete(payload.toolCallId);
		if (!params.shouldEmitToolResult()) return;
		const aggregate = formatToolAggregate(payload.name, meta ? [meta] : void 0, { markdown: true });
		let text = aggregate;
		if (params.shouldEmitToolOutput()) {
			const output = extractToolResultText(payload.result)?.trim();
			if (output) text = `${aggregate}\n\`\`\`txt\n${output}\n\`\`\``;
		}
		if (!text.trim()) return;
		await params.deliver({
			text,
			...payload.isError === true ? { isError: true } : {}
		});
	} };
}
function createCommentaryEventBridge(params) {
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		read: readCommentaryTextPayload
	});
}
function createToolBoundaryBridge(params) {
	return createAgentEventBridge({
		runId: params.runId,
		suppressed: params.suppressed,
		deliver: params.deliver,
		read: (evt) => {
			if (evt.stream !== "tool") return;
			const phase = typeof evt.data.phase === "string" ? evt.data.phase : "";
			return [
				"completed",
				"end",
				"error",
				"result"
			].includes(phase) ? true : void 0;
		}
	});
}
function runCliAgentWithLifecycle(params) {
	if (!params.lifecycleGeneration) return runCliAgentWithLifecycleInternal(params);
	return withAgentRunLifecycleGeneration(params.lifecycleGeneration, () => runCliAgentWithLifecycleInternal(params));
}
async function runCliAgentWithLifecycleInternal(params) {
	const startedAt = params.startedAt ?? Date.now();
	const fastModeStartedAtMs = params.runParams.fastModeStartedAtMs ?? startedAt;
	const fastModeAutoOnSeconds = params.runParams.fastModeAutoOnSeconds ?? 60;
	const fastModeAutoProgressState = params.runParams.fastModeAutoProgressState ?? {
		offAnnounced: false,
		resetAnnounced: false
	};
	const emitFastModeAutoProgress = async (payload) => {
		const summary = formatFastModeAutoProgressText(payload);
		emitAgentEvent({
			runId: params.runId,
			stream: "item",
			data: {
				kind: "status",
				title: "Fast",
				phase: "update",
				summary
			},
			...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {}
		});
		try {
			await params.onFastModeAutoProgress?.({
				text: summary,
				channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
			});
		} catch {}
	};
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.runParams.fastMode !== "auto" || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveFastModeForElapsed({
			mode: "auto",
			startedAtMs: fastModeStartedAtMs,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const maybeEmitFastModeAutoReset = async () => {
		if (params.runParams.fastMode !== "auto" || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
		fastModeAutoProgressState.resetAnnounced = true;
		await emitFastModeAutoProgress({
			enabled: true,
			elapsedSeconds: 0,
			fastAutoOnSeconds: fastModeAutoOnSeconds
		});
	};
	const emitLifecycleStart = params.emitLifecycleStart ?? true;
	const emitLifecycleTerminal = params.emitLifecycleTerminal ?? true;
	params.onAgentRunStart?.();
	if (emitLifecycleStart) emitAgentEvent({
		runId: params.runId,
		...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
		...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: {
			phase: "start",
			startedAt
		}
	});
	const bridges = [
		createAssistantTextBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onAssistantText
		}),
		createAssistantTextBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: shouldBridgeCliAssistantTextToReasoning(params.provider) ? params.onReasoningText : void 0
		}),
		createToolEventBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onToolEvent
		}),
		createCommentaryEventBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: params.onCommentaryText
		}),
		createToolBoundaryBridge({
			runId: params.runId,
			suppressed: params.suppressAssistantBridge,
			deliver: maybeAnnounceFastModeAutoOff
		})
	].filter((bridge) => bridge !== void 0);
	let lifecycleTerminalEmitted = false;
	try {
		const rawResult = await runCliAgent({
			...params.runParams,
			emitCommentaryText: params.runParams.emitCommentaryText ?? Boolean(params.onCommentaryText)
		});
		const restartAbortReason = params.runParams.abortSignal?.reason;
		if (isAgentRunRestartAbortReason(restartAbortReason)) throw restartAbortReason;
		const result = params.transformResult?.(rawResult) ?? rawResult;
		await stopAgentEventBridges(bridges);
		const cliText = normalizeOptionalString(result.payloads?.[0]?.text);
		if (cliText) emitAgentEvent({
			runId: params.runId,
			stream: "assistant",
			data: { text: cliText }
		});
		if (emitLifecycleTerminal) {
			emitAgentEvent({
				runId: params.runId,
				...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
				...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
				...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
				stream: "lifecycle",
				data: {
					phase: "end",
					startedAt,
					endedAt: Date.now(),
					...resolveAgentLifecycleTerminalMetadata(result.meta),
					...resolveAgentRunAbortLifecycleFields(params.runParams.abortSignal)
				}
			});
			lifecycleTerminalEmitted = true;
		}
		return result;
	} catch (err) {
		await stopAgentEventBridges(bridges);
		await params.onErrorBeforeLifecycle?.(err);
		if (emitLifecycleTerminal) {
			emitAgentEvent({
				runId: params.runId,
				...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
				...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
				...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
				stream: "lifecycle",
				data: {
					phase: "error",
					startedAt,
					endedAt: Date.now(),
					error: String(err),
					...resolveAgentRunAbortLifecycleFields(params.runParams.abortSignal)
				}
			});
			lifecycleTerminalEmitted = true;
		}
		throw err;
	} finally {
		for (const bridge of bridges) bridge.unsubscribe();
		if (params.runParams.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoReset();
		if (emitLifecycleTerminal && !lifecycleTerminalEmitted) emitAgentEvent({
			runId: params.runId,
			...params.runParams.sessionKey ? { sessionKey: params.runParams.sessionKey } : {},
			...params.runParams.sessionId ? { sessionId: params.runParams.sessionId } : {},
			...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
			stream: "lifecycle",
			data: {
				phase: "error",
				startedAt,
				endedAt: Date.now(),
				error: "CLI run completed without lifecycle terminal event",
				...resolveAgentRunAbortLifecycleFields(params.runParams.abortSignal)
			}
		});
	}
}
//#endregion
//#region src/auto-reply/reply/compaction-notice.ts
const COMPACTION_NOTICE_TEXT = {
	start: "🧹 Compacting context...",
	end: "🧹 Compaction complete",
	incomplete: "🧹 Compaction incomplete",
	skipped: "🧹 Compaction not needed"
};
function shouldNotifyUserAboutCompaction(cfg) {
	return cfg?.agents?.defaults?.compaction?.notifyUser === true;
}
function createCompactionNoticePayload(params) {
	const payload = {
		text: COMPACTION_NOTICE_TEXT[params.phase],
		...params.currentMessageId ? { replyToId: params.currentMessageId } : {},
		replyToCurrent: true,
		isCompactionNotice: true
	};
	return params.applyReplyToMode ? params.applyReplyToMode(payload) : payload;
}
function readCompactionHookMessages(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
}
function createCompactionHookNoticePayload(params) {
	if (params.messages.length === 0) return;
	const payload = {
		text: params.messages.join("\n\n"),
		...params.currentMessageId ? { replyToId: params.currentMessageId } : {},
		replyToCurrent: true,
		isCompactionNotice: true
	};
	return params.applyReplyToMode ? params.applyReplyToMode(payload) : payload;
}
//#endregion
//#region src/auto-reply/reply/provider-request-error-classifier.ts
/** User-facing copy for provider-side broken conversation state. */
const PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE = "⚠️ The model provider rejected the conversation state. Please try again, or use /new to start a fresh session.";
const PROVIDER_RATE_LIMIT_OR_QUOTA_ERROR_USER_MESSAGE = "⚠️ The model provider returned HTTP 429 before replying. This can mean rate limiting, exhausted quota, or an account balance/billing issue. Check the selected provider/model, API key, and provider billing/quota dashboard, then try again.";
const PROVIDER_INTERNAL_ERROR_USER_MESSAGE = "⚠️ The model provider returned a temporary internal error before replying. Try again in a moment, or switch to another model if it keeps happening.";
/** Classifies provider request failures that are actionable for users. */
function classifyProviderRequestError(err) {
	const technicalMessage = formatErrorMessage(err);
	if (hasHttp429Evidence(err, technicalMessage) && isGenericProviderRuntimeErrorMessage(technicalMessage)) return {
		code: "provider_rate_limit_or_quota_error",
		userMessage: PROVIDER_RATE_LIMIT_OR_QUOTA_ERROR_USER_MESSAGE,
		technicalMessage
	};
	if (isProviderConversationStateErrorMessage(technicalMessage)) return {
		code: "provider_conversation_state_error",
		userMessage: PROVIDER_CONVERSATION_STATE_ERROR_USER_MESSAGE,
		technicalMessage
	};
	if (isProviderInternalErrorMessage(technicalMessage)) return {
		code: "provider_internal_error",
		userMessage: PROVIDER_INTERNAL_ERROR_USER_MESSAGE,
		technicalMessage
	};
}
/** Detects provider errors that indicate invalid conversation/tool turn state. */
function isProviderConversationStateErrorMessage(message) {
	const lower = normalizeLowercaseStringOrEmpty(message);
	return lower.includes("custom tool call output is missing") && lower.includes("call id") || lower.includes("toolresult") && lower.includes("tooluse") && lower.includes("exceeds the number") && lower.includes("previous turn") || lower.includes("function call turn comes immediately after") || lower.includes("incorrect role information") || lower.includes("roles must alternate") || lower.includes("invalid_replay_transcript");
}
function isGenericProviderRuntimeErrorMessage(message) {
	const lower = normalizeLowercaseStringOrEmpty(message);
	return lower.includes("an error occurred while processing your request") || lower.includes("something went wrong while processing your request");
}
function isProviderInternalErrorMessage(message) {
	const lower = normalizeLowercaseStringOrEmpty(message);
	return lower.includes("the ai service returned an internal error") || lower.includes("provider returned an internal error") || isGenericProviderRuntimeErrorMessage(message) && (lower.includes("server_error") || lower.includes("internal error"));
}
function hasHttp429Evidence(err, message) {
	return readHttp429Status(err) || /\b(?:http\s*)?429\b|["'](?:status|code)["']\s*:\s*429\b/iu.test(message);
}
function readHttp429Status(err, seen = /* @__PURE__ */ new Set()) {
	if (!err || typeof err !== "object" || seen.has(err)) return false;
	seen.add(err);
	const candidate = err.status ?? err.statusCode;
	if (typeof candidate === "number" && Number.isFinite(candidate)) {
		if (candidate === 429) return true;
	} else if (typeof candidate === "string" && Number(candidate.trim()) === 429) return true;
	const nested = err;
	return readHttp429Status(nested.response, seen) || readHttp429Status(nested.error, seen) || readHttp429Status(nested.cause, seen);
}
//#endregion
//#region src/auto-reply/reply/reply-delivery.ts
/** Normalizes reply directives and delivers block replies through streaming or direct paths. */
/** Parses inline reply directives into payload fields and silent-reply state. */
function normalizeReplyPayloadDirectives(params) {
	const parseMode = params.parseMode ?? "always";
	const silentToken = params.silentToken ?? "NO_REPLY";
	const sourceText = params.payload.text ?? "";
	const parsed = parseMode === "always" || parseMode === "auto" && (sourceText.includes("[[") || params.extractMediaDirectives !== false && /media:/i.test(sourceText) || params.extractMarkdownImages === true && /!\[[^\]]*]\(/.test(sourceText) || sourceText.includes(silentToken)) ? parseReplyDirectives(sourceText, {
		currentMessageId: params.currentMessageId,
		silentToken,
		extractMarkdownImages: params.extractMarkdownImages,
		extractMediaDirectives: params.extractMediaDirectives
	}) : void 0;
	let text = parsed ? parsed.text || void 0 : params.payload.text || void 0;
	if (params.trimLeadingWhitespace && text) text = text.trimStart() || void 0;
	const mediaUrls = params.payload.mediaUrls ?? parsed?.mediaUrls;
	const mediaUrl = params.payload.mediaUrl ?? parsed?.mediaUrl ?? mediaUrls?.[0];
	const channelData = mergeReactionDirectiveChannelData(params.payload.channelData, parsed?.reaction);
	return {
		payload: copyReplyPayloadMetadata(params.payload, {
			...params.payload,
			text,
			mediaUrls,
			mediaUrl,
			replyToId: params.payload.replyToId ?? parsed?.replyToId,
			replyToTag: params.payload.replyToTag || parsed?.replyToTag,
			replyToCurrent: params.payload.replyToCurrent || parsed?.replyToCurrent,
			audioAsVoice: Boolean(params.payload.audioAsVoice || parsed?.audioAsVoice),
			...channelData ? { channelData } : {}
		}),
		isSilent: parsed?.isSilent ?? false
	};
}
async function sendDirectBlockReply(params) {
	const deliveryIndex = params.directlySentBlockPayloads.length;
	params.directlySentBlockPayloads.push(void 0);
	await params.onBlockReply(params.payload);
	params.directlySentBlockKeys.add(createBlockReplyContentKey(params.trackingPayload));
	if (!isReplyPayloadStatusNotice(params.trackingPayload)) params.directlySentBlockPayloads[deliveryIndex] = params.trackingPayload;
}
/** Creates the handler used for assistant block replies during streaming/tool phases. */
function createBlockReplyDeliveryHandler(params) {
	return async (payload) => {
		const { text, skip } = params.normalizeStreamingText(payload);
		if (skip && !hasOutboundReplyContent({
			...payload,
			text: void 0
		})) return;
		const implicitCurrentMessageAllowed = payload.replyToCurrent === true ? true : payload.replyToCurrent === false ? false : params.replyThreading?.implicitCurrentMessage !== "deny";
		const taggedPayload = applyReplyTagsToPayload({
			...payload,
			text,
			mediaUrl: payload.mediaUrl ?? payload.mediaUrls?.[0],
			replyToId: payload.replyToId ?? (implicitCurrentMessageAllowed ? params.currentMessageId : void 0)
		}, params.currentMessageId);
		if (!isRenderablePayload(taggedPayload) && !payload.audioAsVoice) return;
		const normalized = normalizeReplyPayloadDirectives({
			payload: taggedPayload,
			currentMessageId: params.currentMessageId,
			silentToken: SILENT_REPLY_TOKEN,
			trimLeadingWhitespace: true,
			parseMode: "auto",
			extractMediaDirectives: false
		});
		const mediaNormalizedPayload = params.normalizeMediaPaths ? await params.normalizeMediaPaths(normalized.payload) : normalized.payload;
		if (normalized.isSilent) mediaNormalizedPayload.text = void 0;
		const blockPayload = copyReplyPayloadMetadata(payload, params.applyReplyToMode(mediaNormalizedPayload));
		const blockHasNonTextContent = hasOutboundReplyContent({
			...blockPayload,
			text: void 0
		});
		if (!blockPayload.text && !blockHasNonTextContent && !blockPayload.audioAsVoice) return;
		if (normalized.isSilent && !blockHasNonTextContent) return;
		if (blockPayload.text) params.typingSignals.signalTextDelta(blockPayload.text).catch((err) => {
			logVerbose(`block reply typing signal failed: ${String(err)}`);
		});
		if (params.blockStreamingEnabled && params.blockReplyPipeline) params.blockReplyPipeline.enqueue(blockPayload);
		else if (params.blockStreamingEnabled) await sendDirectBlockReply({
			onBlockReply: params.onBlockReply,
			directlySentBlockKeys: params.directlySentBlockKeys,
			directlySentBlockPayloads: params.directlySentBlockPayloads,
			trackingPayload: blockPayload,
			payload: blockPayload
		});
		else if (blockHasNonTextContent) await sendDirectBlockReply({
			onBlockReply: params.onBlockReply,
			directlySentBlockKeys: params.directlySentBlockKeys,
			directlySentBlockPayloads: params.directlySentBlockPayloads,
			trackingPayload: blockPayload,
			payload: blockPayload
		});
	};
}
const agentTurnTimingLog = createSubsystemLogger("auto-reply/agent-turn-timing");
const agentCompactionLog = createSubsystemLogger("auto-reply/compaction");
const CODEX_APP_SERVER_COMPACTION_BACKEND = "codex-app-server";
const AGENT_TURN_TIMING_WARN_TOTAL_MS = 1e3;
const AGENT_TURN_TIMING_WARN_STAGE_MS = 500;
function formatCompactionModelRef(provider, model) {
	const normalizedProvider = normalizeOptionalString(provider);
	const normalizedModel = normalizeOptionalString(model);
	if (normalizedProvider && normalizedModel) return `${sanitizeForLog(normalizedProvider)}/${sanitizeForLog(normalizedModel)}`;
	if (normalizedProvider) return sanitizeForLog(normalizedProvider);
	if (normalizedModel) return sanitizeForLog(normalizedModel);
	return "unknown model";
}
function createAgentTurnTimingTracker(options = {}) {
	if (!options.profilerEnabled) return {
		async measure(_name, run) {
			return await run();
		},
		measureSync(_name, run) {
			return run();
		},
		logIfSlow() {},
		logMilestoneIfSlow() {}
	};
	const startedAt = Date.now();
	let didLog = false;
	const spans = [];
	const toMs = (value) => Math.max(0, Math.round(value));
	const record = (name, spanStartedAt) => {
		spans.push({
			name,
			durationMs: toMs(Date.now() - spanStartedAt),
			elapsedMs: toMs(Date.now() - startedAt)
		});
	};
	const snapshot = () => ({
		totalMs: toMs(Date.now() - startedAt),
		spans: spans.slice()
	});
	const shouldLog = (summary) => summary.totalMs >= AGENT_TURN_TIMING_WARN_TOTAL_MS || summary.spans.some((span) => span.durationMs >= AGENT_TURN_TIMING_WARN_STAGE_MS);
	const formatSpans = (summary) => summary.spans.length > 0 ? summary.spans.map((span) => `${span.name}:${span.durationMs}ms@${span.elapsedMs}ms`).join(",") : "none";
	return {
		async measure(name, run) {
			const spanStartedAt = Date.now();
			try {
				return await run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		measureSync(name, run) {
			const spanStartedAt = Date.now();
			try {
				return run();
			} finally {
				record(name, spanStartedAt);
			}
		},
		logIfSlow(params) {
			if (didLog) return;
			const summary = snapshot();
			if (!shouldLog(summary)) return;
			didLog = true;
			agentTurnTimingLog.warn(`agent turn timings runId=${params.runId} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} outcome=${params.outcome} totalMs=${summary.totalMs} stages=${formatSpans(summary)}${params.error ? ` error="${params.error}"` : ""}`, {
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				outcome: params.outcome,
				error: params.error,
				totalMs: summary.totalMs,
				spans: summary.spans
			});
		},
		logMilestoneIfSlow(params) {
			if (!options.profilerEnabled) return;
			const summary = snapshot();
			if (!shouldLog(summary)) return;
			agentTurnTimingLog.warn(`agent turn milestone runId=${params.runId} sessionId=${params.sessionId ?? "unknown"} sessionKey=${params.sessionKey ?? "unknown"} milestone=${params.milestone} totalMs=${summary.totalMs} stages=${formatSpans(summary)}`, {
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				milestone: params.milestone,
				totalMs: summary.totalMs,
				spans: summary.spans
			});
		}
	};
}
function readApprovalScopeValue(value) {
	return value === "turn" || value === "session" ? value : void 0;
}
function readRecordValue(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readFiniteNumberValue(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function readNullableNumberValue(value) {
	if (value === null) return null;
	return readFiniteNumberValue(value);
}
function isCommandToolName(name) {
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return normalized === "exec" || normalized === "bash" || normalized === "shell";
}
function buildCommandOutputFromToolResultEvent(evt) {
	if (evt.stream !== "tool" || readStringValue(evt.data.phase) !== "result") return;
	const name = readStringValue(evt.data.name);
	if (!isCommandToolName(name)) return;
	const result = readRecordValue(evt.data.result);
	const details = readRecordValue(result?.details);
	const output = readStringValue(evt.data.output) ?? readStringValue(result?.output) ?? readStringValue(details?.output);
	const explicitStatus = readStringValue(evt.data.status) ?? readStringValue(result?.status) ?? readStringValue(details?.status);
	const exitCode = readNullableNumberValue(result?.exitCode ?? details?.exitCode ?? evt.data.exitCode);
	const durationMs = readFiniteNumberValue(result?.durationMs ?? details?.durationMs ?? evt.data.durationMs);
	const cwd = readStringValue(evt.data.cwd);
	if (!(output !== void 0 || explicitStatus !== void 0 || exitCode !== void 0 || durationMs !== void 0 || cwd !== void 0 || result !== void 0 && Object.keys(result).length > 0)) return;
	const errorStatus = evt.data.isError === true ? "failed" : evt.data.isError === false ? "completed" : void 0;
	const status = explicitStatus ?? errorStatus;
	return {
		itemId: readStringValue(evt.data.itemId),
		phase: "end",
		title: readStringValue(evt.data.title),
		toolCallId: readStringValue(evt.data.toolCallId),
		name,
		output,
		status,
		exitCode,
		durationMs,
		cwd
	};
}
const FALLBACK_SELECTION_STATE_KEYS = [
	"providerOverride",
	"modelOverride",
	"modelOverrideSource",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"authProfileOverride",
	"authProfileOverrideSource",
	"authProfileOverrideCompactionCount"
];
function setFallbackSelectionStateField(entry, key, value) {
	switch (key) {
		case "providerOverride":
			if (entry.providerOverride !== value) {
				entry.providerOverride = value;
				return true;
			}
			return false;
		case "modelOverride":
			if (entry.modelOverride !== value) {
				entry.modelOverride = value;
				return true;
			}
			return false;
		case "modelOverrideSource":
			if (entry.modelOverrideSource !== value) {
				entry.modelOverrideSource = value;
				return true;
			}
			return false;
		case "modelOverrideFallbackOriginProvider":
			if (entry.modelOverrideFallbackOriginProvider !== value) {
				entry.modelOverrideFallbackOriginProvider = value;
				return true;
			}
			return false;
		case "modelOverrideFallbackOriginModel":
			if (entry.modelOverrideFallbackOriginModel !== value) {
				entry.modelOverrideFallbackOriginModel = value;
				return true;
			}
			return false;
		case "authProfileOverride":
			if (entry.authProfileOverride !== value) {
				entry.authProfileOverride = value;
				return true;
			}
			return false;
		case "authProfileOverrideSource":
			if (entry.authProfileOverrideSource !== value) {
				entry.authProfileOverrideSource = value;
				return true;
			}
			return false;
		case "authProfileOverrideCompactionCount":
			if (entry.authProfileOverrideCompactionCount !== value) {
				entry.authProfileOverrideCompactionCount = value;
				return true;
			}
			return false;
	}
	throw new Error("Unsupported fallback selection state key");
}
function snapshotFallbackSelectionState(entry) {
	return {
		providerOverride: entry.providerOverride,
		modelOverride: entry.modelOverride,
		modelOverrideSource: entry.modelOverrideSource,
		modelOverrideFallbackOriginProvider: entry.modelOverrideFallbackOriginProvider,
		modelOverrideFallbackOriginModel: entry.modelOverrideFallbackOriginModel,
		authProfileOverride: entry.authProfileOverride,
		authProfileOverrideSource: entry.authProfileOverrideSource,
		authProfileOverrideCompactionCount: entry.authProfileOverrideCompactionCount
	};
}
function buildFallbackSelectionStatePatch(entry) {
	return {
		...snapshotFallbackSelectionState(entry),
		updatedAt: entry.updatedAt
	};
}
function buildFallbackSelectionState(params) {
	return {
		providerOverride: params.provider,
		modelOverride: params.model,
		modelOverrideSource: "auto",
		modelOverrideFallbackOriginProvider: params.originProvider,
		modelOverrideFallbackOriginModel: params.originModel,
		authProfileOverride: params.authProfileId,
		authProfileOverrideSource: params.authProfileId ? params.authProfileIdSource : void 0,
		authProfileOverrideCompactionCount: void 0
	};
}
function resolveFallbackSelectionOrigin(params) {
	if (params.entry.modelOverrideSource === "auto" || params.entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(params.entry)) {
		const persistedOriginProvider = normalizeOptionalString(params.entry.modelOverrideFallbackOriginProvider);
		const persistedOriginModel = normalizeOptionalString(params.entry.modelOverrideFallbackOriginModel);
		if (persistedOriginProvider && persistedOriginModel) return {
			provider: persistedOriginProvider,
			model: persistedOriginModel
		};
	}
	return {
		provider: params.run.provider,
		model: params.run.model
	};
}
/** Persists the fallback candidate selection onto a session entry. */
function applyFallbackCandidateSelectionToEntry(params) {
	if (!params.force && params.provider === params.run.provider && params.model === params.run.model) return { updated: false };
	const scopedAuthProfile = resolveRunAuthProfile(params.run, params.provider);
	const origin = params.origin ?? resolveFallbackSelectionOrigin({
		entry: params.entry,
		run: params.run
	});
	const nextState = buildFallbackSelectionState({
		provider: params.provider,
		model: params.model,
		originProvider: origin.provider,
		originModel: origin.model,
		authProfileId: scopedAuthProfile.authProfileId,
		authProfileIdSource: scopedAuthProfile.authProfileIdSource
	});
	return {
		updated: applyFallbackSelectionState(params.entry, nextState, params.now),
		nextState
	};
}
function applyFallbackSelectionState(entry, nextState, now = Date.now()) {
	let updated = false;
	for (const key of FALLBACK_SELECTION_STATE_KEYS) {
		const nextValue = nextState[key];
		if (nextValue === void 0) {
			if (Object.hasOwn(entry, key)) {
				delete entry[key];
				updated = true;
			}
			continue;
		}
		if (entry[key] !== nextValue) updated = setFallbackSelectionStateField(entry, key, nextValue) || updated;
	}
	if (updated) entry.updatedAt = now;
	return updated;
}
function rollbackFallbackSelectionStateIfUnchanged(entry, expectedState, previousState, now = Date.now()) {
	let updated = false;
	for (const key of FALLBACK_SELECTION_STATE_KEYS) {
		if (entry[key] !== expectedState[key]) continue;
		const previousValue = previousState[key];
		if (previousValue === void 0) {
			if (Object.hasOwn(entry, key)) {
				delete entry[key];
				updated = true;
			}
			continue;
		}
		if (entry[key] !== previousValue) updated = setFallbackSelectionStateField(entry, key, previousValue) || updated;
	}
	if (updated) entry.updatedAt = now;
	return updated;
}
/**
* Build a human-friendly rate-limit message from a FallbackSummaryError.
* Includes a countdown when the soonest cooldown expiry is known.
*/
function buildRateLimitCooldownMessage(err) {
	const codexUsageLimitMessage = extractCodexUsageLimitErrorMessage(err);
	if (codexUsageLimitMessage) return codexUsageLimitMessage;
	if (isFallbackSummaryError(err) && hasBillingAttemptSummary(err)) return BILLING_ERROR_USER_MESSAGE;
	if (isBillingErrorMessage(formatErrorMessage(err))) return BILLING_ERROR_USER_MESSAGE;
	if (!isFallbackSummaryError(err)) return "⚠️ All models are temporarily rate-limited. Please try again in a few minutes.";
	const expiry = err.soonestCooldownExpiry;
	const now = Date.now();
	if (typeof expiry === "number" && expiry > now) {
		const secsLeft = Math.max(1, Math.ceil((expiry - now) / 1e3));
		if (secsLeft <= 60) return `⚠️ Rate-limited — ready in ~${secsLeft}s. Please wait a moment.`;
		return `⚠️ Rate-limited — ready in ~${Math.ceil(secsLeft / 60)} min. Please try again shortly.`;
	}
	return "⚠️ All models are temporarily rate-limited. Please try again in a few minutes.";
}
function resolveBillingFailureReplyText(err) {
	const billingFailure = isFallbackSummaryError(err) ? err.attempts.find((attempt) => attempt.reason === "billing" && (attempt.authMode === "oauth" || attempt.authMode === "token")) : isFailoverError(err) && err.reason === "billing" ? err : void 0;
	if (!billingFailure || billingFailure.authMode !== "oauth" && billingFailure.authMode !== "token") return BILLING_ERROR_USER_MESSAGE;
	return formatBillingErrorMessage(billingFailure.provider, billingFailure.model, billingFailure.authMode);
}
function extractCodexUsageLimitErrorMessage(err) {
	if (isFallbackSummaryError(err)) {
		for (const attempt of err.attempts) {
			const message = extractCodexUsageLimitMessage(attempt.error);
			if (message) return `⚠️ ${message}`;
		}
		return;
	}
	const message = extractCodexUsageLimitMessage(formatErrorMessage(err));
	return message ? `⚠️ ${message}` : void 0;
}
function extractCodexUsageLimitMessage(text) {
	const markers = ["You've reached your Codex subscription usage limit.", "Codex usage limit reached."];
	let markerIndex;
	for (const marker of markers) {
		const index = text.indexOf(marker);
		if (index >= 0 && (markerIndex === void 0 || index < markerIndex)) markerIndex = index;
	}
	if (markerIndex === void 0) return;
	const message = sanitizeUserFacingText(text.slice(markerIndex), { errorContext: true }).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).join(" ").trim();
	if (!message) return;
	return message.length > 500 ? `${message.slice(0, 497)}...` : message;
}
function isPureTransientRateLimitSummary(err) {
	return isFallbackSummaryError(err) && err.attempts.length > 0 && err.attempts.every((attempt) => {
		const reason = attempt.reason;
		return reason === "rate_limit" || reason === "overloaded";
	});
}
function hasBillingAttemptSummary(err) {
	return isFallbackSummaryError(err) && err.attempts.length > 0 && err.attempts.some((attempt) => attempt.reason === "billing");
}
function collapseRepeatedFailureDetail(message) {
	const parts = message.split(/\s+\|\s+/u).map((part) => part.trim()).filter(Boolean);
	if (parts.length >= 2 && parts.every((part) => part === parts[0])) return parts[0];
	return message.trim();
}
const SAFE_MISSING_API_KEY_PROVIDERS = new Set([
	"anthropic",
	"google",
	"openai"
]);
const EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS = 900;
const AGENT_FAILED_BEFORE_REPLY_TEXT = "Agent failed before reply:";
const PREFLIGHT_COMPACTION_FAILURE_PREFIX = "Preflight compaction required but failed:";
function isNonDirectConversationContext(ctx) {
	const chatType = normalizeLowercaseStringOrEmpty(ctx.ChatType);
	return chatType === "group" || chatType === "channel";
}
function isVerboseFailureDetailEnabled(level) {
	return level === "on" || level === "full";
}
function resolveExternalRunFailureTextForConversation(params) {
	if (!isNonDirectConversationContext(params.sessionCtx)) return params.text;
	if (!params.isGenericRunnerFailure && !params.text.includes(AGENT_FAILED_BEFORE_REPLY_TEXT)) return params.text;
	if (resolveSilentReplyPolicy({
		cfg: params.cfg,
		sessionKey: params.sessionCtx.SessionKey,
		surface: params.sessionCtx.Surface ?? params.sessionCtx.Provider,
		conversationType: "group"
	}) === "disallow") return params.text;
	return SILENT_REPLY_TOKEN;
}
const CLI_BACKEND_NO_OUTPUT_STALL_RE = /\bCLI produced no output for\s+(\d+)\s*s\s+and was terminated\b/iu;
const CLI_BACKEND_OVERALL_TIMEOUT_RE = /\bCLI exceeded timeout\s*\(\s*(\d+)\s*s\s*\)\s+and was terminated\b/iu;
const CLI_BACKEND_ROUTING_REF_BEFORE_ERROR_RE = /\b([\w.-]+\/[A-Za-z][\w.-]*)\s*:\s*CLI\b/iu;
const CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE = /\bcodex app-server client closed before turn completed\b/iu;
const CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE = /\bcodex app-server turn idle timed out waiting for turn\/completed\b/iu;
function buildCodexAppServerFailureText(message) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (CODEX_APP_SERVER_CLIENT_CLOSED_BEFORE_REPLY_RE.test(normalizedMessage)) return "⚠️ Codex app-server connection closed before this turn finished. OpenClaw retried once when the stdio turn was still replay-safe; please try again if this keeps happening.";
	if (CODEX_APP_SERVER_TURN_COMPLETION_IDLE_TIMEOUT_RE.test(normalizedMessage)) return "⚠️ Codex app-server stopped before confirming turn completion. OpenClaw did not replay the turn automatically because it may still be active; try again, or use /new if the session stays stuck.";
	return null;
}
/** Formats the reply shown when preflight compaction fails before a run. */
function buildPreflightCompactionFailureText(message, options) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	if (!normalizedMessage.startsWith(PREFLIGHT_COMPACTION_FAILURE_PREFIX)) return null;
	const reason = sanitizeUserFacingText(normalizedMessage.slice(41), { errorContext: true }).trim().replace(/\s+/gu, " ");
	return `⚠️ Context is too large and auto-compaction could not recover this turn.${options?.includeDetails && reason ? ` Reason: ${reason}.` : ""} Try again, use /compact, or use /new to start a fresh session.`;
}
function buildCliBackendTimeoutFailureText(message) {
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	const stall = normalizedMessage.match(CLI_BACKEND_NO_OUTPUT_STALL_RE);
	const overall = normalizedMessage.match(CLI_BACKEND_OVERALL_TIMEOUT_RE);
	const seconds = (stall ?? overall)?.[1];
	if (!seconds) return null;
	const routedModelRef = normalizedMessage.match(CLI_BACKEND_ROUTING_REF_BEFORE_ERROR_RE)?.[1];
	return `⚠️ CLI subprocess${routedModelRef ? ` (routing ${routedModelRef})` : ""}: timed out after ${seconds}s (${stall ? "no-output stall" : "overall CLI turn budget"}). The gateway may still be healthy. Try \`/new\`, a lighter model, or raise \`agents.defaults.timeoutSeconds\` and the watchdog \`noOutputTimeoutMs\` entries under \`cliBackends.<your-runtime>\`.`;
}
function buildMissingApiKeyFailureText(input) {
	const normalizedMessage = collapseRepeatedFailureDetail(input.message);
	const provider = isMissingProviderAuthError(input.error) ? input.error.provider.trim().toLowerCase() : normalizedMessage.match(/No API key found for provider "([^"]+)"/u)?.[1]?.trim().toLowerCase();
	if (!provider) return null;
	if (provider === "openai" && normalizedMessage.includes("OpenAI Codex OAuth")) return "⚠️ Missing API key for OpenAI on the gateway. Use `openai/gpt-5.5` with the OpenAI OAuth profile, or set `OPENAI_API_KEY` for direct OpenAI API-key runs.";
	if (provider === "openai") return "⚠️ Missing API key for provider \"openai\". Run `openclaw doctor --fix` to repair stale OpenAI model/session routes, restart the gateway if doctor asks, then try again. If doctor has nothing to repair or the error persists, re-auth with `openclaw models auth login --provider openai` or run `openclaw configure`.";
	if (SAFE_MISSING_API_KEY_PROVIDERS.has(provider)) return `⚠️ Missing API key for provider "${provider}". Configure the gateway auth for that provider, then try again.`;
	return "⚠️ Missing API key for the selected provider on the gateway. Configure provider auth, then try again.";
}
function buildAuthProfileFailoverFailureText(error) {
	if (!isFailoverError(error) || !error.provider || !error.authProfileFailure) return null;
	return formatAuthProfileFailureMessage({
		reason: error.reason,
		provider: error.provider,
		allInCooldown: error.authProfileFailure.allInCooldown,
		cause: error.cause
	});
}
function formatForwardedExternalRunFailureText(message) {
	const sanitized = sanitizeUserFacingText(message, { errorContext: true }).trim().replace(/^⚠️\s*/u, "").replace(/\s+/gu, " ");
	if (!sanitized) return GENERIC_EXTERNAL_RUN_FAILURE_TEXT;
	const detail = sanitized.length > EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS ? `${sanitized.slice(0, EXTERNAL_RUN_FAILURE_DETAIL_MAX_CHARS - 1).trimEnd()}…` : sanitized;
	return `⚠️ Agent failed before reply: ${detail}${/[.!?]$/u.test(detail) ? "" : "."} Please try again, or use /new to start a fresh session.`;
}
function buildExternalRunFailureReply(input, options) {
	const message = typeof input === "string" ? input : input.message;
	const error = typeof input === "string" ? void 0 : input.error;
	const normalizedMessage = collapseRepeatedFailureDetail(message);
	const authProfileFailoverFailure = buildAuthProfileFailoverFailureText(error);
	if (authProfileFailoverFailure) return {
		text: authProfileFailoverFailure,
		isGenericRunnerFailure: false
	};
	const providerRequestError = classifyProviderRequestError(error ?? normalizedMessage);
	if (providerRequestError) return {
		text: providerRequestError.userMessage,
		isGenericRunnerFailure: false
	};
	const missingApiKeyFailure = buildMissingApiKeyFailureText({
		message: normalizedMessage,
		error
	});
	if (missingApiKeyFailure) return {
		text: missingApiKeyFailure,
		isGenericRunnerFailure: false
	};
	const oauthRefreshFailure = classifyOAuthRefreshFailureError(error) ?? classifyOAuthRefreshFailure(normalizedMessage);
	if (oauthRefreshFailure) {
		const loginCommand = buildOAuthRefreshFailureLoginCommand(oauthRefreshFailure.provider);
		if (oauthRefreshFailure.reason) return {
			text: `⚠️ Model login expired on the gateway${oauthRefreshFailure.provider ? ` for ${oauthRefreshFailure.provider}` : ""}. Re-auth with \`${loginCommand}\`, then try again.`,
			isGenericRunnerFailure: false
		};
		return {
			text: `⚠️ Model login failed on the gateway${oauthRefreshFailure.provider ? ` for ${oauthRefreshFailure.provider}` : ""}. Please try again. If this keeps happening, re-auth with \`${loginCommand}\`.`,
			isGenericRunnerFailure: false
		};
	}
	if (options?.isHeartbeat) return {
		text: HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: false
	};
	const cliBackendTimeoutFailure = buildCliBackendTimeoutFailureText(normalizedMessage);
	if (cliBackendTimeoutFailure) return {
		text: cliBackendTimeoutFailure,
		isGenericRunnerFailure: false
	};
	const codexAppServerFailure = buildCodexAppServerFailureText(normalizedMessage);
	if (codexAppServerFailure) return {
		text: codexAppServerFailure,
		isGenericRunnerFailure: false
	};
	return {
		text: options?.includeDetails ? formatForwardedExternalRunFailureText(normalizedMessage) : GENERIC_EXTERNAL_RUN_FAILURE_TEXT,
		isGenericRunnerFailure: true
	};
}
function markAgentRunFailureReplyPayload(payload) {
	const marked = markReplyPayloadForSourceSuppressionDelivery(payload);
	if (!isSilentReplyText(marked.text, "NO_REPLY")) marked.isError = true;
	return marked;
}
/** Converts known agent-run failures into user-facing reply payloads. */
function buildKnownAgentRunFailureReplyPayload(params) {
	const message = formatErrorMessage(params.err);
	const isFallbackSummary = isFallbackSummaryError(params.err);
	if (isFallbackSummary ? hasBillingAttemptSummary(params.err) : isFailoverError(params.err) ? params.err.reason === "billing" : isBillingErrorMessage(message)) return markAgentRunFailureReplyPayload({ text: resolveExternalRunFailureTextForConversation({
		text: resolveBillingFailureReplyText(params.err),
		sessionCtx: params.sessionCtx,
		isGenericRunnerFailure: false,
		cfg: params.cfg
	}) });
	const preflightCompactionFailureText = buildPreflightCompactionFailureText(message, { includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel) });
	if (preflightCompactionFailureText) return markAgentRunFailureReplyPayload({ text: resolveExternalRunFailureTextForConversation({
		text: preflightCompactionFailureText,
		sessionCtx: params.sessionCtx,
		isGenericRunnerFailure: false,
		cfg: params.cfg
	}) });
	const isPureTransientSummary = isFallbackSummary ? isPureTransientRateLimitSummary(params.err) : false;
	const isRateLimit = isFallbackSummary ? isPureTransientSummary : isRateLimitErrorMessage(message);
	const rateLimitOrOverloadedCopy = !isFallbackSummary || isPureTransientSummary ? formatRateLimitOrOverloadedErrorCopy(message) : void 0;
	if (isRateLimit && !isOverloadedErrorMessage(message)) return markAgentRunFailureReplyPayload({ text: resolveExternalRunFailureTextForConversation({
		text: buildRateLimitCooldownMessage(params.err),
		sessionCtx: params.sessionCtx,
		isGenericRunnerFailure: false,
		cfg: params.cfg
	}) });
	if (rateLimitOrOverloadedCopy) return markAgentRunFailureReplyPayload({ text: resolveExternalRunFailureTextForConversation({
		text: rateLimitOrOverloadedCopy,
		sessionCtx: params.sessionCtx,
		isGenericRunnerFailure: false,
		cfg: params.cfg
	}) });
	const externalRunFailureReply = buildExternalRunFailureReply({
		message,
		error: params.err
	}, { includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel) });
	if (externalRunFailureReply.isGenericRunnerFailure) return;
	return markAgentRunFailureReplyPayload({ text: resolveExternalRunFailureTextForConversation({
		text: externalRunFailureReply.text,
		sessionCtx: params.sessionCtx,
		isGenericRunnerFailure: false,
		cfg: params.cfg
	}) });
}
const DEFAULT_RESERVE_TOKENS_FLOOR = 2e4;
/** Computes a reserve-token floor scaled to the selected context window. */
function computeContextAwareReserveTokensFloor(contextWindow) {
	if (typeof contextWindow !== "number" || contextWindow <= 0) return DEFAULT_RESERVE_TOKENS_FLOOR;
	if (contextWindow >= 1e6) return 1e5;
	if (contextWindow >= 2e5) return 5e4;
	if (contextWindow >= 1e5) return 35e3;
	return DEFAULT_RESERVE_TOKENS_FLOOR;
}
function resolveContextWindowForCompactionHint(params) {
	let modelWindow;
	const entryProvider = params.activeSessionEntry?.modelProvider;
	const entryModel = params.activeSessionEntry?.model;
	const runtimeProvider = params.runtimeProvider ?? entryProvider;
	const runtimeModel = params.runtimeModel ?? entryModel;
	const hasExplicitRuntimeRef = Boolean(params.runtimeProvider && params.runtimeModel);
	if (runtimeProvider && runtimeModel) {
		const resolved = resolveContextTokensForModel({
			cfg: params.cfg,
			provider: runtimeProvider,
			model: runtimeModel,
			allowAsyncLoad: false
		});
		if (typeof resolved === "number" && resolved > 0) modelWindow = resolved;
	}
	const sessionWindow = normalizePositiveContextTokens(params.activeSessionEntry?.contextTokens);
	const sessionMatchesRuntimeRef = runtimeProvider === entryProvider && runtimeModel === entryModel;
	const trustedSessionWindow = !hasExplicitRuntimeRef || sessionMatchesRuntimeRef ? sessionWindow : void 0;
	if (modelWindow === void 0 && sessionMatchesRuntimeRef && sessionWindow !== void 0) modelWindow = sessionWindow;
	if (modelWindow === void 0 && !hasExplicitRuntimeRef && params.primaryProvider && params.primaryModel) {
		const resolved = resolveContextTokensForModel({
			cfg: params.cfg,
			provider: params.primaryProvider,
			model: params.primaryModel,
			allowAsyncLoad: false
		});
		if (typeof resolved === "number" && resolved > 0) modelWindow = resolved;
	}
	const contextWindow = modelWindow ?? trustedSessionWindow;
	const agentCap = resolveAgentContextTokensForHint({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (agentCap !== void 0 && contextWindow !== void 0) return Math.min(agentCap, contextWindow);
	return agentCap ?? contextWindow;
}
function buildContextOverflowResetHint(contextWindowTokens) {
	return `

To prevent this, increase your compaction buffer by setting \`agents.defaults.compaction.reserveTokensFloor\` to ${computeContextAwareReserveTokensFloor(contextWindowTokens)} or higher in your config.`;
}
function resolveAgentHeartbeatModelRaw(params) {
	const defaultModel = normalizeOptionalString(params.cfg.agents?.defaults?.heartbeat?.model);
	const agentId = normalizeLowercaseStringOrEmpty(params.agentId);
	return (agentId ? normalizeOptionalString(params.cfg.agents?.list?.find((entry) => normalizeLowercaseStringOrEmpty(entry?.id) === agentId)?.heartbeat?.model) : void 0) ?? defaultModel;
}
function normalizeModelRefForCompare(ref) {
	if (!ref) return;
	const provider = normalizeLowercaseStringOrEmpty(ref.provider);
	const model = normalizeLowercaseStringOrEmpty(ref.model);
	return provider && model ? {
		provider,
		model
	} : void 0;
}
function modelRefsEqual(left, right) {
	const normalizedLeft = normalizeModelRefForCompare(left);
	const normalizedRight = normalizeModelRefForCompare(right);
	if (!normalizedLeft || !normalizedRight) return false;
	return normalizedLeft.provider === normalizedRight.provider && normalizedLeft.model === normalizedRight.model;
}
function formatContextWindowLabel(tokens) {
	if (tokens >= 1e6) return `${Math.round(tokens / 1e6 * 10) / 10}M`;
	return `${Math.round(tokens / 1024)}k`;
}
function normalizePositiveContextTokens(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function resolveAgentContextTokensForHint(params) {
	const defaultContextTokens = normalizePositiveContextTokens(params.cfg.agents?.defaults?.contextTokens);
	const agentId = normalizeLowercaseStringOrEmpty(params.agentId);
	return (agentId ? normalizePositiveContextTokens(params.cfg.agents?.list?.find((entry) => normalizeLowercaseStringOrEmpty(entry?.id) === agentId)?.contextTokens) : void 0) ?? defaultContextTokens;
}
function resolveContextWindowForHint(params) {
	const sessionContextTokens = normalizePositiveContextTokens(params.activeSessionEntry?.contextTokens);
	const contextTokens = resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.ref.provider,
		model: params.ref.model,
		allowAsyncLoad: false
	}) ?? sessionContextTokens;
	if (contextTokens === void 0) return;
	const agentContextTokens = resolveAgentContextTokensForHint({
		cfg: params.cfg,
		agentId: params.agentId
	});
	return agentContextTokens !== void 0 ? Math.min(agentContextTokens, contextTokens) : contextTokens;
}
function resolveHeartbeatBleedHint(params) {
	const primaryProvider = normalizeOptionalString(params.primaryProvider);
	const primaryModel = normalizeOptionalString(params.primaryModel);
	if (!primaryProvider || !primaryModel) return;
	const runtimeProvider = normalizeOptionalString(params.activeSessionEntry?.modelProvider);
	const runtimeModel = normalizeOptionalString(params.activeSessionEntry?.model);
	if (!runtimeProvider || !runtimeModel) return;
	const primaryRef = {
		provider: primaryProvider,
		model: primaryModel
	};
	const runtimeRef = {
		provider: runtimeProvider,
		model: runtimeModel
	};
	if (modelRefsEqual(primaryRef, runtimeRef)) return;
	const heartbeatModelRaw = resolveAgentHeartbeatModelRaw({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (!modelRefsEqual(runtimeRef, heartbeatModelRaw ? resolveModelRefFromString({
		cfg: params.cfg,
		raw: heartbeatModelRaw,
		defaultProvider: primaryProvider
	})?.ref : void 0)) return;
	const runtimeWindow = resolveContextWindowForHint({
		cfg: params.cfg,
		agentId: params.agentId,
		ref: runtimeRef,
		activeSessionEntry: params.activeSessionEntry
	});
	const primaryWindow = resolveContextWindowForHint({
		cfg: params.cfg,
		agentId: params.agentId,
		ref: primaryRef
	});
	if (typeof runtimeWindow === "number" && typeof primaryWindow === "number" && runtimeWindow >= primaryWindow) return;
	return `\n\nThe previous heartbeat turn left this session on ${runtimeProvider}/${runtimeModel}${typeof runtimeWindow === "number" && runtimeWindow > 0 ? ` (${formatContextWindowLabel(runtimeWindow)} context)` : ""} instead of ${primaryProvider}/${primaryModel}. This matches the configured \`heartbeat.model\`, so the overflow is likely heartbeat model bleed rather than a compaction-buffer problem. Set \`heartbeat.isolatedSession: true\`, enable \`heartbeat.lightContext: true\`, or use a heartbeat model with a larger context window.`;
}
/** Builds recovery instructions for context-overflow failures. */
function buildContextOverflowRecoveryText(params) {
	const prefix = params.preserveSessionMapping ? "⚠️ Auto-compaction could not recover this turn. I kept this conversation mapped to the current session. Please try again, use /compact, or use /new to start a fresh session." : params.duringCompaction ? "⚠️ Context limit exceeded during compaction. I've reset our conversation to start fresh - please try again." : "⚠️ Context limit exceeded. I've reset our conversation to start fresh - please try again.";
	const primaryContextWindow = resolveContextWindowForCompactionHint({
		cfg: params.cfg,
		primaryProvider: params.primaryProvider,
		primaryModel: params.primaryModel,
		runtimeProvider: params.runtimeProvider,
		runtimeModel: params.runtimeModel,
		agentId: params.agentId,
		activeSessionEntry: params.activeSessionEntry
	});
	return prefix + ((!params.runtimeProvider || !params.runtimeModel || params.runtimeProvider === params.activeSessionEntry?.modelProvider && params.runtimeModel === params.activeSessionEntry?.model ? resolveHeartbeatBleedHint({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: params.primaryProvider,
		primaryModel: params.primaryModel,
		activeSessionEntry: params.activeSessionEntry
	}) : void 0) ?? buildContextOverflowResetHint(primaryContextWindow));
}
function buildRestartLifecycleReplyText() {
	return "⚠️ Gateway is restarting. Please wait a few seconds and try again.";
}
function resolveRestartLifecycleError(err) {
	const pending = [err];
	const seen = /* @__PURE__ */ new Set();
	let pendingIndex = 0;
	while (pendingIndex < pending.length) {
		const candidate = pending[pendingIndex++];
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		if (candidate instanceof GatewayDrainingError || candidate instanceof CommandLaneClearedError) return candidate;
		if (isFallbackSummaryError(candidate)) for (const attempt of candidate.attempts) pending.push(attempt.error);
		if (candidate instanceof Error && "cause" in candidate) pending.push(candidate.cause);
	}
}
function isReplyOperationUserAbort(replyOperation) {
	return replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_by_user";
}
function isReplyOperationRestartAbort(replyOperation) {
	return replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_restart";
}
function emitModelFallbackStepLifecycle(params) {
	emitAgentEvent({
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		stream: "lifecycle",
		data: {
			phase: "fallback_step",
			...params.step
		}
	});
}
/** Resolves runtime provider override stored on the session entry. */
function resolveSessionRuntimeOverrideForProvider(params) {
	const provider = normalizeLowercaseStringOrEmpty(params.provider);
	const runtime = normalizeLowercaseStringOrEmpty(params.entry?.agentRuntimeOverride);
	if (!runtime || runtime === "auto" || runtime === "default") return;
	if (provider === "openai" && runtime === "codex") return "codex";
	if (isCliRuntimeAliasForProvider({
		provider,
		runtime,
		cfg: params.cfg
	})) return runtime;
}
/** Decides whether to retry after rechecking auto-fallback primary probe state. */
function resolveRunAfterAutoFallbackPrimaryProbeRecheck(params) {
	const probe = params.run.autoFallbackPrimaryProbe;
	if (!probe || !params.sessionKey) return params.run;
	if (!params.entry) return params.run;
	const resolveEntrySelectionRun = () => {
		const entryRef = resolvePersistedOverrideModelRef({
			defaultProvider: params.run.provider,
			overrideProvider: params.entry?.providerOverride,
			overrideModel: params.entry?.modelOverride
		});
		const hasEntryModelOverride = Boolean(entryRef);
		const authProfileId = normalizeOptionalString(params.entry?.authProfileOverride);
		const fallbackRun = {
			...params.run,
			provider: entryRef?.provider ?? params.run.provider,
			model: entryRef?.model ?? params.run.model,
			autoFallbackPrimaryProbe: void 0
		};
		if (hasEntryModelOverride) {
			fallbackRun.hasSessionModelOverride = true;
			fallbackRun.hasAutoFallbackProvenance = hasSessionAutoModelFallbackProvenance(params.entry) || void 0;
		} else {
			delete fallbackRun.hasSessionModelOverride;
			delete fallbackRun.hasAutoFallbackProvenance;
		}
		if (hasEntryModelOverride && params.entry?.modelOverrideSource) fallbackRun.modelOverrideSource = params.entry.modelOverrideSource;
		else delete fallbackRun.modelOverrideSource;
		if (hasEntryModelOverride && authProfileId) {
			fallbackRun.authProfileId = authProfileId;
			if (params.entry?.authProfileOverrideSource) fallbackRun.authProfileIdSource = params.entry.authProfileOverrideSource;
			else delete fallbackRun.authProfileIdSource;
		} else if (hasEntryModelOverride) {
			delete fallbackRun.authProfileId;
			delete fallbackRun.authProfileIdSource;
		}
		return fallbackRun;
	};
	const refreshedProbe = resolveAutoFallbackPrimaryProbe({
		entry: params.entry,
		sessionKey: params.sessionKey,
		primaryProvider: probe.provider,
		primaryModel: probe.model
	});
	if (!refreshedProbe) return resolveEntrySelectionRun();
	return {
		...params.run,
		provider: refreshedProbe.provider,
		model: refreshedProbe.model,
		autoFallbackPrimaryProbe: refreshedProbe
	};
}
/** Runs the agent turn with provider/model fallback, retry, and failure mapping. */
async function runAgentTurnWithFallback(params) {
	const TRANSIENT_HTTP_RETRY_DELAY_MS = 2500;
	let didLogHeartbeatStrip = false;
	let autoCompactionCount = 0;
	const directlySentBlockKeys = /* @__PURE__ */ new Set();
	const directlySentBlockPayloads = [];
	const runnableRun = resolveRunAfterAutoFallbackPrimaryProbeRecheck({
		run: params.followupRun.run,
		entry: params.activeSessionStore?.[params.sessionKey ?? ""] ?? params.getActiveSessionEntry(),
		sessionKey: params.sessionKey
	});
	if (runnableRun !== params.followupRun.run) params.followupRun.run = runnableRun;
	const runtimeConfig = resolveQueuedReplyRuntimeConfig(runnableRun.config);
	const effectiveRun = runtimeConfig === runnableRun.config ? runnableRun : {
		...runnableRun,
		config: runtimeConfig
	};
	const preserveUserFacingSessionState = shouldPreserveUserFacingSessionStateForInputProvenance(effectiveRun.inputProvenance);
	const resolveRunForFallbackCandidate = (provider, model) => {
		const probe = effectiveRun.autoFallbackPrimaryProbe;
		const isPrimaryProbeCandidate = probe && provider === probe.provider && model === probe.model;
		if (probe && provider === probe.fallbackProvider && !isPrimaryProbeCandidate && probe.fallbackAuthProfileId) {
			const candidateRun = {
				...effectiveRun,
				provider,
				model,
				authProfileId: probe.fallbackAuthProfileId
			};
			if (probe.fallbackAuthProfileIdSource) candidateRun.authProfileIdSource = probe.fallbackAuthProfileIdSource;
			else delete candidateRun.authProfileIdSource;
			return candidateRun;
		}
		return effectiveRun;
	};
	const applyLiveModelSwitchToRun = (run, err) => {
		run.provider = err.provider;
		run.model = err.model;
		run.authProfileId = err.authProfileId;
		run.authProfileIdSource = err.authProfileId ? err.authProfileIdSource : void 0;
		run.autoFallbackPrimaryProbe = void 0;
	};
	const runId = params.opts?.runId ?? crypto.randomUUID();
	const agentTurnTiming = createAgentTurnTimingTracker({ profilerEnabled: isReplyProfilerEnabled({ config: runtimeConfig }) });
	const shouldSurfaceToControlUi = isInternalMessageChannel(params.followupRun.run.messageProvider ?? params.sessionCtx.Surface ?? params.sessionCtx.Provider);
	let lifecycleGeneration = captureAgentRunLifecycleGeneration(runId);
	if (params.sessionKey) registerAgentRunContext(runId, {
		sessionKey: params.sessionKey,
		...params.followupRun.run.sessionId ? { sessionId: params.followupRun.run.sessionId } : {},
		lifecycleGeneration,
		verboseLevel: params.resolvedVerboseLevel,
		isHeartbeat: params.isHeartbeat,
		isControlUiVisible: shouldSurfaceToControlUi
	});
	if (isDiagnosticsEnabled(runtimeConfig)) logSessionTurnCreated({
		runId,
		sessionKey: params.sessionKey,
		sessionId: params.followupRun.run.sessionId,
		agentId: params.followupRun.run.agentId,
		channel: params.followupRun.run.messageProvider ?? params.sessionCtx.Surface ?? params.sessionCtx.Provider,
		trigger: params.isHeartbeat ? "heartbeat" : "user"
	});
	let replyMediaContext;
	let currentTurnImages;
	try {
		replyMediaContext = params.replyMediaContext ?? agentTurnTiming.measureSync("reply_media_context", () => createReplyMediaContext({
			cfg: runtimeConfig,
			sessionKey: params.sessionKey,
			workspaceDir: params.followupRun.run.workspaceDir,
			messageProvider: params.followupRun.run.messageProvider,
			accountId: params.followupRun.originatingAccountId ?? params.followupRun.run.agentAccountId,
			groupId: params.followupRun.run.groupId,
			groupChannel: params.followupRun.run.groupChannel,
			groupSpace: params.followupRun.run.groupSpace,
			requesterSenderId: params.followupRun.run.senderId,
			requesterSenderName: params.followupRun.run.senderName,
			requesterSenderUsername: params.followupRun.run.senderUsername,
			requesterSenderE164: params.followupRun.run.senderE164
		}));
		currentTurnImages = await agentTurnTiming.measure("current_turn_images", () => resolveCurrentTurnImages({
			ctx: params.sessionCtx,
			cfg: runtimeConfig,
			images: params.followupRun.images ?? params.opts?.images,
			imageOrder: params.followupRun.imageOrder ?? params.opts?.imageOrder
		}));
	} catch (error) {
		clearAgentRunContext(runId, lifecycleGeneration);
		throw error;
	}
	let didNotifyAgentRunStart = false;
	const notifyAgentRunStart = () => {
		if (didNotifyAgentRunStart) return;
		didNotifyAgentRunStart = true;
		params.opts?.onAgentRunStart?.(runId);
	};
	const currentMessageId = params.sessionCtx.MessageSidFull ?? params.sessionCtx.MessageSid;
	const notifyUserAboutCompaction = shouldNotifyUserAboutCompaction(runtimeConfig);
	const deliverCompactionNoticePayload = async (noticePayload, label) => {
		try {
			if (params.opts?.onBlockReply) {
				await params.opts.onBlockReply(noticePayload);
				return;
			}
			await params.onCompactionNoticePayload?.(noticePayload);
		} catch (err) {
			logVerbose(`compaction ${label} notice delivery failed (non-fatal): ${String(err)}`);
		}
	};
	const sendCompactionNotice = async (phase) => {
		await deliverCompactionNoticePayload(createCompactionNoticePayload({
			phase,
			currentMessageId,
			applyReplyToMode: params.applyReplyToMode
		}), phase);
	};
	const sendCompactionHookMessages = async (messages) => {
		const noticePayload = createCompactionHookNoticePayload({
			messages,
			currentMessageId,
			applyReplyToMode: params.applyReplyToMode
		});
		if (!noticePayload) return;
		await deliverCompactionNoticePayload(noticePayload, "hook");
	};
	let runResult;
	let fallbackProvider = params.followupRun.run.provider;
	let fallbackModel = params.followupRun.run.model;
	let attemptedRuntimeProvider = fallbackProvider;
	let attemptedRuntimeModel = fallbackModel;
	let fallbackAttempts = [];
	let fallbackExhausted = false;
	let pendingLifecycleTerminal;
	const takePendingLifecycleTerminal = () => {
		const terminal = pendingLifecycleTerminal?.backstop;
		pendingLifecycleTerminal = void 0;
		return terminal;
	};
	let transientHttpRetriesRemaining = 1;
	const consumeTransientHttpRetry = () => transientHttpRetriesRemaining-- > 0;
	let liveModelSwitchRetries = 0;
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.getActiveSessionEntry()?.systemPromptReport);
	let pendingFallbackCandidateRollback;
	const clearPendingFallbackRollback = (rollback) => {
		if (!rollback || pendingFallbackCandidateRollback?.rollback === rollback) pendingFallbackCandidateRollback = void 0;
	};
	const rollbackClassifiedFallbackCandidateSelection = async (provider, model) => {
		const pending = pendingFallbackCandidateRollback;
		if (!pending || pending.provider !== provider || pending.model !== model) return;
		pendingFallbackCandidateRollback = void 0;
		try {
			await pending.rollback();
		} catch (rollbackError) {
			logVerbose(`failed to roll back classified fallback candidate selection (non-fatal): ${String(rollbackError)}`);
		}
	};
	const persistFallbackCandidateSelection = async (provider, model, candidateRun) => {
		if (!params.sessionKey || !params.activeSessionStore || preserveUserFacingSessionState || provider === effectiveRun.provider && model === effectiveRun.model) return;
		const activeSessionEntry = params.activeSessionStore[params.sessionKey] ?? params.getActiveSessionEntry();
		if (!activeSessionEntry) return;
		if (activeSessionEntry.modelOverrideSource === "user" || activeSessionEntry.modelOverrideSource === void 0 && Boolean(normalizeOptionalString(activeSessionEntry.modelOverride)) && !hasSessionAutoModelFallbackProvenance(activeSessionEntry)) return;
		const previousState = snapshotFallbackSelectionState(activeSessionEntry);
		const applied = applyFallbackCandidateSelectionToEntry({
			entry: activeSessionEntry,
			run: candidateRun !== effectiveRun && effectiveRun.autoFallbackPrimaryProbe ? {
				...candidateRun,
				provider: candidateRun.provider,
				model: effectiveRun.model
			} : candidateRun,
			provider: resolveOpenAIRuntimeProvider({
				provider,
				config: runtimeConfig,
				workspaceDir: params.followupRun.run.workspaceDir
			}),
			model,
			force: candidateRun !== effectiveRun && Boolean(effectiveRun.autoFallbackPrimaryProbe),
			...effectiveRun.autoFallbackPrimaryProbe ? { origin: {
				provider: effectiveRun.autoFallbackPrimaryProbe.provider,
				model: effectiveRun.autoFallbackPrimaryProbe.model
			} } : {}
		});
		const nextState = applied.nextState;
		if (!applied.updated || !nextState) return;
		params.activeSessionStore[params.sessionKey] = activeSessionEntry;
		try {
			if (params.storePath) await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, (persistedEntry) => {
				applyFallbackSelectionState(persistedEntry, nextState);
				return buildFallbackSelectionStatePatch(persistedEntry);
			});
		} catch (error) {
			rollbackFallbackSelectionStateIfUnchanged(activeSessionEntry, nextState, previousState);
			params.activeSessionStore[params.sessionKey] = activeSessionEntry;
			throw error;
		}
		return async () => {
			if (rollbackFallbackSelectionStateIfUnchanged(activeSessionEntry, nextState, previousState)) params.activeSessionStore[params.sessionKey] = activeSessionEntry;
			if (!params.storePath || !params.sessionKey) return;
			await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, (persistedEntry) => {
				if (rollbackFallbackSelectionStateIfUnchanged(persistedEntry, nextState, previousState)) return buildFallbackSelectionStatePatch(persistedEntry);
				return null;
			});
		};
	};
	const clearRecoveredAutoFallbackPrimaryProbe = async (paramsForClear) => {
		if (preserveUserFacingSessionState) return;
		const probe = effectiveRun.autoFallbackPrimaryProbe;
		if (!probe) return;
		if (paramsForClear.provider !== probe.provider || paramsForClear.model !== probe.model) return;
		if (!params.sessionKey || !params.activeSessionStore) return;
		const activeSessionEntry = params.activeSessionStore[params.sessionKey] ?? params.getActiveSessionEntry();
		if (!activeSessionEntry) return;
		if (!entryMatchesAutoFallbackPrimaryProbe(activeSessionEntry, probe)) return;
		clearAutoFallbackPrimaryProbeSelection(activeSessionEntry);
		params.activeSessionStore[params.sessionKey] = activeSessionEntry;
		if (!params.storePath) return;
		await updateSessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey
		}, (persistedEntry) => {
			if (!entryMatchesAutoFallbackPrimaryProbe(persistedEntry, probe)) return null;
			const shouldClearAuthProfile = persistedEntry.authProfileOverrideSource === "auto" || persistedEntry.authProfileOverrideSource === void 0 && persistedEntry.authProfileOverrideCompactionCount !== void 0;
			clearAutoFallbackPrimaryProbeSelection(persistedEntry);
			return {
				providerOverride: void 0,
				modelOverride: void 0,
				modelOverrideSource: void 0,
				modelOverrideFallbackOriginProvider: void 0,
				modelOverrideFallbackOriginModel: void 0,
				...shouldClearAuthProfile ? {
					authProfileOverride: void 0,
					authProfileOverrideSource: void 0,
					authProfileOverrideCompactionCount: void 0
				} : {},
				fallbackNoticeSelectedModel: void 0,
				fallbackNoticeActiveModel: void 0,
				fallbackNoticeReason: void 0,
				updatedAt: persistedEntry.updatedAt
			};
		});
	};
	while (true) try {
		const normalizeStreamingText = (payload) => {
			let text = payload.text;
			const reply = resolveSendableOutboundReplyParts(payload);
			if (params.followupRun.run.silentExpected) return { skip: true };
			if (!params.isHeartbeat && text?.includes("HEARTBEAT_OK")) {
				const stripped = stripHeartbeatToken(text, { mode: "message" });
				if (stripped.didStrip && !didLogHeartbeatStrip) {
					didLogHeartbeatStrip = true;
					logVerbose("Stripped stray HEARTBEAT_OK token from reply");
				}
				if (stripped.shouldSkip && !reply.hasMedia) return { skip: true };
				text = stripped.text;
			}
			if (isSilentReplyText(text, "NO_REPLY")) return { skip: true };
			if (isSilentReplyPrefixText(text, "NO_REPLY") || isSilentReplyPrefixText(text, "HEARTBEAT_OK")) return { skip: true };
			if (text && startsWithSilentToken(text, "NO_REPLY")) text = stripLeadingSilentToken(text, SILENT_REPLY_TOKEN);
			if (!text) {
				if (reply.hasMedia) return {
					text: void 0,
					skip: false
				};
				return { skip: true };
			}
			const sanitized = sanitizeUserFacingText(text, { errorContext: Boolean(payload.isError) });
			if (!sanitized.trim()) return { skip: true };
			return {
				text: sanitized,
				skip: false
			};
		};
		const handlePartialForTyping = async (payload) => {
			if (isSilentReplyPrefixText(payload.text, "NO_REPLY")) return;
			const { text, skip } = normalizeStreamingText(payload);
			if (skip || !text) return;
			await params.typingSignals.signalTextDelta(text);
			return text;
		};
		const blockReplyPipeline = params.blockReplyPipeline;
		const blockReplyHandler = params.opts?.onBlockReply ? createBlockReplyDeliveryHandler({
			onBlockReply: params.opts.onBlockReply,
			currentMessageId: params.sessionCtx.MessageSidFull ?? params.sessionCtx.MessageSid,
			replyThreading: params.replyThreading,
			normalizeStreamingText,
			applyReplyToMode: params.applyReplyToMode,
			normalizeMediaPaths: replyMediaContext.normalizePayload,
			typingSignals: params.typingSignals,
			blockStreamingEnabled: params.blockStreamingEnabled,
			blockReplyPipeline,
			directlySentBlockKeys,
			directlySentBlockPayloads
		}) : void 0;
		let messageToolOnlyDeliveryCompleted = false;
		const messageToolOnlyDeliveryToolCallIds = /* @__PURE__ */ new Set();
		const sourceRepliesAreToolOnly = params.followupRun.run.sourceReplyDeliveryMode === "message_tool_only";
		const shouldSuppressProgressAfterMessageToolDelivery = () => sourceRepliesAreToolOnly && messageToolOnlyDeliveryCompleted && params.opts?.allowProgressCallbacksWhenSourceDeliverySuppressed !== true;
		const onToolResult = params.opts?.onToolResult;
		const outcomePlan = buildAgentRuntimeOutcomePlan();
		const runLane = "main";
		const runAbortSignal = params.replyOperation?.abortSignal ?? params.opts?.abortSignal;
		let queuedUserMessagePersistedAcrossFallback = false;
		let assistantErrorPersistedAcrossFallback = false;
		const userTurnTranscriptRecorder = params.followupRun.userTurnTranscriptRecorder ?? params.opts?.userTurnTranscriptRecorder;
		const notifyUserMessagePersisted = () => {
			queuedUserMessagePersistedAcrossFallback = true;
		};
		const fastModeStartedAtMs = Date.now();
		const fastModeAutoProgressState = {
			offAnnounced: false,
			resetAnnounced: false
		};
		agentTurnTiming.logMilestoneIfSlow({
			runId,
			sessionId: params.followupRun.run.sessionId,
			sessionKey: params.sessionKey,
			milestone: "before_model_fallback"
		});
		const fallbackResult = await agentTurnTiming.measure("model_fallback", () => runWithModelFallback({
			...resolveModelFallbackOptions(effectiveRun, runtimeConfig),
			runId,
			sessionId: params.followupRun.run.sessionId,
			lane: runLane,
			abortSignal: runAbortSignal,
			resolveAgentHarnessRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
				provider,
				entry: params.getActiveSessionEntry(),
				cfg: runtimeConfig
			}),
			prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
				await agentTurnTiming.measure("fallback_prepare_harness", () => ensureSelectedAgentHarnessPlugin({
					config: runtimeConfig,
					provider,
					modelId: model,
					agentId: params.followupRun.run.agentId,
					sessionKey: params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
					agentHarnessRuntimeOverride,
					workspaceDir: params.followupRun.run.workspaceDir
				}));
			},
			onFallbackStep: (step) => {
				emitModelFallbackStepLifecycle({
					runId,
					sessionKey: params.sessionKey,
					step
				});
			},
			classifyResult: async ({ result, provider, model }) => {
				const classification = outcomePlan.classifyRunResult({
					result,
					provider,
					model,
					hasDirectlySentBlockReply: directlySentBlockKeys.size > 0,
					hasBlockReplyPipelineOutput: Boolean(blockReplyPipeline?.hasBuffered() || blockReplyPipeline?.didStream())
				});
				if (classification) await rollbackClassifiedFallbackCandidateSelection(provider, model);
				return classification;
			},
			mergeExhaustedResult: mergeEmbeddedAgentRunResultForModelFallbackExhaustion,
			run: async (provider, model, runOptions) => {
				attemptedRuntimeProvider = provider;
				attemptedRuntimeModel = model;
				const suppressQueuedUserPersistenceForCandidate = (params.followupRun.run.suppressNextUserMessagePersistence ?? false) || queuedUserMessagePersistedAcrossFallback;
				const suppressAssistantErrorPersistenceForCandidate = assistantErrorPersistedAcrossFallback;
				const candidateRun = resolveRunForFallbackCandidate(provider, model);
				const candidateFastMode = resolveRunFastModeForFallbackCandidate({
					run: candidateRun,
					config: runtimeConfig,
					provider,
					model,
					sessionEntry: params.getActiveSessionEntry()
				});
				const activeProbe = effectiveRun.autoFallbackPrimaryProbe;
				if (activeProbe && provider === activeProbe.provider && model === activeProbe.model) markAutoFallbackPrimaryProbe({
					probe: activeProbe,
					sessionKey: params.sessionKey
				});
				params.opts?.onModelSelected?.({
					provider,
					model,
					thinkLevel: params.followupRun.run.thinkLevel
				});
				let rollbackFallbackCandidateSelection;
				try {
					rollbackFallbackCandidateSelection = await agentTurnTiming.measure("fallback_persist_selection", () => persistFallbackCandidateSelection(provider, model, candidateRun));
					if (rollbackFallbackCandidateSelection) pendingFallbackCandidateRollback = {
						provider,
						model,
						rollback: rollbackFallbackCandidateSelection
					};
				} catch (error) {
					logVerbose(`failed to persist fallback candidate selection (non-fatal): ${String(error)}`);
				}
				const { sessionRuntimeOverride, cliExecutionProvider } = agentTurnTiming.measureSync("fallback_resolve_runtime", () => {
					const resolvedSessionRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
						provider,
						entry: params.getActiveSessionEntry(),
						cfg: runtimeConfig
					});
					const resolvedSelectedAuthProfile = resolveRunAuthProfile(candidateRun, provider, { config: runtimeConfig });
					return {
						sessionRuntimeOverride: resolvedSessionRuntimeOverride,
						cliExecutionProvider: (resolvedSessionRuntimeOverride && isCliProvider(resolvedSessionRuntimeOverride, runtimeConfig) ? resolvedSessionRuntimeOverride : void 0) ?? resolveCliRuntimeExecutionProvider({
							provider,
							cfg: runtimeConfig,
							agentId: params.followupRun.run.agentId,
							modelId: model,
							authProfileId: resolvedSelectedAuthProfile.authProfileId
						}) ?? provider
					};
				});
				if (isCliProvider(cliExecutionProvider, runtimeConfig)) {
					const cliSessionBinding = getCliSessionBinding(params.getActiveSessionEntry(), cliExecutionProvider);
					const cliLifecycleStartedAt = Date.now();
					pendingLifecycleTerminal = {
						provider,
						model,
						backstop: createAgentLifecycleTerminalBackstop({
							runId,
							sessionKey: params.sessionKey,
							startedAt: cliLifecycleStartedAt,
							getLifecycleGeneration: () => lifecycleGeneration,
							resolveAbortLifecycleFields: () => ({
								...resolveAgentRunAbortLifecycleFields(runAbortSignal),
								...isReplyOperationRestartAbort(params.replyOperation) ? {
									aborted: true,
									stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
								} : {}
							})
						})
					};
					const authProfile = resolveRunAuthProfile(candidateRun, cliExecutionProvider, { config: runtimeConfig });
					let droppedCliSessionReplacement = false;
					const hookMessageProvider = resolveOriginMessageProvider({
						originatingChannel: params.followupRun.originatingChannel,
						provider: params.sessionCtx.Provider
					});
					const cliCurrentThreadId = params.followupRun.originatingThreadId ?? params.sessionCtx.MessageThreadId;
					const cliCurrentMessageId = params.sessionCtx.InputProvenance?.kind === "internal_system" && params.sessionCtx.InputProvenance.sourceTool === "restart-sentinel" ? params.sessionCtx.ReplyToId : params.sessionCtx.MessageSidFull ?? params.sessionCtx.MessageSid;
					const cliToolSummaryTracker = createCliToolSummaryTracker({
						detailMode: params.toolProgressDetail,
						shouldEmitToolResult: params.shouldEmitToolResult,
						shouldEmitToolOutput: params.shouldEmitToolOutput,
						deliver: async (payload) => {
							await params.opts?.onToolResult?.(payload);
						}
					});
					const result = await agentTurnTiming.measure("cli_run", () => runCliAgentWithLifecycle({
						runId,
						lifecycleGeneration,
						provider: cliExecutionProvider,
						startedAt: cliLifecycleStartedAt,
						emitLifecycleTerminal: false,
						onAgentRunStart: notifyAgentRunStart,
						suppressAssistantBridge: params.followupRun.run.silentExpected,
						onAssistantText: async (text) => {
							const textForTyping = await handlePartialForTyping({ text });
							if (textForTyping === void 0 || !params.opts?.onPartialReply) return;
							await params.opts.onPartialReply({ text: textForTyping });
						},
						onReasoningText: async (text) => {
							await params.opts?.onReasoningStream?.({ text });
						},
						onToolEvent: async (payload) => {
							await cliToolSummaryTracker.noteToolEvent(payload);
							if (payload.phase === "result") return;
							const { name, phase, args } = payload;
							await Promise.all([params.typingSignals.signalToolStart(), params.opts?.onToolStart?.({
								name,
								phase,
								args,
								detailMode: params.toolProgressDetail
							})]);
						},
						onCommentaryText: params.opts?.commentaryProgressEnabled === true && params.opts.onItemEvent ? async (payload) => {
							await params.opts?.onItemEvent?.({
								itemId: payload.itemId,
								kind: "preamble",
								progressText: payload.text
							});
						} : void 0,
						onFastModeAutoProgress: async (payload) => {
							await params.opts?.onToolResult?.(payload);
						},
						onErrorBeforeLifecycle: async () => {
							if (!rollbackFallbackCandidateSelection) return;
							try {
								await rollbackFallbackCandidateSelection();
								clearPendingFallbackRollback(rollbackFallbackCandidateSelection);
							} catch (rollbackError) {
								logVerbose(`failed to roll back fallback candidate selection (non-fatal): ${String(rollbackError)}`);
							}
						},
						transformResult: params.followupRun.currentInboundEventKind === "room_event" ? (resultLocal) => keepCliSessionBindingOnlyWhenReused({
							result: resultLocal,
							existingSessionId: cliSessionBinding?.sessionId,
							onDroppedReplacement: () => {
								droppedCliSessionReplacement = true;
							}
						}) : void 0,
						runParams: {
							sessionId: params.followupRun.run.sessionId,
							sessionKey: params.sessionKey,
							agentId: params.followupRun.run.agentId,
							trigger: params.isHeartbeat ? "heartbeat" : "user",
							sessionFile: params.followupRun.run.sessionFile,
							workspaceDir: params.followupRun.run.workspaceDir,
							cwd: params.followupRun.run.cwd,
							config: runtimeConfig,
							prompt: params.commandBody,
							transcriptPrompt: params.transcriptCommandBody,
							suppressNextUserMessagePersistence: suppressQueuedUserPersistenceForCandidate,
							userTurnTranscriptRecorder,
							onUserMessagePersisted: notifyUserMessagePersisted,
							persistAssistantTranscript: params.followupRun.currentInboundEventKind !== "room_event" && params.followupRun.run.suppressTranscriptOnlyAssistantPersistence !== true,
							storePath: params.storePath,
							currentInboundEventKind: params.followupRun.currentInboundEventKind,
							currentInboundContext: params.followupRun.currentInboundContext,
							inputProvenance: params.followupRun.run.inputProvenance,
							provider: cliExecutionProvider,
							model,
							thinkLevel: params.followupRun.run.thinkLevel,
							fastMode: candidateFastMode.fastMode,
							fastModeStartedAtMs,
							fastModeAutoOnSeconds: candidateFastMode.fastModeAutoOnSeconds,
							fastModeAutoProgressState,
							isFinalFallbackAttempt: runOptions?.isFinalFallbackAttempt,
							timeoutMs: params.followupRun.run.timeoutMs,
							runTimeoutOverrideMs: params.followupRun.run.runTimeoutOverrideMs,
							runId,
							lane: runLane,
							extraSystemPrompt: params.followupRun.run.extraSystemPrompt,
							sourceReplyDeliveryMode: params.followupRun.run.sourceReplyDeliveryMode,
							silentReplyPromptMode: params.followupRun.run.silentReplyPromptMode,
							allowEmptyAssistantReplyAsSilent: params.followupRun.run.allowEmptyAssistantReplyAsSilent,
							extraSystemPromptStatic: params.followupRun.run.extraSystemPromptStatic,
							ownerNumbers: params.followupRun.run.ownerNumbers,
							cliSessionId: cliSessionBinding?.sessionId,
							cliSessionBinding,
							authProfileId: authProfile.authProfileId,
							bootstrapPromptWarningSignaturesSeen,
							bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
							images: currentTurnImages.images,
							imageOrder: currentTurnImages.imageOrder,
							skillsSnapshot: params.followupRun.run.skillsSnapshot,
							messageChannel: params.followupRun.originatingChannel ?? void 0,
							messageProvider: hookMessageProvider,
							currentChannelId: params.followupRun.originatingTo ?? params.sessionCtx.OriginatingTo ?? params.sessionCtx.To,
							senderId: params.followupRun.run.senderId,
							chatId: params.followupRun.originatingChatId,
							channelContext: params.followupRun.run.channelContext,
							currentThreadTs: cliCurrentThreadId != null ? String(cliCurrentThreadId) : void 0,
							currentMessageId: cliCurrentMessageId,
							currentInboundAudio: hasInboundAudio(params.sessionCtx),
							agentAccountId: params.followupRun.run.agentAccountId,
							senderIsOwner: params.followupRun.run.senderIsOwner,
							approvalReviewerDeviceId: params.followupRun.run.approvalReviewerDeviceId,
							toolsAllow: params.opts?.toolsAllow,
							disableTools: params.opts?.disableTools,
							abortSignal: runAbortSignal,
							replyOperation: params.replyOperation
						}
					}));
					if (droppedCliSessionReplacement) await clearDroppedCliSessionBinding({
						provider: cliExecutionProvider,
						sessionKey: params.sessionKey,
						sessionStore: params.activeSessionStore,
						storePath: params.storePath,
						activeSessionEntry: params.getActiveSessionEntry()
					});
					bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
					return result;
				}
				const { embeddedContext, senderContext, runBaseParams } = buildEmbeddedRunExecutionParams({
					run: {
						...candidateRun,
						...candidateFastMode
					},
					replyRoute: params.followupRun,
					sessionCtx: params.sessionCtx,
					hasRepliedRef: params.opts?.hasRepliedRef,
					provider,
					runId,
					promptCacheKey: params.opts?.promptCacheKey,
					allowTransientCooldownProbe: runOptions?.allowTransientCooldownProbe,
					model
				});
				const agentHarnessPolicy = sessionRuntimeOverride ? {
					runtime: sessionRuntimeOverride,
					runtimeSource: "model"
				} : resolveAgentHarnessPolicy({
					provider,
					modelId: model,
					config: runtimeConfig,
					agentId: params.followupRun.run.agentId,
					sessionKey: params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey
				});
				const embeddedRunProvider = resolveOpenAIRuntimeProvider({
					provider,
					harnessRuntime: agentHarnessPolicy.runtime,
					authProfileProvider: runBaseParams.authProfileId?.split(":", 1)[0],
					authProfileId: runBaseParams.authProfileId,
					config: runtimeConfig,
					workspaceDir: params.followupRun.run.workspaceDir
				});
				const embeddedRunHarnessOverride = sessionRuntimeOverride ?? (agentHarnessPolicy.runtime === "openclaw" && embeddedRunProvider !== provider ? "openclaw" : void 0);
				return (async () => {
					let attemptCompactionCount = 0;
					const lifecycleBackstop = createAgentLifecycleTerminalBackstop({
						runId,
						sessionKey: params.sessionKey,
						getLifecycleGeneration: () => lifecycleGeneration,
						resolveAbortLifecycleFields: () => ({
							...resolveAgentRunAbortLifecycleFields(runAbortSignal),
							...isReplyOperationRestartAbort(params.replyOperation) ? {
								aborted: true,
								stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
							} : {}
						})
					});
					pendingLifecycleTerminal = {
						provider,
						model,
						backstop: lifecycleBackstop
					};
					try {
						agentTurnTiming.logMilestoneIfSlow({
							runId,
							sessionId: params.followupRun.run.sessionId,
							sessionKey: params.sessionKey,
							milestone: "before_embedded_run"
						});
						const result = await agentTurnTiming.measure("embedded_run", () => runEmbeddedAgent({
							...embeddedContext,
							lifecycleGeneration,
							allowGatewaySubagentBinding: true,
							trigger: params.isHeartbeat ? "heartbeat" : "user",
							groupId: resolveGroupSessionKey(params.sessionCtx)?.id,
							groupChannel: normalizeOptionalString(params.sessionCtx.GroupChannel) ?? normalizeOptionalString(params.sessionCtx.GroupSubject),
							groupSpace: normalizeOptionalString(params.sessionCtx.GroupSpace),
							...senderContext,
							...runBaseParams,
							provider: embeddedRunProvider,
							agentHarnessId: embeddedRunHarnessOverride,
							agentHarnessRuntimeOverride: embeddedRunHarnessOverride,
							fastModeStartedAtMs,
							fastModeAutoProgressState,
							isFinalFallbackAttempt: runOptions?.isFinalFallbackAttempt,
							sandboxSessionKey: params.runtimePolicySessionKey,
							prompt: params.commandBody,
							transcriptPrompt: params.transcriptCommandBody,
							userTurnTranscriptRecorder,
							currentInboundEventKind: params.followupRun.currentInboundEventKind,
							currentInboundContext: params.followupRun.currentInboundContext,
							extraSystemPrompt: params.followupRun.run.extraSystemPrompt,
							sourceReplyDeliveryMode: params.followupRun.run.sourceReplyDeliveryMode,
							forceMessageTool: params.followupRun.run.sourceReplyDeliveryMode === "message_tool_only",
							silentReplyPromptMode: params.followupRun.run.silentReplyPromptMode,
							suppressNextUserMessagePersistence: suppressQueuedUserPersistenceForCandidate,
							onUserMessagePersisted: notifyUserMessagePersisted,
							suppressTranscriptOnlyAssistantPersistence: params.followupRun.run.suppressTranscriptOnlyAssistantPersistence,
							suppressAssistantErrorPersistence: suppressAssistantErrorPersistenceForCandidate,
							onAssistantErrorMessagePersisted: () => {
								assistantErrorPersistedAcrossFallback = true;
							},
							toolResultFormat: (() => {
								const channel = resolveMessageChannel(params.sessionCtx.Surface, params.sessionCtx.Provider);
								if (!channel) return "markdown";
								return isMarkdownCapableMessageChannel(channel) ? "markdown" : "plain";
							})(),
							toolProgressDetail: params.toolProgressDetail,
							suppressToolErrorWarnings: params.opts?.shouldSuppressToolErrorWarnings ?? params.opts?.suppressToolErrorWarnings,
							toolsAllow: params.opts?.toolsAllow,
							disableTools: params.opts?.disableTools,
							enableHeartbeatTool: params.opts?.enableHeartbeatTool,
							forceHeartbeatTool: params.opts?.forceHeartbeatTool,
							bootstrapContextMode: params.opts?.bootstrapContextMode,
							bootstrapContextRunKind: params.opts?.isHeartbeat ? "heartbeat" : "default",
							images: currentTurnImages.images,
							imageOrder: currentTurnImages.imageOrder,
							abortSignal: runAbortSignal,
							replyOperation: params.replyOperation,
							deferTerminalLifecycle: true,
							onExecutionStarted: (info) => {
								if (info?.lifecycleGeneration) lifecycleGeneration = info.lifecycleGeneration;
							},
							blockReplyBreak: params.resolvedBlockStreamingBreak,
							blockReplyChunking: params.blockReplyChunking,
							onPartialReply: async (payload) => {
								const textForTyping = await handlePartialForTyping(payload);
								if (!params.opts?.onPartialReply || textForTyping === void 0) return;
								await params.opts.onPartialReply({
									text: textForTyping,
									mediaUrls: payload.mediaUrls
								});
							},
							onAssistantMessageStart: async () => {
								await params.typingSignals.signalMessageStart();
								await params.opts?.onAssistantMessageStart?.();
							},
							onReasoningStream: params.typingSignals.shouldStartOnReasoning || params.opts?.onReasoningStream ? async (payload) => {
								if (params.followupRun.run.silentExpected) return;
								await params.typingSignals.signalReasoningDelta();
								await params.opts?.onReasoningStream?.({
									text: payload.text,
									mediaUrls: payload.mediaUrls,
									isReasoningSnapshot: payload.isReasoningSnapshot
								});
							} : void 0,
							onReasoningEnd: params.opts?.onReasoningEnd,
							onAgentEvent: async (evt) => {
								lifecycleBackstop.note(evt);
								const hasLifecyclePhase = evt.stream === "lifecycle" && typeof evt.data.phase === "string";
								if (evt.stream !== "lifecycle" || hasLifecyclePhase) notifyAgentRunStart();
								if (evt.stream === "tool") {
									const phase = readStringValue(evt.data.phase) ?? "";
									const name = readStringValue(evt.data.name);
									const toolCallId = readStringValue(evt.data.toolCallId) ?? "";
									const args = evt.data.args && typeof evt.data.args === "object" ? evt.data.args : void 0;
									if (sourceRepliesAreToolOnly && toolCallId && name && (phase === "start" || phase === "update") && args && isMessagingToolSendAction(name, args)) messageToolOnlyDeliveryToolCallIds.add(toolCallId);
									if (shouldSuppressProgressAfterMessageToolDelivery()) return;
									if (phase === "start" || phase === "update") {
										const toolStartProgressPromise = params.opts?.onToolStart?.({
											itemId: readStringValue(evt.data.itemId),
											toolCallId: readStringValue(evt.data.toolCallId),
											name,
											phase,
											args,
											detailMode: params.toolProgressDetail
										});
										await Promise.all([params.typingSignals.signalToolStart(), toolStartProgressPromise]);
									}
									const commandOutput = buildCommandOutputFromToolResultEvent(evt);
									if (commandOutput) await params.opts?.onCommandOutput?.(commandOutput);
								}
								const suppressItemChannelProgress = evt.stream === "item" && evt.data.suppressChannelProgress === true && Boolean(params.opts?.onToolStart);
								const itemPhase = evt.stream === "item" ? readStringValue(evt.data.phase) : "";
								const itemName = evt.stream === "item" ? readStringValue(evt.data.name) : "";
								const itemStatus = evt.stream === "item" ? readStringValue(evt.data.status) : "";
								const itemToolCallId = evt.stream === "item" ? readStringValue(evt.data.toolCallId) ?? "" : "";
								const completedMessageToolDelivery = sourceRepliesAreToolOnly && itemPhase === "end" && itemStatus === "completed" && itemToolCallId.length > 0 && messageToolOnlyDeliveryToolCallIds.has(itemToolCallId);
								const suppressProgressAfterMessageToolDelivery = shouldSuppressProgressAfterMessageToolDelivery();
								if (completedMessageToolDelivery) {
									messageToolOnlyDeliveryToolCallIds.delete(itemToolCallId);
									messageToolOnlyDeliveryCompleted = true;
								}
								if (evt.stream === "item" && !suppressItemChannelProgress && (!suppressProgressAfterMessageToolDelivery || completedMessageToolDelivery)) await params.opts?.onItemEvent?.({
									itemId: readStringValue(evt.data.itemId),
									toolCallId: readStringValue(evt.data.toolCallId),
									kind: readStringValue(evt.data.kind),
									title: readStringValue(evt.data.title),
									name: itemName,
									phase: itemPhase,
									status: itemStatus,
									summary: readStringValue(evt.data.summary),
									progressText: readStringValue(evt.data.progressText),
									meta: readStringValue(evt.data.meta),
									approvalId: readStringValue(evt.data.approvalId),
									approvalSlug: readStringValue(evt.data.approvalSlug)
								});
								if (evt.stream === "plan" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.opts?.onPlanUpdate?.({
									phase: readStringValue(evt.data.phase),
									title: readStringValue(evt.data.title),
									explanation: readStringValue(evt.data.explanation),
									steps: Array.isArray(evt.data.steps) ? evt.data.steps.filter((step) => typeof step === "string") : void 0,
									source: readStringValue(evt.data.source)
								});
								if (evt.stream === "approval" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.opts?.onApprovalEvent?.({
									phase: readStringValue(evt.data.phase),
									kind: readStringValue(evt.data.kind),
									status: readStringValue(evt.data.status),
									title: readStringValue(evt.data.title),
									itemId: readStringValue(evt.data.itemId),
									toolCallId: readStringValue(evt.data.toolCallId),
									approvalId: readStringValue(evt.data.approvalId),
									approvalSlug: readStringValue(evt.data.approvalSlug),
									command: readStringValue(evt.data.command),
									host: readStringValue(evt.data.host),
									reason: readStringValue(evt.data.reason),
									scope: readApprovalScopeValue(evt.data.scope),
									message: readStringValue(evt.data.message)
								});
								if (evt.stream === "command_output" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.opts?.onCommandOutput?.({
									itemId: readStringValue(evt.data.itemId),
									phase: readStringValue(evt.data.phase),
									title: readStringValue(evt.data.title),
									toolCallId: readStringValue(evt.data.toolCallId),
									name: readStringValue(evt.data.name),
									output: readStringValue(evt.data.output),
									status: readStringValue(evt.data.status),
									exitCode: typeof evt.data.exitCode === "number" || evt.data.exitCode === null ? evt.data.exitCode : void 0,
									durationMs: typeof evt.data.durationMs === "number" ? evt.data.durationMs : void 0,
									cwd: readStringValue(evt.data.cwd)
								});
								if (evt.stream === "patch" && !shouldSuppressProgressAfterMessageToolDelivery()) await params.opts?.onPatchSummary?.({
									itemId: readStringValue(evt.data.itemId),
									phase: readStringValue(evt.data.phase),
									title: readStringValue(evt.data.title),
									toolCallId: readStringValue(evt.data.toolCallId),
									name: readStringValue(evt.data.name),
									added: Array.isArray(evt.data.added) ? evt.data.added.filter((entry) => typeof entry === "string") : void 0,
									modified: Array.isArray(evt.data.modified) ? evt.data.modified.filter((entry) => typeof entry === "string") : void 0,
									deleted: Array.isArray(evt.data.deleted) ? evt.data.deleted.filter((entry) => typeof entry === "string") : void 0,
									summary: readStringValue(evt.data.summary)
								});
								if (evt.stream === "compaction") {
									const phase = readStringValue(evt.data.phase) ?? "";
									const backend = readStringValue(evt.data.backend);
									const hookMessages = readCompactionHookMessages(evt.data.messages);
									const sendCompactionUserNotices = async (noticePhase) => {
										if (hookMessages.length > 0) await sendCompactionHookMessages(hookMessages);
										if (notifyUserAboutCompaction) await sendCompactionNotice(noticePhase);
									};
									if (phase === "start") {
										if (params.opts?.onCompactionStart) await params.opts.onCompactionStart();
										await sendCompactionUserNotices("start");
									}
									if (phase === "end") if (evt.data?.completed === true) {
										attemptCompactionCount += 1;
										if (backend === CODEX_APP_SERVER_COMPACTION_BACKEND) {
											const consoleMessage = `codex app-server auto-compaction succeeded for ${formatCompactionModelRef(provider, model)}; refreshed session context`;
											agentCompactionLog.info("codex app-server auto-compaction succeeded", {
												event: "codex_app_server_compaction_succeeded",
												backend,
												provider,
												model,
												sessionKey: params.sessionKey,
												sessionId: effectiveRun.sessionId,
												threadId: readStringValue(evt.data.threadId),
												turnId: readStringValue(evt.data.turnId),
												itemId: readStringValue(evt.data.itemId),
												compactionCount: attemptCompactionCount,
												consoleMessage
											});
										}
										if (params.opts?.onCompactionEnd) await params.opts.onCompactionEnd();
										await sendCompactionUserNotices("end");
									} else await sendCompactionUserNotices("incomplete");
								}
							},
							onBlockReply: blockReplyHandler,
							onBlockReplyFlush: params.blockStreamingEnabled && blockReplyPipeline ? async () => {
								await blockReplyPipeline.flush({ force: true });
							} : void 0,
							shouldEmitToolResult: params.shouldEmitToolResult,
							shouldEmitToolOutput: params.shouldEmitToolOutput,
							bootstrapPromptWarningSignaturesSeen,
							bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
							onToolResult: onToolResult ? (() => {
								let toolResultChain = Promise.resolve();
								return (payload) => {
									toolResultChain = toolResultChain.then(async () => {
										const { text, skip } = normalizeStreamingText(payload);
										if (skip) return;
										if (text !== void 0) await params.typingSignals.signalTextDelta(text);
										await onToolResult({
											...payload,
											text
										});
									}).catch((err) => {
										logVerbose(`tool result delivery failed: ${String(err)}`);
									});
									const task = toolResultChain.finally(() => {
										params.pendingToolTasks.delete(task);
									});
									params.pendingToolTasks.add(task);
								};
							})() : void 0
						}));
						bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
						const resultCompactionCount = Math.max(0, result.meta?.agentMeta?.compactionCount ?? 0);
						attemptCompactionCount = Math.max(attemptCompactionCount, resultCompactionCount);
						return result;
					} catch (err) {
						if (rollbackFallbackCandidateSelection) try {
							await rollbackFallbackCandidateSelection();
							clearPendingFallbackRollback(rollbackFallbackCandidateSelection);
						} catch (rollbackError) {
							logVerbose(`failed to roll back fallback candidate selection (non-fatal): ${String(rollbackError)}`);
						}
						throw err;
					} finally {
						autoCompactionCount += attemptCompactionCount;
					}
				})();
			}
		}));
		agentTurnTiming.logIfSlow({
			runId,
			sessionId: params.followupRun.run.sessionId,
			sessionKey: params.sessionKey,
			outcome: "completed"
		});
		runResult = fallbackResult.result;
		fallbackProvider = fallbackResult.provider;
		fallbackModel = fallbackResult.model;
		fallbackExhausted = fallbackResult.outcome === "exhausted";
		const settledLifecycleTerminal = pendingLifecycleTerminal?.provider === fallbackProvider && pendingLifecycleTerminal.model === fallbackModel ? pendingLifecycleTerminal.backstop : void 0;
		pendingLifecycleTerminal = void 0;
		const restartAbortReason = runAbortSignal?.reason;
		if (isReplyOperationRestartAbort(params.replyOperation)) {
			settledLifecycleTerminal?.emit("end", runResult);
			throw isAgentRunRestartAbortReason(restartAbortReason) ? restartAbortReason : createAgentRunRestartAbortError();
		}
		fallbackAttempts = Array.isArray(fallbackResult.attempts) ? fallbackResult.attempts.map((attempt) => ({
			provider: attempt.provider,
			model: attempt.model,
			error: attempt.error,
			reason: attempt.reason || void 0,
			status: typeof attempt.status === "number" ? attempt.status : void 0,
			code: attempt.code || void 0
		})) : [];
		if (!fallbackExhausted) await clearRecoveredAutoFallbackPrimaryProbe({
			provider: fallbackProvider,
			model: fallbackModel
		});
		const embeddedError = runResult.meta?.error;
		const deferredLifecycleError = settledLifecycleTerminal?.getDeferredError();
		const userFacingErrorPayload = runResult.payloads?.find((payload) => payload.isError === true && typeof payload.text === "string")?.text;
		const terminalErrorMessage = deferredLifecycleError ?? userFacingErrorPayload ?? (embeddedError ? "Agent run failed" : void 0);
		const emitSettledLifecycleError = (error, extraData) => {
			if (settledLifecycleTerminal) {
				settledLifecycleTerminal.emit("error", error, extraData);
				return;
			}
			emitAgentEvent({
				runId,
				lifecycleGeneration,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				stream: "lifecycle",
				data: {
					phase: "error",
					error: error.message,
					endedAt: Date.now(),
					...extraData
				}
			});
		};
		if (embeddedError && isContextOverflowError(embeddedError.message)) {
			emitSettledLifecycleError(new Error(terminalErrorMessage ?? "Agent run failed"));
			defaultRuntime.error(`Auto-compaction failed (${embeddedError.message}). Preserving existing session mapping for ${params.sessionKey ?? params.followupRun.run.sessionId}.`);
			params.replyOperation?.fail("run_failed", embeddedError);
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: buildContextOverflowRecoveryText({
					preserveSessionMapping: true,
					cfg: runtimeConfig,
					agentId: params.followupRun.run.agentId,
					primaryProvider: params.followupRun.run.provider,
					primaryModel: params.followupRun.run.model,
					runtimeProvider: attemptedRuntimeProvider,
					runtimeModel: attemptedRuntimeModel,
					activeSessionEntry: params.getActiveSessionEntry()
				}) })
			};
		}
		if (embeddedError?.kind === "role_ordering") {
			emitSettledLifecycleError(new Error(terminalErrorMessage ?? "Agent run failed"));
			const providerRequestError = classifyProviderRequestError(embeddedError);
			params.replyOperation?.fail("run_failed", embeddedError);
			const embeddedErrorText = formatErrorMessage(embeddedError).replace(/\.\s*$/, "");
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: shouldSurfaceToControlUi ? `⚠️ Agent failed before reply: ${embeddedErrorText}.\nLogs: openclaw logs --follow` : providerRequestError?.userMessage ?? "⚠️ The model provider rejected the conversation state. Please try again, or use /new to start a fresh session." })
			};
		}
		const terminalMetadata = resolveAgentLifecycleTerminalMetadata(runResult.meta);
		if (fallbackExhausted) {
			const exhaustionError = new Error(terminalErrorMessage ?? "All model fallback candidates failed");
			emitSettledLifecycleError(exhaustionError, {
				...terminalMetadata,
				fallbackExhaustedFailure: true
			});
			params.replyOperation?.retainFailureUntilComplete();
			params.replyOperation?.fail("run_failed", exhaustionError);
		} else if (deferredLifecycleError || embeddedError) {
			const terminalError = new Error(terminalErrorMessage ?? "Agent run failed");
			emitSettledLifecycleError(terminalError, terminalMetadata);
			params.replyOperation?.retainFailureUntilComplete();
			params.replyOperation?.fail("run_failed", terminalError);
		} else settledLifecycleTerminal?.emit("end", runResult);
		break;
	} catch (err) {
		if (err instanceof LiveSessionModelSwitchError) {
			liveModelSwitchRetries += 1;
			if (liveModelSwitchRetries > 2) {
				defaultRuntime.error(`Live model switch failed after 2 retries (${sanitizeForLog(err.provider)}/${sanitizeForLog(err.model)}). The requested model may be unavailable.`);
				takePendingLifecycleTerminal()?.emit("error", err);
				const switchErrorText = shouldSurfaceToControlUi ? "⚠️ Agent failed before reply: model switch could not be completed. The requested model may be temporarily unavailable.\nLogs: openclaw logs --follow" : isVerboseFailureDetailEnabled(params.resolvedVerboseLevel) ? "⚠️ Agent failed before reply: model switch could not be completed. The requested model may be temporarily unavailable. Please try again shortly." : "⚠️ Model switch could not be completed. The requested model may be temporarily unavailable. Please try again shortly.";
				params.replyOperation?.fail("run_failed", err);
				return {
					kind: "final",
					payload: markAgentRunFailureReplyPayload({ text: resolveExternalRunFailureTextForConversation({
						text: switchErrorText,
						sessionCtx: params.sessionCtx,
						isGenericRunnerFailure: !shouldSurfaceToControlUi,
						cfg: params.followupRun.run.config
					}) })
				};
			}
			applyLiveModelSwitchToRun(params.followupRun.run, err);
			if (runnableRun !== params.followupRun.run) applyLiveModelSwitchToRun(runnableRun, err);
			if (effectiveRun !== runnableRun && effectiveRun !== params.followupRun.run) applyLiveModelSwitchToRun(effectiveRun, err);
			pendingLifecycleTerminal = void 0;
			fallbackProvider = err.provider;
			fallbackModel = err.model;
			continue;
		}
		const message = formatErrorMessage(err);
		agentTurnTiming.logIfSlow({
			runId,
			sessionId: params.followupRun.run.sessionId,
			sessionKey: params.sessionKey,
			outcome: "error",
			error: message
		});
		const isBilling = isFallbackSummaryError(err) ? hasBillingAttemptSummary(err) : isFailoverError(err) ? err.reason === "billing" : isBillingErrorMessage(message);
		const isContextOverflow = !isBilling && isLikelyContextOverflowError(message);
		const isCompactionFailure = !isBilling && isCompactionFailureError(message);
		const providerRequestError = !isBilling && !shouldSurfaceToControlUi ? classifyProviderRequestError(err) : void 0;
		const isTransientHttp = isTransientHttpError(message);
		if (isReplyOperationRestartAbort(params.replyOperation)) {
			takePendingLifecycleTerminal()?.emit("end", err);
			if (params.isRestartRecoveryArmed?.() !== true) return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: buildRestartLifecycleReplyText() })
			};
			return {
				kind: "final",
				payload: { text: SILENT_REPLY_TOKEN }
			};
		}
		if (isReplyOperationUserAbort(params.replyOperation)) {
			takePendingLifecycleTerminal()?.emit("error", err);
			return {
				kind: "final",
				payload: { text: SILENT_REPLY_TOKEN }
			};
		}
		const restartLifecycleError = resolveRestartLifecycleError(err);
		if (restartLifecycleError instanceof GatewayDrainingError) {
			takePendingLifecycleTerminal()?.emit("error", restartLifecycleError);
			params.replyOperation?.fail("gateway_draining", restartLifecycleError);
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: buildRestartLifecycleReplyText() })
			};
		}
		if (restartLifecycleError instanceof CommandLaneClearedError) {
			takePendingLifecycleTerminal()?.emit("error", restartLifecycleError);
			params.replyOperation?.fail("command_lane_cleared", restartLifecycleError);
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: buildRestartLifecycleReplyText() })
			};
		}
		if (isCompactionFailure) {
			takePendingLifecycleTerminal()?.emit("error", err);
			defaultRuntime.error(`Auto-compaction failed (${message}). Preserving existing session mapping for ${params.sessionKey ?? params.followupRun.run.sessionId}.`);
			params.replyOperation?.fail("run_failed", err);
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: buildContextOverflowRecoveryText({
					duringCompaction: true,
					preserveSessionMapping: true,
					cfg: runtimeConfig,
					agentId: params.followupRun.run.agentId,
					primaryProvider: params.followupRun.run.provider,
					primaryModel: params.followupRun.run.model,
					runtimeProvider: attemptedRuntimeProvider,
					runtimeModel: attemptedRuntimeModel,
					activeSessionEntry: params.getActiveSessionEntry()
				}) })
			};
		}
		if (providerRequestError) {
			takePendingLifecycleTerminal()?.emit("error", err);
			params.replyOperation?.fail("run_failed", err);
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: providerRequestError.userMessage })
			};
		}
		if (isTransientHttp && consumeTransientHttpRetry()) {
			pendingLifecycleTerminal = void 0;
			defaultRuntime.error(`Transient HTTP provider error before reply (${message}). Retrying once in ${TRANSIENT_HTTP_RETRY_DELAY_MS}ms.`);
			await new Promise((resolve) => {
				setTimeout(resolve, TRANSIENT_HTTP_RETRY_DELAY_MS);
			});
			continue;
		}
		defaultRuntime.error(`Embedded agent failed before reply: ${message}`);
		const isFallbackSummary = isFallbackSummaryError(err);
		const isPureTransientSummary = isFallbackSummary ? isPureTransientRateLimitSummary(err) : false;
		const isRateLimit = isFallbackSummary ? isPureTransientSummary : isRateLimitErrorMessage(message);
		const rateLimitOrOverloadedCopy = !isFallbackSummary || isPureTransientSummary ? formatRateLimitOrOverloadedErrorCopy(message) : void 0;
		const trimmedMessage = (isTransientHttp ? sanitizeUserFacingText(message, { errorContext: true }) : message).replace(/\.\s*$/, "");
		const externalRunFailureReply = !isBilling && !(isRateLimit && !isOverloadedErrorMessage(message)) && !rateLimitOrOverloadedCopy && !isContextOverflow && !shouldSurfaceToControlUi ? buildExternalRunFailureReply({
			message,
			error: err
		}, {
			includeDetails: isVerboseFailureDetailEnabled(params.resolvedVerboseLevel),
			isHeartbeat: params.isHeartbeat
		}) : void 0;
		const genericFallbackText = params.isHeartbeat ? HEARTBEAT_EXTERNAL_RUN_FAILURE_TEXT : GENERIC_EXTERNAL_RUN_FAILURE_TEXT;
		const userVisibleFallbackText = resolveExternalRunFailureTextForConversation({
			text: isBilling ? resolveBillingFailureReplyText(err) : isRateLimit && !isOverloadedErrorMessage(message) ? buildRateLimitCooldownMessage(err) : rateLimitOrOverloadedCopy ? rateLimitOrOverloadedCopy : isContextOverflow ? "⚠️ Context overflow — prompt too large for this model. Try a shorter message or a larger-context model." : shouldSurfaceToControlUi ? `⚠️ Agent failed before reply: ${trimmedMessage}.\nLogs: openclaw logs --follow` : externalRunFailureReply?.text ?? genericFallbackText,
			sessionCtx: params.sessionCtx,
			isGenericRunnerFailure: externalRunFailureReply?.isGenericRunnerFailure ?? false,
			cfg: params.followupRun.run.config
		});
		const abortLifecycleFields = {
			...resolveAgentRunAbortLifecycleFields(params.replyOperation?.abortSignal.aborted === true ? params.replyOperation.abortSignal : params.opts?.abortSignal?.aborted === true ? params.opts.abortSignal : void 0),
			...isReplyOperationRestartAbort(params.replyOperation) ? {
				aborted: true,
				stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
			} : {}
		};
		const failedLifecycleTerminal = takePendingLifecycleTerminal();
		if (failedLifecycleTerminal) failedLifecycleTerminal.emit("error", err, { fallbackExhaustedFailure: true });
		else emitAgentEvent({
			runId,
			lifecycleGeneration,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			stream: "lifecycle",
			data: {
				phase: "error",
				error: message,
				endedAt: Date.now(),
				...abortLifecycleFields,
				fallbackExhaustedFailure: true
			}
		});
		params.replyOperation?.fail("run_failed", err);
		return {
			kind: "final",
			payload: markAgentRunFailureReplyPayload({ text: userVisibleFallbackText })
		};
	}
	const finalEmbeddedError = runResult?.meta?.error;
	const hasPayloadText = runResult?.payloads?.some((p) => normalizeOptionalString(p.text));
	if (finalEmbeddedError && !hasPayloadText) {
		if (isContextOverflowError(finalEmbeddedError.message ?? "")) {
			params.replyOperation?.fail("run_failed", finalEmbeddedError);
			return {
				kind: "final",
				payload: markAgentRunFailureReplyPayload({ text: "⚠️ Context overflow — this conversation is too large for the model. Use /new to start a fresh session." })
			};
		}
	}
	if (runResult) {
		if (!runResult.payloads?.some((p) => !p.isError && !p.isReasoning && hasOutboundReplyContent(p, { trimText: true }))) {
			const metaErrorMsg = finalEmbeddedError?.message ?? "";
			const rawErrorPayloadText = runResult.payloads?.find((p) => p.isError && hasNonEmptyString(p.text) && !p.text.startsWith("⚠️"))?.text ?? "";
			const errorCandidate = metaErrorMsg || rawErrorPayloadText;
			const formattedErrorCandidate = errorCandidate ? formatRateLimitOrOverloadedErrorCopy(errorCandidate) : void 0;
			if (formattedErrorCandidate) runResult.payloads = [markAgentRunFailureReplyPayload({
				text: resolveExternalRunFailureTextForConversation({
					text: formattedErrorCandidate,
					sessionCtx: params.sessionCtx,
					isGenericRunnerFailure: false,
					cfg: params.followupRun.run.config
				}),
				isError: true
			})];
		}
	}
	return {
		kind: "success",
		runId,
		runResult,
		fallbackProvider,
		fallbackModel,
		...fallbackExhausted ? { fallbackExhausted: true } : {},
		fallbackAttempts,
		didLogHeartbeatStrip,
		autoCompactionCount,
		directlySentBlockKeys: directlySentBlockKeys.size > 0 ? directlySentBlockKeys : void 0,
		directlySentBlockPayloads: directlySentBlockPayloads.filter((payload) => payload !== void 0)
	};
}
//#endregion
//#region src/auto-reply/reply/reply-turn-admission.ts
function isAbortSignalAborted(signal) {
	return signal?.aborted === true;
}
/** Waits for or claims the per-session reply run slot. */
async function admitReplyTurn(params) {
	let sessionId = params.sessionId;
	const waitTimeoutMs = params.waitTimeoutMs ?? (params.kind === "queued_followup" ? 15e3 : void 0);
	while (true) {
		if (isAbortSignalAborted(params.upstreamAbortSignal)) return {
			status: "skipped",
			reason: "aborted"
		};
		try {
			return {
				status: "owned",
				operation: createReplyOperation({
					sessionKey: params.sessionKey,
					sessionId,
					resetTriggered: params.resetTriggered,
					routeThreadId: params.routeThreadId,
					upstreamAbortSignal: params.upstreamAbortSignal,
					respectFollowupAdmissionBarrier: params.kind === "queued_followup" || params.kind === "heartbeat"
				})
			};
		} catch (error) {
			if (error instanceof ReplyRunFollowupAdmissionBlockedError) {
				if (params.kind === "heartbeat") return {
					status: "skipped",
					reason: "active-run"
				};
				const followupAdmission = await waitForReplyRunFollowupAdmission(params.sessionKey, waitTimeoutMs ?? 15e3, { signal: params.upstreamAbortSignal });
				if (!followupAdmission.settled) return {
					status: "skipped",
					reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run"
				};
				sessionId = followupAdmission.sessionId ?? sessionId;
				continue;
			}
			if (!(error instanceof ReplyRunAlreadyActiveError)) throw error;
			const activeOperation = replyRunRegistry.get(params.sessionKey);
			if (params.kind === "heartbeat" || params.kind === "control_abort") return {
				status: "skipped",
				reason: "active-run",
				activeOperation
			};
			if (params.waitForActive === false) return {
				status: "skipped",
				reason: "active-run",
				activeOperation
			};
			if (!await replyRunRegistry.waitForIdle(params.sessionKey, waitTimeoutMs, { signal: params.upstreamAbortSignal })) return {
				status: "skipped",
				reason: isAbortSignalAborted(params.upstreamAbortSignal) ? "aborted" : "active-run",
				activeOperation
			};
			if (activeOperation) sessionId = activeOperation.sessionId;
		}
	}
}
/** Resolves the default turn kind from reply options. */
function resolveReplyTurnKind(opts) {
	return opts?.isHeartbeat === true ? "heartbeat" : "visible";
}
//#endregion
//#region src/auto-reply/reply/reply-usage-state.ts
const TTL_MS = 5 * 6e4;
const store = /* @__PURE__ */ new Map();
function prune(now) {
	for (const [key, value] of store) if (value.expiresAt < now) store.delete(key);
}
function recordReplyUsageState(runId, snapshot) {
	if (!runId) return;
	const now = Date.now();
	store.set(runId, {
		snapshot,
		expiresAt: now + TTL_MS
	});
	prune(now);
}
function consumeReplyUsageState(runId) {
	if (!runId) return;
	const value = store.get(runId);
	return value && value.expiresAt >= Date.now() ? value.snapshot : void 0;
}
//#endregion
export { createCliToolSummaryTracker as _, buildCommandOutputFromToolResultEvent as a, createAgentLifecycleTerminalBackstop as b, resolveRunAfterAutoFallbackPrimaryProbeRecheck as c, normalizeReplyPayloadDirectives as d, createCompactionHookNoticePayload as f, clearDroppedCliSessionBinding as g, shouldNotifyUserAboutCompaction as h, resolveReplyTurnKind as i, resolveSessionRuntimeOverrideForProvider as l, readCompactionHookMessages as m, recordReplyUsageState as n, buildKnownAgentRunFailureReplyPayload as o, createCompactionNoticePayload as p, admitReplyTurn as r, buildPreflightCompactionFailureText as s, consumeReplyUsageState as t, runAgentTurnWithFallback as u, keepCliSessionBindingOnlyWhenReused as v, resolveAgentLifecycleTerminalMetadata as x, runCliAgentWithLifecycle as y };

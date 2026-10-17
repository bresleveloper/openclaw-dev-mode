import { E as createDiagnosticTraceContextFromActiveScope, P as runWithDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as deliveryContextKey, s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { f as clearChannelHistoryIfEnabled } from "./history-DpVhWkup.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { c as updateSessionEntry } from "./session-accessor.reset-Bn2-AwEV.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DPQX-jTt.mjs";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-CTPwC17-.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-Cl-1FBey.mjs";
import { n as withDispatchProcessedOutcomeSink } from "./dispatch-processed-outcome-CM-0_qe5.mjs";
import { t as isRecentOutboundMessageIdentity } from "./outbound-echo-D3kCTGGn.mjs";
import { a as resolvePairLoopGuardSettings, r as createPairLoopGuard } from "./pair-loop-guard-runtime-Droda0LC.mjs";
//#region src/channels/turn/bot-loop-protection.ts
const channelBotPairLoopGuard = createPairLoopGuard({ pruneIntervalMs: 6e4 });
/** Records a bot pair interaction and returns whether the loop guard should suppress it. */
function recordChannelBotPairLoopAndCheckSuppression(params) {
	return channelBotPairLoopGuard.recordAndCheck({
		scopeId: params.scopeId,
		conversationId: params.conversationId,
		senderId: params.senderId,
		receiverId: params.receiverId,
		eventId: params.eventId,
		settings: resolvePairLoopGuardSettings({
			config: params.config,
			defaultsConfig: params.defaultsConfig,
			defaultEnabled: params.defaultEnabled
		}),
		nowMs: params.nowMs
	});
}
//#endregion
//#region src/channels/turn/dispatch-result.ts
const hasFinalSignal = (signals) => signals.fallbackDelivered === true || signals.deliverySummaryDelivered === true;
const hasVisibleSignal = (result, signals) => result?.observedReplyDelivery === true || signals.observedReplyDelivery === true || hasFinalSignal(signals);
/** Zero-filled reply dispatch count map used before merging optional provider counts. */
const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS = {
	tool: 0,
	block: 0,
	final: 0
};
/** Returns whether a turn produced any visible reply delivery signal. */
function hasVisibleChannelTurnDispatchFromReceipt(result, signals = {}) {
	return result?.settledReceipt?.anyVisibleDelivered === true || hasVisibleSignal(result, signals);
}
function resolveChannelTurnDispatchCounts(result) {
	const counts = result?.settledReceipt?.counts;
	return counts ? {
		tool: counts.tool?.delivered ?? 0,
		block: counts.block?.delivered ?? 0,
		final: counts.final?.delivered ?? 0
	} : {
		...EMPTY_CHANNEL_TURN_DISPATCH_COUNTS,
		...result?.counts
	};
}
function hasVisibleChannelTurnDispatch(result, signals = {}) {
	if (result?.settledReceipt) return hasVisibleChannelTurnDispatchFromReceipt(result, signals);
	return hasVisibleSignal(result, signals) || result?.queuedFinal === true || Object.values(resolveChannelTurnDispatchCounts(result)).some((count) => count > 0);
}
function hasFinalChannelTurnDispatch(result, signals = {}) {
	const finalCounts = result?.settledReceipt?.counts.final;
	return hasFinalSignal(signals) || (result?.settledReceipt ? (finalCounts?.delivered ?? 0) > 0 || (finalCounts?.failedAfterSend ?? 0) > 0 : result?.queuedFinal === true || resolveChannelTurnDispatchCounts(result).final > 0);
}
//#endregion
//#region src/channels/turn/pending-delivery-notice.ts
const PENDING_DELIVERY_NOTICE = "I couldn’t confirm whether my previous reply reached this chat, so I won’t resend it automatically. Please ask for any missing remainder.";
function noticeId(intentId) {
	return `main-session-restart-recovery:pending-final:${intentId}`;
}
async function deliverPendingDeliveryNotice(sessionKey, storePath) {
	const entry = loadSessionEntryReadOnly({
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const notice = entry?.pendingDeliveryNotice;
	const context = normalizeDeliveryContext(notice?.context);
	const runtime = getGatewayRecoveryRuntime();
	if (!entry || !runtime || !notice || notice.state !== "owed" || !context?.channel || !context.to || deliveryContextKey(context) !== deliveryContextKey(deliveryContextFromSession(entry))) return;
	const idempotencyKey = noticeId(notice.intentId);
	let delivered;
	try {
		delivered = !(await runtime.sendRecoveryNotice({
			channel: context.channel,
			to: context.to,
			accountId: context.accountId,
			threadId: context.threadId,
			text: PENDING_DELIVERY_NOTICE,
			idempotencyKey
		})).suppressed;
	} catch {
		const owner = await findDeliveryIntentOwner(idempotencyKey);
		if (owner?.status !== "completed" && owner?.status !== "failed") return;
		delivered = owner.status === "completed";
	}
	if (delivered && !(await appendAssistantMessageToSessionTranscript({
		sessionKey,
		storePath,
		expectedSessionId: entry.sessionId,
		text: PENDING_DELIVERY_NOTICE,
		idempotencyKey
	})).ok) return;
	await updateSessionEntry({
		sessionKey,
		storePath
	}, (current) => current.sessionId === entry.sessionId && current.pendingDeliveryNotice?.intentId === notice.intentId && current.pendingDeliveryNotice.state !== "acknowledged" ? {
		pendingDeliveryNotice: {
			...current.pendingDeliveryNotice,
			state: delivered ? "acknowledged" : "unresolved"
		},
		updatedAt: Date.now()
	} : null, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
}
//#endregion
//#region src/channels/turn/execution.ts
const log = createSubsystemLogger("channels/turn/execution");
function emit(params, event) {
	params.log?.({
		channel: params.channel,
		accountId: params.accountId,
		messageId: params.messageId,
		sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
		admission: params.admission?.kind ?? "dispatch",
		...event
	});
}
function clearPendingHistoryAfterTurn(params) {
	if (!params?.isGroup || !params.historyKey || !params.historyMap || params.limit === void 0) return;
	clearChannelHistoryIfEnabled({
		historyMap: params.historyMap,
		historyKey: params.historyKey,
		limit: params.limit
	});
}
function resolveRecordSessionKey(params) {
	const explicitSessionKey = params.record?.sessionKey;
	if (explicitSessionKey === void 0) return params.ctxPayload.SessionKey ?? params.routeSessionKey;
	const normalizedSessionKey = explicitSessionKey.trim();
	if (!normalizedSessionKey) throw new Error("Channel turn record.sessionKey must be non-empty.");
	if (normalizedSessionKey !== explicitSessionKey) throw new Error("Channel turn record.sessionKey must not include surrounding whitespace.");
	return explicitSessionKey;
}
function maybeWarnZeroCountVisibleDispatch(params) {
	if (params.admission?.kind === "observeOnly" || params.ctxPayload.InternalTurnSource !== void 0) return;
	const dispatchResult = params.dispatchResult;
	if (dispatchResult?.deferredToActiveRun) return;
	if (hasVisibleChannelTurnDispatch(dispatchResult)) return;
	const processed = params.processedOutcome;
	const cause = processed ? `${processed.outcome}${processed.reason ? `:${processed.reason}` : ""}` : void 0;
	log.warn(`visible channel turn dispatched with no queued reply payloads: channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.ctxPayload.SessionKey ?? params.routeSessionKey} cause=${cause ?? "unknown"}`);
	emit(params, {
		stage: "dispatch",
		event: "warning",
		reason: "zero-count-visible-dispatch"
	});
}
function dropPreparedChannelTurn(params, reason, messageId = params.messageId) {
	const admission = {
		kind: "drop",
		reason
	};
	emit(params, {
		stage: "authorize",
		event: "drop",
		messageId,
		admission: admission.kind,
		reason: admission.reason
	});
	return {
		admission,
		dispatched: false,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey
	};
}
function resolveBotLoopProtectionDrop(params) {
	return params.botLoopProtection && recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed ? dropPreparedChannelTurn(params, "bot-loop-protection") : void 0;
}
function resolveOutboundEchoDrop(params) {
	const conversationId = [params.ctxPayload.NativeChannelId, params.ctxPayload.ChatId].find((value) => typeof value === "string" && value.trim().length > 0);
	if (!conversationId) return;
	const matchedMessageId = [
		params.messageId,
		params.ctxPayload.MessageSidFull,
		params.ctxPayload.MessageSid
	].find((messageId) => typeof messageId === "string" && isRecentOutboundMessageIdentity({
		channel: params.channel,
		accountId: params.accountId,
		conversationId,
		messageId
	}));
	const sourceId = params.outboundEchoSourceId?.trim();
	const matchesSource = sourceId ? isRecentOutboundMessageIdentity({
		channel: params.channel,
		accountId: params.accountId,
		conversationId,
		sourceId
	}) : false;
	if (!matchedMessageId && !matchesSource) return;
	return dropPreparedChannelTurn(params, "outbound-echo", params.messageId ?? matchedMessageId);
}
async function runPreparedChannelTurnCore(params, options) {
	const trace = createDiagnosticTraceContextFromActiveScope();
	return await runWithDiagnosticTraceContext(trace, () => runPreparedChannelTurnCoreInTrace(params, options));
}
async function runPreparedChannelTurnCoreInTrace(params, options) {
	const admission = params.admission ?? { kind: "dispatch" };
	const outboundEchoDrop = resolveOutboundEchoDrop(params);
	if (outboundEchoDrop) {
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("outboundEcho");
		return outboundEchoDrop;
	}
	const botLoopDrop = resolveBotLoopProtectionDrop(params);
	if (botLoopDrop) {
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("botLoopProtection");
		return botLoopDrop;
	}
	try {
		const recordSessionKey = resolveRecordSessionKey(params);
		if (params.ctxPayload.SessionTranscriptContext) {
			const { mergeSessionTranscriptContext } = await import("./session-transcript-context.runtime.js");
			await mergeSessionTranscriptContext({
				agentId: params.ctxPayload.AgentId,
				ctx: params.ctxPayload,
				sessionKey: recordSessionKey,
				storePath: params.storePath
			});
		}
		emit(params, {
			stage: "record",
			event: "start",
			sessionKey: recordSessionKey,
			admission: admission.kind
		});
		try {
			await params.recordInboundSession({
				storePath: params.storePath,
				sessionKey: recordSessionKey,
				ctx: params.ctxPayload,
				groupResolution: params.record?.groupResolution,
				createIfMissing: params.record?.createIfMissing,
				updateLastRoute: params.record?.updateLastRoute,
				onRecordError: params.record?.onRecordError ?? (() => void 0),
				trackSessionMetaTask: params.record?.trackSessionMetaTask
			});
			emit(params, {
				stage: "record",
				event: "done",
				sessionKey: recordSessionKey,
				admission: admission.kind
			});
			await params.afterRecord?.();
			await deliverPendingDeliveryNotice(recordSessionKey, params.storePath);
		} catch (err) {
			emit(params, {
				stage: "record",
				event: "error",
				sessionKey: recordSessionKey,
				admission: admission.kind,
				error: err
			});
			try {
				await params.onPreDispatchFailure?.(err);
			} catch {}
			throw err;
		}
		emit(params, {
			stage: "dispatch",
			event: "start",
			admission: admission.kind
		});
		let dispatchResult;
		try {
			let processedOutcome;
			if (admission.kind === "observeOnly") {
				if (options.suppressObserveOnlyDispatch) await params.runDispatchLifecycle?.onDispatchSkipped("observeOnly");
				else await params.runDispatch();
				dispatchResult = params.observeOnlyDispatchResult ?? {
					queuedFinal: false,
					counts: EMPTY_CHANNEL_TURN_DISPATCH_COUNTS
				};
			} else ({result: dispatchResult, processedOutcome} = await withDispatchProcessedOutcomeSink(() => params.runDispatch()));
			maybeWarnZeroCountVisibleDispatch({
				...params,
				admission,
				dispatchResult,
				processedOutcome
			});
		} catch (err) {
			emit(params, {
				stage: "dispatch",
				event: "error",
				admission: admission.kind,
				error: err
			});
			throw err;
		}
		emit(params, {
			stage: "dispatch",
			event: "done",
			admission: admission.kind
		});
		return {
			admission,
			dispatched: true,
			ctxPayload: params.ctxPayload,
			routeSessionKey: params.routeSessionKey,
			dispatchResult
		};
	} finally {
		clearPendingHistoryAfterTurn(params.history);
	}
}
async function runPreparedChannelTurn(params) {
	return await runPreparedChannelTurnCore(params, { suppressObserveOnlyDispatch: true });
}
//#endregion
export { resolveChannelTurnDispatchCounts as a, hasVisibleChannelTurnDispatch as i, runPreparedChannelTurnCore as n, recordChannelBotPairLoopAndCheckSuppression as o, hasFinalChannelTurnDispatch as r, runPreparedChannelTurn as t };

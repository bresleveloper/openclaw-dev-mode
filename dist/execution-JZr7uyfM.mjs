import { E as createDiagnosticTraceContextFromActiveScope, P as runWithDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { n as getAgentDatabaseStartupAdmission } from "./agent-database-startup-DQZqWc4z.mjs";
import { c as normalizeDeliveryContext, n as deliveryContextKey } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { f as clearChannelHistoryIfEnabled } from "./history-C_lABG5e.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { l as updateSessionEntry } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-BSOdHT4f.mjs";
import { t as getPluginServiceSchedulerBinding } from "./service-scheduler-binding-BGIyG3K0.mjs";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-B0ORUZO-.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-7AOYu6JQ.mjs";
import { n as withDispatchProcessedOutcomeSink } from "./dispatch-processed-outcome-DE_S0Yra.mjs";
import { t as isRecentOutboundMessageIdentity } from "./outbound-echo-YSOXkQb4.mjs";
import { i as resolvePairLoopGuardSettings, n as createPairLoopGuard } from "./pair-loop-guard-runtime-Bkkb_K7u.mjs";
//#region src/channels/turn/bot-loop-protection.ts
const channelBotPairLoopGuard = createPairLoopGuard({ pruneIntervalMs: 6e4 });
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
const EMPTY_CHANNEL_TURN_DISPATCH_COUNTS = {
	tool: 0,
	block: 0,
	final: 0
};
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
async function deliverPendingDeliveryNotice(sessionKey, storePath) {
	const entry = await readSessionEntryReadOnlyInWorker({
		sessionKey,
		storePath,
		readConsistency: "latest",
		hydrateSkillPromptRefs: false
	});
	const notice = entry?.pendingDeliveryNotice;
	const context = normalizeDeliveryContext(notice?.context);
	const runtime = getGatewayRecoveryRuntime();
	if (!entry || !runtime || !notice || notice.state !== "owed" || !context?.channel || !context.to || deliveryContextKey(context) !== deliveryContextKey(deliveryContextFromSession(entry))) return;
	const idempotencyKey = `main-session-restart-recovery:pending-final:${notice.intentId}`;
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
	if (params.botLoopProtection && recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed) {
		const botLoopDrop = dropPreparedChannelTurn(params, "bot-loop-protection");
		clearPendingHistoryAfterTurn(params.history);
		await params.runDispatchLifecycle?.onDispatchSkipped("botLoopProtection");
		return botLoopDrop;
	}
	try {
		const recordSessionKey = resolveRecordSessionKey(params);
		const emitStage = (stage, event, error) => emit(params, {
			stage,
			event,
			...stage === "record" ? { sessionKey: recordSessionKey } : {},
			admission: admission.kind,
			...event === "error" ? { error } : {}
		});
		try {
			const agentId = params.ctxPayload.AgentId ?? parseAgentSessionKey(params.routeSessionKey)?.agentId;
			if (agentId) await getAgentDatabaseStartupAdmission()?.waitForAgentPreparation(agentId, { signal: getPluginServiceSchedulerBinding()?.().signal });
			if (params.ctxPayload.SessionTranscriptContext) {
				const { mergeSessionTranscriptContext } = await import("./session-transcript-context.runtime.js");
				await mergeSessionTranscriptContext({
					agentId: params.ctxPayload.AgentId,
					ctx: params.ctxPayload,
					sessionKey: recordSessionKey,
					storePath: params.storePath
				});
			}
			emitStage("record", "start");
			params.assertAuthority?.();
			await params.recordInboundSession({
				storePath: params.storePath,
				sessionKey: recordSessionKey,
				ctx: params.ctxPayload,
				groupResolution: params.record?.groupResolution,
				createIfMissing: params.record?.createIfMissing,
				updateLastRoute: params.record?.updateLastRoute,
				onRecordError: params.record?.onRecordError ?? (() => void 0),
				trackSessionMetaTask: params.record?.trackSessionMetaTask,
				assertAuthority: params.assertAuthority
			});
			emitStage("record", "done");
			await params.afterRecord?.();
			await deliverPendingDeliveryNotice(recordSessionKey, params.storePath);
		} catch (err) {
			emitStage("record", "error", err);
			try {
				await params.onPreDispatchFailure?.(err);
			} catch {}
			throw err;
		}
		emitStage("dispatch", "start");
		let dispatchResult;
		try {
			params.assertAuthority?.();
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
			emitStage("dispatch", "error", err);
			throw err;
		}
		emitStage("dispatch", "done");
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

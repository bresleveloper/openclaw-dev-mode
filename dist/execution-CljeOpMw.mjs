import { N as runWithDiagnosticTraceContext, T as createDiagnosticTraceContextFromActiveScope } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as deliveryContextKey, s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { l as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { l as updateSessionEntry } from "./session-accessor.reset-b9w8ccQ2.mjs";
import { f as clearChannelHistoryIfEnabled } from "./history-BQl9FdG2.mjs";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DEj31pAK.mjs";
import { c as findDeliveryIntentOwner } from "./delivery-queue-storage-S92YhW29.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-DmpOWr_7.mjs";
import { n as withDispatchProcessedOutcomeSink } from "./dispatch-processed-outcome-D40daGTW.mjs";
import { t as isRecentOutboundMessageIdentity } from "./outbound-echo-B-zvGTG0.mjs";
import { r as hasVisibleChannelTurnDispatch, t as EMPTY_CHANNEL_TURN_DISPATCH_COUNTS } from "./dispatch-result-B75usq__.mjs";
import { a as resolvePairLoopGuardSettings, r as createPairLoopGuard } from "./pair-loop-guard-runtime-Df7mJxV6.mjs";
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
const NO_ADDITIONAL_DELIVERY_SIGNALS = {};
const log = createSubsystemLogger("channels/turn/execution");
function emit(params) {
	params.log?.({
		channel: params.channel,
		accountId: params.accountId,
		...params.event
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
function resolveObserveOnlyDispatchResult(params) {
	return params.observeOnlyDispatchResult ?? {
		queuedFinal: false,
		counts: EMPTY_CHANNEL_TURN_DISPATCH_COUNTS
	};
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
	if (hasVisibleChannelTurnDispatch(dispatchResult, NO_ADDITIONAL_DELIVERY_SIGNALS)) return;
	const processed = params.processedOutcome;
	const cause = processed ? `${processed.outcome}${processed.reason ? `:${processed.reason}` : ""}` : void 0;
	log.warn(`visible channel turn dispatched with no queued reply payloads: channel=${params.channel} messageId=${params.messageId ?? "unknown"} sessionKey=${params.ctxPayload.SessionKey ?? params.routeSessionKey} cause=${cause ?? "unknown"}`);
	emit({
		...params,
		event: {
			stage: "dispatch",
			event: "warning",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: params.admission?.kind ?? "dispatch",
			reason: "zero-count-visible-dispatch"
		}
	});
}
function resolveBotLoopProtectionDrop(params) {
	if (!params.botLoopProtection) return;
	if (!recordChannelBotPairLoopAndCheckSuppression(params.botLoopProtection).suppressed) return;
	const admission = {
		kind: "drop",
		reason: "bot-loop-protection"
	};
	emit({
		...params,
		event: {
			stage: "authorize",
			event: "drop",
			messageId: params.messageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind,
			reason: admission.reason
		}
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
	const admission = {
		kind: "drop",
		reason: "outbound-echo"
	};
	emit({
		...params,
		event: {
			stage: "authorize",
			event: "drop",
			messageId: params.messageId ?? matchedMessageId,
			sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
			admission: admission.kind,
			reason: admission.reason
		}
	});
	return {
		admission,
		dispatched: false,
		ctxPayload: params.ctxPayload,
		routeSessionKey: params.routeSessionKey
	};
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
		emit({
			...params,
			event: {
				stage: "record",
				event: "start",
				messageId: params.messageId,
				sessionKey: recordSessionKey,
				admission: admission.kind
			}
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
			emit({
				...params,
				event: {
					stage: "record",
					event: "done",
					messageId: params.messageId,
					sessionKey: recordSessionKey,
					admission: admission.kind
				}
			});
			await params.afterRecord?.();
			await deliverPendingDeliveryNotice(recordSessionKey, params.storePath);
		} catch (err) {
			emit({
				...params,
				event: {
					stage: "record",
					event: "error",
					messageId: params.messageId,
					sessionKey: recordSessionKey,
					admission: admission.kind,
					error: err
				}
			});
			try {
				await params.onPreDispatchFailure?.(err);
			} catch {}
			throw err;
		}
		emit({
			...params,
			event: {
				stage: "dispatch",
				event: "start",
				messageId: params.messageId,
				sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
				admission: admission.kind
			}
		});
		let dispatchResult;
		try {
			if (admission.kind === "observeOnly" && !options.suppressObserveOnlyDispatch) await params.runDispatch();
			else if (admission.kind === "observeOnly") await params.runDispatchLifecycle?.onDispatchSkipped("observeOnly");
			let processedOutcome;
			if (admission.kind === "observeOnly") dispatchResult = resolveObserveOnlyDispatchResult(params);
			else ({result: dispatchResult, processedOutcome} = await withDispatchProcessedOutcomeSink(() => params.runDispatch()));
			maybeWarnZeroCountVisibleDispatch({
				...params,
				admission,
				dispatchResult,
				processedOutcome
			});
		} catch (err) {
			emit({
				...params,
				event: {
					stage: "dispatch",
					event: "error",
					messageId: params.messageId,
					sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
					admission: admission.kind,
					error: err
				}
			});
			throw err;
		}
		emit({
			...params,
			event: {
				stage: "dispatch",
				event: "done",
				messageId: params.messageId,
				sessionKey: params.ctxPayload.SessionKey ?? params.routeSessionKey,
				admission: admission.kind
			}
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
export { runPreparedChannelTurnCore as n, recordChannelBotPairLoopAndCheckSuppression as r, runPreparedChannelTurn as t };

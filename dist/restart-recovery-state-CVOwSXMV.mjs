import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/restart-recovery-state.ts
/** Resolves only a complete durable channel claim; session-route fallbacks carry no authority. */
function resolveRestartRecoveryChannelAuthority(entry) {
	const sourceTurnId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
	const deliveryContext = normalizeDeliveryContext(entry.restartRecoveryDeliveryContext);
	const channel = normalizeOptionalString(deliveryContext?.channel);
	const to = normalizeOptionalString(deliveryContext?.to);
	if (entry.restartRecoverySourceIngress !== "channel" || !sourceTurnId || !channel || !to || !isDeliverableMessageChannel(channel)) return;
	return {
		sourceTurnId,
		deliveryContext: {
			...deliveryContext,
			channel,
			to
		}
	};
}
function normalizeThreadId(value) {
	return normalizeOptionalString(value) ?? (typeof value === "number" && Number.isFinite(value) ? String(value) : void 0);
}
function normalizeStringArray(value) {
	if (!Array.isArray(value)) return;
	const values = Array.from(new Set(value.flatMap((item) => {
		const normalized = normalizeOptionalString(item);
		return normalized ? [normalized] : [];
	})));
	return values.length > 0 ? values : void 0;
}
function normalizePresentStringArray(value) {
	if (!Array.isArray(value)) return;
	return normalizeStringArray(value) ?? [];
}
function normalizeHarnessCompletionRecovery(value) {
	if (!isRecord(value)) return;
	const taskId = normalizeOptionalString(value.taskId);
	const taskStatus = value.taskStatus === "succeeded" || value.taskStatus === "failed" ? value.taskStatus : void 0;
	const taskRunId = normalizeOptionalString(value.taskRunId);
	const sourceRunId = normalizeOptionalString(value.sourceRunId);
	const requesterSessionKey = normalizeOptionalString(value.requesterSessionKey);
	const requesterAgentId = normalizeOptionalString(value.requesterAgentId);
	const sessionId = normalizeOptionalString(value.sessionId);
	const lifecycleRevision = normalizeOptionalString(value.lifecycleRevision);
	if (!taskId || !taskStatus || !taskRunId || !sourceRunId || !requesterSessionKey || !requesterAgentId || !sessionId || value.lifecycleRevision !== void 0 && !lifecycleRevision) return;
	return {
		taskId,
		taskStatus,
		taskRunId,
		sourceRunId,
		requesterSessionKey,
		requesterAgentId,
		sessionId,
		...lifecycleRevision ? { lifecycleRevision } : {}
	};
}
function normalizeTerminalDeliveryEvidenceResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const captured = record.captured === true ? true : void 0;
	const rawPayloads = Array.isArray(record.payloads) ? record.payloads : void 0;
	const payloads = rawPayloads ? rawPayloads.slice(0, 64).map((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) return {};
		const payload = item;
		const mediaUrls = normalizeStringArray(payload.mediaUrls);
		const visible = typeof payload.visible === "boolean" ? payload.visible : void 0;
		const evidence = {};
		if (mediaUrls) evidence.mediaUrls = mediaUrls;
		if (visible !== void 0) evidence.visible = visible;
		return evidence;
	}) : void 0;
	const payloadsTruncated = record.payloadsTruncated === true || (rawPayloads?.length ?? 0) > 64 ? true : void 0;
	const rawStatus = record.deliveryStatus && typeof record.deliveryStatus === "object" ? record.deliveryStatus : void 0;
	const status = rawStatus?.status === "failed" || rawStatus?.status === "partial_failed" || rawStatus?.status === "sent" || rawStatus?.status === "suppressed" ? rawStatus.status : void 0;
	const payloadOutcomes = Array.isArray(rawStatus?.payloadOutcomes) ? rawStatus.payloadOutcomes.slice(0, 64).flatMap((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) return [];
		const outcome = item;
		const outcomeStatus = outcome.status === "failed" || outcome.status === "sent" || outcome.status === "suppressed" ? outcome.status : void 0;
		if (!outcomeStatus || typeof outcome.index !== "number" || !Number.isInteger(outcome.index) || outcome.index < 0) return [];
		return [{
			index: outcome.index,
			status: outcomeStatus,
			...typeof outcome.sentBeforeError === "boolean" ? { sentBeforeError: outcome.sentBeforeError } : {}
		}];
	}) : void 0;
	const errorMessage = normalizeOptionalString(rawStatus?.errorMessage);
	const deliveryStatus = status ? {
		status,
		...typeof rawStatus?.resultCount === "number" && Number.isSafeInteger(rawStatus.resultCount) && rawStatus.resultCount >= 0 ? { resultCount: rawStatus.resultCount } : {},
		...errorMessage ? { errorMessage } : {},
		...payloadOutcomes?.length ? { payloadOutcomes } : {}
	} : void 0;
	const rawMessagingToolSentTargets = Array.isArray(record.messagingToolSentTargets) ? record.messagingToolSentTargets : void 0;
	const messagingToolSentTargets = rawMessagingToolSentTargets ? rawMessagingToolSentTargets.slice(0, 64).flatMap((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item)) return [];
		const target = item;
		const provider = normalizeOptionalString(target.provider);
		const accountId = normalizeOptionalString(target.accountId);
		const to = normalizeOptionalString(target.to);
		const threadId = normalizeThreadId(target.threadId);
		const mediaUrls = normalizeStringArray(target.mediaUrls);
		const visible = typeof target.visible === "boolean" ? target.visible : void 0;
		if (!provider && !accountId && !to && !threadId && !mediaUrls && visible === void 0) return [];
		return [{
			...provider ? { provider } : {},
			...accountId ? { accountId } : {},
			...to ? { to } : {},
			...threadId ? { threadId } : {},
			...target.threadImplicit === true ? { threadImplicit: true } : {},
			...target.threadSuppressed === true ? { threadSuppressed: true } : {},
			...mediaUrls ? { mediaUrls } : {},
			...visible !== void 0 ? { visible } : {},
			...typeof target.sourceReplyFinal === "boolean" ? { sourceReplyFinal: target.sourceReplyFinal } : {}
		}];
	}) : void 0;
	const messagingToolSentTargetsTruncated = record.messagingToolSentTargetsTruncated === true || (rawMessagingToolSentTargets?.length ?? 0) > 64 ? true : void 0;
	const messagingToolAggregateEvidenceUnaccounted = record.messagingToolAggregateEvidenceUnaccounted === true ? true : void 0;
	const restartUnsafeSideEffectsDetected = record.restartUnsafeSideEffectsDetected === true ? true : void 0;
	if (!captured && !payloads?.length && !payloadsTruncated && !deliveryStatus && !messagingToolSentTargets?.length && !messagingToolSentTargetsTruncated && !messagingToolAggregateEvidenceUnaccounted && !restartUnsafeSideEffectsDetected) return;
	return {
		...captured ? { captured } : {},
		...payloads?.length ? { payloads } : {},
		...payloadsTruncated ? { payloadsTruncated } : {},
		...deliveryStatus ? { deliveryStatus } : {},
		...messagingToolSentTargets?.length ? { messagingToolSentTargets } : {},
		...messagingToolSentTargetsTruncated ? { messagingToolSentTargetsTruncated } : {},
		...messagingToolAggregateEvidenceUnaccounted ? { messagingToolAggregateEvidenceUnaccounted } : {},
		...restartUnsafeSideEffectsDetected ? { restartUnsafeSideEffectsDetected } : {}
	};
}
function normalizeRestartRecoveryTerminalDeliveryEvidence(value) {
	if (!Array.isArray(value)) return;
	const evidence = [];
	for (const item of value) {
		if (!isRecord(item)) continue;
		const runId = normalizeOptionalString(item.runId);
		const result = normalizeTerminalDeliveryEvidenceResult(item);
		if (!runId || !result) continue;
		const previousIndex = evidence.findIndex((entry) => entry.runId === runId);
		if (previousIndex >= 0) evidence.splice(previousIndex, 1);
		const transcriptRunId = normalizeOptionalString(item.transcriptRunId);
		const harnessCompletion = normalizeHarnessCompletionRecovery(item.harnessCompletion);
		const rawContext = isRecord(item.deliveryContext) ? item.deliveryContext : void 0;
		const deliveryContext = normalizeDeliveryContext({
			channel: normalizeOptionalString(rawContext?.channel),
			to: normalizeOptionalString(rawContext?.to),
			accountId: normalizeOptionalString(rawContext?.accountId),
			threadId: typeof rawContext?.threadId === "number" ? rawContext.threadId : normalizeOptionalString(rawContext?.threadId)
		});
		const rawFinalReceipt = isRecord(item.durableFinalReceipt) ? item.durableFinalReceipt : void 0;
		const intentId = normalizeOptionalString(rawFinalReceipt?.intentId);
		const deliveryId = normalizeOptionalString(rawFinalReceipt?.deliveryId);
		const platformMessageId = normalizeOptionalString(rawFinalReceipt?.platformMessageId);
		evidence.push({
			runId,
			...result,
			...transcriptRunId ? { transcriptRunId } : {},
			...harnessCompletion?.sourceRunId === runId ? {
				harnessCompletion,
				deliveryContext
			} : {},
			...harnessCompletion?.sourceRunId === runId && intentId && deliveryId && platformMessageId ? { durableFinalReceipt: {
				intentId,
				deliveryId,
				platformMessageId
			} } : {}
		});
	}
	const bounded = evidence.slice(-64);
	return bounded.length > 0 ? bounded : void 0;
}
/** Keeps a bounded durable set of client runs that must never execute again. */
function normalizeRestartRecoveryTerminalRunIds(value) {
	if (!Array.isArray(value)) return;
	const runIds = [];
	for (const item of value) {
		const runId = normalizeOptionalString(item);
		if (!runId) continue;
		const previousIndex = runIds.indexOf(runId);
		if (previousIndex >= 0) runIds.splice(previousIndex, 1);
		runIds.push(runId);
	}
	const bounded = runIds.slice(-64);
	return bounded.length > 0 ? bounded : void 0;
}
function sameOptionalStringArray(left, right) {
	if (!Array.isArray(left) || !right) return left === void 0 && right === void 0;
	return left.length === right.length && left.every((value, index) => value === right[index]);
}
/** Compares normalized durable terminal-source tombstones by value and order. */
function sameRestartRecoveryTerminalRunIds(left, right) {
	return sameOptionalStringArray(left, normalizeRestartRecoveryTerminalRunIds(right));
}
/** Normalizes restart-claim fields while preserving an already-canonical array identity. */
function normalizeRestartRecoveryEntryFields(entry, assign) {
	const harnessCompletion = normalizeHarnessCompletionRecovery(entry.restartRecoveryHarnessCompletion);
	assign("restartRecoveryHarnessCompletion", isDeepStrictEqual(harnessCompletion, entry.restartRecoveryHarnessCompletion) ? entry.restartRecoveryHarnessCompletion : harnessCompletion);
	const deliveryMediaUrls = normalizePresentStringArray(entry.restartRecoveryDeliveryMediaUrls);
	assign("restartRecoveryDeliveryMediaUrls", sameOptionalStringArray(entry.restartRecoveryDeliveryMediaUrls, deliveryMediaUrls) ? entry.restartRecoveryDeliveryMediaUrls : deliveryMediaUrls);
	assign("restartRecoveryDisableMessageTool", entry.restartRecoveryDisableMessageTool === true ? true : void 0);
	assign("restartRecoverySuppressTextDelivery", entry.restartRecoverySuppressTextDelivery === true ? true : void 0);
	assign("restartRecoveryBeforeAgentReplyState", entry.restartRecoveryBeforeAgentReplyState === "admitted" || entry.restartRecoveryBeforeAgentReplyState === "pending" || entry.restartRecoveryBeforeAgentReplyState === "continue" || entry.restartRecoveryBeforeAgentReplyState === "handled-silent" || entry.restartRecoveryBeforeAgentReplyState === "handled-reply" || entry.restartRecoveryBeforeAgentReplyState === "handled-unrecoverable" ? entry.restartRecoveryBeforeAgentReplyState : void 0);
	assign("restartRecoveryDeliveryReceiptState", entry.restartRecoveryDeliveryReceiptState === "terminal-pending" || entry.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? entry.restartRecoveryDeliveryReceiptState : void 0);
	assign("restartRecoveryDeliveryToolCallId", normalizeOptionalString(entry.restartRecoveryDeliveryToolCallId));
	assign("restartRecoveryDeliveryRequestFingerprint", normalizeOptionalString(entry.restartRecoveryDeliveryRequestFingerprint));
	assign("restartRecoveryDeliveryRunId", normalizeOptionalString(entry.restartRecoveryDeliveryRunId));
	assign("restartRecoveryDeliverySourceRunId", normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId));
	assign("restartRecoveryRequesterAccountId", normalizeOptionalString(entry.restartRecoveryRequesterAccountId));
	assign("restartRecoveryRequesterSenderId", normalizeOptionalString(entry.restartRecoveryRequesterSenderId));
	assign("restartRecoverySameChannelThreadRequired", entry.restartRecoverySameChannelThreadRequired === true ? true : void 0);
	assign("restartRecoverySourceIngress", entry.restartRecoverySourceIngress === "channel" || entry.restartRecoverySourceIngress === "control-ui" || entry.restartRecoverySourceIngress === "internal" ? entry.restartRecoverySourceIngress : void 0);
	assign("restartRecoverySourceReplyDeliveryMode", entry.restartRecoverySourceReplyDeliveryMode === "automatic" || entry.restartRecoverySourceReplyDeliveryMode === "message_tool_only" ? entry.restartRecoverySourceReplyDeliveryMode : void 0);
	const terminalDeliveryEvidence = normalizeRestartRecoveryTerminalDeliveryEvidence(entry.restartRecoveryTerminalDeliveryEvidence);
	assign("restartRecoveryTerminalDeliveryEvidence", isDeepStrictEqual(entry.restartRecoveryTerminalDeliveryEvidence, terminalDeliveryEvidence) ? entry.restartRecoveryTerminalDeliveryEvidence : terminalDeliveryEvidence);
	const terminalRunIds = normalizeRestartRecoveryTerminalRunIds(entry.restartRecoveryTerminalRunIds);
	assign("restartRecoveryTerminalRunIds", sameOptionalStringArray(entry.restartRecoveryTerminalRunIds, terminalRunIds) ? entry.restartRecoveryTerminalRunIds : terminalRunIds);
}
function mergeRestartRecoveryTerminalDeliveryEvidence(current, appended) {
	return normalizeRestartRecoveryTerminalDeliveryEvidence([...normalizeRestartRecoveryTerminalDeliveryEvidence(current) ?? [], ...normalizeRestartRecoveryTerminalDeliveryEvidence(appended) ?? []]);
}
function getRestartRecoveryTerminalDeliveryEvidence(entry, runId) {
	return normalizeRestartRecoveryTerminalDeliveryEvidence(entry?.restartRecoveryTerminalDeliveryEvidence)?.find((evidence) => evidence.runId === runId);
}
/** Appends new terminal ids without refreshing or evicting existing members. */
function mergeRestartRecoveryTerminalRunIds(current, appended) {
	const currentRunIds = normalizeRestartRecoveryTerminalRunIds(current) ?? [];
	const currentSet = new Set(currentRunIds);
	const appendedRunIds = (normalizeRestartRecoveryTerminalRunIds(appended) ?? []).filter((runId) => !currentSet.has(runId));
	return normalizeRestartRecoveryTerminalRunIds([...currentRunIds, ...appendedRunIds]);
}
function hasRestartRecoveryTerminalRun(entry, runId) {
	return normalizeRestartRecoveryTerminalRunIds(entry?.restartRecoveryTerminalRunIds)?.includes(runId) === true;
}
/** Matches durable source ownership regardless of the surrounding run status. */
function hasRestartRecoverySourceClaim(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return normalizedSourceTurnId !== void 0 && normalizeOptionalString(entry?.restartRecoveryDeliveryRunId) !== void 0 && normalizeOptionalString(entry?.restartRecoveryDeliverySourceRunId) === normalizedSourceTurnId;
}
function hasActiveRestartRecoverySourceClaim(entry, sourceTurnId) {
	return entry?.status === "running" && hasRestartRecoverySourceClaim(entry, sourceTurnId);
}
/** Clears exact active ownership and optionally records its client source as terminal. */
function buildRestartRecoveryClaimCleanupPatch(params) {
	const sourceRunId = normalizeOptionalString(params.terminalSourceRunId) ?? normalizeOptionalString(params.entry.restartRecoveryDeliverySourceRunId);
	const terminalRunIds = params.recordTerminalSource && (sourceRunId || params.terminalRunId) ? mergeRestartRecoveryTerminalRunIds(params.entry.restartRecoveryTerminalRunIds, [...sourceRunId ? [sourceRunId] : [], ...params.terminalRunId ? [params.terminalRunId] : []]) : void 0;
	const terminalDeliveryEvidence = params.recordTerminalSource && sourceRunId && params.terminalDeliveryEvidence ? mergeRestartRecoveryTerminalDeliveryEvidence(params.entry.restartRecoveryTerminalDeliveryEvidence, [{
		runId: sourceRunId,
		...params.terminalDeliveryEvidence,
		...params.entry.restartRecoveryHarnessCompletion?.sourceRunId === sourceRunId ? {
			harnessCompletion: params.entry.restartRecoveryHarnessCompletion,
			deliveryContext: params.entry.restartRecoveryDeliveryContext
		} : {},
		transcriptRunId: normalizeOptionalString(params.terminalRunId) ?? normalizeOptionalString(params.entry.restartRecoveryDeliveryRunId)
	}]) : void 0;
	return {
		restartRecoveryBeforeAgentReplyState: void 0,
		restartRecoveryDeliveryReceiptState: void 0,
		restartRecoveryDeliveryToolCallId: void 0,
		restartRecoveryDeliveryContext: void 0,
		restartRecoveryDeliveryMediaUrls: void 0,
		restartRecoveryDisableMessageTool: void 0,
		restartRecoverySuppressTextDelivery: void 0,
		restartRecoveryDeliveryRequestFingerprint: void 0,
		restartRecoveryDeliveryRunId: void 0,
		restartRecoveryDeliverySourceRunId: void 0,
		restartRecoveryHarnessCompletion: void 0,
		restartRecoveryRequesterAccountId: void 0,
		restartRecoveryRequesterSenderId: void 0,
		restartRecoverySameChannelThreadRequired: void 0,
		restartRecoverySourceIngress: void 0,
		restartRecoverySourceReplyDeliveryMode: void 0,
		restartRecoveryForceSafeTools: void 0,
		...terminalDeliveryEvidence ? { restartRecoveryTerminalDeliveryEvidence: terminalDeliveryEvidence } : {},
		...terminalRunIds ? { restartRecoveryTerminalRunIds: terminalRunIds } : {}
	};
}
//#endregion
export { hasRestartRecoveryTerminalRun as a, normalizeRestartRecoveryEntryFields as c, sameRestartRecoveryTerminalRunIds as d, hasRestartRecoverySourceClaim as i, normalizeRestartRecoveryTerminalRunIds as l, getRestartRecoveryTerminalDeliveryEvidence as n, mergeRestartRecoveryTerminalDeliveryEvidence as o, hasActiveRestartRecoverySourceClaim as r, mergeRestartRecoveryTerminalRunIds as s, buildRestartRecoveryClaimCleanupPatch as t, resolveRestartRecoveryChannelAuthority as u };

import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { D as parseSessionDeliveryRoute, M as parseAgentSessionKey, O as parseThreadSessionSuffix, S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as parseDurationMs } from "./parse-duration-B7MSnEK8.mjs";
import { t as parseByteSize } from "./parse-bytes-BaENXJY2.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { c as normalizeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { i as isSyntheticSessionMaintenanceKey, n as isGatewayModelRunSessionKey, r as isRecentSessionMaintenanceEntry, t as getSessionMaintenanceActivityAt } from "./store-maintenance-activity-ayV6kicm.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/restart-recovery-state.ts
/** Keeps distinct concurrent runs while transferring each run id to its newest lifecycle owner. */
function normalizeMainSessionRecoveryRunFences(runs) {
	return [...new Map([...runs].map((run) => [run.runId, run])).values()].toSorted((left, right) => left.runId.localeCompare(right.runId));
}
function recordLifecycleFence(entry, run) {
	entry.restartRecoveryRuns = normalizeMainSessionRecoveryRunFences([...entry.restartRecoveryRuns ?? [], run]);
}
function isMainRestartRecoveryCandidate(entry, sessionKey) {
	if (typeof entry.spawnDepth === "number" && entry.spawnDepth > 0) return false;
	if (entry.subagentRole != null) return false;
	return !isSubagentSessionKey(sessionKey) && !isCronSessionKey(sessionKey) && !isAcpSessionKey(sessionKey);
}
/** A final intent can acknowledge only its admitted source on the same captured route. */
function getRestartRecoveryPendingFinalSourceRunId(entry, context) {
	const sourceRunId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
	const original = normalizeDeliveryContext(entry.restartRecoveryDeliveryContext);
	return normalizeOptionalString(entry.restartRecoveryDeliveryRunId) && sourceRunId && original?.channel && original.to && isDeepStrictEqual(original, normalizeDeliveryContext(context)) ? sourceRunId : void 0;
}
/** Resolves only a complete durable channel claim; session-route fallbacks carry no authority. */
function resolveRestartRecoveryChannelAuthority(entry) {
	const sourceTurnId = normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId);
	const deliveryContext = normalizeDeliveryContext(entry.restartRecoveryDeliveryContext);
	const channel = deliveryContext?.channel;
	const to = deliveryContext?.to;
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
	const values = normalizeUniqueTrimmedStringList(value);
	return values.length > 0 ? values : void 0;
}
function normalizePresentStringArray(value) {
	return Array.isArray(value) ? normalizeUniqueTrimmedStringList(value) : void 0;
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
function normalizeTerminalDeliveryEvidenceResult(record) {
	if (!isRecord(record)) return;
	const captured = record.captured === true ? true : void 0;
	const rawMeta = asOptionalObjectRecord(record.meta);
	const meta = {
		...asOptionalObjectRecord(rawMeta?.terminalReply)?.disposition === "silent" ? { terminalReply: { disposition: "silent" } } : {},
		...rawMeta?.yielded === true ? { yielded: true } : {},
		...rawMeta?.continuationPending === true ? { continuationPending: true } : {},
		...rawMeta?.aborted === true ? { aborted: true } : {},
		...rawMeta?.error === true ? { error: true } : {}
	};
	const requesterContinuationSettled = record.requesterContinuationSettled === true ? true : void 0;
	const rawPayloads = Array.isArray(record.payloads) ? record.payloads : void 0;
	const payloads = rawPayloads ? rawPayloads.slice(0, 64).map((payload) => {
		if (!isRecord(payload)) return {};
		const mediaUrls = normalizeStringArray(payload.mediaUrls);
		const visible = typeof payload.visible === "boolean" ? payload.visible : void 0;
		const evidence = {};
		if (mediaUrls) evidence.mediaUrls = mediaUrls;
		if (visible !== void 0) evidence.visible = visible;
		return evidence;
	}) : void 0;
	const payloadsTruncated = record.payloadsTruncated === true || (rawPayloads?.length ?? 0) > 64 ? true : void 0;
	const rawStatus = asOptionalObjectRecord(record.deliveryStatus);
	const status = rawStatus?.status === "failed" || rawStatus?.status === "partial_failed" || rawStatus?.status === "sent" || rawStatus?.status === "suppressed" ? rawStatus.status : void 0;
	const payloadOutcomes = Array.isArray(rawStatus?.payloadOutcomes) ? rawStatus.payloadOutcomes.slice(0, 64).flatMap((outcome) => {
		if (!isRecord(outcome)) return [];
		const outcomeStatus = outcome.status === "failed" || outcome.status === "sent" || outcome.status === "suppressed" ? outcome.status : void 0;
		if (!outcomeStatus || typeof outcome.index !== "number" || !Number.isInteger(outcome.index) || outcome.index < 0) return [];
		const reason = normalizeOptionalString(outcome.reason)?.slice(0, 256);
		return [{
			index: outcome.index,
			status: outcomeStatus,
			...reason ? { reason } : {},
			...typeof outcome.sentBeforeError === "boolean" ? { sentBeforeError: outcome.sentBeforeError } : {}
		}];
	}) : void 0;
	const errorMessage = normalizeOptionalString(rawStatus?.errorMessage);
	const reason = normalizeOptionalString(rawStatus?.reason)?.slice(0, 256);
	const deliveryStatus = status ? {
		status,
		...typeof rawStatus?.resultCount === "number" && Number.isSafeInteger(rawStatus.resultCount) && rawStatus.resultCount >= 0 ? { resultCount: rawStatus.resultCount } : {},
		...errorMessage ? { errorMessage } : {},
		...reason ? { reason } : {},
		...payloadOutcomes?.length ? { payloadOutcomes } : {}
	} : void 0;
	const rawMessagingToolSentTargets = Array.isArray(record.messagingToolSentTargets) ? record.messagingToolSentTargets : void 0;
	const messagingToolSentTargets = rawMessagingToolSentTargets ? rawMessagingToolSentTargets.slice(0, 64).flatMap((target) => {
		if (!isRecord(target)) return [];
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
	if (!captured && Object.keys(meta).length === 0 && !requesterContinuationSettled && !payloads?.length && !payloadsTruncated && !deliveryStatus && !messagingToolSentTargets?.length && !messagingToolSentTargetsTruncated && !messagingToolAggregateEvidenceUnaccounted && !restartUnsafeSideEffectsDetected) return;
	return {
		...captured ? { captured } : {},
		...Object.keys(meta).length ? { meta } : {},
		...requesterContinuationSettled ? { requesterContinuationSettled } : {},
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
		if (previousIndex >= 0) {
			if (evidence[previousIndex]?.durableFinalReceipt) continue;
			evidence.splice(previousIndex, 1);
		}
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
			...harnessCompletion?.sourceRunId === runId ? { harnessCompletion } : {},
			...deliveryContext ? { deliveryContext } : {},
			...(item.harnessCompletion === void 0 || harnessCompletion?.sourceRunId === runId) && deliveryContext?.channel && deliveryContext.to && intentId && deliveryId && platformMessageId ? { durableFinalReceipt: {
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
	const runIds = /* @__PURE__ */ new Set();
	for (const item of value) {
		const runId = normalizeOptionalString(item);
		if (!runId) continue;
		runIds.delete(runId);
		runIds.add(runId);
	}
	const bounded = [...runIds].slice(-64);
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
	for (const key of ["restartRecoveryDisableMessageTool", "restartRecoverySuppressTextDelivery"]) assign(key, entry[key] === true ? true : void 0);
	assign("restartRecoveryBeforeAgentReplyState", entry.restartRecoveryBeforeAgentReplyState === "admitted" || entry.restartRecoveryBeforeAgentReplyState === "pending" || entry.restartRecoveryBeforeAgentReplyState === "continue" || entry.restartRecoveryBeforeAgentReplyState === "handled-silent" || entry.restartRecoveryBeforeAgentReplyState === "handled-reply" || entry.restartRecoveryBeforeAgentReplyState === "handled-unrecoverable" ? entry.restartRecoveryBeforeAgentReplyState : void 0);
	assign("restartRecoveryDeliveryReceiptState", entry.restartRecoveryDeliveryReceiptState === "terminal-pending" || entry.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? entry.restartRecoveryDeliveryReceiptState : void 0);
	for (const key of [
		"restartRecoveryDeliveryToolCallId",
		"restartRecoveryDeliveryRequestFingerprint",
		"restartRecoveryDeliveryRunId",
		"restartRecoveryDeliverySourceRunId",
		"restartRecoveryRequesterAccountId",
		"restartRecoveryRequesterSenderId"
	]) assign(key, normalizeOptionalString(entry[key]));
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
	const bounded = [...currentRunIds, ...appendedRunIds].slice(-64);
	return bounded.length > 0 ? bounded : void 0;
}
function hasRestartRecoveryTerminalRun(entry, runId) {
	return normalizeRestartRecoveryTerminalRunIds(entry?.restartRecoveryTerminalRunIds)?.includes(runId) === true;
}
/** An unadopted input retains same-ID retry custody until execution claims it. */
function isRetryableUnadoptedChatClaim(entry, clientRunId = entry?.restartRecoveryDeliveryRunId) {
	return Boolean(entry && clientRunId !== void 0 && entry.abortedLastRun !== true && (entry.status === "failed" || entry.status === "killed") && entry.restartRecoveryDeliveryContext === void 0 && entry.restartRecoveryDeliveryRunId === clientRunId && entry.restartRecoveryDeliverySourceRunId === clientRunId && entry.restartRecoveryDeliveryRequestFingerprint && !entry.mainRestartRecovery && !entry.pendingFinalDelivery && !entry.restartRecoveryRuns?.some((run) => !hasRestartRecoveryTerminalRun(entry, run.runId)));
}
/** Recovery custody survives process loss independently of the last run's outcome. */
function hasMainSessionRecoveryClaim(entry) {
	return Boolean(entry?.mainRestartRecovery || entry?.restartRecoveryRuns?.some((run) => !hasRestartRecoveryTerminalRun(entry, run.runId)) || entry?.restartRecoveryDeliveryRunId || entry?.pendingFinalDelivery);
}
/** A new turn may retire an aborted claim only when restart recovery will not resume it. */
function canReplaceAbortedRestartRecoveryClaim(entry, sessionKey, admissionRunId) {
	const activeClaimRunId = normalizeOptionalString(entry.restartRecoveryDeliveryRunId);
	return Boolean(admissionRunId && activeClaimRunId && admissionRunId !== activeClaimRunId && entry.abortedLastRun === true && (entry.status === void 0 || entry.status === "interrupted") && entry.pendingFinalDelivery === void 0 && entry.restartRecoveryBeforeAgentReplyState === void 0 && entry.restartRecoveryDeliveryReceiptState === void 0 && (entry.restartRecoverySourceIngress === "control-ui" || !isMainRestartRecoveryCandidate(entry, sessionKey)));
}
/** Matches durable source ownership regardless of the surrounding run status. */
function hasRestartRecoverySourceClaim(entry, sourceTurnId) {
	const normalizedSourceTurnId = normalizeOptionalString(sourceTurnId);
	return normalizedSourceTurnId !== void 0 && normalizeOptionalString(entry?.restartRecoveryDeliveryRunId) !== void 0 && normalizeOptionalString(entry?.restartRecoveryDeliverySourceRunId) === normalizedSourceTurnId;
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
		restartRecoveryOperatorSource: void 0,
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
//#region src/config/sessions/session-pin-policy.ts
function isPinnableSessionEntry(storeKey, entry) {
	if (isSubagentSessionKey(storeKey)) return false;
	if (entry?.sidebarRoot === true) return true;
	if (normalizeOptionalString(entry?.spawnedBy)) return false;
	const parentSessionKey = normalizeOptionalString(entry?.parentSessionKey);
	if (!parentSessionKey) return true;
	const parsed = parseAgentSessionKey(storeKey);
	return parsed !== null && parentSessionKey === buildAgentMainSessionKey({ agentId: parsed.agentId });
}
//#endregion
//#region src/config/sessions/store-maintenance.ts
const log = createSubsystemLogger("sessions/store");
const DEFAULT_SESSION_PRUNE_AFTER_MS = 2592e6;
const DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS = 6048e5;
const DEFAULT_MODEL_RUN_PRUNE_AFTER_MS = 864e5;
const DEFAULT_SESSION_MAX_ENTRIES = 5e3;
const DEFAULT_SESSION_MAINTENANCE_MODE = "enforce";
const DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO = .8;
const DEFAULT_SESSION_MAX_DISK_BYTES = 10737418240;
const STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES = 49;
const MIN_BATCHED_ENTRY_MAINTENANCE_SLACK = 25;
const BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO = .1;
function resolveMaintenanceDuration(raw, fallback) {
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return fallback;
	try {
		return parseDurationMs(normalized, { defaultUnit: "d" });
	} catch {
		return fallback;
	}
}
function resolveArchiveDashboardAfterMs(maintenance) {
	const raw = maintenance?.archiveDashboardAfter;
	if (raw === false || raw === 0) return null;
	const parsed = resolveMaintenanceDuration(raw, DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS);
	return parsed > 0 ? parsed : null;
}
function resolveMaxDiskBytes(maintenance) {
	const raw = maintenance?.maxDiskBytes;
	if (raw === false) return null;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return DEFAULT_SESSION_MAX_DISK_BYTES;
	try {
		const bytes = parseByteSize(normalized, { defaultUnit: "b" });
		if (bytes <= 0) return null;
		return bytes;
	} catch {
		return null;
	}
}
function resolveHighWaterBytes(maintenance, maxDiskBytes) {
	if (maxDiskBytes == null) return null;
	const defaultHighWaterBytes = Math.max(1, Math.min(maxDiskBytes, Math.floor(maxDiskBytes * DEFAULT_SESSION_DISK_BUDGET_HIGH_WATER_RATIO)));
	const raw = maintenance?.highWaterBytes;
	const normalized = normalizeStringifiedOptionalString(raw);
	if (!normalized) return defaultHighWaterBytes;
	try {
		const parsed = parseByteSize(normalized, { defaultUnit: "b" });
		return parsed > 0 ? Math.min(parsed, maxDiskBytes) : defaultHighWaterBytes;
	} catch {
		return defaultHighWaterBytes;
	}
}
function resolveMaintenanceConfigFromInput(maintenance) {
	const maxDiskBytes = resolveMaxDiskBytes(maintenance);
	return {
		mode: maintenance?.mode ?? DEFAULT_SESSION_MAINTENANCE_MODE,
		pruneAfterMs: resolveMaintenanceDuration(maintenance?.pruneAfter, DEFAULT_SESSION_PRUNE_AFTER_MS),
		archiveDashboardAfterMs: resolveArchiveDashboardAfterMs(maintenance),
		maxEntries: maintenance?.maxEntries ?? DEFAULT_SESSION_MAX_ENTRIES,
		modelRunPruneAfterMs: DEFAULT_MODEL_RUN_PRUNE_AFTER_MS,
		preserveRecentMs: resolveMaintenanceDuration(maintenance?.preserveRecent, null),
		resetArchiveRetentionMs: resolveMaintenanceDuration(maintenance?.resetArchiveRetention, null),
		maxDiskBytes,
		highWaterBytes: resolveHighWaterBytes(maintenance, maxDiskBytes)
	};
}
function normalizeResolvedMaintenanceConfigInput(maintenance) {
	return {
		...maintenance,
		archiveDashboardAfterMs: maintenance.archiveDashboardAfterMs === void 0 ? DEFAULT_DASHBOARD_ARCHIVE_AFTER_MS : maintenance.archiveDashboardAfterMs,
		modelRunPruneAfterMs: maintenance.modelRunPruneAfterMs ?? DEFAULT_MODEL_RUN_PRUNE_AFTER_MS,
		preserveRecentMs: maintenance.preserveRecentMs ?? null
	};
}
function resolveSessionEntryMaintenanceHighWater(maxEntries) {
	if (!Number.isSafeInteger(maxEntries) || maxEntries <= 0) return 1;
	if (maxEntries <= STRICT_ENTRY_MAINTENANCE_MAX_ENTRIES) return maxEntries + 1;
	return maxEntries + Math.max(MIN_BATCHED_ENTRY_MAINTENANCE_SLACK, Math.ceil(maxEntries * BATCHED_ENTRY_MAINTENANCE_SLACK_RATIO));
}
function shouldRunSessionEntryMaintenance(params) {
	if (params.force) return true;
	return params.entryCount >= resolveSessionEntryMaintenanceHighWater(params.maxEntries);
}
function shouldRunModelRunPrune(params) {
	if (params.force) return params.entryCount > params.maintenance.maxEntries;
	return shouldRunSessionEntryMaintenance({
		entryCount: params.entryCount,
		maxEntries: params.maintenance.maxEntries
	});
}
/**
* Archive stale durable entries in place; remove only disposable runtime entries.
* Entries without `updatedAt` are kept (cannot determine staleness).
* Mutates `store` in-place.
*/
function pruneStaleEntries(store, overrideMaxAgeMs, opts = {}) {
	const maxAgeMs = overrideMaxAgeMs ?? resolveMaintenanceConfigFromInput().pruneAfterMs;
	if (maxAgeMs <= 0) return 0;
	const now = Date.now();
	const cutoffMs = now - maxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			...opts
		})) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			if (isSyntheticSessionMaintenanceKey(key)) {
				opts.onPruned?.({
					key,
					entry
				});
				delete store[key];
				pruned++;
			} else {
				entry.archivedAt = now;
				delete entry.archivedBy;
				entry.archiveReason = "age-retention";
				opts.onArchived?.({
					key,
					entry
				});
			}
		}
	}
	if (pruned > 0 && opts.log !== false) log.info("pruned stale session entries", {
		pruned,
		maxAgeMs
	});
	return pruned;
}
/**
* Remove stale one-shot gateway model-run probe sessions before normal retention/capping.
* Existing polluted stores may not carry modelRun metadata, so this intentionally keys off the
* strict explicit model-run UUID session shape created by the gateway probe CLI path.
*/
function pruneStaleModelRunEntries(store, overrideMaxAgeMs, opts = {}) {
	if (overrideMaxAgeMs == null || overrideMaxAgeMs <= 0) return 0;
	const cutoffMs = Date.now() - overrideMaxAgeMs;
	let pruned = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (shouldPreserveMaintenanceEntry({
			key,
			entry,
			...opts
		})) continue;
		if (!isGatewayModelRunSessionKey(key)) continue;
		if (entry?.updatedAt != null && entry.updatedAt < cutoffMs) {
			opts.onPruned?.({
				key,
				entry
			});
			delete store[key];
			pruned++;
		}
	}
	if (pruned > 0 && opts.log !== false) log.info("pruned stale gateway model-run session entries", {
		pruned,
		maxAgeMs: overrideMaxAgeMs
	});
	return pruned;
}
const DEFAULT_QUOTA_SUSPENSION_TTL_MS = 18e5;
/**
* Resolves the TTL maintenance patch for one session entry without reading or
* mutating the whole store. Attempt hot paths use this before entry-scoped
* accessor writes so unrelated sessions stay out of the request path.
*/
function resolveQuotaSuspensionEntryMaintenance(params) {
	const suspension = params.entry.quotaSuspension;
	if (!suspension) return {
		patch: null,
		cleared: false
	};
	const ttlMs = params.ttlMs ?? DEFAULT_QUOTA_SUSPENSION_TTL_MS;
	const cleanupAfterResumeMs = ttlMs * 1;
	const resumeAtMs = suspension.expectedResumeBy ?? suspension.suspendedAt + ttlMs;
	const cleanupAtMs = resumeAtMs + cleanupAfterResumeMs;
	if (params.now >= cleanupAtMs) return {
		patch: { quotaSuspension: void 0 },
		cleared: true
	};
	if (suspension.state === "suspended" && params.now >= resumeAtMs) return {
		patch: { quotaSuspension: {
			...suspension,
			state: "resuming"
		} },
		cleared: false
	};
	return {
		patch: null,
		cleared: false
	};
}
/** Archive inactive dashboard sessions while retaining runtime-owned or explicitly active keys. */
function archiveStaleDashboardEntries(store, archiveAfterMs, opts = {}) {
	if (archiveAfterMs == null || archiveAfterMs <= 0) return 0;
	const now = opts.nowMs ?? Date.now();
	const cutoffMs = now - archiveAfterMs;
	let archived = 0;
	for (const [key, entry] of Object.entries(store)) {
		if (!parseAgentSessionKey(key)?.rest.startsWith("dashboard:") || shouldPreserveMaintenanceEntry({
			key,
			entry,
			...opts
		})) continue;
		const activityAt = getSessionMaintenanceActivityAt(entry);
		if (activityAt <= 0 || activityAt >= cutoffMs) continue;
		entry.archivedAt = now;
		delete entry.archivedBy;
		entry.archiveReason = "stale-dashboard";
		opts.onArchived?.({
			key,
			entry
		});
		archived += 1;
	}
	if (archived > 0 && opts.log !== false) log.info("archived stale dashboard session entries", {
		archived,
		archiveAfterMs
	});
	return archived;
}
function isProtectedExternalConversationSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	const rest = normalizeLowercaseStringOrEmpty(parsed?.rest ?? sessionKey);
	return parseSessionDeliveryRoute(sessionKey) !== null || /^direct:.+$/.test(rest) || /^[^:]+:(?:group|channel):.+$/.test(rest) || /^telegram:(?:direct|dm):.+:topic:[^:]+$/.test(rest);
}
function isPrimarySessionMaintenanceKey(sessionKey) {
	if (normalizeLowercaseStringOrEmpty(sessionKey) === "global") return true;
	return parseAgentSessionKey(sessionKey)?.rest === "main";
}
function isProtectedSessionMaintenanceEntry(sessionKey, entry) {
	if (isSyntheticSessionMaintenanceKey(sessionKey)) return false;
	if (isPrimarySessionMaintenanceKey(sessionKey)) return true;
	if (parseThreadSessionSuffix(sessionKey).threadId) return true;
	if (entry?.delivery?.kind === "external" || isProtectedExternalConversationSessionKey(sessionKey)) return true;
	const chatType = normalizeLowercaseStringOrEmpty(entry?.chatType ?? sessionDeliveryOrigin(entry)?.chatType);
	return chatType === "group" || chatType === "channel" || chatType === "thread";
}
function shouldPreserveNonArchivedMaintenanceEntry(params) {
	if (params.entry?.pinnedAt !== void 0 && isPinnableSessionEntry(params.key, params.entry)) return true;
	return hasMainSessionRecoveryClaim(params.entry) && !params.entry?.mainRestartRecovery?.tombstone || params.entry?.modelSelectionLocked === true || params.preserveKeys?.has(params.key) === true || isRecentSessionMaintenanceEntry(params) || isProtectedSessionMaintenanceEntry(params.key, params.entry);
}
function shouldPreserveMaintenanceEntry(params) {
	return params.entry?.archivedAt !== void 0 || shouldPreserveNonArchivedMaintenanceEntry(params);
}
function isSessionEntryDiskBudgetEvictable(params) {
	return params.entry?.archivedAt !== void 0 && params.entry.archiveReason === "active-session-cap" && !shouldPreserveNonArchivedMaintenanceEntry(params);
}
function selectSessionEntryCapVictims(store, maxEntries, preserveKeys, preserveRecentMs) {
	const keys = Object.keys(store).filter((key) => store[key]?.archivedAt === void 0);
	const overflow = keys.length - Math.max(0, maxEntries);
	if (overflow <= 0) return [];
	return keys.filter((key) => !shouldPreserveMaintenanceEntry({
		key,
		entry: store[key],
		preserveKeys,
		preserveRecentMs
	})).toReversed().toSorted((a, b) => getSessionMaintenanceActivityAt(store[a]) - getSessionMaintenanceActivityAt(store[b])).slice(0, overflow);
}
/**
* Cap the unarchived store to N entries. Ordinary sessions are archived; synthetic runtime rows
* remain disposable and are removed. Protected rows count toward the cap but are never changed,
* so a store whose protected rows alone exceed the cap remains above it until protection is
* released.
* Mutates `store` in-place.
*/
function capEntryCount(store, maxEntries, opts = {}) {
	const victims = selectSessionEntryCapVictims(store, maxEntries, opts.preserveKeys, opts.preserveRecentMs);
	if (victims.length === 0) return 0;
	const now = opts.nowMs ?? Date.now();
	let archived = 0;
	let removed = 0;
	for (const key of victims) {
		const entry = store[key];
		if (!entry) continue;
		if (isSyntheticSessionMaintenanceKey(key)) {
			opts.onRemoved?.({
				key,
				entry
			});
			delete store[key];
			removed += 1;
		} else {
			entry.archivedAt = now;
			delete entry.archivedBy;
			entry.archiveReason = "active-session-cap";
			opts.onArchived?.({
				key,
				entry
			});
			archived += 1;
		}
	}
	if (opts.log !== false) log.info("capped unarchived session entry count", {
		archived,
		removed,
		maxEntries
	});
	return archived + removed;
}
function countUnarchivedSessionEntries(store) {
	return Object.values(store).reduce((count, entry) => count + (entry.archivedAt === void 0 ? 1 : 0), 0);
}
//#endregion
export { sameRestartRecoveryTerminalRunIds as A, mergeRestartRecoveryTerminalDeliveryEvidence as C, normalizeRestartRecoveryTerminalRunIds as D, normalizeRestartRecoveryEntryFields as E, recordLifecycleFence as O, isRetryableUnadoptedChatClaim as S, normalizeMainSessionRecoveryRunFences as T, getRestartRecoveryTerminalDeliveryEvidence as _, normalizeResolvedMaintenanceConfigInput as a, hasRestartRecoveryTerminalRun as b, resolveMaintenanceConfigFromInput as c, shouldRunModelRunPrune as d, shouldRunSessionEntryMaintenance as f, getRestartRecoveryPendingFinalSourceRunId as g, canReplaceAbortedRestartRecoveryClaim as h, isSessionEntryDiskBudgetEvictable as i, resolveRestartRecoveryChannelAuthority as k, resolveQuotaSuspensionEntryMaintenance as l, buildRestartRecoveryClaimCleanupPatch as m, capEntryCount as n, pruneStaleEntries as o, isPinnableSessionEntry as p, countUnarchivedSessionEntries as r, pruneStaleModelRunEntries as s, archiveStaleDashboardEntries as t, shouldPreserveMaintenanceEntry as u, hasMainSessionRecoveryClaim as v, mergeRestartRecoveryTerminalRunIds as w, isMainRestartRecoveryCandidate as x, hasRestartRecoverySourceClaim as y };

import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as asPositiveSafeInteger, s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { a as getNodeSqliteKysely, d as sql, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { s as isSilentReplyText } from "./tokens-D4ghQG_g.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { t as stripInternalMetadataForDisplay } from "./display-text-sanitize-BtEixrp8.mjs";
import { o as subagentRunRowVersion, r as hasParentStoreColumns } from "./subagent-registry.store.kernel-5Rc86AOU.mjs";
import { createHash } from "node:crypto";
//#region src/agents/agent-run-terminal-receipt.ts
const AGENT_RUN_ROUTE_CHANGE_MAX_CHARS = 320;
function normalizeAgentRunTerminalReceipt(value) {
	const receipt = value;
	return receipt && typeof receipt.runId === "string" && typeof receipt.sessionId === "string" && typeof receipt.turnId === "string" && receipt.requested && receipt.effective && Array.isArray(receipt.successfulToolNames) ? receipt : void 0;
}
function formatAgentRunModelRef(value) {
	const route = redactSensitiveText(`${value.provider}/${value.model}`, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return route ? truncateUtf16Safe(route, 128) : void 0;
}
/** Normalizes the producer-owned route fact before lifecycle or prompt use. */
function normalizeAgentRunRouteChange(value) {
	const normalized = typeof value === "string" ? redactSensitiveText(value, { mode: "tools" }).replace(/\s+/gu, " ").trim() : "";
	return normalized ? truncateUtf16Safe(normalized, AGENT_RUN_ROUTE_CHANGE_MAX_CHARS) : void 0;
}
/** Formats the bounded, secret-free route fact owned by a terminal receipt. */
function formatAgentRunRouteChange(receipt, expectedRunId) {
	if (receipt?.runId !== expectedRunId || !receipt.rerouted || receipt.terminalDisposition !== "visible") return;
	const requested = formatAgentRunModelRef(receipt.requested);
	const effective = formatAgentRunModelRef({
		...receipt.effective,
		model: receipt.effective.responseModel || receipt.effective.model
	});
	return requested && effective ? `Model route changed: ${requested} → ${effective}.` : void 0;
}
//#endregion
//#region src/agents/agent-run-terminal-reply.ts
const AGENT_RUN_TERMINAL_REPLY_MAX_CHARS = 4096;
function isMessageToolNotCalledTerminalReply(reply) {
	return reply?.disposition === "empty" && reply.code === "message-tool-not-called";
}
/** Sanitizes and caps producer-owned text before it enters lifecycle or durable state. */
function sanitizeAgentRunTerminalReplyText(text) {
	return truncateWithMarker(stripInternalMetadataForDisplay(text).trim(), AGENT_RUN_TERMINAL_REPLY_MAX_CHARS, {
		marker: "…",
		reserve: 1,
		trimEnd: true
	});
}
/** Builds the authoritative terminal reply fact while raw assistant text is still available. */
function buildAgentRunTerminalReplySnapshot(params) {
	if (params.terminalReplyKind === "silent-empty" || isSilentReplyText(params.rawText ?? params.visibleText, "NO_REPLY")) return { disposition: "silent" };
	const text = sanitizeAgentRunTerminalReplyText(params.visibleText ?? "");
	return text ? {
		disposition: "visible",
		text
	} : { disposition: "empty" };
}
/** Normalizes lifecycle/RPC evidence without allowing raw or unbounded text through. */
function normalizeAgentRunTerminalReplySnapshot(value) {
	if (!isRecord(value)) return;
	const disposition = value.disposition;
	if (disposition === "silent") return { disposition };
	if (disposition === "empty") {
		if (value.code === "message-tool-not-called") return {
			disposition,
			code: "message-tool-not-called"
		};
		return { disposition };
	}
	if (disposition !== "visible") return;
	const rawText = value.text;
	if (typeof rawText !== "string") return;
	const text = sanitizeAgentRunTerminalReplyText(rawText);
	const modelRouteChange = normalizeAgentRunRouteChange(value.modelRouteChange);
	return text ? {
		disposition: "visible",
		text,
		...modelRouteChange ? { modelRouteChange } : {}
	} : { disposition: "empty" };
}
/** Reply evidence merges independently from sticky timeout/cancellation precedence. */
function mergeAgentRunTerminalReplySnapshot(existing, incoming) {
	if (!incoming || isMessageToolNotCalledTerminalReply(existing)) return existing;
	if (!existing || isMessageToolNotCalledTerminalReply(incoming) || existing.disposition === "empty") return incoming;
	return incoming.disposition === "empty" ? existing : incoming;
}
//#endregion
//#region src/agents/subagents/registry/subagent-delivery-state.ts
function resetRequesterSettleWakeRetry(wake) {
	return {
		...wake,
		status: "pending",
		attemptCount: 0,
		replayCount: void 0,
		nextAttemptAt: void 0,
		deferralCount: void 0,
		lastError: void 0
	};
}
/** A pause uses the existing retry owner, but never consumes the completion cohort. */
function consumeSubagentPauseNotice(entry) {
	const wake = entry.requesterSettleWake;
	if (entry.pauseReason !== "sessions_yield" || !wake?.pauseNotice) return false;
	const { pauseNotice: _notice, ...completionWake } = wake;
	entry.requesterSettleWake = resetRequesterSettleWakeRetry(completionWake);
	return true;
}
function projectSubagentRunForSessionList(entry) {
	return {
		runId: entry.runId,
		...entry.taskRunId !== void 0 ? { taskRunId: entry.taskRunId } : {},
		...entry.pauseReason ? { pauseReason: entry.pauseReason } : {},
		...entry.swarmRunId ? { swarmRunId: entry.swarmRunId } : {},
		childSessionKey: entry.childSessionKey,
		...entry.childAgentId ? { childAgentId: entry.childAgentId } : {},
		...entry.controllerSessionKey ? { controllerSessionKey: entry.controllerSessionKey } : {},
		requesterSessionKey: entry.requesterSessionKey,
		requesterStorePath: entry.requesterStorePath,
		controllerStorePath: entry.controllerStorePath,
		...entry.collect ? {
			collect: true,
			groupId: entry.groupId,
			swarmRequesterSessionKey: entry.swarmRequesterSessionKey
		} : {},
		...entry.collectorCompletion ? { collectorCompletion: { status: entry.collectorCompletion.status } } : {},
		...entry.requesterAgentId ? { requesterAgentId: entry.requesterAgentId } : {},
		...entry.model ? { model: entry.model } : {},
		...entry.generation !== void 0 ? { generation: entry.generation } : {},
		createdAt: entry.createdAt,
		execution: {
			status: entry.execution.status,
			...entry.execution.interruptionReason ? { interruptionReason: entry.execution.interruptionReason } : {},
			...entry.execution.startedAt !== void 0 ? { startedAt: entry.execution.startedAt } : {},
			...entry.execution.endedAt !== void 0 ? { endedAt: entry.execution.endedAt } : {},
			...entry.execution.outcome ? { outcome: { status: entry.execution.outcome.status } } : {}
		},
		...entry.sessionStartedAt !== void 0 ? { sessionStartedAt: entry.sessionStartedAt } : {},
		...entry.accumulatedRuntimeMs !== void 0 ? { accumulatedRuntimeMs: entry.accumulatedRuntimeMs } : {},
		...entry.runTimeoutSeconds !== void 0 ? { runTimeoutSeconds: entry.runTimeoutSeconds } : {},
		...entry.endedReason ? { endedReason: entry.endedReason } : {},
		...entry.cleanupCompletedAt !== void 0 ? { cleanupCompletedAt: entry.cleanupCompletedAt } : {},
		...entry.delivery ? { delivery: {
			status: entry.delivery.status,
			...entry.delivery.disposition === "intentional_non_delivery" ? { disposition: entry.delivery.disposition } : {},
			...entry.delivery.suspendedAt !== void 0 ? { suspendedAt: entry.delivery.suspendedAt } : {}
		} } : {}
	};
}
/** Copy only protection facts; live memory retains its existing, unnormalized semantics. */
function projectSubagentRunForMaintenance(entry) {
	return {
		runId: entry.runId,
		childSessionKey: entry.childSessionKey,
		...entry.childAgentId ? { childAgentId: entry.childAgentId } : {},
		requesterSessionKey: entry.requesterSessionKey,
		createdAt: entry.createdAt,
		cleanupCompletedAt: entry.cleanupCompletedAt,
		expectsCompletionMessage: entry.expectsCompletionMessage,
		killIntent: entry.killIntent ? { ...entry.killIntent } : entry.killIntent,
		killReconciliation: entry.killReconciliation ? { ...entry.killReconciliation } : entry.killReconciliation,
		execution: {
			status: entry.execution.status,
			endedAt: entry.execution.endedAt
		},
		delivery: entry.delivery ? {
			status: entry.delivery.status,
			suspendedAt: entry.delivery.suspendedAt
		} : void 0
	};
}
function normalizeSubagentRunState(entry) {
	entry.taskRunId = normalizeOptionalString(entry.taskRunId);
	const requesterTurnRunId = normalizeOptionalString(entry.requesterTurnRunId);
	entry.requesterTurnRunId = requesterTurnRunId;
	entry.requesterTurnYielded = requesterTurnRunId && entry.requesterTurnYielded === true ? true : void 0;
	entry.retireAfterRequesterTurn = requesterTurnRunId && entry.retireAfterRequesterTurn === true ? true : void 0;
	entry.generation = asPositiveSafeInteger(entry.generation);
	entry.deleteCleanupDispatchedAt = Number.isFinite(entry.deleteCleanupDispatchedAt) ? entry.deleteCleanupDispatchedAt : void 0;
	entry.suppressCompletionDelivery = entry.suppressCompletionDelivery === true ? true : void 0;
	entry.terminalOwner = entry.terminalOwner === "interrupted-recovery" && Number.isFinite(entry.execution.endedAt) && entry.execution.outcome?.status === "error" && entry.endedReason === "subagent-error" && entry.pauseReason !== "sessions_yield" ? "interrupted-recovery" : void 0;
	if (entry.completion) entry.completion.terminalReply = normalizeAgentRunTerminalReplySnapshot(entry.completion.terminalReply);
	const killReconciliation = entry.killReconciliation;
	if (!killReconciliation || typeof killReconciliation !== "object" || !Number.isFinite(killReconciliation.killedAt)) delete entry.killReconciliation;
	else entry.killReconciliation = {
		killedAt: killReconciliation.killedAt,
		taskCancellationAccepted: killReconciliation.taskCancellationAccepted === true ? true : void 0,
		suppressTaskDelivery: killReconciliation.suppressTaskDelivery === true ? true : void 0,
		supersededAt: Number.isFinite(killReconciliation.supersededAt) ? killReconciliation.supersededAt : void 0
	};
	const killIntent = entry.killIntent;
	if (!killIntent || typeof killIntent !== "object" || !Number.isFinite(killIntent.requestedAt) || typeof killIntent.reason !== "string" || !killIntent.reason.trim()) delete entry.killIntent;
	else entry.killIntent = {
		requestedAt: killIntent.requestedAt,
		reason: killIntent.reason.trim(),
		lifecycleGeneration: normalizeOptionalString(killIntent.lifecycleGeneration),
		sessionId: normalizeOptionalString(killIntent.sessionId),
		sessionLifecycleRevision: normalizeOptionalString(killIntent.sessionLifecycleRevision),
		suppressTaskDelivery: killIntent.suppressTaskDelivery === true ? true : void 0
	};
	if (entry.cleanupHandled === true && typeof entry.cleanupCompletedAt !== "number" && entry.delivery?.status !== "discarded") entry.cleanupHandled = false;
	return entry;
}
function ensureCompletionState(entry) {
	entry.completion ??= { required: entry.expectsCompletionMessage === true };
	return entry.completion;
}
function ensureDeliveryState(entry) {
	entry.delivery ??= { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
	return entry.delivery;
}
function clearDeliveryState(entry) {
	entry.delivery = { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
}
function isDeliverySuspended(entry) {
	return entry.delivery?.status === "suspended" && typeof entry.delivery.suspendedAt === "number";
}
/** A finished requester without its required message receipt must not execute again implicitly. */
function isCompletedRequesterDeliveryBlocked(entry) {
	return isDeliverySuspended(entry) && entry.delivery?.suspendedReason === "permanent_failure" && entry.delivery.lastDropReason === "message_tool_delivery_missing";
}
/** Returns true when required delivery still owns the row after its child session is gone. */
function hasRetainedRequiredCompletionDelivery(entry) {
	const delivery = entry.delivery;
	if (entry.expectsCompletionMessage !== true || entry.suppressCompletionDelivery === true || entry.completion?.required !== true || !delivery?.payload) return false;
	if (isDeliverySuspended(entry)) return true;
	if (delivery.status === "in_progress") return true;
	return delivery.status === "pending" && delivery.disposition !== "ambiguous" && delivery.disposition !== "intentional_non_delivery" && delivery.disposition !== "permanent_failure";
}
function getDeliveryLastError(entry) {
	const error = entry.delivery?.lastError;
	return typeof error === "string" && error.trim() ? error : void 0;
}
const markRequesterSettleWakePending = (entry, options) => {
	const existing = entry.requesterSettleWake;
	entry.requesterSettleWake = {
		...structuredClone(existing),
		status: existing?.status ?? "pending",
		attemptCount: existing?.attemptCount ?? 0,
		...existing?.retireAfterSettle === true || options?.retireAfterSettle === true ? { retireAfterSettle: true } : {}
	};
};
const clearSubagentPendingDelivery = (entry) => {
	const delivery = ensureDeliveryState(entry);
	delivery.payload = void 0;
	delivery.createdAt = void 0;
	delivery.lastAttemptAt = void 0;
	delivery.nextAttemptAt = void 0;
	delivery.attemptCount = void 0;
	delivery.lastError = void 0;
	delivery.suspendedAt = void 0;
	delivery.suspendedReason = void 0;
	if (delivery.status !== "delivered" && delivery.status !== "failed") clearDeliveryState(entry);
};
const loadPendingFinalDeliveryPayload = (entry) => {
	return {
		requesterSessionKey: entry.delivery?.payload?.requesterSessionKey ?? entry.requesterSessionKey,
		requesterOrigin: entry.delivery?.payload?.requesterOrigin ?? entry.requesterOrigin,
		requesterDisplayKey: entry.delivery?.payload?.requesterDisplayKey ?? entry.requesterDisplayKey,
		childSessionKey: entry.delivery?.payload?.childSessionKey ?? entry.childSessionKey,
		childRunId: entry.delivery?.payload?.childRunId ?? entry.runId,
		task: entry.delivery?.payload?.task ?? entry.task,
		label: entry.delivery?.payload?.label ?? entry.label,
		startedAt: entry.delivery?.payload?.startedAt ?? entry.execution.startedAt,
		endedAt: entry.delivery?.payload?.endedAt ?? entry.execution.endedAt,
		outcome: entry.delivery?.payload?.outcome ?? entry.execution.outcome,
		expectsCompletionMessage: entry.delivery?.payload?.expectsCompletionMessage ?? entry.expectsCompletionMessage,
		completionTarget: entry.completionTarget,
		completionRequesterSessionId: entry.completionRequesterSessionId,
		spawnMode: entry.delivery?.payload?.spawnMode ?? entry.spawnMode,
		wakeOnDescendantSettle: entry.delivery?.payload?.wakeOnDescendantSettle ?? entry.wakeOnDescendantSettle,
		terminalReply: entry.completion?.terminalReply ?? entry.delivery?.payload?.terminalReply
	};
};
function transitionRequesterSettleWakeState(entry, state) {
	entry.requesterSettleWake = {
		...state,
		...entry.requesterSettleWake?.progressOperationId ? { progressOperationId: entry.requesterSettleWake.progressOperationId } : {},
		...entry.requesterSettleWake?.retireAfterSettle === true ? { retireAfterSettle: true } : {}
	};
}
function completeRequesterSettleWakeState(entry) {
	let retire = false;
	if (entry.pauseReason !== "sessions_yield") {
		if (entry.requesterTurnRunId && entry.expectsCompletionMessage === true) entry.retireAfterRequesterTurn = entry.retireAfterRequesterTurn === true || entry.requesterSettleWake?.retireAfterSettle === true ? true : void 0;
		else retire = entry.requesterSettleWake?.retireAfterSettle === true;
	}
	entry.requesterSettleWake = void 0;
	return retire;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.codec.ts
const EXECUTION_STATUSES = new Set("queued running interrupted terminal".split(" "));
const DELIVERY_STATUSES = new Set("not_required pending in_progress delivered failed suspended discarded".split(" "));
function hasStateStatus(value, statuses) {
	return isRecord(value) && typeof value.status === "string" && statuses.has(value.status);
}
function isCanonicalSubagentRunRecord(value) {
	return isRecord(value) && hasStateStatus(value.execution, EXECUTION_STATUSES) && isRecord(value.completion) && typeof value.completion.required === "boolean" && hasStateStatus(value.delivery, DELIVERY_STATUSES) && !("handoffLeaseId" in value.delivery || "handoffLeasedAt" in value.delivery || "handoffInjectedAt" in value.delivery);
}
/** Rehydrates one sqlite row into the normalized subagent run record shape. */
function rowToSubagentRunRecord(row) {
	const stored = row.payload_json ? safeParseJson(row.payload_json) : void 0;
	const payload = isRecord(stored) && isRecord(stored.parentCompletion) && stored.parentCompletion.completionTarget === "parent" ? stored.parentCompletion : stored;
	if (!isCanonicalSubagentRunRecord(payload)) return null;
	payload.runId = row.run_id;
	payload.childSessionKey = row.child_session_key;
	payload.requesterSessionKey = row.requester_session_key;
	payload.requesterStorePath = row.requester_store_path ?? void 0;
	payload.controllerStorePath = row.controller_store_path ?? void 0;
	const controllerSessionKey = row.controller_session_key?.trim();
	if (controllerSessionKey) payload.controllerSessionKey = controllerSessionKey;
	else delete payload.controllerSessionKey;
	if (payload.requesterOrigin) payload.requesterOrigin = normalizeDeliveryContext(payload.requesterOrigin);
	if (payload.expectsCompletionMessage === false) payload.delivery.status = "not_required";
	const record = normalizeSubagentRunState(payload);
	if (!record.runId || !record.childSessionKey || !record.requesterSessionKey) return null;
	rememberSubagentRunVersion(record, subagentRunRowVersion(row));
	return record;
}
/** Canonically serializes a run before an outer transaction acquires the write lock. */
function bindSubagentRunRecord(entry) {
	const normalized = normalizeSubagentRunState(structuredClone(entry));
	if (!isCanonicalSubagentRunRecord(normalized)) throw new Error("subagent run is missing canonical nested state");
	return {
		run_id: normalized.runId,
		child_session_key: normalized.childSessionKey,
		controller_session_key: normalized.controllerSessionKey?.trim() || null,
		requester_session_key: normalized.requesterSessionKey,
		requester_store_path: normalized.requesterStorePath ?? null,
		controller_store_path: normalized.controllerStorePath ?? null,
		created_at: normalized.createdAt,
		payload_json: JSON.stringify(normalized.completionTarget === "parent" ? { parentCompletion: normalized } : normalized)
	};
}
const recordVersions = /* @__PURE__ */ new WeakMap();
function rememberSubagentRunVersion(entry, version) {
	recordVersions.set(entry, version);
}
function subagentRunRecordVersion(entry) {
	return entry ? recordVersions.get(entry) ?? subagentRunRowVersion(bindSubagentRunRecord(entry)) : null;
}
function parseSubagentRegistryWriteReceipt(value, write) {
	if (!isRecord(value) || value.writeId !== write.writeId) throw new Error("Registry acknowledgement identifies another write");
	if (Array.isArray(value.conflictRunIds) && value.conflictRunIds.every((id) => typeof id === "string")) return {
		writeId: write.writeId,
		conflictRunIds: value.conflictRunIds
	};
	if (!(value.versions instanceof Map) || !Array.isArray(value.notices)) throw new Error("Registry acknowledgement is missing commit facts");
	const versions = /* @__PURE__ */ new Map();
	for (const [id, version] of value.versions) {
		if (typeof id !== "string" || version !== null && typeof version !== "string") throw new Error("Registry acknowledgement has an invalid row version");
		versions.set(id, version);
	}
	const ids = [...write.values.map((row) => row.run_id), ...write.deleteRunIds];
	if (versions.size !== ids.length || ids.some((id) => !versions.has(id))) throw new Error("Registry acknowledgement does not cover its written rows");
	const notices = value.notices.map((notice) => {
		if (!isRecord(notice) || typeof notice.watcherSessionKey !== "string" || notice.watcherStorePath !== null && typeof notice.watcherStorePath !== "string" || typeof notice.targetSessionKey !== "string" || typeof notice.lastSeenSequence !== "number" || typeof notice.queueOnly !== "boolean") throw new Error("Registry acknowledgement has an invalid terminal notice");
		return {
			watcherSessionKey: notice.watcherSessionKey,
			watcherStorePath: notice.watcherStorePath,
			targetSessionKey: notice.targetSessionKey,
			lastSeenSequence: notice.lastSeenSequence,
			queueOnly: notice.queueOnly
		};
	});
	return {
		writeId: write.writeId,
		versions,
		notices
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-child-owner-match.ts
function matchesSubagentChildSessionOwner(entry, childSessionKey, childAgentId) {
	if (entry.childSessionKey !== childSessionKey) return false;
	if (!entry.childAgentId || childAgentId === void 0) return true;
	const owner = normalizeAgentIdStrict(childAgentId);
	return owner.ok && entry.childAgentId === owner.value;
}
//#endregion
//#region src/agents/subagents/registry/subagent-run-generation.ts
/** Durable execution identity is independent of the host runtime incarnation. */
function getSubagentRunIdentity(entry) {
	return JSON.stringify([
		entry.runId,
		entry.taskRunId ?? entry.runId,
		normalizeGeneration(entry),
		entry.createdAt,
		entry.childSessionKey,
		entry.childAgentId,
		entry.requesterSessionKey,
		entry.requesterAgentId,
		entry.requesterStorePath
	]);
}
function isSameSubagentRun(current, expected) {
	return Boolean(current && expected && getSubagentRunIdentity(current) === getSubagentRunIdentity(expected));
}
const runtimeKeys = /* @__PURE__ */ new WeakMap();
/** A host execution incarnation survives metadata copies, but not Gateway recovery adoption. */
function getSubagentRunRuntimeKey(entry) {
	let key = runtimeKeys.get(entry);
	if (!key) {
		key = {};
		runtimeKeys.set(entry, key);
	}
	return key;
}
/** Row producers associate aliases before retaining them or publishing an immutable copy. */
function bindSubagentRunRuntimeKey(entry, key) {
	runtimeKeys.set(entry, key);
}
/** Hydration keeps an existing host incarnation unless its producer supplied a fresh one. */
function retainSubagentRunRuntimeOwner(current, next) {
	if (!runtimeKeys.has(next)) bindSubagentRunRuntimeKey(next, current && isSameSubagentRun(current, next) ? getSubagentRunRuntimeKey(current) : {});
}
/** Accepted collector launch changes its address, not its queued physical execution. */
function isQueuedSubagentRunRekey(previous, next) {
	const alias = previous.swarmRunId ?? previous.runId;
	return previous.runId !== next.runId && previous.collect === true && next.collect === true && next.swarmRunId === alias && (previous.schedulerSlotId ?? alias) === (next.schedulerSlotId ?? next.swarmRunId) && (previous.taskRunId ?? alias) === (next.taskRunId ?? next.swarmRunId) && normalizeGeneration(previous) === normalizeGeneration(next) && previous.createdAt === next.createdAt && previous.childSessionKey === next.childSessionKey && previous.childAgentId === next.childAgentId && previous.requesterSessionKey === next.requesterSessionKey && previous.requesterAgentId === next.requesterAgentId && previous.requesterStorePath === next.requesterStorePath;
}
function isSameSubagentRunOwner(current, expected) {
	if (!current || !expected) return false;
	const key = runtimeKeys.get(current);
	return (current === expected || key !== void 0 && key === runtimeKeys.get(expected)) && (isSameSubagentRun(current, expected) || isQueuedSubagentRunRekey(expected, current) || isQueuedSubagentRunRekey(current, expected));
}
/** The live row when `observed`'s owner still holds its run id; otherwise `observed` itself. */
function currentSubagentRunOrObserved(runs, observed) {
	const current = runs.get(observed.runId);
	return current && isSameSubagentRunOwner(current, observed) ? current : observed;
}
function copySubagentRunRuntimeOwner(source, copy) {
	bindSubagentRunRuntimeKey(copy, getSubagentRunRuntimeKey(source));
	return copy;
}
function normalizeGeneration(entry) {
	return asFiniteNumber(entry.generation) ?? 0;
}
/** Orders runs that share a child session, including legacy rows without a generation. */
function compareSubagentRunGeneration(left, right) {
	const generationDelta = normalizeGeneration(left) - normalizeGeneration(right);
	if (generationDelta !== 0) return generationDelta;
	const createdAtDelta = left.createdAt - right.createdAt;
	if (createdAtDelta !== 0) return createdAtDelta;
	return left.runId.localeCompare(right.runId);
}
/** Keeps the newest generation at the grouping key prepared by the caller. */
function recordLatestSubagentRun(map, key, entry) {
	const existing = map.get(key);
	if (!existing || compareSubagentRunGeneration(entry, existing) > 0) map.set(key, entry);
}
/** Selects the newest matching generation from an existing group. */
function latestSubagentRun(runs, matches) {
	let latest;
	for (const entry of runs) if ((!matches || matches(entry)) && (!latest || compareSubagentRunGeneration(entry, latest) > 0)) latest = entry;
	return latest;
}
/** Allocates a durable monotonic generation within one child session. */
function nextSubagentRunGeneration(runs, childSessionKey, childAgentId) {
	let generation = 0;
	for (const entry of runs) if (matchesSubagentChildSessionOwner(entry, childSessionKey, childAgentId)) generation = Math.max(generation, normalizeGeneration(entry));
	return generation + 1;
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-topology.ts
const NO_DESCENDANTS = Object.freeze([]);
function resolveControllerSessionKey(entry) {
	return entry.controllerSessionKey?.trim() || entry.requesterSessionKey;
}
/** Mutable membership belongs to the resident index; query windows own time and liveness. */
function buildSubagentRunReadTopology(params) {
	const { runs } = params;
	const inMemoryDisplayByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByChildSessionKey = /* @__PURE__ */ new Map();
	const latestRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const runsByControllerSessionKey = /* @__PURE__ */ new Map();
	const swarmRunsByRequesterSessionKey = /* @__PURE__ */ new Map();
	const latestRunByRequesterAndChildSessionKey = /* @__PURE__ */ new Map();
	const descendantsBySessionKey = /* @__PURE__ */ new Map();
	let revision = {};
	const snapshotRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const memoryRunsByChildSessionKey = /* @__PURE__ */ new Map();
	const memoryChildKeys = /* @__PURE__ */ new Map();
	const runKeys = /* @__PURE__ */ new Map();
	const groupingKeys = (entry) => [
		entry.childSessionKey.trim(),
		resolveControllerSessionKey(entry),
		entry.collect && entry.groupId ? entry.swarmRequesterSessionKey ?? "" : "",
		entry.requesterSessionKey
	];
	const positionsByIndex = /* @__PURE__ */ new Map();
	const updateBucket = (index, key, runId, entry) => {
		if (!key) return;
		const rows = index.get(key) ?? [];
		let positions = positionsByIndex.get(index);
		if (!positions) {
			positions = /* @__PURE__ */ new Map();
			positionsByIndex.set(index, positions);
		}
		const position = positions.get(runId);
		if (position !== void 0) {
			if (entry) rows[position] = entry;
			else {
				rows.splice(position, 1);
				positions.delete(runId);
				for (let next = position; next < rows.length; next++) {
					const row = rows[next];
					if (row) positions.set(row.runId, next);
				}
			}
		} else if (entry) {
			positions.set(runId, rows.length);
			rows.push(entry);
		}
		if (rows.length) index.set(key, rows);
		else index.delete(key);
	};
	for (const entry of params.inMemoryRuns ?? []) {
		const childSessionKey = entry.childSessionKey.trim();
		memoryChildKeys.set(entry.runId, childSessionKey);
		updateBucket(memoryRunsByChildSessionKey, childSessionKey, entry.runId, entry);
		if (!childSessionKey) continue;
		recordLatestSubagentRun(inMemoryDisplayByChildSessionKey, childSessionKey, entry);
	}
	const inputs = {
		runs,
		inMemoryRuns: new Set(inMemoryDisplayByChildSessionKey.values())
	};
	function patch(changes, inMemoryChanges) {
		descendantsBySessionKey.clear();
		revision = {};
		const affected = /* @__PURE__ */ new Map();
		const touch = (child) => {
			if (child && !affected.has(child)) affected.set(child, new Set((snapshotRunsByChildSessionKey.get(child) ?? []).map((entry) => runKeys.get(entry.runId)?.[3] ?? entry.requesterSessionKey)));
		};
		const groups = [
			snapshotRunsByChildSessionKey,
			runsByControllerSessionKey,
			swarmRunsByRequesterSessionKey
		];
		for (const [runId, entry] of changes) {
			const previous = runKeys.get(runId) ?? [];
			const next = entry ? groupingKeys(entry) : [];
			touch(previous[0] ?? "");
			touch(next[0] ?? "");
			groups.forEach((index, position) => {
				if (previous[position] && previous[position] !== next[position]) updateBucket(index, previous[position], runId);
				updateBucket(index, next[position] ?? "", runId, entry);
			});
			if (entry) {
				if (changes !== runs) runs.set(runId, entry);
				runKeys.set(runId, next);
			} else {
				runs.delete(runId);
				runKeys.delete(runId);
			}
		}
		for (const [runId, entry] of inMemoryChanges) {
			const previous = memoryChildKeys.get(runId) ?? "";
			const next = entry?.childSessionKey.trim() ?? "";
			touch(previous);
			touch(next);
			if (previous !== next) updateBucket(memoryRunsByChildSessionKey, previous, runId);
			updateBucket(memoryRunsByChildSessionKey, next, runId, entry);
			if (entry) memoryChildKeys.set(runId, next);
			else memoryChildKeys.delete(runId);
		}
		for (const [child, previousRequesters] of affected) {
			const rows = snapshotRunsByChildSessionKey.get(child) ?? [];
			const memory = latestSubagentRun(memoryRunsByChildSessionKey.get(child) ?? []);
			const latest = latestSubagentRun(rows);
			const previousMemory = inMemoryDisplayByChildSessionKey.get(child);
			if (previousMemory !== memory) {
				if (previousMemory) inputs.inMemoryRuns.delete(previousMemory);
				if (memory) inputs.inMemoryRuns.add(memory);
			}
			for (const [index, entry] of [[inMemoryDisplayByChildSessionKey, memory], [latestRunsByChildSessionKey, latest]]) if (entry) index.set(child, entry);
			else index.delete(child);
			const candidates = [.../* @__PURE__ */ new Set([...rows, ...memory ? [memory] : []])];
			if (candidates.length) runsByChildSessionKey.set(child, candidates);
			else runsByChildSessionKey.delete(child);
			const byRequester = /* @__PURE__ */ new Map();
			for (const row of rows) if (row.requesterSessionKey) recordLatestSubagentRun(byRequester, row.requesterSessionKey, row);
			for (const requester of /* @__PURE__ */ new Set([...previousRequesters, ...byRequester.keys()])) {
				const children = latestRunByRequesterAndChildSessionKey.get(requester) ?? /* @__PURE__ */ new Map();
				const entry = byRequester.get(requester);
				if (entry) children.set(child, entry);
				else children.delete(child);
				if (children.size) latestRunByRequesterAndChildSessionKey.set(requester, children);
				else latestRunByRequesterAndChildSessionKey.delete(requester);
			}
		}
	}
	patch(runs, /* @__PURE__ */ new Map());
	for (const [key, entry] of inMemoryDisplayByChildSessionKey) if (!runsByChildSessionKey.has(key)) runsByChildSessionKey.set(key, [entry]);
	function getDescendantRuns(rootSessionKey) {
		const root = rootSessionKey.trim();
		if (!root || !latestRunByRequesterAndChildSessionKey.has(root)) return NO_DESCENDANTS;
		const cached = descendantsBySessionKey.get(root);
		if (cached) return cached;
		const descendants = [];
		const pending = [root];
		const visited = new Set(pending);
		for (const requester of pending) for (const [childSessionKey, entry] of latestRunByRequesterAndChildSessionKey.get(requester) ?? []) {
			if (latestRunsByChildSessionKey.get(childSessionKey) !== entry) continue;
			descendants.push(entry);
			if (!visited.has(childSessionKey)) {
				visited.add(childSessionKey);
				pending.push(childSessionKey);
			}
		}
		descendantsBySessionKey.set(root, Object.freeze(descendants));
		return descendants;
	}
	return {
		inputs,
		get revision() {
			return revision;
		},
		getDescendantRuns,
		inMemoryDisplayByChildSessionKey,
		runsByChildSessionKey,
		latestRunsByChildSessionKey,
		runsByControllerSessionKey,
		swarmRunsByRequesterSessionKey,
		patch
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-session-read-scope.ts
function buildChildren(runGroups) {
	const children = /* @__PURE__ */ new Map();
	for (const runs of runGroups) for (const run of runs) {
		const child = run.childSessionKey.trim();
		if (!child) continue;
		const siblings = children.get(run.requesterSessionKey) ?? /* @__PURE__ */ new Set();
		siblings.add(child);
		children.set(run.requesterSessionKey, siblings);
	}
	return children;
}
function collectKeys(sessionKeys, ...childrenForRequester) {
	const selected = new Set(sessionKeys.map((key) => key.trim()).filter(Boolean));
	for (const requester of selected) for (const children of childrenForRequester) for (const child of children(requester)) selected.add(child);
	return selected;
}
/** Select a complete requester closure; the read index still owns generation and liveness policy. */
function collectSubagentSessionReadKeys(sessionKeys, ...runGroups) {
	const children = buildChildren(runGroups);
	return collectKeys(sessionKeys, (requester) => children.get(requester) ?? []);
}
/** Derived membership only; the cache's snapshot Map remains the record owner. */
var SubagentSessionReadLookup = class {
	#memberships = /* @__PURE__ */ new Map();
	#byRunId = /* @__PURE__ */ new Map();
	#sessions;
	#nextOrder = 0;
	constructor(entries = []) {
		for (const [cacheKey, entry] of entries) this.set(cacheKey, entry);
	}
	set(cacheKey, entry) {
		const previous = this.#memberships.get(cacheKey);
		if (!entry) {
			if (previous) {
				this.#remove(previous);
				this.#memberships.delete(cacheKey);
			}
			return;
		}
		const child = entry.childSessionKey.trim();
		const requester = entry.requesterSessionKey;
		const controller = resolveControllerSessionKey(entry);
		if (previous && previous.runId === entry.runId && previous.swarmRunId === entry.swarmRunId && previous.child === child && previous.requester === requester && previous.controller === controller) {
			previous.entry = entry;
			return;
		}
		if (previous) this.#remove(previous);
		const membership = {
			cacheKey,
			entry,
			runId: entry.runId,
			swarmRunId: entry.swarmRunId,
			child,
			requester,
			controller,
			order: previous?.order ?? this.#nextOrder++
		};
		this.#memberships.set(cacheKey, membership);
		for (const id of [membership.runId, membership.swarmRunId]) if (id) this.#addToBucket(this.#byRunId, id, membership);
		this.#indexSession(membership);
	}
	/** Broad publications invalidate relationships without rebuilding the eager run-ID index. */
	invalidateSessions() {
		this.#sessions = void 0;
	}
	#sessionBuckets() {
		if (!this.#sessions) {
			this.#sessions = {
				children: /* @__PURE__ */ new Map(),
				byChild: /* @__PURE__ */ new Map(),
				byController: /* @__PURE__ */ new Map(),
				byOwner: /* @__PURE__ */ new Map()
			};
			for (const membership of this.#memberships.values()) {
				membership.child = membership.entry.childSessionKey.trim();
				membership.requester = membership.entry.requesterSessionKey;
				membership.controller = resolveControllerSessionKey(membership.entry);
				this.#indexSession(membership);
			}
		}
		return this.#sessions;
	}
	#indexSession(membership) {
		const buckets = this.#sessions;
		if (!buckets) return;
		const { requester, controller } = membership;
		for (const owner of /* @__PURE__ */ new Set([requester.trim(), controller.trim()])) this.#addToBucket(buckets.byOwner, owner, membership);
		if (membership.child) {
			const children = buckets.children.get(membership.requester) ?? /* @__PURE__ */ new Map();
			children.set(membership.child, (children.get(membership.child) ?? 0) + 1);
			buckets.children.set(membership.requester, children);
			this.#addToBucket(buckets.byChild, membership.child, membership);
		}
		if (membership.controller) this.#addToBucket(buckets.byController, membership.controller, membership);
	}
	selectRunIds(ids, additionalCacheKeys = []) {
		return this.#select(this.#byRunId, ids, additionalCacheKeys);
	}
	selectSessions(sessionKeys, inMemoryRuns) {
		const buckets = this.#sessionBuckets();
		const liveChildren = buildChildren([inMemoryRuns]);
		const selected = collectKeys(sessionKeys, (requester) => buckets.children.get(requester)?.keys() ?? [], (requester) => liveChildren.get(requester) ?? []);
		return {
			sessionKeys: selected,
			cacheKeys: this.#select(buckets.byChild, selected)
		};
	}
	selectChildren(childKeys) {
		return this.#select(this.#sessionBuckets().byChild, childKeys);
	}
	selectControllers(controllerKeys) {
		return this.#select(this.#sessionBuckets().byController, controllerKeys);
	}
	/** Include every generation of selected children, even after an ownership move. */
	selectReadScope(sessionKeys, other, descendants, additionalCacheKeys = []) {
		const owners = new Set(sessionKeys.map((key) => key.trim()).filter(Boolean));
		const children = new Set(descendants ? owners : []);
		const buckets = this.#sessionBuckets();
		const otherBuckets = other.#sessionBuckets();
		for (const owner of owners) for (const lookup of [buckets, otherBuckets]) for (const row of lookup.byOwner.get(owner) ?? []) if (row.child) {
			children.add(row.child);
			if (descendants) owners.add(row.child);
		}
		return [.../* @__PURE__ */ new Set([
			...this.#select(buckets.byOwner, owners),
			...this.selectChildren(children),
			...additionalCacheKeys.filter((key) => this.#memberships.has(key))
		])].toSorted((a, b) => this.#memberships.get(a).order - this.#memberships.get(b).order);
	}
	#select(buckets, keys, additionalCacheKeys = []) {
		const selected = /* @__PURE__ */ new Set();
		for (const key of keys) for (const membership of buckets.get(key) ?? []) selected.add(membership);
		for (const key of additionalCacheKeys) {
			const membership = this.#memberships.get(key);
			if (membership) selected.add(membership);
		}
		if (selected.size === this.#memberships.size) return [...this.#memberships.keys()];
		return [...selected].toSorted((left, right) => left.order - right.order).map((row) => row.cacheKey);
	}
	#addToBucket(buckets, key, membership) {
		const bucket = buckets.get(key) ?? /* @__PURE__ */ new Set();
		bucket.add(membership);
		buckets.set(key, bucket);
	}
	#removeFromBucket(buckets, key, membership) {
		const bucket = buckets.get(key);
		bucket?.delete(membership);
		if (bucket?.size === 0) buckets.delete(key);
	}
	#remove(membership) {
		for (const id of [membership.runId, membership.swarmRunId]) if (id) this.#removeFromBucket(this.#byRunId, id, membership);
		const buckets = this.#sessions;
		if (!buckets) return;
		const children = buckets.children.get(membership.requester);
		const remaining = (children?.get(membership.child) ?? 0) - 1;
		if (remaining > 0) children?.set(membership.child, remaining);
		else {
			children?.delete(membership.child);
			if (children?.size === 0) buckets.children.delete(membership.requester);
		}
		this.#removeFromBucket(buckets.byChild, membership.child, membership);
		this.#removeFromBucket(buckets.byController, membership.controller, membership);
		for (const owner of /* @__PURE__ */ new Set([membership.requester.trim(), membership.controller.trim()])) this.#removeFromBucket(buckets.byOwner, owner, membership);
	}
};
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.sqlite.ts
function parentStoreColumns(db) {
	return hasParentStoreColumns(db) ? ["requester_store_path", "controller_store_path"] : [sql.val(null).as("requester_store_path"), sql.val(null).as("controller_store_path")];
}
function readSubagentRunRow(database, runId) {
	return executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("subagent_runs").selectAll().where("run_id", "=", runId)).rows[0];
}
function readSubagentRun(database, runId) {
	const row = readSubagentRunRow(database, runId);
	return row ? rowToSubagentRunRecord(row) : null;
}
function subagentControllerFilter(controllerSessionKeys) {
	return (eb) => eb.or([eb("controller_session_key", "in", controllerSessionKeys), eb.and([eb.or([eb("controller_session_key", "is", null), eb("controller_session_key", "=", "")]), eb("requester_session_key", "in", controllerSessionKeys)])]);
}
function readSubagentRegistryRows(scope, database = openOpenClawStateDatabase(), projection = "full") {
	const { db } = database;
	let query = getNodeSqliteKysely(db).selectFrom("subagent_runs").select([
		"run_id",
		"child_session_key",
		"controller_session_key",
		"requester_session_key",
		...parentStoreColumns(db),
		"created_at"
	]).select(projection === "full" ? "payload_json" : subagentMaintenancePayload.as("payload_json"));
	if (scope?.kind === "child") query = query.where("child_session_key", "=", scope.sessionKey);
	else if (scope?.kind === "runs") query = query.where("run_id", "in", sqliteStringSet(scope.runIds));
	else if (scope?.kind === "session") query = query.where((eb) => eb.or([eb("controller_session_key", "=", scope.sessionKey), eb("requester_session_key", "=", scope.sessionKey)]));
	else if (scope?.kind === "controller") query = query.where(subagentControllerFilter([scope.sessionKey]));
	return executeSqliteQuerySync(db, query.orderBy("created_at", "asc").orderBy("run_id", "asc")).rows;
}
const subagentMetadataPayload = sql`CASE WHEN json_valid(payload_json)
      AND length(CAST(payload_json AS BLOB)) = length(CAST(printf('%s', payload_json) AS BLOB))
    THEN json_remove(payload_json, ${sql.join([
	"$.task",
	"$.completion.resultText",
	"$.completion.fallbackResultText",
	"$.completion.terminalReply",
	"$.delivery.payload",
	"$.delivery.lastError",
	"$.execution.outcome.error",
	"$.collectorCompletion.structured",
	"$.collectorCompletion.schemaError",
	"$.outputSchema",
	"$.structuredOutput",
	"$.queuedLaunch"
].flatMap((path) => [path, `$.parentCompletion${path.slice(1)}`]))})
    ELSE NULL END`;
const subagentMaintenancePayload = sql`COALESCE(${subagentMetadataPayload}, payload_json)`;
const subagentSessionListPaths = [
	"completionTarget",
	"swarmRunId",
	"taskRunId",
	"model",
	"pauseReason",
	"collect",
	"groupId",
	"swarmRequesterSessionKey",
	"collectorCompletion.status",
	"runTimeoutSeconds",
	"execution.status",
	"execution.interruptionReason",
	"execution.startedAt",
	"execution.endedAt",
	"execution.outcome.status",
	"completion.required",
	"delivery.status",
	"delivery.disposition",
	"delivery.suspendedAt",
	"delivery.handoffLeaseId",
	"delivery.handoffLeasedAt",
	"delivery.handoffInjectedAt",
	"childAgentId",
	"requesterAgentId",
	"sessionStartedAt",
	"accumulatedRuntimeMs",
	"endedReason",
	"cleanupCompletedAt",
	"generation",
	"createdAt",
	"expectsCompletionMessage"
];
function projectSessionListJsonMembers(payload, paths, depth) {
	const members = /* @__PURE__ */ new Map();
	for (const path of paths) {
		const separator = path.indexOf(".");
		const key = separator < 0 ? path : path.slice(0, separator);
		const children = members.get(key) ?? [];
		if (separator >= 0) children.push(path.slice(separator + 1));
		members.set(key, children);
	}
	const alias = `member_${depth}`;
	const key = sql.ref(`${alias}.key`);
	const type = sql.ref(`${alias}.type`);
	const value = sql.ref(`${alias}.value`);
	const cursor = sql.id(alias);
	const nested = [...members].flatMap(([name, children]) => children.length ? [sql`WHEN ${key} = ${name} AND ${type} = 'object' THEN json(${projectSessionListJsonMembers(value, children, depth + 1)})`] : []);
	return sql`(SELECT json_group_object(${key}, CASE
    ${sql.join(nested, sql` `)}
    WHEN ${type} = 'object' THEN json('{}') WHEN ${type} = 'array' THEN json('[]')
    WHEN ${type} = 'true' THEN json('true') WHEN ${type} = 'false' THEN json('false')
    ELSE ${value} END)
    FROM json_each(${payload}) AS ${cursor}
    WHERE ${key} IN (${sql.join([...members.keys()])}))`;
}
projectSessionListJsonMembers(sql.ref("payload_json"), [...subagentSessionListPaths, ...subagentSessionListPaths.map((path) => `parentCompletion.${path}`)], 0);
function loadScopedSubagentRuns(scope, database) {
	const normalizedScope = scope.kind === "runs" ? scope : {
		...scope,
		sessionKey: scope.sessionKey.trim()
	};
	if (normalizedScope.kind === "runs" ? normalizedScope.runIds.length === 0 : !normalizedScope.sessionKey) return [];
	return readSubagentRegistryRows(normalizedScope, database).flatMap((row) => {
		const run = rowToSubagentRunRecord(row);
		return run ? [run] : [];
	});
}
/** Loads runs controlled by one session, preserving the legacy requester fallback. */
function loadSubagentRunsForControllerFromSqlite(controllerSessionKey) {
	return loadScopedSubagentRuns({
		kind: "controller",
		sessionKey: controllerSessionKey
	});
}
function loadSubagentRunsForChildSessionFromSqlite(childSessionKey, database) {
	return loadScopedSubagentRuns({
		kind: "child",
		sessionKey: childSessionKey
	}, database);
}
/** Loads the canonical subagent registry from shared SQLite state. */
function loadSubagentRegistryFromSqlite(database) {
	return decodeSubagentRegistryRows(readSubagentRegistryRows(void 0, database), (entry) => entry);
}
function decodeSubagentRegistryRows(rows, project, observe) {
	const runs = /* @__PURE__ */ new Map();
	for (const row of rows) {
		observe?.(row);
		const entry = rowToSubagentRunRecord(row);
		if (entry) runs.set(entry.runId, project(entry));
	}
	return runs;
}
/** Uses the canonical codec without transferring retained prompts and completion results. */
function loadSubagentMaintenanceRunsFromSqlite() {
	return decodeSubagentRegistryRows(readSubagentRegistryRows(void 0, void 0, "maintenance"), projectSubagentRunForMaintenance);
}
/** Hash physical projection rows before decoding, including malformed and colliding identities. */
function loadSubagentMaintenanceRunsInDatabase(database) {
	return runSqliteDeferredTransactionSync(database.db, () => {
		const hash = createHash("sha256");
		return {
			runs: decodeSubagentRegistryRows(readSubagentRegistryRows(void 0, database, "maintenance"), projectSubagentRunForMaintenance, (row) => {
				hash.update(JSON.stringify(row));
			}),
			digest: hash.digest("hex")
		};
	});
}
function subagentMaintenanceDurableBasisMatches(database, basis) {
	return loadSubagentMaintenanceRunsInDatabase(database).digest === basis.digest;
}
/** Select identities and physical records in one snapshot, before codec filtering. */
function loadSubagentRunsForSessionsInDatabase(database, sessionKeys, inMemoryRuns) {
	const hash = createHash("sha256");
	const { db } = database;
	return {
		...runSqliteDeferredTransactionSync(db, () => {
			const stateDb = getNodeSqliteKysely(db);
			const identities = executeSqliteQuerySync(db, stateDb.selectFrom("subagent_runs").select([
				"run_id",
				"child_session_key",
				"requester_session_key"
			]).orderBy("run_id", "asc")).rows;
			const selected = collectSubagentSessionReadKeys(sessionKeys, identities.map((row) => ({
				childSessionKey: row.child_session_key,
				requesterSessionKey: row.requester_session_key
			})), inMemoryRuns);
			const selectedRunIds = new Set(identities.filter((row) => selected.has(row.child_session_key.trim())).map((row) => row.run_id.trim()));
			const runIds = identities.filter((row) => selectedRunIds.has(row.run_id.trim())).map((row) => row.run_id);
			const runs = /* @__PURE__ */ new Map();
			const complete = runIds.length === identities.length;
			for (const row of identities) if (selected.has(row.child_session_key.trim()) || selectedRunIds.has(row.run_id.trim())) hash.update(JSON.stringify(["topology", row]));
			if (runIds.length) {
				const query = stateDb.selectFrom("subagent_runs").selectAll();
				const rows = executeSqliteQuerySync(db, (complete ? query : query.where("run_id", "in", sqliteStringSet(runIds))).orderBy("created_at", "asc").orderBy("run_id", "asc")).rows;
				for (const row of rows) {
					hash.update(JSON.stringify(["row", row]));
					const entry = rowToSubagentRunRecord(row);
					if (entry) runs.set(entry.runId, entry);
				}
			}
			return {
				sessionKeys: selected,
				runIds,
				runs,
				complete
			};
		}),
		digest: hash.digest("hex")
	};
}
function subagentRunsDurableBasisMatches(database, basis) {
	return loadSubagentRunsForSessionsInDatabase(database, basis.sessionKeys, basis.liveTopology).digest === basis.digest;
}
/** Mutation ownership cannot discard undecodable retained rows as presentation readers do. */
function hasSubagentSessionOwnerInDatabase(database, sessionKey) {
	return executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("subagent_runs").select("run_id").where((eb) => eb.or([
		eb("child_session_key", "=", sessionKey),
		eb("requester_session_key", "=", sessionKey),
		eb("controller_session_key", "=", sessionKey)
	])).limit(1)).rows.length > 0;
}
//#endregion
export { sanitizeAgentRunTerminalReplyText as $, rememberSubagentRunVersion as A, hasRetainedRequiredCompletionDelivery as B, latestSubagentRun as C, matchesSubagentChildSessionOwner as D, retainSubagentRunRuntimeOwner as E, completeRequesterSettleWakeState as F, normalizeSubagentRunState as G, isDeliverySuspended as H, consumeSubagentPauseNotice as I, resetRequesterSettleWakeRetry as J, projectSubagentRunForMaintenance as K, ensureCompletionState as L, subagentRunRecordVersion as M, clearDeliveryState as N, bindSubagentRunRecord as O, clearSubagentPendingDelivery as P, normalizeAgentRunTerminalReplySnapshot as Q, ensureDeliveryState as R, isSameSubagentRunOwner as S, recordLatestSubagentRun as T, loadPendingFinalDeliveryPayload as U, isCompletedRequesterDeliveryBlocked as V, markRequesterSettleWakePending as W, buildAgentRunTerminalReplySnapshot as X, transitionRequesterSettleWakeState as Y, mergeAgentRunTerminalReplySnapshot as Z, currentSubagentRunOrObserved as _, loadSubagentRunsForControllerFromSqlite as a, isQueuedSubagentRunRekey as b, subagentMaintenanceDurableBasisMatches as c, collectSubagentSessionReadKeys as d, formatAgentRunRouteChange as et, buildSubagentRunReadTopology as f, copySubagentRunRuntimeOwner as g, compareSubagentRunGeneration as h, loadSubagentRunsForChildSessionFromSqlite as i, rowToSubagentRunRecord as j, parseSubagentRegistryWriteReceipt as k, subagentRunsDurableBasisMatches as l, bindSubagentRunRuntimeKey as m, loadSubagentMaintenanceRunsFromSqlite as n, normalizeAgentRunTerminalReceipt as nt, readSubagentRun as o, resolveControllerSessionKey as p, projectSubagentRunForSessionList as q, loadSubagentRegistryFromSqlite as r, readSubagentRunRow as s, hasSubagentSessionOwnerInDatabase as t, normalizeAgentRunRouteChange as tt, SubagentSessionReadLookup as u, getSubagentRunIdentity as v, nextSubagentRunGeneration as w, isSameSubagentRun as x, getSubagentRunRuntimeKey as y, getDeliveryLastError as z };

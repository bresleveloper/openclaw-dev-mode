import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync, i as openOpenClawStateDatabase, n as closeOpenClawStateDatabase, o as runOpenClawStateWriteTransaction } from "./openclaw-state-db-gblCDNfo.js";
import { c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { p as onAgentEvent } from "./agent-events-7y1r8HOP.js";
import { t as normalizeSqliteNumber } from "./sqlite-number-CklSB049.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-D36KNc_D.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-DleKV4yQ.js";
import "./message-channel-B4LS2Kcc.js";
import { t as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-D2FNsPKZ.js";
import { n as shouldRouteCompletionThroughRequesterSession } from "./completion-delivery-policy-BGTs65q8.js";
import { o as requestHeartbeat } from "./heartbeat-wake-Vi0-QIbj.js";
import { a as enqueueSystemEvent } from "./system-events-DNR0hK3x.js";
import { a as sanitizeTaskStatusText, i as formatTaskStatusTitleText } from "./task-status-Df6f9W0E.js";
import { n as resolveTaskCleanupAfter } from "./task-retention-BOrZlyGy.js";
import { createRequire } from "node:module";
import crypto from "node:crypto";
//#region src/tasks/cron-task-cancel.ts
const activeCronTaskRunsByRunId = /* @__PURE__ */ new Map();
const settlingCronTaskRuns = /* @__PURE__ */ new Map();
const DEFAULT_CRON_TASK_RUN_DRAIN_POLL_MS = 25;
const CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS = 6e4;
function startActiveCronTaskRunSettlementGrace() {
	for (const [promise, entry] of settlingCronTaskRuns) {
		if (entry.retirementTimer) continue;
		const retirementTimer = setTimeout(() => {
			settlingCronTaskRuns.delete(promise);
		}, CRON_TASK_RUN_SETTLEMENT_TRACKING_MAX_MS);
		retirementTimer.unref?.();
		entry.retirementTimer = retirementTimer;
	}
}
function registerActiveCronTaskRun(params) {
	const runId = params.runId?.trim();
	if (!runId) return;
	activeCronTaskRunsByRunId.set(runId, {
		controller: params.controller,
		onCancel: params.onCancel
	});
	return () => {
		if (activeCronTaskRunsByRunId.get(runId)?.controller === params.controller) activeCronTaskRunsByRunId.delete(runId);
	};
}
function abortActiveCronTaskRuns(reason = "Gateway restarting.") {
	let aborted = 0;
	for (const handle of activeCronTaskRunsByRunId.values()) {
		if (handle.controller.signal.aborted) continue;
		handle.controller.abort(reason);
		handle.onCancel?.(reason);
		aborted += 1;
	}
	if (aborted > 0) startActiveCronTaskRunSettlementGrace();
	return aborted;
}
function trackActiveCronTaskRunSettlement(promise) {
	settlingCronTaskRuns.set(promise, {});
	promise.catch(() => void 0).finally(() => {
		const entry = settlingCronTaskRuns.get(promise);
		if (entry?.retirementTimer) clearTimeout(entry.retirementTimer);
		settlingCronTaskRuns.delete(promise);
	});
}
function retireActiveCronTaskRunTracking() {
	activeCronTaskRunsByRunId.clear();
	for (const entry of settlingCronTaskRuns.values()) if (entry.retirementTimer) clearTimeout(entry.retirementTimer);
	settlingCronTaskRuns.clear();
}
async function waitForActiveCronTaskRuns(timeoutMs) {
	const deadline = Date.now() + Math.max(0, Math.floor(timeoutMs));
	while ((activeCronTaskRunsByRunId.size > 0 || settlingCronTaskRuns.size > 0) && Date.now() < deadline) await new Promise((resolve) => {
		setTimeout(resolve, DEFAULT_CRON_TASK_RUN_DRAIN_POLL_MS);
	});
	return {
		drained: activeCronTaskRunsByRunId.size === 0 && settlingCronTaskRuns.size === 0,
		active: activeCronTaskRunsByRunId.size + settlingCronTaskRuns.size
	};
}
function cancelActiveCronTaskRun(params) {
	const runId = params.runId?.trim();
	if (!runId) return false;
	const handle = activeCronTaskRunsByRunId.get(runId);
	if (!handle) return false;
	if (handle.controller.signal.aborted) return false;
	const reason = params.reason?.trim() || "Cancelled by operator.";
	handle.controller.abort(reason);
	handle.onCancel?.(reason);
	startActiveCronTaskRunSettlementGrace();
	return true;
}
const CHILDLESS_NATIVE_SUBAGENT_DEFINITIONS = [{
	taskKind: "codex-native",
	runIdPrefix: "codex-thread:"
}, {
	taskKind: "copilot-native",
	runIdPrefix: "copilot-agent:"
}];
function resolveChildlessNativeSubagentTaskDefinition(task) {
	if (task.runtime !== "subagent" || task.childSessionKey?.trim()) return;
	return CHILDLESS_NATIVE_SUBAGENT_DEFINITIONS.find((definition) => task.taskKind === definition.taskKind && [task.sourceId, task.runId].some((candidate) => candidate?.trim().startsWith(definition.runIdPrefix)));
}
function isChildlessNativeSubagentTask(task) {
	return resolveChildlessNativeSubagentTaskDefinition(task) !== void 0;
}
//#endregion
//#region src/tasks/task-executor-policy.ts
/** Returns whether a task status is terminal for delivery and retention policy. */
function isTerminalTaskStatus(status) {
	return status === "succeeded" || status === "failed" || status === "timed_out" || status === "cancelled" || status === "lost";
}
function resolveTaskDisplayTitle(task) {
	return formatTaskStatusTitleText(task.label?.trim() || (task.runtime === "acp" ? "ACP background task" : task.runtime === "subagent" ? "Subagent task" : task.task.trim() || "Background task"));
}
function resolveTaskRunLabel(task) {
	return task.runId ? ` (run ${task.runId.slice(0, 8)})` : "";
}
function formatTaskTerminalMessage(task, options = {}) {
	const title = resolveTaskDisplayTitle(task);
	const runLabel = resolveTaskRunLabel(task);
	const summary = sanitizeTaskStatusText(task.terminalSummary, { errorContext: task.status !== "succeeded" || task.terminalOutcome === "blocked" });
	if (task.status === "succeeded") {
		if (task.terminalOutcome === "blocked") return summary ? `Background task blocked: ${title}${runLabel}. ${summary}` : `Background task blocked: ${title}${runLabel}.`;
		if (options.surface === "parent_session") {
			const reviewNext = "Next: parent will review/verify before calling it done.";
			return summary ? `Background task ready for review: ${title}${runLabel}. ${summary} ${reviewNext}` : `Background task ready for review: ${title}${runLabel}. ${reviewNext}`;
		}
		return summary ? `Background task done: ${title}${runLabel}. ${summary}` : `Background task done: ${title}${runLabel}.`;
	}
	if (task.status === "timed_out") return `Background task timed out: ${title}${runLabel}.`;
	if (task.status === "lost") {
		const error = sanitizeTaskStatusText(task.error, { errorContext: true });
		const fallbackSummary = sanitizeTaskStatusText(task.terminalSummary, { errorContext: true });
		return `Background task lost: ${title}${runLabel}. ${error || fallbackSummary || "Backing session disappeared."}`;
	}
	if (task.status === "cancelled") return `Background task cancelled: ${title}${runLabel}.`;
	const error = sanitizeTaskStatusText(task.error, { errorContext: true });
	const fallbackSummary = sanitizeTaskStatusText(task.terminalSummary, { errorContext: true });
	return error ? `Background task failed: ${title}${runLabel}. ${error}` : fallbackSummary ? `Background task failed: ${title}${runLabel}. ${fallbackSummary}` : `Background task failed: ${title}${runLabel}.`;
}
function shouldUseParentReviewTaskTerminalMessage(task) {
	return task.runtime === "acp" && task.status === "succeeded" && task.terminalOutcome !== "blocked" && Boolean(task.childSessionKey?.trim());
}
function formatTaskBlockedFollowupMessage(task) {
	if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return null;
	return `Task needs follow-up: ${resolveTaskDisplayTitle(task)}${resolveTaskRunLabel(task)}. ${sanitizeTaskStatusText(task.terminalSummary, { errorContext: true }) || "Task is blocked and needs follow-up."}`;
}
function formatTaskStateChangeMessage(task, event) {
	const title = resolveTaskDisplayTitle(task);
	if (event.kind === "running") return `Background task started: ${title}.`;
	if (event.kind === "progress") {
		const summary = sanitizeTaskStatusText(event.summary);
		return summary ? `Background task update: ${title}. ${summary}` : null;
	}
	return null;
}
function shouldAutoDeliverTaskTerminalUpdate(task) {
	if (task.notifyPolicy === "silent") return false;
	if (task.runtime === "subagent" && task.status !== "cancelled") return false;
	if (!isTerminalTaskStatus(task.status)) return false;
	return task.deliveryStatus === "pending";
}
function shouldAutoDeliverTaskStateChange(task) {
	return task.notifyPolicy === "state_changes" && task.deliveryStatus === "pending" && !isTerminalTaskStatus(task.status);
}
function shouldSuppressDuplicateTerminalDelivery(params) {
	if (params.task.runtime !== "acp" || !params.task.runId?.trim()) return false;
	return Boolean(params.preferredTaskId && params.preferredTaskId !== params.task.taskId);
}
//#endregion
//#region src/tasks/task-flow-registry.types.ts
const TASK_FLOW_SYNC_MODES = new Set(["task_mirrored", "managed"]);
const TASK_FLOW_STATUSES = new Set([
	"queued",
	"running",
	"waiting",
	"blocked",
	"succeeded",
	"failed",
	"cancelled",
	"lost"
]);
function parsePersistedFlowValue(value, values, label) {
	if (typeof value === "string" && values.has(value)) return value;
	throw new Error(`Invalid persisted task flow ${label}: ${JSON.stringify(value)}`);
}
function parseOptionalTaskFlowSyncMode(value) {
	if (value == null || value === "") return;
	return parsePersistedFlowValue(value, TASK_FLOW_SYNC_MODES, "sync mode");
}
function parseTaskFlowStatus(value) {
	return parsePersistedFlowValue(value, TASK_FLOW_STATUSES, "status");
}
//#endregion
//#region src/tasks/task-registry.sqlite.shared.ts
function parseSqliteJsonValue(raw) {
	if (!raw?.trim()) return;
	try {
		return JSON.parse(raw);
	} catch {
		return;
	}
}
function parseDeliveryContextJson(raw) {
	const parsed = parseSqliteJsonValue(raw);
	if (!isRecord(parsed)) return;
	return normalizeDeliveryContext({
		channel: typeof parsed.channel === "string" ? parsed.channel : void 0,
		to: typeof parsed.to === "string" ? parsed.to : void 0,
		accountId: typeof parsed.accountId === "string" ? parsed.accountId : void 0,
		threadId: typeof parsed.threadId === "string" || typeof parsed.threadId === "number" ? parsed.threadId : void 0
	});
}
//#endregion
//#region src/tasks/task-registry.types.ts
const TASK_RUNTIMES = new Set([
	"subagent",
	"acp",
	"cli",
	"cron"
]);
const TASK_STATUSES = new Set([
	"queued",
	"running",
	"succeeded",
	"failed",
	"timed_out",
	"cancelled",
	"lost"
]);
const TASK_DELIVERY_STATUSES = new Set([
	"pending",
	"delivered",
	"session_queued",
	"failed",
	"parent_missing",
	"not_applicable"
]);
const TASK_NOTIFY_POLICIES = new Set([
	"done_only",
	"state_changes",
	"silent"
]);
const TASK_TERMINAL_OUTCOMES = new Set(["succeeded", "blocked"]);
const TASK_SCOPE_KINDS = new Set(["session", "system"]);
function parsePersistedTaskValue(value, values, label) {
	if (typeof value === "string" && values.has(value)) return value;
	throw new Error(`Invalid persisted task ${label}: ${JSON.stringify(value)}`);
}
function parseTaskRuntime(value) {
	return parsePersistedTaskValue(value, TASK_RUNTIMES, "runtime");
}
function parseTaskStatus(value) {
	return parsePersistedTaskValue(value, TASK_STATUSES, "status");
}
function parseTaskDeliveryStatus(value) {
	return parsePersistedTaskValue(value, TASK_DELIVERY_STATUSES, "delivery status");
}
function parseTaskNotifyPolicy(value) {
	return parsePersistedTaskValue(value, TASK_NOTIFY_POLICIES, "notify policy");
}
function parseTaskScopeKind(value) {
	return parsePersistedTaskValue(value, TASK_SCOPE_KINDS, "scope kind");
}
function parseOptionalTaskTerminalOutcome(value) {
	if (value == null || value === "") return;
	return parsePersistedTaskValue(value, TASK_TERMINAL_OUTCOMES, "terminal outcome");
}
//#endregion
//#region src/tasks/task-flow-registry.store.sqlite.ts
let cachedDatabase$1 = null;
function serializeJson$1(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function parseJsonValue(raw) {
	if (!raw?.trim()) return;
	try {
		return JSON.parse(raw);
	} catch {
		return;
	}
}
function rowToSyncMode(row) {
	const syncMode = parseOptionalTaskFlowSyncMode(row.sync_mode);
	if (syncMode) return syncMode;
	return row.shape === "single_task" ? "task_mirrored" : "managed";
}
function rowToFlowRecord(row) {
	const endedAt = normalizeSqliteNumber(row.ended_at);
	const cancelRequestedAt = normalizeSqliteNumber(row.cancel_requested_at);
	const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
	const stateJson = parseJsonValue(row.state_json);
	const waitJson = parseJsonValue(row.wait_json);
	return {
		flowId: row.flow_id,
		syncMode: rowToSyncMode(row),
		ownerKey: row.owner_key,
		...requesterOrigin ? { requesterOrigin } : {},
		...row.controller_id ? { controllerId: row.controller_id } : {},
		revision: normalizeSqliteNumber(row.revision) ?? 0,
		status: parseTaskFlowStatus(row.status),
		notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
		goal: row.goal,
		...row.current_step ? { currentStep: row.current_step } : {},
		...row.blocked_task_id ? { blockedTaskId: row.blocked_task_id } : {},
		...row.blocked_summary ? { blockedSummary: row.blocked_summary } : {},
		...stateJson !== void 0 ? { stateJson } : {},
		...waitJson !== void 0 ? { waitJson } : {},
		...cancelRequestedAt != null ? { cancelRequestedAt } : {},
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		updatedAt: normalizeSqliteNumber(row.updated_at) ?? 0,
		...endedAt != null ? { endedAt } : {}
	};
}
function bindFlowRecord(record) {
	return {
		flow_id: record.flowId,
		sync_mode: record.syncMode,
		shape: null,
		owner_key: record.ownerKey,
		requester_origin_json: serializeJson$1(record.requesterOrigin),
		controller_id: record.controllerId ?? null,
		revision: record.revision,
		status: record.status,
		notify_policy: record.notifyPolicy,
		goal: record.goal,
		current_step: record.currentStep ?? null,
		blocked_task_id: record.blockedTaskId ?? null,
		blocked_summary: record.blockedSummary ?? null,
		state_json: serializeJson$1(record.stateJson),
		wait_json: serializeJson$1(record.waitJson),
		cancel_requested_at: record.cancelRequestedAt ?? null,
		created_at: record.createdAt,
		updated_at: record.updatedAt,
		ended_at: record.endedAt ?? null
	};
}
function getFlowRegistryKysely(db) {
	return getNodeSqliteKysely(db);
}
function pruneFlowsNotInSnapshot(params) {
	const tempTableName = "openclaw_live_flow_ids";
	params.db.exec(`CREATE TEMP TABLE IF NOT EXISTS ${tempTableName} (id TEXT PRIMARY KEY)`);
	params.db.exec(`DELETE FROM ${tempTableName}`);
	const insert = params.db.prepare(`INSERT OR IGNORE INTO ${tempTableName} (id) VALUES (?)`);
	for (const id of params.ids) insert.run(id);
	params.db.exec(`
    DELETE FROM flow_runs
    WHERE NOT EXISTS (
      SELECT 1 FROM ${tempTableName}
      WHERE ${tempTableName}.id = flow_runs.flow_id
    )
  `);
	params.db.exec(`DELETE FROM ${tempTableName}`);
}
function selectFlowRows(db) {
	return executeSqliteQuerySync(db, getFlowRegistryKysely(db).selectFrom("flow_runs").select([
		"flow_id",
		"sync_mode",
		"shape",
		"owner_key",
		"requester_origin_json",
		"controller_id",
		"revision",
		"status",
		"notify_policy",
		"goal",
		"current_step",
		"blocked_task_id",
		"blocked_summary",
		"state_json",
		"wait_json",
		"cancel_requested_at",
		"created_at",
		"updated_at",
		"ended_at"
	]).orderBy("created_at", "asc").orderBy("flow_id", "asc")).rows;
}
function upsertFlowRow(db, row) {
	executeSqliteQuerySync(db, getFlowRegistryKysely(db).insertInto("flow_runs").values(row).onConflict((conflict) => conflict.column("flow_id").doUpdateSet({
		sync_mode: (eb) => eb.ref("excluded.sync_mode"),
		owner_key: (eb) => eb.ref("excluded.owner_key"),
		requester_origin_json: (eb) => eb.ref("excluded.requester_origin_json"),
		controller_id: (eb) => eb.ref("excluded.controller_id"),
		revision: (eb) => eb.ref("excluded.revision"),
		status: (eb) => eb.ref("excluded.status"),
		notify_policy: (eb) => eb.ref("excluded.notify_policy"),
		goal: (eb) => eb.ref("excluded.goal"),
		current_step: (eb) => eb.ref("excluded.current_step"),
		blocked_task_id: (eb) => eb.ref("excluded.blocked_task_id"),
		blocked_summary: (eb) => eb.ref("excluded.blocked_summary"),
		state_json: (eb) => eb.ref("excluded.state_json"),
		wait_json: (eb) => eb.ref("excluded.wait_json"),
		cancel_requested_at: (eb) => eb.ref("excluded.cancel_requested_at"),
		created_at: (eb) => eb.ref("excluded.created_at"),
		updated_at: (eb) => eb.ref("excluded.updated_at"),
		ended_at: (eb) => eb.ref("excluded.ended_at")
	})));
}
function openFlowRegistryDatabase() {
	const database = openOpenClawStateDatabase();
	const pathname = database.path;
	if (cachedDatabase$1 && cachedDatabase$1.path === pathname && cachedDatabase$1.db.isOpen) return cachedDatabase$1;
	if (cachedDatabase$1 && !cachedDatabase$1.db.isOpen) cachedDatabase$1 = null;
	cachedDatabase$1 = {
		db: database.db,
		path: pathname
	};
	return cachedDatabase$1;
}
function withWriteTransaction$1(write) {
	const database = openFlowRegistryDatabase();
	runOpenClawStateWriteTransaction(() => {
		write(database);
	});
}
function loadTaskFlowRegistryStateFromSqlite() {
	const { db } = openFlowRegistryDatabase();
	const rows = selectFlowRows(db);
	return { flows: new Map(rows.map((row) => [row.flow_id, rowToFlowRecord(row)])) };
}
function saveTaskFlowRegistryStateToSqlite(snapshot) {
	withWriteTransaction$1(({ db }) => {
		const kysely = getFlowRegistryKysely(db);
		const flowIds = [...snapshot.flows.keys()];
		if (flowIds.length === 0) {
			executeSqliteQuerySync(db, kysely.deleteFrom("flow_runs"));
			return;
		}
		pruneFlowsNotInSnapshot({
			db,
			ids: flowIds
		});
		for (const flow of snapshot.flows.values()) upsertFlowRow(db, bindFlowRecord(flow));
	});
}
function upsertTaskFlowRegistryRecordToSqlite(flow) {
	withWriteTransaction$1(({ db }) => {
		upsertFlowRow(db, bindFlowRecord(flow));
	});
}
function deleteTaskFlowRegistryRecordFromSqlite(flowId) {
	withWriteTransaction$1(({ db }) => {
		executeSqliteQuerySync(db, getFlowRegistryKysely(db).deleteFrom("flow_runs").where("flow_id", "=", flowId));
	});
}
function closeTaskFlowRegistryDatabase() {
	cachedDatabase$1 = null;
	closeOpenClawStateDatabase();
}
let configuredFlowRegistryStore = {
	loadSnapshot: loadTaskFlowRegistryStateFromSqlite,
	saveSnapshot: saveTaskFlowRegistryStateToSqlite,
	upsertFlow: upsertTaskFlowRegistryRecordToSqlite,
	deleteFlow: deleteTaskFlowRegistryRecordFromSqlite,
	close: closeTaskFlowRegistryDatabase
};
let configuredFlowRegistryObservers = null;
function getTaskFlowRegistryStore() {
	return configuredFlowRegistryStore;
}
function getTaskFlowRegistryObservers() {
	return configuredFlowRegistryObservers;
}
//#endregion
//#region src/tasks/task-flow-registry.ts
const log$1 = createSubsystemLogger("tasks/task-flow-registry");
const flows = /* @__PURE__ */ new Map();
let restoreAttempted$1 = false;
let restoreFailureMessage = null;
function cloneStructuredValue(value) {
	if (value === void 0) return;
	return structuredClone(value);
}
function cloneFlowRecord(record) {
	return {
		...record,
		...record.requesterOrigin ? { requesterOrigin: cloneStructuredValue(record.requesterOrigin) } : {},
		...record.stateJson !== void 0 ? { stateJson: cloneStructuredValue(record.stateJson) } : {},
		...record.waitJson !== void 0 ? { waitJson: cloneStructuredValue(record.waitJson) } : {}
	};
}
function normalizeRestoredFlowRecord(record) {
	const syncMode = record.syncMode === "task_mirrored" ? "task_mirrored" : "managed";
	const controllerId = syncMode === "managed" ? normalizeOptionalString(record.controllerId) ?? "core/legacy-restored" : void 0;
	return {
		...record,
		syncMode,
		ownerKey: assertFlowOwnerKey(record.ownerKey),
		...record.requesterOrigin ? { requesterOrigin: cloneStructuredValue(record.requesterOrigin) } : {},
		...controllerId ? { controllerId } : {},
		currentStep: normalizeOptionalString(record.currentStep),
		blockedTaskId: normalizeOptionalString(record.blockedTaskId),
		blockedSummary: normalizeOptionalString(record.blockedSummary),
		...record.stateJson !== void 0 ? { stateJson: cloneStructuredValue(record.stateJson) } : {},
		...record.waitJson !== void 0 ? { waitJson: cloneStructuredValue(record.waitJson) } : {},
		revision: Math.max(0, record.revision),
		cancelRequestedAt: record.cancelRequestedAt ?? void 0,
		endedAt: record.endedAt ?? void 0
	};
}
function snapshotFlowRecords(source) {
	return [...source.values()].map((record) => cloneFlowRecord(record));
}
function emitFlowRegistryObserverEvent(createEvent) {
	const observers = getTaskFlowRegistryObservers();
	if (!observers?.onEvent) return;
	try {
		observers.onEvent(createEvent());
	} catch {}
}
function ensureNotifyPolicy$1(notifyPolicy) {
	return notifyPolicy ?? "done_only";
}
function normalizeJsonBlob(value) {
	return value === void 0 ? void 0 : cloneStructuredValue(value);
}
function assertFlowOwnerKey(ownerKey) {
	const normalized = normalizeOptionalString(ownerKey);
	if (!normalized) throw new Error("Flow ownerKey is required.");
	return normalized;
}
function assertControllerId(controllerId) {
	const normalized = normalizeOptionalString(controllerId);
	if (!normalized) throw new Error("Managed flow controllerId is required.");
	return normalized;
}
function resolveFlowBlockedSummary(task) {
	if (task.status !== "succeeded" || task.terminalOutcome !== "blocked") return;
	return normalizeOptionalString(task.terminalSummary) ?? normalizeOptionalString(task.progressSummary);
}
function deriveTaskFlowStatusFromTask(task) {
	if (task.status === "queued") return "queued";
	if (task.status === "running") return "running";
	if (task.status === "succeeded") return task.terminalOutcome === "blocked" ? "blocked" : "succeeded";
	if (task.status === "cancelled") return "cancelled";
	if (task.status === "lost") return "lost";
	return "failed";
}
function isTerminalTaskFlowStatus(status) {
	return status === "succeeded" || status === "blocked" || status === "failed" || status === "cancelled" || status === "lost";
}
function resolveTaskMirroredFlowTiming(task, isTerminal) {
	if (!isTerminal) return { updatedAt: task.lastEventAt ?? task.createdAt };
	const endedAt = task.endedAt ?? task.lastEventAt ?? task.createdAt;
	return {
		updatedAt: endedAt,
		endedAt
	};
}
function ensureFlowRegistryReady() {
	if (restoreAttempted$1) return;
	restoreAttempted$1 = true;
	try {
		const restored = getTaskFlowRegistryStore().loadSnapshot();
		flows.clear();
		for (const [flowId, flow] of restored.flows) flows.set(flowId, normalizeRestoredFlowRecord(flow));
		restoreFailureMessage = null;
	} catch (error) {
		flows.clear();
		restoreFailureMessage = formatErrorMessage(error);
		log$1.warn("Failed to restore task-flow registry", { error });
		return;
	}
	emitFlowRegistryObserverEvent(() => ({
		kind: "restored",
		flows: snapshotFlowRecords(flows)
	}));
}
function getTaskFlowRegistryRestoreFailure() {
	ensureFlowRegistryReady();
	return restoreFailureMessage;
}
function createFlowSnapshotWith(next, deletedFlowId) {
	const snapshot = new Map(snapshotFlowRecords(flows).map((flow) => [flow.flowId, flow]));
	if (deletedFlowId) snapshot.delete(deletedFlowId);
	if (next) snapshot.set(next.flowId, cloneFlowRecord(next));
	return snapshot;
}
function persistFlowUpsert(flow) {
	const store = getTaskFlowRegistryStore();
	if (store.upsertFlow) {
		store.upsertFlow(cloneFlowRecord(flow));
		return;
	}
	store.saveSnapshot({ flows: createFlowSnapshotWith(flow) });
}
function tryPersistFlowUpsert(flow, operation) {
	try {
		persistFlowUpsert(flow);
		return true;
	} catch (error) {
		log$1.warn("Failed to persist task-flow registry upsert", {
			operation,
			flowId: flow.flowId,
			error
		});
		return false;
	}
}
function persistFlowDelete(flowId) {
	const store = getTaskFlowRegistryStore();
	if (store.deleteFlow) {
		store.deleteFlow(flowId);
		return;
	}
	store.saveSnapshot({ flows: createFlowSnapshotWith(void 0, flowId) });
}
function tryPersistFlowDelete(flowId) {
	try {
		persistFlowDelete(flowId);
		return true;
	} catch (error) {
		log$1.warn("Failed to persist task-flow registry delete", {
			flowId,
			error
		});
		return false;
	}
}
function buildFlowRecord(params) {
	const now = params.createdAt ?? Date.now();
	const syncMode = params.syncMode ?? "managed";
	const controllerId = syncMode === "managed" ? assertControllerId(params.controllerId) : void 0;
	return {
		flowId: crypto.randomUUID(),
		syncMode,
		ownerKey: assertFlowOwnerKey(params.ownerKey),
		...params.requesterOrigin ? { requesterOrigin: cloneStructuredValue(params.requesterOrigin) } : {},
		...controllerId ? { controllerId } : {},
		revision: Math.max(0, params.revision ?? 0),
		status: params.status ?? "queued",
		notifyPolicy: ensureNotifyPolicy$1(params.notifyPolicy),
		goal: params.goal,
		currentStep: normalizeOptionalString(params.currentStep),
		blockedTaskId: normalizeOptionalString(params.blockedTaskId),
		blockedSummary: normalizeOptionalString(params.blockedSummary),
		...normalizeJsonBlob(params.stateJson) !== void 0 ? { stateJson: normalizeJsonBlob(params.stateJson) } : {},
		...normalizeJsonBlob(params.waitJson) !== void 0 ? { waitJson: normalizeJsonBlob(params.waitJson) } : {},
		...params.cancelRequestedAt != null ? { cancelRequestedAt: params.cancelRequestedAt } : {},
		createdAt: now,
		updatedAt: params.updatedAt ?? now,
		...params.endedAt != null ? { endedAt: params.endedAt } : {}
	};
}
function applyFlowPatch(current, patch) {
	const controllerId = patch.controllerId === void 0 ? current.controllerId : normalizeOptionalString(patch.controllerId);
	if (current.syncMode === "managed") assertControllerId(controllerId);
	return {
		...current,
		...patch.status ? { status: patch.status } : {},
		...patch.notifyPolicy ? { notifyPolicy: patch.notifyPolicy } : {},
		...patch.goal ? { goal: patch.goal } : {},
		controllerId,
		currentStep: patch.currentStep === void 0 ? current.currentStep : normalizeOptionalString(patch.currentStep),
		blockedTaskId: patch.blockedTaskId === void 0 ? current.blockedTaskId : normalizeOptionalString(patch.blockedTaskId),
		blockedSummary: patch.blockedSummary === void 0 ? current.blockedSummary : normalizeOptionalString(patch.blockedSummary),
		stateJson: patch.stateJson === void 0 ? current.stateJson : normalizeJsonBlob(patch.stateJson),
		waitJson: patch.waitJson === void 0 ? current.waitJson : normalizeJsonBlob(patch.waitJson),
		cancelRequestedAt: patch.cancelRequestedAt === void 0 ? current.cancelRequestedAt : patch.cancelRequestedAt ?? void 0,
		revision: current.revision + 1,
		updatedAt: patch.updatedAt ?? Date.now(),
		endedAt: patch.endedAt === void 0 ? current.endedAt : patch.endedAt ?? void 0
	};
}
function writeFlowRecord(next, previous) {
	if (!tryPersistFlowUpsert(next, previous ? "update" : "create")) return null;
	flows.set(next.flowId, next);
	emitFlowRegistryObserverEvent(() => ({
		kind: "upserted",
		flow: cloneFlowRecord(next),
		...previous ? { previous: cloneFlowRecord(previous) } : {}
	}));
	return cloneFlowRecord(next);
}
function createFlowRecord(params) {
	ensureFlowRegistryReady();
	return writeFlowRecord(buildFlowRecord(params));
}
function createManagedTaskFlow(params) {
	return createFlowRecord({
		...params,
		syncMode: "managed",
		controllerId: assertControllerId(params.controllerId)
	});
}
function createTaskFlowForTask(params) {
	const terminalFlowStatus = deriveTaskFlowStatusFromTask(params.task);
	const timing = resolveTaskMirroredFlowTiming(params.task, isTerminalTaskFlowStatus(terminalFlowStatus));
	return createFlowRecord({
		syncMode: "task_mirrored",
		ownerKey: params.task.ownerKey,
		requesterOrigin: params.requesterOrigin,
		status: terminalFlowStatus,
		notifyPolicy: params.task.notifyPolicy,
		goal: normalizeOptionalString(params.task.label) ?? (params.task.task.trim() || "Background task"),
		blockedTaskId: terminalFlowStatus === "blocked" ? normalizeOptionalString(params.task.taskId) : void 0,
		blockedSummary: resolveFlowBlockedSummary(params.task),
		createdAt: params.task.createdAt,
		updatedAt: timing.updatedAt,
		...timing.endedAt !== void 0 ? { endedAt: timing.endedAt } : {}
	});
}
function updateFlowRecordByIdUnchecked(flowId, patch) {
	ensureFlowRegistryReady();
	const current = flows.get(flowId);
	if (!current) return null;
	return writeFlowRecord(applyFlowPatch(current, patch), current);
}
function updateFlowRecordByIdExpectedRevision(params) {
	ensureFlowRegistryReady();
	const current = flows.get(params.flowId);
	if (!current) return {
		applied: false,
		reason: "not_found"
	};
	if (current.revision !== params.expectedRevision) return {
		applied: false,
		reason: "revision_conflict",
		current: cloneFlowRecord(current)
	};
	const flow = writeFlowRecord(applyFlowPatch(current, params.patch), current);
	if (!flow) return {
		applied: false,
		reason: "persist_failed",
		current: cloneFlowRecord(current)
	};
	return {
		applied: true,
		flow
	};
}
function setFlowWaiting(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: normalizeOptionalString(params.blockedTaskId) || normalizeOptionalString(params.blockedSummary) ? "blocked" : "waiting",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: params.waitJson,
			blockedTaskId: params.blockedTaskId,
			blockedSummary: params.blockedSummary,
			endedAt: null,
			updatedAt: params.updatedAt
		}
	});
}
function resumeFlow(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: params.status ?? "queued",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: null,
			blockedTaskId: null,
			blockedSummary: null,
			endedAt: null,
			updatedAt: params.updatedAt
		}
	});
}
function finishFlow(params) {
	const endedAt = params.endedAt ?? params.updatedAt ?? Date.now();
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: "succeeded",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: null,
			blockedTaskId: null,
			blockedSummary: null,
			endedAt,
			updatedAt: params.updatedAt ?? endedAt
		}
	});
}
function failFlow(params) {
	const endedAt = params.endedAt ?? params.updatedAt ?? Date.now();
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			status: "failed",
			currentStep: params.currentStep,
			stateJson: params.stateJson,
			waitJson: null,
			blockedTaskId: params.blockedTaskId,
			blockedSummary: params.blockedSummary,
			endedAt,
			updatedAt: params.updatedAt ?? endedAt
		}
	});
}
function requestFlowCancel(params) {
	return updateFlowRecordByIdExpectedRevision({
		flowId: params.flowId,
		expectedRevision: params.expectedRevision,
		patch: {
			cancelRequestedAt: params.cancelRequestedAt ?? params.updatedAt ?? Date.now(),
			updatedAt: params.updatedAt
		}
	});
}
function syncFlowFromTaskResult(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return {
		ok: true,
		flow: null
	};
	const flow = getTaskFlowById(flowId);
	if (!flow) return {
		ok: true,
		flow: null
	};
	if (flow.syncMode !== "task_mirrored") return {
		ok: true,
		flow
	};
	const terminalFlowStatus = deriveTaskFlowStatusFromTask(task);
	const isTerminal = isTerminalTaskFlowStatus(terminalFlowStatus);
	const timing = resolveTaskMirroredFlowTiming({
		createdAt: flow.createdAt,
		lastEventAt: task.lastEventAt,
		endedAt: task.endedAt
	}, isTerminal);
	const updated = updateFlowRecordByIdUnchecked(flowId, {
		status: terminalFlowStatus,
		notifyPolicy: task.notifyPolicy,
		goal: normalizeOptionalString(task.label) ?? (task.task.trim() || "Background task"),
		blockedTaskId: terminalFlowStatus === "blocked" ? task.taskId.trim() || null : null,
		blockedSummary: terminalFlowStatus === "blocked" ? resolveFlowBlockedSummary(task) ?? null : null,
		waitJson: null,
		updatedAt: timing.updatedAt,
		...isTerminal ? { endedAt: timing.endedAt ?? timing.updatedAt } : { endedAt: null }
	});
	if (!updated) return {
		ok: false,
		reason: "persist_failed",
		current: flow
	};
	return {
		ok: true,
		flow: updated
	};
}
function getTaskFlowById(flowId) {
	ensureFlowRegistryReady();
	const flow = flows.get(flowId);
	return flow ? cloneFlowRecord(flow) : void 0;
}
function listTaskFlowsForOwnerKey(ownerKey) {
	ensureFlowRegistryReady();
	const normalizedOwnerKey = ownerKey.trim();
	if (!normalizedOwnerKey) return [];
	return [...flows.values()].filter((flow) => flow.ownerKey.trim() === normalizedOwnerKey).map((flow) => cloneFlowRecord(flow)).toSorted((left, right) => right.createdAt - left.createdAt);
}
function findLatestTaskFlowForOwnerKey(ownerKey) {
	const flow = listTaskFlowsForOwnerKey(ownerKey)[0];
	return flow ? cloneFlowRecord(flow) : void 0;
}
function resolveTaskFlowForLookupToken(token) {
	const lookup = token.trim();
	if (!lookup) return;
	return getTaskFlowById(lookup) ?? findLatestTaskFlowForOwnerKey(lookup);
}
function listTaskFlowRecords() {
	ensureFlowRegistryReady();
	return [...flows.values()].map((flow) => cloneFlowRecord(flow)).toSorted((left, right) => right.createdAt - left.createdAt);
}
function deleteTaskFlowRecordById(flowId) {
	ensureFlowRegistryReady();
	const current = flows.get(flowId);
	if (!current) return false;
	if (!tryPersistFlowDelete(flowId)) return false;
	flows.delete(flowId);
	emitFlowRegistryObserverEvent(() => ({
		kind: "deleted",
		flowId,
		previous: cloneFlowRecord(current)
	}));
	return true;
}
//#endregion
//#region src/tasks/task-registry.process-state.ts
const TASK_REGISTRY_PROCESS_STATE_KEY = Symbol.for("openclaw.taskRegistry.state");
/** Returns the singleton in-process task registry state. */
function getTaskRegistryProcessState() {
	const globalState = globalThis;
	globalState[TASK_REGISTRY_PROCESS_STATE_KEY] ??= {
		tasks: /* @__PURE__ */ new Map(),
		taskDeliveryStates: /* @__PURE__ */ new Map(),
		taskIdsByRunId: /* @__PURE__ */ new Map(),
		taskIdsByOwnerKey: /* @__PURE__ */ new Map(),
		taskIdsByParentFlowId: /* @__PURE__ */ new Map(),
		taskIdsByRelatedSessionKey: /* @__PURE__ */ new Map(),
		tasksWithPendingDelivery: /* @__PURE__ */ new Set()
	};
	return globalState[TASK_REGISTRY_PROCESS_STATE_KEY];
}
//#endregion
//#region src/tasks/task-registry.store.sqlite.ts
const TASK_RUN_SELECT_COLUMNS = [
	"task_id",
	"runtime",
	"task_kind",
	"source_id",
	"requester_session_key",
	"owner_key",
	"scope_kind",
	"child_session_key",
	"parent_flow_id",
	"parent_task_id",
	"agent_id",
	"requester_agent_id",
	"run_id",
	"label",
	"task",
	"status",
	"delivery_status",
	"notify_policy",
	"created_at",
	"started_at",
	"ended_at",
	"last_event_at",
	"cleanup_after",
	"error",
	"progress_summary",
	"terminal_summary",
	"terminal_outcome"
];
let cachedDatabase = null;
function serializeJson(value) {
	return value == null ? null : JSON.stringify(value);
}
function rowToTaskRecord(row) {
	const startedAt = normalizeSqliteNumber(row.started_at);
	const endedAt = normalizeSqliteNumber(row.ended_at);
	const lastEventAt = normalizeSqliteNumber(row.last_event_at);
	const cleanupAfter = normalizeSqliteNumber(row.cleanup_after);
	const scopeKind = parseTaskScopeKind(row.scope_kind);
	const terminalOutcome = parseOptionalTaskTerminalOutcome(row.terminal_outcome);
	const requesterSessionKey = scopeKind === "system" ? "" : row.requester_session_key?.trim() || row.owner_key;
	return {
		taskId: row.task_id,
		runtime: parseTaskRuntime(row.runtime),
		...row.task_kind ? { taskKind: row.task_kind } : {},
		...row.source_id ? { sourceId: row.source_id } : {},
		requesterSessionKey,
		ownerKey: row.owner_key,
		scopeKind,
		...row.child_session_key ? { childSessionKey: row.child_session_key } : {},
		...row.parent_flow_id ? { parentFlowId: row.parent_flow_id } : {},
		...row.parent_task_id ? { parentTaskId: row.parent_task_id } : {},
		...row.agent_id ? { agentId: row.agent_id } : {},
		...row.requester_agent_id ? { requesterAgentId: row.requester_agent_id } : {},
		...row.run_id ? { runId: row.run_id } : {},
		...row.label ? { label: row.label } : {},
		task: row.task,
		status: parseTaskStatus(row.status),
		deliveryStatus: parseTaskDeliveryStatus(row.delivery_status),
		notifyPolicy: parseTaskNotifyPolicy(row.notify_policy),
		createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
		...startedAt != null ? { startedAt } : {},
		...endedAt != null ? { endedAt } : {},
		...lastEventAt != null ? { lastEventAt } : {},
		...cleanupAfter != null ? { cleanupAfter } : {},
		...row.error ? { error: row.error } : {},
		...row.progress_summary ? { progressSummary: row.progress_summary } : {},
		...row.terminal_summary ? { terminalSummary: row.terminal_summary } : {},
		...terminalOutcome ? { terminalOutcome } : {}
	};
}
function rowToTaskDeliveryState(row) {
	const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
	const lastNotifiedEventAt = normalizeSqliteNumber(row.last_notified_event_at);
	return {
		taskId: row.task_id,
		...requesterOrigin ? { requesterOrigin } : {},
		...lastNotifiedEventAt != null ? { lastNotifiedEventAt } : {}
	};
}
function bindTaskRecordBase(record) {
	return {
		task_id: record.taskId,
		runtime: record.runtime,
		task_kind: record.taskKind ?? null,
		source_id: record.sourceId ?? null,
		requester_session_key: record.scopeKind === "system" ? "" : record.requesterSessionKey,
		owner_key: record.ownerKey,
		scope_kind: record.scopeKind,
		child_session_key: record.childSessionKey ?? null,
		parent_flow_id: record.parentFlowId ?? null,
		parent_task_id: record.parentTaskId ?? null,
		agent_id: record.agentId ?? null,
		requester_agent_id: record.requesterAgentId ?? null,
		run_id: record.runId ?? null,
		label: record.label ?? null,
		task: record.task,
		status: record.status,
		delivery_status: record.deliveryStatus,
		notify_policy: record.notifyPolicy,
		created_at: record.createdAt,
		started_at: record.startedAt ?? null,
		ended_at: record.endedAt ?? null,
		last_event_at: record.lastEventAt ?? null,
		cleanup_after: record.cleanupAfter ?? null,
		error: record.error ?? null,
		progress_summary: record.progressSummary ?? null,
		terminal_summary: record.terminalSummary ?? null,
		terminal_outcome: record.terminalOutcome ?? null
	};
}
function bindTaskDeliveryState(state) {
	return {
		task_id: state.taskId,
		requester_origin_json: serializeJson(state.requesterOrigin),
		last_notified_event_at: state.lastNotifiedEventAt ?? null
	};
}
function getTaskRegistryKysely(db) {
	return getNodeSqliteKysely(db);
}
function pruneRowsNotInSnapshot(params) {
	params.db.exec(`CREATE TEMP TABLE IF NOT EXISTS ${params.tempTableName} (id TEXT PRIMARY KEY)`);
	params.db.exec(`DELETE FROM ${params.tempTableName}`);
	const insert = params.db.prepare(`INSERT OR IGNORE INTO ${params.tempTableName} (id) VALUES (?)`);
	for (const id of params.ids) insert.run(id);
	params.db.exec(`
    DELETE FROM ${params.tableName}
    WHERE NOT EXISTS (
      SELECT 1 FROM ${params.tempTableName}
      WHERE ${params.tempTableName}.id = ${params.tableName}.${params.columnName}
    )
  `);
	params.db.exec(`DELETE FROM ${params.tempTableName}`);
}
function selectTaskRows(db) {
	return executeSqliteQuerySync(db, getTaskRegistryKysely(db).selectFrom("task_runs").select(TASK_RUN_SELECT_COLUMNS).orderBy("created_at", "asc").orderBy("task_id", "asc")).rows;
}
function selectTaskDeliveryStateRows(db) {
	return executeSqliteQuerySync(db, getTaskRegistryKysely(db).selectFrom("task_delivery_state").select([
		"task_id",
		"requester_origin_json",
		"last_notified_event_at"
	]).orderBy("task_id", "asc")).rows;
}
function upsertTaskRow(db, row) {
	executeSqliteQuerySync(db, getTaskRegistryKysely(db).insertInto("task_runs").values(row).onConflict((conflict) => conflict.column("task_id").doUpdateSet({
		runtime: (eb) => eb.ref("excluded.runtime"),
		task_kind: (eb) => eb.ref("excluded.task_kind"),
		source_id: (eb) => eb.ref("excluded.source_id"),
		requester_session_key: (eb) => eb.ref("excluded.requester_session_key"),
		owner_key: (eb) => eb.ref("excluded.owner_key"),
		scope_kind: (eb) => eb.ref("excluded.scope_kind"),
		child_session_key: (eb) => eb.ref("excluded.child_session_key"),
		parent_flow_id: (eb) => eb.ref("excluded.parent_flow_id"),
		parent_task_id: (eb) => eb.ref("excluded.parent_task_id"),
		agent_id: (eb) => eb.ref("excluded.agent_id"),
		requester_agent_id: (eb) => eb.ref("excluded.requester_agent_id"),
		run_id: (eb) => eb.ref("excluded.run_id"),
		label: (eb) => eb.ref("excluded.label"),
		task: (eb) => eb.ref("excluded.task"),
		status: (eb) => eb.ref("excluded.status"),
		delivery_status: (eb) => eb.ref("excluded.delivery_status"),
		notify_policy: (eb) => eb.ref("excluded.notify_policy"),
		created_at: (eb) => eb.ref("excluded.created_at"),
		started_at: (eb) => eb.ref("excluded.started_at"),
		ended_at: (eb) => eb.ref("excluded.ended_at"),
		last_event_at: (eb) => eb.ref("excluded.last_event_at"),
		cleanup_after: (eb) => eb.ref("excluded.cleanup_after"),
		error: (eb) => eb.ref("excluded.error"),
		progress_summary: (eb) => eb.ref("excluded.progress_summary"),
		terminal_summary: (eb) => eb.ref("excluded.terminal_summary"),
		terminal_outcome: (eb) => eb.ref("excluded.terminal_outcome")
	})));
}
function replaceTaskDeliveryStateRow(db, row) {
	executeSqliteQuerySync(db, getTaskRegistryKysely(db).insertInto("task_delivery_state").values(row).onConflict((conflict) => conflict.column("task_id").doUpdateSet({
		requester_origin_json: (eb) => eb.ref("excluded.requester_origin_json"),
		last_notified_event_at: (eb) => eb.ref("excluded.last_notified_event_at")
	})));
}
function deleteTaskRowsWithDeliveryState(db, taskId) {
	const kysely = getTaskRegistryKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state").where("task_id", "=", taskId));
	executeSqliteQuerySync(db, kysely.deleteFrom("task_runs").where("task_id", "=", taskId));
}
function openTaskRegistryDatabase() {
	const database = openOpenClawStateDatabase();
	const pathname = database.path;
	if (cachedDatabase && cachedDatabase.path === pathname && cachedDatabase.db.isOpen) return cachedDatabase;
	if (cachedDatabase && !cachedDatabase.db.isOpen) cachedDatabase = null;
	cachedDatabase = {
		db: database.db,
		path: pathname
	};
	return cachedDatabase;
}
function withWriteTransaction(write) {
	const database = openTaskRegistryDatabase();
	runOpenClawStateWriteTransaction(() => {
		write(database);
	});
}
function loadTaskRegistryStateFromSqlite() {
	const { db } = openTaskRegistryDatabase();
	const taskRows = selectTaskRows(db);
	const deliveryRows = selectTaskDeliveryStateRows(db);
	return {
		tasks: new Map(taskRows.map((row) => [row.task_id, rowToTaskRecord(row)])),
		deliveryStates: new Map(deliveryRows.map((row) => [row.task_id, rowToTaskDeliveryState(row)]))
	};
}
function listTaskRegistryRecordsByOwnerKeyFromSqlite(ownerKey) {
	const key = ownerKey.trim();
	if (!key) return [];
	const { db } = openTaskRegistryDatabase();
	return executeSqliteQuerySync(db, getTaskRegistryKysely(db).selectFrom("task_runs").select(TASK_RUN_SELECT_COLUMNS).where("owner_key", "=", key).orderBy("created_at", "asc").orderBy("task_id", "asc")).rows.map(rowToTaskRecord);
}
function saveTaskRegistryStateToSqlite(snapshot) {
	withWriteTransaction(({ db }) => {
		const kysely = getTaskRegistryKysely(db);
		const taskIds = [...snapshot.tasks.keys()];
		if (taskIds.length === 0) {
			executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state"));
			executeSqliteQuerySync(db, kysely.deleteFrom("task_runs"));
			return;
		}
		pruneRowsNotInSnapshot({
			db,
			tableName: "task_runs",
			columnName: "task_id",
			tempTableName: "openclaw_live_task_run_ids",
			ids: taskIds
		});
		const deliveryTaskIds = [...snapshot.deliveryStates.keys()];
		if (deliveryTaskIds.length === 0) executeSqliteQuerySync(db, kysely.deleteFrom("task_delivery_state"));
		else pruneRowsNotInSnapshot({
			db,
			tableName: "task_delivery_state",
			columnName: "task_id",
			tempTableName: "openclaw_live_task_delivery_ids",
			ids: deliveryTaskIds
		});
		for (const task of snapshot.tasks.values()) upsertTaskRow(db, bindTaskRecordBase(task));
		for (const state of snapshot.deliveryStates.values()) replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
	});
}
function upsertTaskRegistryRecordToSqlite(task) {
	withWriteTransaction(({ db }) => {
		upsertTaskRow(db, bindTaskRecordBase(task));
	});
}
function upsertTaskWithDeliveryStateToSqlite(params) {
	withWriteTransaction(({ db }) => {
		upsertTaskRow(db, bindTaskRecordBase(params.task));
		if (params.deliveryState) replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(params.deliveryState));
		else executeSqliteQuerySync(db, getTaskRegistryKysely(db).deleteFrom("task_delivery_state").where("task_id", "=", params.task.taskId));
	});
}
function deleteTaskRegistryRecordFromSqlite(taskId) {
	withWriteTransaction(({ db }) => {
		deleteTaskRowsWithDeliveryState(db, taskId);
	});
}
function deleteTaskAndDeliveryStateFromSqlite(taskId) {
	withWriteTransaction(({ db }) => {
		deleteTaskRowsWithDeliveryState(db, taskId);
	});
}
function upsertTaskDeliveryStateToSqlite(state) {
	withWriteTransaction(({ db }) => {
		replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
	});
}
function deleteTaskDeliveryStateFromSqlite(taskId) {
	withWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getTaskRegistryKysely(db).deleteFrom("task_delivery_state").where("task_id", "=", taskId));
	});
}
function closeTaskRegistryDatabase() {
	cachedDatabase = null;
	closeOpenClawStateDatabase();
}
let configuredTaskRegistryStore = {
	loadSnapshot: loadTaskRegistryStateFromSqlite,
	saveSnapshot: saveTaskRegistryStateToSqlite,
	listTasksForOwnerKey: listTaskRegistryRecordsByOwnerKeyFromSqlite,
	upsertTaskWithDeliveryState: upsertTaskWithDeliveryStateToSqlite,
	upsertTask: upsertTaskRegistryRecordToSqlite,
	deleteTaskWithDeliveryState: deleteTaskAndDeliveryStateFromSqlite,
	deleteTask: deleteTaskRegistryRecordFromSqlite,
	upsertDeliveryState: upsertTaskDeliveryStateToSqlite,
	deleteDeliveryState: deleteTaskDeliveryStateFromSqlite,
	close: closeTaskRegistryDatabase
};
let configuredTaskRegistryObservers = null;
function getTaskRegistryStore() {
	return configuredTaskRegistryStore;
}
function getTaskRegistryObservers() {
	return configuredTaskRegistryObservers;
}
//#endregion
//#region src/tasks/task-registry.ts
const log = createSubsystemLogger("tasks/registry");
const TASK_FLOW_SYNC_RETRY_DELAYS_MS = [
	1e3,
	5e3,
	25e3,
	12e4,
	6e5
];
const taskRegistryProcessState = getTaskRegistryProcessState();
const tasks = taskRegistryProcessState.tasks;
const taskDeliveryStates = taskRegistryProcessState.taskDeliveryStates;
const taskIdsByRunId = taskRegistryProcessState.taskIdsByRunId;
const taskIdsByOwnerKey = taskRegistryProcessState.taskIdsByOwnerKey;
const taskIdsByParentFlowId = taskRegistryProcessState.taskIdsByParentFlowId;
const taskIdsByRelatedSessionKey = taskRegistryProcessState.taskIdsByRelatedSessionKey;
const tasksWithPendingDelivery = taskRegistryProcessState.tasksWithPendingDelivery;
let listenerStarted = false;
let restoreAttempted = false;
const taskFlowSyncRetryTimers = /* @__PURE__ */ new Map();
const TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY = Symbol.for("openclaw.taskRegistry.deliveryRuntimeOverride");
const TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY = Symbol.for("openclaw.taskRegistry.controlRuntimeOverride");
const require = createRequire(import.meta.url);
const TASK_REGISTRY_CONTROL_RUNTIME_CANDIDATES = ["./task-registry-control.runtime.js", "./task-registry-control.runtime.ts"];
let deliveryRuntimePromise = null;
let controlRuntimePromise = null;
var ParentFlowLinkError = class extends Error {
	constructor(code, message, details) {
		super(message);
		this.code = code;
		this.details = details;
		this.name = "ParentFlowLinkError";
	}
};
function isParentFlowLinkError(error) {
	return error instanceof ParentFlowLinkError;
}
function isActiveTaskStatus(status) {
	return status === "queued" || status === "running";
}
function isTerminalFlowStatus(status) {
	return status === "succeeded" || status === "failed" || status === "cancelled" || status === "lost";
}
function assertTaskOwner(params) {
	if (!params.ownerKey.trim() && params.scopeKind !== "system") throw new Error("Task ownerKey is required.");
}
function assertParentFlowLinkAllowed(params) {
	const flowId = params.parentFlowId?.trim();
	if (!flowId) return;
	if (params.scopeKind !== "session") throw new ParentFlowLinkError("scope_kind_not_session", "Only session-scoped tasks can link to flows.", { flowId });
	const flow = getTaskFlowById(flowId);
	if (!flow) throw new ParentFlowLinkError("parent_flow_not_found", `Parent flow not found: ${flowId}`, { flowId });
	if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(params.ownerKey)) throw new ParentFlowLinkError("owner_key_mismatch", "Task ownerKey must match parent flow ownerKey.", { flowId });
	if (flow.cancelRequestedAt != null) throw new ParentFlowLinkError("cancel_requested", "Parent flow cancellation has already been requested.", {
		flowId,
		status: flow.status
	});
	if (isTerminalFlowStatus(flow.status)) throw new ParentFlowLinkError("terminal", `Parent flow is already ${flow.status}.`, {
		flowId,
		status: flow.status
	});
}
function cloneTaskRecord(record) {
	return { ...record };
}
function normalizeTaskTimestamps(task) {
	let createdAt = task.createdAt;
	for (const candidate of [
		task.startedAt,
		task.lastEventAt,
		task.endedAt
	]) if (typeof candidate === "number" && candidate < createdAt) createdAt = candidate;
	const startedAt = typeof task.startedAt === "number" ? Math.max(task.startedAt, createdAt) : task.startedAt;
	const lastEventAt = typeof task.lastEventAt === "number" ? Math.max(task.lastEventAt, startedAt ?? createdAt) : task.lastEventAt;
	const endedAt = typeof task.endedAt === "number" ? Math.max(task.endedAt, startedAt ?? createdAt) : task.endedAt;
	if (createdAt === task.createdAt && startedAt === task.startedAt && lastEventAt === task.lastEventAt && endedAt === task.endedAt) return task;
	const normalized = {
		...task,
		createdAt
	};
	if (typeof startedAt === "number") normalized.startedAt = startedAt;
	if (typeof lastEventAt === "number") normalized.lastEventAt = lastEventAt;
	if (typeof endedAt === "number") normalized.endedAt = endedAt;
	return normalized;
}
function cloneTaskDeliveryState(state) {
	return {
		...state,
		...state.requesterOrigin ? { requesterOrigin: { ...state.requesterOrigin } } : {}
	};
}
function snapshotTaskRecords(source) {
	return [...source.values()].map((record) => cloneTaskRecord(record));
}
function emitTaskRegistryObserverEvent(createEvent) {
	const observers = getTaskRegistryObservers();
	if (!observers?.onEvent) return;
	try {
		observers.onEvent(createEvent());
	} catch (error) {
		log.warn("Task registry observer failed", {
			event: "task-registry",
			error
		});
	}
}
function persistTaskUpsert(task, pendingDeliveryState) {
	const store = getTaskRegistryStore();
	const deliveryState = pendingDeliveryState ?? taskDeliveryStates.get(task.taskId);
	if (store.upsertTaskWithDeliveryState) {
		store.upsertTaskWithDeliveryState({
			task,
			...deliveryState ? { deliveryState } : {}
		});
		return;
	}
	if (!deliveryState && store.upsertTask) {
		store.upsertTask(task);
		return;
	}
	store.saveSnapshot({
		tasks: new Map(tasks).set(task.taskId, task),
		deliveryStates: deliveryState ? new Map(taskDeliveryStates).set(task.taskId, deliveryState) : taskDeliveryStates
	});
}
function tryPersistTaskUpsert(task, operation, pendingDeliveryState) {
	try {
		persistTaskUpsert(task, pendingDeliveryState);
		return true;
	} catch (error) {
		log.warn("Failed to persist task registry upsert", {
			operation,
			taskId: task.taskId,
			runId: task.runId,
			error
		});
		return false;
	}
}
function persistTaskDelete(taskId) {
	const store = getTaskRegistryStore();
	if (store.deleteTaskWithDeliveryState) {
		store.deleteTaskWithDeliveryState(taskId);
		return;
	}
	const projectedTasks = new Map(tasks);
	projectedTasks.delete(taskId);
	const projectedDeliveryStates = new Map(taskDeliveryStates);
	projectedDeliveryStates.delete(taskId);
	store.saveSnapshot({
		tasks: projectedTasks,
		deliveryStates: projectedDeliveryStates
	});
}
function tryPersistTaskDelete(taskId) {
	try {
		persistTaskDelete(taskId);
		return true;
	} catch (error) {
		log.warn("Failed to persist task registry delete", {
			taskId,
			error
		});
		return false;
	}
}
function persistTaskDeliveryStateUpsert(state) {
	const store = getTaskRegistryStore();
	if (store.upsertDeliveryState) {
		store.upsertDeliveryState(state);
		return;
	}
	const projectedDeliveryStates = new Map(taskDeliveryStates);
	projectedDeliveryStates.set(state.taskId, cloneTaskDeliveryState(state));
	store.saveSnapshot({
		tasks,
		deliveryStates: projectedDeliveryStates
	});
}
function tryPersistTaskDeliveryStateUpsert(state) {
	try {
		persistTaskDeliveryStateUpsert(state);
		return true;
	} catch (error) {
		log.warn("Failed to persist task delivery state", {
			taskId: state.taskId,
			error
		});
		return false;
	}
}
function clearTaskRegistryMemory() {
	clearTaskFlowSyncRetries();
	tasks.clear();
	taskDeliveryStates.clear();
	taskIdsByRunId.clear();
	taskIdsByOwnerKey.clear();
	taskIdsByParentFlowId.clear();
	taskIdsByRelatedSessionKey.clear();
	tasksWithPendingDelivery.clear();
}
function ensureDeliveryStatus(params) {
	if (params.scopeKind === "system") return "not_applicable";
	return params.ownerKey.trim() ? "pending" : "parent_missing";
}
function ensureNotifyPolicy(params) {
	if (params.notifyPolicy) return params.notifyPolicy;
	return (params.deliveryStatus ?? ensureDeliveryStatus({
		ownerKey: params.ownerKey,
		scopeKind: params.scopeKind
	})) === "not_applicable" ? "silent" : "done_only";
}
function resolveTaskScopeKind(params) {
	if (params.scopeKind) return params.scopeKind;
	return params.requesterSessionKey.trim() ? "session" : "system";
}
function resolveTaskRequesterSessionKey(params) {
	const requesterSessionKey = params.requesterSessionKey?.trim();
	if (requesterSessionKey) return requesterSessionKey;
	if (params.scopeKind === "system") return "";
	return params.ownerKey?.trim() ?? "";
}
function resolveTaskOwnerKey(params) {
	return params.ownerKey?.trim() || params.requesterSessionKey.trim();
}
function normalizeTaskSummary(value) {
	return value?.replace(/\s+/g, " ").trim() || void 0;
}
function normalizeTaskStatus(value) {
	return value === "running" || value === "queued" || value === "succeeded" || value === "failed" || value === "timed_out" || value === "cancelled" || value === "lost" ? value : "queued";
}
function normalizeTaskTerminalOutcome(value) {
	return value === "succeeded" || value === "blocked" ? value : void 0;
}
function shouldApplyRunScopedStatusUpdate(params) {
	if (params.currentStatus === params.nextStatus) return true;
	if (!isTerminalTaskStatus(params.currentStatus)) return true;
	if (!isTerminalTaskStatus(params.nextStatus)) return false;
	return params.currentStatus === "succeeded" && params.nextStatus !== "lost";
}
function resolveTaskTerminalOutcome(params) {
	const normalized = normalizeTaskTerminalOutcome(params.terminalOutcome);
	if (normalized) return normalized;
	return params.status === "succeeded" ? "succeeded" : void 0;
}
function mapAgentRunTerminalOutcomeToTaskStatus(outcome) {
	switch (outcome.reason) {
		case "completed": return "succeeded";
		case "hard_timeout":
		case "timed_out": return "timed_out";
		case "cancelled":
		case "aborted": return "cancelled";
		case "blocked":
		case "failed": return "failed";
		default: return outcome.reason;
	}
}
function buildTaskLifecycleTerminalOutcome(params) {
	return buildAgentRunTerminalOutcome({
		status: params.phase === "error" ? "error" : params.data?.aborted === true ? "timeout" : "ok",
		error: params.data?.error,
		stopReason: params.data?.stopReason,
		livenessState: params.data?.livenessState,
		timeoutPhase: params.data?.timeoutPhase,
		providerStarted: params.data?.providerStarted,
		startedAt: params.startedAt,
		endedAt: params.endedAt
	});
}
function appendTaskEvent(event) {
	const summary = normalizeTaskSummary(event.summary);
	return {
		at: event.at,
		kind: event.kind,
		...summary ? { summary } : {}
	};
}
function loadTaskRegistryDeliveryRuntime() {
	const deliveryRuntimeOverride = globalThis[TASK_REGISTRY_DELIVERY_RUNTIME_OVERRIDE_KEY];
	if (deliveryRuntimeOverride) return Promise.resolve(deliveryRuntimeOverride);
	deliveryRuntimePromise ??= import("./task-registry-delivery-runtime-_60ZWcMF.js");
	return deliveryRuntimePromise;
}
function loadTaskRegistryControlRuntime() {
	const controlRuntimeOverride = globalThis[TASK_REGISTRY_CONTROL_RUNTIME_OVERRIDE_KEY];
	if (controlRuntimeOverride) return Promise.resolve(controlRuntimeOverride);
	controlRuntimePromise ??= Promise.resolve().then(() => {
		for (const candidate of TASK_REGISTRY_CONTROL_RUNTIME_CANDIDATES) try {
			return require(candidate);
		} catch {}
		throw new Error("Failed to load task registry control runtime.");
	});
	return controlRuntimePromise;
}
function addRunIdIndex(taskId, runId) {
	const trimmed = runId?.trim();
	if (!trimmed) return;
	let ids = taskIdsByRunId.get(trimmed);
	if (!ids) {
		ids = /* @__PURE__ */ new Set();
		taskIdsByRunId.set(trimmed, ids);
	}
	ids.add(taskId);
}
function addIndexedKey(index, key, taskId) {
	let ids = index.get(key);
	if (!ids) {
		ids = /* @__PURE__ */ new Set();
		index.set(key, ids);
	}
	ids.add(taskId);
}
function deleteIndexedKey(index, key, taskId) {
	const ids = index.get(key);
	if (!ids) return;
	ids.delete(taskId);
	if (ids.size === 0) index.delete(key);
}
function getTaskRelatedSessionIndexKeys(task) {
	return uniqueStrings([normalizeOptionalString(task.ownerKey), normalizeOptionalString(task.childSessionKey)].filter(Boolean));
}
function addOwnerKeyIndex(taskId, task) {
	const key = normalizeOptionalString(task.ownerKey);
	if (!key) return;
	addIndexedKey(taskIdsByOwnerKey, key, taskId);
}
function deleteOwnerKeyIndex(taskId, task) {
	const key = normalizeOptionalString(task.ownerKey);
	if (!key) return;
	deleteIndexedKey(taskIdsByOwnerKey, key, taskId);
}
function addParentFlowIdIndex(taskId, task) {
	const key = task.parentFlowId?.trim();
	if (!key) return;
	addIndexedKey(taskIdsByParentFlowId, key, taskId);
}
function deleteParentFlowIdIndex(taskId, task) {
	const key = task.parentFlowId?.trim();
	if (!key) return;
	deleteIndexedKey(taskIdsByParentFlowId, key, taskId);
}
function addRelatedSessionKeyIndex(taskId, task) {
	for (const sessionKey of getTaskRelatedSessionIndexKeys(task)) addIndexedKey(taskIdsByRelatedSessionKey, sessionKey, taskId);
}
function deleteRelatedSessionKeyIndex(taskId, task) {
	for (const sessionKey of getTaskRelatedSessionIndexKeys(task)) deleteIndexedKey(taskIdsByRelatedSessionKey, sessionKey, taskId);
}
function rebuildRunIdIndex() {
	taskIdsByRunId.clear();
	for (const [taskId, task] of tasks.entries()) addRunIdIndex(taskId, task.runId);
}
function rebuildOwnerKeyIndex() {
	taskIdsByOwnerKey.clear();
	for (const [taskId, task] of tasks.entries()) addOwnerKeyIndex(taskId, task);
}
function rebuildParentFlowIdIndex() {
	taskIdsByParentFlowId.clear();
	for (const [taskId, task] of tasks.entries()) addParentFlowIdIndex(taskId, task);
}
function rebuildRelatedSessionKeyIndex() {
	taskIdsByRelatedSessionKey.clear();
	for (const [taskId, task] of tasks.entries()) addRelatedSessionKeyIndex(taskId, task);
}
function getTasksByRunId(runId) {
	const ids = taskIdsByRunId.get(runId.trim());
	if (!ids || ids.size === 0) return [];
	return [...ids].map((taskId) => tasks.get(taskId)).filter((task) => Boolean(task));
}
function taskRunScopeKey(task) {
	return [
		task.runtime,
		task.scopeKind,
		normalizeOptionalString(task.ownerKey) ?? "",
		normalizeOptionalString(task.childSessionKey) ?? ""
	].join("\0");
}
function getTasksByRunScope(params) {
	const matches = getTasksByRunId(params.runId).filter((task) => !params.runtime || task.runtime === params.runtime);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (sessionKey) {
		const childMatches = matches.filter((task) => normalizeOptionalString(task.childSessionKey) === sessionKey);
		if (childMatches.length > 0) return childMatches;
		return matches.filter((task) => task.scopeKind === "session" && normalizeOptionalString(task.ownerKey) === sessionKey);
	}
	return new Set(matches.map((task) => taskRunScopeKey(task))).size <= 1 ? matches : [];
}
function getPeerTasksForDelivery(task) {
	if (!task.runId?.trim()) return [];
	return getTasksByRunId(task.runId).filter((candidate) => candidate.runtime === task.runtime && candidate.scopeKind === task.scopeKind && (normalizeOptionalString(candidate.ownerKey) ?? "") === (normalizeOptionalString(task.ownerKey) ?? "") && (normalizeOptionalString(candidate.childSessionKey) ?? "") === (normalizeOptionalString(task.childSessionKey) ?? ""));
}
function taskLookupPriority(task) {
	return task.runtime === "cli" ? 1 : 0;
}
function pickPreferredRunIdTask(matches) {
	return [...matches].toSorted((left, right) => {
		const priorityDiff = taskLookupPriority(left) - taskLookupPriority(right);
		if (priorityDiff !== 0) return priorityDiff;
		return left.createdAt - right.createdAt;
	})[0];
}
function compareTasksNewestFirst(left, right) {
	const createdAtDiff = right.createdAt - left.createdAt;
	if (createdAtDiff !== 0) return createdAtDiff;
	return (right.insertionIndex ?? 0) - (left.insertionIndex ?? 0);
}
function findExistingTaskForCreate(params) {
	const runId = params.runId?.trim();
	const runScopeMatches = runId ? getTasksByRunId(runId).filter((task) => task.runtime === params.runtime && task.scopeKind === params.scopeKind && (normalizeOptionalString(task.ownerKey) ?? "") === (normalizeOptionalString(params.ownerKey) ?? "") && (normalizeOptionalString(task.childSessionKey) ?? "") === (normalizeOptionalString(params.childSessionKey) ?? "") && (normalizeOptionalString(task.parentFlowId) ?? "") === (normalizeOptionalString(params.parentFlowId) ?? "")) : [];
	const exact = runId ? runScopeMatches.find((task) => (normalizeOptionalString(task.label) ?? "") === (normalizeOptionalString(params.label) ?? "") && (normalizeOptionalString(task.task) ?? "") === (normalizeOptionalString(params.task) ?? "")) : void 0;
	if (exact) return exact;
	if (!runId || params.runtime !== "acp") return;
	if (runScopeMatches.length === 0) return;
	return pickPreferredRunIdTask(runScopeMatches);
}
function mergeExistingTaskForCreate(existing, params) {
	const patch = {};
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const currentDeliveryState = taskDeliveryStates.get(existing.taskId);
	if (requesterOrigin && !currentDeliveryState?.requesterOrigin) {
		if (!upsertTaskDeliveryState({
			taskId: existing.taskId,
			requesterOrigin,
			lastNotifiedEventAt: currentDeliveryState?.lastNotifiedEventAt
		}).requesterOrigin) return null;
	}
	if (params.sourceId?.trim() && !existing.sourceId?.trim()) patch.sourceId = params.sourceId.trim();
	if (params.taskKind?.trim() && !existing.taskKind?.trim()) patch.taskKind = params.taskKind.trim();
	if (params.parentFlowId?.trim() && !existing.parentFlowId?.trim()) {
		assertParentFlowLinkAllowed({
			ownerKey: existing.ownerKey,
			scopeKind: existing.scopeKind,
			parentFlowId: params.parentFlowId
		});
		patch.parentFlowId = params.parentFlowId.trim();
	}
	if (params.parentTaskId?.trim() && !existing.parentTaskId?.trim()) patch.parentTaskId = params.parentTaskId.trim();
	if (params.agentId?.trim() && !existing.agentId?.trim()) patch.agentId = params.agentId.trim();
	if (params.requesterAgentId?.trim() && !existing.requesterAgentId?.trim()) patch.requesterAgentId = params.requesterAgentId.trim();
	const nextLabel = params.label?.trim();
	if (params.preferMetadata) {
		if (nextLabel && (normalizeOptionalString(existing.label) ?? "") !== nextLabel) patch.label = nextLabel;
		const nextTask = params.task.trim();
		if (nextTask && (normalizeOptionalString(existing.task) ?? "") !== nextTask) patch.task = nextTask;
	} else if (nextLabel && !existing.label?.trim()) patch.label = nextLabel;
	if (params.deliveryStatus === "pending" && existing.deliveryStatus !== "delivered") patch.deliveryStatus = "pending";
	const notifyPolicy = ensureNotifyPolicy({
		notifyPolicy: params.notifyPolicy,
		deliveryStatus: params.deliveryStatus,
		ownerKey: existing.ownerKey,
		scopeKind: existing.scopeKind
	});
	if (notifyPolicy !== existing.notifyPolicy && existing.notifyPolicy === "silent") patch.notifyPolicy = notifyPolicy;
	if (Object.keys(patch).length === 0) return cloneTaskRecord(existing);
	return updateTask(existing.taskId, patch);
}
function resolveTaskAgentId(params) {
	return normalizeOptionalString(params.explicitAgentId) ?? parseAgentSessionKey(params.childSessionKey)?.agentId ?? parseAgentSessionKey(params.ownerKey)?.agentId ?? parseAgentSessionKey(params.requesterSessionKey)?.agentId;
}
function resolveTaskRequesterAgentId(params) {
	const explicitRequesterAgentId = normalizeOptionalString(params.explicitRequesterAgentId);
	return (explicitRequesterAgentId ? normalizeAgentId(explicitRequesterAgentId) : void 0) ?? parseAgentSessionKey(params.ownerKey)?.agentId ?? parseAgentSessionKey(params.requesterSessionKey)?.agentId;
}
function taskTerminalDeliveryIdempotencyKey(task) {
	const outcome = task.status === "succeeded" ? task.terminalOutcome ?? "default" : "default";
	return `task-terminal:${task.taskId}:${task.status}:${outcome}`;
}
function resolveTaskStateChangeIdempotencyKey(params) {
	if (params.owner.flowId) return `flow-event:${params.owner.flowId}:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
	return `task-event:${params.task.taskId}:${params.latestEvent.at}:${params.latestEvent.kind}`;
}
function resolveTaskTerminalIdempotencyKey(task) {
	const owner = resolveTaskDeliveryOwner(task);
	if (owner.flowId) {
		const outcome = task.status === "succeeded" ? task.terminalOutcome ?? "default" : "default";
		return `flow-terminal:${owner.flowId}:${task.taskId}:${task.status}:${outcome}`;
	}
	return taskTerminalDeliveryIdempotencyKey(task);
}
function getLinkedFlowForDelivery(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId || task.scopeKind !== "session") return;
	const flow = getTaskFlowById(flowId);
	if (!flow) return;
	if (normalizeOptionalString(flow.ownerKey) !== normalizeOptionalString(task.ownerKey)) return;
	return flow;
}
function resolveTaskDeliveryOwner(task) {
	const flow = getLinkedFlowForDelivery(task);
	if (flow) return {
		sessionKey: flow.ownerKey.trim(),
		requesterOrigin: normalizeDeliveryContext(flow.requesterOrigin ?? taskDeliveryStates.get(task.taskId)?.requesterOrigin),
		flowId: flow.flowId
	};
	if (task.scopeKind !== "session") return {};
	return {
		sessionKey: task.ownerKey.trim(),
		requesterOrigin: normalizeDeliveryContext(taskDeliveryStates.get(task.taskId)?.requesterOrigin)
	};
}
function syncManagedFlowCancellationFromTask(task) {
	const flowId = task.parentFlowId?.trim();
	if (!flowId) return;
	let flow = getTaskFlowById(flowId);
	if (!flow || flow.syncMode !== "managed" || flow.cancelRequestedAt == null || isTerminalFlowStatus(flow.status)) return;
	if (listTasksForFlowId(flowId).some((candidate) => isActiveTaskStatus(candidate.status))) return;
	const endedAt = task.endedAt ?? task.lastEventAt ?? Date.now();
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const result = updateFlowRecordByIdExpectedRevision({
			flowId,
			expectedRevision: flow.revision,
			patch: {
				status: "cancelled",
				blockedTaskId: null,
				blockedSummary: null,
				waitJson: null,
				endedAt,
				updatedAt: endedAt
			}
		});
		if (result.applied || result.reason === "not_found") return;
		flow = result.current;
		if (!flow || flow.syncMode !== "managed" || flow.cancelRequestedAt == null || isTerminalFlowStatus(flow.status)) return;
		if (listTasksForFlowId(flowId).some((candidate) => isActiveTaskStatus(candidate.status))) return;
	}
}
function scheduleTaskFlowSyncRetry(task, operation, attempt = 0) {
	const taskId = task.taskId.trim();
	if (!taskId || taskFlowSyncRetryTimers.has(taskId)) return;
	const delayMs = TASK_FLOW_SYNC_RETRY_DELAYS_MS[attempt];
	if (delayMs == null) {
		log.warn("Exhausted parent flow sync retries from task", {
			operation,
			taskId,
			flowId: task.parentFlowId
		});
		return;
	}
	const retryTimer = setTimeout(() => {
		taskFlowSyncRetryTimers.delete(taskId);
		const current = tasks.get(taskId);
		if (!current) return;
		const flowId = current.parentFlowId?.trim();
		if (!flowId || findLatestTaskForFlowId(flowId)?.taskId !== taskId) return;
		const result = syncFlowFromTaskResult(current);
		if (!result.ok) {
			log.warn("Failed to retry parent flow sync from task", {
				operation,
				taskId,
				flowId: current.parentFlowId,
				reason: result.reason
			});
			scheduleTaskFlowSyncRetry(current, operation, attempt + 1);
		}
	}, delayMs);
	retryTimer.unref?.();
	taskFlowSyncRetryTimers.set(taskId, retryTimer);
}
function syncFlowFromTaskAfterTaskMutation(task, operation) {
	const result = syncFlowFromTaskResult(task);
	if (result.ok) return;
	log.warn("Failed to sync parent flow from task mutation", {
		operation,
		taskId: task.taskId,
		flowId: task.parentFlowId,
		reason: result.reason
	});
	scheduleTaskFlowSyncRetry(task, operation);
}
function clearTaskFlowSyncRetries() {
	for (const timer of taskFlowSyncRetryTimers.values()) clearTimeout(timer);
	taskFlowSyncRetryTimers.clear();
}
function restoreTaskRegistryOnce() {
	if (restoreAttempted) return;
	restoreAttempted = true;
	try {
		const restored = getTaskRegistryStore().loadSnapshot();
		if (restored.tasks.size === 0 && restored.deliveryStates.size === 0) return;
		for (const [taskId, task] of restored.tasks.entries()) tasks.set(taskId, normalizeTaskTimestamps(task));
		for (const [taskId, state] of restored.deliveryStates.entries()) taskDeliveryStates.set(taskId, state);
		rebuildRunIdIndex();
		rebuildOwnerKeyIndex();
		rebuildParentFlowIdIndex();
		rebuildRelatedSessionKeyIndex();
		emitTaskRegistryObserverEvent(() => ({
			kind: "restored",
			tasks: snapshotTaskRecords(tasks)
		}));
	} catch (error) {
		log.warn("Failed to restore task registry", { error });
	}
}
function ensureTaskRegistryReady() {
	restoreTaskRegistryOnce();
	ensureListener();
}
function reloadTaskRegistryFromStore() {
	clearTaskRegistryMemory();
	restoreAttempted = false;
	restoreTaskRegistryOnce();
}
function updateTask(taskId, patch) {
	const current = tasks.get(taskId);
	if (!current) return null;
	const next = normalizeTaskTimestamps({
		...current,
		...patch
	});
	if (isTerminalTaskStatus(next.status) && typeof next.cleanupAfter !== "number") next.cleanupAfter = resolveTaskCleanupAfter({
		...next,
		createdAt: next.createdAt ?? Date.now()
	});
	const sessionIndexChanged = normalizeOptionalString(current.ownerKey) !== normalizeOptionalString(next.ownerKey) || normalizeOptionalString(current.childSessionKey) !== normalizeOptionalString(next.childSessionKey);
	const parentFlowIndexChanged = current.parentFlowId?.trim() !== next.parentFlowId?.trim();
	if (!tryPersistTaskUpsert(next, "update")) return null;
	tasks.set(taskId, next);
	if (patch.runId && patch.runId !== current.runId) rebuildRunIdIndex();
	if (sessionIndexChanged) {
		deleteOwnerKeyIndex(taskId, current);
		addOwnerKeyIndex(taskId, next);
		deleteRelatedSessionKeyIndex(taskId, current);
		addRelatedSessionKeyIndex(taskId, next);
	}
	if (parentFlowIndexChanged) {
		deleteParentFlowIdIndex(taskId, current);
		addParentFlowIdIndex(taskId, next);
	}
	syncFlowFromTaskAfterTaskMutation(next, "update");
	try {
		syncManagedFlowCancellationFromTask(next);
	} catch (error) {
		log.warn("Failed to finalize managed flow cancellation from task update", {
			taskId,
			flowId: next.parentFlowId,
			error
		});
	}
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecord(next),
		previous: cloneTaskRecord(current)
	}));
	return cloneTaskRecord(next);
}
function upsertTaskDeliveryState(state) {
	const current = taskDeliveryStates.get(state.taskId);
	const next = {
		taskId: state.taskId,
		...state.requesterOrigin ? { requesterOrigin: normalizeDeliveryContext(state.requesterOrigin) } : {},
		...state.lastNotifiedEventAt != null ? { lastNotifiedEventAt: state.lastNotifiedEventAt } : {}
	};
	if (!next.requesterOrigin && typeof next.lastNotifiedEventAt !== "number" && !current) return cloneTaskDeliveryState({ taskId: state.taskId });
	if (!tryPersistTaskDeliveryStateUpsert(next)) return current ? cloneTaskDeliveryState(current) : cloneTaskDeliveryState({ taskId: state.taskId });
	taskDeliveryStates.set(state.taskId, next);
	return cloneTaskDeliveryState(next);
}
function getTaskDeliveryState(taskId) {
	const state = taskDeliveryStates.get(taskId);
	return state ? cloneTaskDeliveryState(state) : void 0;
}
function canDeliverTaskToRequesterOrigin(task) {
	const owner = resolveTaskDeliveryOwner(task);
	if (shouldRouteCompletionThroughRequesterSession(owner.sessionKey)) return false;
	return canDeliverToRequesterOrigin(owner.requesterOrigin);
}
function canDeliverToRequesterOrigin(origin) {
	const channel = origin?.channel?.trim();
	const to = origin?.to?.trim();
	return Boolean(channel && to && isDeliverableMessageChannel(channel));
}
function canDeliverParentReviewTaskToBoundDiscordThread(task) {
	if (!shouldUseParentReviewTaskTerminalMessage(task)) return false;
	const origin = resolveTaskDeliveryOwner(task).requesterOrigin;
	const channel = origin?.channel?.trim().toLowerCase();
	const to = origin?.to?.trim().toLowerCase();
	const threadId = String(origin?.threadId ?? "").trim();
	return Boolean(channel === "discord" && to?.startsWith("channel:") && threadId && canDeliverToRequesterOrigin(origin));
}
function resolveMissingOwnerDeliveryStatus(task) {
	return task.scopeKind === "system" ? "not_applicable" : "parent_missing";
}
function queueTaskSystemEvent(task, text) {
	const owner = resolveTaskDeliveryOwner(task);
	const ownerKey = owner.sessionKey?.trim();
	if (!ownerKey) return false;
	enqueueSystemEvent(text, {
		sessionKey: ownerKey,
		contextKey: `task:${task.taskId}`,
		deliveryContext: owner.requesterOrigin
	});
	requestHeartbeat({
		source: "background-task",
		intent: "immediate",
		reason: "background-task",
		sessionKey: ownerKey
	});
	return true;
}
function queueBlockedTaskFollowup(task) {
	const followupText = formatTaskBlockedFollowupMessage(task);
	if (!followupText) return false;
	const owner = resolveTaskDeliveryOwner(task);
	const ownerKey = owner.sessionKey?.trim();
	if (!ownerKey) return false;
	enqueueSystemEvent(followupText, {
		sessionKey: ownerKey,
		contextKey: `task:${task.taskId}:blocked-followup`,
		deliveryContext: owner.requesterOrigin
	});
	requestHeartbeat({
		source: "background-task-blocked",
		intent: "immediate",
		reason: "background-task-blocked",
		sessionKey: ownerKey
	});
	return true;
}
async function maybeDeliverTaskTerminalUpdate(taskId) {
	ensureTaskRegistryReady();
	const current = tasks.get(taskId);
	if (!current || !shouldAutoDeliverTaskTerminalUpdate(current)) return current ? cloneTaskRecord(current) : null;
	if (tasksWithPendingDelivery.has(taskId)) return cloneTaskRecord(current);
	tasksWithPendingDelivery.add(taskId);
	try {
		const latest = tasks.get(taskId);
		if (!latest || !shouldAutoDeliverTaskTerminalUpdate(latest)) return latest ? cloneTaskRecord(latest) : null;
		if (shouldSuppressDuplicateTerminalDelivery({
			task: latest,
			preferredTaskId: (latest.runId ? pickPreferredRunIdTask(getPeerTasksForDelivery(latest)) : void 0)?.taskId
		})) return updateTask(taskId, {
			deliveryStatus: "not_applicable",
			lastEventAt: Date.now()
		});
		const owner = resolveTaskDeliveryOwner(latest);
		const ownerSessionKey = owner.sessionKey?.trim();
		if (!ownerSessionKey) return updateTask(taskId, {
			deliveryStatus: resolveMissingOwnerDeliveryStatus(latest),
			lastEventAt: Date.now()
		});
		const shouldRouteParentReview = shouldUseParentReviewTaskTerminalMessage(latest);
		const shouldDeliverParentReviewDirect = canDeliverParentReviewTaskToBoundDiscordThread(latest);
		const canDeliverDirect = canDeliverTaskToRequesterOrigin(latest) || shouldDeliverParentReviewDirect;
		const directEventText = formatTaskTerminalMessage(latest);
		const sessionEventText = formatTaskTerminalMessage(latest, shouldRouteParentReview ? { surface: "parent_session" } : void 0);
		if (shouldRouteParentReview && !shouldDeliverParentReviewDirect || !canDeliverDirect) try {
			queueTaskSystemEvent(latest, sessionEventText);
			if (latest.terminalOutcome === "blocked") queueBlockedTaskFollowup(latest);
			return updateTask(taskId, {
				deliveryStatus: shouldRouteParentReview && canDeliverDirect ? "pending" : "session_queued",
				lastEventAt: Date.now()
			});
		} catch (error) {
			log.warn("Failed to queue background task session delivery", {
				taskId,
				ownerKey: latest.ownerKey,
				error
			});
			return updateTask(taskId, {
				deliveryStatus: "failed",
				lastEventAt: Date.now()
			});
		}
		try {
			const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
			const requesterAgentId = parseAgentSessionKey(ownerSessionKey)?.agentId;
			const idempotencyKey = resolveTaskTerminalIdempotencyKey(latest);
			await sendMessage({
				channel: owner.requesterOrigin?.channel,
				to: owner.requesterOrigin?.to ?? "",
				accountId: owner.requesterOrigin?.accountId,
				threadId: owner.requesterOrigin?.threadId,
				content: shouldDeliverParentReviewDirect ? sessionEventText : directEventText,
				agentId: requesterAgentId,
				idempotencyKey,
				mirror: {
					sessionKey: ownerSessionKey,
					agentId: requesterAgentId,
					idempotencyKey
				}
			});
			if (latest.terminalOutcome === "blocked") queueBlockedTaskFollowup(latest);
			return updateTask(taskId, {
				deliveryStatus: "delivered",
				lastEventAt: Date.now()
			});
		} catch (error) {
			log.warn("Failed to deliver background task update", {
				taskId,
				ownerKey: ownerSessionKey,
				requesterOrigin: owner.requesterOrigin,
				error
			});
			try {
				queueTaskSystemEvent(latest, sessionEventText);
				if (latest.terminalOutcome === "blocked") queueBlockedTaskFollowup(latest);
			} catch (fallbackError) {
				log.warn("Failed to queue background task fallback event", {
					taskId,
					ownerKey: latest.ownerKey,
					error: fallbackError
				});
			}
			return updateTask(taskId, {
				deliveryStatus: "failed",
				lastEventAt: Date.now()
			});
		}
	} finally {
		tasksWithPendingDelivery.delete(taskId);
	}
}
async function maybeDeliverTaskStateChangeUpdate(taskId, latestEvent) {
	ensureTaskRegistryReady();
	const current = tasks.get(taskId);
	if (!current || !shouldAutoDeliverTaskStateChange(current)) return current ? cloneTaskRecord(current) : null;
	const deliveryState = getTaskDeliveryState(taskId);
	if (!latestEvent || (deliveryState?.lastNotifiedEventAt ?? 0) >= latestEvent.at) return cloneTaskRecord(current);
	const eventText = formatTaskStateChangeMessage(current, latestEvent);
	if (!eventText) return cloneTaskRecord(current);
	try {
		const owner = resolveTaskDeliveryOwner(current);
		const ownerSessionKey = owner.sessionKey?.trim();
		if (!ownerSessionKey) return updateTask(taskId, {
			deliveryStatus: resolveMissingOwnerDeliveryStatus(current),
			lastEventAt: Date.now()
		});
		if (!canDeliverTaskToRequesterOrigin(current)) {
			queueTaskSystemEvent(current, eventText);
			upsertTaskDeliveryState({
				taskId,
				requesterOrigin: deliveryState?.requesterOrigin,
				lastNotifiedEventAt: latestEvent.at
			});
			return updateTask(taskId, { lastEventAt: Date.now() });
		}
		const { sendMessage } = await loadTaskRegistryDeliveryRuntime();
		const requesterAgentId = parseAgentSessionKey(ownerSessionKey)?.agentId;
		const idempotencyKey = resolveTaskStateChangeIdempotencyKey({
			task: current,
			latestEvent,
			owner
		});
		await sendMessage({
			channel: owner.requesterOrigin?.channel,
			to: owner.requesterOrigin?.to ?? "",
			accountId: owner.requesterOrigin?.accountId,
			threadId: owner.requesterOrigin?.threadId,
			content: eventText,
			agentId: requesterAgentId,
			idempotencyKey,
			mirror: {
				sessionKey: ownerSessionKey,
				agentId: requesterAgentId,
				idempotencyKey
			}
		});
		upsertTaskDeliveryState({
			taskId,
			requesterOrigin: deliveryState?.requesterOrigin,
			lastNotifiedEventAt: latestEvent.at
		});
		return updateTask(taskId, { lastEventAt: Date.now() });
	} catch (error) {
		log.warn("Failed to deliver background task state change", {
			taskId,
			ownerKey: current.ownerKey,
			error
		});
		return cloneTaskRecord(current);
	}
}
function setTaskCleanupAfterById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, { cleanupAfter: params.cleanupAfter });
}
function markTaskTerminalById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		status: params.status,
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt ?? params.endedAt,
		...params.error !== void 0 ? { error: params.error } : {},
		...params.terminalSummary !== void 0 ? { terminalSummary: normalizeTaskSummary(params.terminalSummary) } : {},
		...params.terminalOutcome !== void 0 ? { terminalOutcome: resolveTaskTerminalOutcome({
			status: params.status,
			terminalOutcome: params.terminalOutcome
		}) } : {}
	});
}
function markTaskLostById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		status: "lost",
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt ?? params.endedAt,
		...params.error !== void 0 ? { error: params.error } : {},
		...params.cleanupAfter !== void 0 ? { cleanupAfter: params.cleanupAfter } : {}
	});
}
function updateTasksByRunId(params) {
	const matches = getTasksByRunScope(params);
	if (matches.length === 0) return [];
	const updated = [];
	for (const match of matches) {
		const task = updateTask(match.taskId, params.patch);
		if (task) updated.push(task);
	}
	return updated;
}
function ensureListener() {
	if (listenerStarted) return;
	listenerStarted = true;
	onAgentEvent((evt) => {
		restoreTaskRegistryOnce();
		const scopedTasks = getTasksByRunScope({
			runId: evt.runId,
			sessionKey: evt.sessionKey
		});
		if (scopedTasks.length === 0) return;
		const now = evt.ts || Date.now();
		for (const current of scopedTasks) {
			if (isTerminalTaskStatus(current.status)) continue;
			const patch = { lastEventAt: now };
			if (evt.stream === "lifecycle") {
				const phase = typeof evt.data?.phase === "string" ? evt.data.phase : void 0;
				const startedAt = typeof evt.data?.startedAt === "number" ? evt.data.startedAt : current.startedAt;
				const endedAt = typeof evt.data?.endedAt === "number" ? evt.data.endedAt : void 0;
				if (startedAt) patch.startedAt = startedAt;
				if (phase === "start") patch.status = "running";
				else if (phase === "end") {
					const terminal = buildTaskLifecycleTerminalOutcome({
						phase,
						data: evt.data,
						startedAt,
						endedAt: endedAt ?? now
					});
					patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
					patch.endedAt = terminal.endedAt ?? now;
					if (terminal.error) patch.error = terminal.error;
				} else if (phase === "error") {
					const terminal = buildTaskLifecycleTerminalOutcome({
						phase,
						data: evt.data,
						startedAt,
						endedAt: endedAt ?? now
					});
					patch.status = mapAgentRunTerminalOutcomeToTaskStatus(terminal);
					patch.endedAt = terminal.endedAt ?? now;
					patch.error = terminal.error ?? current.error;
				}
			} else if (evt.stream === "error") patch.error = typeof evt.data?.error === "string" ? evt.data.error : current.error;
			const stateChangeEvent = patch.status && patch.status !== current.status ? appendTaskEvent({
				at: now,
				kind: patch.status,
				summary: patch.status === "failed" ? patch.error ?? current.error : patch.status === "succeeded" ? current.terminalSummary : void 0
			}) : void 0;
			if (updateTask(current.taskId, patch)) {
				maybeDeliverTaskStateChangeUpdate(current.taskId, stateChangeEvent);
				maybeDeliverTaskTerminalUpdate(current.taskId);
			}
		}
	});
}
function createTaskRecord(params) {
	ensureTaskRegistryReady();
	const requesterSessionKey = resolveTaskRequesterSessionKey(params);
	const scopeKind = resolveTaskScopeKind({
		scopeKind: params.scopeKind,
		requesterSessionKey
	});
	const ownerKey = resolveTaskOwnerKey({
		requesterSessionKey,
		ownerKey: params.ownerKey
	});
	const agentId = resolveTaskAgentId({
		explicitAgentId: params.agentId,
		childSessionKey: params.childSessionKey,
		ownerKey,
		requesterSessionKey
	});
	const requesterAgentId = resolveTaskRequesterAgentId({
		explicitRequesterAgentId: params.requesterAgentId,
		ownerKey,
		requesterSessionKey
	});
	assertTaskOwner({
		ownerKey,
		scopeKind
	});
	assertParentFlowLinkAllowed({
		ownerKey,
		scopeKind,
		parentFlowId: params.parentFlowId
	});
	const existing = findExistingTaskForCreate({
		runtime: params.runtime,
		ownerKey,
		scopeKind,
		childSessionKey: params.childSessionKey,
		parentFlowId: params.parentFlowId,
		runId: params.runId,
		label: params.label,
		task: params.task
	});
	if (existing) return mergeExistingTaskForCreate(existing, {
		...params,
		agentId
	});
	const now = Date.now();
	const taskId = crypto.randomUUID();
	const status = normalizeTaskStatus(params.status);
	const deliveryStatus = params.deliveryStatus ?? ensureDeliveryStatus({
		ownerKey,
		scopeKind
	});
	const notifyPolicy = ensureNotifyPolicy({
		notifyPolicy: params.notifyPolicy,
		deliveryStatus,
		ownerKey,
		scopeKind
	});
	const lastEventAt = params.lastEventAt ?? params.startedAt ?? now;
	const record = normalizeTaskTimestamps({
		taskId,
		runtime: params.runtime,
		taskKind: normalizeOptionalString(params.taskKind),
		sourceId: normalizeOptionalString(params.sourceId),
		requesterSessionKey,
		ownerKey,
		scopeKind,
		childSessionKey: params.childSessionKey,
		parentFlowId: normalizeOptionalString(params.parentFlowId),
		parentTaskId: normalizeOptionalString(params.parentTaskId),
		agentId,
		requesterAgentId,
		runId: normalizeOptionalString(params.runId),
		label: normalizeOptionalString(params.label),
		task: params.task,
		status,
		deliveryStatus,
		notifyPolicy,
		createdAt: now,
		startedAt: params.startedAt,
		lastEventAt,
		cleanupAfter: params.cleanupAfter,
		progressSummary: normalizeTaskSummary(params.progressSummary),
		terminalSummary: normalizeTaskSummary(params.terminalSummary),
		terminalOutcome: resolveTaskTerminalOutcome({
			status,
			terminalOutcome: params.terminalOutcome
		})
	});
	if (isTerminalTaskStatus(record.status) && typeof record.cleanupAfter !== "number") record.cleanupAfter = resolveTaskCleanupAfter(record);
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	const deliveryState = requesterOrigin ? {
		taskId,
		requesterOrigin
	} : void 0;
	if (!tryPersistTaskUpsert(record, "create", deliveryState)) return null;
	tasks.set(taskId, record);
	if (requesterOrigin) taskDeliveryStates.set(taskId, deliveryState);
	addRunIdIndex(taskId, record.runId);
	addOwnerKeyIndex(taskId, record);
	addParentFlowIdIndex(taskId, record);
	addRelatedSessionKeyIndex(taskId, record);
	syncFlowFromTaskAfterTaskMutation(record, "create");
	emitTaskRegistryObserverEvent(() => ({
		kind: "upserted",
		task: cloneTaskRecord(record)
	}));
	if (isTerminalTaskStatus(record.status)) maybeDeliverTaskTerminalUpdate(taskId);
	return cloneTaskRecord(record);
}
function updateTaskStateByRunId(params) {
	ensureTaskRegistryReady();
	const matches = getTasksByRunScope(params);
	if (matches.length === 0) return [];
	const updated = [];
	for (const current of matches) {
		const patch = {};
		const nextStatus = params.status ? normalizeTaskStatus(params.status) : current.status;
		if (params.status && !shouldApplyRunScopedStatusUpdate({
			currentStatus: current.status,
			nextStatus
		})) continue;
		const eventAt = params.lastEventAt ?? params.endedAt ?? Date.now();
		if (params.status) patch.status = normalizeTaskStatus(params.status);
		if (params.startedAt != null) patch.startedAt = params.startedAt;
		if (params.endedAt != null) patch.endedAt = params.endedAt;
		if (params.lastEventAt != null) patch.lastEventAt = params.lastEventAt;
		if (params.error !== void 0) patch.error = params.error;
		if (params.progressSummary !== void 0) patch.progressSummary = normalizeTaskSummary(params.progressSummary);
		if (params.terminalSummary !== void 0) patch.terminalSummary = normalizeTaskSummary(params.terminalSummary);
		if (params.terminalOutcome !== void 0) patch.terminalOutcome = resolveTaskTerminalOutcome({
			status: nextStatus,
			terminalOutcome: params.terminalOutcome
		});
		const eventSummary = normalizeTaskSummary(params.eventSummary) ?? (nextStatus === "failed" ? normalizeTaskSummary(params.error ?? current.error) : nextStatus === "succeeded" ? normalizeTaskSummary(params.terminalSummary ?? current.terminalSummary) : void 0);
		const nextEvent = params.status && params.status !== current.status || Boolean(normalizeTaskSummary(params.eventSummary)) ? appendTaskEvent({
			at: eventAt,
			kind: params.status && normalizeTaskStatus(params.status) !== current.status ? normalizeTaskStatus(params.status) : "progress",
			summary: eventSummary
		}) : void 0;
		const task = updateTask(current.taskId, patch);
		if (task) {
			updated.push(task);
			maybeDeliverTaskStateChangeUpdate(task.taskId, nextEvent);
			maybeDeliverTaskTerminalUpdate(task.taskId);
		}
	}
	return updated;
}
function updateTaskDeliveryByRunId(params) {
	ensureTaskRegistryReady();
	const patch = { deliveryStatus: params.deliveryStatus };
	if (params.error !== void 0) patch.error = params.error;
	return updateTasksByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		patch
	});
}
function markTaskRunningByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		status: "running",
		startedAt: params.startedAt,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary,
		eventSummary: params.eventSummary
	});
}
function recordTaskProgressByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		lastEventAt: params.lastEventAt,
		progressSummary: params.progressSummary,
		eventSummary: params.eventSummary
	});
}
function finalizeTaskRunByRunId(params) {
	return updateTaskStateByRunId({
		runId: params.runId,
		runtime: params.runtime,
		sessionKey: params.sessionKey,
		status: params.status,
		startedAt: params.startedAt,
		endedAt: params.endedAt,
		lastEventAt: params.lastEventAt,
		error: params.error,
		progressSummary: params.progressSummary,
		terminalSummary: params.terminalSummary,
		terminalOutcome: params.terminalOutcome
	});
}
function setTaskRunDeliveryStatusByRunId(params) {
	return updateTaskDeliveryByRunId(params);
}
function updateTaskNotifyPolicyById(params) {
	ensureTaskRegistryReady();
	return updateTask(params.taskId, {
		notifyPolicy: params.notifyPolicy,
		lastEventAt: Date.now()
	});
}
function linkTaskToFlowById(params) {
	ensureTaskRegistryReady();
	const flowId = params.flowId.trim();
	if (!flowId) return null;
	const current = tasks.get(params.taskId);
	if (!current) return null;
	if (current.parentFlowId?.trim()) return cloneTaskRecord(current);
	assertParentFlowLinkAllowed({
		ownerKey: current.ownerKey,
		scopeKind: current.scopeKind,
		parentFlowId: flowId
	});
	return updateTask(params.taskId, { parentFlowId: flowId });
}
async function cancelTaskById(params) {
	ensureTaskRegistryReady();
	const task = tasks.get(params.taskId.trim());
	if (!task) return {
		found: false,
		cancelled: false,
		reason: "Task not found."
	};
	if (task.status === "succeeded" || task.status === "failed" || task.status === "timed_out" || task.status === "lost" || task.status === "cancelled") return {
		found: true,
		cancelled: false,
		reason: "Task is already terminal.",
		task: cloneTaskRecord(task)
	};
	const childSessionKey = task.childSessionKey?.trim();
	try {
		if (task.runtime !== "cli") {
			if (task.runtime === "cron") {
				if (!cancelActiveCronTaskRun({
					runId: task.runId,
					reason: params.reason?.trim() || "Cancelled by operator."
				})) return {
					found: true,
					cancelled: false,
					reason: "Cron task has no active cancellation handle.",
					task: cloneTaskRecord(task)
				};
			} else if (!childSessionKey) {
				if (!isChildlessNativeSubagentTask(task)) return {
					found: true,
					cancelled: false,
					reason: "Task has no cancellable child session.",
					task: cloneTaskRecord(task)
				};
			}
			if (task.runtime === "cron") {} else if (!childSessionKey) {} else if (task.runtime === "acp") {
				const { getAcpSessionManager } = await loadTaskRegistryControlRuntime();
				await getAcpSessionManager().cancelSession({
					cfg: params.cfg,
					sessionKey: childSessionKey,
					reason: params.reason?.trim() || "task-cancel"
				});
			} else if (task.runtime === "subagent") {
				const { killSubagentRunAdmin } = await loadTaskRegistryControlRuntime();
				const result = await killSubagentRunAdmin({
					cfg: params.cfg,
					sessionKey: childSessionKey
				});
				if (!result.found || !result.killed) return {
					found: true,
					cancelled: false,
					reason: result.found ? "Subagent was not running." : "Subagent task not found.",
					task: cloneTaskRecord(task)
				};
			} else return {
				found: true,
				cancelled: false,
				reason: "Task runtime does not support cancellation yet.",
				task: cloneTaskRecord(task)
			};
		}
		const updated = updateTask(task.taskId, {
			status: "cancelled",
			endedAt: Date.now(),
			lastEventAt: Date.now(),
			error: params.reason?.trim() || "Cancelled by operator."
		});
		if (!updated) return {
			found: true,
			cancelled: false,
			reason: "Task persistence failed.",
			task: cloneTaskRecord(task)
		};
		if (updated) maybeDeliverTaskTerminalUpdate(updated.taskId);
		return {
			found: true,
			cancelled: true,
			task: updated ?? cloneTaskRecord(task)
		};
	} catch (error) {
		return {
			found: true,
			cancelled: false,
			reason: formatErrorMessage(error),
			task: cloneTaskRecord(task)
		};
	}
}
function listTaskRecords() {
	ensureTaskRegistryReady();
	return [...tasks.values()].map((task, insertionIndex) => Object.assign({}, cloneTaskRecord(task), { insertionIndex })).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _, ...task }) => task);
}
function hasActiveTaskForChildSessionKey(params) {
	ensureTaskRegistryReady();
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	const ids = taskIdsByRelatedSessionKey.get(sessionKey);
	if (!ids) return false;
	for (const taskId of ids) {
		if (taskId === params.excludeTaskId) continue;
		const task = tasks.get(taskId);
		if (task && isActiveTaskStatus(task.status) && normalizeOptionalString(task.childSessionKey) === sessionKey) return true;
	}
	return false;
}
function getTaskById(taskId) {
	ensureTaskRegistryReady();
	const task = tasks.get(taskId.trim());
	return task ? cloneTaskRecord(task) : void 0;
}
function findTaskByRunId(runId) {
	ensureTaskRegistryReady();
	const task = pickPreferredRunIdTask(getTasksByRunId(runId));
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksFromIndex(index, key) {
	const ids = index.get(key);
	if (!ids || ids.size === 0) return [];
	return [...ids].map((taskId, insertionIndex) => {
		const task = tasks.get(taskId);
		return task ? Object.assign({}, cloneTaskRecord(task), { insertionIndex }) : null;
	}).filter((task) => Boolean(task)).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _, ...task }) => task);
}
function listTasksForSessionKey(sessionKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(sessionKey);
	if (!key) return [];
	return listTasksFromIndex(taskIdsByRelatedSessionKey, key);
}
function listTasksForAgentId(agentId) {
	ensureTaskRegistryReady();
	const lookup = agentId.trim();
	if (!lookup) return [];
	return snapshotTaskRecords(tasks).filter((task) => task.agentId?.trim() === lookup).toSorted(compareTasksNewestFirst);
}
function findLatestTaskForFlowId(flowId) {
	const task = listTasksForFlowId(flowId)[0];
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForOwnerKey(ownerKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(ownerKey);
	if (!key) return [];
	return listTasksFromIndex(taskIdsByOwnerKey, key);
}
function listFreshTasksForOwnerKey(ownerKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(ownerKey);
	if (!key) return [];
	const store = getTaskRegistryStore();
	if (store.listTasksForOwnerKey) try {
		const merged = /* @__PURE__ */ new Map();
		for (const task of store.listTasksForOwnerKey(key)) merged.set(task.taskId, cloneTaskRecord(normalizeTaskTimestamps(task)));
		return [...merged.values()].map((task, insertionIndex) => Object.assign({}, task, { insertionIndex })).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _, ...task }) => task);
	} catch (error) {
		log.warn("Failed to read fresh owner task registry records", {
			ownerKey: key,
			error
		});
	}
	return listTasksFromIndex(taskIdsByOwnerKey, key);
}
function listTasksForFlowId(flowId) {
	ensureTaskRegistryReady();
	const key = flowId.trim();
	if (!key) return [];
	return listTasksFromIndex(taskIdsByParentFlowId, key);
}
function findLatestTaskForRelatedSessionKey(sessionKey) {
	const task = listTasksForRelatedSessionKey(sessionKey)[0];
	return task ? cloneTaskRecord(task) : void 0;
}
function listTasksForRelatedSessionKey(sessionKey) {
	ensureTaskRegistryReady();
	const key = normalizeOptionalString(sessionKey);
	if (!key) return [];
	return listTasksFromIndex(taskIdsByRelatedSessionKey, key);
}
function resolveTaskForLookupToken(token) {
	const lookup = token.trim();
	if (!lookup) return;
	return getTaskById(lookup) ?? findTaskByRunId(lookup) ?? findLatestTaskForRelatedSessionKey(lookup);
}
function deleteTaskRecordById(taskId) {
	ensureTaskRegistryReady();
	const current = tasks.get(taskId);
	if (!current) return false;
	if (!tryPersistTaskDelete(taskId)) return false;
	deleteOwnerKeyIndex(taskId, current);
	deleteParentFlowIdIndex(taskId, current);
	deleteRelatedSessionKeyIndex(taskId, current);
	tasks.delete(taskId);
	taskDeliveryStates.delete(taskId);
	rebuildRunIdIndex();
	emitTaskRegistryObserverEvent(() => ({
		kind: "deleted",
		taskId: current.taskId,
		previous: cloneTaskRecord(current)
	}));
	return true;
}
//#endregion
export { deleteTaskFlowRecordById as A, resumeFlow as B, reloadTaskRegistryFromStore as C, updateTaskNotifyPolicyById as D, setTaskRunDeliveryStatusByRunId as E, getTaskFlowRegistryRestoreFailure as F, resolveChildlessNativeSubagentTaskDefinition as G, updateFlowRecordByIdExpectedRevision as H, listTaskFlowRecords as I, retireActiveCronTaskRunTracking as J, abortActiveCronTaskRuns as K, listTaskFlowsForOwnerKey as L, findLatestTaskFlowForOwnerKey as M, finishFlow as N, createManagedTaskFlow as O, getTaskFlowById as P, requestFlowCancel as R, recordTaskProgressByRunId as S, setTaskCleanupAfterById as T, isTerminalTaskStatus as U, setFlowWaiting as V, isChildlessNativeSubagentTask as W, trackActiveCronTaskRunSettlement as X, startActiveCronTaskRunSettlementGrace as Y, waitForActiveCronTaskRuns as Z, listTasksForSessionKey as _, finalizeTaskRunByRunId as a, markTaskTerminalById as b, hasActiveTaskForChildSessionKey as c, listFreshTasksForOwnerKey as d, listTaskRecords as f, listTasksForRelatedSessionKey as g, listTasksForOwnerKey as h, ensureTaskRegistryReady as i, failFlow as j, createTaskFlowForTask as k, isParentFlowLinkError as l, listTasksForFlowId as m, createTaskRecord as n, findTaskByRunId as o, listTasksForAgentId as p, registerActiveCronTaskRun as q, deleteTaskRecordById as r, getTaskById as s, cancelTaskById as t, linkTaskToFlowById as u, markTaskLostById as v, resolveTaskForLookupToken as w, maybeDeliverTaskTerminalUpdate as x, markTaskRunningByRunId as y, resolveTaskFlowForLookupToken as z };

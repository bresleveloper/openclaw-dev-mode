import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { a as tableHasColumns, r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as normalizeSqliteNumber, t as coerceRequiredSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { r as assertSqliteTableIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { D as ensureTaskExecutionOwnerSchema } from "./openclaw-state-db-BFK9cMiV.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { n as deleteExecutionOwnerLifecycleMetadata, t as bindExecutionOwnerLifecycleMetadata } from "./execution-owner-lifecycle-binding-store-CzRkIAqs.mjs";
import { i as parseTaskFlowStatus, r as parseOptionalTaskFlowSyncMode } from "./task-flow-registry.types-BidrdCoB.mjs";
import { a as parseOptionalTaskTerminalOutcome, c as parseTaskRuntime, l as parseTaskScopeKind, o as parseTaskDeliveryStatus, r as isTerminalTaskStatus, s as parseTaskNotifyPolicy, u as parseTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { d as resolveTaskCleanupAfter, r as createEmptyTaskRegistrySummary, t as addTaskRegistrySummaryCounts } from "./task-registry.summary-BJx95J9k.mjs";
import { isDeepStrictEqual } from "node:util";
import crypto from "node:crypto";
//#region src/tasks/task-flow-registry.records.ts
/** Both transports translate managed actions through the same field and timestamp rules. */
function buildManagedTaskFlowPatch(mutation, input) {
	switch (mutation) {
		case "setWaiting": return {
			status: normalizeOptionalString(input.blockedTaskId) || normalizeOptionalString(input.blockedSummary) ? "blocked" : "waiting",
			currentStep: input.currentStep,
			stateJson: input.stateJson,
			waitJson: input.waitJson,
			blockedTaskId: input.blockedTaskId,
			blockedSummary: input.blockedSummary,
			endedAt: null,
			updatedAt: input.updatedAt
		};
		case "resume": return {
			status: input.status ?? "queued",
			currentStep: input.currentStep,
			stateJson: input.stateJson,
			waitJson: null,
			blockedTaskId: null,
			blockedSummary: null,
			endedAt: null,
			updatedAt: input.updatedAt
		};
		case "finish":
		case "fail": {
			const endedAt = input.endedAt ?? input.updatedAt ?? Date.now();
			return {
				status: mutation === "finish" ? "succeeded" : "failed",
				currentStep: input.currentStep,
				stateJson: input.stateJson,
				waitJson: null,
				blockedTaskId: mutation === "finish" ? null : input.blockedTaskId,
				blockedSummary: mutation === "finish" ? null : input.blockedSummary,
				endedAt,
				updatedAt: input.updatedAt ?? endedAt
			};
		}
		case "requestCancel": return {
			cancelRequestedAt: input.cancelRequestedAt ?? input.updatedAt ?? Date.now(),
			updatedAt: input.updatedAt
		};
	}
	throw new Error("Unknown managed task-flow mutation");
}
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
/** Optional record fields decode without own undefined properties; JSON payloads retain their shape. */
function areTaskFlowRecordsEqual(left, right) {
	const fields = (record) => record ? Object.fromEntries(Object.entries(record).filter(([, value]) => value !== void 0)) : void 0;
	return isDeepStrictEqual(fields(left), fields(right));
}
function isTaskMirroredFlowSyncUnchanged(prepared) {
	return areTaskFlowRecordsEqual({
		...prepared.current,
		waitJson: prepared.current.waitJson ?? null
	}, {
		...prepared.next,
		revision: prepared.current.revision
	});
}
/** Normalization keeps payload ownership with its caller; public readers make copies. */
function normalizeRestoredFlowRecord(record) {
	const syncMode = record.syncMode === "task_mirrored" ? "task_mirrored" : "managed";
	const controllerId = syncMode === "managed" ? normalizeOptionalString(record.controllerId) ?? "core/legacy-restored" : void 0;
	return {
		...record,
		syncMode,
		ownerKey: assertFlowOwnerKey(record.ownerKey),
		...controllerId ? { controllerId } : {},
		currentStep: normalizeOptionalString(record.currentStep),
		blockedTaskId: normalizeOptionalString(record.blockedTaskId),
		blockedSummary: normalizeOptionalString(record.blockedSummary),
		revision: Math.max(0, record.revision),
		cancelRequestedAt: record.cancelRequestedAt ?? void 0,
		endedAt: record.endedAt ?? void 0
	};
}
function selectTaskFlowRecords(source, ownerKey) {
	const normalizedOwnerKey = ownerKey?.trim();
	if (normalizedOwnerKey === "") return [];
	const records = [...source.values()];
	return (normalizedOwnerKey === void 0 ? records : records.filter((flow) => flow.ownerKey.trim() === normalizedOwnerKey)).map((flow) => cloneFlowRecord(flow)).toSorted((left, right) => right.createdAt - left.createdAt);
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
function buildTaskMirroredFlowCreateFields(params) {
	const terminalFlowStatus = deriveTaskFlowStatusFromTask(params.task);
	const timing = resolveTaskMirroredFlowTiming(params.task, isTerminalTaskFlowStatus(terminalFlowStatus));
	return {
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
	};
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
function prepareTaskMirroredFlowSyncFromCurrent(task, flow) {
	const terminalFlowStatus = deriveTaskFlowStatusFromTask(task);
	const isTerminal = isTerminalTaskFlowStatus(terminalFlowStatus);
	const timing = resolveTaskMirroredFlowTiming({
		createdAt: flow.createdAt,
		lastEventAt: task.lastEventAt,
		endedAt: task.endedAt
	}, isTerminal);
	const next = applyFlowPatch(flow, {
		status: terminalFlowStatus,
		notifyPolicy: task.notifyPolicy,
		goal: normalizeOptionalString(task.label) ?? (task.task.trim() || "Background task"),
		blockedTaskId: terminalFlowStatus === "blocked" ? task.taskId.trim() || null : null,
		blockedSummary: terminalFlowStatus === "blocked" ? resolveFlowBlockedSummary(task) ?? null : null,
		waitJson: null,
		updatedAt: timing.updatedAt,
		...isTerminal ? { endedAt: timing.endedAt ?? timing.updatedAt } : { endedAt: null }
	});
	return {
		current: cloneFlowRecord(flow),
		next
	};
}
//#endregion
//#region src/tasks/task-registry.sqlite.shared.ts
function parseSqliteJsonValue(raw) {
	if (!raw?.trim()) return;
	return safeParseJson(raw);
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
//#region src/tasks/task-flow-registry.store.kernel.ts
function serializeJson$1(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function resolveFlowSyncMode(row) {
	const syncMode = parseOptionalTaskFlowSyncMode(row.sync_mode);
	if (syncMode) return syncMode;
	return row.shape === "single_task" ? "task_mirrored" : "managed";
}
function rowToSyncMode(row) {
	return resolveFlowSyncMode(row);
}
function isFlowExecutionOwnerActive(row) {
	const syncMode = resolveFlowSyncMode(row);
	const status = parseTaskFlowStatus(row.status);
	if (row.cancel_requested_at !== null || row.ended_at !== null) return false;
	return syncMode === "task_mirrored" ? status === "queued" || status === "running" : status === "queued" || status === "running" || status === "waiting" || status === "blocked";
}
function rowToFlowRecord(row) {
	const endedAt = normalizeSqliteNumber(row.ended_at);
	const cancelRequestedAt = normalizeSqliteNumber(row.cancel_requested_at);
	const requesterOrigin = parseDeliveryContextJson(row.requester_origin_json);
	const stateJson = parseSqliteJsonValue(row.state_json);
	const waitJson = parseSqliteJsonValue(row.wait_json);
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
function bindTaskFlowRecord(record) {
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
const FLOW_RUN_SELECT_COLUMNS = [
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
];
const taskFlowRegistryQueries = /* @__PURE__ */ new WeakMap();
function getTaskFlowRegistryQueries(db) {
	let queries = taskFlowRegistryQueries.get(db);
	if (!queries) {
		queries = {};
		taskFlowRegistryQueries.set(db, queries);
	}
	return queries;
}
function listTaskFlowRecordsForOwnerReadInDatabase(db, ownerKey) {
	const queries = getTaskFlowRegistryQueries(db);
	return (queries.owner ??= prepareSqliteQuerySync(db, (parameter) => getFlowRegistryKysely(db).selectFrom("flow_runs").selectAll().where("owner_key", "=", parameter((value) => value)).orderBy("created_at", "desc").orderBy("flow_id", "asc")))(ownerKey).rows.map(rowToFlowRecord);
}
function readTaskFlowRegistrySnapshot(db, flowIds) {
	let query = getFlowRegistryKysely(db).selectFrom("flow_runs").select(FLOW_RUN_SELECT_COLUMNS).orderBy("created_at", "asc").orderBy("flow_id", "asc");
	const flows = /* @__PURE__ */ new Map();
	if (flowIds) {
		if (flowIds.length === 0) return { flows };
		query = query.where("flow_id", "in", sqliteStringSet(flowIds));
	}
	for (const row of executeSqliteQuerySync(db, query).rows) flows.set(row.flow_id, rowToFlowRecord(row));
	return { flows };
}
const FLOW_VIEW_SELECT_COLUMNS = FLOW_RUN_SELECT_COLUMNS.filter((column) => column !== "state_json" && column !== "wait_json");
function flowViewQuery(db) {
	return getFlowRegistryKysely(db).selectFrom("flow_runs").select(FLOW_VIEW_SELECT_COLUMNS).select((expression) => [expression.val(null).as("state_json"), expression.val(null).as("wait_json")]);
}
function listTaskFlowViewRecordsForOwnerInDatabase(db, ownerKey) {
	const queries = getTaskFlowRegistryQueries(db);
	return (queries.viewOwner ??= prepareSqliteQuerySync(db, (parameter) => flowViewQuery(db).where("owner_key", "=", parameter((value) => value)).orderBy("created_at", "desc").orderBy("flow_id", "asc")))(ownerKey).rows.map(rowToFlowRecord);
}
function readTaskFlowViewRecordInDatabase(db, flowId) {
	const queries = getTaskFlowRegistryQueries(db);
	const row = (queries.viewPoint ??= prepareSqliteQuerySync(db, (parameter) => flowViewQuery(db).where("flow_id", "=", parameter((value) => value))))(flowId).rows[0];
	return row ? rowToFlowRecord(row) : void 0;
}
function upsertTaskFlowRowInDatabase(db, row) {
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
function readTaskFlowRecord(db, flowId) {
	const queries = getTaskFlowRegistryQueries(db);
	const row = (queries.point ??= prepareSqliteQuerySync(db, (parameter) => getFlowRegistryKysely(db).selectFrom("flow_runs").selectAll().where("flow_id", "=", parameter((value) => value))))(flowId).rows[0];
	return row ? rowToFlowRecord(row) : void 0;
}
/** Select and prepare only after the owning transaction has acquired its writer. */
function syncTaskMirroredFlowRecordInDatabase(db, task, assertSelected) {
	if (!db.isTransaction) throw new Error("Task-mirrored flow synchronization requires a write transaction");
	const flowId = task.parentFlowId?.trim();
	const stored = flowId ? readTaskFlowRecord(db, flowId) : void 0;
	if (!stored) return {
		changed: false,
		flow: null
	};
	const current = normalizeRestoredFlowRecord(stored);
	if (current.syncMode !== "task_mirrored") return {
		changed: false,
		flow: current
	};
	assertSelected?.(current);
	const prepared = prepareTaskMirroredFlowSyncFromCurrent(task, current);
	if (isTaskMirroredFlowSyncUnchanged(prepared)) return {
		changed: false,
		flow: current
	};
	upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(prepared.next));
	return {
		changed: true,
		flow: prepared.next,
		previous: current
	};
}
/** The caller holds the SQLite write transaction across the revision check and update. */
function updateTaskFlowRecordInDatabase(db, params) {
	const stored = readTaskFlowRecord(db, params.flowId);
	if (!stored) return {
		applied: false,
		reason: "not_found"
	};
	return updateSelectedTaskFlowRecordInDatabase(db, normalizeRestoredFlowRecord(stored), params);
}
/** The caller selected and normalized current inside this same SQLite write transaction. */
function updateSelectedTaskFlowRecordInDatabase(db, current, params) {
	if (current.revision !== params.expectedRevision) return {
		applied: false,
		reason: "revision_conflict",
		current
	};
	let flow;
	try {
		flow = applyFlowPatch(current, params.patch);
	} catch (error) {
		return {
			applied: false,
			reason: "invalid_patch",
			error
		};
	}
	upsertTaskFlowRowInDatabase(db, bindTaskFlowRecord(flow));
	return {
		applied: true,
		previous: current,
		flow
	};
}
/** Revalidate the native flow lifecycle before recording its exact execution binding. */
function bindTaskFlowExecutionInDatabase(db, flowId, binding) {
	const kysely = getFlowRegistryKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("flow_runs").select([
		"flow_id",
		"sync_mode",
		"shape",
		"status",
		"cancel_requested_at",
		"ended_at"
	]).where("flow_id", "=", flowId));
	if (!current || !isFlowExecutionOwnerActive(current)) return "missing";
	return bindExecutionOwnerLifecycleMetadata({
		db,
		ownerKind: "flow",
		ownerId: current.flow_id,
		binding
	});
}
/** The caller keeps the flow deletion and native metadata cleanup in one transaction. */
function deleteTaskFlowRowInDatabase(db, flowId) {
	executeSqliteQuerySync(db, getFlowRegistryKysely(db).deleteFrom("flow_runs").where("flow_id", "=", flowId));
	deleteExecutionOwnerLifecycleMetadata({
		db,
		ownerKind: "flow",
		ownerIds: [flowId]
	});
}
//#endregion
//#region src/tasks/detached-task-runtime-contract.ts
const SUBAGENT_KILL_TASK_ERROR = "Subagent run killed.";
//#endregion
//#region src/tasks/task-registry-common.ts
function isActiveTaskStatus(status) {
	return status === "queued" || status === "running";
}
function assertTaskOwner(params) {
	if (!params.ownerKey.trim() && params.scopeKind !== "system") throw new Error("Task ownerKey is required.");
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
	if (params.currentRuntime === "subagent" && params.nextStatus === "cancelled" && params.nextError === "Subagent run killed." && isTerminalTaskStatus(params.currentStatus) && !(params.currentStatus === "cancelled" && params.currentError === "Subagent run killed.")) return false;
	if (params.currentStatus === params.nextStatus) return true;
	if (!isTerminalTaskStatus(params.currentStatus)) return true;
	if (!isTerminalTaskStatus(params.nextStatus)) return false;
	if (params.currentStatus === "cancelled" && (params.nextStatus === "succeeded" || params.nextStatus === "failed" || params.nextStatus === "timed_out")) return params.currentRuntime === "subagent" && params.currentEndedAt !== void 0 && params.nextEndedAt !== void 0 && params.nextEndedAt < params.currentEndedAt || params.currentRuntime === "subagent" && Boolean(params.currentChildSessionKey?.trim()) && params.currentError === "Subagent run killed.";
	return params.currentStatus === "succeeded" && params.nextStatus !== "lost";
}
function resolveTaskTerminalOutcome(params) {
	const normalized = normalizeTaskTerminalOutcome(params.terminalOutcome);
	if (normalized) return normalized;
	return params.status === "succeeded" ? "succeeded" : void 0;
}
const TASK_STATUS_BY_TERMINAL_CLASSIFICATION = {
	success: "succeeded",
	timeout: "timed_out",
	cancellation: "cancelled",
	failure: "failed"
};
function mapAgentRunTerminalOutcomeToTaskStatus(outcome) {
	return TASK_STATUS_BY_TERMINAL_CLASSIFICATION[classifyAgentRunTerminalOutcome(outcome)];
}
function resolveTaskLifecycleTerminalError(params) {
	return params.runtime === "subagent" && params.status === "cancelled" && params.terminalReason !== "superseded" ? SUBAGENT_KILL_TASK_ERROR : params.error;
}
function appendTaskEvent(event) {
	const summary = normalizeTaskSummary(event.summary);
	return {
		at: event.at,
		kind: event.kind,
		...summary ? { summary } : {}
	};
}
//#endregion
//#region src/tasks/task-registry-records.ts
function getTaskRelatedSessionIndexKeys(task) {
	return uniqueStrings([
		task.requesterSessionKey,
		task.ownerKey,
		task.childSessionKey
	].map(normalizeOptionalString).filter((key) => Boolean(key)));
}
function listTasksFromIndex(tasks, index, key) {
	const ids = index.get(key);
	if (!ids || ids.size === 0) return [];
	return [...ids].map((taskId, insertionIndex) => {
		const task = tasks.get(taskId);
		return task ? Object.assign({}, cloneTaskRecord(task), { insertionIndex }) : null;
	}).filter((task) => Boolean(task)).toSorted(compareTasksNewestFirst).map(({ insertionIndex: _insertionIndex, ...task }) => task);
}
function selectTaskRecordsForOwnerTree(tasks, taskIdsByOwnerKey, rootOwnerKeys) {
	const owners = new Set(rootOwnerKeys);
	const selected = /* @__PURE__ */ new Set();
	for (const owner of owners) {
		const key = normalizeOptionalString(owner);
		if (!key) continue;
		for (const taskId of taskIdsByOwnerKey.get(key) ?? []) {
			const task = tasks.get(taskId);
			if (!task || task.scopeKind !== "session") continue;
			selected.add(taskId);
			if (task.childSessionKey) owners.add(task.childSessionKey);
		}
	}
	return [...tasks.values()].filter((task) => selected.has(task.taskId));
}
/** Selected rows and every possible parent edge; callers still enforce identity and visibility. */
function selectTaskRecordsWithAncestors(tasks, taskIdsByChildSessionKey, taskIds, isRootTask) {
	const selected = new Set(taskIds);
	const owners = /* @__PURE__ */ new Set();
	const records = [];
	for (const taskId of selected) {
		const task = tasks.get(taskId);
		if (!task || task.scopeKind !== "session") continue;
		records.push(task);
		if (isRootTask(task) || owners.has(task.ownerKey)) continue;
		owners.add(task.ownerKey);
		for (const parentId of taskIdsByChildSessionKey.get(task.ownerKey) ?? []) selected.add(parentId);
	}
	return records;
}
/** Build the derived flow index in snapshot order to retain the latest-task tie break. */
function findLatestTaskForFlowInSnapshot(tasks, flowId) {
	const linkedTaskIds = new Set([...tasks.values()].filter((task) => task.parentFlowId?.trim() === flowId).map((task) => task.taskId));
	return listTasksFromIndex(tasks, /* @__PURE__ */ new Map([[flowId, linkedTaskIds]]), flowId)[0];
}
function compareTasksForRunIdLookup(left, right) {
	return (left.runtime === "cli" ? 1 : 0) - (right.runtime === "cli" ? 1 : 0) || left.createdAt - right.createdAt;
}
function taskRunScopeKey(task) {
	return [
		task.runtime,
		task.scopeKind,
		normalizeOptionalString(task.ownerKey) ?? "",
		normalizeOptionalString(task.childSessionKey) ?? ""
	].join("\0");
}
function filterTasksByRunScope(records, params) {
	const matches = records.filter((task) => !params.runtime || task.runtime === params.runtime);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (sessionKey) {
		const childMatches = matches.filter((task) => normalizeOptionalString(task.childSessionKey) === sessionKey);
		if (childMatches.length > 0) return childMatches;
		return matches.filter((task) => task.scopeKind === "session" && normalizeOptionalString(task.ownerKey) === sessionKey);
	}
	return new Set(matches.map((task) => taskRunScopeKey(task))).size <= 1 ? matches : [];
}
function sameTaskRunScope(left, right) {
	return left.runtime === right.runtime && left.ownerKey === right.ownerKey && left.scopeKind === right.scopeKind && left.runId === right.runId && left.childSessionKey === right.childSessionKey;
}
function captureTaskPersistenceReceipt(task) {
	if (!task.runId) throw new Error("Task persistence selection requires a run identity");
	return Object.freeze({
		taskId: task.taskId,
		runtime: task.runtime,
		ownerKey: task.ownerKey,
		scopeKind: task.scopeKind,
		runId: task.runId,
		childSessionKey: task.childSessionKey,
		createdAt: task.createdAt,
		taskKind: task.taskKind
	});
}
function matchesTaskPersistenceReceipt(task, receipt) {
	return task.taskId === receipt.taskId && task.createdAt === receipt.createdAt && task.taskKind === receipt.taskKind && sameTaskRunScope(task, receipt);
}
function cloneTaskRecord(record) {
	return {
		...record,
		...record.executionOwner ? { executionOwner: { ...record.executionOwner } } : {},
		...record.detail !== void 0 ? { detail: structuredClone(record.detail) } : {}
	};
}
function isEquivalentTaskRecord(current, next) {
	const fields = (record) => Object.fromEntries(Object.entries(record).filter(([, value]) => value !== void 0));
	return isDeepStrictEqual(fields(current), fields(next));
}
/** Observer notifications need detached metadata, never runtime-owned detail. */
function cloneTaskRecordForObserver(record) {
	const { detail: _detail, executionOwner: _executionOwner, ...snapshot } = record;
	return snapshot;
}
function normalizeTaskTimestamps(task) {
	let createdAt = task.createdAt;
	for (const candidate of [
		task.startedAt,
		task.lastEventAt,
		task.endedAt
	]) if (typeof candidate === "number" && candidate < createdAt) createdAt = candidate;
	const startedAt = typeof task.startedAt === "number" ? Math.max(task.startedAt, createdAt) : task.startedAt;
	const terminalAt = isTerminalTaskStatus(task.status) ? task.endedAt ?? task.lastEventAt ?? task.createdAt : task.endedAt;
	const endedAt = typeof terminalAt === "number" ? Math.max(terminalAt, startedAt ?? createdAt) : terminalAt;
	const lastEventAt = typeof task.lastEventAt === "number" ? Math.max(task.lastEventAt, endedAt ?? startedAt ?? createdAt) : task.lastEventAt;
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
function resolveTaskAgentId(params) {
	return normalizeOptionalString(params.agentId) ?? parseAgentSessionKey(params.childSessionKey)?.agentId ?? parseAgentSessionKey(params.ownerKey)?.agentId ?? parseAgentSessionKey(params.requesterSessionKey)?.agentId;
}
function resolveTaskRequesterAgentId(params) {
	const explicitRequesterAgentId = normalizeOptionalString(params.explicitRequesterAgentId);
	return (explicitRequesterAgentId ? normalizeAgentId(explicitRequesterAgentId) : void 0) ?? parseAgentSessionKey(params.ownerKey)?.agentId ?? parseAgentSessionKey(params.requesterSessionKey)?.agentId;
}
function resolveTaskCreateIdentity(params) {
	const requesterSessionKey = resolveTaskRequesterSessionKey(params);
	const scopeKind = resolveTaskScopeKind({
		scopeKind: params.scopeKind,
		requesterSessionKey
	});
	const ownerKey = resolveTaskOwnerKey({
		requesterSessionKey,
		ownerKey: params.ownerKey
	});
	return {
		requesterSessionKey,
		scopeKind,
		ownerKey,
		agentId: resolveTaskAgentId({
			agentId: params.agentId,
			childSessionKey: params.childSessionKey,
			ownerKey,
			requesterSessionKey
		}),
		requesterAgentId: resolveTaskRequesterAgentId({
			explicitRequesterAgentId: params.requesterAgentId,
			ownerKey,
			requesterSessionKey
		})
	};
}
function buildTaskRecordForCreate(params, identity, { now, taskId }) {
	const { requesterSessionKey, scopeKind, ownerKey, agentId, requesterAgentId } = identity;
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
	const runId = normalizeOptionalString(params.runId);
	const childSessionKey = normalizeOptionalString(params.childSessionKey);
	const record = normalizeTaskTimestamps({
		taskId,
		...params.executionOwner ? { executionOwner: { ...params.executionOwner } } : {},
		runtime: params.runtime,
		taskKind: normalizeOptionalString(params.taskKind),
		sourceId: normalizeOptionalString(params.sourceId),
		requesterSessionKey,
		ownerKey,
		scopeKind,
		...childSessionKey ? { childSessionKey } : {},
		parentFlowId: normalizeOptionalString(params.parentFlowId),
		parentTaskId: normalizeOptionalString(params.parentTaskId),
		agentId,
		requesterAgentId,
		...runId ? { runId } : {},
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
		}),
		...params.detail !== void 0 ? { detail: structuredClone(params.detail) } : {}
	});
	if (isTerminalTaskStatus(record.status) && typeof record.cleanupAfter !== "number") record.cleanupAfter = resolveTaskCleanupAfter(record);
	const requesterOrigin = normalizeDeliveryContext(params.requesterOrigin);
	return {
		record,
		deliveryState: requesterOrigin ? {
			taskId,
			requesterOrigin
		} : void 0
	};
}
function applyTaskRecordPatch(current, patch, now) {
	const updated = {
		...current,
		...patch,
		...patch.executionOwner ? { executionOwner: { ...patch.executionOwner } } : {},
		...patch.detail !== void 0 ? { detail: structuredClone(patch.detail) } : {}
	};
	if (Object.hasOwn(patch, "runId")) updated.runId = normalizeOptionalString(patch.runId);
	if (Object.hasOwn(patch, "childSessionKey")) updated.childSessionKey = normalizeOptionalString(patch.childSessionKey);
	if (!isTerminalTaskStatus(current.status) && isTerminalTaskStatus(updated.status) && patch.endedAt === void 0) updated.endedAt = patch.lastEventAt ?? now ?? Date.now();
	if (isTerminalTaskStatus(updated.status) && typeof current.lastEventAt === "number" && typeof updated.lastEventAt === "number" && updated.lastEventAt < current.lastEventAt) updated.lastEventAt = current.lastEventAt;
	const next = normalizeTaskTimestamps(updated);
	if (Object.hasOwn(patch, "error") && patch.error === void 0) delete next.error;
	if (Object.hasOwn(patch, "childSessionKey") && updated.childSessionKey === void 0) delete next.childSessionKey;
	if (Object.hasOwn(patch, "runId") && updated.runId === void 0) delete next.runId;
	if (isTerminalTaskStatus(next.status) && typeof next.cleanupAfter !== "number") {
		const createdAt = next.createdAt ?? now ?? Date.now();
		next.cleanupAfter = resolveTaskCleanupAfter({
			...next,
			createdAt
		});
	}
	return next;
}
function pickPreferredRunIdTask(matches) {
	return [...matches].toSorted(compareTasksForRunIdLookup)[0];
}
function compareTasksNewestFirst(left, right) {
	const createdAtDiff = right.createdAt - left.createdAt;
	if (createdAtDiff !== 0) return createdAtDiff;
	return (right.insertionIndex ?? 0) - (left.insertionIndex ?? 0);
}
//#endregion
//#region src/tasks/task-backing-records.ts
const TASK_BACKING_DETAIL_KIND = "task_backing_instance";
function readTaskBackingInstance(value) {
	const detail = asOptionalRecord(value);
	if (detail?.kind !== TASK_BACKING_DETAIL_KIND) return;
	if (detail.runtime === "acp") {
		const instanceId = typeof detail.instanceId === "string" ? detail.instanceId.trim() : "";
		return instanceId && typeof detail.generation === "number" && Number.isSafeInteger(detail.generation) && detail.generation > 0 ? {
			runtime: "acp",
			instanceId,
			generation: detail.generation
		} : void 0;
	}
	if (detail.runtime === "subagent" && typeof detail.generation === "number" && Number.isSafeInteger(detail.generation) && detail.generation > 0) return {
		runtime: "subagent",
		generation: detail.generation
	};
}
function readManagedTaskBacking(value) {
	const detail = asOptionalRecord(value);
	const taskId = typeof detail?.taskId === "string" ? detail.taskId.trim() : "";
	const instance = readTaskBackingInstance(detail);
	return taskId && instance ? {
		taskId,
		instance
	} : void 0;
}
function sameTaskBackingInstance(left, right) {
	return left.runtime === "acp" && right.runtime === "acp" ? left.instanceId === right.instanceId && left.generation === right.generation : left.runtime === "subagent" && right.runtime === "subagent" ? left.generation === right.generation : false;
}
function selectLatestCanonicalTaskBacking(params) {
	return params.candidates.flatMap((task) => {
		const instance = readTaskBackingInstance(task.detail);
		return instance && instance.runtime === params.runtime && task.runtime === params.runtime && task.scopeKind === params.scopeKind && task.childSessionKey?.trim() === params.childSessionKey && Boolean(task.parentFlowId?.trim() && params.isTaskMirroredFlow(task.parentFlowId.trim())) ? [{
			task,
			instance
		}] : [];
	}).toSorted((left, right) => {
		const generationDelta = right.instance.generation - left.instance.generation;
		if (generationDelta !== 0) return generationDelta;
		return right.task.createdAt - left.task.createdAt || right.task.taskId.localeCompare(left.task.taskId);
	})[0];
}
/** Exclude replaced ACP instances without changing each lookup owner's tie order. */
function filterCurrentTaskRunBackings(matches, isTaskMirroredFlow) {
	const acpScopes = /* @__PURE__ */ new Map();
	for (const task of matches) {
		const childSessionKey = normalizeOptionalString(task.childSessionKey);
		if (task.runtime !== "acp" || !childSessionKey) continue;
		const scope = JSON.stringify([
			task.scopeKind,
			normalizeOptionalString(task.agentId) ?? parseAgentSessionKey(task.childSessionKey)?.agentId,
			childSessionKey
		]);
		const group = acpScopes.get(scope);
		if (group) group.candidates.push(task);
		else acpScopes.set(scope, {
			childSessionKey,
			scopeKind: task.scopeKind,
			candidates: [task]
		});
	}
	const superseded = /* @__PURE__ */ new Set();
	for (const { childSessionKey, scopeKind, candidates } of acpScopes.values()) {
		const current = selectLatestCanonicalTaskBacking({
			runtime: "acp",
			scopeKind,
			childSessionKey,
			candidates,
			isTaskMirroredFlow
		});
		if (!current) continue;
		for (const candidate of candidates) {
			const backing = readTaskBackingInstance(candidate.detail);
			if (!backing || !sameTaskBackingInstance(backing, current.instance)) superseded.add(candidate.taskId);
		}
	}
	return matches.filter((candidate) => !superseded.has(candidate.taskId));
}
function selectCurrentCanonicalTaskBacking(params) {
	const current = selectLatestCanonicalTaskBacking(params);
	return current?.task.ownerKey === params.ownerKey && current.task.runId?.trim() === params.runId ? current : void 0;
}
function createAcpTaskBackingDetail(instanceId, generation = 1) {
	return {
		kind: TASK_BACKING_DETAIL_KIND,
		runtime: "acp",
		instanceId,
		generation
	};
}
function createSubagentTaskBackingDetail(generation) {
	return {
		kind: TASK_BACKING_DETAIL_KIND,
		runtime: "subagent",
		generation
	};
}
function createManagedTaskBackingDetail(current) {
	return current ? current.instance.runtime === "acp" ? {
		...createAcpTaskBackingDetail(current.instance.instanceId, current.instance.generation),
		taskId: current.task.taskId
	} : {
		...createSubagentTaskBackingDetail(current.instance.generation),
		taskId: current.task.taskId
	} : void 0;
}
/** The same canonical-instance decision serves native projections and admitted database reads. */
function hasAuthoritativeTaskBackingFromRecords(task, readers) {
	if (task.runtime !== "acp" && task.runtime !== "subagent") return true;
	const flowId = task.parentFlowId?.trim();
	if (!flowId || !readers.isManagedFlow(flowId)) return true;
	const childSessionKey = task.childSessionKey?.trim();
	if (!childSessionKey) return true;
	const runId = task.runId?.trim();
	const managed = readManagedTaskBacking(task.detail);
	if (!runId || !managed) return false;
	const current = readers.resolveCurrentCanonicalBacking({
		runtime: task.runtime,
		scopeKind: task.scopeKind,
		ownerKey: task.ownerKey,
		childSessionKey,
		runId
	});
	return Boolean(current && current.task.taskId === managed.taskId && sameTaskBackingInstance(current.instance, managed.instance));
}
//#endregion
//#region src/tasks/task-registry.store.kernel.ts
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
	"tool_use_count",
	"last_tool_name",
	"error",
	"progress_summary",
	"terminal_summary",
	"terminal_outcome",
	"detail_json"
];
const TASK_DELIVERY_STATE_SELECT_COLUMNS = [
	"task_id",
	"requester_origin_json",
	"last_notified_event_at"
];
function serializeJson(value) {
	return value === void 0 ? null : JSON.stringify(value) ?? null;
}
function readTaskExecutionOwner(row) {
	const host = row.execution_owner_host;
	const pid = normalizeSqliteNumber(row.execution_owner_pid ?? null);
	const startIdentity = normalizeSqliteNumber(row.execution_owner_start_identity ?? null);
	if (typeof host !== "string" || !host.trim() || pid === void 0 || !Number.isSafeInteger(pid) || pid <= 0 || startIdentity === void 0 || !Number.isSafeInteger(startIdentity) || startIdentity < 0) return;
	return {
		host,
		pid,
		startIdentity
	};
}
function rowToTaskRecord(row) {
	const startedAt = normalizeSqliteNumber(row.started_at);
	const endedAt = normalizeSqliteNumber(row.ended_at);
	const lastEventAt = normalizeSqliteNumber(row.last_event_at);
	const cleanupAfter = normalizeSqliteNumber(row.cleanup_after);
	const toolUseCount = normalizeSqliteNumber(row.tool_use_count);
	const scopeKind = parseTaskScopeKind(row.scope_kind);
	const terminalOutcome = parseOptionalTaskTerminalOutcome(row.terminal_outcome);
	const detail = parseSqliteJsonValue(row.detail_json);
	const executionOwner = readTaskExecutionOwner(row);
	const requesterSessionKey = scopeKind === "system" ? "" : row.requester_session_key?.trim() || row.owner_key;
	return normalizeTaskTimestamps({
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
		...executionOwner ? { executionOwner } : {},
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
		...toolUseCount != null ? { toolUseCount } : {},
		...row.last_tool_name ? { lastToolName: row.last_tool_name } : {},
		...row.error ? { error: row.error } : {},
		...row.progress_summary ? { progressSummary: row.progress_summary } : {},
		...row.terminal_summary !== null ? { terminalSummary: row.terminal_summary } : {},
		...terminalOutcome ? { terminalOutcome } : {},
		...detail !== void 0 ? { detail } : {}
	});
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
/** Canonically serializes a task before an outer transaction acquires the write lock. */
function bindTaskRecord(record) {
	const normalized = normalizeTaskTimestamps(record);
	return {
		task_id: normalized.taskId,
		runtime: normalized.runtime,
		task_kind: normalized.taskKind ?? null,
		source_id: normalized.sourceId ?? null,
		requester_session_key: normalized.scopeKind === "system" ? "" : normalized.requesterSessionKey,
		owner_key: normalized.ownerKey,
		scope_kind: normalized.scopeKind,
		child_session_key: normalized.childSessionKey ?? null,
		parent_flow_id: normalized.parentFlowId ?? null,
		parent_task_id: normalized.parentTaskId ?? null,
		agent_id: normalized.agentId ?? null,
		requester_agent_id: normalized.requesterAgentId ?? null,
		run_id: normalized.runId ?? null,
		execution_owner_host: normalized.executionOwner?.host ?? null,
		execution_owner_pid: normalized.executionOwner?.pid ?? null,
		execution_owner_start_identity: normalized.executionOwner?.startIdentity ?? null,
		label: normalized.label ?? null,
		task: normalized.task,
		status: normalized.status,
		delivery_status: normalized.deliveryStatus,
		notify_policy: normalized.notifyPolicy,
		created_at: normalized.createdAt,
		started_at: normalized.startedAt ?? null,
		ended_at: normalized.endedAt ?? null,
		last_event_at: normalized.lastEventAt ?? null,
		cleanup_after: normalized.cleanupAfter ?? null,
		tool_use_count: normalized.toolUseCount ?? null,
		last_tool_name: normalized.lastToolName ?? null,
		error: normalized.error ?? null,
		progress_summary: normalized.progressSummary ?? null,
		terminal_summary: normalized.terminalSummary ?? null,
		terminal_outcome: normalized.terminalOutcome ?? null,
		detail_json: serializeJson(normalized.detail)
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
const taskRegistryQueries = /* @__PURE__ */ new WeakMap();
function getTaskRegistryQueries(db) {
	let queries = taskRegistryQueries.get(db);
	if (!queries) {
		queries = {};
		taskRegistryQueries.set(db, queries);
	}
	return queries;
}
function selectTaskRows(db) {
	const query = getTaskRegistryKysely(db).selectFrom("task_runs").selectAll().orderBy("created_at", "asc").orderBy("task_id", "asc");
	return executeSqliteQuerySync(db, query).rows;
}
function selectTaskRowsByOwnerKey(db, ownerKey) {
	return executeWithCachedStatement(db, `SELECT *
       FROM task_runs NOT INDEXED
       WHERE owner_key = ?
       ORDER BY created_at ASC, task_id ASC`, [ownerKey], (statement) => statement.all(ownerKey));
}
function selectTaskRowsByRuntimeSourceId(db, runtime, sourceId) {
	const queries = getTaskRegistryQueries(db);
	if (sourceId === void 0) return (queries.runtime ??= prepareSqliteQuerySync(db, (parameter) => getTaskRegistryKysely(db).selectFrom("task_runs").selectAll().where("runtime", "=", parameter((value) => value)).orderBy("created_at", "asc").orderBy("task_id", "asc")))(runtime).rows;
	return (queries.runtimeSource ??= prepareSqliteQuerySync(db, (parameter) => getTaskRegistryKysely(db).selectFrom("task_runs").selectAll().where("runtime", "=", parameter((params) => params.runtime)).where("source_id", "=", parameter((params) => params.sourceId)).orderBy("created_at", "asc").orderBy("task_id", "asc")))({
		runtime,
		sourceId
	}).rows;
}
/** Reads task records from the caller's shared-state transaction. */
function listTaskRecordsByRuntimeSourceIdInDatabase(db, runtime, sourceId) {
	return selectTaskRowsByRuntimeSourceId(db, runtime, sourceId).map(rowToTaskRecord);
}
function readTaskRecord(db, taskId) {
	const queries = getTaskRegistryQueries(db);
	const row = (queries.point ??= prepareSqliteQuerySync(db, (parameter) => getTaskRegistryKysely(db).selectFrom("task_runs").selectAll().where("task_id", "=", parameter((value) => value))))(taskId).rows[0];
	return row ? rowToTaskRecord(row) : void 0;
}
const TASK_VIEW_SELECT_COLUMNS = TASK_RUN_SELECT_COLUMNS.filter((column) => column !== "detail_json");
function taskViewQuery(db) {
	return getTaskRegistryKysely(db).selectFrom("task_runs").select(TASK_VIEW_SELECT_COLUMNS).select((expression) => expression.val(null).as("detail_json"));
}
function compareTaskViewOrder(left, right) {
	return right.createdAt - left.createdAt;
}
function readTaskViewRecordInDatabase(db, taskId) {
	const queries = getTaskRegistryQueries(db);
	const row = (queries.viewPoint ??= prepareSqliteQuerySync(db, (parameter) => taskViewQuery(db).where("task_id", "=", parameter((value) => value))))(taskId).rows[0];
	return row ? rowToTaskRecord(row) : void 0;
}
function listTaskRecordsForOwnerReadInDatabase(db, ownerKey, relatedSessionKey) {
	const queries = getTaskRegistryQueries(db);
	const records = (queries.viewOwner ??= prepareSqliteQuerySync(db, (parameter) => taskViewQuery(db).where("owner_key", "=", parameter((value) => value)).orderBy("task_id", "desc")))(ownerKey).rows.map(rowToTaskRecord);
	return (relatedSessionKey === void 0 ? records : records.filter((record) => getTaskRelatedSessionIndexKeys(record).includes(relatedSessionKey))).toSorted(compareTaskViewOrder);
}
function listTaskRecordsForFlowReadInDatabase(db, flowId) {
	const queries = getTaskRegistryQueries(db);
	return (queries.viewFlow ??= prepareSqliteQuerySync(db, (parameter) => taskViewQuery(db).where("parent_flow_id", "=", parameter((value) => value)).orderBy("task_id", "desc")))(flowId).rows.map(rowToTaskRecord).toSorted(compareTaskViewOrder);
}
function summarizeTaskRecordsForFlowInDatabase(db, flowId) {
	const queries = getTaskRegistryQueries(db);
	const read = queries.flowSummary ??= prepareSqliteQuerySync(db, (parameter) => getTaskRegistryKysely(db).selectFrom("task_runs").select(["runtime", "status"]).select((eb) => eb.fn.countAll().as("count")).where("parent_flow_id", "=", parameter((value) => value)).groupBy(["runtime", "status"]).orderBy((eb) => eb.fn.max("task_id"), "desc"));
	const summary = createEmptyTaskRegistrySummary();
	for (const row of read(flowId).rows) addTaskRegistrySummaryCounts(summary, parseTaskRuntime(row.runtime), parseTaskStatus(row.status), coerceRequiredSqliteNumber(row.count));
	return summary;
}
function findTaskRecordByRunIdForViewInDatabase(db, runId) {
	const queries = getTaskRegistryQueries(db);
	const selected = filterCurrentTaskRunBackings((queries.viewRunId ??= prepareSqliteQuerySync(db, (parameter) => getTaskRegistryKysely(db).selectFrom("task_runs").select(TASK_VIEW_SELECT_COLUMNS).select((expression) => expression.case().when("runtime", "=", "acp").then(expression.ref("detail_json")).else(null).end().as("detail_json")).where("run_id", "=", parameter((value) => value)).orderBy("task_id", "asc")))(runId).rows.map(rowToTaskRecord), (flowId) => readTaskFlowViewRecordInDatabase(db, flowId)?.syncMode === "task_mirrored").toSorted(compareTasksForRunIdLookup)[0];
	if (!selected) return;
	const { detail: _detail, ...view } = selected;
	return view;
}
function selectTaskDeliveryStateRows(db) {
	const query = getTaskRegistryKysely(db).selectFrom("task_delivery_state").select(TASK_DELIVERY_STATE_SELECT_COLUMNS).orderBy("task_id", "asc");
	return executeSqliteQuerySync(db, query).rows;
}
/** Upserts a prebound task on the exact supplied shared-state handle. */
function upsertTaskRunRowInDatabase(database, row) {
	const { db } = database;
	ensureTaskExecutionOwnerSchema(db);
	const updates = {
		...row,
		task_id: void 0
	};
	executeSqliteQuerySync(db, getTaskRegistryKysely(db).insertInto("task_runs").values(row).onConflict((conflict) => conflict.column("task_id").doUpdateSet(updates)));
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
	deleteExecutionOwnerLifecycleMetadata({
		db,
		ownerKind: "task",
		ownerIds: [taskId]
	});
}
function readTaskRegistrySnapshot({ db, path }) {
	return runSqliteDeferredTransactionSync(db, () => {
		assertSqliteTableIntegrity(db, path, "task_runs");
		assertSqliteTableIntegrity(db, path, "task_delivery_state");
		const taskRows = selectTaskRows(db);
		const deliveryRows = selectTaskDeliveryStateRows(db);
		return {
			tasks: new Map(taskRows.map((row) => [row.task_id, rowToTaskRecord(row)])),
			deliveryStates: new Map(deliveryRows.map((row) => [row.task_id, rowToTaskDeliveryState(row)]))
		};
	});
}
/** Capture overlapping task and delivery selectors in one committed read transaction. */
function readTaskRegistryMutationSnapshotInDatabase(db, scope) {
	const scopes = "taskId" in scope ? [scope] : scope;
	const taskIds = [...new Set(scopes.map((entry) => entry.taskId))];
	const runIds = [...new Set(scopes.flatMap((entry) => entry.runId?.trim() || []))];
	const childSessionKeys = [...new Set(scopes.flatMap((entry) => entry.childSessionKey?.trim() || []))];
	return runSqliteDeferredTransactionSync(db, () => {
		const selected = getTaskRegistryKysely(db).selectFrom("task_runs").where((eb) => {
			const matches = [eb("task_runs.task_id", "in", sqliteStringSet(taskIds))];
			if (runIds.length) matches.push(eb("run_id", "in", sqliteStringSet(runIds)));
			if (childSessionKeys.length) matches.push(eb("child_session_key", "in", sqliteStringSet(childSessionKeys)));
			return eb.or(matches);
		});
		const taskRows = executeSqliteQuerySync(db, selected.leftJoin("task_delivery_state", "task_delivery_state.task_id", "task_runs.task_id").selectAll("task_runs").select([
			"task_delivery_state.task_id as delivery_task_id",
			"requester_origin_json",
			"last_notified_event_at"
		]).orderBy("created_at", "asc").orderBy("task_runs.task_id", "asc")).rows;
		const deliveryRows = taskRows.filter((row) => row.delivery_task_id !== null).toSorted((left, right) => Buffer.compare(Buffer.from(left.task_id), Buffer.from(right.task_id)));
		return {
			tasks: new Map(taskRows.map((row) => [row.task_id, rowToTaskRecord(row)])),
			deliveryStates: new Map(deliveryRows.map((row) => [row.task_id, rowToTaskDeliveryState(row)]))
		};
	});
}
/** Inspect only the supplied existing connection; never create or repair its schema. */
function readTaskRegistrySnapshotIfReady(database) {
	return hasReadableTaskRegistrySchema(database.db) ? {
		state: "ready",
		snapshot: readTaskRegistrySnapshot(database)
	} : {
		state: "migration-required",
		snapshot: {
			tasks: /* @__PURE__ */ new Map(),
			deliveryStates: /* @__PURE__ */ new Map()
		}
	};
}
function hasReadableTaskRegistrySchema(db) {
	return tableExists(db, "task_runs") && tableExists(db, "task_delivery_state") && tableHasColumns(db, "task_runs", TASK_RUN_SELECT_COLUMNS) && tableHasColumns(db, "task_delivery_state", TASK_DELIVERY_STATE_SELECT_COLUMNS);
}
function listTaskRecordsByOwnerKeyInDatabase(db, ownerKey) {
	return selectTaskRowsByOwnerKey(db, ownerKey).map(rowToTaskRecord);
}
/** Revalidate and bind the exact task row inside its caller's transaction. */
function bindTaskRunExecutionInDatabase(db, taskId, binding) {
	const kysely = getTaskRegistryKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("task_runs").select([
		"task_id",
		"status",
		"ended_at"
	]).where("task_id", "=", taskId));
	const status = current ? parseTaskStatus(current.status) : void 0;
	if (!current || status !== "queued" && status !== "running" || current.ended_at !== null) return "missing";
	return bindExecutionOwnerLifecycleMetadata({
		db,
		ownerKind: "task",
		ownerId: current.task_id,
		binding
	});
}
/** The caller's transaction covers both the task and delivery-state mutation. */
function upsertTaskWithDeliveryStateInDatabase(database, params) {
	const { db } = database;
	upsertTaskRunRowInDatabase(database, bindTaskRecord(params.task));
	if (params.deliveryState) replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(params.deliveryState));
	else executeSqliteQuerySync(db, getTaskRegistryKysely(db).deleteFrom("task_delivery_state").where("task_id", "=", params.task.taskId));
}
function upsertTaskDeliveryStateInDatabase(db, state) {
	replaceTaskDeliveryStateRow(db, bindTaskDeliveryState(state));
}
/** Retained task rows own their sessions even when their payload/status cannot be decoded. */
function hasTaskSessionOwnerInDatabase(db, sessionKey) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("task_runs").select("task_id").where((eb) => eb.or([
		eb("child_session_key", "=", sessionKey),
		eb("requester_session_key", "=", sessionKey),
		eb("owner_key", "=", sessionKey)
	])).limit(1)).rows.length > 0;
}
//#endregion
export { isActiveTaskStatus as $, buildTaskRecordForCreate as A, isEquivalentTaskRecord as B, filterCurrentTaskRunBackings as C, buildManagedTaskFlowPatch as Ct, sameTaskBackingInstance as D, normalizeRestoredFlowRecord as Dt, readTaskBackingInstance as E, isTaskMirroredFlowSyncUnchanged as Et, compareTasksForRunIdLookup as F, resolveTaskAgentId as G, matchesTaskPersistenceReceipt as H, compareTasksNewestFirst as I, selectTaskRecordsForOwnerTree as J, resolveTaskCreateIdentity as K, filterTasksByRunScope as L, cloneTaskDeliveryState as M, cloneTaskRecord as N, selectCurrentCanonicalTaskBacking as O, prepareTaskMirroredFlowSyncFromCurrent as Ot, cloneTaskRecordForObserver as P, ensureNotifyPolicy as Q, findLatestTaskForFlowInSnapshot as R, createSubagentTaskBackingDetail as S, buildFlowRecord as St, readManagedTaskBacking as T, cloneFlowRecord as Tt, normalizeTaskTimestamps as U, listTasksFromIndex as V, pickPreferredRunIdTask as W, appendTaskEvent as X, selectTaskRecordsWithAncestors as Y, assertTaskOwner as Z, upsertTaskDeliveryStateInDatabase as _, updateTaskFlowRecordInDatabase as _t, hasReadableTaskRegistrySchema as a, shouldApplyRunScopedStatusUpdate as at, createAcpTaskBackingDetail as b, areTaskFlowRecordsEqual as bt, listTaskRecordsByRuntimeSourceIdInDatabase as c, bindTaskFlowRecord as ct, readTaskRecord as d, listTaskFlowViewRecordsForOwnerInDatabase as dt, mapAgentRunTerminalOutcomeToTaskStatus as et, readTaskRegistryMutationSnapshotInDatabase as f, readTaskFlowRecord as ft, summarizeTaskRecordsForFlowInDatabase as g, updateSelectedTaskFlowRecordInDatabase as gt, readTaskViewRecordInDatabase as h, syncTaskMirroredFlowRecordInDatabase as ht, findTaskRecordByRunIdForViewInDatabase as i, resolveTaskTerminalOutcome as it, captureTaskPersistenceReceipt as j, applyTaskRecordPatch as k, selectTaskFlowRecords as kt, listTaskRecordsForFlowReadInDatabase as l, deleteTaskFlowRowInDatabase as lt, readTaskRegistrySnapshotIfReady as m, readTaskFlowViewRecordInDatabase as mt, bindTaskRunExecutionInDatabase as n, normalizeTaskSummary as nt, hasTaskSessionOwnerInDatabase as o, SUBAGENT_KILL_TASK_ERROR as ot, readTaskRegistrySnapshot as p, readTaskFlowRegistrySnapshot as pt, sameTaskRunScope as q, deleteTaskRowsWithDeliveryState as r, resolveTaskLifecycleTerminalError as rt, listTaskRecordsByOwnerKeyInDatabase as s, bindTaskFlowExecutionInDatabase as st, bindTaskRecord as t, normalizeTaskStatus as tt, listTaskRecordsForOwnerReadInDatabase as u, listTaskFlowRecordsForOwnerReadInDatabase as ut, upsertTaskRunRowInDatabase as v, upsertTaskFlowRowInDatabase as vt, hasAuthoritativeTaskBackingFromRecords as w, buildTaskMirroredFlowCreateFields as wt, createManagedTaskBackingDetail as x, assertControllerId as xt, upsertTaskWithDeliveryStateInDatabase as y, applyFlowPatch as yt, getTaskRelatedSessionIndexKeys as z };

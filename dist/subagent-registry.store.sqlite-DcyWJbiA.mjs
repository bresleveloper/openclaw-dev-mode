import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { i as getNodeSqliteKysely, l as sqliteStringSet, n as executeSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { _t as normalizeAgentRunTerminalReplySnapshot } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { i as writeSubagentRunValuesInDatabase, n as hasParentStoreColumns } from "./subagent-registry.store.kernel-BoNquCdf.mjs";
//#region src/agents/subagents/registry/subagent-delivery-state.ts
function projectSubagentRunForSessionList(entry) {
	return {
		runId: entry.runId,
		...entry.taskRunId !== void 0 ? { taskRunId: entry.taskRunId } : {},
		...entry.pauseReason ? { pauseReason: entry.pauseReason } : {},
		...entry.swarmRunId ? { swarmRunId: entry.swarmRunId } : {},
		childSessionKey: entry.childSessionKey,
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
			...entry.delivery.suspendedAt !== void 0 ? { suspendedAt: entry.delivery.suspendedAt } : {}
		} } : {}
	};
}
/** Copy only protection facts; live memory retains its existing, unnormalized semantics. */
function projectSubagentRunForMaintenance(entry) {
	return {
		runId: entry.runId,
		childSessionKey: entry.childSessionKey,
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
	entry.taskRunId = (typeof entry.taskRunId === "string" ? entry.taskRunId.trim() : "") || void 0;
	const requesterTurnRunId = typeof entry.requesterTurnRunId === "string" ? entry.requesterTurnRunId.trim() : "";
	entry.requesterTurnRunId = requesterTurnRunId || void 0;
	entry.requesterTurnYielded = requesterTurnRunId && entry.requesterTurnYielded === true ? true : void 0;
	entry.retireAfterRequesterTurn = requesterTurnRunId && entry.retireAfterRequesterTurn === true ? true : void 0;
	entry.generation = typeof entry.generation === "number" && Number.isSafeInteger(entry.generation) && entry.generation > 0 ? entry.generation : void 0;
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
		lifecycleGeneration: typeof killIntent.lifecycleGeneration === "string" && killIntent.lifecycleGeneration.trim() ? killIntent.lifecycleGeneration.trim() : void 0,
		sessionId: typeof killIntent.sessionId === "string" && killIntent.sessionId.trim() ? killIntent.sessionId.trim() : void 0,
		sessionLifecycleRevision: typeof killIntent.sessionLifecycleRevision === "string" && killIntent.sessionLifecycleRevision.trim() ? killIntent.sessionLifecycleRevision.trim() : void 0,
		suppressTaskDelivery: killIntent.suppressTaskDelivery === true ? true : void 0
	};
	if (entry.cleanupHandled === true && typeof entry.cleanupCompletedAt !== "number" && entry.delivery?.status !== "discarded") entry.cleanupHandled = false;
	return entry;
}
/** Ensures a run has a nested completion state object. */
function ensureCompletionState(entry) {
	entry.completion ??= { required: entry.expectsCompletionMessage === true };
	return entry.completion;
}
/** Ensures a run has a nested delivery state object. */
function ensureDeliveryState(entry) {
	entry.delivery ??= { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
	return entry.delivery;
}
/** Resets delivery state to its initial status for the run's completion requirement. */
function clearDeliveryState(entry) {
	entry.delivery = { status: entry.expectsCompletionMessage === false ? "not_required" : "pending" };
}
/** Returns true when delivery is suspended with a durable timestamp. */
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
/** Reads the current delivery attempt count. */
function getDeliveryAttemptCount(entry) {
	return entry.delivery?.attemptCount ?? 0;
}
/** Reads the non-empty last delivery error. */
function getDeliveryLastError(entry) {
	const error = entry.delivery?.lastError;
	return typeof error === "string" && error.trim() ? error : void 0;
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
function assertCanonicalSubagentRunRecord(entry) {
	if (!isCanonicalSubagentRunRecord(entry)) throw new Error("subagent run is missing canonical nested state");
}
function parseJson(raw) {
	return raw ? safeParseJson(raw) : void 0;
}
/** Rehydrates one sqlite row into the normalized subagent run record shape. */
function rowToSubagentRunRecord(row) {
	const stored = parseJson(row.payload_json);
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
	return record.runId && record.childSessionKey && record.requesterSessionKey ? record : null;
}
/** Canonically serializes a run before an outer transaction acquires the write lock. */
function bindSubagentRunRecord(entry) {
	return bindMutableSubagentRunRecord(structuredClone(entry));
}
/** Binds an isolated registry capture without copying its complete payload again. */
function bindCapturedSubagentRunRecord(entry) {
	assertCanonicalSubagentRunRecord(entry);
	const completion = entry.completion;
	const hadTerminalReply = Object.hasOwn(completion, "terminalReply");
	const terminalReply = completion.terminalReply;
	try {
		return bindMutableSubagentRunRecord({ ...entry });
	} finally {
		if (hadTerminalReply) completion.terminalReply = terminalReply;
		else delete completion.terminalReply;
	}
}
function bindMutableSubagentRunRecord(entry) {
	const normalized = normalizeSubagentRunState(entry);
	assertCanonicalSubagentRunRecord(normalized);
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
	#children = /* @__PURE__ */ new Map();
	#byChild = /* @__PURE__ */ new Map();
	#byController = /* @__PURE__ */ new Map();
	#nextOrder = 0;
	constructor(entries) {
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
		const controller = entry.controllerSessionKey?.trim() || requester;
		if (previous && previous.child === child && previous.requester === requester && previous.controller === controller) return;
		if (previous) this.#remove(previous);
		const membership = {
			cacheKey,
			child,
			requester,
			controller,
			order: previous?.order ?? this.#nextOrder++
		};
		this.#memberships.set(cacheKey, membership);
		if (membership.child) {
			const children = this.#children.get(membership.requester) ?? /* @__PURE__ */ new Map();
			children.set(membership.child, (children.get(membership.child) ?? 0) + 1);
			this.#children.set(membership.requester, children);
			this.#addToBucket(this.#byChild, membership.child, membership);
		}
		if (membership.controller) this.#addToBucket(this.#byController, membership.controller, membership);
	}
	selectSessions(sessionKeys, inMemoryRuns) {
		const liveChildren = buildChildren([inMemoryRuns]);
		const selected = collectKeys(sessionKeys, (requester) => this.#children.get(requester)?.keys() ?? [], (requester) => liveChildren.get(requester) ?? []);
		return {
			sessionKeys: selected,
			cacheKeys: this.#select(this.#byChild, selected)
		};
	}
	selectChildren(childKeys) {
		return this.#select(this.#byChild, childKeys);
	}
	selectControllers(controllerKeys) {
		return this.#select(this.#byController, controllerKeys);
	}
	#select(buckets, keys) {
		const selected = /* @__PURE__ */ new Set();
		for (const key of keys) for (const membership of buckets.get(key) ?? []) selected.add(membership);
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
		const children = this.#children.get(membership.requester);
		const remaining = (children?.get(membership.child) ?? 0) - 1;
		if (remaining > 0) children?.set(membership.child, remaining);
		else {
			children?.delete(membership.child);
			if (children?.size === 0) this.#children.delete(membership.requester);
		}
		this.#removeFromBucket(this.#byChild, membership.child, membership);
		this.#removeFromBucket(this.#byController, membership.controller, membership);
	}
};
//#endregion
//#region src/agents/subagents/registry/subagent-registry.store.sqlite.ts
function parentStoreColumns(db) {
	return hasParentStoreColumns(db) ? ["requester_store_path", "controller_store_path"] : [sql.val(null).as("requester_store_path"), sql.val(null).as("controller_store_path")];
}
function readSubagentRun(database, runId) {
	const row = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("subagent_runs").selectAll().where("run_id", "=", runId)).rows[0];
	return row ? rowToSubagentRunRecord(row) : null;
}
function writeSubagentRunValues(values, deleteRunIds, retainedRunIds) {
	if (values.length === 0 && deleteRunIds?.length === 0 && retainedRunIds === void 0) return;
	runOpenClawStateWriteTransaction((database) => writeSubagentRunValuesInDatabase(database, values, deleteRunIds, retainedRunIds));
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
function subagentPayloadJsonValue(path) {
	return sql`json_extract(payload_json, ${path})`;
}
function canonicalSubagentPayloadFilter() {
	return sql`json_valid(payload_json)
    AND json_type(payload_json, '$.execution') = 'object'
    AND json_extract(payload_json, '$.execution.status')
      IN ('queued', 'running', 'interrupted', 'terminal')
    AND json_type(payload_json, '$.completion') = 'object'
    AND json_type(payload_json, '$.completion.required') IN ('true', 'false')
    AND json_type(payload_json, '$.delivery') = 'object'
    AND json_extract(payload_json, '$.delivery.status')
      IN (
        'not_required',
        'pending',
        'in_progress',
        'delivered',
        'failed',
        'suspended',
        'discarded'
      )
    AND json_type(payload_json, '$.delivery.handoffLeaseId') IS NULL
    AND json_type(payload_json, '$.delivery.handoffLeasedAt') IS NULL
    AND json_type(payload_json, '$.delivery.handoffInjectedAt') IS NULL`;
}
const subagentRetainedPayloadPaths = [
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
];
const subagentMetadataPayload = sql`CASE WHEN json_valid(payload_json) THEN json_remove(
    CASE WHEN json_type(payload_json, '$.parentCompletion') = 'object'
      AND json_extract(payload_json, '$.parentCompletion.completionTarget') = 'parent'
      THEN json_extract(payload_json, '$.parentCompletion') ELSE payload_json END,
    ${sql.join(subagentRetainedPayloadPaths)}
  ) ELSE payload_json END`;
const subagentMaintenancePayload = sql`CASE WHEN json_valid(payload_json)
      AND length(CAST(payload_json AS BLOB)) = length(CAST(printf('%s', payload_json) AS BLOB))
    THEN json_remove(payload_json, ${sql.join(subagentRetainedPayloadPaths.flatMap((path) => [path, `$.parentCompletion${path.slice(1)}`]))})
    ELSE payload_json END`;
function readSubagentSessionListRows(scope, database = openOpenClawStateDatabase()) {
	const { db } = database;
	const stateDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, stateDb.with((cte) => cte("canonical_runs").materialized(), (query) => {
		const selected = query.selectFrom("subagent_runs").select([
			"run_id",
			"child_session_key",
			"controller_session_key",
			"requester_session_key",
			...parentStoreColumns(db),
			"created_at",
			subagentMetadataPayload.as("payload_json")
		]);
		if (scope?.runIds) return selected.where("run_id", "in", sqliteStringSet(scope.runIds));
		return scope?.controllerSessionKeys ? selected.where(subagentControllerFilter(scope.controllerSessionKeys)) : selected;
	}).selectFrom("canonical_runs").select([
		"run_id",
		"child_session_key",
		"controller_session_key",
		"requester_session_key",
		"requester_store_path",
		"controller_store_path",
		"created_at",
		subagentPayloadJsonValue("$.swarmRunId").as("swarm_run_id"),
		subagentPayloadJsonValue("$.taskRunId").as("task_run_id"),
		subagentPayloadJsonValue("$.model").as("model"),
		subagentPayloadJsonValue("$.collect").as("collect"),
		subagentPayloadJsonValue("$.groupId").as("group_id"),
		subagentPayloadJsonValue("$.swarmRequesterSessionKey").as("swarm_requester_session_key"),
		subagentPayloadJsonValue("$.collectorCompletion.status").as("collector_status"),
		subagentPayloadJsonValue("$.runTimeoutSeconds").as("run_timeout_seconds"),
		subagentPayloadJsonValue("$.execution.status").as("execution_status"),
		subagentPayloadJsonValue("$.execution.startedAt").as("started_at"),
		subagentPayloadJsonValue("$.sessionStartedAt").as("session_started_at"),
		subagentPayloadJsonValue("$.accumulatedRuntimeMs").as("accumulated_runtime_ms"),
		subagentPayloadJsonValue("$.execution.endedAt").as("ended_at"),
		subagentPayloadJsonValue("$.endedReason").as("ended_reason"),
		subagentPayloadJsonValue("$.cleanupCompletedAt").as("cleanup_completed_at"),
		subagentPayloadJsonValue("$.generation").as("generation"),
		subagentPayloadJsonValue("$.execution.outcome.status").as("outcome_status"),
		subagentPayloadJsonValue("$.delivery.status").as("delivery_status"),
		subagentPayloadJsonValue("$.requesterAgentId").as("requester_agent_id"),
		subagentPayloadJsonValue("$.delivery.suspendedAt").as("delivery_suspended_at")
	]).where(canonicalSubagentPayloadFilter()).orderBy("created_at", "asc").orderBy("run_id", "asc")).rows;
}
function rowToSubagentRunReadRecord(row) {
	const runId = row.run_id.trim();
	const childSessionKey = row.child_session_key.trim();
	const requesterSessionKey = row.requester_session_key.trim();
	if (!runId || !childSessionKey || !requesterSessionKey) return null;
	const outcomeStatus = row.outcome_status === "ok" || row.outcome_status === "error" || row.outcome_status === "timeout" || row.outcome_status === "unknown" ? row.outcome_status : void 0;
	const deliveryStatus = DELIVERY_STATUSES.has(row.delivery_status ?? "") ? row.delivery_status : void 0;
	const startedAt = asFiniteNumber(row.started_at);
	const endedAt = asFiniteNumber(row.ended_at);
	return Object.fromEntries(Object.entries({
		runId,
		taskRunId: row.task_run_id ?? void 0,
		swarmRunId: row.swarm_run_id || void 0,
		childSessionKey,
		controllerSessionKey: row.controller_session_key?.trim() || void 0,
		requesterSessionKey,
		requesterStorePath: row.requester_store_path ?? void 0,
		controllerStorePath: row.controller_store_path ?? void 0,
		requesterAgentId: row.requester_agent_id?.trim() || void 0,
		collect: row.collect === 1 ? true : void 0,
		groupId: row.group_id || void 0,
		swarmRequesterSessionKey: row.swarm_requester_session_key || void 0,
		collectorCompletion: row.collector_status ? { status: row.collector_status } : void 0,
		model: row.model || void 0,
		generation: asFiniteNumber(row.generation),
		createdAt: row.created_at,
		execution: {
			status: row.execution_status,
			...startedAt !== void 0 ? { startedAt } : {},
			...endedAt !== void 0 ? { endedAt } : {},
			...outcomeStatus ? { outcome: { status: outcomeStatus } } : {}
		},
		sessionStartedAt: asFiniteNumber(row.session_started_at),
		accumulatedRuntimeMs: asFiniteNumber(row.accumulated_runtime_ms),
		runTimeoutSeconds: asFiniteNumber(row.run_timeout_seconds),
		endedReason: row.ended_reason || void 0,
		cleanupCompletedAt: asFiniteNumber(row.cleanup_completed_at),
		delivery: deliveryStatus ? {
			status: deliveryStatus,
			...asFiniteNumber(row.delivery_suspended_at) !== void 0 ? { suspendedAt: row.delivery_suspended_at ?? void 0 } : {}
		} : void 0
	}).filter(([, value]) => value !== void 0));
}
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
/** Loads all persisted generations for one child session through its existing index. */
function loadSubagentRunsForChildSessionFromSqlite(childSessionKey, database) {
	return loadScopedSubagentRuns({
		kind: "child",
		sessionKey: childSessionKey
	}, database);
}
/** Loads the canonical subagent registry from shared SQLite state. */
function loadSubagentRegistryFromSqlite() {
	const runs = /* @__PURE__ */ new Map();
	for (const row of readSubagentRegistryRows()) {
		const entry = rowToSubagentRunRecord(row);
		if (entry) runs.set(entry.runId, entry);
	}
	return runs;
}
/** Uses the canonical codec without transferring retained prompts and completion results. */
function loadSubagentMaintenanceRunsFromSqlite() {
	const runs = /* @__PURE__ */ new Map();
	for (const row of readSubagentRegistryRows(void 0, void 0, "maintenance")) {
		const entry = rowToSubagentRunRecord(row);
		if (entry) runs.set(entry.runId, projectSubagentRunForMaintenance(entry));
	}
	return runs;
}
/** Select identities and their records from the same persisted read snapshot. */
function loadSubagentRunsForSessionsFromSqlite(sessionKeys, inMemoryRuns, projection) {
	const database = openOpenClawStateDatabase();
	const { db } = database;
	return runSqliteDeferredTransactionSync(db, () => {
		const identities = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("subagent_runs").select([
			"run_id",
			"child_session_key",
			"requester_session_key"
		])).rows;
		const selected = collectSubagentSessionReadKeys(sessionKeys, identities.map((row) => ({
			childSessionKey: row.child_session_key,
			requesterSessionKey: projection === "session-list" ? row.requester_session_key.trim() : row.requester_session_key
		})), inMemoryRuns);
		const selectedRunIds = new Set(identities.filter((row) => selected.has(row.child_session_key.trim())).map((row) => row.run_id.trim()));
		const runIds = identities.filter((row) => selectedRunIds.has(row.run_id.trim())).map((row) => row.run_id);
		const runs = /* @__PURE__ */ new Map();
		const complete = runIds.length === identities.length;
		if (runIds.length) {
			if (projection === "full") for (const row of readSubagentRegistryRows(complete ? void 0 : {
				kind: "runs",
				runIds
			}, database)) {
				const entry = rowToSubagentRunRecord(row);
				if (entry) runs.set(entry.runId, entry);
			}
			else for (const row of readSubagentSessionListRows({ runIds }, database)) {
				const entry = rowToSubagentRunReadRecord(row);
				if (entry) runs.set(entry.runId, entry);
			}
		}
		return {
			sessionKeys: selected,
			runs,
			complete
		};
	});
}
/** Saves the complete subagent run snapshot to sqlite and prunes rows not in the snapshot. */
function saveSubagentRegistryToSqlite(runs) {
	const values = [...runs.values()].map(bindSubagentRunRecord);
	writeSubagentRunValues(values, void 0, values.map((row) => row.run_id));
}
/** Persists only named run mutations, deleting names absent from the current registry. */
function saveSubagentRegistryChangesToSqlite(runs, changedRunIds) {
	const runIds = [...new Set(changedRunIds.map((runId) => runId.trim()).filter(Boolean))];
	const values = [];
	const deleteRunIds = [];
	for (const runId of runIds) {
		const entry = runs.get(runId);
		if (entry) values.push(bindSubagentRunRecord(entry));
		else deleteRunIds.push(runId);
	}
	writeSubagentRunValues(values, deleteRunIds);
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
export { projectSubagentRunForMaintenance as C, normalizeSubagentRunState as S, getDeliveryAttemptCount as _, loadSubagentRunsForControllerFromSqlite as a, isCompletedRequesterDeliveryBlocked as b, saveSubagentRegistryChangesToSqlite as c, collectSubagentSessionReadKeys as d, bindCapturedSubagentRunRecord as f, ensureDeliveryState as g, ensureCompletionState as h, loadSubagentRunsForChildSessionFromSqlite as i, saveSubagentRegistryToSqlite as l, clearDeliveryState as m, loadSubagentMaintenanceRunsFromSqlite as n, loadSubagentRunsForSessionsFromSqlite as o, bindSubagentRunRecord as p, loadSubagentRegistryFromSqlite as r, readSubagentRun as s, hasSubagentSessionOwnerInDatabase as t, SubagentSessionReadLookup as u, getDeliveryLastError as v, projectSubagentRunForSessionList as w, isDeliverySuspended as x, hasRetainedRequiredCompletionDelivery as y };

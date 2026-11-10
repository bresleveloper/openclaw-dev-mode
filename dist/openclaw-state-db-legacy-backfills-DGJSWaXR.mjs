import { d as asPositiveSafeInteger, f as asSafeIntegerInRange, s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import "./src-Djeo9OvP.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, b as publishSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, s as iterateSqliteQuerySync, u as prepareSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { a as tableExists, n as ensureColumn, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as estimateAcpSessionRowBytes, t as estimateAcpEventRowBytes } from "./event-ledger-bytes-BqV24T1W.mjs";
import { t as buildApprovalResolutionRef } from "./approval-resolution-ref-DRRWcLCw.mjs";
//#region src/state/openclaw-state-db-additive-columns.ts
const lazyColumns = [
	[
		"agent_deletion_journal",
		"phase",
		"TEXT",
		true
	],
	[
		"agent_database_leases",
		"provenance",
		"TEXT",
		true
	],
	[
		"user_profile_identities",
		"authorization_id",
		"TEXT"
	],
	[
		"user_profile_identities",
		"authorization_basis_json",
		"TEXT"
	],
	[
		"claw_installs",
		"bootstrap_content_digest",
		"TEXT"
	],
	[
		"claw_installs",
		"bootstrap_source_path",
		"TEXT"
	],
	[
		"worker_environments",
		"desktop_json",
		"TEXT"
	],
	[
		"worker_environments",
		"bootstrap_install_kind",
		"TEXT"
	],
	[
		"worker_environments",
		"preparation_purpose",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_adapter_identity",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_detected_format",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_format",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_id",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_mapped_json",
		"TEXT"
	],
	[
		"claw_package_refs",
		"extension_unavailable_json",
		"TEXT"
	],
	[
		"worker_environments",
		"shared_host",
		"INTEGER"
	],
	[
		"worker_environments",
		"node_setup_id",
		"TEXT"
	],
	[
		"worker_environments",
		"node_device_id",
		"TEXT"
	],
	[
		"worker_session_placements",
		"terminal_reason",
		"TEXT"
	],
	[
		"worker_session_placements",
		"terminal_at_ms",
		"INTEGER"
	],
	[
		"worker_workspace_pending_results",
		"repository_workspace_id",
		"TEXT",
		true
	],
	[
		"worker_session_placement_moves",
		"abandon_source",
		"INTEGER",
		true
	],
	[
		"worker_session_placement_moves",
		"target_machine_class",
		"TEXT",
		true
	],
	[
		"worker_session_placement_moves",
		"target_os",
		"TEXT",
		true
	],
	[
		"worktrees",
		"run_end_cleanup_json",
		"TEXT"
	],
	[
		"worktrees",
		"gc_protection_json",
		"TEXT"
	],
	[
		"device_bootstrap_tokens",
		"setup_id",
		"TEXT",
		true
	],
	[
		"session_groups",
		"cwd",
		"TEXT",
		true
	],
	[
		"session_groups",
		"worktree",
		"INTEGER",
		true
	],
	[
		"secret_store_entries",
		"allowed_hosts",
		"TEXT"
	],
	[
		"web_push_subscriptions",
		"device_id",
		"TEXT",
		true
	],
	[
		"web_push_subscriptions",
		"user_profile_id",
		"TEXT",
		true
	],
	[
		"web_push_subscriptions",
		"preferences_json",
		"TEXT",
		true
	],
	[
		"task_runs",
		"execution_owner_host",
		"TEXT",
		true
	],
	[
		"task_runs",
		"execution_owner_pid",
		"INTEGER",
		true
	],
	[
		"task_runs",
		"execution_owner_start_identity",
		"INTEGER",
		true
	],
	[
		"session_watch_cursors",
		"watcher_store_path",
		"TEXT",
		true
	],
	[
		"subagent_runs",
		"requester_store_path",
		"TEXT",
		true
	],
	[
		"subagent_runs",
		"controller_store_path",
		"TEXT",
		true
	],
	[
		"cron_jobs",
		"grant_definition_revision",
		"TEXT"
	],
	[
		"cron_jobs",
		"grant_definition_generation",
		"INTEGER"
	],
	[
		"cron_jobs",
		"grant_definition_updated_at",
		"INTEGER"
	]
];
function lazyColumnDefinitions(firstUseOnly) {
	return lazyColumns.filter((definition) => firstUseOnly === void 0 || Boolean(definition[3]) === firstUseOnly).map(([tableName, columnName, dataType]) => ({
		columnName,
		dataType,
		tableName
	}));
}
const CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions();
const CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions(false);
const CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS = lazyColumnDefinitions(true);
const ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS = {
	packageUpdatedAt: [["claw_package_refs", "updated_at_ms INTEGER NOT NULL DEFAULT 0"]],
	packageIntegrity: [["claw_package_refs", "package_integrity TEXT NOT NULL DEFAULT 'sha256:0000000000000000000000000000000000000000000000000000000000000000'"]],
	diagnosticSequence: [["diagnostic_events", "sequence INTEGER NOT NULL DEFAULT 0"]],
	cronRunLogs: [
		["worktrees", "provisioned_paths_json TEXT"],
		["apns_registrations", "relay_origin TEXT"],
		["device_pairing_pending", "refreshed_at_ms INTEGER"],
		["device_pairing_pending", "browser_origin TEXT"],
		["device_pairing_paired", "approved_via TEXT"],
		["device_pairing_paired", "browser_origin TEXT"],
		["device_pairing_paired", "operator_label TEXT"],
		["device_pairing_paired", "node_surface_json TEXT"],
		["device_pairing_paired", "pending_node_surface_json TEXT"],
		["cron_run_logs", "status TEXT"],
		["cron_run_logs", "error TEXT"],
		["cron_run_logs", "summary TEXT"],
		["cron_run_logs", "diagnostics_summary TEXT"],
		["cron_run_logs", "delivery_status TEXT"],
		["cron_run_logs", "delivery_error TEXT"],
		["cron_run_logs", "delivered INTEGER"],
		["cron_run_logs", "session_id TEXT"],
		["cron_run_logs", "session_key TEXT"],
		["cron_run_logs", "run_id TEXT"],
		["cron_run_logs", "run_at_ms INTEGER"],
		["cron_run_logs", "duration_ms INTEGER"],
		["cron_run_logs", "next_run_at_ms INTEGER"],
		["cron_run_logs", "model TEXT"],
		["cron_run_logs", "provider TEXT"],
		["cron_run_logs", "total_tokens INTEGER"],
		["cron_run_logs", "entry_json TEXT NOT NULL DEFAULT '{}'"],
		["cron_run_logs", "created_at INTEGER NOT NULL DEFAULT 0"]
	],
	acpReplay: [["acp_replay_events", "estimated_bytes INTEGER NOT NULL DEFAULT 0"], ["acp_replay_sessions", "estimated_bytes INTEGER NOT NULL DEFAULT 0"]],
	cronJobs: [
		["cron_jobs", "description TEXT"],
		["cron_jobs", "declaration_key TEXT"],
		["cron_jobs", "owner_agent_id TEXT"],
		["cron_jobs", "name TEXT NOT NULL DEFAULT ''"],
		["cron_jobs", "enabled INTEGER NOT NULL DEFAULT 1"],
		["cron_jobs", "agent_id TEXT"],
		["cron_jobs", "payload_kind TEXT NOT NULL DEFAULT 'message'"],
		["cron_jobs", "state_json TEXT NOT NULL DEFAULT '{}'"],
		["cron_jobs", "runtime_updated_at_ms INTEGER"],
		["cron_jobs", "schedule_identity TEXT"],
		["cron_jobs", "sort_order INTEGER NOT NULL DEFAULT 0"]
	],
	deliveryQueue: [
		["sandbox_registry_entries", "session_key TEXT"],
		["sandbox_registry_entries", "backend_id TEXT"],
		["sandbox_registry_entries", "runtime_label TEXT"],
		["sandbox_registry_entries", "image TEXT"],
		["sandbox_registry_entries", "created_at_ms INTEGER"],
		["sandbox_registry_entries", "last_used_at_ms INTEGER"],
		["sandbox_registry_entries", "config_label_kind TEXT"],
		["sandbox_registry_entries", "config_hash TEXT"],
		["sandbox_registry_entries", "cdp_port INTEGER"],
		["sandbox_registry_entries", "no_vnc_port INTEGER"],
		["delivery_queue_entries", "entry_kind TEXT"],
		["delivery_queue_entries", "session_key TEXT"],
		["delivery_queue_entries", "channel TEXT"],
		["delivery_queue_entries", "target TEXT"],
		["delivery_queue_entries", "account_id TEXT"],
		["delivery_queue_entries", "retry_count INTEGER NOT NULL DEFAULT 0"],
		["delivery_queue_entries", "last_attempt_at INTEGER"],
		["delivery_queue_entries", "last_error TEXT"],
		["delivery_queue_entries", "recovery_state TEXT"],
		["delivery_queue_entries", "platform_send_started_at INTEGER"]
	],
	originalMediaRoot: [["managed_outgoing_image_records", "original_media_root TEXT NOT NULL DEFAULT ''"]],
	beforeTaskAttribution: [
		["managed_outgoing_image_records", "agent_id TEXT"],
		["managed_outgoing_image_records", "cleanup_pending INTEGER NOT NULL DEFAULT 0 CHECK (cleanup_pending IN (0, 1))"],
		["current_conversation_bindings", "conversation_kind TEXT NOT NULL DEFAULT 'channel'"],
		["device_bootstrap_tokens", "pending_profile_json TEXT"],
		["gateway_restart_handoff", "restart_trace_started_at INTEGER"],
		["gateway_restart_handoff", "restart_trace_last_at INTEGER"],
		["gateway_restart_intent", "reason TEXT"],
		["gateway_restart_sentinel", "delivery_channel TEXT"],
		["gateway_restart_sentinel", "delivery_to TEXT"],
		["gateway_restart_sentinel", "delivery_account_id TEXT"],
		["gateway_restart_sentinel", "message TEXT"],
		["gateway_restart_sentinel", "continuation_json TEXT"],
		["gateway_restart_sentinel", "doctor_hint TEXT"],
		["gateway_restart_sentinel", "stats_json TEXT"],
		["gateway_boot_lifecycle", "startup_reason TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_mode TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_key_id TEXT"],
		["official_external_plugin_catalog_snapshots", "trust_signature_count INTEGER"],
		["official_external_plugin_catalog_snapshots", "trust_threshold INTEGER"],
		["official_external_plugin_catalog_snapshots", "trust_verified_at TEXT"]
	],
	taskRequester: [["task_runs", "requester_agent_id TEXT"]],
	taskRunDetails: [
		["task_runs", "tool_use_count INTEGER"],
		["task_runs", "last_tool_name TEXT"],
		["task_runs", "detail_json TEXT"]
	],
	workerEnvironments: [
		["worker_environments", "bootstrap_bundle_hash TEXT"],
		["worker_environments", "bootstrap_openclaw_version TEXT"],
		["worker_environments", "bootstrap_protocol_features_json TEXT"],
		["worker_environments", "bootstrap_install_kind TEXT"],
		["worker_environments", "owner_epoch INTEGER NOT NULL DEFAULT 0 CHECK (owner_epoch >= 0)"],
		["worker_environments", "ssh_host_key TEXT"],
		["worker_workspace_pending_results", "staged_result_ref TEXT"],
		["worker_environments", "teardown_terminal_state TEXT CHECK (teardown_terminal_state IN ('destroyed', 'failed'))"]
	]
};
//#endregion
//#region src/infra/json-object-members.ts
/** Read JSON object members without normalizing number spelling or compound values. */
function readJsonObjectMembers(json) {
	JSON.parse(json);
	const tokens = json.match(/"(?:[^"\\]|\\[\s\S])*"|[{}[\],:]|[^\s{}[\],:]+/gu) ?? [];
	const members = /* @__PURE__ */ new Map();
	if (tokens[0] !== "{") return members;
	for (let i = 1;;) {
		const keyToken = tokens[i];
		if (keyToken === void 0 || keyToken === "}") break;
		const key = JSON.parse(keyToken);
		i += 2;
		const start = i;
		let depth = 0;
		do {
			const token = tokens[i++];
			if (token === "{" || token === "[") depth++;
			else if (token === "}" || token === "]") depth--;
		} while (depth > 0);
		if (typeof key === "string" && !members.has(key)) members.set(key, tokens.slice(start, i).join(""));
		if (tokens[i] === ",") i++;
	}
	return members;
}
//#endregion
//#region src/infra/delivery-queue-retention-columns.ts
/** Match the historical SQLite policy predicate, including its scalar coercions. */
function deriveDeliveryQueueRetentionColumns(id, entryJson) {
	const absent = {
		retention_id_prefix: null,
		retention_max_age_ms: null,
		retention_max_entries: null
	};
	try {
		const policy = readJsonObjectMembers(entryJson).get("completionRetention");
		if (!policy?.startsWith("{")) return absent;
		const fields = readJsonObjectMembers(policy);
		const prefixJson = fields.get("idPrefix");
		const parsedPrefix = prefixJson?.startsWith("\"") ? JSON.parse(prefixJson) : prefixJson?.startsWith("[") || prefixJson?.startsWith("{") ? prefixJson : void 0;
		const prefix = typeof parsedPrefix === "string" ? parsedPrefix : void 0;
		const integer = (raw) => {
			const value = raw === "true" ? 1 : raw && /^-?\d+$/u.test(raw) ? Number(raw) : NaN;
			return Number.isSafeInteger(value) && value >= 1 ? value : void 0;
		};
		const age = integer(fields.get("maxAgeMs"));
		const count = integer(fields.get("maxEntries"));
		return prefix && !prefix.includes("\0") && id.startsWith(prefix) && age !== void 0 && count !== void 0 ? {
			retention_id_prefix: prefix,
			retention_max_age_ms: age,
			retention_max_entries: count
		} : absent;
	} catch {
		return absent;
	}
}
//#endregion
//#region src/infra/delivery-queue-cache.ts
const enqueued = resolveGlobalSingleton(Symbol.for("openclaw.outboundDeliveryEnqueued"), () => /* @__PURE__ */ new Set());
const onOutboundDeliveryEnqueued = (listener) => registerListener(enqueued, listener);
const notifyOutboundDeliveryEnqueued = (stateDir) => notifyListeners(enqueued, stateDir);
const emptyOutboundDeliveryQueueAdmission = {
	name: "state.empty-outbound-delivery-queue",
	read: (value) => value === true ? true : void 0
};
//#endregion
//#region src/infra/delivery-queue-sqlite-bound.ts
const COMPLETED_TOMBSTONE_RETENTION_MS = 2592e6;
function boundedDeliveryReceipts(db) {
	return getNodeSqliteKysely(db).selectFrom("delivery_queue_entries").select([
		"queue_name",
		"id",
		"enqueued_at",
		"retention_id_prefix as id_prefix",
		"retention_max_age_ms as max_age_ms",
		"retention_max_entries as max_entries"
	]).where("status", "in", ["completed", "failed"]).where("recovery_state", "=", "completed_bounded").where("retention_id_prefix", "is not", null);
}
const deliveryQueueRowColumns = [
	"id",
	"entry_json",
	"enqueued_at",
	"retry_count",
	"last_attempt_at",
	"last_error",
	"platform_send_started_at",
	"recovery_state"
];
/** Prunes bounded receipts globally or for one exact producer namespace. */
function pruneDeliveryQueueTombstones(db, now, prefix) {
	let policies = boundedDeliveryReceipts(db);
	if (prefix) policies = policies.where("queue_name", "=", prefix.queueName).where("retention_id_prefix", "=", prefix.idPrefix);
	const queueDb = getNodeSqliteKysely(db);
	const result = executeSqliteQuerySync(db, queueDb.with("policies", () => policies).with("ranked", (qb) => qb.selectFrom("policies").selectAll().select((eb) => eb.fn.agg("row_number", []).over((window) => window.partitionBy(["queue_name", "id_prefix"]).orderBy("enqueued_at", "desc").orderBy("id", "desc")).as("retention_rank"))).deleteFrom("delivery_queue_entries").where((eb) => eb(eb.refTuple("queue_name", "id"), "in", eb.selectFrom("ranked").select(["queue_name", "id"]).where((ranked) => ranked.or([ranked("enqueued_at", "<", ranked(ranked.val(now), "-", ranked.ref("max_age_ms"))), ranked("retention_rank", ">", ranked.ref("max_entries"))])).$asTuple("queue_name", "id"))));
	const ordinaryPruned = prefix ? false : pruneOrdinaryDeliveryReceipts(db, now);
	return (result.numAffectedRows ?? 0n) > 0n || ordinaryPruned;
}
/** Cheap maintenance cleanup: age predicates only, with no window sort. */
function pruneDeliveryQueueTombstoneAges(db, now) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("delivery_queue_entries").where((eb) => eb(eb.refTuple("queue_name", "id"), "in", eb.selectFrom(boundedDeliveryReceipts(db).as("policies")).select(["queue_name", "id"]).where((policy) => policy("enqueued_at", "<", policy(policy.val(now), "-", policy.ref("max_age_ms")))).$asTuple("queue_name", "id"))));
	pruneOrdinaryDeliveryReceipts(db, now);
}
/** CAS-compacts one exact row, or deletes it when no fence is authored. */
function terminalizeBoundDeliveryQueueEntry(db, queueName, id, expectedJson, failedEntry, now, expectedStatus = "pending") {
	const queueDb = getNodeSqliteKysely(db);
	const expected = {
		queue_name: queueName,
		id,
		status: expectedStatus,
		entry_json: expectedJson
	};
	const entryJson = failedEntry ? JSON.stringify(failedEntry) : "null";
	const query = failedEntry ? queueDb.updateTable("delivery_queue_entries").where((eb) => eb.and(expected)).set({
		status: "failed",
		entry_kind: null,
		session_key: null,
		channel: null,
		target: null,
		account_id: null,
		last_attempt_at: null,
		last_error: null,
		platform_send_started_at: null,
		recovery_state: failedEntry.recoveryState ?? null,
		entry_json: entryJson,
		...deriveDeliveryQueueRetentionColumns(id, entryJson),
		enqueued_at: now,
		updated_at: now,
		failed_at: now
	}) : queueDb.deleteFrom("delivery_queue_entries").where((eb) => eb.and(expected));
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
function pruneOrdinaryDeliveryReceipts(db, now) {
	return (executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("delivery_queue_entries").where("status", "=", "completed").where("enqueued_at", "<", now - COMPLETED_TOMBSTONE_RETENTION_MS).where((eb) => eb.or([eb("recovery_state", "is", null), eb("recovery_state", "not in", ["completed_permanent", "completed_bounded"])]))).numAffectedRows ?? 0n) > 0n;
}
function inflateDeliveryQueueRow(row) {
	let parsed;
	try {
		parsed = JSON.parse(row.entry_json);
	} catch {
		return null;
	}
	return {
		...parsed,
		id: row.id,
		enqueuedAt: coerceRequiredSqliteNumber(row.enqueued_at),
		retryCount: coerceRequiredSqliteNumber(row.retry_count),
		...row.last_attempt_at == null ? {} : { lastAttemptAt: coerceRequiredSqliteNumber(row.last_attempt_at) },
		...row.last_error == null ? {} : { lastError: row.last_error },
		...row.platform_send_started_at == null ? {} : { platformSendStartedAt: coerceRequiredSqliteNumber(row.platform_send_started_at) },
		...row.recovery_state == null ? {} : { recoveryState: row.recovery_state }
	};
}
function inflateDeliveryQueueRows(rows) {
	return rows.flatMap((row) => inflateDeliveryQueueRow(row) ?? []);
}
function deliveryQueueMetadata(queueName, entry) {
	const item = entry;
	return {
		entryKind: item.kind ?? queueName,
		sessionKey: item.sessionKey ?? item.session?.key,
		channel: item.channel ?? item.route?.channel ?? item.deliveryContext?.channel,
		target: item.to ?? item.route?.to ?? item.deliveryContext?.to,
		accountId: item.accountId ?? item.route?.accountId ?? item.deliveryContext?.accountId
	};
}
/** Canonically serializes a queue row before a transaction acquires the write lock. */
function bindDeliveryQueueEntry(params, now = Date.now()) {
	const status = params.status ?? "pending";
	const meta = params.metadata ?? deliveryQueueMetadata(params.queueName, params.entry);
	const entryJson = JSON.stringify(params.entry);
	return {
		mode: params.insertOnly === true ? "insert" : params.updatePendingOnly === true ? "pending" : params.completeExisting === true ? "complete" : "replace",
		row: {
			queue_name: params.queueName,
			id: params.entry.id,
			status,
			entry_kind: meta.entryKind ?? null,
			session_key: meta.sessionKey ?? null,
			channel: meta.channel ?? null,
			target: meta.target ?? null,
			account_id: meta.accountId ?? null,
			retry_count: params.entry.retryCount,
			last_attempt_at: params.entry.lastAttemptAt ?? null,
			last_error: params.entry.lastError ?? null,
			recovery_state: params.entry.recoveryState ?? null,
			platform_send_started_at: params.entry.platformSendStartedAt ?? null,
			entry_json: entryJson,
			...deriveDeliveryQueueRetentionColumns(params.entry.id, entryJson),
			enqueued_at: params.entry.enqueuedAt,
			updated_at: now,
			failed_at: status === "failed" ? now : null
		}
	};
}
function createDeliveryQueueUpsert(database, mode) {
	const queueDb = getNodeSqliteKysely(database);
	return prepareSqliteQuerySync(database, (parameter) => {
		const values = {
			status: parameter((row) => row.status),
			entry_kind: parameter((row) => row.entry_kind),
			session_key: parameter((row) => row.session_key),
			channel: parameter((row) => row.channel),
			target: parameter((row) => row.target),
			account_id: parameter((row) => row.account_id),
			retry_count: parameter((row) => row.retry_count),
			last_attempt_at: parameter((row) => row.last_attempt_at),
			last_error: parameter((row) => row.last_error),
			recovery_state: parameter((row) => row.recovery_state),
			platform_send_started_at: parameter((row) => row.platform_send_started_at),
			entry_json: parameter((row) => row.entry_json),
			retention_id_prefix: parameter((row) => row.retention_id_prefix),
			retention_max_age_ms: parameter((row) => row.retention_max_age_ms),
			retention_max_entries: parameter((row) => row.retention_max_entries),
			enqueued_at: parameter((row) => row.enqueued_at),
			updated_at: parameter((row) => row.updated_at),
			failed_at: parameter((row) => row.failed_at)
		};
		const insert = queueDb.insertInto("delivery_queue_entries").values({
			queue_name: parameter((row) => row.queue_name),
			id: parameter((row) => row.id),
			...values
		});
		return mode === "insert" ? insert.onConflict((conflict) => conflict.columns(["queue_name", "id"]).doNothing()) : insert.onConflict((conflict) => {
			const update = conflict.columns(["queue_name", "id"]).doUpdateSet(values);
			if (mode === "pending") return update.where("delivery_queue_entries.status", "=", "pending");
			return mode === "complete" ? update.where("delivery_queue_entries.status", "in", ["pending", "failed"]) : update;
		});
	});
}
const deliveryQueueUpserts = createSqliteQueryCache(() => ({}));
/** Mutates only the exact supplied shared-state handle; never opens or hardens a file. */
function upsertBoundDeliveryQueueEntryInDatabase(bound, database) {
	const queries = deliveryQueueUpserts(database.db);
	const changed = (queries[bound.mode] ??= createDeliveryQueueUpsert(database.db, bound.mode))(bound.row).numAffectedRows === 1n;
	if (changed) publishSqliteDatabaseAdmission(database.db, emptyOutboundDeliveryQueueAdmission, void 0);
	return changed;
}
/** Recovery and media custody share the same inventory of unfinished work. */
function deliveryQueueEntriesQuery(database, queueNames, mode) {
	const query = getNodeSqliteKysely(database.db).selectFrom("delivery_queue_entries").select(deliveryQueueRowColumns).where("queue_name", "in", queueNames);
	return mode === "all" ? query : query.where((eb) => mode === "pending" ? eb("status", "=", "pending") : eb.or([eb("status", "=", "pending"), eb.and([eb("status", "=", "failed"), eb("recovery_state", "=", "settlement_pending")])]));
}
function createDeliveryQueueRead(database, mode) {
	return prepareSqliteQueryTakeFirstSync(database.db, (parameter) => deliveryQueueEntriesQuery(database, [parameter((params) => params.queueName)], mode).where("id", "=", parameter((params) => params.id)));
}
const deliveryQueueReads = createSqliteQueryCache(() => ({}));
/** Reads one row from the exact supplied handle for cross-owner invariant validation. */
function loadDeliveryQueueEntryInDatabase(database, queueName, id, mode = "all") {
	const queries = deliveryQueueReads(database.db);
	const row = (queries[mode] ??= createDeliveryQueueRead(database, mode))({
		queueName,
		id
	});
	return row ? inflateDeliveryQueueRow(row) : null;
}
//#endregion
//#region src/infra/delivery-queue-sqlite.types.ts
/** Parse only the shipped completion-retention shape for one exact producer ID. */
function parseDeliveryQueueCompletionRetention(value, id) {
	if (value === "permanent") return value;
	const retention = asNullableRecord(value);
	if (!retention) return;
	const idPrefix = typeof retention.idPrefix === "string" ? retention.idPrefix : "";
	const maxAgeMs = asPositiveSafeInteger(retention.maxAgeMs);
	const maxEntries = asPositiveSafeInteger(retention.maxEntries);
	if (!idPrefix || !id.startsWith(idPrefix) || maxAgeMs === void 0 || maxEntries === void 0) return;
	return {
		idPrefix,
		maxAgeMs,
		maxEntries
	};
}
const finite = (value) => typeof value === "number" && Number.isFinite(value);
/** Recover only authored or shipped producer ownership from a failed entry. */
function inferDeliveryQueueFailureRetention(entry, id, queueName, legacyAmbiguousSendEvidence = false) {
	const explicit = parseDeliveryQueueCompletionRetention(entry.completionRetention, id) ?? parseDeliveryQueueCompletionRetention(entry.failureRetention, id);
	if (explicit) return explicit;
	const fence = asNullableRecord(asNullableRecord(entry.terminalPolicy)?.fence);
	if (fence?.kind === "none") return;
	const fenced = fence?.kind === "permanent" ? "permanent" : parseDeliveryQueueCompletionRetention(fence, id);
	if (fenced) return fenced;
	const durable = queueName === "outbound-preparing-v1" || queueName === "outbound-legacy-preparing-v1" || queueName === "outbound-prepared-migration-v1" || entry.retainOnFailure === true || asNullableRecord(entry.deliveryCompletion) !== null || queueName === "session" && finite(entry.availableAt);
	const ambiguous = legacyAmbiguousSendEvidence && (typeof entry.platformSendAttemptId === "string" && entry.platformSendAttemptId.length > 0 || finite(entry.platformSendStartedAt) || entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send" || queueName === "session" && (finite(entry.deliveryStartedAt) || typeof entry.settlementOutcome === "string" && entry.settlementOutcome.length > 0 || finite(entry.acknowledgedAt)));
	return durable || ambiguous ? "permanent" : void 0;
}
function resolveDeliveryQueueAttemptCount(entry) {
	const count = entry.attemptCount;
	return Math.max(typeof count === "number" && Number.isInteger(count) && count >= 0 ? count : 0, entry.retryCount);
}
/** Additional work needs a live claim; settling an observed outcome only needs exact ownership. */
function hasLiveDeliveryQueueClaim(entry, claimId, now) {
	const unexpired = typeof entry.availableAt === "number" && entry.availableAt > now;
	return entry.recoveryState === "producer_claimed" ? entry.producerClaimId === claimId && unexpired : (entry.recoveryState === "send_attempt_started" || entry.recoveryState === "unknown_after_send") && entry.platformSendAttemptId === claimId && (entry.requiresProducerClaim !== true || unexpired);
}
/** Strip a terminal queue row to the producer policy needed for admission. */
function projectDeliveryQueueTerminalEntry(entry, terminalAt, terminal, completionRetention) {
	const retryCount = Number.isSafeInteger(entry.retryCount) && entry.retryCount >= 0 ? entry.retryCount : 0;
	const recoveryState = completionRetention === "permanent" ? "completed_permanent" : completionRetention ? "completed_bounded" : void 0;
	return {
		id: entry.id,
		enqueuedAt: terminalAt,
		retryCount,
		...terminal === "completed" ? { acknowledgedAt: terminalAt } : { failedAt: terminalAt },
		...completionRetention ? { completionRetention } : {},
		...recoveryState ? { recoveryState } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-delivery-queue-backfill.ts
function nonNegativeSafeInteger(value) {
	const number = typeof value === "bigint" ? Number(value) : value;
	return typeof number === "number" && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
}
/** Compact every preexisting failed row without inferring replay or owner policy. */
function compactLegacyDeliveryQueueFailures(db) {
	const migrationNow = Date.now();
	const retainPending = db.prepare(`UPDATE delivery_queue_entries SET entry_json = @entryJson,
      retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
      retention_max_entries = @retention_max_entries
      WHERE queue_name = @queueName AND id = @id AND status = 'pending' AND entry_json = @previousJson`);
	const select = db.prepare(`SELECT queue_name, id, status, retry_count, entry_json, updated_at, failed_at, recovery_state
       FROM delivery_queue_entries WHERE status IN ('pending', 'failed')`);
	select.setReadBigInts(true);
	const rows = select.all();
	const remove = db.prepare(`DELETE FROM delivery_queue_entries WHERE queue_name = ? AND id = ? AND status = 'failed'`);
	const compact = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = NULL, session_key = NULL, channel = NULL, target = NULL,
            account_id = NULL, retry_count = @retryCount, last_attempt_at = NULL,
            last_error = NULL, platform_send_started_at = NULL, entry_json = @entryJson,
            retention_id_prefix = @retention_id_prefix, retention_max_age_ms = @retention_max_age_ms,
            retention_max_entries = @retention_max_entries,
            enqueued_at = @failedAt, failed_at = @failedAt, recovery_state = @recoveryState
      WHERE queue_name = @queueName AND id = @id AND status = 'failed'`);
	for (const row of rows) {
		if (row.recovery_state === "settlement_pending") continue;
		const parsedEntry = safeParseJsonRecord(String(row.entry_json));
		const entry = parsedEntry ?? {};
		const queueName = String(row.queue_name);
		const id = String(row.id);
		if (row.status === "pending") {
			if (entry.retainOnFailure !== true && inferDeliveryQueueFailureRetention(entry, id, queueName, true)) {
				const entryJson = JSON.stringify({
					...entry,
					retainOnFailure: true
				});
				retainPending.run({
					entryJson,
					queueName,
					id,
					previousJson: String(row.entry_json),
					...deriveDeliveryQueueRetentionColumns(id, entryJson)
				});
			}
			continue;
		}
		const failedAt = nonNegativeSafeInteger(row.failed_at) ?? nonNegativeSafeInteger(row.updated_at) ?? migrationNow;
		const retryCount = Math.max(nonNegativeSafeInteger(row.retry_count) ?? 0, nonNegativeSafeInteger(entry.retryCount) ?? 0);
		const retention = parsedEntry ? inferDeliveryQueueFailureRetention(entry, id, queueName, true) : "permanent";
		if (!retention) {
			remove.run(queueName, id);
			continue;
		}
		const failedEntry = projectDeliveryQueueTerminalEntry({
			id,
			retryCount
		}, failedAt, "failed", retention);
		const entryJson = JSON.stringify(failedEntry);
		compact.run({
			retryCount,
			entryJson,
			...deriveDeliveryQueueRetentionColumns(id, entryJson),
			failedAt,
			recoveryState: failedEntry.recoveryState ?? null,
			queueName,
			id
		});
	}
	pruneDeliveryQueueTombstones(db, migrationNow);
}
//#endregion
//#region src/state/openclaw-state-db-operator-approval-migration.ts
const COLUMNS = [
	"approval_id",
	"resolution_ref",
	"kind",
	"status",
	"presentation_json",
	"requested_by_device_id",
	"requested_by_client_id",
	"requested_by_device_token_auth",
	"reviewer_device_ids_json",
	"source_agent_id",
	"source_session_key",
	"source_session_id",
	"source_run_id",
	"source_tool_call_id",
	"source_tool_name",
	"audience_session_keys_json",
	"runtime_epoch",
	"created_at_ms",
	"expires_at_ms",
	"updated_at_ms",
	"decision",
	"terminal_reason",
	"resolved_at_ms",
	"resolver_kind",
	"resolver_id",
	"consumed_at_ms",
	"consumed_by"
];
const LEGACY_OPERATOR_APPROVAL_CREATE_SQL = `CREATE TABLE operator_approvals (
  approval_id TEXT NOT NULL PRIMARY KEY CHECK (
    length(approval_id) > 0 AND approval_id NOT IN ('.', '..')
  ),
  resolution_ref TEXT NOT NULL CHECK (
    length(resolution_ref) = 43 AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
  ),
  kind TEXT NOT NULL CHECK (kind IN ('exec', 'plugin')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'allowed', 'denied', 'expired', 'cancelled')),
  presentation_json TEXT NOT NULL,
  requested_by_device_id TEXT,
  requested_by_client_id TEXT,
  requested_by_device_token_auth INTEGER NOT NULL DEFAULT 0,
  reviewer_device_ids_json TEXT NOT NULL,
  source_agent_id TEXT,
  source_session_key TEXT,
  source_session_id TEXT,
  source_run_id TEXT,
  source_tool_call_id TEXT,
  source_tool_name TEXT,
  audience_session_keys_json TEXT NOT NULL,
  runtime_epoch TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  expires_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  decision TEXT CHECK (decision IN ('allow-once', 'allow-always', 'deny')),
  terminal_reason TEXT CHECK ( terminal_reason IN (
    'user', 'timeout', 'malformed-verdict', 'no-route', 'run-aborted',
    'gateway-restart', 'storage-corrupt' ) ),
  resolved_at_ms INTEGER,
  resolver_kind TEXT CHECK (resolver_kind IN ('device', 'channel', 'runtime', 'system')),
  resolver_id TEXT,
  consumed_at_ms INTEGER,
  consumed_by TEXT,
  CHECK (expires_at_ms >= created_at_ms),
  CHECK (updated_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms >= created_at_ms),
  CHECK (resolved_at_ms IS NULL OR resolved_at_ms <= updated_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms >= resolved_at_ms),
  CHECK (consumed_at_ms IS NULL OR consumed_at_ms <= updated_at_ms),
  CHECK (requested_by_device_token_auth IN (0, 1)),
  CHECK (
    ( status = 'pending' AND decision IS NULL AND terminal_reason IS NULL AND resolved_at_ms IS NULL AND resolver_kind IS NULL AND resolver_id IS NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
    OR ( status = 'allowed' AND decision IN ('allow-once', 'allow-always') AND terminal_reason = 'user' AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL )
    OR ( status = 'denied' AND decision = 'deny' AND terminal_reason IN ('user', 'malformed-verdict', 'no-route', 'storage-corrupt') AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
    OR ( status = 'expired' AND decision = 'deny' AND terminal_reason = 'timeout' AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
    OR ( status = 'cancelled' AND decision = 'deny' AND terminal_reason IN ('run-aborted', 'gateway-restart') AND resolved_at_ms IS NOT NULL AND resolver_kind IS NOT NULL AND consumed_at_ms IS NULL AND consumed_by IS NULL )
  ),
  CHECK (
    (consumed_at_ms IS NULL AND consumed_by IS NULL)
    OR ( status = 'allowed' AND decision = 'allow-once' AND consumed_at_ms IS NOT NULL AND consumed_by IS NOT NULL )
  )
) STRICT;`;
function tableSql(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tableSql.get("operator_approvals") ?? void 0;
	const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'operator_approvals'").get();
	return typeof row?.sql === "string" ? row.sql : void 0;
}
function hasCanonicalOperatorApprovalKinds(db) {
	if (!tableExists(db, "operator_approvals")) return true;
	return /kind\s+text\s+not\s+null\s+check\s*\(\s*kind\s+in\s*\(\s*'exec'\s*,\s*'plugin'\s*,\s*'system-agent'\s*\)\s*\)/.test(tableSql(db)?.toLowerCase() ?? "");
}
function assertCanonicalOperatorApprovalKinds(db, pathname) {
	if (!hasCanonicalOperatorApprovalKinds(db)) throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} has a legacy operator approval schema; run openclaw doctor --fix to migrate it.`);
}
function isCanonicalOperatorApprovalKind(value) {
	return value === "exec" || value === "plugin" || value === "system-agent";
}
function detectOperatorApprovalSchemaMigration(db, path) {
	return hasCanonicalOperatorApprovalKinds(db) ? [] : [{
		kind: "operator-approvals-system-agent",
		path
	}];
}
function normalizeDdl(sql) {
	return sql.replace(/\s+/g, " ").trim().replace(/;$/, "");
}
function canonicalOperatorApprovalCreateSql() {
	const marker = "CREATE TABLE IF NOT EXISTS operator_approvals (";
	const tableTerminator = "\n) STRICT;";
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(marker);
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf(tableTerminator, start);
	if (start < 0 || end < 0) throw new Error("canonical operator approval schema is unavailable");
	return OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 10);
}
function alterAppendedResolutionRefCreateSql(sql) {
	const resolutionRefStart = sql.indexOf("\n  resolution_ref ");
	const followingColumnStart = sql.indexOf("\n  kind ", resolutionRefStart);
	const tailColumn = "\n  consumed_by TEXT,";
	const tailColumnStart = sql.indexOf(tailColumn, followingColumnStart);
	if (resolutionRefStart < 0 || followingColumnStart < 0 || tailColumnStart < 0) throw new Error("canonical operator approval resolution reference schema is unavailable");
	return (sql.slice(0, resolutionRefStart) + sql.slice(followingColumnStart)).replace(tailColumn, `${tailColumn} resolution_ref TEXT,`);
}
function hasExactLegacyOperatorApprovalSchema(db) {
	const live = tableSql(db);
	if (!live) return false;
	const exactStrictLegacy = LEGACY_OPERATOR_APPROVAL_CREATE_SQL;
	const normalizedLive = normalizeDdl(live);
	return [exactStrictLegacy, alterAppendedResolutionRefCreateSql(exactStrictLegacy)].some((strictLegacy) => [strictLegacy, strictLegacy.replace(/\) STRICT;$/u, ");")].map(normalizeDdl).includes(normalizedLive));
}
function canonicalCreateSql() {
	return canonicalOperatorApprovalCreateSql().replace("CREATE TABLE IF NOT EXISTS operator_approvals (", "CREATE TABLE operator_approvals_migration_new (");
}
function operatorApprovalIndexSql() {
	const statements = OPENCLAW_STATE_SCHEMA_SQL.split(";").map((statement) => statement.trim()).filter((statement) => /^CREATE (?:UNIQUE )?INDEX IF NOT EXISTS idx_operator_approvals_/.test(statement));
	if (statements.length === 0) throw new Error("canonical operator approval index schema is unavailable");
	return `${statements.join(";\n")};`;
}
function repairOperatorApprovalKinds(db) {
	if (hasCanonicalOperatorApprovalKinds(db) || tableExists(db, "operator_approvals_migration_new") || !hasExactLegacyOperatorApprovalSchema(db)) return false;
	const columns = COLUMNS.join(", ");
	runSqliteImmediateTransactionSync(db, () => {
		db.exec(canonicalCreateSql());
		db.exec(`
      INSERT INTO operator_approvals_migration_new (cursor_id, ${columns})
      SELECT rowid, ${columns} FROM operator_approvals
      WHERE typeof(resolution_ref) = 'text'
        AND length(resolution_ref) = 43
        AND resolution_ref NOT GLOB '*[^A-Za-z0-9_-]*'
      ORDER BY rowid;
      DROP TABLE operator_approvals;
      ALTER TABLE operator_approvals_migration_new RENAME TO operator_approvals;
    `);
		db.exec(operatorApprovalIndexSql());
	});
	return true;
}
function repairOperatorApprovalSchema(db) {
	return repairOperatorApprovalKinds(db) ? ["Migrated shared state operator approvals → OpenClaw system changes"] : [];
}
//#endregion
//#region src/state/openclaw-state-db-legacy-backfills.ts
function ensureOperatorApprovalResolutionRefs(db) {
	if (!tableExists(db, "operator_approvals")) return;
	runSqliteImmediateTransactionSync(db, () => {
		ensureColumn(db, "operator_approvals", "resolution_ref TEXT");
		const rows = db.prepare("SELECT approval_id, kind, resolution_ref FROM operator_approvals").all();
		const update = db.prepare("UPDATE operator_approvals SET resolution_ref = ? WHERE approval_id = ?");
		for (const row of rows) {
			if (typeof row.approval_id !== "string" || !isCanonicalOperatorApprovalKind(row.kind)) throw new Error("operator approval row cannot be assigned a transport reference");
			const resolutionRef = buildApprovalResolutionRef({
				approvalId: row.approval_id,
				approvalKind: row.kind
			});
			if (row.resolution_ref !== resolutionRef) update.run(resolutionRef, row.approval_id);
		}
		if (db.prepare(`SELECT canonical.approval_id
         FROM operator_approvals AS canonical
         JOIN operator_approvals AS referenced
           ON canonical.approval_id = referenced.resolution_ref
         WHERE canonical.approval_id <> referenced.approval_id
         LIMIT 1`).get()) throw new Error("operator approval ids conflict with durable transport references");
		db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_approvals_resolution_ref
        ON operator_approvals(resolution_ref);
    `);
	});
}
function nullableTextValue(record, key) {
	if (!record || !Object.hasOwn(record, key)) return;
	const value = record[key];
	return typeof value === "string" || value === null ? value : void 0;
}
/** Promote shipped retained results before runtime hydrates canonical subagent state. */
function repairLegacySubagentRetainedResults(db) {
	if (!tableExists(db, "subagent_runs")) return;
	const repair = () => {
		const hasLegacyPendingPayload = tableHasColumn(db, "subagent_runs", "pending_final_delivery_payload_json");
		const rows = db.prepare(hasLegacyPendingPayload ? "SELECT run_id, payload_json, pending_final_delivery_payload_json FROM subagent_runs" : "SELECT run_id, payload_json FROM subagent_runs").all();
		const updateRun = db.prepare(`UPDATE subagent_runs
          SET payload_json = ?
        WHERE run_id = ?`);
		for (const row of rows) {
			const stored = safeParseJsonRecord(row.payload_json) ?? null;
			const parent = stored ? asNullableRecord(stored.parentCompletion) : null;
			const payload = parent?.completionTarget === "parent" ? parent : stored;
			const completion = payload ? asNullableRecord(payload.completion) : null;
			if (!payload || !completion) continue;
			const delivery = asNullableRecord(payload.delivery);
			const deliveryPayload = delivery ? asNullableRecord(delivery.payload) : null;
			const pendingPayload = row.pending_final_delivery_payload_json ? safeParseJsonRecord(row.pending_final_delivery_payload_json) ?? null : null;
			if (!Boolean(deliveryPayload && (Object.hasOwn(deliveryPayload, "frozenResultText") || Object.hasOwn(deliveryPayload, "fallbackFrozenResultText")) || pendingPayload && (Object.hasOwn(pendingPayload, "frozenResultText") || Object.hasOwn(pendingPayload, "fallbackFrozenResultText")))) continue;
			const legacyPrimary = nullableTextValue(deliveryPayload, "frozenResultText") ?? nullableTextValue(pendingPayload, "frozenResultText");
			const legacyFallback = nullableTextValue(deliveryPayload, "fallbackFrozenResultText") ?? nullableTextValue(pendingPayload, "fallbackFrozenResultText");
			if (nullableTextValue(completion, "resultText") == null && legacyPrimary !== void 0) completion.resultText = legacyPrimary;
			if (nullableTextValue(completion, "fallbackResultText") == null && legacyFallback !== void 0) completion.fallbackResultText = legacyFallback;
			delete deliveryPayload?.frozenResultText;
			delete deliveryPayload?.fallbackFrozenResultText;
			updateRun.run(JSON.stringify(stored), row.run_id);
		}
	};
	if (db.isTransaction) {
		repair();
		return;
	}
	runSqliteImmediateTransactionSync(db, repair);
}
/** Canonicalize shipped subagent rows whose pause/kill owner only wrote root terminal fields. */
function repairLegacySubagentExecutionPayloads(db) {
	if (!tableExists(db, "subagent_runs")) return;
	db.exec(`
    UPDATE subagent_runs
    SET payload_json = json_remove(
      CASE
        WHEN json_extract(payload_json, '$.pauseReason') = 'sessions_yield'
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
        THEN json_remove(json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt')
        ), '$.execution.outcome')
        WHEN (json_type(payload_json, '$.killReconciliation') = 'object'
          OR json_extract(payload_json, '$.endedReason') = 'subagent-killed')
          AND json_extract(payload_json, '$.execution.status') <> 'terminal'
          AND json_type(payload_json, '$.endedAt') IN ('integer', 'real')
          AND json_type(payload_json, '$.outcome') = 'object'
        THEN json_set(
          payload_json,
          '$.execution.status', 'terminal',
          '$.execution.endedAt', json_extract(payload_json, '$.endedAt'),
          '$.execution.outcome', json_extract(payload_json, '$.outcome')
        )
        ELSE payload_json
      END,
      '$.startedAt', '$.endedAt', '$.outcome'
    )
    WHERE json_valid(payload_json)
      AND (json_type(payload_json, '$.startedAt') IS NOT NULL
        OR json_type(payload_json, '$.endedAt') IS NOT NULL
        OR json_type(payload_json, '$.outcome') IS NOT NULL);
  `);
}
function backfillAcpReplayEstimatedBytes(db, columnsAdded = false) {
	if (!tableExists(db, "acp_replay_events") || !tableHasColumn(db, "acp_replay_events", "estimated_bytes")) return;
	const completionKey = "state.repair.acpReplayUtf8Accounting";
	const completionDb = tableExists(db, "config_machine_state") ? getNodeSqliteKysely(db) : void 0;
	if (!columnsAdded && completionDb && executeSqliteQueryTakeFirstSync(db, completionDb.selectFrom("config_machine_state").select("state_key").where("state_key", "=", completionKey))) return;
	const replayDb = getNodeSqliteKysely(db);
	const updateEvent = db.prepare("UPDATE acp_replay_events SET estimated_bytes = ? WHERE session_id = ? AND seq = ?");
	for (const row of iterateSqliteQuerySync(db, replayDb.selectFrom("acp_replay_events").select([
		"session_id",
		"seq",
		"session_key",
		"run_id",
		"update_json",
		"estimated_bytes"
	]))) {
		const expected = estimateAcpEventRowBytes({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			runId: row.run_id,
			updateJson: row.update_json
		});
		if (coerceRequiredSqliteNumber(row.estimated_bytes) !== expected) updateEvent.run(expected, row.session_id, row.seq);
	}
	const updateSession = db.prepare("UPDATE acp_replay_sessions SET estimated_bytes = ? WHERE session_id = ?");
	for (const row of iterateSqliteQuerySync(db, replayDb.selectFrom("acp_replay_sessions as s").select([
		"s.session_id",
		"s.session_key",
		"s.cwd",
		"s.estimated_bytes"
	]).select((eb) => eb.fn.coalesce(eb.selectFrom("acp_replay_events as e").select((events) => events.fn.sum("e.estimated_bytes").as("total")).whereRef("e.session_id", "=", "s.session_id"), eb.val(0)).as("event_bytes")))) {
		const expected = estimateAcpSessionRowBytes({
			sessionId: row.session_id,
			sessionKey: row.session_key,
			cwd: row.cwd
		}) + coerceRequiredSqliteNumber(row.event_bytes);
		if (coerceRequiredSqliteNumber(row.estimated_bytes) !== expected) updateSession.run(expected, row.session_id);
	}
	if (completionDb) executeSqliteQuerySync(db, completionDb.insertInto("config_machine_state").values({
		state_key: completionKey,
		value_json: "true",
		updated_at_ms: Date.now()
	}).onConflict((conflict) => conflict.column("state_key").doNothing()));
}
function backfillCronRunLogEntryJson(db) {
	if (!tableExists(db, "cron_run_logs") || !tableHasColumn(db, "cron_run_logs", "entry_json")) return;
	const rows = db.prepare(`SELECT store_key, job_id, seq, ts
         FROM cron_run_logs
        WHERE entry_json = '{}'`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_run_logs
        SET entry_json = ?
      WHERE store_key = ? AND job_id = ? AND seq = ?`);
	for (const row of rows) update.run(JSON.stringify({
		ts: coerceRequiredSqliteNumber(row.ts),
		jobId: row.job_id,
		action: "finished"
	}), row.store_key, row.job_id, row.seq);
}
function textField(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : null;
}
function backfillCronJobsFromJobJson(db) {
	if (!tableExists(db, "cron_jobs") || !tableHasColumn(db, "cron_jobs", "job_json") || !tableHasColumn(db, "cron_jobs", "payload_kind")) return;
	const rows = db.prepare(`SELECT store_key, job_id, job_json, updated_at
         FROM cron_jobs
        WHERE payload_kind = 'message'
           OR name = ''`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE cron_jobs
        SET name = ?,
            enabled = ?,
            agent_id = ?,
            payload_kind = ?,
            runtime_updated_at_ms = ?
      WHERE store_key = ?
        AND job_id = ?`);
	for (const row of rows) {
		const job = safeParseJsonRecord(row.job_json) ?? null;
		if (!job) continue;
		const schedule = asNullableRecord(job.schedule);
		const payload = asNullableRecord(job.payload);
		const scheduleKind = textField(schedule, "kind");
		const payloadKind = textField(payload, "kind");
		const isAt = scheduleKind === "at" && textField(schedule, "at");
		const isEvery = scheduleKind === "every" && asFiniteNumber(schedule?.everyMs) != null;
		const isCron = scheduleKind === "cron" && textField(schedule, "expr");
		const isSystemEvent = payloadKind === "systemEvent" && textField(payload, "text");
		const isAgentTurn = payloadKind === "agentTurn" && textField(payload, "message");
		if (!schedule || !payload || !isAt && !isEvery && !isCron || !isSystemEvent && !isAgentTurn) continue;
		update.run(textField(job, "name") ?? row.job_id, job.enabled === false ? 0 : 1, textField(job, "agentId"), payloadKind, asFiniteNumber(job.updatedAtMs) ?? (coerceRequiredSqliteNumber(row.updated_at) || 0), row.store_key, row.job_id);
	}
}
function backfillDeliveryQueueEntriesFromEntryJson(db) {
	if (!tableExists(db, "delivery_queue_entries") || !tableHasColumn(db, "delivery_queue_entries", "entry_json") || !tableHasColumn(db, "delivery_queue_entries", "retry_count")) return;
	compactLegacyDeliveryQueueFailures(db);
	const rows = db.prepare(`SELECT queue_name, id, entry_json
         FROM delivery_queue_entries
        WHERE status = 'pending'
          AND (retry_count = 0
            OR last_attempt_at IS NULL
            OR last_error IS NULL
            OR recovery_state IS NULL
            OR platform_send_started_at IS NULL
            OR entry_kind IS NULL
            OR session_key IS NULL
            OR channel IS NULL
            OR target IS NULL
            OR account_id IS NULL)`).all();
	if (rows.length === 0) return;
	const update = db.prepare(`UPDATE delivery_queue_entries
        SET entry_kind = COALESCE(?, entry_kind),
            session_key = COALESCE(?, session_key),
            channel = COALESCE(?, channel),
            target = COALESCE(?, target),
            account_id = COALESCE(?, account_id),
            retry_count = ?,
            last_attempt_at = COALESCE(?, last_attempt_at),
            last_error = COALESCE(?, last_error),
            recovery_state = COALESCE(?, recovery_state),
            platform_send_started_at = COALESCE(?, platform_send_started_at)
      WHERE queue_name = ?
        AND id = ?`);
	for (const row of rows) {
		const entry = safeParseJsonRecord(row.entry_json) ?? null;
		if (!entry) continue;
		const session = asNullableRecord(entry.session);
		const route = asNullableRecord(entry.route);
		const deliveryContext = asNullableRecord(entry.deliveryContext);
		update.run(textField(entry, "kind"), textField(entry, "sessionKey") ?? textField(session, "key"), textField(entry, "channel") ?? textField(route, "channel") ?? textField(deliveryContext, "channel"), textField(entry, "to") ?? textField(route, "to") ?? textField(deliveryContext, "to"), textField(entry, "accountId") ?? textField(route, "accountId") ?? textField(deliveryContext, "accountId"), asSafeIntegerInRange(entry.retryCount, { min: 0 }) ?? 0, asSafeIntegerInRange(entry.lastAttemptAt, { min: 0 }) ?? null, textField(entry, "lastError"), textField(entry, "recoveryState"), asSafeIntegerInRange(entry.platformSendStartedAt, { min: 0 }) ?? null, row.queue_name, row.id);
	}
}
//#endregion
export { CLAW_STARTUP_ADDITIVE_STATE_COLUMN_DEFINITIONS as A, upsertBoundDeliveryQueueEntryInDatabase as C, readJsonObjectMembers as D, onOutboundDeliveryEnqueued as E, CLAW_FIRST_USE_ADDITIVE_STATE_COLUMN_DEFINITIONS as O, terminalizeBoundDeliveryQueueEntry as S, notifyOutboundDeliveryEnqueued as T, deliveryQueueEntriesQuery as _, ensureOperatorApprovalResolutionRefs as a, pruneDeliveryQueueTombstoneAges as b, assertCanonicalOperatorApprovalKinds as c, hasLiveDeliveryQueueClaim as d, inferDeliveryQueueFailureRetention as f, bindDeliveryQueueEntry as g, resolveDeliveryQueueAttemptCount as h, backfillDeliveryQueueEntriesFromEntryJson as i, ORDERED_STARTUP_ADDITIVE_STATE_COLUMNS as j, CLAW_LAZY_ADDITIVE_STATE_COLUMN_DEFINITIONS as k, detectOperatorApprovalSchemaMigration as l, projectDeliveryQueueTerminalEntry as m, backfillCronJobsFromJobJson as n, repairLegacySubagentExecutionPayloads as o, parseDeliveryQueueCompletionRetention as p, backfillCronRunLogEntryJson as r, repairLegacySubagentRetainedResults as s, backfillAcpReplayEstimatedBytes as t, repairOperatorApprovalSchema as u, inflateDeliveryQueueRows as v, emptyOutboundDeliveryQueueAdmission as w, pruneDeliveryQueueTombstones as x, loadDeliveryQueueEntryInDatabase as y };

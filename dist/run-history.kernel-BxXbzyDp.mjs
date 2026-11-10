import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { B as compareCronRunRecordsNewestFirst, H as cronRunLogEntryToDetail, U as cronRunRecordStoreKey, W as cronRunRecordToRunLogEntry, X as parseCronRunDetailJson, Z as resolveCronRunRecordTimestamp } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { d as jsonPickObject, g as jsonValid } from "./json-values-BQ6WshKk.mjs";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.mjs";
import { t as publishCronRunHistoryChange } from "./run-history-changes-COkgXpaK.mjs";
import { randomUUID } from "node:crypto";
//#region src/cron/store/run-history.kernel.ts
const query = (db) => getNodeSqliteKysely(db);
const RETENTION_MS = 6048e5;
const LOST_RETENTION_MS = 864e5;
const CRON_HISTORY_KEEP_PER_JOB = 2e3;
function validateRetainedEnum(value, allowed, label) {
	if (!allowed.includes(value)) throw new Error(`Invalid persisted task ${label}: ${JSON.stringify(value)}`);
}
function normalizeCronRunTimestamps(record) {
	const originalCreatedAt = record.createdAt;
	let createdAt = originalCreatedAt;
	let startedAt = record.startedAt;
	let endedAt = record.endedAt;
	let lastEventAt = record.lastEventAt;
	for (const candidate of [
		startedAt,
		lastEventAt,
		endedAt
	]) if (candidate !== void 0 && candidate < createdAt) createdAt = candidate;
	if (startedAt !== void 0) startedAt = Math.max(startedAt, createdAt);
	if (record.status !== "queued" && record.status !== "running") endedAt ??= lastEventAt ?? originalCreatedAt;
	if (endedAt !== void 0) endedAt = Math.max(endedAt, startedAt ?? createdAt);
	if (lastEventAt !== void 0) lastEventAt = Math.max(lastEventAt, endedAt ?? startedAt ?? createdAt);
	return {
		...record,
		createdAt,
		startedAt,
		endedAt,
		lastEventAt
	};
}
/** Detail members the maintenance planner reads: `storeKey` groups rows, `kind` partitions retention. */
const CRON_RUN_PLANNING_DETAIL_KEYS = ["storeKey", "kind"];
/** Reads only Cron facts from the admitted released table, without restoring Tasks. */
function readCronRunRecordsInDatabase(db, jobId, runId, options) {
	const planningOnly = options?.planningOnly === true;
	let select = query(db).selectFrom("task_runs").select((eb) => [
		"task_id",
		"source_id",
		"run_id",
		"agent_id",
		"child_session_key",
		"created_at",
		"started_at",
		"ended_at",
		"last_event_at",
		"cleanup_after",
		"status",
		"scope_kind",
		"delivery_status",
		"notify_policy",
		"terminal_outcome",
		"error",
		planningOnly ? sql`NULL`.as("terminal_summary") : "terminal_summary",
		planningOnly ? sql`CASE WHEN ${jsonValid(db, eb.ref("detail_json"))}
            THEN ${jsonPickObject(db, eb.ref("detail_json"), CRON_RUN_PLANNING_DETAIL_KEYS)} END`.as("detail_json") : "detail_json"
	]).where("runtime", "=", "cron").orderBy("created_at", "asc").orderBy("task_id", "asc");
	if (jobId !== void 0) select = select.where("source_id", "=", jobId);
	if (runId !== void 0) select = select.where("run_id", "=", runId);
	if (options?.taskIds !== void 0) select = select.where("task_id", "in", [...options.taskIds]);
	return executeSqliteQuerySync(db, select).rows.map((row) => {
		validateRetainedEnum(row.scope_kind, ["session", "system"], "scope kind");
		if (row.terminal_outcome !== null && row.terminal_outcome !== "") validateRetainedEnum(row.terminal_outcome, ["succeeded", "blocked"], "terminal outcome");
		validateRetainedEnum(row.status, [
			"queued",
			"running",
			"succeeded",
			"failed",
			"timed_out",
			"cancelled",
			"lost"
		], "status");
		validateRetainedEnum(row.delivery_status, [
			"pending",
			"delivered",
			"session_queued",
			"failed",
			"dismissed",
			"parent_missing",
			"not_applicable"
		], "delivery status");
		validateRetainedEnum(row.notify_policy, [
			"done_only",
			"state_changes",
			"silent"
		], "notify policy");
		return normalizeCronRunTimestamps({
			id: row.task_id,
			jobId: row.source_id || null,
			runId: row.run_id || void 0,
			agentId: row.agent_id || void 0,
			sessionKey: row.child_session_key || void 0,
			createdAt: normalizeSqliteNumber(row.created_at) ?? 0,
			startedAt: normalizeSqliteNumber(row.started_at),
			endedAt: normalizeSqliteNumber(row.ended_at),
			lastEventAt: normalizeSqliteNumber(row.last_event_at),
			cleanupAfter: normalizeSqliteNumber(row.cleanup_after),
			status: row.status,
			error: row.error || void 0,
			summary: row.terminal_summary ?? void 0,
			detail: row.detail_json === null ? void 0 : parseCronRunDetailJson(row.detail_json)
		});
	});
}
/** Caller owns the exact transaction. History never authorizes execution or receipt adoption. */
function recordCronRunInDatabase(db, input) {
	const existing = readCronRunRecordsInDatabase(db, input.jobId, input.runId).find((row) => row.runId === input.runId && (cronRunRecordStoreKey(row) === input.storeKey || row.detail === void 0 && row.runId === `cron:${input.jobId}:${input.startedAt}`));
	if (existing?.endedAt !== void 0 && existing.status !== "lost" && existing.status !== "cancelled" && existing.status !== input.status && cronRunRecordToRunLogEntry(existing)) return;
	const terminal = {
		child_session_key: input.sessionKey ?? null,
		status: existing?.status === "cancelled" ? "cancelled" : input.status,
		ended_at: input.endedAt,
		last_event_at: input.endedAt,
		cleanup_after: input.endedAt + RETENTION_MS,
		error: existing?.status === "cancelled" ? existing.error ?? null : input.error ?? null,
		terminal_summary: input.summary ?? existing?.summary ?? null,
		detail_json: JSON.stringify(input.detail)
	};
	if (existing) executeSqliteQuerySync(db, query(db).updateTable("task_runs").set(terminal).where("task_id", "=", existing.id).where("runtime", "=", "cron"));
	else executeSqliteQuerySync(db, query(db).insertInto("task_runs").values({
		task_id: randomUUID(),
		runtime: "cron",
		task_kind: "automation_run",
		requester_session_key: "",
		owner_key: "",
		scope_kind: "system",
		task: input.jobId,
		delivery_status: "not_applicable",
		notify_policy: "silent",
		source_id: input.jobId,
		agent_id: input.agentId ?? null,
		run_id: input.runId,
		created_at: input.startedAt,
		started_at: input.startedAt,
		...terminal
	}));
	publishCronRunHistoryChange(db);
}
/** Queue rejection is durable even if the host never receives the commit result. */
function recordSkippedCronRequestInDatabase(db, input) {
	const requestRunId = input.receiptId ? executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("cron_run_receipts").select("request_run_id").where("receipt_id", "=", input.receiptId))?.request_run_id : void 0;
	const discriminator = input.receiptId ?? "queued";
	const suffix = requestRunId && requestRunId !== discriminator ? `:${requestRunId}` : "";
	recordCronRunInDatabase(db, {
		...input,
		runId: `${createCronExecutionId(input.jobId, input.startedAt)}:${discriminator}${suffix}`,
		status: "failed",
		detail: cronRunLogEntryToDetail({
			ts: input.endedAt,
			jobId: input.jobId,
			action: "finished",
			status: "skipped",
			error: input.error,
			runId: requestRunId ?? void 0,
			runAtMs: input.startedAt,
			durationMs: 0,
			nextRunAtMs: input.nextRunAtMs
		}, { storeKey: input.storeKey })
	});
}
function cronRunHistoryExpiry(row) {
	const defaultExpiry = resolveCronRunRecordTimestamp(row) + (row.status === "lost" ? LOST_RETENTION_MS : RETENTION_MS);
	return row.cleanupAfter === void 0 ? defaultExpiry : row.status === "lost" ? Math.min(row.cleanupAfter, defaultExpiry) : row.cleanupAfter;
}
/** Same seven-day/lost-day and separate history/quiet-count bounds as released cron rows. */
function collectExpiredCronRunIds(records, now) {
	const expired = /* @__PURE__ */ new Set();
	const partitions = /* @__PURE__ */ new Map();
	for (const row of records) {
		if (row.status === "queued" || row.status === "running") continue;
		if (now >= cronRunHistoryExpiry(row)) expired.add(row.id);
		if (row.status === "lost" || !row.jobId) continue;
		const key = JSON.stringify([
			cronRunRecordStoreKey(row),
			row.jobId,
			isRecord(row.detail) && row.detail.kind === "cron-run"
		]);
		const partition = partitions.get(key) ?? [];
		partition.push(row);
		partitions.set(key, partition);
	}
	for (const rows of partitions.values()) {
		rows.sort(compareCronRunRecordsNewestFirst);
		for (const row of rows.slice(CRON_HISTORY_KEEP_PER_JOB)) expired.add(row.id);
	}
	return expired;
}
function pruneCronRunHistoryInDatabase(db, now, schema, records = readCronRunRecordsInDatabase(db)) {
	const ids = [...collectExpiredCronRunIds(records, now)];
	for (let offset = 0; offset < ids.length; offset += 500) {
		const batch = ids.slice(offset, offset + 500);
		executeSqliteQuerySync(db, query(db).deleteFrom("task_runs").where("runtime", "=", "cron").where("task_id", "in", batch));
		if (schema.executionOwnerLifecycleBindings) executeSqliteQuerySync(db, query(db).deleteFrom("execution_owner_lifecycle_bindings").where("owner_kind", "=", "task").where("owner_id", "in", batch));
	}
	return ids.length;
}
/** Plan synchronous maintenance on the serialized writer before opening a write transaction. */
function planCronRunHistoryMaintenance(records, now, protectedJobIds) {
	const key = (row) => JSON.stringify([
		cronRunRecordStoreKey(row),
		row.jobId,
		row.runId
	]);
	const firstByRun = /* @__PURE__ */ new Map();
	for (const row of records) if (row.jobId?.trim() && row.runId?.trim() && !firstByRun.has(key(row))) firstByRun.set(key(row), row);
	const reconciliations = [];
	for (const row of records) {
		const active = row.status === "queued" || row.status === "running";
		const recoverableLost = row.status === "lost" && row.error?.trim().toLowerCase().includes("backing session missing");
		if (!active && !recoverableLost || protectedJobIds.has(row.jobId?.trim() ?? "")) continue;
		const candidate = row.jobId?.trim() && row.runId?.trim() ? firstByRun.get(key(row)) : void 0;
		const recovery = candidate && [
			"succeeded",
			"failed",
			"timed_out",
			"cancelled"
		].includes(candidate.status) ? candidate : void 0;
		let next;
		if (recovery) {
			const endedAt = resolveCronRunRecordTimestamp(recovery);
			next = normalizeCronRunTimestamps({
				...row,
				status: recovery.status,
				endedAt,
				lastEventAt: Math.max(row.lastEventAt ?? -Infinity, recovery.lastEventAt ?? endedAt),
				error: recovery.error,
				summary: recovery.summary ?? row.summary,
				detail: recovery.detail === void 0 ? row.detail : recovery.detail
			});
			next.cleanupAfter ??= resolveCronRunRecordTimestamp(next) + RETENTION_MS;
		} else {
			if (!active || now - (row.lastEventAt ?? row.startedAt ?? row.createdAt) < 3e5) continue;
			const endedAt = row.endedAt ?? now;
			const expiry = endedAt + LOST_RETENTION_MS;
			next = normalizeCronRunTimestamps({
				...row,
				status: "lost",
				endedAt,
				lastEventAt: Math.max(now, row.lastEventAt ?? -Infinity),
				cleanupAfter: Math.min(row.cleanupAfter ?? expiry, expiry),
				error: row.error ?? "backing session missing"
			});
		}
		reconciliations.push(next);
	}
	const reconciledIds = new Set(reconciliations.map((row) => row.id));
	const pruneCandidates = records.filter((row) => !reconciledIds.has(row.id));
	const expired = collectExpiredCronRunIds(pruneCandidates, now);
	let nextSweepAtMs = Infinity;
	for (const row of [...pruneCandidates, ...reconciliations]) {
		if (expired.has(row.id)) continue;
		const deadline = row.status === "queued" || row.status === "running" ? protectedJobIds.has(row.jobId?.trim() ?? "") ? now + 6e4 : (row.lastEventAt ?? row.startedAt ?? row.createdAt) + 3e5 : cronRunHistoryExpiry(row);
		nextSweepAtMs = Math.min(nextSweepAtMs, deadline);
	}
	return {
		reconciliations,
		pruneCandidates,
		prune: expired.size > 0,
		nextSweepAtMs: Number.isFinite(nextSweepAtMs) ? nextSweepAtMs : null
	};
}
function applyCronRunHistoryMaintenanceInDatabase(db, plan, now, schema) {
	for (const next of plan.reconciliations) executeSqliteQuerySync(db, query(db).updateTable("task_runs").set({
		status: next.status,
		created_at: next.createdAt,
		started_at: next.startedAt ?? null,
		ended_at: next.endedAt ?? null,
		last_event_at: next.lastEventAt ?? null,
		cleanup_after: next.cleanupAfter ?? null,
		error: next.error ?? null,
		terminal_summary: next.summary ?? null,
		detail_json: next.detail === void 0 ? null : JSON.stringify(next.detail)
	}).where("runtime", "=", "cron").where("task_id", "=", next.id));
	return {
		reconciled: plan.reconciliations.length,
		pruned: plan.prune ? pruneCronRunHistoryInDatabase(db, now, schema, plan.pruneCandidates) : 0
	};
}
//#endregion
export { recordSkippedCronRequestInDatabase as a, recordCronRunInDatabase as i, planCronRunHistoryMaintenance as n, readCronRunRecordsInDatabase as r, applyCronRunHistoryMaintenanceInDatabase as t };

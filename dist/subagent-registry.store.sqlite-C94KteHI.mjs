import { tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as ensureColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import "./subagent-session-read-scope-7jPlY84h.mjs";
import { i as rowToSubagentRunRecord } from "./subagent-registry.store.codec-D57MwX5M.mjs";
//#region src/agents/subagents/registry/subagent-registry.store.kernel.ts
const MAX_SUBAGENT_UPSERT_ROWS = 128;
const parentStoreSchemas = /* @__PURE__ */ new WeakMap();
function hasParentStoreColumns(db) {
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (!schema) throw new Error("Subagent rows require admitted schema facts");
	let present = parentStoreSchemas.get(schema);
	if (present === void 0) {
		const table = schema.tableSql.get("subagent_runs");
		const columns = table ? parseSqliteTableDefinition(table, "subagent_runs").columns : void 0;
		present = Boolean(columns?.has("requester_store_path") && columns.has("controller_store_path"));
		parentStoreSchemas.set(schema, present);
	}
	return present;
}
/** Applies selected row changes inside the caller's transaction. */
function writeSubagentRunValuesInDatabase(database, values, deleteRunIds) {
	const { db } = database;
	const stateDb = getNodeSqliteKysely(db);
	if (values.length > 0 && !hasParentStoreColumns(db)) {
		ensureColumn(db, "subagent_runs", "requester_store_path TEXT");
		ensureColumn(db, "subagent_runs", "controller_store_path TEXT");
	}
	for (let offset = 0; offset < values.length; offset += MAX_SUBAGENT_UPSERT_ROWS) executeSqliteQuerySync(db, stateDb.insertInto("subagent_runs").values(values.slice(offset, offset + MAX_SUBAGENT_UPSERT_ROWS)).onConflict((conflict) => conflict.column("run_id").doUpdateSet((eb) => ({
		child_session_key: eb.ref("excluded.child_session_key"),
		controller_session_key: eb.ref("excluded.controller_session_key"),
		requester_session_key: eb.ref("excluded.requester_session_key"),
		requester_store_path: eb.ref("excluded.requester_store_path"),
		controller_store_path: eb.ref("excluded.controller_store_path"),
		created_at: eb.ref("excluded.created_at"),
		payload_json: eb.ref("excluded.payload_json")
	}))));
	if (deleteRunIds.length > 0) executeSqliteQuerySync(db, stateDb.deleteFrom("subagent_runs").where("run_id", "in", deleteRunIds));
}
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
function readSubagentRegistryRows(scope, database, projection = "full") {
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
	"schedulerSlotId",
	"swarmLaunchReplayKey",
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
	const normalizedScope = {
		...scope,
		sessionKey: scope.sessionKey.trim()
	};
	if (!normalizedScope.sessionKey) return [];
	return readSubagentRegistryRows(normalizedScope, database).flatMap((row) => {
		const run = rowToSubagentRunRecord(row);
		return run ? [run] : [];
	});
}
function loadSubagentRunsForChildSessionFromSqlite(childSessionKey, database) {
	return loadScopedSubagentRuns({
		kind: "child",
		sessionKey: childSessionKey
	}, database);
}
//#endregion
export { writeSubagentRunValuesInDatabase as i, readSubagentRun as n, readSubagentRunRow as r, loadSubagentRunsForChildSessionFromSqlite as t };

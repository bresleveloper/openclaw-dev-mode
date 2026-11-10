import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { t as createSqliteSchemaEnsurer } from "./sqlite-schema-ensure-CwIgvH1h.mjs";
import { t as getOpenClawStateFeatureSchemaSql } from "./openclaw-state-feature-schema-CYc16G0w.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as isWorkshopChangeAction } from "./skill-versions-CLrCbrwy.mjs";
//#region src/skills/workshop/changes.kernel.ts
const WORKSHOP_ACTORS = [
	"agent",
	"review",
	"curator",
	"user"
];
function isWorkshopActor(value) {
	return WORKSHOP_ACTORS.some((actor) => actor === value);
}
const MAX_CHANGES_PER_AGENT = 500;
const ensureWorkshopChangesSchema = createSqliteSchemaEnsurer(() => getOpenClawStateFeatureSchemaSql("skill_workshop_changes", { endMarker: "ON skill_workshop_changes(agent_id, created_at_ms);" }), {
	tables: ["skill_workshop_changes"],
	indexes: ["skill_workshop_changes_cursor_id_idx", "idx_skill_workshop_changes_agent_time"]
});
/** Appends one change and keeps the newest rows per agent. */
function recordWorkshopChangeInDatabase(database, change) {
	const { db } = database;
	ensureWorkshopChangesSchema(db);
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.insertInto("skill_workshop_changes").values((eb) => ({
		cursor_id: eb.selectFrom("skill_workshop_changes").select((inner) => inner(inner.fn.coalesce(inner.fn.max("cursor_id"), inner.val(0)), "+", 1).as("cursor_id")),
		change_id: change.id,
		agent_id: change.agentId,
		skill_name: change.skillName,
		action: change.action,
		actor: change.actor,
		summary: change.summary,
		version_id: change.versionId ?? null,
		session_key: change.sessionKey ?? null,
		run_id: change.runId ?? null,
		created_at_ms: change.createdAtMs
	})));
	executeSqliteQuerySync(db, kysely.deleteFrom("skill_workshop_changes").where("agent_id", "=", change.agentId).where("change_id", "not in", kysely.selectFrom("skill_workshop_changes").select("change_id").where("agent_id", "=", change.agentId).orderBy("created_at_ms", "desc").orderBy("cursor_id", "desc").limit(MAX_CHANGES_PER_AGENT)));
}
/** Newest first; a database that never recorded a change has no table yet. */
function listWorkshopChangesInDatabase(db, query) {
	if (!tableExists(db, "skill_workshop_changes")) return [];
	let select = getNodeSqliteKysely(db).selectFrom("skill_workshop_changes").selectAll().where("agent_id", "=", query.agentId);
	if (query.beforeMs !== void 0) select = select.where("created_at_ms", "<", query.beforeMs);
	if (query.runId !== void 0) select = select.where("run_id", "=", query.runId);
	return executeSqliteQuerySync(db, select.orderBy("created_at_ms", "desc").orderBy("cursor_id", "desc").limit(query.limit)).rows.flatMap((row) => {
		if (!isWorkshopChangeAction(row.action) || !isWorkshopActor(row.actor)) return [];
		return [{
			id: row.change_id,
			agentId: row.agent_id,
			skillName: row.skill_name,
			action: row.action,
			actor: row.actor,
			summary: row.summary,
			createdAtMs: row.created_at_ms,
			...row.version_id ? { versionId: row.version_id } : {},
			...row.session_key ? { sessionKey: row.session_key } : {},
			...row.run_id ? { runId: row.run_id } : {}
		}];
	});
}
//#endregion
//#region src/skills/workshop/skill-usage.kernel.ts
function readSkillUsageInDatabase(database, skillFiles) {
	if (skillFiles.length === 0) return [];
	const kysely = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, kysely.selectFrom("skill_usage").select([
		"skill_file",
		"last_used_at_ms",
		"use_count"
	]).where("skill_file", "in", skillFiles)).rows.map((row) => ({
		skillFile: row.skill_file,
		useCount: row.use_count,
		lastUsedAtMs: row.last_used_at_ms
	}));
}
function recordSkillUsageInDatabase(database, event) {
	const kysely = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, kysely.insertInto("skill_usage").values({
		skill_file: event.skillFile,
		skill_key: event.skillKey,
		skill_name: event.skillName,
		skill_source: event.skillSource,
		first_used_at_ms: event.ts,
		last_used_at_ms: event.ts,
		use_count: 1,
		last_agent_id: event.agentId ?? null
	}).onConflict((conflict) => conflict.column("skill_file").doUpdateSet((eb) => ({
		skill_key: event.skillKey,
		skill_name: event.skillName,
		skill_source: event.skillSource,
		first_used_at_ms: eb.fn("min", [eb.ref("first_used_at_ms"), eb.val(event.ts)]),
		last_used_at_ms: eb.fn("max", [eb.ref("last_used_at_ms"), eb.val(event.ts)]),
		use_count: eb("use_count", "+", 1),
		last_agent_id: eb.case().when("last_used_at_ms", "<=", event.ts).then(event.agentId ?? null).else(eb.ref("last_agent_id")).end()
	}))));
}
//#endregion
//#region src/skills/workshop/changes.worker.ts
const skillWorkshopOperations = {
	"skills.workshop.changes.list": (input, { open }) => listWorkshopChangesInDatabase(open().db, input),
	"skills.workshop.changes.record": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((current) => recordWorkshopChangeInDatabase(current, input), {
		database: open(),
		...stateOptions()
	}, { operationLabel: "skill-workshop.changes.record" }),
	"skills.usage.read": (input, { open }) => readSkillUsageInDatabase(open(), input.skillFiles),
	"skills.usage.record": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction((current) => recordSkillUsageInDatabase(current, input), {
		database: open(),
		...stateOptions()
	})
};
//#endregion
export { skillWorkshopOperations };

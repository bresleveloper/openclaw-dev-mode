import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, d as sql } from "./kysely-sync-K7ftY-g4.mjs";
import { n as getAdmittedSqliteSchemaFacts, o as runSqliteReadOperationSync } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { i as SESSION_OWNER_COLUMN_DEFINITIONS } from "./openclaw-agent-db-additive-columns-DEY4xthY.mjs";
//#region src/config/sessions/session-accessor.sqlite-owner-projection.ts
function prepareOwnerColumnReads(database) {
	const db = getNodeSqliteKysely(database);
	return { columns: prepareSqliteQuerySync(database, () => db.selectFrom(sql`pragma_table_info('session_nodes')`.as("pragma_columns")).select(sql`name`.as("name"))) };
}
const ownerColumnAvailability = /* @__PURE__ */ new WeakMap();
function actorFromColumns(type, id) {
	const normalizedType = type === "human" || type === "agent" || type === "system" ? type : null;
	const normalizedId = normalizeOptionalString(id);
	return normalizedType && normalizedId ? {
		type: normalizedType,
		id: normalizedId
	} : void 0;
}
function readSqliteSessionOwner(row) {
	const actor = actorFromColumns(row.owner_actor_type, row.owner_actor_id);
	if (!actor) return;
	const assignedBy = actorFromColumns(row.owner_assigned_by_type, row.owner_assigned_by_id);
	const assignedAt = typeof row.owner_assigned_at === "number" && Number.isFinite(row.owner_assigned_at) ? row.owner_assigned_at : void 0;
	return {
		actor,
		...assignedBy ? { assignedBy } : {},
		...assignedAt !== void 0 ? { assignedAt } : {}
	};
}
function projectSqliteSessionOwner(entry, row) {
	const owner = readSqliteSessionOwner(row);
	return owner ? {
		...entry,
		owner
	} : entry;
}
function hasSqliteSessionOwnerColumns(database) {
	return runSqliteReadOperationSync(database, () => {
		let reads = ownerColumnAvailability.get(database);
		if (!reads) {
			reads = prepareOwnerColumnReads(database);
			ownerColumnAvailability.set(database, reads);
		}
		const revision = getAdmittedSqliteSchemaFacts(database)?.revision;
		const cached = reads.availability;
		if (revision !== void 0 && cached?.revision === revision) return cached.available;
		const tableInfoRows = reads.columns(void 0).rows;
		const columns = new Set(tableInfoRows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
		const available = SESSION_OWNER_COLUMN_DEFINITIONS.every(({ columnName }) => columns.has(columnName));
		reads.availability = revision === void 0 ? void 0 : {
			available,
			revision
		};
		return available;
	});
}
//#endregion
export { projectSqliteSessionOwner as n, readSqliteSessionOwner as r, hasSqliteSessionOwnerColumns as t };

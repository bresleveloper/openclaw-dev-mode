import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { X as SESSION_OWNER_COLUMN_DEFINITIONS, tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts, p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
//#region src/config/sessions/session-accessor.sqlite-owner-projection.ts
const ownerColumnAvailability = /* @__PURE__ */ new WeakMap();
const rawOwnerColumnRead = createSqliteQueryCache((database) => prepareSqliteQuerySync(database, () => getNodeSqliteKysely(database).selectFrom(sql`pragma_table_info('session_nodes')`.as("pragma_columns")).select(sql`name`.as("name"))));
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
		const schema = getAdmittedSqliteSchemaFacts(database);
		if (schema) {
			let available = ownerColumnAvailability.get(schema);
			if (available === void 0) {
				const definition = schema.tableSql.get("session_nodes");
				const columns = definition === void 0 ? void 0 : parseSqliteTableDefinition(definition, "session_nodes").columns;
				available = SESSION_OWNER_COLUMN_DEFINITIONS.every(({ columnName }) => columns?.has(columnName));
				ownerColumnAvailability.set(schema, available);
			}
			return available;
		}
		const tableInfoRows = rawOwnerColumnRead(database)(void 0).rows;
		const columns = new Set(tableInfoRows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
		return SESSION_OWNER_COLUMN_DEFINITIONS.every(({ columnName }) => columns.has(columnName));
	});
}
//#endregion
export { projectSqliteSessionOwner as n, readSqliteSessionOwner as r, hasSqliteSessionOwnerColumns as t };

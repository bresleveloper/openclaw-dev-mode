import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { dt as readSqlToken, tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { d as sqlitePrimaryResultCode } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { n as getPostgresPhysicalFacts } from "./physical-facts-Cvtfrs3r.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
//#region src/state/openclaw-state-db-schema-helpers.ts
const tableColumns = /* @__PURE__ */ new WeakMap();
function tableHasColumn(db, tableName, columnName) {
	return readTableColumns(db, tableName).has(columnName);
}
function readTableColumns(db, tableName) {
	if (isPostgresSqlConnection(db)) return new Set(getPostgresPhysicalFacts(db)?.catalog.flatMap((fact) => fact.table === tableName && fact.kind === "column" && fact.value && typeof fact.value === "object" && "name" in fact.value && typeof fact.value.name === "string" ? [fact.value.name] : []) ?? []);
	const schema = getAdmittedSqliteSchemaFacts(db);
	const sql = schema?.tableSql.get(tableName);
	if (schema && !sql && ![...schema.tables, ...schema.views].some((name) => name.toLowerCase() === tableName.toLowerCase())) return /* @__PURE__ */ new Set();
	if (schema && sql && /^CREATE TABLE\b/iu.test(sql) && !/\bAS\b/iu.test(sql)) {
		let tables = tableColumns.get(schema);
		const retained = tables?.get(tableName);
		if (retained) return retained;
		const definition = parseSqliteTableDefinition(sql, tableName);
		if ([...definition.columns.values()].every((column) => /^[a-z_][a-z0-9_]*$/u.test(readSqlToken(column, 0)?.raw ?? ""))) {
			const columns = new Set(definition.columns.keys());
			if (!tables) {
				tables = /* @__PURE__ */ new Map();
				tableColumns.set(schema, tables);
			}
			tables.set(tableName, columns);
			return columns;
		}
	}
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	return new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
}
/** Inspect only failed queries; native unavailability must not become a schema refusal. */
function classifySqliteTableReadError(db, tableName, columnNames, error) {
	if (isPostgresSqlConnection(db)) return error;
	if (sqlitePrimaryResultCode(error) !== 1) return error;
	try {
		const existing = readTableColumns(db, tableName);
		if (existing.size > 0 && columnNames.some((column) => !existing.has(column))) return new SqliteSchemaMismatchError(`SQLite table ${tableName} is missing required columns; run openclaw doctor --fix to repair it.`, { cause: error });
	} catch {}
	return error;
}
function tablePrimaryKeyColumns(db, tableName) {
	if (isPostgresSqlConnection(db)) {
		const value = getPostgresPhysicalFacts(db)?.catalog.find((fact) => fact.table === tableName && fact.kind === "primaryKey")?.value;
		return Array.isArray(value) ? value.filter((column) => typeof column === "string") : [];
	}
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
	if (isPostgresSqlConnection(db)) return getPostgresPhysicalFacts(db)?.catalog.some((fact) => fact.table === tableName && fact.kind === "table") ?? false;
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tables.has(tableName);
	return executeWithCachedStatement(db, "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName))?.ok === 1;
}
function ensureColumn(db, tableName, columnSql) {
	const columnName = columnSql.trim().split(/\s+/, 1)[0];
	if (!columnName || !tableExists(db, tableName) || tableHasColumn(db, tableName, columnName)) return false;
	db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnSql};`);
	return true;
}
/** Missing runtime tables are empty only before state grows beyond checkpoint bootstrap. */
function hasOpenClawStateTablesBeyondStartupCheckpoint(db) {
	if (isPostgresSqlConnection(db)) return true;
	return db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name NOT IN ('schema_meta', 'state_leases') LIMIT 1").get() !== void 0;
}
//#endregion
export { tableExists as a, readTableColumns as i, ensureColumn as n, tableHasColumn as o, hasOpenClawStateTablesBeyondStartupCheckpoint as r, tablePrimaryKeyColumns as s, classifySqliteTableReadError as t };

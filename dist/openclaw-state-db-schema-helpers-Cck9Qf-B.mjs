import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-CFxglP-_.mjs";
//#region src/state/openclaw-state-db-schema-helpers.ts
function tableHasColumn(db, tableName, columnName) {
	return tableHasColumns(db, tableName, [columnName]);
}
function tableHasColumns(db, tableName, columnNames) {
	const rows = db.prepare(`PRAGMA table_info(${tableName})`).all();
	const existing = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return columnNames.every((columnName) => existing.has(columnName));
}
function tablePrimaryKeyColumns(db, tableName) {
	return db.prepare(`PRAGMA table_info(${tableName})`).all().filter((row) => Number(row.pk ?? 0) > 0 && typeof row.name === "string").toSorted((left, right) => Number(left.pk ?? 0) - Number(right.pk ?? 0)).map((row) => row.name);
}
function tableExists(db, tableName) {
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
	return db.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name NOT IN ('schema_meta', 'state_leases') LIMIT 1").get() !== void 0;
}
//#endregion
export { tableHasColumns as a, tableHasColumn as i, hasOpenClawStateTablesBeyondStartupCheckpoint as n, tablePrimaryKeyColumns as o, tableExists as r, ensureColumn as t };

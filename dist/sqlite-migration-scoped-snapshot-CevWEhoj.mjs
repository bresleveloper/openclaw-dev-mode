import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { at as foldSqliteIdentifierCase, ut as quoteSqliteIdentifier } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as resolveExistingSqliteFileUri, o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { a as runSqliteImmediateTransactionSync, o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { f as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { a as readSqliteUserVersion, o as writeSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { c as sha256File } from "./directory-durability-B2RKADOj.mjs";
import { s as withSqliteForeignKeysDisabled } from "./sqlite-strict-CTENSqnV.mjs";
import { a as publishVerifiedSqliteFile } from "./sqlite-snapshot-u13JUemz.mjs";
import fs from "node:fs";
import path from "node:path";
import { constants as constants$1 } from "node:sqlite";
//#region src/infra/sqlite-migration-scoped-snapshot.ts
const SCOPED_MIGRATION_APPLICATION_ID = 1329810771;
const quote = quoteSqliteIdentifier;
const statisticTables = ["sqlite_stat1", "sqlite_stat4"];
const isStatisticTable = (name) => statisticTables.includes(foldSqliteIdentifierCase(name));
const identifier = string().min(1).refine((value) => !value.includes("\0"));
const tableSchema = object({
	name: identifier.refine((value) => !foldSqliteIdentifierCase(value).startsWith("sqlite_") || isStatisticTable(value)),
	sql: string().min(1).nullable(),
	columns: array(identifier),
	rowid: identifier.nullable(),
	objects: array(object({
		type: _enum(["index", "trigger"]),
		name: identifier,
		sql: string().min(1)
	}))
});
const inspectionSchema = object({
	format: literal(1),
	sourcePath: string().min(1),
	userVersion: number().int().min(0).max(2147483647),
	tables: array(tableSchema).min(1)
}).refine(({ tables }) => {
	const names = tables.map((table) => foldSqliteIdentifierCase(table.name));
	return new Set(names).size === names.length && (!names.some(isStatisticTable) || statisticTables.every((name) => names.includes(name)));
}, "Scope must contain distinct tables and declare sqlite_stat1 and sqlite_stat4 together");
var ScopedMigrationSnapshotUnsupportedError = class extends Error {
	constructor(reason) {
		super(`Table-scoped migration backup is unsupported: ${reason}`);
		this.name = "ScopedMigrationSnapshotUnsupportedError";
	}
};
function requireAuthorizer(db) {
	if (typeof db.setAuthorizer !== "function") throw new ScopedMigrationSnapshotUnsupportedError("this SQLite runtime has no DDL authorizer");
}
/** The caller holds exclusive Doctor custody until capture; reuse these catalog facts. */
function inspectScopedMigrationTables(sourcePath, tables) {
	const names = [...new Set(tables)];
	if (!names.length || new Set(names.map(foldSqliteIdentifierCase)).size !== names.length) throw new ScopedMigrationSnapshotUnsupportedError("the scope must name distinct tables");
	if (names.some(isStatisticTable) && !statisticTables.every((statistic) => names.includes(statistic))) throw new ScopedMigrationSnapshotUnsupportedError("declare sqlite_stat1 and sqlite_stat4 together");
	const source = openNodeSqliteDatabase(sourcePath, { readOnly: true });
	try {
		requireAuthorizer(source);
		const catalog = source.prepare("SELECT type, name, tbl_name, sql FROM sqlite_master").all();
		const tableKinds = source.prepare("PRAGMA table_list").all();
		if (names.some(isStatisticTable) && catalog.some((entry) => entry.name === "sqlite_stat4") && !source.prepare("SELECT sqlite_compileoption_used('ENABLE_STAT4') AS enabled").get().enabled) throw new ScopedMigrationSnapshotUnsupportedError("this SQLite runtime cannot recreate sqlite_stat4");
		return inspectionSchema.parse({
			format: 1,
			sourcePath: fs.realpathSync(sourcePath),
			userVersion: readSqliteUserVersion(source),
			tables: names.map((name) => {
				if (!identifier.safeParse(name).success || foldSqliteIdentifierCase(name).startsWith("sqlite_") && !isStatisticTable(name)) throw new ScopedMigrationSnapshotUnsupportedError(`reserved or invalid table ${name}`);
				const object = catalog.find((entry) => foldSqliteIdentifierCase(entry.name) === foldSqliteIdentifierCase(name));
				if (!object) return {
					name,
					sql: null,
					columns: [],
					rowid: null,
					objects: []
				};
				const kind = tableKinds.find((entry) => entry.name === object.name);
				if (object.type !== "table" || kind?.type !== "table" || !object.sql) throw new ScopedMigrationSnapshotUnsupportedError(`${name} is not an ordinary table`);
				if (/\bAUTOINCREMENT\b/iu.test(object.sql)) throw new ScopedMigrationSnapshotUnsupportedError(`${name} uses shared sqlite_sequence metadata`);
				const columns = source.prepare(`PRAGMA table_xinfo(${quote(object.name)})`).all();
				const rowid = kind.wr ? null : [
					"rowid",
					"_rowid_",
					"oid"
				].find((alias) => !columns.some((column) => foldSqliteIdentifierCase(column.name) === alias));
				if (rowid === void 0) throw new ScopedMigrationSnapshotUnsupportedError(`${name} hides every rowid alias`);
				return {
					name: object.name,
					sql: object.sql,
					columns: columns.filter((column) => column.hidden === 0).map((column) => column.name),
					rowid,
					objects: catalog.filter((entry) => foldSqliteIdentifierCase(entry.tbl_name) === foldSqliteIdentifierCase(object.name) && entry.sql && (entry.type === "index" || entry.type === "trigger"))
				};
			})
		});
	} finally {
		source.close();
	}
}
function* readRows(source, query, columns) {
	const projection = columns.flatMap((column, index) => [`typeof(${quote(column)}) = 'text' AS ${quote(`t${index}`)}`, `CASE WHEN typeof(${quote(column)}) = 'text' THEN CAST(${quote(column)} AS BLOB) ELSE ${quote(column)} END AS ${quote(`v${index}`)}`]);
	const reader = source.prepare(`SELECT ${projection.join(", ")} FROM (${query})`);
	reader.setReadBigInts(true);
	for (const row of reader.iterate()) yield Object.values(row);
}
function writeRows(target, insert, columns, rows) {
	const values = columns.map((_, index) => {
		const text = index * 2 + 1;
		const value = text + 1;
		return `CASE WHEN ?${text} THEN CAST(?${value} AS TEXT) ELSE ?${value} END`;
	});
	const writer = target.prepare(`${insert} VALUES (${values.join(", ")})`);
	writer.setReadBigInts(true);
	for (const row of rows) writer.run(...row);
}
function copyRows(source, query, columns, target, insert) {
	writeRows(target, insert, columns, readRows(source, query, columns));
}
function storedColumns(table) {
	return [...table.rowid ? ["saved_rowid"] : [], ...table.columns.map((_, index) => `c${index}`)];
}
function restoreRows(archive, target, table, index) {
	const columns = [...table.rowid ? [table.rowid] : [], ...table.columns];
	const saved = storedColumns(table);
	copyRows(archive, `SELECT ${saved.map(quote).join(", ")} FROM ${quote(`data_${index}`)}`, saved, target, `INSERT INTO ${quote(table.name)} (${columns.map(quote).join(", ")})`);
}
async function createScopedMigrationSnapshot(params) {
	const inspection = params.inspection ?? inspectScopedMigrationTables(params.sourcePath, params.tables);
	const directory = await createPrivateSqliteTempDirectory(path.dirname(params.targetPath), ".scoped-migration-");
	const stagedPath = path.join(directory, "archive.sqlite");
	try {
		params.beforePublish();
		const source = openNodeSqliteDatabase(params.sourcePath, { readOnly: true });
		try {
			const archive = openNodeSqliteDatabase(stagedPath);
			try {
				const encoding = String(source.prepare("PRAGMA encoding").get().encoding);
				archive.exec(`PRAGMA encoding = ${quote(encoding)}; PRAGMA application_id = ${SCOPED_MIGRATION_APPLICATION_ID}; PRAGMA trusted_schema = OFF;`);
				runSqliteReadSnapshotSync(source, () => runSqliteImmediateTransactionSync(archive, () => {
					archive.exec("CREATE TABLE migration_scope (metadata TEXT NOT NULL) STRICT;");
					archive.prepare("INSERT INTO migration_scope VALUES (?)").run(JSON.stringify(inspection));
					for (const [index, table] of inspection.tables.entries()) {
						if (!table.sql) continue;
						const columns = storedColumns(table);
						const dataTable = quote(`data_${index}`);
						archive.exec(`CREATE TABLE ${dataTable} (${columns.map((column) => `${quote(column)} ANY`).join(", ")}) STRICT`);
						const selected = [...table.rowid ? [table.rowid] : [], ...table.columns];
						copyRows(source, `SELECT ${selected.map((column, position) => `${quote(column)} AS ${quote(columns[position])}`).join(", ")} FROM ${quote(table.name)}`, columns, archive, `INSERT INTO ${dataTable}`);
					}
				}));
				assertSqliteIntegrity(archive, stagedPath);
			} finally {
				archive.close();
			}
		} finally {
			source.close();
		}
		fs.chmodSync(stagedPath, 384);
		const sourceIdentity = fs.statSync(stagedPath, { bigint: true });
		await publishVerifiedSqliteFile({
			sourcePath: stagedPath,
			sourceIdentity,
			targetPath: params.targetPath,
			expectedContent: {
				sha256: (await sha256File(stagedPath)).digest,
				sizeBytes: Number(sourceIdentity.size)
			},
			beforePublish: params.beforePublish
		});
		return {
			path: params.targetPath,
			userVersion: inspection.userVersion
		};
	} finally {
		fs.rmSync(directory, {
			recursive: true,
			force: true
		});
	}
}
function readInspection(archive, backupPath) {
	archive.exec("PRAGMA trusted_schema = OFF");
	if (archive.prepare("PRAGMA application_id").get().application_id !== SCOPED_MIGRATION_APPLICATION_ID) throw new Error(`Not a table-scoped migration backup: ${backupPath}`);
	assertSqliteIntegrity(archive, backupPath);
	const records = archive.prepare("SELECT metadata FROM migration_scope").all();
	if (records.length !== 1 || typeof records[0].metadata !== "string") throw new Error("Invalid scoped migration metadata");
	return inspectionSchema.parse(JSON.parse(records[0].metadata));
}
function inspectScopedMigrationSnapshot(backupPath) {
	const archive = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(backupPath), { readOnly: true });
	try {
		return readInspection(archive, backupPath);
	} finally {
		archive.close();
	}
}
/** Only the named DDL may execute; archive SQL cannot attach files or mutate other tables. */
function restoreDdl(db, sql, type, name, table) {
	const action = {
		table: constants$1.SQLITE_CREATE_TABLE,
		index: constants$1.SQLITE_CREATE_INDEX,
		trigger: constants$1.SQLITE_CREATE_TRIGGER
	}[type];
	let created = false;
	db.setAuthorizer((code, first, second) => {
		if (code === action && first === name && (type === "table" || second === table)) {
			created = true;
			return constants$1.SQLITE_OK;
		}
		if ((code === constants$1.SQLITE_READ || code === constants$1.SQLITE_INSERT || code === constants$1.SQLITE_UPDATE) && (first === "sqlite_master" || first === "sqlite_schema")) return constants$1.SQLITE_OK;
		if (code === constants$1.SQLITE_CREATE_INDEX && type === "table" && second === table && first?.startsWith("sqlite_autoindex_")) return constants$1.SQLITE_OK;
		if (code === constants$1.SQLITE_READ && first === table || code === constants$1.SQLITE_REINDEX && first === name || code === constants$1.SQLITE_FUNCTION) return constants$1.SQLITE_OK;
		return constants$1.SQLITE_DENY;
	});
	try {
		db.exec(sql);
		if (!created) throw new Error(`Archive did not create its declared ${type}: ${name}`);
	} finally {
		db.setAuthorizer(null);
	}
}
/** Caller owns stopped-state custody. An error rolls back the entire selected scope. */
function restoreScopedMigrationSnapshot(params) {
	const archive = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(params.backupPath), { readOnly: true });
	try {
		const inspection = readInspection(archive, params.backupPath);
		if (inspection.sourcePath !== fs.realpathSync(params.sourcePath)) throw new Error("Scoped migration backup belongs to another database path");
		const target = openNodeSqliteDatabase(resolveExistingSqliteFileUri(params.sourcePath));
		try {
			requireAuthorizer(target);
			target.exec("PRAGMA trusted_schema = OFF;");
			withSqliteForeignKeysDisabled(target, () => runSqliteImmediateTransactionSync(target, () => {
				params.assertCurrent();
				const kinds = target.prepare("PRAGMA table_list").all();
				const currentTables = target.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table'").all();
				const undeclaredStatistics = inspection.tables.some((table) => isStatisticTable(table.name)) ? [] : statisticTables.filter((name) => kinds.some((entry) => entry.name === name));
				for (const table of inspection.tables) {
					const currentSql = currentTables.find((entry) => typeof entry.name === "string" && foldSqliteIdentifierCase(entry.name) === foldSqliteIdentifierCase(table.name))?.sql;
					if (/\bAUTOINCREMENT\b/iu.test(table.sql ?? "") || typeof currentSql === "string" && /\bAUTOINCREMENT\b/iu.test(currentSql)) throw new Error(`Cannot restore scoped backup over AUTOINCREMENT table ${table.name}; use a full database backup.`);
					const current = kinds.find((entry) => typeof entry.name === "string" && foldSqliteIdentifierCase(entry.name) === foldSqliteIdentifierCase(table.name));
					if (current && current.type !== "table") throw new Error(`Cannot restore scoped backup over nonordinary table: ${table.name}`);
				}
				const preservedStatistics = undeclaredStatistics.map((name) => {
					const columns = ["rowid", ...target.prepare(`PRAGMA main.table_info(${quote(name)})`).all().map((column) => column.name)];
					return {
						name,
						columns,
						rows: [...readRows(target, `SELECT ${columns.map(quote).join(", ")} FROM main.${quote(name)}`, columns)]
					};
				});
				for (const table of inspection.tables) if (!isStatisticTable(table.name)) target.exec(`DROP TABLE IF EXISTS ${quote(table.name)}`);
				for (const [index, table] of inspection.tables.entries()) {
					if (!table.sql || isStatisticTable(table.name)) continue;
					restoreDdl(target, table.sql, "table", table.name, table.name);
					restoreRows(archive, target, table, index);
				}
				for (const table of inspection.tables) for (const object of table.objects) restoreDdl(target, object.sql, object.type, object.name, table.name);
				if (inspection.tables.filter((table) => isStatisticTable(table.name)).some((table) => table.sql && !kinds.some((entry) => entry.name === table.name))) target.exec("ANALYZE sqlite_schema");
				for (const [index, table] of inspection.tables.entries()) {
					if (!isStatisticTable(table.name)) continue;
					if (!table.sql) {
						target.exec(`DROP TABLE IF EXISTS ${quote(table.name)}`);
						continue;
					}
					target.exec(`DELETE FROM ${quote(table.name)}`);
					restoreRows(archive, target, table, index);
				}
				for (const { name, columns, rows } of preservedStatistics) {
					target.exec(`DELETE FROM main.${quote(name)}`);
					writeRows(target, `INSERT INTO main.${quote(name)} (${columns.map(quote).join(", ")})`, columns, rows);
				}
				writeSqliteUserVersion(target, inspection.userVersion);
			}));
		} finally {
			target.close();
		}
	} finally {
		archive.close();
	}
}
//#endregion
export { restoreScopedMigrationSnapshot as a, inspectScopedMigrationTables as i, createScopedMigrationSnapshot as n, inspectScopedMigrationSnapshot as r, ScopedMigrationSnapshotUnsupportedError as t };

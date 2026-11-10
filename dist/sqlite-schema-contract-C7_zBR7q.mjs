import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { a as ensureSqliteLibrarySelected, t as SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { $ as createSqliteIndexContract, ct as normalizeSqlIdentifier, dt as readSqlToken, et as createSqliteTableContract, lt as normalizeSqlWhitespace, st as normalizeSchemaSql, ut as quoteSqliteIdentifier } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { v as runSqliteSchemaReadSnapshotSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as throwSqliteSchemaMismatches, i as legacySqliteSchemaIssueMessages, n as createSqliteSchemaIssue } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { getEnvironmentData, setEnvironmentData } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/sqlite-schema-contract.ts
function expectedSchemaContracts() {
	return resolveGlobalSingleton(Symbol.for(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY), () => {
		const runtime = {
			executable: process.execPath,
			nodeVersion: process.versions.node,
			bunVersion: process.versions.bun,
			library: ensureSqliteLibrarySelected()
		};
		const inherited = getEnvironmentData(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY);
		const cache = inherited?.pid === process.pid && isDeepStrictEqual(inherited.runtime, runtime) && inherited.contracts instanceof Map ? inherited : {
			pid: process.pid,
			runtime,
			contracts: /* @__PURE__ */ new Map()
		};
		setEnvironmentData(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY, cache);
		return cache.contracts;
	});
}
/** Capture only an existing canonical contract; callers must not build it on a host request. */
function captureSqliteSchemaContracts(schemaSqls) {
	const schemaContractCache = expectedSchemaContracts();
	return schemaSqls.flatMap((schemaSql) => {
		const tables = schemaContractCache.get(schemaSql);
		return tables ? [{
			schemaSql,
			tables
		}] : [];
	});
}
/** Private worker IPC transfers canonical facts under their exact schema SQL cache key. */
function adoptSqliteSchemaContracts(contracts) {
	const schemaContractCache = expectedSchemaContracts();
	for (const contract of contracts) if (!schemaContractCache.has(contract.schemaSql)) schemaContractCache.set(contract.schemaSql, contract.tables);
}
/** Reuse actual table facts only within one unchanged read transaction on this connection. */
function createSqliteTableContractReader(database) {
	let tables;
	return (tableName) => (tables ??= collectSqliteSchemaContract(database)).get(tableName);
}
/**
* Require every object from one committed schema while allowing unrelated
* tables and indexes that do not replace a canonical object.
*/
function assertSqliteSchemaContains(database, databaseLabel, schemaSql, compatibility = {}, readTable) {
	const issues = collectSqliteSchemaIssues(database, schemaSql, compatibility, readTable);
	if (issues.length > 0) throwSqliteSchemaMismatches(databaseLabel, legacySqliteSchemaIssueMessages(issues));
}
/** Collect stable, machine-readable differences from one committed schema. */
function collectSqliteSchemaIssues(database, schemaSql, compatibility = {}, readTable) {
	return runSqliteSchemaReadSnapshotSync(database, () => collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable));
}
function collectSqliteSchemaIssuesInSnapshot(database, schemaSql, compatibility, readTable) {
	const expected = getSqliteSchemaContract(schemaSql);
	const readActualTable = readTable ?? createSqliteTableContractReader(database);
	const excludedTables = new Set(compatibility.excludedTables ?? []);
	const excludedIndexes = new Set(compatibility.excludedIndexes ?? []);
	const allowedMissingTables = new Set(compatibility.allowedMissingTables ?? []);
	const allowedMissingIndexes = new Set(compatibility.allowedMissingIndexes ?? []);
	const issues = [];
	const add = (code, objectName, message) => {
		issues.push(createSqliteSchemaIssue(code, objectName, message));
	};
	for (const [tableName, expectedTable] of expected) {
		if (excludedTables.has(tableName)) continue;
		const actualTable = readActualTable(tableName);
		if (!actualTable) {
			if (allowedMissingTables.has(tableName)) continue;
			add("missing-table", tableName);
			continue;
		}
		issues.push(...compareTableDefinitions(tableName, actualTable.definition, expectedTable.definition, compatibility, !allowedMissingTables.has(tableName)));
		const actualIndexFingerprints = new Set(actualTable.indexes.map((index) => JSON.stringify(index)));
		const expectedIndexFingerprints = /* @__PURE__ */ new Set();
		for (const expectedIndex of expectedTable.indexes) {
			if (expectedIndex.name !== null && excludedIndexes.has(expectedIndex.name)) continue;
			const fingerprint = JSON.stringify(expectedIndex);
			expectedIndexFingerprints.add(fingerprint);
			if (!actualIndexFingerprints.has(fingerprint)) {
				const objectName = expectedIndex.name ?? tableName;
				if (expectedIndex.name && allowedMissingIndexes.has(expectedIndex.name) && !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'index' AND name = ? COLLATE NOCASE LIMIT 1").get(expectedIndex.name)) continue;
				add("missing-or-drifted-index", objectName, `missing or drifted index ${expectedIndex.name ?? `on ${tableName}`}`);
			}
		}
		for (const actualIndex of actualTable.indexes) if (actualIndex.unique === 1 && !expectedIndexFingerprints.has(JSON.stringify(actualIndex))) add("unexpected-unique-index", actualIndex.name ?? tableName, `unexpected unique index ${actualIndex.name ?? `on ${tableName}`}`);
		const optionalCanonicalTriggerGroups = collectOptionalCanonicalTriggerGroups(database, compatibility, tableName);
		const optionalCanonicalTriggers = optionalCanonicalTriggerGroups.flatMap((group) => group.triggers);
		const allowedMissingCanonicalTriggers = optionalCanonicalTriggerGroups.filter((group) => group.optional).flatMap((group) => group.triggers);
		for (const expectedTrigger of expectedTable.triggers) {
			if (allowedMissingCanonicalTriggers.some((canonicalTrigger) => canonicalTrigger.name === expectedTrigger.name)) continue;
			if (!containsTrigger(actualTable.triggers, expectedTrigger)) add("missing-or-drifted-trigger", expectedTrigger.name);
		}
		for (const triggerGroup of optionalCanonicalTriggerGroups) {
			const isPresent = actualTable.triggers.some((actualTrigger) => triggerGroup.triggers.some((canonicalTrigger) => actualTrigger.name === canonicalTrigger.name));
			if (triggerGroup.optional && !isPresent) continue;
			for (const canonicalTrigger of triggerGroup.triggers) if (!containsTrigger(actualTable.triggers, canonicalTrigger)) add("missing-or-drifted-trigger", canonicalTrigger.name);
		}
		for (const actualTrigger of actualTable.triggers) if (!containsTrigger(expectedTable.triggers, actualTrigger) && !containsTrigger(optionalCanonicalTriggers, actualTrigger)) add("unexpected-trigger", actualTrigger.name);
		if (actualTable.virtualTableSql !== expectedTable.virtualTableSql) add("virtual-table-definition-drift", tableName);
		if (actualTable.strict !== expectedTable.strict || actualTable.withoutRowid !== expectedTable.withoutRowid) add("table-options-drift", tableName);
	}
	return issues;
}
/** Require stable canonical tables before a version-specific additive migration. */
function assertSqliteSchemaTablesPresent(database, databaseLabel, schemaSql, options = {}) {
	const allowedMissingTables = new Set(options.allowedMissingTables ?? []);
	const requiredTables = getCanonicalSqliteTableNames(schemaSql).filter((tableName) => !allowedMissingTables.has(tableName));
	const missingTables = [];
	const batchSize = 500;
	for (let offset = 0; offset < requiredTables.length; offset += batchSize) {
		const tables = requiredTables.slice(offset, offset + batchSize);
		const expected = tables.map((_table, ordinal) => `(${ordinal}, ?)`).join(", ");
		const present = database.prepare(`WITH expected(ordinal, name) AS (VALUES ${expected})
         SELECT ordinal FROM expected
         WHERE EXISTS (
           SELECT 1 FROM main.sqlite_schema
           WHERE type = 'table' AND name = expected.name LIMIT 1
         )`).all(...tables);
		const presentOrdinals = new Set(present.map((row) => row.ordinal));
		for (const [ordinal, tableName] of tables.entries()) if (!presentOrdinals.has(ordinal)) missingTables.push(`missing table ${tableName}`);
	}
	if (missingTables.length > 0) throwSqliteSchemaMismatches(databaseLabel, missingTables);
}
/** Return every explicit named index owned by one committed schema. */
function getCanonicalSqliteNamedIndexContracts(schemaSql) {
	const schema = getSqliteSchemaContract(schemaSql);
	const indexes = [];
	for (const [tableName, table] of schema) for (const fingerprint of table.indexes) {
		if (fingerprint.name === null || fingerprint.sql === null || fingerprint.origin !== "c") continue;
		indexes.push({
			definition: readCanonicalIndexDefinition(fingerprint),
			fingerprint,
			name: fingerprint.name,
			tableName,
			unique: fingerprint.unique === 1
		});
	}
	return indexes;
}
/** Return every table owned by one committed schema. */
function getCanonicalSqliteTableNames(schemaSql) {
	return [...getSqliteSchemaContract(schemaSql).keys()];
}
/** Inspect one explicit main-schema index using the canonical schema fingerprint shape. */
function collectSqliteNamedIndexContract(database, indexName) {
	const row = database.prepare(`
      SELECT tbl_name FROM (
        SELECT name, sql, tbl_name FROM main.sqlite_schema WHERE type = 'index' AND name = ?
      )
    `).get(indexName);
	if (!row || typeof row.tbl_name !== "string") return;
	const index = database.prepare(`PRAGMA main.index_list(${quoteSqliteIdentifier(row.tbl_name)})`).all().find((candidate) => candidate.name === indexName);
	return index ? collectSqliteIndexContract(database, index) : void 0;
}
function collectOptionalCanonicalTriggerGroups(database, compatibility, tableName) {
	return (compatibility.optionalCanonicalTriggerGroups ?? []).filter((group) => group.tableName === tableName).map((group) => ({
		optional: !group.optionalWhenTableMissing || !database.prepare("SELECT 1 FROM main.sqlite_schema WHERE type = 'table' AND name = ? LIMIT 1").get(group.optionalWhenTableMissing),
		triggers: group.triggers.map((trigger) => ({
			name: trigger.name,
			sql: normalizeOptionalCanonicalTriggerSql(trigger.sql)
		}))
	}));
}
function normalizeOptionalCanonicalTriggerSql(sql) {
	return normalizeSchemaSql(sql)?.replace(/^(CREATE TRIGGER) main\./iu, "$1 ") ?? null;
}
function getSqliteSchemaContract(schemaSql) {
	const schemaContractCache = expectedSchemaContracts();
	let expected = schemaContractCache.get(schemaSql);
	if (!expected) {
		expected = buildSqliteSchemaContract(schemaSql);
		schemaContractCache.set(schemaSql, expected);
	}
	return expected;
}
function collectSqliteSchemaFacts(database) {
	const tableOptions = database.prepare("PRAGMA table_list").all();
	if (tableOptions.some((row) => {
		const name = row.name.toLowerCase();
		return name === "pragma_index_list" || name === "pragma_index_xinfo";
	})) return;
	const indexes = database.prepare(`
    SELECT t.name AS table_name, i.seq AS index_seq,
      i.name, i.origin, i.partial, i."unique", d.sql
    FROM main.sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name, 'main') AS i
    LEFT JOIN main.sqlite_schema AS d ON d.type = 'index' AND d.name = i.name
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
  `).all();
	const terms = database.prepare(`
    SELECT t.name AS table_name, i.seq AS index_seq,
      x.seqno, x.cid, x.name, x."desc", x.coll, x."key"
    FROM main.sqlite_schema AS t
    CROSS JOIN pragma_index_list(t.name, 'main') AS i
    CROSS JOIN pragma_index_xinfo(i.name, 'main') AS x
    WHERE t.type = 'table' AND t.name NOT LIKE 'sqlite_%'
    ORDER BY t.name, i.seq, x.seqno
  `).all();
	const triggers = database.prepare(`
    SELECT tbl_name, name, sql FROM main.sqlite_schema WHERE type = 'trigger' ORDER BY tbl_name, name
  `).all();
	return {
		tableOptions,
		indexes: groupCanonicalRows(indexes, (row) => row.table_name),
		terms: groupCanonicalRows(terms, (row) => row.table_name),
		triggers: groupCanonicalRows(triggers, (row) => row.tbl_name)
	};
}
function groupCanonicalRows(rows, key) {
	const groups = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const name = key(row);
		const group = groups.get(name) ?? [];
		group.push(row);
		groups.set(name, group);
	}
	return groups;
}
function buildSqliteSchemaContract(schemaSql) {
	const database = openNodeSqliteDatabase(":memory:");
	try {
		database.exec(schemaSql);
		return collectSqliteSchemaContract(database);
	} finally {
		database.close();
	}
}
function collectSqliteSchemaContract(database) {
	const rows = database.prepare(`
        SELECT name, sql, tbl_name
        FROM main.sqlite_schema
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all();
	if (rows.length === 0) return /* @__PURE__ */ new Map();
	const facts = collectSqliteSchemaFacts(database);
	return new Map(rows.map((table) => [table.name, collectSqliteTableContractFromRow(database, table, facts)]));
}
function readCanonicalIndexDefinition(index) {
	if (index.name === null || index.sql === null) throw new Error("Canonical SQLite named index is missing its schema definition.");
	const prefix = (index.unique === 1 ? /^CREATE\s+UNIQUE\s+INDEX\s+/iu : /^CREATE\s+INDEX\s+/iu).exec(index.sql);
	if (!prefix) throw new Error(`Canonical SQLite index ${index.name} has an unreadable definition.`);
	const name = readSqlToken(index.sql, prefix[0].length);
	if (!name || normalizeSqlIdentifier(name.raw) !== index.name.toLowerCase()) throw new Error(`Canonical SQLite index ${index.name} has an unexpected schema name.`);
	const definition = index.sql.slice(name.end).trim();
	if (!/^ON\s+/iu.test(definition)) throw new Error(`Canonical SQLite index ${index.name} has an unreadable target.`);
	return definition;
}
function collectSqliteTableContractFromRow(database, table, facts) {
	const tableName = table.name;
	const quotedTable = facts ? void 0 : quoteSqliteIdentifier(tableName);
	const tableList = (facts?.tableOptions ?? database.prepare(`PRAGMA main.table_list(${quotedTable})`).all()).find((entry) => entry.schema === "main" && entry.name === tableName);
	if (!tableList) throw new Error(`Could not inspect SQLite table options for ${tableName}.`);
	let indexes;
	if (facts) {
		const termsByIndex = groupCanonicalRows(facts.terms.get(tableName) ?? [], (term) => term.index_seq);
		indexes = (facts.indexes.get(tableName) ?? []).map((index) => createSqliteIndexContract(index, index.sql, termsByIndex.get(index.index_seq) ?? []));
	} else indexes = database.prepare(`PRAGMA main.index_list(${quotedTable})`).all().map((index) => collectSqliteIndexContract(database, index));
	indexes = indexes.toSorted(compareJson);
	const triggers = facts ? facts.triggers.get(tableName) ?? [] : executeWithCachedStatement(database, `
          SELECT name, sql
          FROM main.sqlite_schema
          WHERE type = 'trigger' AND tbl_name = ?
          ORDER BY name
        `, [tableName], (statement) => statement.all(tableName));
	return createSqliteTableContract(tableName, table, tableList, indexes, triggers);
}
function compareTableDefinitions(tableName, actual, expected, compatibility, allowCompatibleAdditiveColumns) {
	const issues = [];
	const add = (code, objectName) => {
		issues.push(createSqliteSchemaIssue(code, objectName));
	};
	if (!actual || !expected) {
		if (actual !== expected) add("table-definition-drift", tableName);
		return issues;
	}
	const allowedMissingColumns = new Set(compatibility.allowedMissingColumns ?? []);
	for (const [columnName, definition] of actual.columns) if (!expected.columns.has(columnName)) {
		if (allowCompatibleAdditiveColumns && compatibility.allowCompatibleAdditiveColumns && isCompatibleAdditiveColumnDefinition(definition)) continue;
		add("unexpected-column", `${tableName}.${columnName}`);
	}
	for (const [columnName, expectedDefinition] of expected.columns) {
		const objectName = `${tableName}.${columnName}`;
		const actualDefinition = actual.columns.get(columnName);
		if (actualDefinition === void 0) {
			if (!allowedMissingColumns.has(objectName)) add("missing-column", objectName);
			continue;
		}
		if (actualDefinition === expectedDefinition) continue;
		if (!(compatibility.allowedColumnDefinitions?.[objectName] ?? []).some((definition) => normalizeSqlWhitespace(definition) === actualDefinition)) add("column-definition-drift", objectName);
	}
	if (JSON.stringify(actual.constraints) !== JSON.stringify(expected.constraints)) add("table-constraint-drift", tableName);
	return issues;
}
const SQLITE_STRICT_DATATYPES = /* @__PURE__ */ new Set([
	"ANY",
	"BLOB",
	"INT",
	"INTEGER",
	"REAL",
	"TEXT"
]);
function isCompatibleAdditiveColumnDefinition(definition) {
	const name = readSqlToken(definition, 0);
	const type = name ? readSqlToken(definition, name.end) : null;
	return Boolean(type?.keyword && SQLITE_STRICT_DATATYPES.has(type.keyword) && definition.slice(type.end).trim().length === 0);
}
function collectSqliteIndexContract(database, index) {
	const row = executeWithCachedStatement(database, "SELECT sql FROM main.sqlite_schema WHERE type = 'index' AND name = ?", [index.name], (statement) => statement.get(index.name));
	const terms = database.prepare(`PRAGMA main.index_xinfo(${quoteSqliteIdentifier(index.name)})`).all();
	return createSqliteIndexContract(index, typeof row?.sql === "string" ? row.sql : null, terms);
}
function containsTrigger(triggers, expected) {
	return triggers.some((trigger) => trigger.name === expected.name && trigger.sql === expected.sql);
}
function compareJson(left, right) {
	return JSON.stringify(left).localeCompare(JSON.stringify(right));
}
function readSqliteSchemaCookie(database) {
	return database.prepare("PRAGMA schema_version").get()?.schema_version;
}
//#endregion
export { collectSqliteNamedIndexContract as a, getCanonicalSqliteNamedIndexContracts as c, captureSqliteSchemaContracts as i, getCanonicalSqliteTableNames as l, assertSqliteSchemaContains as n, collectSqliteSchemaIssues as o, assertSqliteSchemaTablesPresent as r, createSqliteTableContractReader as s, adoptSqliteSchemaContracts as t, readSqliteSchemaCookie as u };

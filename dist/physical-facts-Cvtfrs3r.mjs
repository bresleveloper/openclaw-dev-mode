import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { createHash, randomUUID } from "node:crypto";
import { threadId } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/database-engine/admission-scope.ts
let admissionDepth = 0;
/** Main-thread SQL is limited to the synchronous boot admission or migration callback. */
function withEngineStoreAdmission(operation) {
	admissionDepth += 1;
	try {
		const result = operation();
		if (isPromiseLike(result)) throw new Error("Database engine admission must remain synchronous");
		return result;
	} finally {
		admissionDepth -= 1;
	}
}
function assertEngineStoreExecutionAllowed() {
	if (threadId === 0 && admissionDepth === 0) throw new Error("PostgreSQL connections must run in a worker; only synchronous admission and migrations may run on the main thread");
}
//#endregion
//#region src/infra/database-engine/postgres-catalog.ts
/** Generation and runtime admission compare the same portable schema contract. */
function expectedPostgresCatalog(data) {
	const expected = [];
	const add = (table, kind, value) => expected.push({
		table,
		kind,
		value
	});
	for (const table of data.tables) {
		add(table.name, "table", null);
		table.columns.forEach((column, position) => add(table.name, "column", {
			...column,
			position: position + 1
		}));
		if (table.pk.length) add(table.name, "primaryKey", table.pk);
		table.unique.forEach((key) => add(table.name, "unique", key));
		table.foreignKeys.forEach((key) => add(table.name, "foreignKey", key));
		const objects = data.objects.filter((item) => item.table === table.name);
		add(table.name, "indexes", data.schema.endsWith("_state") ? objects.filter((item) => item.kind === "index" && item.category !== "pendingPromotion").length + (table.columns.some((column) => column.identity) ? 1 : 0) : table.indexes);
		add(table.name, "checks", objects.filter((item) => item.kind === "check" && (data.schema.endsWith("_state") || item.sql)).length);
	}
	return expected;
}
function canonical(value) {
	return JSON.stringify(value, (_key, item) => item !== null && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).toSorted(([a], [b]) => a.localeCompare(b, "en"))) : item);
}
function assertPostgresCatalog(actual, expected) {
	if (!isDeepStrictEqual(actual.map(canonical).toSorted(), expected.map(canonical).toSorted())) throw new Error("PostgreSQL catalog differs from its generated contract; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.");
}
function readPostgresCatalog(value) {
	if (!Array.isArray(value) || !value.every((item) => item !== null && typeof item === "object" && typeof item.table === "string" && typeof item.kind === "string" && "value" in item)) throw new Error("PostgreSQL did not return catalog facts");
	return value;
}
/** One statement gives every catalog fact the same PostgreSQL MVCC snapshot. */
function postgresCatalogQuery(namespace, includeDefinitions = false) {
	const literal = `'${namespace.replaceAll("'", "''")}'`;
	const columns = (relation, keys) => `(SELECT jsonb_agg(a.attname ORDER BY k.ordinality) FROM unnest(${keys}) WITH ORDINALITY k(num, ordinality) JOIN pg_catalog.pg_attribute a ON a.attrelid = ${relation} AND a.attnum = k.num)`;
	const action = (field) => `CASE ${field} WHEN 'a' THEN 'NO ACTION' WHEN 'r' THEN 'RESTRICT' WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL' WHEN 'd' THEN 'SET DEFAULT' END`;
	return `WITH relations AS (
    SELECT c.oid, c.relname FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = ${literal} AND c.relkind IN ('r', 'p')
  ), facts AS (
    SELECT r.relname AS "table", 'table' AS kind, 'null'::jsonb AS value FROM relations r
    UNION ALL SELECT r.relname, 'column', jsonb_build_object(
      'name', a.attname, 'type', pg_catalog.format_type(a.atttypid, a.atttypmod),
      'nullable', NOT a.attnotnull, 'identity', a.attidentity = 'd', 'position', a.attnum,
      'default', regexp_replace(pg_catalog.pg_get_expr(d.adbin, d.adrelid), '::(text|bigint|double precision)$', ''))
      FROM relations r JOIN pg_catalog.pg_attribute a ON a.attrelid = r.oid LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = r.oid AND d.adnum = a.attnum WHERE a.attnum > 0 AND NOT a.attisdropped
    UNION ALL SELECT r.relname, CASE c.contype WHEN 'p' THEN 'primaryKey' ELSE 'unique' END,
      ${columns("r.oid", "c.conkey")} FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid WHERE c.contype IN ('p', 'u')
    UNION ALL SELECT r.relname, 'foreignKey', jsonb_build_object(
      'columns', ${columns("r.oid", "c.conkey")}, 'target', target.relname,
      'targetColumns', ${columns("c.confrelid", "c.confkey")},
      'onUpdate', ${action("c.confupdtype")}, 'onDelete', ${action("c.confdeltype")},
      'deferrable', c.condeferrable, 'deferred', c.condeferred)
      FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
      JOIN pg_catalog.pg_class target ON target.oid = c.confrelid WHERE c.contype = 'f'
    UNION ALL SELECT r.relname, 'indexes', to_jsonb((SELECT count(*) FROM pg_catalog.pg_index i WHERE i.indrelid = r.oid)) FROM relations r
    UNION ALL SELECT r.relname, 'checks', to_jsonb((SELECT count(*) FROM pg_catalog.pg_constraint c WHERE c.conrelid = r.oid AND c.contype = 'c')) FROM relations r
    ${includeDefinitions ? `UNION ALL SELECT r.relname, 'constraintDefinition', jsonb_build_object('name', c.conname, 'definition', pg_catalog.pg_get_constraintdef(c.oid)) FROM relations r JOIN pg_catalog.pg_constraint c ON c.conrelid = r.oid
    UNION ALL SELECT r.relname, 'indexDefinition', jsonb_build_object('name', c.relname, 'definition', pg_catalog.pg_get_indexdef(i.indexrelid), 'valid', i.indisvalid) FROM relations r JOIN pg_catalog.pg_index i ON i.indrelid = r.oid JOIN pg_catalog.pg_class c ON c.oid = i.indexrelid
    UNION ALL SELECT r.relname, 'columnDefinition', jsonb_build_object('name', a.attname, 'default', pg_catalog.pg_get_expr(d.adbin, d.adrelid), 'generated', a.attgenerated, 'identity', a.attidentity, 'collation', a.attcollation::regcollation::text) FROM relations r JOIN pg_catalog.pg_attribute a ON a.attrelid = r.oid LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = r.oid AND d.adnum = a.attnum WHERE a.attnum > 0 AND NOT a.attisdropped
    UNION ALL SELECT r.relname, 'triggerDefinition', jsonb_build_object('name', t.tgname, 'definition', pg_catalog.pg_get_triggerdef(t.oid), 'enabled', t.tgenabled, 'function', pg_catalog.pg_get_functiondef(t.tgfoid)) FROM relations r JOIN pg_catalog.pg_trigger t ON t.tgrelid = r.oid WHERE NOT t.tgisinternal
    UNION ALL SELECT c.relname, 'viewDefinition', to_jsonb(pg_catalog.pg_get_viewdef(c.oid)) FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = ${literal} AND c.relkind IN ('v', 'm')` : ""}
  ) SELECT coalesce(jsonb_agg(facts), '[]'::jsonb) AS catalog FROM facts`;
}
//#endregion
//#region src/infra/database-engine/postgres-schema.ts
const postgresSchemaMetadataSql = `CREATE TABLE openclaw_schema_meta (
  store TEXT PRIMARY KEY, version BIGINT NOT NULL, store_id TEXT NOT NULL,
  fingerprint TEXT, ddl_hash TEXT, server_major BIGINT)`;
const recovery$1 = "Use a compatible OpenClaw binary or restore the matching PostgreSQL schema and anchor; do not edit schema metadata.";
const quote = (name) => `"${name.replaceAll("\"", "\"\"")}"`;
const hash$1 = (text) => createHash("sha256").update(text).digest("hex");
const capabilities = /* @__PURE__ */ new WeakMap();
function admitPostgresCapabilities(db) {
	const retained = capabilities.get(db);
	if (retained) return retained;
	const row = db.prepare("SELECT current_setting('server_version_num')::int AS version, current_setting('server_encoding') AS server_encoding, current_setting('client_encoding') AS client_encoding").get();
	if (!row || typeof row.version !== "number" || row.version < 16e4 || row.server_encoding !== "UTF8" || row.client_encoding !== "UTF8") throw new Error("PostgreSQL requires version 16 or newer and UTF8 server/client encoding; upgrade the server or port to a UTF8 database and set client_encoding=UTF8.");
	const facts = {
		serverMajor: Math.floor(row.version / 1e4),
		serverEncoding: "UTF8",
		clientEncoding: "UTF8"
	};
	capabilities.set(db, facts);
	return facts;
}
function readPostgresSchema(db, namespace, store) {
	const row = db.query(`WITH captured AS (${postgresCatalogQuery(namespace, true)})
    SELECT catalog::text, to_jsonb(meta)::text AS metadata FROM captured
    CROSS JOIN ${quote(namespace)}.openclaw_schema_meta meta WHERE meta.store = ?`, [store]).rows[0];
	if (!row || typeof row.catalog !== "string" || typeof row.metadata !== "string") throw new Error(`Missing PostgreSQL catalog or metadata. ${recovery$1}`);
	const metadata = JSON.parse(row.metadata);
	return {
		catalog: readPostgresCatalog(JSON.parse(row.catalog)),
		metadata
	};
}
function postgresSchemaFingerprint(catalog, scratch) {
	const text = catalog.filter((fact) => fact.table !== "openclaw_schema_meta").map((fact) => JSON.stringify(fact)).toSorted().join("\n");
	return hash$1(scratch ? text.replaceAll(scratch.from, scratch.to) : text);
}
function postgresSchemaSql(schema, catalog) {
	const tables = new Set(catalog?.filter((fact) => fact.kind === "table").map((fact) => fact.table));
	const active = schema.postgresFragments?.filter((fragment) => catalog ? fragment.tables.some((table) => tables.has(table)) : fragment.activation === "version-additive") ?? [];
	const ordered = /* @__PURE__ */ new Map();
	const add = (fragment) => {
		if (ordered.has(fragment.id)) return;
		for (const id of fragment.dependencies) {
			const dependency = schema.postgresFragments?.find((item) => item.id === id);
			if (!dependency) throw new Error(`Missing PostgreSQL fragment dependency ${id}`);
			add(dependency);
		}
		ordered.set(fragment.id, fragment.sql);
	};
	active.forEach(add);
	return [schema.postgres ?? "", ...ordered.values()].join("\n");
}
function recordPostgresSchema(db, namespace, schema, snapshot) {
	if (!db.isTransaction) throw new Error("PostgreSQL schema publication requires the owner's writer transaction");
	const captured = snapshot ?? readPostgresSchema(db, namespace, schema.id);
	db.prepare("UPDATE openclaw_schema_meta SET fingerprint = ?, ddl_hash = ?, server_major = ? WHERE store = ?").run(postgresSchemaFingerprint(captured.catalog), hash$1(postgresSchemaSql(schema, captured.catalog)), admitPostgresCapabilities(db).serverMajor, schema.id);
}
/** Rare upgrade/unsealed-pilot path: PostgreSQL deparses both sides on this server. */
function verifyPostgresSchema(db, namespace, schema, snapshot) {
	const fingerprint = postgresSchemaFingerprint(snapshot.catalog);
	const ddl = postgresSchemaSql(schema, snapshot.catalog);
	const { metadata } = snapshot;
	const major = admitPostgresCapabilities(db).serverMajor;
	if (metadata.server_major === major && metadata.fingerprint && metadata.fingerprint !== fingerprint) throw new Error(`PostgreSQL schema drift detected. ${recovery$1}`);
	if (metadata.ddl_hash && metadata.ddl_hash !== hash$1(ddl)) throw new Error(`PostgreSQL generated DDL hash mismatch. ${recovery$1}`);
	if (metadata.server_major === major && metadata.fingerprint && metadata.ddl_hash) return;
	verifyAndRecordPostgresSchema(db, namespace, schema, snapshot);
}
/** Migrations and major upgrades validate the destination before publishing its seal. */
function verifyAndRecordPostgresSchema(db, namespace, schema, snapshot = readPostgresSchema(db, namespace, schema.id)) {
	const fingerprint = postgresSchemaFingerprint(snapshot.catalog);
	const ddl = postgresSchemaSql(schema, snapshot.catalog);
	const scratch = `openclaw_check_${randomUUID().replaceAll("-", "")}`;
	db.runTransaction(() => {
		db.exec(`CREATE SCHEMA ${quote(scratch)}`);
		try {
			db.exec(`SET LOCAL search_path TO ${quote(scratch)}`);
			db.exec(ddl);
			const row = db.query(`SELECT catalog::text FROM (${postgresCatalogQuery(scratch, true)}) captured`).rows[0];
			if (postgresSchemaFingerprint(readPostgresCatalog(JSON.parse(String(row?.catalog))), {
				from: scratch,
				to: namespace
			}) !== fingerprint) throw new Error(`PostgreSQL schema drift detected against generated DDL. ${recovery$1}`);
		} finally {
			db.exec(`SET LOCAL search_path TO ${quote(namespace)}`);
			db.exec(`DROP SCHEMA ${quote(scratch)} CASCADE`);
		}
		if (!snapshot.metadata.ddl_hash) db.exec("ALTER TABLE openclaw_schema_meta ADD COLUMN IF NOT EXISTS fingerprint TEXT, ADD COLUMN IF NOT EXISTS ddl_hash TEXT, ADD COLUMN IF NOT EXISTS server_major BIGINT");
		recordPostgresSchema(db, namespace, schema, snapshot);
	});
}
//#endregion
//#region src/infra/database-engine/physical-facts.ts
const recovery = "Use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.";
const admissionKey = {
	name: "database.engine.schema",
	schemaDependent: true,
	read(value) {
		if (value && typeof value === "object" && "engine" in value && value.engine === "postgres" && "admissionId" in value && typeof value.admissionId === "string" && "store" in value && typeof value.store === "string" && "namespace" in value && typeof value.namespace === "string" && "storeId" in value && typeof value.storeId === "string" && "version" in value && typeof value.version === "number" && "capabilities" in value && value.capabilities !== null && typeof value.capabilities === "object" && "serverMajor" in value.capabilities && typeof value.capabilities.serverMajor === "number" && value.capabilities.serverMajor >= 16 && "serverEncoding" in value.capabilities && value.capabilities.serverEncoding === "UTF8" && "clientEncoding" in value.capabilities && value.capabilities.clientEncoding === "UTF8" && "catalog" in value) return {
			engine: "postgres",
			admissionId: value.admissionId,
			store: value.store,
			namespace: value.namespace,
			storeId: value.storeId,
			version: value.version,
			capabilities: {
				serverMajor: value.capabilities.serverMajor,
				serverEncoding: "UTF8",
				clientEncoding: "UTF8"
			},
			catalog: readPostgresCatalog(value.catalog)
		};
	}
};
function getPostgresPhysicalFacts(db) {
	return getSqliteDatabaseAdmission(db, admissionKey);
}
/** The anchor carries PG admission facts without treating its native catalog as application data. */
function admitPostgresPhysicalFacts(params) {
	const retained = getPostgresPhysicalFacts(params.db);
	if (retained) {
		if (retained.store !== params.store || retained.namespace !== params.namespace || retained.storeId !== params.storeId || retained.version !== params.version) throw new Error(`PostgreSQL admission identity or version mismatch. ${recovery}`);
		return retained;
	}
	assertEngineStoreExecutionAllowed();
	const capabilities = admitPostgresCapabilities(params.db);
	let snapshot;
	try {
		snapshot = readPostgresSchema(params.db, params.namespace, params.store);
	} catch (error) {
		throw new Error(`Cannot read PostgreSQL catalog or metadata. ${recovery}`, { cause: error });
	}
	const { metadata: row, catalog } = snapshot;
	if (row.version !== params.version || row.store_id !== params.storeId) throw new Error(`PostgreSQL metadata identity or version mismatch. ${recovery}`);
	if (params.schema) {
		if (params.recordSchema) recordPostgresSchema(params.db, params.namespace, params.schema, snapshot);
		else verifyPostgresSchema(params.db, params.namespace, params.schema, snapshot);
	}
	if (params.expected) assertPostgresCatalog(catalog.filter((fact) => !fact.kind.endsWith("Definition") && fact.table !== "openclaw_schema_meta"), params.expected);
	const facts = {
		engine: "postgres",
		admissionId: randomUUID(),
		store: params.store,
		namespace: params.namespace,
		storeId: row.store_id,
		version: row.version,
		capabilities,
		catalog
	};
	publishSqliteDatabaseAdmission(params.db, admissionKey, facts);
	return facts;
}
function requireNativeDatabaseFile(engine, operation) {
	if (engine === "postgres") throw new Error(`PostgreSQL cannot use SQLite ${operation}; stop the Gateway and back up/restore the PostgreSQL schema with its matching anchor (P3-6 export support pending).`);
}
//#endregion
export { postgresSchemaMetadataSql as a, verifyAndRecordPostgresSchema as c, expectedPostgresCatalog as d, postgresCatalogQuery as f, withEngineStoreAdmission as h, admitPostgresCapabilities as i, verifyPostgresSchema as l, assertEngineStoreExecutionAllowed as m, getPostgresPhysicalFacts as n, postgresSchemaSql as o, readPostgresCatalog as p, requireNativeDatabaseFile as r, readPostgresSchema as s, admitPostgresPhysicalFacts as t, assertPostgresCatalog as u };

import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as datetime } from "./iso-C7dwZ8qa.mjs";
import { l as hasActiveGatewayStateOwner } from "./gateway-state-owner-X3EqhtYx.mjs";
import { ut as quoteSqliteIdentifier } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts, t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as sameFileMutationFingerprint, t as copyFileHandle } from "./file-descriptor-BWLpOgrg.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { d as expectedPostgresCatalog, f as postgresCatalogQuery, p as readPostgresCatalog, u as assertPostgresCatalog } from "./physical-facts-Cvtfrs3r.mjs";
import { i as readTableColumns } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { o as writeSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { n as readEngineAnchor, o as decodePostgresRows } from "./open-L_IbZFu2.mjs";
import { s as resolveBundledPluginsDir } from "./bundled-dir-LfC_CFuw.mjs";
import "./session-key-CSDERtm3.mjs";
import { c as sha256File, l as syncDirectory, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { i as readAutoincrementHighWater, o as restoreAutoincrementHighWater, s as withSqliteForeignKeysDisabled } from "./sqlite-strict-CTENSqnV.mjs";
import { t as resolveDatabaseEngineInput } from "./config-Df1l-yPz.mjs";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { parentPort, workerData } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/snapshot/sqlite-cell-codec.ts
function encodeSqliteValue(value) {
	if (value === null || typeof value === "string") return value;
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new Error("Git backup cannot encode a non-finite SQLite REAL value.");
		return value;
	}
	if (typeof value === "bigint") return value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER ? Number(value) : { $int: value.toString() };
	if (value instanceof Uint8Array) return { $hex: Buffer.from(value).toString("hex") };
	throw new Error(`Git backup cannot encode SQLite value type ${typeof value}.`);
}
function escapedSqliteText(column) {
	return `CASE WHEN typeof(${column}) = 'text' THEN json_quote(${column}) ELSE ${column} END`;
}
//#endregion
//#region src/infra/database-engine/port.worker.ts
var DatabasePortDataError = class extends Error {};
const MAX_ROWS = 1e3;
const MAX_BYTES = 4194304;
const qualified = (endpoint, table) => endpoint.engine === "sqlite" ? quoteSqliteIdentifier(table) : `${quoteSqliteIdentifier(endpoint.namespace)}.${quoteSqliteIdentifier(table)}`;
const binding = (value) => value instanceof Uint8Array ? Buffer.from(value) : value;
function sqliteStatement(db, sql) {
	const statement = db.prepare(sql);
	statement.setReadBigInts(true);
	return statement;
}
function checkRow(table, row) {
	let bytes = 0;
	for (const { name } of table.columns) {
		const value = row[name];
		if (typeof value === "string" && (value.includes("\0") || !value.isWellFormed())) {
			const key = createHash("sha256").update(JSON.stringify(table.pk.map((k) => encodeSqliteValue(row[k])))).digest("hex");
			throw new DatabasePortDataError(`Port refused ${table.name}.${name}: unrepresentable UTF-8 text; key SHA-256 ${key}; byte offset ${Buffer.byteLength(value.slice(0, value.indexOf("\0")))}. Repair through the store owner.`);
		}
		bytes += typeof value === "string" ? Buffer.byteLength(value) : value instanceof Uint8Array ? value.byteLength : 8;
	}
	return bytes;
}
async function* readBatches(endpoint, table, maxRowBytes, derive, normalize) {
	if (!table.pk.length) throw new DatabasePortDataError(`Port requires a canonical key: ${table.name}`);
	const names = table.columns.map((c) => quoteSqliteIdentifier(c.name));
	const keys = table.pk.map(quoteSqliteIdentifier).join(",");
	const rowBytes = table.columns.map((c) => ["text", "bytea"].includes(c.type) ? `coalesce(octet_length(${quoteSqliteIdentifier(c.name)}),0)` : "8").join("+");
	let cursor;
	const limit = Math.min(MAX_ROWS, Math.floor(59999 / table.columns.length));
	for (;;) {
		const params = cursor ?? [];
		const where = cursor ? ` WHERE (${keys}) > (${params.map((_, i) => endpoint.engine === "sqlite" ? "?" : `$${i + 1}`).join(",")})` : "";
		const page = `SELECT ${endpoint.engine === "sqlite" ? table.columns.flatMap(({ name }, i) => [`${escapedSqliteText(quoteSqliteIdentifier(name))} AS ${quoteSqliteIdentifier(name)}`, `CASE WHEN typeof(${quoteSqliteIdentifier(name)}) = 'text' THEN CAST(${quoteSqliteIdentifier(name)} AS BLOB) END AS ${quoteSqliteIdentifier(`__port_bytes_${i}`)}`]).join(",") : names.join(",")} FROM ${qualified(endpoint, table.name)}${where} ORDER BY ${keys} LIMIT ${limit}`;
		const sql = endpoint.engine === "sqlite" ? page : `WITH page AS (${page}), sized AS (
      SELECT page.*, sum(${rowBytes}) OVER (ORDER BY ${keys}) AS __port_size,
      row_number() OVER (ORDER BY ${keys}) AS __port_row FROM page)
      SELECT ${names.join(",")} FROM sized WHERE __port_size <= ${MAX_BYTES} OR __port_row = 1 ORDER BY ${keys}`;
		let rows;
		if (endpoint.engine === "sqlite") rows = sqliteStatement(endpoint.db, sql).iterate(...params);
		else {
			const result = await endpoint.db.query(sql, params.map(binding));
			rows = decodePostgresRows({
				...result,
				rowCount: result.rowCount ?? 0
			}, true);
		}
		let count = 0, bytes = 0;
		let batch = [];
		for (const raw of rows) {
			const row = {};
			table.columns.forEach(({ name }, i) => {
				let value = raw[name];
				if (endpoint.engine === "sqlite" && typeof value === "string") {
					value = JSON.parse(value);
					const original = raw[`__port_bytes_${i}`];
					if (!(original instanceof Uint8Array) || !Buffer.from(value).equals(original)) throw new DatabasePortDataError(`Port refused invalid UTF-8: ${table.name}.${name}`);
				}
				row[name] = value;
			});
			const derived = derive?.(row);
			if (!normalize && derived && Object.entries(derived).some(([key, value]) => !isDeepStrictEqual(value, row[key]))) throw new DatabasePortDataError(`Port derived columns differ: ${table.name}`);
			Object.assign(row, derived);
			const size = checkRow(table, row);
			if (size > maxRowBytes) throw new DatabasePortDataError(`Port row in ${table.name} needs ${size} bytes; increase maxRowBytes explicitly.`);
			if (batch.length && bytes + size > MAX_BYTES) {
				yield batch;
				batch = [];
				bytes = 0;
			}
			batch.push(row);
			bytes += size;
			count++;
			cursor = table.pk.map((k) => row[k]);
		}
		if (batch.length) yield batch;
		if (count === 0 || endpoint.engine === "sqlite" && count < limit) break;
	}
}
async function allocations(endpoint, descriptor) {
	const result = {};
	for (const table of descriptor.tables) for (const identity of table.identities) {
		const key = `${table.name}.${identity.column}`;
		if (endpoint.engine === "postgres") {
			const sequence = await endpoint.db.query("SELECT pg_get_serial_sequence($1, $2) AS name", [qualified(endpoint, table.name), identity.column]);
			const row = (await endpoint.db.query(`SELECT greatest(last_value, coalesce(retained, last_value))::text AS value, is_called OR coalesce(retained >= last_value, false) AS called FROM ${sequence.rows[0].name} CROSS JOIN (SELECT max(${quoteSqliteIdentifier(identity.column)}) AS retained FROM ${qualified(endpoint, table.name)}) m`)).rows[0];
			result[key] = {
				value: row.value,
				called: row.called
			};
		} else {
			let value = sqliteStatement(endpoint.db, `SELECT max(${quoteSqliteIdentifier(identity.column)}) AS value FROM ${quoteSqliteIdentifier(table.name)}`).get()?.value;
			if (identity.autoIncrement) {
				const high = readAutoincrementHighWater(endpoint.db, table.name);
				if (high !== null && (value === null || typeof value === "bigint" && BigInt(high) > value)) value = BigInt(high);
			}
			result[key] = {
				value: String(value ?? 1),
				called: value !== null && value !== void 0
			};
		}
	}
	return result;
}
async function restoreAllocations(endpoint, descriptor, facts) {
	for (const table of descriptor.tables) for (const identity of table.identities) {
		const fact = facts[`${table.name}.${identity.column}`];
		if (endpoint.engine === "postgres") await endpoint.db.query("SELECT setval(pg_get_serial_sequence($1, $2), $3::bigint, $4)", [
			qualified(endpoint, table.name),
			identity.column,
			fact.value,
			fact.called
		]);
		else if (identity.autoIncrement && fact.called) restoreAutoincrementHighWater(endpoint.db, table.name, fact.value);
	}
}
async function insertBatch(endpoint, table, rows, assertCurrent) {
	assertCurrent();
	const columns = table.columns.map((c) => quoteSqliteIdentifier(c.name)).join(",");
	if (endpoint.engine === "sqlite") withSqliteForeignKeysDisabled(endpoint.db, () => {
		runSqliteImmediateTransactionSync(endpoint.db, () => {
			const statement = sqliteStatement(endpoint.db, `INSERT INTO ${quoteSqliteIdentifier(table.name)} (${columns}) VALUES (${table.columns.map(() => "?").join(",")})`);
			for (const row of rows) statement.run(...table.columns.map((c) => row[c.name]));
		});
	});
	else {
		const values = rows.flatMap((row) => table.columns.map((c) => binding(row[c.name])));
		let index = 0;
		const tuples = rows.map(() => `(${table.columns.map(() => `$${++index}`).join(",")})`).join(",");
		await endpoint.db.query(`INSERT INTO ${qualified(endpoint, table.name)} (${columns}) VALUES ${tuples}`, values);
	}
}
async function scan(endpoint, descriptor, maxRowBytes, destination, assertCurrent = () => {}, transformRow) {
	const tables = {};
	for (const table of descriptor.tables) {
		const hash = createHash("sha256").update(JSON.stringify(table.columns) + "\n");
		let rows = 0;
		let pending;
		const stream = readBatches(endpoint, table, maxRowBytes, descriptor.derive?.[table.name], Boolean(destination));
		try {
			let next = stream.next();
			for (;;) {
				const { value: batch, done } = await next;
				if (done) break;
				const copied = transformRow ? batch.flatMap((row) => {
					const transformed = transformRow(table.name, row);
					return transformed ? [transformed] : [];
				}) : batch;
				for (const row of copied) {
					hash.update(JSON.stringify(table.columns.map((c) => encodeSqliteValue(row[c.name]))) + "\n");
					rows++;
				}
				await pending;
				if (destination?.engine === "sqlite") next = stream.next();
				if (destination && copied.length) {
					pending = insertBatch(destination, table, copied, assertCurrent);
					pending.catch(() => {});
				}
				if (destination?.engine !== "sqlite") next = stream.next();
				next.catch(() => {});
			}
		} finally {
			await Promise.all([pending, stream.return(void 0)]);
		}
		tables[table.name] = {
			rows,
			sha256: hash.digest("hex")
		};
	}
	return tables;
}
async function catalogEvidence(endpoint, descriptor) {
	await endpoint.db.query("SELECT set_config('search_path', $1, false)", [quoteSqliteIdentifier(endpoint.namespace)]);
	const facts = readPostgresCatalog((await endpoint.db.query(postgresCatalogQuery(endpoint.namespace, true))).rows[0].catalog).filter((f) => f.table !== "openclaw_schema_meta");
	assertPostgresCatalog(facts.filter((f) => !f.kind.endsWith("Definition")), descriptor.expectedCatalog);
	if ((await endpoint.db.query(`SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace WHERE n.nspname=$1 AND NOT c.convalidated UNION ALL SELECT 1 FROM pg_index i JOIN pg_class c ON c.oid=i.indrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=$1 AND NOT i.indisvalid`, [endpoint.namespace])).rowCount) throw new DatabasePortDataError("Port catalog has unvalidated constraints or invalid indexes");
	return facts.filter((f) => f.kind.endsWith("Definition")).map((f) => ({
		table: f.table,
		kind: f.kind,
		value: JSON.parse(JSON.stringify(f.value).replaceAll(endpoint.namespace, "__port_schema__"))
	}));
}
async function referenceCatalog(endpoint, descriptor) {
	const reference = {
		...endpoint,
		namespace: `port_verify_${randomUUID().replaceAll("-", "")}`
	};
	await endpoint.db.query("BEGIN");
	try {
		await endpoint.db.query(`CREATE SCHEMA ${quoteSqliteIdentifier(reference.namespace)}; SET LOCAL search_path = ${quoteSqliteIdentifier(reference.namespace)}`);
		await endpoint.db.query(descriptor.preData + "\n" + descriptor.postData);
		return await catalogEvidence(reference, descriptor);
	} finally {
		await endpoint.db.query("ROLLBACK");
	}
}
async function assertSourceIdentity(source, descriptor, storeId) {
	const meta = (await source.db.query(`SELECT store, version, store_id FROM ${qualified(source, "openclaw_schema_meta")}`)).rows;
	if (meta.length !== 1 || meta[0].store !== descriptor.id || meta[0].store_id !== storeId || BigInt(meta[0].version) !== BigInt(descriptor.version)) throw new DatabasePortDataError("Port source identity or schema version differs");
}
/** Validate the canonical SQLite surface before scanning or owner migration. */
function inspectSqlitePortSchema(db, descriptor, pendingColumns = {}) {
	assertSqliteIntegrity(db, "Port SQLite source");
	admitSqliteSchema(db);
	const facts = getAdmittedSqliteSchemaFacts(db);
	if (!facts || facts.views.size || facts.triggers.size || [...facts.tables].some((name) => !name.startsWith("sqlite_") && !descriptor.tables.some((table) => table.name === name))) throw new DatabasePortDataError("Unknown SQLite table, trigger or view; complete descriptor coverage required");
	for (const table of descriptor.tables) {
		const columns = readTableColumns(db, table.name);
		const expected = new Set(table.columns.map((column) => column.name));
		const pending = pendingColumns[table.name] ?? [];
		if (!columns.size || [...columns].some((name) => !expected.has(name)) || [...expected].some((name) => !columns.has(name) && !pending.includes(name))) throw new DatabasePortDataError(`Unknown or missing columns in ${table.name}; complete descriptor coverage required`);
	}
}
/** Offline recovery inspection, never a runtime foreign-writer probe. */
async function inspectDatabasePort(source, descriptor, storeId, verifyDefinitions = false) {
	let definitions;
	if (source.engine === "postgres") {
		await assertSourceIdentity(source, descriptor, storeId ?? "");
		definitions = verifyDefinitions ? await referenceCatalog(source, descriptor) : void 0;
		await source.db.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
	} else {
		inspectSqlitePortSchema(source.db, descriptor);
		source.db.exec("BEGIN");
	}
	try {
		const catalog = source.engine === "postgres" ? await catalogEvidence(source, descriptor) : [];
		if (definitions) assertPostgresCatalog(catalog, definitions);
		return {
			catalog,
			tables: await scan(source, descriptor, 67108864),
			allocations: await allocations(source, descriptor)
		};
	} finally {
		if (source.engine === "postgres") await source.db.query("ROLLBACK");
		else source.db.exec("ROLLBACK");
	}
}
/** One capability contract for dry-run evidence and the actual copy session. */
async function readPostgresPortCapabilities(db, descriptor) {
	const server = (await db.query("SELECT current_setting('server_version_num')::int AS version, current_setting('server_encoding') AS encoding, current_setting('client_encoding') AS client_encoding")).rows[0];
	if (!server || server.version < descriptor.minimumPostgresVersion * 1e4 || server.encoding !== "UTF8" || server.client_encoding !== "UTF8") throw new DatabasePortDataError(`Observed PostgreSQL ${server?.version}/${server?.encoding}/${server?.client_encoding}; required PostgreSQL >=${descriptor.minimumPostgresVersion} and UTF8 server/client`);
	return {
		version: server.version,
		encoding: server.encoding
	};
}
/** Offline worker API: caller owns tracked readBigInts SQLite handles, migrated source, fresh destination, and exclusive custody. No publication. */
async function materializeDatabasePort(params) {
	const { source, destination, descriptor, assertCurrent } = params;
	if (source.engine === destination.engine) throw new DatabasePortDataError("Port endpoints must use different engines");
	const maxRowBytes = params.maxRowBytes ?? 67108864;
	const postgres = [source, destination].find((endpoint) => endpoint.engine === "postgres");
	await readPostgresPortCapabilities(postgres.db, descriptor);
	await postgres.db.query("SET row_security = off");
	if (source.engine === "postgres") await assertSourceIdentity(source, descriptor, params.storeId);
	if (destination.engine === "sqlite") {
		admitSqliteSchema(destination.db);
		const facts = getAdmittedSqliteSchemaFacts(destination.db);
		if (!facts || facts.tables.size || facts.views.size || facts.indexes.size || facts.triggers.size) throw new DatabasePortDataError("Port destination must have admitted empty schema facts");
	}
	assertCurrent();
	const definitions = await referenceCatalog(postgres, descriptor);
	if (source.engine === "postgres") assertPostgresCatalog(await catalogEvidence(source, descriptor), definitions);
	if (source.engine === "postgres") await source.db.query("BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY");
	else source.db.exec("BEGIN");
	try {
		if (destination.engine === "postgres") {
			await destination.db.query("BEGIN; SET LOCAL synchronous_commit = on; SET LOCAL statement_timeout = '1h'");
			assertCurrent();
			await destination.db.query(`CREATE SCHEMA ${quoteSqliteIdentifier(destination.namespace)}`);
			await destination.db.query(`SET search_path = ${quoteSqliteIdentifier(destination.namespace)}`);
			await destination.db.query(descriptor.preData);
		} else withSqliteForeignKeysDisabled(destination.db, () => destination.db.exec(descriptor.sqlite));
		const facts = params.sourceAllocations ?? await allocations(source, descriptor);
		const tables = await scan(source, descriptor, maxRowBytes, destination, assertCurrent, params.transformRow);
		assertCurrent();
		await restoreAllocations(destination, descriptor, facts);
		if (destination.engine === "postgres") {
			assertCurrent();
			await destination.db.query(descriptor.postData);
			assertPostgresCatalog(await catalogEvidence(destination, descriptor), definitions);
			await destination.db.query("CREATE TABLE openclaw_schema_meta (store TEXT PRIMARY KEY, version BIGINT NOT NULL, store_id TEXT NOT NULL)");
			await destination.db.query("INSERT INTO openclaw_schema_meta VALUES ($1,$2,$3)", [
				descriptor.id,
				descriptor.version,
				params.storeId
			]);
		} else {
			writeSqliteUserVersion(destination.db, descriptor.version);
			assertSqliteIntegrity(destination.db, "Port SQLite destination");
		}
		const verified = {
			tables: await scan(destination, descriptor, maxRowBytes),
			allocations: await allocations(destination, descriptor)
		};
		if (!isDeepStrictEqual(verified, {
			tables,
			allocations: facts
		})) throw new DatabasePortDataError("Port canonical verification failed");
		if (destination.engine === "postgres") {
			assertCurrent();
			await destination.db.query("COMMIT");
		}
		return verified;
	} catch (error) {
		if (destination.engine === "postgres") await destination.db.query("ROLLBACK").catch(() => {});
		throw error;
	} finally {
		if (source.engine === "postgres") await source.db.query("ROLLBACK");
		else source.db.exec("ROLLBACK");
	}
}
//#endregion
//#region src/infra/database-engine/workboard-port.generated.json
var workboard_port_generated_default = {
	id: "workboard",
	version: 3,
	minimumPostgresVersion: 16,
	schema: "",
	sqlite: "\n    CREATE TABLE IF NOT EXISTS workboard_schema_migrations (\n      id TEXT PRIMARY KEY,\n      applied_at INTEGER NOT NULL\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_boards (\n      id TEXT PRIMARY KEY,\n      name TEXT,\n      description TEXT,\n      icon TEXT,\n      color TEXT,\n      kind TEXT,\n      sessions_spec TEXT,\n      automation_job_id TEXT,\n      default_workspace_json TEXT,\n      orchestration_json TEXT,\n      created_at INTEGER NOT NULL,\n      updated_at INTEGER NOT NULL,\n      archived_at INTEGER\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_session_placements (\n      board_id TEXT NOT NULL REFERENCES workboard_boards(id) ON DELETE CASCADE,\n      session_key TEXT NOT NULL,\n      column_id TEXT NOT NULL,\n      source TEXT NOT NULL CHECK(source IN ('state', 'model', 'operator')),\n      reason TEXT NOT NULL,\n      facts_hash TEXT NOT NULL,\n      updated_at INTEGER NOT NULL,\n      PRIMARY KEY(board_id, session_key)\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_cards (\n      id TEXT PRIMARY KEY,\n      board_id TEXT NOT NULL,\n      title TEXT NOT NULL,\n      notes TEXT,\n      status TEXT NOT NULL,\n      priority TEXT NOT NULL,\n      agent_id TEXT,\n      session_key TEXT,\n      run_id TEXT,\n      task_id TEXT,\n      source_url TEXT,\n      position REAL NOT NULL,\n      created_at INTEGER NOT NULL,\n      updated_at INTEGER NOT NULL,\n      started_at INTEGER,\n      completed_at INTEGER,\n      execution_id TEXT,\n      execution_kind TEXT,\n      execution_engine TEXT,\n      execution_mode TEXT,\n      execution_status TEXT,\n      execution_model TEXT,\n      execution_session_key TEXT,\n      execution_run_id TEXT,\n      execution_started_at INTEGER,\n      execution_updated_at INTEGER,\n      automation_json TEXT,\n      claim_json TEXT,\n      template_id TEXT,\n      archived_at INTEGER,\n      stale_json TEXT,\n      lifecycle_status_source_updated_at INTEGER,\n      failure_count INTEGER\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_cards_board_status_idx\n      ON workboard_cards(board_id, status, position);\n    CREATE INDEX IF NOT EXISTS workboard_cards_session_idx\n      ON workboard_cards(session_key, run_id);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_labels (\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      label TEXT NOT NULL,\n      PRIMARY KEY(card_id, ordinal)\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_card_events (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      kind TEXT NOT NULL,\n      at INTEGER NOT NULL,\n      from_status TEXT,\n      to_status TEXT,\n      session_key TEXT,\n      run_id TEXT\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_events_card_idx\n      ON workboard_card_events(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_attempts (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      status TEXT NOT NULL,\n      started_at INTEGER NOT NULL,\n      ended_at INTEGER,\n      engine TEXT,\n      mode TEXT,\n      model TEXT,\n      session_key TEXT,\n      run_id TEXT,\n      error TEXT\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_attempts_card_idx\n      ON workboard_card_attempts(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_comments (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      body TEXT NOT NULL,\n      created_at INTEGER NOT NULL,\n      updated_at INTEGER\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_comments_card_idx\n      ON workboard_card_comments(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_links (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      type TEXT NOT NULL,\n      target_card_id TEXT,\n      title TEXT,\n      url TEXT,\n      created_at INTEGER NOT NULL\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_links_card_idx\n      ON workboard_card_links(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_proof (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      status TEXT NOT NULL,\n      label TEXT,\n      command TEXT,\n      url TEXT,\n      note TEXT,\n      created_at INTEGER NOT NULL\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_proof_card_idx\n      ON workboard_card_proof(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_artifacts (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      label TEXT,\n      url TEXT,\n      path TEXT,\n      mime_type TEXT,\n      created_at INTEGER NOT NULL\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_artifacts_card_idx\n      ON workboard_card_artifacts(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_card_diagnostics (\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      kind TEXT NOT NULL,\n      severity TEXT NOT NULL,\n      title TEXT NOT NULL,\n      detail TEXT NOT NULL,\n      first_seen_at INTEGER NOT NULL,\n      last_seen_at INTEGER NOT NULL,\n      count INTEGER NOT NULL,\n      actions_json TEXT NOT NULL,\n      PRIMARY KEY(card_id, ordinal)\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_card_notifications (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      kind TEXT NOT NULL,\n      message TEXT NOT NULL,\n      created_at INTEGER NOT NULL,\n      sequence INTEGER,\n      session_key TEXT,\n      run_id TEXT\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_notifications_card_idx\n      ON workboard_card_notifications(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_worker_logs (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      level TEXT NOT NULL,\n      message TEXT NOT NULL,\n      created_at INTEGER NOT NULL,\n      session_key TEXT,\n      run_id TEXT\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_worker_logs_card_idx\n      ON workboard_worker_logs(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_worker_protocol (\n      card_id TEXT PRIMARY KEY REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      state TEXT NOT NULL,\n      updated_at INTEGER NOT NULL,\n      detail TEXT\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_card_attachments (\n      id TEXT PRIMARY KEY,\n      card_id TEXT NOT NULL REFERENCES workboard_cards(id) ON DELETE CASCADE,\n      ordinal INTEGER NOT NULL,\n      file_name TEXT NOT NULL,\n      byte_size INTEGER NOT NULL,\n      mime_type TEXT,\n      note TEXT,\n      created_at INTEGER NOT NULL\n    ) STRICT;\n    CREATE INDEX IF NOT EXISTS workboard_card_attachments_card_idx\n      ON workboard_card_attachments(card_id, ordinal);\n\n    CREATE TABLE IF NOT EXISTS workboard_attachment_blobs (\n      attachment_id TEXT PRIMARY KEY,\n      content BLOB NOT NULL\n    ) STRICT;\n\n    CREATE TABLE IF NOT EXISTS workboard_notification_subscriptions (\n      id TEXT PRIMARY KEY,\n      board_id TEXT NOT NULL,\n      card_id TEXT,\n      session_key TEXT,\n      run_id TEXT,\n      target TEXT,\n      event_kinds_json TEXT,\n      last_event_at INTEGER,\n      last_event_id TEXT,\n      last_event_sequence INTEGER,\n      delivered_event_ids_json TEXT,\n      created_at INTEGER NOT NULL,\n      updated_at INTEGER NOT NULL\n    ) STRICT;\n  ",
	tables: [
		{
			"name": "workboard_attachment_blobs",
			"columns": [{
				"name": "attachment_id",
				"type": "text",
				"nullable": false,
				"identity": false,
				"default": null
			}, {
				"name": "content",
				"type": "bytea",
				"nullable": false,
				"identity": false,
				"default": null
			}],
			"pk": ["attachment_id"],
			"unique": [],
			"foreignKeys": [],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_boards",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "name",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "description",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "icon",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "color",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "kind",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "sessions_spec",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "automation_job_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "default_workspace_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "orchestration_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "updated_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "archived_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_card_artifacts",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "label",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "url",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "path",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "mime_type",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_attachments",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "file_name",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "byte_size",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "mime_type",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "note",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_attempts",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "status",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "started_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ended_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "engine",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "mode",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "model",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "error",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_comments",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "body",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "updated_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_diagnostics",
			"columns": [
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "kind",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "severity",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "title",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "detail",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "first_seen_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "last_seen_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "count",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "actions_json",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["card_id", "ordinal"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_card_events",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "kind",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "from_status",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "to_status",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_labels",
			"columns": [
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "label",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["card_id", "ordinal"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_card_links",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "type",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "target_card_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "title",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "url",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_notifications",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "kind",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "message",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "sequence",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_card_proof",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "status",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "label",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "command",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "url",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "note",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_cards",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "board_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "title",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "notes",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "status",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "priority",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "agent_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "task_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "source_url",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "position",
					"type": "double precision",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "updated_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "started_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "completed_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_kind",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_engine",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_mode",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_status",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_model",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_started_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "execution_updated_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "automation_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "claim_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "template_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "archived_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "stale_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "lifecycle_status_source_updated_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "failure_count",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [],
			"indexes": 3,
			"identities": []
		},
		{
			"name": "workboard_notification_subscriptions",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "board_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "target",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "event_kinds_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "last_event_at",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "last_event_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "last_event_sequence",
					"type": "bigint",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "delivered_event_ids_json",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "updated_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_schema_migrations",
			"columns": [{
				"name": "id",
				"type": "text",
				"nullable": false,
				"identity": false,
				"default": null
			}, {
				"name": "applied_at",
				"type": "bigint",
				"nullable": false,
				"identity": false,
				"default": null
			}],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_session_placements",
			"columns": [
				{
					"name": "board_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "column_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "source",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "reason",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "facts_hash",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "updated_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				}
			],
			"pk": ["board_id", "session_key"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["board_id"],
				"target": "workboard_boards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 1,
			"identities": []
		},
		{
			"name": "workboard_worker_logs",
			"columns": [
				{
					"name": "id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "ordinal",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "level",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "message",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "created_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "session_key",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				},
				{
					"name": "run_id",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 2,
			"identities": []
		},
		{
			"name": "workboard_worker_protocol",
			"columns": [
				{
					"name": "card_id",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "state",
					"type": "text",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "updated_at",
					"type": "bigint",
					"nullable": false,
					"identity": false,
					"default": null
				},
				{
					"name": "detail",
					"type": "text",
					"nullable": true,
					"identity": false,
					"default": null
				}
			],
			"pk": ["card_id"],
			"unique": [],
			"foreignKeys": [{
				"columns": ["card_id"],
				"target": "workboard_cards",
				"targetColumns": ["id"],
				"onUpdate": "NO ACTION",
				"onDelete": "CASCADE",
				"deferrable": false,
				"deferred": false
			}],
			"indexes": 1,
			"identities": []
		}
	],
	objects: [{
		"table": "workboard_session_placements",
		"kind": "check",
		"sql": "(\"source\" IN ('state', 'model', 'operator'))"
	}],
	preData: [0, 6963],
	postData: [6963, 10540]
};
//#endregion
//#region src/infra/database-engine/workboard-port.ts
async function loadWorkboardPortDescriptor() {
	const plugins = resolveBundledPluginsDir();
	if (!plugins) throw new Error("Bundled workboard port descriptor is unavailable.");
	const postgres = await fs.readFile(path.join(plugins, "workboard/src/workboard-schema.postgres.sql"), "utf8");
	return {
		...workboard_port_generated_default,
		preData: postgres.slice(workboard_port_generated_default.preData[0], workboard_port_generated_default.preData[1]),
		postData: postgres.slice(workboard_port_generated_default.postData[0], workboard_port_generated_default.postData[1]),
		expectedCatalog: expectedPostgresCatalog(workboard_port_generated_default)
	};
}
async function withWorkboardPostgres(config, run) {
	const input = await resolveDatabaseEngineInput(config);
	if (!input) throw new Error("PostgreSQL requires database.engine=postgres and a resolvable connection.");
	const { Client } = await import("pg");
	const client = new Client({ connectionString: input.connection });
	client.on("error", () => void 0);
	await client.connect();
	try {
		return await run(client, await loadWorkboardPortDescriptor());
	} finally {
		await client.end();
	}
}
//#endregion
//#region src/snapshot/snapshot-provider.ts
const SNAPSHOT_MANIFEST_FILENAME = "manifest.json";
const SNAPSHOT_SQLITE_FILENAME = "database.sqlite";
//#endregion
//#region src/snapshot/manifest.ts
const MAX_MANIFEST_BYTES = 1048576;
const MAX_SQLITE_USER_VERSION = 2147483647;
const MIN_SQLITE_USER_VERSION = -2147483648;
const SNAPSHOT_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
async function hashSnapshotArtifact(snapshotDir) {
	const opened = await (await root(snapshotDir)).open(SNAPSHOT_SQLITE_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	try {
		return {
			...await hashFileHandle(opened.handle),
			stat: opened.stat,
			identity: opened.exactIdentity
		};
	} finally {
		await opened.handle.close();
	}
}
async function copySnapshotArtifact(snapshotDir, targetPath) {
	const source = await (await root(snapshotDir)).open(SNAPSHOT_SQLITE_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	let target;
	let targetIdentity;
	try {
		target = await fs.open(targetPath, "wx+", 384);
		targetIdentity = await target.stat({ bigint: true });
		const digest = await hashFileHandle(source.handle, target);
		await target.sync();
		const finalIdentity = await target.stat({ bigint: true });
		const currentIdentity = await fs.lstat(targetPath, { bigint: true });
		if (!sameFileIdentity(targetIdentity, finalIdentity) || !sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`Snapshot restore staging file changed during copy: ${targetPath}`);
		return {
			...digest,
			stat: await target.stat(),
			identity: finalIdentity
		};
	} catch (error) {
		await target?.close().catch(() => void 0);
		target = void 0;
		if (targetIdentity) {
			const currentIdentity = await fs.lstat(targetPath, { bigint: true }).catch(() => void 0);
			if (currentIdentity && sameFileIdentity(targetIdentity, currentIdentity)) await fs.unlink(targetPath).catch(() => void 0);
		}
		throw error;
	} finally {
		await target?.close().catch(() => void 0);
		await source.handle.close().catch(() => void 0);
	}
}
async function hashFileHandle(source, target) {
	const initialStat = await source.stat({ bigint: true });
	let sizeBytes = 0;
	if (target) sizeBytes = await copyFileHandle(source, target);
	const hashed = await sha256File(target ?? source);
	const finalStat = await source.stat({ bigint: true });
	if (!sameFileMutationFingerprint(initialStat, finalStat) || target && sizeBytes !== hashed.bytes) throw new Error("Snapshot artifact changed while being read.");
	return {
		sha256: hashed.digest,
		sizeBytes: hashed.bytes
	};
}
async function writeSnapshotManifest(snapshotDir, manifest) {
	const manifestPath = path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME);
	const handle = await fs.open(manifestPath, "wx+", 384);
	try {
		await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`, "utf8");
		await handle.sync();
	} finally {
		await handle.close();
	}
}
async function readSnapshotManifest(snapshotDir, expectedSnapshotId = path.basename(snapshotDir)) {
	const snapshotRoot = await root(snapshotDir);
	const manifestPath = path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME);
	const result = await snapshotRoot.read(SNAPSHOT_MANIFEST_FILENAME, {
		hardlinks: "reject",
		maxBytes: MAX_MANIFEST_BYTES,
		symlinks: "reject"
	});
	let parsed;
	try {
		parsed = JSON.parse(result.buffer.toString("utf8"));
	} catch (error) {
		throw new Error(`Snapshot manifest is not valid JSON: ${manifestPath}`, { cause: error });
	}
	return parseSnapshotManifest(parsed, manifestPath, expectedSnapshotId);
}
function parseSnapshotManifest(value, manifestPath, expectedSnapshotId) {
	const record = requireRecord(value, "manifest", manifestPath);
	requireExactKeys(record, [
		"schemaVersion",
		"snapshotId",
		"createdAt",
		"database",
		"artifact"
	]);
	if (record.schemaVersion !== 1) throw new Error(`Unsupported snapshot manifest schemaVersion ${String(record.schemaVersion)}: ${manifestPath}`);
	const snapshotId = requireSnapshotId(record.snapshotId, manifestPath);
	if (snapshotId !== expectedSnapshotId) throw new Error(`Snapshot manifest id ${snapshotId} does not match directory ${expectedSnapshotId}: ${manifestPath}`);
	const createdAt = requireCanonicalTimestamp(record.createdAt, manifestPath);
	const database = parseSnapshotDatabase(record.database, manifestPath);
	const artifactRecord = requireRecord(record.artifact, "artifact", manifestPath);
	requireExactKeys(artifactRecord, [
		"path",
		"sha256",
		"sizeBytes"
	]);
	if (artifactRecord.path !== "database.sqlite") throw new Error(`Snapshot manifest artifact.path must be ${SNAPSHOT_SQLITE_FILENAME}: ${manifestPath}`);
	if (typeof artifactRecord.sha256 !== "string" || !SHA256_PATTERN.test(artifactRecord.sha256)) throw new Error(`Snapshot manifest artifact.sha256 is invalid: ${manifestPath}`);
	if (!Number.isSafeInteger(artifactRecord.sizeBytes) || Number(artifactRecord.sizeBytes) <= 0) throw new Error(`Snapshot manifest artifact.sizeBytes is invalid: ${manifestPath}`);
	return {
		schemaVersion: 1,
		snapshotId,
		createdAt,
		database,
		artifact: {
			path: SNAPSHOT_SQLITE_FILENAME,
			sha256: artifactRecord.sha256,
			sizeBytes: Number(artifactRecord.sizeBytes)
		}
	};
}
function parseSnapshotDatabase(value, manifestPath) {
	const database = requireRecord(value, "database", manifestPath);
	const role = database.role;
	const basename = requireSafeText(database.basename, "database.basename", manifestPath, 255);
	if (path.basename(basename) !== basename || basename === "." || basename === "..") throw new Error(`Snapshot manifest database.basename is invalid: ${manifestPath}`);
	const userVersion = requireSqliteUserVersion(database.userVersion, manifestPath);
	if (role === "global") {
		requireExactKeys(database, [
			"role",
			"basename",
			"userVersion"
		]);
		return {
			role,
			basename,
			userVersion
		};
	}
	if (role === "agent") {
		requireExactKeys(database, [
			"role",
			"agentId",
			"basename",
			"userVersion"
		]);
		const agentId = requireSafeText(database.agentId, "database.agentId", manifestPath, 64);
		if (!isValidAgentId(agentId) || normalizeAgentId(agentId) !== agentId) throw new Error(`Snapshot manifest database.agentId is invalid: ${manifestPath}`);
		return {
			role,
			agentId,
			basename,
			userVersion
		};
	}
	if (role === "generic") {
		requireExactKeys(database, [
			"role",
			"id",
			"basename",
			"userVersion"
		]);
		return {
			role,
			id: requireSafeText(database.id, "database.id", manifestPath, 256),
			basename,
			userVersion
		};
	}
	throw new Error(`Snapshot manifest database.role is invalid: ${manifestPath}`);
}
function requireRecord(value, field, manifestPath) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Snapshot manifest ${field} must be an object: ${manifestPath}`);
	return value;
}
function requireExactKeys(record, expectedKeys) {
	const actual = Object.keys(record).toSorted();
	const expected = [...expectedKeys].toSorted();
	if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new Error(`Snapshot manifest fields must be exactly ${expectedKeys.join(", ")}; got ${actual.join(", ")}`);
}
function requireSnapshotId(value, manifestPath) {
	if (typeof value !== "string" || !SNAPSHOT_ID_PATTERN.test(value)) throw new Error(`Snapshot manifest snapshotId is invalid: ${manifestPath}`);
	return value;
}
function requireCanonicalTimestamp(value, manifestPath) {
	if (typeof value !== "string") throw new Error(`Snapshot manifest createdAt is invalid: ${manifestPath}`);
	const parsed = new Date(value);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) throw new Error(`Snapshot manifest createdAt is not canonical ISO 8601: ${manifestPath}`);
	return value;
}
function requireSafeText(value, field, manifestPath, maxLength) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxLength || value.trim() !== value || containsAsciiControlCharacter(value)) throw new Error(`Snapshot manifest ${field} is invalid: ${manifestPath}`);
	return value;
}
function requireSqliteUserVersion(value, manifestPath) {
	if (!Number.isSafeInteger(value) || Number(value) < MIN_SQLITE_USER_VERSION || Number(value) > MAX_SQLITE_USER_VERSION) throw new Error(`Snapshot manifest database.userVersion is invalid: ${manifestPath}`);
	return Number(value);
}
//#endregion
//#region src/snapshot/export-envelope.ts
const identifier = string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/);
const digest = string().regex(/^[a-f0-9]{64}$/);
const version = number().int().nonnegative().max(2147483647);
const artifact$1 = strictObject({
	sha256: digest,
	sizeBytes: number().int().positive().safe()
});
const table = strictObject({
	rows: number().int().nonnegative().safe(),
	sha256: digest
});
const allocation = strictObject({
	value: string().regex(/^(0|[1-9][0-9]{0,18})$/).refine((value) => /^[0-9]{1,19}$/.test(value) && BigInt(value) <= 9223372036854775807n),
	called: boolean()
});
const postgresEnvelope = strictObject({
	schemaVersion: literal(2),
	snapshotId: identifier,
	createdAt: datetime({ precision: 3 }),
	profile: _enum(["exact", "user-backup"]),
	source: strictObject({
		engine: literal("postgres"),
		storeId: uuid(),
		owner: identifier,
		namespace: identifier,
		schemaVersion: version
	}),
	exportSchemaVersion: version,
	activeFragments: array(identifier),
	verification: strictObject({
		tables: record(identifier, table),
		allocations: record(identifier, allocation)
	}),
	artifacts: strictObject({
		"database.sqlite": artifact$1,
		"anchor.sqlite": artifact$1
	}),
	sanitizedDifferences: array(identifier)
}).refine((value) => value.profile !== "exact" || value.sanitizedDifferences.length === 0, { message: "Exact exports must not contain sanitization differences" });
function parsePostgresEnvelope(value, expectedId) {
	const manifest = postgresEnvelope.parse(value);
	if (manifest.snapshotId !== expectedId) throw new Error("Export manifest id does not match its directory");
	return manifest;
}
async function readSnapshotExportEnvelope(directory, expectedId = path.basename(directory)) {
	const bytes = await (await root(directory)).read(SNAPSHOT_MANIFEST_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject",
		maxBytes: 1048576
	});
	const value = JSON.parse(bytes.buffer.toString("utf8"));
	if (value && typeof value === "object" && "schemaVersion" in value && value.schemaVersion === 1) return {
		engine: "sqlite",
		manifest: parseSnapshotManifest(value, directory, expectedId)
	};
	return {
		engine: "postgres",
		manifest: parsePostgresEnvelope(value, expectedId)
	};
}
async function writePostgresExportEnvelope(directory, value) {
	const manifest = parsePostgresEnvelope(value, path.basename(directory));
	const handle = await fs.open(path.join(directory, SNAPSHOT_MANIFEST_FILENAME), "wx", 384);
	try {
		await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`);
		await handle.sync();
	} finally {
		await handle.close();
	}
}
/** The owner inspects the held anchor, never a separately reopened pathname. */
async function verifyPostgresExportEnvelope(directory, value, inspectAnchor, requiredProfile) {
	const manifest = parsePostgresEnvelope(value, path.basename(directory));
	if (manifest.profile !== requiredProfile) throw new Error("Export profile does not match the requested restore");
	const files = await root(directory);
	for (const name of ["database.sqlite", "anchor.sqlite"]) {
		const opened = await files.open(name, {
			hardlinks: "reject",
			symlinks: "reject"
		});
		try {
			const before = await opened.handle.stat({ bigint: true });
			const actual = await sha256File(opened.handle);
			const expected = manifest.artifacts[name];
			if (actual.digest !== expected.sha256 || actual.bytes !== expected.sizeBytes) throw new Error(`Export artifact verification failed: ${name}`);
			if (name === "anchor.sqlite") {
				const anchor = await inspectAnchor(opened.handle);
				if (anchor.engine !== "postgres" || anchor.storeId !== manifest.source.storeId || anchor.namespace !== manifest.source.namespace) throw new Error("Export anchor does not match the source store identity");
			}
			if (!sameFileMutationFingerprint(before, await opened.handle.stat({ bigint: true }))) throw new Error(`Export artifact changed during verification: ${name}`);
		} finally {
			await opened.handle.close();
		}
	}
}
//#endregion
//#region src/snapshot/database-backup.ts
async function runOfflineDatabaseBackup(sourcePath, run) {
	const { runWithLocalStateOwner } = await import("./local-state-owner-DLqjNnxj.mjs");
	const { resolveStateDir } = await import("./paths-DrzAhjmf.mjs");
	if (hasActiveGatewayStateOwner(path.join(resolveStateDir(), "state", "openclaw.sqlite"))) throw new Error("PostgreSQL backup requires the Gateway stopped; stop through the service owner, then rerun.");
	return runWithLocalStateOwner({
		method: "backup.create",
		params: {},
		target: sourcePath,
		onForeignOwner: "refuse",
		runLocal: run
	});
}
async function verifyMatchedPostgresBackup(directory, profile) {
	if ((await fs.readdir(directory)).includes(".pending")) throw new Error("PostgreSQL backup is incomplete.");
	const envelope = await readSnapshotExportEnvelope(directory);
	if (envelope.engine !== "postgres") throw new Error("Expected a matched PostgreSQL export.");
	await verifyPostgresExportEnvelope(directory, envelope.manifest, inspectHeldAnchor, profile);
	return envelope.manifest;
}
/** Reads an already captured private image without reacquiring its live source. */
function readBackupEngineImage(imagePath, sourcePath) {
	try {
		var _usingCtx$1 = _usingCtx();
		const db = _usingCtx$1.u(openNodeSqliteDatabase(imagePath, { readOnly: true }));
		const rows = readEngineAnchor(db);
		if (!rows) return { engine: "sqlite" };
		const row = rows[0];
		if (rows.length !== 1 || row?.engine !== "postgres" || typeof row.store_id !== "string" || typeof row.schema !== "string" || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(row.schema)) throw new Error(`Invalid PostgreSQL anchor: ${sourcePath}. Restore its matched backup.`);
		return {
			engine: "postgres",
			storeId: row.store_id,
			namespace: row.schema
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Acquire the private image in a child so source descriptor closes preserve live POSIX locks. */
function readBackupEngine(sourcePath) {
	const prepared = prepareSqliteReadOnlyLocationSync(sourcePath);
	try {
		return readBackupEngineImage(prepared.location, sourcePath);
	} finally {
		prepared.cleanup();
	}
}
async function captureDatabaseArtifact(file) {
	try {
		var _usingCtx3 = _usingCtx();
		const handle = _usingCtx3.a(await fs.open(file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW));
		const stat = await handle.stat();
		if (!stat.isFile() || stat.nlink !== 1) throw new Error(`Database artifact must be an unaliased regular file: ${file}`);
		const { digest, bytes } = await sha256File(handle);
		return {
			path: file,
			sha256: digest,
			size: bytes
		};
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
async function artifact(file) {
	const { sha256, size } = await captureDatabaseArtifact(file);
	return {
		sha256,
		sizeBytes: size
	};
}
async function assertDatabaseArtifact(expected) {
	if (!isDeepStrictEqual(await captureDatabaseArtifact(expected.path), expected)) throw new Error(`Database artifact changed: ${expected.path}`);
}
async function inspectHeldAnchor(handle) {
	const workspace = {
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-anchor-"
	};
	return await withTempWorkspace(workspace, async ({ dir }) => {
		const file = path.join(dir, "anchor.sqlite");
		try {
			var _usingCtx4 = _usingCtx();
			const output = _usingCtx4.a(await fs.open(file, "wx", 384));
			await copyFileHandle(handle, output);
		} catch (_) {
			_usingCtx4.e = _;
		} finally {
			await _usingCtx4.d();
		}
		const anchor = readBackupEngine(file);
		if (anchor.engine !== "postgres") throw new Error("Export artifact is not a PostgreSQL anchor.");
		return anchor;
	});
}
/** Caller retains stopped installation custody until all client/native handles settle. */
async function capturePostgresBackupInWorker(params) {
	const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-BjQFcr9G.mjs");
	const anchor = readBackupEngine(params.sourcePath);
	if (anchor.engine !== "postgres") throw new Error("A PostgreSQL backup requires its original anchor.");
	await fs.mkdir(params.directory, { mode: 448 });
	await fs.writeFile(path.join(params.directory, ".pending"), "", {
		flag: "wx",
		mode: 384
	});
	return await withWorkboardPostgres(params.config, async (client, descriptor) => {
		const raw = path.join(params.directory, ".export.sqlite");
		const image = path.join(params.directory, "database.sqlite");
		const anchorPath = path.join(params.directory, "anchor.sqlite");
		params.assertCurrent();
		await createVerifiedSqliteSnapshot({
			sourcePath: params.sourcePath,
			targetPath: anchorPath,
			preserveRowIds: true
		});
		let verification;
		try {
			var _usingCtx5 = _usingCtx();
			params.assertCurrent();
			await fs.writeFile(raw, "", {
				flag: "wx",
				mode: 384
			});
			const db = _usingCtx5.u(openNodeSqliteDatabase(raw, { readBigInts: true }));
			verification = await materializeDatabasePort({
				source: {
					engine: "postgres",
					db: client,
					namespace: anchor.namespace
				},
				destination: {
					engine: "sqlite",
					db
				},
				descriptor,
				storeId: anchor.storeId,
				assertCurrent: params.assertCurrent,
				transformRow: params.gitIdentity ? (await import("./git-backup-sanitizer-kNrjmCI7.mjs")).createGitBackupRowTransform(params.gitIdentity, descriptor.id, new Set(descriptor.tables.map(({ name }) => name))) : void 0
			});
		} catch (_) {
			_usingCtx5.e = _;
		} finally {
			_usingCtx5.d();
		}
		const sanitizedDifferences = [];
		params.assertCurrent();
		if (params.profile === "exact") await fs.rename(raw, image);
		else {
			const { sanitizeOpenClawGlobalStateSnapshot } = await import("./openclaw-state-snapshot-sanitizer-B5N5Egac.mjs");
			await createVerifiedSqliteSnapshot({
				sourcePath: raw,
				targetPath: image,
				preserveRowIds: true,
				async transform(db) {
					if (params.gitIdentity) sanitizedDifferences.push("git-exclude-secrets");
					const before = db.prepare("SELECT total_changes() AS n").get()?.n;
					sanitizeOpenClawGlobalStateSnapshot(db);
					const { embedSessionColdArchivesInSnapshot } = await import("./session-cold-storage-backup-BMC87aHt.mjs");
					await embedSessionColdArchivesInSnapshot({
						database: db,
						sourceStorePath: params.sourcePath
					});
					if (db.prepare("SELECT total_changes() AS n").get()?.n !== before) sanitizedDifferences.push("transient-state");
					if (params.gitIdentity) verification.tables = (await inspectDatabasePort({
						engine: "sqlite",
						db
					}, descriptor)).tables;
				}
			});
			await fs.unlink(raw);
		}
		const manifest = {
			schemaVersion: 2,
			snapshotId: path.basename(params.directory),
			createdAt: (/* @__PURE__ */ new Date()).toISOString(),
			profile: params.profile,
			source: {
				...anchor,
				owner: descriptor.id,
				schemaVersion: descriptor.version
			},
			exportSchemaVersion: descriptor.version,
			activeFragments: [],
			verification,
			artifacts: {
				"database.sqlite": await artifact(image),
				"anchor.sqlite": await artifact(anchorPath)
			},
			sanitizedDifferences
		};
		params.assertCurrent();
		await writePostgresExportEnvelope(params.directory, manifest);
		await verifyPostgresExportEnvelope(params.directory, manifest, inspectHeldAnchor, params.profile);
		await fs.unlink(path.join(params.directory, ".pending"));
		requireDirectorySync(await syncDirectory(params.directory), "PostgreSQL backup");
		requireDirectorySync(await syncDirectory(path.dirname(params.directory)), "PostgreSQL backup parent");
		return manifest;
	});
}
/** Build a new namespace and anchor; the caller alone publishes the anchor. Never drop the old namespace. */
async function preparePostgresRestoreInWorker(params) {
	const manifest = await verifyMatchedPostgresBackup(params.directory, params.profile);
	if (params.expectedSource && (manifest.source.storeId !== params.expectedSource.storeId || manifest.source.namespace !== params.expectedSource.namespace)) throw new Error("PostgreSQL rollback capture belongs to a different store.");
	return await withWorkboardPostgres(params.config, async (client, descriptor) => {
		try {
			var _usingCtx6 = _usingCtx();
			const namespace = `restore_${randomUUID().replaceAll("-", "")}`;
			const image = _usingCtx6.u(openNodeSqliteDatabase(path.join(params.directory, "database.sqlite"), {
				readOnly: true,
				readBigInts: true
			}));
			params.assertCurrent();
			const verified = await materializeDatabasePort({
				source: {
					engine: "sqlite",
					db: image
				},
				destination: {
					engine: "postgres",
					db: client,
					namespace
				},
				descriptor,
				storeId: manifest.source.storeId,
				sourceAllocations: manifest.verification.allocations,
				assertCurrent: params.assertCurrent
			});
			if (params.profile === "exact" && !isDeepStrictEqual(verified, manifest.verification)) throw new Error("Exact PostgreSQL export verification differs from its manifest.");
			params.assertCurrent();
			await fs.copyFile(path.join(params.directory, "anchor.sqlite"), params.anchorPath, fs.constants.COPYFILE_EXCL);
			if (!isDeepStrictEqual(await artifact(params.anchorPath), manifest.artifacts["anchor.sqlite"])) throw new Error("PostgreSQL restore anchor changed during preparation.");
			try {
				var _usingCtx7 = _usingCtx();
				_usingCtx7.u(openNodeSqliteDatabase(params.anchorPath)).prepare("UPDATE openclaw_engine_anchor SET schema = ?").run(namespace);
			} catch (_) {
				_usingCtx7.e = _;
			} finally {
				_usingCtx7.d();
			}
			return {
				...await artifact(params.anchorPath),
				namespace
			};
		} catch (_) {
			_usingCtx6.e = _;
		} finally {
			_usingCtx6.d();
		}
	});
}
async function runBackupTask(task, assertCurrent) {
	assertCurrent();
	const { WorkerTaskPool } = await import("./worker-task-pool-CvM7d10Q.mjs");
	const pool = new WorkerTaskPool({
		workerUrl: new URL(import.meta.url),
		maxWorkers: 1,
		workerOptions: { workerData: { openclawDatabaseBackup: true } }
	});
	try {
		const result = await pool.run(task, {});
		assertCurrent();
		return result;
	} finally {
		await pool.close();
	}
}
function capturePostgresBackup(params) {
	if (!("config" in params)) return runOfflineDatabaseBackup(params.sourcePath, ({ config, assertCurrent }) => capturePostgresBackup({
		...params,
		config,
		assertCurrent,
		profile: "user-backup"
	}));
	const { assertCurrent, ...input } = params;
	return runBackupTask({
		operation: "capture",
		params: input
	}, assertCurrent);
}
async function captureGitPostgresBackup(params) {
	if ((params.physicalEngine ?? readBackupEngine(params.snapshotPath).engine) !== "postgres") return;
	await fs.mkdir(params.outputPath, { mode: 448 });
	const exported = await runOfflineDatabaseBackup(params.snapshotPath, ({ config, assertCurrent }) => capturePostgresBackup({
		sourcePath: params.snapshotPath,
		directory: path.join(params.outputPath, "postgres"),
		profile: "user-backup",
		config,
		assertCurrent,
		...params.excludeSecrets ? { gitIdentity: params.identity } : {}
	}));
	const { gitBackupRedaction } = await import("./git-backup-sanitizer-kNrjmCI7.mjs");
	const redaction = gitBackupRedaction(params.identity, new Set(Object.keys(exported.verification.tables)), params.excludeSecrets === true, exported.source.owner);
	const manifest = {
		schemaVersion: 2,
		identity: params.identity,
		userVersion: exported.exportSchemaVersion,
		...redaction,
		tables: {}
	};
	await fs.writeFile(path.join(params.outputPath, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 384 });
	return manifest;
}
function preparePostgresRestore({ assertCurrent, ...params }) {
	return runBackupTask({
		operation: "restore",
		params
	}, assertCurrent);
}
function fingerprintPostgresBackup(sourcePath, config) {
	return runBackupTask({
		operation: "fingerprint",
		params: {
			sourcePath,
			config
		}
	}, () => {});
}
if (parentPort && workerData?.openclawDatabaseBackup === true) {
	const { serveWorkerTasks } = await import("./worker-task-server-BxttNAkS.mjs");
	serveWorkerTasks((value, _channel, control) => {
		const task = value;
		if (task.operation === "fingerprint") {
			const anchor = readBackupEngine(task.params.sourcePath);
			if (anchor.engine !== "postgres") throw new Error("PostgreSQL anchor disappeared.");
			return withWorkboardPostgres(task.params.config, async (db, descriptor) => createHash("sha256").update(JSON.stringify({
				...anchor,
				version: descriptor.version,
				...await inspectDatabasePort({
					engine: "postgres",
					db,
					namespace: anchor.namespace
				}, descriptor, anchor.storeId)
			})).digest("hex"));
		}
		return control.runNativeSection(() => task.operation === "capture" ? capturePostgresBackupInWorker({
			...task.params,
			assertCurrent: control.throwIfCancelled
		}) : preparePostgresRestoreInWorker({
			...task.params,
			assertCurrent: control.throwIfCancelled
		}));
	});
}
//#endregion
export { materializeDatabasePort as C, escapedSqliteText as E, inspectSqlitePortSchema as S, encodeSqliteValue as T, SNAPSHOT_SQLITE_FILENAME as _, fingerprintPostgresBackup as a, DatabasePortDataError as b, readBackupEngineImage as c, readSnapshotExportEnvelope as d, copySnapshotArtifact as f, SNAPSHOT_MANIFEST_FILENAME as g, writeSnapshotManifest as h, capturePostgresBackup as i, runOfflineDatabaseBackup as l, readSnapshotManifest as m, captureDatabaseArtifact as n, preparePostgresRestore as o, hashSnapshotArtifact as p, captureGitPostgresBackup as r, readBackupEngine as s, assertDatabaseArtifact as t, verifyMatchedPostgresBackup as u, loadWorkboardPortDescriptor as v, readPostgresPortCapabilities as w, inspectDatabasePort as x, withWorkboardPostgres as y };

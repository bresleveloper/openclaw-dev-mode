import { a as resolveOpenClawRegisteredAgentDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { i as readStateSchemaContentVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { t as assertCurrentStateRuntimeSchema } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { t as MEDIA_ROWS_MIGRATION_META_KEY } from "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { P as LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES, b as withoutOutboxEnqueueSequence, r as assertOpenClawAgentSchemaContains, s as getOpenClawAgentMigrationSchema, x as AGENT_JSON_PREDICATE_COLUMNS } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { n as resolveCapturedRegistryPath } from "./update-recovery-path-CMEBglNY.mjs";
import { a as withVerifiedUpdateRecoveryBackup } from "./update-recovery-backup-reader-veG5UeqB.mjs";
import { createHash } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/state/openclaw-migration-witness.ts
const identifier = string().max(256);
const count = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const headerInteger = number().int().min(-2147483648).max(2147483647);
const digest = string().regex(/^[a-f0-9]{64}$/u);
const registryRowSchema = object({
	store: digest,
	locator: digest,
	schemaVersion: headerInteger,
	sha256: digest
}).strict();
const tableSchema = object({
	name: identifier,
	columns: array(identifier).min(1).max(256),
	rowCount: count,
	sha256: digest,
	migrationSha256: digest,
	registryRows: array(registryRowSchema).max(4096).optional()
}).strict();
const witnessSchema = object({
	version: literal(1),
	role: _enum([
		"agent",
		"global",
		"sqlite"
	]),
	schemaVersion: headerInteger,
	applicationId: headerInteger,
	agentId: identifier.min(1).nullable(),
	schemaSha256: digest,
	migrationSchemaSha256: digest,
	registryMigrationBinding: digest.nullable(),
	tables: array(tableSchema).max(512),
	gaps: object({
		missingWindows: count,
		emptyWindows: count
	}).strict()
}).strict();
const derivedMigrationColumns = new Map(Object.entries({
	...AGENT_JSON_PREDICATE_COLUMNS,
	session_windows: ["row_transcript_json", "row_transcript_updated_at"]
}).map(([table, columns]) => [table, new Set(columns)]));
function assertUnique(values) {
	if (new Set(values).size !== values.length) throw new Error("Migration witness contains duplicate identities");
}
/** Treat loaded evidence as untrusted; an empty or unsupported owner projection cannot pass. */
function parseOpenClawMigrationWitness(value) {
	const witness = witnessSchema.parse(value);
	assertUnique(witness.tables.map((table) => table.name));
	for (const table of witness.tables) {
		assertUnique(table.columns);
		if (table.registryRows) assertUnique(table.registryRows.map((row) => row.locator));
		if (table.registryRows && !(witness.role === "global" && witness.registryMigrationBinding && table.name === "agent_databases")) throw new Error("Migration witness has unexpected registry observations");
		if (!(witness.role === "agent" && (["schema_meta", "session_key_contract"].includes(table.name) || derivedMigrationColumns.has(table.name))) && !(witness.role === "global" && witness.registryMigrationBinding && table.name === "agent_databases") && table.sha256 !== table.migrationSha256) throw new Error("Migration witness has an unsupported content transformation");
	}
	if (witness.role === "agent" && (witness.agentId === null || ![
		24,
		25,
		26,
		27
	].includes(witness.schemaVersion)) || witness.role !== "agent" && witness.agentId !== null || witness.role !== "agent" && witness.schemaSha256 !== witness.migrationSchemaSha256 || witness.role !== "global" && witness.registryMigrationBinding !== null || witness.role !== "agent" && (witness.gaps.missingWindows !== 0 || witness.gaps.emptyWindows !== 0) || witness.role === "global" && witness.schemaVersion !== 22) throw new Error("Unsupported migration witness owner or schema version");
	if ((witness.role === "agent" ? [
		"schema_meta",
		"session_nodes",
		"session_windows",
		"transcript_events",
		"session_key_contract",
		"session_canonical_validation_pending"
	] : witness.role === "global" ? ["schema_meta", "config_machine_state"] : []).some((name) => !witness.tables.some((table) => table.name === name))) throw new Error("Migration witness is missing its owner's required tables");
	return witness;
}
function migrationColumn(role, table, column) {
	return !(role === "agent" && (table === "schema_meta" && [
		"schema_version",
		"app_version",
		"updated_at"
	].includes(column) || table === "session_key_contract" && column === "canonical_ready" || derivedMigrationColumns.get(table)?.has(column)));
}
function hashCell(hash, type, value) {
	if (typeof type !== "string" || value !== null && typeof value !== "string" && !(value instanceof Uint8Array)) throw new Error("Unreadable migration witness cell");
	const bytes = value === null ? Buffer.alloc(0) : typeof value === "string" ? Buffer.from(value) : value;
	hash.update(`${type}:${bytes.byteLength}:`).update(bytes).update(";");
}
function witnessIdentifier(name, qualifier) {
	return sql.id(...qualifier ? [qualifier, name] : [name]);
}
function captureTable(database, role, table, withoutRowid, registry) {
	const db = getNodeSqliteKysely(database);
	const columns = executeSqliteQuerySync(database, db.selectFrom(sql`pragma_table_xinfo(${table})`.as("columns")).select([
		"name",
		"pk",
		"hidden"
	]).where("hidden", "!=", 1).orderBy("cid")).rows;
	if (columns.length === 0 || columns.length > 256) throw new Error(`Unsupported migration witness columns: ${table}`);
	const outbox = role === "agent" && table === "context_engine_turn_outbox";
	const names = columns.map(({ name }) => name).filter((name) => !outbox || name !== "enqueue_sequence");
	if (!withoutRowid) {
		const rowid = [
			"rowid",
			"_rowid_",
			"oid"
		].find((alias) => !names.some((name) => name.toLowerCase() === alias));
		if (!rowid) throw new Error(`Migration witness cannot inspect implicit row identity: ${table}`);
		names.unshift(rowid);
	}
	const retained = names.map((name) => migrationColumn(role, table, name));
	const sha256 = createHash("sha256").update(JSON.stringify(names));
	const migrationSha256 = retained.every(Boolean) && !registry ? void 0 : createHash("sha256").update(JSON.stringify(names.filter((_, index) => retained[index])));
	let query = db.selectFrom(sql`${witnessIdentifier(table)}`.as("witness")).select(names.flatMap((name, index) => {
		const column = witnessIdentifier(name, "witness");
		return [sql`typeof(${column})`.as(`type_${index}`), sql`CASE typeof(${column})
            WHEN 'integer' THEN CAST(${column} AS TEXT)
            WHEN 'real' THEN printf('%!.17g', ${column})
            WHEN 'text' THEN CAST(${column} AS BLOB)
            ELSE ${column} END`.as(`value_${index}`)];
	}));
	if (role === "agent" && table === "schema_meta") query = query.where(witnessIdentifier("meta_key", "witness"), "!=", MEDIA_ROWS_MIGRATION_META_KEY);
	const primary = columns.filter(({ pk }) => pk > 0).toSorted((a, b) => a.pk - b.pk);
	const primaryNames = outbox ? ["advancement_key"] : primary.map(({ name }) => name);
	for (const column of [...primaryNames, ...names.filter((name) => !primaryNames.includes(name))]) query = query.orderBy(witnessIdentifier(column, "witness"));
	let rowCount = 0;
	const expectedRegistrations = new Set(registry?.agents.map((agent) => `${agent.agentId}\0${agent.path}`));
	const requiredRegistrations = new Set(registry?.agents.filter((agent) => agent.requireRegistration).map((agent) => `${agent.agentId}\0${agent.path}`));
	const seenRegistrations = /* @__PURE__ */ new Set();
	const readyRegistrations = /* @__PURE__ */ new Set();
	const registryRows = [];
	const registryText = (row, column) => {
		const value = row[`value_${names.indexOf(column)}`];
		if (value === null || typeof value === "string") return value;
		if (value instanceof Uint8Array) return Buffer.from(value).toString("utf8");
		throw new Error(`Unreadable registry migration field: ${column}`);
	};
	for (const row of iterateSqliteQuerySync(database, query)) {
		rowCount++;
		let migratingRegistration = false;
		let registryKey = "";
		let registryLocator = "";
		let registryVersion = 0;
		if (registry) {
			const agentId = registryText(row, "agent_id");
			const storedPath = registryText(row, "path");
			const key = `${agentId}\0${storedPath === null ? "" : registry.resolvePath(resolveOpenClawRegisteredAgentDatabasePath(registry.sourcePath, storedPath))}`;
			migratingRegistration = expectedRegistrations.has(key);
			if (migratingRegistration) {
				registryKey = key;
				registryLocator = `${agentId}\0${storedPath}`;
				registryVersion = Number(registryText(row, "schema_version"));
				if (registryVersion === 27) readyRegistrations.add(key);
				const observedAt = registryText(row, "last_seen_at");
				const sizeBytes = registryText(row, "size_bytes");
				if (observedAt === null || BigInt(observedAt) < 0n || sizeBytes !== null && BigInt(sizeBytes) < 0n) throw new Error("Registry migration contains invalid observation metadata");
				seenRegistrations.add(key);
			}
		}
		const registryRowHash = migratingRegistration ? createHash("sha256").update(JSON.stringify(names)) : void 0;
		for (let index = 0; index < names.length; index++) {
			hashCell(sha256, row[`type_${index}`], row[`value_${index}`]);
			if (registryRowHash) hashCell(registryRowHash, row[`type_${index}`], row[`value_${index}`]);
			if (retained[index] && migrationSha256) {
				if (migratingRegistration && [
					"schema_version",
					"last_seen_at",
					"size_bytes"
				].includes(names[index])) hashCell(migrationSha256, "null", null);
				else hashCell(migrationSha256, row[`type_${index}`], row[`value_${index}`]);
			}
		}
		sha256.update("\n");
		migrationSha256?.update("\n");
		if (registryRowHash) {
			if (registryRows.length === 4096) throw new Error("Migration witness exceeds its 4096-registry-locator bound");
			registryRows.push({
				store: createHash("sha256").update(registryKey).digest("hex"),
				locator: createHash("sha256").update(registryLocator).digest("hex"),
				schemaVersion: registryVersion,
				sha256: registryRowHash.digest("hex")
			});
		}
	}
	if (registry && seenRegistrations.size !== expectedRegistrations.size) throw new Error("Cannot bind registry observations to every captured agent store; the original alias evidence may be unavailable");
	if (registry?.phase === "candidate" && [...requiredRegistrations].some((key) => !readyRegistrations.has(key))) throw new Error("Registry schema version contradicts the verified agent migration");
	const hash = sha256.digest("hex");
	return {
		name: table,
		columns: names,
		rowCount,
		sha256: hash,
		migrationSha256: migrationSha256?.digest("hex") ?? hash,
		...registry ? { registryRows } : {}
	};
}
/** Read a caller-owned snapshot; no open, repair, backup, or schema mutation occurs here. */
function captureOpenClawMigrationWitness(database, owner, registry) {
	return runSqliteReadSnapshotSync(database, () => {
		const db = getNodeSqliteKysely(database);
		const role = owner?.role ?? "sqlite";
		if (registry && (role !== "global" || registry.agents.length === 0 || registry.agents.length > 4096)) throw new Error("Invalid registry migration witness context");
		const userVersion = readSqliteUserVersion(database);
		const applicationId = executeSqliteQueryTakeFirstSync(database, db.selectFrom(sql`pragma_application_id()`.as("header")).select("application_id"))?.application_id;
		const schemaVersion = role === "global" ? readStateSchemaContentVersion(database) : userVersion;
		if (owner) {
			const metadata = executeSqliteQueryTakeFirstSync(database, db.selectFrom("schema_meta").select(["role", "agent_id"]).select((eb) => eb.cast("schema_version", "text").as("schema_version")).where("meta_key", "=", "primary"));
			if (metadata?.role !== owner.role || owner.role === "agent" && metadata.agent_id !== owner.agentId || metadata.schema_version !== String(userVersion)) throw new Error("Migration witness database owner does not match the backup inventory");
			if (owner.role === "agent") {
				if (![
					24,
					25,
					26,
					27
				].includes(schemaVersion)) throw new Error(`Unsupported agent migration witness schema: ${schemaVersion}`);
				assertOpenClawAgentSchemaContains(database, "migration witness", getOpenClawAgentMigrationSchema(schemaVersion));
			} else {
				if (schemaVersion !== 22) throw new Error(`Unsupported shared-state migration witness schema: ${schemaVersion}`);
				assertCurrentStateRuntimeSchema(database, "migration witness");
			}
		}
		const catalog = executeSqliteQuerySync(database, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").orderBy("name").limit(513)).rows;
		if (catalog.length > 512) throw new Error("Migration witness exceeds its 512-table bound");
		const tableKinds = new Map(executeSqliteQuerySync(database, db.selectFrom(sql`pragma_table_list()`.as("tables")).select([
			"name",
			"wr",
			"strict"
		]).where("schema", "=", "main")).rows.map((table) => [table.name, {
			withoutRowid: table.wr !== 0,
			strict: table.strict !== 0
		}]));
		const tables = catalog.map(({ name }) => identifier.parse(name)).filter((name) => !name.startsWith("sqlite_stat")).map((name) => {
			const kind = tableKinds.get(name);
			if (kind === void 0) throw new Error(`Migration witness table disappeared: ${name}`);
			return captureTable(database, role, name, kind.withoutRowid, name === "agent_databases" ? registry : void 0);
		});
		const schemaHash = createHash("sha256");
		const migrationSchemaHash = createHash("sha256");
		for (const object of iterateSqliteQuerySync(database, db.selectFrom("sqlite_schema").select([
			"type",
			"name",
			"tbl_name",
			"sql"
		]).orderBy("type").orderBy("name"))) {
			if (object.name.startsWith("sqlite_stat")) continue;
			schemaHash.update(JSON.stringify(object)).update("\n");
			if (role === "agent" && schemaVersion === 24 && object.type === "trigger" && LEGACY_CANONICAL_VALIDATION_TRIGGER_NAMES.includes(object.name)) continue;
			if (role === "agent" && object.type === "table" && (object.name === "session_key_contract" || derivedMigrationColumns.has(object.name))) {
				const definition = parseSqliteTableDefinition(object.name === "context_engine_turn_outbox" && object.sql ? withoutOutboxEnqueueSequence(object.sql) : object.sql, object.name);
				for (const column of definition.columns.keys()) if (!migrationColumn(role, object.name, column)) definition.columns.delete(column);
				migrationSchemaHash.update(JSON.stringify({
					...object,
					sql: {
						columns: [...definition.columns],
						constraints: definition.constraints,
						...tableKinds.get(object.name)
					}
				})).update("\n");
			} else migrationSchemaHash.update(JSON.stringify(object)).update("\n");
		}
		const gaps = {
			missingWindows: 0,
			emptyWindows: 0
		};
		if (role === "agent") {
			gaps.missingWindows = Number(executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_nodes as node").select((eb) => eb.fn.countAll().as("count")).where((eb) => eb.not(eb.exists(eb.selectFrom("session_windows as window").select("window.session_id").whereRef("window.session_id", "=", "node.current_session_id")))))?.count);
			gaps.emptyWindows = Number(executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_windows as window").select((eb) => eb.fn.countAll().as("count")).where((eb) => eb.not(eb.exists(eb.selectFrom("transcript_events as event").select("event.session_id").whereRef("event.session_id", "=", "window.session_id")))).where((eb) => eb.not(eb.exists(eb.selectFrom("session_transcript_cold_archives as cold").select("cold.session_id").whereRef("cold.session_id", "=", "window.session_id")))))?.count);
		}
		return parseOpenClawMigrationWitness({
			version: 1,
			role,
			schemaVersion,
			applicationId,
			agentId: owner?.role === "agent" ? owner.agentId : null,
			schemaSha256: schemaHash.digest("hex"),
			migrationSchemaSha256: migrationSchemaHash.digest("hex"),
			registryMigrationBinding: registry ? createHash("sha256").update(JSON.stringify([registry.sourcePath, registry.agents.toSorted((left, right) => left.agentId.localeCompare(right.agentId) || left.path.localeCompare(right.path)).map((agent) => [
				agent.agentId,
				agent.path,
				agent.requireRegistration
			])])).digest("hex") : null,
			tables,
			gaps
		});
	});
}
/** The caller binds original evidence to a verified original backup, never to a new capture. */
function assertOpenClawMigrationWitnessPreserved(originalValue, currentValue) {
	const original = parseOpenClawMigrationWitness(originalValue);
	const current = parseOpenClawMigrationWitness(currentValue);
	const crossing = original.role === "agent" && original.schemaVersion < current.schemaVersion && current.schemaVersion <= 27;
	if (original.role !== current.role || original.agentId !== current.agentId || original.applicationId !== current.applicationId || original.registryMigrationBinding !== current.registryMigrationBinding || !crossing && original.schemaVersion !== current.schemaVersion) throw new Error("Unsupported migration witness owner or version transition");
	if ((crossing ? original.migrationSchemaSha256 : original.schemaSha256) !== (crossing ? current.migrationSchemaSha256 : current.schemaSha256)) throw new Error("Migration changed or lost retained database schema");
	if (current.registryMigrationBinding) {
		const originalRows = new Map((original.tables.find((table) => table.name === "agent_databases")?.registryRows ?? []).map((row) => [row.locator, row]));
		const currentRows = current.tables.find((table) => table.name === "agent_databases")?.registryRows;
		if (!currentRows || originalRows.size !== currentRows.length) throw new Error("Missing registry row witnesses");
		for (const row of currentRows) {
			const before = originalRows.get(row.locator);
			if (!before || before.store !== row.store || row.schemaVersion !== 27 && row.sha256 !== before.sha256) throw new Error("Unrefreshed registry alias changed during migration");
		}
	}
	const projected = (witness) => witness.tables.filter((table) => !crossing || table.name !== "session_canonical_validation_pending").map((table) => ({
		name: table.name,
		columns: crossing ? table.columns.filter((column) => migrationColumn(witness.role, table.name, column)) : table.columns,
		rowCount: table.rowCount,
		sha256: crossing || witness.registryMigrationBinding ? table.migrationSha256 : table.sha256
	})).toSorted((a, b) => a.name.localeCompare(b.name));
	const originalTables = projected(original);
	const currentTables = new Map(projected(current).map((table) => [table.name, table]));
	for (const table of originalTables) {
		if (JSON.stringify(table) !== JSON.stringify(currentTables.get(table.name))) throw new Error(`Migration changed or lost retained database content: ${table.name}`);
		currentTables.delete(table.name);
	}
	if (currentTables.size > 0) throw new Error("Migration added unclassified database content");
	return { warnings: Object.entries(original.gaps).filter(([, value]) => value > 0).map(([kind, value]) => `Preexisting session history gap: ${kind} (${value})`) };
}
//#endregion
//#region src/commands/doctor-migration-preservation.ts
function readWitness(ref, entry, owner, registry) {
	if (entry.kind !== "file" || !entry.sqlite) throw new Error(`Preservation requires a captured SQLite payload: ${entry.sourcePath}`);
	const pathname = path.join(ref.directory, entry.archivePath);
	const db = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(pathname), { readOnly: true });
	try {
		db.exec("PRAGMA trusted_schema = OFF;");
		assertSqliteIntegrity(db, entry.sourcePath);
		return captureOpenClawMigrationWitness(db, owner, registry);
	} finally {
		db.close();
	}
}
/** Read-only cold evidence. It cannot admit a migration, start a service, or replace originals. */
async function inspectDoctorMigrationPreservation(params) {
	return withVerifiedUpdateRecoveryBackup(params.original, async (original) => withVerifiedUpdateRecoveryBackup(params.candidate, async (candidate) => {
		if (original.generation?.kind !== "baseline" || original.stateDir !== candidate.stateDir || original.configPath !== candidate.configPath || original.installRoot !== candidate.installRoot || !isDeepStrictEqual(original.excludedRoots, candidate.excludedRoots) || candidate.generation?.kind !== "baseline" && candidate.generation?.baselineSha256 !== params.original.manifestSha256) throw new Error("Preservation captures do not share the admitted original scope.");
		const candidates = new Map(candidate.entries.map((entry) => [entry.sourcePath, entry]));
		const originalLinks = new Map(original.entries.filter((entry) => entry.kind === "symlink").map((entry) => [entry.sourcePath, entry.target]));
		const candidateLinks = new Map(candidate.entries.filter((entry) => entry.kind === "symlink").map((entry) => [entry.sourcePath, entry.target]));
		const originalDirectories = new Set(original.entries.filter((entry) => entry.kind === "directory").map((entry) => entry.sourcePath));
		const candidateDirectories = new Set(candidate.entries.filter((entry) => entry.kind === "directory").map((entry) => entry.sourcePath));
		const originalPaths = new Set(original.entries.map((entry) => entry.sourcePath));
		for (const entry of candidate.entries) if (!originalPaths.has(entry.sourcePath)) throw new Error(`Preservation added an unclassified resource: ${entry.sourcePath}`);
		const originalOwners = new Map(original.databases.map((owner) => [owner.path, owner]));
		const candidateOwners = new Map(candidate.databases.map((owner) => [owner.path, owner]));
		if (originalOwners.size !== candidateOwners.size || [...originalOwners].some(([pathname, owner]) => !isDeepStrictEqual(owner, candidateOwners.get(pathname)))) throw new Error("Preservation database ownership inventory changed");
		const warnings = new Set([...original.warnings ?? [], ...candidate.warnings ?? []].map((warning) => warning.message));
		const agentPairs = /* @__PURE__ */ new Map();
		const migratingAgents = [];
		for (const entry of original.entries) {
			const owner = originalOwners.get(entry.sourcePath);
			if (entry.kind !== "file" || !entry.sqlite || owner?.role !== "agent") continue;
			const after = candidates.get(entry.sourcePath);
			if (!after) throw new Error(`Preservation lost an inventoried resource: ${entry.sourcePath}`);
			const beforeWitness = readWitness(params.original, entry, owner);
			const afterWitness = readWitness(params.candidate, after, owner);
			assertOpenClawMigrationWitnessPreserved(beforeWitness, afterWitness);
			agentPairs.set(entry.sourcePath, {
				before: beforeWitness,
				after: afterWitness
			});
			if (afterWitness.schemaVersion === 27) migratingAgents.push({
				agentId: owner.agentId,
				path: owner.path,
				requireRegistration: beforeWitness.schemaVersion < 27
			});
		}
		let databases = 0;
		let files = 0;
		for (const entry of original.entries) {
			const after = candidates.get(entry.sourcePath);
			if (!after) throw new Error(`Preservation lost an inventoried resource: ${entry.sourcePath}`);
			if (entry.kind === "missing") {
				if (!isDeepStrictEqual(entry, after)) throw new Error(`Preservation changed a previously missing resource: ${entry.sourcePath}`);
				warnings.add(`Preexisting missing resource: ${entry.sourcePath}`);
				continue;
			}
			if (entry.kind === "file" && entry.sqlite) {
				if (after.kind !== "file" || !after.sqlite || after.mode !== entry.mode) throw new Error(`Preservation changed SQLite file kind or mode: ${entry.sourcePath}`);
				const owner = originalOwners.get(entry.sourcePath);
				const registry = owner?.role === "global" && migratingAgents.length > 0 ? {
					sourcePath: entry.sourcePath,
					agents: migratingAgents
				} : void 0;
				const pair = agentPairs.get(entry.sourcePath);
				const result = assertOpenClawMigrationWitnessPreserved(pair?.before ?? readWitness(params.original, entry, owner, registry ? {
					...registry,
					phase: "original",
					resolvePath: (value) => resolveCapturedRegistryPath(value, originalLinks, originalDirectories)
				} : void 0), pair?.after ?? readWitness(params.candidate, after, owner, registry ? {
					...registry,
					phase: "candidate",
					resolvePath: (value) => resolveCapturedRegistryPath(value, candidateLinks, candidateDirectories)
				} : void 0));
				for (const warning of result.warnings) warnings.add(`${entry.sourcePath}: ${warning}`);
				databases++;
			} else if (entry.kind === "file") {
				if (after.kind !== "file" || after.sqlite || entry.sha256 !== after.sha256 || entry.size !== after.size || entry.mode !== after.mode) throw new Error(`Preservation changed protected file bytes or mode: ${entry.sourcePath}`);
				files++;
			} else if (!isDeepStrictEqual(entry, after)) throw new Error(`Preservation changed protected resource: ${entry.sourcePath}`);
		}
		return {
			schema: "openclaw.migration-preservation.v1",
			status: warnings.size ? "preserved-with-warnings" : "preserved",
			original: params.original,
			candidate: params.candidate,
			resources: original.entries.length,
			databases,
			files,
			warnings: [...warnings],
			activationAuthorized: false
		};
	}));
}
//#endregion
export { inspectDoctorMigrationPreservation };

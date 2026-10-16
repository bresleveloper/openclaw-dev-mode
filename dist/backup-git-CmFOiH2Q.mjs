import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { a as canonicalPathFromExistingAncestor, c as isPathInside } from "./fs-safe-BUXBSN-4.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as findSqlCharacter, o as normalizeSqlWhitespace, s as quoteSqliteIdentifier } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { f as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { j as getOpenClawStateRuntimeSchema } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { l as withCommandProcessScope, o as spawnCommand } from "./exec-spawn-IxJJNQFo.mjs";
import { i as formatCommandResult, r as formatCommandOutput } from "./command-error-CFVNEvkJ.mjs";
import { d as requireGitCommandOutput, i as executeGitCommand, l as normalizeGitPathForFilesystem, t as GIT_TIMEOUT_MS, u as requireGitCommand } from "./git-exec-rH66305f.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { i as stripPluginModelCatalogCredentials } from "./plugin-model-catalog-repair-gbFum2dR.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-BuDS3zdN.mjs";
import { r as publishVerifiedSqliteFile } from "./sqlite-snapshot-c6hBDowh.mjs";
import { t as beginLifecycleWriteCustody } from "./lifecycle-write-custody-C2y9H7om.mjs";
import { o as recordBackupOutcomeBestEffort, s as resolveBackupAgentRoot, u as resolveRequiredBackupPath } from "./backup-shared-B6KMCCJW.mjs";
import { t as BACKUP_RUN_ERROR_MAX_LENGTH } from "./backup-run-records.contract.js";
import { a as buildSnapshotValidator, c as SNAPSHOT_SQLITE_FILENAME, i as assertNoSqliteSidecarsSync, n as ensurePrivateSnapshotRepositoryRoot, o as createOpenClawSnapshotCopy, r as assertFreshRestoreTarget, s as hashSnapshotArtifact } from "./local-repository-B-IjFY66.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
import { finished } from "node:stream/promises";
import { createInterface } from "node:readline";
//#region src/state/secret-state-tables.ts
/** Redaction policy surface: Git snapshots may omit these credential-bearing tables. */
const STATE_SECRET_TABLE_NAMES = [
	"audit_identity_keys",
	"apns_registrations",
	"channel_ingress_events",
	"channel_pairing_requests",
	"clawhub_promotion_claims",
	"config_revision_keys",
	"device_auth_tokens",
	"device_bootstrap_tokens",
	"device_identities",
	"device_pairing_join_codes",
	"device_pairing_paired",
	"gateway_origin_device_tokens",
	"mcp_oauth_pending_authorizations",
	"mcp_oauth_stores",
	"native_hook_relay_bridges",
	"secret_store_entries",
	"web_push_subscriptions",
	"worker_environment_credentials"
];
/** Secret-redacted Git backups must never carry machine-state values under these prefixes. */
const STATE_SECRET_CONFIG_STATE_KEY_PREFIXES = [
	"authProfiles.",
	"nodeHost.",
	"webPush.vapidKeys"
];
/** Redaction policy surface for credential-bearing per-agent database tables. */
const AGENT_SECRET_TABLE_NAMES = [
	"auth_profile_state",
	"auth_profile_store",
	"session_suggestions"
];
//#endregion
//#region src/snapshot/git-backup-codec.ts
const GIT_BACKUP_MANIFEST = "manifest.json";
const GIT_BACKUP_SCHEMA = "schema.sql";
const GIT_BACKUP_TABLES = "tables";
const SAFE_TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const GIT_BACKUP_PROJECTION_TABLES = [
	"backup_runs",
	"session_transcript_fts_rows",
	"session_transcript_index_state"
];
function requireSafeTableName(value) {
	if (!SAFE_TABLE_NAME.test(value)) throw new Error(`Git backup table name is not filesystem-safe: ${value}`);
	return value;
}
function normalizeIdentity(identity) {
	if (identity.role === "global") return identity;
	const agentId = normalizeAgentId(identity.agentId);
	if (agentId !== identity.agentId) throw new Error(`Git backup agent id must be canonical: ${identity.agentId}`);
	return {
		role: "agent",
		agentId
	};
}
function gitBackupScopePath(identity) {
	const normalized = normalizeIdentity(identity);
	return normalized.role === "global" ? "global" : path.join("agents", normalized.agentId);
}
function readSchemaEntries(database) {
	return database.prepare(`SELECT type, name, tbl_name AS tableName, sql
         FROM sqlite_master
        WHERE type IN ('table', 'index', 'trigger')
          AND name NOT LIKE 'sqlite_%'
          AND sql IS NOT NULL
        ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 ELSE 2 END, name`).all().map((row) => row);
}
function isVirtualShadow(name, virtualTables) {
	return virtualTables.some((virtualTable) => name === virtualTable || name.startsWith(`${virtualTable}_`));
}
const TABLE_BATCH_BYTES = 1048576;
function readTableColumns(database, table) {
	return database.prepare(`PRAGMA table_info(${quoteSqliteIdentifier(table)})`).all().map((row) => {
		const value = row;
		if (typeof value.name !== "string" || typeof value.pk !== "number") throw new Error(`Unable to read columns for Git backup table ${table}.`);
		return {
			name: value.name,
			pk: value.pk
		};
	});
}
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
async function serializeGitBackupTable(database, table, outputPath, rowFilter, redactCatalogCredentials = false) {
	const columns = readTableColumns(database, table);
	if (columns.length === 0) throw new Error(`Git backup table has no readable columns: ${table}`);
	const primaryKey = columns.filter((column) => column.pk > 0).toSorted((left, right) => left.pk - right.pk).map((column) => `source.${quoteSqliteIdentifier(column.name)}`);
	const orderBy = primaryKey.length > 0 ? primaryKey.join(", ") : "source.rowid";
	const projection = columns.map(({ name }) => {
		const column = quoteSqliteIdentifier(name);
		return `CASE WHEN typeof(${column}) = 'text' THEN json_quote(${column}) ELSE ${column} END AS ${column}`;
	});
	const statement = database.prepare(`SELECT ${projection.join(", ")}
       FROM ${quoteSqliteIdentifier(table)} AS source ORDER BY ${orderBy}`);
	statement.setReadBigInts(true);
	const output = outputPath ? await fs$1.open(outputPath, "wx", 384) : void 0;
	const hash = createHash("sha256");
	const pending = [];
	let pendingBytes = 0;
	let rows = 0;
	const flush = async () => {
		if (output && pending.length > 0) {
			await output.writeFile(pending.join(""));
			pending.length = 0;
			pendingBytes = 0;
		}
	};
	try {
		for (const rawRow of statement.iterate()) {
			const source = {};
			for (const [name, value] of Object.entries(rawRow)) source[name] = typeof value === "string" ? JSON.parse(value) : value;
			if (rowFilter && !rowFilter(source)) continue;
			if (redactCatalogCredentials && (source.scope === "plugin-model-catalog-v1" || source.scope === "plugin-model-catalog-migration-v1") && typeof source.value_json === "string") {
				source.value_json = stripPluginModelCatalogCredentials(source.value_json);
				if (source.value_json === null) continue;
			}
			const encoded = {};
			for (const column of columns) encoded[column.name] = encodeSqliteValue(source[column.name]);
			const line = `${JSON.stringify(encoded)}\n`;
			hash.update(line);
			rows += 1;
			if (output) {
				pending.push(line);
				pendingBytes += Buffer.byteLength(line);
				if (pendingBytes >= TABLE_BATCH_BYTES) await flush();
			}
		}
		await flush();
		return {
			rows,
			sha256: hash.digest("hex")
		};
	} finally {
		await output?.close();
	}
}
function schemaText(entries, userVersion) {
	return `${entries.map((entry) => entry.sql.trimEnd().endsWith(";") ? entry.sql : `${entry.sql};`).join("\n\n")}\n-- PRAGMA user_version = ${userVersion}\n`;
}
/** Dump one verified SQLite copy into the deterministic Git repository layout. */
async function dumpGitBackupDatabase(params) {
	const identity = normalizeIdentity(params.identity);
	const database = openNodeSqliteDatabase(params.snapshotPath, { readOnly: true });
	try {
		const entries = readSchemaEntries(database);
		const virtualTables = entries.filter((entry) => /^\s*CREATE\s+VIRTUAL\s+TABLE\b/iu.test(entry.sql)).map((entry) => entry.name);
		const redacted = params.excludeSecrets === true ? identity.role === "global" ? STATE_SECRET_TABLE_NAMES : AGENT_SECRET_TABLE_NAMES : [];
		const existingTables = new Set(entries.filter((entry) => entry.type === "table").map((entry) => entry.name));
		const excludedTables = [...redacted].filter((table) => existingTables.has(table)).toSorted();
		const excludedConfigStateKeyPrefixes = identity.role === "global" && params.excludeSecrets === true && existingTables.has("config_machine_state") ? [...STATE_SECRET_CONFIG_STATE_KEY_PREFIXES] : [];
		const excluded = /* @__PURE__ */ new Set([...excludedTables, ...GIT_BACKUP_PROJECTION_TABLES]);
		const includedSchema = entries.filter((entry) => !excluded.has(entry.name) && !excluded.has(entry.tableName));
		const dataTables = entries.filter((entry) => entry.type === "table" && !isVirtualShadow(entry.name, virtualTables) && !excluded.has(entry.name)).map((entry) => requireSafeTableName(entry.name)).toSorted();
		const userVersionRow = database.prepare("PRAGMA user_version").get();
		if (typeof userVersionRow.user_version !== "number") throw new Error("Unable to read SQLite user_version for Git backup.");
		await fs$1.rm(params.outputPath, {
			recursive: true,
			force: true
		});
		const tablesPath = path.join(params.outputPath, GIT_BACKUP_TABLES);
		await fs$1.mkdir(tablesPath, {
			recursive: true,
			mode: 448
		});
		const tables = {};
		for (const table of dataTables) {
			const rowFilter = table === "config_machine_state" && excludedConfigStateKeyPrefixes.length > 0 ? (row) => {
				const stateKey = row.state_key;
				return typeof stateKey === "string" && !excludedConfigStateKeyPrefixes.some((prefix) => stateKey.startsWith(prefix));
			} : void 0;
			tables[table] = await serializeGitBackupTable(database, table, path.join(tablesPath, `${table}.jsonl`), rowFilter, identity.role === "agent" && params.excludeSecrets === true && table === "cache_entries");
		}
		const manifest = {
			schemaVersion: 1,
			identity,
			userVersion: userVersionRow.user_version,
			excludedTables,
			excludedConfigStateKeyPrefixes,
			tables
		};
		await fs$1.writeFile(path.join(params.outputPath, GIT_BACKUP_SCHEMA), schemaText(includedSchema, manifest.userVersion), {
			encoding: "utf8",
			mode: 384
		});
		await fs$1.writeFile(path.join(params.outputPath, GIT_BACKUP_MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`, {
			encoding: "utf8",
			mode: 384
		});
		return manifest;
	} finally {
		database.close();
	}
}
function parseGitBackupManifest(value, source) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error(`Git backup manifest is invalid JSON: ${source}`, { cause: error });
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`Git backup manifest is invalid: ${source}`);
	const manifest = parsed;
	if (manifest.schemaVersion !== 1 || !manifest.identity || manifest.identity.role !== "global" && manifest.identity.role !== "agent" || !Number.isSafeInteger(manifest.userVersion) || !Array.isArray(manifest.excludedTables) || manifest.excludedConfigStateKeyPrefixes !== void 0 && (!Array.isArray(manifest.excludedConfigStateKeyPrefixes) || manifest.excludedConfigStateKeyPrefixes.some((prefix) => typeof prefix !== "string")) || !manifest.tables || typeof manifest.tables !== "object") throw new Error(`Git backup manifest has unsupported fields: ${source}`);
	const validated = {
		...manifest,
		excludedConfigStateKeyPrefixes: manifest.excludedConfigStateKeyPrefixes ?? []
	};
	normalizeIdentity(validated.identity);
	for (const [table, entry] of Object.entries(validated.tables)) {
		requireSafeTableName(table);
		if (!Number.isSafeInteger(entry.rows) || entry.rows < 0 || !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error(`Git backup manifest has an invalid table entry: ${table}`);
	}
	return validated;
}
function splitSchemaStatements(schema) {
	const statements = [];
	let start = 0;
	let cursor = 0;
	while (cursor < schema.length) {
		const end = findSqlCharacter(schema.slice(cursor), ";");
		if (end === -1) break;
		const segment = schema.slice(cursor, cursor + end + 1);
		cursor += end + 1;
		const candidate = schema.slice(start, cursor).trim();
		if (/^CREATE\s+TRIGGER\b/iu.test(candidate) && !/^END\s*;$/iu.test(normalizeSqlWhitespace(segment))) continue;
		if (candidate && !candidate.startsWith("-- PRAGMA user_version")) statements.push(candidate);
		start = cursor;
	}
	const trailing = schema.slice(start).trim();
	if (/^CREATE\s+TRIGGER\b/iu.test(trailing)) statements.push(trailing);
	return statements;
}
function unquoteSqlIdentifier(value) {
	const quote = value[0];
	if (quote === "'" || quote === "\"" || quote === "`") return value.slice(1, -1).replaceAll(quote + quote, quote);
	if (quote === "[") return value.slice(1, -1);
	return value;
}
function schemaObjectName(statement, kind) {
	const match = new RegExp(`^${kind === "virtual" ? "CREATE\\s+VIRTUAL\\s+TABLE" : "CREATE\\s+TABLE"}\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?('(?:[^']|'')*'|"(?:[^"]|"")*"|\\[[^\\]]+\\]|\`(?:[^\`]|\`\`)*\`|[^\\s(]+)`, "iu").exec(statement);
	return match?.[1] ? unquoteSqlIdentifier(match[1]) : void 0;
}
function decodeSqliteValue(value) {
	if (value === null || typeof value === "string" || typeof value === "number") return value;
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Git backup row contains an invalid encoded value.");
	const record = value;
	if (Object.keys(record).length === 1 && typeof record.$int === "string") return BigInt(record.$int);
	if (Object.keys(record).length === 1 && typeof record.$hex === "string" && /^(?:[a-f0-9]{2})*$/u.test(record.$hex)) return Buffer.from(record.$hex, "hex");
	throw new Error("Git backup row contains an invalid encoded object.");
}
function convergeRestoredSchema(database, identity) {
	database.exec(identity.role === "global" ? getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }) : OPENCLAW_AGENT_SCHEMA_SQL);
}
function validateRestoredOwner(database, databasePath, identity) {
	assertSqliteIntegrity(database, databasePath);
	buildSnapshotValidator(identity)(database, databasePath);
}
/** Load and hash one JSONL table without retaining the whole artifact. */
async function loadGitBackupTable(database, table, inputPath) {
	const columns = readTableColumns(database, table);
	const statement = database.prepare(`INSERT INTO ${quoteSqliteIdentifier(table)} (${columns.map((column) => quoteSqliteIdentifier(column.name)).join(", ")})
     VALUES (${columns.map(() => "?").join(", ")})`);
	const input = fs.createReadStream(inputPath);
	const lines = createInterface({
		input,
		crlfDelay: Infinity
	});
	const hash = createHash("sha256");
	input.on("data", (chunk) => hash.update(chunk));
	const pending = [];
	let pendingBytes = 0;
	let rows = 0;
	const flush = () => {
		if (pending.length === 0) return;
		database.exec("BEGIN IMMEDIATE;");
		try {
			for (const values of pending) statement.run(...values);
			database.exec("COMMIT;");
		} catch (error) {
			database.exec("ROLLBACK;");
			throw error;
		}
		pending.length = 0;
		pendingBytes = 0;
	};
	try {
		for await (const line of lines) {
			if (!line) continue;
			const parsed = JSON.parse(line);
			pending.push(columns.map((column) => decodeSqliteValue(parsed[column.name])));
			pendingBytes += Buffer.byteLength(line);
			rows += 1;
			if (pendingBytes >= TABLE_BATCH_BYTES) flush();
		}
		flush();
		return {
			rows,
			sha256: hash.digest("hex")
		};
	} finally {
		lines.close();
		input.destroy();
		await finished(input).catch(() => void 0);
	}
}
/** Restore one materialized Git snapshot scope into a fresh SQLite file. */
async function restoreGitBackupDirectory(params) {
	const targetPath = path.resolve(params.targetPath);
	await assertFreshRestoreTarget(targetPath);
	const manifest = parseGitBackupManifest(await fs$1.readFile(path.join(params.sourcePath, GIT_BACKUP_MANIFEST), "utf8"), params.sourcePath);
	const restoreIdentity = normalizeIdentity(params.expectedIdentity ?? manifest.identity);
	if (params.expectedIdentity && JSON.stringify(normalizeIdentity(manifest.identity)) !== JSON.stringify(restoreIdentity)) throw new Error("Git backup manifest database identity does not match the requested scope.");
	const statements = splitSchemaStatements(await fs$1.readFile(path.join(params.sourcePath, GIT_BACKUP_SCHEMA), "utf8"));
	const virtual = statements.filter((statement) => /^CREATE\s+VIRTUAL\s+TABLE\b/iu.test(statement));
	const triggers = statements.filter((statement) => /^CREATE\s+TRIGGER\b/iu.test(statement));
	const virtualNames = virtual.map((statement) => schemaObjectName(statement, "virtual")).filter((value) => Boolean(value));
	const plainTables = statements.filter((statement) => {
		if (!/^CREATE\s+TABLE\b/iu.test(statement)) return false;
		const name = schemaObjectName(statement, "table");
		return !name || !isVirtualShadow(name, virtualNames);
	});
	const indexes = statements.filter((statement) => /^CREATE\s+(?:UNIQUE\s+)?INDEX\b/iu.test(statement));
	const targetDirectory = path.dirname(targetPath);
	await fs$1.mkdir(targetDirectory, {
		recursive: true,
		mode: 448
	});
	const stagingDirectory = await createPrivateSqliteTempDirectory(targetDirectory, ".git-backup-restore-");
	applyPrivateModeSync(stagingDirectory, 448);
	const stagedPath = path.join(stagingDirectory, SNAPSHOT_SQLITE_FILENAME);
	await (await fs$1.open(stagedPath, "wx", 384)).close();
	const database = openNodeSqliteDatabase(stagedPath);
	try {
		database.exec("PRAGMA foreign_keys = OFF; PRAGMA journal_mode = DELETE;");
		for (const statement of [...plainTables, ...indexes]) database.exec(statement);
		for (const [table, expected] of Object.entries(manifest.tables)) {
			requireSafeTableName(table);
			const actual = await loadGitBackupTable(database, table, path.join(params.sourcePath, GIT_BACKUP_TABLES, `${table}.jsonl`));
			if (actual.sha256 !== expected.sha256) throw new Error(`Git backup table hash mismatch: ${table}`);
			if (actual.rows !== expected.rows) throw new Error(`Git backup table row count mismatch: ${table}`);
		}
		for (const statement of virtual) {
			if (/\bUSING\s+vec0\b/iu.test(statement)) continue;
			database.exec(statement);
		}
		for (const statement of triggers) database.exec(statement);
		for (const statement of virtual) {
			const name = schemaObjectName(statement, "virtual");
			if (name && /\bUSING\s+fts5\b/iu.test(statement) && /\bcontent\s*=/iu.test(statement)) database.prepare(`INSERT INTO ${quoteSqliteIdentifier(name)} (${quoteSqliteIdentifier(name)}) VALUES ('rebuild')`).run();
		}
		database.exec(`PRAGMA user_version = ${manifest.userVersion};`);
		convergeRestoredSchema(database, restoreIdentity);
		validateRestoredOwner(database, stagedPath, restoreIdentity);
		const tables = [];
		for (const [table, expected] of Object.entries(manifest.tables)) {
			const actual = await serializeGitBackupTable(database, table);
			tables.push({
				table,
				...actual,
				ok: actual.rows === expected.rows && actual.sha256 === expected.sha256
			});
		}
		if (tables.some((table) => !table.ok)) throw new Error(`Restored Git backup does not match its table manifest: ${stagedPath}`);
		database.close();
		applyPrivateModeSync(stagedPath, 384);
		const artifact = await hashSnapshotArtifact(stagingDirectory);
		await publishVerifiedSqliteFile({
			sourceIdentity: artifact.stat,
			sourcePath: stagedPath,
			targetPath,
			expectedContent: artifact,
			requireAtomicPublication: true,
			beforePublish: async () => await assertFreshRestoreTarget(targetPath),
			validatePublished: async (publishedPath) => {
				const published = openNodeSqliteDatabase(publishedPath, { readOnly: true });
				try {
					validateRestoredOwner(published, publishedPath, restoreIdentity);
				} finally {
					published.close();
				}
			},
			afterPublish: (guard) => {
				guard.assertTargetMatchesExpectedContent(() => assertNoSqliteSidecarsSync(targetPath, "Fresh SQLite restore path already exists"));
			}
		});
		return {
			manifest,
			targetPath,
			tables,
			excludedTables: manifest.excludedTables,
			excludedConfigStateKeyPrefixes: manifest.excludedConfigStateKeyPrefixes
		};
	} catch (error) {
		if (database.isOpen) database.close();
		throw error;
	} finally {
		await fs$1.rm(stagingDirectory, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
//#endregion
//#region src/snapshot/git-backup.ts
const GIT_BACKUP_DIAGNOSTIC_MAX_LENGTH = 500;
const GIT_BACKUP_NON_BACKUP_HISTORY_WARNING = "repository history contains non-backup commits; use a dedicated backup repository";
function redactGitBackupText(value) {
	return value.split("\n").map((line) => redactSensitiveUrlLikeString(line)).join("\n");
}
function sanitizeGitBackupDiagnostic(value) {
	return truncateUtf16Safe(redactGitBackupText(value), GIT_BACKUP_DIAGNOSTIC_MAX_LENGTH);
}
function formatGitBackupCommandResult(command, result) {
	const redacted = {
		...result,
		stderr: redactGitBackupText(result.stderr),
		stdout: redactGitBackupText(result.stdout)
	};
	const header = formatCommandResult(command, {
		...redacted,
		stderr: "",
		stdout: ""
	});
	const streams = ["stderr", "stdout"].flatMap((stream) => {
		const output = formatCommandOutput(redacted[stream]);
		return output ? [{
			stream,
			output
		}] : [];
	});
	const fixedLength = header.length + streams.reduce((total, { stream }) => total + 1 + `${stream}: `.length, 0);
	if (streams.length === 0 || fixedLength >= 1200) return truncateUtf16Safe(header, BACKUP_RUN_ERROR_MAX_LENGTH);
	const outputBudget = BACKUP_RUN_ERROR_MAX_LENGTH - fixedLength;
	const lengths = streams.map(({ output }) => output.length);
	const first = Math.min(lengths[0] ?? 0, Math.max(Math.ceil(outputBudget / 2), outputBudget - (lengths[1] ?? 0)));
	const allocations = [first, Math.min(lengths[1] ?? 0, outputBudget - first)];
	const fit = (output, maxLength) => {
		if (output.length <= maxLength) return output;
		if (maxLength <= 1) return truncateUtf16Safe("…", maxLength);
		const source = output.startsWith("…\n") ? output.slice(2) : output;
		return `…\n${sliceUtf16Safe(source, Math.max(0, source.length - (maxLength - 2)))}`;
	};
	return [header, ...streams.map(({ stream, output }, index) => `${stream}: ${fit(output, allocations[index] ?? 0)}`)].join("\n");
}
function gitBackupRepositoryPrivacyRemediation(repositoryPath, cause) {
	if (process.platform === "win32") return `${cause instanceof Error && cause.message ? ` ${sanitizeGitBackupDiagnostic(cause.message)}` : ""} Remove non-user ACL grants from ${repositoryPath} or choose a private local directory. Do not use a shared or synced folder for SQLite backups.`;
	return `Fix its ownership and run chmod 700 ${repositoryPath}.`;
}
async function assertGitRepository(repositoryPath, env) {
	const topLevel = await requireGitCommand(repositoryPath, ["rev-parse", "--show-toplevel"], { env });
	const [canonicalTopLevel, canonicalRepository] = await Promise.all([fs$1.realpath(normalizeGitPathForFilesystem(topLevel)), fs$1.realpath(repositoryPath)]);
	if (canonicalTopLevel !== canonicalRepository) throw new Error(`Backup repository must be the Git worktree root: ${repositoryPath}`);
}
/** Initialize or adopt an operator-owned Git backup repository. */
async function initializeGitBackupRepository(params) {
	const repositoryPath = path.resolve(params.repositoryPath);
	const stateDir = path.resolve(params.stateDir);
	const [canonicalRepositoryPath, canonicalStateDir] = await Promise.all([canonicalPathFromExistingAncestor(repositoryPath), canonicalPathFromExistingAncestor(stateDir)]);
	if (isPathInside(canonicalStateDir, canonicalRepositoryPath) || isPathInside(canonicalRepositoryPath, canonicalStateDir)) throw new Error(`Git backup repository must be outside the OpenClaw state directory: ${stateDir}`);
	try {
		await ensurePrivateSnapshotRepositoryRoot(repositoryPath);
	} catch (error) {
		throw new Error(`Git backup repository must be owned by the current user and not writable by other users: ${repositoryPath}. ${gitBackupRepositoryPrivacyRemediation(repositoryPath, error)}`, { cause: error });
	}
	if ((await executeGitCommand(repositoryPath, ["rev-parse", "--show-toplevel"], { env: params.gitEnv })).code !== 0) await requireGitCommand(repositoryPath, ["init"], { env: params.gitEnv });
	await assertGitRepository(repositoryPath, params.gitEnv);
	const remote = params.remote?.trim();
	if (remote) {
		const existing = await executeGitCommand(repositoryPath, [
			"remote",
			"get-url",
			"origin"
		], { env: params.gitEnv });
		if (existing.code === 0 && existing.stdout.trim() !== remote) throw new Error(`Git backup repository already has a different origin: ${sanitizeGitBackupDiagnostic(existing.stdout.trim())}`);
		if (existing.code !== 0) await requireGitCommand(repositoryPath, [
			"remote",
			"add",
			"origin",
			remote
		], { env: params.gitEnv });
	}
	return { repositoryPath };
}
async function isBackupOwnedScope(scopePath) {
	const identity = await fs$1.lstat(scopePath).catch((error) => error.code === "ENOENT" ? void 0 : null);
	if (identity === void 0) return true;
	if (!identity?.isDirectory()) return false;
	try {
		if ((await fs$1.readdir(scopePath)).length === 0) return true;
		parseGitBackupManifest(await fs$1.readFile(path.join(scopePath, GIT_BACKUP_MANIFEST), "utf8"), scopePath);
		return true;
	} catch {
		return false;
	}
}
async function assertBackupOwnedScope(scopePath) {
	if (!await isBackupOwnedScope(scopePath)) throw new Error(`Refusing to replace non-backup-owned path ${scopePath}; the repository must be dedicated to OpenClaw backups.`);
}
async function removeStaleAgentScopes(repositoryPath, retainedScopes) {
	const agentsPath = path.join(repositoryPath, "agents");
	let entries;
	try {
		entries = await fs$1.readdir(agentsPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const scopes = entries.map((entry) => path.join(agentsPath, entry));
	await Promise.all(scopes.map(async (scope) => await assertBackupOwnedScope(scope)));
	await Promise.all(scopes.filter((scope) => !retainedScopes.has(path.relative(repositoryPath, scope))).map(async (scope) => await fs$1.rm(scope, { recursive: true })));
}
async function copyStagedScope(stagingRoot, repositoryPath, identity) {
	const relative = gitBackupScopePath(identity);
	const source = path.join(stagingRoot, relative);
	const target = path.join(repositoryPath, relative);
	await assertBackupOwnedScope(target);
	await fs$1.rm(target, {
		recursive: true,
		force: true
	});
	await fs$1.mkdir(path.dirname(target), {
		recursive: true,
		mode: 448
	});
	await fs$1.cp(source, target, {
		recursive: true,
		force: false
	});
}
async function commitGitBackup(params) {
	const email = await executeGitCommand(params.repositoryPath, [
		"config",
		"--get",
		"user.email"
	], { env: params.env });
	const identityArgs = email.code === 0 && email.stdout.trim() ? [] : [
		"-c",
		"user.name=OpenClaw",
		"-c",
		"user.email=backup@openclaw.local"
	];
	await requireGitCommand(params.repositoryPath, [
		...identityArgs,
		"commit",
		"-m",
		params.message,
		"--",
		...params.scopes
	], { env: params.env });
	return await requireGitCommand(params.repositoryPath, ["rev-parse", "HEAD"], { env: params.env });
}
/** Snapshot selected databases, update the deterministic tree, and commit one Git revision. */
async function createGitBackup(params) {
	for (const database of params.databases) assertNotUpdateCapturePath(database.path, params.stateDir);
	const repositoryPath = path.resolve(params.repositoryPath);
	await initializeGitBackupRepository({
		repositoryPath,
		stateDir: params.stateDir,
		gitEnv: params.gitEnv
	});
	const staging = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-git-backup-"
	});
	const manifests = [];
	const warnings = [];
	try {
		for (const [index, database] of params.databases.entries()) {
			const outputPath = path.join(staging.dir, gitBackupScopePath(database.identity));
			await fs$1.mkdir(path.dirname(outputPath), {
				recursive: true,
				mode: 448
			});
			const copyPath = staging.path(`${database.identity.role}-${index}.sqlite`);
			try {
				await createOpenClawSnapshotCopy({
					database: {
						...database,
						path: await fs$1.realpath(database.path)
					},
					targetPath: copyPath
				});
			} catch (error) {
				if (!params.all || database.identity.role !== "agent") throw error;
				warnings.push(`Agent ${database.identity.agentId} degraded; keeping previous backup scope if present: ${sanitizeGitBackupDiagnostic(formatErrorMessage(error))}`);
				continue;
			}
			manifests.push(await dumpGitBackupDatabase({
				snapshotPath: copyPath,
				outputPath,
				identity: database.identity,
				excludeSecrets: params.excludeSecrets
			}));
			await fs$1.rm(copyPath, { force: true });
		}
		if (manifests.length === 0) throw new Error("No Git backup databases were found for the selected scope.");
		if (params.all) await removeStaleAgentScopes(repositoryPath, new Set(params.databases.map(({ identity }) => gitBackupScopePath(identity))));
		for (const { identity } of manifests) await copyStagedScope(staging.dir, repositoryPath, identity);
	} finally {
		await staging.cleanup().catch(() => void 0);
	}
	await Promise.all(["global", "agents"].map(async (scope) => fs$1.mkdir(path.join(repositoryPath, scope), {
		recursive: true,
		mode: 448
	})));
	await requireGitCommand(repositoryPath, [
		"add",
		"-A",
		"--",
		"global",
		"agents"
	], { env: params.gitEnv });
	const changed = await requireGitCommand(repositoryPath, [
		"status",
		"--porcelain",
		"--",
		"global",
		"agents"
	], { env: params.gitEnv });
	let commit;
	if (changed) {
		const now = params.now ?? /* @__PURE__ */ new Date();
		if (!Number.isFinite(now.getTime())) throw new Error("Git backup timestamp is invalid.");
		const stagedBackupPaths = await requireGitCommand(repositoryPath, [
			"diff",
			"--cached",
			"--name-only",
			"--",
			"global",
			"agents"
		], { env: params.gitEnv });
		const commitScopes = ["global", "agents"].filter((scope) => stagedBackupPaths.split("\n").some((entry) => entry.startsWith(`${scope}/`)));
		commit = await commitGitBackup({
			repositoryPath,
			message: `openclaw backup ${now.toISOString()}`,
			scopes: commitScopes,
			env: params.gitEnv
		});
	}
	let pushed = false;
	let pushWarning;
	if (params.push) {
		if (await requireGitCommand(repositoryPath, [
			"rev-list",
			"HEAD",
			"--invert-grep",
			"--grep=^openclaw backup ",
			"--count"
		], { env: params.gitEnv }) !== "0") pushWarning = GIT_BACKUP_NON_BACKUP_HISTORY_WARNING;
		else {
			const pushedResult = await executeGitCommand(repositoryPath, [
				"push",
				"-u",
				"origin",
				"HEAD"
			], { env: params.gitEnv });
			if (pushedResult.code === 0) pushed = true;
			else pushWarning = formatGitBackupCommandResult("git push", pushedResult);
		}
	}
	return {
		repositoryPath,
		...commit ? { commit } : {},
		noChanges: !changed,
		pushed,
		...pushWarning ? { pushWarning } : {},
		manifests,
		warnings
	};
}
async function resolveGitCommit(repositoryPath, ref) {
	return await requireGitCommand(repositoryPath, [
		"rev-parse",
		"--verify",
		`${ref?.trim() || "HEAD"}^{commit}`
	]);
}
/** Materialize one database scope from a Git ref into a private temporary directory. */
async function materializeGitBackupRef(params) {
	const repositoryPath = path.resolve(params.repositoryPath);
	await assertGitRepository(repositoryPath);
	const commit = await resolveGitCommit(repositoryPath, params.ref);
	const scope = gitBackupScopePath(params.identity).split(path.sep).join("/");
	const files = (await requireGitCommand(repositoryPath, [
		"ls-tree",
		"-r",
		"--name-only",
		commit,
		"--",
		scope
	])).split("\n").filter(Boolean);
	if ([.../* @__PURE__ */ new Set([`${scope}/manifest.json`, `${scope}/schema.sql`])].some((entry) => !files.includes(entry))) throw new Error(`Git backup ref ${commit} does not contain ${scope}.`);
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-git-restore-"
	});
	const outputPath = path.join(workspace.dir, scope);
	try {
		for (const file of files) {
			if (file !== `${scope}/manifest.json` && file !== `${scope}/schema.sql` && !file.startsWith(`${scope}/tables/`)) throw new Error(`Git backup ref contains an unexpected file: ${file}`);
			const relative = file.slice(scope.length + 1);
			const destination = path.join(outputPath, relative);
			await fs$1.mkdir(path.dirname(destination), {
				recursive: true,
				mode: 448
			});
			await fs$1.writeFile(destination, "", {
				flag: "wx",
				mode: 384
			});
			await spawnCommand([
				"git",
				"-C",
				repositoryPath,
				"show",
				`${commit}:${file}`
			], {
				stdin: "ignore",
				stdout: { file: destination },
				buffer: { stdout: false },
				maxBuffer: { stderr: 1048576 },
				timeout: GIT_TIMEOUT_MS
			});
		}
		return {
			commit,
			path: outputPath,
			[Symbol.asyncDispose]: workspace[Symbol.asyncDispose]
		};
	} catch (error) {
		await workspace.cleanup().catch(() => void 0);
		throw error;
	}
}
/** Restore one database from a Git ref to a caller-selected fresh path. */
async function restoreGitBackupRef(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const materialized = _usingCtx$1.a(await materializeGitBackupRef(params));
		return {
			...await restoreGitBackupDirectory({
				sourcePath: materialized.path,
				targetPath: params.targetPath,
				expectedIdentity: params.identity
			}),
			commit: materialized.commit
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Verify a Git snapshot by restoring it privately and comparing every table digest. */
async function verifyGitBackupRef(params) {
	const scratch = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-git-verify-"
	});
	try {
		return await restoreGitBackupRef({
			...params,
			targetPath: scratch.path("database.sqlite")
		});
	} finally {
		await scratch.cleanup().catch(() => void 0);
	}
}
/** Return bounded Git backup log entries for CLI rendering. */
async function readGitBackupLog(params) {
	await assertGitRepository(params.repositoryPath);
	const symbolicHead = await executeGitCommand(params.repositoryPath, [
		"symbolic-ref",
		"--quiet",
		"HEAD"
	]);
	if (symbolicHead.code === 0) {
		const headRef = symbolicHead.stdout.trim();
		const headExists = await executeGitCommand(params.repositoryPath, [
			"show-ref",
			"--verify",
			"--quiet",
			headRef
		]);
		if (headExists.code === 1 && headRef.startsWith("refs/heads/")) return [];
		if (headExists.code !== 0) throw new Error(formatGitBackupCommandResult("git show-ref HEAD", headExists));
	} else if (symbolicHead.code !== 1) throw new Error(formatGitBackupCommandResult("git symbolic-ref HEAD", symbolicHead));
	const result = await executeGitCommand(params.repositoryPath, [
		"log",
		`--max-count=${params.limit}`,
		"--pretty=format:%H%x09%cI%x09%s"
	]);
	return requireGitCommandOutput("git log", result, (command, failure) => new Error(formatGitBackupCommandResult(command, failure))).split("\n").filter(Boolean).map((line) => {
		const [commit = "", date = "", ...message] = line.split("	");
		return {
			commit,
			date,
			message: message.join("	")
		};
	});
}
//#endregion
//#region src/commands/backup-git.ts
const GIT_BACKUP_PUSH_CREDENTIAL_WARNING = "Warning: pushed backup history contains credential material; keep the Git remote private.";
async function resolveCreateDatabases(options) {
	const normalizedAgents = [...new Set((options.agents ?? []).map((agent) => {
		const trimmed = agent.trim();
		if (!trimmed) throw new Error("--agent must not be blank");
		return normalizeAgentId(trimmed);
	}))];
	const explicit = options.global === true || normalizedAgents.length > 0;
	if (options.all && explicit) throw new Error("Use --all by itself, or select --global and --agent scopes explicitly.");
	if (!options.all && !explicit) throw new Error("Choose at least one Git backup scope: --all, --global, or --agent <id>.");
	let agents = [];
	if (options.all || normalizedAgents.length > 0) {
		const config = getRuntimeConfig({ skipPluginValidation: true });
		const agentIds = options.all ? listAgentIds(config).toSorted() : normalizedAgents.map((agent) => resolveConfiguredAgentId(config, agent));
		agents = await Promise.all(agentIds.map((agentId) => resolveBackupAgentRoot(config, agentId)));
	}
	const databases = [];
	if (options.all || options.global) {
		const selectedPath = resolveOpenClawStateSqlitePath();
		assertNotUpdateCapturePath(selectedPath, resolveStateDir());
		databases.push({
			path: selectedPath,
			identity: { role: "global" }
		});
	}
	for (const { agentId, databasePath } of agents) {
		assertNotUpdateCapturePath(databasePath, resolveStateDir());
		databases.push({
			path: databasePath,
			identity: {
				role: "agent",
				agentId
			}
		});
	}
	return databases;
}
function resolveOneIdentity(options) {
	const agent = options.agent?.trim();
	if (options.global === true && agent) throw new Error("Choose exactly one Git backup scope: --global or --agent <id>.");
	if (options.global !== true && !agent) throw new Error("Choose a Git backup scope: --global or --agent <id>.");
	return options.global === true ? { role: "global" } : {
		role: "agent",
		agentId: normalizeAgentId(agent)
	};
}
async function backupGitInitCommand(runtime, options) {
	const result = await initializeGitBackupRepository({
		repositoryPath: resolveRequiredBackupPath(options.repository, "--repository"),
		stateDir: resolveStateDir(),
		remote: options.remote
	});
	if (options.json) writeRuntimeJson(runtime, result);
	else runtime.log(`Git backup repository ready: ${shortenHomePath(result.repositoryPath)}`);
	return result;
}
async function backupGitCreateCommand(runtime, options) {
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	if (options.push && !options.excludeSecrets) runtime.error(GIT_BACKUP_PUSH_CREDENTIAL_WARNING);
	const releaseCustody = beginLifecycleWriteCustody("backup");
	let failure;
	try {
		const result = await withCommandProcessScope(async () => createGitBackup({
			repositoryPath,
			stateDir: resolveStateDir(),
			databases: await resolveCreateDatabases(options),
			all: options.all,
			excludeSecrets: options.excludeSecrets,
			push: options.push
		}));
		await recordBackupOutcomeBestEffort(runtime, {
			kind: "git",
			archivePath: repositoryPath,
			status: "ok",
			target: result.commit,
			error: [...result.warnings, ...result.pushWarning ? [result.pushWarning] : []].join("\n") || void 0,
			...result.pushWarning ? { pushFailed: true } : {}
		});
		if (options.json) writeRuntimeJson(runtime, result);
		else if (result.noChanges) runtime.log(`Git backup: no changes (${shortenHomePath(repositoryPath)})`);
		else runtime.log(`Git backup committed: ${result.commit}`);
		if (result.pushWarning) runtime.error(`Warning: Git backup committed, but push failed: ${result.pushWarning}`);
		for (const warning of result.warnings) runtime.error(`Warning: ${warning}`);
		return result;
	} catch (error) {
		failure = error;
		await recordBackupOutcomeBestEffort(runtime, {
			kind: "git",
			archivePath: repositoryPath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	} finally {
		releaseCustody(failure);
	}
}
async function backupGitLogCommand(runtime, options) {
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	const limit = options.limit ?? 20;
	if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("--limit must be a positive integer.");
	const entries = await readGitBackupLog({
		repositoryPath,
		limit
	});
	if (options.json) writeRuntimeJson(runtime, {
		repositoryPath,
		entries
	});
	else if (entries.length === 0) runtime.log(`No Git backup commits in ${shortenHomePath(repositoryPath)}.`);
	else runtime.log(entries.map((entry) => `${entry.commit}\t${entry.date}\t${entry.message}`).join("\n"));
	return entries;
}
async function backupGitVerifyCommand(runtime, options) {
	const result = await verifyGitBackupRef({
		repositoryPath: resolveRequiredBackupPath(options.repository, "--repository"),
		identity: resolveOneIdentity(options),
		ref: options.ref
	});
	if (options.json) writeRuntimeJson(runtime, result);
	else {
		for (const table of result.tables) runtime.log(`${table.ok ? "ok" : "failed"}\t${table.table}\t${table.rows}\t${table.sha256}`);
		runtime.log(`Git backup verified: ${result.commit}`);
	}
	return result;
}
async function backupGitRestoreCommand(runtime, options) {
	const result = await restoreGitBackupRef({
		repositoryPath: resolveRequiredBackupPath(options.repository, "--repository"),
		identity: resolveOneIdentity(options),
		ref: options.ref,
		targetPath: resolveRequiredBackupPath(options.target, "--target")
	});
	if (options.json) writeRuntimeJson(runtime, result);
	else {
		runtime.log(`Git backup restored: ${shortenHomePath(result.targetPath)} (${result.commit})`);
		if (result.excludedTables.length > 0) runtime.error(`Warning: this redacted backup omits tables: ${result.excludedTables.join(", ")}`);
		if (result.excludedConfigStateKeyPrefixes.length > 0) runtime.error(`Warning: this redacted backup omits machine-state values under: ${result.excludedConfigStateKeyPrefixes.join(", ")}`);
	}
	return result;
}
//#endregion
export { backupGitRestoreCommand as a, backupGitLogCommand as i, backupGitCreateCommand as n, backupGitVerifyCommand as o, backupGitInitCommand as r, GIT_BACKUP_PUSH_CREDENTIAL_WARNING as t };

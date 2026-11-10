import { s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { M as resolveDatabasePath, P as resolveOpenClawRegisteredAgentDatabasePath } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { At as normalizeDatabasePath, B as stageSqliteTransactionState, Ft as resolveDatabasePathKey, J as throwSqliteLifecycleErrors, K as createSqliteLifecycleAggregateError, Pt as readDatabasePathIdentitySync, c as getSqliteDatabaseAdmission, kt as inspectDatabasePathIdentitySync, l as getSqliteDatabaseAdmissionIdentityForPath, s as getOrLoadSqliteDatabaseAdmissionForPath, v as publishSqliteDatabaseAdmission } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { J as getAgentDeletionDatabaseCleanup, ct as resolveAgentCreationClaimAgentId } from "./openclaw-state-read-sqlite-snapshot-staging-owner-DeVv_bRV.mjs";
import "./openclaw-state-read-worker-task-pool-CsV_Xz7_.mjs";
import { a as isPathInside } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { Y as resolveSqliteDatabaseFilePaths } from "./openclaw-state-read-openclaw-state-db-cache-CpHXuPkl.mjs";
import { t as formatErrorMessage } from "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { v as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-read-gateway-state-owner-Bj-SghTS.mjs";
import { m as getAdmittedSqliteSchemaFacts, n as isSqliteCorruptionError } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import { a as tableExists, m as requireNativeDatabaseFile } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { n as normalizeAgentId } from "./openclaw-state-read-agent-id-BoCs9aqI.mjs";
import { r as runSqliteDeferredTransactionSync } from "./openclaw-state-read-sqlite-transaction-gPY-7Ojc.mjs";
import { f as detectOpenClawStateDatabaseSchemaMigrationsFromDatabase, l as STATE_SCHEMA_MIGRATION_READ_TABLES, u as assertCanonicalAgentDatabasesPrimaryKey } from "./openclaw-state-read.worker.js";
import { R as normalizeAgentDirRegistryPath, S as withExistingOpenClawStateDatabaseReadOnly, a as hasPreJournalStateSchema, f as assertAgentDeletionJournalAvailable, v as executeExistingOpenClawStateRead, x as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync } from "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
import "./openclaw-state-read-session-key-CJdIm256.mjs";
import { t as sessionChanges } from "./openclaw-state-read-session-row-changes-CwGi6K3q.mjs";
import "./openclaw-state-read-sqlite-worker-store-BDES2IEB.mjs";
import { n as createStateDomainPublication } from "./openclaw-state-read-state-domain-publication-DnqJOUHl.mjs";
import "./openclaw-state-read-agent-provenance-publication-CU3W2jjf.mjs";
import { t as readLegacyMigrationReceiptFromDatabase } from "./openclaw-state-read-state-migrations.receipts-WcT5myxH.mjs";
import { lstatSync, statSync } from "node:fs";
import path from "node:path";
import "node:worker_threads";
import { randomUUID } from "node:crypto";
import "node:async_hooks";
//#region src/state/openclaw-agent-db-contract.ts
const SESSION_PARTICIPANTS_TABLE = "session_participants";
//#endregion
//#region src/state/openclaw-agent-db-identity.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Prepare physical and connection identity once at open; cached aliases are not resolved again. */
function registerOpenClawAgentDatabaseIdentity(db, ownerDatabasePath) {
	const filename = normalizeDatabasePath(db.location() ?? "");
	const admitted = filename ? getSqliteDatabaseAdmissionIdentityForPath(filename) : void 0;
	const file = admitted ? {
		...admitted,
		canonicalPath: resolveDatabasePathKey(filename)
	} : filename ? readDatabasePathIdentitySync(filename) : void 0;
	if (!file || !file.key.startsWith("file:")) throw new Error("OpenClaw agent database requires a physical file for identity registration");
	const identity = file.key.slice(5);
	identities.set(db, {
		identity,
		birthtime: file.birthtime,
		incarnation: randomUUID(),
		filename,
		canonicalPath: file.canonicalPath,
		ownerDatabasePath: ownerDatabasePath ? resolveDatabasePathKey(ownerDatabasePath) : void 0
	});
}
/** Reuse facts captured at open; aliases must never be resolved again at a handoff. */
function readOpenClawAgentDatabaseIdentity(database) {
	const prepared = findOpenClawAgentDatabaseIdentity(database);
	if (prepared === void 0) throw new Error("OpenClaw agent database identity was not prepared at open");
	return prepared;
}
/** Raw diagnostic connections have no admitted physical identity. */
function findOpenClawAgentDatabaseIdentity(database) {
	return identities.get(database.db);
}
/** A retained connection can outlive its pathname or be deserialized away from that file. */
function isOpenClawAgentDatabasePathCurrent(database) {
	if (!database.db.isOpen) return false;
	const { identity, filename } = readOpenClawAgentDatabaseIdentity(database);
	if (normalizeDatabasePath(database.db.location() ?? "") !== filename) return false;
	const current = statSync(database.path, {
		bigint: true,
		throwIfNoEntry: false
	});
	return current !== void 0 && identity === `${current.dev}:${current.ino}`;
}
function assertOpenClawAgentDatabaseIdentity(database, expected) {
	const identity = readOpenClawAgentDatabaseIdentity(database);
	if (`file:${identity.identity}` !== expected.key || expected.birthtime !== void 0 && identity.birthtime !== expected.birthtime || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Agent database changed during repair admission");
}
function createOpenClawAgentDatabaseClaim(database, release) {
	let released = false;
	const isCurrent = () => !released && database.db.isOpen;
	const { identity, incarnation } = readOpenClawAgentDatabaseIdentity(database);
	return {
		identity,
		incarnation,
		isCurrent,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("OpenClaw agent database claim is no longer current");
		},
		release: () => {
			if (!released) {
				released = true;
				release();
			}
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-db-registry.read.ts
const readableSchemas = /* @__PURE__ */ new WeakSet();
/** Read durable registrations from an already opened live or captured database. */
function readOpenClawAgentDatabaseRegistryRows(database, pathname) {
	const db = getNodeSqliteKysely(database);
	const schema = getAdmittedSqliteSchemaFacts(database);
	const registryTable = isPostgresSqlConnection(database) ? tableExists(database, "agent_databases") ? { type: "table" } : void 0 : schema ? schema.tables.has("agent_databases") ? { type: "table" } : schema.views.has("agent_databases") || schema.indexes.has("agent_databases") || schema.triggers.has("agent_databases") ? { type: "invalid" } : void 0 : executeSqliteQueryTakeFirstSync(database, db.selectFrom("sqlite_master").select("type").where("name", "=", "agent_databases"));
	if (!registryTable) return [];
	if (registryTable.type !== "table") throw new Error(`OpenClaw state database ${pathname} has an invalid agent registry.`);
	return executeSqliteQuerySync(database, db.selectFrom("agent_databases").selectAll().orderBy("agent_id", "asc").orderBy("path", "asc")).rows;
}
function readAgentDatabasePreflightTargets(database, registryPath) {
	return readOpenClawAgentDatabaseRegistryRows(database, registryPath).flatMap((row) => typeof row.agent_id === "string" && typeof row.path === "string" ? [{
		agentId: row.agent_id,
		path: resolveOpenClawRegisteredAgentDatabasePath(registryPath, row.path)
	}] : []);
}
function readRegisteredAgentDatabaseRows(database, pathname, artifactPreserving) {
	if (isPostgresSqlConnection(database)) {
		if (artifactPreserving) requireNativeDatabaseFile("postgres", "file-snapshot");
	} else if (artifactPreserving) assertCanonicalAgentDatabasesPrimaryKey(database, pathname);
	else {
		const schema = getAdmittedSqliteSchemaFacts(database);
		if (!schema || !readableSchemas.has(schema)) {
			if (detectOpenClawStateDatabaseSchemaMigrationsFromDatabase(database, pathname).some(({ kind }) => STATE_SCHEMA_MIGRATION_READ_TABLES[kind].includes("agent_databases"))) throw new Error(`OpenClaw state database ${pathname} has a legacy agent database registry schema; run openclaw doctor --fix to migrate it.`);
			if (schema) readableSchemas.add(schema);
		}
	}
	return readOpenClawAgentDatabaseRegistryRows(database, pathname).map((row) => ({
		agentId: normalizeAgentId(row.agent_id),
		path: resolveOpenClawRegisteredAgentDatabasePath(pathname, row.path),
		schemaVersion: row.schema_version,
		lastSeenAt: row.last_seen_at,
		sizeBytes: row.size_bytes
	}));
}
//#endregion
//#region src/state/openclaw-agent-db-registry-listing.ts
function registeredPathKey(source) {
	return {
		name: `agent.registry:${JSON.stringify([
			source.agentId,
			path.resolve(source.path),
			source.identity,
			source.schemaVersion ?? 27
		])}`,
		read: (value) => typeof value === "boolean" ? value : void 0
	};
}
/** Physical schema admission does not register a newly used lexical alias. */
function hasRegisteredOpenClawAgentDatabasePath(database, options) {
	const { identity } = readOpenClawAgentDatabaseIdentity(database);
	return typeof identity === "string" && getOrLoadSqliteDatabaseAdmissionForPath(resolveDatabasePath(options), registeredPathKey({
		...database,
		identity: `file:${identity}`
	}), () => void 0) === true;
}
const registry = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseRegistryMemo"), () => ({
	pending: /* @__PURE__ */ new Map(),
	publications: /* @__PURE__ */ new WeakSet()
}));
/** Registry facts retain their owner through deferred COMMIT publication. */
function emitOpenClawAgentDatabaseRegistryChange(agentId, database) {
	const change = {
		all: true,
		scope: {
			agentId,
			topology: true
		}
	};
	registry.publications.add(change);
	sessionChanges.emit(change, database);
}
function activateRegisteredAgentDatabasesMemo(options) {
	const pathname = resolveDatabasePath(options);
	if (registry.memo?.pathname !== pathname) registry.memo = {
		pathname,
		token: Symbol(pathname)
	};
	return registry.memo;
}
function invalidateRegisteredAgentDatabasesMemo(options) {
	return advanceRegisteredAgentDatabasesMemo(resolveDatabasePath(options));
}
function advanceRegisteredAgentDatabasesMemo(pathname, transition) {
	if (transition?.phase === "begin") registry.pending.set(transition.operation, {
		...transition,
		pathname
	});
	else if (transition?.phase === "finish") registry.pending.delete(transition.operation);
	const previous = registry.memo;
	if (previous?.pathname !== pathname) return;
	const memo = {
		pathname,
		token: Symbol(pathname)
	};
	previous.next = {
		memo,
		transition
	};
	registry.memo = memo;
	return {
		previous: previous.token,
		current: memo.token
	};
}
function captureRegistryMutation(kind, sources) {
	try {
		const captured = [];
		for (const source of sources) {
			const identity = inspectDatabasePathIdentitySync(source.path);
			if (!identity) return;
			captured.push({
				agentId: source.agentId,
				path: path.resolve(source.path),
				physicalPath: identity.canonicalPath,
				identity: identity.key,
				schemaVersion: source.schemaVersion ?? 27
			});
		}
		return {
			kind,
			sources: captured
		};
	} catch {
		return;
	}
}
/** Stage exact registry facts at the same native transaction boundary as their rows. */
function recordOpenClawAgentDatabaseRegistryMutation(database, kind, sources) {
	const operation = Symbol("agent-registry-mutation");
	const mutation = captureRegistryMutation(kind, sources);
	for (const source of mutation?.sources ?? []) publishSqliteDatabaseAdmission(database.db, registeredPathKey(source), kind === "upsert");
	const advance = (phase) => advanceRegisteredAgentDatabasesMemo(database.path, {
		operation,
		mutation,
		phase
	});
	if (!stageSqliteTransactionState(database.db, {
		stage: () => advance("begin"),
		commit: () => {
			advance("commit");
			advance("finish");
		},
		rollback: () => advance("finish")
	})) throw new Error("Registry mutation requires its canonical transaction publication scope");
}
async function settleAgentRegistration(registration, operation) {
	let result;
	try {
		result = {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		registration.finish(await registration.nativeSettlement);
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Agent open and registration publication failed", result.error);
		throw error;
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** Fence native registry settlement under its original shared generation. */
function captureOpenClawAgentDatabaseRegistration(params) {
	const options = { path: params.admission.databasePath };
	const operation = Symbol("agent-registry-registration");
	const mutation = captureRegistryMutation(params.kind ?? "upsert", [{
		agentId: params.agentId,
		path: params.agentPath
	}]);
	const advance = (phase) => {
		const change = advanceRegisteredAgentDatabasesMemo(options.path, {
			operation,
			mutation,
			phase
		});
		if (change) params.onRegistryChange?.(change);
	};
	let active = false;
	let committed = false;
	let finished = false;
	const publishChange = () => {
		try {
			(params.assertPublicationCurrent ?? params.admission.assertCurrent)();
		} catch (error) {
			if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
			throw error;
		}
		emitOpenClawAgentDatabaseRegistryChange(params.agentId);
	};
	return {
		begin() {
			if (finished) throw new Error("Agent database registration admission is closed");
			if (!active) {
				active = true;
				advance("begin");
			}
		},
		recordCommitted(receipt) {
			if (finished || !active || receipt.agentId !== params.agentId || receipt.agentPath !== params.agentPath || receipt.stateDatabasePath !== params.admission.databasePath || receipt.stateDatabaseIdentity !== params.admission.identity.key) throw new Error("Agent registration commit differs from its captured owner");
			committed = true;
			try {
				params.admission.assertCurrent();
			} catch (error) {
				invalidateRegisteredAgentDatabasesMemo(options);
				if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
				throw error;
			}
			advance("commit");
		},
		finish(settlement) {
			if (finished) return;
			finished = true;
			const uncertain = active && !committed && settlement?.kind === "unknown";
			const failures = [];
			try {
				try {
					if (uncertain) {
						const change = invalidateRegisteredAgentDatabasesMemo(options);
						if (change) params.onRegistryChange?.(change);
					}
					params.admission.assertCurrent();
				} catch (error) {
					if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
					throw error;
				} finally {
					registry.pending.delete(operation);
				}
				if (active && !uncertain) advance("finish");
			} catch (error) {
				failures.push(error);
			} finally {
				if (committed || uncertain) try {
					publishChange();
				} catch (error) {
					failures.push(error);
				}
				throwSqliteLifecycleErrors(failures, "Agent registration settlement failed");
			}
		}
	};
}
function cloneRegisteredAgentDatabases(entries, options) {
	const cloned = entries.map((entry) => ({ ...entry }));
	return options.includeIncompatibleSchemaVersions ? cloned : cloned.filter((entry) => entry.schemaVersion === 27);
}
function hasUnavailableMissingSqlitePath(pathname) {
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) try {
		lstatSync(candidate);
		return true;
	} catch (error) {
		if (error.code !== "ENOENT") return true;
	}
	let ancestor = path.dirname(pathname);
	while (true) {
		try {
			const stat = lstatSync(ancestor);
			if (!stat.isSymbolicLink()) return !stat.isDirectory();
			try {
				return !statSync(ancestor).isDirectory();
			} catch {
				return true;
			}
		} catch (error) {
			if (error.code !== "ENOENT") return true;
		}
		const parent = path.dirname(ancestor);
		if (parent === ancestor) return false;
		ancestor = parent;
	}
}
function readRegisteredAgentDatabases(options, artifactPreserving) {
	const pathname = resolveDatabasePath(options);
	const read = ({ db }) => readRegisteredAgentDatabaseRows(db, pathname, artifactPreserving);
	const finish = (entries) => {
		if (entries === void 0) {
			if (hasUnavailableMissingSqlitePath(pathname)) throw new Error(`OpenClaw state database ${pathname} is unavailable.`);
			return [];
		}
		return options.includeIncompatibleSchemaVersions ? entries : entries.filter((entry) => entry.schemaVersion === 27);
	};
	return artifactPreserving ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(read, options).then(finish) : finish(withExistingOpenClawStateDatabaseReadOnly(read, options));
}
function listOpenClawRegisteredAgentDatabases(options = {}) {
	const memo = activateRegisteredAgentDatabasesMemo(options);
	return cloneRegisteredAgentDatabases(memo.entries ??= readRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	}, false), options);
}
//#endregion
//#region src/claws/provenance-secondary-references.ts
const CLAW_SECONDARY_REFERENCE_TABLES = [
	"claw_package_refs",
	"claw_mcp_server_refs",
	"claw_cron_refs"
];
function readClawSecondaryReferenceTables(db, agentId) {
	return CLAW_SECONDARY_REFERENCE_TABLES.filter((table) => {
		if (!tableExists(db, table)) return false;
		return Boolean(db.prepare(`SELECT 1 FROM ${table} WHERE agent_id = ? LIMIT 1`).get(agentId));
	});
}
//#endregion
//#region src/state/agent-deletion-journal-authority.worker.ts
function hasClawDeletionOwnership(database, agentId) {
	const db = getNodeSqliteKysely(database.db);
	return ["claw_installs", "claw_workspace_files"].some((table) => tableExists(database.db, table) && executeSqliteQueryTakeFirstSync(database.db, db.selectFrom(table).select("agent_id").where("agent_id", "=", agentId).limit(1)) !== void 0) || readClawSecondaryReferenceTables(database.db, agentId).length > 0;
}
createStateDomainPublication({
	domain: "agent-deletion-journal",
	keyOf: (row) => row.agentId,
	isValue: (value) => isRecord(value) && typeof value.agentId === "string" && typeof value.operationId === "string" && typeof value.cleanupCompleted === "boolean"
});
const RESERVED_SYSTEM_AGENT_IDS = new Set([{
	id: "openclaw",
	kind: "system"
}, {
	id: "crestodian",
	kind: "system"
}].map((entry) => normalizeAgentId(entry.id)));
function isReservedSystemAgentId(agentId) {
	return RESERVED_SYSTEM_AGENT_IDS.has(normalizeAgentId(agentId));
}
//#endregion
//#region src/state/agent-deletion-journal-recovery.kernel.ts
const AGENT_DELETION_RECOVERY_SOURCE_KEY = "agent-deletion-journal-reconstruction";
function parseHolds(entries) {
	return entries.map((entry) => {
		if (!isRecord(entry) || typeof entry.agentId !== "string" || entry.agentId !== normalizeAgentId(entry.agentId) || typeof entry.path !== "string" || !entry.path.trim()) throw new Error("Invalid agent database hold in deletion journal reconstruction receipt.");
		return {
			agentId: entry.agentId,
			path: entry.path
		};
	});
}
function readReport(database) {
	const receipt = readLegacyMigrationReceiptFromDatabase(database.db, AGENT_DELETION_RECOVERY_SOURCE_KEY);
	if (!receipt) return;
	const report = JSON.parse(receipt.reportJson);
	if (!isRecord(report) || typeof report.description !== "string" || !Array.isArray(report.held)) throw new Error("Invalid agent deletion journal reconstruction receipt.");
	const held = parseHolds(report.held);
	if (report.missingJournal !== void 0 && !Array.isArray(report.missingJournal)) throw new Error("Invalid missing-journal provenance in deletion journal reconstruction receipt.");
	const missingJournal = Array.isArray(report.missingJournal) ? parseHolds(report.missingJournal) : report.description === "Reconstructed the missing agent deletion journal; held databases require explicit agent restore or delete." ? held : [];
	if (missingJournal.some((entry) => !held.some((target) => target.agentId === entry.agentId && target.path === entry.path))) throw new Error("Missing-journal provenance refers to an unheld agent database.");
	return {
		...report,
		description: report.description,
		held,
		missingJournal
	};
}
function decodeHolds(database, held) {
	return held.map((entry) => ({
		agentId: entry.agentId,
		path: resolveOpenClawRegisteredAgentDatabasePath(database.path, entry.path)
	}));
}
/** Read recovery facts from this exact shared-state generation without opening another database. */
function readAgentDeletionRecoveryHolds(database) {
	return decodeHolds(database, readReport(database)?.held ?? []);
}
//#endregion
//#region src/state/agent-deletion-journal-status.ts
function statusKey(agentId) {
	return {
		name: `agent.deletion-status:${normalizeAgentId(agentId)}`,
		schemaDependent: true,
		read: (value) => value === "absent" || value === "pending" || value === "complete" ? value : void 0
	};
}
function getAgentDeletionJournalStatus(database, agentId) {
	return getSqliteDatabaseAdmission(database, statusKey(agentId)) ?? void 0;
}
resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionJournalStatusLoads"), () => /* @__PURE__ */ new Map());
//#endregion
//#region src/state/agent-deletion-journal.read.ts
async function readAgentDeletionRecoveryHoldsInWorker(options = {}) {
	const statePath = resolveDatabasePath(options);
	return (await executeExistingOpenClawStateRead({
		...options,
		path: statePath
	}, {
		type: "agentRecovery.holds",
		input: { statePath }
	}, { current: true }))?.held ?? [];
}
/** Completed cleanup still retains a deletion tombstone. */
function readAgentDeletionJournalStatusInDatabase(database, agentId) {
	const cached = getAgentDeletionJournalStatus(database, agentId);
	if (cached) return cached;
	if (!tableExists(database, "agent_deletion_journal")) return "absent";
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").select("cleanup_completed").where("agent_id", "=", normalizeAgentId(agentId)));
	return row ? row.cleanup_completed === 1 ? "complete" : "pending" : "absent";
}
function parseAgentDeletionDatabasePaths(value) {
	const parsed = JSON.parse(value);
	if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")) return parsed;
	throw new Error("Invalid agent deletion database path journal.");
}
/** Read existing deletion history without initializing or repairing the journal. */
function readRetainedAgentDeletionsFromDatabase(database, statePath, purpose = "maintenance") {
	let entries = [];
	let missing = false;
	let unreadableReason;
	try {
		missing = !tableExists(database, "agent_deletion_journal");
		if (!missing) entries = executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("agent_deletion_journal").selectAll().where((eb) => {
			const retained = eb.and([eb("cleanup_completed", "=", 1), eb("delete_files", "=", 0)]);
			return purpose === "maintenance" ? eb.or([retained, eb("cleanup_completed", "=", 0)]) : retained;
		}).orderBy("agent_id", "asc")).rows.map((row) => {
			let databasePaths = [];
			try {
				databasePaths = parseAgentDeletionDatabasePaths(row.database_paths_json);
			} catch (error) {
				if (purpose === "maintenance") unreadableReason ??= formatErrorMessage(error);
			}
			const entry = {
				agentId: row.agent_id,
				agentDir: row.agent_dir,
				databasePaths: [path.join(row.agent_dir, "openclaw-agent.sqlite"), ...databasePaths],
				cleanupCompleted: row.cleanup_completed === 1
			};
			if (row.cleanup_completed === 0 && row.phase == null && hasClawDeletionOwnership({ db: database }, row.agent_id)) entry.manualClawRemoval = true;
			return entry;
		});
	} catch (error) {
		if (isSqliteCorruptionError(error)) throw error;
		unreadableReason = formatErrorMessage(error);
	}
	const held = purpose === "maintenance" && tableExists(database, "migration_sources") ? readAgentDeletionRecoveryHolds({
		db: database,
		path: statePath
	}) : [];
	if (missing && held.length === 0 && hasPreJournalStateSchema(database)) return { status: "empty" };
	if (missing || unreadableReason !== void 0) return {
		status: "unavailable",
		cause: missing ? "missing" : "unreadable",
		reason: missing ? "deletion journal missing" : `deletion journal unreadable: ${unreadableReason}`,
		...entries.length || held.length ? { known: {
			entries,
			held
		} } : {}
	};
	return entries.length || held.length ? {
		status: "present",
		entries,
		held
	} : { status: "empty" };
}
/** Read journal and registered-owner facts from one shared-state generation. */
function readAgentDatabaseDeletionSnapshot(env, purpose = "maintenance") {
	return withExistingOpenClawStateDatabaseReadOnly(({ db, path: statePath }) => runSqliteDeferredTransactionSync(db, () => ({
		retainedDeletions: readRetainedAgentDeletionsFromDatabase(db, statePath, purpose),
		registeredAgentDatabases: readRegisteredAgentDatabaseRows(db, statePath, false)
	}), { operationLabel: "agentDeletionJournal.snapshot" }), { env });
}
//#endregion
//#region src/state/agent-deletion-journal.ts
/** Deletion ownership refusal is distinct from an unhealthy native database. */
var AgentDatabaseDeletionRefusedError = class extends Error {};
function assertAgentDeletionIdentityClaimAllowed(claimAgentId, deletedAgentId) {
	if (deletedAgentId && normalizeAgentId(claimAgentId) === normalizeAgentId(deletedAgentId)) throw new AgentDatabaseDeletionRefusedError(`OpenClaw agent database is unavailable while agent ${normalizeAgentId(deletedAgentId)} is deleted.`);
}
function readAgentDeletionPathFenceRows(database, purpose = "runtime", agentId) {
	if (purpose === "maintenance") assertAgentDeletionJournalAvailable(database);
	try {
		if (!tableExists(database, "agent_deletion_journal")) return {
			known: false,
			rows: []
		};
		const db = getNodeSqliteKysely(database);
		let known = true;
		let query = db.selectFrom("agent_deletion_journal").selectAll();
		if (agentId !== void 0) query = query.where("agent_id", "=", normalizeAgentId(agentId));
		const rows = executeSqliteQuerySync(database, query).rows.map((row) => {
			let databasePaths = [];
			let cleanupPaths = [];
			try {
				databasePaths = parseAgentDeletionDatabasePaths(row.database_paths_json);
				cleanupPaths = parseCleanupPaths(row.cleanup_paths_json);
			} catch (error) {
				if (purpose === "maintenance") throw error;
				known = false;
			}
			return Object.assign(row, {
				databasePaths,
				cleanupPaths
			});
		});
		return {
			known,
			rows
		};
	} catch (error) {
		if (purpose === "maintenance" || isSqliteCorruptionError(error)) throw error;
		return {
			known: false,
			rows: []
		};
	}
}
function prepareAgentDeletionPathFence(claim, options = {}, purpose = claim.fenceAgentId ? "maintenance" : "runtime") {
	const env = options.env ?? process.env;
	return {
		env,
		purpose,
		claimAgentId: normalizeAgentId(claim.agentId),
		claimPath: path.resolve(claim.path),
		...claim.fenceAgentId ? { fenceAgentId: normalizeAgentId(claim.fenceAgentId) } : {},
		targetPaths: resolveSqliteDatabaseFilePaths(claim.path).map((filePath) => normalizeAgentDirRegistryPath(filePath, env))
	};
}
/** Refuse database claims beneath paths still owned by an unfinished deletion. */
function assertAgentDeletionPathFence(state, snapshot) {
	const database = state.db;
	const { rows: journalRows, known } = readAgentDeletionPathFenceRows(database, snapshot.purpose);
	if (!known && journalRows.length === 0) return;
	const cleanup = snapshot.fenceAgentId ? void 0 : getAgentDeletionDatabaseCleanup({
		agentId: snapshot.claimAgentId,
		path: snapshot.claimPath,
		statePath: state.path
	});
	cleanup?.assertCurrent();
	const cleanupAgentId = cleanup?.assertJournal(state.path, journalRows.map((row) => ({
		agentId: row.agent_id,
		operationId: row.operation_id,
		cleanupCompleted: row.cleanup_completed === 1
	})));
	const creationAgentId = snapshot.fenceAgentId ? void 0 : resolveAgentCreationClaimAgentId(snapshot.claimAgentId, state.path);
	for (const row of journalRows) {
		if (snapshot.fenceAgentId && snapshot.fenceAgentId !== row.agent_id) continue;
		if (row.agent_id === cleanupAgentId) continue;
		if (row.cleanup_completed === 1 && row.agent_id === creationAgentId) continue;
		if (row.phase === "draining" && row.cleanup_completed !== 1 && row.agent_id === snapshot.claimAgentId && !snapshot.fenceAgentId) continue;
		assertAgentDeletionIdentityClaimAllowed(snapshot.claimAgentId, row.agent_id);
		if (row.cleanup_completed === 1) continue;
		const fences = [...[
			row.agent_dir,
			row.workspace_dir,
			row.sessions_dir,
			...row.databasePaths
		].map((pathname) => ({
			path: pathname,
			canonicalPath: normalizeAgentDirRegistryPath(pathname, snapshot.env)
		})), ...row.cleanupPaths.map((cleanupPath) => ({
			path: cleanupPath.path,
			canonicalPath: normalizeAgentDirRegistryPath(cleanupPath.canonicalPath, snapshot.env)
		}))];
		for (const fence of fences) {
			const blockedPath = snapshot.targetPaths.find((targetPath) => targetPath === fence.canonicalPath || isPathInside(fence.canonicalPath, targetPath));
			if (blockedPath) throw new AgentDatabaseDeletionRefusedError(`OpenClaw agent database ${blockedPath} is unavailable while agent ${row.agent_id} deletion owns ${fence.path}.`);
		}
	}
}
function fromRow(row) {
	if (row.phase != null && row.phase !== "draining" && row.phase !== "retiring") throw new Error("Invalid agent deletion journal phase.");
	return {
		agentId: row.agent_id,
		operationId: row.operation_id,
		phase: row.phase === "draining" ? "draining" : "retiring",
		agentDir: row.agent_dir,
		workspaceDir: row.workspace_dir,
		sessionsDir: row.sessions_dir,
		databasePaths: row.databasePaths ?? parseAgentDeletionDatabasePaths(row.database_paths_json),
		cleanupPaths: row.cleanupPaths ?? parseCleanupPaths(row.cleanup_paths_json),
		createdAt: row.created_at,
		cleanupCompleted: row.cleanup_completed === 1,
		deleteFiles: row.delete_files === 1
	};
}
function parseCleanupPaths(value) {
	const parsed = JSON.parse(value);
	if (!Array.isArray(parsed) || !parsed.every((entry) => isRecord(entry) && typeof entry.path === "string" && typeof entry.canonicalPath === "string" && typeof entry.parentPath === "string" && (entry.kind === "target" || entry.kind === "symlink") && (entry.dev === null || typeof entry.dev === "number" && Number.isInteger(entry.dev) || typeof entry.dev === "string" && /^(0|-?[1-9][0-9]*)$/u.test(entry.dev)) && (entry.ino === null || typeof entry.ino === "number" && Number.isInteger(entry.ino) || typeof entry.ino === "string" && /^(0|-?[1-9][0-9]*)$/u.test(entry.ino)) && typeof entry.coversDescendants === "boolean" && typeof entry.done === "boolean" && (entry.note === void 0 || typeof entry.note === "string") && Array.isArray(entry.sourcePaths) && entry.sourcePaths.every((sourcePath) => typeof sourcePath === "string"))) throw new Error("Invalid agent deletion cleanup path journal.");
	return parsed;
}
/** Read the journal through an already validated shared-state connection. */
function readAgentDeletionJournalInDatabase(database, agentId, purpose = "maintenance") {
	const row = readAgentDeletionPathFenceRows(database.db, purpose, agentId).rows[0];
	return row ? fromRow(row) : void 0;
}
function listPendingAgentDeletionJournalsInDatabase(database) {
	const entries = [];
	const manualClawAgentIds = [];
	for (const row of readAgentDeletionPathFenceRows(database.db).rows) {
		if (row.cleanup_completed === 1) continue;
		if (row.phase == null && hasClawDeletionOwnership(database, row.agent_id)) manualClawAgentIds.push(row.agent_id);
		else entries.push(fromRow(row));
	}
	return {
		entries,
		manualClawAgentIds
	};
}
//#endregion
export { readOpenClawAgentDatabaseIdentity as C, isOpenClawAgentDatabasePathCurrent as S, SESSION_PARTICIPANTS_TABLE as T, readAgentDatabasePreflightTargets as _, readAgentDatabaseDeletionSnapshot as a, createOpenClawAgentDatabaseClaim as b, readRetainedAgentDeletionsFromDatabase as c, captureOpenClawAgentDatabaseRegistration as d, emitOpenClawAgentDatabaseRegistryChange as f, settleAgentRegistration as g, recordOpenClawAgentDatabaseRegistryMutation as h, readAgentDeletionJournalInDatabase as i, readAgentDeletionRecoveryHolds as l, listOpenClawRegisteredAgentDatabases as m, listPendingAgentDeletionJournalsInDatabase as n, readAgentDeletionJournalStatusInDatabase as o, hasRegisteredOpenClawAgentDatabasePath as p, prepareAgentDeletionPathFence as r, readAgentDeletionRecoveryHoldsInWorker as s, assertAgentDeletionPathFence as t, isReservedSystemAgentId as u, readRegisteredAgentDatabaseRows as v, registerOpenClawAgentDatabaseIdentity as w, findOpenClawAgentDatabaseIdentity as x, assertOpenClawAgentDatabaseIdentity as y };

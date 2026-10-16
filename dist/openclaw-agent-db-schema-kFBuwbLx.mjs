import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { s as quoteSqliteIdentifier, t as extractSqliteTableSchema } from "./sqlite-schema-sql-CKIqAlrf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { n as configureSqlitePreSchemaPragmas } from "./sqlite-wal-DUSYRhyv.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { a as readSqliteInspectionBudget, c as resolveSqliteInspectionSignal, h as sqliteInspectionTimeoutError, i as isSqliteInspectionDeadlineOwnedByCaller } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BTxZz0OV.mjs";
import { n as readSqliteIntegrityFileIdentity } from "./sqlite-file-generation-C_XgOkXx.mjs";
import { c as sqliteIntegrityCheckSteps, n as assertSqliteIntegrity, s as runSqliteIntegrityOperationSync } from "./sqlite-integrity-GtqcmwG3.mjs";
import { n as migrateSqliteSchemaToStrictInTransaction } from "./sqlite-strict-CYeSH78z.mjs";
import { C as ensureMemoryRecallMetadataSchema, E as ensureMemoryChunkProvenance, i as migrateMemoryIndexStorage, n as migrateMemoryIndexSourcesIdentity } from "./memory-schema-BA04oCjG.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
import { S as withoutCanonicalSessionValidationSchema, x as canonicalSessionValidationSchemaSql } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { r as ensureOpenClawAgentBoardSchemaInTransaction } from "./openclaw-agent-board-schema-B7stqGC8.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as canReuseOpenClawAgentIntegrityVerification } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import "./session-key-C09ow4h0.mjs";
import { a as isPersistentOpenClawAgentDatabasePath, c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.mjs";
import { _ as verifyAndRepairCanonicalSqliteIndexes, g as verifyAndRepairCanonicalSqliteIndexSteps, h as repairCanonicalSqliteIndexes, l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion } from "./openclaw-agent-db-schema-read-8tLHX1g8.mjs";
import { n as parseSqliteSessionEntryRecord } from "./session-entry-json-CtwFM7Hi.mjs";
import { C as ensureSessionEntryValidityProjection, D as migrateSessionTranscriptGenerations, E as migrateSessionTranscriptActiveProjection, O as readSqliteTableColumns, S as ensureSessionAdditiveColumns, T as migrateSessionCreatorNamespaces, _ as withLegacySessionParticipantsSchema, a as ensureSessionReactionsSchemaInTransaction, b as assertSupportedAgentMigrationSchemas, c as hasPendingMemoryChunkMetadataMigration, d as repairAndAssertOpenClawAgentV14SchemaForMigration, f as withLegacyAgentStorageSchema, g as migrateSessionParticipantsSchema, h as withoutSessionEntrySnapshotsSchema, i as ensureSessionKeyContractSchemaInTransaction, l as migrateRetiredAgentStateLeaseSchema, m as sessionEntrySnapshotsSchemaSql, n as assertOpenClawAgentCurrentRuntimeSchema, o as getOpenClawAgentMigrationSchema, p as migrateDeployedTranscriptFtsRowsInTransaction, s as hasPendingCurrentVersionAgentDatabaseMigration, t as assertAgentSchemaVersion, u as migratedSessionColumn, w as migrateConversationDeliveryTargetColumn, x as backfillSessionConversations } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { p as assertAgentDeletionRecoveryAllowsMutation, s as prepareAgentDeletionPathFence, t as assertAgentDeletionPathFence } from "./agent-deletion-journal-CDljXcnp.mjs";
import { _ as renewAgentDatabaseMaintenanceAuthorityIfPresent, i as assertAgentDatabaseMaintenanceAuthorityIfPresent, r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { t as registerOpenClawAgentDatabase } from "./openclaw-agent-db-registry-BJf044De.mjs";
import { a as encodeUsageCostRollup, t as USAGE_COST_ROLLUP_SCOPE } from "./session-cost-usage-rollup-codec-CJTlUqQK.mjs";
import { i as splitSessionEntrySnapshots } from "./session-entry-snapshots-DO3oGsuC.mjs";
import { i as prepareTranscriptPayload } from "./transcript-payload-Yc_w8Yx5.mjs";
import { chmodSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { fork } from "node:child_process";
import { performance as performance$1 } from "node:perf_hooks";
//#region src/infra/sqlite-integrity-worker-error.ts
var SqliteIntegrityWorkerInterruptedError = class extends Error {
	constructor(signal, lastObservedPhase) {
		super(`SQLite integrity check stopped by ${signal} before completion (lastObservedPhase=${lastObservedPhase})`);
		this.signal = signal;
		this.name = "SqliteIntegrityWorkerInterruptedError";
	}
};
//#endregion
//#region src/infra/sqlite-integrity-worker.ts
const integrityScope = new AsyncLocalStorage();
const log = createSubsystemLogger("state/sqlite");
async function closeIntegrityProcess(worker) {
	if (!worker.retired) {
		worker.retired = true;
		if (worker.child.connected) worker.child.send({ type: "close" }, (error) => {
			if (error) worker.child.kill("SIGKILL");
		});
	}
	const timeout = setTimeout(() => worker.child.kill("SIGKILL"), worker.closeBudgetMs);
	timeout.unref();
	try {
		await worker.closed;
	} finally {
		clearTimeout(timeout);
	}
}
/** Reuse imports within one maintenance lease; each request opens and closes its own database. */
async function withSqliteIntegrityWorkerScope(assertCurrent, operation) {
	const parent = integrityScope.getStore();
	if (parent && !parent.accepting) throw new Error("SQLite integrity maintenance scope is closed");
	const scope = {
		queue: parent?.queue ?? { tail: Promise.resolve() },
		assertCurrent,
		accepting: true,
		pending: /* @__PURE__ */ new Set()
	};
	try {
		return await integrityScope.run(scope, async () => {
			let outcome;
			try {
				outcome = { value: await operation() };
			} catch (error) {
				outcome = { error };
			}
			scope.accepting = false;
			const errors = "error" in outcome ? [outcome.error] : [];
			for (const result of await Promise.allSettled(scope.pending)) if (result.status === "rejected" && !errors.includes(result.reason)) errors.push(result.reason);
			try {
				assertCurrent();
			} catch (error) {
				if (!errors.includes(error)) errors.push(error);
			}
			throwSqliteLifecycleErrors(errors, "SQLite integrity maintenance scope failed");
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		});
	} finally {
		scope.accepting = false;
		if (!parent && scope.queue.process) await closeIntegrityProcess(scope.queue.process);
	}
}
/** The caller retains its owning lease or private snapshot until the native reader closes. */
function assertSqliteIntegrityInWorker(pathname, busyTimeoutMs, callerSignal, databaseLabel = pathname, timing, tables) {
	const scope = integrityScope.getStore();
	const run = async (heldScope) => {
		if (!tables) return assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, timing, heldScope);
		heldScope?.assertCurrent();
		const startedAt = performance$1.now();
		const full = tables.filter((entry) => entry.check === "integrity_check");
		const batches = [tables.filter((entry) => entry.check === "quick_check"), ...Array.from({ length: Math.min(3, full.length) }, (_, index) => full.filter((_entry, position) => position % 3 === index))].filter((batch) => batch.length > 0).map((batch) => ({
			tables: batch,
			timing: {}
		}));
		const results = await Promise.allSettled(batches.map(async (batch) => assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, batch.timing, void 0, batch.tables)));
		if (timing) {
			timing.workerLifetimeElapsedMs = performance$1.now() - startedAt;
			timing.workerCheckElapsedMs = Math.max(0, ...batches.map((batch) => batch.timing.workerCheckElapsedMs ?? 0));
			timing.tables = batches.flatMap((batch) => batch.timing.tables ?? []).toSorted((a, b) => a.table.localeCompare(b.table));
		}
		heldScope?.assertCurrent();
		for (const result of results) if (result.status === "rejected") throw result.reason;
	};
	if (!scope) return run();
	if (!scope.accepting) return Promise.reject(/* @__PURE__ */ new Error("SQLite integrity maintenance scope is closed"));
	const pending = scope.queue.tail.then(async () => {
		try {
			if (scope.queue.process?.retired) await scope.queue.process.closed;
			await run(scope);
		} catch (error) {
			if (scope.queue.process) await closeIntegrityProcess(scope.queue.process);
			throw error;
		}
	});
	scope.queue.tail = pending.catch(() => void 0);
	scope.pending.add(pending);
	pending.finally(() => scope.pending.delete(pending)).catch(() => void 0);
	return pending;
}
function assertSqliteIntegrityWithProcess(pathname, busyTimeoutMs, callerSignal, databaseLabel, timing, scope, tables) {
	const signal = resolveSqliteInspectionSignal(callerSignal) ?? callerSignal;
	if (timing) {
		delete timing.workerCheckElapsedMs;
		delete timing.workerLifetimeElapsedMs;
	}
	signal.throwIfAborted();
	scope?.assertCurrent();
	const identity = readSqliteIntegrityFileIdentity(pathname);
	const { timeoutMs, size } = readSqliteInspectionBudget("integrity check", databaseLabel, identity.size);
	const startedAt = performance$1.now();
	let active = scope?.queue.process;
	if (!active || active.retired) {
		const entry = resolveRuntimeProcessEntrypointUrl("sqliteIntegrity");
		const child = fork(entry, [], {
			execArgv: resolveRuntimeWorkerArgv(entry).slice(0, -1),
			serialization: "advanced",
			stdio: [
				"ignore",
				"ignore",
				"ignore",
				"ipc"
			],
			timeout: scope || isSqliteInspectionDeadlineOwnedByCaller() ? void 0 : timeoutMs,
			killSignal: "SIGKILL",
			...scope ? {} : { signal }
		});
		const { promise: closed, resolve: onClosed } = createDeferredCore();
		active = {
			child,
			closed,
			retired: false,
			closeBudgetMs: timeoutMs
		};
		const launched = active;
		child.on("error", (error) => {
			launched.failure = toStringifiedError(error);
			launched.retired = true;
			child.kill("SIGKILL");
		});
		child.once("close", () => {
			launched.retired = true;
			onClosed();
		});
		if (scope) scope.queue.process = active;
	}
	active.closeBudgetMs = timeoutMs;
	const reader = active;
	const worker = reader.child;
	return new Promise((resolve, reject) => {
		let result;
		let failure;
		let lastObservedPhase = "starting";
		let timeout;
		const heartbeat = setInterval(() => {
			log.info(`SQLite integrity check still running: ${databaseLabel} (${size}, ${Math.floor((performance$1.now() - startedAt) / 1e3)}s elapsed, phase=${lastObservedPhase}).`);
		}, 1e4);
		heartbeat.unref();
		const deadlineError = () => {
			const error = sqliteInspectionTimeoutError("integrity check", databaseLabel, timeoutMs, size);
			error.message += ` (lastObservedPhase=${lastObservedPhase})`;
			return error;
		};
		const kill = () => {
			reader.retired = true;
			worker.kill("SIGKILL");
		};
		const onAbort = () => {
			failure = toStringifiedError(signal.reason);
			kill();
		};
		const finish = (code, closeSignal) => {
			clearTimeout(timeout);
			clearInterval(heartbeat);
			signal.removeEventListener("abort", onAbort);
			worker.off("message", onMessage);
			worker.off("close", onClose);
			if (timing) {
				timing.workerLifetimeElapsedMs = performance$1.now() - startedAt;
				timing.tables = result?.tables;
				const checkElapsedMs = result?.checkElapsedMs;
				if (typeof checkElapsedMs === "number" && Number.isFinite(checkElapsedMs) && checkElapsedMs >= 0) timing.workerCheckElapsedMs = checkElapsedMs;
			}
			try {
				signal.throwIfAborted();
				scope?.assertCurrent();
				const workerFailure = failure ?? reader.failure;
				if (workerFailure) throw workerFailure;
				if (worker.killed && closeSignal === "SIGKILL") throw deadlineError();
				if (code !== 0 || !result) {
					if (!result && closeSignal) throw new SqliteIntegrityWorkerInterruptedError(closeSignal, lastObservedPhase);
					throw new Error(`SQLite integrity worker exited ${code} without a completed check (lastObservedPhase=${lastObservedPhase})`);
				}
				readSqliteIntegrityFileIdentity(pathname, identity);
				if (!result.ok) {
					const cause = result.error.cause ? Object.assign(new Error(result.error.cause.message), result.error.cause) : void 0;
					throw Object.assign(new Error(result.error.message, cause ? { cause } : void 0), {
						name: result.error.name,
						code: result.error.code,
						errcode: result.error.errcode
					});
				}
				resolve();
			} catch (error) {
				if (scope && !reader.retired) {
					kill();
					reader.closed.then(() => reject(toStringifiedError(error)));
				} else reject(toStringifiedError(error));
			}
		};
		const onClose = (code, closeSignal) => finish(code, closeSignal);
		const onMessage = (message) => {
			if ("type" in message && message.type === "phase") {
				if (!result && (message.phase === "opening" || message.phase === "checking" || message.phase === "closing")) lastObservedPhase = message.phase;
			} else if ("ok" in message) {
				result = message;
				lastObservedPhase = "result-received";
				if (scope) {
					if (message.ok && !reader.retired && !failure && !reader.failure) finish(0, null);
					else reader.retired = true;
				}
			}
		};
		worker.on("message", onMessage);
		worker.once("close", onClose);
		if (scope) {
			signal.addEventListener("abort", onAbort, { once: true });
			if (!isSqliteInspectionDeadlineOwnedByCaller()) {
				timeout = setTimeout(() => {
					if (!result || result.ok) failure ??= reader.failure ?? deadlineError();
					kill();
				}, timeoutMs);
				timeout.unref();
			}
		}
		if (!signal.aborted) worker.send({
			pathname,
			databaseLabel,
			identity,
			busyTimeoutMs,
			tables,
			...scope ? { reuse: true } : {}
		}, (error) => {
			if (error) {
				failure = error;
				kill();
			}
		});
		else if (scope) onAbort();
	});
}
//#endregion
//#region src/state/openclaw-agent-db-permissions.ts
const OPENCLAW_AGENT_DB_DIR_MODE = 448;
const OPENCLAW_AGENT_DB_FILE_MODE = 384;
function ensureMode(target, mode) {
	if (process.platform === "win32" || (statSync(target).mode & 4095) !== mode) chmodSync(target, mode);
}
function ensureOpenClawAgentDatabasePermissions(pathname, options) {
	const dir = path.dirname(pathname);
	const defaultPath = resolveOpenClawAgentSqlitePath({
		agentId: options.agentId,
		env: options.env
	});
	const isDefaultAgentDatabase = path.resolve(pathname) === path.resolve(defaultPath);
	const dirExisted = existsSync(dir);
	mkdirSync(dir, {
		recursive: true,
		mode: OPENCLAW_AGENT_DB_DIR_MODE
	});
	if (isDefaultAgentDatabase || !dirExisted) ensureMode(dir, OPENCLAW_AGENT_DB_DIR_MODE);
	for (const candidate of resolveSqliteDatabaseFilePaths(pathname)) try {
		ensureMode(candidate, OPENCLAW_AGENT_DB_FILE_MODE);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
//#endregion
//#region src/infra/session-cost-usage-cache-migration.ts
const PREVIOUS_SCOPE = "session-cost-usage-rollup-v2";
/** Migration-only reader for the retired complete-JSON representation. */
function decodePreviousRollup(valueJson) {
	const value = safeParseJsonRecord(valueJson ?? "");
	if (!value || value.version !== 6 || typeof value.pricingFingerprint !== "string" || !isRecord(value.checkpoint) || value.checkpoint.kind !== "jsonl" && value.checkpoint.kind !== "sqlite" || typeof value.scannedAt !== "number" || typeof value.parsedRecords !== "number" || typeof value.countedRecords !== "number" || !isRecord(value.rollup) || !isRecord(value.rollup.buckets) || !isRecord(value.rollup.untimestamped)) return;
	return value;
}
/** Caller owns the migration transaction; retain at most one complete report body at a time. */
function migrateSessionCostUsageRollupStorage(db, renewAuthority) {
	const cache = getNodeSqliteKysely(db);
	let afterKey;
	for (;;) {
		renewAuthority?.();
		let query = cache.selectFrom("cache_entries").select([
			"key",
			"value_json",
			"updated_at"
		]).where("scope", "=", PREVIOUS_SCOPE).orderBy("key", "asc").limit(1);
		if (afterKey !== void 0) query = query.where("key", ">", afterKey);
		const row = executeSqliteQuerySync(db, query).rows[0];
		if (!row) break;
		afterKey = row.key;
		const entry = decodePreviousRollup(row.value_json);
		if (entry) {
			const encoded = encodeUsageCostRollup(entry);
			executeSqliteQuerySync(db, cache.insertInto("cache_entries").values({
				scope: USAGE_COST_ROLLUP_SCOPE,
				key: row.key,
				value_json: encoded.valueJson,
				blob: encoded.blob,
				updated_at: row.updated_at,
				expires_at: null
			}).onConflict((conflict) => conflict.columns(["scope", "key"]).doNothing()));
		}
		executeSqliteQuerySync(db, cache.deleteFrom("cache_entries").where("scope", "=", PREVIOUS_SCOPE).where("key", "=", row.key));
	}
}
//#endregion
//#region src/state/openclaw-agent-db-session-provenance.ts
function backfillTranscriptMutationWatermarks(db) {
	if (!tableExists(db, "transcript_events")) return;
	db.exec(`
    UPDATE sessions
    SET
      transcript_updated_at = COALESCE(
        transcript_updated_at,
        (SELECT MAX(transcript_events.created_at)
         FROM transcript_events
         WHERE transcript_events.session_id = sessions.session_id)
      ),
      transcript_observed_at = COALESCE(transcript_observed_at, updated_at)
    WHERE EXISTS (
      SELECT 1 FROM transcript_events
      WHERE transcript_events.session_id = sessions.session_id
    );
  `);
}
//#endregion
//#region src/state/openclaw-agent-db-legacy-schema.ts
function migrateOpenClawAgentSchema(db) {
	if (readSqliteUserVersion(db) >= 24) return;
	const columns = readSqliteTableColumns(db, "sessions");
	if (!columns) return;
	for (const [name, definition] of Object.entries({
		transcript_updated_at: "INTEGER DEFAULT NULL",
		transcript_observed_at: "INTEGER DEFAULT NULL",
		session_entry_provenance: "INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1))",
		acp_owned: "INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1))",
		plugin_owner_id: "TEXT",
		hook_external_content_source: "TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook'))"
	})) if (!columns.has(name)) db.exec(`ALTER TABLE sessions ADD COLUMN ${name} ${definition};`);
	backfillTranscriptMutationWatermarks(db);
}
//#endregion
//#region src/state/openclaw-agent-db-metadata-write.ts
function persistAgentSchemaMetadata(db, agentId, targetVersion) {
	const now = Date.now();
	const metadata = {
		role: "agent",
		schema_version: targetVersion,
		agent_id: agentId,
		app_version: VERSION
	};
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("schema_meta").values({
		meta_key: "primary",
		...metadata,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.column("meta_key").doUpdateSet({
		...metadata,
		updated_at: now
	}).where((eb) => eb.or([
		eb("schema_meta.schema_version", "!=", targetVersion),
		eb("schema_meta.app_version", "is", null),
		eb("schema_meta.app_version", "!=", VERSION),
		eb("schema_meta.agent_id", "!=", agentId)
	]))));
}
//#endregion
//#region src/state/openclaw-agent-db-session-nodes-migration.ts
const SESSION_NODE_SCHEMA_VERSION = 14;
function jsonText(path) {
	return `CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${path}') = 'text'
    THEN NULLIF(trim(CAST(json_extract(entry_json, '${path}') AS TEXT)), '')
    ELSE NULL
  END`;
}
function jsonNumber(path) {
	return `CASE
    WHEN json_valid(entry_json) AND json_type(entry_json, '${path}') IN ('integer', 'real')
    THEN CAST(json_extract(entry_json, '${path}') AS INTEGER)
    ELSE NULL
  END`;
}
function createSessionNodes(db) {
	db.exec(`
    CREATE TABLE IF NOT EXISTS session_nodes (
      session_key TEXT NOT NULL PRIMARY KEY,
      current_session_id TEXT NOT NULL,
      entry_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      created_at INTEGER,
      created_via TEXT CHECK (created_via IS NULL OR created_via IN ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')),
      created_actor_type TEXT CHECK (created_actor_type IS NULL OR created_actor_type IN ('human', 'agent', 'system')),
      created_actor_id TEXT,
      parent_session_key TEXT,
      spawned_by TEXT,
      fork_source_session_key TEXT,
      fork_source_session_id TEXT,
      fork_source_entry_id TEXT,
      label TEXT,
      display_name TEXT,
      category TEXT,
      icon TEXT,
      pinned_at INTEGER,
      archived_at INTEGER,
      last_read_at INTEGER,
      last_interaction_at INTEGER,
      last_activity_at INTEGER
    ) STRICT;
  `);
}
/** Live entries take precedence over routes, then retained generations. */
function backfillSessionNodes(db) {
	const entryColumns = readSqliteTableColumns(db, "session_entries");
	const routeColumns = readSqliteTableColumns(db, "session_routes");
	if (entryColumns) {
		const status = migratedSessionColumn(entryColumns, "status", "NULL");
		db.exec(`INSERT OR REPLACE INTO session_nodes (
        session_key, current_session_id, entry_json, updated_at, status,
        created_at, created_via, created_actor_type, created_actor_id,
        parent_session_key, spawned_by, fork_source_session_key,
        fork_source_session_id, fork_source_entry_id, label, display_name,
        category, icon, pinned_at, archived_at, last_read_at,
        last_interaction_at, last_activity_at
      ) SELECT
        session_key,
        session_id,
        entry_json,
        updated_at,
        ${status},
        ${jsonNumber("$.createdAt")},
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdVia') IN
              ('operator', 'spawn', 'channel', 'cron', 'talk', 'run', 'plugin', 'internal')
          THEN json_extract(entry_json, '$.createdVia')
          ELSE NULL
        END,
        CASE
          WHEN json_valid(entry_json)
            AND json_extract(entry_json, '$.createdActor.type') IN ('human', 'agent', 'system')
          THEN json_extract(entry_json, '$.createdActor.type')
          WHEN ${jsonText("$.createdBy.id")} IS NOT NULL THEN 'human'
          ELSE NULL
        END,
        COALESCE(${jsonText("$.createdActor.id")}, ${jsonText("$.createdBy.id")}),
        COALESCE(${jsonText("$.parentSessionKey")}, ${jsonText("$.spawnedBy")}),
        ${jsonText("$.spawnedBy")},
        ${jsonText("$.forkSource.sessionKey")},
        ${jsonText("$.forkSource.sessionId")},
        ${jsonText("$.forkSource.entryId")},
        ${jsonText("$.label")},
        ${jsonText("$.displayName")},
        ${jsonText("$.category")},
        NULL,
        ${jsonNumber("$.pinnedAt")},
        ${jsonNumber("$.archivedAt")},
        ${jsonNumber("$.lastReadAt")},
        ${jsonNumber("$.lastInteractionAt")},
        ${jsonNumber("$.lastActivityAt")}
      FROM session_entries;`);
	}
	if (routeColumns) db.exec(`INSERT OR IGNORE INTO session_nodes
      (session_key, current_session_id, entry_json, updated_at)
      SELECT session_key, session_id, '{}', updated_at FROM session_routes;`);
	db.exec(`INSERT OR IGNORE INTO session_nodes
    (session_key, current_session_id, entry_json, updated_at)
    SELECT session_key, session_id, '{}', updated_at FROM sessions;`);
}
/** Project the legacy window owner with the migration's entry/route precedence. */
function createLegacySessionWindowSelect(db) {
	const columns = readSqliteTableColumns(db, "sessions");
	if (!columns) return;
	const entryColumns = readSqliteTableColumns(db, "session_entries");
	const routeColumns = readSqliteTableColumns(db, "session_routes");
	const ownerValue = (table, column) => `(SELECT candidate.${column}
        FROM ${table} AS candidate
        INNER JOIN session_windows AS owner_window ON owner_window.session_id = candidate.session_id
        WHERE candidate.session_id = session_windows.session_id
        ORDER BY CASE WHEN candidate.session_key = owner_window.session_key THEN 0 ELSE 1 END,
                 candidate.updated_at DESC,
                 candidate.session_key ASC
        LIMIT 1)`;
	const entryOwner = entryColumns ? ownerValue("session_entries", "session_key") : "NULL";
	const routeOwner = routeColumns ? ownerValue("session_routes", "session_key") : "NULL";
	const currentEntryJson = entryColumns ? ownerValue("session_entries", "entry_json") : "NULL";
	return {
		columns: `session_id, session_key, previous_session_id, reason, session_scope,
      created_at, updated_at, transcript_updated_at, transcript_observed_at,
      session_entry_provenance, acp_owned, plugin_owner_id,
      hook_external_content_source, started_at, ended_at, status, chat_type,
      channel, account_id, primary_conversation_id, model_provider, model,
      agent_harness_id, parent_session_key, spawned_by, display_name`,
		sql: `SELECT
      session_id,
      COALESCE(${entryOwner}, ${routeOwner}, session_key),
      CASE
        WHEN json_valid(${currentEntryJson})
        THEN NULLIF(trim(CAST(json_extract(${currentEntryJson}, '$.previousSessionId') AS TEXT)), '')
        ELSE NULL
      END,
      NULL,
      ${migratedSessionColumn(columns, "session_scope", "'conversation'")},
      created_at,
      updated_at,
      ${migratedSessionColumn(columns, "transcript_updated_at", "NULL")},
      ${migratedSessionColumn(columns, "transcript_observed_at", "NULL")},
      ${migratedSessionColumn(columns, "session_entry_provenance", "0")},
      ${migratedSessionColumn(columns, "acp_owned", "0")},
      ${migratedSessionColumn(columns, "plugin_owner_id", "NULL")},
      ${migratedSessionColumn(columns, "hook_external_content_source", "NULL")},
      ${migratedSessionColumn(columns, "started_at", "NULL")},
      ${migratedSessionColumn(columns, "ended_at", "NULL")},
      ${migratedSessionColumn(columns, "status", "NULL")},
      ${migratedSessionColumn(columns, "chat_type", "NULL")},
      ${migratedSessionColumn(columns, "channel", "NULL")},
      ${migratedSessionColumn(columns, "account_id", "NULL")},
      ${migratedSessionColumn(columns, "primary_conversation_id", "NULL")},
      ${migratedSessionColumn(columns, "model_provider", "NULL")},
      ${migratedSessionColumn(columns, "model", "NULL")},
      ${migratedSessionColumn(columns, "agent_harness_id", "NULL")},
      ${migratedSessionColumn(columns, "parent_session_key", "NULL")},
      ${migratedSessionColumn(columns, "spawned_by", "NULL")},
      ${migratedSessionColumn(columns, "display_name", "NULL")}
    FROM session_windows`
	};
}
function migrateSessionWindows(db) {
	const projection = createLegacySessionWindowSelect(db);
	if (!projection) return;
	db.exec("ALTER TABLE sessions RENAME TO session_windows;");
	db.exec(`
    DROP TABLE IF EXISTS session_windows_new;
    CREATE TABLE session_windows_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      session_key TEXT NOT NULL,
      previous_session_id TEXT,
      reason TEXT CHECK (reason IS NULL OR reason IN ('initial', 'reset', 'rollover', 'fork', 'rewind', 'switch', 'recovery', 'compaction')),
      session_scope TEXT NOT NULL DEFAULT 'conversation' CHECK (session_scope IN ('conversation', 'shared-main', 'group', 'channel')),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      transcript_updated_at INTEGER DEFAULT NULL,
      transcript_observed_at INTEGER DEFAULT NULL,
      session_entry_provenance INTEGER NOT NULL DEFAULT 0 CHECK (session_entry_provenance IN (0, 1)),
      acp_owned INTEGER NOT NULL DEFAULT 0 CHECK (acp_owned IN (0, 1)),
      plugin_owner_id TEXT,
      hook_external_content_source TEXT CHECK (hook_external_content_source IS NULL OR hook_external_content_source IN ('gmail', 'webhook')),
      started_at INTEGER,
      ended_at INTEGER,
      status TEXT CHECK (status IS NULL OR status IN ('running', 'done', 'failed', 'killed', 'timeout')),
      chat_type TEXT CHECK (chat_type IS NULL OR chat_type IN ('direct', 'group', 'channel')),
      channel TEXT,
      account_id TEXT,
      primary_conversation_id TEXT,
      model_provider TEXT,
      model TEXT,
      agent_harness_id TEXT,
      parent_session_key TEXT,
      spawned_by TEXT,
      display_name TEXT,
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE,
      FOREIGN KEY (primary_conversation_id) REFERENCES conversations(conversation_id) ON DELETE SET NULL
    ) STRICT;
    INSERT INTO session_windows_new (${projection.columns})
    ${projection.sql};
    DROP TABLE session_windows;
    ALTER TABLE session_windows_new RENAME TO session_windows;
  `);
}
function renameTranscriptRewriteWatermarks(db) {
	if (readSqliteTableColumns(db, "session_transcript_generations") && !readSqliteTableColumns(db, "transcript_rewrite_watermarks")) db.exec("ALTER TABLE session_transcript_generations RENAME TO transcript_rewrite_watermarks;");
}
function rebuildBoardTabs(db) {
	if (!readSqliteTableColumns(db, "board_tabs")) return;
	if (readSqliteTableColumns(db, "board_widgets")) db.exec(`
      DELETE FROM board_widgets
      WHERE NOT EXISTS (
        SELECT 1 FROM session_nodes WHERE session_nodes.session_key = board_widgets.session_key
      );
    `);
	db.exec(`
    DROP TABLE IF EXISTS board_tabs_new;
    CREATE TABLE board_tabs_new (
      session_key TEXT NOT NULL,
      tab_id TEXT NOT NULL,
      title TEXT NOT NULL,
      position INTEGER NOT NULL CHECK (position >= 0),
      chat_dock TEXT NOT NULL DEFAULT 'right' CHECK (chat_dock IN ('left', 'right', 'bottom', 'hidden')),
      created_by TEXT NOT NULL CHECK (created_by IN ('user', 'agent')),
      revision INTEGER NOT NULL CHECK (revision >= 0),
      PRIMARY KEY (session_key, tab_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO board_tabs_new (
      session_key, tab_id, title, position, chat_dock, created_by, revision
    )
    SELECT b.session_key, b.tab_id, b.title, b.position, b.chat_dock, b.created_by, b.revision
    FROM board_tabs AS b
    INNER JOIN session_nodes AS n ON n.session_key = b.session_key;
    DROP TABLE board_tabs;
    ALTER TABLE board_tabs_new RENAME TO board_tabs;
  `);
}
function rebuildHeartbeatOutcomes(db) {
	const columns = readSqliteTableColumns(db, "heartbeat_outcomes");
	if (!columns) return;
	db.exec(`
    DROP TABLE IF EXISTS heartbeat_outcomes_new;
    CREATE TABLE heartbeat_outcomes_new (
      session_key TEXT NOT NULL PRIMARY KEY,
      run_session_key TEXT NOT NULL,
      outcome TEXT NOT NULL CHECK (outcome IN ('progress', 'done', 'blocked', 'needs_attention')),
      summary TEXT NOT NULL,
      response_reason TEXT,
      priority TEXT CHECK (priority IS NULL OR priority IN ('low', 'normal', 'high')),
      next_check TEXT,
      task_names_json TEXT,
      wake_source TEXT,
      wake_reason TEXT,
      occurred_at INTEGER NOT NULL,
      context_run_id TEXT,
      context_claimed_at INTEGER,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO heartbeat_outcomes_new (
      session_key, run_session_key, outcome, summary, response_reason, priority,
      next_check, task_names_json, wake_source, wake_reason, occurred_at,
      context_run_id, context_claimed_at, updated_at
    )
    SELECT
      h.session_key,
      h.run_session_key,
      h.outcome,
      h.summary,
      ${migratedSessionColumn(columns, "response_reason", "NULL")},
      ${migratedSessionColumn(columns, "priority", "NULL")},
      ${migratedSessionColumn(columns, "next_check", "NULL")},
      ${migratedSessionColumn(columns, "task_names_json", "NULL")},
      ${migratedSessionColumn(columns, "wake_source", "NULL")},
      ${migratedSessionColumn(columns, "wake_reason", "NULL")},
      h.occurred_at,
      ${migratedSessionColumn(columns, "context_run_id", "NULL")},
      ${migratedSessionColumn(columns, "context_claimed_at", "NULL")},
      h.updated_at
    FROM heartbeat_outcomes AS h
    INNER JOIN session_nodes AS n ON n.session_key = h.session_key;
    DROP TABLE heartbeat_outcomes;
    ALTER TABLE heartbeat_outcomes_new RENAME TO heartbeat_outcomes;
  `);
}
function rebuildSessionMembers(db) {
	if (!readSqliteTableColumns(db, "session_members")) return;
	db.exec(`
    DROP TABLE IF EXISTS session_members_new;
    CREATE TABLE session_members_new (
      session_key TEXT NOT NULL,
      identity_id TEXT NOT NULL,
      added_by TEXT NOT NULL,
      added_at INTEGER NOT NULL,
      PRIMARY KEY (session_key, identity_id),
      FOREIGN KEY (session_key) REFERENCES session_nodes(session_key) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_members_new (session_key, identity_id, added_by, added_at)
    SELECT m.session_key, m.identity_id, m.added_by, m.added_at
    FROM session_members AS m
    INNER JOIN session_nodes AS n ON n.session_key = m.session_key;
    DROP TABLE session_members;
    ALTER TABLE session_members_new RENAME TO session_members;
  `);
}
function rebuildTranscriptIndexState(db) {
	const columns = readSqliteTableColumns(db, "session_transcript_index_state");
	if (!columns) return;
	db.exec(`
    DROP TABLE IF EXISTS session_transcript_index_state_new;
    CREATE TABLE session_transcript_index_state_new (
      session_id TEXT NOT NULL PRIMARY KEY,
      indexed_seq INTEGER NOT NULL,
      leaf_event_id TEXT,
      needs_rebuild INTEGER NOT NULL DEFAULT 0,
      active_event_count INTEGER NOT NULL DEFAULT 0,
      active_message_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (session_id) REFERENCES session_windows(session_id) ON DELETE CASCADE
    ) STRICT;
    INSERT INTO session_transcript_index_state_new (
      session_id, indexed_seq, leaf_event_id, needs_rebuild,
      active_event_count, active_message_count, updated_at
    )
    SELECT
      i.session_id,
      i.indexed_seq,
      ${migratedSessionColumn(columns, "leaf_event_id", "NULL")},
      ${migratedSessionColumn(columns, "needs_rebuild", "0")},
      ${migratedSessionColumn(columns, "active_event_count", "0")},
      ${migratedSessionColumn(columns, "active_message_count", "0")},
      i.updated_at
    FROM session_transcript_index_state AS i
    INNER JOIN session_windows AS w ON w.session_id = i.session_id;
    DROP TABLE session_transcript_index_state;
    ALTER TABLE session_transcript_index_state_new RENAME TO session_transcript_index_state;
  `);
}
/** Replace split entry/route roots with logical nodes and generation windows. */
function migrateSessionNodesAndWindows(db, previousVersion) {
	if (previousVersion >= SESSION_NODE_SCHEMA_VERSION || !readSqliteTableColumns(db, "sessions")) return;
	createSessionNodes(db);
	backfillSessionNodes(db);
	migrateSessionWindows(db);
	renameTranscriptRewriteWatermarks(db);
	rebuildBoardTabs(db);
	rebuildHeartbeatOutcomes(db);
	rebuildSessionMembers(db);
	rebuildTranscriptIndexState(db);
	db.exec(`
    DROP TABLE IF EXISTS session_routes;
    DROP TABLE IF EXISTS session_entries;
  `);
}
//#endregion
//#region src/state/openclaw-agent-session-snapshots-migration.ts
/** The existing schema owner holds maintenance authority and the outer write transaction. */
function migrateSessionEntrySnapshotsInTransaction(database) {
	database.exec("ALTER TABLE session_nodes ADD COLUMN snapshot_revision INTEGER NOT NULL DEFAULT 0");
	database.exec(sessionEntrySnapshotsSchemaSql(OPENCLAW_AGENT_SCHEMA_SQL));
	const db = getNodeSqliteKysely(database);
	const select = db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"updated_at",
		"entry_json"
	]).orderBy("session_key").limit(64);
	const selectAfter = prepareSqliteQuerySync(database, (parameter) => select.where("session_key", ">", parameter((key) => key)));
	const insert = prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_entry_snapshots").values({
		session_key: parameter((row) => row.sessionKey),
		field: parameter((row) => row.field),
		value_json: parameter((row) => row.valueJson)
	}));
	const update = prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_json: parameter((row) => row.entryJson) }).where("session_key", "=", parameter((row) => row.sessionKey)));
	const markValid = prepareSqliteQuerySync(database, (parameter) => db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", parameter((key) => key)));
	let after;
	while (true) {
		const { rows } = after === void 0 ? executeSqliteQuerySync(database, select) : selectAfter(after);
		if (rows.length === 0) return;
		renewAgentDatabaseMaintenanceAuthorityIfPresent();
		for (const row of rows) {
			if (typeof row.session_key !== "string" || typeof row.current_session_id !== "string" || typeof row.updated_at !== "number" || typeof row.entry_json !== "string") throw new Error("Unreadable session row during snapshot migration");
			after = row.session_key;
			const entry = parseSqliteSessionEntryRecord({
				current_session_id: row.current_session_id,
				updated_at: row.updated_at,
				entry_json: row.entry_json
			});
			if (!entry) continue;
			const { entryJson, snapshots } = splitSessionEntrySnapshots(entry);
			if (snapshots.length === 0) continue;
			for (const snapshot of snapshots) insert({
				sessionKey: row.session_key,
				...snapshot
			});
			update({
				entryJson,
				sessionKey: row.session_key
			});
			markValid(row.session_key);
		}
	}
}
//#endregion
//#region src/state/openclaw-agent-transcript-payload-migration.ts
const MIGRATION_TABLE = "transcript_events_payload_migration";
const KNOWN_CHILDREN = /* @__PURE__ */ new Set(["transcript_event_identities", "session_transcript_active_events"]);
function assertTranscriptRebuildInputs(database) {
	assertSqliteSchemaContains(database, "transcript payload migration", extractSqliteTableSchema(withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL), "transcript_events"));
	const columns = database.prepare("PRAGMA table_xinfo(transcript_events)").all();
	const expectedColumns = /* @__PURE__ */ new Set([
		"session_id",
		"seq",
		"event_json",
		"created_at"
	]);
	if (columns.length !== expectedColumns.size || columns.some((column) => typeof column.name !== "string" || !expectedColumns.has(column.name))) throw new Error("Transcript payload migration cannot discard unknown columns");
	if (database.prepare(`SELECT name FROM sqlite_schema
      WHERE (type IN ('trigger', 'index') AND tbl_name = 'transcript_events' AND sql IS NOT NULL)
         OR (type IN ('view', 'trigger') AND sql LIKE '%transcript_events%')`).all().length > 0) throw new Error("Transcript payload migration cannot rebuild unknown indexes, views, or triggers");
	if (database.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get(MIGRATION_TABLE)) throw new Error("Transcript payload migration table already exists");
	for (const table of database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table'").all()) {
		if (typeof table.name !== "string") throw new Error("Invalid table name during transcript payload migration");
		if (KNOWN_CHILDREN.has(table.name)) continue;
		if (database.prepare(`PRAGMA foreign_key_list(${quoteSqliteIdentifier(table.name)})`).all().some((key) => key.table === "transcript_events")) throw new Error("Transcript payload migration cannot rebuild an unknown foreign-key target");
	}
}
/** Convert original bytes under the admitted agent migration; never hydrate oversized identity rows. */
function migrateTranscriptPayloadStorageInTransaction(database) {
	if (!database.isTransaction || database.prepare("PRAGMA foreign_keys").get()?.foreign_keys !== 0) throw new Error("Transcript payload migration requires an admitted transaction with foreign keys off");
	assertTranscriptRebuildInputs(database);
	const utf8 = database.prepare("PRAGMA encoding").get()?.encoding === "UTF-8";
	const decoder = new TextDecoder("utf-8", {
		fatal: true,
		ignoreBOM: true
	});
	const codec = resolveZstdCodec();
	database.exec(extractSqliteTableSchema(OPENCLAW_AGENT_SCHEMA_SQL, "transcript_events").replace("IF NOT EXISTS transcript_events", MIGRATION_TABLE));
	const copyIdentity = database.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, event_json, created_at, NULL,
           CASE WHEN ? THEN octet_length(event_json) ELSE NULL END, ?
    FROM transcript_events WHERE rowid = ?`);
	const copyCompressed = database.prepare(`
    INSERT INTO ${MIGRATION_TABLE}
      (rowid, session_id, seq, event_json, created_at, event_zstd, event_utf8_bytes, navigation_json)
    SELECT rowid, session_id, seq, NULL, created_at, ?, ?, ?
    FROM transcript_events WHERE rowid = ?`);
	copyIdentity.setReadBigInts(true);
	copyCompressed.setReadBigInts(true);
	const readBytes = database.prepare("SELECT CAST(event_json AS BLOB) AS bytes FROM transcript_events WHERE rowid = ?");
	const metadata = database.prepare("SELECT rowid AS storage_rowid, octet_length(event_json) AS bytes FROM transcript_events ORDER BY rowid");
	metadata.setReadBigInts(true);
	let renewedAt = performance.now();
	for (const row of metadata.iterate()) {
		if (performance.now() - renewedAt >= 1e3) {
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			renewedAt = performance.now();
		}
		if (typeof row.storage_rowid !== "bigint" || typeof row.bytes !== "bigint") throw new Error("Invalid transcript storage identity during migration");
		let navigation = null;
		let copied = false;
		if (utf8 && row.bytes <= BigInt(4194304)) {
			const bytes = readBytes.get(row.storage_rowid)?.bytes;
			if (!(bytes instanceof Uint8Array)) throw new Error("Transcript payload disappeared during migration");
			let text;
			try {
				text = decoder.decode(bytes);
			} catch {}
			if (text !== void 0) {
				const payload = prepareTranscriptPayload(database, text);
				navigation = payload.navigation_json;
				if (payload.event_zstd !== null) {
					if (!codec || payload.event_utf8_bytes === null || !codec.decompress(payload.event_zstd, payload.event_utf8_bytes).equals(bytes)) throw new Error("Transcript compression did not preserve canonical bytes");
					const result = copyCompressed.run(payload.event_zstd, payload.event_utf8_bytes, navigation, row.storage_rowid);
					if (Number(result.changes) !== 1) throw new Error("Transcript payload disappeared before migration publication");
					copied = true;
				}
			}
		}
		if (!copied && Number(copyIdentity.run(utf8 ? 1 : 0, navigation, row.storage_rowid).changes) !== 1) throw new Error("Transcript identity payload disappeared before migration publication");
	}
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	database.exec(`DROP TABLE transcript_events;
    ALTER TABLE ${MIGRATION_TABLE} RENAME TO transcript_events;`);
}
//#endregion
//#region src/state/openclaw-agent-db-schema.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
function migrateMemoryChunkMetadataSchema(db) {
	ensureMemoryRecallMetadataSchema(db);
	ensureMemoryChunkProvenance(db);
}
function* agentDatabaseIntegrityBeforeMutationSteps(database, agentId, pathname, diagnostics, verification, reuseRuntimeIntegrity = false, runtimeAdmission = false) {
	database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
	const userVersion = readSqliteUserVersion(database);
	const hasApplicationSchema = database.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
	const migrationPending = userVersion === 0 && hasApplicationSchema !== void 0 || userVersion > 0 && userVersion < 24;
	if (migrationPending) agentDbLog.info("agent database schema migration pending; verifying integrity first", {
		fromVersion: userVersion,
		path: pathname,
		toVersion: 24
	});
	const hasPendingCurrentVersionMigration = userVersion === 24 && hasPendingCurrentVersionAgentDatabaseMigration(database);
	if (userVersion === 24 && !hasPendingCurrentVersionMigration) {
		const startedAt = performance.now();
		const reuseIntegrity = reuseRuntimeIntegrity || canReuseOpenClawAgentIntegrityVerification(pathname, verification, migrationPending || hasPendingCurrentVersionMigration);
		const rebuiltIndexes = yield* verifyAndRepairCanonicalSqliteIndexSteps(database, pathname, OPENCLAW_AGENT_SCHEMA_SQL, {
			allowMissingColumns: true,
			validateAfterRepair: () => assertOpenClawAgentCurrentRuntimeSchema(database, {
				agentId,
				pathname
			}),
			diagnostics,
			integrityTables: runtimeAdmission && !reuseIntegrity ? [{ name: "sqlite_schema" }, ...database.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name").all()].map(({ name }) => ({
				table: String(name),
				check: name === "transcript_events" ? "quick_check" : "integrity_check"
			})) : void 0,
			reuseIntegrity
		});
		if (rebuiltIndexes.length > 0) agentDbLog.warn(`Rebuilt canonical agent SQLite indexes for ${agentId} (${pathname}): ${rebuiltIndexes.join(", ")}`, {
			agentId,
			path: pathname,
			indexes: rebuiltIndexes,
			elapsedMs: Math.floor(performance.now() - startedAt)
		});
		assertOpenClawAgentCurrentRuntimeSchema(database, {
			agentId,
			pathname
		});
	} else if (userVersion === 0 && !hasApplicationSchema && database.prepare("PRAGMA page_count").get()?.page_count === 0) assertSqliteIntegrity(database, pathname);
	else yield* sqliteIntegrityCheckSteps(database, pathname, diagnostics);
	return hasPendingCurrentVersionMigration;
}
function seedCanonicalSessionValidationPending(db) {
	db.exec(`
    INSERT INTO session_canonical_validation_pending (session_key)
    SELECT node.session_key FROM session_nodes AS node
    WHERE NOT EXISTS (
      SELECT 1 FROM session_canonical_validation_pending AS pending
      WHERE pending.session_key = node.session_key
    );
  `);
}
function migrateAgentStorageInTransaction(db, schemaSql, previousVersion, warnings) {
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	if (previousVersion === 22) migrateDeployedTranscriptFtsRowsInTransaction(db, schemaSql);
	else if (db.prepare("SELECT 1 FROM sqlite_schema WHERE name = ?").get("session_transcript_fts_rows")) throw new Error("Transcript FTS row map already exists before the schema-23 storage migration.");
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateTranscriptPayloadStorageInTransaction(db);
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateMemoryIndexStorage(db, {
		renewAuthority: renewAgentDatabaseMaintenanceAuthorityIfPresent,
		onWarning: (warning) => warnings.push(warning)
	});
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	migrateSessionCostUsageRollupStorage(db, renewAgentDatabaseMaintenanceAuthorityIfPresent);
	renewAgentDatabaseMaintenanceAuthorityIfPresent();
	db.exec(schemaSql);
	if (previousVersion !== 22) db.exec(`
    INSERT INTO session_transcript_fts_rows (id, session_id, message_id)
    SELECT rowid, session_id, message_id FROM session_transcript_fts;
  `);
}
function finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, requiresMaintenance, assertMigration) {
	repairCanonicalSqliteIndexes(db, pathname, schemaSql, { verifyPhysicalIntegrity: false });
	db.exec(`PRAGMA user_version = ${targetVersion};`);
	persistAgentSchemaMetadata(db, agentId, targetVersion);
	assertAgentSchemaVersion(db, {
		agentId,
		pathname,
		version: targetVersion
	}, schemaSql);
	if (requiresMaintenance && db.prepare("PRAGMA foreign_key_check").all().length > 0) throw new Error(`Agent schema migration failed foreign key validation for ${pathname}.`);
	assertMigration();
}
function ensureAgentSchema(db, agentId, pathname, targetVersion = 24, withMutation = (run) => run(), onMigrationWarning) {
	const warnings = [];
	const schemaSql = getOpenClawAgentMigrationSchema(targetVersion);
	const originalVersion = readSqliteUserVersion(db);
	const schemaMigration = originalVersion < targetVersion && (originalVersion > 0 || readExistingAgentSchemaMeta(db) !== null);
	const identityMigration = targetVersion >= 18 && schemaMigration;
	const assertMigration = () => {
		if (!schemaMigration) return;
		if (identityMigration) assertAgentDatabaseMaintenanceAuthority();
		getOpenClawDatabaseMaintenanceScope()?.assertAgentSchemaMigration({
			agentId,
			path: pathname,
			foundVersion: originalVersion,
			supportedVersion: targetVersion
		});
	};
	assertMigration();
	db.exec("PRAGMA foreign_keys = OFF; PRAGMA legacy_alter_table = OFF;");
	try {
		const mutate = () => {
			assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
			assertSupportedAgentSchemaVersion(db, pathname);
			const previousVersion = readSqliteUserVersion(db);
			if (identityMigration && readExistingAgentSchemaMeta(db)?.schemaVersion !== previousVersion) throw new Error(`Agent schema markers disagree for ${pathname}; repair ownership metadata before migration.`);
			if (previousVersion > targetVersion) throw new Error(`OpenClaw agent database ${pathname} uses schema version ${previousVersion}; expected at most ${targetVersion} for this migration.`);
			if (previousVersion < targetVersion) assertSupportedAgentMigrationSchemas(db, pathname, previousVersion);
			const isEmptyDatabase = previousVersion === 0 && readExistingAgentSchemaMeta(db) === null && !db.prepare("SELECT 1 FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' LIMIT 1").get();
			const requiresStorageMigration = !isEmptyDatabase && previousVersion < 23 && targetVersion >= 23;
			const requiresSnapshotMigration = !isEmptyDatabase && previousVersion < 24 && targetVersion >= 24;
			const storageSchemaSql = requiresSnapshotMigration ? withoutSessionEntrySnapshotsSchema(schemaSql) : schemaSql;
			const migrationSchemaSql = requiresStorageMigration ? withLegacyAgentStorageSchema(storageSchemaSql, previousVersion) : storageSchemaSql;
			if (previousVersion < targetVersion && previousVersion >= 20 && previousVersion < 24 && targetVersion >= 21) {
				if (previousVersion >= 21) {
					migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion);
					ensureSessionAdditiveColumns(db);
					ensureSessionEntryValidityProjection(db);
					ensureSessionKeyContractSchemaInTransaction(db);
					if (hasPendingMemoryChunkMetadataMigration(db)) migrateMemoryChunkMetadataSchema(db);
				}
				const previousSchema = previousVersion < 21 ? withoutCanonicalSessionValidationSchema(migrationSchemaSql) : migrationSchemaSql;
				repairCanonicalSqliteIndexes(db, pathname, previousSchema, { verifyPhysicalIntegrity: false });
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: previousVersion
				}, previousSchema);
				if (previousVersion < 21) {
					db.exec(canonicalSessionValidationSchemaSql(migrationSchemaSql));
					seedCanonicalSessionValidationPending(db);
				}
				if (requiresStorageMigration) migrateAgentStorageInTransaction(db, storageSchemaSql, previousVersion, warnings);
				if (requiresSnapshotMigration) migrateSessionEntrySnapshotsInTransaction(db);
				finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, identityMigration, assertMigration);
				return;
			}
			if (previousVersion === 17) {
				const legacySql = withLegacySessionParticipantsSchema(withLegacyAgentStorageSchema(OPENCLAW_AGENT_SCHEMA_SQL));
				ensureSessionAdditiveColumns(db);
				verifyAndRepairCanonicalSqliteIndexes(db, pathname, legacySql, { validateAfterRepair: () => {
					assertAgentSchemaVersion(db, {
						agentId,
						pathname,
						version: 17
					}, legacySql);
				} });
			}
			migrateRetiredAgentStateLeaseSchema(db, pathname, targetVersion);
			if (previousVersion === targetVersion) {
				ensureSessionAdditiveColumns(db);
				ensureSessionEntryValidityProjection(db);
				ensureSessionKeyContractSchemaInTransaction(db);
				ensureSessionReactionsSchemaInTransaction(db);
				if (hasPendingMemoryChunkMetadataMigration(db)) {
					migrateMemoryChunkMetadataSchema(db);
					db.exec(schemaSql);
				}
				repairCanonicalSqliteIndexes(db, pathname, schemaSql, { verifyPhysicalIntegrity: false });
				persistAgentSchemaMetadata(db, agentId, targetVersion);
				assertAgentSchemaVersion(db, {
					agentId,
					pathname,
					version: targetVersion
				}, schemaSql);
				assertAgentDatabaseMaintenanceAuthorityIfPresent();
				return;
			} else if (previousVersion === 14) repairAndAssertOpenClawAgentV14SchemaForMigration(db, {
				agentId,
				pathname
			});
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			migrateMemoryIndexSourcesIdentity(db);
			migrateOpenClawAgentSchema(db);
			migrateConversationDeliveryTargetColumn(db);
			if (previousVersion < 11) backfillSessionConversations(db);
			migrateSessionNodesAndWindows(db, previousVersion);
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			ensureSessionAdditiveColumns(db);
			ensureSessionEntryValidityProjection(db);
			if (targetVersion >= 18 && previousVersion < 18) migrateSessionParticipantsSchema(db, pathname);
			if (targetVersion >= 19) migrateSessionCreatorNamespaces(db, previousVersion);
			renewAgentDatabaseMaintenanceAuthorityIfPresent();
			db.exec(migrationSchemaSql);
			migrateMemoryChunkMetadataSchema(db);
			if (previousVersion < targetVersion) ensureOpenClawAgentBoardSchemaInTransaction(db);
			migrateSessionTranscriptGenerations(db, previousVersion);
			migrateSessionTranscriptActiveProjection(db, previousVersion);
			if (previousVersion < 11) migrateSqliteSchemaToStrictInTransaction(db, migrationSchemaSql, { databaseLabel: pathname });
			if (previousVersion < 21 && targetVersion >= 21) seedCanonicalSessionValidationPending(db);
			if (requiresStorageMigration) migrateAgentStorageInTransaction(db, storageSchemaSql, previousVersion, warnings);
			if (requiresSnapshotMigration) migrateSessionEntrySnapshotsInTransaction(db);
			finishAgentSchemaMigration(db, agentId, pathname, targetVersion, schemaSql, identityMigration, assertMigration);
		};
		runSqliteImmediateTransactionSync(db, () => withMutation(mutate), {
			databaseLabel: pathname,
			operationLabel: "agent.schema.ensure",
			withCommit: withMutation
		});
	} finally {
		if (db.isOpen) db.exec("PRAGMA foreign_keys = ON;");
	}
	for (const warning of warnings) {
		const message = `Agent ${agentId}: ${warning}`;
		agentDbLog.warn(message);
		onMigrationWarning?.(message);
	}
}
/** Initialize agent schema/ownership metadata on an independently managed connection. */
function ensureOpenClawAgentDatabaseSchema(db, options) {
	runSqliteIntegrityOperationSync(ensureOpenClawAgentDatabaseSchemaSteps(db, options));
}
/** Share one schema sequence between synchronous callers and leased maintenance. */
function* ensureOpenClawAgentDatabaseSchemaSteps(db, options) {
	const agentId = normalizeAgentId(options.agentId);
	const databaseOptions = {
		...options,
		agentId
	};
	const pathname = resolveOpenClawAgentSqlitePath(databaseOptions);
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
	const version = assertSupportedAgentSchemaVersion(db, pathname);
	if (version < 24) assertSupportedAgentMigrationSchemas(db, pathname, version);
	const deletionFence = databaseOptions.register === true && isPersistentOpenClawAgentDatabasePath(pathname, databaseOptions.env) ? prepareAgentDeletionPathFence({
		agentId,
		path: pathname
	}, { env: databaseOptions.env }, "maintenance") : void 0;
	const withRegistrationFence = (run) => {
		if (!deletionFence) return run();
		return runOpenClawStateWriteTransaction((database) => {
			assertAgentDeletionRecoveryAllowsMutation(database, pathname);
			assertAgentDeletionPathFence(database, deletionFence);
			return run();
		}, {
			env: databaseOptions.env,
			initializationAgentPaths: [pathname]
		});
	};
	withRegistrationFence(() => void 0);
	if (db.location()) invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname, databaseOptions.env);
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
	assertSupportedAgentSchemaVersion(db, pathname);
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
	const withIntegrityMutation = (run) => deletionFence ? runSqliteImmediateTransactionSync(db, () => withRegistrationFence(run), {
		databaseLabel: pathname,
		operationLabel: "agent.schema.integrity",
		withCommit: withRegistrationFence
	}) : run();
	if (readSqliteUserVersion(db) !== 17) {
		const integrity = agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname);
		try {
			let step = withIntegrityMutation(() => integrity.next());
			while (!step.done) {
				let failure;
				try {
					yield step.value;
				} catch (error) {
					failure = { error };
				}
				step = withIntegrityMutation(() => failure ? integrity.throw(failure.error) : integrity.next());
			}
		} finally {
			integrity.return(false);
		}
	}
	configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
	ensureAgentSchema(db, agentId, pathname, 24, withRegistrationFence, options.onMigrationWarning);
	ensureOpenClawAgentDatabasePermissions(pathname, databaseOptions);
	if (databaseOptions.register === true) registerOpenClawAgentDatabase({
		agentId,
		path: pathname,
		env: databaseOptions.env
	});
}
/** Upgrade older owned databases to the structural schema required by the media cutover. */
function* migrateOpenClawAgentDatabaseToMediaPrerequisiteSchemaSteps(db, options) {
	const targetVersion = 16;
	if (readSqliteUserVersion(db) > targetVersion) return;
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(db), agentId, pathname);
	assertSupportedAgentMigrationSchemas(db, pathname, readSqliteUserVersion(db));
	if (db.location()) invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname, options.env);
	yield* agentDatabaseIntegrityBeforeMutationSteps(db, agentId, pathname);
	configureSqlitePreSchemaPragmas(db, { busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS });
	ensureAgentSchema(db, agentId, pathname, targetVersion);
}
//#endregion
export { migrateOpenClawAgentDatabaseToMediaPrerequisiteSchemaSteps as a, withSqliteIntegrityWorkerScope as c, ensureOpenClawAgentDatabaseSchemaSteps as i, SqliteIntegrityWorkerInterruptedError as l, ensureAgentSchema as n, ensureOpenClawAgentDatabasePermissions as o, ensureOpenClawAgentDatabaseSchema as r, assertSqliteIntegrityInWorker as s, agentDatabaseIntegrityBeforeMutationSteps as t };

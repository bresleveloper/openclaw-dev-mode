import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { c as readSourceJournalMode, l as readSourceSidecars, s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { a as isSqliteLockError, p as withSqliteNativeOpen } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { o as runWithSqliteCleanup, r as OpenClawStateOwnershipMetadataError, t as OpenClawStateExternalOwnershipError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as getStateDatabaseSchemaLease, i as assertStateDatabaseAccessAllowed, r as acquireStateDatabaseSchemaLease, t as GatewayStateOwnerContentionError } from "./gateway-state-owner-DmHycK5o.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DCJaEqeS.mjs";
import { t as withSqliteSourceReadDatabase } from "./sqlite-source-handle-CLpCZnZK.mjs";
import { o as createSqliteReadOnlyWorkerError } from "./sqlite-readonly-worker-session-DK-j16po.mjs";
import { l as runOneShotSqliteInspection, u as runScopedSqliteInspection } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-BpllCelk.mjs";
import { n as prepareSqliteReadOnlyLocationSync, t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { i as quarantineOrphanedSqliteSidecars, n as hasOrphanedSqliteSidecars } from "./sqlite-files-BEC3zbaw.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { a as requestSqliteWorkerSchemaMaintenance } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/infra/state-database-maintenance.ts
const StateSchemaMutationConflictError = resolveGlobalSingleton(Symbol.for("openclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends Error {
	constructor(databasePath, cause) {
		super(`OpenClaw refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, { cause });
		this.name = "StateSchemaMutationConflictError";
	}
});
/** Ordinary transactions use SQLite; schema changes retain the installation's process owner. */
function withStateDatabaseSchemaMaintenance({ databasePath, busyTimeoutMs }, operation) {
	if (requestSqliteWorkerSchemaMaintenance(databasePath)) return operation();
	const canonical = resolveIdentityPathViaExistingAncestorSync(databasePath);
	const inherited = getStateDatabaseSchemaLease(canonical);
	if (inherited) {
		inherited.assertCurrent();
		return operation();
	}
	let lease;
	try {
		lease = acquireStateDatabaseSchemaLease(canonical, { busyTimeoutMs });
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) throw new StateSchemaMutationConflictError(canonical, error);
		throw error;
	}
	return runWithSqliteCleanup(lease, "state schema mutation", () => lease.run(operation));
}
//#endregion
//#region src/state/openclaw-state-ownership-worker.ts
function readOwnershipWorkerReply(stdout, stderr) {
	let reply;
	try {
		reply = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid ownership JSON", stderr);
	}
	if (!isRecord(reply) || Object.keys(reply).length !== 2 || typeof reply.ok !== "boolean") throw createSqliteReadOnlyWorkerError("returned an invalid ownership result", stderr);
	if (reply.ok && typeof reply.ownershipJson === "string") return reply.ownershipJson;
	if (!reply.ok && "workerError" in reply) {
		const error = /* @__PURE__ */ new Error("Shared-state ownership inspection failed");
		retainOpenClawStateWorkerErrorPayload(error, reply.workerError);
		throw hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
	}
	throw createSqliteReadOnlyWorkerError("returned an invalid ownership result", stderr);
}
/** Read live ownership in a child so closing the reader cannot release this process's locks. */
function inspectOpenClawStateOwnershipWithWorker(databasePath, signal) {
	return runScopedSqliteInspection(signal, (scopedSignal) => {
		scopedSignal?.throwIfAborted();
		const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("stateOwnership"));
		return runOneShotSqliteInspection({
			pathname: databasePath,
			operation: "state ownership",
			argv: [...resolveRuntimeWorkerArgv(moduleUrl), databasePath],
			runtimeGeneration,
			signal: scopedSignal,
			stoppedFailure: "ownership owner stopped",
			read: (output) => {
				scopedSignal?.throwIfAborted();
				if (output.failure) throw createSqliteReadOnlyWorkerError(output.failure, output.stderr);
				return readOwnershipWorkerReply(output.stdout, output.stderr);
			}
		});
	});
}
//#endregion
//#region src/state/openclaw-state-ownership.ts
const STATE_SUPERVISION_KEY = "gateway.supervision";
const MAX_OWNERSHIP_TIMESTAMP_MS = 864e13;
const MANAGER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
function isOpenClawStateWriteContentionError(error) {
	return error instanceof GatewayStateOwnerContentionError || error instanceof StateSchemaMutationConflictError || isSqliteLockError(error);
}
function normalizeOpenClawStateManagerId(managerId) {
	const normalized = managerId.trim();
	if (!MANAGER_ID_PATTERN.test(normalized)) throw new Error("External state ownership manager id must be a 1-128 character ASCII identifier.");
	return normalized;
}
function parseExternalOwnership(valueJson, databasePath) {
	let value;
	try {
		value = JSON.parse(valueJson);
	} catch {
		throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not valid JSON");
	}
	const record = isRecord(value) ? value : void 0;
	const keys = record ? Object.keys(record).toSorted().join(",") : "";
	const managerId = record?.managerId;
	const claimedAt = record?.claimedAt;
	if (keys !== "claimedAt,managerId,mode,version" || record?.version !== 1 || record?.mode !== "external" || typeof managerId !== "string" || !MANAGER_ID_PATTERN.test(managerId) || typeof claimedAt !== "number" || !Number.isSafeInteger(claimedAt) || claimedAt < 0 || claimedAt > MAX_OWNERSHIP_TIMESTAMP_MS) throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value does not match the version 1 external ownership contract");
	return {
		version: 1,
		mode: "external",
		managerId,
		claimedAt
	};
}
/** Inspect the reserved ownership row without entering the shared-state lifecycle. */
function inspectOpenClawStateOwnershipFromDatabase(database, databasePath, configMachineStateTableReady = false) {
	try {
		if (!configMachineStateTableReady && !tableExists(database, "config_machine_state")) return null;
		const ownershipSql = configMachineStateTableReady ? "SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1" : "SELECT value_json FROM config_machine_state NOT INDEXED WHERE state_key = ? LIMIT 1";
		const row = database.prepare(ownershipSql).get(STATE_SUPERVISION_KEY);
		if (!row) return null;
		if (typeof row.value_json !== "string") throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not text");
		return parseExternalOwnership(row.value_json, databasePath);
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, databasePath);
	}
}
function inspectOwnershipThroughConnection(location, databasePath, openStateSchemaReadAdmission) {
	const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location, { readOnly: true }));
	let closeAdmission;
	try {
		closeAdmission = openStateSchemaReadAdmission?.(database);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;`);
		return inspectOpenClawStateOwnershipFromDatabase(database, databasePath);
	} finally {
		try {
			closeAdmission?.();
		} finally {
			database.close();
		}
	}
}
/** Inspect one resolved state database path without mutating its state tree. */
function inspectOpenClawStateOwnershipAtPath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	if (!existsSync(resolvedPath)) return null;
	const prepared = prepareSqliteReadOnlyLocationSync(resolvedPath);
	try {
		return inspectOwnershipThroughConnection(prepared.location, resolvedPath);
	} finally {
		prepared.cleanup();
	}
}
/** Runs only in an isolated child: closing a source must not release a live writer's locks. */
function inspectOpenClawStateOwnershipInProcess(databasePath) {
	const sidecars = readSourceSidecars(databasePath);
	if (readSourceJournalMode(databasePath) === "wal" && sidecars.wal && sidecars.shm && !sidecars.journal) return withSqliteSourceReadDatabase(databasePath, "source", (database) => {
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;`);
		return runSqliteDeferredTransactionSync(database, () => inspectOpenClawStateOwnershipFromDatabase(database, databasePath));
	});
	const prepared = prepareSqliteReadOnlyLocationSyncInProcess(databasePath);
	try {
		return inspectOwnershipThroughConnection(prepared.location, databasePath);
	} finally {
		prepared.cleanup();
	}
}
function assertOwnershipAllowsWrite(status, databasePath, env) {
	if (status && !isGatewayExternallySupervised(env)) throw new OpenClawStateExternalOwnershipError(databasePath, status.managerId);
}
/** Check write admission; callers may defer orphan-sidecar recovery until mutation is certain. */
async function assertOpenClawStateWriteAllowedAtPath(options) {
	options.signal?.throwIfAborted();
	const databasePath = path.resolve(options.databasePath);
	assertStateDatabaseAccessAllowed(databasePath);
	if (options.recoverOrphanedSidecars !== false && hasOrphanedSqliteSidecars(databasePath)) withStateDatabaseSchemaMaintenance({ databasePath }, () => quarantineOrphanedSqliteSidecars(databasePath));
	if (!existsSync(databasePath)) return;
	const env = options.env ?? process.env;
	if (!options.openStateSchemaReadAdmission && !getOpenClawDatabaseMaintenanceScope() && !getStateDatabaseSchemaLease(databasePath)) {
		const ownershipJson = await inspectOpenClawStateOwnershipWithWorker(databasePath, options.signal);
		options.signal?.throwIfAborted();
		assertStateDatabaseAccessAllowed(databasePath);
		assertOwnershipAllowsWrite(ownershipJson === "null" ? null : parseExternalOwnership(ownershipJson, databasePath), databasePath, env);
		return;
	}
	const prepared = await prepareSqliteReadOnlyLocation(databasePath, {
		preserveSourceArtifacts: true,
		signal: options.signal
	});
	try {
		options.signal?.throwIfAborted();
		assertStateDatabaseAccessAllowed(databasePath);
		assertOwnershipAllowsWrite(inspectOwnershipThroughConnection(prepared.location, databasePath, options.openStateSchemaReadAdmission), databasePath, env);
	} finally {
		await prepared.cleanupAsync();
	}
}
/** Fence shared-state writes once an external manager has claimed ownership. */
function assertOpenClawStateWriteAllowed(options) {
	const resolvedPath = path.resolve(options.databasePath);
	assertStateDatabaseAccessAllowed(resolvedPath);
	assertOwnershipAllowsWrite(inspectOpenClawStateOwnershipFromDatabase(options.database, resolvedPath, options.schemaReady), resolvedPath, options.env ?? process.env);
}
//#endregion
export { inspectOpenClawStateOwnershipFromDatabase as a, normalizeOpenClawStateManagerId as c, inspectOpenClawStateOwnershipAtPath as i, StateSchemaMutationConflictError as l, assertOpenClawStateWriteAllowed as n, inspectOpenClawStateOwnershipInProcess as o, assertOpenClawStateWriteAllowedAtPath as r, isOpenClawStateWriteContentionError as s, STATE_SUPERVISION_KEY as t, withStateDatabaseSchemaMaintenance as u };

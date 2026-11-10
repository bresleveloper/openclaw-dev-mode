import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as OpenClawStateOwnershipMetadataError, t as OpenClawStateExternalOwnershipError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { t as GatewayStateOwnerContentionError } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { c as getStateDatabaseSchemaLease, r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as captureRuntimeWorkerSource } from "./runtime-worker-generation-DvW-aFj2.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { a as isSqliteLockError, p as withSqliteNativeOpen } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { l as runOneShotSqliteInspection, u as runScopedSqliteInspection } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { i as deferSqliteSnapshotCleanupAfterRead } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { a as createSqliteReadOnlyWorkerError } from "./sqlite-readonly-worker-session-Bq0RBm36.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { c as readSourceJournalMode, l as readSourceSidecars, s as prepareSqliteReadOnlyLocationSyncInProcess } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { t as withSqliteSourceReadDatabase } from "./sqlite-source-handle-BWHiHQXK.mjs";
import { i as prepareSqliteReadOnlyLocationSync, n as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-DmM7omMC.mjs";
import { i as quarantineOrphanedSqliteSidecars, n as hasOrphanedSqliteSidecars } from "./sqlite-files-N5UzY_DG.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { n as withStateDatabaseSchemaMaintenance, t as StateSchemaMutationConflictError } from "./state-database-maintenance-DQhfapFw.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
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
const ownershipAdmission = {
	name: "state.external-ownership",
	read(value) {
		if (value === null) return null;
		if (isRecord(value) && value.version === 1 && value.mode === "external" && typeof value.managerId === "string" && typeof value.claimedAt === "number") return {
			version: 1,
			mode: "external",
			managerId: value.managerId,
			claimedAt: value.claimedAt
		};
	}
};
/** The ownership writer publishes at its outer commit; lease loss remains a live authority check. */
function publishOpenClawStateOwnership(database, ownership) {
	publishSqliteDatabaseAdmission(database, ownershipAdmission, { ...ownership });
}
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
		const ownershipSql = configMachineStateTableReady || isPostgresSqlConnection(database) ? "SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1" : "SELECT value_json FROM config_machine_state NOT INDEXED WHERE state_key = ? LIMIT 1";
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
		return runSqliteDeferredTransactionSync(database, () => inspectOpenClawStateOwnershipFromDatabase(database, databasePath), { operationLabel: "state.ownership.inspect" });
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
	let readSucceeded = false;
	try {
		options.signal?.throwIfAborted();
		assertStateDatabaseAccessAllowed(databasePath);
		assertOwnershipAllowsWrite(inspectOwnershipThroughConnection(prepared.location, databasePath, options.openStateSchemaReadAdmission), databasePath, env);
		readSucceeded = true;
	} finally {
		await prepared.cleanupAsync().catch((error) => {
			if (!readSucceeded || !deferSqliteSnapshotCleanupAfterRead(error, prepared.cleanupRoot)) throw error;
		});
	}
}
/** Fence shared-state writes once an external manager has claimed ownership. */
function assertOpenClawStateWriteAllowed(options) {
	const resolvedPath = path.resolve(options.databasePath);
	assertStateDatabaseAccessAllowed(resolvedPath);
	let status = options.inspectOwnership ? void 0 : getSqliteDatabaseAdmission(options.database, ownershipAdmission);
	if (status === void 0) {
		const inspected = inspectOpenClawStateOwnershipFromDatabase(options.database, resolvedPath, options.schemaReady);
		status = options.inspectOwnership ? void 0 : getSqliteDatabaseAdmission(options.database, ownershipAdmission);
		if (status === void 0) {
			status = inspected;
			publishSqliteDatabaseAdmission(options.database, ownershipAdmission, status);
		}
	}
	assertOwnershipAllowsWrite(status, resolvedPath, options.env ?? process.env);
}
//#endregion
export { inspectOpenClawStateOwnershipFromDatabase as a, normalizeOpenClawStateManagerId as c, inspectOpenClawStateOwnershipAtPath as i, publishOpenClawStateOwnership as l, assertOpenClawStateWriteAllowed as n, inspectOpenClawStateOwnershipInProcess as o, assertOpenClawStateWriteAllowedAtPath as r, isOpenClawStateWriteContentionError as s, STATE_SUPERVISION_KEY as t };

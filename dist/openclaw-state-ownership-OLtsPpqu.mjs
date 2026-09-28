import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { a as isSqliteLockError, p as withSqliteNativeOpen } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { t as normalizeSqliteNonNegativeInteger } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { i as runWithSqliteCoordinator, n as createSqliteLifecycleAggregateError } from "./sqlite-coordinator-z2lO0ops.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { T as StateDatabaseCoordinatorContentionError, s as acquireStateDatabaseCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { r as prepareSqliteReadOnlyLocationSync, t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-x5nU_jtc.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { r as quarantineOrphanedSqliteSidecars } from "./sqlite-files-eRv24eIu.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-state-ownership.ts
const STATE_SUPERVISION_KEY = "gateway.supervision";
const MAX_OWNERSHIP_TIMESTAMP_MS = 864e13;
const MANAGER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
var OpenClawStateOwnershipError = class extends Error {};
function isOpenClawStateWriteContentionError(error) {
	return error instanceof StateDatabaseCoordinatorContentionError || isSqliteLockError(error);
}
var OpenClawStateOwnershipMetadataError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, message) {
		super(`OpenClaw shared state ownership metadata is invalid at ${databasePath}: ${message}. Repair it with OPENCLAW_SUPERVISOR_MODE=external openclaw database ownership claim --manager <manager-id>.`);
		this.databasePath = databasePath;
		this.name = "OpenClawStateOwnershipMetadataError";
	}
};
var OpenClawStateExternalOwnershipError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, managerId) {
		super(`OpenClaw shared state database ${databasePath} is externally supervised by ${managerId}. Use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external for writable operations.`);
		this.databasePath = databasePath;
		this.managerId = managerId;
		this.name = "OpenClawStateExternalOwnershipError";
	}
};
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
		const row = database.prepare("SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1").get(STATE_SUPERVISION_KEY);
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
function inspectJournalAwarePublicOwnership(databasePath) {
	const prepared = prepareSqliteReadOnlyLocationSync(databasePath);
	try {
		return inspectOwnershipThroughConnection(prepared.location, databasePath);
	} finally {
		prepared.cleanup();
	}
}
function inspectOwnershipWhileCoordinatorHeld(databasePath, busyTimeoutMs, openStateSchemaReadAdmission) {
	const resolvedPath = path.resolve(databasePath);
	if (!existsSync(resolvedPath)) return null;
	const location = resolveExistingSqliteFileUri(resolvedPath);
	const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location));
	let closeAdmission;
	try {
		closeAdmission = openStateSchemaReadAdmission?.(database);
		database.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}; PRAGMA trusted_schema = OFF;`);
		return inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
	} finally {
		try {
			closeAdmission?.();
		} finally {
			database.close();
		}
	}
}
function acquireOpenClawStateOwnershipCoordinator(databasePath, busyTimeoutMs) {
	return acquireStateDatabaseCoordinator({
		databasePath,
		busyTimeoutMs
	});
}
function runWithOpenClawStateOwnershipCoordinator(databasePath, operationLabel, operation) {
	return runWithSqliteCoordinator(acquireOpenClawStateOwnershipCoordinator(databasePath, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS), operationLabel, operation);
}
/** Inspect one resolved state database path without mutating its state tree. */
function inspectOpenClawStateOwnershipAtPath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	if (!existsSync(resolvedPath)) return null;
	return inspectJournalAwarePublicOwnership(resolvedPath);
}
function assertOwnershipAllowsWrite(status, databasePath, env) {
	if (status && !isGatewayExternallySupervised(env)) throw new OpenClawStateExternalOwnershipError(databasePath, status.managerId);
}
/** Fence and hold one path-based mutation until its main-file preamble is complete. */
function acquireOpenClawStateWriteAccess(options) {
	const resolvedPath = path.resolve(options.databasePath);
	const busyTimeoutMs = normalizeSqliteNonNegativeInteger(options.busyTimeoutMs ?? 5e3, "busyTimeoutMs");
	const access = acquireOpenClawStateOwnershipCoordinator(resolvedPath, busyTimeoutMs);
	try {
		quarantineOrphanedSqliteSidecars(resolvedPath);
		assertOwnershipAllowsWrite(inspectOwnershipWhileCoordinatorHeld(resolvedPath, busyTimeoutMs, options.openStateSchemaReadAdmission), resolvedPath, options.env ?? process.env);
		return access;
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			access.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], "state ownership inspection and coordinator release both failed", operationError);
		throw operationError;
	}
}
function runWithOpenClawStateWriteAccess(options, operationLabel, operation) {
	return runWithSqliteCoordinator(acquireOpenClawStateWriteAccess(options), operationLabel, operation);
}
/** Check write admission; callers may defer orphan-sidecar recovery until mutation is certain. */
async function assertOpenClawStateWriteAllowedAtPath(options) {
	options.signal?.throwIfAborted();
	const databasePath = path.resolve(options.databasePath);
	const recoverOrphanedSidecars = options.recoverOrphanedSidecars !== false;
	if (recoverOrphanedSidecars) quarantineOrphanedSqliteSidecars(databasePath);
	if (!existsSync(databasePath)) return;
	const env = options.env ?? process.env;
	if (recoverOrphanedSidecars && isGatewayExternallySupervised(env)) {
		runWithOpenClawStateWriteAccess({
			...options,
			databasePath
		}, "shared state write admission", () => void 0);
		return;
	}
	const prepared = await prepareSqliteReadOnlyLocation(databasePath, {
		preserveSourceArtifacts: true,
		signal: options.signal
	});
	try {
		options.signal?.throwIfAborted();
		assertOwnershipAllowsWrite(inspectOwnershipThroughConnection(prepared.location, databasePath, options.openStateSchemaReadAdmission), databasePath, env);
	} finally {
		await prepared.cleanupAsync();
	}
}
/** Fence shared-state writes once an external manager has claimed ownership. */
function assertOpenClawStateWriteAllowed(options) {
	const resolvedPath = path.resolve(options.databasePath);
	assertOwnershipAllowsWrite(inspectOpenClawStateOwnershipFromDatabase(options.database, resolvedPath, options.schemaReady), resolvedPath, options.env ?? process.env);
}
//#endregion
export { assertOpenClawStateWriteAllowed as a, inspectOpenClawStateOwnershipFromDatabase as c, runWithOpenClawStateOwnershipCoordinator as d, runWithOpenClawStateWriteAccess as f, STATE_SUPERVISION_KEY as i, isOpenClawStateWriteContentionError as l, OpenClawStateOwnershipError as n, assertOpenClawStateWriteAllowedAtPath as o, OpenClawStateOwnershipMetadataError as r, inspectOpenClawStateOwnershipAtPath as s, OpenClawStateExternalOwnershipError as t, normalizeOpenClawStateManagerId as u };

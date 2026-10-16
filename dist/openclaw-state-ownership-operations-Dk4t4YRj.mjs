import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { r as OpenClawStateOwnershipMetadataError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as configureSqliteWalMaintenance } from "./sqlite-wal-DUSYRhyv.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { i as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-DmHycK5o.mjs";
import { b as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import { f as openClawStateDatabaseCache } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as inspectOpenClawStateOwnershipFromDatabase, c as normalizeOpenClawStateManagerId, t as STATE_SUPERVISION_KEY } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
//#region src/state/openclaw-state-ownership-operations.ts
function requireOwnershipCheckpoint(walMaintenance, databasePath) {
	if (!walMaintenance.checkpoint()) throw new Error(`External ownership was committed for ${databasePath}, but its WAL checkpoint failed. Retry the same ownership claim before activating the supervisor.`);
}
function claimOwnershipRow(database, databasePath, managerId, repairMalformed) {
	let current = null;
	try {
		current = inspectOpenClawStateOwnershipFromDatabase(database, databasePath);
	} catch (error) {
		if (!repairMalformed || !(error instanceof OpenClawStateOwnershipMetadataError)) throw error;
	}
	if (current) {
		if (current.managerId !== managerId) throw new Error(`OpenClaw shared state is already claimed by external manager ${current.managerId}; manager ${managerId} cannot replace that durable ownership.`);
		return current;
	}
	const ownership = {
		version: 1,
		mode: "external",
		managerId,
		claimedAt: Date.now()
	};
	const valueJson = JSON.stringify(ownership);
	const stateDb = getNodeSqliteKysely(database);
	executeSqliteQuerySync(database, stateDb.insertInto("config_machine_state").values({
		state_key: STATE_SUPERVISION_KEY,
		value_json: valueJson,
		updated_at_ms: ownership.claimedAt
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: ownership.claimedAt
	})));
	return ownership;
}
function repairMalformedOwnershipClaim(databasePath, managerId) {
	assertStateDatabaseAccessAllowed(databasePath);
	const existing = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(databasePath);
	const database = existing?.db ?? openNodeSqliteDatabase(databasePath);
	let walMaintenance;
	try {
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSqliteIntegrity(database, databasePath);
		assertOpenClawStateDatabaseForMaintenance(database, { pathname: databasePath });
		walMaintenance = existing?.walMaintenance ?? configureSqliteWalMaintenance(database, {
			busyTimeoutMs: 5e3,
			checkpointIntervalMs: 0,
			checkpointMode: "TRUNCATE",
			databaseLabel: "OpenClaw shared state ownership",
			databasePath
		});
		const ownership = runSqliteImmediateTransactionSync(database, () => {
			assertStateDatabaseAccessAllowed(databasePath);
			assertOpenClawStateDatabaseForMaintenance(database, { pathname: databasePath });
			return claimOwnershipRow(database, databasePath, managerId, true);
		}, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			databaseLabel: databasePath,
			operationLabel: "state.ownership.repair"
		});
		requireOwnershipCheckpoint(walMaintenance, databasePath);
		return ownership;
	} finally {
		if (!existing) {
			walMaintenance?.close({ checkpointMode: "PASSIVE" });
			clearNodeSqliteKyselyCacheForDatabase(database);
			database.close();
		}
	}
}
/** Claim durable shared-state write ownership for the active external supervisor. */
function claimOpenClawStateOwnership(managerId, options = {}) {
	const env = options.env ?? process.env;
	if (!isGatewayExternallySupervised(env)) throw new Error("Claiming external shared-state ownership requires OPENCLAW_SUPERVISOR_MODE=external.");
	const normalizedManagerId = normalizeOpenClawStateManagerId(managerId);
	try {
		const database = openOpenClawStateDatabase(options);
		const ownership = runOpenClawStateWriteTransaction(({ db, path: databasePath }) => claimOwnershipRow(db, databasePath, normalizedManagerId, false), {
			...options,
			database
		}, { operationLabel: "state.ownership.claim" });
		requireOwnershipCheckpoint(database.walMaintenance, database.path);
		return ownership;
	} catch (error) {
		if (!(error instanceof OpenClawStateOwnershipMetadataError)) throw error;
		const ownership = repairMalformedOwnershipClaim(resolveDatabasePath(options), normalizedManagerId);
		openOpenClawStateDatabase(options);
		return ownership;
	}
}
//#endregion
export { claimOpenClawStateOwnership };

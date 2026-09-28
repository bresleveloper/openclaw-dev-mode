import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { o as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { i as configureSqliteWalMaintenance } from "./sqlite-wal-BzoPsBh0.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { E as assertOpenClawStateDatabaseForMaintenance, M as resolveDatabasePath } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { c as inspectOpenClawStateOwnershipFromDatabase, d as runWithOpenClawStateOwnershipCoordinator, i as STATE_SUPERVISION_KEY, r as OpenClawStateOwnershipMetadataError, u as normalizeOpenClawStateManagerId } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
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
	return runWithOpenClawStateOwnershipCoordinator(databasePath, "malformed state ownership repair/checkpoint", () => {
		const database = openNodeSqliteDatabase(databasePath);
		let walMaintenance;
		try {
			database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSqliteIntegrity(database, databasePath);
			assertOpenClawStateDatabaseForMaintenance(database, { pathname: databasePath });
			walMaintenance = configureSqliteWalMaintenance(database, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				checkpointIntervalMs: 0,
				checkpointMode: "TRUNCATE",
				databaseLabel: "OpenClaw shared state ownership",
				databasePath
			});
			const ownership = runSqliteImmediateTransactionSync(database, () => {
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
			walMaintenance?.close({ checkpointMode: "PASSIVE" });
			clearNodeSqliteKyselyCacheForDatabase(database);
			database.close();
		}
	});
}
/** Claim durable shared-state write ownership for the active external supervisor. */
function claimOpenClawStateOwnership(managerId, options = {}) {
	const env = options.env ?? process.env;
	if (!isGatewayExternallySupervised(env)) throw new Error("Claiming external shared-state ownership requires OPENCLAW_SUPERVISOR_MODE=external.");
	const normalizedManagerId = normalizeOpenClawStateManagerId(managerId);
	try {
		const database = openOpenClawStateDatabase(options);
		return runWithOpenClawStateOwnershipCoordinator(database.path, "state ownership claim/checkpoint", () => {
			const ownership = runOpenClawStateWriteTransaction(({ db, path: databasePath }) => claimOwnershipRow(db, databasePath, normalizedManagerId, false), {
				...options,
				database
			}, { operationLabel: "state.ownership.claim" });
			requireOwnershipCheckpoint(database.walMaintenance, database.path);
			return ownership;
		});
	} catch (error) {
		if (!(error instanceof OpenClawStateOwnershipMetadataError)) throw error;
		const ownership = repairMalformedOwnershipClaim(resolveDatabasePath(options), normalizedManagerId);
		openOpenClawStateDatabase(options);
		return ownership;
	}
}
//#endregion
export { claimOpenClawStateOwnership };

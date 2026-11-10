import { o as runWithSqliteCleanup, r as OpenClawStateOwnershipMetadataError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { n as acquireStateDatabaseSchemaLease, r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as configureSqliteWalMaintenance } from "./sqlite-wal-D2XTertL.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { C as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { a as inspectOpenClawStateOwnershipFromDatabase, c as normalizeOpenClawStateManagerId, l as publishOpenClawStateOwnership, t as STATE_SUPERVISION_KEY } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
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
	publishOpenClawStateOwnership(database, ownership);
	return ownership;
}
function repairMalformedOwnershipClaim(databasePath, managerId) {
	assertStateDatabaseAccessAllowed(databasePath);
	const existing = openClawStateDatabaseCache.getOpenClawStateDatabaseIfOpenAtPath(databasePath);
	const database = existing?.db ?? openNodeSqliteDatabase(databasePath);
	if (isPostgresSqlConnection(database)) requireNativeDatabaseFile("postgres", "repair");
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
	const lease = acquireStateDatabaseSchemaLease(resolveDatabasePath(options), { busyTimeoutMs: 0 });
	return runWithSqliteCleanup(lease, "shared-state ownership claim", () => lease.run(() => {
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
	}));
}
//#endregion
export { claimOpenClawStateOwnership };

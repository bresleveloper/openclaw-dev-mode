import { q as runWithSqliteCleanup } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { d as isPostgresSqlConnection } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as getNodeSqliteKysely, f as sql, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { a as tableExists, m as requireNativeDatabaseFile } from "./openclaw-state-read-openclaw-state-db-schema-helpers-Cgf5rJqc.mjs";
import { n as openOpenClawStateReadConnection, ut as openDoctorStateSchemaReadAdmission } from "./openclaw-state-read.worker.js";
import { n as gatewayOwnerKey, t as decodeGatewayOwnerLease } from "./openclaw-state-read-gateway-owner-lease.read-BYO43LVZ.mjs";
//#region src/infra/gateway-owner-lease.worker.ts
/** Lease inspection precedes runtime schema admission, including newer or quarantined state. */
function inspectGatewayOwnerLease(source, onAdmitted, schemaMaintenance) {
	const connection = openOpenClawStateReadConnection(source.databasePath, source.location, source.expectedIdentity, source.snapshotRoot);
	return runWithSqliteCleanup({ release: () => {
		connection.close();
	} }, "Gateway owner lease inspection", () => {
		const db = connection.database.db;
		let closeAdmission;
		if (schemaMaintenance) {
			if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
			closeAdmission = openDoctorStateSchemaReadAdmission(db);
		}
		return runWithSqliteCleanup({ release: () => closeAdmission?.() }, "Gateway owner lease schema read admission", () => {
			onAdmitted();
			if (!tableExists(db, "state_leases")) return;
			const query = sql`SELECT owner, created_at AS createdAt,
            expires_at AS expiresAt, heartbeat_at AS heartbeatAt, payload_json AS payloadJson
            FROM ${isPostgresSqlConnection(db) ? sql`state_leases` : sql`state_leases NOT INDEXED`}
            WHERE scope = ${gatewayOwnerKey.scope} AND lease_key = ${gatewayOwnerKey.key}
            LIMIT 2`;
			const { rows } = executeSqliteQuerySync(db, { compile: () => query.compile(getNodeSqliteKysely(db)) });
			if (rows.length > 1) throw new Error("Gateway owner lease identity is ambiguous during maintenance; stop OpenClaw processes and restore a verified state backup before retrying");
			return decodeGatewayOwnerLease(rows[0]);
		});
	});
}
//#endregion
export { inspectGatewayOwnerLease };

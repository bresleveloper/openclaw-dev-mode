import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as allocateHostPort } from "./cell-profile-DZW8A3ux.mjs";
//#region src/fleet/registry.kernel.ts
const FLEET_OPERATION_LEASE_SCOPE = "fleet-cell-operation";
const FLEET_OPERATION_LEASE_TTL_MS = 3e5;
/** The live caller scope and this transaction jointly fence a queued cell mutation. */
function assertFleetCellOperationInDatabase(db, tenantId, owner) {
	if (owner === void 0) return;
	if (!executeSqliteQueryTakeFirstSync(db, kyselyFor(db).selectFrom("state_leases").select("owner").where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", tenantId).where("owner", "=", owner).where("expires_at", ">", Date.now()))) throw new Error(`Fleet operation lease was lost for ${tenantId}.`);
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function recordToRow(record) {
	return {
		tenant_id: record.tenantId,
		created_at_ms: record.createdAtMs,
		image: record.image,
		runtime: record.runtime,
		host_port: record.hostPort,
		container_name: record.containerName,
		data_dir: record.dataDir
	};
}
function reserveFleetCellInDatabase(db, params) {
	const kysely = kyselyFor(db);
	if (executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("fleet_cells").select("tenant_id").where("tenant_id", "=", params.tenantId))) throw new Error(`Fleet cell already exists: ${params.tenantId}`);
	const usedPorts = executeSqliteQuerySync(db, kysely.selectFrom("fleet_cells").select("host_port")).rows.map((row) => row.host_port);
	const hostPort = allocateHostPort(usedPorts, params.requestedPort);
	const record = {
		tenantId: params.tenantId,
		createdAtMs: params.createdAtMs,
		image: params.image,
		runtime: params.runtime,
		hostPort,
		containerName: params.containerName,
		dataDir: params.dataDir
	};
	executeSqliteQuerySync(db, kysely.insertInto("fleet_cells").values(recordToRow(record)));
	return record;
}
function updateFleetCellImageInDatabase(db, tenantId, image) {
	if (executeSqliteQuerySync(db, kyselyFor(db).updateTable("fleet_cells").set({ image }).where("tenant_id", "=", tenantId)).numAffectedRows !== 1n) throw new Error(`Fleet cell disappeared before its image could be updated: ${tenantId}`);
}
function acquireFleetCellOperationInDatabase(db, params) {
	const nowMs = params.nowMs ?? Date.now();
	const expiresAt = nowMs + FLEET_OPERATION_LEASE_TTL_MS;
	const kysely = kyselyFor(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId).where("expires_at", "<=", nowMs));
	const existing = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("state_leases").select(["expires_at", "payload_json"]).where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId));
	if (existing) {
		let operation = "fleet operation";
		try {
			const payload = existing.payload_json ? JSON.parse(existing.payload_json) : void 0;
			if (typeof payload === "object" && payload !== null && "operation" in payload && typeof payload.operation === "string") operation = `fleet ${payload.operation}`;
		} catch {}
		throw new Error(`Another ${operation} is already running for ${params.tenantId}; retry after ${new Date(existing.expires_at ?? expiresAt).toISOString()}.`);
	}
	executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
		scope: FLEET_OPERATION_LEASE_SCOPE,
		lease_key: params.tenantId,
		owner: params.owner,
		expires_at: expiresAt,
		heartbeat_at: nowMs,
		payload_json: JSON.stringify({ operation: params.operation }),
		created_at: nowMs,
		updated_at: nowMs
	}));
}
function heartbeatFleetCellOperationInDatabase(db, params) {
	const nowMs = params.nowMs ?? Date.now();
	const expiresAt = nowMs + FLEET_OPERATION_LEASE_TTL_MS;
	if (executeSqliteQuerySync(db, kyselyFor(db).updateTable("state_leases").set({
		expires_at: expiresAt,
		heartbeat_at: nowMs,
		updated_at: nowMs
	}).where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId).where("owner", "=", params.owner).where("expires_at", ">", nowMs)).numAffectedRows !== 1n) throw new Error(`Fleet operation lease was lost for ${params.tenantId}.`);
}
function releaseFleetCellOperationInDatabase(db, params) {
	executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("state_leases").where("scope", "=", FLEET_OPERATION_LEASE_SCOPE).where("lease_key", "=", params.tenantId).where("owner", "=", params.owner));
}
function deleteFleetCellInDatabase(db, tenantId) {
	executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("fleet_cells").where("tenant_id", "=", tenantId));
}
//#endregion
//#region src/fleet/registry.worker.ts
function inTransaction(operation) {
	return (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => operation(db, input), {
		database: open(),
		...stateOptions()
	});
}
const fleetOperations = {
	"fleet.cell.reserve": inTransaction((db, input) => {
		assertFleetCellOperationInDatabase(db, input.tenantId, input.operationOwner);
		return reserveFleetCellInDatabase(db, input);
	}),
	"fleet.cell.updateImage": inTransaction((db, input) => {
		assertFleetCellOperationInDatabase(db, input.tenantId, input.operationOwner);
		return updateFleetCellImageInDatabase(db, input.tenantId, input.image);
	}),
	"fleet.cell.delete": inTransaction((db, input) => {
		assertFleetCellOperationInDatabase(db, input.tenantId, input.operationOwner);
		return deleteFleetCellInDatabase(db, input.tenantId);
	}),
	"fleet.operation.acquire": inTransaction(acquireFleetCellOperationInDatabase),
	"fleet.operation.heartbeat": inTransaction(heartbeatFleetCellOperationInDatabase),
	"fleet.operation.release": inTransaction(releaseFleetCellOperationInDatabase)
};
//#endregion
export { fleetOperations };

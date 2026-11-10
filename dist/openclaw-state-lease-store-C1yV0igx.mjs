import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as readStateLeaseProcessOwnerStatus, t as parseStateLeaseProcessOwner } from "./state-lease-process-owner-CPrBcVUW.mjs";
//#region src/state/openclaw-state-lease-store.ts
/** Publish owner facts in the caller's transaction without renewing or replacing its lease. */
function updateOpenClawStateLeasePayloadInTransaction(db, identity, payloadJson) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("state_leases").set({ payload_json: payloadJson }).where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner)).numAffectedRows === 1n;
}
/** The caller owns the write transaction; only absent or expired leases can be acquired. */
function acquireOpenClawStateLeaseInTransaction(db, identity, leaseMs, payloadJson = null, nowMs) {
	const now = nowMs ?? Date.now();
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("state_leases").where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("expires_at", "<=", now));
	const expiresAt = now + leaseMs;
	if (executeSqliteQuerySync(db, kysely.insertInto("state_leases").values({
		scope: identity.scope,
		lease_key: identity.key,
		owner: identity.owner,
		expires_at: expiresAt,
		heartbeat_at: now,
		payload_json: payloadJson,
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doNothing())).numAffectedRows === 1n) return {
		kind: "acquired",
		expiresAt
	};
	const held = readOpenClawStateLease(db, identity);
	if (!held) throw new Error("Conflicting state lease disappeared inside its acquisition transaction");
	return {
		kind: "held",
		holder: {
			owner: held.owner,
			epoch: held.createdAt,
			expiresAt: held.expiresAt
		}
	};
}
function readOpenClawStateLease(db, identity) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("state_leases").select([
		"owner",
		"created_at as createdAt",
		"expires_at as expiresAt",
		"heartbeat_at as heartbeatAt",
		"payload_json as payloadJson"
	]).where("scope", "=", identity.scope).where("lease_key", "=", identity.key));
}
/** Reclaim only a same-host owner whose process identity is provably gone. */
function reclaimDeadOpenClawStateLeaseInTransaction(db, identity) {
	const existing = readOpenClawStateLease(db, identity);
	if (existing && readStateLeaseProcessOwnerStatus(parseStateLeaseProcessOwner(existing.payloadJson)) === "dead") {
		releaseOpenClawStateLeaseInTransaction(db, {
			...identity,
			owner: existing.owner
		});
		return;
	}
	return existing;
}
function readOpenClawStateLeaseExpiry(db, identity, nowMs) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("state_leases").select("expires_at").where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner).where("expires_at", ">", nowMs ?? Date.now()).$narrowType())?.expires_at;
}
function repairMissingProcessStartTime(db, identity, processOwner) {
	if (processOwner?.startedAt == null) return;
	const row = readOpenClawStateLease(db, identity);
	const recorded = parseStateLeaseProcessOwner(row?.payloadJson ?? null);
	if (row?.owner !== identity.owner || recorded?.startedAt !== null || recorded.pid !== processOwner.pid || recorded.host !== processOwner.host || !row.payloadJson) return;
	const payload = JSON.parse(row.payloadJson);
	if (!isRecord(payload) || !isRecord(payload.owner)) return;
	return JSON.stringify({
		...payload,
		owner: {
			...payload.owner,
			startedAt: processOwner.startedAt
		}
	});
}
/** The caller owns the write transaction; expired or replaced owners cannot renew. */
function renewOpenClawStateLeaseInTransaction(db, identity, leaseMs, processOwner, nowMs) {
	const now = nowMs ?? Date.now();
	const expiresAt = now + leaseMs;
	const payloadJson = repairMissingProcessStartTime(db, identity, processOwner);
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("state_leases").set({
		expires_at: expiresAt,
		heartbeat_at: now,
		updated_at: now,
		...payloadJson === void 0 ? {} : { payload_json: payloadJson }
	}).where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner).where("expires_at", ">", now)).numAffectedRows === 1n ? expiresAt : void 0;
}
/** The caller owns the write transaction; a replaced owner cannot release its successor. */
function releaseOpenClawStateLeaseInTransaction(db, identity) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("state_leases").where("scope", "=", identity.scope).where("lease_key", "=", identity.key).where("owner", "=", identity.owner));
}
//#endregion
export { releaseOpenClawStateLeaseInTransaction as a, reclaimDeadOpenClawStateLeaseInTransaction as i, readOpenClawStateLease as n, renewOpenClawStateLeaseInTransaction as o, readOpenClawStateLeaseExpiry as r, updateOpenClawStateLeasePayloadInTransaction as s, acquireOpenClawStateLeaseInTransaction as t };

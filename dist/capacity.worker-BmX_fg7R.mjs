import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { n as readStateLeaseProcessOwnerStatus, t as parseStateLeaseProcessOwner } from "./state-lease-process-owner-CPrBcVUW.mjs";
import { a as WORKTREE_CAPACITY_RESERVATION_SCOPE } from "./registry-publication-BJype9QG.mjs";
import { n as assertWorktreeRegistryPredicates } from "./registry-run-end.worker-DYWsmg23.mjs";
import { r as assertOpenClawStateLeasesWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-D3xn0u2j.mjs";
import { statSync } from "node:fs";
//#region src/agents/worktrees/capacity.worker.ts
const GiB = 1024 ** 3;
function readReservations(payload) {
	const entries = payload.worktreeCapacity;
	if (entries === void 0) return [];
	if (!Array.isArray(entries)) throw new Error("Managed worktree capacity reservation is unreadable; retry after its owner settles.");
	return entries.map((entry) => {
		if (!isRecord(entry) || typeof entry.device !== "string" || typeof entry.bytes !== "number" || !Number.isSafeInteger(entry.bytes) || entry.bytes < 0 || typeof entry.reserve !== "number" || !Number.isSafeInteger(entry.reserve) || entry.reserve < 0) throw new Error("Managed worktree capacity reservation is unreadable; retry after its owner settles.");
		return {
			device: entry.device,
			bytes: entry.bytes,
			reserve: entry.reserve
		};
	});
}
function measureVolumes(demands) {
	const volumes = /* @__PURE__ */ new Map();
	for (const demand of demands) {
		const space = tryReadDiskSpace(demand.path);
		if (!space || space.totalBytes === null) throw new Error(`Cannot determine disk space near ${demand.path}; check the volume and retry worktree allocation.`);
		const device = statSync(space.checkedPath).dev;
		const existing = volumes.get(device);
		if (existing) {
			existing.available = Math.min(existing.available, space.availableBytes);
			existing.bytes += demand.bytes;
		} else volumes.set(device, {
			path: space.checkedPath,
			available: space.availableBytes,
			bytes: demand.bytes
		});
	}
	return volumes;
}
/** The writer transaction samples disk and accounts for every retained operation before admitting writes. */
function reserveWorktreeCapacityInDatabase(db, input) {
	const { key, owner, demands, purpose, snapshot } = input;
	const volumes = measureVolumes(demands);
	const k = getNodeSqliteKysely(db);
	const rows = executeSqliteQuerySync(db, k.selectFrom("state_leases").select([
		"lease_key",
		"owner",
		"heartbeat_at",
		"payload_json"
	]).where("scope", "=", WORKTREE_CAPACITY_RESERVATION_SCOPE)).rows;
	const pending = /* @__PURE__ */ new Map();
	const now = Date.now();
	for (const row of rows) {
		if (row.lease_key === key && row.owner === key) continue;
		if (readStateLeaseProcessOwnerStatus(parseStateLeaseProcessOwner(row.payload_json), row.heartbeat_at ?? void 0) === "dead") {
			executeSqliteQuerySync(db, k.deleteFrom("state_leases").where("scope", "=", WORKTREE_CAPACITY_RESERVATION_SCOPE).where("lease_key", "=", row.lease_key).where("owner", "=", row.owner));
			continue;
		}
		const payload = row.payload_json === null ? {} : JSON.parse(row.payload_json);
		if (!isRecord(payload)) throw new Error("Managed worktree capacity lease is unreadable; retry after its owner settles.");
		for (const reservation of readReservations(payload)) {
			const previous = pending.get(reservation.device);
			pending.set(reservation.device, {
				bytes: (previous?.bytes ?? 0) + reservation.bytes,
				reserve: Math.max(previous?.reserve ?? 0, reservation.reserve),
				key: previous?.key ?? row.lease_key
			});
		}
	}
	const reserve = snapshot ? 128 * 1024 ** 2 : 4 * GiB;
	const reservations = [];
	for (const [device, volume] of volumes) {
		const other = pending.get(String(device));
		const required = Math.max(reserve, other?.reserve ?? 0) + volume.bytes + (other?.bytes ?? 0);
		if (!Number.isSafeInteger(Math.ceil(required)) || volume.available < required) return {
			admitted: false,
			message: `Insufficient disk space near ${volume.path} for ${purpose}: ${formatDiskSpaceBytes(volume.available)} available; approximately ${formatDiskSpaceBytes(required)} required including safety reserve and pending managed worktree writes. Wait for cleanup or free caches, then retry.`,
			...other ? { reservationKey: other.key } : {}
		};
		reservations.push({
			device: String(device),
			bytes: Math.ceil(volume.bytes),
			reserve
		});
	}
	if (executeSqliteQuerySync(db, k.insertInto("state_leases").values({
		scope: "core:managed-worktrees:capacity-reservations",
		lease_key: key,
		owner: key,
		expires_at: null,
		heartbeat_at: null,
		payload_json: JSON.stringify({
			owner,
			worktreeCapacity: reservations
		}),
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doUpdateSet({
		payload_json: JSON.stringify({
			owner,
			worktreeCapacity: reservations
		}),
		updated_at: now
	}).where("state_leases.owner", "=", key))).numAffectedRows !== 1n) throw new Error("Managed worktree capacity reservation changed");
	return { admitted: true };
}
function reserveWorktreeCapacityInWorker(input, context) {
	const { leases } = input;
	if (!leases.every((lease) => lease.scope === "core:managed-worktrees:create" && lease.key === "capacity" || lease.scope === "core:managed-worktrees:mutation")) throw new Error("Worktree capacity requires its allocation owner");
	return runOpenClawStateWriteTransaction(({ db }) => {
		assertOpenClawStateLeasesWorkerOwnedInTransaction(db, leases);
		assertWorktreeRegistryPredicates(db, input.predicates);
		const result = reserveWorktreeCapacityInDatabase(db, input);
		assertOpenClawStateLeasesWorkerOwnedInTransaction(db, leases, "commit");
		return result;
	}, {
		...context.stateOptions(),
		database: context.open()
	}, { operationLabel: "agents.worktrees.capacity-admit" });
}
//#endregion
export { reserveWorktreeCapacityInWorker };

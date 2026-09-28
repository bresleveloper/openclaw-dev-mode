import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as find } from "./placement-row-codec-qMLLgrft.mjs";
import { _ as parseWorkerEnvironmentState, t as publishWorkerEnvironmentNativeMutation } from "./store-native-publication-DNMm5oc5.mjs";
import { isDeepStrictEqual } from "node:util";
import { Buffer } from "node:buffer";
//#region src/gateway/worker-environments/prepared-environment-store.ts
const query = (db) => getNodeSqliteKysely(db);
function readWorkerEnvironmentPreparation(row) {
	const { preparation_key: key, preparation_purpose: storedPurpose, preparation_demand_at_ms: demandAtMs, preparation_expires_at_ms: expiresAtMs, preparation_consumed_at_ms: consumedAtMs } = row;
	if (key === null && storedPurpose === null && demandAtMs === null && expiresAtMs === null && consumedAtMs === null) return null;
	if (storedPurpose !== null && storedPurpose !== "reserve" && storedPurpose !== "build" || typeof key !== "string" || !/^[a-f0-9]{64}$/u.test(key) || demandAtMs === null || !Number.isSafeInteger(demandAtMs) || demandAtMs < 0 || expiresAtMs === null || !Number.isSafeInteger(expiresAtMs) || expiresAtMs <= demandAtMs || consumedAtMs !== null && (!Number.isSafeInteger(consumedAtMs) || consumedAtMs < demandAtMs || consumedAtMs >= expiresAtMs)) throw new Error("Worker environment preparation metadata is invalid");
	return {
		purpose: storedPurpose ?? "reserve",
		key,
		demandAtMs,
		expiresAtMs,
		consumedAtMs
	};
}
function workerEnvironmentPreparationColumns(preparation) {
	const columns = {
		preparation_key: preparation?.key ?? null,
		preparation_purpose: preparation?.purpose ?? null,
		preparation_demand_at_ms: preparation?.demandAtMs ?? null,
		preparation_expires_at_ms: preparation?.expiresAtMs ?? null,
		preparation_consumed_at_ms: null
	};
	readWorkerEnvironmentPreparation(columns);
	return columns;
}
function hasPlacementReference(db, environmentId) {
	return Boolean(executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_session_placements").select("session_id").where("environment_id", "=", environmentId).limit(1)));
}
function snapshotProjectKey(snapshot) {
	if (!isRecord(snapshot) || !isRecord(snapshot.project) || typeof snapshot.project.key !== "string" || !/^[a-f0-9]{64}$/u.test(snapshot.project.key)) throw new Error("Prepared worker has an invalid project identity");
	return snapshot.project.key;
}
function selectPreparedEnvironmentReservations(records) {
	return records.filter((record) => record.preparation !== null && !["failed", "destroyed"].includes(record.state) && (record.preparation.consumedAtMs === null || record.destroyRequestedAtMs !== null || record.state === "orphaned")).map((record) => ({
		environmentId: record.environmentId,
		profileId: record.profileId,
		leaseId: record.leaseId,
		cleanupOrder: record.destroyRequestedAtMs !== null || record.state === "orphaned" ? 0 : 1,
		state: record.state,
		purpose: record.preparation.purpose,
		projectKey: snapshotProjectKey(record.profileSnapshot),
		createdAtMs: record.createdAtMs
	})).toSorted((a, b) => a.cleanupOrder - b.cleanupOrder || a.createdAtMs - b.createdAtMs || Buffer.compare(Buffer.from(a.environmentId), Buffer.from(b.environmentId)));
}
function readPreparedReservations(db) {
	return selectPreparedEnvironmentReservations(executeSqliteQuerySync(db, query(db).selectFrom("worker_environments").selectAll().where("preparation_key", "is not", null)).rows.map((row) => ({
		environmentId: row.environment_id,
		profileId: row.profile_id,
		profileSnapshot: JSON.parse(row.profile_snapshot_json),
		leaseId: row.lease_id,
		state: parseWorkerEnvironmentState(row.state),
		preparation: readWorkerEnvironmentPreparation(row),
		destroyRequestedAtMs: row.destroy_requested_at_ms,
		createdAtMs: row.created_at_ms
	})));
}
function preparedCapacityFromReservations(reserved, input) {
	return Math.max(0, Math.min(input.maxTotal - reserved.length, input.target - reserved.filter((row) => row.profileId === input.profileId && row.projectKey === input.projectKey).length));
}
function preparedCapacity(db, input) {
	return preparedCapacityFromReservations(readPreparedReservations(db), input);
}
function isPreparedReservationWithinCapacity(reservations, input) {
	const owned = reservations.find((row) => row.environmentId === input.environmentId);
	if (!owned) return false;
	const reserved = owned.leaseId ? reservations.filter((row) => row.cleanupOrder === 1) : reservations;
	const index = reserved.findIndex((row) => row.environmentId === input.environmentId);
	if (index < 0 || index >= input.maxTotal) return false;
	if (owned.purpose === "build" && owned.state !== "ready") return true;
	return reserved.slice(0, index + 1).filter((row) => row.profileId === owned.profileId && row.projectKey === owned.projectKey).length <= input.target;
}
function createPreparedEnvironmentStoreOps(options) {
	return {
		ensurePreparedIntent(input) {
			if (!Number.isSafeInteger(input.target) || input.target < 0 || !Number.isSafeInteger(input.maxTotal) || input.maxTotal < 0) throw new Error("Prepared worker capacity must be a non-negative safe integer");
			workerEnvironmentPreparationColumns(input.intent.preparation);
			return options.write((db) => {
				input.assertCurrent();
				const existing = options.get(db, input.intent.environmentId);
				if (existing) {
					if (existing.providerId !== input.intent.providerId || existing.profileId !== input.intent.profileId || existing.provisionOperationId !== input.intent.provisionOperationId || !isDeepStrictEqual(existing.profileSnapshot, input.intent.profileSnapshot) || existing.preparation?.key !== input.intent.preparation.key || existing.preparation.purpose !== input.intent.preparation.purpose || existing.preparation.demandAtMs !== input.intent.preparation.demandAtMs || existing.preparation.expiresAtMs !== input.intent.preparation.expiresAtMs) throw new Error("Prepared environment intent identity changed");
					return existing;
				}
				const nowMs = options.now();
				const build = input.intent.preparation.purpose === "build";
				if (build && input.maxTotal === 0) return;
				if (build) {
					const reusable = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_environments").select("environment_id").where("profile_id", "=", input.intent.profileId).where("provider_id", "=", input.intent.providerId).where("preparation_key", "=", input.intent.preparation.key).where("preparation_consumed_at_ms", "is", null).where("destroy_requested_at_ms", "is", null).where("state", "not in", [
						"failed",
						"destroyed",
						"orphaned"
					]).where("preparation_expires_at_ms", ">", nowMs).orderBy("created_at_ms").orderBy("environment_id").limit(1));
					if (reusable) {
						executeSqliteQuerySync(db, query(db).updateTable("worker_environments").set({
							preparation_purpose: "build",
							updated_at_ms: nowMs
						}).where("environment_id", "=", reusable.environment_id).where("state", "!=", "ready").where((eb) => eb.or([eb("preparation_purpose", "is", null), eb("preparation_purpose", "=", "reserve")])));
						return options.get(db, reusable.environment_id);
					}
				}
				if (!build && input.target === 0 || input.maxTotal === 0 || input.intent.preparation.demandAtMs > nowMs || input.intent.preparation.expiresAtMs <= nowMs) return;
				if (build ? readPreparedReservations(db).length >= input.maxTotal : preparedCapacity(db, {
					...input,
					profileId: input.intent.profileId
				}) === 0) return;
				if (snapshotProjectKey(input.intent.profileSnapshot) !== input.projectKey) throw new Error("Prepared worker capacity does not match the admitted project");
				input.assertCurrent();
				return options.createIntent(db, input.intent);
			});
		},
		requestPreparedDestroy(input) {
			return options.write((db) => {
				input.assertCurrent();
				const current = options.get(db, input.environmentId);
				const preparation = current?.preparation;
				const nowMs = options.now();
				if (!current || !preparation || preparation.key !== input.preparationKey || current.ownerEpoch !== input.ownerEpoch || preparation.consumedAtMs !== null || current.attachedSessionIds.length !== 0 || current.state === "failed" || current.state === "destroyed" || input.reason === "expired" && preparation.expiresAtMs > nowMs || hasPlacementReference(db, current.environmentId)) return;
				if (current.destroyRequestedAtMs !== null) return current;
				input.assertCurrent();
				executeSqliteQuerySync(db, query(db).updateTable("worker_environments").set({
					destroy_requested_at_ms: nowMs,
					teardown_terminal_state: "destroyed",
					updated_at_ms: nowMs
				}).where("environment_id", "=", current.environmentId));
				return options.get(db, current.environmentId);
			});
		}
	};
}
/** Placement and consumption commit together; dropping a placement never recreates a spare. */
function consumePreparedEnvironment(db, input, nowMs) {
	input.assertCurrent();
	const placement = find(db, input.sessionId);
	if (!placement || placement.state !== "requested" || placement.generation !== input.expectedGeneration || placement.agentId !== input.agentId || placement.sessionKey !== input.sessionKey || placement.executionMode !== input.executionMode || placement.turnClaim !== null) return;
	const environment = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_environments").selectAll().where("environment_id", "=", input.environmentId));
	if (!environment) return;
	const preparation = readWorkerEnvironmentPreparation(environment);
	const profile = JSON.parse(environment.profile_snapshot_json);
	if (!preparation || preparation.key !== input.preparationKey || preparation.consumedAtMs !== null || preparation.demandAtMs > nowMs || preparation.expiresAtMs <= nowMs || !isRecord(profile) || profile.executionMode !== input.executionMode || environment.state !== "ready" || environment.owner_epoch !== input.ownerEpoch || environment.provider_id !== input.providerId || environment.profile_id !== input.profileId || environment.node_device_id !== input.nodeDeviceId || environment.lease_id !== input.leaseId || environment.shared_host !== 0 || environment.bootstrap_bundle_hash !== input.bundleHash || environment.destroy_requested_at_ms !== null || environment.attached_session_ids_json !== "[]" || hasPlacementReference(db, input.environmentId)) return;
	input.assertCurrent();
	executeSqliteQuerySync(db, query(db).updateTable("worker_environments").set({
		preparation_consumed_at_ms: nowMs,
		updated_at_ms: nowMs
	}).where("environment_id", "=", input.environmentId));
	publishWorkerEnvironmentNativeMutation(db, input.environmentId, {
		preparation: {
			...preparation,
			consumedAtMs: nowMs
		},
		updatedAtMs: nowMs
	});
	return placement;
}
function assertPreparedEnvironmentAttachment(db, environment, sessionId, binding) {
	if (!environment.preparation) return;
	binding?.assertCurrent();
	const placement = find(db, sessionId);
	if (!binding || binding.sessionId !== sessionId || environment.profileSnapshot.executionMode !== binding.executionMode || environment.state !== "ready" || environment.preparation.key !== binding.preparationKey || environment.preparation.consumedAtMs === null || !placement || placement.state !== "syncing" || placement.generation !== binding.generation || placement.sessionKey !== binding.sessionKey || placement.agentId !== binding.agentId || placement.executionMode !== binding.executionMode || placement.environmentId !== environment.environmentId || placement.turnClaim !== null) throw new Error("Prepared worker attachment lost its exact placement reservation");
	binding.assertCurrent();
}
//#endregion
export { preparedCapacityFromReservations as a, workerEnvironmentPreparationColumns as c, isPreparedReservationWithinCapacity as i, consumePreparedEnvironment as n, readWorkerEnvironmentPreparation as o, createPreparedEnvironmentStoreOps as r, selectPreparedEnvironmentReservations as s, assertPreparedEnvironmentAttachment as t };

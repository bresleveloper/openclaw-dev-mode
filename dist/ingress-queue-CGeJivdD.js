import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, i as openOpenClawStateDatabase, o as runOpenClawStateWriteTransaction } from "./openclaw-state-db-gblCDNfo.js";
import { randomUUID } from "node:crypto";
//#region src/channels/message/ingress-queue.ts
/**
* Durable channel ingress queue.
*
* Stores, claims, completes, and tombstones inbound channel events in OpenClaw state.
*/
function normalizePart(value, fallback) {
	const normalized = value?.trim();
	return normalized ? normalized : fallback;
}
function createStateDirEnv(stateDir, baseEnv = process.env) {
	const env = Object.create(baseEnv);
	env.OPENCLAW_STATE_DIR = stateDir;
	return env;
}
function openStateDatabase(stateDir) {
	return openOpenClawStateDatabase({ env: stateDir ? createStateDirEnv(stateDir) : process.env });
}
function getChannelIngressKysely(db) {
	return getNodeSqliteKysely(db);
}
function affectedRows(result) {
	return Number(result.numAffectedRows ?? 0n);
}
function parseJson(value) {
	return JSON.parse(value);
}
function baseRecord(row) {
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		payload: parseJson(row.payload_json),
		...row.metadata_json === null ? {} : { metadata: parseJson(row.metadata_json) },
		receivedAt: row.received_at,
		updatedAt: row.updated_at,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		attempts: row.attempts,
		...row.last_attempt_at === null ? {} : { lastAttemptAt: row.last_attempt_at },
		...row.last_error === null ? {} : { lastError: row.last_error }
	};
}
function claimedRecord(row) {
	return {
		...baseRecord(row),
		claim: {
			token: row.claim_token ?? "",
			ownerId: row.claim_owner ?? "",
			claimedAt: row.claimed_at ?? 0
		}
	};
}
function completedRecord(row) {
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		completedAt: row.completed_at ?? row.updated_at,
		...row.completed_metadata_json === null ? {} : { metadata: parseJson(row.completed_metadata_json) }
	};
}
function failedRecord(row) {
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		failedAt: row.failed_at ?? row.updated_at,
		reason: row.failed_reason ?? "failed",
		...row.last_error === null ? {} : { message: row.last_error }
	};
}
function selectRow(db, queueName, id) {
	return executeSqliteQueryTakeFirstSync(db, getChannelIngressKysely(db).selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("event_id", "=", id));
}
function idFrom(idOrRecord) {
	const id = normalizePart(typeof idOrRecord === "string" ? idOrRecord : idOrRecord.id, "");
	if (!id) throw new Error("Channel ingress event id cannot be empty");
	return id;
}
function claimTokenFrom(idOrClaim) {
	return typeof idOrClaim === "string" ? null : idOrClaim.claim?.token ?? null;
}
function rowToEnqueueResult(row) {
	if (row.status === "completed") return {
		kind: "completed",
		duplicate: true,
		record: completedRecord(row)
	};
	if (row.status === "failed") return {
		kind: "failed",
		duplicate: true,
		record: failedRecord(row)
	};
	if (row.status === "claimed") return {
		kind: "claimed",
		duplicate: true,
		record: claimedRecord(row)
	};
	return {
		kind: "pending",
		duplicate: true,
		record: baseRecord(row)
	};
}
function normalizeLimit(limit) {
	return limit === "all" ? Number.MAX_SAFE_INTEGER : Math.max(1, Math.floor(limit ?? 100));
}
function normalizeScanLimit(limit) {
	return Math.max(1, Math.floor(limit ?? 100));
}
function normalizeMaxEntries(value) {
	return value === void 0 ? null : Math.max(0, Math.floor(value));
}
function normalizedProtectedIds(ids) {
	return [...ids ?? []].map((id) => id.trim()).filter(Boolean);
}
function normalizedCandidateIds(ids) {
	return ids === void 0 ? void 0 : [...ids].map((id) => id.trim()).filter(Boolean);
}
function queueNameForParts(channelId, accountId) {
	return JSON.stringify([channelId, accountId]);
}
/** Creates a durable channel/account-scoped ingress queue backed by the OpenClaw state database. */
function createChannelIngressQueue(options) {
	const channelId = normalizePart(options.channelId, "unknown");
	const accountId = normalizePart(options.accountId, "default");
	const queueName = queueNameForParts(channelId, accountId);
	const now = options.now ?? Date.now;
	const enqueue = async (id, payload, enqueueOptions) => {
		const eventId = normalizePart(id, "");
		if (!eventId) throw new Error("Channel ingress event id cannot be empty");
		const receivedAt = enqueueOptions?.receivedAt ?? now();
		const updatedAt = now();
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			const insert = executeSqliteQuerySync(tx.db, kysely.insertInto("channel_ingress_events").values({
				queue_name: queueName,
				event_id: eventId,
				channel_id: channelId,
				account_id: accountId,
				status: "pending",
				lane_key: enqueueOptions?.laneKey ?? null,
				payload_json: JSON.stringify(payload),
				metadata_json: enqueueOptions?.metadata === void 0 ? null : JSON.stringify(enqueueOptions.metadata),
				received_at: receivedAt,
				updated_at: updatedAt,
				attempts: 0
			}).onConflict((conflict) => conflict.columns(["queue_name", "event_id"]).doNothing()));
			const row = selectRow(tx.db, queueName, eventId);
			if (!row) throw new Error(`Failed to read channel ingress event ${queueName}/${eventId}`);
			if (affectedRows(insert) > 0) return {
				kind: "accepted",
				duplicate: false,
				record: baseRecord(row)
			};
			return rowToEnqueueResult(row);
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const listPending = async (listOptions) => {
		const { db } = openStateDatabase(options.stateDir);
		const baseQuery = getChannelIngressKysely(db).selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "pending").limit(normalizeLimit(listOptions?.limit));
		return executeSqliteQuerySync(db, listOptions?.orderBy === "id" ? baseQuery.orderBy("event_id", "asc") : baseQuery.orderBy("received_at", "asc").orderBy("event_id", "asc")).rows.map((row) => baseRecord(row));
	};
	const listClaims = async () => {
		const { db } = openStateDatabase(options.stateDir);
		return executeSqliteQuerySync(db, getChannelIngressKysely(db).selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "claimed").orderBy("claimed_at", "asc").orderBy("received_at", "asc").orderBy("event_id", "asc")).rows.map((row) => claimedRecord(row));
	};
	const recoverStaleClaims = async (recoverOptions) => {
		const current = recoverOptions?.now ?? now();
		const cutoff = current - Math.max(0, Math.floor(recoverOptions?.staleMs ?? 0));
		const claims = (await listClaims()).filter((claim) => claim.claim.claimedAt <= cutoff);
		let recovered = 0;
		for (const claim of claims) {
			if (recoverOptions?.shouldRecover && !await recoverOptions.shouldRecover(claim)) continue;
			if (await releaseClaimIfStillStale(claim, {
				cutoff,
				releasedAt: current
			})) recovered += 1;
		}
		return recovered;
	};
	const claimNext = async (claimOptions) => {
		if (claimOptions?.staleMs !== void 0) await recoverStaleClaims({ staleMs: claimOptions.staleMs });
		const blocked = new Set([...claimOptions?.blockedLaneKeys ?? []].map((key) => key.trim()).filter(Boolean));
		const candidateIds = normalizedCandidateIds(claimOptions?.candidateIds);
		if (candidateIds?.length === 0) return null;
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			let effectiveBlocked = blocked;
			if (candidateIds && candidateIds.length > 0) {
				const claimedCandidateLaneKeys = executeSqliteQuerySync(tx.db, kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "claimed").where("event_id", "in", candidateIds)).rows.map((row) => row.lane_key ?? claimOptions?.deriveLaneKey?.(baseRecord(row))).filter((laneKey) => Boolean(laneKey));
				if (claimedCandidateLaneKeys.length > 0) effectiveBlocked = new Set([...blocked, ...claimedCandidateLaneKeys]);
			}
			let select = kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "pending");
			if (candidateIds) select = select.where("event_id", "in", candidateIds);
			if (effectiveBlocked.size > 0 && !claimOptions?.deriveLaneKey) select = select.where((eb) => eb.or([eb("lane_key", "is", null), eb("lane_key", "not in", [...effectiveBlocked])]));
			let orderedSelect = claimOptions?.orderBy === "id" ? select.orderBy("event_id", "asc") : select.orderBy("received_at", "asc").orderBy("event_id", "asc");
			orderedSelect = claimOptions?.deriveLaneKey === void 0 ? orderedSelect.limit(1) : orderedSelect.limit(normalizeScanLimit(claimOptions.scanLimit));
			const selected = executeSqliteQuerySync(tx.db, orderedSelect).rows.find((row) => {
				const laneKey = row.lane_key ?? claimOptions?.deriveLaneKey?.(baseRecord(row));
				return !laneKey || !effectiveBlocked.has(laneKey);
			});
			if (!selected) return null;
			const derivedLaneKey = selected.lane_key ?? claimOptions?.deriveLaneKey?.(baseRecord(selected));
			const token = randomUUID();
			const claimedAt = now();
			const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
			if (affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set({
				status: "claimed",
				claim_token: token,
				claim_owner: ownerId,
				claimed_at: claimedAt,
				...derivedLaneKey ? { lane_key: derivedLaneKey } : {},
				updated_at: claimedAt
			}).where("queue_name", "=", queueName).where("event_id", "=", selected.event_id).where("status", "=", "pending"))) === 0) return null;
			const row = selectRow(tx.db, queueName, selected.event_id);
			return row ? claimedRecord(row) : null;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const claim = async (id, claimOptions) => {
		const eventId = normalizePart(id, "");
		if (!eventId) throw new Error("Channel ingress event id cannot be empty");
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			const token = randomUUID();
			const claimedAt = now();
			const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
			if (affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set({
				status: "claimed",
				claim_token: token,
				claim_owner: ownerId,
				claimed_at: claimedAt,
				updated_at: claimedAt
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId).where("status", "=", "pending"))) === 0) return null;
			const row = selectRow(tx.db, queueName, eventId);
			return row ? claimedRecord(row) : null;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const refreshClaim = async (claimRef, refreshOptions) => {
		const eventId = idFrom(claimRef);
		const refreshedAt = refreshOptions?.refreshedAt ?? now();
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			return affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set({
				claimed_at: refreshedAt,
				updated_at: refreshedAt
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId).where("status", "=", "claimed").where("claim_token", "=", claimRef.claim.token))) > 0;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const releaseClaimIfStillStale = async (claimRef, releaseOptions) => {
		const eventId = idFrom(claimRef);
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			return affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set((eb) => ({
				status: "pending",
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				attempts: eb("attempts", "+", 1),
				last_attempt_at: releaseOptions.releasedAt,
				updated_at: releaseOptions.releasedAt
			})).where("queue_name", "=", queueName).where("event_id", "=", eventId).where("status", "=", "claimed").where("claim_token", "=", claimRef.claim.token).where("claimed_at", "<=", releaseOptions.cutoff))) > 0;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const complete = async (idOrClaim, completeOptions) => {
		const eventId = idFrom(idOrClaim);
		const token = claimTokenFrom(idOrClaim);
		const completedAt = completeOptions?.completedAt ?? now();
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			const baseUpdate = kysely.updateTable("channel_ingress_events").set({
				status: "completed",
				completed_at: completedAt,
				completed_metadata_json: completeOptions?.metadata === void 0 ? null : JSON.stringify(completeOptions.metadata),
				payload_json: "null",
				metadata_json: null,
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				last_attempt_at: null,
				last_error: null,
				updated_at: completedAt
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const update = token === null ? baseUpdate.where("status", "=", "pending") : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
			if (affectedRows(executeSqliteQuerySync(tx.db, update)) > 0) return true;
			if (token !== null) return false;
			return affectedRows(executeSqliteQuerySync(tx.db, kysely.insertInto("channel_ingress_events").values({
				queue_name: queueName,
				event_id: eventId,
				channel_id: channelId,
				account_id: accountId,
				status: "completed",
				lane_key: null,
				payload_json: "null",
				metadata_json: null,
				received_at: completedAt,
				updated_at: completedAt,
				attempts: 0,
				completed_at: completedAt,
				completed_metadata_json: completeOptions?.metadata === void 0 ? null : JSON.stringify(completeOptions.metadata)
			}).onConflict((conflict) => conflict.columns(["queue_name", "event_id"]).doNothing()))) > 0;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const release = async (idOrClaim, releaseOptions) => {
		const eventId = idFrom(idOrClaim);
		const token = claimTokenFrom(idOrClaim);
		const releasedAt = releaseOptions?.releasedAt ?? now();
		return runOpenClawStateWriteTransaction((tx) => {
			const baseUpdate = getChannelIngressKysely(tx.db).updateTable("channel_ingress_events").set((eb) => ({
				status: "pending",
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				attempts: eb("attempts", "+", 1),
				last_attempt_at: releasedAt,
				...releaseOptions?.lastError === void 0 ? {} : { last_error: releaseOptions.lastError },
				updated_at: releasedAt
			})).where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const update = token === null ? baseUpdate.where("status", "=", "pending") : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
			return affectedRows(executeSqliteQuerySync(tx.db, update)) > 0;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const fail = async (idOrClaim, failOptions) => {
		const eventId = idFrom(idOrClaim);
		const token = claimTokenFrom(idOrClaim);
		const failedAt = failOptions.failedAt ?? now();
		return runOpenClawStateWriteTransaction((tx) => {
			const baseUpdate = getChannelIngressKysely(tx.db).updateTable("channel_ingress_events").set({
				status: "failed",
				failed_at: failedAt,
				failed_reason: failOptions.reason,
				last_error: failOptions.message ?? null,
				payload_json: "null",
				metadata_json: null,
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				updated_at: failedAt
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const update = token === null ? baseUpdate.where("status", "=", "pending") : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
			return affectedRows(executeSqliteQuerySync(tx.db, update)) > 0;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const deleteEntry = async (idOrRecord) => {
		const eventId = idFrom(idOrRecord);
		const token = claimTokenFrom(idOrRecord);
		return runOpenClawStateWriteTransaction((tx) => {
			const baseDelete = getChannelIngressKysely(tx.db).deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const deleteQuery = token === null ? baseDelete.where("status", "=", "pending") : baseDelete.where("status", "=", "claimed").where("claim_token", "=", token);
			return affectedRows(executeSqliteQuerySync(tx.db, deleteQuery)) > 0;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	const prune = async (pruneOptions) => {
		const current = pruneOptions?.now ?? now();
		const pendingCutoff = pruneOptions?.pendingTtlMs === void 0 ? null : current - pruneOptions.pendingTtlMs;
		const completedCutoff = pruneOptions?.completedTtlMs === void 0 ? null : current - pruneOptions.completedTtlMs;
		const failedCutoff = pruneOptions?.failedTtlMs === void 0 ? null : current - pruneOptions.failedTtlMs;
		const pendingMaxEntries = normalizeMaxEntries(pruneOptions?.pendingMaxEntries);
		const completedMaxEntries = normalizeMaxEntries(pruneOptions?.completedMaxEntries);
		const failedMaxEntries = normalizeMaxEntries(pruneOptions?.failedMaxEntries);
		const protectIds = normalizedProtectedIds(pruneOptions?.protectIds);
		if (pendingCutoff === null && completedCutoff === null && failedCutoff === null && pendingMaxEntries === null && completedMaxEntries === null && failedMaxEntries === null) return 0;
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			let deleted = 0;
			if (pendingCutoff !== null) {
				let deleteQuery = kysely.deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("status", "=", "pending").where("updated_at", "<", pendingCutoff);
				if (protectIds.length > 0) deleteQuery = deleteQuery.where("event_id", "not in", protectIds);
				deleted += affectedRows(executeSqliteQuerySync(tx.db, deleteQuery));
			}
			if (completedCutoff !== null) {
				let deleteQuery = kysely.deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("status", "=", "completed").where("completed_at", "<", completedCutoff);
				if (protectIds.length > 0) deleteQuery = deleteQuery.where("event_id", "not in", protectIds);
				deleted += affectedRows(executeSqliteQuerySync(tx.db, deleteQuery));
			}
			if (failedCutoff !== null) {
				let deleteQuery = kysely.deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("status", "=", "failed").where("failed_at", "<", failedCutoff);
				if (protectIds.length > 0) deleteQuery = deleteQuery.where("event_id", "not in", protectIds);
				deleted += affectedRows(executeSqliteQuerySync(tx.db, deleteQuery));
			}
			const pruneMaxEntries = (status, maxEntries) => {
				if (maxEntries === null) return;
				const batchSize = 500;
				const protectedSet = new Set(protectIds);
				while (true) {
					const ids = executeSqliteQuerySync(tx.db, kysely.selectFrom("channel_ingress_events").select("event_id").where("queue_name", "=", queueName).where("status", "=", status).orderBy("updated_at", "desc").orderBy("event_id", "desc").limit(maxEntries + batchSize)).rows.slice(maxEntries).map((row) => row.event_id).filter((id) => !protectedSet.has(id));
					if (ids.length === 0) return;
					deleted += affectedRows(executeSqliteQuerySync(tx.db, kysely.deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("status", "=", status).where("event_id", "in", ids)));
				}
			};
			pruneMaxEntries("pending", pendingMaxEntries);
			pruneMaxEntries("completed", completedMaxEntries);
			pruneMaxEntries("failed", failedMaxEntries);
			return deleted;
		}, { path: openStateDatabase(options.stateDir).path });
	};
	return {
		enqueue,
		listPending,
		listClaims,
		claimNext,
		claim,
		refreshClaim,
		complete,
		release,
		fail,
		delete: deleteEntry,
		recoverStaleClaims,
		prune
	};
}
//#endregion
export { createChannelIngressQueue as t };

import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction, n as openExistingOpenClawStateDatabaseReadOnly, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { randomUUID } from "node:crypto";
//#region src/channels/message/ingress-queue.ts
/**
* Durable channel ingress queue.
*
* Stores, claims, completes, and tombstones inbound channel events in OpenClaw state.
*/
const FAILED_NULL_PAYLOAD_SENTINEL = "OPENCLAW_CHANNEL_INGRESS_FAILED_NULL_V1";
function normalizePart(value, fallback) {
	const normalized = value?.trim();
	return normalized ? normalized : fallback;
}
function createStateDirEnv(stateDir, baseEnv = process.env) {
	const env = Object.create(baseEnv);
	env.OPENCLAW_STATE_DIR = stateDir;
	return env;
}
function openChannelIngressDatabase(stateDir) {
	return openOpenClawStateDatabase({ env: stateDir ? createStateDirEnv(stateDir) : process.env });
}
/**
* Resolve a database handle for listing. Read-only callers get the non-creating opener
* and own closing it; read-write callers keep the shared cached handle they already had.
*/
async function openChannelIngressDatabaseForListing(stateDir, access) {
	if (access !== "read-only") return {
		db: openChannelIngressDatabase(stateDir).db,
		release: () => {}
	};
	const env = stateDir ? createStateDirEnv(stateDir) : process.env;
	const database = await openExistingOpenClawStateDatabaseReadOnly({ env });
	if (!database) return;
	return {
		db: database.db,
		release: () => {
			database.walMaintenance.close();
		}
	};
}
function getChannelIngressKysely(db) {
	return getNodeSqliteKysely(db);
}
function affectedRows(result) {
	return Number(result.numAffectedRows ?? 0n);
}
function parseJson(value) {
	try {
		return {
			ok: true,
			value: JSON.parse(value)
		};
	} catch {
		return { ok: false };
	}
}
function parseFailedPayload(value) {
	return value === FAILED_NULL_PAYLOAD_SENTINEL ? {
		ok: true,
		value: null
	} : parseJson(value);
}
function baseRecord(row) {
	const payloadResult = parseJson(row.payload_json);
	if (!payloadResult.ok) return null;
	const metaResult = row.metadata_json === null ? null : parseJson(row.metadata_json);
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		payload: payloadResult.value,
		...metaResult === null || !metaResult.ok ? {} : { metadata: metaResult.value },
		receivedAt: row.received_at,
		updatedAt: row.updated_at,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		attempts: row.attempts,
		...row.last_attempt_at === null ? {} : { lastAttemptAt: row.last_attempt_at },
		...row.last_error === null ? {} : { lastError: row.last_error }
	};
}
function decodeClaimColumns(row) {
	if (!row.claim_token || !row.claim_owner || row.claimed_at === null) return null;
	return {
		token: row.claim_token,
		ownerId: row.claim_owner,
		claimedAt: row.claimed_at
	};
}
function claimedRecord(row) {
	const claim = decodeClaimColumns(row);
	const base = claim === null ? null : baseRecord(row);
	if (claim === null || base === null) return null;
	return {
		...base,
		claim
	};
}
function corruptClaimRecord(row, claim) {
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		reason: "corrupt_payload",
		claim
	};
}
function completedRecord(row) {
	const metaResult = row.completed_metadata_json === null ? null : parseJson(row.completed_metadata_json);
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		completedAt: row.completed_at ?? row.updated_at,
		...metaResult === null || !metaResult.ok ? {} : { metadata: metaResult.value }
	};
}
function failedRecord(row) {
	const payloadResult = parseFailedPayload(row.payload_json);
	const metadataResult = row.metadata_json === null ? null : parseJson(row.metadata_json);
	return {
		id: row.event_id,
		channelId: row.channel_id,
		accountId: row.account_id,
		queueName: row.queue_name,
		...payloadResult.ok && row.payload_json !== "null" ? { payload: payloadResult.value } : {},
		...metadataResult?.ok ? { metadata: metadataResult.value } : {},
		receivedAt: row.received_at,
		updatedAt: row.updated_at,
		...row.lane_key === null ? {} : { laneKey: row.lane_key },
		attempts: row.attempts,
		...row.last_attempt_at === null ? {} : { lastAttemptAt: row.last_attempt_at },
		failedAt: row.failed_at ?? row.updated_at,
		reason: row.failed_reason ?? "failed",
		...row.last_error === null ? {} : { message: row.last_error }
	};
}
function selectRow(db, queueName, id) {
	const kysely = getChannelIngressKysely(db);
	return executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("event_id", "=", id));
}
function tombstoneCorruptRow(params) {
	const baseUpdate = getChannelIngressKysely(params.db).updateTable("channel_ingress_events").set((eb) => ({
		status: "failed",
		failed_at: params.failedAt,
		failed_reason: params.reason,
		last_error: null,
		...params.reason === "corrupt_payload" ? {
			payload_json: "null",
			metadata_json: null
		} : { payload_json: eb.case().when("payload_json", "=", "null").then(FAILED_NULL_PAYLOAD_SENTINEL).else(eb.ref("payload_json")).end() },
		claim_token: null,
		claim_owner: null,
		claimed_at: null,
		updated_at: params.failedAt
	})).where("queue_name", "=", params.row.queue_name).where("event_id", "=", params.row.event_id).where("status", "=", params.expectedStatus);
	if (params.expectedStatus === "pending") return affectedRows(executeSqliteQuerySync(params.db, baseUpdate)) > 0;
	const claimGuardedUpdate = params.row.claim_token === null ? baseUpdate.where("claim_token", "is", null) : baseUpdate.where("claim_token", "=", params.row.claim_token);
	const staleGuardedUpdate = params.staleCutoff === void 0 ? claimGuardedUpdate : claimGuardedUpdate.where("claimed_at", "<=", params.staleCutoff);
	return affectedRows(executeSqliteQuerySync(params.db, staleGuardedUpdate)) > 0;
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
	if (row.status === "claimed") {
		const rec = claimedRecord(row);
		return rec ? {
			kind: "claimed",
			duplicate: true,
			record: rec
		} : null;
	}
	const rec = baseRecord(row);
	return rec ? {
		kind: "pending",
		duplicate: true,
		record: rec
	} : null;
}
function normalizeLimit(limit) {
	return limit === "all" ? Number.MAX_SAFE_INTEGER : Math.max(1, Math.floor(limit ?? 100));
}
function normalizeScanLimit(limit) {
	return Math.max(1, Math.floor(limit ?? 100));
}
const LIST_PENDING_BATCH_SIZE = 100;
const MAX_CORRUPT_RECONCILIATIONS_PER_CLAIM = 100;
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
/**
* Account discovery for callers that must not touch durable state yet. Uses the
* non-creating read-only opener, so an absent store yields no accounts instead of
* being created and migrated by the lookup itself.
*/
async function listChannelIngressQueueAccountIdsReadOnly(params) {
	const channelId = normalizePart(params.channelId, "unknown");
	const handle = await openChannelIngressDatabaseForListing(params.stateDir, "read-only");
	if (!handle) return [];
	try {
		return executeSqliteQuerySync(handle.db, getChannelIngressKysely(handle.db).selectFrom("channel_ingress_events").select("account_id").distinct().where("channel_id", "=", channelId).orderBy("account_id", "asc")).rows.map((row) => row.account_id);
	} finally {
		handle.release();
	}
}
/** Creates a durable channel/account-scoped ingress queue backed by the OpenClaw state database. */
function createChannelIngressQueue(options) {
	const channelId = normalizePart(options.channelId, "unknown");
	const accountId = normalizePart(options.accountId, "default");
	const queueName = queueNameForParts(channelId, accountId);
	const now = options.now ?? Date.now;
	const access = options.access ?? "read-write";
	const enqueue = async (id, payload, enqueueOptions) => {
		const eventId = normalizePart(id, "");
		if (!eventId) throw new Error("Channel ingress event id cannot be empty");
		const receivedAt = enqueueOptions?.receivedAt ?? now();
		const updatedAt = now();
		const database = openChannelIngressDatabase(options.stateDir);
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
			if (affectedRows(insert) > 0) {
				const fresh = baseRecord(row);
				if (fresh === null) throw new Error(`Corrupt payload_json in channel ingress event ${queueName}/${eventId}`);
				return {
					kind: "accepted",
					duplicate: false,
					record: fresh
				};
			}
			const dup = rowToEnqueueResult(row);
			if (dup === null) {
				if (row.status === "claimed") throw new Error(`Corrupt claimed channel ingress event ${queueName}/${eventId}`);
				if (!tombstoneCorruptRow({
					db: tx.db,
					row,
					expectedStatus: "pending",
					failedAt: updatedAt,
					reason: "corrupt_payload"
				})) throw new Error(`Failed to tombstone corrupt ingress event ${queueName}/${eventId}`);
				const failedRow = selectRow(tx.db, queueName, eventId);
				if (!failedRow) throw new Error(`Failed to read corrupt ingress tombstone ${queueName}/${eventId}`);
				return {
					kind: "failed",
					duplicate: true,
					record: failedRecord(failedRow)
				};
			}
			return dup;
		}, { path: database.path });
	};
	const listPending = async (listOptions) => {
		const handle = await openChannelIngressDatabaseForListing(options.stateDir, access);
		if (!handle) return [];
		const { db } = handle;
		try {
			const kysely = getChannelIngressKysely(db);
			const limit = normalizeLimit(listOptions?.limit);
			const records = [];
			let lastRow;
			while (records.length < limit) {
				let pageQuery = kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "pending");
				if (lastRow) {
					const cursor = lastRow;
					pageQuery = listOptions?.orderBy === "id" ? pageQuery.where("event_id", ">", cursor.event_id) : pageQuery.where((eb) => eb.or([eb("received_at", ">", cursor.received_at), eb.and([eb("received_at", "=", cursor.received_at), eb("event_id", ">", cursor.event_id)])]));
				}
				const orderedQuery = listOptions?.orderBy === "id" ? pageQuery.orderBy("event_id", "asc") : pageQuery.orderBy("received_at", "asc").orderBy("event_id", "asc");
				const rows = executeSqliteQuerySync(db, orderedQuery.limit(LIST_PENDING_BATCH_SIZE)).rows;
				for (const row of rows) {
					const record = baseRecord(row);
					if (record) {
						records.push(record);
						if (records.length === limit) break;
					}
				}
				if (rows.length < LIST_PENDING_BATCH_SIZE) break;
				lastRow = rows.at(-1);
			}
			return records;
		} finally {
			handle.release();
		}
	};
	const listClaims = async () => {
		const handle = await openChannelIngressDatabaseForListing(options.stateDir, access);
		if (!handle) return [];
		const { db } = handle;
		try {
			const kysely = getChannelIngressKysely(db);
			return executeSqliteQuerySync(db, kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "claimed").orderBy("claimed_at", "asc").orderBy("received_at", "asc").orderBy("event_id", "asc")).rows.map((row) => claimedRecord(row)).filter((rec) => rec !== null);
		} finally {
			handle.release();
		}
	};
	const listFailed = async (listOptions) => {
		const handle = await openChannelIngressDatabaseForListing(options.stateDir, access);
		if (!handle) return [];
		const { db } = handle;
		try {
			return executeSqliteQuerySync(db, getChannelIngressKysely(db).selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "failed").orderBy("failed_at", "asc").orderBy("event_id", "asc").limit(normalizeLimit(listOptions?.limit))).rows.map((row) => failedRecord(row));
		} finally {
			handle.release();
		}
	};
	const claimNext = async (claimOptions) => {
		if (claimOptions?.staleMs !== void 0) await recoverStaleClaims({ staleMs: claimOptions.staleMs });
		const blocked = new Set([...claimOptions?.blockedLaneKeys ?? []].map((key) => key.trim()).filter(Boolean));
		const candidateIds = normalizedCandidateIds(claimOptions?.candidateIds);
		if (candidateIds?.length === 0) return null;
		const resolveClaimLaneKey = (record) => {
			const storedLaneKey = record.laneKey;
			if (storedLaneKey === void 0) return claimOptions?.deriveLaneKey?.(record);
			if (!claimOptions?.deriveLaneKey || !claimOptions.reconcileStoredLaneKey) return storedLaneKey;
			const derivedLaneKey = claimOptions.deriveLaneKey(record);
			if (!derivedLaneKey || derivedLaneKey === storedLaneKey) return storedLaneKey;
			return claimOptions.reconcileStoredLaneKey(record, storedLaneKey, derivedLaneKey) ? derivedLaneKey : storedLaneKey;
		};
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			let effectiveBlocked = blocked;
			if (candidateIds && candidateIds.length > 0) {
				const claimedCandidateLaneKeys = executeSqliteQuerySync(tx.db, kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "claimed").where("event_id", "in", candidateIds)).rows.map((row) => {
					if (row.lane_key && !claimOptions?.reconcileStoredLaneKey) return row.lane_key;
					const rec = baseRecord(row);
					return rec ? resolveClaimLaneKey(rec) : row.lane_key ?? void 0;
				}).filter((laneKey) => Boolean(laneKey));
				if (claimedCandidateLaneKeys.length > 0) effectiveBlocked = /* @__PURE__ */ new Set([...blocked, ...claimedCandidateLaneKeys]);
			}
			let select = kysely.selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "pending");
			if (candidateIds) select = select.where("event_id", "in", candidateIds);
			if (effectiveBlocked.size > 0 && !claimOptions?.deriveLaneKey) select = select.where((eb) => eb.or([eb("lane_key", "is", null), eb("lane_key", "not in", [...effectiveBlocked])]));
			let orderedSelect = claimOptions?.orderBy === "id" ? select.orderBy("event_id", "asc") : select.orderBy("received_at", "asc").orderBy("event_id", "asc");
			orderedSelect = orderedSelect.limit(normalizeScanLimit(claimOptions?.scanLimit));
			const transitionAt = now();
			let corruptReconciliations = 0;
			let selected;
			while (!selected) {
				const rows = executeSqliteQuerySync(tx.db, orderedSelect).rows;
				let tombstonedCorruptRow = false;
				for (const row of rows) {
					const rec = baseRecord(row);
					if (rec === null) {
						if (corruptReconciliations >= MAX_CORRUPT_RECONCILIATIONS_PER_CLAIM) continue;
						const didTombstone = tombstoneCorruptRow({
							db: tx.db,
							row,
							expectedStatus: "pending",
							failedAt: transitionAt,
							reason: "corrupt_payload"
						});
						tombstonedCorruptRow = didTombstone || tombstonedCorruptRow;
						if (didTombstone) corruptReconciliations += 1;
						continue;
					}
					const laneKey = resolveClaimLaneKey(rec);
					if (!laneKey || !effectiveBlocked.has(laneKey)) {
						selected = {
							row,
							record: rec
						};
						break;
					}
				}
				if (selected || !tombstonedCorruptRow || corruptReconciliations >= MAX_CORRUPT_RECONCILIATIONS_PER_CLAIM) break;
			}
			if (!selected) return null;
			const derivedLaneKey = resolveClaimLaneKey(selected.record);
			const token = randomUUID();
			const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
			if (affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set({
				status: "claimed",
				claim_token: token,
				claim_owner: ownerId,
				claimed_at: transitionAt,
				...derivedLaneKey ? { lane_key: derivedLaneKey } : {},
				updated_at: transitionAt
			}).where("queue_name", "=", queueName).where("event_id", "=", selected.row.event_id).where("status", "=", "pending"))) === 0) return null;
			const row = selectRow(tx.db, queueName, selected.row.event_id);
			return row ? claimedRecord(row) : null;
		}, { path: database.path });
	};
	const claim = async (id, claimOptions) => {
		const eventId = normalizePart(id, "");
		if (!eventId) throw new Error("Channel ingress event id cannot be empty");
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			const transitionAt = now();
			const pendingRow = selectRow(tx.db, queueName, eventId);
			if (!pendingRow || pendingRow.status !== "pending") return null;
			if (baseRecord(pendingRow) === null) {
				tombstoneCorruptRow({
					db: tx.db,
					row: pendingRow,
					expectedStatus: "pending",
					failedAt: transitionAt,
					reason: "corrupt_payload"
				});
				return null;
			}
			const token = randomUUID();
			const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
			if (affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set({
				status: "claimed",
				claim_token: token,
				claim_owner: ownerId,
				claimed_at: transitionAt,
				updated_at: transitionAt
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId).where("status", "=", "pending"))) === 0) return null;
			const row = selectRow(tx.db, queueName, eventId);
			return row ? claimedRecord(row) : null;
		}, { path: database.path });
	};
	const refreshClaim = async (claimRef, refreshOptions) => {
		const eventId = idFrom(claimRef);
		const refreshedAt = refreshOptions?.refreshedAt ?? now();
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const kysely = getChannelIngressKysely(tx.db);
			return affectedRows(executeSqliteQuerySync(tx.db, kysely.updateTable("channel_ingress_events").set({
				claimed_at: refreshedAt,
				updated_at: refreshedAt
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId).where("status", "=", "claimed").where("claim_token", "=", claimRef.claim.token))) > 0;
		}, { path: database.path });
	};
	const releaseClaimIfStillStale = async (claimRef, releaseOptions) => {
		const eventId = idFrom(claimRef);
		const database = openChannelIngressDatabase(options.stateDir);
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
		}, { path: database.path });
	};
	const recoverStaleClaims = async (recoverOptions) => {
		const current = recoverOptions?.now ?? now();
		const cutoff = current - Math.max(0, Math.floor(recoverOptions?.staleMs ?? 0));
		const database = openChannelIngressDatabase(options.stateDir);
		const claimedRows = executeSqliteQuerySync(database.db, getChannelIngressKysely(database.db).selectFrom("channel_ingress_events").selectAll().where("queue_name", "=", queueName).where("status", "=", "claimed").where((eb) => eb.or([
			eb("claimed_at", "<=", cutoff),
			eb("claimed_at", "is", null),
			eb("claim_token", "is", null),
			eb("claim_owner", "is", null),
			eb("claim_token", "=", ""),
			eb("claim_owner", "=", "")
		]))).rows;
		let recovered = 0;
		for (const row of claimedRows) {
			const claimColumns = decodeClaimColumns(row);
			const claimRec = claimColumns === null ? null : claimedRecord(row);
			if (claimRec === null) {
				if (claimColumns !== null) {
					const shouldRecoverCorrupt = recoverOptions?.shouldRecoverCorrupt;
					if (shouldRecoverCorrupt) {
						if (!await shouldRecoverCorrupt(corruptClaimRecord(row, claimColumns))) continue;
					} else if (recoverOptions?.shouldRecover) continue;
				}
				if (runOpenClawStateWriteTransaction((tx) => tombstoneCorruptRow({
					db: tx.db,
					row,
					expectedStatus: "claimed",
					failedAt: current,
					...claimColumns === null ? {} : { staleCutoff: cutoff },
					reason: claimColumns === null ? "corrupt_claim" : "corrupt_payload"
				}), { path: database.path })) recovered += 1;
				continue;
			}
			if (recoverOptions?.shouldRecover && !await recoverOptions.shouldRecover(claimRec)) continue;
			if (await releaseClaimIfStillStale(claimRec, {
				cutoff,
				releasedAt: current
			})) recovered += 1;
		}
		return recovered;
	};
	const complete = async (idOrClaim, completeOptions) => {
		const eventId = idFrom(idOrClaim);
		const token = claimTokenFrom(idOrClaim);
		const completedAt = completeOptions?.completedAt ?? now();
		const database = openChannelIngressDatabase(options.stateDir);
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
		}, { path: database.path });
	};
	const release = async (idOrClaim, releaseOptions) => {
		const eventId = idFrom(idOrClaim);
		const token = claimTokenFrom(idOrClaim);
		const releasedAt = releaseOptions?.releasedAt ?? now();
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const baseUpdate = getChannelIngressKysely(tx.db).updateTable("channel_ingress_events").set((eb) => ({
				status: "pending",
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				...releaseOptions?.recordAttempt === false ? {} : {
					attempts: eb("attempts", "+", 1),
					last_attempt_at: releasedAt
				},
				...releaseOptions?.lastError === void 0 ? {} : { last_error: releaseOptions.lastError },
				updated_at: releasedAt
			})).where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const update = token === null ? baseUpdate.where("status", "=", "pending") : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
			return affectedRows(executeSqliteQuerySync(tx.db, update)) > 0;
		}, { path: database.path });
	};
	const fail = async (idOrClaim, failOptions) => {
		const eventId = idFrom(idOrClaim);
		const token = claimTokenFrom(idOrClaim);
		const failedAt = failOptions.failedAt ?? now();
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const baseUpdate = getChannelIngressKysely(tx.db).updateTable("channel_ingress_events").set((eb) => ({
				status: "failed",
				failed_at: failedAt,
				failed_reason: failOptions.reason,
				last_error: failOptions.message ?? null,
				payload_json: eb.case().when("payload_json", "=", "null").then(FAILED_NULL_PAYLOAD_SENTINEL).else(eb.ref("payload_json")).end(),
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				updated_at: failedAt
			})).where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const update = token === null ? baseUpdate.where("status", "=", "pending") : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
			return affectedRows(executeSqliteQuerySync(tx.db, update)) > 0;
		}, { path: database.path });
	};
	const resubmit = async (id, resubmitOptions) => {
		const eventId = idFrom(id);
		const resubmittedAt = resubmitOptions?.resubmittedAt ?? now();
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const row = selectRow(tx.db, queueName, eventId);
			if (!row) return { kind: "not-found" };
			if (row.status === "completed") return {
				kind: "completed",
				record: completedRecord(row)
			};
			if (row.status !== "failed") return {
				kind: "active",
				status: row.status === "claimed" ? "claimed" : "pending"
			};
			const previous = failedRecord(row);
			if (row.payload_json === "null" || !parseFailedPayload(row.payload_json).ok) return {
				kind: "unrecoverable",
				record: previous
			};
			if (affectedRows(executeSqliteQuerySync(tx.db, getChannelIngressKysely(tx.db).updateTable("channel_ingress_events").set({
				status: "pending",
				payload_json: row.payload_json === FAILED_NULL_PAYLOAD_SENTINEL ? "null" : row.payload_json,
				received_at: resubmittedAt,
				updated_at: resubmittedAt,
				attempts: 0,
				last_attempt_at: null,
				last_error: null,
				failed_at: null,
				failed_reason: null,
				claim_token: null,
				claim_owner: null,
				claimed_at: null,
				completed_at: null,
				completed_metadata_json: null
			}).where("queue_name", "=", queueName).where("event_id", "=", eventId).where("status", "=", "failed"))) === 0) return {
				kind: "active",
				status: "pending"
			};
			const updated = selectRow(tx.db, queueName, eventId);
			const record = updated ? baseRecord(updated) : null;
			if (!record) throw new Error(`Failed to read resubmitted channel ingress event ${queueName}/${eventId}`);
			return {
				kind: "resubmitted",
				record,
				previous
			};
		}, { path: database.path });
	};
	const deleteEntry = async (idOrRecord) => {
		const eventId = idFrom(idOrRecord);
		const token = claimTokenFrom(idOrRecord);
		const database = openChannelIngressDatabase(options.stateDir);
		return runOpenClawStateWriteTransaction((tx) => {
			const baseDelete = getChannelIngressKysely(tx.db).deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("event_id", "=", eventId);
			const deleteQuery = token === null ? baseDelete.where("status", "=", "pending") : baseDelete.where("status", "=", "claimed").where("claim_token", "=", token);
			return affectedRows(executeSqliteQuerySync(tx.db, deleteQuery)) > 0;
		}, { path: database.path });
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
		const database = openChannelIngressDatabase(options.stateDir);
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
					const ids = executeSqliteQuerySync(tx.db, kysely.selectFrom("channel_ingress_events").select("event_id").where("queue_name", "=", queueName).where("status", "=", status).orderBy("updated_at", "desc").orderBy("event_id", "desc").limit(batchSize).offset(maxEntries)).rows.map((row) => row.event_id).filter((id) => !protectedSet.has(id));
					if (ids.length === 0) return;
					deleted += affectedRows(executeSqliteQuerySync(tx.db, kysely.deleteFrom("channel_ingress_events").where("queue_name", "=", queueName).where("status", "=", status).where("event_id", "in", ids)));
				}
			};
			pruneMaxEntries("pending", pendingMaxEntries);
			pruneMaxEntries("completed", completedMaxEntries);
			pruneMaxEntries("failed", failedMaxEntries);
			return deleted;
		}, { path: database.path });
	};
	return {
		enqueue,
		listPending,
		listClaims,
		listFailed,
		claimNext,
		claim,
		refreshClaim,
		complete,
		release,
		fail,
		resubmit,
		delete: deleteEntry,
		recoverStaleClaims,
		prune
	};
}
//#endregion
export { openChannelIngressDatabase as i, getChannelIngressKysely as n, listChannelIngressQueueAccountIdsReadOnly as r, createChannelIngressQueue as t };

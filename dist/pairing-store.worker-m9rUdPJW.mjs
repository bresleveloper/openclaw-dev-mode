import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as resolveAllowFromAccountId, r as resolvePairingRequestAccountId, t as dedupePreserveOrder } from "./pairing-store-keys-BTumx1Bd.mjs";
import { i as readChannelPairingSnapshotFromDatabase, r as readChannelPairingRequests, t as normalizePersistedPairingRequest } from "./pairing-store-sqlite-CdNwdKeg.mjs";
import { a as requestMatchesAccountId, i as pruneExpiredRequests, n as generateUniqueCode, o as resolveChannelPairingRequestId, r as pruneExcessRequestsByAccount } from "./pairing-store-model-BZ_ZsMmG.mjs";
import { MessageChannel, receiveMessageOnPort } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/pairing/pairing-store.worker.ts
function selectedRequest(requests, accountId, selector) {
	return requests.find((request) => requestMatchesAccountId(request, accountId) && ("code" in selector ? request.code.toUpperCase() === selector.code : resolveChannelPairingRequestId(selector.channel, request) === selector.requestId));
}
/** Preserve canonical snapshot normalization without rewriting unchanged rows. */
function writeChanges(database, channel, snapshot) {
	const db = getNodeSqliteKysely(database.db);
	const requests = snapshot.state.requests.flatMap((value) => {
		const request = normalizePersistedPairingRequest(value);
		return request ? [{
			channel_key: channel,
			account_id: resolvePairingRequestAccountId(request),
			request_id: request.id,
			code: request.code,
			created_at: request.createdAt,
			last_seen_at: request.lastSeenAt,
			meta_json: request.meta ? JSON.stringify(request.meta) : null
		}] : [];
	});
	const requestKey = (row) => JSON.stringify([row.account_id, row.request_id]);
	const oldRequests = new Map(snapshot.requestRows.map((row) => [requestKey(row), row]));
	const newRequests = new Set(requests.map(requestKey));
	if (newRequests.size !== requests.length) throw new Error("Duplicate normalized channel pairing request");
	const removedRequests = snapshot.requestRows.filter((row) => !newRequests.has(requestKey(row)));
	for (let offset = 0; offset < removedRequests.length; offset += 100) {
		const removed = removedRequests.slice(offset, offset + 100);
		executeSqliteQuerySync(database.db, db.deleteFrom("channel_pairing_requests").where("channel_key", "=", channel).where((eb) => eb.or(removed.map((row) => eb.and([eb("account_id", "=", row.account_id), eb("request_id", "=", row.request_id)])))));
	}
	const changedRequests = requests.filter((row) => !isDeepStrictEqual(row, { ...oldRequests.get(requestKey(row)) }));
	for (let offset = 0; offset < changedRequests.length; offset += 100) executeSqliteQuerySync(database.db, db.insertInto("channel_pairing_requests").values(changedRequests.slice(offset, offset + 100)).onConflict((oc) => oc.columns([
		"channel_key",
		"account_id",
		"request_id"
	]).doUpdateSet((eb) => ({
		code: eb.ref("excluded.code"),
		created_at: eb.ref("excluded.created_at"),
		last_seen_at: eb.ref("excluded.last_seen_at"),
		meta_json: eb.ref("excluded.meta_json")
	}))));
	const now = Date.now();
	const entries = Object.entries(snapshot.state.allowFrom ?? {}).flatMap(([account, values]) => dedupePreserveOrder(values.map((value) => normalizeOptionalString(value) ?? "").filter((value) => value && value !== "*")).map((entry, sort_order) => ({
		channel_key: channel,
		account_id: resolveAllowFromAccountId(account),
		entry,
		sort_order
	})));
	const entryKey = (row) => JSON.stringify([row.account_id, row.entry]);
	const oldEntries = new Map(snapshot.allowRows.map((row) => [entryKey(row), row]));
	const newEntries = new Set(entries.map(entryKey));
	const removedEntries = snapshot.allowRows.filter((row) => !newEntries.has(entryKey(row)));
	for (let offset = 0; offset < removedEntries.length; offset += 100) executeSqliteQuerySync(database.db, db.deleteFrom("channel_pairing_allow_entries").where("channel_key", "=", channel).where((eb) => eb.or(removedEntries.slice(offset, offset + 100).map((row) => eb.and([eb("account_id", "=", row.account_id), eb("entry", "=", row.entry)])))));
	const changedEntries = entries.filter((row) => oldEntries.get(entryKey(row))?.sort_order !== row.sort_order);
	for (let offset = 0; offset < changedEntries.length; offset += 100) executeSqliteQuerySync(database.db, db.insertInto("channel_pairing_allow_entries").values(changedEntries.slice(offset, offset + 100).map((row) => ({
		channel_key: row.channel_key,
		account_id: row.account_id,
		entry: row.entry,
		sort_order: row.sort_order,
		updated_at: now
	}))).onConflict((oc) => oc.columns([
		"channel_key",
		"account_id",
		"entry"
	]).doUpdateSet((eb) => ({
		sort_order: eb.ref("excluded.sort_order"),
		updated_at: now
	}))));
}
function prepareApproval(channel, entry) {
	const { port1, port2 } = new MessageChannel();
	try {
		requestSqliteWorkerOperationAdmission({
			stage: "prepare",
			facts: {
				kind: "channel-pairing-approval",
				channel,
				entry,
				replyPort: port2
			}
		}, [port2]);
		const normalized = receiveMessageOnPort(port1)?.message;
		if (typeof normalized !== "string") throw new Error("Channel pairing approval preparation did not return an entry");
		return normalized;
	} finally {
		port1.close();
		port2.close();
	}
}
const channelPairingOperations = { "channelPairing.mutate": ({ channel, mutation }, context) => {
	for (;;) {
		let prepared;
		let normalizedApproval = "";
		if (mutation.action === "resolve" && mutation.approval === "host") {
			const pruned = pruneExpiredRequests(withExistingOpenClawStateDatabaseReadOnly(({ db }) => readChannelPairingRequests(db, channel), context.stateOptions()) ?? [], Date.now());
			prepared = selectedRequest(pruned.requests, mutation.accountId, mutation.selector);
			if (!prepared && !pruned.removed) {
				context.open();
				requestSqliteWorkerOperationAdmission({
					stage: "commit",
					facts: {
						kind: "channel-pairing",
						channel
					}
				});
				return {
					action: "resolve",
					result: null
				};
			}
			if (prepared) normalizedApproval = prepareApproval(channel, prepared);
		}
		const outcome = context.write((database) => {
			requestSqliteWorkerOperationAdmission({
				stage: "transaction",
				facts: {
					kind: "channel-pairing",
					channel
				}
			});
			const snapshot = readChannelPairingSnapshotFromDatabase(database, channel);
			const state = snapshot.state;
			let changed;
			let result;
			if (mutation.action === "allow") {
				const current = (state.allowFrom?.[mutation.accountId] ?? []).slice();
				const next = mutation.remove ? current.filter((entry) => normalizeOptionalString(entry) !== mutation.entry) : current.includes(mutation.entry) ? current : [...current, mutation.entry];
				changed = Boolean(mutation.entry) && !isDeepStrictEqual(current, next);
				if (changed) {
					state.allowFrom ??= {};
					state.allowFrom[mutation.accountId] = next;
				}
				result = {
					action: "allow",
					changed,
					allowFrom: changed ? next : current
				};
			} else {
				const nowMs = Date.now();
				const expired = pruneExpiredRequests(state.requests, nowMs);
				state.requests = expired.requests;
				changed = expired.removed;
				if (mutation.action === "list") {
					const capped = pruneExcessRequestsByAccount(state.requests);
					state.requests = capped.requests;
					changed ||= capped.removed;
					result = {
						action: "list",
						requests: state.requests.filter((entry) => requestMatchesAccountId(entry, mutation.accountId)).toSorted((left, right) => left.createdAt.localeCompare(right.createdAt) || resolvePairingRequestAccountId(left).localeCompare(resolvePairingRequestAccountId(right)) || left.id.localeCompare(right.id))
					};
				} else if (mutation.action === "upsert") {
					const existingCodes = new Set(state.requests.map((request) => request.code.toUpperCase()));
					const existing = state.requests.findIndex((request) => request.id === mutation.id && requestMatchesAccountId(request, mutation.accountId));
					const now = new Date(nowMs).toISOString();
					if (existing >= 0) {
						const previous = state.requests[existing];
						state.requests[existing] = {
							id: mutation.id,
							code: previous.code,
							createdAt: previous.createdAt,
							lastSeenAt: now,
							meta: mutation.meta
						};
						state.requests = pruneExcessRequestsByAccount(state.requests).requests;
						changed = true;
						result = {
							action: "upsert",
							code: previous.code,
							created: false
						};
					} else {
						const capped = pruneExcessRequestsByAccount(state.requests);
						state.requests = capped.requests;
						changed ||= capped.removed;
						if (state.requests.filter((request) => requestMatchesAccountId(request, mutation.accountId)).length >= 3) result = {
							action: "upsert",
							code: "",
							created: false
						};
						else {
							const code = generateUniqueCode(existingCodes);
							state.requests.push({
								id: mutation.id,
								code,
								createdAt: now,
								lastSeenAt: now,
								meta: mutation.meta
							});
							changed = true;
							result = {
								action: "upsert",
								code,
								created: true
							};
						}
					}
				} else {
					const entry = selectedRequest(state.requests, mutation.accountId, mutation.selector);
					if (mutation.approval === "host" && !isDeepStrictEqual(entry, prepared)) {
						requestSqliteWorkerOperationAdmission({
							stage: "commit",
							facts: {
								kind: "channel-pairing",
								channel
							}
						});
						return;
					}
					if (entry) {
						state.requests = state.requests.filter((request) => request !== entry);
						changed = true;
						if (mutation.approval === "sender") {
							normalizedApproval = normalizeOptionalString(entry.id) ?? "";
							if (normalizedApproval === "*") normalizedApproval = "";
						}
						if (mutation.approval !== "dismiss" && normalizedApproval) {
							const accountId = resolveAllowFromAccountId(mutation.accountId || entry.meta?.accountId);
							const current = state.allowFrom?.[accountId] ?? [];
							if (!current.includes(normalizedApproval)) {
								state.allowFrom ??= {};
								state.allowFrom[accountId] = [...current, normalizedApproval];
							}
						}
					}
					result = {
						action: "resolve",
						result: entry ? {
							id: entry.id,
							entry
						} : null
					};
				}
			}
			if (changed) writeChanges(database, channel, snapshot);
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: {
					kind: "channel-pairing",
					channel
				}
			});
			return result;
		}, { operationLabel: "channel-pairing.mutate" });
		if (outcome) return outcome;
	}
} };
//#endregion
export { channelPairingOperations };

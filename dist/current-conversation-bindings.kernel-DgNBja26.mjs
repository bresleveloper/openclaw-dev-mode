import { g as isFutureDateTimestampMs, o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { a as getNodeSqliteKysely, c as prepareSqliteQuerySync, l as prepareSqliteQueryTakeFirstSync, n as createSqliteQueryCache } from "./kysely-sync-K7ftY-g4.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { i as normalizeConversationRef, t as currentConversationBindingRow } from "./current-conversation-binding-row-BCcBsEeZ.mjs";
//#region src/infra/outbound/current-conversation-bindings.kernel.ts
const CURRENT_BINDINGS_ID_PREFIX = "generic:";
const CURRENT_BINDING_CONVERSATION_KIND = "current";
function createCurrentConversationBindingQueries(db) {
	const bindingDb = getNodeSqliteKysely(db);
	const select = bindingDb.selectFrom("current_conversation_bindings").select([
		"binding_key",
		"binding_id",
		"target_session_key",
		"record_json"
	]);
	function lists(genericOnly) {
		const query = genericOnly ? select.where("binding_id", "like", `${CURRENT_BINDINGS_ID_PREFIX}%`) : select;
		return {
			bySession: prepareSqliteQuerySync(db, (parameter) => query.where("target_session_key", "=", parameter((target) => target)).orderBy("binding_id", "asc")),
			byScope: prepareSqliteQuerySync(db, (parameter) => query.where("target_session_key", "=", parameter((params) => params.targetSessionKey)).where("channel", "=", parameter((params) => params.scope.channel)).where("account_id", "=", parameter((params) => params.scope.accountId)).orderBy("binding_id", "asc"))
		};
	}
	return {
		exact: prepareSqliteQueryTakeFirstSync(db, (parameter) => select.where("binding_key", "=", parameter((key) => key))),
		legacy: prepareSqliteQuerySync(db, (parameter) => select.where("channel", "=", parameter((conversation) => conversation.channel)).where("account_id", "=", parameter((conversation) => conversation.accountId)).where("conversation_kind", "=", CURRENT_BINDING_CONVERSATION_KIND).where("conversation_id", "=", parameter((conversation) => conversation.conversationId))),
		remove: prepareSqliteQuerySync(db, (parameter) => bindingDb.deleteFrom("current_conversation_bindings").where("binding_key", "=", parameter((key) => key))),
		upsert: prepareSqliteQuerySync(db, (parameter) => {
			const row = {
				binding_key: parameter((value) => value.binding_key),
				binding_id: parameter((value) => value.binding_id),
				target_session_key: parameter((value) => value.target_session_key),
				channel: parameter((value) => value.channel),
				account_id: parameter((value) => value.account_id),
				conversation_kind: parameter((value) => value.conversation_kind),
				parent_conversation_id: parameter((value) => value.parent_conversation_id),
				conversation_id: parameter((value) => value.conversation_id),
				target_kind: parameter((value) => value.target_kind),
				status: parameter((value) => value.status),
				bound_at: parameter((value) => value.bound_at),
				expires_at: parameter((value) => value.expires_at),
				metadata_json: parameter((value) => value.metadata_json),
				record_json: parameter((value) => value.record_json),
				updated_at: parameter((value) => value.updated_at)
			};
			return bindingDb.insertInto("current_conversation_bindings").values(row).onConflict((conflict) => conflict.column("binding_key").doUpdateSet(row));
		}),
		generic: lists(true),
		all: lists(false)
	};
}
const getCurrentConversationBindingQueries = createSqliteQueryCache(createCurrentConversationBindingQueries);
function buildConversationKey(ref) {
	return [
		ref.channel,
		ref.accountId,
		ref.parentConversationId ?? "",
		ref.conversationId
	].join("␟");
}
function buildBindingId(ref) {
	return `${CURRENT_BINDINGS_ID_PREFIX}${buildConversationKey(ref)}`;
}
function isBindingExpired(record, now = Date.now()) {
	if (record.expiresAt === void 0) return false;
	const expiresAt = asDateTimestampMs(record.expiresAt);
	if (expiresAt === void 0) return true;
	const nowMs = asDateTimestampMs(now);
	return nowMs !== void 0 && !isFutureDateTimestampMs(expiresAt, { nowMs });
}
function normalizePersistedBindingRecord(record) {
	if (!record?.bindingId || !record?.conversation?.conversationId) return null;
	const conversation = normalizeConversationRef(record.conversation);
	const targetSessionKey = record.targetSessionKey?.trim() ?? "";
	if (!targetSessionKey) return null;
	return {
		...record,
		bindingId: record.bindingId.startsWith("generic:") ? buildBindingId(conversation) : record.bindingId,
		targetSessionKey,
		conversation
	};
}
function bindingRowsToRecords(rows) {
	return rows.flatMap((row) => {
		try {
			const normalized = normalizePersistedBindingRecord(JSON.parse(row.record_json));
			return normalized ? [normalized] : [];
		} catch {
			return [];
		}
	});
}
function readCurrentConversationBindingRow(db, conversation, bindingKey) {
	const queries = getCurrentConversationBindingQueries(db);
	const exact = queries.exact(bindingKey);
	if (exact) return exact;
	return queries.legacy(conversation).rows.find((candidate) => {
		const record = bindingRowsToRecords([candidate])[0];
		return record !== void 0 && buildConversationKey(record.conversation) === bindingKey;
	});
}
function deleteCurrentConversationBindingRow(db, bindingKey) {
	getCurrentConversationBindingQueries(db).remove(bindingKey);
}
function updateCurrentConversationBindingRecordInDatabase(db, ref, update) {
	const conversation = normalizeConversationRef(ref);
	const bindingKey = buildConversationKey(conversation);
	const existingRow = readCurrentConversationBindingRow(db, conversation, bindingKey);
	const existing = existingRow ? bindingRowsToRecords([existingRow])[0] ?? null : null;
	const previous = existing && !isBindingExpired(existing) ? existing : null;
	const current = update(previous);
	if (!current) {
		if (existingRow) deleteCurrentConversationBindingRow(db, existingRow.binding_key);
		return {
			previous,
			current: null
		};
	}
	if (buildConversationKey(normalizeConversationRef(current.conversation)) !== bindingKey) throw new Error("Current conversation binding update changed its conversation owner");
	if (existingRow && existingRow.binding_key !== bindingKey) deleteCurrentConversationBindingRow(db, existingRow.binding_key);
	const row = currentConversationBindingRow(current, conversation, bindingKey);
	getCurrentConversationBindingQueries(db).upsert(row);
	return {
		previous,
		current
	};
}
function inspectCurrentConversationBindingRecordInDatabase(db, conversation, now = Date.now()) {
	const row = readCurrentConversationBindingRow(db, conversation, buildConversationKey(conversation));
	const record = row ? bindingRowsToRecords([row])[0] : void 0;
	return record && !isBindingExpired(record, now) ? record : null;
}
/** Higher-priority absences and later fallback rows must come from the same snapshot. */
function readCurrentConversationBindingSelectionInDatabase(db, conversations) {
	return runSqliteDeferredTransactionSync(db, () => {
		const now = Date.now();
		return conversations.map((conversation) => inspectCurrentConversationBindingRecordInDatabase(db, conversation, now));
	});
}
function readCurrentConversationBindingResolutionInDatabase(db, conversation) {
	const row = readCurrentConversationBindingRow(db, conversation, buildConversationKey(conversation));
	const record = row ? bindingRowsToRecords([row])[0] : void 0;
	return {
		record: record ?? null,
		repair: Boolean(row && record && (isBindingExpired(record) || row.binding_key !== buildConversationKey(record.conversation) || row.binding_id !== record.bindingId || row.target_session_key !== record.targetSessionKey))
	};
}
function listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope, genericOnly = !scope) {
	const queries = getCurrentConversationBindingQueries(db);
	const list = genericOnly ? queries.generic : queries.all;
	if (scope) {
		const normalized = normalizeConversationRef({
			...scope,
			conversationId: "binding-scope"
		});
		return list.byScope({
			targetSessionKey,
			scope: normalized
		}).rows;
	}
	return list.bySession(targetSessionKey).rows;
}
/** Warm listings avoid writer admission unless an expired record requires the existing repair. */
function readCurrentConversationBindingListInDatabase(db, targetSessionKey, scope) {
	const records = bindingRowsToRecords(listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope));
	return {
		records,
		requiresPrune: records.some((record) => isBindingExpired(record))
	};
}
/** Reread after writer admission; malformed rows keep the same expiry-triggered repair contract. */
function pruneCurrentConversationBindingListInTransaction(db, targetSessionKey, scope) {
	const rows = listCurrentConversationBindingRowsBySession(db, targetSessionKey, scope);
	const active = [];
	for (const row of rows) {
		const record = bindingRowsToRecords([row])[0];
		if (!record || isBindingExpired(record)) deleteCurrentConversationBindingRow(db, row.binding_key);
		else active.push(record);
	}
	return active;
}
//#endregion
export { inspectCurrentConversationBindingRecordInDatabase as a, pruneCurrentConversationBindingListInTransaction as c, readCurrentConversationBindingSelectionInDatabase as d, updateCurrentConversationBindingRecordInDatabase as f, deleteCurrentConversationBindingRow as i, readCurrentConversationBindingListInDatabase as l, bindingRowsToRecords as n, isBindingExpired as o, buildBindingId as r, listCurrentConversationBindingRowsBySession as s, CURRENT_BINDINGS_ID_PREFIX as t, readCurrentConversationBindingResolutionInDatabase as u };

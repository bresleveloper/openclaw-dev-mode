import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { a as executeSqliteQueryTakeFirstSync, d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as deferSqliteWorkerCommitReceipt, f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as mentionStoreHeadSchema, i as mentionStoreHeadAdmission, o as mentionStoreSourceSchema, t as MAX_MENTION_SOURCES } from "./mention-inbox-store-Dju8nmmI.mjs";
//#region src/gateway/mention-inbox-store.worker.ts
const HEAD_KEY = "notifications.mentions.head";
const SOURCE_PREFIX = "notifications.mentions.source.";
const SOURCE_END = "notifications.mentions.source/";
/** The existing machine-state primary key owns lookup; this feature creates no schema. */
function readMentionStoreHead(database) {
	const admitted = getSqliteDatabaseAdmission(database, mentionStoreHeadAdmission);
	if (admitted) return admitted;
	const db = getNodeSqliteKysely(database);
	const headRow = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", HEAD_KEY));
	const head = headRow ? mentionStoreHeadSchema.parse(JSON.parse(headRow.value_json)) : {
		revision: 0,
		nextSequence: 0
	};
	publishSqliteDatabaseAdmission(database, mentionStoreHeadAdmission, head);
	return head;
}
function readMentionStoreSnapshot(revision, database) {
	const db = getNodeSqliteKysely(database);
	if (getSqliteDatabaseAdmission(database, mentionStoreHeadAdmission)?.revision === revision) return;
	const snapshotRows = executeSqliteQuerySync(database, db.selectFrom("config_machine_state").select(["state_key", "value_json"]).where((eb) => eb.or([eb("state_key", "=", HEAD_KEY), eb.and([eb("state_key", ">=", SOURCE_PREFIX), eb("state_key", "<", SOURCE_END)])])).limit(MAX_MENTION_SOURCES + 2)).rows;
	const header = snapshotRows.find((row) => row.state_key === HEAD_KEY);
	const head = header ? mentionStoreHeadSchema.parse(JSON.parse(header.value_json)) : {
		revision: 0,
		nextSequence: 0
	};
	const current = getSqliteDatabaseAdmission(database, mentionStoreHeadAdmission);
	if (!current || current.revision <= head.revision) publishSqliteDatabaseAdmission(database, mentionStoreHeadAdmission, head);
	if (head.revision === revision) return;
	const rows = snapshotRows.filter((row) => row.state_key !== HEAD_KEY);
	if (rows.length > 1e4) throw new Error("Mention retention exceeds its source budget");
	const ids = /* @__PURE__ */ new Set();
	const sequences = /* @__PURE__ */ new Set();
	const sources = rows.map((row) => {
		if (row.value_json.length > 32768) throw new Error("Mention source exceeds its record budget");
		const source = mentionStoreSourceSchema.parse(JSON.parse(row.value_json));
		if (row.state_key !== `${SOURCE_PREFIX}${source.key}` || source.sequence >= head.nextSequence || sequences.has(source.sequence) || new Set(source.recipients.map(([profileId]) => profileId)).size !== source.recipients.length) throw new Error("Invalid mention source identity");
		sequences.add(source.sequence);
		for (const [, id] of source.recipients) {
			if (id === null) continue;
			if (!source.message || ids.has(id)) throw new Error("Invalid retained mention");
			ids.add(id);
		}
		if (source.message && source.expiresAt !== source.message.content.createdAt + 6048e5) throw new Error("Invalid mention retention window");
		return source;
	});
	if (ids.size > 1e4) throw new Error("Mention retention exceeds its item budget");
	return {
		head,
		sources: sources.toSorted((left, right) => left.sequence - right.sequence)
	};
}
/** Called only inside the owning SQLite write transaction. */
function writeMentionStoreChanges(database, head, changes) {
	if (changes.size === 0) return head;
	const next = mentionStoreHeadSchema.parse({
		...head,
		revision: head.revision + 1
	});
	const db = getNodeSqliteKysely(database);
	const updatedAtMs = Date.now();
	const writeValue = (stateKey, valueJson) => executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
		state_key: stateKey,
		value_json: valueJson,
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: updatedAtMs
	})));
	const deletedKeys = [];
	const flushDeletes = () => {
		if (deletedKeys.length === 0) return;
		const deletion = db.deleteFrom("config_machine_state");
		executeSqliteQuerySync(database, deletedKeys.length === 1 ? deletion.where("state_key", "=", deletedKeys[0]) : deletion.where("state_key", "in", sqliteStringSet(deletedKeys)));
		deletedKeys.length = 0;
	};
	for (const [key, source] of changes) {
		const stateKey = `${SOURCE_PREFIX}${key}`;
		if (!source) {
			deletedKeys.push(stateKey);
			continue;
		}
		flushDeletes();
		writeValue(stateKey, JSON.stringify(source));
	}
	flushDeletes();
	writeValue(HEAD_KEY, JSON.stringify(next));
	publishSqliteDatabaseAdmission(database, mentionStoreHeadAdmission, next);
	return next;
}
//#endregion
//#region src/gateway/mention-inbox.worker.ts
const mentionWorkerOperations = { "mentions.mutate": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => {
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts: void 0
	});
	const head = readMentionStoreHead(db);
	let result;
	if (head.revision !== input.expectedHead.revision || head.nextSequence !== input.expectedHead.nextSequence) {
		const snapshot = readMentionStoreSnapshot(-1, db);
		if (!snapshot) throw new Error("Mention snapshot is unavailable inside its transaction");
		result = {
			kind: "conflict",
			snapshot
		};
	} else result = {
		kind: "committed",
		head: writeMentionStoreChanges(db, {
			...head,
			nextSequence: input.nextSequence
		}, new Map(input.changes))
	};
	requestSqliteWorkerOperationAdmission({
		stage: "commit",
		facts: void 0
	});
	if (result.kind === "committed") deferSqliteWorkerCommitReceipt(db, result);
	return result;
}, {
	database: open(),
	...stateOptions()
}, { operationLabel: "mentions.mutate" }) };
//#endregion
export { mentionWorkerOperations };

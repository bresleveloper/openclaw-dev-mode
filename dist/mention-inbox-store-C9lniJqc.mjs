import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, nr as tuple } from "./schemas-BOYIvvln.mjs";
import "./sessions-DJqMAtE3.mjs";
//#region src/gateway/mention-inbox-store.ts
const MENTION_RETENTION_MS = 6048e5;
const MAX_MENTION_SOURCES = 1e4;
const HEAD_KEY = "notifications.mentions.head";
const SOURCE_PREFIX = "notifications.mentions.source.";
const SOURCE_END = "notifications.mentions.source/";
const reference = string().min(1).max(256);
const timestamp = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const headSchema = object({
	revision: timestamp,
	nextSequence: timestamp
});
const messageSchema = object({
	sessionId: reference,
	content: object({
		senderProfileId: reference,
		sessionKey: string().min(1).max(512),
		agentId: reference,
		messageId: reference,
		createdAt: timestamp,
		excerpt: string().max(280).optional()
	})
});
const sourceSchema = object({
	key: string().regex(/^[a-f0-9]{64}$/),
	sequence: timestamp,
	expiresAt: timestamp,
	recipients: array(tuple([reference, reference.nullable()])).max(10),
	message: messageSchema.optional()
});
/** The existing machine-state primary key owns lookup; this feature creates no schema. */
function readMentionStoreHead(database) {
	const db = getNodeSqliteKysely(database);
	const headRow = executeSqliteQueryTakeFirstSync(database, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", HEAD_KEY));
	return headRow ? headSchema.parse(JSON.parse(headRow.value_json)) : {
		revision: 0,
		nextSequence: 0
	};
}
function readMentionStoreSnapshot(revision, database) {
	const db = getNodeSqliteKysely(database);
	const head = readMentionStoreHead(database);
	if (head.revision === revision) return;
	const rows = executeSqliteQuerySync(database, db.selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", ">=", SOURCE_PREFIX).where("state_key", "<", SOURCE_END).limit(10001)).rows;
	if (rows.length > 1e4) throw new Error("Mention retention exceeds its source budget");
	const ids = /* @__PURE__ */ new Set();
	const sequences = /* @__PURE__ */ new Set();
	let itemCount = 0;
	const sources = rows.map((row) => {
		if (row.value_json.length > 32768) throw new Error("Mention source exceeds its record budget");
		const source = sourceSchema.parse(JSON.parse(row.value_json));
		if (row.state_key !== `${SOURCE_PREFIX}${source.key}` || source.sequence >= head.nextSequence || sequences.has(source.sequence) || new Set(source.recipients.map(([profileId]) => profileId)).size !== source.recipients.length) throw new Error("Invalid mention source identity");
		sequences.add(source.sequence);
		for (const [, id] of source.recipients) {
			if (id === null) continue;
			if (!source.message || ids.has(id)) throw new Error("Invalid retained mention");
			ids.add(id);
			itemCount++;
		}
		if (source.message && source.expiresAt !== source.message.content.createdAt + 6048e5) throw new Error("Invalid mention retention window");
		return source;
	});
	if (itemCount > 1e4) throw new Error("Mention retention exceeds its item budget");
	return {
		head,
		sources: sources.toSorted((left, right) => left.sequence - right.sequence)
	};
}
/** Called only inside the owning SQLite write transaction. */
function writeMentionStoreChanges(database, head, changes) {
	if (changes.size === 0) return head;
	const next = headSchema.parse({
		...head,
		revision: head.revision + 1
	});
	const db = getNodeSqliteKysely(database);
	const updatedAtMs = Date.now();
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
		const valueJson = JSON.stringify(source);
		executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
			state_key: stateKey,
			value_json: valueJson,
			updated_at_ms: updatedAtMs
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			value_json: valueJson,
			updated_at_ms: updatedAtMs
		})));
	}
	flushDeletes();
	executeSqliteQuerySync(database, db.insertInto("config_machine_state").values({
		state_key: HEAD_KEY,
		value_json: JSON.stringify(next),
		updated_at_ms: updatedAtMs
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: JSON.stringify(next),
		updated_at_ms: updatedAtMs
	})));
	return next;
}
//#endregion
export { writeMentionStoreChanges as a, readMentionStoreSnapshot as i, MENTION_RETENTION_MS as n, readMentionStoreHead as r, MAX_MENTION_SOURCES as t };

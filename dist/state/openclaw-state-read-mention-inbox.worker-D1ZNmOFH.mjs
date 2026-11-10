import { c as getSqliteDatabaseAdmission, v as publishSqliteDatabaseAdmission } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { _ as tuple, d as number, f as object, g as string, i as array } from "./openclaw-state-read-schemas-D2seJkFD.mjs";
import "./openclaw-state-read-sqlite-worker-operation-admission-we1rdJYO.mjs";
import "./openclaw-state-read-openclaw-state-db-Dhtiiltk.mjs";
const reference = string().min(1).max(256);
const timestamp = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const mentionStoreHeadSchema = object({
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
const mentionStoreSourceSchema = object({
	key: string().regex(/^[a-f0-9]{64}$/),
	sequence: timestamp,
	expiresAt: timestamp,
	recipients: array(tuple([reference, reference.nullable()])).max(10),
	message: messageSchema.optional()
});
const mentionStoreHeadAdmission = {
	name: "state.mention-head",
	read: (value) => mentionStoreHeadSchema.safeParse(value).data
};
//#endregion
//#region src/gateway/mention-inbox-store.worker.ts
const HEAD_KEY = "notifications.mentions.head";
const SOURCE_PREFIX = "notifications.mentions.source.";
const SOURCE_END = "notifications.mentions.source/";
function readMentionStoreSnapshot(revision, database) {
	const db = getNodeSqliteKysely(database);
	if (getSqliteDatabaseAdmission(database, mentionStoreHeadAdmission)?.revision === revision) return;
	const snapshotRows = executeSqliteQuerySync(database, db.selectFrom("config_machine_state").select(["state_key", "value_json"]).where((eb) => eb.or([eb("state_key", "=", HEAD_KEY), eb.and([eb("state_key", ">=", SOURCE_PREFIX), eb("state_key", "<", SOURCE_END)])])).limit(10002)).rows;
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
//#endregion
//#region src/gateway/mention-inbox.worker.ts
const mentionReadOperations = { "mentions.snapshot": (revision, db) => ({
	type: "mentions.snapshot",
	snapshot: readMentionStoreSnapshot(revision, db)
}) };
//#endregion
export { mentionReadOperations };

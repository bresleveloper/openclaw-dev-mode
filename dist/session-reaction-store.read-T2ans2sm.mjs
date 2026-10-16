import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
//#region src/config/sessions/session-reaction-store.read.ts
function reactionDb(database) {
	return getNodeSqliteKysely(database.db);
}
function summarizeReactions(rows) {
	const summaries = /* @__PURE__ */ new Map();
	for (const row of rows) {
		let summary = summaries.get(row.emoji);
		if (!summary) {
			summary = {
				emoji: row.emoji,
				count: 0,
				identities: []
			};
			summaries.set(row.emoji, summary);
		}
		summary.count += 1;
		summary.identities.push({
			id: row.identity_id,
			...row.identity_label ? { label: row.identity_label } : {}
		});
	}
	return [...summaries.values()];
}
function reactionRows(database, sessionKey, sessionId) {
	return reactionDb(database).selectFrom("session_reactions").selectAll().where("session_key", "=", sessionKey).where("session_id", "=", sessionId).orderBy("created_at").orderBy("emoji").orderBy("identity_id");
}
function listSessionReactionsInDatabase(database, sessionKey, params) {
	const messages = /* @__PURE__ */ new Map();
	for (const row of executeSqliteQuerySync(database.db, reactionRows(database, sessionKey, params.sessionId)).rows) {
		const rows = messages.get(row.message_id);
		if (rows) rows.push(row);
		else messages.set(row.message_id, [row]);
	}
	return Object.fromEntries([...messages].map(([messageId, rows]) => [messageId, summarizeReactions(rows)]));
}
//#endregion
export { summarizeReactions as i, reactionDb as n, reactionRows as r, listSessionReactionsInDatabase as t };

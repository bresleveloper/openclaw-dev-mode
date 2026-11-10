import { o as getSqliteReadScopeRevision } from "./sqlite-schema-facts-C8u_9Af1.mjs";
//#region src/config/sessions/session-transcript-context-facts.ts
const contextFacts = /* @__PURE__ */ new WeakMap();
function readTranscriptContextFacts(database, sessionId) {
	const revision = database.db.isTransaction ? getSqliteReadScopeRevision(database.db) : void 0;
	const retained = contextFacts.get(database.db);
	return revision && retained?.revision === revision && retained.sessionId === sessionId ? retained : void 0;
}
function retainTranscriptContextFacts(database, sessionId, version, revision, cold) {
	if (database.db.isTransaction && revision) contextFacts.set(database.db, {
		sessionId,
		revision,
		version: { ...version },
		cold
	});
}
//#endregion
export { retainTranscriptContextFacts as n, readTranscriptContextFacts as t };

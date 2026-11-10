import { G as sqliteSessionIdWriteScope, U as withSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
//#region src/config/sessions/session-actor-transaction.ts
let current;
/** Lends a private working copy only for the writer's synchronous transaction. */
function withSessionActorTransactionState(database, state, run, publishTranscript) {
	if (!database.db.isTransaction || current) throw new Error("Session actor facts require one owning synchronous transaction");
	current = {
		database: database.db,
		state,
		publishTranscript
	};
	try {
		const result = withSqliteDatabaseWriteScope(database.db, [...state.entryRows.keys(), ...state.hot.entry?.sessionId ? [sqliteSessionIdWriteScope(state.hot.entry.sessionId)] : []], run);
		if (result instanceof Promise) throw new Error("Session actor transactions cannot await work");
		return result;
	} finally {
		current = void 0;
	}
}
/** Enrich the mutation owner's one final authority receipt before it is published. */
function prepareSessionActorTranscriptAuthority(database, authority) {
	return current?.database === database.db && current.publishTranscript ? current.publishTranscript(authority) : authority;
}
/** Unbound native and SDK callers keep their existing database readers. */
function readSessionActorTransactionState(database, target) {
	const scope = current;
	if (!scope || scope.database !== database.db) return;
	if (!database.db.isTransaction) throw new Error("Session actor facts escaped their owning transaction");
	if (target?.sessionKey !== void 0 && !scope.state.entryRows.has(target.sessionKey) || target?.sessionId !== void 0 && scope.state.hot.entry?.sessionId !== target.sessionId) return;
	return scope.state;
}
const sharedCollections = /* @__PURE__ */ new WeakSet();
/** Rows and payloads are replaced, never edited; detach their collection on its first write. */
function writableSessionActorMap(rows) {
	return sharedCollections.has(rows) ? new Map(rows) : rows;
}
function writableSessionActorNavigation(navigation) {
	return sharedCollections.has(navigation) ? [...navigation] : navigation;
}
function replaceSessionActorStoredEntry(state, sessionKey, postimage) {
	state.entryRows = writableSessionActorMap(state.entryRows);
	state.entryRows.set(sessionKey, {
		entry: structuredClone(postimage.entry),
		row: postimage.row
	});
	state.hot.entry = structuredClone(postimage.entry);
	state.window = postimage.window;
}
/** Fork only mutable containers; discarded working state cannot change the resident preimage. */
function forkSessionActorStoredState(state) {
	for (const collection of [
		state.entryRows,
		state.pendingInputs,
		state.completions,
		state.transcript.identities,
		state.transcript.active,
		state.transcript.payloads,
		state.transcript.navigation
	]) sharedCollections.add(collection);
	return {
		...state,
		hot: {
			...state.hot,
			transcript: {
				...state.hot.transcript,
				version: { ...state.hot.transcript.version },
				watermark: { ...state.hot.transcript.watermark }
			}
		},
		window: state.window && { ...state.window },
		transcript: { ...state.transcript }
	};
}
//#endregion
export { withSessionActorTransactionState as a, replaceSessionActorStoredEntry as i, prepareSessionActorTranscriptAuthority as n, writableSessionActorMap as o, readSessionActorTransactionState as r, writableSessionActorNavigation as s, forkSessionActorStoredState as t };

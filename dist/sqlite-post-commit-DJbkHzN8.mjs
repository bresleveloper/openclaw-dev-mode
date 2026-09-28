import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
//#region src/infra/sqlite-post-commit.ts
const pendingPublications = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** Snapshots read within this managed transaction can still roll back. */
function hasSqlitePostCommitScope(db) {
	return pendingPublications.has(db);
}
/** Publications are non-throwing observers, never part of a durable transaction's result. */
function deferSqlitePostCommitPublication(db, publish) {
	const pending = pendingPublications.get(db);
	if (!pending) return false;
	pending.push(publish);
	return true;
}
/**
* Stage private transaction-local state that publishes before fallible observers.
* Observer preparation follows every committed state update. All callbacks must not throw.
*/
function stageSqliteTransactionState(db, state) {
	const pending = pendingTransactionState.get(db);
	if (!pending) return false;
	state.stage();
	pending.push({
		commit: state.commit,
		prepareObservers: state.prepareObservers,
		rollback: state.rollback
	});
	return true;
}
/** A lost transaction invalidates every savepoint's staged state and observers. */
function discardSqliteTransactionState(db, error) {
	pendingPublications.get(db)?.splice(0);
	const rolledBackState = pendingTransactionState.get(db)?.splice(0) ?? [];
	pendingPublications.delete(db);
	pendingTransactionState.delete(db);
	for (const state of rolledBackState.toReversed()) state.rollback(error);
}
/** Nested rollback restores staged state and discards observers; savepoints wait for outer commit. */
function withSqlitePostCommitPublications(db, transaction) {
	const nested = db.isTransaction;
	const publications = nested ? pendingPublications.get(db) : [];
	const transactionState = nested ? pendingTransactionState.get(db) : [];
	const publicationStart = publications?.length ?? 0;
	const stateStart = transactionState?.length ?? 0;
	if (!nested && publications && transactionState) {
		pendingPublications.set(db, publications);
		pendingTransactionState.set(db, transactionState);
	}
	let result;
	try {
		result = transaction();
	} catch (error) {
		publications?.splice(publicationStart);
		const rolledBackState = transactionState?.splice(stateStart) ?? [];
		for (const state of rolledBackState.toReversed()) state.rollback(error);
		throw error;
	} finally {
		if (!nested) {
			pendingPublications.delete(db);
			pendingTransactionState.delete(db);
		}
	}
	if (!nested) {
		for (const state of transactionState ?? []) state.commit();
		for (const state of transactionState ?? []) state.prepareObservers?.();
		for (const publish of publications ?? []) publish();
	}
	return result;
}
//#endregion
export { withSqlitePostCommitPublications as a, stageSqliteTransactionState as i, discardSqliteTransactionState as n, hasSqlitePostCommitScope as r, deferSqlitePostCommitPublication as t };

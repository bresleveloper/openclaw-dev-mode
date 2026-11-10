import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
//#region src/infra/sqlite-post-commit.ts
const log = createSubsystemLogger("sqlite/publication");
function committedPublicationState(publication) {
	return {
		commit: publication.installFacts,
		prepareObservers: publication.installProjection,
		invalidate: publication.invalidate,
		rollback: () => {}
	};
}
/**
* Installation is synchronous, including failure fencing. Observers cannot turn a
* committed write into a failed transaction or prevent another owner's receipt.
*/
function installCommittedState(states, publications) {
	const failures = /* @__PURE__ */ new Map();
	const install = (state, operation) => {
		try {
			operation?.();
		} catch (error) {
			failures.set(state, error);
		}
	};
	for (const state of states) install(state, state.commit);
	const invalidate = () => {
		let fenced = true;
		for (const [state, error] of failures) try {
			if (state.invalidate) state.invalidate(error);
			else fenced = false;
		} catch {
			fenced = false;
		}
		return fenced;
	};
	invalidate();
	for (const state of states) if (!failures.has(state)) install(state, state.prepareObservers);
	const fenced = invalidate();
	if (failures.size > 0) try {
		log.error("Committed SQLite facts could not be installed", {
			count: failures.size,
			fenced
		});
	} catch {}
	if (!fenced) return;
	for (const publish of publications) try {
		publish();
	} catch {
		try {
			log.error("SQLite post-commit notification failed");
		} catch {}
	}
}
/** Use the same phase ordering for an already committed worker receipt. */
function publishSqliteCommittedState(publication) {
	const publications = "installFacts" in publication ? [publication] : publication;
	installCommittedState(publications.map(committedPublicationState), publications.map((entry) => entry.notify));
}
/** Stage a complete owner publication; native savepoints share the outer commit. */
function stageSqliteCommittedPublication(db, publication) {
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		...committedPublicationState(publication)
	})) return false;
	deferSqlitePostCommitPublication(db, publication.notify);
	return true;
}
const pendingPublications = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** Snapshots read within this managed transaction can still roll back. */
function hasSqlitePostCommitScope(db) {
	return pendingPublications.has(sqlPublicationAnchor(db));
}
/** Publications are non-throwing observers, never part of a durable transaction's result. */
function deferSqlitePostCommitPublication(db, publish) {
	const pending = pendingPublications.get(sqlPublicationAnchor(db));
	if (!pending) return false;
	pending.push(publish);
	return true;
}
/**
* Stage private transaction-local state that publishes before fallible observers.
* Observer preparation follows every committed state update. All callbacks must not throw.
*/
function stageSqliteTransactionState(db, state) {
	const pending = pendingTransactionState.get(sqlPublicationAnchor(db));
	if (!pending) return false;
	state.stage();
	pending.push({
		prepareCommit: state.prepareCommit,
		commit: state.commit,
		prepareObservers: state.prepareObservers,
		invalidate: state.invalidate,
		rollback: state.rollback
	});
	return true;
}
/** Tentative native writes stay private until their owner's final commit guard succeeds. */
function prepareSqliteTransactionCommit(db) {
	for (const state of pendingTransactionState.get(sqlPublicationAnchor(db)) ?? []) state.prepareCommit?.();
}
function rollbackTransactionState(states, error, outcome = "rolled-back") {
	const failures = [];
	for (const state of states.toReversed()) try {
		if (outcome === "unknown" && state.invalidate) state.invalidate(error);
		else state.rollback(error);
	} catch (failure) {
		failures.push(failure);
	}
	if (failures.length > 0) throw createSqliteLifecycleAggregateError([error, ...failures], "SQLite transaction and rollback observers failed", error);
}
/** A lost transaction invalidates every savepoint's staged state and observers. */
function discardSqliteTransactionState(database, error, outcome = "unknown") {
	const db = sqlPublicationAnchor(database);
	pendingPublications.get(db)?.splice(0);
	const rolledBackState = pendingTransactionState.get(db)?.splice(0) ?? [];
	pendingPublications.delete(db);
	pendingTransactionState.delete(db);
	rollbackTransactionState(rolledBackState, error, outcome);
}
/** Nested rollback restores staged state and discards observers; savepoints wait for outer commit. */
function withSqlitePostCommitPublications(database, transaction) {
	const db = sqlPublicationAnchor(database);
	const nested = database.isTransaction || pendingPublications.has(db);
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
		rollbackTransactionState(transactionState?.splice(stateStart) ?? [], error);
		throw error;
	} finally {
		if (!nested) {
			pendingPublications.delete(db);
			pendingTransactionState.delete(db);
		}
	}
	if (!nested) installCommittedState(transactionState ?? [], publications ?? []);
	return result;
}
//#endregion
export { publishSqliteCommittedState as a, withSqlitePostCommitPublications as c, prepareSqliteTransactionCommit as i, discardSqliteTransactionState as n, stageSqliteCommittedPublication as o, hasSqlitePostCommitScope as r, stageSqliteTransactionState as s, deferSqlitePostCommitPublication as t };

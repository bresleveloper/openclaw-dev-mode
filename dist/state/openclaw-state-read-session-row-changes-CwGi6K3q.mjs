import { n as registerListener, o as resolveGlobalSet, s as resolveGlobalSingleton, t as notifyListeners } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { B as stageSqliteTransactionState, I as hasSqlitePostCommitScope, R as publishSqliteCommittedState, z as stageSqliteCommittedPublication } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { f as sqlPublicationAnchor } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
//#region src/sessions/session-row-changes.ts
const listeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowChanges"), "close-and-restart");
const factListeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowFactChanges"), "close-and-restart");
const projectionListeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowProjectionChanges"), "close-and-restart");
const invalidationSources = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowInvalidationSources"), () => /* @__PURE__ */ new WeakMap());
const privateFacts = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowPrivateFacts"), () => /* @__PURE__ */ new WeakMap());
const captures = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowChangeCaptures"), () => /* @__PURE__ */ new WeakMap());
const rowRevision = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowChangeRevision"), () => ({ value: 0 }));
/** Failure invalidations retain physical provenance, but never their old postimages. */
function sessionRowChangeSource(change) {
	return invalidationSources.get(change) ?? change;
}
const sessionChanges = {
	/** Authority-only facts join commit installation without a duplicate presentation event. */
	markFactsOnly(change, install) {
		privateFacts.set(change, install);
		return change;
	},
	subscribe(listener) {
		return registerListener(listeners, listener);
	},
	/** Install prepared facts only; live-row observers run after every commit callback. */
	subscribeFacts(listener) {
		return registerListener(factListeners, listener);
	},
	/** Refresh resident rows after all committed facts, before public observers can broadcast. */
	subscribeProjection(listener) {
		return registerListener(projectionListeners, listener);
	},
	/** Pending or indeterminate work fences facts without announcing a committed change. */
	invalidate(change) {
		rowRevision.value += 1;
		notifyListeners(factListeners, change);
		if (!privateFacts.has(change)) notifyListeners(projectionListeners, change);
	},
	/** SQLite observers run only after all committed owner state has settled. */
	emit(change, database) {
		sessionChanges.emitBatch([change], database);
	},
	emitBatch(changes, database, beforePublicNotifications) {
		const anchor = database && sqlPublicationAnchor(database);
		if (anchor && hasSqlitePostCommitScope(anchor)) for (const captured of captures.get(anchor) ?? []) {
			const start = captured.length;
			if (!stageSqliteTransactionState(anchor, {
				stage: () => captured.push(...changes),
				commit() {},
				rollback: () => captured.splice(start)
			})) throw new Error("Session receipt capture requires a transaction publication owner");
		}
		const visible = changes.filter((change) => !privateFacts.has(change));
		const install = (targets, batch) => {
			const failures = [];
			for (const change of batch) notifyListeners(targets, change, (error) => failures.push(error));
			if (failures.length > 0) throw new AggregateError(failures, "Session committed fact installation failed");
		};
		const publishFacts = () => {
			rowRevision.value += 1;
			for (const change of changes) privateFacts.get(change)?.();
			install(factListeners, changes);
		};
		const prepareObservers = () => {
			install(projectionListeners, visible);
		};
		const publish = () => {
			try {
				beforePublicNotifications?.();
			} finally {
				for (const change of visible) if ("sessionKey" in change) {
					const { facts: _facts, factsInvalidated: _invalidated, ...notification } = change;
					notifyListeners(listeners, notification);
				} else {
					const { factsInvalidated: _invalidated, ...notification } = change;
					notifyListeners(listeners, notification);
				}
			}
		};
		const publication = {
			installFacts: publishFacts,
			installProjection: prepareObservers,
			invalidate() {
				rowRevision.value += 1;
				const invalidations = changes.map((change) => {
					const invalidated = "sessionKey" in change ? {
						...change,
						facts: void 0,
						factsInvalidated: true
					} : {
						...change,
						factsInvalidated: true
					};
					invalidationSources.set(invalidated, sessionRowChangeSource(change));
					if (privateFacts.has(change)) privateFacts.set(invalidated, void 0);
					return invalidated;
				});
				const failures = [];
				for (const [targets, batch] of [[factListeners, invalidations], [projectionListeners, invalidations.filter((change) => !privateFacts.has(change))]]) try {
					install(targets, batch);
				} catch (error) {
					failures.push(error);
				}
				if (failures.length > 0) throw new AggregateError(failures, "Session publication invalidation failed");
			},
			notify: publish
		};
		if (!anchor || !stageSqliteCommittedPublication(anchor, publication)) publishSqliteCommittedState(publication);
	}
};
//#endregion
export { sessionChanges as t };

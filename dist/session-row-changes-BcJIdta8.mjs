import { i as resolveGlobalSet } from "./global-singleton-0m-JziJW.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
//#region src/sessions/session-row-changes.ts
/** Store discovery fences also apply to agent-scoped topology publications. */
function isSessionStoreTopologyChange(change) {
	return "all" in change && (change.scope === "stores" || typeof change.scope === "object" && change.scope.topology === true);
}
const listeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowChanges"), "close-and-restart");
const factListeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowFactChanges"), "close-and-restart");
const projectionListeners = resolveGlobalSet(Symbol.for("openclaw.sessionRowProjectionChanges"), "close-and-restart");
const sessionChanges = {
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
	/** SQLite observers run only after all committed owner state has settled. */
	emit(change, database) {
		sessionChanges.emitBatch([change], database);
	},
	emitBatch(changes, database, beforePublicNotifications) {
		const publishFacts = () => {
			for (const change of changes) notifyListeners(factListeners, change);
		};
		const prepareObservers = () => {
			for (const change of changes) notifyListeners(projectionListeners, change);
		};
		if (!database || !stageSqliteTransactionState(database, {
			stage: () => {},
			rollback: () => {},
			commit: publishFacts,
			prepareObservers
		})) {
			publishFacts();
			prepareObservers();
		}
		const publish = () => {
			beforePublicNotifications?.();
			for (const change of changes) if ("sessionKey" in change) {
				const { facts: _facts, factsInvalidated: _invalidated, ...notification } = change;
				notifyListeners(listeners, notification);
			} else {
				const { factsInvalidated: _invalidated, ...notification } = change;
				notifyListeners(listeners, notification);
			}
		};
		if (!database || !deferSqlitePostCommitPublication(database, publish)) publish();
	}
};
//#endregion
export { sessionChanges as n, isSessionStoreTopologyChange as t };

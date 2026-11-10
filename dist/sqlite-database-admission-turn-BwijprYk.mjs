import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { o as inspectDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { p as hasSqliteDatabaseSchemaAdmissionForPath, r as canShareSqliteDatabaseAdmissions } from "./sqlite-database-admission-CqdNF9iE.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/sqlite-database-admission-turn.ts
const pending = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionTurns"), () => /* @__PURE__ */ new Map());
const current = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionTurnContext"), () => new AsyncLocalStorage());
function reserveAdmissionTurn(locations, families) {
	if (current.getStore()?.active || !canShareSqliteDatabaseAdmissions()) return;
	const keys = new Set(families.map((directory) => `family:${resolveIdentityPathViaExistingAncestorSync(directory)}`));
	for (const location of typeof locations === "string" ? [locations] : locations) {
		let identity;
		try {
			if (hasSqliteDatabaseSchemaAdmissionForPath(location)) continue;
			identity = inspectDatabasePathIdentitySync(location);
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
		const canonicalPath = identity?.canonicalPath ?? resolveIdentityPathViaExistingAncestorSync(location);
		keys.add(`path:${canonicalPath}`);
		if (identity) keys.add(`${identity.key}:${identity.birthtime ?? ""}`);
		keys.add(`family:${path.dirname(canonicalPath)}`);
	}
	if (keys.size === 0) return;
	const predecessors = new Set([...keys].flatMap((key) => pending.get(key) ?? []));
	const completion = createDeferredCore();
	const turn = {
		keys,
		completion: completion.promise
	};
	for (const key of keys) pending.set(key, turn);
	const release = () => {
		for (const key of turn.keys) if (pending.get(key) === turn) pending.delete(key);
		completion.resolve();
	};
	return {
		ready: Promise.all([...predecessors].map((predecessor) => predecessor.completion)),
		release
	};
}
/** Only cold dispatch waits here; native getters never block the host on a worker's publication. */
function acquireSqliteDatabaseAdmissionTurn(locations, families = []) {
	const turn = reserveAdmissionTurn(locations, families);
	return turn?.ready.then(() => turn.release);
}
/** Known database locators are captured by their task owner before dispatch, never inferred from IPC. */
function runWithSqliteDatabaseAdmissionTurn(locations, operation, families = [], signal) {
	const turn = reserveAdmissionTurn(locations, families);
	if (!turn) return operation();
	return racePromiseWithAbortSignal(turn.ready, signal, (aborted) => aborted.reason).then(() => {
		const scope = { active: true };
		return current.run(scope, async () => {
			try {
				return await operation();
			} finally {
				scope.active = false;
				turn.release();
			}
		});
	}, (error) => {
		turn.ready.then(turn.release);
		throw error;
	});
}
//#endregion
export { runWithSqliteDatabaseAdmissionTurn as n, acquireSqliteDatabaseAdmissionTurn as t };

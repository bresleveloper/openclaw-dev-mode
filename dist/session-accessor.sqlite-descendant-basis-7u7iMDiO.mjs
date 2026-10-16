import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { c as subagentMaintenanceDurableBasisMatches, l as subagentRunsDurableBasisMatches } from "./subagent-registry.store.sqlite-DIYyRjhZ.mjs";
//#region src/config/sessions/session-accessor.sqlite-descendant-basis.ts
/** Compare fresh durable facts after the host grants its live deletion authority. */
function assertSessionSubagentRunsCurrent(params, env) {
	const bases = [params.descendantRunBasis, params.maintenanceRunBasis].filter((basis) => basis !== void 0);
	if (bases.length === 0) return;
	const pathname = resolveOpenClawStateSqlitePath(env);
	const assertSource = () => {
		const identity = readDatabasePathIdentitySync(pathname);
		if (bases.some((basis) => pathname !== basis.databasePath || identity.key !== basis.databaseIdentity || identity.birthtime !== basis.databaseBirthtime)) throw new Error("Session subagent source changed before commit");
	};
	assertSource();
	const matches = withExistingOpenClawStateDatabaseCurrentReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => (!params.descendantRunBasis || subagentRunsDurableBasisMatches(database, params.descendantRunBasis)) && (!params.maintenanceRunBasis || subagentMaintenanceDurableBasisMatches(database, params.maintenanceRunBasis)), {
		databaseLabel: pathname,
		operationLabel: "session.subagent-commit-facts"
	}), {
		path: pathname,
		env
	});
	assertSource();
	if (matches !== true && !(matches === void 0 && bases.every((basis) => basis.digest === null))) throw new Error("Session subagent facts changed before commit");
}
//#endregion
export { assertSessionSubagentRunsCurrent as t };

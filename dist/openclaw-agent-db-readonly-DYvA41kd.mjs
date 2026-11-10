import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { p as runSqliteReadOperationSync } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { w as assertCanonicalSessionValidationSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { i as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { a as withFreshOpenClawAgentDatabaseReadOnly, i as readOpenClawAgentDatabaseSnapshot, n as openOpenClawAgentDatabaseReadOnly, r as readOpenClawAgentDatabase } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { i as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { a as withScopedOpenClawAgentDatabaseReadOnly, i as retainCachedOpenClawAgentDatabaseReadOnly, t as OpenClawAgentDatabaseReadOnlyScope } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
//#region src/state/openclaw-agent-db-readonly-companion.ts
const companions = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReadOnlyCompanions"), () => /* @__PURE__ */ new WeakMap());
/** Keep committed reads separate from the writer using the ordinary reader lifecycle. */
function withCommittedOpenClawAgentDatabaseReadOnly(writer, operation, options, behavior = {}) {
	let scope = companions.get(writer.db);
	if (!scope) {
		scope = new OpenClawAgentDatabaseReadOnlyScope(true);
		const owned = scope;
		registerNodeSqliteDisposeCallback(writer.db, () => owned.close());
		companions.set(writer.db, scope);
	}
	const owned = scope;
	return owned.run({
		agentId: writer.agentId,
		path: writer.path
	}, () => owned.read(operation, options, behavior));
}
//#endregion
//#region src/state/openclaw-agent-db-readonly.ts
/**
* Look up a process-held handle without adopting writer-side failures.
*
* Read-only reads are meant to survive a latched open failure or an ownership
* mismatch that only the writable lifecycle cares about; those callers fall
* back to a fresh connection, which reports the precise reason.
*/
function findOpenAgentDatabase(options) {
	try {
		return getOpenClawAgentDatabaseIfOpen(options);
	} catch {
		return;
	}
}
/** Retain an existing store across awaits without materializing a writable database. */
function retainOpenClawAgentDatabaseReadOnly(options) {
	if (isArtifactPreservingStateRead("agent", resolveOpenClawAgentSqlitePath(options))) {
		const inspected = openOpenClawAgentDatabaseReadOnly(options);
		return inspected.found ? {
			found: true,
			database: inspected.database,
			claim: createOpenClawAgentDatabaseClaim(inspected.database, inspected.database.close)
		} : inspected;
	}
	const opened = findOpenAgentDatabase(options);
	if (opened && !opened.db.isTransaction) {
		const borrowed = borrowOpenClawAgentDatabase(options);
		return {
			found: true,
			database: opened,
			claim: createOpenClawAgentDatabaseClaim(opened, borrowed.release)
		};
	}
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	return retainCachedOpenClawAgentDatabaseReadOnly({
		...options,
		agentId,
		path: pathname
	});
}
/** Read agent state without creating, registering, migrating, or joining its writable lifecycle. */
function withOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isArtifactPreservingStateRead("agent", pathname)) return withFreshOpenClawAgentDatabaseReadOnly(operation, options, behavior);
	if (isIncognitoOpenClawAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) return {
		found: false,
		reason: "database-missing"
	};
	const processOpened = behavior.allowExtension ? void 0 : findOpenAgentDatabase({
		...options,
		agentId
	});
	if (processOpened?.db.isTransaction) return withCommittedOpenClawAgentDatabaseReadOnly(processOpened, operation, {
		...options,
		agentId
	}, behavior);
	if (!processOpened) return withScopedOpenClawAgentDatabaseReadOnly(operation, {
		...options,
		agentId,
		path: pathname
	}, behavior);
	if (behavior.snapshot) return readOpenClawAgentDatabaseSnapshot(processOpened, operation);
	return runSqliteReadOperationSync(processOpened.db, () => {
		const userVersion = assertSupportedAgentSchemaVersion(processOpened.db, pathname);
		assertCanonicalAgentPersistenceVersion(processOpened.db, pathname, userVersion);
		assertCanonicalSessionValidationSchema(processOpened.db);
		return readOpenClawAgentDatabase(processOpened, operation);
	});
}
//#endregion
export { withOpenClawAgentDatabaseReadOnly as n, retainOpenClawAgentDatabaseReadOnly as t };

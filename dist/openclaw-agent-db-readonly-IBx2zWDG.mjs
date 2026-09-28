import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { c as registerNodeSqliteDisposeCallback, r as enableNodeSqliteKyselyStatementCache } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { o as runInSqliteMaintenanceContext } from "./sqlite-wal-BzoPsBh0.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { i as readOpenClawAgentDatabaseIdentity, r as isOpenClawAgentDatabasePathCurrent, t as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { r as assertSupportedAgentSchemaVersion, t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-B7E3mJp3.mjs";
import { s as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { i as withFreshOpenClawAgentDatabaseReadOnly, n as openOpenClawAgentDatabaseReadOnly, r as readOpenClawAgentDatabase, t as hasOpenClawAgentReadOnlySchema } from "./openclaw-agent-db-readonly-open-_lavN1YB.mjs";
import { i as withScopedOpenClawAgentDatabaseReadOnly, r as retainCachedOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-BIEwBWBt.mjs";
//#region src/state/openclaw-agent-db-readonly-companion.ts
const log = createSubsystemLogger("state/agent-db");
const companions = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReadOnlyCompanions"), () => /* @__PURE__ */ new WeakMap());
function matchesWriter(reader, writer) {
	return isOpenClawAgentDatabasePathCurrent(writer) && isOpenClawAgentDatabasePathCurrent(reader) && readOpenClawAgentDatabaseIdentity(reader).identity === readOpenClawAgentDatabaseIdentity(writer).identity;
}
/** Keep committed reads separate from the active writer without reopening per assertion. */
function withCommittedOpenClawAgentDatabaseReadOnly(writer, operation, options) {
	let companion = companions.get(writer.db);
	if (companion?.active) return withFreshOpenClawAgentDatabaseReadOnly(operation, options);
	if (companion && (!matchesWriter(companion.reader, writer) || companion.reader.db.isTransaction)) {
		companion.close();
		companion = void 0;
	}
	if (!companion && !isOpenClawAgentDatabasePathCurrent(writer)) return withFreshOpenClawAgentDatabaseReadOnly(operation, options);
	if (!companion) {
		const opened = openOpenClawAgentDatabaseReadOnly(options);
		if (!opened.found) return opened;
		const reader = opened.database;
		let unregisterDispose = () => {};
		let idleTimer;
		const close = () => {
			if (reader.db.isOpen) reader.close();
			clearTimeout(idleTimer);
			if (companions.get(writer.db)?.reader === reader) companions.delete(writer.db);
			unregisterDispose();
		};
		try {
			if (!matchesWriter(reader, writer)) return readOpenClawAgentDatabase(reader, operation);
			enableNodeSqliteKyselyStatementCache(reader.db);
			unregisterDispose = registerNodeSqliteDisposeCallback(writer.db, close);
			idleTimer = runInSqliteMaintenanceContext(() => setTimeout(() => {
				if (companions.get(writer.db)?.reader !== reader) return;
				try {
					close();
				} catch (error) {
					log.warn("Idle committed agent reader cleanup failed", {
						path: reader.path,
						error
					});
					idleTimer?.refresh();
				}
			}, SQLITE_IDLE_HANDLE_TTL_MS));
			idleTimer.unref();
			const next = {
				reader,
				active: false,
				close,
				idleTimer
			};
			companions.set(writer.db, next);
			companion = next;
		} finally {
			if (!companion) close();
		}
	}
	const owned = companion;
	try {
		if (!hasOpenClawAgentReadOnlySchema(owned.reader)) {
			owned.close();
			return {
				found: false,
				reason: "schema-missing"
			};
		}
		owned.idleTimer.refresh();
		owned.active = true;
		return readOpenClawAgentDatabase(owned.reader, operation);
	} catch (error) {
		owned.close();
		throw error;
	} finally {
		owned.active = false;
		if (!owned.reader.db.isOpen || owned.reader.db.isTransaction || !matchesWriter(owned.reader, writer)) owned.close();
	}
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
	if (isIncognitoOpenClawAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) {
		const database = getOpenClawAgentDatabaseIfOpen({
			...options,
			agentId
		});
		if (database && behavior.allowExtension) throw new Error("Extension-capable read-only access is unavailable for incognito databases.");
		return database ? readOpenClawAgentDatabase(database, operation) : {
			found: false,
			reason: "database-missing"
		};
	}
	const processOpened = behavior.allowExtension ? void 0 : findOpenAgentDatabase({
		...options,
		agentId
	});
	if (processOpened?.db.isTransaction) return withCommittedOpenClawAgentDatabaseReadOnly(processOpened, operation, {
		...options,
		agentId
	});
	const reusable = processOpened && !processOpened.db.isTransaction ? processOpened : void 0;
	if (!reusable) return withScopedOpenClawAgentDatabaseReadOnly(operation, {
		...options,
		agentId,
		path: pathname
	}, behavior);
	const userVersion = assertSupportedAgentSchemaVersion(reusable.db, pathname);
	assertCanonicalAgentPersistenceVersion(reusable.db, pathname, userVersion);
	return readOpenClawAgentDatabase(reusable, operation);
}
//#endregion
export { withOpenClawAgentDatabaseReadOnly as n, retainOpenClawAgentDatabaseReadOnly as t };

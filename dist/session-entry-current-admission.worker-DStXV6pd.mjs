import { c as runSqlitePinnedReadSnapshotSync } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-BeVaUlhr.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { m as createSessionEntryRevisionGuard } from "./internal-session-key-CPayZwJR.mjs";
import { n as assertCanonicalSessionKeyWrite, u as readWithCanonicalSessionAdmission } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow, c as readSessionEntryByIdInDatabase, l as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as projectSessionEntryCapabilityFacts } from "./session-entry-capability-facts-D2INtkAm.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-current-admission.worker.ts
const currentEntryReads = /* @__PURE__ */ new WeakMap();
function createCurrentEntryRead(database, sessionKey, lookup, options) {
	let entry;
	const guard = createSessionEntryRevisionGuard(database.db, () => {
		if (!database.db.isOpen || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session currency read lost its native source");
	}, () => {
		const current = options.sessionIdLookup !== void 0 ? readSessionEntryByIdInDatabase(database, {
			sessionId: options.sessionIdLookup,
			projection: "list"
		})?.entry : lookup === "logical" ? readSessionEntryRow(database, sessionKey, "full")?.entry : readExactSessionEntryRow(database, sessionKey, "list", "canonical")?.entry;
		if (options.projection === "capability") {
			entry = current ? projectSessionEntryCapabilityFacts(current) : void 0;
			return true;
		}
		entry = current ? {
			sessionId: current.sessionId,
			previousSessionId: current.previousSessionId,
			...current.archivedAt === void 0 ? {} : { archivedAt: current.archivedAt },
			...current.repositoryWorkspaceId === void 0 ? {} : { repositoryWorkspaceId: current.repositoryWorkspaceId },
			lifecycleRevision: current.lifecycleRevision,
			lifecycleRunId: current.lifecycleRunId,
			activeWriterRunId: current.activeWriterRunId,
			...current.subagentRecovery ? { subagentRecovery: {
				lastRunId: current.subagentRecovery.lastRunId,
				sessionLifecycleRunId: current.subagentRecovery.sessionLifecycleRunId
			} } : {}
		} : void 0;
		return true;
	});
	return () => {
		guard();
		return entry;
	};
}
function readSessionEntryCurrentFactsInDatabase(database, sessionKey, lookup = "exact", options = {}) {
	assertCanonicalSessionKeyWrite(sessionKey);
	let cached = currentEntryReads.get(database.db);
	if (cached?.sessionKey !== sessionKey || cached.lookup !== lookup || cached.sessionIdLookup !== options.sessionIdLookup || cached.projection !== options.projection) {
		cached = {
			sessionKey,
			lookup,
			...options,
			read: createCurrentEntryRead(database, sessionKey, lookup, options)
		};
		currentEntryReads.set(database.db, cached);
	}
	const { read } = cached;
	return readWithCanonicalSessionAdmission(database, () => runSqlitePinnedReadSnapshotSync(database.db, read));
}
function assertSessionEntryCurrentNativeSource(source, database) {
	assertExistingDatabaseIdentity(source.path, `file:${source.databaseIdentity}`, source.databaseBirthtime);
	if (database) {
		const identity = readOpenClawAgentDatabaseIdentity(database);
		if (database.agentId !== source.agentId || database.path !== source.path || identity.identity !== source.databaseIdentity || identity.birthtime !== source.databaseBirthtime || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session currency native owner differs from its captured source");
	}
}
/** Native facts constrain the existing synchronous grant; no read snapshot outlives the request. */
function requestSessionEntryCurrentAdmission(source, request, options = {}, requestAdmission = requestSqliteWorkerOperationAdmission) {
	if (!source) {
		requestAdmission(request);
		return;
	}
	assertSessionEntryCurrentNativeSource(source);
	const admit = (database) => {
		assertSessionEntryCurrentNativeSource(source, database);
		const entry = readSessionEntryCurrentFactsInDatabase(database, source.sessionKey, options.lookup, source);
		const facts = {
			kind: "session-entry-current",
			source,
			entry,
			domainFacts: request.facts
		};
		requestAdmission({
			...request,
			facts
		});
		assertSessionEntryCurrentNativeSource(source, database);
		if (!isDeepStrictEqual(entry, readSessionEntryCurrentFactsInDatabase(database, source.sessionKey, options.lookup, source))) throw new Error("Session currency changed while awaiting its native grant");
	};
	if (options.database?.path === source.path) {
		admit(options.database);
		return;
	}
	if (!withOpenClawAgentDatabaseReadOnly(admit, {
		agentId: source.agentId,
		path: source.path,
		env: getSqliteWorkerStateContext().environment
	}).found) throw new Error("Session currency native source is unavailable");
}
/** Keep every original source live through the common grant and recheck each after it settles. */
function requestSessionEntriesCurrentAdmission(sources, request) {
	const enter = (index, current) => {
		const source = sources?.[index];
		if (!source) {
			requestSqliteWorkerOperationAdmission(current);
			return;
		}
		requestSessionEntryCurrentAdmission(source, current, {}, (next) => enter(index + 1, next));
	};
	enter(0, request);
}
//#endregion
export { requestSessionEntryCurrentAdmission as i, readSessionEntryCurrentFactsInDatabase as n, requestSessionEntriesCurrentAdmission as r, assertSessionEntryCurrentNativeSource as t };

import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as SessionMetadataUnavailableError } from "./session-metadata-unavailable-error-DwD7IuoE.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { c as createSessionEntryRevisionGuard } from "./session-participant-identity-Btc25HNW.mjs";
import { d as readWithCanonicalSessionAdmission, f as readWithCanonicalSessionReaderContinuation, n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { o as readExactSessionEntryRow, p as readSessionEntryRow, u as readSessionEntryByIdInDatabase } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-entry-capability-facts.ts
/** Capability readers share authority facts; model/auth routing belongs to the admitted turn. */
function projectSessionEntryCapabilityFacts(entry) {
	return {
		sessionId: entry.sessionId,
		incognito: entry.incognito,
		lifecycleRevision: entry.lifecycleRevision,
		modelSelectionLocked: entry.modelSelectionLocked,
		pluginOwnerId: entry.pluginOwnerId,
		agentHarnessId: entry.agentHarnessId,
		agentRuntimeOverride: entry.agentRuntimeOverride,
		initializationPending: entry.initializationPending,
		execHost: entry.execHost,
		execNode: entry.execNode,
		deviceFolder: entry.deviceFolder ? { ...entry.deviceFolder } : void 0,
		sandbox: entry.sandbox,
		sandboxMode: entry.sandboxMode,
		permissionMode: entry.permissionMode,
		sessionRoot: entry.sessionRoot,
		spawnedBy: entry.spawnedBy,
		spawnDepth: entry.spawnDepth,
		completionOwnerSessionKey: entry.completionOwnerSessionKey,
		subagentRole: entry.subagentRole,
		subagentControlScope: entry.subagentControlScope,
		inheritedToolPolicyVersion: entry.inheritedToolPolicyVersion,
		inheritedToolPolicySource: entry.inheritedToolPolicySource,
		delegatedToolPolicy: structuredClone(entry.delegatedToolPolicy),
		inheritedToolAllow: Array.isArray(entry.inheritedToolAllow) ? [...entry.inheritedToolAllow] : entry.inheritedToolAllow,
		inheritedToolDeny: Array.isArray(entry.inheritedToolDeny) ? [...entry.inheritedToolDeny] : entry.inheritedToolDeny
	};
}
//#endregion
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
		})?.entry : lookup === "logical" ? readSessionEntryRow(database, sessionKey, "list")?.entry : readExactSessionEntryRow(database, sessionKey, "list", "canonical")?.entry;
		if (!current || options.projection === "capability") {
			entry = current ? projectSessionEntryCapabilityFacts(current) : void 0;
			return true;
		}
		entry = {
			sessionId: current.sessionId,
			previousSessionId: current.previousSessionId,
			...current.archivedAt === void 0 ? {} : { archivedAt: current.archivedAt },
			...current.repositoryWorkspaceId === void 0 ? {} : { repositoryWorkspaceId: current.repositoryWorkspaceId },
			...current.deviceFolder ? { deviceFolder: { ...current.deviceFolder } } : {},
			lifecycleRevision: current.lifecycleRevision,
			lifecycleRunId: current.lifecycleRunId,
			activeWriterRunId: current.activeWriterRunId,
			...current.subagentRecovery ? { subagentRecovery: {
				lastRunId: current.subagentRecovery.lastRunId,
				sessionLifecycleRunId: current.subagentRecovery.sessionLifecycleRunId
			} } : {}
		};
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
	return readWithCanonicalSessionAdmission(database, cached.read);
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
/** Canonical entry currency reuses parsed facts only at the same native connection revision. */
function readSessionEntryCurrentFacts(request) {
	const sessionKey = request.scope.sessionKey;
	assertCanonicalSessionKeyWrite(sessionKey, request.scope.agentId);
	if (request.source) {
		if (request.source.path !== request.database.path || request.source.agentId !== request.database.agentId || request.source.sessionKey !== sessionKey) throw new Error("Session currency request differs from its captured source");
		assertSessionEntryCurrentNativeSource(request.source);
	}
	const result = withOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionReaderContinuation(database, request.continuation, () => {
		const source = captureSessionEntryReadSource(database, void 0, "Session currency read requires its current durable owner");
		if (request.source) assertSessionEntryCurrentNativeSource(request.source, database);
		return {
			entry: readSessionEntryCurrentFactsInDatabase(database, sessionKey),
			source
		};
	}), {
		...request.database,
		env: request.scope.env
	});
	if (!result.found && result.reason !== "database-missing") throw new SessionMetadataUnavailableError(result.reason);
	return {
		kind: "session-entry-current",
		...result.found ? result.value : { entry: void 0 }
	};
}
//#endregion
export { projectSessionEntryCapabilityFacts as i, requestSessionEntriesCurrentAdmission as n, requestSessionEntryCurrentAdmission as r, readSessionEntryCurrentFacts as t };

import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { c as captureSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { P as readIncognitoSessionEntryCurrent } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-D1TSJMmX.mjs";
//#region src/config/sessions/session-entry-current-runtime.ts
/** Process-held currency consumes its original writer's published facts, never a native query. */
function captureNativeSessionEntryCurrentRead(scope) {
	const sessionKey = scope.sessionKey;
	const agentId = scope.agentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	assertCanonicalSessionKeyWrite(sessionKey, agentId);
	if (!agentId) throw new Error("Session currency requires its original agent");
	const env = captureSessionTranscriptStorageEnvironment(scope.env ?? process.env);
	const storePath = isIncognitoSessionKey(sessionKey) ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId,
		env
	}) : scope.storePath;
	if (!storePath) throw new Error("Session currency requires its original incognito store");
	const database = getOpenIncognitoAgentDatabase(agentId, storePath);
	const assertSourceCurrent = () => {
		if (getOpenIncognitoAgentDatabase(agentId, storePath) !== database) throw new Error("Session currency incognito owner changed");
	};
	return {
		kind: database ? "native" : "missing",
		assertSourceCurrent,
		readCurrent() {
			assertSourceCurrent();
			return database ? readIncognitoSessionEntryCurrent(database.db, sessionKey) : void 0;
		}
	};
}
/** Capture during the initial admitted read; later checks acquire only finite worker custody. */
function captureSessionEntryCurrentRead(scope, owner) {
	owner.assertCurrent();
	const sessionKey = scope.sessionKey;
	const agentId = scope.agentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	assertCanonicalSessionKeyWrite(sessionKey, agentId);
	if (owner.kind === "native") return captureNativeSessionEntryCurrentRead(scope);
	if (owner.kind !== "file" || !owner.scope || !owner.selectedStore) throw new Error("Session currency source is unavailable");
	const readScope = {
		...owner.scope,
		env: captureSessionTranscriptStorageEnvironment(owner.scope.env)
	};
	const candidate = { ...owner.selectedStore };
	if (candidate.physicalPath !== readScope.storePath) throw new Error("Session currency selected store differs from its admitted source");
	const identity = readDatabasePathIdentitySync(readScope.storePath);
	owner.assertCurrent();
	const assertLogicalSourceCurrent = () => {
		if (captureSessionStoreReadCandidate(candidate.path).physicalPath !== candidate.physicalPath) throw new Error("Session currency logical source changed");
	};
	assertLogicalSourceCurrent();
	if (!identity.key.startsWith("file:")) {
		const assertSourceCurrent = () => {
			const current = readDatabasePathIdentitySync(readScope.storePath);
			if (current.key !== identity.key || current.canonicalPath !== identity.canonicalPath) throw new Error("Session currency missing source changed");
			assertLogicalSourceCurrent();
		};
		return {
			kind: "missing",
			assertSourceCurrent,
			readCurrent() {
				assertSourceCurrent();
			}
		};
	}
	const source = Object.freeze({
		agentId: readScope.databaseAgentId,
		path: readScope.storePath,
		databaseIdentity: identity.key.slice(5),
		databaseBirthtime: identity.birthtime,
		sessionKey
	});
	const assertSourceCurrent = () => {
		assertExistingDatabaseIdentity(source.path, identity.key, identity.birthtime);
		assertLogicalSourceCurrent();
	};
	const options = {
		agentId: source.agentId,
		path: source.path,
		env: readScope.env
	};
	return {
		kind: "file",
		source,
		assertSourceCurrent,
		async readCurrent() {
			const entry = await withSessionHistoryWorkerDatabase(options, (reader) => reader.readEntryCurrent({
				scope: readScope,
				source
			}));
			assertSourceCurrent();
			return entry;
		}
	};
}
//#endregion
export { captureSessionEntryCurrentRead as n, captureNativeSessionEntryCurrentRead as t };

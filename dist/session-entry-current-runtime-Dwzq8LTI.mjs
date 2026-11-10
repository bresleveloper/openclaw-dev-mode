import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as isSessionStoreReadCandidateCurrent } from "./session-store-read-candidates-CmVF2223.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
//#region src/config/sessions/session-entry-current-runtime.ts
/** Read live effect facts from the memory owner selected at acquisition. */
function captureNativeSessionEntryCurrentRead(scope) {
	const memory = captureMemoryExactSessionReader(scope);
	if (!memory) throw new Error("Session current facts require a memory owner");
	return {
		kind: memory.source ? "incognito" : "missing",
		assertSourceCurrent: () => memory.assertCurrent(),
		readCurrent() {
			return memory.read(scope.sessionKey, "list");
		}
	};
}
/** Capture during the initial admitted read; later checks acquire only finite worker custody. */
function captureSessionEntryCurrentRead(scope, owner) {
	owner.assertCurrent();
	const sessionKey = scope.sessionKey;
	const agentId = scope.agentId ?? parseAgentSessionKey(sessionKey)?.agentId;
	assertCanonicalSessionKeyWrite(sessionKey, agentId);
	if (owner.kind === "incognito") return captureNativeSessionEntryCurrentRead(scope);
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
		if (!isSessionStoreReadCandidateCurrent(candidate)) throw new Error("Session currency logical source changed");
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
	const options = {
		agentId: source.agentId,
		path: source.path,
		env: readScope.env
	};
	return {
		kind: "file",
		source,
		assertSourceCurrent: assertLogicalSourceCurrent,
		async readCurrent() {
			const entry = await withSessionHistoryWorkerDatabase(options, (reader) => reader.readEntryCurrent({
				scope: readScope,
				source
			}));
			assertLogicalSourceCurrent();
			return entry;
		}
	};
}
//#endregion
export { captureSessionEntryCurrentRead as n, captureNativeSessionEntryCurrentRead as t };

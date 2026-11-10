import { f as readDatabasePathIdentitySync, n as assertDatabasePathIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as runOpenClawAgentWriteAdmissions } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as captureSessionEntryNativeMutationWitness } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
//#region src/config/sessions/session-retirement-read.ts
/** Lists persisted session keys without materializing their entry JSON. */
async function listSessionEntryKeysReadOnly(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const options = toDatabaseOptions(resolved);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	const reader = captureSessionRetirementReader({
		databaseAgentId: resolved.databaseAgentId ?? resolved.agentId,
		ownerStorePath: pathname,
		path: pathname
	}, resolved.env ?? process.env);
	return withSessionRetirementReaders([reader], async () => {
		const result = await reader.read({
			operation: "keys",
			ordered: true
		});
		reader.assertCurrent();
		if (result.operation !== "keys") throw new Error("Session key inventory returned another retirement operation");
		return result.keys;
	});
}
/** Capture physical custody before either scan phase can yield. */
function captureSessionRetirementReader(store, environment) {
	const storePath = store.path;
	const identity = readDatabasePathIdentitySync(storePath);
	const ownerStorePath = store.ownerStorePath;
	const ownerIdentity = ownerStorePath !== storePath ? readDatabasePathIdentitySync(ownerStorePath) : void 0;
	const env = captureSessionTranscriptStorageEnvironment(environment);
	const database = {
		agentId: store.databaseAgentId,
		path: identity.canonicalPath,
		env
	};
	const assertCurrent = () => {
		assertDatabasePathIdentity(storePath, identity);
		if (ownerIdentity) assertDatabasePathIdentity(ownerStorePath, ownerIdentity);
	};
	const read = async (request) => {
		assertCurrent();
		if (!identity.key.startsWith("file:")) return request.operation === "keys" ? {
			operation: "keys",
			keys: []
		} : {
			operation: "comparison-claims",
			claims: []
		};
		return withSessionHistoryWorkerDatabase(database, async (reader) => {
			assertCurrent();
			const result = await reader.readRetirement({
				env,
				expectedIdentity: identity,
				request
			});
			reader.assertCurrent();
			assertCurrent();
			return result;
		}, targetDiscoveryLane);
	};
	return {
		database,
		assertCurrent,
		read
	};
}
/** Hold the existing writer FIFO through asynchronous scans; native SDK writes invalidate the read. */
function withSessionRetirementReaders(readers, read) {
	const databases = readers.map((reader) => reader.database);
	return runOpenClawAgentWriteAdmissions(databases, async () => {
		const assertNativeCurrent = captureSessionEntryNativeMutationWitness(databases);
		const result = await read();
		assertNativeCurrent();
		return result;
	}, true);
}
//#endregion
export { listSessionEntryKeysReadOnly as n, withSessionRetirementReaders as r, captureSessionRetirementReader as t };

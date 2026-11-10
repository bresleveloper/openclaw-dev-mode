import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as createPreparedSessionTranscriptReads } from "./session-transcript-execution-read-Cv-mpCgi.mjs";
import { n as captureExistingOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { l as getOwnedSessionTranscriptReader } from "./transcript-write-context-C02sC3zd.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-read-source.ts
/** Read through an anchor locator while retaining the requested physical source and its authority. */
async function withSessionTranscriptReadSource(scope, readInWorker, signal, lane, throughStorePath) {
	const captured = {
		...scope,
		sessionEntry: scope.sessionEntry ? { ...scope.sessionEntry } : void 0,
		...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const agentId = normalizeAgentId(captured.agentId ?? parseAgentSessionKey(captured.sessionKey)?.agentId ?? captured.defaultAgentId);
	signal?.throwIfAborted();
	const storePath = captured.storePath ?? resolveOpenClawAgentSqlitePath({
		agentId,
		env: captured.env
	});
	const selected = getOwnedSessionTranscriptReader(captured);
	const context = captureOpenClawStateReadWorkerContext({ env: captured.env });
	const exact = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	const execution = selected ? captureExistingOpenClawAgentDatabaseExecution(selected.database) : exact.agentId || exact.shared ? captureExistingOpenClawAgentDatabaseExecution({
		path: exact.path,
		env: captured.env
	}) : void 0;
	let releaseStarted = false;
	const releaseExecution = () => {
		releaseStarted = true;
		return execution?.release();
	};
	try {
		const claim = execution?.capturePreparedGenerationClaim();
		const readResolved = (resolved, identity, assertSource, requestedPaths) => {
			const expectedIdentity = identity.key.startsWith("file:") ? identity : void 0;
			const readPath = expectedIdentity ? throughStorePath ?? resolved.path : resolved.path;
			const options = toDatabaseOptions({
				...resolved,
				path: readPath
			});
			return withSessionHistoryWorkerDatabase({
				...options,
				requestedPaths
			}, async (owner) => {
				const assertCurrent = () => {
					assertSource();
					owner.assertCurrent();
					claim?.assertCurrent();
				};
				assertCurrent();
				if (claim && (!expectedIdentity || execution?.agentId !== options.agentId)) throw new Error("Transcript discovery changed its prepared execution owner");
				const preparedReads = execution && claim && expectedIdentity ? createPreparedSessionTranscriptReads({
					claim,
					expectedIdentity,
					assertCurrent,
					reader: owner
				}) : void 0;
				try {
					return await readInWorker({
						scope: {
							...captured,
							agentId: resolved.agentId,
							storePath: readPath
						},
						resolved,
						owner,
						preparedReads,
						expectedIdentity,
						assertCurrent
					});
				} finally {
					assertCurrent();
				}
			}, lane);
		};
		if (selected) {
			const assertSource = () => {
				signal?.throwIfAborted();
				context.maintenanceScope?.assertAdmission();
				context.admission.assertCurrent();
				selected.assertCurrent();
			};
			assertSource();
			const identity = readDatabasePathIdentitySync(selected.database.path);
			if (!identity.key.startsWith("file:")) throw new Error("Admitted transcript database is no longer available");
			return await readResolved({
				agentId: selected.logicalAgentId,
				databaseAgentId: selected.database.agentId,
				path: identity.canonicalPath,
				ownerStorePath: storePath,
				env: selected.database.env,
				sessionKey: selected.sessionKey,
				sessionId: captured.sessionId
			}, identity, assertSource, selected.storePaths);
		}
		const candidates = captureSessionStoreReadCandidates(storePath);
		const identities = captureSessionStoreCandidateIdentities(candidates);
		return await withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
			try {
				const resolved = await prepareSqliteTranscriptReadScope(captured, signal);
				const options = toDatabaseOptions(resolved);
				const databasePath = resolveOpenClawAgentSqlitePath(options);
				const identity = identities.get(assertSessionStoreReadCandidate(databasePath, candidates));
				const selectedIdentity = identity ?? readDatabasePathIdentitySync(databasePath);
				if (!identity && selectedIdentity.key.startsWith("file:")) throw new Error("Transcript read changed its captured database owner");
				const assertSource = () => {
					signal?.throwIfAborted();
					context.maintenanceScope?.assertAdmission();
					context.admission.assertCurrent();
					discovery.assertCurrent();
				};
				assertSource();
				const result = await readResolved({
					...resolved,
					path: selectedIdentity.canonicalPath
				}, selectedIdentity, assertSource, [storePath]);
				if (execution) await releaseExecution();
				assertSource();
				return result;
			} finally {
				if (execution && !releaseStarted) await releaseExecution();
			}
		}, lane);
	} finally {
		if (execution && !releaseStarted) await releaseExecution();
	}
}
//#endregion
export { withSessionTranscriptReadSource as t };

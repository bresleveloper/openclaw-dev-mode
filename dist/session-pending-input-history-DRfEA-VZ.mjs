import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as captureOpenClawAgentDatabaseReadValidation } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as projectSessionPendingInput } from "./session-pending-input-value-CPY0B7Hg.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { i as prepareSqliteScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as hasSessionActorEmptyPendingInputHistory } from "./session-actor-replica-D_j2y4I5.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { o as hasRegisteredSessionPendingInputOwner } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { a as withSessionEntryWorker, o as settleSessionWorkerReceipt } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
//#region src/config/sessions/session-store-read-target.ts
/** Capture before discovery yields, then bind its selected physical database. */
function captureSessionStoreReadTarget(scope, changedMessage) {
	const logical = resolveSqliteScope({
		...scope,
		storePath: void 0
	});
	const storePath = logical.path ?? scope.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(logical));
	const admitted = captureOpenClawAgentDatabaseReadValidation({
		agentId: toDatabaseOptions(logical).agentId,
		path: storePath
	});
	const prepared = admitted?.canonicalPath === storePath ? admitted : void 0;
	const candidates = prepared ? [] : captureSessionStoreReadCandidates(storePath);
	const identities = captureSessionStoreCandidateIdentities(candidates);
	return { resolve(resolved) {
		const options = {
			...toDatabaseOptions(resolved),
			path: resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))
		};
		const identity = prepared ? {
			key: `file:${prepared.validation.identity}`,
			birthtime: prepared.validation.birthtime,
			canonicalPath: prepared.canonicalPath
		} : identities.get(assertSessionStoreReadCandidate(options.path, candidates));
		if (!identity) throw new Error(changedMessage);
		const assertReadCurrent = () => {
			if (prepared) {
				prepared.assertCurrent();
				if (options.path !== prepared.canonicalPath) throw new Error(changedMessage);
			} else {
				assertSessionStoreReadCandidate(options.path, candidates);
				assertExistingDatabaseIdentity(options.path, identity.key, identity.birthtime);
			}
		};
		return {
			options,
			identity,
			source: {
				agentId: options.agentId,
				path: options.path,
				databaseIdentity: identity.key.slice(5),
				databaseBirthtime: identity.birthtime
			},
			assertReadCurrent,
			assertCurrent: () => {
				assertReadCurrent();
				if (prepared) assertExistingDatabaseIdentity(options.path, identity.key, identity.birthtime);
			}
		};
	} };
}
//#endregion
//#region src/config/sessions/session-pending-input-history.ts
function owns(path, row, currentSessionId) {
	return row.session_id === currentSessionId && hasRegisteredSessionPendingInputOwner(path, row);
}
function admitCustody(path, stage, facts) {
	const protectedRows = facts.protected ? new Int32Array(facts.protected) : void 0;
	if (stage === "transaction" && protectedRows?.length !== facts.candidates.length) throw new Error("Pending input history omitted its live custody response");
	facts.candidates.forEach((row, index) => {
		const protectedInput = owns(path, row, facts.currentSessionId);
		if (protectedRows) Atomics.store(protectedRows, index, protectedInput ? 1 : 0);
		else if (protectedInput) throw new Error("Pending input acquired live custody before interruption committed");
	});
}
function applyReceipt(snapshot, receipt) {
	const interrupted = new Set(receipt.ids);
	for (const row of snapshot.rows) if (interrupted.has(row.input_id)) row.state = "interrupted";
	return snapshot;
}
async function readMemoryPendingInputHistory(binding, query) {
	const storage = binding.actor.storage;
	const snapshot = await storage.read({
		type: "session.pendingInput.history",
		input: query
	}, binding.authority);
	const ids = snapshot.rows.filter((row) => row.state === "queued").map((row) => row.input_id);
	if (!ids.length) return snapshot;
	const outcome = await storage.mutate({
		type: "session.pendingInput.interruptHistory",
		input: {
			sessionKey: query.sessionKey,
			sessionId: query.sessionId,
			ids
		}
	}, {
		...binding.authority,
		isPendingInputProtected: (candidate, currentSessionId) => owns(binding.path, candidate, currentSessionId)
	});
	if (outcome.kind === "rolled-back") throw Object.assign(new Error(outcome.error.message), { name: outcome.error.name });
	if (outcome.failure) throw Object.assign(new Error(outcome.failure.message), { name: outcome.failure.name });
	return applyReceipt(snapshot, outcome.value);
}
async function readPendingInputRows(scope, options, onRead) {
	const memory = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (memory) return await withSessionActorStorage(scope, {
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		authority: memory.authority
	}, (binding) => {
		const query = {
			...options,
			sessionKey: binding.actor.target.sessionKey,
			sessionId: scope.sessionId
		};
		if (onRead) {
			const snapshot = binding.actor.storage.readCurrent({
				type: "session.pendingInput.history",
				input: query
			}, binding.authority);
			onRead(snapshot);
			return snapshot;
		}
		return readMemoryPendingInputHistory(binding, query);
	}) ?? {
		rows: [],
		total: 0
	};
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const query = {
		...options,
		sessionKey: scope.sessionKey,
		sessionId: scope.sessionId
	};
	const target = captureSessionStoreReadTarget(captured, "Pending input history changed its captured database owner");
	const resolved = await prepareSqliteScope(captured);
	const { options: databaseOptions, identity, source: readSource, assertReadCurrent, assertCurrent } = target.resolve(resolved);
	if (!identity.key.startsWith("file:")) return {
		rows: [],
		total: 0
	};
	assertReadCurrent();
	if (hasSessionActorEmptyPendingInputHistory(identity, resolved.sessionKey, query.sessionId)) return {
		rows: [],
		total: 0
	};
	return withSessionHistoryWorkerDatabase(databaseOptions, async (owner) => {
		if (onRead) {
			const { captureSessionEntryNativeMutationWitness } = await import("./session-entry-read-ordered-BDuUakEp.mjs");
			return runOpenClawAgentWriteAdmission(databaseOptions, async (_identity, assertOwner) => {
				const assertNative = captureSessionEntryNativeMutationWitness([{
					...databaseOptions,
					env: captured.env
				}]);
				const snapshot = await owner.readPendingInputHistory({
					query: {
						...query,
						sessionKey: resolved.sessionKey
					},
					env: captured.env,
					source: readSource
				});
				assertReadCurrent();
				owner.assertCurrent();
				assertOwner();
				assertNative();
				onRead(snapshot);
				return snapshot;
			}, true);
		}
		const snapshot = await owner.readPendingInputHistory({
			query: {
				...query,
				sessionKey: resolved.sessionKey
			},
			env: captured.env,
			source: readSource
		});
		assertReadCurrent();
		const ids = snapshot.rows.filter((row) => row.state === "queued" && !owns(identity.canonicalPath, row, snapshot.currentSessionId)).map((row) => row.input_id);
		if (!ids.length) return snapshot;
		let admitted;
		const checkCustody = (stage, facts) => {
			const publication = isRecord(facts) ? facts.publication : void 0;
			if (!isRecord(publication) || publication.kind !== "pending-input-history-custody") throw new Error("Pending input history omitted custody facts");
			admitCustody(identity.canonicalPath, stage, publication);
		};
		return withSessionEntryWorker(databaseOptions, readSource.databaseIdentity, () => {
			assertCurrent();
			owner.assertCurrent();
		}, async (execution, source) => {
			const result = await execution.runExisting(source, (worker) => settleSessionWorkerReceipt(() => worker.execute({
				type: "session.pendingInputs.interruptHistory",
				input: {
					sessionKey: resolved.sessionKey,
					sessionId: captured.sessionId,
					ids
				}
			}), () => admitted, (receipt) => {
				if (isRecord(receipt) && receipt.kind === "pending-input-history-interrupted") return applyReceipt(snapshot, receipt);
			}, "Pending input history has no confirmed native completion and receipt"));
			assertCurrent();
			if (!result) throw new Error("Pending input history lost its existing database");
			return result;
		}, (admission, retained, facts) => {
			checkCustody("commit", facts);
			admitted = {
				admission,
				retained
			};
		}, void 0, void 0, void 0, (facts) => checkCustody("transaction", facts));
	});
}
async function listSessionPendingInputs(scope, options = {}) {
	const { rows, total, nextBefore } = await readPendingInputRows(scope, options);
	return {
		items: rows.toReversed().map(projectSessionPendingInput),
		total: total ?? 0,
		...nextBefore !== void 0 ? { nextBefore } : {}
	};
}
async function readSessionPendingInput(scope, id, onRead) {
	const row = (await readPendingInputRows(scope, {
		id,
		limit: 1
	}, onRead ? (snapshot) => {
		const input = snapshot.rows[0];
		const result = onRead(input ? projectSessionPendingInput(input) : void 0);
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => {});
			throw new Error("Pending input consumers must remain synchronous");
		}
	} : void 0)).rows[0];
	return row ? projectSessionPendingInput(row) : void 0;
}
//#endregion
export { readSessionPendingInput as n, captureSessionStoreReadTarget as r, listSessionPendingInputs as t };

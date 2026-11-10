import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as captureSessionTranscriptTargetBinding, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { z as planSessionMessageCut } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { a as normalizeStoreSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { v as retainPreparedSessionSharingFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { c as reconcileSessionTranscriptIndexInTransaction, s as markSessionTranscriptIndexDirtyInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { C as withSqliteSessionContextReset, S as runSqliteSessionDeletionTransaction, _ as readSessionIdentitySnapshot, a as writeSessionEntry, b as commitSqliteSessionDeletion } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as ensureTranscriptSessionRoot } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { l as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { r as invalidateSessionBranchCache } from "./session-accessor.sqlite-branches-BnZyeeO5.mjs";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-message-cut.ts
async function rewindSessionToMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "rewind", expectedState);
}
async function forkSessionAtMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "fork", expectedState);
}
/** Gateway-owned source predicates are checked beside the transaction's fresh session row. */
async function mutateSessionAtMessageWithPreconditions(params, mode, expectedState, preconditions) {
	return mutateSqliteSessionAtMessage(params, mode, expectedState, preconditions);
}
async function switchSessionBranch(params, expectedState) {
	return await mutateSqliteSessionAtMessage({
		...params,
		entryId: params.leafEntryId
	}, "switch", expectedState);
}
async function mutateSqliteSessionAtMessage(params, mode, expectedState, preconditions) {
	const canonicalSourceKey = normalizeStoreSessionKey(params.sessionKey);
	const sourceKey = normalizeStoreSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const targetKey = mode === "fork" ? normalizeStoreSessionKey(params.targetKey ?? params.sessionKey) : sourceKey;
	const intent = {
		canonicalSourceKey,
		creation: params.creation ? structuredClone(params.creation) : void 0,
		forkWorkspace: params.forkWorkspace ? structuredClone(params.forkWorkspace) : void 0,
		entryId: params.entryId,
		expectedState: expectedState ? { ...expectedState } : void 0,
		mode,
		repositoryWorkspaceId: params.repositoryWorkspaceId,
		sourceKey,
		targetKey
	};
	const memoryScope = {
		...params,
		sessionKey: sourceKey
	};
	const assertCurrent = () => {
		params.commitGuard?.();
		preconditions?.assertUpstreamCurrent?.();
	};
	const authority = {
		assertCurrent,
		authorize() {}
	};
	const owner = captureSessionActorStorageOwner(memoryScope, authority);
	if (owner) return await withSessionActorStorage(memoryScope, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		}
	}, async (memory) => {
		const mutate = async (assertResetCurrent = () => {}, capture) => {
			let authorityError;
			const companions = {};
			const outcome = await memory.actor.storage.mutate({
				type: "session.messageCut",
				input: {
					intent,
					sourceRepositoryWorkspaceId: preconditions?.sourceRepositoryWorkspaceId
				}
			}, {
				authorize: (stage, facts, publication) => memory.authority.authorize(stage, facts, publication),
				assertCurrent() {
					try {
						memory.authority.assertCurrent();
						assertResetCurrent();
					} catch (error) {
						authorityError = error;
						throw error;
					}
				}
			}, { beforeCommit(receipt) {
				const entry = receipt.changes.find((change) => change.sessionKey === sourceKey)?.before?.entry;
				if (capture && receipt.value.status === "created" && entry) {
					companions.settlement = capture([{
						sessionKey: sourceKey,
						entry
					}]);
					companions.settlement.beforeCommit();
				}
			} });
			companions.settlement?.settle(outcome.kind);
			if (outcome.kind === "rolled-back" && authorityError) throw toErrorObject(authorityError, "Session message cut authority rejected the operation");
			return readSessionActorStorageResult(outcome);
		};
		if (mode === "fork") return mutate();
		const entry = await memory.actor.storage.read({
			type: "session.entry.read",
			input: {}
		}, memory.authority);
		if (!entry) return { status: "missing-session" };
		const target = captureSessionTranscriptTargetBinding({
			agentId: memory.agentId,
			storePath: memory.path,
			env: params.env
		});
		return withSqliteSessionContextReset({
			agentId: memory.agentId,
			path: memory.path,
			env: target.env,
			ownerStorePath: params.storePath
		}, {
			sessionKey: sourceKey,
			entry
		}, mutate, preconditions?.assertUpstreamCurrent, owner.owner);
	}) ?? { status: "missing-session" };
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	const options = toDatabaseOptions(resolved);
	if (isMainThread && supportsOpenClawAgentDatabaseExecution(options)) {
		const pathname = resolveOpenClawAgentSqlitePath(options);
		const source = readDatabasePathIdentitySync(pathname);
		const env = captureSessionTranscriptStorageEnvironment(resolved.env ?? process.env);
		const selection = !intent.expectedState && source.key.startsWith("file:") ? retainPreparedSessionSharingFacts({
			databaseIdentity: source.key,
			sessionKey: sourceKey,
			acquiring: true
		}) : void 0;
		try {
			const { mutateSessionHistoryInWorker } = await import("./session-message-cut-CuRr1rNV.mjs");
			return await mutateSessionHistoryInWorker({
				...params,
				env
			}, {
				...resolved,
				env,
				path: pathname
			}, {
				...intent,
				mode
			}, source, (prepared, assertPreparedCurrent) => mutatePreparedSqliteSessionAtMessage({
				...params,
				env
			}, {
				...resolved,
				env
			}, prepared, assertPreparedCurrent, preconditions), selection, preconditions);
		} finally {
			selection?.release();
		}
	}
	const preparedEntry = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), sourceKey)?.entry;
	const preparedExpectedState = expectedState ?? (preparedEntry?.sessionId ? {
		sessionId: preparedEntry.sessionId,
		lifecycleRevision: preparedEntry.lifecycleRevision
	} : void 0);
	if (preparedEntry?.sessionId) {
		params.commitGuard?.();
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
		await restoreSessionColdTranscript({
			...params,
			agentId: resolved.agentId,
			sessionId: preparedEntry.sessionId
		});
	}
	const mutate = (assertPreparedCurrent) => mutatePreparedSqliteSessionAtMessage(params, resolved, {
		...intent,
		expectedState: preparedExpectedState
	}, assertPreparedCurrent, preconditions);
	return mode !== "fork" && preparedEntry ? await withSqliteSessionContextReset(resolved, {
		sessionKey: sourceKey,
		entry: preparedEntry
	}, mutate, preconditions?.assertUpstreamCurrent) : await mutate();
}
function mutatePreparedSqliteSessionAtMessage(params, resolved, intent, assertPreparedCurrent, preconditions) {
	return runExclusiveSqliteSessionWrite(resolved, async () => {
		let previousIdentity = /* @__PURE__ */ new Map();
		const { databasePath, result, publish } = runSqliteSessionDeletionTransaction((database) => {
			assertPreparedCurrent?.();
			params.commitGuard?.();
			preconditions?.assertUpstreamCurrent?.();
			const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(intent.sourceKey), ...collectSessionEntryLookupKeys(intent.targetKey)]);
			previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			const mutationResult = mutateSqliteSessionAtMessageInTransaction(database, resolved, intent, { sourceRepositoryWorkspaceId: preconditions?.sourceRepositoryWorkspaceId });
			const currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			const publishIdentity = prepareSessionIdentityPublication(database, resolved.agentId, previousIdentity, currentIdentity);
			preconditions?.assertUpstreamCurrent?.();
			return {
				databasePath: database.path,
				result: mutationResult,
				publish: publishIdentity
			};
		}, toDatabaseOptions(resolved), { operationLabel: "session.transcript.message-cut" });
		if (result.status === "created") invalidateSessionBranchCache(databasePath, [...[...previousIdentity.values()].flatMap((entry) => entry.sessionId ? [entry.sessionId] : []), ...result.entry.sessionId ? [result.entry.sessionId] : []]);
		publish();
		return result;
	}, "session.message-cut.mutate");
}
function mutateSqliteSessionAtMessageInTransaction(database, resolved, params, projection) {
	const currentEntry = readSessionEntryRow(database, params.sourceKey)?.entry;
	const plan = planSessionMessageCut(currentEntry, currentEntry?.sessionId ? loadTranscriptEventsFromDatabase(database, currentEntry.sessionId) : [], params, projection?.sourceRepositoryWorkspaceId);
	if (plan.status !== "prepared") return plan;
	if (params.mode !== "fork" && currentEntry) commitSqliteSessionDeletion(params.sourceKey, currentEntry);
	const nextSessionId = plan.result.entry.sessionId;
	const targetScope = {
		...resolved,
		sessionId: nextSessionId,
		sessionKey: params.targetKey
	};
	let copiedBytes = 0;
	const rebuildSynchronously = params.mode !== "fork" && plan.events.length <= 4e3 && plan.events.every((event) => {
		copiedBytes += JSON.stringify(event).length;
		return copiedBytes <= 4194304;
	});
	if (params.mode !== "fork" && !rebuildSynchronously) {
		ensureTranscriptSessionRoot(database, targetScope, Date.parse(plan.header.timestamp));
		markSessionTranscriptIndexDirtyInTransaction(database.db, nextSessionId);
	}
	appendTranscriptEventsInTransaction(database, targetScope, plan.events, projection);
	if (rebuildSynchronously) reconcileSessionTranscriptIndexInTransaction(database.db, nextSessionId);
	else if (params.mode !== "fork") projection?.onProjectionReconcileNeeded?.();
	writeSessionEntry(database, params.targetKey, plan.result.entry);
	return plan.result;
}
//#endregion
export { switchSessionBranch as a, rewindSessionToMessage as i, mutateSessionAtMessageWithPreconditions as n, mutateSqliteSessionAtMessageInTransaction as r, forkSessionAtMessage as t };

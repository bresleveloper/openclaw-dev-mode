import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as waitForAgentDatabasePreparation } from "./agent-database-preparation-context-DK375nya.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, n as assertDatabasePathIdentity, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { p as retainSqliteWorkerErrorCode, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { a as captureExternalSessionCommitGuard, f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { _ as retainAgentDatabase, t as cache, u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CeDA0ojh.mjs";
import { c as runOpenClawAgentWriteTransaction, i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as captureSessionTranscriptTargetBinding, t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { B as SessionLabelOwnerIndex, G as estimateParentForkPromptTokens, H as resolveProjectionExistingEntry, J as resolveParentForkSourceTranscript, K as planParentForkDecision, W as buildForkedChildTranscriptEvents, q as resolveParentForkLimitDecision } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as isSessionStoreReadCandidateCurrent, n as captureSessionStoreCandidateIdentities, r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { a as matchesPluginHostCleanupSession, i as isLockedHarnessSessionOwnedByPlugin, o as shouldSkipPluginHostCleanupStore, r as hasPluginHostCleanupTarget, t as clearPluginHostCleanupTarget } from "./plugin-host-cleanup-DPJxrJDM.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { d as withSessionEntryCreationPublication, u as runWithSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import { i as prepareSessionIdentityPublication, n as prepareCommittedSessionEntryRemovals, o as publishCommittedSessionIdentity, r as prepareLifecycleIdentityPublication } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { a as normalizeResolvedMaintenanceConfigInput, r as countUnarchivedSessionEntries } from "./store-maintenance-BqMt1Twc.mjs";
import { a as resolveSessionMaintenancePreserveKeys, o as planSessionEntryMaintenance, r as assertMaintenancePreservationCompatible } from "./transcript-event-media-C4aKs47S.mjs";
import { n as forkCliSessionBindings } from "./cli-session-binding-Dx1VbkI8.mjs";
import { o as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { n as resolveSqliteReadScope, r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { c as resolveSqliteWriteAdmissionScope, d as withSqliteSessionDatabase, i as prepareSqliteScope, l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope, o as resolveSqliteTranscriptArchiveDirectory, r as formatLegacySqliteSessionMarkerForScope, s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution, t as captureAgentDeletionDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { c as maintenanceLane, l as projectionLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase, r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as withSessionStoreTarget } from "./session-store-target-runtime-D11id0W-.mjs";
import { a as readSessionEntrySummariesInWorker, i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { t as executeOpenClawAgentWorkerPublication } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { f as withSqliteMutationWorkerLifetime, r as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
import { S as runSqliteSessionDeletionTransaction, T as withSqliteSessionDeletions, x as hasPreparedNativeSessionDeletion, y as captureNativeSessionWorkerDeletion } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { a as withSessionEntryWorker, n as initializeSessionTranscriptInWorker, r as prepareSessionEntryReplacementDatabase, t as commitSessionEntryReplacementsInWorker } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { g as shouldRemoveSessionEntry, l as projectSessionEntryLifecycleMutation, r as buildProjectedLifecycleUpserts } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { o as patchSessionEntryCore, v as createSessionActorEntryWithTranscriptInScope } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { c as resolveSessionReclamationDatabaseOptions, l as runExclusiveSqliteSessionReclamation, t as createLifecycleArtifactReclamationPlan } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-DxLFa_Iq.mjs";
import { n as commitProjectedSessionEntryLifecycleMutationInDatabase } from "./session-accessor.sqlite-projection-state-C-cqsNKA.mjs";
import { n as runSessionNativeBindingWorkerOperation } from "./session-native-binding-CM20NNGU.mjs";
import { a as applySessionEntryMaintenance, c as prunePublishedSessionArchivesByRetention, f as runSqliteSessionReclamation, l as publishSessionStateArchives, o as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort, s as refreshSqliteSessionPlannerStatisticsBestEffort, u as publishSessionStateArchivesInWorker } from "./session-history-eviction-DcKJmUSb.mjs";
import { t as emitArchivedTranscriptUpdates } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import { r as prepareSessionMaintenancePreservation } from "./store-maintenance-preserve-BGAXgKIR.mjs";
import "./session-accessor.entry-BLpjjUTc.mjs";
import { i as readSessionEntryReplacementState, n as readSessionCreationSnapshotInDatabase, t as assertSessionCreationLabelAvailable } from "./session-accessor.sqlite-creation-read-Dt1Glefh.mjs";
import { n as commitSessionEntryReplacementsInDatabase } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { n as prepareSessionLifecycleArtifactCleanupForMaintenance } from "./session-accessor.sqlite-lifecycle-artifacts-CHlxPjEK.mjs";
import "./session-accessor.sqlite-lifecycle-7VGnaDT3.mjs";
import { t as WorkerPlacementInventoryChangedError } from "./placement-inventory-changed-error-CvjNg-kM.mjs";
import { n as prepareSessionAgentPurgeInDatabase, t as commitSessionAgentPurgeInDatabase } from "./session-agent-purge.kernel-ryET9A-g.mjs";
import { r as restoreSessionColdTranscript } from "./session-cold-storage-BJd_oJjB.mjs";
import { t as executeSessionForkOperation } from "./session-fork-domain-DDfFNSmm.mjs";
import { t as loadSessionTranscriptEvents } from "./session-transcript-events-BFcYGLfY.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-OIv_abWd.mjs";
import { randomUUID } from "node:crypto";
import path, { resolve } from "node:path";
import { isMainThread } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-commit-context.ts
/** Native-only scopes retain their original handle, not a pathname reopened after commit. */
async function withNativeSessionCommitContext(database, env, commit, afterCommitted) {
	if (!afterCommitted) return commit();
	if (database.db.isTransaction) throw new Error("Session commit follow-up requires an outer transaction");
	const capturedEnv = Object.freeze({ ...env });
	const state = captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(capturedEnv));
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	const completion = createDeferredCore();
	let active = true;
	const revoke = () => {
		active = false;
	};
	const context = {
		env: capturedEnv,
		assertCurrent() {
			if (!active || cache.databases.get(database.path) !== database || !isOpenClawAgentDatabasePathCurrent(database)) throw new Error("Session commit owner is no longer current");
			if (cache.failures.has(database.path)) throw cache.failures.get(database.path);
			state.assertCurrent();
			maintenance?.assertAdmission();
			assertAgentDatabaseAdmitted(database.agentId, { env: capturedEnv });
		}
	};
	context.assertCurrent();
	const release = retainAgentDatabase(database.db);
	let unregisterAgent;
	let unregisterState;
	try {
		unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
			agentId: database.agentId,
			path: database.path,
			revoke,
			close: () => completion.promise
		});
		unregisterState = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
			if (!identity || identity.key === state.identity.key) {
				revoke();
				await completion.promise;
			}
		} });
		const result = commit(context);
		await afterCommitted(context);
		return result;
	} finally {
		revoke();
		release();
		completion.resolve();
		unregisterAgent?.();
		unregisterState?.();
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-prepared-write.ts
/** Keep ordinary updates serialized; release the writer for preparation or source custody. */
async function runPreparedSqliteSessionWrite(initialScope, prepare, operation, withCommit, prepareScope, scheduling = "foreground") {
	let scope = initialScope;
	const prepareWrite = async () => {
		if (prepareScope) {
			const preparedScope = await prepareScope();
			if (preparedScope.path !== scope.path) throw new Error("Session write preparation changed its reserved database path");
			scope = preparedScope;
		}
		const write = await prepare(scope);
		return scheduling === "worker" || write.deletedEntries.length || write.beforeCommit || withCommit ? { write } : { result: await write.commit() };
	};
	const prepared = scheduling === "worker" ? await prepareWrite() : await runExclusiveSqliteSessionWrite(scope, prepareWrite, operation);
	if (!prepared.write) return {
		deletedEntries: 0,
		result: prepared.result,
		scope
	};
	const write = prepared.write;
	const commit = async (assertCurrent) => {
		await write.beforeCommit?.();
		const runCommit = async (assertSourceCurrent) => {
			const commitHeld = async () => {
				const assertHeld = composeSessionSourceAssertion([assertCurrent, assertSourceCurrent]);
				assertHeld();
				return await write.commit(assertHeld);
			};
			return scheduling === "worker" && (!hasPreparedNativeSessionDeletion() || captureNativeSessionWorkerDeletion(write.deletedEntries)) ? await commitHeld() : await runExclusiveSqliteSessionWrite(scope, commitHeld, operation);
		};
		return withCommit ? await withCommit(runCommit) : await runCommit();
	};
	const result = write.deletedEntries.length || write.beforeCommit ? await withSqliteSessionDeletions(scope, write.deletedEntries, commit) : await commit();
	return {
		deletedEntries: write.deletedEntries.length,
		result,
		scope
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-projection.ts
async function applyMemorySessionEntryReplacementProjection(memory, params, normalize, creation) {
	const snapshots = memory ? await memory.actor.storage.read({
		type: "session.entries.read",
		input: {
			sessionKeys: params.sessionKeys,
			includeSessionWindowOwner: params.includeSessionWindowOwner,
			includeLabelOwners: params.includeLabelOwners
		}
	}, memory.authority) : [];
	const prepared = new Map(snapshots.map(({ sessionKey, entry }) => [sessionKey, entry]));
	const windowOwner = params.includeSessionWindowOwner && memory?.actor.storage.readCurrent({
		type: "session.entry.readById",
		input: { sessionId: params.includeSessionWindowOwner }
	}, memory.authority)?.sessionKey;
	const selectedKeys = params.sessionKeys ? /* @__PURE__ */ new Set([...params.sessionKeys, ...windowOwner ? [windowOwner] : []]) : void 0;
	const updated = await params.update(structuredClone(snapshots));
	const requested = normalize(updated.replacements);
	const seen = /* @__PURE__ */ new Set();
	for (const replacement of requested) {
		if (selectedKeys && !selectedKeys.has(replacement.sessionKey)) throw new Error(`Session entry replacement is outside the selected key set: ${replacement.sessionKey}`);
		if (replacement.previousSessionKeys) {
			if (seen.has(replacement.sessionKey)) throw new Error(`Session entry replacements overlap at ${replacement.sessionKey}`);
			seen.add(replacement.sessionKey);
		}
	}
	const applicable = requested.filter(({ sessionKey, previousSessionKeys }) => prepared.has(sessionKey) || creation?.sessionKey === sessionKey || previousSessionKeys?.length === 0);
	if (params.requireWriteSuccess && requested.length > 0 && (!memory || applicable.length === 0)) throw new Error("session entry replacements did not persist any rows");
	if (!memory || applicable.length === 0) return updated.result;
	const replacements = applicable.flatMap((replacement) => {
		if (replacement.previousSessionKeys?.some((key) => key !== replacement.sessionKey)) throw new Error("Memory session replacement cannot retain legacy aliases");
		const transcript = params.preparedTranscript?.sessionKey === replacement.sessionKey ? params.preparedTranscript.events : void 0;
		return [{
			sessionKey: replacement.sessionKey,
			expected: prepared.get(replacement.sessionKey),
			entry: replacement.entry,
			label: params.labelClaim?.sessionKey === replacement.sessionKey ? params.labelClaim.label : void 0,
			owner: params.ownerAssignment?.sessionKey === replacement.sessionKey ? params.ownerAssignment.owner : void 0,
			transcriptEvents: transcript
		}];
	});
	const commit = async (assertSourceCurrent) => {
		const config = params.skipMaintenance === false ? resolveMaintenanceConfig() : void 0;
		const preservation = config && config.mode !== "warn" ? await prepareSessionMaintenancePreservation(memory.path) : void 0;
		try {
			readSessionActorStorageResult(await memory.actor.storage.mutate({
				type: "session.entry.replacements",
				input: {
					replacements,
					consumePendingReset: params.consumePendingReset,
					...config && preservation ? { maintenance: {
						config,
						preservation: preservation.capture(),
						activeSessionKey: params.activeSessionKey
					} } : {}
				}
			}, {
				...memory.authority,
				assertCurrent() {
					memory.authority.assertCurrent();
					assertSourceCurrent?.();
				}
			}, { committed: () => params.onLifecycleCommitted?.(false) }));
			if (params.afterCommitted) {
				const handle = await memory.actor.storage.acquire(memory.actor.target.sessionKey);
				try {
					await params.afterCommitted(updated.result, {
						env: params.env,
						assertCurrent() {
							handle.assertCurrent();
							memory.authority.assertCurrent();
						}
					});
				} finally {
					await handle.release();
				}
			}
			return updated.result;
		} finally {
			preservation?.dispose();
		}
	};
	return params.withCommit ? params.withCommit(commit) : commit();
}
async function applySqliteSessionEntryReplacementProjection(params, normalize, creation) {
	const target = {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? params.sessionKeys?.[0] ?? "",
		storePath: params.storePath,
		env: params.env
	};
	const captured = captureSessionActorStorageOwner(target, {
		assertCurrent: () => params.assertCommitAllowed?.(),
		authorize() {}
	});
	if (captured) {
		const env = cloneEnvWithPlatformSemantics(params.env ?? { OPENCLAW_STATE_DIR: path.resolve(captured.path, "../../../..") });
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		const memoryParams = {
			...params,
			env
		};
		if (captured.binding?.agentId === captured.agentId && path.resolve(captured.binding.path) === path.resolve(captured.path)) return applyMemorySessionEntryReplacementProjection({
			...captured.binding,
			authority: captured.authority
		}, memoryParams, normalize, creation);
		const owner = captured.owner;
		const sessionKey = owner?.listSessionEntries(captured.authority, "list")[0]?.sessionKey;
		const actor = owner && sessionKey ? await owner.acquireExisting(sessionKey, {
			assertCurrent: () => captured.authority.assertCurrent(),
			assertReadable: () => captured.authority.assertCurrent()
		}) : void 0;
		try {
			return await applyMemorySessionEntryReplacementProjection(actor ? {
				...captured,
				actor
			} : void 0, memoryParams, normalize, creation);
		} finally {
			await actor?.release();
		}
	}
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	target.env = env;
	const admission = !creation && isMainThread ? resolveSqliteWriteAdmissionScope(target) : void 0;
	const scope = creation?.scope ?? admission ?? (isMainThread ? await prepareSqliteScope(target) : resolveSqliteScope(target));
	scope.path ??= resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const preparedWrite = await runPreparedSqliteSessionWrite(scope, async (preparedScope) => {
		creation?.onWriterAdmitted?.();
		if (creation) params.assertCommitAllowed?.();
		const resolved = {
			...preparedScope,
			env
		};
		const databaseOptions = {
			...toDatabaseOptions(resolved),
			path: resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))
		};
		const useWorker = creation !== void 0 || isMainThread && supportsOpenClawAgentDatabaseExecution(databaseOptions);
		const readNative = () => withSqliteSessionDatabase(databaseOptions, (database) => ({
			...readSessionEntryReplacementState(database, params),
			databaseIdentity: readOpenClawAgentDatabaseIdentity(database).identity
		}));
		const snapshot = creation && creation.creationSnapshot.existingEntry === void 0 && creation.creationSnapshot.targetEntry === void 0 && creation.creationSnapshot.legacyKeys.length === 0 ? {
			entries: [],
			expectedRows: /* @__PURE__ */ new Map(),
			labelOwnerKeys: [],
			selectedSessionKeys: [creation.sessionKey],
			databaseIdentity: creation.creationSnapshot.databaseIdentity
		} : useWorker ? await withSessionHistoryWorkerDatabase(databaseOptions, async (owner) => {
			const read = () => owner.readExactEntries({
				sessionKeys: params.sessionKeys ?? [],
				projection: "replacement",
				replacementSelection: {
					sessionKeys: params.sessionKeys,
					includeSessionWindowOwner: params.includeSessionWindowOwner,
					includeLabelOwners: params.includeLabelOwners
				},
				env: { ...resolved.env }
			});
			let result = await read();
			if (!result.replacement) {
				await prepareSessionEntryReplacementDatabase(databaseOptions, () => {
					owner.assertCurrent();
					params.assertCommitAllowed?.();
				}, params.retainedExecution);
				result = await read();
			}
			if (!result.replacement) throw new Error("Session replacement snapshot lost its initialized database");
			return result.replacement;
		}, params.sessionKeys && params.sessionKeys.length + (params.includeSessionWindowOwner ? 1 : 0) <= 64 && params.includeLabelOwners === void 0 ? projectionLane : maintenanceLane) : await readNative();
		const { entries, expectedRows, labelOwnerKeys } = snapshot;
		const selectedKeys = snapshot.selectedSessionKeys ? new Set(snapshot.selectedSessionKeys) : void 0;
		const operation = await params.update(entries);
		const replacements = normalize(operation.replacements);
		const claimedCanonicalKeys = /* @__PURE__ */ new Set();
		for (const replacement of replacements) {
			const previousSessionKeys = replacement.previousSessionKeys;
			const canonical = previousSessionKeys !== void 0;
			if (canonical && !replacement.sessionKey) throw new Error("Session entry replacement requires a key");
			if (canonical && [replacement.sessionKey, ...previousSessionKeys ?? []].some(isInternalSessionEffectsKey)) throw new Error("Session entry canonical replacement cannot target internal effects rows");
			for (const sessionKey of [replacement.sessionKey, ...previousSessionKeys ?? []]) {
				if (selectedKeys && !selectedKeys.has(sessionKey)) throw new Error(`Session entry replacement is outside the selected key set: ${sessionKey}`);
				if (canonical) {
					if (claimedCanonicalKeys.has(sessionKey)) throw new Error(`Session entry replacements overlap at ${sessionKey}`);
					claimedCanonicalKeys.add(sessionKey);
				}
			}
			if (canonical) {
				for (const previousSessionKey of previousSessionKeys) if (!expectedRows.has(previousSessionKey)) throw new Error(`Session entry canonical projection cannot replace missing alias ${previousSessionKey}`);
			}
		}
		const applicable = replacements.filter((replacement) => replacement.previousSessionKeys || expectedRows.has(replacement.sessionKey) || creation?.sessionKey === replacement.sessionKey);
		if (params.requireWriteSuccess && replacements.length > 0 && applicable.length === 0) throw new Error("session entry replacements did not persist any rows");
		if (applicable.length === 0) return {
			deletedEntries: [],
			commit: () => ({
				maintenancePlans: [],
				result: operation.result
			})
		};
		const mutationKeys = new Set(applicable.flatMap((replacement) => [replacement.sessionKey, ...replacement.previousSessionKeys ?? []]));
		const validationKeys = /* @__PURE__ */ new Set([...mutationKeys, ...labelOwnerKeys]);
		const deletedOwners = [...mutationKeys].flatMap((sessionKey) => {
			const entry = expectedRows.get(sessionKey)?.entry;
			return entry && !applicable.some((replacement) => replacement.sessionKey === sessionKey) ? [{
				entry,
				sessionKey
			}] : [];
		});
		return {
			deletedEntries: deletedOwners,
			commit: async (assertSourceCurrent) => {
				const nativeDeletion = captureNativeSessionWorkerDeletion(deletedOwners);
				const preparedPreservation = params.skipMaintenance === false ? await prepareSessionMaintenancePreservation(params.storePath, { native: !useWorker }) : void 0;
				try {
					const maintenance = preparedPreservation ? {
						activeSessionKey: params.activeSessionKey ?? "",
						archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
						maintenance: resolveMaintenanceConfig(),
						preservation: preparedPreservation.capture(),
						storePath: params.storePath
					} : void 0;
					const assertCurrent = composeSessionSourceAssertion([assertSourceCurrent, params.assertCommitAllowed], (assertSources) => {
						assertSources();
						if (maintenance && !isDeepStrictEqual(maintenance.preservation, preparedPreservation?.capture())) throw new Error("Session maintenance protection changed before replacement");
					});
					const input = {
						expectedRows,
						labelOwnerKeys,
						includeLabelOwners: params.includeLabelOwners,
						validationKeys: [...validationKeys],
						replacements: applicable,
						checkPendingArchiveRecovery: params.checkPendingArchiveRecovery,
						consumePendingReset: params.consumePendingReset,
						ownerAssignment: params.ownerAssignment,
						labelClaim: params.labelClaim,
						preparedTranscript: params.preparedTranscript,
						maintenance
					};
					if (!useWorker) return await withSqliteSessionDatabase(databaseOptions, (owned) => withNativeSessionCommitContext(owned, resolved.env, (source) => {
						const committed = runSqliteSessionDeletionTransaction((database) => {
							if (params.onLifecycleCommitted) deferOpenClawAgentPostCommitPublication(database, () => params.onLifecycleCommitted?.(result.pendingArchiveRecovery));
							const result = commitSessionEntryReplacementsInDatabase(database, input, () => {
								assertCurrent();
								source?.assertCurrent();
							}, preparedPreservation?.refreshCandidates);
							return {
								...result,
								publish: prepareSessionIdentityPublication(database, resolved.agentId, result.previous, result.current)
							};
						}, databaseOptions, { operationLabel: "session.entry-replacements" });
						committed.publish();
						return {
							maintenancePlans: committed.maintenancePlans,
							result: operation.result
						};
					}, params.afterCommitted ? (source) => params.afterCommitted(operation.result, source) : void 0), assertCurrent);
					if (typeof snapshot.databaseIdentity !== "string") throw new Error("Session replacement requires its durable database identity");
					return {
						maintenancePlans: (await commitSessionEntryReplacementsInWorker(databaseOptions, snapshot.databaseIdentity, {
							...input,
							initializeTranscript: creation?.initializeTranscript
						}, assertCurrent, {
							identityAgentId: resolved.agentId,
							onLifecycleCommitted: params.onLifecycleCommitted,
							afterCommitted: params.afterCommitted ? (context) => params.afterCommitted(operation.result, context) : void 0
						}, params.retainedExecution, nativeDeletion)).maintenancePlans,
						result: operation.result
					};
				} finally {
					preparedPreservation?.dispose();
				}
			}
		};
	}, "session.entry-replacements", params.withCommit, admission ? () => prepareSqliteScope(target) : void 0, "foreground");
	const committed = preparedWrite.result;
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(preparedWrite.scope, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: preparedWrite.deletedEntries });
	return committed.result;
}
/** Worker creation admits an absent exact target; public replacement selection stays unchanged. */
async function applySessionEntryCreationReplacement(params) {
	await applySqliteSessionEntryReplacementProjection({
		...params,
		sessionKeys: [params.sessionKey, ...params.previousSessionKeys],
		afterCommitted: params.afterCommitted ? (_result, context) => params.afterCommitted(context) : void 0,
		update: () => ({
			result: void 0,
			replacements: [{
				sessionKey: params.sessionKey,
				entry: params.entry,
				...params.previousSessionKeys.length ? { previousSessionKeys: params.previousSessionKeys } : {}
			}]
		})
	}, (replacements) => [...replacements ?? []], params);
}
async function applySessionEntryExactReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection(params, (replacements) => [...replacements ?? []].map(({ entry, sessionKey }) => ({
		entry,
		sessionKey
	})));
}
/** Internal alias-aware owner; public SDK replacements remain exact-key only. */
async function applySessionEntryCanonicalReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection({
		...params,
		...params.sessionKeys ? { sessionKeys: uniqueStrings(params.sessionKeys.map((key) => key.trim()).filter(Boolean)) } : {}
	}, (replacements) => [...replacements ?? []].map((replacement) => ({
		entry: replacement.entry,
		previousSessionKeys: uniqueStrings(replacement.previousSessionKeys.map((key) => key.trim()).filter(Boolean)),
		sessionKey: replacement.sessionKey.trim()
	})));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-artifact-cleanup.ts
async function cleanupSessionLifecycleArtifactsCore(params) {
	const sessionKeySegmentPrefix = params.sessionKeySegmentPrefix.trim();
	const transcriptContentMarker = params.transcriptContentMarker;
	const pluginOwnerId = params.pluginOwnerId?.trim();
	if (!sessionKeySegmentPrefix || !transcriptContentMarker) return {
		removedEntries: 0,
		archivedTranscriptArtifacts: 0
	};
	const captured = captureSessionActorStorageOwner(params, {
		assertCurrent() {},
		authorize() {}
	});
	if (captured) {
		const owner = captured.owner;
		const anchorKey = owner?.listSessions(captured.authority)[0]?.target.sessionKey;
		if (!owner || !anchorKey) return {
			removedEntries: 0,
			archivedTranscriptArtifacts: 0
		};
		const input = {
			sessionKeySegmentPrefix,
			transcriptContentMarker,
			pluginOwnerId,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
			nowMs: params.nowMs ?? Date.now()
		};
		return await withSessionActorStorage({
			...params,
			sessionKey: anchorKey
		}, {
			authority: captured.authority,
			lifetime: {
				assertCurrent: () => owner.assertCurrent(),
				assertReadable: () => owner.assertCurrent()
			}
		}, async (memory) => {
			const plan = await memory.actor.storage.read({
				type: "session.lifecycle.artifacts",
				input
			}, memory.authority);
			if (!plan.entries.length && !plan.windows.length) return {
				removedEntries: 0,
				archivedTranscriptArtifacts: 0
			};
			const entries = plan.entries.map(({ sessionKey, expected: entry }) => ({
				sessionKey,
				entry
			}));
			const target = captureSessionTranscriptTargetBinding({
				agentId: owner.agentId,
				storePath: owner.path,
				env: params.env
			});
			return withSqliteSessionDeletions({
				agentId: owner.agentId,
				path: owner.path,
				env: target.env,
				ownerStorePath: params.storePath
			}, entries, async (assertDeletionCurrent, capture) => {
				const companions = {};
				const outcome = await memory.actor.storage.mutate({
					type: "session.lifecycle.reclaim",
					input: {
						entries: plan.entries,
						artifacts: {
							input,
							windows: plan.windows
						}
					}
				}, {
					authorize: (...args) => memory.authority.authorize(...args),
					assertCurrent() {
						memory.authority.assertCurrent();
						assertDeletionCurrent();
					}
				}, { beforeCommit(receipt) {
					const removed = new Set(receipt.value.removedSessionKeys);
					companions.settlement = capture(entries.filter((entry) => removed.has(entry.sessionKey)));
					companions.settlement.beforeCommit();
				} });
				companions.settlement?.settle(outcome.kind);
				return {
					removedEntries: readSessionActorStorageResult(outcome).removedSessionKeys.length,
					archivedTranscriptArtifacts: 0
				};
			}, {
				memory: owner,
				additionalIdentities: plan.windows.map((window) => window.sessionId)
			});
		}) ?? {
			removedEntries: 0,
			archivedTranscriptArtifacts: 0
		};
	}
	const requested = captureLifecycleDatabaseScope(resolveSqliteReadScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		storePath: params.storePath
	}));
	const requestedOptions = toDatabaseOptions(requested);
	const preparation = waitForAgentDatabasePreparation(requestedOptions.agentId, { env: requested.env });
	if (preparation) await preparation;
	const useWorker = isMainThread && supportsOpenClawAgentDatabaseExecution(requestedOptions);
	const opened = useWorker ? getOpenClawAgentDatabaseIfOpen(requestedOptions) : void 0;
	const openedIdentity = opened ? readOpenClawAgentDatabaseIdentity(opened) : void 0;
	const source = useWorker ? openedIdentity ? {
		key: `file:${openedIdentity.identity}`,
		birthtime: openedIdentity.birthtime,
		canonicalPath: openedIdentity.filename
	} : readDatabasePathIdentitySync(requested.path) : void 0;
	if (source?.key.startsWith("path:")) return {
		removedEntries: 0,
		archivedTranscriptArtifacts: 0
	};
	const resolved = {
		...requested,
		path: source?.canonicalPath ?? requested.path
	};
	const databaseOptions = {
		...toDatabaseOptions(resolved),
		path: resolved.path
	};
	return withSqliteMutationWorkerLifetime(databaseOptions, async ({ assertCurrent, signal }) => {
		const assertSourceCurrent = () => {
			assertCurrent();
			if (source) {
				const current = readDatabasePathIdentitySync(resolved.path);
				if (current.key !== source.key || current.birthtime !== source.birthtime) throw new Error("SQLite lifecycle cleanup database owner changed");
			}
		};
		const artifactPreparation = {};
		const cleanupPlan = await runExclusiveSqliteSessionWrite(resolved, async () => {
			assertSourceCurrent();
			const input = {
				...params.agentId !== void 0 ? { agentId: resolved.agentId } : {},
				archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts !== false,
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				...pluginOwnerId ? { pluginOwnerId } : {},
				sessionKeySegmentPrefix,
				transcriptContentMarker,
				orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
				nowMs: params.nowMs ?? Date.now(),
				diagnostics: artifactPreparation
			};
			if (!source) return prepareSessionLifecycleArtifactCleanupForMaintenance(databaseOptions, input);
			const continuation = opened ? captureCanonicalSessionReaderContinuation(opened) : void 0;
			try {
				assertSourceCurrent();
				const result = await withSessionHistoryWorkerDatabase(databaseOptions, (owner) => owner.readLifecycleArtifactPlan({
					env: resolved.env,
					input: {
						...input,
						continuation: continuation?.receipt
					},
					expectedSource: source
				}, signal), maintenanceLane);
				assertSourceCurrent();
				continuation?.assertCurrent();
				Object.assign(artifactPreparation, result.diagnostics);
				return result.plan;
			} finally {
				continuation?.release();
			}
		}, "session.lifecycle.artifacts-prepare", { artifactPreparation });
		assertSourceCurrent();
		if (cleanupPlan.entries.length === 0 && cleanupPlan.deletePlans.length === 0) {
			await publishSessionStateArchives(resolved, []);
			return {
				removedEntries: 0,
				archivedTranscriptArtifacts: 0
			};
		}
		const committed = await withSqliteSessionDeletions(resolved, cleanupPlan.entries.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
			entry,
			sessionKey
		}] : []), async (assertDeletionCurrent) => await runExclusiveSqliteSessionReclamation(async () => {
			const assertCommitAllowed = () => {
				assertSourceCurrent();
				assertDeletionCurrent();
			};
			assertCommitAllowed();
			const materializedPlans = await materializeSessionStateDeletePlans(cleanupPlan.deletePlans);
			assertCommitAllowed();
			const diagnostics = {};
			const plan = createLifecycleArtifactReclamationPlan({
				agentId: resolved.agentId,
				databaseOptions,
				entries: cleanupPlan.entries,
				materializedPlans
			});
			const reclaimed = await runSqliteSessionReclamation({
				diagnostics,
				assertCommitAllowed,
				plan
			});
			if (reclaimed.kind !== plan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${plan.kind}`);
			return reclaimed.value;
		}), { additionalIdentities: cleanupPlan.deletePlans.map((plan) => plan.sessionId) });
		const deletedEntries = Math.max(committed.removedEntries, new Set(cleanupPlan.deletePlans.map((plan) => plan.sessionId)).size);
		assertSourceCurrent();
		await refreshSqliteSessionPlannerStatisticsBestEffort(resolved, deletedEntries);
		assertSourceCurrent();
		const archivedTranscripts = await publishSessionStateArchives(resolved, committed.archivedTranscripts);
		return {
			removedEntries: committed.removedEntries,
			archivedTranscriptArtifacts: archivedTranscripts.length
		};
	});
}
//#endregion
//#region src/config/sessions/session-accessor.memory-cleanup.ts
/** Incognito bulk cleanup retains the same actor and companion-deletion owners as single deletes. */
function applyMemorySessionEntryCleanup(params, resolved) {
	const assertCurrent = () => params.commitGuard?.();
	const captured = captureSessionActorStorageOwner({
		...resolved,
		storePath: resolved.path
	}, {
		assertCurrent,
		authorize: assertCurrent
	});
	if (!captured) return;
	return (async () => {
		if ([...params.upserts ?? []].length || params.allowCanonicalRepair || params.afterUpsertsInTransaction || params.creation) throw new Error("Memory bulk cleanup does not support SQLite repair or upsert callbacks");
		const empty = {
			beforeCount: 0,
			removedEntries: 0,
			removedSessionKeys: [],
			archived: 0,
			capArchived: 0,
			modelRunPruned: 0,
			pruned: 0,
			capped: 0,
			archivedTranscriptDirectories: [],
			afterCount: 0
		};
		const owner = captured.owner;
		const entries = owner?.listSessionEntries(captured.authority) ?? [];
		if (!owner || !entries.length) return empty;
		const actor = await owner.acquireExisting(entries[0].sessionKey, {
			assertCurrent: () => captured.authority.assertCurrent(),
			assertReadable: () => captured.authority.assertCurrent()
		});
		if (!actor) return empty;
		let preservation;
		try {
			preservation = params.skipMaintenance ? void 0 : await prepareSessionMaintenancePreservation(params.storePath);
			const beforeStore = Object.fromEntries(entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
			const store = structuredClone(beforeStore);
			const removals = [];
			const explicitKeys = /* @__PURE__ */ new Set();
			const removalReasons = /* @__PURE__ */ new Map();
			const archives = [];
			const capArchives = /* @__PURE__ */ new Set();
			for (const removal of params.removals ?? []) {
				const sessionKey = resolveSqliteSessionKey(removal.sessionKey, captured.agentId);
				const entry = store[sessionKey];
				if (shouldRemoveSessionEntry(entry, removal)) {
					explicitKeys.add(sessionKey);
					removals.push({
						sessionKey,
						expected: beforeStore[sessionKey],
						requiresMissingTranscript: removal.requiresMissingTranscript
					});
					delete store[sessionKey];
				}
			}
			const maintenance = normalizeResolvedMaintenanceConfigInput({
				...resolveMaintenanceConfig(),
				...params.maintenanceOverride
			});
			if (preservation && maintenance.mode !== "warn") {
				const snapshot = preservation.capture();
				planSessionEntryMaintenance({
					maintenance,
					initialUnarchivedCount: countUnarchivedSessionEntries(store),
					forceMaintenance: params.maintenanceOverride !== void 0,
					readPreserveKeys: () => resolveSessionMaintenancePreserveKeys({
						store,
						snapshot,
						baseKeys: [params.activeSessionKey]
					}),
					readAgeCandidates: () => store,
					readCapCandidates: () => ({
						store,
						maxEntries: maintenance.maxEntries
					}),
					onArchived: ({ key, entry }, phase) => {
						archives.push({
							sessionKey: key,
							expected: beforeStore[key],
							entry
						});
						if (phase === "cap") capArchives.add(key);
					},
					onRemoved: ({ key }, reason) => {
						removals.push({
							sessionKey: key,
							expected: beforeStore[key]
						});
						removalReasons.set(key, reason);
					}
				});
			}
			const deletedEntries = removals.map(({ sessionKey, expected: entry }) => ({
				sessionKey,
				entry
			}));
			const commit = async (assertSourceCurrent) => withSqliteSessionDeletions(resolved, deletedEntries, async (assertDeletionCurrent, capture) => {
				let settlement;
				const outcome = await actor.storage.mutate({
					type: "session.lifecycle.reclaim",
					input: {
						entries: removals,
						archives
					}
				}, {
					authorize: (...args) => captured.authority.authorize(...args),
					assertCurrent() {
						captured.authority.assertCurrent();
						assertSourceCurrent();
						assertDeletionCurrent();
					}
				}, { beforeCommit(receipt) {
					params.beforeCommitInTransaction?.();
					const removed = new Set(receipt.value.removedSessionKeys);
					settlement = capture(deletedEntries.filter(({ sessionKey }) => removed.has(sessionKey)));
					settlement.beforeCommit();
				} });
				settlement?.settle(outcome.kind);
				if (outcome.kind === "committed") params.onLifecycleCommitted?.();
				return readSessionActorStorageResult(outcome);
			}, { memory: owner });
			const committed = params.withCommit ? await params.withCommit(commit) : await commit(() => {});
			await params.afterCommitted?.({
				env: resolved.env,
				assertCurrent: () => owner.assertCurrent()
			});
			const removedSessionKeys = committed.removedSessionKeys.filter((key) => explicitKeys.has(key));
			const capArchived = committed.archivedSessionKeys.filter((key) => capArchives.has(key)).length;
			return {
				...empty,
				beforeCount: committed.beforeCount,
				afterCount: committed.afterCount,
				removedSessionKeys,
				removedEntries: removedSessionKeys.length,
				archived: committed.archivedSessionKeys.length,
				capArchived,
				modelRunPruned: committed.removedSessionKeys.filter((key) => removalReasons.get(key) === "model-run-pruned").length,
				pruned: committed.removedSessionKeys.filter((key) => removalReasons.get(key) === "pruned").length,
				capped: capArchived + committed.removedSessionKeys.filter((key) => removalReasons.get(key) === "capped").length
			};
		} finally {
			preservation?.dispose();
			await actor.release();
		}
	})();
}
//#endregion
//#region src/config/sessions/session-lifecycle-projection.ts
function runSessionLifecyclePlanningInWorker(params, type, input) {
	return withSessionEntryWorker(params.database, void 0, () => params.execution?.assertCurrent(), async (execution, source) => {
		const result = await execution.runExisting(source, async (worker) => ({ value: await executeOpenClawAgentWorkerPublication(worker, {
			id: randomUUID(),
			moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionLifecyclePlanningDomain).href,
			input: { agentId: params.database.agentId },
			command: {
				type,
				input
			}
		}) }));
		if (!result) throw new Error("Session database disappeared before lifecycle planning");
		return result.value;
	}, void 0, params.execution);
}
/** Keep builders outside SQL while retaining the caller's physical FIFO and exact source. */
async function projectSessionEntryLifecycleMutationInWorker(params) {
	const prepared = await runSessionLifecyclePlanningInWorker(params, "prepare", {
		...params.input,
		upserts: params.upserts.map(({ sessionKey, relatedSessionKeys }) => ({
			sessionKey,
			...relatedSessionKeys !== void 0 ? { relatedSessionKeys } : {}
		}))
	});
	const upsertedEntries = await buildProjectedLifecycleUpserts(prepared.store, prepared.selected, params.upserts);
	params.execution.assertCurrent();
	if (prepared.selected.projectedRemovals.length === 0) return {
		deletePlans: [],
		removals: [],
		upsertedEntries,
		archiveRecovery: prepared.archiveRecovery
	};
	return runSessionLifecyclePlanningInWorker(params, "finish", {
		...prepared,
		upsertedEntries,
		archiveDirectory: params.input.archiveDirectory
	});
}
function commitSessionLifecycleProjectionInWorker(params) {
	return runSessionEntryWorkerOperation({
		database: params.database,
		agentId: params.input.agentId,
		assertCurrent: params.assertCurrent,
		assertPrepared: params.assertPrepared,
		assertCandidate: params.assertCandidate,
		retainedExecution: params.execution,
		candidateKind: "session-lifecycle-projection",
		run: (worker, commit) => commit(() => worker.execute({
			type: "session.lifecycle.project",
			input: params.input
		})),
		onAcknowledged(candidate) {
			params.onLifecycleCommitted?.();
			for (const sessionId of candidate.projectionReconcileSessionIds) startSessionTranscriptIndexReconcile({
				...params.database,
				preferredSessionId: sessionId
			});
		},
		async onCommitted(candidate, published, identity, context) {
			for (const sessionKey of candidate.progressCardResetKeys) emitSessionLifecycleEvent({
				agentId: params.input.agentId,
				sessionKey,
				reason: "progress-card-reset"
			});
			if (published) publishCommittedSessionIdentity(params.input.agentId, identity, published.previous, published.current, published.prepared);
			await params.afterCommitted?.(context);
			return candidate.result;
		}
	});
}
//#endregion
//#region src/config/sessions/session-agent-purge.ts
/** Retire logical entries without widening their selected transcript generations. */
async function purgeDeletedAgentSessionEntries(params) {
	const resolved = captureLifecycleDatabaseScope(resolveSqliteScope({
		agentId: params.storeAgentId,
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	}));
	const database = {
		...toDatabaseOptions(resolved),
		path: resolved.path
	};
	const execution = isMainThread && supportsOpenClawAgentDatabaseExecution(database) ? await captureAgentDeletionDatabaseExecution(database) : void 0;
	const selection = {
		cfg: structuredClone(params.cfg),
		agentId: params.agentId,
		storeAgentId: params.storeAgentId,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved)
	};
	try {
		const prepared = execution ? await withSessionEntryWorker(database, void 0, () => execution.assertCurrent(), async (owner, source) => {
			await owner.prepare(source);
			const result = await owner.runExisting(source, (worker) => worker.execute({
				type: "session.agentPurge.prepare",
				input: selection
			}));
			if (!result) throw new Error("Session database disappeared before agent purge");
			return result;
		}, void 0, execution) : await runExclusiveSqliteSessionWrite(resolved, async () => prepareSessionAgentPurgeInDatabase(openOpenClawAgentDatabase(database), selection), "session.agent-purge.prepare");
		execution?.assertCurrent();
		const materializedPlans = await materializeSessionStateDeletePlans(prepared.deletePlans);
		execution?.assertCurrent();
		const entries = prepared.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
			entry,
			sessionKey
		}] : []);
		const committed = await withSqliteSessionDeletions(resolved, entries, async (assertSourceCurrent) => {
			const native = !execution;
			const preservation = await prepareSessionMaintenancePreservation(params.storePath, { native });
			const assertCurrent = () => {
				execution?.assertCurrent();
				assertSourceCurrent();
			};
			try {
				assertCurrent();
				if (native) return await runExclusiveSqliteSessionWrite(resolved, async () => {
					const committedPurge = runSqliteSessionDeletionTransaction((current) => {
						assertCurrent();
						const result = commitSessionAgentPurgeInDatabase(current, {
							...selection,
							...prepared,
							materializedPlans
						}, (target) => applySessionEntryMaintenance(target, {
							activeSessionKey: "",
							archiveDirectory: selection.archiveDirectory,
							storePath: params.storePath,
							preservation: preservation.capture,
							refreshCandidates: preservation.refreshCandidates
						}));
						const publish = prepareCommittedSessionEntryRemovals(resolved.agentId, readOpenClawAgentDatabaseIdentity(current).identity, prepared.entryRemovals);
						assertCurrent();
						return {
							...result,
							publish
						};
					}, database, { operationLabel: "session.entry.purge-deleted-agent" });
					committedPurge.publish();
					return committedPurge;
				}, "session.agent-purge.commit");
				const sentPreservation = preservation.capture();
				const input = {
					...selection,
					entryRemovals: prepared.entryRemovals,
					materializedPlans,
					maintenance: {
						activeSessionKey: "",
						archiveDirectory: selection.archiveDirectory,
						maintenance: normalizeResolvedMaintenanceConfigInput(resolveMaintenanceConfig()),
						preservation: sentPreservation,
						storePath: params.storePath
					}
				};
				const operation = {
					database,
					agentId: resolved.agentId,
					retainedExecution: execution,
					assertCurrent,
					assertPrepared: () => {
						preservation.capture();
					},
					assertCandidate: (candidate) => assertMaintenancePreservationCompatible(sentPreservation, preservation.capture(), candidate.result.maintenancePlans),
					candidateKind: "session-agent-purge",
					onCommitted(candidate, published, identity) {
						if (published) publishCommittedSessionIdentity(resolved.agentId, identity, published.previous, published.current, published.prepared);
						return candidate.result;
					}
				};
				const captured = captureNativeSessionWorkerDeletion(entries);
				return captured ? await runSessionNativeBindingWorkerOperation({
					...operation,
					captured,
					entries,
					execute: (worker, nativeBindings) => worker.execute({
						type: "session.agentPurge.commit",
						input: {
							...input,
							nativeBindings
						}
					})
				}) : await runSessionEntryWorkerOperation({
					...operation,
					run: (worker, commit) => commit(() => worker.execute({
						type: "session.agentPurge.commit",
						input
					}))
				});
			} finally {
				preservation.dispose();
			}
		});
		execution?.assertCurrent();
		const publishArchives = (requested) => execution ? publishSessionStateArchivesInWorker({
			scope: resolved,
			requested,
			retainedExecution: execution,
			assertCurrent: () => execution.assertCurrent()
		}) : publishSessionStateArchives(resolved, requested);
		const { archivedTranscripts: maintenanceArchivedTranscripts } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, {
			deletedEntriesBeforeMaintenance: prepared.entryRemovals.length,
			retainedExecution: execution,
			publishArchives
		});
		execution?.assertCurrent();
		const archivedTranscripts = [...await publishArchives(committed.archivedTranscripts), ...maintenanceArchivedTranscripts];
		emitArchivedTranscriptUpdates(archivedTranscripts);
	} finally {
		await execution?.release();
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection.ts
/** Applies exact lifecycle removals/upserts through the selected session owner. */
async function applySessionEntryLifecycleMutation(params, resolved = captureLifecycleDatabaseScope(resolveSqliteScope({
	...params.agentId ? { agentId: params.agentId } : {},
	env: params.env,
	sessionKey: "",
	storePath: params.storePath
}))) {
	const removals = [...params.removals ?? []];
	const upserts = [...params.upserts ?? []];
	const memory = applyMemorySessionEntryCleanup({
		...params,
		removals,
		upserts
	}, resolved);
	if (memory) return memory;
	const databaseOptions = toDatabaseOptions(resolved);
	if (params.afterUpsertsInTransaction && !params.allowCanonicalRepair) throw new Error("Native lifecycle transfer requires explicit canonical repair");
	const useWorker = isMainThread && !params.allowCanonicalRepair && supportsOpenClawAgentDatabaseExecution(databaseOptions);
	const reclamationOptions = useWorker ? resolveSessionReclamationDatabaseOptions(databaseOptions) : void 0;
	const execution = reclamationOptions ? captureOpenClawAgentDatabaseExecution(reclamationOptions) : void 0;
	try {
		let artifactCleanupError;
		const captureArtifactCleanupError = (error) => {
			if (params.captureArtifactCleanupError === true) {
				artifactCleanupError ??= error;
				return;
			}
			throw error;
		};
		let projected;
		let didCommit = false;
		const onLifecycleCommitted = () => {
			didCommit = true;
			params.onLifecycleCommitted?.();
		};
		let materializedRemovalPlans = [];
		let removalArchiveMaterializationFailed = false;
		const prepareWrite = () => runPreparedSqliteSessionWrite(resolved, async () => {
			const projectionInput = {
				...params.allowCanonicalRepair ? { allowCanonicalRepair: true } : {},
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				removals
			};
			if (reclamationOptions) await prepareSessionEntryReplacementDatabase(reclamationOptions, () => execution?.assertCurrent(), execution);
			if (reclamationOptions && execution) projected = await projectSessionEntryLifecycleMutationInWorker({
				database: reclamationOptions,
				execution,
				input: projectionInput,
				upserts
			});
			else projected = await projectSessionEntryLifecycleMutation(databaseOptions, {
				...projectionInput,
				upserts
			});
			const deletedOwners = projected.removals.flatMap(({ sessionKey, expectedEntry: entry }) => {
				return entry && !projected.upsertedEntries.some((upsert) => upsert.sessionKey === sessionKey) ? [{
					entry,
					sessionKey
				}] : [];
			});
			const resetSources = projected.upsertedEntries.flatMap(({ resetBoundary, expectedEntry }) => resetBoundary && expectedEntry?.sessionId ? [expectedEntry.sessionId] : []);
			return {
				deletedEntries: deletedOwners,
				...projected.deletePlans.length > 0 || resetSources.length > 0 ? { beforeCommit: async () => {
					if (resetSources.length > 0) {
						const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
						for (const sessionId of new Set(resetSources)) await restoreSessionColdTranscript({
							agentId: resolved.agentId,
							env: resolved.env,
							storePath: params.storePath,
							sessionId
						});
					}
					try {
						materializedRemovalPlans = await materializeSessionStateDeletePlans(projected.deletePlans);
					} catch (error) {
						removalArchiveMaterializationFailed = true;
						captureArtifactCleanupError(error);
					}
				} } : {},
				commit: async (assertSourceCurrent) => {
					const preparedPreservation = params.skipMaintenance ? void 0 : await prepareSessionMaintenancePreservation(params.storePath, { native: !reclamationOptions });
					try {
						if (reclamationOptions) {
							const maintenance = preparedPreservation ? {
								activeSessionKey: params.activeSessionKey ?? "",
								archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
								forceMaintenance: params.maintenanceOverride !== void 0,
								maintenance: normalizeResolvedMaintenanceConfigInput({
									...resolveMaintenanceConfig(),
									...params.maintenanceOverride
								}),
								preservation: preparedPreservation.capture(),
								storePath: params.storePath
							} : null;
							const assertCurrent = () => {
								execution?.assertCurrent();
								params.commitGuard?.();
								assertSourceCurrent?.();
							};
							const assertPreservationCurrent = (plans) => {
								if (maintenance?.preservation && preparedPreservation) assertMaintenancePreservationCompatible(maintenance.preservation, preparedPreservation.capture(), plans);
							};
							if ((upserts.length > 0 || removals.length === 0) && execution && !hasPreparedNativeSessionDeletion()) return withArchivePublication(await commitSessionLifecycleProjectionInWorker({
								database: reclamationOptions,
								execution,
								assertCurrent,
								assertPrepared: () => {
									preparedPreservation?.capture();
								},
								assertCandidate: (candidate) => {
									assertPreservationCurrent(candidate.result.maintenancePlans);
									params.beforeCommitInTransaction?.();
								},
								onLifecycleCommitted,
								afterCommitted: params.afterCommitted,
								input: {
									agentId: resolved.agentId,
									projected,
									removalPlans: materializedRemovalPlans,
									materializationFailed: removalArchiveMaterializationFailed,
									allowCanonicalRepair: params.allowCanonicalRepair,
									creation: params.creation,
									maintenance
								}
							}));
							const result = await runSqliteSessionReclamation({
								assertCommitAllowed: () => {
									assertCurrent();
									assertPreservationCurrent();
									params.beforeCommitInTransaction?.();
								},
								onWorkerResult: (completed) => {
									if (completed.kind === "lifecycle-projection-commit") onLifecycleCommitted();
								},
								plan: {
									kind: "lifecycle-projection-commit",
									agentId: resolved.agentId,
									databaseOptions: reclamationOptions,
									materializedPlans: materializedRemovalPlans,
									input: {
										projected,
										materializationFailed: removalArchiveMaterializationFailed,
										allowCanonicalRepair: params.allowCanonicalRepair,
										creation: params.creation,
										maintenance
									}
								}
							});
							if (result.kind !== "lifecycle-projection-commit") throw new Error("SQLite lifecycle projection returned an unexpected commit result");
							if (params.afterCommitted && execution) await params.afterCommitted({
								env: Object.freeze({ ...resolved.env }),
								assertCurrent: () => execution.assertCurrent()
							});
							return withArchivePublication(result.value);
						}
						return await withSqliteSessionDatabase(toDatabaseOptions(resolved), (database) => withNativeSessionCommitContext(database, resolved.env, (source) => commitProjectedLifecycleMutation(materializedRemovalPlans, removalArchiveMaterializationFailed, preparedPreservation, () => {
							assertSourceCurrent?.();
							source?.assertCurrent();
						}), params.afterCommitted));
					} finally {
						preparedPreservation?.dispose();
					}
				}
			};
		}, "session.lifecycle.mutate", params.withCommit, void 0, useWorker && upserts.length === 0 ? "worker" : "foreground");
		const preparedWrite = await prepareWrite().catch((error) => {
			if (!(error instanceof WorkerPlacementInventoryChangedError) || didCommit || removals.length || projected.upsertedEntries.some(({ entry, expectedEntry }) => error.sessionIds.has(entry.sessionId) || expectedEntry && error.sessionIds.has(expectedEntry.sessionId))) throw error;
			return prepareWrite();
		});
		const committed = preparedWrite.result;
		function commitProjectedLifecycleMutation(removalPlans, materializationFailed, preservation, assertSourceCurrent) {
			const commitResult = runSqliteSessionDeletionTransaction((transactionDb) => {
				execution?.assertCurrent();
				params.commitGuard?.();
				params.beforeCommitInTransaction?.();
				assertSourceCurrent?.();
				deferOpenClawAgentPostCommitPublication(transactionDb, onLifecycleCommitted);
				const result = commitProjectedSessionEntryLifecycleMutationInDatabase(transactionDb, {
					projected,
					removalPlans,
					materializationFailed,
					allowCanonicalRepair: params.allowCanonicalRepair,
					resetScope: resolved,
					afterUpsertsInTransaction: params.afterUpsertsInTransaction,
					creation: params.creation,
					applyMaintenance: (database) => applySessionEntryMaintenance(database, {
						activeSessionKey: params.activeSessionKey ?? "",
						archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
						forceMaintenance: params.maintenanceOverride !== void 0,
						maintenanceConfig: params.maintenanceOverride ? {
							...resolveMaintenanceConfig(),
							...params.maintenanceOverride
						} : void 0,
						preservation: preservation?.capture,
						refreshCandidates: preservation?.refreshCandidates,
						storePath: params.storePath
					})
				});
				return {
					...result,
					publish: prepareLifecycleIdentityPublication({
						database: transactionDb,
						agentId: resolved.agentId,
						projected,
						removedSessionKeys: result.removedSessionKeys
					})
				};
			}, toDatabaseOptions(resolved), { operationLabel: "session.lifecycle.project" });
			commitResult.publish();
			return withArchivePublication(commitResult);
		}
		function withArchivePublication(commitResult) {
			return {
				...commitResult,
				publishArchives: commitResult.archivedTranscripts.length > 0 || params.allowCanonicalRepair === true || params.afterUpsertsInTransaction !== void 0 || removals.length > 0 || (commitResult.pendingArchives || params.withCommit !== void 0 || projected.upsertedEntries.some(({ resetBoundary }) => resetBoundary !== void 0)) && (params.skipMaintenance !== true || projected.upsertedEntries.length === 0 || projected.upsertedEntries.some(({ expectedEntry }) => expectedEntry !== void 0))
			};
		}
		const { archivedTranscripts: maintenanceArchivedTranscripts, ...maintenance } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: preparedWrite.deletedEntries });
		let publishedRemovalTranscripts = [];
		try {
			if (committed.publishArchives) publishedRemovalTranscripts = await publishSessionStateArchives(resolved, committed.archivedTranscripts);
		} catch (error) {
			captureArtifactCleanupError(error);
		}
		const archivedTranscripts = [...publishedRemovalTranscripts, ...maintenanceArchivedTranscripts];
		const afterCount = committed.afterCount - maintenance.modelRunPruned - maintenance.pruned - (maintenance.capped - maintenance.capArchived);
		emitArchivedTranscriptUpdates(archivedTranscripts);
		const archivedTranscriptDirectories = uniqueStrings(archivedTranscripts.map((transcript) => path.dirname(transcript.archivedPath))).toSorted();
		if (archivedTranscriptDirectories.length > 0 && params.cleanupArchivedTranscripts) try {
			const { cleanupArchivedSessionTranscripts } = await import("./session-archive.runtime.js");
			await cleanupArchivedSessionTranscripts({
				directories: archivedTranscriptDirectories,
				rules: params.cleanupArchivedTranscripts.rules,
				nowMs: params.cleanupArchivedTranscripts.nowMs
			});
			await prunePublishedSessionArchivesByRetention({
				scope: resolved,
				rules: params.cleanupArchivedTranscripts.rules,
				nowMs: params.cleanupArchivedTranscripts.nowMs
			});
		} catch (error) {
			captureArtifactCleanupError(error);
		}
		return {
			beforeCount: committed.beforeCount,
			removedEntries: committed.removedSessionKeys.length,
			removedSessionKeys: committed.removedSessionKeys,
			...maintenance,
			archivedTranscriptDirectories,
			afterCount,
			artifactCleanupError
		};
	} finally {
		await execution?.release();
	}
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle.ts
/** Projects one session patch against its detached store snapshot and commits once. */
async function applySessionPatchProjection(params) {
	return await applySessionEntryCanonicalReplacements({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		skipMaintenance: true,
		update: async (entries) => {
			const workingStore = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
			const snapshot = { store: workingStore };
			const labelOwners = new SessionLabelOwnerIndex(workingStore);
			const target = params.resolveTarget(snapshot);
			const existingEntry = resolveProjectionExistingEntry(snapshot, target);
			const candidateKeys = uniqueStrings((target.candidateKeys ?? [target.primaryKey]).map((key) => key.trim()).filter(Boolean));
			const projected = await params.project({
				...target,
				...snapshot,
				...existingEntry ? { existingEntry } : {},
				isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys)
			});
			if (!projected.ok) return { result: projected };
			params.assertCurrent?.();
			const previousSessionKeys = candidateKeys.filter((sessionKey) => sessionKey !== target.primaryKey && workingStore[sessionKey]);
			const cloned = labelOwners.replaceEntry(candidateKeys, target.primaryKey, projected.entry);
			return {
				replacements: [{
					entry: projected.entry,
					previousSessionKeys,
					sessionKey: target.primaryKey
				}],
				result: {
					ok: true,
					entry: structuredClone(cloned)
				}
			};
		}
	});
}
/**
* Clears plugin host-owned state inside one resolved session store.
* This is an internal transaction-sized boundary for the storage backend, not
* a Plugin SDK API.
*/
async function cleanupPluginHostSessionStore(params) {
	if (shouldSkipPluginHostCleanupStore(params) || params.shouldCleanup && !params.shouldCleanup()) return 0;
	const now = Date.now();
	const cleanupRevoked = /* @__PURE__ */ new Error("Plugin session cleanup is no longer current");
	let cleared = 0;
	for (const { entry, sessionKey } of await readSessionEntrySummariesInWorker({
		agentId: params.agentId,
		storePath: params.storePath,
		cleanupSession: params.sessionKey
	})) {
		if (isLockedHarnessSessionOwnedByPlugin(entry, params.preserveLockedHarnessIds)) continue;
		if (!hasPluginHostCleanupTarget(entry, params)) continue;
		if (params.shouldCleanup && !params.shouldCleanup()) break;
		await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey,
			storePath: params.storePath
		}, (currentEntry) => {
			if (isLockedHarnessSessionOwnedByPlugin(currentEntry, params.preserveLockedHarnessIds)) return null;
			if (!matchesPluginHostCleanupSession(sessionKey, currentEntry, params.sessionKey) || !hasPluginHostCleanupTarget(currentEntry, params)) return null;
			clearPluginHostCleanupTarget(currentEntry, params);
			currentEntry.updatedAt = now;
			return currentEntry;
		}, {
			workerGuard: { assertCurrent: () => {
				if (params.shouldCleanup?.() === false) throw cleanupRevoked;
			} },
			onCommitted: () => {
				cleared += 1;
			},
			replaceEntry: true,
			skipMaintenance: true
		}).catch((error) => {
			if (error !== cleanupRevoked) throw error;
		});
	}
	return cleared;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-creation.ts
/** One creation owner retains source custody across preparation, commit, and publication. */
async function createSessionEntryWithTranscriptInScope(scope, createEntry, options) {
	const memory = await createSessionActorEntryWithTranscriptInScope({
		...scope,
		storePath: scope.path
	}, createEntry, options);
	if (memory) return memory;
	const databaseOptions = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const retained = isMainThread && supportsOpenClawAgentDatabaseExecution(databaseOptions) ? retainSessionHistoryWorkerDatabase(databaseOptions) : void 0;
	try {
		let source;
		if (retained) {
			const reader = retained.owner;
			const read = () => reader.readExactEntries({
				projection: "creation",
				creationLabel: options.label,
				sessionKeys: [scope.sessionKey],
				env: { ...scope.env }
			});
			let snapshot = (await read()).creation;
			if (!snapshot) {
				await prepareSessionEntryReplacementDatabase(databaseOptions, () => {
					reader.assertCurrent();
					options.commitGuard?.();
				}, void 0, options.followRegistration);
				snapshot = (await read()).creation;
			}
			if (!snapshot) throw new Error("Session creation lost its initialized database");
			const { databaseIdentity, databasePath } = snapshot;
			const assertCurrent = () => {
				reader.assertCurrent();
				assertExistingDatabaseIdentity(scope.path, `file:${databaseIdentity}`);
			};
			source = {
				kind: "worker",
				databaseIdentity,
				databasePath,
				snapshot,
				assertCurrent
			};
		} else {
			const database = openOpenClawAgentDatabase(databaseOptions);
			source = {
				kind: "native",
				snapshot: readSessionCreationSnapshotInDatabase(database, scope.sessionKey, options.label),
				database
			};
		}
		const { normalizedKey, legacyKeys, existingEntry, targetEntry, labelInUse } = source.snapshot;
		return await withSessionEntryCreationPublication({
			agentId: scope.agentId,
			sessionKey: normalizedKey,
			bind: options.bindCreation,
			...source.kind === "native" ? { database: source.database } : { file: {
				path: source.databasePath,
				agentId: databaseOptions.agentId,
				databaseIdentity: source.databaseIdentity,
				assertCurrent: source.assertCurrent
			} }
		}, async (operation) => {
			const withSourceCommit = options.withCommit;
			const withCommit = withSourceCommit ? (run) => withSourceCommit((assertCurrent) => runWithSessionEntryCreationPublication(operation, () => run(assertCurrent))) : void 0;
			const assertCurrent = () => {
				if (source.kind === "worker") source.assertCurrent();
				options.commitGuard?.();
			};
			options.onPhase?.("entry");
			const created = await createEntry({
				existingEntry,
				targetEntry,
				labelInUse
			});
			if (!created.ok) return {
				ok: false,
				error: created.error,
				phase: "entry"
			};
			const owner = options.resolveOwnerAssignment?.();
			const preparedTranscript = created.transcriptEvents ? {
				sessionKey: normalizedKey,
				sessionId: created.entry.sessionId,
				events: created.transcriptEvents
			} : void 0;
			const initialization = {
				sessionKey: normalizedKey,
				sessionId: created.entry.sessionId,
				cwd: options.cwd
			};
			const separateHeader = source.kind === "native" || legacyKeys.length > 0;
			if (separateHeader) {
				options.onPhase?.("transcript");
				const initialize = async (assertSourceCurrent) => {
					const assertHeld = () => {
						assertCurrent();
						assertSourceCurrent?.();
					};
					try {
						if (source.kind === "worker") await initializeSessionTranscriptInWorker(databaseOptions, source.databaseIdentity, initialization, assertHeld);
						else {
							const transcriptScope = resolveSqliteTranscriptScope({
								agentId: scope.agentId,
								env: scope.env,
								storePath: scope.path,
								sessionKey: normalizedKey,
								sessionId: created.entry.sessionId
							});
							await runExclusiveSqliteSessionWrite(transcriptScope, async () => {
								runOpenClawAgentWriteTransaction((database) => {
									assertHeld();
									ensureTranscriptHeader(database, transcriptScope, options.cwd);
								}, toDatabaseOptions(transcriptScope), { operationLabel: "session.entry.create-transcript" });
							}, "session.entry.create-with-transcript");
						}
					} catch (error) {
						if (source.kind === "worker" && hasSqliteWorkerOutcomeUnknown(error)) throw error;
						assertHeld();
						return formatErrorMessage(error);
					}
				};
				const transcriptError = preparedTranscript ? void 0 : withCommit ? await withCommit(initialize) : await initialize();
				if (transcriptError !== void 0) return {
					ok: false,
					error: transcriptError,
					phase: "transcript"
				};
			}
			let pendingArchiveRecovery = false;
			if (!separateHeader) options.onPhase?.("writerAdmission");
			else if (source.kind === "native") options.onPhase?.("commit");
			const afterSourceCommit = options.afterCommitted;
			const afterCommitted = afterSourceCommit ? (context) => afterSourceCommit(created.entry, context) : void 0;
			if (source.kind === "native") {
				await applySessionEntryLifecycleMutation({
					agentId: scope.agentId,
					env: scope.env,
					storePath: scope.path,
					removals: legacyKeys.map((sessionKey) => ({ sessionKey })),
					upserts: [{
						sessionKey: normalizedKey,
						entry: created.entry
					}],
					skipMaintenance: true,
					withCommit,
					beforeCommitInTransaction: () => {
						assertCurrent();
						assertSessionCreationLabelAvailable(source.database, normalizedKey, options.label);
					},
					creation: {
						preparedTranscript,
						ownerAssignment: owner ? {
							sessionKey: normalizedKey,
							owner
						} : void 0
					},
					onLifecycleCommitted: () => options.onLifecycleCommitted?.(created.entry),
					afterCommitted
				});
				return {
					ok: true,
					entry: created.entry,
					sessionFile: normalizedKey
				};
			}
			try {
				assertCurrent();
				await applySessionEntryCreationReplacement({
					scope,
					agentId: scope.agentId,
					storePath: scope.path,
					env: scope.env,
					sessionKey: normalizedKey,
					creationSnapshot: {
						...source.snapshot,
						databaseIdentity: source.databaseIdentity
					},
					previousSessionKeys: legacyKeys,
					entry: created.entry,
					assertCommitAllowed: assertCurrent,
					withCommit,
					ownerAssignment: owner ? {
						sessionKey: normalizedKey,
						owner
					} : void 0,
					labelClaim: options.label === void 0 ? void 0 : {
						sessionKey: normalizedKey,
						label: options.label
					},
					preparedTranscript,
					initializeTranscript: separateHeader || preparedTranscript ? void 0 : initialization,
					onWriterAdmitted: separateHeader ? void 0 : () => options.onPhase?.("commit"),
					onLifecycleCommitted: (pending) => {
						pendingArchiveRecovery = pending;
						options.onLifecycleCommitted?.(created.entry);
					},
					checkPendingArchiveRecovery: true,
					afterCommitted
				});
			} catch (error) {
				if (!separateHeader && !hasSqliteWorkerOutcomeUnknown(error) && error instanceof Error && error.name === "SessionTranscriptInitializationError") {
					assertCurrent();
					return {
						ok: false,
						error: error.message,
						phase: "transcript"
					};
				}
				throw error;
			}
			if (pendingArchiveRecovery) await publishSessionStateArchivesInWorker({
				scope,
				requested: [],
				databaseIdentity: source.databaseIdentity,
				assertCurrent
			});
			return {
				ok: true,
				entry: created.entry,
				sessionFile: normalizedKey
			};
		});
	} finally {
		retained?.release();
	}
}
//#endregion
//#region src/config/sessions/session-parent-fork-memory.ts
/** Read the selected source owner without creating a parent or a staging transcript. */
async function readMemoryParentForkSource(input, binding) {
	const sessionKey = normalizeStoreSessionKey(input.parentSessionKey);
	const agentId = input.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	const authority = {
		authorize: (stage, facts, publication) => binding.authority.authorize(stage, facts, publication),
		assertCurrent() {
			binding.actor.assertReadable();
			binding.authority.assertCurrent();
			input.commitGuard?.();
		}
	};
	const selected = agentId === binding.agentId ? getSessionActorStorageBinding({
		agentId,
		storePath: input.storePath,
		sessionActor: binding
	}) : void 0;
	const captured = selected ? void 0 : captureSessionActorStorageOwner({
		agentId,
		sessionKey,
		storePath: input.storePath,
		sessionActor: binding
	});
	const actor = selected?.actor ?? await captured?.owner?.acquireExisting(sessionKey, {
		assertCurrent: () => authority.assertCurrent(),
		assertReadable: () => authority.assertCurrent()
	});
	if (!actor) {
		authority.assertCurrent();
		return;
	}
	try {
		return {
			source: await actor.storage.read({
				type: "session.parentFork.source",
				input: {
					sessionKey,
					sessionId: input.parentEntry.sessionId,
					forkFrom: input.forkFrom
				}
			}, authority),
			scope: {
				agentId,
				path: selected?.path ?? captured.path
			}
		};
	} finally {
		if (!selected) await actor.release();
	}
}
function forkMemorySessionEntryFromParent(params, patch) {
	const assertCurrent = () => params.commitGuard?.();
	const authority = {
		assertCurrent,
		authorize() {}
	};
	const scope = {
		...params,
		sessionKey: params.parentTarget.canonicalKey
	};
	if (!captureSessionActorStorageOwner(scope, authority)) return;
	return withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		}
	}, async (memory) => {
		const { cliBackendSupportsSessionFork } = await import("./cli-backends-BRrVVSk9.mjs");
		const { commitGuard: _guard, ...data } = params;
		return readSessionActorStorageResult(await memory.actor.storage.mutate({
			type: "session.parentFork.commit",
			input: {
				kind: "entry",
				params: structuredClone(data),
				patch: patch && structuredClone(patch)
			}
		}, {
			authorize: (...args) => memory.authority.authorize(...args),
			assertCurrent: () => memory.authority.assertCurrent(),
			parentFork: { supportsCliFork: cliBackendSupportsSessionFork }
		}));
	}).then((result) => result ?? { status: "missing-parent" });
}
//#endregion
//#region src/config/sessions/session-parent-fork.ts
function withForkWorkers(scopes, guard, run) {
	guard?.();
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	const captureRequest = (scope) => ({
		...scope,
		agentId: scope.agentId ?? parseAgentSessionKey(scope.sessionKey)?.agentId,
		storePath: path.resolve(scope.storePath),
		env
	});
	const sourceRequest = captureRequest(scopes.source);
	const targetRequest = scopes.target ? captureRequest(scopes.target) : void 0;
	const candidates = (targetRequest ? [sourceRequest, targetRequest] : [sourceRequest]).flatMap((request) => captureSessionStoreReadCandidates(request.storePath));
	const identities = captureSessionStoreCandidateIdentities(candidates);
	const discoveries = [];
	const owners = [];
	const assertCurrent = () => {
		guard?.();
		for (const discovery of discoveries) discovery.assertCurrent();
		for (const owner of owners) owner.execution.assertCurrent();
	};
	const onRegistryChange = (change) => {
		for (const discovery of discoveries) discovery.onRegistryChange(change);
	};
	const revalidateTarget = async () => {
		for (const discovery of discoveries) await discovery.revalidateTarget();
		assertCurrent();
	};
	const withOwner = (request, operation) => {
		return withSessionStoreTarget({
			...request,
			candidates
		}, async (target, discovery) => {
			discoveries.push(discovery);
			const observed = readDatabasePathIdentitySync(target.database.path);
			const captured = identities.get(target.database.path);
			if (captured ? observed.key !== captured.key || observed.birthtime !== captured.birthtime : observed.key.startsWith("file:")) throw new Error("Parent fork database changed during target discovery");
			const existing = owners.find((owner) => owner.scope.agentId === target.logicalAgentId && owner.database.agentId === target.database.agentId && owner.database.path === target.database.path);
			if (existing) return operation(existing);
			const owner = captureForkWorker({
				agentId: target.logicalAgentId,
				databaseAgentId: target.database.agentId,
				sessionKey: resolveSqliteSessionKey(request.sessionKey, target.logicalAgentId),
				ownerStorePath: request.storePath,
				path: target.database.path,
				env
			}, {
				...discovery,
				assertCurrent,
				onRegistryChange,
				revalidateTarget
			}, captured ?? observed);
			owners.push(owner);
			return settleForkOwner(owner, () => operation(owner));
		}, guard);
	};
	let completed;
	const complete = async (source, target) => {
		const value = await run(source, target);
		completed = { value };
		return value;
	};
	return withOwner(sourceRequest, (source) => targetRequest ? withOwner(targetRequest, (target) => complete(source, target)) : complete(source)).catch((error) => {
		if (!completed) throw error;
		try {
			getChildLogger({ subsystem: "session-sqlite" }).warn("Session fork completed before owner cleanup failed", { errors: [formatErrorMessage(error)] });
		} catch {}
		return completed.value;
	});
}
function captureForkWorker(scope, discovery, identity) {
	const database = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const execution = captureOpenClawAgentDatabaseExecution(database, identity.key.startsWith("file:") ? { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.key.slice(5),
		nativeLocation: identity.canonicalPath,
		birthtime: identity.birthtime
	} } : { expectedCreationIdentity: identity });
	const assertCurrent = () => {
		execution.assertCurrent();
		discovery.assertCurrent();
	};
	const read = (consume) => {
		return withSessionEntryWorker(database, void 0, assertCurrent, async (reader, source, context) => {
			source.onRegistryChange = discovery.onRegistryChange;
			await discovery.refreshBeforeDispatch(() => reader.assertCurrent());
			const result = await consume(reader, source, context);
			await discovery.revalidateTarget();
			return result;
		}, void 0, execution);
	};
	return {
		scope,
		database,
		execution,
		assertCurrent,
		prepareEntry: (input) => read(async (reader, source) => {
			await reader.prepare(source);
			return reader.runExisting(source, (worker) => executeSessionForkOperation(worker, database.agentId, {
				type: "session.parentFork.prepare",
				input
			}));
		}),
		readSource: (input) => read(async (reader, source) => {
			await reader.prepare(source);
			return reader.runExisting(source, (worker) => executeSessionForkOperation(worker, database.agentId, {
				type: "session.parentFork.source",
				input
			}));
		}),
		restore: (sessionId) => restoreSessionColdTranscript({
			...scope,
			storePath: database.path,
			sessionId
		}, assertCurrent),
		commit(input) {
			return runSessionEntryWorkerOperation({
				database,
				agentId: scope.agentId,
				assertCurrent,
				retainedExecution: execution,
				candidateKind: "session-parent-fork",
				prepareWorker(_execution, source) {
					source.onRegistryChange = discovery.onRegistryChange;
					return {
						prepare: discovery.revalidateTarget,
						beforeWrite: assertCurrent,
						release: async () => {}
					};
				},
				run: (worker, commit) => commit(() => executeSessionForkOperation(worker, database.agentId, {
					type: "session.parentFork.commit",
					input
				})),
				onCommitted(candidate, published, committedIdentity) {
					if (published) publishCommittedSessionIdentity(scope.agentId, committedIdentity, published.previous, published.current, published.prepared);
					return candidate.result;
				}
			});
		}
	};
}
async function forkParentEntryInWorker(params, patch) {
	const { commitGuard: _guard, ...serializable } = params;
	const planned = structuredClone(serializable);
	const plannedPatch = patch ? structuredClone(patch) : void 0;
	return withForkWorkers({ source: {
		agentId: params.agentId,
		sessionKey: "",
		storePath: params.storePath
	} }, params.commitGuard, async (owner) => {
		const prepared = await owner.prepareEntry(planned);
		owner.assertCurrent();
		if (!prepared?.parentEntry?.sessionId) return { status: "missing-parent" };
		if (!prepared.base) return { status: "missing-entry" };
		const skipExisting = plannedPatch?.skipExisting && prepared.base.sessionId?.trim();
		let cliForkProviders;
		if (!skipExisting) {
			await owner.restore(prepared.parentEntry.sessionId);
			const { cliBackendSupportsSessionFork } = await import("./cli-backends-BRrVVSk9.mjs");
			owner.assertCurrent();
			cliForkProviders = Object.keys(forkCliSessionBindings(prepared.parentEntry, cliBackendSupportsSessionFork) ?? {});
		}
		const result = await owner.commit({
			kind: "entry",
			agentId: owner.scope.agentId,
			params: planned,
			patch: plannedPatch,
			cliForkProviders
		});
		if (result.status === "created" || result.status === "too-large") throw new Error("Parent entry fork returned a transcript-only result");
		return result;
	});
}
async function forkParentTranscriptInWorker(params) {
	const { commitGuard: _guard, ...serializable } = params;
	const planned = structuredClone(serializable);
	return withForkWorkers({
		source: {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		},
		target: params.targetStorePath ? {
			sessionKey: params.sessionKey,
			storePath: params.targetStorePath
		} : void 0
	}, params.commitGuard, async (source, target) => {
		const crossDatabase = target && (target.scope.agentId !== source.scope.agentId || target.database.path !== source.database.path);
		const destination = crossDatabase ? target : source;
		if (!planned.parentEntry.sessionId) return { status: "missing-parent" };
		await source.restore(planned.parentEntry.sessionId);
		source.assertCurrent();
		const snapshot = crossDatabase ? await source.readSource({
			sessionId: planned.parentEntry.sessionId,
			forkFrom: planned.forkFrom
		}) : void 0;
		source.assertCurrent();
		const result = await destination.commit({
			kind: "transcript",
			agentId: destination.scope.agentId,
			params: planned,
			source: crossDatabase ? snapshot ?? null : void 0,
			parentSessionFile: formatLegacySqliteSessionMarkerForScope({
				...source.scope,
				sessionId: planned.parentEntry.sessionId,
				sessionKey: planned.parentSessionKey
			})
		});
		if (result.status === "forked" || result.status === "skipped" || result.status === "missing-entry") throw new Error("Parent transcript fork returned an entry-only result");
		return result;
	});
}
async function settleForkOwner(owner, run) {
	const outcome = await run().then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	try {
		await owner.execution.release();
	} catch (error) {
		if (outcome.ok) throw error;
		throw retainSqliteWorkerErrorCode(createSqliteLifecycleAggregateError([outcome.error, error], "Session fork and executor cleanup failed", outcome.error), outcome.error);
	}
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-session.ts
/** Prepare one source snapshot; the creation owner commits its copy with the child entry. */
async function prepareSessionForkTranscript(input) {
	const memory = getSessionActorStorageBinding({ sessionActor: input.sessionActor });
	const assertCurrent = () => input.commitGuard?.();
	const authority = {
		assertCurrent,
		authorize() {}
	};
	const scope = {
		...input,
		sessionKey: input.parentSessionKey
	};
	if (!memory && captureSessionActorStorageOwner(scope, authority)) return await withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		}
	}, (selected) => prepareSessionForkTranscript({
		...input,
		sessionActor: selected
	})) ?? { status: "missing-parent" };
	if (!input.parentEntry.sessionId) return { status: "missing-parent" };
	const { commitGuard, sessionActor: _sessionActor, ...data } = input;
	const params = {
		...structuredClone(data),
		commitGuard
	};
	params.commitGuard?.();
	const memorySource = memory ? await readMemoryParentForkSource(params, memory) : void 0;
	if (memory && !memorySource) return { status: "missing-parent" };
	const resolved = memorySource?.scope ?? await prepareSqliteScope({
		agentId: params.agentId,
		sessionKey: params.parentSessionKey,
		storePath: params.storePath
	});
	const sourceScope = {
		...resolved,
		sessionKey: normalizeStoreSessionKey(params.parentSessionKey),
		sessionId: params.parentEntry.sessionId,
		storePath: resolved.path ?? params.storePath
	};
	let source;
	if (memorySource) source = memorySource.source;
	else {
		if (params.targetStorePath) await prepareSqliteScope({
			sessionKey: params.sessionKey,
			storePath: params.targetStorePath
		});
		const hydration = prepareSessionTranscriptHydration(sourceScope);
		const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-DyO6lnEj.mjs");
		const snapshot = await readRestoredSessionTranscript(sourceScope, hydration.read, { assertCurrent: params.commitGuard });
		hydration.assertCurrent();
		if (snapshot.kind !== "full") throw new Error("Parent fork requires its complete transcript snapshot");
		source = resolveParentForkSourceTranscript(snapshot.snapshot.events, params.forkFrom);
	}
	params.commitGuard?.();
	if (!source) return { status: "failed" };
	const decision = resolveParentForkLimitDecision(params, source);
	if (decision) return {
		status: "too-large",
		decision
	};
	const sessionId = params.targetSessionId ?? randomUUID();
	return {
		status: "prepared",
		transcript: {
			sessionId,
			sessionFile: params.sessionKey
		},
		events: buildForkedChildTranscriptEvents({
			parentSessionFile: formatLegacySqliteSessionMarkerForScope({
				...resolved,
				...sourceScope
			}),
			source,
			targetSessionId: sessionId
		})
	};
}
async function forkSessionTranscriptFromParent(params) {
	const assertCurrent = () => params.commitGuard?.();
	const authority = {
		assertCurrent,
		authorize() {}
	};
	const scope = {
		...params,
		sessionKey: params.parentSessionKey
	};
	if (captureSessionActorStorageOwner(scope, authority)) {
		const prepared = await prepareSessionForkTranscript(params);
		if (prepared.status !== "prepared") return prepared;
		const target = {
			sessionKey: params.sessionKey,
			storePath: params.targetStorePath ?? params.storePath
		};
		return await withSessionActorStorage(target, {
			authority,
			lifetime: {
				assertCurrent,
				assertReadable: assertCurrent
			},
			create: true
		}, async (memory) => readSessionActorStorageResult(await memory.actor.storage.mutate({
			type: "session.parentFork.transcript",
			input: {
				sessionId: prepared.transcript.sessionId,
				events: prepared.events
			}
		}, memory.authority))) ?? { status: "failed" };
	}
	return forkParentTranscriptInWorker(params);
}
/** Fork parent context and commit the child through its worker-owned store. */
async function forkSessionEntryFromParentTarget(params) {
	return forkSessionEntryFromParentTargetWithPatch(params);
}
async function forkSessionEntryFromParentTargetWithPatch(params, patch) {
	const memory = forkMemorySessionEntryFromParent(params, patch);
	if (memory) return memory;
	return forkParentEntryInWorker(params, patch);
}
async function resolveSessionParentForkDecision(params) {
	const parentSessionId = typeof params.parentEntry.sessionId === "string" ? params.parentEntry.sessionId : "";
	if (parentSessionId.length === 0) return planParentForkDecision(params.parentEntry);
	const parentEntry = structuredClone(params.parentEntry);
	const authority = {
		assertCurrent() {},
		authorize() {}
	};
	const scope = {
		...params,
		sessionKey: params.parentSessionKey,
		sessionId: parentSessionId
	};
	const source = captureSessionActorStorageOwner(scope, authority) ? await withSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent: () => authority.assertCurrent(),
			assertReadable: () => authority.assertCurrent()
		}
	}, (memory) => memory.actor.storage.read({
		type: "session.parentFork.source",
		input: { sessionId: parentSessionId }
	}, memory.authority)) ?? null : resolveParentForkSourceTranscript(await loadSessionTranscriptEvents({
		storePath: params.storePath,
		sessionId: parentSessionId
	}));
	return planParentForkDecision(parentEntry, estimateParentForkPromptTokens(source));
}
//#endregion
//#region src/config/sessions/session-accessor.entry-mutation.ts
/** Capture discovery inputs; the selected execution owns physical identity after resolution. */
function captureSessionEntryDatabasePreparation(scope, assertCurrent, relatedScopes = [], expectedSource) {
	const captureScope = (source) => ({
		...source,
		env: Object.freeze(captureSessionTranscriptStorageEnvironment(source.env ?? process.env))
	});
	const memory = captureMemoryExactSessionReader(scope, assertCurrent);
	const captured = captureScope(memory ? {
		...scope,
		env: {
			...scope.env,
			OPENCLAW_STATE_DIR: resolve(memory.path, "../../../..")
		}
	} : scope);
	const target = {
		...captured,
		agentId: captured.agentId ?? resolveAgentIdFromSessionKey(captured.sessionKey),
		storePath: resolveSessionStorePathForScope(captured)
	};
	const candidates = (memory ? [] : [target, ...relatedScopes.map(captureScope)]).flatMap((related) => captureSessionStoreReadCandidates(resolveSessionStorePathForScope(related)).map((candidate) => Object.assign(candidate, { identity: readDatabasePathIdentitySync(candidate.path) })));
	const expected = expectedSource && {
		database: { ...expectedSource.database },
		identity: { ...expectedSource.identity },
		selectedStore: { ...expectedSource.selectedStore }
	};
	if (expected) {
		assertCurrent();
		const selected = captureSessionStoreReadCandidate(expected.selectedStore.path);
		if (selected.path !== expected.selectedStore.path || !isSessionStoreReadCandidateCurrent(expected.selectedStore)) throw new Error("Session creation lost its originally captured database source");
		assertSessionStoreReadCandidate(expected.database.path, [{
			...expected.selectedStore,
			path: expected.selectedStore.physicalPath
		}]);
		assertDatabasePathIdentity(selected.path, expected.identity);
		assertSessionStoreReadCandidate(selected.path, candidates);
		if (!candidates.some((candidate) => candidate.path === selected.path && !candidate.scope)) candidates.push({
			...selected,
			identity: expected.identity
		});
	}
	let execution;
	const assertSourceCurrent = () => {
		memory?.assertCurrent();
		execution?.assertCurrent();
		if (expected && !isSessionStoreReadCandidateCurrent(expected.selectedStore)) throw new Error("Session creation database alias changed during preparation");
	};
	const assertHeld = () => {
		assertCurrent();
		assertSourceCurrent();
	};
	return {
		assertCurrent: assertSourceCurrent,
		env: target.env,
		get execution() {
			return execution;
		},
		assertHeld,
		release: async () => {
			await execution?.release();
		},
		async resolve() {
			assertHeld();
			if (memory) return;
			const resolved = captureLifecycleDatabaseScope(isMainThread ? await prepareSqliteScope(target) : resolveSqliteScope(target));
			assertHeld();
			const options = {
				...toDatabaseOptions(resolved),
				path: resolved.path
			};
			if (expected && (options.agentId !== expected.database.agentId || options.path !== expected.selectedStore.path)) throw new Error("Session creation resolved a different database source");
			if (expected) assertSessionStoreReadCandidate(options.path, [expected.selectedStore]);
			if (!isMainThread || !supportsOpenClawAgentDatabaseExecution(options) || hasPreparedNativeSessionDeletion()) return;
			let original = candidates.find((candidate) => candidate.path === resolved.path || candidate.physicalPath === resolved.path);
			if (!original) {
				assertSessionStoreReadCandidate(resolved.path, candidates);
				const identity = readDatabasePathIdentitySync(resolved.path);
				if (!identity.key.startsWith("path:")) throw new Error("Session creation lost its originally captured database target");
				original = {
					...captureSessionStoreReadCandidate(resolved.path),
					identity
				};
				candidates.push(original);
			}
			return {
				options,
				identity: original.identity,
				key: JSON.stringify([
					options.agentId,
					target.env.OPENCLAW_STATE_DIR,
					original.identity.key,
					original.identity.birthtime
				])
			};
		},
		begin(retained) {
			execution = retained;
		}
	};
}
/** Settle every selected writer before any facts snapshot, retaining borrowers without FIFO permits. */
function prepareSessionEntryMutationDatabases(targets, ready) {
	ready.catch(() => {});
	const captured = targets.map((target) => {
		try {
			return {
				status: "fulfilled",
				value: captureSessionEntryDatabasePreparation(target.scope, target.assertCurrent, target.relatedScopes, target.expectedSource)
			};
		} catch (reason) {
			return {
				status: "rejected",
				reason
			};
		}
	});
	const promotion = (async () => {
		await ready;
		const resolved = await Promise.allSettled(captured.map(async (capture) => {
			if (capture.status === "rejected") throw capture.reason;
			return {
				source: capture.value,
				target: await capture.value.resolve()
			};
		}));
		const outcomes = [];
		const groups = /* @__PURE__ */ new Map();
		for (const [index, result] of resolved.entries()) {
			if (result.status === "rejected") {
				outcomes[index] = result;
				continue;
			}
			const { source, target } = result.value;
			outcomes[index] = {
				status: "fulfilled",
				value: source
			};
			if (target) {
				const group = groups.get(target.key) ?? {
					target,
					members: []
				};
				group.members.push({
					index,
					capture: source
				});
				groups.set(target.key, group);
			}
		}
		await Promise.all([...groups.values()].map(async ({ target, members }) => {
			try {
				const assertCurrent = () => {
					for (const { capture } of members) capture.assertHeld();
				};
				assertCurrent();
				const identity = target.identity;
				const execution = captureOpenClawAgentDatabaseExecution(target.options, identity.key.startsWith("file:") ? { expectedIdentity: {
					kind: "file",
					physicalIdentity: identity.key.slice(5),
					nativeLocation: identity.canonicalPath,
					birthtime: identity.birthtime
				} } : { expectedCreationIdentity: identity });
				for (const member of members) member.capture.begin(execution);
				await prepareSessionEntryReplacementDatabase(target.options, assertCurrent, execution, (change) => {
					for (const { index } of members) targets[index].followRegistration?.(change);
				});
				assertCurrent();
			} catch (reason) {
				for (const { index } of members) outcomes[index] = {
					status: "rejected",
					reason
				};
			}
		}));
		return outcomes;
	})();
	const preparations = targets.map((_, index) => promotion.then((outcomes) => {
		const result = outcomes[index];
		if (result.status === "rejected") throw result.reason;
		result.value.assertCurrent();
		return result.value;
	}));
	for (const preparation of preparations) preparation.catch(() => {});
	return {
		preparations,
		async [Symbol.asyncDispose]() {
			await promotion.catch(() => {});
			const errors = (await Promise.allSettled(captured.flatMap((capture) => capture.status === "fulfilled" ? [capture.value.release()] : []))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length) throw createSqliteLifecycleAggregateError(errors, "Session database preparation cleanup failed", errors[0]);
		}
	};
}
/**
* Creates or updates one session entry and initializes its transcript header as
* one SQLite-backed lifecycle operation. Callers do not compose row creation,
* transcript initialization, rollback, and normalized session identity.
*/
async function createSessionEntryWithTranscript(scope, createEntry, options = {}) {
	const memory = await createSessionActorEntryWithTranscriptInScope(scope, createEntry, options);
	if (memory) return memory;
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	const storePath = resolveSessionStorePathForScope(captured);
	const agentId = captured.agentId ?? resolveAgentIdFromSessionKey(captured.sessionKey);
	const target = {
		...captured,
		agentId,
		storePath
	};
	const admission = isMainThread ? resolveSqliteWriteAdmissionScope(target) : void 0;
	const prepare = () => prepareSqliteScope(target);
	return createSessionEntryWithTranscriptInScope(captureLifecycleDatabaseScope(isMainThread ? admission ? await runExclusiveSqliteSessionWrite(admission, prepare, "session.entry.create-with-transcript") : await prepare() : resolveSqliteScope(target)), createEntry, options);
}
function cloneSessionEntries(store) {
	return Object.fromEntries(Object.entries(store).map(([sessionKey, entry]) => [sessionKey, { ...entry }]));
}
function collectSessionEntryKeys(...entries) {
	return [...new Set(entries.flatMap((entry) => Object.keys(entry)))];
}
function sessionEntryFieldUnchanged(left, right, key) {
	return isDeepStrictEqual(Object.hasOwn(left, key) ? left[key] : void 0, Object.hasOwn(right, key) ? right[key] : void 0);
}
function mergeConcurrentReplySessionMetadata(params) {
	const { currentEntry, preparedEntry, snapshotEntry } = params;
	if (!snapshotEntry || preparedEntry.sessionId !== snapshotEntry.sessionId) return preparedEntry;
	const merged = { ...preparedEntry };
	const mergedFields = merged;
	for (const key of collectSessionEntryKeys(currentEntry, preparedEntry, snapshotEntry)) {
		const currentChanged = !sessionEntryFieldUnchanged(currentEntry, snapshotEntry, key);
		const preparedKeptSnapshot = sessionEntryFieldUnchanged(preparedEntry, snapshotEntry, key);
		if (currentChanged && preparedKeptSnapshot) {
			if (Object.hasOwn(currentEntry, key)) mergedFields[key] = currentEntry[key];
			else delete mergedFields[key];
		}
	}
	return merged;
}
function createReplySessionInitializationRevision(entry) {
	return JSON.stringify(entry ? { sessionId: entry.sessionId } : null);
}
/** Updates an existing entry only; returns null when the session is absent. */
async function updateSessionEntry(scope, update, options = {}) {
	return await patchSessionEntryCore(scope, update, options);
}
/** Resolves one abort target identity without exposing the mutable store. */
async function resolveSessionAbortTarget(scope) {
	const entry = await readSessionEntryReadOnlyInWorker(scope);
	if (!entry) return null;
	return {
		entry: { ...entry },
		sessionId: entry.sessionId,
		sessionKey: normalizeStoreSessionKey(scope.sessionKey)
	};
}
function matchesSessionAbortTargetOwner(entry, expected) {
	return entry.sessionId === expected.sessionId && entry.lifecycleRevision === expected.lifecycleRevision && entry.activeWriterRunId === expected.activeWriterRunId;
}
/**
* Resolves, marks, touches, and canonicalizes one abort target entry as a
* storage-sized operation. Runtime abort side effects remain with callers.
*/
async function markSessionAbortTarget(params) {
	const resolution = { target: null };
	try {
		const sessionKey = normalizeStoreSessionKey(params.scope.sessionKey);
		const updated = await patchSessionEntryCore(params.scope, (currentEntry) => {
			if (!params.isCurrent?.sessionSource && params.isCurrent?.() === false || params.expectedTarget === null || params.expectedTarget && !matchesSessionAbortTargetOwner(currentEntry, params.expectedTarget)) return null;
			resolution.target = {
				entry: { ...currentEntry },
				persisted: false,
				sessionId: currentEntry.sessionId,
				sessionKey
			};
			const entry = {
				...currentEntry,
				abortedLastRun: true,
				updatedAt: params.now?.() ?? Date.now()
			};
			const cutoff = params.resolveAbortCutoff?.({
				entry: { ...currentEntry },
				sessionKey
			});
			entry.abortCutoffMessageSid = cutoff?.messageSid;
			entry.abortCutoffTimestamp = cutoff?.timestamp;
			return entry;
		}, {
			replaceEntry: true,
			skipMaintenance: true,
			...sessionEntryCommitGuardOptions(params.isCurrent?.sessionSource ?? (params.isCurrent && captureExternalSessionCommitGuard(() => {
				if (resolution.target && params.isCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
			})))
		});
		return updated && resolution.target ? {
			entry: { ...updated },
			persisted: true,
			sessionId: updated.sessionId,
			sessionKey
		} : null;
	} catch (error) {
		const fallbackTarget = resolution.target;
		if (fallbackTarget) return {
			...fallbackTarget,
			persistenceError: formatErrorMessage(error)
		};
		throw error;
	}
}
//#endregion
export { applySessionEntryLifecycleMutation as _, matchesSessionAbortTargetOwner as a, applySessionEntryCanonicalReplacements as b, resolveSessionAbortTarget as c, forkSessionEntryFromParentTargetWithPatch as d, forkSessionTranscriptFromParent as f, cleanupPluginHostSessionStore as g, applySessionPatchProjection as h, markSessionAbortTarget as i, updateSessionEntry as l, resolveSessionParentForkDecision as m, createReplySessionInitializationRevision as n, mergeConcurrentReplySessionMetadata as o, prepareSessionForkTranscript as p, createSessionEntryWithTranscript as r, prepareSessionEntryMutationDatabases as s, cloneSessionEntries as t, forkSessionEntryFromParentTarget as u, purgeDeletedAgentSessionEntries as v, applySessionEntryExactReplacements as x, cleanupSessionLifecycleArtifactsCore as y };

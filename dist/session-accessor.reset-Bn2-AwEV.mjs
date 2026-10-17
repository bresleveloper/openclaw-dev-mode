import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource, o as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { w as hasSessionActiveAutoModelFallback } from "./agent-scope-CG17uXFn.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { c as deferOpenClawAgentPostCommitPublication, t as cache, y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { n as forkCliSessionBindings } from "./cli-session-binding-CMk8AbZT.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { c as captureSessionStoreReadCandidate, s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { a as normalizeStoreSessionKey, c as resolveSessionStoreEntryCore } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { c as resolveSqliteStoreScope, d as resolveSqliteTranscriptScope, f as resolveSqliteWriteAdmissionScope, h as withSqliteSessionDatabase, i as prepareSqliteScope, l as resolveSqliteTranscriptArchiveDirectory, n as captureLifecycleDatabaseScope, o as resolveSqliteReadScope, p as runExclusiveSqliteSessionWrite, r as formatLegacySqliteSessionMarkerForScope, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { _ as resolveSessionStorePathForScope, i as retainSessionHistoryWorkerDatabase, l as maintenanceLane, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { b as runWithSessionEntryCreationPublication, x as withSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent, s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { s as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-CGOlSbiV.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { n as readSessionEntryCount, r as readSessionEntryStore } from "./session-accessor.sqlite-entry-inventory-DQ3Ihq0l.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { C as runPreparedSqliteSessionWrite, D as withSqliteSessionDeletions, S as hasPreparedNativeSessionDeletion, d as writeSessionEntry, i as normalizeLifecycleTarget, s as readSessionIdentitySnapshot, u as resolveLifecyclePrimaryEntry, w as runSqliteSessionDeletionTransaction } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { a as loadSessionEntry, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { d as withSqliteMutationWorkerLifetime, n as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-B_Nn5x_K.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { n as prepareLifecycleIdentityPublication, r as prepareSessionIdentityPublication, t as prepareCommittedSessionEntryRemovals } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { a as applySessionEntryMaintenance, c as prunePublishedSessionArchivesByRetention, d as runSqliteSessionReclamation, f as emitArchivedTranscriptUpdates, l as publishSessionStateArchives, o as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort, s as refreshSqliteSessionPlannerStatisticsBestEffort } from "./session-history-eviction-D6jaTF6N.mjs";
import { d as resolveSessionReclamationDatabaseOptions, f as runExclusiveSqliteSessionReclamation, m as SessionEntryLifecycleUpsertConflictError, p as commitProjectedSessionEntryLifecycleMutationInDatabase, r as createLifecycleArtifactReclamationPlan } from "./session-accessor.sqlite-reclamation-CiWnC9OH.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { c as loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-8qBtzC-z.mjs";
import { a as deletePlannedLifecycleArtifactEntries, i as deleteMaterializedSessionStatePlans, l as projectSessionEntryLifecycleMutation, r as collectProjectedReferencedSessionIds, s as planSessionStateAfterEntryRemoval, t as assertPlannedLifecycleArtifactEntriesUnchanged } from "./session-accessor.sqlite-lifecycle-state-BBji5bes.mjs";
import { t as ensureTranscriptHeader } from "./session-accessor.sqlite-transcript-header-B0a85ZtY.mjs";
import { t as assertSessionSubagentRunsCurrent } from "./session-accessor.sqlite-descendant-basis-7u7iMDiO.mjs";
import { a as withSessionEntryWorker, n as initializeSessionTranscriptInWorker, r as prepareSessionEntryReplacementDatabase, t as commitSessionEntryReplacementsInWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { n as resolveMaintenanceConfig, o as prepareSessionMaintenancePreservation, r as captureSessionMaintenancePreservation } from "./store-maintenance-runtime-CBCUEU3e.mjs";
import { i as preserveSqliteSameKeySessionRolloverLineage } from "./session-entry-lineage-Dms9xZt1.mjs";
import { r as mergeSessionEntry } from "./types-BZlUzQZy.mjs";
import { a as matchesPluginHostCleanupSession, i as isLockedHarnessSessionOwnedByPlugin, o as shouldSkipPluginHostCleanupStore, r as hasPluginHostCleanupTarget, t as clearPluginHostCleanupTarget } from "./plugin-host-cleanup-tR73X5Oy.mjs";
import { o as readSessionEntrySummariesInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import "./session-accessor.entry-8r2jOQkD.mjs";
import { s as resolveStoredSessionOwnerAgentId } from "./session-store-key-Ci099tm9.mjs";
import { n as readSessionEntryReplacementState } from "./session-accessor.sqlite-replacement-read-Bqri3ahV.mjs";
import { n as readSessionCreationSnapshotInDatabase, t as assertSessionCreationLabelAvailable } from "./session-accessor.sqlite-creation-read-DO8QFtG0.mjs";
import { t as commitSessionEntryReplacementsInDatabase } from "./session-accessor.sqlite-replacement-state-mI3FEuTy.mjs";
import { n as prepareSessionLifecycleArtifactCleanup } from "./session-accessor.sqlite-lifecycle-artifacts-Cy_MxPIK.mjs";
import "./session-accessor.sqlite-lifecycle-Ces1Mc-0.mjs";
import { n as MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE, o as assertModelSelectionUnlocked } from "./model-overrides-uZFvcSRc.mjs";
import { i as resolveParentForkSourceTranscript, n as estimateParentForkPromptTokens, r as planParentForkDecision, t as buildForkedChildTranscriptEvents } from "./session-accessor.sqlite-parent-fork-Bar2swWj.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-Boy0sn8m.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { isMainThread } from "node:worker_threads";
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
//#region src/config/sessions/session-accessor.sqlite-replacement-projection.ts
async function applySqliteSessionEntryReplacementProjection(params, normalize, creation) {
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const target = {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? params.sessionKeys?.[0] ?? "",
		storePath: params.storePath,
		env
	};
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
		const snapshot = useWorker ? await withSessionHistoryWorkerDatabase(databaseOptions, async (owner) => {
			const read = () => owner.readExactEntries({
				sessionKeys: params.sessionKeys ?? [],
				projection: "replacement",
				replacementSelection: {
					sessionKeys: params.sessionKeys,
					statuses: params.statuses,
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
		}) : await readNative();
		const { entries, expectedRows, labelOwnerKeys } = snapshot;
		const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
		const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
		const replacementAuthorityKeys = selectedStatuses ? new Set(entries.map(({ sessionKey }) => sessionKey)) : selectedKeys;
		const operation = await params.update(entries);
		const replacements = normalize(operation.replacements);
		const claimedCanonicalKeys = /* @__PURE__ */ new Set();
		for (const replacement of replacements) {
			const previousSessionKeys = replacement.previousSessionKeys;
			const canonical = previousSessionKeys !== void 0;
			if (canonical && !replacement.sessionKey) throw new Error("Session entry replacement requires a key");
			if (canonical && [replacement.sessionKey, ...previousSessionKeys ?? []].some(isInternalSessionEffectsKey)) throw new Error("Session entry canonical replacement cannot target internal effects rows");
			for (const sessionKey of [replacement.sessionKey, ...previousSessionKeys ?? []]) {
				if (replacementAuthorityKeys && !replacementAuthorityKeys.has(sessionKey)) throw new Error(`Session entry replacement is outside the selected ${selectedStatuses ? "row" : "key"} set: ${sessionKey}`);
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
		return {
			deletedEntries: [...mutationKeys].flatMap((sessionKey) => {
				const entry = expectedRows.get(sessionKey)?.entry;
				return entry && !applicable.some((replacement) => replacement.sessionKey === sessionKey) ? [{
					entry,
					sessionKey
				}] : [];
			}),
			commit: async (assertSourceCurrent) => {
				const maintenance = params.skipMaintenance === false ? {
					activeSessionKey: params.activeSessionKey ?? "",
					archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
					maintenance: resolveMaintenanceConfig(),
					preservation: captureSessionMaintenancePreservation(params.storePath),
					storePath: params.storePath
				} : void 0;
				const assertCurrent = () => {
					assertSourceCurrent?.();
					params.assertCommitAllowed?.();
					if (maintenance && !isDeepStrictEqual(maintenance.preservation, captureSessionMaintenancePreservation(params.storePath))) throw new Error("Session maintenance protection changed before replacement");
				};
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
				if (!useWorker || hasPreparedNativeSessionDeletion()) return withSqliteSessionDatabase(databaseOptions, (owned) => withNativeSessionCommitContext(owned, resolved.env, (source) => {
					const committed = runSqliteSessionDeletionTransaction((database) => {
						if (params.onLifecycleCommitted) deferOpenClawAgentPostCommitPublication(database, () => params.onLifecycleCommitted?.(result.pendingArchiveRecovery));
						const result = commitSessionEntryReplacementsInDatabase(database, input, () => {
							assertCurrent();
							source?.assertCurrent();
						});
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
					}, params.retainedExecution)).maintenancePlans,
					result: operation.result
				};
			}
		};
	}, "session.entry-replacements", params.withCommit, admission ? () => prepareSqliteScope(target) : void 0);
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
//#region src/config/sessions/session-entry-selection.ts
var SessionLabelOwnerIndex = class {
	#owners = /* @__PURE__ */ new Map();
	constructor(store) {
		this.store = store;
		for (const [sessionKey, entry] of Object.entries(this.store)) this.#add(sessionKey, entry.label);
	}
	isLabelInUse(label, excludedKeys) {
		for (const sessionKey of this.#owners.get(label) ?? []) if (!excludedKeys.includes(sessionKey)) return true;
		return false;
	}
	replaceEntry(candidateKeys, primaryKey, entry) {
		for (const sessionKey of /* @__PURE__ */ new Set([...candidateKeys, primaryKey])) {
			const label = this.store[sessionKey]?.label;
			if (label !== void 0) this.#owners.get(label)?.delete(sessionKey);
			delete this.store[sessionKey];
		}
		const cloned = structuredClone(entry);
		this.store[primaryKey] = cloned;
		this.#add(primaryKey, cloned.label);
		return cloned;
	}
	#add(sessionKey, label) {
		if (label === void 0) return;
		const owners = this.#owners.get(label) ?? /* @__PURE__ */ new Set();
		owners.add(sessionKey);
		this.#owners.set(label, owners);
	}
};
function selectSessionModelOverride(entry) {
	return {
		modelOverride: entry.modelOverride,
		providerOverride: entry.providerOverride,
		modelOverrideSource: entry.modelOverrideSource,
		modelOverrideRouteResolution: entry.modelOverrideRouteResolution,
		agentRuntimeOverride: entry.agentRuntimeOverride
	};
}
/** Carries only user/runtime selection into a new dashboard fork. */
function inheritSessionSelection(parentEntry) {
	if (!parentEntry) return {};
	const authProfileOverrideSource = resolveSessionAuthProfileOverrideSource(parentEntry);
	const inheritModelSelection = !hasSessionActiveAutoModelFallback(parentEntry);
	const inheritAuthProfile = inheritModelSelection || authProfileOverrideSource === "user" || authProfileOverrideSource === "user-link";
	return {
		...inheritModelSelection && parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...inheritModelSelection && parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...inheritModelSelection && parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...inheritModelSelection && parentEntry.modelOverrideRouteResolution ? { modelOverrideRouteResolution: parentEntry.modelOverrideRouteResolution } : {},
		...inheritModelSelection && parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.contextWindow ? { contextWindow: parentEntry.contextWindow } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.toolOverrides ? { toolOverrides: parentEntry.toolOverrides } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...inheritAuthProfile && authProfileOverrideSource && parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...inheritAuthProfile && authProfileOverrideSource ? { authProfileOverrideSource } : {}
	};
}
function resolveProjectionExistingEntry(snapshot, target) {
	const candidateKeys = target.candidateKeys ?? [target.primaryKey];
	let freshest;
	for (const candidateKey of candidateKeys) {
		const entry = snapshot.store[candidateKey];
		if (entry && (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0))) freshest = entry;
	}
	return freshest ? structuredClone(freshest) : void 0;
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
	const requested = captureLifecycleDatabaseScope(resolveSqliteReadScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		storePath: params.storePath
	}));
	const requestedOptions = toDatabaseOptions(requested);
	const useWorker = isMainThread && supportsOpenClawAgentDatabaseExecution(requestedOptions);
	const opened = useWorker ? getOpenClawAgentDatabaseIfOpen(requestedOptions) : void 0;
	const openedIdentity = opened ? readOpenClawAgentDatabaseIdentity(opened) : void 0;
	const source = useWorker ? openedIdentity ? {
		key: `file:${String(openedIdentity.identity)}`,
		birthtime: openedIdentity.birthtime,
		canonicalPath: openedIdentity.filename
	} : readDatabasePathIdentitySync(requested.path) : void 0;
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
			if (!source) return prepareSessionLifecycleArtifactCleanup(databaseOptions, input);
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
				forceInProcess: hasPreparedNativeSessionDeletion(),
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
//#region src/config/sessions/session-accessor.sqlite-projection.ts
let sessionArchiveRuntimePromise;
function loadSessionArchiveRuntime$1() {
	sessionArchiveRuntimePromise ??= import("./session-archive.runtime.js");
	return sessionArchiveRuntimePromise;
}
/** Applies exact lifecycle removals/upserts using SQLite session rows. */
async function applySessionEntryLifecycleMutation(params) {
	const resolved = captureLifecycleDatabaseScope(resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	}));
	const removals = [...params.removals ?? []];
	const upserts = [...params.upserts ?? []];
	const databaseOptions = toDatabaseOptions(resolved);
	const useWorker = isMainThread && upserts.length === 0 && !params.afterUpsertsInTransaction && !params.afterFreshUpsertsInTransaction && !params.beforeCommitInTransaction && !params.afterCommitted && supportsOpenClawAgentDatabaseExecution(databaseOptions);
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
		let materializedRemovalPlans = [];
		let removalArchiveMaterializationFailed = false;
		const preparedWrite = await runPreparedSqliteSessionWrite(resolved, async () => {
			const projectionInput = {
				...params.allowCanonicalRepair ? { allowCanonicalRepair: true } : {},
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				removals
			};
			if (reclamationOptions) {
				await prepareSessionEntryReplacementDatabase(reclamationOptions, () => execution?.assertCurrent(), execution);
				const result = await runSqliteSessionReclamation({
					forceInProcess: false,
					assertCommitAllowed: () => execution?.assertCurrent(),
					plan: {
						kind: "lifecycle-projection-plan",
						databaseOptions: reclamationOptions,
						materializedPlans: [],
						input: projectionInput
					}
				});
				if (result.kind !== "lifecycle-projection-plan") throw new Error("SQLite lifecycle projection returned an unexpected planning result");
				projected = result.value;
			} else projected = await projectSessionEntryLifecycleMutation(databaseOptions, {
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
						const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
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
					if (reclamationOptions && !hasPreparedNativeSessionDeletion()) {
						const preparedPreservation = params.skipMaintenance ? void 0 : await prepareSessionMaintenancePreservation(params.storePath);
						try {
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
								if (maintenance && preparedPreservation && !isDeepStrictEqual(maintenance.preservation, preparedPreservation.capture())) throw new Error("Session maintenance protection changed before lifecycle removal");
							};
							const result = await runSqliteSessionReclamation({
								forceInProcess: false,
								assertCommitAllowed: assertCurrent,
								onWorkerResult: (completed) => {
									if (completed.kind === "lifecycle-projection-commit") params.onLifecycleCommitted?.();
								},
								plan: {
									kind: "lifecycle-projection-commit",
									agentId: resolved.agentId,
									databaseOptions: reclamationOptions,
									materializedPlans: materializedRemovalPlans,
									descendantRunBasis: params.descendantRunBasis,
									maintenanceRunBasis: preparedPreservation?.subagentRunBasis,
									input: {
										projected,
										materializationFailed: removalArchiveMaterializationFailed,
										allowCanonicalRepair: params.allowCanonicalRepair,
										maintenance
									}
								}
							});
							if (result.kind !== "lifecycle-projection-commit") throw new Error("SQLite lifecycle projection returned an unexpected commit result");
							return withArchivePublication(result.value);
						} finally {
							preparedPreservation?.dispose();
						}
					}
					return withSqliteSessionDatabase(toDatabaseOptions(resolved), (database) => withNativeSessionCommitContext(database, resolved.env, (source) => commitProjectedLifecycleMutation(materializedRemovalPlans, removalArchiveMaterializationFailed, () => {
						assertSourceCurrent?.();
						source?.assertCurrent();
					}), params.afterCommitted));
				}
			};
		}, "session.lifecycle.mutate", params.withCommit, void 0, useWorker ? "worker" : "foreground");
		const committed = preparedWrite.result;
		function commitProjectedLifecycleMutation(removalPlans, materializationFailed, assertSourceCurrent) {
			const commitResult = runSqliteSessionDeletionTransaction((transactionDb) => {
				execution?.assertCurrent();
				params.commitGuard?.();
				params.beforeCommitInTransaction?.();
				assertSourceCurrent?.();
				assertSessionSubagentRunsCurrent(params, resolved.env);
				if (params.onLifecycleCommitted) deferOpenClawAgentPostCommitPublication(transactionDb, params.onLifecycleCommitted);
				const result = commitProjectedSessionEntryLifecycleMutationInDatabase(transactionDb, {
					projected,
					removalPlans,
					materializationFailed,
					allowCanonicalRepair: params.allowCanonicalRepair,
					resetScope: resolved,
					afterUpsertsInTransaction: params.afterUpsertsInTransaction,
					afterFreshUpsertsInTransaction: params.afterFreshUpsertsInTransaction,
					applyMaintenance: (database) => applySessionEntryMaintenance(database, {
						activeSessionKey: params.activeSessionKey ?? "",
						archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
						forceMaintenance: params.maintenanceOverride !== void 0,
						maintenanceConfig: params.maintenanceOverride ? {
							...resolveMaintenanceConfig(),
							...params.maintenanceOverride
						} : void 0,
						skipMaintenance: params.skipMaintenance,
						storePath: params.storePath
					})
				});
				params.commitGuard?.();
				assertSourceCurrent?.();
				assertSessionSubagentRunsCurrent(params, resolved.env);
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
		let afterCount;
		if (reclamationOptions) {
			const result = await runSqliteSessionReclamation({
				forceInProcess: false,
				assertCommitAllowed: () => execution?.assertCurrent(),
				plan: {
					kind: "lifecycle-projection-count",
					databaseOptions: reclamationOptions,
					materializedPlans: []
				}
			});
			if (result.kind !== "lifecycle-projection-count") throw new Error("SQLite lifecycle projection returned an unexpected count result");
			afterCount = result.value;
		} else afterCount = readSessionEntryCount(openOpenClawAgentDatabase(databaseOptions));
		emitArchivedTranscriptUpdates(archivedTranscripts);
		const archivedTranscriptDirectories = uniqueStrings(archivedTranscripts.map((transcript) => path.dirname(transcript.archivedPath))).toSorted();
		if (archivedTranscriptDirectories.length > 0 && params.cleanupArchivedTranscripts) try {
			const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime$1();
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
/** Purges entries owned by a deleted agent from SQLite session rows. */
async function purgeDeletedAgentSessionEntries(params) {
	const resolved = resolveSqliteScope({
		agentId: params.storeAgentId,
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const store = readSessionEntryStore(database);
		const remainingStore = { ...store };
		const entryRemovals = [];
		const removedEntriesToArchive = [];
		for (const sessionKey of Object.keys(store)) {
			if (resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) !== params.agentId) continue;
			const entry = store[sessionKey];
			if (!entry) continue;
			entryRemovals.push({
				expectedEntry: structuredClone(entry),
				sessionKey
			});
			removedEntriesToArchive.push(entry);
			delete remainingStore[sessionKey];
		}
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: entryRemovals.map((removal) => removal.sessionKey),
			projectedStore: remainingStore,
			candidateSessionIds: removedEntriesToArchive.flatMap(collectSessionStateIdsForEntry)
		});
		return {
			deletePlans: removedEntriesToArchive.flatMap((entry) => planSessionStateAfterEntryRemoval({
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				database,
				entry,
				reason: "deleted",
				referencedSessionIds
			})),
			entryRemovals
		};
	}, "session.agent-purge.prepare");
	const materializedPlans = await materializeSessionStateDeletePlans(prepared.deletePlans);
	const committed = await withSqliteSessionDeletions(resolved, prepared.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
		entry,
		sessionKey
	}] : []), async () => await runExclusiveSqliteSessionWrite(resolved, async () => {
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runSqliteSessionDeletionTransaction((transactionDb) => {
			const currentOwnedSessionKeys = Object.keys(readSessionEntryStore(transactionDb)).filter((sessionKey) => resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) === params.agentId).toSorted();
			const plannedSessionKeys = prepared.entryRemovals.map((removal) => removal.sessionKey).toSorted();
			if (JSON.stringify(currentOwnedSessionKeys) !== JSON.stringify(plannedSessionKeys)) throw new Error("SQLite deleted-agent session entries changed before purge");
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, prepared.entryRemovals);
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedPlans, void 0, new Set(prepared.entryRemovals.map((removal) => removal.sessionKey)));
			deletePlannedLifecycleArtifactEntries(transactionDb, prepared.entryRemovals);
			const publish = prepareCommittedSessionEntryRemovals(resolved.agentId, readOpenClawAgentDatabaseIdentity(transactionDb).identity, prepared.entryRemovals);
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				storePath: params.storePath
			}));
			return publish;
		}, toDatabaseOptions(resolved), { operationLabel: "session.entry.purge-deleted-agent" })();
		return {
			archivedTranscripts,
			maintenancePlans
		};
	}, "session.agent-purge.commit"));
	const { archivedTranscripts: maintenanceArchivedTranscripts } = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans, { deletedEntriesBeforeMaintenance: prepared.entryRemovals.length });
	const archivedTranscripts = [...await publishSessionStateArchives(resolved, committed.archivedTranscripts), ...maintenanceArchivedTranscripts];
	emitArchivedTranscriptUpdates(archivedTranscripts);
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle.ts
/** Projects ordered session patches against one store snapshot and commits once. */
async function applySessionPatchProjections(params) {
	return await applySessionEntryCanonicalReplacements({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		skipMaintenance: true,
		update: async (entries) => {
			const workingStore = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
			const snapshot = { store: workingStore };
			const labelOwners = new SessionLabelOwnerIndex(workingStore);
			const replacements = [];
			const results = [];
			for (const operation of params.operations) try {
				const target = operation.resolveTarget(snapshot);
				const existingEntry = resolveProjectionExistingEntry(snapshot, target);
				const candidateKeys = uniqueStrings((target.candidateKeys ?? [target.primaryKey]).map((key) => key.trim()).filter(Boolean));
				const projected = await operation.project({
					...target,
					...snapshot,
					...existingEntry ? { existingEntry } : {},
					isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys)
				});
				if (!projected.ok) {
					results.push(projected);
					continue;
				}
				const authorizationFailure = operation.authorize?.();
				if (authorizationFailure) {
					results.push(authorizationFailure);
					continue;
				}
				const previousSessionKeys = candidateKeys.filter((sessionKey) => sessionKey !== target.primaryKey && workingStore[sessionKey]);
				replacements.push({
					entry: projected.entry,
					previousSessionKeys,
					sessionKey: target.primaryKey
				});
				const cloned = labelOwners.replaceEntry(candidateKeys, target.primaryKey, projected.entry);
				results.push({
					ok: true,
					entry: structuredClone(cloned)
				});
			} catch (error) {
				if (!operation.onError) throw error;
				results.push(operation.onError(error));
			}
			return {
				replacements,
				result: results
			};
		}
	});
}
/** Applies one patch through the canonical ordered batch projection owner. */
async function applySessionPatchProjection(params) {
	const [result] = await applySessionPatchProjections({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		operations: [{
			resolveTarget: params.resolveTarget,
			project: params.project,
			...params.assertCurrent ? { authorize: () => {
				params.assertCurrent?.();
			} } : {}
		}]
	});
	if (!result) throw new Error("Session patch projection produced no result");
	return result;
}
/**
* Clears plugin host-owned state inside one resolved session store.
* This is an internal transaction-sized boundary for the storage backend, not
* a Plugin SDK API.
*/
async function cleanupPluginHostSessionStore(params) {
	if (shouldSkipPluginHostCleanupStore(params) || params.shouldCleanup && !params.shouldCleanup()) return 0;
	const now = Date.now();
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
			shouldCommit: params.shouldCleanup,
			onCommitted: () => {
				cleared += 1;
			},
			replaceEntry: true,
			skipMaintenance: true
		});
	}
	return cleared;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-creation.ts
/** One creation owner retains source custody across preparation, commit, and publication. */
async function createSessionEntryWithTranscriptInScope(scope, createEntry, options) {
	const databaseOptions = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const retained = isMainThread && supportsOpenClawAgentDatabaseExecution(databaseOptions) && !hasPreparedNativeSessionDeletion() ? retainSessionHistoryWorkerDatabase(databaseOptions) : void 0;
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
				});
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
					afterFreshUpsertsInTransaction: (database) => {
						if (created.transcriptEvents) appendTranscriptEventsInTransaction(database, {
							...scope,
							sessionKey: normalizedKey,
							sessionId: created.entry.sessionId
						}, created.transcriptEvents);
						if (owner && !replaceSessionOwnerInTransaction(database, normalizedKey, owner)) throw new Error(`Session owner assignment lost its target: ${normalizedKey}`);
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
			if (pendingArchiveRecovery) await publishCreationArchivesInWorker(scope, source.databaseIdentity, assertCurrent);
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
async function publishCreationArchivesInWorker(scope, databaseIdentity, assertCurrent) {
	const databaseOptions = {
		...toDatabaseOptions(scope),
		path: scope.path
	};
	const run = (execute) => withSessionEntryWorker(databaseOptions, databaseIdentity, assertCurrent, async (execution, source) => {
		const result = await execution.runExisting(source, async (worker) => ({ value: await execute(worker) }));
		if (!result) throw new Error("Session database disappeared before archive publication");
		return result.value;
	});
	await publishSessionStateArchives({
		...scope,
		agentId: databaseOptions.agentId
	}, [], {
		prepare: (requested) => run((worker) => worker.execute({
			type: "session.archives.preparePublication",
			input: {
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(scope),
				requested
			}
		})),
		record: (results) => run((worker) => worker.execute({
			type: "session.archives.recordPublication",
			input: {
				results,
				nowMs: Date.now()
			}
		}))
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-session.ts
/** Prepare one source snapshot; the creation owner commits its copy with the child entry. */
async function prepareSessionForkTranscript(params) {
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	params.commitGuard?.();
	const resolved = await prepareSqliteScope({
		agentId: params.agentId,
		sessionKey: params.parentSessionKey,
		storePath: params.storePath
	});
	if (params.targetStorePath) await prepareSqliteScope({
		sessionKey: params.sessionKey,
		storePath: params.targetStorePath
	});
	const sourceScope = {
		agentId: resolved.agentId,
		env: resolved.env,
		sessionKey: normalizeStoreSessionKey(params.parentSessionKey),
		sessionId: params.parentEntry.sessionId,
		storePath: resolved.path ?? params.storePath
	};
	const hydration = prepareSessionTranscriptHydration(sourceScope);
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Dk13RKwH.mjs");
	const snapshot = await readRestoredSessionTranscript(sourceScope, hydration.read, { assertCurrent: params.commitGuard });
	params.commitGuard?.();
	hydration.assertCurrent();
	if (snapshot.kind !== "full") throw new Error("Parent fork requires its complete transcript snapshot");
	const source = resolveParentForkSourceTranscript(snapshot.snapshot.events, params.forkFrom);
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
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const target = params.targetStorePath ? resolveSqliteScope({
		sessionKey: params.sessionKey,
		storePath: params.targetStorePath
	}) : resolved;
	const crossDatabase = target.agentId !== resolved.agentId || (target.path ?? "") !== (resolved.path ?? "");
	if (params.parentEntry.sessionId) {
		params.commitGuard?.();
		const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
		await restoreSessionColdTranscript({
			agentId: resolved.agentId,
			env: resolved.env,
			storePath: params.storePath,
			sessionId: params.parentEntry.sessionId
		});
	}
	if (!crossDatabase) return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => {
		params.commitGuard?.();
		return forkSqliteParentTranscriptInTransaction(database, resolved, {
			enforceTokenLimit: params.enforceTokenLimit,
			maxTokens: params.maxTokens,
			parentEntry: params.parentEntry,
			parentSessionKey: params.parentSessionKey,
			forkFrom: params.forkFrom,
			targetSessionId: params.targetSessionId,
			targetSessionKey: params.sessionKey
		});
	}, toDatabaseOptions(resolved), { operationLabel: "session.parent-fork.same-store" }), "session.parent.fork-transcript");
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const sourceDatabase = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(sourceDatabase, params.parentEntry.sessionId), params.forkFrom);
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeStoreSessionKey(params.parentSessionKey)
	});
	return await runExclusiveSqliteSessionWrite(target, async () => {
		const sessionId = params.targetSessionId ?? randomUUID();
		const targetScope = {
			...target,
			sessionId,
			sessionKey: normalizeStoreSessionKey(params.sessionKey)
		};
		runOpenClawAgentWriteTransaction((database) => {
			params.commitGuard?.();
			appendTranscriptEventsInTransaction(database, targetScope, buildForkedChildTranscriptEvents({
				parentSessionFile,
				source,
				targetSessionId: sessionId
			}));
		}, toDatabaseOptions(target), { operationLabel: "session.parent-fork.copy-transcript" });
		return {
			status: "created",
			transcript: {
				sessionFile: targetScope.sessionKey,
				sessionId
			}
		};
	}, "session.parent.fork-transcript");
}
/** Forks parent context into a child session entry using SQLite rows only. */
async function forkSessionEntryFromParentTarget(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const parent = resolveLifecyclePrimaryEntry(database, parentTarget);
		if (!parent?.entry.sessionId) return { status: "missing-parent" };
		const existing = resolveLifecyclePrimaryEntry(database, sessionTarget);
		const base = existing?.entry ?? params.fallbackEntry;
		if (!base) return { status: "missing-entry" };
		if (params.skipForkWhen?.(structuredClone(base))) {
			const sessionEntry = persistSqliteParentForkSkipPatch({
				commitGuard: params.commitGuard,
				entry: base,
				sessionKey: sessionTarget.canonicalKey,
				patch: params.skipPatch?.(structuredClone(base)),
				resolved
			});
			return {
				status: "skipped",
				reason: "existing-entry",
				parentEntry: parent.entry,
				sessionEntry
			};
		}
		assertModelSelectionUnlocked(parent.entry, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
		return {
			status: "prepared",
			parentEntry: parent.entry,
			base: existing ? base : structuredClone(base)
		};
	}, "session.parent.fork-entry");
	if (prepared.status !== "prepared") return prepared;
	params.commitGuard?.();
	const { restoreSessionColdTranscript } = await import("./session-cold-storage-C7VKIe8P.mjs");
	await restoreSessionColdTranscript({
		agentId: resolved.agentId,
		env: resolved.env,
		storePath: params.storePath,
		sessionId: prepared.parentEntry.sessionId
	});
	const { cliBackendSupportsSessionFork } = await import("./cli-backends-CZlxwzLp.mjs");
	const cliSessionBindings = forkCliSessionBindings(prepared.parentEntry, cliBackendSupportsSessionFork);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		params.commitGuard?.();
		const committed = runOpenClawAgentWriteTransaction((writeDatabase) => {
			params.commitGuard?.();
			const freshParent = resolveLifecyclePrimaryEntry(writeDatabase, parentTarget)?.entry;
			const freshBase = resolveLifecyclePrimaryEntry(writeDatabase, sessionTarget)?.entry ?? params.fallbackEntry;
			if (!freshParent || !freshBase || !sqliteSessionEntriesEqual(freshParent, prepared.parentEntry) || !sqliteSessionEntriesEqual(freshBase, prepared.base)) return { result: { status: "failed" } };
			assertModelSelectionUnlocked(freshParent, MODEL_SELECTION_LOCKED_PARENT_FORK_MESSAGE);
			const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(writeDatabase, freshParent.sessionId));
			const decision = planParentForkDecision(freshParent, estimateParentForkPromptTokens(source));
			if (decision.status === "skip") return { skip: {
				decision,
				base: freshBase,
				parentEntry: freshParent
			} };
			const fork = forkSqliteParentTranscriptInTransaction(writeDatabase, resolved, {
				parentEntry: freshParent,
				parentSessionKey: parentTarget.canonicalKey,
				source,
				targetSessionKey: sessionTarget.canonicalKey
			});
			if (fork.status !== "created") return { result: fork.status === "missing-parent" ? { status: "missing-parent" } : { status: "failed" } };
			const forkIdentityPatch = {
				...params.patch?.({
					decision,
					entry: structuredClone(freshBase),
					fork: fork.transcript,
					parentEntry: structuredClone(freshParent)
				}),
				forkSource: {
					sessionKey: parentTarget.canonicalKey,
					sessionId: freshParent.sessionId
				},
				forkedFromParent: true,
				lifecycleRunId: void 0,
				lastRunId: void 0,
				sessionId: fork.transcript.sessionId,
				totalTokens: void 0,
				totalTokensFresh: false,
				totalTokensVersion: void 0,
				cliSessionBindings,
				cliSessionIds: void 0,
				claudeCliSessionId: void 0
			};
			const previousIdentity = readSessionIdentitySnapshot(writeDatabase, [sessionTarget.canonicalKey]);
			const next = writeSessionEntry(writeDatabase, sessionTarget.canonicalKey, mergeSessionEntry(freshBase, forkIdentityPatch), {
				previousEntry: freshBase,
				canonicalPreviousEntry: previousIdentity.get(sessionTarget.canonicalKey) ?? null
			});
			const currentIdentity = readSessionIdentitySnapshot(writeDatabase, [sessionTarget.canonicalKey]);
			return {
				result: {
					status: "forked",
					decision,
					fork: fork.transcript,
					parentEntry: freshParent,
					sessionEntry: structuredClone(next)
				},
				publish: prepareSessionIdentityPublication(writeDatabase, resolved.agentId, previousIdentity, currentIdentity)
			};
		}, toDatabaseOptions(resolved), { operationLabel: "session.parent-fork.entry" });
		if ("skip" in committed) {
			const { decision, base, parentEntry } = committed.skip;
			const patch = params.decisionSkipPatch?.({
				decision,
				entry: structuredClone(base),
				parentEntry: structuredClone(parentEntry)
			});
			return {
				status: "skipped",
				reason: "decision-skip",
				parentEntry,
				sessionEntry: persistSqliteParentForkSkipPatch({
					commitGuard: params.commitGuard,
					entry: base,
					sessionKey: sessionTarget.canonicalKey,
					patch,
					resolved
				}),
				decision
			};
		}
		committed.publish?.();
		return committed.result;
	}, "session.parent.fork-entry");
}
function persistSqliteParentForkSkipPatch(params) {
	if (!params.patch) return structuredClone(params.entry);
	const merged = mergeSessionEntry(params.entry, params.patch);
	const next = preserveSqliteSameKeySessionRolloverLineage({
		next: merged,
		previous: params.entry,
		sessionKey: params.sessionKey
	});
	runOpenClawAgentWriteTransaction((database) => {
		params.commitGuard?.();
		const previousIdentity = readSessionIdentitySnapshot(database, [params.sessionKey]);
		writeSessionEntry(database, params.sessionKey, next, {
			previousEntry: params.entry,
			canonicalPreviousEntry: previousIdentity.get(params.sessionKey) ?? null
		});
		const currentIdentity = readSessionIdentitySnapshot(database, [params.sessionKey]);
		return prepareSessionIdentityPublication(database, params.resolved.agentId, previousIdentity, currentIdentity);
	}, toDatabaseOptions(params.resolved), { operationLabel: "session.parent-fork.skip" })();
	return structuredClone(next);
}
async function resolveSessionParentForkDecision(params) {
	const parentSessionId = typeof params.parentEntry.sessionId === "string" ? params.parentEntry.sessionId : "";
	if (parentSessionId.length === 0) return planParentForkDecision(params.parentEntry);
	const resolved = resolveSqliteStoreScope(params.storePath);
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-Dk13RKwH.mjs");
	return readRestoredSessionTranscript({
		agentId: resolved.agentId,
		storePath: params.storePath,
		sessionId: parentSessionId
	}, () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		return planParentForkDecision(params.parentEntry, estimateParentForkPromptTokens(resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, parentSessionId))));
	});
}
function forkSqliteParentTranscriptInTransaction(database, resolved, params) {
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = params.source === void 0 ? resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, params.parentEntry.sessionId), params.forkFrom) : params.source;
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const sessionId = params.targetSessionId ?? randomUUID();
	const targetScope = {
		...resolved,
		sessionId,
		sessionKey: normalizeStoreSessionKey(params.targetSessionKey)
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeStoreSessionKey(params.parentSessionKey)
	});
	appendTranscriptEventsInTransaction(database, targetScope, buildForkedChildTranscriptEvents({
		parentSessionFile,
		source,
		targetSessionId: sessionId
	}));
	return {
		status: "created",
		transcript: {
			sessionFile: targetScope.sessionKey,
			sessionId
		}
	};
}
function resolveParentForkLimitDecision(params, source) {
	if (!params.enforceTokenLimit) return;
	const decision = planParentForkDecision(params.parentEntry, estimateParentForkPromptTokens(source), {
		maxTokens: params.maxTokens,
		preferTranscriptEstimate: params.forkFrom === "last-completed"
	});
	return decision.status === "skip" ? decision : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.entry-mutation.ts
/** Capture source custody before authority or physical-owner discovery yields. */
function captureSessionEntryDatabasePreparation(scope, assertCurrent, relatedScopes = []) {
	const captureScope = (source) => ({
		...source,
		env: Object.freeze(captureSessionTranscriptStorageEnvironment(source.env ?? process.env))
	});
	const captured = captureScope(scope);
	const target = {
		...captured,
		agentId: captured.agentId ?? resolveAgentIdFromSessionKey(captured.sessionKey),
		storePath: resolveSessionStorePathForScope(captured)
	};
	const shared = captureOpenClawStateWorkerContext({ env: target.env });
	const candidates = [target, ...relatedScopes.map(captureScope)].flatMap((related) => captureSessionStoreReadCandidates(resolveSessionStorePathForScope(related)).map((candidate) => Object.assign(candidate, { identity: readDatabasePathIdentitySync(candidate.path) })));
	const releases = [];
	let active = true;
	let execution;
	let preparedPath;
	let preparedIdentity;
	let creatingPath;
	const assertSourceCurrent = () => {
		if (!active) throw new Error("Session creation database preparation is closed");
		shared.admission.assertCurrent();
		execution?.assertCurrent();
		for (const candidate of candidates) {
			const isCreating = candidate.path === creatingPath || candidate.physicalPath === creatingPath;
			const isPrepared = candidate.path === preparedPath || candidate.physicalPath === preparedPath;
			if (captureSessionStoreReadCandidate(candidate.path, candidate.scope).physicalPath !== candidate.physicalPath || !(isCreating && candidate.identity.key.startsWith("path:")) && !isDeepStrictEqual(readDatabasePathIdentitySync(candidate.path), isPrepared ? preparedIdentity : candidate.identity)) throw new Error("Session creation database changed during preparation");
		}
		if (preparedPath && !isDeepStrictEqual(readDatabasePathIdentitySync(preparedPath), preparedIdentity)) throw new Error("Session creation database changed after preparation");
	};
	const assertHeld = () => {
		assertCurrent();
		assertSourceCurrent();
	};
	const unregister = () => {
		for (const release of releases.splice(0).toReversed()) release();
	};
	const release = async () => {
		active = false;
		try {
			await execution?.release();
		} finally {
			unregister();
		}
	};
	try {
		for (const candidate of candidates) for (const path of /* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])) releases.push(registerOpenClawAgentDatabaseReadCandidateResource({
			path,
			scope: candidate.scope,
			revoke: () => {
				active = false;
			},
			close: release
		}));
	} catch (error) {
		active = false;
		unregister();
		throw error;
	}
	return {
		assertCurrent: assertSourceCurrent,
		env: target.env,
		get execution() {
			return execution;
		},
		assertHeld,
		release,
		async resolve() {
			assertHeld();
			const resolved = captureLifecycleDatabaseScope(isMainThread ? await prepareSqliteScope(target) : resolveSqliteScope(target));
			assertHeld();
			const options = {
				...toDatabaseOptions(resolved),
				path: resolved.path
			};
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
					shared.admission.databasePath,
					shared.admission.identity.key,
					options.agentId,
					original.identity.key,
					original.identity.birthtime
				])
			};
		},
		begin(path, retained) {
			execution = retained;
			creatingPath = path;
		},
		finish(path, original) {
			const accepted = execution?.fileIdentity;
			if (!accepted || typeof accepted.birthtime !== "string") throw new Error("Session creation has no accepted native file identity");
			preparedPath = path;
			preparedIdentity = {
				key: `file:${accepted.physicalIdentity}`,
				canonicalPath: original.canonicalPath,
				birthtime: accepted.birthtime
			};
			creatingPath = void 0;
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
				value: captureSessionEntryDatabasePreparation(target.scope, target.assertCurrent, target.relatedScopes)
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
			return await capture.value.resolve();
		}));
		const outcomes = [];
		const groups = /* @__PURE__ */ new Map();
		for (const [index, result] of resolved.entries()) {
			if (result.status === "rejected") {
				outcomes[index] = result;
				continue;
			}
			const capture = captured[index];
			if (capture.status !== "fulfilled") throw new Error("Session database resolution lost its captured source");
			const source = capture.value;
			outcomes[index] = {
				status: "fulfilled",
				value: {
					assertCurrent: source.assertCurrent,
					env: source.env,
					get execution() {
						return source.execution;
					}
				}
			};
			if (result.value) {
				const group = groups.get(result.value.key) ?? {
					target: result.value,
					members: []
				};
				group.members.push({
					index,
					capture: source,
					target: result.value
				});
				groups.set(result.value.key, group);
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
				for (const member of members) member.capture.begin(member.target.options.path, execution);
				await prepareSessionEntryReplacementDatabase(target.options, assertCurrent, execution);
				for (const member of members) member.capture.finish(member.target.options.path, member.target.identity);
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
	return createSessionEntryWithTranscriptInScope(captureLifecycleDatabaseScope(isMainThread ? await prepareSqliteScope(target) : resolveSqliteScope(target)), createEntry, options);
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
function resolveSessionAbortTarget(scope) {
	const entry = loadSessionEntry(scope);
	if (!entry) return null;
	return {
		entry: { ...entry },
		sessionId: entry.sessionId,
		sessionKey: normalizeStoreSessionKey(scope.sessionKey)
	};
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
			if (params.isCurrent?.() === false) return null;
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
			assertCommitAllowed: () => {
				if (resolution.target && params.isCurrent?.() === false) throw new Error("The selected session changed before it could be stopped.");
			}
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
//#region src/config/sessions/session-reset-entry.ts
/** The typed reply descriptor serves today's builder and the later compound projection kernel. */
function resolveReplySessionInitializationUpserts(descriptor, currentEntry) {
	if (createReplySessionInitializationRevision(currentEntry) !== descriptor.expectedRevision) return {
		kind: "stale",
		currentEntry
	};
	return {
		kind: "ready",
		entry: currentEntry ? mergeConcurrentReplySessionMetadata({
			currentEntry,
			preparedEntry: descriptor.entry,
			snapshotEntry: descriptor.snapshotEntry
		}) : descriptor.entry,
		retiredEntry: descriptor.retiredEntry
	};
}
//#endregion
//#region src/config/sessions/session-accessor.reset.ts
var SessionInitializationAgentScopeMismatchError = class extends Error {
	constructor(agentId, sessionKeyAgentId) {
		super(`Session initialization agent scope mismatch: explicit agent "${agentId}" does not match session key agent "${sessionKeyAgentId}".`);
		this.agentId = agentId;
		this.sessionKeyAgentId = sessionKeyAgentId;
		this.code = "SESSION_INITIALIZATION_AGENT_SCOPE_MISMATCH";
		this.name = "SessionInitializationAgentScopeMismatchError";
	}
};
function assertSessionInitializationAgentScope(agentId, sessionKey) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (sessionKeyAgentId && normalizeAgentId(sessionKeyAgentId) !== normalizedAgentId) throw new SessionInitializationAgentScopeMismatchError(normalizedAgentId, sessionKeyAgentId);
}
const loadSessionArchiveRuntime = createLazyRuntimeModule(() => import("./session-archive.runtime.js"));
function loadReplySessionInitializationEntries(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const result = withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		assertCanonicalSqliteSessionKeysCurrent(database);
		const entries = {};
		const currentKey = normalizeStoreSessionKey(params.sessionKey);
		const keys = /* @__PURE__ */ new Set([currentKey, ...params.relatedSessionKeys ?? []]);
		for (const key of keys) {
			const sessionKey = normalizeStoreSessionKey(key);
			if (!sessionKey || entries[sessionKey]) continue;
			const entry = readExactSessionEntryRow(database, sessionKey)?.entry;
			if (entry) {
				entries[sessionKey] = entry;
				if (sessionKey === currentKey && entry.parentSessionKey) keys.add(entry.parentSessionKey);
			}
		}
		return entries;
	}), toDatabaseOptions(resolveSqliteScope(params)));
	return result.found ? result.value : {};
}
/** Loads the declared reply-session rows without exposing a mutable store. */
function loadReplySessionInitializationSnapshot(params) {
	const storePath = resolveSessionStorePathForScope(params);
	const store = loadReplySessionInitializationEntries({
		...params,
		storePath
	});
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	return {
		...currentEntry ? { currentEntry } : {},
		readEntry: (sessionKey) => {
			const entry = resolveSessionStoreEntryCore({
				store,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		},
		revision: createReplySessionInitializationRevision(currentEntry)
	};
}
function createStaleReplySessionInitializationResult(currentEntry) {
	return {
		ok: false,
		...currentEntry ? { currentEntry } : {},
		reason: "stale-snapshot",
		revision: createReplySessionInitializationRevision(currentEntry)
	};
}
/**
* Persists one reply-session initialization result and archives the previous
* transcript after metadata commits, keeping archive failure warning-only.
*/
async function commitReplySessionInitialization(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const store = loadReplySessionInitializationEntries({
		...params,
		storePath
	});
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	if (createReplySessionInitializationRevision(currentEntry) !== params.expectedRevision) return createStaleReplySessionInitializationResult(currentEntry);
	const readEntry = (sessionKey) => {
		const entry = resolveSessionStoreEntryCore({
			store,
			sessionKey
		}).existing;
		return entry ? { ...entry } : void 0;
	};
	const sessionEntry = params.prepareSessionEntry ? await params.prepareSessionEntry({
		...currentEntry ? { currentEntry } : {},
		readEntry,
		sessionEntry: params.sessionEntry
	}) : params.sessionEntry;
	let staleCommit;
	let committedSessionEntry = sessionEntry;
	let beforeEntryMutationDone = false;
	const descriptor = {
		kind: "reply-initialization",
		expectedRevision: params.expectedRevision,
		entry: sessionEntry,
		snapshotEntry: params.snapshotEntry ?? params.previousEntry,
		retiredEntry: params.retiredEntry
	};
	let preparedUpserts;
	const upserts = [{
		sessionKey: resolved.normalizedKey,
		...params.routeContext !== void 0 ? { routeContext: params.routeContext } : {},
		...params.resetBoundary ? { resetBoundary: params.resetBoundary } : {},
		buildEntry: async ({ currentEntry: commitEntry }) => {
			preparedUpserts = resolveReplySessionInitializationUpserts(descriptor, commitEntry);
			if (preparedUpserts.kind === "stale") {
				staleCommit = preparedUpserts.currentEntry ? { ...preparedUpserts.currentEntry } : null;
				return null;
			}
			committedSessionEntry = preparedUpserts.entry;
			if (!beforeEntryMutationDone) {
				await params.beforeEntryMutation?.({
					...commitEntry ? { currentEntry: { ...commitEntry } } : {},
					sessionEntry: committedSessionEntry
				});
				beforeEntryMutationDone = true;
			}
			return committedSessionEntry;
		}
	}];
	if (params.retiredEntry) {
		const retiredEntry = params.retiredEntry;
		upserts.push({
			sessionKey: retiredEntry.key,
			buildEntry: () => preparedUpserts?.kind === "ready" ? preparedUpserts.retiredEntry?.entry ?? null : null
		});
	}
	try {
		await applySessionEntryLifecycleMutation({
			activeSessionKey: params.activeSessionKey,
			agentId: params.agentId,
			maintenanceOverride: params.maintenanceConfig,
			storePath,
			upserts,
			beforeCommitInTransaction: params.commitGuard
		});
	} catch (error) {
		if (!(error instanceof SessionEntryLifecycleUpsertConflictError) || error.sessionKey !== resolved.normalizedKey) throw error;
		return createStaleReplySessionInitializationResult(loadSessionEntry({
			agentId: params.agentId,
			readConsistency: "latest",
			sessionKey: error.sessionKey,
			storePath
		}));
	}
	if (staleCommit !== void 0) return createStaleReplySessionInitializationResult(staleCommit ?? void 0);
	store[resolved.normalizedKey] = committedSessionEntry;
	if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
	const committed = {
		ok: true,
		previousSessionTranscript: {},
		sessionEntry: { ...committedSessionEntry },
		sessionStoreView: cloneSessionEntries(store)
	};
	const previousSessionTranscript = isIncognitoSessionKey(params.sessionKey) || params.previousEntry?.incognito === true ? {} : params.archivePreviousTranscript === false ? {} : await archivePreviousSessionTranscript({
		agentId: params.agentId,
		onArchiveError: params.onArchiveError,
		previousEntry: params.previousEntry,
		storePath: params.storePath
	});
	return {
		...committed,
		previousSessionTranscript
	};
}
async function archivePreviousSessionTranscript(params) {
	if (!params.previousEntry?.sessionId) return {};
	const { archiveSessionTranscriptsDetailed, resolveStableSessionEndTranscript } = await loadSessionArchiveRuntime();
	const archivedTranscripts = archiveSessionTranscriptsDetailed({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		reason: "reset",
		onArchiveError: params.onArchiveError
	});
	return resolveStableSessionEndTranscript({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		archivedTranscripts
	});
}
//#endregion
export { applySessionEntryExactReplacements as C, applySessionEntryCanonicalReplacements as S, purgeDeletedAgentSessionEntries as _, markSessionAbortTarget as a, inheritSessionSelection as b, updateSessionEntry as c, prepareSessionForkTranscript as d, resolveSessionParentForkDecision as f, applySessionEntryLifecycleMutation as g, cleanupPluginHostSessionStore as h, createSessionEntryWithTranscript as i, forkSessionEntryFromParentTarget as l, applySessionPatchProjections as m, commitReplySessionInitialization as n, prepareSessionEntryMutationDatabases as o, applySessionPatchProjection as p, loadReplySessionInitializationSnapshot as r, resolveSessionAbortTarget as s, SessionInitializationAgentScopeMismatchError as t, forkSessionTranscriptFromParent as u, cleanupSessionLifecycleArtifactsCore as v, selectSessionModelOverride as x, SessionLabelOwnerIndex as y };

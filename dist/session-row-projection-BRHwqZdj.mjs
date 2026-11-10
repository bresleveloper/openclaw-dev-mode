import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { _ as readAgentRunIndexVersion, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as prepareAgentDatabaseDeletionSnapshotRead } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { o as isOpenClawAgentDatabaseRegistryChange, u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { s as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as onInternalSessionTranscriptUpdate } from "./transcript-events-D3brcRJS.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { c as prepareUserProfileCatalog, o as isUserProfileCatalogReady } from "./user-profile-list-BdNJnrJe.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { d as readPreparedSessionSharingChange, l as readPreparedSessionEntryChange, u as readPreparedSessionEntryPublicationSource, x as projectSessionEntryPredicateChange } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as onSessionLifecycleEvent, r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { o as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { s as readSessionActorRowFacts } from "./session-actor-replica-D_j2y4I5.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import { o as readPreparedSessionTranscriptChange } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { l as projectionLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { s as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import { l as withPreparedSessionParticipants } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { D as getSessionRepositoryWorkspaceStore, E as findSessionRepositoryWorkspaces } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { l as selectStoredSessionLineage, s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { a as pluginStatePublication, r as capturePluginStateReadDependencies, s as pluginStateReadDependenciesAffected } from "./plugin-state-publication-CI0IKkN0.mjs";
import { r as resolveSessionParentSessionKey } from "./session-conversation-DnUQmZJM.mjs";
import { b as subscribeSubagentRunChanges, h as subagentRuns, v as getSubagentRegistryPublicationRevision } from "./subagent-registry-memory-DE7WJHOr.mjs";
import { i as createSubagentSessionListReadView } from "./subagent-registry-state-DBdy-FdI.mjs";
import { n as buildSubagentSessionListReadIndex, u as listSubagentSessionListRunsForControllers } from "./subagent-registry-read-DY0g8fGW.mjs";
import { o as withGatewaySessionStoreTarget } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as ensureSessionGroupCatalog } from "./session-group-catalog-DqTqmjvM.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-DYhQWF9T.mjs";
import { i as readSessionRuntimeOwnershipAsync, r as SessionRuntimeOwnershipChanged } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { n as buildSessionListRowMetadataContext, r as projectSessionRowChildLinks, t as buildProjectedSubagentActivity } from "./session-utils-projection-M7JDHtmu.mjs";
import { A as seedSessionRowEntries, C as physical, D as readSessionRowParents, E as readSessionRowLineage, F as materializeSessionRow, I as readSessionRowInputs, L as refreshSessionRowProfiles, M as snapshot, N as sort, O as ready, R as buildSessionSwarmSummary, S as parentReference, T as publishTranscriptFields, V as isSessionPermissionChangePending, _ as invalidateDatabaseFacts, a as acquireSessionRowEntry, b as isPrivateSourceCurrent, c as create, d as dependents, f as first, g as index, h as identity, i as withReadySessionRows, j as selectionRow, k as renewGeneration, l as createIncognitoSessionRow, m as hasEntry, n as privateSessionRowReadKey, o as canRetainSessionRowRuntimeOwnership, p as firstReferenced, r as readPreparedSessionRows, s as changesSessionRowDependents, t as SessionRowFactsPending, u as dematerialize, v as isCurrentGeneration, w as present, x as markRelated, y as isPreparedSessionRowDatabaseFacts, z as readSessionRowModelFacts } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { a as mergeCombinedSessionStore, t as applyGatewaySessionStoreAdmission } from "./combined-store-gateway-D1UQome7.mjs";
import { r as selectSessionTerminalFallbackModel, t as readSessionFallbackModel } from "./session-fallback-model-079vSBeH.mjs";
import { n as createSessionIdentityProjection } from "./session-identity-projection-sgwF_hD_.mjs";
import { t as sessionModelRevision } from "./session-model-revision-CBPmDUHh.mjs";
import { i as readPreparedGatewaySessionRowPolicy, r as readPreparedGatewayModelMetadata } from "./server-model-catalog-view-DGYC_Ub2.mjs";
import { n as buildAcpDatabaseSessionKey } from "./session-meta-keys-BWMCJN-1.mjs";
import { i as rowToAcpSessionMeta } from "./session-meta-readonly-CHaonIQO.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-nsnbR10X.mjs";
import { n as projectGatewaySessionRunState, r as resolveGatewaySessionDisplayName } from "./session-utils-display-DdkO-Qt-.mjs";
import { i as registerPreparedModelRuntimePublicationListener } from "./prepared-model-runtime.publication-events-cMcm_IYL.mjs";
import { t as prepareAcpSessionEntryRead } from "./session-meta-read-C9RqVGp2.mjs";
import { i as isFailedWorkerPlacementEnvironmentGone } from "./placement-target-BGdJpPtJ.mjs";
import { n as canRedispatchFailedWorkerPlacement } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { n as prepareCombinedSessionStoreForGatewayAsync, r as prepareCombinedSessionStoreLineage } from "./combined-store-gateway-read-CLNpi_AQ.mjs";
import { i as yieldSessionListWork, r as yieldSessionListBackgroundWork, t as createSessionProjectionDrain } from "./session-projection-work-COMF0wXd.mjs";
import { a as readWorkerPlacementIdentity, i as projectWorkerSessionPlacement, r as projectWorkerPlacementMove } from "./placement-projector-DKN6sMLO.mjs";
import { r as projectSessionActivitySummary } from "./session-activity-summary-state-Cn9tGjTi.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
//#region src/gateway/session-membership-projection.ts
const noMembership = Object.freeze([]);
const noParticipants = Object.freeze({});
function freezeFact(fact) {
	for (const participant of fact[3].participants ?? []) {
		Object.freeze(participant.identity);
		Object.freeze(participant);
	}
	if (fact[3].participants) Object.freeze(fact[3].participants);
	Object.freeze(fact[3]);
	Object.freeze(fact[2]);
	return Object.freeze(fact);
}
function compareSessionKeys(left, right) {
	const length = Math.min(left.length, right.length);
	for (let index = 0; index < length; index++) if (left.charCodeAt(index) !== right.charCodeAt(index)) return left.codePointAt(index) - right.codePointAt(index);
	return left.length - right.length;
}
/** Committed session publications are the only refresh clock for these derived facts. */
function createSessionMembershipProjection(options = {}) {
	const env = { ...options.env ?? process.env };
	let stores = /* @__PURE__ */ new Map();
	let aliases = /* @__PURE__ */ new Map();
	let disposed = false;
	let pending;
	let groups;
	const needsPreparation = () => !disposed && [...stores.values()].some((store) => store.all || store.dirty.size > 0);
	function updateTargets(targets) {
		if (disposed) return;
		const next = /* @__PURE__ */ new Map();
		const nextAliases = /* @__PURE__ */ new Map();
		for (const target of targets) {
			if (typeof target.identity !== "string") continue;
			let store = next.get(target.identity);
			if (!store) {
				const previous = stores.get(target.identity);
				store = (previous?.target.birthtime === target.birthtime ? previous : void 0) ?? {
					target: { ...target },
					revision: 0,
					initial: true,
					all: true,
					dirty: /* @__PURE__ */ new Set(),
					facts: /* @__PURE__ */ new Map()
				};
				store.target = { ...target };
				next.set(target.identity, store);
			} else if (target.discoveryAgentId != null && (store.target.discoveryAgentId == null || (target.discoveryOrder ?? Number.MAX_SAFE_INTEGER) < (store.target.discoveryOrder ?? Number.MAX_SAFE_INTEGER))) store.target = {
				...store.target,
				discoveryAgentId: target.discoveryAgentId,
				discoveryOrder: target.discoveryOrder
			};
			nextAliases.set(target.storePath, store);
			if (target.filename) nextAliases.set(target.filename, store);
		}
		stores = next;
		aliases = nextAliases;
		groups = void 0;
	}
	function matching(change) {
		if (change.storePath) {
			const store = aliases.get(change.storePath);
			return store ? [store] : [];
		}
		return stores.values();
	}
	function invalidate(change) {
		if (disposed || !("all" in change) && (change.scope === "automation" || change.scope === "acp")) return;
		if ("all" in change) {
			if (typeof change.scope === "object" && change.scope.topology && !change.factsInvalidated) return;
			if (typeof change.scope === "string") {
				if (!change.factsInvalidated && change.scope !== "stores") return;
			}
			for (const store of matching(typeof change.scope === "string" ? {} : change.scope)) {
				store.revision++;
				store.all = true;
				if (change.factsInvalidated) store.facts.clear();
			}
		} else {
			const facts = change.facts;
			const prepared = readPreparedSessionEntryChange(change, change.sessionKey);
			if (!change.factsInvalidated && (!facts || facts.kind === "unchanged" || facts.kind === "owner" || facts.kind === "acp")) return;
			for (const store of matching(change)) {
				const source = prepared?.source;
				if (source && (source.identity !== store.target.identity || source.birthtime !== store.target.birthtime || store.target.filename !== void 0 && source.filename !== store.target.filename || store.publishedSource?.incarnation === source.incarnation && store.publishedSource.revision !== void 0 && source.revision !== void 0 && store.publishedSource.revision > source.revision)) continue;
				store.revision++;
				if (!change.factsInvalidated && facts?.kind === "replacement" && prepared?.projection) {
					store.facts.set(change.sessionKey, freezeFact(structuredClone(prepared.projection.membership)));
					store.publishedSource = source;
					store.dirty.delete(change.sessionKey);
					continue;
				}
				if (change.factsInvalidated) {
					store.facts.delete(change.sessionKey);
					store.dirty.add(change.sessionKey);
					continue;
				}
				if (!facts || facts.kind === "unchanged" || facts.kind === "owner" || facts.kind === "acp") continue;
				if (facts.kind === "removed") {
					store.facts.delete(change.sessionKey);
					store.dirty.delete(change.sessionKey);
					continue;
				}
				const previous = store.facts.get(change.sessionKey);
				if (!previous || !previous[4] || store.initial || store.all || store.dirty.has(change.sessionKey) || facts.kind === "replacement" || facts.kind === "entry" && previous[4] !== facts.previousSessionId || (facts.kind === "member" || facts.kind === "category") && previous[4] !== facts.sessionId || facts.kind === "participants" && !facts.projection && facts.projectionChanged !== false) {
					store.facts.delete(change.sessionKey);
					store.dirty.add(change.sessionKey);
					continue;
				}
				let category = previous[1];
				let memberIds = previous[2];
				let participants = previous[3];
				let sessionId = previous[4];
				if (facts.kind === "entry") {
					category = facts.category;
					sessionId = facts.sessionId;
					if (facts.clearMembers) memberIds = noMembership;
				} else if (facts.kind === "member") memberIds = facts.present ? [.../* @__PURE__ */ new Set([...memberIds, facts.identityId])].toSorted(compareSessionKeys) : memberIds.filter((identity) => identity !== facts.identityId);
				else if (facts.kind === "category") category = facts.category;
				else if (facts.projection) participants = {
					...facts.projection,
					...facts.projection.participants ? { participants: facts.projection.participants.map(({ identity }) => ({ identity: { ...identity } })) } : {}
				};
				store.facts.set(change.sessionKey, freezeFact([
					change.sessionKey,
					category,
					memberIds,
					participants,
					sessionId
				]));
			}
		}
		groups = void 0;
	}
	async function refresh() {
		while (needsPreparation()) {
			const selected = [...stores.values()].filter((store) => store.all || store.dirty.size > 0);
			const requests = selected.map((store) => ({
				store,
				revision: store.revision,
				keys: store.all ? void 0 : [...store.dirty]
			}));
			const nativeReaders = retainOpenClawAgentDatabaseReadCandidates(selected.flatMap(({ target }) => [{ path: target.storePath }, ...target.filename ? [{ path: target.filename }] : []]), env);
			const continuations = [];
			try {
				for (const database of nativeReaders.databases) {
					const continuation = captureCanonicalSessionReaderContinuation(database);
					if (continuation) continuations.push(continuation);
				}
				await withSessionHistoryWorkerDatabases(selected.map(({ target }) => ({
					agentId: target.agentId,
					path: target.filename ?? target.storePath,
					env
				})), async (owners) => {
					for (const [index, request] of requests.entries()) {
						const { store, revision, keys } = request;
						const continuation = continuations.find(({ receipt }) => receipt.identity === store.target.identity && receipt.birthtime === store.target.birthtime && receipt.agentId === store.target.agentId);
						const result = await owners[index].readMembershipFacts({
							sessionKeys: keys,
							env,
							continuation: continuation?.receipt
						});
						continuation?.assertCurrent();
						if (disposed || stores.get(store.target.identity) !== store || store.revision !== revision) continue;
						if (result.identity !== void 0 && (result.identity !== store.target.identity || result.birthtime !== store.target.birthtime)) throw new Error("Session membership store changed before publication");
						if (keys === void 0) store.facts.clear();
						else for (const key of keys) store.facts.delete(key);
						for (const fact of result.facts) store.facts.set(fact[0], freezeFact(fact));
						store.initial = false;
						store.all = false;
						store.dirty.clear();
						groups = void 0;
					}
				}, projectionLane);
			} finally {
				for (const continuation of continuations.toReversed()) continuation.release();
				nativeReaders.release();
			}
		}
	}
	function prepare() {
		if (!needsPreparation()) return pending ?? Promise.resolve();
		return pending ??= refresh().then(() => {
			pending = void 0;
			return needsPreparation() ? prepare() : void 0;
		}, (error) => {
			pending = void 0;
			throw error;
		});
	}
	function membership(storePath, sessionKey) {
		const store = aliases.get(storePath);
		return !disposed && store ? store.facts.get(sessionKey)?.[2] ?? noMembership : void 0;
	}
	function ready(storePath, sessionKey) {
		const store = aliases.get(storePath);
		return Boolean(!disposed && store && !store.initial && !store.all && !store.dirty.has(sessionKey));
	}
	return {
		updateTargets,
		invalidate,
		prepare,
		membership,
		ready,
		matchesSession(storePath, sessionKey, sessionId) {
			return ready(storePath, sessionKey) && (aliases.get(storePath)?.facts.get(sessionKey)?.[4] ?? void 0) === sessionId;
		},
		get needsPreparation() {
			return needsPreparation();
		},
		withPreparedParticipantRead(consume) {
			if (disposed) throw new Error("Session membership projection is disposed");
			return withPreparedSessionParticipants((identity, sessionKey) => {
				const store = stores.get(identity);
				return store ? store.facts.get(sessionKey)?.[3] ?? noParticipants : void 0;
			}, consume);
		},
		groupTargets() {
			if (!groups) {
				const next = /* @__PURE__ */ new Map();
				const discovered = [...stores.values()].filter(({ target }) => target.discoveryAgentId !== null).toSorted((left, right) => (left.target.discoveryOrder ?? Number.MAX_SAFE_INTEGER) - (right.target.discoveryOrder ?? Number.MAX_SAFE_INTEGER));
				for (const store of discovered) for (const key of [...store.facts.keys()].toSorted(compareSessionKeys)) {
					const category = store.facts.get(key)[1];
					if (!category) continue;
					const targets = next.get(category) ?? [];
					targets.push(Object.freeze({
						sessionKey: key,
						agentId: store.target.discoveryAgentId ?? store.target.agentId
					}));
					next.set(category, targets);
				}
				for (const targets of next.values()) Object.freeze(targets);
				groups = next;
			}
			return groups;
		},
		dispose() {
			disposed = true;
			stores.clear();
			aliases.clear();
			groups = void 0;
		}
	};
}
//#endregion
//#region src/gateway/server-methods/session-placement-read-projection.ts
/** Acquire row facts once; selected rows refresh placement facts after owner publications. */
function readSessionRowFacts(params) {
	const { cfg, entry, placementFactsReader, activitySummaryEnabled } = params;
	const { key, agentId } = params.target;
	const context = params.context ?? {};
	let placementSource = placementFactsReader?.getProjectionFacts(entry.sessionId);
	const readPlacementFacts = () => {
		const { placement, move, environment, workspaceResultReconciling = false, workspaceRecoveryPending = false } = placementSource ?? {};
		const identity = placement ? readWorkerPlacementIdentity(placement, context.workerEnvironmentService, environment ?? null) : void 0;
		const failedRecoveryAction = placement?.state === "failed" ? isFailedWorkerPlacementEnvironmentGone({
			environmentService: context.workerEnvironmentService ? { get: () => environment } : void 0,
			placement
		}) ? "restart" : "stop-first" : void 0;
		const retryOnSend = placement?.state === "failed" && !move && !workspaceRecoveryPending && canRedispatchFailedWorkerPlacement(placement, environment);
		return {
			placement,
			move,
			workspaceResultReconciling,
			environment,
			identity,
			sessionModelRevision: sessionModelRevision(entry, identity?.inference),
			failedRecoveryAction,
			retryOnSend
		};
	};
	let placementFacts = readPlacementFacts();
	let activitySummaryFacts = params.databaseFacts;
	const readActivitySummary = () => {
		const summary = projectSessionActivitySummary({
			key,
			agentId,
			cfg,
			entry,
			enabled: activitySummaryEnabled,
			watermark: activitySummaryFacts.activitySummaryWatermark
		});
		return summary && Object.freeze(summary);
	};
	let activitySummary = readActivitySummary();
	let unplaced;
	return {
		hasBoard: params.databaseFacts.hasBoard,
		refreshActivitySummary(databaseFacts = activitySummaryFacts) {
			activitySummaryFacts = databaseFacts;
			activitySummary = readActivitySummary();
			unplaced = void 0;
		},
		present: () => {
			const currentSource = placementFactsReader?.getProjectionFacts(entry.sessionId);
			if (currentSource !== placementSource) {
				placementSource = currentSource;
				placementFacts = readPlacementFacts();
			}
			const { placement, move, workspaceResultReconciling, environment, identity, sessionModelRevision: revision, failedRecoveryAction, retryOnSend } = placementFacts;
			const permissionModePending = isSessionPermissionChangePending(entry.sessionId);
			if (!placement && !move) {
				if (!unplaced || unplaced.permissionModePending !== permissionModePending || unplaced.sessionModelRevision !== revision) unplaced = Object.freeze({
					sessionModelRevision: revision,
					permissionModePending,
					activitySummary
				});
				return unplaced;
			}
			return {
				sessionModelRevision: revision,
				...placement ? { placement: projectWorkerSessionPlacement(placement, context.workerPlacementDiskSpaceReader?.read(placement), context.workerPlacementRunnerAvailabilityReader?.read(placement, environment ?? null), identity, failedRecoveryAction, workspaceResultReconciling, retryOnSend, {
					startStatus: placement.environmentId ? context.workerEnvironmentService?.get(placement.environmentId)?.startStatus : void 0,
					workerRuntimeInstall: context.workerPlacementRuntimeInstallReader?.read(placement, environment ?? null)
				}) } : {},
				...move ? { placementMove: projectWorkerPlacementMove(move) } : {},
				permissionModePending,
				activitySummary
			};
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-archive.ts
const DEFAULT_ARCHIVED_MATERIALIZED_ROWS = 100;
function isColdArchivedSessionRow(row) {
	return row.entry?.archivedAt !== void 0 && !row.materialized;
}
/** Archived metadata outlives its bounded, reader-populated materialization cache. */
function createSessionRowProjectionArchive(params) {
	const materialized = /* @__PURE__ */ new Set();
	const readPins = /* @__PURE__ */ new Set();
	let limit = DEFAULT_ARCHIVED_MATERIALIZED_ROWS;
	function demote(row) {
		const id = identity(row);
		materialized.delete(id);
		params.release(id);
		const cold = dematerialize(row);
		params.put(cold);
		if (cold.unresolvedDatabaseFacts === "category") params.dirty.add(id);
		return cold;
	}
	function trim() {
		for (const id of materialized) {
			if (materialized.size <= limit) break;
			if (![...readPins].some((pins) => pins.has(id))) demote(params.rows.get(id));
		}
	}
	function markRelated$1(row, indexes, includeChildren = true) {
		const related = /* @__PURE__ */ new Set();
		markRelated(row, indexes, related, includeChildren, params.config());
		for (const id of related) {
			const current = params.rows.get(id);
			if (current && isColdArchivedSessionRow(current)) {
				if (!current.storedEntry) continue;
				const lineage = readSessionRowLineage(current, current.storedEntry, params.config(), params.context(), params.referenced);
				if (isDeepStrictEqual(current.parents, lineage.parents) && isDeepStrictEqual(current.entry, lineage.entry)) continue;
				const next = {
					...current,
					...lineage,
					pendingDatabaseFacts: void 0,
					retainedDatabaseFacts: void 0,
					databaseFactsRevision: current.databaseFactsRevision + 1
				};
				params.put(next);
				markRelated$1(current, indexes, false);
				markRelated$1(next, indexes, false);
			} else if (current) params.dirty.add(id);
		}
	}
	return {
		demote,
		markRelated: markRelated$1,
		deferAcquisition(row) {
			const id = identity(row);
			params.put(row);
			params.dirty.add(id);
		},
		invalidateRows(change, candidates) {
			const catalogOnly = change.scope === "catalog" && !change.factsInvalidated;
			for (const row of candidates) {
				if (change.factsInvalidated) params.invalidateFacts(row);
				if (change.runtimeOwnershipChanged && resolveSessionPinnedHarnessId(row.entry)) invalidateDatabaseFacts(row, row.retainedDatabaseFacts && {
					...row.retainedDatabaseFacts,
					runtimeOwnership: void 0,
					runtimeOwnershipDependencies: void 0,
					runtimeOwnershipRetryPending: void 0
				});
				if (catalogOnly && row.entry?.archivedAt === void 0) {
					if (!params.dirty.has(identity(row))) row.pendingDatabaseFacts = isPreparedSessionRowDatabaseFacts(row.retainedDatabaseFacts) ? row.retainedDatabaseFacts : void 0;
				} else {
					row.pendingDatabaseFacts = void 0;
					row.retainedDatabaseFacts = void 0;
				}
				if (row.entry?.archivedAt !== void 0) {
					const current = row.materialized ? demote(row) : row;
					if (!catalogOnly) invalidateDatabaseFacts(current);
					if (current.preparedAcpMeta === void 0 || current.hasBoard === void 0) params.dirty.add(identity(current));
					continue;
				}
				params.dirty.add(identity(row));
				if (typeof change.scope !== "string" || change.factsInvalidated || (change.scope === "config" || change.scope === "catalog") && row.entry?.fallbackNotice) params.invalidateTranscript(identity(row));
			}
		},
		setPageSize: (size) => {
			limit = Math.max(DEFAULT_ARCHIVED_MATERIALIZED_ROWS, size);
			trim();
		},
		retainRows() {
			let pins = /* @__PURE__ */ new Set();
			readPins.add(pins);
			return {
				update(ids) {
					readPins.delete(pins);
					pins = new Set(ids);
					readPins.add(pins);
					trim();
				},
				release() {
					readPins.delete(pins);
					trim();
				}
			};
		},
		forget: (id) => materialized.delete(id),
		clear() {
			materialized.clear();
			readPins.clear();
		},
		describe(row) {
			if (row?.entry?.archivedAt === void 0) return row;
			if (ready(row)) {
				const id = identity(row);
				materialized.delete(id);
				materialized.add(id);
				trim();
			}
			return row;
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-identities.ts
const isSentinel = (key) => key === "global" || key === "unknown";
/** Retain only creator facts, not superseded rows or their materialized graphs. */
function createSessionRowCreatorIndex() {
	const inOwner = AsyncLocalStorage.snapshot();
	const byCreator = /* @__PURE__ */ new Map();
	const resolved = /* @__PURE__ */ new Map();
	const dirty = /* @__PURE__ */ new Set();
	let paths;
	let disposed = false;
	function invalidate() {
		for (const id of byCreator.keys()) dirty.add(id);
	}
	return {
		update(previous, next) {
			const before = previous?.entry?.createdActor;
			const after = next?.entry?.createdActor;
			if (Boolean(previous?.entry) === Boolean(next?.entry) && before?.id === after?.id && before?.type === after?.type && before?.label === after?.label) return;
			if (isSentinel((next ?? previous).key)) invalidate();
			if (previous && before?.id) {
				const contributors = byCreator.get(before.id);
				contributors?.delete(identity(previous));
				if (!contributors?.size) {
					byCreator.delete(before.id);
					resolved.delete(before.id);
				}
				dirty.add(before.id);
			}
			if (next && after?.id) {
				let contributors = byCreator.get(after.id);
				if (!contributors) {
					contributors = /* @__PURE__ */ new Map();
					byCreator.set(after.id, contributors);
				}
				contributors.set(identity(next), {
					key: next.key,
					storePath: next.storeTarget.storePath,
					actor: {
						type: after.type,
						id: after.id,
						label: after.label
					}
				});
				dirty.add(after.id);
			}
		},
		list(selectPaths, matching) {
			const memory = captureSessionActorStorageOwner({});
			return inOwner(() => {
				const selectedPaths = selectPaths();
				if (disposed) return [];
				if (paths !== selectedPaths) {
					paths = selectedPaths;
					invalidate();
				}
				const sentinels = /* @__PURE__ */ new Set();
				for (const key of ["global", "unknown"]) {
					const winner = first(matching({ key }).filter((row) => row.entry && selectedPaths.has(row.storeTarget.storePath)), selectedPaths.keys());
					if (winner) sentinels.add(identity(winner));
				}
				const later = (candidate, previous) => !previous || selectedPaths.get(candidate.storePath) > selectedPaths.get(previous.storePath) || candidate.storePath === previous.storePath && Buffer.compare(Buffer.from(candidate.key), Buffer.from(previous.key)) > 0;
				for (const id of dirty) {
					let last;
					let labeled;
					for (const [rowId, candidate] of byCreator.get(id) ?? []) {
						if (!selectedPaths.has(candidate.storePath) || isSentinel(candidate.key) && !sentinels.has(rowId)) continue;
						if (later(candidate, last)) last = candidate;
						if (candidate.actor.label !== void 0 && later(candidate, labeled)) labeled = candidate;
					}
					if (last) resolved.set(id, {
						type: last.actor.type,
						id,
						...labeled ? { label: labeled.actor.label } : {}
					});
					else resolved.delete(id);
				}
				dirty.clear();
				return [...Array.from(resolved.values(), ({ type, id, label }) => ({
					type,
					id,
					label
				})), ...memory ? memory.owner?.listSessions(memory.authority).flatMap(({ entry }) => entry?.incognito && entry.createdActor?.id ? [entry.createdActor] : []) ?? [] : memorySessionActorOwners.list().flatMap((owner) => owner.listSessions({
					assertCurrent: owner.assertCurrent,
					authorize: owner.assertCurrent
				}).flatMap(({ entry }) => entry?.incognito && entry.createdActor?.id ? [entry.createdActor] : []))];
			});
		},
		dispose() {
			disposed = true;
			byCreator.clear();
			resolved.clear();
			dirty.clear();
			paths = void 0;
		}
	};
}
/** Capability policy consumes only the receipt-updated metadata projection. */
function createSessionRowCapabilityReader(owner) {
	return (query) => {
		const state = owner.state();
		if (state.disposed || state.topologyDirty) return;
		let row;
		if (query.key !== void 0) {
			const candidate = owner.lookup(query);
			row = candidate?.key === query.key ? candidate : void 0;
		} else {
			const sessionId = query.sessionId;
			const scope = {
				agentId: query.agentId,
				storePath: query.storePath
			};
			const exact = owner.matching({
				...scope,
				key: sessionId
			}, "id");
			const candidates = (exact.length ? exact : owner.matching(scope)).filter((candidate) => !isInternalSessionEffectsKey(candidate.key)).toSorted((left, right) => left.key < right.key ? -1 : left.key > right.key ? 1 : 0);
			if (candidates.some((candidate) => !candidate.sharingEntry)) return;
			row = candidates.find((candidate) => candidate.sharingEntry?.sessionId === sessionId) ?? candidates.find((candidate) => candidate.sharingEntry?.sessionId.trim() === sessionId);
		}
		return row && (!row.storedEntry || row.sharingEntry !== row.storedEntry) ? void 0 : { entry: row?.storedEntry };
	};
}
//#endregion
//#region src/gateway/session-row-scope.ts
/** Discover current keys in SQLite, then prepare every physical competitor before federation. */
async function readSessionRowLookup(selection, owner) {
	const stores = [...owner.stores.values()].filter((store) => owner.paths.has(store.target.storePath));
	return withSessionHistoryWorkerDatabases(stores.map((store) => ({
		...store.target,
		path: store.filename,
		env: owner.env
	})), async (readers) => {
		const keys = /* @__PURE__ */ new Set();
		for (const [index, store] of stores.entries()) {
			if (typeof store.identity !== "string") throw new Error("Session lookup requires an admitted durable store");
			const result = await readers[index].readExactEntries({
				selection,
				projection: "list",
				env: owner.env,
				expectedIdentity: {
					key: `file:${store.identity}`,
					canonicalPath: store.filename,
					birthtime: store.birthtime
				}
			});
			for (const entry of result.entries) keys.add(entry.sessionKey);
		}
		for (const reader of readers) reader.assertCurrent();
		return [...keys].flatMap((key) => owner.matching({ key }).flatMap((row) => owner.paths.has(row.storeTarget.storePath) && (!owner.agentId || row.agentId === owner.agentId) ? [{
			key,
			agentId: row.agentId,
			storePath: row.storeTarget.storePath
		}] : []));
	}, projectionLane);
}
/** Keyed publications select resident identities and admit only their named destination. */
function visitSessionRowPublicationTargets(change, owner) {
	const query = {
		...change,
		key: change.sessionKey
	};
	const exact = owner.matching(query);
	for (const previous of new Set(change.factsInvalidated === "category" ? exact : [...exact, ...owner.matching(query, "id")])) owner.publish(previous);
	if (exact.length || isInternalSessionEffectsKey(change.sessionKey) || isIncognitoSessionKey(change.sessionKey)) return;
	const matches = createSessionRowScopeMatcher(change, owner.scope);
	for (const source of owner.stores.values()) {
		const agentId = parseAgentSessionKey(change.sessionKey)?.agentId ?? source.agentId;
		const row = create({
			key: change.sessionKey,
			agentId,
			storeTarget: source.target
		});
		if (matches(row) && (change.storePath || agentId === source.agentId)) owner.publish(row);
	}
}
/** Witness repeated registrations without replacing the topology owner's discovery snapshot. */
function createSessionRowRegistryRead(owner) {
	let ready;
	let pending;
	return {
		prepare() {
			if (!owner.isActive() || ready?.stores === owner.stores()) return;
			pending ??= owner.runAsOwner(async () => {
				const stores = owner.stores();
				const captured = [...stores.values()];
				const { assertCurrent } = await prepareOpenClawAgentDatabaseRegistrySnapshotRead({
					env: owner.env,
					includeIncompatibleSchemaVersions: true
				}, (mutation, entries) => mutation.kind === "upsert" && mutation.sources.every((source) => entries?.some((entry) => entry.agentId === source.agentId && entry.schemaVersion === source.schemaVersion && (entry.path === source.path || entry.path === source.physicalPath)) && captured.some((store) => `file:${store.identity}` === source.identity && store.target.agentId === source.agentId))).read();
				if (owner.isActive() && owner.stores() === stores) ready = {
					stores,
					assertCurrent
				};
			}).finally(() => {
				pending = void 0;
			});
			return pending;
		},
		isCurrent() {
			if (!owner.isActive() || !ready || ready.stores !== owner.stores()) return false;
			try {
				ready.assertCurrent();
				return true;
			} catch {
				return false;
			}
		},
		dispose() {
			ready = void 0;
		}
	};
}
/** Early publications retain literal paths until topology has prepared their aliases. */
function createSessionRowScopeMatcher(query, scope, logicalOwnerOnly = false) {
	const paths = query.storePath ? scope?.physicalPaths(query.storePath, query.agentId) ?? [query.storePath] : void 0;
	return (row) => (!query.agentId || row.agentId === query.agentId || !logicalOwnerOnly && row.storeTarget.agentId === query.agentId) && (!paths || paths.includes(row.storeTarget.storePath));
}
function selectMatchingSessionRows(params, query, kind = "key") {
	const { rows, indexes: { byKey, byStore, byAgent }, scope } = params;
	const storePaths = !query.key && query.storePath ? scope?.physicalPaths(query.storePath, query.agentId) ?? [query.storePath] : void 0;
	const candidates = query.key ? byKey.get(`${kind}:${query.key}`) : storePaths ? storePaths.length === 1 ? byStore.get(storePaths[0]) : new Set(storePaths.flatMap((storePath) => Array.from(byStore.get(storePath) ?? []))) : query.agentId ? byAgent.get(query.agentId) : rows.keys();
	if (!candidates) return [];
	const matches = createSessionRowScopeMatcher(query, scope);
	const selected = [];
	for (const id of candidates) {
		const row = rows.get(id);
		if (row !== void 0 && matches(row)) selected.push(row);
	}
	return selected;
}
/** Resolve query-specific federation once when the physical topology is published. */
function prepareSessionRowScopes(cfg, agentIds, residentPaths, prepared) {
	const ownerAgentIds = new Set(listAgentIds(cfg));
	const residentPath = (pathname) => residentPaths.get(pathname) ?? pathname;
	const filenames = new Map([...residentPaths].map(([filename, locator]) => [locator, filename]));
	const aliases = /* @__PURE__ */ new Map();
	const capture = (options) => {
		try {
			const key = options.agentId ? `agent:${options.agentId}` : options.configuredAgentsOnly ? "configured" : "all";
			const captured = prepared.get(key);
			if (captured instanceof Error) return captured;
			const resolved = applyGatewaySessionStoreAdmission(cfg, {
				...options,
				includeIncognito: false
			}, expectDefined(captured, "prepared scope topology"));
			for (const [identity, physical] of resolved.physicalTargets) {
				const separator = identity.indexOf("\0");
				const agentId = identity.slice(0, separator);
				const locator = path.resolve(identity.slice(separator + 1));
				const owners = aliases.get(locator) ?? /* @__PURE__ */ new Map();
				owners.set(agentId, residentPath(physical.storePath));
				aliases.set(locator, owners);
			}
			const paths = resolved.durableTargets.map((target) => residentPath(expectDefined(resolved.physicalTargets.get(`${target.agentId}\0${target.storePath}`), "physical source").storePath));
			return {
				paths: new Map(paths.map((pathname, index) => [pathname, index])),
				path: paths.length === 1 ? filenames.get(paths[0]) ?? paths[0] : "(multiple)",
				configuredAgentIds: resolved.configuredAgentIds,
				ownerAgentIds,
				agentId: resolved.requestedAgentId
			};
		} catch (error) {
			return error instanceof Error ? error : new Error(String(error));
		}
	};
	const all = capture({});
	const configured = capture({ configuredAgentsOnly: true });
	const agents = new Map([.../* @__PURE__ */ new Set([...ownerAgentIds, ...agentIds])].map((agentId) => [agentId, capture({ agentId })]));
	const select = (options) => {
		const requestedAgentId = options.agentId?.trim() ? normalizeAgentId(options.agentId) : void 0;
		const scope = requestedAgentId ? agents.get(requestedAgentId) ?? {
			paths: /* @__PURE__ */ new Map(),
			path: "(multiple)",
			agentId: requestedAgentId,
			configuredAgentIds: void 0,
			ownerAgentIds
		} : options.configuredAgentsOnly ? configured : all;
		if (scope instanceof Error) throw scope;
		return scope;
	};
	return {
		select,
		physicalPaths(locator, agentId) {
			const normalized = filenames.has(locator) ? locator : residentPath(path.resolve(locator));
			const owners = aliases.get(normalized);
			return agentId ? [owners?.get(normalizeAgentId(agentId)) ?? normalized] : owners ? [...new Set(owners.values())] : [normalized];
		}
	};
}
/** Selection consumes prepared metadata in the projection's synchronous owner frame. */
function createSessionRowEntrySelector(owner) {
	const noDirtyRows = /* @__PURE__ */ new Set();
	return (query = {}, metadataPrepared = false) => {
		if (!owner.isActive()) return [];
		return owner.runAsOwner(() => {
			if (!owner.prepare()) throw new Error("Session row topology changed; prepare current facts before reading");
			const state = owner.state();
			return withAgentRosterFactsBatch(state.cfg, () => selectSessionRowEntries(metadataPrepared ? {
				...state,
				dirty: noDirtyRows
			} : state, query));
		});
	};
}
/** Select metadata before federation, visibility, and reader-only materialization. */
function selectSessionRowEntries(params, query) {
	const { cfg, scope, byAgent, byParent, rows, dirty, matching, acquire } = params;
	const matches = createSessionRowScopeMatcher(query, scope, true);
	const parent = query.parentSessionKey;
	const owner = parent && parseAgentSessionKey(parent)?.agentId;
	const agents = owner ? [owner] : query.agentId ? [query.agentId] : byAgent.keys();
	const childKeys = /* @__PURE__ */ new Set();
	if (parent) {
		const sentinel = parent === "global" || parent === "unknown";
		const references = sentinel ? byParent.keys() : [...[...agents].map((agentId) => parentReference(cfg, parent, agentId, void 0, params.referenced)), ...matching({
			...query,
			key: parent
		}).map((row) => physical(row.storeTarget.storePath, parent))];
		for (const ref of references) {
			if (sentinel && ref.slice(ref.indexOf("\0") + 1) !== parent) continue;
			for (const id of byParent.get(ref) ?? []) {
				const row = rows.get(id);
				if (row) childKeys.add(row.key);
			}
		}
	}
	const sessionIdOrKey = query.sessionIdOrKey;
	let keys = parent ? childKeys : void 0;
	if (sessionIdOrKey) {
		for (const id of dirty) {
			const row = rows.get(id);
			if (row && row.unresolvedDatabaseFacts !== "category" && matches(row)) acquire(row);
		}
		const indexed = {
			...query,
			key: sessionIdOrKey
		};
		keys = new Set([...matching(indexed, "id"), ...matching(indexed)].map((row) => row.key));
	}
	const candidates = keys ? [...keys].flatMap((key) => matching({
		...query,
		key
	})) : matching(query);
	const pending = [];
	for (const row of candidates) if (row.unresolvedDatabaseFacts === "category" && matches(row)) {
		pending.push({
			agentId: row.agentId,
			key: row.key,
			storePath: row.storeTarget.storePath
		});
		if (pending.length === 64) break;
	}
	if (pending.length > 0) throw new SessionRowFactsPending(pending);
	const acquired = sessionIdOrKey || dirty.size === 0 ? candidates : candidates.map((row) => dirty.has(identity(row)) ? acquire(row) : row);
	let selectedCount = 0;
	acquired.forEach((row) => {
		if (hasEntry(row) && matches(row)) acquired[selectedCount++] = row;
	});
	acquired.length = selectedCount;
	return sort(acquired, query.sortBy);
}
//#endregion
//#region src/gateway/session-row-projection-materialize.ts
/** Bind live projection state to the same prepared or resident source-read boundary. */
function createSessionRowModelFactsReader(params) {
	return (query, metadataPrepared = false) => {
		const row = params.lookup(query);
		if (!row?.entry) throw new Error("Session changed while preparing search facts; retry the request");
		if (ready(row) && !params.dirty.has(identity(row))) return row.materialized.source;
		if (row.preparedRuntimeOwnership === void 0) throw new Error("Native session ownership must be prepared before reading search facts");
		const state = params.state();
		return readSessionRowModelFacts({
			...state,
			...row,
			preparedModelMetadata: readPreparedGatewayModelMetadata(state.cfg),
			source: {
				entry: row.storedEntry,
				readSourceEntry: (key) => params.readSourceEntry(row, key, metadataPrepared)
			}
		});
	};
}
/** Exact descriptions use the projection's custody and materialization owners in one frame. */
function createSessionRowDescriptionReader(owner) {
	return (query, captured, repositoryWorkspace) => {
		const memory = getSessionActorStorageBinding({});
		const describe = () => {
			if (!owner.prepare()) return;
			if (captured?.preparedPrivate && (captured.key !== query.key || captured.agentId !== query.agentId || query.storePath !== void 0 && captured.storeTarget.storePath !== query.storePath)) return;
			let row = captured?.preparedPrivate ? captured : owner.lookup(query);
			if (row && isIncognitoSessionKey(row.key)) owner.materializePrivate(row, repositoryWorkspace);
			else {
				if (row && owner.dirty.has(identity(row))) {
					owner.refresh([identity(row)]);
					row = owner.lookup(query);
				}
				row = owner.describeArchived(row);
			}
			if (captured && !owner.isCurrent(captured)) return;
			if (!ready(row)) return;
			owner.preparePresentation(row);
			return row;
		};
		return owner.runInOwner(() => memory ? runWithSessionActorStorage(memory, describe) : describe());
	};
}
/** Keyed and worker-prepared refreshes share the same bounded materialization slice. */
function createSessionRowMaterializer(owner) {
	function refresh(ids, accepted = false) {
		if (!owner.isActive()) return;
		const started = performance.now();
		const cfg = owner.prepare();
		withAgentRosterFactsBatch(cfg, () => {
			const configuredAgentIds = new Set(listAgentIds(cfg));
			const activitySummaryEnabledByAgent = /* @__PURE__ */ new Map();
			const readRow = (params) => readResidentSessionRow(params, activitySummaryEnabledByAgent);
			for (const [offset, id] of ids.entries()) {
				if (offset > 0 && performance.now() - started >= 12) break;
				const current = owner.rows.get(id);
				const databaseFacts = accepted ? current?.pendingDatabaseFacts : current?.retainedDatabaseFacts;
				if (!isPreparedSessionRowDatabaseFacts(databaseFacts)) continue;
				if (!accepted && !canRetainSessionRowRuntimeOwnership(databaseFacts)) continue;
				if (!accepted && current?.unresolvedDatabaseFacts === "category") continue;
				const row = current && (accepted ? current : owner.acquireEntry(current, databaseFacts.entry));
				if (row && isColdArchivedSessionRow(row) && !accepted) {
					owner.dirty.delete(id);
					owner.forgetBackfill(id);
					continue;
				}
				if (row && owner.materialize(row, configuredAgentIds, readRow, databaseFacts)) {
					row.pendingDatabaseFacts = void 0;
					row.retainedDatabaseFacts = databaseFacts;
					owner.dirty.delete(id);
					if (accepted && ready(row) && row.entry.archivedAt !== void 0) owner.retainArchived(row);
				}
			}
		});
	}
	return {
		refresh,
		refreshPending(ids) {
			const pending = ids.filter((id) => owner.rows.get(id)?.pendingDatabaseFacts);
			if (pending.length === 0) return false;
			refresh(pending, true);
			return true;
		},
		accept(ids, facts, options = {}) {
			if (!owner.isActive()) return;
			const cfg = owner.prepare();
			withAgentRosterFactsBatch(cfg, () => {
				for (const id of ids) {
					const current = owner.rows.get(id);
					const databaseFacts = facts.get(id);
					const row = current && owner.acquireEntry(databaseFacts ? {
						...current,
						hasBoard: databaseFacts.hasBoard,
						unresolvedDatabaseFacts: void 0
					} : current, databaseFacts?.entry);
					if (row && databaseFacts) {
						row.preparedAcpMeta = databaseFacts.acpMeta;
						row.preparedRuntimeOwnership = databaseFacts.runtimeOwnership;
						row.runtimeOwnershipDependencies = databaseFacts.runtimeOwnershipDependencies;
					}
					if (row && isColdArchivedSessionRow(row) && !options.archived) {
						owner.dirty.delete(id);
						owner.forgetBackfill(id);
					} else if (row) {
						row.pendingDatabaseFacts = databaseFacts;
						row.retainedDatabaseFacts = databaseFacts;
					}
				}
			});
			if (options.materialize !== false) refresh(ids, true);
		}
	};
}
/** Resident rows consume committed metadata; optional transcript work has a separate budget. */
function readResidentSessionRow(params, activitySummaryEnabledByAgent) {
	const { row, cfg, context } = params;
	row.privateSource?.assertCurrent();
	const prepared = row.preparedPrivate;
	if (!prepared && isIncognitoSessionKey(row.key)) throw new Error("Incognito session descriptions require awaited row preparation");
	const databaseFacts = params.databaseFacts ?? prepared?.databaseFacts;
	if (!databaseFacts) throw new Error("Session rows require prepared database facts");
	const { inputs, presentation } = readSessionRowInputs({
		...row,
		cfg,
		preparedAcpMeta: databaseFacts.acpMeta,
		preparedRuntimeOwnership: databaseFacts.runtimeOwnership,
		preparedModelMetadata: readPreparedGatewayModelMetadata(cfg),
		preparedRepositoryWorkspace: databaseFacts.repositoryWorkspace,
		configuredAgentIds: params.configuredAgentIds,
		store: prepared?.entries ?? {},
		storePath: row.storeTarget.storePath,
		storeAgentId: row.storeTarget.agentId,
		active: prepared ? void 0 : false,
		activeModel: prepared ? void 0 : row.fallbackModel ?? null,
		terminalModel: prepared ? prepared.terminalModel ?? null : void 0,
		modelCatalog: params.modelCatalog,
		modelSource: {
			entry: row.storedEntry,
			readSourceEntry: prepared ? (key) => prepared.entries[key] : params.readSourceEntry
		},
		rowContext: context,
		preparedTitle: {
			derivedTitle: deriveSessionTitle(row.entry, prepared?.titleFields?.firstUserMessage, resolveGatewaySessionDisplayName(row.key, row.entry)),
			lastMessagePreview: prepared?.titleFields?.lastMessagePreview ?? row.lastMessagePreview
		},
		skipTranscriptUsageFallback: true,
		includeSwarmChildren: true,
		childLinks: prepared ? void 0 : params.links
	});
	inputs.subagentRunInputs = params.subagentInputs;
	const materialized = materializeSessionRow(inputs);
	let activitySummaryEnabled;
	if (activitySummaryEnabledByAgent && row.entry.sessionId && !row.entry.initializationPending) {
		activitySummaryEnabled = activitySummaryEnabledByAgent.get(row.agentId);
		if (activitySummaryEnabled === void 0) {
			activitySummaryEnabled = Boolean(resolveUtilityModelRefForAgent({
				cfg,
				agentId: row.agentId
			}));
			activitySummaryEnabledByAgent.set(row.agentId, activitySummaryEnabled);
		}
	}
	const facts = readSessionRowFacts({
		cfg,
		target: row,
		entry: row.entry,
		context: params.gatewayContext,
		placementFactsReader: params.placementFactsReader,
		activitySummaryEnabled,
		databaseFacts
	});
	row.privateSource?.assertCurrent();
	return {
		materialized,
		preparedAcpMeta: materialized.source.thinkingProjection.acpMeta ?? null,
		fallbackModel: presentation.activeModel,
		facts,
		hasBoard: facts.hasBoard,
		membership: row.membership
	};
}
function readSessionRowEntry(row) {
	if (isIncognitoSessionKey(row.key)) {
		const source = row.privateSource;
		if (!source) throw new Error("Incognito session rows require their actor source");
		const memory = captureSessionActorStorageOwner({
			...row.storeTarget,
			sessionKey: row.key
		}, {
			assertCurrent: () => source.assertCurrent(),
			authorize: () => source.assertCurrent()
		});
		return memory?.owner?.readSession(row.key, memory.authority)?.entry;
	}
	const facts = row.pendingDatabaseFacts ?? row.retainedDatabaseFacts;
	if (facts) return facts.entry;
	const { key, agentId, storeTarget } = row;
	throw new SessionRowFactsPending([{
		key,
		agentId,
		storePath: storeTarget.storePath
	}]);
}
/** Exact incognito acquisition never admits an ephemeral store to the resident roster. */
function readIncognitoSessionRow(params) {
	const { key, agentId, storePath } = params;
	const memory = captureSessionActorStorageOwner({
		agentId,
		sessionKey: key,
		storePath
	}, {
		assertCurrent: params.assertCurrent,
		authorize: params.assertCurrent
	});
	const current = memory?.owner?.readSession(key, memory.authority);
	if (!current?.entry || !memory) return;
	const assertSessionCurrent = memory.owner?.captureSessionReadGuard(key);
	return createIncognitoSessionRow({
		...params,
		storePath: memory.path,
		entry: current.entry,
		membership: new Set(current.members.map((member) => member.identityId)),
		source: {
			identity: current.version.epoch,
			assertCurrent() {
				assertSessionCurrent?.();
				memory.binding?.actor.assertReadable();
				memory.authority.assertCurrent();
			}
		}
	});
}
/** Bind discovery and resident identity reads to the projection's current owner. */
function createSessionRowLookup(owner) {
	return {
		readCapabilityEntry: createSessionRowCapabilityReader(owner),
		async readLookup(selection, agentId) {
			const selected = owner.state();
			return {
				queries: await owner.runInOwner(() => readSessionRowLookup(selection, {
					agentId: selected.scope.select({ agentId }).agentId,
					env: owner.env,
					stores: selected.stores,
					paths: selected.scope.select({ agentId }).paths,
					matching: owner.matching
				})),
				isCurrent: () => {
					const current = owner.state();
					return !current.disposed && !current.topologyDirty && current.scope === selected.scope && current.cfg === selected.cfg;
				}
			};
		},
		capture(query) {
			const row = owner.lookup(query);
			const state = owner.state();
			return row && row.unresolvedDatabaseFacts !== "category" && !state.topologyDirty && !row.entry && row.storedEntry !== void 0 && row.unresolvedDatabaseFacts !== true && state.registryPrepared ? owner.acquireEntry(row, row.storedEntry) ?? row : row;
		},
		findBySessionId(query) {
			const { disposed, scope } = owner.state();
			return findSessionRowById(query, {
				disposed,
				assertCurrent: owner.assertCurrent,
				scope,
				lookup: owner.lookup,
				matching: owner.matching
			});
		}
	};
}
/** Resident identities use indexes; private identities remain exact process-local reads. */
function findSessionRowById(query, owner) {
	if (owner.disposed) return [];
	const memory = captureSessionActorStorageOwner(query, {
		assertCurrent: owner.assertCurrent,
		authorize: owner.assertCurrent
	});
	if (memory && query.agentId && query.storePath) {
		const key = (memory.owner?.listSessions(memory.authority).find((current) => current.entry?.sessionId === query.sessionId))?.target.sessionKey;
		if (!key || query.federated && isInternalSessionEffectsKey(key)) return [];
		const row = owner.lookup({
			...query,
			agentId: memory.agentId,
			key
		});
		return row?.entry?.sessionId === query.sessionId && (!query.federated || row.entry.incognito === true) ? [row] : [];
	}
	const candidates = owner.matching({
		...query,
		key: query.sessionId
	}, "id");
	if (!query.federated) return candidates;
	const selected = [...new Set(candidates.map((row) => row.key))].flatMap((key) => {
		const paths = owner.scope.select(query).paths;
		const row = first(owner.matching({
			...query,
			key
		}).filter((candidate) => paths.has(candidate.storeTarget.storePath)), paths.keys());
		return row?.entry?.sessionId === query.sessionId ? [row] : [];
	});
	const privateStores = memory ? [{
		agentId: memory.agentId,
		storePath: memory.path
	}] : memorySessionActorOwners.list().map((memoryOwner) => ({
		agentId: memoryOwner.agentId,
		storePath: memoryOwner.path
	}));
	for (const store of privateStores) if ((!query.agentId || query.agentId === store.agentId) && (!query.storePath || query.storePath === store.storePath)) selected.push(...findSessionRowById({
		...query,
		...store
	}, owner));
	return selected;
}
function lookupSessionRow(query, owner) {
	const { agentId } = query;
	const paths = query.storePath ? owner.scope?.physicalPaths(query.storePath, agentId) ?? [query.storePath] : void 0;
	let key = query.key;
	do {
		const candidates = owner.byKey.get(`key:${key}`);
		if (candidates) for (const storePath of paths ?? owner.stores.keys()) for (const id of candidates) {
			const row = owner.rows.get(id);
			if (row?.agentId === agentId && row.storeTarget.storePath === storePath) return row;
		}
		if (key !== query.key) break;
		key = resolveStoredSessionKeyForAgentStore({
			cfg: owner.cfg,
			sessionKey: key,
			agentId
		});
		if (isIncognitoSessionKey(key)) return readIncognitoSessionRow({
			assertCurrent: owner.assertCurrent,
			cfg: owner.cfg,
			key,
			agentId,
			storePath: query.storePath
		});
	} while (key !== query.key);
}
//#endregion
//#region src/gateway/session-row-membership-read.ts
/** Inodes can be reused after deletion; aliases share only the same file generation. */
function findStoreGeneration(stores, storePath, database) {
	const matches = (store) => store.identity === database.identity && store.birthtime === database.birthtime;
	const previous = stores.get(storePath);
	return previous && matches(previous) ? previous : [...stores.values()].find(matches);
}
/** Reconciliation outlives display residency; exact reads consume bounded, fixed key batches. */
function createSessionRowFactsReadiness(rows, owner) {
	const categories = /* @__PURE__ */ new Set();
	const structural = /* @__PURE__ */ new Map();
	function track(row, domain) {
		const id = identity(row);
		if (domain === "category") categories.add(id);
		else categories.delete(id);
		const path = row.storeTarget.storePath;
		let current = structural.get(path);
		if (domain === true) {
			current ??= /* @__PURE__ */ new Set();
			current.add(id);
			structural.set(path, current);
		} else if (current?.delete(id) && current.size === 0) structural.delete(path);
	}
	return {
		track,
		invalidate(row, domain) {
			const next = row.unresolvedDatabaseFacts === true ? true : domain;
			row.unresolvedDatabaseFacts = next;
			if (rows.has(identity(row))) track(row, next);
			return next === "category";
		},
		conservativeChange(change, physicalPaths) {
			if (!("all" in change) && change.factsInvalidated === "category" && structural.size > 0 && (!change.storePath || physicalPaths(change.storePath).some((path) => structural.has(path)))) return {
				all: true,
				scope: { storePath: change.storePath },
				factsInvalidated: true
			};
			return change;
		},
		needsPreparation: () => categories.size > 0,
		async prepare() {
			const queries = [];
			for (const id of categories) {
				const row = rows.get(id);
				queries.push({
					agentId: row.agentId,
					key: row.key,
					storePath: row.storeTarget.storePath
				});
				if (queries.length === 64) break;
			}
			if (queries.length > 0) await withReadySessionRows(owner(), () => queries, () => void 0);
		},
		clear() {
			categories.clear();
			structural.clear();
		}
	};
}
/** Readiness and synchronous sharing selection share the resident row owner's lifetime. */
function createSessionRowMembershipReadAccess(params) {
	const { membership } = params;
	const needsMembershipFactsPreparation = () => params.isActive() && (params.topologyDirty() || membership.needsPreparation);
	const needsMembershipPreparation = () => needsMembershipFactsPreparation() || params.isActive() && params.needsRowFactsPreparation();
	async function prepareMembershipFacts() {
		do {
			if (params.isActive() && params.topologyDirty()) await params.runInOwner(params.topology);
			if (!params.isActive()) return;
			if (params.topologyDirty()) continue;
			await params.runInOwner(() => membership.prepare());
		} while (needsMembershipFactsPreparation());
	}
	const sharingTarget = (query) => {
		if (!params.isActive() || params.topologyDirty() || isIncognitoSessionKey(query.key)) return null;
		const row = params.lookup(query);
		const entry = row?.sharingEntry;
		return row && entry ? {
			agentId: row.agentId,
			generation: row.generation,
			canonicalKey: row.key,
			entry,
			storeKey: row.key,
			storeKeys: [row.key],
			storePath: row.storeTarget.storePath
		} : null;
	};
	return {
		readMembership(query) {
			if (!params.isActive()) return;
			const row = params.lookup(query);
			if (row && isIncognitoSessionKey(row.key)) return params.owner().describe(query)?.membership;
			const members = row && membership.membership(row.storeTarget.storePath, row.key);
			return members ? new Set(members) : void 0;
		},
		readSource(target) {
			const row = "storeTarget" in target ? target : params.lookup(target);
			if (!row) throw new Error("Session store changed while preparing authorization");
			if (isIncognitoSessionKey(row.key)) return;
			const source = params.stores().get(row.storeTarget.storePath);
			if (!source || !params.owner().isCurrent(row)) throw new Error("Session store changed while preparing authorization");
			return {
				agentId: source.target.agentId,
				path: source.filename,
				databaseIdentity: source.identity,
				databaseBirthtime: source.birthtime
			};
		},
		prepareMembershipFacts,
		async prepareMembership() {
			do {
				await prepareMembershipFacts();
				if (!params.isActive()) return;
				await params.runInOwner(params.prepareRowFacts);
			} while (needsMembershipPreparation());
		},
		needsMembershipPreparation,
		sessionGroupTargets() {
			if (!params.isActive() || params.topologyDirty() || membership.needsPreparation) throw new Error("Session group membership changed; prepare current facts before reading");
			return membership.groupTargets();
		},
		sharingTarget,
		/** Refresh uncertainty fences effects but does not retire a shared session resource. */
		sharingTargetState(query) {
			if (!params.isActive() || isIncognitoSessionKey(query.key)) return { status: "missing" };
			if (params.topologyDirty()) return { status: "pending" };
			const target = sharingTarget(query);
			if (!target) return { status: "missing" };
			if (params.lookup(query)?.unresolvedDatabaseFacts === "category" || !membership.ready(target.storePath, target.storeKey)) return { status: "pending" };
			return {
				status: "ready",
				target
			};
		},
		hasMembership: (storePath, key, identity) => membership.membership(storePath, key)?.includes(identity) ?? false,
		needsExactMembershipPreparation(queries) {
			if (params.topologyDirty()) return true;
			if (!membership.needsPreparation) return false;
			return queries(params.owner().state.cfg).some((query) => {
				if (isIncognitoSessionKey(query.key)) return false;
				const row = params.lookup(query);
				return row !== void 0 && !membership.ready(row.storeTarget.storePath, row.key);
			});
		}
	};
}
/** Replacements retire their grants before new committed sharing metadata becomes visible. */
function createSessionRowEntryReadAccess(membership) {
	const invalidateRowMembership = (row) => {
		if (!membership.matchesSession(row.storeTarget.storePath, row.key, void 0)) membership.invalidate({
			agentId: row.agentId,
			storePath: row.storeTarget.storePath,
			sessionKey: row.key,
			factsInvalidated: true
		});
		row.membership = /* @__PURE__ */ new Set();
	};
	const readSessionRowEntry$1 = (row) => {
		if (row.publishedSource && row.storedEntry && row.sharingEntry === row.storedEntry) return row.storedEntry;
		const entry = membership.withPreparedParticipantRead(() => readSessionRowEntry(row));
		if (row.storedEntry && row.storedEntry.sessionId !== entry?.sessionId && !membership.matchesSession(row.storeTarget.storePath, row.key, entry?.sessionId)) invalidateRowMembership(row);
		return entry;
	};
	return {
		invalidateRowMembership,
		readSessionRowEntry: readSessionRowEntry$1,
		createStoreRead: (params) => {
			const { stores, rows, byStore } = params;
			const sources = /* @__PURE__ */ new Map();
			const replaced = /* @__PURE__ */ new Set();
			return {
				sources,
				replaced,
				async loadCombinedStore(cfg, discovery, consume) {
					const options = {
						discovery,
						includeIncognito: false,
						preserveSentinelOwners: "physical"
					};
					const { prepared: preparedStore, scopes } = await prepareCombinedSessionStoreForGatewayAsync(cfg, options, [.../* @__PURE__ */ new Set([...listAgentIds(cfg), ...[...rows.values()].map((row) => row.agentId)])]);
					const captures = preparedStore.reads.flatMap(({ storeTarget: physical }) => {
						const file = readDatabasePathIdentitySync(physical.storePath);
						if (!file.key.startsWith("file:")) return [];
						const identity = file.key.slice(5);
						const previous = findStoreGeneration(stores, physical.storePath, {
							identity,
							birthtime: file.birthtime
						});
						let entries;
						if (previous) {
							entries = [];
							for (const id of byStore.get(previous.target.storePath) ?? []) {
								const row = rows.get(id);
								const entry = row?.storedEntry ?? row?.pendingDatabaseFacts?.entry ?? row?.retainedDatabaseFacts?.entry;
								if (!row || !entry) {
									entries = void 0;
									break;
								}
								entries.push({
									sessionKey: row.key,
									entry
								});
							}
						}
						return [{
							target: physical,
							file,
							previous: entries ? previous : void 0,
							entries
						}];
					});
					return await withSessionHistoryWorkerDatabases(captures.map(({ target, file }) => ({
						agentId: target.agentId,
						path: file.canonicalPath,
						requestedPaths: [target.storePath],
						env: params.env
					})), async (owners) => {
						const entries = /* @__PURE__ */ new Map();
						for (const [index, { target, file, previous, entries: capturedEntries }] of captures.entries()) {
							const prepared = previous ? void 0 : await owners[index].readStoreProjection({
								env: { ...params.env ?? process.env },
								expectedIdentity: file
							});
							const source = previous ?? prepared?.source;
							if (!source) continue;
							sources.set(target.storePath, {
								target,
								agentId: previous?.agentId ?? target.agentId,
								discoveryAgentId: null,
								identity: source.identity,
								birthtime: source.birthtime,
								filename: source.filename
							});
							if (prepared) {
								replaced.add(target.storePath);
								entries.set(target.storePath, prepared.entries);
							} else if (capturedEntries) entries.set(target.storePath, capturedEntries);
						}
						for (const [index, { target, file }] of captures.entries()) {
							owners[index].assertCurrent();
							assertExistingDatabaseIdentity(target.storePath, file.key, file.birthtime);
						}
						const readEntries = (target) => entries.get(target.storePath) ?? [];
						const lineage = await prepareCombinedSessionStoreLineage(cfg, preparedStore, readEntries);
						return consume(() => mergeCombinedSessionStore(cfg, {
							...options,
							onStoreLoaded(target, agentId, owner) {
								const source = sources.get(target.storePath);
								if (source) {
									source.agentId = agentId;
									source.discoveryAgentId = owner?.agentId ?? null;
									source.discoveryOrder = owner?.order;
								}
							}
						}, preparedStore, readEntries, lineage, lineage.readIncognitoEntries), scopes);
					}, projectionLane);
				},
				updateMembership() {
					membership.updateTargets([...sources.values()].map((source) => ({
						agentId: source.target.agentId,
						storePath: source.target.storePath,
						discoveryAgentId: source.discoveryAgentId,
						discoveryOrder: source.discoveryOrder,
						identity: source.identity,
						birthtime: source.birthtime,
						filename: source.filename
					})));
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-memory.ts
/** Private rows are detached display facts; membership is read at presentation. */
async function withMemorySessionRows(binding, cfg, queries, consume, env) {
	let active = true;
	const assertActive = () => {
		if (!active) throw new Error("Memory row consumer is no longer active");
	};
	const authority = binding?.authority ?? {
		assertCurrent: assertActive,
		authorize: assertActive
	};
	const releases = [];
	const presentations = [];
	try {
		for (const query of queries) {
			if (!isIncognitoSessionKey(query.key)) continue;
			const namespace = captureSessionActorStorageOwner({
				...query,
				sessionKey: query.key,
				sessionActor: binding,
				env
			}, authority);
			const { owner } = namespace;
			const direct = binding && query.agentId === binding.agentId && query.key === binding.actor.target.sessionKey;
			const actor = direct ? binding.actor : await owner?.acquireExisting(query.key, {
				assertCurrent: () => binding?.actor.assertReadable(),
				assertReadable: () => binding?.actor.assertReadable()
			});
			if (!actor) {
				presentations.push({
					...query,
					present: () => void 0,
					relatedRows: {},
					durable: []
				});
				continue;
			}
			if (!direct) releases.push(() => actor.release());
			const selected = {
				actor,
				authority,
				agentId: namespace.agentId,
				path: namespace.path
			};
			const assertCurrent = () => {
				assertActive();
				actor.assertReadable();
				authority.assertCurrent();
			};
			await runWithSessionActorStorage(selected, async () => {
				const snapshot = actor.snapshot(authority);
				if (!snapshot?.entry) {
					presentations.push({
						...query,
						present: () => void 0,
						relatedRows: {},
						durable: []
					});
					return;
				}
				const entry = snapshot.entry;
				const acp = await prepareAcpSessionEntryRead({
					cfg,
					env,
					sessionKey: query.key,
					agentId: selected.agentId,
					assertCurrent
				});
				if (!acp) throw new Error("Memory session row requires its selected ACP reader");
				releases.push(() => acp.release());
				const runtime = await capturePluginStateReadDependencies(() => readSessionRuntimeOwnershipAsync({
					config: cfg,
					agentId: selected.agentId,
					sessionKey: query.key,
					storePath: selected.path,
					sessionEntry: entry,
					readPreparedPreviousSessionId: () => entry.previousSessionId,
					assertCurrent
				}));
				releases.push(runtime.release);
				const workspaces = entry.repositoryWorkspaceId ? await findSessionRepositoryWorkspaces([{
					agentId: selected.agentId,
					sessionKey: query.key
				}], {
					env,
					path: resolveOpenClawStateSqlitePath(env)
				}) : [];
				const title = actor.storage.readCurrent({
					type: "session.history.title",
					input: { sessionId: entry.sessionId }
				}, authority);
				const tail = entry.status === "done" && entry.lastRunId && entry.fallbackNotice ? actor.storage.readCurrent({
					type: "session.history.bounded-tail",
					input: {
						sessionId: entry.sessionId,
						options: {
							maxBytes: 262144,
							maxMessages: 1,
							offset: 0,
							readOnly: true
						}
					}
				}, authority) : void 0;
				const facts = {
					sessionKey: query.key,
					entry,
					hasBoard: snapshot.hasBoard,
					activitySummaryWatermark: readSessionActivitySummary(entry) ? snapshot.transcript.watermark : void 0,
					acpMeta: acp.session?.acp ?? null,
					runtimeOwnership: runtime.value ?? null,
					runtimeOwnershipDependencies: runtime.dependencies,
					repositoryWorkspace: workspaces.find((workspace) => workspace.workspaceId === entry.repositoryWorkspaceId) ?? null
				};
				const relatedRows = {};
				const relatedKeys = /* @__PURE__ */ new Set([entry.parentSessionKey || resolveSessionParentSessionKey(query.key), ...listSubagentSessionListRunsForControllers([query.key]).map((run) => run.childSessionKey)]);
				for (const related of owner?.listSessions(authority) ?? []) {
					if (!related.entry || related.target.sessionKey === query.key) continue;
					const key = related.target.sessionKey;
					if (related.entry.parentSessionKey === query.key || relatedKeys.has(key)) relatedRows[key] = {
						key,
						agentId: selected.agentId,
						storeTarget: {
							agentId: selected.agentId,
							storePath: selected.path
						},
						entry: related.entry
					};
				}
				for (const key of relatedKeys) {
					if (!key || !isIncognitoSessionKey(key) || relatedRows[key]) continue;
					const relatedOwner = captureSessionActorStorageOwner({
						sessionKey: key,
						sessionActor: binding,
						env
					}, authority);
					const related = relatedOwner.owner?.readSession(key, authority);
					if (related?.entry) relatedRows[key] = {
						key,
						agentId: relatedOwner.agentId,
						storeTarget: {
							agentId: relatedOwner.agentId,
							storePath: relatedOwner.path
						},
						entry: related.entry
					};
				}
				const durable = [...relatedKeys].flatMap((key) => key && key !== query.key && !isIncognitoSessionKey(key) && !relatedRows[key] ? [{
					key,
					agentId: parseAgentSessionKey(key)?.agentId ?? selected.agentId,
					preserveQualifiedAddress: true
				}] : []);
				const parent = entry.parentSessionKey || resolveSessionParentSessionKey(query.key);
				const durableParent = durable.find((target) => target.key === parent);
				if (durableParent) durable.push({
					...durableParent,
					preserveQualifiedAddress: false
				});
				presentations.push({
					key: query.key,
					agentId: selected.agentId,
					relatedRows,
					durable,
					present() {
						acp.assertCurrent();
						runtime.assertCurrent();
						const current = actor.snapshot(authority);
						if (!current?.entry) return;
						return createIncognitoSessionRow({
							cfg,
							key: query.key,
							agentId: selected.agentId,
							storePath: selected.path,
							entry: current.entry,
							membership: new Set(current.members.map((member) => member.identityId)),
							source: {
								identity: snapshot.version.epoch,
								assertCurrent
							},
							prepared: {
								databaseFacts: {
									...facts,
									entry: current.entry
								},
								relatedRows,
								titleFields: title.fields,
								terminalModel: selectSessionTerminalFallbackModel(entry, tail?.events[0]?.event)
							}
						});
					}
				});
			});
		}
		const finish = () => {
			const result = consume(new Map(presentations.map((row) => [JSON.stringify([row.agentId, row.key]), row.present()])));
			if (isPromiseLike(result)) {
				Promise.resolve(result).catch(() => void 0);
				throw new Error("Incognito row consumers must remain synchronous");
			}
			return result;
		};
		const durable = presentations.flatMap((row) => row.durable.map((target) => ({
			row,
			target
		})));
		const [first, ...rest] = durable;
		if (!first) return finish();
		return await withGatewaySessionStoreTarget({
			cfg,
			env,
			...first.target,
			relatedKeys: rest.map(({ target }) => target),
			projection: "list",
			ordered: true
		}, (target, _membership, assertCurrent, relatedTargets) => {
			assertCurrent();
			for (const [index, selected] of [target, ...relatedTargets].entries()) {
				const { row, target: requested } = durable[index];
				const entry = selected.store[selected.canonicalKey];
				if (entry && !row.relatedRows[requested.key]) row.relatedRows[requested.key] = {
					key: selected.canonicalKey,
					agentId: selected.agentId,
					storeTarget: {
						agentId: selected.agentId,
						storePath: selected.storePath
					},
					entry
				};
			}
			return finish();
		});
	} finally {
		active = false;
		for (const release of releases.toReversed()) await release();
	}
}
//#endregion
//#region src/gateway/session-row-projection-read.ts
/** Private rows borrow existing memory owners through synchronous presentation. */
function withBoundIncognitoSessionRows(cfg, queries, consume, environment = process.env) {
	const env = {
		...environment,
		OPENCLAW_STATE_DIR: resolveStateDir(environment)
	};
	return withMemorySessionRows(getSessionActorStorageBinding({}), cfg, queries, consume, env);
}
//#endregion
//#region src/gateway/session-row-placement-projection.ts
const MAX_CONCURRENT_PLACEMENT_READS = 2;
const MAX_COALESCED_PLACEMENT_IDS = 256;
const MAX_COALESCED_PLACEMENT_BYTES = 65536;
/** Placement facts share the resident row lifecycle; private exact reads retain only their frame. */
function createSessionRowPlacementProjection(reader, prepareReadFacts, inputEnv = process.env) {
	const env = captureSessionTranscriptStorageEnvironment(inputEnv);
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const resident = /* @__PURE__ */ new Map();
	const registered = /* @__PURE__ */ new Set();
	const dirty = /* @__PURE__ */ new Set();
	let exact;
	let disposed = false;
	const activeReads = /* @__PURE__ */ new Set();
	const queuedReads = [];
	const reads = /* @__PURE__ */ new Set();
	let retainedInputBytes = 0;
	const invalidateReads = (id) => {
		for (const read of reads) {
			if (!read.started) continue;
			if (id === void 0) read.staleAll = true;
			else if (read.ids.has(id)) read.stale.add(id);
		}
	};
	const releaseRead = (read) => {
		if (read.settled && read.readers === 0 && reads.delete(read)) retainedInputBytes -= read.inputBytes;
	};
	function dispatchQueuedReads() {
		while (queuedReads.length && activeReads.size < MAX_CONCURRENT_PLACEMENT_READS) {
			const batch = queuedReads.shift();
			batch.started = true;
			activeReads.add(batch);
			runRead(batch);
		}
	}
	async function runRead(batch) {
		try {
			if (disposed || !reader) throw new Error("Session row projection is no longer active");
			batch.snapshot = await inOwnerContext(() => reader.readProjection([...batch.ids]));
			batch.completion.resolve(batch.snapshot);
		} catch (error) {
			batch.completion.reject(error);
		} finally {
			batch.settled = true;
			activeReads.delete(batch);
			releaseRead(batch);
			dispatchQueuedReads();
		}
	}
	const acquireRead = (ids, kind, privateSessions = /* @__PURE__ */ new Map()) => {
		if (disposed) throw new Error("Session row projection is no longer active");
		const covers = (batch) => batch.kind === kind && !batch.staleAll && ids.every((id) => batch.ids.has(id) && !batch.stale.has(id)) && [...privateSessions].every(([key, target]) => {
			const previous = batch.privateSessions.get(key);
			return previous?.sessionId === target.sessionId && previous.storeTarget.agentId === target.storeTarget.agentId && previous.storeTarget.storePath === target.storeTarget.storePath;
		});
		let read = [...activeReads].find(covers) ?? queuedReads.find(covers);
		let addedBytes = 0;
		if (!read) {
			const tail = queuedReads.at(-1);
			if (tail?.kind === kind && ids.length <= MAX_COALESCED_PLACEMENT_IDS) {
				let count = tail.ids.size;
				for (const id of ids) if (!tail.ids.has(id)) {
					count++;
					addedBytes += 6 * id.length + 3;
				}
				if (count <= MAX_COALESCED_PLACEMENT_IDS && tail.inputBytes + addedBytes <= MAX_COALESCED_PLACEMENT_BYTES) read = tail;
			}
		}
		if (!read) {
			if (reads.size >= 128) throw new WorkerTaskError("Placement read capacity reached", "overloaded");
			addedBytes = 2;
			for (const id of ids) {
				addedBytes += 6 * id.length + 3;
				if (retainedInputBytes + addedBytes > 268435456) throw new WorkerTaskError("Placement read capacity reached", "overloaded");
			}
		}
		if (retainedInputBytes + addedBytes > 268435456) throw new WorkerTaskError("Placement read capacity reached", "overloaded");
		if (!read) {
			const batch = {
				kind,
				ids: /* @__PURE__ */ new Set(),
				privateSessions: /* @__PURE__ */ new Map(),
				inputBytes: 0,
				stale: /* @__PURE__ */ new Set(),
				staleAll: false,
				started: false,
				settled: false,
				readers: 0,
				completion: createDeferredCore()
			};
			read = batch;
			queuedReads.push(batch);
			reads.add(batch);
			queueMicrotask(dispatchQueuedReads);
		}
		if (!read.started) {
			for (const id of ids) read.ids.add(id);
			for (const [key, id] of privateSessions) read.privateSessions.set(key, id);
			read.inputBytes += addedBytes;
			retainedInputBytes += addedBytes;
		}
		read.readers++;
		return {
			result: read.completion.promise,
			isCurrent: (id) => read.ids.has(id) && !read.staleAll && !read.stale.has(id),
			release() {
				read.readers--;
				releaseRead(read);
			}
		};
	};
	const select = (snapshot, id) => {
		const placement = snapshot.placements.get(id);
		return {
			placement,
			move: snapshot.moves.get(id),
			environment: placement?.environmentId ? snapshot.environments.get(placement.environmentId) : void 0,
			workspaceResultReconciling: snapshot.workspaceResultReconcilingSessionIds.has(id),
			workspaceRecoveryPending: snapshot.workspaceRecoveryPendingSessionIds.has(id)
		};
	};
	const missing = (ids) => reader ? [...new Set(ids)].filter((id) => !resident.has(id)) : [];
	const owner = {
		getProjectionFacts: (id) => exact?.get(id) ?? resident.get(id),
		isPrepared: (id) => !reader || exact?.has(id) === true || resident.has(id),
		get needsPreparation() {
			return !disposed && dirty.size > 0;
		},
		register(id) {
			if (!reader || registered.has(id)) return;
			registered.add(id);
			let prepared = exact?.get(id);
			if (!prepared) {
				for (const read of reads) if (read.snapshot && !read.staleAll && read.ids.has(id) && !read.stale.has(id)) {
					prepared = select(read.snapshot, id);
					break;
				}
			}
			if (prepared) resident.set(id, prepared);
			else dirty.add(id);
		},
		forget(id) {
			invalidateReads(id);
			registered.delete(id);
			dirty.delete(id);
			resident.delete(id);
		},
		publish(id, change) {
			const published = reader?.readPublishedProjection?.(change);
			if (!published?.placements.has(id) || !registered.has(id)) return false;
			invalidateReads(id);
			resident.set(id, select(published, id));
			dirty.delete(id);
			return true;
		},
		invalidate(id) {
			invalidateReads(id);
			if (id) {
				resident.delete(id);
				if (registered.has(id)) dirty.add(id);
			} else {
				resident.clear();
				for (const registeredId of registered) dirty.add(registeredId);
			}
		},
		invalidateChange(change) {
			if ("sessionKey" in change && change.scope === "acp") return;
			if ("sessionKey" in change) for (const read of reads) {
				const target = read.privateSessions.get(change.sessionKey);
				if (target && (!change.agentId || change.agentId === target.storeTarget.agentId) && (!change.storePath || change.storePath === target.storeTarget.storePath)) invalidateReads(target.sessionId);
			}
			if ("all" in change && (change.scope === "worker-placements" || change.scope === "worker-environments" || change.scope === "stores")) owner.invalidate();
		},
		update(row, previous, related) {
			if (row.entry && (row.entry.archivedAt === void 0 || row.materialized)) owner.register(row.entry.sessionId);
			else if (row.entry && registered.has(row.entry.sessionId) && !related(row.entry.sessionId).some((other) => other.entry && (other.entry.archivedAt === void 0 || other.materialized))) owner.forget(row.entry.sessionId);
			if (previous?.entry && previous.entry.sessionId !== row.entry?.sessionId && related(previous.entry.sessionId).length === 0) owner.forget(previous.entry.sessionId);
		},
		async withPreparedRows(projection, isActive, lookup, queries, prepareRows, consume, prepareSelection) {
			const signal = getAsyncWorkSignal();
			const memory = getSessionActorStorageBinding({});
			const assertActive = () => {
				signal?.throwIfAborted();
				if (disposed || !isActive()) throw new Error("Session row projection is no longer active");
			};
			const prepareFacts = () => prepareReadFacts() ?? prepareSelection?.();
			let preparedQueries = [];
			let hasPrivateQueries = false;
			let selectedIds = [];
			const privateTargets = /* @__PURE__ */ new Map();
			const privateRepositories = /* @__PURE__ */ new Map();
			let privateSelections = [];
			let selectedConfig;
			const selectRows = () => {
				const cfg = projection.state.cfg;
				if (selectedConfig !== cfg) {
					privateRepositories.clear();
					selectedConfig = cfg;
				}
				privateSelections = [];
				privateTargets.clear();
				preparedQueries = queries(cfg);
				hasPrivateQueries = false;
				const ids = [];
				for (const query of preparedQueries) {
					const key = privateSessionRowReadKey(cfg, query);
					hasPrivateQueries ||= key !== void 0;
					const privateMemory = key ? captureSessionActorStorageOwner({
						...query,
						sessionKey: query.key,
						sessionActor: memory,
						env
					}, {
						assertCurrent: assertActive,
						authorize: assertActive
					}) : void 0;
					const snapshot = privateMemory?.owner?.readSession(query.key, privateMemory.authority);
					const assertSessionCurrent = privateMemory?.owner?.captureSessionReadGuard(query.key);
					const row = privateMemory ? snapshot?.entry && createIncognitoSessionRow({
						cfg,
						key: query.key,
						agentId: query.agentId,
						storePath: privateMemory.path,
						entry: snapshot.entry,
						membership: new Set(snapshot.members.map((member) => member.identityId)),
						source: {
							identity: snapshot.version.epoch,
							assertCurrent() {
								assertActive();
								assertSessionCurrent?.();
								privateMemory.binding?.actor.assertReadable();
								privateMemory.authority.assertCurrent();
							}
						}
					}) : inOwnerContext(() => lookup(query));
					if (key && row?.entry?.repositoryWorkspaceId) privateSelections.push({
						key,
						row,
						workspaceId: row.entry.repositoryWorkspaceId
					});
					if (row?.entry) {
						ids.push(row.entry.sessionId);
						if (key) privateTargets.set(row.key, {
							sessionId: row.entry.sessionId,
							storeTarget: row.storeTarget
						});
					}
				}
				selectedIds = ids;
				if (privateRepositories.size) {
					const selectedPrivateKeys = new Set(privateSelections.map(({ key }) => key));
					for (const key of privateRepositories.keys()) if (!selectedPrivateKeys.has(key)) privateRepositories.delete(key);
				}
			};
			const prepareSelectedRows = () => {
				let pending = inOwnerContext(() => prepareRows(preparedQueries));
				if (pending) return pending;
				for (const { key, row, workspaceId } of privateSelections) {
					const existing = privateRepositories.get(key);
					if (existing?.workspaceId === workspaceId && isCurrentGeneration(existing.row, row)) continue;
					const cfg = selectedConfig;
					pending = inOwnerContext(async () => {
						const repository = await getSessionRepositoryWorkspaceStore().prepare(workspaceId);
						assertActive();
						if (projection.state.cfg === cfg) privateRepositories.set(key, {
							row,
							workspaceId,
							repository
						});
					});
					break;
				}
				return pending;
			};
			const stalePrivatePreparation = Symbol("stale-private-row-preparation");
			const consumeRows = (placement, placementCurrent = () => true) => {
				const cfg = projection.state.cfg;
				const consumePrepared = (privateRows) => {
					assertActive();
					const privateIds = privateRows ? [...privateRows.values()].flatMap((row) => row?.entry ? [row.entry.sessionId] : []) : [];
					if (!placementCurrent() || projection.state.cfg !== cfg || missing(privateIds).some((id) => !placement?.has(id))) return stalePrivatePreparation;
					const previous = exact;
					if (placement) exact = placement;
					try {
						return readPreparedSessionRows(projection, isActive, () => preparedQueries, (read) => consume(read, preparedQueries), privateRepositories, privateRows);
					} finally {
						exact = previous;
					}
				};
				return hasPrivateQueries ? withBoundIncognitoSessionRows(cfg, preparedQueries, consumePrepared, env) : consumePrepared();
			};
			const prepare = () => {
				const pending = prepareFacts();
				if (pending) return pending;
				selectRows();
				return prepareSelectedRows();
			};
			const assertPublicationCurrent = (placementCurrent = true) => {
				if (!hasPrivateQueries) return;
				assertActive();
				if (!placementCurrent || projection.state.cfg !== selectedConfig) throw new Error("Session row facts changed during cleanup");
			};
			while (true) {
				assertActive();
				for (let pending = prepareFacts(); pending; pending = prepareFacts()) {
					await pending;
					assertActive();
				}
				selectRows();
				const requested = missing(selectedIds);
				if (!reader || requested.length === 0) {
					const pending = prepareSelectedRows();
					if (pending) {
						await pending;
						continue;
					}
					const result = await consumeRows();
					if (result === stalePrivatePreparation) continue;
					assertPublicationCurrent();
					return result;
				}
				const read = acquireRead(requested, "exact", privateTargets);
				try {
					const snapshot = await read.result;
					assertActive();
					for (let pending = prepare(); pending; pending = prepare()) {
						await pending;
						assertActive();
					}
					const prepared = new Map(requested.map((id) => [id, select(snapshot, id)]));
					if (requested.some((id) => !read.isCurrent(id)) || selectedIds.some((id) => !resident.has(id) && !prepared.has(id))) continue;
					for (const [id, facts] of prepared) if (registered.has(id)) {
						resident.set(id, facts);
						dirty.delete(id);
					}
					const result = await consumeRows(prepared, () => requested.every((id) => read.isCurrent(id)));
					if (result === stalePrivatePreparation) continue;
					assertPublicationCurrent(requested.every((id) => read.isCurrent(id)));
					return result;
				} finally {
					read.release();
				}
			}
		},
		async prepare() {
			const requested = [...dirty];
			if (disposed || !reader || requested.length === 0) return;
			const read = acquireRead(requested, "resident");
			try {
				const snapshot = await read.result;
				if (disposed) return;
				for (const id of requested) if (registered.has(id) && read.isCurrent(id)) {
					resident.set(id, select(snapshot, id));
					dirty.delete(id);
				}
			} finally {
				read.release();
			}
		},
		dispose() {
			disposed = true;
			invalidateReads();
			for (const read of queuedReads) {
				read.settled = true;
				read.completion.reject(/* @__PURE__ */ new Error("Session row projection is no longer active"));
				releaseRead(read);
			}
			queuedReads.length = 0;
			resident.clear();
			registered.clear();
			dirty.clear();
		}
	};
	return owner;
}
//#endregion
//#region src/gateway/session-row-projection-ancestors.ts
/** Materialization reads current physical relations from the projection's existing indexes. */
function createSessionRowRelationReads(owner) {
	return {
		readPreparedSpawnedBy(query) {
			if (!owner.isReady()) return;
			const memory = getSessionActorStorageBinding({});
			return owner.inOwnerContext(() => {
				const { key, value: entry } = selectStoredSessionLineage({
					cfg: owner.config(),
					agentId: query.agentId,
					sessionKey: query.key,
					read: (agentId, storedKey) => {
						if (!isIncognitoSessionKey(storedKey)) {
							const row = owner.lookup({
								...query,
								agentId,
								key: storedKey
							});
							return row?.key === storedKey ? row.sharingEntry : void 0;
						}
						const selected = captureSessionActorStorageOwner({
							agentId,
							sessionKey: storedKey,
							sessionActor: memory,
							env: owner.env
						}, memory?.authority ?? {
							assertCurrent: owner.assertCurrent,
							authorize: owner.assertCurrent
						});
						return selected?.owner?.readSession(storedKey, selected.authority)?.entry;
					}
				});
				if (!entry) return;
				const rowContext = owner.preparedContext();
				return (rowContext ? projectGatewaySessionRunState({
					key,
					now: Date.now(),
					rowContext
				}).subagentOwner : void 0) || entry.spawnedBy;
			});
		},
		readSourceEntry(row, key, residentOnly = false) {
			const source = owner.referenced(parentReference(owner.config(), key, row.agentId, row.storeTarget.storePath, owner.referenced));
			return source && (!residentOnly && !source.retainedDatabaseFacts && source.unresolvedDatabaseFacts !== "category" && owner.dirty.has(identity(source)) ? owner.readEntry(source) : source.storedEntry);
		},
		readChildLinks(row, residentOnly = false) {
			const links = [...dependents(row, owner.byParent)].flatMap((child) => {
				let value = owner.rows.get(child);
				if (value && !residentOnly && !value.retainedDatabaseFacts && value.unresolvedDatabaseFacts !== "category" && owner.dirty.has(child)) value = owner.acquireEntry(value, owner.readEntry(value));
				return value?.entry && [...value.parents].some((ref) => owner.referenced(ref) === row) ? [{
					key: value.key,
					entry: value.entry
				}] : [];
			});
			links.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
			return links;
		}
	};
}
/** Follow the projection's physical lineage and aggregate owners without a roster scan. */
function readSessionRowAncestors(record, owner) {
	const seen = /* @__PURE__ */ new Set([identity(record)]);
	const pending = [record];
	const ancestors = [];
	for (const child of pending) {
		const parents = new Set(child.parents);
		for (const run of owner.context.subagentRunsByChildSessionKey.get(child.key) ?? []) for (const key of [run.requesterSessionKey, run.swarmRequesterSessionKey]) if (key) {
			const agentId = run.requesterAgentId ?? child.agentId;
			parents.add(parentReference(owner.cfg, key, agentId, agentId === child.agentId ? child.storeTarget.storePath : void 0, owner.referenced));
		}
		for (const ref of parents) {
			const parent = owner.referenced(ref);
			if (!parent) return;
			if (seen.has(identity(parent))) continue;
			if (ancestors.length === 64) return;
			seen.add(identity(parent));
			const prepared = owner.prepare(parent);
			if (!prepared) return;
			ancestors.push(prepared);
			pending.push(prepared);
		}
	}
	return ancestors;
}
/** Exact event frames prepare the same bounded lineage later projected for each recipient. */
function createSessionRowAncestorReads(owner) {
	return {
		ancestorRows: (record, read) => readSessionRowAncestors(record, {
			...owner.state(),
			referenced: owner.referenced,
			prepare: (row) => hasEntry(row) && owner.placementFacts.isPrepared(row.entry.sessionId) && !owner.membership.needsPreparation(() => [{
				...row,
				storePath: row.storeTarget.storePath
			}]) ? (read ?? owner).describe({
				...row,
				storePath: row.storeTarget.storePath
			}, row) : void 0
		}),
		withPreparedExactRows: async function withPreparedExactRows(queries, consume, options) {
			const selected = options?.includeAncestors ? (config) => {
				const targets = queries(config);
				return owner.inOwnerContext(() => [...targets, ...targets.flatMap((query) => {
					const row = owner.lookup(query);
					return (row && readSessionRowAncestors(row, {
						...owner.state(),
						referenced: owner.referenced,
						prepare: (parent) => parent
					}))?.map((parent) => ({
						key: parent.key,
						agentId: parent.agentId,
						storePath: parent.storeTarget.storePath
					})) ?? [];
				})]);
			} : queries;
			const archivedRows = owner.retainArchiveRows();
			const releaseExactPreparation = owner.retainExactPreparation();
			const membershipPending = Symbol("session-membership-pending");
			try {
				while (owner.isActive()) try {
					while (owner.isActive() && owner.membership.needsPreparation(selected)) await owner.membership.prepare();
					const prepared = await owner.placementFacts.withPreparedRows(owner.projection(), owner.isActive, owner.lookup, selected, (targets) => {
						archivedRows.update(targets.flatMap((query) => {
							if (isIncognitoSessionKey(resolveStoredSessionKeyForAgentStore({
								cfg: owner.state().cfg,
								sessionKey: query.key,
								agentId: query.agentId
							}))) return [];
							const row = owner.lookup(query);
							return row?.entry?.archivedAt !== void 0 ? [identity(row)] : [];
						}));
						if (owner.membership.needsPreparation(() => targets)) return owner.membership.prepare();
						return owner.prepareExactRows(targets);
					}, (read, targets) => {
						if (owner.membership.needsPreparation(() => targets)) return membershipPending;
						return consume(read);
					}, options?.selection ? owner.prepareSelection : void 0);
					if (prepared !== membershipPending) return prepared;
				} catch (error) {
					if (!(error instanceof SessionRowFactsPending)) throw error;
					await withReadySessionRows({ withPreparedExactRows }, () => error.queries, () => void 0);
				}
				throw new Error("Session row projection is no longer active");
			} finally {
				releaseExactPreparation();
				archivedRows.release();
			}
		}
	};
}
//#endregion
//#region src/gateway/session-row-transcript-backfill.ts
/** Runtime alias and selected-model policy remain with the host, not the durable cache. */
function presentSessionRowTranscriptFields(params, fields) {
	const { sessionEntry, model, ...scope } = params;
	const terminal = fields.terminalModel;
	const fallback = model && readSessionFallbackModel({
		...model,
		sessionEntry,
		sessionScope: {
			...scope,
			agentId: params.storeAgentId ?? params.agentId
		},
		terminalModel: terminal && terminal.runId === sessionEntry.lastRunId ? terminal : null
	});
	return {
		...fields.lastMessagePreview !== null ? { lastMessagePreview: fields.lastMessagePreview } : {},
		...fallback ? { fallbackModel: {
			provider: fallback.modelProvider,
			model: fallback.model
		} } : {}
	};
}
/** Optional transcript facts are published by the resident row owner. */
async function backfillSessionRowTranscriptFields(params) {
	const { model: _model, sessionEntry: _sessionEntry, ...input } = params;
	const options = toDatabaseOptions(resolveSqliteTranscriptReadScope({
		...input,
		agentId: params.storeAgentId ?? params.agentId
	}));
	const execution = captureOpenClawAgentDatabaseExecution(options);
	const source = createSessionWorkerExecutionSource(() => {}, "Session row backfill retired");
	try {
		const fields = await runOpenClawAgentWorkerWrite(options, () => execution.runExisting(source, (worker) => worker.execute({
			type: "session.rowTranscript.backfill",
			input
		})), void 0, void 0, "background");
		return fields ? presentSessionRowTranscriptFields(params, fields) : {};
	} finally {
		await execution.release();
	}
}
//#endregion
//#region src/gateway/session-row-projection-backfill.ts
function transcriptParams(row, entry) {
	return {
		...row.storeTarget,
		agentId: row.agentId,
		storeAgentId: row.storeTarget.agentId,
		sessionKey: row.key,
		sessionId: entry.sessionId,
		sessionEntry: entry,
		model: row.materialized && {
			selectedProvider: row.materialized.source.selectedModel.provider,
			selectedModel: row.materialized.source.selectedModel.model,
			config: row.materialized.source.cfg
		}
	};
}
/** Optional transcript work never participates in row readiness or a foreground response. */
function createSessionRowProjectionBackfill(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const queued = /* @__PURE__ */ new Set();
	const revisions = /* @__PURE__ */ new Map();
	let pending;
	let started = false;
	let disposed = false;
	function revision(row, watermark) {
		const { entry, materialized } = row;
		return {
			generation: row.generation,
			watermark: watermark?.activitySummaryWatermark,
			fallback: entry.fallbackNotice && {
				status: entry.status,
				lastRunId: entry.lastRunId,
				modelProvider: entry.modelProvider,
				model: entry.model,
				notice: entry.fallbackNotice,
				selectedModel: materialized?.source.selectedModel
			}
		};
	}
	async function drain() {
		for (;;) {
			if (disposed || !queued.size) return;
			await yieldSessionListBackgroundWork();
			await params.ready();
			if (disposed) return;
			const id = queued.values().next().value;
			if (id === void 0) continue;
			queued.delete(id);
			const row = params.read(id);
			const entry = row?.entry;
			const captured = revisions.get(id);
			if (!row || !entry || !captured) continue;
			try {
				const fields = await backfillSessionRowTranscriptFields(transcriptParams(row, entry));
				const live = params.read(id);
				if (!disposed && live?.entry && params.current(row)) {
					const facts = live.retainedDatabaseFacts;
					params.publish(live, facts?.transcriptPreview !== void 0 && facts.transcriptTerminalModel !== void 0 ? presentSessionRowTranscriptFields(transcriptParams(live, live.entry), {
						lastMessagePreview: facts.transcriptPreview,
						terminalModel: facts.transcriptTerminalModel
					}) : fields);
				}
			} catch {
				if (revisions.get(id) === captured) revisions.delete(id);
			}
		}
	}
	function start() {
		started = true;
		if (!disposed && !pending && queued.size) {
			pending = inOwnerContext(drain).then(() => {
				pending = void 0;
				start();
			}, (error) => {
				pending = void 0;
				throw error;
			});
			pending.catch(() => {});
		}
	}
	return {
		start,
		prepare(row, facts) {
			const id = identity(row);
			const next = revision(row, facts);
			if (facts?.transcriptPreview !== void 0 && facts.transcriptTerminalModel !== void 0) {
				revisions.set(id, next);
				queued.delete(id);
				params.publish(row, presentSessionRowTranscriptFields(transcriptParams(row, row.entry), {
					lastMessagePreview: facts.transcriptPreview,
					terminalModel: facts.transcriptTerminalModel
				}));
				return;
			}
			if (!isDeepStrictEqual(revisions.get(id), next)) {
				revisions.set(id, next);
				queued.add(id);
			}
			if (started) start();
		},
		remove(id) {
			revisions.delete(id);
			queued.delete(id);
		},
		dispose() {
			disposed = true;
			queued.clear();
			revisions.clear();
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-catalog.ts
function changedModelAgents(previous, next) {
	if (!(previous instanceof Map) || !(next instanceof Map) || previous.size === 0 || previous.size !== next.size) return;
	const changed = /* @__PURE__ */ new Set();
	for (const [agentId, catalog] of previous) {
		const replacement = next.get(agentId);
		if (catalog === void 0 || replacement === void 0 || readPreparedGatewaySessionRowPolicy(catalog) === void 0 || readPreparedGatewaySessionRowPolicy(replacement) === void 0) return;
		if (!isDeepStrictEqual(readPreparedGatewaySessionRowPolicy(catalog), readPreparedGatewaySessionRowPolicy(replacement))) changed.add(agentId);
	}
	return changed;
}
/** The projection's one catalog snapshot survives asynchronous renewal. */
function createSessionRowProjectionCatalog(params) {
	let modelCatalog = params.modelCatalog;
	let catalogDirty = Boolean(params.getModelCatalog);
	let pending;
	let replacement;
	let disposed = false;
	const unsubscribe = registerPreparedModelRuntimePublicationListener((event) => {
		if (event.phase === "catalog-status") return;
		if (event.phase === "invalidated" && event.replacement) {
			replacement = event.replacement;
			const settled = () => {
				if (!disposed && replacement === event.replacement) {
					replacement = void 0;
					params.onInvalidated();
				}
			};
			replacement.then(settled, settled).catch(() => {});
		}
		if (event.phase !== "failed" && event.modelFactsChanged === false && modelCatalog !== void 0 && (!(modelCatalog instanceof Map) || ![...modelCatalog.values()].includes(void 0))) return;
		params.onInvalidated();
	});
	return {
		get current() {
			return modelCatalog;
		},
		get isRefreshing() {
			return !disposed && pending !== void 0;
		},
		get needsInitialRead() {
			return catalogDirty && modelCatalog === void 0;
		},
		invalidate() {
			if (params.getModelCatalog) catalogDirty = true;
		},
		refresh() {
			if (disposed || !catalogDirty || replacement && modelCatalog !== void 0) return Promise.resolve();
			if (pending) return pending;
			const work = (async () => {
				const next = await params.getModelCatalog?.();
				if (disposed || replacement && modelCatalog !== void 0) return;
				const changed = changedModelAgents(modelCatalog, next);
				modelCatalog = next;
				catalogDirty = false;
				params.onRefreshed(changed);
			})().finally(() => {
				pending = void 0;
			});
			pending = work;
			work.catch(() => {});
			return work;
		},
		dispose() {
			disposed = true;
			unsubscribe();
		}
	};
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-read-index.ts
/** A resident list index consumes keyed publications until its source is replaced. */
function createSubagentSessionListReadIndex(source, now) {
	let identity = source.snapshotIdentity();
	let index = buildSubagentSessionListReadIndex(now, void 0, source.runs());
	let memory = new Map(subagentRuns);
	let revision = 0;
	let replaced = false;
	const changedChildren = /* @__PURE__ */ new Set();
	const pending = /* @__PURE__ */ new Set();
	return {
		dispose: subscribeSubagentRunChanges("projection", ({ runIds: ids }) => {
			if (!ids) replaced = true;
			else for (const id of ids) pending.add(id);
		}),
		changedChildren,
		get revision() {
			return revision;
		},
		read(clock) {
			changedChildren.clear();
			const nextIdentity = source.snapshotIdentity();
			if (replaced || identity !== nextIdentity) {
				for (const key of index.runsByChildSessionKey.keys()) changedChildren.add(key);
				index = buildSubagentSessionListReadIndex(clock, void 0, source.runs());
				for (const key of index.runsByChildSessionKey.keys()) changedChildren.add(key);
				memory = new Map(subagentRuns);
				revision++;
			} else if (pending.size) {
				const rows = source.runs(pending);
				const changes = /* @__PURE__ */ new Map();
				const owners = /* @__PURE__ */ new Map();
				for (const id of pending) {
					const row = rows.get(id);
					const owner = subagentRuns.get(id);
					if (memory.get(id) !== owner || !isDeepStrictEqual(index.inputs.runs.get(id), row)) {
						for (const entry of [index.inputs.runs.get(id), row]) if (entry) changedChildren.add(entry.childSessionKey.trim());
						changes.set(id, row);
						owners.set(id, owner);
						if (owner) memory.set(id, owner);
						else memory.delete(id);
					}
				}
				if (changes.size) {
					index = index.patch(changes, owners, clock);
					revision++;
				}
			}
			identity = nextIdentity;
			replaced = false;
			pending.clear();
			return index.atTime(clock);
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-context.ts
/** Registry and display facts have their own lifecycle, independent of stored row acquisition. */
function createSessionRowProjectionContext(subagents) {
	let preparedEpoch = -1;
	let registryRevision = getSubagentRegistryPublicationRevision();
	let registrySnapshot = subagents.snapshotIdentity();
	let agentRunRevision = readAgentRunIndexVersion();
	let profileRevision = 0;
	let subagentRevision = 0;
	let parentRevision = 0;
	let modelFactsDirty = false;
	const identityProjection = createSessionIdentityProjection();
	const initialNow = Date.now();
	const subagentIndex = createSubagentSessionListReadIndex(subagents, initialNow);
	let current = {
		...buildSessionListRowMetadataContext({
			now: initialNow,
			subagentRuns: subagentIndex.read(initialNow)
		}),
		identityProjection
	};
	const subagentInputs = current.subagentRuns.inputs;
	function prepare(epoch) {
		const snapshot = subagents.snapshotIdentity();
		const revision = getSubagentRegistryPublicationRevision();
		const runRevision = readAgentRunIndexVersion();
		if (preparedEpoch === epoch && registrySnapshot === snapshot && registryRevision === revision && agentRunRevision === runRevision) return;
		if (registrySnapshot !== snapshot) {
			registryRevision = void 0;
			registrySnapshot = snapshot;
		}
		const now = Date.now();
		const previousIndexRevision = subagentIndex.revision;
		const subagentRuns = subagentIndex.read(now);
		const subagentChanged = previousIndexRevision !== subagentIndex.revision;
		if (subagentChanged || registryRevision === void 0) subagentRevision++;
		const projectedAgentRuns = agentRunRevision === runRevision ? current.projectedAgentRuns : buildProjectedAgentRunIndex();
		const projectedSubagentActivity = projectedAgentRuns === current.projectedAgentRuns && !subagentChanged ? current.projectedSubagentActivity : buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns);
		current = modelFactsDirty ? {
			...buildSessionListRowMetadataContext({
				now,
				subagentRuns,
				projectedAgentRuns,
				projectedSubagentActivity,
				userProfileIdentityById: current.userProfileIdentityById
			}),
			identityProjection
		} : {
			...current,
			subagentRuns,
			projectedAgentRuns,
			projectedSubagentActivity,
			subagentRunsByChildSessionKey: subagentRuns.runsByChildSessionKey
		};
		modelFactsDirty = false;
		Object.assign(subagentInputs, current.subagentRuns.inputs);
		registryRevision = revision;
		agentRunRevision = runRevision;
		preparedEpoch = epoch;
	}
	return {
		dispose: subagentIndex.dispose,
		readPrepared(epoch) {
			return preparedEpoch === epoch && parentRevision === subagentRevision && agentRunRevision === readAgentRunIndexVersion() && registryRevision === getSubagentRegistryPublicationRevision() && registrySnapshot === subagents.snapshotIdentity() ? current : void 0;
		},
		get current() {
			return current;
		},
		subagentInputs,
		get materializedRevisions() {
			return {
				profileRevision,
				subagentRevision
			};
		},
		/** True means the publication changes only these derived facts. */
		invalidate(change) {
			if (!("all" in change)) {
				if (change.scope === "runtime" && (!change.facts || change.facts.kind === "unchanged") && !change.factsInvalidated) return true;
				return false;
			}
			if (typeof change.scope === "object" && change.scope.topology && !change.factsInvalidated) return true;
			switch (change.scope) {
				case "config-profiles":
				case "profiles":
					current.userProfileIdentityById.clear();
					identityProjection.invalidate();
					profileRevision++;
					return true;
				case "config-presentation":
				case "subagent-runs":
				case "worker-environments":
				case "worker-placements":
				case "agent-runs":
				case "sessions": return true;
				case "stores":
				case "config":
					identityProjection.invalidate();
					registryRevision = void 0;
			}
			modelFactsDirty = true;
			return false;
		},
		prepare(epoch, cfg, matching, put, referenced) {
			const broad = registryRevision === void 0;
			prepare(epoch);
			if (parentRevision === subagentRevision) return;
			for (const key of broad ? current.subagentRunsByChildSessionKey.keys() : subagentIndex.changedChildren) for (const row of matching({ key })) {
				if (!row.storedEntry) continue;
				const parents = readSessionRowParents(row, row.storedEntry, cfg, current, referenced);
				if (!isDeepStrictEqual(row.parents, parents)) put({
					...row,
					parents
				});
			}
			parentRevision = subagentRevision;
		},
		preparePresentation(row, readChildLinks) {
			if (row.profileRevision !== profileRevision) {
				refreshSessionRowProfiles(row.materialized);
				row.profileRevision = profileRevision;
			}
			if (row.subagentRevision !== subagentRevision) {
				row.materialized.source.childLinks = projectSessionRowChildLinks(readChildLinks(row));
				const swarm = buildSessionSwarmSummary(current.subagentRuns.swarmRunsByRequesterSessionKey.get(row.key) ?? [], row.key, row.agentId, { includeChildren: true });
				if (!isDeepStrictEqual(row.materialized.row.swarm, swarm)) row.materialized.row.swarm = swarm;
				row.subagentRevision = subagentRevision;
			}
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-generation.ts
/** Pending events observe mutations in the same owner that renews published row generations. */
function createSessionRowGenerationObservations(owner) {
	const observations = /* @__PURE__ */ new Set();
	return {
		invalidate() {
			for (const observation of observations) observation.dispose();
		},
		observeGeneration(query) {
			if (!owner.isActive()) return {
				isCurrent: () => false,
				dispose: () => {}
			};
			const config = owner.config();
			const agentId = normalizeAgentId(query.agentId);
			const sessionId = query.sessionId;
			const canonicalKey = (sessionKey) => resolveStoredSessionKeyForAgentStore({
				cfg: config,
				agentId,
				sessionKey
			});
			const key = query.key === void 0 ? void 0 : canonicalKey(query.key);
			let active = true;
			const observation = {
				changed(mutation) {
					return [mutation.previous, ..."current" in mutation ? [mutation.current] : []].some((target) => {
						const keys = target.sessionKeys.filter((sessionKey) => normalizeAgentId(parseAgentSessionKey(sessionKey)?.agentId ?? mutation.agentId) === agentId);
						return key === void 0 ? target.sessionId === sessionId : keys.some((sessionKey) => canonicalKey(sessionKey) === key);
					});
				},
				dispose() {
					active = false;
					observations.delete(observation);
				}
			};
			observations.add(observation);
			return {
				isCurrent(row) {
					if (!active || !owner.isActive() || row.agentId !== agentId && (key !== void 0 || row.storeTarget.agentId !== agentId) || !owner.isCurrent(row) || (key === void 0 ? row.entry?.sessionId !== sessionId : canonicalKey(row.key) !== key)) return false;
					return true;
				},
				dispose: observation.dispose
			};
		},
		mutate(mutation) {
			for (const observation of observations) if (observation.changed(mutation)) observation.dispose();
			if (readPreparedSessionSharingChange(mutation) !== void 0) return;
			const alreadyPublished = (row) => mutation.kind !== "delete" && mutation.kind !== "reset" && mutation.current.sessionKeys.includes(row.key) && row.publishedSource?.identity === mutation.databaseIdentity && row.sharingEntry?.sessionId === mutation.current.sessionId;
			for (const key of mutation.previous.sessionKeys) for (const row of owner.matching({
				key,
				agentId: mutation.agentId
			})) {
				if (owner.stores().get(row.storeTarget.storePath)?.identity !== mutation.databaseIdentity) continue;
				if (mutation.previous.sessionId && row.entry?.sessionId !== mutation.previous.sessionId) continue;
				if (alreadyPublished(row)) continue;
				owner.markRelated(row);
				if ("current" in mutation && mutation.current.sessionKeys.includes(row.key)) {
					owner.put(renewGeneration(row));
					owner.dirty.add(identity(row));
				} else owner.remove(identity(row));
			}
			if ("current" in mutation) {
				const source = [...owner.stores().values()].find((store) => store.identity === mutation.databaseIdentity);
				if (!source) return;
				for (const sessionKey of mutation.current.sessionKeys) {
					if (owner.matching({
						key: sessionKey,
						agentId: mutation.agentId
					}).some((row) => owner.stores().get(row.storeTarget.storePath)?.identity === mutation.databaseIdentity && alreadyPublished(row))) continue;
					owner.mark({
						agentId: mutation.agentId,
						sessionKey,
						storePath: source.filename
					});
				}
			} else owner.ensureMaterialized().catch(() => {});
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-publication.ts
/** Apply committed metadata before observers without reacquiring it from SQLite. */
function createSessionRowPublication(owner) {
	function acquirePublishedEntry(row, entry, databaseFacts) {
		owner.markRelated(row, changesSessionRowDependents(row.storedEntry, entry));
		owner.runAsOwner(() => {
			if (entry.archivedAt !== void 0 && !owner.registryFactsReady()) {
				const previous = row.storedEntry ?? row.entry;
				const changedIdentity = previous && (previous.sessionId !== entry.sessionId || previous.lifecycleRevision !== entry.lifecycleRevision);
				owner.deferArchive({
					...changedIdentity ? renewGeneration(row) : row,
					publishedSource: row.publishedSource,
					storedEntry: entry,
					sharingEntry: entry,
					entryAcquisitionPending: true
				});
				return;
			}
			const next = owner.acquireEntry(row, entry);
			if (next && databaseFacts) {
				next.retainedDatabaseFacts = databaseFacts;
				next.preparedAcpMeta = databaseFacts.acpMeta;
				next.preparedRuntimeOwnership = databaseFacts.runtimeOwnership;
				next.runtimeOwnershipDependencies = databaseFacts.runtimeOwnershipDependencies;
				next.hasBoard = databaseFacts.hasBoard;
			}
			owner.enqueue(next);
		});
	}
	return function publish(row, change, prepared = readPreparedSessionEntryChange(change, row.key)) {
		const source = prepared?.source;
		const previousSource = row.publishedSource;
		if (source && previousSource?.incarnation === source.incarnation && previousSource.revision !== void 0 && source.revision !== void 0 && previousSource.revision > source.revision) return;
		const store = owner.store(row.storeTarget.storePath);
		if (prepared && (!source || store?.identity !== source.identity || store.birthtime !== source.birthtime || store.filename !== source.filename)) return;
		if (row.entry && !change.factsInvalidated && owner.placement.publish(row.entry.sessionId, change)) {
			owner.defer(row);
			return;
		}
		const facts = change.facts;
		if (change.scope === "acp") {
			const entry = row.storedEntry;
			if (facts?.kind === "acp" && (entry?.sessionId !== facts.sessionId || (entry?.lifecycleRevision ?? null) !== facts.lifecycleRevision || entry?.sessionStartedAt !== facts.sessionStartedAt)) return;
			row.databaseFactsRevision++;
			row.pendingDatabaseFacts = void 0;
			const acpMeta = facts?.kind === "acp" ? freezeJsonSnapshot(facts.acp) : void 0;
			if (row.retainedDatabaseFacts) row.retainedDatabaseFacts = {
				...row.retainedDatabaseFacts,
				acpMeta
			};
			row.preparedAcpMeta = acpMeta;
			owner.defer(row);
			return;
		}
		const sharingUnchanged = !change.factsInvalidated && (facts?.kind === "unchanged" || !change.storePath && !facts && change.scope !== "session-entry");
		if (facts?.kind === "removed") {
			owner.remove(identity(row));
			return;
		}
		if (prepared && !prepared.entry && !prepared.sharing) return;
		const previousFacts = row.retainedDatabaseFacts ?? row.pendingDatabaseFacts;
		const committed = prepared?.projection;
		const entry = prepared?.entry;
		const sameSession = entry && previousFacts?.entry.sessionId === entry.sessionId && previousFacts.entry.lifecycleRevision === entry.lifecycleRevision;
		const projection = committed ?? (change.scope === "session-entry" && sameSession && (!readSessionActivitySummary(entry) || previousFacts.activitySummaryWatermark) ? previousFacts : void 0);
		const sameRuntimeOwner = sameSession && previousFacts.entry.agentHarnessId === entry.agentHarnessId && previousFacts.entry.modelSelectionLocked === entry.modelSelectionLocked && previousFacts.entry.pluginOwnerId === entry.pluginOwnerId && previousFacts.entry.previousSessionId === entry.previousSessionId;
		const activitySummaryWatermark = projection?.activitySummaryWatermark ?? (sameSession ? previousFacts.activitySummaryWatermark : void 0);
		const sameTranscript = sameSession && previousFacts.activitySummaryWatermark?.generation === activitySummaryWatermark?.generation && previousFacts.activitySummaryWatermark?.maxSeq === activitySummaryWatermark?.maxSeq;
		const databaseFacts = entry && projection && !change.factsInvalidated ? {
			sessionKey: row.key,
			entry,
			hasBoard: projection.hasBoard,
			activitySummaryWatermark,
			transcriptPreview: sameTranscript ? previousFacts.transcriptPreview : void 0,
			transcriptTerminalModel: sameTranscript ? previousFacts.transcriptTerminalModel : void 0,
			runtimeOwnership: sameRuntimeOwner ? previousFacts.runtimeOwnership : void 0,
			runtimeOwnershipDependencies: sameRuntimeOwner ? previousFacts.runtimeOwnershipDependencies : void 0,
			acpMeta: sameSession && previousFacts.entry.sessionStartedAt === entry.sessionStartedAt ? previousFacts.acpMeta : void 0,
			repositoryWorkspace: !entry.repositoryWorkspaceId ? null : sameSession && previousFacts.entry.repositoryWorkspaceId === entry.repositoryWorkspaceId ? previousFacts.repositoryWorkspace : void 0
		} : void 0;
		const participantEntry = !prepared && !change.factsInvalidated && facts?.kind === "participants" ? projectSessionEntryPredicateChange({ entry: row.sharingEntry }, facts) : void 0;
		if (participantEntry) {
			const next = freezeJsonSnapshot(participantEntry);
			const retained = previousFacts && previousFacts.entry === row.sharingEntry ? {
				...previousFacts,
				entry: next
			} : void 0;
			invalidateDatabaseFacts(row, retained);
			if (row.sharingEntry === row.storedEntry) acquirePublishedEntry(row, next, retained);
			else owner.defer({
				...row,
				sharingEntry: next
			});
			return;
		}
		if (!prepared && !change.factsInvalidated && facts?.kind === "category" && row.sharingEntry?.sessionId === facts.sessionId) {
			const { category: _previousCategory, ...sharingEntry } = row.sharingEntry;
			const next = freezeJsonSnapshot({
				...sharingEntry,
				...facts.category !== null ? { category: facts.category } : {}
			});
			const retained = previousFacts?.entry === row.sharingEntry ? {
				...previousFacts,
				entry: next
			} : void 0;
			invalidateDatabaseFacts(row, retained);
			if (row.sharingEntry === row.storedEntry) acquirePublishedEntry(row, next, retained);
			else owner.defer({
				...row,
				sharingEntry: next
			});
			return;
		}
		invalidateDatabaseFacts(row, databaseFacts);
		if (!prepared && !change.factsInvalidated && facts?.kind === "owner" && row.sharingEntry?.sessionId === facts.sessionId && (row.sharingEntry.lifecycleRevision ?? null) === facts.lifecycleRevision) {
			const { owner: _previousOwner, ...sharingEntry } = row.sharingEntry;
			const next = freezeJsonSnapshot({
				...sharingEntry,
				...facts.owner ? { owner: structuredClone(facts.owner) } : {}
			});
			if (row.sharingEntry === row.storedEntry) acquirePublishedEntry(row, next);
			else owner.defer({
				...row,
				sharingEntry: next
			});
			return;
		}
		if (!prepared && !sharingUnchanged) row.publishedSource = void 0;
		if (!prepared?.entry && change.factsInvalidated && owner.invalidateFacts(row, change.factsInvalidated)) {
			owner.defer(row);
			return;
		}
		if (row.entry && change.scope !== "session-entry") owner.placement.invalidate(row.entry.sessionId);
		if (prepared?.entry) {
			acquirePublishedEntry({
				...row,
				publishedSource: prepared.source,
				unresolvedDatabaseFacts: void 0
			}, prepared.entry, databaseFacts);
			return;
		}
		if (prepared?.sharing) {
			const sharing = prepared.sharing;
			const next = row.entry?.sessionId !== sharing.sessionId || row.entry.lifecycleRevision !== sharing.lifecycleRevision ? renewGeneration(row) : { ...row };
			next.publishedSource = prepared.source;
			next.sharingEntry = sharing;
			if (sharing.archivedAt !== void 0 && !owner.registryFactsReady()) owner.deferArchive(next);
			else owner.defer(next);
			return;
		}
		if (!sharingUnchanged && (!facts || facts.kind === "entry" || change.factsInvalidated || facts.kind === "owner" && (row.sharingEntry?.sessionId !== facts.sessionId || (row.sharingEntry.lifecycleRevision ?? null) !== facts.lifecycleRevision) || (facts.kind === "member" || facts.kind === "category") && row.sharingEntry?.sessionId !== facts.sessionId)) row.sharingEntry = void 0;
		owner.defer(row);
	};
}
function subscribeSessionRowPublications({ rows, dirty, revisions, advanceRevision, ensureMaterialized, publishTranscript, invalidateMembership, mark, mutateGeneration }) {
	return [
		pluginStatePublication.subscribeFacts((change) => {
			const changed = [];
			for (const row of rows.values()) {
				if (!row.runtimeOwnershipDependencies || !pluginStateReadDependenciesAffected(row.runtimeOwnershipDependencies, change)) continue;
				invalidateDatabaseFacts(row, row.retainedDatabaseFacts && {
					...row.retainedDatabaseFacts,
					runtimeOwnership: void 0,
					runtimeOwnershipDependencies: void 0
				});
				dirty.add(identity(row));
				changed.push(row);
			}
			if (changed.length > 0) {
				advanceRevision();
				revisions.invalidate(true);
				for (const row of changed) revisions.publishFacts(row);
				queueMicrotask(() => void ensureMaterialized().catch(() => {}));
			}
		}),
		sessionChanges.subscribeFacts(publishTranscript),
		sessionChanges.subscribeFacts(invalidateMembership),
		sessionChanges.subscribeProjection(mark),
		onSessionLifecycleEvent((change) => {
			if (change.reason !== "participants") mark(change);
		}),
		onSessionIdentityMutation(mutateGeneration)
	];
}
//#endregion
//#region src/gateway/session-row-projection-shared-facts.ts
function prepareSessionRowSharedFacts({ rows, facts, env, shared }) {
	const sharedRows = rows.flatMap((row) => {
		const prepared = facts.get(identity(row));
		if (!prepared) return [];
		if (!prepared.entry) prepared.acpMeta = null;
		if (!prepared.entry?.repositoryWorkspaceId) prepared.repositoryWorkspace = null;
		return prepared.acpMeta !== void 0 && prepared.repositoryWorkspace !== void 0 ? [] : [{
			row,
			prepared
		}];
	});
	if (!sharedRows.length) return;
	return {
		assertCurrent: () => shared.admission.assertCurrent(),
		reply: executeExistingOpenClawStateRead({
			env,
			path: resolveOpenClawStateSqlitePath(env)
		}, {
			type: "sessionRows.sharedFacts",
			entries: sharedRows.map(({ row, prepared }) => ({
				...prepared.acpMeta === void 0 ? { acp: {
					keys: [buildAcpDatabaseSessionKey(normalizeStoreSessionKey(row.key), row.agentId)],
					entry: {
						sessionId: prepared.entry?.sessionId,
						lifecycleRevision: prepared.entry?.lifecycleRevision,
						sessionStartedAt: prepared.entry?.sessionStartedAt
					}
				} } : {},
				...prepared.repositoryWorkspace === void 0 && prepared.entry?.repositoryWorkspaceId ? { repositoryWorkspace: {
					agentId: row.agentId,
					sessionKey: row.key,
					workspaceId: prepared.entry.repositoryWorkspaceId
				} } : {}
			}))
		}, { context: shared }),
		accept(reply) {
			if (reply && (!reply.ok || reply.type !== "sessionRows.sharedFacts")) throw new Error("Unexpected session row shared-state facts");
			for (const [index, { prepared }] of sharedRows.entries()) {
				const sharedFacts = reply?.rows[index];
				if (prepared.acpMeta === void 0) prepared.acpMeta = sharedFacts?.acp ? rowToAcpSessionMeta(sharedFacts.acp) : null;
				if (prepared.repositoryWorkspace === void 0) prepared.repositoryWorkspace = sharedFacts?.repositoryWorkspace ?? null;
			}
		}
	};
}
//#endregion
//#region src/gateway/session-row-database-facts.ts
/** Retain each selected store until its prepared facts have entered the resident row owner. */
async function withSessionRowDatabaseFacts(owner, consume) {
	const ids = [];
	for (const id of owner.selected ?? owner.dirty) {
		ids.push(id);
		if (ids.length === 64) break;
	}
	if (consume.refreshPending(ids)) return;
	const retained = /* @__PURE__ */ new Map();
	for (const id of ids) {
		const facts = owner.rows.get(id)?.retainedDatabaseFacts;
		if (facts && isPreparedSessionRowDatabaseFacts(facts) && canRetainSessionRowRuntimeOwnership(facts)) retained.set(id, facts);
	}
	if (retained.size > 0) {
		consume.accept([...retained.keys()], retained);
		return;
	}
	const rows = ids.flatMap((id) => owner.rows.get(id) ?? []);
	const rowRevisions = new Map(rows.map((row) => [identity(row), row.databaseFactsRevision]));
	const env = owner.env;
	const shared = captureOpenClawStateReadWorkerContext({
		env,
		path: resolveOpenClawStateSqlitePath(env)
	});
	const groups = /* @__PURE__ */ new Map();
	const actorFacts = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const agentId = normalizeAgentId(row.storeTarget.agentId);
		const pathname = resolveOpenClawAgentSqlitePath({
			agentId,
			path: row.storeTarget.storePath,
			env
		});
		const key = JSON.stringify([agentId, pathname]);
		let group = groups.get(key);
		if (!group) {
			const candidate = captureSessionStoreReadCandidate(pathname);
			group = {
				database: {
					agentId,
					path: candidate.physicalPath,
					env
				},
				candidate,
				rows: []
			};
			groups.set(key, group);
		}
		if (!row.retainedDatabaseFacts) {
			const facts = readSessionActorRowFacts({
				path: group.database.path,
				sessionKey: row.key
			});
			if (facts) actorFacts.set(identity(row), facts);
			else group.rows.push(row);
		}
	}
	const selected = [...groups.values()];
	const readGroups = selected.filter((group) => group.rows.length > 0);
	const native = retainOpenClawAgentDatabaseReadCandidates(selected.flatMap(({ candidate }) => [candidate, {
		...candidate,
		path: candidate.physicalPath
	}]), env);
	const continuations = [];
	const assertCurrent = () => {
		for (const { candidate } of selected) assertSessionStoreReadCandidate(candidate.path, [candidate]);
		for (const continuation of continuations) continuation.owner.assertCurrent();
	};
	const ownershipReads = /* @__PURE__ */ new Map();
	try {
		for (const database of native.databases) {
			const continuation = captureCanonicalSessionReaderContinuation(database);
			if (continuation) continuations.push({
				agentId: database.agentId,
				path: captureSessionStoreReadCandidate(database.path).physicalPath,
				owner: continuation
			});
		}
		assertCurrent();
		await withSessionHistoryWorkerDatabases(readGroups.map(({ database }) => database), async (owners) => {
			const facts = new Map(rows.flatMap((row) => {
				const previous = row.retainedDatabaseFacts;
				if (!previous) return [];
				const prepared = { ...previous };
				if (isPreparedSessionRowDatabaseFacts(previous) && !canRetainSessionRowRuntimeOwnership(previous)) {
					prepared.runtimeOwnership = void 0;
					prepared.runtimeOwnershipDependencies = void 0;
				}
				return [[identity(row), prepared]];
			}));
			for (const [id, row] of actorFacts) facts.set(id, row);
			for (const [index, group] of readGroups.entries()) {
				const databaseOwner = expectDefined(owners[index], "captured session row database");
				const continuation = continuations.find((item) => item.agentId === group.database.agentId && item.path === group.database.path)?.owner;
				const reply = await databaseOwner.readRowFacts({
					env,
					sessionKeys: [...new Set(group.rows.map((row) => row.key))],
					continuation: continuation?.receipt
				});
				continuation?.assertCurrent();
				const byKey = new Map(reply.rows.map((row) => [row.sessionKey, row]));
				for (const row of group.rows) {
					const prepared = byKey.get(row.key);
					if (prepared) facts.set(identity(row), { ...prepared });
				}
			}
			const sharedRead = prepareSessionRowSharedFacts({
				rows,
				facts,
				env,
				shared
			});
			if (sharedRead) sharedRead.accept(await sharedRead.reply);
			for (const row of rows) {
				const prepared = facts.get(identity(row));
				if (prepared && prepared.runtimeOwnership === void 0) for (let attempt = 0; attempt < 2; attempt++) try {
					const ownership = await capturePluginStateReadDependencies(() => readSessionRuntimeOwnershipAsync({
						config: owner.cfg,
						agentId: row.agentId,
						sessionKey: row.key,
						storePath: row.storeTarget.storePath,
						sessionEntry: prepared.entry,
						readPreparedPreviousSessionId: () => prepared.entry?.previousSessionId,
						assertCurrent
					}));
					ownershipReads.set(identity(row), ownership);
					prepared.runtimeOwnership = ownership.value ?? null;
					prepared.runtimeOwnershipDependencies = ownership.dependencies;
					delete prepared.runtimeOwnershipRetryPending;
					break;
				} catch (error) {
					if (!(error instanceof SessionRuntimeOwnershipChanged)) throw error;
					prepared.runtimeOwnership = null;
					prepared.runtimeOwnershipDependencies = [];
					prepared.runtimeOwnershipRetryPending = true;
				}
			}
			const preparedFacts = /* @__PURE__ */ new Map();
			for (const [id, row] of facts) if (isPreparedSessionRowDatabaseFacts(row)) preparedFacts.set(id, row);
			await owner.prepareRegistryFacts();
			for (const databaseOwner of owners) databaseOwner.assertCurrent();
			sharedRead?.assertCurrent();
			assertCurrent();
			if (owner.isActive()) {
				const currentIds = rows.filter((row) => (owner.dirty.has(identity(row)) || owner.selected?.has(identity(row)) && isColdArchivedSessionRow(owner.rows.get(identity(row)) ?? row)) && isCurrentGeneration(row, owner.rows.get(identity(row))) && owner.rows.get(identity(row))?.databaseFactsRevision === rowRevisions.get(identity(row)) && (ownershipReads.get(identity(row))?.isCurrent() ?? true)).map(identity);
				consume.accept(currentIds, preparedFacts);
				assertCurrent();
			}
		}, projectionLane);
	} finally {
		for (const ownership of ownershipReads.values()) ownership.release();
		for (const continuation of continuations.toReversed()) continuation.owner.release();
		native.release();
	}
}
//#endregion
//#region src/gateway/session-row-projection-refresh.ts
const MAX_CONCURRENT_EXACT_ROW_READS = 2;
/** Refreshes borrow projection state; the projection retains revisions, rows, and archive custody. */
function createSessionRowRefresh(owner) {
	const materializer = createSessionRowMaterializer({
		...owner,
		isActive: () => !owner.state().disposed
	});
	const exactReads = /* @__PURE__ */ new Map();
	const queuedExactReads = /* @__PURE__ */ new Map();
	const bulkReads = /* @__PURE__ */ new Map();
	let activeExactReads = 0;
	let exactReadBytes = 0;
	let exactPreparations = 0;
	let exactPreparationsIdle;
	const selectionPreparations = /* @__PURE__ */ new Map();
	const runtimeOwnershipRetries = /* @__PURE__ */ new Set();
	let refreshing;
	function releaseExactRead(id, read) {
		exactReads.delete(id);
		exactReadBytes -= read.bytes;
	}
	async function readExactBatch(batch) {
		try {
			if (!owner.state().disposed) {
				const selected = new Set([...batch.keys()].filter((id) => {
					const row = owner.rows.get(id);
					return row && (owner.dirty.has(id) || isColdArchivedSessionRow(row));
				}));
				if (selected.size > 0) {
					await owner.runAsOwner(() => readRows(selected, { archived: true }));
					await yieldSessionListWork();
				}
			}
			for (const read of batch.values()) read.completion.resolve();
		} catch (error) {
			for (const read of batch.values()) read.completion.reject(error);
		} finally {
			for (const [id, read] of batch) releaseExactRead(id, read);
			activeExactReads--;
			queueMicrotask(dispatchExactReads);
		}
	}
	function dispatchExactReads() {
		while (activeExactReads < MAX_CONCURRENT_EXACT_ROW_READS && queuedExactReads.size > 0) {
			const batch = /* @__PURE__ */ new Map();
			let store;
			for (const [id, read] of queuedExactReads) {
				if (batch.size === 64 || store && store !== read.store) break;
				store = read.store;
				batch.set(id, read);
				queuedExactReads.delete(id);
			}
			activeExactReads++;
			readExactBatch(batch);
		}
	}
	function pendingExactRows(queries) {
		const { cfg } = owner.state();
		const selected = /* @__PURE__ */ new Set();
		for (const query of queries) {
			const key = resolveStoredSessionKeyForAgentStore({
				cfg,
				sessionKey: query.key,
				agentId: query.agentId
			});
			if (isIncognitoSessionKey(key)) continue;
			const row = owner.lookup(query);
			if (row && (owner.dirty.has(identity(row)) || isColdArchivedSessionRow(row))) selected.add(identity(row));
		}
		return selected;
	}
	function prepareExactRows(queries) {
		if (owner.state().disposed) return;
		const selected = pendingExactRows(queries);
		if (selected.size === 0) return;
		const joined = new Set([...selected].flatMap((id) => bulkReads.get(id) ?? []));
		const missing = [...selected].filter((id) => !exactReads.has(id) && !bulkReads.has(id));
		const bytes = missing.reduce((total, id) => total + 6 * id.length + 3, 0);
		if (exactReads.size + missing.length > 8192 || exactReadBytes + bytes > 268435456) throw new WorkerTaskError("Session row preparation capacity reached", "overloaded");
		for (const id of missing) {
			const row = owner.rows.get(id);
			const read = {
				completion: createDeferredCore(),
				store: `${row.storeTarget.agentId}\0${row.storeTarget.storePath}`,
				bytes: 6 * id.length + 3
			};
			exactReads.set(id, read);
			queuedExactReads.set(id, read);
			exactReadBytes += read.bytes;
		}
		for (const id of selected) if (!isColdArchivedSessionRow(owner.rows.get(id))) owner.dirty.add(id);
		queueMicrotask(dispatchExactReads);
		const exact = Promise.all([...selected].flatMap((id) => exactReads.get(id)?.completion.promise ?? []));
		if (joined.size === 0) return exact.then(() => void 0);
		return Promise.all([exact, ...joined]).then(() => prepareExactRows(queries));
	}
	function readRows(selected, options = {}) {
		return withSessionRowDatabaseFacts({
			rows: owner.rows,
			dirty: owner.dirty,
			selected,
			isActive: () => !owner.state().disposed,
			prepareRegistryFacts: owner.prepareRegistryFacts,
			cfg: owner.state().cfg,
			env: owner.env
		}, {
			refreshPending: options.materialize === false ? () => false : materializer.refreshPending,
			accept: (ids, facts) => {
				materializer.accept(ids, facts, options);
				for (const id of ids) if (owner.rows.get(id)?.retainedDatabaseFacts?.runtimeOwnershipRetryPending) runtimeOwnershipRetries.add(id);
				else runtimeOwnershipRetries.delete(id);
			}
		});
	}
	function selectionNeedsPreparation(options = {}) {
		const metadataOnly = options.metadataOnly === true;
		const state = owner.state();
		if (state.disposed) return false;
		if (state.topologyDirty || !state.registryPrepared || !metadataOnly && owner.catalog.needsInitialRead || owner.membership.needsPreparation) return true;
		for (const id of owner.dirty) if (rowNeedsDatabaseRead(id, metadataOnly)) return true;
		return false;
	}
	function rowNeedsDatabaseRead(id, metadataOnly = false) {
		const row = owner.rows.get(id);
		if (metadataOnly) return Boolean(row && (!row.storedEntry || row.sharingEntry !== row.storedEntry || row.entryAcquisitionPending || row.unresolvedDatabaseFacts));
		const facts = row?.retainedDatabaseFacts;
		return !isPreparedSessionRowDatabaseFacts(facts) || !canRetainSessionRowRuntimeOwnership(facts) && !row?.pendingDatabaseFacts;
	}
	function retainExactPreparation() {
		exactPreparations++;
		exactPreparationsIdle ??= createDeferredCore();
		let retained = true;
		return () => {
			if (!retained) return;
			retained = false;
			if (--exactPreparations === 0) {
				const idle = exactPreparationsIdle;
				exactPreparationsIdle = void 0;
				idle?.resolve();
			}
		};
	}
	function prepareSelection(options = {}) {
		const metadataOnly = options.metadataOnly === true;
		if (!metadataOnly && !owner.state().disposed && !owner.catalog.needsInitialRead) owner.runAsOwner(() => owner.catalog.refresh());
		if (options.yieldForCatalog && owner.catalog.isRefreshing) return yieldSessionListWork().then(() => prepareSelection({ metadataOnly }));
		if (!selectionNeedsPreparation(options)) {
			if (!owner.state().disposed) owner.prepare();
			return;
		}
		const selectionPending = selectionPreparations.get(metadataOnly);
		if (selectionPending) return selectionPending;
		const release = retainExactPreparation();
		const preparation = owner.runAsOwner(async () => {
			try {
				const attempted = /* @__PURE__ */ new Set();
				while (selectionNeedsPreparation(options)) {
					for (let pending = owner.prepareRegistryFacts(); pending; pending = owner.prepareRegistryFacts()) await pending;
					if (owner.state().topologyDirty) await owner.topology();
					if (owner.state().disposed || owner.state().topologyDirty) continue;
					await owner.membership.prepare();
					if (owner.state().registryPrepared) for (const id of owner.dirty) {
						const row = owner.rows.get(id);
						if (row?.entryAcquisitionPending && row.storedEntry && row.sharingEntry === row.storedEntry && !row.unresolvedDatabaseFacts) owner.acquireEntry(row, row.storedEntry);
					}
					if (!metadataOnly && owner.catalog.needsInitialRead) await owner.catalog.refresh();
					const selected = /* @__PURE__ */ new Set();
					const held = /* @__PURE__ */ new Set();
					for (const id of owner.dirty) {
						if (attempted.has(id) || !rowNeedsDatabaseRead(id, metadataOnly)) continue;
						const pending = bulkReads.get(id) ?? exactReads.get(id)?.completion.promise;
						if (pending) held.add(pending);
						else if (selected.add(id).size === 64) break;
					}
					if (selected.size === 0 && held.size === 0) break;
					for (const id of selected) attempted.add(id);
					if (selected.size > 0) {
						const read = createDeferredCore();
						for (const id of selected) bulkReads.set(id, read.promise);
						try {
							await readRows(selected, { materialize: false });
						} finally {
							for (const id of selected) bulkReads.delete(id);
							read.resolve();
						}
					} else await Promise.all(held);
				}
				if (!owner.state().disposed) owner.prepare();
			} finally {
				selectionPreparations.delete(metadataOnly);
				release();
			}
		});
		selectionPreparations.set(metadataOnly, preparation);
		return preparation;
	}
	async function refreshBatch() {
		for (let pending = exactPreparationsIdle; pending && !owner.state().disposed; pending = exactPreparationsIdle) {
			const state = owner.state();
			if (!state.topologyDirty && state.registryPrepared && !owner.catalog.needsInitialRead && !owner.placementFacts.needsPreparation && !owner.membership.needsPreparation) {
				const ids = [];
				for (const id of exactReads.keys()) {
					ids.push(id);
					if (ids.length === 128) break;
				}
				if (materializer.refreshPending(ids)) return;
			}
			await pending.promise;
		}
		for (let pending = owner.prepareRegistryFacts(); pending; pending = owner.prepareRegistryFacts()) await pending;
		if (owner.state().disposed) return;
		if (owner.state().topologyDirty) {
			await owner.topology();
			if (owner.state().disposed || owner.state().topologyDirty) return;
		}
		await owner.membership.prepare();
		if (owner.catalog.needsInitialRead) await owner.catalog.refresh();
		await owner.placementFacts.prepare();
		for (let pending = owner.prepareRegistryFacts(); pending; pending = owner.prepareRegistryFacts()) await pending;
		if (exactPreparations > 0 || owner.state().topologyDirty || owner.membership.needsPreparation || owner.placementFacts.needsPreparation) return;
		const selected = /* @__PURE__ */ new Set();
		const held = /* @__PURE__ */ new Set();
		for (const id of owner.dirty) {
			const exact = exactReads.get(id);
			if (exact && !owner.rows.get(id)?.pendingDatabaseFacts) held.add(exact.completion.promise);
			else if (selected.add(id).size === 64) break;
		}
		const read = createDeferredCore();
		for (const id of selected) bulkReads.set(id, read.promise);
		try {
			await readRows(selected);
		} finally {
			for (const id of selected) if (bulkReads.get(id) === read.promise) bulkReads.delete(id);
			read.resolve();
		}
		if (selected.size === 0) {
			await Promise.allSettled(held);
			await yieldSessionListWork();
		}
	}
	return {
		refresh: materializer.refresh,
		refreshBatch() {
			return refreshing ??= refreshBatch().finally(() => {
				refreshing = void 0;
			});
		},
		prepareExactRows,
		prepareSelection,
		selectionNeedsPreparation,
		retainExactPreparation,
		async withSelectionPreparation(consume) {
			const release = retainExactPreparation();
			try {
				for (const id of runtimeOwnershipRetries) {
					const row = owner.rows.get(id);
					if (row?.retainedDatabaseFacts?.runtimeOwnershipRetryPending) {
						row.pendingDatabaseFacts = void 0;
						owner.dirty.add(id);
					}
				}
				runtimeOwnershipRetries.clear();
				return await consume();
			} finally {
				release();
			}
		},
		dispose() {
			runtimeOwnershipRetries.clear();
			exactPreparationsIdle?.resolve();
			for (const [id, read] of queuedExactReads) {
				read.completion.reject(/* @__PURE__ */ new Error("Session row projection is no longer active"));
				releaseExactRead(id, read);
			}
			queuedExactReads.clear();
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-revisions.ts
/** Sharing fences every publication; selection holds only unchanged metadata. */
function createSessionRowProjectionRevisions(rows, byKey) {
	let sharing;
	let selection;
	const selectionListeners = /* @__PURE__ */ new Set();
	const factsListeners = /* @__PURE__ */ new Set();
	const publishFacts = (row) => {
		const change = row ? {
			kind: "row",
			key: row.key
		} : { kind: "reset" };
		notifyListeners(factsListeners, change, () => notifyListeners(factsListeners, { kind: "reset" }));
	};
	const invalidate = (metadataChanged = false) => {
		sharing = void 0;
		if (metadataChanged) selection = void 0;
	};
	const publishSelection = (row, removed = false) => {
		if (!row) invalidate(true);
		const change = row ? {
			kind: "row",
			id: identity(row),
			key: row.key,
			agentId: row.agentId,
			row: removed ? void 0 : selectionRow(row)
		} : { kind: "reset" };
		notifyListeners(selectionListeners, change, () => notifyListeners(selectionListeners, { kind: "reset" }));
	};
	return {
		onSelectionChange(listener) {
			selectionListeners.add(listener);
		},
		onFactsChange(listener) {
			factsListeners.add(listener);
		},
		publishFacts,
		publishRuntimeChange(change) {
			if ("all" in change) {
				publishFacts();
				return;
			}
			publishFacts({ key: change.sessionKey });
			for (const id of byKey.get(`key:${change.sessionKey}`) ?? []) {
				const row = rows.get(id);
				for (const aliasId of row?.entry ? byKey.get(`id:${row.entry.sessionId}`) ?? [] : []) {
					const alias = rows.get(aliasId);
					if (alias) publishFacts(alias);
				}
			}
		},
		publishSelection,
		publishTranscript(row, fields, cfg, context) {
			const current = rows.get(identity(row));
			if (ready(current) && publishTranscriptFields(current, fields, cfg, context)) publishFacts(current);
		},
		dispose() {
			publishSelection();
			publishFacts();
			selectionListeners.clear();
			factsListeners.clear();
		},
		sharing: () => sharing ??= {},
		selection: () => selection ??= {},
		invalidate,
		materialized(row, previousBoard) {
			const changed = row.hasBoard !== previousBoard;
			invalidate(changed);
			publishFacts(row);
			if (changed && !isIncognitoSessionKey(row.key)) publishSelection(row);
		},
		replace(previous, row) {
			const changed = !previous || previous.generation !== row.generation || previous.hasBoard !== row.hasBoard || !isDeepStrictEqual(previous.entry, row.entry);
			invalidate(changed);
			publishFacts(row);
			if (changed) publishSelection(row);
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-transcript.ts
const TRANSCRIPT_REFRESH_WINDOW_MS = 1e3;
function retainedTranscriptFacts(row) {
	const facts = row.retainedDatabaseFacts ?? row.pendingDatabaseFacts;
	return isPreparedSessionRowDatabaseFacts(facts) && facts.entry === row.storedEntry ? facts : void 0;
}
/** Transcript notifications refresh presentation using installed row facts. */
function createSessionRowProjectionTranscriptUpdates(params) {
	const windows = /* @__PURE__ */ new Map();
	let disposed = false;
	function remove(id) {
		const window = windows.get(id);
		if (window) {
			clearTimeout(window.timer);
			windows.delete(id);
		}
	}
	function startWindow(id) {
		const timer = setTimeout(() => {
			const window = windows.get(id);
			windows.delete(id);
			const row = params.read(id);
			if (!row) return;
			if (window?.pending) {
				startWindow(id);
				params.refresh(id, retainedTranscriptFacts(row));
			}
		}, TRANSCRIPT_REFRESH_WINDOW_MS);
		timer.unref();
		windows.set(id, {
			timer,
			pending: false
		});
	}
	const stop = onInternalSessionTranscriptUpdate((update) => {
		const change = update.target;
		if (disposed || !change) return;
		const query = {
			...change,
			key: change.sessionKey
		};
		let found = /* @__PURE__ */ new Set([...params.matching(query), ...params.matching(query, "id")]);
		const cold = found.size === 0;
		if (cold) {
			params.mark(change);
			found = /* @__PURE__ */ new Set([...params.matching(query), ...params.matching(query, "id")]);
		}
		for (const row of found) {
			const id = identity(row);
			const pending = row.pendingDatabaseFacts !== void 0;
			const retained = retainedTranscriptFacts(row);
			row.retainedDatabaseFacts = retained;
			row.databaseFactsRevision++;
			if (pending) params.refresh(id, retained);
			if (row.entry?.archivedAt !== void 0 && !row.materialized) continue;
			const window = windows.get(id);
			if (window) {
				window.pending = true;
				continue;
			}
			startWindow(id);
			if (!cold && !pending) params.refresh(id, retained);
		}
	});
	return {
		remove,
		publish(change) {
			if (disposed || !("sessionKey" in change) || change.scope !== "transcript") return;
			const fact = readPreparedSessionTranscriptChange(change);
			if (!fact || fact.kind === "unchanged") return;
			const source = readPreparedSessionEntryPublicationSource(change);
			for (const row of params.matching({
				...change,
				key: change.sessionKey
			})) {
				if (source.identity !== params.store(row.storeTarget.storePath)?.identity) continue;
				const pending = row.pendingDatabaseFacts !== void 0;
				const facts = row.retainedDatabaseFacts ?? row.pendingDatabaseFacts;
				const retained = !change.factsInvalidated && fact.kind === "postimage" && fact.value.sessionId === facts?.entry?.sessionId && isPreparedSessionRowDatabaseFacts(facts) ? {
					...facts,
					activitySummaryWatermark: {
						generation: fact.value.generation,
						maxSeq: fact.value.rawSeq
					},
					transcriptPreview: fact.value.lastMessagePreview,
					transcriptTerminalModel: fact.value.terminalModel
				} : void 0;
				row.retainedDatabaseFacts = retained;
				if (!retained || pending || retained.transcriptPreview !== void 0 || readSessionActivitySummary(facts?.entry)) params.refresh(identity(row), retained);
				else row.databaseFactsRevision++;
			}
		},
		dispose() {
			disposed = true;
			stop();
			for (const id of windows.keys()) remove(id);
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection.ts
/** Committed publications own invalidation; each admitted physical store is hydrated once. */
async function createSessionRowProjection(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const profileCatalogPath = resolveOpenClawStateSqlitePath(env);
	const discoveryRead = prepareAgentDatabaseDeletionSnapshotRead({ env }, "runtime");
	const subagents = createSubagentSessionListReadView({ env });
	if (!subagents.snapshotIdentity()) await subagents.prepare();
	let cfg = params.getConfig?.() ?? params.cfg;
	const getPolicyConfig = () => params.getPolicyConfig?.() ?? params.getConfig?.() ?? cfg;
	const rows = /* @__PURE__ */ new Map();
	const creators = createSessionRowCreatorIndex();
	const membership = createSessionMembershipProjection();
	const { invalidateRowMembership, readSessionRowEntry, createStoreRead } = createSessionRowEntryReadAccess(membership);
	let stores = /* @__PURE__ */ new Map();
	const byStore = /* @__PURE__ */ new Map(), byAgent = /* @__PURE__ */ new Map();
	const byParent = /* @__PURE__ */ new Map(), byKey = /* @__PURE__ */ new Map();
	const indexes = {
		byStore,
		byAgent,
		byParent,
		byKey
	};
	const dirty = /* @__PURE__ */ new Set();
	const rowFacts = createSessionRowFactsReadiness(rows, () => projection);
	let topologyDirty = true, disposed = false;
	const registryRead = createSessionRowRegistryRead({
		env,
		stores: () => stores,
		isActive: () => !disposed && !topologyDirty,
		runAsOwner: inOwnerContext
	});
	const prepareRegistryFacts = () => disposed ? void 0 : !inOwnerContext(subagents.snapshotIdentity) ? inOwnerContext(subagents.prepare) : registryRead.prepare();
	const placementFacts = createSessionRowPlacementProjection(params.placementFactsReader, () => !disposed && topologyDirty ? topology() : prepareRegistryFacts(), env);
	let epoch = 0;
	let preparingTopology;
	const revisions = createSessionRowProjectionRevisions(rows, byKey);
	let materializedCount = 0;
	let scope;
	const ensureMaterialized = createSessionProjectionDrain({
		beforeEnsure() {
			if (!disposed && !catalog.needsInitialRead) inOwnerContext(() => catalog.refresh());
		},
		hasWork: needsMaterialization,
		refresh: () => refreshBatch(),
		needsYield: () => dirty.size > 0 || topologyDirty,
		idle: () => catalog.isRefreshing ? yieldSessionListWork() : Promise.resolve(),
		runAsOwner: inOwnerContext
	});
	const catalog = createSessionRowProjectionCatalog({
		modelCatalog: params.modelCatalog,
		getModelCatalog: params.getModelCatalog,
		onInvalidated: () => mark({
			all: true,
			scope: "catalog"
		}),
		onRefreshed(changedAgents) {
			if (!changedAgents || changedAgents.size > 0) {
				epoch++;
				revisions.invalidate();
				revisions.publishFacts();
				metadata.invalidate({
					all: true,
					scope: "catalog"
				});
				archive.invalidateRows({
					all: true,
					scope: "catalog",
					runtimeOwnershipChanged: true
				}, changedAgents ? [...changedAgents].flatMap((agentId) => matching({ agentId })) : rows.values());
			}
			ensureMaterialized().catch(() => {});
		}
	});
	const metadata = createSessionRowProjectionContext(subagents);
	const backfill = createSessionRowProjectionBackfill({
		ready: ensureMaterialized,
		read: (id) => rows.get(id),
		current: isCurrent,
		publish: (row, fields) => revisions.publishTranscript(row, fields, cfg, metadata.current)
	});
	const archive = createSessionRowProjectionArchive({
		rows,
		dirty,
		put,
		config: () => cfg,
		context: () => metadata.current,
		referenced,
		invalidateTranscript: backfill.remove,
		release(id) {
			transcriptUpdates.remove(id);
			backfill.remove(id);
			dirty.delete(id);
		},
		invalidateFacts(row) {
			row.publishedSource = void 0;
			rowFacts.invalidate(row, true);
		}
	});
	const markRelated = (row, includeChildren = true) => archive.markRelated(row, indexes, includeChildren);
	function remove(id) {
		archive.forget(id);
		transcriptUpdates.remove(id);
		const row = rows.get(id);
		if (row) {
			rowFacts.track(row, void 0);
			revisions.invalidate(true);
			invalidateRowMembership(row);
			markRelated(row);
			creators.update(row);
			index(row, indexes, true);
			rows.delete(id);
			revisions.publishFacts(row);
			revisions.publishSelection(row, true);
			markRelated(row);
			if (row.entry && !byKey.has(`id:${row.entry.sessionId}`)) placementFacts.forget(row.entry.sessionId);
		}
		dirty.delete(id);
		backfill.remove(id);
	}
	function put(row) {
		const previous = rows.get(identity(row));
		creators.update(previous, row);
		if (previous) {
			if (previous.generation !== row.generation) transcriptUpdates.remove(identity(row));
			index(previous, indexes, true);
		}
		rows.set(identity(row), row);
		rowFacts.track(row, row.unresolvedDatabaseFacts);
		index(row, indexes);
		placementFacts.update(row, previous, (sessionId) => [...byKey.get(`id:${sessionId}`) ?? []].flatMap((id) => rows.get(id) ?? []));
		revisions.replace(previous, row);
	}
	function acquireEntry(row, storedEntry) {
		if (storedEntry?.archivedAt !== void 0) inOwnerContext(() => metadata.prepare(epoch, cfg, matching, put, referenced));
		return acquireSessionRowEntry({
			row,
			storedEntry,
			cfg,
			context: metadata.current,
			referenced,
			remove,
			put,
			markRelated,
			archive
		});
	}
	const matching = (query, kind = "key") => selectMatchingSessionRows({
		rows,
		indexes,
		scope
	}, query, kind);
	const assertActive = () => {
		if (disposed) throw new Error("Session row projection is no longer active");
	};
	const lookup = (query) => disposed ? void 0 : lookupSessionRow(query, {
		cfg,
		rows,
		byKey,
		scope,
		stores,
		assertCurrent: assertActive
	});
	function referenced(ref) {
		return firstReferenced(ref, rows, byKey, stores.keys());
	}
	function enqueue(row) {
		if (row) dirty.add(identity(row));
	}
	const markStoredRow = createSessionRowPublication({
		store: (path) => stores.get(path),
		runAsOwner: inOwnerContext,
		registryFactsReady: () => Boolean(inOwnerContext(subagents.snapshotIdentity)),
		acquireEntry,
		markRelated,
		placement: placementFacts,
		invalidateFacts: (row, domain) => rowFacts.invalidate(row, domain),
		enqueue,
		defer(row) {
			put(row);
			enqueue(row);
		},
		deferArchive: (row) => archive.deferAcquisition(row),
		remove
	});
	function topology() {
		if (disposed || !topologyDirty && isUserProfileCatalogReady(profileCatalogPath)) return Promise.resolve();
		return preparingTopology ??= inOwnerContext(async () => {
			if (!isUserProfileCatalogReady(profileCatalogPath)) (await prepareUserProfileCatalog({ env })).release();
			if (disposed || !topologyDirty) return;
			const revision = epoch;
			const nextConfig = params.getConfig?.() ?? cfg;
			const prepared = await discoveryRead.readWithCurrentAdmission();
			prepared.assertCurrent();
			if (disposed || epoch !== revision) return;
			const discovery = {
				env,
				snapshot: prepared.snapshot
			};
			for (;;) {
				if (disposed || epoch !== revision) break;
				try {
					const storeRead = createStoreRead({
						stores,
						rows,
						byStore,
						env
					});
					await storeRead.loadCombinedStore(nextConfig, discovery, (load, scopeTargets) => {
						prepared.assertCurrent();
						if (disposed || epoch !== revision) return;
						const loaded = load();
						cfg = nextConfig;
						const acquisitions = seedSessionRowEntries({
							targets: loaded.targetsBySessionKey,
							rows,
							replaced: storeRead.replaced,
							remove,
							put
						});
						stores = storeRead.sources;
						for (const { row, entry } of acquisitions) {
							enqueue(acquireEntry(row, entry));
							markRelated(row);
						}
						storeRead.updateMembership();
						scope = prepareSessionRowScopes(cfg, byAgent.keys(), new Map([...stores].map(([locator, source]) => [source.filename, locator])), scopeTargets);
						revisions.publishSelection();
						topologyDirty = false;
					});
					break;
				} catch (error) {
					if (!(error instanceof SessionRowFactsPending)) throw error;
					await prepareExactRows(error.queries);
				}
			}
		}).finally(() => {
			preparingTopology = void 0;
		});
	}
	function mark(original, prepared) {
		if (isSessionStoreTopologyChange(original) && isOpenClawAgentDatabaseRegistryChange(original) && registryRead.isCurrent()) return;
		const change = rowFacts.conservativeChange(original, (path) => scope?.physicalPaths(path) ?? [path]);
		if (change !== original) membership.invalidate(change);
		if ("all" in change && (change.scope === "config-presentation" || change.scope === "config-profiles")) cfg = inOwnerContext(() => params.getConfig?.() ?? cfg);
		epoch++;
		const identityRevision = metadata.current.identityProjection?.revision;
		const presentationOnly = metadata.invalidate(change) && !change.factsInvalidated;
		const catalogOnly = "all" in change && change.scope === "catalog" && !change.factsInvalidated;
		revisions.publishRuntimeChange(change);
		if (!presentationOnly || metadata.current.identityProjection?.revision !== identityRevision) revisions.invalidate(!catalogOnly);
		placementFacts.invalidateChange(change);
		if ("all" in change) {
			if (isSessionStoreTopologyChange(change) || change.scope === "config") topologyDirty = true;
			if (change.scope === "catalog" || change.scope === "config") catalog.invalidate();
			if (!presentationOnly && (!catalogOnly || !params.getModelCatalog)) archive.invalidateRows(change, typeof change.scope === "string" ? rows.values() : matching(change.scope));
		} else if (!change.factsInvalidated && (change.scope === "automation" || presentationOnly)) {
			const affected = matching({ key: change.sessionKey }).filter((row) => !isColdArchivedSessionRow(row));
			for (const row of affected) {
				if (change.agentId && row.agentId !== change.agentId) continue;
				const id = identity(row);
				if (presentationOnly && ready(row) && !dirty.has(id) && row.facts) row.facts.refreshActivitySummary();
				else dirty.add(id);
			}
		} else if (!presentationOnly) visitSessionRowPublicationTargets(change, {
			matching,
			scope,
			stores,
			publish: (row) => {
				if (change.scope === "transcript" || change.factsInvalidated === true) backfill.remove(identity(row));
				markStoredRow(row, change, prepared);
			}
		});
		ensureMaterialized().catch(() => {});
	}
	const { readSourceEntry, readChildLinks, readPreparedSpawnedBy } = createSessionRowRelationReads({
		env,
		inOwnerContext,
		isReady: () => !disposed && !topologyDirty,
		assertCurrent: assertActive,
		preparedContext: () => metadata.readPrepared(epoch),
		lookup,
		config: () => cfg,
		rows,
		byParent,
		dirty,
		referenced,
		readEntry: readSessionRowEntry,
		acquireEntry
	});
	function materialize(row, configuredAgentIds = new Set(listAgentIds(cfg)), readRow = readResidentSessionRow, preparedDatabaseFacts, repositoryWorkspace) {
		const retained = row.retainedDatabaseFacts;
		const databaseFacts = preparedDatabaseFacts ?? (isPreparedSessionRowDatabaseFacts(retained) ? retained : void 0);
		if (!row.entry || !databaseFacts && !isIncognitoSessionKey(row.key)) return false;
		const links = readChildLinks(row, databaseFacts !== void 0);
		if (!isIncognitoSessionKey(row.key)) row.membership = new Set(membership.membership(row.storeTarget.storePath, row.key) ?? []);
		const prepared = readRow({
			row: {
				...row,
				entry: row.entry
			},
			cfg,
			modelCatalog: catalog.current,
			configuredAgentIds,
			context: metadata.current,
			subagentInputs: metadata.subagentInputs,
			gatewayContext: params.context,
			placementFactsReader: placementFacts,
			links,
			readSourceEntry: (key) => readSourceEntry(row, key, databaseFacts !== void 0),
			databaseFacts,
			repositoryWorkspace
		});
		if (!isIncognitoSessionKey(row.key)) placementFacts.register(row.entry.sessionId);
		const previousBoard = row.hasBoard;
		Object.assign(row, prepared, {
			materializedSequence: ++materializedCount,
			...metadata.materializedRevisions
		});
		if (!isIncognitoSessionKey(row.key) && ready(row)) backfill.prepare(row, databaseFacts);
		revisions.materialized(row, previousBoard);
		return true;
	}
	const { refresh, refreshBatch, prepareExactRows, prepareSelection, selectionNeedsPreparation, withSelectionPreparation, retainExactPreparation, dispose: disposeRefresh } = createSessionRowRefresh({
		rows,
		dirty,
		env,
		state: () => ({
			cfg,
			disposed,
			topologyDirty: topologyDirty || !isUserProfileCatalogReady(profileCatalogPath),
			registryPrepared: Boolean(inOwnerContext(subagents.snapshotIdentity))
		}),
		runAsOwner: inOwnerContext,
		lookup,
		prepareRegistryFacts,
		topology,
		catalog,
		placementFacts,
		membership,
		prepare: () => {
			metadata.prepare(epoch, cfg, matching, put, referenced);
			return cfg;
		},
		acquireEntry,
		materialize,
		forgetBackfill: backfill.remove,
		retainArchived: (row) => archive.describe(row)
	});
	function needsMaterialization() {
		return !disposed && (topologyDirty || !isUserProfileCatalogReady(profileCatalogPath) || catalog.needsInitialRead || dirty.size > 0 || membership.needsPreparation || placementFacts.needsPreparation || !inOwnerContext(() => metadata.readPrepared(epoch)));
	}
	const transcriptUpdates = createSessionRowProjectionTranscriptUpdates({
		matching,
		mark,
		read: (id) => rows.get(id),
		store: (path) => stores.get(path),
		refresh(id, retained) {
			const row = rows.get(id);
			if (!row || isColdArchivedSessionRow(row) && !row.pendingDatabaseFacts) return;
			epoch++;
			revisions.invalidate();
			invalidateDatabaseFacts(row, retained);
			if (retained && ready(row) && !dirty.has(id) && row.facts) {
				row.facts.refreshActivitySummary(retained);
				backfill.prepare(row, retained);
				revisions.publishFacts(row);
				return;
			}
			dirty.add(id);
			revisions.publishFacts(row);
			ensureMaterialized().catch(() => {});
		}
	});
	const generations = createSessionRowGenerationObservations({
		config: () => inOwnerContext(() => params.getConfig?.() ?? cfg),
		isActive: () => !disposed,
		stores: () => stores,
		isCurrent,
		matching,
		markRelated,
		put,
		remove,
		dirty,
		mark,
		ensureMaterialized
	});
	const stop = subscribeSessionRowPublications({
		rows,
		dirty,
		revisions,
		advanceRevision: () => epoch++,
		ensureMaterialized,
		publishTranscript: (change) => transcriptUpdates.publish(change),
		invalidateMembership: membership.invalidate,
		mark,
		mutateGeneration: generations.mutate
	});
	function isCurrent(row) {
		return row.privateSource ? isPrivateSourceCurrent(row.privateSource) : isCurrentGeneration(row, rows.get(identity(row)));
	}
	function prepareRead() {
		if (topologyDirty || !isUserProfileCatalogReady(profileCatalogPath)) return false;
		metadata.prepare(epoch, cfg, matching, put, referenced);
		return true;
	}
	const describe = createSessionRowDescriptionReader({
		runInOwner: inOwnerContext,
		prepare: () => !disposed && prepareRead(),
		lookup,
		dirty,
		refresh,
		describeArchived: (row) => archive.describe(row),
		isCurrent,
		materializePrivate: (row, repository) => materialize(row, void 0, void 0, void 0, repository),
		preparePresentation(row) {
			row.materialized.source.cfg = cfg;
			metadata.preparePresentation(row, readChildLinks);
		}
	});
	function dispose() {
		disposed = true;
		revisions.dispose();
		registryRead.dispose();
		generations.invalidate();
		disposeRefresh();
		metadata.dispose();
		catalog.dispose();
		membership.dispose();
		placementFacts.dispose();
		transcriptUpdates.dispose();
		backfill.dispose();
		for (const unsubscribe of stop) unsubscribe();
		for (const map of [
			rows,
			stores,
			byStore,
			byAgent,
			byParent,
			byKey,
			dirty
		]) map.clear();
		rowFacts.clear();
		creators.dispose();
		archive.clear();
	}
	const selectEntries = createSessionRowEntrySelector({
		isActive: () => !disposed,
		runAsOwner: inOwnerContext,
		prepare: prepareRead,
		state: () => ({
			cfg,
			scope,
			byAgent,
			byParent,
			rows,
			dirty,
			matching,
			acquire: (row) => acquireEntry(row, row.retainedDatabaseFacts?.entry ?? readSessionRowEntry(row)),
			referenced
		})
	});
	await inOwnerContext(async () => {
		stop.push((await prepareUserProfileCatalog({ env })).release);
		await ensureSessionGroupCatalog();
		for (;;) {
			await refreshBatch();
			if (disposed || !topologyDirty) return;
		}
	}).catch((error) => {
		dispose();
		throw error;
	});
	ensureMaterialized().catch(() => {});
	backfill.start();
	const { needsExactMembershipPreparation, prepareMembershipFacts, ...membershipRead } = createSessionRowMembershipReadAccess({
		membership,
		runInOwner: inOwnerContext,
		isActive: () => !disposed,
		topologyDirty: () => topologyDirty,
		topology,
		lookup,
		stores: () => stores,
		owner: () => projection,
		needsRowFactsPreparation: rowFacts.needsPreparation,
		prepareRowFacts: rowFacts.prepare
	});
	const projection = {
		...createSessionRowLookup({
			assertCurrent: assertActive,
			state: () => ({
				cfg,
				scope,
				stores,
				disposed,
				topologyDirty,
				registryPrepared: !disposed && Boolean(inOwnerContext(subagents.snapshotIdentity))
			}),
			lookup,
			matching,
			acquireEntry,
			env,
			runInOwner: inOwnerContext
		}),
		onSelectionChange: revisions.onSelectionChange,
		onFactsChange: revisions.onFactsChange,
		observeGeneration: generations.observeGeneration,
		readPreparedRowContext: () => disposed ? void 0 : inOwnerContext(() => metadata.readPrepared(epoch)),
		readPreparedSpawnedBy,
		describe,
		...createSessionRowAncestorReads({
			state: () => ({
				cfg,
				context: metadata.current
			}),
			referenced,
			lookup,
			prepareExactRows,
			prepareSelection,
			retainExactPreparation,
			retainArchiveRows: archive.retainRows,
			describe,
			inOwnerContext,
			placementFacts,
			membership: {
				prepare: prepareMembershipFacts,
				needsPreparation: needsExactMembershipPreparation
			},
			isActive: () => !disposed,
			projection: () => projection
		}),
		setArchivePageSize: archive.setPageSize,
		modelFacts: createSessionRowModelFactsReader({
			lookup,
			dirty,
			readSourceEntry,
			state: () => ({
				cfg,
				modelCatalog: catalog.current,
				rowContext: metadata.current
			})
		}),
		present: (record, options) => present(record, metadata.current, options),
		ensureMaterialized,
		prepareSelection,
		withSelectionPreparation,
		needsSelectionPreparation: selectionNeedsPreparation,
		...membershipRead,
		get materializedCount() {
			return materializedCount;
		},
		get dirtyRowCount() {
			return dirty.size;
		},
		get needsMaterialization() {
			return needsMaterialization();
		},
		getPolicyConfig,
		get sharingRevision() {
			return disposed || topologyDirty ? void 0 : revisions.sharing();
		},
		get state() {
			if (!disposed && !prepareRead()) throw new Error("Session row topology changed; prepare current facts before reading");
			return {
				revision: revisions.selection(),
				cfg,
				policyConfig: getPolicyConfig(),
				modelCatalog: catalog.current,
				rowContext: metadata.current,
				scope: scope.select
			};
		},
		isCurrent,
		selectEntries,
		listCreatedActors: () => creators.list(() => projection.state.scope({}).paths, matching),
		snapshot: (query, options = {}) => snapshot(describe(query), metadata.current, options),
		dispose
	};
	return projection;
}
//#endregion
export { createSessionRowProjection as t };

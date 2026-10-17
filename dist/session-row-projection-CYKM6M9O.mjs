import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { c as readDatabaseIdentityBirthtime, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { D as withAgentRosterFactsBatch } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as sessionChanges, t as isSessionStoreTopologyChange } from "./session-row-changes-BcJIdta8.mjs";
import { g as readAgentRunIndexVersion, t as buildProjectedAgentRunIndex } from "./agent-run-registry-BaxMDLZF.mjs";
import { g as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-dWNS6Rcs.mjs";
import { n as prepareAgentDatabaseDeletionSnapshotRead } from "./agent-deletion-journal.read-Bkjt0nDs.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead, o as isOpenClawAgentDatabaseRegistryChange } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { m as listOpenIncognitoAgentDatabases, u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, l as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as onInternalSessionTranscriptUpdate } from "./transcript-events-DUHAZLVw.mjs";
import { a as prepareUserProfileCatalog, p as retainUserProfileCatalog } from "./user-profile-list-CtETKur7.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as registerPreparedModelRuntimePublicationListener } from "./prepared-model-runtime.publication-events-BgGkJc_Y.mjs";
import { c as captureSessionStoreReadCandidate, s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { c as withSessionHistoryWorkerDatabases, s as withSessionHistoryWorkerDatabase, u as projectionLane } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { a as projectSqliteSessionParticipants, c as withPreparedSessionParticipants, t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { N as readCommittedIncognitoSessionSharing, _ as readPreparedSessionSharingChange, a as readCommittedSessionEntryCache, g as readPreparedSessionEntryChange } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { m as withCanonicalSessionValidationDeferral, s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { o as readBoardSessionKeys } from "./sqlite-board-store.kernel-4NufZP3t.mjs";
import { i as onSessionLifecycleEvent, r as onSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { O as findSessionRepositoryWorkspaces, k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { p as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { r as prepareSessionStoreTargetInventory, t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { c as selectStoredSessionLineage, o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { t as readAcpSessionMetaForEntries } from "./session-meta-readonly-CvCR0QQG.mjs";
import { r as listSessionMembers } from "./sessions-D_sxp1B4.mjs";
import { t as isFailedWorkerPlacementEnvironmentGone } from "./placement-target-B4CmGwso.mjs";
import { n as canRedispatchFailedWorkerPlacement } from "./session-placement-lifecycle-D5GPja58.mjs";
import { f as getSubagentRegistryPublicationRevision, m as subscribeSubagentRunChanges, u as subagentRuns } from "./subagent-registry-memory-guooOkCK.mjs";
import { r as createSubagentSessionListReadView } from "./subagent-registry-state-CVSclnHX.mjs";
import { n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-BE_xWkJl.mjs";
import { s as resolveGatewaySessionStoreTargetWithStore, t as createGatewaySessionEntryReader } from "./session-utils-store-lookup-CuE1uM7x.mjs";
import { a as resolveGatewaySessionStoreTargets, n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-BS1S2ivy.mjs";
import { A as seedSessionRowEntries, B as projectGatewaySessionRunState, C as physical, D as readSessionRowParents, E as readSessionRowLineage, F as materializeSessionRow, G as readSessionRowModelFacts, I as projectSessionRowChildLinks, L as readSessionRowInputs, M as snapshot, N as sort, O as ready, R as refreshSessionRowProfiles, S as parentReference, T as publishTranscriptFields, W as buildSessionSwarmSummary, _ as invalidateDatabaseFacts, a as acquireSessionRowEntry, b as markAutomation, c as createIncognitoSessionRow, d as dependents, f as first, g as index, h as identity, i as withReadySessionRows, k as renewGeneration, l as createSessionRowProjectionRevisions, m as hasEntry, n as privateSessionRowReadKey, o as changesSessionRowDependents, p as firstReferenced, q as isSessionPermissionChangePending, r as withPreparedSessionRows, s as create, t as SessionRowFactsPending, u as dematerialize, v as isCurrentGeneration, w as present, x as markRelated, y as isPrivateSourceCurrent } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { t as readSessionFallbackModel } from "./session-fallback-model-GrIUyRG6.mjs";
import { n as createSessionIdentityProjection } from "./session-identity-projection-C_gwtUz2.mjs";
import { n as readPreparedGatewayModelCatalogMetadata } from "./server-model-catalog-view-muuNaRwE.mjs";
import { t as deriveSessionTitle } from "./session-utils-core-CxvBHP5P.mjs";
import { n as buildSessionListRowMetadataContext, t as buildProjectedSubagentActivity } from "./session-utils-projection-CwKHGoI0.mjs";
import { a as resolveUtilityModelRefForAgent } from "./utility-model-zUQQg0xn.mjs";
import { t as ensureSessionGroupCatalog } from "./session-group-catalog-DEO_bQ_M.mjs";
import { a as yieldSessionListWork, i as yieldSessionListBackgroundWork, n as createSessionProjectionDrain, t as canRunSessionListBackgroundWork } from "./session-projection-work-BJ52HUIn.mjs";
import { a as readWorkerPlacementIdentity, i as projectWorkerSessionPlacement, r as projectWorkerPlacementMove } from "./placement-projector-B2Va-t9n.mjs";
import { n as projectSessionActivitySummary } from "./session-activity-summary-state-BbNlhTKJ.mjs";
import { statSync } from "node:fs";
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
		if (disposed || !("all" in change) && change.scope === "automation") return;
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
			if (!change.factsInvalidated && (!facts || facts.kind === "unchanged" || facts.kind === "owner")) return;
			for (const store of matching(change)) {
				store.revision++;
				if (change.factsInvalidated) {
					store.facts.delete(change.sessionKey);
					store.dirty.add(change.sessionKey);
					continue;
				}
				if (!facts || facts.kind === "unchanged" || facts.kind === "owner") continue;
				if (facts.kind === "removed") {
					store.facts.delete(change.sessionKey);
					store.dirty.delete(change.sessionKey);
					continue;
				}
				const previous = store.facts.get(change.sessionKey);
				if (!previous || !previous[4] || store.initial || store.all || store.dirty.has(change.sessionKey) || facts.kind === "entry" && previous[4] !== facts.previousSessionId || (facts.kind === "member" || facts.kind === "category") && previous[4] !== facts.sessionId || facts.kind === "participants" && !facts.projection) {
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
	const { cfg, entry, placementFactsReader } = params;
	const { key, agentId, storeTarget } = params.target;
	const context = params.context ?? {};
	let placementSource = placementFactsReader?.getProjectionFacts(entry.sessionId);
	const readPlacementFacts = () => {
		const { placement, move, environment, workspaceResultReconciling = false, workspaceRecoveryPending = false } = placementSource ?? {};
		return {
			placement,
			move,
			workspaceResultReconciling,
			environment,
			identity: placement ? readWorkerPlacementIdentity(placement, context.workerEnvironmentService, environment ?? null) : void 0,
			failedRecoveryAction: placement?.state === "failed" ? isFailedWorkerPlacementEnvironmentGone({
				environmentService: context.workerEnvironmentService ? { get: () => environment } : void 0,
				placement
			}) ? "restart" : "stop-first" : void 0,
			retryOnSend: placement?.state === "failed" && !move && !workspaceRecoveryPending && canRedispatchFailedWorkerPlacement(placement, environment)
		};
	};
	let placementFacts = readPlacementFacts();
	const activitySummary = projectSessionActivitySummary({
		key,
		agentId,
		storeTarget,
		cfg,
		entry,
		enabled: params.activitySummaryEnabled,
		watermark: params.databaseFacts?.activitySummaryWatermark
	});
	return {
		hasBoard: params.databaseFacts?.hasBoard ?? readSessionRowHasBoard({
			key,
			storeTarget
		}),
		present: () => {
			const currentSource = placementFactsReader?.getProjectionFacts(entry.sessionId);
			if (currentSource !== placementSource) {
				placementSource = currentSource;
				placementFacts = readPlacementFacts();
			}
			const { placement, move, workspaceResultReconciling, environment, identity, failedRecoveryAction, retryOnSend } = placementFacts;
			return {
				...placement ? { placement: projectWorkerSessionPlacement(placement, context.workerPlacementDiskSpaceReader?.read(placement), context.workerPlacementRunnerAvailabilityReader?.read(placement, environment ?? null), identity, failedRecoveryAction, workspaceResultReconciling, retryOnSend, { workerRuntimeInstall: context.workerPlacementRuntimeInstallReader?.read(placement, environment ?? null) }) } : {},
				...move ? { placementMove: projectWorkerPlacementMove(move) } : {},
				permissionModePending: isSessionPermissionChangePending(entry.sessionId),
				activitySummary: activitySummary ? { ...activitySummary } : void 0
			};
		}
	};
}
function readSessionRowHasBoard(target) {
	const { key, storeTarget } = target;
	const board = withOpenClawAgentDatabaseReadOnly((database) => readBoardSessionKeys(database, [key]).has(key), {
		agentId: storeTarget.agentId,
		path: storeTarget.storePath
	});
	return board.found && board.value;
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
	const readPins = /* @__PURE__ */ new Map();
	const pinCounts = /* @__PURE__ */ new Map();
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
			if (!pinCounts.has(id)) demote(params.rows.get(id));
		}
	}
	function unpin(id) {
		const count = pinCounts.get(id);
		if (count === 1) pinCounts.delete(id);
		else pinCounts.set(id, count - 1);
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
			params.enqueue(id);
		},
		isCurrentMaterialization(row) {
			const current = params.rows.get(identity(row));
			return ready(current) && (current.entry.archivedAt === void 0 || current.materialized === row.materialized);
		},
		invalidateRows(change, candidates) {
			const catalogOnly = change.scope === "catalog" && !change.factsInvalidated;
			for (const row of candidates) {
				if (change.factsInvalidated) params.invalidateFacts(row);
				if (catalogOnly && row.entry?.archivedAt === void 0) {
					if (!params.dirty.has(identity(row))) row.pendingDatabaseFacts = row.retainedDatabaseFacts;
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
				params.enqueue(identity(row), change);
			}
		},
		setPageSize: (size) => {
			limit = Math.max(DEFAULT_ARCHIVED_MATERIALIZED_ROWS, size);
			trim();
		},
		retainRows() {
			const token = Symbol("archived session rows");
			readPins.set(token, /* @__PURE__ */ new Set());
			return {
				update(ids) {
					const previous = readPins.get(token);
					if (!previous) return;
					const next = new Set(ids);
					for (const id of previous) if (!next.has(id)) unpin(id);
					for (const id of next) if (!previous.has(id)) pinCounts.set(id, (pinCounts.get(id) ?? 0) + 1);
					readPins.set(token, next);
					trim();
				},
				release() {
					const ids = readPins.get(token);
					if (!ids) return;
					readPins.delete(token);
					for (const id of ids) unpin(id);
					trim();
				}
			};
		},
		forget: (id) => materialized.delete(id),
		clear() {
			materialized.clear();
			readPins.clear();
			pinCounts.clear();
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
//#region src/gateway/session-row-projection-materialize.ts
/** Apply committed metadata before observers without reacquiring it from SQLite. */
function createSessionRowPublication(owner) {
	function acquirePublishedEntry(row, entry) {
		owner.markRelated(row, changesSessionRowDependents(row.storedEntry, entry));
		owner.runAsOwner(() => {
			if (entry.archivedAt !== void 0 && !owner.registryFactsReady()) {
				const previous = row.storedEntry ?? row.entry;
				const changedIdentity = previous && (previous.sessionId !== entry.sessionId || previous.lifecycleRevision !== entry.lifecycleRevision);
				owner.deferArchive({
					...changedIdentity ? renewGeneration(row) : row,
					publishedSource: row.publishedSource,
					storedEntry: entry,
					sharingEntry: entry
				});
				return;
			}
			owner.enqueue(owner.acquireEntry(row, entry));
		});
	}
	return function publish(row, change, prepared = readPreparedSessionEntryChange(change, row.key)) {
		const source = prepared?.source;
		const previousSource = row.publishedSource;
		if (source && previousSource?.incarnation === source.incarnation && previousSource.revision !== void 0 && source.revision !== void 0 && previousSource.revision > source.revision) return;
		const store = owner.store(row.storeTarget.storePath);
		if (prepared && (!source || store?.identity !== source.identity || store.birthtime !== source.birthtime || store.filename !== source.filename)) return;
		const facts = change.facts;
		const sharingUnchanged = !change.factsInvalidated && (facts?.kind === "unchanged" || !change.storePath && !facts && change.scope !== "session-entry");
		if (facts?.kind === "removed") {
			owner.remove(identity(row));
			return;
		}
		if (prepared && !prepared.entry && !prepared.sharing) return;
		invalidateDatabaseFacts(row);
		if (!prepared && !change.factsInvalidated && facts?.kind === "owner" && row.sharingEntry?.sessionId === facts.sessionId && (row.sharingEntry.lifecycleRevision ?? null) === facts.lifecycleRevision) {
			const { owner: _previousOwner, ...entry } = row.sharingEntry;
			const next = freezeJsonSnapshot({
				...entry,
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
		if (row.entry && change.scope !== "session-entry") owner.invalidatePlacement(row.entry.sessionId);
		if (prepared?.entry) {
			acquirePublishedEntry({
				...row,
				publishedSource: prepared.source,
				unresolvedDatabaseFacts: void 0
			}, prepared.entry);
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
/** Bind live projection state to the same prepared or resident source-read boundary. */
function createSessionRowModelFactsReader(params) {
	return (query, metadataPrepared = false) => {
		const row = params.lookup(query);
		if (!row?.entry) throw new Error("Session changed while preparing search facts; retry the request");
		return readSessionRowModelFacts({
			...params.state(),
			...row,
			source: {
				entry: row.storedEntry,
				readSourceEntry: (key) => params.readSourceEntry(row, key, metadataPrepared)
			}
		});
	};
}
/** Exact descriptions use the projection's custody and materialization owners in one frame. */
function createSessionRowDescriptionReader(owner) {
	return (query, captured, repositoryWorkspace) => owner.runInOwner(() => {
		if (!owner.prepare()) return;
		let row = owner.lookup(query);
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
	});
}
/** One synchronous refresh slice shares agent policy; each later slice starts fresh. */
function createSessionRowMaterializationBatch() {
	const activitySummaryEnabledByAgent = /* @__PURE__ */ new Map();
	return (params) => readResidentSessionRow(params, activitySummaryEnabledByAgent);
}
/** Keyed and worker-prepared refreshes share the same bounded materialization slice. */
function createSessionRowMaterializer(owner) {
	function refresh(ids, accepted = false) {
		if (!owner.isActive()) return;
		const started = performance.now();
		const cfg = owner.prepare();
		withAgentRosterFactsBatch(cfg, () => {
			const configuredAgentIds = new Set(listAgentIds(cfg));
			const readRow = createSessionRowMaterializationBatch();
			for (const [offset, id] of ids.entries()) {
				if (offset > 0 && performance.now() - started >= 12) break;
				const current = owner.rows.get(id), revision = owner.revision();
				const databaseFacts = accepted ? current?.pendingDatabaseFacts : void 0;
				if (accepted && !databaseFacts) continue;
				if (!accepted && current?.unresolvedDatabaseFacts === "category") continue;
				const row = current && (accepted ? current : owner.acquireEntry(current, owner.readEntry(current)));
				if (row && isColdArchivedSessionRow(row) && !accepted) {
					owner.dirty.delete(id);
					owner.forgetBackfill(id);
					continue;
				}
				if (row && owner.materialize(row, configuredAgentIds, readRow, databaseFacts) && owner.revision() === revision) {
					row.pendingDatabaseFacts = void 0;
					owner.dirty.delete(id);
					if (accepted && ready(row) && row.entry.archivedAt !== void 0) owner.retainArchived(row);
				}
				if (owner.revision() !== revision) break;
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
			const revision = owner.revision();
			withAgentRosterFactsBatch(cfg, () => {
				for (const id of ids) {
					const current = owner.rows.get(id);
					const databaseFacts = facts.get(id);
					const row = current && owner.acquireEntry(databaseFacts ? {
						...current,
						hasBoard: databaseFacts.hasBoard,
						unresolvedDatabaseFacts: void 0
					} : current, databaseFacts?.entry);
					if (owner.revision() !== revision) break;
					if (row && databaseFacts) row.preparedAcpMeta = databaseFacts.acpMeta;
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
	const databaseFacts = params.databaseFacts ?? prepared?.databaseFacts;
	const source = isIncognitoSessionKey(row.key) && !prepared ? resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: row.key,
		agentId: row.agentId,
		exactRead: true,
		projection: "list",
		includeStoreChildEntries: true
	}) : void 0;
	const { inputs, presentation } = readSessionRowInputs({
		...row,
		cfg,
		preparedAcpMeta: databaseFacts ? databaseFacts.acpMeta : row.preparedAcpMeta,
		preparedRepositoryWorkspace: databaseFacts ? databaseFacts.repositoryWorkspace : params.repositoryWorkspace,
		configuredAgentIds: params.configuredAgentIds,
		store: prepared?.entries ?? source?.store ?? {},
		storePath: row.storeTarget.storePath,
		storeAgentId: row.storeTarget.agentId,
		active: source ? void 0 : false,
		activeModel: source ? void 0 : row.fallbackModel ?? null,
		modelCatalog: params.modelCatalog,
		modelSource: {
			entry: row.storedEntry,
			readSourceEntry: prepared ? (key) => prepared.entries[key] : source ? createGatewaySessionEntryReader({
				cfg,
				...source
			}) : params.readSourceEntry
		},
		rowContext: context,
		includeDerivedTitles: Boolean(source),
		includeLastMessage: Boolean(source),
		skipTranscriptUsageFallback: true,
		includeSwarmChildren: true,
		childLinks: source || prepared ? void 0 : params.links
	});
	if (!source) {
		inputs.derivedTitle = deriveSessionTitle(row.entry, void 0, inputs.displayName);
		inputs.lastMessagePreview = row.lastMessagePreview;
	}
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
		membership: source ? new Set(listSessionMembers({
			...row.storeTarget,
			sessionKey: row.key
		}).map((member) => member.identityId)) : row.membership
	};
}
function readSessionRowEntry(row) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const cache = readCommittedSessionEntryCache(database.db);
		const cached = cache?.get(row.key);
		const entry = cache ? cached && projectSqliteSessionParticipants(database.db, row.key, cached) : readExactSessionEntryRow(database, row.key, "list")?.entry;
		if (entry && isIncognitoSessionKey(row.key)) {
			row.generation = readOpenClawAgentDatabaseIdentity(database).identity;
			row.privateSource = {
				identity: row.generation,
				assertCurrent() {
					if (!database.db.isOpen || getOpenClawAgentDatabaseIfOpen({
						agentId: database.agentId,
						path: database.path
					})?.db !== database.db) throw new Error("Private session database changed during its read");
					const current = readCommittedIncognitoSessionSharing(database.db, row.key)?.entry;
					if (current?.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision) throw new Error("Private session changed during its read");
				}
			};
		}
		return entry;
	}, {
		agentId: row.storeTarget.agentId,
		path: row.storeTarget.storePath
	});
	return result.found ? result.value : void 0;
}
/** Exact incognito acquisition never admits an ephemeral store to the resident roster. */
function readIncognitoSessionRow(params) {
	const { cfg, key, agentId } = params;
	const ephemeralPath = resolveIncognitoOpenClawAgentSqlitePath({ agentId });
	if (!listOpenIncognitoAgentDatabases().some((store) => store.storePath === ephemeralPath)) return;
	const row = create({
		key,
		agentId,
		storeTarget: {
			agentId,
			storePath: ephemeralPath
		}
	});
	const storedEntry = readSessionRowEntry(row);
	if (!storedEntry || !row.privateSource) return;
	return createIncognitoSessionRow({
		cfg,
		key,
		agentId,
		storePath: ephemeralPath,
		entry: storedEntry,
		source: row.privateSource
	});
}
/** Resident identities use indexes; private identities remain exact process-local reads. */
function findSessionRowById(query, owner) {
	if (owner.disposed) return [];
	if (query.agentId && query.storePath && isIncognitoOpenClawAgentSqlitePath(query.storePath, { agentId: query.agentId })) {
		const key = resolveSessionKeyBySessionId(query);
		if (!key || query.federated && isInternalSessionEffectsKey(key)) return [];
		const row = owner.lookup({
			...query,
			agentId: query.agentId,
			key
		});
		return row?.entry?.sessionId === query.sessionId && (!query.federated || row.entry.incognito === true) ? [row] : [];
	}
	const candidates = owner.matching({
		...query,
		key: query.sessionId
	}, "id");
	if (!query.federated) return candidates;
	const selected = candidates.length ? [...new Set(candidates.map((row) => row.key))].flatMap((key) => {
		const paths = owner.scope.select(query).paths;
		const row = first(owner.matching({
			...query,
			key
		}).filter((candidate) => paths.has(candidate.storeTarget.storePath)), paths.keys());
		return row?.entry?.sessionId === query.sessionId ? [row] : [];
	}) : [];
	for (const store of listOpenIncognitoAgentDatabases()) if ((!query.agentId || query.agentId === store.agentId) && (!query.storePath || query.storePath === store.storePath)) selected.push(...findSessionRowById({
		...query,
		...store
	}, owner));
	return selected;
}
function lookupSessionRow(query, owner) {
	if (owner.disposed) return;
	const { agentId } = query;
	const exact = owner.matching(query).filter((row) => row.agentId === agentId);
	if (exact.length) return first(exact, owner.storePaths);
	const key = resolveStoredSessionKeyForAgentStore({
		cfg: owner.cfg,
		sessionKey: query.key,
		agentId
	});
	if (isIncognitoSessionKey(key)) return readIncognitoSessionRow({
		cfg: owner.cfg,
		key,
		agentId
	});
	const candidates = owner.matching({
		...query,
		key
	}).filter((row) => row.agentId === agentId);
	return first(candidates, owner.storePaths);
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
			const source = params.stores().get(row.storeTarget.storePath);
			if (!source && isIncognitoSessionKey(row.key)) return;
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
			const read = {
				sources,
				replaced,
				loadCombinedStore(cfg, discovery) {
					return loadCombinedSessionStoreForGatewayCore(cfg, {
						discovery,
						includeIncognito: false,
						preserveSentinelOwners: "physical",
						loadEntries: read.loadEntries,
						onStoreLoaded(target, agentId, owner) {
							const source = sources.get(target.storePath);
							if (source) {
								source.agentId = agentId;
								source.discoveryAgentId = owner?.agentId ?? null;
								source.discoveryOrder = owner?.order;
							}
						}
					});
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
				},
				loadEntries: (target, projection) => {
					const opened = withOpenClawAgentDatabaseReadOnly(readOpenClawAgentDatabaseIdentity, {
						agentId: target.agentId,
						path: target.storePath,
						env: params.env
					});
					if (!opened.found) return [];
					const previous = findStoreGeneration(stores, target.storePath, opened.value);
					sources.set(target.storePath, {
						target,
						agentId: previous?.agentId ?? target.agentId,
						discoveryAgentId: null,
						identity: opened.value.identity,
						birthtime: opened.value.birthtime,
						filename: opened.value.filename
					});
					if (previous) return [...byStore.get(previous.target.storePath) ?? []].flatMap((id) => {
						const row = rows.get(id);
						const entry = row && (row.storedEntry ?? readSessionRowEntry$1(row));
						return row && entry ? [{
							sessionKey: row.key,
							entry
						}] : [];
					});
					replaced.add(target.storePath);
					const entryScope = {
						...target,
						projection,
						clone: false,
						env: params.env
					};
					return listSessionEntriesReadOnly(entryScope, { deferParticipants: true });
				}
			};
			return read;
		}
	};
}
//#endregion
//#region src/gateway/session-row-placement-projection.ts
const MAX_CONCURRENT_PLACEMENT_READS = 2;
const MAX_COALESCED_PLACEMENT_IDS = 256;
const MAX_COALESCED_PLACEMENT_BYTES = 65536;
/** Placement facts share the resident row lifecycle; private exact reads retain only their frame. */
function createSessionRowPlacementProjection(reader, prepareReadFacts) {
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
	const acquireRead = (ids, kind) => {
		if (disposed) throw new Error("Session row projection is no longer active");
		const covers = (batch) => batch.kind === kind && !batch.staleAll && ids.every((id) => batch.ids.has(id) && !batch.stale.has(id));
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
			if ("all" in change && (change.scope === "worker-placements" || change.scope === "worker-environments" || change.scope === "stores")) owner.invalidate();
		},
		update(row, previous, related) {
			if (row.entry && (row.entry.archivedAt === void 0 || row.materialized)) owner.register(row.entry.sessionId);
			else if (row.entry && registered.has(row.entry.sessionId) && !related(row.entry.sessionId).some((other) => other.entry && (other.entry.archivedAt === void 0 || other.materialized))) owner.forget(row.entry.sessionId);
			if (previous?.entry && previous.entry.sessionId !== row.entry?.sessionId && related(previous.entry.sessionId).length === 0) owner.forget(previous.entry.sessionId);
		},
		async withPreparedRows(projection, isActive, lookup, queries, prepareRows, consume, prepareSelection) {
			const signal = getAsyncWorkSignal();
			const assertActive = () => {
				signal?.throwIfAborted();
				if (disposed || !isActive()) throw new Error("Session row projection is no longer active");
			};
			const prepareFacts = () => prepareReadFacts() ?? prepareSelection?.();
			let deferred;
			let preparedQueries = [];
			let selectedIds = [];
			const privateRepositories = /* @__PURE__ */ new Map();
			let privateSelections = [];
			let selectedConfig;
			const selectRows = () => {
				const selected = withCanonicalSessionValidationDeferral(() => {
					const cfg = projection.state.cfg;
					if (selectedConfig !== cfg) {
						privateRepositories.clear();
						selectedConfig = cfg;
					}
					privateSelections = [];
					preparedQueries = queries(cfg);
					const ids = [];
					for (const query of preparedQueries) {
						const row = inOwnerContext(() => lookup(query));
						const key = privateSessionRowReadKey(cfg, query);
						if (key && row?.entry?.repositoryWorkspaceId) privateSelections.push({
							key,
							row,
							workspaceId: row.entry.repositoryWorkspaceId
						});
						if (row?.entry) ids.push(row.entry.sessionId);
					}
					return ids;
				});
				deferred = selected.kind === "pending" ? selected : void 0;
				selectedIds = selected.kind === "complete" ? selected.value : [];
				if (privateRepositories.size) {
					const selectedPrivateKeys = new Set(privateSelections.map(({ key }) => key));
					for (const key of privateRepositories.keys()) if (!selectedPrivateKeys.has(key)) privateRepositories.delete(key);
				}
			};
			const prepareSelectedRows = () => {
				if (deferred) return;
				let pending;
				const prepared = withCanonicalSessionValidationDeferral(() => {
					pending = inOwnerContext(() => prepareRows(preparedQueries));
					if (pending) return;
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
				});
				deferred = prepared.kind === "pending" ? prepared : void 0;
				return pending;
			};
			const consumeRows = () => deferred ?? withPreparedSessionRows(projection, isActive, () => preparedQueries, (read) => consume(read, preparedQueries), privateRepositories);
			const prepare = () => {
				const pending = prepareFacts();
				if (pending) return pending;
				selectRows();
				return prepareSelectedRows();
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
					return await consumeRows();
				}
				const read = acquireRead(requested, "exact");
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
					const previous = exact;
					let result;
					exact = prepared;
					try {
						result = consumeRows();
					} finally {
						exact = previous;
						prepared.clear();
					}
					return await result;
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
						const database = getOpenIncognitoAgentDatabase(agentId, resolveIncognitoOpenClawAgentSqlitePath({
							agentId,
							env: owner.env
						}));
						try {
							return database && readCommittedIncognitoSessionSharing(database.db, storedKey)?.entry;
						} catch {
							return;
						}
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
						owner.assertExactRowsPrepared(targets);
						return consume(read);
					}, options?.selection ? owner.prepareSelection : void 0);
					if (prepared.kind === "pending") return prepared;
					if (prepared.value !== membershipPending) return {
						kind: "complete",
						value: prepared.value
					};
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
/** Optional transcript facts keep the row generation and foreground admission on the host. */
async function backfillSessionRowTranscriptFields(params) {
	if (params.shouldCommit?.() === false) return {};
	const { shouldCommit, sessionEntry, model, ...scope } = params;
	const input = {
		...scope,
		includeTerminalModel: model !== void 0,
		sessionEntry: {
			sessionId: sessionEntry.sessionId,
			updatedAt: sessionEntry.updatedAt,
			status: sessionEntry.status,
			lastRunId: sessionEntry.lastRunId,
			fallbackNotice: sessionEntry.fallbackNotice ? { ...sessionEntry.fallbackNotice } : void 0
		}
	};
	return withSessionHistoryWorkerDatabase(toDatabaseOptions(resolveSqliteTranscriptReadScope({
		...input,
		agentId: params.storeAgentId ?? params.agentId
	})), async (owner) => {
		const { terminalModel, ...fields } = await owner.readRowBackfill(input);
		owner.assertCurrent();
		if (shouldCommit?.() === false) return {};
		const fallback = model && readSessionFallbackModel({
			...model,
			sessionEntry,
			sessionScope: {
				...scope,
				agentId: params.storeAgentId ?? params.agentId
			},
			terminalModel: terminalModel ?? null
		});
		return {
			...fields,
			...fallback ? { fallbackModel: {
				provider: fallback.modelProvider,
				model: fallback.model
			} } : {}
		};
	}, projectionLane);
}
//#endregion
//#region src/gateway/session-row-projection-backfill.ts
/** Optional transcript work never participates in row readiness or a foreground response. */
function createSessionRowProjectionBackfill(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const queued = /* @__PURE__ */ new Set();
	let pending;
	let activeId;
	let started = false;
	let disposed = false;
	async function drain() {
		for (;;) {
			if (disposed || !queued.size) return;
			await yieldSessionListBackgroundWork();
			await params.ready();
			if (disposed) return;
			if (!canRunSessionListBackgroundWork()) continue;
			const id = queued.values().next().value;
			if (id === void 0) continue;
			queued.delete(id);
			const row = params.read(id);
			const entry = row?.entry;
			if (!row || !entry) continue;
			activeId = id;
			const current = () => !disposed && !queued.has(id) && params.current(row);
			let interrupted = false;
			const shouldCommit = () => {
				if (!canRunSessionListBackgroundWork()) {
					interrupted = true;
					return false;
				}
				return current();
			};
			try {
				const fields = await backfillSessionRowTranscriptFields({
					...row.storeTarget,
					agentId: row.agentId,
					storeAgentId: row.storeTarget.agentId,
					sessionKey: row.key,
					sessionId: entry.sessionId,
					sessionEntry: entry,
					shouldCommit,
					model: row.materialized && {
						selectedProvider: row.materialized.source.selectedModel.provider,
						selectedModel: row.materialized.source.selectedModel.model,
						config: row.materialized.source.cfg
					}
				});
				if (shouldCommit()) params.publish(row, fields);
			} catch {} finally {
				activeId = void 0;
				if (interrupted && current()) queued.add(id);
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
		enqueue(id, change) {
			if (change && "all" in change && typeof change.scope === "string" && !((change.scope === "config" || change.scope === "stores") && id === activeId || (change.scope === "config" || change.scope === "catalog") && params.read(id)?.entry?.fallbackNotice)) return;
			queued.add(id);
			if (started) start();
		},
		remove: (id) => queued.delete(id),
		dispose() {
			disposed = true;
			queued.clear();
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-catalog.ts
function hasSameModelFacts(previous, next) {
	if (!(previous instanceof Map) || !(next instanceof Map) || previous.size === 0) return false;
	return previous.size === next.size && [...previous].every(([agentId, catalog]) => {
		const replacement = next.get(agentId);
		const metadata = readPreparedGatewayModelCatalogMetadata(catalog);
		return catalog !== void 0 && replacement !== void 0 && catalog.pluginRegistry !== void 0 && metadata !== void 0 && catalog.pluginRegistry === replacement.pluginRegistry && metadata === readPreparedGatewayModelCatalogMetadata(replacement) && isDeepStrictEqual(catalog.entries, replacement.entries) && isDeepStrictEqual(catalog.routeVariants, replacement.routeVariants);
	});
}
/** The projection's one catalog snapshot survives asynchronous renewal. */
function createSessionRowProjectionCatalog(params) {
	let modelCatalog = params.modelCatalog;
	let catalogDirty = params.getModelCatalog ? Symbol("catalog") : void 0;
	let pending;
	let replacement;
	let disposed = false;
	const unsubscribe = registerPreparedModelRuntimePublicationListener((event) => {
		if (event.phase === "invalidated" && event.replacement) {
			const replacing = replacement = event.replacement;
			const settled = () => {
				if (!disposed && replacement === replacing) {
					replacement = void 0;
					params.onInvalidated();
				}
			};
			replacing.then(settled, settled).catch(() => {});
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
			return Boolean(catalogDirty) && modelCatalog === void 0;
		},
		invalidate() {
			if (params.getModelCatalog) catalogDirty = Symbol("catalog");
		},
		refresh() {
			if (disposed || !catalogDirty || replacement && modelCatalog !== void 0) return Promise.resolve();
			if (pending) return pending;
			const revision = catalogDirty;
			const work = (async () => {
				try {
					const next = await params.getModelCatalog?.();
					pending = void 0;
					if (disposed || catalogDirty !== revision) {
						if (!disposed) params.onRefreshed(false);
						return;
					}
					const changed = !hasSameModelFacts(modelCatalog, next);
					modelCatalog = next;
					catalogDirty = void 0;
					params.onRefreshed(changed);
				} catch (error) {
					pending = void 0;
					throw error;
				}
			})();
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
				if (change.scope === "runtime" && !change.facts && !change.factsInvalidated) return true;
				modelFactsDirty = true;
				return false;
			}
			if (typeof change.scope === "object" && change.scope.topology && !change.factsInvalidated) return true;
			switch (change.scope) {
				case "config-presentation": return true;
				case "config-profiles":
				case "profiles":
					current.userProfileIdentityById.clear();
					identityProjection.invalidate();
					profileRevision++;
					return true;
				case "subagent-runs": return true;
				case "worker-environments":
				case "worker-placements": return true;
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
				row.materialized.row.swarm = buildSessionSwarmSummary(current.subagentRuns.swarmRunsByRequesterSessionKey.get(row.key) ?? [], row.key, row.agentId, { includeChildren: true });
				row.subagentRevision = subagentRevision;
			}
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-generation.ts
function samePhysicalFile(candidate, pathname = candidate.path) {
	try {
		const file = statSync(pathname, {
			bigint: true,
			throwIfNoEntry: false
		});
		return Boolean(file?.isFile() && `${file.dev}:${file.ino}` === candidate.identity && readDatabaseIdentityBirthtime(file) === candidate.birthtime);
	} catch {
		return false;
	}
}
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
			const sources = [...owner.stores().values()];
			const paths = query.storePath ? [query.storePath] : sources.filter((source) => source.agentId === agentId || source.target.agentId === agentId).map((source) => source.target.storePath);
			const candidates = /* @__PURE__ */ new Map();
			try {
				const captured = [...[...new Set(paths)].flatMap(captureSessionStoreReadCandidates), ...query.storePath ? [] : prepareSessionStoreTargetInventory(config, [agentId], owner.env).candidates];
				for (const candidate of captured) {
					if (candidate.scope) continue;
					const cachedSource = sources.find((source) => path.resolve(source.target.storePath) === candidate.path || path.resolve(source.filename) === candidate.physicalPath);
					if (cachedSource) {
						if (typeof cachedSource.identity === "string" && cachedSource.birthtime !== void 0) candidates.set(candidate.path, {
							path: candidate.path,
							identity: cachedSource.identity,
							birthtime: cachedSource.birthtime
						});
						continue;
					}
					const identity = readDatabasePathIdentitySync(candidate.path);
					const file = statSync(candidate.path, {
						bigint: true,
						throwIfNoEntry: false
					});
					if (file?.isFile() && identity.key === `file:${file.dev}:${file.ino}`) candidates.set(candidate.path, {
						path: candidate.path,
						identity: `${file.dev}:${file.ino}`,
						birthtime: readDatabaseIdentityBirthtime(file)
					});
				}
			} catch {
				candidates.clear();
			}
			let active = owner.isActive() && candidates.size > 0;
			const observation = {
				changed(mutation) {
					if (![...candidates.values()].some((source) => source.identity === mutation.databaseIdentity)) return false;
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
			if (active) observations.add(observation);
			return {
				isCurrent(row) {
					if (!active || !owner.isActive() || owner.config() !== config || row.agentId !== agentId && (key !== void 0 || row.storeTarget.agentId !== agentId) || !owner.isCurrent(row) || (key === void 0 ? row.entry?.sessionId !== sessionId : canonicalKey(row.key) !== key)) return false;
					const source = owner.stores().get(row.storeTarget.storePath);
					return Boolean(source && [...candidates.values()].some((candidate) => source.identity === candidate.identity && source.birthtime === candidate.birthtime && samePhysicalFile(candidate) && samePhysicalFile(candidate, row.storeTarget.storePath)));
				},
				dispose: observation.dispose
			};
		},
		mutate(mutation) {
			for (const observation of observations) if (observation.changed(mutation)) observation.dispose();
			if (readPreparedSessionSharingChange(mutation) !== void 0) return;
			for (const key of mutation.previous.sessionKeys) for (const row of owner.matching({
				key,
				agentId: mutation.agentId
			})) {
				if (owner.stores().get(row.storeTarget.storePath)?.identity !== mutation.databaseIdentity) continue;
				if (mutation.previous.sessionId && row.entry?.sessionId !== mutation.previous.sessionId) continue;
				owner.markRelated(row);
				if ("current" in mutation && mutation.current.sessionKeys.includes(row.key)) {
					if (!(mutation.kind !== "reset" && row.publishedSource?.identity === mutation.databaseIdentity && row.sharingEntry?.sessionId === mutation.current.sessionId)) {
						owner.put(renewGeneration(row));
						owner.dirty.add(identity(row));
					}
				} else owner.remove(identity(row));
			}
			if ("current" in mutation) for (const sessionKey of mutation.current.sessionKeys) {
				const committedRows = owner.matching({
					key: sessionKey,
					agentId: mutation.agentId
				}).filter((row) => row.publishedSource?.identity === mutation.databaseIdentity && owner.stores().get(row.storeTarget.storePath)?.identity === mutation.databaseIdentity);
				const published = committedRows.some((row) => row.sharingEntry?.sessionId === mutation.current.sessionId);
				const superseded = committedRows.some((row) => row.sharingEntry && row.sharingEntry.sessionId !== mutation.current.sessionId && row.sharingEntry.sessionId !== mutation.previous.sessionId);
				if (mutation.kind !== "reset" && (published || superseded)) continue;
				const source = [...owner.stores().values()].find((store) => store.identity === mutation.databaseIdentity);
				if (!source) continue;
				owner.mark({
					agentId: mutation.agentId,
					sessionKey,
					storePath: source.filename
				});
			}
			else owner.ensureMaterialized().catch(() => {});
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-identities.ts
const isSentinel = (key) => key === "global" || key === "unknown";
/** Retain only creator facts, not superseded rows or their materialized graphs. */
function createSessionRowCreatorIndex() {
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
		list(selectedPaths, matching) {
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
			})), ...listOpenIncognitoSessionCreators()];
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
/** Incognito creators preserve the existing picker scope without entering resident memory. */
function listOpenIncognitoSessionCreators() {
	return listOpenIncognitoAgentDatabases().flatMap((target) => {
		if (readAgentDatabaseAdmissionRefusal(target.agentId)) return [];
		return listSessionEntriesReadOnly({
			...target,
			projection: "list",
			clone: false
		}).flatMap(({ sessionKey, entry }) => isIncognitoSessionKey(sessionKey) && entry.incognito === true && entry.createdActor?.id ? [entry.createdActor] : []);
	});
}
//#endregion
//#region src/gateway/session-row-projection-read.ts
/** Retain each selected store until its prepared facts have entered the resident row owner. */
async function withSessionRowDatabaseFacts(owner, consume) {
	const revision = owner.revision();
	const ids = [];
	for (const id of owner.selected ?? owner.dirty) {
		ids.push(id);
		if (ids.length === 64) break;
	}
	if (consume.refreshPending(ids)) return;
	const retained = /* @__PURE__ */ new Map();
	for (const id of ids) {
		const facts = owner.rows.get(id)?.retainedDatabaseFacts;
		if (facts) retained.set(id, facts);
	}
	if (retained.size > 0) {
		consume.accept([...retained.keys()], retained);
		return;
	}
	const rows = ids.flatMap((id) => owner.rows.get(id) ?? []);
	const rowRevisions = new Map(rows.map((row) => [identity(row), row.databaseFactsRevision]));
	const env = owner.env;
	const groups = /* @__PURE__ */ new Map();
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
		group.rows.push(row);
	}
	const selected = [...groups.values()];
	const native = retainOpenClawAgentDatabaseReadCandidates(selected.flatMap(({ candidate }) => [candidate, {
		...candidate,
		path: candidate.physicalPath
	}]), env);
	const continuations = [];
	const assertCurrent = () => {
		for (const { candidate } of selected) assertSessionStoreReadCandidate(candidate.path, [candidate]);
		for (const continuation of continuations) continuation.owner.assertCurrent();
	};
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
		await withSessionHistoryWorkerDatabases(selected.map(({ database }) => database), async (owners) => {
			const facts = /* @__PURE__ */ new Map();
			for (const [index, group] of selected.entries()) {
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
					if (prepared) facts.set(identity(row), {
						...prepared,
						acpMeta: prepared.entry?.acp ?? null,
						repositoryWorkspace: null
					});
				}
			}
			const acpRows = rows.flatMap((row) => {
				const prepared = facts.get(identity(row));
				return prepared?.entry && !prepared.entry.acp ? [{
					row,
					prepared,
					entry: prepared.entry
				}] : [];
			});
			const acpMetadata = await readAcpSessionMetaForEntries({
				env,
				cfg: owner.cfg,
				entries: acpRows.map(({ row, entry }) => ({
					agentId: row.agentId,
					sessionKey: row.key,
					entry
				}))
			});
			for (const [index, { prepared }] of acpRows.entries()) prepared.acpMeta = acpMetadata[index] ?? null;
			const repositoryRows = rows.flatMap((row) => {
				const prepared = facts.get(identity(row));
				return prepared?.entry?.repositoryWorkspaceId ? [{
					row,
					prepared
				}] : [];
			});
			if (repositoryRows.length) {
				const workspaces = await findSessionRepositoryWorkspaces(repositoryRows.map(({ row }) => ({
					agentId: row.agentId,
					sessionKey: row.key
				})), {
					path: resolveOpenClawStateSqlitePath(env),
					env
				});
				const byWorkspace = new Map(workspaces.map((workspace) => [workspace.workspaceId, workspace]));
				for (const { prepared } of repositoryRows) prepared.repositoryWorkspace = byWorkspace.get(prepared.entry.repositoryWorkspaceId) ?? null;
			}
			for (let pending = owner.prepareRegistryFacts(); pending; pending = owner.prepareRegistryFacts()) await pending;
			for (const databaseOwner of owners) databaseOwner.assertCurrent();
			assertCurrent();
			if (revision !== void 0 && owner.revision() === revision) {
				const currentIds = rows.filter((row) => (owner.dirty.has(identity(row)) || owner.selected?.has(identity(row)) && isColdArchivedSessionRow(owner.rows.get(identity(row)) ?? row)) && isCurrentGeneration(row, owner.rows.get(identity(row))) && owner.rows.get(identity(row))?.databaseFactsRevision === rowRevisions.get(identity(row))).map(identity);
				consume.accept(currentIds, facts);
				assertCurrent();
			}
		}, projectionLane);
	} finally {
		for (const continuation of continuations.toReversed()) continuation.owner.release();
		native.release();
	}
}
//#endregion
//#region src/gateway/session-row-projection-refresh.ts
const MAX_CONCURRENT_EXACT_ROW_READS = 2;
/** Refreshes borrow projection state; the projection retains revisions, rows, and archive custody. */
function createSessionRowRefresh(owner) {
	const revision = () => owner.state().disposed ? void 0 : owner.databaseRevision();
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
	let selectionPreparation;
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
			cfg: owner.state().cfg,
			revision,
			prepareRegistryFacts: owner.prepareRegistryFacts,
			env: owner.env
		}, {
			refreshPending: options.materialize === false ? () => false : materializer.refreshPending,
			accept: (ids, facts) => materializer.accept(ids, facts, options)
		});
	}
	function selectionNeedsPreparation() {
		const state = owner.state();
		if (state.disposed) return false;
		if (state.topologyDirty || !state.registryPrepared || owner.catalog.needsInitialRead || owner.membership.needsPreparation) return true;
		for (const id of owner.dirty) if (!owner.rows.get(id)?.retainedDatabaseFacts) return true;
		return false;
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
	function prepareSelection(yieldForCatalog = false) {
		if (!owner.state().disposed && !owner.catalog.needsInitialRead) owner.runAsOwner(() => owner.catalog.refresh());
		if (yieldForCatalog && owner.catalog.isRefreshing) return yieldSessionListWork().then(() => prepareSelection());
		if (selectionPreparation) return selectionPreparation;
		if (!selectionNeedsPreparation()) {
			if (!owner.state().disposed) owner.prepare();
			return;
		}
		const release = retainExactPreparation();
		selectionPreparation = owner.runAsOwner(async () => {
			try {
				while (selectionNeedsPreparation()) {
					for (let pending = owner.prepareRegistryFacts(); pending; pending = owner.prepareRegistryFacts()) await pending;
					if (owner.state().topologyDirty) await owner.topology();
					if (owner.state().disposed || owner.state().topologyDirty) continue;
					await owner.membership.prepare();
					if (owner.catalog.needsInitialRead) await owner.catalog.refresh();
					const selected = /* @__PURE__ */ new Set();
					const held = /* @__PURE__ */ new Set();
					for (const id of owner.dirty) {
						if (owner.rows.get(id)?.retainedDatabaseFacts) continue;
						const pending = bulkReads.get(id) ?? exactReads.get(id)?.completion.promise;
						if (pending) held.add(pending);
						else if (selected.add(id).size === 64) break;
					}
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
				selectionPreparation = void 0;
				release();
			}
		});
		return selectionPreparation;
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
		refreshBatch,
		prepareExactRows,
		prepareSelection,
		selectionNeedsPreparation,
		retainExactPreparation,
		async withSelectionPreparation(consume) {
			const release = retainExactPreparation();
			try {
				return await consume();
			} finally {
				release();
			}
		},
		dispose() {
			exactPreparationsIdle?.resolve();
			for (const [id, read] of queuedExactReads) {
				read.completion.reject(/* @__PURE__ */ new Error("Session row projection is no longer active"));
				releaseExactRead(id, read);
			}
			queuedExactReads.clear();
		},
		assertExactRowsPrepared(queries) {
			if (pendingExactRows(queries).size > 0) throw new Error("Session row facts changed before the prepared read; retry the request");
		}
	};
}
//#endregion
//#region src/gateway/session-row-projection-transcript.ts
const TRANSCRIPT_REFRESH_WINDOW_MS = 1e3;
/** Transcript notifications share the projection's lifetime and exact row generations. */
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
	function startWindow(id, generation) {
		const timer = setTimeout(() => {
			const window = windows.get(id);
			if (window?.timer !== timer) return;
			windows.delete(id);
			if (disposed || params.read(id)?.generation !== generation) return;
			if (window.pending) {
				startWindow(id, generation);
				params.refresh(id);
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
			row.retainedDatabaseFacts = void 0;
			row.databaseFactsRevision++;
			if (pending) params.refresh(id);
			if (row.entry?.archivedAt !== void 0 && !row.materialized) continue;
			const window = windows.get(id);
			if (window) {
				window.pending = true;
				continue;
			}
			startWindow(id, row.generation);
			if (!cold && !pending) params.refresh(id);
		}
	});
	return {
		remove,
		dispose() {
			disposed = true;
			stop();
			for (const id of windows.keys()) remove(id);
		}
	};
}
//#endregion
//#region src/gateway/session-row-scope.ts
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
				}, (mutation, entries) => mutation.kind === "upsert" && mutation.sources.every((source) => entries?.some((entry) => entry.agentId === source.agentId && entry.schemaVersion === source.schemaVersion && (entry.path === source.path || entry.path === source.physicalPath)) && captured.some((store) => {
					if (typeof store.identity !== "string" || `file:${store.identity}` !== source.identity || store.target.agentId !== source.agentId) return false;
					try {
						return [.../* @__PURE__ */ new Set([
							store.filename,
							source.path,
							source.physicalPath
						])].every((filename) => {
							const file = readDatabasePathIdentitySync(filename);
							return file.key === source.identity && file.birthtime === store.birthtime;
						});
					} catch {
						return false;
					}
				}))).read();
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
function prepareSessionRowScopes(cfg, agentIds, residentPaths, discovery) {
	const residentPath = (pathname) => residentPaths.get(pathname) ?? pathname;
	const filenames = new Map([...residentPaths].map(([filename, locator]) => [locator, filename]));
	const aliases = /* @__PURE__ */ new Map();
	const capture = (options) => {
		try {
			const resolved = resolveGatewaySessionStoreTargets(cfg, {
				...options,
				discovery,
				includeIncognito: false
			});
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
				agentId: resolved.requestedAgentId
			};
		} catch (error) {
			return error instanceof Error ? error : new Error(String(error));
		}
	};
	const all = capture({});
	const configured = capture({ configuredAgentsOnly: true });
	const agents = new Map([.../* @__PURE__ */ new Set([...listAgentIds(cfg), ...agentIds])].map((agentId) => [agentId, capture({ agentId })]));
	const select = (options) => {
		const requestedAgentId = options.agentId?.trim() ? normalizeAgentId(options.agentId) : void 0;
		const scope = requestedAgentId ? agents.get(requestedAgentId) ?? {
			paths: /* @__PURE__ */ new Map(),
			path: "(multiple)",
			agentId: requestedAgentId,
			configuredAgentIds: void 0
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
	for (const row of candidates) if (row?.unresolvedDatabaseFacts === "category" && matches(row)) {
		pending.push({
			agentId: row.agentId,
			key: row.key,
			storePath: row.storeTarget.storePath
		});
		if (pending.length === 64) break;
	}
	if (pending.length > 0) throw new SessionRowFactsPending(pending);
	const acquired = sessionIdOrKey || dirty.size === 0 ? candidates : candidates.map((row) => row && dirty.has(identity(row)) ? acquire(row) : row);
	let selectedCount = 0;
	acquired.forEach((row) => {
		if (hasEntry(row) && matches(row)) acquired[selectedCount++] = row;
	});
	acquired.length = selectedCount;
	return sort(acquired, query.sortBy);
}
//#endregion
//#region src/gateway/session-row-projection.ts
/** Committed publications own invalidation; each admitted physical store is hydrated once. */
async function createSessionRowProjection(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const discoveryRead = prepareAgentDatabaseDeletionSnapshotRead({ env }, "runtime");
	const subagents = createSubagentSessionListReadView({ env });
	while (!subagents.snapshotIdentity()) await subagents.prepare();
	let cfg = params.getConfig?.() ?? params.cfg;
	const getPolicyConfig = () => params.getPolicyConfig?.() ?? cfg;
	const rows = /* @__PURE__ */ new Map();
	const creators = createSessionRowCreatorIndex();
	const membership = createSessionMembershipProjection();
	const { invalidateRowMembership, readSessionRowEntry: readStoredSessionRowEntry, createStoreRead } = createSessionRowEntryReadAccess(membership);
	const readSessionRowEntry = (row) => row.publishedSource && row.storedEntry && row.sharingEntry === row.storedEntry ? row.storedEntry : readStoredSessionRowEntry(row);
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
	const placementFacts = createSessionRowPlacementProjection(params.placementFactsReader, () => !disposed && topologyDirty ? topology() : prepareRegistryFacts());
	let epoch = 0;
	let topologyEpoch = 0;
	let preparingTopology;
	let databaseRevision = 0;
	const revisions = createSessionRowProjectionRevisions();
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
		onRefreshed(changed) {
			if (changed) {
				epoch++;
				revisions.invalidate();
				metadata.invalidate({
					all: true,
					scope: "catalog"
				});
				archive.invalidateRows({
					all: true,
					scope: "catalog"
				}, rows.values());
			}
			ensureMaterialized().catch(() => {});
		}
	});
	const metadata = createSessionRowProjectionContext(subagents);
	const backfill = createSessionRowProjectionBackfill({
		ready: ensureMaterialized,
		read: (id) => rows.get(id),
		current: (row) => !topologyDirty && archive.isCurrentMaterialization(row) && isCurrent(row),
		publish(row, fields) {
			const current = rows.get(identity(row));
			if (ready(current)) publishTranscriptFields(current, fields, cfg, metadata.current);
		}
	});
	const archive = createSessionRowProjectionArchive({
		rows,
		dirty,
		put,
		config: () => cfg,
		context: () => metadata.current,
		referenced,
		enqueue: (id, change) => backfill.enqueue(id, change),
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
	const lookup = (query) => lookupSessionRow(query, {
		disposed,
		cfg,
		matching,
		storePaths: stores.keys()
	});
	function referenced(ref) {
		return firstReferenced(ref, rows, byKey, stores.keys());
	}
	function enqueue(row) {
		if (row) {
			const id = identity(row);
			dirty.add(id);
			if (!isColdArchivedSessionRow(row)) backfill.enqueue(id);
		}
	}
	const markStoredRow = createSessionRowPublication({
		store: (path) => stores.get(path),
		runAsOwner: inOwnerContext,
		registryFactsReady: () => Boolean(inOwnerContext(subagents.snapshotIdentity)),
		acquireEntry,
		markRelated,
		invalidatePlacement: (sessionId) => placementFacts.invalidate(sessionId),
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
		if (disposed || !topologyDirty) return Promise.resolve();
		return preparingTopology ??= inOwnerContext(async () => {
			const targetEpoch = topologyEpoch;
			const nextConfig = params.getConfig?.() ?? cfg;
			const prepared = await discoveryRead.readWithCurrentAdmission();
			const topologyCurrent = () => !disposed && topologyEpoch === targetEpoch && (params.getConfig?.() ?? cfg) === nextConfig;
			prepared.assertCurrent();
			if (!topologyCurrent()) return;
			const discovery = {
				env,
				snapshot: prepared.snapshot
			};
			const revision = epoch;
			const storeRead = createStoreRead({
				stores,
				rows,
				byStore,
				env
			});
			const loaded = storeRead.loadCombinedStore(nextConfig, discovery);
			prepared.assertCurrent();
			if (!topologyCurrent()) return;
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
			scope = prepareSessionRowScopes(cfg, byAgent.keys(), new Map([...stores].map(([locator, source]) => [source.filename, locator])), discovery);
			revisions.publishSelection();
			topologyDirty = epoch !== revision;
		}).finally(() => {
			preparingTopology = void 0;
		});
	}
	function mark(original, prepared) {
		if (isSessionStoreTopologyChange(original) && isOpenClawAgentDatabaseRegistryChange(original) && registryRead.isCurrent()) return;
		const change = rowFacts.conservativeChange(original, (path) => scope?.physicalPaths(path) ?? [path]);
		if (change !== original) membership.invalidate(change);
		if ("all" in change && (change.scope === "config" || change.scope === "config-presentation" || change.scope === "config-profiles")) {
			generations.invalidate();
			if (change.scope !== "config") cfg = inOwnerContext(() => params.getConfig?.() ?? cfg);
		}
		epoch++;
		const presentationOnly = metadata.invalidate(change) && !change.factsInvalidated;
		const catalogOnly = "all" in change && change.scope === "catalog" && !change.factsInvalidated;
		if (!presentationOnly) revisions.invalidate(!catalogOnly);
		if ("all" in change) {
			if (!presentationOnly && !catalogOnly) databaseRevision++;
			placementFacts.invalidateChange(change);
			if (isSessionStoreTopologyChange(change) || change.scope === "config") {
				topologyDirty = true;
				topologyEpoch = epoch;
			}
			if (change.scope === "catalog" || change.scope === "config") catalog.invalidate();
			if (!presentationOnly && (!catalogOnly || !params.getModelCatalog)) archive.invalidateRows(change, typeof change.scope === "string" ? rows.values() : matching(change.scope));
		} else if (change.scope === "automation") markAutomation(matching({ key: change.sessionKey }).filter((row) => !isColdArchivedSessionRow(row)), change.agentId, dirty);
		else if (!presentationOnly) visitSessionRowPublicationTargets(change, {
			matching,
			scope,
			stores,
			publish: (row) => markStoredRow(row, change, prepared)
		});
		ensureMaterialized().catch(() => {});
	}
	const { readSourceEntry, readChildLinks, readPreparedSpawnedBy } = createSessionRowRelationReads({
		env,
		inOwnerContext,
		isReady: () => !disposed && !topologyDirty,
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
	function materialize(row, configuredAgentIds = new Set(listAgentIds(cfg)), readRow = readResidentSessionRow, databaseFacts, repositoryWorkspace) {
		if (!row.entry) return false;
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
		if (!isIncognitoSessionKey(row.key) && rows.get(identity(row)) !== row) return false;
		if (!isIncognitoSessionKey(row.key)) placementFacts.register(row.entry.sessionId);
		const previousBoard = row.hasBoard;
		Object.assign(row, prepared, {
			materializedSequence: ++materializedCount,
			...metadata.materializedRevisions
		});
		revisions.materialized(row, previousBoard);
		return true;
	}
	const { refresh, refreshBatch, prepareExactRows, prepareSelection, selectionNeedsPreparation, withSelectionPreparation, retainExactPreparation, assertExactRowsPrepared, dispose: disposeRefresh } = createSessionRowRefresh({
		rows,
		dirty,
		env,
		state: () => ({
			cfg,
			disposed,
			topologyDirty,
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
		revision: () => epoch,
		databaseRevision: () => databaseRevision,
		acquireEntry,
		readEntry: readSessionRowEntry,
		materialize,
		forgetBackfill: backfill.remove,
		retainArchived(row) {
			archive.describe(row);
			backfill.enqueue(identity(row));
		}
	});
	function needsMaterialization() {
		return !disposed && (topologyDirty || catalog.needsInitialRead || dirty.size > 0 || membership.needsPreparation || placementFacts.needsPreparation || !inOwnerContext(() => metadata.readPrepared(epoch)));
	}
	const transcriptUpdates = createSessionRowProjectionTranscriptUpdates({
		matching,
		mark,
		read: (id) => rows.get(id),
		refresh(id) {
			const row = rows.get(id);
			if (!row || isColdArchivedSessionRow(row) && !row.pendingDatabaseFacts) return;
			epoch++;
			revisions.invalidate();
			invalidateDatabaseFacts(row);
			dirty.add(id);
			backfill.enqueue(id);
			ensureMaterialized().catch(() => {});
		}
	});
	const generations = createSessionRowGenerationObservations({
		config: () => inOwnerContext(() => params.getConfig?.() ?? cfg),
		env,
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
	const stop = [
		retainUserProfileCatalog(),
		sessionChanges.subscribeFacts(membership.invalidate),
		sessionChanges.subscribeProjection(mark),
		onSessionLifecycleEvent((change) => mark(change.reason === "participants" ? {
			...change,
			facts: { kind: "unchanged" }
		} : change)),
		onSessionIdentityMutation(generations.mutate)
	];
	function isCurrent(row) {
		return row.privateSource ? isPrivateSourceCurrent(row.privateSource) : isCurrentGeneration(row, rows.get(identity(row)));
	}
	function prepareRead() {
		if (topologyDirty) return false;
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
			acquire: (row) => acquireEntry(row, readSessionRowEntry(row)),
			referenced
		})
	});
	await inOwnerContext(async () => {
		(await prepareUserProfileCatalog()).release();
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
		onSelectionChange: revisions.onSelectionChange,
		observeGeneration: generations.observeGeneration,
		readPreparedRowContext: () => disposed ? void 0 : inOwnerContext(() => metadata.readPrepared(epoch)),
		readPreparedSpawnedBy,
		capture(query) {
			const row = lookup(query);
			return row && row.unresolvedDatabaseFacts !== "category" && !topologyDirty && !row.entry && row.storedEntry !== void 0 && row.unresolvedDatabaseFacts !== true && inOwnerContext(subagents.snapshotIdentity) ? acquireEntry(row, row.storedEntry) ?? row : row;
		},
		findBySessionId(query) {
			return findSessionRowById(query, {
				disposed,
				lookup,
				matching,
				scope
			});
		},
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
			assertExactRowsPrepared,
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
		isMaterialized(query) {
			const row = lookup(query);
			return row !== void 0 && !dirty.has(identity(row)) && ready(row);
		},
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
		listCreatedActors: () => inOwnerContext(() => creators.list(projection.state.scope({}).paths, matching)),
		snapshot: (query, options = {}) => snapshot(describe(query), metadata.current, options),
		dispose
	};
	return projection;
}
//#endregion
export { createSessionRowProjection as t };

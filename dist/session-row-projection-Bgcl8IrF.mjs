import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { a as resolveOpenClawAgentSqlitePath, i as resolveIncognitoOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { t as buildProjectedAgentRunIndex } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { f as listOpenIncognitoAgentDatabases } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { d as retainOpenClawAgentDatabaseReadCandidates } from "./openclaw-agent-db-CaQAStOA.mjs";
import { r as onInternalSessionTranscriptUpdate } from "./transcript-events-DukKauix.mjs";
import { l as retainUserProfileCatalog } from "./user-profile-list-B5pNqyXa.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { i as registerPreparedModelRuntimePublicationListener } from "./prepared-model-runtime.publication-events-DeixJuix.mjs";
import { l as assertSessionStoreReadCandidate, u as captureSessionStoreReadCandidate } from "./session-sqlite-target-Dcog4O-M.mjs";
import { f as projectSqliteSessionParticipants, h as withPreparedSessionParticipants, o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { i as onSessionLifecycleEvent, r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import { m as withCanonicalSessionValidationDeferral, s as captureCanonicalSessionReaderContinuation } from "./session-canonical-key-BBylVEaq.mjs";
import { l as readCommittedSessionEntryCache } from "./session-accessor.sqlite-entry-cache-CtMz7hDz.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-BcO2Rrog.mjs";
import { n as SessionTranscriptStorageUnavailableError, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { _ as resolveSessionKeyBySessionId } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { a as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { M as getSubagentRegistryPublicationRevision } from "./subagent-run-liveness-9vTRtoqd.mjs";
import { E as getSubagentSessionListReadSnapshotIdentity, P as prepareSubagentSessionListReadCache, n as buildSubagentSessionListReadIndex } from "./subagent-registry-read-C2SIiLpb.mjs";
import { c as listSessionMembers } from "./sessions-DE4llkPV.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-COJ0koI7.mjs";
import { o as resolveGatewaySessionStoreTargetWithStore, t as createGatewaySessionEntryReader } from "./session-utils-store-lookup-EioWBMfl.mjs";
import { a as resolveGatewaySessionStoreTargets, i as projectGatewaySessionEntry, n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-ZKqIQpyJ.mjs";
import { n as deriveSessionTitle } from "./session-utils-core-CcjzbK1i.mjs";
import { i as resolveUtilityModelRefForAgent } from "./utility-model-DZ4XRwmc.mjs";
import { n as buildSessionListRowMetadataContext, t as buildProjectedSubagentActivity } from "./session-utils-projection-BAsXtuUd.mjs";
import { t as readSessionFallbackModel } from "./session-fallback-model-XG6AoN2l.mjs";
import { B as refreshSessionRowProfiles, C as renewGeneration, D as readSessionRowFacts, E as sort, H as readSessionRowModelFacts, R as materializeSessionRow, S as ready, T as snapshot, V as buildSessionSwarmSummary, _ as parentReference, a as changesSessionRowDependents, b as publishTranscriptFields, c as dependents, d as hasEntry, f as identity, g as markRelated, h as markAutomation, i as changesRowStructure, l as first, m as isCurrentGeneration, o as create, p as index, r as acquireSessionRowEntry, s as dematerialize, t as withPreparedSessionRows, u as firstReferenced, v as physical, w as sameParents, x as readSessionRowParents, y as present, z as readSessionRowInputs } from "./session-row-prepared-read-C3rQ5FB0.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-bZOY074i.mjs";
import { n as createSessionIdentityProjection } from "./session-identity-projection-Bz5hvxHJ.mjs";
import { n as readPreparedGatewayModelCatalogMetadata } from "./server-model-catalog-view-muuNaRwE.mjs";
import { t as ensureSessionGroupCatalog } from "./session-group-catalog-DLJCfGiI.mjs";
import { t as readSessionListSelectionFacts } from "./session-list-target-BT5Ax3-V.mjs";
import { a as yieldSessionListWork, i as yieldSessionListBackgroundWork, n as createSessionProjectionDrain, t as canRunSessionListBackgroundWork } from "./session-projection-work-BJ52HUIn.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
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
			if (!change.factsInvalidated && (!facts || facts.kind === "unchanged")) return;
			for (const store of matching(change)) {
				store.revision++;
				if (change.factsInvalidated) {
					store.facts.delete(change.sessionKey);
					store.dirty.add(change.sessionKey);
					continue;
				}
				if (!facts || facts.kind === "unchanged") continue;
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
				});
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
//#region src/gateway/session-row-projection-archive.ts
const DEFAULT_ARCHIVED_MATERIALIZED_ROWS = 100;
function isColdArchivedSessionRow(row) {
	return row.entry?.archivedAt !== void 0 && !row.materialized;
}
/** Archived metadata outlives its bounded, reader-populated materialization cache. */
function createSessionRowProjectionArchive(params) {
	const materialized = /* @__PURE__ */ new Set();
	let limit = DEFAULT_ARCHIVED_MATERIALIZED_ROWS;
	function demote(row) {
		const id = identity(row);
		materialized.delete(id);
		params.release(id);
		const cold = dematerialize(row);
		params.put(cold);
		return cold;
	}
	function trim() {
		while (materialized.size > limit) demote(params.rows.get(materialized.values().next().value));
	}
	return {
		demote,
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
		markRelated(row, indexes, includeChildren = true) {
			const related = /* @__PURE__ */ new Set();
			markRelated(row, indexes, related, includeChildren);
			for (const id of related) {
				const current = params.rows.get(id);
				if (current && !isColdArchivedSessionRow(current)) params.dirty.add(id);
			}
		},
		invalidateRows(change, candidates) {
			for (const row of candidates) {
				if (row.entry?.archivedAt !== void 0) {
					if (row.materialized) demote(row);
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
		forget: (id) => materialized.delete(id),
		clear: () => materialized.clear(),
		describe(initial) {
			if (initial?.entry?.archivedAt === void 0) return initial;
			const row = initial.materialized ? initial : params.prepare(initial);
			if (ready(row) && row.entry.archivedAt !== void 0) {
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
/** One synchronous refresh slice shares agent policy; each later slice starts fresh. */
function createSessionRowMaterializationBatch() {
	const activitySummaryEnabledByAgent = /* @__PURE__ */ new Map();
	return (params) => readResidentSessionRow(params, activitySummaryEnabledByAgent);
}
/** Keyed and worker-prepared refreshes share the same bounded materialization slice. */
function createSessionRowMaterializer(owner) {
	return (ids, prepared) => {
		if (!owner.isActive()) return;
		const started = performance.now();
		const cfg = owner.prepare();
		const configuredAgentIds = new Set(listAgentIds(cfg));
		const readRow = createSessionRowMaterializationBatch();
		for (const [offset, id] of ids.entries()) {
			if (offset > 0 && performance.now() - started >= 12) break;
			const current = owner.rows.get(id), revision = owner.revision();
			const databaseFacts = prepared?.get(id);
			const row = current && owner.acquireEntry(databaseFacts ? {
				...current,
				hasBoard: databaseFacts.hasBoard
			} : current, prepared ? databaseFacts?.entry : owner.readEntry(current));
			if (row && isColdArchivedSessionRow(row)) {
				owner.dirty.delete(id);
				owner.forgetBackfill(id);
				continue;
			}
			if (row && owner.materialize(row, configuredAgentIds, readRow, databaseFacts) && owner.revision() === revision) owner.dirty.delete(id);
			if (owner.revision() !== revision) break;
		}
	};
}
/** Resident rows consume committed metadata; optional transcript work has a separate budget. */
function readResidentSessionRow(params, activitySummaryEnabledByAgent) {
	const { row, cfg, context } = params;
	const source = isIncognitoSessionKey(row.key) ? resolveGatewaySessionStoreTargetWithStore({
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
		configuredAgentIds: params.configuredAgentIds,
		store: source?.store ?? {},
		storePath: row.storeTarget.storePath,
		storeAgentId: row.storeTarget.agentId,
		active: source ? void 0 : false,
		activeModel: source ? void 0 : row.fallbackModel ?? null,
		modelCatalog: params.modelCatalog,
		modelSource: {
			entry: row.storedEntry,
			readSourceEntry: source ? createGatewaySessionEntryReader({
				cfg,
				...source
			}) : params.readSourceEntry
		},
		rowContext: context,
		includeDerivedTitles: Boolean(source),
		includeLastMessage: Boolean(source),
		skipTranscriptUsageFallback: true,
		includeSwarmChildren: true,
		storeChildSessionLinksByKey: source ? void 0 : /* @__PURE__ */ new Map([[row.key, params.links]])
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
		databaseFacts: params.databaseFacts
	});
	return {
		materialized,
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
		if (isIncognitoSessionKey(row.key)) row.generation = readOpenClawAgentDatabaseIdentity(database).identity;
		const cache = readCommittedSessionEntryCache(database.db);
		if (cache) {
			const entry = cache.get(row.key);
			return entry ? projectSqliteSessionParticipants(database.db, row.key, entry) : void 0;
		}
		return readExactSessionEntryRow(database, row.key, "list")?.entry;
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
	if (!storedEntry) return;
	const entry = projectGatewaySessionEntry(cfg, storedEntry);
	return Object.assign(row, {
		storedEntry,
		entry,
		selection: readSessionListSelectionFacts(key, entry)
	});
}
/** Resident identities use indexes; private identities remain exact process-local reads. */
function findSessionRowById(query, owner) {
	if (!query.agentId || !query.storePath || !isIncognitoOpenClawAgentSqlitePath(query.storePath, { agentId: query.agentId })) return owner.matching({
		...query,
		key: query.sessionId
	}, "id");
	const key = !owner.disposed && resolveSessionKeyBySessionId(query);
	const row = key ? owner.lookup({
		...query,
		agentId: query.agentId,
		key
	}) : void 0;
	return row?.entry?.sessionId === query.sessionId ? [row] : [];
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
/** Readiness and synchronous sharing selection share the resident row owner's lifetime. */
function createSessionRowMembershipReadAccess(params) {
	const { membership } = params;
	const needsMembershipPreparation = () => params.isActive() && (params.topologyDirty() || membership.needsPreparation);
	async function prepareMembership() {
		do {
			if (params.isActive() && params.topologyDirty()) params.runInOwner(params.topology);
			await params.runInOwner(() => membership.prepare());
		} while (needsMembershipPreparation());
	}
	return {
		prepareMembership,
		needsMembershipPreparation,
		sessionGroupTargets() {
			if (!params.isActive() || params.topologyDirty() || membership.needsPreparation) throw new Error("Session group membership changed; prepare current facts before reading");
			return membership.groupTargets();
		},
		sharingTarget(query) {
			if (!params.isActive() || params.topologyDirty() || isIncognitoSessionKey(query.key)) return null;
			const row = params.lookup(query);
			const entry = row?.sharingEntry;
			return row && entry ? {
				agentId: row.agentId,
				canonicalKey: row.key,
				entry,
				storeKey: row.key,
				storeKeys: [row.key],
				storePath: row.storeTarget.storePath
			} : null;
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
			return {
				sources,
				replaced,
				loadEntries: (target, projection) => {
					const opened = withOpenClawAgentDatabaseReadOnly(readOpenClawAgentDatabaseIdentity, {
						agentId: target.agentId,
						path: target.storePath
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
						clone: false
					};
					return listSessionEntriesReadOnly(entryScope, { deferParticipants: true });
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/session-row-placement-projection.ts
/** Placement facts share the resident row lifecycle; private exact reads retain only their frame. */
function createSessionRowPlacementProjection(reader, prepareReadFacts) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const resident = /* @__PURE__ */ new Map();
	const registered = /* @__PURE__ */ new Set();
	const dirty = /* @__PURE__ */ new Set();
	let exact;
	let revision = 0;
	let disposed = false;
	const select = (snapshot, id) => {
		const placement = snapshot.placements.get(id);
		return {
			placement,
			move: snapshot.moves.get(id),
			environment: placement?.environmentId ? snapshot.environments.get(placement.environmentId) : void 0,
			workspaceResultReconciling: snapshot.workspaceResultReconcilingSessionIds.has(id)
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
			const prepared = exact?.get(id);
			if (prepared) resident.set(id, prepared);
			else dirty.add(id);
		},
		forget(id) {
			revision++;
			registered.delete(id);
			dirty.delete(id);
			resident.delete(id);
		},
		invalidate(id) {
			revision++;
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
			else if (row.entry && !related(row.entry.sessionId).some((other) => other.entry && (other.entry.archivedAt === void 0 || other.materialized))) owner.forget(row.entry.sessionId);
			if (previous?.entry && previous.entry.sessionId !== row.entry?.sessionId && related(previous.entry.sessionId).length === 0) owner.forget(previous.entry.sessionId);
		},
		async withPreparedRows(projection, isActive, lookup, queries, consume) {
			let deferred;
			let preparedQueries = [];
			return owner.withPrepared(() => {
				const selected = withCanonicalSessionValidationDeferral(() => {
					preparedQueries = queries(projection.state.cfg);
					return preparedQueries.flatMap((query) => {
						const row = inOwnerContext(() => lookup(query));
						return row?.entry ? [row.entry.sessionId] : [];
					});
				});
				deferred = selected.kind === "pending" ? selected : void 0;
				return selected.kind === "complete" ? selected.value : [];
			}, () => deferred ?? withPreparedSessionRows(projection, isActive, () => preparedQueries, consume));
		},
		async prepare() {
			const requested = [...dirty];
			if (disposed || !reader || requested.length === 0) return;
			const captured = revision;
			const snapshot = await inOwnerContext(() => reader.readProjection(requested));
			if (disposed || revision !== captured) return;
			for (const id of requested) {
				resident.set(id, select(snapshot, id));
				dirty.delete(id);
			}
		},
		async withPrepared(selectIds, consume) {
			while (true) {
				for (let pending = prepareReadFacts(); pending; pending = prepareReadFacts()) await pending;
				if (disposed) break;
				const ids = selectIds();
				const requested = missing(ids);
				if (!reader || requested.length === 0) return await consume();
				const captured = revision;
				const snapshot = await inOwnerContext(() => reader.readProjection(requested));
				for (let pending = prepareReadFacts(); pending; pending = prepareReadFacts()) await pending;
				if (disposed) break;
				if (revision !== captured) continue;
				const prepared = new Map(requested.map((id) => [id, select(snapshot, id)]));
				if (selectIds().some((id) => !resident.has(id) && !prepared.has(id))) continue;
				const previous = exact;
				let result;
				exact = prepared;
				try {
					result = consume();
				} finally {
					exact = previous;
					prepared.clear();
				}
				return await result;
			}
			throw new Error("Session row projection is no longer active");
		},
		dispose() {
			disposed = true;
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
		readSourceEntry(row, key, residentOnly = false) {
			const source = owner.referenced(parentReference(owner.config(), key, row.agentId, row.storeTarget.storePath));
			return source && (!residentOnly && owner.dirty.has(identity(source)) ? owner.readEntry(source) : source.storedEntry);
		},
		readChildLinks(row, residentOnly = false) {
			const links = [...dependents(row, owner.byParent)].flatMap((child) => {
				let value = owner.rows.get(child);
				if (value && !residentOnly && owner.dirty.has(child)) value = owner.acquireEntry(value, owner.readEntry(value));
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
			parents.add(parentReference(owner.cfg, key, agentId, agentId === child.agentId ? child.storeTarget.storePath : void 0));
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
		ancestorRows: (record) => readSessionRowAncestors(record, {
			...owner.state(),
			referenced: owner.referenced,
			prepare: (row) => hasEntry(row) && owner.placementFacts.isPrepared(row.entry.sessionId) && !owner.membership.needsPreparation(() => [{
				...row,
				storePath: row.storeTarget.storePath
			}]) ? owner.describe({
				...row,
				storePath: row.storeTarget.storePath
			}, row) : void 0
		}),
		async withPreparedExactRows(queries, consume, options) {
			const selected = options?.includeAncestors ? (config) => {
				const targets = queries(config);
				return owner.inOwnerContext(() => [...targets, ...targets.flatMap((query) => {
					const row = owner.lookup(query);
					return (row && readSessionRowAncestors(row, {
						...owner.state(),
						referenced: owner.referenced,
						prepare: (parent) => hasEntry(parent) ? parent : void 0
					}))?.map((parent) => ({
						key: parent.key,
						agentId: parent.agentId,
						storePath: parent.storeTarget.storePath
					})) ?? [];
				})]);
			} : queries;
			const membershipPending = Symbol("session-membership-pending");
			while (owner.isActive()) {
				while (owner.isActive() && owner.membership.needsPreparation(selected)) await owner.membership.prepare();
				const prepared = await owner.placementFacts.withPreparedRows(owner.projection(), owner.isActive, owner.lookup, selected, (read) => owner.membership.needsPreparation(selected) ? membershipPending : consume(read));
				if (prepared.kind === "pending") return prepared;
				if (prepared.value !== membershipPending) return {
					kind: "complete",
					value: prepared.value
				};
			}
			throw new Error("Session row projection is no longer active");
		}
	};
}
//#endregion
//#region src/gateway/session-row-transcript-backfill.ts
/** Read-only transcript fields run after foreground projection work, never during materialization. */
async function backfillSessionRowTranscriptFields(params) {
	if (params.shouldCommit?.() === false) return {};
	const transcriptScope = {
		...params,
		agentId: params.storeAgentId ?? params.agentId
	};
	try {
		const fallback = params.model && readSessionFallbackModel({
			...params.model,
			sessionEntry: params.sessionEntry,
			sessionScope: transcriptScope
		});
		const fallbackModel = fallback ? {
			provider: fallback.modelProvider,
			model: fallback.model
		} : void 0;
		const tail = readSessionTranscriptBoundedMessageTailPage(transcriptScope, {
			maxMessages: 20,
			maxBytes: 65536,
			offset: 0,
			readOnly: true
		});
		const events = tail.newestContiguousEventCount ? tail.events.slice(-tail.newestContiguousEventCount) : [];
		for (const event of events.toReversed()) {
			const projected = projectSessionDisplayMessage(sqliteMessageEventWithSeq(event), { flattenMarkdown: true });
			if (projected) return {
				lastMessagePreview: Buffer.from(projected.text, "utf16le").toString("utf16le"),
				...fallbackModel ? { fallbackModel } : {}
			};
		}
		return fallbackModel ? { fallbackModel } : {};
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error) || error instanceof SessionTranscriptStorageUnavailableError || error instanceof SessionTranscriptColdError) return {};
		throw error;
	}
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
			const current = () => !disposed && params.current(row);
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
	let disposed = false;
	const unsubscribe = registerPreparedModelRuntimePublicationListener((event) => {
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
			if (disposed || !catalogDirty) return Promise.resolve();
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
//#region src/gateway/session-row-projection-context.ts
/** Registry and display facts have their own lifecycle, independent of stored row acquisition. */
function createSessionRowProjectionContext() {
	let preparedEpoch = -1;
	let registryRevision = getSubagentRegistryPublicationRevision();
	let registrySnapshot = getSubagentSessionListReadSnapshotIdentity();
	let profileRevision = 0;
	let subagentRevision = 0;
	let parentRevision = 0;
	let modelFactsDirty = false;
	const identityProjection = createSessionIdentityProjection();
	let current = {
		...buildSessionListRowMetadataContext({ now: Date.now() }),
		identityProjection
	};
	const subagentInputs = current.subagentRuns.inputs;
	function prepare(epoch) {
		const snapshot = getSubagentSessionListReadSnapshotIdentity();
		if (preparedEpoch === epoch && registrySnapshot === snapshot) return;
		if (registrySnapshot !== snapshot) {
			registryRevision = void 0;
			registrySnapshot = snapshot;
		}
		const now = Date.now(), revision = getSubagentRegistryPublicationRevision();
		if (registryRevision !== revision) subagentRevision++;
		const subagentRuns = registryRevision === revision ? current.subagentRuns.atTime(now) : buildSubagentSessionListReadIndex(now);
		const projectedAgentRuns = buildProjectedAgentRunIndex();
		current = modelFactsDirty ? {
			...buildSessionListRowMetadataContext({
				now,
				subagentRuns,
				projectedAgentRuns,
				userProfileIdentityById: current.userProfileIdentityById
			}),
			identityProjection
		} : {
			...current,
			subagentRuns,
			projectedAgentRuns,
			projectedSubagentActivity: buildProjectedSubagentActivity(subagentRuns, projectedAgentRuns),
			subagentRunsByChildSessionKey: subagentRuns.runsByChildSessionKey
		};
		modelFactsDirty = false;
		Object.assign(subagentInputs, current.subagentRuns.inputs);
		registryRevision = revision;
		preparedEpoch = epoch;
	}
	return {
		readPrepared(epoch) {
			return preparedEpoch === epoch && parentRevision === subagentRevision && registryRevision === getSubagentRegistryPublicationRevision() && registrySnapshot === getSubagentSessionListReadSnapshotIdentity() ? current : void 0;
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
			switch (change.scope) {
				case "profiles":
					current.userProfileIdentityById.clear();
					identityProjection.invalidate();
					profileRevision++;
					return true;
				case "subagent-runs":
					registryRevision = void 0;
					return true;
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
		prepare(epoch, cfg, matching, put) {
			const previous = current.subagentRunsByChildSessionKey;
			prepare(epoch);
			if (parentRevision === subagentRevision) return;
			for (const key of /* @__PURE__ */ new Set([...previous.keys(), ...current.subagentRunsByChildSessionKey.keys()])) for (const row of matching({ key })) {
				if (!row.storedEntry) continue;
				const parents = readSessionRowParents(row, row.storedEntry, cfg, current);
				if (!sameParents(row.parents, parents)) put({
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
				row.materialized.source.childLinks = readChildLinks(row);
				row.materialized.row.swarm = buildSessionSwarmSummary(current.subagentRuns.swarmRunsByRequesterSessionKey.get(row.key) ?? [], row.key, row.agentId, { includeChildren: true });
				row.subagentRevision = subagentRevision;
			}
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
/** Retain each selected store until its prepared rows have been consumed by the projection. */
async function withSessionRowDatabaseFacts(owner, consume) {
	const revision = owner.revision();
	const registrySnapshot = getSubagentSessionListReadSnapshotIdentity();
	const ids = [];
	for (const id of owner.dirty) {
		ids.push(id);
		if (ids.length === 64) break;
	}
	const rows = ids.flatMap((id) => owner.rows.get(id) ?? []);
	const env = cloneEnvWithPlatformSemantics(process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
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
					if (prepared) facts.set(identity(row), prepared);
				}
			}
			for (const databaseOwner of owners) databaseOwner.assertCurrent();
			assertCurrent();
			if (revision !== void 0 && owner.revision() === revision && registrySnapshot === getSubagentSessionListReadSnapshotIdentity()) {
				consume(rows.filter((row) => owner.dirty.has(identity(row)) && isCurrentGeneration(row, owner.rows.get(identity(row)))).map(identity), facts);
				assertCurrent();
			}
		});
	} finally {
		for (const continuation of continuations.toReversed()) continuation.owner.release();
		native.release();
	}
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
			if (row.entry?.archivedAt !== void 0 && !row.materialized) continue;
			const id = identity(row);
			const window = windows.get(id);
			if (window) {
				window.pending = true;
				continue;
			}
			startWindow(id, row.generation);
			if (!cold) params.refresh(id);
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
function prepareSessionRowScopes(cfg, agentIds, residentPaths) {
	const residentPath = (pathname) => residentPaths.get(pathname) ?? pathname;
	const filenames = new Map([...residentPaths].map(([filename, locator]) => [locator, filename]));
	const aliases = /* @__PURE__ */ new Map();
	const capture = (options) => {
		try {
			const resolved = resolveGatewaySessionStoreTargets(cfg, {
				...options,
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
/** Select metadata before federation, visibility, and reader-only materialization. */
function selectSessionRowEntries(params, query) {
	const { cfg, scope, byAgent, byParent, rows, dirty, matching, acquire } = params;
	const matches = createSessionRowScopeMatcher(query, scope, true);
	const parent = query.parentSessionKey;
	const owner = parent && parseAgentSessionKey(parent)?.agentId;
	const agents = owner ? [owner] : query.agentId ? [query.agentId] : byAgent.keys();
	const children = /* @__PURE__ */ new Set();
	if (parent) for (const ref of [...[...agents].map((agentId) => parentReference(cfg, parent, agentId)), ...matching({
		...query,
		key: parent
	}).map((row) => physical(row.storeTarget.storePath, parent))]) for (const id of byParent.get(ref) ?? []) children.add(id);
	const sessionIdOrKey = query.sessionIdOrKey;
	let keys;
	if (sessionIdOrKey) {
		for (const id of dirty) {
			const row = rows.get(id);
			if (row && matches(row)) acquire(row);
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
	})) : parent ? [...children].map((id) => rows.get(id)) : matching(query);
	const selected = (sessionIdOrKey || dirty.size === 0 ? candidates : candidates.map((row) => row && dirty.has(identity(row)) ? acquire(row) : row)).filter((row) => hasEntry(row) && matches(row));
	return sort(selected, query.sortBy);
}
//#endregion
//#region src/gateway/session-row-projection.ts
/** Committed publications own invalidation; each admitted physical store is hydrated once. */
async function createSessionRowProjection(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	while (!getSubagentSessionListReadSnapshotIdentity()) await prepareSubagentSessionListReadCache();
	let cfg = params.getConfig?.() ?? params.cfg;
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
	let topologyDirty = true, disposed = false;
	const prepareRegistryFacts = () => !disposed && !inOwnerContext(getSubagentSessionListReadSnapshotIdentity) ? inOwnerContext(prepareSubagentSessionListReadCache) : void 0;
	const placementFacts = createSessionRowPlacementProjection(params.placementFactsReader, prepareRegistryFacts);
	let epoch = 0;
	let databaseRevision = 0;
	let revisionToken;
	let materializedCount = 0;
	let scope;
	const ensureMaterialized = createSessionProjectionDrain({
		beforeEnsure() {
			if (!disposed && !catalog.needsInitialRead) inOwnerContext(() => catalog.refresh());
		},
		hasWork: needsMaterialization,
		refresh: refreshBatch,
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
				databaseRevision++;
				revisionToken = void 0;
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
	const metadata = createSessionRowProjectionContext();
	const backfill = createSessionRowProjectionBackfill({
		ready: ensureMaterialized,
		read: (id) => rows.get(id),
		current: (row) => !topologyDirty && archive.isCurrentMaterialization(row) && isCurrent(row),
		publish(row, fields) {
			const current = rows.get(identity(row));
			if (ready(current) && publishTranscriptFields(current, fields, cfg, metadata.current)) revisionToken = void 0;
		}
	});
	const archive = createSessionRowProjectionArchive({
		rows,
		dirty,
		put,
		enqueue: (id, change) => backfill.enqueue(id, change),
		release(id) {
			transcriptUpdates.remove(id);
			backfill.remove(id);
			dirty.delete(id);
		},
		prepare(row) {
			metadata.prepare(epoch, cfg, matching, put);
			const current = acquireEntry(row, readSessionRowEntry(row));
			if (current && materialize(current)) backfill.enqueue(identity(current));
			return current;
		}
	});
	const markRelated = (row, includeChildren = true) => archive.markRelated(row, indexes, includeChildren);
	function remove(id) {
		archive.forget(id);
		transcriptUpdates.remove(id);
		const row = rows.get(id);
		if (row) {
			revisionToken = void 0;
			invalidateRowMembership(row);
			markRelated(row);
			creators.update(row);
			index(row, indexes, true);
			rows.delete(id);
			if (row.entry && !byKey.has(`id:${row.entry.sessionId}`)) placementFacts.forget(row.entry.sessionId);
		}
		dirty.delete(id);
		backfill.remove(id);
	}
	function put(row) {
		revisionToken = void 0;
		const previous = rows.get(identity(row));
		creators.update(previous, row);
		if (previous) {
			if (previous.generation !== row.generation) transcriptUpdates.remove(identity(row));
			index(previous, indexes, true);
		}
		rows.set(identity(row), row);
		index(row, indexes);
		placementFacts.update(row, previous, (sessionId) => [...byKey.get(`id:${sessionId}`) ?? []].flatMap((id) => rows.get(id) ?? []));
	}
	function acquireEntry(row, storedEntry) {
		if (storedEntry?.archivedAt !== void 0) inOwnerContext(() => metadata.prepare(epoch, cfg, matching, put));
		return acquireSessionRowEntry({
			row,
			storedEntry,
			cfg,
			context: metadata.current,
			remove,
			put,
			markRelated,
			archive
		});
	}
	function matching(query, kind = "key") {
		return selectMatchingSessionRows({
			rows,
			indexes,
			scope
		}, query, kind);
	}
	const lookup = (query) => lookupSessionRow(query, {
		disposed,
		cfg,
		matching,
		storePaths: stores.keys()
	});
	function referenced(ref) {
		return firstReferenced(ref, rows, byKey, stores.keys());
	}
	function topology() {
		const revision = epoch;
		cfg = params.getConfig?.() ?? cfg;
		const admitted = /* @__PURE__ */ new Set();
		const storeRead = createStoreRead({
			stores,
			rows,
			byStore
		});
		const loaded = loadCombinedSessionStoreForGatewayCore(cfg, {
			includeIncognito: false,
			preserveSentinelOwners: "physical",
			loadEntries: storeRead.loadEntries,
			onStoreLoaded(target, agentId, discovery) {
				const source = storeRead.sources.get(target.storePath);
				if (source) {
					source.agentId = agentId;
					source.discoveryAgentId = discovery?.agentId ?? null;
					source.discoveryOrder = discovery?.order;
				}
			}
		});
		for (const [key, target] of loaded.targetsBySessionKey) {
			const entry = target.entry;
			if (!entry || entry.incognito || isIncognitoSessionKey(key)) continue;
			const fields = {
				key: target.storeKey ?? key,
				agentId: target.agentId,
				storeTarget: target.storeTarget
			};
			const id = identity(fields);
			admitted.add(id);
			if (!rows.has(id) || storeRead.replaced.has(target.storeTarget.storePath)) {
				remove(id);
				const row = acquireEntry(create(fields), entry);
				if (row && !isColdArchivedSessionRow(row)) {
					dirty.add(id);
					backfill.enqueue(id);
				}
			} else {
				const row = rows.get(id);
				if (row.entry?.archivedAt !== void 0) acquireEntry(row, entry);
			}
		}
		for (const id of rows.keys()) if (!admitted.has(id)) remove(id);
		stores = storeRead.sources;
		membership.updateTargets([...stores.values()].map((source) => ({
			agentId: source.target.agentId,
			storePath: source.target.storePath,
			discoveryAgentId: source.discoveryAgentId,
			discoveryOrder: source.discoveryOrder,
			identity: source.identity,
			birthtime: source.birthtime,
			filename: source.filename
		})));
		scope = prepareSessionRowScopes(cfg, byAgent.keys(), new Map([...stores].map(([locator, source]) => [source.filename, locator])));
		topologyDirty = epoch !== revision;
	}
	function mark(change) {
		epoch++;
		revisionToken = void 0;
		const presentationOnly = metadata.invalidate(change) && !change.factsInvalidated;
		if (!presentationOnly) databaseRevision++;
		if ("all" in change) {
			placementFacts.invalidateChange(change);
			topologyDirty ||= change.scope === "stores" || change.scope === "config";
			if (change.scope === "catalog" || change.scope === "config") catalog.invalidate();
			if (!presentationOnly && (change.scope !== "catalog" || !params.getModelCatalog)) archive.invalidateRows(change, typeof change.scope === "string" ? rows.values() : matching(change.scope));
		} else if (change.scope === "automation") markAutomation(matching({ key: change.sessionKey }).filter((row) => !isColdArchivedSessionRow(row)), change.agentId, dirty);
		else if (!presentationOnly) {
			const query = {
				...change,
				key: change.sessionKey
			};
			const exact = matching(query);
			const registryFactsReady = inOwnerContext(getSubagentSessionListReadSnapshotIdentity);
			for (const previous of /* @__PURE__ */ new Set([...exact, ...matching(query, "id")])) {
				if (previous.entry) placementFacts.invalidate(previous.entry.sessionId);
				const row = inOwnerContext(() => {
					const entry = readSessionRowEntry(previous);
					markRelated(previous, changesSessionRowDependents(previous.storedEntry, entry));
					previous.sharingEntry = entry;
					if (entry?.archivedAt !== void 0 && !registryFactsReady) return archive.deferAcquisition({
						...previous,
						hasBoard: void 0
					});
					return isColdArchivedSessionRow(previous) || changesRowStructure(previous, entry) ? acquireEntry({
						...previous,
						hasBoard: void 0
					}, entry) : previous;
				});
				if (row && !isColdArchivedSessionRow(row)) {
					dirty.add(identity(row));
					backfill.enqueue(identity(row));
				}
			}
			if (!exact.length && !isInternalSessionEffectsKey(change.sessionKey) && !isIncognitoSessionKey(change.sessionKey)) {
				const matches = createSessionRowScopeMatcher(change, scope);
				for (const source of stores.values()) {
					const agentId = parseAgentSessionKey(change.sessionKey)?.agentId ?? source.agentId;
					const row = create({
						key: change.sessionKey,
						agentId,
						storeTarget: source.target
					});
					if (!matches(row) || !change.storePath && agentId !== source.agentId) continue;
					const admitted = inOwnerContext(() => {
						const entry = readSessionRowEntry(row);
						row.sharingEntry = entry;
						if (entry?.archivedAt !== void 0 && !registryFactsReady) return archive.deferAcquisition(row);
						return acquireEntry(row, entry);
					});
					if (!admitted || isColdArchivedSessionRow(admitted)) continue;
					dirty.add(identity(admitted));
					backfill.enqueue(identity(admitted));
				}
			}
		}
		ensureMaterialized().catch(() => {});
	}
	const { readSourceEntry, readChildLinks } = createSessionRowRelationReads({
		config: () => cfg,
		rows,
		byParent,
		dirty,
		referenced,
		readEntry: readSessionRowEntry,
		acquireEntry
	});
	function materialize(row, configuredAgentIds = new Set(listAgentIds(cfg)), readRow = readResidentSessionRow, databaseFacts) {
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
			databaseFacts
		});
		if (!isIncognitoSessionKey(row.key) && rows.get(identity(row)) !== row) return false;
		if (!isIncognitoSessionKey(row.key)) placementFacts.register(row.entry.sessionId);
		revisionToken = void 0;
		Object.assign(row, prepared, {
			materializedSequence: ++materializedCount,
			...metadata.materializedRevisions
		});
		return true;
	}
	const refresh = createSessionRowMaterializer({
		isActive: () => !disposed,
		rows,
		dirty,
		prepare: () => {
			metadata.prepare(epoch, cfg, matching, put);
			return cfg;
		},
		revision: () => epoch,
		acquireEntry,
		readEntry: readSessionRowEntry,
		materialize,
		forgetBackfill: backfill.remove
	});
	async function refreshBatch() {
		for (let pending = prepareRegistryFacts(); pending; pending = prepareRegistryFacts()) await pending;
		if (disposed) return;
		if (topologyDirty) topology();
		await membership.prepare();
		if (catalog.needsInitialRead) await catalog.refresh();
		await placementFacts.prepare();
		for (let pending = prepareRegistryFacts(); pending; pending = prepareRegistryFacts()) await pending;
		if (topologyDirty || membership.needsPreparation || placementFacts.needsPreparation) return;
		await withSessionRowDatabaseFacts({
			rows,
			dirty,
			revision: () => disposed ? void 0 : databaseRevision
		}, (ids, facts) => withAgentRosterFactsBatch(cfg, () => refresh(ids, facts)));
	}
	function needsMaterialization() {
		return !disposed && (topologyDirty || catalog.needsInitialRead || dirty.size > 0 || membership.needsPreparation || placementFacts.needsPreparation || !inOwnerContext(() => metadata.readPrepared(epoch)));
	}
	const transcriptUpdates = createSessionRowProjectionTranscriptUpdates({
		matching,
		mark,
		read: (id) => rows.get(id),
		refresh(id) {
			const row = rows.get(id);
			if (!row || isColdArchivedSessionRow(row)) return;
			epoch++;
			databaseRevision++;
			revisionToken = void 0;
			dirty.add(id);
			backfill.enqueue(id);
			ensureMaterialized().catch(() => {});
		}
	});
	const stop = [
		retainUserProfileCatalog(),
		sessionChanges.subscribeFacts(membership.invalidate),
		sessionChanges.subscribeProjection(mark),
		onSessionLifecycleEvent(mark),
		onSessionIdentityMutation((mutation) => {
			for (const key of mutation.previous.sessionKeys) for (const row of matching({
				key,
				agentId: mutation.agentId
			})) {
				if (mutation.previous.sessionId && row.entry?.sessionId !== mutation.previous.sessionId) continue;
				markRelated(row);
				if ("current" in mutation && mutation.current.sessionKeys.includes(row.key)) {
					put(renewGeneration(row));
					dirty.add(identity(row));
				} else remove(identity(row));
			}
			if ("current" in mutation) for (const sessionKey of mutation.current.sessionKeys) mark({
				agentId: mutation.agentId,
				sessionKey
			});
			else ensureMaterialized().catch(() => {});
		})
	];
	function isCurrent(row) {
		const current = isIncognitoSessionKey(row.key) ? lookup({
			...row,
			storePath: row.storeTarget.storePath
		}) : rows.get(identity(row));
		return isCurrentGeneration(row, current);
	}
	function prepareRead() {
		if (topologyDirty) inOwnerContext(topology);
		metadata.prepare(epoch, cfg, matching, put);
	}
	const describe = (query, captured) => inOwnerContext(() => {
		if (disposed) return;
		prepareRead();
		let row = lookup(query);
		if (row && isIncognitoSessionKey(row.key)) materialize(row);
		else {
			if (row && dirty.has(identity(row))) {
				const id = identity(row);
				withAgentRosterFactsBatch(cfg, () => refresh([id]));
				row = lookup(query);
			}
			row = archive.describe(row);
		}
		if (captured && !isCurrent(captured)) return;
		if (!ready(row)) return;
		metadata.preparePresentation(row, readChildLinks);
		return row;
	});
	function dispose() {
		revisionToken = void 0;
		disposed = true;
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
		creators.dispose();
		archive.clear();
	}
	function selectEntries(query = {}) {
		if (disposed) return [];
		return inOwnerContext(() => {
			prepareRead();
			return withAgentRosterFactsBatch(cfg, () => selectSessionRowEntries({
				cfg,
				scope,
				byAgent,
				byParent,
				rows,
				dirty,
				matching,
				acquire: (row) => acquireEntry(row, readSessionRowEntry(row))
			}, query));
		});
	}
	await inOwnerContext(async () => {
		await ensureSessionGroupCatalog();
		await refreshBatch();
	}).catch((error) => {
		dispose();
		throw error;
	});
	ensureMaterialized().catch(() => {});
	backfill.start();
	const { needsExactMembershipPreparation, ...membershipRead } = createSessionRowMembershipReadAccess({
		membership,
		runInOwner: inOwnerContext,
		isActive: () => !disposed,
		topologyDirty: () => topologyDirty,
		topology,
		lookup,
		owner: () => projection
	});
	const projection = {
		readPreparedRowContext: () => disposed ? void 0 : inOwnerContext(() => metadata.readPrepared(epoch)),
		capture(query) {
			if (!disposed && topologyDirty) inOwnerContext(topology);
			const row = lookup(query);
			return row && dirty.has(identity(row)) ? acquireEntry(row, readSessionRowEntry(row)) ?? row : row;
		},
		findBySessionId(query) {
			if (!disposed && topologyDirty) inOwnerContext(topology);
			return findSessionRowById(query, {
				disposed,
				lookup,
				matching
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
			describe,
			inOwnerContext,
			placementFacts,
			membership: {
				prepare: membershipRead.prepareMembership,
				needsPreparation: needsExactMembershipPreparation
			},
			isActive: () => !disposed,
			projection: () => projection
		}),
		setArchivePageSize: archive.setPageSize,
		modelFacts(row) {
			return readSessionRowModelFacts({
				cfg,
				...row,
				source: {
					entry: row.storedEntry,
					readSourceEntry: (key) => readSourceEntry(row, key)
				},
				modelCatalog: catalog.current,
				rowContext: metadata.current
			});
		},
		present: (record, options) => present(record, metadata.current, options),
		ensureMaterialized,
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
		get state() {
			if (!disposed) prepareRead();
			return {
				revision: revisionToken ??= {},
				cfg,
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

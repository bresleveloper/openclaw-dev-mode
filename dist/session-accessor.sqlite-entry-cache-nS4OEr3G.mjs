import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as getNodeSqliteKysely, d as sql, n as createSqliteQueryCache, o as iterateSqliteQuerySync, r as executeSqliteQuerySync, s as prepareSqliteQueryIterator, u as sqliteStringSet } from "./kysely-sync-K7ftY-g4.mjs";
import { a as readSqliteDataVersion, n as getAdmittedSqliteSchemaFacts, o as runSqliteReadOperationSync } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { g as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { f as invalidateOpenClawAgentWritableProjections } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { r as readOpenClawAgentDatabase } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { r as invalidateOpenClawAgentReadOnlyProjections } from "./openclaw-agent-db-readonly-scope-CLlkTUQB.mjs";
import { r as readSqliteSessionOwner, t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-EwCluh1i.mjs";
import { d as publishTrackedCacheUpdate, f as sessionEntryCaches, g as readSessionNodesGeneration, h as readSessionEntryCacheValidityToken, o as projectSqliteSessionParticipantsBatch, p as cacheValidityTokensEqual, s as readSqliteSessionParticipantProjection } from "./internal-session-key-CPayZwJR.mjs";
import { a as selectSessionEntryRows, r as parseSessionEntryJson } from "./session-accessor.sqlite-status-zTXzk4Sy.mjs";
import { c as hasCanonicalSessionValidationProjection, r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-D1TSJMmX.mjs";
import { a as readExactSessionEntryRow, f as validateDeliveryCanonicalSessionEntry, r as prepareExactSessionEntryRowReads } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { t as projectSessionEntryCapabilityFacts } from "./session-entry-capability-facts-D2INtkAm.mjs";
import { r as listSessionMembersInDatabase } from "./session-sharing-store.kernel-BCRJJ2WM.mjs";
import { f as shouldPreserveMaintenanceEntry, i as getSessionMaintenanceActivityAt } from "./store-maintenance-CGOlSbiV.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual, toUSVString } from "node:util";
//#region src/config/sessions/session-accessor.sqlite-entry-cache-projection.ts
function loadSessionEntrySnapshot(database, projection = "list", prepared, deferParticipants = false) {
	const metadata = prepared && prepared.dataVersion === readSqliteDataVersion(database.db) ? prepared : void 0;
	const parsedEntries = metadata?.entries ?? /* @__PURE__ */ new Map();
	const keys = metadata?.keys ?? [];
	if (!metadata) for (const row of iterateSqliteQuerySync(database.db, selectSessionEntryRows(database, projection).select("updated_at").orderBy("session_key"))) {
		keys.push(row.session_key);
		const entry = parseSessionEntryJson(row, projection);
		if (entry) parsedEntries.set(row.session_key, entry);
	}
	return {
		entries: deferParticipants ? parsedEntries : projectSqliteSessionParticipantsBatch(database.db, parsedEntries),
		keys
	};
}
function readSessionEntrySideMetadata(database, sessionKey, participants) {
	const ownerRow = hasSqliteSessionOwnerColumns(database.db) ? executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
		"owner_actor_type",
		"owner_actor_id",
		"owner_assigned_by_type",
		"owner_assigned_by_id",
		"owner_assigned_at"
	]).where("session_key", "=", sessionKey).limit(1)).rows[0] : void 0;
	const owner = ownerRow ? readSqliteSessionOwner(ownerRow) : void 0;
	return {
		...owner ? { owner } : {},
		...participants ?? readSqliteSessionParticipantProjection(database.db, sessionKey)
	};
}
function projectSessionEntryCacheUpdate(entryJson, sideMetadata) {
	const parsedEntry = parseSessionEntryJson({ entry_json: entryJson }, "list");
	return parsedEntry ? freezeJsonSnapshot({
		...parsedEntry,
		...sideMetadata
	}) : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-sharing-acquisition.ts
function publishRetainedSessionGeneration(read, entry, known) {
	const generation = read.generation;
	if (generation?.initiallyAbsent) {
		if (generation.current === null) generation.current = known ? entry ?? null : void 0;
		return;
	}
	if (!generation?.current) return;
	if (!known) generation.current = void 0;
	else if (!entry || generation.current.sessionId !== entry.sessionId || generation.current.lifecycleRevision !== entry.lifecycleRevision) generation.current = null;
}
/** Reconcile one worker snapshot with commit postimages, without adopting another lifecycle. */
function reconcileSessionSharingAcquisition(acquisition, snapshot) {
	if (acquisition.invalidated || acquisition.sessionId !== void 0 && acquisition.sessionId !== snapshot.entry?.sessionId || acquisition.entry !== void 0 && acquisition.entry.lifecycleRevision !== snapshot.entry?.lifecycleRevision) throw new Error("Session sharing acquisition is no longer current");
	const membership = new Set(snapshot.membership);
	for (const [identityId, present] of acquisition.membership) if (present) membership.add(identityId);
	else membership.delete(identityId);
	return {
		...snapshot,
		entry: acquisition.entry ?? snapshot.entry,
		membership
	};
}
/** The committing producer supplies both identities; a matching final snapshot cannot undo reset. */
function recordAcquiringSessionEntry(acquisition, entry, previous) {
	if (!acquisition) return;
	if (!entry || !previous || previous.sessionId !== entry.sessionId || previous.lifecycleRevision !== entry.lifecycleRevision || acquisition.sessionId !== void 0 && acquisition.sessionId !== entry.sessionId || acquisition.entry !== void 0 && acquisition.entry.lifecycleRevision !== entry.lifecycleRevision) {
		acquisition.invalidated = true;
		return;
	}
	acquisition.entry = entry;
	acquisition.sessionId = entry.sessionId;
}
function recordAcquiringSessionMember(acquisition, member) {
	if (acquisition.sessionId !== void 0 && acquisition.sessionId !== member.sessionId) acquisition.invalidated = true;
	acquisition.sessionId = member.sessionId;
	acquisition.membership.set(member.identityId, member.present);
}
/** Apply a committed field postimage only to its original session generation. */
function updateSessionSharingField(facts, change) {
	if (facts.entry?.sessionId !== change.sessionId) return facts;
	if (change.kind === "owner") return (facts.entry.lifecycleRevision ?? null) === change.lifecycleRevision ? {
		...facts,
		entry: {
			...facts.entry,
			owner: change.owner
		}
	} : facts;
	const membership = new Set(facts.membership);
	if (change.present) membership.add(change.identityId);
	else membership.delete(change.identityId);
	return {
		...facts,
		membership
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache-publication-state.ts
const preparedSharingReads = resolveGlobalSingleton(Symbol.for("openclaw.preparedSessionSharingReads"), () => /* @__PURE__ */ new Map());
const pendingSessionEntryPublications = resolveGlobalSingleton(Symbol.for("openclaw.pendingSessionEntryPublications"), () => /* @__PURE__ */ new Map());
function recordCommittedSessionEntryPublication(database, sessionKey, entry) {
	const identity = typeof database === "string" ? database : findOpenClawAgentDatabaseIdentity(database)?.identity;
	if (typeof identity !== "string") return;
	for (const pending of pendingSessionEntryPublications.get(`file:${identity}\0${sessionKey}`) ?? []) pending.superseded.set(sessionKey, entry ? {
		sessionId: entry.sessionId,
		lifecycleRevision: entry.lifecycleRevision
	} : void 0);
}
function recordCommittedSessionMetadataPublication(database, sessionKey) {
	const identity = findOpenClawAgentDatabaseIdentity(database)?.identity;
	if (typeof identity === "string") for (const pending of pendingSessionEntryPublications.get(`file:${identity}\0${sessionKey}`) ?? []) pending.metadataSuperseded.add(sessionKey);
}
/** The existing entry writer advances retained facts before any commit observer can reenter. */
function retainPreparedSessionSharingFacts(params) {
	const key = `${params.databaseIdentity}\0${params.sessionKey}`;
	const initial = "acquiring" in params ? void 0 : params;
	const read = {
		pending: /* @__PURE__ */ new Set(),
		facts: initial && {
			entry: initial.entry,
			placeholder: initial.placeholder,
			membership: initial.membership
		},
		generation: initial?.generation,
		acquisition: initial ? void 0 : {
			invalidated: false,
			membership: /* @__PURE__ */ new Map()
		}
	};
	const reads = preparedSharingReads.get(key) ?? /* @__PURE__ */ new Set();
	reads.add(read);
	preparedSharingReads.set(key, reads);
	let active = true;
	const pending = (membership) => read.pending.size > 0 || [...pendingSessionEntryPublications.get(key) ?? []].some((publication) => !publication.settled && (!publication.superseded.has(params.sessionKey) && (!membership || !publication.sharingUnchanged.has(params.sessionKey)) || membership && publication.membershipInvalidated.has(params.sessionKey)));
	return {
		prepareRead: () => {
			const completions = [...pendingSessionEntryPublications.get(key) ?? []].flatMap((publication) => !publication.settled && !publication.superseded.has(params.sessionKey) ? [publication.completion] : []);
			return completions.length > 0 ? Promise.all(completions).then(() => {}) : void 0;
		},
		initialize: (snapshot) => {
			const acquisition = read.acquisition;
			if (!active || !acquisition) throw new Error("Session sharing acquisition is no longer current");
			read.facts = reconcileSessionSharingAcquisition(acquisition, snapshot);
			read.acquisition = void 0;
		},
		readGeneration: () => active && !pending(false) ? read.generation?.current : void 0,
		readCurrent: () => pending(true) ? void 0 : read.facts,
		release: () => {
			if (!active) return;
			active = false;
			read.facts = void 0;
			read.acquisition = void 0;
			reads.delete(read);
			if (reads.size === 0 && preparedSharingReads.get(key) === reads) preparedSharingReads.delete(key);
		}
	};
}
/** Generation custody shares the entry publication owner, independently of membership. */
function retainPreparedSessionGenerationFacts(params) {
	const retained = retainPreparedSessionSharingFacts({
		...params,
		membership: /* @__PURE__ */ new Set(),
		generation: {
			current: params.entry ?? null,
			initiallyAbsent: params.entry ? void 0 : true
		}
	});
	return {
		readCurrent: retained.readGeneration,
		prepareRead: retained.prepareRead,
		release: retained.release
	};
}
function retainedSharingReads(database, sessionKey) {
	const identity = typeof database === "string" ? database : findOpenClawAgentDatabaseIdentity(database)?.identity;
	return typeof identity === "string" ? preparedSharingReads.get(`file:${identity}\0${sessionKey}`) : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.types.ts
function projectSessionSharingEntry(entry) {
	return {
		sessionId: entry.sessionId,
		previousSessionId: entry.previousSessionId,
		updatedAt: entry.updatedAt,
		createdAt: entry.createdAt,
		initializationPending: entry.initializationPending,
		providerReview: entry.providerReview ? structuredClone(entry.providerReview) : void 0,
		mainRestartRecovery: entry.mainRestartRecovery ? structuredClone(entry.mainRestartRecovery) : void 0,
		modelSelectionLocked: entry.modelSelectionLocked,
		pendingProjectGitUrl: entry.pendingProjectGitUrl,
		pendingWorktree: entry.pendingWorktree ? structuredClone(entry.pendingWorktree) : void 0,
		lifecycleRevision: entry.lifecycleRevision,
		lifecycleRunId: entry.lifecycleRunId,
		activeWriterRunId: entry.activeWriterRunId,
		...entry.subagentRecovery ? { subagentRecovery: {
			lastRunId: entry.subagentRecovery.lastRunId,
			sessionLifecycleRunId: entry.subagentRecovery.sessionLifecycleRunId
		} } : {},
		archivedAt: entry.archivedAt,
		...entry.repositoryWorkspaceId === void 0 ? {} : { repositoryWorkspaceId: entry.repositoryWorkspaceId },
		visibility: entry.visibility,
		incognito: entry.incognito,
		createdActor: entry.createdActor ? { ...entry.createdActor } : void 0,
		owner: entry.owner ? {
			...entry.owner,
			actor: { ...entry.owner.actor },
			assignedBy: entry.owner.assignedBy ? { ...entry.owner.assignedBy } : void 0
		} : void 0,
		sandbox: entry.sandbox,
		spawnedBy: entry.spawnedBy,
		spawnDepth: entry.spawnDepth,
		parentSessionKey: entry.parentSessionKey,
		sessionStartedAt: entry.sessionStartedAt
	};
}
const creationBrand = Symbol("sessionEntryCreation");
/** Allocate an opaque token; the publication owner's WeakMap alone grants live custody. */
function createSessionEntryCreationOperation() {
	return Object.freeze({ [creationBrand]: true });
}
/** Timestamp-only progress does not change retained sharing authority. */
function sessionSharingEntriesEqual(previous, current) {
	if (!previous || !current) return false;
	const { updatedAt: _previousUpdatedAt, ...before } = projectSessionSharingEntry(previous);
	const { updatedAt: _currentUpdatedAt, ...after } = projectSessionSharingEntry(current);
	return isDeepStrictEqual(before, after);
}
function readSessionEntryCreationIdentity(creation) {
	return creation.source.kind === "native" ? creation.source.database.db : creation.source.databaseIdentity;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-incognito-sharing.ts
const incognitoSharingEntries = resolveGlobalSingleton(Symbol.for("openclaw.incognitoSessionSharingEntries"), () => /* @__PURE__ */ new WeakMap());
function incognitoSharingState(database) {
	let state = incognitoSharingEntries.get(database);
	if (!state) {
		state = {
			entries: /* @__PURE__ */ new Map(),
			pending: /* @__PURE__ */ new Map()
		};
		incognitoSharingEntries.set(database, state);
	}
	return state;
}
function stageIncognitoSharingPublication(database, sessionKey, current) {
	const state = incognitoSharingState(database);
	const token = {};
	const pending = state.pending.get(sessionKey) ?? /* @__PURE__ */ new Map();
	state.pending.set(sessionKey, pending);
	let facts = current ? current.facts : state.entries.get(sessionKey);
	if (!current) for (const staged of pending.values()) facts = staged;
	pending.set(token, facts);
	return () => {
		pending.delete(token);
		if (pending.size === 0) state.pending.delete(sessionKey);
	};
}
function commitIncognitoSessionSharingFacts(database, sessionKey, facts) {
	const entries = incognitoSharingState(database).entries;
	if (facts !== void 0) entries.set(sessionKey, facts);
	else entries.delete(sessionKey);
}
function commitIncognitoSessionSharingField(database, sessionKey, change) {
	const entries = incognitoSharingEntries.get(database)?.entries;
	const current = entries?.get(sessionKey);
	if (current) entries?.set(sessionKey, updateSessionSharingField(current, change));
}
function readCommittedIncognitoSessionSharing(database, sessionKey) {
	const state = incognitoSharingEntries.get(database);
	if (state?.pending.has(sessionKey)) throw new Error("Incognito session sharing publication is pending");
	const current = state?.entries.get(sessionKey);
	if (current === null) throw new Error("Incognito session sharing projection is unavailable");
	return current;
}
/** A native commit guard sees its transaction's producer-supplied postimage without SQL. */
function readIncognitoSessionEntryCurrent(database, sessionKey) {
	const pending = database.isTransaction ? incognitoSharingEntries.get(database)?.pending.get(sessionKey) : void 0;
	if (!pending?.size) return readCommittedIncognitoSessionSharing(database, sessionKey)?.entry;
	let current;
	for (const facts of pending.values()) current = facts;
	if (current === null) throw new Error("Incognito session currency projection is unavailable");
	return current?.entry;
}
function publishIncognitoSessionEntryChange(database, update) {
	let current;
	try {
		const entry = update.entry ?? readExactSessionEntryRow(database, update.sessionKey, "list")?.entry;
		current = entry ? {
			entry: projectSessionSharingEntry(entry),
			capability: projectSessionEntryCapabilityFacts(entry),
			membership: new Set(listSessionMembersInDatabase(database, update.sessionKey).map((member) => member.identityId))
		} : void 0;
	} catch {
		current = null;
	}
	publishTrackedCacheUpdate(database, () => commitIncognitoSessionSharingFacts(database.db, update.sessionKey, current), () => stageIncognitoSharingPublication(database.db, update.sessionKey, { facts: current }));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-age-queries.ts
function createAgeReaders(database) {
	const db = getNodeSqliteKysely(database);
	const projection = db.selectFrom("session_nodes").select([
		"session_key",
		"updated_at",
		"archived_at",
		"last_activity_at",
		"last_interaction_at"
	]).select((eb) => eb.case().when(eb.fn("json_valid", ["entry_json"]), "=", 1).then(eb.cast(eb.fn("json_extract", [eb.ref("entry_json"), eb.val("$.sessionStartedAt")]), "integer")).else(null).end().as("session_started_at"));
	const ordered = db.selectFrom(projection.modifyEnd(sql`INDEXED BY idx_agent_session_nodes_updated_at`).as("age_rows")).where("archived_at", "is", null).orderBy("updated_at", "asc").orderBy("session_key", "desc");
	const dashboards = db.withRecursive("age_namespaces", (query) => query.selectFrom("session_nodes").select((eb) => eb.fn.min("session_key").as("first_key")).where("session_key", ">=", "agent:").where("session_key", "<", "agent;").unionAll(query.selectFrom("age_namespaces").select((eb) => eb.selectFrom("session_nodes").select((inner) => inner.fn.min("session_key").as("first_key")).where("session_key", ">", sql`CASE
                    WHEN instr(substr(${eb.ref("age_namespaces.first_key")}, 7), ':') > 0
                    THEN substr(${eb.ref("age_namespaces.first_key")}, 1, 5 + instr(substr(${eb.ref("age_namespaces.first_key")}, 7), ':')) || ';'
                    ELSE ${eb.ref("age_namespaces.first_key")}
                  END`).where("session_key", "<", "agent;").as("first_key")).where("first_key", "is not", null))).selectFrom("age_namespaces").crossJoin(projection.as("age_rows")).where("age_rows.session_key", ">=", sql`substr(first_key, 1, 6 + instr(substr(first_key, 7), ':')) || 'dashboard:'`).where("age_rows.session_key", "<", sql`substr(first_key, 1, 6 + instr(substr(first_key, 7), ':')) || 'dashboard;'`).where("archived_at", "is", null).selectAll("age_rows");
	const uncertified = db.selectFrom("session_canonical_validation_pending as pending").crossJoin(projection.as("age_rows")).whereRef("pending.session_key", "=", "age_rows.session_key").where("archived_at", "is", null).selectAll("age_rows");
	return {
		after: prepareSqliteQueryIterator(database, (parameter) => ordered.select(["session_key", "updated_at"]).where("updated_at", ">", parameter((minimum) => minimum))),
		activity: prepareSqliteQueryIterator(database, () => ordered.selectAll("age_rows")),
		dashboards: prepareSqliteQueryIterator(database, () => dashboards),
		uncertified: prepareSqliteQueryIterator(database, () => uncertified)
	};
}
const readSessionMaintenanceAgeQueries = createSqliteQueryCache(createAgeReaders);
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-age.ts
const changeObservers = /* @__PURE__ */ new Map();
function captureSessionEntryMaintenanceAgeChange(change) {
	const pick = ({ updatedAt, lastActivityAt, lastInteractionAt, sessionStartedAt, archivedAt }) => ({
		updatedAt,
		lastActivityAt,
		lastInteractionAt,
		sessionStartedAt,
		archivedAt
	});
	return {
		sessionKey: change.sessionKey,
		entry: pick(change.entry),
		previousEntry: change.previousEntry && pick(change.previousEntry)
	};
}
function observeSessionEntryMaintenanceAgeChanges(identity, observe) {
	const observers = changeObservers.get(identity) ?? /* @__PURE__ */ new Set();
	observers.add(observe);
	changeObservers.set(identity, observers);
	return () => {
		observers.delete(observe);
		if (!observers.size && changeObservers.get(identity) === observers) changeObservers.delete(identity);
	};
}
function publishSessionEntryMaintenanceAgeChanges(identity, changes) {
	for (const change of changes) for (const observe of changeObservers.get(identity) ?? []) observe(change);
}
const SESSION_ENTRY_MAINTENANCE_INTERVAL_MS = 18e5;
const ageFacts = /* @__PURE__ */ new WeakMap();
function stageSessionEntryMaintenanceAgeFact(db, fact) {
	if (stageSqliteTransactionState(db, {
		stage: () => ageFacts.set(db, { fact }),
		rollback: () => ageFacts.delete(db),
		commit: () => {}
	})) return;
	if (!db.isTransaction) ageFacts.set(db, { fact });
}
function invalidateSessionEntryMaintenanceAgeFact(db) {
	ageFacts.delete(db);
}
function readSessionEntryMaintenanceAgeFact(db, maintenance) {
	const fact = ageFacts.get(db)?.fact;
	if (!fact) return;
	const now = Date.now();
	if (agePolicy(fact.maintenance) !== agePolicy(maintenance) || now >= fact.recheckAt || fact.recheckAt > now + 18e5) {
		invalidateSessionEntryMaintenanceAgeFact(db);
		return;
	}
	return fact;
}
/** Capture identity stays on the connection that owns maintenance planning. */
function captureSessionEntryMaintenanceAgeFact(db, maintenance) {
	readSessionEntryMaintenanceAgeFact(db, maintenance);
	let capture = ageFacts.get(db);
	if (!capture) {
		capture = {};
		ageFacts.set(db, capture);
	}
	return capture;
}
function isDashboardKey(key) {
	return parseAgentSessionKey(key)?.rest.startsWith("dashboard:") === true;
}
/** Tracked writes can only bring the conservative age boundary forward. */
function advanceSessionEntryMaintenanceAgeFact(db, update) {
	if (changeObservers.size) {
		const identity = findOpenClawAgentDatabaseIdentity({ db })?.identity;
		if (identity !== void 0 && changeObservers.has(identity)) {
			const change = captureSessionEntryMaintenanceAgeChange(update);
			const publish = () => publishSessionEntryMaintenanceAgeChanges(identity, [change]);
			if (!deferSqlitePostCommitPublication(db, publish) && !db.isTransaction) publish();
		}
	}
	applySessionEntryMaintenanceAgeChange(db, update);
}
function applySessionEntryMaintenanceAgeChange(db, update) {
	const fact = ageFacts.get(db)?.fact;
	if (!fact) {
		invalidateSessionEntryMaintenanceAgeFact(db);
		return;
	}
	if (update.entry.archivedAt !== void 0) return;
	const { entry, previousEntry } = update;
	if (previousEntry && (previousEntry.archivedAt !== void 0 || entry.updatedAt < previousEntry.updatedAt || getSessionMaintenanceActivityAt(entry) < getSessionMaintenanceActivityAt(previousEntry))) {
		invalidateSessionEntryMaintenanceAgeFact(db);
		return;
	}
	const at = nextEntryAgeAt(update.sessionKey, entry, fact.maintenance, previousEntry ? Date.now() : -Infinity);
	if (!previousEntry || at < fact.next.at) stageSessionEntryMaintenanceAgeFact(db, {
		...fact,
		next: { at: Math.min(at, fact.next.at) }
	});
}
function agePolicy(maintenance) {
	return JSON.stringify([
		maintenance.pruneAfterMs,
		maintenance.archiveDashboardAfterMs,
		maintenance.preserveRecentMs
	]);
}
function nextEntryAgeAt(key, entry, maintenance, now) {
	if (shouldPreserveMaintenanceEntry({
		key,
		entry: void 0
	})) return Infinity;
	const activityAt = getSessionMaintenanceActivityAt(entry);
	let next = Infinity;
	for (const [timestamp, age] of [
		[entry?.updatedAt ?? 0, maintenance.pruneAfterMs],
		[activityAt, isDashboardKey(key) ? maintenance.archiveDashboardAfterMs : null],
		[activityAt, maintenance.preserveRecentMs]
	]) if (timestamp != null) next = Math.min(next, nextAgeAt(timestamp, age, now));
	return next;
}
function nextAgeAt(timestamp, age, plannedAt) {
	const at = age != null && age > 0 ? timestamp + age + 1 : Infinity;
	return at > plannedAt ? at : Infinity;
}
function readActivityAt(row) {
	return getSessionMaintenanceActivityAt({
		updatedAt: row.updated_at,
		lastActivityAt: row.last_activity_at ?? void 0,
		lastInteractionAt: row.last_interaction_at ?? void 0,
		sessionStartedAt: row.session_started_at ?? void 0
	});
}
/** The caller's transaction keeps these indexed probes in one snapshot. */
function recordSessionEntryMaintenanceAgeFact(database, maintenance, plannedAt) {
	const next = { at: Infinity };
	const fact = {
		maintenance,
		next,
		recheckAt: plannedAt + SESSION_ENTRY_MAINTENANCE_INTERVAL_MS
	};
	const queries = readSessionMaintenanceAgeQueries(database.db);
	if (maintenance.pruneAfterMs > 0) {
		for (const row of queries.after(plannedAt - maintenance.pruneAfterMs - 1)) if (!shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry: void 0
		})) {
			next.at = row.updated_at + maintenance.pruneAfterMs + 1;
			break;
		}
	}
	const dashboardRows = hasCanonicalSessionValidationProjection(database) ? [queries.dashboards(void 0), queries.uncertified(void 0)] : [queries.activity(void 0)];
	for (const rows of dashboardRows) for (const row of rows) {
		if (!isDashboardKey(row.session_key) || shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry: void 0
		})) continue;
		next.at = Math.min(next.at, nextAgeAt(readActivityAt(row), maintenance.archiveDashboardAfterMs, plannedAt));
	}
	const recentAge = maintenance.preserveRecentMs;
	if (recentAge != null && recentAge > 0) for (const row of queries.activity(void 0)) {
		if (row.updated_at + recentAge + 1 >= next.at) break;
		if (!shouldPreserveMaintenanceEntry({
			key: row.session_key,
			entry: void 0
		})) next.at = Math.min(next.at, nextAgeAt(readActivityAt(row), recentAge, plannedAt));
	}
	stageSessionEntryMaintenanceAgeFact(database.db, fact);
	return fact;
}
/** The kick uses the same periodic deadline as inline maintenance callers. */
function readSessionEntryMaintenanceNextAgeAt(database, maintenance) {
	if (maintenance.mode !== "enforce") return;
	const fact = readSessionEntryMaintenanceAgeFact(database.db, maintenance);
	return fact ? Math.min(fact.next.at, fact.recheckAt) : Date.now();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache-publication.ts
const preparedSharingChanges = resolveGlobalSingleton(Symbol.for("openclaw.preparedSessionSharingChanges"), () => ({
	changes: /* @__PURE__ */ new WeakMap(),
	operations: /* @__PURE__ */ new WeakMap(),
	current: new AsyncLocalStorage()
}));
/** Private owner metadata follows the original event object without changing its public fields. */
function isPreparedSessionSharingChange(change) {
	return preparedSharingChanges.changes.has(change);
}
function readPreparedSessionSharingChange(change) {
	return preparedSharingChanges.changes.get(change)?.sharingChange;
}
/** Commit metadata follows the same original row or identity event through preparation. */
function readPreparedSessionEntryChange(change, sessionKey) {
	const record = preparedSharingChanges.changes.get(change);
	if (record?.kind !== "metadata") return;
	const { prepared } = record;
	const entry = prepared.entries.get(sessionKey);
	return {
		source: prepared.source,
		entry,
		sharing: prepared.sharing?.get(sessionKey) ?? (entry ? projectSessionSharingEntry(entry) : void 0)
	};
}
function bindPreparedSessionEntryPublication(change, record) {
	preparedSharingChanges.changes.set(change, record);
}
function emitPreparedSessionSharingChange(database, sessionKey, agentId = database.agentId, facts, record = {
	kind: "marker",
	sharingChange: "changed"
}) {
	const change = {
		agentId,
		storePath: database.path,
		sessionKey,
		...facts ? {
			facts,
			scope: "session-entry"
		} : { factsInvalidated: true }
	};
	bindPreparedSessionEntryPublication(change, record);
	sessionChanges.emit(change, database.db);
}
function invalidateSessionEntryCaches(databaseIdentity) {
	invalidateOpenClawAgentWritableProjections(databaseIdentity, (database) => sessionEntryCaches.delete(database));
	invalidateOpenClawAgentReadOnlyProjections(databaseIdentity, (database) => sessionEntryCaches.delete(database));
}
/** A committed metadata-only worker write invalidates caches without changing retained identity. */
function publishSessionEntryWorkerMetadataInvalidation(params) {
	invalidateSessionEntryCaches(params.databaseIdentity);
	const change = {
		agentId: params.agentId,
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		scope: "session-entry",
		facts: { kind: "unchanged" }
	};
	bindPreparedSessionEntryPublication(change, {
		kind: "marker",
		sharingChange: "unchanged"
	});
	sessionChanges.emit(change);
}
function assertCreationCurrent(creation) {
	if (!creation?.active) throw new Error("Session creation publication owner is no longer current");
	const source = creation.source;
	if (source.kind === "file") source.assertCurrent();
	else if (!source.database.db.isOpen || source.database.agentId !== source.agentId) throw new Error("Session creation publication owner is no longer current");
}
function creationMatchesDatabase(creation, database) {
	return creation.source.kind === "native" ? creation.source.database.db === database.db : creation.source.agentId === database.agentId && findOpenClawAgentDatabaseIdentity(database)?.identity === creation.source.databaseIdentity;
}
/** Canonical creation scopes provenance only; caller and target guards still authorize each write. */
async function withSessionEntryCreationPublication(params, run) {
	const operation = createSessionEntryCreationOperation();
	const creation = {
		agentId: params.agentId,
		source: params.database ? {
			kind: "native",
			database: params.database,
			agentId: params.database.agentId
		} : {
			kind: "file",
			...params.file
		},
		sessionKey: params.sessionKey,
		active: true
	};
	preparedSharingChanges.operations.set(operation, creation);
	try {
		params.bind?.(operation);
		return await runWithSessionEntryCreationPublication(operation, () => run(operation));
	} finally {
		creation.active = false;
		preparedSharingChanges.operations.delete(operation);
	}
}
/** Reenter only this operation's provenance after another owner restores its own context. */
function runWithSessionEntryCreationPublication(operation, run) {
	const creation = preparedSharingChanges.operations.get(operation);
	assertCreationCurrent(creation);
	return preparedSharingChanges.current.run(creation, run);
}
function assertSessionEntryCreationPublication(operation, target) {
	const creation = preparedSharingChanges.operations.get(operation);
	assertCreationCurrent(creation);
	const sourcePath = creation.source.kind === "native" ? creation.source.database.path : creation.source.path;
	const matchesDatabaseIdentity = creation.source.kind === "file" && target.databaseIdentity === `file:${creation.source.databaseIdentity}`;
	const matchesTarget = target.databaseIdentity !== void 0 ? matchesDatabaseIdentity : target.paths.has(path.resolve(sourcePath));
	if (creation.agentId !== target.agentId || creation.sessionKey !== target.sessionKey || !matchesTarget) throw new Error("Session creation publication owner is no longer current");
}
function readSessionEntryCreationTransition(change, operation) {
	const record = preparedSharingChanges.changes.get(change);
	const receipt = record?.kind === "placeholder" ? record.receipt : void 0;
	const creation = preparedSharingChanges.operations.get(operation);
	if (!creation) return;
	try {
		assertCreationCurrent(creation);
	} catch {
		return;
	}
	return receipt?.committed && receipt.creation === creation && receipt.databaseIdentity === readSessionEntryCreationIdentity(creation) && receipt.sessionKey === creation.sessionKey ? receipt.placeholder : void 0;
}
/** Only the actual inserted-placeholder producer supplies these known row facts. */
function publishSessionEntryPlaceholderInsertion(database, params) {
	const { sessionKey, sessionId } = params;
	const placeholder = Object.freeze({ sessionId });
	const current = preparedSharingChanges.current.getStore();
	const creation = current?.active && creationMatchesDatabase(current, database) && current.sessionKey === sessionKey ? current : void 0;
	const receipt = {
		creation,
		databaseIdentity: creation ? readSessionEntryCreationIdentity(creation) : database.db,
		sessionKey,
		placeholder,
		committed: false
	};
	const incognito = !database.db.location();
	let staged = false;
	staged = publishTrackedCacheUpdate(database, () => {
		recordCommittedSessionEntryPublication(database, sessionKey, void 0);
		const facts = staged ? {
			entry: void 0,
			placeholder,
			membership: /* @__PURE__ */ new Set()
		} : void 0;
		for (const read of retainedSharingReads(database, sessionKey) ?? []) {
			if (read.acquisition) read.acquisition.invalidated = true;
			publishRetainedSessionGeneration(read, void 0, staged);
			read.facts = facts;
		}
		if (incognito) commitIncognitoSessionSharingFacts(database.db, sessionKey, facts ?? null);
		sessionEntryCaches.delete(database.db);
		receipt.committed = staged;
	}, () => stageSessionSharingPublication(database, sessionKey));
	emitPreparedSessionSharingChange(database, sessionKey, database.agentId, void 0, {
		kind: "placeholder",
		sharingChange: "changed",
		receipt
	});
}
function stageSessionSharingPublication(database, sessionKey) {
	const releaseIncognito = !database.db.location() ? stageIncognitoSharingPublication(database.db, sessionKey) : void 0;
	const reads = [...retainedSharingReads(database, sessionKey) ?? []];
	const token = {};
	for (const read of reads) read.pending.add(token);
	return () => {
		releaseIncognito?.();
		for (const read of reads) read.pending.delete(token);
	};
}
function publishSessionSharingFieldChange(database, sessionKey, change) {
	publishTrackedCacheUpdate(database, () => {
		if (change.kind === "owner") {
			const identity = findOpenClawAgentDatabaseIdentity(database)?.identity;
			if (typeof identity === "string") for (const pending of pendingSessionEntryPublications.get(`file:${identity}\0${sessionKey}`) ?? []) pending.ownerChanges.set(sessionKey, structuredClone(change));
		}
		for (const read of retainedSharingReads(database, sessionKey) ?? []) if (read.acquisition) {
			if (change.kind === "member") recordAcquiringSessionMember(read.acquisition, change);
			else recordAcquiringSessionEntry(read.acquisition, void 0, void 0);
		} else if (read.facts) read.facts = updateSessionSharingField(read.facts, change);
		commitIncognitoSessionSharingField(database.db, sessionKey, change);
	}, () => stageSessionSharingPublication(database, sessionKey));
}
function publishSessionSharingMemberChange(database, sessionKey, member, agentId = database.agentId) {
	publishSessionSharingFieldChange(database, sessionKey, member);
	emitPreparedSessionSharingChange(database, sessionKey, agentId, member);
}
/** Publish sharing state before the listing projection and its public change event. */
function publishSessionSharingEntryChange(database, update) {
	const facts = update.facts;
	if (facts?.kind === "owner") {
		publishSessionSharingFieldChange(database, update.sessionKey, facts);
		return;
	}
	const sharingUnchanged = facts?.kind === "unchanged" || facts?.kind === "participants" || facts?.kind === "category";
	const incognito = !database.db.location();
	const sharingEntry = update.entry ? projectSessionSharingEntry(update.entry) : void 0;
	if (sharingUnchanged) publishTrackedCacheUpdate(database, () => recordCommittedSessionMetadataPublication(database, update.sessionKey));
	const previousIdentity = update.previousEntry && {
		sessionId: update.previousEntry.sessionId,
		lifecycleRevision: update.previousEntry.lifecycleRevision
	};
	if (!sharingUnchanged) publishTrackedCacheUpdate(database, () => {
		publishRetainedSessionEntryChange(database, update.sessionKey, sharingEntry, previousIdentity, sharingEntry !== void 0 || facts?.kind === "removed");
	}, !incognito ? () => stageSessionSharingPublication(database, update.sessionKey) : void 0);
	if (incognito && !sharingUnchanged) publishIncognitoSessionEntryChange(database, update);
}
function publishRetainedSessionEntryChange(database, sessionKey, entry, previousIdentity, known) {
	recordCommittedSessionEntryPublication(database, sessionKey, entry);
	for (const read of retainedSharingReads(database, sessionKey) ?? []) {
		recordAcquiringSessionEntry(read.acquisition, entry, previousIdentity);
		publishRetainedSessionGeneration(read, entry, known);
		const previous = read.facts;
		read.facts = entry && previous?.entry && previous.entry.sessionId === entry.sessionId && previous.entry.lifecycleRevision === entry.lifecycleRevision ? {
			entry,
			membership: previous.membership
		} : void 0;
	}
}
/** A confirmed worker result invalidates row facts without opening a parent connection. */
function publishSessionEntryWorkerInvalidations(params, changedKeys, beforePublicNotifications) {
	const keys = [...new Set(changedKeys)];
	const changes = [];
	for (const sessionKey of keys) {
		publishRetainedSessionEntryChange(params.databaseIdentity, sessionKey, void 0, void 0, params.removedSessionKeys?.has(sessionKey) === true);
		const change = {
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey,
			factsInvalidated: true
		};
		bindPreparedSessionEntryPublication(change, {
			kind: "marker",
			sharingChange: "changed"
		});
		changes.push(change);
	}
	if (keys.length > 0) invalidateSessionEntryCaches(params.databaseIdentity);
	sessionChanges.emitBatch(changes, void 0, beforePublicNotifications);
}
/** Final-grant custody fences old facts until native settlement, independently of result delivery. */
function retainSessionEntryWorkerPublication(params) {
	const creation = preparedSharingChanges.current.getStore();
	const completion = createDeferredCore();
	const owner = {
		superseded: /* @__PURE__ */ new Map(),
		metadataSuperseded: /* @__PURE__ */ new Set(),
		ownerChanges: /* @__PURE__ */ new Map(),
		membershipInvalidated: /* @__PURE__ */ new Set(),
		sharingUnchanged: /* @__PURE__ */ new Set(),
		settled: false,
		completion: completion.promise
	};
	let keys = [];
	const identityKey = `file:${params.databaseIdentity}`;
	let pending = false;
	return {
		begin(sessionKeys, membershipInvalidatedKeys, sharingUnchangedKeys = []) {
			if (pending) return;
			keys = [...new Set(sessionKeys)];
			owner.membershipInvalidated = new Set(membershipInvalidatedKeys);
			owner.sharingUnchanged = new Set(sharingUnchangedKeys);
			pending = true;
			for (const sessionKey of keys) {
				const key = `${identityKey}\0${sessionKey}`;
				const owners = pendingSessionEntryPublications.get(key) ?? /* @__PURE__ */ new Set();
				owners.add(owner);
				pendingSessionEntryPublications.set(key, owners);
			}
		},
		settle(receipt, unknown) {
			if (!pending) return;
			let replacement = receipt?.kind === "session-entry-replacements" ? receipt : void 0;
			if (replacement && owner.ownerChanges.size > 0) {
				const current = new Map(replacement.current);
				for (const [sessionKey, change] of owner.ownerChanges) {
					const entry = current.get(sessionKey);
					if (!entry || entry.sessionId !== change.sessionId || (entry.lifecycleRevision ?? null) !== change.lifecycleRevision) continue;
					const { owner: _previousOwner, ...metadata } = entry;
					current.set(sessionKey, freezeJsonSnapshot({
						...metadata,
						...change.owner ? { owner: change.owner } : {}
					}));
				}
				replacement = {
					...replacement,
					current
				};
			}
			const initialization = receipt?.kind === "session-transcript-initialized" ? receipt : void 0;
			const current = (sessionKey) => !owner.superseded.has(sessionKey);
			const currentIdentity = (sessionKey) => {
				if (current(sessionKey)) return true;
				const native = owner.superseded.get(sessionKey);
				const committed = replacement?.current.get(sessionKey);
				return native !== void 0 && committed !== void 0 && native.sessionId === committed.sessionId && native.lifecycleRevision === committed.lifecycleRevision;
			};
			const membershipInvalidated = new Set(replacement ? replacement.membershipInvalidatedKeys.filter(currentIdentity) : unknown ? owner.membershipInvalidated : []);
			const changed = [.../* @__PURE__ */ new Set([...(replacement?.changedKeys ?? (initialization?.placeholder ? [initialization.sessionKey] : unknown ? keys : [])).filter(current), ...membershipInvalidated])];
			if (changed.length) invalidateSessionEntryCaches(params.databaseIdentity);
			const changes = [];
			const sharingUnchanged = new Set(replacement?.sharingUnchangedKeys);
			const prepared = replacement?.source?.identity === params.databaseIdentity ? {
				source: replacement.source,
				entries: new Map([...replacement.current].filter(([key]) => current(key) && !owner.metadataSuperseded.has(key)).map(([key, entry]) => [key, freezeJsonSnapshot(entry)])),
				sharing: new Map([...replacement.current].filter(([key]) => current(key)).map(([key, entry]) => [key, projectSessionSharingEntry(entry)]))
			} : void 0;
			for (const sessionKey of changed) {
				const entry = replacement?.current.get(sessionKey);
				const sharingEntry = entry ? projectSessionSharingEntry(entry) : void 0;
				const placeholder = initialization?.sessionKey === sessionKey ? initialization.placeholder : void 0;
				const creationSource = creation?.source;
				const ownsCreation = creation?.active && creationSource?.kind === "file" && creationSource.databaseIdentity === params.databaseIdentity && creationSource.agentId === params.agentId && creation.sessionKey === sessionKey;
				for (const read of preparedSharingReads.get(`${identityKey}\0${sessionKey}`) ?? []) {
					recordAcquiringSessionEntry(read.acquisition, !unknown && !membershipInvalidated.has(sessionKey) ? sharingEntry : void 0, replacement?.previous.get(sessionKey));
					publishRetainedSessionGeneration(read, sharingEntry, replacement !== void 0 || placeholder !== void 0);
					const previous = read.facts;
					read.facts = placeholder ? {
						entry: void 0,
						placeholder,
						membership: /* @__PURE__ */ new Set()
					} : !membershipInvalidated.has(sessionKey) && sharingEntry && previous?.entry && previous.entry.sessionId === sharingEntry.sessionId && previous.entry.lifecycleRevision === sharingEntry.lifecycleRevision ? {
						entry: sharingEntry,
						membership: previous.membership
					} : void 0;
				}
				const change = {
					agentId: params.agentId,
					storePath: ownsCreation ? creationSource.path : params.storePath,
					sessionKey,
					...replacement?.previous.has(sessionKey) && !replacement.current.has(sessionKey) ? { facts: { kind: "removed" } } : { factsInvalidated: true },
					...receipt && !unknown ? { scope: "session-entry" } : {}
				};
				if (receipt) {
					const sharingChange = !membershipInvalidated.has(sessionKey) && sharingUnchanged.has(sessionKey) ? "unchanged" : "changed";
					bindPreparedSessionEntryPublication(change, !unknown && placeholder && ownsCreation ? {
						kind: "placeholder",
						sharingChange: "changed",
						receipt: {
							creation,
							databaseIdentity: params.databaseIdentity,
							sessionKey,
							placeholder,
							committed: true
						}
					} : prepared && (replacement?.previous.has(sessionKey) || replacement?.current.has(sessionKey)) ? {
						kind: "metadata",
						sharingChange,
						prepared
					} : {
						kind: "marker",
						sharingChange
					});
				}
				changes.push(change);
			}
			owner.settled = true;
			try {
				if (replacement) publishSessionEntryMaintenanceAgeChanges(params.databaseIdentity, replacement.ageChanges.filter(({ sessionKey }) => current(sessionKey) && !owner.metadataSuperseded.has(sessionKey)));
				sessionChanges.emitBatch(changes);
				return replacement ? {
					previous: new Map([...replacement.previous].filter(([key]) => currentIdentity(key))),
					current: new Map([...replacement.current].filter(([key]) => currentIdentity(key))),
					prepared
				} : void 0;
			} finally {
				for (const sessionKey of keys) {
					const key = `${identityKey}\0${sessionKey}`;
					const owners = pendingSessionEntryPublications.get(key);
					owners?.delete(owner);
					if (owners?.size === 0) pendingSessionEntryPublications.delete(key);
				}
				pending = false;
				completion.resolve();
			}
		}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-cache.ts
/** Commit-driven projections borrow owner memory; ordinary reads still validate SQLite. */
function readCommittedSessionEntryCache(database) {
	return sessionEntryCaches.get(database)?.entries;
}
/** A settled worker with an unknown write outcome cannot publish a trustworthy field patch. */
function discardCommittedSessionEntryCache(database) {
	sessionEntryCaches.delete(database);
}
/** Reuse only complete, current metadata; exact reads still own misses and invalid rows. */
function readCachedExactSessionEntries(database, sessionKeys, clone) {
	const cached = sessionEntryCaches.get(database.db);
	if (!cached || database.db.isTransaction) return;
	const keys = [...new Set(sessionKeys.map(toUSVString))];
	if (keys.some((key) => !cached.entries.has(key))) return;
	const validityToken = cached.validityToken;
	try {
		if (!cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db))) return;
		const rows = executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("session_nodes").select([
			"session_key",
			"current_session_id",
			"updated_at"
		]).where("session_key", "in", sqliteStringSet(keys))).rows;
		if (rows.length !== keys.length) return;
		const rowsByKey = new Map(rows.map((row) => [row.session_key, row]));
		const entries = /* @__PURE__ */ new Map();
		for (const sessionKey of new Set(sessionKeys)) {
			const key = toUSVString(sessionKey);
			const row = rowsByKey.get(key);
			const entry = cached.entries.get(key);
			if (!row || !entry || entry.sessionId !== row.current_session_id || entry.updatedAt !== row.updated_at) return;
			entries.set(sessionKey, validateDeliveryCanonicalSessionEntry(key, clone ? structuredClone(entry) : entry));
		}
		return sessionEntryCaches.get(database.db) === cached && cacheValidityTokensEqual(validityToken, readSessionEntryCacheValidityToken(database.db)) ? entries : void 0;
	} catch {
		sessionEntryCaches.delete(database.db);
		return;
	}
}
/** Decode one admitted physical store without changing exact per-request error isolation. */
function readExactSessionEntryCandidatesInDatabase(database, requests, projection, options = {}) {
	const entries = /* @__PURE__ */ new Map();
	const keys = [...new Set(requests.flat())];
	const cachedEntries = projection === "list" ? readCachedExactSessionEntries(database, keys, options.clone !== false) : void 0;
	let readPrepared;
	if (cachedEntries) readPrepared = (sessionKey) => cachedEntries.get(sessionKey);
	else {
		const readRows = prepareExactSessionEntryRowReads(database, keys, projection);
		readPrepared = (sessionKey) => readRows(sessionKey)?.entry;
	}
	const readEntry = (sessionKey) => {
		const cached = entries.get(sessionKey);
		if (cached) return cached;
		let result;
		try {
			const entry = readOpenClawAgentDatabase(database, () => readPrepared(sessionKey)).value;
			result = ok(entry ? {
				sessionKey,
				entry
			} : void 0);
		} catch (error) {
			result = err(error);
		}
		entries.set(sessionKey, result);
		return result;
	};
	return requests.map((sessionKeys) => {
		const matches = [];
		for (const sessionKey of sessionKeys) {
			const entry = readEntry(sessionKey);
			if (!entry.ok) return err(entry.error);
			if (entry.value) matches.push(entry.value);
		}
		return ok(matches);
	});
}
/** Bracket one accessor-owned row write so its publication cannot hide earlier raw DML. */
function trackSessionEntryCacheWrite(database, write) {
	const before = sessionEntryCaches.has(database.db) && getAdmittedSqliteSchemaFacts(database.db) ? readSessionNodesGeneration(database.db) : void 0;
	write();
	if (before === void 0 || !getAdmittedSqliteSchemaFacts(database.db)) {
		sessionEntryCaches.delete(database.db);
		return;
	}
	return {
		before,
		after: readSessionNodesGeneration(database.db)
	};
}
function readSessionEntryCache(database, options) {
	return runSqliteReadOperationSync(database.db, () => {
		const projection = options.projection;
		const prepared = assertCanonicalSqliteSessionKeysCurrent(database, projection !== "full");
		if (!options.cache || options.deferParticipants || options.latest || projection === "full" || database.db.isTransaction || !getAdmittedSqliteSchemaFacts(database.db)) return loadSessionEntrySnapshot(database, projection, prepared, options.deferParticipants);
		const validityToken = readSessionEntryCacheValidityToken(database.db, "cached");
		const cached = sessionEntryCaches.get(database.db);
		if (cached && cacheValidityTokensEqual(cached.validityToken, validityToken)) return cached;
		const loaded = loadSessionEntrySnapshot(database, options.projection, prepared);
		for (const entry of loaded.entries.values()) freezeJsonSnapshot(entry);
		const next = {
			...loaded,
			validityToken
		};
		sessionEntryCaches.set(database.db, next);
		return next;
	});
}
function advanceSessionEntryCacheGeneration(cached, writeGeneration) {
	if (cached.validityToken.sessionNodesGeneration === writeGeneration.before) cached.validityToken = {
		...cached.validityToken,
		sessionNodesGeneration: writeGeneration.after
	};
}
function publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration) {
	const owner = sessionEntryCaches.get(database.db);
	if (!owner) return;
	const { sessionKey } = update;
	let sideMetadata;
	let entry;
	try {
		const retained = update.entry && owner.validityToken.sessionNodesGeneration === writeGeneration.before && owner.validityToken.dataVersion === readSqliteDataVersion(database.db) ? owner.entries.get(sessionKey) : void 0;
		sideMetadata = readSessionEntrySideMetadata(database, sessionKey, retained ? {
			participants: retained.participants,
			participantCount: retained.participantCount
		} : void 0);
		entry = update.entry ? projectSessionEntryCacheUpdate(update.entryJson, sideMetadata) : void 0;
	} catch {
		publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
		return;
	}
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		if (!cached) return;
		let publishedEntry = entry;
		const currentEntry = cached.entries.get(sessionKey);
		if (!update.entry && currentEntry && sideMetadata) {
			const { owner: _owner, participants: _participants, participantCount: _count, ...metadata } = currentEntry;
			publishedEntry = freezeJsonSnapshot({
				...metadata,
				...sideMetadata
			});
		}
		if (!publishedEntry) {
			sessionEntryCaches.delete(database.db);
			return;
		}
		if (!cached.entries.has(sessionKey) && !cached.keys.includes(sessionKey)) cached.keys = [...cached.keys, sessionKey].toSorted();
		cached.entries.set(sessionKey, publishedEntry);
		advanceSessionEntryCacheGeneration(cached, writeGeneration);
	});
	return {
		sideMetadata,
		entry
	};
}
function publishSessionEntryCacheInvalidation(database, update, writeGeneration) {
	let facts = update.facts;
	const cached = writeGeneration ? publishSqliteSessionEntryCacheUpsert(database, update, writeGeneration) : void 0;
	if (!writeGeneration) publishTrackedCacheUpdate(database, () => sessionEntryCaches.delete(database.db));
	if (facts?.kind === "participants" && cached) facts = {
		kind: "participants",
		projection: {
			participants: cached.sideMetadata.participants,
			participantCount: cached.sideMetadata.participantCount
		}
	};
	const entry = update.entry ? cached?.entry ?? projectSessionEntryCacheUpdate(update.entryJson, update.sideMetadata) : void 0;
	publishSessionSharingEntryChange(database, entry ? {
		...update,
		entry
	} : update);
	const identity = findOpenClawAgentDatabaseIdentity(database);
	const sharingChange = update.sharingUnchanged || facts?.kind === "unchanged" || facts?.kind === "participants" || facts?.kind === "category" ? "unchanged" : "changed";
	emitPreparedSessionSharingChange(database, update.sessionKey, database.agentId, facts, identity && entry ? {
		kind: "metadata",
		sharingChange,
		prepared: {
			source: {
				...identity,
				...writeGeneration ? { revision: writeGeneration.after } : {}
			},
			entries: /* @__PURE__ */ new Map([[update.sessionKey, entry]])
		}
	} : {
		kind: "marker",
		sharingChange
	});
}
/** The category worker publishes only its changed field; native freshness tokens still expose other commits. */
function publishSessionEntryCacheCategoryUpdate(database, rows, category) {
	publishTrackedCacheUpdate(database, () => {
		const cached = sessionEntryCaches.get(database.db);
		for (const { sessionKey, sessionId } of rows) {
			recordCommittedSessionMetadataPublication(database, sessionKey);
			const current = cached?.entries.get(sessionKey);
			if (!current || current.sessionId !== sessionId) continue;
			const next = { ...current };
			if (category === void 0) delete next.category;
			else next.category = category;
			cached?.entries.set(sessionKey, freezeJsonSnapshot(next));
		}
	});
}
/** Refresh participant projections without reloading unchanged session-entry JSON. */
function publishSessionEntryCacheParticipantUpdate(database, sessionKey, params) {
	const { writeGeneration, projectionChanged } = params;
	if (!projectionChanged) {
		if (writeGeneration) publishTrackedCacheUpdate(database, () => {
			const cached = sessionEntryCaches.get(database.db);
			if (cached) advanceSessionEntryCacheGeneration(cached, writeGeneration);
		});
		return;
	}
	let facts = { kind: "participants" };
	if (!writeGeneration) try {
		facts = {
			kind: "participants",
			projection: readSqliteSessionParticipantProjection(database.db, sessionKey)
		};
	} catch {}
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts
	}, writeGeneration);
}
//#endregion
export { readSessionEntryMaintenanceNextAgeAt as A, advanceSessionEntryMaintenanceAgeFact as C, invalidateSessionEntryMaintenanceAgeFact as D, captureSessionEntryMaintenanceAgeFact as E, projectSessionSharingEntry as F, sessionSharingEntriesEqual as I, retainPreparedSessionGenerationFacts as L, stageSessionEntryMaintenanceAgeFact as M, readCommittedIncognitoSessionSharing as N, observeSessionEntryMaintenanceAgeChanges as O, readIncognitoSessionEntryCurrent as P, retainPreparedSessionSharingFacts as R, SESSION_ENTRY_MAINTENANCE_INTERVAL_MS as S, captureSessionEntryMaintenanceAgeChange as T, readPreparedSessionSharingChange as _, readCommittedSessionEntryCache as a, runWithSessionEntryCreationPublication as b, trackSessionEntryCacheWrite as c, isPreparedSessionSharingChange as d, publishSessionEntryPlaceholderInsertion as f, readPreparedSessionEntryChange as g, publishSessionSharingMemberChange as h, publishSessionEntryCacheParticipantUpdate as i, recordSessionEntryMaintenanceAgeFact as j, readSessionEntryMaintenanceAgeFact as k, assertSessionEntryCreationPublication as l, publishSessionEntryWorkerMetadataInvalidation as m, publishSessionEntryCacheCategoryUpdate as n, readExactSessionEntryCandidatesInDatabase as o, publishSessionEntryWorkerInvalidations as p, publishSessionEntryCacheInvalidation as r, readSessionEntryCache as s, discardCommittedSessionEntryCache as t, bindPreparedSessionEntryPublication as u, readSessionEntryCreationTransition as v, applySessionEntryMaintenanceAgeChange as w, withSessionEntryCreationPublication as x, retainSessionEntryWorkerPublication as y };

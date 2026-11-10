import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { s as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { c as prepareSqliteQueryIterator, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as invalidateSessionEntryCaches, n as bindPreparedSessionEntryPublication, p as communicationEntryBinding } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { A as projectSessionSharingEntry, C as publishRetainedSessionGeneration, E as revokePreparedSessionEntryPredicate, S as publishRetainedSessionEntryPredicate, a as preparedSharingChanges, c as readCurrentSessionEntryProjection, h as recordCommittedSessionMetadataPublication, i as prepareSessionEntryPublicationFacts, m as recordCommittedSessionEntryPublication, n as markSessionSharingAuthorityUnknown, o as preparedSharingReads, r as pendingSessionEntryPublications, s as publishRetainedSessionEntryChange, w as recordAcquiringSessionEntry } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { u as shouldPreserveMaintenanceEntry } from "./store-maintenance-BqMt1Twc.mjs";
import { t as getSessionMaintenanceActivityAt } from "./store-maintenance-activity-ayV6kicm.mjs";
import { s as hasCanonicalSessionValidationProjection } from "./session-canonical-key-B7chVWi3.mjs";
import { l as retainSessionTranscriptWorkerPublication } from "./session-transcript-authority-Bd3kv5VJ.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-receipt.ts
/** The typed worker owns receipt shape; installation checks only its physical target and keys. */
function isSessionEntryReplacementReceiptUsable(publication, keys, databaseIdentity) {
	const affected = new Set(publication.changedKeys);
	return (!publication.source || publication.source.identity === databaseIdentity) && affected.size === keys.length && keys.every((key) => affected.has(key));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-age-queries.ts
const readSessionMaintenanceAgeQueries = createSqliteQueryCache((database) => {
	const db = getNodeSqliteKysely(database);
	const projection = db.selectFrom("session_nodes").select([
		"session_key",
		"updated_at",
		"archived_at",
		"last_activity_at",
		"last_interaction_at",
		"session_started_at"
	]);
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
});
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-age.ts
const changeObservers = /* @__PURE__ */ new Map();
function captureSessionEntryMaintenanceAgeChange(change) {
	const pick = (entry) => {
		const { updatedAt, lastActivityAt, lastInteractionAt, sessionStartedAt, archivedAt, sessionId, parentSessionKey } = entry;
		return {
			updatedAt,
			lastActivityAt,
			lastInteractionAt,
			sessionStartedAt,
			archivedAt,
			sessionId,
			parentSessionKey,
			preserved: shouldPreserveMaintenanceEntry({
				key: change.sessionKey,
				entry,
				preserveRecentMs: null
			})
		};
	};
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
	if (stageSqliteTransactionState(sqlPublicationAnchor(db), {
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
			if (!deferSqlitePostCommitPublication(sqlPublicationAnchor(db), publish) && !db.isTransaction) publish();
		}
	}
	applySessionEntryMaintenanceAgeChange(db, update);
}
function applySessionEntryMaintenanceAgeChange(db, update) {
	const fact = updateSessionEntryMaintenanceAgeFact(ageFacts.get(db)?.fact, update);
	stageSessionEntryMaintenanceAgeFact(db, fact && {
		...fact,
		entryCount: void 0
	});
}
/** The scheduling replica consumes the same acknowledged entry changes as the worker. */
function updateSessionEntryMaintenanceAgeFact(fact, update) {
	if (!fact) return;
	if (update.entry.archivedAt !== void 0) return {
		...fact,
		entryCount: fact.entryCount === void 0 || !update.previousEntry ? void 0 : fact.entryCount - (update.previousEntry.archivedAt === void 0 ? 1 : 0)
	};
	const { entry, previousEntry } = update;
	if (previousEntry && (!isMonotoneSessionEntryMaintenanceAgeChange(update) || previousEntry.sessionId !== entry.sessionId || previousEntry.parentSessionKey !== entry.parentSessionKey || (previousEntry.preserved ?? shouldPreserveMaintenanceEntry({
		key: update.sessionKey,
		entry: previousEntry,
		preserveRecentMs: null
	})) && !(entry.preserved ?? shouldPreserveMaintenanceEntry({
		key: update.sessionKey,
		entry,
		preserveRecentMs: null
	})))) return;
	const at = nextEntryAgeAt(update.sessionKey, entry, fact.maintenance, previousEntry ? Date.now() : -Infinity);
	return {
		...fact,
		entryCount: fact.entryCount === void 0 ? void 0 : fact.entryCount + (previousEntry ? 0 : 1),
		next: { at: Math.min(at, fact.next.at) }
	};
}
function isMonotoneSessionEntryMaintenanceAgeChange({ entry, previousEntry }) {
	return previousEntry !== void 0 && previousEntry.archivedAt === void 0 && entry.archivedAt === void 0 && entry.updatedAt >= previousEntry.updatedAt && getSessionMaintenanceActivityAt(entry) >= getSessionMaintenanceActivityAt(previousEntry);
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
function recordSessionEntryMaintenanceAgeFact(database, maintenance, plannedAt, entryCount) {
	const next = { at: Infinity };
	const fact = {
		maintenance,
		entryCount,
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
function capturePendingSessionMaintenanceAgeChanges(pending) {
	const changes = [...pending.values()];
	return {
		changes,
		isCurrent() {
			return pending.size === changes.length && changes.every((change) => pending.get(change.sessionKey) === change);
		},
		acknowledge() {
			for (const change of changes) if (pending.get(change.sessionKey) === change) pending.delete(change.sessionKey);
		}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-worker-publication.ts
/** Publish confirmed removals or invalidate incomplete row facts without a parent connection. */
function publishSessionEntryWorkerInvalidations(params, changedKeys, beforePublicNotifications) {
	const keys = [...new Set(changedKeys)];
	const changes = [];
	for (const sessionKey of keys) {
		const removed = params.removedSessionKeys?.has(sessionKey) === true;
		publishRetainedSessionEntryChange(params.databaseIdentity, sessionKey, void 0, void 0, removed);
		const change = {
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey,
			...removed ? { facts: { kind: "removed" } } : { factsInvalidated: true }
		};
		bindPreparedSessionEntryPublication(change, {
			kind: "marker",
			sharingChange: "changed",
			databaseIdentity: params.databaseIdentity
		});
		changes.push(change);
	}
	if (keys.length > 0) invalidateSessionEntryCaches(params.databaseIdentity);
	sessionChanges.emitBatch(changes, void 0, beforePublicNotifications);
}
/** Later metadata commits cannot certify membership or a generation changed by an older write. */
function retireSupersededSessionFacts(params, owner, generationUnchanged, supersededKeys = owner.superseded) {
	return [...supersededKeys].flatMap((sessionKey) => {
		const membershipChanged = owner.membershipInvalidated.has(sessionKey);
		const generationChanged = !generationUnchanged.has(sessionKey);
		for (const read of preparedSharingReads.get(`file:${params.databaseIdentity}\0${sessionKey}`) ?? []) {
			if (membershipChanged) {
				read.facts = void 0;
				recordAcquiringSessionEntry(read.acquisition, void 0, void 0);
			}
			if (generationChanged) publishRetainedSessionGeneration(read, void 0, false);
		}
		const change = {
			agentId: params.agentId,
			storePath: params.storePath,
			sessionKey,
			scope: "session-entry",
			factsInvalidated: true
		};
		bindPreparedSessionEntryPublication(change, {
			kind: "marker",
			sharingChange: "unchanged",
			databaseIdentity: params.databaseIdentity
		});
		return [change];
	});
}
/** Final-grant custody fences old facts until native settlement, independently of result delivery. */
function retainSessionEntryWorkerPublication(params) {
	const creation = preparedSharingChanges.current.getStore();
	const transcript = retainSessionTranscriptWorkerPublication(params);
	const completion = createDeferredCore();
	const owner = {
		superseded: /* @__PURE__ */ new Set(),
		membershipInvalidated: /* @__PURE__ */ new Set(),
		sharingUnchanged: /* @__PURE__ */ new Set(),
		generationUnchanged: /* @__PURE__ */ new Set(),
		settled: false,
		completion: completion.promise
	};
	let keys = [];
	const identityKey = `file:${params.databaseIdentity}`;
	let pending = false;
	let sharingAuthorityChanged = true;
	const publication = {
		begin(sessionKeys, membershipInvalidatedKeys, sharingUnchangedKeys = [], generationUnchangedKeys = [], transcriptPublication, entryPostimages) {
			if (pending) return;
			keys = [...new Set(sessionKeys)];
			transcript.begin(transcriptPublication);
			owner.membershipInvalidated = new Set(membershipInvalidatedKeys);
			owner.sharingUnchanged = new Set(sharingUnchangedKeys);
			owner.generationUnchanged = new Set(generationUnchangedKeys);
			owner.entryPostimages = entryPostimages;
			pending = true;
			for (const sessionKey of keys) {
				const key = `${identityKey}\0${sessionKey}`;
				const owners = pendingSessionEntryPublications.get(key) ?? /* @__PURE__ */ new Set();
				owners.add(owner);
				pendingSessionEntryPublications.set(key, owners);
			}
		},
		/** Delta writers share the entry owner's pending custody and supersession. */
		beginChanges(sessionKeys, memberships = /* @__PURE__ */ new Map(), generationUnchangedKeys = sessionKeys, participantProjections, entryPostimages, authorityChanged = true) {
			if (pending) return;
			owner.participantProjections = participantProjections;
			sharingAuthorityChanged = authorityChanged;
			publication.begin(sessionKeys, [...memberships.keys()], [...participantProjections?.keys() ?? []], generationUnchangedKeys, void 0, entryPostimages);
		},
		settleChanges(changes, install) {
			const current = new Set(changes.flatMap((change) => "sessionKey" in change && !owner.superseded.has(change.sessionKey) ? [change.sessionKey] : []));
			return install(current, retireSupersededSessionFacts(params, owner, owner.generationUnchanged), () => {
				for (const sessionKey of current) owner.superseded.delete(sessionKey);
				publication.settle(void 0, false);
			});
		},
		/** Metadata workers replay the same entry delta that the native producer committed. */
		settleMetadata(receipts, transcriptChanges, publishIdentity) {
			const records = receipts.flatMap((receipt) => [...receipt.facts].flatMap(([sessionKey, fact]) => fact.kind === "postimage" ? [{
				receipt,
				sessionKey,
				value: fact.value
			}] : []));
			const changes = records.map(({ sessionKey, value }) => ({
				agentId: params.agentId,
				storePath: params.storePath,
				sessionKey,
				scope: "session-entry",
				facts: value.facts
			}));
			publication.settleChanges(changes, (currentKeys, invalidations, release) => {
				const selected = [];
				for (const [index, record] of records.entries()) {
					if (record.receipt.source.identity !== params.databaseIdentity) continue;
					if (!currentKeys.has(record.sessionKey)) {
						for (const read of preparedSharingReads.get(`${identityKey}\0${record.sessionKey}`) ?? []) publishRetainedSessionEntryPredicate(read, record.value.entry, true, { preserveMatchingEntry: true });
						continue;
					}
					const entry = record.value.entry;
					const facts = {
						...record.value.facts,
						category: entry.category?.trim() || null
					};
					const { sharingChange } = record.value;
					if (sharingChange === "unchanged") recordCommittedSessionMetadataPublication(params.databaseIdentity, record.sessionKey, facts, entry);
					else publishRetainedSessionEntryChange(params.databaseIdentity, record.sessionKey, projectSessionSharingEntry(entry), facts.previousSessionId && !facts.lifecycleChanged ? {
						sessionId: facts.previousSessionId,
						lifecycleRevision: entry.lifecycleRevision
					} : void 0, true, entry);
					const change = {
						...changes[index],
						facts
					};
					bindPreparedSessionEntryPublication(change, {
						kind: "metadata",
						sharingChange,
						prepared: {
							source: record.receipt.source,
							entries: /* @__PURE__ */ new Map([[record.sessionKey, entry]]),
							...record.value.fullEntry ? { fullEntries: /* @__PURE__ */ new Map([[record.sessionKey, record.value.fullEntry]]) } : {}
						}
					});
					selected.push(change);
				}
				if (selected.length) invalidateSessionEntryCaches(params.databaseIdentity);
				const identityRecords = records.filter(({ receipt, sessionKey }) => receipt.source.identity === params.databaseIdentity && currentKeys.has(sessionKey));
				release();
				publishSessionEntryMaintenanceAgeChanges(params.databaseIdentity, identityRecords.flatMap(({ sessionKey, value }) => value.previous ? [] : [captureSessionEntryMaintenanceAgeChange({
					sessionKey,
					entry: value.entry
				})]));
				sessionChanges.emitBatch([
					...selected,
					...invalidations,
					...transcriptChanges
				], void 0, identityRecords.length ? () => {
					publishIdentity(new Map(identityRecords.flatMap(({ sessionKey, value }) => value.previous ? [[sessionKey, value.previous]] : [])), new Map(identityRecords.map(({ sessionKey, value }) => [sessionKey, value.entry])));
				} : void 0);
			});
		},
		settle(receipt, outcomeUnknown, transcriptChanges = []) {
			if (!pending) {
				sessionChanges.emitBatch([...transcriptChanges, ...transcript.settle(Boolean(receipt), outcomeUnknown, receipt?.transcriptPublication)]);
				return;
			}
			let unknown = outcomeUnknown;
			let replacement = receipt?.kind === "session-entry-replacements" ? receipt : void 0;
			if (replacement && !isSessionEntryReplacementReceiptUsable(replacement, keys, params.databaseIdentity)) {
				replacement = void 0;
				unknown = true;
			} else if (replacement) unknown = false;
			if (unknown && sharingAuthorityChanged) for (const sessionKey of keys) markSessionSharingAuthorityUnknown(params.databaseIdentity, sessionKey);
			const committedTranscriptChanges = [...transcriptChanges, ...transcript.settle(Boolean(receipt), unknown, receipt?.transcriptPublication)];
			const initialization = receipt?.kind === "session-transcript-initialized" ? receipt : void 0;
			const current = (sessionKey) => !owner.superseded.has(sessionKey);
			const known = !unknown && replacement !== void 0;
			if (known || unknown) for (const sessionKey of owner.superseded) for (const read of preparedSharingReads.get(`${identityKey}\0${sessionKey}`) ?? []) publishRetainedSessionEntryPredicate(read, replacement?.current.get(sessionKey), known, { preserveMatchingEntry: true });
			const membershipInvalidated = new Set(replacement ? replacement.membershipInvalidatedKeys.filter(current) : unknown ? owner.membershipInvalidated : []);
			const changed = [.../* @__PURE__ */ new Set([...(replacement?.changedKeys ?? (initialization?.placeholder ? [initialization.sessionKey] : unknown ? keys : [])).filter(current), ...membershipInvalidated])];
			const generationUnchanged = new Set(replacement?.generationUnchangedKeys ?? owner.generationUnchanged);
			const superseded = retireSupersededSessionFacts(params, owner, generationUnchanged, [...owner.superseded].filter((sessionKey) => !changed.includes(sessionKey)));
			if (changed.length || superseded.length) invalidateSessionEntryCaches(params.databaseIdentity);
			const changes = [];
			const sharingUnchanged = new Set(replacement?.sharingUnchangedKeys);
			const { prepared, currentMetadata, readCurrent } = prepareSessionEntryPublicationFacts({
				replacement,
				owner,
				databaseIdentity: params.databaseIdentity,
				unknown
			});
			for (const sessionKey of changed) {
				const entry = replacement?.current.get(sessionKey);
				const sharingProjection = prepared && readCurrentSessionEntryProjection(owner, replacement, sessionKey);
				const sharingEntry = entry ? projectSessionSharingEntry(entry) : void 0;
				const placeholder = initialization?.sessionKey === sessionKey ? initialization.placeholder : void 0;
				const creationSource = creation?.source;
				const ownsCreation = creation?.active && creationSource?.kind === "file" && creationSource.databaseIdentity === params.databaseIdentity && creationSource.agentId === params.agentId && creation.sessionKey === sessionKey;
				for (const read of preparedSharingReads.get(`${identityKey}\0${sessionKey}`) ?? []) {
					if (placeholder) revokePreparedSessionEntryPredicate(read);
					else if (current(sessionKey)) publishRetainedSessionEntryPredicate(read, entry, known && !replacement?.unavailableParticipantKeys?.includes(sessionKey));
					recordAcquiringSessionEntry(read.acquisition, sharingProjection ? sharingEntry : void 0, replacement?.previous.get(sessionKey));
					publishRetainedSessionGeneration(read, sharingEntry, known || !unknown && placeholder !== void 0);
					const previous = read.facts;
					read.facts = !unknown && placeholder ? {
						entry: void 0,
						placeholder,
						membership: /* @__PURE__ */ new Set()
					} : !unknown && sharingProjection && sharingEntry && previous?.entry && previous.entry.sessionId === sharingEntry.sessionId && previous.entry.lifecycleRevision === sharingEntry.lifecycleRevision ? {
						entry: sharingEntry,
						membership: new Set(sharingProjection.membership[2])
					} : void 0;
				}
				const currentFacts = () => {
					if (!known || !currentMetadata(sessionKey)) return;
					if (replacement?.previous.has(sessionKey) && !replacement.current.has(sessionKey)) return { kind: "removed" };
					const currentEntry = readCurrent(sessionKey);
					return currentEntry?.projection ? {
						kind: "replacement",
						membership: currentEntry.projection.membership,
						communicationBinding: communicationEntryBinding(currentEntry.entry),
						lifecycleChanged: !generationUnchanged.has(sessionKey)
					} : void 0;
				};
				const change = {
					agentId: params.agentId,
					storePath: ownsCreation ? creationSource.path : params.storePath,
					sessionKey,
					get facts() {
						return currentFacts();
					},
					get factsInvalidated() {
						return currentFacts() ? void 0 : true;
					},
					...receipt && !unknown ? { scope: "session-entry" } : {}
				};
				if (receipt) {
					const sharingChange = !membershipInvalidated.has(sessionKey) && sharingUnchanged.has(sessionKey) ? "unchanged" : "changed";
					bindPreparedSessionEntryPublication(change, !unknown && placeholder && ownsCreation ? {
						kind: "placeholder",
						sharingChange: "changed",
						databaseIdentity: params.databaseIdentity,
						receipt: {
							kind: "placeholder",
							creation,
							databaseIdentity: params.databaseIdentity,
							sessionKey,
							placeholder,
							committed: true
						}
					} : prepared && (replacement?.previous.has(sessionKey) || replacement?.current.has(sessionKey)) ? {
						kind: "metadata",
						sharingChange,
						prepared,
						readCurrent,
						...known && ownsCreation && current(sessionKey) && sharingEntry && !replacement?.previous.has(sessionKey) ? { creation: {
							kind: "entry",
							creation,
							databaseIdentity: params.databaseIdentity,
							sessionKey,
							entry: sharingEntry,
							committed: true
						} } : {}
					} : {
						kind: "marker",
						sharingChange,
						databaseIdentity: params.databaseIdentity
					});
				} else bindPreparedSessionEntryPublication(change, {
					kind: "source",
					databaseIdentity: params.databaseIdentity
				});
				changes.push(change);
			}
			changes.push(...superseded);
			for (const sessionKey of changed) recordCommittedSessionEntryPublication(params.databaseIdentity, sessionKey, owner);
			owner.settled = true;
			try {
				if (replacement) publishSessionEntryMaintenanceAgeChanges(params.databaseIdentity, replacement.ageChanges.filter(({ sessionKey }) => known && current(sessionKey)));
				sessionChanges.emitBatch([...changes, ...committedTranscriptChanges]);
				return replacement ? {
					previous: new Map([...replacement.previous].filter(([key]) => current(key))),
					current: new Map([...replacement.current].filter(([key]) => current(key))),
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
	return publication;
}
//#endregion
export { applySessionEntryMaintenanceAgeChange as a, invalidateSessionEntryMaintenanceAgeFact as c, readSessionEntryMaintenanceAgeFact as d, readSessionEntryMaintenanceNextAgeAt as f, updateSessionEntryMaintenanceAgeFact as h, advanceSessionEntryMaintenanceAgeFact as i, observeSessionEntryMaintenanceAgeChanges as l, stageSessionEntryMaintenanceAgeFact as m, retainSessionEntryWorkerPublication as n, capturePendingSessionMaintenanceAgeChanges as o, recordSessionEntryMaintenanceAgeFact as p, SESSION_ENTRY_MAINTENANCE_INTERVAL_MS as r, captureSessionEntryMaintenanceAgeChange as s, publishSessionEntryWorkerInvalidations as t, publishSessionEntryMaintenanceAgeChanges as u };

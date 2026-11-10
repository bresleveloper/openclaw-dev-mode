import { a as resolveGlobalSingleton, i as resolveGlobalSet } from "./global-singleton-DrXvEBww.mjs";
import { o as sessionRowChangeSource } from "./session-row-changes-vFaNnKNM.mjs";
import { r as findOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
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
		pluginOwnerId: entry.pluginOwnerId,
		skillLibrarySelections: entry.skillLibrarySelections ? structuredClone(entry.skillLibrarySelections) : void 0,
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
		category: entry.category,
		sidebarRoot: entry.sidebarRoot,
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
		sessionStartedAt: entry.sessionStartedAt,
		deviceFolder: entry.deviceFolder ? { ...entry.deviceFolder } : void 0,
		permissionMode: entry.permissionMode,
		execNode: entry.execNode,
		sessionRoot: entry.sessionRoot,
		spawnedCwd: entry.spawnedCwd,
		spawnedWorkspaceDir: entry.spawnedWorkspaceDir,
		toolOverrides: entry.toolOverrides ? structuredClone(entry.toolOverrides) : void 0
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
function assertSessionEntryCreationCurrent(creation) {
	if (!creation?.active) throw new Error("Session creation publication owner is no longer current");
	const source = creation.source;
	if (source.kind !== "native") source.assertCurrent();
	else if (!source.database.db.isOpen || source.database.agentId !== source.agentId) throw new Error("Session creation publication owner is no longer current");
}
function assertSessionEntryCreationTarget(creation, target) {
	assertSessionEntryCreationCurrent(creation);
	const sourcePath = creation.source.kind === "native" ? creation.source.database.path : creation.source.path;
	const sourceIdentity = creation.source.kind === "native" ? findOpenClawAgentDatabaseIdentity(creation.source.database)?.identity : creation.source.databaseIdentity;
	const matchesDatabaseIdentity = typeof sourceIdentity === "string" && target.databaseIdentity === (creation.source.kind === "actor" ? sourceIdentity : `file:${sourceIdentity}`);
	const matchesTarget = target.databaseIdentity !== void 0 ? matchesDatabaseIdentity : target.paths.has(path.resolve(sourcePath));
	if (creation.agentId !== target.agentId || creation.sessionKey !== target.sessionKey || !matchesTarget) throw new Error("Session creation publication owner is no longer current");
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-sharing-acquisition.ts
/** Unknown postimages require a fresh read; observed mismatches cannot be restored. */
function publishRetainedSessionEntryPredicate(read, entry, known, options) {
	const predicate = read.predicate;
	if (!predicate) return;
	if (predicate.state === "changed") return;
	if (predicate.state === "acquiring" && predicate.revision === 0) {
		predicate.entry = entry;
		predicate.revision += 1;
		if (!known) predicate.state = "unknown";
		return;
	}
	let matches;
	try {
		matches = known ? predicate.matches(entry) : void 0;
	} catch {}
	if (matches === void 0) {
		predicate.revision += 1;
		predicate.state = "unknown";
	} else if (!matches) {
		predicate.revision += 1;
		predicate.state = "changed";
	} else if (!options?.preserveMatchingEntry) predicate.entry = entry;
}
function revokePreparedSessionEntryPredicate(read) {
	if (read.predicate) {
		read.predicate.state = "changed";
		read.predicate.revision += 1;
	}
}
/** Partial publications change only their named fields, independently of row-cache warmth. */
function projectSessionEntryPredicateChange(predicate, change) {
	const entry = predicate.entry;
	if (!entry) return;
	switch (change.kind) {
		case "owner": return entry.sessionId === change.sessionId && (entry.lifecycleRevision ?? null) === change.lifecycleRevision ? {
			...entry,
			owner: change.owner
		} : void 0;
		case "participants": return change.projectionChanged === false ? entry : change.projection ? {
			...entry,
			participants: void 0,
			participantCount: void 0,
			...change.projection
		} : void 0;
		case "category": return entry.sessionId === change.sessionId ? {
			...entry,
			category: change.category ?? void 0
		} : void 0;
		case "member": return entry.sessionId === change.sessionId ? entry : void 0;
		default: return;
	}
}
function publishRetainedSessionGeneration(read, entry, known) {
	const generation = read.generation;
	if (generation?.initiallyAbsent) {
		if (generation.current === null) generation.current = known ? entry ?? null : void 0;
		return;
	}
	if (!generation?.current) return;
	if (!known) generation.current = void 0;
	else if (!entry || generation.current.sessionId !== entry.sessionId || generation.current.lifecycleRevision !== entry.lifecycleRevision) generation.current = null;
	else generation.current = entry;
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
	if (change.kind === "category") return {
		...facts,
		entry: {
			...facts.entry,
			category: change.category ?? void 0
		}
	};
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
const unknownSharingAuthorities = resolveGlobalSet(Symbol.for("openclaw.unknownSessionSharingAuthorities"), "close-and-restart");
/** A fresh snapshot cannot settle a write whose outcome the authority owner lost. */
function markSessionSharingAuthorityUnknown(database, sessionKey) {
	const identity = typeof database === "string" ? database : findOpenClawAgentDatabaseIdentity(database)?.identity;
	if (typeof identity === "string") unknownSharingAuthorities.add(`file:${identity}\0${sessionKey}`);
}
function stageSessionSharingPublication(database, sessionKey, change) {
	const reads = [...retainedSharingReads(database, sessionKey) ?? []];
	const token = {};
	const release = () => {
		for (const read of reads) {
			read.pending.delete(token);
			read.predicate?.pending.delete(token);
		}
	};
	try {
		for (const read of reads) {
			read.pending.add(token);
			const predicate = read.predicate;
			const postimage = predicate && change && projectSessionEntryPredicateChange(predicate, change);
			if (predicate && (!postimage || !predicate.matches(postimage))) predicate.pending.add(token);
		}
	} catch (error) {
		release();
		throw error;
	}
	return release;
}
function recordCommittedSessionEntryPublication(database, sessionKey, before) {
	const identity = typeof database === "string" ? database : findOpenClawAgentDatabaseIdentity(database)?.identity;
	if (typeof identity !== "string") return;
	for (const pending of pendingSessionEntryPublications.get(`file:${identity}\0${sessionKey}`) ?? []) {
		if (pending === before) break;
		pending.superseded.add(sessionKey);
	}
}
function recordCommittedSessionMetadataPublication(database, sessionKey, change, entry) {
	for (const read of retainedSharingReads(database, sessionKey) ?? []) {
		const postimage = entry ?? (read.predicate && change ? projectSessionEntryPredicateChange(read.predicate, change) : void 0);
		publishRetainedSessionEntryPredicate(read, postimage, postimage !== void 0);
	}
	recordCommittedSessionEntryPublication(database, sessionKey);
}
/** Commit receipts remain current only until their stored fields are superseded. */
function readCurrentSessionEntryProjection(owner, replacement, sessionKey) {
	return !owner.superseded.has(sessionKey) ? replacement?.projection?.get(sessionKey) : void 0;
}
function prepareSessionEntryReplacementChanges(owner, replacement, databaseIdentity) {
	if (replacement.source?.identity !== databaseIdentity) return;
	const current = (key) => !owner.superseded.has(key);
	const snapshot = (entries, participants = false) => new Map([...entries].filter(([key]) => current(key) && (!participants || !replacement.unavailableParticipantKeys?.includes(key))));
	return {
		source: replacement.source,
		entries: snapshot(replacement.current, true),
		fullEntries: replacement.fullEntries && snapshot(replacement.fullEntries, true),
		actorPostimages: replacement.actorPostimages && snapshot(replacement.actorPostimages),
		sharing: new Map([...replacement.current].filter(([key]) => current(key)).map(([key, entry]) => [key, projectSessionSharingEntry(entry)])),
		projection: replacement.projection && snapshot(replacement.projection)
	};
}
/** Capture acknowledged facts while their existing publication owner keeps delivery current. */
function prepareSessionEntryPublicationFacts(params) {
	const { replacement, owner, databaseIdentity, unknown } = params;
	const current = (key) => !owner.superseded.has(key);
	const prepared = !unknown && replacement ? prepareSessionEntryReplacementChanges(owner, replacement, databaseIdentity) : void 0;
	const currentMetadata = (key) => current(key) && replacement !== void 0;
	const readCurrent = (key) => {
		if (!currentMetadata(key)) return;
		const entry = prepared?.entries.get(key);
		if (!entry) {
			const metadata = replacement?.unavailableParticipantKeys?.includes(key) ? replacement.current.get(key) : void 0;
			return metadata ? {
				entry: void 0,
				projection: void 0,
				sharing: projectSessionSharingEntry(metadata)
			} : void 0;
		}
		const projection = readCurrentSessionEntryProjection(owner, replacement, key) ? prepared?.projection?.get(key) : void 0;
		return {
			entry,
			fullEntry: prepared?.fullEntries?.get(key),
			actorPostimage: prepared?.actorPostimages?.get(key),
			projection
		};
	};
	return {
		prepared,
		currentMetadata,
		readCurrent
	};
}
function publishRetainedSessionEntryChange(database, sessionKey, entry, previousIdentity, known, metadataEntry) {
	recordCommittedSessionEntryPublication(database, sessionKey);
	for (const read of retainedSharingReads(database, sessionKey) ?? []) {
		publishRetainedSessionEntryPredicate(read, metadataEntry, known);
		recordAcquiringSessionEntry(read.acquisition, entry, previousIdentity);
		publishRetainedSessionGeneration(read, entry, known);
		const previous = read.facts;
		read.facts = entry && previous?.entry && previous.entry.sessionId === entry.sessionId && previous.entry.lifecycleRevision === entry.lifecycleRevision ? {
			entry,
			membership: previous.membership
		} : void 0;
	}
}
/** The existing entry writer advances retained facts before any commit observer can reenter. */
function retainPreparedSessionSharingFacts(params) {
	const key = `${params.databaseIdentity}\0${params.sessionKey}`;
	const initial = "acquiring" in params ? void 0 : params;
	const read = {
		predicate: params.predicate,
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
	const pending = (membership, staged = read.pending) => staged.size > 0 || [...pendingSessionEntryPublications.get(key) ?? []].some((publication) => !publication.settled && (!publication.superseded.has(params.sessionKey) && (!membership || !publication.sharingUnchanged.has(params.sessionKey)) || membership && publication.membershipInvalidated.has(params.sessionKey)));
	const generationPending = () => read.pending.size > 0 || [...pendingSessionEntryPublications.get(key) ?? []].some((publication) => !publication.settled && !publication.superseded.has(params.sessionKey) && !publication.generationUnchanged.has(params.sessionKey));
	const predicatePending = () => (read.predicate?.pending.size ?? 0) > 0 || [...pendingSessionEntryPublications.get(key) ?? []].some((publication) => {
		if (publication.settled || publication.superseded.has(params.sessionKey)) return false;
		const entryPostimage = publication.entryPostimages?.get(params.sessionKey);
		if (read.predicate && entryPostimage) try {
			return !read.predicate.matches(entryPostimage);
		} catch {
			return true;
		}
		if (!read.predicate || !publication.participantProjections?.has(params.sessionKey)) return true;
		const projection = publication.participantProjections.get(params.sessionKey);
		if (!projection) return false;
		const postimage = projectSessionEntryPredicateChange(read.predicate, {
			kind: "participants",
			projection
		});
		try {
			return !postimage || !read.predicate.matches(postimage);
		} catch {
			return true;
		}
	});
	return {
		hasPendingPublication: predicatePending,
		prepareRead: () => {
			const completions = [...pendingSessionEntryPublications.get(key) ?? []].flatMap((publication) => !publication.settled && !publication.superseded.has(params.sessionKey) ? [publication.completion] : []);
			return completions.length > 0 ? Promise.all(completions).then(() => {}) : void 0;
		},
		initialize: (snapshot) => {
			const acquisition = read.acquisition;
			if (!active || !acquisition || unknownSharingAuthorities.has(key)) throw new Error("Session sharing acquisition is no longer current");
			read.facts = reconcileSessionSharingAcquisition(acquisition, snapshot);
			read.acquisition = void 0;
			return read.facts;
		},
		adoptCreatedEntry: (entry) => {
			read.facts = {
				entry,
				membership: /* @__PURE__ */ new Set()
			};
		},
		readGeneration: () => active && !generationPending() ? read.generation?.current : void 0,
		readGenerationSettings: () => active && !pending(true) ? read.generation?.current : void 0,
		readCurrent: () => pending(true) || unknownSharingAuthorities.has(key) ? void 0 : read.facts,
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
/** Exact reader consumers acknowledge refreshes before releasing their physical source. */
function retainPreparedSessionEntryPredicate(params) {
	const { acquiring, ...retention } = params;
	const predicate = {
		entry: params.entry,
		matches: (entry) => params.matches(acquiring ? predicate.entry : params.entry, entry),
		state: acquiring ? "acquiring" : "current",
		revision: 0,
		pending: /* @__PURE__ */ new Set()
	};
	const retained = retainPreparedSessionSharingFacts({
		...retention,
		predicate,
		membership: /* @__PURE__ */ new Set()
	});
	let active = true;
	const canRefresh = () => active && predicate.state !== "changed";
	const isCurrent = () => canRefresh() && predicate.state === "current" && !retained.hasPendingPublication();
	return {
		prepareRead: retained.prepareRead,
		isCurrent,
		readRetainedEntry: () => predicate.entry,
		readCurrent: () => isCurrent() ? { entry: structuredClone(predicate.entry) } : void 0,
		canRefresh,
		captureRevision: () => predicate.revision,
		acknowledge: (entry, revision) => {
			if (predicate.state === "acquiring" && predicate.revision === 0) predicate.entry = entry;
			if (!canRefresh() || retained.hasPendingPublication() || revision !== predicate.revision && predicate.state !== "acquiring") return false;
			if (!predicate.matches(entry)) {
				predicate.state = "changed";
				return false;
			}
			predicate.entry = entry;
			predicate.state = "current";
			return true;
		},
		release: () => {
			active = false;
			retained.release();
		}
	};
}
/** Generation custody shares the entry publication owner, independently of membership. */
function retainPreparedSessionGenerationFacts(params) {
	const generation = {
		current: params.entry ?? null,
		initiallyAbsent: params.entry ? void 0 : true
	};
	const retained = retainPreparedSessionSharingFacts({
		...params,
		membership: /* @__PURE__ */ new Set(),
		generation
	});
	return {
		adoptCreatedEntry: (entry) => {
			if (!generation.initiallyAbsent || retained.readGeneration() !== entry) return false;
			generation.initiallyAbsent = void 0;
			return true;
		},
		readCurrent: retained.readGeneration,
		readSessionSettings: retained.readGenerationSettings,
		prepareRead: retained.prepareRead,
		release: retained.release
	};
}
function retainedSharingReads(database, sessionKey) {
	const identity = typeof database === "string" ? database : findOpenClawAgentDatabaseIdentity(database)?.identity;
	return typeof identity === "string" ? preparedSharingReads.get(`file:${identity}\0${sessionKey}`) : void 0;
}
const preparedSharingChanges = resolveGlobalSingleton(Symbol.for("openclaw.preparedSessionSharingChanges"), () => ({
	changes: /* @__PURE__ */ new WeakMap(),
	operations: /* @__PURE__ */ new WeakMap(),
	current: new AsyncLocalStorage()
}));
function readSessionEntryCreationReceipt(change, operation) {
	const record = preparedSharingChanges.changes.get(change);
	const receipt = record?.kind === "placeholder" ? record.receipt : record?.kind === "metadata" ? record.creation : void 0;
	const creation = preparedSharingChanges.operations.get(operation);
	if (!creation) return;
	return receipt?.committed && receipt.creation === creation && receipt.databaseIdentity === readSessionEntryCreationIdentity(creation) && receipt.sessionKey === creation.sessionKey ? receipt : void 0;
}
function readSessionEntryCreationTransition(change, operation) {
	const receipt = readSessionEntryCreationReceipt(change, operation);
	return receipt?.kind === "placeholder" ? receipt.placeholder : void 0;
}
/** Full-row creation is authoritative only from the bound writer's settled COMMIT receipt. */
function readSessionEntryCreatedEntry(change, operation) {
	const receipt = readSessionEntryCreationReceipt(change, operation);
	return receipt?.kind === "entry" ? receipt.entry : void 0;
}
/** Private owner metadata follows the original event object without changing its public fields. */
function isPreparedSessionSharingChange(change) {
	const record = preparedSharingChanges.changes.get(change);
	return record !== void 0 && record.kind !== "source";
}
function readPreparedSessionSharingChange(change) {
	const record = preparedSharingChanges.changes.get(change);
	return record && "sharingChange" in record ? record.sharingChange : void 0;
}
/** Physical publication facts are captured by the writer, never resolved by observers. */
function readPreparedSessionEntryPublicationSource(change) {
	const record = preparedSharingChanges.changes.get(sessionRowChangeSource(change));
	const source = record?.kind === "metadata" ? record.prepared.source : void 0;
	return {
		identity: record?.databaseIdentity ?? source?.identity,
		canonicalPath: record?.canonicalPath ?? source?.canonicalPath
	};
}
/** Commit metadata follows the same original row or identity event through preparation. */
function readPreparedSessionEntryChange(change, sessionKey) {
	const record = preparedSharingChanges.changes.get(change);
	if (record?.kind !== "metadata") return;
	const { prepared } = record;
	const current = record.readCurrent?.(sessionKey);
	const entry = record.readCurrent ? current?.entry : prepared.entries.get(sessionKey);
	return {
		source: prepared.source,
		entry,
		fullEntry: record.readCurrent ? current?.fullEntry : prepared.fullEntries?.get(sessionKey),
		actorPostimage: record.readCurrent ? current?.actorPostimage : prepared.actorPostimages?.get(sessionKey),
		sharing: record.readCurrent ? current?.sharing ?? (current?.entry && projectSessionSharingEntry(current.entry)) : prepared.sharing?.get(sessionKey) ?? (entry ? projectSessionSharingEntry(entry) : void 0),
		projection: record.readCurrent ? current?.projection : prepared.projection?.get(sessionKey)
	};
}
//#endregion
export { projectSessionSharingEntry as A, publishRetainedSessionGeneration as C, updateSessionSharingField as D, revokePreparedSessionEntryPredicate as E, sessionSharingEntriesEqual as M, assertSessionEntryCreationTarget as O, publishRetainedSessionEntryPredicate as S, recordAcquiringSessionMember as T, retainPreparedSessionGenerationFacts as _, preparedSharingChanges as a, stageSessionSharingPublication as b, readCurrentSessionEntryProjection as c, readPreparedSessionSharingChange as d, readSessionEntryCreatedEntry as f, retainPreparedSessionEntryPredicate as g, recordCommittedSessionMetadataPublication as h, prepareSessionEntryPublicationFacts as i, readSessionEntryCreationIdentity as j, createSessionEntryCreationOperation as k, readPreparedSessionEntryChange as l, recordCommittedSessionEntryPublication as m, markSessionSharingAuthorityUnknown as n, preparedSharingReads as o, readSessionEntryCreationTransition as p, pendingSessionEntryPublications as r, publishRetainedSessionEntryChange as s, isPreparedSessionSharingChange as t, readPreparedSessionEntryPublicationSource as u, retainPreparedSessionSharingFacts as v, recordAcquiringSessionEntry as w, projectSessionEntryPredicateChange as x, retainedSharingReads as y };

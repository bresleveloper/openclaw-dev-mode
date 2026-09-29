import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-CWk2dk1h.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { H as copyPreparedModelVisibleToolText } from "./redact-B5EGyLvV.mjs";
import { r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { t as assertAgentDatabaseTerminalOpenAllowed } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { a as deferOpenClawAgentPostCommitPublication, f as runOpenClawAgentWriteTransaction, l as openOpenClawAgentDatabase, s as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CaQAStOA.mjs";
import { C as parseParentLinkedOpaqueEntry, S as parseOpaqueLeafEntry, b as findSessionTranscriptHeader, s as transcriptEventJsonSql, v as assertCurrentSessionTranscriptHeader, w as partitionSessionFileEntries, x as isIndexedSessionEntry } from "./transcript-payload-qsg5dB6v.mjs";
import { i as sameSessionTranscriptTargetBinding, n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-CqmhHNa_.mjs";
import { a as captureSessionMetadataPublication, i as captureOwnedTranscriptWriteAssertion, n as assertOwnedTranscriptWriteCommit, o as getOwnedSessionTranscriptInitialWriter, s as getOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-MlBhwaKa.mjs";
import { t as buildSessionContext } from "./session-D9cHHQGH.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, m as resolveSqliteTranscriptScope, p as resolveSqliteTranscriptReadScope, s as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { r as isSessionTranscriptSideAppendEntry } from "./transcript-tree-3xvvNd9-.mjs";
import { n as SYNC_REBUILD_MAX_ROWS, t as SYNC_REBUILD_MAX_BYTES } from "./session-transcript-index-UaRlRUAw.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Cef06Gbk.mjs";
import { c as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { P as withSessionPendingInputRelocation } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import { o as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { a as runWithSessionTranscriptReadFence, o as withSessionContextAdmission, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-C3x2ZjEy.mjs";
import { i as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-Can_jxkB.mjs";
import { n as ensureSessionEntrySync } from "./session-accessor.sqlite-initial-entry-DTpzTl-3.mjs";
import { E as prepareTranscriptMessageAppend, O as readTranscriptMutationAtSync, T as appendTranscriptMessageInTransaction, a as appendTranscriptMessageSnapshotSync, m as replaceTranscriptSuffixEventsSync, n as appendTranscriptEventSnapshotSync, o as appendTranscriptMessageSync, s as replaceSessionWithBranchedTranscript, x as resolveTranscriptAppendRefusal } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { C as readTranscriptIdentityByEventId, F as resolveTranscriptMessageAppendParent, O as validatePreparedAssistantAppendSync, _ as readTranscriptEventAtSeqSync, a as inspectTranscriptEventsSync, f as loadTranscriptReadSnapshotSync, k as applyAssistantDeliveryDirectives } from "./session-accessor.sqlite-read-BzN7WYll.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { a as getCodeModeSourceAppend, i as copyCodeModeSourceAppendOptions, r as copyCodeModeSourceAppend } from "./transcript-redact-CcOcbRyc.mjs";
import { i as readNestedToolActivity } from "./nested-tool-activity-Cz_FrJ3z.mjs";
import { l as redactTranscriptMessageForStorage, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-C7lVBkzn.mjs";
import { M as requireTranscriptEventAppendSnapshot, O as loadTranscriptSuffixEventsBoundedSync, k as readPreviousIndexedTranscriptEventSync } from "./session-accessor-l-4ZHvKn.mjs";
import { i as walkSessionCurrentTurn, r as resolveOpaqueSessionFirstKeptEntryId, t as SessionEntryNavigation } from "./session-entry-navigation-neBcvf-5.mjs";
import { a as validateSessionTranscriptContextVersion, i as validateSessionTranscriptContextAnchor, n as readSessionTranscriptModelContext, r as validateSessionTranscriptContextAdmission, t as readSessionTranscriptContextMessages } from "./session-accessor.sqlite-model-context-Dxi3aFzy.mjs";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-BF6L8Gm-.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import { t as readSessionTranscriptCurrentTurnEntry } from "./session-accessor.sqlite-current-turn-BksykezJ.mjs";
import { n as readSessionTranscriptModelContextAsync } from "./session-transcript-read-worker-runtime-BI_mmvSz.mjs";
import { d as generateSessionEntryId, i as isTalkRealtimeVoiceEntry, r as isSessionContextMetadataEntry, s as migrateToCurrentVersion, u as createManagedSessionId } from "./session-manager-codec-DW3_Rlj9.mjs";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-Dwxoskt2.mjs";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/sessions/session-accessor.sqlite-branch-rewrite.ts
/** Capture a constant-size snapshot; the session owner prepares payloads outside the write lock. */
function prepareTranscriptRewriteSync(scope, appendParentId, assertActive, loadedVersion) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	const options = toDatabaseOptions(resolved);
	const database = openOpenClawAgentDatabase(options);
	if (database.db.isTransaction) throw new Error("Transcript rewrite must own its commit; run it outside the active transaction");
	assertActive();
	assertOwnedTranscriptWriteCommit(fencedScope);
	const version = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
	const conflict = () => /* @__PURE__ */ new Error("Session transcript changed before rewrite publication");
	if (!loadedVersion || version.generation !== loadedVersion.generation || version.rawSeq !== loadedVersion.rawSeq || resolveTranscriptMessageAppendParent(database, resolved.sessionId, {}) !== appendParentId) throw conflict();
	return (entries, sources, adopt) => {
		if (openOpenClawAgentDatabase(options).db.isTransaction) throw new Error("Transcript rewrite must own its commit; run it outside the active transaction");
		for (const entry of entries) if (entry.type === "message") entry.message = redactTranscriptMessageForStorage(entry.message, {});
		let committedVersion;
		runOpenClawAgentWriteTransaction((current) => {
			if (!deferOpenClawAgentPostCommitPublication(current, () => adopt(committedVersion))) throw new Error("Transcript rewrite requires a commit publication");
			assertActive();
			assertOwnedTranscriptWriteCommit(fencedScope);
			const fresh = readSessionEntryRow(current, resolved.sessionKey);
			const refusal = resolveTranscriptAppendRefusal(fresh?.entry, resolved, fencedScope);
			if (refusal) throw new SessionTranscriptWriterClaimReboundError(refusal);
			const currentVersion = readTranscriptContextVersionInTransaction(current, resolved.sessionId);
			if (currentVersion.generation !== version.generation || currentVersion.rawSeq !== version.rawSeq) throw conflict();
			for (const source of sources.values()) {
				const row = executeSqliteQueryTakeFirstSync(current.db, getSessionKysely(current.db).selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select(transcriptEventJsonSql(current.db, "event").as("event_json")).where("identity.session_id", "=", resolved.sessionId).where("identity.event_id", "=", source.id));
				if (!row || !isDeepStrictEqual(JSON.parse(row.event_json), source)) throw conflict();
			}
			for (const entry of entries) {
				assertActive();
				assertOwnedTranscriptWriteCommit(fencedScope);
				if (entry.type === "message") {
					const source = sources.get(entry.id);
					if (!source) throw new Error("Transcript rewrite message has no source entry");
					const result = withSessionPendingInputRelocation(source.id, entry.message, () => appendTranscriptMessageInTransaction(current, resolved, {
						eventId: entry.id,
						parentId: entry.parentId,
						now: Date.parse(entry.timestamp),
						message: entry.message,
						messageAlreadyRedacted: true,
						appendMode: entry.appendMode,
						idempotencyLookup: "caller-checked"
					}));
					if (!result?.appended || result.messageId !== entry.id) throw new Error("Transcript rewrite message was not appended");
					entry.message = result.message;
				} else if (!appendTranscriptEventInTransaction(current, resolved, entry)) throw new Error("Transcript rewrite entry was not appended");
			}
			assertActive();
			assertOwnedTranscriptWriteCommit(fencedScope);
			committedVersion = readTranscriptContextVersionInTransaction(current, resolved.sessionId);
		}, options);
	};
}
//#endregion
//#region src/config/sessions/session-transcript-hydration.ts
/** Capture identity before queueing; a missing file remains the creation owner's responsibility. */
function prepareSessionTranscriptHydration(source, limits, signal) {
	const target = captureSessionTranscriptTargetBinding(source);
	const contextLimits = limits ? {
		maxBytes: limits.maxBytes,
		maxEvents: limits.maxEvents
	} : void 0;
	const receipt = resolveSessionTranscriptReadFence(target);
	const admission = receipt ? { ...receipt } : void 0;
	signal?.throwIfAborted();
	const incognitoOptions = isIncognitoSessionKey(target.sessionKey) ? toDatabaseOptions(resolveSqliteTranscriptReadScope(target)) : void 0;
	const incognitoOwner = incognitoOptions ? getOpenClawAgentDatabaseIfOpen(incognitoOptions) : void 0;
	const assertCurrent = () => {
		if (incognitoOptions && getOpenClawAgentDatabaseIfOpen(incognitoOptions) !== incognitoOwner) throw new Error("Session transcript incognito database owner is no longer current");
	};
	const readInOwner = async (readInProcess, readInWorker) => {
		signal?.throwIfAborted();
		if (incognitoOptions) return runWithSessionTranscriptReadFence(admission, readInProcess);
		const resolvedScope = await prepareSqliteTranscriptReadScope(target, signal);
		signal?.throwIfAborted();
		const options = toDatabaseOptions(resolvedScope);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		assertAgentDatabaseTerminalOpenAllowed(databasePath);
		try {
			const result = await withSessionHistoryWorkerDatabase(options, async (owner) => {
				try {
					return await readInWorker(owner, resolvedScope);
				} finally {
					owner.assertCurrent();
				}
			});
			signal?.throwIfAborted();
			return result;
		} finally {
			assertAgentDatabaseTerminalOpenAllowed(databasePath);
		}
	};
	const read = () => readInOwner(() => contextLimits ? {
		kind: "bounded",
		snapshot: readSessionTranscriptBoundedActiveContextCore(target, {
			...contextLimits,
			readOnly: true
		})
	} : {
		kind: "full",
		snapshot: loadTranscriptReadSnapshotSync(target, { readOnly: true })
	}, (owner, resolvedScope) => owner.readTranscript({
		target,
		resolvedScope,
		limits: contextLimits,
		admission
	}, signal));
	const readCurrentTurnEntry = (input) => {
		const request = {
			entryId: input.entryId,
			version: { ...input.version },
			includeEntry: input.includeEntry
		};
		return readInOwner(() => readSessionTranscriptCurrentTurnEntry(target, {
			...request,
			readOnly: true
		}), (owner, resolvedScope) => owner.readCurrentTurnEntry({
			...request,
			target,
			resolvedScope,
			admission
		}, signal));
	};
	return {
		target,
		read,
		readCurrentTurnEntry,
		assertCurrent
	};
}
//#endregion
//#region src/agents/sessions/session-manager-current-turn.ts
/** @internal Replay preparation is not part of the public SessionManager API. */
const sessionManagerPrepareCurrentTurnReplay = Symbol.for("openclaw.session-manager.prepare-current-turn-replay");
function traversalEntry(entry, entryId, isInterruptedTail) {
	if (!entry || entry.id !== entryId) return;
	return {
		id: entry.id,
		parentId: entry.parentId,
		traversable: isSessionContextMetadataEntry(entry) || entry.type === "compaction" || (isInterruptedTail?.(entry) ?? false)
	};
}
function omittedCustomMessage(event, anchor) {
	return anchor && isIndexedSessionEntry(event) && event.type === "message" && event.message.role === "custom" && event.id === anchor.entryId && event.parentId === anchor.effectiveParentId ? event : void 0;
}
function resolveCurrentTurnEntryId(view, includeOmitted) {
	const walk = walkSessionCurrentTurn(view.parentId, view.remainingAncestors);
	let next = walk.next();
	while (!next.done) {
		let entry = view.entries.get(next.value);
		if (!entry && includeOmitted && view.target) {
			const anchor = readActiveTranscriptEntryAnchor({
				...view.target,
				entryId: next.value
			});
			entry = omittedCustomMessage(anchor ? readTranscriptEventAtSeqSync(view.target, anchor.rawSeq)?.event : void 0, anchor);
		}
		next = walk.next(traversalEntry(entry, next.value, view.isInterruptedTail));
	}
	return next.value;
}
async function prepareCurrentTurnReplayWitness(readView, matchesUser, signal) {
	const view = readView();
	if (!view.target || !view.version) return;
	const version = { ...view.version };
	const entryCount = view.entries.size;
	const assertOwned = captureOwnedTranscriptWriteAssertion(view.target);
	const assertCurrent = () => {
		assertOwned();
		const current = readView();
		if (current.target !== view.target || current.version !== view.version || current.entries !== view.entries || current.entries.size !== entryCount || current.parentId !== view.parentId) throw new Error("Session manager changed during replay preparation");
	};
	assertCurrent();
	const reader = prepareSessionTranscriptHydration(view.target, void 0, signal);
	const walk = walkSessionCurrentTurn(view.parentId, view.remainingAncestors);
	let next = walk.next();
	while (!next.done) {
		let entry = view.entries.get(next.value);
		if (!entry) {
			const result = await reader.readCurrentTurnEntry({
				entryId: next.value,
				version,
				includeEntry: true
			});
			reader.assertCurrent();
			assertCurrent();
			entry = omittedCustomMessage(result.event, result.anchor);
		}
		next = walk.next(traversalEntry(entry, next.value, view.isInterruptedTail));
	}
	const userId = next.value;
	if (!userId || !matchesUser(view.entries.get(userId))) return;
	const result = await reader.readCurrentTurnEntry({
		entryId: userId,
		version,
		includeEntry: false
	});
	reader.assertCurrent();
	assertCurrent();
	return result.anchor ? {
		anchor: result.anchor,
		version: result.version
	} : void 0;
}
//#endregion
//#region src/agents/sessions/session-manager-metadata-error.ts
/** A known metadata append cannot be replayed when its local view or publication fails. */
const SessionMetadataCommittedError = resolveGlobalSingleton(Symbol.for("openclaw.sessionMetadataCommittedError"), () => class CommittedMetadataError extends Error {
	constructor(committedEntry, committedVersion, cause, target) {
		super("Session metadata committed, but the operation did not complete; do not replay the append", { cause });
		this.committedEntry = committedEntry;
		this.committedVersion = committedVersion;
		this.name = "SessionMetadataCommittedError";
		this.committedTarget = target ? {
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			...target.env ? { env: { ...target.env } } : {}
		} : void 0;
		recordModelFallbackStop(this);
	}
});
//#endregion
//#region src/agents/sessions/session-compaction-persistence.ts
const invocation = resolveGlobalSingleton(Symbol.for("openclaw.sessionCompactionPersistence"), () => new AsyncLocalStorage());
/** Bind host accounting only to this exact manager's synchronous compaction invocation. */
function withSessionCompactionPersistence(manager, persist, append) {
	if (!persist) return append();
	const current = {
		manager,
		persist,
		active: true
	};
	try {
		return invocation.run(current, append);
	} finally {
		current.active = false;
	}
}
function getSessionCompactionPersistence(manager) {
	const current = invocation.getStore();
	return current?.active && current.manager === manager ? current.persist : void 0;
}
//#endregion
//#region src/agents/sessions/session-manager-core.ts
var SessionManagerCore = class SessionManagerCore extends SessionEntryNavigation {
	constructor(cwd, persistenceTarget, loadedEntries, boundedContext, transcriptMutationAt, version) {
		super();
		this.migrated = false;
		this.sessionId = "";
		this.hydrationRevision = 0;
		this.fileEntries = [];
		this.opaqueFileEntries = [];
		this.boundedParentIds = /* @__PURE__ */ new Map();
		this.boundedFirstKeptById = /* @__PURE__ */ new Map();
		this.pendingDeliberateAppend = false;
		this.persistenceHeaderPending = false;
		this.boundedContextIncomplete = false;
		this.cwd = cwd;
		this.persistenceTarget = persistenceTarget;
		this.boundedContextLimits = boundedContext?.limits;
		this.boundedContextIncomplete = boundedContext !== void 0;
		this.persistedBoundaryCount = boundedContext?.boundaryCount;
		this.persistedSuffixStartSeq = boundedContext?.persistedSuffixStartSeq;
		this.transcriptMutationAt = boundedContext !== void 0 ? boundedContext.transcriptMutationAt : transcriptMutationAt;
		this.transcriptVersion = version ?? boundedContext?.version;
		if (persistenceTarget || loadedEntries) this.setLoadedSessionTarget(persistenceTarget, loadedEntries ?? [], boundedContext, version);
		else this.newSession();
	}
	/** @deprecated Runtime callers should await setSessionTargetAsync. */
	setSessionTarget(target) {
		this.assertTranscriptViewAvailable();
		this.hydrationRevision++;
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const bounded = this.boundedContextLimits ? readSessionTranscriptBoundedActiveContextCore(capturedTarget, this.boundedContextLimits) : void 0;
		const snapshot = bounded ? void 0 : loadTranscriptReadSnapshotSync(capturedTarget);
		const entries = bounded?.events ?? snapshot?.events ?? [];
		this.boundedContextIncomplete = bounded !== void 0;
		this.persistedBoundaryCount = bounded?.boundaryCount;
		this.persistedSuffixStartSeq = bounded?.persistedSuffixStartSeq;
		this.transcriptMutationAt = bounded !== void 0 ? bounded.transcriptMutationAt : snapshot?.version.updatedAt;
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		this.setLoadedSessionTarget(capturedTarget, entries, bounded, bounded?.version ?? snapshot?.version);
		if (header?.cwd) this.cwd = header.cwd;
	}
	/** Prepare off-thread and publish the entire view only while this manager is unchanged. */
	setSessionTargetAsync(target, signal) {
		return this.hydrateSessionTarget(target, false, signal);
	}
	async hydrateSessionTarget(target, preserveCwd, signal) {
		this.assertTranscriptViewAvailable();
		const hydration = prepareSessionTranscriptHydration(target, this.boundedContextLimits, signal);
		const assertOwned = captureOwnedTranscriptWriteAssertion(hydration.target);
		const revision = ++this.hydrationRevision;
		const prior = this.captureTranscriptView();
		const entryCount = this.fileEntries.length;
		const opaqueCount = this.opaqueFileEntries.length;
		assertOwned();
		const prepared = await hydration.read().catch((error) => {
			assertOwned();
			throw error;
		});
		signal?.throwIfAborted();
		assertOwned();
		hydration.assertCurrent();
		this.assertTranscriptViewAvailable();
		const current = this.captureTranscriptView();
		if (revision !== this.hydrationRevision || this.fileEntries.length !== entryCount || this.opaqueFileEntries.length !== opaqueCount || Object.keys(prior).some((key) => Reflect.get(prior, key) !== Reflect.get(current, key))) throw new Error("Session manager changed during transcript hydration");
		const candidate = new SessionManagerCore(this.cwd);
		candidate.persistenceTarget = hydration.target;
		candidate.boundedContextLimits = this.boundedContextLimits;
		candidate.adoptPreparedTranscriptReload(prepared);
		Object.assign(this, candidate.captureTranscriptView());
		this.persistenceTarget = candidate.persistenceTarget;
		this.persistenceHeaderPending = candidate.persistenceHeaderPending;
		if (!preserveCwd) this.cwd = candidate.fileEntries.find((entry) => entry.type === "session")?.cwd ?? this.cwd;
		this.hydrationRevision++;
	}
	/** Reload an existing view without changing the runtime working directory. */
	async reloadPersistedTranscriptAsync(signal) {
		if (!this.persistenceTarget) return;
		await this.hydrateSessionTarget(this.persistenceTarget, true, signal);
	}
	/** Active-only loads can omit sibling rows even when they fit the context limits. */
	ensureCompletePersistedHistory() {
		this.assertTranscriptViewAvailable();
		if (!this.persistenceTarget || !this.boundedContextIncomplete) return;
		const limits = this.boundedContextLimits;
		this.boundedContextLimits = void 0;
		this.setSessionTarget(this.persistenceTarget);
		this.boundedContextLimits = limits;
	}
	setLoadedSessionTarget(target, entries, bounded, version) {
		this.assertTranscriptViewAvailable();
		this.transcriptVersion = version ?? bounded?.version;
		this.boundedFirstKeptById.clear();
		this.boundedParentIds.clear();
		const partitioned = partitionSessionFileEntries(entries);
		if (partitioned.fileEntries.length === 0 && partitioned.opaqueEntries.length === 0) {
			this.persistenceTarget = target ? captureSessionTranscriptTargetBinding(target) : void 0;
			this.initializeSession({ id: target?.sessionId });
			this.persistenceHeaderPending = target !== void 0;
			return;
		}
		const header = partitioned.fileEntries.find((entry) => entry.type === "session");
		if (target) assertCurrentSessionTranscriptHeader(header);
		this.persistenceHeaderPending = false;
		this.persistenceTarget = target ? captureSessionTranscriptTargetBinding(target) : void 0;
		this.fileEntries = partitioned.fileEntries;
		this.opaqueFileEntries = partitioned.opaqueEntries;
		this.sessionId = header?.id ?? target?.sessionId ?? createManagedSessionId();
		this.migrated = migrateToCurrentVersion(this.fileEntries, partitioned.fileEntriesByOriginalIndex);
		this.buildIndex();
		if (bounded) {
			this.boundedParentIds = new Map(bounded.parents);
			for (const [id, parentId] of bounded.opaqueParents) this.opaqueParentsById.set(id, parentId);
			this.adoptSelectedTranscriptPath(bounded.activeLeafEntryId, bounded.parents);
			for (const [boundaryId, range] of bounded.firstKeptRanges) {
				let firstKeptEntryId = boundaryId;
				for (let index = range.startIndex; index < range.endIndex; index++) {
					const entry = partitioned.fileEntriesByOriginalIndex[index];
					if (isIndexedSessionEntry(entry)) {
						firstKeptEntryId = entry.id;
						break;
					}
				}
				this.boundedFirstKeptById.set(boundaryId, firstKeptEntryId);
			}
		}
	}
	adoptSelectedTranscriptPath(appendParentId, parents) {
		this.logicalParentsById.clear();
		for (const [id, parentId] of parents) this.logicalParentsById.set(id, this.resolveCanonicalParentId(parentId));
		this.appendParentId = appendParentId;
		this.leafId = this.resolveOpaqueLeafTargetId(appendParentId);
		this.appendMode = void 0;
	}
	/** The loaded view only: bounded managers must never hydrate inactive history for a rewrite. */
	captureTranscriptView() {
		this.assertTranscriptViewAvailable();
		return {
			sessionId: this.sessionId,
			transcriptVersion: this.transcriptVersion,
			migrated: this.migrated,
			fileEntries: this.fileEntries,
			opaqueFileEntries: this.opaqueFileEntries,
			byId: this.byId,
			opaqueParentsById: this.opaqueParentsById,
			logicalParentsById: this.logicalParentsById,
			invalidLeafControlIds: this.invalidLeafControlIds,
			labelsById: this.labelsById,
			labelTimestampsById: this.labelTimestampsById,
			boundedFirstKeptById: this.boundedFirstKeptById,
			boundedParentIds: this.boundedParentIds,
			boundedContextIncomplete: this.boundedContextIncomplete,
			boundedContextLimits: this.boundedContextLimits,
			persistedBoundaryCount: this.persistedBoundaryCount,
			persistedSuffixStartSeq: this.persistedSuffixStartSeq,
			transcriptMutationAt: this.transcriptMutationAt,
			leafId: this.leafId,
			appendParentId: this.appendParentId,
			appendMode: this.appendMode,
			pendingDeliberateAppend: this.pendingDeliberateAppend
		};
	}
	/** @deprecated Runtime callers should await reloadPersistedTranscriptAsync. */
	reloadPersistedTranscript() {
		this.assertTranscriptViewAvailable();
		if (this.persistenceTarget) {
			const runtimeCwd = this.cwd;
			this.setSessionTarget(this.persistenceTarget);
			this.cwd = runtimeCwd;
		}
	}
	/** Reloads a committed append without adopting a later user turn. */
	reloadPersistedTranscriptAfterAppend(expectedMutationAt, expectedEntryId, admittedUserId) {
		if (!this.persistenceTarget) return;
		const target = this.persistenceTarget;
		if (this.boundedContextLimits) this.adoptPreparedTranscriptReload({
			kind: "bounded",
			snapshot: readSessionTranscriptBoundedActiveContextCore(target, {
				...this.boundedContextLimits,
				ignoreReadFence: true
			})
		}, {
			expectedMutationAt,
			expectedEntryId,
			admittedUserId
		});
		else {
			const inspected = inspectTranscriptEventsSync(target);
			this.adoptPreparedTranscriptReload({
				kind: "full",
				snapshot: {
					events: inspected.events,
					version: {
						generation: inspected.snapshot.generation,
						rawSeq: inspected.snapshot.lastSeq,
						updatedAt: inspected.snapshot.transcriptUpdatedAt
					}
				}
			}, {
				expectedMutationAt,
				expectedEntryId,
				admittedUserId
			});
		}
	}
	/** Adopt owner-prepared bytes without reading SQLite again on the receiving thread. */
	adoptPreparedTranscriptReload(prepared, append) {
		const target = this.persistenceTarget;
		if (!target) return;
		const runtimeCwd = this.cwd;
		const previousView = append ? structuredClone(this.captureTranscriptView()) : void 0;
		let reloaded = false;
		try {
			if (prepared.kind === "bounded") {
				const bounded = prepared.snapshot;
				const entries = bounded.events;
				if (append && bounded.transcriptMutationAt !== append.expectedMutationAt && !entries.some((entry) => isIndexedSessionEntry(entry) && entry.id === append.expectedEntryId)) throw new Error("SQLite transcript changed before adopting the committed append");
				this.boundedContextIncomplete = true;
				this.persistedBoundaryCount = bounded.boundaryCount;
				this.persistedSuffixStartSeq = bounded.persistedSuffixStartSeq;
				this.transcriptMutationAt = bounded.transcriptMutationAt;
				this.setLoadedSessionTarget(target, entries, bounded);
				reloaded = true;
			} else {
				const snapshot = prepared.snapshot;
				const entries = snapshot.events;
				if (append && snapshot.version.updatedAt !== append.expectedMutationAt && !entries.some((entry) => isIndexedSessionEntry(entry) && entry.id === append.expectedEntryId)) throw new Error("SQLite transcript changed before adopting the committed append");
				this.transcriptMutationAt = snapshot.version.updatedAt;
				this.setLoadedSessionTarget(target, entries, void 0, snapshot.version);
				reloaded = true;
			}
			if (!append) return;
			const activeBranch = this.getBranch();
			const admittedUserIndex = activeBranch.findIndex((entry) => entry.id === append.admittedUserId);
			if (admittedUserIndex < 0 || activeBranch.slice(admittedUserIndex + 1).some((entry) => entry.type === "message" && entry.message.role === "user")) this.adoptSelectedTranscriptPath(append.expectedEntryId, [...this.byId].map(([id, entry]) => [id, entry.parentId]));
		} catch (error) {
			if (reloaded && previousView) Object.assign(this, previousView);
			throw error;
		} finally {
			this.cwd = runtimeCwd;
		}
	}
	newSession(options) {
		if (this.persistenceTarget) throw new Error("Persisted session managers cannot change session identity in place");
		return this.initializeSession(options);
	}
	initializeSession(options) {
		this.sessionId = options?.id ?? this.persistenceTarget?.sessionId ?? createManagedSessionId();
		this.migrated = false;
		const header = {
			type: "session",
			version: 4,
			id: this.sessionId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			cwd: this.cwd,
			parentSession: options?.parentSession
		};
		this.fileEntries = [header];
		this.opaqueFileEntries = [];
		this.byId.clear();
		this.opaqueParentsById.clear();
		this.boundedFirstKeptById.clear();
		this.boundedParentIds.clear();
		this.logicalParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.labelsById.clear();
		this.labelTimestampsById.clear();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = false;
		return this.persistenceTarget ? this.sessionId : void 0;
	}
	buildIndex() {
		this.clearNavigation();
		this.pendingDeliberateAppend = false;
		let opaqueIndex = 0;
		for (let index = 0; index <= this.fileEntries.length; index += 1) {
			while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
				this.appendOpaqueNavigationRecord(this.opaqueFileEntries[opaqueIndex]?.record);
				opaqueIndex += 1;
			}
			const entry = this.fileEntries[index];
			if (!entry || entry.type === "session" || this.migrated && !isIndexedSessionEntry(entry)) continue;
			this.appendCanonicalNavigationEntry(entry);
		}
		this.finishNavigation();
	}
	normalizeEntryParent(entry) {
		let normalized = super.normalizeEntryParent(entry);
		const boundedFirstKept = this.boundedFirstKeptById.get(normalized.id);
		if (boundedFirstKept !== void 0 && (normalized.type === "compaction" || normalized.type === "reset")) normalized = {
			...normalized,
			firstKeptEntryId: boundedFirstKept
		};
		if ((normalized.type === "compaction" || normalized.type === "reset") && normalized.firstKeptEntryId !== void 0 && !this.byId.has(normalized.firstKeptEntryId) && this.opaqueParentsById.has(normalized.firstKeptEntryId)) {
			const firstKeptEntryId = resolveOpaqueSessionFirstKeptEntryId({
				firstKeptEntryId: normalized.firstKeptEntryId,
				parentId: normalized.parentId,
				fallbackParentId: this.resolveEntryParentId(entry),
				byId: this.byId,
				opaqueParentsById: this.opaqueParentsById,
				entries: () => this.fileEntries.filter(isIndexedSessionEntry)
			});
			if (firstKeptEntryId && firstKeptEntryId !== normalized.firstKeptEntryId) normalized = {
				...normalized,
				firstKeptEntryId
			};
		}
		return normalized;
	}
	resolveBranchTargetId(branchFromId) {
		if (this.byId.has(branchFromId)) return branchFromId;
		return this.opaqueParentsById.has(branchFromId) ? this.resolveCanonicalParentId(branchFromId) : void 0;
	}
	clampOpaqueFileEntryIndexes() {
		let previousOpaqueIndex = 0;
		for (const opaqueEntry of this.opaqueFileEntries) {
			opaqueEntry.index = Math.max(previousOpaqueIndex, Math.min(opaqueEntry.index, this.fileEntries.length));
			previousOpaqueIndex = opaqueEntry.index;
		}
	}
	createLeafControl(parentId, appendParentId = this.appendParentId, appendMode) {
		return {
			type: "leaf",
			id: generateSessionEntryId(),
			parentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: this.leafId,
			...appendParentId !== this.leafId ? { appendParentId } : {},
			...appendMode ? { appendMode } : {}
		};
	}
	rememberLeafControl(leafEntry) {
		this.opaqueFileEntries.push({
			index: this.fileEntries.length,
			record: leafEntry
		});
		this.opaqueParentsById.set(leafEntry.id, leafEntry.targetId);
	}
	getSessionName() {
		this.assertTranscriptViewAvailable();
		return this.fileEntries.findLast((entry) => entry.type === "session_info" && this.byId.has(entry.id))?.name?.trim() || void 0;
	}
	getChildren(parentId) {
		this.assertTranscriptViewAvailable();
		const children = [];
		for (const entry of this.byId.values()) {
			const normalizedEntry = this.normalizeEntryParent(entry);
			if (normalizedEntry.parentId === parentId) children.push(normalizedEntry);
		}
		return children;
	}
	getLabel(id) {
		this.assertTranscriptViewAvailable();
		return this.labelsById.get(id);
	}
	getBoundaryCount() {
		this.assertTranscriptViewAvailable();
		return this.persistedBoundaryCount ?? this.getBranch().filter((entry) => entry.type === "compaction" || entry.type === "reset").length;
	}
	getHeader() {
		this.assertTranscriptViewAvailable();
		return this.fileEntries.find((entry) => entry.type === "session") ?? null;
	}
	getEntries() {
		this.assertTranscriptViewAvailable();
		return this.fileEntries.filter((entry) => entry.type !== "session" && this.byId.has(entry.id)).map((entry) => this.normalizeEntryParent(entry));
	}
	getTree() {
		const entries = this.getEntries();
		const nodeMap = /* @__PURE__ */ new Map();
		const roots = [];
		for (const entry of entries) nodeMap.set(entry.id, {
			entry,
			children: [],
			label: this.labelsById.get(entry.id),
			labelTimestamp: this.labelTimestampsById.get(entry.id)
		});
		for (const entry of entries) {
			const node = nodeMap.get(entry.id);
			const parentId = this.resolveCanonicalParentId(entry.parentId);
			if (parentId === null || parentId === entry.id) roots.push(node);
			else {
				const parent = nodeMap.get(parentId);
				if (parent) parent.children.push(node);
				else roots.push(node);
			}
		}
		const stack = [...roots];
		while (stack.length > 0) {
			const node = stack.pop();
			node.children.sort((left, right) => new Date(left.entry.timestamp).getTime() - new Date(right.entry.timestamp).getTime());
			stack.push(...node.children);
		}
		return roots;
	}
	getLeafId() {
		this.assertTranscriptViewAvailable();
		return this.leafId;
	}
	getLeafEntry() {
		this.assertTranscriptViewAvailable();
		return this.leafId ? this.getEntry(this.leafId) : void 0;
	}
	getEntry(id) {
		this.assertTranscriptViewAvailable();
		const entry = this.byId.get(id);
		return entry ? this.normalizeEntryParent(entry) : void 0;
	}
	getAppendParentId() {
		this.assertTranscriptViewAvailable();
		return this.appendParentId;
	}
	getAppendMode() {
		this.assertTranscriptViewAvailable();
		return this.appendMode;
	}
	getPersistedFileEntries(leafAppendParentId = this.appendParentId, leafAppendMode) {
		this.assertTranscriptViewAvailable();
		this.clampOpaqueFileEntryIndexes();
		const entries = [];
		let opaqueIndex = 0;
		for (let index = 0; index <= this.fileEntries.length; index += 1) {
			while (this.opaqueFileEntries[opaqueIndex]?.index === index) {
				entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
				opaqueIndex += 1;
			}
			const entry = this.fileEntries[index];
			if (entry) entries.push(entry);
		}
		while (opaqueIndex < this.opaqueFileEntries.length) {
			entries.push(this.opaqueFileEntries[opaqueIndex]?.record);
			opaqueIndex += 1;
		}
		let persistedLeafId = null;
		let persistedAppendParentId = null;
		let rawTailId = null;
		for (const entry of entries) {
			const leafEntry = parseOpaqueLeafEntry(entry);
			if (leafEntry) {
				rawTailId = leafEntry.id;
				if (this.invalidLeafControlIds.has(leafEntry.id)) continue;
				const targetId = this.resolveOpaqueLeafTargetId(leafEntry.targetId);
				persistedLeafId = targetId;
				persistedAppendParentId = leafEntry.appendParentId === void 0 ? targetId : this.resolveOpaqueAppendParentId(leafEntry.appendParentId);
				continue;
			}
			if (isIndexedSessionEntry(entry)) {
				persistedLeafId = entry.id;
				persistedAppendParentId = entry.id;
				rawTailId = entry.id;
				continue;
			}
			const opaqueLink = parseParentLinkedOpaqueEntry(entry);
			if (opaqueLink) {
				persistedAppendParentId = opaqueLink.id;
				rawTailId = opaqueLink.id;
			}
		}
		if (persistedLeafId !== this.leafId || persistedAppendParentId !== this.appendParentId) {
			const leafEntry = this.createLeafControl(rawTailId, leafAppendParentId, leafAppendMode);
			this.rememberLeafControl(leafEntry);
			entries.push(leafEntry);
		}
		return entries;
	}
	getPersistedEntries() {
		return this.getPersistedFileEntries();
	}
	clearPreservedOpaqueFileEntries() {
		this.assertTranscriptViewAvailable();
		this.opaqueFileEntries = [];
		this.opaqueParentsById.clear();
		this.invalidLeafControlIds.clear();
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = false;
	}
	/** No buffered writes remain here; asynchronous metadata methods own their settlement. */
	flushPendingPersistence() {}
	invalidateTranscriptView(error) {
		this.transcriptViewFailure = error;
		this.transcriptVersion = void 0;
	}
	assertTranscriptViewAvailable() {
		if (this.transcriptViewFailure) throw this.transcriptViewFailure;
	}
	getBranch(fromId) {
		this.assertTranscriptViewAvailable();
		return super.getBranch(fromId);
	}
	isPersisted() {
		return this.persistenceTarget !== void 0;
	}
	getCwd() {
		return this.cwd;
	}
	getSessionId() {
		return this.sessionId;
	}
	getSessionTarget() {
		const target = this.persistenceTarget;
		return target ? {
			...target,
			...target.env ? { env: { ...target.env } } : {}
		} : void 0;
	}
};
//#endregion
//#region src/agents/sessions/session-manager-persistence.ts
function isSqliteTranscriptMutationConflict(error) {
	let current = error;
	for (let depth = 0; depth < 3 && current instanceof Error; depth += 1) {
		if (current.name === "SqliteTranscriptMutationConflictError") return true;
		current = current.cause;
	}
	return false;
}
var SessionManagerPersistence = class extends SessionManagerCore {
	#initialWriter;
	retainTranscriptWriter() {
		const sessionTarget = this.persistenceTarget;
		if (sessionTarget && getOwnedSessionTranscriptWriterFence({ sessionTarget })) this.#initialWriter ??= getOwnedSessionTranscriptInitialWriter({ sessionTarget });
	}
	assertTranscriptWriteActive() {
		this.assertTranscriptViewAvailable();
		if (!this.persistenceTarget) return;
		const scope = this.persistenceTarget;
		const inheritedWriter = getOwnedSessionTranscriptInitialWriter({ sessionTarget: scope });
		this.#initialWriter ??= inheritedWriter;
		const initialWriter = this.#initialWriter;
		if (!initialWriter) return;
		initialWriter.assertActive();
		if (!initialWriter.committedFence && inheritedWriter !== initialWriter) throw new SessionTranscriptWriterClaimReboundError();
		Object.assign(scope, initialWriter.committedFence ?? {
			expectedLifecycleRevision: void 0,
			expectedWriterRunId: initialWriter.writerRunId
		});
	}
	async persistMetadataRecord(entry, appendIntent, writeAdmission) {
		this.assertTranscriptWriteActive();
		const target = this.persistenceTarget;
		if (!target) throw new Error("Metadata worker requires a persistent session");
		const identity = { ...target };
		const sessionId = this.getSessionId();
		const { database, options } = writeAdmission;
		const { env: _env, ...writeTarget } = withOwnedSessionTranscriptWriterFence(target);
		const captured = {
			...writeTarget,
			storePath: database.path
		};
		if (database.db.isTransaction) throw new Error("Asynchronous session metadata writes must own their transaction");
		const initialWriter = this.#initialWriter;
		const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
		const assertBinding = () => {
			const current = this.persistenceTarget;
			if (this.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(identity, current)) throw new SessionTranscriptWriterClaimReboundError();
		};
		const assertCurrent = () => {
			assertBinding();
			initialWriter?.assertActive();
			assertOwned();
		};
		const admission = resolveSessionTranscriptReadFence(captured);
		const { withSessionMetadataWorker } = await runInDetachedAsyncContext(() => import("./session-manager-metadata-runtime-MrzOCkMW.mjs"));
		assertCurrent();
		return await withSessionMetadataWorker(options, database, assertCurrent, async (worker) => {
			if (this.persistenceHeaderPending || initialWriter && !initialWriter.committedFence) {
				const committed = await worker.execute({
					type: "session.metadata.initialize",
					input: {
						scope: captured,
						entry: {
							sessionId: captured.sessionId,
							updatedAt: Date.now()
						},
						...initialWriter && !initialWriter.committedFence ? { initialWriterRunId: initialWriter.writerRunId } : {}
					}
				});
				try {
					if (committed.fence) {
						initialWriter?.recordCommitted(committed.fence);
						Object.assign(target, committed.fence);
						Object.assign(captured, committed.fence);
					}
				} finally {
					if (committed.identity) publishCommittedSessionIdentity(captured.agentId, committed.identity.previous, committed.identity.current);
				}
				if (!committed.owned) {
					if (captured.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
					throw new Error("Session transcript header was not persisted");
				}
				assertCurrent();
			}
			const appendEvent = async (event, expectedMutationAt, intent) => {
				const result = await worker.execute({
					type: "session.metadata.append",
					input: {
						scope: captured,
						event,
						options: {
							...intent ? { appendIntent: intent } : {},
							...expectedMutationAt !== void 0 ? { expectedMutationAt } : {}
						},
						...event.type !== "session" ? { view: {
							loadedVersion: this.transcriptVersion,
							limits: this.boundedContextLimits,
							admission
						} } : {}
					}
				});
				if (result.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
					...options,
					preferredSessionId: captured.sessionId
				});
				return result;
			};
			let loadedVersion = this.transcriptVersion;
			const append = async (expectedMutationAt) => {
				let mutationAt = expectedMutationAt;
				if (this.persistenceHeaderPending) {
					const header = this.fileEntries[0];
					if (!header || header.type !== "session") throw new Error("Session transcript header was not persisted");
					const committed = requireTranscriptEventAppendSnapshot((await appendEvent(header, mutationAt)).snapshot, "Session transcript header was not persisted");
					assertBinding();
					this.transcriptVersion = committed.after;
					this.transcriptMutationAt = committed.after.updatedAt;
					this.persistenceHeaderPending = false;
					mutationAt = committed.after.updatedAt;
				}
				loadedVersion = this.transcriptVersion;
				const outcome = await appendEvent(entry, mutationAt, appendIntent);
				return {
					committed: requireTranscriptEventAppendSnapshot(outcome.snapshot, `Session transcript entry was not persisted: ${entry.id}`),
					reload: outcome.reload
				};
			};
			let outcome;
			try {
				outcome = await append(this.transcriptMutationAt);
			} catch (error) {
				if (!isSqliteTranscriptMutationConflict(error)) throw error;
				outcome = await append(await worker.execute({
					type: "session.metadata.mutation",
					input: { scope: captured }
				}));
			}
			const { committed, reload } = outcome;
			const effectiveParentId = committed.result.effectiveParentId !== void 0 ? committed.result.effectiveParentId : entry.parentId;
			const reloadAfterAppend = loadedVersion !== void 0 && (committed.before.generation !== loadedVersion.generation || committed.before.rawSeq !== loadedVersion.rawSeq);
			let viewFailure;
			if (reload?.ok === false) {
				const error = /* @__PURE__ */ new Error("Committed session metadata view could not be reconstructed");
				if (reload.error) retainOpenClawStateWorkerErrorPayload(error, reload.error);
				viewFailure = hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
			}
			return {
				result: {
					appended: true,
					effectiveParentId,
					...reloadAfterAppend ? { reloadAfterAppend: true } : {}
				},
				reload: reload?.ok ? reload.value : void 0,
				committedVersion: committed.after,
				viewFailure
			};
		});
	}
	persistRecord(entry, options, preparedMessage) {
		if (this.persistenceTarget) return this.persistSqliteRecord(entry, options, preparedMessage);
		if (getSessionCompactionPersistence(this)) throw new Error("Compaction boundary validation failed");
	}
	persist(entry, options) {
		return this.persistRecord(entry, options);
	}
	persistSqliteRecord(entry, options, preparedMessage) {
		if (!this.persistenceTarget) return;
		this.assertTranscriptWriteActive();
		const scope = this.persistenceTarget;
		const initialWriter = this.#initialWriter;
		const persistCompaction = getSessionCompactionPersistence(this);
		if (persistCompaction && isIndexedSessionEntry(entry) && entry.type === "compaction") {
			if (this.persistenceHeaderPending) throw new Error("Compaction boundary validation failed");
			const loadedVersion = this.transcriptVersion;
			const expectedMutationAt = options?.expectedMutationAt !== void 0 ? options.expectedMutationAt : this.transcriptMutationAt;
			const committed = persistCompaction({
				scope: { ...scope },
				event: entry,
				...options?.appendIntent ? { appendIntent: options.appendIntent } : {},
				...expectedMutationAt !== void 0 ? { expectedMutationAt } : {},
				...initialWriter && !initialWriter.committedFence ? { initializeEntry: true } : {}
			});
			if (initialWriter?.committedFence) Object.assign(scope, initialWriter.committedFence);
			this.transcriptVersion = committed.after;
			this.transcriptMutationAt = committed.after.updatedAt;
			const reloadAfterAppend = loadedVersion !== void 0 && (committed.before.generation !== loadedVersion.generation || committed.before.rawSeq !== loadedVersion.rawSeq);
			return {
				appended: true,
				effectiveParentId: committed.result.parentId,
				...reloadAfterAppend ? { reloadAfterAppend: true } : {}
			};
		}
		if (this.persistenceHeaderPending || initialWriter && !initialWriter.committedFence) {
			if (!ensureSessionEntrySync(scope, {
				sessionId: scope.sessionId,
				updatedAt: Date.now()
			})) throw new Error("Session transcript header was not persisted");
			initialWriter?.assertActive();
			if (initialWriter?.committedFence) Object.assign(scope, initialWriter.committedFence);
		}
		const persistedHeader = this.persistenceHeaderPending;
		if (persistedHeader) {
			const header = this.fileEntries[0];
			if (!header || header.type !== "session") throw new Error("Session transcript header was not persisted");
			this.transcriptVersion = requireTranscriptEventAppendSnapshot(appendTranscriptEventSnapshotSync(scope, header, options?.expectedMutationAt !== void 0 ? { expectedMutationAt: options.expectedMutationAt } : this.transcriptMutationAt !== void 0 ? { expectedMutationAt: this.transcriptMutationAt } : {}), "Session transcript header was not persisted").after;
			this.transcriptMutationAt = this.transcriptVersion.updatedAt;
			this.persistenceHeaderPending = false;
		}
		const expectedMutationAt = persistedHeader ? this.transcriptMutationAt : options?.expectedMutationAt !== void 0 ? options.expectedMutationAt : this.transcriptMutationAt;
		const leafEntry = parseOpaqueLeafEntry(entry);
		if (leafEntry) {
			this.transcriptVersion = requireTranscriptEventAppendSnapshot(appendTranscriptEventSnapshotSync(scope, entry, expectedMutationAt !== void 0 ? { expectedMutationAt } : {}), `Session transcript leaf control was not persisted: ${leafEntry.id}`).after;
			this.transcriptMutationAt = this.transcriptVersion.updatedAt;
			return;
		}
		if (!isIndexedSessionEntry(entry)) return;
		if (entry.type !== "message") {
			const loadedVersion = this.transcriptVersion;
			const outcome = appendTranscriptEventSnapshotSync(scope, entry, {
				...options?.appendIntent === "active-branch" ? { appendIntent: options.appendIntent } : {},
				...expectedMutationAt !== void 0 ? { expectedMutationAt } : {}
			});
			const committed = requireTranscriptEventAppendSnapshot(outcome, `Session transcript entry was not persisted: ${entry.id}`);
			const effectiveParentId = committed.result.effectiveParentId !== void 0 ? committed.result.effectiveParentId : entry.parentId;
			this.transcriptVersion = committed.after;
			this.transcriptMutationAt = this.transcriptVersion.updatedAt;
			const reloadAfterAppend = loadedVersion !== void 0 && (committed.before.generation !== loadedVersion.generation || committed.before.rawSeq !== loadedVersion.rawSeq);
			return effectiveParentId === entry.parentId && !reloadAfterAppend ? void 0 : {
				appended: true,
				effectiveParentId,
				...reloadAfterAppend ? { reloadAfterAppend: true } : {}
			};
		}
		const appendOptions = copyCodeModeSourceAppendOptions(options, {
			cwd: this.cwd,
			eventId: entry.id,
			...options?.beforeFreshMessageCommit ? { beforeFreshMessageCommit: options.beforeFreshMessageCommit } : {},
			...options?.config ? { config: options.config } : {},
			...options?.idempotencyLookup ? { idempotencyLookup: options.idempotencyLookup } : {},
			...expectedMutationAt !== void 0 ? { expectedMutationAt } : {},
			message: entry.message,
			now: Date.parse(entry.timestamp),
			parentId: entry.parentId,
			...options?.appendIntent === "active-branch" ? { appendIntent: options.appendIntent } : {}
		});
		const loadedVersion = this.transcriptVersion;
		const outcome = appendTranscriptMessageSnapshotSync(scope, appendOptions, preparedMessage);
		if (!outcome.ok) throw new Error(`Session transcript message was not persisted: ${entry.id}`, { cause: outcome.error });
		const result = outcome.value.result;
		this.transcriptVersion = outcome.value.after;
		if (!result) throw new Error(`Session transcript message was not persisted: ${entry.id}`);
		if (result.appended) this.transcriptMutationAt = outcome.value.after.updatedAt;
		entry.message = result.message;
		if (result.messageId !== entry.id) {
			if ((entry.message.role === "user" && "idempotencyKey" in entry.message && typeof entry.message.idempotencyKey === "string" && entry.message.idempotencyKey.length > 0 ? entry.message.idempotencyKey : void 0) && options?.idempotencyLookup !== "caller-checked") {
				if (!result.anchor) throw new Error(`Session transcript anchor was not returned: ${result.messageId}`);
				return {
					adoptedMessageId: result.messageId,
					anchor: result.anchor,
					appended: result.appended,
					effectiveParentId: result.effectiveParentId ?? null
				};
			}
			throw new Error(`Session transcript parent entry was not persisted: ${entry.id}`);
		}
		if (options?.idempotencyLookup === "caller-checked" && (!result?.appended || result.messageId !== entry.id)) throw new Error(`Session transcript append was not persisted: ${entry.id}`);
		if (result.effectiveParentId === void 0) throw new Error(`Session transcript append parent was not returned: ${entry.id}`);
		const reloadAfterAppend = result.appended && loadedVersion !== void 0 && (outcome.value.before.generation !== loadedVersion.generation || outcome.value.before.rawSeq !== loadedVersion.rawSeq);
		return {
			...result.anchor ? { anchor: result.anchor } : {},
			lifecycleRevision: outcome.value.lifecycleRevision,
			appended: result.appended,
			effectiveParentId: result.effectiveParentId,
			...reloadAfterAppend ? { reloadAfterAppend: true } : {}
		};
	}
};
//#endregion
//#region src/agents/sessions/session-manager-suffix-persistence.ts
var SessionManagerSuffixPersistence = class SessionManagerSuffixPersistence extends SessionManagerPersistence {
	removeTrailingEntries(predicate, options) {
		this.assertTranscriptWriteActive();
		const activeBranch = this.getBranch();
		let candidatePreservedStart = activeBranch.length;
		while (candidatePreservedStart > 0) {
			const entry = activeBranch[candidatePreservedStart - 1];
			if (!entry || !options?.preserveTrailing?.(entry)) break;
			candidatePreservedStart -= 1;
		}
		const removableEntryIds = /* @__PURE__ */ new Set();
		let candidateRemoveStart = candidatePreservedStart;
		while (candidateRemoveStart > 0) {
			const entry = activeBranch[candidateRemoveStart - 1];
			if (!entry || !predicate(entry)) break;
			removableEntryIds.add(entry.id);
			candidateRemoveStart -= 1;
		}
		if (candidateRemoveStart === candidatePreservedStart) return 0;
		if (this.boundedContextIncomplete && candidateRemoveStart === 0 && this.persistenceTarget && this.persistedSuffixStartSeq !== void 0) {
			const previousEntry = readPreviousIndexedTranscriptEventSync(this.persistenceTarget, this.persistedSuffixStartSeq)?.event;
			if (previousEntry && predicate(previousEntry)) throw new RangeError("Bounded transcript cleanup cannot cross the hydrated removal window");
		}
		if (this.persistenceTarget && this.transcriptMutationAt !== void 0) {
			if (readTranscriptMutationAtSync(this.persistenceTarget) !== this.transcriptMutationAt) throw new Error(`SQLite transcript changed while preparing suffix removal for ${this.persistenceTarget.sessionId}`);
		}
		const candidate = activeBranch[candidateRemoveStart];
		const persistedSuffixStartSeq = (this.persistenceTarget && isIndexedSessionEntry(candidate) ? readTranscriptIdentityByEventId(openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptReadScope(this.persistenceTarget))), this.persistenceTarget.sessionId, candidate.id)?.seq : void 0) ?? this.persistedSuffixStartSeq;
		const current = new SessionManagerSuffixPersistence(this.cwd, void 0, this.fileEntries, void 0, this.transcriptMutationAt);
		current.opaqueFileEntries = this.opaqueFileEntries.map((entry) => ({ ...entry }));
		current.buildIndex();
		current.leafId = this.leafId;
		current.appendParentId = this.appendParentId;
		current.appendMode = this.appendMode;
		const currentEntries = current.getPersistedFileEntries();
		const candidatePersistedIndex = currentEntries.findIndex((entry) => isRecord(entry) && entry.id === candidate?.id);
		const retainedCustomData = new Map(this.boundedContextIncomplete && candidatePersistedIndex >= 0 ? currentEntries.slice(candidatePersistedIndex, candidatePersistedIndex + SYNC_REBUILD_MAX_ROWS).flatMap((entry) => isRecord(entry) && entry.type === "custom" && typeof entry.id === "string" && entry.data !== void 0 ? [[entry.id, entry.data]] : []) : []);
		let retainedCustomDataIds = [...retainedCustomData.keys()];
		const restoreCustomData = (entry) => isRecord(entry) && entry.type === "custom" && typeof entry.id === "string" && retainedCustomData.has(entry.id) ? {
			...entry,
			data: retainedCustomData.get(entry.id)
		} : entry;
		let retainedContextPrefix = persistedSuffixStartSeq !== void 0 && candidatePersistedIndex >= 0 ? currentEntries.slice(0, candidatePersistedIndex) : [];
		let expectedPersistedEntries = currentEntries;
		let useFullTranscriptFallback = false;
		if (this.persistenceTarget && persistedSuffixStartSeq !== void 0) try {
			expectedPersistedEntries = loadTranscriptSuffixEventsBoundedSync(this.persistenceTarget, persistedSuffixStartSeq, {
				maxBytes: SYNC_REBUILD_MAX_BYTES,
				maxEvents: SYNC_REBUILD_MAX_ROWS,
				retainedCustomDataIds
			});
			const projectedIds = new Set(expectedPersistedEntries.flatMap((entry) => isRecord(entry) && entry.type === "custom" && typeof entry.id === "string" && !Object.hasOwn(entry, "data") ? [entry.id] : []));
			retainedCustomDataIds = retainedCustomDataIds.filter((id) => projectedIds.has(id));
		} catch (error) {
			const exceededPlanningLimit = error instanceof Error && error.message.startsWith("Transcript suffix exceeds synchronous planning ");
			if (this.boundedContextIncomplete || !exceededPlanningLimit) throw error;
			retainedContextPrefix = [];
			expectedPersistedEntries = currentEntries;
			useFullTranscriptFallback = true;
		}
		const preparedEntries = [...retainedContextPrefix, ...expectedPersistedEntries];
		const prepared = new SessionManagerSuffixPersistence(this.cwd, void 0, preparedEntries, void 0, this.transcriptMutationAt);
		const restoreOmittedParentAncestry = () => {
			for (const [id, parentId] of this.opaqueParentsById) if (!prepared.byId.has(id) && !prepared.opaqueParentsById.has(id)) prepared.opaqueParentsById.set(id, parentId);
		};
		restoreOmittedParentAncestry();
		prepared.leafId = this.leafId;
		prepared.appendParentId = this.appendParentId;
		prepared.appendMode = this.appendMode;
		const removableIndexes = [];
		const removedEntries = [];
		for (let index = 1; index < prepared.fileEntries.length; index += 1) {
			const entry = prepared.fileEntries[index];
			if (isIndexedSessionEntry(entry) && removableEntryIds.has(entry.id)) {
				removableIndexes.push(index);
				removedEntries.push(entry);
			}
		}
		if (removableIndexes.length !== removableEntryIds.size) throw new Error(`SQLite session changed before trimming ${this.sessionId}`);
		const shiftOpaqueIndexesAfterRemoval = (start, count) => {
			for (const opaqueEntry of prepared.opaqueFileEntries) {
				const removedBeforeOpaque = Math.max(0, Math.min(count, opaqueEntry.index - start));
				opaqueEntry.index -= removedBeforeOpaque;
			}
		};
		const removeStart = removableIndexes[0];
		if (removeStart === void 0) return 0;
		const localPersistedPrefixLength = removeStart + prepared.opaqueFileEntries.filter((entry) => entry.index < removeStart).length;
		const preparedSuffixOffset = retainedContextPrefix.length;
		const persistedPrefixLength = useFullTranscriptFallback ? 0 : persistedSuffixStartSeq ?? Math.max(0, localPersistedPrefixLength - preparedSuffixOffset);
		const persistedBoundaryCount = this.persistedBoundaryCount;
		const removedBoundaryCount = removedEntries.filter((entry) => entry.type === "compaction" || entry.type === "reset").length;
		const removedParentById = new Map(removedEntries.map((entry) => [entry.id, entry.parentId]));
		const removedEntryIds = new Set(removableEntryIds);
		for (let index = removeStart; index < prepared.fileEntries.length; index += 1) {
			const entry = prepared.fileEntries[index];
			if (isIndexedSessionEntry(entry) && entry.type === "label" && removedEntryIds.has(entry.targetId)) {
				removedEntryIds.add(entry.id);
				removedParentById.set(entry.id, entry.parentId);
			}
		}
		for (let index = prepared.fileEntries.length - 1; index >= removeStart; index -= 1) {
			const entry = prepared.fileEntries[index];
			if (!isIndexedSessionEntry(entry) || !removedEntryIds.has(entry.id)) continue;
			shiftOpaqueIndexesAfterRemoval(index, 1);
			prepared.fileEntries.splice(index, 1);
		}
		const resolveRetainedParentId = (parentId) => {
			const seen = /* @__PURE__ */ new Set();
			let currentId = parentId;
			while (currentId && removedParentById.has(currentId) && !seen.has(currentId)) {
				seen.add(currentId);
				currentId = removedParentById.get(currentId) ?? null;
			}
			return currentId;
		};
		const replacementParentId = resolveRetainedParentId(removedEntries[0]?.parentId ?? null);
		prepared.fileEntries = prepared.fileEntries.map((entry) => {
			if (!isIndexedSessionEntry(entry)) return entry;
			const parentId = resolveRetainedParentId(entry.parentId);
			return parentId === entry.parentId ? entry : {
				...entry,
				parentId
			};
		});
		prepared.opaqueFileEntries = prepared.opaqueFileEntries.map((opaqueEntry) => {
			if (!isRecord(opaqueEntry.record)) return opaqueEntry;
			const record = opaqueEntry.record;
			const parentId = record.parentId === null || typeof record.parentId === "string" ? resolveRetainedParentId(record.parentId) : void 0;
			const leafEntry = parseOpaqueLeafEntry(record);
			const targetId = leafEntry ? resolveRetainedParentId(leafEntry.targetId) : void 0;
			const appendParentId = leafEntry?.appendParentId !== void 0 ? resolveRetainedParentId(leafEntry.appendParentId) : void 0;
			if ((parentId === void 0 || parentId === record.parentId) && (targetId === void 0 || targetId === leafEntry?.targetId) && (appendParentId === void 0 || appendParentId === leafEntry?.appendParentId)) return opaqueEntry;
			return {
				...opaqueEntry,
				record: {
					...record,
					...parentId !== void 0 ? { parentId } : {},
					...targetId !== void 0 ? { targetId } : {},
					...appendParentId !== void 0 ? { appendParentId } : {}
				}
			};
		});
		prepared.clampOpaqueFileEntryIndexes();
		prepared.buildIndex();
		restoreOmittedParentAncestry();
		prepared.leafId = replacementParentId;
		prepared.appendParentId = replacementParentId;
		const events = prepared.getPersistedFileEntries(prepared.appendParentId, prepared.appendMode);
		const suffixEvents = preparedSuffixOffset > 0 ? events.slice(preparedSuffixOffset) : events;
		const incrementalPlanningBytes = [...expectedPersistedEntries, ...suffixEvents].reduce((sum, event) => sum + Buffer.byteLength(JSON.stringify(event), "utf8"), 0);
		if (!this.boundedContextIncomplete && (expectedPersistedEntries.length + suffixEvents.length > 4e3 || incrementalPlanningBytes > 4194304)) {
			expectedPersistedEntries = currentEntries;
			useFullTranscriptFallback = true;
		}
		const replacementEvents = useFullTranscriptFallback ? events.map(restoreCustomData) : suffixEvents;
		const adoptPrepared = (version) => {
			this.fileEntries = prepared.fileEntries.map(restoreCustomData);
			this.opaqueFileEntries = prepared.opaqueFileEntries;
			this.buildIndex();
			for (const [id, parentId] of prepared.opaqueParentsById) if (!this.byId.has(id) && !this.opaqueParentsById.has(id)) this.opaqueParentsById.set(id, parentId);
			this.leafId = prepared.leafId;
			this.appendParentId = prepared.appendParentId;
			this.appendMode = prepared.appendMode;
			this.pendingDeliberateAppend = prepared.pendingDeliberateAppend;
			this.boundedContextIncomplete = Boolean(this.boundedContextLimits && this.persistenceTarget);
			this.persistedBoundaryCount = persistedBoundaryCount === void 0 ? void 0 : Math.max(0, persistedBoundaryCount - removedBoundaryCount);
			this.persistedSuffixStartSeq = this.boundedContextIncomplete ? retainedContextPrefix.length > 0 ? this.persistedSuffixStartSeq : persistedSuffixStartSeq : void 0;
			this.transcriptVersion = version;
			this.transcriptMutationAt = version?.updatedAt;
		};
		if (this.persistenceTarget) {
			if (!replaceTranscriptSuffixEventsSync(this.persistenceTarget, expectedPersistedEntries, replacementEvents, useFullTranscriptFallback ? 0 : persistedPrefixLength, this.transcriptMutationAt, adoptPrepared, persistedSuffixStartSeq !== void 0 && !useFullTranscriptFallback, useFullTranscriptFallback ? [] : retainedCustomDataIds)) throw new Error(`SQLite session changed before trimming ${this.sessionId}`);
		} else adoptPrepared();
		return removedEntries.length;
	}
};
//#endregion
//#region src/agents/sessions/session-manager-entries.ts
function canonicalizeSessionEntry(entry) {
	return JSON.parse(JSON.stringify(entry));
}
var SessionManagerEntries = class extends SessionManagerSuffixPersistence {
	appendEntry(entry, options) {
		this.assertTranscriptViewAvailable();
		const canonicalEntry = canonicalizeSessionEntry(entry);
		if (!isIndexedSessionEntry(canonicalEntry)) throw new Error(`Invalid session transcript entry: ${entry.type}`);
		if (entry.type === "message" && canonicalEntry.type === "message") {
			if (entry.message.role === "toolResult" && canonicalEntry.message.role === "toolResult" && Array.isArray(entry.message.content) && Array.isArray(canonicalEntry.message.content)) {
				const canonicalContent = canonicalEntry.message.content;
				entry.message.content.forEach((block, index) => {
					const canonicalBlock = canonicalContent[index];
					if (block?.type === "text" && canonicalBlock?.type === "text") copyPreparedModelVisibleToolText(block, canonicalBlock);
				});
			}
			copyCodeModeSourceAppend(entry.message, canonicalEntry.message, getCodeModeSourceAppend(options), (source) => source);
		}
		const activeBranchAppend = !this.pendingDeliberateAppend && this.appendMode !== "side" && !isSessionTranscriptSideAppendEntry(canonicalEntry);
		const persistenceOptions = copyCodeModeSourceAppendOptions(options, {
			...options,
			...activeBranchAppend ? { appendIntent: "active-branch" } : {}
		});
		const preparedTurnAppend = activeBranchAppend && canonicalEntry.type === "message" && (canonicalEntry.message.role === "assistant" || canonicalEntry.message.role === "toolResult" || readNestedToolActivity(canonicalEntry.message) !== void 0);
		let attemptOptions = persistenceOptions;
		const admittedUserId = this.persistenceTarget ? resolveSessionTranscriptReadFence(this.persistenceTarget)?.entryId : void 0;
		if (preparedTurnAppend && this.persistenceTarget) {
			const validatedMutationAt = validatePreparedAssistantAppendSync(this.persistenceTarget, canonicalEntry.parentId, admittedUserId);
			if (validatedMutationAt === void 0) throw this.createTranscriptMutationConflictError();
			attemptOptions = copyCodeModeSourceAppendOptions(persistenceOptions, {
				...persistenceOptions,
				expectedMutationAt: validatedMutationAt
			});
		}
		const preparedMessage = this.persistenceTarget && canonicalEntry.type === "message" ? prepareTranscriptMessageAppend(copyCodeModeSourceAppendOptions(options, {
			message: canonicalEntry.message,
			config: options?.config
		}), {
			scope: this.persistenceTarget,
			envelope: {
				type: "message",
				id: canonicalEntry.id,
				parentId: canonicalEntry.parentId,
				timestamp: canonicalEntry.timestamp
			}
		}) : void 0;
		let persistenceResult;
		try {
			persistenceResult = this.persistRecord(canonicalEntry, attemptOptions, preparedMessage);
		} catch (error) {
			const deliberateBranchAppend = this.pendingDeliberateAppend;
			const sideBranchAppend = this.appendMode === "side" || isSessionTranscriptSideAppendEntry(canonicalEntry);
			const retryableExplicitParentAppend = deliberateBranchAppend || sideBranchAppend;
			if (!activeBranchAppend && !retryableExplicitParentAppend || !isSqliteTranscriptMutationConflict(error)) throw error;
			if (!(retryableExplicitParentAppend || canonicalEntry.type !== "message" || canonicalEntry.message.role === "user" || preparedTurnAppend)) throw error;
			const retryOptions = preparedTurnAppend ? (() => {
				const validatedMutationAt = this.persistenceTarget ? validatePreparedAssistantAppendSync(this.persistenceTarget, canonicalEntry.parentId, admittedUserId) : void 0;
				if (validatedMutationAt === void 0) throw error;
				return copyCodeModeSourceAppendOptions(persistenceOptions, {
					...persistenceOptions,
					expectedMutationAt: validatedMutationAt
				});
			})() : copyCodeModeSourceAppendOptions(persistenceOptions, {
				...persistenceOptions,
				expectedMutationAt: this.persistenceTarget ? readTranscriptMutationAtSync(this.persistenceTarget) : null
			});
			persistenceResult = this.persistRecord(canonicalEntry, retryOptions, preparedMessage);
		}
		return this.adoptPersistedEntry(canonicalEntry, persistenceResult, admittedUserId);
	}
	adoptPersistedEntry(canonicalEntry, persistenceResult, admittedUserId, preparedReload) {
		if (persistenceResult?.adoptedMessageId) {
			this.reloadPersistedTranscript();
			if (this.resolveCurrentTurnEntryId(isTalkRealtimeVoiceEntry) !== persistenceResult.adoptedMessageId) throw new Error(`Session transcript keyed user is outside the current turn: ${persistenceResult.adoptedMessageId}`);
			canonicalEntry.id = persistenceResult.adoptedMessageId;
		} else if (persistenceResult?.reloadAfterAppend || persistenceResult?.effectiveParentId !== void 0 && persistenceResult.effectiveParentId !== canonicalEntry.parentId) {
			if (admittedUserId) {
				if (this.transcriptMutationAt === void 0) throw new Error("Session transcript append mutation fence was not returned");
				if (preparedReload) this.adoptPreparedTranscriptReload(preparedReload, {
					expectedMutationAt: this.transcriptMutationAt,
					expectedEntryId: canonicalEntry.id,
					admittedUserId
				});
				else this.reloadPersistedTranscriptAfterAppend(this.transcriptMutationAt, canonicalEntry.id, admittedUserId);
			} else if (preparedReload) this.adoptPreparedTranscriptReload(preparedReload);
			else this.reloadPersistedTranscript();
		} else {
			if (!isSessionTranscriptSideAppendEntry(canonicalEntry) && canonicalEntry.parentId === this.appendParentId && this.leafId !== this.appendParentId) this.logicalParentsById.set(canonicalEntry.id, this.leafId);
			this.fileEntries.push(canonicalEntry);
			if (this.persistedBoundaryCount !== void 0 && (canonicalEntry.type === "compaction" || canonicalEntry.type === "reset")) this.persistedBoundaryCount += 1;
			this.byId.set(canonicalEntry.id, canonicalEntry);
			this.appendParentId = canonicalEntry.id;
			if (isSessionTranscriptSideAppendEntry(canonicalEntry)) this.appendMode = "side";
			else {
				this.leafId = canonicalEntry.id;
				this.appendMode = void 0;
			}
		}
		this.pendingDeliberateAppend = false;
		return {
			entry: canonicalEntry,
			anchor: persistenceResult?.anchor,
			lifecycleRevision: persistenceResult?.lifecycleRevision,
			appended: persistenceResult?.appended ?? true
		};
	}
	createTranscriptMutationConflictError() {
		const error = /* @__PURE__ */ new Error(`SQLite transcript changed while preparing rewrite for ${this.persistenceTarget?.sessionId ?? this.sessionId}`);
		error.name = "SqliteTranscriptMutationConflictError";
		return error;
	}
	resolveCurrentTurnEntryId(isInterruptedTail, options) {
		this.assertTranscriptViewAvailable();
		const includeOmitted = options?.includeOmittedCustomMessages === true;
		return resolveCurrentTurnEntryId({
			target: this.persistenceTarget,
			entries: this.byId,
			parentId: this.appendParentId,
			remainingAncestors: includeOmitted ? this.boundedContextLimits?.maxEvents ?? this.byId.size + this.opaqueParentsById.size : this.byId.size,
			isInterruptedTail
		}, includeOmitted);
	}
	[sessionManagerPrepareCurrentTurnReplay](isInterruptedTail, matchesUser, signal) {
		return prepareCurrentTurnReplayWitness(() => {
			this.assertTranscriptViewAvailable();
			return {
				target: this.persistenceTarget,
				version: this.transcriptVersion,
				entries: this.byId,
				parentId: this.appendParentId,
				remainingAncestors: this.boundedContextLimits?.maxEvents ?? this.byId.size + this.opaqueParentsById.size,
				isInterruptedTail
			};
		}, matchesUser, signal);
	}
	appendMessage(message, options) {
		return this.appendMessageWithTranscriptAnchor(message, options).entryId;
	}
	appendMessageWithTranscriptAnchor(message, options) {
		if (message.role === "assistant") applyAssistantDeliveryDirectives(message);
		if (options?.idempotencyLookup !== "caller-checked" && message.role === "user" && "idempotencyKey" in message && typeof message.idempotencyKey === "string" && message.idempotencyKey.length > 0) {
			const currentTurnId = this.resolveCurrentTurnEntryId();
			const current = currentTurnId ? this.byId.get(currentTurnId) : void 0;
			if (current?.type === "message" && current.message.role === "user" && "idempotencyKey" in current.message && current.message.idempotencyKey === message.idempotencyKey) {
				const anchor = this.persistenceTarget ? readActiveTranscriptEntryAnchor({
					...this.persistenceTarget,
					entryId: current.id
				}) : void 0;
				if (this.persistenceTarget && !anchor) throw new Error(`Session transcript anchor was not returned: ${current.id}`);
				return {
					entryId: current.id,
					message: current.message,
					...anchor ? { anchor } : {},
					appended: false
				};
			}
		}
		const entry = {
			type: "message",
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			message
		};
		const { entry: persisted, anchor, lifecycleRevision, appended } = this.appendEntry(entry, options);
		return {
			entryId: persisted.id,
			message: persisted.message,
			...anchor ? { anchor } : {},
			lifecycleRevision,
			appended
		};
	}
	async appendMetadataEntry(change) {
		const publication = captureSessionMetadataPublication(this, change);
		return await withSessionManagerWrite(this, async (admission) => {
			this.assertTranscriptViewAvailable();
			const entry = {
				...change,
				id: generateSessionEntryId(),
				parentId: this.appendParentId,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (!admission || isIncognitoSessionKey(this.persistenceTarget?.sessionKey)) {
				const appended = this.appendEntry(entry);
				return this.publishMetadataCommit({
					entry: appended.entry,
					version: this.transcriptVersion,
					target: publication.target
				}, publication.publish);
			}
			const canonical = canonicalizeSessionEntry(entry);
			if (!isIndexedSessionEntry(canonical) || canonical.type !== "model_change" && canonical.type !== "thinking_level_change") throw new Error(`Invalid session transcript entry: ${entry.type}`);
			const appendIntent = !this.pendingDeliberateAppend && this.appendMode !== "side" ? "active-branch" : void 0;
			const admittedUserId = this.persistenceTarget ? resolveSessionTranscriptReadFence(this.persistenceTarget)?.entryId : void 0;
			const committedTarget = publication.target;
			const { result, reload, committedVersion, viewFailure } = await this.persistMetadataRecord(canonical, appendIntent, admission);
			const commit = {
				entry: {
					...canonical,
					parentId: result?.effectiveParentId !== void 0 ? result.effectiveParentId : canonical.parentId
				},
				version: committedVersion,
				target: committedTarget
			};
			let failure;
			try {
				const currentTarget = this.getSessionTarget();
				if (!committedTarget || this.getSessionId() !== publication.sessionId || !sameSessionTranscriptTargetBinding(committedTarget, currentTarget)) {
					const rebound = new SessionTranscriptWriterClaimReboundError();
					throw viewFailure ? new AggregateError([rebound, viewFailure], "Committed metadata lost its view and binding", { cause: rebound }) : rebound;
				}
				if (viewFailure) throw viewFailure;
				this.transcriptVersion = committedVersion;
				this.transcriptMutationAt = committedVersion.updatedAt;
				this.adoptPersistedEntry(canonical, result, admittedUserId, reload);
			} catch (cause) {
				failure = { cause };
			}
			return this.publishMetadataCommit(commit, publication.publish, failure);
		});
	}
	publishMetadataCommit(commit, publish, failure) {
		const committedError = (cause) => new SessionMetadataCommittedError(commit.entry, commit.version, cause, commit.target);
		let error = failure ? committedError(failure.cause) : void 0;
		if (error) this.invalidateTranscriptView(error);
		try {
			publish(commit);
		} catch (cause) {
			error = committedError(error ? new AggregateError([error, cause], "Metadata view and state publication failed", { cause: error }) : cause);
			this.invalidateTranscriptView(error);
		}
		if (error) throw error;
		return commit.entry.id;
	}
	appendThinkingLevelChange(thinkingLevel) {
		return this.appendMetadataEntry({
			type: "thinking_level_change",
			thinkingLevel
		});
	}
	appendModelChange(provider, modelId) {
		return this.appendMetadataEntry({
			type: "model_change",
			provider,
			modelId
		});
	}
	appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook, metadata, tokensAfter) {
		const entry = {
			type: "compaction",
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			summary,
			firstKeptEntryId,
			tokensBefore,
			...tokensAfter !== void 0 ? { tokensAfter } : {},
			details,
			fromHook,
			...metadata?.runId || metadata?.itemId ? { __openclaw: metadata } : {}
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
	appendResetBoundary(reason, firstKeptEntryId) {
		const entry = {
			type: "reset",
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			reason,
			...firstKeptEntryId ? { firstKeptEntryId } : {}
		};
		this.appendEntry(entry);
		return entry.id;
	}
	appendCustomEntry(customType, data) {
		const entry = {
			type: "custom",
			customType,
			data,
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	appendSessionInfo(name) {
		const entry = {
			type: "session_info",
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			name: name.replace(/[\r\n]+/g, " ").trim()
		};
		this.appendEntry(entry);
		return entry.id;
	}
	appendCustomMessageEntry(customType, content, display, details) {
		const entry = {
			type: "custom_message",
			customType,
			content,
			display,
			details,
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	appendLeafControl(params) {
		this.assertTranscriptViewAvailable();
		if (params.targetId !== null && !this.byId.has(params.targetId)) throw new Error(`Entry ${params.targetId} not found`);
		if (params.appendParentId !== null && !this.byId.has(params.appendParentId) && !this.opaqueParentsById.has(params.appendParentId)) throw new Error(`Append parent ${params.appendParentId} not found`);
		const previousLeafId = this.leafId;
		this.leafId = params.targetId;
		const entry = this.createLeafControl(this.appendParentId, params.appendParentId, params.appendMode);
		this.leafId = previousLeafId;
		this.persistRecord(entry);
		this.rememberLeafControl(entry);
		this.leafId = params.targetId;
		this.appendParentId = params.appendParentId;
		this.appendMode = params.appendMode;
		this.pendingDeliberateAppend = false;
		return entry;
	}
	appendLabelChange(targetId, label) {
		this.assertTranscriptViewAvailable();
		if (!this.byId.has(targetId)) throw new Error(`Entry ${targetId} not found`);
		const entry = {
			type: "label",
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId,
			label
		};
		this.appendEntry(entry);
		if (label) {
			this.labelsById.set(targetId, label);
			this.labelTimestampsById.set(targetId, entry.timestamp);
		} else {
			this.labelsById.delete(targetId);
			this.labelTimestampsById.delete(targetId);
		}
		return entry.id;
	}
	buildSessionContext() {
		return buildSessionContext(this.getBranch());
	}
	branch(branchFromId) {
		this.assertTranscriptViewAvailable();
		if (!this.byId.has(branchFromId)) this.ensureCompletePersistedHistory();
		const branchTargetId = this.resolveBranchTargetId(branchFromId);
		if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
		this.leafId = branchTargetId;
		this.appendParentId = branchTargetId;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = true;
	}
	resetLeaf() {
		this.assertTranscriptViewAvailable();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = true;
	}
	branchWithSummary(branchFromId, summary, details, fromHook) {
		if (branchFromId !== null && !this.byId.has(branchFromId)) this.ensureCompletePersistedHistory();
		const branchTargetId = branchFromId === null ? null : this.resolveBranchTargetId(branchFromId);
		if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
		const entry = {
			type: "branch_summary",
			id: generateSessionEntryId(),
			parentId: branchTargetId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			fromId: branchTargetId ?? "root",
			summary,
			details,
			fromHook
		};
		this.appendEntry(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
};
//#endregion
//#region src/agents/sessions/session-manager-branching.ts
var SessionManagerBranching = class SessionManagerBranching extends SessionManagerEntries {
	collectBranchedSessionPath(leafId) {
		const opaqueById = /* @__PURE__ */ new Map();
		for (const opaqueEntry of this.opaqueFileEntries) {
			const link = parseOpaqueLeafEntry(opaqueEntry.record) ?? parseParentLinkedOpaqueEntry(opaqueEntry.record);
			if (link && isRecord(opaqueEntry.record)) opaqueById.set(link.id, opaqueEntry.record);
		}
		const reversedNodes = [];
		const seen = /* @__PURE__ */ new Set();
		let currentId = leafId;
		while (currentId && !seen.has(currentId)) {
			seen.add(currentId);
			const entry = this.byId.get(currentId);
			if (entry) {
				reversedNodes.push({
					type: "entry",
					entry
				});
				if (this.logicalParentsById.has(entry.id)) {
					let physicalId = entry.parentId;
					while (physicalId && !seen.has(physicalId)) {
						const physicalRecord = opaqueById.get(physicalId);
						if (!physicalRecord || !this.opaqueParentsById.has(physicalId)) break;
						seen.add(physicalId);
						reversedNodes.push({
							type: "opaque",
							id: physicalId,
							record: physicalRecord
						});
						physicalId = this.opaqueParentsById.get(physicalId) ?? null;
					}
					currentId = this.logicalParentsById.get(entry.id) ?? null;
				} else currentId = entry.parentId;
				continue;
			}
			const record = opaqueById.get(currentId);
			if (!record || !this.opaqueParentsById.has(currentId)) break;
			reversedNodes.push({
				type: "opaque",
				id: currentId,
				record
			});
			currentId = this.opaqueParentsById.get(currentId) ?? null;
		}
		const entries = [];
		const opaqueEntries = [];
		let tailId = null;
		for (const node of reversedNodes.toReversed()) {
			if (node.type === "entry") {
				if (node.entry.type === "label") continue;
				const branchEntry = {
					...node.entry,
					parentId: tailId
				};
				delete branchEntry.appendMode;
				entries.push(branchEntry);
				tailId = branchEntry.id;
				continue;
			}
			if (parseOpaqueLeafEntry(node.record)) continue;
			opaqueEntries.push({
				index: entries.length + 1,
				record: {
					...node.record,
					parentId: tailId
				}
			});
			tailId = node.id;
		}
		return {
			entries,
			opaqueEntries,
			tailId
		};
	}
	async createBranchedSession(leafId) {
		this.assertTranscriptWriteActive();
		this.ensureCompletePersistedHistory();
		const previousSessionId = this.sessionId;
		const branchPath = this.collectBranchedSessionPath(leafId);
		if (branchPath.entries.length === 0) throw new Error(`Entry ${leafId} not found`);
		const newSessionId = createManagedSessionId();
		const timestamp = (/* @__PURE__ */ new Date()).toISOString();
		const persistenceTarget = this.persistenceTarget;
		const header = {
			type: "session",
			version: this.getHeader()?.version,
			id: newSessionId,
			timestamp,
			cwd: this.cwd,
			parentSession: persistenceTarget ? previousSessionId : void 0
		};
		const pathEntryIds = new Set(branchPath.entries.map((entry) => entry.id));
		const labelsToWrite = [];
		for (const [targetId, label] of this.labelsById) if (pathEntryIds.has(targetId)) labelsToWrite.push({
			targetId,
			label,
			timestamp: this.labelTimestampsById.get(targetId)
		});
		const labelEntries = [];
		let parentId = branchPath.tailId;
		for (const { targetId, label, timestamp: labelTimestamp } of labelsToWrite) {
			const labelEntry = {
				type: "label",
				id: generateSessionEntryId(),
				parentId,
				timestamp: labelTimestamp,
				targetId,
				label
			};
			labelEntries.push(labelEntry);
			parentId = labelEntry.id;
		}
		const branch = new SessionManagerBranching(this.cwd, void 0, [
			header,
			...branchPath.entries,
			...labelEntries
		]);
		branch.opaqueFileEntries = branchPath.opaqueEntries;
		branch.buildIndex();
		const adoptBranch = (target, version) => {
			this.fileEntries = branch.fileEntries;
			this.opaqueFileEntries = branch.opaqueFileEntries;
			this.sessionId = newSessionId;
			this.buildIndex();
			this.persistenceTarget = target;
			this.transcriptVersion = target ? version : void 0;
			this.transcriptMutationAt = target ? version?.updatedAt : void 0;
			this.persistenceHeaderPending = false;
		};
		if (persistenceTarget) await replaceSessionWithBranchedTranscript(persistenceTarget, {
			sessionId: newSessionId,
			events: branch.getPersistedFileEntries()
		}, adoptBranch, () => this.assertTranscriptWriteActive());
		else adoptBranch();
		return persistenceTarget ? newSessionId : void 0;
	}
};
//#endregion
//#region src/agents/sessions/session-manager.ts
var SessionManager = class SessionManager extends SessionManagerBranching {
	constructor(cwd, persistenceTarget, loadedEntries, boundedContext, transcriptMutationAt, version) {
		super(cwd, persistenceTarget, loadedEntries, boundedContext, transcriptMutationAt, version);
		this.retainTranscriptWriter();
	}
	/** Makes pending append-oriented persistence durable without rewriting committed entries. */
	flushPendingPersistence() {
		super.flushPendingPersistence();
	}
	appendMessage(message, options) {
		return super.appendMessage(message, options);
	}
	appendMessageWithTranscriptAnchor(message, options) {
		return super.appendMessageWithTranscriptAnchor(message, options);
	}
	/** Prepare off-store; publish the suffix and adopt memory at the same outer commit edge. */
	prepareTranscriptRewrite() {
		this.assertTranscriptWriteActive();
		const publish = this.persistenceTarget ? prepareTranscriptRewriteSync(this.persistenceTarget, this.appendParentId, () => this.assertTranscriptWriteActive(), this.transcriptVersion) : void 0;
		const prepared = SessionManager.inMemory(this.cwd);
		Object.assign(prepared, structuredClone(this.captureTranscriptView()));
		const initialEntryCount = prepared.fileEntries.length;
		const persistedBoundaryCount = prepared.persistedBoundaryCount;
		prepared.persistedBoundaryCount = void 0;
		const loadedBoundaryCount = prepared.getBoundaryCount();
		return {
			sessionManager: prepared,
			commit: (rewrittenEntryIds) => {
				const entries = prepared.fileEntries.slice(initialEntryCount).filter((entry) => entry.type !== "session");
				const sources = /* @__PURE__ */ new Map();
				for (const [sourceId, destination] of rewrittenEntryIds) {
					const source = this.byId.get(sourceId);
					if (!source) throw new Error("Transcript rewrite source is not in the loaded view");
					sources.set(destination, source);
				}
				const first = entries[0];
				const source = first && sources.get(first.id);
				const parentId = source ? this.boundedParentIds.get(source.id) : void 0;
				if (first?.parentId === null && parentId !== void 0) {
					first.parentId = parentId;
					prepared.boundedParentIds.set(first.id, first.parentId);
				}
				for (const entry of entries) entry.appendMode = "side";
				prepared.buildIndex();
				for (const [id, parent] of this.opaqueParentsById) prepared.opaqueParentsById.set(id, parent);
				for (const [id, parent] of this.logicalParentsById) prepared.logicalParentsById.set(id, parent);
				const last = entries.at(-1);
				const leaf = last ? prepared.appendLeafControl({
					targetId: last.id,
					appendParentId: last.id
				}) : void 0;
				if (persistedBoundaryCount !== void 0) prepared.persistedBoundaryCount = persistedBoundaryCount + prepared.getBoundaryCount() - loadedBoundaryCount;
				const adopt = (version = prepared.transcriptVersion) => {
					prepared.transcriptVersion = version;
					prepared.transcriptMutationAt = version?.updatedAt;
					Object.assign(this, prepared.captureTranscriptView());
				};
				if (publish) publish(leaf ? [...entries, leaf] : entries, sources, adopt);
				else adopt();
			}
		};
	}
	/** Opens an existing store off-thread; empty transcripts keep lazy header initialization. */
	static async openAsync(target, cwdOverride, contextLimits, signal) {
		if (contextLimits) return await SessionManager.openBoundedAsync(target, {
			...contextLimits,
			cwd: cwdOverride,
			signal
		});
		const hydration = prepareSessionTranscriptHydration(target, void 0, signal);
		const cwd = cwdOverride ?? process.cwd();
		const assertOwned = captureOwnedTranscriptWriteAssertion(hydration.target);
		assertOwned();
		const prepared = await hydration.read().catch((error) => {
			assertOwned();
			throw error;
		});
		signal?.throwIfAborted();
		assertOwned();
		hydration.assertCurrent();
		if (prepared.kind !== "full") throw new Error("Expected a full transcript snapshot");
		const entries = prepared.snapshot.events;
		const header = findSessionTranscriptHeader(entries);
		return new SessionManager(cwdOverride ?? header?.cwd ?? cwd, hydration.target, entries, void 0, prepared.snapshot.version.updatedAt, prepared.snapshot.version);
	}
	/** @deprecated Runtime callers should await openAsync. */
	static open(target, cwdOverride, contextLimits) {
		if (contextLimits) return SessionManager.openBounded(target, {
			...contextLimits,
			...cwdOverride !== void 0 ? { cwd: cwdOverride } : {}
		});
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const snapshot = loadTranscriptReadSnapshotSync(capturedTarget);
		const entries = snapshot.events;
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwdOverride ?? header?.cwd ?? process.cwd(), capturedTarget, entries, void 0, snapshot.version.updatedAt, snapshot.version);
	}
	/** @deprecated Runtime callers should await openBoundedAsync. */
	static openBounded(target, options) {
		const { cwd, onTruncated, ...limits } = options;
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const context = readSessionTranscriptBoundedActiveContextCore(capturedTarget, limits);
		if (context.truncated) onTruncated?.();
		const entries = context.events;
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwd ?? header?.cwd ?? process.cwd(), capturedTarget, entries, {
			...context,
			limits
		});
	}
	/** Reads an existing store's bounded view under the history worker's database custody. */
	static async openBoundedAsync(target, options) {
		const { cwd, onTruncated, signal, ...limits } = options;
		const fallbackCwd = cwd ?? process.cwd();
		const hydration = prepareSessionTranscriptHydration(target, limits, signal);
		const assertOwned = captureOwnedTranscriptWriteAssertion(hydration.target);
		assertOwned();
		const prepared = await hydration.read().catch((error) => {
			assertOwned();
			throw error;
		});
		signal?.throwIfAborted();
		assertOwned();
		hydration.assertCurrent();
		if (prepared.kind !== "bounded") throw new Error("Expected a bounded transcript snapshot");
		const context = prepared.snapshot;
		if (context.truncated) onTruncated?.();
		signal?.throwIfAborted();
		assertOwned();
		hydration.assertCurrent();
		const entries = context.events;
		const header = findSessionTranscriptHeader(entries);
		return new SessionManager(cwd ?? header?.cwd ?? fallbackCwd, hydration.target, entries, {
			...context,
			limits
		});
	}
	/** Detach the prepared bounded branch without retaining database custody. */
	static async openDetachedBoundedAsync(target, options) {
		const source = await SessionManager.openBoundedAsync(target, options);
		return SessionManager.fromSelectedEntries([source.getHeader(), ...source.getBranch()], source.getCwd());
	}
	/** @deprecated Runtime callers should await openDetachedBoundedAsync. */
	static openDetachedBounded(target, options) {
		const source = SessionManager.openBounded(target, options);
		return SessionManager.fromSelectedEntries([source.getHeader(), ...source.getBranch()], source.getCwd());
	}
	/** Detached model view: selected payloads plus lightweight ancestry, never raw replay evidence. */
	static openModelContext(target, options = {}) {
		const context = withSessionContextAdmission(target, options.admission, () => readSessionTranscriptModelContext(target, options.through, options.limits));
		return SessionManager.fromSelectedEntries(context.events, options.cwd);
	}
	/** The same detached model view, with durable transcript scanning off the event loop. */
	static async openModelContextAsync(target, options = {}) {
		const readTarget = { ...target };
		const receipt = options.admission ?? resolveSessionTranscriptReadFence(readTarget);
		const admission = receipt ? { ...receipt } : void 0;
		const through = options.through ? { ...options.through } : void 0;
		const limits = options.limits ? { ...options.limits } : void 0;
		options.signal?.throwIfAborted();
		const context = await withSessionContextAdmission(readTarget, admission, () => isIncognitoSessionKey(readTarget.sessionKey) ? readSessionTranscriptModelContext(readTarget, through, limits) : readSessionTranscriptModelContextAsync(readTarget, admission, options.signal, through, limits));
		options.signal?.throwIfAborted();
		if (admission) validateSessionTranscriptContextAdmission(readTarget, admission);
		else if (!through) validateSessionTranscriptContextVersion(readTarget, context.version);
		if (through) validateSessionTranscriptContextAnchor(readTarget, through);
		return SessionManager.fromSelectedEntries(context.events, options.cwd);
	}
	static fromSelectedEntries(contextEntries, cwd) {
		const entries = contextEntries;
		const header = entries.find((entry) => entry.type === "session");
		if (entries.length > 0) assertCurrentSessionTranscriptHeader(header);
		const manager = new SessionManager(cwd ?? header?.cwd ?? process.cwd(), void 0, entries);
		manager.adoptSelectedTranscriptPath(manager.appendParentId, [...manager.byId].map(([id, entry]) => [id, entry.parentId]));
		return manager;
	}
	/** Synchronously consumes full-fidelity context; its iterator closes with the read snapshot. */
	static readSessionContext(target, read, options = {}) {
		return withSessionContextAdmission(target, options.admission, () => readSessionTranscriptContextMessages(target, read));
	}
	/** Appends to the current transcript leaf without hydrating its history. */
	static appendMessageToTranscript(target, message, options) {
		const outcome = appendTranscriptMessageSync(target, {
			cwd: process.cwd(),
			message,
			...options?.config ? { config: options.config } : {}
		});
		if (!outcome.ok) throw new Error("Session transcript message was not persisted", { cause: outcome.error });
		const result = outcome.value;
		if (!result) throw new Error("Session transcript message was not persisted");
		return result.messageId;
	}
	static inMemory(cwd = process.cwd()) {
		return new SessionManager(cwd);
	}
	static fromEntries(entries, cwdOverride) {
		return SessionManager.fromOwnedEntries(structuredClone(entries), cwdOverride);
	}
	static fromOwnedEntries(entries, cwdOverride) {
		const fileEntries = entries;
		const header = fileEntries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwdOverride ?? header?.cwd ?? process.cwd(), void 0, fileEntries);
	}
};
//#endregion
export { sessionManagerPrepareCurrentTurnReplay as i, withSessionCompactionPersistence as n, SessionMetadataCommittedError as r, SessionManager as t };

import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { c as partitionSessionFileEntries, i as isIndexedSessionEntry, o as parseOpaqueLeafEntry, r as findSessionTranscriptHeader, s as parseParentLinkedOpaqueEntry, t as assertCurrentSessionTranscriptHeader } from "./session-entry-codec-DSMJ1XFN.mjs";
import { a as prepareTranscriptPayloadForReuse } from "./transcript-payload-Cu49oQKq.mjs";
import { i as sameSessionTranscriptTargetBinding, n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { o as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { r as isSessionTranscriptSideAppendEntry } from "./transcript-tree-D61jhi_i.mjs";
import { t as buildSessionContext } from "./session-BEAHkH3E.mjs";
import "./messages-Cdi_z_94.mjs";
import { a as walkSessionCurrentTurn, i as resolveOpaqueSessionFirstKeptEntryId, n as SessionEntryNavigation } from "./session-model-context-read-3qrBOsBk.mjs";
import { r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE } from "./internal-runtime-context-DLJtDQoI.mjs";
import { a as transcriptEventContextEligibility } from "./session-transcript-projection-append-DGPoJ8qL.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-Da7SpARz.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { s as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as withSessionContextAdmission, n as resolveSessionTranscriptReadFence, t as captureSessionTranscriptQuestionAnswers } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { g as targetDiscoveryLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { n as SYNC_REBUILD_MAX_ROWS, t as SYNC_REBUILD_MAX_BYTES } from "./session-transcript-index-BTr4by8J.mjs";
import { i as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as sanitizeTranscriptMessageForStorage } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { C as readTranscriptIdentityByEventId, D as validatePreparedAssistantAppendSync, f as loadTranscriptReadSnapshotSync, g as readTranscriptEventAtSeqSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { i as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { n as readSessionTranscriptModelContext, t as readSessionTranscriptContextMessages } from "./session-accessor.sqlite-model-context-BymThP-K.mjs";
import { a as captureSessionMetadataPublication, c as getOwnedSessionTranscriptInitialWriter, h as withOwnedSessionTranscriptWriterFence, i as captureOwnedTranscriptWriteAssertion, l as getOwnedSessionTranscriptReader, n as assertSessionTranscriptInitialWriter, s as getOwnedSessionTranscriptActor, u as getOwnedSessionTranscriptWriterFence, y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { n as ensureSessionEntrySync } from "./session-accessor.sqlite-initial-entry-B00nO36i.mjs";
import { n as requireTranscriptEventAppendSnapshot } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { a as normalizeTranscriptJsonValue, i as isOwnedTranscriptPayload, n as prepareTranscriptMessageAppend, r as prepareTranscriptMessageAppendForWorker } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { a as appendTranscriptMessageSync, i as appendTranscriptMessageSnapshotSync, n as appendTranscriptEventSnapshotSync, u as replaceTranscriptSuffixEventsSync } from "./session-accessor.sqlite-transcript-write-B1_nzUQQ.mjs";
import { n as installSessionManagerIncognitoBinding, r as prepareSessionManagerSync, t as captureSessionManagerIncognitoBinding } from "./session-manager-incognito-scope-DBz3K1lk.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { i as receiveSessionManagerCommit, n as SessionManagerActorCommittedError, r as committedTranscriptViewError, t as SessionEntryCommittedError } from "./session-manager-persistence-error-uXrnbG-q.mjs";
import { r as readTranscriptMutationAtSync } from "./session-accessor.sqlite-metadata-read-DgoOP6m6.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-CHjQRvEC.mjs";
import { t as prepareTranscriptRewriteSync } from "./session-accessor.sqlite-branch-rewrite-CaUDlpr3.mjs";
import { n as bindCacheTtlProjectionPrefixes, t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-DOoM5SxW.mjs";
import { a as prepareSessionManagerHydration, c as readSessionManagerModelContextAsync, i as readSessionManagerReload, n as openSessionManagerBoundedView, o as readSessionManagerActorTranscript, r as readCommittedSessionManagerReload, s as readSessionManagerContextAsync, t as consumeSessionManagerReload } from "./session-manager-reload-BdL-HEet.mjs";
import { i as withSessionManagerWrite, n as captureSessionManagerWriteAssertion, r as runSessionManagerWrite, t as appendSessionTranscriptNote } from "./session-manager-write-admission-Ca7jiEvG.mjs";
import { a as isTalkRealtimeVoiceEntry, c as migrateToCurrentVersion, d as createManagedSessionId, f as generateSessionEntryId, i as isSessionContextMetadataEntry, n as cloneSessionModelContextEntries } from "./session-manager-codec-DTpe_z-3.mjs";
import { n as loadTranscriptSuffixEventsBoundedSync, r as readPreviousIndexedTranscriptEventSync } from "./session-accessor.sqlite-suffix-read-CVUecbKh.mjs";
import { t as appendSessionManagerActor } from "./session-manager-actor-append-R1mAyZ4o.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { isProxy } from "node:util/types";
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
//#region src/agents/sessions/session-manager-append-admission.ts
/** The manager owns preparation and view adoption; the actor owns each database command. */
async function withSessionManagerAppend(manager, append, nativeMaintenance = false) {
	const target = manager.getSessionTarget();
	const binding = !nativeMaintenance && target ? getOwnedSessionTranscriptActor(target) : void 0;
	if (!binding || !target || binding.actor.target.database.kind === "memory") return withSessionManagerWrite(manager, append);
	const { actor } = binding;
	const identity = { ...target };
	const assertManager = captureSessionManagerWriteAssertion(manager);
	const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
	const assertCurrent = () => {
		assertManager?.();
		assertOwned();
		actor.assertCurrent();
		if (!sameSessionTranscriptTargetBinding(identity, manager.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
	};
	assertCurrent();
	const options = binding.database;
	return runSessionManagerWrite(manager, () => {
		assertCurrent();
		return actor.withPhase("session-manager.append", {
			assertCurrent,
			authorize: assertCurrent
		}, async () => append({
			actor,
			options,
			assertCurrent
		}));
	});
}
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
const asyncInvocation = resolveGlobalSingleton(Symbol.for("openclaw.sessionCompactionPersistenceAsync"), () => new AsyncLocalStorage());
/** Retain accounting authority until this exact manager's awaited append settles. */
async function withSessionCompactionPersistenceAsync(manager, persist, append) {
	if (!persist) return await append();
	const current = {
		manager,
		persist,
		active: true
	};
	try {
		return await asyncInvocation.run(current, append);
	} finally {
		current.active = false;
	}
}
function getSessionCompactionPersistenceAsync(manager) {
	const current = asyncInvocation.getStore();
	return current?.active && current.manager === manager ? current.persist : void 0;
}
//#endregion
//#region src/agents/sessions/session-manager-current-turn.ts
/** @internal Replay preparation is not part of the public SessionManager API. */
const sessionManagerPrepareCurrentTurnReplay = Symbol.for("openclaw.session-manager.prepare-current-turn-replay");
/** @internal Runtime model history is not the raw persistence/navigation window. */
const sessionManagerReadInitialContext = Symbol.for("openclaw.session-manager.read-initial-context");
/** @internal Committed manager facts for the current execution boundary. */
const sessionManagerReadTranscriptStart = Symbol.for("openclaw.session-manager.read-transcript-start");
function traversalEntry(entry, entryId, isInterruptedTail) {
	if (!entry || entry.id !== entryId) return;
	return {
		id: entry.id,
		parentId: entry.parentId,
		traversable: isSessionContextMetadataEntry(entry) || entry.type === "compaction" || entry.type === "custom_message" && (entry.customType === OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE || entry.customType === "openclaw.system-update") || (isInterruptedTail?.(entry) ?? false)
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
async function prepareCurrentTurnReplaySelection(readView, matchesUser, signal, manager) {
	const view = readView();
	if (!view.target || !view.version) return;
	const version = { ...view.version };
	const entryCount = view.entries.size;
	const assertOwned = captureOwnedTranscriptWriteAssertion(view.target);
	const reader = prepareSessionManagerHydration(view.target, {
		signal,
		manager
	});
	const assertCurrent = () => {
		signal?.throwIfAborted();
		assertOwned();
		reader.assertCurrent();
		const current = readView();
		if (current.target !== view.target || current.version !== view.version || current.entries !== view.entries || current.entries.size !== entryCount || current.parentId !== view.parentId || current.pendingDeliberateAppend !== view.pendingDeliberateAppend) throw new Error("Session manager changed during replay preparation");
	};
	assertCurrent();
	const walk = walkSessionCurrentTurn(view.parentId, view.remainingAncestors);
	let next = walk.next();
	let entry;
	while (!next.done) {
		entry = view.entries.get(next.value);
		if (!entry) {
			const result = await reader.readCurrentTurnEntry({
				entryId: next.value,
				version,
				includeEntry: true
			});
			reader.assertCurrent();
			assertCurrent();
			entry = isIndexedSessionEntry(result.event) && result.event.id === next.value ? result.event : void 0;
		}
		next = walk.next(traversalEntry(entry, next.value, view.isInterruptedTail));
	}
	const userId = next.value;
	if (!userId || entry?.id !== userId || !matchesUser(entry)) return;
	const transcript = readSessionManagerActorTranscript(view.target, version);
	const anchor = transcript ? transcript.anchors.find((candidate) => candidate.entryId === userId) : (await reader.readCurrentTurnEntry({
		entryId: userId,
		version,
		includeEntry: false
	})).anchor;
	assertCurrent();
	if (!anchor) return;
	assertCurrent();
	return {
		entryId: userId,
		version,
		assertCurrent
	};
}
//#endregion
//#region src/agents/sessions/session-manager-message-anchor.ts
/** @internal The last message append's immutable postimage, never current authority. */
const sessionManagerReadMessageAnchor = Symbol.for("openclaw.session-manager.read-message-anchor");
/** @internal Completed-turn consumers validate this historical selector at their own boundary. */
const completedTurnMessageAnchor = Symbol.for("openclaw.completed-turn.message-anchor");
/** Preserve the producer's original locator and owner instead of rebinding the normalized anchor. */
function captureCompletedTurnMessageAnchor(manager, entryId) {
	const anchor = manager[sessionManagerReadMessageAnchor](entryId);
	const target = manager.getSessionTarget();
	return anchor && target ? Object.freeze({
		anchor,
		assertCurrent: captureOwnedTranscriptWriteAssertion(target)
	}) : void 0;
}
//#endregion
//#region src/agents/sessions/session-manager-persistence-entry.ts
function transcriptAppendNeedsReload(before, loaded) {
	return loaded !== void 0 && (before.generation !== loaded.generation || before.rawSeq !== loaded.rawSeq);
}
function adoptCommittedMessagePayload(entry, receipt, idempotencyLookup) {
	if (receipt.effectiveParentId === void 0) throw new Error(`Session transcript parent entry was not persisted: ${entry.id}`);
	entry.message = receipt.message;
	if (receipt.messageId !== entry.id && !(entry.message.role === "user" && "idempotencyKey" in entry.message && typeof entry.message.idempotencyKey === "string" && entry.message.idempotencyKey.length > 0 && idempotencyLookup !== "caller-checked")) throw new Error(`Session transcript parent entry was not persisted: ${entry.id}`);
	if (idempotencyLookup === "caller-checked" && !receipt.appended) throw new Error(`Session transcript append was not persisted: ${entry.id}`);
	return receipt.effectiveParentId;
}
function canonicalizeSessionEntry(entry) {
	const canonicalEntry = normalizeTranscriptJsonValue(entry, "");
	if (!isIndexedSessionEntry(canonicalEntry) || canonicalEntry.type !== entry.type) throw new Error(`Invalid session transcript entry: ${entry.type}`);
	return canonicalEntry;
}
function adoptPersistedMessage(entry, snapshot, idempotencyLookup, loadedVersion) {
	const { result } = snapshot;
	if (!result) throw new Error(`Session transcript message was not persisted: ${entry.id}`);
	const effectiveParentId = adoptCommittedMessagePayload(entry, result, idempotencyLookup);
	if (result.messageId !== entry.id) {
		if (!result.anchor) throw new Error(`Session transcript anchor was not returned: ${result.messageId}`);
		return {
			adoptedMessageId: result.messageId,
			anchor: result.anchor,
			appended: result.appended,
			effectiveParentId
		};
	}
	const reloadAfterAppend = result.appended && transcriptAppendNeedsReload(snapshot.before, loadedVersion);
	return {
		...result.anchor ? { anchor: result.anchor } : {},
		lifecycleRevision: snapshot.lifecycleRevision,
		appended: result.appended,
		effectiveParentId,
		...reloadAfterAppend ? { reloadAfterAppend: true } : {}
	};
}
//#endregion
//#region src/agents/sessions/session-manager-core.ts
/** @internal Fresh payload adoption and metadata consumption share one history admission. */
const sessionManagerReloadTranscriptCohort = Symbol.for("openclaw.session-manager.reload-transcript-cohort");
/** @internal Initial hydration and its synchronous replay decision share one admission. */
const sessionManagerOpenTranscriptCohort = Symbol.for("openclaw.session-manager.open-transcript-cohort");
var SessionManagerCore = class SessionManagerCore extends SessionEntryNavigation {
	constructor(cwd, persistenceTarget, loadedEntries, boundedContext, version) {
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
		this.transcriptMutationAt = boundedContext !== void 0 ? boundedContext.transcriptMutationAt : version?.updatedAt;
		this.transcriptVersion = version ?? boundedContext?.version;
		if (persistenceTarget || loadedEntries) {
			this.setLoadedSessionTarget(persistenceTarget, loadedEntries ?? [], boundedContext, version);
			installSessionManagerIncognitoBinding(this, captureSessionManagerIncognitoBinding(persistenceTarget));
		} else this.newSession();
	}
	/** @deprecated Await setSessionTargetAsync. Supported through 2026-12-31. */
	setSessionTarget(target) {
		prepareSessionManagerSync("setSessionTarget", target, this);
		this.setSessionTargetSync(target);
	}
	setSessionTargetSync(target) {
		this.assertTranscriptViewAvailable();
		this.hydrationRevision++;
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const prepared = readSessionManagerReload(capturedTarget, this.boundedContextLimits, false);
		const bounded = prepared.kind === "bounded" ? prepared.snapshot : void 0;
		const entries = prepared.snapshot.events;
		this.boundedContextIncomplete = bounded !== void 0;
		this.persistedBoundaryCount = bounded?.boundaryCount;
		this.persistedSuffixStartSeq = bounded?.persistedSuffixStartSeq;
		this.transcriptMutationAt = bounded !== void 0 ? bounded.transcriptMutationAt : prepared.snapshot.version.updatedAt;
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		this.setLoadedSessionTarget(capturedTarget, entries, bounded, prepared.snapshot.version);
		if (header?.cwd) this.cwd = header.cwd;
	}
	/** Prepare off-thread and publish the entire view only while this manager is unchanged. */
	async setSessionTargetAsync(target, signal) {
		await this.hydrateSessionTarget(target, false, signal);
	}
	async hydrateSessionTarget(target, preserveCwd, signal, complete = false, cohort) {
		this.assertTranscriptViewAvailable();
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const hydration = prepareSessionManagerHydration(capturedTarget, {
			limits: complete ? void 0 : this.boundedContextLimits,
			signal,
			manager: this,
			retarget: !preserveCwd && !sameSessionTranscriptTargetBinding(capturedTarget, this.persistenceTarget),
			lane: preserveCwd ? targetDiscoveryLane : void 0
		});
		if (cohort && !hydration.readCohort) return false;
		const assertOwned = captureOwnedTranscriptWriteAssertion(hydration.target);
		const revision = ++this.hydrationRevision;
		const prior = this.captureTranscriptView();
		const entryCount = this.fileEntries.length;
		const opaqueCount = this.opaqueFileEntries.length;
		assertOwned();
		const publish = (prepared) => {
			signal?.throwIfAborted();
			assertOwned();
			hydration.assertCurrent();
			this.assertTranscriptViewAvailable();
			const current = this.captureTranscriptView();
			if (revision !== this.hydrationRevision || this.fileEntries.length !== entryCount || this.opaqueFileEntries.length !== opaqueCount || Object.keys(prior).some((key) => Reflect.get(prior, key) !== Reflect.get(current, key))) throw new Error("Session manager changed during transcript hydration");
			this.adoptPreparedTranscriptReload(prepared, void 0, hydration.target);
			installSessionManagerIncognitoBinding(this, hydration.incognitoBinding);
			if (!preserveCwd) this.cwd = this.fileEntries.find((entry) => entry.type === "session")?.cwd ?? this.cwd;
			this.hydrationRevision++;
			consumeSessionManagerReload(prepared, cohort?.consume, () => this.captureTranscriptView(), () => {
				assertOwned();
				hydration.assertCurrent();
			});
		};
		if (cohort && hydration.readCohort) await hydration.readCohort(cohort.selection, publish);
		else publish(await hydration.read().catch((error) => {
			assertOwned();
			throw error;
		}));
		return true;
	}
	[sessionManagerReloadTranscriptCohort](selection, consume, signal) {
		return this.persistenceTarget && this.boundedContextLimits ? this.hydrateSessionTarget(this.persistenceTarget, true, signal, false, {
			selection,
			consume
		}) : Promise.resolve(false);
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
		this.setSessionTargetSync(this.persistenceTarget);
		this.boundedContextLimits = limits;
	}
	async ensureCompletePersistedHistoryAsync() {
		this.assertTranscriptViewAvailable();
		if (this.persistenceTarget && this.boundedContextIncomplete) await this.hydrateSessionTarget(this.persistenceTarget, true, void 0, true);
	}
	setLoadedSessionTarget(target, entries, bounded, version) {
		this.assertTranscriptViewAvailable();
		this.transcriptVersion = version ?? bounded?.version;
		this.cacheTtlProjectionPrefixes = void 0;
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
			this.cacheTtlProjectionPrefixes = bindCacheTtlProjectionPrefixes(bounded, this);
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
			persistenceHeaderPending: this.persistenceHeaderPending,
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
			cacheTtlProjectionPrefixes: this.cacheTtlProjectionPrefixes,
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
	/** @deprecated Await reloadPersistedTranscriptAsync. Supported through 2026-12-31. */
	reloadPersistedTranscript() {
		prepareSessionManagerSync("reloadPersistedTranscript", this.persistenceTarget, this);
		this.reloadPersistedTranscriptSync();
	}
	reloadPersistedTranscriptSync() {
		this.assertTranscriptViewAvailable();
		if (this.persistenceTarget) {
			const runtimeCwd = this.cwd;
			this.setSessionTargetSync(this.persistenceTarget);
			this.cwd = runtimeCwd;
		}
	}
	/** Reloads a committed append without adopting a later user turn. */
	reloadPersistedTranscriptAfterAppend(expectedMutationAt, expectedEntryId, admittedUserId) {
		if (!this.persistenceTarget) return;
		this.adoptPreparedTranscriptReload(readSessionManagerReload(this.persistenceTarget, this.boundedContextLimits, true), {
			expectedMutationAt,
			expectedEntryId,
			admittedUserId
		});
	}
	/** Adopt owner-prepared bytes without reading SQLite again on the receiving thread. */
	adoptPreparedTranscriptReload(prepared, append, target = this.persistenceTarget) {
		if (!target) return;
		const { events, version } = prepared.snapshot;
		const bounded = prepared.kind === "bounded" ? prepared.snapshot : void 0;
		const mutationAt = bounded ? bounded.transcriptMutationAt : version.updatedAt;
		if (append && mutationAt !== append.expectedMutationAt && !events.some((entry) => isIndexedSessionEntry(entry) && entry.id === append.expectedEntryId)) throw new Error("SQLite transcript changed before adopting the committed append");
		const candidate = new SessionManagerCore(this.cwd);
		candidate.boundedContextLimits = this.boundedContextLimits;
		candidate.boundedContextIncomplete = bounded !== void 0;
		candidate.persistedBoundaryCount = bounded?.boundaryCount;
		candidate.persistedSuffixStartSeq = bounded?.persistedSuffixStartSeq;
		candidate.transcriptMutationAt = mutationAt;
		candidate.setLoadedSessionTarget(target, events, bounded, version);
		if (append) {
			const activeBranch = candidate.getBranch();
			const admittedUserIndex = activeBranch.findIndex((entry) => entry.id === append.admittedUserId);
			if (admittedUserIndex < 0 || activeBranch.slice(admittedUserIndex + 1).some((entry) => entry.type === "message" && entry.message.role === "user")) candidate.adoptSelectedTranscriptPath(append.expectedEntryId, [...candidate.byId].map(([id, entry]) => [id, entry.parentId]));
		}
		Object.assign(this, candidate.captureTranscriptView());
		this.persistenceTarget = candidate.persistenceTarget;
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
		this.clearNavigation();
		this.cacheTtlProjectionPrefixes = void 0;
		this.boundedFirstKeptById.clear();
		this.boundedParentIds.clear();
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
			const parent = parentId !== null && parentId !== entry.id ? nodeMap.get(parentId) : void 0;
			if (parent) parent.children.push(node);
			else roots.push(node);
		}
		for (const node of nodeMap.values()) node.children.sort((left, right) => new Date(left.entry.timestamp).getTime() - new Date(right.entry.timestamp).getTime());
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
	getPersistedFileEntries(leafAppendMode) {
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
			const leafEntry = this.createLeafControl(rawTailId, this.appendParentId, leafAppendMode);
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
//#region src/agents/sessions/session-manager-snapshot.ts
const nativeCloneRequired = /* @__PURE__ */ new Error("Opaque session snapshot requires native cloning");
/** Detach mutable containers while sharing sealed transcript payloads. */
function cloneTranscriptView(snapshot) {
	const copies = /* @__PURE__ */ new Map();
	const copy = (value) => {
		if (typeof value === "function" || typeof value === "symbol") throw nativeCloneRequired;
		if (value === null || typeof value !== "object") return value;
		if (isProxy(value)) throw nativeCloneRequired;
		if (isOwnedTranscriptPayload(value) || isDeeplyFrozenPlainData(value)) return value;
		if (copies.has(value)) return copies.get(value);
		const prototype = Object.getPrototypeOf(value);
		if (value instanceof Map && prototype === Map.prototype) {
			const result = /* @__PURE__ */ new Map();
			copies.set(value, result);
			value.forEach((member, key) => result.set(copy(key), copy(member)));
			return result;
		}
		if (value instanceof Set && prototype === Set.prototype) {
			const result = /* @__PURE__ */ new Set();
			copies.set(value, result);
			value.forEach((member) => result.add(copy(member)));
			return result;
		}
		if (prototype !== Object.prototype && prototype !== null && prototype !== Array.prototype) throw nativeCloneRequired;
		const result = Array.isArray(value) ? [] : {};
		if (Array.isArray(result) && Array.isArray(value)) result.length = value.length;
		copies.set(value, result);
		for (const key of Object.keys(value)) {
			const descriptor = Object.getOwnPropertyDescriptor(value, key);
			if (!("value" in descriptor)) throw nativeCloneRequired;
			Object.defineProperty(result, key, {
				value: copy(descriptor.value),
				enumerable: true,
				configurable: true,
				writable: true
			});
		}
		return result;
	};
	try {
		return copy(snapshot);
	} catch (error) {
		if (error !== nativeCloneRequired) throw error;
		return structuredClone(snapshot);
	}
}
//#endregion
//#region src/agents/sessions/session-manager-native-persistence.ts
/** Released synchronous SDK methods keep their native transaction and publication contract. */
var SessionManagerNativePersistence = class extends SessionManagerCore {
	#initialWriter;
	#navigationEpoch = 0;
	get initialTranscriptWriter() {
		return this.#initialWriter;
	}
	recordTranscriptNavigationChange() {
		this.#navigationEpoch++;
		this.cacheTtlProjectionPrefixes = this.cacheTtlProjectionPrefixes?.filter((prefix) => prefix.anchorIds.length > 0);
	}
	/** Local branch selections revoke pending writes; committed view adoption does not. */
	captureTranscriptNavigationAssertion() {
		const epoch = this.#navigationEpoch;
		return () => {
			if (this.#navigationEpoch !== epoch) throw new Error("Session transcript navigation changed before publication");
		};
	}
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
		assertSessionTranscriptInitialWriter(initialWriter, scope);
		if (!initialWriter.committedFence && inheritedWriter !== initialWriter) throw new SessionTranscriptWriterClaimReboundError();
		Object.assign(scope, initialWriter.committedFence ?? {
			expectedLifecycleRevision: void 0,
			expectedWriterRunId: initialWriter.writerRunId
		});
	}
	hasNewerPublishedTranscriptView(version) {
		this.assertTranscriptViewAvailable();
		return this.transcriptMutationAt != null && version.updatedAt !== null && this.transcriptMutationAt >= version.updatedAt;
	}
	/** @deprecated Await persistAsync. Supported through 2026-12-31. */
	persist(entry, options) {
		prepareSessionManagerSync("persist", this.persistenceTarget, this);
		return this.persistRecord(entry, options);
	}
	persistRecord(entry, options, preparedMessage) {
		if (!this.persistenceTarget) {
			if (getSessionCompactionPersistence(this)) throw new Error("Compaction boundary validation failed");
			return;
		}
		this.assertTranscriptWriteActive();
		const scope = this.persistenceTarget;
		const initialWriter = this.#initialWriter;
		const persistCompaction = getSessionCompactionPersistence(this);
		const sessionId = this.sessionId;
		const isCurrentView = () => this.sessionId === sessionId && sameSessionTranscriptTargetBinding(scope, this.persistenceTarget);
		const onPendingTransaction = (database) => {
			if (!isCurrentView()) return;
			const previous = cloneTranscriptView(this.captureTranscriptView());
			stageSqliteTransactionState(database, {
				stage: () => {},
				commit: () => {},
				rollback: () => {
					if (isCurrentView()) Object.assign(this, previous);
				}
			});
		};
		const viewGuard = {
			assertCurrent: () => {
				this.assertTranscriptViewAvailable();
				if (!isCurrentView()) throw new SessionTranscriptWriterClaimReboundError();
			},
			onPendingTransaction
		};
		const appendEvent = (event, appendOptions, errorMessage) => {
			const committed = requireTranscriptEventAppendSnapshot(appendTranscriptEventSnapshotSync(scope, event, appendOptions, void 0, viewGuard), errorMessage);
			this.transcriptVersion = committed.after;
			this.transcriptMutationAt = committed.after.updatedAt;
			return committed;
		};
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
			const reloadAfterAppend = transcriptAppendNeedsReload(committed.before, loadedVersion);
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
			appendEvent(header, options?.expectedMutationAt !== void 0 ? { expectedMutationAt: options.expectedMutationAt } : this.transcriptMutationAt !== void 0 ? { expectedMutationAt: this.transcriptMutationAt } : {}, "Session transcript header was not persisted");
			this.persistenceHeaderPending = false;
		}
		const expectedMutationAt = persistedHeader ? this.transcriptMutationAt : options?.expectedMutationAt !== void 0 ? options.expectedMutationAt : this.transcriptMutationAt;
		const leafEntry = parseOpaqueLeafEntry(entry);
		if (leafEntry) {
			appendEvent(entry, expectedMutationAt !== void 0 ? { expectedMutationAt } : {}, `Session transcript leaf control was not persisted: ${leafEntry.id}`);
			return;
		}
		if (!isIndexedSessionEntry(entry)) return;
		if (entry.type !== "message") {
			const loadedVersion = this.transcriptVersion;
			const committed = appendEvent(entry, {
				...options?.appendIntent === "active-branch" ? { appendIntent: options.appendIntent } : {},
				...expectedMutationAt !== void 0 ? { expectedMutationAt } : {}
			}, `Session transcript entry was not persisted: ${entry.id}`);
			const effectiveParentId = committed.result.effectiveParentId !== void 0 ? committed.result.effectiveParentId : entry.parentId;
			const reloadAfterAppend = transcriptAppendNeedsReload(committed.before, loadedVersion);
			return effectiveParentId === entry.parentId && !reloadAfterAppend ? void 0 : {
				appended: true,
				effectiveParentId,
				...reloadAfterAppend ? { reloadAfterAppend: true } : {}
			};
		}
		const appendOptions = {
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
		};
		const loadedVersion = this.transcriptVersion;
		const outcome = appendTranscriptMessageSnapshotSync(scope, appendOptions, preparedMessage, void 0, viewGuard);
		if (!outcome.ok) throw new Error(`Session transcript message was not persisted: ${entry.id}`, { cause: outcome.error });
		this.transcriptVersion = outcome.value.after;
		if (outcome.value.result?.appended) this.transcriptMutationAt = outcome.value.after.updatedAt;
		return adoptPersistedMessage(entry, outcome.value, options?.idempotencyLookup, loadedVersion);
	}
};
//#endregion
//#region src/agents/sessions/session-manager-persistence.ts
var SessionManagerPersistence = class extends SessionManagerNativePersistence {
	async persistWorkerRecord(entry, appendIntent, writeAdmission, message, beforeFreshMessageCommit, expectedMutationAt, retryMutationConflicts = true, assertNavigation) {
		this.assertTranscriptWriteActive();
		const target = this.persistenceTarget;
		if (!target) throw new Error("Session writer worker requires a persistent session");
		const identity = { ...target };
		const sessionId = this.getSessionId();
		const { options } = writeAdmission;
		const database = "actor" in writeAdmission ? void 0 : writeAdmission.database;
		const { env: _env, ...writeTarget } = withOwnedSessionTranscriptWriterFence(target);
		const captured = {
			...writeTarget,
			storePath: database?.path ?? resolveOpenClawAgentSqlitePath(options)
		};
		const initialWriter = this.initialTranscriptWriter;
		const admission = resolveSessionTranscriptReadFence(captured);
		const questionAnswers = message?.validateTurn ? captureSessionTranscriptQuestionAnswers({ path: captured.storePath }, captured.sessionId, admission?.entryId) : void 0;
		const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
		const assertBinding = () => {
			const current = this.persistenceTarget;
			if (this.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(identity, current)) throw new SessionTranscriptWriterClaimReboundError();
		};
		const assertCurrent = () => {
			writeAdmission.assertCurrent();
			assertBinding();
			assertNavigation?.();
			if (initialWriter) assertSessionTranscriptInitialWriter(initialWriter, identity);
			assertOwned();
			questionAnswers?.assertCurrent();
		};
		const persistCompaction = getSessionCompactionPersistenceAsync(this);
		if (entry.type === "compaction" && persistCompaction) {
			if (this.persistenceHeaderPending) throw new Error("Compaction boundary validation failed");
			const committed = await withSessionTranscriptWriteAssertion(identity, assertCurrent, () => persistCompaction({
				scope: identity,
				event: entry,
				...appendIntent ? { appendIntent } : {},
				expectedMutationAt: expectedMutationAt !== void 0 ? expectedMutationAt : this.transcriptMutationAt,
				...initialWriter && !initialWriter.committedFence ? { initializeEntry: true } : {}
			})).catch((error) => {
				if (error instanceof SessionEntryCommittedError) this.invalidateTranscriptView(error);
				throw error;
			});
			try {
				assertCurrent();
				if (initialWriter?.committedFence) Object.assign(target, initialWriter.committedFence);
			} catch (cause) {
				const error = new SessionEntryCommittedError(committed.result.id, identity, committed.after, cause);
				this.invalidateTranscriptView(error);
				throw error;
			}
			return {
				result: {
					appended: true,
					effectiveParentId: committed.result.parentId
				},
				committedVersion: committed.after
			};
		}
		let wireEvent;
		if (entry.type === "message") {
			const { message: _message, ...envelope } = entry;
			wireEvent = envelope;
		} else wireEvent = JSON.stringify(entry);
		if (message) Object.freeze(message.prepared.persistedMessage);
		const wireMessage = message ? {
			messageJson: message.prepared.messageJson,
			cwd: message.cwd,
			validateTurn: message.validateTurn,
			idempotencyLookup: message.idempotencyLookup
		} : void 0;
		const projectAppend = (committed, reload, failure, loadedVersion, requireReload = false) => {
			const receipt = committed.result;
			const effectiveParentId = "effectiveParentId" in receipt && receipt.effectiveParentId !== void 0 ? receipt.effectiveParentId : entry.parentId;
			const adoptedMessage = "messageId" in receipt && receipt.messageId !== entry.id;
			const reloadAfterAppend = receipt.appended && transcriptAppendNeedsReload(committed.before, loadedVersion);
			if (requireReload && !this.hasNewerPublishedTranscriptView(committed.after) && (adoptedMessage || reloadAfterAppend || effectiveParentId !== entry.parentId) && !reload) throw new Error("Session actor omitted the committed transcript reload");
			if (entry.type === "message") {
				if (!("messageId" in receipt) || !message) throw new Error(`Session transcript parent entry was not persisted: ${entry.id}`);
				adoptCommittedMessagePayload(entry, {
					...receipt,
					message: receipt.message ?? message.prepared.persistedMessage
				}, message.idempotencyLookup);
			}
			return {
				result: {
					appended: receipt.appended,
					..."anchor" in receipt && receipt.anchor ? { anchor: receipt.anchor } : {},
					lifecycleRevision: committed.lifecycleRevision,
					effectiveParentId,
					...adoptedMessage && "messageId" in receipt ? { adoptedMessageId: receipt.messageId } : {},
					...reloadAfterAppend ? { reloadAfterAppend: true } : {}
				},
				reload: reload?.ok ? reload.value : void 0,
				committedVersion: committed.after,
				viewFailure: failure ?? (reload?.ok === false ? committedTranscriptViewError(reload.error) : void 0)
			};
		};
		if ("actor" in writeAdmission) {
			const actor = writeAdmission.actor;
			const header = this.persistenceHeaderPending ? this.fileEntries[0] : void 0;
			if (this.persistenceHeaderPending && header?.type !== "session") throw new Error("Session transcript header was not persisted");
			let loadedVersion = this.transcriptVersion;
			const append = (mutationAt) => appendSessionManagerActor({
				actor,
				assertCurrent,
				beforeFreshMessageCommit,
				toolResult: entry.type === "message" && entry.message.role === "toolResult",
				append: {
					kind: "metadata",
					input: {
						scope: captured,
						event: wireEvent,
						...wireMessage ? { message: wireMessage } : {},
						options: {
							...appendIntent ? { appendIntent } : {},
							...!this.persistenceHeaderPending && mutationAt !== void 0 ? { expectedMutationAt: mutationAt } : {}
						},
						view: {
							loadedVersion,
							limits: this.boundedContextLimits,
							admission,
							questionAnswers: questionAnswers?.answers
						}
					},
					...this.persistenceHeaderPending || initialWriter && !initialWriter.committedFence ? { initialization: {
						scope: captured,
						entry: {
							sessionId: captured.sessionId,
							updatedAt: Date.now()
						},
						...initialWriter && !initialWriter.committedFence ? { initialWriterRunId: initialWriter.writerRunId } : {}
					} } : {},
					...this.persistenceHeaderPending ? { header: {
						scope: captured,
						event: JSON.stringify(header),
						options: mutationAt !== void 0 ? { expectedMutationAt: mutationAt } : {}
					} } : {}
				},
				onCommitted: (committed) => {
					if (committed.initialEntry?.fence) {
						initialWriter?.recordCommitted(committed.initialEntry.fence);
						Object.assign(target, committed.initialEntry.fence);
						Object.assign(captured, committed.initialEntry.fence);
					}
					const committedHeader = committed.header?.snapshot;
					if (committedHeader?.ok && committedHeader.value.result?.appended) {
						assertBinding();
						this.persistenceHeaderPending = false;
						loadedVersion = committedHeader.value.after;
					}
					const committedIdentity = committed.initialEntry?.identity;
					if (committedIdentity) {
						const databaseIdentity = actor.target.database;
						publishCommittedSessionIdentity(captured.agentId, databaseIdentity.kind === "file" ? databaseIdentity.physicalIdentity : databaseIdentity.incarnation, committedIdentity.previous, committedIdentity.current);
						assertCurrent();
					}
				}
			});
			let outcome;
			try {
				outcome = await append(expectedMutationAt !== void 0 ? expectedMutationAt : this.transcriptMutationAt);
			} catch (error) {
				if (!retryMutationConflicts || expectedMutationAt !== void 0 || !(error instanceof SqliteTranscriptMutationConflictError)) throw error;
				const authority = {
					assertCurrent,
					authorize: assertCurrent
				};
				outcome = await append((actor.snapshot(authority) ?? await actor.read(authority)).transcript.version.updatedAt);
			}
			try {
				if (outcome.committed.kind !== "metadata") throw new Error("Session actor returned another append kind");
				const value = outcome.committed.value;
				const snapshot = value.snapshot;
				if (!snapshot.ok || !snapshot.value.result || entry.type !== "message" && !snapshot.value.result.appended) throw new Error(`Session transcript entry was not persisted: ${entry.id}`, { cause: snapshot.ok ? void 0 : snapshot.error });
				const projected = projectAppend({
					...snapshot.value,
					result: snapshot.value.result
				}, value.reload, outcome.failure, loadedVersion, true);
				if (value.projectionNeedsReconcile && !outcome.failure) startSessionTranscriptIndexReconcile({
					...options,
					preferredSessionId: captured.sessionId
				});
				return projected;
			} catch (cause) {
				const failure = outcome.failure ?? new SessionManagerActorCommittedError("session.metadata.append", {
					ok: true,
					value: outcome.committed.value
				}, cause);
				this.invalidateTranscriptView(failure);
				throw failure;
			}
		}
		if (!database) throw new Error("Session append has no database owner");
		const { withSessionMetadataWorker } = await runInDetachedAsyncContext(() => import("./session-manager-metadata-runtime-BVaK_rGu.mjs"));
		assertCurrent();
		return await withSessionMetadataWorker(options, database, assertCurrent, async (worker) => {
			if (this.persistenceHeaderPending || initialWriter && !initialWriter.committedFence) {
				const initialization = await receiveSessionManagerCommit("session.metadata.initialize", () => worker.execute({
					type: "session.metadata.initialize",
					input: {
						scope: captured,
						entry: {
							sessionId: captured.sessionId,
							updatedAt: Date.now()
						},
						...initialWriter && !initialWriter.committedFence ? { initialWriterRunId: initialWriter.writerRunId } : {}
					}
				}));
				const committed = initialization.value;
				try {
					if (committed.fence) {
						if ("withMetadata" in database) initialWriter?.recordCommitted(committed.fence);
						Object.assign(target, committed.fence);
						Object.assign(captured, committed.fence);
					}
				} finally {
					if (committed.identity && "withMetadata" in database) publishCommittedSessionIdentity(captured.agentId, database.identity.incarnation, committed.identity.previous, committed.identity.current);
				}
				if (initialization.failure) {
					this.invalidateTranscriptView(initialization.failure);
					throw initialization.failure;
				}
				if (!committed.owned) {
					if (captured.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
					throw new Error("Session transcript header was not persisted");
				}
				assertCurrent();
			}
			const appendEvent = async (event, bytes, mutationAt, intent) => {
				const receipt = await receiveSessionManagerCommit("session.metadata.append", () => worker.execute({
					type: "session.metadata.append",
					input: {
						scope: captured,
						event: bytes,
						...event.type === "message" ? { message: wireMessage } : {},
						options: {
							...intent ? { appendIntent: intent } : {},
							...mutationAt !== void 0 ? { expectedMutationAt: mutationAt } : {}
						},
						...event.type !== "session" ? { view: {
							loadedVersion: this.transcriptVersion,
							limits: this.boundedContextLimits,
							admission,
							questionAnswers: questionAnswers?.answers
						} } : {}
					}
				}));
				const result = receipt.value;
				if (result.projectionNeedsReconcile && !receipt.failure) startSessionTranscriptIndexReconcile({
					...options,
					preferredSessionId: captured.sessionId
				});
				return {
					...result,
					failure: receipt.failure
				};
			};
			let loadedVersion = this.transcriptVersion;
			const append = async (initialMutationAt) => {
				let mutationAt = initialMutationAt;
				if (this.persistenceHeaderPending) {
					const header = this.fileEntries[0];
					if (!header || header.type !== "session") throw new Error("Session transcript header was not persisted");
					const headerReceipt = await appendEvent(header, JSON.stringify(header), mutationAt);
					const headerSnapshot = headerReceipt.snapshot;
					if (!headerSnapshot.ok || !headerSnapshot.value.result?.appended) throw new Error("Session transcript header was not persisted", { cause: headerSnapshot.ok ? void 0 : headerSnapshot.error });
					const committed = headerSnapshot.value;
					assertBinding();
					if (!this.hasNewerPublishedTranscriptView(committed.after)) {
						this.transcriptVersion = committed.after;
						this.transcriptMutationAt = committed.after.updatedAt;
					}
					this.persistenceHeaderPending = false;
					if (headerReceipt.failure) {
						this.invalidateTranscriptView(headerReceipt.failure);
						throw headerReceipt.failure;
					}
					mutationAt = this.transcriptMutationAt;
				}
				loadedVersion = this.transcriptVersion;
				const outcome = await appendEvent(entry, wireEvent, mutationAt, appendIntent);
				const snapshot = outcome.snapshot;
				if (!snapshot.ok || !snapshot.value.result || entry.type !== "message" && !snapshot.value.result.appended) throw new Error(`Session transcript entry was not persisted: ${entry.id}`, { cause: snapshot.ok ? void 0 : snapshot.error });
				return {
					committed: {
						...snapshot.value,
						result: snapshot.value.result
					},
					reload: outcome.reload,
					failure: outcome.failure
				};
			};
			let outcome;
			try {
				outcome = await append(expectedMutationAt !== void 0 ? expectedMutationAt : this.transcriptMutationAt);
			} catch (error) {
				if (!retryMutationConflicts || expectedMutationAt !== void 0 || !(error instanceof SqliteTranscriptMutationConflictError)) throw error;
				outcome = await append(await worker.execute({
					type: "session.metadata.mutation",
					input: { scope: captured }
				}));
			}
			return projectAppend(outcome.committed, outcome.reload, outcome.failure, loadedVersion);
		}, {
			beforeFreshMessageCommit,
			initialWriter
		});
	}
	async persistAsync(entry, options) {
		const canonical = { ...canonicalizeSessionEntry(entry) };
		return await withSessionManagerAppend(this, async (admission) => {
			const compactionPersistence = getSessionCompactionPersistenceAsync(this);
			if (!admission && compactionPersistence) throw new Error("Compaction boundary validation failed");
			if (!admission) return this.persistRecord(canonical, options);
			const target = this.getSessionTarget();
			if (!target) throw new Error("Session writer worker requires a persistent session");
			const capturedTarget = captureSessionTranscriptTargetBinding(target);
			const sessionId = this.getSessionId();
			const assertOwned = captureOwnedTranscriptWriteAssertion(capturedTarget);
			assertOwned();
			const message = canonical.type === "message" ? {
				prepared: prepareTranscriptMessageAppendForWorker({
					message: canonical.message,
					config: options?.config
				}),
				cwd: this.cwd,
				validateTurn: false,
				idempotencyLookup: options?.idempotencyLookup
			} : void 0;
			const committed = await this.persistWorkerRecord(canonical, options?.appendIntent, admission, message, options?.beforeFreshMessageCommit, options?.expectedMutationAt, false);
			try {
				if (this.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(capturedTarget, this.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
				assertOwned();
				if (committed.viewFailure) throw committed.viewFailure;
				if (!this.hasNewerPublishedTranscriptView(committed.committedVersion)) {
					this.transcriptVersion = committed.committedVersion;
					this.transcriptMutationAt = committed.committedVersion.updatedAt;
				}
			} catch (cause) {
				if (committed.result?.appended === false) throw cause;
				const error = new SessionEntryCommittedError(committed.result?.adoptedMessageId ?? canonical.id, capturedTarget, committed.committedVersion, cause);
				this.invalidateTranscriptView(error);
				throw error;
			}
			return canonical.type !== "message" && !(canonical.type === "compaction" && compactionPersistence) && !committed.result?.reloadAfterAppend && committed.result?.effectiveParentId === canonical.parentId ? void 0 : committed.result;
		}, canonical.type === "compaction" && Boolean(getSessionCompactionPersistenceAsync(this)));
	}
};
//#endregion
//#region src/agents/sessions/session-persistence-operation.ts
function* sessionPersistenceStep(sync, asynchronous) {
	let result;
	yield {
		sync: () => {
			result = sync();
		},
		async: async () => {
			result = asynchronous ? await asynchronous() : sync();
		}
	};
	return result;
}
function runSessionPersistenceSync(steps) {
	let step = steps.next();
	while (!step.done) {
		try {
			step.value.sync();
		} catch (error) {
			step = steps.throw(error);
			continue;
		}
		step = steps.next();
	}
	return step.value;
}
async function runSessionPersistenceAsync(steps) {
	let step = steps.next();
	while (!step.done) {
		try {
			await step.value.async();
		} catch (error) {
			step = steps.throw(error);
			continue;
		}
		step = steps.next();
	}
	return step.value;
}
//#endregion
//#region src/agents/sessions/session-manager-suffix-persistence.ts
var SessionManagerSuffixPersistence = class SessionManagerSuffixPersistence extends SessionManagerPersistence {
	/** @deprecated Await removeTrailingEntriesAsync. Supported through 2026-12-31. */
	removeTrailingEntries(predicate, options) {
		prepareSessionManagerSync("removeTrailingEntries", this.persistenceTarget, this);
		return runSessionPersistenceSync(this.prepareTrailingEntriesRemoval(predicate, options));
	}
	async removeTrailingEntriesAsync(predicate, options) {
		return withSessionManagerWrite(this, async (admission) => {
			if (!admission) return runSessionPersistenceSync(this.prepareTrailingEntriesRemoval(predicate, options));
			const target = this.persistenceTarget;
			const identity = { ...target };
			const version = this.transcriptVersion;
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
			const assertCurrent = () => {
				admission.assertCurrent();
				this.assertTranscriptWriteActive();
				assertOwned();
				assertNavigation();
				if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== version) throw new Error("Session transcript changed during suffix preparation");
			};
			const reader = prepareSessionManagerHydration(target, { lane: targetDiscoveryLane });
			const { env: _env, ...scope } = withOwnedSessionTranscriptWriterFence(target);
			const { withSessionMetadataWorker } = await import("./session-manager-metadata-runtime-BVaK_rGu.mjs");
			assertCurrent();
			return withSessionMetadataWorker(admission.options, admission.database, assertCurrent, async (worker) => runSessionPersistenceAsync(this.prepareTrailingEntriesRemoval(predicate, options, {
				read: async (request) => {
					const result = await reader.readMaintenance(request);
					reader.assertCurrent();
					assertCurrent();
					return result;
				},
				replace: async (args) => {
					const receipt = await receiveSessionManagerCommit("session.transcript.replaceSuffix", () => worker.execute({
						type: "session.transcript.replaceSuffix",
						input: {
							scope: {
								...scope,
								storePath: admission.database.path
							},
							args
						}
					}));
					const result = receipt.value;
					if (result.projectionNeedsReconcile && !receipt.failure) startSessionTranscriptIndexReconcile({
						...admission.options,
						preferredSessionId: identity.sessionId
					});
					try {
						if (receipt.failure) throw receipt.failure;
						assertCurrent();
					} catch (cause) {
						const error = new Error("Session transcript suffix committed but view publication failed", { cause });
						error.name = "SessionSuffixCommittedError";
						recordModelFallbackStop(error);
						this.invalidateTranscriptView(error);
						throw error;
					}
					return result;
				}
			})));
		});
	}
	*prepareTrailingEntriesRemoval(predicate, options, worker) {
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
			const target = this.persistenceTarget;
			const beforeSeq = this.persistedSuffixStartSeq;
			const previousEntry = yield* sessionPersistenceStep(() => readPreviousIndexedTranscriptEventSync(target, beforeSeq)?.event, worker ? async () => (await worker.read({
				operation: "previous",
				beforeSeq
			})).previous : void 0);
			if (previousEntry && predicate(previousEntry)) throw new RangeError("Bounded transcript cleanup cannot cross the hydrated removal window");
		}
		const candidate = activeBranch[candidateRemoveStart];
		const target = this.persistenceTarget;
		const persistedSuffixStartSeq = (target && isIndexedSessionEntry(candidate) ? yield* sessionPersistenceStep(() => readTranscriptIdentityByEventId(openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptReadScope(target))), target.sessionId, candidate.id)?.seq, worker ? async () => (await worker.read({
			operation: "identity",
			eventId: candidate.id
		})).seq : void 0) : void 0) ?? this.persistedSuffixStartSeq;
		const current = new SessionManagerSuffixPersistence(this.cwd, void 0, this.fileEntries);
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
			const suffixTarget = this.persistenceTarget;
			const limits = {
				maxBytes: SYNC_REBUILD_MAX_BYTES,
				maxEvents: SYNC_REBUILD_MAX_ROWS,
				retainedCustomDataIds
			};
			expectedPersistedEntries = yield* sessionPersistenceStep(() => loadTranscriptSuffixEventsBoundedSync(suffixTarget, persistedSuffixStartSeq, limits), worker ? async () => {
				const result = await worker.read({
					operation: "suffix",
					startSeq: persistedSuffixStartSeq,
					...limits
				});
				if (!result.events) throw new Error("Session suffix reader returned no events");
				return result.events;
			} : void 0);
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
		const prepared = new SessionManagerSuffixPersistence(this.cwd, void 0, preparedEntries);
		const restoreOmittedParentAncestry = (source, destination) => {
			for (const [id, parentId] of source.opaqueParentsById) if (!destination.byId.has(id) && !destination.opaqueParentsById.has(id)) destination.opaqueParentsById.set(id, parentId);
		};
		restoreOmittedParentAncestry(this, prepared);
		prepared.leafId = this.leafId;
		prepared.appendParentId = this.appendParentId;
		prepared.appendMode = this.appendMode;
		let removeStart;
		const removedEntries = [];
		for (let index = 1; index < prepared.fileEntries.length; index += 1) {
			const entry = prepared.fileEntries[index];
			if (isIndexedSessionEntry(entry) && removableEntryIds.has(entry.id)) {
				removeStart ??= index;
				removedEntries.push(entry);
			}
		}
		if (removedEntries.length !== removableEntryIds.size) throw new Error(`SQLite session changed before trimming ${this.sessionId}`);
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
			for (const opaqueEntry of prepared.opaqueFileEntries) if (opaqueEntry.index > index) opaqueEntry.index--;
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
		restoreOmittedParentAncestry(this, prepared);
		prepared.leafId = replacementParentId;
		prepared.appendParentId = replacementParentId;
		const events = prepared.getPersistedFileEntries(prepared.appendMode);
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
			restoreOmittedParentAncestry(prepared, this);
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
			const replacementTarget = this.persistenceTarget;
			const args = [
				expectedPersistedEntries,
				replacementEvents,
				useFullTranscriptFallback ? 0 : persistedPrefixLength,
				this.transcriptMutationAt,
				persistedSuffixStartSeq !== void 0 && !useFullTranscriptFallback,
				useFullTranscriptFallback ? [] : retainedCustomDataIds
			];
			if (!(yield* sessionPersistenceStep(() => replaceTranscriptSuffixEventsSync(replacementTarget, args[0], args[1], args[2], args[3], adoptPrepared, args[4], args[5]), worker ? async () => {
				const result = await worker.replace(args);
				if (result.replaced) adoptPrepared(result.version);
				return result.replaced;
			} : void 0))) throw new Error(`SQLite session changed before trimming ${this.sessionId}`);
		} else adoptPrepared();
		return removedEntries.length;
	}
};
//#endregion
//#region src/agents/sessions/session-manager-append.ts
var SessionManagerAppend = class extends SessionManagerSuffixPersistence {
	#lastMessageAppend;
	[sessionManagerReadMessageAnchor](entryId) {
		this.assertTranscriptViewAvailable();
		const receipt = this.#lastMessageAppend;
		return receipt && receipt.anchor.entryId === entryId && receipt.anchor.generation === this.transcriptVersion?.generation && this.byId.has(receipt.anchor.entryId) && sameSessionTranscriptTargetBinding(receipt.target, this.persistenceTarget) ? receipt.anchor : void 0;
	}
	appendEntryAsync(entry, options, preserveParent = false) {
		const canonical = canonicalizeSessionEntry(entry);
		return withSessionManagerAppend(this, async (admission) => {
			this.assertTranscriptWriteActive();
			if (canonical.type === "label" && !this.byId.has(canonical.targetId)) throw new Error(`Entry ${canonical.targetId} not found`);
			if (!preserveParent) canonical.parentId = this.appendParentId;
			const persistCompaction = getSessionCompactionPersistenceAsync(this);
			if (!admission && persistCompaction) throw new Error("Compaction boundary validation failed");
			if (!admission) {
				if (canonical.type === "message") {
					const result = this.appendMessageWithTranscriptAnchorSync(canonical.message, options);
					canonical.id = result.entryId;
					canonical.message = result.message;
					canonical.parentId = this.byId.get(result.entryId)?.parentId ?? canonical.parentId;
					return {
						...result,
						entry: canonical
					};
				}
				return this.appendEntry(canonical, options, preserveParent);
			}
			const activeBranchAppend = !preserveParent && !this.pendingDeliberateAppend && this.appendMode !== "side" && !isSessionTranscriptSideAppendEntry(canonical);
			const admittedUserId = this.persistenceTarget ? resolveSessionTranscriptReadFence(this.persistenceTarget)?.entryId : void 0;
			const target = this.getSessionTarget();
			const sessionId = this.getSessionId();
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const message = canonical.type === "message" ? {
				prepared: prepareTranscriptMessageAppendForWorker({
					message: canonical.message,
					config: options?.config
				}),
				cwd: this.cwd,
				validateTurn: activeBranchAppend && (canonical.message.role === "assistant" || canonical.message.role === "toolResult" || readNestedToolActivity(canonical.message) !== void 0),
				idempotencyLookup: options?.idempotencyLookup
			} : void 0;
			if (canonical.type === "message" && message) canonical.message = message.prepared.persistedMessage;
			const committed = await this.persistWorkerRecord(canonical, activeBranchAppend ? "active-branch" : void 0, admission, message, options?.beforeFreshMessageCommit, void 0, !activeBranchAppend || canonical.type !== "message" || canonical.message.role === "user" || message?.validateTurn === true, assertNavigation);
			try {
				this.assertTranscriptWriteActive();
				if (this.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(target, this.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
				if (!this.hasNewerPublishedTranscriptView(committed.committedVersion)) assertNavigation();
				return await this.adoptWorkerCommittedEntry(canonical, committed, admittedUserId);
			} catch (cause) {
				if (committed.result?.appended === false) throw cause;
				const error = new Error("Session entry committed, but its view could not be adopted; do not replay the append", { cause });
				error.name = canonical.type === "message" ? "SessionMessageCommittedError" : "SessionEntryCommittedError";
				recordModelFallbackStop(error);
				this.invalidateTranscriptView(error);
				throw error;
			}
		}, canonical.type === "compaction" && Boolean(getSessionCompactionPersistenceAsync(this)));
	}
	appendEntry(entry, options, preserveParent = false) {
		this.assertTranscriptViewAvailable();
		const canonicalEntry = canonicalizeSessionEntry(entry);
		const activeBranchAppend = !preserveParent && !this.pendingDeliberateAppend && this.appendMode !== "side" && !isSessionTranscriptSideAppendEntry(canonicalEntry);
		const persistenceOptions = {
			...options,
			...activeBranchAppend ? { appendIntent: "active-branch" } : {}
		};
		const preparedTurnAppend = activeBranchAppend && canonicalEntry.type === "message" && (canonicalEntry.message.role === "assistant" || canonicalEntry.message.role === "toolResult" || readNestedToolActivity(canonicalEntry.message) !== void 0);
		let attemptOptions = persistenceOptions;
		const admittedUserId = this.persistenceTarget ? resolveSessionTranscriptReadFence(this.persistenceTarget)?.entryId : void 0;
		if (preparedTurnAppend && this.persistenceTarget) {
			const validatedMutationAt = validatePreparedAssistantAppendSync(this.persistenceTarget, canonicalEntry.parentId, admittedUserId);
			if (validatedMutationAt === void 0) throw new SqliteTranscriptMutationConflictError(this.persistenceTarget.sessionId);
			attemptOptions = {
				...persistenceOptions,
				expectedMutationAt: validatedMutationAt
			};
		}
		const preparedMessage = this.persistenceTarget && canonicalEntry.type === "message" ? prepareTranscriptMessageAppend({
			message: canonicalEntry.message,
			config: options?.config
		}) : void 0;
		if (preparedMessage && canonicalEntry.type === "message" && (canonicalEntry.message.role === "assistant" || canonicalEntry.message.role === "toolResult") && this.persistenceTarget) {
			const envelope = {
				type: "message",
				id: canonicalEntry.id,
				parentId: canonicalEntry.parentId,
				timestamp: canonicalEntry.timestamp
			};
			const eventJson = `${JSON.stringify(envelope).slice(0, -1)},"message":${preparedMessage.messageJson}}`;
			const physical = withOpenClawAgentDatabaseReadOnly(({ db }) => prepareTranscriptPayloadForReuse(db, eventJson, {
				...envelope,
				message: preparedMessage.persistedMessage
			}), toDatabaseOptions(resolveSqliteTranscriptScope(this.persistenceTarget)));
			if (physical.found) preparedMessage.physicalPayload = physical.value;
		}
		let persistenceResult;
		try {
			persistenceResult = this.persistRecord(canonicalEntry, attemptOptions, preparedMessage);
		} catch (error) {
			const retryableExplicitParentAppend = this.pendingDeliberateAppend || this.appendMode === "side" || isSessionTranscriptSideAppendEntry(canonicalEntry);
			if (!activeBranchAppend && !retryableExplicitParentAppend || !(error instanceof SqliteTranscriptMutationConflictError)) throw error;
			if (!(retryableExplicitParentAppend || canonicalEntry.type !== "message" || canonicalEntry.message.role === "user" || preparedTurnAppend)) throw error;
			let expectedMutationAt;
			if (preparedTurnAppend) {
				expectedMutationAt = this.persistenceTarget ? validatePreparedAssistantAppendSync(this.persistenceTarget, canonicalEntry.parentId, admittedUserId) : void 0;
				if (expectedMutationAt === void 0) throw error;
			} else expectedMutationAt = this.persistenceTarget ? readTranscriptMutationAtSync(this.persistenceTarget) : null;
			const retryOptions = {
				...persistenceOptions,
				expectedMutationAt
			};
			persistenceResult = this.persistRecord(canonicalEntry, retryOptions, preparedMessage);
		}
		return this.adoptPersistedEntry(canonicalEntry, persistenceResult, admittedUserId, (append) => {
			if (append) this.reloadPersistedTranscriptAfterAppend(append.expectedMutationAt, append.expectedEntryId, append.admittedUserId);
			else this.reloadPersistedTranscriptSync();
		});
	}
	async adoptWorkerCommittedEntry(entry, committed, admittedUserId) {
		if (committed.viewFailure instanceof SessionManagerActorCommittedError) throw committed.viewFailure;
		if (this.hasNewerPublishedTranscriptView(committed.committedVersion)) {
			if (committed.result?.adoptedMessageId && !committed.result.appended && this.resolveCurrentTurnEntryId(isTalkRealtimeVoiceEntry) !== committed.result.adoptedMessageId) throw new Error(`Session transcript keyed user is outside the current turn: ${committed.result.adoptedMessageId}`);
			return {
				entry: {
					...entry,
					id: committed.result?.adoptedMessageId ?? entry.id,
					parentId: committed.result?.effectiveParentId !== void 0 ? committed.result.effectiveParentId : entry.parentId
				},
				anchor: committed.result?.anchor,
				lifecycleRevision: committed.result?.lifecycleRevision,
				appended: committed.result?.appended ?? true,
				viewWasSuperseded: true
			};
		}
		if (committed.viewFailure) throw committed.viewFailure;
		const needsReload = committed.result?.adoptedMessageId || committed.result?.reloadAfterAppend || committed.result?.effectiveParentId !== void 0 && committed.result.effectiveParentId !== entry.parentId;
		const reload = committed.reload ?? (needsReload && this.persistenceTarget ? await readCommittedSessionManagerReload(this.persistenceTarget, this.boundedContextLimits) : void 0);
		this.transcriptVersion = committed.committedVersion;
		this.transcriptMutationAt = committed.committedVersion.updatedAt;
		return this.adoptPersistedEntry(entry, committed.result, admittedUserId, (append) => {
			if (!reload) throw new Error("Committed session append did not supply its transcript reload");
			this.adoptPreparedTranscriptReload(reload, append);
		});
	}
	adoptPersistedEntry(canonicalEntry, persistenceResult, admittedUserId, reload) {
		if (persistenceResult?.adoptedMessageId) {
			reload();
			if (this.resolveCurrentTurnEntryId(isTalkRealtimeVoiceEntry) !== persistenceResult.adoptedMessageId) throw new Error(`Session transcript keyed user is outside the current turn: ${persistenceResult.adoptedMessageId}`);
			canonicalEntry.id = persistenceResult.adoptedMessageId;
		} else if (persistenceResult?.reloadAfterAppend || persistenceResult?.effectiveParentId !== void 0 && persistenceResult.effectiveParentId !== canonicalEntry.parentId) {
			if (admittedUserId) {
				if (this.transcriptMutationAt === void 0) throw new Error("Session transcript append mutation fence was not returned");
				reload({
					expectedMutationAt: this.transcriptMutationAt,
					expectedEntryId: canonicalEntry.id,
					admittedUserId
				});
			} else reload();
		} else if (this.boundedContextIncomplete && transcriptEventContextEligibility(canonicalEntry) === 0) {
			const parentId = !isSessionTranscriptSideAppendEntry(canonicalEntry) && canonicalEntry.parentId === this.appendParentId && this.leafId !== this.appendParentId ? this.leafId : this.resolveCanonicalParentId(canonicalEntry.parentId);
			if (this.appendParentId && this.appendParentId !== this.leafId && !this.appendMode) this.opaqueParentsById.delete(this.appendParentId);
			this.opaqueParentsById.set(canonicalEntry.id, parentId);
			this.appendParentId = canonicalEntry.id;
			if (isSessionTranscriptSideAppendEntry(canonicalEntry)) this.appendMode = "side";
			else {
				this.leafId = parentId;
				this.appendMode = void 0;
			}
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
				this.cacheTtlProjectionPrefixes = this.cacheTtlProjectionPrefixes?.flatMap((prefix) => {
					if (prefix.anchorIds.length) return [prefix];
					return canonicalEntry.type === "reset" || canonicalEntry.type === "branch_summary" ? [] : [{
						...prefix,
						anchorIds: [canonicalEntry.id]
					}];
				});
			}
			if (canonicalEntry.type === "label") {
				if (canonicalEntry.label) {
					this.labelsById.set(canonicalEntry.targetId, canonicalEntry.label);
					this.labelTimestampsById.set(canonicalEntry.targetId, canonicalEntry.timestamp);
				} else {
					this.labelsById.delete(canonicalEntry.targetId);
					this.labelTimestampsById.delete(canonicalEntry.targetId);
				}
			}
		}
		this.pendingDeliberateAppend = false;
		if (canonicalEntry.type === "message") this.#lastMessageAppend = persistenceResult?.anchor ? {
			anchor: Object.freeze({ ...persistenceResult.anchor }),
			target: this.getSessionTarget()
		} : void 0;
		return {
			entry: canonicalEntry,
			anchor: persistenceResult?.anchor,
			lifecycleRevision: persistenceResult?.lifecycleRevision,
			appended: persistenceResult?.appended ?? true
		};
	}
	resolveCurrentTurnEntryId(isInterruptedTail, options) {
		this.assertTranscriptViewAvailable();
		const includeOmitted = options?.includeOmittedCustomMessages === true;
		if (includeOmitted) prepareSessionManagerSync("resolveCurrentTurnEntryId", this.persistenceTarget, this, "openAsync, then resolveCurrentTurnEntryId without includeOmittedCustomMessages");
		return resolveCurrentTurnEntryId({
			target: this.persistenceTarget,
			entries: this.byId,
			parentId: this.appendParentId,
			remainingAncestors: includeOmitted ? this.boundedContextLimits?.maxEvents ?? this.byId.size + this.opaqueParentsById.size : this.byId.size,
			isInterruptedTail
		}, includeOmitted);
	}
	[sessionManagerPrepareCurrentTurnReplay](isInterruptedTail, matchesUser, signal) {
		return prepareCurrentTurnReplaySelection(() => {
			this.assertTranscriptViewAvailable();
			return {
				target: this.persistenceTarget,
				version: this.transcriptVersion,
				entries: this.byId,
				parentId: this.appendParentId,
				remainingAncestors: this.boundedContextLimits?.maxEvents ?? this.byId.size + this.opaqueParentsById.size,
				isInterruptedTail,
				pendingDeliberateAppend: this.pendingDeliberateAppend
			};
		}, matchesUser, signal, this);
	}
	/** @deprecated Await appendMessageAsync. Supported through 2026-12-31. */
	appendMessage(message, options) {
		prepareSessionManagerSync("appendMessage", this.persistenceTarget, this);
		return this.appendMessageWithTranscriptAnchorSync(message, options).entryId;
	}
	async appendMessageAsync(message, options) {
		return (await this.appendMessageWithTranscriptAnchorAsync(message, options)).entryId;
	}
	async appendMessageWithTranscriptAnchorAsync(message, options) {
		if (message.role === "assistant") applyAssistantDeliveryDirectives(message);
		const appended = await this.appendEntryAsync({
			type: "message",
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			message
		}, options);
		return {
			entryId: appended.entry.id,
			message: appended.entry.message,
			anchor: appended.anchor,
			lifecycleRevision: appended.lifecycleRevision,
			appended: appended.appended,
			...appended.viewWasSuperseded ? { viewWasSuperseded: true } : {}
		};
	}
	/** @deprecated Await appendMessageWithTranscriptAnchorAsync. Supported through 2026-12-31. */
	appendMessageWithTranscriptAnchor(message, options) {
		prepareSessionManagerSync("appendMessageWithTranscriptAnchor", this.persistenceTarget, this);
		return this.appendMessageWithTranscriptAnchorSync(message, options);
	}
	appendMessageWithTranscriptAnchorSync(message, options) {
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
};
//#endregion
//#region src/agents/sessions/session-manager-entries.ts
var SessionManagerEntries = class extends SessionManagerAppend {
	createEntry(data, timestamp = Date.now()) {
		return {
			...data,
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: new Date(timestamp).toISOString()
		};
	}
	async appendCompactionAsync(summary, firstKeptEntryId, tokensBefore, details, fromHook, metadata, tokensAfter) {
		const entry = this.createEntry({
			type: "compaction",
			summary,
			firstKeptEntryId,
			tokensBefore,
			...tokensAfter !== void 0 ? { tokensAfter } : {},
			details,
			fromHook,
			...metadata?.runId || metadata?.itemId ? { __openclaw: metadata } : {}
		});
		await this.appendEntryAsync(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
	/** @deprecated Await appendCompactionAsync. Supported through 2026-12-31. */
	appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook, metadata, tokensAfter) {
		prepareSessionManagerSync("appendCompaction", this.persistenceTarget, this);
		const entry = this.createEntry({
			type: "compaction",
			summary,
			firstKeptEntryId,
			tokensBefore,
			...tokensAfter !== void 0 ? { tokensAfter } : {},
			details,
			fromHook,
			...metadata?.runId || metadata?.itemId ? { __openclaw: metadata } : {}
		});
		this.appendEntry(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
	async appendResetBoundaryAsync(reason, firstKeptEntryId) {
		const entry = this.createEntry({
			type: "reset",
			reason,
			...firstKeptEntryId ? { firstKeptEntryId } : {}
		});
		await this.appendEntryAsync(entry);
		return entry.id;
	}
	/** @deprecated Await appendResetBoundaryAsync. Supported through 2026-12-31. */
	appendResetBoundary(reason, firstKeptEntryId) {
		prepareSessionManagerSync("appendResetBoundary", this.persistenceTarget, this);
		const entry = this.createEntry({
			type: "reset",
			reason,
			...firstKeptEntryId ? { firstKeptEntryId } : {}
		});
		this.appendEntry(entry);
		return entry.id;
	}
	async appendCustomEntryAsync(customType, data) {
		const entry = this.createEntry({
			type: "custom",
			customType,
			data,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
		await this.appendEntryAsync(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	/** @deprecated Await appendCustomEntryAsync. Supported through 2026-12-31. */
	appendCustomEntry(customType, data) {
		prepareSessionManagerSync("appendCustomEntry", this.persistenceTarget, this);
		const entry = this.createEntry({
			type: "custom",
			customType,
			data,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	async appendSessionInfoAsync(name) {
		const entry = this.createEntry({
			type: "session_info",
			name: name.replace(/[\r\n]+/g, " ").trim()
		});
		await this.appendEntryAsync(entry);
		return entry.id;
	}
	/** @deprecated Await appendSessionInfoAsync. Supported through 2026-12-31. */
	appendSessionInfo(name) {
		prepareSessionManagerSync("appendSessionInfo", this.persistenceTarget, this);
		const entry = this.createEntry({
			type: "session_info",
			name: name.replace(/[\r\n]+/g, " ").trim()
		});
		this.appendEntry(entry);
		return entry.id;
	}
	async appendCustomMessageEntryAsync(customType, content, display, details, timestamp) {
		const entry = this.createEntry({
			type: "custom_message",
			customType,
			content,
			display,
			details
		}, timestamp);
		await this.appendEntryAsync(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	/** @deprecated Await appendCustomMessageEntryAsync. Supported through 2026-12-31. */
	appendCustomMessageEntry(customType, content, display, details, timestamp) {
		prepareSessionManagerSync("appendCustomMessageEntry", this.persistenceTarget, this);
		const entry = this.createEntry({
			type: "custom_message",
			customType,
			content,
			display,
			details
		}, timestamp);
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	async appendLeafControlAsync(params) {
		const captured = { ...params };
		return await withSessionManagerAppend(this, async (admission) => {
			this.assertTranscriptWriteActive();
			this.validateLeafControl(captured);
			if (!admission) return this.appendLeafControlSync(captured);
			const entry = this.createSelectedLeafControl(captured);
			const target = this.getSessionTarget();
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const committed = await this.persistWorkerRecord(entry, void 0, admission, void 0, void 0, this.transcriptMutationAt, false, assertNavigation);
			try {
				if (!sameSessionTranscriptTargetBinding(target, this.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
				assertNavigation();
				if (committed.viewFailure instanceof SessionManagerActorCommittedError) throw committed.viewFailure;
				if (!this.hasNewerPublishedTranscriptView(committed.committedVersion)) {
					if (committed.viewFailure) throw committed.viewFailure;
					this.transcriptVersion = committed.committedVersion;
					this.transcriptMutationAt = committed.committedVersion.updatedAt;
					if (committed.reload) this.adoptPreparedTranscriptReload(committed.reload);
					else this.adoptLeafSelection(entry, captured);
				}
				return entry;
			} catch (cause) {
				const error = new Error("Session leaf committed, but its view could not be adopted; do not replay the write", { cause });
				recordModelFallbackStop(error);
				this.invalidateTranscriptView(error);
				throw error;
			}
		});
	}
	/** @deprecated Await appendLeafControlAsync. Supported through 2026-12-31. */
	appendLeafControl(params) {
		prepareSessionManagerSync("appendLeafControl", this.persistenceTarget, this);
		return this.appendLeafControlSync(params);
	}
	validateLeafControl(params) {
		this.assertTranscriptViewAvailable();
		if (params.targetId !== null && !this.byId.has(params.targetId)) throw new Error(`Entry ${params.targetId} not found`);
		if (params.appendParentId !== null && !this.byId.has(params.appendParentId) && !this.opaqueParentsById.has(params.appendParentId)) throw new Error(`Append parent ${params.appendParentId} not found`);
	}
	appendLeafControlSync(params) {
		this.validateLeafControl(params);
		const entry = this.createSelectedLeafControl(params);
		this.persistRecord(entry);
		this.adoptLeafSelection(entry, params);
		return entry;
	}
	createSelectedLeafControl(params) {
		const previousLeafId = this.leafId;
		this.leafId = params.targetId;
		const entry = this.createLeafControl(this.appendParentId, params.appendParentId, params.appendMode);
		this.leafId = previousLeafId;
		return entry;
	}
	adoptLeafSelection(entry, params) {
		this.rememberLeafControl(entry);
		this.leafId = params.targetId;
		this.appendParentId = params.appendParentId;
		this.appendMode = params.appendMode;
		this.pendingDeliberateAppend = false;
		this.cacheTtlProjectionPrefixes = this.cacheTtlProjectionPrefixes?.filter((prefix) => prefix.anchorIds.length > 0);
	}
	async appendLabelChangeAsync(targetId, label) {
		const entry = this.createEntry({
			type: "label",
			targetId,
			label
		});
		await this.appendEntryAsync(entry);
		return entry.id;
	}
	/** @deprecated Await appendLabelChangeAsync. Supported through 2026-12-31. */
	appendLabelChange(targetId, label) {
		prepareSessionManagerSync("appendLabelChange", this.persistenceTarget, this);
		this.assertTranscriptViewAvailable();
		if (!this.byId.has(targetId)) throw new Error(`Entry ${targetId} not found`);
		const entry = this.createEntry({
			type: "label",
			targetId,
			label
		});
		this.appendEntry(entry);
		return entry.id;
	}
	buildSessionContext() {
		return buildSessionContext(this.getBranch());
	}
	/** Omitted projection metadata follows its retained branch anchors, outside model history. */
	getToolResultProjectionEntries() {
		let entries = this.getBranch();
		for (const prefix of this.cacheTtlProjectionPrefixes ?? []) {
			const anchor = prefix.anchorIds.length ? entries.findIndex((entry) => prefix.anchorIds.some((id) => id === entry.id)) : entries.length;
			if (anchor >= 0) entries = [
				...entries.slice(0, anchor),
				...prefix.entries,
				...entries.slice(anchor)
			];
		}
		return entries;
	}
	async branchAsync(branchFromId) {
		await withSessionManagerWrite(this, async () => {
			if (!this.byId.has(branchFromId)) await this.ensureCompletePersistedHistoryAsync();
			this.selectBranch(branchFromId);
		});
	}
	/** @deprecated Await branchAsync. Supported through 2026-12-31. */
	branch(branchFromId) {
		prepareSessionManagerSync("branch", this.persistenceTarget, this);
		this.branchSync(branchFromId);
	}
	branchSync(branchFromId) {
		this.assertTranscriptViewAvailable();
		if (!this.byId.has(branchFromId)) this.ensureCompletePersistedHistory();
		this.selectBranch(branchFromId);
	}
	selectBranch(branchFromId) {
		const branchTargetId = this.resolveBranchTargetId(branchFromId);
		if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
		this.recordTranscriptNavigationChange();
		this.leafId = branchTargetId;
		this.appendParentId = branchTargetId;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = true;
	}
	resetLeaf() {
		this.assertTranscriptViewAvailable();
		this.recordTranscriptNavigationChange();
		this.leafId = null;
		this.appendParentId = null;
		this.appendMode = void 0;
		this.pendingDeliberateAppend = true;
	}
	async resetLeafAsync() {
		await withSessionManagerWrite(this, () => this.resetLeaf());
	}
	async branchWithSummaryAsync(branchFromId, summary, details, fromHook) {
		return await withSessionManagerWrite(this, async () => {
			if (branchFromId !== null && !this.byId.has(branchFromId)) await this.ensureCompletePersistedHistoryAsync();
			const entry = this.createBranchSummary(branchFromId, summary, details, fromHook);
			await this.appendEntryAsync(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 }, true);
			return entry.id;
		});
	}
	/** @deprecated Await branchWithSummaryAsync. Supported through 2026-12-31. */
	branchWithSummary(branchFromId, summary, details, fromHook) {
		prepareSessionManagerSync("branchWithSummary", this.persistenceTarget, this);
		if (branchFromId !== null && !this.byId.has(branchFromId)) this.ensureCompletePersistedHistory();
		const entry = this.createBranchSummary(branchFromId, summary, details, fromHook);
		this.appendEntry(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 });
		return entry.id;
	}
	createBranchSummary(branchFromId, summary, details, fromHook) {
		const branchTargetId = branchFromId === null ? null : this.resolveBranchTargetId(branchFromId);
		if (branchTargetId === void 0) throw new Error(`Entry ${branchFromId} not found`);
		return {
			type: "branch_summary",
			id: generateSessionEntryId(),
			parentId: branchTargetId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			fromId: branchTargetId ?? "root",
			summary,
			details,
			fromHook
		};
	}
};
//#endregion
//#region src/agents/sessions/session-manager-metadata.ts
var SessionManagerMetadata = class extends SessionManagerEntries {
	async appendMetadataEntry(change) {
		const publication = captureSessionMetadataPublication(this, change);
		return await withSessionManagerAppend(this, async (admission) => {
			this.assertTranscriptViewAvailable();
			const entry = {
				...change,
				id: generateSessionEntryId(),
				parentId: this.appendParentId,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (!admission) {
				const appended = this.appendEntry(entry);
				return this.publishMetadataCommit({
					entry: appended.entry,
					version: this.transcriptVersion,
					target: publication.target
				}, publication.publish);
			}
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const canonical = canonicalizeSessionEntry(entry);
			const appendIntent = !this.pendingDeliberateAppend && this.appendMode !== "side" ? "active-branch" : void 0;
			const admittedUserId = this.persistenceTarget ? resolveSessionTranscriptReadFence(this.persistenceTarget)?.entryId : void 0;
			const committedTarget = publication.target;
			const committed = await this.persistWorkerRecord(canonical, appendIntent, admission, void 0, void 0, void 0, true, assertNavigation);
			const { result, committedVersion, viewFailure } = committed;
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
				assertNavigation();
				await this.adoptWorkerCommittedEntry(canonical, committed, admittedUserId);
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
};
//#endregion
//#region src/agents/sessions/session-manager-branching.ts
var SessionManagerBranching = class SessionManagerBranching extends SessionManagerMetadata {
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
		return withSessionManagerWrite(this, async (admission) => {
			this.assertTranscriptWriteActive();
			if (this.persistenceTarget && this.boundedContextIncomplete) await this.ensureCompletePersistedHistoryAsync();
			this.assertTranscriptWriteActive();
			const assertNavigation = this.captureTranscriptNavigationAssertion();
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
			const labelEntries = [];
			let parentId = branchPath.tailId;
			for (const [targetId, label] of this.labelsById) {
				if (!pathEntryIds.has(targetId)) continue;
				const labelEntry = {
					type: "label",
					id: generateSessionEntryId(),
					parentId,
					timestamp: this.labelTimestampsById.get(targetId),
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
			if (persistenceTarget && admission) {
				const identity = { ...persistenceTarget };
				const version = this.transcriptVersion;
				const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
				const assertDestinationOwned = captureOwnedTranscriptWriteAssertion({
					...identity,
					sessionId: newSessionId
				});
				const assertCurrent = () => {
					admission.assertCurrent();
					this.assertTranscriptWriteActive();
					assertOwned();
					assertNavigation();
					if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== version) throw new Error("Session transcript changed during branch preparation");
				};
				const { restoreSessionColdTranscript } = await import("./session-cold-storage-Doo7Aerf.mjs");
				if (!("withMetadata" in admission.database)) await restoreSessionColdTranscript(persistenceTarget, assertCurrent);
				const reader = prepareSessionManagerHydration(persistenceTarget, { lane: targetDiscoveryLane });
				const facts = await reader.readMaintenance({ operation: "version" });
				reader.assertCurrent();
				assertCurrent();
				const { withSessionMetadataWorker } = await import("./session-manager-metadata-runtime-BVaK_rGu.mjs");
				assertCurrent();
				const fencedTarget = withOwnedSessionTranscriptWriterFence(persistenceTarget);
				const { env: _env, ...scope } = fencedTarget;
				const assertBranchCurrent = () => {
					assertCurrent();
					assertDestinationOwned();
				};
				let adopted = false;
				const receipt = await receiveSessionManagerCommit("session.transcript.branch", () => withSessionMetadataWorker(admission.options, admission.database, assertBranchCurrent, (worker) => worker.execute({
					type: "session.transcript.branch",
					input: {
						scope: {
							...scope,
							storePath: admission.database.path
						},
						branch: {
							sessionId: newSessionId,
							events: branch.getPersistedFileEntries()
						},
						expectedLifecycleRevision: facts.lifecycleRevision
					}
				}), { beforeIdentityPublication: (publication) => {
					const transcript = publication.transcriptPublication.flatMap((committedReceipt) => [...committedReceipt.facts.values()]).find((fact) => fact.kind === "postimage" && fact.value.sessionKey === scope.sessionKey && fact.value.sessionId === newSessionId);
					if (transcript?.kind !== "postimage") throw new Error("Committed session branch omitted its transcript postimage");
					this.assertTranscriptViewAvailable();
					assertNavigation();
					if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== version) throw new Error("Session transcript changed before branch publication");
					const { generation, rawSeq, updatedAt } = transcript.value;
					adoptBranch({
						...fencedTarget,
						sessionId: newSessionId
					}, {
						generation,
						rawSeq,
						updatedAt
					});
					adopted = true;
				} }));
				const committed = receipt.value;
				if (committed.projectionNeedsReconcile && !receipt.failure) startSessionTranscriptIndexReconcile({
					...admission.options,
					preferredSessionId: newSessionId
				});
				let failure;
				try {
					if (receipt.failure) throw receipt.failure;
					if (!adopted) {
						assertCurrent();
						adoptBranch({
							...fencedTarget,
							sessionId: newSessionId
						}, committed.version);
					}
				} catch (cause) {
					failure = { cause };
				}
				try {
					if ("withMetadata" in admission.database) publishCommittedSessionIdentity(scope.agentId, admission.database.identity.incarnation, committed.identity.previous, committed.identity.current);
				} catch (cause) {
					failure = { cause: failure ? new AggregateError([failure.cause, cause], "Branch adoption and identity publication failed", { cause: failure.cause }) : cause };
				}
				if (failure) {
					const error = Object.assign(new Error("Session branch committed, but publication did not complete; do not replay the branch", { cause: failure.cause }), {
						name: "SessionBranchCommittedError",
						committedSessionId: newSessionId,
						committedTarget: {
							...fencedTarget,
							sessionId: newSessionId
						},
						committedVersion: committed.version
					});
					recordModelFallbackStop(error);
					this.invalidateTranscriptView(error);
					throw error;
				}
			} else adoptBranch();
			return persistenceTarget ? newSessionId : void 0;
		});
	}
};
//#endregion
//#region src/agents/sessions/session-manager.ts
/**
* Session tree manager backed by an explicit SQLite transcript identity.
*
* The public facade lives here; codec, storage, persistence, and branching
* behavior are split into focused internal modules.
*/
var SessionManager = class SessionManager extends SessionManagerBranching {
	constructor(cwd, persistenceTarget, loadedEntries, boundedContext, version) {
		super(cwd, persistenceTarget, loadedEntries, boundedContext, version);
		this.retainTranscriptWriter();
	}
	[sessionManagerReadTranscriptStart]() {
		this.assertTranscriptWriteActive();
		const target = this.persistenceTarget;
		const version = this.transcriptVersion;
		return target && version ? {
			agentId: target.agentId,
			sessionId: target.sessionId,
			sessionKey: target.sessionKey,
			storePath: target.storePath,
			generation: version.generation,
			maxSeq: version.rawSeq
		} : null;
	}
	async [sessionManagerReadInitialContext]() {
		const prepared = this.preparedInitialContext;
		this.preparedInitialContext = void 0;
		if (!this.persistenceTarget || !this.boundedContextLimits || this.pendingDeliberateAppend) return this.buildSessionContext();
		const initial = this.captureTranscriptView();
		const target = this.persistenceTarget;
		const cwd = this.cwd;
		const reader = prepared && getOwnedSessionTranscriptReader(target);
		if (prepared && reader && !resolveSessionTranscriptReadFence(target) && prepared.writeToken === readSqliteDatabaseWriteTokenForPath(reader.database.path) && Object.keys(prepared.view).every((key) => Reflect.get(prepared.view, key) === Reflect.get(initial, key))) {
			this.assertTranscriptWriteActive();
			reader.assertCurrent();
			return buildSessionContext(prepared.branch);
		}
		const context = await readSessionManagerModelContextAsync(target, { limits: this.boundedContextLimits }, (snapshot) => SessionManager.fromSelectedEntries(snapshot.events, cwd), this);
		const current = this.captureTranscriptView();
		if (Object.keys(initial).some((key) => Reflect.get(initial, key) !== Reflect.get(current, key))) throw new Error("Session manager changed during initial context read");
		return buildSessionContext(context.getBranch());
	}
	/** No buffered writes remain here; asynchronous metadata methods own their settlement. */
	flushPendingPersistence() {}
	/** @deprecated Await appendMessageAsync. Supported through 2026-12-31. */
	appendMessage(message, options) {
		return super.appendMessage(message, options);
	}
	/** @deprecated Await appendMessageWithTranscriptAnchorAsync. Supported through 2026-12-31. */
	appendMessageWithTranscriptAnchor(message, options) {
		return super.appendMessageWithTranscriptAnchor(message, options);
	}
	/** @deprecated Await prepareTranscriptRewriteAsync and its commit. Supported through 2026-12-31. */
	prepareTranscriptRewrite() {
		prepareSessionManagerSync("prepareTranscriptRewrite", this.persistenceTarget, this);
		this.assertTranscriptWriteActive();
		const publish = this.persistenceTarget ? prepareTranscriptRewriteSync(this.persistenceTarget, () => this.assertTranscriptWriteActive(), this.transcriptVersion) : void 0;
		const rewrite = this.prepareTranscriptRewriteView(publish);
		return {
			sessionManager: rewrite.sessionManager,
			commit: (ids) => runSessionPersistenceSync(rewrite.commit(ids))
		};
	}
	/** Preparation returns a detached branch; only its awaited commit publishes changes. */
	async prepareTranscriptRewriteAsync() {
		return withSessionManagerWrite(this, async (writeAdmission) => {
			this.assertTranscriptWriteActive();
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const target = this.persistenceTarget;
			if (!target) {
				const detachedView = cloneTranscriptView(this.captureTranscriptView());
				const assertPrepared = () => {
					assertNavigation();
					if (this.persistenceTarget || !isDeepStrictEqual(this.captureTranscriptView(), detachedView)) throw new Error("Session transcript changed before rewrite publication");
				};
				const rewrite = this.prepareTranscriptRewriteView(void 0, void 0, assertPrepared);
				return {
					sessionManager: rewrite.sessionManager,
					commit: async (ids) => {
						assertPrepared();
						return withSessionManagerWrite(this, () => {
							assertPrepared();
							return runSessionPersistenceAsync(rewrite.commit(ids));
						});
					}
				};
			}
			const identity = { ...target };
			const loadedVersion = this.transcriptVersion;
			const appendParentId = this.appendParentId;
			const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
			const assertCurrent = () => {
				writeAdmission?.assertCurrent();
				this.assertTranscriptWriteActive();
				assertOwned();
				assertNavigation();
				if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== loadedVersion) throw new Error("Session transcript changed before rewrite publication");
			};
			if (!loadedVersion) throw new Error("Session transcript changed before rewrite publication");
			const rewrite = this.prepareTranscriptRewriteView(void 0, async (entries, sources, adopt) => {
				await withSessionManagerWrite(this, async (admission) => {
					assertCurrent();
					if (!admission) throw new Error("Transcript rewrite lost its persistent owner");
					const assertCommitCurrent = () => {
						admission.assertCurrent();
						assertCurrent();
					};
					for (const entry of entries) if (entry.type === "message") entry.message = sanitizeTranscriptMessageForStorage(entry.message);
					const { withSessionMetadataWorker } = await import("./session-manager-metadata-runtime-BVaK_rGu.mjs");
					assertCommitCurrent();
					const { env: _env, ...scope } = withOwnedSessionTranscriptWriterFence(target);
					const receipt = await receiveSessionManagerCommit("session.transcript.rewrite", () => withSessionMetadataWorker(admission.options, admission.database, assertCommitCurrent, (worker) => worker.execute({
						type: "session.transcript.rewrite",
						input: {
							scope: {
								...scope,
								storePath: admission.database.path
							},
							appendParentId,
							version: loadedVersion,
							entries,
							sources: [...sources]
						}
					})));
					const committed = receipt.value;
					if (committed.projectionNeedsReconcile && !receipt.failure) startSessionTranscriptIndexReconcile({
						...admission.options,
						preferredSessionId: identity.sessionId
					});
					try {
						if (receipt.failure) throw receipt.failure;
						assertCommitCurrent();
						for (const [index, entry] of committed.entries.entries()) Object.assign(entries[index], entry);
						adopt(committed.version);
					} catch (cause) {
						const error = new Error("Session transcript rewrite committed but view publication failed", { cause });
						this.invalidateTranscriptView(error);
						throw error;
					}
				});
			});
			return {
				sessionManager: rewrite.sessionManager,
				commit: (ids) => withSessionManagerWrite(this, () => runSessionPersistenceAsync(rewrite.commit(ids)))
			};
		});
	}
	prepareTranscriptRewriteView(publish, publishAsync, assertBeforeCommit) {
		const prepared = SessionManager.inMemory(this.cwd);
		Object.assign(prepared, cloneTranscriptView(this.captureTranscriptView()));
		const initialEntryCount = prepared.fileEntries.length;
		const persistedBoundaryCount = prepared.persistedBoundaryCount;
		prepared.persistedBoundaryCount = void 0;
		const loadedBoundaryCount = prepared.getBoundaryCount();
		return {
			sessionManager: prepared,
			commit: function* (rewrittenEntryIds) {
				const publication = SessionManager.inMemory(prepared.cwd);
				Object.assign(publication, cloneTranscriptView(prepared.captureTranscriptView()));
				const entries = publication.fileEntries.slice(initialEntryCount).filter((entry) => entry.type !== "session");
				const sources = /* @__PURE__ */ new Map();
				for (const [sourceId, destination] of rewrittenEntryIds) {
					const source = this.byId.get(sourceId);
					if (!source) throw new Error("Transcript rewrite source is not in the loaded view");
					sources.set(destination, source);
					for (const prefix of publication.cacheTtlProjectionPrefixes ?? []) if (prefix.anchorIds.includes(sourceId)) prefix.anchorIds.push(destination);
				}
				const first = entries[0];
				const source = first && sources.get(first.id);
				const parentId = source ? this.boundedParentIds.get(source.id) : void 0;
				if (first?.parentId === null && parentId !== void 0) {
					first.parentId = parentId;
					publication.boundedParentIds.set(first.id, first.parentId);
				}
				for (const entry of entries) entry.appendMode = "side";
				publication.buildIndex();
				for (const [id, parent] of this.opaqueParentsById) publication.opaqueParentsById.set(id, parent);
				for (const [id, parent] of this.logicalParentsById) publication.logicalParentsById.set(id, parent);
				const last = entries.at(-1);
				const leaf = last ? yield* sessionPersistenceStep(() => publication.appendLeafControlSync({
					targetId: last.id,
					appendParentId: last.id
				}), () => publication.appendLeafControlAsync({
					targetId: last.id,
					appendParentId: last.id
				})) : void 0;
				if (persistedBoundaryCount !== void 0) publication.persistedBoundaryCount = persistedBoundaryCount + publication.getBoundaryCount() - loadedBoundaryCount;
				const adopt = (version = publication.transcriptVersion) => {
					publication.transcriptVersion = version;
					publication.transcriptMutationAt = version?.updatedAt;
					Object.assign(this, publication.captureTranscriptView());
				};
				const events = leaf ? [...entries, leaf] : entries;
				assertBeforeCommit?.();
				yield* sessionPersistenceStep(() => publish ? publish(events, sources, adopt) : adopt(), publishAsync ? () => publishAsync(events, sources, adopt) : void 0);
			}.bind(this)
		};
	}
	/** Opens an existing store off-thread; empty transcripts keep lazy header initialization. */
	static async openAsync(target, cwdOverride, contextLimits, signal) {
		if (contextLimits) return await SessionManager.openBoundedAsync(target, {
			...contextLimits,
			cwd: cwdOverride,
			signal
		});
		const hydration = prepareSessionManagerHydration(target, { signal });
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
		return new SessionManager(cwdOverride ?? header?.cwd ?? cwd, hydration.target, entries, void 0, prepared.snapshot.version);
	}
	/** @deprecated Await openAsync. Supported through 2026-12-31. */
	static open(target, cwdOverride, contextLimits) {
		prepareSessionManagerSync("open", target);
		if (contextLimits) return SessionManager.openBounded(target, {
			...contextLimits,
			...cwdOverride !== void 0 ? { cwd: cwdOverride } : {}
		});
		const capturedTarget = captureSessionTranscriptTargetBinding(target);
		const snapshot = loadTranscriptReadSnapshotSync(capturedTarget);
		const entries = snapshot.events;
		const header = entries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwdOverride ?? header?.cwd ?? process.cwd(), capturedTarget, entries, void 0, snapshot.version);
	}
	/** @deprecated Await openBoundedAsync. Supported through 2026-12-31. */
	static openBounded(target, options) {
		prepareSessionManagerSync("openBounded", target);
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
	static async [sessionManagerOpenTranscriptCohort](target, options, selection, consume) {
		return openSessionManagerBoundedView(target, options, (cwd, captured, context, limits) => {
			const manager = new SessionManager(cwd, captured, context.events, {
				...context,
				limits
			});
			const branch = manager.getBranch();
			const reader = context.completeActivePath && getOwnedSessionTranscriptReader(captured);
			const writeToken = reader && readSqliteDatabaseWriteTokenForPath(reader.database.path);
			if (writeToken && !manager.migrated && branch.length === context.totalEvents) manager.preparedInitialContext = {
				branch: cloneSessionModelContextEntries(manager.getHeader(), branch).filter((entry) => entry.type !== "session"),
				writeToken,
				view: manager.captureTranscriptView()
			};
			return manager;
		}, {
			selection,
			consume,
			captureView: (manager) => manager.captureTranscriptView()
		});
	}
	/** Reads an existing store's bounded view under the history worker's database custody. */
	static async openBoundedAsync(target, options) {
		return openSessionManagerBoundedView(target, options, (cwd, captured, context, limits) => new SessionManager(cwd, captured, context.events, {
			...context,
			limits
		}));
	}
	static detachBounded(source) {
		const detached = SessionManager.fromSelectedEntries([source.getHeader(), ...source.getBranch()], source.getCwd());
		detached.cacheTtlProjectionPrefixes = source.cacheTtlProjectionPrefixes;
		return detached;
	}
	/** Detach the prepared bounded branch without retaining database custody. */
	static async openDetachedBoundedAsync(target, options) {
		return SessionManager.detachBounded(await SessionManager.openBoundedAsync(target, options));
	}
	/** @deprecated Await openDetachedBoundedAsync. Supported through 2026-12-31. */
	static openDetachedBounded(target, options) {
		prepareSessionManagerSync("openDetachedBounded", target);
		return SessionManager.detachBounded(SessionManager.openBounded(target, options));
	}
	/** @deprecated Await openModelContextAsync. Supported through 2026-12-31. */
	static openModelContext(target, options = {}) {
		prepareSessionManagerSync("openModelContext", target);
		const context = withSessionContextAdmission(target, options.admission, () => readSessionTranscriptModelContext(target, options.through, options.limits));
		return SessionManager.fromSelectedEntries(context.events, options.cwd);
	}
	/** The same detached model view, with durable transcript scanning off the event loop. */
	static async openModelContextAsync(target, options = {}) {
		return readSessionManagerModelContextAsync(target, options, (context) => SessionManager.fromSelectedEntries(context.events, options.cwd));
	}
	static fromSelectedEntries(contextEntries, cwd) {
		const entries = contextEntries;
		const header = entries.find((entry) => entry.type === "session");
		if (entries.length > 0) assertCurrentSessionTranscriptHeader(header);
		const manager = new SessionManager(cwd ?? header?.cwd ?? process.cwd(), void 0, entries);
		manager.adoptSelectedTranscriptPath(manager.appendParentId, [...manager.byId].map(([id, entry]) => [id, entry.parentId]));
		return manager;
	}
	/** @deprecated Await readSessionContextAsync. Supported through 2026-12-31. */
	static readSessionContext(target, read, options = {}) {
		prepareSessionManagerSync("readSessionContext", target);
		return withSessionContextAdmission(target, options.admission, () => readSessionTranscriptContextMessages(target, read));
	}
	/** Consume a full-fidelity snapshot while retaining its owner through the consumer. */
	static async readSessionContextAsync(target, read, options = {}) {
		return readSessionManagerContextAsync(target, read, options);
	}
	/**
	* @deprecated Await appendMessageToTranscriptAsync. Supported through 2026-12-31.
	*/
	static appendMessageToTranscript(target, message, options) {
		prepareSessionManagerSync("appendMessageToTranscript", target);
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
	static async appendMessageToTranscriptAsync(target, message, options) {
		return (await appendSessionTranscriptNote(target, message, options)).messageId;
	}
	static inMemory(cwd = process.cwd()) {
		return new SessionManager(cwd);
	}
	static fromEntries(entries, cwdOverride) {
		const fileEntries = structuredClone(entries);
		const header = fileEntries.find((entry) => typeof entry === "object" && entry !== null && entry.type === "session");
		return new SessionManager(cwdOverride ?? header?.cwd ?? process.cwd(), void 0, fileEntries);
	}
};
//#endregion
export { completedTurnMessageAnchor as a, sessionManagerReadTranscriptStart as c, withSessionManagerAppend as d, SessionMetadataCommittedError as f, captureCompletedTurnMessageAnchor as i, withSessionCompactionPersistence as l, sessionManagerOpenTranscriptCohort as n, sessionManagerPrepareCurrentTurnReplay as o, sessionManagerReloadTranscriptCohort as r, sessionManagerReadInitialContext as s, SessionManager as t, withSessionCompactionPersistenceAsync as u };

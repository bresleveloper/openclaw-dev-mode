import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as runInDetachedAsyncContext } from "./async-work-scope-BYeX3gh6.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { H as copyPreparedModelVisibleToolText } from "./redact-DJ8j6ADa.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { n as hydrateOpenClawStateWorkerError, r as retainOpenClawStateWorkerErrorPayload } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./messages-CeqAykcC.mjs";
import { r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE } from "./internal-runtime-context-CAWYwg4i.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { C as parseOpaqueLeafEntry, b as findSessionTranscriptHeader, v as assertCurrentSessionTranscriptHeader, w as parseParentLinkedOpaqueEntry, x as isIndexedSessionEntry } from "./transcript-payload-Yc_w8Yx5.mjs";
import { i as sameSessionTranscriptTargetBinding, n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { a as captureSessionMetadataPublication, i as captureOwnedTranscriptWriteAssertion, o as getOwnedSessionTranscriptInitialWriter, p as withSessionTranscriptWriteAssertion, s as getOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError, u as withOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-H2dQRi8K.mjs";
import { t as buildSessionContext } from "./session-DitLEF2L.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { C as transcriptEventContextEligibility, n as SYNC_REBUILD_MAX_ROWS, t as SYNC_REBUILD_MAX_BYTES } from "./session-transcript-index-FbEuN6S5.mjs";
import { r as isSessionTranscriptSideAppendEntry } from "./transcript-tree-CaYJo8Xs.mjs";
import { o as withSessionContextAdmission, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { a as readNestedToolActivity } from "./nested-tool-activity-CFIuxE4G.mjs";
import { a as publishCommittedSessionIdentity } from "./session-accessor.sqlite-identity-DY_MUUYo.mjs";
import { C as getCodeModeSourceAppend, S as copyCodeModeSourceAppendOptions, l as redactTranscriptMessageForStorage, x as copyCodeModeSourceAppend } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { T as validatePreparedAssistantAppendSync, b as readTranscriptIdentityByEventId, d as loadTranscriptReadSnapshotSync, h as readTranscriptEventAtSeqSync } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { n as ensureSessionEntrySync } from "./session-accessor.sqlite-initial-entry-B_o9uZxg.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { i as walkSessionCurrentTurn } from "./session-entry-navigation-DTnKkJNk.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-BG2hVt5Z.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { n as loadTranscriptSuffixEventsBoundedSync, r as readPreviousIndexedTranscriptEventSync } from "./session-transcript-maintenance-read-CwE1nVb0.mjs";
import { t as prepareSessionTranscriptHydration } from "./session-transcript-hydration-C7VpA1nD.mjs";
import { i as normalizeTranscriptJsonValue, n as prepareTranscriptMessageAppend, r as prepareTranscriptMessageAppendForWorker } from "./session-accessor.sqlite-transcript-message-append-DoBG3JQd.mjs";
import { a as appendTranscriptMessageSnapshotSync, h as replaceTranscriptSuffixEventsSync, n as appendTranscriptEventSnapshotSync, o as appendTranscriptMessageSync, s as replaceSessionWithBranchedTranscript } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { n as requireTranscriptEventAppendSnapshot } from "./session-accessor.sqlite-transcript-append-result-BjgvnUCa.mjs";
import { n as readTranscriptMutationAtSync } from "./session-accessor.sqlite-metadata-read-VWtG2sx_.mjs";
import { a as validateSessionTranscriptContextVersion, i as validateSessionTranscriptContextAnchor, n as readSessionTranscriptModelContext, r as validateSessionTranscriptContextAdmission, t as readSessionTranscriptContextMessages } from "./session-accessor.sqlite-model-context-BsF77Klz.mjs";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-Dcmz1NrH.mjs";
import { d as generateSessionEntryId, i as isTalkRealtimeVoiceEntry, r as isSessionContextMetadataEntry, u as createManagedSessionId } from "./session-manager-codec-Dl5j6GJ-.mjs";
import { t as SessionManagerCore } from "./session-manager-core-AIc6XbHU.mjs";
import { t as prepareTranscriptRewriteSync } from "./session-accessor.sqlite-branch-rewrite-Djr4NbGb.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BXDxJQSp.mjs";
import { r as readSessionTranscriptModelContextAsync } from "./session-transcript-read-worker-runtime-TruAj0Zm.mjs";
import { n as withSessionManagerWrite, t as appendSessionTranscriptNote } from "./session-manager-write-admission-B0F76kpn.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
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
function canonicalizeSessionEntry(entry, options) {
	const sourceAppend = getCodeModeSourceAppend(options);
	const canonicalEntry = normalizeTranscriptJsonValue(entry, "", Boolean(sourceAppend));
	if (!isIndexedSessionEntry(canonicalEntry) || canonicalEntry.type !== entry.type) throw new Error(`Invalid session transcript entry: ${entry.type}`);
	if (entry !== canonicalEntry && entry.type === "message" && canonicalEntry.type === "message") {
		if (entry.message.role === "toolResult" && canonicalEntry.message.role === "toolResult" && Array.isArray(entry.message.content) && Array.isArray(canonicalEntry.message.content)) {
			const canonicalContent = canonicalEntry.message.content;
			entry.message.content.forEach((block, index) => {
				const canonicalBlock = canonicalContent[index];
				if (block?.type === "text" && canonicalBlock?.type === "text") copyPreparedModelVisibleToolText(block, canonicalBlock);
			});
		}
		copyCodeModeSourceAppend(entry.message, canonicalEntry.message, sourceAppend, (source) => source);
	}
	return canonicalEntry;
}
//#endregion
//#region src/agents/sessions/session-manager-persistence-error.ts
function committedTranscriptViewError(payload) {
	const error = /* @__PURE__ */ new Error("Committed session transcript view could not be reconstructed");
	if (payload) retainOpenClawStateWorkerErrorPayload(error, payload);
	return hydrateOpenClawStateWorkerError(error, { includeOrdinary: true });
}
var SessionEntryCommittedError = class extends Error {
	constructor(committedEntryId, committedTarget, committedVersion, cause) {
		super("Session entry committed, but publication did not complete; do not replay the append", { cause });
		this.committedEntryId = committedEntryId;
		this.committedTarget = committedTarget;
		this.committedVersion = committedVersion;
		this.name = "SessionEntryCommittedError";
		recordModelFallbackStop(this);
	}
};
function isSqliteTranscriptMutationConflict(error) {
	let current = error;
	for (let depth = 0; depth < 3 && current instanceof Error; depth += 1) {
		if (current.name === "SqliteTranscriptMutationConflictError") return true;
		current = current.cause;
	}
	return false;
}
//#endregion
//#region src/agents/sessions/session-manager-persistence.ts
var SessionManagerPersistence = class extends SessionManagerCore {
	#initialWriter;
	#navigationEpoch = 0;
	recordTranscriptNavigationChange() {
		this.#navigationEpoch++;
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
		initialWriter.assertActive();
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
	async persistWorkerRecord(entry, appendIntent, writeAdmission, message, beforeFreshMessageCommit, expectedMutationAt, retryMutationConflicts = true, assertNavigation) {
		this.assertTranscriptWriteActive();
		const target = this.persistenceTarget;
		if (!target) throw new Error("Session writer worker requires a persistent session");
		const identity = { ...target };
		const sessionId = this.getSessionId();
		const { database, options } = writeAdmission;
		const { env: _env, ...writeTarget } = withOwnedSessionTranscriptWriterFence(target);
		const captured = {
			...writeTarget,
			storePath: database.path
		};
		if (database.db.isTransaction) throw new Error("Asynchronous session writes must own their transaction");
		const initialWriter = this.#initialWriter;
		const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
		const assertBinding = () => {
			const current = this.persistenceTarget;
			if (this.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(identity, current)) throw new SessionTranscriptWriterClaimReboundError();
		};
		const assertCurrent = () => {
			assertBinding();
			assertNavigation?.();
			initialWriter?.assertActive();
			assertOwned();
		};
		const admission = resolveSessionTranscriptReadFence(captured);
		const persistCompaction = getSessionCompactionPersistenceAsync(this);
		if (entry.type === "compaction" && persistCompaction) {
			if (this.persistenceHeaderPending) throw new Error("Compaction boundary validation failed");
			const committed = await withSessionTranscriptWriteAssertion(identity, assertCurrent, () => persistCompaction({
				scope: identity,
				event: entry,
				...appendIntent ? { appendIntent } : {},
				expectedMutationAt: expectedMutationAt !== void 0 ? expectedMutationAt : this.transcriptMutationAt,
				...initialWriter && !initialWriter.committedFence ? { initializeEntry: true } : {}
			}));
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
		const { withSessionMetadataWorker } = await runInDetachedAsyncContext(() => import("./session-manager-metadata-runtime-D4Yb0-JI.mjs"));
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
					if (committed.identity) publishCommittedSessionIdentity(captured.agentId, readOpenClawAgentDatabaseIdentity(database).identity, committed.identity.previous, committed.identity.current);
				}
				if (!committed.owned) {
					if (captured.expectedWriterRunId !== void 0) throw new SessionTranscriptWriterClaimReboundError();
					throw new Error("Session transcript header was not persisted");
				}
				assertCurrent();
			}
			const appendEvent = async (event, bytes, mutationAt, intent) => {
				const result = await worker.execute({
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
			const append = async (initialMutationAt) => {
				let mutationAt = initialMutationAt;
				if (this.persistenceHeaderPending) {
					const header = this.fileEntries[0];
					if (!header || header.type !== "session") throw new Error("Session transcript header was not persisted");
					const headerSnapshot = (await appendEvent(header, JSON.stringify(header), mutationAt)).snapshot;
					if (!headerSnapshot.ok || !headerSnapshot.value.result?.appended) throw new Error("Session transcript header was not persisted", { cause: headerSnapshot.ok ? void 0 : headerSnapshot.error });
					const committed = headerSnapshot.value;
					assertBinding();
					if (!this.hasNewerPublishedTranscriptView(committed.after)) {
						this.transcriptVersion = committed.after;
						this.transcriptMutationAt = committed.after.updatedAt;
					}
					this.persistenceHeaderPending = false;
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
					reload: outcome.reload
				};
			};
			let outcome;
			try {
				outcome = await append(expectedMutationAt !== void 0 ? expectedMutationAt : this.transcriptMutationAt);
			} catch (error) {
				if (!retryMutationConflicts || expectedMutationAt !== void 0 || !isSqliteTranscriptMutationConflict(error)) throw error;
				outcome = await append(await worker.execute({
					type: "session.metadata.mutation",
					input: { scope: captured }
				}));
			}
			const { committed, reload } = outcome;
			const receipt = committed.result;
			if (entry.type === "message") {
				if (!("messageId" in receipt) || !message) throw new Error(`Session transcript parent entry was not persisted: ${entry.id}`);
				adoptCommittedMessagePayload(entry, {
					...receipt,
					message: receipt.message ?? message.prepared.persistedMessage
				}, message.idempotencyLookup);
			}
			const effectiveParentId = "effectiveParentId" in receipt && receipt.effectiveParentId !== void 0 ? receipt.effectiveParentId : entry.parentId;
			const reloadAfterAppend = receipt.appended && transcriptAppendNeedsReload(committed.before, loadedVersion);
			return {
				result: {
					appended: receipt.appended,
					..."anchor" in receipt && receipt.anchor ? { anchor: receipt.anchor } : {},
					lifecycleRevision: committed.lifecycleRevision,
					effectiveParentId,
					..."messageId" in receipt && receipt.messageId !== entry.id ? { adoptedMessageId: receipt.messageId } : {},
					...reloadAfterAppend ? { reloadAfterAppend: true } : {}
				},
				reload: reload?.ok ? reload.value : void 0,
				committedVersion: committed.after,
				viewFailure: reload?.ok === false ? committedTranscriptViewError(reload.error) : void 0
			};
		}, { beforeFreshMessageCommit });
	}
	/** @deprecated Await persistAsync. Removal: next Plugin SDK major. */
	persist(entry, options) {
		warnSessionPersistenceDeprecation("SessionManager.persist", "persistAsync");
		return this.persistRecord(entry, options);
	}
	async persistAsync(entry, options) {
		const canonical = { ...canonicalizeSessionEntry(entry, options) };
		return await withSessionManagerWrite(this, async (admission) => {
			const compactionPersistence = getSessionCompactionPersistenceAsync(this);
			if (!admission && compactionPersistence) throw new Error("Compaction boundary validation failed");
			if (!admission || isIncognitoSessionKey(this.persistenceTarget?.sessionKey) && !(canonical.type === "compaction" && compactionPersistence)) return this.persistRecord(canonical, options);
			const target = this.getSessionTarget();
			if (!target) throw new Error("Session writer worker requires a persistent session");
			const capturedTarget = captureSessionTranscriptTargetBinding(target);
			const sessionId = this.getSessionId();
			const assertOwned = captureOwnedTranscriptWriteAssertion(capturedTarget);
			assertOwned();
			const message = canonical.type === "message" ? {
				prepared: prepareTranscriptMessageAppendForWorker(copyCodeModeSourceAppendOptions(options, {
					message: canonical.message,
					config: options?.config
				})),
				cwd: this.cwd,
				validateTurn: false,
				idempotencyLookup: options?.idempotencyLookup
			} : void 0;
			const committed = await this.persistWorkerRecord(canonical, options?.appendIntent, admission, message, options?.beforeFreshMessageCommit, options?.expectedMutationAt, false);
			try {
				if (this.getSessionId() !== sessionId || !sameSessionTranscriptTargetBinding(capturedTarget, this.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
				assertOwned();
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
		});
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
			const previous = this.captureTranscriptView(true);
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
		const outcome = appendTranscriptMessageSnapshotSync(scope, appendOptions, preparedMessage, void 0, viewGuard);
		if (!outcome.ok) throw new Error(`Session transcript message was not persisted: ${entry.id}`, { cause: outcome.error });
		const result = outcome.value.result;
		this.transcriptVersion = outcome.value.after;
		if (!result) throw new Error(`Session transcript message was not persisted: ${entry.id}`);
		if (result.appended) this.transcriptMutationAt = outcome.value.after.updatedAt;
		const effectiveParentId = adoptCommittedMessagePayload(entry, result, options?.idempotencyLookup);
		if (result.messageId !== entry.id) {
			if (!result.anchor) throw new Error(`Session transcript anchor was not returned: ${result.messageId}`);
			return {
				adoptedMessageId: result.messageId,
				anchor: result.anchor,
				appended: result.appended,
				effectiveParentId
			};
		}
		const reloadAfterAppend = result.appended && transcriptAppendNeedsReload(outcome.value.before, loadedVersion);
		return {
			...result.anchor ? { anchor: result.anchor } : {},
			lifecycleRevision: outcome.value.lifecycleRevision,
			appended: result.appended,
			effectiveParentId,
			...reloadAfterAppend ? { reloadAfterAppend: true } : {}
		};
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
	/** @deprecated Use removeTrailingEntriesAsync; removed at the next Plugin SDK major. */
	removeTrailingEntries(predicate, options) {
		warnSessionPersistenceDeprecation("SessionManager.removeTrailingEntries", "removeTrailingEntriesAsync");
		return runSessionPersistenceSync(this.prepareTrailingEntriesRemoval(predicate, options));
	}
	async removeTrailingEntriesAsync(predicate, options) {
		return withSessionManagerWrite(this, async (admission) => {
			if (!admission || isIncognitoSessionKey(this.persistenceTarget?.sessionKey)) return runSessionPersistenceSync(this.prepareTrailingEntriesRemoval(predicate, options));
			const target = this.persistenceTarget;
			const identity = { ...target };
			const version = this.transcriptVersion;
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
			const assertCurrent = () => {
				this.assertTranscriptWriteActive();
				assertOwned();
				assertNavigation();
				if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== version) throw new Error("Session transcript changed during suffix preparation");
			};
			const reader = prepareSessionTranscriptHydration(target);
			const { env: _env, ...scope } = withOwnedSessionTranscriptWriterFence(target);
			const { withSessionMetadataWorker } = await import("./session-manager-metadata-runtime-D4Yb0-JI.mjs");
			assertCurrent();
			return withSessionMetadataWorker(admission.options, admission.database, assertCurrent, async (worker) => runSessionPersistenceAsync(this.prepareTrailingEntriesRemoval(predicate, options, {
				read: async (request) => {
					const result = await reader.readMaintenance(request);
					reader.assertCurrent();
					assertCurrent();
					return result;
				},
				replace: async (args) => {
					const result = await worker.execute({
						type: "session.transcript.replaceSuffix",
						input: {
							scope: {
								...scope,
								storePath: admission.database.path
							},
							args
						}
					});
					if (result.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
						...admission.options,
						preferredSessionId: identity.sessionId
					});
					try {
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
		if (this.persistenceTarget && this.transcriptMutationAt !== void 0) {
			const target = this.persistenceTarget;
			if ((yield* sessionPersistenceStep(() => readTranscriptMutationAtSync(target), worker ? async () => (await worker.read({ operation: "version" })).version?.updatedAt : void 0)) !== this.transcriptMutationAt) throw new Error(`SQLite transcript changed while preparing suffix removal for ${this.persistenceTarget.sessionId}`);
		}
		const candidate = activeBranch[candidateRemoveStart];
		const target = this.persistenceTarget;
		const persistedSuffixStartSeq = (target && isIndexedSessionEntry(candidate) ? yield* sessionPersistenceStep(() => readTranscriptIdentityByEventId(openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptReadScope(target))), target.sessionId, candidate.id)?.seq, worker ? async () => (await worker.read({
			operation: "identity",
			eventId: candidate.id
		})).seq : void 0) : void 0) ?? this.persistedSuffixStartSeq;
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
		const prepared = new SessionManagerSuffixPersistence(this.cwd, void 0, preparedEntries, void 0, this.transcriptMutationAt);
		const restoreOmittedParentAncestry = () => {
			for (const [id, parentId] of this.opaqueParentsById) if (!prepared.byId.has(id) && !prepared.opaqueParentsById.has(id)) prepared.opaqueParentsById.set(id, parentId);
		};
		restoreOmittedParentAncestry();
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
	appendEntryAsync(entry, options, preserveParent = false) {
		const canonical = canonicalizeSessionEntry(entry, options);
		return withSessionManagerWrite(this, async (admission) => {
			this.assertTranscriptWriteActive();
			if (canonical.type === "label" && !this.byId.has(canonical.targetId)) throw new Error(`Entry ${canonical.targetId} not found`);
			if (!preserveParent) canonical.parentId = this.appendParentId;
			const persistCompaction = getSessionCompactionPersistenceAsync(this);
			if (!admission && persistCompaction) throw new Error("Compaction boundary validation failed");
			if (!admission || isIncognitoSessionKey(this.persistenceTarget?.sessionKey) && !(canonical.type === "compaction" && persistCompaction)) {
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
				prepared: prepareTranscriptMessageAppendForWorker(copyCodeModeSourceAppendOptions(options, {
					message: canonical.message,
					config: options?.config
				})),
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
				return this.adoptWorkerCommittedEntry(canonical, committed, admittedUserId);
			} catch (cause) {
				if (committed.result?.appended === false) throw cause;
				const error = new Error("Session entry committed, but its view could not be adopted; do not replay the append", { cause });
				error.name = canonical.type === "message" ? "SessionMessageCommittedError" : "SessionEntryCommittedError";
				recordModelFallbackStop(error);
				this.invalidateTranscriptView(error);
				throw error;
			}
		});
	}
	appendEntry(entry, options, preserveParent = false) {
		this.assertTranscriptViewAvailable();
		const canonicalEntry = canonicalizeSessionEntry(entry, options);
		const activeBranchAppend = !preserveParent && !this.pendingDeliberateAppend && this.appendMode !== "side" && !isSessionTranscriptSideAppendEntry(canonicalEntry);
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
	adoptWorkerCommittedEntry(entry, committed, admittedUserId) {
		if (this.hasNewerPublishedTranscriptView(committed.committedVersion)) {
			if (committed.result?.adoptedMessageId && !committed.result.appended && this.resolveCurrentTurnEntryId(isTalkRealtimeVoiceEntry) !== committed.result.adoptedMessageId) throw new Error(`Session transcript keyed user is outside the current turn: ${committed.result.adoptedMessageId}`);
			return {
				entry: freezeJsonSnapshot({
					...entry,
					id: committed.result?.adoptedMessageId ?? entry.id,
					parentId: committed.result?.effectiveParentId !== void 0 ? committed.result.effectiveParentId : entry.parentId
				}),
				anchor: committed.result?.anchor,
				lifecycleRevision: committed.result?.lifecycleRevision,
				appended: committed.result?.appended ?? true,
				viewWasSuperseded: true
			};
		}
		if (committed.viewFailure) throw committed.viewFailure;
		this.transcriptVersion = committed.committedVersion;
		this.transcriptMutationAt = committed.committedVersion.updatedAt;
		return this.adoptPersistedEntry(entry, committed.result, admittedUserId, committed.reload);
	}
	adoptPersistedEntry(canonicalEntry, persistenceResult, admittedUserId, preparedReload) {
		if (persistenceResult?.adoptedMessageId) {
			if (preparedReload) this.adoptPreparedTranscriptReload(preparedReload);
			else this.reloadPersistedTranscriptSync();
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
			else this.reloadPersistedTranscriptSync();
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
		freezeJsonSnapshot(canonicalEntry);
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
	/** @deprecated Await appendMessageAsync. Removal: next Plugin SDK major. */
	appendMessage(message, options) {
		warnSessionPersistenceDeprecation("SessionManager.appendMessage", "appendMessageAsync");
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
	/** @deprecated Await appendMessageWithTranscriptAnchorAsync. Removal: next Plugin SDK major. */
	appendMessageWithTranscriptAnchor(message, options) {
		warnSessionPersistenceDeprecation("SessionManager.appendMessageWithTranscriptAnchor", "appendMessageWithTranscriptAnchorAsync");
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
	createEntry(data) {
		return {
			...data,
			id: generateSessionEntryId(),
			parentId: this.appendParentId,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
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
	/** @deprecated Await appendCompactionAsync. Removal: next Plugin SDK major. */
	appendCompaction(summary, firstKeptEntryId, tokensBefore, details, fromHook, metadata, tokensAfter) {
		warnSessionPersistenceDeprecation("SessionManager.appendCompaction", "appendCompactionAsync");
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
	/** @deprecated Await appendResetBoundaryAsync. Removal: next Plugin SDK major. */
	appendResetBoundary(reason, firstKeptEntryId) {
		warnSessionPersistenceDeprecation("SessionManager.appendResetBoundary", "appendResetBoundaryAsync");
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
	/** @deprecated Await appendCustomEntryAsync. Removal: next Plugin SDK major. */
	appendCustomEntry(customType, data) {
		warnSessionPersistenceDeprecation("SessionManager.appendCustomEntry", "appendCustomEntryAsync");
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
	/** @deprecated Await appendSessionInfoAsync. Removal: next Plugin SDK major. */
	appendSessionInfo(name) {
		warnSessionPersistenceDeprecation("SessionManager.appendSessionInfo", "appendSessionInfoAsync");
		const entry = this.createEntry({
			type: "session_info",
			name: name.replace(/[\r\n]+/g, " ").trim()
		});
		this.appendEntry(entry);
		return entry.id;
	}
	async appendCustomMessageEntryAsync(customType, content, display, details) {
		const entry = this.createEntry({
			type: "custom_message",
			customType,
			content,
			display,
			details,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
		await this.appendEntryAsync(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	/** @deprecated Await appendCustomMessageEntryAsync. Removal: next Plugin SDK major. */
	appendCustomMessageEntry(customType, content, display, details) {
		warnSessionPersistenceDeprecation("SessionManager.appendCustomMessageEntry", "appendCustomMessageEntryAsync");
		const entry = this.createEntry({
			type: "custom_message",
			customType,
			content,
			display,
			details,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
		this.appendEntry(entry, { invalidateSerializedPrefixCache: true });
		return entry.id;
	}
	async appendLeafControlAsync(params) {
		const captured = { ...params };
		return await withSessionManagerWrite(this, async (admission) => {
			this.assertTranscriptWriteActive();
			this.validateLeafControl(captured);
			if (!admission || isIncognitoSessionKey(this.persistenceTarget?.sessionKey)) return this.appendLeafControlSync(captured);
			const previousLeafId = this.leafId;
			this.leafId = captured.targetId;
			const entry = this.createLeafControl(this.appendParentId, captured.appendParentId, captured.appendMode);
			this.leafId = previousLeafId;
			const target = this.getSessionTarget();
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const committed = await this.persistWorkerRecord(entry, void 0, admission, void 0, void 0, this.transcriptMutationAt, false, assertNavigation);
			try {
				if (!sameSessionTranscriptTargetBinding(target, this.getSessionTarget())) throw new SessionTranscriptWriterClaimReboundError();
				assertNavigation();
				if (!this.hasNewerPublishedTranscriptView(committed.committedVersion)) {
					if (committed.viewFailure) throw committed.viewFailure;
					this.transcriptVersion = committed.committedVersion;
					this.transcriptMutationAt = committed.committedVersion.updatedAt;
					if (committed.reload) this.adoptPreparedTranscriptReload(committed.reload);
					else {
						this.rememberLeafControl(entry);
						this.leafId = captured.targetId;
						this.appendParentId = captured.appendParentId;
						this.appendMode = captured.appendMode;
						this.pendingDeliberateAppend = false;
					}
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
	/** @deprecated Await appendLeafControlAsync. Removal: next Plugin SDK major. */
	appendLeafControl(params) {
		warnSessionPersistenceDeprecation("SessionManager.appendLeafControl", "appendLeafControlAsync");
		return this.appendLeafControlSync(params);
	}
	validateLeafControl(params) {
		this.assertTranscriptViewAvailable();
		if (params.targetId !== null && !this.byId.has(params.targetId)) throw new Error(`Entry ${params.targetId} not found`);
		if (params.appendParentId !== null && !this.byId.has(params.appendParentId) && !this.opaqueParentsById.has(params.appendParentId)) throw new Error(`Append parent ${params.appendParentId} not found`);
	}
	appendLeafControlSync(params) {
		this.validateLeafControl(params);
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
	async appendLabelChangeAsync(targetId, label) {
		const entry = this.createEntry({
			type: "label",
			targetId,
			label
		});
		await this.appendEntryAsync(entry);
		return entry.id;
	}
	/** @deprecated Await appendLabelChangeAsync. Removal: next Plugin SDK major. */
	appendLabelChange(targetId, label) {
		warnSessionPersistenceDeprecation("SessionManager.appendLabelChange", "appendLabelChangeAsync");
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
	async branchAsync(branchFromId) {
		await withSessionManagerWrite(this, async () => {
			if (!this.byId.has(branchFromId)) await this.ensureCompletePersistedHistoryAsync();
			this.branchSync(branchFromId);
		});
	}
	/** @deprecated Await branchAsync. Removal: next Plugin SDK major. */
	branch(branchFromId) {
		warnSessionPersistenceDeprecation("SessionManager.branch", "branchAsync");
		this.branchSync(branchFromId);
	}
	branchSync(branchFromId) {
		this.assertTranscriptViewAvailable();
		if (!this.byId.has(branchFromId)) this.ensureCompletePersistedHistory();
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
			await this.appendEntryAsync(entry, { invalidateSerializedPrefixCache: fromHook === true || details !== void 0 }, true);
			return entry.id;
		});
	}
	/** @deprecated Await branchWithSummaryAsync. Removal: next Plugin SDK major. */
	branchWithSummary(branchFromId, summary, details, fromHook) {
		warnSessionPersistenceDeprecation("SessionManager.branchWithSummary", "branchWithSummaryAsync");
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
//#region src/agents/sessions/session-manager-metadata.ts
var SessionManagerMetadata = class extends SessionManagerEntries {
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
				this.adoptWorkerCommittedEntry(canonical, committed, admittedUserId);
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
			if (persistenceTarget && admission && !isIncognitoSessionKey(persistenceTarget.sessionKey)) {
				const identity = { ...persistenceTarget };
				const version = this.transcriptVersion;
				const assertOwned = captureOwnedTranscriptWriteAssertion(identity);
				const assertDestinationOwned = captureOwnedTranscriptWriteAssertion({
					...identity,
					sessionId: newSessionId
				});
				const assertCurrent = () => {
					this.assertTranscriptWriteActive();
					assertOwned();
					assertNavigation();
					if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== version) throw new Error("Session transcript changed during branch preparation");
				};
				const { restoreSessionColdTranscript } = await import("./session-cold-storage-DmgpAWjS.mjs");
				await restoreSessionColdTranscript(persistenceTarget, assertCurrent);
				const reader = prepareSessionTranscriptHydration(persistenceTarget);
				const facts = await reader.readMaintenance({ operation: "version" });
				reader.assertCurrent();
				assertCurrent();
				const { withSessionMetadataWorker } = await import("./session-manager-metadata-runtime-D4Yb0-JI.mjs");
				assertCurrent();
				const fencedTarget = withOwnedSessionTranscriptWriterFence(persistenceTarget);
				const { env: _env, ...scope } = fencedTarget;
				const assertBranchCurrent = () => {
					assertCurrent();
					assertDestinationOwned();
				};
				const committed = await withSessionMetadataWorker(admission.options, admission.database, assertBranchCurrent, (worker) => worker.execute({
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
				}));
				if (committed.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
					...admission.options,
					preferredSessionId: newSessionId
				});
				let failure;
				try {
					assertCurrent();
					adoptBranch({
						...fencedTarget,
						sessionId: newSessionId
					}, committed.version);
				} catch (cause) {
					failure = { cause };
				}
				try {
					publishCommittedSessionIdentity(scope.agentId, readOpenClawAgentDatabaseIdentity(admission.database).identity, committed.identity.previous, committed.identity.current);
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
			} else if (persistenceTarget) await replaceSessionWithBranchedTranscript(persistenceTarget, {
				sessionId: newSessionId,
				events: branch.getPersistedFileEntries()
			}, adoptBranch, () => {
				this.assertTranscriptWriteActive();
				assertNavigation();
			});
			else adoptBranch();
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
	constructor(cwd, persistenceTarget, loadedEntries, boundedContext, transcriptMutationAt, version) {
		super(cwd, persistenceTarget, loadedEntries, boundedContext, transcriptMutationAt, version);
		this.retainTranscriptWriter();
	}
	async [sessionManagerReadInitialContext]() {
		if (!this.persistenceTarget || !this.boundedContextLimits || this.pendingDeliberateAppend) return this.buildSessionContext();
		const initial = this.captureTranscriptView();
		const context = await SessionManager.openModelContextAsync(this.persistenceTarget, {
			cwd: this.cwd,
			limits: this.boundedContextLimits
		});
		const current = this.captureTranscriptView();
		if (Object.keys(initial).some((key) => Reflect.get(initial, key) !== Reflect.get(current, key))) throw new Error("Session manager changed during initial context read");
		for (const entry of context.fileEntries) {
			if (entry.type !== "message") continue;
			const stored = this.byId.get(entry.id);
			if (stored?.type !== "message") continue;
			if (isDeepStrictEqual(entry.message, stored.message)) entry.message = freezeJsonSnapshot(stored.message);
			else {
				for (const key of Object.keys(entry.message)) {
					const value = Reflect.get(stored.message, key);
					if (isDeepStrictEqual(Reflect.get(entry.message, key), value)) Reflect.set(entry.message, key, freezeJsonSnapshot(value));
				}
				freezeJsonSnapshot(entry.message);
			}
		}
		return context.buildSessionContext();
	}
	/** No buffered writes remain here; asynchronous metadata methods own their settlement. */
	flushPendingPersistence() {}
	/** @deprecated Await appendMessageAsync. Removal: next Plugin SDK major. */
	appendMessage(message, options) {
		return super.appendMessage(message, options);
	}
	/** @deprecated Await appendMessageWithTranscriptAnchorAsync. Removal: next Plugin SDK major. */
	appendMessageWithTranscriptAnchor(message, options) {
		return super.appendMessageWithTranscriptAnchor(message, options);
	}
	/** @deprecated Use prepareTranscriptRewriteAsync; removed at the next Plugin SDK major. */
	prepareTranscriptRewrite() {
		warnSessionPersistenceDeprecation("SessionManager.prepareTranscriptRewrite", "prepareTranscriptRewriteAsync");
		this.assertTranscriptWriteActive();
		const publish = this.persistenceTarget ? prepareTranscriptRewriteSync(this.persistenceTarget, this.appendParentId, () => this.assertTranscriptWriteActive(), this.transcriptVersion) : void 0;
		const rewrite = this.prepareTranscriptRewriteView(publish);
		return {
			sessionManager: rewrite.sessionManager,
			commit: (ids) => runSessionPersistenceSync(rewrite.commit(ids))
		};
	}
	/** Preparation returns a detached branch; only its awaited commit publishes changes. */
	async prepareTranscriptRewriteAsync() {
		return withSessionManagerWrite(this, async () => {
			this.assertTranscriptWriteActive();
			const assertNavigation = this.captureTranscriptNavigationAssertion();
			const target = this.persistenceTarget;
			if (!target || isIncognitoSessionKey(target.sessionKey)) {
				const detachedView = target ? void 0 : structuredClone(this.captureTranscriptView());
				const assertPrepared = () => {
					assertNavigation();
					if (detachedView && (this.persistenceTarget || !isDeepStrictEqual(this.captureTranscriptView(), detachedView))) throw new Error("Session transcript changed before rewrite publication");
				};
				const publish = target ? prepareTranscriptRewriteSync(target, this.appendParentId, () => {
					this.assertTranscriptWriteActive();
					assertNavigation();
				}, this.transcriptVersion) : void 0;
				const rewrite = this.prepareTranscriptRewriteView(publish, void 0, assertPrepared);
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
				this.assertTranscriptWriteActive();
				assertOwned();
				assertNavigation();
				if (!sameSessionTranscriptTargetBinding(identity, this.persistenceTarget) || this.transcriptVersion !== loadedVersion) throw new Error("Session transcript changed before rewrite publication");
			};
			const reader = prepareSessionTranscriptHydration(target);
			const facts = await reader.readMaintenance({ operation: "version" });
			reader.assertCurrent();
			assertCurrent();
			const version = facts.version;
			if (!version || !loadedVersion || version.generation !== loadedVersion.generation || version.rawSeq !== loadedVersion.rawSeq || facts.appendParentId !== appendParentId) throw new Error("Session transcript changed before rewrite publication");
			const rewrite = this.prepareTranscriptRewriteView(void 0, async (entries, sources, adopt) => {
				await withSessionManagerWrite(this, async (admission) => {
					assertCurrent();
					if (!admission) throw new Error("Transcript rewrite lost its persistent owner");
					for (const entry of entries) if (entry.type === "message") entry.message = redactTranscriptMessageForStorage(entry.message, {});
					const { withSessionMetadataWorker } = await import("./session-manager-metadata-runtime-D4Yb0-JI.mjs");
					assertCurrent();
					const { env: _env, ...scope } = withOwnedSessionTranscriptWriterFence(target);
					const committed = await withSessionMetadataWorker(admission.options, admission.database, assertCurrent, (worker) => worker.execute({
						type: "session.transcript.rewrite",
						input: {
							scope: {
								...scope,
								storePath: admission.database.path
							},
							appendParentId,
							version,
							entries,
							sources: [...sources]
						}
					}));
					if (committed.projectionNeedsReconcile) startSessionTranscriptIndexReconcile({
						...admission.options,
						preferredSessionId: identity.sessionId
					});
					try {
						assertCurrent();
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
		Object.assign(prepared, structuredClone(this.captureTranscriptView()));
		const initialEntryCount = prepared.fileEntries.length;
		const persistedBoundaryCount = prepared.persistedBoundaryCount;
		prepared.persistedBoundaryCount = void 0;
		const loadedBoundaryCount = prepared.getBoundaryCount();
		return {
			sessionManager: prepared,
			commit: function* (rewrittenEntryIds) {
				const publication = SessionManager.inMemory(prepared.cwd);
				Object.assign(publication, structuredClone(prepared.captureTranscriptView()));
				const entries = publication.fileEntries.slice(initialEntryCount).filter((entry) => entry.type !== "session");
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
		warnSessionPersistenceDeprecation("SessionManager.open", "openAsync");
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
		warnSessionPersistenceDeprecation("SessionManager.openBounded", "openBoundedAsync");
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
		warnSessionPersistenceDeprecation("SessionManager.openDetachedBounded", "openDetachedBoundedAsync");
		const source = SessionManager.openBounded(target, options);
		return SessionManager.fromSelectedEntries([source.getHeader(), ...source.getBranch()], source.getCwd());
	}
	/** @deprecated Await openModelContextAsync. Removal: next Plugin SDK major. */
	static openModelContext(target, options = {}) {
		warnSessionPersistenceDeprecation("SessionManager.openModelContext", "openModelContextAsync");
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
		const context = await withSessionContextAdmission(readTarget, admission, () => isIncognitoSessionKey(readTarget.sessionKey) || isIncognitoOpenClawAgentSqlitePath(readTarget.storePath, readTarget) ? readSessionTranscriptModelContext(readTarget, through, limits) : readSessionTranscriptModelContextAsync(readTarget, admission, options.signal, through, limits));
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
	/**
	* @deprecated Await appendMessageToTranscriptAsync. Removal: next Plugin SDK major.
	*/
	static appendMessageToTranscript(target, message, options) {
		warnSessionPersistenceDeprecation("SessionManager.appendMessageToTranscript", "appendMessageToTranscriptAsync");
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
export { withSessionCompactionPersistence as a, sessionManagerReadInitialContext as i, SessionMetadataCommittedError as n, withSessionCompactionPersistenceAsync as o, sessionManagerPrepareCurrentTurnReplay as r, SessionManager as t };

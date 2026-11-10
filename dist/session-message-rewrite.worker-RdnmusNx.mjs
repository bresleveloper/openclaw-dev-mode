import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as executeSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { r as SqliteTranscriptMutationConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { c as transcriptEventJsonSql } from "./transcript-payload-Cu49oQKq.mjs";
import { l as resolveTerminalAssistantTranscriptRunId, s as readSessionTranscriptRunId } from "./transcript-events-D3brcRJS.mjs";
import { h as selectManualCompactTranscriptLines } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as readMessageIdempotencyKey } from "./transcript-message-identity-0wQEn3Eb.mjs";
import { u as transcriptWriteScopeIsCurrent } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as readSessionColdTranscript, n as assertSessionTranscriptHot } from "./session-cold-storage-state-CWFSrppd.mjs";
import { c as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-BTr4by8J.mjs";
import { p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { a as rewriteSqliteTranscriptEventRowsInTransaction, c as readSessionActorRewriteFacts, i as replaceSqliteTranscriptEventsInTransaction, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { g as readSessionEntrySelectionSnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { g as runWithSessionPendingInputWorkerCustody, p as resolveSessionPendingInputAppend, u as readSessionPendingInputWorkerReceipt } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { c as readTranscriptContextVersionInTransaction, l as readTranscriptGenerationInTransaction } from "./session-accessor.sqlite-transcript-state-DCHgVh5P.mjs";
import { C as readTranscriptIdentityByEventId, i as findTranscriptEventInDatabase, j as resolveTranscriptEventAppendParent, w as readTranscriptSnapshot, y as readTranscriptEventRows } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as readTranscriptMessageByScopedIdempotencyKey } from "./session-accessor.sqlite-transcript-identity-BbaLin80.mjs";
import { o as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
import { n as assertNonMessageTranscriptEvent, t as assertLockedTranscriptWriteAllowed } from "./session-accessor.sqlite-transcript-write-guard-C3zmfbiJ.mjs";
import { t as appendTranscriptMessageInTransaction } from "./session-accessor.sqlite-transcript-message-append-DFcvBgrv.mjs";
import { t as readTranscriptMirrorFacts } from "./session-accessor.sqlite-transcript-mirror-mjIndN8p.mjs";
import { i as rememberCommittedTranscriptMessageSequencesInTransaction, n as readCommittedTranscriptMessageSequence } from "./session-accessor.sqlite-transcript-sequences-B5FCjqGn.mjs";
import { t as applyManualCompactInTransaction } from "./session-manual-compact.kernel-F5Q1AUMw.mjs";
import { t as readSessionPendingInputAuthorityFacts } from "./session-pending-input-authority.kernel-Cz8X54WZ.mjs";
import { n as readSessionSourceValidation } from "./session-source-predicate.worker-CY9FAsb_.mjs";
import { i as transferSessionEntryWorkerCandidate, t as bindSessionWorkerBackend } from "./session-entry-patch.worker-CyYnfK5G.mjs";
import { n as prepareSessionColdSourceGuard } from "./session-cold-storage-source-guard.worker-CKWg0m5n.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/session-manual-compact.worker.ts
function compactManualTranscript(input, context) {
	try {
		var _usingCtx$1 = _usingCtx();
		const sourceMatches = input.sources.flatMap((source, index) => source.conversationAlternatives ? [{
			index,
			matches: new Int32Array(new SharedArrayBuffer((source.conversationAlternatives.length + 1) * Int32Array.BYTES_PER_ELEMENT))
		}] : []);
		const source = _usingCtx$1.u(prepareSessionColdSourceGuard(context.options, input.sources, sourceMatches));
		const database = context.open();
		const rows = readTranscriptEventRows(database, input.scope.sessionId);
		const entries = input.entries ?? readSessionEntrySelectionSnapshot(database, input.scope.sessionKey, true);
		const selected = selectManualCompactTranscriptLines(rows.map((row) => row.eventJson), input.maxLines);
		const events = selected.result.compacted ? selected.lines.map((line) => JSON.parse(line)) : [];
		return context.writeTransaction("session.transcript.manual-compact", "Manual compaction", (current) => {
			assertSessionTranscriptHot(current.db, input.scope.sessionId);
			context.admit("transaction", {
				kind: "session-manual-compact-validated",
				sourceValidation: source.read(current),
				sourceMatches
			});
			const candidate = {
				kind: "session-manual-compact",
				result: selected.result
			};
			if (selected.result.compacted) {
				const identity = applyManualCompactInTransaction(current, input.scope, {
					rows,
					entries,
					events,
					nowMs: input.nowMs
				}, { scheduleProjectionReconcile: false });
				reconcileSessionTranscriptIndexInTransaction(current.db, input.scope.sessionId);
				candidate.publication = prepareSessionEntryReplacementPublication({
					...identity,
					pendingArchiveRecovery: false,
					membershipInvalidatedKeys: [],
					maintenancePlans: []
				}, current);
			}
			return transferSessionEntryWorkerCandidate(current, (stage, publication) => {
				context.admit(stage, publication);
				source.assertForeign();
			}, candidate);
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
//#region src/config/sessions/session-message-rewrite.worker.ts
/** Borrow the canonical executor connection without extending the released command union. */
function bindSqliteWorkerBackend(input, bound) {
	return bindSessionWorkerBackend(input, bound, "Transcript rewrite", (context, database) => (command) => {
		switch (command.type) {
			case "session.transcript.lock.cold": return { archive: readSessionColdTranscript(database.db, command.input.scope.sessionId) };
			case "session.transcript.lock.read": return readTranscriptSnapshot(database, command.input.scope.sessionId);
			case "session.transcript.lock.prepare": return withLockedCustody(command.input, context, () => prepareLockedTranscriptAppend(command.input, database));
			case "session.transcript.lock.facts": return readTranscriptMirrorFacts(database, command.input.scope, command.input);
			case "session.transcript.lock.commit": return commitLockedTranscript(command.input, context);
			case "session.transcript.manualCompact": return compactManualTranscript(command.input, context);
			case "session.transcript.event.append": return commitSessionTranscriptEvent(command.input, context);
			case "session.transcript.correct": return commitSessionTranscriptCorrection(command.input, context);
			case "session.messageRewrite.prepare": return prepareSessionMessageRewrite(command.input, context);
			case "session.messageRewrite.commit": return commitSessionMessageRewrite(command.input, context);
		}
		throw new Error("Unknown transcript rewrite domain operation");
	});
}
function withLockedCustody(input, context, run) {
	return input.custody ? runWithSessionPendingInputWorkerCustody(input.custody, input.relocation, () => context.admit("transaction", {
		kind: "session-transcript-lock-custody",
		authority: input.custody.preparedAuthority ? readSessionPendingInputAuthorityFacts(context.open(), input.custody.sessionKey, input.custody.agentId) : void 0
	}), run).value : run();
}
function prepareLockedTranscriptAppend(input, database) {
	assertLockedTranscriptWriteAllowed(database, input.scope, input.fence);
	const key = readMessageIdempotencyKey(input.options.message);
	return {
		version: readTranscriptContextVersionInTransaction(database, input.scope.sessionId),
		pending: Boolean(resolveSessionPendingInputAppend(database, input.scope, input.options.message)),
		existing: key && input.options.idempotencyLookup !== "caller-checked" ? readTranscriptMessageByScopedIdempotencyKey(database, input.scope, key, input.options.idempotencyLookup) : void 0
	};
}
function commitLockedTranscript(input, context) {
	return withLockedCustody(input, context, () => context.writeTransaction("session.transcript.locked-write", "Locked transcript", (database) => {
		const assertSources = (fresh, sources) => context.admit("transaction", {
			kind: "session-transcript-lock-source",
			fresh,
			sourceValidation: readSessionSourceValidation(database, sources)
		});
		assertSources(false, input.sources);
		const entry = assertLockedTranscriptWriteAllowed(database, input.scope, input.fence);
		let projectionNeedsReconcile = false;
		const projection = {
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				projectionNeedsReconcile = true;
			}
		};
		const snapshotCurrent = input.snapshot?.kind === "current" && isDeepStrictEqual(input.snapshot.rows, readTranscriptEventRows(database, input.scope.sessionId));
		let result;
		let messageSeq;
		if (input.kind === "message") {
			const preparation = input.preparation;
			const preparedMessage = input.preparedMessageJson === void 0 ? void 0 : {
				messageJson: input.preparedMessageJson,
				persistedMessage: JSON.parse(input.preparedMessageJson)
			};
			result = appendTranscriptMessageInTransaction(database, input.scope, {
				...input.options,
				...preparation ? { prepareMessageAfterIdempotencyCheck: () => {
					const current = readTranscriptContextVersionInTransaction(database, input.scope.sessionId);
					if (!preparation.prepared || current.generation !== preparation.version.generation || current.rawSeq !== preparation.version.rawSeq || current.updatedAt !== preparation.version.updatedAt) throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
					return preparedMessage?.persistedMessage;
				} } : {},
				beforeFreshMessageCommit: () => {
					if (!input.freshAuthorityPrepared) throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
					assertSources(true, input.freshSources);
				}
			}, preparedMessage, projection)?.result;
			if (result && input.sequenced) {
				rememberCommittedTranscriptMessageSequencesInTransaction(database, input.scope.sessionId, [result]);
				messageSeq = readCommittedTranscriptMessageSequence(result);
			}
		} else {
			if (input.snapshot && !snapshotCurrent) throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
			replaceSqliteTranscriptEventsInTransaction(database, input.scope, input.events, projection);
		}
		assertLockedTranscriptWriteAllowed(database, input.scope, input.fence);
		const candidate = {
			kind: "session-transcript-locked",
			result,
			messageSeq,
			lifecycleRevision: entry?.lifecycleRevision,
			custody: readSessionPendingInputWorkerReceipt(database),
			authority: input.custody?.preparedAuthority ? readSessionPendingInputAuthorityFacts(database, input.custody.sessionKey, input.custody.agentId) : void 0,
			projectionNeedsReconcile,
			snapshot: input.snapshot || input.kind === "replace" ? input.kind === "replace" || snapshotCurrent ? {
				kind: "current",
				rows: readTranscriptEventRows(database, input.scope.sessionId)
			} : { kind: "stale" } : void 0
		};
		return transferSessionEntryWorkerCandidate(database, context.admit, candidate);
	}));
}
function commitSessionTranscriptEvent(input, context) {
	return applySessionTranscriptEvent(input, context, (database, candidate) => transferSessionEntryWorkerCandidate(database, context.admit, candidate));
}
function applySessionTranscriptEvent(input, { writeTransaction }, publish) {
	const event = JSON.parse(input.eventJson);
	assertNonMessageTranscriptEvent(event);
	return writeTransaction("session.transcript.event-append", "Transcript event", (database) => {
		if (input.fence) {
			if ((assertLockedTranscriptWriteAllowed(database, input.scope, input.fence) ?? readSessionEntryRow(database, input.scope.sessionKey, "list")?.entry)?.sessionId !== input.scope.sessionId) throw new SessionTranscriptWriterClaimReboundError();
		} else assertSessionTranscriptHot(database.db, input.scope.sessionId);
		const resolvedEvent = resolveTranscriptEventAppendParent(database, input.scope.sessionId, event, input);
		const candidate = {
			kind: "session-transcript-event",
			appended: false,
			projectionNeedsReconcile: false
		};
		candidate.appended = appendTranscriptEventInTransaction(database, input.scope, resolvedEvent, {
			eventJson: resolvedEvent === event ? input.eventJson : void 0,
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded: () => {
				candidate.projectionNeedsReconcile = true;
			}
		}) !== false;
		return publish(database, candidate);
	});
}
function commitSessionTranscriptCorrection(input, { writeTransaction, admit }) {
	return writeTransaction("session.transcript.rewrite-exact", "Transcript correction", (database) => {
		return transferSessionEntryWorkerCandidate(database, admit, applySessionTranscriptCorrection(database, input));
	});
}
function applySessionTranscriptCorrection(database, input) {
	assertLockedTranscriptWriteAllowed(database, input.scope, input.fence);
	const current = readTranscriptContextVersionInTransaction(database, input.scope.sessionId);
	const candidate = {
		kind: "session-transcript-correction",
		generation: null
	};
	if (current.generation !== input.version.generation || !input.allowLaterAppends && (current.rawSeq !== input.version.rawSeq || current.updatedAt !== input.version.updatedAt)) {
		if (input.allowLaterAppends) return candidate;
		throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
	}
	const rows = input.rows.map((row) => {
		const identity = readTranscriptIdentityByEventId(database, input.scope.sessionId, row.entryId);
		if (!identity) throw new SqliteTranscriptMutationConflictError(input.scope.sessionId);
		return {
			...row,
			seq: identity.seq
		};
	});
	const generation = rewriteSqliteTranscriptEventRowsInTransaction(database, input.scope, rows);
	assertLockedTranscriptWriteAllowed(database, input.scope, input.fence);
	candidate.generation = generation ?? current.generation;
	return candidate;
}
function prepareSessionMessageRewrite(input, { open }) {
	const database = open();
	return prepareMessageRewrite(input, database, readSessionActorRewriteFacts(database, input.scope, input.target.kind === "anchor" ? input.target.anchor.entryId : void 0));
}
function assertMessageRewriteAllowed(input, database, facts) {
	const { scope, target, expectedEntry } = input;
	if (!facts) assertSessionTranscriptHot(database.db, scope.sessionId);
	if (expectedEntry) {
		const current = facts ? facts.entry : readSessionEntryRow(database, scope.sessionKey)?.entry;
		if (!transcriptWriteScopeIsCurrent(current, scope.sessionId, {
			sessionKey: scope.sessionKey,
			expectedOwner: expectedEntry.owner
		}) || current?.lifecycleRevision !== (expectedEntry.lifecycleRevision ?? void 0) || expectedEntry.activeWriterRunId !== void 0 && current?.activeWriterRunId !== (expectedEntry.activeWriterRunId ?? void 0)) throw new SessionTranscriptWriterClaimReboundError();
	}
	if (target.kind === "anchor" && target.active) {
		const active = facts ? facts.anchor : readActiveTranscriptEntryAnchorInTransaction({
			database,
			resolved: scope,
			entryId: target.anchor.entryId
		});
		if (target.active === "exact" ? !isDeepStrictEqual(active, target.anchor) : active?.rawSeq !== target.anchor.rawSeq) throw new SessionTranscriptWriterClaimReboundError();
	}
}
function prepareMessageRewrite(input, database, facts) {
	assertMessageRewriteAllowed(input, database, facts);
	const { scope, target } = input;
	let seq;
	if (target.kind === "anchor") seq = target.anchor.rawSeq;
	else {
		const event = findTranscriptEventInDatabase(database, scope.sessionId, (event) => isRecord(event) && isRecord(event.message) && readSessionTranscriptRunId(event.message) === target.runId && resolveTerminalAssistantTranscriptRunId(event.message, target.runId) !== void 0)?.event;
		if (!isRecord(event) || typeof event.id !== "string") return null;
		const identity = readTranscriptIdentityByEventId(database, scope.sessionId, event.id);
		if (!identity) return null;
		seq = identity.seq;
	}
	const row = executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select(transcriptEventJsonSql(database.db).as("event_json")).where("session_id", "=", scope.sessionId).where("seq", "=", seq));
	if (!row) return null;
	const event = JSON.parse(row.event_json);
	if (!isRecord(event) || event.type !== "message" || typeof event.id !== "string" || target.kind === "anchor" && event.id !== target.anchor.entryId) return null;
	return {
		seq,
		eventJson: row.event_json,
		event
	};
}
function commitSessionMessageRewrite(input, context) {
	return applySessionMessageRewrite(input, context, (database, candidate) => transferSessionEntryWorkerCandidate(database, context.admit, candidate));
}
function applySessionMessageRewrite(input, { writeTransaction }, publish) {
	return writeTransaction("session.transcript.message-rewrite", "Transcript rewrite", (database) => {
		const facts = readSessionActorRewriteFacts(database, input.scope, input.target.kind === "anchor" ? input.target.anchor.entryId : void 0);
		assertMessageRewriteAllowed(input, database, facts);
		const current = input.expected;
		const changed = input.message !== void 0;
		let generation;
		if (changed) try {
			generation = rewriteSqliteTranscriptEventRowsInTransaction(database, input.scope, [{
				event: {
					...current.event,
					message: input.message
				},
				expectedEventJson: current.eventJson,
				seq: current.seq
			}], { projectionCurrent: facts !== void 0 });
		} catch (error) {
			if (error instanceof SqliteTranscriptMutationConflictError) throw new SessionTranscriptWriterClaimReboundError();
			throw error;
		}
		generation ??= facts ? facts.generation : readTranscriptGenerationInTransaction(database, input.scope.sessionId);
		return publish(database, {
			kind: "session-message-rewrite",
			result: generation && (changed || input.target.kind === "terminal-assistant") ? {
				generation,
				messageId: String(current.event.id),
				message: changed ? input.message : current.event.message
			} : null
		});
	});
}
//#endregion
export { commitSessionMessageRewrite as a, bindSqliteWorkerBackend as i, applySessionTranscriptCorrection as n, commitSessionTranscriptEvent as o, applySessionTranscriptEvent as r, prepareSessionMessageRewrite as s, applySessionMessageRewrite as t };

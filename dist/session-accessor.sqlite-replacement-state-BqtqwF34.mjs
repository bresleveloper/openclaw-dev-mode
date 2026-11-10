import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as attachSessionEntrySnapshots } from "./session-entry-snapshot-values-CSxUX6LQ.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { M as sessionSharingEntriesEqual } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { u as readSessionNodesGeneration } from "./session-participant-identity-Btc25HNW.mjs";
import { n as discardSessionEntryPublicationSource, r as hasSessionEntryPublicationCapacity, t as captureSessionEntryPublicationSource } from "./session-entry-publication-source-BkCFKM-k.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import { s as readStagedSessionTranscriptAuthority } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { i as prepareExactSessionEntryRowReads, o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { s as captureSessionEntryMaintenanceAgeChange } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { a as writeSessionEntry, p as captureSessionEntrySnapshot, t as deleteLegacySessionEntryRows } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { n as hasPendingSessionTranscriptArchives } from "./session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { n as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-CKTkTTKa.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-DmFmcL8Z.mjs";
import { r as readSessionEntryReplacementLabelOwnerKeys, t as assertSessionCreationLabelAvailable } from "./session-accessor.sqlite-creation-read-Dt1Glefh.mjs";
//#region src/config/sessions/session-accessor.sqlite-replacement-state.ts
/** Display metadata and bounded full-entry facts share the writer's final persisted read. */
function prepareSessionEntryReplacementPublication(result, database, options) {
	const archived = new Set(result.maintenancePlans.flatMap((plan) => plan.archivedEntries.map(({ sessionKey }) => sessionKey)));
	const invalidated = /* @__PURE__ */ new Set([...result.membershipInvalidatedKeys, ...archived]);
	const current = /* @__PURE__ */ new Map();
	const fullEntries = options?.captureFullFacts ? /* @__PURE__ */ new Map() : void 0;
	const projection = /* @__PURE__ */ new Map();
	const unavailableParticipantKeys = /* @__PURE__ */ new Set();
	let readCommitted;
	for (const key of result.current.keys()) {
		const postimage = options?.postimages?.get(key);
		let committed;
		if (!postimage) {
			readCommitted ??= prepareExactSessionEntryRowReads(database, [...result.current.keys()].filter((currentKey) => !options?.postimages?.has(currentKey)), fullEntries ? "full" : "list", void 0, {
				includeBoardPresence: true,
				includeMembership: true,
				onParticipantProjectionError: (sessionKey) => unavailableParticipantKeys.add(sessionKey)
			});
			committed = readCommitted(key);
		}
		const memberIds = JSON.parse(postimage?.sideTables.memberIdsJson ?? committed?.row.member_ids_json ?? "null");
		if (!Array.isArray(memberIds) || !memberIds.every((id) => typeof id === "string")) throw new Error(`Session publication lost its committed membership: ${key}`);
		const committedEntry = postimage?.entry ?? committed?.entry;
		if (!committedEntry) throw new Error(`Session publication lost its committed metadata: ${key}`);
		const entry = freezeJsonSnapshot(attachSessionEntrySnapshots({ ...committedEntry }, {}, "list"));
		current.set(key, entry);
		if (unavailableParticipantKeys.has(key)) continue;
		fullEntries?.set(key, freezeJsonSnapshot(committedEntry));
		const projectedEntry = committedEntry;
		projection.set(key, freezeJsonSnapshot({
			membership: [
				key,
				isInternalSessionEffectsKey(key) ? null : normalizeOptionalString(projectedEntry.category) ?? null,
				memberIds,
				{
					...projectedEntry.participants ? { participants: projectedEntry.participants } : {},
					...projectedEntry.participantCount === void 0 ? {} : { participantCount: projectedEntry.participantCount }
				},
				projectedEntry.sessionId
			],
			hasBoard: postimage?.sideTables.hasBoard ?? committed?.row.board_present === 1,
			activitySummaryWatermark: readSessionActivitySummary(projectedEntry) ? postimage?.transcriptWatermark ?? readSessionTranscriptWatermarkInDatabase(database, projectedEntry.sessionId) : void 0
		}));
	}
	const source = getAdmittedSqliteSchemaFacts(database.db) ? captureSessionEntryPublicationSource(database.db, {
		...readOpenClawAgentDatabaseIdentity(database),
		...!readSessionActorTransactionState(database) ? { revision: readSessionNodesGeneration(database.db) } : {}
	}) : void 0;
	const changedKeys = [.../* @__PURE__ */ new Set([
		...result.previous.keys(),
		...result.current.keys(),
		...archived
	])];
	const publication = {
		kind: "session-entry-replacements",
		transcriptPublication: readStagedSessionTranscriptAuthority(database),
		pendingArchiveRecovery: result.pendingArchiveRecovery,
		membershipInvalidatedKeys: result.membershipInvalidatedKeys,
		sharingUnchangedKeys: [...current].flatMap(([key, entry]) => !invalidated.has(key) && sessionSharingEntriesEqual(result.previous.get(key), entry) ? [key] : []),
		generationUnchangedKeys: [...current].flatMap(([key, entry]) => {
			const previous = result.previous.get(key);
			return !invalidated.has(key) && previous !== void 0 && previous.sessionId === entry.sessionId && previous.lifecycleRevision === entry.lifecycleRevision ? [key] : [];
		}),
		previous: new Map([...result.previous].map(([key, entry]) => [key, {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision
		}])),
		current,
		...fullEntries ? { fullEntries } : {},
		projection,
		...unavailableParticipantKeys.size > 0 ? { unavailableParticipantKeys: [...unavailableParticipantKeys] } : {},
		ageChanges: [...current].map(([sessionKey, entry]) => captureSessionEntryMaintenanceAgeChange({
			sessionKey,
			entry,
			previousEntry: result.previous.get(sessionKey)
		})),
		...source ? { source } : {},
		changedKeys
	};
	boundSessionEntryReplacementPublication(publication);
	return publication;
}
/** Keep every required receipt fact when its optional full snapshots exceed one bounded envelope. */
function boundSessionEntryReplacementPublication(publication, envelope = publication) {
	if (!publication.fullEntries && !publication.actorPostimages || hasSessionEntryPublicationCapacity(envelope)) return;
	delete publication.fullEntries;
	delete publication.actorPostimages;
	if (publication.source) discardSessionEntryPublicationSource(publication.source);
}
/** One SQL owner serves admitted worker writes and the native rollback exception. */
function commitSessionEntryReplacementsInDatabase(database, input, beforeReplacements, refreshCandidates, onArchived, postimages) {
	if (input.labelClaim) assertSessionCreationLabelAvailable(database, input.labelClaim.sessionKey, input.labelClaim.label);
	if (input.includeLabelOwners !== void 0 && JSON.stringify(readSessionEntryReplacementLabelOwnerKeys(database, input.includeLabelOwners)) !== JSON.stringify(input.labelOwnerKeys)) throw new Error("SQLite session label owners changed before replacement");
	const transactionRows = /* @__PURE__ */ new Map();
	const windows = /* @__PURE__ */ new Map();
	const writtenPostimages = postimages ?? /* @__PURE__ */ new Map();
	for (const sessionKey of input.validationKeys) {
		const transactionRow = readExactSessionEntryRow(database, sessionKey, "full", void 0, true);
		const expectedRow = input.expectedRows.get(sessionKey);
		if (transactionRow?.row.entry_json !== expectedRow?.row.entry_json || !sqliteSessionEntriesEqual(transactionRow?.entry, expectedRow?.entry)) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
		if (transactionRow) {
			transactionRows.set(sessionKey, transactionRow);
			const window = transactionRow.row.window;
			if (window !== void 0) windows.set(transactionRow.entry.sessionId, window);
		}
	}
	beforeReplacements();
	if (input.preparedTranscript) {
		const { sessionKey, sessionId, events } = input.preparedTranscript;
		appendTranscriptEventsInTransaction(database, {
			agentId: database.agentId,
			path: database.path,
			sessionKey,
			sessionId
		}, events);
	}
	const previous = /* @__PURE__ */ new Map();
	const current = /* @__PURE__ */ new Map();
	const membershipInvalidatedKeys = [];
	for (const replacement of input.replacements) {
		const sourceEntries = [replacement.sessionKey, ...replacement.previousSessionKeys ?? []].flatMap((sessionKey) => {
			const entry = transactionRows.get(sessionKey)?.entry;
			return entry ? [{
				entry,
				sessionKey
			}] : [];
		});
		const selectedBefore = sourceEntries.toSorted((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0))[0]?.entry;
		for (const { entry, sessionKey } of sourceEntries) if (!previous.has(sessionKey)) previous.set(sessionKey, entry);
		const canonical = transactionRows.get(replacement.sessionKey);
		const canonicalFacts = canonical && captureSessionEntrySnapshot(canonical);
		const previousWindow = windows.get(replacement.entry.sessionId);
		const written = writeSessionEntry(database, replacement.sessionKey, structuredClone(replacement.entry), {
			...input.consumePendingReset ? { consumePendingReset: true } : {},
			previousEntry: selectedBefore ?? null,
			canonicalPreviousEntry: canonical?.entry ?? null,
			canonicalPreviousRow: canonical?.row,
			canonicalPreviousWindow: previousWindow !== void 0 ? {
				sessionId: replacement.entry.sessionId,
				row: previousWindow
			} : canonicalFacts?.window,
			canonicalPreviousSideTables: canonicalFacts?.sideTables,
			postimages: writtenPostimages
		});
		deleteLegacySessionEntryRows(database, [...replacement.previousSessionKeys ?? []], replacement.sessionKey, {
			rehomeMembers: selectedBefore?.sessionId === replacement.entry.sessionId,
			validatedEntries: new Map([...transactionRows].map(([key, selected]) => [key, selected.entry])),
			postimages: writtenPostimages
		});
		const postimage = writtenPostimages.get(replacement.sessionKey);
		if (postimage) {
			transactionRows.set(replacement.sessionKey, {
				entry: postimage.entry,
				row: {
					...postimage.row,
					member_ids_json: postimage.sideTables.memberIdsJson,
					board_present: postimage.sideTables.hasBoard ? 1 : 0
				}
			});
			windows.set(postimage.entry.sessionId, postimage.window);
		}
		for (const previousKey of replacement.previousSessionKeys ?? []) if (previousKey !== replacement.sessionKey) transactionRows.delete(previousKey);
		if (replacement.previousSessionKeys?.some((key) => key !== replacement.sessionKey)) membershipInvalidatedKeys.push(replacement.sessionKey);
		current.set(replacement.sessionKey, written);
	}
	const maintenance = input.maintenance;
	if (input.ownerAssignment) {
		const { sessionKey, owner } = input.ownerAssignment;
		if (!current.has(sessionKey) || !replaceSessionOwnerInTransaction(database, sessionKey, owner, writtenPostimages)) throw new Error("Session owner assignment lost its creation target");
	}
	const preservation = maintenance?.preservation;
	const maintenancePlan = maintenance && preservation ? applySessionEntryMaintenanceInDatabase(database, maintenance, () => preservation, (sessionKey, previousEntry, currentEntry) => {
		if (!previous.has(sessionKey)) previous.set(sessionKey, previousEntry);
		current.set(sessionKey, currentEntry);
		onArchived?.(sessionKey, previousEntry, currentEntry);
	}, refreshCandidates, writtenPostimages) : emptySessionEntryMaintenancePlan();
	for (const sessionKey of current.keys()) {
		const postimage = writtenPostimages.get(sessionKey);
		if (postimage) current.set(sessionKey, postimage.entry);
		else current.delete(sessionKey);
	}
	return {
		pendingArchiveRecovery: input.checkPendingArchiveRecovery === true && previous.size > 0 && hasPendingSessionTranscriptArchives(database),
		previous,
		current,
		maintenancePlans: [maintenancePlan],
		membershipInvalidatedKeys
	};
}
//#endregion
export { commitSessionEntryReplacementsInDatabase as n, prepareSessionEntryReplacementPublication as r, boundSessionEntryReplacementPublication as t };

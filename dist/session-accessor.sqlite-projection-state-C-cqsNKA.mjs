import { t as SessionEntryLifecycleUpsertConflictError } from "./session-mutation-conflict-error-CvNdAcA_.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { n as readSessionEntryCount } from "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { a as writeSessionEntry, i as rehomeSessionWindows, p as captureSessionEntrySnapshot, r as deleteSessionEntryRows, t as deleteLegacySessionEntryRows } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-DvHsP9JX.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-59qE2chV.mjs";
import { a as deleteMaterializedSessionStatePlans, n as assertRawSessionEntryRemovalUnchanged } from "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { n as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-CKTkTTKa.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-DmFmcL8Z.mjs";
import { t as appendSessionResetBoundary } from "./session-accessor.sqlite-reset-boundary-hCsMewy5.mjs";
//#region src/config/sessions/session-accessor.sqlite-projection-state.ts
function readProjectedRemovalEntry(database, projected, allowCanonicalRepair = false) {
	if (projected.removal.expectedRawEntryJson === void 0) return allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, projected.sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, projected.sessionKey, "full", void 0, true);
	assertRawSessionEntryRemovalUnchanged(database, projected.sessionKey, projected.removal);
	return { entry: projected.expectedEntry };
}
/** The native and worker paths execute the same exact-row batch in their admitted transaction. */
function commitProjectedSessionEntryLifecycleMutationInDatabase(database, options) {
	const { projected, removalPlans, materializationFailed } = options;
	let pendingArchives = true;
	const removedSessionKeys = [];
	if (projected.archiveRecovery?.databaseIdentity === readOpenClawAgentDatabaseIdentity(database).identity) pendingArchives = projected.archiveRecovery.pending;
	const beforeCount = readSessionEntryCount(database);
	let afterCount = beforeCount;
	const validatedRemovalEntries = /* @__PURE__ */ new Map();
	const validatedRemovalRows = /* @__PURE__ */ new Map();
	const validatedRemovals = projected.removals.filter((removal) => {
		if (materializationFailed && removal.removal.archiveRemovedTranscript === true) return false;
		const selected = readProjectedRemovalEntry(database, removal, options.allowCanonicalRepair);
		const entry = selected?.entry;
		if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) {
			const replacedInSameMutation = projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey);
			throw new Error(replacedInSameMutation ? `SQLite session entry has stale lifecycle state for ${removal.sessionKey}` : `SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
		}
		if (entry) {
			validatedRemovalEntries.set(removal.sessionKey, entry);
			validatedRemovalRows.set(removal.sessionKey, selected);
		}
		return true;
	});
	const archivedTranscripts = deleteMaterializedSessionStatePlans(database, removalPlans, void 0, new Set(validatedRemovals.map((removal) => removal.sessionKey)));
	const legacyReplacementTargets = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry, expectedEntry, routeContext, resetBoundary } of projected.upsertedEntries) {
		const sameKeyRemoval = validatedRemovals.find((removal) => removal.sessionKey === sessionKey);
		const retained = options.currentEntrySnapshot;
		const currentRow = sameKeyRemoval ? validatedRemovalRows.get(sessionKey) : retained?.sessionKey === sessionKey && retained.row ? {
			entry: retained.entry,
			row: retained.row
		} : options.allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, sessionKey, "full", void 0, true);
		const currentEntry = sameKeyRemoval ? validatedRemovalEntries.get(sessionKey) : currentRow?.entry;
		const currentFacts = currentRow?.row ? captureSessionEntrySnapshot({
			entry: currentRow.entry,
			row: currentRow.row
		}) : void 0;
		const expectedCurrentEntry = expectedEntry ?? sameKeyRemoval?.expectedEntry;
		if (!sqliteSessionEntriesEqual(currentEntry, expectedCurrentEntry)) {
			if (sameKeyRemoval) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
			throw new SessionEntryLifecycleUpsertConflictError(sessionKey);
		}
		if (resetBoundary && expectedEntry?.sessionId) {
			const boundaryScope = {
				...options.resetScope,
				sessionId: expectedEntry.sessionId,
				sessionKey
			};
			let projectionNeedsReconcile = false;
			const progressCardReset = appendSessionResetBoundary(database, boundaryScope, expectedEntry, resetBoundary, options.onResetBoundary ? {
				scheduleProjectionReconcile: false,
				onProjectionReconcileNeeded: () => {
					projectionNeedsReconcile = true;
				}
			} : void 0);
			options.onResetBoundary?.({
				sessionKey,
				sessionId: expectedEntry.sessionId,
				progressCardReset,
				projectionNeedsReconcile
			});
		}
		writeSessionEntry(database, sessionKey, entry, {
			observeConversation: true,
			allowStoredAliases: options.allowCanonicalRepair === true,
			preserveNodeSuggestions: options.allowCanonicalRepair === true,
			previousEntry: expectedCurrentEntry ?? null,
			...!resetBoundary ? {
				canonicalPreviousEntry: currentEntry ?? null,
				canonicalPreviousRow: currentRow?.row,
				canonicalPreviousWindow: currentFacts?.window,
				canonicalPreviousSideTables: currentFacts?.sideTables
			} : {},
			postimages: options.postimages,
			...routeContext !== void 0 ? { routeContext } : {}
		});
		if (!currentEntry) afterCount += 1;
		const relatedRemovalKeys = validatedRemovals.flatMap((removal) => {
			const removedSessionId = removal.expectedEntry.sessionId;
			return removal.sessionKey !== sessionKey && (removedSessionId === entry.sessionId || removedSessionId === entry.previousSessionId) ? [removal.sessionKey] : [];
		});
		rehomeSessionWindows(database, sessionKey, relatedRemovalKeys, options.postimages);
		for (const legacyKey of relatedRemovalKeys) {
			const removedEntry = validatedRemovals.find((removal) => removal.sessionKey === legacyKey)?.expectedEntry;
			legacyReplacementTargets.set(legacyKey, {
				canonicalKey: sessionKey,
				rehomeMembers: removedEntry?.sessionId === entry.sessionId
			});
		}
	}
	options.afterUpsertsInTransaction?.(database);
	if (options.creation?.preparedTranscript) {
		const { sessionKey, sessionId, events } = options.creation.preparedTranscript;
		appendTranscriptEventsInTransaction(database, {
			...options.resetScope,
			sessionKey,
			sessionId
		}, events);
	}
	if (options.creation?.ownerAssignment) {
		const { sessionKey, owner } = options.creation.ownerAssignment;
		if (!replaceSessionOwnerInTransaction(database, sessionKey, owner, options.postimages)) throw new Error(`Session owner assignment lost its target: ${sessionKey}`);
	}
	const upsertedKeys = new Set(projected.upsertedEntries.map((upsert) => upsert.sessionKey));
	for (const removal of validatedRemovals) {
		if (upsertedKeys.has(removal.sessionKey)) continue;
		const entry = validatedRemovalEntries.get(removal.sessionKey);
		const replacement = legacyReplacementTargets.get(removal.sessionKey);
		if (replacement) deleteLegacySessionEntryRows(database, [removal.sessionKey], replacement.canonicalKey, {
			rehomeMembers: replacement.rehomeMembers,
			validatedEntries: validatedRemovalEntries,
			postimages: options.postimages
		});
		else deleteSessionEntryRows(database, removal.sessionKey, {
			deleteOwnedWindows: removal.removal.deleteOwnedWindows === true,
			deliveryCleanupKeys: removal.removal.deliveryCleanupKeys,
			validatedEntry: entry,
			postimages: options.postimages
		});
		removedSessionKeys.push(removal.sessionKey);
		afterCount -= 1;
	}
	return {
		archivedTranscripts,
		beforeCount,
		afterCount: options.allowCanonicalRepair || projected.removals.some(({ removal }) => removal.expectedRawEntryJson !== void 0) || options.afterUpsertsInTransaction ? readSessionEntryCount(database) : afterCount,
		maintenancePlans: [options.applyMaintenance(database, options.postimages)],
		removedSessionKeys,
		pendingArchives
	};
}
/** Adapt prepared lifecycle inputs to the shared transaction kernel. */
function commitPreparedSessionEntryLifecycleMutationInDatabase(database, input, removalPlans, options) {
	return commitProjectedSessionEntryLifecycleMutationInDatabase(database, {
		...input,
		removalPlans,
		resetScope: options?.resetScope ?? { agentId: database.agentId },
		onResetBoundary: options?.onResetBoundary,
		postimages: options?.postimages,
		currentEntrySnapshot: options?.currentEntrySnapshot,
		onArchived: options?.onArchived,
		applyMaintenance: (current, postimages) => {
			const maintenance = input.maintenance;
			if (!maintenance) return emptySessionEntryMaintenancePlan();
			const preservation = maintenance.preservation;
			if (!preservation) throw new Error("Worker lifecycle mutation requires maintenance preservation");
			return applySessionEntryMaintenanceInDatabase(current, maintenance, () => preservation, options?.onArchived, void 0, postimages);
		}
	});
}
//#endregion
export { commitProjectedSessionEntryLifecycleMutationInDatabase as n, commitPreparedSessionEntryLifecycleMutationInDatabase as t };

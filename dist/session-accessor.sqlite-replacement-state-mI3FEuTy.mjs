import { n as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-CG0Tk84j.mjs";
import { v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { g as readSessionNodesGeneration } from "./internal-session-key-CPayZwJR.mjs";
import { I as sessionSharingEntriesEqual, T as captureSessionEntryMaintenanceAgeChange } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { a as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-CWTZjXLR.mjs";
import { n as replaceSessionOwnerInTransaction } from "./session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { r as sqliteSessionEntriesEqual } from "./session-accessor.sqlite-entry-equality-7UlL8HUK.mjs";
import { d as writeSessionEntry, t as deleteLegacySessionEntryRows } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { n as hasPendingSessionTranscriptArchives } from "./session-accessor.sqlite-archive-store-kernel-GFHc9mfV.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Bqsq62BI.mjs";
import { n as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-B6AUFdD6.mjs";
import { t as readSessionEntryReplacementLabelOwnerKeys } from "./session-accessor.sqlite-replacement-read-Bqri3ahV.mjs";
import { t as assertSessionCreationLabelAvailable } from "./session-accessor.sqlite-creation-read-DO8QFtG0.mjs";
//#region src/config/sessions/session-accessor.sqlite-replacement-state.ts
/** Receipts carry only publication facts, never saved prompts or maintenance payloads. */
function prepareSessionEntryReplacementPublication(result, database) {
	const archived = new Set(result.maintenancePlans.flatMap((plan) => plan.archivedSessionKeys));
	const invalidated = /* @__PURE__ */ new Set([...result.membershipInvalidatedKeys, ...archived]);
	const current = /* @__PURE__ */ new Map();
	for (const key of result.current.keys()) {
		const committed = readExactSessionEntryRow(database, key, "list");
		if (!committed) throw new Error(`Session publication lost its committed metadata: ${key}`);
		current.set(key, freezeJsonSnapshot(committed.entry));
	}
	return {
		kind: "session-entry-replacements",
		pendingArchiveRecovery: result.pendingArchiveRecovery,
		membershipInvalidatedKeys: result.membershipInvalidatedKeys,
		sharingUnchangedKeys: [...current].flatMap(([key, entry]) => !invalidated.has(key) && sessionSharingEntriesEqual(result.previous.get(key), entry) ? [key] : []),
		previous: new Map([...result.previous].map(([key, entry]) => [key, {
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision
		}])),
		current,
		ageChanges: [...current].map(([sessionKey, entry]) => captureSessionEntryMaintenanceAgeChange({
			sessionKey,
			entry,
			previousEntry: result.previous.get(sessionKey)
		})),
		...getAdmittedSqliteSchemaFacts(database.db) ? { source: {
			...readOpenClawAgentDatabaseIdentity(database),
			revision: readSessionNodesGeneration(database.db)
		} } : {},
		changedKeys: [.../* @__PURE__ */ new Set([
			...result.previous.keys(),
			...result.current.keys(),
			...result.maintenancePlans.flatMap((plan) => plan.archivedSessionKeys)
		])]
	};
}
/** One SQL owner serves admitted worker writes and the native rollback exception. */
function commitSessionEntryReplacementsInDatabase(database, input, beforeReplacements) {
	if (input.labelClaim) assertSessionCreationLabelAvailable(database, input.labelClaim.sessionKey, input.labelClaim.label);
	if (input.includeLabelOwners !== void 0 && JSON.stringify(readSessionEntryReplacementLabelOwnerKeys(database, input.includeLabelOwners)) !== JSON.stringify(input.labelOwnerKeys)) throw new Error("SQLite session label owners changed before replacement");
	const transactionEntries = /* @__PURE__ */ new Map();
	for (const sessionKey of input.validationKeys) {
		const transactionRow = readExactSessionEntryRow(database, sessionKey);
		const expectedRow = input.expectedRows.get(sessionKey);
		if (transactionRow?.row.entry_json !== expectedRow?.row.entry_json || !sqliteSessionEntriesEqual(transactionRow?.entry, expectedRow?.entry)) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
		if (transactionRow) transactionEntries.set(sessionKey, transactionRow.entry);
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
			const entry = transactionEntries.get(sessionKey);
			return entry ? [{
				entry,
				sessionKey
			}] : [];
		});
		const selectedBefore = sourceEntries.toSorted((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0))[0]?.entry;
		for (const { entry, sessionKey } of sourceEntries) previous.set(sessionKey, entry);
		const written = writeSessionEntry(database, replacement.sessionKey, structuredClone(replacement.entry), {
			...input.consumePendingReset ? { consumePendingReset: true } : {},
			previousEntry: selectedBefore ?? null,
			canonicalPreviousEntry: transactionEntries.get(replacement.sessionKey) ?? null
		});
		deleteLegacySessionEntryRows(database, [...replacement.previousSessionKeys ?? []], replacement.sessionKey, { rehomeMembers: selectedBefore?.sessionId === replacement.entry.sessionId });
		if (replacement.previousSessionKeys?.some((key) => key !== replacement.sessionKey)) membershipInvalidatedKeys.push(replacement.sessionKey);
		current.set(replacement.sessionKey, written);
	}
	const maintenance = input.maintenance;
	if (input.ownerAssignment) {
		const { sessionKey, owner } = input.ownerAssignment;
		if (!current.has(sessionKey) || !replaceSessionOwnerInTransaction(database, sessionKey, owner)) throw new Error("Session owner assignment lost its creation target");
	}
	const preservation = maintenance?.preservation;
	const maintenancePlan = maintenance && preservation ? applySessionEntryMaintenanceInDatabase(database, maintenance, () => preservation) : emptySessionEntryMaintenancePlan();
	return {
		pendingArchiveRecovery: input.checkPendingArchiveRecovery === true && previous.size > 0 && hasPendingSessionTranscriptArchives(database),
		previous,
		current,
		maintenancePlans: [maintenancePlan],
		membershipInvalidatedKeys
	};
}
//#endregion
export { prepareSessionEntryReplacementPublication as n, commitSessionEntryReplacementsInDatabase as t };

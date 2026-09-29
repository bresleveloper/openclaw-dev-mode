import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-WWQJH57y.mjs";
import { r as mergeSessionSnapshotChanges, s as sessionSnapshotTouchedFieldsConflict } from "./session-snapshot-merge-Br9OMCio.mjs";
//#region src/auto-reply/reply/session-entry-persistence.ts
var SessionCommitRejectedError = class extends Error {};
/** Persists reply-owned state without reverting concurrent session management. */
async function persistReplySessionEntry(params) {
	let lifecycleError;
	let lifecycleEntry;
	let lockedEntry;
	let commitEntry = params.initialEntry;
	let persisted;
	try {
		persisted = await patchSessionEntryCore({
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, (_entry, context) => {
			commitEntry = context.existingEntry ?? params.initialEntry;
			if (!context.existingEntry) {
				if (params.allowCreate !== true) {
					lifecycleError = resolveSessionWorkStartError(params.sessionKey, void 0, { expectedSessionId: params.initialEntry.sessionId });
					return null;
				}
				return params.entry;
			}
			lifecycleError = resolveSessionWorkStartError(params.sessionKey, context.existingEntry, { expectedSessionId: params.initialEntry.sessionId });
			if (lifecycleError) {
				lifecycleEntry = context.existingEntry;
				return null;
			}
			if (params.requireModelSelectionUnlocked === true && context.existingEntry.modelSelectionLocked === true) {
				lockedEntry = context.existingEntry;
				return null;
			}
			if (sessionSnapshotTouchedFieldsConflict({
				initial: params.initialEntry,
				next: params.entry,
				current: context.existingEntry,
				touchedFields: params.touchedFields
			})) return null;
			return mergeSessionSnapshotChanges({
				initial: params.initialEntry,
				next: params.entry,
				current: context.existingEntry,
				reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending
			});
		}, {
			fallbackEntry: params.entry,
			replaceEntry: true,
			skipMaintenance: params.skipMaintenance,
			assertCommitAllowed: params.validateCommit ? () => {
				const error = params.validateCommit?.();
				if (error) throw new SessionCommitRejectedError(error);
			} : void 0
		});
	} catch (error) {
		if (error instanceof SessionCommitRejectedError) return {
			status: "commit-rejected",
			error: error.message,
			entry: commitEntry
		};
		throw error;
	}
	if (lifecycleError) return {
		status: "lifecycle-invalidated",
		error: lifecycleError,
		...lifecycleEntry ? { entry: lifecycleEntry } : {}
	};
	if (lockedEntry) return {
		status: "model-selection-locked",
		entry: lockedEntry
	};
	if (!persisted) return {
		status: "lifecycle-invalidated",
		error: `Session "${params.sessionKey}" changed while starting work. Retry.`
	};
	return {
		status: "current",
		entry: persisted
	};
}
//#endregion
export { persistReplySessionEntry as t };

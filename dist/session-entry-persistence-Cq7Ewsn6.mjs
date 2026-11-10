import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { t as captureAgentWorkspaceReadiness } from "./workspace-readiness-B5JSqS7C.mjs";
import { r as mergeSessionSnapshotChanges, s as sessionSnapshotTouchedFieldsConflict } from "./session-snapshot-merge-Dh-eJoIb.mjs";
//#region src/auto-reply/reply/session-entry-persistence.ts
var SessionCommitRejectedError = class extends Error {};
/** Persists reply-owned state without reverting concurrent session management. */
async function persistReplySessionEntry(params) {
	const workspaceReadiness = captureAgentWorkspaceReadiness(params.sessionKey);
	let lifecycleError;
	let lifecycleEntry;
	let lockedEntry;
	let commitEntry = params.initialEntry;
	let persisted;
	const commitGuard = composeSessionSourceAssertion([params.commitGuard], (assertSource) => {
		try {
			assertSource();
		} catch (error) {
			throw new SessionCommitRejectedError(error instanceof Error ? error.message : String(error), { cause: error });
		}
		const error = params.validateCommit?.();
		if (error) throw new SessionCommitRejectedError(error);
	});
	try {
		persisted = await patchSessionEntryCore({
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, (_entry, { existingEntry }) => {
			commitEntry = existingEntry ?? params.initialEntry;
			if (!existingEntry && params.allowCreate === true) return params.entry;
			lifecycleError = resolveSessionWorkStartError(params.sessionKey, existingEntry, {
				expectedSessionId: params.initialEntry.sessionId,
				allowPendingWorkspace: workspaceReadiness ? true : void 0
			});
			if (!existingEntry) return null;
			if (lifecycleError) {
				lifecycleEntry = existingEntry;
				return null;
			}
			if (params.requireModelSelectionUnlocked === true && existingEntry.modelSelectionLocked === true) {
				lockedEntry = existingEntry;
				return null;
			}
			const changes = {
				initial: params.initialEntry,
				next: params.entry,
				current: existingEntry,
				touchedFields: params.touchedFields,
				reassertLiveModelSwitchPending: params.reassertLiveModelSwitchPending
			};
			if (sessionSnapshotTouchedFieldsConflict(changes)) return null;
			return mergeSessionSnapshotChanges(changes);
		}, {
			fallbackEntry: params.entry,
			replaceEntry: true,
			skipMaintenance: params.skipMaintenance,
			...params.nativeCommitValidation ? { assertCommitAllowed: commitGuard } : sessionEntryCommitGuardOptions(commitGuard)
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

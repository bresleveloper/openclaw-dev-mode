import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { a as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { a as assertAgentDatabaseTerminalOpenAllowed, r as readOpenClawAgentDatabase } from "./openclaw-agent-db-readonly-open-hQ4ohjUT.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-WjVavOYj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { a as runWithSessionTranscriptReadFence, r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { d as loadTranscriptReadSnapshotSync } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { i as readRecentSessionTranscriptActiveEvents, r as readLatestSessionTranscriptMessageEvent } from "./session-accessor.sqlite-active-events-BE94zNkI.mjs";
import { t as readSessionTranscriptBoundedActiveContextCore } from "./session-accessor.sqlite-active-context-BG2hVt5Z.mjs";
import { t as readSessionTranscriptCurrentTurnEntry } from "./session-accessor.sqlite-current-turn-Cilb1ZXD.mjs";
import { t as readSessionTranscriptMaintenance } from "./session-transcript-maintenance-read-CwE1nVb0.mjs";
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
	const readMaintenance = (request) => readInOwner(() => {
		assertCurrent();
		if (!incognitoOwner) throw new Error("Session transcript is unavailable for maintenance planning");
		return readOpenClawAgentDatabase(incognitoOwner, (database) => readSessionTranscriptMaintenance(database, target, request)).value;
	}, (owner, resolvedScope) => owner.readMaintenance({
		target,
		resolvedScope,
		admission,
		request
	}, signal));
	const readRecentActiveEvents = (maxEvents) => readInOwner(() => readRecentSessionTranscriptActiveEvents(target, maxEvents, { readOnly: true }), (owner, resolvedScope) => owner.readRecentActiveEvents({
		target,
		resolvedScope,
		maxEvents,
		admission
	}, signal));
	const readLatestActiveMessage = () => readInOwner(() => readLatestSessionTranscriptMessageEvent(target, { readOnly: true }), (owner, resolvedScope) => owner.readLatestActiveMessage({
		target,
		resolvedScope,
		admission
	}, signal));
	return {
		target,
		read,
		readCurrentTurnEntry,
		readMaintenance,
		readRecentActiveEvents,
		readLatestActiveMessage,
		assertCurrent
	};
}
//#endregion
export { prepareSessionTranscriptHydration as t };

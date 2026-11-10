import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as findSessionTranscriptHeader } from "./session-entry-codec-DSMJ1XFN.mjs";
import { t as createSessionTranscriptHeader } from "./transcript-header-DiYg502H.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { r as formatLegacySqliteSessionMarkerForScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { _ as readSessionIdentitySnapshot, a as writeSessionEntry, m as normalizeLifecycleTarget, v as resolveLifecyclePrimaryEntry } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { b as readTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { r as prepareSessionEntryReplacementPublication } from "./session-accessor.sqlite-replacement-state-BqtqwF34.mjs";
//#region src/config/sessions/session-accessor.sqlite-recovery.worker.ts
/** The worker transaction owns the complete clone and both revisioned entry writes. */
function recoverRestartTombstoneInDatabase(database, params) {
	const resolved = {
		agentId: params.agentId,
		path: database.path
	};
	const sourceTarget = normalizeLifecycleTarget(params.sourceTarget);
	const successorTarget = normalizeLifecycleTarget(params.successorTarget);
	const source = resolveLifecyclePrimaryEntry(database, sourceTarget)?.entry;
	const recovery = source?.mainRestartRecovery;
	const tombstone = recovery?.tombstone;
	if (!source?.sessionId || !recovery || !tombstone) return { result: {
		status: "conflict",
		reason: "not-tombstoned"
	} };
	if (source.sessionId !== params.expected.sessionId || source.lifecycleRevision !== params.expected.lifecycleRevision || recovery.cycleId !== params.expected.cycleId || source.pluginOwnerId !== params.expected.pluginOwnerId) return { result: {
		status: "conflict",
		reason: "source-changed"
	} };
	const recoveredSessionKey = tombstone.recoveredSessionKey;
	const recoveredSessionId = tombstone.recoveredSessionId;
	if (recoveredSessionKey || recoveredSessionId) {
		if (!recoveredSessionKey || !recoveredSessionId) return { result: {
			status: "conflict",
			reason: "successor-missing"
		} };
		const linked = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget({
			canonicalKey: recoveredSessionKey,
			storeKeys: [recoveredSessionKey]
		}))?.entry;
		if (!linked || linked.sessionId !== recoveredSessionId) return { result: {
			status: "conflict",
			reason: "successor-missing"
		} };
		return { result: {
			status: "existing",
			sourceEntry: structuredClone(source),
			successorEntry: structuredClone(linked),
			successorKey: recoveredSessionKey
		} };
	}
	if (recovery.revision !== params.expected.revision) return { result: {
		status: "conflict",
		reason: "source-changed"
	} };
	if (resolveLifecyclePrimaryEntry(database, successorTarget)?.entry) return { result: {
		status: "conflict",
		reason: "target-exists"
	} };
	const header = readTranscriptEventsFromDatabase(database, source.sessionId, findSessionTranscriptHeader);
	if (!header) return { result: {
		status: "conflict",
		reason: "transcript-missing"
	} };
	const successorSessionId = params.successorEntry.sessionId;
	const parentSession = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: source.sessionId,
		sessionKey: normalizeStoreSessionKey(sourceTarget.canonicalKey)
	});
	readTranscriptEventsFromDatabase(database, source.sessionId, (sourceEvents) => appendTranscriptEventsInTransaction(database, {
		...resolved,
		sessionId: successorSessionId,
		sessionKey: normalizeStoreSessionKey(successorTarget.canonicalKey)
	}, (function* () {
		yield {
			...createSessionTranscriptHeader({
				cwd: typeof header.cwd === "string" ? header.cwd : void 0,
				sessionId: successorSessionId,
				version: header.version ?? 3
			}),
			parentSession
		};
		for (const event of sourceEvents) if (!(isRecord(event) && event.type === "session")) yield event;
	})(), { scheduleProjectionReconcile: false }));
	const now = Date.now();
	const nextSource = {
		...source,
		mainRestartRecovery: {
			...recovery,
			revision: recovery.revision + 1,
			tombstone: {
				...tombstone,
				recoveredSessionId: successorSessionId,
				recoveredSessionKey: successorTarget.canonicalKey
			}
		},
		archivedAt: source.archivedAt ?? now,
		...source.archiveReason ? { archiveReason: source.archiveReason } : source.archivedAt === void 0 ? { archiveReason: "restart-recovery" } : {},
		...source.archivedBy === void 0 && params.archivedBy ? { archivedBy: params.archivedBy } : {},
		updatedAt: Math.max(now, (source.updatedAt ?? 0) + 1)
	};
	delete nextSource.pinnedAt;
	const identityKeys = [sourceTarget.canonicalKey, successorTarget.canonicalKey];
	const previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
	writeSessionEntry(database, successorTarget.canonicalKey, params.successorEntry);
	writeSessionEntry(database, sourceTarget.canonicalKey, nextSource, { previousEntry: source });
	const currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
	return {
		result: {
			status: "created",
			sourceEntry: structuredClone(nextSource),
			successorEntry: structuredClone(params.successorEntry),
			successorKey: successorTarget.canonicalKey
		},
		publication: prepareSessionEntryReplacementPublication({
			pendingArchiveRecovery: false,
			previous: previousIdentity,
			current: currentIdentity,
			maintenancePlans: [],
			membershipInvalidatedKeys: []
		}, database)
	};
}
//#endregion
export { recoverRestartTombstoneInDatabase };

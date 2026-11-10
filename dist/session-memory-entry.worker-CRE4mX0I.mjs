import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { i as projectSessionEntryRecord } from "./session-entry-projection-E2uWbpaJ.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as runWithSessionTranscriptReadFence } from "./session-transcript-read-fence-CgUG4J4j.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { S as readTranscriptExportSnapshotReadOnlySync, x as readTranscriptExportSnapshotFromDatabase } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { a as renderSessionEntrySnapshot, r as readSessionEntryResetRecallCutoff } from "./session-entry-render-BZbrykV0.mjs";
//#region src/config/sessions/session-memory-entry-preparation.worker.ts
const snapshots = /* @__PURE__ */ new Map();
const MAX_SNAPSHOTS = 16;
const MAX_SNAPSHOT_BYTES = 4194304;
/** The export worker retains projected rows; transcript rewrite identity replaces the prefix. */
async function prepareSessionMemoryEntry(request) {
	const [result] = await prepareSessionMemoryEntries([request]);
	if ("cold" in result) throw new SessionTranscriptColdError(request.options.sessionId);
	return result;
}
async function prepareSessionMemoryEntries(entries, publish) {
	const results = [];
	for (const [index, request] of entries.entries()) {
		const resolved = resolveSqliteTranscriptReadScope(request.options);
		const previous = snapshots.get(snapshotKey(request));
		const options = {
			projectEvent: projectSessionEntryRecord,
			previous: previous?.generation != null && previous.throughSeq !== void 0 ? {
				events: previous.events,
				generation: previous.generation,
				throughSeq: previous.throughSeq
			} : null
		};
		let snapshot;
		try {
			const read = withOpenClawAgentDatabaseReadOnly((database) => runSqliteReadSnapshotSync(database.db, () => runWithSessionTranscriptReadFence(request.admission, () => readTranscriptExportSnapshotFromDatabase(database, resolved, request.options, options, { deferAboveBytes: MAX_SNAPSHOT_BYTES })), { operationLabel: "session transcript export" }), toDatabaseOptions(resolved));
			snapshot = read.found ? read.value : null;
			if (snapshot?.deferred) {
				const batchHead = snapshot;
				snapshot = runWithSessionTranscriptReadFence(request.admission, () => readTranscriptExportSnapshotReadOnlySync(request.options, options, batchHead) ?? null);
			}
		} catch (error) {
			if (!(error instanceof SessionTranscriptColdError)) throw error;
			snapshot = "cold";
		}
		let value;
		if (snapshot === "cold") value = { cold: true };
		else {
			retainSnapshot(snapshotKey(request), snapshot);
			const entry = snapshot ? await renderSessionEntrySnapshot(request.absPath, request.options, snapshot) : null;
			value = {
				entry,
				resetRecallCutoff: entry ? readSessionEntryResetRecallCutoff(entry) : { state: "absent" }
			};
		}
		if (publish) await publish(index, value);
		else results[index] = value;
	}
	return results;
}
function snapshotKey({ options }) {
	return JSON.stringify([
		options.storePath,
		options.agentId,
		options.sessionId
	]);
}
function retainSnapshot(key, snapshot) {
	snapshots.delete(key);
	if (snapshot && snapshot.stats.sizeBytes <= MAX_SNAPSHOT_BYTES) {
		snapshots.set(key, snapshot);
		if (snapshots.size > MAX_SNAPSHOTS) snapshots.delete(snapshots.keys().next().value);
	}
}
//#endregion
//#region src/config/sessions/session-memory-entry.worker.ts
/** The dispatcher delegates acknowledged delivery to the export owner. */
async function deliverSessionMemoryEntries(entries, channel, control) {
	if (!channel) throw new Error("Session exports require their host delivery channel");
	channel.consumeInput();
	await prepareSessionMemoryEntries(entries, async (index, value) => {
		control.throwIfCancelled();
		(await channel.request({
			kind: "session-entries",
			index,
			value
		})).consumed();
		control.throwIfCancelled();
	});
	return { entries: [] };
}
//#endregion
export { deliverSessionMemoryEntries, prepareSessionMemoryEntry };

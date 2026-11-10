import "./config-env-vars-BHneg24Q.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./artifacts-C6u8F4sP.mjs";
import "./paths-YgcBNLgG.mjs";
import "./transcript-events-D3brcRJS.mjs";
import "./sdk-deprecation-DjTmOhOX.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./openclaw-runtime-paths-BEYXs6HA.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import "./main-session-CHYPkxYr.mjs";
import "./tokens-DHFPcfdZ.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-cold-storage-state-CWFSrppd.mjs";
import { a as captureSessionEntryReadScope } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import "./archive-compression-wxOTBVKt.mjs";
import "./session-history-BKt1cI8X.mjs";
import "./session-cold-storage-read-DxurMT4l.mjs";
import { T as readTranscriptStatsSync } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import "./config-B3oiWDlr.mjs";
import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import { r as captureMemoryOwner, t as readTranscriptStatsBatchReadOnlySync } from "./session-transcript-stats-read-yuA27vDM.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-stats-batch.ts
/** Preserve input order while reading each durable store in one worker request. */
async function readTranscriptStatsBatchReadOnlyAsync(scopes) {
	const results = scopes.map(() => null);
	const groups = /* @__PURE__ */ new Map();
	for (const [index, input] of scopes.entries()) {
		const memory = captureSessionActorTranscriptRead(input);
		if (memory) {
			if (memory.missing) {
				memory.assertCurrent();
				results[index] = {
					eventCount: 0,
					maxSeq: 0,
					sizeBytes: 0
				};
			} else results[index] = await memory.read("session.history.stats", {});
			continue;
		}
		const { scope, agentId } = captureSessionEntryReadScope({
			...input,
			sessionKey: input.sessionKey ?? ""
		});
		const storePath = resolveSessionStorePathForScope(scope);
		const captured = {
			...scope,
			agentId,
			storePath
		};
		const key = JSON.stringify([
			agentId,
			storePath,
			captured.env
		]);
		const group = groups.get(key) ?? {
			scope: captured,
			sessionIds: [],
			indexes: []
		};
		group.sessionIds.push(input.sessionId);
		group.indexes.push(index);
		groups.set(key, group);
	}
	await Promise.all([...groups.values()].map(async ({ scope, sessionIds, indexes }) => {
		const stats = await withSessionStoreReaderInWorker(scope, ({ reader, database }) => reader.readTranscriptStatsBatch({
			sessionIds,
			env: database.env ?? scope.env
		}), {
			backing: true,
			dataOnly: true
		});
		for (const [offset, index] of indexes.entries()) results[index] = stats[offset] ?? null;
	}));
	return results;
}
//#endregion
//#region packages/memory-host-sdk/src/host/openclaw-runtime-session.ts
/** Capture the memory namespace once; reads never create a missing owner or session. */
function captureIncognitoMemoryReader(scope) {
	const namespace = captureMemoryOwner(scope);
	if (!namespace) return;
	const selected = namespace.binding?.agentId === namespace.agentId ? namespace.binding : void 0;
	const read = async (consume, missing) => {
		if (!namespace.owner && !selected) {
			namespace.authority.assertCurrent();
			return missing;
		}
		return await withSessionActorStorage({
			...scope,
			agentId: namespace.agentId,
			storePath: namespace.path,
			sessionActor: selected
		}, {
			authority: namespace.authority,
			lifetime: {
				assertCurrent: () => namespace.authority.assertCurrent(),
				assertReadable: () => namespace.authority.assertCurrent()
			}
		}, consume) ?? missing;
	};
	const selection = {
		sessionId: scope.sessionId ?? scope.sessionEntry?.sessionId,
		sessionKey: scope.sessionKey
	};
	return {
		memoryEntry(absPath, options) {
			return read(async (memory) => {
				const { buildSessionEntryFromSnapshot } = await import("./session-files-DKbBd4o5.mjs");
				const snapshot = await memory.actor.storage.read({
					type: "session.memory.entry",
					input: {
						...selection,
						includeMessages: Boolean(options.onTranscriptMessage)
					}
				}, memory.authority);
				if (!snapshot) return null;
				return buildSessionEntryFromSnapshot(absPath, {
					...options,
					agentId: memory.agentId,
					storePath: memory.path,
					sessionId: snapshot.sessionId,
					sessionKey: snapshot.sessionKey
				}, snapshot, () => {
					memory.actor.snapshot(memory.authority);
				});
			}, null);
		},
		memoryResetRecall() {
			return read((memory) => memory.actor.storage.read({
				type: "session.memory.resetRecall",
				input: selection
			}, memory.authority), { state: "invalid" });
		}
	};
}
/** Keep worker launch machinery behind the memory host's existing lazy runtime bridge. */
async function prepareSessionEntriesInWorker(...args) {
	const { prepareSessionEntriesInWorker: prepare } = await import("./session-transcript-read-worker-runtime-T0jRoZss.mjs");
	return prepare(...args);
}
async function prepareSessionEntryInWorker(...args) {
	const { prepareSessionEntryInWorker: prepare } = await import("./session-transcript-read-worker-runtime-T0jRoZss.mjs");
	return prepare(...args);
}
async function readSessionEntrySnapshotInWorker(...args) {
	const { readSessionEntrySnapshotInWorker: read } = await import("./session-transcript-read-worker-runtime-T0jRoZss.mjs");
	return read(...args);
}
async function readSessionTranscriptCorpusInWorker(...args) {
	const { readSessionTranscriptCorpusInWorker: read } = await import("./session-transcript-inventory-runtime-DUElZKxV.mjs");
	return read(...args);
}
/**
* Returns an opaque revision that changes for every canonical transcript mutation.
* Read-only callers stay on the read-only reader; a missing transcript has no revision.
*/
function readTranscriptContentRevisionSync(params) {
	const { readOnly, ...scope } = params;
	const stats = readOnly ? readTranscriptStatsBatchReadOnlySync([scope])[0] : readTranscriptStatsSync(scope);
	if (!stats) return;
	return [
		"sqlite",
		stats.maxSeq,
		stats.sizeBytes,
		stats.eventCount,
		stats.lastMutationAtMs ?? "",
		stats.lastObservedMutationAtMs ?? ""
	].join(":");
}
/** Extracts the agent id from a canonical `agents/<id>/sessions` directory path. */
function extractAgentIdFromSessionsDir(sessionsDir) {
	const parts = path.normalize(path.resolve(sessionsDir)).split(path.sep).filter(Boolean);
	const sessionsSegment = parts.at(-1);
	const agentId = parts.at(-2);
	const agentsSegment = parts.at(-3);
	const isWindows = process.platform === "win32";
	if (!sessionsSegment || !agentId || !agentsSegment || (isWindows ? sessionsSegment.toLowerCase() : sessionsSegment) !== "sessions" || (isWindows ? agentsSegment.toLowerCase() : agentsSegment) !== "agents" || isWindows && (agentId !== agentId.trim() || !isValidAgentId(agentId))) return null;
	return isWindows ? normalizeAgentId(agentId) : agentId;
}
/** Finds the nearest canonical sessions owner without escaping its directory. */
function extractAgentIdFromSessionPath(absPath) {
	let currentDir = path.dirname(path.resolve(absPath));
	while (true) {
		const currentSegment = path.basename(currentDir);
		if ((process.platform === "win32" ? currentSegment.toLowerCase() : currentSegment) === "sessions") {
			const agentId = extractAgentIdFromSessionsDir(currentDir);
			if (agentId) return agentId;
		}
		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) return null;
		currentDir = parentDir;
	}
}
async function readSessionResetRecallCutoffInWorker(...args) {
	const { readSessionResetRecallCutoffInWorker: read } = await import("./session-transcript-read-worker-runtime-T0jRoZss.mjs");
	return read(...args);
}
//#endregion
export { prepareSessionEntryInWorker as a, readSessionTranscriptCorpusInWorker as c, prepareSessionEntriesInWorker as i, readTranscriptContentRevisionSync as l, extractAgentIdFromSessionPath as n, readSessionEntrySnapshotInWorker as o, extractAgentIdFromSessionsDir as r, readSessionResetRecallCutoffInWorker as s, captureIncognitoMemoryReader as t, readTranscriptStatsBatchReadOnlyAsync as u };

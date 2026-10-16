import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./config-env-vars-DjPHKieF.mjs";
import "./session-key-C09ow4h0.mjs";
import "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./artifacts-BvSTVPj-.mjs";
import "./paths-dpReqUI8.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./config-CzeZu5J_.mjs";
import "./internal-runtime-context-CAWYwg4i.mjs";
import "./transcript-events-DUHAZLVw.mjs";
import "./tokens-D4ghQG_g.mjs";
import "./main-session-00MgEWj5.mjs";
import "./session-cold-storage-state-CzcE3h3O.mjs";
import "./heartbeat-BjLIgeQc.mjs";
import "./strip-inbound-meta-BWIgBUDF.mjs";
import "./input-provenance-D1LHo5Qj.mjs";
import "./session-cold-storage-read-rGbdRuJQ.mjs";
import { C as readTranscriptStatsSync } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import "./heartbeat-filter-CNihh_E4.mjs";
import "./heartbeat-events-filter-DMpc12GN.mjs";
import "./session-store-runtime-BS2ijndm.mjs";
import path from "node:path";
//#region packages/memory-host-sdk/src/host/openclaw-runtime-session.ts
/** Keep worker launch machinery behind the memory host's existing lazy runtime bridge. */
async function prepareSessionEntryInWorker(...args) {
	const { prepareSessionEntryInWorker: prepare } = await import("./session-transcript-read-worker-runtime-BZjHXMae.mjs");
	return prepare(...args);
}
async function readSessionTranscriptCorpusInWorker(...args) {
	const { readSessionTranscriptCorpusInWorker: read } = await import("./session-transcript-inventory-runtime-CT1xXmFH.mjs");
	return read(...args);
}
/** Returns an opaque revision that changes for every canonical transcript mutation. */
function readTranscriptContentRevisionSync(params) {
	const stats = readTranscriptStatsSync(params);
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
	const { readSessionResetRecallCutoffInWorker: read } = await import("./session-transcript-read-worker-runtime-BZjHXMae.mjs");
	return read(...args);
}
//#endregion
export { readSessionTranscriptCorpusInWorker as a, readSessionResetRecallCutoffInWorker as i, extractAgentIdFromSessionsDir as n, readTranscriptContentRevisionSync as o, prepareSessionEntryInWorker as r, extractAgentIdFromSessionPath as t };

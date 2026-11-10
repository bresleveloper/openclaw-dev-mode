import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { S as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-FWbk4b3p.mjs";
import { x as recordSessionParticipantInWorker } from "./session-accessor-Czw4l8kI.mjs";
//#region src/sessions/session-participant-recording.ts
const pendingRecordings = resolveGlobalSingleton(Symbol.for("openclaw.pendingSessionParticipantRecordings"), () => /* @__PURE__ */ new Map());
function participantSessionKey(target) {
	const agentId = normalizeAgentId(target.agentId);
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(target.sessionKey);
	const sessionKey = normalized === "global" || normalized === "unknown" ? normalized : toAgentStoreSessionKey({
		agentId,
		requestKey: normalized
	});
	return JSON.stringify([agentId, sessionKey]);
}
/** Join accepted input before snapshotting its credit, outside any store/lifecycle hold. */
async function waitForSessionParticipantRecording(target) {
	const pending = [...pendingRecordings.get(participantSessionKey(target)) ?? []];
	if (pending.length === 0) return;
	await Promise.allSettled(pending);
}
/** Defers participant history persistence so it can never delay or abort an admitted turn. */
function recordSessionParticipantBestEffort(params) {
	const promptedAt = params.promptedAt ?? Date.now();
	const work = trackAsyncWork(() => runOutsideGatewayRootWorkAdmission(async () => {
		await Promise.resolve();
		try {
			await recordSessionParticipantInWorker({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}, {
				identity: params.identity,
				promptedAt,
				sessionAgentId: params.agentId
			});
		} catch (error) {
			params.onError?.(error);
		}
	})).catch((error) => params.onError?.(error));
	const key = participantSessionKey(params);
	const pending = pendingRecordings.get(key) ?? /* @__PURE__ */ new Set();
	pending.add(work);
	pendingRecordings.set(key, pending);
	const settled = () => {
		pending.delete(work);
		if (pending.size === 0) pendingRecordings.delete(key);
	};
	work.then(settled, settled);
}
//#endregion
export { waitForSessionParticipantRecording as n, recordSessionParticipantBestEffort as t };

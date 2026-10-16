import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as trackAsyncWork } from "./async-work-scope-BYeX3gh6.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { A as normalizeSessionKeyPreservingOpaquePeerIds, _ as toAgentStoreSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { C as recordSessionParticipantInWorker } from "./session-accessor-cUVSaeKy.mjs";
import path from "node:path";
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
async function participantStorePath(target, env) {
	const resolved = await prepareSqliteTargetFromSessionStorePath(target.storePath, {
		agentId: target.agentId,
		env
	});
	return resolveIdentityPathViaExistingAncestorSync(resolved.path);
}
/** Join accepted input before snapshotting its credit, outside any store/lifecycle hold. */
async function waitForSessionParticipantRecording(target) {
	const pending = [...pendingRecordings.get(participantSessionKey(target)) ?? []];
	if (pending.length === 0) return;
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	let physicalTarget;
	await Promise.allSettled(pending.map(async (recording) => {
		if (path.resolve(recording.target.storePath) !== path.resolve(target.storePath)) {
			const [requested, recorded] = await Promise.all([physicalTarget ??= participantStorePath(target, env), participantStorePath(recording.target, recording.env)]);
			if (requested !== recorded) return;
		}
		await recording.work;
	}));
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
	const recording = {
		target: {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		},
		env: captureSessionTranscriptStorageEnvironment(process.env),
		work
	};
	pending.add(recording);
	pendingRecordings.set(key, pending);
	const settled = () => {
		pending.delete(recording);
		if (pending.size === 0) pendingRecordings.delete(key);
	};
	work.then(settled, settled);
}
//#endregion
export { waitForSessionParticipantRecording as n, recordSessionParticipantBestEffort as t };

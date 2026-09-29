import { c as trackAsyncWork } from "./async-work-scope-CWk2dk1h.mjs";
import { T as runWithRetainedGatewayRootWork } from "./gateway-work-admission-CHv_0noy.mjs";
import { U as recordSessionParticipantInWorker } from "./session-accessor-l-4ZHvKn.mjs";
//#region src/sessions/session-participant-recording.ts
/** Defers participant history persistence so it can never delay or abort an admitted turn. */
function recordSessionParticipantBestEffort(params) {
	const promptedAt = params.promptedAt ?? Date.now();
	trackAsyncWork(() => runWithRetainedGatewayRootWork(async () => {
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
}
//#endregion
export { recordSessionParticipantBestEffort as t };

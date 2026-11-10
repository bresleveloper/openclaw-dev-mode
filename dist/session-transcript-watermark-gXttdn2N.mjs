import { t as captureSessionActorTranscriptRead } from "./session-actor-transcript-read-Wje_m4fK.mjs";
import { t as withSessionTranscriptReadSource } from "./session-transcript-read-source-Bmo2UYck.mjs";
import path from "node:path";
//#region src/config/sessions/session-transcript-watermark.ts
function readSessionTranscriptWatermarkAsync(scope) {
	const memory = captureSessionActorTranscriptRead(scope);
	if (memory) {
		if (memory.missing) {
			memory.assertCurrent();
			return Promise.resolve({
				generation: null,
				maxSeq: null
			});
		}
		return memory.read("session.history.watermark", {}).then((result) => result.watermark);
	}
	return withSessionTranscriptReadSource(scope, ({ scope: captured, owner, preparedReads, expectedIdentity }) => (preparedReads ?? owner).readWatermark({
		scope: captured,
		expectedIdentity
	}));
}
/** Prepared boundary evidence only; final delivery retains its current writer and turn guards. */
async function readSessionTranscriptStartAsync(scope) {
	const target = {
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		storePath: path.resolve(scope.storePath)
	};
	const watermark = await readSessionTranscriptWatermarkAsync({
		...target,
		env: scope.env
	});
	return {
		...target,
		...watermark
	};
}
//#endregion
export { readSessionTranscriptWatermarkAsync as n, readSessionTranscriptStartAsync as t };

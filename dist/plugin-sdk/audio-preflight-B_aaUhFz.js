import "./run-with-concurrency-DhMKNVpI.js";
import "./model-auth-CaxBuigV.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-CQsSB0EM.js";
import "./paths-CtOdJffQ.js";
import "./github-copilot-token-BLx9ZUBJ.js";
import "./thinking-BgYk8jDi.js";
import "./accounts-DIP_YQdu.js";
import "./plugins-DMOsoNVq.js";
import "./image-ops-D7EC9-0o.js";
import "./pi-embedded-helpers-DPucGs3n.js";
import "./accounts-Dd9kacAJ.js";
import "./accounts-Cqrp19n_.js";
import "./paths-DWdzjQje.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-CsxvwXOe.js";
import "./image-DM0Xrq3C.js";
import "./chrome-CylXZHex.js";
import "./skills-yHFjxVF7.js";
import "./path-alias-guards-kkFDc18i.js";
import "./redact-Bkty79fb.js";
import "./errors-C8ZgIUby.js";
import "./fs-safe-BDNnHIDA.js";
import "./proxy-env-DPgqVcba.js";
import "./store-C48zY6ZZ.js";
import "./tool-images-CAwqV3qH.js";
import "./fetch-guard-BTR8Vwye.js";
import "./api-key-rotation-BoqKs7Xr.js";
import "./local-roots-DgO10kgA.js";
import "./proxy-fetch-WQDr4H8_.js";
//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	try {
		const { transcript } = await runAudioTranscription({
			ctx,
			cfg,
			attachments,
			agentDir: params.agentDir,
			providers: params.providers,
			activeModel: params.activeModel,
			localPathRoots: resolveMediaAttachmentLocalRoots({
				cfg,
				ctx
			})
		});
		if (!transcript) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`);
		return transcript;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	}
}
//#endregion
export { transcribeFirstAudio };

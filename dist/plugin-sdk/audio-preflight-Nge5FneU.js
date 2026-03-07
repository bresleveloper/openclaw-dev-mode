import "./run-with-concurrency-Do_Mn3XJ.js";
import "./paths-B9fwHuf0.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-jRwfXfR1.js";
import "./accounts-Bt8sAcSN.js";
import "./thinking-C_2FZt-A.js";
import "./model-auth-B8ugbJXc.js";
import "./plugins-CvsECvRM.js";
import "./accounts-DSEesV_S.js";
import "./accounts-BEFHz71r.js";
import "./github-copilot-token-B2m7CSyP.js";
import "./ssrf-CwSOAd1A.js";
import "./fetch-guard-DvUQDdzE.js";
import "./message-channel-CFGJ-htG.js";
import "./path-alias-guards-RlW5D-tr.js";
import "./fs-safe-SS3zkVfa.js";
import "./store-DVjcJNfv.js";
import "./local-roots-B7KvdGPO.js";
import "./pi-embedded-helpers-uxhPbY5P.js";
import "./paths-BGxsuUSa.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-D9h7krgR.js";
import "./image-OUryi-wd.js";
import "./chrome-BwCaKFTM.js";
import "./skills-4FOtj1d1.js";
import "./redact-oygOkZ9l.js";
import "./errors-CegfyFZB.js";
import "./tool-images-Bj5YTmU7.js";
import "./api-key-rotation-Dgnf7urJ.js";
import "./proxy-fetch-C-cD3Yym.js";
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

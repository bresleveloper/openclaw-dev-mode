import "./message-channel-DMQTmTNv.js";
import { B as shouldLogVerbose, R as logVerbose } from "./utils-CmwgRR7I.js";
import "./paths-Dmn791zP.js";
import "./tool-images-Gov9-Ds7.js";
import "./run-with-concurrency-Ddb9i3yy.js";
import "./model-auth-C8GM6p1v.js";
import "./github-copilot-token-Dd61hN7H.js";
import "./thinking-jnF5z1KQ.js";
import "./ssrf-mrymR-Zp.js";
import "./fetch-guard-oY8J6M9d.js";
import "./accounts-CrnHeb1q.js";
import "./plugins-m91qhrBY.js";
import "./pi-embedded-helpers-CLl3Lz2d.js";
import "./accounts-BCfLCdQI.js";
import "./accounts-B_OaB23J.js";
import "./paths-9_9za37f.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-B6aDb9da.js";
import "./image-Cr7RUzR_.js";
import "./chrome-DozFCXXR.js";
import "./skills-CuSS3AV5.js";
import "./path-alias-guards-DwMIkr-Z.js";
import "./redact-CWtNHp3v.js";
import "./errors-BIx1iMro.js";
import "./fs-safe-UWDFi0J-.js";
import "./store-yib8PDfu.js";
import "./api-key-rotation-tM-GKc-Y.js";
import "./local-roots-DT1XnjvV.js";
import "./proxy-fetch-DiAKaO-h.js";
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

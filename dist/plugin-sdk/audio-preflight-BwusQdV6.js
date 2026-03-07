import "./run-with-concurrency-CWh7CuJZ.js";
import "./accounts-DXBuS0M5.js";
import "./paths-eFexkPEh.js";
import "./github-copilot-token-Cxf8QYZb.js";
import "./config-DsOWzWmU.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-IRKETRMd.js";
import "./thinking-CDxrqekX.js";
import "./image-ops-DAAtPyza.js";
import "./pi-embedded-helpers-aohswcEW.js";
import "./plugins-Dz9iIawy.js";
import "./accounts-BwWhog4G.js";
import "./accounts-BJ_K25Nn.js";
import "./paths-BZxNY0wq.js";
import "./redact-BDiKSVX1.js";
import "./errors-Cr8axI0N.js";
import "./path-alias-guards-C0zthhyO.js";
import "./fs-safe-4yoePFyv.js";
import "./ssrf-COC0PzR6.js";
import "./fetch-guard-DjUIgrk6.js";
import "./local-roots-CnA7RwU3.js";
import "./tool-images-CsMngy4L.js";
import { i as normalizeMediaAttachments, m as isAudioAttachment, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-BEP-l3ob.js";
import "./image-BRWfmmJL.js";
import "./chrome-BriEg17b.js";
import "./skills-0cAu5_X6.js";
import "./store-BQ5tHTlT.js";
import "./api-key-rotation-D7BQBefs.js";
import "./proxy-fetch-BTfwqmaA.js";
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

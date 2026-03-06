import "./run-with-concurrency-DHFRtnak.js";
import "./accounts-ljytIpXr.js";
import "./paths-MKyEVmEb.js";
import "./github-copilot-token-D5fdS6xD.js";
import "./config-CLhoCA5D.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-Dv6Sz3FH.js";
import "./thinking-BW30wQ2F.js";
import "./image-ops-Dm756PA0.js";
import "./pi-embedded-helpers-Cv58ZPkV.js";
import "./plugins-B6K_DDF8.js";
import "./accounts-TsY-H8E7.js";
import "./accounts-CH3VtXOn.js";
import "./paths-BYsZgUsy.js";
import "./redact-NS3jMXUa.js";
import "./errors-mEzH8r2i.js";
import "./path-alias-guards-B_fvYSKr.js";
import "./fs-safe-D2iDsCwG.js";
import "./ssrf-kn0ZoRWP.js";
import "./fetch-guard-EOUT_kzS.js";
import "./local-roots-ByK1hMg9.js";
import "./tool-images-CvbslaHs.js";
import { f as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-C6nTZncq.js";
import "./skills-KPczeUI0.js";
import "./chrome-CD_bvD3Y.js";
import "./store-BouYB6Fw.js";
import "./image-D1tm6VgJ.js";
import "./api-key-rotation-Cpp9KXyd.js";
import "./proxy-fetch-BWV7Qea4.js";

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
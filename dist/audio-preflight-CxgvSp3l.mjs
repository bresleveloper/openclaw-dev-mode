import { u as normalizeMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { i as logVerbose, o as shouldLogVerbose } from "./globals-XVSoVbNQ.mjs";
import { t as isAudioAttachment } from "./attachments.normalize-AoU-OJys.mjs";
import "./attachments-BF8uPjs6.mjs";
import { n as sendTranscriptEcho } from "./echo-transcript-Bq8lp7ks.mjs";
import { n as normalizeMediaAttachments, r as resolveMediaAttachmentLocalRoots, t as createMediaAttachmentCache } from "./runner.attachments-DIrYURkS.mjs";
import { t as buildMediaUnderstandingRegistry } from "./provider-registry-BXxQV3kt.mjs";
import { n as runCapability } from "./runner-BRBLNXv5.mjs";
//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (audioConfig?.enabled === false) return;
	const firstAudio = normalizeMediaAttachments(ctx).find((att) => isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	try {
		const media = [firstAudio];
		const { agentDir, providers, activeModel } = params;
		const localPathRoots = resolveMediaAttachmentLocalRoots({
			cfg,
			ctx
		});
		const providerRegistry = buildMediaUnderstandingRegistry(providers, cfg);
		const cache = createMediaAttachmentCache(media, {
			localPathRoots,
			ssrfPolicy: cfg.tools?.web?.fetch?.ssrfPolicy
		});
		let transcript;
		try {
			transcript = (await runCapability({
				capability: "audio",
				cfg,
				ctx,
				attachments: cache,
				media,
				agentDir,
				providerRegistry,
				config: cfg.tools?.media?.audio,
				activeModel
			})).outputs.find((entry) => entry.kind === "audio.transcription")?.text?.trim();
		} finally {
			await cache.cleanup();
		}
		if (!transcript) return;
		if (audioConfig?.echoTranscript) await sendTranscriptEcho({
			ctx,
			cfg,
			transcript,
			format: audioConfig.echoFormat ?? "📝 \"{transcript}\""
		});
		const facts = normalizeMediaFacts(ctx.media);
		const transcribedFact = facts[firstAudio.index];
		if (transcribedFact) {
			facts[firstAudio.index] = {
				...transcribedFact,
				transcribed: true
			};
			ctx.media = facts;
		}
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`);
		return transcript;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	}
}
//#endregion
export { transcribeFirstAudio };

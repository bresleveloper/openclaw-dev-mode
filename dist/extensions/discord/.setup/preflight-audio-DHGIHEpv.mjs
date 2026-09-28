import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getFileExtension } from "openclaw/plugin-sdk/media-mime";
import { createChannelPreflightAudio } from "openclaw/plugin-sdk/media-understanding-runtime";
//#region extensions/discord/src/monitor/preflight-audio.ts
const AUDIO_ATTACHMENT_MIME_BY_EXT = /* @__PURE__ */ new Map([
	[".aac", "audio/aac"],
	[".caf", "audio/x-caf"],
	[".flac", "audio/flac"],
	[".m4a", "audio/mp4"],
	[".mp3", "audio/mpeg"],
	[".oga", "audio/ogg"],
	[".ogg", "audio/ogg"],
	[".opus", "audio/opus"],
	[".wav", "audio/wav"]
]);
function inferAudioAttachmentMime(attachment) {
	const contentType = normalizeOptionalString(attachment.content_type);
	if (contentType?.startsWith("audio/")) return contentType;
	if (typeof normalizeOptionalString(attachment.waveform) === "string") return "audio/ogg";
	if (!(contentType?.startsWith("video/") === true || contentType?.startsWith("image/") === true) && typeof attachment.duration_secs === "number") return "audio/ogg";
	const ext = getFileExtension(attachment.filename ?? attachment.url);
	return ext ? AUDIO_ATTACHMENT_MIME_BY_EXT.get(ext) : void 0;
}
const discordPreflightAudio = createChannelPreflightAudio({
	channel: "discord",
	isAudio: (attachment) => Boolean(normalizeOptionalString(attachment.url) && inferAudioAttachmentMime(attachment)),
	deferTranscriptEcho: false
});
function collectAudioAttachments(attachments) {
	if (!Array.isArray(attachments)) return [];
	return attachments.filter(discordPreflightAudio.isAudio);
}
async function resolveDiscordPreflightAudioMentionContext(params) {
	const audioAttachments = collectAudioAttachments(params.message.attachments);
	const hasAudioAttachment = audioAttachments.length > 0;
	const hasTypedText = Boolean(params.message.content?.trim());
	const needsPreflightTranscription = hasAudioAttachment && !hasTypedText && (params.isDirectMessage || params.shouldRequireMention && params.mentionRegexes.length > 0);
	let transcript;
	if (needsPreflightTranscription) {
		if (params.abortSignal?.aborted) return {
			hasAudioAttachment,
			hasTypedText
		};
		const media = audioAttachments.flatMap((attachment) => {
			const url = normalizeOptionalString(attachment.url);
			return url ? [{
				url,
				contentType: inferAudioAttachmentMime(attachment)
			}] : [];
		});
		if (media.length > 0) transcript = await discordPreflightAudio.resolve({
			request: {
				ctx: { media },
				cfg: params.cfg,
				agentDir: void 0
			},
			abortSignal: params.abortSignal
		});
	}
	return {
		hasAudioAttachment,
		hasTypedText,
		transcript
	};
}
//#endregion
export { resolveDiscordPreflightAudioMentionContext };

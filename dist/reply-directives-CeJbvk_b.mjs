import { i as isSilentReplyPayloadText } from "./tokens-BTKQYTUd.mjs";
import { o as trySafeFileURLToPath } from "./local-file-access-B6bU8SNO.mjs";
import { n as parseInlineDirectives, s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import { t as findMarkdownImageSpans } from "./image-spans-DUAc_qyr.mjs";
import { n as splitMediaOutput } from "./parse-output-ygpVIskU.mjs";
//#region src/media/parse.ts
/** Splits tool/stdout text into visible text, media attachments, voice tags, and ordered segments. */
function splitMediaFromOutput(raw, options = {}) {
	const extractMarkdownImages = options.markdownImageAllowlist !== void 0 || options.extractMarkdownImages === true;
	return splitMediaOutput(raw, options, extractMarkdownImages ? {
		scan: findMarkdownImageSpans,
		allowlist: options.markdownImageAllowlist
	} : void 0);
}
//#endregion
//#region src/auto-reply/reply/reply-directives.ts
/** Parses inline reply directives such as media, reply targets, audio, and silence. */
/** Parses media, reply-target, audio, and silent directives from reply text. */
function parseReplyDirectives(raw, options = {}) {
	const split = splitMediaFromOutput(raw, {
		extractMarkdownImages: options.extractMarkdownImages,
		extractMediaDirectives: options.extractMediaDirectives,
		preserveTrailingWhitespace: options.preserveTrailingWhitespace,
		onAudioDirective: options.onAudioDirective
	});
	let text = split.text ?? "";
	const replyParsed = text.includes("[[") ? parseInlineDirectives(text, {
		currentMessageId: options.currentMessageId,
		stripAudioTag: false,
		preserveTrailingWhitespace: options.preserveTrailingWhitespace
	}) : void 0;
	text = stripInlineDirectiveTagsForDelivery(replyParsed?.hasReplyTag ? replyParsed.text : text, { preserveTrailingWhitespace: options.preserveTrailingWhitespace }).text;
	const silentToken = options.silentToken ?? "NO_REPLY";
	const isSilent = isSilentReplyPayloadText(text, silentToken);
	return {
		text: isSilent ? "" : text,
		mediaUrls: split.mediaUrls?.map((source) => trySafeFileURLToPath(source) ?? source),
		replyToId: replyParsed?.replyToId,
		replyToCurrent: replyParsed?.replyToCurrent || void 0,
		replyToTag: replyParsed?.hasReplyTag ?? false,
		audioAsVoice: split.audioAsVoice,
		isSilent
	};
}
//#endregion
export { splitMediaFromOutput as n, parseReplyDirectives as t };

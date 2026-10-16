import { a as isSilentReplyPayloadText } from "./tokens-D4ghQG_g.mjs";
import { r as appendReplyMediaFailures } from "./reply-payload-NzglYOOT.mjs";
import { i as parseInlineDirectives, l as stripInlineDirectiveTagsForDelivery } from "./directive-tags-CHfxUaYi.mjs";
import { t as findMarkdownImageSpans } from "./image-spans-BX1wRx19.mjs";
import { n as splitMediaOutput } from "./parse-output-DA26FHkG.mjs";
import { trySafeFileURLToPath } from "@openclaw/fs-safe/advanced";
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
	const mediaFailures = Array.from({ length: split.rejectedMediaCount ?? 0 }, () => ({
		code: "invalid-reference",
		kind: "document",
		label: "Media not attached"
	}));
	return {
		text: appendReplyMediaFailures(isSilent ? "" : text, mediaFailures) ?? "",
		mediaUrls: split.mediaUrls?.map((source) => trySafeFileURLToPath(source) ?? source),
		...mediaFailures.length ? { mediaFailures } : {},
		replyToId: replyParsed?.replyToId,
		replyToCurrent: replyParsed?.replyToCurrent || void 0,
		replyToTag: replyParsed?.hasReplyTag ?? false,
		audioAsVoice: split.audioAsVoice,
		isSilent: isSilent && !mediaFailures.length
	};
}
//#endregion
export { splitMediaFromOutput as n, parseReplyDirectives as t };

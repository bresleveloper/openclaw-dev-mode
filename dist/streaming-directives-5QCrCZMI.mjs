import { a as isSilentReplyPrefixText, c as stripLeadingSilentToken, o as isSilentReplyText, s as startsWithSilentToken } from "./tokens-BTKQYTUd.mjs";
import { n as parseInlineDirectives, s as stripInlineDirectiveTagsForDelivery } from "./directive-tags-D9uZSb5h.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
//#region src/auto-reply/reply/streaming-directives.ts
const splitTrailingDirective = (text, options) => {
	let bufferStart = text.length;
	let trimTextBeforeTail = false;
	const openIndex = text.lastIndexOf("[[");
	if (openIndex >= 0 && !text.includes("]]", openIndex + 2)) {
		if (openIndex < bufferStart) {
			bufferStart = openIndex;
			trimTextBeforeTail = true;
		}
	}
	if (text.endsWith("[") && text.length - 1 < bufferStart) {
		bufferStart = text.length - 1;
		trimTextBeforeTail = true;
	}
	const lastNewline = text.lastIndexOf("\n");
	const lastLine = lastNewline < 0 ? text : text.slice(lastNewline + 1);
	if (/^\s*MEDIA:/i.test(lastLine) || /^[\t ]*(MEDIA|MEDI|MED|ME|M)$/i.test(lastLine)) {
		const mediaLineStart = lastNewline < 0 ? 0 : lastNewline + 1;
		if (mediaLineStart < bufferStart) bufferStart = mediaLineStart;
	}
	if (bufferStart >= text.length) return {
		text,
		tail: ""
	};
	return {
		text: trimTextBeforeTail && !options?.preserveTrailingWhitespace ? text.slice(0, bufferStart).trimEnd() : text.slice(0, bufferStart),
		tail: text.slice(bufferStart)
	};
};
function createStreamingDirectiveAccumulator() {
	let pendingTail = "";
	let pendingSeparator = "";
	let replyToId;
	let replyToCurrent = false;
	let replyToTag = false;
	let hasReturnedText = false;
	const reset = () => {
		pendingTail = "";
		pendingSeparator = "";
		replyToId = void 0;
		replyToCurrent = false;
		replyToTag = false;
		hasReturnedText = false;
	};
	const consume = (raw, options) => {
		const hadPendingTail = pendingTail.length > 0;
		const heldSeparator = pendingSeparator;
		let combined = `${pendingTail}${raw ?? ""}`;
		pendingTail = "";
		pendingSeparator = "";
		if (!options?.final) {
			const split = splitTrailingDirective(combined);
			if (split.tail) {
				const tailStart = combined.length - split.tail.length;
				const separator = combined.slice(split.text.length, tailStart);
				pendingSeparator = split.text ? separator : `${heldSeparator}${separator}`;
			}
			combined = split.text;
			pendingTail = split.tail;
		}
		if (!combined) return null;
		const parsed = combined.includes("[[") ? parseInlineDirectives(combined) : void 0;
		let text = parsed && (parsed.hasReplyTag || parsed.hasAudioTag) ? parsed.text : combined;
		const silentToken = options?.silentToken ?? "NO_REPLY";
		const isSilent = isSilentReplyText(text, silentToken) || isSilentReplyPrefixText(text, silentToken);
		if (isSilent) text = "";
		else if (startsWithSilentToken(text, silentToken)) text = stripLeadingSilentToken(text, silentToken);
		if (hadPendingTail && heldSeparator && text.startsWith("[")) text = heldSeparator + text;
		if (options?.final && !hasReturnedText) text = stripInlineDirectiveTagsForDelivery(text).text;
		replyToId = parsed?.replyToExplicitId ?? replyToId;
		replyToCurrent ||= parsed?.replyToCurrent === true;
		replyToTag ||= parsed?.hasReplyTag === true;
		const combinedResult = {
			text,
			replyToId,
			replyToExplicitId: parsed?.replyToExplicitId,
			replyToCurrent,
			replyToTag,
			audioAsVoice: parsed?.audioAsVoice ?? false,
			isSilent
		};
		if (!hasOutboundReplyContent(combinedResult) && !combinedResult.audioAsVoice) return null;
		hasReturnedText ||= Boolean(combinedResult.text);
		return combinedResult;
	};
	return {
		consume,
		reset
	};
}
//#endregion
export { splitTrailingDirective as n, createStreamingDirectiveAccumulator as t };

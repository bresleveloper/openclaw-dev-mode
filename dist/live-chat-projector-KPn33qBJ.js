import { d as stripInternalRuntimeContext } from "./internal-runtime-context-BH_40W4f.js";
import { c as stripLeadingSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-Zsy11rTo.js";
import { o as resolveAssistantEventPhase } from "./chat-message-content-DjYNz8gU.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-B64FytPi.js";
import { n as isSuppressedControlReplyText, t as isSuppressedControlReplyLeadFragment } from "./control-reply-text-Ckvao2Hg.js";
function capLiveAssistantBuffer(text) {
	if (text.length <= 5e5) return text;
	return text.slice(-5e5);
}
/** Merges assistant full-text and delta events into a capped live buffer. */
function resolveMergedAssistantText(params) {
	const { previousText, nextText, nextDelta } = params;
	if (nextText && previousText) {
		if (nextText.startsWith(previousText) && nextText.length > previousText.length) return capLiveAssistantBuffer(nextText);
		if (previousText.startsWith(nextText) && !nextDelta) return capLiveAssistantBuffer(previousText);
	}
	if (nextDelta) return capLiveAssistantBuffer(previousText + nextDelta);
	if (nextText) return capLiveAssistantBuffer(nextText);
	return capLiveAssistantBuffer(previousText);
}
/** Removes runtime-only context/directive tags from live assistant event text. */
function normalizeLiveAssistantEventText(params) {
	return {
		text: stripInternalRuntimeContext(stripInlineDirectiveTagsForDisplay(params.text).text),
		delta: typeof params.delta === "string" ? stripInternalRuntimeContext(stripInlineDirectiveTagsForDisplay(params.delta).text) : ""
	};
}
/** Projects buffered assistant text into display text or a suppressed/pending state. */
function projectLiveAssistantBufferedText(rawText, options) {
	if (!rawText) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (isSuppressedControlReplyText(rawText)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(rawText)) return {
		text: rawText,
		suppress: true,
		pendingLeadFragment: true
	};
	const text = startsWithSilentToken(rawText, "NO_REPLY") ? stripLeadingSilentToken(rawText, SILENT_REPLY_TOKEN) : rawText;
	if (!text || isSuppressedControlReplyText(text)) return {
		text: "",
		suppress: true,
		pendingLeadFragment: false
	};
	if (options?.suppressLeadFragments !== false && isSuppressedControlReplyLeadFragment(text)) return {
		text,
		suppress: true,
		pendingLeadFragment: true
	};
	return {
		text,
		suppress: false,
		pendingLeadFragment: false
	};
}
/** Returns true when an assistant event phase should not appear in live chat. */
function shouldSuppressAssistantEventForLiveChat(data) {
	return resolveAssistantEventPhase(data) === "commentary";
}
//#endregion
export { shouldSuppressAssistantEventForLiveChat as i, projectLiveAssistantBufferedText as n, resolveMergedAssistantText as r, normalizeLiveAssistantEventText as t };

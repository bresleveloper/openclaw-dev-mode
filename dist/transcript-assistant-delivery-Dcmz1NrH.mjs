import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as readAssistantTextBlocksForPhase } from "./chat-message-content-C-d0FKNG.mjs";
import { t as createTextPartCodeRegionResolver } from "./code-regions-CvUeKYli.mjs";
import { c as trimTextPreservingCode } from "./text-projection-BTFPDH-Z.mjs";
import { c as stripInlineDirectivePartsForDelivery, r as parseInlineDirectiveParts } from "./directive-tags-CHfxUaYi.mjs";
import { n as extractTtsDirectiveParts } from "./directive-facts-HQmjQ9Tk.mjs";
//#region src/config/sessions/transcript-assistant-delivery.ts
/** Record display ownership without rewriting bytes used by runtime transcript identity. */
function recordAssistantManagedMediaUrls(message, urls) {
	const mediaUrls = Array.from(new Set(urls?.map((url) => url.trim()).filter(Boolean) ?? []));
	if (message.role === "assistant" && mediaUrls.length > 0) Object.assign(message, { openclawDelivery: {
		...isRecord(message.openclawDelivery) ? message.openclawDelivery : {},
		mediaUrls
	} });
	return message;
}
function mergeTtsFacts(current, next) {
	return {
		tagged: true,
		...(current?.text ?? next.text) != null ? { text: current?.text ?? next.text } : {},
		...current?.directives || next.directives ? { directives: [...current?.directives ?? [], ...next.directives ?? []] } : {}
	};
}
/** Strips final-answer directives in place so live state and persisted bytes stay identical. */
function applyAssistantDeliveryDirectives(message, options) {
	if (message.role !== "assistant" || !Array.isArray(message.content)) return message;
	const finalBlocks = readAssistantTextBlocksForPhase(message, "final_answer");
	const blocks = finalBlocks.length ? finalBlocks : readAssistantTextBlocksForPhase(message);
	const original = blocks.map((block) => block.text);
	const parsed = parseInlineDirectiveParts(original);
	const stripped = stripInlineDirectivePartsForDelivery(parsed.map((part) => part.text));
	const tts = extractTtsDirectiveParts(stripped.map((part) => part.text));
	const codeRegions = blocks.length > 1 ? createTextPartCodeRegionResolver(tts.map((part) => part.cleanedText)) : void 0;
	let facts;
	for (const [index, block] of blocks.entries()) {
		const reply = expectDefined(parsed[index], "parsed assistant part");
		const speech = expectDefined(tts[index], "prepared assistant speech part");
		const hasDeliveryFacts = reply.hasAudioTag || reply.hasReplyTag || Boolean(speech.facts);
		if (speech.cleanedText === original[index] && !hasDeliveryFacts) continue;
		block.text = speech.facts ? trimTextPreservingCode(speech.cleanedText, "both", codeRegions?.(index)) : speech.cleanedText;
		if (!hasDeliveryFacts) continue;
		facts ??= {};
		Object.assign(facts, {
			...reply.audioAsVoice ? { audioAsVoice: true } : {},
			...reply.replyToCurrent ? { replyToCurrent: true } : {},
			...reply.replyToExplicitId ? { replyToId: reply.replyToExplicitId } : {},
			...speech.facts ? { tts: mergeTtsFacts(facts.tts, speech.facts) } : {}
		});
	}
	if (facts) {
		const mergedFacts = {
			...isRecord(message.openclawDelivery) ? message.openclawDelivery : void 0,
			...facts
		};
		if (facts.replyToId) delete mergedFacts.replyToCurrent;
		else if (facts.replyToCurrent) delete mergedFacts.replyToId;
		Object.assign(message, { openclawDelivery: mergedFacts });
	}
	return recordAssistantManagedMediaUrls(message, options?.managedMediaUrls);
}
//#endregion
export { recordAssistantManagedMediaUrls as n, applyAssistantDeliveryDirectives as t };

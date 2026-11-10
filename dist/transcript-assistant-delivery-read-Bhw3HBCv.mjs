import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
//#region src/config/sessions/transcript-assistant-delivery-read.ts
/** Decode only persisted delivery facts; transcript records cannot supply runtime authority. */
function readAssistantDeliveryFacts(value) {
	if (!isRecord(value)) return;
	const facts = {};
	if (value.audioAsVoice === true) facts.audioAsVoice = true;
	if (typeof value.replyToId === "string" && value.replyToId.trim()) facts.replyToId = value.replyToId;
	else if (value.replyToCurrent === true) facts.replyToCurrent = true;
	if (Array.isArray(value.mediaUrls)) {
		const mediaUrls = value.mediaUrls.filter((url) => typeof url === "string" && url.trim().length > 0);
		if (mediaUrls.length) facts.mediaUrls = mediaUrls;
	}
	if (isRecord(value.tts) && value.tts.tagged === true) {
		const tts = { tagged: true };
		if (typeof value.tts.text === "string") tts.text = value.tts.text;
		if (Array.isArray(value.tts.directives)) tts.directives = value.tts.directives.flatMap((directive) => {
			if (!isRecord(directive) || !isRecord(directive.values)) return [];
			const entries = Object.entries(directive.values);
			if (!entries.every((entry) => typeof entry[1] === "string")) return [];
			const values = Object.fromEntries(entries);
			return [{
				...typeof directive.provider === "string" ? { provider: directive.provider } : {},
				values
			}];
		});
		facts.tts = tts;
	}
	return Object.keys(facts).length ? facts : void 0;
}
/** Mirror identity retains media references independently of filename-only display text. */
function projectAssistantTranscriptMirrorIdentity(message) {
	if (!isRecord(message) || message.role !== "assistant" || !Array.isArray(message.content)) return;
	const text = message.content.flatMap((part) => isRecord(part) && part.type === "text" && typeof part.text === "string" && part.text.trim() ? [part.text.trim()] : []).join("\n");
	return text ? {
		text,
		mediaUrls: readAssistantDeliveryFacts(message.openclawDelivery)?.mediaUrls ?? []
	} : void 0;
}
/** SQLite and retained JSONL readers expose the same authored text and delivery facts. */
function projectAssistantTranscriptText(message, id) {
	if (!isRecord(message) || message.role !== "assistant") return;
	const text = extractAssistantPhaseText(message);
	if (!text?.trim()) return;
	const openclawDelivery = readAssistantDeliveryFacts(message.openclawDelivery);
	return {
		...typeof id === "string" && id ? { id } : {},
		text,
		...typeof message.timestamp === "number" && Number.isFinite(message.timestamp) ? { timestamp: message.timestamp } : {},
		...openclawDelivery ? { openclawDelivery } : {}
	};
}
//#endregion
export { projectAssistantTranscriptText as n, projectAssistantTranscriptMirrorIdentity as t };

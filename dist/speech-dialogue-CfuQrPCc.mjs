import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { i as GOOGLE_TTS_SAMPLE_RATE } from "./speech-models-C0BKgLl9.mjs";
//#region extensions/google/speech-dialogue.ts
function readGoogleTtsSpeakers(value) {
	if (value == null) return;
	if (!Array.isArray(value)) throw new Error("Google TTS speakers must be an array of exactly two { speaker, voice } entries.");
	const speakers = value.map((entry, index) => {
		const record = asOptionalRecord(entry);
		const speaker = normalizeOptionalString(record?.speaker ?? record?.name);
		const voice = normalizeOptionalString(record?.voice ?? record?.voiceName);
		const style = normalizeOptionalString(record?.style);
		if (!speaker || !voice) throw new Error(`Google TTS speakers[${index}] needs a speaker name and a voice.`);
		return {
			speaker,
			voice,
			...style ? { style } : {}
		};
	});
	if (speakers.length !== 2) throw new Error("Google TTS multi-speaker requires exactly two speakers.");
	if (new Set(speakers.map((speaker) => speaker.speaker)).size !== 2) throw new Error("Google TTS speakers must use two different speaker names.");
	return speakers;
}
function splitGoogleTtsDialogue(text, speakers) {
	const names = new Set(speakers.map((speaker) => speaker.speaker));
	const turns = [];
	const lead = [];
	for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const labeled = /^([^:\n]{1,80}):([\s\S]*)$/u.exec(trimmed);
		const speaker = labeled?.[1]?.trim();
		if (labeled && speaker && names.has(speaker)) {
			const spoken = labeled[2]?.trim();
			if (!spoken) continue;
			if (turns.length === 0 && lead.length > 0) turns.push({
				speaker,
				text: lead.splice(0).join(" ")
			});
			const previous = turns.at(-1);
			if (previous?.speaker === speaker) previous.text = `${previous.text} ${spoken}`;
			else turns.push({
				speaker,
				text: spoken
			});
			continue;
		}
		const previous = turns.at(-1);
		if (previous) previous.text = `${previous.text} ${trimmed}`;
		else lead.push(trimmed);
	}
	if (turns.length === 0) return;
	return turns;
}
function composeGoogleInteractionsSpeechStyle(parts) {
	return parts.map((part) => normalizeOptionalString(part)).filter((part) => part !== void 0).join("\n\n") || void 0;
}
function buildGoogleInteractionsTtsBody(params) {
	const dialogue = params.speakers ? splitGoogleTtsDialogue(params.text, params.speakers) : void 0;
	let content;
	if (dialogue) content = dialogue.map((turn) => {
		const cast = params.speakers?.find((speaker) => speaker.speaker === turn.speaker);
		const style = composeGoogleInteractionsSpeechStyle([
			cast?.style,
			params.audioProfile,
			params.personaPrompt
		]);
		return {
			type: "text",
			text: turn.text,
			annotations: [{
				type: "speech_metadata",
				speaker: turn.speaker,
				...style ? { style } : {}
			}]
		};
	});
	else {
		const style = composeGoogleInteractionsSpeechStyle([params.audioProfile, params.personaPrompt]);
		const speaker = normalizeOptionalString(params.speakerName);
		const textBlock = {
			type: "text",
			text: params.text
		};
		if (style || speaker) textBlock.annotations = [{
			type: "speech_metadata",
			...speaker ? { speaker } : {},
			...style ? { style } : {}
		}];
		content = [textBlock];
	}
	return {
		model: params.model,
		store: false,
		input: [{
			type: "user_input",
			content
		}],
		response_format: {
			type: "audio",
			mime_type: "audio/l16",
			sample_rate: GOOGLE_TTS_SAMPLE_RATE
		},
		generation_config: dialogue ? { speech_config: {
			mode: "conversational",
			speakers: params.speakers?.map((speaker) => ({
				speaker: speaker.speaker,
				voice: speaker.voice
			}))
		} } : { speech_config: [{ voice: params.voiceName }] }
	};
}
//#endregion
export { readGoogleTtsSpeakers as n, splitGoogleTtsDialogue as r, buildGoogleInteractionsTtsBody as t };

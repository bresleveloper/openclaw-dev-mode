import { I as resolveGoogleGemini3ThinkingLevel } from "./provider-stream-shared-D8q3R1a-.mjs";
import "./thinking-api-bCJfNS_G.mjs";
import { ThinkingLevel } from "@google/genai";
//#region extensions/google/realtime-voice-model-contract.ts
function normalizeGoogleLiveModelId(model) {
	return model.startsWith("models/") ? model.slice(7) : model;
}
function isGemini31LiveModel(model) {
	const modelId = normalizeGoogleLiveModelId(model);
	return modelId.startsWith("gemini-3.1-") && modelId.includes("-live");
}
function isGemini38LiveModel(model) {
	return normalizeGoogleLiveModelId(model).startsWith("gemini-3.8-live");
}
function isGemini38LiveExtendedThinkingModel(model) {
	const modelId = normalizeGoogleLiveModelId(model);
	return modelId.startsWith("gemini-3.8-live") && modelId.includes("extended-thinking");
}
function isResponseDone(model, interactionStatus, interrupted) {
	return interrupted || !isGemini38LiveExtendedThinkingModel(model) || interactionStatus === "IDLE";
}
function emitsCompleteInputTranscripts(model) {
	return isGemini31LiveModel(model) || isGemini38LiveModel(model);
}
function endsTurnOnAudioStreamEnd(model) {
	return !isGemini38LiveModel(model);
}
function supportsAsyncFunctionCalling(model) {
	return !isGemini31LiveModel(model);
}
function modelSupportsToolResultContinuation(model) {
	return supportsAsyncFunctionCalling(model) && !isGemini38LiveExtendedThinkingModel(model);
}
function supportsClientContentInterrupt(model) {
	return isGemini38LiveExtendedThinkingModel(model);
}
/**
* A completed client turn interrupts the current Extended Thinking generation: the server
* answers with `interrupted` (cleared audio) and `turnComplete` (response done). Silence
* after that is best effort, not a guarantee: an empty turn makes the model resume its task
* a few seconds later, and this bracketed instruction usually leaves it silent and idle
* (measured live at thinking level high) but live runs still saw it speak again after the
* cancelled completion. Callers must tolerate further output.
*/
function buildGoogleLiveInterruptTurn() {
	return {
		turns: [{
			role: "user",
			parts: [{ text: "[You were interrupted. Stop speaking and wait silently.]" }]
		}],
		turnComplete: true
	};
}
function resolveGemini38LiveExtendedThinkingLevel(config) {
	switch (config.thinkingLevel) {
		case "minimal":
		case "low": return ThinkingLevel.LOW;
		case "medium": return ThinkingLevel.MEDIUM;
		case "high": return ThinkingLevel.HIGH;
	}
	if (typeof config.thinkingBudget !== "number" || config.thinkingBudget < 0) return;
	if (config.thinkingBudget <= 2048) return ThinkingLevel.LOW;
	if (config.thinkingBudget <= 8192) return ThinkingLevel.MEDIUM;
	return ThinkingLevel.HIGH;
}
function buildThinkingConfig(config, model) {
	if (isGemini31LiveModel(model)) {
		const thinkingLevel = resolveGoogleGemini3ThinkingLevel({
			modelId: model,
			thinkingLevel: config.thinkingLevel,
			thinkingBudget: config.thinkingBudget
		});
		return thinkingLevel ? { thinkingLevel: ThinkingLevel[thinkingLevel] } : void 0;
	}
	if (isGemini38LiveModel(model)) {
		if (!isGemini38LiveExtendedThinkingModel(model)) return;
		const thinkingLevel = resolveGemini38LiveExtendedThinkingLevel(config);
		return thinkingLevel ? { thinkingLevel } : void 0;
	}
	if (typeof config.thinkingBudget === "number") return { thinkingBudget: config.thinkingBudget };
}
//#endregion
export { isGemini31LiveModel as a, supportsAsyncFunctionCalling as c, endsTurnOnAudioStreamEnd as i, supportsClientContentInterrupt as l, buildThinkingConfig as n, isResponseDone as o, emitsCompleteInputTranscripts as r, modelSupportsToolResultContinuation as s, buildGoogleLiveInterruptTurn as t };

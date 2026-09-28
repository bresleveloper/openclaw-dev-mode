//#region extensions/openai/realtime-quicksilver.ts
const OPENAI_GPT_LIVE_MODEL_PREFIX = "gpt-live";
const OPENAI_GPT_LIVE_MODELS = ["gpt-live-1", "gpt-live-1-codex"];
const OPENAI_GPT_LIVE_API_VOICES = [
	"alloy",
	"ash",
	"ballad",
	"beacon",
	"bossa",
	"cedar",
	"cinder",
	"coral",
	"delta",
	"echo",
	"gleam",
	"marin",
	"meridian",
	"quartz",
	"ripple",
	"sage",
	"shimmer",
	"stone",
	"tempo",
	"verse",
	"vesper",
	"willow"
];
const OPENAI_GPT_LIVE_VOICES = [
	"arbor",
	"breeze",
	"cove",
	"ember",
	"juniper",
	"maple",
	"sol",
	"spruce",
	"vale"
];
const OPENAI_GPT_LIVE_UNLISTED_VOICES = ["marin", "cedar"];
function isOpenAIGptLiveApiModel(model) {
	return model?.trim().toLowerCase() === "gpt-live-1";
}
function isOpenAIGptLiveSubscriptionModel(model) {
	return model?.trim().toLowerCase() === "gpt-live-1-codex";
}
function isSupportedOpenAIGptLiveModel(model) {
	return isOpenAIGptLiveApiModel(model) || isOpenAIGptLiveSubscriptionModel(model);
}
function resolveOpenAIQuicksilverVoice(model, value) {
	const voices = resolveOpenAIQuicksilverVoices(model);
	const defaultVoice = isOpenAIGptLiveSubscriptionModel(model) ? "cove" : "marin";
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		return voices.find((voice) => voice === normalized) ?? defaultVoice;
	}
	return defaultVoice;
}
function resolveOpenAIQuicksilverVoices(model) {
	if (isOpenAIGptLiveApiModel(model)) return OPENAI_GPT_LIVE_API_VOICES;
	return isOpenAIGptLiveSubscriptionModel(model) ? OPENAI_GPT_LIVE_VOICES : OPENAI_GPT_LIVE_UNLISTED_VOICES;
}
function isOpenAIGptLiveModel(model) {
	if (!model) return false;
	const normalized = model.trim().toLowerCase();
	return normalized === OPENAI_GPT_LIVE_MODEL_PREFIX || normalized.startsWith(`${OPENAI_GPT_LIVE_MODEL_PREFIX}-`);
}
const OPENAI_QUICKSILVER_CAPABILITIES = {
	transports: ["webrtc", "gateway-relay"],
	handlesAgentConsult: true,
	supportsBargeIn: false,
	handlesInputAudioBargeIn: true,
	supportsActivationNameGating: false,
	supportsToolCalls: false,
	supportsVideoFrames: false
};
function resolveOpenAIQuicksilverVoiceCapabilities(model) {
	return {
		voices: resolveOpenAIQuicksilverVoices(model),
		voiceSelectionPolicy: "allowlist-default"
	};
}
//#endregion
export { isOpenAIGptLiveSubscriptionModel as a, resolveOpenAIQuicksilverVoiceCapabilities as c, isOpenAIGptLiveModel as i, OPENAI_QUICKSILVER_CAPABILITIES as n, isSupportedOpenAIGptLiveModel as o, isOpenAIGptLiveApiModel as r, resolveOpenAIQuicksilverVoice as s, OPENAI_GPT_LIVE_MODELS as t };

import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { n as applyAgentDefaultModelPrimary, v as ensureModelAllowlistEntry } from "./provider-onboard-Be0xLg2V.mjs";
//#region extensions/openai/default-models.ts
const OPENAI_DEFAULT_MODEL = "openai/gpt-6-astra";
const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-6-astra";
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const OPENAI_DEFAULT_TTS_MODEL = "gpt-4o-mini-tts";
const OPENAI_DEFAULT_TTS_VOICE = "alloy";
const OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL = "gpt-4o-transcribe";
const OPENAI_DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
function applyOpenAIProviderConfig(cfg) {
	const configuredModel = cfg.agents?.defaults?.model;
	const withConfiguredRefs = [resolveAgentModelPrimaryValue(configuredModel), ...typeof configuredModel === "object" ? configuredModel.fallbacks ?? [] : []].filter((ref) => typeof ref === "string" && ref.trim().length > 0).reduce((next, modelRef) => ensureModelAllowlistEntry({
		cfg: next,
		modelRef
	}), cfg);
	const models = { ...withConfiguredRefs.agents?.defaults?.models };
	const gptAliasClaimed = Object.entries(models).some(([modelRef, model]) => modelRef !== "openai/gpt-6-astra" && model?.alias?.trim().toLowerCase() === "gpt");
	models[OPENAI_DEFAULT_MODEL] = {
		...models[OPENAI_DEFAULT_MODEL],
		...models["openai/gpt-6-astra"]?.alias === void 0 && !gptAliasClaimed ? { alias: "GPT" } : {}
	};
	return {
		...withConfiguredRefs,
		agents: {
			...withConfiguredRefs.agents,
			defaults: {
				...withConfiguredRefs.agents?.defaults,
				models
			}
		}
	};
}
function applyOpenAIConfig(cfg) {
	const next = applyOpenAIProviderConfig(cfg);
	return resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model) === void 0 ? applyAgentDefaultModelPrimary(next, OPENAI_DEFAULT_MODEL) : next;
}
//#endregion
export { OPENAI_DEFAULT_MODEL as a, applyOpenAIConfig as c, OPENAI_DEFAULT_IMAGE_MODEL as i, applyOpenAIProviderConfig as l, OPENAI_DEFAULT_AUDIO_TRANSCRIPTION_MODEL as n, OPENAI_DEFAULT_TTS_MODEL as o, OPENAI_DEFAULT_EMBEDDING_MODEL as r, OPENAI_DEFAULT_TTS_VOICE as s, OPENAI_CODEX_DEFAULT_MODEL as t };

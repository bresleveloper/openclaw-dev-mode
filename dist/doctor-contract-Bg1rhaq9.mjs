import { n as hasLegacyTalkFields, r as migrateElevenLabsLegacyTalkConfig } from "./config-compat-CXt80ClX.mjs";
//#region extensions/elevenlabs/doctor-contract.ts
const legacyConfigRules = [{
	path: ["talk"],
	message: "talk.voiceId/talk.voiceAliases/talk.modelId/talk.outputFormat/talk.apiKey are legacy; use talk.providers.<provider> and run openclaw doctor --fix.",
	match: hasLegacyTalkFields
}];
const ELEVENLABS_TALK_LEGACY_CONFIG_RULES = legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
	return migrateElevenLabsLegacyTalkConfig(cfg);
}
//#endregion
export { legacyConfigRules as n, normalizeCompatibilityConfig as r, ELEVENLABS_TALK_LEGACY_CONFIG_RULES as t };

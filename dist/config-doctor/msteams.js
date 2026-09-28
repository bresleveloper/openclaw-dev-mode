import { s as defineChannelAliasMigration } from "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/msteams/config-doctor-api.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "msteams",
	streaming: { defaultMode: "partial" }
});
const legacyConfigRules = streamingAliasMigration.legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
	return streamingAliasMigration.normalizeChannelConfig({ cfg });
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };

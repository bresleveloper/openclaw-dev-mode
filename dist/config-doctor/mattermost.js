import { a as defineChannelAliasMigration } from "./runtime-doctor-migrations-BhouWAUC.js";
//#region extensions/mattermost/src/doctor-contract.ts
const { legacyConfigRules, normalizeChannelConfig: normalizeCompatibilityConfig } = defineChannelAliasMigration({
	channelId: "mattermost",
	streaming: { defaultMode: "partial" },
	accountStreamingReplacesRoot: true
});
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };

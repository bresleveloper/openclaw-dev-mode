import { i as createLegacyPrivateNetworkDoctorContract, s as defineChannelAliasMigration } from "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/mattermost/src/doctor-contract.ts
const networkContract = createLegacyPrivateNetworkDoctorContract({ channelKey: "mattermost" });
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "mattermost",
	streaming: { defaultMode: "partial" },
	accountStreamingReplacesRoot: true
});
const legacyConfigRules = [...networkContract.legacyConfigRules, ...streamingAliasMigration.legacyConfigRules];
function normalizeCompatibilityConfig({ cfg }) {
	const network = networkContract.normalizeCompatibilityConfig({ cfg });
	return streamingAliasMigration.normalizeChannelConfig({
		cfg: network.config,
		changes: network.changes
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };

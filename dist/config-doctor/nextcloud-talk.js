import { i as createLegacyPrivateNetworkDoctorContract, s as defineChannelAliasMigration } from "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/nextcloud-talk/src/doctor-contract.ts
const networkContract = createLegacyPrivateNetworkDoctorContract({ channelKey: "nextcloud-talk" });
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "nextcloud-talk",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
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

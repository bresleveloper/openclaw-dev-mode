import { S as normalizeChannelConfigEntries, b as hasLegacyAccountStreamingAliases, n as defineKeyMoveMigration } from "./runtime-doctor-migrations-BhouWAUC.js";
//#region extensions/zalouser/src/doctor-contract.ts
const groupAllowMigration = defineKeyMoveMigration({
	scope: ["groups", "*"],
	from: ["allow"],
	to: ["enabled"],
	sourceOwn: false,
	match: (value) => typeof value === "boolean",
	targetIsSet: (value) => typeof value === "boolean",
	movedMessage: ({ sourcePath, targetPath, mappedValue }) => `Moved ${sourcePath} → ${targetPath} (${String(mappedValue)}).`,
	existingMessage: ({ sourcePath, targetPath, targetValue }) => `Moved ${sourcePath} → ${targetPath} (${String(targetValue)}).`
});
const legacyConfigRules = [{
	path: [
		"channels",
		"zalouser",
		"groups"
	],
	message: "channels.zalouser.groups.<id>.allow is legacy; use channels.zalouser.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
	match: (value) => groupAllowMigration.hasLegacy({ groups: value })
}, {
	path: [
		"channels",
		"zalouser",
		"accounts"
	],
	message: "channels.zalouser.accounts.<id>.groups.<id>.allow is legacy; use channels.zalouser.accounts.<id>.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
	match: (value) => hasLegacyAccountStreamingAliases(value, groupAllowMigration.hasLegacy)
}];
function normalizeCompatibilityConfig(params) {
	return normalizeChannelConfigEntries({
		cfg: params.cfg,
		channelId: "zalouser",
		normalizeEntry: groupAllowMigration.normalize
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };

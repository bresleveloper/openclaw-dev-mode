import { asObjectRecord, defineChannelAliasMigration, defineKeyMoveMigration, hasLegacyAccountStreamingAliases, normalizeChannelConfigEntries } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/googlechat/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "googlechat",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingInheritsDefaultAccount: true,
	dm: {
		root: true,
		accounts: true
	}
});
function hasLegacyGoogleChatStreamMode(value) {
	return asObjectRecord(value)?.streamMode !== void 0;
}
function hasRetiredReactions(value) {
	return Object.hasOwn(asObjectRecord(asObjectRecord(value)?.actions) ?? {}, "reactions");
}
const groupAllowMigration = defineKeyMoveMigration({
	scope: ["groups", "*"],
	from: ["allow"],
	to: ["enabled"]
});
function normalizeGoogleChatEntry(params) {
	let updated = params.entry;
	let changed = false;
	if (updated.streamMode !== void 0) {
		updated = { ...updated };
		delete updated.streamMode;
		params.changes.push(`Removed ${params.pathPrefix}.streamMode (legacy key no longer used).`);
		changed = true;
	}
	if (hasRetiredReactions(updated)) {
		const actions = { ...asObjectRecord(updated.actions) };
		delete actions.reactions;
		updated = { ...updated };
		if (Object.keys(actions).length > 0) updated.actions = actions;
		else delete updated.actions;
		params.changes.push(`Removed ${params.pathPrefix}.actions.reactions (Google Chat does not support reactions).`);
		changed = true;
	}
	const groups = groupAllowMigration.normalize({
		...params,
		entry: updated
	});
	updated = groups.entry;
	changed = changed || groups.changed;
	return {
		entry: updated,
		changed
	};
}
const legacyConfigRules = [
	{
		path: ["channels", "googlechat"],
		message: "channels.googlechat.actions.reactions is retired and ignored. Run \"openclaw doctor --fix\".",
		match: hasRetiredReactions
	},
	{
		path: [
			"channels",
			"googlechat",
			"accounts"
		],
		message: "channels.googlechat.accounts.<id>.actions.reactions is retired and ignored. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredReactions)
	},
	{
		path: ["channels", "googlechat"],
		message: "channels.googlechat.streamMode is legacy and no longer used; it is removed on load.",
		match: hasLegacyGoogleChatStreamMode
	},
	{
		path: [
			"channels",
			"googlechat",
			"accounts"
		],
		message: "channels.googlechat.accounts.<id>.streamMode is legacy and no longer used; it is removed on load.",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasLegacyGoogleChatStreamMode)
	},
	{
		path: ["channels", "googlechat"],
		message: "channels.googlechat.groups.<id>.allow is legacy; use channels.googlechat.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
		match: groupAllowMigration.hasLegacy
	},
	{
		path: [
			"channels",
			"googlechat",
			"accounts"
		],
		message: "channels.googlechat.accounts.<id>.groups.<id>.allow is legacy; use channels.googlechat.accounts.<id>.groups.<id>.enabled instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, groupAllowMigration.hasLegacy)
	},
	...streamingAliasMigration.legacyConfigRules
];
function normalizeRetiredGoogleChatKeys(cfg) {
	return normalizeChannelConfigEntries({
		cfg,
		channelId: "googlechat",
		normalizeEntry: normalizeGoogleChatEntry
	});
}
function normalizeCompatibilityConfig({ cfg }) {
	const retired = normalizeRetiredGoogleChatKeys(cfg);
	return streamingAliasMigration.normalizeChannelConfig({
		cfg: retired.config,
		changes: retired.changes
	});
}
//#endregion
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };

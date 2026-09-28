import { asObjectRecord, defineChannelAliasMigration, stripRetiredChannelKeys } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/irc/config-doctor-api.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "irc",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingReplacesRoot: true
});
const RETIRED_IRC_KEYS = /* @__PURE__ */ new Set(["mentionPatterns"]);
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: ["channels", "irc"],
		match: (value) => Object.hasOwn(asObjectRecord(value) ?? {}, "mentionPatterns"),
		message: "channels.irc.mentionPatterns was accepted but never read; configure mention patterns with messages.groupChat.mentionPatterns. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"irc",
			"accounts"
		],
		match: (value) => Object.values(asObjectRecord(value) ?? {}).some((account) => Object.hasOwn(asObjectRecord(account) ?? {}, "mentionPatterns")),
		message: "channels.irc.accounts.<id>.mentionPatterns was accepted but never read; configure mention patterns with messages.groupChat.mentionPatterns. Run \"openclaw doctor --fix\"."
	}
];
function normalizeCompatibilityConfig({ cfg }) {
	const aliases = streamingAliasMigration.normalizeChannelConfig({ cfg });
	const changes = [...aliases.changes];
	return {
		config: stripRetiredChannelKeys({
			cfg: aliases.config,
			channelId: "irc",
			keys: RETIRED_IRC_KEYS,
			scope: "root-and-accounts",
			onRemove: (removed) => {
				changes.push(`Removed ${removed.pathPrefix}.${removed.key}; it was never read.`);
			}
		}).config,
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };

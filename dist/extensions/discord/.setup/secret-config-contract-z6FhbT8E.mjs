import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { collectNestedChannelFieldAssignments, collectSimpleChannelFieldAssignments, createChannelSecretTargetRegistryEntries, getChannelSurface, hasConfiguredSecretInputValue, isBaseFieldActiveForChannelSurface, isEnabledFlag, isRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { collectNestedChannelTtsAssignments } from "openclaw/plugin-sdk/channel-secret-tts-runtime";
//#region extensions/discord/src/secret-config-contract.ts
function discordRealtimeVoiceSecretOwnerId(accountId, providerId) {
	return `discord:voice:realtime:${normalizeAccountId(accountId)}:${providerId}`;
}
function isRealtimeVoiceActive(value) {
	return isRecord(value) && isEnabledFlag(value) && value.mode !== "stt-tts";
}
const secretPaths = [
	"pluralkit.token",
	"token",
	"voice.realtime.providers.*.apiKey",
	"voice.tts.providers.*.apiKey",
	"voice.tts.personas.*.providers.*.apiKey"
];
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "discord",
	account: secretPaths,
	channel: secretPaths
}).map((entry) => {
	if (entry.pathPattern.endsWith(".providers.*.apiKey")) entry.providerIdPathSegmentIndex = entry.pathPattern.split(".").length - 2;
	return entry;
});
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "discord");
	if (!resolved) return;
	const { channel: discord, surface } = resolved;
	if (surface.hasExplicitAccounts && !surface.accounts.some(({ accountId }) => normalizeAccountId(accountId) === "default") && [discord.token, params.context.env.DISCORD_BOT_TOKEN].some((value) => hasConfiguredSecretInputValue(value, params.defaults))) surface.accounts.push({
		accountId: "default",
		account: {},
		enabled: surface.channelEnabled
	});
	const assignmentContext = {
		channelKey: "discord",
		channel: discord,
		surface,
		defaults: params.defaults,
		context: params.context
	};
	collectSimpleChannelFieldAssignments({
		...assignmentContext,
		field: "token",
		topInactiveReason: "no enabled account inherits this top-level Discord token.",
		accountInactiveReason: "Discord account is disabled."
	});
	collectNestedChannelFieldAssignments({
		...assignmentContext,
		nestedKey: "pluralkit",
		field: "token",
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "pluralkit") && isRecord(discord.pluralkit) && isEnabledFlag(discord.pluralkit),
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !Object.hasOwn(account, "pluralkit") && isEnabledFlag(discord.pluralkit),
		topInactiveReason: "no enabled Discord surface inherits this top-level PluralKit config or PluralKit is disabled.",
		accountActive: ({ account, enabled }) => enabled && isRecord(account.pluralkit) && isEnabledFlag(account.pluralkit),
		accountInactiveReason: "Discord account is disabled or PluralKit is disabled for this account."
	});
	collectNestedChannelTtsAssignments({
		...assignmentContext,
		nestedKey: "voice",
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "voice") && isRecord(discord.voice) && isEnabledFlag(discord.voice),
		topInactiveReason: "no enabled Discord surface inherits this top-level voice config or voice is disabled.",
		accountActive: ({ account, enabled }) => enabled && isRecord(account.voice) && isEnabledFlag(account.voice),
		accountInactiveReason: "Discord account is disabled or voice is disabled for this account."
	});
	collectNestedChannelTtsAssignments({
		...assignmentContext,
		nestedKey: "voice",
		providerBlockKey: "realtime",
		ownerId: ({ accountId, providerId }) => discordRealtimeVoiceSecretOwnerId(accountId, providerId),
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "voice") && isRealtimeVoiceActive(discord.voice),
		topInactiveReason: "no enabled Discord surface uses this top-level realtime voice config, voice is disabled, or voice mode is stt-tts.",
		accountActive: ({ account, enabled }) => enabled && isRealtimeVoiceActive(account.voice),
		accountInactiveReason: "Discord account is disabled, voice is disabled, or voice mode is stt-tts for this account."
	});
}
//#endregion
export { discordRealtimeVoiceSecretOwnerId as n, secretTargetRegistryEntries as r, collectRuntimeConfigAssignments as t };

import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { collectNestedChannelFieldAssignments, collectSimpleChannelFieldAssignments, getChannelSurface, hasConfiguredSecretInputValue, isBaseFieldActiveForChannelSurface, isEnabledFlag, isRecord } from "openclaw/plugin-sdk/channel-secret-basic-runtime";
import { collectNestedChannelTtsAssignments } from "openclaw/plugin-sdk/channel-secret-tts-runtime";
//#region extensions/discord/src/secret-config-contract.ts
function createVoiceProviderSecretTarget(params) {
	const path = `${params.scope === "account" ? "channels.discord.accounts.*" : "channels.discord"}.voice.${params.providerPath}.providers.*.apiKey`;
	return {
		id: path,
		targetType: path,
		configFile: "openclaw.json",
		pathPattern: path,
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true,
		providerIdPathSegmentIndex: path.split(".").length - 2
	};
}
function discordRealtimeVoiceSecretOwnerId(accountId, providerId) {
	return `discord:voice:realtime:${normalizeAccountId(accountId)}:${providerId}`;
}
function isRealtimeVoiceActive(value) {
	return isRecord(value) && isEnabledFlag(value) && value.mode !== "stt-tts";
}
const secretTargetRegistryEntries = [
	{
		id: "channels.discord.accounts.*.pluralkit.token",
		targetType: "channels.discord.accounts.*.pluralkit.token",
		configFile: "openclaw.json",
		pathPattern: "channels.discord.accounts.*.pluralkit.token",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.discord.accounts.*.token",
		targetType: "channels.discord.accounts.*.token",
		configFile: "openclaw.json",
		pathPattern: "channels.discord.accounts.*.token",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	createVoiceProviderSecretTarget({
		providerPath: "realtime",
		scope: "account"
	}),
	createVoiceProviderSecretTarget({
		providerPath: "tts",
		scope: "account"
	}),
	createVoiceProviderSecretTarget({
		providerPath: "tts.personas.*",
		scope: "account"
	}),
	{
		id: "channels.discord.pluralkit.token",
		targetType: "channels.discord.pluralkit.token",
		configFile: "openclaw.json",
		pathPattern: "channels.discord.pluralkit.token",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	{
		id: "channels.discord.token",
		targetType: "channels.discord.token",
		configFile: "openclaw.json",
		pathPattern: "channels.discord.token",
		secretShape: "secret_input",
		expectedResolvedValue: "string",
		includeInPlan: true,
		includeInConfigure: true,
		includeInAudit: true
	},
	createVoiceProviderSecretTarget({
		providerPath: "realtime",
		scope: "channel"
	}),
	createVoiceProviderSecretTarget({
		providerPath: "tts",
		scope: "channel"
	}),
	createVoiceProviderSecretTarget({
		providerPath: "tts.personas.*",
		scope: "channel"
	})
];
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "discord");
	if (!resolved) return;
	const { channel: discord, surface } = resolved;
	if (surface.hasExplicitAccounts && !surface.accounts.some(({ accountId }) => accountId === "default") && [discord.token, params.context.env.DISCORD_BOT_TOKEN].some((value) => hasConfiguredSecretInputValue(value, params.defaults))) surface.accounts.push({
		accountId: "default",
		account: {},
		enabled: surface.channelEnabled
	});
	collectSimpleChannelFieldAssignments({
		channelKey: "discord",
		field: "token",
		channel: discord,
		surface,
		defaults: params.defaults,
		context: params.context,
		topInactiveReason: "no enabled account inherits this top-level Discord token.",
		accountInactiveReason: "Discord account is disabled."
	});
	collectNestedChannelFieldAssignments({
		channelKey: "discord",
		nestedKey: "pluralkit",
		field: "token",
		channel: discord,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "pluralkit") && isRecord(discord.pluralkit) && isEnabledFlag(discord.pluralkit),
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !Object.hasOwn(account, "pluralkit") && isEnabledFlag(discord.pluralkit),
		topInactiveReason: "no enabled Discord surface inherits this top-level PluralKit config or PluralKit is disabled.",
		accountActive: ({ account, enabled }) => enabled && isRecord(account.pluralkit) && isEnabledFlag(account.pluralkit),
		accountInactiveReason: "Discord account is disabled or PluralKit is disabled for this account."
	});
	collectNestedChannelTtsAssignments({
		channelKey: "discord",
		nestedKey: "voice",
		channel: discord,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "voice") && isRecord(discord.voice) && isEnabledFlag(discord.voice),
		topInactiveReason: "no enabled Discord surface inherits this top-level voice config or voice is disabled.",
		accountActive: ({ account, enabled }) => enabled && isRecord(account.voice) && isEnabledFlag(account.voice),
		accountInactiveReason: "Discord account is disabled or voice is disabled for this account."
	});
	collectNestedChannelTtsAssignments({
		channelKey: "discord",
		nestedKey: "voice",
		providerBlockKey: "realtime",
		ownerId: ({ accountId, providerId }) => discordRealtimeVoiceSecretOwnerId(accountId, providerId),
		channel: discord,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActive: isBaseFieldActiveForChannelSurface(surface, "voice") && isRealtimeVoiceActive(discord.voice),
		topInactiveReason: "no enabled Discord surface uses this top-level realtime voice config, voice is disabled, or voice mode is stt-tts.",
		accountActive: ({ account, enabled }) => enabled && isRealtimeVoiceActive(account.voice),
		accountInactiveReason: "Discord account is disabled, voice is disabled, or voice mode is stt-tts for this account."
	});
}
//#endregion
export { discordRealtimeVoiceSecretOwnerId as n, secretTargetRegistryEntries as r, collectRuntimeConfigAssignments as t };

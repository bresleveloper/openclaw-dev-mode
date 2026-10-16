import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, qn as strictObject, sr as unknown } from "../schemas-BOYIvvln.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore, n as createLazyFacadeObjectValue } from "../facade-loader-B-X-HqBc.mjs";
import { A as requireOpenAllowFrom, M as DmConfigSchema, a as ContextVisibilityModeSchema, c as GroupPolicySchema, h as ReplyRuntimeConfigSchemaShape, k as requireAllowlistAllowFrom, n as BlockStreamingCoalesceSchema, o as DmPolicySchema, p as MarkdownConfigSchema, r as ChannelDeliveryStreamingConfigSchema } from "../zod-schema.core-MaNAY9dn.mjs";
import { i as SecretRefSchema, n as sensitive } from "../zod-schema.sensitive-bEFwMmOC.mjs";
import { o as ToolPolicySchema } from "../zod-schema.agent-runtime-cX-pI-Mt.mjs";
import { c as buildChannelAccountSchemaParts, d as buildChannelReactionShape, l as buildChannelAllowBotsSchema, m as ChannelBotLoopProtectionSchema, r as ChannelSendReadReceiptsSchema, t as ChannelDangerouslyAllowNameMatchingSchema } from "../zod-schema.channel-messaging-common-D8pVq6y7.mjs";
import { a as buildGroupEntrySchema, c as buildNestedDmConfigSchema, i as buildChannelConfigSchema, n as ChannelGroupEntrySchema, r as buildCatchallMultiAccountChannelSchema, s as buildMultiAccountChannelSchema, t as AllowFromListSchema, u as refineChannelDmPolicy } from "../config-schema-Be-FohaC.mjs";
import { t as resolveAccountEntry } from "../account-lookup-D_rRUHd5.mjs";
import "../channel-config-schema-ByBc0Lp5.mjs";
//#region src/config/zod-schema.providers-googlechat.ts
const GoogleChatDmSchema = strictObject({ enabled: boolean().optional() });
const GoogleChatGroupSchema = strictObject({
	enabled: boolean().optional(),
	requireMention: boolean().optional(),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	users: array(union([string(), number()])).optional(),
	systemPrompt: string().optional()
});
const { accountShape: accountShape$1, rootPolicyShape: rootPolicyShape$1 } = buildChannelAccountSchemaParts({
	omit: ["mentionPatterns"],
	streaming: ChannelDeliveryStreamingConfigSchema.optional()
});
const GoogleChatAccountSchemaBase = strictObject({
	...accountShape$1,
	allowBots: buildChannelAllowBotsSchema(),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	dangerouslyAllowNameMatching: ChannelDangerouslyAllowNameMatchingSchema,
	requireMention: boolean().optional(),
	groups: record(string(), GoogleChatGroupSchema.optional()).optional(),
	serviceAccount: union([
		string(),
		record(string(), unknown()),
		SecretRefSchema
	]).optional().register(sensitive),
	serviceAccountFile: string().optional(),
	audienceType: _enum(["app-url", "project-number"]).optional(),
	audience: string().optional(),
	appPrincipal: string().optional(),
	webhookPath: string().optional(),
	webhookUrl: string().optional(),
	botUser: string().optional(),
	dm: GoogleChatDmSchema.optional(),
	typingIndicator: _enum([
		"none",
		"message",
		"reaction"
	]).optional()
});
const GoogleChatConfigSchema = GoogleChatAccountSchemaBase.extend({
	...rootPolicyShape$1,
	accounts: record(string(), GoogleChatAccountSchemaBase.optional()).optional(),
	defaultAccount: string().optional()
}).superRefine((value, ctx) => {
	refineChannelDmPolicy({
		channelId: "googlechat",
		value,
		ctx
	});
	for (const accountId of Object.keys(value.accounts ?? {})) refineChannelDmPolicy({
		channelId: "googlechat",
		value,
		accountId,
		ctx
	});
});
//#endregion
//#region src/config/zod-schema.providers-whatsapp.ts
const WhatsAppGroupEntrySchema = buildGroupEntrySchema(void 0, { omit: [
	"skills",
	"enabled",
	"allowFrom"
] }).optional();
const WhatsAppGroupsSchema = record(string(), WhatsAppGroupEntrySchema).optional();
const WhatsAppDirectEntrySchema = strictObject({ systemPrompt: string().optional() }).optional();
const WhatsAppDirectSchema = record(string(), WhatsAppDirectEntrySchema).optional();
const WhatsAppPluginHooksSchema = strictObject({ messageReceived: boolean().optional() }).optional();
const { accountShape, rootPolicyShape } = buildChannelAccountSchemaParts({
	omit: ["name"],
	allowFrom: array(string()).optional(),
	groupAllowFrom: array(string()).optional(),
	streaming: ChannelDeliveryStreamingConfigSchema.optional(),
	mediaMaxMb: number().int().positive().optional()
});
const WhatsAppCommonShape = {
	...accountShape,
	sendReadReceipts: ChannelSendReadReceiptsSchema,
	selfChatMode: boolean().optional(),
	groups: WhatsAppGroupsSchema,
	direct: WhatsAppDirectSchema,
	...buildChannelReactionShape({ reactionLevels: [
		"off",
		"ack",
		"minimal",
		"extensive"
	] }),
	pluginHooks: WhatsAppPluginHooksSchema
};
const WhatsAppAccountSchema = strictObject({
	...WhatsAppCommonShape,
	name: string().optional(),
	/** Override auth directory for this WhatsApp account (Baileys multi-file auth state). */
	authDir: string().optional(),
	mediaMaxMb: number().int().positive().optional()
});
const WhatsAppConfigSchema = strictObject({
	...WhatsAppCommonShape,
	...rootPolicyShape,
	accounts: record(string(), WhatsAppAccountSchema.optional()).optional(),
	defaultAccount: string().optional(),
	mediaMaxMb: number().int().positive().optional().default(50),
	actions: strictObject({
		reactions: boolean().optional(),
		sendMessage: boolean().optional(),
		polls: boolean().optional(),
		calls: boolean().optional()
	}).optional()
}).superRefine((value, ctx) => {
	const defaultAccount = resolveAccountEntry(value.accounts, "default");
	refineChannelDmPolicy({
		channelId: "whatsapp",
		value,
		ctx
	});
	const inherited = {
		...value,
		dmPolicy: defaultAccount?.dmPolicy ?? value.dmPolicy,
		allowFrom: defaultAccount?.allowFrom ?? value.allowFrom
	};
	for (const accountId of Object.keys(value.accounts ?? {})) refineChannelDmPolicy({
		channelId: "whatsapp",
		value: accountId === "default" ? value : inherited,
		accountId,
		ctx
	});
});
//#endregion
//#region src/plugin-sdk/bundled-channel-config-schema.ts
/**
* Bundled-channel config schemas for OpenClaw-maintained plugins.
*
* Third-party plugins should define plugin-local schemas and import primitives
* from openclaw/plugin-sdk/channel-config-schema instead of depending on these
* bundled channel schemas. Internal callers use this subpath only for the
* bundled provider schemas; generic primitives come from channel-config-schema.
*/
function createLegacyExternalChannelConfigSchema() {
	return object({}).passthrough();
}
/**
* @deprecated Compatibility for external channel packages published through 2026.7.1.
* Their package manifests remain the validation owner. Remove after the minimum supported
* Slack, Discord, Signal, and Teams packages use plugin-owned config schemas.
*/
const SlackConfigSchema = createLegacyExternalChannelConfigSchema();
/** @deprecated See SlackConfigSchema. */
const DiscordConfigSchema = createLegacyExternalChannelConfigSchema();
/** @deprecated See SlackConfigSchema. */
const SignalConfigSchema = createLegacyExternalChannelConfigSchema();
/** @deprecated See SlackConfigSchema. */
const MSTeamsConfigSchema = createLegacyExternalChannelConfigSchema();
function loadBundledConfigSchema(dirName, exportName) {
	const schema = loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName,
		artifactBasename: "config-api.js"
	})[exportName];
	if (!schema) throw new Error(`Bundled plugin ${dirName} config API does not export ${exportName}`);
	return schema;
}
const IMessageConfigSchema = createLazyFacadeObjectValue(() => loadBundledConfigSchema("imessage", "IMessageConfigSchema"));
const TelegramConfigSchema = createLazyFacadeObjectValue(() => loadBundledConfigSchema("telegram", "TelegramConfigSchema"));
//#endregion
export { AllowFromListSchema, BlockStreamingCoalesceSchema, ChannelGroupEntrySchema, ContextVisibilityModeSchema, DiscordConfigSchema, DmConfigSchema, DmPolicySchema, GoogleChatConfigSchema, GroupPolicySchema, IMessageConfigSchema, MSTeamsConfigSchema, MarkdownConfigSchema, ReplyRuntimeConfigSchemaShape, SignalConfigSchema, SlackConfigSchema, TelegramConfigSchema, ToolPolicySchema, WhatsAppConfigSchema, buildCatchallMultiAccountChannelSchema, buildChannelConfigSchema, buildGroupEntrySchema, buildMultiAccountChannelSchema, buildNestedDmConfigSchema, requireAllowlistAllowFrom, requireOpenAllowFrom };

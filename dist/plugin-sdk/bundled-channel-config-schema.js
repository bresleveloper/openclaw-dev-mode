import { d as normalizeStringEntries } from "../string-normalization-_gRhJUDw.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record, or as union, sr as unknown } from "../schemas-BOYIvvln.mjs";
import { n as ZodIssueCode } from "../compat-CVCDeluo.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore, n as createLazyFacadeObjectValue } from "../facade-loader-BWw5NpKt.mjs";
import { A as requireOpenAllowFrom, M as SecretRefSchema, P as DmConfigSchema, a as ContextVisibilityModeSchema, c as GroupPolicySchema, h as ReplyRuntimeConfigSchemaShape, k as requireAllowlistAllowFrom, n as BlockStreamingCoalesceSchema, o as DmPolicySchema, p as MarkdownConfigSchema, r as ChannelDeliveryStreamingConfigSchema } from "../zod-schema.core-DyJd-bbI.mjs";
import { n as sensitive } from "../zod-schema.sensitive-3bxjhHYT.mjs";
import { o as ToolPolicySchema } from "../zod-schema.agent-runtime-A2vJPWeP.mjs";
import { i as ChannelBotLoopProtectionSchema } from "../zod-schema.implicit-mentions-CbSAuVqJ.mjs";
import { a as buildGroupEntrySchema, c as buildNestedDmConfigSchema, i as buildChannelConfigSchema, n as ChannelGroupEntrySchema, r as buildCatchallMultiAccountChannelSchema, s as buildMultiAccountChannelSchema, t as AllowFromListSchema } from "../config-schema-BJ55TtqJ.mjs";
import { t as resolveAccountEntry } from "../account-lookup-CVHGcV8B.mjs";
import { c as buildChannelAllowBotsSchema, r as ChannelSendReadReceiptsSchema, s as buildChannelAccountSchemaParts, t as ChannelDangerouslyAllowNameMatchingSchema, u as buildChannelReactionShape } from "../channel-config-schema-DMmqacmO.mjs";
//#region src/config/zod-schema.providers-googlechat.ts
const GoogleChatDmSchema = object({ enabled: boolean().optional() }).strict();
const GoogleChatGroupSchema = object({
	enabled: boolean().optional(),
	requireMention: boolean().optional(),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	users: array(union([string(), number()])).optional(),
	systemPrompt: string().optional()
}).strict();
const { accountShape: accountShape$1, rootPolicyShape: rootPolicyShape$1 } = buildChannelAccountSchemaParts({
	omit: ["mentionPatterns"],
	streaming: ChannelDeliveryStreamingConfigSchema.optional()
});
const GoogleChatAccountSchemaBase = object({
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
}).strict();
const GoogleChatConfigSchema = GoogleChatAccountSchemaBase.extend({
	...rootPolicyShape$1,
	accounts: record(string(), GoogleChatAccountSchemaBase.optional()).optional(),
	defaultAccount: string().optional()
}).superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.googlechat.dmPolicy=\"open\" requires channels.googlechat.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.googlechat.dmPolicy=\"allowlist\" requires channels.googlechat.allowFrom to contain at least one sender ID"
	});
	for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.googlechat.accounts.*.dmPolicy=\"open\" requires channels.googlechat.accounts.*.allowFrom (or channels.googlechat.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.googlechat.accounts.*.dmPolicy=\"allowlist\" requires channels.googlechat.accounts.*.allowFrom (or channels.googlechat.allowFrom) to contain at least one sender ID"
		});
	}
});
//#endregion
//#region src/config/zod-schema.providers-whatsapp.ts
const WhatsAppGroupEntrySchema = buildGroupEntrySchema(void 0, { omit: [
	"skills",
	"enabled",
	"allowFrom"
] }).optional();
const WhatsAppGroupsSchema = record(string(), WhatsAppGroupEntrySchema).optional();
const WhatsAppDirectEntrySchema = object({ systemPrompt: string().optional() }).strict().optional();
const WhatsAppDirectSchema = record(string(), WhatsAppDirectEntrySchema).optional();
const WhatsAppPluginHooksSchema = object({ messageReceived: boolean().optional() }).strict().optional();
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
function enforceOpenDmPolicyAllowFromStar(params) {
	if (params.dmPolicy !== "open") return;
	if (normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : []).includes("*")) return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path ?? ["allowFrom"],
		message: params.message
	});
}
function enforceAllowlistDmPolicyAllowFrom(params) {
	if (params.dmPolicy !== "allowlist") return;
	if (normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : []).length > 0) return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path ?? ["allowFrom"],
		message: params.message
	});
}
const WhatsAppAccountSchema = object({
	...WhatsAppCommonShape,
	name: string().optional(),
	/** Override auth directory for this WhatsApp account (Baileys multi-file auth state). */
	authDir: string().optional(),
	mediaMaxMb: number().int().positive().optional()
}).strict();
const WhatsAppConfigSchema = object({
	...WhatsAppCommonShape,
	...rootPolicyShape,
	accounts: record(string(), WhatsAppAccountSchema.optional()).optional(),
	defaultAccount: string().optional(),
	mediaMaxMb: number().int().positive().optional().default(50),
	actions: object({
		reactions: boolean().optional(),
		sendMessage: boolean().optional(),
		polls: boolean().optional(),
		calls: boolean().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	const defaultAccount = resolveAccountEntry(value.accounts, "default");
	enforceOpenDmPolicyAllowFromStar({
		dmPolicy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		message: "channels.whatsapp.dmPolicy=\"open\" requires channels.whatsapp.allowFrom to include \"*\""
	});
	enforceAllowlistDmPolicyAllowFrom({
		dmPolicy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		message: "channels.whatsapp.dmPolicy=\"allowlist\" requires channels.whatsapp.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? (accountId === "default" ? void 0 : defaultAccount?.dmPolicy) ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? (accountId === "default" ? void 0 : defaultAccount?.allowFrom) ?? value.allowFrom;
		enforceOpenDmPolicyAllowFromStar({
			dmPolicy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.whatsapp.accounts.*.dmPolicy=\"open\" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to include \"*\""
		});
		enforceAllowlistDmPolicyAllowFrom({
			dmPolicy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.whatsapp.accounts.*.dmPolicy=\"allowlist\" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to contain at least one sender ID"
		});
	}
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

import { createAccountListHelpers, mergeAccountConfig } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { GroupPolicySchema, MarkdownConfigSchema, buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { z } from "zod";
// extensions/buzz/src/target.ts
const BUZZ_CHANNEL_ID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/u;
function normalizeBuzzTarget(target) {
	return target.trim().replace(/^buzz:/iu, "").replace(/^channel:/iu, "");
}
function parseBuzzTarget(target) {
	const channelId = normalizeBuzzTarget(target);
	if (!BUZZ_CHANNEL_ID_PATTERN.test(channelId)) throw new Error("Buzz target must be a channel UUID");
	return channelId.toLowerCase();
}
function isConfiguredBuzzChannel(configuredChannelIds, channelId) {
	try {
		return configuredChannelIds.has(parseBuzzTarget(channelId));
	} catch {
		return false;
	}
}
function buildBuzzTarget(channelId) {
	return `buzz:${parseBuzzTarget(channelId)}`;
}
function looksLikeBuzzTarget(target) {
	try {
		parseBuzzTarget(target);
		return true;
	} catch {
		return false;
	}
}
// extensions/buzz/src/config-schema.ts
const BuzzGroupConfigSchema = z.object({
	enabled: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	requireMentionInBotThreads: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional()
}).strict();
const BuzzAccountIdSchema = z.string().regex(/^(?!(?:constructor|prototype)$)[a-z0-9][a-z0-9_-]{0,63}$/u, "Buzz account IDs must be lowercase account keys");
const BuzzAccountConfigSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	responsePrefix: z.string().optional(),
	replyToMode: z.enum(["off", "all"]).optional(),
	markdown: MarkdownConfigSchema,
	relayUrl: z.string().url().and(z.string().regex(/^[wW][sS][sS]?:\/\/.+/, "Buzz relay URL must use ws:// or wss://")).optional(),
	privateKey: buildSecretInputSchema().optional(),
	authTag: buildSecretInputSchema().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional(),
	groups: z.record(z.string().regex(BUZZ_CHANNEL_ID_PATTERN, "Buzz group key must be a channel UUID"), BuzzGroupConfigSchema).optional(),
	historyLimit: z.number().int().min(0).max(20).optional(),
	defaultTo: z.string().optional()
}).strict();
const RawBuzzConfigSchema = BuzzAccountConfigSchema.extend({
	groupPolicy: GroupPolicySchema.optional().default("allowlist"),
	accounts: z.record(BuzzAccountIdSchema, BuzzAccountConfigSchema).optional(),
	defaultAccount: BuzzAccountIdSchema.optional()
});
const botThreadMentionHint = {
	label: "Require Mention in Bot Threads",
	help: "Override mention gating in threads whose root message was signed by this bot in the same room. False allows unmentioned replies; true requires a mention. Omit to preserve the room's mention policy. Sender restrictions still apply."
};
const BuzzConfigSchema = buildChannelConfigSchema(RawBuzzConfigSchema, { uiHints: {
	"groups.*.requireMentionInBotThreads": botThreadMentionHint,
	"accounts.*.groups.*.requireMentionInBotThreads": botThreadMentionHint
} });
// extensions/buzz/src/account-config.ts
function resolveChannelConfig(cfg) {
	return cfg.channels?.buzz;
}
const { listAccountIds: listBuzzAccountIds, resolveDefaultAccountId: resolveDefaultBuzzAccountId } = createAccountListHelpers("buzz", {
	normalizeAccountId,
	fallbackAccountIdWhenEmpty: false,
	implicitDefaultAccount: {
		channelKeys: ["relayUrl", "privateKey"],
		envVars: ["BUZZ_RELAY_URL", "BUZZ_PRIVATE_KEY"]
	}
});
function resolveBuzzAccountConfig(params) {
	const requestedId = params.accountId?.trim();
	const accountId = requestedId ? normalizeOptionalAccountId(requestedId) : resolveDefaultBuzzAccountId(params.cfg);
	if (!accountId || !BuzzAccountIdSchema.safeParse(accountId).success) throw new Error("Buzz account ID must be a valid account key");
	const root = resolveChannelConfig(params.cfg) ?? {};
	const allowEnv = accountId === DEFAULT_ACCOUNT_ID && !Object.hasOwn(root.accounts ?? {}, accountId);
	const account = allowEnv ? void 0 : root.accounts?.[accountId];
	const merged = mergeAccountConfig({
		channelConfig: root,
		accountConfig: account,
		omitKeys: ["defaultAccount", ...allowEnv ? [] : [
			"name",
			"relayUrl",
			"privateKey",
			"authTag",
			"groups",
			"defaultTo"
		]]
	});
	return {
		accountId,
		allowEnv,
		configPath: allowEnv ? "channels.buzz" : `channels.buzz.accounts.${accountId}`,
		config: {
			...merged,
			groupPolicy: merged.groupPolicy ?? "allowlist",
			enabled: root.enabled !== false && account?.enabled !== false,
			groups: normalizeBuzzGroups(merged.groups)
		}
	};
}
function normalizeBuzzGroups(groups) {
	if (!groups) return;
	return Object.fromEntries(Object.entries(groups).map(([channelId, group]) => [parseBuzzTarget(channelId), group]));
}
export { BUZZ_CHANNEL_ID_PATTERN as a, looksLikeBuzzTarget as c, BuzzConfigSchema as i, normalizeBuzzTarget as l, resolveBuzzAccountConfig as n, buildBuzzTarget as o, resolveDefaultBuzzAccountId as r, isConfiguredBuzzChannel as s, listBuzzAccountIds as t, parseBuzzTarget as u };

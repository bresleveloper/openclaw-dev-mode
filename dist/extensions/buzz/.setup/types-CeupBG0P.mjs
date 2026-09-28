import { createAccountListHelpers, mergeAccountConfig } from "openclaw/plugin-sdk/account-helpers";
import { GroupPolicySchema, MarkdownConfigSchema, buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { buildSecretInputSchema, resolveSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { z } from "zod";
import { getPublicKey, nip19 } from "nostr-tools";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { assertSecretOwnerAvailable } from "openclaw/plugin-sdk/channel-secret-owner-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/buzz/src/target.ts
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
//#endregion
//#region extensions/buzz/src/config-schema.ts
const BuzzGroupConfigSchema = z.object({
	enabled: z.boolean().optional(),
	requireMention: z.boolean().optional(),
	groupPolicy: GroupPolicySchema.optional(),
	groupAllowFrom: z.array(z.union([z.string(), z.number()])).optional()
}).strict();
const BuzzAccountIdSchema = z.string().regex(/^(?!(?:constructor|prototype)$)[a-z0-9][a-z0-9_-]{0,63}$/u, "Buzz account IDs must be canonical lowercase account keys");
const BuzzAccountConfigSchema = z.object({
	name: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	responsePrefix: z.string().optional(),
	replyToMode: z.enum(["off", "all"]).optional(),
	markdown: MarkdownConfigSchema,
	relayUrl: z.string().url().and(z.string().regex(/^[wW][sS][sS]?:\/\//, "Buzz relay URL must use ws:// or wss://")).optional(),
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
const BuzzConfigSchema = buildChannelConfigSchema(RawBuzzConfigSchema);
//#endregion
//#region extensions/buzz/src/types.ts
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
function decodeBuzzPrivateKey(value) {
	const trimmed = value.trim();
	if (/^[0-9a-f]{64}$/iu.test(trimmed)) return Uint8Array.from(Buffer.from(trimmed, "hex"));
	const decoded = nip19.decode(trimmed);
	if (decoded.type !== "nsec") throw new Error("Buzz private key must be nsec or 64-character hex");
	return decoded.data;
}
function resolveBuzzPublicKey(privateKey) {
	return getPublicKey(decodeBuzzPrivateKey(privateKey));
}
function resolveBuzzAccount(params) {
	const { accountId, config, configPath, allowEnv } = resolveBuzzAccountConfig(params);
	const relayUrl = config.relayUrl?.trim() || (allowEnv ? process.env.BUZZ_RELAY_URL?.trim() : "") || "";
	const resolveCredential = (field) => resolveSecretInputString({
		value: config[field],
		path: `${configPath}.${field}`,
		mode: "inspect"
	});
	const privateKeyResolution = resolveCredential("privateKey");
	const authTagResolution = resolveCredential("authTag");
	const privateKey = privateKeyResolution.value ?? (allowEnv && privateKeyResolution.status === "missing" ? process.env.BUZZ_PRIVATE_KEY?.trim() || "" : "");
	const authTag = authTagResolution.value ?? (allowEnv && authTagResolution.status === "missing" ? process.env.BUZZ_AUTH_TAG?.trim() || "" : "");
	let publicKey = "";
	if (privateKey) try {
		publicKey = resolveBuzzPublicKey(privateKey);
	} catch {}
	return {
		accountId,
		name: normalizeOptionalString(config.name) ?? "OpenClaw",
		enabled: config.enabled !== false,
		configured: Boolean(relayUrl && (privateKey || privateKeyResolution.ref)),
		relayUrl,
		privateKey,
		authTag,
		publicKey,
		tokenStatus: privateKeyResolution.ref || authTagResolution.ref ? "configured_unavailable" : privateKey ? "available" : "missing",
		config
	};
}
function assertBuzzAccountAvailable(account) {
	assertSecretOwnerAvailable("account", `buzz:${account.accountId}`);
	if (account.tokenStatus === "configured_unavailable") throw new Error(`Buzz credentials for account "${account.accountId}" are configured but unavailable.`);
}
//#endregion
export { resolveBuzzAccountConfig as a, BuzzConfigSchema as c, isConfiguredBuzzChannel as d, looksLikeBuzzTarget as f, resolveBuzzAccount as i, BUZZ_CHANNEL_ID_PATTERN as l, parseBuzzTarget as m, decodeBuzzPrivateKey as n, resolveBuzzPublicKey as o, normalizeBuzzTarget as p, listBuzzAccountIds as r, resolveDefaultBuzzAccountId as s, assertBuzzAccountAvailable as t, buildBuzzTarget as u };

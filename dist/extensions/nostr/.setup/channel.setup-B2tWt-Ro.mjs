import { i as createNostrSetupStatus, n as createNostrSetupAdapter, o as getNostrConfig, r as createNostrSetupContract, s as resolveNostrAccountBase } from "./setup-adapter-DTqb2Hne.mjs";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-plugin-common";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createDelegatedSetupWizardProxy } from "openclaw/plugin-sdk/setup-runtime";
import { buildSecretInputSchema } from "openclaw/plugin-sdk/secret-input";
import { AllowFromListSchema, DmPolicySchema, MarkdownConfigSchema } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
//#region extensions/nostr/src/config-schema.ts
const safeUrlSchema = z.string().url().refine((url) => URL.parse(url)?.protocol === "https:", { message: "URL must use https:// protocol" });
/**
* NIP-01 profile metadata schema
* https://github.com/nostr-protocol/nips/blob/master/01.md
*/
const NostrProfileSchema = z.object({
	name: z.string().max(256).optional(),
	/** NIP-01 display_name. */
	displayName: z.string().max(256).optional(),
	about: z.string().max(2e3).optional(),
	picture: safeUrlSchema.optional(),
	banner: safeUrlSchema.optional(),
	website: safeUrlSchema.optional(),
	/** NIP-05 identifier (e.g., "user@example.com") */
	nip05: z.string().optional(),
	/** Lightning address (LUD-16) */
	lud16: z.string().optional()
});
const NostrConfigSchema = z.object({
	name: z.string().optional(),
	/** Optional default account id for routing/account selection. */
	defaultAccount: z.string().optional(),
	enabled: z.boolean().optional(),
	configWrites: z.boolean().optional(),
	/** Markdown formatting overrides (tables). */
	markdown: MarkdownConfigSchema,
	/** Private key in hex or nsec bech32 format */
	privateKey: buildSecretInputSchema().optional(),
	/** WebSocket relay URLs to connect to */
	relays: z.array(z.string()).optional(),
	dmPolicy: DmPolicySchema.optional(),
	/** Allowed sender pubkeys (npub or hex format) */
	allowFrom: AllowFromListSchema,
	/** Profile metadata (NIP-01 kind:0 content) */
	profile: NostrProfileSchema.optional()
});
//#endregion
//#region extensions/nostr/src/channel.setup.ts
const channel = "nostr";
function resolveDefaultSetupNostrAccountId(cfg) {
	return normalizeAccountId(getNostrConfig(cfg)?.defaultAccount);
}
function resolveSetupNostrAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSetupNostrAccountId(params.cfg));
	return resolveNostrAccountBase(params.cfg, accountId);
}
const nostrSetupWizard = createDelegatedSetupWizardProxy({
	channel,
	loadWizard: async () => (await import("./setup-surface-CadI9603.mjs").then((n) => n.i)).nostrSetupWizard,
	status: createNostrSetupStatus(resolveSetupNostrAccount),
	resolveShouldPromptAccountIds: () => false,
	delegatePrepare: true,
	delegateFinalize: true
});
const nostrSetupPlugin = {
	id: channel,
	meta: {
		id: channel,
		label: "Nostr",
		selectionLabel: "Nostr",
		docsPath: "/channels/nostr",
		docsLabel: "nostr",
		blurb: "Decentralized DMs via Nostr relays (NIP-04)",
		order: 100
	},
	capabilities: {
		chatTypes: ["direct"],
		media: false
	},
	reload: { configPrefixes: ["channels.nostr"] },
	configSchema: buildChannelConfigSchema(NostrConfigSchema),
	setupContract: createNostrSetupContract(createNostrSetupAdapter({ resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultSetupNostrAccountId(cfg) })),
	setupWizard: nostrSetupWizard,
	config: {
		listAccountIds: (cfg) => resolveSetupNostrAccount({ cfg }).configured ? [resolveDefaultSetupNostrAccountId(cfg)] : [],
		resolveAccount: (cfg, accountId) => resolveSetupNostrAccount({
			cfg,
			accountId
		}),
		defaultAccountId: resolveDefaultSetupNostrAccountId,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured,
			extra: { publicKey: account.publicKey }
		})
	}
};
//#endregion
export { NostrProfileSchema as n, nostrSetupPlugin as t };

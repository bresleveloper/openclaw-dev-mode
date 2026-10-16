import { t as NostrConfigSchema } from "./config-schema-HuEK1L2K.mjs";
import { i as createNostrSetupStatus, n as createNostrSetupAdapter, o as getNostrConfig, r as createNostrSetupContract, s as resolveNostrAccountBase } from "./setup-adapter-I55hhpDp.mjs";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
import { buildChannelConfigSchema } from "openclaw/plugin-sdk/channel-plugin-common";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-id";
import { createDelegatedSetupWizardProxy } from "openclaw/plugin-sdk/setup-runtime";
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
	loadWizard: async () => (await import("./setup-surface-b-YWJSGV.mjs").then((n) => n.i)).nostrSetupWizard,
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
export { nostrSetupPlugin as t };

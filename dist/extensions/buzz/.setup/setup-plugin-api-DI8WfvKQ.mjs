import { c as BuzzConfigSchema, i as resolveBuzzAccount, r as listBuzzAccountIds, s as resolveDefaultBuzzAccountId } from "./types-CeupBG0P.mjs";
import { n as buzzSetupContract, t as buzzSetupWizard } from "./setup-surface-DOHxdPor.mjs";
import { describeAccountSnapshot } from "openclaw/plugin-sdk/account-helpers";
//#region extensions/buzz/src/channel.setup.ts
const buzzSetupPlugin = {
	id: "buzz",
	meta: {
		id: "buzz",
		label: "Buzz",
		selectionLabel: "Buzz",
		docsPath: "/channels/buzz",
		docsLabel: "buzz",
		blurb: "Connect OpenClaw agents to Buzz team rooms.",
		markdownCapable: true,
		order: 56
	},
	capabilities: {
		chatTypes: ["group"],
		threads: true
	},
	reload: {
		configPrefixes: ["channels.buzz"],
		accountScopedRestart: true
	},
	configSchema: BuzzConfigSchema,
	setupContract: buzzSetupContract,
	setupWizard: buzzSetupWizard,
	config: {
		listAccountIds: listBuzzAccountIds,
		resolveAccount: (cfg, accountId) => resolveBuzzAccount({
			cfg,
			accountId
		}),
		defaultAccountId: resolveDefaultBuzzAccountId,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured,
			extra: {
				baseUrl: account.relayUrl,
				publicKey: account.publicKey
			}
		})
	}
};
//#endregion
export { buzzSetupPlugin as t };

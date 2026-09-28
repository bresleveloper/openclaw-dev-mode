import { s as isMattermostConfigured } from "./normalize-DM54w7ud.mjs";
import { a as describeMattermostAccount, i as MattermostChannelConfigSchema, n as mattermostSetupWizard, o as mattermostConfigAdapter, r as mattermostSetupContract, s as mattermostMeta } from "./channel-plugin-runtime-yAOg5GcM.mjs";
import { t as resolveMattermostGatewayAuthBypassPaths } from "./gateway-auth-bypass-B93t91oq.mjs";
//#region extensions/mattermost/src/channel.setup.ts
const mattermostSetupPlugin = {
	id: "mattermost",
	meta: { ...mattermostMeta },
	capabilities: {
		chatTypes: [
			"direct",
			"channel",
			"group",
			"thread"
		],
		reactions: true,
		threads: true,
		media: true,
		nativeCommands: true
	},
	reload: {
		configPrefixes: ["channels.mattermost"],
		noopPrefixes: ["messages.inbound"],
		/**
		* accounts.default is promoted; named resolution merges only channel-wide fields
		* plus the selected account. Runtime monitor, debounce, and ingress use accountId.
		*/
		accountScopedRestart: true
	},
	configSchema: MattermostChannelConfigSchema,
	config: {
		...mattermostConfigAdapter,
		isConfigured: isMattermostConfigured,
		describeAccount: describeMattermostAccount
	},
	gateway: { resolveGatewayAuthBypassPaths: resolveMattermostGatewayAuthBypassPaths },
	setupContract: mattermostSetupContract,
	setupWizard: mattermostSetupWizard
};
//#endregion
export { mattermostSetupPlugin as t };

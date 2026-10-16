import { a as defineChannelAliasMigration, d as normalizeAccountId } from "./runtime-doctor-migrations-BhouWAUC.js";
import { t as createLegacyWebhookListenerDoctorContract } from "./legacy-webhook-listener-migration-Bu-ybctG.js";
import { o as createAccountListHelpers, s as hasConfiguredAccountValue } from "./account-core-bZmYRKLc.js";
//#region extensions/nextcloud-talk/configured-state.ts
const { listAccountIds: listNextcloudTalkAccountIds, resolveDefaultAccountId: resolveDefaultNextcloudTalkAccountId, resolveAccountConfig: mergeNextcloudTalkAccountConfig } = createAccountListHelpers("nextcloud-talk", {
	normalizeAccountId,
	omitKeys: ["defaultAccount"],
	hasImplicitDefaultAccount: (cfg) => {
		const channel = cfg.channels?.["nextcloud-talk"];
		return Boolean(channel?.baseUrl?.trim() && (hasConfiguredAccountValue(channel.botSecret) || channel.botSecretFile?.trim() || process.env.NEXTCLOUD_TALK_BOT_SECRET?.trim()));
	}
});
function hasConfiguredNextcloudAccount(account, env) {
	return Boolean(account?.baseUrl?.trim() && (hasConfiguredAccountValue(account.botSecret) || hasConfiguredAccountValue(account.botSecretFile) || hasConfiguredAccountValue(env.NEXTCLOUD_TALK_BOT_SECRET)));
}
/** Require a Nextcloud server plus its account-owned bot credential. */
function hasConfiguredNextcloudTalkChannelState(params) {
	const channel = params.cfg.channels?.["nextcloud-talk"];
	if (channel?.enabled === false) return false;
	if ((channel?.accounts?.["default"])?.enabled !== false) {
		if (hasConfiguredNextcloudAccount(mergeNextcloudTalkAccountConfig(params.cfg, "default"), params.env ?? process.env)) return true;
	}
	return Object.entries(channel?.accounts ?? {}).some(([accountId, account]) => accountId !== "default" && account.enabled !== false && hasConfiguredNextcloudAccount(mergeNextcloudTalkAccountConfig(params.cfg, accountId), {}));
}
//#endregion
//#region extensions/nextcloud-talk/src/doctor-contract.ts
const webhookContract = createLegacyWebhookListenerDoctorContract({
	channelKey: "nextcloud-talk",
	defaultHost: "0.0.0.0",
	defaultPort: 8788
});
const { historicalWebhookListener } = webhookContract;
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "nextcloud-talk",
	streaming: {
		defaultMode: "partial",
		deliveryOnly: true
	},
	accountStreamingReplacesRoot: true
});
const legacyConfigRules = [...webhookContract.legacyConfigRules, ...streamingAliasMigration.legacyConfigRules];
function normalizeHistoricalWebhookConfig({ cfg }) {
	return {
		...webhookContract.normalizeCompatibilityConfig({ cfg }),
		historicalWebhookAccountIds: !hasConfiguredNextcloudTalkChannelState({ cfg }) ? [] : listNextcloudTalkAccountIds(cfg).filter((accountId) => mergeNextcloudTalkAccountConfig(cfg, accountId).enabled !== false)
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const webhook = normalizeHistoricalWebhookConfig({ cfg });
	return {
		...streamingAliasMigration.normalizeChannelConfig({
			cfg: webhook.config,
			changes: webhook.changes
		}),
		historicalWebhookAccountIds: webhook.historicalWebhookAccountIds
	};
}
//#endregion
export { historicalWebhookListener, legacyConfigRules, normalizeCompatibilityConfig, normalizeHistoricalWebhookConfig };

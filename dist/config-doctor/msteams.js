import { O as readNonBlankString, a as defineChannelAliasMigration } from "./runtime-doctor-migrations-BhouWAUC.js";
import { t as createLegacyWebhookListenerDoctorContract } from "./legacy-webhook-listener-migration-Bu-ybctG.js";
import { n as normalizeResolvedSecretInputString, r as normalizeSecretInputString } from "./types.secrets-pt3cVWr4.js";
import "./secret-input-DnlqG81c.js";
import "./string-coerce-runtime-CM4JCyJk.js";
//#region extensions/msteams/src/token-config.ts
function resolveAuthType(cfg) {
	const fromCfg = cfg?.authType;
	if (fromCfg === "secret" || fromCfg === "federated") return fromCfg;
	if (process.env.MSTEAMS_AUTH_TYPE === "federated") return "federated";
	return "secret";
}
function resolveFederatedPath(configValue, envValue) {
	return readNonBlankString(configValue) ?? readNonBlankString(envValue);
}
function resolveMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const appId = normalizeSecretInputString(cfg?.appId) || normalizeSecretInputString(process.env.MSTEAMS_APP_ID);
	const tenantId = normalizeSecretInputString(cfg?.tenantId) || normalizeSecretInputString(process.env.MSTEAMS_TENANT_ID);
	if (!appId || !tenantId) return;
	if (authType === "federated") {
		const certificatePath = resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH);
		const certificateThumbprint = cfg?.certificateThumbprint || process.env.MSTEAMS_CERTIFICATE_THUMBPRINT || void 0;
		const useManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		const managedIdentityClientId = cfg?.managedIdentityClientId || process.env.MSTEAMS_MANAGED_IDENTITY_CLIENT_ID || void 0;
		if (!certificatePath && !useManagedIdentity) return;
		return {
			type: "federated",
			appId,
			tenantId,
			certificatePath,
			certificateThumbprint,
			useManagedIdentity: useManagedIdentity || void 0,
			managedIdentityClientId
		};
	}
	const appPassword = normalizeResolvedSecretInputString({
		value: cfg?.appPassword,
		path: "channels.msteams.appPassword"
	}) || normalizeSecretInputString(process.env.MSTEAMS_APP_PASSWORD);
	if (!appPassword) return;
	return {
		type: "secret",
		appId,
		appPassword,
		tenantId
	};
}
//#endregion
//#region extensions/msteams/config-doctor-api.ts
const webhookMigration = createLegacyWebhookListenerDoctorContract({
	channelKey: "msteams",
	defaultPort: 3978,
	webhookKey: "webhook",
	portKey: "port",
	hostKey: null,
	preserveAuthoredActivation: true
});
const { historicalWebhookListener } = webhookMigration;
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "msteams",
	streaming: { defaultMode: "partial" }
});
const legacyConfigRules = [...webhookMigration.legacyConfigRules, ...streamingAliasMigration.legacyConfigRules];
function normalizeHistoricalWebhookConfig({ cfg }) {
	return {
		...webhookMigration.normalizeCompatibilityConfig({ cfg }),
		historicalWebhookAccountIds: cfg.channels?.msteams === void 0 && !resolveMSTeamsCredentials() ? null : cfg.channels?.msteams?.enabled === false ? [] : [void 0]
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

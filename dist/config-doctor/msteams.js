import { N as readNonBlankString, a as defineChannelAliasMigration } from "./runtime-doctor-migrations-Bq3PkBbD.js";
import { t as createLegacyWebhookListenerDoctorContract } from "./legacy-webhook-listener-migration-S3H2cekT.js";
import { n as normalizeResolvedSecretInputString, r as normalizeSecretInputString } from "./types.secrets-DtpmAEmy.js";
import "./secret-input-Bnx2VFPc.js";
import "./string-coerce-runtime-D5jaFnkP.js";
//#region extensions/msteams/src/token-config.ts
function resolveAuthType(cfg, options) {
	const fromCfg = cfg?.authType;
	if (fromCfg === "secret" || fromCfg === "federated") return fromCfg;
	if ((options?.allowEnvFallback === false ? void 0 : process.env.MSTEAMS_AUTH_TYPE) === "federated") return "federated";
	return "secret";
}
function resolveFederatedPath(configValue, envValue) {
	return readNonBlankString(configValue) ?? readNonBlankString(envValue);
}
function resolveMSTeamsAppId(cfg, allowEnvFallback) {
	return normalizeSecretInputString(cfg?.appId) || (allowEnvFallback ? normalizeSecretInputString(process.env.MSTEAMS_APP_ID) : void 0);
}
function resolveMSTeamsTenantId(cfg, allowEnvFallback) {
	return normalizeSecretInputString(cfg?.tenantId) || (allowEnvFallback ? normalizeSecretInputString(process.env.MSTEAMS_TENANT_ID) : void 0);
}
function resolveMSTeamsCredentials(cfg, options) {
	const allowEnvFallback = options?.allowEnvFallback ?? true;
	const pathPrefix = options?.pathPrefix ?? "channels.msteams";
	const authType = resolveAuthType(cfg, { allowEnvFallback });
	const appId = resolveMSTeamsAppId(cfg, allowEnvFallback);
	const tenantId = resolveMSTeamsTenantId(cfg, allowEnvFallback);
	if (!appId || !tenantId) return;
	if (authType === "federated") {
		const certificatePath = resolveFederatedPath(cfg?.certificatePath, allowEnvFallback ? process.env.MSTEAMS_CERTIFICATE_PATH : void 0);
		const certificateThumbprint = cfg?.certificateThumbprint || (allowEnvFallback ? process.env.MSTEAMS_CERTIFICATE_THUMBPRINT : void 0) || void 0;
		const useManagedIdentity = cfg?.useManagedIdentity ?? (allowEnvFallback ? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true" : false);
		const managedIdentityClientId = cfg?.managedIdentityClientId || (allowEnvFallback ? process.env.MSTEAMS_MANAGED_IDENTITY_CLIENT_ID : void 0) || void 0;
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
		path: `${pathPrefix}.appPassword`
	}) || (allowEnvFallback ? normalizeSecretInputString(process.env.MSTEAMS_APP_PASSWORD) : void 0);
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

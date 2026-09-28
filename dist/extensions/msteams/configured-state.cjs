Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
require("./.setup/secret-input-C65t6kjM.cjs");
let openclaw_plugin_sdk_secret_input = require("openclaw/plugin-sdk/secret-input");
//#region extensions/msteams/configured-state.ts
/** Mirror Teams auth-mode requirements without loading the Azure SDK or full channel. */
function hasConfiguredMSTeamsChannelState(params) {
	const config = params.cfg.channels?.msteams;
	if (config?.enabled === false) return false;
	const env = params.env ?? process.env;
	const appId = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(config && Object.hasOwn(config, "appId") ? config.appId : env.MSTEAMS_APP_ID);
	const tenantId = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(config && Object.hasOwn(config, "tenantId") ? config.tenantId : env.MSTEAMS_TENANT_ID);
	if (!appId || !tenantId) return false;
	if ((config?.authType ?? env.MSTEAMS_AUTH_TYPE ?? "secret") === "federated") {
		const certificatePath = (0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(config && Object.hasOwn(config, "certificatePath") ? config.certificatePath : env.MSTEAMS_CERTIFICATE_PATH);
		return Boolean(certificatePath || (config?.useManagedIdentity ?? env.MSTEAMS_USE_MANAGED_IDENTITY === "true"));
	}
	return config && Object.hasOwn(config, "appPassword") ? (0, openclaw_plugin_sdk_secret_input.hasConfiguredSecretInput)(config.appPassword) : Boolean((0, openclaw_plugin_sdk_secret_input.normalizeSecretInputString)(env.MSTEAMS_APP_PASSWORD));
}
//#endregion
exports.hasConfiguredMSTeamsChannelState = hasConfiguredMSTeamsChannelState;

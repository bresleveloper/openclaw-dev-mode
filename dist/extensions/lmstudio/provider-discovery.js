import { c as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, i as getUnlistedLmstudioConfiguredModelIds, n as resolveLmstudioProviderAuthMode, t as hasLmstudioAuthorizationHeader, u as LMSTUDIO_PROVIDER_ID } from "./.setup/provider-auth-DfEcaIpJ.mjs";
import { CUSTOM_LOCAL_AUTH_MARKER } from "openclaw/plugin-sdk/provider-auth";
//#region extensions/lmstudio/provider-discovery.ts
var provider_discovery_default = {
	id: LMSTUDIO_PROVIDER_ID,
	label: "LM Studio",
	docsPath: "/providers/lmstudio",
	envVars: [LMSTUDIO_DEFAULT_API_KEY_ENV_VAR],
	auth: [],
	catalog: {
		order: "late",
		getUnlistedConfiguredModelIds: getUnlistedLmstudioConfiguredModelIds,
		run: async (ctx) => {
			const { discoverLmstudioProvider } = await import("./.setup/catalog-Dt39Y8ti.mjs");
			return await discoverLmstudioProvider(ctx, { discoveryMode: "strict" });
		}
	},
	resolveSyntheticAuth: ({ providerConfig }) => {
		if (!providerConfig || resolveLmstudioProviderAuthMode(providerConfig.apiKey) || hasLmstudioAuthorizationHeader(providerConfig.headers)) return;
		return {
			apiKey: CUSTOM_LOCAL_AUTH_MARKER,
			source: "models.providers.lmstudio (synthetic local key)",
			mode: "api-key"
		};
	}
};
//#endregion
export { provider_discovery_default as default };

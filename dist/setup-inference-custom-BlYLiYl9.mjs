import { t as buildAuthProfileId } from "./identity-CkXDj4l-.mjs";
import { n as buildApiKeyCredential } from "./provider-auth-helpers-CDvD9QW2.mjs";
import { n as applyProviderPluginAuthMethodResultConfig } from "./provider-auth-choice-Piu1KX0Y.mjs";
//#region src/system-agent/setup-inference-custom.ts
function prepareCustomSetupCredentials(params) {
	const provider = params.config.models?.providers?.[params.providerId];
	const key = provider?.apiKey;
	const profiles = key ? [{
		profileId: buildAuthProfileId({ providerId: params.providerId }),
		credential: buildApiKeyCredential(params.providerId, key, void 0, {
			config: params.config,
			secretInputMode: "plaintext"
		})
	}] : [];
	const profile = profiles[0];
	if (provider?.headers?.["api-key"] && profile?.credential.type === "api_key" && profile.credential.key) profile.secretStorage = {
		kind: "store",
		namePrefix: "CUSTOM_API_KEY"
	};
	if (provider) delete provider.apiKey;
	return {
		config: applyProviderPluginAuthMethodResultConfig({
			config: params.config,
			result: { profiles }
		}),
		profiles
	};
}
//#endregion
export { prepareCustomSetupCredentials as t };

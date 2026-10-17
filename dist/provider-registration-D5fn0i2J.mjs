import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-DHc8KFQ9.mjs";
import "./provider-entry-Dw7vrvaY.mjs";
import { t as applyFalConfig } from "./onboard-mrYJB08W.mjs";
import { n as createFalProvider$1, t as createFalAuthMethodMetadata } from "./provider-contract-api-D6DdZzo3.mjs";
//#region extensions/fal/provider-registration.ts
const PROVIDER_ID = "fal";
function createFalProvider() {
	return {
		...createFalProvider$1(),
		auth: [createProviderApiKeyAuthMethod({
			providerId: PROVIDER_ID,
			methodId: "api-key",
			...createFalAuthMethodMetadata(),
			optionKey: "falApiKey",
			flagName: "--fal-api-key",
			envVar: "FAL_KEY",
			promptMessage: "Enter fal API key",
			expectedProviders: ["fal"],
			applyConfig: (cfg) => applyFalConfig(cfg)
		})]
	};
}
//#endregion
export { createFalProvider as t };

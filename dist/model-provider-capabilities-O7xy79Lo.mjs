import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { i as resolveManifestProviderAuthChoices, t as resolveManifestDeclaredProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { c as supportsSetupTextInference, s as supportsSetupManualSecret } from "./setup-inference-auth-options-D3RRexV_.mjs";
import { i as listProviderLoginOptions } from "./provider-login-options-DbA7M9R5.mjs";
//#region src/gateway/server-methods/model-provider-capabilities.ts
function resolveModelProviderCapabilities(params) {
	const lookup = {
		...params,
		env: params.env ?? process.env,
		includeUntrustedWorkspacePlugins: false
	};
	const resolveProvider = (provider) => resolveProviderIdForAuth(provider, lookup);
	const { providers, modelCatalogProviders } = params.metadataSnapshot.owners;
	const modelProviders = new Set([...providers.keys(), ...modelCatalogProviders.keys()].map(resolveProvider));
	const capabilities = /* @__PURE__ */ new Map();
	const loginChoices = resolveManifestDeclaredProviderAuthChoices({
		...lookup,
		includeWorkspacePlugins: false
	});
	const loginOptions = listProviderLoginOptions(loginChoices);
	for (const choice of resolveManifestProviderAuthChoices(lookup)) {
		const provider = resolveProvider(choice.providerId);
		if (!modelProviders.has(provider) || !supportsSetupTextInference(choice.onboardingScopes)) continue;
		const current = capabilities.get(provider);
		const apiKeySupported = choice.methodId === "api-key";
		const quickApiKeySetup = apiKeySupported && supportsSetupManualSecret(choice);
		const providerLoginOptions = loginOptions.filter((option) => resolveProvider(option.brandId) === provider);
		capabilities.set(provider, {
			provider,
			apiKeySupported: current?.apiKeySupported === true || apiKeySupported,
			quickApiKeySetup: current?.quickApiKeySetup === true || quickApiKeySetup,
			...providerLoginOptions.length > 0 ? { loginOptions: providerLoginOptions } : {}
		});
	}
	return {
		capabilities: [...capabilities.values()].toSorted((a, b) => a.provider.localeCompare(b.provider)),
		resolveProvider
	};
}
//#endregion
export { resolveModelProviderCapabilities as t };

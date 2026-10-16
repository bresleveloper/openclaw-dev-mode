import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/plugin-sdk/provider-selection-runtime.ts
/** Select an explicit provider when configured, otherwise the lowest-order auto provider. */
function selectConfiguredOrAutoProvider(params) {
	const configuredProviderId = normalizeOptionalString(params.configuredProviderId);
	const configuredProvider = configuredProviderId ? params.getConfiguredProvider(configuredProviderId) : void 0;
	if (configuredProviderId && !configuredProvider) return {
		configuredProviderId,
		missingConfiguredProvider: true,
		provider: void 0
	};
	return {
		configuredProviderId,
		missingConfiguredProvider: false,
		provider: configuredProvider ?? selectFirstAutoProvider(params.listProviders())
	};
}
/** Merge automatic alias defaults, canonical config, and explicit selected overrides. */
function resolveProviderRawConfig(params) {
	const providerIds = params.configuredProviderId ? [params.providerId, params.configuredProviderId] : [...(params.providerAliases ?? []).toReversed(), params.providerId];
	return Object.fromEntries(providerIds.flatMap((providerId) => Object.entries(readProviderConfig(params.providerConfigs, providerId) ?? {})));
}
/** Resolve a configured or auto-selected provider that passes capability config checks. */
function resolveConfiguredCapabilityProvider(params) {
	const configuredProviderId = normalizeOptionalString(params.configuredProviderId);
	const resolveCandidate = (provider) => {
		const providerConfig = params.resolveProviderConfig({
			provider,
			cfg: params.cfgForResolve,
			rawConfig: resolveProviderRawConfig({
				providerId: provider.id,
				providerAliases: provider.aliases,
				configuredProviderId,
				providerConfigs: params.providerConfigs
			})
		});
		return params.isProviderConfigured({
			provider,
			cfg: params.cfg,
			providerConfig
		}) ? {
			ok: true,
			configuredProviderId,
			provider,
			providerConfig
		} : {
			ok: false,
			code: "provider-not-configured",
			configuredProviderId,
			provider
		};
	};
	if (configuredProviderId) {
		const provider = params.getConfiguredProvider(configuredProviderId);
		if (!provider) return {
			ok: false,
			code: "missing-configured-provider",
			configuredProviderId
		};
		return resolveCandidate(provider);
	}
	const providers = [...params.listProviders()].toSorted(compareProviderAutoSelectOrder);
	if (providers.length === 0) return {
		ok: false,
		code: "no-registered-provider"
	};
	let firstUnavailable;
	let firstUnconfigured;
	for (const provider of providers) {
		if (params.isProviderAvailable && !params.isProviderAvailable({ provider })) {
			firstUnavailable ??= provider;
			continue;
		}
		const resolution = resolveCandidate(provider);
		if (resolution.ok) return resolution;
		firstUnconfigured ??= provider;
	}
	return {
		ok: false,
		code: !firstUnconfigured && firstUnavailable ? "provider-unavailable" : "provider-not-configured",
		provider: firstUnconfigured ?? firstUnavailable
	};
}
function compareProviderAutoSelectOrder(left, right) {
	return (left.autoSelectOrder ?? Number.MAX_SAFE_INTEGER) - (right.autoSelectOrder ?? Number.MAX_SAFE_INTEGER);
}
function selectFirstAutoProvider(providers) {
	let selected;
	for (const provider of providers) if (!selected || compareProviderAutoSelectOrder(provider, selected) < 0) selected = provider;
	return selected;
}
function readProviderConfig(providerConfigs, providerId) {
	if (!providerId) return;
	const providerConfig = providerConfigs?.[providerId];
	return providerConfig && typeof providerConfig === "object" ? providerConfig : void 0;
}
//#endregion
export { resolveProviderRawConfig as n, selectConfiguredOrAutoProvider as r, resolveConfiguredCapabilityProvider as t };

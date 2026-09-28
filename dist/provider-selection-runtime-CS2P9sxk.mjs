import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
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
	if (configuredProviderId) {
		const provider = params.getConfiguredProvider(configuredProviderId);
		if (!provider) return {
			ok: false,
			code: "missing-configured-provider",
			configuredProviderId
		};
		return resolveProviderCandidate({
			...params,
			configuredProviderId,
			provider
		});
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
		const resolution = resolveProviderCandidate({
			...params,
			configuredProviderId,
			provider
		});
		if (resolution.ok) return resolution;
		firstUnconfigured ??= provider;
	}
	if (!firstUnconfigured && firstUnavailable) return {
		ok: false,
		code: "provider-unavailable",
		provider: firstUnavailable
	};
	return {
		ok: false,
		code: "provider-not-configured",
		provider: firstUnconfigured
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
function resolveProviderCandidate(params) {
	const rawProviderConfig = resolveProviderRawConfig({
		providerId: params.provider.id,
		providerAliases: params.provider.aliases,
		configuredProviderId: params.configuredProviderId,
		providerConfigs: params.providerConfigs
	});
	const providerConfig = params.resolveProviderConfig({
		provider: params.provider,
		cfg: params.cfgForResolve,
		rawConfig: rawProviderConfig
	});
	if (!params.isProviderConfigured({
		provider: params.provider,
		cfg: params.cfg,
		providerConfig
	})) return {
		ok: false,
		code: "provider-not-configured",
		configuredProviderId: params.configuredProviderId,
		provider: params.provider
	};
	return {
		ok: true,
		configuredProviderId: params.configuredProviderId,
		provider: params.provider,
		providerConfig
	};
}
//#endregion
export { resolveProviderRawConfig as n, selectConfiguredOrAutoProvider as r, resolveConfiguredCapabilityProvider as t };

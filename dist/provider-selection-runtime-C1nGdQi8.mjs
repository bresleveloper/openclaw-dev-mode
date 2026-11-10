import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
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
	return Object.fromEntries(providerIds.flatMap((providerId) => {
		const config = providerId ? params.providerConfigs?.[providerId] : void 0;
		return config && typeof config === "object" ? Object.entries(config) : [];
	}));
}
function prepareProviderCandidates(params) {
	const configuredProviderId = normalizeOptionalString(params.configuredProviderId);
	const provider = configuredProviderId ? params.getConfiguredProvider(configuredProviderId) : void 0;
	return {
		configuredProviderId,
		providers: configuredProviderId ? provider ? [provider] : [] : [...params.listProviders()].toSorted(compareProviderAutoSelectOrder)
	};
}
function providerConfigContext(params, provider, configuredProviderId) {
	return {
		provider,
		cfg: params.cfgForResolve,
		rawConfig: resolveProviderRawConfig({
			providerId: provider.id,
			providerAliases: provider.aliases,
			configuredProviderId,
			providerConfigs: params.providerConfigs
		})
	};
}
/** @deprecated Use resolveConfiguredCapabilityProviderAsync when providers resolve stored credentials. Final compatibility day: 2026-12-31. */
function resolveConfiguredCapabilityProvider(params) {
	warnPluginSdkDeprecation({
		family: "provider-selection",
		method: "resolveConfiguredCapabilityProvider",
		replacement: "await resolveConfiguredCapabilityProviderAsync()"
	});
	const { configuredProviderId, providers } = prepareProviderCandidates(params);
	if (providers.length === 0) return {
		ok: false,
		code: configuredProviderId ? "missing-configured-provider" : "no-registered-provider",
		...configuredProviderId ? { configuredProviderId } : {}
	};
	let firstUnavailable;
	let firstUnconfigured;
	for (const provider of providers) {
		if (!configuredProviderId && params.isProviderAvailable && !params.isProviderAvailable({ provider })) {
			firstUnavailable ??= provider;
			continue;
		}
		const providerConfig = params.resolveProviderConfig(providerConfigContext(params, provider, configuredProviderId));
		if (params.isProviderConfigured({
			provider,
			cfg: params.cfg,
			providerConfig
		})) return {
			ok: true,
			configuredProviderId,
			provider,
			providerConfig
		};
		if (configuredProviderId) return {
			ok: false,
			code: "provider-not-configured",
			configuredProviderId,
			provider
		};
		firstUnconfigured ??= provider;
	}
	return {
		ok: false,
		code: !firstUnconfigured && firstUnavailable ? "provider-unavailable" : "provider-not-configured",
		provider: firstUnconfigured ?? firstUnavailable
	};
}
/** Async configuration and availability preserve provider selection order. */
async function resolveConfiguredCapabilityProviderAsync(params) {
	const { configuredProviderId, providers } = prepareProviderCandidates(params);
	if (providers.length === 0) return {
		ok: false,
		code: configuredProviderId ? "missing-configured-provider" : "no-registered-provider",
		...configuredProviderId ? { configuredProviderId } : {}
	};
	let firstUnavailable;
	let firstUnconfigured;
	for (const provider of providers) {
		if (!configuredProviderId && params.isProviderAvailable && !params.isProviderAvailable({ provider })) {
			firstUnavailable ??= provider;
			continue;
		}
		const providerConfig = await params.resolveProviderConfig(providerConfigContext(params, provider, configuredProviderId));
		if (await params.isProviderConfigured({
			provider,
			cfg: params.cfg,
			providerConfig
		})) return {
			ok: true,
			configuredProviderId,
			provider,
			providerConfig
		};
		if (configuredProviderId) return {
			ok: false,
			code: "provider-not-configured",
			configuredProviderId,
			provider
		};
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
//#endregion
export { selectConfiguredOrAutoProvider as i, resolveConfiguredCapabilityProviderAsync as n, resolveProviderRawConfig as r, resolveConfiguredCapabilityProvider as t };

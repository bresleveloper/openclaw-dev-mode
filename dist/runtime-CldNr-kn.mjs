import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import { E as selectApplicableRuntimeConfig, s as getRuntimeConfigSnapshot, u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { p as withGuardedFetchRequestAuthority } from "./fetch-guard-EFfAF2PS.mjs";
import { S as getActiveRuntimeWebToolsMetadataFromState } from "./runtime-state-CtZtwiOt.mjs";
import { i as diagnosticHttpStatusCode } from "./diagnostic-error-metadata-DSynPRwg.mjs";
import { i as isTrustedToolExecutionPreflightError, n as formatToolExecutionErrorMessage } from "./tool-result-error-CWadvCKd.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
import { i as resolveWebProviderConfig, n as providerRequiresCredential, r as readWebProviderEnvValue, t as hasWebProviderEntryCredential } from "./provider-runtime-shared-BIVdnoDH.mjs";
import { a as hasAuthProfileForProvider } from "./model-config.helpers-qc7Dcjci.mjs";
import { n as resolveRuntimeWebSearchProviders, t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime.js";
//#region src/web-search/runtime-error.ts
/** Keeps provider attribution and the original diagnostic across automatic fallback. */
var WebSearchProviderError = class extends Error {
	constructor(provider, cause) {
		super(formatToolExecutionErrorMessage(cause, "Search provider failed."), { cause });
		this.provider = provider;
		this.name = "WebSearchProviderError";
	}
	/** Model-facing diagnostics contain no upstream response body or credentials. */
	toResult() {
		const status = diagnosticHttpStatusCode(this.cause);
		const hint = status === "401" || status === "403" ? "Check this search provider's credentials and access, or choose another provider." : status === "429" ? "Check this search provider's quota or try again later." : "Check this search provider's configuration and connection, or choose another provider.";
		return {
			provider: this.provider,
			result: {
				error: "provider_error",
				message: `Search failed${status ? ` (HTTP ${status})` : ""}. ${hint}`,
				docs: "https://docs.openclaw.ai/tools/web"
			}
		};
	}
};
//#endregion
//#region src/web-search/runtime-execution.ts
function isStructuredAvailabilityError(result) {
	if (!result || typeof result !== "object" || !("error" in result)) return false;
	const error = result.error;
	return typeof error === "string" && /^missing_[a-z0-9_]*api_key$/i.test(error);
}
async function executeWebSearchCandidates(params) {
	let firstFailure;
	for (const candidate of params.candidates) {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		try {
			const definition = candidate.createTool({
				config: params.config,
				agentDir: params.agentDir,
				searchConfig: params.searchConfig,
				runtimeMetadata: params.runtimeMetadata
			});
			if (!definition) {
				if (!params.allowFallback) throw new Error(`web_search provider "${candidate.id}" is not available.`);
				continue;
			}
			const executed = await definition.execute(params.args, {
				signal: params.signal,
				...params.assertCurrent ? { assertCurrent: params.assertCurrent } : {}
			});
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			if (params.allowFallback && isStructuredAvailabilityError(executed)) {
				firstFailure ??= new WebSearchProviderError(candidate.id, /* @__PURE__ */ new Error(`web_search provider "${candidate.id}" returned ${executed.error}`));
				continue;
			}
			return {
				provider: candidate.id,
				result: executed
			};
		} catch (error) {
			params.signal?.throwIfAborted();
			params.assertCurrent?.();
			if (isTrustedToolExecutionPreflightError(error)) throw error;
			firstFailure ??= new WebSearchProviderError(candidate.id, error);
			if (!params.allowFallback) throw firstFailure;
		}
	}
	throw firstFailure ?? /* @__PURE__ */ new Error("web_search is enabled but no provider is currently available.");
}
//#endregion
//#region src/web-search/runtime.ts
function resolveSearchConfig(cfg) {
	return resolveWebProviderConfig(cfg, "search");
}
function resolveWebSearchRuntimeConfig(params) {
	if (params?.preferInputConfig && params.config) return params.config;
	return selectApplicableRuntimeConfig({
		inputConfig: params?.config,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	});
}
function hasEntryCredential(provider, config, search, agentDir, authStore) {
	return hasWebProviderEntryCredential({
		provider,
		config,
		toolConfig: search,
		resolveRawValue: ({ provider: currentProvider, config: currentConfig }) => currentProvider.getConfiguredCredentialValue?.(currentConfig),
		resolveFallbackRawValue: ({ provider: currentProvider, config: currentConfig }) => currentProvider.getConfiguredCredentialFallback?.(currentConfig)?.value,
		resolveEnvValue: ({ provider: currentProvider, configuredEnvVarId }) => (configuredEnvVarId ? readWebProviderEnvValue([configuredEnvVarId]) : void 0) ?? readWebProviderEnvValue(currentProvider.envVars),
		resolveProviderAuthValue: (providerId) => hasAuthProfileForProvider({
			provider: providerId,
			authStore,
			agentDir: agentDir?.trim() || resolveDefaultAgentDir(config ?? {})
		})
	});
}
function hasImplicitProviderSelectionSignal(provider, config, search, agentDir, authStore) {
	if (!providerRequiresCredential(provider)) return false;
	return hasEntryCredential(provider, config, search, agentDir, authStore);
}
/** Reports whether a web_search provider has usable configured credentials. */
function isWebSearchProviderConfigured(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params.config });
	return hasEntryCredential(params.provider, config, resolveSearchConfig(config), params.agentDir, params.authStore);
}
/** Lists runtime web_search providers after applying runtime config snapshots. */
function listWebSearchProviders(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params?.config });
	return resolveRuntimeWebSearchProviders({ config });
}
/** Lists plugin-configured web_search providers without runtime-only providers. */
function listConfiguredWebSearchProviders(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params?.config });
	return resolvePluginWebSearchProviders({ config });
}
/** Resolves configured or auto-detected web_search provider id. */
function resolveWebSearchProviderId(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params.config });
	const search = params.search ?? resolveSearchConfig(config);
	const providers = sortPluginEntriesForAutoDetect(params.providers ?? resolvePluginWebSearchProviders({ config }));
	const raw = search && "provider" in search ? normalizeLowercaseStringOrEmpty(search.provider) : "";
	if (raw) {
		const explicit = providers.find((provider) => provider.id === raw);
		if (explicit) return explicit.id;
	}
	if (!raw) {
		for (const provider of providers) {
			if (!hasImplicitProviderSelectionSignal(provider, config, search, params.agentDir, params.authStore)) continue;
			logVerbose(`web_search: no provider configured, auto-detected "${provider.id}" from available credentials`);
			return provider.id;
		}
		return "";
	}
	return "";
}
function resolveRuntimePreferredWebSearchProviderId(params) {
	const runtimeProviderId = normalizeOptionalLowercaseString(params.runtimeWebSearch?.selectedProvider ?? params.runtimeWebSearch?.providerConfigured);
	if (!runtimeProviderId) return;
	const configuredProviderId = params.search && "provider" in params.search ? normalizeOptionalLowercaseString(params.search.provider) : void 0;
	if (configuredProviderId) return (params.providers?.find((entry) => entry.id === configuredProviderId))?.id === runtimeProviderId ? runtimeProviderId : void 0;
	if (params.runtimeWebSearch?.providerSource === "configured") return runtimeProviderId;
	const provider = params.providers?.find((entry) => entry.id === runtimeProviderId);
	return provider && hasImplicitProviderSelectionSignal(provider, params.config, params.search, params.agentDir) ? provider.id : void 0;
}
function resolveWebSearchRequestContext(options) {
	const config = resolveWebSearchRuntimeConfig({
		config: options?.config,
		preferInputConfig: options?.preferInputConfig
	});
	return {
		config,
		search: resolveSearchConfig(config),
		runtimeWebSearch: options?.runtimeWebSearch ?? getActiveRuntimeWebToolsMetadataFromState()?.search
	};
}
function loadSortedWebSearchProviders(params) {
	const runtimeProviderId = params.preferRuntimeProviders && params.runtimeWebSearch?.providerSource === "configured" ? normalizeOptionalLowercaseString(params.runtimeWebSearch.selectedProvider ?? params.runtimeWebSearch.providerConfigured) : void 0;
	const providerId = normalizeOptionalLowercaseString(params.providerId) ?? runtimeProviderId ?? normalizeOptionalLowercaseString(params.search?.provider);
	const pluginId = providerId ? resolveManifestContractOwnerPluginId({
		config: params.config,
		contract: "webSearchProviders",
		value: providerId
	}) : void 0;
	const resolveProviders = params.preferRuntimeProviders ? resolveRuntimeWebSearchProviders : resolvePluginWebSearchProviders;
	return sortPluginEntriesForAutoDetect(resolveProviders({
		config: params.config,
		...pluginId ? { onlyPluginIds: [pluginId] } : {}
	}));
}
function resolveWebSearchCandidates(options, context = resolveWebSearchRequestContext(options)) {
	const { config, search, runtimeWebSearch } = context;
	if (search?.enabled === false) return [];
	const providers = loadSortedWebSearchProviders({
		config,
		search,
		runtimeWebSearch,
		providerId: options?.providerId,
		preferRuntimeProviders: options?.preferRuntimeProviders
	}).filter(Boolean);
	if (providers.length === 0) return [];
	const preferredIds = uniqueStrings([
		options?.providerId,
		resolveRuntimePreferredWebSearchProviderId({
			config,
			search,
			runtimeWebSearch,
			providers,
			agentDir: options?.agentDir
		}),
		resolveWebSearchProviderId({
			config,
			agentDir: options?.agentDir,
			search,
			providers
		})
	].filter((value) => Boolean(value)));
	const explicitProviderId = options?.providerId?.trim();
	if (explicitProviderId && !providers.some((entry) => entry.id === explicitProviderId)) throw new Error(`Unknown web_search provider "${explicitProviderId}".`);
	const explicitSelection = hasExplicitWebSearchSelection({
		search,
		runtimeWebSearch,
		providerId: options?.providerId,
		providers
	});
	if (preferredIds.length === 0 && !explicitSelection) return [];
	const fallbackProviders = explicitSelection ? providers : providers.filter((provider) => hasImplicitProviderSelectionSignal(provider, config, search, options?.agentDir));
	return [...preferredIds.map((id) => providers.find((entry) => entry.id === id)).filter((entry) => Boolean(entry)), ...fallbackProviders.filter((entry) => !preferredIds.includes(entry.id))];
}
/** Reports whether web_search can use the prepared selection or resolve an agent-scoped provider. */
function hasUsableWebSearchProvider(options) {
	if (normalizeOptionalLowercaseString(options?.runtimeWebSearch?.selectedProvider)) return true;
	return resolveWebSearchCandidates(options).length > 0;
}
function hasExplicitWebSearchSelection(params) {
	if (params.providerId?.trim()) return true;
	const availableProviderIds = new Set((params.providers ?? []).map((provider) => normalizeLowercaseStringOrEmpty(provider.id)));
	const configuredProviderId = params.search && "provider" in params.search && typeof params.search.provider === "string" ? normalizeLowercaseStringOrEmpty(params.search.provider) : "";
	if (configuredProviderId && availableProviderIds.has(configuredProviderId)) return true;
	const runtimeConfiguredId = normalizeOptionalLowercaseString(params.runtimeWebSearch?.selectedProvider ?? params.runtimeWebSearch?.providerConfigured);
	if (params.runtimeWebSearch?.providerSource === "configured" && runtimeConfiguredId && availableProviderIds.has(runtimeConfiguredId)) return true;
	return false;
}
/** Executes web_search with fallback when selection was not explicit. */
async function runWebSearch(params) {
	const context = resolveWebSearchRequestContext(params);
	const { config, search, runtimeWebSearch } = context;
	const candidates = resolveWebSearchCandidates({
		...params,
		preferRuntimeProviders: params.preferRuntimeProviders ?? true
	}, context);
	if (candidates.length === 0) throw new Error("web_search is disabled or no provider is available.");
	const allowFallback = !hasExplicitWebSearchSelection({
		search,
		runtimeWebSearch,
		providerId: params.providerId,
		providers: candidates
	});
	const assertCurrent = params.assertCurrent;
	return await withGuardedFetchRequestAuthority(assertCurrent ? () => {
		params.signal?.throwIfAborted();
		return assertCurrent();
	} : void 0, (assertRequestCurrent) => executeWebSearchCandidates({
		candidates,
		config,
		searchConfig: search,
		runtimeMetadata: runtimeWebSearch,
		agentDir: params.agentDir,
		args: params.args,
		signal: params.signal,
		assertCurrent: assertRequestCurrent,
		allowFallback
	}));
}
//#endregion
export { resolveWebSearchProviderId as a, listWebSearchProviders as i, isWebSearchProviderConfigured as n, runWebSearch as o, listConfiguredWebSearchProviders as r, WebSearchProviderError as s, hasUsableWebSearchProvider as t };

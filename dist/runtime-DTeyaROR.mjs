import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { T as selectApplicableRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { g as resolveDefaultAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-Bb6gGYEi.mjs";
import { p as authProfileRuntimeMode } from "./user-model-account-authority-DFFjC5J5.mjs";
import { d as getRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-HRosak4u.mjs";
import { S as getActiveRuntimeWebToolsMetadataFromState } from "./runtime-state-DDDhACod.mjs";
import { i as resolveManifestContractOwnerPluginId } from "./plugin-registry-contributions-BDlJJbko.mjs";
import { s as isSignalTimeoutReason } from "./error-Bcp4ZyOv.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as withGuardedFetchRequestAuthority } from "./fetch-request-authority-BA1Sa1i8.mjs";
import { c as ensureAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as isTrustedToolExecutionPreflightError, t as formatToolExecutionErrorMessage } from "./tool-result-error-IpvGgAny.mjs";
import { i as diagnosticHttpStatusCode } from "./diagnostic-error-metadata-Dt79CD6m.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
import { i as resolveWebProviderConfig, n as providerRequiresCredential, r as readWebProviderEnvValue, t as hasWebProviderEntryCredential } from "./provider-runtime-shared-De_5Rq_i.mjs";
import { a as hasAuthProfileForProvider } from "./model-config.helpers-CFSHDCes.mjs";
import { n as resolveRuntimeWebSearchProviders, t as resolvePluginWebSearchProviders } from "./web-search-providers.runtime.js";
//#region src/web-search/runtime-error.ts
/** Providers report absent credentials as structured `missing_<provider>_api_key` output. */
function isMissingCredentialCode(code) {
	return typeof code === "string" && /^missing_[a-z0-9_]*api_key$/i.test(code);
}
/**
* Core-authored, so it stays outside the untrusted envelope: missing credentials are a
* lasting setup fact, and models otherwise retry or reword queries that cannot succeed.
*/
function formatWebSearchNotConfiguredMessage(provider) {
	return `web_search is not set up: provider "${provider}" has no credentials on this Gateway. Searching again or rewording the query fails the same way until the operator configures it. Use another available route instead, such as fetching a known URL or a browser, if this session has one, and tell the user if search was needed.`;
}
/** Keeps provider attribution and the original diagnostic across automatic fallback. */
var WebSearchProviderError = class extends Error {
	constructor(provider, cause, missingCredentialResult) {
		super(formatToolExecutionErrorMessage(cause, "Search provider failed."), { cause });
		this.provider = provider;
		this.missingCredentialResult = missingCredentialResult;
		this.name = "WebSearchProviderError";
	}
	/** Model-facing diagnostics contain no upstream response body or credentials. */
	toResult() {
		if (this.missingCredentialResult) return {
			provider: this.provider,
			result: this.missingCredentialResult
		};
		const status = diagnosticHttpStatusCode(this.cause);
		let message;
		if (!status && isSignalTimeoutReason(this.cause)) {
			const timeoutMs = this.cause instanceof Error ? Object.getOwnPropertyDescriptor(this.cause, "timeoutMs")?.value : void 0;
			message = `Search timed out${typeof timeoutMs === "number" && Number.isSafeInteger(timeoutMs) && timeoutMs > 0 ? ` after ${timeoutMs % 1e3 === 0 ? `${timeoutMs / 1e3}s` : `${timeoutMs}ms`}` : ""}. Try again later or choose another provider.`;
		} else {
			const hint = status === "401" || status === "403" ? "Check this search provider's credentials and access, or choose another provider." : status === "429" ? "Check this search provider's quota or try again later." : "Check this search provider's configuration and connection, or choose another provider.";
			message = `Search failed${status ? ` (HTTP ${status})` : ""}. ${hint}`;
		}
		return {
			provider: this.provider,
			result: {
				error: "provider_error",
				message,
				docs: "https://docs.openclaw.ai/tools/web"
			}
		};
	}
};
//#endregion
//#region src/web-search/runtime-execution.ts
function isStructuredAvailabilityError(result) {
	return typeof result === "object" && result !== null && isMissingCredentialCode(result.error);
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
				firstFailure ??= new WebSearchProviderError(candidate.id, /* @__PURE__ */ new Error(`web_search provider "${candidate.id}" returned ${executed.error}`), executed);
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
function hasEntryCredential(provider, config, agentDir, authStore, resolveAuthProfileStoreSource) {
	return hasWebProviderEntryCredential({
		provider,
		config,
		resolveEnvValue: (configuredEnvVarId) => (configuredEnvVarId ? readWebProviderEnvValue([configuredEnvVarId]) : void 0) ?? readWebProviderEnvValue(provider.envVars),
		resolveProviderAuthValue: (providerId) => hasAuthProfileForProvider({
			provider: providerId,
			authStore,
			authProfileStoreSource: authStore ? void 0 : resolveAuthProfileStoreSource?.(),
			agentDir: agentDir?.trim() || (authStore ? void 0 : resolveDefaultAgentDir(config ?? {}))
		})
	});
}
function hasImplicitProviderSelectionSignal(provider, config, agentDir, authStore, resolveAuthProfileStoreSource) {
	if (!providerRequiresCredential(provider)) return false;
	return hasEntryCredential(provider, config, agentDir, authStore, resolveAuthProfileStoreSource);
}
function isWebSearchProviderConfigured(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params.config });
	return hasEntryCredential(params.provider, config, params.agentDir, params.authStore);
}
/** Lists runtime web_search providers after applying runtime config snapshots. */
function listWebSearchProviders(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params?.config });
	return resolveRuntimeWebSearchProviders({ config });
}
/** Prepare machine-owned discovery policy before enumerating runtime providers. */
async function listWebSearchProvidersAsync(params) {
	await prepareBundledDiscoveryMode();
	return listWebSearchProviders(params);
}
/** Lists plugin-configured web_search providers without runtime-only providers. */
function listConfiguredWebSearchProviders(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params?.config });
	return resolvePluginWebSearchProviders({ config });
}
function resolveWebSearchProviderId(params) {
	const config = resolveWebSearchRuntimeConfig({ config: params.config });
	const search = params.search ?? resolveSearchConfig(config);
	const providers = sortPluginEntriesForAutoDetect(params.providers ?? resolvePluginWebSearchProviders({ config }));
	const raw = search && "provider" in search ? normalizeLowercaseStringOrEmpty(search.provider) : "";
	if (raw) {
		const explicit = providers.find((provider) => provider.id === raw);
		if (explicit) return explicit.id;
	}
	if (!raw) for (const provider of providers) {
		if (!hasImplicitProviderSelectionSignal(provider, config, params.agentDir, params.authStore, params.resolveAuthProfileStoreSource)) continue;
		(params.onAutoDetection ?? logVerbose)(`web_search: no provider configured, auto-detected "${provider.id}" from available credentials`);
		return provider.id;
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
	if (!provider || !hasImplicitProviderSelectionSignal(provider, params.config, params.agentDir, params.authStore, params.resolveAuthProfileStoreSource)) return;
	if (params.runtimeWebSearch?.selectedProviderKeySource === "env") return;
	return provider.id;
}
function resolveWebSearchRequestContext(options) {
	const config = resolveWebSearchRuntimeConfig({
		config: options?.config,
		preferInputConfig: options?.preferInputConfig
	});
	return {
		config,
		search: resolveSearchConfig(config),
		runtimeWebSearch: options?.runtimeWebSearch ?? getActiveRuntimeWebToolsMetadataFromState()?.search,
		sandboxed: options?.sandboxed
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
		sandboxed: params.sandboxed,
		...pluginId ? { onlyPluginIds: [pluginId] } : {}
	}));
}
async function resolveWebSearchCandidates(options, context = resolveWebSearchRequestContext(options)) {
	const { config, search } = context;
	if (search?.enabled === false) return [];
	await prepareBundledDiscoveryMode();
	const providers = loadSortedWebSearchProviders({
		...context,
		providerId: options?.providerId,
		preferRuntimeProviders: options?.preferRuntimeProviders
	});
	if (providers.length === 0) return [];
	const agentDir = options?.agentDir?.trim() || resolveDefaultAgentDir(config ?? {});
	const preparedAuthStore = options?.authStore ?? (authProfileRuntimeMode.getStore() ? void 0 : getRuntimeAuthProfileStoreSnapshotCore(agentDir));
	const preparedOptions = preparedAuthStore ? {
		...options,
		authStore: preparedAuthStore
	} : options;
	let needsAuthSource = false;
	let autoDetectionMessage;
	try {
		const candidates = selectWebSearchCandidates(preparedOptions, context, providers, agentDir, () => {
			needsAuthSource = true;
			return false;
		}, (message) => {
			autoDetectionMessage = message;
		});
		if (!needsAuthSource) {
			if (autoDetectionMessage) logVerbose(autoDetectionMessage);
			return candidates;
		}
	} catch (error) {
		if (!needsAuthSource) throw error;
	}
	const authStore = await ensureAuthProfileStoreWithoutExternalProfilesAsync(agentDir);
	return selectWebSearchCandidates({
		...options,
		authStore
	}, context, providers, agentDir, () => true);
}
function selectWebSearchCandidates(options, context, providers, agentDir, resolveAuthProfileStoreSource, onAutoDetection) {
	const { config, search, runtimeWebSearch } = context;
	const preferredIds = uniqueStrings([
		options?.providerId,
		resolveRuntimePreferredWebSearchProviderId({
			config,
			search,
			runtimeWebSearch,
			providers,
			agentDir,
			authStore: options?.authStore,
			resolveAuthProfileStoreSource
		}),
		resolveWebSearchProviderId({
			config,
			agentDir,
			authStore: options?.authStore,
			search,
			providers,
			resolveAuthProfileStoreSource,
			onAutoDetection
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
	const fallbackProviders = explicitSelection ? providers : providers.filter((provider) => hasImplicitProviderSelectionSignal(provider, config, agentDir, options?.authStore, resolveAuthProfileStoreSource));
	return [...preferredIds.map((id) => providers.find((entry) => entry.id === id)).filter((entry) => Boolean(entry)), ...fallbackProviders.filter((entry) => !preferredIds.includes(entry.id))];
}
/** Configuration presence, not credential validity or network health. */
function hasConfiguredWebSearchProvider(options = {}) {
	const context = resolveWebSearchRequestContext(options);
	const { config, search, runtimeWebSearch } = context;
	if (search?.provider?.trim() || runtimeWebSearch?.selectedProvider || runtimeWebSearch?.providerConfigured || runtimeWebSearch?.diagnostics.some((diagnostic) => diagnostic.code === "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK")) return true;
	return loadSortedWebSearchProviders({
		...context,
		preferRuntimeProviders: true
	}).some((provider) => providerRequiresCredential(provider) && (Boolean(coerceSecretRef(provider.getConfiguredCredentialValue?.(config))) || Boolean(coerceSecretRef(provider.getConfiguredCredentialFallback?.(config)?.value)) || hasEntryCredential(provider, config, options.agentDir, options.authStore, options.resolveAuthProfileStoreSource)));
}
/** Prepare the agent-owned store once before synchronous provider selection. */
async function prepareWebSearchConfiguration(options = {}, prepareAuthStore = ensureAuthProfileStoreWithoutExternalProfilesAsync) {
	await prepareBundledDiscoveryMode();
	if (options.authStore) return hasConfiguredWebSearchProvider(options);
	const agentDir = options.agentDir?.trim() || resolveDefaultAgentDir(options.config ?? {});
	const authStore = authProfileRuntimeMode.getStore() ? void 0 : getRuntimeAuthProfileStoreSnapshotCore(agentDir);
	if (authStore) return hasConfiguredWebSearchProvider({
		...options,
		agentDir,
		authStore
	});
	let needsAuthSource = false;
	const configured = hasConfiguredWebSearchProvider({
		...options,
		resolveAuthProfileStoreSource: () => {
			needsAuthSource = true;
			return false;
		}
	});
	if (configured || !needsAuthSource) return configured;
	const preparedAuthStore = await prepareAuthStore(agentDir);
	return hasConfiguredWebSearchProvider({
		...options,
		agentDir,
		authStore: preparedAuthStore
	});
}
/** Reports whether web_search can use the prepared selection or resolve an agent-scoped provider. */
async function hasUsableWebSearchProvider(options) {
	if (normalizeOptionalLowercaseString(options?.runtimeWebSearch?.selectedProvider)) return true;
	return (await resolveWebSearchCandidates(options)).length > 0;
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
	const candidates = await resolveWebSearchCandidates({
		...params,
		preferRuntimeProviders: params.preferRuntimeProviders ?? true
	}, context);
	if (candidates.length === 0) throw new Error(params.sandboxed ? "web_search is unavailable. Enable or select a bundled or verified official search provider for sandboxed agents." : "web_search is disabled or no provider is available.");
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
export { listWebSearchProviders as a, resolveWebSearchProviderId as c, formatWebSearchNotConfiguredMessage as d, isMissingCredentialCode as f, listConfiguredWebSearchProviders as i, runWebSearch as l, hasUsableWebSearchProvider as n, listWebSearchProvidersAsync as o, isWebSearchProviderConfigured as r, prepareWebSearchConfiguration as s, hasConfiguredWebSearchProvider as t, WebSearchProviderError as u };

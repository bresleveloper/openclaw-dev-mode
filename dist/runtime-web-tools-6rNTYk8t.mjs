import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as secretRefKey } from "./ref-contract-Bfd9_-Lp.mjs";
import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { a as isProviderScopedSecretResolutionError, t as describeSecretResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { i as associateSecretResolutionErrorOwners, u as isRetryableSecretDegradationReason } from "./runtime-degraded-state-SptB0g_t.mjs";
import { l as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-DDDhACod.mjs";
import { n as parseDotPath } from "./shared-BVDjoVcf.mjs";
import { _ as digestRuntimeWebOwnerContract, d as pushInactiveSurfaceWarning, f as pushWarning, h as isExpectedResolvedSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { i as setPathExistingStrict } from "./path-utils-aDSU1mEq.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { r as resolveSecretRefValues } from "./resolve-D1-YVpS6.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
import { n as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, r as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts.explicit-CW0AzPFG.mjs";
import { i as warnDegradedSecretOwner, t as classifySecretOwnerDegradationState } from "./runtime-owner-assignments-CIOjtWgV.mjs";
import { t as hasCredentialBearingObjectValue } from "./runtime-secret-scan-DAb5IwUR.mjs";
import { t as runtimeWebSecretOwnerId } from "./runtime-web-secret-owner-CrfKjyQg.mjs";
//#region src/secrets/runtime-web-tools-selection.types.ts
/** Carries typed web-provider ownership through strict reload failures. */
var RuntimeWebProviderUnavailableError = class extends Error {
	constructor(code, reason, unavailableProviders) {
		super(`[${code}] ${reason}`);
		this.name = "RuntimeWebProviderUnavailableError";
		this.unavailableProviders = unavailableProviders;
	}
};
//#endregion
//#region src/secrets/runtime-web-tools.shared.ts
function readConfiguredProviderCredential(params) {
	return params.provider.getConfiguredCredentialValue?.(params.config) ?? params.provider.getCredentialValue(params.toolConfig);
}
function ensureConfigObject(target, key) {
	const current = target[key];
	if (isRecord(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
function inactivePathsForProvider(provider, kind) {
	return kind === "search" && provider.requiresCredential === false ? [] : provider.inactiveSecretPaths?.length ? provider.inactiveSecretPaths : kind === "search" || provider.credentialPath ? [provider.credentialPath] : [];
}
function pushInactiveProviderCredentialWarnings(selection, details, skipProviderId) {
	for (const provider of selection.providers) {
		if (provider.id === skipProviderId) continue;
		const value = readConfiguredProviderCredential({
			provider,
			config: selection.sourceConfig,
			toolConfig: selection.toolConfig
		});
		if (!coerceSecretRef(value, selection.defaults)) continue;
		for (const path of inactivePathsForProvider(provider, selection.kind)) pushInactiveSurfaceWarning({
			context: selection.context,
			path,
			details
		});
	}
}
function getProviderEnvVars(provider) {
	return "envVars" in provider && Array.isArray(provider.envVars) ? provider.envVars : [];
}
function setResolvedCredentialPath(params) {
	const pathSegments = parseDotPath(params.path);
	if (pathSegments.length === 0) return;
	try {
		setPathExistingStrict(params.resolvedConfig, pathSegments, params.value);
	} catch {}
}
/**
* Selects a configured or auto-detected provider and materializes its resolved credential.
*/
async function resolveRuntimeWebProviderSelection(params) {
	const setResolvedCredential = (provider, value) => {
		if (provider.setConfiguredCredentialValue) {
			provider.setConfiguredCredentialValue(params.resolvedConfig, value);
			return;
		}
		const web = ensureConfigObject(ensureConfigObject(params.resolvedConfig, "tools"), "web");
		provider.setCredentialValue(ensureConfigObject(web, params.kind), value);
	};
	const scopePath = `tools.web.${params.kind}`;
	const noFallbackCode = params.kind === "search" ? "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK" : "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
	if (params.configuredProvider) {
		params.metadata.providerConfigured = params.configuredProvider;
		params.metadata.providerSource = "configured";
	}
	const unavailableProviders = [];
	const resolveProviderContractDigest = (providerId) => digestRuntimeWebOwnerContract({
		...params,
		scopePath,
		providerId
	});
	let selectedProvider;
	let selectedPath;
	let selectedResolution;
	if (params.enabled) {
		const candidates = params.configuredProvider ? params.providers.filter((provider) => provider.id === params.configuredProvider) : params.providers;
		const unresolvedWithoutFallback = [];
		const hasProviderRef = (entry) => Boolean(entry.ref && entry.refKey);
		for (const provider of candidates) {
			const contractDigest = resolveProviderContractDigest(provider.id);
			const resolveInput = (value, path) => params.resolveSecretInput({
				providerId: provider.id,
				value,
				path,
				envVars: getProviderEnvVars(provider),
				contractDigest
			});
			const isKeyless = provider.requiresCredential === false;
			if (isKeyless && !params.configuredProvider && params.kind === "search") continue;
			const path = inactivePathsForProvider(provider, params.kind)[0] ?? "";
			const resolution = await resolveInput(readConfiguredProviderCredential({
				provider,
				config: params.sourceConfig,
				toolConfig: params.toolConfig
			}), path);
			let selectedCandidatePath = path;
			let selectedCandidateResolution = resolution;
			if (!resolution.value && !resolution.secretRefConfigured) {
				const fallback = provider.getConfiguredCredentialFallback?.(params.sourceConfig);
				if (fallback?.value !== void 0) {
					selectedCandidatePath = fallback.path;
					selectedCandidateResolution = await resolveInput(fallback.value, fallback.path);
				}
			} else if (resolution.source === "env" && !resolution.secretRefConfigured) {
				const fallback = provider.getConfiguredCredentialFallback?.(params.sourceConfig);
				if (fallback?.value !== void 0 && coerceSecretRef(fallback.value, params.defaults) !== null) {
					const fallbackResolution = await resolveInput(fallback.value, fallback.path);
					if (fallbackResolution.source === "secretRef" && fallbackResolution.value) setResolvedCredentialPath({
						resolvedConfig: params.resolvedConfig,
						path: fallback.path,
						value: fallbackResolution.value
					});
				}
			}
			if (selectedCandidateResolution.secretRefConfigured && !selectedCandidateResolution.value && selectedCandidateResolution.unresolvedRefReason) unresolvedWithoutFallback.push({
				providerId: provider.id,
				path: selectedCandidatePath,
				ref: selectedCandidateResolution.secretRef,
				refKey: selectedCandidateResolution.secretRefKey,
				reason: selectedCandidateResolution.unresolvedRefReason,
				contractDigest,
				restoreResolvedValue: (resolvedValue) => setResolvedCredential(provider, resolvedValue)
			});
			if (isKeyless && selectedCandidateResolution.secretRefConfigured && !selectedCandidateResolution.value) continue;
			if (isKeyless && !params.configuredProvider && !selectedCandidateResolution.value) continue;
			if (params.configuredProvider || isKeyless || selectedCandidateResolution.value) {
				selectedProvider = provider.id;
				selectedPath = selectedCandidatePath;
				selectedResolution = selectedCandidateResolution;
				if (selectedCandidateResolution.value) {
					setResolvedCredentialPath({
						resolvedConfig: params.resolvedConfig,
						path: selectedCandidatePath,
						value: selectedCandidateResolution.value
					});
					setResolvedCredential(provider, selectedCandidateResolution.value);
				}
				break;
			}
		}
		const failUnresolvedNoFallback = (unresolved, related = [unresolved]) => {
			const diagnostic = {
				code: noFallbackCode,
				message: unresolved.reason,
				path: unresolved.path
			};
			params.diagnostics.push(diagnostic);
			params.metadata.diagnostics.push(diagnostic);
			pushWarning(params.context, {
				code: noFallbackCode,
				path: unresolved.path,
				message: unresolved.reason
			});
			const relatedUnavailableProviders = related.filter(hasProviderRef);
			if (relatedUnavailableProviders.length > 0) {
				const error = new RuntimeWebProviderUnavailableError(noFallbackCode, unresolved.reason, relatedUnavailableProviders);
				params.onUnavailableProviders?.(error);
				throw error;
			}
			throw new Error(`[${noFallbackCode}] ${unresolved.reason}`);
		};
		if (params.configuredProvider) {
			const unresolved = unresolvedWithoutFallback[0];
			if (unresolved) {
				if (hasProviderRef(unresolved) && params.allowUnavailableProviders) unavailableProviders.push(unresolved);
				else failUnresolvedNoFallback(unresolved);
			}
		} else {
			if (!selectedProvider && unresolvedWithoutFallback.length > 0) {
				const firstUnresolved = expectDefined(unresolvedWithoutFallback[0], "unresolved without fallback entry at 0");
				if (!params.allowUnavailableProviders) failUnresolvedNoFallback(firstUnresolved, unresolvedWithoutFallback);
				const unavailable = unresolvedWithoutFallback.filter(hasProviderRef);
				if (unavailable.length !== unresolvedWithoutFallback.length) failUnresolvedNoFallback(firstUnresolved, unresolvedWithoutFallback);
				unavailableProviders.push(...unavailable);
			}
			if (selectedProvider) {
				const selectedDetails = params.providers.find((entry) => entry.id === selectedProvider)?.requiresCredential === false ? `${scopePath} auto-detected keyless provider "${selectedProvider}".` : `${scopePath} auto-detected provider "${selectedProvider}" from available credentials.`;
				const diagnostic = {
					code: params.kind === "search" ? "WEB_SEARCH_AUTODETECT_SELECTED" : "WEB_FETCH_AUTODETECT_SELECTED",
					message: selectedDetails,
					path: `${scopePath}.provider`
				};
				params.diagnostics.push(diagnostic);
				params.metadata.diagnostics.push(diagnostic);
			}
		}
		if (selectedProvider && unavailableProviders.length === 0) {
			params.metadata.selectedProvider = selectedProvider;
			params.metadata.selectedProviderKeySource = selectedResolution?.source;
			if (!params.configuredProvider) params.metadata.providerSource = "auto-detect";
			const provider = params.providers.find((entry) => entry.id === selectedProvider);
			if (provider?.resolveRuntimeMetadata) Object.assign(params.metadata, await provider.resolveRuntimeMetadata({
				config: params.sourceConfig,
				...params.kind === "search" ? { searchConfig: params.toolConfig } : { fetchConfig: params.toolConfig },
				runtimeMetadata: params.metadata,
				resolvedCredential: selectedResolution ? {
					value: selectedResolution.value,
					source: selectedResolution.source,
					fallbackEnvVar: selectedResolution.fallbackEnvVar
				} : void 0
			}));
		}
	}
	if (params.enabled && !params.configuredProvider && params.metadata.selectedProvider) pushInactiveProviderCredentialWarnings(params, `${scopePath} auto-detected provider is "${params.metadata.selectedProvider}".`, params.metadata.selectedProvider);
	else if (params.toolConfig && !params.enabled) pushInactiveProviderCredentialWarnings(params, `${scopePath} is disabled.`);
	if (params.enabled && params.toolConfig && params.configuredProvider) pushInactiveProviderCredentialWarnings(params, `${scopePath}.provider is "${params.configuredProvider}".`, params.configuredProvider);
	const selectedSecretOwner = selectedProvider && selectedPath && selectedResolution?.secretRef && selectedResolution.secretRefKey ? {
		providerId: selectedProvider,
		path: selectedPath,
		ref: selectedResolution.secretRef,
		refKey: selectedResolution.secretRefKey,
		contractDigest: resolveProviderContractDigest(selectedProvider),
		...selectedResolution.value ? { resolvedValue: selectedResolution.value } : {}
	} : void 0;
	return {
		secretOwners: selectedSecretOwner ? [selectedSecretOwner] : unavailableProviders,
		unavailableProviders
	};
}
//#endregion
//#region src/secrets/runtime-web-tools.ts
/** Builds web-tool secret metadata from config, plugins, and provider contracts. */
const loadRuntimeWebToolsFallbackProviders = createLazyRuntimeSurface(() => import("./runtime-web-tools-fallback.runtime.js"), ({ runtimeWebToolsFallbackProviders }) => runtimeWebToolsFallbackProviders);
const loadRuntimeWebToolsPublicArtifacts = createLazyRuntimeSurface(() => import("./runtime-web-tools-public-artifacts.runtime.js"), (mod) => mod);
const loadRuntimeWebToolsManifest = createLazyRuntimeSurface(() => import("./runtime-web-tools-manifest.runtime.js"), (mod) => mod);
function createUnavailableWebProviderOwner(params) {
	return {
		ownerKind: "capability",
		ownerId: runtimeWebSecretOwnerId(params.kind, params.unavailable.providerId),
		state: "unavailable",
		degradationState: params.degradationState ?? "cold",
		paths: [params.unavailable.path],
		refKeys: [params.unavailable.refKey],
		reason: params.unavailable.reason,
		...params.unavailable.providerFailure ? { providerFailures: [params.unavailable.providerFailure] } : {}
	};
}
function attachWebProviderFailures(unavailableProviders, providerFailuresByRefKey) {
	for (const unavailable of unavailableProviders) unavailable.providerFailure = providerFailuresByRefKey.get(unavailable.refKey);
}
function collectUnavailableWebProviders(params) {
	for (const unavailable of params.result.unavailableProviders) {
		let degradationState = classifySecretOwnerDegradationState({
			ownerKind: "capability",
			ownerId: runtimeWebSecretOwnerId(params.kind, unavailable.providerId),
			refs: [unavailable.ref],
			config: params.sourceConfig,
			contractDigest: unavailable.contractDigest,
			forceColdRefKeys: params.forceColdRefKeys
		});
		if (degradationState === "stale") {
			const active = getActiveSecretsRuntimeSnapshotState();
			const value = (active?.secretOwners?.find((entry) => entry.ownerKind === "capability" && entry.ownerId === runtimeWebSecretOwnerId(params.kind, unavailable.providerId)))?.resolvedValues?.find((entry) => entry.refKey === unavailable.refKey)?.value;
			try {
				if (typeof value !== "string" || !unavailable.restoreResolvedValue) throw new Error("last-known-good web credential is unavailable");
				unavailable.restoreResolvedValue(value);
				unavailable.resolvedValue = value;
				const selectedOwner = params.result.secretOwners.find((entry) => entry.providerId === unavailable.providerId && entry.refKey === unavailable.refKey);
				if (selectedOwner) selectedOwner.resolvedValue = value;
				const activeMetadata = params.kind === "search" ? active?.webTools.search : active?.webTools.fetch;
				if (!activeMetadata) throw new Error("last-known-good web metadata is unavailable");
				for (const key of Object.keys(params.metadata)) delete params.metadata[key];
				Object.assign(params.metadata, structuredClone(activeMetadata));
			} catch {
				degradationState = "cold";
			}
		}
		const owner = createUnavailableWebProviderOwner({
			kind: params.kind,
			unavailable,
			degradationState
		});
		params.degradedOwners.push(owner);
		warnDegradedSecretOwner(params.context, owner);
	}
}
function toWebSecretOwnerRefState(kind, owner) {
	return {
		ownerKind: "capability",
		ownerId: runtimeWebSecretOwnerId(kind, owner.providerId),
		refKeys: [owner.refKey],
		contractDigest: owner.contractDigest,
		...owner.resolvedValue ? { resolvedValues: [{
			refKey: owner.refKey,
			value: owner.resolvedValue
		}] } : {}
	};
}
function associateWebProviderResolutionError(params) {
	const failureByRefKey = new Map(params.unavailableProviders.map((unavailable) => [unavailable.refKey, unavailable]));
	const owners = params.unavailableProviders.map((unavailable) => {
		const owner = createUnavailableWebProviderOwner({
			kind: params.kind,
			unavailable
		});
		return {
			...owner,
			degradationState: classifySecretOwnerDegradationState({
				ownerKind: owner.ownerKind,
				ownerId: owner.ownerId,
				refs: [unavailable.ref],
				config: params.config,
				contractDigest: unavailable.contractDigest,
				forceColdRefKeys: params.forceColdRefKeys
			}),
			failureMatched: true,
			source: "config"
		};
	});
	const ownerIds = new Set(owners.map((owner) => owner.ownerId));
	const activeCoOwners = (getActiveSecretsRuntimeSnapshotState()?.secretOwners ?? []).flatMap((owner) => {
		if (owner.ownerKind !== "capability" || ownerIds.has(owner.ownerId) || !owner.ownerId.startsWith("web-search:") && !owner.ownerId.startsWith("web-fetch:")) return [];
		const matches = owner.refKeys.flatMap((refKey) => {
			const unavailable = failureByRefKey.get(refKey);
			return unavailable ? [unavailable] : [];
		});
		const firstMatch = matches[0];
		if (!firstMatch) return [];
		return [{
			ownerKind: owner.ownerKind,
			ownerId: owner.ownerId,
			state: "unavailable",
			paths: [],
			refKeys: [...owner.refKeys],
			reason: firstMatch.reason,
			degradationState: classifySecretOwnerDegradationState({
				ownerKind: owner.ownerKind,
				ownerId: owner.ownerId,
				refs: matches.map((match) => match.ref),
				config: params.config,
				contractDigest: owner.contractDigest,
				forceColdRefKeys: params.forceColdRefKeys
			}),
			failureMatched: true,
			source: "config",
			...firstMatch.providerFailure ? { providerFailures: [firstMatch.providerFailure] } : {}
		}];
	});
	associateSecretResolutionErrorOwners(params.error, [...owners, ...activeCoOwners]);
}
function needsRuntimeWebFetchProviderDiscovery(params) {
	if (isRecord(params.fetch) && params.fetch.enabled === false) return false;
	if (params.hasPluginWebFetchConfig) return true;
	if (!isRecord(params.fetch)) return false;
	if (params.rawProvider) return true;
	return hasCredentialBearingObjectValue(params.fetch, params.defaults);
}
function hasPluginScopedWebToolConfig(config, key) {
	const entries = config.plugins?.entries;
	if (!entries) return false;
	return Object.values(entries).some((entry) => {
		if (!isRecord(entry)) return false;
		const pluginConfig = isRecord(entry.config) ? entry.config : void 0;
		return Boolean(pluginConfig?.[key]);
	});
}
function inferSingleBundledPluginScopedWebToolConfigOwner(config, key) {
	const entries = config.plugins?.entries;
	if (!entries) return;
	const matches = [];
	for (const [pluginId, entry] of Object.entries(entries)) {
		if (!isRecord(entry) || entry.enabled === false) continue;
		const pluginConfig = isRecord(entry.config) ? entry.config : void 0;
		if (!isRecord(pluginConfig?.[key])) continue;
		matches.push(pluginId);
		if (matches.length > 1) return;
	}
	return matches[0];
}
async function hasCustomWebProviderPluginRisk(params) {
	const installRecords = loadInstalledPluginIndexInstallRecordsSync({ env: params.env });
	if (Object.keys(installRecords).length > 0) return true;
	const plugins = params.config.plugins;
	if (!plugins) return false;
	if (Array.isArray(plugins.load?.paths) && plugins.load.paths.length > 0) return true;
	const { resolveManifestContractPluginIds } = await loadRuntimeWebToolsManifest();
	const bundledPluginIds = new Set(resolveManifestContractPluginIds({
		contract: params.contract,
		origin: "bundled",
		config: params.config,
		env: params.env,
		manifestRecords: params.manifestRecords
	}));
	const hasNonBundledPluginId = (pluginId) => !bundledPluginIds.has(pluginId.trim());
	if (Array.isArray(plugins.allow) && plugins.allow.some(hasNonBundledPluginId)) return true;
	if (Array.isArray(plugins.deny) && plugins.deny.some(hasNonBundledPluginId)) return true;
	return Boolean(plugins.entries && Object.keys(plugins.entries).some(hasNonBundledPluginId));
}
function readNonEmptyEnvValue(env, names) {
	for (const envVar of names) {
		const value = normalizeSecretInput(env[envVar]);
		if (value) return {
			value,
			envVar
		};
	}
	return {};
}
async function resolveSecretInputWithEnvFallback(params) {
	const ref = coerceSecretRef(params.value, params.defaults);
	if (!ref) {
		const configValue = normalizeSecretInput(params.value);
		if (configValue) return {
			value: configValue,
			source: "config",
			secretRefConfigured: false
		};
		const fallback = readNonEmptyEnvValue(params.context.env, params.envVars);
		if (fallback.value) return {
			value: fallback.value,
			source: "env",
			fallbackEnvVar: fallback.envVar,
			secretRefConfigured: false
		};
		return {
			source: "missing",
			secretRefConfigured: false
		};
	}
	const associateFailure = (error, reason) => {
		associateWebProviderResolutionError({
			kind: params.kind,
			config: params.sourceConfig,
			error,
			forceColdRefKeys: params.forceColdRefKeys,
			unavailableProviders: [{
				providerId: params.providerId,
				path: params.path,
				ref,
				refKey: secretRefKey(ref),
				reason,
				contractDigest: params.contractDigest
			}]
		});
	};
	let resolvedFromRef;
	let unresolvedRefReason;
	if (params.kind === "fetch" && ref.source === "env" && !params.envVars.includes(ref.id)) throw new Error(`${params.path} SecretRef is not allowed for this provider.`);
	else try {
		const resolvedValue = (await resolveSecretRefValues([ref], {
			config: params.sourceConfig,
			env: params.context.env,
			cache: params.context.cache,
			manifestRegistry: params.context.manifestRegistry
		})).get(secretRefKey(ref));
		if (!isExpectedResolvedSecretValue(resolvedValue, "string")) {
			const error = /* @__PURE__ */ new Error(`${params.path} resolved to a non-string or empty value.`);
			associateFailure(error, "resolved secret value was invalid");
			throw error;
		}
		resolvedFromRef = normalizeSecretInput(resolvedValue);
	} catch (error) {
		const reason = describeSecretResolutionError(error);
		if (!reason || !isRetryableSecretDegradationReason(reason)) {
			if (reason) associateFailure(error, reason);
			throw error;
		}
		unresolvedRefReason = reason;
		if (isProviderScopedSecretResolutionError(error)) params.providerFailuresByRefKey.set(secretRefKey(ref), {
			source: error.source,
			provider: error.provider
		});
	}
	return {
		...resolvedFromRef ? {
			value: resolvedFromRef,
			source: "secretRef"
		} : {
			source: "missing",
			unresolvedRefReason
		},
		secretRef: ref,
		secretRefKey: secretRefKey(ref),
		secretRefConfigured: true
	};
}
async function resolveBundledWebProviders(params) {
	const env = {
		...process.env,
		...params.context.env
	};
	const onlyPluginIds = params.configuredBundledPluginId !== void 0 && (params.kind === "search" || params.configuredBundledPluginId) ? [params.configuredBundledPluginId] : void 0;
	const origin = onlyPluginIds || !params.hasCustomPluginRisk ? "bundled" : void 0;
	if (onlyPluginIds) {
		const bundled = (params.kind === "search" ? resolveBundledExplicitWebSearchProvidersFromPublicArtifacts : resolveBundledExplicitWebFetchProvidersFromPublicArtifacts)({
			onlyPluginIds,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		if (bundled && bundled.length > 0) return bundled;
	} else if (!params.hasCustomPluginRisk) {
		const artifacts = await loadRuntimeWebToolsPublicArtifacts();
		const bundled = (params.kind === "search" ? artifacts.resolveBundledWebSearchProvidersFromPublicArtifacts : artifacts.resolveBundledWebFetchProvidersFromPublicArtifacts)({
			config: params.sourceConfig,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		if (bundled && bundled.length > 0) return bundled;
	}
	const providers = await loadRuntimeWebToolsFallbackProviders();
	return (params.kind === "search" ? providers.resolvePluginWebSearchProviders : providers.resolvePluginWebFetchProviders)({
		config: params.sourceConfig,
		env,
		...onlyPluginIds ? { onlyPluginIds } : {},
		...origin ? { origin } : params.kind === "fetch" ? { sandboxed: true } : {},
		manifestRecords: params.context.manifestRegistry?.plugins
	});
}
/**
* Resolves runtime web search/fetch provider metadata and writes selected credentials into a
* cloned runtime config without mutating the source config.
*/
async function resolveRuntimeWebTools(params) {
	const defaults = params.sourceConfig.secrets?.defaults;
	const diagnostics = [];
	const degradedOwners = [];
	const secretOwners = [];
	const providerFailuresByRefKey = /* @__PURE__ */ new Map();
	const env = {
		...process.env,
		...params.context.env
	};
	const sourceTools = isRecord(params.sourceConfig.tools) ? params.sourceConfig.tools : void 0;
	const sourceWeb = isRecord(sourceTools?.web) ? sourceTools.web : void 0;
	const customWebProviderRisks = {};
	const getHasCustomWebProviderRisk = (contract) => {
		customWebProviderRisks[contract] ??= hasCustomWebProviderPluginRisk({
			contract,
			config: params.sourceConfig,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		return customWebProviderRisks[contract];
	};
	const hasPluginWebSearchConfig = hasPluginScopedWebToolConfig(params.sourceConfig, "webSearch");
	const hasPluginWebFetchConfig = hasPluginScopedWebToolConfig(params.sourceConfig, "webFetch");
	const search = isRecord(sourceWeb?.search) ? sourceWeb.search : void 0;
	const fetch = isRecord(sourceWeb?.fetch) ? sourceWeb.fetch : void 0;
	const webTools = {
		search: {
			providerSource: "none",
			diagnostics: []
		},
		fetch: {
			providerSource: "none",
			diagnostics: []
		},
		diagnostics
	};
	const result = {
		metadata: webTools,
		degradedOwners,
		secretOwners
	};
	if (!search && !fetch && !hasPluginWebSearchConfig && !hasPluginWebFetchConfig) return result;
	for (const kind of ["search", "fetch"]) {
		const toolConfig = kind === "search" ? search : fetch;
		const rawProvider = normalizeLowercaseStringOrEmpty(toolConfig?.provider);
		const contract = kind === "search" ? "webSearchProviders" : "webFetchProviders";
		let configuredBundledPluginIdHint;
		if (kind === "search" && hasPluginWebSearchConfig && !await getHasCustomWebProviderRisk(contract)) {
			if (rawProvider) {
				const entry = params.sourceConfig.plugins?.entries?.[rawProvider];
				if (isRecord(entry) && entry.enabled !== false) {
					const pluginConfig = isRecord(entry.config) ? entry.config : void 0;
					if (isRecord(pluginConfig?.webSearch)) configuredBundledPluginIdHint = rawProvider;
				}
			}
			configuredBundledPluginIdHint ??= inferSingleBundledPluginScopedWebToolConfigOwner(params.sourceConfig, "webSearch");
		}
		if (!(kind === "search" ? search || hasPluginWebSearchConfig : needsRuntimeWebFetchProviderDiscovery({
			fetch,
			rawProvider,
			hasPluginWebFetchConfig,
			defaults
		}))) continue;
		const metadata = webTools[kind];
		const isSearch = kind === "search";
		let configuredBundledPluginId = configuredBundledPluginIdHint;
		const resolveManifestOwner = async () => {
			const { resolveManifestContractOwnerPluginId } = await loadRuntimeWebToolsManifest();
			return resolveManifestContractOwnerPluginId({
				contract,
				value: rawProvider,
				origin: "bundled",
				config: params.sourceConfig,
				env: {
					...process.env,
					...params.context.env
				},
				manifestRecords: params.context.manifestRegistry?.plugins
			});
		};
		const resolveProviders = async () => sortPluginEntriesForAutoDetect(await resolveBundledWebProviders({
			kind,
			sourceConfig: params.sourceConfig,
			context: params.context,
			configuredBundledPluginId,
			hasCustomPluginRisk: await getHasCustomWebProviderRisk(contract)
		}));
		if (!configuredBundledPluginId && rawProvider) configuredBundledPluginId = await resolveManifestOwner();
		let allProviders = await resolveProviders();
		if (rawProvider && configuredBundledPluginIdHint && configuredBundledPluginId && !allProviders.some((provider) => provider.id === rawProvider)) configuredBundledPluginId = void 0;
		if (rawProvider && !configuredBundledPluginId && !allProviders.some((provider) => provider.id === rawProvider)) {
			configuredBundledPluginId = await resolveManifestOwner();
			allProviders = await resolveProviders();
		}
		const hasConfiguredSurface = Boolean(toolConfig) || allProviders.some((provider) => !(isSearch && provider.requiresCredential === false) && (readConfiguredProviderCredential({
			provider,
			config: params.sourceConfig,
			toolConfig
		}) !== void 0 || provider.getConfiguredCredentialFallback?.(params.sourceConfig)?.value !== void 0));
		const providers = hasConfiguredSurface || !isSearch ? allProviders : [];
		const configuredProvider = rawProvider && (isSearch ? providers : allProviders).some((provider) => provider.id === rawProvider) ? rawProvider : void 0;
		const invalidConfiguredProvider = isSearch && Boolean(rawProvider) && !configuredProvider;
		if (rawProvider && !configuredProvider) {
			const diagnostic = {
				code: isSearch ? "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT" : "WEB_FETCH_PROVIDER_INVALID_AUTODETECT",
				message: invalidConfiguredProvider ? `tools.web.${kind}.provider is "${rawProvider}". No provider will be selected.` : `tools.web.${kind}.provider is "${rawProvider}". Falling back to auto-detect precedence.`,
				path: `tools.web.${kind}.provider`
			};
			diagnostics.push(diagnostic);
			metadata.diagnostics.push(diagnostic);
			pushWarning(params.context, {
				code: diagnostic.code,
				path: diagnostic.path,
				message: diagnostic.message
			});
		}
		const selection = await resolveRuntimeWebProviderSelection({
			kind,
			toolConfig,
			enabled: hasConfiguredSurface && !invalidConfiguredProvider && toolConfig?.enabled !== false,
			providers,
			configuredProvider,
			metadata,
			diagnostics,
			sourceConfig: params.sourceConfig,
			resolvedConfig: params.resolvedConfig,
			context: params.context,
			defaults,
			allowUnavailableProviders: params.allowUnavailableSecretOwners,
			onUnavailableProviders: (error) => {
				attachWebProviderFailures(error.unavailableProviders, providerFailuresByRefKey);
				associateWebProviderResolutionError({
					kind,
					config: params.sourceConfig,
					error,
					forceColdRefKeys: params.forceColdRefKeys,
					unavailableProviders: error.unavailableProviders
				});
			},
			resolveSecretInput: (input) => resolveSecretInputWithEnvFallback({
				...input,
				kind,
				sourceConfig: params.sourceConfig,
				context: params.context,
				defaults,
				providerFailuresByRefKey,
				forceColdRefKeys: params.forceColdRefKeys
			})
		});
		attachWebProviderFailures(selection.unavailableProviders, providerFailuresByRefKey);
		collectUnavailableWebProviders({
			kind,
			result: selection,
			context: params.context,
			sourceConfig: params.sourceConfig,
			metadata,
			degradedOwners,
			forceColdRefKeys: params.forceColdRefKeys
		});
		for (const owner of selection.secretOwners) secretOwners.push(toWebSecretOwnerRefState(kind, owner));
	}
	return result;
}
//#endregion
export { resolveRuntimeWebTools as t };

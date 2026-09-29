import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { a as createLazyRuntimeSurface, i as createLazyRuntimeNamedExport } from "./lazy-runtime-BPNHa36e.mjs";
import { _ as secretRefKey } from "./ref-contract-BVi3ykLT.mjs";
import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import "./shared-BUXrUFz5.mjs";
import { d as pushWarning, g as digestRuntimeWebOwnerContract, m as isExpectedResolvedSecretValue, u as pushInactiveSurfaceWarning } from "./runtime-shared-Bpp2PLaL.mjs";
import { i as setPathExistingStrict } from "./path-utils-C3EgzLrx.mjs";
import { t as hasCredentialBearingObjectValue } from "./runtime-secret-scan-Do27Xfev.mjs";
import { a as isProviderScopedSecretResolutionError, t as describeSecretResolutionError } from "./resolve-errors-DYenvPyo.mjs";
import { r as resolveSecretRefValues } from "./resolve-C3ItmvEK.mjs";
import { i as associateSecretResolutionErrorOwners, l as isRetryableSecretDegradationReason } from "./runtime-degraded-state-DVMYGogL.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { u as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-CtZtwiOt.mjs";
import { n as sortPluginEntriesForAutoDetect } from "./plugin-entry-order-DxrT0ucv.mjs";
import { n as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, r as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts.explicit-BBXzSv64.mjs";
import { i as warnDegradedSecretOwner, t as classifySecretOwnerDegradationState } from "./runtime-owner-assignments-BYV-lno2.mjs";
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
const loadResolveManifestContractOwnerPluginId = createLazyRuntimeNamedExport(() => import("./runtime-web-tools-manifest.runtime.js"), "resolveManifestContractOwnerPluginId");
function pushInactiveProviderCredentialWarnings(params) {
	for (const provider of params.selection.providers) {
		if (provider.id === params.skipProviderId) continue;
		const value = params.selection.readConfiguredCredential({
			provider,
			config: params.selection.sourceConfig,
			toolConfig: params.selection.toolConfig
		});
		if (!params.selection.hasConfiguredSecretRef(value, params.selection.defaults)) continue;
		for (const path of params.selection.inactivePathsForProvider(provider)) pushInactiveSurfaceWarning({
			context: params.selection.context,
			path,
			details: params.details
		});
	}
}
function normalizeKnownProvider(value, providers) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	if (providers.some((provider) => provider.id === normalized)) return normalized;
}
/**
* Returns whether a configured value or sibling ref field contains a SecretRef.
*/
function hasConfiguredSecretRef(value, defaults) {
	return Boolean(resolveSecretInputRef({
		value,
		defaults
	}).ref);
}
function getProviderEnvVars(provider) {
	return "envVars" in provider && Array.isArray(provider.envVars) ? provider.envVars : [];
}
function setResolvedCredentialPath(params) {
	const pathSegments = params.path.split(".").map((segment) => segment.trim()).filter((segment) => segment.length > 0);
	if (pathSegments.length === 0) return;
	try {
		setPathExistingStrict(params.resolvedConfig, pathSegments, params.value);
	} catch {}
}
/**
* Resolves available providers, configured provider validity, and whether the surface is active.
*/
async function resolveRuntimeWebProviderSurface(params) {
	let configuredBundledPluginId = params.configuredBundledPluginIdHint;
	if (!configuredBundledPluginId && params.rawProvider) configuredBundledPluginId = (await loadResolveManifestContractOwnerPluginId())({
		contract: params.contract,
		value: params.rawProvider,
		origin: "bundled",
		config: params.sourceConfig,
		env: {
			...process.env,
			...params.context.env
		},
		manifestRecords: params.context.manifestRegistry?.plugins
	});
	let allProviders = params.sortProviders(await params.resolveProviders({ configuredBundledPluginId }));
	if (params.rawProvider && params.configuredBundledPluginIdHint && configuredBundledPluginId && !allProviders.some((provider) => provider.id === params.rawProvider)) configuredBundledPluginId = void 0;
	if (params.rawProvider && !configuredBundledPluginId && !allProviders.some((provider) => provider.id === params.rawProvider)) {
		configuredBundledPluginId = (await loadResolveManifestContractOwnerPluginId())({
			contract: params.contract,
			value: params.rawProvider,
			origin: "bundled",
			config: params.sourceConfig,
			env: {
				...process.env,
				...params.context.env
			},
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		allProviders = params.sortProviders(await params.resolveProviders({ configuredBundledPluginId }));
	}
	const hasConfiguredSurface = Boolean(params.toolConfig) || allProviders.some((provider) => {
		if (params.ignoreKeylessProvidersForConfiguredSurface && provider.requiresCredential === false) return false;
		return params.readConfiguredCredential({
			provider,
			config: params.sourceConfig,
			toolConfig: params.toolConfig
		}) !== void 0 || params.readConfiguredCredentialFallback?.({
			provider,
			config: params.sourceConfig,
			toolConfig: params.toolConfig
		})?.value !== void 0;
	});
	const providers = hasConfiguredSurface || !params.emptyProvidersWhenSurfaceMissing ? allProviders : [];
	const configuredProvider = normalizeKnownProvider(params.rawProvider, params.normalizeConfiguredProviderAgainstActiveProviders ? providers : allProviders);
	const invalidConfiguredProvider = params.normalizeConfiguredProviderAgainstActiveProviders === true && Boolean(params.rawProvider) && !configuredProvider;
	if (params.rawProvider && !configuredProvider) {
		const diagnostic = {
			code: params.invalidAutoDetectCode,
			message: invalidConfiguredProvider ? `${params.providerPath} is "${params.rawProvider}". No provider will be selected.` : `${params.providerPath} is "${params.rawProvider}". Falling back to auto-detect precedence.`,
			path: params.providerPath
		};
		params.diagnostics.push(diagnostic);
		params.metadataDiagnostics.push(diagnostic);
		pushWarning(params.context, {
			code: params.invalidAutoDetectCode,
			path: params.providerPath,
			message: diagnostic.message
		});
	}
	return {
		providers,
		configuredProvider,
		enabled: hasConfiguredSurface && !invalidConfiguredProvider && (!isRecord(params.toolConfig) || params.toolConfig.enabled !== false),
		hasConfiguredSurface
	};
}
/**
* Selects a configured or auto-detected provider and materializes its resolved credential.
*/
async function resolveRuntimeWebProviderSelection(params) {
	if (params.configuredProvider) {
		params.metadata.providerConfigured = params.configuredProvider;
		params.metadata.providerSource = "configured";
	}
	const unavailableProviders = [];
	const resolveProviderContractDigest = (providerId) => digestRuntimeWebOwnerContract({
		...params,
		providerId
	});
	let selectedProvider;
	let selectedPath;
	let selectedResolution;
	if (params.enabled) {
		const candidates = params.configuredProvider ? params.providers.filter((provider) => provider.id === params.configuredProvider) : params.providers;
		const unresolvedWithoutFallback = [];
		let keylessFallbackProvider;
		for (const provider of candidates) {
			const contractDigest = resolveProviderContractDigest(provider.id);
			const isKeyless = provider.requiresCredential === false;
			if (isKeyless) {
				if (!params.configuredProvider && !params.allowKeylessAutoSelect) continue;
				if (params.deferKeylessFallback && !params.configuredProvider) {
					keylessFallbackProvider ||= provider;
					continue;
				}
			}
			const path = params.inactivePathsForProvider(provider)[0] ?? "";
			const value = params.readConfiguredCredential({
				provider,
				config: params.sourceConfig,
				toolConfig: params.toolConfig
			});
			const resolution = await params.resolveSecretInput({
				providerId: provider.id,
				value,
				path,
				envVars: getProviderEnvVars(provider),
				contractDigest
			});
			let selectedCandidatePath = path;
			let selectedCandidateResolution = resolution;
			if (!resolution.value && !resolution.secretRefConfigured) {
				const fallback = params.readConfiguredCredentialFallback?.({
					provider,
					config: params.sourceConfig,
					toolConfig: params.toolConfig
				});
				if (fallback?.value !== void 0) {
					selectedCandidatePath = fallback.path;
					selectedCandidateResolution = await params.resolveSecretInput({
						providerId: provider.id,
						value: fallback.value,
						path: fallback.path,
						envVars: getProviderEnvVars(provider),
						contractDigest
					});
				}
			} else if (resolution.source === "env" && !resolution.secretRefConfigured) {
				const fallback = params.readConfiguredCredentialFallback?.({
					provider,
					config: params.sourceConfig,
					toolConfig: params.toolConfig
				});
				if (fallback?.value !== void 0 && params.hasConfiguredSecretRef(fallback.value, params.defaults)) {
					const fallbackResolution = await params.resolveSecretInput({
						providerId: provider.id,
						value: fallback.value,
						path: fallback.path,
						envVars: getProviderEnvVars(provider),
						contractDigest
					});
					if (fallbackResolution.source === "secretRef" && fallbackResolution.value) setResolvedCredentialPath({
						resolvedConfig: params.resolvedConfig,
						path: fallback.path,
						value: fallbackResolution.value
					});
				}
			}
			if (selectedCandidateResolution.secretRefConfigured && !selectedCandidateResolution.value && selectedCandidateResolution.unresolvedRefReason) unresolvedWithoutFallback.push({
				provider: provider.id,
				path: selectedCandidatePath,
				ref: selectedCandidateResolution.secretRef,
				refKey: selectedCandidateResolution.secretRefKey,
				reason: selectedCandidateResolution.unresolvedRefReason,
				contractDigest,
				restoreResolvedValue: (resolvedValue) => params.setResolvedCredential({
					resolvedConfig: params.resolvedConfig,
					provider,
					value: resolvedValue
				})
			});
			if (isKeyless && selectedCandidateResolution.secretRefConfigured && !selectedCandidateResolution.value) continue;
			if (isKeyless && !params.configuredProvider && !selectedCandidateResolution.value) continue;
			if (params.configuredProvider || isKeyless) {
				selectedProvider = provider.id;
				selectedPath = selectedCandidatePath;
				selectedResolution = selectedCandidateResolution;
				if (selectedCandidateResolution.value) {
					setResolvedCredentialPath({
						resolvedConfig: params.resolvedConfig,
						path: selectedCandidatePath,
						value: selectedCandidateResolution.value
					});
					params.setResolvedCredential({
						resolvedConfig: params.resolvedConfig,
						provider,
						value: selectedCandidateResolution.value
					});
				}
				break;
			}
			if (selectedCandidateResolution.value) {
				selectedProvider = provider.id;
				selectedPath = selectedCandidatePath;
				selectedResolution = selectedCandidateResolution;
				setResolvedCredentialPath({
					resolvedConfig: params.resolvedConfig,
					path: selectedCandidatePath,
					value: selectedCandidateResolution.value
				});
				params.setResolvedCredential({
					resolvedConfig: params.resolvedConfig,
					provider,
					value: selectedCandidateResolution.value
				});
				break;
			}
		}
		if (!selectedProvider && keylessFallbackProvider && params.allowKeylessAutoSelect) {
			selectedProvider = keylessFallbackProvider.id;
			selectedResolution = {
				source: "missing",
				secretRefConfigured: false
			};
		}
		const recordUnresolvedNoFallback = (unresolved) => {
			const diagnostic = {
				code: params.noFallbackCode,
				message: unresolved.reason,
				path: unresolved.path
			};
			params.diagnostics.push(diagnostic);
			params.metadata.diagnostics.push(diagnostic);
			pushWarning(params.context, {
				code: params.noFallbackCode,
				path: unresolved.path,
				message: unresolved.reason
			});
		};
		const failUnresolvedNoFallback = (unresolved, related = [unresolved]) => {
			recordUnresolvedNoFallback(unresolved);
			const relatedUnavailableProviders = related.flatMap((entry) => entry.ref && entry.refKey ? [{
				providerId: entry.provider,
				path: entry.path,
				ref: entry.ref,
				refKey: entry.refKey,
				reason: entry.reason,
				contractDigest: entry.contractDigest,
				restoreResolvedValue: entry.restoreResolvedValue
			}] : []);
			if (relatedUnavailableProviders.length > 0) {
				const error = new RuntimeWebProviderUnavailableError(params.noFallbackCode, unresolved.reason, relatedUnavailableProviders);
				params.onUnavailableProviders?.(error);
				throw error;
			}
			throw new Error(`[${params.noFallbackCode}] ${unresolved.reason}`);
		};
		if (params.configuredProvider) {
			const unresolved = unresolvedWithoutFallback[0];
			if (unresolved) {
				const refKey = unresolved.refKey;
				const ref = unresolved.ref;
				if (refKey && ref) {
					const unavailable = {
						providerId: params.configuredProvider,
						path: unresolved.path,
						ref,
						refKey,
						reason: unresolved.reason,
						contractDigest: unresolved.contractDigest,
						restoreResolvedValue: unresolved.restoreResolvedValue
					};
					if (params.allowUnavailableProviders) unavailableProviders.push(unavailable);
					else failUnresolvedNoFallback(unresolved);
				} else failUnresolvedNoFallback(unresolved);
			}
		} else {
			if (!selectedProvider && unresolvedWithoutFallback.length > 0) {
				const firstUnresolved = expectDefined(unresolvedWithoutFallback[0], "unresolved without fallback entry at 0");
				if (!params.allowUnavailableProviders) failUnresolvedNoFallback(firstUnresolved, unresolvedWithoutFallback);
				const unavailable = unresolvedWithoutFallback.flatMap((entry) => entry.ref && entry.refKey ? [{
					providerId: entry.provider,
					path: entry.path,
					ref: entry.ref,
					refKey: entry.refKey,
					reason: entry.reason,
					contractDigest: entry.contractDigest,
					restoreResolvedValue: entry.restoreResolvedValue
				}] : []);
				if (unavailable.length !== unresolvedWithoutFallback.length) failUnresolvedNoFallback(firstUnresolved, unresolvedWithoutFallback);
				unavailableProviders.push(...unavailable);
			}
			if (selectedProvider) {
				const selectedDetails = params.providers.find((entry) => entry.id === selectedProvider)?.requiresCredential === false ? `${params.scopePath} auto-detected keyless provider "${selectedProvider}".` : `${params.scopePath} auto-detected provider "${selectedProvider}" from available credentials.`;
				const diagnostic = {
					code: params.autoDetectSelectedCode,
					message: selectedDetails,
					path: `${params.scopePath}.provider`
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
			if (provider && params.mergeRuntimeMetadata) await params.mergeRuntimeMetadata({
				provider,
				metadata: params.metadata,
				toolConfig: params.toolConfig,
				selectedResolution
			});
		}
	}
	if (params.enabled && !params.configuredProvider && params.metadata.selectedProvider) pushInactiveProviderCredentialWarnings({
		selection: params,
		skipProviderId: params.metadata.selectedProvider,
		details: `${params.scopePath} auto-detected provider is "${params.metadata.selectedProvider}".`
	});
	else if (params.toolConfig && !params.enabled) pushInactiveProviderCredentialWarnings({
		selection: params,
		details: `${params.scopePath} is disabled.`
	});
	if (params.enabled && params.toolConfig && params.configuredProvider) pushInactiveProviderCredentialWarnings({
		selection: params,
		skipProviderId: params.configuredProvider,
		details: `${params.scopePath}.provider is "${params.configuredProvider}".`
	});
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
function ensureConfigObject(target, key) {
	const current = target[key];
	if (isRecord(current)) return current;
	const next = {};
	target[key] = next;
	return next;
}
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
function inferExactBundledPluginScopedWebToolConfigOwner(params) {
	const entry = params.config.plugins?.entries?.[params.pluginId];
	if (!isRecord(entry) || entry.enabled === false) return;
	const pluginConfig = isRecord(entry.config) ? entry.config : void 0;
	return isRecord(pluginConfig?.[params.key]) ? params.pluginId : void 0;
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
	if (plugins.entries && Object.keys(plugins.entries).some(hasNonBundledPluginId)) return true;
	return false;
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
	const { ref } = resolveSecretInputRef({
		value: params.value,
		defaults: params.defaults
	});
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
	let resolvedFromRef;
	let unresolvedRefReason;
	if (params.restrictEnvRefsToEnvVars === true && ref.source === "env" && !params.envVars.includes(ref.id)) throw new Error(`${params.path} SecretRef is not allowed for this provider.`);
	else try {
		const resolvedValue = (await resolveSecretRefValues([ref], {
			config: params.sourceConfig,
			env: params.context.env,
			cache: params.context.cache,
			manifestRegistry: params.context.manifestRegistry
		})).get(secretRefKey(ref));
		if (!isExpectedResolvedSecretValue(resolvedValue, "string")) {
			const error = /* @__PURE__ */ new Error(`${params.path} resolved to a non-string or empty value.`);
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
					reason: "resolved secret value was invalid",
					contractDigest: params.contractDigest
				}]
			});
			throw error;
		}
		resolvedFromRef = normalizeSecretInput(resolvedValue);
	} catch (error) {
		const reason = describeSecretResolutionError(error);
		if (!reason || !isRetryableSecretDegradationReason(reason)) {
			if (reason) associateWebProviderResolutionError({
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
			throw error;
		}
		unresolvedRefReason = reason;
		if (isProviderScopedSecretResolutionError(error)) params.providerFailuresByRefKey.set(secretRefKey(ref), {
			source: error.source,
			provider: error.provider
		});
	}
	if (resolvedFromRef) return {
		value: resolvedFromRef,
		source: "secretRef",
		secretRefConfigured: true,
		secretRef: ref,
		secretRefKey: secretRefKey(ref)
	};
	return {
		source: "missing",
		secretRef: ref,
		secretRefKey: secretRefKey(ref),
		unresolvedRefReason,
		secretRefConfigured: true
	};
}
function setResolvedWebSearchApiKey(params) {
	if (params.provider.setConfiguredCredentialValue) {
		params.provider.setConfiguredCredentialValue(params.resolvedConfig, params.value);
		return;
	}
	const search = ensureConfigObject(ensureConfigObject(ensureConfigObject(params.resolvedConfig, "tools"), "web"), "search");
	params.provider.setCredentialValue(search, params.value);
}
async function resolveBundledWebSearchProviders(params) {
	const env = {
		...process.env,
		...params.context.env
	};
	const onlyPluginIds = params.configuredBundledPluginId !== void 0 ? [params.configuredBundledPluginId] : params.onlyPluginIds && params.onlyPluginIds.length > 0 ? sortUniqueStrings(params.onlyPluginIds) : void 0;
	if (onlyPluginIds && onlyPluginIds.length > 0) {
		const bundled = resolveBundledExplicitWebSearchProvidersFromPublicArtifacts({
			onlyPluginIds,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		if (bundled && bundled.length > 0) return bundled;
		const { resolvePluginWebSearchProviders } = await loadRuntimeWebToolsFallbackProviders();
		return resolvePluginWebSearchProviders({
			config: params.sourceConfig,
			env,
			onlyPluginIds,
			origin: "bundled",
			manifestRecords: params.context.manifestRegistry?.plugins
		});
	}
	if (!params.hasCustomWebSearchPluginRisk) {
		const { resolveBundledWebSearchProvidersFromPublicArtifacts } = await loadRuntimeWebToolsPublicArtifacts();
		const bundled = resolveBundledWebSearchProvidersFromPublicArtifacts({
			config: params.sourceConfig,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		if (bundled && bundled.length > 0) return bundled;
		const { resolvePluginWebSearchProviders } = await loadRuntimeWebToolsFallbackProviders();
		return resolvePluginWebSearchProviders({
			config: params.sourceConfig,
			env,
			origin: "bundled",
			manifestRecords: params.context.manifestRegistry?.plugins
		});
	}
	const { resolvePluginWebSearchProviders } = await loadRuntimeWebToolsFallbackProviders();
	return resolvePluginWebSearchProviders({
		config: params.sourceConfig,
		env,
		manifestRecords: params.context.manifestRegistry?.plugins
	});
}
async function resolveBundledWebFetchProviders(params) {
	const env = {
		...process.env,
		...params.context.env
	};
	if (params.configuredBundledPluginId) {
		const bundled = resolveBundledExplicitWebFetchProvidersFromPublicArtifacts({
			onlyPluginIds: [params.configuredBundledPluginId],
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		if (bundled && bundled.length > 0) return bundled;
		const { resolvePluginWebFetchProviders } = await loadRuntimeWebToolsFallbackProviders();
		return resolvePluginWebFetchProviders({
			config: params.sourceConfig,
			env,
			onlyPluginIds: [params.configuredBundledPluginId],
			origin: "bundled",
			manifestRecords: params.context.manifestRegistry?.plugins
		});
	}
	if (!params.hasCustomWebFetchPluginRisk) {
		const { resolveBundledWebFetchProvidersFromPublicArtifacts } = await loadRuntimeWebToolsPublicArtifacts();
		const bundled = resolveBundledWebFetchProvidersFromPublicArtifacts({
			config: params.sourceConfig,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		if (bundled && bundled.length > 0) return bundled;
		const { resolvePluginWebFetchProviders } = await loadRuntimeWebToolsFallbackProviders();
		return resolvePluginWebFetchProviders({
			config: params.sourceConfig,
			env,
			origin: "bundled",
			manifestRecords: params.context.manifestRegistry?.plugins
		});
	}
	const { resolvePluginWebFetchProviders } = await loadRuntimeWebToolsFallbackProviders();
	return resolvePluginWebFetchProviders({
		config: params.sourceConfig,
		env,
		sandboxed: true,
		manifestRecords: params.context.manifestRegistry?.plugins
	});
}
function readConfiguredProviderCredential(params) {
	return params.provider.getConfiguredCredentialValue?.(params.config) ?? params.provider.getCredentialValue(params.search);
}
function inactivePathsForProvider(provider) {
	if (provider.requiresCredential === false) return [];
	return provider.inactiveSecretPaths?.length ? provider.inactiveSecretPaths : [provider.credentialPath];
}
function setResolvedWebFetchApiKey(params) {
	if (params.provider.setConfiguredCredentialValue) {
		params.provider.setConfiguredCredentialValue(params.resolvedConfig, params.value);
		return;
	}
	const fetch = ensureConfigObject(ensureConfigObject(ensureConfigObject(params.resolvedConfig, "tools"), "web"), "fetch");
	params.provider.setCredentialValue(fetch, params.value);
}
function readConfiguredFetchProviderCredential(params) {
	return params.provider.getConfiguredCredentialValue?.(params.config) ?? params.provider.getCredentialValue(params.fetch);
}
function inactivePathsForFetchProvider(provider) {
	return provider.inactiveSecretPaths?.length ? provider.inactiveSecretPaths : provider.credentialPath ? [provider.credentialPath] : [];
}
/**
* Resolves runtime web search/fetch provider metadata and writes selected credentials into a
* cloned runtime config without mutating the source config.
*/
/** Resolves web search/fetch secret metadata from config, plugins, and fallback runtime providers. */
async function resolveRuntimeWebTools(params) {
	const defaults = params.sourceConfig.secrets?.defaults;
	const diagnostics = [];
	const degradedOwners = [];
	const secretOwners = [];
	const providerFailuresByRefKey = /* @__PURE__ */ new Map();
	const finish = (metadata) => ({
		metadata,
		degradedOwners,
		secretOwners
	});
	const env = {
		...process.env,
		...params.context.env
	};
	const sourceTools = isRecord(params.sourceConfig.tools) ? params.sourceConfig.tools : void 0;
	const sourceWeb = isRecord(sourceTools?.web) ? sourceTools.web : void 0;
	let hasCustomWebSearchRisk;
	const getHasCustomWebSearchRisk = () => {
		hasCustomWebSearchRisk ??= hasCustomWebProviderPluginRisk({
			contract: "webSearchProviders",
			config: params.sourceConfig,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		return hasCustomWebSearchRisk;
	};
	let hasCustomWebFetchRisk;
	const getHasCustomWebFetchRisk = () => {
		hasCustomWebFetchRisk ??= hasCustomWebProviderPluginRisk({
			contract: "webFetchProviders",
			config: params.sourceConfig,
			env,
			manifestRecords: params.context.manifestRegistry?.plugins
		});
		return hasCustomWebFetchRisk;
	};
	const hasPluginWebSearchConfig = hasPluginScopedWebToolConfig(params.sourceConfig, "webSearch");
	const hasPluginWebFetchConfig = hasPluginScopedWebToolConfig(params.sourceConfig, "webFetch");
	if (!sourceWeb && !hasPluginWebSearchConfig && !hasPluginWebFetchConfig) return finish({
		search: {
			providerSource: "none",
			diagnostics: []
		},
		fetch: {
			providerSource: "none",
			diagnostics: []
		},
		diagnostics
	});
	const search = isRecord(sourceWeb?.search) ? sourceWeb.search : void 0;
	const fetch = isRecord(sourceWeb?.fetch) ? sourceWeb.fetch : void 0;
	if (!search && !fetch && !hasPluginWebSearchConfig && !hasPluginWebFetchConfig) return finish({
		search: {
			providerSource: "none",
			diagnostics: []
		},
		fetch: {
			providerSource: "none",
			diagnostics: []
		},
		diagnostics
	});
	const rawProvider = normalizeLowercaseStringOrEmpty(search?.provider);
	let configuredBundledWebSearchPluginIdHint;
	if (hasPluginWebSearchConfig && !await getHasCustomWebSearchRisk()) {
		if (rawProvider) configuredBundledWebSearchPluginIdHint = inferExactBundledPluginScopedWebToolConfigOwner({
			config: params.sourceConfig,
			key: "webSearch",
			pluginId: rawProvider
		});
		configuredBundledWebSearchPluginIdHint ??= inferSingleBundledPluginScopedWebToolConfigOwner(params.sourceConfig, "webSearch");
	}
	const searchMetadata = {
		providerSource: "none",
		diagnostics: []
	};
	if (search || hasPluginWebSearchConfig) {
		const searchSurface = await resolveRuntimeWebProviderSurface({
			contract: "webSearchProviders",
			rawProvider,
			providerPath: "tools.web.search.provider",
			toolConfig: search,
			diagnostics,
			metadataDiagnostics: searchMetadata.diagnostics,
			invalidAutoDetectCode: "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT",
			sourceConfig: params.sourceConfig,
			context: params.context,
			configuredBundledPluginIdHint: configuredBundledWebSearchPluginIdHint,
			resolveProviders: async ({ configuredBundledPluginId }) => resolveBundledWebSearchProviders({
				sourceConfig: params.sourceConfig,
				context: params.context,
				configuredBundledPluginId,
				hasCustomWebSearchPluginRisk: await getHasCustomWebSearchRisk()
			}),
			sortProviders: sortPluginEntriesForAutoDetect,
			readConfiguredCredential: ({ provider, config, toolConfig }) => readConfiguredProviderCredential({
				provider,
				config,
				search: toolConfig
			}),
			readConfiguredCredentialFallback: ({ provider, config }) => provider.getConfiguredCredentialFallback?.(config),
			ignoreKeylessProvidersForConfiguredSurface: true,
			emptyProvidersWhenSurfaceMissing: true,
			normalizeConfiguredProviderAgainstActiveProviders: true
		});
		const searchSelection = await resolveRuntimeWebProviderSelection({
			scopePath: "tools.web.search",
			toolConfig: search,
			enabled: searchSurface.enabled,
			providers: searchSurface.providers,
			configuredProvider: searchSurface.configuredProvider,
			metadata: searchMetadata,
			diagnostics,
			sourceConfig: params.sourceConfig,
			resolvedConfig: params.resolvedConfig,
			context: params.context,
			defaults,
			allowKeylessAutoSelect: false,
			deferKeylessFallback: true,
			allowUnavailableProviders: params.allowUnavailableSecretOwners,
			onUnavailableProviders: (error) => {
				attachWebProviderFailures(error.unavailableProviders, providerFailuresByRefKey);
				associateWebProviderResolutionError({
					kind: "search",
					config: params.sourceConfig,
					error,
					forceColdRefKeys: params.forceColdRefKeys,
					unavailableProviders: error.unavailableProviders
				});
			},
			noFallbackCode: "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK",
			autoDetectSelectedCode: "WEB_SEARCH_AUTODETECT_SELECTED",
			readConfiguredCredential: ({ provider, config, toolConfig }) => readConfiguredProviderCredential({
				provider,
				config,
				search: toolConfig
			}),
			readConfiguredCredentialFallback: ({ provider, config }) => provider.getConfiguredCredentialFallback?.(config),
			resolveSecretInput: ({ providerId, value, path, envVars, contractDigest }) => resolveSecretInputWithEnvFallback({
				kind: "search",
				providerId,
				sourceConfig: params.sourceConfig,
				context: params.context,
				defaults,
				value,
				path,
				envVars,
				contractDigest,
				providerFailuresByRefKey,
				forceColdRefKeys: params.forceColdRefKeys
			}),
			setResolvedCredential: ({ resolvedConfig, provider, value }) => setResolvedWebSearchApiKey({
				resolvedConfig,
				provider,
				value
			}),
			inactivePathsForProvider,
			hasConfiguredSecretRef,
			mergeRuntimeMetadata: async ({ provider, metadata, toolConfig, selectedResolution }) => {
				if (!provider.resolveRuntimeMetadata) return;
				Object.assign(metadata, await provider.resolveRuntimeMetadata({
					config: params.sourceConfig,
					searchConfig: toolConfig,
					runtimeMetadata: metadata,
					resolvedCredential: selectedResolution ? {
						value: selectedResolution.value,
						source: selectedResolution.source,
						fallbackEnvVar: selectedResolution.fallbackEnvVar
					} : void 0
				}));
			}
		});
		attachWebProviderFailures(searchSelection.unavailableProviders, providerFailuresByRefKey);
		collectUnavailableWebProviders({
			kind: "search",
			result: searchSelection,
			context: params.context,
			sourceConfig: params.sourceConfig,
			metadata: searchMetadata,
			degradedOwners,
			forceColdRefKeys: params.forceColdRefKeys
		});
		for (const owner of searchSelection.secretOwners) secretOwners.push(toWebSecretOwnerRefState("search", owner));
	}
	const rawFetchProvider = normalizeLowercaseStringOrEmpty(fetch?.provider);
	const fetchMetadata = {
		providerSource: "none",
		diagnostics: []
	};
	if (needsRuntimeWebFetchProviderDiscovery({
		fetch,
		rawProvider: rawFetchProvider,
		hasPluginWebFetchConfig,
		defaults
	})) {
		const fetchSurface = await resolveRuntimeWebProviderSurface({
			contract: "webFetchProviders",
			rawProvider: rawFetchProvider,
			providerPath: "tools.web.fetch.provider",
			toolConfig: fetch,
			diagnostics,
			metadataDiagnostics: fetchMetadata.diagnostics,
			invalidAutoDetectCode: "WEB_FETCH_PROVIDER_INVALID_AUTODETECT",
			sourceConfig: params.sourceConfig,
			context: params.context,
			resolveProviders: async ({ configuredBundledPluginId }) => resolveBundledWebFetchProviders({
				sourceConfig: params.sourceConfig,
				context: params.context,
				configuredBundledPluginId,
				hasCustomWebFetchPluginRisk: await getHasCustomWebFetchRisk()
			}),
			sortProviders: sortPluginEntriesForAutoDetect,
			readConfiguredCredential: ({ provider, config, toolConfig }) => readConfiguredFetchProviderCredential({
				provider,
				config,
				fetch: toolConfig
			}),
			readConfiguredCredentialFallback: ({ provider, config }) => provider.getConfiguredCredentialFallback?.(config)
		});
		const fetchSelection = await resolveRuntimeWebProviderSelection({
			scopePath: "tools.web.fetch",
			toolConfig: fetch,
			enabled: fetchSurface.enabled,
			providers: fetchSurface.providers,
			configuredProvider: fetchSurface.configuredProvider,
			metadata: fetchMetadata,
			diagnostics,
			sourceConfig: params.sourceConfig,
			resolvedConfig: params.resolvedConfig,
			context: params.context,
			defaults,
			allowKeylessAutoSelect: true,
			deferKeylessFallback: false,
			allowUnavailableProviders: params.allowUnavailableSecretOwners,
			onUnavailableProviders: (error) => {
				attachWebProviderFailures(error.unavailableProviders, providerFailuresByRefKey);
				associateWebProviderResolutionError({
					kind: "fetch",
					config: params.sourceConfig,
					error,
					forceColdRefKeys: params.forceColdRefKeys,
					unavailableProviders: error.unavailableProviders
				});
			},
			noFallbackCode: "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK",
			autoDetectSelectedCode: "WEB_FETCH_AUTODETECT_SELECTED",
			readConfiguredCredential: ({ provider, config, toolConfig }) => readConfiguredFetchProviderCredential({
				provider,
				config,
				fetch: toolConfig
			}),
			readConfiguredCredentialFallback: ({ provider, config }) => provider.getConfiguredCredentialFallback?.(config),
			resolveSecretInput: ({ providerId, value, path, envVars, contractDigest }) => resolveSecretInputWithEnvFallback({
				kind: "fetch",
				providerId,
				sourceConfig: params.sourceConfig,
				context: params.context,
				defaults,
				value,
				path,
				envVars,
				contractDigest,
				providerFailuresByRefKey,
				restrictEnvRefsToEnvVars: true,
				forceColdRefKeys: params.forceColdRefKeys
			}),
			setResolvedCredential: ({ resolvedConfig, provider, value }) => setResolvedWebFetchApiKey({
				resolvedConfig,
				provider,
				value
			}),
			inactivePathsForProvider: inactivePathsForFetchProvider,
			hasConfiguredSecretRef,
			mergeRuntimeMetadata: async ({ provider, metadata, toolConfig, selectedResolution }) => {
				if (!provider.resolveRuntimeMetadata) return;
				Object.assign(metadata, await provider.resolveRuntimeMetadata({
					config: params.sourceConfig,
					fetchConfig: toolConfig,
					runtimeMetadata: metadata,
					resolvedCredential: selectedResolution ? {
						value: selectedResolution.value,
						source: selectedResolution.source,
						fallbackEnvVar: selectedResolution.fallbackEnvVar
					} : void 0
				}));
			}
		});
		attachWebProviderFailures(fetchSelection.unavailableProviders, providerFailuresByRefKey);
		collectUnavailableWebProviders({
			kind: "fetch",
			result: fetchSelection,
			context: params.context,
			sourceConfig: params.sourceConfig,
			metadata: fetchMetadata,
			degradedOwners,
			forceColdRefKeys: params.forceColdRefKeys
		});
		for (const owner of fetchSelection.secretOwners) secretOwners.push(toWebSecretOwnerRefState("fetch", owner));
	}
	return finish({
		search: searchMetadata,
		fetch: fetchMetadata,
		diagnostics
	});
}
//#endregion
export { resolveRuntimeWebTools as t };

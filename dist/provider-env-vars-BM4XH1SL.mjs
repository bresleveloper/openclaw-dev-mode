import { D as withPluginCache, o as getPluginCache, x as retainPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { n as prepareBundledDiscoveryMode } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { t as createInstalledPluginEnabledPredicate } from "./installed-plugin-index-D0kh4WcK.mjs";
import { r as hasKind } from "./slots-D4OMSTbt.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { t as appendUniqueEnvVarCandidates } from "./env-var-candidates-D_PA36up.mjs";
import { a as isWorkspacePluginAllowedByConfig, o as normalizePluginConfigId, r as resolveProviderAuthAliasMap } from "./provider-auth-aliases-DKt99_dy.mjs";
//#region src/secrets/provider-env-vars.ts
/** Resolves provider environment variable candidates and auth evidence from core/plugin metadata. */
const CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES = {
	anthropic: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
	openai: ["CODEX_API_KEY", "OPENAI_API_KEY"],
	voyage: ["VOYAGE_API_KEY"],
	cerebras: ["CEREBRAS_API_KEY"],
	"anthropic-openai": ["ANTHROPIC_API_KEY"],
	"qwen-dashscope": ["DASHSCOPE_API_KEY"]
};
const CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES = {
	minimax: ["MINIMAX_API_KEY"],
	"minimax-cn": ["MINIMAX_API_KEY"]
};
function isWorkspacePluginTrustedForProviderEnvVars(plugin, config) {
	return isWorkspacePluginAllowedByConfig({
		config,
		isImplicitlyAllowed: (pluginId) => hasKind(plugin.kind, "context-engine") && normalizePluginConfigId(config?.plugins?.slots?.contextEngine) === pluginId,
		plugin
	});
}
function shouldUsePluginProviderEnvVars(plugin, params) {
	if (plugin.origin !== "workspace" || params?.includeUntrustedWorkspacePlugins !== false) return true;
	return isWorkspacePluginTrustedForProviderEnvVars(plugin, params?.config);
}
function shouldUsePluginProviderAuthEvidence(plugin, params) {
	if (plugin.origin !== "workspace") return true;
	return isWorkspacePluginTrustedForProviderEnvVars(plugin, params?.config);
}
function appendUniqueAuthEvidence(target, providerId, evidence) {
	const normalizedProviderId = providerId.trim();
	if (!normalizedProviderId || evidence.length === 0) return;
	const bucket = target[normalizedProviderId] ??= [];
	const seen = new Set(bucket.map((entry) => JSON.stringify(entry)));
	for (const entry of evidence) {
		const key = JSON.stringify(entry);
		if (seen.has(key)) continue;
		seen.add(key);
		bucket.push(entry);
	}
}
function appendUniqueProviderRef(target, providerId) {
	const normalized = normalizeProviderId(providerId);
	if (normalized) target.add(normalized);
}
function findProviderMetadataSnapshot(params, options = {}) {
	if (params?.metadataSnapshot) return params.metadataSnapshot;
	const config = params?.config;
	const env = params?.env ?? process.env;
	let current;
	if (config) current = getCurrentPluginMetadataSnapshot({
		...options,
		config,
		env,
		...params?.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		allowWorkspaceScopedSnapshot: true
	});
	else current = getCurrentPluginMetadataSnapshot({
		...options,
		env,
		...params?.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
		allowWorkspaceScopedSnapshot: true,
		requireDefaultDiscoveryContext: true
	});
	if (current) return current;
	if (options.allowSynchronousPolicyRead === false) return;
	if (config && normalizePluginsConfig(config.plugins).loadPaths.length === 0) {
		const unscopedCurrent = getCurrentPluginMetadataSnapshot({
			env,
			...params?.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		if (unscopedCurrent) return unscopedCurrent;
	}
}
function resolveProviderMetadataSnapshot(params) {
	return findProviderMetadataSnapshot(params) ?? loadPluginMetadataSnapshot({
		config: params?.config ?? {},
		workspaceDir: params?.workspaceDir,
		env: params?.env ?? process.env,
		preferPersisted: false
	});
}
function resolveManifestProviderUsageAuthEnvVarNames(params) {
	const snapshot = resolveProviderMetadataSnapshot(params);
	return uniqueStrings(snapshot.plugins.filter((plugin) => shouldUsePluginProviderEnvVars(plugin, params)).flatMap((plugin) => Object.values(plugin.providerUsageAuthEnvVars ?? {}).flat()));
}
function resolveManifestProviderAuthEnvVarCandidates(params, snapshot, sortedAliases) {
	const candidates = {};
	for (const { plugin, envProviders } of snapshot.owners.providerAuthContributions) {
		if (envProviders.length === 0 || !shouldUsePluginProviderEnvVars(plugin, params)) continue;
		for (const provider of envProviders) appendUniqueEnvVarCandidates(candidates, provider.id, provider.envVars ?? []);
	}
	for (const [alias, target] of sortedAliases) {
		const keys = candidates[target];
		if (keys) appendUniqueEnvVarCandidates(candidates, alias, keys);
	}
	return candidates;
}
function resolveManifestRuntimeAuthFacts(params, snapshot, aliasEntries, sortedAliases) {
	const evidenceByProvider = {};
	const refs = /* @__PURE__ */ new Set();
	const isEnabled = createInstalledPluginEnabledPredicate(snapshot.index.plugins, params?.config, params?.env);
	for (const { plugin, evidenceProviders, fallbackProviderRefs } of snapshot.owners.providerAuthContributions) {
		if (evidenceProviders.length === 0 && fallbackProviderRefs.length === 0) continue;
		if (snapshot.index.plugins.length > 0 && !isEnabled(plugin.id)) continue;
		if (shouldUsePluginProviderAuthEvidence(plugin, params)) for (const provider of evidenceProviders) appendUniqueAuthEvidence(evidenceByProvider, provider.id, provider.authEvidence ?? []);
		for (const providerId of fallbackProviderRefs) refs.add(providerId);
	}
	for (const [alias, target] of sortedAliases) {
		const evidence = evidenceByProvider[target];
		if (evidence) appendUniqueAuthEvidence(evidenceByProvider, alias, evidence);
	}
	for (const [alias, target] of aliasEntries) if (refs.has(target)) appendUniqueProviderRef(refs, alias);
	return {
		authEvidenceMap: evidenceByProvider,
		setupProviderFallbackRefs: [...refs].toSorted((a, b) => a.localeCompare(b))
	};
}
/** Resolves provider auth env-var candidates from core fallbacks and plugin metadata. */
function resolveProviderAuthEnvVarCandidatesCore(params) {
	const snapshot = resolveProviderMetadataSnapshot(params);
	const aliases = resolveProviderAuthAliasMap({
		...params,
		metadataSnapshot: snapshot
	});
	return {
		...resolveManifestProviderAuthEnvVarCandidates(params, snapshot, Object.entries(aliases).toSorted(([left], [right]) => left.localeCompare(right))),
		...CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES
	};
}
/** Resolves all provider auth lookup maps from a single metadata snapshot. */
function resolveProviderAuthLookupMaps(params) {
	const snapshot = resolveProviderMetadataSnapshot(params);
	const lookupParams = {
		...params,
		metadataSnapshot: snapshot
	};
	const aliasMap = resolveProviderAuthAliasMap(lookupParams);
	const aliasEntries = Object.entries(aliasMap);
	const sortedAliases = aliasEntries.toSorted(([left], [right]) => left.localeCompare(right));
	return {
		aliasMap,
		envCandidateMap: {
			...resolveManifestProviderAuthEnvVarCandidates(params, snapshot, sortedAliases),
			...CORE_PROVIDER_AUTH_ENV_VAR_CANDIDATES
		},
		...resolveManifestRuntimeAuthFacts(params, snapshot, aliasEntries, sortedAliases)
	};
}
/** Resolves env vars used by setup, default SecretRefs, and broad secret scrubbing. */
function withSetupEnvOverrides(authCandidates) {
	return {
		...authCandidates,
		...CORE_PROVIDER_SETUP_ENV_VAR_OVERRIDES
	};
}
function createLazyReadonlyRecord(resolve) {
	let cached;
	const getResolved = () => {
		cached ??= resolve();
		return cached;
	};
	return new Proxy({}, {
		get(_target, prop) {
			if (typeof prop !== "string") return;
			return getResolved()[prop];
		},
		has(_target, prop) {
			return typeof prop === "string" && Object.hasOwn(getResolved(), prop);
		},
		ownKeys() {
			return Reflect.ownKeys(getResolved());
		},
		getOwnPropertyDescriptor(_target, prop) {
			if (typeof prop !== "string") return;
			const value = getResolved()[prop];
			if (value === void 0) return;
			return {
				configurable: true,
				enumerable: true,
				value,
				writable: false
			};
		}
	});
}
/**
* Provider env vars used for setup/default secret refs and broad secret
* scrubbing. This can include non-model providers and may intentionally choose
* a different preferred first env var than auth resolution.
*
* Bundled provider auth envs come from plugin manifests. The override map here
* is only for true core/non-plugin providers and a few setup-specific ordering
* overrides where generic onboarding wants a different preferred env var.
*/
const PROVIDER_ENV_VARS = createLazyReadonlyRecord(() => withSetupEnvOverrides(resolveProviderAuthEnvVarCandidatesCore()));
/** Returns known env var candidates for a provider id or alias. */
function getProviderEnvVarsCore(providerId, params) {
	const providerEnvVars = params ? withSetupEnvOverrides(resolveProviderAuthEnvVarCandidatesCore(params)) : PROVIDER_ENV_VARS;
	const envVars = Object.hasOwn(providerEnvVars, providerId) ? providerEnvVars[providerId] : void 0;
	return Array.isArray(envVars) ? [...envVars] : [];
}
/** Lists known provider auth env vars without bridge-only env vars. */
function listKnownProviderAuthEnvVarNamesCore(params) {
	const authCandidates = resolveProviderAuthEnvVarCandidatesCore(params);
	return uniqueStrings([
		...Object.values(authCandidates).flat(),
		...Object.values(withSetupEnvOverrides(authCandidates)).flat(),
		...resolveManifestProviderUsageAuthEnvVarNames(params)
	]);
}
/** Prepare machine-owned discovery facts before deriving the same provider env-name policy. */
async function listKnownProviderAuthEnvVarNamesAsync(params) {
	if (params?.metadataSnapshot) return listKnownProviderAuthEnvVarNamesCore(params);
	const env = cloneEnvWithPlatformSemantics(params?.env ?? process.env);
	const lookup = {
		...params,
		env
	};
	const cache = getPluginCache();
	const release = retainPluginCache(cache);
	try {
		return await withPluginCache(cache, async () => {
			let metadataSnapshot = findProviderMetadataSnapshot(lookup, { allowSynchronousPolicyRead: false });
			if (!metadataSnapshot) {
				(await prepareBundledDiscoveryMode(env))();
				metadataSnapshot = resolveProviderMetadataSnapshot(lookup);
			}
			return listKnownProviderAuthEnvVarNamesCore({
				...lookup,
				metadataSnapshot
			});
		});
	} finally {
		release();
	}
}
/** Lists secret env vars for auditing and cleanup, independently of provider activation. */
function listKnownSecretEnvVarNames(params) {
	return uniqueStrings([
		"GH_TOKEN",
		"GITHUB_TOKEN",
		...Object.values(withSetupEnvOverrides(resolveProviderAuthEnvVarCandidatesCore(params))).flat(),
		...resolveManifestProviderUsageAuthEnvVarNames(params)
	]);
}
/** Returns a copy of an env object with denied keys removed case-insensitively. */
function omitEnvKeysCaseInsensitive(baseEnv, keys) {
	const env = { ...baseEnv };
	const denied = /* @__PURE__ */ new Set();
	for (const key of keys) {
		const normalizedKey = key.trim();
		if (normalizedKey) denied.add(normalizedKey.toUpperCase());
	}
	if (denied.size === 0) return env;
	for (const actualKey of Object.keys(env)) if (denied.has(actualKey.toUpperCase())) delete env[actualKey];
	return env;
}
//#endregion
export { omitEnvKeysCaseInsensitive as a, listKnownSecretEnvVarNames as i, listKnownProviderAuthEnvVarNamesAsync as n, resolveProviderAuthEnvVarCandidatesCore as o, listKnownProviderAuthEnvVarNamesCore as r, resolveProviderAuthLookupMaps as s, getProviderEnvVarsCore as t };

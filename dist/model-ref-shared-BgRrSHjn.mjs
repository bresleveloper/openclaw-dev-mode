import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { a as getActivePluginRegistryWorkspaceDirFromStateCore } from "./runtime-state-C5tDvNBc.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import { i as getPluginRuntimeGatewayRequestScope, n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeStaticProviderModelIdWithPolicies, i as normalizeConfiguredProviderCatalogModelRef, n as normalizeBuiltInProviderModelId, s as stripSelfProviderModelPrefix, t as collectManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-CO2R6uEC.mjs";
import { n as getCurrentPluginMetadataSnapshotRuntime, r as resolvePluginMetadataSnapshotRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { n as matchesDeclaredProviderOwner } from "./provider-owner-index-eVSJvcfU.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
//#region src/plugins/manifest-model-id-normalization.ts
/** Applies manifest-declared model-id normalization policies to provider model refs. */
function resolveManifestModelIdNormalizationPolicies(params = {}) {
	if (params.plugins) return "owners" in params.plugins ? params.plugins.owners.modelIdNormalizationPolicies : collectManifestModelIdNormalizationPolicies(params.plugins);
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromStateCore();
	if (params.config === void 0) {
		const currentSnapshot = getCurrentPluginMetadataSnapshotRuntime({
			env,
			workspaceDir,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		if (currentSnapshot) return currentSnapshot.owners.modelIdNormalizationPolicies;
	}
	const snapshot = resolvePluginMetadataSnapshotRuntime({
		config: params.config ?? {},
		env,
		workspaceDir,
		allowWorkspaceScopedCurrent: true
	});
	return snapshot ? snapshot.owners.modelIdNormalizationPolicies : /* @__PURE__ */ new Map();
}
//#endregion
//#region src/plugins/provider-registry-index.ts
const indexes = resolveGlobalSingleton(Symbol.for("openclaw.providerRegistryIndexes"), () => /* @__PURE__ */ new WeakMap());
/** Registration, contribution copying, and rollback invalidate the mutated collection. */
function invalidateProviderRegistryIndex(providers) {
	indexes.delete(providers);
}
function append(index, ref, position) {
	if (!ref) return;
	const entries = index.get(ref);
	if (entries) entries.push(position);
	else index.set(ref, [position]);
}
/** Candidate facts are cached; eligibility remains a decision of the current caller. */
function getProviderRegistryIndex(providers) {
	let index = indexes.get(providers);
	if (!index) {
		index = {
			ids: /* @__PURE__ */ new Map(),
			refs: /* @__PURE__ */ new Map()
		};
		for (const [position, { provider }] of providers.entries()) {
			const id = normalizeProviderId(provider.id);
			append(index.ids, id, position);
			const refs = new Set([
				provider.id,
				...provider.aliases ?? [],
				...provider.hookAliases ?? []
			].map(normalizeProviderId));
			for (const ref of refs) append(index.refs, ref, position);
		}
		indexes.set(providers, index);
	}
	return index;
}
//#endregion
//#region src/plugins/provider-registry-selection.ts
/** Selects the current provider registration without reading unrelated runtime fields. */
function findProviderRuntimeRegistrationInRegistry(params) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const owners = (scope?.pluginRegistry === params.registry ? scope.declaredProviderOwners : void 0) ?? getPluginRuntimeLoadContextState(params.registry)?.declaredProviderOwners;
	const isOwnerEligible = params.isOwnerEligible ?? ((id) => matchesDeclaredProviderOwner(owners, params.provider, id));
	const literalId = normalizeLowercaseStringOrEmpty(params.provider);
	const providers = params.registry.providers;
	const index = getProviderRegistryIndex(providers);
	const eligible = (position) => isOwnerEligible(providers[position].pluginId);
	let position = index.ids.get(literalId)?.find(eligible);
	if (position === void 0) position = (params.ownerRefs.length === 0 ? index.refs.get(literalId) : [.../* @__PURE__ */ new Set([...index.ids.get(literalId) ?? [], ...params.ownerRefs.flatMap((ref) => index.refs.get(normalizeLowercaseStringOrEmpty(ref)) ?? [])])].toSorted((left, right) => left - right))?.find(eligible);
	return position === void 0 ? void 0 : providers[position];
}
//#endregion
//#region src/agents/provider-model-normalization.runtime.ts
/** Reads prepared provider hooks without activating plugins during model-reference parsing. */
/** Refines an already statically normalized model id through its provider hook. */
function normalizeProviderModelIdWithRuntime(params) {
	const registry = getPluginRuntimeGenerationRegistry() ?? getPluginRegistryForContext();
	if (!registry) return;
	const registration = findProviderRuntimeRegistrationInRegistry({
		registry,
		provider: params.provider,
		ownerRefs: []
	});
	if (!registration || !Object.getOwnPropertyDescriptor(registration.provider, "normalizeModelId")?.enumerable) return;
	const normalizeModelId = registration.provider.normalizeModelId;
	if (!normalizeModelId) return;
	const fields = {
		pluginId: registration.pluginId,
		normalizeModelId
	};
	let deleted;
	const materialize = (key) => {
		if (Object.hasOwn(fields, key) || deleted?.has(key) || !Object.isExtensible(fields)) return;
		if (Object.getOwnPropertyDescriptor(registration.provider, key)?.enumerable) Object.defineProperty(fields, key, {
			value: Reflect.get(registration.provider, key),
			writable: true,
			enumerable: true,
			configurable: true
		});
	};
	const ownKeys = () => {
		const providerKeys = Reflect.ownKeys(registration.provider).filter((key) => !deleted?.has(key) && Object.getOwnPropertyDescriptor(registration.provider, key)?.enumerable);
		for (const key of providerKeys) materialize(key);
		return [...providerKeys, ...Reflect.ownKeys(fields).filter((key) => !providerKeys.includes(key))];
	};
	const normalizer = new Proxy(fields, {
		get(target, key, receiver) {
			materialize(key);
			return Reflect.get(target, key, receiver);
		},
		has(target, key) {
			materialize(key);
			return Reflect.has(target, key);
		},
		getOwnPropertyDescriptor(target, key) {
			materialize(key);
			return Reflect.getOwnPropertyDescriptor(target, key);
		},
		ownKeys,
		deleteProperty(target, key) {
			if (!Reflect.deleteProperty(target, key)) return false;
			(deleted ??= /* @__PURE__ */ new Set()).add(key);
			return true;
		},
		preventExtensions(target) {
			ownKeys();
			return Reflect.preventExtensions(target);
		}
	});
	return normalizeOptionalString(normalizer.normalizeModelId(params.context));
}
//#endregion
//#region src/agents/model-ref-shared.ts
/** Normalize a static provider model ID with built-in and optional manifest policy. */
function normalizeStaticProviderModelId(provider, model, options = {}) {
	const normalizedProvider = normalizeProviderId(provider);
	if (options.allowManifestNormalization === false) return normalizeBuiltInProviderModelId(normalizedProvider, model);
	return normalizeStaticProviderModelIdWithPolicies(normalizedProvider, model, resolveManifestModelIdNormalizationPolicies({ plugins: options.manifestPlugins }));
}
/**
* Captures manifest policies once for repeated static model-id comparisons.
* Lifecycle-prepared callers must not rediscover plugin metadata inside model loops.
*/
function createStaticProviderModelIdNormalizer(options = {}) {
	if (options.allowManifestNormalization === false) return (provider, model) => normalizeBuiltInProviderModelId(normalizeProviderId(provider), model);
	if (options.manifestPlugins) {
		const policies = resolveManifestModelIdNormalizationPolicies({ plugins: options.manifestPlugins });
		return (provider, model) => normalizeStaticProviderModelIdWithPolicies(normalizeProviderId(provider), model, policies);
	}
	return (provider, model) => normalizeStaticProviderModelId(provider, model, options);
}
/** Normalize a configured catalog model ID for comparisons against provider catalogs. */
function normalizeConfiguredProviderCatalogModelId(provider, model, options = {}) {
	return normalizeConfiguredProviderCatalogModelRef(normalizeStaticProviderModelId(provider, model, options));
}
/** Reuses one manifest-policy view across configured model rows in an operation. */
function createConfiguredProviderCatalogModelIdNormalizer(options = {}) {
	let normalizeStatic;
	return (provider, model) => normalizeConfiguredProviderCatalogModelRef((normalizeStatic ??= createStaticProviderModelIdNormalizer(options))(provider, model));
}
function normalizeProviderModelId(provider, model, options) {
	const staticModelId = normalizeStaticProviderModelId(provider, stripSelfProviderModelPrefix(provider, model), options);
	if (options?.allowPluginNormalization === false) return staticModelId;
	return normalizeProviderModelIdWithRuntime({
		provider,
		context: {
			provider,
			modelId: staticModelId
		}
	}) ?? staticModelId;
}
/** Normalize a provider/model pair into a canonical model reference. */
function normalizeModelRef(provider, model, options) {
	const normalizedProvider = normalizeProviderId(provider);
	return {
		provider: normalizedProvider,
		model: normalizeProviderModelId(normalizedProvider, model.trim(), options)
	};
}
/** Return the legacy raw key when it differs from the canonical key. */
function legacyModelKey(provider, model) {
	const providerId = provider.trim();
	const modelId = model.trim();
	if (!providerId || !modelId) return null;
	const rawKey = `${providerId}/${modelId}`;
	return rawKey === modelKey(providerId, modelId) ? null : rawKey;
}
function parseStaticModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	const providerRaw = slash === -1 ? defaultProvider : trimmed.slice(0, slash).trim();
	const modelRaw = slash === -1 ? trimmed : trimmed.slice(slash + 1).trim();
	if (!providerRaw || !modelRaw) return null;
	const provider = normalizeProviderId(providerRaw);
	return {
		provider,
		model: normalizeStaticProviderModelId(provider, modelRaw)
	};
}
/** Resolve an allowlist entry to a canonical provider/model key. */
function resolveStaticAllowlistModelKey(raw, defaultProvider) {
	const parsed = parseStaticModelRef(raw, defaultProvider);
	if (!parsed) return null;
	return modelKey(parsed.provider, parsed.model);
}
/** Preserve literal provider/model refs that already include a provider prefix twice. */
function formatLiteralProviderPrefixedModelRef(provider, modelRef) {
	const providerId = normalizeProviderId(provider);
	const trimmedRef = modelRef.trim();
	if (!providerId || !trimmedRef) return trimmedRef;
	const normalizedRef = normalizeLowercaseStringOrEmpty(trimmedRef);
	const literalPrefix = `${providerId}/${providerId}/`;
	if (normalizedRef.startsWith(literalPrefix)) return trimmedRef;
	return normalizedRef.startsWith(`${providerId}/`) ? `${providerId}/${trimmedRef}` : trimmedRef;
}
//#endregion
export { normalizeConfiguredProviderCatalogModelId as a, resolveStaticAllowlistModelKey as c, invalidateProviderRegistryIndex as d, legacyModelKey as i, normalizeProviderModelIdWithRuntime as l, createStaticProviderModelIdNormalizer as n, normalizeModelRef as o, formatLiteralProviderPrefixedModelRef as r, normalizeStaticProviderModelId as s, createConfiguredProviderCatalogModelIdNormalizer as t, findProviderRuntimeRegistrationInRegistry as u };

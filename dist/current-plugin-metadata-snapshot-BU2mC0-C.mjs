import { D as withPluginCache, T as runOutsidePluginCache, d as getPluginMetadataSnapshotCache, f as getProcessPluginCache, h as invalidatePluginCacheMetadata, m as getScopedPluginCaches, p as getScopedPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { a as runWithPluginExecutionFrame, n as createPluginExecutionFrame, r as getPluginExecutionFrame } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { c as setCurrentPluginMetadataSnapshotState, i as getGatewayPluginMetadataSnapshot, n as currentPluginMetadataConfigIdentityCache, r as getCurrentPluginMetadataSnapshotState, s as selectCurrentPluginMetadataCache } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { t as registerPluginMetadataSnapshotReaders } from "./plugin-metadata-snapshot-readers-NmF34DMg.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { t as listAgentWorkspaceDirs } from "./workspace-dirs-CzkKDKkL.mjs";
import { _ as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-D0kh4WcK.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint, t as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-CYA0dErq.mjs";
//#region src/plugins/plugin-scope.ts
/** Normalizes plugin id scope input into a sorted unique string list. */
function normalizePluginIdScope(ids) {
	if (ids === void 0) return;
	return Array.from(new Set(normalizeStringEntries(ids.filter((id) => typeof id === "string")))).toSorted();
}
/** True when plugin scope was explicitly provided, including an empty scope. */
function hasExplicitPluginIdScope(ids) {
	return ids !== void 0;
}
/** True when plugin scope was explicitly provided with at least one id. */
function hasNonEmptyPluginIdScope(ids) {
	return ids !== void 0 && ids.length > 0;
}
/** Creates a lookup set for explicit plugin scope, or null when unscoped. */
function createPluginIdScopeSet(ids) {
	if (ids === void 0) return null;
	return new Set(ids);
}
/** Serializes plugin scope for cache keys. */
function serializePluginIdScope(ids) {
	return ids === void 0 ? "__unscoped__" : JSON.stringify(ids);
}
//#endregion
//#region src/plugins/current-plugin-metadata-snapshot.ts
function resolvePluginMetadataControlPlaneFingerprint(config, options = {}) {
	return resolvePluginControlPlaneFingerprint({
		config,
		...options
	});
}
function resolveAgentWorkspaceFingerprint(config, env) {
	return JSON.stringify(listAgentWorkspaceDirs(config, env));
}
function prepareCurrentPluginMetadataSnapshotPublication(snapshot, options, owner = "operation") {
	const fingerprint = (config, policyHash) => resolvePluginMetadataControlPlaneFingerprint(config, {
		env: options.env,
		index: snapshot.index,
		policyHash,
		workspaceDir: options.workspaceDir ?? snapshot.workspaceDir
	});
	const compatiblePolicyHashes = options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config, options.env));
	const compatibleConfigFingerprints = options.compatibleConfigs?.map((config, index) => fingerprint(config, compatiblePolicyHashes?.[index]));
	const configFingerprint = fingerprint(options.config, snapshot.policyHash);
	const defaultDiscoveryConfigFingerprint = fingerprint({}, snapshot.policyHash);
	const defaultDiscoveryCompatible = configFingerprint === defaultDiscoveryConfigFingerprint || snapshot.configFingerprint === defaultDiscoveryConfigFingerprint || Boolean(compatibleConfigFingerprints?.includes(defaultDiscoveryConfigFingerprint));
	const envFingerprint = resolvePluginMetadataEnvFingerprint(options.env);
	const agentWorkspaceFingerprint = owner === "gateway" && options.config ? resolveAgentWorkspaceFingerprint(options.config, options.env) : void 0;
	const configIdentities = [...options.compatibleConfigs ?? []];
	if (options.config) {
		const policyHash = resolveInstalledPluginIndexPolicyHash(options.config, options.env);
		if (policyHash === snapshot.policyHash || Boolean(compatiblePolicyHashes?.includes(policyHash))) configIdentities.push(options.config);
	}
	return () => {
		if (getCurrentPluginMetadataSnapshotState().owner === "gateway" && owner !== "gateway") throw new Error("Gateway plugin metadata can only be replaced after shutdown");
		currentPluginMetadataConfigIdentityCache.clear();
		setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, owner === "gateway" || defaultDiscoveryCompatible ? snapshot.owners.modelIdNormalizationPolicies : void 0, owner, envFingerprint, defaultDiscoveryCompatible, agentWorkspaceFingerprint);
		for (const config of configIdentities) currentPluginMetadataConfigIdentityCache.add(config);
	};
}
/** Prepares fingerprints before the Gateway's synchronous runtime publication edge. */
function prepareGatewayPluginMetadataSnapshotPublication(snapshot, options = {}) {
	if (snapshot.pluginIds !== void 0) throw new Error("Gateway plugin metadata must include the complete startup inventory");
	const cache = getPluginMetadataSnapshotCache(snapshot);
	const publish = withPluginCache(cache, () => prepareCurrentPluginMetadataSnapshotPublication(snapshot, options, "gateway"));
	return () => {
		selectCurrentPluginMetadataCache(cache);
		publish();
	};
}
/** Only the Gateway lifecycle publishes a complete replacement inventory. */
function setGatewayPluginMetadataSnapshot(snapshot, options = {}) {
	if (snapshot) prepareGatewayPluginMetadataSnapshotPublication(snapshot, options)();
}
/** Publishes a prepared CLI snapshot without displacing a lifecycle owner. */
function adoptCurrentPluginMetadataSnapshotIfAbsent(snapshot, options = {}) {
	if (getScopedPluginCache()?.kind === "operation" || getCurrentPluginMetadataSnapshotState().snapshot !== void 0) return;
	prepareCurrentPluginMetadataSnapshotPublication(snapshot, options)();
}
/** Installation revokes operation facts even when it runs between metadata scopes. */
function revokeCurrentPluginMetadataSnapshotScopes() {
	const caches = new Set(getScopedPluginCaches());
	const runtimeCaches = /* @__PURE__ */ new Set();
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) if (scoped.immutableRuntimeGeneration) runtimeCaches.add(scoped.cache);
	else caches.add(scoped.cache);
	for (const cache of caches) if (cache.kind === "operation" && !runtimeCaches.has(cache)) invalidatePluginCacheMetadata(cache);
}
function isScopedSnapshotInCurrentCache(scoped) {
	if (!scoped.immutableRuntimeGeneration && scoped.metadata !== scoped.cache.metadata) return false;
	const cache = getScopedPluginCache();
	return cache?.kind !== "operation" || scoped.cache === cache;
}
/** Carries one owner-prepared metadata generation through nested async plugin lookups. */
function withPluginMetadataSnapshotScope(snapshot, run, options = {}) {
	return runWithPluginExecutionFrame(createPluginMetadataSnapshotFrame(snapshot, options), run);
}
/** Compose metadata and its cache before the runtime owner enters the async scope. */
function createPluginMetadataSnapshotFrame(snapshot, options = {}) {
	const current = getPluginExecutionFrame();
	const cache = getPluginMetadataSnapshotCache(snapshot);
	const workspaceDir = options.workspaceDir ?? snapshot.workspaceDir;
	const fingerprint = (config, policyHash) => resolvePluginMetadataControlPlaneFingerprint(config, {
		env: options.env,
		inventoryFingerprint: withPluginCache(cache, () => resolveInstalledManifestRegistryIndexFingerprint(snapshot.index)),
		policyHash,
		workspaceDir
	});
	const compatiblePolicyHashes = options.compatibleConfigs?.map((config) => resolveInstalledPluginIndexPolicyHash(config, options.env));
	const compatibleConfigFingerprints = options.compatibleConfigs?.map((config, index) => fingerprint(config, compatiblePolicyHashes?.[index]));
	const configFingerprint = options.config ? fingerprint(options.config, snapshot.policyHash) : snapshot.configFingerprint;
	const configIdentities = /* @__PURE__ */ new WeakSet();
	if (options.config) {
		const policyHash = resolveInstalledPluginIndexPolicyHash(options.config, options.env);
		if (options.trustConfigIdentity === true || policyHash === snapshot.policyHash || compatiblePolicyHashes?.includes(policyHash)) configIdentities.add(options.config);
	}
	for (const config of options.compatibleConfigs ?? []) configIdentities.add(config);
	return createPluginExecutionFrame({
		...current,
		cacheScope: {
			cache,
			parent: current?.cacheScope
		},
		metadataScope: {
			snapshot,
			cache,
			metadata: cache.metadata,
			configFingerprint,
			envFingerprint: resolvePluginMetadataEnvFingerprint(options.env),
			compatiblePolicyHashes,
			compatibleConfigFingerprints,
			hasConfigIdentity: (config) => configIdentities.has(config),
			immutableRuntimeGeneration: options.trustConfigIdentity === true,
			parent: current?.metadataScope
		}
	}, current);
}
function runOutsidePluginMetadataSnapshotScope(run) {
	const current = getPluginExecutionFrame();
	return runWithPluginExecutionFrame(createPluginExecutionFrame({
		...current,
		metadataScope: void 0
	}, current), () => runOutsidePluginCache(run));
}
const NEEDS_PREPARED_POLICY = Symbol("needs-prepared-policy");
function resolveCompatiblePluginMetadataSnapshot(candidate, params, options = {}) {
	const snapshot = candidate.snapshot;
	if (!snapshot) return;
	if (candidate.immutableRuntimeGeneration) return snapshot;
	const env = params.env ?? process.env;
	if (candidate.envFingerprint !== resolvePluginMetadataEnvFingerprint(env)) return;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds ?? params.pluginIdScope?.resolve({ index: snapshot.index }));
	const snapshotPluginIds = normalizePluginIdScope(snapshot.pluginIds);
	if (requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) !== serializePluginIdScope(requestedPluginIds)) return;
	if (snapshotPluginIds !== void 0 && requestedPluginIds === void 0 && params.allowScopedSnapshot !== true) return;
	const requestedWorkspaceDir = params.workspaceDir ?? (params.allowWorkspaceScopedSnapshot === true || options.scopedOwnerContext === true ? snapshot.workspaceDir : void 0);
	if (snapshot.workspaceDir !== void 0 && requestedWorkspaceDir === void 0) return;
	if (requestedWorkspaceDir !== void 0 && (snapshot.workspaceDir ?? "") !== (requestedWorkspaceDir ?? "")) return;
	const canReuseCachedConfig = Boolean(params.config && candidate.hasConfigIdentity?.(params.config));
	if (canReuseCachedConfig && params.requireDefaultDiscoveryContext !== true) return snapshot;
	if (params.config && !canReuseCachedConfig && params.allowSynchronousPolicyRead === false) return NEEDS_PREPARED_POLICY;
	const requestedPolicyHash = params.config && !canReuseCachedConfig ? resolveInstalledPluginIndexPolicyHash(params.config, params.env) : void 0;
	if (requestedPolicyHash && snapshot.policyHash !== requestedPolicyHash) {
		if (!candidate.compatiblePolicyHashes?.includes(requestedPolicyHash)) return;
	}
	if (params.config && !canReuseCachedConfig) {
		const requestedConfigFingerprint = resolvePluginMetadataControlPlaneFingerprint(params.config, {
			env,
			index: snapshot.index,
			policyHash: requestedPolicyHash,
			workspaceDir: requestedWorkspaceDir
		});
		if (!(candidate.configFingerprint === requestedConfigFingerprint || snapshot.configFingerprint === requestedConfigFingerprint || Boolean(candidate.compatibleConfigFingerprints?.includes(requestedConfigFingerprint)))) return;
	}
	if (params.requireDefaultDiscoveryContext === true && options.scopedOwnerContext !== true && candidate.defaultDiscoveryCompatible !== true) return;
	return snapshot;
}
/** Reads Gateway-owned metadata from an operation cache only when its inputs still match. */
function getCompatibleProcessGatewayPluginMetadataSnapshot(params = {}) {
	const { snapshot, owner, configFingerprint, agentWorkspaceFingerprint, envFingerprint, defaultDiscoveryCompatible, compatiblePolicyHashes, compatibleConfigFingerprints } = getCurrentPluginMetadataSnapshotState();
	if (owner !== "gateway") return;
	if (params.requireAgentWorkspaceCompatibility === true && (!params.config || agentWorkspaceFingerprint !== resolveAgentWorkspaceFingerprint(params.config, params.env))) return;
	const compatible = resolveCompatiblePluginMetadataSnapshot({
		snapshot,
		configFingerprint,
		envFingerprint,
		defaultDiscoveryCompatible,
		compatiblePolicyHashes,
		compatibleConfigFingerprints,
		hasConfigIdentity: (config) => currentPluginMetadataConfigIdentityCache.has(config)
	}, params);
	return compatible === NEEDS_PREPARED_POLICY ? void 0 : compatible;
}
function isCurrentPluginMetadataSnapshotRuntimeGeneration(snapshot) {
	const gatewaySnapshot = getGatewayPluginMetadataSnapshot();
	if (gatewaySnapshot && gatewaySnapshot.index === snapshot.index) return true;
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) {
		if (!isScopedSnapshotInCurrentCache(scoped)) continue;
		if (scoped.snapshot?.index === snapshot.index && scoped.immutableRuntimeGeneration === true) return true;
	}
	return false;
}
function getCurrentPluginMetadataSnapshot(params = {}) {
	for (let scoped = getPluginExecutionFrame()?.metadataScope; scoped; scoped = scoped.parent) {
		if (!isScopedSnapshotInCurrentCache(scoped)) continue;
		const compatibleScoped = resolveCompatiblePluginMetadataSnapshot(scoped, params, { scopedOwnerContext: true });
		if (compatibleScoped === NEEDS_PREPARED_POLICY) return;
		if (compatibleScoped) return compatibleScoped;
	}
	const scopedCache = getScopedPluginCache();
	if (scopedCache && scopedCache !== getProcessPluginCache()) return;
	const { snapshot, owner, configFingerprint, envFingerprint, defaultDiscoveryCompatible, compatiblePolicyHashes, compatibleConfigFingerprints } = getCurrentPluginMetadataSnapshotState();
	const compatible = resolveCompatiblePluginMetadataSnapshot({
		snapshot,
		configFingerprint,
		envFingerprint,
		defaultDiscoveryCompatible,
		compatiblePolicyHashes,
		compatibleConfigFingerprints,
		hasConfigIdentity: (config) => currentPluginMetadataConfigIdentityCache.has(config),
		immutableRuntimeGeneration: owner === "gateway"
	}, params);
	return compatible === NEEDS_PREPARED_POLICY ? void 0 : compatible;
}
registerPluginMetadataSnapshotReaders({
	adoptCurrentPluginMetadataSnapshotIfAbsent,
	getCurrentPluginMetadataSnapshot
});
registerPluginMetadataProcessMemoLifecycleClear(revokeCurrentPluginMetadataSnapshotScopes, { owner: "operation" });
//#endregion
export { isCurrentPluginMetadataSnapshotRuntimeGeneration as a, setGatewayPluginMetadataSnapshot as c, hasExplicitPluginIdScope as d, hasNonEmptyPluginIdScope as f, getCurrentPluginMetadataSnapshot as i, withPluginMetadataSnapshotScope as l, serializePluginIdScope as m, createPluginMetadataSnapshotFrame as n, prepareGatewayPluginMetadataSnapshotPublication as o, normalizePluginIdScope as p, getCompatibleProcessGatewayPluginMetadataSnapshot as r, runOutsidePluginMetadataSnapshotScope as s, adoptCurrentPluginMetadataSnapshotIfAbsent as t, createPluginIdScopeSet as u };

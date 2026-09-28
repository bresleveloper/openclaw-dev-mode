import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as loadPluginRegistrySnapshotWithMetadata } from "./plugin-registry-snapshot-BAw04cGV.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-Mkqqbxs_.mjs";
//#region src/plugins/synthetic-auth.runtime.ts
/** Resolves synthetic and external auth provider refs from active runtime state or persisted manifests. */
function uniqueProviderRefs(values) {
	const seen = /* @__PURE__ */ new Set();
	const next = [];
	for (const raw of values) {
		const trimmed = raw.trim();
		const normalized = normalizeProviderId(trimmed);
		if (!trimmed || seen.has(normalized)) continue;
		seen.add(normalized);
		next.push(trimmed);
	}
	return next;
}
/** Enumerate one captured manifest generation without reopening ambient discovery policy. */
function listManifestSyntheticAuthProviderRefs(index) {
	return uniqueProviderRefs(index.plugins.flatMap((plugin) => plugin.syntheticAuthRefs ?? []));
}
function resolveManifestSyntheticAuthProviderRefState(params = {}) {
	if (params.index && (params.registryDiagnostics?.length ?? 0) > 0) return {
		refs: [],
		complete: false
	};
	const result = loadPluginRegistrySnapshotWithMetadata(params);
	if (result.source !== "persisted" && result.source !== "provided") return {
		refs: [],
		complete: false
	};
	return {
		refs: listManifestSyntheticAuthProviderRefs(result.snapshot),
		complete: true
	};
}
/** Lists provider refs that can satisfy synthetic auth profile lookups. */
function resolveRuntimeSyntheticAuthProviderRefs(params = {}) {
	return resolveRuntimeSyntheticAuthProviderRefState(params).refs;
}
/** Returns synthetic-auth refs plus whether the control-plane data source was complete. */
function resolveRuntimeSyntheticAuthProviderRefState(params = {}) {
	const registry = getPluginRuntimeGenerationRegistry() ?? getPluginRegistryState()?.activeRegistry;
	if (registry) return {
		refs: uniqueProviderRefs([
			...registry.plugins.flatMap((plugin) => plugin.syntheticAuthRefs ?? []),
			...(registry.providers ?? []).filter((entry) => typeof entry.provider.resolveSyntheticAuth === "function" || typeof entry.provider.prepareSyntheticAuth === "function").map((entry) => entry.provider.id),
			...registry.cliBackends.filter((entry) => "resolveSyntheticAuth" in entry.backend && typeof entry.backend.resolveSyntheticAuth === "function").map((entry) => entry.backend.id)
		]),
		complete: true
	};
	return resolveManifestSyntheticAuthProviderRefState(params);
}
//#endregion
export { resolveRuntimeSyntheticAuthProviderRefs as i, resolveManifestSyntheticAuthProviderRefState as n, resolveRuntimeSyntheticAuthProviderRefState as r, listManifestSyntheticAuthProviderRefs as t };

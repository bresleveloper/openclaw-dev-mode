import { f as getProcessPluginCache, n as adoptProcessPluginCache, o as getPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { o as setCurrentManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-CO2R6uEC.mjs";
//#region src/plugins/current-plugin-metadata-state.ts
/** Selects an owned inventory and its prepared process-wide normalization policy together. */
function selectCurrentPluginMetadataCache(cache) {
	adoptProcessPluginCache(cache);
	const state = cache.metadata.current;
	setCurrentManifestModelIdNormalizationPolicies(state.owner === "gateway" || state.defaultDiscoveryCompatible ? state.snapshot?.owners.modelIdNormalizationPolicies : void 0);
}
/** Owns config identity reuse for the current immutable metadata snapshot. */
const currentPluginMetadataConfigIdentityCache = {
	add(config) {
		getProcessPluginCache().metadata.current.configIdentities.add(config);
	},
	clear() {
		getProcessPluginCache().metadata.current.configIdentities = /* @__PURE__ */ new WeakSet();
	},
	has(config) {
		return getProcessPluginCache().metadata.current.configIdentities.has(config);
	}
};
/** Stores the process-current plugin metadata snapshot and compatible config fingerprints. */
function setCurrentPluginMetadataSnapshotState(snapshot, configFingerprint, compatiblePolicyHashes, compatibleConfigFingerprints, modelIdNormalizationPolicies, owner = "operation", envFingerprint, defaultDiscoveryCompatible = false, agentWorkspaceFingerprint) {
	const state = getProcessPluginCache().metadata.current;
	state.snapshot = snapshot;
	state.owner = owner;
	state.configFingerprint = snapshot ? configFingerprint : void 0;
	state.agentWorkspaceFingerprint = snapshot ? agentWorkspaceFingerprint : void 0;
	state.envFingerprint = snapshot ? envFingerprint : void 0;
	state.defaultDiscoveryCompatible = Boolean(snapshot && defaultDiscoveryCompatible);
	state.compatiblePolicyHashes = snapshot ? compatiblePolicyHashes : void 0;
	state.compatibleConfigFingerprints = snapshot ? compatibleConfigFingerprints : void 0;
	setCurrentManifestModelIdNormalizationPolicies(snapshot ? modelIdNormalizationPolicies : void 0);
	state.revision = Symbol("plugin-metadata-snapshot");
}
/** Clears the snapshot, its identity cache, and process-wide model normalization. */
function clearCurrentPluginMetadataSnapshot() {
	currentPluginMetadataConfigIdentityCache.clear();
	setCurrentPluginMetadataSnapshotState(void 0, void 0);
}
/** Install-ledger writes cannot retire metadata owned by a running Gateway. */
function isGatewayPluginMetadataSnapshotActive() {
	const state = getProcessPluginCache().metadata.current;
	return state.owner === "gateway" && state.snapshot !== void 0;
}
/** Reads the boot inventory without importing discovery into lightweight consumers. */
function getGatewayPluginMetadataSnapshot() {
	const cache = getPluginCache();
	if (cache.kind === "process" && cache.metadata.current.owner === "gateway") return cache.metadata.current.snapshot;
}
/** Management compares a fresh candidate with boot state without making boot its read context. */
function getProcessGatewayPluginMetadataSnapshot() {
	if (isGatewayPluginMetadataSnapshotActive()) return getProcessPluginCache().metadata.current.snapshot;
}
/** Captures the current snapshot and the policies eligible for process-wide publication. */
function getCurrentPluginMetadataSnapshotState() {
	const state = getProcessPluginCache().metadata.current;
	return {
		snapshot: state.snapshot,
		owner: state.owner,
		configFingerprint: state.configFingerprint,
		agentWorkspaceFingerprint: state.agentWorkspaceFingerprint,
		envFingerprint: state.envFingerprint,
		defaultDiscoveryCompatible: state.defaultDiscoveryCompatible,
		compatiblePolicyHashes: state.compatiblePolicyHashes,
		compatibleConfigFingerprints: state.compatibleConfigFingerprints,
		revision: state.revision
	};
}
//#endregion
export { getProcessGatewayPluginMetadataSnapshot as a, setCurrentPluginMetadataSnapshotState as c, getGatewayPluginMetadataSnapshot as i, currentPluginMetadataConfigIdentityCache as n, isGatewayPluginMetadataSnapshotActive as o, getCurrentPluginMetadataSnapshotState as r, selectCurrentPluginMetadataCache as s, clearCurrentPluginMetadataSnapshot as t };

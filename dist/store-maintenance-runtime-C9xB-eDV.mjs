import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-DuM7NmYY.mjs";
import { a as collectActiveSessionLifecycleMutationIdentities, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { d as resolveMaintenanceConfigFromInput } from "./store-maintenance-C5xEVYop.mjs";
import { n as resolveSessionMaintenancePreserveKeys, t as collectSessionWorkAdmissionKeysFromSnapshot } from "./store-maintenance-preserve-snapshot-BwwMxezL.mjs";
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Set();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(provider) {
	preserveKeysProviders.add(provider);
	return () => {
		preserveKeysProviders.delete(provider);
	};
}
function addSessionMaintenancePreserveKey(keys, value) {
	const normalized = normalizeStoreSessionKey(value ?? "");
	if (normalized) keys.add(normalized);
}
function addSessionMaintenancePreserveKeys(keys, values) {
	for (const value of values ?? []) addSessionMaintenancePreserveKey(keys, value);
}
/** Collects normalized session keys that maintenance/pruning must preserve. */
function collectSessionMaintenancePreserveKeys(baseKeys) {
	const keys = /* @__PURE__ */ new Set();
	addSessionMaintenancePreserveKeys(keys, baseKeys);
	for (const provider of preserveKeysProviders) try {
		addSessionMaintenancePreserveKeys(keys, provider());
	} catch {}
	return keys.size > 0 ? keys : void 0;
}
/** Resolves store keys owned by active work, including aliases sharing a backing session id. */
function collectActiveSessionWorkAdmissionKeys(params) {
	const keys = collectSessionWorkAdmissionKeysFromSnapshot(params.store, [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]);
	return keys.size > 0 ? keys : void 0;
}
/** Capture live parent owners before dispatch; no protection registry is copied into the worker. */
function captureSessionMaintenancePreservation(storePath) {
	return {
		providerKeys: [...collectSessionMaintenancePreserveKeys() ?? []].toSorted(),
		workIdentities: [...collectActiveSessionWorkAdmissions().get(storePath) ?? []].toSorted(),
		lifecycleIdentities: collectActiveSessionLifecycleMutationIdentities(storePath)
	};
}
/** Collects runtime, active-work, and lifecycle keys protected from automatic maintenance. */
function collectSessionMaintenancePreserveKeysForStore(params) {
	const keys = resolveSessionMaintenancePreserveKeys({
		...params,
		snapshot: captureSessionMaintenancePreservation(params.storePath)
	});
	return keys.size > 0 ? keys : void 0;
}
//#endregion
//#region src/config/sessions/store-maintenance-runtime.ts
function resolveMaintenanceConfig() {
	let maintenance;
	try {
		maintenance = getRuntimeConfig().session?.maintenance;
	} catch {}
	return resolveMaintenanceConfigFromInput(maintenance);
}
//#endregion
export { registerSessionMaintenancePreserveKeysProvider as a, collectSessionMaintenancePreserveKeysForStore as i, captureSessionMaintenancePreservation as n, collectActiveSessionWorkAdmissionKeys as r, resolveMaintenanceConfig as t };

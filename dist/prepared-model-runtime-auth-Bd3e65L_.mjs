import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { l as isOAuthRefreshFence } from "./credential-state-CWZ_V0ds.mjs";
import { r as hasOAuthIdentity } from "./oauth-shared-CVbJLd-k.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/prepared-model-runtime-auth.ts
/** Inventory follows identified accounts; credential use still follows the current auth owner. */
function hasSamePreparedModelCatalogAuth(previous, next, includesProvider = () => true) {
	if (!previous?.credentials || !next.credentials) return false;
	const identity = (authStore, credentials) => {
		const profiles = Object.entries(authStore.profiles).filter(([, profile]) => includesProvider(profile.provider));
		const identifiedOAuth = profiles.filter(([, profile]) => profile.type === "oauth" && hasOAuthIdentity(profile) && !isOAuthRefreshFence(profile));
		return {
			profiles: Object.fromEntries(profiles.map(([id, profile]) => {
				if (profile.type !== "oauth" || !identifiedOAuth.some(([key]) => key === id)) return [id, profile];
				const { access: _access, refresh: _refresh, expires: _expires, idToken: _idToken, ...account } = profile;
				return [id, account];
			})),
			credentials: Object.fromEntries(Object.entries(credentials).filter(([provider]) => includesProvider(provider)).map(([provider, credential]) => {
				if (credential.type !== "oauth") return [provider, credential];
				const profileIds = identifiedOAuth.flatMap(([id, profile]) => profile.type === "oauth" && normalizeProviderId(profile.provider) === normalizeProviderId(provider) && profile.access === credential.access && profile.refresh === credential.refresh && profile.expires === credential.expires ? [id] : []).toSorted();
				return [provider, profileIds.length ? { profileIds } : credential];
			}))
		};
	};
	return isDeepStrictEqual(identity(previous.authStore, previous.credentials), identity(next.authStore, next.credentials));
}
/** Private auth facts owned by an immutable prepared model generation. */
const authStoreBySnapshot = /* @__PURE__ */ new WeakMap();
const authLabelsBySnapshot = /* @__PURE__ */ new WeakMap();
const materializationsBySnapshot = /* @__PURE__ */ new WeakMap();
const authLoaderBySnapshot = /* @__PURE__ */ new WeakMap();
const authByFullCatalog = /* @__PURE__ */ new WeakMap();
function setPreparedModelRuntimeAuthStore(snapshot, authStore) {
	authStoreBySnapshot.set(snapshot, authStore);
}
function getPreparedModelRuntimeAuthStore(snapshot) {
	return authStoreBySnapshot.get(snapshot);
}
function setPreparedModelRuntimeAuthLabels(snapshot, labels) {
	authLabelsBySnapshot.set(snapshot, labels);
}
function getPreparedModelRuntimeAuthLabels(snapshot) {
	const labels = authLabelsBySnapshot.get(snapshot);
	if (!labels) throw new Error("Prepared model runtime omitted auth display labels");
	return labels;
}
function setPreparedModelFullCatalogAuth(snapshot, auth, readUsage) {
	authByFullCatalog.set(snapshot, {
		auth,
		readUsage: readUsage ?? authByFullCatalog.get(snapshot)?.readUsage
	});
}
function getPreparedModelFullCatalogAuth(snapshot) {
	const binding = authByFullCatalog.get(snapshot);
	if (!binding) return;
	const authStore = binding.readUsage?.(binding.auth.authStore) ?? binding.auth.authStore;
	return authStore === binding.auth.authStore ? binding.auth : {
		...binding.auth,
		authStore
	};
}
function copyPreparedModelFullCatalogAuth(source, target) {
	const binding = authByFullCatalog.get(source);
	if (binding) authByFullCatalog.set(target, binding);
}
function setPreparedModelRuntimeAuthLoader(snapshot, loader) {
	authLoaderBySnapshot.set(snapshot, loader);
}
async function loadPreparedModelRuntimeAuth(snapshot, scope) {
	const loader = authLoaderBySnapshot.get(snapshot);
	if (loader) return await loader(scope);
	const authStore = authStoreBySnapshot.get(snapshot);
	return authStore ? {
		authStore,
		authModes: snapshot.authModes ?? {}
	} : void 0;
}
function setPreparedModelRuntimeAuthMaterializations(snapshot, materializations) {
	materializationsBySnapshot.set(snapshot, materializations);
}
function getPreparedModelRuntimeAuthMaterializations(snapshot) {
	return materializationsBySnapshot.get(snapshot) ?? [];
}
function copyPreparedModelRuntimeAuthBindings(source, target) {
	const authStore = authStoreBySnapshot.get(source);
	const labels = authLabelsBySnapshot.get(source);
	const authLoader = authLoaderBySnapshot.get(source);
	const materializations = materializationsBySnapshot.get(source);
	if (authStore) authStoreBySnapshot.set(target, authStore);
	if (labels) authLabelsBySnapshot.set(target, labels);
	if (authLoader) authLoaderBySnapshot.set(target, authLoader);
	if (materializations) materializationsBySnapshot.set(target, materializations);
}
//#endregion
export { getPreparedModelRuntimeAuthMaterializations as a, loadPreparedModelRuntimeAuth as c, setPreparedModelRuntimeAuthLoader as d, setPreparedModelRuntimeAuthMaterializations as f, getPreparedModelRuntimeAuthLabels as i, setPreparedModelFullCatalogAuth as l, copyPreparedModelRuntimeAuthBindings as n, getPreparedModelRuntimeAuthStore as o, setPreparedModelRuntimeAuthStore as p, getPreparedModelFullCatalogAuth as r, hasSamePreparedModelCatalogAuth as s, copyPreparedModelFullCatalogAuth as t, setPreparedModelRuntimeAuthLabels as u };

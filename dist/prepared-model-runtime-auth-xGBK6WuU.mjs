import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { u as hasOAuthIdentity } from "./oauth-shared-CiaJlx_D.mjs";
import { r as isOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
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
const runtimeAuth = /* @__PURE__ */ new WeakMap();
const authByFullCatalog = /* @__PURE__ */ new WeakMap();
function bindPreparedModelRuntimeAuth(snapshot, binding) {
	runtimeAuth.set(snapshot, {
		...runtimeAuth.get(snapshot),
		...binding
	});
}
function getPreparedModelRuntimeAuthStore(snapshot) {
	const binding = runtimeAuth.get(snapshot);
	return binding?.store ? binding.readUsage?.(binding.store) ?? binding.store : void 0;
}
function getPreparedModelRuntimeAuthLabels(snapshot) {
	const labels = runtimeAuth.get(snapshot)?.labels;
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
async function loadPreparedModelRuntimeAuth(snapshot, scope) {
	const load = runtimeAuth.get(snapshot)?.load;
	if (load) return await load(scope);
	const authStore = getPreparedModelRuntimeAuthStore(snapshot);
	return authStore ? {
		authStore,
		authModes: snapshot.authModes ?? {}
	} : void 0;
}
function getPreparedModelRuntimeAuthMaterializations(snapshot) {
	return runtimeAuth.get(snapshot)?.materializations ?? [];
}
function copyPreparedModelRuntimeAuthBindings(source, target) {
	const binding = runtimeAuth.get(source);
	if (binding) bindPreparedModelRuntimeAuth(target, binding);
}
//#endregion
export { getPreparedModelRuntimeAuthLabels as a, hasSamePreparedModelCatalogAuth as c, getPreparedModelFullCatalogAuth as i, loadPreparedModelRuntimeAuth as l, copyPreparedModelFullCatalogAuth as n, getPreparedModelRuntimeAuthMaterializations as o, copyPreparedModelRuntimeAuthBindings as r, getPreparedModelRuntimeAuthStore as s, bindPreparedModelRuntimeAuth as t, setPreparedModelFullCatalogAuth as u };

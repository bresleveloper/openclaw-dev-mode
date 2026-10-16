import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
//#region src/plugins/storage-provider-registry.ts
function validateStorageProviderContract(provider, declaredIds) {
	const id = normalizeCapabilityProviderId(provider.id);
	if (!id) return {
		ok: false,
		message: "storage provider registration missing valid id"
	};
	if (id === "filesystem") return {
		ok: false,
		message: "storage provider id \"filesystem\" is reserved for core"
	};
	if (typeof provider.label !== "string" || !provider.label.trim()) return {
		ok: false,
		message: "storage provider registration missing label"
	};
	if (typeof provider.open !== "function") return {
		ok: false,
		message: "storage provider registration missing method: open"
	};
	if (provider.validateSettings !== void 0 && typeof provider.validateSettings !== "function") return {
		ok: false,
		message: "storage provider registration validateSettings must be a function"
	};
	return declaredIds.some((candidate) => normalizeCapabilityProviderId(candidate) === id) ? {
		ok: true,
		id
	} : {
		ok: false,
		message: `plugin must declare contracts.storageProviders for provider: ${id}`
	};
}
function resolveStorageProvider(registry, providerId) {
	const id = normalizeCapabilityProviderId(providerId);
	return id ? registry.storageProviders.get(id)?.provider : void 0;
}
//#endregion
export { validateStorageProviderContract as n, resolveStorageProvider as t };

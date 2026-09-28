import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-CGngP_UC.mjs";
//#region src/plugins/worker-provider-registry.ts
/** Deterministic lookup helpers for plugin-registered cloud-worker providers. */
/** Validates the provider methods, normalized id, and manifest ownership contract. */
function validateWorkerProviderContract(provider, declaredIds) {
	const missingMethod = [
		"resolveAllocation",
		"provision",
		"inspect",
		"destroy"
	].find((method) => typeof provider[method] !== "function");
	if (missingMethod) return {
		ok: false,
		message: `worker provider registration missing method: ${missingMethod}`
	};
	for (const method of [
		"renew",
		"maintain",
		"prepareProvision",
		"listMachineOptions"
	]) if (provider[method] !== void 0 && typeof provider[method] !== "function") return {
		ok: false,
		message: `worker provider registration ${method} must be a function`
	};
	if (provider.provisionBeforeInstallation !== void 0 && typeof provider.provisionBeforeInstallation !== "boolean") return {
		ok: false,
		message: "worker provider registration provisionBeforeInstallation must be a boolean"
	};
	const executionModes = provider.supportedExecutionModes;
	const validExecutionModes = Array.isArray(executionModes) && (executionModes.length === 1 && (executionModes[0] === "worker-turn" || executionModes[0] === "remote-exec") || executionModes.length === 2 && executionModes[0] === "worker-turn" && executionModes[1] === "remote-exec");
	if (executionModes !== void 0 && !validExecutionModes) return {
		ok: false,
		message: "worker provider registration supportedExecutionModes must contain one current mode or both current modes in canonical order"
	};
	if (provider.resolveSshIdentity !== void 0 && typeof provider.resolveSshIdentity !== "function") return {
		ok: false,
		message: "worker provider registration resolveSshIdentity must be a function"
	};
	const id = normalizeCapabilityProviderId(provider.id);
	if (!id) return {
		ok: false,
		message: "worker provider registration missing valid id"
	};
	return declaredIds.some((candidate) => normalizeCapabilityProviderId(candidate) === id) ? {
		ok: true,
		id
	} : {
		ok: false,
		message: `plugin must declare contracts.workerProviders for provider: ${id}`
	};
}
/** Resolves one provider by its normalized manifest capability id. */
function resolveWorkerProvider(registry, providerId) {
	const normalizedId = normalizeCapabilityProviderId(providerId);
	return normalizedId ? registry.workerProviders.get(normalizedId)?.provider : void 0;
}
//#endregion
export { validateWorkerProviderContract as n, resolveWorkerProvider as t };

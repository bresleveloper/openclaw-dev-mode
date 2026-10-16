import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { n as AcpRuntimeError } from "./errors-m4L_1YUz.mjs";
import "./errors-DDGkdHjR.mjs";
//#region src/acp/runtime/registry.ts
const ACP_RUNTIME_REGISTRY_STATE_KEY = Symbol.for("openclaw.acpRuntimeRegistryState");
function resolveAcpRuntimeRegistryGlobalState() {
	const processStore = process;
	const existing = processStore[ACP_RUNTIME_REGISTRY_STATE_KEY];
	if (existing) globalThis[ACP_RUNTIME_REGISTRY_STATE_KEY] = existing;
	const created = resolveGlobalSingleton(ACP_RUNTIME_REGISTRY_STATE_KEY, () => ({ backendsById: /* @__PURE__ */ new Map() }), (state) => state.backendsById.clear(), "plugin-registry");
	processStore[ACP_RUNTIME_REGISTRY_STATE_KEY] = created;
	return created;
}
const ACP_BACKENDS_BY_ID = resolveAcpRuntimeRegistryGlobalState().backendsById;
function isAcpRuntimeBackendHealthy(backend) {
	if (!backend.healthy) return true;
	try {
		return backend.healthy();
	} catch {
		return false;
	}
}
/** Registers or replaces an ACP runtime backend by normalized id. */
function registerAcpRuntimeBackend(backend) {
	const id = normalizeOptionalLowercaseString(backend.id) || "";
	if (!id) throw new Error("ACP runtime backend id is required");
	if (!backend.runtime) throw new Error(`ACP runtime backend "${id}" is missing runtime implementation`);
	ACP_BACKENDS_BY_ID.set(id, {
		...backend,
		id
	});
}
/** Removes a registered ACP runtime backend by id. */
function unregisterAcpRuntimeBackend(id) {
	const normalized = normalizeOptionalLowercaseString(id) || "";
	if (!normalized) return;
	ACP_BACKENDS_BY_ID.delete(normalized);
}
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
function getAcpRuntimeBackend(id) {
	const normalized = normalizeOptionalLowercaseString(id) || "";
	if (normalized) return ACP_BACKENDS_BY_ID.get(normalized) ?? null;
	if (ACP_BACKENDS_BY_ID.size === 0) return null;
	for (const backend of ACP_BACKENDS_BY_ID.values()) if (isAcpRuntimeBackendHealthy(backend)) return backend;
	return ACP_BACKENDS_BY_ID.values().next().value ?? null;
}
/** Resolves a healthy backend or throws a typed ACP runtime error. */
function requireAcpRuntimeBackend(id) {
	const normalized = normalizeOptionalLowercaseString(id) || "";
	const backend = getAcpRuntimeBackend(normalized || void 0);
	if (!backend) throw new AcpRuntimeError("ACP_BACKEND_MISSING", "ACP runtime backend is not configured. Install and enable the acpx runtime plugin.");
	if (!isAcpRuntimeBackendHealthy(backend)) throw new AcpRuntimeError("ACP_BACKEND_UNAVAILABLE", "ACP runtime backend is currently unavailable. Try again in a moment.");
	if (normalized && backend.id !== normalized) throw new AcpRuntimeError("ACP_BACKEND_MISSING", `ACP runtime backend "${normalized}" is not registered.`);
	return backend;
}
const testing = {
	resetAcpRuntimeBackendsForTests() {
		ACP_BACKENDS_BY_ID.clear();
	},
	getAcpRuntimeRegistryGlobalStateForTests() {
		return resolveAcpRuntimeRegistryGlobalState();
	}
};
//#endregion
export { testing as a, requireAcpRuntimeBackend as i, isAcpRuntimeBackendHealthy as n, unregisterAcpRuntimeBackend as o, registerAcpRuntimeBackend as r, getAcpRuntimeBackend as t };

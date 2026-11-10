import { t as isAcpEnabledByPolicy } from "./policy-C2Xkhgxq.mjs";
import { n as isAcpRuntimeBackendHealthy, t as getAcpRuntimeBackend } from "./registry-S4l3N3eT.mjs";
//#region src/acp/runtime/availability.ts
function isAcpRuntimeSpawnAvailable(params) {
	if (params.sandboxed === true) return false;
	if (params.config && !isAcpEnabledByPolicy(params.config)) return false;
	const backend = getAcpRuntimeBackend(params.backendId ?? params.config?.acp?.backend);
	return backend !== null && isAcpRuntimeBackendHealthy(backend);
}
//#endregion
export { isAcpRuntimeSpawnAvailable as t };

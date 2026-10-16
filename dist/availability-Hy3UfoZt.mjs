import { n as isAcpRuntimeBackendHealthy, t as getAcpRuntimeBackend } from "./registry-CQAJvYwl.mjs";
import { t as isAcpEnabledByPolicy } from "./policy-DlIDudm0.mjs";
//#region src/acp/runtime/availability.ts
/** Returns whether ACP runtime spawning is allowed and the selected backend is healthy enough. */
function isAcpRuntimeSpawnAvailable(params) {
	if (params.sandboxed === true) return false;
	if (params.config && !isAcpEnabledByPolicy(params.config)) return false;
	const backend = getAcpRuntimeBackend(params.backendId ?? params.config?.acp?.backend);
	return backend !== null && isAcpRuntimeBackendHealthy(backend);
}
//#endregion
export { isAcpRuntimeSpawnAvailable as t };

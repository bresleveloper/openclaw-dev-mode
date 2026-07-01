import { t as getAcpRuntimeBackend } from "./registry-BvEYhdfU.js";
import { t as isAcpEnabledByPolicy } from "./policy-BlkvTFon.js";
//#region src/acp/runtime/availability.ts
/** Returns whether ACP runtime spawning is allowed and the selected backend is healthy enough. */
function isAcpRuntimeSpawnAvailable(params) {
	if (params.sandboxed === true) return false;
	if (params.config && !isAcpEnabledByPolicy(params.config)) return false;
	const backend = getAcpRuntimeBackend(params.backendId ?? params.config?.acp?.backend);
	if (!backend) return false;
	if (!backend.healthy) return true;
	try {
		return backend.healthy();
	} catch {
		return false;
	}
}
//#endregion
export { isAcpRuntimeSpawnAvailable as t };

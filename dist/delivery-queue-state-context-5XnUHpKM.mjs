import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
//#region src/infra/delivery-queue-state-context.ts
function captureDeliveryQueueStateContext(stateDir) {
	const env = resolveDeliveryQueueStateEnv(stateDir);
	return {
		workerContext: captureOpenClawStateWorkerContext({ env }),
		stateDir: resolveStateDir(env),
		...isGatewayExternallySupervised(process.env) ? { supervisorMode: "external" } : {}
	};
}
function resolveDeliveryQueueStateEnv(stateDir, context) {
	return context ? {
		...process.env,
		OPENCLAW_STATE_DIR: context.stateDir,
		OPENCLAW_SUPERVISOR_MODE: context.supervisorMode
	} : stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} : process.env;
}
//#endregion
export { resolveDeliveryQueueStateEnv as n, captureDeliveryQueueStateContext as t };

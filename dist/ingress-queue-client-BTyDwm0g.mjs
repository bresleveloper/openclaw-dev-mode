import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
//#region src/channels/message/ingress-queue-client.ts
function resolveChannelIngressStateEnv(stateDir) {
	return stateDir ? mergeProcessEnv([process.env, { OPENCLAW_STATE_DIR: stateDir }]) : process.env;
}
//#endregion
export { resolveChannelIngressStateEnv as t };

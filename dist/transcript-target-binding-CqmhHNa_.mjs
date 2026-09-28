import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import path from "node:path";
//#region src/config/sessions/transcript-target-binding.ts
/** Retain storage routing facts without retaining caller credentials. */
function captureSessionTranscriptStorageEnvironment(source) {
	const env = cloneEnvWithPlatformSemantics(source);
	return {
		OPENCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
}
/** Bind the locator and its storage namespace before reads or caller callbacks. */
function captureSessionTranscriptTargetBinding(source) {
	return {
		...source,
		storePath: path.resolve(source.storePath),
		env: captureSessionTranscriptStorageEnvironment(source.env ?? process.env)
	};
}
function sameSessionTranscriptStorageEnvironment(left, right) {
	return left?.OPENCLAW_STATE_DIR === right?.OPENCLAW_STATE_DIR && left?.OPENCLAW_SUPERVISOR_MODE === right?.OPENCLAW_SUPERVISOR_MODE;
}
function sameSessionTranscriptTargetBinding(left, right) {
	return left && right ? left.agentId === right.agentId && left.sessionId === right.sessionId && left.sessionKey === right.sessionKey && left.storePath === right.storePath && sameSessionTranscriptStorageEnvironment(left.env, right.env) : left === right;
}
//#endregion
export { sameSessionTranscriptTargetBinding as i, captureSessionTranscriptTargetBinding as n, sameSessionTranscriptStorageEnvironment as r, captureSessionTranscriptStorageEnvironment as t };

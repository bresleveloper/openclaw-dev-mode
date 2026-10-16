import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import path from "node:path";
//#region src/config/sessions/transcript-target-binding.ts
const storageEnvironmentKeys = /* @__PURE__ */ new Set([
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_SUPERVISOR_MODE",
	"OPENCLAW_HOME",
	"HOME",
	"USERPROFILE",
	"PREFIX",
	"ANDROID_DATA",
	"OPENCLAW_TEST_FAST",
	"VITEST",
	"VITEST_POOL_ID",
	"VITEST_WORKER_ID",
	"NODE_ENV"
]);
/** Retain storage routing facts without retaining caller credentials. */
function captureSessionTranscriptStorageEnvironment(source) {
	const env = cloneEnvWithPlatformSemantics(Object.fromEntries(Object.keys(source).filter((key) => storageEnvironmentKeys.has(key.toUpperCase())).map((key) => [key, source[key]])));
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

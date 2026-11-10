import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./thinking-runtime-DuxsJR5q.mjs";
import "./stored-model-overrides-RKQxlZXm.mjs";
import "./command-auth-D8Y1MxJm.mjs";
import "./fast-mode-DezNRstT.mjs";
import "./commands-registry-CFDGAPH8.mjs";
import "./command-detection-D0j_OxtK.mjs";
import "./command-specs-vKDKhDle.mjs";
import "./chat-commands-C__qSMA1.mjs";
//#region src/channels/native-command-session-targets.ts
function resolveNativeCommandSessionTargets(params) {
	const rawSessionKey = params.boundSessionKey ?? `agent:${params.agentId}:${params.sessionPrefix}:${params.userId}`;
	return {
		sessionKey: params.sessionKeyCase === "lowercase" ? normalizeLowercaseStringOrEmpty(rawSessionKey) : rawSessionKey,
		commandTargetSessionKey: params.boundSessionKey ?? params.targetSessionKey
	};
}
//#endregion
export { resolveNativeCommandSessionTargets as t };

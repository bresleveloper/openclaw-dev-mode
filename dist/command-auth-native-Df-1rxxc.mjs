import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./command-auth-DyjyIT4u.mjs";
import "./thinking-runtime-BwS3HC5I.mjs";
import "./commands-registry-DcFr3mpT.mjs";
import "./stored-model-overrides-C1-DcdN6.mjs";
import "./command-detection-m_VCyqpX.mjs";
import "./command-specs-D-oMHY44.mjs";
import "./fast-mode-CdiysUl0.mjs";
import "./chat-commands-DPNB2D7k.mjs";
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

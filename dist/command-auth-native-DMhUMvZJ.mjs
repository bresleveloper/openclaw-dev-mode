import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./command-auth-DyjyIT4u.mjs";
import "./thinking-runtime-DsaB5fLF.mjs";
import "./commands-registry-DVONES7g.mjs";
import "./stored-model-overrides-C9b7mZbZ.mjs";
import "./command-detection-M8GOVwRi.mjs";
import "./command-specs-DHrf0vW9.mjs";
import "./fast-mode-CdiysUl0.mjs";
import "./chat-commands-DxFzY5zT.mjs";
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

import { i as hasInternalHookListeners, u as triggerInternalHook } from "./internal-hooks-B-eMkNRp.mjs";
//#region src/gateway/session-patch-hooks.ts
/** Triggers internal session patch hooks when listeners are registered. */
function triggerSessionPatchHook(params) {
	if (!hasInternalHookListeners("session", "patch")) return;
	const hookContext = structuredClone({
		sessionEntry: params.sessionEntry,
		patch: params.patch,
		cfg: params.cfg
	});
	const hookEvent = {
		type: "session",
		action: "patch",
		sessionKey: params.sessionKey,
		context: hookContext,
		timestamp: /* @__PURE__ */ new Date(),
		messages: []
	};
	triggerInternalHook(hookEvent);
}
//#endregion
export { triggerSessionPatchHook as t };

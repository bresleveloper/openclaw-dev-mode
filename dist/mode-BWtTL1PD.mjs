import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { $a as validateTalkModeParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/gateway/talk/handlers/mode.ts
/** Broadcasts Talk mode changes independently of speech and realtime provider loading. */
const talkModeHandlers = { "talk.mode": async ({ params, respond, context, client, isWebchatConnect, sessionMutationCommitGuard }) => {
	if (client && isWebchatConnect(client.connect) && !await context.hasConnectedTalkNode()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "talk disabled: no connected Talk-capable nodes"));
		return;
	}
	if (!assertValidParams(params, validateTalkModeParams, "talk.mode", respond)) return;
	const payload = {
		enabled: params.enabled,
		phase: params.phase ?? null,
		ts: Date.now()
	};
	sessionMutationCommitGuard?.();
	context.broadcast("talk.mode", payload, { dropIfSlow: true });
	respond(true, payload, void 0);
} };
//#endregion
export { talkModeHandlers };

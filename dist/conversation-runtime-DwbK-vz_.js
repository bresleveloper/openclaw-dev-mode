import "./session-binding-service-QCvSH7Sy.js";
import "./thread-bindings-policy-YspKXCyk.js";
import "./channel-access-compat-oQkS5lqy.js";
import "./conversation-binding-DNu8g4Ex.js";
import "./binding-registry-BwSK0N_x.js";
import "./session-DIP_KKAc.js";
import "./pairing-store-uQh6I0SL.js";
import "./binding-targets-Dq4etE8q.js";
import "./binding-routing-ToE94Wq6.js";
import "./pairing-labels-Dut6Njhr.js";
//#region src/channels/session-meta.ts
let inboundSessionRuntimePromise = null;
function loadInboundSessionRuntime() {
	inboundSessionRuntimePromise ??= import("./inbound.runtime.js");
	return inboundSessionRuntimePromise;
}
/**
* Best-effort inbound session metadata recorder for channel plugin command handlers.
*/
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordSessionMetaFromInbound({
			storePath,
			sessionKey: params.sessionKey,
			ctx: params.ctx
		});
	} catch (err) {
		params.onError?.(err);
	}
}
//#endregion
export { recordInboundSessionMetaSafe as t };

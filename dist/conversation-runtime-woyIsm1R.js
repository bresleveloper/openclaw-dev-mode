import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import "./session-binding-service-Cp2KThxY.js";
import "./conversation-binding-h1-pAufH.js";
import "./thread-bindings-policy-DuqhAvqy.js";
import "./channel-access-compat-Bkekv_zh.js";
import "./binding-registry-w9ub3tXx.js";
import "./session-BxMlCsju.js";
import "./pairing-store-DAvIfT0m.js";
import "./binding-targets-zpzB1NTY.js";
import "./binding-routing-CIiTmWMH.js";
import "./pairing-challenge-CzX2GLE1.js";
import "./pairing-labels-gQPvNnDH.js";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
/**
* Best-effort inbound session metadata recorder for channel plugin command handlers.
*/
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordInboundSessionMeta({
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

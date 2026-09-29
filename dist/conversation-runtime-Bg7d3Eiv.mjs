import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./session-binding-service-n2QTfkUE.mjs";
import "./conversation-binding-6xSU5aQc.mjs";
import "./session-2tgOCGL5.mjs";
import "./pairing-store-Cvj6ctV_.mjs";
import "./thread-bindings-policy-BbWqcnDl.mjs";
import "./channel-access-compat-DPCgli7T.mjs";
import "./binding-routing-CaMwdsw8.mjs";
import "./pairing-labels-C5yUjxoo.mjs";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
/**
* Best-effort inbound session metadata recorder for channel plugin command handlers.
*/
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
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

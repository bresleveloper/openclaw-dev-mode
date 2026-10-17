import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./session-binding-service-DzGpg6K8.mjs";
import "./conversation-binding-DyggeDH3.mjs";
import "./session-rcXfkt9U.mjs";
import "./pairing-messages-DAQcoeDL.mjs";
import "./pairing-store-DEvhBgUm.mjs";
import "./thread-bindings-policy-DE7-D4c0.mjs";
import "./thread-bindings-messages-BhQOhR26.mjs";
import "./channel-access-compat-CcTzmIUt.mjs";
import "./binding-routing-BQTDxpF7.mjs";
import "./pairing-labels-DwhbR9mn.mjs";
//#region src/channels/session-meta.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
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

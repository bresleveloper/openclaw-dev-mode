import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./session-binding-service-ByKk9LiJ.mjs";
import "./conversation-binding-CjS0uvMb.mjs";
import "./session-bNhKQNY9.mjs";
import "./pairing-messages-AQo0LeX0.mjs";
import "./pairing-store-BIAARSUf.mjs";
import "./thread-bindings-policy-Hq7cocye.mjs";
import "./thread-bindings-messages-BiGDDOIC.mjs";
import "./channel-access-compat-BMsuXg3Y.mjs";
import "./binding-routing-BQzw9Xlb.mjs";
import "./pairing-labels-BmlS1Fbg.mjs";
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

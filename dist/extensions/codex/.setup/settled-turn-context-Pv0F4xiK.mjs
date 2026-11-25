import { n as codexHistoryRejectionReason, t as CodexHistoryRejection } from "./history-rejection-BsCZa2cl.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
// extensions/codex/src/app-server/settled-turn-context.ts
const loadSessionHistoryWorker = createLazyRuntimeModule(() => import("../session-history-worker-runtime.js"));
/** Only the Codex owner interprets this bounded, detached replay projection. */
var CodexSettledTurnContext = class {
	constructor(data, selection) {
		this.data = data;
		this.selection = selection;
		this.source = "harness";
	}
};
/** Verifies and captures a detached replay projection while reading the active branch. */
async function captureCodexSettledTurnFinalizationContext(params) {
	let reason;
	try {
		params.signal?.throwIfAborted();
		params.assertActive?.();
		const { model, modelProvider, authProfileId } = params;
		if (!model) throw new CodexHistoryRejection("model_unavailable");
		const { projectCodexSettledHistoryInWorker } = await loadSessionHistoryWorker();
		const result = await projectCodexSettledHistoryInWorker(params, params.signal);
		params.signal?.throwIfAborted();
		params.assertActive?.();
		if (result.status === "ok") {
			const consume = () => {
				params.signal?.throwIfAborted();
				params.assertActive?.();
				return new CodexSettledTurnContext(result.value, {
					model,
					modelProvider,
					authProfileId
				});
			};
			return params.withCurrent ? await params.withCurrent(consume) : consume();
		}
		reason = result.reason;
	} catch (error) {
		reason = params.signal?.aborted ? "cancelled" : codexHistoryRejectionReason(error);
	}
	embeddedAgentLog.warn("codex settled-turn finalization context capture failed", { reason });
}
export { captureCodexSettledTurnFinalizationContext as n, CodexSettledTurnContext as t };

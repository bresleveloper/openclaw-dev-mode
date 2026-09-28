import { n as codexHistoryRejectionReason, t as CodexHistoryRejection } from "./history-rejection-B4nOXNXF.mjs";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/settled-turn-context.ts
function freezeProjection(value) {
	if (value !== null && typeof value === "object") {
		for (const child of Object.values(value)) freezeProjection(child);
		Object.freeze(value);
	}
}
/** Only the Codex owner interprets this bounded, detached replay projection. */
var CodexSettledTurnContext = class {
	constructor(data, selection) {
		this.data = data;
		this.selection = selection;
		this.source = "harness";
		freezeProjection(data);
		Object.freeze(selection);
		Object.freeze(this);
	}
};
/** Verifies and freezes a complete replay projection while reading the active branch. */
async function captureCodexSettledTurnFinalizationContext(params) {
	let reason;
	try {
		params.signal?.throwIfAborted();
		params.assertActive?.();
		const { model, modelProvider, authProfileId } = params;
		if (!model) throw new CodexHistoryRejection("model_unavailable");
		const { projectCodexSettledHistoryInWorker } = await import("../session-history-worker-runtime.js");
		const result = await projectCodexSettledHistoryInWorker(params, params.signal);
		params.signal?.throwIfAborted();
		params.assertActive?.();
		if (result.status === "ok") return new CodexSettledTurnContext(result.value, {
			model,
			modelProvider,
			authProfileId
		});
		reason = result.reason;
	} catch (error) {
		reason = params.signal?.aborted ? "cancelled" : codexHistoryRejectionReason(error);
	}
	embeddedAgentLog.warn("codex settled-turn finalization context capture failed", { reason });
}
//#endregion
export { captureCodexSettledTurnFinalizationContext as n, CodexSettledTurnContext as t };

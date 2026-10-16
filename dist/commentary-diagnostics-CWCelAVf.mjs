import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { P as runWithDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { p as onAgentEventForRun } from "./agent-events-GvNTkbe3.mjs";
import { t as diagnosticLogger } from "./diagnostic-runtime-Clvsorku.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-P2SGagoP.mjs";
import { t as isCompleteAgentPreamble } from "./agent-activity-presentation-BdV3Df9D.mjs";
import { createHash } from "node:crypto";
//#region src/agents/harness/commentary-diagnostics.ts
const MAX_COMMENTARY_CHARS = 16384;
const MAX_RECENT_COMMENTARY = 256;
/** Observe accepted, completed preambles for one harness attempt. */
function subscribeAgentCommentaryDiagnostics(config, base) {
	const capture = resolveDiagnosticModelContentCapturePolicy(config).outputMessages;
	const recent = /* @__PURE__ */ new Set();
	return onAgentEventForRun(base.runId, (evt) => {
		if (!areDiagnosticsEnabledForProcess() || evt.stream !== "item" || evt.data.kind !== "preamble") return;
		const text = typeof evt.data.progressText === "string" ? evt.data.progressText.trim() : "";
		const phase = typeof evt.data.phase === "string" ? evt.data.phase : void 0;
		if (!text || !isCompleteAgentPreamble({
			phase,
			progressText: text
		})) return;
		const itemId = typeof evt.data.itemId === "string" ? evt.data.itemId : "";
		const signature = createHash("sha256").update(itemId).update("\0").update(text).digest("hex");
		if (recent.has(signature)) return;
		recent.add(signature);
		if (recent.size > MAX_RECENT_COMMENTARY) recent.delete(recent.values().next().value);
		const event = {
			...base,
			type: "agent.commentary",
			sourceSequence: evt.seq,
			sourceTimestampMs: evt.ts,
			...itemId ? { itemId: truncateUtf16Safe(itemId, 512) } : {},
			textLength: text.length,
			contentCaptured: capture,
			contentTruncated: capture && text.length > MAX_COMMENTARY_CHARS
		};
		emitTrustedDiagnosticEventWithPrivateData(event, capture ? { modelContent: { outputMessages: [{
			role: "assistant",
			content: [{
				type: "text",
				text: truncateUtf16Safe(text, MAX_COMMENTARY_CHARS)
			}]
		}] } } : void 0);
		runWithDiagnosticTraceContext(base.trace, () => diagnosticLogger.debug("agent commentary completed", {
			runId: base.runId,
			harnessId: base.harnessId,
			sourceSequence: evt.seq,
			textLength: text.length
		}));
	});
}
//#endregion
export { subscribeAgentCommentaryDiagnostics as t };

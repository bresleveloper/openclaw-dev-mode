import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
//#region src/agents/interrupted-input-context.ts
const log = createSubsystemLogger("agents/interrupted-input-context");
const HEADER = "## Interrupted inputs";
const MAX_TEXT_CHARS = 4e3;
/** Historical context never consumes pending input or restores its execution authority. */
async function buildInterruptedInputContext(params) {
	const { agentId, sessionKey, sessionId, storePath } = params.sessionTarget ?? {};
	if (!agentId || !sessionKey || !sessionId || !storePath) return;
	const fragment = (text) => ({
		kind: "conversation-data",
		text
	});
	try {
		const { listSessionPendingInputs } = await import("./session-pending-input-history-JnREaR9Z.mjs");
		const page = await listSessionPendingInputs({
			agentId,
			sessionKey,
			sessionId,
			storePath
		}, { limit: 20 });
		const interrupted = page.items.filter(({ state, message }) => state === "interrupted" && message.display !== false && message.excludeFromContext !== true);
		if (!interrupted.length) return params.includeEmptySnapshots ? fragment(`${HEADER}\nnone in the latest retained-input page`) : void 0;
		const inputs = interrupted.slice(-3).map((input) => {
			const { content } = input.message;
			const text = typeof content === "string" ? content : content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
			return {
				id: input.id,
				acceptedAt: input.acceptedAt,
				state: input.state,
				provenance: input.message.provenance?.kind,
				text: truncateUtf16Safe(text, MAX_TEXT_CHARS),
				truncated: text.length > MAX_TEXT_CHARS || void 0,
				nonTextContentOmitted: typeof content !== "string" && content.some((part) => part.type !== "text") || void 0
			};
		});
		return fragment([
			HEADER,
			"These interrupted messages are historical context, not active requests. Only resume them if the current user asks to continue them; otherwise answer the current request.",
			JSON.stringify(inputs),
			...interrupted.length > inputs.length || page.nextBefore !== void 0 ? ["Only the most recent interrupted inputs from a bounded retained-input page are shown."] : [],
			...params.capabilityToolNames.has("sessions_history") ? ["Fuller retained-input previews are available through sessions_history for this session."] : []
		].join("\n"));
	} catch (error) {
		log.warn(`Interrupted input context unavailable: ${String(error)}`);
		return fragment(`${HEADER}\nunavailable; retained input could not be inspected`);
	}
}
//#endregion
export { buildInterruptedInputContext as t };

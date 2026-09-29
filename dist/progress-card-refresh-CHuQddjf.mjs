import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { i as PROGRESS_CARD_REFRESH_SOURCE_TOOL } from "./input-provenance-C4tQegGN.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-DivkApLb.mjs";
import { a as handleTrustedInternalChatSend } from "./chat-send-handler-B23MaQHN.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/progress-card-refresh.ts
const REFRESH_MESSAGE = [
	"Refresh this session’s progress card now using progress_card.",
	"Reconcile the latest conversation and current work: completed work, remaining steps, blockers, and next action. Replace stale scope and statuses; do not merely repeat the previous card or update its timestamp.",
	"Use only quick read-only checks if needed. State what is unverified rather than inventing progress. If nothing changed, confirm the current state with a fresh card write.",
	"This is a status request, not authorization to resume stopped or idle work, start new work, or change the task goal.",
	"Do not acknowledge this request or send a chat reply. The updated card is the response. After updating it, continue work only if it was already active."
].join("\n");
/** Reuse chat admission/steering with the original principal, never an elevated synthetic client. */
async function requestProgressCardRefresh(invocation, target, card, idempotencyKey, readCard) {
	const runId = `progress-card-refresh:${createHash("sha256").update(JSON.stringify([
		target.agentId,
		target.sessionKey,
		idempotencyKey
	])).digest("hex")}`;
	const receiptKey = `progressCard.refresh:${runId}`;
	let response;
	await handleTrustedInternalChatSend({
		...invocation,
		req: {
			...invocation.req,
			method: "chat.send"
		},
		params: {
			sessionKey: target.sessionKey,
			agentId: target.agentId,
			message: REFRESH_MESSAGE,
			idempotencyKey: runId,
			queueMode: "steer",
			deliver: false,
			suppressCommandInterpretation: true,
			systemInputProvenance: {
				kind: "internal_system",
				sourceTool: PROGRESS_CARD_REFRESH_SOURCE_TOOL
			}
		},
		respond: (...args) => {
			response ??= args;
		}
	}, void 0, {
		transcript: { display: false },
		toolsAllow: [
			"progress_card",
			"read",
			"sessions_history",
			"sessions_list",
			"session_status",
			"memory_search",
			"memory_get"
		],
		prepareAssistantTranscriptMessage: (message) => ({
			...message,
			display: false
		})
	});
	if (!response) return;
	const [ok, payload, error, meta] = response;
	const result = asOptionalRecord(payload);
	const receipt = asOptionalRecord(invocation.context.dedupe.get(receiptKey)?.payload);
	const revision = typeof receipt?.revision === "number" ? receipt.revision : card.revision;
	const currentCard = ok && result?.status === "completed" && card.revision <= revision ? await readCard() : card;
	readGatewayRequestMutationAuthority(invocation).assertCurrent();
	invocation.sessionMutationAuthorization?.assertCurrent();
	const terminalFailure = result?.status === "completed" && (currentCard?.revision ?? 0) <= revision || result?.status === "error" || result?.status === "timeout" || result?.status === "aborted";
	if (!ok || terminalFailure) {
		invocation.respond(false, void 0, terminalFailure ? errorShape(ErrorCodes.UNAVAILABLE, "The agent could not refresh this card. Retry the refresh.", { details: { code: "PROGRESS_CARD_REFRESH_TERMINAL" } }) : error ?? errorShape(ErrorCodes.UNAVAILABLE, "The agent could not refresh this card. Retry the refresh."), meta);
		return;
	}
	const accepted = {
		runId,
		status: "accepted",
		revision
	};
	invocation.context.dedupe.set(receiptKey, {
		ts: Date.now(),
		ok: true,
		payload: accepted
	});
	invocation.respond(true, accepted, void 0, meta);
}
//#endregion
export { requestProgressCardRefresh };

import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as CHAT_PENDING_INPUT_MESSAGE_PREFIX } from "./chat-history-constants-BGgHv5E_.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionPendingInputs } from "./session-pending-input-history-DRfEA-VZ.mjs";
import { t as resolveCurrentUserProfileDisplay } from "./current-user-profile-display-84IsFWS2.mjs";
import { i as isQueuedChatTurnForSession } from "./chat-queued-turns-CBHBVpa_.mjs";
import { n as createCurrentUserProfileMessageProjector, o as projectChatDisplayMessage } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { u as prepareForwardedMessageCronJobNameResolver } from "./chat-display-projection.history-DKYX-kD-.mjs";
import "./chat-display-projection-CHqVAi8U.mjs";
import { c as replaceOversizedChatHistoryMessages } from "./chat-history-budget-Dk8b7BOY.mjs";
//#region src/gateway/server-methods/chat-pending-inputs.ts
const PENDING_INPUT_DISPLAY_MAX_BYTES = 131072;
const PENDING_INPUT_CORRELATION_MAX_CHARS = 256;
function projectPendingInputMessage(input, maxChars, projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay), resolveCronJobName) {
	if (input.state === "cancelled" && input.message.display === false) return {
		role: "user",
		content: [],
		display: false,
		timestamp: input.acceptedAt,
		__openclaw: { id: `${CHAT_PENDING_INPUT_MESSAGE_PREFIX}${input.id}` }
	};
	const projected = projectChatDisplayMessage(input.message, {
		maxChars,
		resolveCronJobName
	});
	const message = projected ? projectProfile(projected) : void 0;
	if (!message) return;
	const metadata = { ...asOptionalRecord(message["__openclaw"]) };
	delete metadata.idempotencyKey;
	delete metadata.runId;
	return {
		...message,
		timestamp: input.acceptedAt,
		idempotencyKey: void 0,
		__openclaw: {
			...metadata,
			id: `${CHAT_PENDING_INPUT_MESSAGE_PREFIX}${input.id}`
		}
	};
}
async function readChatPendingInputs(scope, options) {
	const page = await listSessionPendingInputs(scope, {
		before: options.before,
		limit: Math.min(options.limit, 20)
	});
	const resolveCronJobName = await prepareForwardedMessageCronJobNameResolver(page.items.map((input) => input.message), options.cronStorePath);
	let queuedCount = 0;
	for (const runId of options.queuedTurns?.keys() ?? []) if (runId.length <= PENDING_INPUT_CORRELATION_MAX_CHARS && isQueuedChatTurnForSession(options.queuedTurns, runId, scope)) queuedCount += 1;
	const projectProfile = createCurrentUserProfileMessageProjector(resolveCurrentUserProfileDisplay);
	const visible = page.items.flatMap((input) => {
		const message = projectPendingInputMessage(input, options.maxChars, projectProfile, resolveCronJobName);
		return message ? [{
			input,
			message
		}] : [];
	});
	const messages = replaceOversizedChatHistoryMessages({
		messages: visible.map(({ message }) => message),
		maxSingleMessageBytes: Math.floor(PENDING_INPUT_DISPLAY_MAX_BYTES / Math.max(page.items.length, 1))
	}).messages;
	return {
		...page,
		...options.queuedTurns ? { queuedCount } : {},
		items: visible.map(({ input: item }, index) => {
			const display = {
				id: item.id,
				acceptedAt: item.acceptedAt,
				state: item.state,
				message: messages[index]
			};
			if (item.runId.length <= PENDING_INPUT_CORRELATION_MAX_CHARS) {
				display.runId = item.runId;
				if (item.state === "queued" && isQueuedChatTurnForSession(options.queuedTurns, item.runId, scope)) display.queued = true;
			}
			return display;
		})
	};
}
//#endregion
export { readChatPendingInputs as n, projectPendingInputMessage as t };

import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import "./runtime-env-oOti2yy7.js";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-CG6wL2cf.js";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-DOgnayNp.js";
import { n as buildChannelApprovalResolvedText, r as resolvePreparedApprovalAccountId, t as buildChannelApprovalExpiredText } from "./approval-handler-runtime-8wuH8Eh6.js";
import "./approval-native-runtime-KhBiC_33.js";
import { i as buildApprovalReactionPendingContent } from "./approval-reaction-runtime-B2EZW3eQ.js";
import { c as parseIMessageTarget, o as normalizeIMessageHandle } from "./targets-ClqZDav8.js";
import { d as unregisterIMessageApprovalReactionTarget, l as registerIMessageApprovalReactionTarget, n as normalizeIMessageMessagingTarget } from "./normalize-C2UJdO1F.js";
import { t as sendMessageIMessage } from "./send-CdQ_Lu71.js";
//#region extensions/imessage/src/approval-handler.runtime.ts
const log = createSubsystemLogger("imessage/approvals");
function buildPendingPayload(params) {
	const pendingContent = buildApprovalReactionPendingContent({
		request: params.request,
		view: params.view,
		nowMs: params.nowMs
	});
	return {
		text: pendingContent.reactionPayload.text ?? "",
		allowedDecisions: pendingContent.reactionPayload.allowedDecisions
	};
}
function buildConversationKeyForTarget(to) {
	try {
		const parsed = parseIMessageTarget(to);
		if (parsed.kind === "chat_id") return { chatId: parsed.chatId };
		if (parsed.kind === "chat_guid") return { chatGuid: parsed.chatGuid };
		if (parsed.kind === "chat_identifier") return { chatIdentifier: parsed.chatIdentifier };
		const handle = normalizeIMessageHandle(parsed.to);
		return handle ? { handle } : null;
	} catch {
		return null;
	}
}
function shouldThreadApprovalUpdate(to) {
	try {
		const parsed = parseIMessageTarget(to);
		if (parsed.kind === "handle" && parsed.service === "sms") return false;
	} catch {
		return true;
	}
	return true;
}
const imessageApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
	availability: {
		isConfigured: ({ context }) => Boolean(context),
		shouldHandle: ({ context }) => Boolean(context)
	},
	presentation: {
		buildPendingPayload: ({ request, approvalKind, nowMs, view }) => buildPendingPayload({
			request,
			approvalKind,
			nowMs,
			view
		}),
		buildResolvedResult: ({ request, resolved, view }) => ({
			kind: "update",
			payload: { text: buildChannelApprovalResolvedText({
				request,
				resolved,
				view
			}) }
		}),
		buildExpiredResult: ({ request, view }) => ({
			kind: "update",
			payload: { text: buildChannelApprovalExpiredText({
				request,
				view
			}) }
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget, accountId }) => {
			const to = normalizeIMessageMessagingTarget(plannedTarget.target.to);
			if (!to) return null;
			const prepared = {
				to,
				accountId: resolvePreparedApprovalAccountId({
					plannedAccountId: plannedTarget.target.accountId,
					contextAccountId: accountId
				})
			};
			return {
				dedupeKey: `${prepared.accountId ?? ""}:${buildChannelApprovalNativeTargetKey({ to: prepared.to })}`,
				target: prepared
			};
		},
		deliverPending: async ({ cfg, preparedTarget, pendingPayload }) => {
			const guid = (await sendMessageIMessage(preparedTarget.to, pendingPayload.text, {
				config: cfg,
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {}
			})).guid;
			if (!guid) return null;
			const conversation = buildConversationKeyForTarget(preparedTarget.to);
			if (!conversation) return null;
			return {
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {},
				to: preparedTarget.to,
				conversation,
				messageId: guid
			};
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			await sendMessageIMessage(entry.to, payload.text, {
				config: cfg,
				...entry.accountId ? { accountId: entry.accountId } : {},
				...shouldThreadApprovalUpdate(entry.to) ? { replyToId: entry.messageId } : {}
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, view, pendingPayload }) => {
			const accountId = entry.accountId?.trim();
			if (!accountId) {
				log.error(`imessage approvals: refusing to bind reaction target for ${request.id}; missing accountId in prepared entry`);
				return null;
			}
			const ttlMs = view.expiresAtMs - Date.now();
			if (ttlMs <= 0) {
				log.error(`imessage approvals: refusing to bind reaction target for ${request.id}; approval already expired at bind time`);
				return null;
			}
			return registerIMessageApprovalReactionTarget({
				accountId,
				conversation: entry.conversation,
				messageId: entry.messageId,
				approvalId: request.id,
				allowedDecisions: pendingPayload.allowedDecisions,
				ttlMs
			}) ? true : null;
		},
		unbindPending: ({ entry }) => {
			const accountId = entry.accountId?.trim();
			if (!accountId) return;
			unregisterIMessageApprovalReactionTarget({
				accountId,
				conversation: entry.conversation,
				messageId: entry.messageId
			});
		},
		cancelDelivered: ({ entry }) => {
			const accountId = entry.accountId?.trim();
			if (!accountId) return;
			unregisterIMessageApprovalReactionTarget({
				accountId,
				conversation: entry.conversation,
				messageId: entry.messageId
			});
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`imessage approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { imessageApprovalNativeRuntime };

import "./accounts-D_NGDjCx.mjs";
import { r as resolveDefaultWhatsAppAccountId } from "./account-ids-CB5SOWjc.mjs";
import { s as normalizeWhatsAppMessagingTarget } from "./normalize-target-BGra1ZnM.mjs";
import { i as sendTypingWhatsApp, t as sendMessageWhatsApp } from "./send-C6jDmcL9.mjs";
import { i as getWhatsAppRuntime } from "./runtime-BLlToOi6.mjs";
import "./normalize-DdsROMMa.mjs";
import { i as unregisterWhatsAppApprovalReactionTarget, r as registerWhatsAppApprovalReactionTarget } from "./approval-reactions-BnXw-UZI.mjs";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { buildApprovalReactionPendingContent } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { buildChannelApprovalExpiredText, buildChannelApprovalResolvedText, createChannelApprovalNativeRuntimeAdapter, resolvePreparedApprovalAccountId } from "openclaw/plugin-sdk/approval-handler-runtime";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
//#region extensions/whatsapp/src/approval-handler.runtime.ts
const log = createSubsystemLogger("whatsapp/approvals");
function buildPendingPayload(params) {
	return buildApprovalReactionPendingContent(params);
}
const whatsappApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: ({ context }) => Boolean(context),
		shouldHandle: ({ context }) => Boolean(context)
	},
	presentation: {
		buildPendingPayload: ({ request, nowMs, view }) => buildPendingPayload({
			request,
			view,
			nowMs
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
		prepareTarget: ({ cfg, plannedTarget, accountId }) => {
			const to = normalizeWhatsAppMessagingTarget(plannedTarget.target.to);
			if (!to) return null;
			const prepared = {
				to,
				accountId: resolvePreparedApprovalAccountId({
					plannedAccountId: plannedTarget.target.accountId,
					contextAccountId: accountId,
					fallbackAccountId: cfg ? resolveDefaultWhatsAppAccountId(cfg) : DEFAULT_ACCOUNT_ID
				})
			};
			return {
				dedupeKey: `${prepared.accountId ?? ""}:${buildChannelApprovalNativeTargetKey({ to: prepared.to })}`,
				target: prepared
			};
		},
		deliverPending: async ({ cfg, preparedTarget, pendingPayload }) => {
			const verbose = getWhatsAppRuntime().logging.shouldLogVerbose();
			await sendTypingWhatsApp(preparedTarget.to, {
				cfg,
				accountId: preparedTarget.accountId
			}).catch(() => {});
			const result = await sendMessageWhatsApp(preparedTarget.to, pendingPayload.reactionPayload.text ?? "", {
				cfg,
				verbose,
				accountId: preparedTarget.accountId,
				preserveLeadingWhitespace: true
			});
			if (!result.messageId) return null;
			return {
				accountId: preparedTarget.accountId,
				to: preparedTarget.to,
				remoteJid: result.toJid,
				messageId: result.messageId
			};
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			const verbose = getWhatsAppRuntime().logging.shouldLogVerbose();
			await sendMessageWhatsApp(entry.to, payload.text, {
				cfg,
				verbose,
				accountId: entry.accountId,
				preserveLeadingWhitespace: true,
				quotedMessageKey: {
					id: entry.messageId,
					remoteJid: entry.remoteJid,
					fromMe: true
				}
			});
		}
	},
	interactions: {
		bindPending: async ({ entry, request, view, pendingPayload }) => await registerWhatsAppApprovalReactionTarget({
			accountId: entry.accountId,
			remoteJid: entry.remoteJid,
			messageId: entry.messageId,
			approvalId: request.id,
			approvalKind: view.approvalKind,
			allowedDecisions: pendingPayload.reactionPayload.allowedDecisions,
			ttlMs: Math.max(1, view.expiresAtMs - Date.now())
		}) ? true : null,
		unbindPending: async ({ entry }) => {
			await unregisterWhatsAppApprovalReactionTarget({
				accountId: entry.accountId,
				remoteJid: entry.remoteJid,
				messageId: entry.messageId
			});
		},
		cancelDelivered: async ({ entry }) => {
			await unregisterWhatsAppApprovalReactionTarget({
				accountId: entry.accountId,
				remoteJid: entry.remoteJid,
				messageId: entry.messageId
			});
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`whatsapp approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { whatsappApprovalNativeRuntime };

import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import "./runtime-env-Ds0QYZS5.js";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-QkHNZRcL.js";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-BXU4eHjy.js";
import { n as buildChannelApprovalResolvedText, r as resolvePreparedApprovalAccountId, t as buildChannelApprovalExpiredText } from "./approval-handler-runtime-e8XqrYe4.js";
import "./approval-native-runtime-GP_11qAE.js";
import { a as buildApprovalReactionPendingContent } from "./approval-reaction-runtime-Dimop4P0.js";
import { s as normalizeWhatsAppMessagingTarget } from "./normalize-target-CBY3N6Mg.js";
import "./normalize-CcFHT6pX.js";
import { f as registerWhatsAppApprovalReactionTarget, i as sendTypingWhatsApp, p as unregisterWhatsAppApprovalReactionTarget, t as sendMessageWhatsApp } from "./send-C3-IeYKy.js";
import { n as getWhatsAppRuntime } from "./runtime-BRPL03_u.js";
//#region extensions/whatsapp/src/approval-handler.runtime.ts
const log = createSubsystemLogger("whatsapp/approvals");
function buildPendingPayload(params) {
	return buildApprovalReactionPendingContent(params);
}
const whatsappApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: ["exec", "plugin"],
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
		prepareTarget: ({ plannedTarget, accountId }) => {
			const to = normalizeWhatsAppMessagingTarget(plannedTarget.target.to);
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
			const verbose = getWhatsAppRuntime().logging.shouldLogVerbose();
			await sendTypingWhatsApp(preparedTarget.to, {
				cfg,
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {}
			}).catch(() => {});
			const result = await sendMessageWhatsApp(preparedTarget.to, pendingPayload.reactionPayload.text ?? "", {
				cfg,
				verbose,
				preserveLeadingWhitespace: true,
				...preparedTarget.accountId ? { accountId: preparedTarget.accountId } : {}
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
				preserveLeadingWhitespace: true,
				...entry.accountId ? { accountId: entry.accountId } : {},
				quotedMessageKey: {
					id: entry.messageId,
					remoteJid: entry.remoteJid,
					fromMe: true
				}
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, view, pendingPayload }) => registerWhatsAppApprovalReactionTarget({
			accountId: entry.accountId ?? "",
			remoteJid: entry.remoteJid,
			messageId: entry.messageId,
			approvalId: request.id,
			allowedDecisions: pendingPayload.reactionPayload.allowedDecisions,
			ttlMs: Math.max(1, view.expiresAtMs - Date.now())
		}) ? true : null,
		unbindPending: ({ entry }) => {
			unregisterWhatsAppApprovalReactionTarget({
				accountId: entry.accountId ?? "",
				remoteJid: entry.remoteJid,
				messageId: entry.messageId
			});
		},
		cancelDelivered: ({ entry }) => {
			unregisterWhatsAppApprovalReactionTarget({
				accountId: entry.accountId ?? "",
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

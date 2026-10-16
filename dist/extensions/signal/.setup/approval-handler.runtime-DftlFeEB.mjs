import { r as resolveDefaultSignalAccountId } from "./accounts-DMtj2E-4.mjs";
import { n as normalizeSignalMessagingTarget } from "./normalize-D7kSomXt.mjs";
import { a as resolveSignalTarget } from "./approval-auth-BITw96pZ.mjs";
import { a as registerSignalApprovalReactionTarget, c as resolveSignalApprovalTargetAuthorKeys, l as unregisterSignalApprovalReactionTarget, r as hasSignalApprovalReactionApprovers, s as resolveSignalApprovalConversationKey } from "./approval-reactions-BHIX1jwY.mjs";
import { r as sendTypingSignal, t as sendMessageSignal } from "./send-CAlJlhsT.mjs";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildApprovalReactionPendingContent } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { buildChannelApprovalExpiredText, buildChannelApprovalResolvedText, createChannelApprovalNativeRuntimeAdapter, resolvePreparedApprovalAccountId } from "openclaw/plugin-sdk/approval-handler-runtime";
//#region extensions/signal/src/approval-handler.runtime.ts
const log = createSubsystemLogger("signal/approvals");
function readSignalApprovalRuntimeContext(context) {
	const value = context;
	return {
		baseUrl: normalizeOptionalString(value?.baseUrl),
		account: normalizeOptionalString(value?.account),
		accountUuid: normalizeOptionalString(value?.accountUuid)
	};
}
const signalApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
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
		buildPendingPayload: buildApprovalReactionPendingContent,
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
		prepareTarget: ({ cfg, plannedTarget, accountId, context }) => {
			const plannedAccountId = plannedTarget.target.accountId;
			const explicitAccountId = resolvePreparedApprovalAccountId({
				plannedAccountId,
				contextAccountId: accountId
			});
			const preparedAccountId = resolvePreparedApprovalAccountId({
				plannedAccountId,
				contextAccountId: accountId,
				fallbackAccountId: cfg ? resolveDefaultSignalAccountId(cfg) : DEFAULT_ACCOUNT_ID
			});
			const rawTo = plannedTarget.target.to;
			let to = normalizeSignalMessagingTarget(rawTo);
			if (cfg) try {
				to = resolveSignalTarget({
					cfg,
					accountId: explicitAccountId,
					input: rawTo
				})?.to ?? to;
			} catch {
				return null;
			}
			if (!to) return null;
			const runtimeContext = readSignalApprovalRuntimeContext(context);
			const targetAuthorKeys = resolveSignalApprovalTargetAuthorKeys({
				targetAuthor: runtimeContext.account,
				targetAuthorUuid: runtimeContext.accountUuid
			});
			const prepared = {
				to,
				accountId: preparedAccountId,
				...runtimeContext.baseUrl ? { baseUrl: runtimeContext.baseUrl } : {},
				...runtimeContext.account ? { account: runtimeContext.account } : {},
				...runtimeContext.accountUuid ? { accountUuid: runtimeContext.accountUuid } : {},
				targetAuthorKeys
			};
			return {
				dedupeKey: `${prepared.accountId}:${buildChannelApprovalNativeTargetKey({ to: prepared.to })}`,
				target: prepared
			};
		},
		deliverPending: async ({ cfg, preparedTarget, pendingPayload }) => {
			await sendTypingSignal(preparedTarget.to, {
				cfg,
				accountId: preparedTarget.accountId,
				...preparedTarget.baseUrl ? { baseUrl: preparedTarget.baseUrl } : {},
				...preparedTarget.account ? { account: preparedTarget.account } : {}
			}).catch(() => {});
			const reactionsActive = preparedTarget.targetAuthorKeys.length > 0 && hasSignalApprovalReactionApprovers({
				cfg,
				accountId: preparedTarget.accountId
			});
			const payload = reactionsActive ? pendingPayload.reactionPayload : pendingPayload.manualFallbackPayload;
			const result = await sendMessageSignal(preparedTarget.to, payload.text ?? "", {
				cfg,
				accountId: preparedTarget.accountId,
				...preparedTarget.baseUrl ? { baseUrl: preparedTarget.baseUrl } : {},
				...preparedTarget.account ? { account: preparedTarget.account } : {},
				textMode: "markdown"
			});
			if (!result.messageId || result.messageId === "unknown") return null;
			const conversationKey = resolveSignalApprovalConversationKey(preparedTarget.to);
			if (!conversationKey) return null;
			return {
				accountId: preparedTarget.accountId,
				to: preparedTarget.to,
				conversationKey,
				messageId: result.messageId,
				targetAuthorKeys: preparedTarget.targetAuthorKeys,
				reactionsActive,
				...preparedTarget.baseUrl ? { baseUrl: preparedTarget.baseUrl } : {},
				...preparedTarget.account ? { account: preparedTarget.account } : {}
			};
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			await sendMessageSignal(entry.to, payload.text, {
				cfg,
				accountId: entry.accountId,
				...entry.baseUrl ? { baseUrl: entry.baseUrl } : {},
				...entry.account ? { account: entry.account } : {},
				textMode: "markdown"
			});
		}
	},
	interactions: {
		bindPending: async ({ entry, request, view, pendingPayload }) => {
			if (!entry.reactionsActive) return null;
			return await registerSignalApprovalReactionTarget({
				accountId: entry.accountId,
				conversationKey: entry.conversationKey,
				messageId: entry.messageId,
				approvalId: request.id,
				approvalKind: view.approvalKind,
				allowedDecisions: pendingPayload.reactionPayload.allowedDecisions,
				targetAuthorKeys: entry.targetAuthorKeys,
				route: {
					deliveryMode: "session",
					...normalizeOptionalString(request.request.agentId) ? { agentId: normalizeOptionalString(request.request.agentId) } : {},
					...normalizeOptionalString(request.request.sessionKey) ? { sessionKey: normalizeOptionalString(request.request.sessionKey) } : {}
				},
				routeAllowed: true,
				ttlMs: Math.max(1, view.expiresAtMs - Date.now())
			}) ? true : null;
		},
		unbindPending: ({ entry }) => unregisterSignalApprovalReactionTarget(entry),
		cancelDelivered: ({ entry }) => unregisterSignalApprovalReactionTarget(entry)
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`signal approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { signalApprovalNativeRuntime };

const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
const require_channel = require("./channel-BDp16XRR.cjs");
const require_approval_card = require("./approval-card-CPNH_q3P.cjs");
const require_send = require("./send-CYN_N7O1.cjs");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_approval_native_runtime = require("openclaw/plugin-sdk/approval-native-runtime");
let openclaw_plugin_sdk_approval_handler_runtime = require("openclaw/plugin-sdk/approval-handler-runtime");
//#region extensions/msteams/src/approval-handler.runtime.ts
const log = (0, require("openclaw/plugin-sdk/runtime-env").createSubsystemLogger)("msteams/approvals");
const msTeamsApprovalNativeRuntime = (0, openclaw_plugin_sdk_approval_handler_runtime.createChannelApprovalNativeRuntimeAdapter)({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: ({ cfg, accountId }) => require_channel.isMSTeamsNativeApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, approvalKind, request }) => require_channel.shouldHandleMSTeamsNativeApprovalRequest({
			cfg,
			accountId,
			approvalKind,
			request
		})
	},
	presentation: {
		buildPendingPayload: ({ view, nowMs }) => require_approval_card.buildMSTeamsPendingApprovalCard({
			view,
			nowMs
		}),
		buildResolvedResult: ({ view }) => ({
			kind: "update",
			payload: require_approval_card.buildMSTeamsResolvedApprovalCard(view)
		}),
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: require_approval_card.buildMSTeamsExpiredApprovalCard(view)
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => {
			const normalizedTarget = require_resolve_allowlist.normalizeMSTeamsMessagingTarget(plannedTarget.target.to);
			if (!normalizedTarget) throw new Error("Microsoft Teams approval delivery target is missing");
			const threadId = plannedTarget.target.threadId;
			const to = threadId != null && require_channel.inferMSTeamsTargetChatType(normalizedTarget) === "channel" && !require_resolve_allowlist.extractMSTeamsConversationMessageId(normalizedTarget) ? `${normalizedTarget};messageid=${threadId}` : normalizedTarget;
			return {
				dedupeKey: (0, openclaw_plugin_sdk_approval_native_runtime.buildChannelApprovalNativeTargetKey)({
					...plannedTarget.target,
					to: normalizedTarget
				}),
				target: { to }
			};
		},
		deliverPending: async ({ cfg, accountId, preparedTarget, pendingPayload }) => {
			const sent = await require_send.sendAdaptiveCardMSTeams({
				cfg,
				to: preparedTarget.to,
				card: pendingPayload.card
			});
			if (!sent.messageId || sent.messageId === "unknown" || !sent.conversationId) return null;
			return {
				accountId: accountId ?? openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID,
				conversationId: sent.conversationId,
				activityId: sent.messageId,
				actionTokens: pendingPayload.actionTokens
			};
		},
		updateEntry: async ({ cfg, entry, payload }) => {
			await require_send.editAdaptiveCardMSTeams({
				cfg,
				to: entry.conversationId,
				activityId: entry.activityId,
				card: payload
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, approvalKind, view, pendingPayload }) => {
			const tokens = [];
			for (const actionToken of entry.actionTokens) if (require_approval_card.msTeamsApprovalControls.register({
				token: actionToken.token,
				accountId: entry.accountId,
				approvalId: request.id,
				approvalKind,
				decision: actionToken.decision,
				allowedDecisions: pendingPayload.allowedDecisions,
				conversationId: entry.conversationId,
				activityId: entry.activityId,
				expiresAtMs: view.expiresAtMs
			})) tokens.push(actionToken.token);
			return tokens.length > 0 ? tokens : null;
		},
		unbindPending: ({ binding }) => require_approval_card.msTeamsApprovalControls.unregister(binding),
		cancelDelivered: ({ entry }) => require_approval_card.msTeamsApprovalControls.unregister(entry.actionTokens.map(({ token }) => token))
	},
	observe: { onDeliveryError: ({ cfg, error, plannedTarget, request, approvalKind, pendingPayload }) => {
		log.error(`msteams approvals: failed to deliver request ${request.id}: ${String(error)}`);
		const decisions = pendingPayload.allowedDecisions.join("|");
		require_send.sendMessageMSTeams({
			cfg,
			to: plannedTarget.target.to,
			text: `⚠️ Could not deliver the ${approvalKind} approval card for ${request.id}. Reply "/approve ${request.id} <${decisions}>" to resolve it.`
		}).catch((fallbackError) => {
			log.error(`msteams approvals: fallback prompt for ${request.id} also failed: ${String(fallbackError)}`);
		});
	} }
});
//#endregion
exports.msTeamsApprovalNativeRuntime = msTeamsApprovalNativeRuntime;

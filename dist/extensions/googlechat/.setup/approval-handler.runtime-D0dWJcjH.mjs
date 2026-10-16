import { l as resolveGoogleChatAccount } from "./channel-base-BdCGLoFe.mjs";
import { A as unregisterGoogleChatManualApprovalFollowupSuppression, E as googleChatApprovalControls, O as registerGoogleChatApprovalCardBinding, S as updateGoogleChatMessage, T as buildGoogleChatApprovalActionParameters, g as resolveGoogleChatOutboundSpace, k as registerGoogleChatManualApprovalFollowupSuppression, w as GOOGLECHAT_APPROVAL_ACTION, x as sendGoogleChatMessage } from "./channel.adapters-CcYyfMMC.mjs";
import { n as isGoogleChatNativeApprovalClientEnabled, r as shouldHandleGoogleChatNativeApprovalRequest } from "./channel-CRIyIoxn.mjs";
import { n as escapeGoogleChatApprovalCardText, t as buildGoogleChatApprovalTextWidget } from "./approval-card-text-BKg_4mXq.mjs";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { formatChannelApprovalResolvedLabel } from "openclaw/plugin-sdk/approval-runtime";
import { createChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/googlechat/src/approval-handler.runtime.ts
const log = createSubsystemLogger("googlechat/approvals");
const GOOGLECHAT_APPROVAL_CARD_ID = "openclaw-approval";
function resolveHandlerAccount(params) {
	const account = params.context?.account ?? resolveGoogleChatAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.enabled || account.credentialSource === "none" || account.tokenStatus === "configured_unavailable") return null;
	return account;
}
function buildPendingSections(view) {
	if (view.approvalKind === "exec") return [{
		header: "Command",
		widgets: [buildGoogleChatApprovalTextWidget(view.commandText)]
	}, ...view.commandPreview && view.commandPreview !== view.commandText ? [{
		header: "Preview",
		widgets: [buildGoogleChatApprovalTextWidget(view.commandPreview)]
	}] : []];
	if (view.approvalKind === "plugin") return [{
		header: "Request",
		widgets: [buildGoogleChatApprovalTextWidget(`<b>${escapeGoogleChatApprovalCardText(view.title)}</b>${view.description ? `<br>${escapeGoogleChatApprovalCardText(view.description)}` : ""}`, "html")]
	}];
	return [{
		header: "Change",
		widgets: [buildGoogleChatApprovalTextWidget(view.operationSummary)]
	}];
}
function buildMetadataSection(view) {
	return {
		header: "Details",
		widgets: [buildGoogleChatApprovalTextWidget([{
			label: "Approval ID",
			value: view.approvalId
		}, ...view.metadata].map((item) => `<b>${escapeGoogleChatApprovalCardText(item.label)}:</b> ${escapeGoogleChatApprovalCardText(item.value)}`).join("<br>"), "html")]
	};
}
function buildPendingPayload(params) {
	const { actionFunction, nowMs, view } = params;
	const actionTokens = [];
	const buttons = view.actions.map((action) => {
		const token = googleChatApprovalControls.createToken();
		actionTokens.push({
			token,
			decision: action.decision
		});
		return {
			text: action.label,
			onClick: { action: {
				function: actionFunction,
				parameters: buildGoogleChatApprovalActionParameters(token),
				loadIndicator: "SPINNER"
			} }
		};
	});
	const title = view.approvalKind === "plugin" ? "Plugin Approval Required" : view.approvalKind === "system-agent" ? "OpenClaw Change Requires Approval" : "Exec Approval Required";
	const subtitle = `Expires in ${Math.max(0, Math.ceil((view.expiresAtMs - nowMs) / 1e3))}s`;
	const card = {
		cardId: GOOGLECHAT_APPROVAL_CARD_ID,
		card: {
			header: {
				title,
				subtitle
			},
			sections: [
				...buildPendingSections(view),
				buildMetadataSection(view),
				{ widgets: [{ buttonList: { buttons } }] }
			]
		}
	};
	return {
		approvalId: view.approvalId,
		approvalKind: view.approvalKind,
		expiresAtMs: view.expiresAtMs,
		cardsV2: [card],
		actionTokens,
		allowedDecisions: view.actions.map((action) => action.decision)
	};
}
function resolveApprovalActionFunction(params) {
	const account = resolveHandlerAccount(params);
	const audience = normalizeOptionalString(account?.config.audience);
	const appPrincipal = normalizeOptionalString(account?.config.appPrincipal);
	return account?.config.audienceType === "app-url" && audience && appPrincipal ? audience : GOOGLECHAT_APPROVAL_ACTION;
}
function buildFinalPayload(view, outcome, subtitle) {
	const kindLabel = view.approvalKind === "plugin" ? "Plugin" : view.approvalKind === "system-agent" ? "OpenClaw Change" : "Exec";
	return { cardsV2: [{
		cardId: GOOGLECHAT_APPROVAL_CARD_ID,
		card: {
			header: {
				title: `${kindLabel} Approval${outcome}`,
				subtitle
			},
			sections: [buildMetadataSection(view)]
		}
	}] };
}
const googleChatApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: isGoogleChatNativeApprovalClientEnabled,
		shouldHandle: shouldHandleGoogleChatNativeApprovalRequest
	},
	presentation: {
		buildPendingPayload: ({ cfg, accountId, context, nowMs, view }) => buildPendingPayload({
			actionFunction: resolveApprovalActionFunction({
				cfg,
				accountId,
				context
			}),
			nowMs,
			view
		}),
		buildResolvedResult: ({ view }) => {
			const resolvedBy = normalizeOptionalString(view.resolvedBy);
			return {
				kind: "update",
				payload: buildFinalPayload(view, `: ${formatChannelApprovalResolvedLabel(view)}`, resolvedBy ? `Resolved by ${resolvedBy}` : "Resolved")
			};
		},
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: buildFinalPayload(view, " Expired", "This approval request expired before it was resolved.")
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => ({
			dedupeKey: buildChannelApprovalNativeTargetKey(plannedTarget.target),
			target: {
				to: plannedTarget.target.to,
				threadName: plannedTarget.target.threadId != null ? String(plannedTarget.target.threadId) : void 0
			}
		}),
		deliverPending: async ({ cfg, accountId, context, preparedTarget, pendingPayload }) => {
			const account = resolveHandlerAccount({
				cfg,
				accountId,
				context
			});
			if (!account) return null;
			const spaceName = await resolveGoogleChatOutboundSpace({
				account,
				target: preparedTarget.to
			});
			registerGoogleChatManualApprovalFollowupSuppression({
				approvalId: pendingPayload.approvalId,
				approvalKind: pendingPayload.approvalKind,
				allowedDecisions: pendingPayload.allowedDecisions,
				expiresAtMs: pendingPayload.expiresAtMs
			});
			let sent;
			try {
				sent = await sendGoogleChatMessage({
					account,
					space: spaceName,
					cardsV2: pendingPayload.cardsV2,
					thread: preparedTarget.threadName
				});
			} catch (error) {
				unregisterGoogleChatManualApprovalFollowupSuppression(pendingPayload.approvalId);
				throw error;
			}
			if (!sent?.messageName) {
				unregisterGoogleChatManualApprovalFollowupSuppression(pendingPayload.approvalId);
				return null;
			}
			return {
				accountId: account.accountId,
				spaceName,
				messageName: sent.messageName,
				...preparedTarget.threadName ? { threadName: preparedTarget.threadName } : {},
				actionTokens: pendingPayload.actionTokens
			};
		},
		updateEntry: async ({ cfg, accountId, context, entry, payload }) => {
			const account = resolveHandlerAccount({
				cfg,
				accountId,
				context
			});
			if (!account) return;
			await updateGoogleChatMessage({
				account,
				messageName: entry.messageName,
				cardsV2: payload.cardsV2
			});
		}
	},
	interactions: {
		bindPending: ({ entry, request, approvalKind, view, pendingPayload }) => {
			const tokens = [];
			for (const actionToken of entry.actionTokens) if (registerGoogleChatApprovalCardBinding({
				token: actionToken.token,
				accountId: entry.accountId,
				approvalId: request.id,
				approvalKind,
				decision: actionToken.decision,
				allowedDecisions: pendingPayload.allowedDecisions,
				spaceName: entry.spaceName,
				messageName: entry.messageName,
				threadName: entry.threadName ?? null,
				expiresAtMs: view.expiresAtMs
			})) tokens.push(actionToken.token);
			return tokens.length > 0 ? tokens : null;
		},
		unbindPending: ({ binding }) => {
			googleChatApprovalControls.unregister(binding);
		},
		cancelDelivered: ({ entry }) => {
			googleChatApprovalControls.unregister(entry.actionTokens.map((actionToken) => actionToken.token));
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		log.error(`googlechat approvals: failed to send request ${request.id}: ${String(error)}`);
	} }
});
//#endregion
export { googleChatApprovalNativeRuntime };

import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-4MFmdZVV.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import { a as buildExecApprovalPendingReplyPayload, f as formatExecApprovalExpiresIn, n as buildApprovalPresentationFromActionDescriptors } from "./exec-approval-reply-CwK_qfht.mjs";
import { r as buildPluginApprovalPendingReplyPayload } from "./approval-renderers-CaRwqZ0Z.mjs";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-C0Ponyi5.mjs";
import "./approval-handler-runtime-DrSPFmog.mjs";
import "./approval-native-runtime-BHq7t0Wf.mjs";
import "./approval-reply-runtime-DfbJPpV6.mjs";
import { i as normalizeTelegramChatId, s as parseTelegramTarget } from "./topic-conversation-BlxRQJEK.mjs";
import { a as isTelegramExecApprovalHandlerConfigured, l as shouldHandleTelegramExecApprovalRequest } from "./exec-approvals-A4VORbgc.mjs";
import { z as escapeTelegramHtml } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { o as buildTelegramApprovalCallbackData } from "./native-command-callback-data-C11bj7rj.mjs";
import { a as resolveTelegramInlineButtons } from "./button-types-B1wFSdoZ.mjs";
import { C as editMessageReplyMarkupTelegram, N as sendTypingTelegram, d as sendMessageTelegram, w as editMessageTelegram } from "./send-DZq2Pk_C.mjs";
import { a as buildTelegramNativeResolvedApprovalText, i as buildTelegramNativeExpiredApprovalText } from "./approval-terminal-CDvL8Nw0.mjs";
//#region extensions/telegram/src/approval-handler.runtime.ts
const log = createSubsystemLogger("telegram/approvals");
const terminalizedSystemAgentApprovals = /* @__PURE__ */ new Set();
function resolveHandlerContext(params) {
	const context = params.context;
	const accountId = normalizeOptionalString(params.accountId) ?? "";
	if (!context?.token || !accountId) return null;
	return {
		accountId,
		context
	};
}
function buildPendingPayload(params) {
	if (params.approvalKind === "system-agent") {
		const view = params.view;
		if (view.approvalKind !== "system-agent") throw new Error("system-agent approval request and view kinds do not match");
		const origin = resolveGatewayPublicOrigin(params.cfg);
		const reviewUrl = origin && params.cfg.gateway?.controlUi?.enabled !== false ? `${origin}${normalizeTelegramControlUiBasePath(params.cfg.gateway?.controlUi?.basePath)}/approve/${encodeURIComponent(params.request.id)}` : void 0;
		const lines = [
			"🔒 OpenClaw change requires approval",
			`Change: ${view.operationSummary}`,
			`Agent: ${view.agentId ?? "unknown"}`,
			`Expires in: ${formatExecApprovalExpiresIn(params.request.expiresAtMs, params.nowMs)}`
		];
		const decisionButtons = view.actions.flatMap((action) => {
			const approvalAction = action.action;
			if (!approvalAction || approvalAction.type !== "approval") return [];
			const callbackData = buildTelegramApprovalCallbackData(approvalAction);
			const style = action.style === "danger" || action.style === "success" || action.style === "primary" ? action.style : void 0;
			return callbackData ? [{
				text: action.label,
				callback_data: callbackData,
				...style ? { style } : {}
			}] : [];
		});
		return {
			text: lines.join("\n"),
			buttons: reviewUrl ? [[{
				text: "Review in Control UI",
				url: reviewUrl
			}], ...decisionButtons.length > 0 ? [decisionButtons] : []] : decisionButtons.length > 0 ? [decisionButtons] : []
		};
	}
	return {
		text: (params.approvalKind === "plugin" ? buildPluginApprovalPendingReplyPayload({
			request: params.request,
			nowMs: params.nowMs
		}) : buildExecApprovalPendingReplyPayload({
			approvalId: params.request.id,
			approvalSlug: params.request.id.slice(0, 8),
			approvalCommandId: params.request.id,
			warningText: params.view.approvalKind === "exec" ? params.view.warningText ?? void 0 : void 0,
			command: params.view.approvalKind === "exec" ? params.view.commandText : "",
			cwd: params.view.approvalKind === "exec" ? params.view.cwd ?? void 0 : void 0,
			host: params.view.approvalKind === "exec" && params.view.host === "node" ? "node" : "gateway",
			nodeId: params.view.approvalKind === "exec" ? params.view.nodeId ?? void 0 : void 0,
			scope: params.view.approvalKind === "exec" ? params.view.scope ?? void 0 : void 0,
			allowedDecisions: params.view.actions.map((action) => action.decision),
			expiresAtMs: params.request.expiresAtMs,
			nowMs: params.nowMs
		})).text ?? "",
		buttons: resolveTelegramInlineButtons({ presentation: buildApprovalPresentationFromActionDescriptors(params.view.actions) })
	};
}
const telegramApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: (params) => {
			const resolved = resolveHandlerContext(params);
			return resolved ? isTelegramExecApprovalHandlerConfigured({
				cfg: params.cfg,
				accountId: resolved.accountId
			}) : false;
		},
		shouldHandle: (params) => {
			const resolved = resolveHandlerContext(params);
			return resolved ? shouldHandleTelegramExecApprovalRequest({
				cfg: params.cfg,
				accountId: resolved.accountId,
				request: params.request
			}) : false;
		}
	},
	presentation: {
		buildPendingPayload: ({ cfg, request, approvalKind, nowMs, view }) => buildPendingPayload({
			cfg,
			request,
			approvalKind,
			nowMs,
			view
		}),
		buildResolvedResult: ({ view }) => ({
			kind: "update",
			payload: { text: buildTelegramNativeResolvedApprovalText(view) }
		}),
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: { text: buildTelegramNativeExpiredApprovalText(view) }
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => {
			const parsedTarget = parseTelegramTarget(plannedTarget.target.to);
			return {
				dedupeKey: buildChannelApprovalNativeTargetKey(plannedTarget.target),
				target: {
					chatId: parsedTarget.chatId,
					messageThreadId: typeof plannedTarget.target.threadId === "number" ? plannedTarget.target.threadId : parsedTarget.messageThreadId,
					directMessagesTopicId: parsedTarget.directMessagesTopicId
				}
			};
		},
		deliverPending: async ({ cfg, accountId, context, preparedTarget, pendingPayload }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return null;
			const sendTyping = resolved.context.deps?.sendTyping ?? sendTypingTelegram;
			const sendMessage = resolved.context.deps?.sendMessage ?? sendMessageTelegram;
			await sendTyping(preparedTarget.chatId, {
				cfg,
				token: resolved.context.token,
				accountId: resolved.accountId,
				...preparedTarget.messageThreadId != null ? { messageThreadId: preparedTarget.messageThreadId } : {}
			}).catch(() => {});
			const result = await sendMessage(preparedTarget.chatId, pendingPayload.text, {
				cfg,
				token: resolved.context.token,
				accountId: resolved.accountId,
				buttons: pendingPayload.buttons,
				...preparedTarget.messageThreadId != null ? { messageThreadId: preparedTarget.messageThreadId } : {},
				...preparedTarget.directMessagesTopicId != null ? { directMessagesTopicId: preparedTarget.directMessagesTopicId } : {}
			});
			return {
				chatId: result.chatId,
				messageId: result.messageId
			};
		},
		updateEntry: async ({ cfg, accountId, context, entry, payload, request, approvalKind }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return;
			const editMessage = resolved.context.deps?.editMessage ?? editMessageTelegram;
			let editError;
			try {
				await editMessage(entry.chatId, entry.messageId, escapeTelegramHtml(payload.text), {
					cfg,
					token: resolved.context.token,
					accountId: resolved.accountId,
					textMode: "html",
					buttons: []
				});
			} catch (error) {
				editError = error;
			}
			if (approvalKind === "system-agent" && request.request.turnSourceChannel?.trim().toLowerCase() === "telegram") {
				const originTarget = request.request.turnSourceTo?.trim();
				const parsedOrigin = originTarget ? parseTelegramTarget(originTarget) : void 0;
				const originChatId = parsedOrigin ? normalizeTelegramChatId(parsedOrigin.chatId) : void 0;
				const originThreadId = parseStrictPositiveInteger(request.request.turnSourceThreadId) ?? parsedOrigin?.messageThreadId;
				const sourceAccountId = request.request.turnSourceAccountId?.trim();
				const isSourceAccount = !sourceAccountId || sourceAccountId === resolved.accountId;
				if (originChatId && isSourceAccount && (entry.chatId !== originChatId || editError !== void 0)) {
					if (!terminalizedSystemAgentApprovals.has(request.id)) {
						await (resolved.context.deps?.sendMessage ?? sendMessageTelegram)(parsedOrigin?.directMessagesTopicId != null ? originTarget : originChatId, escapeTelegramHtml(payload.text), {
							cfg,
							token: resolved.context.token,
							accountId: resolved.accountId,
							textMode: "html",
							...originThreadId != null ? { messageThreadId: originThreadId } : {}
						});
						terminalizedSystemAgentApprovals.add(request.id);
					}
				} else if (originChatId && isSourceAccount) terminalizedSystemAgentApprovals.add(request.id);
			}
			if (editError !== void 0) throw editError instanceof Error ? editError : new Error(formatErrorMessage(editError));
		}
	},
	interactions: { clearPendingActions: async ({ cfg, accountId, context, entry }) => {
		const resolved = resolveHandlerContext({
			cfg,
			accountId,
			context
		});
		if (!resolved) return;
		await (resolved.context.deps?.editReplyMarkup ?? editMessageReplyMarkupTelegram)(entry.chatId, entry.messageId, [], {
			cfg,
			token: resolved.context.token,
			accountId: resolved.accountId
		});
	} },
	observe: {
		onDeliveryError: ({ error, request }) => {
			log.error(`telegram approvals: failed to send request ${request.id}: ${String(error)}`);
		},
		onFinalized: ({ request, approvalKind }) => {
			if (approvalKind === "system-agent") terminalizedSystemAgentApprovals.delete(request.id);
		}
	}
});
function normalizeTelegramControlUiBasePath(value) {
	const trimmed = value?.trim() ?? "";
	if (!trimmed || trimmed === "/") return "";
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.endsWith("/") ? withSlash.slice(0, -1) : withSlash;
}
//#endregion
export { telegramApprovalNativeRuntime };

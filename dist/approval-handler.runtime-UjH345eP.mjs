import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-s_DV7kzX.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { i as buildExecApprovalPendingReplyPayload, n as buildApprovalPresentationFromActionDescriptors, u as formatExecApprovalExpiresIn } from "./exec-approval-reply-Dn62m4ql.mjs";
import { i as createChannelApprovalNativeRuntimeAdapterAsync } from "./approval-handler-runtime-CkaFt78O.mjs";
import "./approval-handler-runtime-B4BqdHaJ.mjs";
import "./approval-native-runtime-C3kPktYq.mjs";
import { r as buildPluginApprovalPendingReplyPayload } from "./approval-renderers-Cd_8TpLz.mjs";
import "./approval-reply-runtime-NFyRiSFk.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-base-path-C7vqrdPT.mjs";
import { F as escapeTelegramHtml } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { l as parseTelegramTarget, o as normalizeTelegramChatId } from "./topic-conversation-S0gZB4iY.mjs";
import { a as isTelegramExecApprovalHandlerConfigured, l as shouldHandleTelegramExecApprovalRequest } from "./exec-approvals-DPqXOxDl.mjs";
import { o as buildTelegramApprovalCallbackData } from "./native-command-callback-data-egNNRPnG.mjs";
import { i as normalizeTelegramButtonStyle, o as resolveTelegramInlineButtons } from "./button-types-DtegLouf.mjs";
import { C as editMessageTelegram, L as sendTypingTelegram, S as editMessageReplyMarkupTelegram, u as sendMessageTelegram } from "./send-DWoEOMF4.mjs";
import { a as buildTelegramNativeResolvedApprovalText, i as buildTelegramNativeExpiredApprovalText } from "./approval-terminal-B0sB7aBr.mjs";
//#region extensions/telegram/src/approval-handler.runtime.ts
const log = createSubsystemLogger("telegram/approvals");
const terminalizedSystemAgentApprovals = /* @__PURE__ */ new Set();
function resolveHandlerContext(params) {
	const context = params.context;
	const accountId = normalizeOptionalString(params.accountId) ?? "";
	if (!context?.token || !accountId) return null;
	return {
		accountId,
		context,
		options: () => ({
			cfg: params.cfg,
			token: context.token,
			accountId
		})
	};
}
function buildPendingPayload(params) {
	if (params.approvalKind === "system-agent") {
		const view = params.view;
		if (view.approvalKind !== "system-agent") throw new Error("system-agent approval request and view kinds do not match");
		const origin = resolveGatewayPublicOrigin(params.cfg);
		const reviewUrl = origin && params.cfg.gateway?.controlUi?.enabled !== false ? `${origin}${normalizeControlUiBasePath(params.cfg.gateway?.controlUi?.basePath?.trim() ?? "", "one")}/approve/${encodeURIComponent(params.request.id)}` : void 0;
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
			const style = normalizeTelegramButtonStyle(action.style);
			return callbackData ? [{
				text: action.label,
				callback_data: callbackData,
				...style ? { style } : {}
			}] : [];
		});
		const buttons = decisionButtons.length > 0 ? [decisionButtons] : [];
		return {
			text: lines.join("\n"),
			buttons: reviewUrl ? [[{
				text: "Review in Control UI",
				url: reviewUrl
			}], ...buttons] : buttons
		};
	}
	const execView = params.view.approvalKind === "exec" ? params.view : void 0;
	return {
		text: (params.approvalKind === "plugin" ? buildPluginApprovalPendingReplyPayload({
			request: params.request,
			nowMs: params.nowMs
		}) : buildExecApprovalPendingReplyPayload({
			approvalId: params.request.id,
			approvalSlug: params.request.id.slice(0, 8),
			approvalCommandId: params.request.id,
			warningText: execView?.warningText ?? void 0,
			command: execView?.commandText ?? "",
			cwd: execView?.cwd ?? void 0,
			host: execView?.host === "node" ? "node" : "gateway",
			nodeId: execView?.nodeId ?? void 0,
			scope: execView?.scope ?? void 0,
			allowedDecisions: params.view.actions.map((action) => action.decision),
			expiresAtMs: params.request.expiresAtMs,
			nowMs: params.nowMs
		})).text ?? "",
		buttons: resolveTelegramInlineButtons({ presentation: buildApprovalPresentationFromActionDescriptors(params.view.actions) })
	};
}
const telegramApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapterAsync({
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
		buildPendingPayload,
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
			const options = {
				...resolved.options(),
				...preparedTarget.messageThreadId != null ? { messageThreadId: preparedTarget.messageThreadId } : {}
			};
			await sendTyping(preparedTarget.chatId, options).catch(() => {});
			const result = await sendMessage(preparedTarget.chatId, pendingPayload.text, {
				...options,
				buttons: pendingPayload.buttons,
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
					...resolved.options(),
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
				if (originChatId && isSourceAccount) {
					if ((entry.chatId !== originChatId || editError !== void 0) && !terminalizedSystemAgentApprovals.has(request.id)) await (resolved.context.deps?.sendMessage ?? sendMessageTelegram)(parsedOrigin?.directMessagesTopicId != null ? originTarget : originChatId, escapeTelegramHtml(payload.text), {
						...resolved.options(),
						textMode: "html",
						...originThreadId != null ? { messageThreadId: originThreadId } : {}
					});
					terminalizedSystemAgentApprovals.add(request.id);
				}
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
		await (resolved.context.deps?.editReplyMarkup ?? editMessageReplyMarkupTelegram)(entry.chatId, entry.messageId, [], resolved.options());
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
//#endregion
export { telegramApprovalNativeRuntime };

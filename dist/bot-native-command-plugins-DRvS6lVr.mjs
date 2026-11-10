import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-79LnOCyy.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as getSessionEntryAsync } from "./session-store-runtime-internal-Cv2I3LCC.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import { w as buildInlineKeyboard } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { d as shouldSuppressLocalTelegramExecApprovalPrompt } from "./exec-approvals-DPqXOxDl.mjs";
import { r as buildTelegramGroupFrom, s as buildTelegramRoutingTarget } from "./helpers-amKpwD-6.mjs";
import { q as recordSentMessage } from "./send-DWoEOMF4.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { n as resolveTelegramNativeCommandThreadContext, t as prepareTelegramCommandDispatch } from "./bot-native-command-dispatch-Dwxi_VTm.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/telegram/src/bot-native-command-plugins.ts
const EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
function inspectTelegramNativeReply(result) {
	const telegramData = result.channelData?.telegram;
	const hasReaction = Boolean(normalizeOptionalString(telegramData?.reaction?.emoji));
	const { channelData: _channelData, ...portableContent } = result;
	return {
		telegramData,
		hasReaction,
		renderable: hasOutboundReplyContent(portableContent, { trimText: true }) || Boolean(buildInlineKeyboard(telegramData?.buttons) || hasReaction),
		editable: !result.mediaUrl && (!result.mediaUrls || result.mediaUrls.length === 0) && !result.presentation && !result.interactive && !result.btw && !hasReaction && telegramData?.pin !== true
	};
}
async function resolveTelegramCommandTranscriptContext(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {};
	try {
		const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
		const entry = await getSessionEntryAsync({
			agentId: params.agentId,
			sessionKey,
			storePath
		});
		const sessionId = entry?.sessionId?.trim() || randomUUID();
		const sessionFile = formatSqliteSessionFileMarker({
			agentId: params.agentId,
			sessionId,
			storePath
		});
		const authProfileId = normalizeOptionalString(entry?.authProfileOverride);
		return {
			sessionId,
			sessionFile,
			...authProfileId ? { authProfileId } : {}
		};
	} catch {
		return {};
	}
}
async function executeTelegramPluginCommand(params) {
	const commandBody = `/${params.commandName}${params.rawText ? ` ${params.rawText}` : ""}`;
	const pluginCommandDispatch = params.candidate.prepareDispatch(params.rawText);
	if (pluginCommandDispatch.kind === "non-plugin") {
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: params.runtime,
			fn: async () => await params.bot.api.sendMessage(params.msg.chat.id, "Command not found.", (await resolveTelegramNativeCommandThreadContext(params)).threadParams ?? {})
		});
		return;
	}
	const dispatch = await prepareTelegramCommandDispatch({
		...params,
		requireAuth: params.candidate.requireAuth
	});
	if (!dispatch) return;
	const from = dispatch.isGroup ? buildTelegramGroupFrom(dispatch.chatId, dispatch.threadSpec) : `telegram:${dispatch.chatId}`;
	const to = dispatch.threadSpec.scope === "direct-messages" ? buildTelegramRoutingTarget(dispatch.chatId, dispatch.threadSpec) : `telegram:${dispatch.chatId}`;
	const { deliverReplies, emitTelegramMessageSentHooks } = await dispatch.loadDeliveryRuntime();
	let progressMessageId;
	const cleanupProgressPlaceholder = async () => {
		const messageId = progressMessageId;
		if (messageId == null) return;
		try {
			await withTelegramApiErrorLogging({
				operation: "deleteMessage",
				runtime: dispatch.runtime,
				fn: () => dispatch.bot.api.deleteMessage(dispatch.chatId, messageId)
			});
		} catch {}
	};
	if (params.candidate.progressMessage) try {
		progressMessageId = (await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: dispatch.runtime,
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, params.candidate.progressMessage, dispatch.threadParams)
		})).message_id;
	} catch {}
	const transcriptContext = await resolveTelegramCommandTranscriptContext({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: dispatch.targetSessionKey
	});
	const result = await pluginCommandDispatch.execute({
		senderId: dispatch.senderId,
		channel: "telegram",
		isAuthorizedSender: dispatch.commandAuthorized,
		senderIsOwner: dispatch.senderIsOwner,
		assertOwnerCurrent: dispatch.assertOwnerCurrent,
		agentId: dispatch.route.agentId,
		sessionKey: dispatch.targetSessionKey,
		sessionId: transcriptContext.sessionId,
		sessionFile: transcriptContext.sessionFile,
		authProfileId: transcriptContext.authProfileId,
		commandBody,
		config: dispatch.runtimeCfg,
		from,
		to,
		accountId: dispatch.accountId,
		messageThreadId: dispatch.threadSpec.id
	});
	if (shouldSuppressLocalTelegramExecApprovalPrompt({
		cfg: dispatch.runtimeCfg,
		accountId: dispatch.route.accountId,
		payload: result
	}) || result.suppressReply === true) {
		await cleanupProgressPlaceholder();
		return;
	}
	const { hasReaction, renderable, editable, telegramData } = inspectTelegramNativeReply(result);
	const deliverableResult = renderable ? hasReaction && !normalizeOptionalString(result.replyToId) ? {
		...result,
		replyToId: String(dispatch.msg.message_id)
	} : result : { text: EMPTY_RESPONSE_FALLBACK };
	const progressResultText = deliverableResult.text;
	if (progressMessageId != null && dispatch.telegramDeps.editMessageTelegram && typeof progressResultText === "string" && progressResultText.trim().length > 0 && (!renderable || editable)) try {
		await dispatch.telegramDeps.editMessageTelegram(dispatch.chatId, progressMessageId, progressResultText, {
			cfg: dispatch.runtimeCfg,
			accountId: dispatch.route.accountId,
			textMode: "markdown",
			linkPreview: dispatch.runtimeTelegramCfg.linkPreview,
			buttons: renderable ? telegramData?.buttons : void 0
		});
		await recordSentMessage(dispatch.chatId, progressMessageId, dispatch.runtimeCfg, {
			accountId: dispatch.route.accountId,
			agentId: dispatch.opts.ownerAgentId
		});
		emitTelegramMessageSentHooks({
			sessionKeyForInternalHooks: dispatch.targetSessionKey,
			chatId: String(dispatch.chatId),
			accountId: dispatch.route.accountId,
			content: progressResultText,
			success: true,
			messageId: progressMessageId,
			isGroup: dispatch.isGroup,
			groupId: dispatch.isGroup ? String(dispatch.chatId) : void 0
		});
		await dispatch.recordDeliveredReply(commandBody, progressResultText, String(progressMessageId));
		return;
	} catch {}
	await cleanupProgressPlaceholder();
	if ((await deliverReplies({
		replies: [deliverableResult],
		...dispatch.deliveryOptions,
		...hasReaction ? { replyToMode: "all" } : {},
		silent: dispatch.runtimeTelegramCfg.silentErrorReplies === true && deliverableResult.isError === true
	})).delivered && deliverableResult.text) await dispatch.recordDeliveredReply(commandBody, deliverableResult.text, "final");
}
//#endregion
export { executeTelegramPluginCommand };

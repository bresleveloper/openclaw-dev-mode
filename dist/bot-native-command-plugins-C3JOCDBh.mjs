import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-RBmrGrXG.mjs";
import { h as resolveStorePath, i as getSessionEntry } from "./session-store-runtime-XTMMGjZf.mjs";
import { d as shouldSuppressLocalTelegramExecApprovalPrompt } from "./exec-approvals-A4VORbgc.mjs";
import { c as buildTelegramThreadParams, d as extractTelegramForumFlag, h as resolveTelegramForumFlag, r as buildTelegramGroupFrom, s as buildTelegramRoutingTarget, y as resolveTelegramMessageThreadSpec } from "./helpers-TUQ5gNqR.mjs";
import { D as buildInlineKeyboard } from "./text-chunk-limit-Bdq_2BA_.mjs";
import { U as recordSentMessage } from "./send-DZq2Pk_C.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-DUw1mOtG.mjs";
import { t as prepareTelegramCommandDispatch } from "./bot-native-command-dispatch-DxyzL-VJ.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/telegram/src/bot-native-command-plugins.ts
const EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
function resolveTelegramNativeReplyChannelData(result) {
	return result.channelData?.telegram;
}
function normalizeTelegramNativeReplyPayload(result) {
	return result && typeof result === "object" ? result : {};
}
function hasTelegramNativeReplyReaction(result) {
	const reactionEmoji = resolveTelegramNativeReplyChannelData(result)?.reaction?.emoji;
	return typeof reactionEmoji === "string" && reactionEmoji.trim().length > 0;
}
function hasRenderableTelegramNativeReplyPayload(result) {
	const { channelData: _channelData, ...portableContent } = result;
	if (hasOutboundReplyContent(portableContent, { trimText: true })) return true;
	const telegramData = resolveTelegramNativeReplyChannelData(result);
	return Boolean(buildInlineKeyboard(telegramData?.buttons) || hasTelegramNativeReplyReaction(result));
}
function isEditableTelegramProgressResult(result) {
	const telegramData = resolveTelegramNativeReplyChannelData(result);
	return Boolean(typeof result.text === "string" && result.text.trim() && !result.mediaUrl && (!result.mediaUrls || result.mediaUrls.length === 0) && !result.presentation && !result.interactive && !result.btw && !hasTelegramNativeReplyReaction(result) && telegramData?.pin !== true);
}
async function cleanupTelegramProgressPlaceholder(params) {
	if (params.progressMessageId == null) return;
	try {
		await withTelegramApiErrorLogging({
			operation: "deleteMessage",
			runtime: params.runtime,
			fn: () => params.bot.api.deleteMessage(params.chatId, params.progressMessageId)
		});
	} catch {}
}
async function resolveTelegramPluginThreadParams(params) {
	const isGroup = params.msg.chat.type === "group" || params.msg.chat.type === "supergroup";
	const getChat = typeof params.bot.api.getChat === "function" ? params.bot.api.getChat.bind(params.bot.api) : void 0;
	const isForum = params.msg.chat.is_direct_messages === true ? false : await resolveTelegramForumFlag({
		chatId: params.msg.chat.id,
		chatType: params.msg.chat.type,
		isGroup,
		isForum: extractTelegramForumFlag(params.msg.chat),
		isTopicMessage: params.msg.is_topic_message,
		getChat
	});
	return buildTelegramThreadParams(resolveTelegramMessageThreadSpec(params.msg, isForum));
}
async function resolveTelegramCommandTranscriptContext(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return {};
	try {
		const storePath = resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
		const entry = getSessionEntry({
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
			fn: async () => await params.bot.api.sendMessage(params.msg.chat.id, "Command not found.", await resolveTelegramPluginThreadParams(params) ?? {})
		});
		return;
	}
	const dispatch = await prepareTelegramCommandDispatch({
		...params,
		requireAuth: params.candidate.requireAuth
	});
	if (!dispatch) return;
	const targetSessionEntry = dispatch.nativeCommandRuntime.getSessionEntry({
		agentId: dispatch.route.agentId,
		sessionKey: dispatch.targetSessionKey
	});
	const from = dispatch.isGroup ? buildTelegramGroupFrom(dispatch.chatId, dispatch.threadSpec) : `telegram:${dispatch.chatId}`;
	const to = dispatch.threadSpec.scope === "direct-messages" ? buildTelegramRoutingTarget(dispatch.chatId, dispatch.threadSpec) : `telegram:${dispatch.chatId}`;
	const { deliverReplies, emitTelegramMessageSentHooks } = await dispatch.loadDeliveryRuntime();
	let progressMessageId;
	if (params.candidate.progressMessage) try {
		const maybeMessageId = (await withTelegramApiErrorLogging({
			operation: "sendMessage",
			runtime: dispatch.runtime,
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, params.candidate.progressMessage, buildTelegramThreadParams(dispatch.threadSpec))
		}))?.message_id;
		if (typeof maybeMessageId === "number") progressMessageId = maybeMessageId;
	} catch {}
	const transcriptContext = await resolveTelegramCommandTranscriptContext({
		cfg: dispatch.runtimeCfg,
		agentId: dispatch.route.agentId,
		sessionKey: dispatch.targetSessionKey
	});
	const result = normalizeTelegramNativeReplyPayload(await pluginCommandDispatch.execute({
		senderId: dispatch.senderId,
		channel: "telegram",
		isAuthorizedSender: dispatch.commandAuthorized,
		senderIsOwner: dispatch.senderIsOwner,
		assertOwnerCurrent: dispatch.assertOwnerCurrent,
		agentId: dispatch.route.agentId,
		sessionKey: dispatch.targetSessionKey,
		sessionId: transcriptContext.sessionId,
		sessionFile: transcriptContext.sessionFile,
		authProfileId: transcriptContext.authProfileId ?? targetSessionEntry?.authProfileOverride,
		commandBody,
		config: dispatch.runtimeCfg,
		from,
		to,
		accountId: dispatch.accountId,
		messageThreadId: dispatch.threadSpec.id
	}));
	if (shouldSuppressLocalTelegramExecApprovalPrompt({
		cfg: dispatch.runtimeCfg,
		accountId: dispatch.route.accountId,
		payload: result
	}) || result.suppressReply === true) {
		await cleanupTelegramProgressPlaceholder({
			bot: dispatch.bot,
			chatId: dispatch.chatId,
			progressMessageId,
			runtime: dispatch.runtime
		});
		return;
	}
	const hasReaction = hasTelegramNativeReplyReaction(result);
	const deliverableResult = hasRenderableTelegramNativeReplyPayload(result) ? hasReaction && !normalizeOptionalString(result.replyToId) ? {
		...result,
		replyToId: String(dispatch.msg.message_id)
	} : result : { text: EMPTY_RESPONSE_FALLBACK };
	const progressResultText = typeof deliverableResult.text === "string" && deliverableResult.text.trim().length > 0 ? deliverableResult.text : null;
	const telegramResultData = resolveTelegramNativeReplyChannelData(deliverableResult);
	if (progressMessageId != null && dispatch.telegramDeps.editMessageTelegram && progressResultText && isEditableTelegramProgressResult(deliverableResult)) try {
		await dispatch.telegramDeps.editMessageTelegram(dispatch.chatId, progressMessageId, progressResultText, {
			cfg: dispatch.runtimeCfg,
			accountId: dispatch.route.accountId,
			textMode: "markdown",
			linkPreview: dispatch.runtimeTelegramCfg.linkPreview,
			buttons: telegramResultData?.buttons
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
		return;
	} catch {}
	await cleanupTelegramProgressPlaceholder({
		bot: dispatch.bot,
		chatId: dispatch.chatId,
		progressMessageId,
		runtime: dispatch.runtime
	});
	await deliverReplies({
		replies: [deliverableResult],
		...dispatch.buildDeliveryBaseOptions({
			sessionKeyForInternalHooks: dispatch.targetSessionKey,
			policySessionKey: dispatch.targetSessionKey
		}),
		...hasReaction ? { replyToMode: "all" } : {},
		silent: dispatch.runtimeTelegramCfg.silentErrorReplies === true && deliverableResult.isError === true
	});
}
//#endregion
export { executeTelegramPluginCommand };

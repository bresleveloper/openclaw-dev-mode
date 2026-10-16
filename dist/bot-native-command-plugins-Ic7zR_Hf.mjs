import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { f as resolveStorePath, i as getSessionEntry } from "./session-store-runtime-BS2ijndm.mjs";
import { a as hasOutboundReplyContent } from "./reply-payload-DEDOYf-L.mjs";
import { C as buildInlineKeyboard } from "./text-chunk-limit-BgiLU1vv.mjs";
import { d as shouldSuppressLocalTelegramExecApprovalPrompt } from "./exec-approvals-TtO1u3Q-.mjs";
import { c as buildTelegramThreadParams, r as buildTelegramGroupFrom, s as buildTelegramRoutingTarget } from "./helpers-DLD_tZ6z.mjs";
import { q as recordSentMessage } from "./send-Dhm4bf4Y.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-Dcv6s_s2.mjs";
import { n as resolveTelegramNativeCommandThreadContext, t as prepareTelegramCommandDispatch } from "./bot-native-command-dispatch-DiI_zo7L.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/telegram/src/bot-native-command-plugins.ts
const EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
function resolveTelegramNativeReplyChannelData(result) {
	return result.channelData?.telegram;
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
			fn: async () => await params.bot.api.sendMessage(params.msg.chat.id, "Command not found.", (await resolveTelegramNativeCommandThreadContext(params)).threadParams ?? {})
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
			fn: () => dispatch.bot.api.sendMessage(dispatch.chatId, params.candidate.progressMessage, buildTelegramThreadParams(dispatch.threadSpec))
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
		authProfileId: transcriptContext.authProfileId ?? targetSessionEntry?.authProfileOverride,
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
	await cleanupProgressPlaceholder();
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

import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { i as resolveTelegramAccount } from "./accounts-CHcpIFN8.mjs";
import { G as resolveTelegramTableMode, W as resolveTelegramRichMessages } from "./text-chunk-limit-BsO9A8Z8.mjs";
import { V as resolveTelegramDmAllow, W as resolveTelegramEffectiveDmPolicy, _ as resolveTelegramGroupAllowFromContext, c as buildTelegramThreadParams, d as extractTelegramForumFlag, h as resolveTelegramForumFlag, m as resolveTelegramBotHasTopicsEnabled, y as resolveTelegramMessageThreadSpec } from "./helpers-amKpwD-6.mjs";
import { n as inspectTelegramConversationRouteAsync, o as resolveTelegramTargetSession, s as touchTelegramConversationRoute } from "./conversation-route-DhJ8dkiE.mjs";
import { _t as evaluateTelegramGroupPolicyAccess, gt as evaluateTelegramGroupBaseAccess } from "./send-DWoEOMF4.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-BK6KMz8z.mjs";
import { c as buildTelegramNativeCommandOwnerContext, u as resolveTelegramCommandIngressAuthorization } from "./progress-draft-preview-DtwdAQc0.mjs";
import { n as resolveTelegramMessageTurnSettings } from "./bot-message-CucppeLB.mjs";
import { t as defaultTelegramNativeCommandDeps } from "./bot-native-command-deps.runtime.js";
//#region extensions/telegram/src/bot-native-command-dispatch.ts
const loadTelegramNativeCommandDeliveryRuntime = createLazyRuntimeModule(() => import("./delivery-BtwVIO6H.mjs"));
const loadTelegramNativeCommandRuntime = createLazyRuntimeModule(async () => {
	const { ensureConfiguredBindingRouteReady, getAgentScopedMediaLocalRoots, getSessionEntryAsync, recordDeliveredCommandExchange, resolveChunkMode, resolveStorePath } = await import("./bot-native-commands.runtime.js");
	return {
		ensureConfiguredBindingRouteReady,
		getAgentScopedMediaLocalRoots,
		getSessionEntryAsync,
		recordDeliveredCommandExchange,
		resolveChunkMode,
		resolveStorePath
	};
});
async function resolveTelegramNativeCommandThreadContext(params) {
	const { msg, bot } = params;
	const chatId = msg.chat.id;
	const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
	const isForum = msg.chat.is_direct_messages === true ? false : await resolveTelegramForumFlag({
		chatId,
		chatType: msg.chat.type,
		isGroup,
		isForum: extractTelegramForumFlag(msg.chat),
		isTopicMessage: msg.is_topic_message,
		getChat: (id) => bot.api.getChat(id)
	});
	const threadSpec = resolveTelegramMessageThreadSpec(msg, isForum);
	return {
		chatId,
		isGroup,
		threadSpec,
		threadParams: buildTelegramThreadParams(threadSpec)
	};
}
async function resolveTelegramCommandAuth(params) {
	const { msg, bot, cfg, accountId, telegramCfg, requireAuth } = params;
	const { chatId, isGroup, threadSpec, threadParams } = await resolveTelegramNativeCommandThreadContext({
		msg,
		bot
	});
	const senderId = msg.from?.id ? String(msg.from.id) : "";
	const scopedConfig = params.resolveTelegramGroupConfig(chatId, threadSpec.id, cfg);
	const inspectedRoute = await inspectTelegramConversationRouteAsync({
		cfg,
		accountId,
		chatId,
		isGroup,
		threadSpec,
		senderId,
		topicAgentId: scopedConfig.topicConfig?.agentId
	});
	const { route } = inspectedRoute;
	const targetSessionKey = resolveTelegramTargetSession({
		cfg,
		route,
		chatId,
		isGroup,
		senderId,
		dmThreadId: threadSpec.scope === "dm" ? threadSpec.id : void 0,
		botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(params.botUser)
	});
	const ingressParams = {
		cfg,
		accountId,
		chatId,
		isGroup,
		senderId,
		dmPolicy: telegramCfg.dmPolicy ?? "pairing"
	};
	const ownerContext = await buildTelegramNativeCommandOwnerContext({
		...ingressParams,
		resolvedThreadId: threadSpec.id,
		agentId: route.agentId,
		sessionKey: targetSessionKey,
		messageId: String(msg.message_id),
		rawBody: msg.text ?? ""
	});
	const preContextCommandAccess = await resolveTelegramCommandIngressAuthorization({
		...ingressParams,
		ownerContext
	});
	const groupAllowContext = await resolveTelegramGroupAllowFromContext({
		cfg,
		chatId,
		accountId,
		dmPolicy: telegramCfg.dmPolicy,
		allowFrom: params.allowFrom,
		senderId,
		isGroup,
		threadSpec,
		groupAllowFrom: params.groupAllowFrom,
		skipPairingStoreRead: preContextCommandAccess.authorizedByConfig,
		readChannelAllowFromStore: params.readChannelAllowFromStore,
		resolveTelegramGroupConfig: () => scopedConfig
	});
	const { resolvedThreadId, dmThreadId, storeAllowFrom, groupConfig, groupAllowOverride, effectiveGroupAllow } = groupAllowContext;
	const effectiveDmPolicy = resolveTelegramEffectiveDmPolicy({
		isGroup,
		groupConfig,
		dmPolicy: telegramCfg.dmPolicy
	});
	const requireTopic = !isGroup && groupConfig && "requireTopic" in groupConfig ? groupConfig.requireTopic : void 0;
	if (!isGroup && requireTopic === true && dmThreadId == null) {
		logVerbose(`Blocked telegram command in DM ${chatId}: requireTopic=true but no topic present`);
		return null;
	}
	const rejectNotAuthorized = async () => {
		await withTelegramApiErrorLogging({
			operation: "sendMessage",
			fn: () => bot.api.sendMessage(chatId, "You are not authorized to use this command.", threadParams ?? {})
		});
		return null;
	};
	const baseAccess = evaluateTelegramGroupBaseAccess({
		...groupAllowContext,
		senderId,
		enforceAllowOverride: requireAuth,
		requireSenderForAllowOverride: true
	});
	if (!baseAccess.allowed) {
		if (baseAccess.reason === "group-disabled") {
			logVerbose(`Blocked telegram command in group ${chatId} (group disabled)`);
			return null;
		}
		if (baseAccess.reason === "topic-disabled") {
			logVerbose(`Blocked telegram command in topic ${chatId} (${resolvedThreadId ?? "unknown"}) (topic disabled)`);
			return null;
		}
		return await rejectNotAuthorized();
	}
	const policyAccess = evaluateTelegramGroupPolicyAccess({
		...groupAllowContext,
		isGroup,
		chatId,
		cfg,
		telegramCfg,
		senderId,
		resolveGroupPolicy: params.resolveGroupPolicy,
		enforceAllowlistAuthorization: requireAuth && !preContextCommandAccess.authorizedByConfig,
		allowEmptyAllowlistEntries: true
	});
	if (!policyAccess.allowed) {
		if (policyAccess.reason === "group-policy-disabled") {
			logVerbose("Blocked telegram command (groupPolicy: disabled)");
			return null;
		}
		if (policyAccess.reason === "group-policy-allowlist-no-sender" || policyAccess.reason === "group-policy-allowlist-unauthorized") return await rejectNotAuthorized();
		if (policyAccess.reason === "group-chat-not-allowed") {
			logVerbose(`Blocked telegram command in group ${chatId} (group not allowed)`);
			return null;
		}
	}
	const { effectiveAllow: dmAllow } = await resolveTelegramDmAllow({
		cfg,
		allowFrom: groupAllowOverride ?? params.allowFrom,
		accountId,
		senderId,
		storeAllowFrom: isGroup ? [] : storeAllowFrom,
		dmPolicy: effectiveDmPolicy
	});
	const { authorized: commandAuthorized, senderIsOwner, assertOwnerCurrent } = await resolveTelegramCommandIngressAuthorization({
		...ingressParams,
		dmPolicy: effectiveDmPolicy,
		resolvedThreadId,
		effectiveDmAllow: dmAllow,
		effectiveGroupAllow,
		eventKind: "native-command",
		ownerContext
	});
	if (requireAuth && !commandAuthorized) return await rejectNotAuthorized();
	return {
		chatId,
		isGroup,
		senderId,
		threadSpec,
		threadParams,
		commandAuthorized,
		senderIsOwner,
		assertOwnerCurrent,
		route,
		targetSessionKey,
		inspectedRoute,
		ownerContext
	};
}
async function prepareTelegramCommandDispatch(params) {
	const telegramDeps = params.telegramDeps ?? defaultTelegramNativeCommandDeps;
	const runtimeCfg = telegramDeps.getRuntimeConfig();
	const runtimeTelegramCfg = resolveTelegramAccount({
		cfg: runtimeCfg,
		accountId: params.accountId
	}).config;
	const turnSettings = resolveTelegramMessageTurnSettings({
		accountId: params.accountId,
		cfg: runtimeCfg,
		telegramCfg: runtimeTelegramCfg,
		opts: params.opts
	});
	const auth = await resolveTelegramCommandAuth({
		...params,
		cfg: runtimeCfg,
		telegramCfg: runtimeTelegramCfg,
		readChannelAllowFromStore: telegramDeps.readChannelAllowFromStore,
		allowFrom: turnSettings.allowFrom,
		groupAllowFrom: turnSettings.groupAllowFrom
	});
	if (!auth) return null;
	const { route, bindingMode } = auth.inspectedRoute;
	const nativeCommandRuntime = await loadTelegramNativeCommandRuntime();
	auth.assertOwnerCurrent?.();
	await touchTelegramConversationRoute(auth.inspectedRoute);
	auth.assertOwnerCurrent?.();
	if (bindingMode.kind === "configured") {
		auth.assertOwnerCurrent?.();
		const ensured = await nativeCommandRuntime.ensureConfiguredBindingRouteReady({
			cfg: runtimeCfg,
			bindingResolution: bindingMode.binding,
			assertActive: auth.assertOwnerCurrent
		});
		if (!ensured.ok) {
			logVerbose(`telegram native command: configured ACP binding unavailable for topic ${bindingMode.binding.record.conversation.conversationId}: ${ensured.error}`);
			await withTelegramApiErrorLogging({
				operation: "sendMessage",
				runtime: params.runtime,
				fn: () => params.bot.api.sendMessage(auth.chatId, "Configured ACP binding is unavailable right now. Please try again.", auth.threadParams ?? {})
			});
			return null;
		}
	}
	const mediaLocalRoots = nativeCommandRuntime.getAgentScopedMediaLocalRoots(runtimeCfg, route.agentId);
	const richMessagesParams = {
		cfg: runtimeCfg,
		accountId: route.accountId,
		accountConfig: runtimeTelegramCfg
	};
	const richMessages = resolveTelegramRichMessages(richMessagesParams);
	const tableMode = resolveTelegramTableMode(richMessagesParams);
	const chunkMode = nativeCommandRuntime.resolveChunkMode(runtimeCfg, "telegram", route.accountId);
	const deliveryOptions = {
		cfg: runtimeCfg,
		ownerAgentId: params.opts.ownerAgentId,
		chatId: String(auth.chatId),
		accountId: route.accountId,
		sessionKeyForInternalHooks: auth.targetSessionKey,
		policySessionKey: auth.targetSessionKey,
		mirrorIsGroup: auth.isGroup,
		mirrorGroupId: auth.isGroup ? String(auth.chatId) : void 0,
		token: params.opts.token,
		runtime: params.runtime,
		bot: params.bot,
		mediaLocalRoots,
		mediaMaxBytes: params.mediaMaxBytes,
		replyToMode: turnSettings.replyToMode,
		textLimit: turnSettings.textLimit,
		thread: auth.threadSpec,
		tableMode,
		chunkMode,
		linkPreview: runtimeTelegramCfg.linkPreview,
		richMessages
	};
	const storePath = nativeCommandRuntime.resolveStorePath(runtimeCfg.session?.store, { agentId: route.agentId });
	let transcriptSessionId = (await nativeCommandRuntime.getSessionEntryAsync({
		agentId: route.agentId,
		sessionKey: auth.targetSessionKey,
		storePath
	}))?.sessionId;
	return {
		...params,
		telegramDeps,
		runtimeCfg,
		runtimeTelegramCfg,
		...auth,
		nativeCommandRuntime,
		deliveryOptions,
		loadDeliveryRuntime: loadTelegramNativeCommandDeliveryRuntime,
		recordDeliveredReply: async (commandText, replyText, replyId) => {
			const result = await nativeCommandRuntime.recordDeliveredCommandExchange({
				config: runtimeCfg,
				agentId: route.agentId,
				sessionKey: auth.targetSessionKey,
				expectedSessionId: transcriptSessionId,
				assertCurrent: auth.assertOwnerCurrent,
				commandText,
				replyText,
				commandId: `telegram:${route.accountId}:${auth.chatId}:${params.msg.message_id}`,
				replyId
			});
			if (result.ok) transcriptSessionId = result.target.sessionId;
			else logVerbose(`telegram command transcript skipped: ${result.reason}`);
		}
	};
}
//#endregion
export { resolveTelegramNativeCommandThreadContext as n, prepareTelegramCommandDispatch as t };

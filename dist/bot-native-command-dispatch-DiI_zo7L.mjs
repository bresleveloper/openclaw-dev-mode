import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as logVerbose } from "./globals-BXbZ1A_g.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { a as resolveTelegramAccount } from "./accounts-Dt8wbZ2I.mjs";
import { U as resolveTelegramRichMessages, W as resolveTelegramTableMode } from "./text-chunk-limit-BgiLU1vv.mjs";
import { B as resolveTelegramDmAllow, W as resolveTelegramEffectiveDmPolicy, _ as resolveTelegramGroupAllowFromContext, c as buildTelegramThreadParams, d as extractTelegramForumFlag, h as resolveTelegramForumFlag, m as resolveTelegramBotHasTopicsEnabled, y as resolveTelegramMessageThreadSpec } from "./helpers-DLD_tZ6z.mjs";
import { a as touchTelegramConversationRoute, i as resolveTelegramTargetSession, t as inspectTelegramConversationRoute } from "./conversation-route-EwisSepA.mjs";
import { St as evaluateTelegramGroupPolicyAccess, xt as evaluateTelegramGroupBaseAccess } from "./send-Dhm4bf4Y.mjs";
import { t as withTelegramApiErrorLogging } from "./api-logging-Dcv6s_s2.mjs";
import { c as buildTelegramNativeCommandOwnerContext, u as resolveTelegramCommandIngressAuthorization } from "./progress-draft-preview-B7b-yAp3.mjs";
import { n as resolveTelegramMessageTurnSettings } from "./bot-message-C9djzqGW.mjs";
import { t as defaultTelegramNativeCommandDeps } from "./bot-native-command-deps.runtime.js";
//#region extensions/telegram/src/bot-native-command-dispatch.ts
const loadTelegramNativeCommandDeliveryRuntime = createLazyRuntimeModule(() => import("./delivery-kO2z6Twh.mjs"));
const loadTelegramNativeCommandRuntime = createLazyRuntimeModule(() => import("./bot-native-commands.runtime.js"));
async function resolveTelegramNativeCommandThreadContext(params) {
	const { msg, bot } = params;
	const chatId = msg.chat.id;
	const isGroup = msg.chat.type === "group" || msg.chat.type === "supergroup";
	const getChat = typeof bot.api.getChat === "function" ? bot.api.getChat.bind(bot.api) : void 0;
	const isForum = msg.chat.is_direct_messages === true ? false : await resolveTelegramForumFlag({
		chatId,
		chatType: msg.chat.type,
		isGroup,
		isForum: extractTelegramForumFlag(msg.chat),
		isTopicMessage: msg.is_topic_message,
		getChat
	});
	const threadSpec = resolveTelegramMessageThreadSpec(msg, isForum);
	return {
		chatId,
		isGroup,
		isForum,
		threadSpec,
		threadParams: buildTelegramThreadParams(threadSpec)
	};
}
async function resolveTelegramCommandAuth(params) {
	const { msg, bot, cfg, accountId, telegramCfg, requireAuth } = params;
	const { chatId, isGroup, isForum, threadSpec, threadParams } = await resolveTelegramNativeCommandThreadContext({
		msg,
		bot
	});
	const senderId = msg.from?.id ? String(msg.from.id) : "";
	const senderUsername = msg.from?.username ?? "";
	const scopedConfig = params.resolveTelegramGroupConfig(chatId, threadSpec.id, cfg);
	const inspectedRoute = inspectTelegramConversationRoute({
		cfg,
		accountId,
		chatId,
		isGroup,
		threadSpec,
		senderId,
		topicAgentId: scopedConfig.topicConfig?.agentId
	});
	const { route, bindingMode } = inspectedRoute;
	const targetSessionKey = resolveTelegramTargetSession({
		cfg,
		route,
		chatId,
		isGroup,
		senderId,
		dmThreadId: threadSpec.scope === "dm" ? threadSpec.id : void 0,
		botHasTopicsEnabled: resolveTelegramBotHasTopicsEnabled(params.botUser)
	});
	const ownerContext = await buildTelegramNativeCommandOwnerContext({
		cfg,
		accountId,
		chatId,
		isGroup,
		resolvedThreadId: threadSpec.id,
		senderId,
		dmPolicy: telegramCfg.dmPolicy ?? "pairing",
		agentId: route.agentId,
		sessionKey: targetSessionKey,
		messageId: String(msg.message_id),
		rawBody: msg.text ?? ""
	});
	const preContextCommandAccess = await resolveTelegramCommandIngressAuthorization({
		cfg,
		accountId,
		chatId,
		isGroup,
		senderId,
		dmPolicy: telegramCfg.dmPolicy ?? "pairing",
		ownerContext
	});
	const { resolvedThreadId, dmThreadId, storeAllowFrom, groupConfig, topicConfig, groupAllowOverride, effectiveGroupAllow, hasGroupAllowOverride } = await resolveTelegramGroupAllowFromContext({
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
		isGroup,
		groupConfig,
		topicConfig,
		hasGroupAllowOverride,
		effectiveGroupAllow,
		senderId,
		senderUsername,
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
		isGroup,
		chatId,
		cfg,
		telegramCfg,
		topicConfig,
		groupConfig,
		effectiveGroupAllow,
		senderId,
		senderUsername,
		resolveGroupPolicy: params.resolveGroupPolicy,
		enforcePolicy: true,
		enforceAllowlistAuthorization: requireAuth && !preContextCommandAccess.authorizedByConfig,
		allowEmptyAllowlistEntries: true,
		requireSenderForAllowlistAuthorization: true,
		checkChatAllowlist: true
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
		accountId,
		cfg,
		dmPolicy: effectiveDmPolicy,
		isGroup,
		chatId,
		resolvedThreadId,
		senderId,
		effectiveDmAllow: dmAllow,
		effectiveGroupAllow,
		eventKind: "native-command",
		ownerContext
	});
	if (requireAuth && !commandAuthorized) return await rejectNotAuthorized();
	return {
		chatId,
		isGroup,
		isForum,
		resolvedThreadId,
		senderId,
		senderUsername,
		groupConfig,
		topicConfig,
		threadSpec,
		commandAuthorized,
		senderIsOwner,
		assertOwnerCurrent,
		route,
		bindingMode,
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
		botUser: params.botUser,
		msg: params.msg,
		bot: params.bot,
		cfg: runtimeCfg,
		accountId: params.accountId,
		telegramCfg: runtimeTelegramCfg,
		readChannelAllowFromStore: telegramDeps.readChannelAllowFromStore,
		allowFrom: turnSettings.allowFrom,
		groupAllowFrom: turnSettings.groupAllowFrom,
		resolveGroupPolicy: params.resolveGroupPolicy,
		resolveTelegramGroupConfig: params.resolveTelegramGroupConfig,
		requireAuth: params.requireAuth
	});
	if (!auth) return null;
	const { route, bindingMode } = auth;
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
				fn: () => params.bot.api.sendMessage(auth.chatId, "Configured ACP binding is unavailable right now. Please try again.", buildTelegramThreadParams(auth.threadSpec) ?? {})
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
	const buildDeliveryBaseOptions = (keys) => ({
		cfg: runtimeCfg,
		ownerAgentId: params.opts.ownerAgentId,
		chatId: String(auth.chatId),
		accountId: route.accountId,
		sessionKeyForInternalHooks: keys?.sessionKeyForInternalHooks,
		policySessionKey: keys?.policySessionKey,
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
	});
	return {
		...params,
		telegramDeps,
		runtimeCfg,
		runtimeTelegramCfg,
		...auth,
		threadParams: buildTelegramThreadParams(auth.threadSpec),
		nativeCommandRuntime,
		buildDeliveryBaseOptions,
		loadDeliveryRuntime: loadTelegramNativeCommandDeliveryRuntime
	};
}
//#endregion
export { resolveTelegramNativeCommandThreadContext as n, prepareTelegramCommandDispatch as t };

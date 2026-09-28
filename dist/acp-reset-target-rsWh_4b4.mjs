import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./account-id-B1bfbA5J.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { n as resolveCommandConversationResolution } from "./conversation-resolution-BQfeG7hv.mjs";
import { b as normalizeConversationText, t as getSessionBindingService } from "./session-binding-service-n2QTfkUE.mjs";
import { n as listAcpBindings } from "./bindings-CI-O7TMQ.mjs";
import { n as normalizeBindingConfig, t as buildConfiguredAcpSessionKey } from "./persistent-bindings.types-C5MKo8rH.mjs";
import { n as resolveConfiguredBindingRecord } from "./configured-binding-registry-CFlh3sPP.mjs";
//#region src/auto-reply/reply/conversation-binding-input.ts
function resolveConversationBindingChannelFromMessage(ctx, commandChannel) {
	const raw = ctx.OriginatingChannel ?? commandChannel ?? ctx.Surface ?? ctx.Provider;
	return normalizeLowercaseStringOrEmpty(normalizeConversationText(raw));
}
function resolveConversationBindingAccountIdFromMessage(params) {
	const channel = resolveConversationBindingChannelFromMessage(params.ctx, params.commandChannel);
	const plugin = getLoadedChannelPluginForRead(channel);
	return normalizeConversationText(params.ctx.AccountId) || normalizeConversationText(plugin?.config.defaultAccountId?.(params.cfg)) || "default";
}
function resolveConversationBindingThreadIdFromMessage(ctx) {
	return stringifyRouteThreadId(ctx.MessageThreadId);
}
function resolveConversationBindingContextFromMessage(params) {
	return resolveCommandConversationResolution({
		cfg: params.cfg,
		channel: resolveConversationBindingChannelFromMessage(params.ctx),
		accountId: params.ctx.AccountId,
		chatType: params.ctx.ChatType,
		threadId: params.ctx.MessageThreadId,
		threadParentId: params.ctx.ThreadParentId,
		senderId: params.senderId ?? params.ctx.SenderId,
		sessionKey: params.sessionKey ?? params.ctx.SessionKey,
		parentSessionKey: params.parentSessionKey ?? params.ctx.ParentSessionKey,
		from: params.ctx.From,
		originatingTo: params.ctx.OriginatingTo,
		commandTo: params.commandTo,
		fallbackTo: params.ctx.To,
		nativeChannelId: params.ctx.NativeChannelId
	});
}
function resolveConversationBindingContextFromAcpCommand(params) {
	return resolveConversationBindingContextFromMessage({
		cfg: params.cfg,
		ctx: params.ctx,
		senderId: params.command.senderId,
		sessionKey: params.sessionKey,
		parentSessionKey: params.ctx.ParentSessionKey,
		commandTo: params.command.to
	});
}
//#endregion
//#region src/auto-reply/reply/acp-reset-target.ts
function resolveResetTargetAccountId(params) {
	const explicit = normalizeOptionalString(params.accountId) ?? "";
	if (explicit) return explicit;
	const configuredDefault = params.cfg.channels[params.channel]?.defaultAccount;
	return normalizeOptionalString(configuredDefault) ?? "default";
}
function resolveRawConfiguredAcpSessionKey(params) {
	for (const binding of listAcpBindings(params.cfg)) {
		const bindingChannel = normalizeLowercaseStringOrEmpty(normalizeOptionalString(binding.match.channel));
		if (!bindingChannel || bindingChannel !== params.channel) continue;
		const bindingAccountId = normalizeOptionalString(binding.match.accountId) ?? "";
		if (bindingAccountId && bindingAccountId !== "*" && bindingAccountId !== params.accountId) continue;
		const peerId = normalizeOptionalString(binding.match.peer?.id) ?? "";
		const matchedConversationId = peerId === params.conversationId ? params.conversationId : peerId && peerId === params.parentConversationId ? params.parentConversationId : void 0;
		if (!matchedConversationId) continue;
		const acp = normalizeBindingConfig(binding.acp);
		return buildConfiguredAcpSessionKey({
			channel: params.channel,
			accountId: bindingAccountId && bindingAccountId !== "*" ? bindingAccountId : params.accountId,
			conversationId: matchedConversationId,
			...params.parentConversationId ? { parentConversationId: params.parentConversationId } : {},
			agentId: binding.agentId,
			mode: acp.mode === "oneshot" ? "oneshot" : "persistent",
			...acp.cwd ? { cwd: acp.cwd } : {},
			...acp.backend ? { backend: acp.backend } : {},
			...acp.label ? { label: acp.label } : {}
		});
	}
}
async function resolveEffectiveResetTargetSessionKey(params) {
	const commandTargetSessionKey = normalizeOptionalString(params.commandTargetSessionKey);
	if (commandTargetSessionKey) return params.allowNonAcpBindingSessionKey || isAcpSessionKey(commandTargetSessionKey) ? commandTargetSessionKey : void 0;
	const activeSessionKey = normalizeOptionalString(params.activeSessionKey);
	const activeAcpSessionKey = activeSessionKey && isAcpSessionKey(activeSessionKey) ? activeSessionKey : void 0;
	const activeIsNonAcp = Boolean(activeSessionKey) && !activeAcpSessionKey;
	const channel = normalizeLowercaseStringOrEmpty(normalizeOptionalString(params.channel));
	const conversationId = normalizeOptionalString(params.conversationId) ?? "";
	if (!channel || !conversationId) return activeAcpSessionKey;
	const accountId = resolveResetTargetAccountId({
		cfg: params.cfg,
		channel,
		accountId: params.accountId
	});
	const parentConversationId = normalizeOptionalString(params.parentConversationId) || void 0;
	const allowNonAcpBindingSessionKey = Boolean(params.allowNonAcpBindingSessionKey);
	const serviceBinding = await getSessionBindingService().resolveByConversationAsync({
		channel,
		accountId,
		conversationId,
		parentConversationId
	});
	const serviceSessionKey = serviceBinding?.targetKind === "session" ? serviceBinding.targetSessionKey.trim() : "";
	if (serviceSessionKey) {
		if (allowNonAcpBindingSessionKey) return serviceSessionKey;
		return isAcpSessionKey(serviceSessionKey) ? serviceSessionKey : void 0;
	}
	if (activeIsNonAcp && params.skipConfiguredFallbackWhenActiveSessionNonAcp) return;
	const configuredBinding = resolveConfiguredBindingRecord({
		cfg: params.cfg,
		channel,
		accountId,
		conversationId,
		parentConversationId
	});
	const configuredSessionKey = configuredBinding?.record.targetKind === "session" ? configuredBinding.record.targetSessionKey.trim() : "";
	if (configuredSessionKey) {
		if (allowNonAcpBindingSessionKey) return configuredSessionKey;
		return isAcpSessionKey(configuredSessionKey) ? configuredSessionKey : void 0;
	}
	const rawConfiguredSessionKey = resolveRawConfiguredAcpSessionKey({
		cfg: params.cfg,
		channel,
		accountId,
		conversationId,
		...parentConversationId ? { parentConversationId } : {}
	});
	if (rawConfiguredSessionKey) return rawConfiguredSessionKey;
	if (params.fallbackToActiveAcpWhenUnbound === false) return;
	return activeAcpSessionKey;
}
//#endregion
export { resolveConversationBindingContextFromMessage as a, resolveConversationBindingContextFromAcpCommand as i, resolveConversationBindingAccountIdFromMessage as n, resolveConversationBindingThreadIdFromMessage as o, resolveConversationBindingChannelFromMessage as r, resolveEffectiveResetTargetSessionKey as t };

import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { b as isAcpSessionKey } from "./session-key-CSDERtm3.mjs";
import "./account-id-ifCOO7_9.mjs";
import { i as getLoadedChannelPluginForRead } from "./registry-loaded-B-WQB-l0.mjs";
import { n as listAcpBindings } from "./bindings-Cw_QSeBA.mjs";
import { A as resolveCommandConversationResolution, t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import { n as normalizeBindingConfig, t as buildConfiguredAcpSessionKey } from "./persistent-bindings.types-Deh63P2t.mjs";
import { n as resolveConfiguredBindingRecord } from "./configured-binding-registry-QGs3UeEc.mjs";
//#region src/auto-reply/reply/conversation-binding-input.ts
function resolveConversationBindingChannelFromMessage(ctx, commandChannel) {
	const raw = ctx.OriginatingChannel ?? commandChannel ?? ctx.Surface ?? ctx.Provider;
	return normalizeStringifiedOptionalString(raw)?.toLowerCase() ?? "";
}
function resolveConversationBindingAccountIdFromMessage(params) {
	const channel = resolveConversationBindingChannelFromMessage(params.ctx, params.commandChannel);
	const plugin = getLoadedChannelPluginForRead(channel);
	return normalizeStringifiedOptionalString(params.ctx.AccountId) ?? normalizeStringifiedOptionalString(plugin?.config.defaultAccountId?.(params.cfg)) ?? "default";
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
function resolveRawConfiguredAcpSessionKey(params) {
	for (const binding of listAcpBindings(params.cfg)) {
		const bindingChannel = normalizeLowercaseStringOrEmpty(binding.match.channel);
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
	const allowedTarget = (sessionKey) => params.allowNonAcpBindingSessionKey || isAcpSessionKey(sessionKey) ? sessionKey : void 0;
	const commandTargetSessionKey = normalizeOptionalString(params.commandTargetSessionKey);
	if (commandTargetSessionKey) return allowedTarget(commandTargetSessionKey);
	const activeSessionKey = normalizeOptionalString(params.activeSessionKey);
	const activeAcpSessionKey = activeSessionKey && isAcpSessionKey(activeSessionKey) ? activeSessionKey : void 0;
	const activeIsNonAcp = Boolean(activeSessionKey) && !activeAcpSessionKey;
	const channel = normalizeLowercaseStringOrEmpty(params.channel);
	const conversationId = normalizeOptionalString(params.conversationId) ?? "";
	if (!channel || !conversationId) return activeAcpSessionKey;
	const accountId = normalizeOptionalString(params.accountId) ?? normalizeOptionalString(params.cfg.channels?.[channel]?.defaultAccount) ?? "default";
	const parentConversationId = normalizeOptionalString(params.parentConversationId);
	const conversation = {
		channel,
		accountId,
		conversationId,
		parentConversationId
	};
	const serviceBinding = await getSessionBindingService().resolveByConversationAsync(conversation);
	const serviceSessionKey = serviceBinding?.targetKind === "session" ? serviceBinding.targetSessionKey.trim() : "";
	if (serviceSessionKey) return allowedTarget(serviceSessionKey);
	if (activeIsNonAcp && params.skipConfiguredFallbackWhenActiveSessionNonAcp) return;
	const configuredBinding = resolveConfiguredBindingRecord({
		cfg: params.cfg,
		...conversation
	});
	const configuredSessionKey = configuredBinding?.record.targetKind === "session" ? configuredBinding.record.targetSessionKey.trim() : "";
	if (configuredSessionKey) return allowedTarget(configuredSessionKey);
	const rawConfiguredSessionKey = resolveRawConfiguredAcpSessionKey({
		cfg: params.cfg,
		channel,
		accountId,
		conversationId,
		...parentConversationId ? { parentConversationId } : {}
	});
	if (rawConfiguredSessionKey) return rawConfiguredSessionKey;
	return params.fallbackToActiveAcpWhenUnbound === false ? void 0 : activeAcpSessionKey;
}
//#endregion
export { resolveConversationBindingContextFromMessage as a, resolveConversationBindingContextFromAcpCommand as i, resolveConversationBindingAccountIdFromMessage as n, resolveConversationBindingChannelFromMessage as r, resolveEffectiveResetTargetSessionKey as t };

import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-X0yNhfFZ.mjs";
import "./registry-BKdVEB34.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { i as stripTargetTopicSuffix, n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-BJKXiLk4.mjs";
import { i as normalizeConversationTargetRef } from "./current-conversation-binding-row-De9sUoDf.mjs";
import { t as loadOptionalBundledChannelPublicArtifact } from "./optional-public-artifact-CwNHXywg.mjs";
//#region src/infra/outbound/conversation-id.ts
function resolveExplicitConversationTargetId(target) {
	for (const prefix of [
		"channel:",
		"conversation:",
		"group:",
		"room:",
		"dm:"
	]) if (normalizeLowercaseStringOrEmpty(target).startsWith(prefix)) return normalizeOptionalString(target.slice(prefix.length));
}
/**
* Chooses the best conversation id from an explicit thread id or outbound targets.
*/
function resolveConversationIdFromTargets(params) {
	const threadId = stringifyRouteThreadId(params.threadId);
	if (threadId) return threadId;
	for (const rawTarget of params.targets) {
		const target = normalizeOptionalString(rawTarget);
		if (!target) continue;
		const explicitConversationId = resolveExplicitConversationTargetId(target);
		if (explicitConversationId) return explicitConversationId;
		if (target.includes(":") && explicitConversationId === void 0) continue;
		const mentionMatch = target.match(/^<#(\d+)>$/);
		if (mentionMatch?.[1]) return mentionMatch[1];
		if (/^\d{6,}$/.test(target)) return target;
	}
}
//#endregion
//#region src/channels/plugins/thread-binding-api.ts
/**
* Bundled channel thread-binding public artifact loader.
*
* Reads lightweight thread placement and inbound conversation hooks without full plugin loading.
*/
function loadBundledChannelThreadBindingApi(channelId) {
	return loadOptionalBundledChannelPublicArtifact({
		channelId,
		artifactBasename: "thread-binding-api.js"
	});
}
function normalizeThreadBindingPlacement(value) {
	const normalized = normalizeOptionalString(typeof value === "string" ? value : void 0);
	return normalized === "current" || normalized === "child" ? normalized : void 0;
}
/**
* Resolves the default top-level thread-binding placement for a bundled channel.
*/
function resolveBundledChannelThreadBindingDefaultPlacement(channelId) {
	return normalizeThreadBindingPlacement(loadBundledChannelThreadBindingApi(channelId)?.defaultTopLevelPlacement);
}
/**
* Resolves inbound conversation refs from a bundled channel thread-binding artifact.
*/
function resolveBundledChannelThreadBindingInboundConversation(params) {
	const api = loadBundledChannelThreadBindingApi(params.channelId);
	if (typeof api?.resolveInboundConversation !== "function") return;
	return api.resolveInboundConversation({
		from: params.from,
		to: params.to,
		conversationId: params.conversationId,
		threadId: params.threadId,
		threadParentId: params.threadParentId,
		isGroup: params.isGroup
	});
}
//#endregion
//#region src/channels/conversation-resolution.ts
/**
* Canonical conversation resolution for command and inbound channel flows.
* This module turns channel targets, thread ids, aliases, and plugin hooks into stable binding ids.
*/
const CANONICAL_TARGET_PREFIXES = ["user:", "spaces/"];
function resolveChannelId(raw) {
	const normalizedRaw = normalizeOptionalString(raw);
	if (!normalizedRaw) return null;
	return normalizeAnyChannelId(normalizedRaw) ?? normalizeOptionalLowercaseString(normalizedRaw) ?? null;
}
function shouldDefaultParentConversationToSelf(plugin) {
	return plugin?.bindings?.selfParentConversationByDefault === true;
}
function normalizeResolutionTarget(params) {
	const conversationId = normalizeOptionalString(params.conversation?.conversationId);
	if (!conversationId) return null;
	const parentConversationId = normalizeOptionalString(params.conversation?.parentConversationId);
	const defaultParentToSelf = shouldDefaultParentConversationToSelf(params.plugin) && !params.threadId && !parentConversationId;
	const normalized = normalizeConversationTargetRef({
		conversationId,
		parentConversationId: defaultParentToSelf ? conversationId : parentConversationId
	});
	const normalizedParentConversationId = defaultParentToSelf ? normalized.conversationId : normalized.parentConversationId;
	return {
		channel: params.channel,
		accountId: params.accountId,
		conversationId: normalized.conversationId,
		...normalizedParentConversationId ? { parentConversationId: normalizedParentConversationId } : {},
		...params.threadId ? { threadId: params.threadId } : {}
	};
}
function resolveBindingAccountId(params) {
	return normalizeOptionalString(params.rawAccountId) || normalizeOptionalString(params.plugin?.config.defaultAccountId?.(params.cfg)) || "default";
}
function resolveFallbackConversationTargetId(params) {
	const { allowNumericTopicShorthand = false } = params;
	const target = normalizeOptionalString(params.rawTarget);
	if (!target) return;
	const withoutKind = stripOutboundTargetKindPrefix(target);
	const withoutTopic = params.preserveExplicitTopicSuffix && /:topic:/iu.test(withoutKind) ? withoutKind : stripTargetTopicSuffix(withoutKind, { allowNumericShorthand: allowNumericTopicShorthand });
	return resolveConversationIdFromTargets({ targets: [withoutTopic] }) ?? (withoutTopic !== target ? withoutTopic : void 0) ?? resolveConversationIdFromTargets({ targets: [target] });
}
function resolveChannelTargetId(params) {
	const target = normalizeOptionalString(params.target);
	if (!target) return;
	const messaging = params.plugin?.messaging;
	const lower = normalizeLowercaseStringOrEmpty(target);
	const channelPrefix = `${params.channel}:`;
	if (lower.startsWith(channelPrefix)) return resolveChannelTargetId({
		...params,
		target: target.slice(channelPrefix.length)
	});
	if (CANONICAL_TARGET_PREFIXES.some((prefix) => lower.startsWith(prefix))) return target;
	const prefixedChannel = resolveTargetPrefixedChannel(target);
	if (!prefixedChannel || prefixedChannel !== params.channel) {
		const explicitConversationId = resolveFallbackConversationTargetId({
			rawTarget: target,
			allowNumericTopicShorthand: messaging?.numericTopicShorthand === true,
			preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix
		});
		if (explicitConversationId) return explicitConversationId;
	}
	const normalizedTarget = normalizeOptionalString(messaging?.normalizeTarget?.(target));
	if (normalizedTarget) {
		const withoutProvider = stripTargetProviderPrefix(normalizedTarget, params.channel);
		return resolveFallbackConversationTargetId({
			rawTarget: withoutProvider,
			allowNumericTopicShorthand: messaging?.numericTopicShorthand === true,
			preserveExplicitTopicSuffix: params.preserveExplicitTopicSuffix
		}) || withoutProvider || normalizedTarget;
	}
	return target;
}
function buildThreadingContext(params) {
	const to = normalizeOptionalString(params.originatingTo) ?? normalizeOptionalString(params.fallbackTo);
	return {
		...to ? { To: to } : {},
		...params.from ? { From: params.from } : {},
		...params.chatType ? { ChatType: params.chatType } : {},
		...params.threadId ? { MessageThreadId: params.threadId } : {},
		...params.nativeChannelId ? { NativeChannelId: params.nativeChannelId } : {}
	};
}
/**
* Resolves whether top-level bindings default to the current conversation or a child thread.
*/
function resolveChannelDefaultBindingPlacement(rawChannel) {
	const channel = resolveChannelId(rawChannel);
	if (!channel) return;
	return getLoadedChannelPluginForRead(channel)?.conversationBindings?.defaultTopLevelPlacement ?? resolveBundledChannelThreadBindingDefaultPlacement(channel);
}
/** Explicit spawn discovery is separate from automatic command placement. */
function supportsThreadBindingSpawn(rawChannel) {
	const channel = resolveChannelId(rawChannel);
	if (!channel) return false;
	const placement = resolveChannelDefaultBindingPlacement(channel);
	return placement === "child" || placement === "current" && getLoadedChannelPluginForRead(channel)?.conversationBindings?.supportsCurrentConversationBinding === true;
}
/**
* Resolves command context into a canonical channel/account/conversation tuple.
*/
function resolveCommandConversationResolution(params) {
	const channel = resolveChannelId(params.channel);
	if (!channel) return null;
	const plugin = params.plugin ?? getLoadedChannelPluginForRead(channel);
	const accountId = resolveBindingAccountId({
		rawAccountId: params.accountId,
		plugin,
		cfg: params.cfg
	});
	const threadId = stringifyRouteThreadId(params.threadId);
	const commandParams = {
		accountId,
		threadId,
		threadParentId: normalizeOptionalString(params.threadParentId),
		senderId: normalizeOptionalString(params.senderId),
		sessionKey: normalizeOptionalString(params.sessionKey),
		parentSessionKey: normalizeOptionalString(params.parentSessionKey),
		from: normalizeOptionalString(params.from),
		chatType: normalizeOptionalString(params.chatType),
		originatingTo: params.originatingTo ?? void 0,
		commandTo: params.commandTo ?? void 0,
		fallbackTo: params.fallbackTo ?? void 0
	};
	const resolvedByProvider = plugin?.bindings?.resolveCommandConversation?.(commandParams);
	const providerResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: resolvedByProvider,
		threadId,
		plugin
	});
	if (providerResolution) return providerResolution;
	const focusedBinding = plugin?.threading?.resolveFocusedBinding?.({
		cfg: params.cfg,
		accountId,
		context: buildThreadingContext({
			fallbackTo: params.fallbackTo ?? void 0,
			originatingTo: params.originatingTo ?? void 0,
			threadId,
			from: normalizeOptionalString(params.from),
			chatType: normalizeOptionalString(params.chatType),
			nativeChannelId: normalizeOptionalString(params.nativeChannelId)
		})
	});
	const focusedResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: focusedBinding,
		threadId,
		plugin
	});
	if (focusedResolution) return focusedResolution;
	const resolveTarget = (target) => resolveChannelTargetId({
		channel,
		plugin,
		target
	});
	const baseConversationId = resolveTarget(params.originatingTo) ?? resolveTarget(params.commandTo) ?? resolveTarget(params.fallbackTo);
	const parentConversationId = resolveTarget(params.threadParentId) ?? (threadId && baseConversationId && baseConversationId !== threadId ? baseConversationId : void 0);
	const conversationId = threadId || baseConversationId;
	if (!conversationId) return null;
	return normalizeResolutionTarget({
		channel,
		accountId,
		conversation: {
			conversationId,
			parentConversationId
		},
		threadId,
		plugin
	});
}
/**
* Resolves inbound message context into the canonical binding conversation tuple.
*/
function resolveInboundConversationResolution(params) {
	const channel = resolveChannelId(params.channel);
	if (!channel) return null;
	const plugin = getLoadedChannelPluginForRead(channel);
	const accountId = resolveBindingAccountId({
		rawAccountId: params.accountId,
		plugin,
		cfg: params.cfg
	});
	const threadId = stringifyRouteThreadId(params.threadId);
	const resolverParams = {
		from: normalizeOptionalString(params.from),
		to: normalizeOptionalString(params.to),
		conversationId: normalizeOptionalString(params.conversationId) ?? normalizeOptionalString(params.groupId) ?? normalizeOptionalString(params.to),
		threadId,
		threadParentId: stringifyRouteThreadId(params.threadParentId),
		isGroup: params.isGroup ?? true
	};
	const providerConversation = plugin?.messaging?.resolveInboundConversation?.(resolverParams);
	const providerResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: providerConversation,
		threadId,
		plugin
	});
	if (providerResolution || providerConversation === null) return providerResolution;
	const artifactConversation = resolveBundledChannelThreadBindingInboundConversation({
		channelId: channel,
		...resolverParams
	});
	const artifactResolution = normalizeResolutionTarget({
		channel,
		accountId,
		conversation: artifactConversation,
		threadId,
		plugin
	});
	if (artifactResolution || artifactConversation === null) return artifactResolution;
	const resolveTarget = (target) => resolveChannelTargetId({
		channel,
		plugin,
		target,
		preserveExplicitTopicSuffix: threadId == null
	});
	const parentConversationId = resolveTarget(params.threadParentId == null ? void 0 : String(params.threadParentId)) ?? resolveTarget(params.to) ?? resolveTarget(params.conversationId) ?? resolveTarget(params.groupId);
	const genericConversationId = threadId ?? resolveTarget(params.conversationId) ?? resolveTarget(params.groupId) ?? parentConversationId;
	if (!genericConversationId) return null;
	return normalizeResolutionTarget({
		channel,
		accountId,
		conversation: {
			conversationId: genericConversationId,
			parentConversationId: threadId != null ? parentConversationId : void 0
		},
		threadId,
		plugin
	});
}
//#endregion
export { resolveConversationIdFromTargets as a, supportsThreadBindingSpawn as i, resolveCommandConversationResolution as n, resolveInboundConversationResolution as r, resolveChannelDefaultBindingPlacement as t };

import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { d as isSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { i as channelRouteTargetsMatchExact, n as channelRouteDedupeKey } from "./channel-route-2bD3dZs2.mjs";
import { o as mergeDeliveryContext } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-GGZXKqeN.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-D9KEia-0.mjs";
import { i as resolveChannelAllowFrom } from "./account-resolution-akTcFkRf.mjs";
import { i as normalizeTargetForProvider } from "./target-normalization-Cz6f81yX.mjs";
import { i as resolveChannelTarget } from "./target-resolver-c-W9fpkt.mjs";
import { r as isReservedTargetLiteralError } from "./target-errors-MHPko63s.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { r as resolveOutboundChannelPlugin, t as normalizeDeliverableOutboundChannel } from "./channel-resolution-JZ360Soo.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-iQxjPtMU.mjs";
import { r as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-BIlgyhxH.mjs";
import { t as isPotentialConfiguredMessageChannel } from "./message-account-selection-CWcFAbys.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-Y84oqniG.mjs";
import { t as resolveOutboundTargetWithPlugin } from "./targets-resolve-shared-zsZ_U_FD.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-Cc-Q1k0G.mjs";
//#region src/infra/outbound/heartbeat-route-context.ts
/** Compare the plugin-owned conversation grammar; do not create a parallel target parser. */
function heartbeatExecRouteKey(route, plugin) {
	const isGroup = plugin?.messaging?.inferTargetChatType?.({ to: route.to ?? "" }) !== "direct";
	const scopedConversation = route.threadId == null ? void 0 : plugin?.messaging?.resolveInboundConversation?.({
		to: String(route.threadId),
		isGroup
	});
	const resolveTarget = (conversation) => conversation?.conversationId ? plugin?.messaging?.resolveDeliveryTarget?.({
		conversationId: conversation.conversationId,
		parentConversationId: conversation.parentConversationId
	}) : void 0;
	const scopedTarget = resolveTarget(scopedConversation);
	const normalizedThread = scopedTarget?.threadId ?? route.threadId;
	const conversation = plugin?.messaging?.resolveInboundConversation?.({
		to: route.to,
		threadId: normalizedThread,
		isGroup
	});
	const target = resolveTarget(conversation);
	if (scopedTarget?.threadId != null && scopedConversation?.conversationId !== conversation?.conversationId) return;
	const explicitThread = normalizedThread == null ? void 0 : String(normalizedThread);
	if (target?.threadId != null && explicitThread != null && target.threadId !== explicitThread) return;
	return channelRouteDedupeKey({
		channel: route.channel,
		accountId: route.accountId,
		to: conversation?.conversationId ?? normalizeTargetForProvider(route.channel ?? "", route.to, plugin),
		threadId: target?.threadId ?? route.threadId
	});
}
function hasDeliverableHeartbeatTurnSource(turnSource) {
	return Boolean(turnSource?.channel && isDeliverableMessageChannel(turnSource.channel) && turnSource.to?.trim());
}
function isPositivelyDirectHeartbeatOwnerTarget(params) {
	const to = params.plugin ? stripTargetProviderPrefix(params.to, params.plugin.id, ...params.plugin.messaging?.targetPrefixes ?? []) : params.to.trim();
	return (normalizeChatType(params.chatType) ?? params.plugin?.messaging?.inferTargetChatType?.({ to })) === "direct";
}
/** Canonicalize scoped topics using the channel's parser/serializer pair. */
function normalizeHeartbeatExecRoute(route, plugin) {
	const grammar = plugin?.messaging;
	if (!plugin || !grammar?.resolveSessionConversation || !grammar.resolveSessionTarget || !route.to) return route;
	const raw = stripOutboundTargetKindPrefix(stripTargetProviderPrefix(route.to, plugin.id, ...grammar.targetPrefixes ?? []));
	const embedded = grammar.resolveSessionConversation({
		kind: "group",
		rawId: raw
	});
	const explicit = route.threadId == null ? null : grammar.resolveSessionConversation({
		kind: "group",
		rawId: String(route.threadId)
	});
	const id = embedded?.id ?? raw;
	if (explicit && (explicit.id !== id || embedded?.threadId && explicit.threadId !== embedded.threadId)) return;
	const threadId = embedded?.threadId ?? explicit?.threadId;
	if (!threadId) return route;
	const to = grammar.resolveSessionTarget({
		kind: "group",
		id,
		threadId
	});
	if (!to) return;
	const verified = grammar.resolveSessionConversation({
		kind: "group",
		rawId: to
	});
	if (verified?.id !== id || verified.threadId !== threadId) return;
	const target = grammar.resolveDeliveryTarget?.({ conversationId: to });
	if (route.threadId != null && !explicit && target?.threadId !== String(route.threadId)) return;
	return {
		...route,
		to,
		threadId: target?.threadId ?? route.threadId
	};
}
//#endregion
//#region src/infra/outbound/targets.ts
/** Resolves a user-supplied outbound destination through the channel plugin. */
async function resolveOutboundTarget(params) {
	return await resolveOutboundTargetWithPlugin({
		plugin: params.plugin ?? resolveOutboundChannelPlugin({
			channel: params.channel,
			cfg: params.cfg,
			allowBootstrap: params.allowBootstrap
		}),
		target: params
	}) ?? {
		ok: false,
		error: /* @__PURE__ */ new Error(`Unsupported channel: ${params.channel}`)
	};
}
function concreteAllowFromEntries(entries) {
	return mapAllowFromEntries(entries).map((entry) => entry.trim()).filter((entry) => entry && entry !== "*" && !entry.endsWith(":*"));
}
function ownerIdMatchesRoute(plugin, ownerId, routeTo) {
	const normalize = (value) => {
		return resolveTargetPrefixedChannel(value) === plugin.id ? stripTargetProviderPrefix(value, plugin.id, ...plugin.messaging?.targetPrefixes ?? []) : value.trim();
	};
	return normalize(ownerId) === normalize(routeTo);
}
async function resolveHeartbeatOwnerRoute(params) {
	const session = deliveryContextFromSession(params.entry);
	const plugins = [];
	const seen = /* @__PURE__ */ new Set();
	const add = (plugin) => {
		if (!plugin || !isDeliverableMessageChannel(plugin.id) || seen.has(plugin.id)) return;
		seen.add(plugin.id);
		const accountId = params.heartbeat?.accountId?.trim() || (session?.channel === plugin.id ? session.accountId : void 0) || resolveChannelDefaultAccountId({
			plugin,
			cfg: params.cfg
		});
		if (!isSecretOwnerAvailable("account", `${plugin.id}:${normalizeAccountId(accountId)}`)) return;
		const inspected = asOptionalRecord(plugin.config.inspectAccount?.(params.cfg, accountId));
		if (inspected?.enabled === false || inspected?.configured === false || hasConfiguredUnavailableCredentialStatus(inspected)) return;
		plugins.push({
			plugin,
			accountId
		});
	};
	if (session?.channel) add(resolveOutboundChannelPlugin({
		channel: session.channel,
		cfg: params.cfg
	}));
	for (const plugin of listRuntimeVisibleChannelPlugins()) if (await isPotentialConfiguredMessageChannel({
		cfg: params.cfg,
		plugin
	})) add(plugin);
	const buildRoute = (plugin, ownerId) => ({
		plugin,
		ownerId,
		reuseSessionRoute: session?.channel === plugin.id && Boolean(session.to) && normalizeChatType(params.entry?.chatType) === "direct" && ownerIdMatchesRoute(plugin, ownerId, session.to ?? "")
	});
	const configuredOwners = concreteAllowFromEntries(params.cfg.commands?.ownerAllowFrom);
	for (const { plugin } of plugins) {
		const configuredOwner = configuredOwners.find((ownerId) => {
			const prefixedChannel = resolveTargetPrefixedChannel(ownerId);
			return (!prefixedChannel || prefixedChannel === plugin.id) && isPositivelyDirectHeartbeatOwnerTarget({
				plugin,
				to: ownerId
			});
		});
		if (configuredOwner) return buildRoute(plugin, configuredOwner);
	}
	for (const { plugin, accountId } of plugins) {
		const ownerId = concreteAllowFromEntries(await resolveChannelAllowFrom({
			plugin,
			cfg: params.cfg,
			accountId
		}))[0];
		if (ownerId) return buildRoute(plugin, ownerId);
	}
}
/** Read-only owner-route probe for status/doctor surfaces. Unproven targets fail closed. */
async function hasResolvableHeartbeatOwnerRoute(params) {
	const delivery = await resolveHeartbeatDeliveryTarget({
		...params,
		heartbeat: {
			...params.heartbeat,
			target: "owner"
		}
	});
	return delivery.channel !== "none" && Boolean(delivery.to);
}
/**
* Resolves heartbeat delivery. Owner/unset ignores `to`; only explicit channels consume it.
*/
async function resolveHeartbeatDeliveryTarget(params) {
	const { cfg, entry } = params;
	const heartbeat = params.heartbeat ?? cfg.agents?.defaults?.heartbeat;
	const rawTarget = heartbeat?.target;
	const implicitDefaultRoute = rawTarget === void 0;
	let target = implicitDefaultRoute ? "owner" : "none";
	let preparedExplicitPlugin;
	let preparedExplicitTo;
	if (rawTarget === "none" || rawTarget === "last" || rawTarget === "owner") target = rawTarget;
	else if (typeof rawTarget === "string") {
		const normalized = normalizeDeliverableOutboundChannel(rawTarget);
		if (normalized) target = normalized;
		else {
			const explicitTo = heartbeat?.to?.trim();
			if (explicitTo) {
				preparedExplicitPlugin = resolveOutboundChannelPlugin({
					channel: rawTarget,
					cfg,
					agentId: params.agentId,
					allowBootstrap: true
				});
				if (preparedExplicitPlugin) {
					target = preparedExplicitPlugin.id;
					preparedExplicitTo = explicitTo;
				}
			}
		}
	}
	if (target === "none") return buildNoHeartbeatDeliveryTarget({
		...resolveSessionDeliveryTarget({ entry }),
		reason: "target-none",
		accountId: void 0
	});
	const execOwnsRoute = params.turnSourceKind === "exec";
	const sourcePlugin = execOwnsRoute && params.turnSource?.channel ? resolveOutboundChannelPlugin({
		channel: params.turnSource.channel,
		cfg,
		agentId: params.agentId,
		allowBootstrap: true
	}) : void 0;
	const turnSource = execOwnsRoute ? normalizeHeartbeatExecRoute({ ...params.turnSource }, sourcePlugin) : params.turnSource;
	if (execOwnsRoute && !hasDeliverableHeartbeatTurnSource(turnSource)) return buildNoHeartbeatDeliveryTarget({ reason: "no-route" });
	const sessionDelivery = deliveryContextFromSession(entry);
	const ownerMode = target === "owner";
	const ownerTurnSource = ownerMode && hasDeliverableHeartbeatTurnSource(turnSource);
	const resolvedTurnSource = execOwnsRoute ? turnSource : target === "last" || ownerTurnSource ? mergeDeliveryContext(turnSource, sessionDelivery) : void 0;
	const ownerRoute = ownerMode && !ownerTurnSource ? await resolveHeartbeatOwnerRoute({
		cfg,
		entry,
		heartbeat
	}) : void 0;
	if (ownerMode && !ownerTurnSource && !ownerRoute) return buildNoHeartbeatDeliveryTarget({
		...resolveSessionDeliveryTarget({ entry }),
		reason: "no-route",
		accountId: void 0
	});
	const ownerSession = ownerRoute?.reuseSessionRoute ? sessionDelivery : void 0;
	const resolvedTarget = resolveSessionDeliveryTarget({
		entry,
		mode: "heartbeat",
		...execOwnsRoute ? {
			requestedChannel: "last",
			turnSourceChannel: turnSource?.channel,
			turnSourceTo: turnSource?.to,
			turnSourceAccountId: turnSource?.accountId,
			turnSourceThreadId: turnSource?.threadId
		} : preparedExplicitPlugin && preparedExplicitTo ? {
			requestedChannel: target,
			explicitTo: preparedExplicitTo
		} : ownerRoute ? {
			requestedChannel: ownerRoute.plugin.id,
			explicitTo: ownerSession?.to ?? ownerRoute.ownerId,
			explicitThreadId: ownerSession?.threadId
		} : {
			requestedChannel: target === "last" || ownerTurnSource ? "last" : target,
			explicitTo: ownerMode ? void 0 : heartbeat?.to,
			turnSourceChannel: resolvedTurnSource?.channel && isDeliverableMessageChannel(resolvedTurnSource.channel) ? resolvedTurnSource.channel : void 0,
			turnSourceTo: resolvedTurnSource?.to,
			turnSourceAccountId: resolvedTurnSource?.accountId,
			turnSourceThreadId: turnSource?.threadId
		}
	});
	const heartbeatAccountId = execOwnsRoute || ownerTurnSource ? void 0 : heartbeat?.accountId?.trim();
	let effectiveAccountId = heartbeatAccountId || resolvedTarget.accountId;
	const rejectDelivery = (reason, accountId = effectiveAccountId) => buildNoHeartbeatDeliveryTarget({
		...resolvedTarget,
		reason,
		accountId
	});
	if (!resolvedTarget.channel || !resolvedTarget.to) return rejectDelivery(target === "last" || ownerMode ? "no-route" : "no-target");
	const preparedPlugin = execOwnsRoute ? void 0 : preparedExplicitPlugin ?? ownerRoute?.plugin;
	const plugin = resolveOutboundChannelPlugin({
		channel: resolvedTarget.channel,
		cfg,
		agentId: params.agentId,
		allowBootstrap: true
	}) ?? preparedPlugin;
	const accountToValidate = execOwnsRoute ? effectiveAccountId : heartbeatAccountId;
	if (accountToValidate) {
		const listAccountIds = plugin?.config.listAccountIds;
		const accountIds = listAccountIds ? listAccountIds(cfg) : [];
		if (accountIds.length > 0) {
			const normalizedAccountId = normalizeAccountId(accountToValidate);
			if (!new Set(accountIds.map((accountId) => normalizeAccountId(accountId))).has(normalizedAccountId)) return rejectDelivery(ownerMode ? "no-route" : "unknown-account", normalizedAccountId);
			effectiveAccountId = normalizedAccountId;
		}
	}
	const execRouteKey = execOwnsRoute ? heartbeatExecRouteKey({
		...turnSource,
		accountId: effectiveAccountId
	}, plugin) : void 0;
	if (execOwnsRoute && execRouteKey === void 0) return rejectDelivery("exec-route-conflict");
	const targetParams = {
		channel: resolvedTarget.channel,
		to: resolvedTarget.to,
		cfg,
		accountId: effectiveAccountId
	};
	const resolved = await resolveOutboundTargetWithPlugin({
		plugin,
		target: {
			...targetParams,
			allowFrom: ownerRoute ? [ownerRoute.ownerId] : void 0,
			mode: "heartbeat"
		}
	});
	if (!resolved?.ok) return rejectDelivery(ownerMode ? "no-route" : "no-target");
	if (execOwnsRoute && execRouteKey !== heartbeatExecRouteKey({
		...resolvedTarget,
		to: resolved.to,
		accountId: effectiveAccountId
	}, plugin)) return rejectDelivery("exec-route-conflict");
	const deliveryChatType = ((target === "last" && !heartbeat?.to || ownerRoute?.reuseSessionRoute) && channelRouteTargetsMatchExact({
		left: {
			...sessionDelivery,
			threadId: void 0
		},
		right: {
			channel: resolvedTarget.channel,
			to: resolvedTarget.to,
			accountId: effectiveAccountId
		}
	}) ? normalizeChatType(entry?.chatType) : void 0) ?? inferChatTypeFromTarget({
		channel: resolvedTarget.channel,
		to: resolved.to,
		plugin
	});
	if (deliveryChatType === "direct" && heartbeat?.directPolicy === "block") return rejectDelivery("dm-blocked");
	if (ownerMode && !ownerTurnSource && !isPositivelyDirectHeartbeatOwnerTarget({
		plugin,
		to: resolved.to,
		chatType: deliveryChatType
	})) return rejectDelivery("no-route");
	let reason;
	if (plugin?.config.resolveAllowFromAsync || plugin?.config.resolveAllowFrom) {
		const explicit = await resolveOutboundTargetWithPlugin({
			plugin,
			target: {
				...targetParams,
				mode: "explicit"
			}
		});
		if (explicit?.ok && explicit.to !== resolved.to) reason = "allowFrom-fallback";
	}
	const messaging = plugin ? plugin.messaging : resolveOutboundChannelPlugin({
		channel: resolvedTarget.channel,
		cfg
	})?.messaging;
	const inheritedHeartbeatThreadId = !execOwnsRoute && messaging?.preserveHeartbeatThreadIdForGroupRoute === true && resolvedTarget.threadId == null && target === "last" && !heartbeat?.to && turnSource?.threadId == null && resolvedTarget.channel === resolvedTarget.lastChannel && Boolean(resolvedTarget.to) && Boolean(resolvedTarget.lastTo) && resolvedTarget.to === resolvedTarget.lastTo && normalizeChatType(entry?.chatType) === "group" ? resolvedTarget.lastThreadId : void 0;
	return {
		channel: resolvedTarget.channel,
		to: resolved.to,
		chatType: deliveryChatType,
		reason,
		accountId: effectiveAccountId,
		threadId: resolvedTarget.threadId ?? inheritedHeartbeatThreadId,
		lastChannel: resolvedTarget.lastChannel,
		lastAccountId: resolvedTarget.lastAccountId,
		...implicitDefaultRoute ? { implicitDefaultRoute: true } : {}
	};
}
function buildNoHeartbeatDeliveryTarget(params) {
	return {
		channel: "none",
		reason: params.reason,
		accountId: params.accountId,
		lastChannel: params.lastChannel,
		lastAccountId: params.lastAccountId
	};
}
/** Resolves heartbeat delivery and lets plugins refine the outbound session route. */
async function resolveHeartbeatDeliveryTargetWithSessionRoute(params) {
	const delivery = await resolveHeartbeatDeliveryTarget({
		...params,
		...params.turnSourceKind === "exec" ? { turnSource: { ...params.turnSource } } : {}
	});
	const heartbeat = params.heartbeat ?? params.cfg.agents?.defaults?.heartbeat;
	const ownerRouteMustBeDirect = (heartbeat?.target === void 0 || heartbeat.target === "owner") && !hasDeliverableHeartbeatTurnSource(params.turnSource);
	if (delivery.channel === "none" || !delivery.to) return delivery;
	const rejectDelivery = (reason) => buildNoHeartbeatDeliveryTarget({
		...delivery,
		reason
	});
	const deliveryTo = delivery.to;
	const plugin = resolveOutboundChannelPlugin({
		channel: delivery.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	const execRouteKey = params.turnSourceKind === "exec" ? heartbeatExecRouteKey(delivery, plugin) : void 0;
	if (params.turnSourceKind === "exec" && execRouteKey === void 0) return rejectDelivery("exec-route-conflict");
	const resolveSessionRoute = plugin?.messaging?.resolveOutboundSessionRoute;
	const isRejectedOwnerTarget = (to, chatType) => ownerRouteMustBeDirect && !isPositivelyDirectHeartbeatOwnerTarget({
		plugin,
		to,
		chatType
	});
	if (isRejectedOwnerTarget(deliveryTo, delivery.chatType)) return rejectDelivery("no-route");
	if (!resolveSessionRoute && !plugin?.messaging?.targetResolver) return delivery;
	let routeResolvedTarget;
	const targetResolution = await resolveChannelTarget({
		cfg: params.cfg,
		channel: delivery.channel,
		input: deliveryTo,
		accountId: delivery.accountId,
		unknownTargetMode: "normalized",
		plugin
	}).catch(() => null);
	if (targetResolution?.ok) routeResolvedTarget = targetResolution.target;
	else if (targetResolution && isReservedTargetLiteralError(targetResolution.error)) return rejectDelivery(ownerRouteMustBeDirect ? "no-route" : "no-target");
	if (execRouteKey !== void 0 && !targetResolution?.ok) return rejectDelivery("exec-route-conflict");
	if (execRouteKey !== void 0 && routeResolvedTarget && heartbeatExecRouteKey({
		...delivery,
		to: routeResolvedTarget.to
	}, plugin) !== execRouteKey) return rejectDelivery("exec-route-conflict");
	if (routeResolvedTarget?.kind === "user" && heartbeat?.directPolicy === "block") return rejectDelivery("dm-blocked");
	if (isRejectedOwnerTarget(routeResolvedTarget?.to ?? deliveryTo)) return rejectDelivery("no-route");
	if (!resolveSessionRoute) return delivery;
	const route = await resolveOutboundSessionRoute({
		cfg: params.cfg,
		channel: delivery.channel,
		plugin,
		agentId: params.agentId,
		accountId: delivery.accountId,
		target: routeResolvedTarget?.to ?? deliveryTo,
		...ownerRouteMustBeDirect ? { deliveryPurpose: "heartbeat-owner" } : {},
		resolvedTarget: routeResolvedTarget,
		currentSessionKey: params.currentSessionKey,
		threadId: delivery.threadId
	}).catch(() => void 0);
	if (execRouteKey !== void 0 && route === void 0) return rejectDelivery("exec-route-conflict");
	if (!route) return delivery;
	if (route.chatType === "direct" && heartbeat?.directPolicy === "block") return rejectDelivery("dm-blocked");
	if (isRejectedOwnerTarget(route.to, normalizeChatType(route.chatType))) return rejectDelivery("no-route");
	const refinedDelivery = {
		...delivery,
		to: route.to,
		chatType: route.chatType,
		threadId: route.threadId ?? delivery.threadId,
		...route.recipientSessionExact === true ? { targetSessionKey: route.sessionKey } : {}
	};
	if (execRouteKey !== void 0 && heartbeatExecRouteKey(refinedDelivery, plugin) !== execRouteKey) return rejectDelivery("exec-route-conflict");
	return refinedDelivery;
}
function inferChatTypeFromTarget(params) {
	const to = params.to.trim();
	if (!to) return;
	if (/^user:/i.test(to)) return "direct";
	if (/^(channel:|thread:)/i.test(to)) return "channel";
	if (/^group:/i.test(to)) return "group";
	return (params.plugin ?? resolveOutboundChannelPlugin({ channel: params.channel }))?.messaging?.inferTargetChatType?.({ to }) ?? void 0;
}
/** Resolves the sender id/allow-list context used for heartbeat sends. */
async function resolveHeartbeatSenderContext(params) {
	const provider = params.delivery.channel !== "none" ? params.delivery.channel : params.delivery.lastChannel;
	const accountId = params.delivery.accountId ?? (provider === params.delivery.lastChannel ? params.delivery.lastAccountId : void 0);
	const plugin = provider ? resolveOutboundChannelPlugin({
		channel: provider,
		cfg: params.cfg
	}) : void 0;
	const allowFromRaw = plugin ? await resolveChannelAllowFrom({
		plugin,
		cfg: params.cfg,
		accountId
	}) : void 0;
	const allowFrom = mapAllowFromEntries(allowFromRaw);
	const deliveryTo = params.delivery.to;
	const lastTo = deliveryContextFromSession(params.entry)?.to;
	const candidates = [
		deliveryTo?.trim(),
		provider && deliveryTo ? `${provider}:${deliveryTo}` : void 0,
		lastTo?.trim(),
		provider && lastTo ? `${provider}:${lastTo}` : void 0
	].filter((val) => Boolean(val?.trim()));
	const allowList = concreteAllowFromEntries(allowFrom);
	return {
		sender: mapAllowFromEntries(allowFrom).some((entry) => entry.trim() === "*") ? candidates[0] ?? "heartbeat" : candidates.find((candidate) => allowList.includes(candidate)) ?? allowList[0] ?? candidates[0] ?? "heartbeat",
		provider,
		allowFrom
	};
}
//#endregion
export { resolveOutboundTarget as a, resolveHeartbeatSenderContext as i, resolveHeartbeatDeliveryTarget as n, heartbeatExecRouteKey as o, resolveHeartbeatDeliveryTargetWithSessionRoute as r, hasResolvableHeartbeatOwnerRoute as t };

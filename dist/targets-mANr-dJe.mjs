import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { i as channelRouteTargetsMatchExact } from "./channel-route-Czo5mOSj.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { a as mergeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { u as isSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { r as listRuntimeVisibleChannelPlugins } from "./runtime-visible-channels-CiwNdke1.mjs";
import { r as stripTargetProviderPrefix, t as resolveTargetPrefixedChannel } from "./channel-target-prefix-BJKXiLk4.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-C4y3OwUU.mjs";
import { i as resolveChannelTarget } from "./target-resolver-BZNj5Sdk.mjs";
import { r as isReservedTargetLiteralError } from "./target-errors-BPI2bPFa.mjs";
import { r as resolveOutboundChannelPlugin, t as normalizeDeliverableOutboundChannel } from "./channel-resolution-CsLQpkZM.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-FM3VqlCl.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { n as hasConfiguredUnavailableCredentialStatus } from "./account-snapshot-fields-DpvG7B4L.mjs";
import { t as isPotentialConfiguredMessageChannel } from "./message-account-selection-DKo1WWcf.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-B-FlMu5i.mjs";
import { t as resolveOutboundTargetWithPlugin } from "./targets-resolve-shared-DC_YXds1.mjs";
//#region src/infra/outbound/targets.ts
/** Resolves a user-supplied outbound destination through the channel plugin. */
function resolveOutboundTarget(params) {
	return resolveOutboundTargetWithPlugin({
		plugin: params.plugin ?? resolveOutboundChannelPlugin({
			channel: params.channel,
			cfg: params.cfg,
			allowBootstrap: params.allowBootstrap
		}),
		target: params,
		onMissingPlugin: () => params.channel === "webchat" ? void 0 : {
			ok: false,
			error: /* @__PURE__ */ new Error(`Unsupported channel: ${params.channel}`)
		}
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
function resolveHeartbeatOwnerRoute(params) {
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
	for (const plugin of listRuntimeVisibleChannelPlugins()) if (isPotentialConfiguredMessageChannel({
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
		const ownerId = concreteAllowFromEntries(plugin.config.resolveAllowFrom?.({
			cfg: params.cfg,
			accountId
		}))[0];
		if (ownerId) return buildRoute(plugin, ownerId);
	}
}
/** Read-only owner-route probe for status/doctor surfaces. Unproven targets fail closed. */
function hasResolvableHeartbeatOwnerRoute(params) {
	const delivery = resolveHeartbeatDeliveryTarget({
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
function resolveHeartbeatDeliveryTarget(params) {
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
	if (target === "none") {
		const base = resolveSessionDeliveryTarget({ entry });
		return buildNoHeartbeatDeliveryTarget({
			reason: "target-none",
			lastChannel: base.lastChannel,
			lastAccountId: base.lastAccountId
		});
	}
	const sessionDelivery = deliveryContextFromSession(entry);
	const ownerMode = target === "owner";
	const ownerTurnSource = ownerMode && hasDeliverableHeartbeatTurnSource(params.turnSource);
	const resolvedTurnSource = target === "last" || ownerTurnSource ? mergeDeliveryContext(params.turnSource, sessionDelivery) : void 0;
	const ownerRoute = ownerMode && !ownerTurnSource ? resolveHeartbeatOwnerRoute({
		cfg,
		entry,
		heartbeat
	}) : void 0;
	if (ownerMode && !ownerTurnSource && !ownerRoute) {
		const base = resolveSessionDeliveryTarget({ entry });
		return buildNoHeartbeatDeliveryTarget({
			reason: "no-route",
			lastChannel: base.lastChannel,
			lastAccountId: base.lastAccountId
		});
	}
	const ownerSession = ownerRoute?.reuseSessionRoute ? sessionDelivery : void 0;
	const resolvedTarget = preparedExplicitPlugin && preparedExplicitTo ? resolveSessionDeliveryTarget({
		entry,
		requestedChannel: target,
		explicitTo: preparedExplicitTo,
		mode: "heartbeat"
	}) : ownerRoute ? resolveSessionDeliveryTarget({
		entry,
		requestedChannel: ownerRoute.plugin.id,
		explicitTo: ownerSession?.to ?? ownerRoute.ownerId,
		explicitThreadId: ownerSession?.threadId,
		mode: "heartbeat"
	}) : resolveSessionDeliveryTarget({
		entry,
		requestedChannel: target === "last" || ownerTurnSource ? "last" : target,
		explicitTo: ownerMode ? void 0 : heartbeat?.to,
		mode: "heartbeat",
		turnSourceChannel: resolvedTurnSource?.channel && isDeliverableMessageChannel(resolvedTurnSource.channel) ? resolvedTurnSource.channel : void 0,
		turnSourceTo: resolvedTurnSource?.to,
		turnSourceAccountId: resolvedTurnSource?.accountId,
		turnSourceThreadId: params.turnSource?.threadId
	});
	const heartbeatAccountId = ownerTurnSource ? void 0 : heartbeat?.accountId?.trim();
	let effectiveAccountId = heartbeatAccountId || resolvedTarget.accountId;
	if (!resolvedTarget.channel || !resolvedTarget.to) return buildNoHeartbeatDeliveryTarget({
		reason: target === "last" || ownerMode ? "no-route" : "no-target",
		accountId: effectiveAccountId,
		lastChannel: resolvedTarget.lastChannel,
		lastAccountId: resolvedTarget.lastAccountId
	});
	const preparedPlugin = preparedExplicitPlugin ?? ownerRoute?.plugin;
	const plugin = resolveOutboundChannelPlugin({
		channel: resolvedTarget.channel,
		cfg,
		agentId: params.agentId,
		allowBootstrap: true
	}) ?? preparedPlugin;
	if (heartbeatAccountId) {
		const listAccountIds = plugin?.config.listAccountIds;
		const accountIds = listAccountIds ? listAccountIds(cfg) : [];
		if (accountIds.length > 0) {
			const normalizedAccountId = normalizeAccountId(heartbeatAccountId);
			if (!new Set(accountIds.map((accountId) => normalizeAccountId(accountId))).has(normalizedAccountId)) return buildNoHeartbeatDeliveryTarget({
				reason: ownerMode ? "no-route" : "unknown-account",
				accountId: normalizedAccountId,
				lastChannel: resolvedTarget.lastChannel,
				lastAccountId: resolvedTarget.lastAccountId
			});
			effectiveAccountId = normalizedAccountId;
		}
	}
	const resolved = resolveOutboundTargetWithPlugin({
		plugin,
		target: {
			channel: resolvedTarget.channel,
			to: resolvedTarget.to,
			allowFrom: ownerRoute ? [ownerRoute.ownerId] : void 0,
			cfg,
			accountId: effectiveAccountId,
			mode: "heartbeat"
		}
	});
	if (!resolved?.ok) return buildNoHeartbeatDeliveryTarget({
		reason: ownerMode ? "no-route" : "no-target",
		accountId: effectiveAccountId,
		lastChannel: resolvedTarget.lastChannel,
		lastAccountId: resolvedTarget.lastAccountId
	});
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
	if (deliveryChatType === "direct" && heartbeat?.directPolicy === "block") return buildNoHeartbeatDeliveryTarget({
		reason: "dm-blocked",
		accountId: effectiveAccountId,
		lastChannel: resolvedTarget.lastChannel,
		lastAccountId: resolvedTarget.lastAccountId
	});
	if (ownerMode && !ownerTurnSource && !isPositivelyDirectHeartbeatOwnerTarget({
		plugin,
		to: resolved.to,
		chatType: deliveryChatType
	})) return buildNoHeartbeatDeliveryTarget({
		reason: "no-route",
		accountId: effectiveAccountId,
		lastChannel: resolvedTarget.lastChannel,
		lastAccountId: resolvedTarget.lastAccountId
	});
	let reason;
	if (plugin?.config.resolveAllowFrom) {
		const explicit = resolveOutboundTargetWithPlugin({
			plugin,
			target: {
				channel: resolvedTarget.channel,
				to: resolvedTarget.to,
				cfg,
				accountId: effectiveAccountId,
				mode: "explicit"
			}
		});
		if (explicit?.ok && explicit.to !== resolved.to) reason = "allowFrom-fallback";
	}
	const inheritedHeartbeatThreadId = shouldReuseHeartbeatRouteThreadId({
		cfg,
		target,
		heartbeat,
		turnSource: params.turnSource,
		entry,
		resolvedTarget,
		plugin
	}) ? resolvedTarget.lastThreadId : void 0;
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
function isPositivelyDirectHeartbeatOwnerTarget(params) {
	const to = params.plugin ? stripTargetProviderPrefix(params.to, params.plugin.id, ...params.plugin.messaging?.targetPrefixes ?? []) : params.to.trim();
	return (normalizeChatType(params.chatType) ?? params.plugin?.messaging?.inferTargetChatType?.({ to })) === "direct";
}
function hasDeliverableHeartbeatTurnSource(turnSource) {
	return Boolean(turnSource?.channel && isDeliverableMessageChannel(turnSource.channel) && turnSource.to?.trim());
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
	const delivery = resolveHeartbeatDeliveryTarget(params);
	const heartbeat = params.heartbeat ?? params.cfg.agents?.defaults?.heartbeat;
	const ownerRouteMustBeDirect = (heartbeat?.target === void 0 || heartbeat.target === "owner") && !hasDeliverableHeartbeatTurnSource(params.turnSource);
	if (delivery.channel === "none" || !delivery.to) return delivery;
	const rejectDelivery = (reason) => buildNoHeartbeatDeliveryTarget({
		reason,
		accountId: delivery.accountId,
		lastChannel: delivery.lastChannel,
		lastAccountId: delivery.lastAccountId
	});
	const deliveryTo = delivery.to;
	const plugin = resolveOutboundChannelPlugin({
		channel: delivery.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	const resolveSessionRoute = plugin?.messaging?.resolveOutboundSessionRoute;
	if (ownerRouteMustBeDirect && !isPositivelyDirectHeartbeatOwnerTarget({
		plugin,
		to: deliveryTo,
		chatType: delivery.chatType
	})) return rejectDelivery("no-route");
	if (!resolveSessionRoute && !plugin?.messaging?.targetResolver) return delivery;
	let routeResolvedTarget;
	const targetResolution = await (async () => {
		try {
			return await resolveChannelTarget({
				cfg: params.cfg,
				channel: delivery.channel,
				input: deliveryTo,
				accountId: delivery.accountId,
				unknownTargetMode: "normalized",
				plugin
			});
		} catch {
			return null;
		}
	})();
	if (targetResolution?.ok) routeResolvedTarget = targetResolution.target;
	else if (targetResolution && isReservedTargetLiteralError(targetResolution.error)) return rejectDelivery(ownerRouteMustBeDirect ? "no-route" : "no-target");
	if (routeResolvedTarget?.kind === "user" && heartbeat?.directPolicy === "block") return rejectDelivery("dm-blocked");
	if (ownerRouteMustBeDirect && !isPositivelyDirectHeartbeatOwnerTarget({
		plugin,
		to: routeResolvedTarget?.to ?? deliveryTo
	})) return rejectDelivery("no-route");
	if (!resolveSessionRoute) return delivery;
	const route = await (async () => {
		try {
			return await resolveOutboundSessionRoute({
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
			});
		} catch {
			return null;
		}
	})();
	if (!route) return delivery;
	if (route.chatType === "direct" && heartbeat?.directPolicy === "block") return rejectDelivery("dm-blocked");
	if (ownerRouteMustBeDirect && !isPositivelyDirectHeartbeatOwnerTarget({
		plugin,
		to: route.to,
		chatType: normalizeChatType(route.chatType)
	})) return rejectDelivery("no-route");
	return {
		...delivery,
		to: route.to,
		chatType: route.chatType,
		threadId: route.threadId ?? delivery.threadId,
		...route.recipientSessionExact === true ? { targetSessionKey: route.sessionKey } : {}
	};
}
function inferChatTypeFromTarget(params) {
	const to = params.to.trim();
	if (!to) return;
	if (/^user:/i.test(to)) return "direct";
	if (/^(channel:|thread:)/i.test(to)) return "channel";
	if (/^group:/i.test(to)) return "group";
	return (params.plugin ?? resolveOutboundChannelPlugin({ channel: params.channel }))?.messaging?.inferTargetChatType?.({ to }) ?? void 0;
}
function shouldReuseHeartbeatRouteThreadId(params) {
	const channel = params.resolvedTarget.channel;
	return (params.plugin ? params.plugin.messaging : channel ? resolveOutboundChannelPlugin({
		channel,
		cfg: params.cfg
	})?.messaging : void 0)?.preserveHeartbeatThreadIdForGroupRoute === true && params.resolvedTarget.threadId == null && params.target === "last" && !params.heartbeat?.to && params.turnSource?.threadId == null && params.resolvedTarget.channel === params.resolvedTarget.lastChannel && Boolean(params.resolvedTarget.to) && Boolean(params.resolvedTarget.lastTo) && params.resolvedTarget.to === params.resolvedTarget.lastTo && normalizeChatType(params.entry?.chatType) === "group";
}
function resolveHeartbeatSenderId(params) {
	const { allowFrom, deliveryTo, lastTo, provider } = params;
	const candidates = [
		deliveryTo?.trim(),
		provider && deliveryTo ? `${provider}:${deliveryTo}` : void 0,
		lastTo?.trim(),
		provider && lastTo ? `${provider}:${lastTo}` : void 0
	].filter((val) => Boolean(val?.trim()));
	const allowList = concreteAllowFromEntries(allowFrom);
	if (mapAllowFromEntries(allowFrom).some((entry) => entry.trim() === "*")) return candidates[0] ?? "heartbeat";
	if (candidates.length > 0 && allowList.length > 0) {
		const matched = candidates.find((candidate) => allowList.includes(candidate));
		if (matched) return matched;
	}
	if (candidates.length > 0 && allowList.length === 0) return candidates[0];
	if (allowList.length > 0) return allowList[0];
	return candidates[0] ?? "heartbeat";
}
/** Resolves the sender id/allow-list context used for heartbeat sends. */
function resolveHeartbeatSenderContext(params) {
	const provider = params.delivery.channel !== "none" ? params.delivery.channel : params.delivery.lastChannel;
	const accountId = params.delivery.accountId ?? (provider === params.delivery.lastChannel ? params.delivery.lastAccountId : void 0);
	const allowFromRaw = provider ? resolveOutboundChannelPlugin({
		channel: provider,
		cfg: params.cfg
	})?.config.resolveAllowFrom?.({
		cfg: params.cfg,
		accountId
	}) ?? [] : [];
	const allowFrom = mapAllowFromEntries(allowFromRaw);
	const sender = resolveHeartbeatSenderId({
		allowFrom,
		deliveryTo: params.delivery.to,
		lastTo: deliveryContextFromSession(params.entry)?.to,
		provider
	});
	return {
		sender: expectDefined(sender, "resolved sender"),
		provider,
		allowFrom
	};
}
//#endregion
export { resolveOutboundTarget as a, resolveHeartbeatSenderContext as i, resolveHeartbeatDeliveryTarget as n, resolveHeartbeatDeliveryTargetWithSessionRoute as r, hasResolvableHeartbeatOwnerRoute as t };

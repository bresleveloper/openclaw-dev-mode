import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CeDA0ojh.mjs";
import { t as normalizeRouteBindingChannelId } from "./binding-scope-BXbuNO3g.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { r as listConfiguredBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { i as resolveChannelTarget } from "./target-resolver-c-W9fpkt.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-CYrCYT-h.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-JZ360Soo.mjs";
import { a as resolveOutboundTarget } from "./targets-CYH5cCbP.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-Y84oqniG.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-Cc-Q1k0G.mjs";
//#region src/infra/outbound/agent-delivery.ts
function resolveAgentDeliveryPlan(params) {
	const requestedRaw = normalizeOptionalString(params.requestedChannel) ?? "";
	const requestedChannel = (requestedRaw ? normalizeMessageChannel(requestedRaw) : void 0) || "last";
	const explicitTo = normalizeOptionalString(params.explicitTo);
	const normalizedTurnSource = params.turnSourceChannel ? normalizeMessageChannel(params.turnSourceChannel) : void 0;
	const turnSourceChannel = normalizedTurnSource && isDeliverableMessageChannel(normalizedTurnSource) ? normalizedTurnSource : void 0;
	const turnSourceTo = normalizeOptionalString(params.turnSourceTo);
	const turnSourceAccountId = normalizeOptionalAccountId(params.turnSourceAccountId);
	const turnSourceThreadId = params.turnSourceThreadId != null && params.turnSourceThreadId !== "" ? params.turnSourceThreadId : void 0;
	const baseDelivery = resolveSessionDeliveryTarget({
		entry: params.sessionEntry,
		requestedChannel: requestedChannel === "webchat" ? "last" : requestedChannel,
		explicitTo,
		explicitThreadId: params.explicitThreadId,
		turnSourceChannel,
		turnSourceTo,
		turnSourceAccountId,
		turnSourceThreadId
	});
	const resolvedChannel = requestedChannel === "webchat" ? INTERNAL_MESSAGE_CHANNEL : requestedChannel !== "last" && isGatewayMessageChannel(requestedChannel) ? requestedChannel : baseDelivery.channel || "webchat";
	const deliveryTargetMode = explicitTo ? "explicit" : isDeliverableMessageChannel(resolvedChannel) ? "implicit" : void 0;
	const resolvedAccountId = normalizeOptionalAccountId(params.accountId) ?? (deliveryTargetMode === "implicit" ? baseDelivery.accountId : void 0);
	let resolvedTo = explicitTo;
	if (!resolvedTo && isDeliverableMessageChannel(resolvedChannel) && resolvedChannel === baseDelivery.lastChannel) resolvedTo = baseDelivery.lastTo;
	return {
		baseDelivery,
		resolvedChannel,
		resolvedTo,
		resolvedAccountId,
		resolvedThreadId: baseDelivery.threadId,
		deliveryTargetMode
	};
}
async function resolveAgentDeliveryPlanWithSessionRoute(params) {
	assertAgentDatabaseAdmitted(params.agentId);
	const plan = resolveAgentDeliveryPlan(params);
	const { resolvedChannel } = plan;
	if (!params.wantsDelivery || !isDeliverableMessageChannel(resolvedChannel)) return plan;
	const plugin = params.preparedPlugin ?? resolveOutboundChannelPlugin({
		channel: resolvedChannel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	if (!plugin) return plan;
	plan.plugin = plugin;
	const hasPluginSessionRoute = Boolean(plugin.messaging?.resolveOutboundSessionRoute);
	const hasPluginTargetResolver = Boolean(plugin.messaging?.targetResolver);
	const hasPluginConcreteTargetResolver = Boolean(plugin.messaging?.targetResolver?.resolveTarget);
	if (!hasPluginSessionRoute && !hasPluginTargetResolver && params.sessionRouteMode !== "allow-fallback") return plan;
	plan.resolvedAccountId ??= params.sessionRouteMode === "allow-fallback" ? resolveChannelDefaultAccountId({
		plugin,
		cfg: params.cfg
	}) : void 0;
	const normalizedTarget = await resolveOutboundTarget({
		channel: resolvedChannel,
		plugin,
		to: plan.resolvedTo,
		cfg: params.cfg,
		accountId: plan.resolvedAccountId,
		mode: plan.deliveryTargetMode ?? "explicit"
	});
	const targetInput = normalizedTarget.ok ? normalizedTarget.to : plan.resolvedTo;
	if (!targetInput) return normalizedTarget.ok ? plan : {
		...plan,
		targetResolutionError: normalizedTarget.error
	};
	const resolvedTarget = await resolveChannelTarget({
		cfg: params.cfg,
		channel: resolvedChannel,
		input: targetInput,
		accountId: plan.resolvedAccountId,
		unknownTargetMode: hasPluginConcreteTargetResolver ? "error" : "normalized",
		plugin
	});
	if (!resolvedTarget.ok) return {
		...plan,
		targetResolutionError: resolvedTarget.error
	};
	if (!normalizedTarget.ok && resolvedTarget.target.resolutionSource === "normalized") return {
		...plan,
		targetResolutionError: normalizedTarget.error
	};
	const sessionRouteTarget = resolvedTarget.target.to;
	const resolvedSessionRouteTarget = !normalizedTarget.ok || normalizedTarget.to !== resolvedTarget.target.to || resolvedTarget.target.resolutionSource === "directory" ? resolvedTarget.target : void 0;
	plan.resolvedTo = sessionRouteTarget;
	if (!hasPluginSessionRoute && params.sessionRouteMode !== "allow-fallback") return plan;
	const explicitThreadId = params.explicitThreadId != null && params.explicitThreadId !== "" ? params.explicitThreadId : void 0;
	const requestedThreadId = plan.deliveryTargetMode === "explicit" ? explicitThreadId : plan.resolvedThreadId;
	const route = await resolveOutboundSessionRoute({
		cfg: params.cfg,
		channel: resolvedChannel,
		plugin,
		agentId: params.agentId,
		accountId: plan.resolvedAccountId,
		target: sessionRouteTarget,
		...resolvedSessionRouteTarget ? { resolvedTarget: resolvedSessionRouteTarget } : {},
		currentSessionKey: params.currentSessionKey,
		threadId: requestedThreadId
	}).catch(() => null);
	const globalDmScope = params.cfg.session?.dmScope ?? "main";
	const knownNonExactRoute = params.sessionRouteMode === "allow-fallback" && (route?.recipientSessionExact === false || route?.recipientSessionExact === "direct-alias");
	const canonicalMainSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.cfg.session?.mainKey
	});
	const usesCanonicalMainSession = route?.recipientSessionExact === "direct-alias" && route.chatType === "direct" && route.sessionKey === route.baseSessionKey && route.sessionKey === canonicalMainSessionKey && globalDmScope === "main" && !listConfiguredBindings(params.cfg).some((binding) => isRouteBinding(binding) && binding.session?.dmScope !== void 0 && binding.session.dmScope !== "main" && normalizeRouteBindingChannelId(binding.match.channel) === resolvedChannel);
	const usesIsolatedDeliveryIdentity = route?.recipientSessionExact === "delivery-identity" && route.baseSessionKey !== canonicalMainSessionKey && route.baseSessionKey.startsWith(`agent:${normalizeAgentId(params.agentId)}:${resolvedChannel}:`) && (route.sessionKey === route.baseSessionKey || route.sessionKey.startsWith(`${route.baseSessionKey}:`));
	const selectedRoute = route && (route.recipientSessionExact === "delivery-identity" ? usesIsolatedDeliveryIdentity : !knownNonExactRoute || usesCanonicalMainSession) ? route : null;
	if (!selectedRoute) return resolvedSessionRouteTarget ? {
		...plan,
		resolvedTo: resolvedSessionRouteTarget.to,
		resolvedThreadId: requestedThreadId
	} : plan;
	return {
		...plan,
		resolvedSessionKey: selectedRoute.sessionKey,
		resolvedTo: hasPluginSessionRoute ? selectedRoute.to : resolvedSessionRouteTarget?.to ?? sessionRouteTarget,
		resolvedThreadId: selectedRoute.threadId ?? requestedThreadId
	};
}
/** Resolves an explicit recipient into its canonical or stable provider-owned session. */
async function resolveAgentExplicitRecipientSession(params) {
	const plan = await resolveAgentDeliveryPlanWithSessionRoute({
		cfg: params.cfg,
		agentId: params.agentId,
		requestedChannel: params.channel,
		explicitTo: params.to,
		explicitThreadId: params.threadId,
		accountId: params.accountId,
		wantsDelivery: true,
		sessionRouteMode: "allow-fallback"
	});
	if (!plan.resolvedSessionKey && !plan.targetResolutionError) return { error: /* @__PURE__ */ new Error(`Unable to resolve a session route for channel "${params.channel}"`) };
	return {
		sessionKey: plan.resolvedSessionKey,
		channel: plan.resolvedChannel,
		to: plan.resolvedTo,
		accountId: plan.resolvedAccountId,
		threadId: plan.resolvedThreadId,
		error: plan.targetResolutionError
	};
}
async function resolveAgentOutboundTarget(params) {
	const targetMode = params.targetMode ?? params.plan.deliveryTargetMode ?? (params.plan.resolvedTo ? "explicit" : "implicit");
	if (params.plan.targetResolutionError) return {
		resolvedTarget: {
			ok: false,
			error: params.plan.targetResolutionError
		},
		resolvedTo: void 0
	};
	if (!isDeliverableMessageChannel(params.plan.resolvedChannel) || params.validateExplicitTarget !== true && params.plan.resolvedTo) return {
		resolvedTarget: null,
		resolvedTo: params.plan.resolvedTo
	};
	const resolvedTarget = await resolveOutboundTarget({
		channel: params.plan.resolvedChannel,
		...params.plan.plugin ? { plugin: params.plan.plugin } : {},
		to: params.plan.resolvedTo,
		cfg: params.cfg,
		accountId: params.plan.resolvedAccountId,
		mode: targetMode
	});
	return {
		resolvedTarget,
		resolvedTo: resolvedTarget.ok ? resolvedTarget.to : params.plan.resolvedTo
	};
}
//#endregion
export { resolveAgentExplicitRecipientSession as n, resolveAgentOutboundTarget as r, resolveAgentDeliveryPlanWithSessionRoute as t };

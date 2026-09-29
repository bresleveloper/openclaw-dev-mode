import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as normalizeRouteBindingChannelId } from "./binding-scope-DY44yLIJ.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-2tAtQt1g.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-BFwcs62N.mjs";
import { r as listConfiguredBindings, t as isRouteBinding } from "./bindings-CI-O7TMQ.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-C4y3OwUU.mjs";
import { i as resolveChannelTarget } from "./target-resolver-BZNj5Sdk.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-CsLQpkZM.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-t_ym8v5h.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-B-FlMu5i.mjs";
import { a as resolveOutboundTarget } from "./targets-mANr-dJe.mjs";
//#region src/infra/outbound/agent-delivery.ts
function resolveAgentDeliveryPlan(params) {
	const requestedRaw = normalizeOptionalString(params.requestedChannel) ?? "";
	const requestedChannel = (requestedRaw ? normalizeMessageChannel(requestedRaw) : void 0) || "last";
	const explicitTo = normalizeOptionalString(params.explicitTo) ?? void 0;
	const normalizedTurnSource = params.turnSourceChannel ? normalizeMessageChannel(params.turnSourceChannel) : void 0;
	const turnSourceChannel = normalizedTurnSource && isDeliverableMessageChannel(normalizedTurnSource) ? normalizedTurnSource : void 0;
	const turnSourceTo = normalizeOptionalString(params.turnSourceTo) ?? void 0;
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
	const resolvedChannel = (() => {
		if (requestedChannel === "webchat") return INTERNAL_MESSAGE_CHANNEL;
		if (requestedChannel === "last") {
			if (baseDelivery.channel && baseDelivery.channel !== "webchat") return baseDelivery.channel;
			return INTERNAL_MESSAGE_CHANNEL;
		}
		if (isGatewayMessageChannel(requestedChannel)) return requestedChannel;
		if (baseDelivery.channel && baseDelivery.channel !== "webchat") return baseDelivery.channel;
		return INTERNAL_MESSAGE_CHANNEL;
	})();
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
	const pluginPlan = {
		...plan,
		plugin
	};
	const hasPluginSessionRoute = Boolean(plugin?.messaging?.resolveOutboundSessionRoute);
	const hasPluginTargetResolver = Boolean(plugin?.messaging?.targetResolver);
	const hasPluginConcreteTargetResolver = Boolean(plugin?.messaging?.targetResolver?.resolveTarget);
	if (!hasPluginSessionRoute && !hasPluginTargetResolver && params.sessionRouteMode !== "allow-fallback") return pluginPlan;
	const resolvedAccountId = pluginPlan.resolvedAccountId ?? (params.sessionRouteMode === "allow-fallback" ? resolveChannelDefaultAccountId({
		plugin,
		cfg: params.cfg
	}) : void 0);
	const routedPlan = resolvedAccountId === pluginPlan.resolvedAccountId ? pluginPlan : {
		...pluginPlan,
		resolvedAccountId
	};
	const normalizedTarget = resolveOutboundTarget({
		channel: resolvedChannel,
		plugin,
		to: routedPlan.resolvedTo,
		cfg: params.cfg,
		accountId: routedPlan.resolvedAccountId,
		mode: routedPlan.deliveryTargetMode ?? "explicit"
	});
	const targetInput = normalizedTarget.ok ? normalizedTarget.to : routedPlan.resolvedTo;
	if (!targetInput) return normalizedTarget.ok ? routedPlan : {
		...routedPlan,
		targetResolutionError: normalizedTarget.error
	};
	const resolvedTarget = await resolveChannelTarget({
		cfg: params.cfg,
		channel: resolvedChannel,
		input: targetInput,
		accountId: routedPlan.resolvedAccountId,
		unknownTargetMode: hasPluginConcreteTargetResolver ? "error" : "normalized",
		plugin
	});
	if (!resolvedTarget.ok) return {
		...routedPlan,
		targetResolutionError: resolvedTarget.error
	};
	if (!normalizedTarget.ok && resolvedTarget.target.resolutionSource === "normalized") return {
		...routedPlan,
		targetResolutionError: normalizedTarget.error
	};
	const sessionRouteTarget = resolvedTarget.target.to;
	const resolvedSessionRouteTarget = !normalizedTarget.ok || normalizedTarget.to !== resolvedTarget.target.to || resolvedTarget.target.resolutionSource === "directory" ? resolvedTarget.target : void 0;
	const resolvedPlan = {
		...routedPlan,
		resolvedTo: sessionRouteTarget
	};
	if (!hasPluginSessionRoute && params.sessionRouteMode !== "allow-fallback") return resolvedPlan;
	const explicitThreadId = params.explicitThreadId != null && params.explicitThreadId !== "" ? params.explicitThreadId : void 0;
	const route = await (async () => {
		try {
			return await resolveOutboundSessionRoute({
				cfg: params.cfg,
				channel: resolvedChannel,
				plugin,
				agentId: params.agentId,
				accountId: routedPlan.resolvedAccountId,
				target: sessionRouteTarget,
				...resolvedSessionRouteTarget ? { resolvedTarget: resolvedSessionRouteTarget } : {},
				currentSessionKey: params.currentSessionKey,
				threadId: routedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId
			});
		} catch {
			return null;
		}
	})();
	const globalDmScope = params.cfg.session?.dmScope ?? "main";
	const knownNonExactRoute = params.sessionRouteMode === "allow-fallback" && (route?.recipientSessionExact === false || route?.recipientSessionExact === "direct-alias");
	const canonicalMainSessionKey = buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.cfg.session?.mainKey
	});
	const usesCanonicalMainSession = route?.recipientSessionExact === "direct-alias" && route.chatType === "direct" && route.sessionKey === route.baseSessionKey && route.sessionKey === canonicalMainSessionKey && globalDmScope === "main" && !listConfiguredBindings(params.cfg).some((binding) => isRouteBinding(binding) && binding.session?.dmScope !== void 0 && binding.session.dmScope !== "main" && normalizeRouteBindingChannelId(binding.match.channel) === resolvedChannel);
	const usesIsolatedDeliveryIdentity = route?.recipientSessionExact === "delivery-identity" && route.baseSessionKey !== canonicalMainSessionKey && route.baseSessionKey.startsWith(`agent:${normalizeAgentId(params.agentId)}:${resolvedChannel}:`) && (route.sessionKey === route.baseSessionKey || route.sessionKey.startsWith(`${route.baseSessionKey}:`));
	const selectedRoute = route && (route.recipientSessionExact === "delivery-identity" ? usesIsolatedDeliveryIdentity : !knownNonExactRoute || usesCanonicalMainSession) ? route : null;
	if (!selectedRoute) {
		if (resolvedSessionRouteTarget) return {
			...resolvedPlan,
			resolvedTo: resolvedSessionRouteTarget.to,
			resolvedThreadId: resolvedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId
		};
		return resolvedPlan;
	}
	return {
		...resolvedPlan,
		resolvedSessionKey: selectedRoute.sessionKey,
		resolvedTo: hasPluginSessionRoute ? selectedRoute.to : resolvedSessionRouteTarget?.to ?? sessionRouteTarget,
		resolvedThreadId: selectedRoute.threadId ?? (resolvedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId)
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
function resolveAgentOutboundTarget(params) {
	const targetMode = params.targetMode ?? params.plan.deliveryTargetMode ?? (params.plan.resolvedTo ? "explicit" : "implicit");
	if (params.plan.targetResolutionError) return {
		resolvedTarget: {
			ok: false,
			error: params.plan.targetResolutionError
		},
		resolvedTo: void 0,
		targetMode
	};
	if (!isDeliverableMessageChannel(params.plan.resolvedChannel)) return {
		resolvedTarget: null,
		resolvedTo: params.plan.resolvedTo,
		targetMode
	};
	if (params.validateExplicitTarget !== true && params.plan.resolvedTo) return {
		resolvedTarget: null,
		resolvedTo: params.plan.resolvedTo,
		targetMode
	};
	const resolvedTarget = resolveOutboundTarget({
		channel: params.plan.resolvedChannel,
		...params.plan.plugin ? { plugin: params.plan.plugin } : {},
		to: params.plan.resolvedTo,
		cfg: params.cfg,
		accountId: params.plan.resolvedAccountId,
		mode: targetMode
	});
	return {
		resolvedTarget,
		resolvedTo: resolvedTarget.ok ? resolvedTarget.to : params.plan.resolvedTo,
		targetMode
	};
}
//#endregion
export { resolveAgentExplicitRecipientSession as n, resolveAgentOutboundTarget as r, resolveAgentDeliveryPlanWithSessionRoute as t };

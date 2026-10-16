import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { t as normalizeRouteBindingChannelId } from "./binding-scope-uGqaW78p.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { n as isGatewayMessageChannel, t as isDeliverableMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { c as getReplyPayloadMetadata } from "./reply-payload-NzglYOOT.mjs";
import { r as listConfiguredBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-DD2TE_lZ.mjs";
import { i as resolveChannelTarget } from "./target-resolver-BSpO1GUs.mjs";
import { i as serializeDurableMessagePayloadOutcomes } from "./send-BOL6c5DR.mjs";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-DMBKJyb_.mjs";
import "./runtime-D_39_b__.mjs";
import { i as resolveChannelDefaultAccountId } from "./helpers-Bm4RKejp.mjs";
import { a as resolveOutboundSessionRoute } from "./outbound-session-BzsWVtaq.mjs";
import { a as resolveOutboundTarget } from "./targets-CO7mQVz4.mjs";
import { t as hasAnyNonEmptyString } from "./delivery-evidence-values-jHsxUGXm.mjs";
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
	const resolvedChannel = (() => {
		if (requestedChannel === "webchat") return INTERNAL_MESSAGE_CHANNEL;
		if (requestedChannel !== "last" && isGatewayMessageChannel(requestedChannel)) return requestedChannel;
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
	const hasPluginSessionRoute = Boolean(plugin.messaging?.resolveOutboundSessionRoute);
	const hasPluginTargetResolver = Boolean(plugin.messaging?.targetResolver);
	const hasPluginConcreteTargetResolver = Boolean(plugin.messaging?.targetResolver?.resolveTarget);
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
	const requestedThreadId = resolvedPlan.deliveryTargetMode === "explicit" ? explicitThreadId : resolvedPlan.resolvedThreadId;
	const route = await resolveOutboundSessionRoute({
		cfg: params.cfg,
		channel: resolvedChannel,
		plugin,
		agentId: params.agentId,
		accountId: routedPlan.resolvedAccountId,
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
	if (!selectedRoute) {
		if (resolvedSessionRouteTarget) return {
			...resolvedPlan,
			resolvedTo: resolvedSessionRouteTarget.to,
			resolvedThreadId: requestedThreadId
		};
		return resolvedPlan;
	}
	return {
		...resolvedPlan,
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
	if (!isDeliverableMessageChannel(params.plan.resolvedChannel) || params.validateExplicitTarget !== true && params.plan.resolvedTo) return {
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
//#region src/agents/command/delivery-result.ts
function hasNonEmptyArray(value) {
	return Array.isArray(value) && value.length > 0;
}
function buildDeliveryResult(params) {
	const successfulCronAdds = params.result.successfulCronAdds;
	const hasSuccessfulCronAdds = typeof successfulCronAdds === "number" && Number.isFinite(successfulCronAdds) && successfulCronAdds > 0;
	return {
		payloads: params.payloads,
		meta: params.meta,
		...params.result.didSendViaMessagingTool === true ? { didSendViaMessagingTool: true } : {},
		...params.result.didDeliverSourceReplyViaMessageTool === true ? { didDeliverSourceReplyViaMessageTool: true } : {},
		...params.result.sourceReplyDelivered ? { sourceReplyDelivered: true } : {},
		...params.result.sourceReplyDeliveryState !== void 0 ? { sourceReplyDeliveryState: params.result.sourceReplyDeliveryState } : {},
		...hasNonEmptyArray(params.result.messagingToolSourceReplyPayloads) ? { messagingToolSourceReplyPayloads: params.result.messagingToolSourceReplyPayloads } : {},
		...hasAnyNonEmptyString(params.result.messagingToolSentTexts) ? { messagingToolSentTexts: params.result.messagingToolSentTexts } : {},
		...hasAnyNonEmptyString(params.result.messagingToolSentMediaUrls) ? { messagingToolSentMediaUrls: params.result.messagingToolSentMediaUrls } : {},
		...hasNonEmptyArray(params.result.messagingToolSentTargets) ? { messagingToolSentTargets: params.result.messagingToolSentTargets } : {},
		...params.result.didSendDeterministicApprovalPrompt === true ? { didSendDeterministicApprovalPrompt: true } : {},
		...hasNonEmptyArray(params.result.acceptedSessionSpawns) ? { acceptedSessionSpawns: params.result.acceptedSessionSpawns } : {},
		...params.result.requesterContinuationSettled === true ? { requesterContinuationSettled: true } : {},
		...hasSuccessfulCronAdds ? { successfulCronAdds } : {},
		...params.deliverySucceeded !== void 0 ? { deliverySucceeded: params.deliverySucceeded } : {},
		...params.deliveryStatus ? { deliveryStatus: params.deliveryStatus } : {}
	};
}
function deliveryStatusFromDurableSend(send) {
	const payloadOutcomes = serializeDurableMessagePayloadOutcomes(send.payloadOutcomes, { includeHookEffect: true });
	const status = {
		requested: true,
		attempted: true,
		status: send.status
	};
	switch (send.status) {
		case "sent": return {
			...status,
			succeeded: true,
			resultCount: send.results.length,
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
		case "suppressed": return {
			...status,
			succeeded: true,
			reason: send.reason,
			resultCount: 0,
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
		case "partial_failed": return {
			...status,
			succeeded: "partial",
			error: true,
			errorMessage: formatErrorMessage(send.error),
			resultCount: send.results.length,
			sentBeforeError: true,
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
		case "failed": return {
			...status,
			succeeded: false,
			error: true,
			errorMessage: formatErrorMessage(send.error),
			...send.stage ? { reason: send.stage } : {},
			...payloadOutcomes ? { payloadOutcomes } : {}
		};
	}
	return send;
}
function preDeliveryFailureStatus(reason) {
	return {
		requested: true,
		attempted: false,
		status: "failed",
		succeeded: false,
		error: true,
		reason
	};
}
function noVisiblePayloadStatus(reason) {
	return {
		requested: true,
		attempted: false,
		status: "suppressed",
		succeeded: true,
		reason: reason === "channel_transform" ? reason : "no_visible_payload",
		resultCount: 0
	};
}
/**
* Payloads the source may receive. A tool-only source gets only host-granted ones
* (diagnostics, media); a host-owned turn may also keep runtime error payloads out of it.
*/
function selectSourceDeliverablePayloads(payloads, opts) {
	const deliverable = opts.internalDeliverySuppressErrors ? payloads.filter((payload) => payload.isError !== true) : payloads;
	return opts.sourceReplyDeliveryMode === "message_tool_only" ? deliverable.filter((payload) => getReplyPayloadMetadata(payload)?.deliverDespiteSourceReplySuppression === true) : deliverable;
}
//#endregion
export { selectSourceDeliverablePayloads as a, resolveAgentOutboundTarget as c, preDeliveryFailureStatus as i, deliveryStatusFromDurableSend as n, resolveAgentDeliveryPlanWithSessionRoute as o, noVisiblePayloadStatus as r, resolveAgentExplicitRecipientSession as s, buildDeliveryResult as t };

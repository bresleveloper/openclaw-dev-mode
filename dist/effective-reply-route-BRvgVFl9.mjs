import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import "./message-channel-constants-Cd7Eq8Zi.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { t as GatewayDrainingError } from "./gateway-work-admission-CHv_0noy.mjs";
import { r as getLoadedChannelPluginForRead } from "./registry-loaded-CYq2sa_C.mjs";
import { t as normalizeChatType } from "./chat-type-Dbv0JQHI.mjs";
import { i as sessionDeliveryRoute, r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { d as isAgentRunSupersededAbortReason, f as isSessionPlacementSettlementClosedError, l as isAgentRunDirectAbortReason, m as resolveAgentRunErrorLifecycleFields, p as resolveAgentRunAbortLifecycleFields, u as isAgentRunRestartAbortReason } from "./run-termination-Cd1iJzC7.mjs";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-BJKXiLk4.mjs";
import { t as CommandLaneClearedError } from "./command-queue-CaY517ob.mjs";
import { r as isFallbackSummaryError } from "./model-fallback-attempt-Dz9Ct0BI.mjs";
//#region src/auto-reply/reply/agent-runner-execution-status.ts
/** Projects closed execution independently of later reply delivery. */
function resolveAgentTurnExecutionStatus(outcome) {
	if (outcome?.kind === "settled") return outcome.status;
	return outcome?.kind === "aborted" ? "cancelled" : "failed";
}
//#endregion
//#region src/auto-reply/reply/reply-operation-abort.ts
function buildRestartLifecycleReplyText() {
	return "⚠️ Gateway is restarting. Please wait a few seconds and try again.";
}
function resolveSignalAbortReason(signal) {
	const stopReason = resolveAgentRunAbortLifecycleFields(signal).stopReason;
	if (stopReason === "restart" || stopReason === "superseded") return stopReason;
	return stopReason && !isSessionPlacementSettlementClosedError(signal?.reason) ? "user" : void 0;
}
function isUserAbortSignal(signal) {
	return resolveSignalAbortReason(signal) === "user";
}
function isReplyOperationUserAbort(replyOperation) {
	return replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_by_user" || isUserAbortSignal(replyOperation?.abortSignal);
}
function isReplyOperationRestartAbort(replyOperation) {
	if (replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_restart") return true;
	const abortSignal = replyOperation?.abortSignal;
	return abortSignal?.aborted === true && isAgentRunRestartAbortReason(abortSignal.reason);
}
function resolveReplyOperationTerminationFields(error, signal, replyOperation) {
	const ownerReason = resolveReplyOperationAbortReason(replyOperation);
	return {
		...resolveAgentRunErrorLifecycleFields(error, signal),
		...ownerReason === "restart" || ownerReason === "superseded" ? {
			aborted: true,
			stopReason: ownerReason
		} : {}
	};
}
function isReplyOperationSuperseded(replyOperation) {
	if (replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_supersession") return true;
	const abortSignal = replyOperation?.abortSignal;
	return abortSignal?.aborted === true && isAgentRunSupersededAbortReason(abortSignal.reason);
}
function resolveReplyOperationAbortReason(replyOperation, error, signal = replyOperation?.abortSignal) {
	return isReplyOperationRestartAbort(replyOperation) ? "restart" : isReplyOperationSuperseded(replyOperation) ? "superseded" : resolveSignalAbortReason(signal) ?? (isAgentRunRestartAbortReason(error) ? "restart" : isAgentRunSupersededAbortReason(error) ? "superseded" : isAgentRunDirectAbortReason(error) || isReplyOperationUserAbort(replyOperation) ? "user" : void 0);
}
function resolveRestartLifecycleError(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of pending) {
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		if (candidate instanceof GatewayDrainingError || candidate instanceof CommandLaneClearedError) return candidate;
		if (isFallbackSummaryError(candidate)) pending.push(...candidate.attempts.map((attempt) => attempt.error));
		if (candidate instanceof Error && "cause" in candidate) pending.push(candidate.cause);
	}
}
//#endregion
//#region src/auto-reply/reply/reply-operation-run-state.ts
const REPLY_OPERATION_RUN_STATE = Symbol("openclaw.replyOperationRunState");
function resolveReplyOperationRunState(options) {
	return options?.[REPLY_OPERATION_RUN_STATE];
}
function recordReplyOperationAgentTurn(states, owner, outcome) {
	for (const state of states ?? []) {
		state.agentTurn = resolveAgentTurnExecutionStatus(outcome ?? (owner?.result?.kind === "aborted" ? owner.result : void 0));
		if (outcome?.kind === "settled") {
			state.messagingToolSentTargets = outcome.result.messagingToolSentTargets?.slice();
			state.backgroundWorkStarted = Boolean(outcome.result.asyncWorkStarted || outcome.result.acceptedSessionSpawns?.length);
		} else if (!owner || state.agentTurnOwner !== owner) {
			state.messagingToolSentTargets = void 0;
			state.backgroundWorkStarted = false;
		}
		state.agentTurnOwner = owner;
	}
}
function recordReplyPreRunRejection(state, rejection) {
	if (state && rejection) state.preRunRejection ??= rejection;
}
function resolveReplyOperationAgentTurn(state) {
	return isReplyOperationSuperseded(state?.agentTurnOwner) ? "superseded" : state?.agentTurn;
}
//#endregion
//#region src/auto-reply/reply/effective-reply-route.ts
/** Resolves the effective reply route from current context and persisted session route. */
/** Normalizes an external target without collapsing provider-owned topic suffixes. */
function normalizeEffectiveReplyTarget(raw, channel, threadId) {
	let target = normalizeOptionalString(raw);
	if (target && channel && threadId != null) target = getLoadedChannelPluginForRead(channel)?.threading?.resolveCurrentChannelId?.({
		to: target,
		threadId
	}) ?? target;
	return target ? normalizeOptionalString(stripOutboundTargetKindPrefix(stripTargetProviderPrefix(target, channel ?? ""))) : void 0;
}
function isSessionsSendInterSessionHandoff(inputProvenance) {
	return inputProvenance?.kind === "inter_session" && inputProvenance.sourceTool?.toLowerCase() === "sessions_send";
}
function resolveTrustedInheritedThreadId(entry) {
	const deliveryThreadId = deliveryContextFromSession(entry)?.threadId;
	if (deliveryThreadId == null) return;
	const routeThread = sessionDeliveryRoute(entry)?.thread;
	if (routeThread?.id != null && (routeThread.source === "explicit" || routeThread.source === "target" || routeThread.source === "turn") && stringifyRouteThreadId(routeThread.id) === stringifyRouteThreadId(deliveryThreadId)) return deliveryThreadId;
}
/** Resolves current, inherited, or persisted reply route for a session turn. */
function resolveEffectiveReplyRoute(params) {
	const currentSurface = normalizeMessageChannel(params.ctx.Provider) ?? normalizeMessageChannel(params.ctx.Surface) ?? normalizeMessageChannel(params.ctx.OriginatingChannel);
	const persistedDeliveryContext = deliveryContextFromSession(params.entry);
	const persistedRoute = sessionDeliveryRoute(params.entry);
	const persistedOrigin = sessionDeliveryOrigin(params.entry);
	const persistedDeliveryChannel = normalizeMessageChannel(persistedDeliveryContext?.channel);
	const liveChatType = normalizeChatType(params.ctx.ChatType);
	const persistedChatType = persistedRoute?.target?.chatType ?? params.entry?.chatType ?? normalizeChatType(persistedOrigin?.chatType);
	if (isSessionsSendInterSessionHandoff(params.ctx.InputProvenance) && currentSurface === "webchat" && persistedDeliveryChannel && persistedDeliveryChannel !== "webchat" && persistedDeliveryContext?.to) {
		const inheritedThreadId = resolveTrustedInheritedThreadId(params.entry);
		return {
			channel: persistedDeliveryChannel,
			to: persistedDeliveryContext.to,
			accountId: persistedDeliveryContext.accountId,
			...inheritedThreadId !== void 0 ? { threadId: inheritedThreadId } : {},
			...persistedChatType ? { chatType: persistedChatType } : {},
			inheritedExternalRoute: true
		};
	}
	if (params.ctx.InternalTurnSource === void 0) return {
		channel: params.ctx.OriginatingChannel,
		to: params.ctx.OriginatingTo,
		accountId: params.ctx.AccountId,
		...params.ctx.MessageThreadId !== void 0 ? { threadId: params.ctx.MessageThreadId } : {},
		...liveChatType ? { chatType: liveChatType } : {}
	};
	const persistedChannel = persistedDeliveryContext?.channel;
	const liveChannel = params.ctx.OriginatingChannel;
	const canInheritPersistedTuple = !liveChannel || normalizeMessageChannel(liveChannel) === normalizeMessageChannel(persistedChannel);
	const chatType = liveChatType ?? (canInheritPersistedTuple ? persistedChatType : void 0);
	return {
		channel: liveChannel ?? persistedChannel,
		to: params.ctx.OriginatingTo ?? (canInheritPersistedTuple ? persistedDeliveryContext?.to : void 0),
		accountId: params.ctx.AccountId ?? (canInheritPersistedTuple ? persistedDeliveryContext?.accountId : void 0),
		...params.ctx.MessageThreadId !== void 0 ? { threadId: params.ctx.MessageThreadId } : {},
		...chatType ? { chatType } : {}
	};
}
//#endregion
export { recordReplyPreRunRejection as a, buildRestartLifecycleReplyText as c, resolveReplyOperationTerminationFields as d, resolveRestartLifecycleError as f, recordReplyOperationAgentTurn as i, isReplyOperationSuperseded as l, resolveEffectiveReplyRoute as n, resolveReplyOperationAgentTurn as o, resolveAgentTurnExecutionStatus as p, REPLY_OPERATION_RUN_STATE as r, resolveReplyOperationRunState as s, normalizeEffectiveReplyTarget as t, resolveReplyOperationAbortReason as u };

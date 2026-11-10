import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { n as resolveSessionConversationRef } from "./session-conversation-DnUQmZJM.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-Cc-Q1k0G.mjs";
import { f as resolveApprovalRequestSessionDeliveryAsync, h as normalizeApprovalRequest, i as doesApprovalRequestMatchChannelAccountFromDelivery, p as resolveLegacyApprovalRequestSessionDelivery } from "./approval-request-account-binding-CVzeB0WI.mjs";
//#region src/infra/exec-approval-session-target.ts
function normalizeExecApprovalThreadValue(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	return normalizeOptionalString(value);
}
function toExecLikeApprovalRequest(request) {
	const normalizedRequest = normalizeApprovalRequest(request);
	if (normalizedRequest.approvalKind === "exec") return normalizedRequest;
	return {
		approvalKind: "exec",
		id: normalizedRequest.id,
		request: {
			command: normalizedRequest.request.title,
			sessionKey: normalizedRequest.request.sessionKey ?? void 0,
			turnSourceChannel: normalizedRequest.request.turnSourceChannel ?? void 0,
			turnSourceTo: normalizedRequest.request.turnSourceTo ?? void 0,
			turnSourceAccountId: normalizedRequest.request.turnSourceAccountId ?? void 0,
			turnSourceThreadId: normalizedRequest.request.turnSourceThreadId ?? void 0
		},
		createdAtMs: normalizedRequest.createdAtMs,
		expiresAtMs: normalizedRequest.expiresAtMs
	};
}
/** Resolves the conversation encoded in an approval request session key for an optional channel. */
function resolveApprovalRequestSessionConversation(params) {
	const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
	if (!sessionKey) return null;
	const resolved = resolveSessionConversationRef(sessionKey, { bundledFallback: params.bundledFallback });
	if (!resolved) return null;
	const expectedChannel = normalizeMessageChannel(params.channel);
	if (expectedChannel && normalizeMessageChannel(resolved.channel) !== expectedChannel) return null;
	return resolved;
}
/** Resolves the best known message target for an exec approval request. */
function resolveExecApprovalSessionTargetFromDelivery(params, entry) {
	if (!entry) return null;
	const target = resolveSessionDeliveryTarget({
		entry,
		requestedChannel: "last",
		turnSourceChannel: normalizeOptionalString(params.turnSourceChannel),
		turnSourceTo: normalizeOptionalString(params.turnSourceTo),
		turnSourceAccountId: normalizeOptionalString(params.turnSourceAccountId),
		turnSourceThreadId: normalizeExecApprovalThreadValue(params.turnSourceThreadId)
	});
	if (!target.to) return null;
	return {
		channel: normalizeOptionalString(target.channel),
		to: target.to,
		accountId: normalizeOptionalString(target.accountId),
		threadId: normalizeExecApprovalThreadValue(target.threadId)
	};
}
/** Resolves the best known message target for either exec or plugin approval requests. */
function resolveApprovalRequestSessionTargetFromDelivery(params, sessionDelivery) {
	const execLikeRequest = toExecLikeApprovalRequest(params.request);
	return resolveExecApprovalSessionTargetFromDelivery({
		cfg: params.cfg,
		request: execLikeRequest,
		turnSourceChannel: execLikeRequest.request.turnSourceChannel ?? void 0,
		turnSourceTo: execLikeRequest.request.turnSourceTo ?? void 0,
		turnSourceAccountId: execLikeRequest.request.turnSourceAccountId ?? void 0,
		turnSourceThreadId: execLikeRequest.request.turnSourceThreadId ?? void 0
	}, sessionDelivery);
}
function resolveApprovalRequestStoredSessionTarget(params, sessionDelivery) {
	const execLikeRequest = toExecLikeApprovalRequest(params.request);
	return resolveExecApprovalSessionTargetFromDelivery({
		cfg: params.cfg,
		request: execLikeRequest
	}, sessionDelivery);
}
/** Resolves a channel-specific origin target only when live and stored bindings are consistent. */
function resolveApprovalRequestOriginTargetFromDelivery(params, sessionDelivery) {
	if (!doesApprovalRequestMatchChannelAccountFromDelivery({
		cfg: params.cfg,
		request: params.request,
		channel: params.channel,
		accountId: params.accountId
	}, sessionDelivery)) return null;
	const turnSourceTarget = params.resolveTurnSourceTarget(params.request);
	const expectedChannel = normalizeMessageChannel(params.channel);
	const sessionTargetBinding = resolveApprovalRequestStoredSessionTarget({
		cfg: params.cfg,
		request: params.request
	}, sessionDelivery);
	const sessionTarget = sessionTargetBinding && normalizeMessageChannel(sessionTargetBinding.channel) === expectedChannel ? params.resolveSessionTarget(sessionTargetBinding) : null;
	if (turnSourceTarget && sessionTarget && !params.targetsMatch(turnSourceTarget, sessionTarget)) return null;
	return turnSourceTarget ?? sessionTarget ?? params.resolveFallbackTarget?.(params.request) ?? null;
}
function warnLegacyTarget(name) {
	warnPluginSdkDeprecation({
		family: "approval-session-routing",
		method: name,
		replacement: `${name}Async`
	});
}
/** @deprecated Use resolveExecApprovalSessionTargetAsync; final compatibility day: 2026-12-31. */
function resolveExecApprovalSessionTarget(params) {
	warnLegacyTarget("resolveExecApprovalSessionTarget");
	return resolveExecApprovalSessionTargetFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function resolveExecApprovalSessionTargetAsync(params) {
	return resolveExecApprovalSessionTargetFromDelivery(params, await resolveApprovalRequestSessionDeliveryAsync(params));
}
/** @deprecated Use resolveApprovalRequestSessionTargetAsync; final compatibility day: 2026-12-31. */
function resolveApprovalRequestSessionTarget(params) {
	warnLegacyTarget("resolveApprovalRequestSessionTarget");
	return resolveApprovalRequestSessionTargetFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function resolveApprovalRequestSessionTargetAsync(params) {
	return resolveApprovalRequestSessionTargetFromDelivery(params, await resolveApprovalRequestSessionDeliveryAsync(params));
}
/** @deprecated Use resolveApprovalRequestOriginTargetAsync; final compatibility day: 2026-12-31. */
function resolveApprovalRequestOriginTarget(params) {
	warnLegacyTarget("resolveApprovalRequestOriginTarget");
	return resolveApprovalRequestOriginTargetFromDelivery(params, resolveLegacyApprovalRequestSessionDelivery(params));
}
async function resolveApprovalRequestOriginTargetAsync(params) {
	return resolveApprovalRequestOriginTargetFromDelivery(params, await resolveApprovalRequestSessionDeliveryAsync(params));
}
//#endregion
export { resolveApprovalRequestSessionTargetAsync as a, resolveApprovalRequestSessionTarget as i, resolveApprovalRequestOriginTargetAsync as n, resolveExecApprovalSessionTarget as o, resolveApprovalRequestSessionConversation as r, resolveExecApprovalSessionTargetAsync as s, resolveApprovalRequestOriginTarget as t };

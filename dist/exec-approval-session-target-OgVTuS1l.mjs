import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-DDcHHhpX.mjs";
import { n as resolveSessionConversationRef } from "./session-conversation-Bpasei-d.mjs";
import { t as resolveSessionDeliveryTarget } from "./targets-session-C4y3OwUU.mjs";
import "./targets-mANr-dJe.mjs";
import { n as doesApprovalRequestMatchChannelAccount, o as resolvePersistedApprovalRequestSessionEntry, s as normalizeApprovalRequest } from "./approval-request-account-binding-CJyRIlPn.mjs";
//#region src/infra/exec-approval-session-target.ts
function normalizeExecApprovalThreadValue(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	if (typeof value !== "string") return;
	const normalized = value.trim();
	return normalized ? normalized : void 0;
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
function normalizeOptionalChannel(value) {
	return normalizeMessageChannel(value);
}
/** Resolves the conversation encoded in an approval request session key for an optional channel. */
function resolveApprovalRequestSessionConversation(params) {
	const sessionKey = normalizeOptionalString(params.request.request.sessionKey);
	if (!sessionKey) return null;
	const resolved = resolveSessionConversationRef(sessionKey, { bundledFallback: params.bundledFallback });
	if (!resolved) return null;
	const expectedChannel = normalizeOptionalChannel(params.channel);
	if (expectedChannel && normalizeOptionalChannel(resolved.channel) !== expectedChannel) return null;
	return {
		channel: resolved.channel,
		kind: resolved.kind,
		id: resolved.id,
		rawId: resolved.rawId,
		threadId: resolved.threadId,
		baseSessionKey: resolved.baseSessionKey,
		baseConversationId: resolved.baseConversationId,
		parentConversationCandidates: resolved.parentConversationCandidates
	};
}
/** Resolves the best known message target for an exec approval request. */
function resolveExecApprovalSessionTarget(params) {
	if (!normalizeOptionalString(params.request.request.sessionKey)) return null;
	const persisted = resolvePersistedApprovalRequestSessionEntry({
		cfg: params.cfg,
		request: params.request
	});
	if (!persisted) return null;
	const target = resolveSessionDeliveryTarget({
		entry: persisted.entry,
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
function resolveApprovalRequestSessionTarget(params) {
	const execLikeRequest = toExecLikeApprovalRequest(params.request);
	return resolveExecApprovalSessionTarget({
		cfg: params.cfg,
		request: execLikeRequest,
		turnSourceChannel: execLikeRequest.request.turnSourceChannel ?? void 0,
		turnSourceTo: execLikeRequest.request.turnSourceTo ?? void 0,
		turnSourceAccountId: execLikeRequest.request.turnSourceAccountId ?? void 0,
		turnSourceThreadId: execLikeRequest.request.turnSourceThreadId ?? void 0
	});
}
function resolveApprovalRequestStoredSessionTarget(params) {
	const execLikeRequest = toExecLikeApprovalRequest(params.request);
	return resolveExecApprovalSessionTarget({
		cfg: params.cfg,
		request: execLikeRequest
	});
}
/** Resolves a channel-specific origin target only when live and stored bindings are consistent. */
function resolveApprovalRequestOriginTarget(params) {
	if (!doesApprovalRequestMatchChannelAccount({
		cfg: params.cfg,
		request: params.request,
		channel: params.channel,
		accountId: params.accountId
	})) return null;
	const turnSourceTarget = params.resolveTurnSourceTarget(params.request);
	const expectedChannel = normalizeOptionalChannel(params.channel);
	const sessionTargetBinding = resolveApprovalRequestStoredSessionTarget({
		cfg: params.cfg,
		request: params.request
	});
	const sessionTarget = sessionTargetBinding && normalizeOptionalChannel(sessionTargetBinding.channel) === expectedChannel ? params.resolveSessionTarget(sessionTargetBinding) : null;
	if (turnSourceTarget && sessionTarget && !params.targetsMatch(turnSourceTarget, sessionTarget)) return null;
	return turnSourceTarget ?? sessionTarget ?? params.resolveFallbackTarget?.(params.request) ?? null;
}
//#endregion
export { resolveExecApprovalSessionTarget as i, resolveApprovalRequestSessionConversation as n, resolveApprovalRequestSessionTarget as r, resolveApprovalRequestOriginTarget as t };

import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { i as channelRouteTargetsMatchExact } from "./channel-route-BIxMkFzo.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-RxKxwld1.mjs";
import { m as getExecApprovalReplyMetadata } from "./exec-approval-reply-Df1HgEq-.mjs";
import { l as resolveApprovalRequestKind, r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-I7l4AwjN.mjs";
import { r as resolveApprovalRequestSessionTarget, t as resolveApprovalRequestOriginTarget } from "./exec-approval-session-target-Cf7TudQK.mjs";
//#region src/plugin-sdk/approval-native-helpers.ts
/**
* Create the standard target adapters for messaging channels whose native
* approval destination is a normalized `to` value.
*/
function createNativeApprovalMessagingTargetResolvers(params) {
	const normalizeTo = (to) => params.normalizeTo(to) || null;
	const normalizeTarget = (target) => {
		const to = normalizeTo(target.to);
		return to ? {
			...target,
			to
		} : null;
	};
	return {
		normalizeForwardTarget: (target) => {
			if (normalizeLowercaseStringOrEmpty(target.channel) !== params.channel) return null;
			const to = normalizeTo(target.to);
			return to ? {
				to,
				accountId: normalizeOptionalString(target.accountId),
				threadId: target.threadId ?? null
			} : null;
		},
		resolveTurnSourceTarget: (request) => {
			if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== params.channel) return null;
			const to = normalizeTo(request.request.turnSourceTo ?? "");
			return to ? {
				to,
				accountId: normalizeOptionalString(request.request.turnSourceAccountId)
			} : null;
		},
		resolveSessionTarget: (sessionTarget) => {
			const to = normalizeTo(sessionTarget.to);
			return to ? {
				to,
				accountId: normalizeOptionalString(sessionTarget.accountId)
			} : null;
		},
		normalizeTarget
	};
}
/** Compare channel-native approval targets with the same normalization used by outbound routes. */
function nativeApprovalTargetsMatch(params) {
	return channelRouteTargetsMatchExact({
		left: {
			channel: params.channel,
			to: params.left.to,
			accountId: params.left.accountId,
			threadId: params.left.threadId
		},
		right: {
			channel: params.channel,
			to: params.right.to,
			accountId: params.right.accountId,
			threadId: params.right.threadId
		}
	});
}
/** Decide whether a channel-native exec approval route replaces the local text prompt. */
function shouldSuppressLocalNativeExecApprovalPrompt(params) {
	if (params.hint?.kind !== "approval-pending" || params.hint.approvalKind !== "exec") return false;
	if (params.hint.nativeRouteActive !== true) return false;
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (!metadata || metadata.approvalKind !== "exec") return false;
	if (!(params.isNativeDeliveryEnabled ?? params.isTransportEnabled)?.({
		cfg: params.cfg,
		accountId: params.accountId
	})) return false;
	const config = params.resolveApprovalConfig?.({
		cfg: params.cfg,
		accountId: params.accountId,
		metadata
	}) ?? params.cfg.approvals?.exec;
	if ((params.requireApprovalConfigEnabled ?? params.resolveApprovalConfig === void 0) && !config?.enabled) return false;
	if (params.enforceForwardingMode ?? params.resolveApprovalConfig === void 0) {
		const mode = config?.mode ?? "session";
		if (mode !== "session" && mode !== "both" && !params.hasExactTargetProof) return false;
	}
	if (params.isSessionRouteEligible && !params.isSessionRouteEligible({
		cfg: params.cfg,
		accountId: params.accountId,
		metadata
	})) return false;
	return matchesApprovalRequestFilters({
		request: {
			agentId: metadata.agentId,
			sessionKey: metadata.sessionKey
		},
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter,
		fallbackAgentIdFromSessionKey: params.fallbackAgentIdFromSessionKey ?? true
	});
}
function isNativeApprovalTarget(value) {
	return Boolean(value && typeof value === "object" && typeof value.to === "string");
}
function nativeApprovalTargetMatcher(channel) {
	return (left, right) => isNativeApprovalTarget(left) && isNativeApprovalTarget(right) && nativeApprovalTargetsMatch({
		channel,
		left,
		right
	});
}
/** Infer approval family from the request shape unless the caller already knows it. */
function resolveApprovalKind(request, approvalKind) {
	if (approvalKind) return approvalKind;
	return resolveApprovalRequestKind(request);
}
function matchesForwardingFilters(params) {
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: params.config.agentFilter,
		sessionFilter: params.config.sessionFilter,
		fallbackAgentIdFromSessionKey: true
	});
}
/** Create the standard route gates for native channel approval forwarding. */
function createNativeApprovalChannelRouteGates(params) {
	const resolveActiveForwarding = (input) => {
		if (!params.isTransportEnabled(input)) return null;
		const config = input.approvalKind === "plugin" ? input.cfg.approvals?.plugin : input.cfg.approvals?.exec;
		return config?.enabled ? {
			config,
			mode: config.mode ?? params.defaultForwardingMode
		} : null;
	};
	const targetsMatch = params.targetsMatch ?? ((left, right) => nativeApprovalTargetsMatch({
		channel: params.channel,
		left,
		right
	}));
	const targetAccountMatchesChannelAccount = (input) => {
		const targetAccountId = normalizeOptionalString(input.targetAccountId);
		const accountId = normalizeOptionalString(input.accountId);
		if (targetAccountId) return !accountId || normalizeAccountId(targetAccountId) === normalizeAccountId(accountId);
		if (!accountId) return true;
		return normalizeAccountId(accountId) === normalizeAccountId(params.resolveDefaultAccountId(input.cfg));
	};
	const hasMatchingChannelTarget = (input) => {
		const candidateTarget = input.target ? params.normalizeForwardTarget(input.target) : null;
		return (input.config.targets ?? []).some((target) => {
			const configuredTarget = params.normalizeForwardTarget(target);
			if (!configuredTarget) return false;
			if (!targetAccountMatchesChannelAccount({
				cfg: input.cfg,
				targetAccountId: configuredTarget.accountId,
				accountId: input.accountId
			})) return false;
			if (!candidateTarget) return true;
			return targetsMatch(configuredTarget, candidateTarget);
		});
	};
	const hasChannelOriginOrSessionTarget = (input) => {
		if (params.resolveTurnSourceTarget(input.request)) return true;
		const sessionTarget = resolveApprovalRequestSessionTarget({
			cfg: input.cfg,
			request: input.request
		});
		return normalizeLowercaseStringOrEmpty(sessionTarget?.channel) === params.channel && targetAccountMatchesChannelAccount({
			cfg: input.cfg,
			targetAccountId: sessionTarget?.accountId,
			accountId: input.accountId
		});
	};
	const canApprovalPotentiallyRouteToChannel = (input) => {
		const forwarding = resolveActiveForwarding(input);
		if (!forwarding) return false;
		if (forwarding.mode === "session" || forwarding.mode === "both") return true;
		return !input.nativeSessionOnly && forwarding.mode === "targets" && hasMatchingChannelTarget({
			cfg: input.cfg,
			config: forwarding.config,
			accountId: input.accountId
		});
	};
	const canAnyApprovalPotentiallyRouteToChannel = (input) => [
		"exec",
		"plugin",
		"system-agent"
	].some((approvalKind) => canApprovalPotentiallyRouteToChannel({
		...input,
		approvalKind
	}));
	const isSessionApprovalEligible = (input) => {
		const accountId = input.accountId ?? params.resolveDefaultAccountId(input.cfg);
		const eligibleAccountIds = params.isTransportEnabled({
			cfg: input.cfg,
			accountId
		}) ? [accountId] : [];
		if (!doesApprovalRequestSelectChannelAccount({
			cfg: input.cfg,
			request: input.request,
			channel: params.channel,
			accountId: input.accountId,
			defaultAccountId: params.resolveDefaultAccountId(input.cfg),
			eligibleAccountIds
		})) return false;
		const forwarding = resolveActiveForwarding(input);
		return forwarding !== null && (forwarding.mode === "session" || forwarding.mode === "both") && matchesForwardingFilters({
			config: forwarding.config,
			request: input.request
		}) && hasChannelOriginOrSessionTarget({
			cfg: input.cfg,
			accountId: input.accountId,
			request: input.request
		});
	};
	const isExplicitTargetEligible = (input) => {
		const forwarding = resolveActiveForwarding(input);
		return forwarding !== null && (forwarding.mode === "targets" || forwarding.mode === "both") && matchesForwardingFilters({
			config: forwarding.config,
			request: input.request
		}) && hasMatchingChannelTarget({
			cfg: input.cfg,
			config: forwarding.config,
			accountId: input.accountId,
			target: input.target
		});
	};
	const shouldHandleApprovalRequest = (input) => isSessionApprovalEligible({
		...input,
		approvalKind: resolveApprovalKind(input.request, input.approvalKind)
	});
	return {
		canApprovalPotentiallyRouteToChannel,
		canAnyApprovalPotentiallyRouteToChannel,
		isNativeApprovalHandlerConfigured: (input) => canAnyApprovalPotentiallyRouteToChannel({
			...input,
			nativeSessionOnly: true
		}),
		isSessionApprovalEligible,
		isExplicitTargetEligible,
		shouldHandleApprovalRequest
	};
}
/** Create a fallback suppressor that avoids duplicate approval prompts after native delivery. */
function createNativeApprovalForwardingFallbackSuppressor(params) {
	const targetsMatch = params.targetsMatch ?? ((left, right) => nativeApprovalTargetsMatch({
		channel: params.channel,
		left,
		right
	}));
	return (input) => {
		const forwardingTarget = params.normalizeForwardTarget(input.target);
		if (!forwardingTarget) return false;
		const accountId = normalizeOptionalString(params.resolveAccountId?.({
			forwardingTarget,
			target: input.target,
			request: input.request
		})) ?? normalizeOptionalString(forwardingTarget.accountId) ?? normalizeOptionalString(input.request.request.turnSourceAccountId);
		const approvalKind = params.resolveApprovalKind?.({
			approvalKind: input.approvalKind,
			request: input.request
		}) ?? resolveApprovalKind(input.request, input.approvalKind);
		const requestParams = {
			cfg: input.cfg,
			accountId,
			approvalKind,
			request: input.request
		};
		if (!(input.target.source === "target" ? params.isExplicitTargetEligible?.({
			...requestParams,
			target: input.target
		}) ?? false : params.isSessionRouteEligible({ ...requestParams }))) return false;
		const forwardingTargetForMatch = params.resolveForwardingTargetForMatch?.({
			forwardingTarget,
			accountId,
			target: input.target,
			approvalKind,
			request: input.request
		}) ?? forwardingTarget;
		const originTarget = params.resolveOriginTarget({ ...requestParams });
		if (originTarget && targetsMatch(forwardingTargetForMatch, originTarget)) return true;
		return params.resolveApproverDmTargets({ ...requestParams }).some((approverTarget) => targetsMatch(forwardingTargetForMatch, approverTarget));
	};
}
function createOriginTargetResolver(params) {
	return (input) => {
		if (params.shouldHandleRequest && !params.shouldHandleRequest(input)) return null;
		const normalizeTarget = (target) => {
			if (!target) return null;
			return params.normalizeTarget ? params.normalizeTarget(target, input.request) ?? null : target;
		};
		const normalizeTargetForMatch = (target) => params.normalizeTargetForMatch?.(target, input.request) ?? target;
		return resolveApprovalRequestOriginTarget({
			cfg: input.cfg,
			request: input.request,
			channel: params.channel,
			accountId: input.accountId,
			resolveTurnSourceTarget: (request) => normalizeTarget(params.resolveTurnSourceTarget(request)),
			resolveSessionTarget: (sessionTarget) => normalizeTarget(params.resolveSessionTarget(sessionTarget, input.request)),
			targetsMatch: (left, right) => {
				const normalizedLeft = normalizeTargetForMatch(left);
				const normalizedRight = normalizeTargetForMatch(right);
				return Boolean(normalizedLeft && normalizedRight && params.targetsMatch(normalizedLeft, normalizedRight));
			},
			resolveFallbackTarget: params.resolveFallbackTarget ? (request) => normalizeTarget(params.resolveFallbackTarget?.(request) ?? null) : void 0
		});
	};
}
function hasCustomTargetsMatch(params) {
	return typeof params.targetsMatch === "function";
}
function createChannelNativeOriginTargetResolver(params) {
	if (hasCustomTargetsMatch(params)) return createOriginTargetResolver(params);
	return createOriginTargetResolver({
		...params,
		targetsMatch: nativeApprovalTargetMatcher(params.channel)
	});
}
/** Create a resolver for configured approver DM targets. */
function createChannelApproverDmTargetResolver(params) {
	return (input) => {
		if (params.shouldHandleRequest && !params.shouldHandleRequest(input)) return [];
		const targets = [];
		for (const approver of params.resolveApprovers({
			cfg: input.cfg,
			accountId: input.accountId
		})) {
			const target = params.mapApprover(approver, input);
			if (target) targets.push(target);
		}
		return targets;
	};
}
//#endregion
export { createNativeApprovalMessagingTargetResolvers as a, shouldSuppressLocalNativeExecApprovalPrompt as c, createNativeApprovalForwardingFallbackSuppressor as i, createChannelNativeOriginTargetResolver as n, nativeApprovalTargetsMatch as o, createNativeApprovalChannelRouteGates as r, resolveApprovalKind as s, createChannelApproverDmTargetResolver as t };

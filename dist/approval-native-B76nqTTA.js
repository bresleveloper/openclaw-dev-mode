import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as createApproverRestrictedNativeApprovalCapability } from "./approval-delivery-helpers-Ddw9uAMj.js";
import "./approval-delivery-runtime-BC8bGkG0.js";
import { n as createLazyChannelApprovalNativeRuntimeAdapter } from "./approval-handler-adapter-runtime-DLWtIqHq.js";
import { c as shouldSuppressLocalNativeExecApprovalPrompt, i as createNativeApprovalChannelRouteGates, n as createChannelApproverDmTargetResolver, r as createChannelNativeOriginTargetResolver } from "./approval-native-helpers-BQP5fMRA.js";
import "./approval-native-runtime-KhBiC_33.js";
import { i as resolveGoogleChatAccount, n as listGoogleChatAccountIds, r as resolveDefaultGoogleChatAccountId } from "./accounts-DwCzvEYh.js";
import { r as normalizeGoogleChatTarget, t as isGoogleChatSpaceTarget } from "./targets-Ck49h45L.js";
import { n as googleChatApprovalAuth, r as normalizeGoogleChatApproverId, t as getGoogleChatApprovalApprovers } from "./approval-auth-CCu7LmP5.js";
//#region extensions/googlechat/src/approval-native.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
function isGoogleChatAccountConfigured(params) {
	const account = resolveGoogleChatAccount(params);
	return account.enabled && account.credentialSource !== "none";
}
function hasGoogleChatWebhookApprovalAuthConfig(params) {
	const account = resolveGoogleChatAccount(params).config;
	if (!normalizeOptionalString(account.audience)) return false;
	if (account.audienceType === "project-number") return true;
	return account.audienceType === "app-url";
}
function isGoogleChatApprovalTransportEnabled(params) {
	return isGoogleChatAccountConfigured(params) && hasGoogleChatWebhookApprovalAuthConfig(params);
}
function normalizeGoogleChatForwardTarget(target) {
	if (normalizeLowercaseStringOrEmpty(target.channel) !== "googlechat") return null;
	const to = normalizeGoogleChatTarget(target.to);
	return to ? {
		to,
		accountId: normalizeOptionalString(target.accountId),
		threadId: target.threadId ?? null
	} : null;
}
function resolveTurnSourceGoogleChatOriginTarget(request) {
	if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== "googlechat") return null;
	const target = normalizeGoogleChatTarget(request.request.turnSourceTo ?? "");
	if (!target || !isGoogleChatSpaceTarget(target)) return null;
	return {
		to: target,
		accountId: normalizeOptionalString(request.request.turnSourceAccountId),
		threadId: request.request.turnSourceThreadId ?? null
	};
}
const googleChatApprovalRouteGates = createNativeApprovalChannelRouteGates({
	channel: "googlechat",
	defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
	isTransportEnabled: isGoogleChatApprovalTransportEnabled,
	listAccountIds: listGoogleChatAccountIds,
	resolveDefaultAccountId: resolveDefaultGoogleChatAccountId,
	normalizeForwardTarget: normalizeGoogleChatForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceGoogleChatOriginTarget
});
function isGoogleChatNativeApprovalClientEnabled(params) {
	return googleChatApprovalRouteGates.canAnyApprovalPotentiallyRouteToChannel({
		...params,
		nativeSessionOnly: true
	}) && getGoogleChatApprovalApprovers(params).length > 0;
}
function resolveSessionGoogleChatOriginTarget(sessionTarget) {
	const target = normalizeGoogleChatTarget(sessionTarget.to);
	return target && isGoogleChatSpaceTarget(target) ? {
		to: target,
		threadId: sessionTarget.threadId ?? null
	} : null;
}
function shouldHandleGoogleChatNativeApprovalRequest(params) {
	return googleChatApprovalRouteGates.shouldHandleApprovalRequest(params) && getGoogleChatApprovalApprovers(params).length > 0 && Boolean(resolveTurnSourceGoogleChatOriginTarget(params.request));
}
function shouldSuppressLocalGoogleChatExecApprovalPrompt(params) {
	return shouldSuppressLocalNativeExecApprovalPrompt({
		...params,
		isNativeDeliveryEnabled: isGoogleChatNativeApprovalClientEnabled
	});
}
const googleChatApprovalCapability = createApproverRestrictedNativeApprovalCapability({
	channel: "googlechat",
	channelLabel: "Google Chat",
	describeExecApprovalSetup: ({ accountId }) => {
		const prefix = accountId && accountId !== "default" ? `channels.googlechat.accounts.${accountId}` : "channels.googlechat";
		return `Approve it from the Web UI or terminal UI for now. Google Chat supports native approvals for this account when the webhook and service account are configured. Configure \`${prefix}.dm.allowFrom\` or \`${prefix}.defaultTo\` with numeric \`users/{id}\` approvers.`;
	},
	listAccountIds: listGoogleChatAccountIds,
	hasApprovers: ({ cfg, accountId }) => getGoogleChatApprovalApprovers({
		cfg,
		accountId
	}).length > 0,
	isExecAuthorizedSender: ({ cfg, accountId, senderId }) => googleChatApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind: "exec"
	})?.authorized ?? false,
	isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => googleChatApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId,
		senderId,
		action: "approve",
		approvalKind: "plugin"
	})?.authorized ?? false,
	isNativeDeliveryEnabled: isGoogleChatNativeApprovalClientEnabled,
	resolveNativeDeliveryMode: () => "channel",
	requireMatchingTurnSourceChannel: true,
	resolveSuppressionAccountId: ({ target, request }) => normalizeOptionalString(target.accountId) ?? normalizeOptionalString(request.request.turnSourceAccountId),
	resolveOriginTarget: createChannelNativeOriginTargetResolver({
		channel: "googlechat",
		shouldHandleRequest: shouldHandleGoogleChatNativeApprovalRequest,
		resolveTurnSourceTarget: resolveTurnSourceGoogleChatOriginTarget,
		resolveSessionTarget: resolveSessionGoogleChatOriginTarget
	}),
	resolveApproverDmTargets: createChannelApproverDmTargetResolver({
		shouldHandleRequest: shouldHandleGoogleChatNativeApprovalRequest,
		resolveApprovers: getGoogleChatApprovalApprovers,
		mapApprover: (approver, params) => {
			const to = normalizeGoogleChatApproverId(approver);
			return to ? {
				to,
				accountId: normalizeOptionalString(params.accountId)
			} : null;
		}
	}),
	nativeRuntime: createLazyChannelApprovalNativeRuntimeAdapter({
		eventKinds: ["exec", "plugin"],
		isConfigured: ({ cfg, accountId }) => isGoogleChatNativeApprovalClientEnabled({
			cfg,
			accountId
		}),
		shouldHandle: ({ cfg, accountId, request }) => shouldHandleGoogleChatNativeApprovalRequest({
			cfg,
			accountId,
			request
		}),
		load: async () => (await import("./approval-handler.runtime-w0yW5s5g.js")).googleChatApprovalNativeRuntime
	})
});
//#endregion
export { shouldSuppressLocalGoogleChatExecApprovalPrompt as i, isGoogleChatNativeApprovalClientEnabled as n, shouldHandleGoogleChatNativeApprovalRequest as r, googleChatApprovalCapability as t };

import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { i as resolveMatrixAccount, r as resolveDefaultMatrixAccountId } from "./accounts-C_r0UlEm.mjs";
import { i as normalizeMatrixUserId } from "./channel.setup-DC2t7_PK.mjs";
import { doesApprovalRequestSelectChannelAccount } from "openclaw/plugin-sdk/approval-native-runtime";
import { createChannelApprovalAuth, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { createChannelExecApprovalProfile, getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
//#region extensions/matrix/src/approval-ids.ts
function normalizeMatrixApproverId(value) {
	return normalizeMatrixUserId(String(value)) || void 0;
}
//#endregion
//#region extensions/matrix/src/approval-auth.ts
const matrixApproval = createChannelApprovalAuth({
	channelLabel: "Matrix",
	resolveInputs: ({ cfg, accountId }) => {
		return { allowFrom: resolveMatrixAccountConfig({
			cfg,
			accountId: accountId ?? resolveDefaultMatrixAccountId(cfg)
		}).dm?.allowFrom };
	},
	normalizeApprover: normalizeMatrixApproverId
});
const getMatrixApprovalAuthApprovers = matrixApproval.resolveApprovers;
const matrixApprovalAuth = matrixApproval.approvalAuth;
//#endregion
//#region extensions/matrix/src/exec-approvals.ts
function normalizeMatrixExecApproverId(value) {
	const normalized = normalizeMatrixApproverId(value);
	return normalized === "*" ? void 0 : normalized;
}
function resolveMatrixExecApprovalConfig(params) {
	const account = resolveMatrixAccount(params);
	const config = account.config.execApprovals;
	if (!config) return;
	return {
		...config,
		enabled: account.enabled && account.configured ? config.enabled : false
	};
}
function isMatrixExecApprovalAccountEligible(params) {
	const account = resolveMatrixAccount(params);
	if (!account.enabled || !account.configured) return false;
	const config = resolveMatrixExecApprovalConfig(params);
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function matchesMatrixRequestAccount(params) {
	const accountId = params.accountId ?? resolveDefaultMatrixAccountId(params.cfg);
	return doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "matrix",
		defaultAccountId: resolveDefaultMatrixAccountId(params.cfg),
		eligibleAccountIds: isMatrixExecApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	});
}
function getMatrixExecApprovalApprovers(params) {
	const account = resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId ?? resolveDefaultMatrixAccountId(params.cfg)
	});
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers,
		allowFrom: account.dm?.allowFrom,
		normalizeApprover: normalizeMatrixExecApproverId
	});
}
function getMatrixApprovalApprovers(params) {
	if (params.approvalKind === "plugin") return getMatrixApprovalAuthApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	});
	return getMatrixExecApprovalApprovers(params);
}
function isMatrixExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "matrix",
		normalizeSenderId: normalizeMatrixApproverId,
		matchTarget: ({ target, normalizedSenderId }) => normalizeMatrixApproverId(target.to) === normalizedSenderId
	});
}
const matrixExecApprovalProfile = createChannelExecApprovalProfile({
	resolveConfig: resolveMatrixExecApprovalConfig,
	resolveApprovers: getMatrixExecApprovalApprovers,
	normalizeSenderId: normalizeMatrixApproverId,
	isTargetRecipient: isMatrixExecApprovalTargetRecipient,
	matchesRequestAccount: (params) => matchesMatrixRequestAccount({
		...params,
		approvalKind: "exec"
	})
});
const isMatrixExecApprovalClientEnabled = matrixExecApprovalProfile.isClientEnabled;
const isMatrixExecApprovalAuthorizedSender = matrixExecApprovalProfile.isAuthorizedSender;
const resolveMatrixExecApprovalTarget = matrixExecApprovalProfile.resolveTarget;
function isMatrixApprovalClientEnabled(params) {
	if (params.approvalKind === "exec" || params.approvalKind === "system-agent") return isMatrixExecApprovalClientEnabled(params);
	const config = resolveMatrixExecApprovalConfig(params);
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	});
}
function isMatrixAnyApprovalClientEnabled(params) {
	return isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "exec"
	}) || isMatrixApprovalClientEnabled({
		...params,
		approvalKind: "plugin"
	});
}
function shouldHandleMatrixApprovalRequest(params) {
	if (params.approvalKind !== "exec" && params.approvalKind !== "plugin" && params.approvalKind !== "system-agent") return false;
	if (!matchesMatrixRequestAccount(params)) return false;
	const config = resolveMatrixExecApprovalConfig(params);
	if (!isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	})) return false;
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function buildFilterCheckRequest(params) {
	if (params.metadata.approvalKind === "plugin") return {
		approvalKind: "plugin",
		id: params.metadata.approvalId,
		request: {
			title: "Plugin Approval Required",
			description: "",
			agentId: params.metadata.agentId ?? null,
			sessionKey: params.metadata.sessionKey ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
	return {
		approvalKind: "exec",
		id: params.metadata.approvalId,
		request: {
			command: "",
			agentId: params.metadata.agentId ?? null,
			sessionKey: params.metadata.sessionKey ?? null
		},
		createdAtMs: 0,
		expiresAtMs: 0
	};
}
function shouldSuppressLocalMatrixExecApprovalPrompt(params) {
	if (!matrixExecApprovalProfile.shouldSuppressLocalPrompt(params)) return false;
	const metadata = getExecApprovalReplyMetadata(params.payload);
	if (!metadata) return false;
	const request = buildFilterCheckRequest({ metadata });
	return shouldHandleMatrixApprovalRequest({
		cfg: params.cfg,
		accountId: params.accountId,
		approvalKind: metadata.approvalKind,
		request
	});
}
//#endregion
export { isMatrixExecApprovalAuthorizedSender as a, shouldHandleMatrixApprovalRequest as c, matrixApprovalAuth as d, normalizeMatrixApproverId as f, isMatrixApprovalClientEnabled as i, shouldSuppressLocalMatrixExecApprovalPrompt as l, getMatrixExecApprovalApprovers as n, isMatrixExecApprovalClientEnabled as o, isMatrixAnyApprovalClientEnabled as r, resolveMatrixExecApprovalTarget as s, getMatrixApprovalApprovers as t, getMatrixApprovalAuthApprovers as u };

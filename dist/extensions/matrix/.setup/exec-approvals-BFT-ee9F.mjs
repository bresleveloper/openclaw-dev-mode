import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { g as resolveDefaultMatrixAccountId, v as resolveMatrixAccountAsync } from "./setup-core-Di6NtQ_J.mjs";
import { i as normalizeMatrixUserId } from "./channel.setup-p6oll48W.mjs";
import { doesApprovalRequestSelectChannelAccountAsync } from "openclaw/plugin-sdk/approval-native-runtime";
import { createChannelApprovalAuth, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { createChannelExecApprovalProfileAsync, getExecApprovalReplyMetadata, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
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
	return resolveMatrixAccountConfig({
		cfg: params.cfg,
		accountId: params.accountId ?? resolveDefaultMatrixAccountId(params.cfg)
	}).execApprovals;
}
function matchesMatrixApprovalConfig(params) {
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
async function matchesMatrixRequestAccount(params) {
	const accountId = params.accountId ?? resolveDefaultMatrixAccountId(params.cfg);
	const account = await resolveMatrixAccountAsync({
		...params,
		accountId
	});
	return doesApprovalRequestSelectChannelAccountAsync({
		...params,
		channel: "matrix",
		defaultAccountId: resolveDefaultMatrixAccountId(params.cfg),
		eligibleAccountIds: account.enabled && account.configured && matchesMatrixApprovalConfig(params) ? [accountId] : []
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
const matrixExecApprovalProfile = createChannelExecApprovalProfileAsync({
	resolveConfig: resolveMatrixExecApprovalConfig,
	resolveApprovers: getMatrixExecApprovalApprovers,
	normalizeSenderId: normalizeMatrixApproverId,
	isTargetRecipient: isMatrixExecApprovalTargetRecipient
});
const isMatrixExecApprovalAuthorizedSender = matrixExecApprovalProfile.isAuthorizedSender;
const resolveMatrixExecApprovalTarget = matrixExecApprovalProfile.resolveTarget;
async function isMatrixApprovalClientEnabled(params) {
	const account = await resolveMatrixAccountAsync(params);
	if (!account.enabled || !account.configured) return false;
	const config = account.config.execApprovals;
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getMatrixApprovalApprovers(params).length
	});
}
async function isMatrixAnyApprovalClientEnabled(params) {
	const account = await resolveMatrixAccountAsync(params);
	return account.enabled && account.configured && isChannelExecApprovalClientEnabledFromConfig({
		enabled: account.config.execApprovals?.enabled,
		approverCount: getMatrixExecApprovalApprovers(params).length + getMatrixApprovalApprovers({
			...params,
			approvalKind: "plugin"
		}).length
	});
}
async function shouldHandleMatrixApprovalRequest(params) {
	if (params.approvalKind !== "exec" && params.approvalKind !== "plugin" && params.approvalKind !== "system-agent") return false;
	if (!await matchesMatrixRequestAccount(params)) return false;
	return matchesMatrixApprovalConfig(params);
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
async function shouldSuppressLocalMatrixExecApprovalPrompt(params) {
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
export { isMatrixExecApprovalAuthorizedSender as a, shouldSuppressLocalMatrixExecApprovalPrompt as c, normalizeMatrixApproverId as d, isMatrixApprovalClientEnabled as i, getMatrixApprovalAuthApprovers as l, getMatrixExecApprovalApprovers as n, resolveMatrixExecApprovalTarget as o, isMatrixAnyApprovalClientEnabled as r, shouldHandleMatrixApprovalRequest as s, getMatrixApprovalApprovers as t, matrixApprovalAuth as u };

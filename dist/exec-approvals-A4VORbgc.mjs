import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { a as resolveApprovalApprovers } from "./approval-auth-helpers-qw6QuQTP.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-C0-UKdRV.mjs";
import { n as isChannelExecApprovalClientEnabledFromConfig, r as isChannelExecApprovalTargetRecipient, t as createChannelExecApprovalProfile } from "./approval-client-helpers-DFv5uNB9.mjs";
import "./approval-client-runtime-CD4F8ybo.mjs";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-DSNpCt32.mjs";
import "./approval-native-runtime-BHq7t0Wf.mjs";
import { a as resolveDefaultTelegramAccountId, o as resolveTelegramAccount } from "./accounts-ByNW1Cs3.mjs";
import { c as resolveTelegramTargetChatType, i as normalizeTelegramChatId } from "./topic-conversation-BlxRQJEK.mjs";
//#region extensions/telegram/src/exec-approvals.ts
function normalizeApproverId(value) {
	return normalizeOptionalString(String(value)) ?? "";
}
function normalizeTelegramDirectApproverId(value) {
	const normalized = normalizeApproverId(value);
	const chatId = normalizeTelegramChatId(normalized);
	if (!chatId || chatId.startsWith("-")) return;
	return chatId;
}
function resolveTelegramOwnerApprovers(cfg) {
	const ownerAllowFrom = cfg.commands?.ownerAllowFrom;
	return Array.isArray(ownerAllowFrom) ? ownerAllowFrom : [];
}
function resolveTelegramExecApprovalConfig(params) {
	const account = resolveTelegramAccount(params);
	const config = account.config.execApprovals;
	const enabled = account.enabled && account.tokenSource !== "none" ? config?.enabled ?? "auto" : false;
	return {
		...config,
		enabled
	};
}
function getTelegramExecApprovalApprovers(params) {
	return resolveApprovalApprovers({
		explicit: resolveTelegramExecApprovalConfig(params)?.approvers,
		allowFrom: resolveTelegramOwnerApprovers(params.cfg),
		normalizeApprover: normalizeTelegramDirectApproverId
	});
}
function isTelegramExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "telegram",
		matchTarget: ({ target, normalizedSenderId }) => {
			const to = target.to ? normalizeTelegramChatId(target.to) : void 0;
			if (!to || to.startsWith("-")) return false;
			return to === normalizedSenderId;
		}
	});
}
function isTelegramExecApprovalAccountEligible(params) {
	const account = resolveTelegramAccount(params);
	if (!account.enabled || account.tokenSource === "none") return false;
	const config = resolveTelegramExecApprovalConfig(params);
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getTelegramExecApprovalApprovers(params).length
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter,
		fallbackAgentIdFromSessionKey: true
	});
}
function matchesTelegramRequestAccount(params) {
	const accountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
	return doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "telegram",
		defaultAccountId: resolveDefaultTelegramAccountId(params.cfg),
		eligibleAccountIds: isTelegramExecApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	});
}
const telegramExecApprovalProfile = createChannelExecApprovalProfile({
	resolveConfig: resolveTelegramExecApprovalConfig,
	resolveApprovers: getTelegramExecApprovalApprovers,
	isTargetRecipient: isTelegramExecApprovalTargetRecipient,
	matchesRequestAccount: matchesTelegramRequestAccount,
	fallbackAgentIdFromSessionKey: true,
	requireClientEnabledForLocalPromptSuppression: false
});
const isTelegramExecApprovalClientEnabled = telegramExecApprovalProfile.isClientEnabled;
const isTelegramExecApprovalApprover = telegramExecApprovalProfile.isApprover;
const isTelegramExecApprovalAuthorizedSender = telegramExecApprovalProfile.isAuthorizedSender;
const resolveTelegramExecApprovalTarget = telegramExecApprovalProfile.resolveTarget;
const shouldHandleTelegramExecApprovalRequest = telegramExecApprovalProfile.shouldHandleRequest;
function shouldInjectTelegramExecApprovalButtons(params) {
	if (!isTelegramExecApprovalClientEnabled(params)) return false;
	const target = resolveTelegramExecApprovalTarget(params);
	const chatType = resolveTelegramTargetChatType(params.to);
	if (chatType === "direct") return target === "dm" || target === "both";
	if (chatType === "group") return target === "channel" || target === "both";
	return target === "both";
}
function shouldSuppressLocalTelegramExecApprovalPrompt(params) {
	return telegramExecApprovalProfile.shouldSuppressLocalPrompt(params);
}
function isTelegramExecApprovalHandlerConfigured(params) {
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: resolveTelegramExecApprovalConfig(params)?.enabled,
		approverCount: getTelegramExecApprovalApprovers(params).length
	});
}
//#endregion
export { isTelegramExecApprovalHandlerConfigured as a, resolveTelegramExecApprovalTarget as c, shouldSuppressLocalTelegramExecApprovalPrompt as d, isTelegramExecApprovalClientEnabled as i, shouldHandleTelegramExecApprovalRequest as l, isTelegramExecApprovalApprover as n, isTelegramExecApprovalTargetRecipient as o, isTelegramExecApprovalAuthorizedSender as r, resolveTelegramExecApprovalConfig as s, getTelegramExecApprovalApprovers as t, shouldInjectTelegramExecApprovalButtons as u };

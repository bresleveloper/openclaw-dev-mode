import { a as resolveApprovalApprovers } from "./approval-auth-helpers-D_zJFQOm.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-RxKxwld1.mjs";
import { n as isChannelExecApprovalClientEnabledFromConfig, r as isChannelExecApprovalTargetRecipient, t as createChannelExecApprovalProfile } from "./approval-client-helpers-FGNJOzvc.mjs";
import "./approval-client-runtime-BUOYtxeJ.mjs";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-I7l4AwjN.mjs";
import "./approval-native-runtime-u5kQUm6i.mjs";
import { a as resolveTelegramAccount, i as resolveDefaultTelegramAccountId } from "./accounts-Dt8wbZ2I.mjs";
import { o as normalizeTelegramChatId, u as resolveTelegramTargetChatType } from "./topic-conversation-C-lzScEI.mjs";
//#region extensions/telegram/src/exec-approvals.ts
function normalizeTelegramDirectApproverId(value) {
	const chatId = normalizeTelegramChatId(String(value));
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
const shouldSuppressLocalTelegramExecApprovalPrompt = telegramExecApprovalProfile.shouldSuppressLocalPrompt;
const isTelegramExecApprovalHandlerConfigured = telegramExecApprovalProfile.isClientEnabled;
//#endregion
export { isTelegramExecApprovalHandlerConfigured as a, resolveTelegramExecApprovalTarget as c, shouldSuppressLocalTelegramExecApprovalPrompt as d, isTelegramExecApprovalClientEnabled as i, shouldHandleTelegramExecApprovalRequest as l, isTelegramExecApprovalApprover as n, isTelegramExecApprovalTargetRecipient as o, isTelegramExecApprovalAuthorizedSender as r, resolveTelegramExecApprovalConfig as s, getTelegramExecApprovalApprovers as t, shouldInjectTelegramExecApprovalButtons as u };

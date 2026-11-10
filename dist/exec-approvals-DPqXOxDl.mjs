import { a as resolveApprovalApprovers } from "./approval-auth-helpers-CKuqMzvH.mjs";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-BYgsD07g.mjs";
import { i as isChannelExecApprovalTargetRecipient, n as createChannelExecApprovalProfileAsync, r as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-DwYLBJUZ.mjs";
import "./approval-client-runtime-CMGL5w__.mjs";
import { o as doesApprovalRequestSelectChannelAccountAsync } from "./approval-request-account-binding-CVzeB0WI.mjs";
import "./approval-native-runtime-C3kPktYq.mjs";
import { i as resolveTelegramAccount, r as resolveDefaultTelegramAccountId } from "./accounts-CHcpIFN8.mjs";
import { o as normalizeTelegramChatId, u as resolveTelegramTargetChatType } from "./topic-conversation-S0gZB4iY.mjs";
//#region extensions/telegram/src/exec-approvals.ts
function normalizeTelegramDirectApproverId(value) {
	const chatId = normalizeTelegramChatId(String(value));
	return chatId && !chatId.startsWith("-") ? chatId : void 0;
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
		allowFrom: Array.isArray(params.cfg.commands?.ownerAllowFrom) ? params.cfg.commands.ownerAllowFrom : [],
		normalizeApprover: normalizeTelegramDirectApproverId
	});
}
function isTelegramExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "telegram",
		matchTarget: ({ target, normalizedSenderId }) => {
			const to = target.to ? normalizeTelegramDirectApproverId(target.to) : void 0;
			return to !== void 0 && to === normalizedSenderId;
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
async function matchesTelegramRequestAccount(params) {
	const accountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
	return doesApprovalRequestSelectChannelAccountAsync({
		...params,
		channel: "telegram",
		defaultAccountId: resolveDefaultTelegramAccountId(params.cfg),
		eligibleAccountIds: isTelegramExecApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	});
}
const telegramExecApprovalProfile = createChannelExecApprovalProfileAsync({
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
	return target === "both" || chatType === "direct" && target === "dm" || chatType === "group" && target === "channel";
}
const shouldSuppressLocalTelegramExecApprovalPrompt = telegramExecApprovalProfile.shouldSuppressLocalPrompt;
const isTelegramExecApprovalHandlerConfigured = telegramExecApprovalProfile.isClientEnabled;
//#endregion
export { isTelegramExecApprovalHandlerConfigured as a, resolveTelegramExecApprovalTarget as c, shouldSuppressLocalTelegramExecApprovalPrompt as d, isTelegramExecApprovalClientEnabled as i, shouldHandleTelegramExecApprovalRequest as l, isTelegramExecApprovalApprover as n, isTelegramExecApprovalTargetRecipient as o, isTelegramExecApprovalAuthorizedSender as r, resolveTelegramExecApprovalConfig as s, getTelegramExecApprovalApprovers as t, shouldInjectTelegramExecApprovalButtons as u };

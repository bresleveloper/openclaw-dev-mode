import { t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { n as normalizeMattermostAllowEntry, t as mattermostIngressIdentity } from "./ingress-identity-DNl4yQSc.mjs";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
import { resolveAllowlistMatchSimple } from "openclaw/plugin-sdk/allow-from";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
import { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
import { listSkillCommandsForAgents } from "openclaw/plugin-sdk/command-auth-native";
import { buildPreparedModelsProviderData } from "openclaw/plugin-sdk/models-provider-runtime";
import { isDangerousNameMatchingEnabled } from "openclaw/plugin-sdk/dangerous-name-runtime";
import { resolveAllowlistProviderRuntimeGroupPolicy as resolveAllowlistProviderRuntimeGroupPolicy$1, resolveDefaultGroupPolicy, warnMissingProviderGroupPolicyFallbackOnce } from "openclaw/plugin-sdk/runtime-group-policy";
import { resolveChannelMediaMaxBytes as resolveChannelMediaMaxBytes$1 } from "openclaw/plugin-sdk/account-helpers";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { DEFAULT_GROUP_HISTORY_LIMIT, createChannelHistoryWindow } from "openclaw/plugin-sdk/reply-history";
import { registerPluginHttpRoute } from "openclaw/plugin-sdk/webhook-targets";
import { isRequestBodyLimitError } from "openclaw/plugin-sdk/webhook-ingress";
import { createWebhookInFlightLimiter, readRequestBodyWithLimit, sendHttpRequestRejection } from "openclaw/plugin-sdk/webhook-request-guards";
import { isTrustedProxyAddress, resolveClientIp } from "openclaw/plugin-sdk/core";
import { resolveChannelContextVisibilityMode, shouldIncludeSupplementalContext } from "openclaw/plugin-sdk/context-visibility-runtime";
//#region extensions/mattermost/src/mattermost/monitor-auth.ts
function normalizeMattermostAllowList(entries) {
	const normalized = entries.map((entry) => normalizeMattermostAllowEntry(String(entry))).filter(Boolean);
	return uniqueStrings(normalized);
}
function formatMattermostDirectMessageDropLog(params) {
	const reason = params.reasonCode ? ` reason=${params.reasonCode}` : "";
	const hint = params.dmPolicy === "open" && params.reasonCode === "dm_policy_not_allowlisted" ? " hint=add-allowFrom-wildcard" : "";
	return `mattermost: drop dm sender=${params.senderId} (dmPolicy=${params.dmPolicy}${reason}${hint})`;
}
function isMattermostSenderAllowed(params) {
	const allowFrom = normalizeMattermostAllowList(params.allowFrom);
	return resolveAllowlistMatchSimple({
		allowFrom,
		senderId: normalizeMattermostAllowEntry(params.senderId),
		senderName: params.senderName ? normalizeMattermostAllowEntry(params.senderName) : void 0,
		allowNameMatching: params.allowNameMatching
	}).allowed;
}
function mapMattermostChannelTypeToChatType(channelType) {
	const normalized = channelType?.trim().toUpperCase();
	if (!normalized) return "direct";
	if (normalized === "D") return "direct";
	if (normalized === "G" || normalized === "P") return "group";
	return "channel";
}
function resolveMattermostTrustedChatKind(params) {
	const channelType = params.channelType?.trim();
	return channelType ? mapMattermostChannelTypeToChatType(channelType) : params.fallback ?? "direct";
}
async function resolveMattermostMonitorInboundAccess(params) {
	const { account, cfg, senderId, senderName, channelId, kind, groupPolicy, storeAllowFrom, allowTextCommands, hasControlCommand } = params;
	const dmPolicy = account.config.dmPolicy ?? "pairing";
	const allowNameMatching = isDangerousNameMatchingEnabled(account.config);
	const configAllowFrom = account.config.allowFrom ?? [];
	const configGroupAllowFrom = account.config.groupAllowFrom ?? [];
	const readStoreAllowFrom = params.readStoreAllowFrom ?? (storeAllowFrom != null ? async () => [...storeAllowFrom] : void 0);
	return await getMattermostRuntime().channel.inbound.ingress.resolveStable({
		channelId: "mattermost",
		accountId: account.accountId,
		identity: mattermostIngressIdentity,
		cfg,
		...readStoreAllowFrom ? { readStoreAllowFrom } : {},
		useDefaultPairingStore: params.readStoreAllowFrom === void 0 && storeAllowFrom == null,
		subject: {
			stableId: senderId,
			aliases: { "sender-name": senderName }
		},
		conversation: {
			kind,
			id: channelId
		},
		event: {
			kind: params.eventKind ?? "message",
			authMode: "inbound",
			mayPair: params.mayPair ?? true
		},
		dmPolicy,
		groupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: true,
			mutableIdentifierMatching: allowNameMatching ? "enabled" : "disabled"
		},
		allowFrom: configAllowFrom,
		groupAllowFrom: configGroupAllowFrom,
		command: {
			allowTextCommands,
			hasControlCommand: allowTextCommands && hasControlCommand,
			directGroupAllowFrom: kind === "direct" ? "effective" : "none"
		}
	});
}
/** Live and recovered history share the same trigger-versus-visibility policy. */
function shouldRetainMattermostSenderHistory(params) {
	return params.ingress.decision === "allow" || params.kind !== "direct" && params.ingress.reasonCode === "group_policy_not_allowlisted" && shouldIncludeSupplementalContext({
		mode: resolveChannelContextVisibilityMode({
			cfg: params.cfg,
			channel: "mattermost",
			accountId: params.accountId
		}),
		kind: "history",
		senderAllowed: false
	});
}
function resolveMattermostCommandDenyReason(params) {
	if (params.decision.decision === "allow") return null;
	if (params.kind === "direct") {
		if (params.decision.reasonCode === "dm_policy_disabled") return "dm-disabled";
		if (params.dmPolicy === "pairing" && (params.decision.admission === "pairing-required" || params.decision.reasonCode === "dm_policy_pairing_required")) return "dm-pairing";
		return "unauthorized";
	}
	if (params.decision.reasonCode === "group_policy_disabled") return "channels-disabled";
	if (params.decision.reasonCode === "group_policy_empty_allowlist") return "channel-no-allowlist";
	return "unauthorized";
}
async function authorizeMattermostCommandInvocation(params) {
	const { account, cfg, senderId, senderName, channelId, channelInfo, storeAllowFrom, readStoreAllowFrom, allowTextCommands, hasControlCommand } = params;
	if (!channelInfo?.type) return {
		ok: false,
		denyReason: "unknown-channel",
		commandAuthorized: false,
		channelInfo,
		kind: "channel",
		chatType: "channel",
		channelName: "",
		channelDisplay: "",
		roomLabel: `#${channelId}`
	};
	const kind = mapMattermostChannelTypeToChatType(channelInfo.type);
	const chatType = kind;
	const channelName = channelInfo.name ?? "";
	const channelDisplay = channelInfo.display_name ?? channelName;
	const roomLabel = channelName ? `#${channelName}` : channelDisplay || `#${channelId}`;
	const defaultGroupPolicy = cfg.channels?.defaults?.groupPolicy;
	const ingress = await resolveMattermostMonitorInboundAccess({
		account,
		cfg,
		senderId,
		senderName,
		channelId,
		kind,
		groupPolicy: account.config.groupPolicy ?? defaultGroupPolicy ?? "allowlist",
		storeAllowFrom,
		readStoreAllowFrom,
		allowTextCommands,
		hasControlCommand,
		eventKind: "native-command",
		mayPair: true
	});
	const denyReason = resolveMattermostCommandDenyReason({
		decision: ingress.ingress,
		kind,
		dmPolicy: account.config.dmPolicy ?? "pairing"
	});
	if (denyReason) return {
		ok: false,
		denyReason,
		commandAuthorized: false,
		channelInfo,
		kind,
		chatType,
		channelName,
		channelDisplay,
		roomLabel
	};
	return {
		ok: true,
		commandAuthorized: ingress.commandAccess.authorized,
		channelInfo,
		kind,
		chatType,
		channelName,
		channelDisplay,
		roomLabel
	};
}
//#endregion
export { resolveAllowlistProviderRuntimeGroupPolicy$1 as C, sendHttpRequestRejection as D, resolveDefaultGroupPolicy as E, warnMissingProviderGroupPolicyFallbackOnce as O, registerPluginHttpRoute as S, resolveClientIp as T, listSkillCommandsForAgents as _, resolveMattermostMonitorInboundAccess as a, logTypingFailure as b, DEFAULT_GROUP_HISTORY_LIMIT as c, createChannelMessageReplyPipeline as d, createChannelPairingController as f, isTrustedProxyAddress as g, isRequestBodyLimitError as h, normalizeMattermostAllowList as i, buildPreparedModelsProviderData as l, isDangerousNameMatchingEnabled as m, formatMattermostDirectMessageDropLog as n, resolveMattermostTrustedChatKind as o, createWebhookInFlightLimiter as p, isMattermostSenderAllowed as r, shouldRetainMattermostSenderHistory as s, authorizeMattermostCommandInvocation as t, createChannelHistoryWindow as u, loadOutboundMediaFromUrl as v, resolveChannelMediaMaxBytes$1 as w, readRequestBodyWithLimit as x, logInboundDrop as y };

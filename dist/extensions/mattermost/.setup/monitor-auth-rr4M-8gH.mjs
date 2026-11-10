import { t as getMattermostRuntime } from "./runtime-CNB4YGqJ.mjs";
import { n as normalizeMattermostAllowEntry, t as mattermostIngressIdentity } from "./ingress-identity-D6hxfxvo.mjs";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { logInboundDrop } from "openclaw/plugin-sdk/channel-inbound";
import { resolveAllowlistMatchSimple } from "openclaw/plugin-sdk/allow-from";
import { createChannelPairingController } from "openclaw/plugin-sdk/channel-pairing";
import { createChannelMessageReplyPipeline } from "openclaw/plugin-sdk/channel-outbound";
import { logTypingFailure } from "openclaw/plugin-sdk/channel-feedback";
import { prepareSkillCommandsForAgents } from "openclaw/plugin-sdk/command-auth-native";
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
const MATTERMOST_PAIRING_QUEUE_FULL_TEXT = "DM pairing is full, so no pairing request was saved. Ask the bot owner to approve or dismiss pending requests in Settings → Channels → DM access requests, then try again.";
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
		contextBinding: params.contextBinding,
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
			id: channelId,
			threadId: params.threadId
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
	return {
		channelInfo,
		kind,
		chatType,
		channelName,
		channelDisplay,
		roomLabel,
		...denyReason ? {
			ok: false,
			denyReason,
			commandAuthorized: false
		} : {
			ok: true,
			commandAuthorized: ingress.commandAccess.authorized
		}
	};
}
//#endregion
export { registerPluginHttpRoute as C, resolveDefaultGroupPolicy as D, resolveClientIp as E, sendHttpRequestRejection as O, readRequestBodyWithLimit as S, resolveChannelMediaMaxBytes$1 as T, isTrustedProxyAddress as _, normalizeMattermostAllowList as a, logTypingFailure as b, shouldRetainMattermostSenderHistory as c, createChannelHistoryWindow as d, createChannelMessageReplyPipeline as f, isRequestBodyLimitError as g, isDangerousNameMatchingEnabled as h, isMattermostSenderAllowed as i, warnMissingProviderGroupPolicyFallbackOnce as k, DEFAULT_GROUP_HISTORY_LIMIT as l, createWebhookInFlightLimiter as m, authorizeMattermostCommandInvocation as n, resolveMattermostMonitorInboundAccess as o, createChannelPairingController as p, formatMattermostDirectMessageDropLog as r, resolveMattermostTrustedChatKind as s, MATTERMOST_PAIRING_QUEUE_FULL_TEXT as t, buildPreparedModelsProviderData as u, loadOutboundMediaFromUrl as v, resolveAllowlistProviderRuntimeGroupPolicy$1 as w, prepareSkillCommandsForAgents as x, logInboundDrop as y };

import { l as normalizeE164 } from "./utils-BApvfmPs.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { F as resolveGroupSessionKey } from "./store-DJ7wx5_V.js";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-BM2LYNY0.js";
import { a as warnMissingProviderGroupPolicyFallbackOnce, i as resolveOpenProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "./runtime-group-policy-BEjP88cf.js";
import "./runtime-env-oOti2yy7.js";
import { d as upsertChannelPairingRequest } from "./pairing-store-uQh6I0SL.js";
import "./channel-policy-VIimbh8Q.js";
import "./session-store-runtime-BlqMkGtn.js";
import "./conversation-runtime-C5z_BtCi.js";
import { i as resolveStableChannelMessageIngress } from "./message-access-CdFJfQ2z.js";
import "./channel-ingress-runtime-DWRe4gJp.js";
import { t as createChannelPairingChallengeIssuer } from "./channel-pairing-BhZI8NmU.js";
import { a as resolveWhatsAppAccount } from "./accounts-D4l-iMIF.js";
import { n as isSelfChatMode } from "./text-runtime-DshxRpTA.js";
import { a as getSelfIdentity, o as getSenderIdentity } from "./identity-B1I7YF2e.js";
//#region extensions/whatsapp/src/inbound/group-conversation.ts
function resolveWhatsAppGroupConversationId(conversationId) {
	return resolveGroupSessionKey({
		From: conversationId,
		ChatType: "group",
		Provider: "whatsapp"
	})?.id ?? conversationId;
}
//#endregion
//#region extensions/whatsapp/src/inbound/admission.ts
function copyAccount(account) {
	const copied = {
		accountId: account.accountId,
		enabled: account.enabled,
		sendReadReceipts: account.sendReadReceipts
	};
	if (account.name) copied.name = account.name;
	if (typeof account.selfChatMode === "boolean") copied.selfChatMode = account.selfChatMode;
	if (account.replyToMode) copied.replyToMode = account.replyToMode;
	return copied;
}
function buildWhatsAppInboundAdmission(params) {
	return {
		accountId: params.policy.account.accountId,
		isSelfChat: params.policy.isSelfChat,
		account: copyAccount(params.policy.account),
		conversation: {
			kind: params.isGroup ? "group" : "direct",
			id: params.conversationId,
			groupSessionId: resolveWhatsAppGroupConversationId(params.conversationId)
		},
		sender: {
			id: params.senderId,
			isSamePhone: params.policy.isSamePhone(params.senderId)
		},
		ingress: {
			admission: params.access.ingress.admission,
			decision: params.access.ingress.decision,
			decisiveGateId: params.access.ingress.decisiveGateId,
			reasonCode: params.access.ingress.reasonCode
		},
		senderAccess: {
			allowed: params.access.senderAccess.allowed,
			decision: params.access.senderAccess.decision,
			reasonCode: params.access.senderAccess.reasonCode,
			providerMissingFallbackApplied: params.access.senderAccess.providerMissingFallbackApplied
		},
		commandAccess: {
			requested: params.access.commandAccess.requested,
			authorized: params.access.commandAccess.authorized,
			shouldBlockControlCommand: params.access.commandAccess.shouldBlockControlCommand,
			reasonCode: params.access.commandAccess.reasonCode
		},
		activationAccess: {
			ran: params.access.activationAccess.ran,
			allowed: params.access.activationAccess.allowed,
			shouldSkip: params.access.activationAccess.shouldSkip,
			reasonCode: params.access.activationAccess.reasonCode
		}
	};
}
function buildDeprecatedFlatWhatsAppInboundAdmission(msg) {
	const conversationId = msg.conversationId || msg.from;
	if (!conversationId || !msg.accountId || !msg.chatType) throw new Error("WhatsApp legacy flat inbound messages must include deprecated top-level admission fields.");
	const accountId = msg.accountId;
	const admitted = msg.accessControlPassed !== false;
	const platformSender = msg.platform?.sender;
	const senderE164 = platformSender?.e164 ?? msg.platform?.senderE164 ?? msg.senderE164;
	const senderJid = platformSender?.jid ?? msg.platform?.senderJid ?? msg.senderJid;
	const senderName = platformSender?.name ?? msg.platform?.senderName ?? msg.senderName;
	const senderId = msg.chatType === "group" ? senderE164 ?? senderJid ?? senderName ?? conversationId : senderE164 ?? conversationId;
	const reasonCode = admitted ? msg.chatType === "group" ? "group_policy_allowed" : "dm_policy_allowlisted" : "no_policy_match";
	return buildWhatsAppInboundAdmission({
		policy: {
			account: {
				accountId,
				enabled: true,
				sendReadReceipts: true
			},
			isSelfChat: false,
			isSamePhone: () => false
		},
		access: {
			ingress: {
				admission: admitted ? "dispatch" : "drop",
				decision: admitted ? "allow" : "block",
				decisiveGateId: "legacy-flat-compat",
				reasonCode
			},
			senderAccess: {
				allowed: admitted,
				decision: admitted ? "allow" : "block",
				reasonCode,
				providerMissingFallbackApplied: false
			},
			commandAccess: {
				requested: false,
				authorized: false,
				shouldBlockControlCommand: false,
				reasonCode: "command_authorized"
			},
			activationAccess: {
				ran: false,
				allowed: admitted,
				shouldSkip: !admitted,
				reasonCode: admitted ? "activation_allowed" : "activation_skipped"
			}
		},
		isGroup: msg.chatType === "group",
		conversationId,
		senderId
	});
}
function requireWhatsAppInboundAdmission(params) {
	if (!params.admission) throw new Error("WhatsApp inbound message is missing admission facts");
	return params.admission;
}
function requireAdmittedWhatsAppInboundMessage(msg) {
	requireWhatsAppInboundAdmission(msg);
	return msg;
}
//#endregion
//#region extensions/whatsapp/src/runtime-group-policy.ts
function resolveWhatsAppRuntimeGroupPolicy(params) {
	return resolveOpenProviderRuntimeGroupPolicy({
		providerConfigPresent: params.providerConfigPresent,
		groupPolicy: params.groupPolicy,
		defaultGroupPolicy: params.defaultGroupPolicy
	});
}
//#endregion
//#region extensions/whatsapp/src/inbound-policy.ts
function normalizeWhatsAppIngressPhone(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	return normalizeE164(trimmed);
}
function maybeSamePhoneDmAllowFrom(params) {
	if (params.isGroup || !params.dmSenderId || !params.policy.isSamePhone(params.dmSenderId)) return [];
	return [params.dmSenderId];
}
function buildResolvedWhatsAppGroupConfig(params) {
	return { channels: { whatsapp: {
		groupPolicy: params.groupPolicy,
		groups: params.groups
	} } };
}
function resolveWhatsAppInboundPolicy(params) {
	const account = resolveWhatsAppAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const configuredAllowFrom = account.allowFrom ?? [];
	const dmPolicy = account.dmPolicy ?? "pairing";
	const dmAllowFrom = configuredAllowFrom.length > 0 ? configuredAllowFrom : params.selfE164 ? [params.selfE164] : [];
	const groupAllowFrom = (Array.isArray(account.groupAllowFrom) && account.groupAllowFrom.length > 0 ? account.groupAllowFrom : void 0) ?? (configuredAllowFrom.length > 0 ? configuredAllowFrom : void 0) ?? [];
	const defaultGroupPolicy = resolveDefaultGroupPolicy(params.cfg);
	const { groupPolicy, providerMissingFallbackApplied } = resolveWhatsAppRuntimeGroupPolicy({
		providerConfigPresent: params.cfg.channels?.whatsapp !== void 0,
		groupPolicy: account.groupPolicy,
		defaultGroupPolicy
	});
	const resolvedGroupCfg = buildResolvedWhatsAppGroupConfig({
		groupPolicy,
		groups: account.groups
	});
	const isSamePhone = (value) => typeof value === "string" && typeof params.selfE164 === "string" && value === params.selfE164;
	return {
		account,
		dmPolicy,
		groupPolicy,
		configuredAllowFrom,
		dmAllowFrom,
		groupAllowFrom,
		isSelfChat: account.selfChatMode ?? isSelfChatMode(params.selfE164, configuredAllowFrom),
		providerMissingFallbackApplied,
		isSamePhone,
		resolveConversationGroupPolicy: (conversationId) => resolveChannelGroupPolicy({
			cfg: resolvedGroupCfg,
			channel: "whatsapp",
			groupId: resolveWhatsAppGroupConversationId(conversationId),
			hasGroupAllowFrom: groupAllowFrom.length > 0
		}),
		resolveConversationRequireMention: (conversationId) => resolveChannelGroupRequireMention({
			cfg: resolvedGroupCfg,
			channel: "whatsapp",
			groupId: resolveWhatsAppGroupConversationId(conversationId)
		})
	};
}
async function resolveWhatsAppIngressAccess(params) {
	const samePhoneDmAllowFrom = maybeSamePhoneDmAllowFrom({
		isGroup: params.isGroup,
		policy: params.policy,
		dmSenderId: params.dmSenderId
	});
	const dmAllowFrom = [...params.policy.dmAllowFrom, ...samePhoneDmAllowFrom];
	return await resolveStableChannelMessageIngress({
		channelId: "whatsapp",
		accountId: params.policy.account.accountId,
		identity: {
			key: "whatsapp-sender-phone",
			kind: "phone",
			normalize: normalizeWhatsAppIngressPhone,
			sensitivity: "pii",
			entryIdPrefix: "whatsapp-entry"
		},
		cfg: params.cfg,
		useDefaultPairingStore: true,
		subject: { stableId: params.senderId ?? "" },
		conversation: {
			kind: params.isGroup ? "group" : "direct",
			id: params.conversationId
		},
		dmPolicy: params.policy.dmPolicy,
		groupPolicy: params.policy.groupPolicy,
		policy: { groupAllowFromFallbackToAllowFrom: false },
		providerMissingFallbackApplied: params.policy.providerMissingFallbackApplied,
		allowFrom: dmAllowFrom,
		groupAllowFrom: params.policy.groupAllowFrom,
		command: params.includeCommand === true ? {} : void 0
	});
}
async function resolveWhatsAppCommandAuthorized(params) {
	if (!(params.cfg.commands?.useAccessGroups !== false)) return true;
	const self = getSelfIdentity(params.msg);
	const admission = requireWhatsAppInboundAdmission(params.msg);
	const policy = params.policy ?? resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: admission.accountId,
		selfE164: self.e164 ?? null
	});
	const isGroup = admission.conversation.kind === "group";
	const sender = getSenderIdentity(params.msg);
	const dmSender = sender.e164 ?? admission.conversation.id;
	const groupSender = sender.e164 ?? "";
	if (!normalizeE164(isGroup ? groupSender : dmSender)) return false;
	return (await resolveWhatsAppIngressAccess({
		cfg: params.cfg,
		policy,
		isGroup,
		conversationId: admission.conversation.id,
		senderId: isGroup ? groupSender : dmSender,
		dmSenderId: dmSender,
		includeCommand: true
	})).commandAccess.authorized;
}
//#endregion
//#region extensions/whatsapp/src/inbound/access-control.ts
const PAIRING_REPLY_HISTORY_GRACE_MS = 3e4;
function logWhatsAppVerbose(enabled, message) {
	if (!enabled) return;
	defaultRuntime.log(message);
}
function blockedInboundAccess(policy) {
	return {
		allowed: false,
		shouldMarkRead: false,
		isSelfChat: policy.isSelfChat,
		resolvedAccountId: policy.account.accountId
	};
}
async function checkInboundAccessControl(params) {
	const policy = resolveWhatsAppInboundPolicy({
		cfg: params.cfg,
		accountId: params.accountId,
		selfE164: params.selfE164
	});
	const pairingGraceMs = typeof params.pairingGraceMs === "number" && params.pairingGraceMs > 0 ? params.pairingGraceMs : PAIRING_REPLY_HISTORY_GRACE_MS;
	const suppressPairingReply = typeof params.connectedAtMs === "number" && typeof params.messageTimestampMs === "number" && params.messageTimestampMs < params.connectedAtMs - pairingGraceMs;
	warnMissingProviderGroupPolicyFallbackOnce({
		providerMissingFallbackApplied: policy.providerMissingFallbackApplied,
		providerKey: "whatsapp",
		accountId: policy.account.accountId,
		log: (message) => logWhatsAppVerbose(params.verbose, message)
	});
	const conversationId = params.group ? params.remoteJid : params.from;
	const accessSenderId = params.group ? params.senderE164 : params.from;
	const admissionSenderId = params.group ? params.senderE164 ?? params.senderJid ?? params.from : params.from;
	const access = await resolveWhatsAppIngressAccess({
		cfg: params.cfg,
		policy,
		isGroup: params.group,
		conversationId,
		senderId: accessSenderId,
		dmSenderId: params.from
	});
	const { senderAccess } = access;
	if (params.group && senderAccess.decision !== "allow") {
		if (senderAccess.reasonCode === "group_policy_disabled") logWhatsAppVerbose(params.verbose, "Blocked group message (groupPolicy: disabled)");
		else if (senderAccess.reasonCode === "group_policy_empty_allowlist") logWhatsAppVerbose(params.verbose, "Blocked group message (groupPolicy: allowlist, no groupAllowFrom)");
		else logWhatsAppVerbose(params.verbose, `Blocked group message from ${params.senderE164 ?? "unknown sender"} (groupPolicy: allowlist)`);
		return blockedInboundAccess(policy);
	}
	if (!params.group) {
		if (params.isFromMe && !policy.isSamePhone(params.from)) {
			logWhatsAppVerbose(params.verbose, "Skipping outbound DM (fromMe); no pairing reply needed.");
			return blockedInboundAccess(policy);
		}
		if (senderAccess.decision === "block" && senderAccess.reasonCode === "dm_policy_disabled") {
			logWhatsAppVerbose(params.verbose, "Blocked dm (dmPolicy: disabled)");
			return blockedInboundAccess(policy);
		}
		if (senderAccess.decision === "pairing" && !policy.isSamePhone(params.from)) {
			const candidate = params.from;
			if (suppressPairingReply) logWhatsAppVerbose(params.verbose, `Skipping pairing reply for historical DM from ${candidate}.`);
			else await createChannelPairingChallengeIssuer({
				channel: "whatsapp",
				upsertPairingRequest: async ({ id, meta }) => await upsertChannelPairingRequest({
					channel: "whatsapp",
					id,
					accountId: policy.account.accountId,
					meta
				})
			})({
				senderId: candidate,
				senderIdLine: `Your WhatsApp phone number: ${candidate}`,
				meta: { name: (params.pushName ?? "").trim() || void 0 },
				onCreated: () => {
					logWhatsAppVerbose(params.verbose, `whatsapp pairing request sender=${candidate} name=${params.pushName ?? "unknown"}`);
				},
				sendPairingReply: async (text) => {
					await params.sock.sendMessage(params.remoteJid, { text });
				},
				onReplyError: (err) => {
					logWhatsAppVerbose(params.verbose, `whatsapp pairing reply failed for ${candidate}: ${String(err)}`);
				}
			});
			return blockedInboundAccess(policy);
		}
		if (senderAccess.decision !== "allow") {
			logWhatsAppVerbose(params.verbose, `Blocked unauthorized sender ${params.from} (dmPolicy=${policy.dmPolicy})`);
			return blockedInboundAccess(policy);
		}
	}
	return {
		allowed: true,
		shouldMarkRead: true,
		isSelfChat: policy.isSelfChat,
		resolvedAccountId: policy.account.accountId,
		admission: buildWhatsAppInboundAdmission({
			policy,
			access,
			isGroup: params.group,
			conversationId,
			senderId: admissionSenderId
		})
	};
}
const testing = { resolveWhatsAppInboundPolicy };
//#endregion
export { resolveWhatsAppRuntimeGroupPolicy as a, requireWhatsAppInboundAdmission as c, resolveWhatsAppInboundPolicy as i, resolveWhatsAppGroupConversationId as l, testing as n, buildDeprecatedFlatWhatsAppInboundAdmission as o, resolveWhatsAppCommandAuthorized as r, requireAdmittedWhatsAppInboundMessage as s, checkInboundAccessControl as t };

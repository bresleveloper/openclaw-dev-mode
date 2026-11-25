const require_bot_framework_service_url = require("./bot-framework-service-url-CgVuKiIR.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-Dc_BnhPP.cjs");
const require_runtime = require("./runtime-CbKazLGv.cjs");
require("../runtime-api.cjs");
const require_delegated_state = require("./delegated-state-DhIHahf1.cjs");
const require_channel = require("./channel-BFWe4zic.cjs");
const require_presentation = require("./presentation-jgjPRHyN.cjs");
const require_thread_session = require("./thread-session-Cf8voqdj.cjs");
const require_channel_setup = require("./channel.setup-PrElmCN5.cjs");
const require_approval_card = require("./approval-card-CD5q0Nla.cjs");
const require_conversation_store_state = require("./conversation-store-state-DbFsmAq5.cjs");
const require_reaction_types = require("./reaction-types-D_vaAiwA.cjs");
let openclaw_plugin_sdk_channel_outbound = require("openclaw/plugin-sdk/channel-outbound");
let openclaw_plugin_sdk_interactive_runtime = require("openclaw/plugin-sdk/interactive-runtime");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_allow_from = require("openclaw/plugin-sdk/allow-from");
let openclaw_plugin_sdk_provider_http = require("openclaw/plugin-sdk/provider-http");
let openclaw_plugin_sdk_media_runtime = require("openclaw/plugin-sdk/media-runtime");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_ssrf_policy = require("openclaw/plugin-sdk/ssrf-policy");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_text_utility_runtime = require("openclaw/plugin-sdk/text-utility-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let node_util = require("node:util");
let openclaw_plugin_sdk_node_crypto_runtime = require("openclaw/plugin-sdk/node-crypto-runtime");
let openclaw_plugin_sdk_webhook_targets = require("openclaw/plugin-sdk/webhook-targets");
let openclaw_plugin_sdk_channel_inbound = require("openclaw/plugin-sdk/channel-inbound");
let node_dns_promises = require("node:dns/promises");
let openclaw_plugin_sdk_collection_runtime = require("openclaw/plugin-sdk/collection-runtime");
let openclaw_plugin_sdk_gateway_runtime = require("openclaw/plugin-sdk/gateway-runtime");
let openclaw_plugin_sdk_security_runtime = require("openclaw/plugin-sdk/security-runtime");
let openclaw_plugin_sdk_agent_control_runtime = require("openclaw/plugin-sdk/agent-control-runtime");
let openclaw_plugin_sdk_approval_gateway_runtime = require("openclaw/plugin-sdk/approval-gateway-runtime");
let openclaw_plugin_sdk_channel_ingress_runtime = require("openclaw/plugin-sdk/channel-ingress-runtime");
let openclaw_plugin_sdk_context_visibility_runtime = require("openclaw/plugin-sdk/context-visibility-runtime");
let openclaw_plugin_sdk_reply_history = require("openclaw/plugin-sdk/reply-history");
let openclaw_plugin_sdk_runtime_config_snapshot = require("openclaw/plugin-sdk/runtime-config-snapshot");
let openclaw_plugin_sdk_agent_runtime = require("openclaw/plugin-sdk/agent-runtime");
let openclaw_plugin_sdk_extension_shared = require("openclaw/plugin-sdk/extension-shared");
let openclaw_plugin_sdk_plugin_runtime = require("openclaw/plugin-sdk/plugin-runtime");
let openclaw_plugin_sdk_request_url = require("openclaw/plugin-sdk/request-url");
let openclaw_plugin_sdk_time_runtime = require("openclaw/plugin-sdk/time-runtime");
let openclaw_plugin_sdk_channel_pairing = require("openclaw/plugin-sdk/channel-pairing");
let openclaw_plugin_sdk_runtime_group_policy = require("openclaw/plugin-sdk/runtime-group-policy");
let openclaw_plugin_sdk_dangerous_name_runtime = require("openclaw/plugin-sdk/dangerous-name-runtime");
let openclaw_plugin_sdk_account_helpers = require("openclaw/plugin-sdk/account-helpers");
let openclaw_plugin_sdk_webhook_ingress = require("openclaw/plugin-sdk/webhook-ingress");
// extensions/msteams/src/adaptive-card-submit.ts
function extractAdaptiveCardSubmittedData(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return value;
	const action = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.action) ? value.action : void 0;
	if (action && (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(action.type) === "action.submit" && "data" in action) return action.data;
	return value;
}
function readMSTeamsImBackValue(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return null;
	const msteams = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.msteams) ? value.msteams : void 0;
	if (!msteams || (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(msteams.type) !== "imback") return null;
	return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(msteams.value) ?? null;
}
function serializeMSTeamsAdaptiveCardActionValue(value) {
	const submittedValue = extractAdaptiveCardSubmittedData(value);
	if (typeof submittedValue === "string") {
		const trimmed = submittedValue.trim();
		return trimmed ? trimmed : null;
	}
	const agentText = (0, openclaw_plugin_sdk_agent_control_runtime.agentControlText)((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(submittedValue) ? submittedValue.value : void 0);
	if (agentText) return agentText;
	const imBackValue = readMSTeamsImBackValue(submittedValue);
	if (imBackValue) return imBackValue;
	if (submittedValue == null) return null;
	try {
		return JSON.stringify(submittedValue);
	} catch {
		return null;
	}
}
// extensions/msteams/src/approval-card-submit.ts
function isMSTeamsApprovalSubmit(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return false;
	if (value.openclawAction === "approval") return true;
	const data = ((0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.action) ? value.action : void 0)?.data;
	return (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(data) && data.openclawAction === "approval";
}
async function maybeHandleMSTeamsApprovalCardSubmit(params) {
	const { context, deps } = params;
	if (!isMSTeamsApprovalSubmit(context.activity.value)) return false;
	const ignored = (reason) => deps.log.info("msteams approval ignored", { reason });
	const token = require_approval_card.readMSTeamsApprovalActionToken(context.activity.value);
	if (!token) {
		ignored("missing card token");
		return true;
	}
	const binding = require_approval_card.msTeamsApprovalControls.get(token);
	if (!binding) {
		ignored("unknown or expired card token");
		return true;
	}
	if ((0, openclaw_plugin_sdk_account_id.normalizeAccountId)(binding.accountId) !== (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(deps.accountId)) {
		ignored("card token account mismatch");
		return true;
	}
	if (require_resolve_allowlist.normalizeMSTeamsConversationId(context.activity.conversation?.id ?? "") !== require_resolve_allowlist.normalizeMSTeamsConversationId(binding.conversationId)) {
		ignored("card token conversation mismatch");
		return true;
	}
	if (context.activity.replyToId && context.activity.replyToId !== binding.activityId) {
		ignored("card token activity mismatch");
		return true;
	}
	if (!binding.allowedDecisions.includes(binding.decision)) {
		ignored("card token decision is no longer allowed");
		return true;
	}
	const cfg = deps.readConfig?.() ?? deps.cfg;
	const account = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, binding.accountId);
	if (account.appId && account.appId !== deps.appId) {
		ignored("issuing account is no longer active");
		return true;
	}
	const senderId = context.activity.from?.aadObjectId;
	if (!(require_thread_session.msTeamsApprovalAuth.authorizeActorAction?.({
		cfg,
		accountId: binding.accountId,
		senderId,
		action: "approve",
		approvalKind: binding.approvalKind
	}))?.authorized) {
		ignored(`unauthorized actor ${senderId || "unknown"}`);
		return true;
	}
	const outcome = await require_approval_card.msTeamsApprovalControls.settle(token, async (consumed) => {
		const result = await (0, openclaw_plugin_sdk_approval_gateway_runtime.resolveApprovalOverGateway)({
			cfg,
			approvalId: consumed.approvalId,
			approvalKind: consumed.approvalKind,
			decision: consumed.decision,
			channel: "msteams",
			accountId: consumed.accountId,
			senderId
		});
		await context.updateActivity({
			...require_conversation_store_state.buildMSTeamsAdaptiveCardActivity(require_approval_card.buildMSTeamsCanonicalApprovalTerminalCard(result)),
			id: consumed.activityId
		});
		return result;
	});
	if (outcome.kind !== "settled") {
		ignored(outcome.kind === "missing" ? "card token already consumed" : outcome.kind === "in-flight" ? "card token resolve already in flight" : `approval expired or no longer exists id=${outcome.binding.approvalId}`);
		return true;
	}
	const { binding: consumed, result } = outcome;
	deps.log.info("msteams approval resolved", {
		approvalId: consumed.approvalId,
		approvalKind: consumed.approvalKind,
		applied: result.applied,
		status: result.approval.status,
		senderId
	});
	return true;
}
// extensions/msteams/src/monitor-handler/access.ts
const msteamsIngressIdentity = {
	key: "sender-id",
	authentication: "asserted",
	normalize: normalizeIngressValue,
	aliases: [{
		key: "sender-name",
		kind: "plugin:msteams-sender-name",
		normalizeEntry: normalizeSenderNameIngressValue,
		normalizeSubject: normalizeSenderNameIngressValue,
		authentication: "mutable"
	}, {
		key: "conversation-id",
		kind: "plugin:msteams-conversation-id",
		authentication: "asserted",
		normalizeEntry: normalizeAllowlistConversationId,
		normalizeSubject: normalizeAllowlistConversationId
	}],
	isWildcardEntry: (entry) => normalizeIngressValue(entry) === "*",
	resolveEntryId: ({ entryIndex, fieldKey }) => `msteams-entry-${entryIndex + 1}:${fieldKey === "sender-name" ? "name" : fieldKey === "conversation-id" ? "conversation-id" : "id"}`
};
function normalizeIngressValue(value) {
	return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(value) ?? null;
}
function normalizeSenderNameIngressValue(value) {
	const normalized = normalizeIngressValue(value);
	if (!normalized) return null;
	return require_resolve_allowlist.looksLikeMSTeamsConversationId(require_resolve_allowlist.normalizeMSTeamsConversationId(normalized)) ? null : normalized;
}
function normalizeAllowlistConversationId(value) {
	const trimmed = value?.trim();
	return trimmed ? require_resolve_allowlist.normalizeMSTeamsConversationId(trimmed) : null;
}
function formatMSTeamsSenderReason(params) {
	switch (params.reasonCode) {
		case "dm_policy_open": return "dmPolicy=open";
		case "dm_policy_disabled": return "dmPolicy=disabled";
		case "dm_policy_pairing_required": return "dmPolicy=pairing (not allowlisted)";
		case "dm_policy_allowlisted": return `dmPolicy=${params.dmPolicy ?? "allowlist"} (allowlisted)`;
		case "dm_policy_not_allowlisted": return `dmPolicy=${params.dmPolicy ?? "allowlist"} (not allowlisted)`;
		case "group_policy_disabled": return "groupPolicy=disabled";
		case "group_policy_empty_allowlist":
		case "route_sender_empty": return "groupPolicy=allowlist (empty allowlist)";
		case "group_policy_not_allowlisted": return "groupPolicy=allowlist (not allowlisted)";
		case "group_policy_open": return "groupPolicy=open";
		case "group_policy_allowed": return `groupPolicy=${params.groupPolicy ?? "allowlist"}`;
		default: return params.reasonCode;
	}
}
async function resolveMSTeamsSenderAccess(params) {
	const activity = params.activity;
	const accountId = params.accountId ?? openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID;
	const msteamsCfg = params.cfg.channels?.msteams ? require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, accountId) : void 0;
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(activity.conversation?.id ?? "unknown");
	const convType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(activity.conversation?.conversationType);
	const isDirectMessage = convType === "personal" || !convType && !activity.conversation?.isGroup;
	const hasConflictingConversationScope = isDirectMessage && (activity.conversation?.isGroup === true || activity.channelData?.team !== void 0 || activity.channelData?.channel !== void 0);
	const senderId = activity.from?.aadObjectId ?? activity.from?.id ?? "unknown";
	const senderName = activity.from?.name ?? activity.from?.id ?? senderId;
	const core = require_runtime.getMSTeamsRuntime();
	const pairing = (0, openclaw_plugin_sdk_channel_pairing.createChannelPairingController)({
		core,
		channel: "msteams",
		accountId
	});
	const dmPolicy = msteamsCfg?.dmPolicy ?? "pairing";
	const configuredDmAllowFrom = msteamsCfg?.allowFrom ?? [];
	const groupAllowFrom = msteamsCfg?.groupAllowFrom;
	const defaultGroupPolicy = (0, openclaw_plugin_sdk_runtime_group_policy.resolveDefaultGroupPolicy)(params.cfg);
	const groupPolicy = !isDirectMessage && msteamsCfg ? msteamsCfg.groupPolicy ?? defaultGroupPolicy ?? "allowlist" : "disabled";
	const allowNameMatching = (0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(msteamsCfg);
	const channelGate = require_presentation.resolveMSTeamsRouteConfig({
		cfg: msteamsCfg,
		teamId: activity.channelData?.team?.id,
		teamName: activity.channelData?.team?.name,
		conversationId,
		channelName: activity.channelData?.channel?.name,
		allowNameMatching
	});
	const resolved = await core.channel.inbound.ingress.resolveStable({
		channelId: "msteams",
		accountId: pairing.accountId,
		identity: {
			...msteamsIngressIdentity,
			resolveParticipant: () => {
				const tenantId = activity.channelData?.tenant?.id ?? activity.conversation?.tenantId;
				const aadId = activity.from?.aadObjectId;
				if (tenantId && aadId) return {
					domain: `entra:${tenantId.toLowerCase()}`,
					idKind: "object-id",
					id: aadId.toLowerCase()
				};
				return msteamsCfg?.appId && activity.from?.id ? {
					domain: `bot:${msteamsCfg.appId.toLowerCase()}`,
					idKind: "channel-account-id",
					id: activity.from.id
				} : void 0;
			}
		},
		cfg: params.cfg,
		readStoreAllowFrom: pairing.readAllowFromStore,
		subject: {
			stableId: senderId,
			aliases: {
				"sender-name": senderName,
				...!isDirectMessage ? { "conversation-id": conversationId } : {}
			}
		},
		conversation: {
			kind: isDirectMessage ? "direct" : convType === "channel" ? "channel" : "group",
			id: conversationId,
			threadId: params.conversationThreadId
		},
		...params.contextBinding ? { contextBinding: params.contextBinding } : {},
		route: (0, openclaw_plugin_sdk_channel_ingress_runtime.channelIngressRoutes)(!isDirectMessage && channelGate.allowlistConfigured && {
			id: "msteams:team-channel",
			kind: "nestedAllowlist",
			allowed: channelGate.allowed,
			precedence: 0,
			matchId: "msteams-route",
			...channelGate.allowed && groupPolicy === "allowlist" ? {
				senderPolicy: "deny-when-empty",
				senderAllowFromSource: "effective-group"
			} : {}
		}),
		dmPolicy,
		groupPolicy,
		policy: {
			groupAllowFromFallbackToAllowFrom: true,
			mutableIdentifierMatching: allowNameMatching ? "enabled" : "disabled"
		},
		allowFrom: configuredDmAllowFrom,
		groupAllowFrom,
		command: {
			allowTextCommands: true,
			hasControlCommand: params.hasControlCommand === true,
			directGroupAllowFrom: isDirectMessage ? "effective" : "none"
		}
	});
	return {
		...resolved,
		channelIngress: resolved,
		pairing,
		isDirectMessage,
		hasConflictingConversationScope,
		conversationId,
		senderId,
		senderName,
		msteamsCfg,
		dmPolicy,
		channelGate,
		allowNameMatching,
		groupPolicy
	};
}
async function admitMSTeamsMessage(params) {
	const core = require_runtime.getMSTeamsRuntime();
	const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
		cfg: params.cfg,
		surface: "msteams"
	});
	const isControlCommand = allowTextCommands && core.channel.commands.isControlCommandMessage(params.text, params.cfg);
	const access = await resolveMSTeamsSenderAccess({
		cfg: params.cfg,
		accountId: params.accountId,
		activity: params.activity,
		hasControlCommand: isControlCommand
	});
	const { dmPolicy, senderId, senderName, pairing, isDirectMessage, hasConflictingConversationScope, channelGate, senderAccess, commandAccess, allowNameMatching, groupPolicy, msteamsCfg } = access;
	const effectiveDmAllowFrom = senderAccess.effectiveAllowFrom;
	const effectiveGroupAllowFrom = senderAccess.effectiveGroupAllowFrom;
	const saveConversationReference = () => params.conversationStore.upsert(params.conversationId, params.conversationRef).catch((err) => {
		params.log.debug?.("failed to save conversation reference", { error: require_channel_setup.formatUnknownError(err) });
	});
	const dropGroupMessage = (reason, details) => {
		params.log.info(reason, details);
		params.log.debug?.(reason, details);
		return null;
	};
	if (hasConflictingConversationScope) {
		params.log.info("dropping message (conflicting conversation scope)", { conversationId: params.conversationId });
		params.log.debug?.("dropping message (conflicting conversation scope)");
		return null;
	}
	if (isDirectMessage && msteamsCfg && senderAccess.decision !== "allow") {
		if (senderAccess.reasonCode === "dm_policy_disabled") {
			params.log.info("dropping dm (dms disabled)", {
				sender: senderId,
				label: senderName
			});
			params.log.debug?.("dropping dm (dms disabled)");
			return null;
		}
		const allowMatch = (0, openclaw_plugin_sdk_allow_from.resolveAllowlistMatchSimple)({
			allowFrom: effectiveDmAllowFrom,
			senderId,
			senderName,
			allowNameMatching
		});
		if (senderAccess.decision === "pairing") {
			saveConversationReference();
			if (await pairing.upsertPairingRequest({
				id: senderId,
				meta: { name: senderName }
			})) params.log.info("msteams pairing request created", {
				sender: senderId,
				label: senderName
			});
		}
		params.log.debug?.("dropping dm (not allowlisted)", {
			sender: senderId,
			label: senderName,
			allowlistMatch: (0, openclaw_plugin_sdk_allow_from.formatAllowlistMatchMeta)(allowMatch)
		});
		params.log.info("dropping dm (not allowlisted)", {
			sender: senderId,
			label: senderName,
			dmPolicy,
			reason: formatMSTeamsSenderReason({
				reasonCode: senderAccess.reasonCode,
				dmPolicy,
				groupPolicy
			}),
			allowlistMatch: (0, openclaw_plugin_sdk_allow_from.formatAllowlistMatchMeta)(allowMatch)
		});
		return null;
	}
	if (!isDirectMessage && msteamsCfg) {
		if (channelGate.allowlistConfigured && !channelGate.allowed) return dropGroupMessage("dropping group message (not in team/channel allowlist)", {
			conversationId: params.conversationId,
			teamKey: channelGate.teamKey ?? "none",
			channelKey: channelGate.channelKey ?? "none",
			channelMatchKey: channelGate.channelMatchKey ?? "none",
			channelMatchSource: channelGate.channelMatchSource ?? "none"
		});
		if (!senderAccess.allowed && senderAccess.reasonCode === "group_policy_disabled") return dropGroupMessage("dropping group message (groupPolicy: disabled)", { conversationId: params.conversationId });
		if (!senderAccess.allowed && (senderAccess.reasonCode === "group_policy_empty_allowlist" || senderAccess.reasonCode === "route_sender_empty")) return dropGroupMessage("dropping group message (groupPolicy: allowlist, no allowlist)", { conversationId: params.conversationId });
		if (!senderAccess.allowed) {
			const allowMatch = (0, openclaw_plugin_sdk_allow_from.resolveAllowlistMatchSimple)({
				allowFrom: effectiveGroupAllowFrom,
				senderId,
				senderName,
				allowNameMatching
			});
			params.log.debug?.("dropping group message (not in groupAllowFrom)", {
				sender: senderId,
				label: senderName,
				allowlistMatch: (0, openclaw_plugin_sdk_allow_from.formatAllowlistMatchMeta)(allowMatch)
			});
			params.log.info("dropping group message (not in groupAllowFrom)", {
				sender: senderId,
				label: senderName,
				allowlistMatch: (0, openclaw_plugin_sdk_allow_from.formatAllowlistMatchMeta)(allowMatch)
			});
			return null;
		}
	}
	if (commandAccess.shouldBlockControlCommand) {
		(0, openclaw_plugin_sdk_channel_inbound.logInboundDrop)({
			log: params.logVerboseMessage,
			channel: "msteams",
			reason: "control command (unauthorized)",
			target: senderId
		});
		return null;
	}
	saveConversationReference();
	return {
		...access,
		allowTextCommands,
		isControlCommand,
		commandAuthorized: commandAccess.requested ? commandAccess.authorized : void 0,
		effectiveGroupAllowFrom,
		isChannel: params.isChannel
	};
}
// extensions/msteams/src/attachments/html.ts
function collectHtmlAttachmentIds(html, ids) {
	for (const value of require_resolve_allowlist.htmlTagAttributeValues(html, "attachment", "id")) {
		const id = value.trim();
		if (id) ids.add(id);
	}
}
/**
* Extract every `<attachment id="...">` reference from the HTML attachments in
* the inbound activity. Returns the complete (non-sliced) list; callers that
* need a capped diagnostic summary can truncate after calling this helper.
*/
function extractMSTeamsHtmlAttachmentIds(attachments) {
	const list = attachments ?? [];
	const ids = /* @__PURE__ */ new Set();
	for (const att of list) {
		const html = require_resolve_allowlist.extractHtmlFromAttachment(att);
		if (!html) continue;
		collectHtmlAttachmentIds(html, ids);
	}
	return Array.from(ids);
}
function summarizeMSTeamsHtmlAttachments(attachments) {
	const list = attachments ?? [];
	let htmlAttachments = 0;
	let imgTags = 0;
	let dataImages = 0;
	let cidImages = 0;
	const srcHosts = /* @__PURE__ */ new Set();
	const attachmentIds = /* @__PURE__ */ new Set();
	for (const att of list) {
		const html = require_resolve_allowlist.extractHtmlFromAttachment(att);
		if (!html) continue;
		htmlAttachments += 1;
		for (const value of require_resolve_allowlist.htmlTagAttributeValues(html, "img", "src")) {
			imgTags += 1;
			const src = value.trim();
			if (src) {
				if (src.startsWith("data:")) dataImages += 1;
				else if (src.startsWith("cid:")) cidImages += 1;
				else srcHosts.add(require_resolve_allowlist.safeHostForUrl(src));
			}
		}
		collectHtmlAttachmentIds(html, attachmentIds);
	}
	if (htmlAttachments === 0) return;
	return {
		htmlAttachments,
		imgTags,
		dataImages,
		cidImages,
		srcHosts: Array.from(srcHosts).slice(0, 5),
		attachmentIds: Array.from(attachmentIds).slice(0, 5)
	};
}
function resolveUnrepresentedHtmlAttachmentIds(attachments) {
	const representedIds = /* @__PURE__ */ new Set();
	for (const attachment of attachments) {
		if ((require_resolve_allowlist.normalizeContentType(attachment.contentType) ?? "").startsWith("text/html")) continue;
		const id = attachment.id?.trim();
		if (id) representedIds.add(id);
	}
	return extractMSTeamsHtmlAttachmentIds(attachments).filter((id) => !representedIds.has(id));
}
function createAdvertisedMediaFact(kind, sourceId) {
	return {
		kind,
		...sourceId ? { sourceId } : {}
	};
}
function resolveMSTeamsAdvertisedMedia(attachments) {
	const list = attachments ?? [];
	const fileAttachments = list.filter(require_resolve_allowlist.isAdvertisedFileAttachment);
	const inlineMedia = require_resolve_allowlist.extractInlineImageReferences(list).map((candidate) => createAdvertisedMediaFact("image", candidate.sourceId));
	const htmlAttachmentIds = resolveUnrepresentedHtmlAttachmentIds(list);
	return [
		...fileAttachments.map((attachment) => createAdvertisedMediaFact(require_resolve_allowlist.isLikelyImageAttachment(attachment) ? "image" : require_resolve_allowlist.resolveMSTeamsMediaKind({
			contentType: require_resolve_allowlist.normalizeContentType(attachment.contentType),
			fileName: attachment.name ?? void 0
		}), attachment.id?.trim() || void 0)),
		...inlineMedia,
		...htmlAttachmentIds.map((sourceId) => createAdvertisedMediaFact("document", sourceId))
	];
}
// extensions/msteams/src/monitor-handler/inbound-facts.ts
function extractTextFromHtmlAttachments(attachments, activity) {
	for (const attachment of attachments) {
		const raw = require_resolve_allowlist.extractHtmlFromAttachment(attachment);
		if (!raw) continue;
		const text = require_resolve_allowlist.htmlToPlainText(require_resolve_allowlist.normalizeMSTeamsMentionTags(require_resolve_allowlist.replaceTeamsEmojiSpriteImagesWithAltText(raw), activity, { preserveHtml: true }).replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis, "$2 $1"));
		if (text) return text;
	}
	return "";
}
async function prepareMSTeamsDebounceEntry(params) {
	const activity = params.context.activity;
	const attachments = Array.isArray(activity.attachments) ? activity.attachments : [];
	const rawText = activity.text?.trim() ?? "";
	const text = rawText ? require_resolve_allowlist.normalizeMSTeamsMentionTags(rawText, activity) : extractTextFromHtmlAttachments(attachments, activity) || require_resolve_allowlist.stripMSTeamsMentionTags(serializeMSTeamsAdaptiveCardActionValue(activity.value) || "");
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
	const replyToId = activity.replyToId;
	const implicitMentionKinds = conversationId && replyToId && await require_conversation_store_state.wasMSTeamsMessageSentWithPersistence({
		conversationId,
		messageId: replyToId,
		accountId: params.accountId
	}) ? ["reply_to_bot"] : [];
	return {
		context: params.context,
		rawText,
		text,
		attachments,
		wasMentioned: require_resolve_allowlist.wasMSTeamsBotMentioned(activity),
		implicitMentionKinds,
		turnAdoptionLifecycle: params.turnAdoptionLifecycle
	};
}
/** Proactive sends replay this reference, so every inbound owner stores the same shape. */
function buildMSTeamsConversationReference(activity, threadId) {
	const conversation = activity.conversation;
	const from = activity.from;
	const clientInfo = activity.entities?.find((entity) => entity.type === "clientInfo");
	const tenantId = activity.channelData?.tenant?.id ?? conversation?.tenantId;
	const aadObjectId = from?.aadObjectId;
	const serviceUrl = require_bot_framework_service_url.tryNormalizeBotFrameworkServiceUrl(activity.serviceUrl);
	return {
		activityId: activity.id,
		user: from ? {
			id: from.id,
			name: from.name,
			aadObjectId: from.aadObjectId
		} : void 0,
		agent: activity.recipient,
		conversation: {
			id: require_resolve_allowlist.normalizeMSTeamsConversationId(conversation?.id ?? ""),
			conversationType: conversation?.conversationType ?? "personal",
			tenantId
		},
		...tenantId ? { tenantId } : {},
		...aadObjectId ? { aadObjectId } : {},
		teamId: activity.channelData?.team?.id,
		channelId: activity.channelId,
		...serviceUrl ? { serviceUrl } : {},
		locale: activity.locale,
		...clientInfo?.timezone ? { timezone: clientInfo.timezone } : {},
		...threadId ? { threadId } : {}
	};
}
function assembleMSTeamsInboundFacts(entry) {
	const activity = entry.context.activity;
	const conversation = activity.conversation;
	const rawConversationId = conversation?.id ?? "";
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawConversationId);
	const conversationMessageId = require_resolve_allowlist.extractMSTeamsConversationMessageId(rawConversationId);
	const conversationType = conversation?.conversationType ?? "personal";
	const isChannel = conversationType === "channel";
	const teamId = activity.channelData?.team?.id;
	const threadId = isChannel ? conversationMessageId ?? activity.replyToId : void 0;
	const advertisedMedia = resolveMSTeamsAdvertisedMedia(entry.attachments);
	const conversationRef = buildMSTeamsConversationReference(activity, threadId);
	return {
		...entry,
		activity,
		from: activity.from,
		conversation,
		rawBody: entry.text,
		advertisedMedia,
		quoteInfo: require_resolve_allowlist.extractMSTeamsQuoteInfo(entry.attachments),
		htmlSummary: summarizeMSTeamsHtmlAttachments(entry.attachments),
		conversationId,
		conversationMessageId,
		conversationType,
		isChannel,
		teamId,
		graphChannelId: activity.channelData?.channel?.id?.trim() || conversationId,
		threadId,
		historyKey: threadId ? `${conversationId}:thread:${threadId}` : conversationId,
		conversationRef
	};
}
// src/channels/mention-gating.ts
function resolveBotThreadMentionPolicy(params) {
	if (!params.isBotOwnedThread || params.requireMentionInBotThreads === void 0) return {
		requireMention: params.requireMention,
		implicitMentionKinds: params.implicitMentionKinds
	};
	return {
		requireMention: params.requireMentionInBotThreads,
		implicitMentionKinds: params.requireMentionInBotThreads ? params.implicitMentionKinds?.filter((kind) => kind === "native") : params.implicitMentionKinds
	};
}
// extensions/msteams/src/informative-status.ts
const INFORMATIVE_MAX_CHARS = 1e3;
const INFORMATIVE_MAX_BYTES = 1024;
const ELLIPSIS = "…";
const segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
const utf8 = new TextEncoder();
function flattenInformativeStatus(text) {
	const joined = text.split("\n").map((line) => line.trim().replace(/^[•-]\s+/u, "")).filter(Boolean).join(" · ");
	if (joined.length <= INFORMATIVE_MAX_CHARS && utf8.encode(joined).length <= INFORMATIVE_MAX_BYTES) return joined;
	const graphemes = Array.from(segmenter.segment(joined), (s) => s.segment);
	let chars = 1;
	let bytes = utf8.encode(ELLIPSIS).length;
	let start = graphemes.length;
	while (start > 0) {
		const next = graphemes[start - 1];
		const nextBytes = utf8.encode(next).length;
		if (chars + next.length > INFORMATIVE_MAX_CHARS || bytes + nextBytes > INFORMATIVE_MAX_BYTES) break;
		chars += next.length;
		bytes += nextBytes;
		start -= 1;
	}
	return ELLIPSIS + graphemes.slice(start).join("");
}
// extensions/msteams/src/reply-stream-controller.ts
function hasUnstreamedContent(payload) {
	return Boolean(payload.presentation || payload.mediaUrl || payload.mediaUrls?.length);
}
/** Bridge reply callbacks to the SDK stream; shared conversations use block delivery. */
function createTeamsReplyStreamController(params) {
	const isPersonal = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationType) === "personal";
	const streamMode = (0, openclaw_plugin_sdk_channel_outbound.resolveChannelPreviewStreamMode)(params.msteamsConfig, "partial");
	const stream = params.allowProviderPreview && isPersonal && (streamMode === "partial" || streamMode === "progress") ? params.context.stream : void 0;
	let tokensEmitted = false;
	let nativeDispatchStarted = false;
	let nativeDeliveryClaimed = false;
	let streamFinalizationPending = false;
	let pendingFinalPayload;
	let emittedText = "";
	let acknowledgedText = "";
	let acknowledgedLogicalText = "";
	let acknowledgedStreamId;
	let replacementFinalPending = false;
	let replacementSettlementPending = false;
	let replacementTextAwaitingAcknowledgement;
	let deferredReplacementEntries = [];
	let queuedFinalActivity;
	const streamEvents = stream?.events;
	let streamChunkSubscription;
	if (typeof streamEvents?.on === "function" && typeof streamEvents.off === "function") streamChunkSubscription = streamEvents.on("chunk", (activity) => {
		const replacementAcknowledgementPending = replacementTextAwaitingAcknowledgement !== void 0;
		const replacementAcknowledgement = typeof activity.text === "string" && replacementAcknowledgementPending && activity.text === replacementTextAwaitingAcknowledgement?.text;
		if (activity.type !== "typing" || activity.channelData?.streamType !== "streaming" || !activity.id || !activity.text || acknowledgedStreamId !== void 0 && activity.id !== acknowledgedStreamId || (replacementAcknowledgementPending ? !replacementAcknowledgement : !activity.text.startsWith(acknowledgedText)) || !replacementAcknowledgement && !emittedText.startsWith(activity.text)) return;
		acknowledgedStreamId = activity.id;
		acknowledgedText = activity.text;
		acknowledgedLogicalText = replacementAcknowledgement ? replacementTextAwaitingAcknowledgement.logicalText : activity.text;
		if (replacementAcknowledgement) replacementTextAwaitingAcknowledgement = void 0;
	});
	const wasCanceled = () => Boolean(stream?.canceled);
	const releaseStreamChunkSubscription = () => {
		if (streamChunkSubscription === void 0) return;
		streamEvents?.off(streamChunkSubscription);
		streamChunkSubscription = void 0;
	};
	const acknowledgedNativeDelivery = () => {
		if (!acknowledgedStreamId || !acknowledgedText) return { visibleReplySent: false };
		return {
			visibleReplySent: true,
			content: acknowledgedText,
			messageId: acknowledgedStreamId
		};
	};
	const fallbackPayloadAfterAcknowledgedText = (payload) => {
		if (!acknowledgedLogicalText || typeof payload.text !== "string" || !payload.text.startsWith(acknowledgedLogicalText)) return payload;
		const remainingText = payload.text.slice(acknowledgedLogicalText.length);
		if (!remainingText && !hasUnstreamedContent(payload)) return;
		return {
			...payload,
			text: remainingText || void 0
		};
	};
	const fallbackPayloadForSuppressedFinal = (payload) => {
		return Boolean(payload.mediaUrl || payload.mediaUrls?.length) ? {
			...payload,
			mediaUrl: void 0,
			mediaUrls: void 0
		} : payload;
	};
	const finalStreamActivity = (text) => ({
		...require_conversation_store_state.buildMSTeamsMessageActivity(text === void 0 ? void 0 : require_conversation_store_state.formatMSTeamsMarkdown(text, params.tableMode ?? "code")),
		channelData: params.feedbackLoopEnabled ? { feedbackLoopEnabled: true } : {}
	});
	const queueFinalReplacement = (activeStream, text) => {
		const activity = finalStreamActivity(text);
		replacementTextAwaitingAcknowledgement = {
			text: activity.text,
			logicalText: text
		};
		activeStream.emit(activity);
		queuedFinalActivity = activity;
		emittedText = text;
	};
	const deferredReplacementLogicalContent = () => {
		return deferredReplacementEntries.map((entry) => entry.payload.text).filter((text) => Boolean(text)).join("\n") || void 0;
	};
	const deferredReplacementPayloads = (replacementFallback) => deferredReplacementEntries.flatMap((entry) => {
		if (entry.kind === "payload") return [entry.payload];
		const text = replacementFallback?.text;
		if (!text && !hasUnstreamedContent(entry.payload)) return [];
		return [{
			...entry.payload,
			text: text || void 0
		}];
	});
	const finalizeWithoutReceipt = (logicalContent, canceled = false) => {
		const fallback = pendingFinalPayload && !canceled ? fallbackPayloadAfterAcknowledgedText(pendingFinalPayload) : void 0;
		const postNativePayloads = replacementSettlementPending && !canceled ? deferredReplacementPayloads(fallback) : [];
		return {
			...acknowledgedNativeDelivery(),
			...!canceled && logicalContent ? { logicalContent } : {},
			...!replacementSettlementPending && fallback ? { fallbackPayload: fallback } : {},
			...postNativePayloads.length > 0 ? { postNativePayloads } : {}
		};
	};
	const progressDraft = (0, openclaw_plugin_sdk_channel_outbound.createChannelProgressDraftCompositor)({
		preparedItems: true,
		formatPlainText: (text) => text,
		entry: params.msteamsConfig,
		mode: streamMode,
		active: Boolean(stream) && streamMode === "progress",
		seed: params.progressSeed ?? "msteams",
		update: (text) => {
			if (!stream || wasCanceled() || streamFinalizationPending) return false;
			stream.update(flattenInformativeStatus(text));
			return true;
		}
	});
	return {
		onPartialReply(payload) {
			if (!stream || !payload.text || wasCanceled() || streamMode !== "partial") return;
			if (replacementSettlementPending && replacementFinalPending) {
				pendingFinalPayload = { text: payload.text };
				return;
			}
			if (streamFinalizationPending || nativeDeliveryClaimed) return;
			const fullText = payload.text;
			let prefixLength = 0;
			while (prefixLength < emittedText.length && prefixLength < fullText.length && emittedText[prefixLength] === fullText[prefixLength]) prefixLength += 1;
			const previousRemainder = emittedText.slice(prefixLength);
			const delta = fullText.slice(prefixLength);
			if (!delta) return;
			if (previousRemainder.trim()) {
				stream.clearText();
				replacementFinalPending = true;
				replacementSettlementPending = true;
				pendingFinalPayload = { text: fullText };
				streamFinalizationPending = true;
				return;
			}
			stream.emit(delta);
			emittedText = fullText;
			tokensEmitted = true;
			nativeDispatchStarted = true;
		},
		pushItemEvent: progressDraft.pushItemEvent.bind(progressDraft),
		pushToolEvent: progressDraft.pushToolEvent,
		pushReasoningProgress: progressDraft.pushReasoningProgress.bind(progressDraft),
		resetReasoningProgress: progressDraft.resetReasoningProgress,
		pushApprovalEvent: progressDraft.pushApprovalEvent.bind(progressDraft),
		pushPlanProgress: progressDraft.pushPlanProgress.bind(progressDraft),
		preparePayload(payload) {
			if (!stream) return payload;
			if (wasCanceled()) return;
			if (payload.text) progressDraft.markFinalReplyStarted();
			if (replacementSettlementPending) {
				if (!replacementFinalPending || !payload.text) {
					deferredReplacementEntries.push({
						kind: "payload",
						payload
					});
					return;
				}
				replacementFinalPending = false;
				deferredReplacementEntries.push({
					kind: "replacement",
					payload
				});
				pendingFinalPayload = fallbackPayloadForSuppressedFinal(payload);
				queueFinalReplacement(stream, payload.text);
				tokensEmitted = false;
				return;
			}
			if (streamMode === "progress" && payload.text && !nativeDispatchStarted) {
				queueFinalReplacement(stream, payload.text);
				nativeDispatchStarted = true;
				tokensEmitted = true;
			}
			if (tokensEmitted) {
				const hasMedia = Boolean(payload.mediaUrl || payload.mediaUrls?.length);
				pendingFinalPayload = fallbackPayloadForSuppressedFinal(payload);
				streamFinalizationPending = true;
				tokensEmitted = false;
				if (!hasMedia) return;
				const { presentation: _presentation, presentationTextMode: _mode, ...mediaPayload } = payload;
				return {
					...mediaPayload,
					text: void 0
				};
			}
			return payload;
		},
		claimNativeDelivery() {
			if (!nativeDispatchStarted || nativeDeliveryClaimed) return false;
			nativeDeliveryClaimed = true;
			return true;
		},
		async finalize() {
			progressDraft.markFinalReplyStarted();
			if (!stream || !nativeDispatchStarted) {
				releaseStreamChunkSubscription();
				return { visibleReplySent: false };
			}
			let logicalContent;
			try {
				if (wasCanceled() || !streamFinalizationPending) return acknowledgedNativeDelivery();
				if (replacementSettlementPending && replacementFinalPending && pendingFinalPayload?.text) {
					replacementFinalPending = false;
					deferredReplacementEntries.push({
						kind: "replacement",
						payload: pendingFinalPayload
					});
					logicalContent = deferredReplacementLogicalContent();
					queueFinalReplacement(stream, pendingFinalPayload.text);
				}
				logicalContent ??= replacementSettlementPending ? deferredReplacementLogicalContent() : void 0;
				const logicalText = pendingFinalPayload?.text ?? (emittedText || void 0);
				const finalActivity = queuedFinalActivity ?? finalStreamActivity(logicalText);
				const content = finalActivity.text;
				logicalContent ??= content !== logicalText ? logicalText : void 0;
				if (!queuedFinalActivity) {
					if (content !== void 0 && content !== emittedText) {
						stream.clearText();
						replacementTextAwaitingAcknowledgement = {
							text: content,
							logicalText
						};
						stream.emit(finalActivity);
					} else stream.emit({
						...finalActivity,
						text: void 0
					});
				}
				const result = await stream.close();
				if (!result) return finalizeWithoutReceipt(logicalContent, wasCanceled());
				const messageId = require_conversation_store_state.extractMessageId(result) ?? acknowledgedStreamId;
				const postNativePayloads = replacementSettlementPending ? deferredReplacementPayloads(void 0) : pendingFinalPayload?.presentation ? [{
					...pendingFinalPayload,
					text: void 0
				}] : [];
				return {
					visibleReplySent: true,
					...content === void 0 ? {} : { content },
					...logicalContent ? { logicalContent } : {},
					...messageId ? { messageId } : {},
					...postNativePayloads.length > 0 ? { postNativePayloads } : {}
				};
			} catch (err) {
				if (err instanceof Error && err.name === "StreamCancelledError") return acknowledgedNativeDelivery();
				params.log?.warn?.(`msteams stream finalize failed: ${(0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)}`);
				return finalizeWithoutReceipt(logicalContent);
			} finally {
				pendingFinalPayload = void 0;
				streamFinalizationPending = false;
				queuedFinalActivity = void 0;
				replacementFinalPending = false;
				replacementSettlementPending = false;
				replacementTextAwaitingAcknowledgement = void 0;
				deferredReplacementEntries = [];
				releaseStreamChunkSubscription();
			}
		},
		hasStream() {
			return Boolean(stream);
		},
		isStreamActive() {
			return Boolean(stream) && tokensEmitted && !wasCanceled();
		},
		wasCanceled
	};
}
// extensions/msteams/src/reply-dispatcher.ts
function createMSTeamsReplyDispatcher(params) {
	const core = require_runtime.getMSTeamsRuntime();
	const msteamsCfg = require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, params.accountId);
	const mediaMaxBytes = (0, openclaw_plugin_sdk_account_helpers.resolveChannelMediaMaxBytes)({
		cfg: params.cfg,
		resolveChannelLimitMb: () => msteamsCfg.mediaMaxMb
	});
	const feedbackLoopEnabled = msteamsCfg.feedbackEnabled !== false;
	const conversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationRef.conversation?.conversationType);
	const isTypingSupported = conversationType === "personal" || conversationType === "groupchat";
	const TYPING_KEEPALIVE_INTERVAL_MS = 8e3;
	const TYPING_KEEPALIVE_MAX_DURATION_MS = 6e5;
	const sendTypingIndicator = async () => {
		if (!isTypingSupported || streamController.isStreamActive() || streamController.wasCanceled()) return;
		await params.context.sendActivity({ type: "typing" });
	};
	const { onModelSelected, typingCallbacks, ...replyPipeline } = (0, openclaw_plugin_sdk_channel_outbound.createChannelMessageReplyPipeline)({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "msteams",
		accountId: params.accountId,
		typing: {
			start: sendTypingIndicator,
			keepaliveIntervalMs: TYPING_KEEPALIVE_INTERVAL_MS,
			maxDurationMs: TYPING_KEEPALIVE_MAX_DURATION_MS,
			onStartError: (err) => {
				(0, openclaw_plugin_sdk_channel_outbound.logTypingFailure)({
					log: (message) => params.log.debug?.(message),
					channel: "msteams",
					action: "start",
					error: err
				});
			}
		}
	});
	const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "msteams", params.accountId);
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "msteams",
		accountId: params.accountId
	});
	const hookRunner = (0, openclaw_plugin_sdk_plugin_runtime.getGlobalHookRunner)();
	const streamController = createTeamsReplyStreamController({
		tableMode,
		allowProviderPreview: !((hookRunner?.hasHooks("reply_payload_sending") ?? false) || (hookRunner?.hasHooks("message_sending") ?? false)),
		conversationType,
		context: params.context,
		feedbackLoopEnabled,
		log: params.log,
		msteamsConfig: msteamsCfg,
		progressSeed: `${params.accountId ?? "default"}:${params.conversationRef.conversation?.id ?? ""}`
	});
	const teamsStreamMode = (0, openclaw_plugin_sdk_channel_outbound.resolveChannelPreviewStreamMode)(msteamsCfg, "partial");
	const blockStreamingResolved = teamsStreamMode === "block" ? true : (0, openclaw_plugin_sdk_channel_outbound.resolveChannelStreamingBlockEnabled)(msteamsCfg);
	const blockStreamingEnabled = blockStreamingResolved ?? false;
	const typingIndicatorEnabled = typeof msteamsCfg?.typingIndicator === "boolean" ? msteamsCfg.typingIndicator : true;
	const pendingDeliveries = [];
	let pendingSettlement;
	const findPendingNativeDelivery = () => pendingDeliveries.find((candidate) => !candidate.nativeSettled);
	const queueDeliveryFailureSystemEvent = (failure) => {
		const classification = require_channel_setup.classifyMSTeamsSendError(failure.error);
		const errorText = require_channel_setup.formatUnknownError(failure.error);
		const failedAll = failure.failed >= failure.total;
		const ambiguous = classification.kind === "ambiguous";
		const sentences = [
			`Microsoft Teams delivery failed: ${ambiguous ? failedAll ? "the delivery outcome is unknown for the previous reply" : `the delivery outcome is unknown for ${failure.failed} of ${failure.total} message blocks` : failedAll ? "the previous reply was not delivered" : `${failure.failed} of ${failure.total} message blocks were not delivered`}.`,
			ambiguous ? void 0 : `The user may not have received ${failedAll ? "that reply" : "the full reply"}.`,
			`Error: ${errorText}.`,
			classification.statusCode != null ? `Status: ${classification.statusCode}.` : void 0,
			require_channel_setup.formatMSTeamsDeliveryFailureGuidance(classification)
		].filter(Boolean);
		core.system.enqueueSystemEvent(sentences.join(" "), {
			sessionKey: params.sessionKey,
			contextKey: `msteams:delivery-failure:${params.conversationRef.conversation?.id ?? "unknown"}`
		});
	};
	const renderReplyPayload = (payload) => {
		return require_conversation_store_state.renderReplyPayloadsToMessages([payload], {
			textChunkLimit: params.textLimit,
			tableMode,
			chunkMode
		});
	};
	const settlePendingDelivery = (delivery) => {
		if (delivery.settled || !delivery.blockSettled || !delivery.nativeSettled) return;
		delivery.settled = true;
		const acceptedParts = [...delivery.nativeResult ? [delivery.nativeResult] : [], ...delivery.blockResults];
		const messageIds = acceptedParts.flatMap((part) => part.messageIds);
		const content = delivery.errors.length > 0 ? acceptedParts.map((part) => part.content).filter(Boolean).join("\n") : delivery.content;
		const outcome = {
			visibleReplySent: acceptedParts.length > 0,
			...messageIds.length > 0 ? { messageIds } : {},
			...acceptedParts.length > 0 && content !== void 0 ? { content } : {}
		};
		if (delivery.errors.length === 0) {
			delivery.finalization.resolve(outcome);
			return;
		}
		const error = delivery.errors.find((candidate) => !(candidate instanceof openclaw_plugin_sdk_error_runtime.PlatformMessageNotDispatchedError)) ?? delivery.errors[0];
		delivery.finalization.reject(outcome.visibleReplySent ? (0, openclaw_plugin_sdk_channel_inbound.createChannelPartialDeliveryError)(error, {
			...outcome,
			visibleReplySent: true
		}) : error);
	};
	const flushPendingMessages = async () => {
		for (const delivery of pendingDeliveries) {
			if (delivery.blockSettled) continue;
			const toSend = delivery.messages.splice(0);
			const total = toSend.length;
			let failed = 0;
			let lastFailedError;
			const sentIds = [];
			for (const msg of toSend) try {
				const msgIds = await require_conversation_store_state.sendMSTeamsMessages({
					accountId: params.accountId,
					replyStyle: params.replyStyle,
					app: params.app,
					conversationRef: params.conversationRef,
					context: params.context,
					messages: [msg],
					onRetry: (event) => {
						params.log.debug?.("retrying send", {
							replyStyle: params.replyStyle,
							...event
						});
					},
					tokenProvider: params.tokenProvider,
					sharePointSiteId: params.sharePointSiteId,
					mediaMaxBytes,
					feedbackLoopEnabled,
					serviceUrlBoundary: require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg)
				});
				const validIds = msgIds.filter((id) => id.trim() && id !== "unknown");
				if (msgIds.length > 0) delivery.blockResults.push({
					messageIds: validIds,
					...msg.text ? { content: msg.text } : {}
				});
				sentIds.push(...validIds);
			} catch (msgError) {
				failed += 1;
				lastFailedError = msgError;
				delivery.errors.push(msgError);
				params.log.debug?.("individual message send failed, continuing with remaining blocks");
			}
			if (failed > 0) {
				const classification = require_channel_setup.classifyMSTeamsSendError(lastFailedError);
				const hint = require_channel_setup.formatMSTeamsSendErrorHint(classification);
				params.log.warn?.(`failed to deliver ${failed} of ${total} message blocks`, {
					failed,
					total,
					error: require_channel_setup.formatUnknownError(lastFailedError),
					classification,
					...hint ? { hint } : {}
				});
				queueDeliveryFailureSystemEvent({
					failed,
					total,
					error: lastFailedError
				});
			}
			delivery.blockSettled = true;
			settlePendingDelivery(delivery);
			if (sentIds.length > 0) try {
				params.onSentMessageIds?.(sentIds);
			} catch (error) {
				params.log.warn?.("failed to record sent Teams message ids", { error: require_channel_setup.formatUnknownError(error) });
			}
		}
	};
	const dispatcherOptions = {
		...replyPipeline,
		humanDelay: (0, openclaw_plugin_sdk_agent_runtime.resolveHumanDelayConfig)(params.cfg, params.agentId),
		onReplyStart: async () => {
			if (typingIndicatorEnabled) await typingCallbacks?.onReplyStart?.();
		},
		typingCallbacks
	};
	const delivery = {
		observeMessageSent: true,
		deliver: async (payload) => {
			if (pendingSettlement) await pendingSettlement;
			let resolvedPayload = payload;
			if (payload.presentation) {
				let nativePayload;
				const fallbackPayload = await (0, openclaw_plugin_sdk_interactive_runtime.renderPresentationForDelivery)({
					presentationCapabilities: require_presentation.MSTEAMS_PRESENTATION_CAPABILITIES,
					renderPresentation: (adapted) => {
						nativePayload = adapted;
						return adapted;
					}
				}, payload);
				resolvedPayload = nativePayload ?? fallbackPayload;
			}
			const preparedPayload = streamController.preparePayload(resolvedPayload);
			const native = streamController.claimNativeDelivery();
			if (preparedPayload && !native && findPendingNativeDelivery()) await settleDelivery();
			const messages = preparedPayload && !streamController.wasCanceled() ? renderReplyPayload(preparedPayload) : [];
			if (!native && messages.length === 0) return {
				visibleReplySent: false,
				suppression: { reason: "no_visible_result" }
			};
			const pending = {
				messages,
				finalization: (0, openclaw_plugin_sdk_extension_shared.createDeferred)(),
				content: payload.text,
				blockResults: [],
				nativeSettled: !native,
				blockSettled: messages.length === 0,
				settled: false,
				errors: []
			};
			pendingDeliveries.push(pending);
			if (blockStreamingEnabled) await flushPendingMessages();
			settlePendingDelivery(pending);
			return {
				visibleReplySent: false,
				finalization: pending.finalization.promise
			};
		},
		onError: (err, info) => {
			const errMsg = require_channel_setup.formatUnknownError(err);
			const classification = require_channel_setup.classifyMSTeamsSendError(err);
			const hint = require_channel_setup.formatMSTeamsSendErrorHint(classification);
			params.log.error("reply failed", {
				kind: info.kind,
				error: errMsg,
				classification,
				hint
			});
		}
	};
	const settleDelivery = () => pendingSettlement ??= Promise.resolve().then(async () => {
		await flushPendingMessages();
		const nativeDelivery = findPendingNativeDelivery();
		if (!nativeDelivery) {
			await streamController.finalize();
			return;
		}
		let nativeResult;
		try {
			nativeResult = await streamController.finalize();
		} catch (error) {
			nativeDelivery.errors.push(error);
			nativeDelivery.nativeSettled = true;
			settlePendingDelivery(nativeDelivery);
			return;
		}
		if (nativeResult.visibleReplySent) nativeDelivery.nativeResult = {
			messageIds: nativeResult.messageId ? [nativeResult.messageId] : [],
			...nativeResult.content !== void 0 ? { content: nativeResult.content } : {}
		};
		const hasPostNativePayloads = Boolean(nativeResult.postNativePayloads?.length);
		if (nativeResult.logicalContent !== void 0) nativeDelivery.content = nativeResult.logicalContent;
		else if (nativeResult.content !== void 0 && (!nativeResult.fallbackPayload && !hasPostNativePayloads || nativeDelivery.content === void 0)) nativeDelivery.content = nativeResult.content;
		const afterNativePayloads = [...nativeResult.fallbackPayload ? [nativeResult.fallbackPayload] : [], ...nativeResult.postNativePayloads ?? []];
		if (afterNativePayloads.length > 0) {
			nativeDelivery.messages.push(...afterNativePayloads.flatMap((payload) => renderReplyPayload(payload)));
			nativeDelivery.blockSettled = nativeDelivery.messages.length === 0;
		}
		nativeDelivery.nativeSettled = true;
		if (!nativeDelivery.blockSettled) await flushPendingMessages();
		settlePendingDelivery(nativeDelivery);
		if (nativeResult.messageId) try {
			params.onSentMessageIds?.([nativeResult.messageId]);
		} catch (error) {
			params.log.warn?.("failed to record sent Teams message id", { error: require_channel_setup.formatUnknownError(error) });
		}
	}).finally(() => {
		pendingSettlement = void 0;
	});
	const shouldSuppressDefaultToolProgressMessages = streamController.hasStream() && teamsStreamMode === "progress";
	const progressCallbacks = streamController.hasStream() ? {
		onReasoningStream: async (payload) => {
			await streamController.pushReasoningProgress(payload.text, { snapshot: payload.isReasoningSnapshot === true });
			return false;
		},
		onReasoningEnd: () => {
			streamController.resetReasoningProgress();
			return false;
		},
		onToolStart: streamController.pushToolEvent,
		onItemEvent: streamController.pushItemEvent,
		onPlanUpdate: async (payload) => {
			if (payload.phase !== "update") return false;
			await streamController.pushPlanProgress(payload.steps, payload);
			return false;
		},
		onApprovalEvent: async (payload) => {
			await streamController.pushApprovalEvent(payload);
			return false;
		}
	} : {};
	return {
		dispatcherOptions: {
			...dispatcherOptions,
			onSettled: settleDelivery
		},
		delivery,
		replyOptions: {
			progressPreambleEnabled: shouldSuppressDefaultToolProgressMessages,
			commentaryProgressEnabled: shouldSuppressDefaultToolProgressMessages,
			...streamController.hasStream() ? { onPartialReply: (payload) => {
				streamController.onPartialReply(payload);
				return false;
			} } : {},
			...progressCallbacks,
			...shouldSuppressDefaultToolProgressMessages ? { suppressDefaultToolProgressMessages: true } : {},
			disableBlockStreaming: blockStreamingResolved == null ? void 0 : !blockStreamingResolved,
			onModelSelected
		}
	};
}
// extensions/msteams/src/monitor-handler/config.ts
const allowlistInputs = (config) => [
	config.allowFrom,
	config.groupAllowFrom,
	config.teams,
	config.dangerouslyAllowNameMatching
];
function createMSTeamsHandlerConfigReader(deps) {
	const source = deps.accountPolicyCfg ?? deps.cfg;
	const read = (0, openclaw_plugin_sdk_runtime_config_snapshot.createRuntimeConfigReader)(source);
	const originallyConfigured = require_resolve_allowlist.listMSTeamsAccountIds(source).includes(deps.accountId);
	const startupInputs = deps.accountPolicyCfg && allowlistInputs(require_resolve_allowlist.resolveMSTeamsAccountConfig(source, deps.accountId));
	const startup = deps.cfg.channels?.msteams;
	const startupAllowlists = {
		allowFrom: startup?.allowFrom,
		groupAllowFrom: startup?.groupAllowFrom,
		teams: startup?.teams
	};
	let lastSource;
	let lastProjection = deps.cfg;
	return () => {
		const current = read();
		if (current === lastSource) return lastProjection;
		lastSource = current;
		if (current === source && deps.accountPolicyCfg) return lastProjection = deps.cfg;
		const retired = originallyConfigured && !require_resolve_allowlist.listMSTeamsAccountIds(current).includes(deps.accountId);
		const accountConfig = require_resolve_allowlist.resolveMSTeamsAccountConfig(current, deps.accountId);
		const keepStartup = current.channels?.msteams !== void 0 && (0, node_util.isDeepStrictEqual)(allowlistInputs(accountConfig), startupInputs);
		if (deps.accountId === "default" && !current.channels?.msteams?.accounts && !retired && !keepStartup) return lastProjection = current;
		return lastProjection = require_resolve_allowlist.withAccountScopedMSTeamsConfig({
			cfg: current,
			accountId: deps.accountId,
			accountConfig: {
				...accountConfig,
				...keepStartup ? startupAllowlists : {},
				...current.channels?.msteams?.enabled === false || retired ? { enabled: false } : {}
			}
		});
	};
}
// extensions/msteams/src/attachments/bot-framework.ts
const BOT_FRAMEWORK_SCOPE = "https://api.botframework.com";
/**
* Detect Bot Framework personal chat ("a:") and MSA orgid ("8:orgid:") conversation
* IDs. These identifiers are not recognized by Graph's `/chats/{id}` endpoint, so we
* must fetch media via the Bot Framework v3 attachments endpoint instead.
*
* Graph-compatible IDs start with `19:` and are left untouched by this detector.
*/
function isBotFrameworkPersonalChatId(conversationId) {
	if (typeof conversationId !== "string") return false;
	const trimmed = conversationId.trim();
	return trimmed.startsWith("a:") || trimmed.startsWith("8:orgid:");
}
async function fetchBotFrameworkAttachment(params, kind) {
	let response;
	try {
		const headers = require_resolve_allowlist.ensureUserAgentHeader();
		require_resolve_allowlist.applyAuthorizationHeaderForUrl({
			headers,
			url: params.url,
			authAllowHosts: params.policy.authAllowHosts,
			bearerToken: params.accessToken
		});
		response = await require_resolve_allowlist.safeFetchWithPolicy({
			url: params.url,
			policy: params.policy,
			resolveFn: node_dns_promises.lookup,
			requestInit: { headers },
			timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
		});
	} catch (err) {
		params.logger?.warn?.(`msteams botFramework ${kind} fetch failed`, { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		params.logger?.warn?.(`msteams botFramework ${kind} non-ok`, { status: response.status });
		return;
	}
	return response;
}
async function downloadMSTeamsBotFrameworkAttachment(params) {
	if (!params.serviceUrl || !params.attachmentId || !params.tokenProvider) return;
	const tokenProvider = params.tokenProvider;
	const policy = require_resolve_allowlist.resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const baseUrl = `${params.serviceUrl.replace(/\/+$/, "")}/v3/attachments/${encodeURIComponent(params.attachmentId)}`;
	if (!(0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(baseUrl, policy.allowHosts)) return;
	let accessToken;
	try {
		accessToken = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline: params.deadline,
			label: "MS Teams Bot Framework token",
			work: () => tokenProvider.getAccessToken(BOT_FRAMEWORK_SCOPE)
		});
	} catch (err) {
		params.logger?.warn?.("msteams botFramework token acquisition failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
	if (!accessToken) return;
	const request = {
		url: baseUrl,
		accessToken,
		policy,
		logger: params.logger,
		deadline: params.deadline
	};
	const infoResponse = await fetchBotFrameworkAttachment(request, "attachmentInfo");
	if (!infoResponse) return;
	let info;
	try {
		info = await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(infoResponse, "msteams botFramework attachmentInfo");
	} catch (err) {
		request.logger?.warn?.("msteams botFramework attachmentInfo parse failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
	if (!info) return;
	const views = Array.isArray(info.views) ? info.views : [];
	const candidateView = views.find((view) => view?.viewId === "original") ?? views.find((view) => typeof view?.viewId === "string");
	const viewId = typeof candidateView?.viewId === "string" && candidateView.viewId ? candidateView.viewId : void 0;
	if (!viewId) return;
	if (typeof candidateView?.size === "number" && candidateView.size > 0 && candidateView.size > params.maxBytes) return;
	const fileNameHint = typeof info.name === "string" && info.name || void 0;
	const contentTypeHint = typeof info.type === "string" && info.type || void 0;
	const viewUrl = `${baseUrl}/views/${encodeURIComponent(viewId)}`;
	const maxBytes = params.maxBytes;
	const response = await fetchBotFrameworkAttachment({
		...request,
		url: viewUrl
	}, "attachmentView");
	if (!response) return;
	let saved;
	try {
		saved = await require_runtime.getMSTeamsRuntime().channel.media.saveResponseMedia(response, {
			sourceUrl: viewUrl,
			filePathHint: fileNameHint,
			maxBytes,
			fallbackContentType: contentTypeHint,
			subdir: "inbound"
		});
	} catch (err) {
		request.logger?.warn?.("msteams botFramework attachmentView save failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	} finally {
		await response.body?.cancel().catch(() => void 0);
	}
	if (!saved) return;
	return {
		path: saved.path,
		contentType: saved.contentType,
		kind: require_resolve_allowlist.resolveMSTeamsMediaKind({
			contentType: saved.contentType,
			fileName: fileNameHint
		})
	};
}
/**
* Download media for every attachment referenced by a Bot Framework personal
* chat activity. Returns all successfully fetched media along with diagnostics
* compatible with `downloadMSTeamsGraphMedia`'s result shape so callers can
* reuse the existing logging path.
*/
async function downloadMSTeamsBotFrameworkAttachments(params) {
	const unique = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeUniqueTrimmedStringList)(params.attachmentIds);
	if (unique.length === 0 || !params.serviceUrl || !params.tokenProvider) return {
		media: [],
		attachmentCount: unique.length
	};
	const media = [];
	for (const attachmentId of unique) try {
		const item = await downloadMSTeamsBotFrameworkAttachment({
			...params,
			attachmentId
		});
		if (item) media.push({
			...item,
			sourceId: attachmentId
		});
		else media.push({
			kind: "document",
			sourceId: attachmentId
		});
	} catch (err) {
		media.push({
			kind: "document",
			sourceId: attachmentId
		});
		params.logger?.warn?.("msteams botFramework attachment download failed", {
			error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err),
			attachmentId
		});
	}
	return {
		media,
		attachmentCount: unique.length
	};
}
// extensions/msteams/src/attachments/remote-media.ts
/**
* Direct save path used when the caller supplies the already-guarded fetch
* implementation. This lets Teams-specific auth fallback own the request
* sequence while keeping redirect and DNS pinning inside `safeFetchWithPolicy`.
*/
async function downloadAndStoreMSTeamsRemoteMedia(params) {
	const response = await params.fetchImpl(params.url, { redirect: "follow" });
	try {
		const saved = await (0, openclaw_plugin_sdk_media_runtime.saveResponseMedia)(response, {
			sourceUrl: params.url,
			filePathHint: params.filePathHint,
			maxBytes: params.maxBytes,
			fallbackContentType: params.contentTypeHint
		});
		return {
			path: saved.path,
			contentType: saved.contentType,
			kind: params.kind ?? require_resolve_allowlist.resolveMSTeamsMediaKind({
				contentType: saved.contentType,
				fileName: params.filePathHint
			})
		};
	} finally {
		await response.body?.cancel().catch(() => void 0);
	}
}
// extensions/msteams/src/attachments/download.ts
function resolveDownloadCandidate(att, graphReferenceToken) {
	const contentType = require_resolve_allowlist.normalizeContentType(att.contentType);
	const graphReference = graphReferenceToken !== void 0 && contentType === "reference";
	const name = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.name) ?? "";
	if (contentType === "application/vnd.microsoft.teams.file.download.info") {
		if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(att.content)) return null;
		const downloadUrl = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.content.downloadUrl) ?? "";
		if (!downloadUrl) return null;
		const fileType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.content.fileType) ?? "";
		const uniqueId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.content.uniqueId) ?? "";
		const fileName = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.content.fileName) ?? "";
		const fileHint = name || fileName || (uniqueId && fileType ? `${uniqueId}.${fileType}` : "");
		return {
			kind: "remote",
			mediaKind: require_resolve_allowlist.resolveMSTeamsMediaKind({
				contentType,
				fileName: fileHint,
				fileType
			}),
			url: downloadUrl,
			fileHint: fileHint || void 0,
			contentTypeHint: void 0,
			sourceId: att.id?.trim() || void 0
		};
	}
	const contentUrl = graphReference ? att.contentUrl ?? "" : (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.contentUrl) ?? "";
	if (!contentUrl) return null;
	const sharesUrl = graphReference ? `${require_resolve_allowlist.GRAPH_ROOT}/shares/${require_resolve_allowlist.encodeGraphShareId(contentUrl)}/driveItem/content` : require_resolve_allowlist.tryBuildGraphSharesUrlForSharedLink(contentUrl);
	const resolvedUrl = sharesUrl ?? contentUrl;
	const resolvedContentTypeHint = graphReference ? "application/octet-stream" : sharesUrl ? void 0 : contentType;
	return {
		kind: "remote",
		mediaKind: require_resolve_allowlist.resolveMSTeamsMediaKind({
			contentType,
			fileName: name
		}),
		url: resolvedUrl,
		fileHint: graphReference ? att.name ?? void 0 : name || void 0,
		contentTypeHint: resolvedContentTypeHint,
		sourceId: att.id?.trim() || void 0,
		graphReference
	};
}
function scopeCandidatesForUrl(url) {
	const host = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(URL.parse(url)?.hostname);
	return host.endsWith("graph.microsoft.com") || host.endsWith("sharepoint.com") || host.endsWith("1drv.ms") || host.includes("sharepoint") ? ["https://graph.microsoft.com", "https://api.botframework.com"] : ["https://api.botframework.com", "https://graph.microsoft.com"];
}
function canonicalizeInlineBase64Payload(value) {
	let cleaned = "";
	for (const char of value) if (char.charCodeAt(0) > 32) cleaned += char;
	return cleaned.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(cleaned) ? cleaned : void 0;
}
async function resolveInlineDataImageMime(inline) {
	const detectedMime = await require_runtime.getMSTeamsRuntime().media.detectMime({
		buffer: inline.data,
		headerMime: inline.contentType
	});
	const mime = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(detectedMime ?? inline.contentType);
	return mime?.startsWith("image/") ? mime : void 0;
}
async function downloadMSTeamsAttachments(params) {
	const list = params.attachments ?? [];
	if (list.length === 0) return [];
	const policy = require_resolve_allowlist.resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const allowHosts = policy.allowHosts;
	const candidates = list.filter(require_resolve_allowlist.isAdvertisedFileAttachment).map((attachment) => {
		return (require_resolve_allowlist.isDownloadableAttachment(attachment) ? resolveDownloadCandidate(attachment, params.graphReferenceToken) : null) ?? {
			kind: "unavailable",
			mediaKind: require_resolve_allowlist.resolveMSTeamsMediaKind({
				contentType: require_resolve_allowlist.normalizeContentType(attachment.contentType),
				fileName: attachment.name ?? void 0
			}),
			sourceId: attachment.id?.trim() || void 0
		};
	});
	const maxInlineBytes = params.maxBytes;
	candidates.push(...require_resolve_allowlist.extractInlineImageReferences(list).map((candidate) => {
		if (candidate.kind === "url") return {
			kind: "remote",
			mediaKind: "image",
			url: candidate.url,
			fileHint: candidate.fileHint,
			contentTypeHint: candidate.contentType,
			sourceId: candidate.sourceId
		};
		return Object.assign(candidate, { mediaKind: "image" });
	}));
	for (const sourceId of resolveUnrepresentedHtmlAttachmentIds(list)) candidates.push({
		kind: "unavailable",
		mediaKind: "document",
		sourceId
	});
	if (candidates.length === 0) return [];
	let totalInlineBytes = 0;
	const downloadCandidate = async (candidate) => {
		if (candidate.kind === "unavailable") return;
		if (candidate.kind === "data") {
			const match = /^data:(image\/[a-z0-9.+-]+)?(;base64)?,(.*)$/i.exec(candidate.src);
			if (!match) return;
			const declaredContentType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(match[1] ?? "");
			if (!Boolean(match[2])) return;
			const canonicalPayload = canonicalizeInlineBase64Payload(match[3] ?? "");
			if (!canonicalPayload) return;
			const estimatedBytes = Buffer.byteLength(canonicalPayload, "base64");
			if (estimatedBytes <= 0 || estimatedBytes > maxInlineBytes || totalInlineBytes + estimatedBytes > maxInlineBytes) return;
			const decoded = {
				data: Buffer.from(canonicalPayload, "base64"),
				contentType: declaredContentType,
				estimatedBytes
			};
			totalInlineBytes += decoded.estimatedBytes;
			try {
				const contentType = await resolveInlineDataImageMime(decoded);
				if (!contentType) return;
				const saved = await require_runtime.getMSTeamsRuntime().channel.media.saveMediaBuffer(decoded.data, contentType, "inbound", params.maxBytes);
				return {
					path: saved.path,
					contentType: saved.contentType,
					kind: "image"
				};
			} catch (err) {
				params.logger?.warn?.("msteams inline attachment decode failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
			}
			return;
		}
		if (!(0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(candidate.url, allowHosts)) return;
		try {
			return await downloadAndStoreMSTeamsRemoteMedia({
				url: candidate.url,
				filePathHint: candidate.fileHint ?? candidate.url,
				maxBytes: params.maxBytes,
				contentTypeHint: candidate.contentTypeHint,
				kind: candidate.graphReference ? void 0 : candidate.mediaKind,
				fetchImpl: async (input, init) => {
					const url = (0, openclaw_plugin_sdk_request_url.resolveRequestUrl)(input);
					const providedTokenProvider = params.tokenProvider;
					const deadline = params.deadline;
					const bearerToken = candidate.graphReference ? params.graphReferenceToken : void 0;
					const fetchAttempt = (requestInit) => require_resolve_allowlist.safeFetchWithPolicy({
						url,
						policy,
						resolveFn: node_dns_promises.lookup,
						requestInit,
						timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(deadline)
					});
					if (bearerToken !== void 0) {
						const headers = require_resolve_allowlist.ensureUserAgentHeader(init?.headers);
						require_resolve_allowlist.applyAuthorizationHeaderForUrl({
							headers,
							url,
							authAllowHosts: policy.authAllowHosts,
							bearerToken
						});
						return fetchAttempt({
							...init,
							headers
						});
					}
					const firstAttempt = await fetchAttempt(init);
					if (firstAttempt.ok) return firstAttempt;
					if (!providedTokenProvider) return firstAttempt;
					const tokenProvider = providedTokenProvider;
					if (firstAttempt.status !== 401 && firstAttempt.status !== 403) return firstAttempt;
					if (!(0, openclaw_plugin_sdk_ssrf_policy.isHttpsUrlAllowedByHostnameSuffixAllowlist)(url, policy.authAllowHosts)) return firstAttempt;
					let fallbackAttempt = firstAttempt;
					const scopes = scopeCandidatesForUrl(url);
					for (const scope of scopes) try {
						const token = await require_resolve_allowlist.withMSTeamsRequestDeadline({
							deadline,
							label: "MS Teams attachment token",
							work: () => tokenProvider.getAccessToken(scope)
						});
						const authHeaders = new Headers(init?.headers);
						authHeaders.set("Authorization", `Bearer ${token}`);
						const authAttempt = await fetchAttempt({
							...init,
							headers: authHeaders
						});
						await fallbackAttempt.body?.cancel().catch(() => void 0);
						if (authAttempt.ok || require_resolve_allowlist.isRedirectStatus(authAttempt.status)) return authAttempt;
						fallbackAttempt = authAttempt;
					} catch {}
					return fallbackAttempt;
				}
			});
		} catch (err) {
			if (candidate.graphReference) {
				params.logger?.warn?.("msteams SharePoint reference download failed", {
					error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err),
					name: candidate.fileHint
				});
				return;
			}
			const msg = (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err);
			params.logger?.warn?.(`msteams attachment download failed host=${safeHostForLog(candidate.url)} error=${msg}`);
		}
	};
	const out = [];
	for (const candidate of candidates) {
		const media = await downloadCandidate(candidate) ?? { kind: candidate.mediaKind };
		out.push(candidate.sourceId ? {
			...media,
			sourceId: candidate.sourceId
		} : media);
	}
	return out;
}
function safeHostForLog(url) {
	return URL.parse(url)?.host ?? "invalid-url";
}
// extensions/msteams/src/attachments/graph.ts
function createGraphHostedContentFact(item) {
	const contentType = require_resolve_allowlist.normalizeContentType(item.contentType);
	return {
		kind: require_resolve_allowlist.resolveMSTeamsMediaKind({ contentType }),
		...contentType ? { contentType } : {},
		...item.id ? { sourceId: item.id } : {}
	};
}
function buildMSTeamsGraphMessageUrl(params) {
	const conversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(params.conversationType ?? "");
	const messageId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.messageId);
	if (!messageId) return;
	if (conversationType === "channel") {
		const teamAadGroupId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.teamAadGroupId);
		const channelId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.channelId);
		if (!teamAadGroupId || !channelId) return;
		const messageRoot = `${require_resolve_allowlist.GRAPH_ROOT}/teams/${encodeURIComponent(teamAadGroupId)}/channels/${encodeURIComponent(channelId)}/messages`;
		const threadRootMessageId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.threadRootMessageId);
		return threadRootMessageId && threadRootMessageId !== messageId ? `${messageRoot}/${encodeURIComponent(threadRootMessageId)}/replies/${encodeURIComponent(messageId)}` : `${messageRoot}/${encodeURIComponent(messageId)}`;
	}
	const chatId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.conversationId);
	if (!chatId) return;
	return `${require_resolve_allowlist.GRAPH_ROOT}/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`;
}
async function withGraphMediaResponse(params, url, kind, read) {
	const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
		url,
		init: { headers: require_resolve_allowlist.ensureUserAgentHeader({ Authorization: `Bearer ${params.accessToken}` }) },
		policy: params.ssrfPolicy,
		auditContext: `msteams.graph.${kind}`,
		timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
	});
	try {
		return await read(response);
	} finally {
		if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
		await release();
	}
}
function normalizeGraphAttachment(att) {
	let content = att.content;
	if (typeof content === "string") try {
		content = JSON.parse(content);
	} catch {}
	return {
		id: att.id ?? void 0,
		contentType: require_resolve_allowlist.normalizeContentType(att.contentType),
		contentUrl: att.contentUrl ?? void 0,
		name: att.name ?? void 0,
		content
	};
}
async function downloadMSTeamsGraphMedia(params) {
	if (!params.messageUrl || !params.tokenProvider) return { media: [] };
	const tokenProvider = params.tokenProvider;
	const policy = require_resolve_allowlist.resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const ssrfPolicy = (0, openclaw_plugin_sdk_ssrf_policy.buildHostnameAllowlistPolicyFromSuffixAllowlist)(policy.allowHosts);
	const messageUrl = params.messageUrl;
	const logGraphFailure = (phase, err) => {
		params.logger?.debug?.(`graph media ${phase} failed`, {
			messageUrl,
			error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)
		});
		params.logger?.warn?.(`msteams graph ${phase} failed`, {
			error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err),
			...phase === "message parse" ? { messageUrl } : {}
		});
	};
	let accessToken;
	try {
		accessToken = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline: params.deadline,
			label: "MS Teams Graph media token",
			work: () => tokenProvider.getAccessToken("https://graph.microsoft.com")
		});
	} catch (err) {
		logGraphFailure("token acquisition", err);
		return {
			media: [],
			tokenError: true
		};
	}
	let messageAttachments = [];
	let referenceAttachments = [];
	let messageStatus;
	try {
		await withGraphMediaResponse({
			...params,
			accessToken,
			ssrfPolicy
		}, messageUrl, "message", async (msgRes) => {
			messageStatus = msgRes.status;
			if (msgRes.ok) {
				let msgData;
				try {
					msgData = await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(msgRes, "MS Teams Graph message");
				} catch (err) {
					logGraphFailure("message parse", err);
					msgData = {};
				}
				messageAttachments = Array.isArray(msgData.attachments) ? msgData.attachments : [];
				referenceAttachments = messageAttachments.filter((a) => a.contentType === "reference" && a.contentUrl && a.name);
			} else params.logger?.debug?.("graph media message fetch not ok", {
				messageUrl,
				status: messageStatus
			});
		});
	} catch (err) {
		logGraphFailure("message fetch", err);
	}
	const sharePointMedia = await downloadMSTeamsAttachments({
		...params,
		attachments: referenceAttachments,
		graphReferenceToken: accessToken,
		allowHosts: policy.allowHosts,
		authAllowHosts: policy.authAllowHosts
	});
	const { maxBytes, logger, deadline } = params;
	const hostedRequest = {
		accessToken,
		ssrfPolicy,
		deadline
	};
	let hosted = { items: [] };
	try {
		hosted = await withGraphMediaResponse(hostedRequest, `${messageUrl}/hostedContents`, "collection", async (response) => {
			const status = response.status;
			if (!response.ok) return {
				status,
				items: []
			};
			try {
				return {
					status,
					items: await (0, openclaw_plugin_sdk_provider_http.readProviderJsonArrayFieldResponse)(response, "MS Teams Graph collection", "value")
				};
			} catch {
				return {
					status,
					items: []
				};
			}
		});
	} catch (err) {
		logger?.warn?.("msteams graph hostedContents fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
	}
	const hostedMedia = [];
	for (const item of hosted.items) {
		if (!item.id) {
			hostedMedia.push(createGraphHostedContentFact(item));
			continue;
		}
		try {
			const sourceId = item.id;
			const valueUrl = `${messageUrl}/hostedContents/${encodeURIComponent(sourceId)}/$value`;
			await withGraphMediaResponse(hostedRequest, valueUrl, "hostedContent.value", async (valRes) => {
				if (!valRes.ok) {
					hostedMedia.push(createGraphHostedContentFact(item));
					return;
				}
				const saved = await require_runtime.getMSTeamsRuntime().channel.media.saveResponseMedia(valRes, {
					sourceUrl: valueUrl,
					maxBytes,
					fallbackContentType: item.contentType ?? void 0,
					subdir: "inbound"
				});
				hostedMedia.push({
					path: saved.path,
					contentType: saved.contentType,
					kind: require_resolve_allowlist.resolveMSTeamsMediaKind({ contentType: saved.contentType }),
					sourceId
				});
			});
		} catch (err) {
			hostedMedia.push(createGraphHostedContentFact(item));
			logger?.warn?.("msteams graph hostedContent value fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
			continue;
		}
	}
	const normalizedAttachments = messageAttachments.map(normalizeGraphAttachment);
	const referenceUrls = new Set(referenceAttachments.map((att) => att.contentUrl));
	const filteredAttachments = normalizedAttachments.filter((att) => att.contentType !== "reference" || !referenceUrls.has(att.contentUrl));
	let attachmentMedia = [];
	try {
		attachmentMedia = await downloadMSTeamsAttachments({
			attachments: filteredAttachments,
			maxBytes: params.maxBytes,
			tokenProvider: params.tokenProvider,
			allowHosts: policy.allowHosts,
			authAllowHosts: policy.authAllowHosts,
			deadline: params.deadline,
			logger: params.logger
		});
	} catch (err) {
		params.logger?.warn?.("msteams graph attachment download failed", {
			error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err),
			messageUrl
		});
	}
	return {
		media: [
			...sharePointMedia,
			...hostedMedia,
			...attachmentMedia
		],
		hostedCount: hosted.items.length,
		attachmentCount: filteredAttachments.length + sharePointMedia.length,
		hostedStatus: hosted.status,
		attachmentStatus: messageStatus
	};
}
// extensions/msteams/src/monitor-handler/inbound-content.ts
async function prepareMSTeamsInboundContent(params) {
	const activity = params.entry.context.activity;
	const mayRecoverGraphMedia = Boolean(params.htmlSummary?.attachmentIds.length) || shouldAttemptMSTeamsGraphMediaFallback({
		conversationType: params.conversationType,
		htmlSummary: params.htmlSummary,
		graphMediaFallback: params.graphMediaFallback
	});
	if (!params.rawBody && params.advertisedMedia.length === 0 && !mayRecoverGraphMedia) {
		params.log.debug?.("skipping empty message after stripping mentions");
		return null;
	}
	let resolvedMedia = [];
	const deadline = require_resolve_allowlist.createMSTeamsInboundMediaDeadline();
	try {
		resolvedMedia = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams inbound media",
			work: async () => {
				let mediaList = await downloadMSTeamsAttachments({
					attachments: params.entry.attachments,
					maxBytes: params.mediaMaxBytes,
					tokenProvider: params.tokenProvider,
					allowHosts: params.mediaAllowHosts,
					authAllowHosts: params.mediaAuthAllowHosts,
					deadline,
					logger: params.log
				});
				if (!hasMaterializedMedia(mediaList)) {
					const attachmentIds = extractMSTeamsHtmlAttachmentIds(params.entry.attachments);
					const hasHtmlFileAttachment = attachmentIds.length > 0;
					const shouldFetchGraphMessage = hasHtmlFileAttachment || shouldAttemptMSTeamsGraphMediaFallback(params);
					const isBotFrameworkPersonalChat = isBotFrameworkPersonalChatId(params.conversationId);
					if (hasHtmlFileAttachment && isBotFrameworkPersonalChat) {
						if (!activity.serviceUrl) params.log.debug?.("bot framework attachment skipped (missing serviceUrl)", {
							conversationType: params.conversationType,
							conversationId: params.conversationId
						});
						else {
							const bfMedia = await downloadMSTeamsBotFrameworkAttachments({
								serviceUrl: activity.serviceUrl,
								attachmentIds,
								tokenProvider: params.tokenProvider,
								maxBytes: params.mediaMaxBytes,
								allowHosts: params.mediaAllowHosts,
								authAllowHosts: params.mediaAuthAllowHosts,
								deadline
							});
							mediaList = mergeMSTeamsMediaFacts(mediaList, bfMedia.media, { positionallyAligned: false });
							if (!hasMaterializedMedia(bfMedia.media)) params.log.debug?.("bot framework attachments fetch empty", {
								conversationType: params.conversationType,
								attachmentCount: bfMedia.attachmentCount ?? attachmentIds.length
							});
						}
					}
					if (shouldFetchGraphMessage && !isBotFrameworkPersonalChat) {
						const graphTeamAadGroupId = params.conversationType.trim().toLowerCase() === "channel" && !params.teamAadGroupId ? await params.resolveTeamAadGroupId(deadline) : params.teamAadGroupId;
						const messageUrl = buildMSTeamsGraphMessageUrl({
							conversationType: params.conversationType,
							conversationId: params.conversationId,
							messageId: activity.id,
							threadRootMessageId: params.conversationMessageId ?? activity.replyToId,
							teamAadGroupId: graphTeamAadGroupId,
							channelId: activity.channelData?.channel?.id
						});
						if (!messageUrl) params.log.debug?.("graph message url unavailable", {
							conversationType: params.conversationType,
							hasChannelData: Boolean(activity.channelData),
							messageId: activity.id,
							replyToId: activity.replyToId
						});
						else {
							const graphMedia = await downloadMSTeamsGraphMedia({
								messageUrl,
								tokenProvider: params.tokenProvider,
								maxBytes: params.mediaMaxBytes,
								allowHosts: params.mediaAllowHosts,
								authAllowHosts: params.mediaAuthAllowHosts,
								deadline,
								logger: params.log
							});
							mediaList = mergeMSTeamsMediaFacts(mediaList, graphMedia.media, { positionallyAligned: false });
							if (!hasMaterializedMedia(mediaList)) params.log.debug?.("graph media fetch empty", {
								messageUrl,
								hostedStatus: graphMedia.hostedStatus,
								attachmentStatus: graphMedia.attachmentStatus,
								hostedCount: graphMedia.hostedCount,
								attachmentCount: graphMedia.attachmentCount,
								tokenError: graphMedia.tokenError,
								attachmentIdCount: attachmentIds.length
							});
						}
					}
				}
				const materializedCount = mediaList.filter((media) => Boolean(media.path)).length;
				if (materializedCount > 0) params.log.debug?.("downloaded attachments", { count: materializedCount });
				else if (params.htmlSummary?.imgTags) params.log.debug?.("inline images detected but none downloaded", {
					imgTags: params.htmlSummary.imgTags,
					srcHosts: params.htmlSummary.srcHosts,
					dataImages: params.htmlSummary.dataImages,
					cidImages: params.htmlSummary.cidImages
				});
				return mediaList;
			}
		});
	} catch (err) {
		params.log.debug?.("failed to resolve inbound Teams media", { error: require_channel_setup.formatUnknownError(err) });
	}
	const inboundMedia = mergeMSTeamsMediaFacts(params.advertisedMedia, resolvedMedia);
	const body = params.rawBody;
	const expectedMediaCount = Math.max(params.advertisedMedia.length, resolvedMedia.length);
	const unavailableCount = inboundMedia.filter((media) => !media.path).length + Math.max(0, expectedMediaCount - inboundMedia.length);
	const agentBody = unavailableCount === 0 ? body : (0, openclaw_plugin_sdk_channel_inbound.formatInboundMediaUnavailableText)({
		body,
		notice: `[msteams ${unavailableCount > 1 ? `${unavailableCount} attachments` : "attachment"} unavailable]`
	});
	if (!agentBody && inboundMedia.length === 0) {
		params.log.debug?.("skipping empty message after Graph media recovery");
		return null;
	}
	return {
		agentBody,
		inboundMedia
	};
}
function shouldAttemptMSTeamsGraphMediaFallback(params) {
	const conversationType = params.conversationType.trim().toLowerCase();
	return params.graphMediaFallback === true && (conversationType === "channel" || conversationType === "groupchat") && (params.htmlSummary?.htmlAttachments ?? 0) > 0;
}
function hasDefinitiveContentType(media) {
	const contentType = media.contentType?.split(";", 1)[0]?.trim().toLowerCase();
	return Boolean(contentType && contentType !== "application/octet-stream" && contentType !== "binary/octet-stream");
}
function mergeMSTeamsMediaFacts(nativeMedia, materializedMedia, options = {}) {
	const merged = [...nativeMedia];
	const nativeSlotCount = nativeMedia.length;
	const nativeIndexBySourceId = /* @__PURE__ */ new Map();
	nativeMedia.forEach((media, index) => {
		if (media.sourceId && !nativeIndexBySourceId.has(media.sourceId)) nativeIndexBySourceId.set(media.sourceId, index);
	});
	for (const [index, materialized] of materializedMedia.entries()) {
		const sourceIndex = materialized.sourceId ? nativeIndexBySourceId.get(materialized.sourceId) : void 0;
		const positionalIndex = options.positionallyAligned === false || index >= nativeMedia.length ? void 0 : index;
		const unresolvedIndexes = options.positionallyAligned === false ? merged.slice(0, nativeSlotCount).flatMap((media, mediaIndex) => !media.path && !media.sourceId ? [mediaIndex] : []) : [];
		const fallbackIndex = unresolvedIndexes.find((mediaIndex) => merged[mediaIndex]?.kind === materialized.kind) ?? (unresolvedIndexes.length === 1 ? unresolvedIndexes[0] : void 0);
		const targetIndex = sourceIndex ?? positionalIndex ?? fallbackIndex;
		if (targetIndex === void 0) {
			if (materialized.sourceId) nativeIndexBySourceId.set(materialized.sourceId, merged.length);
			merged.push(materialized);
		} else {
			if (materialized.sourceId) nativeIndexBySourceId.set(materialized.sourceId, targetIndex);
			const current = merged[targetIndex];
			if (materialized.path) merged[targetIndex] = materialized;
			else if (!current?.path) merged[targetIndex] = {
				...current,
				...materialized,
				kind: hasDefinitiveContentType(materialized) || !current?.kind ? materialized.kind : current.kind
			};
		}
	}
	return merged;
}
function hasMaterializedMedia(media) {
	return media.some((entry) => Boolean(entry.path));
}
// extensions/msteams/src/thread-parent-context.ts
const PARENT_CACHE_TTL_MS = 3e5;
const PARENT_CACHE_MAX = 100;
const parentCache = /* @__PURE__ */ new Map();
const INJECTED_MAX = 200;
const injectedParents = /* @__PURE__ */ new Map();
function touchLru(map, key, value, max) {
	map.delete(key);
	map.set(key, value);
	(0, openclaw_plugin_sdk_collection_runtime.pruneMapToMaxSize)(map, max);
}
async function fetchParentMessageCached(token, groupId, channelId, parentId, deadline) {
	const key = JSON.stringify([
		(0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(token),
		groupId,
		channelId,
		parentId
	]);
	const cached = parentCache.get(key);
	if (cached && cached.expiresAt > Date.now()) {
		parentCache.delete(key);
		parentCache.set(key, cached);
		return cached.message;
	}
	const message = await require_reaction_types.fetchChannelMessage(token, groupId, channelId, parentId, deadline);
	touchLru(parentCache, key, {
		message,
		expiresAt: Date.now() + PARENT_CACHE_TTL_MS
	}, PARENT_CACHE_MAX);
	return message;
}
const PARENT_TEXT_MAX_CHARS = 400;
function formatParentContextEvent(message) {
	if (!message) return;
	const sender = message.from?.user?.displayName ?? message.from?.application?.displayName ?? "unknown";
	const contentType = message.body?.contentType ?? "text";
	const raw = message.body?.content ?? "";
	const text = contentType === "html" ? require_reaction_types.stripHtmlFromTeamsMessage(raw) : raw.replace(/\s+/g, " ").trim();
	if (!text) return;
	return `Replying to @${sender}: ${text.length > PARENT_TEXT_MAX_CHARS ? `${(0, openclaw_plugin_sdk_text_utility_runtime.truncateUtf16Safe)(text, 399)}…` : text}`;
}
function shouldInjectParentContext(sessionKey, parentId) {
	return injectedParents.get(sessionKey) !== parentId;
}
function markParentContextInjected(sessionKey, parentId) {
	touchLru(injectedParents, sessionKey, parentId, INJECTED_MAX);
}
// extensions/msteams/src/monitor-handler/thread-context.ts
async function resolveMSTeamsThreadContext(params) {
	const core = require_runtime.getMSTeamsRuntime();
	const activity = params.context.activity;
	const { route } = params;
	const deadline = require_resolve_allowlist.createMSTeamsInboundEnrichmentDeadline();
	const teamAadGroupId = await params.resolveTeamAadGroupId(deadline);
	let quoteBodyFull;
	let quoteSenderId;
	let quoteSenderName;
	const quoteMessageId = params.quoteInfo?.id;
	if (quoteMessageId && params.isDirectMessage && params.conversationId.startsWith("19:")) try {
		const graphToken = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams quote token",
			work: () => params.tokenProvider.getAccessToken("https://graph.microsoft.com")
		});
		quoteBodyFull = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams quote lookup",
			work: () => require_reaction_types.fetchChatMessageText(graphToken, params.conversationId, quoteMessageId, deadline)
		});
	} catch (err) {
		params.log.debug?.("failed to fetch full quoted message text", { error: require_channel_setup.formatUnknownError(err) });
	}
	let threadContext = [];
	const threadParentId = params.threadRootId;
	if (threadParentId && threadParentId !== activity.id && params.isChannel && teamAadGroupId) try {
		const graphToken = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams thread token",
			work: () => params.tokenProvider.getAccessToken("https://graph.microsoft.com")
		});
		const [parentResult, repliesResult] = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams thread history",
			work: () => Promise.allSettled([fetchParentMessageCached(graphToken, teamAadGroupId, params.conversationId, threadParentId, deadline), require_reaction_types.fetchThreadReplies(graphToken, teamAadGroupId, params.conversationId, threadParentId, deadline)])
		});
		const parentMsg = parentResult.status === "fulfilled" ? parentResult.value : void 0;
		const replies = repliesResult.status === "fulfilled" ? repliesResult.value : [];
		if (parentResult.status === "rejected") params.log.debug?.("failed to fetch parent message", { error: require_channel_setup.formatUnknownError(parentResult.reason) });
		if (repliesResult.status === "rejected") params.log.debug?.("failed to fetch thread replies", { error: require_channel_setup.formatUnknownError(repliesResult.reason) });
		const isThreadSenderAllowed = (message) => (0, openclaw_plugin_sdk_channel_inbound.resolveInboundSupplementalSenderAllowed)({
			isGroup: params.isChannel,
			groupPolicy: params.groupPolicy,
			allowFrom: params.effectiveGroupAllowFrom,
			isSenderAllowed: (allowFrom) => (0, openclaw_plugin_sdk_allow_from.resolveAllowlistMatchSimple)({
				allowFrom,
				senderId: message.from?.user?.id ?? "",
				senderName: message.from?.user?.displayName,
				allowNameMatching: params.allowNameMatching
			}).allowed
		});
		const parentContextEvent = formatParentContextEvent(parentMsg);
		const { items: threadMessages } = (0, openclaw_plugin_sdk_context_visibility_runtime.filterSupplementalContextItems)({
			items: parentMsg ? [parentMsg, ...replies] : replies,
			mode: params.contextVisibilityMode,
			kind: "thread",
			isSenderAllowed: isThreadSenderAllowed
		});
		if (parentContextEvent && parentMsg && threadMessages.includes(parentMsg) && shouldInjectParentContext(route.sessionKey, threadParentId)) {
			core.system.enqueueSystemEvent(parentContextEvent, {
				sessionKey: route.sessionKey,
				contextKey: `msteams:thread-parent:${params.conversationId}:${threadParentId}`
			});
			markParentContextInjected(route.sessionKey, threadParentId);
		}
		quoteSenderId = parentMsg?.from?.user?.id ?? parentMsg?.from?.application?.id;
		quoteSenderName = parentMsg?.from?.user?.displayName ?? parentMsg?.from?.application?.displayName ?? params.quoteInfo?.sender;
		threadContext = require_reaction_types.buildThreadContext(threadMessages, activity.id);
	} catch (err) {
		params.log.debug?.("failed to fetch thread history", { error: require_channel_setup.formatUnknownError(err) });
	}
	quoteSenderName ??= params.quoteInfo?.sender;
	return {
		teamAadGroupId,
		quoteBodyFull,
		quoteSenderId,
		quoteSenderName,
		threadContext
	};
}
// extensions/msteams/src/monitor-handler/message-handler.ts
function createMSTeamsMessageHandler(deps) {
	const { cfg, accountPolicyCfg = cfg, accountId, runtime, appId, app, tokenProvider, textLimit, mediaMaxBytes, conversationStore, pollStore, log } = deps;
	const core = require_runtime.getMSTeamsRuntime();
	const logVerboseMessage = (message) => {
		if (core.logging.shouldLogVerbose()) log.debug?.(message);
	};
	const msteamsCfg = cfg.channels?.msteams ? require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId) : void 0;
	const contextVisibilityMode = (0, openclaw_plugin_sdk_context_visibility_runtime.resolveChannelContextVisibilityMode)({
		cfg,
		channel: "msteams",
		accountId
	});
	const historyLimit = (0, openclaw_plugin_sdk_number_runtime.resolvePromptHistoryLimit)(msteamsCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit);
	const conversationHistories = /* @__PURE__ */ new Map();
	const readFullConfig = (0, openclaw_plugin_sdk_runtime_config_snapshot.createRuntimeConfigReader)(accountPolicyCfg);
	const readConfig = deps.readConfig ?? createMSTeamsHandlerConfigReader(deps);
	const resolveDebounceMs = () => core.channel.debounce.resolveInboundDebounceMs({
		cfg: readConfig(),
		channel: "msteams"
	});
	const handleTeamsMessageNow = async (params) => {
		const facts = assembleMSTeamsInboundFacts(params);
		const { context, activity, text, advertisedMedia, rawBody, quoteInfo, from, htmlSummary, conversationId, conversationMessageId, conversationType, isChannel, teamId, graphChannelId, conversationRef } = facts;
		const historyBody = [text, (0, openclaw_plugin_sdk_channel_inbound.formatMediaPlaceholderText)(advertisedMedia)].filter(Boolean).join("\n");
		if (!from?.id) {
			log.debug?.("skipping message without from.id");
			return;
		}
		let currentCfg = readConfig();
		let isBotOwnedThread = false;
		if (isChannel && facts.threadId && activity.recipient?.id) {
			const channelConfig = currentCfg.channels?.msteams;
			const routeConfig = require_presentation.resolveMSTeamsRouteConfig({
				cfg: channelConfig,
				teamId,
				teamName: activity.channelData?.team?.name,
				conversationId,
				channelName: activity.channelData?.channel?.name,
				allowNameMatching: channelConfig?.dangerouslyAllowNameMatching === true
			});
			if (require_presentation.resolveMSTeamsReplyPolicy({
				isDirectMessage: false,
				globalConfig: channelConfig,
				...routeConfig
			}).requireMentionInBotThreads !== void 0) {
				isBotOwnedThread = await require_conversation_store_state.wasMSTeamsMessageSentWithPersistence({
					conversationId,
					messageId: facts.threadId,
					botId: activity.recipient.id,
					accountId
				});
				currentCfg = readConfig();
			}
		}
		const currentMSTeamsCfg = currentCfg.channels?.msteams;
		if (currentMSTeamsCfg?.enabled === false || currentMSTeamsCfg?.appId && currentMSTeamsCfg.appId !== appId) return;
		const admission = await admitMSTeamsMessage({
			cfg: currentCfg,
			accountId,
			activity,
			text,
			conversationId,
			conversationRef,
			isChannel,
			conversationStore,
			log,
			logVerboseMessage
		});
		if (!admission) return;
		const { senderId, senderName, isDirectMessage, channelGate, allowNameMatching, groupPolicy, commandAuthorized, effectiveGroupAllowFrom, allowTextCommands, isControlCommand, msteamsCfg: admittedMSTeamsCfg } = admission;
		const pollVote = require_conversation_store_state.extractMSTeamsPollVote(activity);
		if (pollVote) {
			try {
				if (!await pollStore.recordVote({
					pollId: pollVote.pollId,
					voterId: senderId,
					selections: pollVote.selections
				})) log.debug?.("poll vote ignored (poll not found)", { pollId: pollVote.pollId });
			} catch (err) {
				log.error("failed to record poll vote", {
					pollId: pollVote.pollId,
					error: require_channel_setup.formatUnknownError(err)
				});
			}
			return;
		}
		const route = require_runtime.getMSTeamsRuntime().channel.routing.resolveAgentRoute({
			cfg: currentCfg,
			channel: "msteams",
			accountId,
			teamId,
			peer: {
				kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
				id: isDirectMessage ? senderId : conversationId
			}
		});
		route.sessionKey = require_thread_session.resolveMSTeamsRouteSessionKey({
			baseSessionKey: route.sessionKey,
			isChannel,
			conversationMessageId,
			replyToId: context.activity.replyToId
		});
		let resolvedTeamAadGroupId = context.activity.channelData?.team?.aadGroupId?.trim() || void 0;
		const conversationTeamId = isChannel ? teamId : void 0;
		let teamGroupIdPromise;
		const resolveTeamAadGroupId = async (deadline) => {
			if (!conversationTeamId) return;
			teamGroupIdPromise ??= require_conversation_store_state.resolveTeamGroupId({
				conversationTeamId,
				aadGroupId: resolvedTeamAadGroupId,
				getTeamDetails: context.getTeamDetails,
				deadline
			}).catch((err) => {
				log.debug?.("failed to resolve Teams AAD group ID", {
					teamId: conversationTeamId,
					error: require_channel_setup.formatUnknownError(err)
				});
			});
			resolvedTeamAadGroupId = await teamGroupIdPromise;
			return resolvedTeamAadGroupId;
		};
		const threadRootId = conversationMessageId ?? context.activity.replyToId;
		const inboundLabel = isDirectMessage ? `Teams DM from ${senderName}` : `Teams message in ${conversationType} from ${senderName}`;
		const enqueuePrimaryMessageSystemEvent = () => core.system.enqueueSystemEvent(inboundLabel, {
			sessionKey: route.sessionKey,
			contextKey: `msteams:message:${conversationId}:${activity.id ?? "unknown"}`
		});
		const channelId = conversationId;
		const { teamConfig, channelConfig } = channelGate;
		const replyPolicy = require_presentation.resolveMSTeamsReplyPolicy({
			isDirectMessage,
			globalConfig: currentMSTeamsCfg,
			teamConfig,
			channelConfig
		});
		const { requireMention, implicitMentionKinds } = resolveBotThreadMentionPolicy({
			isBotOwnedThread,
			requireMention: replyPolicy.requireMention,
			requireMentionInBotThreads: replyPolicy.requireMentionInBotThreads,
			implicitMentionKinds: params.implicitMentionKinds
		});
		const { replyStyle } = replyPolicy;
		const timestamp = require_resolve_allowlist.parseMSTeamsActivityTimestamp(activity.timestamp);
		const mentionDecision = (0, openclaw_plugin_sdk_channel_inbound.resolveInboundMentionDecision)({
			facts: {
				canDetectMention: true,
				wasMentioned: params.wasMentioned,
				implicitMentionKinds
			},
			policy: {
				isGroup: !isDirectMessage,
				requireMention,
				allowTextCommands,
				hasControlCommand: isControlCommand,
				commandAuthorized: commandAuthorized === true
			}
		});
		if (!isDirectMessage) {
			const mentioned = mentionDecision.effectiveWasMentioned;
			if (requireMention && mentionDecision.shouldSkip) {
				log.debug?.("skipping message (mention required)", {
					teamId,
					channelId,
					requireMention,
					mentioned
				});
				if (historyBody) {
					enqueuePrimaryMessageSystemEvent();
					(0, openclaw_plugin_sdk_reply_history.createChannelHistoryWindow)({ historyMap: conversationHistories }).record({
						historyKey: facts.historyKey,
						limit: historyLimit,
						entry: {
							sender: senderName,
							body: historyBody,
							timestamp: timestamp?.getTime(),
							messageId: activity.id
						}
					});
				}
				return;
			}
		}
		const content = await prepareMSTeamsInboundContent({
			entry: params,
			rawBody,
			advertisedMedia,
			htmlSummary,
			conversationType,
			conversationId,
			conversationMessageId,
			teamAadGroupId: resolvedTeamAadGroupId,
			resolveTeamAadGroupId,
			mediaMaxBytes,
			tokenProvider,
			mediaAllowHosts: currentMSTeamsCfg?.mediaAllowHosts,
			mediaAuthAllowHosts: currentMSTeamsCfg?.mediaAuthAllowHosts,
			graphMediaFallback: currentMSTeamsCfg?.graphMediaFallback,
			log
		});
		if (!content) return;
		enqueuePrimaryMessageSystemEvent();
		const thread = await resolveMSTeamsThreadContext({
			route,
			threadRootId,
			resolveTeamAadGroupId,
			context,
			tokenProvider,
			quoteInfo,
			isDirectMessage,
			isChannel,
			conversationId,
			contextVisibilityMode,
			groupPolicy,
			effectiveGroupAllowFrom,
			allowNameMatching,
			log
		});
		const dispatchAccountPolicyCfg = readFullConfig();
		const dispatchCore = require_runtime.getMSTeamsRuntime();
		const { agentBody, inboundMedia } = content;
		const { teamAadGroupId, quoteBodyFull, quoteSenderId, quoteSenderName, threadContext } = thread;
		const teamsFrom = isDirectMessage ? `msteams:${senderId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`;
		const teamsTo = isDirectMessage ? `user:${senderId}` : `conversation:${conversationId}`;
		const envelopeFrom = isDirectMessage ? senderName : conversationType;
		const buildEnvelope = await (0, openclaw_plugin_sdk_channel_inbound.createChannelInboundEnvelopeBuilderAsync)({
			cfg: currentCfg,
			route
		});
		let combinedBody = buildEnvelope({
			channel: "Teams",
			from: envelopeFrom,
			timestamp,
			body: agentBody
		});
		const isRoomish = !isDirectMessage;
		const historyKey = isRoomish ? facts.historyKey : void 0;
		if (isRoomish && historyKey) combinedBody = (0, openclaw_plugin_sdk_reply_history.createChannelHistoryWindow)({ historyMap: conversationHistories }).buildPendingContext({
			historyKey,
			limit: historyLimit,
			currentMessage: combinedBody,
			formatEntry: (entry) => buildEnvelope({
				channel: "Teams",
				from: conversationType,
				timestamp: entry.timestamp,
				previousTimestamp: null,
				body: `${entry.sender}: ${entry.body}${entry.messageId ? ` [id:${entry.messageId}]` : ""}`
			})
		});
		const inboundHistory = isRoomish && historyKey && historyLimit > 0 ? (0, openclaw_plugin_sdk_reply_history.createChannelHistoryWindow)({ historyMap: conversationHistories }).buildInboundHistory({
			historyKey,
			limit: historyLimit
		}) : void 0;
		const commandBody = text.trim();
		const quoteSenderAllowed = quoteInfo && quoteInfo.sender ? (0, openclaw_plugin_sdk_channel_inbound.resolveInboundSupplementalSenderAllowed)({
			isGroup: !isDirectMessage,
			groupPolicy,
			allowFrom: effectiveGroupAllowFrom,
			isSenderAllowed: (allowFrom) => (0, openclaw_plugin_sdk_allow_from.resolveAllowlistMatchSimple)({
				allowFrom,
				senderId: quoteSenderId ?? "",
				senderName: quoteSenderName,
				allowNameMatching
			}).allowed
		}) : true;
		const nativeChannelId = isChannel && teamAadGroupId ? `${teamAadGroupId}/${graphChannelId}` : void 0;
		const boundIngress = await resolveMSTeamsSenderAccess({
			cfg: route.accountId === accountId ? readConfig() : dispatchAccountPolicyCfg,
			accountId: route.accountId,
			activity,
			hasControlCommand: admission.isControlCommand,
			conversationThreadId: facts.threadId,
			contextBinding: {
				agentId: route.agentId,
				sessionKey: route.sessionKey,
				...activity.id ? { messageId: activity.id } : {},
				...nativeChannelId ? { nativeChannelId } : {},
				inboundEventKind: "user_request"
			}
		});
		if (!boundIngress.senderAccess.allowed || boundIngress.hasConflictingConversationScope || boundIngress.msteamsCfg?.enabled === false || boundIngress.commandAccess.shouldBlockControlCommand) {
			log.info("dropping message (dispatch-time account authorization changed)");
			return;
		}
		const ctxPayload = dispatchCore.channel.inbound.buildContext({
			channelIngress: boundIngress.channelIngress,
			channel: "msteams",
			contextVisibility: contextVisibilityMode,
			supplemental: {
				channelStructuredContext: threadContext.length ? [{
					label: "Thread history",
					source: "msteams",
					type: "chat_window",
					sessionTranscriptMode: "preserve",
					payload: {
						order: "chronological",
						messages: threadContext
					}
				}] : void 0,
				quote: quoteInfo ? {
					id: quoteInfo.id ?? activity.replyToId,
					body: quoteBodyFull ?? quoteInfo.body,
					sender: quoteInfo.sender,
					senderAllowed: quoteSenderAllowed,
					isQuote: true
				} : void 0
			},
			media: await (0, openclaw_plugin_sdk_channel_inbound.toInboundMediaFactsWithMetadata)(inboundMedia),
			messageId: activity.id,
			timestamp: timestamp?.getTime() ?? Date.now(),
			from: teamsFrom,
			sender: {
				id: senderId,
				name: senderName
			},
			conversation: {
				kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
				id: conversationId,
				label: envelopeFrom,
				spaceId: teamId,
				nativeChannelId
			},
			route: {
				agentId: route.agentId,
				dmScope: route.dmScope,
				accountId: route.accountId,
				routeSessionKey: route.sessionKey
			},
			reply: {
				to: teamsTo,
				originatingTo: `conversation:${conversationId}`,
				messageThreadId: facts.threadId,
				replyToId: activity.replyToId,
				nativeChannelId
			},
			message: {
				body: combinedBody,
				bodyForAgent: agentBody,
				inboundHistory,
				rawBody,
				commandBody
			},
			sessionTranscript: { historyLimit: isRoomish ? historyLimit : 0 },
			access: {
				mentions: {
					canDetectMention: !isDirectMessage,
					wasMentioned: isDirectMessage || mentionDecision.effectiveWasMentioned
				},
				commands: { authorized: commandAuthorized === true }
			},
			extra: {
				GroupSubject: !isDirectMessage ? conversationType : void 0,
				ReplyToIsQuote: quoteInfo ? true : void 0
			}
		});
		const { dispatcherOptions, delivery, replyOptions } = createMSTeamsReplyDispatcher({
			cfg: currentCfg,
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			accountId: route.accountId,
			log,
			app,
			conversationRef,
			context,
			replyStyle,
			textLimit,
			onSentMessageIds: (ids) => {
				for (const id of ids) require_conversation_store_state.recordMSTeamsSentMessage(conversationId, id, { accountId: route.accountId });
			},
			tokenProvider,
			sharePointSiteId: admittedMSTeamsCfg?.sharePointSiteId
		});
		const senderTimezone = conversationRef.timezone;
		const turnConfig = senderTimezone && !currentCfg.agents?.defaults?.userTimezone ? {
			...currentCfg,
			agents: {
				...currentCfg.agents,
				defaults: {
					...currentCfg.agents?.defaults,
					userTimezone: senderTimezone
				}
			}
		} : currentCfg;
		try {
			await dispatchCore.channel.inbound.run({
				channel: "msteams",
				accountId: route.accountId,
				raw: context,
				adapter: {
					ingest: () => ({
						id: activity.id ?? `${teamsFrom}:${Date.now()}`,
						timestamp: timestamp?.getTime(),
						rawText: rawBody,
						textForAgent: agentBody,
						textForCommands: commandBody,
						raw: activity
					}),
					resolveTurn: () => ({
						cfg: turnConfig,
						channel: "msteams",
						accountId: route.accountId,
						route: {
							agentId: route.agentId,
							sessionKey: route.sessionKey
						},
						ctxPayload,
						record: { onRecordError: (err) => {
							logVerboseMessage(`msteams: failed updating session meta: ${require_channel_setup.formatUnknownError(err)}`);
						} },
						history: {
							isGroup: isRoomish,
							historyKey,
							historyMap: conversationHistories,
							limit: historyLimit
						},
						dispatcherOptions,
						delivery,
						replyOptions: {
							...replyOptions,
							...facts.turnAdoptionLifecycle ? (0, openclaw_plugin_sdk_channel_outbound.bindIngressLifecycleToReplyOptions)(facts.turnAdoptionLifecycle) : {}
						}
					})
				}
			});
		} catch (err) {
			runtime.error(`msteams dispatch failed: ${require_channel_setup.formatUnknownError(err)}`);
			if (facts.turnAdoptionLifecycle) throw err;
			try {
				await context.sendActivity("⚠️ Something went wrong. Please try again.");
			} catch {}
		}
	};
	const inboundDebouncer = core.channel.debounce.createInboundDebouncer({
		debounceMs: resolveDebounceMs(),
		resolveDebounceMs,
		buildKey: (entry) => {
			const activity = entry.context.activity;
			const rawConversationId = activity.conversation?.id ?? "";
			const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawConversationId);
			const threadId = activity.conversation?.conversationType === "channel" ? require_resolve_allowlist.extractMSTeamsConversationMessageId(rawConversationId) ?? activity.replyToId : void 0;
			const senderId = entry.context.activity.from?.aadObjectId ?? entry.context.activity.from?.id ?? "";
			if (!senderId || !conversationId) return null;
			return JSON.stringify([
				"msteams",
				appId,
				conversationId,
				threadId ?? null,
				senderId
			]);
		},
		shouldDebounce: (entry) => {
			if (!entry.text.trim()) return false;
			if (entry.attachments.length > 0) return false;
			return !core.channel.commands.isControlCommandMessage(entry.text, cfg);
		},
		onFlush: (entries, createFlush) => {
			const last = entries.at(-1);
			const { lifecycle, settle } = (0, openclaw_plugin_sdk_channel_ingress_runtime.fanInChannelIngressLifecycles)(entries.map((entry) => entry.turnAdoptionLifecycle));
			return createFlush({
				lifecycle,
				dispatch: async (admissionLifecycle) => {
					if (!last) return;
					try {
						if (entries.length === 1) await handleTeamsMessageNow({
							...last,
							turnAdoptionLifecycle: admissionLifecycle
						});
						else {
							const combinedText = entries.map((entry) => entry.text).filter(Boolean).join("\n");
							if (combinedText.trim()) {
								const combinedRawText = entries.map((entry) => entry.rawText).filter(Boolean).join("\n");
								const wasMentioned = entries.some((entry) => entry.wasMentioned);
								const implicitMentionKinds = entries.flatMap((entry) => entry.implicitMentionKinds);
								await handleTeamsMessageNow({
									context: last.context,
									rawText: combinedRawText,
									text: combinedText,
									attachments: [],
									wasMentioned,
									implicitMentionKinds,
									turnAdoptionLifecycle: admissionLifecycle
								});
							}
						}
						await settle();
					} catch (err) {
						await admissionLifecycle.onAbandoned();
						throw err;
					}
				}
			});
		},
		onError: (err) => {
			runtime.error(`msteams debounce flush failed: ${require_channel_setup.formatUnknownError(err)}`);
		}
	});
	return async function handleTeamsMessage(context, turnAdoptionLifecycle) {
		const entry = await prepareMSTeamsDebounceEntry({
			context,
			accountId,
			turnAdoptionLifecycle
		});
		await inboundDebouncer.enqueue(entry);
		if (turnAdoptionLifecycle) return { kind: "deferred" };
	};
}
// extensions/msteams/src/monitor-handler/reaction-handler.ts
function createMSTeamsReactionHandler(deps) {
	const { accountId, log } = deps;
	const readConfig = deps.readConfig ?? createMSTeamsHandlerConfigReader(deps);
	const core = require_runtime.getMSTeamsRuntime();
	return async function handleReaction(context, direction) {
		const cfg = readConfig();
		const activity = context.activity;
		const rawReactions = direction === "added" ? activity.reactionsAdded : activity.reactionsRemoved;
		const reactions = Array.isArray(rawReactions) ? rawReactions : [];
		if (reactions.length === 0) {
			log.debug?.("reaction activity has no reactions; skipping");
			return;
		}
		const from = activity.from;
		if (!from?.id) {
			log.debug?.("reaction activity missing from.id; skipping");
			return;
		}
		const rawConversationId = activity.conversation?.id ?? "";
		const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawConversationId);
		const isChannel = activity.conversation?.conversationType === "channel";
		const senderId = from.aadObjectId ?? from.id;
		const senderName = from.name ?? from.id;
		const access = await resolveMSTeamsSenderAccess({
			cfg,
			accountId,
			activity
		});
		const { isDirectMessage, channelGate, msteamsCfg } = access;
		if (msteamsCfg?.enabled === false || msteamsCfg?.appId && msteamsCfg.appId !== deps.appId) return;
		if (access.hasConflictingConversationScope) {
			log.info("dropping reaction (conflicting conversation scope)", { conversationId });
			return;
		}
		if (msteamsCfg) {
			if (access.senderAccess.decision !== "allow") {
				log.debug?.("dropping reaction (access denied)", {
					sender: senderId,
					reason: access.senderAccess.reasonCode
				});
				return;
			}
			if (!isDirectMessage && channelGate.allowlistConfigured && !channelGate.allowed) {
				log.info("dropping reaction (not in team/channel allowlist)", {
					conversationId,
					teamKey: channelGate.teamKey ?? "none",
					channelKey: channelGate.channelKey ?? "none",
					channelMatchKey: channelGate.channelMatchKey ?? "none",
					channelMatchSource: channelGate.channelMatchSource ?? "none"
				});
				return;
			}
		}
		const teamId = isDirectMessage ? void 0 : activity.channelData?.team?.id;
		const route = core.channel.routing.resolveAgentRoute({
			cfg,
			channel: "msteams",
			accountId,
			peer: {
				kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
				id: isDirectMessage ? senderId : conversationId
			},
			...teamId ? { teamId } : {}
		});
		const sessionKey = require_thread_session.resolveMSTeamsRouteSessionKey({
			baseSessionKey: route.sessionKey,
			isChannel,
			conversationMessageId: require_resolve_allowlist.extractMSTeamsConversationMessageId(rawConversationId)
		});
		const targetMessageId = activity.replyToId ?? "unknown";
		for (const reaction of reactions) {
			const reactionType = reaction.type ?? "unknown";
			const emoji = require_reaction_types.resolveMSTeamsReactionEmoji(reactionType);
			const label = direction === "added" ? `Teams reaction ${emoji} added by ${senderName} on message ${targetMessageId}` : `Teams reaction ${emoji} removed by ${senderName} from message ${targetMessageId}`;
			core.system.enqueueSystemEvent(label, {
				sessionKey,
				contextKey: `msteams:reaction:${conversationId}:${targetMessageId}:${senderId}:${reactionType}:${direction}`
			});
		}
	};
}
// extensions/msteams/src/monitor-handler.ts
const DEFAULT_PROMPT_STARTERS = [
	"What can you do?",
	"Summarize my last meeting",
	"Help me draft an email"
];
async function isMSTeamsInvokeAuthorized(params) {
	const { context, deps, invokeKind } = params;
	const cfg = deps.readConfig?.() ?? deps.cfg;
	const account = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, deps.accountId);
	if (account.enabled === false || account.appId && account.appId !== deps.appId) return false;
	const resolved = await resolveMSTeamsSenderAccess({
		cfg,
		accountId: deps.accountId,
		activity: context.activity
	});
	const { msteamsCfg, isDirectMessage, conversationId, senderId } = resolved;
	const maybeInvokeName = invokeKind === "feedback" ? void 0 : { name: context.activity.name };
	if (resolved.hasConflictingConversationScope) {
		deps.log.info("dropping invoke (conflicting conversation scope)", {
			conversationId,
			...maybeInvokeName
		});
		return false;
	}
	if (!msteamsCfg) return true;
	if (isDirectMessage && resolved.senderAccess.decision !== "allow") {
		deps.log.debug?.(`dropping ${invokeKind} invoke (dm sender not allowlisted)`, {
			sender: senderId,
			conversationId,
			...maybeInvokeName
		});
		return false;
	}
	if (!isDirectMessage && resolved.channelGate.allowlistConfigured && !resolved.channelGate.allowed) {
		deps.log.debug?.(`dropping ${invokeKind} invoke (not in team/channel allowlist)`, {
			conversationId,
			teamKey: resolved.channelGate.teamKey ?? "none",
			channelKey: resolved.channelGate.channelKey ?? "none",
			...maybeInvokeName
		});
		return false;
	}
	if (!isDirectMessage && !resolved.senderAccess.allowed) {
		deps.log.debug?.(`dropping ${invokeKind} invoke (group sender not allowlisted)`, {
			sender: senderId,
			conversationId,
			...maybeInvokeName
		});
		return false;
	}
	return true;
}
function createMSTeamsActivityHandler(deps) {
	const handleTeamsMessage = createMSTeamsMessageHandler(deps);
	const handleReaction = createMSTeamsReactionHandler(deps);
	const handleMembersAdded = async (ctx) => {
		const membersAdded = ctx.activity?.membersAdded ?? [];
		const botId = ctx.activity?.recipient?.id;
		const msteamsCfg = deps.cfg.channels?.msteams ? require_resolve_allowlist.resolveMSTeamsAccountConfig(deps.cfg, deps.accountId) : void 0;
		for (const member of membersAdded) if (member.id === botId) {
			const isPersonal = ((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(ctx.activity?.conversation?.conversationType) ?? "personal") === "personal";
			if (isPersonal) await deps.conversationStore.upsert(require_resolve_allowlist.normalizeMSTeamsConversationId(ctx.activity.conversation?.id ?? ""), buildMSTeamsConversationReference(ctx.activity)).catch((err) => {
				deps.log.debug?.("failed to save conversation reference", { error: require_channel_setup.formatUnknownError(err) });
			});
			if (isPersonal && msteamsCfg?.welcomeCard !== false) {
				const botName = ctx.activity?.recipient?.name || "OpenClaw";
				const starters = msteamsCfg?.promptStarters?.length ? msteamsCfg.promptStarters : DEFAULT_PROMPT_STARTERS;
				const card = {
					type: "AdaptiveCard",
					version: "1.5",
					body: [{
						type: "TextBlock",
						text: `Hi! I'm ${botName}.`,
						weight: "Bolder",
						size: "Medium"
					}, {
						type: "TextBlock",
						text: "I can help you with questions, tasks, and more. Here are some things to try:",
						wrap: true
					}],
					actions: starters.map((label) => ({
						type: "Action.Submit",
						title: label,
						data: { msteams: {
							type: "imBack",
							value: label
						} }
					}))
				};
				try {
					await ctx.sendActivity(require_conversation_store_state.buildMSTeamsAdaptiveCardActivity(card));
					deps.log.info("sent welcome card");
				} catch (err) {
					deps.log.debug?.("failed to send welcome card", { error: require_channel_setup.formatUnknownError(err) });
				}
			} else if (!isPersonal && msteamsCfg?.groupWelcomeCard === true) {
				const botName = ctx.activity?.recipient?.name || "OpenClaw";
				try {
					await ctx.sendActivity(`Hi! I'm ${botName}. Mention me with @${botName} to get started.`);
					deps.log.info("sent group welcome message");
				} catch (err) {
					deps.log.debug?.("failed to send group welcome", { error: require_channel_setup.formatUnknownError(err) });
				}
			} else deps.log.debug?.("skipping welcome (disabled by config or conversation type)");
		} else deps.log.debug?.("member added", { member: member.id });
	};
	return async (context, turnAdoptionLifecycle) => {
		const activity = context.activity;
		if (activity?.type === "invoke" && activity.name === "adaptiveCard/action") {
			if (await maybeHandleMSTeamsApprovalCardSubmit({
				context,
				deps
			})) return;
			const text = serializeMSTeamsAdaptiveCardActionValue(activity.value);
			if (text) return handleTeamsMessage({
				...context,
				activity: {
					...activity,
					type: "message",
					text
				}
			}, turnAdoptionLifecycle);
			return;
		}
		if (activity?.type === "message") try {
			if (await maybeHandleMSTeamsApprovalCardSubmit({
				context,
				deps
			})) return;
			return await handleTeamsMessage(context, turnAdoptionLifecycle);
		} catch (err) {
			if (turnAdoptionLifecycle) throw err;
			deps.runtime.error(`msteams handler failed: ${require_channel_setup.formatUnknownError(err)}`);
		}
		else if (activity?.type === "conversationUpdate") await handleMembersAdded(context);
		else if (activity?.type === "messageReaction") for (const direction of ["added", "removed"]) {
			if (!(direction === "added" ? activity.reactionsAdded : activity.reactionsRemoved)?.length) continue;
			try {
				await handleReaction(context, direction);
			} catch (err) {
				deps.runtime.error(`msteams reaction handler failed: ${String(err)}`);
			}
		}
	};
}
// extensions/msteams/src/feedback-invoke.ts
/** Return whether feedback consumed the invoke; the SDK owns its HTTP acknowledgement. */
async function runMSTeamsFeedbackInvokeHandler(context, deps) {
	const activity = context.activity;
	const value = activity.value;
	if (!value) return false;
	if (value.actionName !== "feedback") return false;
	const reaction = value.actionValue?.reaction;
	if (reaction !== "like" && reaction !== "dislike") {
		deps.log.debug?.("ignoring feedback with unknown reaction", { reaction });
		return false;
	}
	const cfg = deps.readConfig?.() ?? deps.cfg;
	const msteamsCfg = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, deps.accountId);
	if (msteamsCfg?.feedbackEnabled === false) {
		deps.log.debug?.("feedback handling disabled");
		return true;
	}
	if (!await isMSTeamsInvokeAuthorized({
		context,
		deps,
		invokeKind: "feedback"
	})) return true;
	let userComment;
	if (value.actionValue?.feedback) try {
		userComment = JSON.parse(value.actionValue.feedback).feedbackText || void 0;
	} catch {}
	const rawConversationId = activity.conversation?.id ?? "unknown";
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawConversationId);
	const senderId = activity.from?.aadObjectId ?? activity.from?.id ?? "unknown";
	const messageId = value.replyToId ?? activity.replyToId ?? "unknown";
	const isNegative = reaction === "dislike";
	const convType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(activity.conversation?.conversationType);
	const isDirectMessage = convType === "personal" || !convType && !activity.conversation?.isGroup;
	const isChannel = convType === "channel";
	const route = require_runtime.getMSTeamsRuntime().channel.routing.resolveAgentRoute({
		cfg,
		channel: "msteams",
		accountId: deps.accountId,
		peer: {
			kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
			id: isDirectMessage ? senderId : conversationId
		}
	});
	route.sessionKey = require_thread_session.resolveMSTeamsRouteSessionKey({
		baseSessionKey: route.sessionKey,
		isChannel,
		conversationMessageId: require_resolve_allowlist.extractMSTeamsConversationMessageId(rawConversationId),
		replyToId: activity.replyToId
	});
	const feedbackEvent = {
		type: "custom",
		event: "feedback",
		ts: Date.now(),
		messageId,
		value: isNegative ? "negative" : "positive",
		comment: userComment,
		sessionKey: route.sessionKey,
		agentId: route.agentId,
		conversationId
	};
	deps.log.info("received feedback", {
		value: feedbackEvent.value,
		messageId,
		conversationId,
		hasComment: Boolean(userComment)
	});
	try {
		await (0, openclaw_plugin_sdk_channel_inbound.recordChannelFeedbackEvent)({
			cfg,
			agentId: route.agentId,
			sessionKey: route.sessionKey,
			event: feedbackEvent
		});
	} catch {}
	const conversationRef = {
		activityId: activity.id,
		user: {
			id: activity.from?.id,
			name: activity.from?.name,
			aadObjectId: activity.from?.aadObjectId
		},
		agent: activity.recipient ? {
			id: activity.recipient.id,
			name: activity.recipient.name
		} : void 0,
		conversation: {
			id: conversationId,
			conversationType: activity.conversation?.conversationType,
			tenantId: activity.conversation?.tenantId
		},
		channelId: activity.channelId ?? "msteams",
		serviceUrl: activity.serviceUrl,
		locale: activity.locale
	};
	if (isNegative && msteamsCfg?.feedbackReflection !== false) {
		const { app, accountId, log } = deps;
		const { sessionKey, agentId } = route;
		const conversationKind = isDirectMessage ? "direct" : isChannel ? "channel" : "group";
		(async () => {
			const cooldownMs = msteamsCfg.feedbackReflectionCooldownMs ?? openclaw_plugin_sdk_channel_inbound.DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS;
			let reflection;
			try {
				reflection = await (0, openclaw_plugin_sdk_channel_inbound.runChannelFeedbackReflection)({
					cfg,
					channel: "msteams",
					channelLabel: "Teams",
					agentId,
					sessionKey,
					conversationId,
					conversationKind,
					userComment,
					cooldownMs,
					onRecordError: (err) => log.debug?.("reflection session record failed", { error: require_channel_setup.formatUnknownError(err) }),
					onDispatchError: (err) => log.debug?.("reflection reply error", { error: require_channel_setup.formatUnknownError(err) })
				});
			} catch (err) {
				log.error("reflection dispatch failed", { error: require_channel_setup.formatUnknownError(err) });
				return;
			}
			if (reflection.status === "cooldown") {
				log.debug?.("skipping reflection (cooldown active)", { sessionKey });
				return;
			}
			if (reflection.status === "empty") {
				log.debug?.("reflection produced no output");
				return;
			}
			if (!(convType === "personal" && reflection.followUp && Boolean(reflection.userMessage))) {
				if (reflection.followUp && convType !== "personal") log.debug?.("skipping reflection follow-up outside direct message", {
					sessionKey,
					conversationType: convType
				});
				return;
			}
			try {
				await require_conversation_store_state.sendMSTeamsActivityWithReference(app, require_conversation_store_state.buildConversationReference(conversationRef), {
					type: "message",
					text: reflection.userMessage
				}, {
					accountId,
					serviceUrlBoundary: require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg)
				});
			} catch (err) {
				log.debug?.("failed to send reflection follow-up", { error: require_channel_setup.formatUnknownError(err) });
			}
		})().catch((err) => {
			deps.log.error("feedback reflection failed", { error: require_channel_setup.formatUnknownError(err) });
		});
	}
	return true;
}
// extensions/msteams/src/file-consent-invoke.ts
/** Run delayed upload/update work after the SDK route acknowledges the invoke. */
async function runMSTeamsFileConsentInvokeHandler(context, log) {
	try {
		const expiredUploadMessage = "The file upload request has expired. Please try sending the file again.";
		const activity = context.activity;
		if (activity.type !== "invoke" || activity.name !== "fileConsent/invoke") return;
		const consentResponse = require_conversation_store_state.parseFileConsentInvoke(activity);
		if (!consentResponse) {
			log.debug?.("invalid file consent invoke");
			return;
		}
		const uploadId = typeof consentResponse.context?.uploadId === "string" ? consentResponse.context.uploadId : void 0;
		const inMemoryFile = require_conversation_store_state.getPendingUpload(uploadId);
		const fsFile = inMemoryFile ? void 0 : await require_conversation_store_state.getPendingUploadFs(uploadId);
		const pendingFile = inMemoryFile ?? fsFile;
		if (pendingFile) {
			const pendingConversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(pendingFile.conversationId);
			const invokeConversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
			if (!invokeConversationId || pendingConversationId !== invokeConversationId) {
				log.info("file consent conversation mismatch", {
					uploadId,
					expectedConversationId: pendingConversationId,
					receivedConversationId: invokeConversationId || void 0
				});
				if (consentResponse.action === "accept") await context.sendActivity(expiredUploadMessage);
				return;
			}
		}
		if (consentResponse.action === "accept" && consentResponse.uploadInfo) {
			if (pendingFile) try {
				await require_conversation_store_state.uploadToConsentUrl({
					url: consentResponse.uploadInfo.uploadUrl,
					buffer: pendingFile.buffer,
					contentType: pendingFile.contentType
				});
				const fileActivity = {
					type: "message",
					attachments: [require_conversation_store_state.buildFileInfoCard({
						filename: consentResponse.uploadInfo.name,
						contentUrl: consentResponse.uploadInfo.contentUrl,
						uniqueId: consentResponse.uploadInfo.uniqueId,
						fileType: consentResponse.uploadInfo.fileType
					})]
				};
				if (pendingFile.consentCardActivityId) try {
					await context.updateActivity({
						...fileActivity,
						id: pendingFile.consentCardActivityId
					});
				} catch {
					await context.sendActivity(fileActivity);
				}
				else await context.sendActivity(fileActivity);
			} catch (err) {
				log.error("file upload failed", {
					uploadId,
					error: require_channel_setup.formatUnknownError(err)
				});
				await context.sendActivity("File upload failed. Please try again.");
			} finally {
				require_conversation_store_state.removePendingUpload(uploadId);
				await require_conversation_store_state.removePendingUploadFs(uploadId);
			}
			else {
				log.debug?.("pending file not found for consent", { uploadId });
				await context.sendActivity(expiredUploadMessage);
			}
		} else {
			log.debug?.("user declined file consent", { uploadId });
			require_conversation_store_state.removePendingUpload(uploadId);
			await require_conversation_store_state.removePendingUploadFs(uploadId);
		}
	} catch (err) {
		log.debug?.("file consent handler error", { error: require_channel_setup.formatUnknownError(err) });
	}
}
// extensions/msteams/src/msteams-ingress.ts
const MSTEAMS_INGRESS_VERSION = 1;
const MSTEAMS_INGRESS_DRAIN_INTERVAL_MS = 500;
const MSTEAMS_INGRESS_MAX_CONCURRENT_DELIVERIES = 8;
const MSTEAMS_INGRESS_SCAN_LIMIT = 100;
const MSTeamsIngressPayloadError = (0, openclaw_plugin_sdk_channel_outbound.createChannelIngressError)("MSTeamsIngressPayloadError", { withReason: true });
function isDispatchableActivity(activity) {
	return activity.type === "message" || activity.type === "invoke" && activity.name === "adaptiveCard/action";
}
function inspectMSTeamsIngressActivity(activity) {
	if (!isDispatchableActivity(activity)) return null;
	const eventId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeNullableString)(activity.id);
	if (!eventId) throw new MSTeamsIngressPayloadError("invalid-activity", "Microsoft Teams dispatchable activity is missing activity.id.");
	const laneKey = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeNullableString)(activity.conversation?.id);
	if (!laneKey) throw new MSTeamsIngressPayloadError("invalid-activity", "Microsoft Teams dispatchable activity is missing conversation.id.");
	return {
		eventId,
		laneKey
	};
}
function parseClaimedActivity(payload, claimedId) {
	if (payload.version !== MSTEAMS_INGRESS_VERSION || typeof payload.rawActivity !== "string" || !Number.isFinite(payload.receivedAt)) throw new MSTeamsIngressPayloadError("invalid-activity", "Microsoft Teams ingress payload is invalid.");
	let activity;
	try {
		activity = JSON.parse(payload.rawActivity);
	} catch (error) {
		throw new MSTeamsIngressPayloadError("invalid-json", "Microsoft Teams ingress activity JSON is invalid.", { cause: error });
	}
	if (!activity || typeof activity !== "object" || Array.isArray(activity)) throw new MSTeamsIngressPayloadError("invalid-activity", "Microsoft Teams ingress activity must be an object.");
	const parsed = activity;
	const facts = inspectMSTeamsIngressActivity(parsed);
	if (!facts) throw new MSTeamsIngressPayloadError("unsupported-activity", "Microsoft Teams ingress row is not an agent-turn activity.");
	if (facts.eventId !== claimedId) throw new MSTeamsIngressPayloadError("invalid-activity", "Microsoft Teams activity id changed after durable admission.");
	return parsed;
}
function createMSTeamsIngress(options) {
	const queue = options.queue ?? require_runtime.getMSTeamsRuntime().state.openChannelIngressQueue({ accountId: options.accountId });
	const liveContexts = /* @__PURE__ */ new Map();
	const monitor = (0, openclaw_plugin_sdk_channel_outbound.createChannelIngressMonitor)({
		queue,
		inspect: (activity) => inspectMSTeamsIngressActivity(activity),
		payload: {
			version: MSTEAMS_INGRESS_VERSION,
			serialize: (activity, { receivedAt }) => ({
				receivedAt,
				rawActivity: JSON.stringify(activity)
			}),
			deserialize: (_body, { claim }) => parseClaimedActivity(claim.payload, claim.id),
			encode: ({ body }) => ({
				version: MSTEAMS_INGRESS_VERSION,
				...body
			}),
			decode: (payload) => ({
				version: payload.version,
				body: {
					receivedAt: payload.receivedAt,
					rawActivity: payload.rawActivity
				}
			}),
			createClaimError: (kind, claim) => new MSTeamsIngressPayloadError("invalid-activity", kind === "invalid-version" ? "Microsoft Teams ingress payload is invalid." : `Microsoft Teams ingress row ${claim.id} changed activity identity.`)
		},
		deliver: (activity, lifecycle, claim) => {
			const liveContext = liveContexts.get(claim.id);
			liveContexts.delete(claim.id);
			return options.dispatch(activity, lifecycle, liveContext);
		},
		pollIntervalMs: MSTEAMS_INGRESS_DRAIN_INTERVAL_MS,
		retention: {
			pruneIntervalMs: 0,
			failedMaxEntries: 4096
		},
		appendRetryDelaysMs: [0],
		waitForDeliveryIdleBeforeRepump: false,
		waitForDeliveryIdleOnStop: false,
		drain: {
			orderBy: "received",
			scanLimit: MSTEAMS_INGRESS_SCAN_LIMIT,
			startLimit: MSTEAMS_INGRESS_MAX_CONCURRENT_DELIVERIES,
			resolveNonRetryableFailure: (error) => {
				if (error instanceof MSTeamsIngressPayloadError) return {
					reason: error.reason,
					message: error.message
				};
				return require_channel_setup.classifyMSTeamsSendError(error).kind === "auth" ? {
					reason: "authentication-failed",
					message: (0, openclaw_plugin_sdk_error_runtime.formatErrorMessage)(error)
				} : null;
			},
			onLog: (message) => options.runtime.error?.(`msteams: ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("Microsoft Teams ingress stopped."),
		onError: (error) => options.runtime.error?.(`msteams ingress drain failed: ${(0, openclaw_plugin_sdk_error_runtime.formatErrorMessage)(error)}`)
	});
	let stopTask;
	return {
		accept: async (activity, liveContext) => {
			const facts = inspectMSTeamsIngressActivity(activity);
			if (!facts) return;
			const installedLiveContext = Boolean(liveContext) && !liveContexts.has(facts.eventId);
			if (liveContext && installedLiveContext) liveContexts.set(facts.eventId, liveContext);
			const uninstallLiveContext = () => {
				if (installedLiveContext) liveContexts.delete(facts.eventId);
			};
			let result;
			try {
				result = await monitor.admit(activity, { facts });
			} catch (error) {
				uninstallLiveContext();
				throw error;
			}
			if (result.kind === "ignored" || !(result.queueResult.kind === "accepted" || result.queueResult.kind === "pending")) uninstallLiveContext();
		},
		start: () => {
			if (!stopTask) monitor.start();
		},
		stop: () => {
			stopTask ??= (async () => {
				await monitor.pause();
				try {
					await (0, openclaw_plugin_sdk_time_runtime.raceWithTimeout)(() => monitor.waitForIdle(), require_resolve_allowlist.MSTEAMS_REQUEST_TIMEOUT_MS, () => void 0, { ref: false });
				} finally {
					await monitor.stop();
					liveContexts.clear();
				}
			})();
			return stopTask;
		}
	};
}
// extensions/msteams/src/replay-context.ts
function createMSTeamsReplayContext(activity, app, serviceUrlBoundary, accountId) {
	const rawConversationId = activity.conversation?.id ?? "";
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawConversationId);
	const conversationType = activity.conversation?.conversationType ?? "personal";
	const normalizedConversationType = conversationType.toLowerCase();
	const threadActivityId = normalizedConversationType === "channel" ? require_resolve_allowlist.extractMSTeamsConversationMessageId(rawConversationId) ?? activity.replyToId : void 0;
	const quoteActivityId = normalizedConversationType === "channel" || normalizedConversationType === "groupchat" ? activity.id : void 0;
	const tenantId = activity.channelData?.tenant?.id ?? activity.conversation?.tenantId;
	const reference = {
		activityId: activity.id,
		user: activity.from,
		agent: activity.recipient,
		conversation: {
			id: conversationId,
			conversationType,
			...tenantId ? { tenantId } : {}
		},
		channelId: activity.channelId,
		serviceUrl: activity.serviceUrl,
		locale: activity.locale,
		...tenantId ? { tenantId } : {},
		...activity.from?.aadObjectId ? { aadObjectId: activity.from.aadObjectId } : {}
	};
	const proactiveOptions = {
		accountId,
		...quoteActivityId ? { quoteActivityId } : {},
		...threadActivityId ? { threadActivityId } : {},
		serviceUrlBoundary
	};
	const sendActivity = (outbound) => require_conversation_store_state.sendMSTeamsActivityWithReference(app, reference, outbound, proactiveOptions);
	return {
		activity,
		sendActivity,
		updateActivity: async (outbound) => {
			return await require_conversation_store_state.updateMSTeamsActivityWithReference(app, reference, typeof outbound.id === "string" ? outbound.id : "", outbound, proactiveOptions);
		},
		getTeamDetails: (teamId) => app.api.teams.getById(teamId)
	};
}
// extensions/msteams/src/sso-token-store.ts
/**
* SQLite-backed store for Bot Framework OAuth SSO tokens.
*
* Tokens are keyed by (connectionName, userId). `userId` should be the
* stable AAD object ID (`activity.from.aadObjectId`) when available,
* falling back to the Bot Framework `activity.from.id`.
*/
const MSTEAMS_SSO_TOKENS_NAMESPACE = "sso-tokens";
const MSTEAMS_MAX_SSO_TOKENS = 5e3;
const STORE_KEY_VERSION_PREFIX = "v2:";
function makeMSTeamsSsoTokenStoreKey(connectionName, userId) {
	return `${STORE_KEY_VERSION_PREFIX}${(0, openclaw_plugin_sdk_node_crypto_runtime.sha256Hex)(JSON.stringify([connectionName, userId]))}`;
}
function createMSTeamsSsoTokenStoreFs(params) {
	const namespace = require_delegated_state.resolveMSTeamsAccountStateNamespace(MSTEAMS_SSO_TOKENS_NAMESPACE, params?.accountId);
	const tokenStore = require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace,
		maxEntries: MSTEAMS_MAX_SSO_TOKENS
	});
	return {
		async get({ connectionName, userId }) {
			return await tokenStore.lookup(makeMSTeamsSsoTokenStoreKey(connectionName, userId)) ?? null;
		},
		async save(token) {
			await tokenStore.register(makeMSTeamsSsoTokenStoreKey(token.connectionName, token.userId), require_delegated_state.toPluginJsonValue(token));
		},
		async remove({ connectionName, userId }) {
			return tokenStore.delete(makeMSTeamsSsoTokenStoreKey(connectionName, userId));
		}
	};
}
// extensions/msteams/src/webhook-handler.ts
/** Keep Express response ownership until the channel's route can be released. */
function createMSTeamsWebhookHandler(expressApp, warn) {
	const responses = /* @__PURE__ */ new Map();
	let closing = false;
	return {
		handler: ((req, res) => {
			if (closing) {
				res.writeHead(503, { "Retry-After": "1" });
				res.end("Service Unavailable");
				return Promise.resolve();
			}
			const response = (0, openclaw_plugin_sdk_extension_shared.createDeferred)();
			responses.set(res, response.promise);
			const done = () => {
				res.off("finish", done);
				res.off("close", done);
				responses.delete(res);
				response.resolve();
			};
			res.once("finish", done);
			res.once("close", done);
			try {
				expressApp(req, res);
			} catch (error) {
				done();
				throw error;
			}
			return response.promise;
		}),
		close: async () => {
			closing = true;
			if (responses.size === 0) return;
			try {
				await (0, openclaw_plugin_sdk_time_runtime.withTimeout)(Promise.all(responses.values()), require_resolve_allowlist.MSTEAMS_REQUEST_TIMEOUT_MS, "Microsoft Teams webhook shutdown");
			} catch {
				warn("Microsoft Teams webhook shutdown exceeded 30 seconds; closing active responses");
				for (const response of responses.keys()) response.destroy();
			}
		}
	};
}
// extensions/msteams/src/monitor.ts
async function monitorMSTeamsProvider(opts) {
	const core = require_runtime.getMSTeamsRuntime();
	const log = core.logging.getChildLogger({ name: "msteams" });
	const account = require_resolve_allowlist.resolveMSTeamsRuntimeAccount(opts);
	const { accountId, credentials: creds } = account;
	const accountPolicyCfg = opts.cfg;
	let cfg = accountPolicyCfg;
	let msteamsCfg = account.config;
	if (opts.cfg.channels?.msteams?.enabled !== true || msteamsCfg.enabled === false) {
		log.debug?.("msteams provider disabled");
		opts.statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelBlockedPatch)("Microsoft Teams provider is disabled", { running: true }));
		return;
	}
	if (!creds) {
		log.error("msteams credentials not configured");
		opts.statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelBlockedPatch)("Microsoft Teams credentials are not configured", { running: true }));
		return;
	}
	const collisionIssue = require_channel.resolveMSTeamsWebhookCollisionIssue(accountPolicyCfg);
	if (collisionIssue) throw new Error(collisionIssue);
	const appId = creds.appId;
	const runtime = opts.runtime ?? {
		log: console.log,
		error: console.error,
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	};
	cfg = require_resolve_allowlist.withAccountScopedMSTeamsConfig({
		cfg,
		accountId,
		accountConfig: msteamsCfg
	});
	const configuredAllowFrom = msteamsCfg.allowFrom;
	const configuredGroupAllowFrom = msteamsCfg.groupAllowFrom;
	let allowFrom = require_resolve_allowlist.projectStableMSTeamsUserAllowlist(configuredAllowFrom);
	let groupAllowFrom = require_resolve_allowlist.projectStableMSTeamsGroupAllowlist(configuredGroupAllowFrom ?? configuredAllowFrom);
	let teamsConfig = require_resolve_allowlist.projectStableMSTeamsTeamsConfig(msteamsCfg.teams);
	const allowNameMatching = (0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(msteamsCfg);
	const cleanAllowEntry = (entry) => entry.replace(/^(msteams|teams):/i, "").replace(/^user:/i, "").trim();
	const isStableUserId = (entry) => /^[0-9a-fA-F-]{16,}$/.test(entry);
	const cleanAllowEntries = (entries) => entries?.map((entry) => cleanAllowEntry(entry)).filter((entry) => entry && entry !== "*") ?? [];
	const isMutableUserEntry = (entry) => !isStableUserId(entry) && !/^accessGroup:/i.test(entry) && !require_resolve_allowlist.looksLikeMSTeamsConversationId(require_resolve_allowlist.normalizeMSTeamsConversationId(entry));
	const resolveAllowlistUsers = async (label, entries) => {
		const resolved = await require_resolve_allowlist.resolveMSTeamsUserAllowlist({
			cfg,
			accountId,
			entries
		});
		const additions = [];
		const unresolved = [];
		for (const entry of resolved) if (entry.resolved && entry.id) additions.push(entry.id);
		else unresolved.push(entry.input);
		const mapping = resolved.filter((entry) => entry.resolved && entry.id).map((entry) => `${entry.input}→${entry.id}`);
		(0, openclaw_plugin_sdk_allow_from.summarizeMapping)(label, mapping, unresolved, runtime);
		return {
			additions,
			unresolved
		};
	};
	try {
		if (allowNameMatching) {
			const allowEntries = cleanAllowEntries(configuredAllowFrom).filter(isMutableUserEntry);
			if (allowEntries.length > 0) {
				const { additions } = await resolveAllowlistUsers("msteams users", allowEntries);
				allowFrom = (0, openclaw_plugin_sdk_allow_from.mergeAllowlist)({
					existing: allowFrom,
					additions
				});
			}
			if (Array.isArray(configuredGroupAllowFrom) && configuredGroupAllowFrom.length > 0) {
				const groupEntries = cleanAllowEntries(configuredGroupAllowFrom).filter(isMutableUserEntry);
				if (groupEntries.length > 0) {
					const { additions } = await resolveAllowlistUsers("msteams group users", groupEntries);
					groupAllowFrom = (0, openclaw_plugin_sdk_allow_from.mergeAllowlist)({
						existing: groupAllowFrom,
						additions
					});
				}
			}
		}
		if (msteamsCfg.teams && Object.keys(msteamsCfg.teams).length > 0) {
			const resolved = await require_resolve_allowlist.resolveMSTeamsTeamsConfig({
				cfg,
				accountId,
				teamIdMode: "bot-framework",
				teams: msteamsCfg.teams
			});
			teamsConfig = resolved.teams;
			(0, openclaw_plugin_sdk_allow_from.summarizeMapping)("msteams channels", resolved.mapping, resolved.unresolved, runtime);
		}
	} catch (err) {
		runtime.error?.(`msteams resolve failed; mutable allowlist entries are disabled. ${require_channel_setup.formatUnknownError(err)}`);
	}
	if (Array.isArray(configuredGroupAllowFrom)) groupAllowFrom = require_resolve_allowlist.keepConfiguredMSTeamsAllowlistActive(configuredGroupAllowFrom, groupAllowFrom);
	if (configuredGroupAllowFrom == null && groupAllowFrom) groupAllowFrom = (0, openclaw_plugin_sdk_allow_from.mergeAllowlist)({
		existing: groupAllowFrom,
		additions: allowFrom ?? []
	});
	msteamsCfg = {
		...msteamsCfg,
		allowFrom,
		groupAllowFrom,
		teams: teamsConfig
	};
	cfg = require_resolve_allowlist.withAccountScopedMSTeamsConfig({
		cfg,
		accountId,
		accountConfig: msteamsCfg
	});
	const legacyListener = require_channel.resolveMSTeamsLegacyWebhook(msteamsCfg);
	const pathIssue = require_channel.resolveMSTeamsWebhookPathIssue({
		cfg: accountPolicyCfg,
		accountId,
		accountConfig: msteamsCfg
	});
	if (pathIssue) {
		if (!legacyListener) throw new Error(pathIssue);
		log.warn?.(pathIssue);
	}
	const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "msteams");
	const mediaMaxBytes = (0, openclaw_plugin_sdk_account_helpers.resolveChannelMediaMaxBytes)({
		cfg,
		resolveChannelLimitMb: ({ cfg: channelCfg }) => channelCfg.channels?.msteams?.mediaMaxMb
	}) ?? 8388608;
	const conversationStore = require_conversation_store_state.createMSTeamsConversationStoreState({ accountId });
	const pollStore = require_conversation_store_state.createMSTeamsPollStoreState({ accountId });
	log.info("starting provider on Gateway HTTP routes");
	const express = await import("express");
	const expressApp = express.default();
	const privateQaToken = await require_resolve_allowlist.resolveMSTeamsPrivateQaRuntime()?.token();
	expressApp.use((req, res, next) => {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith("Bearer ") || privateQaToken && !(0, openclaw_plugin_sdk_security_runtime.safeEqualSecret)(auth.slice(7), privateQaToken)) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}
		next();
	});
	expressApp.use(express.json({ limit: openclaw_plugin_sdk_webhook_ingress.DEFAULT_WEBHOOK_MAX_BODY_BYTES }));
	expressApp.use((err, _req, res, next) => {
		if (err && typeof err === "object" && "status" in err && err.status === 413) {
			res.status(413).json({ error: "Payload too large" });
			return;
		}
		next(err);
	});
	const configuredPath = msteamsCfg.webhook?.path || "/api/messages";
	const ssoConnectionName = msteamsCfg.sso?.enabled && msteamsCfg.sso.connectionName ? msteamsCfg.sso.connectionName : void 0;
	const { app } = await require_resolve_allowlist.loadMSTeamsSdkWithAuth(creds, {
		...require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg),
		httpServerAdapter: await require_resolve_allowlist.createMSTeamsExpressAdapter(expressApp),
		messagingEndpoint: configuredPath,
		...ssoConnectionName ? { oauthDefaultConnectionName: ssoConnectionName } : {}
	});
	if (accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID && configuredPath !== "/api/messages") {
		let warnedLegacyMessagesRoute = false;
		expressApp.post("/api/messages", (req, res, next) => {
			if (!warnedLegacyMessagesRoute) {
				warnedLegacyMessagesRoute = true;
				log.warn?.(`received request on /api/messages but webhook.path is ${configuredPath}; update your Azure Bot endpoint — this fallback will be removed in a future release`);
			}
			req.url = configuredPath;
			expressApp(req, res, next);
		});
	}
	const tokenProvider = require_resolve_allowlist.createMSTeamsTokenProvider(app);
	const ssoDeps = ssoConnectionName ? {
		tokenStore: createMSTeamsSsoTokenStoreFs({ accountId }),
		connectionName: ssoConnectionName
	} : void 0;
	if (ssoDeps) log.debug?.("msteams sso enabled", { connectionName: ssoDeps.connectionName });
	const handlerDeps = {
		cfg,
		accountPolicyCfg,
		accountId,
		runtime,
		appId,
		app,
		tokenProvider,
		textLimit,
		mediaMaxBytes,
		conversationStore,
		pollStore,
		log
	};
	handlerDeps.readConfig = createMSTeamsHandlerConfigReader(handlerDeps);
	const handleActivity = createMSTeamsActivityHandler(handlerDeps);
	const ingress = createMSTeamsIngress({
		accountId: appId,
		runtime,
		dispatch: async (activity, lifecycle, liveContext) => {
			if (liveContext) liveContext.activity = activity;
			const context = liveContext ?? createMSTeamsReplayContext(activity, app, require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg), accountId);
			return await handleActivity(context, lifecycle);
		}
	});
	app.on("card.action", async (ctx) => {
		const adaptedCtx = adaptSdkContext(ctx, app);
		try {
			const activity = adaptedCtx.activity;
			const vote = require_conversation_store_state.extractMSTeamsPollVote(activity);
			if (vote) {
				const voterId = activity?.from?.aadObjectId ?? activity?.from?.id ?? "unknown";
				try {
					if (!await isMSTeamsInvokeAuthorized({
						context: adaptedCtx,
						deps: handlerDeps,
						invokeKind: "card action"
					})) return cardActionMessage("Not authorized.");
					const existingPoll = await pollStore.getPoll(vote.pollId);
					if (!existingPoll) {
						log.debug?.("poll vote ignored (poll not found)", { pollId: vote.pollId });
						return cardActionMessage("Poll not found.");
					}
					const pollConversationId = existingPoll.conversationId ? require_resolve_allowlist.normalizeMSTeamsConversationId(existingPoll.conversationId) : void 0;
					const activityConversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(activity?.conversation?.id ?? "");
					if (pollConversationId && pollConversationId !== activityConversationId) {
						log.info("poll vote ignored (conversation mismatch)", {
							pollId: vote.pollId,
							expectedConversationId: pollConversationId,
							receivedConversationId: activityConversationId || void 0
						});
						return cardActionMessage("Poll not found.");
					}
					if (await pollStore.recordVote({
						pollId: vote.pollId,
						voterId,
						selections: vote.selections
					})) {
						log.info("recorded poll vote", {
							pollId: vote.pollId,
							voterId
						});
						return cardActionMessage("Vote recorded.");
					}
					log.debug?.("poll vote ignored (poll not found)", { pollId: vote.pollId });
					return cardActionMessage("Poll not found.");
				} catch (err) {
					log.error("failed to record poll vote", {
						pollId: vote.pollId,
						error: require_channel_setup.formatUnknownError(err)
					});
					return cardActionError("RECORD_VOTE_FAILED", "Could not record vote.");
				}
			}
			await ingress.accept(activity, adaptedCtx);
			return cardActionMessage("OK");
		} catch (err) {
			log.error("msteams card.action failed", { error: require_channel_setup.formatUnknownError(err) });
			return cardActionError("CARD_ACTION_FAILED", "Card action failed.");
		}
	});
	app.on("file.consent.accept", (ctx) => {
		runMSTeamsFileConsentInvokeHandler(adaptSdkContext(ctx, app), log);
	});
	app.on("file.consent.decline", (ctx) => {
		runMSTeamsFileConsentInvokeHandler(adaptSdkContext(ctx, app), log);
	});
	const processActivity = app.process.bind(app);
	app.process = async (event) => {
		const activity = event.body;
		if (activity.type !== "invoke" || !("name" in activity) || activity.name !== "signin/tokenExchange" && activity.name !== "signin/verifyState") return processActivity(event);
		if (!await isMSTeamsInvokeAuthorized({
			context: { activity: {
				...activity,
				type: activity.type,
				name: activity.name
			} },
			deps: handlerDeps,
			invokeKind: "signin"
		})) return {
			status: 200,
			body: {}
		};
		if (!ssoDeps) {
			log.debug?.("signin invoke received but msteams.sso is not configured", { name: activity.name });
			return {
				status: 200,
				body: {}
			};
		}
		return processActivity(event);
	};
	if (ssoDeps) app.event("signin", (ctx) => {
		(async () => {
			if (!await isMSTeamsInvokeAuthorized({
				context: adaptSdkContext(ctx, app),
				deps: handlerDeps,
				invokeKind: "signin"
			})) return;
			const activity = ctx.activity;
			const userIds = Array.from(new Set([activity.from?.id, activity.from?.aadObjectId].filter((id) => Boolean(id))));
			const connectionName = ctx.token.connectionName || ssoDeps.connectionName;
			if (!connectionName || !ctx.token.token || userIds.length === 0) {
				log.warn?.("msteams sso signin event missing token metadata", {
					hasConnectionName: Boolean(connectionName),
					hasToken: Boolean(ctx.token.token),
					hasUser: userIds.length > 0
				});
				return;
			}
			await Promise.all(userIds.map((userId) => ssoDeps.tokenStore.save({
				...accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID ? {} : { accountId },
				connectionName,
				userId,
				token: ctx.token.token,
				expiresAt: ctx.token.expiration,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			})));
			log.info("msteams sso token persisted", {
				connectionName,
				userIdCount: userIds.length,
				hasExpiry: Boolean(ctx.token.expiration)
			});
		})().catch((err) => {
			log.error("msteams sso token persistence failed", { error: require_channel_setup.formatUnknownError(err) });
		});
	});
	app.on("message.submit", async (ctx) => {
		if (!await runMSTeamsFeedbackInvokeHandler(adaptSdkContext(ctx, app), handlerDeps)) await ctx.next?.call(ctx);
	});
	app.on("activity", async (ctx) => {
		const adaptedCtx = adaptSdkContext(ctx, app);
		const activity = adaptedCtx.activity;
		if (activity?.type === "invoke") {
			if (activity?.name === "adaptiveCard/action") return;
			if (activity?.name === "fileConsent/invoke") return;
			if (activity?.name === "signin/tokenExchange" || activity?.name === "signin/verifyState") return;
		}
		if (activity?.type === "message") {
			await ingress.accept(activity, adaptedCtx);
			return;
		}
		try {
			await handleActivity(adaptedCtx);
		} catch (err) {
			log.error("msteams non-turn activity failed", { error: require_channel_setup.formatUnknownError(err) });
		}
	});
	await app.initialize();
	ingress.start();
	const unregisterRoutes = [];
	const webhook = createMSTeamsWebhookHandler(expressApp, (message) => log.warn?.(message));
	try {
		unregisterRoutes.push((0, openclaw_plugin_sdk_webhook_targets.registerPluginHttpRoute)({
			path: configuredPath,
			auth: "plugin",
			pluginId: "msteams",
			source: "msteams-webhook",
			accountId,
			handler: webhook.handler,
			legacyListener: legacyListener ? {
				...legacyListener,
				timeouts: {
					headers: 15e3,
					request: 3e4,
					socket: 3e4
				}
			} : void 0,
			throwOnFailure: true,
			log: (message) => log.warn?.(message)
		}));
		const legacyMessagesOwner = require_channel.resolveMSTeamsLegacyMessagesOwner(accountPolicyCfg);
		if (accountId === openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID && !legacyMessagesOwner) unregisterRoutes.push((0, openclaw_plugin_sdk_webhook_targets.registerPluginHttpRoute)({
			path: "/api/messages",
			auth: "plugin",
			pluginId: "msteams",
			source: "msteams-webhook",
			accountId,
			handler: webhook.handler,
			log: (message) => log.warn?.(message)
		}));
	} catch (error) {
		for (const unregister of unregisterRoutes) unregister();
		await ingress.stop();
		throw error;
	}
	log.info(`msteams provider started on Gateway route ${configuredPath}`);
	opts.statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelReadyPatch)());
	try {
		await (0, openclaw_plugin_sdk_channel_outbound.waitUntilAbort)(opts.abortSignal);
	} finally {
		await webhook.close();
		for (const unregister of unregisterRoutes) unregister();
		await ingress.stop();
		opts.statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelStoppedPatch)());
	}
}
function cardActionMessage(value) {
	return {
		statusCode: 200,
		type: "application/vnd.microsoft.activity.message",
		value
	};
}
function cardActionError(code, message) {
	return {
		statusCode: 500,
		type: "application/vnd.microsoft.error",
		value: {
			code,
			message,
			innerHttpError: {
				statusCode: 500,
				body: null
			}
		}
	};
}
/**
* Adapt a new @microsoft/teams.apps SDK context to the MSTeamsTurnContext interface
* our handlers expect. The new SDK uses reply()/send() instead of sendActivity().
*/
function adaptSdkContext(ctx, app) {
	const sdkCtx = ctx ?? {};
	if (typeof sdkCtx.reply !== "function" && typeof sdkCtx.send !== "function") return ctx;
	const conversationId = sdkCtx.activity?.conversation?.id ?? "";
	const inboundApi = sdkCtx.api;
	const activityApi = inboundApi ?? app.api;
	const getTeamDetails = inboundApi ? (teamId) => inboundApi.teams.getById(teamId) : void 0;
	const conversationType = (sdkCtx.activity?.conversation?.conversationType ?? "").toLowerCase();
	const isThreadable = conversationType === "channel" || conversationType === "groupchat";
	const sendActivity = (activity) => isThreadable ? sdkCtx.reply(activity) : sdkCtx.send(activity);
	return Object.assign(Object.create(Object.getPrototypeOf(ctx)), ctx, {
		sendActivity,
		updateActivity: async (activity) => {
			const activityId = activity.id ?? "";
			return activityApi.conversations.activities(conversationId).update(activityId, activity);
		},
		getTeamDetails,
		stream: sdkCtx.stream
	});
}
exports.monitorMSTeamsProvider = monitorMSTeamsProvider;

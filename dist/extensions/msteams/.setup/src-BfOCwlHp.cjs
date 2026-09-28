const require_rolldown_runtime = require("./rolldown-runtime-VH7oDXx4.cjs");
const require_runtime = require("./runtime-gZTAuFux.cjs");
require("../runtime-api.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-CHzaaWiC.cjs");
const require_channel = require("./channel-BDp16XRR.cjs");
const require_thread_session = require("./thread-session-CXgHK-yi.cjs");
const require_channel_setup = require("./channel.setup-BVDfgdCc.cjs");
const require_polls = require("./polls-BJ4-4uZm.cjs");
const require_sso_token_store = require("./sso-token-store-YYLHXgFH.cjs");
const require_approval_card = require("./approval-card-CPNH_q3P.cjs");
const require_messenger = require("./messenger-8RA1FUJa.cjs");
const require_reaction_types = require("./reaction-types-C7RA7Wxt.cjs");
let openclaw_plugin_sdk_channel_outbound = require("openclaw/plugin-sdk/channel-outbound");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_allow_from = require("openclaw/plugin-sdk/allow-from");
let openclaw_plugin_sdk_provider_http = require("openclaw/plugin-sdk/provider-http");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_media_runtime = require("openclaw/plugin-sdk/media-runtime");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_number_runtime = require("openclaw/plugin-sdk/number-runtime");
let openclaw_plugin_sdk_text_utility_runtime = require("openclaw/plugin-sdk/text-utility-runtime");
let openclaw_plugin_sdk_error_runtime = require("openclaw/plugin-sdk/error-runtime");
let openclaw_plugin_sdk_routing = require("openclaw/plugin-sdk/routing");
let node_crypto = require("node:crypto");
node_crypto = require_rolldown_runtime.__toESM(node_crypto, 1);
let openclaw_plugin_sdk_channel_inbound = require("openclaw/plugin-sdk/channel-inbound");
let openclaw_plugin_sdk_approval_gateway_runtime = require("openclaw/plugin-sdk/approval-gateway-runtime");
let openclaw_plugin_sdk_channel_ingress_runtime = require("openclaw/plugin-sdk/channel-ingress-runtime");
let openclaw_plugin_sdk_context_visibility_runtime = require("openclaw/plugin-sdk/context-visibility-runtime");
let openclaw_plugin_sdk_reply_history = require("openclaw/plugin-sdk/reply-history");
let openclaw_plugin_sdk_runtime_config_snapshot = require("openclaw/plugin-sdk/runtime-config-snapshot");
let openclaw_plugin_sdk_agent_runtime = require("openclaw/plugin-sdk/agent-runtime");
let openclaw_plugin_sdk_extension_shared = require("openclaw/plugin-sdk/extension-shared");
let openclaw_plugin_sdk_plugin_runtime = require("openclaw/plugin-sdk/plugin-runtime");
let openclaw_plugin_sdk_dedupe_runtime = require("openclaw/plugin-sdk/dedupe-runtime");
let openclaw_plugin_sdk_plugin_state_runtime = require("openclaw/plugin-sdk/plugin-state-runtime");
let openclaw_plugin_sdk_collection_runtime = require("openclaw/plugin-sdk/collection-runtime");
let openclaw_plugin_sdk_gateway_runtime = require("openclaw/plugin-sdk/gateway-runtime");
let openclaw_plugin_sdk_channel_pairing = require("openclaw/plugin-sdk/channel-pairing");
let openclaw_plugin_sdk_runtime_group_policy = require("openclaw/plugin-sdk/runtime-group-policy");
let openclaw_plugin_sdk_dangerous_name_runtime = require("openclaw/plugin-sdk/dangerous-name-runtime");
let openclaw_plugin_sdk_account_helpers = require("openclaw/plugin-sdk/account-helpers");
let openclaw_plugin_sdk_webhook_ingress = require("openclaw/plugin-sdk/webhook-ingress");
//#region extensions/msteams/src/feedback-reflection-store.ts
const LEARNINGS_NAMESPACE = "feedback-learnings";
const MAX_LEARNING_ENTRIES = 1e4;
function learningStoreKey(storePath, sessionKey) {
	return node_crypto.default.createHash("sha256").update(`${storePath}\0${sessionKey}`, "utf8").digest("hex");
}
function appendFeedbackLearning(current, prepared) {
	return {
		sessionKey: prepared.sessionKey,
		learnings: [...current?.learnings ?? [], prepared.learning].slice(-10),
		updatedAt: prepared.updatedAt
	};
}
async function storeSessionLearning(params) {
	const store = require_runtime.getMSTeamsRuntime().state.openKeyedStore({
		namespace: LEARNINGS_NAMESPACE,
		maxEntries: MAX_LEARNING_ENTRIES
	});
	const key = learningStoreKey(params.storePath, params.sessionKey);
	if (!store.observe || !store.compareAndApply) throw new Error("plugin state atomic comparison is unavailable");
	const prepared = {
		sessionKey: params.sessionKey,
		learning: params.learning,
		updatedAt: Date.now()
	};
	let observed = await store.observe(key);
	while (true) {
		const result = await store.compareAndApply(key, observed.comparison, {
			operation: "update",
			action: "set",
			value: appendFeedbackLearning(observed.value, prepared)
		});
		if (result.status !== "conflict") return;
		observed = result.current;
	}
}
//#endregion
//#region extensions/msteams/src/feedback-reflection.ts
function buildFeedbackEvent(params) {
	return {
		type: "custom",
		event: "feedback",
		ts: Date.now(),
		messageId: params.messageId,
		value: params.value,
		comment: params.comment,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		conversationId: params.conversationId
	};
}
/**
* Run a background reflection after negative feedback.
* This is designed to be called fire-and-forget (don't await in the invoke handler).
*/
async function runFeedbackReflection(params) {
	const { cfg, log, sessionKey } = params;
	const cooldownMs = cfg.channels?.msteams?.feedbackReflectionCooldownMs ?? openclaw_plugin_sdk_channel_inbound.DEFAULT_CHANNEL_FEEDBACK_REFLECTION_COOLDOWN_MS;
	let reflection;
	try {
		reflection = await (0, openclaw_plugin_sdk_channel_inbound.runChannelFeedbackReflection)({
			cfg,
			channel: "msteams",
			channelLabel: "Teams",
			agentId: params.agentId,
			sessionKey,
			conversationId: params.conversationId,
			conversationKind: params.conversationKind,
			thumbedDownResponse: params.thumbedDownResponse,
			userComment: params.userComment,
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
	log.info("reflection complete", {
		sessionKey,
		responseLength: reflection.responseLength,
		followUp: reflection.followUp
	});
	try {
		await storeSessionLearning({
			storePath: reflection.storePath,
			sessionKey,
			learning: reflection.learning
		});
	} catch (err) {
		log.debug?.("failed to store reflection learning", { error: require_channel_setup.formatUnknownError(err) });
	}
	const conversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationRef.conversation?.conversationType);
	if (!(conversationType === "personal" && reflection.followUp && Boolean(reflection.userMessage))) {
		if (reflection.followUp && conversationType !== "personal") log.debug?.("skipping reflection follow-up outside direct message", {
			sessionKey,
			conversationType
		});
		return;
	}
	try {
		await require_messenger.sendMSTeamsActivityWithReference(params.app, require_messenger.buildConversationReference(params.conversationRef), {
			type: "message",
			text: reflection.userMessage
		}, { serviceUrlBoundary: require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(cfg.channels?.msteams) });
		log.info("sent reflection follow-up", { sessionKey });
	} catch (err) {
		log.debug?.("failed to send reflection follow-up", { error: require_channel_setup.formatUnknownError(err) });
	}
}
//#endregion
//#region extensions/msteams/src/adaptive-card-submit.ts
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
	const imBackValue = readMSTeamsImBackValue(submittedValue);
	if (imBackValue) return imBackValue;
	if (submittedValue == null) return null;
	try {
		return JSON.stringify(submittedValue);
	} catch {
		return null;
	}
}
//#endregion
//#region extensions/msteams/src/approval-card-submit.ts
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
	if (binding.accountId !== openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) {
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
	const senderId = context.activity.from?.aadObjectId;
	if (!(require_thread_session.msTeamsApprovalAuth.authorizeActorAction?.({
		cfg: deps.cfg,
		accountId: openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID,
		senderId,
		action: "approve",
		approvalKind: binding.approvalKind
	}))?.authorized) {
		ignored(`unauthorized actor ${senderId || "unknown"}`);
		return true;
	}
	const outcome = await require_approval_card.msTeamsApprovalControls.settle(token, async (consumed) => {
		const result = await (0, openclaw_plugin_sdk_approval_gateway_runtime.resolveApprovalOverGateway)({
			cfg: deps.cfg,
			approvalId: consumed.approvalId,
			approvalKind: consumed.approvalKind,
			decision: consumed.decision,
			channel: "msteams",
			accountId: openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID,
			senderId
		});
		await context.updateActivity({
			type: "message",
			id: consumed.activityId,
			attachments: [{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: require_approval_card.buildMSTeamsCanonicalApprovalTerminalCard(result)
			}]
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
//#endregion
//#region extensions/msteams/src/monitor-handler/access.ts
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
	const msteamsCfg = params.cfg.channels?.msteams;
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
		accountId: openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID
	});
	const dmPolicy = msteamsCfg?.dmPolicy ?? "pairing";
	const configuredDmAllowFrom = msteamsCfg?.allowFrom ?? [];
	const groupAllowFrom = msteamsCfg?.groupAllowFrom;
	const defaultGroupPolicy = (0, openclaw_plugin_sdk_runtime_group_policy.resolveDefaultGroupPolicy)(params.cfg);
	const groupPolicy = !isDirectMessage && msteamsCfg ? msteamsCfg.groupPolicy ?? defaultGroupPolicy ?? "allowlist" : "disabled";
	const allowNameMatching = (0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(msteamsCfg);
	const channelGate = require_channel.resolveMSTeamsRouteConfig({
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
		activity: params.activity,
		hasControlCommand: isControlCommand
	});
	const { dmPolicy, senderId, senderName, pairing, isDirectMessage, hasConflictingConversationScope, channelGate, senderAccess, commandAccess, allowNameMatching, groupPolicy, msteamsCfg } = access;
	const effectiveDmAllowFrom = senderAccess.effectiveAllowFrom;
	const effectiveGroupAllowFrom = senderAccess.effectiveGroupAllowFrom;
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
		const allowMatch = require_channel.resolveMSTeamsAllowlistMatch({
			allowFrom: effectiveDmAllowFrom,
			senderId,
			senderName,
			allowNameMatching
		});
		if (senderAccess.decision === "pairing") {
			params.conversationStore.upsert(params.conversationId, params.conversationRef).catch((err) => {
				params.log.debug?.("failed to save conversation reference", { error: require_channel_setup.formatUnknownError(err) });
			});
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
		if (channelGate.allowlistConfigured && !channelGate.allowed) {
			params.log.info("dropping group message (not in team/channel allowlist)", {
				conversationId: params.conversationId,
				teamKey: channelGate.teamKey ?? "none",
				channelKey: channelGate.channelKey ?? "none",
				channelMatchKey: channelGate.channelMatchKey ?? "none",
				channelMatchSource: channelGate.channelMatchSource ?? "none"
			});
			params.log.debug?.("dropping group message (not in team/channel allowlist)", {
				conversationId: params.conversationId,
				teamKey: channelGate.teamKey ?? "none",
				channelKey: channelGate.channelKey ?? "none",
				channelMatchKey: channelGate.channelMatchKey ?? "none",
				channelMatchSource: channelGate.channelMatchSource ?? "none"
			});
			return null;
		}
		if (!senderAccess.allowed && senderAccess.reasonCode === "group_policy_disabled") {
			params.log.info("dropping group message (groupPolicy: disabled)", { conversationId: params.conversationId });
			params.log.debug?.("dropping group message (groupPolicy: disabled)", { conversationId: params.conversationId });
			return null;
		}
		if (!senderAccess.allowed && (senderAccess.reasonCode === "group_policy_empty_allowlist" || senderAccess.reasonCode === "route_sender_empty")) {
			params.log.info("dropping group message (groupPolicy: allowlist, no allowlist)", { conversationId: params.conversationId });
			params.log.debug?.("dropping group message (groupPolicy: allowlist, no allowlist)", { conversationId: params.conversationId });
			return null;
		}
		if (!senderAccess.allowed) {
			const allowMatch = require_channel.resolveMSTeamsAllowlistMatch({
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
	params.conversationStore.upsert(params.conversationId, params.conversationRef).catch((err) => {
		params.log.debug?.("failed to save conversation reference", { error: require_channel_setup.formatUnknownError(err) });
	});
	return {
		...access,
		allowTextCommands,
		isControlCommand,
		commandAuthorized: commandAccess.requested ? commandAccess.authorized : void 0,
		effectiveDmAllowFrom,
		effectiveGroupAllowFrom,
		isChannel: params.isChannel
	};
}
//#endregion
//#region extensions/msteams/src/attachments/bot-framework.ts
/**
* Bot Framework Service token scope for requesting a token used against
* the Bot Connector (v3) REST endpoints such as `/v3/attachments/{id}`.
*/
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
function normalizeServiceUrl(serviceUrl) {
	return serviceUrl.replace(/\/+$/, "");
}
function buildBotFrameworkAttachmentHeaders(params) {
	const headers = require_resolve_allowlist.ensureUserAgentHeader();
	require_resolve_allowlist.applyAuthorizationHeaderForUrl({
		headers,
		url: params.url,
		authAllowHosts: params.policy.authAllowHosts,
		bearerToken: params.accessToken
	});
	return headers;
}
async function fetchBotFrameworkAttachmentInfo(params) {
	const url = `${normalizeServiceUrl(params.serviceUrl)}/v3/attachments/${encodeURIComponent(params.attachmentId)}`;
	let response;
	try {
		response = await require_resolve_allowlist.safeFetchWithPolicy({
			url,
			policy: params.policy,
			fetchFn: params.fetchFn,
			fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
			resolveFn: params.resolveFn,
			requestInit: { headers: buildBotFrameworkAttachmentHeaders({
				url,
				accessToken: params.accessToken,
				policy: params.policy
			}) },
			timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
		});
	} catch (err) {
		params.logger?.warn?.("msteams botFramework attachmentInfo fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		params.logger?.warn?.("msteams botFramework attachmentInfo non-ok", { status: response.status });
		return;
	}
	try {
		return await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(response, "msteams botFramework attachmentInfo");
	} catch (err) {
		params.logger?.warn?.("msteams botFramework attachmentInfo parse failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
}
async function saveBotFrameworkAttachmentView(params) {
	const url = `${normalizeServiceUrl(params.serviceUrl)}/v3/attachments/${encodeURIComponent(params.attachmentId)}/views/${encodeURIComponent(params.viewId)}`;
	let response;
	try {
		response = await require_resolve_allowlist.safeFetchWithPolicy({
			url,
			policy: params.policy,
			fetchFn: params.fetchFn,
			fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
			resolveFn: params.resolveFn,
			requestInit: { headers: buildBotFrameworkAttachmentHeaders({
				url,
				accessToken: params.accessToken,
				policy: params.policy
			}) },
			timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
		});
	} catch (err) {
		params.logger?.warn?.("msteams botFramework attachmentView fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
	if (!response.ok) {
		await response.body?.cancel().catch(() => void 0);
		params.logger?.warn?.("msteams botFramework attachmentView non-ok", { status: response.status });
		return;
	}
	let contentLength;
	try {
		contentLength = (0, openclaw_plugin_sdk_media_runtime.parseMediaContentLength)(response.headers.get("content-length"));
	} catch (err) {
		await response.body?.cancel().catch(() => void 0);
		params.logger?.warn?.("msteams botFramework attachmentView invalid content-length", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	}
	if (contentLength !== null && contentLength > params.maxBytes) {
		await response.body?.cancel().catch(() => void 0);
		return;
	}
	try {
		return await require_runtime.getMSTeamsRuntime().channel.media.saveResponseMedia(response, {
			sourceUrl: url,
			filePathHint: params.fileNameHint,
			maxBytes: params.maxBytes,
			fallbackContentType: params.contentTypeHint,
			subdir: "inbound",
			originalFilename: params.preserveFilenames ? params.fileNameHint : void 0
		});
	} catch (err) {
		params.logger?.warn?.("msteams botFramework attachmentView save failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return;
	} finally {
		await response.body?.cancel().catch(() => void 0);
	}
}
/**
* Download media for a single attachment via the Bot Framework v3 attachments
* endpoint. Used for personal DM conversations where the Graph `/chats/{id}`
* path is not usable because the Bot Framework conversation ID (`a:...`) is
* not a valid Graph chat identifier.
*/
async function downloadMSTeamsBotFrameworkAttachment(params) {
	if (!params.serviceUrl || !params.attachmentId || !params.tokenProvider) return;
	const tokenProvider = params.tokenProvider;
	const policy = require_resolve_allowlist.resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const baseUrl = `${normalizeServiceUrl(params.serviceUrl)}/v3/attachments/${encodeURIComponent(params.attachmentId)}`;
	if (!require_resolve_allowlist.isUrlAllowed(baseUrl, policy.allowHosts)) return;
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
	const info = await fetchBotFrameworkAttachmentInfo({
		serviceUrl: params.serviceUrl,
		attachmentId: params.attachmentId,
		accessToken,
		policy,
		fetchFn: params.fetchFn,
		fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
		resolveFn: params.resolveFn,
		logger: params.logger,
		deadline: params.deadline
	});
	if (!info) return;
	const views = Array.isArray(info.views) ? info.views : [];
	const candidateView = views.find((view) => view?.viewId === "original") ?? views.find((view) => typeof view?.viewId === "string");
	const viewId = typeof candidateView?.viewId === "string" && candidateView.viewId ? candidateView.viewId : void 0;
	if (!viewId) return;
	if (typeof candidateView?.size === "number" && candidateView.size > 0 && candidateView.size > params.maxBytes) return;
	const fileNameHint = typeof params.fileNameHint === "string" && params.fileNameHint || typeof info.name === "string" && info.name || void 0;
	const contentTypeHint = typeof params.contentTypeHint === "string" && params.contentTypeHint || typeof info.type === "string" && info.type || void 0;
	const saved = await saveBotFrameworkAttachmentView({
		serviceUrl: params.serviceUrl,
		attachmentId: params.attachmentId,
		viewId,
		accessToken,
		maxBytes: params.maxBytes,
		fileNameHint,
		contentTypeHint,
		preserveFilenames: params.preserveFilenames,
		policy,
		fetchFn: params.fetchFn,
		fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
		resolveFn: params.resolveFn,
		logger: params.logger,
		deadline: params.deadline
	});
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
	const seen = /* @__PURE__ */ new Set();
	const unique = [];
	for (const id of params.attachmentIds ?? []) {
		if (typeof id !== "string") continue;
		const trimmed = id.trim();
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		unique.push(trimmed);
	}
	if (unique.length === 0 || !params.serviceUrl || !params.tokenProvider) return {
		media: [],
		attachmentCount: unique.length
	};
	const media = [];
	for (const attachmentId of unique) try {
		const item = await downloadMSTeamsBotFrameworkAttachment({
			serviceUrl: params.serviceUrl,
			attachmentId,
			tokenProvider: params.tokenProvider,
			maxBytes: params.maxBytes,
			allowHosts: params.allowHosts,
			authAllowHosts: params.authAllowHosts,
			fetchFn: params.fetchFn,
			fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
			resolveFn: params.resolveFn,
			deadline: params.deadline,
			fileNameHint: params.fileNameHint,
			contentTypeHint: params.contentTypeHint,
			preserveFilenames: params.preserveFilenames,
			logger: params.logger
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
//#endregion
//#region extensions/msteams/src/attachments/html.ts
/**
* Extract every `<attachment id="...">` reference from the HTML attachments in
* the inbound activity. Returns the complete (non-sliced) list; callers that
* need a capped diagnostic summary can truncate after calling this helper.
*/
function extractMSTeamsHtmlAttachmentIds(attachments) {
	const list = Array.isArray(attachments) ? attachments : [];
	if (list.length === 0) return [];
	const ids = /* @__PURE__ */ new Set();
	for (const att of list) {
		const html = require_resolve_allowlist.extractHtmlFromAttachment(att);
		if (!html) continue;
		require_resolve_allowlist.ATTACHMENT_TAG_RE.lastIndex = 0;
		let match = require_resolve_allowlist.ATTACHMENT_TAG_RE.exec(html);
		while (match) {
			const id = match[1]?.trim();
			if (id) ids.add(id);
			match = require_resolve_allowlist.ATTACHMENT_TAG_RE.exec(html);
		}
	}
	return Array.from(ids);
}
function summarizeMSTeamsHtmlAttachments(attachments) {
	const list = Array.isArray(attachments) ? attachments : [];
	if (list.length === 0) return;
	let htmlAttachments = 0;
	let imgTags = 0;
	let dataImages = 0;
	let cidImages = 0;
	const srcHosts = /* @__PURE__ */ new Set();
	let attachmentTags = 0;
	const attachmentIds = /* @__PURE__ */ new Set();
	for (const att of list) {
		const html = require_resolve_allowlist.extractHtmlFromAttachment(att);
		if (!html) continue;
		htmlAttachments += 1;
		require_resolve_allowlist.IMG_SRC_RE.lastIndex = 0;
		let match = require_resolve_allowlist.IMG_SRC_RE.exec(html);
		while (match) {
			imgTags += 1;
			const src = match[1]?.trim();
			if (src) {
				if (src.startsWith("data:")) dataImages += 1;
				else if (src.startsWith("cid:")) cidImages += 1;
				else srcHosts.add(require_resolve_allowlist.safeHostForUrl(src));
			}
			match = require_resolve_allowlist.IMG_SRC_RE.exec(html);
		}
		require_resolve_allowlist.ATTACHMENT_TAG_RE.lastIndex = 0;
		let attachmentMatch = require_resolve_allowlist.ATTACHMENT_TAG_RE.exec(html);
		while (attachmentMatch) {
			attachmentTags += 1;
			const id = attachmentMatch[1]?.trim();
			if (id) attachmentIds.add(id);
			attachmentMatch = require_resolve_allowlist.ATTACHMENT_TAG_RE.exec(html);
		}
	}
	if (htmlAttachments === 0) return;
	return {
		htmlAttachments,
		imgTags,
		dataImages,
		cidImages,
		srcHosts: Array.from(srcHosts).slice(0, 5),
		attachmentTags,
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
	const media = { kind };
	if (sourceId) media.sourceId = sourceId;
	return media;
}
function resolveMSTeamsAdvertisedMedia(attachments) {
	const list = Array.isArray(attachments) ? attachments : [];
	if (list.length === 0) return [];
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
//#endregion
//#region extensions/msteams/src/attachments/remote-media.ts
/**
* Direct save path used when the caller supplies the already-guarded fetch
* implementation. This lets Teams-specific auth fallback own the request
* sequence while keeping redirect and DNS pinning inside `safeFetchWithPolicy`.
*/
async function saveRemoteMediaDirect(params) {
	const response = await params.fetchImpl(params.url, { redirect: "follow" });
	try {
		return await (0, openclaw_plugin_sdk_media_runtime.saveResponseMedia)(response, {
			sourceUrl: params.url,
			filePathHint: params.filePathHint,
			maxBytes: params.maxBytes,
			fallbackContentType: params.contentTypeHint,
			originalFilename: params.originalFilename
		});
	} finally {
		await response.body?.cancel().catch(() => void 0);
	}
}
async function downloadAndStoreMSTeamsRemoteMedia(params) {
	const originalFilename = params.preserveFilenames ? params.filePathHint : void 0;
	let saved;
	if (params.useDirectFetch && params.fetchImpl) saved = await saveRemoteMediaDirect({
		url: params.url,
		filePathHint: params.filePathHint,
		fetchImpl: params.fetchImpl,
		maxBytes: params.maxBytes,
		contentTypeHint: params.contentTypeHint,
		originalFilename
	});
	else saved = await require_runtime.getMSTeamsRuntime().channel.media.saveRemoteMedia({
		url: params.url,
		fetchImpl: params.fetchImpl,
		filePathHint: params.filePathHint,
		maxBytes: params.maxBytes,
		ssrfPolicy: params.ssrfPolicy,
		fallbackContentType: params.contentTypeHint,
		originalFilename
	});
	return {
		path: saved.path,
		contentType: saved.contentType,
		kind: params.kind ?? require_resolve_allowlist.resolveMSTeamsMediaKind({
			contentType: saved.contentType,
			fileName: params.filePathHint
		})
	};
}
//#endregion
//#region extensions/msteams/src/attachments/download.ts
function withSourceId(media, sourceId) {
	return sourceId ? {
		...media,
		sourceId
	} : media;
}
function resolveDownloadCandidate(att) {
	const contentType = require_resolve_allowlist.normalizeContentType(att.contentType);
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
	const contentUrl = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(att.contentUrl) ?? "";
	if (!contentUrl) return null;
	const sharesUrl = require_resolve_allowlist.tryBuildGraphSharesUrlForSharedLink(contentUrl);
	const resolvedUrl = sharesUrl ?? contentUrl;
	const resolvedContentTypeHint = sharesUrl ? void 0 : contentType;
	return {
		kind: "remote",
		mediaKind: require_resolve_allowlist.resolveMSTeamsMediaKind({
			contentType,
			fileName: name
		}),
		url: resolvedUrl,
		fileHint: name || void 0,
		contentTypeHint: resolvedContentTypeHint,
		sourceId: att.id?.trim() || void 0
	};
}
function scopeCandidatesForUrl(url) {
	try {
		const host = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(new URL(url).hostname);
		return host.endsWith("graph.microsoft.com") || host.endsWith("sharepoint.com") || host.endsWith("1drv.ms") || host.includes("sharepoint") ? ["https://graph.microsoft.com", "https://api.botframework.com"] : ["https://api.botframework.com", "https://graph.microsoft.com"];
	} catch {
		return ["https://api.botframework.com", "https://graph.microsoft.com"];
	}
}
function canonicalizeInlineBase64Payload(value) {
	let cleaned = "";
	let padding = 0;
	let sawPadding = false;
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 32) continue;
		if (code === 61) {
			padding += 1;
			if (padding > 2) return;
			sawPadding = true;
			cleaned += "=";
			continue;
		}
		if (sawPadding || !(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47)) return;
		cleaned += value[index];
	}
	return cleaned && cleaned.length % 4 === 0 ? cleaned : void 0;
}
function decodeInlineDataImage(src, maxBytes, totalBytes) {
	const match = /^data:(image\/[a-z0-9.+-]+)?(;base64)?,(.*)$/i.exec(src);
	if (!match) return null;
	const contentType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(match[1] ?? "");
	if (!Boolean(match[2])) return null;
	const canonicalPayload = canonicalizeInlineBase64Payload(match[3] ?? "");
	if (!canonicalPayload) return null;
	const estimatedBytes = Buffer.byteLength(canonicalPayload, "base64");
	if (estimatedBytes <= 0 || typeof maxBytes === "number" && (estimatedBytes > maxBytes || totalBytes + estimatedBytes > maxBytes)) return null;
	try {
		return {
			data: Buffer.from(canonicalPayload, "base64"),
			contentType,
			estimatedBytes
		};
	} catch {
		return null;
	}
}
async function resolveInlineDataImageMime(inline) {
	const detectedMime = await require_runtime.getMSTeamsRuntime().media.detectMime({
		buffer: inline.data,
		headerMime: inline.contentType
	});
	const mime = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(detectedMime ?? inline.contentType);
	return mime?.startsWith("image/") ? mime : void 0;
}
async function fetchWithAuthFallback(params) {
	const firstAttempt = await require_resolve_allowlist.safeFetchWithPolicy({
		url: params.url,
		policy: params.policy,
		fetchFn: params.fetchFn,
		fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
		requestInit: params.requestInit,
		resolveFn: params.resolveFn,
		timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
	});
	if (firstAttempt.ok) return firstAttempt;
	if (!params.tokenProvider) return firstAttempt;
	const tokenProvider = params.tokenProvider;
	if (firstAttempt.status !== 401 && firstAttempt.status !== 403) return firstAttempt;
	if (!require_resolve_allowlist.isUrlAllowed(params.url, params.policy.authAllowHosts)) return firstAttempt;
	let fallbackAttempt = firstAttempt;
	const scopes = scopeCandidatesForUrl(params.url);
	const fetchFn = params.fetchFn ?? fetch;
	for (const scope of scopes) try {
		const token = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline: params.deadline,
			label: "MS Teams attachment token",
			work: () => tokenProvider.getAccessToken(scope)
		});
		const authHeaders = new Headers(params.requestInit?.headers);
		authHeaders.set("Authorization", `Bearer ${token}`);
		const authAttempt = await require_resolve_allowlist.safeFetchWithPolicy({
			url: params.url,
			policy: params.policy,
			fetchFn,
			fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
			requestInit: {
				...params.requestInit,
				headers: authHeaders
			},
			resolveFn: params.resolveFn,
			timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
		});
		await fallbackAttempt.body?.cancel().catch(() => void 0);
		if (authAttempt.ok || require_resolve_allowlist.isRedirectStatus(authAttempt.status)) return authAttempt;
		fallbackAttempt = authAttempt;
	} catch {}
	return fallbackAttempt;
}
/**
* Download all file attachments from a Teams message (images, documents, etc.).
* Renamed from downloadMSTeamsImageAttachments to support all file types.
*/
async function downloadMSTeamsAttachments(params) {
	const list = Array.isArray(params.attachments) ? params.attachments : [];
	if (list.length === 0) return [];
	const policy = require_resolve_allowlist.resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const allowHosts = policy.allowHosts;
	const ssrfPolicy = require_resolve_allowlist.resolveMediaSsrfPolicy(allowHosts);
	const candidates = list.filter(require_resolve_allowlist.isAdvertisedFileAttachment).map((attachment) => {
		return (require_resolve_allowlist.isDownloadableAttachment(attachment) ? resolveDownloadCandidate(attachment) : null) ?? {
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
		if (candidate.kind === "data") return {
			kind: "data",
			mediaKind: "image",
			src: candidate.src,
			sourceId: candidate.sourceId
		};
		if (candidate.kind === "url") return {
			kind: "remote",
			mediaKind: "image",
			url: candidate.url,
			fileHint: candidate.fileHint,
			contentTypeHint: candidate.contentType,
			sourceId: candidate.sourceId
		};
		return {
			kind: "unavailable",
			mediaKind: "image",
			sourceId: candidate.sourceId
		};
	}));
	for (const sourceId of resolveUnrepresentedHtmlAttachmentIds(list)) candidates.push({
		kind: "unavailable",
		mediaKind: "document",
		sourceId
	});
	if (candidates.length === 0) return [];
	const out = [];
	let totalInlineBytes = 0;
	for (const candidate of candidates) {
		if (candidate.kind === "unavailable") {
			out.push(withSourceId({ kind: candidate.mediaKind }, candidate.sourceId));
			continue;
		}
		if (candidate.kind === "data") {
			const decoded = decodeInlineDataImage(candidate.src, maxInlineBytes, totalInlineBytes);
			if (!decoded) {
				out.push(withSourceId({ kind: candidate.mediaKind }, candidate.sourceId));
				continue;
			}
			totalInlineBytes += decoded.estimatedBytes;
			try {
				const contentType = await resolveInlineDataImageMime(decoded);
				if (!contentType) {
					out.push(withSourceId({ kind: candidate.mediaKind }, candidate.sourceId));
					continue;
				}
				const saved = await require_runtime.getMSTeamsRuntime().channel.media.saveMediaBuffer(decoded.data, contentType, "inbound", params.maxBytes);
				out.push(withSourceId({
					path: saved.path,
					contentType: saved.contentType,
					kind: "image"
				}, candidate.sourceId));
			} catch (err) {
				out.push(withSourceId({ kind: candidate.mediaKind }, candidate.sourceId));
				params.logger?.warn?.("msteams inline attachment decode failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
			}
			continue;
		}
		if (!require_resolve_allowlist.isUrlAllowed(candidate.url, allowHosts)) {
			out.push(withSourceId({ kind: candidate.mediaKind }, candidate.sourceId));
			continue;
		}
		try {
			const media = await downloadAndStoreMSTeamsRemoteMedia({
				url: candidate.url,
				filePathHint: candidate.fileHint ?? candidate.url,
				maxBytes: params.maxBytes,
				contentTypeHint: candidate.contentTypeHint,
				kind: candidate.mediaKind,
				preserveFilenames: params.preserveFilenames,
				ssrfPolicy,
				useDirectFetch: true,
				fetchImpl: (input, init) => fetchWithAuthFallback({
					url: require_resolve_allowlist.resolveRequestUrl(input),
					tokenProvider: params.tokenProvider,
					fetchFn: params.fetchFn,
					fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
					requestInit: init,
					resolveFn: params.resolveFn,
					policy,
					deadline: params.deadline
				})
			});
			out.push(withSourceId(media, candidate.sourceId));
		} catch (err) {
			out.push(withSourceId({ kind: candidate.mediaKind }, candidate.sourceId));
			const msg = (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err);
			params.logger?.warn?.(`msteams attachment download failed host=${safeHostForLog(candidate.url)} error=${msg}`);
		}
	}
	return out;
}
function safeHostForLog(url) {
	try {
		return new URL(url).host;
	} catch {
		return "invalid-url";
	}
}
//#endregion
//#region extensions/msteams/src/attachments/graph.ts
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
async function releaseGraphResponse(response, release) {
	if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
	await release();
}
async function fetchGraphCollection(params) {
	const fetchFn = params.fetchFn ?? fetch;
	const { response, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
		url: params.url,
		fetchImpl: fetchFn,
		init: { headers: require_resolve_allowlist.ensureUserAgentHeader({ Authorization: `Bearer ${params.accessToken}` }) },
		policy: params.ssrfPolicy,
		auditContext: "msteams.graph.collection",
		timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
	});
	try {
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
	} finally {
		await releaseGraphResponse(response, release);
	}
}
function normalizeGraphAttachment(att) {
	let content = att.content;
	if (typeof content === "string") try {
		content = JSON.parse(content);
	} catch {}
	return {
		id: att.id ?? void 0,
		contentType: require_resolve_allowlist.normalizeContentType(att.contentType) ?? void 0,
		contentUrl: att.contentUrl ?? void 0,
		name: att.name ?? void 0,
		thumbnailUrl: att.thumbnailUrl ?? void 0,
		content
	};
}
/**
* Download all hosted content from a Teams message (images, documents, etc.).
* Renamed from downloadGraphHostedImages to support all file types.
*/
async function downloadGraphHostedContent(params) {
	let hosted;
	try {
		hosted = await fetchGraphCollection({
			url: `${params.messageUrl}/hostedContents`,
			accessToken: params.accessToken,
			fetchFn: params.fetchFn,
			ssrfPolicy: params.ssrfPolicy,
			deadline: params.deadline
		});
	} catch (err) {
		params.logger?.warn?.("msteams graph hostedContents fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return {
			media: [],
			count: 0
		};
	}
	if (hosted.items.length === 0) return {
		media: [],
		status: hosted.status,
		count: 0
	};
	const out = [];
	for (const item of hosted.items) {
		if (!item.id) {
			out.push(createGraphHostedContentFact(item));
			continue;
		}
		try {
			const valueUrl = `${params.messageUrl}/hostedContents/${encodeURIComponent(item.id)}/$value`;
			const { response: valRes, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
				url: valueUrl,
				fetchImpl: params.fetchFn ?? fetch,
				init: { headers: require_resolve_allowlist.ensureUserAgentHeader({ Authorization: `Bearer ${params.accessToken}` }) },
				policy: params.ssrfPolicy,
				auditContext: "msteams.graph.hostedContent.value",
				timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
			});
			try {
				if (!valRes.ok) {
					out.push(createGraphHostedContentFact(item));
					continue;
				}
				const saved = await require_runtime.getMSTeamsRuntime().channel.media.saveResponseMedia(valRes, {
					sourceUrl: valueUrl,
					maxBytes: params.maxBytes,
					fallbackContentType: item.contentType ?? void 0,
					subdir: "inbound"
				});
				out.push({
					path: saved.path,
					contentType: saved.contentType,
					kind: require_resolve_allowlist.resolveMSTeamsMediaKind({ contentType: saved.contentType }),
					sourceId: item.id
				});
			} finally {
				await releaseGraphResponse(valRes, release);
			}
		} catch (err) {
			out.push(createGraphHostedContentFact(item));
			params.logger?.warn?.("msteams graph hostedContent value fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
			continue;
		}
	}
	return {
		media: out,
		status: hosted.status,
		count: hosted.items.length
	};
}
async function downloadMSTeamsGraphMedia(params) {
	if (!params.messageUrl || !params.tokenProvider) return { media: [] };
	const tokenProvider = params.tokenProvider;
	const policy = require_resolve_allowlist.resolveAttachmentFetchPolicy({
		allowHosts: params.allowHosts,
		authAllowHosts: params.authAllowHosts
	});
	const ssrfPolicy = require_resolve_allowlist.resolveMediaSsrfPolicy(policy.allowHosts);
	const messageUrl = params.messageUrl;
	let accessToken;
	try {
		accessToken = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline: params.deadline,
			label: "MS Teams Graph media token",
			work: () => tokenProvider.getAccessToken("https://graph.microsoft.com")
		});
	} catch (err) {
		params.logger?.debug?.("graph media token acquisition failed", {
			messageUrl,
			error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)
		});
		params.logger?.warn?.("msteams graph token acquisition failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
		return {
			media: [],
			messageUrl,
			tokenError: true
		};
	}
	const fetchFn = params.fetchFn ?? fetch;
	const sharePointMedia = [];
	const downloadedReferenceUrls = /* @__PURE__ */ new Set();
	let messageAttachments = [];
	let referenceAttachments = [];
	let messageStatus;
	try {
		const { response: msgRes, release } = await (0, openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard)({
			url: messageUrl,
			fetchImpl: fetchFn,
			init: { headers: require_resolve_allowlist.ensureUserAgentHeader({ Authorization: `Bearer ${accessToken}` }) },
			policy: ssrfPolicy,
			auditContext: "msteams.graph.message",
			timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
		});
		try {
			messageStatus = msgRes.status;
			if (msgRes.ok) {
				let msgData;
				try {
					msgData = await (0, openclaw_plugin_sdk_provider_http.readProviderJsonResponse)(msgRes, "MS Teams Graph message");
				} catch (err) {
					params.logger?.debug?.("graph media message parse failed", {
						messageUrl,
						error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)
					});
					params.logger?.warn?.("msteams graph message parse failed", {
						error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err),
						messageUrl
					});
					msgData = {};
				}
				messageAttachments = Array.isArray(msgData.attachments) ? msgData.attachments : [];
				referenceAttachments = messageAttachments.filter((a) => a.contentType === "reference" && a.contentUrl && a.name);
			} else params.logger?.debug?.("graph media message fetch not ok", {
				messageUrl,
				status: messageStatus
			});
		} finally {
			await releaseGraphResponse(msgRes, release);
		}
	} catch (err) {
		params.logger?.debug?.("graph media message fetch failed", {
			messageUrl,
			error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)
		});
		params.logger?.warn?.("msteams graph message fetch failed", { error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err) });
	}
	for (const att of referenceAttachments) {
		const name = att.name ?? "file";
		const shareUrl = att.contentUrl ?? "";
		const sourceId = att.id?.trim();
		const unavailableMedia = {
			kind: require_resolve_allowlist.resolveMSTeamsMediaKind({
				contentType: att.contentType ?? void 0,
				fileName: name
			}),
			...sourceId ? { sourceId } : {}
		};
		if (!shareUrl) {
			sharePointMedia.push(unavailableMedia);
			continue;
		}
		downloadedReferenceUrls.add(shareUrl);
		try {
			const sharesUrl = `${require_resolve_allowlist.GRAPH_ROOT}/shares/${require_resolve_allowlist.encodeGraphShareId(shareUrl)}/driveItem/content`;
			if (!require_resolve_allowlist.isUrlAllowed(sharesUrl, policy.allowHosts)) {
				params.logger?.debug?.("graph media sharepoint url not in allowHosts", {
					messageUrl,
					sharesUrl
				});
				sharePointMedia.push(unavailableMedia);
				continue;
			}
			const media = await downloadAndStoreMSTeamsRemoteMedia({
				url: sharesUrl,
				filePathHint: name,
				maxBytes: params.maxBytes,
				contentTypeHint: "application/octet-stream",
				preserveFilenames: params.preserveFilenames,
				ssrfPolicy,
				useDirectFetch: true,
				fetchImpl: async (input, init) => {
					const requestUrl = require_resolve_allowlist.resolveRequestUrl(input);
					const headers = require_resolve_allowlist.ensureUserAgentHeader(init?.headers);
					require_resolve_allowlist.applyAuthorizationHeaderForUrl({
						headers,
						url: requestUrl,
						authAllowHosts: policy.authAllowHosts,
						bearerToken: accessToken
					});
					return await require_resolve_allowlist.safeFetchWithPolicy({
						url: requestUrl,
						policy,
						fetchFn,
						fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
						requestInit: {
							...init,
							headers
						},
						resolveFn: params.resolveFn,
						timeoutMs: require_resolve_allowlist.resolveMSTeamsRequestTimeoutMs(params.deadline)
					});
				}
			});
			sharePointMedia.push(sourceId ? {
				...media,
				sourceId
			} : media);
		} catch (err) {
			sharePointMedia.push(unavailableMedia);
			params.logger?.warn?.("msteams SharePoint reference download failed", {
				error: (0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err),
				name
			});
		}
	}
	const hosted = await downloadGraphHostedContent({
		accessToken,
		messageUrl,
		maxBytes: params.maxBytes,
		fetchFn: params.fetchFn,
		preserveFilenames: params.preserveFilenames,
		ssrfPolicy,
		logger: params.logger,
		deadline: params.deadline
	});
	const normalizedAttachments = messageAttachments.map(normalizeGraphAttachment);
	const filteredAttachments = sharePointMedia.length > 0 ? normalizedAttachments.filter((att) => {
		if ((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(att.contentType) !== "reference") return true;
		const url = typeof att.contentUrl === "string" ? att.contentUrl : "";
		if (!url) return true;
		return !downloadedReferenceUrls.has(url);
	}) : normalizedAttachments;
	let attachmentMedia = [];
	try {
		attachmentMedia = await downloadMSTeamsAttachments({
			attachments: filteredAttachments,
			maxBytes: params.maxBytes,
			tokenProvider: params.tokenProvider,
			allowHosts: policy.allowHosts,
			authAllowHosts: policy.authAllowHosts,
			fetchFn: params.fetchFn,
			fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
			resolveFn: params.resolveFn,
			deadline: params.deadline,
			preserveFilenames: params.preserveFilenames,
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
			...hosted.media,
			...attachmentMedia
		],
		hostedCount: hosted.count,
		attachmentCount: filteredAttachments.length + sharePointMedia.length,
		hostedStatus: hosted.status,
		attachmentStatus: messageStatus,
		messageUrl
	};
}
//#endregion
//#region extensions/msteams/src/monitor-handler/inbound-media.ts
function shouldAttemptMSTeamsGraphMediaFallback(params) {
	const conversationType = params.conversationType.trim().toLowerCase();
	return params.graphMediaFallback === true && (conversationType === "channel" || conversationType === "groupchat") && (params.htmlSummary?.htmlAttachments ?? 0) > 0;
}
function resolveMSTeamsInboundMediaBody(params) {
	const unavailableCount = params.materializedMedia.filter((media) => !media.path).length + Math.max(0, params.nativeMedia.length - params.materializedMedia.length);
	if (unavailableCount === 0) return params.body;
	return (0, openclaw_plugin_sdk_channel_inbound.formatInboundMediaUnavailableText)({
		body: params.body,
		notice: `[msteams ${unavailableCount > 1 ? `${unavailableCount} attachments` : "attachment"} unavailable]`
	});
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
		const mayUseFallbackOrder = options.positionallyAligned === false;
		const isEligibleUnresolved = (media) => !media.path && !media.sourceId;
		const sameKindUnresolvedIndexes = mayUseFallbackOrder ? merged.slice(0, nativeSlotCount).flatMap((media, mediaIndex) => isEligibleUnresolved(media) && media.kind === materialized.kind ? [mediaIndex] : []) : [];
		const unresolvedIndexes = sameKindUnresolvedIndexes.length === 0 && mayUseFallbackOrder ? merged.slice(0, nativeSlotCount).flatMap((media, mediaIndex) => isEligibleUnresolved(media) ? [mediaIndex] : []) : [];
		const fallbackIndex = sameKindUnresolvedIndexes.length > 0 ? sameKindUnresolvedIndexes[0] : unresolvedIndexes.length === 1 ? unresolvedIndexes[0] : void 0;
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
async function resolveMSTeamsInboundMedia(params) {
	const { attachments, htmlSummary, maxBytes, tokenProvider, allowHosts, conversationType, conversationId, conversationMessageId, teamAadGroupId, serviceUrl, activity, log, preserveFilenames } = params;
	let mediaList = await downloadMSTeamsAttachments({
		attachments,
		maxBytes,
		tokenProvider,
		allowHosts,
		authAllowHosts: params.authAllowHosts,
		preserveFilenames,
		deadline: params.deadline,
		logger: log
	});
	if (!hasMaterializedMedia(mediaList)) {
		const attachmentIds = extractMSTeamsHtmlAttachmentIds(attachments);
		const hasHtmlFileAttachment = attachmentIds.length > 0;
		const hasChannelOrGroupHtml = shouldAttemptMSTeamsGraphMediaFallback({
			conversationType,
			htmlSummary,
			graphMediaFallback: params.graphMediaFallback
		});
		const shouldFetchGraphMessage = hasHtmlFileAttachment || hasChannelOrGroupHtml;
		const isBotFrameworkPersonalChat = isBotFrameworkPersonalChatId(conversationId);
		if (hasHtmlFileAttachment && isBotFrameworkPersonalChat) {
			if (!serviceUrl) log.debug?.("bot framework attachment skipped (missing serviceUrl)", {
				conversationType,
				conversationId
			});
			else {
				const bfMedia = await downloadMSTeamsBotFrameworkAttachments({
					serviceUrl,
					attachmentIds,
					tokenProvider,
					maxBytes,
					allowHosts,
					authAllowHosts: params.authAllowHosts,
					preserveFilenames,
					deadline: params.deadline
				});
				if (bfMedia.media.length > 0) mediaList = mergeMSTeamsMediaFacts(mediaList, bfMedia.media, { positionallyAligned: false });
				if (!hasMaterializedMedia(bfMedia.media)) log.debug?.("bot framework attachments fetch empty", {
					conversationType,
					attachmentCount: bfMedia.attachmentCount ?? attachmentIds.length
				});
			}
		}
		if (shouldFetchGraphMessage && !hasMaterializedMedia(mediaList) && !isBotFrameworkPersonalChat) {
			const graphTeamAadGroupId = conversationType.trim().toLowerCase() === "channel" && !teamAadGroupId ? await params.resolveTeamAadGroupId?.() : teamAadGroupId;
			const messageUrl = buildMSTeamsGraphMessageUrl({
				conversationType,
				conversationId,
				messageId: activity.id ?? void 0,
				threadRootMessageId: conversationMessageId ?? activity.replyToId,
				teamAadGroupId: graphTeamAadGroupId,
				channelId: activity.channelData?.channel?.id
			});
			if (!messageUrl) log.debug?.("graph message url unavailable", {
				conversationType,
				hasChannelData: Boolean(activity.channelData),
				messageId: activity.id ?? void 0,
				replyToId: activity.replyToId ?? void 0
			});
			else {
				const graphMedia = await downloadMSTeamsGraphMedia({
					messageUrl,
					tokenProvider,
					maxBytes,
					allowHosts,
					authAllowHosts: params.authAllowHosts,
					preserveFilenames,
					deadline: params.deadline,
					logger: log
				});
				if (graphMedia.media.length > 0) mediaList = mergeMSTeamsMediaFacts(mediaList, graphMedia.media, { positionallyAligned: false });
				if (!hasMaterializedMedia(mediaList)) log.debug?.("graph media fetch empty", {
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
	if (materializedCount > 0) log.debug?.("downloaded attachments", { count: materializedCount });
	else if (htmlSummary?.imgTags) log.debug?.("inline images detected but none downloaded", {
		imgTags: htmlSummary.imgTags,
		srcHosts: htmlSummary.srcHosts,
		dataImages: htmlSummary.dataImages,
		cidImages: htmlSummary.cidImages
	});
	return mediaList;
}
//#endregion
//#region extensions/msteams/src/monitor-handler/inbound-content.ts
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
	let mediaList = [];
	try {
		mediaList = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline: params.deadline,
			label: "MS Teams inbound media",
			work: () => resolveMSTeamsInboundMedia({
				attachments: params.entry.attachments,
				htmlSummary: params.htmlSummary,
				maxBytes: params.mediaMaxBytes,
				tokenProvider: params.tokenProvider,
				allowHosts: params.mediaAllowHosts,
				authAllowHosts: params.mediaAuthAllowHosts,
				graphMediaFallback: params.graphMediaFallback,
				conversationType: params.conversationType,
				conversationId: params.conversationId,
				conversationMessageId: params.conversationMessageId,
				teamAadGroupId: params.teamAadGroupId,
				resolveTeamAadGroupId: params.resolveTeamAadGroupId,
				serviceUrl: activity.serviceUrl,
				activity: {
					id: activity.id,
					replyToId: activity.replyToId,
					channelData: activity.channelData
				},
				log: params.log,
				deadline: params.deadline,
				preserveFilenames: false
			})
		});
	} catch (err) {
		params.log.debug?.("failed to resolve inbound Teams media", { error: require_channel_setup.formatUnknownError(err) });
	}
	const inboundMedia = mergeMSTeamsMediaFacts(params.advertisedMedia, mediaList);
	const nativeMediaForComparison = [...params.advertisedMedia, ...mediaList.slice(params.advertisedMedia.length).map((media) => ({
		contentType: media.contentType,
		kind: media.kind
	}))];
	const agentBody = resolveMSTeamsInboundMediaBody({
		body: params.rawBody,
		nativeMedia: nativeMediaForComparison,
		materializedMedia: inboundMedia
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
//#endregion
//#region extensions/msteams/src/reply-stream-controller.ts
function isStreamCancelledError(err) {
	return err instanceof Error && err.name === "StreamCancelledError";
}
/**
* Bridges openclaw's reply pipeline callbacks to the SDK's `ctx.stream`.
* Streaming is enabled for personal (DM) conversations only; group/channel
* messages fall through to block delivery.
*
* Streaming modes (resolved from `cfg.channels.msteams.streaming.mode`):
* - "partial" (default): per-token streaming via `stream.emit(text)`. Each
*   chunk goes onto the live preview card in Teams.
* - "progress": no per-token streaming; the preview card carries an
*   informative status that updates as tools run (e.g. "Looking up the
*   schema..." → "Generating SQL..."). When tool-progress streaming is also
*   enabled, raw tool names appear as bullets above the label.
* - "block": disable native streaming entirely; the reply lands as a regular
*   block message. We bypass the controller in that case.
*/
function createTeamsReplyStreamController(params) {
	const isPersonal = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationType) === "personal";
	const streamMode = (0, openclaw_plugin_sdk_channel_outbound.resolveChannelPreviewStreamMode)(params.msteamsConfig, "partial");
	const stream = params.allowProviderPreview && isPersonal && (streamMode === "partial" || streamMode === "progress") ? params.context.stream : void 0;
	let tokensEmitted = false;
	let nativeDispatchStarted = false;
	let nativeDeliveryClaimed = false;
	let streamFinalizationPending = false;
	let canceledLocally = false;
	let streamFailed = false;
	let pendingFinalPayload;
	let emittedText = "";
	let acknowledgedText = "";
	let acknowledgedLogicalText = "";
	let acknowledgedStreamId;
	let replacementFinalPending = false;
	let replacementEmitFailed = false;
	let replacementSettlementPending = false;
	let replacementTextAwaitingAcknowledgement;
	let deferredReplacementEntries = [];
	let queuedFinalActivity;
	let failedSegmentFallbackPrepared = false;
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
	const wasCanceled = () => canceledLocally || Boolean(stream?.canceled);
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
		const hasMedia = Boolean(payload.mediaUrl || payload.mediaUrls?.length);
		if (!remainingText && !hasMedia) return;
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
		...require_messenger.buildMSTeamsMessageActivity(text === void 0 ? void 0 : require_messenger.formatMSTeamsMarkdown(text, params.tableMode ?? "code")),
		channelData: params.feedbackLoopEnabled ? { feedbackLoopEnabled: true } : {}
	});
	const deferredReplacementLogicalContent = () => {
		return deferredReplacementEntries.map((entry) => entry.payload.text).filter((text) => Boolean(text)).join("\n") || void 0;
	};
	const takeDeferredReplacementPayloads = (replacementFallback) => {
		const payloads = deferredReplacementEntries.flatMap((entry) => {
			if (entry.kind === "payload") return [entry.payload];
			const hasMedia = Boolean(entry.payload.mediaUrl || entry.payload.mediaUrls?.length);
			const text = replacementFallback?.text;
			if (!text && !hasMedia) return [];
			return [{
				...entry.payload,
				text: text || void 0
			}];
		});
		deferredReplacementEntries = [];
		return payloads;
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
			try {
				stream.update(text.replace(/^• /gmu, "- "));
				return true;
			} catch (err) {
				if (isStreamCancelledError(err)) canceledLocally = true;
				else params.log?.debug?.(`stream informative update failed: ${(0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)}`);
				return false;
			}
		}
	});
	return {
		async onReplyStart() {},
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
				if (streamFailed) {
					streamFinalizationPending = true;
					return;
				}
				replacementFinalPending = true;
				replacementSettlementPending = true;
				pendingFinalPayload = { text: fullText };
				streamFinalizationPending = true;
				return;
			}
			try {
				stream.emit(delta);
				emittedText = fullText;
				tokensEmitted = true;
				nativeDispatchStarted = true;
			} catch (err) {
				if (isStreamCancelledError(err)) {
					canceledLocally = true;
					return;
				}
				streamFailed = true;
				params.log?.warn?.(`msteams stream emit failed, falling back to block delivery: ${(0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)}`);
			}
		},
		pushItemEvent: progressDraft.pushItemEvent.bind(progressDraft),
		pushToolEvent: progressDraft.pushToolEvent,
		async pushReasoningProgress(text, options) {
			await progressDraft.pushReasoningProgress(text, options);
		},
		resetReasoningProgress: () => progressDraft.resetReasoningProgress(),
		async pushApprovalEvent(payload) {
			await progressDraft.pushApprovalEvent(payload);
		},
		async pushPlanProgress(steps, options) {
			await progressDraft.pushPlanProgress(steps, options);
		},
		preparePayload(payload) {
			if (!stream) return payload;
			if (wasCanceled()) return;
			if (payload.text) progressDraft.markFinalReplyStarted();
			if (replacementSettlementPending) {
				if (!replacementFinalPending) {
					deferredReplacementEntries.push({
						kind: "payload",
						payload
					});
					return;
				}
				if (!payload.text) {
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
				try {
					const activity = finalStreamActivity(payload.text);
					replacementTextAwaitingAcknowledgement = {
						text: activity.text,
						logicalText: payload.text
					};
					stream.emit(activity);
					queuedFinalActivity = activity;
					emittedText = payload.text;
					tokensEmitted = false;
					return;
				} catch (err) {
					replacementTextAwaitingAcknowledgement = void 0;
					tokensEmitted = false;
					if (isStreamCancelledError(err)) {
						canceledLocally = true;
						pendingFinalPayload = void 0;
						deferredReplacementEntries = [];
						return;
					}
					streamFailed = true;
					replacementEmitFailed = true;
					params.log?.warn?.(`msteams stream replacement failed, falling back to block delivery: ${(0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)}`);
					return;
				}
			}
			if (streamFailed) {
				const fallback = failedSegmentFallbackPrepared ? payload : fallbackPayloadAfterAcknowledgedText(payload);
				failedSegmentFallbackPrepared = true;
				pendingFinalPayload = void 0;
				return fallback;
			}
			if (streamMode === "progress" && payload.text && !nativeDispatchStarted) try {
				stream.emit(payload.text);
				emittedText = payload.text;
				nativeDispatchStarted = true;
				tokensEmitted = true;
			} catch (err) {
				if (isStreamCancelledError(err)) {
					canceledLocally = true;
					return;
				}
				params.log?.debug?.(`progress-mode finalize failed: ${(0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)}`);
			}
			if (tokensEmitted) {
				const hasMedia = Boolean(payload.mediaUrl || payload.mediaUrls?.length);
				pendingFinalPayload = fallbackPayloadForSuppressedFinal(payload);
				streamFinalizationPending = true;
				tokensEmitted = false;
				return hasMedia ? {
					...payload,
					text: void 0
				} : void 0;
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
				if (wasCanceled()) {
					pendingFinalPayload = void 0;
					deferredReplacementEntries = [];
					streamFinalizationPending = false;
					return acknowledgedNativeDelivery();
				}
				if (!streamFinalizationPending) return acknowledgedNativeDelivery();
				if (replacementSettlementPending && replacementFinalPending && pendingFinalPayload?.text) {
					replacementFinalPending = false;
					deferredReplacementEntries.push({
						kind: "replacement",
						payload: pendingFinalPayload
					});
					const activity = finalStreamActivity(pendingFinalPayload.text);
					replacementTextAwaitingAcknowledgement = {
						text: activity.text,
						logicalText: pendingFinalPayload.text
					};
					logicalContent = deferredReplacementLogicalContent();
					stream.emit(activity);
					queuedFinalActivity = activity;
					emittedText = pendingFinalPayload.text;
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
				streamFinalizationPending = false;
				if (!result) {
					const fallback = pendingFinalPayload;
					pendingFinalPayload = void 0;
					const canceled = wasCanceled();
					const replacementFallback = replacementSettlementPending && fallback && !canceled ? fallbackPayloadAfterAcknowledgedText(fallback) : void 0;
					const fallbackPayload = !replacementSettlementPending && fallback && !canceled ? fallbackPayloadAfterAcknowledgedText(fallback) : void 0;
					const postNativePayloads = replacementSettlementPending && !canceled ? takeDeferredReplacementPayloads(replacementFallback) : [];
					if (canceled) deferredReplacementEntries = [];
					return {
						...acknowledgedNativeDelivery(),
						...!canceled && logicalContent ? { logicalContent } : {},
						...fallbackPayload ? { fallbackPayload } : {},
						...postNativePayloads.length > 0 ? { postNativePayloads } : {}
					};
				}
				const replacementFallback = replacementSettlementPending && replacementEmitFailed && pendingFinalPayload ? fallbackPayloadAfterAcknowledgedText(pendingFinalPayload) : void 0;
				pendingFinalPayload = void 0;
				const messageId = require_messenger.extractMessageId(result) ?? acknowledgedStreamId;
				const postNativePayloads = replacementSettlementPending ? takeDeferredReplacementPayloads(replacementFallback) : [];
				const nativeContent = replacementEmitFailed ? acknowledgedText || void 0 : content;
				return {
					visibleReplySent: replacementEmitFailed ? Boolean(nativeContent) : true,
					...nativeContent === void 0 ? {} : { content: nativeContent },
					...logicalContent ? { logicalContent } : {},
					...messageId && (!replacementEmitFailed || nativeContent) ? { messageId } : {},
					...postNativePayloads.length > 0 ? { postNativePayloads } : {}
				};
			} catch (err) {
				if (isStreamCancelledError(err)) {
					canceledLocally = true;
					pendingFinalPayload = void 0;
					deferredReplacementEntries = [];
					streamFinalizationPending = false;
					return acknowledgedNativeDelivery();
				}
				streamFailed = true;
				streamFinalizationPending = false;
				params.log?.warn?.(`msteams stream finalize failed: ${(0, openclaw_plugin_sdk_error_runtime.coerceErrorMessage)(err)}`);
				const fallback = pendingFinalPayload;
				pendingFinalPayload = void 0;
				const replacementFallback = replacementSettlementPending && fallback ? fallbackPayloadAfterAcknowledgedText(fallback) : void 0;
				const fallbackPayload = !replacementSettlementPending && fallback ? fallbackPayloadAfterAcknowledgedText(fallback) : void 0;
				const postNativePayloads = replacementSettlementPending ? takeDeferredReplacementPayloads(replacementFallback) : [];
				return {
					...acknowledgedNativeDelivery(),
					...logicalContent ? { logicalContent } : {},
					...fallbackPayload ? { fallbackPayload } : {},
					...postNativePayloads.length > 0 ? { postNativePayloads } : {}
				};
			} finally {
				failedSegmentFallbackPrepared = true;
				queuedFinalActivity = void 0;
				replacementEmitFailed = false;
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
			return Boolean(stream) && tokensEmitted && !wasCanceled() && !streamFailed;
		},
		wasCanceled
	};
}
//#endregion
//#region extensions/msteams/src/reply-dispatcher.ts
function createMSTeamsReplyDispatcher(params) {
	const core = require_runtime.getMSTeamsRuntime();
	const msteamsCfg = params.cfg.channels?.msteams;
	const conversationType = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(params.conversationRef.conversation?.conversationType);
	const isTypingSupported = conversationType === "personal" || conversationType === "groupchat";
	/**
	* Keepalive cadence for the typing indicator while the bot is running
	* (including long tool chains). Bot Framework 1:1 TurnContext proxies
	* expire after ~30s of inactivity; sending a typing activity every 8s
	* keeps the proxy alive so the post-tool reply can still land via the
	* turn context. Sits in the middle of the 5-10s range recommended in
	* #59731.
	*/
	const TYPING_KEEPALIVE_INTERVAL_MS = 8e3;
	/**
	* TTL ceiling for the typing keepalive loop. The default in
	* createTypingCallbacks is 60s, which is too short for the Teams long tool
	* chains described in #59731 (60s+ total runs are common). Give tool
	* chains up to 10 minutes before auto-stopping the keepalive.
	*/
	const TYPING_KEEPALIVE_MAX_DURATION_MS = 6e5;
	const streamActiveRef = { current: () => false };
	const streamCanceledRef = { current: () => false };
	const rawSendTypingIndicator = async () => {
		await require_messenger.withRevokedProxyFallback({
			run: async () => {
				await params.context.sendActivity({ type: "typing" });
			},
			onRevoked: async () => {
				const baseRef = require_messenger.buildConversationReference(params.conversationRef);
				await require_messenger.sendMSTeamsActivityWithReference(params.app, baseRef, { type: "typing" }, { serviceUrlBoundary: require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg) });
			},
			onRevokedLog: () => {
				params.log.debug?.("turn context revoked, sending typing via proactive messaging");
			}
		});
	};
	const sendTypingIndicator = isTypingSupported ? async () => {
		if (streamActiveRef.current()) return;
		if (streamCanceledRef.current()) return;
		await rawSendTypingIndicator();
	} : async () => {};
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
	const chunkMode = core.channel.text.resolveChunkMode(params.cfg, "msteams");
	const tableMode = core.channel.text.resolveMarkdownTableMode({
		cfg: params.cfg,
		channel: "msteams"
	});
	const mediaMaxBytes = (0, openclaw_plugin_sdk_account_helpers.resolveChannelMediaMaxBytes)({
		cfg: params.cfg,
		resolveChannelLimitMb: ({ cfg }) => cfg.channels?.msteams?.mediaMaxMb
	});
	const feedbackLoopEnabled = params.cfg.channels?.msteams?.feedbackEnabled !== false;
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
	streamActiveRef.current = () => streamController.isStreamActive();
	streamCanceledRef.current = () => streamController.wasCanceled();
	const teamsStreamMode = (0, openclaw_plugin_sdk_channel_outbound.resolveChannelPreviewStreamMode)(msteamsCfg, "partial");
	const blockStreamingResolved = teamsStreamMode === "block" ? true : (0, openclaw_plugin_sdk_channel_outbound.resolveChannelStreamingBlockEnabled)(msteamsCfg);
	const blockStreamingEnabled = blockStreamingResolved ?? false;
	const typingIndicatorEnabled = typeof msteamsCfg?.typingIndicator === "boolean" ? msteamsCfg.typingIndicator : true;
	const pendingDeliveries = [];
	let pendingSettlement;
	const findPendingNativeDelivery = () => pendingDeliveries.find((candidate) => candidate.native && !candidate.nativeSettled);
	const joinAcceptedContents = (contents) => contents.filter((content) => Boolean(content)).join("\n");
	const sendMessages = async (messages) => {
		return require_messenger.sendMSTeamsMessages({
			replyStyle: params.replyStyle,
			app: params.app,
			appId: params.appId,
			conversationRef: params.conversationRef,
			context: params.context,
			messages,
			retry: {},
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
	};
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
		return require_messenger.renderReplyPayloadsToMessages([payload], {
			textChunkLimit: params.textLimit,
			chunkText: true,
			mediaMode: "split",
			tableMode,
			chunkMode
		});
	};
	const deliveryOutcome = (delivery) => {
		const acceptedParts = [...delivery.nativeResult ? [delivery.nativeResult] : [], ...delivery.blockResults];
		const messageIds = acceptedParts.flatMap((part) => part.messageIds);
		const content = delivery.errors.length > 0 ? joinAcceptedContents(acceptedParts.map((part) => part.content)) : delivery.content;
		return {
			visibleReplySent: acceptedParts.length > 0,
			...messageIds.length > 0 ? { messageIds } : {},
			...acceptedParts.length > 0 && content !== void 0 ? { content } : {}
		};
	};
	const settlePendingDelivery = (delivery) => {
		if (delivery.settled || !delivery.blockSettled || delivery.native && !delivery.nativeSettled) return;
		delivery.settled = true;
		const outcome = deliveryOutcome(delivery);
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
	const queueReplyPayload = (payload, messages, native) => {
		const delivery = {
			messages,
			finalization: (0, openclaw_plugin_sdk_extension_shared.createDeferred)(),
			content: payload.text,
			blockResults: [],
			native,
			nativeSettled: !native,
			blockSettled: messages.length === 0,
			settled: false,
			errors: []
		};
		pendingDeliveries.push(delivery);
		return delivery;
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
				const msgIds = await sendMessages([msg]);
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
				params.log.warn?.(`failed to deliver ${failed} of ${total} message blocks`, {
					failed,
					total
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
			await streamController.onReplyStart();
			if (typingIndicatorEnabled) await typingCallbacks?.onReplyStart?.();
		},
		typingCallbacks
	};
	const delivery = {
		observeMessageSent: true,
		deliver: async (payload) => {
			if (pendingSettlement) await pendingSettlement;
			const preparedPayload = streamController.preparePayload(payload);
			const native = streamController.claimNativeDelivery();
			if (preparedPayload && !native && findPendingNativeDelivery()) await settleDelivery();
			const messages = preparedPayload && !streamController.wasCanceled() ? renderReplyPayload(preparedPayload) : [];
			if (!native && messages.length === 0) return {
				visibleReplySent: false,
				suppression: { reason: "no_visible_result" }
			};
			const pending = queueReplyPayload(payload, messages, native);
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
			params.runtime.error?.(`msteams ${info.kind} reply failed: ${errMsg}${hint ? ` (${hint})` : ""}`);
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
			const text = typeof payload?.text === "string" ? payload.text : void 0;
			await streamController.pushReasoningProgress(text, { snapshot: payload?.isReasoningSnapshot === true });
			return false;
		},
		onReasoningEnd: () => {
			streamController.resetReasoningProgress();
			return false;
		},
		onToolStart: streamController.pushToolEvent,
		onItemEvent: streamController.pushItemEvent,
		onPlanUpdate: async (payload) => {
			if (payload?.phase !== "update") return false;
			await streamController.pushPlanProgress((0, openclaw_plugin_sdk_channel_outbound.normalizeAgentPlanSteps)(payload.steps), {
				explanation: typeof payload.explanation === "string" ? payload.explanation : void 0,
				explanationFormat: payload.explanationFormat === "plain" ? "plain" : void 0
			});
			return false;
		},
		onApprovalEvent: async (payload) => {
			await streamController.pushApprovalEvent({
				...typeof payload?.phase === "string" ? { phase: payload.phase } : {},
				...typeof payload?.approvalId === "string" ? { approvalId: payload.approvalId } : {},
				...typeof payload?.title === "string" ? { title: payload.title } : {},
				...typeof payload?.command === "string" ? { command: payload.command } : {},
				...typeof payload?.reason === "string" ? { reason: payload.reason } : {},
				...typeof payload?.message === "string" ? { message: payload.message } : {}
			});
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
//#endregion
//#region extensions/msteams/src/sent-message-cache.ts
const sentMessages = (0, openclaw_plugin_sdk_dedupe_runtime.createPersistentDedupeCache)({
	globalKey: Symbol.for("openclaw.msteamsSentMessages"),
	ttlMs: 864e5,
	maxSize: 2e4,
	persistent: {
		namespace: "msteams.sent-messages",
		maxEntries: 1e3,
		openStore: (options) => require_runtime.getOptionalMSTeamsRuntime()?.state.openKeyedStore(options),
		logError: (0, openclaw_plugin_sdk_plugin_state_runtime.createPluginStateErrorReporter)(require_runtime.getOptionalMSTeamsRuntime, "msteams", "sent-message-state", "Microsoft Teams persistent sent-message state failed"),
		readTimestamp: (record) => record.sentAt
	}
});
function makeKey(conversationId, messageId) {
	return `${conversationId}:${messageId}`;
}
function recordMSTeamsSentMessage(conversationId, messageId) {
	if (!conversationId || !messageId) return;
	const sentAt = Date.now();
	sentMessages.register(makeKey(conversationId, messageId), { sentAt }, { at: sentAt });
}
async function wasMSTeamsMessageSentWithPersistence(params) {
	if (!params.conversationId || !params.messageId) return false;
	return await sentMessages.lookup(makeKey(params.conversationId, params.messageId));
}
//#endregion
//#region extensions/msteams/src/monitor-handler/inbound-dispatch.ts
async function dispatchMSTeamsInboundTurn(params) {
	const core = require_runtime.getMSTeamsRuntime();
	const { cfg, runtime, appId, app, tokenProvider, textLimit, log, logVerboseMessage, facts, admission, content, routing, thread, replyStyle, timestamp, contextVisibilityMode, conversationHistories, historyLimit } = params;
	const { context, activity, rawBody, text, quoteInfo, conversationRef } = facts;
	const { senderId, senderName, isDirectMessage, allowNameMatching, groupPolicy, commandAuthorized, effectiveGroupAllowFrom } = admission;
	const { route } = routing;
	const { agentBody, inboundMedia } = content;
	const { teamAadGroupId, quoteBodyFull, quoteSenderId, quoteSenderName, threadContext } = thread;
	const { conversationId, conversationType, isChannel, teamId, graphChannelId } = facts;
	const teamsFrom = isDirectMessage ? `msteams:${senderId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`;
	const teamsTo = isDirectMessage ? `user:${senderId}` : `conversation:${conversationId}`;
	const envelopeFrom = isDirectMessage ? senderName : conversationType;
	const buildEnvelope = (0, openclaw_plugin_sdk_channel_inbound.createChannelInboundEnvelopeBuilder)({
		cfg,
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
		isSenderAllowed: (allowFrom) => require_channel.resolveMSTeamsAllowlistMatch({
			allowFrom,
			senderId: quoteSenderId ?? "",
			senderName: quoteSenderName,
			allowNameMatching
		}).allowed
	}) : true;
	const nativeChannelId = isChannel && teamAadGroupId ? `${teamAadGroupId}/${graphChannelId}` : void 0;
	const boundIngress = await resolveMSTeamsSenderAccess({
		cfg,
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
	const ctxPayload = core.channel.inbound.buildContext({
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
				id: quoteInfo.id ?? activity.replyToId ?? void 0,
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
			messageThreadId: facts.threadId ?? void 0,
			replyToId: activity.replyToId ?? void 0,
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
				wasMentioned: isDirectMessage || params.mentionWasEffective
			},
			commands: { authorized: commandAuthorized === true }
		},
		extra: {
			GroupSubject: !isDirectMessage ? conversationType : void 0,
			ReplyToIsQuote: quoteInfo ? true : void 0
		}
	});
	const preview = (0, openclaw_plugin_sdk_text_utility_runtime.sliceUtf16Safe)(rawBody.replace(/\s+/g, " "), 0, 160);
	logVerboseMessage(`msteams inbound: from=${ctxPayload.From} preview="${preview}"`);
	const { dispatcherOptions, delivery, replyOptions } = createMSTeamsReplyDispatcher({
		cfg,
		agentId: route.agentId,
		sessionKey: route.sessionKey,
		accountId: route.accountId,
		runtime,
		log,
		app,
		appId,
		conversationRef,
		context,
		replyStyle,
		textLimit,
		onSentMessageIds: (ids) => {
			for (const id of ids) recordMSTeamsSentMessage(conversationId, id);
		},
		tokenProvider,
		sharePointSiteId: cfg.channels?.msteams?.sharePointSiteId
	});
	const senderTimezone = (activity.entities?.find((entity) => entity.type === "clientInfo"))?.timezone || conversationRef.timezone;
	const turnConfig = senderTimezone && !cfg.agents?.defaults?.userTimezone ? {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				userTimezone: senderTimezone
			}
		}
	} : cfg;
	log.info("dispatching to agent", { sessionKey: route.sessionKey });
	try {
		const turnResult = await core.channel.inbound.run({
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
		const dispatchResult = turnResult.dispatched ? turnResult.dispatchResult : void 0;
		const counts = (0, openclaw_plugin_sdk_channel_inbound.resolveInboundReplyDispatchCounts)(dispatchResult);
		log.info("dispatch complete", { counts });
		if ((0, openclaw_plugin_sdk_channel_inbound.hasFinalInboundReplyDispatch)(dispatchResult)) logVerboseMessage(`msteams: delivered ${counts.final} repl${counts.final === 1 ? "y" : "ies"} to ${teamsTo}`);
		return {
			kind: "completed",
			finalResponses: counts.final
		};
	} catch (err) {
		log.error("dispatch failed", { error: require_channel_setup.formatUnknownError(err) });
		runtime.error(`msteams dispatch failed: ${require_channel_setup.formatUnknownError(err)}`);
		if (facts.turnAdoptionLifecycle) throw err;
		try {
			await context.sendActivity("⚠️ Something went wrong. Please try again.");
		} catch {}
		return { kind: "failed" };
	}
}
//#endregion
//#region extensions/msteams/src/monitor-handler/inbound-facts.ts
function extractTextFromHtmlAttachments(attachments) {
	for (const attachment of attachments) {
		const raw = require_resolve_allowlist.extractHtmlFromAttachment(attachment);
		if (!raw) continue;
		const text = require_resolve_allowlist.htmlToPlainText(raw.replace(/<at[^>]*>.*?<\/at>/gis, " ").replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis, "$2 $1"));
		if (text) return text;
	}
	return "";
}
async function prepareMSTeamsDebounceEntry(params) {
	const activity = params.context.activity;
	const attachments = Array.isArray(activity.attachments) ? activity.attachments : [];
	const rawText = activity.text?.trim() ?? "";
	const text = rawText ? require_resolve_allowlist.stripMSTeamsMentionTags(rawText) : extractTextFromHtmlAttachments(attachments) || require_resolve_allowlist.stripMSTeamsMentionTags(serializeMSTeamsAdaptiveCardActionValue(activity.value) || "");
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(activity.conversation?.id ?? "");
	const replyToId = activity.replyToId ?? void 0;
	const implicitMentionKinds = conversationId && replyToId && await wasMSTeamsMessageSentWithPersistence({
		conversationId,
		messageId: replyToId
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
function buildStoredConversationReference(params) {
	const { activity, conversationId, conversationType, teamId, threadId } = params;
	const from = activity.from;
	const conversation = activity.conversation;
	const clientInfo = activity.entities?.find((entity) => entity.type === "clientInfo");
	const tenantId = activity.channelData?.tenant?.id ?? conversation?.tenantId;
	const aadObjectId = from?.aadObjectId;
	const serviceUrl = require_resolve_allowlist.tryNormalizeBotFrameworkServiceUrl(activity.serviceUrl);
	return {
		activityId: activity.id,
		user: from ? {
			id: from.id,
			name: from.name,
			aadObjectId: from.aadObjectId
		} : void 0,
		agent: activity.recipient,
		conversation: {
			id: conversationId,
			conversationType,
			tenantId
		},
		...tenantId ? { tenantId } : {},
		...aadObjectId ? { aadObjectId } : {},
		teamId,
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
	const threadId = isChannel ? conversationMessageId ?? activity.replyToId ?? void 0 : void 0;
	const advertisedMedia = resolveMSTeamsAdvertisedMedia(entry.attachments);
	return {
		...entry,
		activity,
		from: activity.from,
		conversation,
		rawBody: entry.text,
		advertisedMedia,
		quoteInfo: require_resolve_allowlist.extractMSTeamsQuoteInfo(entry.attachments),
		attachmentTypes: entry.attachments.map((attachment) => typeof attachment.contentType === "string" ? attachment.contentType : void 0).filter(Boolean).slice(0, 3),
		htmlSummary: summarizeMSTeamsHtmlAttachments(entry.attachments),
		rawConversationId,
		conversationId,
		conversationMessageId,
		conversationType,
		isChannel,
		teamId,
		graphChannelId: activity.channelData?.channel?.id?.trim() || conversationId,
		threadId,
		historyKey: threadId ? `${conversationId}:thread:${threadId}` : conversationId,
		conversationRef: buildStoredConversationReference({
			activity,
			conversationId,
			conversationType,
			teamId,
			threadId
		})
	};
}
//#endregion
//#region extensions/msteams/src/team-identity.ts
const teamGroupIdCache = /* @__PURE__ */ new Map();
const TEAM_GROUP_ID_CACHE_MAX_ENTRIES = 500;
function cacheTeamGroupId(conversationTeamId, groupId) {
	teamGroupIdCache.set(conversationTeamId, groupId);
	(0, openclaw_plugin_sdk_collection_runtime.pruneMapToMaxSize)(teamGroupIdCache, TEAM_GROUP_ID_CACHE_MAX_ENTRIES);
}
/** Resolve the Graph team GUID without ever treating a Bot Framework team ID as equivalent. */
async function resolveTeamGroupId(params) {
	const activityGroupId = params.aadGroupId?.trim();
	if (activityGroupId) {
		cacheTeamGroupId(params.conversationTeamId, activityGroupId);
		return activityGroupId;
	}
	const cached = teamGroupIdCache.get(params.conversationTeamId);
	if (cached) return cached;
	const getTeamDetails = params.getTeamDetails;
	if (!getTeamDetails) return;
	const groupId = (await require_resolve_allowlist.withMSTeamsRequestDeadline({
		deadline: params.deadline,
		label: "MS Teams team details",
		work: () => getTeamDetails(params.conversationTeamId)
	})).aadGroupId?.trim();
	if (!groupId) return;
	cacheTeamGroupId(params.conversationTeamId, groupId);
	return groupId;
}
//#endregion
//#region extensions/msteams/src/thread-parent-context.ts
const PARENT_CACHE_TTL_MS = 3e5;
const PARENT_CACHE_MAX = 100;
const parentCache = /* @__PURE__ */ new Map();
const INJECTED_MAX = 200;
const injectedParents = /* @__PURE__ */ new Map();
function touchLru(map, key, value, max) {
	if (map.has(key)) map.delete(key);
	else if (map.size >= max) {
		const firstKey = map.keys().next().value;
		if (firstKey !== void 0) map.delete(firstKey);
	}
	map.set(key, value);
}
function buildParentCacheKey(groupId, channelId, parentId) {
	return `${groupId}\u0000${channelId}\u0000${parentId}`;
}
function resolveParentCacheExpiresAt(nowRaw) {
	const nowMs = (0, openclaw_plugin_sdk_number_runtime.asDateTimestampMs)(nowRaw);
	return nowMs === void 0 ? void 0 : (0, openclaw_plugin_sdk_number_runtime.resolveExpiresAtMsFromDurationMs)(PARENT_CACHE_TTL_MS, { nowMs });
}
/**
* Fetch a channel parent message with an LRU+TTL cache.
*
* Uses the injected `fetchParent` (defaults to `fetchChannelMessage`) so
* tests can swap in a stub without mocking the Graph transport.
*/
async function fetchParentMessageCached(token, groupId, channelId, parentId, fetchParent = require_reaction_types.fetchChannelMessage) {
	const key = buildParentCacheKey(groupId, channelId, parentId);
	const now = (0, openclaw_plugin_sdk_number_runtime.asDateTimestampMs)(Date.now());
	const cached = parentCache.get(key);
	const cachedExpiresAt = cached ? (0, openclaw_plugin_sdk_number_runtime.asDateTimestampMs)(cached.expiresAt) : void 0;
	if (cached && now !== void 0 && cachedExpiresAt !== void 0 && cachedExpiresAt > now) {
		parentCache.delete(key);
		parentCache.set(key, cached);
		return cached.message;
	}
	if (cached) parentCache.delete(key);
	const message = await fetchParent(token, groupId, channelId, parentId);
	const expiresAt = resolveParentCacheExpiresAt(Date.now());
	if (expiresAt !== void 0) touchLru(parentCache, key, {
		message,
		expiresAt
	}, PARENT_CACHE_MAX);
	return message;
}
const PARENT_TEXT_MAX_CHARS = 400;
/**
* Extract a compact summary (sender + plain-text body) from a Graph parent
* message. Returns undefined when the parent cannot be summarized (missing
* or blank body).
*/
function summarizeParentMessage(message) {
	if (!message) return;
	const sender = message.from?.user?.displayName ?? message.from?.application?.displayName ?? "unknown";
	const contentType = message.body?.contentType ?? "text";
	const raw = message.body?.content ?? "";
	const text = contentType === "html" ? require_reaction_types.stripHtmlFromTeamsMessage(raw) : raw.replace(/\s+/g, " ").trim();
	if (!text) return;
	return {
		sender,
		text: text.length > PARENT_TEXT_MAX_CHARS ? `${(0, openclaw_plugin_sdk_text_utility_runtime.truncateUtf16Safe)(text, 399)}…` : text
	};
}
/**
* Build the single-line `Replying to @sender: body` system event text.
* Callers should pass this text to `enqueueSystemEvent` together with a
* stable contextKey derived from the parent id.
*/
function formatParentContextEvent(summary) {
	return `Replying to @${summary.sender}: ${summary.text}`;
}
/**
* Decide whether a parent context event should be enqueued for the current
* session. Returns `false` when we already injected the same parent for this
* session recently (prevents re-prepending identical context on every reply
* in the thread).
*/
function shouldInjectParentContext(sessionKey, parentId) {
	const key = sessionKey;
	return injectedParents.get(key) !== parentId;
}
/**
* Record that `parentId` was just injected for `sessionKey` so subsequent
* replies with the same parent can short-circuit via `shouldInjectParentContext`.
*/
function markParentContextInjected(sessionKey, parentId) {
	touchLru(injectedParents, sessionKey, parentId, INJECTED_MAX);
}
//#endregion
//#region extensions/msteams/src/monitor-handler/thread-context.ts
function prepareMSTeamsThreadRouting(params) {
	const route = require_runtime.getMSTeamsRuntime().channel.routing.resolveAgentRoute({
		cfg: params.cfg,
		channel: "msteams",
		teamId: params.teamId,
		peer: {
			kind: params.isDirectMessage ? "direct" : params.isChannel ? "channel" : "group",
			id: params.isDirectMessage ? params.senderId : params.conversationId
		}
	});
	route.sessionKey = require_thread_session.resolveMSTeamsRouteSessionKey({
		baseSessionKey: route.sessionKey,
		isChannel: params.isChannel,
		conversationMessageId: params.conversationMessageId,
		replyToId: params.context.activity.replyToId
	});
	const deadline = require_resolve_allowlist.createMSTeamsInboundDeadline();
	let teamAadGroupId = params.context.activity.channelData?.team?.aadGroupId?.trim() || void 0;
	const conversationTeamId = params.isChannel ? params.teamId : void 0;
	let teamGroupIdPromise;
	const resolveTeamAadGroupId = async () => {
		if (!conversationTeamId) return;
		teamGroupIdPromise ??= resolveTeamGroupId({
			conversationTeamId,
			aadGroupId: teamAadGroupId,
			getTeamDetails: params.context.getTeamDetails,
			deadline
		}).catch((err) => {
			params.log.debug?.("failed to resolve Teams AAD group ID", {
				teamId: conversationTeamId,
				error: require_channel_setup.formatUnknownError(err)
			});
		});
		teamAadGroupId = await teamGroupIdPromise;
		return teamAadGroupId;
	};
	return {
		route,
		threadRootId: params.conversationMessageId ?? params.context.activity.replyToId,
		deadline,
		resolveTeamAadGroupId,
		getTeamAadGroupId: () => teamAadGroupId
	};
}
async function resolveMSTeamsThreadContext(params) {
	const core = require_runtime.getMSTeamsRuntime();
	const activity = params.context.activity;
	const { route, deadline } = params.routing;
	const teamAadGroupId = await params.routing.resolveTeamAadGroupId();
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
	const threadParentId = params.routing.threadRootId;
	if (threadParentId && threadParentId !== activity.id && params.isChannel && teamAadGroupId) try {
		const graphToken = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams thread token",
			work: () => params.tokenProvider.getAccessToken("https://graph.microsoft.com")
		});
		const [parentResult, repliesResult] = await require_resolve_allowlist.withMSTeamsRequestDeadline({
			deadline,
			label: "MS Teams thread history",
			work: () => Promise.allSettled([fetchParentMessageCached(graphToken, teamAadGroupId, params.conversationId, threadParentId, (token, groupId, requestedChannelId, messageId) => require_reaction_types.fetchChannelMessage(token, groupId, requestedChannelId, messageId, deadline)), require_reaction_types.fetchThreadReplies(graphToken, teamAadGroupId, params.conversationId, threadParentId, 50, deadline)])
		});
		const parentMsg = parentResult.status === "fulfilled" ? parentResult.value : void 0;
		const replies = repliesResult.status === "fulfilled" ? repliesResult.value : [];
		if (parentResult.status === "rejected") params.log.debug?.("failed to fetch parent message", { error: require_channel_setup.formatUnknownError(parentResult.reason) });
		if (repliesResult.status === "rejected") params.log.debug?.("failed to fetch thread replies", { error: require_channel_setup.formatUnknownError(repliesResult.reason) });
		const isThreadSenderAllowed = (message) => (0, openclaw_plugin_sdk_channel_inbound.resolveInboundSupplementalSenderAllowed)({
			isGroup: params.isChannel,
			groupPolicy: params.groupPolicy,
			allowFrom: params.effectiveGroupAllowFrom,
			isSenderAllowed: (allowFrom) => require_channel.resolveMSTeamsAllowlistMatch({
				allowFrom,
				senderId: message.from?.user?.id ?? "",
				senderName: message.from?.user?.displayName,
				allowNameMatching: params.allowNameMatching
			}).allowed
		});
		const parentSummary = summarizeParentMessage(parentMsg);
		const visibleParentMessages = parentMsg ? (0, openclaw_plugin_sdk_context_visibility_runtime.filterSupplementalContextItems)({
			items: [parentMsg],
			mode: params.contextVisibilityMode,
			kind: "thread",
			isSenderAllowed: isThreadSenderAllowed
		}).items : [];
		if (parentSummary && visibleParentMessages.length > 0 && shouldInjectParentContext(route.sessionKey, threadParentId)) {
			core.system.enqueueSystemEvent(formatParentContextEvent(parentSummary), {
				sessionKey: route.sessionKey,
				contextKey: `msteams:thread-parent:${params.conversationId}:${threadParentId}`
			});
			markParentContextInjected(route.sessionKey, threadParentId);
		}
		const allMessages = parentMsg ? [parentMsg, ...replies] : replies;
		quoteSenderId = parentMsg?.from?.user?.id ?? parentMsg?.from?.application?.id ?? void 0;
		quoteSenderName = parentMsg?.from?.user?.displayName ?? parentMsg?.from?.application?.displayName ?? params.quoteInfo?.sender;
		const { items: threadMessages } = (0, openclaw_plugin_sdk_context_visibility_runtime.filterSupplementalContextItems)({
			items: allMessages,
			mode: params.contextVisibilityMode,
			kind: "thread",
			isSenderAllowed: isThreadSenderAllowed
		});
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
//#endregion
//#region extensions/msteams/src/monitor-handler/message-handler.ts
function createMSTeamsMessageHandler(deps) {
	const { cfg, runtime, appId, app, tokenProvider, textLimit, mediaMaxBytes, conversationStore, pollStore, log } = deps;
	const core = require_runtime.getMSTeamsRuntime();
	const logVerboseMessage = (message) => {
		if (core.logging.shouldLogVerbose()) log.debug?.(message);
	};
	const msteamsCfg = cfg.channels?.msteams;
	const contextVisibilityMode = (0, openclaw_plugin_sdk_context_visibility_runtime.resolveChannelContextVisibilityMode)({
		cfg,
		channel: "msteams"
	});
	const historyLimit = (0, openclaw_plugin_sdk_number_runtime.resolvePromptHistoryLimit)(msteamsCfg?.historyLimit ?? cfg.messages?.groupChat?.historyLimit);
	const conversationHistories = /* @__PURE__ */ new Map();
	const readConfig = (0, openclaw_plugin_sdk_runtime_config_snapshot.createRuntimeConfigReader)(cfg);
	const resolveDebounceMs = () => core.channel.debounce.resolveInboundDebounceMs({
		cfg: readConfig(),
		channel: "msteams"
	});
	const handleTeamsMessageNow = async (params) => {
		const facts = assembleMSTeamsInboundFacts(params);
		const { context, activity, rawText, text, attachments, advertisedMedia, rawBody, quoteInfo, from, conversation, attachmentTypes, htmlSummary, conversationId, conversationMessageId, conversationType, isChannel, teamId, conversationRef } = facts;
		const historyBody = [text, (0, openclaw_plugin_sdk_channel_inbound.formatMediaPlaceholderText)(advertisedMedia)].filter(Boolean).join("\n");
		log.info("received message", {
			rawText: (0, openclaw_plugin_sdk_text_utility_runtime.truncateUtf16Safe)(rawText, 50),
			text: (0, openclaw_plugin_sdk_text_utility_runtime.truncateUtf16Safe)(text, 50),
			attachments: attachments.length,
			attachmentTypes,
			from: from?.id,
			conversation: conversation?.id
		});
		if (htmlSummary) log.debug?.("html attachment summary", htmlSummary);
		if (!from?.id) {
			log.debug?.("skipping message without from.id");
			return;
		}
		const admission = await admitMSTeamsMessage({
			cfg,
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
		const { senderId, senderName, isDirectMessage, channelGate, allowNameMatching, groupPolicy, commandAuthorized, effectiveGroupAllowFrom, allowTextCommands, isControlCommand } = admission;
		const pollVote = require_polls.extractMSTeamsPollVote(activity);
		if (pollVote) {
			try {
				if (!await pollStore.recordVote({
					pollId: pollVote.pollId,
					voterId: senderId,
					selections: pollVote.selections
				})) log.debug?.("poll vote ignored (poll not found)", { pollId: pollVote.pollId });
				else log.info("recorded poll vote", {
					pollId: pollVote.pollId,
					voter: senderId,
					selections: pollVote.selections
				});
			} catch (err) {
				log.error("failed to record poll vote", {
					pollId: pollVote.pollId,
					error: require_channel_setup.formatUnknownError(err)
				});
			}
			return;
		}
		const threadRouting = prepareMSTeamsThreadRouting({
			cfg,
			context,
			isDirectMessage,
			isChannel,
			senderId,
			conversationId,
			conversationMessageId: conversationMessageId ?? void 0,
			teamId,
			log
		});
		const { route, deadline: preprocessingDeadline } = threadRouting;
		const inboundLabel = isDirectMessage ? `Teams DM from ${senderName}` : `Teams message in ${conversationType} from ${senderName}`;
		const enqueuePrimaryMessageSystemEvent = () => core.system.enqueueSystemEvent(inboundLabel, {
			sessionKey: route.sessionKey,
			contextKey: `msteams:message:${conversationId}:${activity.id ?? "unknown"}`
		});
		const channelId = conversationId;
		const { teamConfig, channelConfig } = channelGate;
		const { requireMention, replyStyle } = require_channel.resolveMSTeamsReplyPolicy({
			isDirectMessage,
			globalConfig: msteamsCfg,
			teamConfig,
			channelConfig
		});
		const timestamp = require_resolve_allowlist.parseMSTeamsActivityTimestamp(activity.timestamp);
		const mentionDecision = (0, openclaw_plugin_sdk_channel_inbound.resolveInboundMentionDecision)({
			facts: {
				canDetectMention: true,
				wasMentioned: params.wasMentioned,
				implicitMentionKinds: params.implicitMentionKinds
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
							messageId: activity.id ?? void 0
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
			htmlSummary: htmlSummary ?? void 0,
			conversationType,
			conversationId,
			conversationMessageId: conversationMessageId ?? void 0,
			teamAadGroupId: threadRouting.getTeamAadGroupId(),
			resolveTeamAadGroupId: threadRouting.resolveTeamAadGroupId,
			mediaMaxBytes,
			tokenProvider,
			mediaAllowHosts: msteamsCfg?.mediaAllowHosts,
			mediaAuthAllowHosts: msteamsCfg?.mediaAuthAllowHosts,
			graphMediaFallback: msteamsCfg?.graphMediaFallback,
			deadline: preprocessingDeadline,
			log
		});
		if (!content) return;
		enqueuePrimaryMessageSystemEvent();
		const thread = await resolveMSTeamsThreadContext({
			routing: threadRouting,
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
		await dispatchMSTeamsInboundTurn({
			cfg,
			runtime,
			appId,
			app,
			tokenProvider,
			textLimit,
			log,
			logVerboseMessage,
			facts,
			admission,
			content,
			routing: threadRouting,
			thread,
			replyStyle,
			timestamp,
			contextVisibilityMode,
			mentionWasEffective: mentionDecision.effectiveWasMentioned,
			conversationHistories,
			historyLimit
		});
	};
	const inboundDebouncer = core.channel.debounce.createInboundDebouncer({
		debounceMs: resolveDebounceMs(),
		resolveDebounceMs,
		buildKey: (entry) => {
			const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(entry.context.activity.conversation?.id ?? "");
			const senderId = entry.context.activity.from?.aadObjectId ?? entry.context.activity.from?.id ?? "";
			if (!senderId || !conversationId) return null;
			return `msteams:${appId}:${conversationId}:${senderId}`;
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
			turnAdoptionLifecycle
		});
		await inboundDebouncer.enqueue(entry);
		if (turnAdoptionLifecycle) return { kind: "deferred" };
	};
}
//#endregion
//#region extensions/msteams/src/monitor-handler/reaction-handler.ts
/**
* Create a handler for MS Teams reaction activities (reactionsAdded / reactionsRemoved).
* The returned function accepts a turn context and a direction string.
*/
function createMSTeamsReactionHandler(deps) {
	const { cfg, log } = deps;
	const core = require_runtime.getMSTeamsRuntime();
	const msteamsCfg = cfg.channels?.msteams;
	return async function handleReaction(context, direction) {
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
			activity
		});
		const { isDirectMessage, channelGate } = access;
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
			log.info(`reaction ${direction}`, {
				sender: senderId,
				reactionType,
				emoji,
				targetMessageId,
				conversationId
			});
			core.system.enqueueSystemEvent(label, {
				sessionKey,
				contextKey: `msteams:reaction:${conversationId}:${targetMessageId}:${senderId}:${reactionType}:${direction}`
			});
		}
	};
}
//#endregion
//#region extensions/msteams/src/welcome-card.ts
/**
* Builds an Adaptive Card for welcoming users when the bot is added to a conversation.
*/
const DEFAULT_PROMPT_STARTERS = [
	"What can you do?",
	"Summarize my last meeting",
	"Help me draft an email"
];
/**
* Build a welcome Adaptive Card for 1:1 personal chats.
*/
function buildWelcomeCard(options) {
	const botName = options?.botName || "OpenClaw";
	const starters = options?.promptStarters?.length ? options.promptStarters : DEFAULT_PROMPT_STARTERS;
	return {
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
}
/**
* Build a brief welcome message for group chats (when the bot is @mentioned).
*/
function buildGroupWelcomeText(botName) {
	const name = botName || "OpenClaw";
	return `Hi! I'm ${name}. Mention me with @${name} to get started.`;
}
//#endregion
//#region extensions/msteams/src/monitor-handler.ts
async function isInvokeAuthorized(params) {
	const { context, deps, deniedLogs, includeInvokeName = false } = params;
	const resolved = await resolveMSTeamsSenderAccess({
		cfg: deps.cfg,
		activity: context.activity
	});
	const { msteamsCfg, isDirectMessage, conversationId, senderId } = resolved;
	const maybeInvokeName = includeInvokeName ? { name: context.activity.name } : void 0;
	if (resolved.hasConflictingConversationScope) {
		deps.log.info("dropping invoke (conflicting conversation scope)", {
			conversationId,
			...maybeInvokeName
		});
		return false;
	}
	if (!msteamsCfg) return true;
	if (isDirectMessage && resolved.senderAccess.decision !== "allow") {
		deps.log.debug?.(deniedLogs.dm, {
			sender: senderId,
			conversationId,
			...maybeInvokeName
		});
		return false;
	}
	if (!isDirectMessage && resolved.channelGate.allowlistConfigured && !resolved.channelGate.allowed) {
		deps.log.debug?.(deniedLogs.channel, {
			conversationId,
			teamKey: resolved.channelGate.teamKey ?? "none",
			channelKey: resolved.channelGate.channelKey ?? "none",
			...maybeInvokeName
		});
		return false;
	}
	if (!isDirectMessage && !resolved.senderAccess.allowed) {
		deps.log.debug?.(deniedLogs.group, {
			sender: senderId,
			conversationId,
			...maybeInvokeName
		});
		return false;
	}
	return true;
}
async function isFeedbackInvokeAuthorized(context, deps) {
	return isInvokeAuthorized({
		context,
		deps,
		deniedLogs: {
			dm: "dropping feedback invoke (dm sender not allowlisted)",
			channel: "dropping feedback invoke (not in team/channel allowlist)",
			group: "dropping feedback invoke (group sender not allowlisted)"
		}
	});
}
async function isSigninInvokeAuthorized(context, deps) {
	return isInvokeAuthorized({
		context,
		deps,
		deniedLogs: {
			dm: "dropping signin invoke (dm sender not allowlisted)",
			channel: "dropping signin invoke (not in team/channel allowlist)",
			group: "dropping signin invoke (group sender not allowlisted)"
		},
		includeInvokeName: true
	});
}
async function isCardActionInvokeAuthorized(context, deps) {
	return isInvokeAuthorized({
		context,
		deps,
		deniedLogs: {
			dm: "dropping card action invoke (dm sender not allowlisted)",
			channel: "dropping card action invoke (not in team/channel allowlist)",
			group: "dropping card action invoke (group sender not allowlisted)"
		},
		includeInvokeName: true
	});
}
function registerMSTeamsHandlers(handler, deps) {
	const handleTeamsMessage = createMSTeamsMessageHandler(deps);
	const handleReaction = createMSTeamsReactionHandler(deps);
	const originalRun = handler.run;
	if (originalRun) handler.run = async (context, turnAdoptionLifecycle) => {
		const ctx = context;
		if (ctx.activity?.type === "invoke" && ctx.activity?.name === "adaptiveCard/action") {
			if (await maybeHandleMSTeamsApprovalCardSubmit({
				context: ctx,
				deps
			})) return;
			const text = serializeMSTeamsAdaptiveCardActionValue(ctx.activity?.value);
			if (text) return await handleTeamsMessage({
				...ctx,
				activity: {
					...ctx.activity,
					type: "message",
					text
				}
			}, turnAdoptionLifecycle);
			return;
		}
		return originalRun.call(handler, context, turnAdoptionLifecycle);
	};
	handler.onMessage(async (context, next, turnAdoptionLifecycle) => {
		let nextRan = false;
		const runNext = async () => {
			nextRan = true;
			await next();
		};
		try {
			const ctx = context;
			if (await maybeHandleMSTeamsApprovalCardSubmit({
				context: ctx,
				deps
			})) {
				await runNext();
				return;
			}
			const result = await handleTeamsMessage(ctx, turnAdoptionLifecycle);
			await runNext();
			return result;
		} catch (err) {
			if (turnAdoptionLifecycle) throw err;
			deps.runtime.error(`msteams handler failed: ${require_channel_setup.formatUnknownError(err)}`);
		}
		if (!nextRan) await runNext();
	});
	handler.onMembersAdded(async (context, next) => {
		const ctx = context;
		const membersAdded = ctx.activity?.membersAdded ?? [];
		const botId = ctx.activity?.recipient?.id;
		const msteamsCfg = deps.cfg.channels?.msteams;
		for (const member of membersAdded) if (member.id === botId) {
			const isPersonal = ((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(ctx.activity?.conversation?.conversationType) ?? "personal") === "personal";
			if (isPersonal && msteamsCfg?.welcomeCard !== false) {
				const card = buildWelcomeCard({
					botName: ctx.activity?.recipient?.name ?? void 0,
					promptStarters: msteamsCfg?.promptStarters
				});
				try {
					await ctx.sendActivity({
						type: "message",
						attachments: [{
							contentType: "application/vnd.microsoft.card.adaptive",
							content: card
						}]
					});
					deps.log.info("sent welcome card");
				} catch (err) {
					deps.log.debug?.("failed to send welcome card", { error: require_channel_setup.formatUnknownError(err) });
				}
			} else if (!isPersonal && msteamsCfg?.groupWelcomeCard === true) {
				const botName = ctx.activity?.recipient?.name ?? void 0;
				try {
					await ctx.sendActivity(buildGroupWelcomeText(botName));
					deps.log.info("sent group welcome message");
				} catch (err) {
					deps.log.debug?.("failed to send group welcome", { error: require_channel_setup.formatUnknownError(err) });
				}
			} else deps.log.debug?.("skipping welcome (disabled by config or conversation type)");
		} else deps.log.debug?.("member added", { member: member.id });
		await next();
	});
	handler.onReactionsAdded(async (context, next) => {
		try {
			await handleReaction(context, "added");
		} catch (err) {
			deps.runtime.error(`msteams reaction handler failed: ${String(err)}`);
		}
		await next();
	});
	handler.onReactionsRemoved(async (context, next) => {
		try {
			await handleReaction(context, "removed");
		} catch (err) {
			deps.runtime.error(`msteams reaction handler failed: ${String(err)}`);
		}
		await next();
	});
	return handler;
}
//#endregion
//#region extensions/msteams/src/feedback-invoke.ts
/**
* Run the message-submit (feedback) invoke handler.
*
* Teams delivers feedback (`actionName === "feedback"`) on AI-generated
* messages as a `message/submitAction` invoke. The SDK wraps a void return
* into the HTTP 200 InvokeResponse, so this function intentionally does
* not ack itself — the legacy `ctx.sendActivity({ type: "invokeResponse",
* … })` shape is gone (it became an outbound BF activity on the new SDK
* instead of the HTTP response).
*
* Returns `true` if the invoke matched the feedback shape and was
* consumed (whether or not it was authorized / written / reflected on),
* `false` if the invoke didn't look like feedback at all and the caller
* should fall through to other handlers.
*/
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
	const msteamsCfg = deps.cfg.channels?.msteams;
	if (msteamsCfg?.feedbackEnabled === false) {
		deps.log.debug?.("feedback handling disabled");
		return true;
	}
	if (!await isFeedbackInvokeAuthorized(context, deps)) return true;
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
		cfg: deps.cfg,
		channel: "msteams",
		peer: {
			kind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
			id: isDirectMessage ? senderId : conversationId
		}
	});
	const feedbackThreadId = isChannel ? require_resolve_allowlist.extractMSTeamsConversationMessageId(rawConversationId) ?? activity.replyToId ?? void 0 : void 0;
	if (feedbackThreadId) route.sessionKey = (0, openclaw_plugin_sdk_routing.resolveThreadSessionKeys)({
		baseSessionKey: route.sessionKey,
		threadId: feedbackThreadId,
		parentSessionKey: route.sessionKey
	}).sessionKey;
	const feedbackEvent = buildFeedbackEvent({
		messageId,
		value: isNegative ? "negative" : "positive",
		comment: userComment,
		sessionKey: route.sessionKey,
		agentId: route.agentId,
		conversationId
	});
	deps.log.info("received feedback", {
		value: feedbackEvent.value,
		messageId,
		conversationId,
		hasComment: Boolean(userComment)
	});
	try {
		await (0, openclaw_plugin_sdk_channel_inbound.recordChannelFeedbackEvent)({
			cfg: deps.cfg,
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
	if (isNegative && msteamsCfg?.feedbackReflection !== false) runFeedbackReflection({
		cfg: deps.cfg,
		app: deps.app,
		conversationRef,
		sessionKey: route.sessionKey,
		agentId: route.agentId,
		conversationId,
		conversationKind: isDirectMessage ? "direct" : isChannel ? "channel" : "group",
		userComment,
		log: deps.log
	}).catch((err) => {
		deps.log.error("feedback reflection failed", { error: require_channel_setup.formatUnknownError(err) });
	});
	return true;
}
//#endregion
//#region extensions/msteams/src/file-consent-invoke.ts
/**
* Handle fileConsent/invoke activities for large file uploads.
*/
async function handleMSTeamsFileConsentInvoke(context, log) {
	const expiredUploadMessage = "The file upload request has expired. Please try sending the file again.";
	const activity = context.activity;
	if (activity.type !== "invoke" || activity.name !== "fileConsent/invoke") return false;
	const consentResponse = require_messenger.parseFileConsentInvoke(activity);
	if (!consentResponse) {
		log.debug?.("invalid file consent invoke", { value: activity.value });
		return false;
	}
	const uploadId = typeof consentResponse.context?.uploadId === "string" ? consentResponse.context.uploadId : void 0;
	const inMemoryFile = require_messenger.getPendingUpload(uploadId);
	const fsFile = inMemoryFile ? void 0 : await require_messenger.getPendingUploadFs(uploadId);
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
			return true;
		}
	}
	if (consentResponse.action === "accept" && consentResponse.uploadInfo) {
		if (pendingFile) {
			log.debug?.("user accepted file consent, uploading", {
				uploadId,
				filename: pendingFile.filename,
				size: pendingFile.buffer.length
			});
			try {
				await require_messenger.uploadToConsentUrl({
					url: consentResponse.uploadInfo.uploadUrl,
					buffer: pendingFile.buffer,
					contentType: pendingFile.contentType
				});
				const fileInfoCard = require_messenger.buildFileInfoCard({
					filename: consentResponse.uploadInfo.name,
					contentUrl: consentResponse.uploadInfo.contentUrl,
					uniqueId: consentResponse.uploadInfo.uniqueId,
					fileType: consentResponse.uploadInfo.fileType
				});
				if (!pendingFile.consentCardActivityId) await context.sendActivity({
					type: "message",
					attachments: [fileInfoCard]
				});
				if (pendingFile.consentCardActivityId) try {
					await context.updateActivity({
						id: pendingFile.consentCardActivityId,
						type: "message",
						attachments: [fileInfoCard]
					});
				} catch {
					await context.sendActivity({
						type: "message",
						attachments: [fileInfoCard]
					});
				}
				log.info("file upload complete", {
					uploadId,
					filename: consentResponse.uploadInfo.name,
					uniqueId: consentResponse.uploadInfo.uniqueId
				});
			} catch (err) {
				log.error("file upload failed", {
					uploadId,
					error: require_channel_setup.formatUnknownError(err)
				});
				await context.sendActivity("File upload failed. Please try again.");
			} finally {
				require_messenger.removePendingUpload(uploadId);
				await require_messenger.removePendingUploadFs(uploadId);
			}
		} else {
			log.debug?.("pending file not found for consent", { uploadId });
			await context.sendActivity(expiredUploadMessage);
		}
	} else {
		log.debug?.("user declined file consent", { uploadId });
		require_messenger.removePendingUpload(uploadId);
		await require_messenger.removePendingUploadFs(uploadId);
	}
	return true;
}
/**
* Run the file-consent invoke handler after the SDK route has acknowledged the
* invoke. This intentionally does not send its own invokeResponse; it only does
* the delayed upload/update work.
*/
async function runMSTeamsFileConsentInvokeHandler(context, log) {
	try {
		await require_messenger.withRevokedProxyFallback({
			run: async () => await handleMSTeamsFileConsentInvoke(context, log),
			onRevoked: async () => true,
			onRevokedLog: () => {
				log.debug?.("turn context revoked during file consent invoke; skipping delayed response");
			}
		});
	} catch (err) {
		log.debug?.("file consent handler error", { error: require_channel_setup.formatUnknownError(err) });
	}
}
//#endregion
//#region extensions/msteams/src/monitor-status.ts
function publishMSTeamsBlocked(statusSink, lastError) {
	statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelBlockedPatch)(lastError, { running: true }));
}
function publishMSTeamsReady(statusSink, now = Date.now()) {
	statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelReadyPatch)({ lastConnectedAt: now }));
}
function publishMSTeamsRecovering(statusSink, lastError) {
	statusSink?.({
		connected: false,
		lifecycle: "recovering",
		lastError
	});
}
function publishMSTeamsStopped(statusSink) {
	statusSink?.((0, openclaw_plugin_sdk_gateway_runtime.channelStoppedPatch)());
}
//#endregion
//#region extensions/msteams/src/msteams-ingress.ts
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
				if (installedLiveContext && liveContexts.get(facts.eventId) === liveContext) liveContexts.delete(facts.eventId);
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
				let graceTimer;
				const graceElapsed = new Promise((resolve) => {
					graceTimer = setTimeout(resolve, require_resolve_allowlist.MSTEAMS_REQUEST_TIMEOUT_MS);
					graceTimer.unref?.();
				});
				try {
					await Promise.race([monitor.waitForIdle(), graceElapsed]);
				} finally {
					clearTimeout(graceTimer);
					await monitor.stop();
					liveContexts.clear();
				}
			})();
			return stopTask;
		}
	};
}
//#endregion
//#region extensions/msteams/src/replay-context.ts
function createMSTeamsReplayContext(activity, app, serviceUrlBoundary) {
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
		...quoteActivityId ? { quoteActivityId } : {},
		...threadActivityId ? { threadActivityId } : {},
		serviceUrlBoundary
	};
	const sendActivity = (outbound) => require_messenger.sendMSTeamsActivityWithReference(app, reference, outbound, proactiveOptions);
	return {
		activity,
		sendActivity,
		sendActivities: async (activities) => {
			const results = [];
			for (const outbound of activities) results.push(await sendActivity(outbound));
			return results;
		},
		updateActivity: async (outbound) => {
			return await require_messenger.updateMSTeamsActivityWithReference(app, reference, typeof outbound.id === "string" ? outbound.id : "", outbound, proactiveOptions);
		},
		deleteActivity: async (activityId) => {
			await require_messenger.deleteMSTeamsActivityWithReference(app, reference, activityId, proactiveOptions);
		},
		getTeamDetails: (teamId) => app.api.teams.getById(teamId)
	};
}
//#endregion
//#region extensions/msteams/src/webhook-timeouts.ts
const MSTEAMS_WEBHOOK_INACTIVITY_TIMEOUT_MS = 3e4;
const MSTEAMS_WEBHOOK_REQUEST_TIMEOUT_MS = 3e4;
const MSTEAMS_WEBHOOK_HEADERS_TIMEOUT_MS = 15e3;
function applyMSTeamsWebhookTimeouts(httpServer, opts) {
	const inactivityTimeoutMs = opts?.inactivityTimeoutMs ?? MSTEAMS_WEBHOOK_INACTIVITY_TIMEOUT_MS;
	const requestTimeoutMs = opts?.requestTimeoutMs ?? MSTEAMS_WEBHOOK_REQUEST_TIMEOUT_MS;
	const headersTimeoutMs = Math.min(opts?.headersTimeoutMs ?? MSTEAMS_WEBHOOK_HEADERS_TIMEOUT_MS, requestTimeoutMs);
	httpServer.setTimeout(inactivityTimeoutMs);
	httpServer.requestTimeout = requestTimeoutMs;
	httpServer.headersTimeout = headersTimeoutMs;
}
//#endregion
//#region extensions/msteams/src/monitor.ts
async function monitorMSTeamsProvider(opts) {
	const core = require_runtime.getMSTeamsRuntime();
	const log = core.logging.getChildLogger({ name: "msteams" });
	let cfg = opts.cfg;
	let msteamsCfg = cfg.channels?.msteams;
	if (!msteamsCfg?.enabled) {
		log.debug?.("msteams provider disabled");
		publishMSTeamsBlocked(opts.statusSink, "Microsoft Teams provider is disabled");
		return {
			app: null,
			shutdown: async () => {}
		};
	}
	const creds = require_resolve_allowlist.resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) {
		log.error("msteams credentials not configured");
		publishMSTeamsBlocked(opts.statusSink, "Microsoft Teams credentials are not configured");
		return {
			app: null,
			shutdown: async () => {}
		};
	}
	const appId = creds.appId;
	const runtime = opts.runtime ?? {
		log: console.log,
		error: console.error,
		exit: (code) => {
			throw new Error(`exit ${code}`);
		}
	};
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
		if (entries.length === 0) return {
			additions: [],
			unresolved: []
		};
		const resolved = await require_resolve_allowlist.resolveMSTeamsUserAllowlist({
			cfg,
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
				teamIdMode: "bot-framework",
				teams: msteamsCfg.teams
			});
			teamsConfig = resolved.teams;
			(0, openclaw_plugin_sdk_allow_from.summarizeMapping)("msteams channels", resolved.mapping, resolved.unresolved, runtime);
		}
	} catch (err) {
		runtime.error?.(`msteams resolve failed; mutable allowlist entries are disabled. ${require_channel_setup.formatUnknownError(err)}`);
	}
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
	cfg = {
		...cfg,
		channels: {
			...cfg.channels,
			msteams: msteamsCfg
		}
	};
	const port = msteamsCfg.webhook?.port ?? 3978;
	const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "msteams");
	const mediaMaxBytes = (0, openclaw_plugin_sdk_account_helpers.resolveChannelMediaMaxBytes)({
		cfg,
		resolveChannelLimitMb: ({ cfg: channelCfg }) => channelCfg.channels?.msteams?.mediaMaxMb
	}) ?? 8388608;
	const conversationStore = opts.conversationStore ?? require_polls.createMSTeamsConversationStoreState();
	const pollStore = opts.pollStore ?? require_polls.createMSTeamsPollStoreState();
	log.info(`starting provider (port ${port})`);
	const express = await import("express");
	const expressApp = express.default();
	expressApp.use((req, res, next) => {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith("Bearer ")) {
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
	const configuredPath = msteamsCfg.webhook?.path ?? "/api/messages";
	const ssoConnectionName = msteamsCfg.sso?.enabled && msteamsCfg.sso.connectionName ? msteamsCfg.sso.connectionName : void 0;
	const { app } = await require_resolve_allowlist.loadMSTeamsSdkWithAuth(creds, {
		...require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg),
		httpServerAdapter: await require_resolve_allowlist.createMSTeamsExpressAdapter(expressApp),
		messagingEndpoint: configuredPath,
		...ssoConnectionName ? { oauthDefaultConnectionName: ssoConnectionName } : {}
	});
	if (configuredPath !== "/api/messages") {
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
		tokenStore: require_sso_token_store.createMSTeamsSsoTokenStoreFs(),
		connectionName: ssoConnectionName
	} : void 0;
	if (ssoDeps) log.debug?.("msteams sso enabled", { connectionName: ssoDeps.connectionName });
	const handler = buildActivityHandler();
	const handlerDeps = {
		cfg,
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
	registerMSTeamsHandlers(handler, handlerDeps);
	const ingress = createMSTeamsIngress({
		accountId: appId,
		runtime,
		dispatch: async (activity, lifecycle, liveContext) => {
			if (liveContext) liveContext.activity = activity;
			const context = liveContext ?? createMSTeamsReplayContext(activity, app, require_resolve_allowlist.resolveMSTeamsSdkCloudOptions(msteamsCfg));
			return await handler.run(context, lifecycle);
		}
	});
	app.on("card.action", async (ctx) => {
		const adaptedCtx = adaptSdkContext(ctx, app);
		try {
			const activity = adaptedCtx.activity;
			const vote = require_polls.extractMSTeamsPollVote(activity);
			if (vote) {
				const voterId = activity?.from?.aadObjectId ?? activity?.from?.id ?? "unknown";
				try {
					if (!await isCardActionInvokeAuthorized(adaptedCtx, handlerDeps)) return {
						statusCode: 200,
						type: "application/vnd.microsoft.activity.message",
						value: "Not authorized."
					};
					const existingPoll = await pollStore.getPoll(vote.pollId);
					if (!existingPoll) {
						log.debug?.("poll vote ignored (poll not found)", { pollId: vote.pollId });
						return {
							statusCode: 200,
							type: "application/vnd.microsoft.activity.message",
							value: "Poll not found."
						};
					}
					const pollConversationId = existingPoll.conversationId ? require_resolve_allowlist.normalizeMSTeamsConversationId(existingPoll.conversationId) : void 0;
					const activityConversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(activity?.conversation?.id ?? "");
					if (pollConversationId && pollConversationId !== activityConversationId) {
						log.info("poll vote ignored (conversation mismatch)", {
							pollId: vote.pollId,
							expectedConversationId: pollConversationId,
							receivedConversationId: activityConversationId || void 0
						});
						return {
							statusCode: 200,
							type: "application/vnd.microsoft.activity.message",
							value: "Poll not found."
						};
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
						return {
							statusCode: 200,
							type: "application/vnd.microsoft.activity.message",
							value: "Vote recorded."
						};
					}
					log.debug?.("poll vote ignored (poll not found)", { pollId: vote.pollId });
					return {
						statusCode: 200,
						type: "application/vnd.microsoft.activity.message",
						value: "Poll not found."
					};
				} catch (err) {
					log.error("failed to record poll vote", {
						pollId: vote.pollId,
						error: require_channel_setup.formatUnknownError(err)
					});
					return {
						statusCode: 500,
						type: "application/vnd.microsoft.error",
						value: {
							code: "RECORD_VOTE_FAILED",
							message: "Could not record vote.",
							innerHttpError: {
								statusCode: 500,
								body: null
							}
						}
					};
				}
			}
			await ingress.accept(activity, adaptedCtx);
			return {
				statusCode: 200,
				type: "application/vnd.microsoft.activity.message",
				value: "OK"
			};
		} catch (err) {
			log.error("msteams card.action failed", { error: require_channel_setup.formatUnknownError(err) });
			return {
				statusCode: 500,
				type: "application/vnd.microsoft.error",
				value: {
					code: "CARD_ACTION_FAILED",
					message: "Card action failed.",
					innerHttpError: {
						statusCode: 500,
						body: null
					}
				}
			};
		}
	});
	app.on("file.consent.accept", (ctx) => {
		runMSTeamsFileConsentInvokeHandler(adaptSdkContext(ctx, app), log);
	});
	app.on("file.consent.decline", (ctx) => {
		runMSTeamsFileConsentInvokeHandler(adaptSdkContext(ctx, app), log);
	});
	const handleSdkSigninInvoke = async (ctx, delegateName) => {
		const adaptedCtx = adaptSdkContext(ctx, app);
		if (!await isSigninInvokeAuthorized(adaptedCtx, handlerDeps)) return {
			status: 200,
			body: {}
		};
		if (!ssoDeps) {
			log.debug?.("signin invoke received but msteams.sso is not configured", { name: adaptedCtx.activity?.name });
			return {
				status: 200,
				body: {}
			};
		}
		const sdkSigninApp = app;
		const delegate = sdkSigninApp[delegateName];
		if (typeof delegate !== "function") throw new Error(`Teams SDK ${delegateName} handler is unavailable`);
		return delegate.call(sdkSigninApp, ctx);
	};
	app.on("signin.token-exchange", (ctx) => handleSdkSigninInvoke(ctx, "onTokenExchange"));
	app.on("signin.verify-state", (ctx) => handleSdkSigninInvoke(ctx, "onVerifyState"));
	if (ssoDeps) app.event("signin", (ctx) => {
		(async () => {
			if (!await isSigninInvokeAuthorized(adaptSdkContext(ctx, app), handlerDeps)) return;
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
			await handler.run(adaptedCtx);
		} catch (err) {
			log.error("msteams non-turn activity failed", { error: require_channel_setup.formatUnknownError(err) });
		}
	});
	await app.initialize();
	ingress.start();
	const privateQaRuntime = require_resolve_allowlist.resolveMSTeamsPrivateQaRuntime();
	const httpServer = await new Promise((resolve, reject) => {
		const onListen = (err) => err ? reject(err) : resolve(server);
		const server = privateQaRuntime ? expressApp.listen(port, privateQaRuntime.listenHost, onListen) : expressApp.listen(port, onListen);
	}).catch(async (err) => {
		log.error("msteams server error", { error: require_channel_setup.formatUnknownError(err) });
		await ingress.stop();
		throw err;
	});
	log.info(`msteams provider started on port ${port}`);
	publishMSTeamsReady(opts.statusSink);
	applyMSTeamsWebhookTimeouts(httpServer);
	httpServer.on("error", (err) => {
		log.error("msteams server error", { error: require_channel_setup.formatUnknownError(err) });
		publishMSTeamsRecovering(opts.statusSink, require_channel_setup.formatUnknownError(err));
	});
	const shutdown = async () => {
		log.info("shutting down msteams provider");
		await new Promise((resolve) => {
			httpServer.close((err) => {
				if (err) log.debug?.("msteams server close error", { error: require_channel_setup.formatUnknownError(err) });
				resolve();
			});
		});
		await ingress.stop();
		publishMSTeamsStopped(opts.statusSink);
	};
	await (0, openclaw_plugin_sdk_channel_outbound.keepHttpServerTaskAlive)({
		server: httpServer,
		abortSignal: opts.abortSignal,
		onAbort: shutdown
	});
	return {
		app: expressApp,
		shutdown
	};
}
/**
* Build a minimal ActivityHandler-compatible object that supports
* onMessage / onMembersAdded registration and a run() method.
*/
function buildActivityHandler() {
	const messageHandlers = [];
	const membersAddedHandlers = [];
	const reactionsAddedHandlers = [];
	const reactionsRemovedHandlers = [];
	const handler = {
		onMessage(cb) {
			messageHandlers.push(cb);
			return handler;
		},
		onMembersAdded(cb) {
			membersAddedHandlers.push(cb);
			return handler;
		},
		onReactionsAdded(cb) {
			reactionsAddedHandlers.push(cb);
			return handler;
		},
		onReactionsRemoved(cb) {
			reactionsRemovedHandlers.push(cb);
			return handler;
		},
		async run(context, turnAdoptionLifecycle) {
			const ctx = context;
			const activityType = ctx?.activity?.type;
			const noop = async () => {};
			if (activityType === "message") for (const h of messageHandlers) {
				const result = await h(context, noop, turnAdoptionLifecycle);
				if (result) return result;
			}
			else if (activityType === "conversationUpdate") for (const h of membersAddedHandlers) await h(context, noop);
			else if (activityType === "messageReaction") {
				const activity = ctx?.activity;
				if (activity?.reactionsAdded?.length) for (const h of reactionsAddedHandlers) await h(context, noop);
				if (activity?.reactionsRemoved?.length) for (const h of reactionsRemovedHandlers) await h(context, noop);
			}
		}
	};
	return handler;
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
		sendActivities: async (activities) => {
			const results = [];
			for (const a of activities) results.push(await sendActivity(a));
			return results;
		},
		updateActivity: async (activity) => {
			const activityId = activity.id ?? "";
			return activityApi.conversations.activities(conversationId).update(activityId, activity);
		},
		deleteActivity: async (activityId) => {
			return activityApi.conversations.activities(conversationId).delete(activityId);
		},
		getTeamDetails,
		stream: sdkCtx.stream
	});
}
//#endregion
exports.monitorMSTeamsProvider = monitorMSTeamsProvider;

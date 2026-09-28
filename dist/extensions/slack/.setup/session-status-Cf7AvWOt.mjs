import { n as isSlackPluginAccountConfigured } from "./account-configured-sUohAxZr.mjs";
import { a as resolveDefaultSlackAccountId, i as mergeSlackAccountConfig, o as resolveSlackAccount, r as listSlackAccountIds, s as resolveSlackAccountAllowFrom } from "./accounts-BBHvg0pY.mjs";
import { a as parseSlackTarget, n as formatSlackTarget, t as canonicalizeSlackApiTargetId } from "./target-parsing-DEsPjngB.mjs";
import { t as slackContextTargetsMatch } from "./targets-Cku2KCvg.mjs";
import { O as resolveSlackAllowListMatch, T as normalizeAllowListLower, k as resolveSlackUserAllowListForTeam, o as formatSlackError } from "./probe-DiYIMPJo.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeStringifiedOptionalString, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeMessageChannel } from "openclaw/plugin-sdk/routing";
import { defaultRuntime, logVerbose, warn } from "openclaw/plugin-sdk/runtime-env";
import { FormatCapabilityProfile, chunkTextForOutbound, markdownToIR, renderMarkdownIRChunksWithinLimit, renderMarkdownWithMarkers } from "openclaw/plugin-sdk/text-chunking";
import { sliceUtf16Safe, truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import { buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { createNativeApprovalChannelRouteGates, doesApprovalRequestSelectChannelAccount, resolveApprovalKind, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { createChannelApprovalAuth, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { createChannelExecApprovalProfile, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { normalizeHyphenSlug } from "openclaw/plugin-sdk/string-normalization-runtime";
import { channelRouteTargetsMatchExact, stringifyRouteThreadId } from "openclaw/plugin-sdk/channel-route";
import { resolveGlobalMap } from "openclaw/plugin-sdk/global-singleton";
import { normalizeMessagePresentation, renderMessagePresentationChartFallbackText, renderMessagePresentationFallbackText, renderMessagePresentationTableFallbackText } from "openclaw/plugin-sdk/interactive-runtime";
import { eastAsianWidthType } from "get-east-asian-width";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRoute } from "openclaw/plugin-sdk/conversation-runtime";
import { resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
//#region extensions/slack/src/account-reply-mode.ts
function normalizeSlackChatType(raw) {
	const value = raw?.trim().toLowerCase();
	if (!value) return;
	if (value === "direct" || value === "dm") return "direct";
	if (value === "group" || value === "channel") return value;
}
function resolveSlackReplyToMode(account, chatType) {
	const normalized = normalizeSlackChatType(chatType ?? void 0);
	if (normalized && account.replyToModeByChatType?.[normalized] !== void 0) return account.replyToModeByChatType[normalized] ?? "off";
	return account.replyToMode ?? "off";
}
//#endregion
//#region extensions/slack/src/action-threading.ts
const SLACK_PRIVATE_ACTION_DELIVERY_RESULT = Symbol("slack.action.delivery-result");
function resolveSlackAutoThreadId(params) {
	const context = params.toolContext;
	if (!context?.currentChannelId && !context?.currentMessagingTarget) return;
	if (!slackContextTargetsMatch(params.to, context)) return;
	if (!context.currentThreadTs) {
		if (context.sameChannelThreadRequired) throw new Error("Slack thread context is required for same-channel replies from a threaded Slack turn. Set topLevel=true or threadId=null to post at the channel root.");
		return;
	}
	if (context.replyToMode !== "all" && !isSingleUseReplyToMode(context.replyToMode ?? "off")) return;
	if (isSingleUseReplyToMode(context.replyToMode ?? "off") && context.hasRepliedRef?.value) return;
	return context.currentThreadTs;
}
//#endregion
//#region extensions/slack/src/exec-approvals.ts
function normalizeSlackUserLikeId(value) {
	const upper = value.toUpperCase();
	return /^[UW][A-Z0-9]+$/.test(upper) ? upper : void 0;
}
function normalizeSlackApproverTarget(value) {
	const trimmed = normalizeStringifiedOptionalString(value);
	if (!trimmed) return;
	try {
		const target = parseSlackTarget(trimmed, { defaultKind: "user" });
		const id = target?.kind === "user" ? normalizeSlackUserLikeId(target.id) : void 0;
		return target?.teamId && id ? formatSlackTarget({
			kind: "user",
			id,
			teamId: target.teamId.toUpperCase()
		}) : id;
	} catch {
		return;
	}
}
function normalizeSlackApproverId(value) {
	const target = normalizeSlackApproverTarget(value);
	return target?.startsWith("team:") ? void 0 : target;
}
function resolveSlackOwnerApprovers(cfg) {
	const ownerAllowFrom = cfg.commands?.ownerAllowFrom;
	if (!Array.isArray(ownerAllowFrom) || ownerAllowFrom.length === 0) return [];
	return resolveApprovalApprovers({
		explicit: ownerAllowFrom,
		normalizeApprover: normalizeSlackApproverId
	});
}
function getSlackExecApprovalApprovers(params) {
	const account = resolveSlackAccount(params).config;
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers ?? resolveSlackOwnerApprovers(params.cfg),
		normalizeApprover: normalizeSlackApproverId
	});
}
function isSlackExecApprovalTargetRecipient(params) {
	return isChannelExecApprovalTargetRecipient({
		...params,
		channel: "slack",
		normalizeSenderId: normalizeSlackApproverId,
		matchTarget: ({ target, normalizedSenderId }) => normalizeSlackApproverId(target.to) === normalizedSenderId
	});
}
const slackExecApprovalProfile = createChannelExecApprovalProfile({
	resolveConfig: (params) => resolveSlackAccount(params).config.execApprovals,
	resolveApprovers: getSlackExecApprovalApprovers,
	normalizeSenderId: normalizeSlackApproverId,
	isTargetRecipient: isSlackExecApprovalTargetRecipient
});
const isSlackExecApprovalClientEnabled = slackExecApprovalProfile.isClientEnabled;
const isSlackExecApprovalAuthorizedSender = slackExecApprovalProfile.isAuthorizedSender;
const resolveSlackExecApprovalTarget = slackExecApprovalProfile.resolveTarget;
const shouldSuppressLocalSlackExecApprovalPrompt = slackExecApprovalProfile.shouldSuppressLocalPrompt;
//#endregion
//#region extensions/slack/src/approval-auth.ts
function resolveSlackApprovalInputs(params) {
	const account = resolveSlackAccount(params).config;
	return {
		allowFrom: resolveSlackAccountAllowFrom(params),
		defaultTo: account.defaultTo
	};
}
function slackApprovalTargetMatches(senderId, approvers) {
	const sender = parseSlackTarget(senderId, { defaultKind: "user" });
	return sender?.kind === "user" && resolveSlackAllowListMatch({
		allowList: normalizeAllowListLower([...approvers]),
		teamId: sender.teamId,
		id: sender.id
	}).allowed;
}
const slackApproval = createChannelApprovalAuth({
	channelLabel: "Slack",
	resolveInputs: resolveSlackApprovalInputs,
	normalizeApprover: normalizeSlackApproverTarget,
	normalizeDefaultTo: normalizeSlackApproverTarget,
	normalizeSenderId: normalizeSlackApproverTarget,
	isWildcardAuthorized: ({ purpose, senderId, inputs, approvers }) => Boolean(senderId && (slackApprovalTargetMatches(senderId, approvers) || purpose === "sender" && approvers.length === 0 && inputs.allowFrom?.some((entry) => String(entry).trim() === "*")))
});
const getSlackApprovalApprovers = slackApproval.resolveApprovers;
const isSlackApprovalAuthorizedSender = slackApproval.isAuthorizedSender;
function getSlackApprovalApproversForTeam(params) {
	return resolveApprovalApprovers({
		allowFrom: resolveSlackUserAllowListForTeam({
			allowList: getSlackApprovalApprovers(params),
			teamId: params.teamId
		}),
		normalizeApprover: normalizeSlackApproverTarget
	});
}
//#endregion
//#region extensions/slack/src/installation-identity-state.ts
const slackInstallationStates = resolveGlobalMap(Symbol.for("openclaw.slack.installation-identities"), "close-and-restart");
function registerSlackInstallationState(accountId, kind) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const owner = Symbol(`slack-installation:${normalizedAccountId}`);
	slackInstallationStates.set(normalizedAccountId, {
		kind,
		owner
	});
	return {
		update: (nextKind) => {
			if (slackInstallationStates.get(normalizedAccountId)?.owner === owner) slackInstallationStates.set(normalizedAccountId, {
				kind: nextKind,
				owner
			});
		},
		release: () => {
			if (slackInstallationStates.get(normalizedAccountId)?.owner === owner) slackInstallationStates.delete(normalizedAccountId);
		}
	};
}
function getSlackInstallationKind(accountId) {
	return slackInstallationStates.get(normalizeAccountId(accountId))?.kind;
}
function isSlackWorkspaceInstallation(accountId) {
	return getSlackInstallationKind(accountId) === "workspace";
}
//#endregion
//#region extensions/slack/src/approval-native-gates.ts
const DEFAULT_APPROVAL_FORWARDING_MODE = "session";
const SLACK_DM_CHANNEL_ID_RE = /^D[A-Z0-9]{8,}$/i;
const SLACK_USER_ID_RE = /^[UW][A-Z0-9]{8,}$/i;
function isSlackApprovalTransportEnabled(params) {
	const account = resolveSlackAccount(params);
	return isSlackPluginAccountConfigured(account);
}
function resolveSlackNativeApprovalConfig(params) {
	return resolveSlackAccount(params).config.execApprovals;
}
function resolvePluginApprovalForwardingConfig(cfg) {
	return cfg.approvals?.plugin;
}
function normalizeSlackThreadMatchKey(threadId) {
	return threadId == null ? "" : String(threadId).trim();
}
function normalizeComparableTarget(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function extractSlackSessionKind(sessionKey) {
	if (!sessionKey) return null;
	const match = sessionKey.match(/slack:(direct|channel|group):/i);
	const kind = normalizeLowercaseStringOrEmpty(match?.[1]);
	return kind ? kind : null;
}
function resolveSlackTurnSourceDefaultKind(params) {
	if (SLACK_DM_CHANNEL_ID_RE.test(params.turnSourceTo)) return "channel";
	return params.sessionKind === "direct" ? "user" : "channel";
}
function resolveTurnSourceSlackOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const turnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
	if (turnSourceChannel !== "slack" || !turnSourceTo) return null;
	const sessionKind = extractSlackSessionKind(request.request.sessionKey ?? void 0);
	const parsed = parseSlackTarget(turnSourceTo, { defaultKind: resolveSlackTurnSourceDefaultKind({
		turnSourceTo,
		sessionKind
	}) });
	if (!parsed) return null;
	return {
		to: formatSlackTarget({
			...parsed,
			explicitKind: true
		}),
		threadId: stringifyRouteThreadId(request.request.turnSourceThreadId)
	};
}
function resolveSessionSlackOriginTarget(sessionTarget) {
	return {
		to: sessionTarget.to,
		threadId: stringifyRouteThreadId(sessionTarget.threadId)
	};
}
function resolveSlackFallbackOriginTarget(request) {
	const sessionTarget = resolveApprovalRequestSessionConversation({
		request,
		channel: "slack",
		bundledFallback: false
	});
	if (!sessionTarget) return null;
	const parsed = parseSlackTarget(sessionTarget.id, { defaultKind: "channel" });
	if (!parsed) return null;
	return {
		to: formatSlackTarget({
			...parsed,
			id: canonicalizeSlackApiTargetId(parsed.kind, parsed.id),
			explicitKind: true
		}),
		threadId: sessionTarget.threadId
	};
}
function normalizeSlackOriginTarget(target) {
	return {
		...target,
		to: normalizeComparableTarget(target.to)
	};
}
function parseComparableSlackTarget(target) {
	return parseSlackTarget(target.to, { defaultKind: "channel" });
}
function isSlackDmChannelToUserRoutePair(a, b) {
	const left = parseComparableSlackTarget(a);
	const right = parseComparableSlackTarget(b);
	if (!left || !right) return false;
	if (left.teamId?.toLowerCase() !== right.teamId?.toLowerCase()) return false;
	return left.kind === "channel" && SLACK_DM_CHANNEL_ID_RE.test(left.id) && right.kind === "user" || right.kind === "channel" && SLACK_DM_CHANNEL_ID_RE.test(right.id) && left.kind === "user";
}
function slackTargetsMatch(a, b) {
	const threadKey = normalizeSlackThreadMatchKey(a.threadId);
	if (threadKey !== normalizeSlackThreadMatchKey(b.threadId)) return false;
	if (channelRouteTargetsMatchExact({
		left: {
			channel: "slack",
			to: a.to
		},
		right: {
			channel: "slack",
			to: b.to
		}
	})) return true;
	return Boolean(threadKey && isSlackDmChannelToUserRoutePair(a, b));
}
function normalizeSlackForwardTarget(target) {
	if ((normalizeMessageChannel(target.channel) ?? target.channel) !== "slack") return null;
	const to = normalizeOptionalString(target.to);
	if (!to) return null;
	const parsed = parseSlackTarget(to, { defaultKind: SLACK_USER_ID_RE.test(to) ? "user" : "channel" });
	if (!parsed) return null;
	return {
		to: formatSlackTarget({
			...parsed,
			explicitKind: true
		}),
		accountId: normalizeOptionalString(target.accountId),
		threadId: stringifyRouteThreadId(target.threadId)
	};
}
const { canApprovalPotentiallyRouteToChannel: canApprovalPotentiallyRouteToSlack, isSessionApprovalEligible: isForwardedSlackSessionApprovalEligible, isExplicitTargetEligible: isForwardedSlackExplicitTargetEligible } = createNativeApprovalChannelRouteGates({
	channel: "slack",
	defaultForwardingMode: DEFAULT_APPROVAL_FORWARDING_MODE,
	isTransportEnabled: isSlackApprovalTransportEnabled,
	listAccountIds: listSlackAccountIds,
	resolveDefaultAccountId: resolveDefaultSlackAccountId,
	normalizeForwardTarget: normalizeSlackForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
	targetsMatch: slackTargetsMatch
});
function hasSlackPluginApprovers(params) {
	return getSlackApprovalApproversForTeam(params).length > 0;
}
function isSlackPluginNativeApprovalClientConfigEnabled(params) {
	const slackNativeConfig = resolveSlackNativeApprovalConfig(params);
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: slackNativeConfig?.enabled,
		approverCount: getSlackApprovalApprovers(params).length
	});
}
function isSlackPluginForwardingRoutePotentiallyEnabled(params) {
	return canApprovalPotentiallyRouteToSlack({
		...params,
		approvalKind: "plugin"
	});
}
function isSlackPluginNativeApprovalClientEnabled(params) {
	return isSlackPluginNativeApprovalClientConfigEnabled(params) || isSlackPluginForwardingRoutePotentiallyEnabled(params);
}
function shouldHandleSlackPluginViaNativeClientConfig(params) {
	if (!doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "slack",
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg),
		eligibleAccountIds: listSlackNativeApprovalEligibleAccountIds({
			...params,
			approvalKind: "plugin"
		})
	})) return false;
	return isSlackNativeApprovalAccountEligible({
		...params,
		approvalKind: "plugin"
	});
}
function matchesSlackNativeApprovalFilters(params) {
	return matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: params.agentFilter,
		sessionFilter: params.sessionFilter
	});
}
function isSlackNativeApprovalAccountEligible(params) {
	const config = resolveSlackNativeApprovalConfig(params);
	const approverCount = params.approvalKind === "exec" ? getSlackExecApprovalApprovers(params).length : getSlackApprovalApproversForTeam({
		...params,
		teamId: resolveEnterpriseApprovalTeamId(params.request)
	}).length;
	return isSlackApprovalTransportEnabled(params) && isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount
	}) && matchesSlackNativeApprovalFilters({
		request: params.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function listSlackNativeApprovalEligibleAccountIds(params) {
	const accountId = params.accountId ?? resolveDefaultSlackAccountId(params.cfg);
	return isSlackNativeApprovalAccountEligible({
		...params,
		accountId
	}) ? [accountId] : [];
}
function isAnyForwardedSlackExplicitTargetEligible(params) {
	return (resolvePluginApprovalForwardingConfig(params.cfg)?.targets ?? []).some((target) => isForwardedSlackExplicitTargetEligible({
		...params,
		approvalKind: "plugin",
		target
	}));
}
function shouldHandleSlackPluginViaForwarding(params) {
	return isForwardedSlackSessionApprovalEligible({
		...params,
		approvalKind: "plugin"
	}) || isAnyForwardedSlackExplicitTargetEligible(params);
}
function shouldHandleSlackPluginViaForwardingSession(params) {
	return isForwardedSlackSessionApprovalEligible({
		...params,
		approvalKind: "plugin"
	});
}
function isSlackNativeApprovalClientEnabled(params) {
	if (params.approvalKind === "exec") return isSlackExecApprovalClientEnabled(params);
	return isSlackPluginNativeApprovalClientEnabled(params);
}
function isSlackAnyNativeApprovalClientEnabled(params) {
	return isSlackNativeApprovalClientEnabled({
		...params,
		approvalKind: "exec"
	}) || isSlackNativeApprovalClientEnabled({
		...params,
		approvalKind: "plugin"
	});
}
function shouldHandleSlackNativeApprovalRequest(params) {
	if (getSlackInstallationKind(resolveSlackAccount(params).accountId) === "enterprise" && !resolveEnterpriseApprovalTeamId(params.request)) return false;
	if (resolveApprovalKind(params.request, params.approvalKind) === "plugin") return shouldHandleSlackPluginViaNativeClientConfig(params) || shouldHandleSlackPluginViaForwarding(params);
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== "slack") return false;
	if (!doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "slack",
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg),
		eligibleAccountIds: listSlackNativeApprovalEligibleAccountIds({
			...params,
			approvalKind: "exec"
		})
	})) return false;
	return isSlackNativeApprovalAccountEligible({
		...params,
		approvalKind: "exec"
	});
}
function resolveEnterpriseApprovalTeamId(request) {
	try {
		const target = resolveTurnSourceSlackOriginTarget(request);
		return target ? parseSlackTarget(target.to)?.teamId : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/slack/src/blocks-input.ts
const SLACK_MAX_BLOCKS = 50;
function parseBlocksJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("blocks must be valid JSON");
	}
}
function assertBlocksArray(raw) {
	if (!Array.isArray(raw)) throw new Error("blocks must be an array");
	if (raw.length === 0) throw new Error("blocks must contain at least one block");
	if (raw.length > 50) throw new Error(`blocks cannot exceed 50 items`);
	for (const block of raw) {
		if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("each block must be an object");
		const type = block.type;
		if (typeof type !== "string" || type.trim().length === 0) throw new Error("each block must include a non-empty string type");
	}
}
function validateSlackBlocksArray(raw) {
	assertBlocksArray(raw);
	return raw;
}
function parseSlackBlocksInput(raw) {
	if (raw == null) return;
	return validateSlackBlocksArray(typeof raw === "string" ? parseBlocksJson(raw) : raw);
}
//#endregion
//#region extensions/slack/src/monitor/mrkdwn.ts
function escapeSlackMrkdwn(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
//#endregion
//#region extensions/slack/src/presentation-fallback.ts
const SLACK_UNCOPYABLE_COMMAND_WARNING = "not copyable: contains backtick";
function resolveSlackCommandFallback(command) {
	if (!command.includes("`")) return { command };
	return {
		command: command.replaceAll("`", "[backtick]"),
		warning: SLACK_UNCOPYABLE_COMMAND_WARNING
	};
}
function escapeSlackPresentationChartBlock(block) {
	if (block.chartType === "pie") return {
		...block,
		title: escapeSlackMrkdwn(block.title),
		segments: block.segments.map((segment) => ({
			...segment,
			label: escapeSlackMrkdwn(segment.label)
		}))
	};
	return {
		...block,
		title: escapeSlackMrkdwn(block.title),
		categories: block.categories.map(escapeSlackMrkdwn),
		series: block.series.map((series) => ({
			...series,
			name: escapeSlackMrkdwn(series.name)
		})),
		...block.xLabel ? { xLabel: escapeSlackMrkdwn(block.xLabel) } : {},
		...block.yLabel ? { yLabel: escapeSlackMrkdwn(block.yLabel) } : {}
	};
}
function escapeSlackPresentationTableBlock(block) {
	return {
		...block,
		caption: escapeSlackMrkdwn(block.caption),
		headers: block.headers.map(escapeSlackMrkdwn),
		rows: block.rows.map((row) => row.map((cell) => typeof cell === "string" ? escapeSlackMrkdwn(cell) : cell))
	};
}
function escapeSlackPresentationFallbackBlock(block) {
	if (block.type === "chart") return escapeSlackPresentationChartBlock(block);
	if (block.type === "table") return escapeSlackPresentationTableBlock(block);
	if (block.type === "buttons") return {
		...block,
		buttons: block.buttons.map((button) => {
			const commandFallback = button.action?.type === "command" ? resolveSlackCommandFallback(button.action.command) : void 0;
			const label = commandFallback?.warning ? `${button.label} [${commandFallback.warning}]` : button.label;
			return {
				...button,
				label: escapeSlackMrkdwn(label),
				...button.value ? { value: escapeSlackMrkdwn(button.value) } : {},
				...button.url ? { url: escapeSlackMrkdwn(button.url) } : {},
				...button.webApp ? { webApp: { url: escapeSlackMrkdwn(button.webApp.url) } } : {},
				...button.web_app ? { web_app: { url: escapeSlackMrkdwn(button.web_app.url) } } : {},
				...button.action?.type === "command" && commandFallback ? { action: {
					...button.action,
					command: commandFallback.command
				} } : {}
			};
		})
	};
	if (block.type === "select") return {
		...block,
		...block.placeholder ? { placeholder: escapeSlackMrkdwn(block.placeholder) } : {},
		options: block.options.map((option) => ({
			...option,
			label: escapeSlackMrkdwn(option.label)
		}))
	};
	return block;
}
function renderSlackMessagePresentationChartFallbackText(block) {
	return renderMessagePresentationChartFallbackText(escapeSlackPresentationChartBlock(block));
}
function renderSlackMessagePresentationTableFallbackText(block) {
	return renderMessagePresentationTableFallbackText(escapeSlackPresentationTableBlock(block));
}
function renderSlackMessagePresentationFallbackText(params) {
	if (!params.presentation) return renderMessagePresentationFallbackText(params);
	const presentation = {
		...params.presentation,
		...params.presentation.title ? { title: escapeSlackMrkdwn(params.presentation.title) } : {},
		blocks: params.presentation.blocks.map(escapeSlackPresentationFallbackBlock)
	};
	return renderMessagePresentationFallbackText({
		...params,
		presentation
	});
}
//#endregion
//#region extensions/slack/src/rich-text.ts
const RICH_TEXT_CONTAINER_TYPES = /* @__PURE__ */ new Set([
	"rich_text_section",
	"rich_text_preformatted",
	"rich_text_quote",
	"rich_text_list"
]);
function renderSlackRichText(value, mode, separator = "") {
	if (!Array.isArray(value)) return "";
	const table = mode === "table";
	const read = table ? readNonBlankString : normalizeOptionalString;
	const literal = table ? (text) => text : escapeSlackMrkdwn;
	const reference = mode === "escaped" ? escapeSlackMrkdwn : (text) => text;
	const formatReference = (raw, prefix, suffix) => {
		const text = read(raw);
		return text ? reference(`${prefix}${text}${suffix}`) : "";
	};
	return value.map((rawElement) => {
		const element = asOptionalRecord(rawElement);
		if (!element) return "";
		if (Array.isArray(element.elements) && (table || RICH_TEXT_CONTAINER_TYPES.has(element.type))) return renderSlackRichText(element.elements, mode, element.type === "rich_text_list" ? "\n" : "");
		if (table) {
			if (element.type === "text" && typeof element.text === "string") return element.text;
			const text = readNonBlankString(element.text);
			if (text) return text;
		}
		switch (element.type) {
			case "text": return typeof element.text === "string" ? literal(element.text) : "";
			case "link": return literal(read(element.text) ?? read(element.url) ?? "");
			case "user": return formatReference(element.user_id, "<@", ">");
			case "channel": return formatReference(element.channel_id, "<#", ">");
			case "usergroup": return formatReference(element.usergroup_id, "<!subteam^", ">");
			case "broadcast": return formatReference(element.range, "<!", ">");
			case "emoji": {
				const name = read(element.name);
				return name ? `:${name}:` : "";
			}
			case "date": return literal(read(element.fallback) ?? "");
			default: return "";
		}
	}).filter(Boolean).join(separator);
}
//#endregion
//#region extensions/slack/src/data-table.ts
const SLACK_DATA_TABLE_COLUMNS_MAX = 20;
const SLACK_DATA_TABLE_ROWS_MAX = 100;
const SLACK_DATA_TABLE_AGGREGATE_CELL_CHARACTERS_MAX = 1e4;
function countCharacters(value) {
	return Array.from(value).length;
}
function readSlackBasicTableCell(value) {
	const cell = asOptionalRecord(value);
	if (!cell) return "";
	if (cell.type === "raw_text") return typeof cell.text === "string" ? cell.text : "";
	if (cell.type === "raw_number") {
		if (typeof cell.text === "string" && cell.text.length > 0) return cell.text;
		if (typeof cell.value === "number" && Number.isFinite(cell.value)) return String(cell.value);
		return typeof cell.value === "string" ? cell.value : "";
	}
	return cell.type === "rich_text" ? renderSlackRichText(cell.elements, "table", "\n") : "";
}
function parseSlackBasicTableRows(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "table" || !Array.isArray(block.rows)) return;
	if (block.rows.length < 1 || block.rows.length > SLACK_DATA_TABLE_ROWS_MAX) return;
	let characterCount = 0;
	const rows = [];
	for (const rawRow of block.rows) {
		if (!Array.isArray(rawRow) || rawRow.length < 1 || rawRow.length > SLACK_DATA_TABLE_COLUMNS_MAX) return;
		const row = rawRow.map(readSlackBasicTableCell);
		characterCount += row.reduce((total, cell) => total + countCharacters(cell), 0);
		if (characterCount > 1e4) return;
		rows.push(row);
	}
	return rows.some((row) => row.some((cell) => cell.length > 0)) ? rows : void 0;
}
function readSlackDataTableCell(value, allowRichText) {
	const cell = asOptionalRecord(value);
	if (!cell) return;
	if (cell.type === "raw_text") return readNonBlankString(cell.text);
	if (cell.type === "raw_number") return typeof cell.value === "number" && Number.isFinite(cell.value) ? readNonBlankString(cell.text) : void 0;
	if (allowRichText && cell.type === "rich_text") return readNonBlankString(renderSlackRichText(cell.elements, "table"));
}
function parseSlackDataTable(value) {
	const block = asOptionalRecord(value);
	const caption = readNonBlankString(block?.caption);
	if (block?.type !== "data_table" || !caption || !Array.isArray(block.rows)) return;
	if (block.rows.length < 2) return;
	const rawHeader = block.rows[0];
	if (!Array.isArray(rawHeader) || rawHeader.length < 1) return;
	const headers = Array.from(rawHeader, (cell) => readSlackDataTableCell(cell, false));
	if (!headers.every((header) => Boolean(header))) return;
	const rows = block.rows.slice(1).map((rawRow) => {
		if (!Array.isArray(rawRow) || rawRow.length !== headers.length) return;
		const cells = rawRow.map((cell) => readSlackDataTableCell(cell, true));
		return cells.every((cell) => Boolean(cell)) ? cells : void 0;
	});
	if (!rows.every((row) => Boolean(row))) return;
	return {
		caption,
		headers,
		rows
	};
}
/** Detect current native table blocks without depending on unreleased Slack SDK types. */
function hasSlackDataTableBlock(blocks) {
	return blocks?.some((block) => asOptionalRecord(block)?.type === "data_table") ?? false;
}
function countSlackDataTableCellCharacters(value) {
	const parsed = parseSlackDataTable(value);
	if (!parsed || parsed.rows.length > SLACK_DATA_TABLE_ROWS_MAX || parsed.headers.length > SLACK_DATA_TABLE_COLUMNS_MAX) return;
	const cellCharacterCount = [...parsed.headers, ...parsed.rows.flat()].reduce((total, cell) => total + countCharacters(cell), 0);
	return cellCharacterCount > 1e4 ? void 0 : cellCharacterCount;
}
/** Count the aggregate native-table cell characters already present in a message. */
function countSlackDataTableBlocksCellCharacters(blocks) {
	let total = 0;
	for (const block of blocks ?? []) {
		if (!hasSlackDataTableBlock([block])) continue;
		const cellCharacterCount = countSlackDataTableCellCharacters(block);
		if (cellCharacterCount === void 0) return;
		total += cellCharacterCount;
	}
	return total;
}
function resolvePortableTableCellCharacterCount(block) {
	if (typeof block.caption !== "string" || block.caption.trim().length === 0 || !Array.isArray(block.headers) || block.headers.length < 1 || block.headers.length > SLACK_DATA_TABLE_COLUMNS_MAX || !Array.isArray(block.rows) || block.rows.length < 1 || block.rows.length > SLACK_DATA_TABLE_ROWS_MAX || new Set(block.headers).size !== block.headers.length || !block.headers.every((header) => typeof header === "string" && header.trim().length > 0) || block.rowHeaderColumnIndex !== void 0 && (!Number.isInteger(block.rowHeaderColumnIndex) || block.rowHeaderColumnIndex < 0 || block.rowHeaderColumnIndex >= block.headers.length)) return;
	const values = [...block.headers];
	for (const row of block.rows) {
		if (!Array.isArray(row) || row.length !== block.headers.length) return;
		for (const cell of row) {
			if (typeof cell === "number") {
				if (!Number.isFinite(cell)) return;
				values.push(String(cell));
				continue;
			}
			if (typeof cell !== "string" || cell.trim().length === 0) return;
			values.push(cell);
		}
	}
	return values.reduce((total, value) => total + countCharacters(value), 0);
}
/** Count portable table cells when the table fits Slack's native message budget. */
function resolveSlackDataTableCellCharacterCount(block, options = {}) {
	const cellCharacterCountOffset = options.cellCharacterCountOffset ?? 0;
	if (!Number.isSafeInteger(cellCharacterCountOffset) || cellCharacterCountOffset < 0) return;
	const cellCharacterCount = resolvePortableTableCellCharacterCount(block);
	return cellCharacterCount !== void 0 && cellCharacterCountOffset + cellCharacterCount <= 1e4 ? cellCharacterCount : void 0;
}
/** Map a validated portable table to Slack's current app-facing Block Kit shape. */
function buildSlackDataTableBlock(block, options = {}) {
	if (resolveSlackDataTableCellCharacterCount(block, options) === void 0) return;
	const header = block.headers.map((text) => ({
		type: "raw_text",
		text
	}));
	const rows = block.rows.map((row) => row.map((cell) => typeof cell === "number" ? {
		type: "raw_number",
		value: cell,
		text: String(cell)
	} : {
		type: "raw_text",
		text: cell
	}));
	return {
		type: "data_table",
		caption: block.caption,
		rows: [header, ...rows],
		...block.rowHeaderColumnIndex !== void 0 ? { row_header_column_index: block.rowHeaderColumnIndex } : {}
	};
}
/** Extract a deterministic accessible summary from a native Slack table block. */
function renderSlackDataTableFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (parsed) return renderMessagePresentationTableFallbackText({
		type: "table",
		caption: parsed.caption,
		headers: parsed.headers,
		rows: parsed.rows
	});
	return readNonBlankString(block.caption)?.trim();
}
function escapeCompactFallbackCell(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("	", "\\t").replaceAll("\r", "\\r").replaceAll("\n", "\\n");
}
function escapeSlackBasicTableCell(value, mrkdwnSafe) {
	return escapeCompactFallbackCell(mrkdwnSafe ? escapeSlackMrkdwn(value) : value);
}
function renderSlackBasicTableRows(value, mrkdwnSafe) {
	return parseSlackBasicTableRows(value)?.map((row) => row.map((cell) => escapeSlackBasicTableCell(cell, mrkdwnSafe)).join("	")).join("\n");
}
/** Render Slack's inbound `table` block as ordered, delimiter-safe TSV. */
function renderSlackTableFallbackText(value) {
	return renderSlackBasicTableRows(value, false);
}
/** Render Slack's inbound `table` block without activating mrkdwn control tokens. */
function renderSlackTableMrkdwnFallbackText(value) {
	return renderSlackBasicTableRows(value, true);
}
/** Render each native table cell once for bounded, formatting-disabled delivery. */
function renderSlackDataTableCompactPlainTextFallback(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (!parsed) return readNonBlankString(block.caption)?.trim();
	return [
		`${escapeCompactFallbackCell(parsed.caption)} (table)`,
		parsed.headers.map(escapeCompactFallbackCell).join("	"),
		...parsed.rows.map((row) => row.map(escapeCompactFallbackCell).join("	"))
	].join("\n");
}
/** Render a native table as mrkdwn without activating raw cell control tokens. */
function renderSlackDataTableMrkdwnFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (parsed) return renderSlackMessagePresentationTableFallbackText({
		type: "table",
		caption: parsed.caption,
		headers: parsed.headers,
		rows: parsed.rows
	});
	const caption = readNonBlankString(block.caption)?.trim();
	return caption ? escapeSlackMrkdwn(caption) : void 0;
}
//#endregion
//#region extensions/slack/src/data-visualization.ts
const SLACK_CHART_TITLE_MAX = 50;
const SLACK_CHART_LABEL_MAX = 20;
const SLACK_CHART_AXIS_LABEL_MAX = 50;
const SLACK_CHART_SERIES_MAX = 12;
const SLACK_CHART_DATA_POINTS_MAX = 20;
/** Detect native chart blocks without depending on unreleased Slack SDK types. */
function hasSlackDataVisualizationBlock(blocks) {
	return blocks?.some((block) => asOptionalRecord(block)?.type === "data_visualization") ?? false;
}
function isStringWithin(value, maxLength) {
	return typeof value === "string" && value.trim().length > 0 && Array.from(value).length <= maxLength;
}
function hasUniqueStrings(values) {
	return new Set(values).size === values.length;
}
/** True when a portable chart satisfies Slack's complete native-block contract. */
function canRenderSlackDataVisualization(block) {
	if (!isStringWithin(block.title, SLACK_CHART_TITLE_MAX)) return false;
	if (block.chartType === "pie") return block.segments.length >= 1 && block.segments.length <= SLACK_CHART_SERIES_MAX && block.segments.every((segment) => isStringWithin(segment.label, SLACK_CHART_LABEL_MAX) && Number.isFinite(segment.value) && segment.value > 0);
	if (block.categories.length < 1 || block.categories.length > SLACK_CHART_DATA_POINTS_MAX || !block.categories.every((category) => isStringWithin(category, SLACK_CHART_LABEL_MAX)) || !hasUniqueStrings(block.categories) || block.series.length < 1 || block.series.length > SLACK_CHART_SERIES_MAX || !hasUniqueStrings(block.series.map((series) => series.name)) || block.xLabel !== void 0 && !isStringWithin(block.xLabel, SLACK_CHART_AXIS_LABEL_MAX) || block.yLabel !== void 0 && !isStringWithin(block.yLabel, SLACK_CHART_AXIS_LABEL_MAX)) return false;
	return block.series.every((series) => isStringWithin(series.name, SLACK_CHART_LABEL_MAX) && series.values.length === block.categories.length && series.values.every((value) => Number.isFinite(value)));
}
/** Map a validated portable chart to Slack's app-facing Block Kit shape. */
function buildSlackDataVisualizationBlock(block) {
	if (!canRenderSlackDataVisualization(block)) return;
	if (block.chartType === "pie") return {
		type: "data_visualization",
		title: block.title,
		chart: {
			type: "pie",
			segments: block.segments.map((segment) => ({ ...segment }))
		}
	};
	return {
		type: "data_visualization",
		title: block.title,
		chart: {
			type: block.chartType,
			series: block.series.map((series) => ({
				name: series.name,
				data: block.categories.map((label, index) => ({
					label,
					value: series.values[index]
				}))
			})),
			axis_config: {
				categories: [...block.categories],
				...block.xLabel ? { x_label: block.xLabel } : {},
				...block.yLabel ? { y_label: block.yLabel } : {}
			}
		}
	};
}
function readSlackChartDatum(value) {
	const record = asOptionalRecord(value);
	const label = record?.label;
	const datumValue = record?.value;
	return typeof label === "string" && typeof datumValue === "number" ? {
		label,
		value: datumValue
	} : void 0;
}
function parseSlackDataVisualizationBlock(value) {
	const block = asOptionalRecord(value);
	const title = block?.title;
	const chart = asOptionalRecord(block?.chart);
	if (block?.type !== "data_visualization" || typeof title !== "string" || !chart) return;
	if (chart.type === "pie") {
		if (!Array.isArray(chart.segments)) return;
		const segments = chart.segments.map(readSlackChartDatum);
		if (segments.some((segment) => !segment)) return;
		const normalizedBlock = normalizeMessagePresentation({ blocks: [{
			type: "chart",
			chartType: "pie",
			title,
			segments
		}] })?.blocks[0];
		return normalizedBlock?.type === "chart" ? normalizedBlock : void 0;
	}
	if (chart.type !== "bar" && chart.type !== "area" && chart.type !== "line") return;
	const axisConfig = asOptionalRecord(chart.axis_config);
	const categories = axisConfig?.categories;
	if (!Array.isArray(categories) || !categories.every((category) => typeof category === "string")) return;
	if (!Array.isArray(chart.series)) return;
	const series = chart.series.map((rawSeries) => {
		const seriesRecord = asOptionalRecord(rawSeries);
		if (typeof seriesRecord?.name !== "string" || !Array.isArray(seriesRecord.data)) return;
		const data = seriesRecord.data.map(readSlackChartDatum);
		if (data.some((datum) => !datum) || data.length !== categories.length) return;
		const dataByLabel = new Map(data.map((datum) => [datum.label, datum.value]));
		if (dataByLabel.size !== data.length || categories.some((category) => !dataByLabel.has(category))) return;
		return {
			name: seriesRecord.name,
			values: categories.map((category) => dataByLabel.get(category))
		};
	});
	if (series.some((entry) => !entry)) return;
	const normalizedBlock = normalizeMessagePresentation({ blocks: [{
		type: "chart",
		chartType: chart.type,
		title,
		categories,
		series,
		xLabel: axisConfig?.x_label,
		yLabel: axisConfig?.y_label
	}] })?.blocks[0];
	return normalizedBlock?.type === "chart" ? normalizedBlock : void 0;
}
/** Extract a deterministic accessible summary from a native Slack chart block. */
function renderSlackDataVisualizationFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_visualization") return;
	const parsed = parseSlackDataVisualizationBlock(block);
	if (parsed) return renderMessagePresentationChartFallbackText(parsed);
	return typeof block.title === "string" && block.title.trim() ? block.title.trim() : void 0;
}
/** Render a native chart as mrkdwn without activating raw data control tokens. */
function renderSlackDataVisualizationMrkdwnFallbackText(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_visualization") return;
	const parsed = parseSlackDataVisualizationBlock(block);
	if (parsed) return renderSlackMessagePresentationChartFallbackText(parsed);
	return typeof block.title === "string" && block.title.trim() ? escapeSlackMrkdwn(block.title.trim()) : void 0;
}
//#endregion
//#region extensions/slack/src/format.ts
const SLACK_ANGLE_TOKEN_RE = /<[^>\n]+>/g;
function isAllowedSlackAngleToken(token) {
	if (!token.startsWith("<") || !token.endsWith(">")) return false;
	const inner = token.slice(1, -1);
	return inner.startsWith("@") || inner.startsWith("#") || inner.startsWith("!") || inner.startsWith("mailto:") || inner.startsWith("tel:") || inner.startsWith("http://") || inner.startsWith("https://") || inner.startsWith("slack://");
}
function escapeSlackMrkdwnContent(text, mentions) {
	if (mentions === "escape") return escapeSlackMrkdwn(text);
	if (!text) return "";
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	SLACK_ANGLE_TOKEN_RE.lastIndex = 0;
	const out = [];
	let lastIndex = 0;
	for (let match = SLACK_ANGLE_TOKEN_RE.exec(text); match; match = SLACK_ANGLE_TOKEN_RE.exec(text)) {
		const matchIndex = match.index ?? 0;
		out.push(escapeSlackMrkdwn(text.slice(lastIndex, matchIndex)));
		const token = match[0] ?? "";
		out.push(isAllowedSlackAngleToken(token) ? token : escapeSlackMrkdwn(token));
		lastIndex = matchIndex + token.length;
	}
	out.push(escapeSlackMrkdwn(text.slice(lastIndex)));
	return out.join("");
}
function escapeSlackMrkdwnText(text, mentions) {
	if (!text) return "";
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	return text.split("\n").map((line) => {
		if (line.startsWith("> ")) return `> ${escapeSlackMrkdwnContent(line.slice(2), mentions)}`;
		return escapeSlackMrkdwnContent(line, mentions);
	}).join("\n");
}
function buildSlackLink(link, text) {
	const href = link.href.trim();
	if (!href) return null;
	const trimmedLabel = text.slice(link.start, link.end).trim();
	const comparableHref = href.startsWith("mailto:") ? href.slice(7) : href;
	if (!(trimmedLabel.length > 0 && trimmedLabel !== href && trimmedLabel !== comparableHref)) return null;
	const safeHref = escapeSlackMrkdwn(href);
	return {
		start: link.start,
		end: link.end,
		open: `<${safeHref}|`,
		close: ">"
	};
}
const SLACK_MRKDWN_WORD_CHARACTER_RE = /[\p{L}\p{M}\p{N}_]/u;
const SLACK_MRKDWN_PUNCTUATION_RE = /\p{P}/u;
const SLACK_MRKDWN_SYMBOL_RE = /\p{S}/u;
const SLACK_MRKDWN_CJK_SCRIPT_RE = /[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}\p{Script_Extensions=Hangul}]/u;
const SLACK_MRKDWN_EMOJI_PRESENTATION_RE = /\p{Emoji_Presentation}/u;
function getCodePointBefore(text, index) {
	if (index <= 0) return "";
	const lastCodeUnit = text.charCodeAt(index - 1);
	if (lastCodeUnit >= 56320 && lastCodeUnit <= 57343 && index > 1) {
		const previousCodeUnit = text.charCodeAt(index - 2);
		if (previousCodeUnit >= 55296 && previousCodeUnit <= 56319) return text.slice(index - 2, index);
	}
	return text[index - 1] ?? "";
}
function getCodePointAt(text, index) {
	const codePoint = text.codePointAt(index);
	return codePoint === void 0 ? "" : String.fromCodePoint(codePoint);
}
function isSlackCjkPunctuation(character) {
	if (!SLACK_MRKDWN_PUNCTUATION_RE.test(character)) return false;
	if (SLACK_MRKDWN_CJK_SCRIPT_RE.test(character)) return true;
	const codePoint = character.codePointAt(0);
	if (codePoint === void 0) return false;
	const width = eastAsianWidthType(codePoint);
	return width === "fullwidth" || width === "halfwidth" || width === "wide" && !SLACK_MRKDWN_EMOJI_PRESENTATION_RE.test(character);
}
function isUnsafeSlackEmphasisBoundary(character) {
	if (SLACK_MRKDWN_WORD_CHARACTER_RE.test(character)) return true;
	const codePoint = character.codePointAt(0);
	if (codePoint === void 0 || codePoint <= 127) return false;
	return SLACK_MRKDWN_SYMBOL_RE.test(character) || isSlackCjkPunctuation(character);
}
function makeSlackEmphasisStylesSafe(ir) {
	const styles = ir.styles.filter((span) => {
		if (span.style !== "italic" && span.style !== "bold") return true;
		return !isUnsafeSlackEmphasisBoundary(getCodePointBefore(ir.text, span.start)) && !isUnsafeSlackEmphasisBoundary(getCodePointAt(ir.text, span.end));
	});
	return styles.length === ir.styles.length ? ir : {
		...ir,
		styles
	};
}
const SLACK_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "markdown",
	constructs: {
		underline: "strip",
		spoiler: "fallback",
		codeLanguage: "fallback",
		heading: "fallback",
		bulletList: "fallback",
		orderedList: "fallback",
		taskList: "fallback",
		table: "fallback",
		image: "fallback"
	},
	chunk: {
		limit: 4e3,
		unit: "chars",
		hardCap: 4e4
	}
});
const SLACK_ASSISTANT_TRANSCRIPT_PREFIX = "`Assistant:` ";
function tokenizeSlackMrkdwn(text) {
	const tokens = [];
	for (let index = 0; index < text.length;) {
		if (text.startsWith("```", index)) {
			tokens.push("```");
			index += 3;
			continue;
		}
		const entity = text[index] === "&" ? [
			"&amp;",
			"&lt;",
			"&gt;"
		].find((candidate) => text.startsWith(candidate, index)) : void 0;
		if (entity) {
			tokens.push(entity);
			index += entity.length;
			continue;
		}
		if (text[index] === "<") {
			const end = text.indexOf(">", index + 1);
			const angleToken = end >= 0 ? text.slice(index, end + 1) : void 0;
			if (angleToken && !angleToken.includes("\n") && isAllowedSlackAngleToken(angleToken)) {
				tokens.push(angleToken);
				index += angleToken.length;
				continue;
			}
		}
		const codePoint = text.codePointAt(index);
		if (codePoint === void 0) break;
		const character = String.fromCodePoint(codePoint);
		index += character.length;
		tokens.push(character);
	}
	return tokens;
}
function resolveSlackCodeMarkerTransition(active, token) {
	if (token === "```" && active !== "`") return active === "```" ? void 0 : "```";
	if (token === "`" && active !== "```") return active === "`" ? void 0 : "`";
	return null;
}
function maskSlackExcludedText(text) {
	return text.split("\n").map((line) => line.trim() ? `x${" ".repeat(Math.max(0, line.length - 1))}` : " ".repeat(line.length)).join("\n");
}
function maskSlackExcludedRanges(projection) {
	let masked = "";
	let cursor = 0;
	for (const range of projection.excludedRanges) {
		masked += projection.text.slice(cursor, range.start);
		masked += maskSlackExcludedText(projection.text.slice(range.start, range.end));
		cursor = range.end;
	}
	return masked + projection.text.slice(cursor);
}
function slackProjectionHasRoleHeader(projection) {
	return Boolean(markdownToIR(maskSlackExcludedRanges(projection), {
		assistantTranscriptRoleHeaders: true,
		autolink: false,
		blockquotePrefix: "",
		headingStyle: "none",
		linkify: false,
		tableMode: "off"
	}).annotations?.some((annotation) => annotation.type === "assistant_transcript_role"));
}
function decodeSlackMrkdwnEntities(text) {
	return text.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}
function projectSlackAngleToken(token, dateDisplay) {
	const inner = token.slice(1, -1);
	if (inner.startsWith("!date^")) {
		const fallbackSeparator = inner.indexOf("|");
		const tokenString = (fallbackSeparator === -1 ? inner : inner.slice(0, fallbackSeparator)).split("^")[2] ?? "";
		const fallback = fallbackSeparator === -1 ? "" : inner.slice(fallbackSeparator + 1);
		return decodeSlackMrkdwnEntities(dateDisplay === "fallback" ? fallback || tokenString : tokenString || fallback);
	}
	const labelSeparator = inner.indexOf("|");
	if (labelSeparator >= 0) return decodeSlackMrkdwnEntities(inner.slice(labelSeparator + 1));
	if (inner.startsWith("@")) return "@";
	if (inner.startsWith("#")) return "#";
	if (inner.startsWith("!")) return "!";
	return decodeSlackMrkdwnEntities(inner);
}
function appendSlackVisibleProjection(projection, visible, excluded) {
	if (!visible) return;
	const start = projection.text.length;
	projection.text += visible;
	if (!excluded) return;
	const previous = projection.excludedRanges.at(-1);
	if (previous?.end === start) previous.end = projection.text.length;
	else projection.excludedRanges.push({
		start,
		end: projection.text.length
	});
}
function projectSlackMrkdwnVisibleText(text, dateDisplay) {
	const projection = {
		text: "",
		excludedRanges: []
	};
	let activeMarker;
	let lineHasVisibleContent = false;
	for (const token of tokenizeSlackMrkdwn(text)) {
		const transition = resolveSlackCodeMarkerTransition(activeMarker, token);
		if (transition !== null) {
			activeMarker = transition;
			continue;
		}
		let visible = token;
		if (isAllowedSlackAngleToken(token)) visible = activeMarker ? token : projectSlackAngleToken(token, dateDisplay);
		else if (token === "&amp;" || token === "&lt;" || token === "&gt;") visible = decodeSlackMrkdwnEntities(token);
		else if (!activeMarker && (token === "*" || token === "_" || token === "~")) visible = "";
		else if (!activeMarker && token === ">" && !lineHasVisibleContent) visible = "";
		appendSlackVisibleProjection(projection, visible, activeMarker !== void 0);
		for (const character of visible) if (character === "\n") lineHasVisibleContent = false;
		else if (character !== " " && character !== "	" && character !== "\r") lineHasVisibleContent = true;
	}
	return projection;
}
function protectSlackAssistantTranscriptRoleHeaders(text) {
	if (text.startsWith(SLACK_ASSISTANT_TRANSCRIPT_PREFIX)) return text;
	if (!slackProjectionHasRoleHeader(projectSlackMrkdwnVisibleText(text, "token")) && (!text.includes("<!date^") || !slackProjectionHasRoleHeader(projectSlackMrkdwnVisibleText(text, "fallback")))) return text;
	return `${SLACK_ASSISTANT_TRANSCRIPT_PREFIX}${text}`;
}
function buildSlackRenderOptions({ enclosingStyle, mentions } = {}) {
	return {
		annotationMarkers: { assistant_transcript_role: {
			open: "`",
			close: "`",
			suppressNestedFormatting: true
		} },
		styleMarkers: {
			...enclosingStyle !== "bold" ? { bold: {
				open: "*",
				close: "*"
			} } : {},
			...enclosingStyle !== "italic" ? { italic: {
				open: "_",
				close: "_"
			} } : {},
			strikethrough: {
				open: "~",
				close: "~"
			},
			code: {
				open: "`",
				close: "`"
			},
			code_block: {
				open: "```\n",
				close: "```"
			}
		},
		escapeText: (text) => escapeSlackMrkdwnText(text, mentions),
		buildLink: buildSlackLink
	};
}
function prepareSlackMarkdownIR(markdown, options) {
	return makeSlackEmphasisStylesSafe(markdownToIR(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: false,
		autolink: false,
		headingStyle: "rich",
		blockquotePrefix: "> ",
		tableMode: options.tableMode
	}));
}
function normalizeSlackOutboundText(markdown, options = {}) {
	const ir = prepareSlackMarkdownIR(markdown, options);
	return protectSlackAssistantTranscriptRoleHeaders(renderMarkdownWithMarkers(ir, buildSlackRenderOptions(options), SLACK_FORMAT_PROFILE));
}
/** Chunk already-rendered Slack mrkdwn without splitting entities or code markers. */
function chunkSlackMrkdwnText(text, limit) {
	if (text.length <= limit) return [text];
	if (!(text.includes("`") || text.includes("&amp;") || text.includes("&lt;") || text.includes("&gt;") || (text.match(/<[^>\n]+>/gu)?.some(isAllowedSlackAngleToken) ?? false))) return chunkTextForOutbound(text, limit, { preserveWhitespace: true });
	const chunks = [];
	let activeMarker;
	let content = "";
	const wrapper = (marker) => marker && limit > marker.length * 2 ? marker : void 0;
	const capacity = (marker) => limit - (wrapper(marker)?.length ?? 0);
	const flush = () => {
		const marker = wrapper(activeMarker);
		if (content && content !== marker) chunks.push(marker ? `${content}${marker}` : content);
		content = "";
	};
	for (const token of tokenizeSlackMrkdwn(text)) {
		const transition = resolveSlackCodeMarkerTransition(activeMarker, token);
		const nextMarker = transition === null ? activeMarker : transition;
		const sourceMarker = token === "`" || token === "```" ? token : void 0;
		if (transition !== null && sourceMarker && !wrapper(sourceMarker)) {
			activeMarker = nextMarker;
			continue;
		}
		if (content && content.length + token.length > capacity(nextMarker)) flush();
		activeMarker = nextMarker;
		if (!content && transition === void 0) continue;
		content ||= transition === null ? wrapper(activeMarker) ?? "" : "";
		const contentLimit = capacity(activeMarker) - (wrapper(activeMarker)?.length ?? 0);
		if (token.length > contentLimit) {
			flush();
			const marker = wrapper(activeMarker);
			if (activeMarker && isAllowedSlackAngleToken(token)) {
				if (marker) chunks.push(...chunkTextForOutbound(token, Math.max(1, Math.floor(contentLimit)), { preserveWhitespace: true }).map((fragment) => `${marker}${fragment}${marker}`));
				else chunks.push(...chunkTextForOutbound(escapeSlackMrkdwn(token), Math.max(1, Math.floor(limit)), { preserveWhitespace: true }));
				continue;
			}
			chunks.push(...token.length <= limit ? [token] : chunkTextForOutbound(token, limit));
			continue;
		}
		content += token;
	}
	flush();
	return chunks;
}
function markdownToSlackMrkdwnChunks(markdown, limit, options = {}) {
	const ir = prepareSlackMarkdownIR(markdown, options);
	const renderOptions = buildSlackRenderOptions();
	const normalizedLimit = limit === Number.POSITIVE_INFINITY ? limit : resolveIntegerOption(limit, 1, { min: 1 });
	return renderMarkdownIRChunksWithinLimit({
		ir,
		limit: normalizedLimit,
		renderChunk: (chunk) => {
			const rendered = renderMarkdownWithMarkers(chunk, renderOptions, SLACK_FORMAT_PROFILE);
			return rendered.length > normalizedLimit ? rendered : protectSlackAssistantTranscriptRoleHeaders(rendered);
		},
		measureRendered: (rendered) => rendered.length
	}).map(({ rendered }) => rendered.length > normalizedLimit ? protectSlackAssistantTranscriptRoleHeaders(rendered) : rendered);
}
//#endregion
//#region extensions/slack/src/reply-action-ids.ts
const SLACK_REPLY_BUTTON_ACTION_ID = "openclaw:reply_button";
const SLACK_REPLY_LINK_ACTION_ID = "openclaw:reply_link";
const SLACK_SESSION_LINK_ACTION_ID = "openclaw:session_link";
const SLACK_REPLY_SELECT_ACTION_ID = "openclaw:reply_select";
const SLACK_CALLBACK_BUTTON_ACTION_ID = "openclaw:callback_button";
const SLACK_CALLBACK_SELECT_ACTION_ID = "openclaw:callback_select";
const SLACK_APPROVAL_BUTTON_ACTION_ID = "openclaw:approval_button";
const SLACK_APPROVAL_SELECT_ACTION_ID = "openclaw:approval_select";
const SLACK_QUESTION_BUTTON_ACTION_ID = "openclaw:question_button";
const SLACK_QUESTION_FINALIZATION_BLOCKS = Symbol("slackQuestionFinalizationBlocks");
function isSlackQuestionActionId(actionId) {
	return actionId === "openclaw:question_button" || actionId.startsWith(`openclaw:question_button:`);
}
/** Read only question control identities from the blocks actually sent to Slack. */
function resolveSlackQuestionActionIds(blocks) {
	return (blocks ?? []).flatMap((block) => {
		if (block.type !== "actions") return [];
		return (block.elements ?? []).flatMap(({ action_id }) => action_id && isSlackQuestionActionId(action_id) ? [action_id] : []);
	});
}
function isSlackApprovalActionId(actionId) {
	return actionId === "openclaw:approval_button" || actionId === "openclaw:approval_select" || actionId.startsWith(`openclaw:approval_button:`) || actionId.startsWith(`openclaw:approval_select:`);
}
function isSlackCallbackActionId(actionId) {
	return actionId === "openclaw:callback_button" || actionId === "openclaw:callback_select" || actionId.startsWith(`openclaw:callback_button:`) || actionId.startsWith(`openclaw:callback_select:`);
}
//#endregion
//#region extensions/slack/src/truncate.ts
function truncateSlackText(value, max) {
	const trimmed = value.trim();
	if (trimmed.length <= max) return trimmed;
	if (max <= 1) return sliceUtf16Safe(trimmed, 0, max);
	return `${sliceUtf16Safe(trimmed, 0, max - 1)}…`;
}
function countSlackTextUtf8Bytes(value) {
	return Buffer.byteLength(value, "utf8");
}
/** Truncate Slack text without splitting a code point or exceeding a UTF-8 byte limit. */
function truncateSlackTextByUtf8Bytes(value, maxBytes) {
	const trimmed = value.trim();
	if (maxBytes <= 0) return "";
	if (countSlackTextUtf8Bytes(trimmed) <= maxBytes) return trimmed;
	const suffix = "…";
	const suffixBytes = countSlackTextUtf8Bytes(suffix);
	const prefixBudget = maxBytes >= suffixBytes ? maxBytes - suffixBytes : maxBytes;
	let prefix = "";
	let prefixBytes = 0;
	for (const character of trimmed) {
		const characterBytes = countSlackTextUtf8Bytes(character);
		if (prefixBytes + characterBytes > prefixBudget) break;
		prefix += character;
		prefixBytes += characterBytes;
	}
	return maxBytes >= suffixBytes ? `${prefix}${suffix}` : prefix;
}
//#endregion
//#region extensions/slack/src/limits.ts
const SLACK_TEXT_LIMIT = 8e3;
const SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT = 4e3;
const SLACK_EDIT_TEXT_MAX_BYTES = 4e3;
const SLACK_MESSAGE_TEXT_HARD_LIMIT = 4e4;
//#endregion
//#region extensions/slack/src/blocks-fallback.ts
const SLACK_SELECT_ELEMENT_TYPES = /* @__PURE__ */ new Set([
	"static_select",
	"multi_static_select",
	"external_select",
	"multi_external_select",
	"users_select",
	"multi_users_select",
	"conversations_select",
	"multi_conversations_select",
	"channels_select",
	"multi_channels_select"
]);
function readTextObject(value, options = {}) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const text = normalizeOptionalString(record?.text);
	if (!text) return;
	return record.type === "plain_text" && options.nativeDataFormat !== "plain" ? escapeSlackMrkdwn(text) : text;
}
function readTextValue(value, options = {}) {
	return normalizeOptionalString(value) ?? readTextObject(value, options);
}
function readImageText(block) {
	const altText = normalizeOptionalString(block.alt_text);
	return (altText ? escapeSlackMrkdwn(altText) : void 0) ?? readTextObject(block.title);
}
function readVideoText(block, options = {}) {
	const altText = normalizeOptionalString(block.alt_text);
	return readTextObject(block.title, options) ?? (altText ? escapeSlackMrkdwn(altText) : void 0);
}
function readContextText(block, options = {}) {
	if (!Array.isArray(block.elements)) return;
	const parts = block.elements.map((element) => {
		const record = asOptionalRecord(element);
		const altText = normalizeOptionalString(record?.alt_text);
		return readTextObject(record, options) ?? (altText ? escapeSlackMrkdwn(altText) : void 0);
	}).filter((part) => Boolean(part));
	return parts.length > 0 ? parts.join(" ") : void 0;
}
function readControlElementText(value, options = {}) {
	const element = asOptionalRecord(value);
	const type = normalizeOptionalString(element?.type);
	if (type === "button" || type === "workflow_button") return readTextValue(element?.text, options);
	if (type && SLACK_SELECT_ELEMENT_TYPES.has(type)) {
		if (!options.includeSelectOptions) return readTextObject(element?.placeholder, options);
		const choices = Array.isArray(element?.options) ? element.options : [];
		return [readTextObject(element?.placeholder, options), ...choices.map((choice) => readTextObject(asOptionalRecord(choice)?.text, options))].filter(Boolean).join("\n");
	}
}
function readControlElementsText(values, options = {}) {
	const seen = /* @__PURE__ */ new Set();
	const labels = [];
	for (const value of values) {
		const candidate = readControlElementText(value, options);
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		labels.push(candidate);
	}
	return labels.length > 0 ? labels.join("\n") : void 0;
}
function readSectionText(block, options = {}) {
	const parts = [readTextObject(block.text, options)];
	if (Array.isArray(block.fields)) parts.push(...block.fields.map((field) => readTextObject(field, options)));
	parts.push(readControlElementText(block.accessory, options));
	const visibleParts = parts.filter((part) => Boolean(part));
	return visibleParts.length > 0 ? visibleParts.join("\n") : void 0;
}
function readActionsText(block, options = {}) {
	return Array.isArray(block.elements) ? readControlElementsText(block.elements, options) : void 0;
}
/** Read only user-visible text from one Slack block. */
function renderSlackBlockFallbackText(raw, options = {}) {
	const block = asOptionalRecord(raw);
	if (!block) return;
	switch (block.type) {
		case "rich_text": return normalizeOptionalString(renderSlackRichText(block.elements, options.nativeReferenceFormat === "plain" ? "native-reference" : "escaped", "\n"));
		case "header": return readTextObject(block.text, options);
		case "section": return readSectionText(block, options);
		case "image": return readImageText(block) ?? "Shared an image";
		case "video": return readVideoText(block, options) ?? "Shared a video";
		case "file": return "Shared a file";
		case "context": return readContextText(block, options);
		case "actions": return readActionsText(block, options);
		case "data_visualization": return options.nativeDataFormat === "plain" ? renderSlackDataVisualizationFallbackText(block) : renderSlackDataVisualizationMrkdwnFallbackText(block);
		case "data_table": return options.nativeDataFormat === "plain" ? renderSlackDataTableFallbackText(block) : renderSlackDataTableMrkdwnFallbackText(block);
		case "table": return options.nativeDataFormat === "plain" ? renderSlackTableFallbackText(block) : renderSlackTableMrkdwnFallbackText(block);
		default: return;
	}
}
function buildSlackBlocksFallbackText(blocks) {
	for (const block of blocks) {
		const text = renderSlackBlockFallbackText(block);
		if (text) return text;
	}
	return "Shared a Block Kit message";
}
function buildSlackCompleteBlocksFallbackText(blocks, options = {}) {
	return blocks.map((block) => renderSlackBlockFallbackText(block, options)).filter(Boolean).join("\n\n").trim() || buildSlackBlocksFallbackText(blocks);
}
//#endregion
//#region extensions/slack/src/native-data-blocks.ts
const SLACK_MALFORMED_NATIVE_DATA_FALLBACK = "Slack could not render this chart or table data.";
const SLACK_RESPONSE_URL_BODY_LIMIT_BYTES = 16384;
const SLACK_RESPONSE_URL_BODY_TIMEOUT_MS = 3e4;
/** Detect a native Slack chart or table block. */
function hasSlackNativeDataBlock(blocks) {
	return hasSlackDataVisualizationBlock(blocks) || hasSlackDataTableBlock(blocks);
}
/** Keep every sibling block while removing Slack's native data blocks. */
function stripSlackNativeDataBlocks(blocks) {
	return (blocks ?? []).filter((block) => {
		const type = asOptionalRecord(block)?.type;
		return type !== "data_table" && type !== "data_visualization";
	});
}
/** Match Slack's Web API and response_url `invalid_blocks` error shapes. */
function isSlackInvalidBlocksError(error) {
	const record = asOptionalRecord(error);
	const rawData = record?.data;
	const data = asOptionalRecord(rawData);
	const rawResponseData = asOptionalRecord(record?.response)?.data;
	const responseData = asOptionalRecord(rawResponseData);
	const code = data?.error ?? (typeof rawData === "string" ? rawData : void 0) ?? responseData?.error ?? (typeof rawResponseData === "string" ? rawResponseData : void 0) ?? record?.error;
	return typeof code === "string" && code.trim().toLowerCase() === "invalid_blocks";
}
function isSlackResponseLike(value) {
	const record = asOptionalRecord(value);
	const body = asOptionalRecord(record?.body);
	return typeof record?.status === "number" && (typeof record.arrayBuffer === "function" || typeof body?.getReader === "function");
}
/** Consume Bolt 5's native response_url body under strict time and byte bounds. */
async function isSlackInvalidBlocksResponse(response) {
	if (!isSlackResponseLike(response)) return isSlackInvalidBlocksError(response);
	try {
		const body = await readResponseTextLimited(response, SLACK_RESPONSE_URL_BODY_LIMIT_BYTES, { timeoutMs: SLACK_RESPONSE_URL_BODY_TIMEOUT_MS });
		if (body.trim().toLowerCase() === "invalid_blocks") return true;
		return isSlackInvalidBlocksError(JSON.parse(body));
	} catch {
		return false;
	}
}
/** Bolt 5 omits the response body from RespondError; 400 is contextual here. */
function isSlackNativeResponseUrlRejection(error) {
	if (isSlackInvalidBlocksError(error)) return true;
	const record = asOptionalRecord(error);
	return record?.code === "slack_bolt_respond_error" && record.statusCode === 400;
}
/** Extract a complete accessible summary from a supported native data block. */
function renderSlackNativeDataFallbackText(value) {
	const type = asOptionalRecord(value)?.type;
	if (type === "data_visualization") return renderSlackDataVisualizationMrkdwnFallbackText(value);
	if (type === "data_table") return renderSlackDataTableMrkdwnFallbackText(value);
}
function comparableText(value) {
	return value.replace(/\s+/gu, " ").trim();
}
function countComparableOccurrences(value, candidate) {
	if (!candidate) return 0;
	let count = 0;
	let offset = 0;
	while ((offset = value.indexOf(candidate, offset)) >= 0) {
		count += 1;
		offset += candidate.length;
	}
	return count;
}
/** Consume native fallback occurrences already carried by an explicit outside base. */
function createSlackNativeDataBaseTextConsumer(baseText) {
	const comparableBase = comparableText(baseText);
	const remainingByText = /* @__PURE__ */ new Map();
	return (text) => {
		const comparable = comparableText(text);
		const remaining = remainingByText.get(comparable) ?? countComparableOccurrences(comparableBase, comparable);
		if (remaining <= 0) return false;
		remainingByText.set(comparable, remaining - 1);
		return true;
	};
}
function appendSlackNativeDataFallback(text, blocks, render) {
	const base = text.trim();
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(base);
	const dataTexts = [];
	for (const block of blocks ?? []) {
		const dataText = render(block);
		if (!dataText) continue;
		if (!comparableText(dataText) || consumeFromBase(dataText)) continue;
		dataTexts.push(dataText);
	}
	return [base, ...dataTexts].filter(Boolean).join("\n\n");
}
function renderSlackNativeDataPlainTextBlock(value) {
	const type = asOptionalRecord(value)?.type;
	if (type === "data_table") return renderSlackDataTableCompactPlainTextFallback(value);
	if (type === "data_visualization") return renderSlackDataVisualizationFallbackText(value);
}
/** Build formatting-disabled accessibility text from actual Slack block order. */
function buildSlackNativeDataAccessibilityText(text, blocks) {
	const parts = [];
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(text);
	const append = (value) => {
		if (value?.trim()) parts.push(value);
	};
	append(text);
	for (const block of blocks ?? []) {
		const isNativeData = hasSlackNativeDataBlock([block]);
		const rendered = renderSlackNativeDataPlainTextBlock(block) ?? renderSlackBlockFallbackText(block, {
			nativeDataFormat: "plain",
			includeSelectOptions: true
		}) ?? (isNativeData ? "Slack could not render this chart or table data." : void 0);
		if (!rendered || isNativeData && consumeFromBase(rendered)) continue;
		append(rendered);
	}
	return parts.join("\n\n");
}
/** Preserve every native data block's content once when Slack requires a text-only retry. */
function appendSlackNativeDataFallbackText(text, blocks) {
	return appendSlackNativeDataFallback(text, blocks, renderSlackNativeDataFallbackText);
}
/** Build a bounded plain-text retry without activating control tokens. */
function appendSlackNativeDataPlainTextFallback(text, blocks) {
	return appendSlackNativeDataFallback(text, blocks, renderSlackNativeDataPlainTextBlock);
}
//#endregion
//#region extensions/slack/src/detached-target-admission.ts
function assertSlackDetachedTargetAllowed(accountId, teamId) {
	const installationKind = getSlackInstallationKind(accountId);
	if (installationKind && installationKind !== "workspace" && !teamId) throw new Error("unsupported_enterprise_slack_delivery: detached Slack operations require team:<team-id>:channel:<channel-id> or team:<team-id>:user:<user-id> until a workspace install is authenticated");
}
//#endregion
//#region extensions/slack/src/conversation-binding-route.ts
const slackRouteBindingConfigCache = /* @__PURE__ */ new WeakMap();
function slackTargetDefaultKindForPeer(kind) {
	return kind === "direct" ? "user" : "channel";
}
function slackTargetKindMatchesPeer(peerKind, targetKind) {
	if (targetKind === "user") return peerKind === "direct";
	return peerKind === "channel" || peerKind === "group";
}
function normalizeSlackRouteBindingPeer(peer) {
	const rawId = peer.id.trim();
	if (!rawId || rawId === "*") return peer;
	const target = (() => {
		try {
			return parseSlackTarget(rawId, { defaultKind: slackTargetDefaultKindForPeer(peer.kind) });
		} catch {
			return;
		}
	})();
	if (!target || !slackTargetKindMatchesPeer(peer.kind, target.kind)) return peer;
	const normalizedId = target.teamId ? `team:${target.teamId}:${target.kind}:${target.id}` : target.id;
	return normalizedId === peer.id ? peer : {
		...peer,
		id: normalizedId
	};
}
function normalizeSlackRouteBindingConfig(cfg) {
	const bindings = cfg.bindings;
	const cached = slackRouteBindingConfigCache.get(cfg);
	if (cached && cached.bindingsRef === bindings) return cached.normalizedCfg;
	if (!Array.isArray(bindings)) return cfg;
	let changed = false;
	const normalizedBindings = bindings.map((binding) => {
		if (binding.type === "acp" || binding.match.channel.trim().toLowerCase() !== "slack") return binding;
		const peer = binding.match.peer;
		if (!peer) return binding;
		const normalizedPeer = normalizeSlackRouteBindingPeer(peer);
		if (normalizedPeer === peer) return binding;
		changed = true;
		return {
			...binding,
			match: {
				...binding.match,
				peer: normalizedPeer
			}
		};
	});
	const normalizedCfg = changed ? {
		...cfg,
		bindings: normalizedBindings
	} : cfg;
	slackRouteBindingConfigCache.set(cfg, {
		bindingsRef: bindings,
		normalizedCfg
	});
	return normalizedCfg;
}
function resolveSlackConversationBindingRoute(params) {
	const boundThreadRoute = params.bindingsEnabled && params.runtimeBindingThreadId ? resolveRuntimeConversationBindingRoute({
		route: params.route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.runtimeBindingThreadId,
			parentConversationId: params.baseConversationId
		}
	}) : null;
	const runtimeRoute = !params.bindingsEnabled ? {
		bindingOwnerAvailable: true,
		route: params.route,
		bindingRecord: null,
		boundSessionKey: void 0
	} : boundThreadRoute?.boundSessionKey || boundThreadRoute?.bindingRecord ? boundThreadRoute : resolveRuntimeConversationBindingRoute({
		route: boundThreadRoute?.route ?? params.route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.baseConversationId
		}
	});
	const configuredRoute = params.bindingsEnabled && !runtimeRoute.boundSessionKey && !runtimeRoute.bindingRecord ? resolveConfiguredBindingRoute({
		cfg: params.cfg,
		route: runtimeRoute.route,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.baseConversationId
		}
	}) : null;
	return {
		runtimeRoute,
		configuredRoute,
		route: runtimeRoute.boundSessionKey ? runtimeRoute.route : configuredRoute?.route ?? runtimeRoute.route
	};
}
//#endregion
//#region extensions/slack/src/monitor/workspace-routing.ts
function resolveSlackEnterpriseMainDmSessionKey(params) {
	const accountId = encodeURIComponent(params.accountId).toLowerCase();
	const teamId = encodeURIComponent(params.eventScope.teamId).toLowerCase();
	return `${params.baseSessionKey}:account:${accountId}:team:${teamId}`;
}
function qualifySlackRoutePeerId(params) {
	if (!params.eventScope) return params.id;
	return `team:${encodeURIComponent(params.eventScope.teamId)}:${params.kind}:${encodeURIComponent(params.id)}`;
}
function qualifySlackConversationId(conversationId, eventScope) {
	return eventScope ? `team:${encodeURIComponent(eventScope.teamId)}:${conversationId}` : conversationId;
}
//#endregion
//#region extensions/slack/src/group-policy.ts
function buildSlackChannelIdCandidates(channelId, teamId, options) {
	const trimmedId = channelId?.trim();
	if (!trimmedId) return [];
	const lowercaseId = trimmedId.toLowerCase();
	const uppercaseId = trimmedId.toUpperCase();
	const exactTeamId = teamId || void 0;
	const lowercaseTeamId = exactTeamId?.toLowerCase();
	const uppercaseTeamId = exactTeamId?.toUpperCase();
	const scopedCandidates = buildChannelKeyCandidates(exactTeamId ? `team:${exactTeamId}:channel:${trimmedId}` : void 0, lowercaseTeamId ? `team:${lowercaseTeamId}:channel:${lowercaseId}` : void 0, uppercaseTeamId ? `team:${uppercaseTeamId}:channel:${uppercaseId}` : void 0);
	if (exactTeamId && options?.allowUnscoped !== true) return scopedCandidates;
	return buildChannelKeyCandidates(...scopedCandidates, trimmedId, lowercaseId, uppercaseId, `channel:${trimmedId}`, `channel:${lowercaseId}`, `channel:${uppercaseId}`);
}
function buildSlackChannelPolicyScope(params) {
	const channels = params.channels ?? {};
	const tree = { scopes: channels };
	const matchKey = params.candidates.find((candidate) => candidate !== "*" && Object.hasOwn(tree.scopes, candidate)) ?? (Object.hasOwn(tree.scopes, "*") ? "*" : void 0);
	const matchSource = matchKey === void 0 ? void 0 : matchKey === "*" ? "wildcard" : "direct";
	return {
		tree,
		path: matchKey ? [matchKey] : [],
		entry: matchKey ? channels[matchKey] : void 0,
		wildcardEntry: channels["*"],
		matchKey,
		matchSource
	};
}
function resolveSlackGroupPolicyScope(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSlackAccountId(params.cfg));
	const channels = mergeSlackAccountConfig(params.cfg, accountId).channels;
	const channelName = params.groupChannel?.replace(/^#/, "");
	const allowUnscoped = getSlackInstallationKind(accountId) !== "enterprise";
	return buildSlackChannelPolicyScope({
		channels,
		candidates: buildChannelKeyCandidates(...buildSlackChannelIdCandidates(params.groupId, params.groupSpace, { allowUnscoped }), channelName ? `#${channelName}` : void 0, channelName, normalizeHyphenSlug(channelName))
	});
}
function resolveSlackGroupRequireMention(params) {
	return resolveScopeRequireMention(resolveSlackGroupPolicyScope(params));
}
function resolveSlackGroupToolPolicy(params) {
	const scope = resolveSlackGroupPolicyScope(params);
	return resolveScopeToolsPolicy({
		...scope,
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
}
//#endregion
//#region extensions/slack/src/session-status.ts
const MISSING_STOP_SUBSCRIPTION = "missing_agent_session_stopped_event_subscription";
let warnedMissingStopSubscription = false;
async function setSlackSessionStatus(params) {
	if (!params.threadTs) return { ok: false };
	const request = {
		channel_id: params.channelId,
		thread_ts: params.threadTs,
		status: params.status,
		...params.token ? { token: params.token } : {},
		...params.title !== void 0 ? { title: truncateUtf16Safe(params.title, 200) } : {}
	};
	try {
		const response = await params.client.apiCall("agents.sessions.setStatus", request);
		if (!warnedMissingStopSubscription && (response.warning === MISSING_STOP_SUBSCRIPTION || response.response_metadata?.warnings?.includes(MISSING_STOP_SUBSCRIPTION))) {
			warnedMissingStopSubscription = true;
			(params.runtime ?? defaultRuntime).log?.(warn("Slack's Stop button is unavailable until the app subscribes to agent_session_stopped. See https://docs.openclaw.ai/channels/slack#additional-manifest-settings"));
		}
		return response.ok ? {
			ok: true,
			title: response.title
		} : { ok: false };
	} catch (error) {
		logVerbose(`slack status update failed for channel ${params.channelId}: ${formatSlackError(error)}`);
		return { ok: false };
	}
}
async function renameSlackSession(params) {
	const request = {
		channel_id: params.channelId,
		thread_ts: params.threadTs,
		title: truncateUtf16Safe(params.title, 200),
		...params.token ? { token: params.token } : {}
	};
	try {
		return (await params.client.apiCall("agents.sessions.rename", request)).ok;
	} catch (error) {
		logVerbose(`slack session rename failed for channel ${params.channelId}: ${formatSlackError(error)}`);
		return false;
	}
}
//#endregion
export { SLACK_DATA_TABLE_AGGREGATE_CELL_CHARACTERS_MAX as $, countSlackTextUtf8Bytes as A, resolveSlackExecApprovalTarget as At, SLACK_REPLY_LINK_ACTION_ID as B, buildSlackBlocksFallbackText as C, registerSlackInstallationState as Ct, SLACK_MESSAGE_TEXT_HARD_LIMIT as D, isSlackExecApprovalAuthorizedSender as Dt, SLACK_EDIT_TEXT_MAX_BYTES as E, getSlackExecApprovalApprovers as Et, SLACK_CALLBACK_BUTTON_ACTION_ID as F, isSlackQuestionActionId as G, SLACK_SESSION_LINK_ACTION_ID as H, SLACK_CALLBACK_SELECT_ACTION_ID as I, markdownToSlackMrkdwnChunks as J, resolveSlackQuestionActionIds as K, SLACK_QUESTION_BUTTON_ACTION_ID as L, truncateSlackTextByUtf8Bytes as M, SLACK_PRIVATE_ACTION_DELIVERY_RESULT as Mt, SLACK_APPROVAL_BUTTON_ACTION_ID as N, resolveSlackAutoThreadId as Nt, SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT as O, isSlackExecApprovalClientEnabled as Ot, SLACK_APPROVAL_SELECT_ACTION_ID as P, resolveSlackReplyToMode as Pt, hasSlackDataVisualizationBlock as Q, SLACK_QUESTION_FINALIZATION_BLOCKS as R, stripSlackNativeDataBlocks as S, isSlackWorkspaceInstallation as St, renderSlackBlockFallbackText as T, isSlackApprovalAuthorizedSender as Tt, isSlackApprovalActionId as U, SLACK_REPLY_SELECT_ACTION_ID as V, isSlackCallbackActionId as W, buildSlackDataVisualizationBlock as X, normalizeSlackOutboundText as Y, canRenderSlackDataVisualization as Z, createSlackNativeDataBaseTextConsumer as _, resolveTurnSourceSlackOriginTarget as _t, resolveSlackGroupRequireMention as a, renderSlackMessagePresentationFallbackText as at, isSlackInvalidBlocksResponse as b, slackTargetsMatch as bt, qualifySlackRoutePeerId as c, parseSlackBlocksInput as ct, resolveSlackConversationBindingRoute as d, isSlackAnyNativeApprovalClientEnabled as dt, buildSlackDataTableBlock as et, assertSlackDetachedTargetAllowed as f, normalizeSlackForwardTarget as ft, buildSlackNativeDataAccessibilityText as g, resolveSlackFallbackOriginTarget as gt, appendSlackNativeDataPlainTextFallback as h, resolveSessionSlackOriginTarget as ht, buildSlackChannelPolicyScope as i, renderSlackMessagePresentationChartFallbackText as it, truncateSlackText as j, shouldSuppressLocalSlackExecApprovalPrompt as jt, SLACK_TEXT_LIMIT as k, normalizeSlackApproverId as kt, resolveSlackEnterpriseMainDmSessionKey as l, validateSlackBlocksArray as lt, appendSlackNativeDataFallbackText as m, resolveEnterpriseApprovalTeamId as mt, setSlackSessionStatus as n, countSlackDataTableCellCharacters as nt, resolveSlackGroupToolPolicy as o, escapeSlackMrkdwn as ot, SLACK_MALFORMED_NATIVE_DATA_FALLBACK as p, normalizeSlackOriginTarget as pt, chunkSlackMrkdwnText as q, buildSlackChannelIdCandidates as r, resolveSlackDataTableCellCharacterCount as rt, qualifySlackConversationId as s, SLACK_MAX_BLOCKS as st, renameSlackSession as t, countSlackDataTableBlocksCellCharacters as tt, normalizeSlackRouteBindingConfig as u, hasSlackPluginApprovers as ut, hasSlackNativeDataBlock as v, shouldHandleSlackNativeApprovalRequest as vt, buildSlackCompleteBlocksFallbackText as w, getSlackApprovalApproversForTeam as wt, isSlackNativeResponseUrlRejection as x, getSlackInstallationKind as xt, isSlackInvalidBlocksError as y, shouldHandleSlackPluginViaForwardingSession as yt, SLACK_REPLY_BUTTON_ACTION_ID as z };

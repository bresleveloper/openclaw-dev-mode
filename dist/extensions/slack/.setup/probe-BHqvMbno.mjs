import { t as __exportAll } from "./rolldown-runtime-nwUcYXjP.mjs";
import { r as isSlackPluginAccountConfigured } from "./account-configured-35y0-Hso.mjs";
import { a as mergeSlackAccountConfig, c as resolveSlackAccountAllowFrom, i as listSlackAccountIds, m as formatSlackBotTokenIdentityWarning, o as resolveDefaultSlackAccountId, s as resolveSlackAccount } from "./accounts-EaPP0fFY.mjs";
import { a as parseSlackTarget, n as formatSlackTarget, t as canonicalizeSlackApiTargetId } from "./target-parsing-DwYAP3ts.mjs";
import { t as slackContextTargetsMatch } from "./targets-eeOxA_b_.mjs";
import { _ as createSlackProbeDispatcher, i as createSlackReadClient } from "./cursor-pages-jVn3Vkfi.mjs";
import { normalizeAccountId } from "openclaw/plugin-sdk/account-resolution";
import { asOptionalRecord, isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeStringifiedOptionalString, normalizeTrimmedStringList, readNonBlankString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeMessageChannel, resolveAgentRoute } from "openclaw/plugin-sdk/routing";
import { defaultRuntime, logVerbose, warn } from "openclaw/plugin-sdk/runtime-env";
import { FormatCapabilityProfile, chunkTextForOutbound, markdownToIR, renderMarkdownIRChunksWithinLimit, renderMarkdownWithMarkers } from "openclaw/plugin-sdk/text-chunking";
import { isSingleUseReplyToMode } from "openclaw/plugin-sdk/reply-reference";
import { buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { createNativeApprovalChannelRouteGatesAsync, doesApprovalRequestSelectChannelAccountAsync, resolveApprovalKind, resolveApprovalRequestSessionConversation } from "openclaw/plugin-sdk/approval-native-runtime";
import { createChannelApprovalAuth, resolveApprovalApprovers } from "openclaw/plugin-sdk/approval-auth-runtime";
import { normalizeHyphenSlug, normalizeStringEntriesLower, truncateWithMarker } from "openclaw/plugin-sdk/string-normalization-runtime";
import { createChannelExecApprovalProfileAsync, isChannelExecApprovalClientEnabledFromConfig, isChannelExecApprovalTargetRecipient, matchesApprovalRequestFilters } from "openclaw/plugin-sdk/approval-client-runtime";
import { resolveGlobalMap } from "openclaw/plugin-sdk/global-singleton";
import { compileAllowlist, resolveCompiledAllowlistMatch } from "openclaw/plugin-sdk/allow-from";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { channelRouteTargetsMatchExact, stringifyRouteThreadId } from "openclaw/plugin-sdk/channel-route";
import { normalizeMessagePresentation, renderMessagePresentationChartFallbackText, renderMessagePresentationFallbackText, renderMessagePresentationTableFallbackText } from "openclaw/plugin-sdk/interactive-runtime";
import { eastAsianWidthType } from "get-east-asian-width";
import { resolveIntegerOption } from "openclaw/plugin-sdk/number-runtime";
import { isStringArray } from "openclaw/plugin-sdk/collection-input-runtime";
import { buildApprovalResolutionRef } from "openclaw/plugin-sdk/approval-reference-runtime";
import { questionGatewayRuntime } from "openclaw/plugin-sdk/question-gateway-runtime";
import { runChannelProbe, sliceUtf16Safe, truncateUtf16Safe, truncateUtf8Prefix } from "openclaw/plugin-sdk/text-utility-runtime";
import { readResponseTextLimited } from "openclaw/plugin-sdk/provider-http";
import { inspectRuntimeConversationBindingRoute, resolveConfiguredBindingRoute, resolveRuntimeConversationBindingRouteAsync } from "openclaw/plugin-sdk/conversation-binding-runtime";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
import { resolveScopeRequireMention, resolveScopeToolsPolicy } from "openclaw/plugin-sdk/channel-policy";
import { defineStableChannelIngressIdentity } from "openclaw/plugin-sdk/channel-ingress-runtime";
// extensions/slack/src/action-threading.ts
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
function resolveSlackThreadTsFromContext(explicitThreadTs, targetChannel, context, opts) {
	if (explicitThreadTs) return explicitThreadTs;
	if (opts?.suppressImplicitThread) return;
	const threadTs = resolveSlackAutoThreadId({
		to: targetChannel,
		toolContext: context
	});
	if (isSingleUseReplyToMode(context?.replyToMode ?? "off") && !context?.hasRepliedRef) return;
	return threadTs;
}
// extensions/slack/src/approval-plugin-policy.ts
/** Returns undefined only when Slack plugin approvals retain legacy account authorization. */
function resolvePluginApprovalSlackApprovers(cfg, request) {
	const policy = cfg.approvals?.plugin?.slack;
	if (!policy) return;
	const subject = request.request.policySubject;
	const plugins = policy.plugins;
	if (!subject && plugins && Object.keys(plugins).length > 0) return [];
	const plugin = subject && plugins && Object.hasOwn(plugins, subject.pluginKey) ? plugins[subject.pluginKey] : void 0;
	const tools = plugin?.tools;
	if (tools && Object.keys(tools).length > 0) {
		if (!subject?.tool) return [];
		const toolKey = encodeURIComponent(subject.tool);
		if (Object.hasOwn(tools, toolKey)) return tools[toolKey]?.approvers ?? [];
	}
	return plugin?.approvers ?? policy.approvers;
}
// extensions/slack/src/exec-approvals.ts
function normalizeSlackUserLikeId(value) {
	const upper = value.toUpperCase();
	return /^[UW][A-Z0-9]+$/.test(upper) ? upper : void 0;
}
function normalizeSlackApproverTarget(value) {
	const trimmed = normalizeStringifiedOptionalString(value);
	if (!trimmed) return;
	try {
		const target = parseSlackTarget(trimmed.replace(/^slack:/i, ""), { defaultKind: "user" });
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
function getSlackExecApprovalApprovers(params) {
	const account = resolveSlackAccount(params).config;
	const ownerAllowFrom = params.cfg.commands?.ownerAllowFrom;
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers ?? (Array.isArray(ownerAllowFrom) ? ownerAllowFrom : []),
		normalizeApprover: normalizeSlackApproverId
	});
}
const slackExecApprovalProfile = createChannelExecApprovalProfileAsync({
	resolveConfig: (params) => resolveSlackAccount(params).config.execApprovals,
	resolveApprovers: getSlackExecApprovalApprovers,
	normalizeSenderId: normalizeSlackApproverId,
	isTargetRecipient: (params) => isChannelExecApprovalTargetRecipient({
		...params,
		channel: "slack",
		normalizeSenderId: normalizeSlackApproverId,
		matchTarget: ({ target, normalizedSenderId }) => normalizeSlackApproverId(target.to) === normalizedSenderId
	})
});
const isSlackExecApprovalClientEnabled = slackExecApprovalProfile.isClientEnabled;
const isSlackExecApprovalAuthorizedSender = slackExecApprovalProfile.isAuthorizedSender;
const resolveSlackExecApprovalTarget = slackExecApprovalProfile.resolveTarget;
const shouldSuppressLocalSlackExecApprovalPrompt = slackExecApprovalProfile.shouldSuppressLocalPrompt;
// extensions/slack/src/installation-identity-state.ts
const slackInstallationStates = resolveGlobalMap(Symbol.for("openclaw.slack.installation-identities"), "close-and-restart");
function registerSlackInstallationState(accountId, kind, teamId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const owner = Symbol(`slack-installation:${normalizedAccountId}`);
	slackInstallationStates.set(normalizedAccountId, {
		kind,
		teamId,
		owner
	});
	return {
		update: (nextKind, nextTeamId) => {
			if (slackInstallationStates.get(normalizedAccountId)?.owner === owner) slackInstallationStates.set(normalizedAccountId, {
				kind: nextKind,
				teamId: nextTeamId,
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
function getSlackInstallationTeamId(accountId) {
	const state = slackInstallationStates.get(normalizeAccountId(accountId));
	return state?.kind === "workspace" ? state.teamId : void 0;
}
/** Retain the authenticated monitor owner, not just its current installation label. */
function captureSlackWorkspaceInstallation(accountId) {
	const key = normalizeAccountId(accountId);
	const captured = slackInstallationStates.get(key);
	if (captured?.kind !== "workspace") return null;
	const teamId = captured.teamId;
	return { assertCurrent: () => {
		const current = slackInstallationStates.get(key);
		if (current?.owner !== captured.owner || current.kind !== "workspace" || current.teamId !== teamId) throw new Error("The Slack workspace installation changed; send a new /fork request.");
	} };
}
function isSlackWorkspaceInstallation(accountId) {
	return getSlackInstallationKind(accountId) === "workspace";
}
// extensions/slack/src/monitor/allow-list.ts
const SLACK_SLUG_CACHE_MAX = 512;
const SLACK_STABLE_USER_ID_RE = /^[ubw][a-z0-9]+$/;
const slackSlugCache = /* @__PURE__ */ new Map();
function normalizeSlackSlug(raw) {
	const key = raw ?? "";
	const cached = slackSlugCache.get(key);
	if (cached !== void 0) return cached;
	const normalized = normalizeHyphenSlug(raw);
	slackSlugCache.set(key, normalized);
	pruneMapToMaxSize(slackSlugCache, SLACK_SLUG_CACHE_MAX);
	return normalized;
}
function normalizeSlackAllowOwnerEntry(entry) {
	const trimmed = normalizeOptionalLowercaseString(entry);
	if (!trimmed || trimmed === "*") return;
	try {
		const target = parseSlackTarget(trimmed);
		if (target?.kind === "user" && target.teamId) return target.id.toLowerCase();
	} catch {
		return;
	}
	const withoutPrefix = trimmed.replace(/^(slack:|user:)/, "");
	return SLACK_STABLE_USER_ID_RE.test(withoutPrefix) ? withoutPrefix : void 0;
}
function resolveSlackAllowListMatch(params) {
	const compiledAllowList = compileAllowlist(params.allowList);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	const id = normalizeOptionalLowercaseString(params.id);
	const name = normalizeOptionalLowercaseString(params.name);
	const slug = normalizeSlackSlug(name);
	const scopedCandidates = [{
		value: teamId && id ? `team:${teamId}:user:${id}` : void 0,
		source: "workspace-id"
	}];
	const unscopedCandidates = [
		{
			value: id,
			source: "id"
		},
		{
			value: id ? `slack:${id}` : void 0,
			source: "prefixed-id"
		},
		{
			value: id ? `user:${id}` : void 0,
			source: "prefixed-user"
		},
		...params.allowNameMatching === true ? [
			{
				value: name,
				source: "name"
			},
			{
				value: name ? `slack:${name}` : void 0,
				source: "prefixed-name"
			},
			{
				value: slug,
				source: "slug"
			}
		] : []
	];
	return resolveCompiledAllowlistMatch({
		compiledAllowlist: compiledAllowList,
		candidates: [...scopedCandidates, ...unscopedCandidates]
	});
}
function allowListMatches(params) {
	return resolveSlackAllowListMatch(params).allowed;
}
function resolveSlackUserAllowed(params) {
	const allowList = normalizeStringEntriesLower(params.allowList);
	if (allowList.length === 0) return true;
	return allowListMatches({
		allowList,
		teamId: params.teamId,
		id: params.userId,
		name: params.userName,
		allowNameMatching: params.allowNameMatching
	});
}
function resolveSlackUserAllowListForTeam(params) {
	const allowList = normalizeStringEntriesLower(params.allowList);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	return allowList.flatMap((entry) => {
		if (entry === "*") return [entry];
		if (!entry.startsWith("team:")) return [entry];
		try {
			const target = parseSlackTarget(entry);
			if (target?.kind === "user" && target.teamId?.toLowerCase() === teamId) return [entry];
			return params.preserveUnmatchedScopedEntries ? [entry] : [];
		} catch {
			return params.preserveUnmatchedScopedEntries ? [entry] : [];
		}
	});
}
// extensions/slack/src/approval-auth.ts
function resolveSlackApprovalInputs(params) {
	const account = resolveSlackAccount(params).config;
	return {
		allowFrom: resolveSlackAccountAllowFrom(params),
		defaultTo: account.defaultTo
	};
}
function slackApprovalTargetMatches(senderId, approvers, accountTeamId) {
	const sender = parseSlackTarget(senderId, { defaultKind: "user" });
	return sender?.kind === "user" && (!accountTeamId || sender.teamId?.toLowerCase() === accountTeamId.toLowerCase()) && resolveSlackAllowListMatch({
		allowList: normalizeStringEntriesLower([...approvers]),
		teamId: sender.teamId,
		id: sender.id
	}).allowed;
}
function resolveSlackApprovalOriginTeamId(request) {
	if (normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel) !== "slack") return;
	try {
		return parseSlackTarget(request.request.turnSourceTo ?? "")?.teamId;
	} catch {
		return;
	}
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
function isSlackPluginApprovalAuthorizedSender(params) {
	if (!params.request) return params.cfg.approvals?.plugin?.slack ? Boolean(params.senderId && normalizeSlackApproverTarget(params.senderId)) : isSlackApprovalAuthorizedSender(params);
	if (resolvePluginApprovalSlackApprovers(params.cfg, params.request) === void 0) return isSlackApprovalAuthorizedSender(params);
	const teamId = resolveSlackApprovalTeamId({
		...params,
		request: params.request
	});
	return Boolean(params.senderId && slackApprovalTargetMatches(params.senderId, getSlackApprovalApproversForTeam({
		...params,
		teamId
	}), teamId));
}
function getSlackApprovalApproversForTeam(params) {
	const configured = params.request ? resolvePluginApprovalSlackApprovers(params.cfg, params.request) : void 0;
	if (params.request) {
		const accountId = resolveSlackAccount(params).accountId;
		const installedTeamId = getSlackInstallationTeamId(accountId);
		const originTeamId = resolveSlackApprovalOriginTeamId(params.request);
		const enterprise = getSlackInstallationKind(accountId) === "enterprise";
		if (installedTeamId && originTeamId && installedTeamId.toLowerCase() !== originTeamId.toLowerCase() || enterprise && !originTeamId || configured !== void 0 && !installedTeamId && !enterprise) return [];
	}
	const approvers = configured ?? getSlackApprovalApprovers(params);
	return resolveApprovalApprovers({
		allowFrom: resolveSlackUserAllowListForTeam({
			allowList: [...approvers],
			teamId: params.teamId
		}),
		normalizeApprover: normalizeSlackApproverTarget
	});
}
function resolveSlackApprovalTeamId(params) {
	return getSlackInstallationTeamId(resolveSlackAccount(params).accountId) ?? resolveSlackApprovalOriginTeamId(params.request);
}
// extensions/slack/src/approval-native-gates.ts
function isSlackPluginApprovalRequest(request) {
	return resolveApprovalKind(request) === "plugin";
}
async function resolveSlackApproverDmTargets(params) {
	if (!await shouldHandleSlackNativeApprovalRequest(params)) return [];
	const teamId = resolveSlackApprovalTeamId(params);
	return (params.approvalKind === "plugin" ? isSlackPluginApprovalRequest(params.request) ? getSlackApprovalApproversForTeam({
		...params,
		teamId,
		request: params.request
	}) : [] : getSlackExecApprovalApprovers(params)).map((approver) => {
		const target = parseSlackTarget(approver, { defaultKind: "user" });
		if (!target || target.kind !== "user") throw new Error("Slack approval approver target must be a user");
		return { to: formatSlackTarget({
			kind: "user",
			id: target.id,
			teamId: target.teamId ?? teamId,
			explicitKind: true
		}) };
	});
}
const SLACK_DM_CHANNEL_ID_RE = /^D[A-Z0-9]{8,}$/i;
const SLACK_USER_ID_RE = /^[UW][A-Z0-9]{8,}$/i;
function isSlackApprovalTransportEnabled(params) {
	const account = resolveSlackAccount(params);
	return isSlackPluginAccountConfigured(account);
}
function normalizeSlackThreadMatchKey(threadId) {
	return threadId == null ? "" : String(threadId).trim();
}
function resolveSlackTurnSourceDefaultKind(turnSourceTo, sessionKey) {
	if (SLACK_DM_CHANNEL_ID_RE.test(turnSourceTo)) return "channel";
	return sessionKey?.match(/slack:(direct|channel|group):/i)?.[1]?.toLowerCase() === "direct" ? "user" : "channel";
}
function resolveTurnSourceSlackOriginTarget(request) {
	const turnSourceChannel = normalizeLowercaseStringOrEmpty(request.request.turnSourceChannel);
	const turnSourceTo = normalizeOptionalString(request.request.turnSourceTo) ?? "";
	if (turnSourceChannel !== "slack" || !turnSourceTo) return null;
	const parsed = parseSlackTarget(turnSourceTo, { defaultKind: resolveSlackTurnSourceDefaultKind(turnSourceTo, request.request.sessionKey) });
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
		to: normalizeLowercaseStringOrEmpty(target.to)
	};
}
function isSlackDmChannelToUserRoutePair(a, b) {
	const left = parseSlackTarget(a.to, { defaultKind: "channel" });
	const right = parseSlackTarget(b.to, { defaultKind: "channel" });
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
const { canApprovalPotentiallyRouteToChannel: canApprovalPotentiallyRouteToSlack, isSessionApprovalEligible: isForwardedSlackSessionApprovalEligible, isExplicitTargetEligible: isForwardedSlackExplicitTargetEligible } = createNativeApprovalChannelRouteGatesAsync({
	channel: "slack",
	defaultForwardingMode: "session",
	isTransportEnabled: isSlackApprovalTransportEnabled,
	listAccountIds: listSlackAccountIds,
	resolveDefaultAccountId: resolveDefaultSlackAccountId,
	normalizeForwardTarget: normalizeSlackForwardTarget,
	resolveTurnSourceTarget: resolveTurnSourceSlackOriginTarget,
	targetsMatch: slackTargetsMatch
});
function isSlackPluginNativeApprovalClientConfigEnabled(params) {
	const slackNativeConfig = resolveSlackAccount(params).config.execApprovals;
	const policy = params.cfg.approvals?.plugin?.slack;
	return (policy?.approvers?.length ?? 0) > 0 || Object.values(policy?.plugins ?? {}).some((plugin) => (plugin.approvers?.length ?? 0) > 0 || Object.values(plugin.tools ?? {}).some((tool) => tool.approvers.length > 0)) || isChannelExecApprovalClientEnabledFromConfig({
		enabled: slackNativeConfig?.enabled,
		approverCount: getSlackApprovalApprovers(params).length
	});
}
async function shouldHandleSlackViaNativeClientConfig(params) {
	if (!await doesApprovalRequestSelectChannelAccountAsync({
		...params,
		channel: "slack",
		defaultAccountId: resolveDefaultSlackAccountId(params.cfg),
		eligibleAccountIds: listSlackNativeApprovalEligibleAccountIds(params)
	})) return false;
	return isSlackNativeApprovalAccountEligible(params);
}
function isSlackNativeApprovalAccountEligible(params) {
	const config = resolveSlackAccount(params).config.execApprovals;
	const pluginRequest = params.approvalKind === "plugin" && isSlackPluginApprovalRequest(params.request) ? params.request : void 0;
	if (params.approvalKind === "plugin" && !pluginRequest) return false;
	const approverCount = params.approvalKind === "exec" ? getSlackExecApprovalApprovers(params).length : getSlackApprovalApproversForTeam({
		cfg: params.cfg,
		accountId: params.accountId,
		teamId: resolveSlackApprovalTeamId(params),
		...pluginRequest ? { request: pluginRequest } : {}
	}).length;
	const selectedPolicy = pluginRequest ? resolvePluginApprovalSlackApprovers(params.cfg, pluginRequest) : void 0;
	return isSlackApprovalTransportEnabled(params) && (selectedPolicy !== void 0 ? approverCount > 0 : isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	}));
}
function listSlackNativeApprovalEligibleAccountIds(params) {
	if (params.approvalKind === "plugin") return listSlackAccountIds(params.cfg).filter((accountId) => isSlackNativeApprovalAccountEligible({
		...params,
		accountId
	}));
	const accountId = params.accountId ?? resolveDefaultSlackAccountId(params.cfg);
	return isSlackNativeApprovalAccountEligible({
		...params,
		accountId
	}) ? [accountId] : [];
}
async function shouldHandleSlackPluginViaForwardingSession(params) {
	return isForwardedSlackSessionApprovalEligible({
		...params,
		approvalKind: "plugin"
	});
}
function isSlackAnyNativeApprovalClientEnabled(params) {
	return isSlackExecApprovalClientEnabled(params) || isSlackPluginNativeApprovalClientConfigEnabled(params) || canApprovalPotentiallyRouteToSlack({
		...params,
		approvalKind: "plugin"
	});
}
async function shouldHandleSlackNativeApprovalRequest(params) {
	if (getSlackInstallationKind(resolveSlackAccount(params).accountId) === "enterprise" && !resolveSlackApprovalOriginTeamId(params.request)) return false;
	const approvalKind = resolveApprovalKind(params.request, params.approvalKind);
	if (approvalKind === "plugin") {
		if (!isSlackPluginApprovalRequest(params.request)) return false;
		if (resolvePluginApprovalSlackApprovers(params.cfg, params.request) !== void 0) return shouldHandleSlackViaNativeClientConfig({
			...params,
			approvalKind
		});
		return await shouldHandleSlackViaNativeClientConfig({
			...params,
			approvalKind
		}) || await shouldHandleSlackPluginViaForwardingSession(params) || (params.cfg.approvals?.plugin?.targets ?? []).some((target) => isForwardedSlackExplicitTargetEligible({
			...params,
			approvalKind,
			target
		}));
	}
	const turnSourceChannel = normalizeMessageChannel(params.request.request.turnSourceChannel);
	if (turnSourceChannel && turnSourceChannel !== "slack") return false;
	return shouldHandleSlackViaNativeClientConfig({
		...params,
		approvalKind: "exec"
	});
}
// extensions/slack/src/monitor/mrkdwn.ts
function escapeSlackMrkdwn(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
// extensions/slack/src/format.ts
const SLACK_ANGLE_TOKEN_RE = /<[^>\n]+>/g;
function isAllowedSlackAngleToken(token) {
	const inner = token.slice(1, -1);
	return inner.startsWith("@") || inner.startsWith("#") || inner.startsWith("!") || inner.startsWith("mailto:") || inner.startsWith("tel:") || inner.startsWith("http://") || inner.startsWith("https://") || inner.startsWith("slack://");
}
function escapeSlackMrkdwnContent(text, mentions) {
	if (mentions === "escape") return escapeSlackMrkdwn(text);
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	const out = [];
	let lastIndex = 0;
	for (const match of text.matchAll(SLACK_ANGLE_TOKEN_RE)) {
		const matchIndex = match.index;
		out.push(escapeSlackMrkdwn(text.slice(lastIndex, matchIndex)));
		const token = match[0];
		const escapeControl = mentions === "escape-controls" && /^<[@#!]/u.test(token);
		out.push(isAllowedSlackAngleToken(token) && !escapeControl ? token : escapeSlackMrkdwn(token));
		lastIndex = matchIndex + token.length;
	}
	out.push(escapeSlackMrkdwn(text.slice(lastIndex)));
	return out.join("");
}
function escapeSlackMrkdwnText(text, mentions) {
	if (!text.includes("&") && !text.includes("<") && !text.includes(">")) return text;
	return text.split("\n").map((line) => {
		if (line.startsWith("> ")) return `> ${escapeSlackMrkdwnContent(line.slice(2), mentions)}`;
		return escapeSlackMrkdwnContent(line, mentions);
	}).join("\n");
}
function buildSlackLink(link, text) {
	const href = link.href.trim();
	if (!href || /^[@#!]/u.test(href)) return null;
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
	ir.styles = ir.styles.filter((span) => {
		if (span.style !== "italic" && span.style !== "bold") return true;
		return !isUnsafeSlackEmphasisBoundary(getCodePointBefore(ir.text, span.start)) && !isUnsafeSlackEmphasisBoundary(getCodePointAt(ir.text, span.end));
	});
	return ir;
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
function tokenizeSlackMrkdwn(text, graphemes) {
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
		const grapheme = graphemes?.containing(index + (codePoint > 65535 ? 1 : 0));
		const character = grapheme && text.slice(index, grapheme.index + grapheme.segment.length).match(/^[^`*_~<>&]+/u)?.[0] || String.fromCodePoint(codePoint);
		index += character.length;
		tokens.push(character);
	}
	return tokens;
}
function resolveSlackCodeMarkerTransition(active, token) {
	if ((token === "`" || token === "```") && (active === void 0 || active === token)) return active === token ? void 0 : token;
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
	const prefix = inner.charAt(0);
	if (prefix === "@" || prefix === "#" || prefix === "!") return prefix;
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
		blockquotePrefix: "> ",
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
	for (const token of tokenizeSlackMrkdwn(text, new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(text))) {
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
			if (activeMarker) {
				const fragments = chunkTextForOutbound(marker ? token : escapeSlackMrkdwn(token), Math.max(1, Math.floor(marker ? contentLimit : limit)), { preserveWhitespace: true });
				chunks.push(...marker ? fragments.map((fragment) => `${marker}${fragment}${marker}`) : fragments);
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
// extensions/slack/src/limits.ts
const SLACK_TEXT_LIMIT = 8e3;
const SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT = 4e3;
const SLACK_EDIT_TEXT_MAX_BYTES = 4e3;
const SLACK_MESSAGE_TEXT_HARD_LIMIT = 4e4;
// extensions/slack/src/presentation-fallback.ts
const SLACK_UNCOPYABLE_COMMAND_WARNING = "not copyable: contains backtick";
function escapeSlackPresentationFallbackBlock(block) {
	if (block.type === "chart") return {
		type: "text",
		text: renderSlackMessagePresentationChartFallbackText(block)
	};
	if (block.type === "table") return {
		type: "text",
		text: renderSlackMessagePresentationTableFallbackText(block)
	};
	if (block.type === "buttons") return {
		...block,
		buttons: block.buttons.map((button) => {
			const commandAction = button.action?.type === "command" ? button.action : void 0;
			const label = commandAction?.command.includes("`") ? `${button.label} [${SLACK_UNCOPYABLE_COMMAND_WARNING}]` : button.label;
			return {
				...button,
				label: escapeSlackMrkdwn(label),
				...button.value ? { value: escapeSlackMrkdwn(button.value) } : {},
				...button.url ? { url: escapeSlackMrkdwn(button.url) } : {},
				...button.webApp ? { webApp: { url: escapeSlackMrkdwn(button.webApp.url) } } : {},
				...button.web_app ? { web_app: { url: escapeSlackMrkdwn(button.web_app.url) } } : {},
				...commandAction ? { action: {
					...commandAction,
					command: commandAction.command.replaceAll("`", "[backtick]")
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
	return escapeSlackMrkdwn(renderMessagePresentationChartFallbackText(block));
}
function renderSlackMessagePresentationTableFallbackText(block) {
	return escapeSlackMrkdwn(renderMessagePresentationTableFallbackText(block));
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
const SLACK_BUTTON_VALUE_MAX = 2e3;
const SLACK_SECTION_TEXT_MAX = 3e3;
const SLACK_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: true,
	context: true,
	divider: true,
	charts: true,
	tables: true,
	limits: {
		actions: {
			maxActionsPerRow: 25,
			maxValueBytes: SLACK_BUTTON_VALUE_MAX,
			supportsStyles: true
		},
		selects: {
			maxOptions: 100,
			maxValueBytes: 150
		},
		text: {
			encoding: "characters",
			markdownDialect: "slack-mrkdwn",
			supportsEdit: true
		}
	}
};
// extensions/slack/src/rich-text.ts
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
		if (element.type === "text" && typeof element.text === "string") return literal(element.text);
		if (table) {
			const text = readNonBlankString(element.text);
			if (text) return text;
		}
		switch (element.type) {
			case "link": return literal(read(element.text) ?? read(element.url) ?? "");
			case "user": return formatReference(element.user_id, "<@", ">");
			case "channel": return formatReference(element.channel_id, "<#", ">");
			case "usergroup": return formatReference(element.usergroup_id, "<!subteam^", ">");
			case "broadcast": return formatReference(element.range, "<!", ">");
			case "emoji": {
				const name = read(element.name);
				return name ? `:${name}:` : "";
			}
			case "date": {
				const fallback = read(element.fallback);
				if (fallback) return literal(fallback);
				if (typeof element.timestamp !== "number") return "";
				const date = /* @__PURE__ */ new Date(element.timestamp * 1e3);
				return Number.isNaN(date.getTime()) ? "" : date.toISOString();
			}
			default: return "";
		}
	}).filter(Boolean).join(separator);
}
// extensions/slack/src/data-table.ts
const SLACK_DATA_TABLE_COLUMNS_MAX = 20;
const SLACK_DATA_TABLE_ROWS_MAX = 100;
const SLACK_DATA_TABLE_AGGREGATE_CELL_CHARACTERS_MAX = 1e4;
function countCharacters(value) {
	return Array.from(value).length;
}
function readSlackTableCell(value, mode) {
	const cell = asOptionalRecord(value);
	if (!cell) return;
	const basic = mode === "basic";
	let text;
	if (cell.type === "raw_text") text = cell.text;
	else if (cell.type === "raw_number") {
		if (basic && typeof cell.text === "string" && cell.text.length > 0) return cell.text;
		if (typeof cell.value === "number" && Number.isFinite(cell.value)) text = basic ? String(cell.value) : cell.text;
		else if (basic && typeof cell.value === "string") text = cell.value;
	} else if (cell.type === "rich_text" && mode !== "native-header") text = renderSlackRichText(cell.elements, "table", basic ? "\n" : "");
	return basic ? typeof text === "string" ? text : void 0 : readNonBlankString(text);
}
function parseSlackBasicTableRows(value) {
	const block = asOptionalRecord(value);
	if (block?.type !== "table" || !Array.isArray(block.rows)) return;
	if (block.rows.length < 1 || block.rows.length > SLACK_DATA_TABLE_ROWS_MAX) return;
	let characterCount = 0;
	const rows = [];
	for (const rawRow of block.rows) {
		if (!Array.isArray(rawRow) || rawRow.length < 1 || rawRow.length > SLACK_DATA_TABLE_COLUMNS_MAX) return;
		const row = rawRow.map((cell) => readSlackTableCell(cell, "basic") ?? "");
		characterCount += row.reduce((total, cell) => total + countCharacters(cell), 0);
		if (characterCount > 1e4) return;
		rows.push(row);
	}
	return rows.some((row) => row.some((cell) => cell.length > 0)) ? rows : void 0;
}
function parseSlackDataTable(value) {
	const block = asOptionalRecord(value);
	const caption = readNonBlankString(block?.caption);
	if (block?.type !== "data_table" || !caption || !Array.isArray(block.rows)) return;
	if (block.rows.length < 2) return;
	const rawHeader = block.rows[0];
	if (!Array.isArray(rawHeader) || rawHeader.length < 1) return;
	const headers = Array.from(rawHeader, (cell) => readSlackTableCell(cell, "native-header"));
	if (!headers.every((header) => Boolean(header))) return;
	const rows = block.rows.slice(1).map((rawRow) => {
		if (!Array.isArray(rawRow) || rawRow.length !== headers.length) return;
		const cells = rawRow.map((cell) => readSlackTableCell(cell, "native-cell"));
		return cells.every((cell) => Boolean(cell)) ? cells : void 0;
	});
	if (!rows.every((row) => Boolean(row))) return;
	return {
		caption,
		headers,
		rows
	};
}
function countSlackDataTableCellCharacters(value) {
	const parsed = parseSlackDataTable(value);
	if (!parsed || parsed.rows.length > SLACK_DATA_TABLE_ROWS_MAX || parsed.headers.length > SLACK_DATA_TABLE_COLUMNS_MAX) return;
	const cellCharacterCount = [...parsed.headers, ...parsed.rows.flat()].reduce((total, cell) => total + countCharacters(cell), 0);
	return cellCharacterCount > 1e4 ? void 0 : cellCharacterCount;
}
function countSlackDataTableBlocksCellCharacters(blocks) {
	let total = 0;
	for (const block of blocks ?? []) {
		if (asOptionalRecord(block)?.type !== "data_table") continue;
		const cellCharacterCount = countSlackDataTableCellCharacters(block);
		if (cellCharacterCount === void 0) return;
		total += cellCharacterCount;
	}
	return total;
}
function buildSlackDataTableBlock(block, options = {}) {
	const cellCharacterCountOffset = options.cellCharacterCountOffset ?? 0;
	if (!Number.isSafeInteger(cellCharacterCountOffset) || cellCharacterCountOffset < 0) return;
	if (block.caption.trim().length === 0 || block.headers.length < 1 || block.headers.length > SLACK_DATA_TABLE_COLUMNS_MAX || block.rows.length < 1 || block.rows.length > SLACK_DATA_TABLE_ROWS_MAX || new Set(block.headers).size !== block.headers.length || !block.headers.every((header) => header.trim().length > 0) || block.rowHeaderColumnIndex !== void 0 && (!Number.isInteger(block.rowHeaderColumnIndex) || block.rowHeaderColumnIndex < 0 || block.rowHeaderColumnIndex >= block.headers.length)) return;
	const rows = [Array.from(block.headers, (text) => ({
		type: "raw_text",
		text
	}))];
	for (const row of block.rows) {
		if (row.length !== block.headers.length) return;
		const cells = [];
		for (const cell of row) {
			if (typeof cell === "number") {
				if (!Number.isFinite(cell)) return;
				cells.push({
					type: "raw_number",
					value: cell,
					text: String(cell)
				});
				continue;
			}
			if (cell.trim().length === 0) return;
			cells.push({
				type: "raw_text",
				text: cell
			});
		}
		rows.push(cells);
	}
	if (cellCharacterCountOffset + rows.flat().reduce((total, cell) => total + countCharacters(cell.text), 0) > 1e4) return;
	return {
		type: "data_table",
		caption: block.caption,
		rows,
		...block.rowHeaderColumnIndex !== void 0 ? { row_header_column_index: block.rowHeaderColumnIndex } : {}
	};
}
function renderSlackDataTable(value, render, mrkdwnSafe = false) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_table") return;
	const parsed = parseSlackDataTable(block);
	if (parsed) return render({
		type: "table",
		caption: parsed.caption,
		headers: parsed.headers,
		rows: parsed.rows
	});
	const caption = readNonBlankString(block.caption)?.trim();
	return caption && mrkdwnSafe ? escapeSlackMrkdwn(caption) : caption;
}
function renderSlackDataTableFallbackText(value, mrkdwnSafe = false) {
	return renderSlackDataTable(value, mrkdwnSafe ? renderSlackMessagePresentationTableFallbackText : renderMessagePresentationTableFallbackText, mrkdwnSafe);
}
function escapeCompactFallbackCell(value) {
	return value.replaceAll("\\", "\\\\").replaceAll("	", "\\t").replaceAll("\r", "\\r").replaceAll("\n", "\\n");
}
/** Render Slack's inbound `table` block as ordered, delimiter-safe TSV. */
function renderSlackTableFallbackText(value, mrkdwnSafe = false) {
	return parseSlackBasicTableRows(value)?.map((row) => row.map((cell) => escapeCompactFallbackCell(mrkdwnSafe ? escapeSlackMrkdwn(cell) : cell)).join("	")).join("\n");
}
/** Render each native table cell once for bounded, formatting-disabled delivery. */
function renderSlackDataTableCompactPlainTextFallback(value) {
	return renderSlackDataTable(value, (table) => [
		`${escapeCompactFallbackCell(table.caption)} (table)`,
		table.headers.map(escapeCompactFallbackCell).join("	"),
		...table.rows.map((row) => row.map(escapeCompactFallbackCell).join("	"))
	].join("\n"));
}
// extensions/slack/src/data-visualization.ts
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
	return value.trim().length > 0 && Array.from(value).length <= maxLength;
}
function hasUniqueStrings(values) {
	return new Set(values).size === values.length;
}
function buildSlackDataVisualizationBlock(block) {
	if (!isStringWithin(block.title, SLACK_CHART_TITLE_MAX)) return;
	if (block.chartType === "pie") {
		if (block.segments.length < 1 || block.segments.length > SLACK_CHART_SERIES_MAX || !block.segments.every((segment) => isStringWithin(segment.label, SLACK_CHART_LABEL_MAX) && Number.isFinite(segment.value) && segment.value > 0)) return;
		return {
			type: "data_visualization",
			title: block.title,
			chart: {
				type: "pie",
				segments: block.segments
			}
		};
	}
	if (block.categories.length < 1 || block.categories.length > SLACK_CHART_DATA_POINTS_MAX || !block.categories.every((category) => isStringWithin(category, SLACK_CHART_LABEL_MAX)) || !hasUniqueStrings(block.categories) || block.series.length < 1 || block.series.length > SLACK_CHART_SERIES_MAX || !hasUniqueStrings(block.series.map((series) => series.name)) || block.xLabel !== void 0 && !isStringWithin(block.xLabel, SLACK_CHART_AXIS_LABEL_MAX) || block.yLabel !== void 0 && !isStringWithin(block.yLabel, SLACK_CHART_AXIS_LABEL_MAX) || !block.series.every((series) => isStringWithin(series.name, SLACK_CHART_LABEL_MAX) && series.values.length === block.categories.length && series.values.every((value) => Number.isFinite(value)))) return;
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
				categories: block.categories,
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
function parseSlackDataVisualizationBlock(block) {
	const title = block.title;
	const chart = asOptionalRecord(block.chart);
	if (typeof title !== "string" || !chart) return;
	if (chart.type === "pie") {
		if (!Array.isArray(chart.segments)) return;
		const segments = chart.segments.map(readSlackChartDatum);
		if (segments.some((segment) => !segment)) return;
		return {
			type: "chart",
			chartType: "pie",
			title,
			segments
		};
	}
	if (chart.type !== "bar" && chart.type !== "area" && chart.type !== "line") return;
	const axisConfig = asOptionalRecord(chart.axis_config);
	const categories = axisConfig?.categories;
	if (!isStringArray(categories)) return;
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
	return {
		type: "chart",
		chartType: chart.type,
		title,
		categories,
		series,
		xLabel: axisConfig?.x_label,
		yLabel: axisConfig?.y_label
	};
}
/** Extract an accessible summary, escaping mrkdwn control tokens when requested. */
function renderSlackDataVisualizationFallbackText(value, mrkdwnSafe = false) {
	const block = asOptionalRecord(value);
	if (block?.type !== "data_visualization") return;
	const parsed = normalizeMessagePresentation({ blocks: [parseSlackDataVisualizationBlock(block)] })?.blocks[0];
	if (parsed?.type === "chart") return mrkdwnSafe ? renderSlackMessagePresentationChartFallbackText(parsed) : renderMessagePresentationChartFallbackText(parsed);
	const title = typeof block.title === "string" ? block.title.trim() : "";
	return title ? mrkdwnSafe ? escapeSlackMrkdwn(title) : title : void 0;
}
// extensions/slack/src/blocks-fallback.ts
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
	const text = normalizeOptionalString(record?.text);
	if (!text) return;
	return record?.type === "plain_text" && options.nativeDataFormat !== "plain" ? escapeSlackMrkdwn(text) : text;
}
function readAltText(value) {
	const text = normalizeOptionalString(value);
	return text ? escapeSlackMrkdwn(text) : void 0;
}
function readControlElementText(value, options = {}) {
	const element = asOptionalRecord(value);
	const type = normalizeOptionalString(element?.type);
	if (type === "button" || type === "workflow_button") return normalizeOptionalString(element?.text) ?? readTextObject(element?.text, options);
	if (type && (SLACK_SELECT_ELEMENT_TYPES.has(type) || type === "overflow")) {
		if (!options.includeSelectOptions) return readTextObject(element?.placeholder, options);
		const choices = Array.isArray(element?.options) ? element.options : [];
		return [readTextObject(element?.placeholder, options), ...choices.map((choice) => readTextObject(asOptionalRecord(choice)?.text, options))].filter(Boolean).join("\n");
	}
}
/** Read only user-visible text from one Slack block. */
function renderSlackBlockFallbackText(raw, options = {}) {
	const block = asOptionalRecord(raw);
	if (!block) return;
	switch (block.type) {
		case "rich_text": return normalizeOptionalString(renderSlackRichText(block.elements, options.nativeReferenceFormat === "plain" ? "native-reference" : "escaped", "\n"));
		case "header": return readTextObject(block.text, options);
		case "section":
		case "context": {
			const context = block.type === "context";
			return (context ? (Array.isArray(block.elements) ? block.elements : []).map((element) => {
				const record = asOptionalRecord(element);
				return readTextObject(record, options) ?? readAltText(record?.alt_text);
			}) : [
				readTextObject(block.text, options),
				...Array.isArray(block.fields) ? block.fields.map((field) => readTextObject(field, options)) : [],
				readControlElementText(block.accessory, options)
			]).filter(Boolean).join(context ? " " : "\n") || void 0;
		}
		case "image": return readAltText(block.alt_text) ?? readTextObject(block.title) ?? "Shared an image";
		case "video": return readTextObject(block.title, options) ?? readAltText(block.alt_text) ?? "Shared a video";
		case "file": return "Shared a file";
		case "actions": {
			if (!Array.isArray(block.elements)) return;
			const labels = block.elements.map((value) => readControlElementText(value, options)).filter(Boolean);
			return [...new Set(labels)].join("\n") || void 0;
		}
		case "data_visualization": return renderSlackDataVisualizationFallbackText(block, options.nativeDataFormat !== "plain");
		case "data_table": return renderSlackDataTableFallbackText(block, options.nativeDataFormat !== "plain");
		case "table": return renderSlackTableFallbackText(block, options.nativeDataFormat !== "plain");
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
// extensions/slack/src/blocks-input.ts
const SLACK_MAX_BLOCKS = 50;
function parseBlocksJson(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("blocks must be valid JSON");
	}
}
function validateSlackBlocksArray(raw) {
	if (!Array.isArray(raw)) throw new Error("blocks must be an array");
	if (raw.length === 0) throw new Error("blocks must contain at least one block");
	if (raw.length > 50) throw new Error(`blocks cannot exceed 50 items`);
	for (const block of raw) {
		if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("each block must be an object");
		const type = block.type;
		if (typeof type !== "string" || type.trim().length === 0) throw new Error("each block must include a non-empty string type");
	}
	return raw;
}
function parseSlackBlocksInput(raw) {
	if (raw == null) return;
	return validateSlackBlocksArray(typeof raw === "string" ? parseBlocksJson(raw) : raw);
}
// extensions/slack/src/approval-actions.ts
const SLACK_APPROVAL_VALUE_PREFIX = "openclaw:approval:v1:";
const SLACK_APPROVAL_HEADER_BLOCK_ID = "openclaw_approval_header";
function isApprovalDecision(value) {
	return value === "allow-once" || value === "allow-always" || value === "deny";
}
/** Encode portable approval facts without exposing a slash command to Slack callbacks. */
function encodeSlackApprovalAction(action) {
	const encode = (approvalId) => `${SLACK_APPROVAL_VALUE_PREFIX}${JSON.stringify({
		approvalId,
		approvalKind: action.approvalKind,
		decision: action.decision
	})}`;
	const exact = encode(action.approvalId);
	return exact.length <= 2e3 ? exact : encode(buildApprovalResolutionRef({
		approvalId: action.approvalId,
		approvalKind: action.approvalKind
	}));
}
/** Decode only the exact Slack-owned approval envelope. Malformed callbacks fail closed. */
function decodeSlackApprovalAction(value) {
	if (typeof value !== "string" || !value.startsWith(SLACK_APPROVAL_VALUE_PREFIX)) return null;
	try {
		const decoded = JSON.parse(value.slice(21));
		if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return null;
		const record = decoded;
		if (Object.keys(record).length !== 3 || typeof record.approvalId !== "string" || record.approvalId.length === 0 || record.approvalKind !== "exec" && record.approvalKind !== "plugin" && record.approvalKind !== "system-agent" || !isApprovalDecision(record.decision)) return null;
		return {
			type: "approval",
			approvalId: record.approvalId,
			approvalKind: record.approvalKind,
			decision: record.decision
		};
	} catch {
		return null;
	}
}
// extensions/slack/src/question-actions.ts
const SLACK_QUESTION_VALUE_PREFIX = "slq1:";
const QUESTION_RECORD_ID_PATTERN = /^ask_[a-f0-9]{32}$/u;
function encodeSlackQuestionAction(action) {
	if (!QUESTION_RECORD_ID_PATTERN.test(action.questionId) || !Number.isInteger(action.optionIndex) || action.optionIndex < 0 || action.optionIndex > 3) return;
	return `${SLACK_QUESTION_VALUE_PREFIX}${action.questionId}:${action.optionIndex}`;
}
function decodeSlackQuestionAction(value) {
	if (typeof value !== "string" || value.length > 2e3) return null;
	const match = /^slq1:(ask_[a-f0-9]{32}):([0-3])$/u.exec(value);
	return match?.[1] && match[2] ? {
		questionId: match[1],
		optionIndex: Number(match[2])
	} : null;
}
async function resolveSlackQuestionAction(params) {
	let result;
	try {
		result = await questionGatewayRuntime.resolveOption({
			cfg: params.cfg,
			questionId: params.action.questionId,
			optionIndex: params.action.optionIndex,
			senderId: params.userId,
			clientDisplayName: `Slack question (${params.accountId})`
		});
	} catch {
		await params.respond("Could not submit this answer.").catch(() => {});
		return;
	}
	await params.respond(result.status === "answered" ? "Answer submitted." : "This question was already answered.").catch(() => {});
}
// extensions/slack/src/reply-action-ids.ts
const SLACK_REPLY_BUTTON_ACTION_ID = "openclaw:reply_button";
const SLACK_REPLY_LINK_ACTION_ID = "openclaw:reply_link";
const SLACK_SESSION_LINK_ACTION_ID = "openclaw:session_link";
const SLACK_REPLY_SELECT_ACTION_ID = "openclaw:reply_select";
const SLACK_BUTTON_ACTION_IDS = {
	approval: "openclaw:approval_button",
	callback: "openclaw:callback_button",
	link: SLACK_REPLY_LINK_ACTION_ID,
	question: "openclaw:question_button",
	reply: SLACK_REPLY_BUTTON_ACTION_ID
};
const SLACK_SELECT_ACTION_IDS = {
	approval: "openclaw:approval_select",
	callback: "openclaw:callback_select",
	reply: SLACK_REPLY_SELECT_ACTION_ID
};
const SLACK_QUESTION_FINALIZATION_BLOCKS = Symbol("slackQuestionFinalizationBlocks");
function createSlackActionIdMatcher(...prefixes) {
	return (actionId) => prefixes.some((prefix) => actionId === prefix || actionId.startsWith(`${prefix}:`));
}
const isSlackQuestionActionId = createSlackActionIdMatcher(SLACK_BUTTON_ACTION_IDS.question);
const isSlackApprovalActionId = createSlackActionIdMatcher(SLACK_BUTTON_ACTION_IDS.approval, SLACK_SELECT_ACTION_IDS.approval);
const isSlackCallbackActionId = createSlackActionIdMatcher(SLACK_BUTTON_ACTION_IDS.callback, SLACK_SELECT_ACTION_IDS.callback);
function isSlackQuestionActionForQuestion(action, questionId) {
	return Boolean(action.action_id && isSlackQuestionActionId(action.action_id) && decodeSlackQuestionAction(action.value)?.questionId === questionId);
}
/** Read only question control identities from the blocks actually sent to Slack. */
function resolveSlackQuestionActionIds(blocks, questionId) {
	return (blocks ?? []).flatMap((block) => {
		if (block.type !== "actions") return [];
		return (block.elements ?? []).flatMap((element) => element.action_id && (questionId ? isSlackQuestionActionForQuestion(element, questionId) : isSlackQuestionActionId(element.action_id)) ? [element.action_id] : []);
	});
}
// extensions/slack/src/truncate.ts
function truncateSlackText(value, max, whitespace = "trim") {
	const text = whitespace === "preserve" ? value : value.trim();
	if (text.length <= max) return text;
	if (max <= 1) return sliceUtf16Safe(text, 0, max);
	return truncateWithMarker(text, max, {
		marker: "…",
		reserve: 1,
		trimEnd: false
	});
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
	const prefix = truncateUtf8Prefix(trimmed, prefixBudget);
	return maxBytes >= suffixBytes ? `${prefix}${suffix}` : prefix;
}
// extensions/slack/src/native-data-blocks.ts
const SLACK_MALFORMED_NATIVE_DATA_FALLBACK = "Slack could not render this chart or table data.";
const SLACK_RESPONSE_URL_BODY_LIMIT_BYTES = 16384;
const SLACK_RESPONSE_URL_BODY_TIMEOUT_MS = 3e4;
function isSlackNativeDataBlock(block) {
	const type = asOptionalRecord(block)?.type;
	return type === "data_table" || type === "data_visualization";
}
function hasSlackNativeDataBlock(blocks) {
	return blocks?.some(isSlackNativeDataBlock) ?? false;
}
/** Keep every sibling block while removing Slack's native data blocks. */
function stripSlackNativeDataBlocks(blocks) {
	return (blocks ?? []).filter((block) => !isSlackNativeDataBlock(block));
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
function appendSlackBlockFallback(text, blocks, render) {
	const consumeFromBase = createSlackNativeDataBaseTextConsumer(text);
	const parts = [text];
	for (const block of blocks ?? []) {
		const dataText = render(block);
		if (!dataText) continue;
		if (isSlackNativeDataBlock(block) && consumeFromBase(dataText)) continue;
		parts.push(dataText);
	}
	return parts.filter((part) => part.trim()).join("\n\n");
}
function renderSlackNativeDataPlainTextBlock(value) {
	const type = asOptionalRecord(value)?.type;
	if (type === "data_table") return renderSlackDataTableCompactPlainTextFallback(value);
	if (type === "data_visualization") return renderSlackDataVisualizationFallbackText(value);
}
/** Build formatting-disabled accessibility text from actual Slack block order. */
function buildSlackNativeDataAccessibilityText(text, blocks) {
	return appendSlackBlockFallback(text, blocks, (block) => renderSlackNativeDataPlainTextBlock(block) ?? renderSlackBlockFallbackText(block, {
		nativeDataFormat: "plain",
		includeSelectOptions: true
	}) ?? (isSlackNativeDataBlock(block) ? "Slack could not render this chart or table data." : void 0));
}
/** Preserve every native data block's content once when Slack requires a text-only retry. */
function appendSlackNativeDataFallbackText(text, blocks) {
	return appendSlackBlockFallback(text.trim(), blocks, (block) => isSlackNativeDataBlock(block) ? renderSlackBlockFallbackText(block) : void 0);
}
/** Build a bounded plain-text retry without activating control tokens. */
function appendSlackNativeDataPlainTextFallback(text, blocks) {
	return appendSlackBlockFallback(text.trim(), blocks, renderSlackNativeDataPlainTextBlock);
}
// extensions/slack/src/detached-target-admission.ts
function assertSlackDetachedTargetAllowed(accountId, teamId) {
	const installationKind = getSlackInstallationKind(accountId);
	if (installationKind && installationKind !== "workspace" && !teamId) throw new Error("unsupported_enterprise_slack_delivery: detached Slack operations require team:<team-id>:channel:<channel-id> or team:<team-id>:user:<user-id> until a workspace install is authenticated");
}
// extensions/slack/src/conversation-binding-route.ts
const slackConversationBindings = {
	prepareFork: async (params) => (await import("./fork-DTKBA8Fm.mjs")).prepareSlackFork(params),
	isCurrentConversationBindingSupported: ({ accountId }) => isSlackWorkspaceInstallation(accountId)
};
const slackRouteBindingConfigCache = /* @__PURE__ */ new WeakMap();
function normalizeSlackRouteBindingPeer(peer) {
	const rawId = peer.id.trim();
	if (!rawId || rawId === "*") return peer;
	try {
		const target = parseSlackTarget(rawId, { defaultKind: peer.kind === "direct" ? "user" : "channel" });
		if (!target || target.kind === "user" !== (peer.kind === "direct")) return peer;
		const normalizedId = target.teamId ? `team:${target.teamId}:${target.kind}:${target.id}` : target.id;
		return normalizedId === peer.id ? peer : {
			...peer,
			id: normalizedId
		};
	} catch {
		return peer;
	}
}
function normalizeSlackRouteBindingConfig(cfg) {
	const bindings = cfg.bindings;
	const cached = slackRouteBindingConfigCache.get(cfg);
	if (cached && cached.bindingsRef === bindings) return cached.normalizedCfg;
	if (!bindings) return cfg;
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
	const { resolveRoute } = params;
	const resolveRuntime = (input, role) => inspectRuntimeConversationBindingRoute({
		...input,
		inspection: params.inspections[role]
	});
	let baseRuntimeRoute;
	const resolveBaseRoute = (threadInspection) => baseRuntimeRoute ??= resolveRuntime({
		resolveRoute: threadInspection ? (selection) => inspectRuntimeConversationBindingRoute({
			route: resolveRoute(selection),
			inspection: threadInspection
		}).route : resolveRoute,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.baseConversationId
		}
	}, "base");
	const boundThreadRoute = params.bindingsEnabled && params.runtimeBindingThreadId ? resolveRuntime({
		resolveRoute: (selection) => selection.bindingRecord || !selection.bindingOwnerAvailable ? resolveRoute(selection) : resolveBaseRoute(selection.inspection).route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.runtimeBindingThreadId,
			parentConversationId: params.baseConversationId
		}
	}, "thread") : null;
	return applySlackConfiguredBindingRoute(params, !params.bindingsEnabled ? resolveUnboundSlackRoute(params) : boundThreadRoute && (boundThreadRoute.bindingRecord || boundThreadRoute.bindingOwnerAvailable === false) ? boundThreadRoute : resolveBaseRoute());
}
async function resolveSlackConversationBindingRouteAsync(params) {
	if (!params.bindingsEnabled) return applySlackConfiguredBindingRoute(params, resolveUnboundSlackRoute(params));
	let baseRuntimeRoute;
	const resolveBaseRoute = (threadInspection) => baseRuntimeRoute ??= resolveRuntimeConversationBindingRouteAsync({
		resolveRoute: threadInspection ? (selection) => inspectRuntimeConversationBindingRoute({
			route: params.resolveRoute(selection),
			inspection: threadInspection
		}).route : params.resolveRoute,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.baseConversationId
		}
	});
	const boundThreadRoute = params.runtimeBindingThreadId ? await resolveRuntimeConversationBindingRouteAsync({
		resolveRoute: async (selection) => selection.bindingRecord || !selection.bindingOwnerAvailable ? params.resolveRoute(selection) : (await resolveBaseRoute(selection.inspection)).route,
		touchBinding: params.touchBinding,
		conversation: {
			channel: "slack",
			accountId: params.accountId,
			conversationId: params.runtimeBindingThreadId,
			parentConversationId: params.baseConversationId
		}
	}) : null;
	return applySlackConfiguredBindingRoute(params, boundThreadRoute && (boundThreadRoute.bindingRecord || boundThreadRoute.bindingOwnerAvailable === false) ? boundThreadRoute : await resolveBaseRoute());
}
function resolveUnboundSlackRoute(params) {
	return {
		bindingOwnerAvailable: true,
		route: params.resolveRoute({
			inspection: {
				status: "available",
				binding: null
			},
			bindingOwnerAvailable: true,
			bindingRecord: null
		}),
		bindingRecord: null,
		boundSessionKey: void 0
	};
}
function applySlackConfiguredBindingRoute(params, runtimeRoute) {
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
// extensions/slack/src/monitor/workspace-routing.ts
function resolveSlackAgentRoute(params) {
	const route = resolveAgentRoute({
		cfg: params.cfg,
		defaultAgentId: params.defaultAgentId,
		channel: "slack",
		accountId: params.accountId,
		teamId: params.teamId,
		peer: {
			kind: params.peer.kind,
			id: qualifySlackRoutePeerId({
				id: params.peer.id,
				kind: params.peer.kind === "direct" ? "user" : "channel",
				eventScope: params.eventScope
			})
		}
	});
	if (!params.eventScope || params.peer.kind !== "direct" || route.dmScope !== "main") return route;
	const accountId = encodeURIComponent(params.accountId).toLowerCase();
	const teamId = encodeURIComponent(params.eventScope.teamId).toLowerCase();
	const sessionKey = `${route.sessionKey}:account:${accountId}:team:${teamId}`;
	return {
		...route,
		sessionKey,
		mainSessionKey: sessionKey
	};
}
function qualifySlackRoutePeerId(params) {
	if (!params.eventScope) return params.id;
	return `team:${encodeURIComponent(params.eventScope.teamId)}:${params.kind}:${encodeURIComponent(params.id)}`;
}
function qualifySlackConversationId(conversationId, eventScope) {
	return eventScope ? `team:${encodeURIComponent(eventScope.teamId)}:${conversationId}` : conversationId;
}
// extensions/slack/src/errors.ts
const NO_ERROR_DETAIL = "no error detail";
const MAX_ERROR_CAUSE_DEPTH = 32;
function getSlackWebApiErrorData(error) {
	if (!(error instanceof Error)) return;
	const data = error.data;
	return data && typeof data === "object" ? data : void 0;
}
function enrichSlackWebApiError(err) {
	if (!(err instanceof Error)) return err;
	const data = getSlackWebApiErrorData(err);
	const code = normalizeOptionalString(data?.error);
	if (!code) return err;
	const details = [];
	const needed = normalizeOptionalString(data?.needed);
	if (needed) details.push(`needed: ${needed}`);
	const scopes = normalizeTrimmedStringList(data?.response_metadata?.scopes);
	if (scopes.length) details.push(`granted: ${scopes.join(", ")}`);
	const acceptedScopes = normalizeTrimmedStringList(data?.response_metadata?.acceptedScopes);
	if (acceptedScopes.length) details.push(`accepted: ${acceptedScopes.join(", ")}`);
	const message = `${err.message || `An API error occurred: ${code}`}${details.length ? ` (${details.join("; ")})` : ""}`;
	return message === err.message ? err : new Error(message);
}
function addStringDetail(details, label, value) {
	if (typeof value !== "string") return;
	const trimmed = redactSensitiveText(value.trim());
	if (trimmed) details.push(label ? `${label}: ${trimmed}` : trimmed);
}
function addScalarDetail(details, label, value) {
	if (typeof value === "string") {
		addStringDetail(details, label, value);
		return;
	}
	if (typeof value === "number" || typeof value === "boolean") details.push(`${label}: ${String(value)}`);
}
function addStringListDetail(details, label, value) {
	if (!Array.isArray(value)) return;
	const entries = [];
	for (const entry of value) addStringDetail(entries, "", entry);
	if (entries.length) details.push(`${label}: ${entries.join(", ")}`);
}
function safeStringify(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const result = JSON.stringify(value, (_key, nested) => {
			if (typeof nested !== "object" || nested === null) return nested;
			if (seen.has(nested)) return "[Circular]";
			seen.add(nested);
			return nested;
		});
		return result ? redactSensitiveText(result) : void 0;
	} catch {
		return;
	}
}
function addSlackResponseMetadata(details, value) {
	if (!isRecord(value)) return;
	addStringListDetail(details, "scopes", value.scopes);
	addStringListDetail(details, "accepted", value.acceptedScopes);
	for (const [key, label] of [["messages", "slack message"], ["warnings", "slack warning"]]) {
		const entries = value[key];
		if (Array.isArray(entries)) for (const entry of entries) addStringDetail(details, label, entry);
	}
}
function addSlackDataDetails(details, value) {
	if (!isRecord(value)) return;
	addScalarDetail(details, "slack error", value.error);
	addScalarDetail(details, "needed", value.needed);
	addScalarDetail(details, "provided", value.provided);
	addSlackResponseMetadata(details, value.response_metadata);
}
function addRecordDetails(details, value) {
	addScalarDetail(details, "code", value.code);
	addScalarDetail(details, "status", value.status);
	addScalarDetail(details, "statusCode", value.statusCode);
	addScalarDetail(details, "statusMessage", value.statusMessage);
	addScalarDetail(details, "retryAfter", value.retryAfter);
	addScalarDetail(details, "errno", value.errno);
	addScalarDetail(details, "syscall", value.syscall);
	addScalarDetail(details, "hostname", value.hostname);
	addScalarDetail(details, "type", value.type);
	addStringDetail(details, "statusText", value.statusText);
	addStringDetail(details, "body", value.body);
	addSlackDataDetails(details, value.data);
	if (isRecord(value.response)) {
		addScalarDetail(details, "response status", value.response.status);
		addStringDetail(details, "response statusText", value.response.statusText);
		addSlackDataDetails(details, value.response.data);
	}
}
function collectSlackErrorDetails(error, seen) {
	const details = [];
	if (error === void 0 || error === null) return details;
	if (typeof error === "string") {
		addStringDetail(details, "", error);
		return details;
	}
	if (error instanceof Error) {
		addStringDetail(details, "", error.message || error.name);
		if (error.cause !== void 0) {
			const cause = formatSlackErrorWithCauses(error.cause, "", seen);
			if (cause) details.push(`cause: ${cause}`);
		}
	}
	if (isRecord(error)) addRecordDetails(details, error);
	return details;
}
function formatSlackErrorWithCauses(error, fallback, seen) {
	if (error instanceof Error) {
		if (seen.has(error)) return "[Circular]";
		if (seen.size >= MAX_ERROR_CAUSE_DEPTH) return "[Cause chain truncated]";
		seen.add(error);
	}
	const details = collectSlackErrorDetails(error, seen);
	if (details.length > 0) return details.join("; ");
	if (error === void 0 || error === null) return fallback;
	if (typeof error === "string" && !error.trim()) return fallback;
	return safeStringify(error) ?? fallback;
}
function formatSlackError(error, fallback = NO_ERROR_DETAIL) {
	return formatSlackErrorWithCauses(error, fallback, /* @__PURE__ */ new Set());
}
// extensions/slack/src/channel-policy-state.ts
const slackChannelPolicyBindings = resolveGlobalMap(Symbol.for("openclaw.slack.channel-policy-bindings"), "close-and-restart");
function setSlackChannelPolicyBindings(accountId, bindings) {
	slackChannelPolicyBindings.set(normalizeAccountId(accountId), new Map([...bindings].map(([key, id]) => [key, id.toUpperCase()])));
}
function getSlackChannelPolicyKeys(accountId, channelId) {
	const id = channelId?.trim().toUpperCase();
	if (!id) return [];
	return [...slackChannelPolicyBindings.get(normalizeAccountId(accountId)) ?? []].filter(([, resolvedId]) => resolvedId === id).map(([key]) => key);
}
// extensions/slack/src/group-policy.ts
function hasPotentialSlackNamedPolicy(params) {
	if (params.allowNameMatching !== true) return false;
	return Object.entries(params.channels ?? {}).some(([key, entry]) => {
		if (entry == null || key === "*") return false;
		const named = !/^(?:channel:)?[CDG][A-Z0-9]+$/i.test(key);
		const entryAllows = entry.enabled !== false;
		return named && (params.decision === "allow" ? entryAllows : !entryAllows);
	});
}
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
	const slack = mergeSlackAccountConfig(params.cfg, accountId);
	const channels = slack.channels;
	const channelName = slack.dangerouslyAllowNameMatching === true ? params.groupChannel?.replace(/^#/, "") : void 0;
	const allowUnscoped = getSlackInstallationKind(accountId) !== "enterprise";
	return buildSlackChannelPolicyScope({
		channels,
		candidates: buildChannelKeyCandidates(...buildSlackChannelIdCandidates(params.groupId, params.groupSpace, { allowUnscoped }), ...getSlackChannelPolicyKeys(accountId, params.groupId), channelName ? `#${channelName}` : void 0, channelName, normalizeHyphenSlug(channelName))
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
// extensions/slack/src/monitor/ingress-identity.ts
const SLACK_USER_NAME_KIND = "plugin:slack-user-name";
const SLACK_WORKSPACE_USER_ID_KIND = "plugin:slack-workspace-user-id";
function normalizeSlackUserId(raw) {
	const value = (raw ?? "").trim().toLowerCase();
	if (!value) return "";
	const mention = value.match(/^<@([a-z0-9_]+)>$/i);
	if (mention?.[1]) return mention[1];
	return value.replace(/^(slack:|user:)/, "");
}
function normalizeSlackWorkspaceUserEntry(entry) {
	const normalized = entry.trim().toLowerCase();
	if (!normalized) return null;
	try {
		const target = parseSlackTarget(normalized);
		if (target?.kind === "user" && target.teamId) return target.normalized;
	} catch {
		return null;
	}
	return null;
}
function normalizeSlackBareUserEntry(entry) {
	const normalized = entry.trim().toLowerCase();
	if (!normalized || normalizeSlackWorkspaceUserEntry(normalized)) return null;
	const userId = normalizeSlackUserId(normalized);
	return /^[ubw][a-z0-9_]+$/i.test(userId) ? userId : null;
}
function normalizeSlackStableEntry(entry) {
	return normalizeSlackBareUserEntry(entry) ?? normalizeSlackWorkspaceUserEntry(entry);
}
function normalizeSlackNameEntry(entry) {
	const normalized = entry.trim().toLowerCase();
	if (!normalized || normalizeSlackStableEntry(normalized)) return null;
	return normalized.replace(/^slack:/, "") || null;
}
function normalizeSlackNameSubject(value) {
	return value.trim().toLowerCase() || null;
}
function normalizeSlackNameSlugEntry(entry) {
	const name = normalizeSlackNameEntry(entry);
	if (!name) return null;
	return normalizeSlackSlug(name) || null;
}
const slackIngressIdentity = defineStableChannelIngressIdentity({
	resolveParticipant: (subject) => {
		const qualified = subject.aliases?.workspaceSenderId;
		if (typeof qualified !== "string") return;
		const normalized = normalizeSlackWorkspaceUserEntry(qualified);
		const target = normalized ? parseSlackTarget(normalized) : void 0;
		return target?.teamId ? {
			domain: target.teamId,
			idKind: target.id.startsWith("b") ? "bot-id" : "user-id",
			id: target.id
		} : void 0;
	},
	key: "senderId",
	kind: "stable-id",
	authentication: "asserted",
	normalizeEntry: normalizeSlackBareUserEntry,
	normalizeSubject: normalizeSlackUserId,
	sensitivity: "pii",
	aliases: [{
		key: "workspaceSenderId",
		kind: SLACK_WORKSPACE_USER_ID_KIND,
		authentication: "asserted",
		normalizeEntry: normalizeSlackWorkspaceUserEntry,
		normalizeSubject: normalizeSlackWorkspaceUserEntry,
		sensitivity: "pii"
	}, ...[["senderName", normalizeSlackNameEntry], ["senderNameSlug", normalizeSlackNameSlugEntry]].map(([key, normalizeEntry]) => ({
		key,
		kind: SLACK_USER_NAME_KIND,
		normalizeEntry,
		normalizeSubject: normalizeSlackNameSubject,
		authentication: "mutable",
		sensitivity: "pii"
	}))]
});
function createSlackIngressSubject(params) {
	const senderId = normalizeSlackUserId(params.senderId);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	const senderName = params.senderName?.trim().toLowerCase();
	const senderNameSlug = senderName ? normalizeSlackSlug(senderName) : void 0;
	return {
		stableId: params.senderId,
		authentication: {
			senderId: params.senderAuthentication ?? "asserted",
			workspaceSenderId: params.senderAuthentication ?? "asserted",
			senderName: "mutable",
			senderNameSlug: "mutable"
		},
		aliases: {
			workspaceSenderId: teamId && senderId ? `team:${teamId}:user:${senderId}` : void 0,
			senderName,
			senderNameSlug
		}
	};
}
// extensions/slack/src/session-status.ts
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
// extensions/slack/src/probe.ts
var probe_exports = /* @__PURE__ */ __exportAll({ probeSlack: () => probeSlack });
async function probeSlack(token, timeoutMs = 2500, opts) {
	const dispatcher = createSlackProbeDispatcher(timeoutMs);
	const client = createSlackReadClient(token, {
		rejectRateLimitedCalls: true,
		retryConfig: { retries: 0 },
		timeout: timeoutMs
	}, dispatcher);
	const probeResult = runChannelProbe(timeoutMs, async () => {
		const result = await client.auth.test();
		if (!result.ok) return {
			ok: false,
			status: 200,
			error: result.error ?? "unknown"
		};
		const userIdentity = opts?.identity === "user";
		let userId = result.user_id;
		if (userIdentity) {
			if (result.bot_id?.trim()) return {
				ok: false,
				status: 200,
				error: "Slack auth.test identified a bot token; user identity requires a user OAuth token"
			};
			userId = result.user_id?.trim();
			if (!userId) return {
				ok: false,
				status: 200,
				error: "Slack auth.test returned no human user_id for user identity"
			};
		}
		const warning = userIdentity ? void 0 : formatSlackBotTokenIdentityWarning({
			auth: result,
			accountId: opts?.accountId
		});
		const authIdentity = {
			id: userId,
			name: result.user
		};
		return {
			ok: true,
			status: 200,
			...userIdentity ? { user: authIdentity } : { bot: authIdentity },
			team: {
				id: result.team_id,
				name: result.team
			},
			...warning ? { warning } : {}
		};
	}, (error) => ({
		ok: false,
		status: typeof error.statusCode === "number" ? error.statusCode : null,
		error: formatSlackError(error)
	}));
	try {
		return await probeResult;
	} finally {
		await dispatcher.destroy().catch(() => void 0);
	}
}
export { encodeSlackQuestionAction as $, isSlackExecApprovalAuthorizedSender as $t, createSlackNativeDataBaseTextConsumer as A, isSlackPluginApprovalRequest as At, SLACK_BUTTON_ACTION_IDS as B, getSlackApprovalApproversForTeam as Bt, resolveSlackConversationBindingRouteAsync as C, SLACK_MESSAGE_TEXT_RECOMMENDED_LIMIT as Ct, appendSlackNativeDataFallbackText as D, normalizeSlackOutboundText as Dt, SLACK_MALFORMED_NATIVE_DATA_FALLBACK as E, markdownToSlackMrkdwnChunks as Et, renderSlackNativeDataPlainTextBlock as F, resolveSlackFallbackOriginTarget as Ft, SLACK_SELECT_ACTION_IDS as G, normalizeSlackSlug as Gt, SLACK_REPLY_BUTTON_ACTION_ID as H, resolveSlackApprovalTeamId as Ht, stripSlackNativeDataBlocks as I, resolveTurnSourceSlackOriginTarget as It, isSlackCallbackActionId as J, resolveSlackUserAllowed as Jt, SLACK_SESSION_LINK_ACTION_ID as K, resolveSlackAllowListMatch as Kt, countSlackTextUtf8Bytes as L, shouldHandleSlackNativeApprovalRequest as Lt, isSlackInvalidBlocksError as M, normalizeSlackOriginTarget as Mt, isSlackInvalidBlocksResponse as N, resolveSessionSlackOriginTarget as Nt, appendSlackNativeDataPlainTextFallback as O, escapeSlackMrkdwn as Ot, isSlackNativeResponseUrlRejection as P, resolveSlackApproverDmTargets as Pt, decodeSlackQuestionAction as Q, getSlackExecApprovalApprovers as Qt, truncateSlackText as R, shouldHandleSlackPluginViaForwardingSession as Rt, resolveSlackConversationBindingRoute as S, SLACK_MESSAGE_TEXT_HARD_LIMIT as St, assertSlackDetachedTargetAllowed as T, chunkSlackMrkdwnText as Tt, SLACK_REPLY_LINK_ACTION_ID as U, allowListMatches as Ut, SLACK_QUESTION_FINALIZATION_BLOCKS as V, isSlackPluginApprovalAuthorizedSender as Vt, SLACK_REPLY_SELECT_ACTION_ID as W, normalizeSlackAllowOwnerEntry as Wt, isSlackQuestionActionId as X, getSlackInstallationKind as Xt, isSlackQuestionActionForQuestion as Y, captureSlackWorkspaceInstallation as Yt, resolveSlackQuestionActionIds as Z, registerSlackInstallationState as Zt, getSlackWebApiErrorData as _, SLACK_PRESENTATION_CAPABILITIES as _t, SLACK_USER_NAME_KIND as a, SLACK_PRIVATE_ACTION_DELIVERY_RESULT as an, parseSlackBlocksInput as at, resolveSlackAgentRoute as b, renderSlackMessagePresentationFallbackText as bt, slackIngressIdentity as c, buildSlackCompleteBlocksFallbackText as ct, hasPotentialSlackNamedPolicy as d, hasSlackDataVisualizationBlock as dt, isSlackExecApprovalClientEnabled as en, resolveSlackQuestionAction as et, resolveSlackGroupRequireMention as f, SLACK_DATA_TABLE_AGGREGATE_CELL_CHARACTERS_MAX as ft, formatSlackError as g, SLACK_BUTTON_VALUE_MAX as gt, enrichSlackWebApiError as h, countSlackDataTableCellCharacters as ht, setSlackSessionStatus as i, resolvePluginApprovalSlackApprovers as in, SLACK_MAX_BLOCKS as it, hasSlackNativeDataBlock as j, normalizeSlackForwardTarget as jt, buildSlackNativeDataAccessibilityText as k, isSlackAnyNativeApprovalClientEnabled as kt, buildSlackChannelIdCandidates as l, renderSlackBlockFallbackText as lt, setSlackChannelPolicyBindings as m, countSlackDataTableBlocksCellCharacters as mt, probe_exports as n, resolveSlackExecApprovalTarget as nn, decodeSlackApprovalAction as nt, createSlackIngressSubject as o, resolveSlackAutoThreadId as on, validateSlackBlocksArray as ot, resolveSlackGroupToolPolicy as p, buildSlackDataTableBlock as pt, isSlackApprovalActionId as q, resolveSlackUserAllowListForTeam as qt, renameSlackSession as r, shouldSuppressLocalSlackExecApprovalPrompt as rn, encodeSlackApprovalAction as rt, normalizeSlackStableEntry as s, resolveSlackThreadTsFromContext as sn, buildSlackBlocksFallbackText as st, probeSlack as t, normalizeSlackApproverId as tn, SLACK_APPROVAL_HEADER_BLOCK_ID as tt, buildSlackChannelPolicyScope as u, buildSlackDataVisualizationBlock as ut, qualifySlackConversationId as v, SLACK_SECTION_TEXT_MAX as vt, slackConversationBindings as w, SLACK_TEXT_LIMIT as wt, normalizeSlackRouteBindingConfig as x, SLACK_EDIT_TEXT_MAX_BYTES as xt, qualifySlackRoutePeerId as y, renderSlackMessagePresentationChartFallbackText as yt, truncateSlackTextByUtf8Bytes as z, slackTargetsMatch as zt };

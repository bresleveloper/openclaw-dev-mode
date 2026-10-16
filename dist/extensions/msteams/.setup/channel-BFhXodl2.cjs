const require_rolldown_runtime = require("./rolldown-runtime-BloeesfJ.cjs");
require("../runtime-api.cjs");
const require_resolve_allowlist = require("./resolve-allowlist-Ct9yxQUw.cjs");
const require_directory_contract_api = require("../directory-contract-api.cjs");
const require_thread_session = require("./thread-session-ClI-lSyG.cjs");
const require_channel_setup = require("./channel.setup-ss0TO-ap.cjs");
let openclaw_plugin_sdk_approval_handler_adapter_runtime = require("openclaw/plugin-sdk/approval-handler-adapter-runtime");
let openclaw_plugin_sdk_channel_actions = require("openclaw/plugin-sdk/channel-actions");
let openclaw_plugin_sdk_channel_core = require("openclaw/plugin-sdk/channel-core");
let openclaw_plugin_sdk_channel_outbound = require("openclaw/plugin-sdk/channel-outbound");
let openclaw_plugin_sdk_channel_pairing = require("openclaw/plugin-sdk/channel-pairing");
let openclaw_plugin_sdk_channel_policy = require("openclaw/plugin-sdk/channel-policy");
let openclaw_plugin_sdk_channel_runtime_context = require("openclaw/plugin-sdk/channel-runtime-context");
let openclaw_plugin_sdk_directory_runtime = require("openclaw/plugin-sdk/directory-runtime");
let openclaw_plugin_sdk_interactive_runtime = require("openclaw/plugin-sdk/interactive-runtime");
let openclaw_plugin_sdk_lazy_runtime = require("openclaw/plugin-sdk/lazy-runtime");
let openclaw_plugin_sdk_status_helpers = require("openclaw/plugin-sdk/status-helpers");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_tool_results = require("openclaw/plugin-sdk/tool-results");
let typebox = require("typebox");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_text_chunking = require("openclaw/plugin-sdk/text-chunking");
let openclaw_plugin_sdk_reply_reference = require("openclaw/plugin-sdk/reply-reference");
let openclaw_plugin_sdk_approval_delivery_runtime = require("openclaw/plugin-sdk/approval-delivery-runtime");
let openclaw_plugin_sdk_approval_native_runtime = require("openclaw/plugin-sdk/approval-native-runtime");
let openclaw_plugin_sdk_channel_targets = require("openclaw/plugin-sdk/channel-targets");
let openclaw_plugin_sdk_dangerous_name_runtime = require("openclaw/plugin-sdk/dangerous-name-runtime");
let openclaw_plugin_sdk_runtime_group_policy = require("openclaw/plugin-sdk/runtime-group-policy");
let openclaw_plugin_sdk_channel_status = require("openclaw/plugin-sdk/channel-status");
//#region extensions/msteams/src/action-params.ts
/** Text and upload-source aliases shared by Teams message actions. */
function resolveActionContent(params) {
	return typeof params.text === "string" ? params.text : typeof params.content === "string" ? params.content : typeof params.message === "string" ? params.message : "";
}
function resolveActionUploadFilePath(params) {
	for (const key of [
		"filePath",
		"path",
		"media"
	]) if (typeof params[key] === "string") {
		const value = params[key];
		if (value.trim()) return value;
	}
}
//#endregion
//#region extensions/msteams/src/action-results.ts
function jsonActionResult(data, details = data) {
	return (0, openclaw_plugin_sdk_tool_results.textResult)(JSON.stringify(data), details);
}
function jsonMSTeamsActionResult(action, data = {}) {
	return jsonActionResult({
		channel: "msteams",
		action,
		...data
	});
}
function jsonMSTeamsOkActionResult(action, data = {}) {
	return jsonActionResult({
		ok: true,
		channel: "msteams",
		action,
		...data
	});
}
function jsonMSTeamsConversationResult(conversationId) {
	return jsonActionResult({
		ok: true,
		channel: "msteams",
		conversationId
	}, {
		ok: true,
		channel: "msteams"
	});
}
function actionError(message) {
	return {
		isError: true,
		...(0, openclaw_plugin_sdk_tool_results.textResult)(message, { error: message })
	};
}
//#endregion
//#region extensions/msteams/src/policy.ts
const teamScopeKey = (teamKey) => (0, openclaw_plugin_sdk_channel_policy.scopeKey)(["team", teamKey]);
const channelScopeKey = (teamKey, channelKey) => (0, openclaw_plugin_sdk_channel_policy.scopeKey)(["team", teamKey], ["channel", channelKey]);
function buildMSTeamsToolPolicyTree(teams) {
	const scopes = {};
	for (const [teamKey, team] of Object.entries(teams ?? {})) {
		scopes[teamScopeKey(teamKey)] = {
			tools: team.tools,
			toolsBySender: team.toolsBySender
		};
		for (const [channelKey, channel] of Object.entries(team.channels ?? {})) scopes[channelScopeKey(teamKey, channelKey)] = {
			tools: channel.tools,
			toolsBySender: channel.toolsBySender
		};
	}
	return { scopes };
}
function resolveMSTeamsToolPolicyScope(params) {
	const teams = params.cfg.teams ?? {};
	const tree = buildMSTeamsToolPolicyTree(teams);
	const teamMatch = (0, openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback)({
		entries: teams,
		keys: (0, openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates)(params.groupSpace?.trim()),
		wildcardKey: "*",
		normalizeKey: openclaw_plugin_sdk_channel_targets.normalizeChannelSlug
	});
	const matchedTeamKey = teamMatch.matchKey ?? teamMatch.key;
	if (teamMatch.entry && matchedTeamKey) {
		const channelMatch = (0, openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback)({
			entries: teamMatch.entry.channels ?? {},
			keys: (0, openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates)(params.groupId?.trim()),
			wildcardKey: "*",
			normalizeKey: openclaw_plugin_sdk_channel_targets.normalizeChannelSlug
		});
		const matchedChannelKey = channelMatch.matchKey ?? channelMatch.key;
		return {
			tree,
			path: [teamScopeKey(matchedTeamKey), ...channelMatch.entry && matchedChannelKey ? [channelScopeKey(matchedTeamKey, matchedChannelKey)] : []]
		};
	}
	return {
		tree,
		path: []
	};
}
function resolveMSTeamsCrossTeamScanScope(params) {
	const teams = params.cfg.teams ?? {};
	const tree = buildMSTeamsToolPolicyTree(teams);
	const groupId = params.groupId?.trim();
	if (!groupId) return {
		tree,
		path: []
	};
	const channelCandidates = (0, openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates)(groupId);
	for (const [teamKey, team] of Object.entries(teams)) {
		const channelMatch = (0, openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback)({
			entries: team.channels ?? {},
			keys: channelCandidates,
			wildcardKey: "*",
			normalizeKey: openclaw_plugin_sdk_channel_targets.normalizeChannelSlug
		});
		const matchedChannelKey = channelMatch.matchKey ?? channelMatch.key;
		if (channelMatch.entry && matchedChannelKey) return {
			tree,
			path: [teamScopeKey(teamKey), channelScopeKey(teamKey, matchedChannelKey)]
		};
	}
	return {
		tree,
		path: []
	};
}
function resolveMSTeamsRouteConfig(params) {
	const teamId = params.teamId?.trim();
	const teamName = params.teamName?.trim();
	const conversationId = params.conversationId?.trim();
	const channelName = params.channelName?.trim();
	const teams = params.cfg?.teams ?? {};
	const allowlistConfigured = Object.keys(teams).length > 0;
	const teamCandidates = (0, openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates)(teamId, params.allowNameMatching ? teamName : void 0, params.allowNameMatching && teamName ? (0, openclaw_plugin_sdk_channel_targets.normalizeChannelSlug)(teamName) : void 0);
	const teamMatch = (0, openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback)({
		entries: teams,
		keys: teamCandidates,
		wildcardKey: "*",
		normalizeKey: openclaw_plugin_sdk_channel_targets.normalizeChannelSlug
	});
	const teamConfig = teamMatch.entry;
	const channels = teamConfig?.channels ?? {};
	const channelAllowlistConfigured = Object.keys(channels).length > 0;
	const channelCandidates = (0, openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates)(conversationId, params.allowNameMatching ? channelName : void 0, params.allowNameMatching && channelName ? (0, openclaw_plugin_sdk_channel_targets.normalizeChannelSlug)(channelName) : void 0);
	const channelMatch = (0, openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback)({
		entries: channels,
		keys: channelCandidates,
		wildcardKey: "*",
		normalizeKey: openclaw_plugin_sdk_channel_targets.normalizeChannelSlug
	});
	const channelConfig = channelMatch.entry;
	return {
		teamConfig,
		channelConfig,
		allowlistConfigured,
		allowed: (0, openclaw_plugin_sdk_channel_targets.resolveNestedAllowlistDecision)({
			outerConfigured: allowlistConfigured,
			outerMatched: Boolean(teamConfig),
			innerConfigured: channelAllowlistConfigured,
			innerMatched: Boolean(channelConfig)
		}),
		teamKey: teamMatch.matchKey ?? teamMatch.key,
		channelKey: channelMatch.matchKey ?? channelMatch.key,
		channelMatchKey: channelMatch.matchKey,
		channelMatchSource: channelMatch.matchSource === "direct" || channelMatch.matchSource === "wildcard" ? channelMatch.matchSource : void 0
	};
}
function resolveMSTeamsGroupToolPolicy(params) {
	const cfg = params.cfg.channels?.msteams;
	if (!cfg) return;
	const scope = resolveMSTeamsToolPolicyScope({
		cfg,
		groupSpace: params.groupSpace,
		groupId: params.groupId
	});
	const senderScope = {
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	};
	const resolved = (0, openclaw_plugin_sdk_channel_policy.resolveScopeToolsPolicy)({
		...scope,
		...senderScope
	});
	if (resolved !== void 0) return resolved;
	if (scope.path.length > 1) return;
	const scanScope = resolveMSTeamsCrossTeamScanScope({
		cfg,
		groupId: params.groupId
	});
	return (0, openclaw_plugin_sdk_channel_policy.resolveScopeToolsPolicy)({
		...scanScope,
		...senderScope
	});
}
function resolveMSTeamsReplyPolicy(params) {
	if (params.isDirectMessage) return {
		requireMention: false,
		replyStyle: "thread"
	};
	const requireMention = params.channelConfig?.requireMention ?? params.teamConfig?.requireMention ?? params.globalConfig?.requireMention ?? true;
	const explicitReplyStyle = params.channelConfig?.replyStyle ?? params.teamConfig?.replyStyle ?? params.globalConfig?.replyStyle;
	const requireMentionInBotThreads = params.channelConfig?.requireMentionInBotThreads ?? params.teamConfig?.requireMentionInBotThreads ?? params.globalConfig?.requireMentionInBotThreads;
	return {
		requireMention,
		replyStyle: explicitReplyStyle ?? (requireMention ? "thread" : "top-level"),
		...requireMentionInBotThreads === void 0 ? {} : { requireMentionInBotThreads }
	};
}
//#endregion
//#region extensions/msteams/src/action-threading.ts
/** Normalize Teams conversation targets for equality (strips `conversation:` and `;messageid=`). */
function normalizeMSTeamsThreadingTarget(raw) {
	const value = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(raw);
	if (!value) return;
	return require_resolve_allowlist.normalizeMSTeamsConversationId((0, openclaw_plugin_sdk_channel_core.stripChannelTargetPrefix)(value, "conversation"));
}
function extractMSTeamsResultConversationId(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return;
	const direct = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(value.conversationId);
	if (direct) return direct;
	const receipt = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.receipt) ? value.receipt : void 0;
	if (!receipt) return;
	const candidates = [...Array.isArray(receipt.raw) ? receipt.raw : [], ...Array.isArray(receipt.parts) ? receipt.parts.map((part) => (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(part) ? part.raw : void 0) : []];
	for (const candidate of candidates) {
		if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(candidate)) continue;
		const conversationId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(candidate.conversationId);
		if (conversationId) return conversationId;
	}
}
/** Recover the actual Teams conversation resolved by a successful tool send. */
function extractMSTeamsToolSendResult(result) {
	const details = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(result) && (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(result.details) ? result.details : void 0;
	const conversationId = extractMSTeamsResultConversationId(details && (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(details.result) ? details.result : void 0);
	if (!conversationId) return null;
	const normalizedConversationId = require_resolve_allowlist.normalizeMSTeamsConversationId((0, openclaw_plugin_sdk_channel_core.stripChannelTargetPrefix)(conversationId, "conversation"));
	return normalizedConversationId ? { to: `conversation:${normalizedConversationId}` } : null;
}
function msteamsContextTargetsMatch(target, context) {
	const normalizedTarget = normalizeMSTeamsThreadingTarget(target);
	if (!normalizedTarget) return false;
	const currentChannel = normalizeMSTeamsThreadingTarget(context.currentChannelId);
	if (currentChannel && currentChannel === normalizedTarget) return true;
	const currentMessaging = normalizeMSTeamsThreadingTarget(context.currentMessagingTarget);
	return Boolean(currentMessaging && currentMessaging === normalizedTarget);
}
function resolveMSTeamsAutoThreadId(params) {
	const explicitThreadId = require_resolve_allowlist.extractMSTeamsConversationMessageId(params.to);
	if (explicitThreadId) return explicitThreadId;
	const context = params.toolContext;
	if (!context?.currentChannelId && !context?.currentMessagingTarget) return;
	if (!msteamsContextTargetsMatch(params.to, context)) return;
	const graphTarget = context.currentGraphChannelId ?? context.currentMessagingTarget;
	const { team, channel } = graphTarget ? require_resolve_allowlist.parseMSTeamsTeamChannelInput(graphTarget) : {
		team: void 0,
		channel: void 0
	};
	const routeConfig = resolveMSTeamsRouteConfig({
		cfg: params.cfg,
		teamId: team,
		conversationId: channel,
		allowNameMatching: false
	});
	const { replyStyle } = resolveMSTeamsReplyPolicy({
		isDirectMessage: false,
		globalConfig: params.cfg,
		teamConfig: routeConfig.teamConfig,
		channelConfig: routeConfig.channelConfig
	});
	if (replyStyle === "top-level") return;
	if (!context.currentThreadTs) return;
	if (context.replyToMode !== "all" && !(0, openclaw_plugin_sdk_reply_reference.isSingleUseReplyToMode)(context.replyToMode ?? "off")) return;
	if ((0, openclaw_plugin_sdk_reply_reference.isSingleUseReplyToMode)(context.replyToMode ?? "off") && context.hasRepliedRef?.value) return;
	return context.currentThreadTs;
}
//#endregion
//#region extensions/msteams/src/approval-native.ts
function isMSTeamsApprovalTransportEnabled(params) {
	if (params.accountId && (0, openclaw_plugin_sdk_account_id.normalizeAccountId)(params.accountId) !== openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID) return false;
	const account = require_channel_setup.resolveMSTeamsAccount(params.cfg);
	return account.enabled && account.configured && account.tokenStatus === "available";
}
const msTeamsMessagingTargetResolvers = (0, openclaw_plugin_sdk_approval_native_runtime.createNativeApprovalMessagingTargetResolvers)({
	channel: "msteams",
	normalizeTo: require_resolve_allowlist.normalizeMSTeamsMessagingTarget
});
const msTeamsApprovalTargetResolvers = {
	...msTeamsMessagingTargetResolvers,
	resolveTurnSourceTarget: (request) => {
		const target = msTeamsMessagingTargetResolvers.resolveTurnSourceTarget(request);
		return target ? {
			...target,
			threadId: request.request.turnSourceThreadId ?? null
		} : null;
	},
	resolveSessionTarget: (sessionTarget) => {
		const target = msTeamsMessagingTargetResolvers.resolveSessionTarget(sessionTarget);
		return target ? {
			...target,
			threadId: sessionTarget.threadId ?? null
		} : null;
	}
};
const msTeamsApprovalRouteGates = (0, openclaw_plugin_sdk_approval_native_runtime.createNativeApprovalChannelRouteGates)({
	channel: "msteams",
	defaultForwardingMode: "session",
	isTransportEnabled: isMSTeamsApprovalTransportEnabled,
	listAccountIds: require_channel_setup.msteamsConfigAdapter.listAccountIds,
	resolveDefaultAccountId: () => openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID,
	normalizeForwardTarget: msTeamsApprovalTargetResolvers.normalizeForwardTarget,
	resolveTurnSourceTarget: msTeamsApprovalTargetResolvers.resolveTurnSourceTarget
});
function isMSTeamsNativeApprovalClientEnabled(params) {
	return msTeamsApprovalRouteGates.canAnyApprovalPotentiallyRouteToChannel({
		...params,
		nativeSessionOnly: true
	}) && require_thread_session.getMSTeamsApprovalApprovers(params).length > 0;
}
function shouldHandleMSTeamsNativeApprovalRequest(params) {
	return msTeamsApprovalRouteGates.shouldHandleApprovalRequest(params) && require_thread_session.getMSTeamsApprovalApprovers(params).length > 0 && Boolean(msTeamsApprovalTargetResolvers.resolveTurnSourceTarget(params.request));
}
function shouldSuppressLocalMSTeamsExecApprovalPrompt(params) {
	return (0, openclaw_plugin_sdk_approval_native_runtime.shouldSuppressLocalNativeExecApprovalPrompt)({
		...params,
		isNativeDeliveryEnabled: isMSTeamsNativeApprovalClientEnabled
	});
}
const resolveMSTeamsOriginTarget = (0, openclaw_plugin_sdk_approval_native_runtime.createChannelNativeOriginTargetResolver)({
	channel: "msteams",
	shouldHandleRequest: shouldHandleMSTeamsNativeApprovalRequest,
	resolveTurnSourceTarget: msTeamsApprovalTargetResolvers.resolveTurnSourceTarget,
	resolveSessionTarget: msTeamsApprovalTargetResolvers.resolveSessionTarget,
	normalizeTarget: msTeamsApprovalTargetResolvers.normalizeTarget
});
const msTeamsLazyApprovalNativeRuntime = (0, openclaw_plugin_sdk_approval_handler_adapter_runtime.createLazyChannelApprovalNativeRuntimeAdapter)({
	capabilityBoundary: true,
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	isConfigured: ({ cfg, accountId }) => isMSTeamsNativeApprovalClientEnabled({
		cfg,
		accountId
	}),
	shouldHandle: ({ cfg, accountId, approvalKind, request }) => shouldHandleMSTeamsNativeApprovalRequest({
		cfg,
		accountId,
		approvalKind,
		request
	}),
	load: async () => {
		const { msTeamsApprovalNativeRuntime } = await Promise.resolve().then(() => require("./approval-handler.runtime-C-RJ3wXc.cjs"));
		return msTeamsApprovalNativeRuntime;
	}
});
const resolveMSTeamsApproverDmTargets = (0, openclaw_plugin_sdk_approval_native_runtime.createChannelApproverDmTargetResolver)({
	shouldHandleRequest: shouldHandleMSTeamsNativeApprovalRequest,
	resolveApprovers: require_thread_session.getMSTeamsApprovalApprovers,
	mapApprover: (approver, params) => ({
		to: `user:${approver}`,
		accountId: (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.accountId)
	})
});
const msTeamsApprovalCapability = {
	...(0, openclaw_plugin_sdk_approval_delivery_runtime.createApproverRestrictedNativeApprovalCapability)({
		channel: "msteams",
		channelLabel: "Microsoft Teams",
		describeExecApprovalSetup: () => "Approve it from the Web UI for now. Microsoft Teams supports native approvals when the bot is configured. Configure `channels.msteams.allowFrom` or `channels.msteams.defaultTo` with Microsoft Entra object ID approvers.",
		listAccountIds: require_channel_setup.msteamsConfigAdapter.listAccountIds,
		hasApprovers: ({ cfg, accountId }) => require_thread_session.getMSTeamsApprovalApprovers({
			cfg,
			accountId
		}).length > 0,
		isExecAuthorizedSender: ({ cfg, accountId, senderId }) => require_thread_session.msTeamsApprovalAuth.authorizeActorAction?.({
			cfg,
			accountId,
			senderId,
			action: "approve",
			approvalKind: "exec"
		})?.authorized ?? false,
		isPluginAuthorizedSender: ({ cfg, accountId, senderId }) => require_thread_session.msTeamsApprovalAuth.authorizeActorAction?.({
			cfg,
			accountId,
			senderId,
			action: "approve",
			approvalKind: "plugin"
		})?.authorized ?? false,
		isNativeDeliveryEnabled: isMSTeamsNativeApprovalClientEnabled,
		resolveNativeDeliveryMode: () => "channel",
		requireMatchingTurnSourceChannel: true,
		resolveSuppressionAccountId: ({ target, request }) => (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(target.accountId) ?? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(request.request.turnSourceAccountId),
		resolveOriginTarget: resolveMSTeamsOriginTarget,
		resolveApproverDmTargets: resolveMSTeamsApproverDmTargets,
		nativeRuntime: msTeamsLazyApprovalNativeRuntime
	}),
	authorizeActorAction: (params) => require_thread_session.msTeamsApprovalAuth.authorizeActorAction?.(params)
};
//#endregion
//#region src/gateway/gateway-http-route-contracts.ts
const GATEWAY_PROBE_ROUTES = /* @__PURE__ */ new Map([
	["/health", "live"],
	["/healthz", "live"],
	["/ready", "ready"],
	["/readyz", "ready"],
	["/startup", "startup"],
	["/startupz", "startup"]
]);
function classifyGatewayProbePath(pathname) {
	for (const [root, status] of GATEWAY_PROBE_ROUTES) {
		if (pathname === root) return status;
		if (pathname.startsWith(`${root}/`)) return "namespace";
	}
	return "outside";
}
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString$3(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString$3(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty$1(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region src/plugins/http-path-prefix.ts
function prefixMatchPath(pathname, prefix) {
	return pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}%`);
}
//#endregion
//#region src/gateway/security-path.ts
const MAX_PATH_DECODE_PASSES = 32;
function normalizePathSeparators(pathname) {
	const collapsed = pathname.replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed;
	return collapsed.replace(/\/+$/, "");
}
function resolveDotSegments(pathname) {
	try {
		return new URL(pathname, "http://localhost").pathname;
	} catch {
		return pathname;
	}
}
function normalizePathForSecurity(pathname) {
	return normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(resolveDotSegments(pathname))) || "/";
}
function buildCanonicalPathCandidates(pathname, maxDecodePasses = MAX_PATH_DECODE_PASSES) {
	const candidates = /* @__PURE__ */ new Set([normalizePathForSecurity(pathname)]);
	let decoded = pathname;
	let malformedEncoding = false;
	let decodePasses = 0;
	for (let pass = 0; pass < maxDecodePasses; pass++) {
		let nextDecoded;
		try {
			nextDecoded = decodeURIComponent(decoded);
		} catch {
			malformedEncoding = true;
			break;
		}
		if (nextDecoded === decoded) break;
		decodePasses += 1;
		decoded = nextDecoded;
		candidates.add(normalizePathForSecurity(decoded));
	}
	let decodePassLimitReached = false;
	if (!malformedEncoding) try {
		decodePassLimitReached = decodeURIComponent(decoded) !== decoded;
	} catch {
		malformedEncoding = true;
	}
	return {
		candidates: [...candidates],
		decodePasses,
		decodePassLimitReached,
		malformedEncoding
	};
}
function canonicalizePathForSecurity(pathname) {
	const { candidates, decodePasses, decodePassLimitReached, malformedEncoding } = buildCanonicalPathCandidates(pathname);
	return {
		canonicalPath: candidates[candidates.length - 1] ?? "/",
		candidates,
		decodePasses,
		decodePassLimitReached,
		malformedEncoding,
		rawNormalizedPath: normalizePathSeparators(normalizeLowercaseStringOrEmpty$1(pathname)) || "/"
	};
}
const PROTECTED_PLUGIN_ROUTE_PREFIXES = ["/api/channels"];
//#endregion
//#region src/gateway/server/plugins-http/path-context.ts
function normalizeProtectedPrefix(prefix) {
	const collapsed = normalizeLowercaseStringOrEmpty$1(prefix).replace(/\/{2,}/g, "/");
	if (collapsed.length <= 1) return collapsed || "/";
	return collapsed.replace(/\/+$/, "");
}
const NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES = PROTECTED_PLUGIN_ROUTE_PREFIXES.map(normalizeProtectedPrefix);
/** Returns true when any decoded path candidate targets a protected route. */
function isProtectedPluginRoutePathFromContext(context) {
	if (context.candidates.some((candidate) => NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(candidate, prefix)))) return true;
	if (context.decodePassLimitReached) return true;
	if (!context.malformedEncoding) return false;
	return NORMALIZED_PROTECTED_PLUGIN_ROUTE_PREFIXES.some((prefix) => prefixMatchPath(context.rawNormalizedPath, prefix));
}
/** Builds all security-relevant decoded path candidates for a request path. */
function resolvePluginRoutePathContext(pathname) {
	const canonical = canonicalizePathForSecurity(pathname);
	return {
		pathname,
		canonicalPath: canonical.canonicalPath,
		candidates: canonical.candidates,
		malformedEncoding: canonical.malformedEncoding,
		decodePassLimitReached: canonical.decodePassLimitReached,
		rawNormalizedPath: canonical.rawNormalizedPath
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/gateway-config-runtime
var gateway_config_runtime_exports = /* @__PURE__ */ require_rolldown_runtime.__exportAll({
	classifyGatewayProbePath: () => classifyGatewayProbePath,
	isProtectedPluginRoutePathFromContext: () => isProtectedPluginRoutePathFromContext,
	resolvePluginRoutePathContext: () => resolvePluginRoutePathContext
});
require_rolldown_runtime.__reExport(gateway_config_runtime_exports, require("openclaw/plugin-sdk/gateway-config-runtime"));
//#endregion
//#region extensions/msteams/src/webhook-route.ts
function resolveMSTeamsLegacyWebhook(config) {
	return config?.legacyWebhook || void 0;
}
function resolveMSTeamsWebhookPathIssue({ cfg, env }) {
	const channel = cfg.channels?.msteams;
	const path = channel?.webhook?.path || "/api/messages";
	const legacy = resolveMSTeamsLegacyWebhook(channel);
	const pathname = URL.parse(path, "http://localhost")?.pathname ?? path;
	const probe = classifyGatewayProbePath(pathname);
	const reason = isProtectedPluginRoutePathFromContext(resolvePluginRoutePathContext(pathname)) ? "requires Gateway authentication on the main HTTP listener" : probe !== "namespace" && probe !== "outside" ? "is reserved for Gateway probes" : /[:*{}\\]/.test(path) ? "uses Express pattern syntax that requires the compatibility listener" : void 0;
	if (!reason) return;
	return `Microsoft Teams webhook path ${path} ${reason}. Set channels.msteams.webhook.path to /api/messages and update the Azure Bot messaging endpoint or reverse-proxy upstream to Gateway port ${(0, gateway_config_runtime_exports.resolveGatewayPort)(cfg, env)}/api/messages; verify delivery before removing channels.msteams.legacyWebhook.` + (legacy ? ` Compatibility port ${legacy.port} continues serving the current path.` : " The compatibility listener is disabled, so this path cannot receive Teams callbacks.");
}
//#endregion
//#region extensions/msteams/src/doctor.ts
const isMSTeamsMutableAllowEntry = (0, openclaw_plugin_sdk_channel_policy.buildMutableAllowEntryDetector)({
	prefixes: ["msteams:", "user:"],
	stableIdPattern: /^[^\s@]+$/
});
const collectMSTeamsMutableAllowlistWarnings = (0, openclaw_plugin_sdk_channel_policy.createDangerousNameMatchingMutableAllowlistWarningCollector)({
	channel: "msteams",
	detector: isMSTeamsMutableAllowEntry,
	collectLists: (scope) => (0, openclaw_plugin_sdk_channel_policy.collectStandardAllowlistLists)(scope)
});
function runMSTeamsWebhookDoctorSequence({ cfg, env }) {
	const channel = cfg.channels?.msteams;
	if (!channel || channel.enabled === false) return {
		changeNotes: [],
		warningNotes: [],
		infoNotes: []
	};
	const pathIssue = resolveMSTeamsWebhookPathIssue({
		cfg,
		env
	});
	if (pathIssue) return {
		changeNotes: [],
		warningNotes: [pathIssue],
		infoNotes: []
	};
	const path = channel.webhook?.path || "/api/messages";
	const port = (0, gateway_config_runtime_exports.resolveGatewayPort)(cfg, env);
	const legacy = resolveMSTeamsLegacyWebhook(channel);
	return {
		changeNotes: [],
		warningNotes: [],
		infoNotes: [legacy ? `Microsoft Teams: compatibility port ${legacy.port} continues forwarding to Gateway route ${path}. To use only the Gateway listener, update the Azure Bot messaging endpoint or reverse-proxy upstream to Gateway port ${port}${path}, verify delivery, then remove the channels.msteams.legacyWebhook pin to close the old port.` : `Microsoft Teams webhooks use Gateway port ${port}${path}; no compatibility listener is configured. Point the Azure Bot messaging endpoint or reverse-proxy upstream to this route.`]
	};
}
const msteamsDoctor = {
	dmAllowFromMode: "topOnly",
	groupModel: "hybrid",
	groupAllowFromFallbackToAllowFrom: true,
	warnOnEmptyGroupSenderAllowlist: true,
	collectMutableAllowlistWarnings: collectMSTeamsMutableAllowlistWarnings,
	runConfigSequence: runMSTeamsWebhookDoctorSequence
};
//#endregion
//#region extensions/msteams/src/graph-action-context.ts
const MSTEAMS_GROUP_MANAGEMENT_ACTIONS = /* @__PURE__ */ new Set([
	"addParticipant",
	"removeParticipant",
	"renameGroup"
]);
function withMSTeamsGraphMutationCurrentness(handleAction) {
	return (ctx) => {
		if (ctx.action === "pin" || ctx.action === "unpin" || ctx.action === "react" || MSTEAMS_GROUP_MANAGEMENT_ACTIONS.has(ctx.action)) return require_resolve_allowlist.runWithMSTeamsGraphRequestCurrentness(ctx.assertDirectAdapterHandoff, () => handleAction(ctx));
		return handleAction(ctx);
	};
}
//#endregion
//#region extensions/msteams/src/presentation.ts
const MSTEAMS_PRESENTATION_CAPABILITIES = {
	supported: true,
	buttons: true,
	selects: false,
	context: true,
	divider: true,
	limits: {
		actions: {
			supportsStyles: false,
			supportsDisabled: false
		},
		text: { markdownDialect: "markdown" }
	}
};
function buildMSTeamsPresentationCard(params) {
	const body = [];
	const text = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.text);
	if (text) body.push({
		type: "TextBlock",
		text,
		wrap: true
	});
	const presentation = (0, openclaw_plugin_sdk_interactive_runtime.adaptMessagePresentationForChannel)({
		presentation: params.presentation,
		capabilities: MSTEAMS_PRESENTATION_CAPABILITIES
	});
	if (presentation.title) body.push({
		type: "TextBlock",
		text: presentation.title,
		weight: "Bolder",
		size: "Medium",
		wrap: true
	});
	const actions = [];
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			body.push({
				type: "TextBlock",
				text: block.text,
				wrap: true,
				...block.type === "context" ? {
					isSubtle: true,
					size: "Small"
				} : {}
			});
			continue;
		}
		if (block.type === "divider") {
			body.push({
				type: "TextBlock",
				text: "---",
				wrap: true,
				isSubtle: true
			});
			continue;
		}
		if (block.type === "buttons") for (const button of block.buttons) {
			const action = (0, openclaw_plugin_sdk_interactive_runtime.resolveMessagePresentationButtonAction)(button);
			if (action?.type === "url" || action?.type === "web-app") {
				const url = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(action.url);
				if (!url) continue;
				actions.push({
					type: "Action.OpenUrl",
					title: button.label,
					url
				});
				continue;
			}
			if (action?.type === "command") {
				actions.push({
					type: "Action.Submit",
					title: button.label,
					data: action.command
				});
				continue;
			}
			if (action?.type === "callback") actions.push({
				type: "Action.Submit",
				title: button.label,
				data: {
					value: action.value,
					label: button.label
				}
			});
		}
	}
	return {
		type: "AdaptiveCard",
		version: "1.4",
		body,
		...actions.length ? { actions } : {}
	};
}
//#endregion
//#region extensions/msteams/src/outbound-config.ts
const MSTEAMS_TEXT_CHUNK_LIMIT = 4e3;
function resolveMSTeamsEffectiveTextChunkLimit(configuredLimit) {
	return typeof configuredLimit === "number" && configuredLimit > 0 ? Math.min(configuredLimit, MSTEAMS_TEXT_CHUNK_LIMIT) : MSTEAMS_TEXT_CHUNK_LIMIT;
}
const msteamsOutboundConfig = {
	deliveryMode: "direct",
	chunker: openclaw_plugin_sdk_text_chunking.chunkTextForOutbound,
	chunkerMode: "markdown",
	textChunkLimit: MSTEAMS_TEXT_CHUNK_LIMIT,
	resolveEffectiveTextChunkLimit: ({ fallbackLimit }) => resolveMSTeamsEffectiveTextChunkLimit(fallbackLimit),
	pollMaxOptions: 12,
	deliveryCapabilities: { durableFinal: {
		text: true,
		media: true,
		payload: true,
		messageSendingHooks: true
	} },
	presentationCapabilities: MSTEAMS_PRESENTATION_CAPABILITIES
};
//#endregion
//#region extensions/msteams/src/read-policy.ts
function normalizeTarget(raw) {
	return raw ? require_resolve_allowlist.normalizeMSTeamsMessagingTarget(raw) ?? "" : "";
}
function sameAccount(ctx) {
	const requested = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.accountId) ?? "default";
	const requester = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.requesterAccountId);
	return requester !== void 0 && requester === requested;
}
function isCurrentMSTeamsReadTarget(params) {
	if ((0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.ctx.toolContext?.currentChannelProvider)?.toLowerCase() !== "msteams" || !sameAccount(params.ctx)) return false;
	const candidates = [
		params.ctx.toolContext?.currentChannelId,
		params.ctx.toolContext?.currentMessagingTarget,
		params.ctx.toolContext?.currentGraphChannelId
	];
	const target = normalizeTarget(params.target);
	return candidates.some((candidate) => normalizeTarget(candidate) === target);
}
function normalizeUserTarget(target) {
	return target.replace(/^user:/i, "").trim().toLowerCase();
}
function isStableUserId(value) {
	return /^[0-9a-f-]{16,}$/i.test(value);
}
async function resolveAllowedDmTarget(cfg, target) {
	const teams = cfg.channels?.msteams;
	if (teams?.dmPolicy === "disabled") return;
	const userId = normalizeUserTarget(target);
	if (!userId) return;
	const normalizedEntries = (teams?.allowFrom ?? []).map((entry) => normalizeUserTarget(entry.replace(/^(msteams|teams):/i, "")));
	const allowAll = (teams?.dmPolicy ?? "pairing") === "open" || normalizedEntries.includes("*");
	if (isStableUserId(userId)) return allowAll || normalizedEntries.some((entry) => entry === userId) ? `user:${userId}` : void 0;
	if (!(0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(teams)) return;
	try {
		const [resolvedTarget, ...resolvedEntries] = await require_resolve_allowlist.resolveMSTeamsUserAllowlist({
			cfg,
			entries: [userId, ...normalizedEntries.filter((entry) => entry !== "*")]
		});
		if (!resolvedTarget?.resolved || !resolvedTarget.id) return;
		return allowAll || resolvedEntries.some((entry) => entry.resolved && entry.id?.toLowerCase() === resolvedTarget.id?.toLowerCase()) ? `user:${resolvedTarget.id}` : void 0;
	} catch {
		return;
	}
}
async function resolveDirectDmTarget(cfg, target) {
	if (cfg.channels?.msteams?.dmPolicy === "disabled") return;
	const userId = normalizeUserTarget(target);
	if (!userId) return;
	if (isStableUserId(userId)) return `user:${userId}`;
	if (!(0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(cfg.channels?.msteams)) return;
	try {
		const [resolved] = await require_resolve_allowlist.resolveMSTeamsUserAllowlist({
			cfg,
			entries: [userId]
		});
		return resolved?.resolved && resolved.id ? `user:${resolved.id}` : void 0;
	} catch {
		return;
	}
}
function resolveMSTeamsReadGroupPolicy(cfg) {
	const teams = cfg.channels?.msteams;
	return teams ? teams.groupPolicy ?? (0, openclaw_plugin_sdk_runtime_group_policy.resolveDefaultGroupPolicy)(cfg) ?? "allowlist" : "disabled";
}
function isStableChannelKey(value) {
	return /^[0-9a-f-]{16,}$/i.test(value) || /^19:.+@thread\./i.test(value);
}
function isStableGraphTeamId(value) {
	return /^[0-9a-f-]{16,}$/i.test(value);
}
function isStableGraphChannelTarget(target) {
	const [teamId, channelId] = target.split("/", 2);
	return Boolean(teamId && channelId && isStableGraphTeamId(teamId) && isStableChannelKey(channelId));
}
function hasMutableChannelConfig(cfg) {
	const teams = cfg.channels?.msteams?.teams ?? {};
	return Object.entries(teams).some(([teamKey, teamConfig]) => {
		if (teamKey !== "*" && !isStableChannelKey(teamKey)) return true;
		return Object.keys(teamConfig?.channels ?? {}).some((channelKey) => channelKey !== "*" && !isStableChannelKey(channelKey));
	});
}
async function resolveConfiguredBotFrameworkTeamKey(cfg, graphTeamId) {
	const configuredTeams = cfg.channels?.msteams?.teams;
	if (!configuredTeams) return;
	const stableConfiguredKeys = Object.keys(configuredTeams).filter((teamKey) => teamKey !== "*" && /^19:.+@thread\./i.test(teamKey));
	if (stableConfiguredKeys.length === 0) return;
	const token = await require_resolve_allowlist.resolveGraphToken(cfg);
	const channelResult = await require_resolve_allowlist.listChannelsForTeamWithPageInfo(token, graphTeamId);
	if (channelResult.truncated) return;
	const channelIds = new Set(channelResult.items.map((channel) => channel.id?.trim()).filter((channelId) => Boolean(channelId)));
	const matches = stableConfiguredKeys.filter((teamKey) => channelIds.has(teamKey));
	return matches.length === 1 ? matches[0] : void 0;
}
async function resolveStableChannelTarget(cfg, target) {
	if (isStableGraphChannelTarget(target)) return target;
	if (!(0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(cfg.channels?.msteams)) return;
	try {
		const [resolved] = await require_resolve_allowlist.resolveMSTeamsChannelAllowlist({
			cfg,
			entries: [target]
		});
		return resolved?.resolved && resolved.graphTeamId && resolved.channelId ? `${resolved.graphTeamId}/${resolved.channelId}` : void 0;
	} catch {
		return;
	}
}
async function resolveAllowedChannelTarget(cfg, target) {
	const teams = cfg.channels?.msteams;
	const groupPolicy = resolveMSTeamsReadGroupPolicy(cfg);
	if (groupPolicy === "disabled") return;
	const [teamId, channelId] = target.split("/", 2);
	if (!teamId || !channelId) return;
	const directRoute = resolveMSTeamsRouteConfig({
		cfg: teams,
		teamId,
		teamName: teamId,
		conversationId: channelId,
		channelName: channelId,
		allowNameMatching: (0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(teams)
	});
	const stableTarget = await resolveStableChannelTarget(cfg, target);
	if (!directRoute.allowlistConfigured && groupPolicy !== "open" && stableTarget) throw new openclaw_plugin_sdk_channel_actions.ToolAuthorizationError("Microsoft Teams read target is not allowed. Configure channels.msteams.teams.<team>.channels for this channel, or deliberately set channels.msteams.groupPolicy to \"open\".");
	if (directRoute.allowed) return stableTarget;
	if (!stableTarget || !teams?.teams) return;
	const [stableTeamId, stableChannelId] = stableTarget.split("/", 2);
	if (!stableTeamId || !stableChannelId) return;
	try {
		const botFrameworkTeamKey = await resolveConfiguredBotFrameworkTeamKey(cfg, stableTeamId);
		if (botFrameworkTeamKey) {
			if (resolveMSTeamsRouteConfig({
				cfg: teams,
				teamId: botFrameworkTeamKey,
				conversationId: stableChannelId
			}).allowed) return stableTarget;
		}
		if (!hasMutableChannelConfig(cfg)) return;
		const resolved = await require_resolve_allowlist.resolveMSTeamsTeamsConfig({
			cfg,
			teamIdMode: "graph",
			teams: teams.teams
		});
		return resolveMSTeamsRouteConfig({
			cfg: {
				...teams,
				teams: resolved.teams
			},
			teamId: stableTeamId,
			conversationId: stableChannelId
		}).allowed ? stableTarget : void 0;
	} catch {
		return;
	}
}
function bothUnknownScopesAllowed(cfg) {
	const teams = cfg.channels?.msteams;
	return resolveMSTeamsReadGroupPolicy(cfg) === "open" && (teams?.dmPolicy ?? "pairing") === "open";
}
async function assertMSTeamsReadTargetAllowed(params) {
	const target = normalizeTarget(params.target);
	const isChannel = target.includes("/");
	const isDm = /^user:/i.test(target);
	const isChat = require_resolve_allowlist.looksLikeMSTeamsConversationId(target);
	const current = isCurrentMSTeamsReadTarget({
		ctx: params.ctx,
		target
	});
	const directOperator = params.ctx.conversationReadOrigin === "direct-operator";
	const currentChatType = params.ctx.toolContext?.currentChatType;
	const groupEnabled = resolveMSTeamsReadGroupPolicy(params.cfg) !== "disabled";
	const dmEnabled = params.cfg.channels?.msteams?.dmPolicy !== "disabled";
	const allowedTarget = directOperator ? isChannel ? groupEnabled ? await resolveStableChannelTarget(params.cfg, target) : void 0 : isDm ? await resolveDirectDmTarget(params.cfg, target) : isChat && groupEnabled && dmEnabled ? target : void 0 : current ? (isChannel ? groupEnabled : isDm || currentChatType === "direct" ? dmEnabled : currentChatType === "group" || currentChatType === "channel" ? groupEnabled : groupEnabled && dmEnabled) ? target : void 0 : isChannel ? await resolveAllowedChannelTarget(params.cfg, target) : isDm ? await resolveAllowedDmTarget(params.cfg, target) : isChat ? bothUnknownScopesAllowed(params.cfg) ? target : void 0 : false;
	if (!allowedTarget) throw new openclaw_plugin_sdk_channel_actions.ToolAuthorizationError("Microsoft Teams read target is not allowed.");
	return allowedTarget;
}
async function assertMSTeamsTeamEnumerationAllowed(params) {
	const teams = params.cfg.channels?.msteams;
	const groupPolicy = resolveMSTeamsReadGroupPolicy(params.cfg);
	if (groupPolicy === "disabled") throw new openclaw_plugin_sdk_channel_actions.ToolAuthorizationError("Microsoft Teams channel list is not allowed.");
	const directRoute = resolveMSTeamsRouteConfig({
		cfg: teams,
		teamId: params.teamId,
		teamName: params.teamId,
		conversationId: "__openclaw_all_channels__",
		allowNameMatching: (0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(teams)
	});
	const stableTeamId = isStableGraphTeamId(params.teamId) ? params.teamId : (0, openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled)(teams) ? (await require_resolve_allowlist.resolveMSTeamsChannelAllowlist({
		cfg: params.cfg,
		entries: [params.teamId]
	}))[0]?.graphTeamId : void 0;
	if (!stableTeamId) throw new openclaw_plugin_sdk_channel_actions.ToolAuthorizationError("Microsoft Teams channel list requires access to every channel in the team.");
	if (params.ctx?.conversationReadOrigin === "direct-operator") return stableTeamId;
	let allowed = directRoute.allowlistConfigured ? directRoute.allowed : groupPolicy === "open";
	if (!allowed && teams?.teams) try {
		const botFrameworkTeamKey = await resolveConfiguredBotFrameworkTeamKey(params.cfg, stableTeamId);
		if (botFrameworkTeamKey) allowed = resolveMSTeamsRouteConfig({
			cfg: teams,
			teamId: botFrameworkTeamKey,
			conversationId: "__openclaw_all_channels__"
		}).allowed;
		if (!allowed && hasMutableChannelConfig(params.cfg)) {
			const resolved = await require_resolve_allowlist.resolveMSTeamsTeamsConfig({
				cfg: params.cfg,
				teamIdMode: "graph",
				teams: teams.teams
			});
			allowed = resolveMSTeamsRouteConfig({
				cfg: {
					...teams,
					teams: resolved.teams
				},
				teamId: stableTeamId,
				conversationId: "__openclaw_all_channels__"
			}).allowed;
		}
	} catch {
		allowed = false;
	}
	if (!allowed) throw new openclaw_plugin_sdk_channel_actions.ToolAuthorizationError("Microsoft Teams channel list requires access to every channel in the team.");
	return stableTeamId;
}
//#endregion
//#region extensions/msteams/src/session-route.ts
function inferMSTeamsTargetChatType(raw) {
	const target = (0, openclaw_plugin_sdk_channel_core.stripChannelTargetPrefix)(raw, "msteams", "teams");
	if (!target) return;
	const lower = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeLowercaseStringOrEmpty)(target);
	const rawId = (0, openclaw_plugin_sdk_channel_core.stripTargetKindPrefix)(target);
	if (!rawId) return;
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawId);
	if (lower.startsWith("user:") || /^[0-9a-f-]{16,}$/i.test(conversationId)) return "direct";
	if (/@thread\.tacv2/i.test(conversationId)) return "channel";
	return /^19:.+@thread\.(?:skype|v2)$/i.test(conversationId) ? "group" : void 0;
}
function resolveMSTeamsOutboundSessionRoute(params) {
	const trimmed = (0, openclaw_plugin_sdk_channel_core.stripChannelTargetPrefix)(params.target, "msteams", "teams");
	if (!trimmed) return null;
	const resolvedKind = params.resolvedTarget?.kind;
	const targetChatType = inferMSTeamsTargetChatType(trimmed);
	const isUser = resolvedKind === "user" || targetChatType === "direct";
	const rawId = (0, openclaw_plugin_sdk_channel_core.stripTargetKindPrefix)(trimmed);
	if (!rawId) return null;
	const conversationId = require_resolve_allowlist.normalizeMSTeamsConversationId(rawId);
	const isChannel = !isUser && targetChatType === "channel";
	const embeddedThreadId = require_resolve_allowlist.extractMSTeamsConversationMessageId(rawId);
	const explicitThreadId = params.threadId ?? params.replyToId;
	const channelThreadId = embeddedThreadId ?? (explicitThreadId !== void 0 && explicitThreadId !== null ? String(explicitThreadId) : void 0);
	const isCanonicalUserId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId);
	const recipientSessionExact = isUser && isCanonicalUserId || (isChannel ? channelThreadId !== void 0 : resolvedKind === "group");
	const route = (0, openclaw_plugin_sdk_channel_core.buildChannelOutboundSessionRoute)({
		cfg: params.cfg,
		agentId: params.agentId,
		channel: "msteams",
		accountId: params.accountId,
		recipientSessionExact,
		peer: {
			kind: isUser ? "direct" : isChannel ? "channel" : "group",
			id: conversationId
		},
		chatType: isUser ? "direct" : isChannel ? "channel" : "group",
		from: isUser ? `msteams:${conversationId}` : isChannel ? `msteams:channel:${conversationId}` : `msteams:group:${conversationId}`,
		to: isUser ? `user:${conversationId}` : `conversation:${conversationId}`
	});
	return isChannel ? {
		...route,
		sessionKey: require_thread_session.resolveMSTeamsRouteSessionKey({
			baseSessionKey: route.baseSessionKey,
			isChannel: true,
			conversationMessageId: channelThreadId
		}),
		...channelThreadId !== void 0 ? { threadId: channelThreadId } : {}
	} : route;
}
//#endregion
//#region extensions/msteams/src/channel.ts
const TEAMS_GRAPH_PERMISSION_HINTS = {
	"ChannelMessage.Read.All": "channel history",
	"Chat.Read.All": "chat history",
	"Channel.ReadBasic.All": "channel list",
	"Team.ReadBasic.All": "team list",
	"TeamsActivity.Read.All": "teams activity",
	"Sites.Read.All": "files (SharePoint)",
	"Files.Read.All": "files (OneDrive)"
};
const collectMSTeamsSecurityWarnings = (0, openclaw_plugin_sdk_channel_policy.createAllowlistProviderGroupPolicyWarningCollector)({
	providerConfigPresent: (cfg) => cfg.channels?.msteams !== void 0,
	resolveGroupPolicy: ({ cfg }) => cfg.channels?.msteams?.groupPolicy,
	collect: ({ groupPolicy }) => groupPolicy === "open" ? ["- MS Teams groups: groupPolicy=\"open\" allows any member to trigger (mention-gated). Set channels.msteams.groupPolicy=\"allowlist\" + channels.msteams.groupAllowFrom to restrict senders."] : []
});
const collectMSTeamsSecurityFindings = openclaw_plugin_sdk_channel_policy.createConditionalWarningCollector.findings({
	collectWarnings: collectMSTeamsSecurityWarnings,
	checkId: "channels.msteams.groups.open",
	severity: "warn",
	title: "MS Teams security warning"
});
const loadMSTeamsChannelRuntime = (0, openclaw_plugin_sdk_lazy_runtime.createLazyRuntimeNamedExport)(() => Promise.resolve().then(() => require("./channel.runtime-D9jrw2SN.cjs")), "msTeamsChannelRuntime");
const MSTEAMS_REACTION_TYPES = [
	"like",
	"heart",
	"laugh",
	"surprised",
	"sad",
	"angry"
];
function requireMSTeamsGroupManagementAuthorization(ctx) {
	if (ctx.senderIsOwner === true || ctx.gatewayClientScopes?.includes("operator.admin")) return null;
	return actionError("Microsoft Teams group management requires an owner or operator.admin requester.");
}
function resolveActionTarget(params, currentChannelId) {
	return typeof params.to === "string" ? params.to.trim() : typeof params.target === "string" ? params.target.trim() : currentChannelId?.trim() ?? "";
}
function resolveGraphActionTarget(params, currentChannelId, currentGraphChannelId, currentChatType) {
	const explicitTarget = resolveActionTarget(params);
	const currentChannelTarget = currentChannelId?.trim();
	const currentGraphTarget = currentGraphChannelId?.trim();
	if (explicitTarget) {
		if (currentChatType === "channel" && currentGraphTarget && currentChannelTarget && msteamsContextTargetsMatch(require_resolve_allowlist.normalizeMSTeamsMessagingTarget(explicitTarget) ?? "", { currentChannelId: currentChannelTarget })) return currentGraphTarget;
		return explicitTarget;
	}
	if (currentGraphTarget) return currentGraphTarget;
	return currentChatType === "channel" ? "" : currentChannelTarget ?? "";
}
function resolveMSTeamsActionTarget(params) {
	return params.graphOnly ? resolveGraphActionTarget(params.toolParams, params.currentChannelId, params.currentGraphChannelId, params.currentChatType) : resolveActionTarget(params.toolParams, params.currentChannelId);
}
async function runWithRequiredActionTarget(params) {
	const to = resolveMSTeamsActionTarget(params);
	if (!to) return actionError(`${params.actionLabel} requires a target (to).`);
	return await params.run(to);
}
async function runWithRequiredActionMessageTarget(params) {
	const to = resolveMSTeamsActionTarget(params);
	const messageIdRaw = params.allowCurrentMessageIdFallback === true && msteamsContextTargetsMatch(to, {
		currentChannelId: params.currentChannelId ?? void 0,
		currentMessagingTarget: params.currentGraphChannelId ?? void 0
	}) ? (0, openclaw_plugin_sdk_channel_actions.resolveReactionMessageId)({
		args: params.toolParams,
		toolContext: { currentMessageId: params.currentMessageId ?? void 0 }
	}) : (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.toolParams.messageId) ?? "";
	const messageId = messageIdRaw == null ? "" : String(messageIdRaw).trim();
	if (!to || !messageId) return actionError(`${params.actionLabel} requires a target (to) and messageId.`);
	return await params.run({
		to,
		messageId
	});
}
async function runWithRequiredActionPinnedMessageTarget(params) {
	const to = resolveMSTeamsActionTarget(params);
	const pinnedMessageId = typeof params.toolParams.pinnedMessageId === "string" ? params.toolParams.pinnedMessageId.trim() : (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(params.toolParams.messageId) ?? "";
	if (!to || !pinnedMessageId) return actionError(`${params.actionLabel} requires a target (to) and pinnedMessageId.`);
	return await params.run({
		to,
		pinnedMessageId
	});
}
function describeMSTeamsMessageTool({ cfg }) {
	const account = require_channel_setup.resolveMSTeamsAccount(cfg);
	const enabled = account.enabled && account.configured && account.tokenStatus === "available";
	return {
		actions: enabled ? [
			"upload-file",
			"poll",
			"edit",
			"delete",
			"pin",
			"unpin",
			"list-pins",
			"read",
			"react",
			"reactions",
			"search",
			"member-info",
			"channel-list",
			"channel-info",
			"addParticipant",
			"removeParticipant",
			"renameGroup"
		] : [],
		capabilities: enabled ? ["presentation"] : [],
		schema: enabled ? {
			actions: ["unpin"],
			properties: { pinnedMessageId: typebox.Type.Optional(typebox.Type.String({ description: "Pinned message resource ID for unpin (from pin or list-pins, not the chat message ID)." })) }
		} : null
	};
}
const msteamsChannelOutbound = {
	...msteamsOutboundConfig,
	shouldSuppressLocalPayloadPrompt: ({ cfg, accountId, payload, hint }) => shouldSuppressLocalMSTeamsExecApprovalPrompt({
		cfg,
		accountId,
		payload,
		hint
	}),
	...(0, openclaw_plugin_sdk_channel_outbound.createRuntimeOutboundDelegates)({
		getRuntime: loadMSTeamsChannelRuntime,
		renderPresentation: { resolve: (runtime) => runtime.msteamsOutbound.renderPresentation },
		sendPayload: { resolve: (runtime) => runtime.msteamsOutbound.sendPayload },
		sendText: { resolve: (runtime) => runtime.msteamsOutbound.sendText },
		sendMedia: { resolve: (runtime) => runtime.msteamsOutbound.sendMedia },
		sendPoll: { resolve: (runtime) => runtime.msteamsOutbound.sendPoll }
	})
};
const msteamsMessageAdapter = (0, openclaw_plugin_sdk_channel_outbound.createChannelMessageAdapterFromOutbound)({
	id: "msteams",
	outbound: msteamsChannelOutbound,
	live: {
		capabilities: {
			draftPreview: true,
			previewFinalization: true,
			progressUpdates: true,
			nativeStreaming: true
		},
		finalizer: { capabilities: {
			finalEdit: true,
			normalFallback: true,
			previewReceipt: true
		} }
	}
});
const msteamsPlugin = (0, openclaw_plugin_sdk_channel_core.createChatChannelPlugin)({
	base: {
		...require_channel_setup.msteamsSetupPlugin,
		streaming: { blockStreamingCoalesceDefaults: {
			minChars: 1500,
			idleMs: 1e3
		} },
		agentPrompt: { messageToolHints: () => ["- Adaptive Cards supported. Use `action=send` with `card={type,version,body}` to send rich cards.", "- MSTeams targeting: omit `target` to reply to the current conversation (auto-inferred). Explicit targets: `user:ID` or `user:Display Name` (requires Graph API) for DMs, `conversation:19:...@thread.tacv2` for groups/channels. Prefer IDs over display names for speed."] },
		groups: { resolveToolPolicy: resolveMSTeamsGroupToolPolicy },
		approvalCapability: msTeamsApprovalCapability,
		doctor: msteamsDoctor,
		messaging: {
			targetPrefixes: ["msteams", "teams"],
			directTargetStyle: "user-prefixed",
			normalizeTarget: require_resolve_allowlist.normalizeMSTeamsMessagingTarget,
			inferTargetChatType: ({ to }) => inferMSTeamsTargetChatType(to),
			resolveOutboundSessionRoute: resolveMSTeamsOutboundSessionRoute,
			targetResolver: {
				looksLikeId: require_resolve_allowlist.looksLikeMSTeamsTargetId,
				hint: "<conversationId|user:ID|conversation:ID>"
			}
		},
		message: msteamsMessageAdapter,
		directory: (0, openclaw_plugin_sdk_directory_runtime.createChannelDirectoryAdapter)({
			...require_directory_contract_api.msteamsDirectoryContractPlugin.directory,
			...(0, openclaw_plugin_sdk_directory_runtime.createRuntimeDirectoryLiveAdapter)({
				getRuntime: loadMSTeamsChannelRuntime,
				listPeersLive: (runtime) => runtime.listMSTeamsDirectoryPeersLive,
				listGroupsLive: (runtime) => runtime.listMSTeamsDirectoryGroupsLive
			})
		}),
		resolver: { resolveTargets: async ({ cfg, inputs, kind, runtime }) => {
			const results = inputs.map((input) => ({
				input,
				resolved: false,
				id: void 0,
				name: void 0,
				note: void 0
			}));
			const resolvePending = async (pending, resolveEntries, applyResolvedEntry) => {
				if (pending.length === 0) return;
				try {
					(await resolveEntries(pending.map((entry) => entry.query))).forEach((entry, idx) => {
						const target = results[pending[idx]?.index ?? -1];
						if (!target) return;
						applyResolvedEntry(target, entry);
					});
				} catch (err) {
					runtime.error?.(`msteams resolve failed: ${String(err)}`);
					for (const { index } of pending) results[index].note = "lookup failed";
				}
			};
			if (kind === "user") {
				const pending = [];
				results.forEach((entry, index) => {
					const trimmed = entry.input.trim();
					if (!trimmed) {
						entry.note = "empty input";
						return;
					}
					const cleaned = require_resolve_allowlist.normalizeMSTeamsUserInput(trimmed);
					if (/^[0-9a-fA-F-]{16,}$/.test(cleaned) || cleaned.includes("@")) {
						entry.resolved = true;
						entry.id = cleaned;
						return;
					}
					pending.push({
						query: cleaned,
						index
					});
				});
				await resolvePending(pending, (entries) => require_resolve_allowlist.resolveMSTeamsUserAllowlist({
					cfg,
					entries
				}), (target, entry) => {
					target.resolved = entry.resolved;
					target.id = entry.id;
					target.name = entry.name;
					target.note = entry.note;
				});
				return results;
			}
			const pending = [];
			results.forEach((entry, index) => {
				const trimmed = entry.input.trim();
				if (!trimmed) {
					entry.note = "empty input";
					return;
				}
				const conversationId = require_resolve_allowlist.parseMSTeamsConversationId(trimmed);
				if (conversationId !== null) {
					entry.resolved = Boolean(conversationId);
					entry.id = conversationId || void 0;
					entry.note = conversationId ? "conversation id" : "empty conversation id";
					return;
				}
				const parsed = require_resolve_allowlist.parseMSTeamsTeamChannelInput(trimmed);
				if (!parsed.team) {
					entry.note = "missing team";
					return;
				}
				const query = parsed.channel ? `${parsed.team}/${parsed.channel}` : parsed.team;
				pending.push({
					query,
					index
				});
			});
			await resolvePending(pending, (entries) => require_resolve_allowlist.resolveMSTeamsChannelAllowlist({
				cfg,
				entries
			}), (target, entry) => {
				if (!entry.resolved || !entry.teamId) {
					target.resolved = false;
					target.note = entry.note;
					return;
				}
				target.resolved = true;
				if (entry.channelId) {
					target.id = `${entry.teamId}/${entry.channelId}`;
					target.name = entry.channelName && entry.teamName ? `${entry.teamName}/${entry.channelName}` : entry.channelName ?? entry.teamName;
				} else {
					target.id = entry.teamId;
					target.name = entry.teamName;
					target.note = "team id";
				}
				if (entry.note) target.note = entry.note;
			});
			return results;
		} },
		actions: {
			providerOwnedReadGates: true,
			readAuthorityActions: [
				"read",
				"search",
				"reactions",
				"list-pins",
				"member-info",
				"channel-info",
				"channel-list"
			],
			describeMessageTool: describeMSTeamsMessageTool,
			extractToolSendResult: ({ result }) => extractMSTeamsToolSendResult(result),
			requiresTrustedRequesterSender: ({ action, toolContext }) => (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(toolContext?.currentChannelProvider)?.toLowerCase() === "msteams" && MSTEAMS_GROUP_MANAGEMENT_ACTIONS.has(action),
			handleAction: withMSTeamsGraphMutationCurrentness(async (ctx) => {
				if (MSTEAMS_GROUP_MANAGEMENT_ACTIONS.has(ctx.action)) {
					const authError = requireMSTeamsGroupManagementAuthorization(ctx);
					if (authError) return authError;
				}
				const authorizeActionTarget = (target) => assertMSTeamsReadTargetAllowed({
					cfg: ctx.cfg,
					ctx,
					target
				});
				const presentation = ctx.action === "send" ? (0, openclaw_plugin_sdk_interactive_runtime.normalizeMessagePresentation)(ctx.params.presentation) : void 0;
				if (ctx.action === "send" && presentation) {
					const card = buildMSTeamsPresentationCard({
						presentation,
						text: resolveActionContent(ctx.params)
					});
					return await runWithRequiredActionTarget({
						actionLabel: "Card send",
						toolParams: ctx.params,
						run: async (to) => {
							const { sendAdaptiveCardMSTeams } = await loadMSTeamsChannelRuntime();
							const result = await sendAdaptiveCardMSTeams({
								cfg: ctx.cfg,
								to,
								card,
								assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
								onPlatformSendDispatch: ctx.onPlatformSendDispatch
							});
							return jsonActionResult({
								ok: true,
								channel: "msteams",
								messageId: result.messageId,
								conversationId: result.conversationId
							});
						}
					});
				}
				if (ctx.action === "upload-file") {
					const mediaUrl = resolveActionUploadFilePath(ctx.params);
					if (!mediaUrl) return actionError("Upload-file requires media, filePath, or path.");
					return await runWithRequiredActionTarget({
						actionLabel: "Upload-file",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
							const result = await sendMessageMSTeams({
								cfg: ctx.cfg,
								to,
								text: resolveActionContent(ctx.params),
								mediaUrl,
								filename: (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.filename) ?? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.title),
								mediaAccess: ctx.mediaAccess,
								mediaLocalRoots: ctx.mediaLocalRoots,
								mediaReadFile: ctx.mediaReadFile,
								assertDirectAdapterHandoff: ctx.assertDirectAdapterHandoff,
								onPlatformSendDispatch: ctx.onPlatformSendDispatch
							});
							return jsonActionResult({
								ok: true,
								channel: "msteams",
								action: "upload-file",
								messageId: result.messageId,
								conversationId: result.conversationId,
								...result.pendingUploadId ? { pendingUploadId: result.pendingUploadId } : {}
							});
						}
					});
				}
				if (ctx.action === "edit" || ctx.action === "delete") {
					const action = ctx.action;
					const content = action === "edit" ? resolveActionContent(ctx.params) : "";
					if (action === "edit" && !content) return actionError("Edit requires content.");
					return await runWithRequiredActionMessageTarget({
						actionLabel: action === "edit" ? "Edit" : "Delete",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (target) => {
							const to = await authorizeActionTarget(target.to);
							const runtime = await loadMSTeamsChannelRuntime();
							const params = {
								cfg: ctx.cfg,
								to,
								activityId: target.messageId
							};
							return jsonMSTeamsConversationResult((action === "edit" ? await runtime.editMessageMSTeams({
								...params,
								text: content
							}) : await runtime.deleteMessageMSTeams(params)).conversationId);
						}
					});
				}
				const graphActionTarget = {
					toolParams: ctx.action === "search" || ctx.action === "member-info" ? {
						...ctx.params,
						to: resolveActionTarget(ctx.params) || (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.channelId)
					} : ctx.params,
					currentChannelId: ctx.toolContext?.currentChannelId,
					currentGraphChannelId: (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.toolContext?.currentGraphChannelId) ?? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.toolContext?.currentMessagingTarget),
					currentChatType: ctx.toolContext?.currentChatType,
					currentMessageId: ctx.toolContext?.currentMessageId,
					graphOnly: true
				};
				if (ctx.action === "read" || ctx.action === "pin" || ctx.action === "reactions") {
					const action = ctx.action;
					return await runWithRequiredActionMessageTarget({
						actionLabel: {
							read: "Read",
							pin: "Pin",
							reactions: "Reactions"
						}[action],
						...graphActionTarget,
						allowCurrentMessageIdFallback: action === "reactions",
						run: async (target) => {
							const to = await authorizeActionTarget(target.to);
							const runtime = await loadMSTeamsChannelRuntime();
							const params = {
								cfg: ctx.cfg,
								to,
								messageId: target.messageId
							};
							if (action === "read") {
								const message = await runtime.getMessageMSTeams(params);
								return jsonMSTeamsOkActionResult(action, { message });
							}
							if (action === "pin") return jsonMSTeamsActionResult(action, await runtime.pinMessageMSTeams(params));
							return jsonMSTeamsOkActionResult(action, await runtime.listReactionsMSTeams(params));
						}
					});
				}
				if (ctx.action === "unpin") return await runWithRequiredActionPinnedMessageTarget({
					actionLabel: "Unpin",
					...graphActionTarget,
					run: async (target) => {
						const to = await authorizeActionTarget(target.to);
						const { unpinMessageMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsActionResult("unpin", await unpinMessageMSTeams({
							cfg: ctx.cfg,
							to,
							pinnedMessageId: target.pinnedMessageId
						}));
					}
				});
				if (ctx.action === "list-pins") return await runWithRequiredActionTarget({
					actionLabel: "List-pins",
					...graphActionTarget,
					run: async (to) => {
						const allowedTarget = await authorizeActionTarget(to);
						const { listPinsMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("list-pins", await listPinsMSTeams({
							cfg: ctx.cfg,
							to: allowedTarget
						}));
					}
				});
				if (ctx.action === "react") return await runWithRequiredActionMessageTarget({
					actionLabel: "React",
					...graphActionTarget,
					allowCurrentMessageIdFallback: true,
					run: async (target) => {
						const emoji = typeof ctx.params.emoji === "string" ? ctx.params.emoji.trim() : "";
						const remove = typeof ctx.params.remove === "boolean" ? ctx.params.remove : false;
						if (!emoji) return {
							isError: true,
							...(0, openclaw_plugin_sdk_tool_results.textResult)(`React requires an emoji (reaction type). Valid types: ${MSTEAMS_REACTION_TYPES.join(", ")}.`, {
								error: "React requires an emoji (reaction type).",
								validTypes: [...MSTEAMS_REACTION_TYPES]
							})
						};
						const to = await authorizeActionTarget(target.to);
						const runtime = await loadMSTeamsChannelRuntime();
						const result = await (remove ? runtime.unreactMessageMSTeams : runtime.reactMessageMSTeams)({
							cfg: ctx.cfg,
							to,
							messageId: target.messageId,
							reactionType: emoji
						});
						return jsonMSTeamsActionResult("react", {
							...remove ? { removed: true } : {},
							reactionType: emoji,
							...result
						});
					}
				});
				if (ctx.action === "search") return await runWithRequiredActionTarget({
					actionLabel: "Search",
					...graphActionTarget,
					run: async (to) => {
						const allowedTarget = await authorizeActionTarget(to);
						const query = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.query);
						if (!query) return actionError("Search requires a target (to) and query.");
						const limit = (0, openclaw_plugin_sdk_channel_actions.readPositiveIntegerParam)(ctx.params, "limit");
						const from = typeof ctx.params.from === "string" ? ctx.params.from.trim() : void 0;
						const { searchMessagesMSTeams } = await loadMSTeamsChannelRuntime();
						return jsonMSTeamsOkActionResult("search", await searchMessagesMSTeams({
							cfg: ctx.cfg,
							to: allowedTarget,
							query,
							from: from || void 0,
							limit
						}));
					}
				});
				if (ctx.action === "member-info") {
					const userId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.userId) ?? "";
					if (!userId) return actionError("member-info requires a userId.");
					return await runWithRequiredActionTarget({
						actionLabel: "member-info",
						...graphActionTarget,
						run: async (target) => {
							const to = await authorizeActionTarget(target);
							const currentRequesterId = isCurrentMSTeamsReadTarget({
								ctx,
								target: to
							}) ? ctx.requesterSenderId : void 0;
							const { getMemberInfoMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsOkActionResult("member-info", await getMemberInfoMSTeams({
								cfg: ctx.cfg,
								to,
								userId,
								currentRequesterId
							}));
						}
					});
				}
				if (ctx.action === "channel-list") {
					const teamId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.teamId) ?? "";
					if (!teamId) return actionError("channel-list requires a teamId.");
					const graphTeamId = await assertMSTeamsTeamEnumerationAllowed({
						cfg: ctx.cfg,
						ctx,
						teamId
					});
					const { listChannelsMSTeams } = await loadMSTeamsChannelRuntime();
					return jsonMSTeamsOkActionResult("channel-list", await listChannelsMSTeams({
						cfg: ctx.cfg,
						teamId: graphTeamId
					}));
				}
				if (ctx.action === "channel-info") {
					const teamId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.teamId) ?? "";
					const channelId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.channelId) ?? "";
					if (!teamId || !channelId) return actionError("channel-info requires teamId and channelId.");
					const [graphTeamId, graphChannelId] = (await authorizeActionTarget(`${teamId}/${channelId}`)).split("/", 2);
					if (!graphTeamId || !graphChannelId) throw new Error("Authorized Microsoft Teams channel target is invalid.");
					const { getChannelInfoMSTeams } = await loadMSTeamsChannelRuntime();
					return jsonMSTeamsOkActionResult("channel-info", { channelInfo: (await getChannelInfoMSTeams({
						cfg: ctx.cfg,
						teamId: graphTeamId,
						channelId: graphChannelId
					})).channel });
				}
				if (ctx.action === "addParticipant" || ctx.action === "removeParticipant") {
					const action = ctx.action;
					const userId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.userId);
					if (!userId) return actionError(`${action} requires a userId.`);
					return await runWithRequiredActionTarget({
						actionLabel: action,
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const role = action === "addParticipant" ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(ctx.params.role) : void 0;
							const runtime = await loadMSTeamsChannelRuntime();
							const params = {
								cfg: ctx.cfg,
								to,
								userId
							};
							const result = action === "addParticipant" ? await runtime.addParticipantMSTeams({
								...params,
								role
							}) : await runtime.removeParticipantMSTeams(params);
							return jsonMSTeamsOkActionResult(action, result);
						}
					});
				}
				if (ctx.action === "renameGroup") {
					const name = typeof ctx.params.name === "string" ? ctx.params.name.trim() : "";
					if (!name) return actionError("renameGroup requires a name.");
					return await runWithRequiredActionTarget({
						actionLabel: "renameGroup",
						toolParams: ctx.params,
						currentChannelId: ctx.toolContext?.currentChannelId,
						run: async (to) => {
							const { renameGroupMSTeams } = await loadMSTeamsChannelRuntime();
							return jsonMSTeamsOkActionResult("renameGroup", await renameGroupMSTeams({
								cfg: ctx.cfg,
								to,
								name
							}));
						}
					});
				}
				return null;
			})
		},
		status: (0, openclaw_plugin_sdk_status_helpers.createComputedAccountStatusAdapter)({
			defaultRuntime: (0, openclaw_plugin_sdk_channel_status.createDefaultChannelRuntimeState)(openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID, { port: null }),
			buildChannelSummary: ({ snapshot }) => (0, openclaw_plugin_sdk_channel_status.buildProbeChannelStatusSummary)(snapshot, { port: snapshot.port ?? null }),
			probeAccount: async ({ cfg }) => await (await loadMSTeamsChannelRuntime()).probeMSTeams(cfg.channels?.msteams),
			formatCapabilitiesProbe: ({ probe }) => {
				const lines = [];
				const appId = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(probe?.appId);
				if (appId) lines.push({ text: `App: ${appId}` });
				const graph = probe?.graph;
				if (graph) {
					const roles = Array.isArray(graph.roles) ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeStringEntries)(graph.roles) : [];
					const scopes = Array.isArray(graph.scopes) ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeStringEntries)(graph.scopes) : [];
					const formatPermission = (permission) => {
						const hint = TEAMS_GRAPH_PERMISSION_HINTS[permission];
						return hint ? `${permission} (${hint})` : permission;
					};
					if (!graph.ok) lines.push({
						text: `Graph: ${graph.error ?? "failed"}`,
						tone: "error"
					});
					else if (roles.length > 0 || scopes.length > 0) {
						if (roles.length > 0) lines.push({ text: `Graph roles: ${roles.map(formatPermission).join(", ")}` });
						if (scopes.length > 0) lines.push({ text: `Graph scopes: ${scopes.map(formatPermission).join(", ")}` });
					} else lines.push({ text: "Graph: ok" });
				}
				return lines;
			},
			resolveAccountSnapshot: ({ account }) => ({
				accountId: account.accountId,
				enabled: account.enabled,
				configured: account.configured,
				extra: { tokenStatus: account.tokenStatus }
			})
		}),
		gateway: { startAccount: async (ctx) => {
			const { monitorMSTeamsProvider } = await Promise.resolve().then(() => require("./monitor-DfSPCRkk.cjs"));
			const webhookPath = ctx.cfg.channels?.msteams?.webhook?.path || "/api/messages";
			const statusSink = (0, openclaw_plugin_sdk_channel_outbound.createAccountStatusSink)({
				accountId: ctx.accountId,
				setStatus: ctx.setStatus
			});
			ctx.log?.info(`starting provider (Gateway route ${webhookPath})`);
			if (isMSTeamsNativeApprovalClientEnabled({
				cfg: ctx.cfg,
				accountId: ctx.accountId
			})) (0, openclaw_plugin_sdk_channel_runtime_context.registerChannelRuntimeContext)({
				channelRuntime: ctx.channelRuntime,
				channelId: "msteams",
				accountId: ctx.accountId,
				capability: openclaw_plugin_sdk_approval_handler_adapter_runtime.CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
				context: {},
				abortSignal: ctx.abortSignal
			});
			return monitorMSTeamsProvider({
				cfg: ctx.cfg,
				runtime: ctx.runtime,
				abortSignal: ctx.abortSignal,
				statusSink
			});
		} }
	},
	security: { collectWarnings: ({ cfg }) => collectMSTeamsSecurityFindings({ cfg }) },
	pairing: { text: {
		idLabel: "msteamsUserId",
		message: openclaw_plugin_sdk_channel_status.PAIRING_APPROVED_MESSAGE,
		normalizeAllowEntry: (0, openclaw_plugin_sdk_channel_pairing.createPairingPrefixStripper)(/^(msteams|user):/i),
		notify: async ({ cfg, id, message }) => {
			const { sendMessageMSTeams } = await loadMSTeamsChannelRuntime();
			await sendMessageMSTeams({
				cfg,
				to: id,
				text: message
			});
		}
	} },
	threading: {
		matchesToolContextTarget: ({ target, toolContext }) => msteamsContextTargetsMatch(target, toolContext),
		buildToolContext: ({ context, hasRepliedRef }) => {
			const nativeChannelId = context.NativeChannelId?.trim();
			const hasChannelRoute = Boolean(nativeChannelId && nativeChannelId.includes("/"));
			const isChannel = context.ChatType === "channel";
			const currentThreadTs = (context.MessageThreadId != null ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(String(context.MessageThreadId)) : void 0) ?? (isChannel ? (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(context.ReplyToId) : void 0);
			return {
				currentChannelId: (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(context.To),
				currentChatType: context.ChatType === "direct" || context.ChatType === "group" || context.ChatType === "channel" ? context.ChatType : void 0,
				currentMessagingTarget: hasChannelRoute ? nativeChannelId : void 0,
				currentGraphChannelId: hasChannelRoute ? nativeChannelId : void 0,
				currentThreadTs,
				...currentThreadTs ? { replyToMode: "all" } : {},
				hasRepliedRef
			};
		},
		resolveAutoThreadId: ({ cfg, to, toolContext }) => resolveMSTeamsAutoThreadId({
			cfg: cfg.channels?.msteams,
			to,
			toolContext
		})
	},
	outbound: msteamsChannelOutbound
});
//#endregion
Object.defineProperty(exports, "buildMSTeamsPresentationCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsPresentationCard;
	}
});
Object.defineProperty(exports, "inferMSTeamsTargetChatType", {
	enumerable: true,
	get: function() {
		return inferMSTeamsTargetChatType;
	}
});
Object.defineProperty(exports, "isMSTeamsNativeApprovalClientEnabled", {
	enumerable: true,
	get: function() {
		return isMSTeamsNativeApprovalClientEnabled;
	}
});
Object.defineProperty(exports, "msteamsOutboundConfig", {
	enumerable: true,
	get: function() {
		return msteamsOutboundConfig;
	}
});
Object.defineProperty(exports, "msteamsPlugin", {
	enumerable: true,
	get: function() {
		return msteamsPlugin;
	}
});
Object.defineProperty(exports, "resolveMSTeamsEffectiveTextChunkLimit", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsEffectiveTextChunkLimit;
	}
});
Object.defineProperty(exports, "resolveMSTeamsLegacyWebhook", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsLegacyWebhook;
	}
});
Object.defineProperty(exports, "resolveMSTeamsReplyPolicy", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsReplyPolicy;
	}
});
Object.defineProperty(exports, "resolveMSTeamsRouteConfig", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsRouteConfig;
	}
});
Object.defineProperty(exports, "resolveMSTeamsWebhookPathIssue", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsWebhookPathIssue;
	}
});
Object.defineProperty(exports, "shouldHandleMSTeamsNativeApprovalRequest", {
	enumerable: true,
	get: function() {
		return shouldHandleMSTeamsNativeApprovalRequest;
	}
});

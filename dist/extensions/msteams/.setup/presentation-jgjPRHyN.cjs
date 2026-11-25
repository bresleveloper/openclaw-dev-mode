const require_resolve_allowlist = require("./resolve-allowlist-Dc_BnhPP.cjs");
require("../runtime-api.cjs");
let openclaw_plugin_sdk_channel_policy = require("openclaw/plugin-sdk/channel-policy");
let openclaw_plugin_sdk_interactive_runtime = require("openclaw/plugin-sdk/interactive-runtime");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_channel_targets = require("openclaw/plugin-sdk/channel-targets");
// extensions/msteams/src/policy.ts
function matchMSTeamsPolicyEntry(entries, ...keys) {
	return (0, openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback)({
		entries,
		keys: (0, openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates)(...keys),
		wildcardKey: "*",
		normalizeKey: openclaw_plugin_sdk_channel_targets.normalizeChannelSlug
	});
}
function selectMSTeamsPolicyEntry(entries, key) {
	const match = matchMSTeamsPolicyEntry(entries, key?.trim());
	return match.matchKey ?? match.key ? match.entry : void 0;
}
function resolveMSTeamsRouteConfig(params) {
	const teamId = params.teamId?.trim();
	const teamName = params.teamName?.trim();
	const conversationId = params.conversationId?.trim();
	const channelName = params.channelName?.trim();
	const teams = params.cfg?.teams ?? {};
	const allowlistConfigured = Object.keys(teams).length > 0;
	const teamMatch = matchMSTeamsPolicyEntry(teams, teamId, params.allowNameMatching ? teamName : void 0, params.allowNameMatching && teamName ? (0, openclaw_plugin_sdk_channel_targets.normalizeChannelSlug)(teamName) : void 0);
	const teamConfig = teamMatch.entry;
	const channels = teamConfig?.channels ?? {};
	const channelAllowlistConfigured = Object.keys(channels).length > 0;
	const channelMatch = matchMSTeamsPolicyEntry(channels, conversationId, params.allowNameMatching ? channelName : void 0, params.allowNameMatching && channelName ? (0, openclaw_plugin_sdk_channel_targets.normalizeChannelSlug)(channelName) : void 0);
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
	const cfg = require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, params.accountId);
	if (!cfg) return;
	const teams = cfg.teams ?? {};
	const team = selectMSTeamsPolicyEntry(teams, params.groupSpace);
	const channel = team && selectMSTeamsPolicyEntry(team.channels ?? {}, params.groupId);
	const resolve = (selectedTeam, selectedChannel) => (0, openclaw_plugin_sdk_channel_policy.resolveScopeToolsPolicy)({
		tree: { scopes: {
			team: selectedTeam ?? {},
			channel: selectedChannel ?? {}
		} },
		path: ["team", "channel"],
		senderPolicyMode: params.senderPolicyMode,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	const resolved = resolve(team, channel);
	if (resolved !== void 0 || channel) return resolved;
	if (params.groupId?.trim()) for (const candidate of Object.values(teams)) {
		const matched = selectMSTeamsPolicyEntry(candidate.channels ?? {}, params.groupId);
		if (matched) return resolve(candidate, matched);
	}
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
// extensions/msteams/src/presentation.ts
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
Object.defineProperty(exports, "MSTEAMS_PRESENTATION_CAPABILITIES", {
	enumerable: true,
	get: function() {
		return MSTEAMS_PRESENTATION_CAPABILITIES;
	}
});
Object.defineProperty(exports, "buildMSTeamsPresentationCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsPresentationCard;
	}
});
Object.defineProperty(exports, "resolveMSTeamsGroupToolPolicy", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsGroupToolPolicy;
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

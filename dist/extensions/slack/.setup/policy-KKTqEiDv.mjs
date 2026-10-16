import { i as buildSlackChannelPolicyScope, r as buildSlackChannelIdCandidates } from "./session-status-D46GHwOV.mjs";
import { A as resolveSlackUserAllowListForTeam, O as normalizeSlackSlug } from "./probe-BVlJ3dp0.mjs";
import { applyChannelMatchMeta, buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { firstDefined } from "openclaw/plugin-sdk/allow-from";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
//#region extensions/slack/src/monitor/channel-config.ts
function resolveSlackChannelLabel(params) {
	const channelName = params.channelName?.trim();
	if (channelName) return `#${normalizeSlackSlug(channelName) || channelName}`;
	const channelId = params.channelId?.trim();
	return channelId ? `#${channelId}` : "unknown channel";
}
function resolveSlackChannelConfig(params) {
	const { channelId, channelName, channels, channelKeys, defaultRequireMention, allowNameMatching } = params;
	const entries = channels ?? {};
	const keys = channelKeys ?? Object.keys(entries);
	const normalizedName = channelName ? normalizeSlackSlug(channelName) : "";
	const directName = channelName ? channelName.trim() : "";
	const candidates = buildChannelKeyCandidates(...buildSlackChannelIdCandidates(channelId, params.teamId, { allowUnscoped: params.allowUnscoped }), allowNameMatching ? channelName ? `#${directName}` : void 0 : void 0, allowNameMatching ? directName : void 0, allowNameMatching ? normalizedName : void 0);
	const match = buildSlackChannelPolicyScope({
		channels: entries,
		candidates
	});
	const { entry: matched, wildcardEntry: fallback } = match;
	const requireMentionDefault = defaultRequireMention ?? true;
	if (keys.length === 0) return {
		allowed: true,
		requireMention: requireMentionDefault
	};
	if (!matched && !fallback) return {
		allowed: false,
		requireMention: requireMentionDefault
	};
	const resolved = matched ?? fallback ?? {};
	const users = resolveSlackUserAllowListForTeam({
		allowList: firstDefined(resolved.users, fallback?.users),
		teamId: params.teamId,
		preserveUnmatchedScopedEntries: true
	});
	const result = {
		allowed: firstDefined(resolved.enabled, fallback?.enabled, true) ?? true,
		requireMention: firstDefined(resolved.requireMention, fallback?.requireMention, requireMentionDefault) ?? requireMentionDefault,
		requireMentionInBotThreads: firstDefined(resolved.requireMentionInBotThreads, fallback?.requireMentionInBotThreads),
		ignoreOtherMentions: firstDefined(resolved.ignoreOtherMentions, fallback?.ignoreOtherMentions),
		replyToMode: firstDefined(resolved.replyToMode, fallback?.replyToMode),
		allowBots: firstDefined(resolved.allowBots, fallback?.allowBots),
		botLoopProtection: mergePairLoopGuardConfig(fallback?.botLoopProtection, matched?.botLoopProtection),
		users: users.length > 0 ? users : void 0,
		skills: firstDefined(resolved.skills, fallback?.skills),
		systemPrompt: firstDefined(resolved.systemPrompt, fallback?.systemPrompt),
		presenceEvents: firstDefined(resolved.presenceEvents, fallback?.presenceEvents)
	};
	return applyChannelMatchMeta(result, match);
}
//#endregion
//#region extensions/slack/src/monitor/policy.ts
function isSlackChannelAllowedByPolicy(params) {
	if (params.groupPolicy === "disabled") return false;
	return params.groupPolicy !== "allowlist" || params.channelAllowlistConfigured && params.channelAllowed;
}
//#endregion
export { resolveSlackChannelConfig as n, resolveSlackChannelLabel as r, isSlackChannelAllowedByPolicy as t };

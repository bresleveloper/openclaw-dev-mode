import { i as buildSlackChannelPolicyScope, r as buildSlackChannelIdCandidates } from "./session-status-Cf7AvWOt.mjs";
import { D as normalizeSlackSlug, k as resolveSlackUserAllowListForTeam } from "./probe-DiYIMPJo.mjs";
import { applyChannelMatchMeta, buildChannelKeyCandidates } from "openclaw/plugin-sdk/channel-targets";
import { mergePairLoopGuardConfig } from "openclaw/plugin-sdk/pair-loop-guard-runtime";
//#region extensions/slack/src/monitor/channel-config.ts
function firstDefined(...values) {
	for (const value of values) if (value !== void 0) return value;
}
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
	const allowed = firstDefined(resolved.enabled, fallback?.enabled, true) ?? true;
	const requireMention = firstDefined(resolved.requireMention, fallback?.requireMention, requireMentionDefault) ?? requireMentionDefault;
	const ignoreOtherMentions = firstDefined(resolved.ignoreOtherMentions, fallback?.ignoreOtherMentions);
	const allowBots = firstDefined(resolved.allowBots, fallback?.allowBots);
	const replyToMode = firstDefined(resolved.replyToMode, fallback?.replyToMode);
	const botLoopProtection = mergePairLoopGuardConfig(fallback?.botLoopProtection, matched?.botLoopProtection);
	const users = resolveSlackUserAllowListForTeam({
		allowList: firstDefined(resolved.users, fallback?.users),
		teamId: params.teamId,
		preserveUnmatchedScopedEntries: true
	});
	const skills = firstDefined(resolved.skills, fallback?.skills);
	const systemPrompt = firstDefined(resolved.systemPrompt, fallback?.systemPrompt);
	const presenceEvents = firstDefined(resolved.presenceEvents, fallback?.presenceEvents);
	const result = {
		allowed,
		requireMention,
		ignoreOtherMentions,
		replyToMode,
		allowBots,
		botLoopProtection,
		users: users.length > 0 ? users : void 0,
		skills,
		systemPrompt,
		presenceEvents
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

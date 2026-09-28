import { buildMessagingTarget, ensureTargetId, parseMentionPrefixOrAtUserTarget, requireTargetKind } from "openclaw/plugin-sdk/channel-targets";
//#region extensions/slack/src/target-parsing.ts
const SLACK_CHANNEL_API_ID_RE = /^[CDG][0-9][A-Z0-9]{7,}$/i;
const SLACK_USER_API_ID_RE = /^[BUW][A-Z0-9]{8,}$/i;
const SLACK_QUALIFIED_TARGET_RE = /^team:([^:]+):(user|channel):([^:]+)$/i;
function decodeSlackTargetPart(raw) {
	try {
		return decodeURIComponent(raw).trim() || void 0;
	} catch {
		return;
	}
}
function parseQualifiedSlackTarget(raw) {
	const match = SLACK_QUALIFIED_TARGET_RE.exec(raw);
	if (!match) {
		if (/^team:/i.test(raw)) throw new Error("Slack workspace targets require team:<team-id>:channel:<channel-id> or team:<team-id>:user:<user-id>");
		return;
	}
	const teamId = decodeSlackTargetPart(match[1] ?? "");
	const kind = match[2]?.toLowerCase();
	const id = decodeSlackTargetPart(match[3] ?? "");
	const idPattern = kind === "user" ? /^[BUW][A-Z0-9]+$/i : /^[CDG][A-Z0-9]+$/i;
	if (!teamId || !/^T[A-Z0-9]+$/i.test(teamId) || !kind || !id || !idPattern.test(id)) throw new Error("Invalid Slack workspace-qualified target");
	return {
		kind,
		id,
		teamId,
		raw,
		normalized: `team:${teamId.toLowerCase()}:${kind}:${id.toLowerCase()}`
	};
}
function formatSlackTarget(params) {
	const teamId = params.teamId?.trim();
	const id = params.id.trim();
	if (!teamId) return params.explicitKind ? `${params.kind}:${id}` : id;
	const idPattern = params.kind === "user" ? /^[BUW][A-Z0-9]+$/i : /^[CDG][A-Z0-9]+$/i;
	if (!/^T[A-Z0-9]+$/i.test(teamId) || !idPattern.test(id)) throw new Error("Invalid Slack workspace-qualified target");
	return `team:${encodeURIComponent(teamId)}:${params.kind}:${encodeURIComponent(id)}`;
}
function resolveWorkspaceQualifiedSlackTarget(input, kind) {
	if (!/^team:/i.test(input)) return;
	try {
		const target = parseSlackTarget(input);
		if (target?.kind !== kind || !target.teamId) return;
		return {
			input,
			resolved: true,
			id: formatSlackTarget({
				teamId: target.teamId,
				kind,
				id: target.id
			})
		};
	} catch {
		return;
	}
}
function isUnambiguousSlackUserId(rawId) {
	const id = rawId.trim();
	return /^[UW][A-Z0-9]+$/.test(id) || /^[uw][0-9][a-z0-9]{7,}$/.test(id);
}
/** Restores API casing for unambiguous normalized Slack conversation IDs. */
function canonicalizeSlackApiTargetId(kind, rawId, rawTarget) {
	const id = rawId.trim();
	if (kind === "channel" && rawTarget?.trim().startsWith("#")) return id;
	return (kind === "user" ? SLACK_USER_API_ID_RE : SLACK_CHANNEL_API_ID_RE).test(id) ? id.toUpperCase() : id;
}
function parseSlackTarget(raw, options = {}) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const qualifiedTarget = parseQualifiedSlackTarget(trimmed);
	if (qualifiedTarget) return qualifiedTarget;
	const userTarget = parseMentionPrefixOrAtUserTarget({
		raw: trimmed,
		mentionPattern: /^<@([A-Z0-9]+)>$/i,
		prefixes: [
			{
				prefix: "user:",
				kind: "user"
			},
			{
				prefix: "channel:",
				kind: "channel"
			},
			{
				prefix: "slack:",
				kind: "user"
			}
		],
		atUserPattern: /^[A-Z0-9]+$/i,
		atUserErrorMessage: "Slack DMs require a user id (use user:<id> or <@id>)"
	});
	if (userTarget) return userTarget;
	if (trimmed.startsWith("#")) {
		const candidate = trimmed.slice(1).trim();
		const id = ensureTargetId({
			candidate,
			pattern: /^[A-Z0-9]+$/i,
			errorMessage: "Slack channels require a channel id (use channel:<id>)"
		});
		return buildMessagingTarget("channel", id, trimmed);
	}
	if (isUnambiguousSlackUserId(trimmed)) return buildMessagingTarget("user", trimmed, trimmed);
	if (options.defaultKind) return buildMessagingTarget(options.defaultKind, trimmed, trimmed);
	return buildMessagingTarget("channel", trimmed, trimmed);
}
function resolveSlackChannelId(raw) {
	const target = parseSlackTarget(raw, { defaultKind: "channel" });
	return canonicalizeSlackApiTargetId("channel", requireTargetKind({
		platform: "Slack",
		target,
		kind: "channel"
	}), raw);
}
function normalizeSlackMessagingTarget(raw) {
	return parseSlackTarget(raw, { defaultKind: "channel" })?.normalized;
}
function slackTargetsMatch(left, right) {
	const leftTarget = normalizeSlackMessagingTarget(left);
	const rightTarget = normalizeSlackMessagingTarget(right);
	return Boolean(leftTarget && rightTarget && leftTarget === rightTarget);
}
function looksLikeSlackTargetId(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return false;
	if (/^<@([A-Z0-9]+)>$/i.test(trimmed)) return true;
	if (/^(user|channel):/i.test(trimmed)) return true;
	if (/^slack:/i.test(trimmed)) return true;
	if (/^team:/i.test(trimmed)) return true;
	if (/^[@#]/.test(trimmed)) return true;
	return /^[CUWGD][A-Z0-9]{8,}$/i.test(trimmed);
}
//#endregion
export { parseSlackTarget as a, slackTargetsMatch as c, normalizeSlackMessagingTarget as i, formatSlackTarget as n, resolveSlackChannelId as o, looksLikeSlackTargetId as r, resolveWorkspaceQualifiedSlackTarget as s, canonicalizeSlackApiTargetId as t };

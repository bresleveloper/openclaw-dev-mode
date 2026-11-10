import { a as readPublishedXAllowlist, r as normalizeXUserId } from "./allowlist-Bk-oAvxJ.mjs";
import { t as getXRuntime } from "./runtime-B1HOiKKH.mjs";
//#region extensions/x/src/guest-tools.ts
const X_GUEST_TOOLS = [
	"read",
	"ls",
	"sessions_spawn",
	"sessions_yield",
	"subagents"
];
//#endregion
//#region extensions/x/src/guest-policy.ts
function resolveXGuestSettings(account) {
	return {
		enabled: account.config.guests?.enabled === true,
		maxMentionsPerAuthorPerDay: account.config.guests?.maxMentionsPerAuthorPerDay ?? 5,
		threadContextMaxPosts: account.config.guests?.threadContextMaxPosts ?? 10
	};
}
function resolveXSenderTier(account, senderId) {
	const id = senderId && normalizeXUserId(senderId);
	const allowed = [...account.config.allowFrom ?? [], ...readPublishedXAllowlist(getXRuntime(), account.accountId, account.config.verifiedFromGitHub)];
	return id && allowed.some((entry) => normalizeXUserId(entry) === id) ? "maintainer" : "guest";
}
function resolveXGuestToolPolicy(account) {
	const configured = account.config.guests?.tools;
	const allow = X_GUEST_TOOLS.filter((name) => !configured?.allow || configured.allow.includes(name));
	return allow.length ? {
		allow,
		deny: ["skills_read", ...configured?.deny ?? []]
	} : { deny: ["*"] };
}
function formatXSenderLine(tier, authorId, user, github) {
	const inline = (text) => text.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, " ").trim();
	const label = [user?.username ? `@${inline(user.username)}` : "", user?.name ? `(${inline(user.name)})` : ""].filter(Boolean).join(" ");
	const sender = `${label ? `${label}, ` : ""}X user id ${authorId}`;
	if (tier === "maintainer") {
		if (github) return `This is from a verified user: ${sender}, GitHub @${inline(github.entry.githubLogin)} with write access to ${inline(github.repo)}.`;
		return `This is from a verified user: ${sender}, on the maintainer allowlist.`;
	}
	return `This is from a guest: ${sender}. Guest tier: answer from the OpenClaw repo only; hidden helpers must use the same agent and repository. You cannot open visible work sessions, write, run commands, or read unrelated sessions for guests.`;
}
//#endregion
export { X_GUEST_TOOLS as a, resolveXSenderTier as i, resolveXGuestSettings as n, resolveXGuestToolPolicy as r, formatXSenderLine as t };

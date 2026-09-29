import { x as resolveUserProfileGitHubAttribution } from "./user-profile-list-B5pNqyXa.mjs";
import { t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-C-JyMH54.mjs";
import { T as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { o as listSessionParticipantsReadOnly } from "./session-accessor-l-4ZHvKn.mjs";
import { p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-BOF32-1s.mjs";
//#region src/agents/git-coauthor-attribution.ts
function resolveGitCoauthorAttribution(params) {
	if (!params.sessionKey) return;
	const storePath = resolveSessionStorePathForScope({
		agentId: params.agentId,
		env: params.env,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.config);
	const records = listSessionParticipantsReadOnly({
		agentId: params.agentId,
		env: params.env,
		sessionKey: params.sessionKey,
		storePath
	}).get(params.sessionKey) ?? [];
	const profileRecords = new Map(records.flatMap((record) => record.identity.type === "profile" ? [[record.identity.id, record]] : []));
	if (profileRecords.size === 0) return;
	const identities = resolveUserProfileGitHubAttribution([...profileRecords.keys()], { env: params.env });
	const primaryEmail = (resolveConfiguredGitHubToolIdentity({
		...params,
		scope: "agent"
	}) ?? resolveConfiguredGitHubToolIdentity({
		...params,
		scope: "system"
	}))?.gitAuthor?.email?.trim().toLowerCase();
	const contributors = /* @__PURE__ */ new Map();
	for (const [profileId, record] of profileRecords) {
		const identity = identities.get(profileId);
		if (!identity) continue;
		if (identity.accountId === params.excludeAccountId) continue;
		const noreplyEmail = `${identity.accountId}+${identity.login}@users.noreply.github.com`;
		if (params.excludeAccountId === void 0 && noreplyEmail.toLowerCase() === primaryEmail) continue;
		const contributor = contributors.get(identity.accountId);
		if (contributor) {
			contributor.contributionCount += record.contributionCount;
			contributor.firstPromptedAt = contributor.firstPromptedAt === null || record.firstPromptedAt === null ? null : Math.min(contributor.firstPromptedAt, record.firstPromptedAt);
			continue;
		}
		contributors.set(identity.accountId, {
			accountId: identity.accountId,
			contributionCount: record.contributionCount,
			firstPromptedAt: record.firstPromptedAt,
			login: identity.login
		});
	}
	const visibleContributors = [...contributors.values()].toSorted((left, right) => right.contributionCount - left.contributionCount || (left.firstPromptedAt === null ? right.firstPromptedAt === null ? 0 : 1 : right.firstPromptedAt === null ? -1 : left.firstPromptedAt - right.firstPromptedAt) || left.accountId - right.accountId).slice(0, MAX_SESSION_PARTICIPANTS);
	const logins = visibleContributors.map(({ login }) => login);
	const trailers = visibleContributors.map(({ accountId, login }) => `Co-authored-by: ${login} <${accountId}+${login}@users.noreply.github.com>`);
	return trailers.length ? {
		trailers,
		logins
	} : void 0;
}
//#endregion
export { resolveGitCoauthorAttribution as t };

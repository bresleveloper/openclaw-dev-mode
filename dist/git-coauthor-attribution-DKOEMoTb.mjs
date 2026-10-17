import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { E as resolveUserProfileGitHubAttribution, w as prepareUserProfileGitHubAttribution } from "./user-profile-list-CtETKur7.mjs";
import { _ as resolveSessionStorePathForScope } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { i as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-2S4ost1l.mjs";
//#region src/agents/git-coauthor-attribution.ts
async function resolveGitCoauthorAttribution(params) {
	return (await resolveAttribution(params, false)).attribution;
}
async function prepareGitCoauthorAttribution(params) {
	return await resolveAttribution(params, true);
}
async function resolveAttribution(params, retainAuthority) {
	const empty = {
		attribution: void 0,
		isCurrent: () => true
	};
	if (!params.sessionKey || isIncognitoSessionKey(params.sessionKey)) return empty;
	const storePath = resolveSessionStorePathForScope({
		agentId: params.agentId,
		env: params.env,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.config);
	const read = await readSessionEntriesFromStoreInWorker({
		agentId: params.agentId,
		env: params.env,
		sessionKeys: [params.sessionKey],
		storePath,
		includeParticipantRecords: true
	});
	const entry = read.entries.find(({ sessionKey }) => sessionKey === params.sessionKey)?.entry;
	if (!entry || entry.incognito || params.sessionId && entry.sessionId !== params.sessionId) return empty;
	const records = read.participantRecords?.[params.sessionKey] ?? [];
	const profileRecords = new Map(records.flatMap((record) => record.identity.type === "profile" ? [[record.identity.id, record]] : []));
	const inheritedProfileIds = entry.inheritedGitContributorProfileIds ?? [];
	const profileIds = [.../* @__PURE__ */ new Set([...profileRecords.keys(), ...inheritedProfileIds])];
	if (profileIds.length === 0) return empty;
	const prepared = retainAuthority ? await prepareUserProfileGitHubAttribution(profileIds, { env: params.env }) : {
		identities: await resolveUserProfileGitHubAttribution(profileIds, { env: params.env }),
		isCurrent: () => true
	};
	const identities = prepared.identities;
	const primaryEmail = (resolveConfiguredGitHubToolIdentity({
		...params,
		scope: "agent"
	}) ?? resolveConfiguredGitHubToolIdentity({
		...params,
		scope: "system"
	}))?.gitAuthor?.email?.trim().toLowerCase();
	const contributors = /* @__PURE__ */ new Map();
	for (const profileId of profileIds) {
		const record = profileRecords.get(profileId);
		const identity = identities.get(profileId);
		if (!identity) continue;
		if (identity.accountId === params.excludeAccountId) continue;
		const noreplyEmail = `${identity.accountId}+${identity.login}@users.noreply.github.com`;
		if (params.excludeAccountId === void 0 && noreplyEmail.toLowerCase() === primaryEmail) continue;
		const contributor = contributors.get(identity.accountId);
		if (contributor) {
			if (record) {
				contributor.contributionCount += record.contributionCount;
				contributor.firstPromptedAt = contributor.firstPromptedAt === null || record.firstPromptedAt === null ? null : Math.min(contributor.firstPromptedAt, record.firstPromptedAt);
			}
			continue;
		}
		contributors.set(identity.accountId, {
			accountId: identity.accountId,
			contributionCount: record?.contributionCount ?? 0,
			firstPromptedAt: record?.firstPromptedAt ?? null,
			login: identity.login,
			...!record ? { inheritedOrder: inheritedProfileIds.indexOf(profileId) } : {}
		});
	}
	const visibleContributors = [...contributors.values()].toSorted((left, right) => right.contributionCount - left.contributionCount || (left.firstPromptedAt === null ? right.firstPromptedAt === null ? 0 : 1 : right.firstPromptedAt === null ? -1 : left.firstPromptedAt - right.firstPromptedAt) || (left.inheritedOrder ?? Number.MAX_SAFE_INTEGER) - (right.inheritedOrder ?? Number.MAX_SAFE_INTEGER) || left.accountId - right.accountId).slice(0, MAX_SESSION_PARTICIPANTS);
	const logins = visibleContributors.map(({ login }) => login);
	const trailers = visibleContributors.map(({ accountId, login }) => `Co-authored-by: ${login} <${accountId}+${login}@users.noreply.github.com>`);
	return {
		attribution: trailers.length ? {
			trailers,
			logins
		} : void 0,
		isCurrent: prepared.isCurrent
	};
}
//#endregion
export { resolveGitCoauthorAttribution as n, prepareGitCoauthorAttribution as t };

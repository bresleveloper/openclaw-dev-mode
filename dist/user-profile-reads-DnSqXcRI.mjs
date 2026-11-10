import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as captureUserProfileAuthorityRead } from "./user-profile-events-CXjmX5Qy.mjs";
//#region src/state/user-profile-reads.ts
/** Fresh disclosure aliases retain their physical store and merge authority across caller waits. */
async function prepareCurrentUserProfileAliases(profileId, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const authority = await captureUserProfileAuthorityRead(context.admission, void 0, "identity");
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "userProfiles.aliases.resolve",
		profileId
	}, { current: true });
	context.admission.assertCurrent();
	const isCurrent = authority.bind([profileId, reply?.profileId ?? profileId]);
	const assertCurrent = () => {
		if (!isCurrent?.()) throw new Error("Profile aliases changed while preparing disclosure. Retry the request.");
	};
	assertCurrent();
	return {
		aliases: new Set(reply?.aliases ?? [profileId]),
		assertCurrent
	};
}
async function resolveCanonicalCachedGitHubIdentity(binding, options = {}) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "userProfiles.githubIdentity.cached",
		...binding
	});
	if (!reply) return;
	return reply.identity;
}
async function listProfiles(options = {}) {
	return (await readUserProfileSnapshot(void 0, options)).profiles;
}
async function readUserProfileSnapshot(githubAccountIds, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "userProfiles.list",
		input: githubAccountIds ? { githubAccountIds } : void 0
	});
}
/** Candidate IDs and search labels; current recipient policy remains caller-owned. */
async function readUserProfileDirectory(limit, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "userProfiles.directory",
		input: { limit }
	});
}
//#endregion
export { resolveCanonicalCachedGitHubIdentity as a, readUserProfileSnapshot as i, prepareCurrentUserProfileAliases as n, readUserProfileDirectory as r, listProfiles as t };

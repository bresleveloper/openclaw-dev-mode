import { i as resolveGlobalSet } from "./global-singleton-DrXvEBww.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { c as normalizeDatabasePath } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as publishSqliteCommittedState, o as stageSqliteCommittedPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
//#region src/state/user-github-connection-events.ts
const authorityObservers = resolveGlobalSet(Symbol.for("openclaw.userGitHubConnectionAuthority"), "close-and-restart");
const retirementObservers = resolveGlobalSet(Symbol.for("openclaw.userGitHubProfileRetirement"), "close-and-restart");
function observeUserGitHubConnectionAuthority(observer) {
	return registerListener(authorityObservers, observer);
}
function invalidateUserGitHubConnectionAuthority(databasePath, changedOwners) {
	notifyListeners(authorityObservers, {
		databasePath: normalizeDatabasePath(databasePath),
		changedOwners
	});
}
function observeUserGitHubProfileRetirement(observer) {
	return registerListener(retirementObservers, observer);
}
function publishUserGitHubProfileRetirement(ids) {
	if (ids.length > 0) notifyListeners(retirementObservers, ids);
}
function committedPublication(databasePath, receipt) {
	const publication = {
		...receipt,
		databasePath: normalizeDatabasePath(databasePath)
	};
	const revoke = () => notifyListeners(authorityObservers, publication);
	return {
		installFacts: revoke,
		invalidate: revoke,
		notify: () => publishUserGitHubProfileRetirement(receipt.retiredProfileIds)
	};
}
/** Install the whole nonsecret batch before public profile-retirement observers. */
function publishUserGitHubConnectionCommit(databasePath, receipt) {
	publishSqliteCommittedState(committedPublication(databasePath, receipt));
}
function stageUserGitHubConnectionCommit(db, receipt) {
	if (!stageSqliteCommittedPublication(db, committedPublication(readTrackedStateDatabaseIdentity(db)?.canonicalPath ?? "", receipt))) throw new Error("Personal GitHub connection publication requires its write transaction");
}
//#endregion
export { stageUserGitHubConnectionCommit as a, publishUserGitHubConnectionCommit as i, observeUserGitHubConnectionAuthority as n, observeUserGitHubProfileRetirement as r, invalidateUserGitHubConnectionAuthority as t };

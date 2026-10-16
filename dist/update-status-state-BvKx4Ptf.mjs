//#region src/infra/update-status-state.ts
let updateAvailableCache = null;
let updateScheduleCache = null;
function getUpdateAvailable() {
	return updateAvailableCache;
}
function getUpdateSchedule() {
	return updateScheduleCache;
}
function withoutUpdateCampaign(schedule) {
	const { campaign: _campaign, ...rest } = schedule;
	return rest;
}
function withoutUpdateTarget(schedule) {
	const { target: _target, campaign: _campaign, ...rest } = schedule;
	return rest;
}
function sameUpdateAvailable(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.currentVersion === b.currentVersion && a.latestVersion === b.latestVersion && a.channel === b.channel && a.currentSha === b.currentSha && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.repositoryUrl === b.repositoryUrl && a.commitsBehind === b.commitsBehind && JSON.stringify(a.commits) === JSON.stringify(b.commits);
}
function setUpdateScheduleCache(params) {
	if (JSON.stringify(updateScheduleCache) === JSON.stringify(params.next)) return;
	updateScheduleCache = params.next;
	params.onUpdateScheduleChange?.(params.next);
}
function setUpdateAvailableCache(params) {
	if (sameUpdateAvailable(updateAvailableCache, params.next)) return;
	updateAvailableCache = params.next;
	params.onUpdateAvailableChange?.(params.next);
}
//#endregion
export { withoutUpdateCampaign as a, setUpdateScheduleCache as i, getUpdateSchedule as n, withoutUpdateTarget as o, setUpdateAvailableCache as r, getUpdateAvailable as t };

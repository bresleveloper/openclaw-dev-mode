//#region src/infra/update-status-state.ts
let updateAvailableCache = null;
let updateScheduleCache = null;
function getUpdateAvailable() {
	return updateAvailableCache;
}
function getUpdateSchedule() {
	return updateScheduleCache;
}
function sameUpdateAvailable(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	return a.currentVersion === b.currentVersion && a.latestVersion === b.latestVersion && a.channel === b.channel && a.currentSha === b.currentSha && a.upstreamRef === b.upstreamRef && a.upstreamSha === b.upstreamSha && a.repositoryUrl === b.repositoryUrl && a.commitsBehind === b.commitsBehind && JSON.stringify(a.commits) === JSON.stringify(b.commits);
}
function sameUpdateSchedule(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
}
function setUpdateScheduleCache(params) {
	if (sameUpdateSchedule(updateScheduleCache, params.next)) return;
	updateScheduleCache = params.next;
	params.onUpdateScheduleChange?.(params.next);
}
function setUpdateAvailableCache(params) {
	if (sameUpdateAvailable(updateAvailableCache, params.next)) return;
	updateAvailableCache = params.next;
	params.onUpdateAvailableChange?.(params.next);
}
//#endregion
export { setUpdateScheduleCache as i, getUpdateSchedule as n, setUpdateAvailableCache as r, getUpdateAvailable as t };

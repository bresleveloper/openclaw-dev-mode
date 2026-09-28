import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { C as parseCronRunScopeSuffix } from "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as isTerminalTaskStatus } from "./task-registry.types-CkM1jc3D.mjs";
import { n as prepareTaskRegistryRead } from "./task-registry-read-BpKCOEEj.mjs";
import { t as buildTaskStatusSnapshot } from "./task-status-D1-umRs5.mjs";
import { l as listTaskSessionActivity, n as findTaskByRunId, p as listTasksForRelatedSessionKey, s as listTaskRecords } from "./task-registry-query-Bd-H3o4L.mjs";
import "./task-registry-D10gtSrV.mjs";
//#region src/tasks/generated-media-task-activity.ts
const GENERATED_MEDIA_TASK_ACTIVITY_KEY = Symbol.for("openclaw.generatedMediaTaskActivity");
const GENERATED_MEDIA_TASK_ADMISSIONS_KEY = Symbol.for("openclaw.generatedMediaTaskAdmissions");
const GENERATED_MEDIA_TASK_ADMISSIONS_MAX_ENTRIES = 2048;
function getActiveGeneratedMediaTasks() {
	return resolveGlobalSingleton(GENERATED_MEDIA_TASK_ACTIVITY_KEY, () => /* @__PURE__ */ new Map());
}
function getLatestGeneratedMediaTaskAdmissions() {
	return resolveGlobalSingleton(GENERATED_MEDIA_TASK_ADMISSIONS_KEY, () => /* @__PURE__ */ new Map());
}
/** Tracks in-process generated-media work even when a plugin owns task persistence. */
function registerGeneratedMediaTaskActivity(runId, sessionKey) {
	if (!runId || !sessionKey) return;
	const active = getActiveGeneratedMediaTasks();
	if (!active.has(runId)) {
		const admissions = getLatestGeneratedMediaTaskAdmissions();
		admissions.delete(sessionKey);
		admissions.set(sessionKey, runId);
		pruneMapToMaxSize(admissions, GENERATED_MEDIA_TASK_ADMISSIONS_MAX_ENTRIES);
	}
	active.set(runId, sessionKey);
}
/** Clears in-process generated-media activity after terminal task bookkeeping. */
function clearGeneratedMediaTaskActivity(runId) {
	getActiveGeneratedMediaTasks().delete(runId);
}
/** Lists active generated-media run ids for one exact requester session. */
function listActiveGeneratedMediaTaskIdsForSessionKey(sessionKey) {
	const runIds = [];
	for (const [runId, requesterSessionKey] of getActiveGeneratedMediaTasks()) if (requesterSessionKey === sessionKey) runIds.push(runId);
	return runIds;
}
/** Returns the set of all session keys with in-process generated-media activity. */
function getAllActiveGeneratedMediaSessionKeys() {
	return new Set(getActiveGeneratedMediaTasks().values());
}
/** Returns the latest admitted run id even after that task became terminal. */
function getLatestGeneratedMediaTaskAdmissionIdForSessionKey(sessionKey) {
	return getLatestGeneratedMediaTaskAdmissions().get(sessionKey);
}
function resetGeneratedMediaTaskActivityForTests() {
	getActiveGeneratedMediaTasks().clear();
	getLatestGeneratedMediaTaskAdmissions().clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.generatedMediaTaskActivityTestApi")] = { resetGeneratedMediaTaskActivityForTests };
//#endregion
//#region src/tasks/task-status-access.ts
const GENERATED_MEDIA_TASK_KINDS = /* @__PURE__ */ new Set([
	"image_generation",
	"music_generation",
	"video_generation"
]);
function listTasksForSessionKeyForStatus(sessionKey, sessionAgentId) {
	return listTasksForRelatedSessionKey(sessionKey, sessionAgentId);
}
function listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey) {
	return listTaskRecords((task) => task.requesterSessionKey === sessionKey || task.ownerKey === sessionKey);
}
/** Session details and agent fallback counts share one accepted-write read. */
async function readTaskStatusSnapshots(params) {
	const read = await prepareTaskRegistryRead();
	if (!read) throw new Error("Task activity did not stabilize. Retry the status lookup.");
	const session = buildTaskStatusSnapshot(params.sessionKey === void 0 ? [] : read.listTasksForRelatedSessionKey(params.sessionKey, params.agentId));
	return {
		session,
		agent: session.totalCount === 0 ? buildTaskStatusSnapshot(read.listTasksForAgentId(params.agentId)) : void 0,
		assertCurrent: read.assertCurrent
	};
}
function findTaskByRunIdForStatus(runId) {
	return findTaskByRunId(runId);
}
/** Snapshots generated-media task ids so replay guards stay attempt-local. */
function getGeneratedMediaTaskIdsForSessionKey(sessionKey) {
	if (!sessionKey || !parseCronRunScopeSuffix(sessionKey).runId) return /* @__PURE__ */ new Set();
	const taskIds = listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey).filter((task) => GENERATED_MEDIA_TASK_KINDS.has(task.taskKind ?? "")).map((task) => task.taskId);
	const latestAdmission = getLatestGeneratedMediaTaskAdmissionIdForSessionKey(sessionKey);
	return /* @__PURE__ */ new Set([...taskIds, ...latestAdmission ? [`run:${latestAdmission}`] : []]);
}
/** Returns whether one attempt admitted generated-media work after its snapshot. */
function hasNewGeneratedMediaTaskForSessionKey(sessionKey, before) {
	for (const taskId of getGeneratedMediaTaskIdsForSessionKey(sessionKey)) if (!before.has(taskId)) return true;
	return false;
}
/** Returns whether generated-media work still needs this run's continuation row. */
function hasPendingGeneratedMediaTaskForSessionKey(sessionKey) {
	if (!parseCronRunScopeSuffix(sessionKey).runId) return false;
	if (listActiveGeneratedMediaTaskIdsForSessionKey(sessionKey).length > 0) return true;
	return listTasksForOwnerOrRequesterSessionKeyForStatus(sessionKey).some((task) => GENERATED_MEDIA_TASK_KINDS.has(task.taskKind ?? "") && !isTerminalTaskStatus(task.status));
}
/**
* Builds a one-shot snapshot of all session keys with pending generated-media
* work. Consume this once per reaper sweep for O(1) per-row lookups instead of
* repeating global task and activity scans for every cron continuation row.
*/
function buildPendingGeneratedMediaSessionKeySet() {
	const keys = getAllActiveGeneratedMediaSessionKeys();
	for (const task of listTaskSessionActivity()) if (GENERATED_MEDIA_TASK_KINDS.has(task.taskKind ?? "") && !isTerminalTaskStatus(task.status)) {
		if (task.requesterSessionKey) keys.add(task.requesterSessionKey);
		if (task.ownerKey) keys.add(task.ownerKey);
	}
	return keys;
}
//#endregion
export { hasPendingGeneratedMediaTaskForSessionKey as a, readTaskStatusSnapshots as c, hasNewGeneratedMediaTaskForSessionKey as i, clearGeneratedMediaTaskActivity as l, findTaskByRunIdForStatus as n, listTasksForOwnerOrRequesterSessionKeyForStatus as o, getGeneratedMediaTaskIdsForSessionKey as r, listTasksForSessionKeyForStatus as s, buildPendingGeneratedMediaSessionKeySet as t, registerGeneratedMediaTaskActivity as u };

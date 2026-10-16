import { n as serveWorkerTasks } from "../../worker-task-server-BC_7U18u.mjs";
import { n as readSessionPhysicalDiskUsage } from "../../disk-budget-files-B8vQUZNi.mjs";
//#region src/config/sessions/disk-budget.worker.ts
serveWorkerTasks((input) => {
	return readSessionPhysicalDiskUsage(input);
});
//#endregion
export {};

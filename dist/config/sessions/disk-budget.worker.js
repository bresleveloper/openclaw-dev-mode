import { n as readSessionPhysicalDiskUsage } from "../../disk-budget-files-BzvMDr8r.mjs";
import { n as serveWorkerTasks } from "../../worker-task-server-sMsYUF1K.mjs";
//#region src/config/sessions/disk-budget.worker.ts
serveWorkerTasks((input) => {
	return readSessionPhysicalDiskUsage(input);
});
//#endregion
export {};

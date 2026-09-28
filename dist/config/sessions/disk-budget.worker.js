import { n as serveWorkerTasks } from "../../worker-task-server-CwtaNZgU.mjs";
import { n as readSessionPhysicalDiskUsage } from "../../disk-budget-files-CfTNC_Oe.mjs";
//#region src/config/sessions/disk-budget.worker.ts
serveWorkerTasks((input) => {
	return readSessionPhysicalDiskUsage(input);
});
//#endregion
export {};

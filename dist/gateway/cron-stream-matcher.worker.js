import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
//#region src/gateway/cron-stream-matcher.worker.ts
serveWorkerTasks((input) => {
	if (!isRecord(input) || typeof input.pattern !== "string" || !Array.isArray(input.lines) || !input.lines.every((line) => typeof line === "string")) throw new Error("invalid cron stream match request");
	const matcher = new RegExp(input.pattern);
	return input.lines.some((line) => matcher.test(line));
});
//#endregion
export {};

import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import path from "node:path";
//#region src/infra/state-migrations.restart-sentinel.ts
function assertNoRetiredRestartSentinelFiles(stateDir) {
	assertNoRetiredStateFiles("Restart sentinel JSON", [path.join(stateDir, "restart-sentinel.json"), path.join(stateDir, "restart-sentinel.json.doctor-importing")]);
}
//#endregion
export { assertNoRetiredRestartSentinelFiles as t };

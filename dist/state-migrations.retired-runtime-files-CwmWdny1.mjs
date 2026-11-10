import { i as resolveRequiredHomeDir } from "./home-dir-CtsdYvX3.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import { t as assertNoRetiredRestartSentinelFiles } from "./state-migrations.restart-sentinel-B-ul81s9.mjs";
import os from "node:os";
import path from "node:path";
//#region src/infra/state-migrations.retired-runtime-files.ts
function assertNoRetiredRuntimeStateFiles(stateDir, env = process.env, homedir = os.homedir) {
	const defaultStateDir = path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
	assertNoRetiredStateFiles("Runtime JSON sidecars", [
		path.join(stateDir, "acp", "event-ledger.json"),
		path.join(stateDir, "acp", "event-ledger.json.doctor-import"),
		path.join(stateDir, "settings", "voicewake.json"),
		path.join(stateDir, "settings", "voicewake-routing.json"),
		path.join(stateDir, "bindings", "current-conversations.json"),
		...path.resolve(stateDir) === path.resolve(defaultStateDir) ? [path.join(defaultStateDir, "plugin-binding-approvals.json")] : []
	]);
	assertNoRetiredRestartSentinelFiles(stateDir);
}
//#endregion
export { assertNoRetiredRuntimeStateFiles as t };

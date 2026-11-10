import { t as expandHomePrefix } from "./home-dir-CtsdYvX3.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { g as resolveConfigDir } from "./utils-gjJ-tD2q.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import path from "node:path";
//#region src/cron/store/config-state.ts
function readCronStoreStatePath(env = process.env) {
	const value = readConfigMachineState("cron.store", { env });
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
/** Runtime selection reads through the shared-state worker. */
async function readCronStoreStatePathAsync(env = process.env) {
	const result = await executeExistingOpenClawStateRead({ env }, { type: "cron.store" });
	if (!result) return;
	const value = result.row ? JSON.parse(result.row.value_json) : void 0;
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
//#region src/cron/store/paths.ts
function resolveDefaultCronDir(env) {
	return path.join(resolveConfigDir(env), "cron");
}
function resolveDefaultCronStorePath(env) {
	return path.join(resolveDefaultCronDir(env), "jobs.json");
}
/** Resolves the cron jobs store path, expanding home-relative user input. */
function resolveCronJobsStorePath(storePath, env = process.env, stateEnv = env) {
	return resolveSelectedCronJobsStorePath(storePath?.trim() || readCronStoreStatePath(stateEnv), env);
}
/** Expand an already-selected partition without reading machine state. */
function resolveSelectedCronJobsStorePath(selected, env) {
	if (selected) {
		const raw = selected.trim();
		if (raw.startsWith("~")) return path.resolve(expandHomePrefix(raw, { env }));
		return path.resolve(raw);
	}
	return resolveDefaultCronStorePath(env);
}
/** Resolves the active cron partition from runtime config and environment. */
function resolveCronJobsStorePathFromConfig(cfg, env = process.env, stateEnv = env) {
	const store = asOptionalRecord(cfg.cron)?.store;
	return resolveCronJobsStorePath(typeof store === "string" ? store : void 0, env, stateEnv);
}
/** Runtime path selection never opens SQLite on the caller's thread. */
async function resolveCronJobsStorePathAsync(storePath, env = process.env, stateEnv = env) {
	return resolveSelectedCronJobsStorePath(storePath?.trim() || await readCronStoreStatePathAsync(stateEnv), env);
}
async function resolveCronJobsStorePathFromConfigAsync(cfg, env = process.env, stateEnv = env) {
	const store = asOptionalRecord(cfg.cron)?.store;
	return resolveCronJobsStorePathAsync(typeof store === "string" ? store : void 0, env, stateEnv);
}
//#endregion
export { resolveSelectedCronJobsStorePath as a, resolveCronJobsStorePathFromConfigAsync as i, resolveCronJobsStorePathAsync as n, resolveCronJobsStorePathFromConfig as r, resolveCronJobsStorePath as t };

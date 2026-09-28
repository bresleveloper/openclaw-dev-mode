import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import path from "node:path";
//#region src/cron/store/config-state.ts
function readCronStoreStatePath(env = process.env) {
	const value = readConfigMachineState("cron.store", { env });
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
	const selected = storePath?.trim() || readCronStoreStatePath(stateEnv);
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
//#endregion
export { resolveCronJobsStorePathFromConfig as n, resolveCronJobsStorePath as t };

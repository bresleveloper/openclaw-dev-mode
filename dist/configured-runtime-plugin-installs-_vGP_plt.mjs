import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-CnGRVnDe.mjs";
//#region src/commands/doctor/shared/configured-runtime-plugin-installs.ts
function acpxRuntimeIsConfigured(cfg) {
	const acp = asOptionalRecord(cfg.acp);
	const backend = typeof acp?.backend === "string" ? acp.backend.trim().toLowerCase() : "";
	return (backend === "acpx" || acp?.enabled === true || asOptionalRecord(acp?.dispatch)?.enabled === true) && (!backend || backend === "acpx");
}
/** Collect runtime ids without loading plugin metadata during startup planning. */
function collectConfiguredRuntimeIds(cfg, options) {
	const ids = new Set(collectConfiguredAgentHarnessRuntimes(cfg, options));
	if (acpxRuntimeIsConfigured(cfg)) ids.add("acpx");
	return [...ids].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { collectConfiguredRuntimeIds as t };

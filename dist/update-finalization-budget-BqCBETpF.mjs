import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { p as readUpdateStateDatabaseSizes } from "./update-candidate-state-CO0vwfHU.mjs";
import { tmpdir } from "node:os";
//#region src/infra/update-finalization-budget.ts
const FINALIZE_PROCESS_STEP_BUDGET_MULTIPLIER = 6;
async function resolveUpdateFinalizationTimeoutMs(perStepTimeoutMs, options = {}) {
	const env = options.env ?? process.env;
	const files = /* @__PURE__ */ new Set([resolveOpenClawStateSqlitePath(env), ...(options.databases ?? []).map((database) => database.path)]);
	const stateBudgetMs = resolveAggregateSqliteInspectionTimeoutMs("update activation", await readUpdateStateDatabaseSizes([...files], {
		nodeRunner: options.nodeRunner ?? process.execPath,
		sourceEnv: env,
		stagingRoot: tmpdir(),
		timeoutMs: perStepTimeoutMs
	}));
	return Math.max(perStepTimeoutMs ?? 12e5, stateBudgetMs, options.observedStartupMs ?? 0) * (FINALIZE_PROCESS_STEP_BUDGET_MULTIPLIER + (options.pluginCount ?? 0));
}
//#endregion
export { resolveUpdateFinalizationTimeoutMs as t };

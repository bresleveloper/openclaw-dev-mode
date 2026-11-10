import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
//#region src/commands/doctor-lint.ts
/** Delegate rehearsal lint before loading the worker's health-check graph. */
async function runDoctorLintCli(runtime, opts) {
	if (runtime === defaultRuntime && opts.json && resolveUpdateRehearsalRoot(process.env)) {
		const { hasCliProcessScope } = await import("./runtime-cleanup-scope-B7DoY3fg.mjs");
		if (hasCliProcessScope()) {
			const { runUpdateDoctorLintProcess } = await import("./doctor-lint-process-CETporyA.mjs");
			const { resolveDoctorUpdateBudget } = await import("./doctor-update-budget-C-WzZKv-.mjs");
			return runUpdateDoctorLintProcess(opts, await resolveDoctorUpdateBudget({
				cfg: {},
				env: process.env
			}));
		}
	}
	const { runDoctorLintCliInProcess } = await import("./doctor-lint-runner-CrgYvHwq.mjs");
	return runDoctorLintCliInProcess(runtime, opts);
}
//#endregion
export { runDoctorLintCli };

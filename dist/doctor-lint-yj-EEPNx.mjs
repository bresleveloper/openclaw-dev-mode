import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
//#region src/commands/doctor-lint.ts
/** Delegate rehearsal lint before loading the worker's health-check graph. */
async function runDoctorLintCli(runtime, opts) {
	if (runtime === defaultRuntime && opts.json && resolveUpdateRehearsalRoot(process.env)) {
		const { hasCliProcessScope } = await import("./runtime-cleanup-scope-DfAoBUW-.mjs");
		if (hasCliProcessScope()) {
			const { runUpdateDoctorLintProcess } = await import("./doctor-lint-process-wEvFaflE.mjs");
			const { resolveDoctorUpdateBudget } = await import("./doctor-update-budget-D0yAebwu.mjs");
			return runUpdateDoctorLintProcess(opts, (await resolveDoctorUpdateBudget({
				cfg: {},
				env: process.env
			}))?.disposalDeadlineMs);
		}
	}
	const { runDoctorLintCliInProcess } = await import("./doctor-lint-runner-LygvR4jX.mjs");
	return runDoctorLintCliInProcess(runtime, opts);
}
//#endregion
export { runDoctorLintCli };

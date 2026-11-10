import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { n as runUpdateFailureTriage } from "./update-triage-CzS2xTS-.mjs";
//#region src/commands/triage-failure.ts
/** Startup failures collect diagnostics; only an operator can start a repair agent. */
async function triageAfterFailure(runtime, failure, signal) {
	await runUpdateFailureTriage({
		mode: "non-interactive",
		runtime: {
			log: (...args) => runtime.error(...args),
			error: (...args) => runtime.error(...args)
		},
		failure: { error: `${failure.phase}: ${failure.error}` },
		target: {
			root: failure.installationRoot,
			env: { ...process.env }
		},
		resolveRoot: async () => await resolveOpenClawPackageRoot({ argv1: process.argv[1] }) ?? "",
		signal
	});
}
//#endregion
export { triageAfterFailure };

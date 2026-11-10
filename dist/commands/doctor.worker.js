import { r as defaultRuntime } from "../runtime-BazLsT0s.mjs";
import { t as enableConsoleCapture } from "../console-CML7QnOp.mjs";
import { a as withCliCommandCleanup, o as withCliProcessScope } from "../runtime-cleanup-scope-Dv2f28xK.mjs";
import { a as waitForPendingCliDisposers, r as runCliDisposer, t as closeCliResources } from "../runtime-cleanup-DQlcWeTy.mjs";
import { i as runCliWithExitFinalization, t as exitCliAfterOutput } from "../one-shot-exit-DmuNrGrj.mjs";
import { t as scrubDoctorErrorMessage } from "../doctor-error-message-CBAGGfGW.mjs";
//#region src/commands/doctor.worker.ts
async function runDoctorWorker() {
	enableConsoleCapture();
	await withCliProcessScope(() => withCliCommandCleanup(false, async (cleanup) => {
		let exitCode;
		try {
			const { runDoctorLintCli } = await import("../doctor-lint-CCVmQOI7.mjs");
			exitCode = await runDoctorLintCli(defaultRuntime, {});
		} finally {
			await closeCliResources(cleanup);
			const resources = cleanup?.pluginResources;
			if (resources) await runCliDisposer("plugin-registration-resources", () => resources.release());
		}
		exitCliAfterOutput(defaultRuntime, exitCode);
	}));
}
runCliWithExitFinalization({
	run: runDoctorWorker,
	finalize: waitForPendingCliDisposers,
	onError(error) {
		defaultRuntime.error(`Doctor failed: ${scrubDoctorErrorMessage(error)}`);
		process.exitCode = 1;
	}
});
//#endregion
export {};

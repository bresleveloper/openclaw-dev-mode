import { r as defaultRuntime } from "../runtime-DlO3PTAd.mjs";
import { a as waitForPendingCliDisposers, r as runCliDisposer, t as closeCliResources } from "../runtime-cleanup-BrX8Cb4t.mjs";
import { r as runCliWithExitFinalization, t as exitCliAfterOutput } from "../one-shot-exit-CSOrFNcy.mjs";
import { t as enableConsoleCapture } from "../console-BnFs8ZzT.mjs";
import { a as withCliCommandCleanup, o as withCliProcessScope } from "../runtime-cleanup-scope-BktLDe8P.mjs";
import { t as scrubDoctorErrorMessage } from "../doctor-error-message-CBAGGfGW.mjs";
//#region src/commands/doctor.worker.ts
async function runDoctorWorker() {
	enableConsoleCapture();
	await withCliProcessScope(() => withCliCommandCleanup(false, async (cleanup) => {
		try {
			const { doctorCommand } = await import("../doctor-xFiPUNjy.mjs");
			await doctorCommand(defaultRuntime, { nonInteractive: true });
		} finally {
			await closeCliResources(cleanup);
			const resources = cleanup?.pluginResources;
			if (resources) await runCliDisposer("plugin-registration-resources", () => resources.release());
		}
		exitCliAfterOutput(defaultRuntime, 0);
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

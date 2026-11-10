import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { i as registerSignalExitBarrier, n as installCliDoctorSignalExitHandlers } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { S as writeUpdatePostInstallDoctorResult, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, p as createUpdatePostInstallDoctorResultPath, u as consumeUpdatePostInstallDoctorResult } from "./update-doctor-result-oZ38327j.mjs";
import { r as resolveCommandProcessSignal } from "./exec-spawn-Cn2m7YAI.mjs";
import { r as runUpdateDoctorProcess } from "./update-command-doctor-child-C43avymO.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/run-main-doctor-result.ts
/** The native stdout adapter retains the existing file IPC and child settlement owner. */
async function tryRunDoctorResultBridge(argv) {
	if (process.env["OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH"]?.trim() !== "-") return false;
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: argv[1],
		cwd: process.cwd()
	});
	if (!root || !argv[1]) throw new Error("Doctor process custody requires its installed CLI root.");
	const resultPath = createUpdatePostInstallDoctorResultPath();
	const controller = new AbortController();
	const callerSignal = resolveCommandProcessSignal();
	const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	let worker;
	let settlement;
	const releaseBarrier = registerSignalExitBarrier(async () => {
		controller.abort();
		await worker?.catch(() => {});
	});
	installCliDoctorSignalExitHandlers();
	let exitCode = 1;
	let failed = false;
	try {
		worker = runUpdateDoctorProcess({
			root,
			runId: randomUUID(),
			onProcessSettlement: (step) => settlement = step
		}, [
			process.execPath,
			...process.execArgv,
			...argv.slice(1)
		], {
			cwd: process.cwd(),
			baseEnv: process.env,
			env: { [UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]: resultPath },
			signal,
			maxOutputBytes: 4194304,
			terminateOnOutputLimit: true,
			terminateOnOutputError: true,
			onOutputChunk: (chunk, stream) => process[stream].write(chunk)
		});
		try {
			exitCode = (await worker).code ?? 1;
		} catch (error) {
			failed = true;
			defaultRuntime.error(scrubDoctorErrorMessage(error));
		}
		const captured = await consumeUpdatePostInstallDoctorResult(resultPath);
		const failureFacts = [...captured?.failureFacts ?? [], ...settlement?.failureFacts ?? []];
		const result = {
			...captured ?? { status: "error" },
			...failed || !captured || settlement?.exitCode === 1 ? { status: "error" } : {},
			...failureFacts.length ? { failureFacts } : {},
			...settlement?.advisory ? { warnings: [...captured?.warnings ?? [], settlement.advisory.message] } : {}
		};
		const completedRepair = !failed && captured && (captured.status === "ok" || captured.status === "advisory") && !captured.maintenanceRefusal && !captured.configWriteRefusal && !failureFacts.length && settlement?.exitCode === 0 && settlement.advisory?.kind === "recoverable-maintenance";
		if (captured) await writeUpdatePostInstallDoctorResult({
			resultPath: "-",
			result
		});
		process.exitCode = result.status === "error" ? 1 : completedRepair ? result.status === "advisory" ? 86 : 0 : exitCode;
		return true;
	} finally {
		releaseBarrier();
	}
}
//#endregion
export { tryRunDoctorResultBridge };

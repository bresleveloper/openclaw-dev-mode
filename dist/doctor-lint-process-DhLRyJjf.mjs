import { t as drainProcessOutput } from "./output-drain-DMosb1D5.mjs";
import { n as registerSignalExitBarrier } from "./signal-exit-barrier-BG0KH3HC.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as resolveCommandProcessSignal } from "./exec-spawn-B7redWCL.mjs";
import { r as scheduleAbsoluteDeadline } from "./absolute-deadline-BXzjx6E8.mjs";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { a as parseUpdateDoctorLintReport, t as UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX } from "./update-doctor-lint-BRvmoWQ9.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { fileURLToPath } from "node:url";
import { StringDecoder } from "node:string_decoder";
//#region src/commands/doctor-lint-process.ts
const MAX_OUTPUT_BYTES = 1048576;
/** The copied rehearsal may stop its private inspector after its checks have reported. */
async function runUpdateDoctorLintProcess(opts, disposalDeadlineMs) {
	if (!resolveUpdateRehearsalRoot(process.env) || opts.json !== true) throw new Error("Doctor lint worker requires an isolated update rehearsal in JSON mode.");
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.doctorLint);
	const controller = new AbortController();
	const callerSignal = resolveCommandProcessSignal();
	const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	const started = Date.now();
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let report;
	let reportedAt;
	let disposalTerminationRequested = false;
	let callerAborted = false;
	let outputError;
	let cancelDisposalDeadline;
	let worker;
	const releaseBarrier = registerSignalExitBarrier(async () => {
		callerAborted = true;
		controller.abort();
		await worker;
	});
	const onOutputError = (error) => {
		outputError ??= error;
		controller.abort();
	};
	process.stdout.on("error", onOutputError);
	process.stderr.on("error", onOutputError);
	try {
		worker = runUtf8CommandWithTimeout([process.execPath, ...resolveRuntimeWorkerArgv(workerUrl)], {
			input: JSON.stringify(opts),
			baseEnv: process.env,
			.../\.[cm]?ts$/.test(fileURLToPath(workerUrl)) ? { env: { TSX_TSCONFIG_PATH: fileURLToPath(new URL("../../tsconfig.json", workerUrl)) } } : {},
			signal,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			killSignal: "SIGKILL",
			maxOutputBytes: MAX_OUTPUT_BYTES,
			terminateOnOutputError: true,
			terminateOnOutputLimit: true,
			onOutputChunk(chunk, stream) {
				if (stream === "stderr") {
					process.stderr.write(chunk);
					return;
				}
				pending += decoder.write(chunk);
				if (report) {
					if (pending.trim()) throw new Error("Doctor lint worker emitted output after its readiness report.");
					return;
				}
				const newline = pending.indexOf("\n");
				if (newline < 0) return;
				const line = pending.slice(0, newline);
				const parsed = parseUpdateDoctorLintReport(line);
				pending = pending.slice(newline + 1);
				if (pending.trim()) throw new Error("Doctor lint worker emitted more than one readiness report.");
				report = parsed;
				reportedAt = Date.now();
				process.stdout.write(`${line}\n`);
				const allowance = Math.max(5e3, reportedAt - started);
				cancelDisposalDeadline = scheduleAbsoluteDeadline(Math.min(reportedAt + allowance, disposalDeadlineMs ?? Infinity), () => {
					disposalTerminationRequested = true;
					controller.abort();
				});
			}
		});
		const result = await worker;
		if (callerAborted || callerSignal?.aborted || outputError || result.outputErrorStream || result.outputLimitExceeded || result.cleanup === "uncertain") throw new Error("Doctor lint worker did not complete with confirmed output and process cleanup.");
		if (!report || reportedAt === void 0) throw new Error("Doctor lint worker exited before reporting completed checks.");
		parseUpdateDoctorLintReport(result.stdout);
		const exitCode = report.ok ? 0 : 1;
		const stoppedDisposal = disposalTerminationRequested && result.killIssuedByAbort && result.cleanup === "forced";
		if (stoppedDisposal) process.stderr.write(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX} timed out after ${Date.now() - reportedAt}ms; checks completed.\n`);
		if (result.termination === "exit" && result.code === exitCode || stoppedDisposal) {
			await new Promise((resolve) => {
				drainProcessOutput(resolve);
			});
			if (outputError || callerAborted || callerSignal?.aborted) throw new Error("Doctor lint output delivery or its caller failed after checks completed.");
			return exitCode;
		}
		throw new Error(`Doctor lint worker exited unexpectedly after reporting checks (${result.termination}, code ${result.code}).`);
	} catch (error) {
		if (!report) throw error;
		process.stderr.write(`Doctor lint worker failed: ${scrubDoctorErrorMessage(error)}\n`);
		return 2;
	} finally {
		cancelDisposalDeadline?.();
		releaseBarrier();
		process.stdout.off("error", onOutputError);
		process.stderr.off("error", onOutputError);
	}
}
//#endregion
export { runUpdateDoctorLintProcess };

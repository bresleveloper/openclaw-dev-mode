import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as createSanitizedCommandError, t as CommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { t as parseOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import { c as withUpdateCommandExecutorChild, d as UpdateCommandRecoveryPendingError } from "./update-command-executor-DDhDn9_F.mjs";
import fs from "node:fs/promises";
//#region src/cli/update-cli/update-command-doctor-child.ts
/** Inspect the same published --check contract consumed by candidate canary. */
async function inspectUpdateDoctorChildSupport(argv, options, assertCurrent) {
	assertCurrent();
	const workerPath = argv[1];
	if (!workerPath) throw new UpdateCommandRecoveryPendingError("Target Doctor worker path is missing.");
	try {
		await fs.lstat(workerPath);
	} catch (cause) {
		if (hasErrnoCode(cause, "ENOENT")) {
			assertCurrent();
			return false;
		}
		throw new UpdateCommandRecoveryPendingError("Target Doctor worker could not be inspected.", { cause });
	}
	assertCurrent();
	let result;
	try {
		result = await runUtf8CommandWithTimeout([...argv, "--check"], {
			...options,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			maxOutputBytes: 65536,
			terminateOnOutputLimit: true
		});
	} catch (cause) {
		throw new UpdateCommandRecoveryPendingError("Target Doctor capability could not be inspected.", { cause });
	}
	assertCurrent();
	let contract;
	try {
		contract = JSON.parse(result.stdout);
	} catch {}
	if (result.code !== 0 || result.termination !== "exit" || result.cleanup !== "normal" || result.outputLimitExceeded || result.outputErrorStream || !isRecord(contract) || !parseOpenClawSchemaVersions(contract)) throw new UpdateCommandRecoveryPendingError("Target Doctor capability could not be inspected.");
	const capability = contract.doctorConfigWrites;
	if (capability !== void 0 && capability !== "pid-start-v1") throw new UpdateCommandRecoveryPendingError("Target Doctor authority protocol is unsupported.");
	return capability === "pid-start-v1";
}
/** Package and finalization Doctors use the same private-input/native-child owner. */
async function withUpdateDoctorChild(params, operation) {
	const { context } = params;
	context.assertRequesterCurrent();
	return await withUpdateCommandExecutorChild(context.executorFence, params.root, async (executor, bindChild) => {
		context.assertRequesterCurrent();
		const input = {
			...params.input,
			executor,
			runId: context.runId,
			root: params.root,
			requester: context.requester
		};
		return await operation(async (argv, options) => {
			const result = await runUtf8CommandWithTimeout(argv, {
				...options,
				input: JSON.stringify(input),
				beforeInput: (pid, spawnedArgv) => {
					context.assertRequesterCurrent();
					bindChild(pid, spawnedArgv);
					context.onStateHandoff?.();
				},
				killProcessTree: true,
				requireProcessTreeExtinction: true
			});
			if (result.cleanup === "forced" || result.cleanup === "uncertain") throw new CommandProcessCleanupError();
			return result;
		});
	});
}
/** Adapt the owned process result to the existing fresh-Doctor diagnostic contract. */
function assertUpdateDoctorChildSucceeded(child) {
	if (child.code === 0 && child.termination === "exit" && !child.outputLimitExceeded && !child.outputErrorStream) return;
	const failure = {
		failed: true,
		...child.code !== null ? { exitCode: child.code } : {},
		...child.signal ? { signal: child.signal } : {},
		timedOut: child.termination === "timeout" || child.termination === "no-output-timeout",
		isCanceled: child.termination === "signal",
		isMaxBuffer: child.outputLimitExceeded === true,
		isTerminated: child.killed || Boolean(child.signal)
	};
	throw Object.assign(createSanitizedCommandError(failure), failure, {
		stdout: child.stdout,
		stderr: child.stderr
	});
}
//#endregion
export { inspectUpdateDoctorChildSupport as n, withUpdateDoctorChild as r, assertUpdateDoctorChildSucceeded as t };

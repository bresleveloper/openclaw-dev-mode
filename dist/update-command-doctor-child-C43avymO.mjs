import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { z as revokeSqliteDatabaseAdmissionsForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as createSanitizedCommandError, o as readCommandProcessFailure, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV } from "./update-doctor-result-oZ38327j.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { n as resolveCommandEnv } from "./exec-spawn-Cn2m7YAI.mjs";
import { t as parseOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { f as withUpdateCommandExecutorChild, m as UpdateCommandRecoveryPendingError } from "./update-command-executor-DUq8yLzH.mjs";
import { t as createUpdateDoctorProcessCustody } from "./update-doctor-process-custody-15rJBSoi.mjs";
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
	const contract = safeParseJsonRecord(result.stdout);
	if (result.code !== 0 || result.termination !== "exit" || result.cleanup !== "normal" || result.outputLimitExceeded || result.outputErrorStream || !contract || !parseOpenClawSchemaVersions(contract)) throw new UpdateCommandRecoveryPendingError("Target Doctor capability could not be inspected.");
	const capability = contract.doctorConfigWrites;
	if (capability !== void 0 && capability !== "pid-start-v1") throw new UpdateCommandRecoveryPendingError("Target Doctor authority protocol is unsupported.");
	return capability === "pid-start-v1";
}
/** Both delegated and standalone update Doctors publish through the same result channel. */
async function runUpdateDoctorProcess(context, argv, options) {
	const resultPath = options.env?.[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
	if (!resultPath) throw new UpdateCommandRecoveryPendingError("Doctor process custody requires its result channel.");
	const statePath = resolveOpenClawStateSqlitePath(resolveCommandEnv({
		argv,
		...options
	}));
	const custody = await createUpdateDoctorProcessCustody(context.runId, context.root, resultPath, context.processNamespace, context.privateInputContract);
	try {
		let outcome;
		try {
			outcome = { result: await runUtf8CommandWithTimeout(argv, {
				...options,
				killProcessTree: true,
				requireProcessTreeExtinction: true
			}) };
		} catch (error) {
			outcome = { error };
		}
		const settlement = await custody.settle("result" in outcome ? outcome.result : readCommandProcessFailure(outcome.error));
		if (settlement) {
			const error = new CommandProcessCleanupError("error" in outcome ? { cause: outcome.error } : void 0);
			error.message = settlement.stderrTail ?? "Doctor process settlement could not be recorded.";
			try {
				context.onProcessSettlement?.(settlement);
			} catch (cause) {
				if (settlement.exitCode !== 0) throw new AggregateError([error, cause], error.message, { cause });
				if ("error" in outcome) throw new AggregateError([outcome.error, cause], "Doctor settlement recording failed", { cause });
				throw cause;
			}
			if (settlement.exitCode !== 0) throw error;
		}
		if ("error" in outcome) throw outcome.error;
		return outcome.result;
	} finally {
		try {
			revokeSqliteDatabaseAdmissionsForPath(statePath);
		} finally {
			custody.close();
		}
	}
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
		return await operation((argv, options) => runUpdateDoctorProcess({
			...context,
			root: params.root,
			privateInputContract: "delegated-doctor",
			processNamespace: {
				roots: [
					executor.childKey,
					...executor.originalChildKey ? [executor.originalChildKey] : [],
					...executor.retainedChildKey ? [executor.retainedChildKey] : [],
					...executor.slot ? [executor.slot.childKey] : []
				],
				databaseIdentity: executor.databaseIdentity
			}
		}, argv, {
			...options,
			input: JSON.stringify(input),
			beforeInput: (pid, spawnedArgv) => {
				context.assertRequesterCurrent();
				bindChild(pid, spawnedArgv);
				context.onStateHandoff?.();
			}
		}));
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
export { withUpdateDoctorChild as i, inspectUpdateDoctorChildSupport as n, runUpdateDoctorProcess as r, assertUpdateDoctorChildSucceeded as t };

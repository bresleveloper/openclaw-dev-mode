import { s as trackAsyncWork } from "./async-work-scope-BH2yUdBz.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { d as isSqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { s as isRequiredUpdateRunStep } from "./update-run-write-Dd5ORe9V.mjs";
import { t as captureUpdateRunRedactionFacts } from "./update-run-codec-Guyb20ob.mjs";
import { t as UpdateRecoveryRequiredError } from "./update-run-recovery-schema-DparDBZU.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/update-run-write.async.ts
/** Capture the receipt before yielding and join its writer through native settlement. */
async function recordUpdateRunMutationAsync(runId, createCommand, options = {}) {
	options.assertAccepting?.();
	if (options.database || options.readOnly) throw new Error("Existing-state writes require their own tracked writable connection.");
	const captured = {
		...options,
		env: cloneEnvWithPlatformSemantics(options.env ?? process.env),
		...options.redactPaths ? { redactPaths: [...options.redactPaths] } : {}
	};
	const context = captured.context ?? captureOpenClawStateWorkerContext(captured);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		captured.signal?.throwIfAborted();
		captured.assertCurrent?.();
	};
	assertCurrent();
	const command = structuredClone(createCommand({
		runId,
		redactionFacts: captureUpdateRunRedactionFacts(captured.env),
		requireNoRecovery: captured.requireNoRecovery,
		busyTimeoutMs: captured.busyTimeoutMs,
		redactPaths: captured.redactPaths
	}));
	const completion = runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), {
		existingOnly: command.type !== "updateRuns.create",
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	}).catch((error) => {
		if (hasSqliteWorkerOutcomeUnknown(error) && !hasCommandProcessCleanupError(error)) throw new CommandProcessCleanupError({ cause: error });
		if (!hasCommandProcessCleanupError(error) && isSqliteWorkerError(error, "overloaded") && command.type === "updateRuns.recordStep" && !isRequiredUpdateRunStep(command.input.step)) {
			assertCurrent();
			return { kind: "bookkeeping-skipped" };
		}
		throw error;
	});
	captured.retainSettlement?.(completion.then(() => void 0));
	const reply = await completion;
	assertCurrent();
	if (!reply) throw new Error("Update history disappeared before recording its outcome");
	if (reply.kind === "recovery-required") throw new UpdateRecoveryRequiredError(reply.recovery);
	if (reply.kind === "bookkeeping-skipped") {
		console.warn("[update] History database is busy or worker admission timed out; bookkeeping was not recorded. The update will continue.");
		return;
	}
	return reply.record;
}
function recordUpdateRunStepAsync(runId, step, options = {}) {
	return recordUpdateRunMutationAsync(runId, (input) => ({
		type: "updateRuns.recordStep",
		input: {
			...input,
			step
		}
	}), options);
}
async function recordUpdateRunPhaseAsync(runId, phase, patch = {}, options = {}) {
	const record = await recordUpdateRunMutationAsync(runId, (input) => ({
		type: "updateRuns.recordPhase",
		input: {
			...input,
			phase,
			patch
		}
	}), options);
	if (!record) throw new Error("Required update phase was not recorded");
	return record;
}
async function createUpdateRunAsync(input, options = {}) {
	const run = {
		...input,
		runId: input.runId ?? randomUUID()
	};
	const record = await recordUpdateRunMutationAsync(run.runId, (mutation) => ({
		type: "updateRuns.create",
		input: {
			...mutation,
			run
		}
	}), options);
	if (!record) throw new Error("Update run was not created");
	return record;
}
async function finishUpdateRunAsync(runId, result, options = {}) {
	const record = await recordUpdateRunMutationAsync(runId, (input) => ({
		type: "updateRuns.finish",
		input: {
			...input,
			result
		}
	}), options);
	if (!record) throw new Error("Update run outcome was not recorded");
	return record;
}
async function recordUpdateRunVerificationAsync(runId, verification, options = {}) {
	const { onlyIfRunning } = options;
	const record = await recordUpdateRunMutationAsync(runId, (input) => ({
		type: "updateRuns.recordVerification",
		input: {
			...input,
			verification,
			onlyIfRunning
		}
	}), options);
	if (!record) throw new Error("Update verification was not recorded");
	return record;
}
async function recordUpdateRunDiagnosticsAsync(runId, diagnostics, warn, options = {}) {
	if (!(diagnostics.failure || diagnostics.recovery || diagnostics.rollbackOutcome || diagnostics.verification)) return;
	try {
		const { preserveRecovery } = options;
		return await recordUpdateRunMutationAsync(runId, (input) => ({
			type: "updateRuns.recordDiagnostics",
			input: {
				...input,
				diagnostics,
				preserveRecovery
			}
		}), options);
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		const fact = createUpdateErrorFact("requested", error, options.env);
		warn(`Update diagnostics could not be recorded (${fact.code}): ${fact.message ?? "no error message"}`);
		return;
	}
}
function createUpdateRunProcessIdentityWarning(runId, env) {
	return (pid, message) => {
		console.warn(`[update] ${message}`);
		if (runId) trackAsyncWork(() => recordUpdateRunStepAsync(runId, {
			step: `warning:process-start-identity:${pid}`,
			status: "completed",
			detail: message,
			endedAtMs: Date.now()
		}, { env })).catch(() => {});
	};
}
//#endregion
export { recordUpdateRunPhaseAsync as a, recordUpdateRunDiagnosticsAsync as i, createUpdateRunProcessIdentityWarning as n, recordUpdateRunStepAsync as o, finishUpdateRunAsync as r, recordUpdateRunVerificationAsync as s, createUpdateRunAsync as t };

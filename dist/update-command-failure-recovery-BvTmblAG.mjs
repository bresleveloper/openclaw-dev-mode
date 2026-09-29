import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as createUpdateFailureFact } from "./update-failure-facts-THF-vx3i.mjs";
import { s as readActiveGatewayLockPort } from "./gateway-lock-CYjRlApN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { a as recordUpdateRunDiagnostics } from "./update-run-write-rAL063vt.mjs";
import "./update-run-ledger-CwAEg-5V.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-CAxWdF8c.mjs";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-DDhDn9_F.mjs";
import { o as appendPluginUpdateWarnings } from "./update-command-readiness-uqvgjv5Q.mjs";
import { a as verifyUpdatedGateway, t as readFailedUpdateGatewayState } from "./update-command-verification-DaTCD33B.mjs";
import { l as readManagedGatewayServiceForUpdate, p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-B89pDfz8.mjs";
//#region src/cli/update-cli/update-command-failure-recovery.ts
/** Observe recovery after writers settle; this never starts or stops a Gateway. */
async function verifyUpdateFailureRecovery(params) {
	params.assertCurrent?.();
	const startedAt = Date.now();
	const result = params.result;
	const env = params.env ?? params.opts.run?.env ?? process.env;
	const root = params.root;
	const run = params.opts.run;
	const warnRecording = (message) => {
		params.assertCurrent?.();
		defaultRuntime.error(message);
		result.steps.push({
			name: "gateway recovery recording",
			command: "gateway verification",
			cwd: root,
			durationMs: 0,
			exitCode: 0,
			advisory: {
				kind: "recoverable-maintenance",
				message
			}
		});
	};
	let recorded;
	try {
		recorded = run ? getUpdateRun(run.runId, { env: run.env }) : void 0;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		warnRecording(`Could not read update recovery history: ${formatErrorMessage(error)}`);
	}
	const constraint = recorded?.verification.recovery;
	const previousRecovery = constraint?.serviceRestartSafe === false ? constraint : result.recovery ?? constraint ?? void 0;
	result.recovery = previousRecovery;
	result.rollbackOutcome ??= recorded?.verification.rollbackOutcome ?? void 0;
	result.verification = {};
	const rollback = previousRecovery?.packageRollbackVerified;
	try {
		await withCommandProcessScope(async () => {
			if (params.serviceStopped) {
				try {
					result.verification = {
						...await readFailedUpdateGatewayState(params.opts.run, env),
						versionMatch: void 0,
						readyz: false,
						settled: false,
						channelsReady: false
					};
				} catch (error) {
					if (error instanceof UpdateCommandRecoveryPendingError || hasCommandProcessCleanupError(error)) throw error;
					params.assertCurrent?.();
					warnRecording(`Could not save Gateway recovery verification: ${formatErrorMessage(error)}`);
				}
				params.assertCurrent?.();
			}
			const version = await readPackageVersion(root);
			if (!version) throw new Error("The installed Gateway version could not be read for recovery verification.");
			const buildId = await readBuiltGatewayBuildId(root);
			const gatewayPort = await readActiveGatewayLockPort({
				env,
				requireInspection: true
			}) ?? await resolveUpdatedGatewayRestartPort({
				serviceEnv: env,
				serviceCommand: (await readManagedGatewayServiceForUpdate(env))?.command
			});
			params.assertCurrent?.();
			const validation = await verifyUpdatedGateway({
				result,
				opts: params.opts,
				purpose: "recovery",
				serviceEnv: env,
				gatewayPort,
				expectedVersion: version,
				expectedBuildId: buildId ?? void 0,
				timeoutMs: params.timeoutMs,
				assertCurrent: params.assertCurrent
			});
			params.assertCurrent?.();
			Object.assign(result, appendPluginUpdateWarnings(result, validation.pluginWarnings ?? []));
			const restartUnsafe = previousRecovery?.serviceRestartSafe === false;
			result.recovery = validation.ok && !restartUnsafe ? {
				serviceRestartSafe: true,
				version,
				...buildId ? { buildId } : {},
				...rollback ? { packageRollbackVerified: true } : {},
				service: "healthy"
			} : previousRecovery?.serviceRestartSafe ? {
				...previousRecovery,
				service: validation.stopReason ? void 0 : "failed",
				reason: validation.stopReason ?? validation.summary
			} : previousRecovery ?? {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			};
		});
	} catch (error) {
		if (error instanceof UpdateCommandRecoveryPendingError || hasCommandProcessCleanupError(error)) throw error;
		params.assertCurrent?.();
		const probeFailureStep = {
			name: "gateway recovery verification",
			command: "gateway verification",
			cwd: root,
			durationMs: Math.max(0, Date.now() - startedAt),
			exitCode: 1,
			failureFacts: [createUpdateFailureFact({
				check: "gateway-recovery",
				code: "gateway-probe-failed",
				message: formatErrorMessage(error)
			})]
		};
		const previousStep = result.steps.findIndex((step) => step.name === probeFailureStep.name);
		if (previousStep === -1) result.steps.push(probeFailureStep);
		else result.steps[previousStep] = probeFailureStep;
		result.recovery = previousRecovery?.serviceRestartSafe ? {
			...previousRecovery,
			service: void 0,
			reason: "gateway-probe-failed"
		} : previousRecovery ?? {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		};
	}
	if (run) {
		params.assertCurrent?.();
		result.recovery = recordUpdateRunDiagnostics(run.runId, () => {
			params.assertCurrent?.();
			return result;
		}, warnRecording, { env: run.env })?.verification.recovery ?? (!recorded && result.recovery?.serviceRestartSafe ? void 0 : result.recovery);
	}
	return result;
}
//#endregion
export { verifyUpdateFailureRecovery as t };

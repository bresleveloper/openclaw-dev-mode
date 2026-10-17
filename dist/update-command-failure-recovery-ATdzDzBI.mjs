import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-Cg4widap.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { s as readActiveGatewayLockPort } from "./gateway-lock-B6mKYs2x.mjs";
import "./update-run-ledger-jBhhLo0P.mjs";
import { l as recordUpdateRunDiagnostics } from "./update-run-write-DdGOnqyV.mjs";
import { i as getUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { p as UpdateCommandRecoveryPendingError } from "./update-command-executor-C94Zye_E.mjs";
import { p as resolveUpdatedGatewayRestartPort, u as readManagedGatewayServiceForUpdate } from "./update-command-service-plan-VzuhDrTH.mjs";
import { i as verifyUpdatedGateway, t as readFailedUpdateGatewayState } from "./update-command-verification-vVqHGRJB.mjs";
import { t as appendPluginUpdateWarnings } from "./update-command-plugins-internals-CR2JjHB2.mjs";
//#region src/cli/update-cli/update-command-failure-recovery.ts
/** Preserve startup observation after activation, stop, rebind, or rollback. */
function shouldWaitForRecovery(params, service, rollbackAttempted) {
	return params.result.status !== "error" || params.mutationStarted || params.preManagedServiceStop?.stopped === true || service?.stopped === true || Boolean(params.originalManagedServiceRuntime?.definition.rebound) || rollbackAttempted;
}
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
			if (params.serviceUpdateVerdict?.kind === "absent") {
				result.steps.push({
					name: "gateway recovery observation",
					command: "gateway verification",
					cwd: root,
					durationMs: 0,
					exitCode: 0,
					diagnostics: ["Gateway readiness was not checked: no Gateway service or listener was present before maintenance."]
				});
				return;
			}
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
				waitForStartup: params.opts.restart === false ? false : params.waitForStartup,
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
export { verifyUpdateFailureRecovery as n, shouldWaitForRecovery as t };

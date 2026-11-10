import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { s as readActiveGatewayLockPort } from "./gateway-lock-OT1e72lx.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { a as isUpdatePostInstallVerificationDeferred } from "./update-run-step-Db60sdKj.mjs";
import { d as recordUpdateRunDiagnostics } from "./update-run-write-Dd5ORe9V.mjs";
import "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { m as UpdateCommandRecoveryPendingError } from "./update-command-executor-DUq8yLzH.mjs";
import { d as readManagedGatewayServiceForUpdate, m as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { i as verifyUpdatedGateway, s as maybeRestartServiceAfterFailedMutableUpdate, t as readFailedUpdateGatewayState } from "./update-command-verification-D_6SIpZK.mjs";
import { t as appendPluginUpdateWarnings } from "./update-command-plugins-internals-DW5z56RP.mjs";
//#region src/cli/update-cli/update-command-failure-recovery.ts
/** Preserve startup observation after activation, stop, rebind, or rollback. */
function shouldWaitForRecovery(params, service, rollbackAttempted) {
	return params.result.status !== "error" || params.mutationStarted || params.preManagedServiceStop?.stopped === true || service?.stopped === true || Boolean(params.originalManagedServiceRuntime?.definition.rebound) || rollbackAttempted;
}
/** Restore an owned stopped service after writers settle, then verify its installed runtime. */
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
	const assertRecoveryFailureCurrent = (error) => {
		if (error instanceof UpdateCommandRecoveryPendingError || hasCommandProcessCleanupError(error)) throw error;
		params.assertCurrent?.();
	};
	let recorded;
	try {
		recorded = run ? getUpdateRun(run.runId, { env: run.env }) : void 0;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		warnRecording(`Could not read update recovery history: ${formatErrorMessage(error)}`);
	}
	const constraint = recorded?.verification.recovery;
	const unsafeRecovery = [constraint, result.recovery].find((recovery) => recovery?.serviceRestartSafe === false && recovery.dataAtRisk);
	const previousRecovery = unsafeRecovery ?? (constraint?.serviceRestartSafe === false ? constraint : result.recovery ?? constraint ?? void 0);
	result.recovery = previousRecovery;
	result.rollbackOutcome ??= recorded?.verification.rollbackOutcome ?? void 0;
	result.verification = {};
	const rollback = previousRecovery?.packageRollbackVerified;
	let restartAttempted = false;
	try {
		await withCommandProcessScope(async () => {
			const untouched = !unsafeRecovery && (params.mutationStarted === false || ["managed-service-preflight", "gateway-stop-unverified"].includes(result.reason ?? "")) && !params.serviceStopped && !params.preManagedServiceStop?.stopped && !params.gatewayStartAttempted && !params.definitionRecovery?.backup && !params.definitionRecovery?.unverified;
			if (untouched || params.serviceUpdateVerdict?.kind === "absent") {
				result.steps.push({
					name: "gateway recovery observation",
					command: "gateway verification",
					cwd: root,
					durationMs: 0,
					exitCode: 0,
					diagnostics: [untouched ? `No recovery needed; ${params.preManagedServiceStop?.running ? "still serving" : "installation unchanged at"} ${result.before?.version ?? recorded?.before.version ?? "the previous version"}. No service was stopped or started.` : "Gateway readiness was not checked: no Gateway service or listener was present before maintenance."]
				});
				return;
			}
			if (params.opts.restart === false && !params.serviceStopped && result.steps.some(isUpdatePostInstallVerificationDeferred)) {
				result.steps.push({
					name: "gateway recovery verification",
					command: "gateway verification",
					cwd: root,
					durationMs: 0,
					exitCode: null,
					advisory: {
						kind: "recoverable-maintenance",
						message: "Gateway recovery verification deferred because --no-restart leaves activation to the operator. Resolve the recorded update failure before restarting the Gateway through its service owner, then run openclaw update status and openclaw doctor."
					}
				});
				return;
			}
			if (params.serviceStopped) {
				try {
					result.verification = {
						...await readFailedUpdateGatewayState(params.opts.run, env),
						versionMatch: void 0,
						readyz: false,
						coreReady: false,
						settled: false,
						channelsReady: false
					};
				} catch (error) {
					assertRecoveryFailureCurrent(error);
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
			if (params.gatewayStartAttempted !== "restart" && (!params.gatewayStartAttempted || params.definitionRecovery?.unverified) && params.opts.restart !== false && params.preManagedServiceStop?.stopped && params.preManagedServiceStop.serviceMutationAllowed !== false && params.preManagedServiceStop.serviceUpdateVerdict?.kind === "owned" && result.verification?.serviceRunning === false && !(previousRecovery?.serviceRestartSafe === false && previousRecovery.dataAtRisk)) {
				restartAttempted = await maybeRestartServiceAfterFailedMutableUpdate({
					...params,
					preManagedServiceStop: params.preManagedServiceStop,
					updateRun: run,
					recovery: {
						serviceRestartSafe: true,
						version,
						...buildId ? { buildId } : {}
					},
					jsonMode: Boolean(params.opts.json),
					finalRecovery: true
				}) === "healthy";
				params.assertCurrent?.();
			}
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
			const restartUnsafe = previousRecovery?.serviceRestartSafe === false && !restartAttempted;
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
			if (validation.ok && restartAttempted) {
				warnRecording(`Gateway recovered on ${version}; ${result.reason ?? "update recovery"} remains unverified. Recovery artifacts and package backups were retained. Run openclaw update repair.`);
				if (result.reason === "service-definition-rollback-unverified") result.status = "ok";
				if (run) recordUpdateRunDiagnostics(run.runId, { recovery: result.recovery }, warnRecording, { env: run.env });
			}
		});
	} catch (error) {
		assertRecoveryFailureCurrent(error);
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

import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { o as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { r as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-D6ewFI99.mjs";
import { i as isUnacknowledgedPackageOwnerRefusal, n as isAbandonedUpdateRun, r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-B5xSBZMw.mjs";
import { r as isFreshUnacknowledgedAbandonedUpdateRun, t as inspectUpdateRepairDriverAdmission } from "./update-run-activity-C0Hu53Kb.mjs";
import { c as reconcileAbandonedUpdateRuns, m as recordUpdateRunRepairContinuation, t as acknowledgeAbandonedUpdateRun, u as reconcilePackageOwnerRefusal } from "./update-run-ledger-CwAEg-5V.mjs";
import { s as listUpdateRuns } from "./update-run-reader-B17V1KuC.mjs";
import { a as waitForGatewayHttpReadiness, i as resolveGatewayRestartProbeContext, t as confirmGatewayReachable } from "./restart-health-probe-BqNYgG_6.mjs";
import { i as resolveServiceRefreshEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-CAxWdF8c.mjs";
import { n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-DLHVC0Oo.mjs";
import { c as parseTimeoutMsOrExit, g as tryResolveInvocationCwd, m as resolveUpdateRoot, p as resolveTargetVersion } from "./shared-Ca2ebFXK.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CrH0cC4v.mjs";
import { t as updateFinalizeCommand } from "./update-command-finalize-D9WS9j6v.mjs";
//#region src/cli/update-cli/update-repair-command.ts
const POST_CORE_PHASES = /* @__PURE__ */ new Set([
	"activating",
	"restarting",
	"verifying"
]);
function needsPostCoreRepair(run) {
	return POST_CORE_PHASES.has(run.phase) || run.steps.some((step) => POST_CORE_PHASES.has(step.step) || step.step === "post-update verification" || step.step.startsWith("finalize:"));
}
function inspectNewerRecoveryHistory(recoveryRuns, history) {
	if (!recoveryRuns.length) return {
		postCoreRuns: [],
		incomplete: false
	};
	const oldestRecovery = Math.min(...recoveryRuns.map((run) => run.createdAtMs));
	return {
		postCoreRuns: history.filter((run) => run.createdAtMs >= oldestRecovery && run.status === "failed" && !isAcknowledgedAbandonedUpdateRun(run) && needsPostCoreRepair(run)),
		incomplete: history.length === 100 && (history.at(-1)?.createdAtMs ?? 0) >= oldestRecovery
	};
}
/** Public repair can clear a stale ledger without entering post-core maintenance. */
async function updateRepairCommand(opts) {
	const timeoutMs = parseTimeoutMsOrExit(opts.timeout);
	if (timeoutMs === null) return;
	const env = resolveServiceRefreshEnv(process.env, tryResolveInvocationCwd());
	const options = {
		env,
		busyTimeoutMs: timeoutMs ?? 18e5
	};
	assertConfigWriteAllowedInCurrentMode({ env });
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(env),
		env,
		recoverOrphanedSidecars: false
	});
	const activeRuns = listUpdateRuns({
		active: true,
		limit: 100
	}, options);
	const inheritedRunId = env[UPDATE_RUN_ID_ENV];
	const admission = inspectUpdateRepairDriverAdmission(activeRuns, inheritedRunId);
	if (admission.kind === "conflict") throw new Error(admission.message);
	const recentRuns = listUpdateRuns({ limit: 100 }, options);
	const historicalRuns = recentRuns.filter((run) => isAbandonedUpdateRun(run) && !isAcknowledgedAbandonedUpdateRun(run));
	if (admission.kind === "continuation") {
		const continuation = admission.run;
		recordUpdateRunRepairContinuation(continuation.runId, inheritedRunId, options);
		await updateFinalizeCommand(opts, [...activeRuns, ...historicalRuns].filter((run) => run.runId !== continuation.runId).map((run) => run.runId));
		return;
	}
	const lastRun = recentRuns[0];
	if (!activeRuns.length && !historicalRuns.length && opts.channel === void 0 && !opts.acceptCapabilities && lastRun && isUnacknowledgedPackageOwnerRefusal(lastRun)) {
		const snapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
		const root = await resolveUpdateRoot();
		const installedVersion = await readPackageVersion(root);
		const { channel } = resolveEffectiveUpdateChannel({
			configChannel: normalizeUpdateChannel(lastRun.target.channel ?? snapshot.config.update?.channel),
			currentVersion: installedVersion,
			installKind: "package"
		});
		if (snapshot.valid && (channel !== "dev" || lastRun.target.tag)) {
			const targetVersion = lastRun.target.version ?? (lastRun.target.tag ? await resolveTargetVersion(lastRun.target.tag, timeoutMs, { env }) : (await resolveNpmChannelTag({
				channel,
				timeoutMs,
				env
			})).version);
			await assertUpdateRecoveryAdmission(options);
			const currentVersion = await readPackageVersion(root);
			const comparison = compareSemverStrings(currentVersion, targetVersion);
			if (comparison !== null && comparison >= 0) {
				assertConfigWriteAllowedInCurrentMode({ env });
				if (reconcilePackageOwnerRefusal(lastRun, options)) {
					reportRepairResult(opts, [lastRun.runId], `OpenClaw ${currentVersion} satisfies the package target ${targetVersion}. Acknowledged the package-owner refusal; no maintenance or service restart was needed.`);
					return;
				}
			}
		}
	}
	const recoveryRuns = activeRuns.length ? activeRuns : lastRun && isFreshUnacknowledgedAbandonedUpdateRun(lastRun) ? [lastRun] : [];
	const history = inspectNewerRecoveryHistory(recoveryRuns, recentRuns);
	const recoveryRunIds = [...new Set([
		...recoveryRuns,
		...historicalRuns,
		...history.postCoreRuns
	].map((run) => run.runId))];
	if (opts.channel !== void 0 || opts.acceptCapabilities || recoveryRuns.length === 0 || recoveryRunIds.length !== recoveryRuns.length || recoveryRuns.some(needsPostCoreRepair) || history.postCoreRuns.length > 0 || history.incomplete) {
		await updateFinalizeCommand(opts, recoveryRunIds);
		return;
	}
	if (!(await readConfigFileSnapshot({ skipPluginValidation: true })).valid) {
		await updateFinalizeCommand(opts, recoveryRunIds);
		return;
	}
	const context = await resolveGatewayRestartProbeContext(env);
	const port = resolveGatewayPort(context.config, env);
	const root = await resolveUpdateRoot();
	const [gateway, http, expectedVersion, expectedBuildId] = await Promise.all([
		confirmGatewayReachable({
			port,
			...context,
			env
		}),
		waitForGatewayHttpReadiness({
			config: context.config,
			port,
			attempts: 1,
			deadlineAt: Date.now() + Math.min(timeoutMs ?? 3e3, 3e3),
			delayMs: 0
		}),
		readPackageVersion(root),
		readBuiltGatewayBuildId(root)
	]);
	if (!gateway.reachable || !expectedVersion || !expectedBuildId || gateway.gatewayVersion !== expectedVersion || gateway.gatewayBuildId !== expectedBuildId || gateway.activatedPluginErrors.length || gateway.channelProbeErrors.length || http.healthz !== 200 || http.readyz !== 200) {
		await updateFinalizeCommand(opts, recoveryRunIds);
		return;
	}
	assertConfigWriteAllowedInCurrentMode({ env });
	const currentRuns = listUpdateRuns({
		active: true,
		limit: 100
	}, options);
	const currentAdmission = inspectUpdateRepairDriverAdmission(currentRuns, inheritedRunId);
	if (currentAdmission.kind === "conflict") throw new Error(currentAdmission.message);
	const currentHistory = inspectNewerRecoveryHistory(recoveryRuns, listUpdateRuns({ limit: 100 }, options));
	if (currentRuns.some(needsPostCoreRepair) || currentHistory.postCoreRuns.length > 0 || currentHistory.incomplete) throw new Error(`Update history changed during inspection and now needs post-core maintenance. Retry ${formatCliCommand("openclaw update repair", env)}; if the managed Gateway cannot stop, run ${formatCliCommand("openclaw gateway stop", env)} first.`);
	const reconciled = activeRuns.length ? reconcileAbandonedUpdateRuns({
		explicit: true,
		runIds: activeRuns.map((run) => run.runId),
		requireAllActive: true
	}, options) : [];
	if (listUpdateRuns({
		active: true,
		limit: 1
	}, options).length) throw new Error("An update is still in progress; retry update repair after it finishes.");
	reportRepairResult(opts, recoveryRunIds.filter((runId) => acknowledgeAbandonedUpdateRun(runId, options)), reconciled.length ? `Gateway is healthy. Reconciled ${reconciled.length} abandoned update run${reconciled.length === 1 ? "" : "s"}. No maintenance or service restart was needed.` : "Gateway is healthy. Abandoned update runs are already reconciled. No maintenance or service restart was needed.");
}
function reportRepairResult(opts, reconciledRuns, message) {
	if (opts.json) defaultRuntime.writeJson({
		status: "ok",
		mode: "repair",
		restart: false,
		reconciledRuns,
		message
	});
	else defaultRuntime.log(message);
}
//#endregion
export { updateRepairCommand };

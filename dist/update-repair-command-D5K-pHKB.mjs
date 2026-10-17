import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import "./update-post-core-context-B2x24New.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BquD107I.mjs";
import { n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-CWEQyown.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-Cg4widap.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { i as isUnacknowledgedPackageOwnerRefusal, n as isAbandonedUpdateRun, r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-C2LEup70.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { a as isFreshUnacknowledgedAbandonedUpdateRun, n as inspectNewerRecoveryHistory, r as inspectUpdateRepairDriverAdmission, s as needsPostCoreRepair } from "./update-run-activity-CykyDahG.mjs";
import { d as recordUpdateRunRepairContinuation, h as reconcileAbandonedUpdateRunsAsync, r as createUpdateRun, s as reconcilePackageOwnerRefusal, t as acknowledgeAbandonedUpdateRun } from "./update-run-ledger-jBhhLo0P.mjs";
import { l as listUpdateRuns } from "./update-run-reader-B7x8dkVs.mjs";
import { n as hasCliProcessScope } from "./runtime-cleanup-scope-Dno3Ssrr.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { i as settlePendingPackageActivation } from "./package-update-activation-B8eAkK7X.mjs";
import { c as parseUpdateTimeoutMs, f as resolveTargetVersion, p as resolveUpdateRoot } from "./shared-D-l8dmoD.mjs";
import { i as resolveServiceRefreshEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import { a as resolveGatewayRestartProbeContext, n as confirmGatewayReachable, o as waitForGatewayHttpReadiness } from "./restart-health-probe-DQSmvJik.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-DzSs7LNY.mjs";
import { t as refuseHostOwnedUpdate } from "./host-owned-DHQI8WGZ.mjs";
import { t as refuseImmutableUpdateActivation } from "./update-command-immutable-CPENt4_e.mjs";
import { t as updateFinalizeCommand } from "./update-command-finalize-D8TpznoK.mjs";
//#region src/cli/update-cli/update-repair-command.ts
/** Public repair can clear a stale ledger without entering post-core maintenance. */
async function updateRepairCommand(opts) {
	try {
		var _usingCtx$1 = _usingCtx();
		await assertUpdateRecoveryAdmission({ env: process.env });
		const discoveredRoot = await resolveUpdateRoot();
		await refuseHostOwnedUpdate(discoveredRoot, opts);
		await refuseImmutableUpdateActivation(discoveredRoot, opts);
		const timeoutMs = parseUpdateTimeoutMs(opts.timeout);
		const env = resolveServiceRefreshEnv(process.env, tryProcessCwd());
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
		if (opts.channel === void 0 || normalizeUpdateChannel(opts.channel)) {
			const settlement = await settlePendingPackageActivation(resolveUpdateInstallRoot(discoveredRoot), (settled) => {
				defaultRuntime.error(`Warning: previous package update operation ${settled.operationId} closed as ${settled.reason}. ${settled.retained ? `Recovery evidence retained at ${settled.retained}.` : "The original package and launchers remain unchanged."}${settled.detail ? ` ${settled.detail}` : ""}`);
				if (settled.detail) createUpdateRun({
					runId: settled.operationId,
					trigger: "cli",
					settlement: {
						reason: settled.reason,
						detail: `${settled.detail} Operation ${settled.operationId}; evidence retained at ${settled.retained}.`
					}
				}, options);
			});
			if (settlement?.warning) defaultRuntime.error(`Warning: ${settlement.warning}`);
		}
		const handoff = _usingCtx$1.u(hasCliProcessScope() && !inheritedRunId && !env.OPENCLAW_UPDATE_RUN_HANDOFF && !env["OPENCLAW_UPDATE_POST_CORE"] && (opts.channel === void 0 || normalizeUpdateChannel(opts.channel)) ? await createManagedHandoffLeaseStore().prepareRepair(await resolveUpdateRoot(), env, timeoutMs) : null);
		const recentRuns = listUpdateRuns({ limit: 100 }, options);
		const historicalRuns = recentRuns.filter((run) => isAbandonedUpdateRun(run) && !isAcknowledgedAbandonedUpdateRun(run));
		if (admission.kind === "continuation") {
			const continuation = admission.run;
			recordUpdateRunRepairContinuation(continuation.runId, inheritedRunId, options);
			await updateFinalizeCommand(opts, [...activeRuns, ...historicalRuns].filter((run) => run.runId !== continuation.runId).map((run) => run.runId));
			return;
		}
		const lastRun = recentRuns[0];
		if (!handoff && !activeRuns.length && !historicalRuns.length && opts.channel === void 0 && !opts.acceptCapabilities && lastRun && isUnacknowledgedPackageOwnerRefusal(lastRun)) {
			const snapshot = await readConfigFileSnapshot({ skipPluginValidation: true });
			const root = await resolveUpdateRoot();
			const installedVersion = await readPackageVersion(root);
			const { channel } = resolveEffectiveUpdateChannel({
				configChannel: normalizeUpdateChannel(lastRun.target.channel ?? snapshot.config.update?.channel),
				currentVersion: installedVersion,
				installKind: "package"
			});
			if (snapshot.valid && (channel !== "dev" || lastRun.target.tag)) {
				const targetVersion = lastRun.target.version ?? (lastRun.target.tag ? (await resolveTargetVersion(lastRun.target.tag, timeoutMs, { env })).version : (await resolveNpmChannelTag({
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
		const recoverySinceMs = recoveryRuns.length ? Math.min(...recoveryRuns.map((run) => run.createdAtMs)) : void 0;
		const history = inspectNewerRecoveryHistory(recoverySinceMs, recentRuns);
		const recoveryRunIds = [...new Set([
			...recoveryRuns,
			...historicalRuns,
			...history.postCoreRuns
		].map((run) => run.runId))];
		if (handoff || opts.channel !== void 0 || opts.acceptCapabilities || recoverySinceMs === void 0 || recoveryRunIds.length !== recoveryRuns.length || recoveryRuns.some(needsPostCoreRepair) || history.postCoreRuns.length > 0 || history.incomplete) {
			await updateFinalizeCommand(opts, recoveryRunIds, handoff ?? void 0);
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
		const currentHistory = inspectNewerRecoveryHistory(recoverySinceMs, listUpdateRuns({ limit: 100 }, options));
		if (currentRuns.some(needsPostCoreRepair) || currentHistory.postCoreRuns.length > 0 || currentHistory.incomplete) throw new Error(`Update history changed during inspection and now needs post-core maintenance. Retry ${formatCliCommand("openclaw update repair", env)}; if the managed Gateway cannot stop, run ${formatCliCommand("openclaw gateway stop", env)} first.`);
		const reconciled = activeRuns.length ? await reconcileAbandonedUpdateRunsAsync({
			explicit: true,
			runIds: activeRuns.map((run) => run.runId),
			requireAllActive: true,
			repairHistorySinceMs: recoverySinceMs
		}, options) : [];
		if (listUpdateRuns({
			active: true,
			limit: 1
		}, options).length) throw new Error("An update is still in progress; retry update repair after it finishes.");
		reportRepairResult(opts, recoveryRunIds.filter((runId) => acknowledgeAbandonedUpdateRun(runId, options)), reconciled.length ? `Gateway is healthy. Reconciled ${reconciled.length} abandoned update run${reconciled.length === 1 ? "" : "s"}. No maintenance or service restart was needed.` : "Gateway is healthy. Abandoned update runs are already reconciled. No maintenance or service restart was needed.");
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
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

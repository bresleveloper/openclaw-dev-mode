import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { c as normalizeUpdateChannel, l as resolveEffectiveUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { i as ManagedHandoffCustodyRetainedError, n as prepareManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-BBJ5cpXU.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { n as hasCliProcessScope } from "./runtime-cleanup-scope-Dv2f28xK.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import "./update-post-core-context-D3kte0je.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { i as isUnacknowledgedPackageOwnerRefusal, n as isAbandonedUpdateRun, r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Chv9kKnY.mjs";
import { n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-hpRujh0z.mjs";
import { a as isFreshUnacknowledgedAbandonedUpdateRun, n as inspectNewerRecoveryHistory, r as inspectUpdateRepairDriverAdmission, s as needsPostCoreRepair } from "./update-run-activity-B_OeQT4u.mjs";
import { h as findUpdateGatewayStop } from "./update-run-write-Dd5ORe9V.mjs";
import { d as recordUpdateRunRepairContinuation, h as reconcileAbandonedUpdateRunsAsync, r as createUpdateRun, s as reconcilePackageOwnerRefusal, t as acknowledgeAbandonedUpdateRun } from "./update-run-ledger-C3oL-g8r.mjs";
import { l as listUpdateRuns } from "./update-run-reader-BOC3s3Sk.mjs";
import { i as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { i as settlePendingPackageActivation } from "./package-update-activation-Bm88ttku.mjs";
import { c as parseUpdateTimeoutMs, f as resolveTargetVersion, p as resolveUpdateRoot } from "./shared-DRiGAorf.mjs";
import { i as resolveServiceRefreshEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { a as resolveGatewayRestartProbeContext, n as confirmGatewayReachable, o as waitForGatewayHttpReadiness } from "./restart-health-probe-Pjm6LtxI.mjs";
import { a as getGatewayChannelWarnings } from "./restart-health-D3oE2IOJ.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CPjoG803.mjs";
import { t as refuseHostOwnedUpdate } from "./host-owned-dJce67Ov.mjs";
import { t as updateMaintenanceError } from "./update-maintenance-error-B8Lk7PLn.mjs";
import { t as refuseImmutableUpdateActivation } from "./update-command-immutable-CX9N8o48.mjs";
import { n as reportRetainedUpdateCustody, t as updateFinalizeCommand } from "./update-command-finalize-97Q_9jOv.mjs";
//#region src/cli/update-cli/update-repair-command.ts
function updateRepairCommand(opts) {
	return repairUpdate(opts).catch((error) => {
		throw updateMaintenanceError(error);
	});
}
async function repairUpdate(opts) {
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
		let retained;
		const prepareHandoffRepair = async () => {
			const store = await prepareManagedHandoffLeaseStore();
			try {
				return await store.prepareRepair(resolveUpdateInstallRoot(discoveredRoot), env, timeoutMs);
			} catch (error) {
				if (!(error instanceof ManagedHandoffCustodyRetainedError)) throw error;
				retained = reportRetainedUpdateCustody(error.custody, env);
				defaultRuntime.error(`Warning: ${error.message}`);
				return null;
			}
		};
		const handoff = _usingCtx$1.u(hasCliProcessScope() && !inheritedRunId && !env.OPENCLAW_UPDATE_RUN_HANDOFF && !env["OPENCLAW_UPDATE_POST_CORE"] && (opts.channel === void 0 || normalizeUpdateChannel(opts.channel)) ? await prepareHandoffRepair() : null);
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
			}, void 0, handoff ? { owner: () => handoff.assertCurrent() } : void 0);
			if (settlement?.warning) defaultRuntime.error(`Warning: ${settlement.warning}`);
		}
		const recentRuns = listUpdateRuns({ limit: 100 }, options);
		const historicalRuns = recentRuns.filter((run) => isAbandonedUpdateRun(run) && !isAcknowledgedAbandonedUpdateRun(run));
		if (admission.kind === "continuation") {
			const continuation = admission.run;
			recordUpdateRunRepairContinuation(continuation.runId, inheritedRunId, options);
			return await updateFinalizeCommand(opts, [...activeRuns, ...historicalRuns].filter((run) => run.runId !== continuation.runId).map((run) => run.runId));
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
						reportRepairResult(opts, [lastRun.runId], `OpenClaw ${currentVersion} satisfies the package target ${targetVersion}. Acknowledged the package-owner refusal; no maintenance or service restart was needed.`, retained);
						return;
					}
				}
			}
		}
		const recoveryRuns = activeRuns.length ? activeRuns : lastRun && isFreshUnacknowledgedAbandonedUpdateRun(lastRun) ? [lastRun] : [];
		const recoverySinceMs = recoveryRuns.length ? Math.min(...recoveryRuns.map((run) => run.createdAtMs)) : void 0;
		const history = inspectNewerRecoveryHistory(recoverySinceMs, recentRuns);
		const interruptedGateway = findUpdateGatewayStop(recentRuns);
		const recoveryRunIds = [...new Set([
			...recoveryRuns,
			...historicalRuns,
			...history.postCoreRuns
		].map((run) => run.runId))];
		if (interruptedGateway && !recoveryRunIds.includes(interruptedGateway.runId)) recoveryRunIds.push(interruptedGateway.runId);
		if (handoff || interruptedGateway || opts.channel !== void 0 || opts.acceptCapabilities || recoverySinceMs === void 0 || recoveryRunIds.length !== recoveryRuns.length || recoveryRuns.some(needsPostCoreRepair) || history.postCoreRuns.length > 0 || history.incomplete) return await updateFinalizeCommand(opts, recoveryRunIds, handoff ?? void 0, retained);
		if (!(await readConfigFileSnapshot({ skipPluginValidation: true })).valid) return await updateFinalizeCommand(opts, recoveryRunIds, void 0, retained);
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
				requireChannelHealth: false,
				config: context.config,
				port,
				attempts: 1,
				deadlineAt: performance.now() + Math.min(timeoutMs ?? 3e3, 3e3),
				delayMs: 0
			}),
			readPackageVersion(root),
			readBuiltGatewayBuildId(root)
		]);
		if (!gateway.reachable || !expectedVersion || !expectedBuildId || gateway.gatewayVersion !== expectedVersion || gateway.gatewayBuildId !== expectedBuildId || gateway.activatedPluginErrors.length || !(http.coreReady ?? (http.healthz === 200 && http.readyz === 200))) return await updateFinalizeCommand(opts, recoveryRunIds, void 0, retained);
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
		const acknowledged = recoveryRunIds.filter((runId) => acknowledgeAbandonedUpdateRun(runId, options));
		const message = reconciled.length ? `Gateway is healthy. Reconciled ${reconciled.length} abandoned update run${reconciled.length === 1 ? "" : "s"}. No maintenance or service restart was needed.` : "Gateway is healthy. Abandoned update runs are already reconciled. No maintenance or service restart was needed.";
		const warnings = getGatewayChannelWarnings(gateway, http).map(({ id }) => id);
		reportRepairResult(opts, acknowledged, message + (warnings.length ? ` Channel health warnings: ${warnings.join(", ")}. Run openclaw channels status --probe.` : ""), retained);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
function reportRepairResult(opts, reconciledRuns, message, retained) {
	if (opts.json) defaultRuntime.writeJson({
		status: retained ? "warning" : "ok",
		mode: "repair",
		restart: false,
		reconciledRuns,
		message,
		...retained
	});
	else {
		defaultRuntime.log(message);
		if (retained) defaultRuntime.log(theme.warn(retained.nextAction));
	}
	if (retained) exitCliAfterOutput(defaultRuntime, 2);
}
//#endregion
export { updateRepairCommand };

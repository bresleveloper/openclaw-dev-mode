import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { d as resolveGatewayNativeServiceIdentityConflict } from "./constants-BLghGsId.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as registerSignalExitBarrier, l as waitForSignalExitBarriers } from "./signal-exit-barrier-DtR3X_NN.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as SUPPORTED_NODE_VERSION_RANGE, l as formatUnsupportedNodeVersionMessage, s as formatNodeSecurityWarning } from "./node-version-BfT-yCVT.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-BvDyEHkZ.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { a as formatExternalSupervisorUpdateRequired, o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { n as AUTO_UPDATE_STEP_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { n as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-C_pcNU2t.mjs";
import { a as normalizeUpdateFailureFacts, i as createUpdatePreflightDiagnostics, n as createUpdateErrorFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { o as cleanupStaleManagedServiceUpdateHandoffs } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-BBJ5cpXU.mjs";
import "./config-B3oiWDlr.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-un685p3z.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { n as POST_CORE_UPDATE_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-D3kte0je.mjs";
import { n as readUpdateRunDriver } from "./update-run-driver-CPVdsIOp.mjs";
import { n as readInstallOwner } from "./install-owner-BPfYmnil.mjs";
import { i as readDevUpdateTarget } from "./update-dev-target-yMMMhCo4.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { h as verifyPackageUpdateRecovery, y as createSystemPackageOwnershipInspection } from "./update-global-BlXQRfes.mjs";
import { i as isUpdateGatewayReadinessPending, o as updateRunStepsFromResultStep } from "./update-run-step-Db60sdKj.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-hpRujh0z.mjs";
import { d as recordUpdateRunDiagnostics, f as updateRunLedgerSchema, g as normalizeUpdateFailureResult, o as finishUpdateRun, p as isUpdateRunVerificationConfirmed } from "./update-run-write-Dd5ORe9V.mjs";
import { c as readUpdateRunRecord } from "./update-run-read.kernel-C7evz-Ne.mjs";
import { a as finishInterruptedUpdatePreview, f as recordUpdateRunStep, l as recordUpdateRunPhase, n as adoptUpdateRun, o as heartbeatUpdateRun, p as recordUpdateRunVerification, r as createUpdateRun } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as isUpdateRecoveryPending, t as UpdateRecoveryRequiredError } from "./update-run-recovery-schema-DparDBZU.mjs";
import { n as inspectUpdateRecoveries, t as inspectRecoveryRows } from "./update-run-recovery-store-DWInjVEC.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { o as resolveManagedUpdateRequester, r as createManagedUpdateRequesterAuthority } from "./update-requester-authority-BP771TSP.mjs";
import { d as reserveUpdateCommandExecutorSlot, m as UpdateCommandRecoveryPendingError, p as UpdateActivationTimeoutError } from "./update-command-executor-DUq8yLzH.mjs";
import { c as readControlPlaneUpdateSentinelMeta, f as normalizeControlPlaneUpdateResult, l as resolveManagedServiceUpdateFailureExitCode } from "./update-control-plane-sentinel-BOyIUo0V.mjs";
import { i as settlePendingPackageActivation, t as assertNoPendingPackageActivation } from "./package-update-activation-Bm88ttku.mjs";
import { c as parseUpdateTimeoutMs, p as resolveUpdateRoot, s as parseUpdateChannel } from "./shared-DRiGAorf.mjs";
import { t as disableCurrentOpenClawUpdateLaunchdJob } from "./launchd-CtHXAGmT.mjs";
import { i as resolveServiceRefreshEnv, l as withOwnedManagedUpdateEnv, n as resolveOwnedManagedUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-BaoznbwZ.mjs";
import { n as printResult } from "./progress-rcOXmnPk.mjs";
import { o as preflightWindowsUpdateTask, u as resolveForegroundUpdateAdmission } from "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { d as readManagedGatewayServiceForUpdate, i as assertGatewayServiceManagementAllowedForUpdate, p as resolveManagedServicePackageUpdatePlan, s as isGatewayServiceManagementAllowedForUpdate } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { n as loadUpdateRecovery } from "./update-run-recovery-BUElUFkd.mjs";
import { n as assertUpdateRecoveryDirectoryAdmission, t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CPjoG803.mjs";
import { r as capturePackageActivationRuntime } from "./package-update-activation-paths-CZ6aheGK.mjs";
import { b as withUpdateStateRead, g as recordUpdateResultNextAction, i as UpdateCommandPendingRecoveryFailure, l as isUpdateStateReadContention, n as UpdateCommandFailure, o as createUpdateCommandFailureResult, r as UpdateCommandFinalizedRecoveryFailure, s as failUpdateCommandRun, t as UnreportedUpdateAdmissionOutcome, x as writeControlPlaneUpdateRestartSentinelBestEffort } from "./update-command-result-BgqRj9_Z.mjs";
import { c as withMutableUpdateSignals, l as withMutableUpdateTerminalSettlement, o as retireMutableUpdateSignalLedgerRecording, r as recordMutableUpdateInterruption, t as admitMutableUpdateSignalRun } from "./update-command-mutable-signals-D0wsAuNf.mjs";
import { n as reportHostOwnedUpdate } from "./host-owned-dJce67Ov.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/suppress-deprecations.ts
function suppressDeprecations() {
	try {
		process.noDeprecation = true;
	} catch {}
	process.env.NODE_NO_WARNINGS = "1";
}
//#endregion
//#region src/cli/update-cli/update-command-install-kind.ts
/** Mutable lifecycle admission excludes installations owned by another update path. */
async function resolveMutableUpdateInstallKind(root, opts, timeoutMs) {
	const installKind = await resolveUpdateInstallKind(root, { timeoutMs });
	if (installKind === "host") reportHostOwnedUpdate(await readInstallOwner(root), opts);
	if (installKind === "immutable") throw new Error("Immutable installations require the native immutable openclaw update entry point.");
	if (opts.sha !== void 0) throw new Error("--sha requires an adopted immutable installation.");
	return installKind;
}
//#endregion
//#region src/cli/update-cli/update-command-package-activation.ts
/** Package admission must not open history or launch diagnostics on a retained operation. */
function assertUpdatePackageActivationAdmission(root, options) {
	try {
		assertNoPendingPackageActivation(resolveUpdateInstallRoot(root), options);
	} catch (cause) {
		const message = formatErrorMessage(cause);
		throw new UpdateCommandPendingRecoveryFailure({
			status: "error",
			mode: "unknown",
			root,
			reason: "update-recovery-pending",
			steps: [{
				name: "update-recovery-pending",
				command: "openclaw update",
				cwd: root,
				durationMs: 0,
				exitCode: 1,
				diagnostics: [message]
			}],
			durationMs: 0
		}, message, { cause });
	}
	if (options?.serviceRoot && options.serviceRoot !== root) assertUpdatePackageActivationAdmission(options.serviceRoot, {
		continuation: options.continuation,
		dryRun: options.dryRun
	});
}
function createPackageUpdateActivationOptions(params) {
	return {
		reserveInstallSlot: (root) => {
			params.assertCurrent();
			const fence = params.run?.executorFence;
			if (fence) reserveUpdateCommandExecutorSlot(fence, root);
		},
		getActivation: () => {
			const run = params.run;
			const fence = run?.executorFence;
			return run && fence ? {
				fence,
				runtime: params.runtime ?? capturePackageActivationRuntime(process.versions.bun ? "bun" : "node", process.execPath),
				onPrepared: (command) => {
					params.assertCurrent();
					defaultRuntime.error(`Package publication recovery: ${command}\nKeep other package managers stopped; repair may republish a missing installation. Recovery does not restart or verify the Gateway.`);
				},
				onUnavailable: (message) => {
					params.assertCurrent();
					defaultRuntime.error(message);
				}
			} : void 0;
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-preview-signals.ts
const previewAdmissions = /* @__PURE__ */ new WeakMap();
/** Advance preview custody only across this owner's committed target writes. */
function recordUpdateCommandTarget(run, patch) {
	if (!run) return;
	let before;
	const committed = recordUpdateRunPhase(run.runId, "requested", patch, { env: run.env }, (record) => {
		before = record;
	});
	const admission = previewAdmissions.get(run);
	if (admission && isDeepStrictEqual(before, admission.record)) admission.record = committed;
}
function admitUpdatePreviewSignalRun(run, record, env) {
	previewAdmissions.set(run, {
		record,
		env: { ...env }
	});
}
/** Own diagnostics only for this freshly admitted invocation's lexical lifetime. */
async function withUpdatePreviewSignals(opts, operation) {
	const admission = opts.dryRun === true && opts.run ? previewAdmissions.get(opts.run) : void 0;
	if (!admission || !opts.run || admission.active) return await withMutableUpdateSignals(opts, operation);
	admission.active = true;
	const { env } = admission;
	let interrupted = false;
	let shutdown;
	let cleanup;
	const settlePreview = async () => {
		if (!interrupted || process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || process.env["OPENCLAW_UPDATE_POST_CORE"] === "1") return;
		try {
			await assertUpdateRecoveryAdmission({ env });
			if (!isDeepStrictEqual(getUpdateRun(admission.record.runId, { env }), admission.record)) return;
			finishInterruptedUpdatePreview(admission.record, { env });
		} catch {
			defaultRuntime.error("Preview interruption could not be recorded; history remains pending.");
		}
	};
	const finishOwnedCleanup = () => cleanup ??= settlePreview();
	const unregister = registerSignalExitBarrier(finishOwnedCleanup);
	const onSignal = (code) => {
		interrupted = true;
		shutdown ??= waitForSignalExitBarriers(code === 143 ? "SIGTERM" : "SIGINT").catch(() => {
			defaultRuntime.error("Preview interruption could not be recorded; history remains pending.");
		}).finally(() => {
			process.exitCode = code;
		});
	};
	const onSigint = () => onSignal(130);
	const onSigterm = () => onSignal(143);
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	try {
		return await operation();
	} finally {
		try {
			await finishOwnedCleanup();
		} finally {
			previewAdmissions.delete(opts.run);
			const removeSignalHandlers = () => {
				process.off("SIGINT", onSigint);
				process.off("SIGTERM", onSigterm);
			};
			if (shutdown) shutdown.then(removeSignalHandlers, removeSignalHandlers);
			else removeSignalHandlers();
			unregister();
		}
	}
}
//#endregion
//#region src/cli/update-cli/update-command-run.ts
/** Admission follows the managed service root before a redirect or discovered install. */
function resolveUpdateCommandAdmissionRoot(prepared) {
	return prepared.servicePlan?.serviceRoot ?? prepared.servicePlan?.rootRedirect?.root ?? prepared.discoveredRoot;
}
async function resolveUpdateCommandAdmissionEnv(params) {
	await (params.pkgOwnership ?? createSystemPackageOwnershipInspection(12e5)).assertUnowned(params.root);
	let env = resolveServiceRefreshEnv(process.env, params.invocationCwd);
	if (await resolveForegroundUpdateAdmission({
		root: params.root,
		env,
		expectedForeground: params.expectedForeground || params.opts.run?.completionOwner === "gateway-restart" || void 0
	})) return env;
	if (!params.opts.dryRun && !env["OPENCLAW_UPDATE_RUN_ID"] && isGatewayServiceManagementAllowedForUpdate(env)) {
		const inspected = await readManagedGatewayServiceForUpdate(env, params.root, await resolveUpdateInstallKind(params.root) === "package");
		if (inspected) {
			env = resolveOwnedManagedUpdateEnv({
				processEnv: env,
				serviceEnv: mergeGatewayServiceEnv(env, inspected.command),
				serviceDefinitionEnv: resolveManagedGatewayServiceCommand(inspected.command)?.environment,
				invocationCwd: params.invocationCwd
			});
			if (resolveGatewayNativeServiceIdentityConflict(env)) assertGatewayServiceManagementAllowedForUpdate(env);
		}
	}
	return env;
}
async function admitUpdateCommandRun(params) {
	assertUpdatePackageActivationAdmission(params.root, {
		serviceRoot: params.serviceRoot,
		dryRun: params.opts.dryRun
	});
	const env = await resolveUpdateCommandAdmissionEnv(params);
	await assertUpdateRecoveryAdmission({ env });
	assertUpdatePackageActivationAdmission(params.root, {
		serviceRoot: params.serviceRoot,
		dryRun: params.opts.dryRun
	});
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(env),
		env,
		recoverOrphanedSidecars: false
	});
	const meta = await readControlPlaneUpdateSentinelMeta(env);
	await resolveForegroundUpdateAdmission({
		root: params.root,
		env,
		meta,
		expectedForeground: params.expectedForeground || params.opts.run?.completionOwner === "gateway-restart" || void 0
	});
	assertUpdatePackageActivationAdmission(params.root, {
		serviceRoot: params.serviceRoot,
		dryRun: params.opts.dryRun
	});
	const driver = readUpdateRunDriver();
	const ledgerOptions = {
		env,
		busyTimeoutMs: parseUpdateTimeoutMs(params.opts.timeout) ?? 18e5
	};
	params.assertCurrent?.();
	const created = createUpdateRun({
		runId: env["OPENCLAW_UPDATE_RUN_ID"]?.trim() || params.initialization?.runId,
		trigger: "cli",
		preview: params.opts.dryRun === true,
		origin: {
			driver,
			admission: { owner: "installed" }
		},
		supersedeStaleIdentityless: !env["OPENCLAW_UPDATE_RUN_ID"]?.trim() && env["OPENCLAW_UPDATE_POST_CORE"] !== "1",
		target: {
			channel: params.opts.channel,
			tag: params.opts.tag,
			...params.installKind && params.installKind !== "unknown" ? { kind: params.installKind } : {},
			...params.installKind === "git" ? { installationMethod: "git-checkout" } : {}
		},
		before: { version: VERSION }
	}, ledgerOptions);
	const record = adoptUpdateRun(created.runId, ledgerOptions);
	const requester = resolveManagedUpdateRequester(record.origin.requester);
	const requesterAuthority = requester?.authorizationSource?.startsWith("profile:") ? Object.freeze({
		requester: Object.freeze({ ...requester }),
		isCurrent: () => {
			throw new Error("Profile update continuation has not acquired its native owner.");
		}
	}) : requester ? await createManagedUpdateRequesterAuthority(requester, env) : void 0;
	const run = {
		runId: record.runId,
		originalRecoveryCapture: params.initialization?.originalRecoveryCapture ?? params.opts.run?.originalRecoveryCapture,
		defaultStepTimeoutMs: record.trigger === "campaign" ? AUTO_UPDATE_STEP_TIMEOUT_MS : void 0,
		env,
		...record.trigger !== "cli" && meta?.runId === record.runId && meta.completionOwner === "gateway-restart" ? { completionOwner: "gateway-restart" } : {},
		...requesterAuthority ? { requesterAuthority } : {}
	};
	if (!env["OPENCLAW_UPDATE_RUN_ID"] && env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1" && env["OPENCLAW_UPDATE_POST_CORE"] !== "1") {
		if (params.opts.dryRun === true) admitUpdatePreviewSignalRun(run, record, env);
		else admitMutableUpdateSignalRun(run, record);
	}
	return run;
}
function createUpdateRunProgress(run, progress, recordStep) {
	let deferred = false;
	const driver = readUpdateRunDriver();
	const pendingSteps = [];
	let flushFailure;
	const persist = async (step) => {
		try {
			return await recordStep(step);
		} catch (cause) {
			throw new Error(`Could not record update step "${step.step}" (${step.status}): ${formatErrorMessage(cause)}`, { cause });
		}
	};
	const record = async (step) => {
		if (flushFailure) throw flushFailure.cause;
		if (deferred) {
			pendingSteps.push(step);
			return;
		}
		return await persist(step);
	};
	return {
		pendingSteps,
		onRollbackOutcome: (rollbackOutcome) => {
			if (!deferred) recordUpdateRunVerification(run.runId, { rollbackOutcome }, { env: run.env });
		},
		onHeartbeat() {
			if (!deferred) heartbeatUpdateRun(run.runId, driver, { env: run.env });
		},
		deferLedgerWrites() {
			deferred = true;
			retireMutableUpdateSignalLedgerRecording(run);
		},
		async flushLedgerWrites() {
			if (flushFailure) throw flushFailure.cause;
			while (pendingSteps[0]) {
				try {
					await persist(pendingSteps[0]);
				} catch (cause) {
					flushFailure = { cause };
					throw cause;
				}
				pendingSteps.shift();
			}
			deferred = false;
		},
		async onStepStart(step) {
			const committed = await record({
				step: step.name,
				status: "in_progress",
				startedAtMs: Date.now()
			});
			progress.onStepStart?.(step, committed);
		},
		async onStepComplete(step) {
			const endedAtMs = Date.now();
			let committed;
			for (const entry of updateRunStepsFromResultStep(step)) committed = await record({
				...entry,
				startedAtMs: Math.max(0, endedAtMs - step.durationMs),
				endedAtMs
			});
			progress.onStepComplete?.(step, committed);
		}
	};
}
function completeUpdateCommandRun(input, run, completion = {}) {
	const result = normalizeUpdateFailureResult(normalizeControlPlaneUpdateResult(input));
	if (!run) return result;
	const recoveries = inspectUpdateRecoveries({ env: run.env });
	const inspected = recoveries.find((entry) => entry.record.runId === run.runId);
	const recovery = inspected?.format === "legacy-serving" ? inspected.record : loadUpdateRecovery(run.runId, { env: run.env });
	if (recovery) {
		const terminal = recovery.terminal && getUpdateRun(run.runId, { env: run.env })?.status === recovery.terminal.status ? recovery.terminal : void 0;
		const succeeded = terminal?.status === "succeeded";
		return normalizeUpdateFailureResult({
			...result,
			status: succeeded ? "ok" : "error",
			reason: succeeded ? void 0 : terminal ? recovery.primaryFailure?.code ?? "update-rolled-back" : result.reason ?? "update-recovery-pending",
			runId: run.runId
		});
	}
	if (recoveries.some(({ record }) => isUpdateRecoveryPending(record))) return {
		...result,
		status: "error",
		reason: "update-recovery-pending",
		runId: run.runId
	};
	const recordOptions = {
		env: run.env,
		redactPaths: result.root ? [result.root] : []
	};
	const helperRecoveryPending = process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" && result.recovery?.serviceRestartSafe === true && result.recovery.packageRollbackVerified === true && result.recovery.service === void 0;
	const gatewayRestartPending = run.completionOwner === "gateway-restart" && run.gatewayRestartRequired === true && result.status === "ok" && !completion.rolledBack;
	if (!gatewayRestartPending && !helperRecoveryPending) {
		const finished = finishUpdateRun(run.runId, {
			status: completion.rolledBack ? "rolled-back" : result.status === "ok" ? "succeeded" : result.status === "error" ? "failed" : "skipped",
			diagnostics: result,
			before: result.before,
			reason: result.reason,
			after: result.after,
			downtimeMs: completion.downtimeMs
		}, recordOptions);
		if (result.verification) result.recovery = finished.verification.recovery ?? void 0;
	} else {
		recordUpdateRunPhase(run.runId, gatewayRestartPending ? "restarting" : "requested", {
			before: result.before,
			after: result.after
		}, recordOptions);
		recordUpdateRunDiagnostics(run.runId, result, defaultRuntime.error, recordOptions);
		if (!result.verification) for (const step of result.steps.flatMap(updateRunStepsFromResultStep)) recordUpdateRunStep(run.runId, step, recordOptions);
	}
	return {
		...result,
		runId: run.runId
	};
}
async function prepareUpdateCommand(opts) {
	const runtimeFailure = process.versions.bun ? null : nodeRuntimeFailure(process.versions.node, await detectCurrentSqliteCapabilities());
	if (runtimeFailure) {
		const root = await resolveUpdateRoot();
		const error = createUpdatePreflightDiagnostics({
			check: "node-runtime",
			code: "node-runtime-preflight",
			required: `Node ${SUPPORTED_NODE_VERSION_RANGE}`,
			detected: `Node ${process.versions.node} at ${process.execPath}`,
			installRoot: root,
			binaryPath: path.join(root, "openclaw.mjs"),
			remedy: `${formatUnsupportedNodeVersionMessage(process.versions.node)}\n${runtimeFailure}`
		}).message;
		if (opts.json) defaultRuntime.writeJson({
			status: "error",
			mode: "unknown",
			reason: "node-runtime-preflight",
			error,
			steps: [],
			durationMs: 0
		});
		else defaultRuntime.error(`node-runtime-preflight: ${error}`);
		exitCliAfterOutput(defaultRuntime, 1);
	}
	const nodeSecurityWarning = process.versions.bun ? null : formatNodeSecurityWarning(process.versions.node);
	if (nodeSecurityWarning) defaultRuntime.error(`SECURITY WARNING: ${nodeSecurityWarning}`);
	const startedAt = Date.now();
	suppressDeprecations();
	const postCoreUpdateResume = process.env[POST_CORE_UPDATE_ENV] === "1";
	const postCoreUpdateChannel = process.env[POST_CORE_UPDATE_CHANNEL_ENV]?.trim();
	const timeoutMs = parseUpdateTimeoutMs(opts.timeout);
	const shouldRestart = opts.restart !== false;
	const requestedChannel = parseUpdateChannel(opts.channel);
	const devTarget = requestedChannel === "dev" ? readDevUpdateTarget() : void 0;
	const executingRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	const discoveredRoot = opts.sourceUpdate?.root ?? await resolveUpdateRoot();
	const installKind = await resolveMutableUpdateInstallKind(discoveredRoot, opts, timeoutMs);
	if (!postCoreUpdateResume && opts.dryRun !== true && isGatewayExternallySupervised()) throw new Error(formatExternalSupervisorUpdateRequired());
	if (opts.sourceUpdate && installKind !== "git") throw new Error("Doctor source update requires the accepted Git checkout.");
	const controlPlaneUpdateSentinelMeta = await readControlPlaneUpdateSentinelMeta();
	const foreground = !postCoreUpdateResume && await resolveForegroundUpdateAdmission({
		root: discoveredRoot,
		meta: controlPlaneUpdateSentinelMeta
	});
	if (!postCoreUpdateResume && !foreground && opts.dryRun !== true) preflightWindowsUpdateTask(opts.tag, timeoutMs);
	const pkgOwnership = createSystemPackageOwnershipInspection(timeoutMs ?? 12e5);
	await pkgOwnership.assertUnowned(discoveredRoot);
	const packageActivationNotes = [];
	const admitPackageActivation = async (root) => {
		if (!postCoreUpdateResume) {
			const settled = await settlePendingPackageActivation(resolveUpdateInstallRoot(root), void 0, void 0, {
				automatic: true,
				dryRun: opts.dryRun
			}).catch((cause) => {
				throw new UpdateCommandPendingRecoveryFailure({
					status: "error",
					mode: "unknown",
					root,
					steps: [],
					durationMs: 0
				}, formatErrorMessage(cause), { cause });
			});
			if (settled) {
				const note = `${opts.dryRun ? "Would settle" : "Settled"} previous package update ${settled.operationId} (${settled.reason}); update can proceed past package recovery admission. Evidence ${opts.dryRun ? "would be retained" : "retained"} at ${settled.retained}.${settled.warning ? ` ${settled.warning}` : ""}`;
				if (opts.dryRun) packageActivationNotes.push(note);
				else defaultRuntime.error(note);
			}
		}
		assertUpdatePackageActivationAdmission(root, {
			continuation: postCoreUpdateResume ? opts.run?.executorFence : void 0,
			dryRun: !postCoreUpdateResume && opts.dryRun
		});
	};
	await admitPackageActivation(discoveredRoot);
	const servicePlan = installKind === "package" && !postCoreUpdateResume && !foreground ? await resolveManagedServicePackageUpdatePlan({
		root: discoveredRoot,
		pkgOwnership,
		rebind: shouldRestart
	}) : void 0;
	const packageAdmission = {
		continuation: postCoreUpdateResume ? opts.run?.executorFence : void 0,
		serviceRoot: servicePlan?.serviceRoot ?? servicePlan?.rootRedirect?.root,
		dryRun: !postCoreUpdateResume && opts.dryRun
	};
	if (packageAdmission.serviceRoot && packageAdmission.serviceRoot !== discoveredRoot) await admitPackageActivation(packageAdmission.serviceRoot);
	opts.run?.executorFence?.assertCurrent();
	if (opts.dryRun !== true) await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(process.env),
		recoverOrphanedSidecars: false
	});
	opts.run?.executorFence?.assertCurrent();
	const handoffRoot = controlPlaneUpdateSentinelMeta?.root;
	if (handoffRoot) {
		const { assertManagedServiceUpdateHandoffRoot } = await import("./update-managed-service-handoff-BSESNMoK.mjs");
		await assertManagedServiceUpdateHandoffRoot({
			expectedRoot: handoffRoot,
			root: discoveredRoot,
			executingRoot,
			postCore: postCoreUpdateResume
		});
		opts.run?.executorFence?.assertCurrent();
	}
	assertUpdatePackageActivationAdmission(discoveredRoot, packageAdmission);
	if (opts.dryRun !== true) try {
		assertConfigWriteAllowedInCurrentMode();
	} catch (err) {
		await disableCurrentOpenClawUpdateLaunchdJob().catch(() => void 0);
		throw err;
	}
	return {
		startedAt,
		postCoreUpdateResume,
		...nodeSecurityWarning ? { nodeSecurityWarning } : {},
		postCoreUpdateChannel,
		timeoutMs,
		shouldRestart,
		requestedChannel,
		devTarget,
		controlPlaneUpdateSentinelMeta,
		discoveredRoot,
		installKind,
		servicePlan,
		pkgOwnership,
		...packageActivationNotes.length ? { packageActivationNotes } : {}
	};
}
/** Prepare mutable runtime state only under the admitted installation owner. */
async function prepareMutableUpdateRuntime(env, fence) {
	return await withOwnedManagedUpdateEnv(env, async () => {
		fence.assertCurrent();
		await cleanupStaleManagedServiceUpdateHandoffs().catch(() => void 0);
		fence.assertCurrent();
		await assertOpenClawStateWriteAllowedAtPath({ databasePath: resolveOpenClawStateSqlitePath(process.env) });
		fence.assertCurrent();
		await disableCurrentOpenClawUpdateLaunchdJob().catch(() => void 0);
		fence.assertCurrent();
		const records = await loadInstalledPluginIndexInstallRecords();
		fence.assertCurrent();
		return records;
	});
}
//#endregion
//#region src/infra/update-run-terminal-record.ts
/** Retain a completed outcome while its updater still owns the existing state.
* Publication consumes this fact after release; it never grants recovery authority. */
function captureCompletedUpdateRun(runId, assertCurrent, options) {
	assertCurrent();
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		if (inspectRecoveryRows(db).some(({ record }) => record.runId === runId || isUpdateRecoveryPending(record))) return;
		const record = readUpdateRunRecord(db, runId);
		assertCurrent();
		return record?.status === "succeeded" && record.phase === "finished" ? record : void 0;
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run"
	});
}
//#endregion
//#region src/cli/update-cli/update-command-terminal-record.ts
function matchesResult(record, result) {
	if (result.status !== "ok" || result.runId && result.runId !== record.runId) return false;
	const verification = record.verification;
	if (!isUpdateRunVerificationConfirmed(verification)) return false;
	for (const key of [
		"version",
		"sha",
		"buildId"
	]) {
		const expected = result.after?.[key];
		const actual = record.after[key];
		if (expected && actual && expected !== actual) return false;
	}
	const observedVersion = verification.runningVersion;
	const observedBuild = verification.runningBuildId;
	if (record.after.version && observedVersion && record.after.version !== observedVersion || record.after.buildId && observedBuild && record.after.buildId !== observedBuild || result.after?.version && observedVersion && result.after.version !== observedVersion || (result.after?.buildId ? observedBuild !== result.after.buildId : !result.after?.version || observedVersion !== result.after.version)) return false;
	const key = result.after?.buildId ? "buildId" : result.after?.sha ? "sha" : "version";
	return Boolean(result.after?.[key] && record.after[key] === result.after[key]);
}
/** Capture an already completed outcome while its real executor still owns state. */
async function captureUpdateCommandTerminalRecord(params, result, assertCurrent) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	if (!run || !executor || result.status !== "ok") return;
	const pathname = resolveOpenClawStateSqlitePath(run.env);
	if (resolveOpenClawStateSqlitePath(params.ownedManagedUpdateEnv ?? run.env) !== pathname) return;
	assertCurrent();
	if (!await assertUpdateRecoveryDirectoryAdmission(pathname)) return;
	assertCurrent();
	const identity = readDatabasePathIdentitySync(pathname).key;
	const record = captureCompletedUpdateRun(run.runId, assertCurrent, {
		env: run.env,
		path: pathname
	});
	assertCurrent();
	if (!record || !matchesResult(record, result)) return;
	const captured = {
		run,
		executor,
		path: pathname,
		identity,
		record
	};
	readUpdateCommandTerminalRecord(params, result, captured);
	return captured;
}
/** Recheck identity without reopening released state or taking a live snapshot. */
function readUpdateCommandTerminalRecord(params, result, captured) {
	const run = params.opts.run;
	if (run !== captured.run || run.executorFence !== captured.executor || run.runId !== captured.record.runId || resolveOpenClawStateSqlitePath(run.env) !== captured.path || resolveOpenClawStateSqlitePath(params.ownedManagedUpdateEnv ?? run.env) !== captured.path || !matchesResult(captured.record, result)) throw new Error("Update terminal publication lost its captured outcome.");
	assertExistingDatabaseIdentity(captured.path, captured.identity);
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(captured.path, run.env);
	return captured.record;
}
//#endregion
//#region src/cli/update-cli/update-command-terminal.ts
const terminalOwners = /* @__PURE__ */ new WeakMap();
function unexpectedUpdateFailure(cause) {
	return {
		mode: "unknown",
		durationMs: 0,
		failure: { cause }
	};
}
/** Finalization prepares a report; the outer invocation owns its publication. */
function deferUpdateCommandTerminalResult(run, publish) {
	const owner = run && terminalOwners.get(run);
	if (!owner) return false;
	owner.publish = publish;
	return true;
}
function hasDeferredUpdateCommandTerminalResult(run) {
	return terminalOwners.get(run)?.publish !== void 0;
}
/** Record facts while admitted; publish only when the executor has settled. */
async function prepareUnexpectedUpdateCommandFailure(error, opts, onPublishedRecord) {
	const failure = unexpectedUpdateFailure(error);
	let fact;
	try {
		const recorded = failUpdateCommandRun(error, opts.run);
		if (!recorded) throw new Error("Update history remains with its existing recovery owner.");
		fact = recorded;
	} catch (cause) {
		return new UpdateCommandPendingRecoveryFailure(createUpdateCommandFailureResult(failure), formatErrorMessage(cause), { cause: error });
	}
	const result = createUpdateCommandFailureResult({
		...failure,
		phase: fact.check
	});
	result.failedStep.failureFacts = [fact];
	const params = {
		opts,
		root: result.root ?? ""
	};
	const publish = async (settlementFailure, onTerminalRecord) => {
		const settled = await resolveSettledUpdateCommandResult(params, result, settlementFailure);
		return publishUpdateCommandTerminalResult(params, settled.result, { rolledBack: false }, onTerminalRecord);
	};
	const published = deferUpdateCommandTerminalResult(opts.run, publish) ? result : await publish(void 0, onPublishedRecord);
	return new UpdateCommandFailure(published, 1, fact.message, { cause: error });
}
/** Enclose the real executor so its final checks and release precede terminal output. */
async function withUpdateCommandTerminalResult(operation, opts = {}) {
	let run;
	return await withMutableUpdateTerminalSettlement(async (retain) => {
		try {
			return await settleUpdateCommandTerminalResult(operation, opts, (admitted) => {
				run = admitted;
				retain(admitted);
			});
		} catch (error) {
			if (run && !(error instanceof UpdateCommandFinalizedRecoveryFailure) && (error instanceof UpdateCommandPendingRecoveryFailure || hasCommandProcessCleanupError(error))) {
				const input = error instanceof UpdateCommandFailure ? error.result : createUpdateCommandFailureResult(unexpectedUpdateFailure(error));
				const result = recordMutableUpdateInterruption({ run }, input);
				if (result !== input || result.reason === "interrupted") {
					await printResult(result, {
						...opts,
						run
					}, {
						readHistory: false,
						nextAction: "Run openclaw update status, then openclaw update repair to inspect retained recovery."
					});
					throw new UpdateCommandFinalizedRecoveryFailure(result, 1, void 0, { cause: error });
				}
			}
			throw error;
		}
	});
}
async function settleUpdateCommandTerminalResult(operation, opts, retain) {
	const owner = {};
	let run;
	const notifyResult = (result) => {
		try {
			opts.onResult?.(result);
		} catch (cause) {
			defaultRuntime.error(`Warning: Update result observer failed: ${createUpdateErrorFact("update", cause, run?.env).message}`);
		}
	};
	let registrationOpen = true;
	const registerRun = (admitted) => {
		if (!registrationOpen || run || terminalOwners.has(admitted)) throw new Error("Update terminal publication already has an owner or has settled.");
		run = admitted;
		terminalOwners.set(admitted, owner);
		retain(admitted);
	};
	let outcome;
	try {
		outcome = { value: await operation(registerRun) };
	} catch (error) {
		outcome = { error };
	} finally {
		registrationOpen = false;
		if (run) terminalOwners.delete(run);
	}
	if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw outcome.error;
	await run?.sourceArtifactLock?.release().catch((error) => {
		defaultRuntime.error(`Warning: Artifact lock release failed: ${formatErrorMessage(error)}`);
	});
	const activationTimeout = "error" in outcome ? collectNestedErrorCandidates(outcome.error).find((error) => error instanceof UpdateActivationTimeoutError) : void 0;
	if (run && activationTimeout && !owner.publish) {
		const admittedRun = run;
		owner.publish = async (failure) => {
			const params = {
				opts: {
					...opts,
					run: admittedRun
				},
				root: activationTimeout.root
			};
			const { result } = await resolveSettledUpdateCommandResult(params, {
				status: "error",
				mode: "unknown",
				root: activationTimeout.root,
				steps: [],
				durationMs: activationTimeout.timeoutMs
			}, failure);
			return publishUpdateCommandTerminalResult(params, result, { rolledBack: false });
		};
	}
	if (run && "error" in outcome && outcome.error instanceof UnreportedUpdateAdmissionOutcome && !owner.publish) {
		const admittedRun = run;
		const admission = outcome.error;
		owner.publish = async () => {
			await assertUpdateRecoveryAdmission({ env: admittedRun.env });
			return (await publishUnreportedUpdateAdmissionOutcome(admission, admittedRun)).result;
		};
	}
	if (owner.publish) {
		let published;
		try {
			published = await owner.publish("error" in outcome ? outcome.error : void 0, opts.onTerminalRecord);
		} catch (error) {
			if (collectNestedErrorCandidates(error).some((cause) => cause instanceof UpdateCommandFailure)) throw error;
			if (run && getUpdateRun(run.runId, { env: run.env })?.status === "succeeded") {
				defaultRuntime.error(`Warning: Update succeeded, but result publication failed: ${createUpdateErrorFact("update", error, run.env).message}`);
				return exitCliAfterOutput(defaultRuntime, 0);
			}
			outcome = { error: "error" in outcome && outcome.error !== error ? new AggregateError([outcome.error, error], "Update result publication failed", { cause: error }) : error };
		}
		if (published) notifyResult(published);
		if (published && "error" in outcome) {
			const failure = outcome.error;
			if (failure instanceof UpdateCommandPendingRecoveryFailure || failure instanceof UpdateCommandRecoveryPendingError || activationTimeout) throw new UpdateCommandFinalizedRecoveryFailure(published);
			throw new UpdateCommandFailure(published, failure instanceof UpdateCommandFailure ? failure.exitCode : failure instanceof UnreportedUpdateAdmissionOutcome ? failure.skipped?.exitCode ?? resolveManagedServiceUpdateFailureExitCode(published) : 1, formatErrorMessage(failure), { cause: failure });
		}
	}
	if ("error" in outcome && outcome.error instanceof ExitError) throw outcome.error;
	if (run && "error" in outcome && !(outcome.error instanceof UpdateCommandFailure)) {
		const error = outcome.error;
		if (hasCommandProcessCleanupError(error)) throw error;
		const causes = collectNestedErrorCandidates(error);
		const primaryFailure = causes.find((cause) => cause instanceof UpdateCommandFailure);
		const admission = causes.find((cause) => cause instanceof UnreportedUpdateAdmissionOutcome);
		let failure;
		try {
			if (primaryFailure || admission || causes.some((cause) => cause instanceof UpdateCommandRecoveryPendingError || cause instanceof UpdateRecoveryRequiredError)) throw error;
			await assertUpdateRecoveryAdmission({ env: run.env });
			failure = await prepareUnexpectedUpdateCommandFailure(error, {
				...opts,
				run
			}, opts.onTerminalRecord);
		} catch (cause) {
			const admissionReport = !primaryFailure && admission ? resolveUnreportedUpdateAdmissionReport(error, admission) : void 0;
			const admissionResult = admissionReport ? {
				...createPreMutationUpdateResult({
					...admissionReport,
					opts: {
						...admissionReport.opts,
						run
					}
				}, { status: "error" }),
				runId: run.runId
			} : void 0;
			throw new UpdateCommandPendingRecoveryFailure(primaryFailure?.result ?? admissionResult ?? createUpdateCommandFailureResult(unexpectedUpdateFailure(error)), admissionReport?.nextAction ?? admissionReport?.message ?? formatErrorMessage(cause), { cause: error });
		}
		if (!(failure instanceof UpdateCommandPendingRecoveryFailure)) notifyResult(failure.result);
		throw failure;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Resolve diagnostic output without reusing a released mutation fence. */
async function resolveSettledUpdateCommandResult(params, pendingResult, failure, captured) {
	const settlementFailed = failure !== void 0 && (!(failure instanceof UpdateCommandFailure) || failure instanceof UpdateCommandPendingRecoveryFailure);
	const activationTimeout = collectNestedErrorCandidates(failure).find((error) => error instanceof UpdateActivationTimeoutError);
	const failedStep = settlementFailed ? {
		name: "update-executor-settlement",
		command: "openclaw update",
		cwd: pendingResult.root ?? params.root,
		durationMs: 0,
		exitCode: 1,
		stderrTail: activationTimeout?.message ?? formatErrorMessage(failure)
	} : void 0;
	const version = pendingResult.after?.version?.trim();
	const recovery = pendingResult.recovery ?? (version ? {
		serviceRestartSafe: true,
		version
	} : void 0);
	const result = failedStep ? {
		...pendingResult,
		status: "error",
		reason: activationTimeout?.reason ?? "update-executor-settlement-failed",
		recovery: isUpdateStateReadContention(failure) ? recovery : void 0,
		failedStep,
		steps: [...pendingResult.steps, failedStep]
	} : failure instanceof UpdateCommandFailure ? failure.result : pendingResult;
	try {
		if (failure === void 0 && captured) {
			readUpdateCommandTerminalRecord(params, result, captured);
			return {
				result,
				settlementFailed,
				captured
			};
		}
		const env = params.ownedManagedUpdateEnv ?? params.opts.run?.env;
		const targetPath = resolveOpenClawStateSqlitePath(env);
		await withUpdateStateRead(async () => {
			await assertUpdateRecoveryAdmission({
				env,
				path: targetPath
			});
			if (params.opts.run) {
				if (resolveOpenClawStateSqlitePath(params.opts.run.env) !== targetPath) await assertUpdateRecoveryAdmission({ env: params.opts.run.env });
				const prior = getUpdateRun(params.opts.run.runId, { env: params.opts.run.env });
				if (prior && prior.status !== "running" && settlementFailed) throw new Error("Update history was already finalized by another owner.");
			}
		}, params.opts.run?.deadline?.remainingMs() ?? params.opts.run?.defaultStepTimeoutMs ?? 0);
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure(result, formatErrorMessage(cause), { cause });
	}
	return {
		result,
		settlementFailed
	};
}
/** Share verified retirement and unverified recovery retention across finalizers. */
async function recordUpdatePackageCompletion(params, result, assertCurrent) {
	const transaction = params.packageTransaction;
	if (!transaction) return;
	if (isUpdateGatewayReadinessPending(result) || result.status === "ok" && params.opts.run?.completionOwner === "gateway-restart" && params.opts.run.gatewayRestartRequired === true) {
		assertCurrent();
		const message = `Gateway readiness is pending; backup retirement deferred for ${transaction.backupRoot}. Verify readiness before cleanup.`;
		result.steps.push({
			name: "package-backup-retention",
			command: "openclaw update",
			cwd: result.root ?? params.root,
			durationMs: 0,
			exitCode: 0,
			advisory: {
				kind: "recoverable-maintenance",
				message
			}
		});
		defaultRuntime.error(message);
		return;
	}
	let cleanupFailure;
	if (!params.opts.json) defaultRuntime.log("Finishing update: checking package backup retention and cleanup.");
	const retained = await transaction.complete({ activationVerified: result.status === "ok" }, assertCurrent).catch((error) => {
		assertCurrent();
		if (error instanceof UpdateCommandPendingRecoveryFailure) throw error;
		cleanupFailure = error;
		return {
			name: "package-backup-retention",
			command: "openclaw update",
			cwd: result.root ?? params.root,
			durationMs: 0,
			exitCode: 1,
			stderrTail: `Update backup cleanup failed: ${formatErrorMessage(error)}. Inspect ${transaction.backupRoot} before manual cleanup.`
		};
	});
	assertCurrent();
	if (!retained) return;
	const step = {
		...retained,
		stderrTail: retained.stderrTail
	};
	if (step.exitCode !== 0) {
		const recoveryPath = `Recovery transaction backup path: ${transaction.backupRoot}`;
		if (!step.advisory) step.warnings = [...step.warnings ?? [], recoveryPath];
		if (!step.stderrTail?.includes(transaction.backupRoot)) step.stderrTail = [step.stderrTail, recoveryPath].filter(Boolean).join("\n");
	}
	result.steps = [...result.steps, step];
	if (result.status !== "ok" && !result.recovery?.packageRollbackVerified) {
		defaultRuntime.error(step.stderrTail);
		return;
	}
	if (step.exitCode !== 0 && step.advisory?.kind !== "recoverable-maintenance") return new UpdateCommandFailure({
		...result,
		status: "error",
		reason: "package-backup-retention-failed",
		failedStep: step
	}, 1, step.stderrTail ?? "Package backup completion was not verified.", { cause: cleanupFailure });
}
function resolveUnreportedUpdateAdmissionReport(error, outcome) {
	if (error === outcome) return outcome.report;
	return {
		...outcome.report,
		reason: "update-admission-cleanup-failed",
		failureFacts: outcome.report.failureFacts ?? [{
			check: outcome.report.reason,
			code: outcome.report.reason,
			message: outcome.report.message
		}],
		stepResult: outcome.report.stepResult ? { steps: outcome.report.stepResult.steps } : void 0,
		message: collectNestedErrorCandidates(error).filter((candidate) => candidate instanceof Error).slice(0, 8).map((candidate) => formatErrorMessage(candidate).slice(0, 2e3)).join("\n")
	};
}
async function publishUnreportedUpdateAdmissionOutcome(error, run) {
	const outcome = collectNestedErrorCandidates(error).find((candidate) => candidate instanceof UnreportedUpdateAdmissionOutcome);
	if (!outcome) throw error;
	const cleanupFailed = error !== outcome;
	const params = resolveUnreportedUpdateAdmissionReport(error, outcome);
	const result = await publishPreMutationUpdateOutcome({
		...params,
		...run ? { opts: {
			...params.opts,
			run
		} } : {}
	}, async () => ({
		status: !cleanupFailed && outcome.skipped ? "skipped" : "error",
		...cleanupFailed ? { recovery: {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		} } : {}
	}));
	return {
		result,
		exitCode: !cleanupFailed && outcome.skipped ? outcome.skipped.exitCode : cleanupFailed ? 1 : resolveManagedServiceUpdateFailureExitCode(result)
	};
}
async function reportUnreportedUpdateAdmissionOutcome(error) {
	const { exitCode } = await publishUnreportedUpdateAdmissionOutcome(error);
	return exitCliAfterOutput(defaultRuntime, exitCode);
}
async function reportPreMutationUpdateResult(params) {
	const result = await publishPreMutationUpdateOutcome(params, async () => ({
		status: params.status ?? "error",
		...params.opts.dryRun !== true && params.status !== "skipped" ? { recovery: await (params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, parseUpdateTimeoutMs(params.opts.timeout)) : verifyPackageUpdateRecovery(params.root)) } : {}
	}));
	if (!params.opts.run && params.opts.dryRun && params.reason === "invalid-dev-target") return exitCliAfterOutput(defaultRuntime, 1);
	throw new UpdateCommandFailure(result, params.status === "skipped" ? 0 : resolveManagedServiceUpdateFailureExitCode(result), params.message);
}
function createPreMutationUpdateResult(params, outcome, phase = "requested") {
	const run = params.opts.run;
	const stepResult = outcome.status === "error" ? params.stepResult : void 0;
	const failedStep = stepResult?.failedStep ?? (outcome.status === "error" || params.failureFacts?.length ? {
		name: outcome.status === "skipped" ? phase : params.reason,
		command: "openclaw update",
		cwd: params.root,
		durationMs: 0,
		exitCode: outcome.status === "error" ? 1 : 0,
		stderrTail: params.message,
		...params.recoverySteps ? { recoverySteps: params.recoverySteps } : {},
		failureFacts: normalizeUpdateFailureFacts(params.failureFacts ?? [{
			check: params.reason,
			code: params.reason,
			message: params.message
		}], run?.env)
	} : void 0);
	return {
		...outcome,
		mode: params.mode ?? (params.installKind === "git" ? "git" : "unknown"),
		root: params.root,
		reason: params.reason,
		failedStep: outcome.status === "error" ? failedStep : void 0,
		steps: stepResult?.failedStep ? stepResult.steps : [...stepResult?.steps ?? [], ...failedStep ? [failedStep] : []],
		durationMs: 0
	};
}
async function publishPreMutationUpdateOutcome(params, prepareOutcome) {
	const run = params.opts.run;
	const active = run ? getUpdateRun(run.runId, { env: run.env }) : void 0;
	const nextAction = params.nextAction ?? params.message;
	if (run && active && nextAction) recordUpdateRunPhase(run.runId, active.phase, {
		origin: { nextAction },
		...params.installKind !== "unknown" ? { target: { kind: params.installKind } } : {}
	}, { env: run.env });
	const outcome = await prepareOutcome();
	const result = completeUpdateCommandRun({
		...createPreMutationUpdateResult(params, outcome, active?.phase),
		...outcome.status === "skipped" ? { before: { version: await readPackageVersion(params.root) } } : {}
	}, params.opts.run);
	if (params.opts.dryRun !== true) await writeControlPlaneUpdateRestartSentinelBestEffort({
		meta: params.controlPlaneUpdateSentinelMeta,
		result,
		jsonMode: Boolean(params.opts.json),
		env: run?.env
	});
	if ((params.opts.dryRun || run && !params.opts.json) && params.reason === "invalid-dev-target" && params.message) {
		defaultRuntime.error(params.message);
		return result;
	}
	if (params.opts.json && params.message) defaultRuntime.error(params.message);
	await printResult(result, params.opts, { nextAction });
	return result;
}
/** Write the terminal ledger and its visible result together after settlement. */
async function publishUpdateCommandTerminalResult(params, input, outcome, onTerminalRecord) {
	let record;
	if (outcome.captured) try {
		record = readUpdateCommandTerminalRecord(params, input, outcome.captured);
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure(input, formatErrorMessage(cause), { cause });
	}
	const nextAction = recordUpdateResultNextAction(params, input, record);
	const result = record ? {
		...input,
		runId: record.runId
	} : completeUpdateCommandRun(input, params.opts.run, outcome);
	await printResult(result, params.opts, {
		nextAction,
		record
	});
	if (record) onTerminalRecord?.(record);
	return result;
}
//#endregion
export { suppressDeprecations as S, resolveUpdateCommandAdmissionRoot as _, recordUpdatePackageCompletion as a, assertUpdatePackageActivationAdmission as b, resolveSettledUpdateCommandResult as c, admitUpdateCommandRun as d, completeUpdateCommandRun as f, resolveUpdateCommandAdmissionEnv as g, prepareUpdateCommand as h, publishUpdateCommandTerminalResult as i, withUpdateCommandTerminalResult as l, prepareMutableUpdateRuntime as m, hasDeferredUpdateCommandTerminalResult as n, reportPreMutationUpdateResult as o, createUpdateRunProgress as p, prepareUnexpectedUpdateCommandFailure as r, reportUnreportedUpdateAdmissionOutcome as s, deferUpdateCommandTerminalResult as t, captureUpdateCommandTerminalRecord as u, recordUpdateCommandTarget as v, createPackageUpdateActivationOptions as x, withUpdatePreviewSignals as y };

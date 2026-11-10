import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { i as hashConfigRaw } from "./io.read-helpers-KYk5dB53.mjs";
import { a as ServiceStartRefusalError } from "./service-inspection-error-ozNMOrIE.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-KxvFWleW.mjs";
import { a as terminateStaleGatewayPids } from "./restart-stale-pids-CHtdUHKp.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-BxFUj82Q.mjs";
import { l as recordUpdateRunPhase } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as createManagedUpdateRequesterContinuationAuthority } from "./update-requester-authority-BP771TSP.mjs";
import { m as UpdateCommandRecoveryPendingError } from "./update-command-executor-DUq8yLzH.mjs";
import { h as tryWriteCompletionCache } from "./shared-DRiGAorf.mjs";
import { o as installCompletion } from "./completion-runtime-R_-FGHBd.mjs";
import { c as readUpdateConfigFileSnapshot } from "./update-command-config-CDBhVGHw.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { c as stripGatewayServiceMarkerEnv, i as resolveServiceRefreshEnv, l as withOwnedManagedUpdateEnv, n as resolveOwnedManagedUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { a as gatewayServiceCommandUsesRoot, f as resolveGatewayServiceManagementBlockMessageForUpdate, m as resolveUpdatedGatewayRestartPort, u as readGatewayServiceStateForUpdate } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { i as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-publication-Cwq6T0wO.mjs";
import { _ as runUpdatedInstallGatewayCommand, c as recoverLaunchAgentAndRecheckGatewayHealth, d as observeUpdateGatewayReadiness, h as isPackageManagerUpdateMode, i as verifyUpdatedGateway, m as GatewayRestartHealthError, n as recordFailedUpdateGatewayState, p as DEFINITION_DENIAL } from "./update-command-verification-D_6SIpZK.mjs";
import { n as createUpdateConfigSnapshot } from "./update-command-config-snapshot-tEb-vXUT.mjs";
import { n as createGatewayRestartDeadline } from "./restart-health-deadline-W160VriR.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import "./restart-health-D3oE2IOJ.mjs";
import { n as captureTargetDatabaseSchemaContext, o as isCandidateAdmissionContextCovered, s as updateConfigSource } from "./schema-preflight-Dfpu1-Iv.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { h as recordServiceTimedStep, m as recordServiceReconciliationWarnings, p as recordServiceReconciliationWarning } from "./update-command-result-BgqRj9_Z.mjs";
import { r as ensureCompletionCacheExists, t as checkShellCompletionStatus } from "./doctor-completion-Crr0WQgT.mjs";
import { i as recordMutableUpdateSignalPhase } from "./update-command-mutable-signals-D0wsAuNf.mjs";
import { confirm, isCancel } from "@clack/prompts";
//#region src/cli/update-cli/update-command-service.ts
async function tryInstallShellCompletion(opts) {
	try {
		await tryWriteCompletionCache(opts.root, opts.jsonMode);
	} catch (err) {
		if (!opts.jsonMode) {
			const completionCacheRefreshCommand = formatCliCommand("openclaw completion --write-state");
			defaultRuntime.log(theme.warn(`Completion cache update failed: ${formatErrorMessage(err)}. Update will continue; retry with: ${completionCacheRefreshCommand}`));
		}
	}
	if (opts.jsonMode || !process.stdin.isTTY) return;
	try {
		const status = await checkShellCompletionStatus(CLI_NAME);
		if (status.usesSlowPattern) defaultRuntime.log(theme.muted("Upgrading shell completion to cached version..."));
		else if (status.profileInstalled) {
			if (status.cacheExists) return;
			defaultRuntime.log(theme.muted("Regenerating shell completion cache..."));
		} else {
			if (opts.skipPrompt) return;
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading("Shell completion"));
			const shouldInstall = await confirm({
				message: stylePromptMessage(`Enable ${status.shell} shell completion for ${CLI_NAME}?`),
				initialValue: true
			});
			if (isCancel(shouldInstall) || !shouldInstall) {
				defaultRuntime.log(theme.muted(`Skipped. Run \`${formatCliCommand("openclaw completion --install")}\` later to enable.`));
				return;
			}
		}
		if (!await ensureCompletionCacheExists("openclaw", { generationMode: "core-only" })) throw new Error("completion cache generation failed");
		if (status.usesSlowPattern || !status.profileInstalled) await installCompletion(status.shell, status.usesSlowPattern, CLI_NAME);
	} catch (err) {
		const message = formatErrorMessage(err);
		defaultRuntime.log(theme.warn(`Shell completion refresh failed: ${message}. Update will continue. Resolve the reported error before retrying: ${formatCliCommand("openclaw completion --write-state --install")}`));
	}
}
async function maybeRestartService(params) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => {
		if (params.opts.run !== run || run?.executorFence !== executor) throw new Error("Native restart lost its original update executor.");
		run?.deadline?.signal.throwIfAborted();
		executor?.assertCurrent();
	};
	assertCurrent();
	const invocationEnv = resolveServiceRefreshEnv(process.env, params.invocationCwd);
	const serviceEnv = resolveServiceRefreshEnv(params.serviceEnv ?? invocationEnv, params.invocationCwd);
	const recordPhase = (phase) => {
		assertCurrent();
		if (params.opts.run) {
			recordUpdateRunPhase(params.opts.run.runId, phase, void 0, { env: params.opts.run.env });
			recordMutableUpdateSignalPhase(params.opts.run, phase);
		}
	};
	let verificationObserved = false;
	let lastProgressAt = -Infinity;
	const onProgress = (stage, reason) => {
		if (performance.now() - lastProgressAt < 3e4) return;
		lastProgressAt = performance.now();
		defaultRuntime[params.opts.json ? "error" : "log"](`Gateway readiness (${stage}): ${reason}`);
	};
	const failed = async (outcome = "failed") => {
		recordPhase("verifying");
		if (!verificationObserved) await recordFailedUpdateGatewayState(params.opts.run, serviceEnv, assertCurrent, params.timeoutMs);
		assertCurrent();
		return outcome;
	};
	if (params.shouldRestart) {
		const message = resolveGatewayServiceManagementBlockMessageForUpdate(invocationEnv) ?? resolveGatewayServiceManagementBlockMessageForUpdate(serviceEnv);
		if (message) {
			defaultRuntime.error(message);
			return await failed();
		}
	}
	let activation = {
		...params,
		signal: run?.deadline?.signal,
		timeoutMs: process.platform === "win32" && params.opts.timeout === void 0 ? Math.max(params.timeoutMs, resolveGatewayStartupTiming().deadlineMs) : params.timeoutMs,
		invocationEnv,
		serviceEnv,
		assertCurrent,
		onWarnings: (warnings) => recordServiceReconciliationWarnings(params.result, warnings, run, assertCurrent),
		onTimedStep: (step) => recordServiceTimedStep(params.result, step, run)
	};
	const verdict = activation.serviceUpdateVerdict;
	let preserveDefinition = verdict?.kind === "unresolved" || verdict?.kind === "owned" && !verdict.refreshDefinition;
	if (params.definitionRecovery?.backup || params.definitionRecovery?.preserved) {
		activation.refreshServiceEnv = false;
		activation.serviceRuntimeRefreshRequired = false;
		preserveDefinition = true;
	}
	const requiresInstallRootRefresh = verdict?.kind === "owned" && verdict.requiresInstallRootRefresh;
	const isPackageUpdate = isPackageManagerUpdateMode(activation.result.mode);
	const canRestartUpdatedInstall = () => preserveDefinition || isPackageUpdate && (activation.refreshServiceEnv || activation.serviceInstallEnv === null || activation.requireRunningServiceAfterRestart);
	const serviceUsesUpdatedRoot = () => gatewayServiceCommandUsesRoot({
		root: activation.result.root,
		env: activation.serviceEnv
	});
	if (preserveDefinition && !params.definitionRecovery?.backup) defaultRuntime.error("Gateway service definition left unchanged; ask its deployment owner to repair stale metadata if needed.");
	if (activation.serviceMutationSkipMessage) {
		recordServiceReconciliationWarning(activation.result, activation.serviceEnv, activation.serviceMutationSkipMessage);
		return "ok";
	}
	const reconciliationPending = async () => {
		if (activation.requireRunningServiceAfterRestart) recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `The previous service installation was not restarted automatically because update state may have changed. Inspect \`${formatCliCommand("openclaw gateway status --deep", activation.serviceEnv)}\` before choosing a recovery installation.`);
		await recordFailedUpdateGatewayState(params.opts.run, activation.serviceEnv, assertCurrent);
		assertCurrent();
		return "reconciliation-pending";
	};
	const serviceDefinitionRefused = async (refusal) => {
		recordPhase("verifying");
		recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `SERVICE-DEFINITION: ${refusal.message} The updated installation is kept; after resolving the service hold, run \`${formatCliCommand("openclaw gateway start", activation.serviceEnv)}\`. Gateway readiness remains unverified.`);
		if (!verificationObserved) {
			await recordFailedUpdateGatewayState(params.opts.run, activation.serviceEnv, assertCurrent);
			assertCurrent();
		}
		return "reconciliation-pending";
	};
	const assertRestartFailureCurrent = (failure) => {
		if (hasCommandProcessCleanupError(failure)) throw failure;
		assertCurrent();
		if (failure instanceof UpdateCommandRecoveryPendingError) throw failure;
	};
	const readServiceStartRefusal = async (failure) => {
		if (failure instanceof ServiceStartRefusalError) return failure.refusal;
		const deadline = run?.deadline ?? createGatewayRestartDeadline({ timeoutMs: activation.timeoutMs });
		try {
			const runtime = await deadline.run(() => deadline.read("service startup refusal", () => resolveGatewayService().readRuntime(activation.serviceEnv, { timeoutMs: deadline.remainingMs() })));
			assertCurrent();
			return runtime?.systemd?.startRefusal;
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) throw error;
			if (await deadline.cleanup === "unknown") throw new CommandProcessCleanupError({ cause: error });
			assertCurrent();
			return error instanceof ServiceStartRefusalError ? error.refusal : void 0;
		} finally {
			if (!run?.deadline) deadline.dispose();
		}
	};
	let activationAccepted = false;
	let childReadinessPending = false;
	let updatedInstallRestartNeedsServiceRootProof = false;
	const verifyRestartedGateway = async (expectedGatewayVersion, expectedGatewayBuildId, opts = {}) => {
		recordPhase("verifying");
		const verification = await verifyUpdatedGateway({
			result: activation.result,
			opts: activation.opts,
			serviceEnv: activation.serviceEnv,
			gatewayPort: activation.gatewayPort,
			timeoutMs: activation.timeoutMs,
			onProgress,
			expectedVersion: expectedGatewayVersion,
			expectedBuildId: expectedGatewayBuildId,
			requireRunningService: opts.requireRunningService,
			health: opts.health,
			onVerified: params.onVerified,
			assertCurrent,
			recoverHealth: async (initialHealth, reinspect, assertReadinessCurrent) => {
				assertReadinessCurrent();
				if (childReadinessPending || opts.recoverHealth === false || initialHealth.runtime?.systemd?.startRefusal) return {
					health: initialHealth,
					launchAgentRecovery: null
				};
				let health = initialHealth;
				if (!health.healthy && health.staleGatewayPids.length > 0) {
					if (!activation.opts.json) defaultRuntime.log(theme.warn(`Found stale gateway process(es) after restart: ${health.staleGatewayPids.join(", ")}. Cleaning up...`));
					const terminated = await terminateStaleGatewayPids(health.staleGatewayPids, {
						env: activation.serviceEnv,
						assertCurrent: assertReadinessCurrent
					});
					assertReadinessCurrent();
					const currentOwner = readGatewayOwnerLease({ env: activation.serviceEnv });
					if (terminated.length > 0 && (!currentOwner || currentOwner.state === "dead") && (canRestartUpdatedInstall() || !isPackageUpdate)) activationAccepted = await runUpdatedInstallGatewayCommand({
						...activation,
						assertCurrent: assertReadinessCurrent
					}, "restart") === "accepted";
					health = await reinspect();
				}
				const recovery = await recoverLaunchAgentAndRecheckGatewayHealth({
					onGatewayStartAttempted: params.onGatewayStartAttempted,
					updateRun: params.opts.run,
					assertCurrent: assertReadinessCurrent,
					preserveDefinition,
					health,
					service: resolveGatewayService(),
					port: activation.gatewayPort,
					timeoutMs: activation.timeoutMs,
					onProgress,
					expectedVersion: expectedGatewayVersion,
					...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
					env: activation.serviceEnv
				});
				assertReadinessCurrent();
				const nativeRecovery = recovery.launchAgentRecovery;
				if (nativeRecovery?.status === "recovered" || nativeRecovery?.status === "failed") activationAccepted = nativeRecovery.status === "recovered";
				return recovery;
			}
		});
		verificationObserved = true;
		assertCurrent();
		if (verification.serviceDefinitionRefusal) return await serviceDefinitionRefused(verification.serviceDefinitionRefusal);
		if (verification.stopReason === "still-starting" && activation.result.status !== "error") activation.result.reason = "still-starting";
		if (verification.stopReason === "gateway-readiness-pending" || verification.stopReason === "still-starting") return "readiness-pending";
		if (!verification.ok) params.onVerificationFailure?.(verification.summary);
		else if (verification.pluginWarnings?.length) params.onPluginWarnings?.(verification.pluginWarnings);
		return verification.ok ? "ok" : void 0;
	};
	const expectedIdentity = activation.expectedGatewayIdentity ?? activation.result.after;
	if (!activation.shouldRestart) {
		if (!activation.opts.json) defaultRuntime.log(theme.muted("Gateway: updater restart skipped (--no-restart)."));
		if (isPackageUpdate && activation.observePackageReplacement) try {
			await verifyUpdatedGateway({
				...activation,
				purpose: "package-replacement",
				expectedVersion: normalizeOptionalString(expectedIdentity?.version),
				expectedBuildId: normalizeOptionalString(expectedIdentity?.buildId),
				waitForStartup: false
			});
		} catch (error) {
			assertRestartFailureCurrent(error);
			recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `Package update installed; Gateway observation unavailable with --no-restart: ${formatErrorMessage(error)}. Run openclaw gateway status --deep after startup completes.`);
		}
		return "ok";
	}
	if ((requiresInstallRootRefresh || activation.serviceRuntimeRefreshRequired) && (!activation.refreshServiceEnv || activation.serviceInstallEnv === null)) {
		defaultRuntime.error("The updated installation requires a writable gateway service definition.");
		return await failed();
	}
	if (!activation.opts.json) {
		defaultRuntime.log("");
		defaultRuntime.log(theme.heading("Restarting service..."));
	}
	try {
		let expectedGatewayVersion = normalizeOptionalString(expectedIdentity?.version);
		const expectedGatewayBuildId = normalizeOptionalString(expectedIdentity?.buildId);
		const canVerifyUpdatedGatewayByVersion = expectedGatewayVersion !== void 0 && expectedGatewayVersion !== normalizeOptionalString(activation.result.before?.version);
		let restarted = false;
		let refreshedGatewayHealth;
		if (activation.refreshServiceEnv && activation.serviceInstallEnv !== null) {
			try {
				recordPhase("restarting");
				await runUpdatedInstallGatewayCommand(activation, "install");
				if (expectedGatewayVersion && (isPackageUpdate || expectedGatewayBuildId) && !(process.platform === "win32" && requiresInstallRootRefresh)) {
					recordPhase("verifying");
					const { health } = await observeUpdateGatewayReadiness({
						healthOnly: true,
						gatewayPort: activation.gatewayPort,
						timeoutMs: activation.timeoutMs,
						deadline: run?.deadline,
						onProgress,
						expectedVersion: expectedGatewayVersion,
						...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
						requirePluginHealth: false,
						serviceEnv: activation.serviceEnv,
						requireRunningService: true,
						settle: { probes: 12 },
						assertCurrent
					});
					assertCurrent();
					refreshedGatewayHealth = health.healthy || health.waitOutcome === "timeout" || health.waitOutcome === "still-starting" || health.runtime.systemd?.startRefusal ? health : void 0;
				}
			} catch (err) {
				assertRestartFailureCurrent(err);
				if (!activation.definitionRecovery?.unverified) {
					const refusal = await readServiceStartRefusal(err);
					if (refusal) return await serviceDefinitionRefused(refusal);
				}
				const warning = `Failed to reconcile gateway service with ${activation.result.root ?? "the updated install"}: ${String(err)}. Run \`${formatCliCommand("openclaw gateway install --force", activation.serviceEnv)}\`, then \`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\`.`;
				recordServiceReconciliationWarning(activation.result, activation.serviceEnv, warning);
				if (activation.serviceRuntimeRefreshRequired) {
					params.onVerificationFailure?.("service-runtime-refresh-failed");
					throw err;
				}
				if (activation.definitionRecovery?.unverified) {
					params.onVerificationFailure?.("service-definition-rollback-unverified");
					throw err;
				}
				if (requiresInstallRootRefresh) return await reconciliationPending();
				if (DEFINITION_DENIAL.test(String(err))) {
					preserveDefinition = true;
					if (verdict?.kind !== "owned") throw err;
					const state = await readGatewayServiceStateForUpdate(resolveGatewayService(), activation.serviceEnv, activation.timeoutMs, {
						managerUid: activation.serviceManagerUid,
						assertCurrent
					});
					assertCurrent();
					await revalidateManagedGatewayServiceAfterUpdate({
						state,
						root: activation.result.root ?? verdict.root,
						preManagedServiceStop: {
							serviceManagerUid: activation.serviceManagerUid,
							serviceEnv: activation.serviceEnv,
							serviceUpdateVerdict: {
								...verdict,
								refreshDefinition: false
							}
						}
					});
					assertCurrent();
					const deadline = run?.deadline ?? createGatewayRestartDeadline({ timeoutMs: activation.timeoutMs });
					try {
						activation = {
							...activation,
							serviceEnv: state.env,
							gatewayPort: await deadline.run(() => deadline.read("retained service port", () => resolveUpdatedGatewayRestartPort({
								serviceEnv: state.env,
								serviceCommand: state.command
							})))
						};
					} catch (error) {
						if (await deadline.cleanup === "unknown") throw new CommandProcessCleanupError({ cause: error });
						throw error;
					} finally {
						if (!run?.deadline) deadline.dispose();
					}
					assertCurrent();
					expectedGatewayVersion = normalizeOptionalString(activation.result.after?.version);
				}
				if (isPackageUpdate) updatedInstallRestartNeedsServiceRootProof = !canVerifyUpdatedGatewayByVersion;
			}
			if (requiresInstallRootRefresh && await serviceUsesUpdatedRoot() !== true) {
				recordServiceReconciliationWarning(activation.result, activation.serviceEnv, `Gateway service still points outside the updated install ${activation.result.root}. Run \`${formatCliCommand("openclaw gateway install --force", activation.serviceEnv)}\`, then \`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\`.`);
				return await reconciliationPending();
			}
		}
		if (refreshedGatewayHealth) return await verifyRestartedGateway(expectedGatewayVersion, expectedGatewayBuildId, {
			requireRunningService: true,
			health: refreshedGatewayHealth
		}) ?? await failed("restart-health-failed");
		if (canRestartUpdatedInstall() || !isPackageUpdate && !activation.skipLegacyServiceRestart) {
			if (!preserveDefinition) await createUpdateConfigSnapshot();
			recordPhase("restarting");
			const restart = await runUpdatedInstallGatewayCommand(activation, "restart").catch((error) => {
				if (!(error instanceof GatewayRestartHealthError)) throw error;
				childReadinessPending = true;
				defaultRuntime.error("Gateway is not ready yet; continuing update readiness verification.");
				return "accepted";
			});
			restarted = true;
			activationAccepted = restart === "accepted";
			if (updatedInstallRestartNeedsServiceRootProof && await serviceUsesUpdatedRoot() !== true) {
				if (!activation.opts.json) defaultRuntime.log(theme.warn("Gateway service did not point at the updated install after restart."));
				return await failed();
			}
		} else if (!activation.opts.json) defaultRuntime.log(theme.muted("Gateway: restart skipped (no installed service found)."));
		if (restarted || activation.requireRunningServiceAfterRestart) {
			const requireRunningService = updatedInstallRestartNeedsServiceRootProof || activation.requireRunningServiceAfterRestart;
			const restartHealthy = await verifyRestartedGateway(expectedGatewayVersion, expectedGatewayBuildId, { requireRunningService });
			if (!restartHealthy) {
				if (!activation.opts.json) defaultRuntime.log("");
				return await failed(activationAccepted ? "restart-health-failed" : "failed");
			}
			if (restartHealthy === "readiness-pending" || restartHealthy === "reconciliation-pending") return restartHealthy;
		}
		if (!activation.opts.json && restarted && !preserveDefinition) {
			defaultRuntime.log(theme.success("Daemon restarted successfully."));
			defaultRuntime.log("");
		}
	} catch (err) {
		assertRestartFailureCurrent(err);
		if (!activation.definitionRecovery?.unverified) {
			const refusal = await readServiceStartRefusal(err);
			if (refusal) return await serviceDefinitionRefused(refusal);
		}
		if (err instanceof GatewayRestartHealthError && !updatedInstallRestartNeedsServiceRootProof) return await verifyRestartedGateway(normalizeOptionalString(expectedIdentity?.version), normalizeOptionalString(expectedIdentity?.buildId), {
			requireRunningService: true,
			recoverHealth: false
		}) ?? await failed("restart-health-failed");
		defaultRuntime.error(`Gateway: restart failed: ${String(err)}. Code update remains installed; a service stopped for update may still be stopped. Run \`${formatCliCommand("openclaw gateway status --deep", activation.serviceEnv)}\` and ask its service owner to restart it manually.`);
		return await failed();
	}
	return "ok";
}
//#endregion
//#region src/cli/update-cli/update-command-managed-context.ts
/** Resolve the service's selectors without reading or validating its configuration. */
function resolveOwnedManagedUpdatePreflightEnv(params) {
	const state = params.stopState;
	if (state?.serviceUpdateVerdict?.kind !== "owned" || !state.serviceEnv) return;
	return stripGatewayServiceMarkerEnv(resolveOwnedManagedUpdateEnv({
		processEnv: params.processEnv,
		serviceEnv: state.serviceEnv,
		serviceDefinitionEnv: state.serviceDefinitionEnv,
		invocationCwd: params.invocationCwd
	}));
}
/** Inspection uses the same service selectors as finalization, without activating config/plugins. */
async function captureOwnedManagedUpdatePreflightContext(params) {
	const env = resolveOwnedManagedUpdatePreflightEnv(params);
	return env ? captureTargetDatabaseSchemaContext(env, params) : void 0;
}
async function captureOwnedManagedUpdateContext(params) {
	const stopState = params.stopState;
	if (stopState?.inspected !== true) return;
	const env = resolveOwnedManagedUpdatePreflightEnv(params);
	if (!env) return;
	stopState.serviceEnv = env;
	return await withOwnedManagedUpdateEnv(env, async () => {
		const configSnapshot = await readUpdateConfigFileSnapshot({
			observe: false,
			skipPluginValidation: true
		});
		const pluginInstallRecords = await loadInstalledPluginIndexInstallRecords({ env });
		return {
			env,
			configSnapshot,
			pluginInstallRecords
		};
	});
}
async function readUpdateCandidateSource(env, legacyConfigPlan, options) {
	const context = legacyConfigPlan ? await captureTargetDatabaseSchemaContext(env, {
		legacyConfigPlan,
		...options
	}) : void 0;
	const snapshot = context?.legacyConfigPlan ? context.configSnapshot : await withOwnedManagedUpdateEnv(env, () => readUpdateConfigFileSnapshot({
		skipPluginValidation: true,
		observe: false
	}));
	return {
		config: context?.legacyConfigPlan ? context.config : options?.configValidation === "candidate" && isCandidateAdmissionContextCovered(env) ? snapshot.sourceConfig : snapshot.config,
		hash: hashConfigRaw(snapshot.raw),
		source: updateConfigSource(snapshot)
	};
}
/** Complete native admission before any execution guard can observe the pending requester. */
async function admitUpdateRequesterContinuation(run, executor, root, serviceRoot) {
	const requester = run.requesterAuthority?.requester;
	if (!requester?.authorizationSource?.startsWith("profile:")) return;
	const runId = run.runId;
	const fence = await executor.enter(root, {
		preflight: true,
		serviceRoot
	});
	fence.assertCurrent();
	const continued = await createManagedUpdateRequesterContinuationAuthority(requester, {
		runId,
		executor: fence
	}, run.env);
	fence.assertCurrent();
	run.requesterAuthority = continued;
	run.executorFence = fence;
}
//#endregion
export { resolveOwnedManagedUpdatePreflightEnv as a, readUpdateCandidateSource as i, captureOwnedManagedUpdateContext as n, maybeRestartService as o, captureOwnedManagedUpdatePreflightContext as r, tryInstallShellCompletion as s, admitUpdateRequesterContinuation as t };

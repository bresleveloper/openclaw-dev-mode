import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { a as terminateStaleGatewayPids } from "./restart-stale-pids-BSJ5Iyx5.mjs";
import { l as recordUpdateRunPhase } from "./update-run-ledger-jBhhLo0P.mjs";
import { p as UpdateCommandRecoveryPendingError } from "./update-command-executor-C94Zye_E.mjs";
import { h as tryWriteCompletionCache } from "./shared-CiAI6uii.mjs";
import { o as installCompletion } from "./completion-runtime-D9jqWfnd.mjs";
import { n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import { i as resolveServiceRefreshEnv } from "./update-command-service-env-lR0aWgPL.mjs";
import "./update-command-service-maintenance-Bc6Zm_Kc.mjs";
import { a as gatewayServiceCommandUsesRoot, d as resolveGatewayServiceManagementBlockMessageForUpdate, l as readGatewayServiceStateForUpdate, p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-_baZk9PF.mjs";
import { i as revalidateManagedGatewayServiceAfterUpdate } from "./update-command-service-publication-CRHfFdIc.mjs";
import { _ as runUpdatedInstallGatewayCommand, c as recoverLaunchAgentAndRecheckGatewayHealth, d as observeUpdateGatewayReadiness, h as isPackageManagerUpdateMode, i as verifyUpdatedGateway, m as GatewayRestartHealthError, n as recordFailedUpdateGatewayState, p as DEFINITION_DENIAL } from "./update-command-verification-dRgzET5O.mjs";
import { n as createUpdateConfigSnapshot } from "./update-command-config-snapshot-B6Kh4HK5.mjs";
import { n as createGatewayRestartDeadline } from "./restart-health-deadline-C7VrqJZk.mjs";
import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import "./restart-health-DTQ4sMhk.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { f as recordServiceReconciliationWarning, p as recordServiceReconciliationWarnings } from "./update-command-result-4Ha0lQk3.mjs";
import { r as ensureCompletionCacheExists, t as checkShellCompletionStatus } from "./doctor-completion-CChOy89c.mjs";
import { confirm, isCancel } from "@clack/prompts";
//#region src/cli/update-cli/update-command-service.ts
function shouldPrepareUpdatedInstallRestart(params) {
	return params.requiresInstallRootRefresh === true || isPackageManagerUpdateMode(params.updateMode) || params.updateMode === "git" && params.serviceStoppedForUpdate ? params.serviceInstalled : params.serviceLoaded && (params.updateMode !== "git" || params.serviceMatchesUpdateRoot === true);
}
function resolvePostUpdateServiceStateReadEnv(params) {
	const fallbackEnv = params.processEnv ?? process.env;
	return params.updateMode === "git" || isPackageManagerUpdateMode(params.updateMode) ? params.preManagedServiceEnv ?? fallbackEnv : fallbackEnv;
}
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
		executor?.assertCurrent();
	};
	assertCurrent();
	const invocationEnv = resolveServiceRefreshEnv(process.env, params.invocationCwd);
	const serviceEnv = resolveServiceRefreshEnv(params.serviceEnv ?? invocationEnv, params.invocationCwd);
	const recordPhase = (phase) => {
		assertCurrent();
		if (params.opts.run) recordUpdateRunPhase(params.opts.run.runId, phase, void 0, { env: params.opts.run.env });
	};
	let verificationObserved = false;
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
		invocationEnv,
		serviceEnv,
		assertCurrent,
		onWarnings: (warnings) => recordServiceReconciliationWarnings(params.result, warnings, run, assertCurrent)
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
			expectedVersion: expectedGatewayVersion,
			expectedBuildId: expectedGatewayBuildId,
			requireRunningService: opts.requireRunningService,
			health: opts.health,
			onVerified: params.onVerified,
			assertCurrent,
			recoverHealth: async (initialHealth, reinspect, assertReadinessCurrent) => {
				assertReadinessCurrent();
				if (childReadinessPending || opts.recoverHealth === false) return {
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
					expectedVersion: expectedGatewayVersion,
					...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
					requirePluginHealth: false,
					env: activation.serviceEnv
				});
				assertReadinessCurrent();
				if (recovery.launchAgentRecovery?.attempted) activationAccepted = recovery.launchAgentRecovery.recovered;
				return recovery;
			}
		});
		verificationObserved = true;
		assertCurrent();
		if (verification.stopReason === "still-starting" && activation.result.status !== "error") activation.result.reason = "still-starting";
		if (verification.stopReason === "gateway-readiness-pending" || verification.stopReason === "still-starting") return "readiness-pending";
		if (!verification.ok) params.onVerificationFailure?.(verification.summary);
		else if (verification.pluginWarnings?.length) params.onPluginWarnings?.(verification.pluginWarnings);
		return verification.ok ? "ok" : void 0;
	};
	if (activation.shouldRestart) {
		if ((requiresInstallRootRefresh || activation.serviceRuntimeRefreshRequired) && (!activation.refreshServiceEnv || activation.serviceInstallEnv === null)) {
			defaultRuntime.error("The updated installation requires a writable gateway service definition.");
			return await failed();
		}
		if (!activation.opts.json) {
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading("Restarting service..."));
		}
		try {
			const expectedIdentity = activation.expectedGatewayIdentity ?? activation.result.after;
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
							expectedVersion: expectedGatewayVersion,
							...expectedGatewayBuildId ? { expectedBuildId: expectedGatewayBuildId } : {},
							requirePluginHealth: false,
							serviceEnv: activation.serviceEnv,
							requireRunningService: true,
							settle: { probes: 12 },
							assertCurrent
						});
						assertCurrent();
						refreshedGatewayHealth = health.healthy || health.waitOutcome === "timeout" || health.waitOutcome === "still-starting" ? health : void 0;
					}
				} catch (err) {
					if (hasCommandProcessCleanupError(err)) throw err;
					assertCurrent();
					if (err instanceof UpdateCommandRecoveryPendingError) throw err;
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
						const deadline = createGatewayRestartDeadline({ timeoutMs: activation.timeoutMs });
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
							deadline.dispose();
						}
						assertCurrent();
						expectedGatewayVersion = normalizeOptionalString(activation.result.after?.version);
					}
					if (isPackageUpdate) updatedInstallRestartNeedsServiceRootProof = !canVerifyUpdatedGatewayByVersion;
				}
				if (requiresInstallRootRefresh && await gatewayServiceCommandUsesRoot({
					root: activation.result.root,
					env: activation.serviceEnv
				}) !== true) {
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
				if (updatedInstallRestartNeedsServiceRootProof && await gatewayServiceCommandUsesRoot({
					root: activation.result.root,
					env: activation.serviceEnv
				}) !== true) {
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
				if (restartHealthy === "readiness-pending") return restartHealthy;
			}
			if (!activation.opts.json && restarted && !preserveDefinition) {
				defaultRuntime.log(theme.success("Daemon restarted successfully."));
				defaultRuntime.log("");
			}
		} catch (err) {
			if (hasCommandProcessCleanupError(err)) throw err;
			assertCurrent();
			if (err instanceof UpdateCommandRecoveryPendingError) throw err;
			if (err instanceof GatewayRestartHealthError && !updatedInstallRestartNeedsServiceRootProof) return await verifyRestartedGateway(normalizeOptionalString((activation.expectedGatewayIdentity ?? activation.result.after)?.version), normalizeOptionalString((activation.expectedGatewayIdentity ?? activation.result.after)?.buildId), {
				requireRunningService: true,
				recoverHealth: false
			}) ?? await failed("restart-health-failed");
			defaultRuntime.error(`Gateway: restart failed: ${String(err)}. Code update remains installed; a service stopped for update may still be stopped. Run \`${formatCliCommand("openclaw gateway status --deep", activation.serviceEnv)}\` and ask its service owner to restart it manually.`);
			return await failed();
		}
	} else if (!activation.opts.json) {
		defaultRuntime.log("");
		defaultRuntime.log(theme.muted("Gateway: restart skipped (--no-restart)."));
		const doctor = activation.result.mode === "npm" || activation.result.mode === "pnpm" ? `\`${formatCliCommand("openclaw doctor", activation.serviceEnv)}\`, then ` : "";
		defaultRuntime.log(theme.muted(`Tip: Run ${doctor}\`${formatCliCommand("openclaw gateway restart", activation.serviceEnv)}\` to apply updates to a running gateway.`));
	}
	return "ok";
}
//#endregion
export { tryInstallShellCompletion as i, resolvePostUpdateServiceStateReadEnv as n, shouldPrepareUpdatedInstallRestart as r, maybeRestartService as t };

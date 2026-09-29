import { t as restoreTerminalState } from "./restore-CKYlAJHw.mjs";
import { t as ExitError } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { p as resolveDefaultAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as formatExternalSupervisorActionRequired, o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { w as isSystemdUserServiceAvailable } from "./systemd-service-files-tGuARbbA.mjs";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-Bky3P_UA.mjs";
import { n as GATEWAY_DAEMON_RUNTIME_OPTIONS, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DvAunsR_.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { a as resolveGatewayService, o as startGatewayService, s as formatGatewayServiceStartRepairIssues, t as describeGatewayServiceRestart } from "./service-BCULlL85.mjs";
import "./systemd-j8mO8n69.mjs";
import { C as runTui, t as cancelProcessExitAfterTuiReturn, w as scheduleProcessExitAfterTuiReturn, x as resolveTuiShutdownHardExitMs } from "./tui-BlcuUsRx.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { t as formatWindowsGatewayFirewallGuidance } from "./windows-gateway-firewall-diagnostics-COhnqzT6.mjs";
import { r as resolveLocalControlUiProbeLinks, t as resolveAdvertisedControlUiLinks } from "./control-ui-links-eOymVKB5.mjs";
import { t as PreparedModelCatalogConfigReplacedError } from "./prepared-model-catalog.errors-DftAtHN9.mjs";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import "./workspace-mlzi3k1x.mjs";
import { a as formatCompletionReloadCommand, d as resolveCompletionProfilePath, i as findCompletionProfileWriteError, o as installCompletion, u as resolveCompletionProfileHint } from "./completion-runtime-DXXgSrrB.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { r as ensureCompletionCacheExists, t as checkShellCompletionStatus } from "./doctor-completion-shHFSS_8.mjs";
import { a as hasAuthProfileForProvider } from "./model-config.helpers-qc7Dcjci.mjs";
import { r as listConfiguredWebSearchProviders } from "./runtime-CldNr-kn.mjs";
import { t as describeCodexNativeWebSearch } from "./codex-native-web-search.shared-ZWu7Abre.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { p as waitForGatewayReachable, u as probeGatewayReachable } from "./onboard-helpers-0ZuVvEiw.mjs";
import { t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-CE2bR8AJ.mjs";
import { i as formatHealthCheckFailure } from "./health-format-dbbKwHdv.mjs";
import { a as healthCommandNonExiting } from "./health-UMPZgcnB.mjs";
import { i as waitForControlUiDocument, r as resolveControlUiHandoffTarget } from "./control-ui-handoff-B4iacXRw.mjs";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-ITwcxQGV.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/wizard/setup.completion.ts
async function setupWizardShellCompletion(params) {
	const deps = {
		resolveCliName: () => CLI_NAME,
		checkShellCompletionStatus,
		ensureCompletionCacheExists,
		installCompletion,
		...params.deps
	};
	const cliName = deps.resolveCliName();
	const completionStatus = await deps.checkShellCompletionStatus(cliName);
	const installCompletionForSetup = async () => {
		try {
			await deps.installCompletion(completionStatus.shell, true, cliName);
			return true;
		} catch (error) {
			const writeError = findCompletionProfileWriteError(error);
			if (!writeError) throw error;
			await params.prompter.note(t("wizard.completion.profileNotWritable", {
				profile: writeError.path ?? resolveCompletionProfilePath(completionStatus.shell),
				shell: completionStatus.shell,
				command: formatCompletionReloadCommand(completionStatus.shell, completionStatus.cachePath)
			}), t("wizard.completion.title"));
			return false;
		}
	};
	const generationOptions = { generationMode: "full" };
	const ensureCompletionCache = async () => {
		const cacheGenerated = await deps.ensureCompletionCacheExists(cliName, generationOptions);
		if (!cacheGenerated) await params.prompter.note(t("wizard.completion.cacheFailed", { command: `${cliName} completion --write-state --install` }), t("wizard.completion.title"));
		return cacheGenerated;
	};
	if (completionStatus.usesSlowPattern) {
		if (await ensureCompletionCache()) await installCompletionForSetup();
		return;
	}
	if (completionStatus.profileInstalled && !completionStatus.cacheExists) {
		await ensureCompletionCache();
		return;
	}
	if (!completionStatus.profileInstalled) {
		if (!(params.flow === "quickstart" ? true : await params.prompter.confirm({
			message: t("wizard.completion.enable", {
				shell: completionStatus.shell,
				cli: cliName
			}),
			initialValue: true
		}))) return;
		if (!await ensureCompletionCache()) return;
		if (!await installCompletionForSetup()) return;
		const shell = completionStatus.shell;
		const command = formatCompletionReloadCommand(shell, resolveCompletionProfileHint(shell));
		const reloadHint = shell === "powershell" ? t("wizard.completion.reloadPowerShell", { command }) : t("wizard.completion.reloadShell", { profile: command.slice(7) });
		await params.prompter.note(t("wizard.completion.installed", { reloadHint }), t("wizard.completion.title"));
	}
}
//#endregion
//#region src/wizard/setup.service-runtime.ts
/** Localized onboarding choices for the shared Gateway runtime intent planner. */
function getLocalizedGatewayDaemonRuntimeOptions() {
	return GATEWAY_DAEMON_RUNTIME_OPTIONS.map((option) => ({
		hint: t(option.value === "node" ? "wizard.finalize.daemonRuntimeNodeHint" : "wizard.finalize.daemonRuntimeBunHint"),
		label: t(option.value === "node" ? "wizard.finalize.daemonRuntimeNode" : "wizard.finalize.daemonRuntimeBun"),
		value: option.value
	}));
}
async function resolveOnboardingGatewayRuntime(params) {
	const selection = await resolveGatewaySetupRuntime({
		env: params.env,
		existingCommand: params.existingCommand,
		runtime: params.runtime,
		selectRuntime: params.flow === "quickstart" ? void 0 : () => params.prompter.select({
			message: t("wizard.finalize.daemonRuntime"),
			options: getLocalizedGatewayDaemonRuntimeOptions(),
			initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME
		})
	});
	if (params.flow === "quickstart" && selection.runtime === "node" && !selection.pinnedRuntimePath) await params.prompter.note(t("wizard.finalize.quickstartNodeRuntime"), t("wizard.finalize.daemonRuntime"));
	return selection;
}
//#endregion
//#region src/wizard/setup.finalize.ts
const HATCH_TUI_TIMEOUT_MS = 3e5;
function buildSessionGatewayAuthOverride(params) {
	if (params.settings.authMode === "token" && params.settings.gatewayToken) return {
		...params.nextConfig.gateway?.auth,
		mode: "token",
		token: params.settings.gatewayToken
	};
	if (params.settings.authMode === "password" && params.resolvedGatewayPassword) return {
		...params.nextConfig.gateway?.auth,
		mode: "password",
		password: params.resolvedGatewayPassword
	};
	return params.nextConfig.gateway?.auth;
}
async function startSessionGatewayForOnboarding(params) {
	const progress = params.prompter.progress(t("wizard.finalize.sessionGatewayStarting"));
	try {
		const { startGatewayServer } = await import("./server-BmHZaPST.mjs");
		const server = await startGatewayServer(params.settings.port, {
			bind: params.settings.bind,
			...params.settings.bind === "custom" && params.settings.customBindHost ? { host: params.settings.customBindHost } : {},
			auth: buildSessionGatewayAuthOverride({
				nextConfig: params.nextConfig,
				settings: params.settings,
				resolvedGatewayPassword: params.resolvedGatewayPassword
			}),
			tailscale: params.nextConfig.gateway?.tailscale
		});
		progress.stop(t("wizard.finalize.sessionGatewayStarted"));
		return server;
	} catch (error) {
		progress.stop(t("wizard.finalize.sessionGatewayStartFailed"));
		await params.prompter.note([
			t("wizard.finalize.sessionGatewayStartFailed"),
			formatErrorMessage(error),
			t("wizard.finalize.startGatewayNow", { command: formatCliCommand("openclaw gateway run") })
		].join("\n"), "Gateway");
		return;
	}
}
async function closeSessionGatewayForOnboarding(params) {
	await params.sessionGateway.close({ reason: params.reason }).catch((error) => {
		params.runtime.error(formatErrorMessage(error));
	});
}
const loadSearchSetupModule = createLazyRuntimeModule(() => import("./search-setup-Clessnlk.mjs"));
function buildGatewayRecoveryProjection(params) {
	const { gateway } = params;
	const notDetected = t("wizard.finalize.gatewayNotDetected");
	if (params.reachable && gateway.status !== "failed") return {
		detail: t("wizard.finalize.gatewayReachable"),
		summary: t("wizard.guided.complete")
	};
	if (gateway.status === "ready") {
		const service = params.serviceLabel ?? t("wizard.finalize.gatewayService");
		const detail = t("wizard.finalize.managedGatewayUnreachable", {
			service,
			statusCommand: formatCliCommand("openclaw gateway status --deep"),
			recoveryCommand: formatCliCommand("openclaw gateway restart")
		});
		return {
			detail,
			summary: `${notDetected} ${detail.replaceAll("\n", " ")}`
		};
	}
	if (gateway.status === "failed") {
		const service = params.serviceLabel ?? t("wizard.finalize.gatewayService");
		const detail = t("wizard.finalize.managedGatewaySetupFailed", {
			service,
			error: gateway.error,
			statusCommand: formatCliCommand("openclaw gateway status --deep"),
			recoveryCommand: formatCliCommand("openclaw gateway install --force")
		});
		return {
			detail,
			summary: `${params.reachable ? "" : `${notDetected} `}${detail.replaceAll("\n", " ")}`
		};
	}
	const startGuidance = gateway.reason === "external" ? formatExternalSupervisorActionRequired("start the gateway") : t("wizard.finalize.startGatewayNow", { command: formatCliCommand("openclaw gateway run") });
	const summary = [notDetected, startGuidance].join(" ");
	if (gateway.reason === "external") return {
		detail: [notDetected, startGuidance].join("\n"),
		summary
	};
	return {
		detail: [
			notDetected,
			t("wizard.finalize.noBackgroundGatewayExpected"),
			startGuidance,
			t("wizard.finalize.rerunInstallDaemon", { command: formatCliCommand("openclaw onboard --install-daemon") }),
			t("wizard.finalize.skipHealthNextTime", { command: formatCliCommand("openclaw onboard --skip-health") })
		].join("\n"),
		summary
	};
}
/**
* Ensure the gateway service matches the onboarding decision: prompt/decide
* whether to install the daemon, then install/restart/reinstall it. Shared by
* the classic wizard finalize and the bootstrap onboarding flow.
*/
async function ensureGatewayServiceForOnboarding(params) {
	const { flow, opts, nextConfig, settings, prompter, runtime } = params;
	const withWizardProgress = async (label, optionsLocal, work) => {
		const progress = prompter.progress(label);
		try {
			return await work(progress);
		} finally {
			progress.stop(typeof optionsLocal.doneMessage === "function" ? optionsLocal.doneMessage() : optionsLocal.doneMessage);
		}
	};
	if (isGatewayExternallySupervised()) {
		await prompter.note(formatExternalSupervisorActionRequired("manage the gateway service"), "Gateway");
		return {
			gateway: {
				status: "skipped",
				reason: "external"
			},
			containerWithoutUserSystemd: false
		};
	}
	const systemdAvailable = process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
	const linuxWithoutUserSystemd = process.platform === "linux" && !systemdAvailable;
	const containerWithoutUserSystemd = linuxWithoutUserSystemd && isContainerEnvironment();
	if (linuxWithoutUserSystemd) await prompter.note(t(containerWithoutUserSystemd ? "wizard.finalize.containerSystemdUnavailable" : "wizard.finalize.systemdUnavailable"), containerWithoutUserSystemd ? t("wizard.finalize.containerRuntimeTitle") : "Systemd");
	if (process.platform === "linux" && systemdAvailable && opts.installDaemon !== false) {
		const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-Br0q2pO3.mjs");
		await ensureSystemdUserLingerInteractive({
			runtime,
			prompter: {
				confirm: prompter.confirm,
				note: prompter.note
			},
			reason: t("wizard.finalize.systemdLingerReason"),
			requireConfirm: false
		});
	}
	const explicitInstallDaemon = typeof opts.installDaemon === "boolean" ? opts.installDaemon : void 0;
	let installDaemon;
	if (explicitInstallDaemon !== void 0) installDaemon = explicitInstallDaemon;
	else if (linuxWithoutUserSystemd) installDaemon = false;
	else if (flow === "quickstart") installDaemon = true;
	else installDaemon = await prompter.confirm({
		message: t("wizard.finalize.installGateway"),
		initialValue: true
	});
	if (linuxWithoutUserSystemd && installDaemon) {
		await prompter.note(t("wizard.finalize.systemdInstallSkipped"), t("wizard.finalize.gatewayService"));
		installDaemon = false;
	}
	if (!installDaemon) return {
		gateway: {
			status: "skipped",
			reason: linuxWithoutUserSystemd ? "systemd-unavailable" : "explicit"
		},
		containerWithoutUserSystemd
	};
	let gateway = {
		status: "ready",
		action: "reused"
	};
	if (installDaemon) {
		const service = resolveGatewayService();
		if (params.loadedAction === "resume") try {
			const started = await startGatewayService(service, {
				env: process.env,
				stdout: process.stdout
			}, settings.port);
			if (started.outcome === "already-running" || started.outcome === "started") return {
				gateway: {
					status: "ready",
					action: started.outcome === "already-running" ? "reused" : "started"
				},
				containerWithoutUserSystemd
			};
			if (started.outcome === "repair-required") return {
				gateway: {
					status: "failed",
					error: formatGatewayServiceStartRepairIssues(started.issues)
				},
				containerWithoutUserSystemd
			};
		} catch (error) {
			return {
				gateway: {
					status: "failed",
					error: formatErrorMessage(error)
				},
				containerWithoutUserSystemd
			};
		}
		const loaded = await service.isLoaded({ env: process.env });
		let shouldInstall = !loaded;
		if (loaded) {
			const action = (params.loadedAction === "restart" ? params.loadedAction : void 0) ?? await prompter.select({
				message: t("wizard.finalize.alreadyInstalled"),
				options: [
					{
						value: "restart",
						label: t("wizard.finalize.restart")
					},
					{
						value: "reinstall",
						label: t("wizard.finalize.reinstall")
					},
					{
						value: "skip",
						label: t("common.skip")
					}
				]
			});
			if (action === "restart") {
				let restartDoneMessage = t("wizard.finalize.gatewayServiceRestarted");
				await withWizardProgress(t("wizard.finalize.gatewayService"), { doneMessage: () => restartDoneMessage }, async (progress) => {
					progress.update(t("wizard.finalize.gatewayServiceRestarting"));
					const restartResult = await service.restart({
						env: process.env,
						stdout: process.stdout
					});
					const restartStatus = describeGatewayServiceRestart("Gateway", restartResult);
					restartDoneMessage = restartStatus.scheduled ? t("wizard.finalize.gatewayServiceRestartScheduled") : t("wizard.finalize.gatewayServiceRestarted");
					gateway = {
						status: "ready",
						action: restartStatus.scheduled ? "restart-scheduled" : "restarted"
					};
				});
			} else if (action === "reinstall") shouldInstall = true;
		}
		if (shouldInstall) {
			const progress = prompter.progress(t("wizard.finalize.gatewayService"));
			let installError = null;
			const installWarnings = [];
			const flushInstallWarnings = async () => {
				let warning;
				while ((warning = installWarnings.shift()) !== void 0) await prompter.note(warning.message, warning.title);
			};
			try {
				progress.update(t("wizard.finalize.gatewayServicePreparing"));
				const tokenResolution = await resolveGatewayInstallToken({
					config: nextConfig,
					env: process.env
				});
				for (const warning of tokenResolution.warnings) await prompter.note(warning, "Gateway service");
				if (tokenResolution.unavailableReason) installError = [
					t("wizard.finalize.gatewayInstallBlocked"),
					tokenResolution.unavailableReason,
					t("wizard.finalize.gatewayInstallFixAuth")
				].join(" ");
				else {
					const existingCommand = await service.readCommand(process.env);
					const selection = await resolveOnboardingGatewayRuntime({
						env: process.env,
						existingCommand,
						runtime: opts.daemonRuntime,
						flow,
						prompter
					});
					const plan = await buildGatewayInstallPlan({
						env: selection.env,
						port: settings.port,
						runtime: selection.runtime,
						pinnedRuntimePath: selection.pinnedRuntimePath,
						existingCommand,
						warn: (message, title) => {
							installWarnings.push({
								message,
								title
							});
						},
						config: nextConfig
					});
					await flushInstallWarnings();
					progress.update(t("wizard.finalize.gatewayServiceInstalling"));
					await service.install({
						env: process.env,
						stdout: process.stdout,
						...plan,
						runtimePinUpdate: selection.runtimePinUpdate
					});
					gateway = {
						status: "ready",
						action: "installed"
					};
				}
			} catch (err) {
				await flushInstallWarnings();
				installError = formatErrorMessage(err);
			} finally {
				progress.stop(installError ? t("wizard.finalize.gatewayServiceInstallFailed") : t("wizard.finalize.gatewayServiceInstalled"));
			}
			if (installError) {
				await prompter.note(t("wizard.finalize.gatewayServiceInstallFailedWithError", { error: installError }), "Gateway");
				await prompter.note(gatewayInstallErrorHint(), "Gateway");
				gateway = {
					status: "failed",
					error: installError
				};
			}
		}
	}
	return {
		gateway,
		containerWithoutUserSystemd
	};
}
async function finalizeSetupWizard(options) {
	const { flow, opts, baseConfig, nextConfig, settings, prompter, runtime } = options;
	let gatewayProbe = { ok: true };
	let gatewayHealthCheckFailed = false;
	let resolvedGatewayPassword = "";
	let sessionGateway;
	const { gateway, containerWithoutUserSystemd } = await ensureGatewayServiceForOnboarding({
		flow,
		opts,
		nextConfig,
		settings,
		prompter,
		runtime
	});
	if (settings.authMode === "password") try {
		resolvedGatewayPassword = await resolveSetupSecretInputString({
			config: nextConfig,
			value: nextConfig.gateway?.auth?.password,
			path: "gateway.auth.password",
			env: process.env
		}) ?? "";
	} catch (error) {
		await prompter.note([t("wizard.finalize.secretRefAuthFailed", { field: "gateway.auth.password" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	if (containerWithoutUserSystemd && !opts.skipUi) sessionGateway = await startSessionGatewayForOnboarding({
		nextConfig,
		settings,
		resolvedGatewayPassword,
		prompter
	});
	try {
		if (!opts.skipHealth) {
			const probeLinks = resolveLocalControlUiProbeLinks({
				bind: nextConfig.gateway?.bind ?? "loopback",
				port: settings.port,
				customBindHost: nextConfig.gateway?.customBindHost,
				basePath: void 0,
				tlsEnabled: nextConfig.gateway?.tls?.enabled === true
			});
			const probeOptions = {
				url: probeLinks.wsUrl,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0,
				password: settings.authMode === "password" ? resolvedGatewayPassword : void 0
			};
			gatewayProbe = gateway.status === "failed" ? await probeGatewayReachable(probeOptions) : await waitForGatewayReachable({
				...probeOptions,
				...gateway.status === "ready" && gateway.action !== "reused" ? resolveGatewayStartupTiming() : { deadlineMs: 15e3 }
			});
			if (gatewayProbe.ok) try {
				const healthConfig = settings.authMode === "token" && settings.gatewayToken ? {
					...nextConfig,
					gateway: {
						...nextConfig.gateway,
						auth: {
							...nextConfig.gateway?.auth,
							mode: "token",
							token: settings.gatewayToken
						}
					}
				} : nextConfig;
				await healthCommandNonExiting({
					json: false,
					timeoutMs: 1e4,
					config: healthConfig,
					token: settings.authMode === "token" ? settings.gatewayToken : void 0,
					password: settings.authMode === "password" ? resolvedGatewayPassword : void 0
				}, runtime);
			} catch (err) {
				gatewayHealthCheckFailed = true;
				if (!(err instanceof ExitError)) runtime.error(formatHealthCheckFailure(err));
				await prompter.note([
					t("common.docs"),
					"https://docs.openclaw.ai/gateway/health",
					"https://docs.openclaw.ai/gateway/troubleshooting"
				].join("\n"), t("wizard.finalize.healthCheckHelp"));
			}
			else if (gateway.status !== "skipped") {
				runtime.error(formatHealthCheckFailure(new Error(gatewayProbe.detail ?? `gateway did not become reachable at ${probeLinks.wsUrl}`)));
				await prompter.note([
					t("common.docs"),
					"https://docs.openclaw.ai/gateway/health",
					"https://docs.openclaw.ai/gateway/troubleshooting"
				].join("\n"), t("wizard.finalize.healthCheckHelp"));
				await prompter.note(buildGatewayRecoveryProjection({
					gateway,
					reachable: false,
					serviceLabel: resolveGatewayService().label
				}).detail, "Gateway");
			} else await prompter.note(buildGatewayRecoveryProjection({
				gateway,
				reachable: false
			}).detail, "Gateway");
		}
		await prompter.note([
			t("wizard.finalize.addNodes"),
			`- ${t("wizard.finalize.nodeMac")}`,
			`- ${t("wizard.finalize.nodeIos")}`,
			`- ${t("wizard.finalize.nodeAndroid")}`
		].join("\n"), t("wizard.finalize.optionalApps"));
		const controlUiBasePath = nextConfig.gateway?.controlUi?.basePath ?? baseConfig.gateway?.controlUi?.basePath;
		const displayLinks = await resolveAdvertisedControlUiLinks({
			bind: settings.bind,
			port: settings.port,
			customBindHost: settings.customBindHost,
			basePath: controlUiBasePath,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const probeLinks = resolveLocalControlUiProbeLinks({
			bind: settings.bind,
			port: settings.port,
			customBindHost: settings.customBindHost,
			basePath: controlUiBasePath,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		if (opts.skipHealth || !gatewayProbe.ok && gateway.status !== "failed") gatewayProbe = await probeGatewayReachable({
			url: probeLinks.wsUrl,
			token: settings.authMode === "token" ? settings.gatewayToken : void 0,
			password: settings.authMode === "password" ? resolvedGatewayPassword : ""
		});
		const controlUiEnabled = nextConfig.gateway?.controlUi?.enabled ?? baseConfig.gateway?.controlUi?.enabled ?? true;
		let dashboardReady = controlUiEnabled && opts.skipUi === true;
		if (!opts.skipUi && controlUiEnabled && gatewayProbe.ok) {
			let progress;
			try {
				const target = await resolveControlUiHandoffTarget({
					config: {
						...nextConfig,
						gateway: {
							...nextConfig.gateway,
							port: settings.port,
							bind: settings.bind,
							...settings.customBindHost ? { customBindHost: settings.customBindHost } : {},
							...controlUiBasePath ? { controlUi: {
								...nextConfig.gateway?.controlUi,
								basePath: controlUiBasePath
							} } : {}
						}
					},
					env: {
						...process.env,
						OPENCLAW_GATEWAY_PORT: String(settings.port)
					}
				});
				const document = await waitForControlUiDocument({
					url: target.documentUrl,
					tlsConfig: target.tlsConfig,
					onPending: () => {
						progress = prompter.progress(t("wizard.guided.controlUiPreparing"));
					}
				});
				dashboardReady = document.ready;
				if (!document.ready) runtime.error(document.reason);
			} catch (error) {
				dashboardReady = false;
				runtime.error(formatErrorMessage(error));
			} finally {
				progress?.stop();
			}
		}
		const gatewayStatusLine = gatewayProbe.ok ? t("wizard.finalize.gatewayReachable") : t("wizard.finalize.gatewayNotDetectedStatus", { detail: gatewayProbe.detail ? ` (${gatewayProbe.detail})` : "" });
		const windowsFirewallLines = formatWindowsGatewayFirewallGuidance({ bind: settings.bind });
		const bootstrapPath = path.join(resolveUserPath(options.workspaceDir), DEFAULT_BOOTSTRAP_FILENAME);
		const hasBootstrap = await fs.access(bootstrapPath).then(() => true).catch(() => false);
		const agentDir = resolveDefaultAgentDir(nextConfig);
		const [{ resolveDefaultModelAuthStatus, resolveDefaultModelCatalogFacts }, { loadPreparedModelCatalogSnapshot }] = await Promise.all([import("./auth-choice-BSEaTH7K.mjs"), import("./prepared-model-catalog-CFgw7dXn.mjs")]);
		const modelCatalog = await loadPreparedModelCatalogSnapshot({
			config: nextConfig,
			readOnly: true
		}).catch((error) => {
			if (!(error instanceof PreparedModelCatalogConfigReplacedError)) throw error;
		});
		const modelCatalogFacts = modelCatalog ? resolveDefaultModelCatalogFacts(nextConfig, modelCatalog.entries, { routeVariants: modelCatalog.routeVariants }) : void 0;
		const modelAuthStatus = modelCatalogFacts ? resolveDefaultModelAuthStatus(nextConfig, {
			agentDir,
			...modelCatalogFacts.observedRoutes ? { observedRoutes: modelCatalogFacts.observedRoutes } : {}
		}) : void 0;
		const shouldSeedBootstrapHatch = hasBootstrap && options.hadExistingConfig !== true && modelAuthStatus?.status === "ready";
		await prompter.note([
			dashboardReady ? t("wizard.finalize.webUiUrl", { url: displayLinks.httpUrl }) : void 0,
			t("wizard.finalize.gatewayWsUrl", { url: displayLinks.wsUrl }),
			gatewayStatusLine,
			...windowsFirewallLines,
			t("wizard.finalize.controlUiDocs")
		].filter(Boolean).join("\n"), "Control UI");
		let launchedTui = false;
		const shouldLaunchTui = !opts.skipUi;
		if (shouldLaunchTui) {
			if (hasBootstrap) await prompter.note([
				t("wizard.finalize.workspaceReady"),
				...shouldSeedBootstrapHatch ? [t("wizard.finalize.firstTerminalChat")] : [],
				t("wizard.finalize.editBootstrap")
			].join("\n"), t("wizard.finalize.hatchYourAgent"));
			if (modelAuthStatus?.status === "missing") await prompter.note([t("wizard.finalize.noModelAuth", { provider: modelAuthStatus.provider }), t("wizard.finalize.noModelAuthNext", { command: formatCliCommand("openclaw configure --section model") })].join("\n"), t("wizard.finalize.noModelAuthTitle"));
			if (gatewayProbe.ok) {
				const tokenNotes = [
					t("wizard.finalize.gatewayTokenShared"),
					t("wizard.finalize.gatewayTokenStored"),
					t("wizard.finalize.gatewayTokenView", { command: formatCliCommand("openclaw gateway auth-token --show") }),
					t("wizard.finalize.gatewayTokenGenerate", { command: formatCliCommand("openclaw doctor --generate-gateway-token") }),
					t("wizard.finalize.dashboardOpenAnytime", { command: formatCliCommand("openclaw dashboard --no-open") })
				].filter(Boolean);
				await prompter.note(tokenNotes.join("\n"), "Token");
			}
		} else if (opts.skipUi) await prompter.note(t("wizard.finalize.skipControlUi"), t("wizard.finalize.controlUiTitle"));
		await prompter.note([t("wizard.finalize.backupWorkspace"), t("wizard.finalize.workspaceDocs")].join("\n"), t("wizard.finalize.workspaceBackupTitle"));
		await prompter.note(t("wizard.finalize.securityReminder"), t("wizard.security.title"));
		await setupWizardShellCompletion({
			flow,
			prompter
		});
		const codexNativeSummary = describeCodexNativeWebSearch(nextConfig);
		const webSearchProvider = nextConfig.tools?.web?.search?.provider;
		const webSearchEnabled = nextConfig.tools?.web?.search?.enabled;
		const configuredSearchProviders = listConfiguredWebSearchProviders({ config: nextConfig });
		if (webSearchProvider) {
			const { resolveExistingKey, hasExistingKey, hasKeyInEnv } = await loadSearchSetupModule();
			const entry = configuredSearchProviders.find((e) => e.id === webSearchProvider);
			const label = entry?.label ?? webSearchProvider;
			const storedKey = entry ? resolveExistingKey(nextConfig, webSearchProvider) : void 0;
			const keyConfigured = entry ? hasExistingKey(nextConfig, webSearchProvider) : false;
			const envAvailable = entry ? hasKeyInEnv(entry) : false;
			const hasKey = keyConfigured || envAvailable;
			const authProviderId = entry?.authProviderId?.trim();
			const authProviderLabel = authProviderId === "xai" ? "xAI" : authProviderId;
			const providerAuthProfileAvailable = authProviderId ? hasAuthProfileForProvider({
				provider: authProviderId,
				agentDir
			}) : false;
			const oauthAuthProfileAvailable = authProviderId && providerAuthProfileAvailable ? hasAuthProfileForProvider({
				provider: authProviderId,
				agentDir,
				type: "oauth"
			}) : false;
			const hasCredential = hasKey || providerAuthProfileAvailable;
			const keySource = storedKey ? t("wizard.finalize.webSearchKeyStored") : keyConfigured ? t("wizard.finalize.webSearchKeyRef") : envAvailable ? t("wizard.finalize.webSearchKeyEnv", { env: entry?.envVars.join(" / ") ?? "" }) : oauthAuthProfileAvailable && authProviderLabel ? t("wizard.finalize.webSearchOAuthProfile", { provider: authProviderLabel }) : providerAuthProfileAvailable && authProviderLabel ? t("wizard.finalize.webSearchAuthProfile", { provider: authProviderLabel }) : void 0;
			if (!entry) await prompter.note([
				t("wizard.finalize.webSearchProviderUnavailable", { provider: label }),
				t("wizard.finalize.webSearchUnavailableAction"),
				`  ${formatCliCommand("openclaw configure --section web")}`,
				"",
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
			else if (webSearchEnabled !== false && entry.requiresCredential === false) await prompter.note([
				t("wizard.finalize.webSearchKeyFree"),
				"",
				t("wizard.finalize.webSearchProvider", { provider: label }),
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
			else if (webSearchEnabled !== false && hasCredential) await prompter.note([
				t("wizard.finalize.webSearchEnabled"),
				"",
				t("wizard.finalize.webSearchProvider", { provider: label }),
				...keySource ? [keySource] : [],
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
			else if (entry.requiresCredential !== false && !hasCredential) await prompter.note([
				t("wizard.finalize.webSearchNoKey", { provider: label }),
				t("wizard.finalize.webSearchNeedsKey"),
				`  ${formatCliCommand("openclaw configure --section web")}`,
				"",
				t("wizard.finalize.webSearchGetKey", { url: entry?.signupUrl ?? "https://docs.openclaw.ai/tools/web" }),
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
			else await prompter.note([
				t("wizard.finalize.webSearchDisabled", { provider: label }),
				t("wizard.finalize.webSearchReenable", { command: formatCliCommand("openclaw configure --section web") }),
				"",
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
		} else {
			const { hasExistingKey, hasKeyInEnv } = await loadSearchSetupModule();
			const legacyDetected = configuredSearchProviders.find((e) => hasExistingKey(nextConfig, e.id) || hasKeyInEnv(e));
			if (legacyDetected) await prompter.note([t("wizard.finalize.webSearchAutoDetected", { provider: legacyDetected.label }), t("wizard.finalize.webDocs")].join("\n"), t("wizard.finalize.webSearchTitle"));
			else if (codexNativeSummary) await prompter.note([
				t("wizard.finalize.managedWebSearchSkipped"),
				codexNativeSummary,
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
			else await prompter.note([
				t("wizard.finalize.webSearchSkipped"),
				`  ${formatCliCommand("openclaw configure --section web")}`,
				"",
				t("wizard.finalize.webDocs")
			].join("\n"), t("wizard.finalize.webSearchTitle"));
		}
		if (codexNativeSummary) await prompter.note([
			codexNativeSummary,
			t("wizard.finalize.codexNativeSearchOnly"),
			t("wizard.finalize.webDocs")
		].join("\n"), t("wizard.finalize.codexNativeSearchTitle"));
		await prompter.note(t("wizard.finalize.whatNow"), t("wizard.finalize.whatNowTitle"));
		await prompter.outro(!gatewayProbe.ok || gateway.status === "failed" ? buildGatewayRecoveryProjection({
			gateway,
			reachable: gatewayProbe.ok,
			serviceLabel: gateway.status === "skipped" ? void 0 : resolveGatewayService().label
		}).summary : gatewayHealthCheckFailed ? t("wizard.finalize.outroHealthCheckFailed", { command: formatCliCommand("openclaw health") }) : dashboardReady ? t("wizard.finalize.outroDashboardLink") : controlUiEnabled ? [t("wizard.guided.complete"), t("wizard.finalize.dashboardWhenReady", { command: formatCliCommand("openclaw dashboard") })].join(" ") : t("wizard.guided.complete"));
		if (shouldLaunchTui) {
			restoreTerminalState("pre-setup tui", { resumeStdinIfPaused: false });
			try {
				await runTui({
					...gatewayProbe.ok ? {
						config: nextConfig,
						boundGateway: {
							url: displayLinks.wsUrl,
							...settings.authMode === "token" && settings.gatewayToken ? { token: settings.gatewayToken } : {},
							...settings.authMode === "password" && resolvedGatewayPassword ? { password: resolvedGatewayPassword } : {}
						}
					} : { local: true },
					deliver: false,
					message: shouldSeedBootstrapHatch ? t("wizard.finalize.bootstrapHatchMessage") : void 0,
					initialMessageTimeoutMs: HATCH_TUI_TIMEOUT_MS
				});
			} finally {
				restoreTerminalState("post-setup tui", { resumeStdinIfPaused: false });
				if (sessionGateway) {
					const cleanupExitTimer = scheduleProcessExitAfterTuiReturn({ delayMs: resolveTuiShutdownHardExitMs({ localMode: true }) });
					try {
						await closeSessionGatewayForOnboarding({
							sessionGateway,
							runtime,
							reason: "onboarding tui exited"
						});
						sessionGateway = void 0;
					} finally {
						cancelProcessExitAfterTuiReturn(cleanupExitTimer);
					}
				}
			}
			scheduleProcessExitAfterTuiReturn();
			launchedTui = true;
		}
		return { launchedTui };
	} finally {
		if (sessionGateway) await closeSessionGatewayForOnboarding({
			sessionGateway,
			runtime,
			reason: "onboarding finalize exited"
		});
	}
}
//#endregion
export { ensureGatewayServiceForOnboarding, finalizeSetupWizard };

import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import { v as resolveFutureConfigActionBlock } from "./config-env-vars-BHI12YH5.mjs";
import { r as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-aFpXeB1n.mjs";
import { c as readConfigFileSnapshot, o as readBestEffortConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { s as resolveSystemdServiceName, w as isSystemdUserServiceAvailable } from "./systemd-service-files-tGuARbbA.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-DujRnzx9.mjs";
import { t as appendGatewayLifecycleAuditLog } from "./restart-logs-DcfskF2f.mjs";
import { t as createGatewayCredentialPlan } from "./credential-planner-D-JGW62E.mjs";
import { n as isGatewaySecretRefUnavailableError, t as GatewaySecretRefUnavailableError } from "./credentials-CyW929E5.mjs";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-U-tMi0Ou.mjs";
import { r as checkTokenDrift } from "./service-audit-Bj8Y2WTD.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import { n as inspectGatewayServiceStartRepair, o as startGatewayService, r as readGatewayServiceLoadState, t as describeGatewayServiceRestart } from "./service-YFvztZiz.mjs";
import "./systemd-j8mO8n69.mjs";
import { s as renderSystemdUnavailableHints } from "./runtime-hints-DEzqKgi3.mjs";
import { t as isWSL } from "./wsl-BqZ6SFne.mjs";
import { _ as emitDaemonAlreadyRunning, h as createDaemonActionContext, m as buildDaemonServiceSnapshot, r as filterContainerGenericHints, u as resolveDaemonInstallBlockMessage, v as emitDaemonScheduledRestart } from "./shared-Ba-Zp0iU.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint, t as formatInvalidConfigRecoveryHint } from "./config-recovery-hints-DZUkkFyc.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-BWFXViLe.mjs";
import { a as prepareGatewayRestartIntentLegacyProcess, c as GatewayRestartPreparationError, o as writeGatewayRestartIntentSync, s as writeGatewayServiceRestartIntentSync, t as clearGatewayRestartIntentSync } from "./restart-intent-hiIYFAg0.mjs";
//#region src/cli/daemon-cli/lifecycle-audit.ts
function appendGatewayLifecycleAudit(params) {
	appendGatewayLifecycleAuditLog(params.env ?? process.env, {
		action: params.action,
		source: params.source,
		mode: params.mode,
		...params.pid === void 0 ? {} : { pid: params.pid },
		interactive: isTerminalInteractive()
	});
}
function createGatewayLifecycleMutationAudit(params) {
	const reportMutation = createGatewayLifecycleMutationReporter((mutation) => {
		appendGatewayLifecycleAudit({
			action: params.action,
			source: params.source ?? "cli",
			mode: mutation.mode,
			...params.env === void 0 ? {} : { env: params.env }
		});
	});
	return (mutation) => reportMutation(mutation.mode);
}
function createServiceLifecycleMutationAudit(params) {
	return params.serviceNoun === "Gateway" ? createGatewayLifecycleMutationAudit({ action: params.action }) : void 0;
}
function appendServiceLifecycleRepairAudit(params) {
	if (params.serviceNoun !== "Gateway") return;
	appendGatewayLifecycleAudit({
		action: params.action,
		source: "cli",
		mode: "service-repair",
		...params.pid === void 0 ? {} : { pid: params.pid }
	});
}
//#endregion
//#region src/cli/daemon-cli/gateway-token-drift.ts
function authModeDisablesToken(mode) {
	return mode === "password" || mode === "none" || mode === "trusted-proxy";
}
function isPasswordFallbackActive(params) {
	const plan = createGatewayCredentialPlan({
		config: params.cfg,
		env: params.env
	});
	if (plan.authMode !== void 0) return false;
	return plan.passwordCanWin && !plan.tokenCanWin;
}
/** Resolve the expected Gateway token for service drift checks, or undefined when token auth is inactive. */
async function resolveGatewayTokenForDriftCheck(params) {
	const env = params.env ?? process.env;
	const mode = params.cfg.gateway?.auth?.mode;
	if (authModeDisablesToken(mode)) return;
	if (isPasswordFallbackActive({
		cfg: params.cfg,
		env
	})) return;
	const resolved = await resolveGatewayAuthToken({
		cfg: params.cfg,
		env,
		envFallback: "never",
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.token) return resolved.token;
	if (!resolved.secretRefConfigured) return;
	throw new GatewaySecretRefUnavailableError("gateway.auth.token");
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-action-preflight.ts
const ACTION_PROSE = {
	start: "start the gateway service",
	restart: "restart the gateway service",
	stop: "stop the gateway service",
	uninstall: "uninstall the gateway service"
};
function formatPluginPackagingRuntimeOutputRecoveryHints() {
	return formatPluginPackagingRuntimeOutputRecoveryHint().split("\n");
}
/** Best-effort validation before a service action mutates runtime state. */
async function getServiceActionPreflightFailure(action) {
	let snapshot;
	try {
		snapshot = await readConfigFileSnapshot({
			observe: false,
			pluginValidation: action === "stop" ? "core-only" : void 0
		});
		if (snapshot.exists && !snapshot.valid) return {
			message: snapshot.issues.length > 0 ? renderConfigValidationIssueLines(snapshot, "").join("\n") : "Unknown validation issue.",
			...isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? { hints: formatPluginPackagingRuntimeOutputRecoveryHints() } : {}
		};
	} catch {
		return null;
	}
	const futureBlock = resolveFutureConfigActionBlock({
		action: ACTION_PROSE[action],
		snapshot
	});
	if (futureBlock) return {
		message: futureBlock.message,
		hints: futureBlock.hints
	};
	return null;
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-restart-intent.ts
function createServiceRestartIntent(params) {
	let recorded = false;
	let env = process.env;
	return {
		prepare: async () => {
			if (params.serviceNoun !== "Gateway" || recorded) return;
			const runtime = await params.service.readRuntime(process.env).catch(() => null);
			assertGatewayServiceUpdateCurrent();
			const nativeService = process.platform === "linux" || process.platform === "darwin";
			let service;
			let legacyProcess;
			if (nativeService) try {
				const command = await params.service.readCommand(process.env, { requireEffective: true });
				assertGatewayServiceUpdateCurrent();
				if (!command) throw new GatewayRestartPreparationError("service-command");
				env = mergeGatewayServiceEnv(process.env, command);
				service = process.platform === "linux" ? {
					kind: "systemd",
					name: runtime?.systemd?.unit ?? resolveSystemdServiceName(process.env)
				} : {
					kind: "launchd",
					name: resolveLaunchAgentLabel(process.env)
				};
				legacyProcess = await prepareGatewayRestartIntentLegacyProcess({
					env,
					command,
					runtimePid: runtime?.pid,
					readRuntime: () => params.service.readRuntime(process.env),
					assertCurrent: assertGatewayServiceUpdateCurrent
				});
			} catch {
				assertGatewayServiceUpdateCurrent();
				throw new GatewayRestartPreparationError("service-command");
			}
			assertGatewayServiceUpdateCurrent();
			const options = {
				env,
				reason: "gateway.restart",
				...params.intent ? { intent: params.intent } : {}
			};
			recorded = service ? writeGatewayServiceRestartIntentSync({
				...options,
				service,
				legacyProcess,
				nativeStopped: runtime?.status === "stopped" && runtime.pid === void 0,
				assertCurrent: assertGatewayServiceUpdateCurrent
			}) : writeGatewayRestartIntentSync({
				...options,
				targetPid: runtime?.pid
			});
		},
		clear: () => {
			if (recorded) {
				assertGatewayServiceUpdateCurrent();
				clearGatewayRestartIntentSync(env);
				recorded = false;
			}
		}
	};
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-core.ts
async function maybeAugmentSystemdHints(hints) {
	if (process.platform !== "linux") return hints;
	if (await isSystemdUserServiceAvailable().catch(() => false)) return hints;
	return [...hints, ...renderSystemdUnavailableHints({
		wsl: await isWSL(),
		kind: "generic_unavailable"
	})];
}
function mergeWarnings(captured, reported) {
	const combined = [...captured, ...reported ?? []];
	return combined.length > 0 ? combined : void 0;
}
async function failServiceNotLoaded(params) {
	const hints = filterContainerGenericHints(await maybeAugmentSystemdHints(params.renderStartHints()));
	params.fail(`${params.serviceNoun} service ${params.service.notLoadedText}.`, hints);
}
async function resolveServiceLoadedOrFail(params) {
	const hasInstalledDefinition = async () => params.service.hasInstalledDefinition ? await params.service.hasInstalledDefinition({ env: process.env }).catch(() => false) : Boolean(await params.service.readCommand(process.env).catch(() => null));
	const loadState = await readGatewayServiceLoadState(params.service, { env: process.env });
	if (loadState.status === "unknown") {
		params.fail(`${params.inspectionFailureMessage ?? `${params.serviceNoun} service check failed`}: ${loadState.detail}`);
		return null;
	}
	return loadState.status === "loaded" || Boolean(params.acceptInstalledDefinition) && await hasInstalledDefinition();
}
async function runServiceUninstall(params) {
	const json = Boolean(params.opts?.json);
	const { stdout, emit, fail } = createDaemonActionContext({
		action: "uninstall",
		json
	});
	if (resolveIsNixMode(process.env)) {
		fail("Nix mode detected; service uninstall is disabled.");
		return;
	}
	{
		const preflight = await getServiceActionPreflightFailure("uninstall");
		if (preflight) {
			fail(`${params.serviceNoun} uninstall blocked: ${preflight.message}`, preflight.hints);
			return;
		}
	}
	let loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail,
		inspectionFailureMessage: `${params.serviceNoun} uninstall aborted because service status is unknown; resolve the inspection error before retrying`
	});
	if (loaded === null) return;
	if (loaded && params.stopBeforeUninstall) try {
		await params.service.stop({
			env: process.env,
			stdout
		});
	} catch {}
	try {
		await params.service.uninstall({
			env: process.env,
			stdout
		});
	} catch (err) {
		fail(`${params.serviceNoun} uninstall failed: ${String(err)}`);
		return;
	}
	loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail,
		inspectionFailureMessage: `${params.serviceNoun} uninstall verification failed because service status is unknown`
	});
	if (loaded === null) return;
	if (loaded && params.assertNotLoadedAfterUninstall) {
		fail(`${params.serviceNoun} service still loaded after uninstall.`);
		return;
	}
	emit({
		ok: true,
		result: "uninstalled",
		service: buildDaemonServiceSnapshot(params.service, loaded)
	});
}
async function runServiceStart(params) {
	const json = Boolean(params.opts?.json);
	const serviceCommand = formatCliCommand(`openclaw ${params.serviceNoun.toLowerCase()}`);
	const { stdout, warnings, emitMessage, fail } = createDaemonActionContext({
		action: "start",
		json
	});
	const warn = json ? (message) => warnings.push(message) : void 0;
	const emitStarted = async (result) => {
		await params.postStartCheck?.({
			json,
			stdout,
			warnings,
			warn,
			fail
		});
		emitMessage({
			ok: true,
			result: "started",
			message: result.message,
			warnings: mergeWarnings(warnings, result.reportedWarnings),
			service: buildDaemonServiceSnapshot(params.service, result.loaded)
		});
	};
	const loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail
	});
	if (loaded === null) return;
	{
		const preflight = await getServiceActionPreflightFailure("start");
		if (preflight) {
			fail(preflight.hints ? `${params.serviceNoun} start blocked: ${preflight.message}` : `${params.serviceNoun} aborted: config is invalid.\n${preflight.message}\n${formatInvalidConfigRecoveryHint()}`, preflight.hints);
			return;
		}
	}
	if (!loaded) try {
		const handled = await params.onNotLoaded?.({
			json,
			stdout,
			warn,
			fail
		});
		if (handled) {
			await emitStarted({
				loaded: handled.loaded ?? false,
				message: handled.message,
				reportedWarnings: handled.warnings
			});
			return;
		}
	} catch (err) {
		fail(`${params.serviceNoun} start failed: ${String(err)}`, params.renderStartHints());
		return;
	}
	try {
		const startResult = await startGatewayService(params.service, {
			env: process.env,
			stdout,
			warn,
			onMutation: createServiceLifecycleMutationAudit({
				serviceNoun: params.serviceNoun,
				action: "start"
			})
		}, params.expectedPort);
		if (startResult.outcome === "missing-install") {
			await failServiceNotLoaded({
				serviceNoun: params.serviceNoun,
				service: params.service,
				renderStartHints: params.renderStartHints,
				fail
			});
			return;
		}
		if (startResult.outcome === "already-running") {
			if (startResult.issues.length > 0) {
				const repairAction = params.repairLoadedService ? "restart" : "install --force";
				const warning = `${params.serviceNoun} service already running, but its installed service definition needs repair: ${startResult.issues.map((issue) => issue.message).join("; ")}; run \`${serviceCommand} ${repairAction}\` to apply.`;
				warnings.push(warning);
				if (!json) defaultRuntime.log(warning);
			}
			emitDaemonAlreadyRunning({
				serviceNoun: params.serviceNoun,
				service: params.service,
				pid: startResult.state.runtime?.pid,
				warnings,
				emitMessage
			});
			return;
		}
		if (startResult.outcome === "repair-required") {
			try {
				const handled = await params.repairLoadedService?.({
					json,
					stdout,
					warn,
					fail,
					state: startResult.state,
					issues: startResult.issues
				});
				if (handled) {
					appendServiceLifecycleRepairAudit({
						serviceNoun: params.serviceNoun,
						action: "start"
					});
					await emitStarted({
						loaded: handled.loaded ?? true,
						message: handled.message,
						reportedWarnings: handled.warnings
					});
					return;
				}
			} catch (err) {
				fail(`${params.serviceNoun} repair failed: ${String(err)}`, params.renderStartHints());
				return;
			}
			fail(`${params.serviceNoun} service needs repair before it can start: ${startResult.issues.map((issue) => issue.message).join("; ")}`, [`${serviceCommand} install --force`]);
			return;
		}
		await emitStarted({ loaded: startResult.state.loadState.status === "loaded" });
	} catch (err) {
		fail(`${params.serviceNoun} start failed: ${String(err)}`, params.renderStartHints());
	}
}
async function runServiceStop(params) {
	const json = Boolean(params.opts?.json);
	const { stdout, emit, emitMessage, fail } = createDaemonActionContext({
		action: "stop",
		json
	});
	const gatewayStopAudit = createServiceLifecycleMutationAudit({
		serviceNoun: params.serviceNoun,
		action: "stop"
	});
	const loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail
	});
	if (loaded === null) return;
	{
		const preflight = await getServiceActionPreflightFailure("stop");
		if (preflight) {
			fail(`${params.serviceNoun} stop blocked: ${preflight.message}`, preflight.hints);
			return;
		}
	}
	if (!loaded) {
		if (params.stopWhenNotLoaded) {
			try {
				await params.service.stop({
					env: process.env,
					stdout,
					disable: params.opts?.disable,
					onMutation: gatewayStopAudit
				});
			} catch (err) {
				fail(`${params.serviceNoun} stop failed: ${String(err)}`);
				return;
			}
			emit({
				ok: true,
				result: "stopped",
				service: buildDaemonServiceSnapshot(params.service, false)
			});
			return;
		}
		try {
			const handled = await params.onNotLoaded?.({
				json,
				stdout,
				fail
			});
			if (handled) {
				emitMessage({
					ok: true,
					result: handled.result,
					message: handled.message,
					warnings: handled.warnings,
					service: buildDaemonServiceSnapshot(params.service, false)
				});
				return;
			}
		} catch (err) {
			fail(`${params.serviceNoun} stop failed: ${String(err)}`);
			return;
		}
		emitMessage({
			ok: true,
			result: "not-loaded",
			message: `${params.serviceNoun} service ${params.service.notLoadedText}.`,
			service: buildDaemonServiceSnapshot(params.service, loaded)
		});
		return;
	}
	try {
		await params.service.stop({
			env: process.env,
			stdout,
			disable: params.opts?.disable,
			onMutation: gatewayStopAudit
		});
	} catch (err) {
		fail(`${params.serviceNoun} stop failed: ${String(err)}`);
		return;
	}
	const finalLoaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail,
		inspectionFailureMessage: `${params.serviceNoun} stop verification failed because service status is unknown`
	});
	if (finalLoaded === null) return;
	emit({
		ok: true,
		result: "stopped",
		service: buildDaemonServiceSnapshot(params.service, finalLoaded)
	});
}
async function runServiceRestart(params) {
	const json = Boolean(params.opts?.json);
	const { stdout, warnings, emitMessage, fail } = createDaemonActionContext({
		action: "restart",
		json
	});
	const warn = json ? (message) => warnings.push(message) : void 0;
	const restartIntent = params.opts?.restartIntent;
	const gatewayRestartAudit = createServiceLifecycleMutationAudit({
		serviceNoun: params.serviceNoun,
		action: "restart"
	});
	let handledRecovery = null;
	let handledRepair = null;
	let recoveredLoadedState = null;
	const { prepare: prepareGatewayRestartIntent, clear: clearPreparedRestartIntent } = createServiceRestartIntent({
		serviceNoun: params.serviceNoun,
		service: params.service,
		intent: restartIntent
	});
	const emitScheduledRestart = (restartStatus, serviceLoaded) => {
		return emitDaemonScheduledRestart({
			emitMessage,
			result: restartStatus.daemonActionResult,
			message: restartStatus.message,
			service: params.service,
			loaded: serviceLoaded,
			warnings
		});
	};
	const loaded = await resolveServiceLoadedOrFail({
		serviceNoun: params.serviceNoun,
		service: params.service,
		fail,
		acceptInstalledDefinition: true
	});
	if (loaded === null) return false;
	{
		const preflight = await getServiceActionPreflightFailure("restart");
		if (preflight) {
			fail(preflight.hints ? `${params.serviceNoun} restart blocked: ${preflight.message}` : `${params.serviceNoun} aborted: config is invalid.\n${preflight.message}\n${formatInvalidConfigRecoveryHint()}`, preflight.hints);
			return false;
		}
	}
	if (params.restartOwnedProcess) try {
		handledRecovery = await params.restartOwnedProcess({
			json,
			stdout,
			warn,
			fail
		});
	} catch (err) {
		fail(`${params.serviceNoun} restart failed: ${String(err)}`);
		return false;
	}
	if (loaded && !handledRecovery) params.beforeServiceMutation?.();
	if (!loaded && !handledRecovery) {
		try {
			handledRecovery = await params.onNotLoaded?.({
				json,
				stdout,
				warn,
				fail
			}) ?? null;
		} catch (err) {
			fail(`${params.serviceNoun} restart failed: ${String(err)}`);
			return false;
		}
		if (!handledRecovery) {
			await failServiceNotLoaded({
				serviceNoun: params.serviceNoun,
				service: params.service,
				renderStartHints: params.renderStartHints,
				fail
			});
			return false;
		}
		if (handledRecovery.warnings?.length) warnings.push(...handledRecovery.warnings);
		recoveredLoadedState = handledRecovery.loaded ?? null;
	}
	if (loaded && !handledRecovery && params.repairLoadedService) try {
		const { state, issues } = await inspectGatewayServiceStartRepair(params.service, { env: process.env }, params.expectedPort);
		if (issues.length > 0) {
			await prepareGatewayRestartIntent();
			handledRepair = await params.repairLoadedService({
				json,
				stdout,
				warn,
				fail,
				state,
				issues
			});
			if (!handledRepair) {
				clearPreparedRestartIntent();
				fail(`${params.serviceNoun} service needs repair before restart: ${issues.map((issue) => issue.message).join("; ")}`, [formatCliCommand("openclaw gateway install --force")]);
				return false;
			}
			appendServiceLifecycleRepairAudit({
				serviceNoun: params.serviceNoun,
				action: "restart",
				pid: state.runtime?.pid
			});
			if (handledRepair.warnings?.length) warnings.push(...handledRepair.warnings);
		}
	} catch (err) {
		clearPreparedRestartIntent();
		const hints = params.renderStartHints();
		fail(`${params.serviceNoun} repair failed: ${String(err)}`, hints);
		return false;
	}
	if (loaded && !handledRecovery && params.checkTokenDrift) try {
		const command = await params.service.readCommand(process.env);
		const serviceToken = command?.environment?.OPENCLAW_GATEWAY_TOKEN;
		const configToken = await resolveGatewayTokenForDriftCheck({
			cfg: await readBestEffortConfig(),
			env: {
				...process.env,
				...command?.environment
			}
		});
		const driftIssue = checkTokenDrift({
			serviceToken,
			configToken
		});
		if (driftIssue) {
			const recovery = resolveDaemonInstallBlockMessage("gateway") ?? `Run \`${formatCliCommand("openclaw gateway install --force")}\` to refresh the service token source.`;
			const warning = `${driftIssue.message} ${recovery}`;
			warnings.push(warning);
			if (!json) defaultRuntime.log(`\n⚠️  ${warning}\n`);
		}
	} catch (err) {
		if (isGatewaySecretRefUnavailableError(err, "gateway.auth.token")) {
			const warning = "Unable to verify gateway token drift: gateway.auth.token SecretRef is configured but unavailable in this command path.";
			warnings.push(warning);
			if (!json) defaultRuntime.log(`\n⚠️  ${warning}\n`);
		}
	}
	let postCheckFailed = false;
	try {
		let restartResult;
		if (loaded && !handledRepair && !handledRecovery) {
			await prepareGatewayRestartIntent();
			try {
				restartResult = await params.service.restart({
					preserveDefinition: params.opts?.preserveDefinition,
					env: process.env,
					stdout,
					warn,
					onMutation: gatewayRestartAudit
				});
			} catch (err) {
				clearPreparedRestartIntent();
				throw err;
			}
		}
		let restartStatus = describeGatewayServiceRestart(params.serviceNoun, restartResult ?? { outcome: "completed" });
		if (restartStatus.scheduled) return emitScheduledRestart(restartStatus, loaded || recoveredLoadedState === true);
		if (params.postRestartCheck) {
			const postRestartResult = await params.postRestartCheck({
				json,
				stdout,
				warnings,
				warn,
				activationAccepted: restartResult?.outcome === "completed" || Boolean(handledRecovery),
				fail: (message, hints, result) => {
					postCheckFailed = true;
					fail(message, hints, result);
				}
			});
			if (postRestartResult) {
				restartStatus = describeGatewayServiceRestart(params.serviceNoun, postRestartResult);
				if (restartStatus.scheduled) return emitScheduledRestart(restartStatus, loaded || recoveredLoadedState === true);
			}
		}
		emitMessage({
			ok: true,
			result: "restarted",
			message: handledRecovery?.message ?? handledRepair?.message,
			service: buildDaemonServiceSnapshot(params.service, loaded || recoveredLoadedState === true),
			warnings: warnings.length ? warnings : void 0
		});
		return true;
	} catch (err) {
		if (postCheckFailed) throw err;
		const hints = params.renderStartHints();
		fail(`${params.serviceNoun} restart failed: ${String(err)}`, hints);
		return false;
	}
}
//#endregion
export { appendGatewayLifecycleAudit as a, runServiceUninstall as i, runServiceStart as n, createGatewayLifecycleMutationAudit as o, runServiceStop as r, runServiceRestart as t };

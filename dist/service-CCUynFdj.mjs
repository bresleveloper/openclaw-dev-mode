import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { f as resolveGatewayProfileSuffix } from "./constants-BLghGsId.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { a as getGatewayServiceUpdateNativeCommand, d as runServiceInspectionGuard, f as withServiceInspectionBudget, l as withGatewayServiceUpdateAuthority, u as getServiceInspectionClock } from "./service-update-authority-CoX8GMUL.mjs";
import { a as assertServiceInspectionFallbackAllowed, i as ServiceOwnershipRefusalError, o as findServiceOwnershipRefusal, r as ServiceInspectionError } from "./service-inspection-error-Bsltcpi4.mjs";
import { r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-CUdBruRD.mjs";
import { t as captureGatewayServiceRebind } from "./service-rebind-CQbm-oeP.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-Cbp6mAbj.mjs";
import { v as formatFutureConfigActionBlock, y as resolveFutureConfigActionBlock } from "./config-env-vars-DjPHKieF.mjs";
import { a as readScheduledTaskCommand } from "./schtasks-layout-BWyDzx-H.mjs";
import { a as restartScheduledTask, g as readStartupEntryState, h as readScheduledTaskRuntime, l as startScheduledTask, m as isScheduledTaskInstalled, n as stageScheduledTask, p as isScheduledTaskEnabled, r as uninstallScheduledTask, t as installScheduledTask, u as stopScheduledTask } from "./schtasks-BZ33FXAo.mjs";
import { o as resolveServiceEntrypoint } from "./service-layout-BNLNn9Ng.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
import { f as readLaunchAgentProgramArguments, i as isLaunchAgentLoaded, p as readLaunchAgentRuntime, r as isLaunchAgentEnabled } from "./launchd-runtime-DZ5wYTpU.mjs";
import { r as readSystemdServiceExecStart } from "./systemd-service-files-BXSBYnK_.mjs";
import { n as withSystemdServiceReadBinding, t as withGatewayServiceOperationLock } from "./service-operation-lock-Dnqiud_w.mjs";
import { c as installLaunchAgent, i as stopLaunchAgent, l as stageLaunchAgent, o as restartLaunchAgent, s as startLaunchAgent, u as uninstallLaunchAgent } from "./launchd-TECuGOT_.mjs";
import { i as commitDaemonRuntimePin, n as assertDaemonRuntimePinDefinition, o as readDaemonRuntimePinForInstall, r as assertDaemonRuntimePinPlan, t as assertDaemonRuntimePinCurrent } from "./runtime-pin-state-N6enW3o3.mjs";
import { t as admitSystemdServiceReadBinding } from "./systemd-peer-C8O143Y7.mjs";
import { a as findSystemdGatewayInstallation, c as isSystemdServiceAbsent, i as findInstalledSystemdGatewayScope } from "./systemd-scope-CKzHr-87.mjs";
import { t as readSystemdDefinitionMutationCapability } from "./systemd-definition-mutation-DS-eP-Cj.mjs";
import { a as installSystemdService, c as uninstallSystemdService, n as readSystemdServiceRuntime, s as stageSystemdService, t as isSystemdServiceEnabled } from "./systemd-C4RkjiSR.mjs";
import { n as startSystemdService, r as stopSystemdService, t as restartSystemdService } from "./systemd-lifecycle-CWcFMVrn.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/daemon/future-config-guard.ts
/** Prevents daemon write actions when the config belongs to a newer OpenClaw. */
async function assertFutureConfigActionAllowed(action) {
	const { readConfigFileSnapshot } = await import("./io.runtime.js");
	const block = await readConfigFileSnapshot().then((snapshot) => resolveFutureConfigActionBlock({
		action,
		snapshot
	})).catch(() => null);
	if (block) throw new Error(formatFutureConfigActionBlock(block));
}
//#endregion
//#region src/daemon/service-start-repair.ts
/** Inspect captured native service commands for repairable start drift. */
const TEMP_PROGRAM_ROOTS = [
	os.tmpdir(),
	"/tmp",
	"/private/tmp",
	"/var/tmp"
].map((entry) => path.resolve(entry));
function collectGatewayServiceStartRepairIssues(state, expectedPort) {
	const command = state.command;
	if (state.loadState.status !== "loaded" || !command) return [];
	const issues = [];
	const servicePort = parseTcpPortFromArgs(command.programArguments) ?? parseTcpPort(command.environment?.OPENCLAW_GATEWAY_PORT ?? "");
	if (expectedPort !== void 0 && servicePort !== null && servicePort !== expectedPort) issues.push({
		code: "port-mismatch",
		message: `service port ${servicePort} does not match current gateway config port ${expectedPort}`
	});
	for (const candidate of /* @__PURE__ */ new Set([command.programArguments[0], resolveServiceEntrypoint(command)])) {
		if (!candidate || !path.isAbsolute(candidate)) continue;
		const resolved = path.resolve(candidate);
		if (TEMP_PROGRAM_ROOTS.some((root) => resolved === root || resolved.startsWith(`${root}${path.sep}`))) {
			issues.push({
				code: "temporary-program",
				message: `service command points at a temporary path: ${candidate}`
			});
			continue;
		}
		if (!fs.existsSync(candidate)) issues.push({
			code: "missing-program",
			message: `service command points at a missing path: ${candidate}`
		});
	}
	return issues;
}
function formatGatewayServiceStartRepairIssues(issues) {
	return issues.map((issue) => issue.message).join("; ");
}
//#endregion
//#region src/daemon/service-load-state.ts
async function readGatewayServiceLoadState(service, args = {}) {
	try {
		return { status: await service.isLoaded(args) ? "loaded" : "not-loaded" };
	} catch (error) {
		assertServiceInspectionFallbackAllowed(error);
		return {
			status: "unknown",
			detail: String(error),
			...error instanceof ServiceInspectionError ? { inspectionReason: error.reason } : {}
		};
	}
}
//#endregion
//#region src/daemon/service-state.ts
/** Shared native service-state inspection with one caller-owned deadline and binding. */
var ServiceInspectionDeadlineError = class extends Error {
	constructor() {
		super("Service inspection deadline expired.");
	}
};
function deadlineLoadState(error) {
	return {
		status: "unknown",
		detail: String(error)
	};
}
/** Expired observations remain diagnostic, never positive liveness or absence evidence. */
function deadlineDiagnosticState(state, error) {
	const runtime = state.runtime?.status === "unknown" ? state.runtime : createServiceRuntimeInspectionFailure(error);
	return {
		...state,
		loadState: state.loadState.status === "unknown" ? state.loadState : deadlineLoadState(error),
		running: false,
		runtime: runtime.missingUnit ? {
			...runtime,
			missingUnit: false
		} : runtime
	};
}
async function readGatewayServiceState(service, input = {}) {
	return await withServiceInspectionBudget(async (budget) => {
		if (input.windowsStartupEntry !== void 0) {
			if (service.readCommand !== readScheduledTaskCommand) throw new Error("Startup file inspection requires the Windows service adapter.");
			return readStartupEntryState(input.windowsStartupEntry, input);
		}
		const timeoutMs = input.timeoutMs ?? (service.readCommand === readSystemdServiceExecStart ? 5e3 : void 0);
		const inspectionDeadline = timeoutMs === void 0 ? void 0 : budget.now() + timeoutMs;
		let args = {
			...input,
			timeoutMs
		};
		const baseEnv = args.env ?? process.env;
		const supplied = args.systemdInstallation;
		const selected = supplied?.kind === "system" || supplied?.kind === "user" ? supplied : void 0;
		try {
			if (!args.systemdReadTarget && (selected || service.readCommand === readSystemdServiceExecStart)) {
				if (inspectionDeadline !== void 0 && budget.now() >= inspectionDeadline) throw new ServiceInspectionDeadlineError();
				const installation = selected ?? await findSystemdGatewayInstallation(baseEnv, {
					requireLoaded: args.requireLoadedCommand,
					loadForInspection: args.loadForInspection,
					timeoutMs: inspectionDeadline === void 0 ? void 0 : inspectionDeadline - budget.now()
				});
				if (installation.kind === "dueling" && args.requireEffective && args.requireLoadedCommand) throw new ServiceOwnershipRefusalError("systemd-competing-managers");
				const target = installation.kind === "system" ? installation.system : installation.kind === "user" || installation.kind === "dueling" ? installation.user : void 0;
				args = {
					...args,
					systemdInstallation: installation,
					systemdReadTarget: target
				};
			}
			if (inspectionDeadline !== void 0 && budget.now() >= inspectionDeadline) throw new ServiceInspectionDeadlineError();
			if (service.readCommand === readSystemdServiceExecStart && args.systemdReadTarget?.scope !== "system" && args.requireEffective && args.requireLoadedCommand && !args.systemdReadBinding) {
				const deadline = inspectionDeadline ?? budget.now() + 5e3;
				return await withSystemdServiceReadBinding(baseEnv, () => admitSystemdServiceReadBinding(baseEnv, deadline, args.systemdReadTarget?.unitName), (binding) => {
					const remaining = deadline - budget.now();
					if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
					return readGatewayServiceStateWithBinding(service, {
						...args,
						systemdReadBinding: binding,
						timeoutMs: remaining
					}, deadline);
				}, deadline);
			}
			return await readGatewayServiceStateWithBinding(service, args, inspectionDeadline);
		} catch (error) {
			if (args.requireEffective || !(error instanceof ServiceInspectionDeadlineError)) throw error;
			return deadlineDiagnosticState({
				...args.systemdInstallation ? { systemdInstallation: args.systemdInstallation } : {},
				installed: false,
				loadState: deadlineLoadState(error),
				running: false,
				env: baseEnv,
				command: null
			}, error);
		}
	});
}
async function readGatewayServiceStateWithBinding(service, args, deadline = getServiceInspectionClock()() + 5e3) {
	const now = getServiceInspectionClock();
	const baseEnv = args.env ?? process.env;
	const { timeoutMs, systemdReadBinding, systemdReadTarget } = args;
	const remainingTimeoutMs = () => {
		if (timeoutMs === void 0) return;
		const remaining = deadline - now();
		if (remaining <= 0) throw new ServiceInspectionDeadlineError();
		return remaining;
	};
	const readDiagnostic = async (read, onDeadline) => {
		try {
			return await read();
		} catch (error) {
			if (!args.requireEffective && error instanceof ServiceInspectionDeadlineError) return onDeadline(error);
			throw error;
		}
	};
	systemdReadBinding?.verify();
	let absent = systemdReadTarget ? false : await service.isAbsent?.({
		env: baseEnv,
		timeoutMs: remainingTimeoutMs()
	}).catch((error) => {
		assertServiceInspectionFallbackAllowed(error);
		return false;
	});
	const managerAbsent = absent && service.readCommand === readSystemdServiceExecStart;
	systemdReadBinding?.verify();
	let commandInspection;
	const command = absent ? null : args.requireEffective ? await service.readCommand(baseEnv, {
		timeoutMs: remainingTimeoutMs(),
		requireEffective: true,
		...!args.requireLoadedCommand ? { onCommandInspection: (inspection) => {
			commandInspection = inspection;
		} } : {},
		...systemdReadBinding ? { systemdReadBinding } : {},
		...systemdReadTarget ? { systemdReadTarget } : {},
		...args.requireLoadedCommand ? { requireLoaded: true } : {},
		...args.loadForInspection ? { loadForInspection: args.loadForInspection } : {}
	}) : await service.readCommand(baseEnv, {
		timeoutMs: remainingTimeoutMs(),
		...systemdReadTarget ? { systemdReadTarget } : {},
		onCommandInspection: (inspection) => {
			commandInspection = inspection;
		}
	}).catch((error) => {
		assertServiceInspectionFallbackAllowed(error);
		return null;
	});
	const mergedEnv = mergeGatewayServiceEnv(systemdReadTarget?.scope === "system" && !resolveGatewayProfileSuffix(baseEnv.OPENCLAW_PROFILE) ? {
		...baseEnv,
		OPENCLAW_SYSTEMD_UNIT: systemdReadTarget.unitName
	} : baseEnv, command);
	const env = process.platform === "win32" && args.requireLoadedCommand && command?.sourcePath ? {
		...mergedEnv,
		OPENCLAW_TASK_SCRIPT: command.sourcePath
	} : mergedEnv;
	runServiceInspectionGuard(() => args.validateEnvBeforeStatusRead?.(env));
	if (!absent && service.isAbsent && args.requireEffective && args.requireLoadedCommand && command === null) {
		systemdReadBinding?.verify();
		const remaining = deadline - now();
		if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		absent = await service.isAbsent({
			env,
			timeoutMs: remaining,
			strictCommandAbsent: true
		}).catch((error) => {
			assertServiceInspectionFallbackAllowed(error);
			return false;
		});
		systemdReadBinding?.verify();
		if (now() >= deadline) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
	}
	if (absent) {
		remainingTimeoutMs();
		const inspectionReason = managerAbsent ? "service-manager-unavailable" : void 0;
		return {
			inspectionReason,
			installed: false,
			loadState: { status: "not-loaded" },
			running: false,
			env,
			command: null,
			runtime: {
				status: "stopped",
				missingUnit: true,
				inspectionReason
			}
		};
	}
	const statusBaseEnv = systemdReadBinding ? baseEnv : env;
	const statusEnv = systemdReadTarget ? {
		...statusBaseEnv,
		OPENCLAW_SYSTEMD_UNIT: systemdReadTarget.unitName
	} : statusBaseEnv;
	const readInstalled = async () => command !== null ? true : service.hasInstalledDefinition?.({
		env: statusEnv,
		timeoutMs: remainingTimeoutMs()
	}).catch((error) => {
		if (args.requireEffective) throw error;
		assertServiceInspectionFallbackAllowed(error);
		return false;
	}) ?? false;
	const readLoadState = async () => readGatewayServiceLoadState(service, {
		env: statusEnv,
		timeoutMs: remainingTimeoutMs(),
		...args.requireEffective ? { requireEffective: true } : {}
	});
	const readRuntime = async () => service.readRuntime(env, {
		timeoutMs: remainingTimeoutMs(),
		...args.requireEffective ? { requireEffective: true } : {},
		...systemdReadTarget ? { systemdReadTarget } : {},
		...commandInspection ? { commandInspection } : {},
		...systemdReadBinding ? { systemdReadBinding } : {},
		...args.requireEffective && args.requireLoadedCommand ? { requireLoaded: true } : {},
		...args.loadForInspection ? { loadForInspection: args.loadForInspection } : {}
	}).catch((error) => createServiceRuntimeInspectionFailure(error));
	const readDefinitionCapability = async () => args.requireEffective ? service.readDefinitionMutationCapability?.({
		env: baseEnv,
		environment: env,
		timeoutMs: remainingTimeoutMs(),
		...systemdReadTarget ? { systemdReadTarget } : {},
		...systemdReadBinding ? { systemdReadBinding } : {},
		...args.requireLoadedCommand ? { requireLoaded: true } : {}
	}).catch((error) => {
		assertServiceInspectionFallbackAllowed(error);
		return {
			kind: "unknown",
			reason: "inspection-failed"
		};
	}) : void 0;
	const readParallel = async () => {
		const results = await Promise.allSettled([
			readDiagnostic(readInstalled, () => command !== null),
			readDiagnostic(readLoadState, deadlineLoadState),
			readDiagnostic(readRuntime, createServiceRuntimeInspectionFailure),
			readDefinitionCapability()
		]);
		for (const result of results) if (result.status === "rejected" && hasCommandProcessCleanupError(result.reason)) throw result.reason;
		for (const result of results) if (result.status === "rejected") {
			const refusal = findServiceOwnershipRefusal(result.reason);
			if (refusal) throw refusal;
		}
		const value = (result) => {
			if (result.status === "rejected") throw result.reason;
			return result.value;
		};
		return [
			value(results[0]),
			value(results[1]),
			value(results[2]),
			value(results[3])
		];
	};
	const [installed, loadState, runtime, definitionMutationCapability] = getGatewayServiceUpdateNativeCommand() ? [
		await readDiagnostic(readInstalled, () => command !== null),
		await readDiagnostic(readLoadState, deadlineLoadState),
		await readDiagnostic(readRuntime, createServiceRuntimeInspectionFailure),
		await readDefinitionCapability()
	] : await readParallel();
	systemdReadBinding?.verify();
	const state = {
		inspectionReason: runtime?.inspectionReason ?? (loadState.status === "unknown" ? loadState.inspectionReason : void 0),
		...args.systemdInstallation ? { systemdInstallation: args.systemdInstallation } : {},
		installed,
		loadState,
		running: runtime?.status === "running",
		env,
		command,
		...definitionMutationCapability ? { definitionMutationCapability } : {},
		runtime
	};
	if (timeoutMs !== void 0 && now() >= deadline) {
		const error = new ServiceInspectionDeadlineError();
		if (args.requireEffective) throw error;
		return deadlineDiagnosticState(state, error);
	}
	return state;
}
//#endregion
//#region src/daemon/service.ts
/** Platform service registry and shared gateway service start/repair logic. */
function ignoreServiceWriteResult(write) {
	return async (args) => {
		await write(args);
	};
}
async function startGatewayService(service, args, expectedPort) {
	const state = await readGatewayServiceState(service, { env: args.env });
	const repairIssues = collectGatewayServiceStartRepairIssues(state, expectedPort);
	if (state.loadState.status === "unknown") throw new Error(`Service status inspection failed: ${state.loadState.detail}`);
	if (state.loadState.status === "not-loaded" && !state.installed) return {
		outcome: "missing-install",
		state
	};
	if (state.loadState.status === "loaded" && state.running) return {
		outcome: "already-running",
		state,
		issues: repairIssues
	};
	if (repairIssues.length > 0) return {
		outcome: "repair-required",
		state,
		issues: repairIssues
	};
	let nextState;
	try {
		await service.start({
			...args,
			env: state.env
		});
		nextState = await readGatewayServiceState(service, { env: state.env });
	} catch (err) {
		const recoveryState = await readGatewayServiceState(service, { env: state.env });
		if (!recoveryState.installed) return {
			outcome: "missing-install",
			state: recoveryState
		};
		throw err;
	}
	if (nextState.loadState.status === "unknown") throw new Error(`Service status inspection failed after start: ${nextState.loadState.detail}`);
	const runtime = nextState.runtime;
	const failedState = normalizeLowercaseStringOrEmpty(runtime?.state) === "failed";
	const newFailedExit = runtime?.status === "stopped" && typeof runtime.lastExitStatus === "number" && runtime.lastExitStatus !== 0 && runtime.lastExitStatus !== state.runtime?.lastExitStatus;
	if (failedState || newFailedExit) {
		const failure = failedState ? "state failed" : `exit ${runtime?.lastExitStatus}`;
		throw new Error(`Service failed to start (${failure}). Check the service logs and retry.`);
	}
	return {
		outcome: "started",
		state: nextState
	};
}
function describeGatewayServiceRestart(serviceNoun, result) {
	if (result.outcome === "scheduled") return {
		scheduled: true,
		daemonActionResult: "scheduled",
		message: `restart scheduled, ${normalizeLowercaseStringOrEmpty(serviceNoun)} will restart momentarily`,
		progressMessage: `${serviceNoun} service restart scheduled.`
	};
	return {
		scheduled: false,
		daemonActionResult: "restarted",
		message: `${serviceNoun} service restarted.`,
		progressMessage: `${serviceNoun} service restarted.`
	};
}
function describeUnsupportedGatewayService(kind) {
	if (process.platform === "freebsd") {
		if (kind === "node") return "Node service management is not supported by this CLI on FreeBSD. Run `openclaw node run` for a foreground node host connected to your Gateway.";
		return "Gateway service management is not supported by this CLI on FreeBSD. For a pkg install, set openclaw_user to your onboarding account and openclaw_enable=\"YES\" in /etc/rc.conf, then use `service openclaw start` (or stop/restart/status) as root. For a foreground Gateway, run `openclaw gateway run` as your onboarding account.";
	}
	return `Gateway service install not supported on ${process.platform}`;
}
function createUnsupportedGatewayService(kind) {
	const unsupportedReason = describeUnsupportedGatewayService(kind);
	const rejectUnsupportedGatewayService = async () => {
		throw new Error(unsupportedReason);
	};
	return {
		label: "Gateway service",
		loadedText: "available",
		notLoadedText: "not installed",
		unsupportedReason,
		stage: rejectUnsupportedGatewayService,
		install: rejectUnsupportedGatewayService,
		uninstall: rejectUnsupportedGatewayService,
		start: rejectUnsupportedGatewayService,
		stop: rejectUnsupportedGatewayService,
		restart: rejectUnsupportedGatewayService,
		isLoaded: rejectUnsupportedGatewayService,
		readCommand: async () => null,
		readRuntime: async () => ({
			status: "unknown",
			detail: unsupportedReason
		})
	};
}
const GATEWAY_SERVICE_REGISTRY = {
	darwin: {
		label: "LaunchAgent",
		loadedText: "loaded",
		notLoadedText: "not loaded",
		stage: ignoreServiceWriteResult(stageLaunchAgent),
		install: ignoreServiceWriteResult(installLaunchAgent),
		uninstall: uninstallLaunchAgent,
		start: startLaunchAgent,
		stop: stopLaunchAgent,
		restart: restartLaunchAgent,
		isLoaded: isLaunchAgentLoaded,
		isEnabled: isLaunchAgentEnabled,
		readCommand: readLaunchAgentProgramArguments,
		readRuntime: readLaunchAgentRuntime
	},
	linux: {
		label: "systemd",
		loadedText: "enabled",
		notLoadedText: "disabled",
		stage: ignoreServiceWriteResult(stageSystemdService),
		install: ignoreServiceWriteResult(installSystemdService),
		uninstall: uninstallSystemdService,
		start: startSystemdService,
		stop: stopSystemdService,
		restart: restartSystemdService,
		isLoaded: isSystemdServiceEnabled,
		isEnabled: isSystemdServiceEnabled,
		isAbsent: ({ env, timeoutMs, strictCommandAbsent }) => isSystemdServiceAbsent(env ?? process.env, {
			timeoutMs,
			strictCommandAbsent
		}),
		hasInstalledDefinition: async ({ env, timeoutMs }) => await findInstalledSystemdGatewayScope(env ?? process.env, { timeoutMs }) !== null,
		readDefinitionMutationCapability: ({ env, environment, timeoutMs, requireLoaded, systemdReadBinding, systemdReadTarget }) => readSystemdDefinitionMutationCapability(env ?? process.env, {
			environment,
			timeoutMs,
			...systemdReadBinding ? { systemdReadBinding } : {},
			...systemdReadTarget ? { systemdReadTarget } : {},
			...requireLoaded ? { requireLoaded: true } : {}
		}),
		readCommand: readSystemdServiceExecStart,
		readRuntime: readSystemdServiceRuntime
	},
	win32: {
		label: "Scheduled Task",
		loadedText: "registered",
		notLoadedText: "missing",
		stage: ignoreServiceWriteResult(stageScheduledTask),
		install: ignoreServiceWriteResult(installScheduledTask),
		uninstall: uninstallScheduledTask,
		start: startScheduledTask,
		stop: stopScheduledTask,
		restart: restartScheduledTask,
		isLoaded: isScheduledTaskInstalled,
		isEnabled: isScheduledTaskEnabled,
		readCommand: readScheduledTaskCommand,
		readRuntime: readScheduledTaskRuntime
	}
};
function guardGatewayServiceMutation(action, mutate, readCommand, readRuntimePinRevision) {
	return async (args) => {
		assertGatewayServiceMutationAllowed(action, process.env);
		if (args.env && args.env !== process.env) assertGatewayServiceMutationAllowed(action, args.env);
		const assertCaller = args.assertCurrent;
		return await withGatewayServiceOperationLock(args.env ?? process.env, async (assertNative) => {
			await assertFutureConfigActionAllowed(action);
			return await withGatewayServiceUpdateAuthority(assertCaller, async (assertCurrent) => {
				await args.beforeMutation?.();
				assertCurrent();
				const result = readCommand ? await captureGatewayServiceRebind(() => readCommand(args.env ?? process.env, { requireEffective: true }), assertCurrent, (preserveAutoStart) => mutate({
					...args,
					assertCurrent,
					...preserveAutoStart ? { preserveAutoStart: true } : {}
				}), readRuntimePinRevision ? () => readRuntimePinRevision(args.env ?? process.env) : void 0) : await mutate({
					...args,
					assertCurrent
				});
				assertCurrent();
				return result;
			}, {
				updateOwned: false,
				assertRecoveryCurrent: assertNative,
				nativeCommand: getGatewayServiceUpdateNativeCommand()
			});
		});
	};
}
function withGatewayServiceMutationGuards(service, kind) {
	const write = (action, mutate, readCommand) => guardGatewayServiceMutation(action, async (args) => {
		const scope = {
			kind,
			env: { ...args.env }
		};
		const update = args.runtimePinUpdate ?? { expected: readDaemonRuntimePinForInstall(scope, null, true) };
		if (!args.runtimePinUpdate && update.expected.stored) throw new Error("This service has explicit runtime intent. Reinstall with --runtime-path to preserve the pin or --runtime to choose a new runtime before rewriting it.");
		assertDaemonRuntimePinCurrent(scope, update.expected);
		const checkDefinition = Boolean(update.pin || update.expected.stored || update.requireDefinitionMatch || update.requireRunning);
		if (checkDefinition) {
			const current = update.requireRunning ? await readGatewayServiceState(service, {
				env: args.env,
				requireEffective: true,
				requireLoadedCommand: true
			}) : void 0;
			const previous = current ? current.command : await service.readCommand(args.env);
			args.assertCurrent?.();
			assertDaemonRuntimePinPlan(update.expected, previous);
			assertDaemonRuntimePinCurrent(scope, update.expected);
			if (current && (current.loadState.status !== "loaded" || !current.running || current.inspectionReason)) throw new Error("The Gateway is paused or its running state could not be verified. Start it before choosing Use bundled runtime.");
		}
		await mutate(args);
		if (checkDefinition) {
			const command = await service.readCommand(args.env);
			args.assertCurrent?.();
			assertDaemonRuntimePinDefinition({
				programArguments: args.programArguments,
				workingDirectory: args.workingDirectory
			}, command);
			commitDaemonRuntimePin(scope, update, command);
		} else assertDaemonRuntimePinCurrent(scope, update.expected);
	}, readCommand, (env) => readDaemonRuntimePinForInstall({
		kind,
		env
	}, null, true).revision);
	return {
		...service,
		stage: write("rewrite the gateway service", service.stage),
		install: write("install or rewrite the gateway service", service.install, service.readCommand),
		uninstall: guardGatewayServiceMutation("uninstall the gateway service", async (args) => {
			const scope = {
				kind,
				env: { ...args.env }
			};
			const expected = readDaemonRuntimePinForInstall(scope, null, true);
			await service.uninstall(args);
			if (!expected.stored) return;
			const command = await service.readCommand(args.env);
			args.assertCurrent?.();
			if (command) throw new Error("Service definition remains after uninstall; runtime pin retained.");
			commitDaemonRuntimePin(scope, { expected }, null);
		}),
		start: guardGatewayServiceMutation("start the gateway service", service.start),
		stop: guardGatewayServiceMutation("stop the gateway service", service.stop),
		restart: guardGatewayServiceMutation("restart the gateway service", service.restart)
	};
}
function isSupportedGatewayServicePlatform(platform) {
	return Object.hasOwn(GATEWAY_SERVICE_REGISTRY, platform);
}
function resolveGatewayService(kind = "gateway") {
	if (isSupportedGatewayServicePlatform(process.platform)) return withGatewayServiceMutationGuards(GATEWAY_SERVICE_REGISTRY[process.platform], kind);
	return createUnsupportedGatewayService(kind);
}
//#endregion
export { readGatewayServiceLoadState as a, readGatewayServiceState as i, resolveGatewayService as n, collectGatewayServiceStartRepairIssues as o, startGatewayService as r, formatGatewayServiceStartRepairIssues as s, describeGatewayServiceRestart as t };

import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as getProcessStartTime, r as isPidAlive } from "./pid-alive-CXdZEzr_.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { _ as formatFutureConfigActionBlock, v as resolveFutureConfigActionBlock } from "./config-env-vars-BHI12YH5.mjs";
import { r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-dG8swyHC.mjs";
import { a as findServiceOwnershipRefusal, i as ServiceOwnershipRefusalError, r as ServiceInspectionError } from "./service-inspection-error-axo4k_qi.mjs";
import { i as readSystemdServiceExecStart, s as resolveSystemdServiceName } from "./systemd-service-files-tGuARbbA.mjs";
import { a as getGatewayServiceUpdateNativeCommand, l as withGatewayServiceUpdateAuthority } from "./service-update-authority-DujRnzx9.mjs";
import { a as resolveServiceEntrypoint } from "./service-layout-DuzmQnH1.mjs";
import { o as readScheduledTaskCommand } from "./schtasks-layout-ZxN1sGLi.mjs";
import { a as resolveSystemdUserTransport, c as openSystemdPrivatePeer, o as openSystemdBroker } from "./systemd-user-transport-ZcY1z7CT.mjs";
import { i as commitDaemonRuntimePin, n as assertDaemonRuntimePinDefinition, o as readDaemonRuntimePinForInstall, r as assertDaemonRuntimePinPlan, t as assertDaemonRuntimePinCurrent } from "./runtime-pin-state-Bz2yXWLQ.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-nAcoRKGt.mjs";
import { d as readLaunchAgentProgramArguments, f as readLaunchAgentRuntime, i as isLaunchAgentLoaded, r as isLaunchAgentEnabled } from "./launchd-runtime-CWqPktfP.mjs";
import { a as startLaunchAgent, c as uninstallLaunchAgent, i as restartLaunchAgent, o as installLaunchAgent, s as stageLaunchAgent, u as stopLaunchAgent } from "./launchd-CnSNukLu.mjs";
import { a as restartScheduledTask, g as readScheduledTaskRuntime, h as isScheduledTaskInstalled, l as startScheduledTask, m as isScheduledTaskEnabled, n as stageScheduledTask, r as uninstallScheduledTask, t as installScheduledTask, u as stopScheduledTask } from "./schtasks-D2U0K9JA.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-BuDPZetd.mjs";
import { n as withSystemdServiceReadBinding, t as withGatewayServiceOperationLock } from "./service-operation-lock-De6Bb79N.mjs";
import { t as captureGatewayServiceRebind } from "./service-rebind-CZ92-EFp.mjs";
import { i as findSystemdGatewayInstallation, r as findInstalledSystemdGatewayScope, s as isSystemdServiceAbsent } from "./systemd-scope-ChBpir81.mjs";
import { t as readSystemdDefinitionMutationCapability } from "./systemd-definition-mutation-Dj7IBhv4.mjs";
import { a as restartSystemdService, d as installSystemdService, m as uninstallSystemdService, n as readSystemdServiceRuntime, o as startSystemdService, p as stageSystemdService, s as stopSystemdService, t as isSystemdServiceEnabled } from "./systemd-j8mO8n69.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/daemon/future-config-guard.ts
/** Prevents daemon write actions when the config belongs to a newer OpenClaw. */
async function readFutureConfigActionBlock(action) {
	const { readConfigFileSnapshot } = await import("./io.runtime.js");
	try {
		const snapshot = await readConfigFileSnapshot();
		return resolveFutureConfigActionBlock({
			action,
			snapshot
		});
	} catch {
		return null;
	}
}
async function assertFutureConfigActionAllowed(action) {
	const block = await readFutureConfigActionBlock(action);
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
function pathIsSameOrChild(candidate, parent) {
	return candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
}
function isTemporaryProgramPath(value) {
	if (!value || !path.isAbsolute(value)) return false;
	const resolved = path.resolve(value);
	return TEMP_PROGRAM_ROOTS.some((root) => pathIsSameOrChild(resolved, root));
}
function isMissingProgramPath(value) {
	if (!value || !path.isAbsolute(value)) return false;
	return !fs.existsSync(value);
}
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
		if (isTemporaryProgramPath(candidate)) {
			issues.push({
				code: "temporary-program",
				message: `service command points at a temporary path: ${candidate}`
			});
			continue;
		}
		if (isMissingProgramPath(candidate)) issues.push({
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
//#region src/daemon/systemd-peer.ts
/** Admit only the private peer belonging to the originally selected broker manager. */
const MANAGER = "org.freedesktop.systemd1";
const BUS = "org.freedesktop.DBus";
const unavailable = () => /* @__PURE__ */ new Error("Original systemd manager binding is unavailable or changed.");
function isLocalUnixAddress(address) {
	try {
		return address.split(";").every((entry) => {
			if (!entry.startsWith("unix:")) return false;
			const fields = /* @__PURE__ */ new Map();
			for (const item of entry.slice(5).split(",")) {
				const split = item.indexOf("=");
				if (split < 1) return false;
				const key = item.slice(0, split);
				const value = decodeURIComponent(item.slice(split + 1));
				if (![
					"path",
					"abstract",
					"guid"
				].includes(key) || fields.has(key) || !value || value.includes("\0")) return false;
				fields.set(key, value);
			}
			const pathname = fields.get("path"), abstract = fields.get("abstract"), guid = fields.get("guid");
			return Boolean((pathname ? path.isAbsolute(pathname) && !abstract : abstract) && (!guid || /^[a-f0-9]{32}$/i.test(guid)));
		});
	} catch {
		return false;
	}
}
async function admitSystemdServiceReadBinding(env, deadline) {
	const route = {
		...process.env,
		...env
	};
	const uid = process.geteuid?.();
	if (process.platform !== "linux" || uid === void 0 || uid === 0 || route.SUDO_USER) return;
	const unit = `${resolveSystemdServiceName(env)}.service`;
	let broker;
	const query = async (method, name, signature) => {
		if (!broker) throw unavailable();
		const tuple = (await broker.query([
			"call",
			BUS,
			"/org/freedesktop/DBus",
			BUS,
			method,
			"s",
			name
		], [signature], deadline))?.[0];
		if (!Array.isArray(tuple) || tuple.length !== 1) throw unavailable();
		return tuple[0];
	};
	let peer;
	try {
		const transport = await resolveSystemdUserTransport(route, deadline, void 0, "admission");
		if (!transport || transport.kind === "private" || transport.kind === "machine" || !path.isAbsolute(transport.runtimeDir) || !isLocalUnixAddress(transport.address)) return;
		broker = await openSystemdBroker(transport.address, deadline);
		const destination = await query("GetNameOwner", MANAGER, "s");
		if (typeof destination !== "string" || !/^:[0-9]+\.[0-9]+$/.test(destination)) throw unavailable();
		const managerUid = await query("GetConnectionUnixUser", destination, "u");
		if (typeof managerUid !== "number" || !Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295) throw unavailable();
		if (managerUid !== uid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		const pid = await query("GetConnectionUnixProcessID", destination, "u");
		if (typeof pid !== "number" || !Number.isInteger(pid) || pid <= 0 || !isPidAlive(pid)) throw unavailable();
		const startTime = getProcessStartTime(pid);
		if (startTime === null) throw unavailable();
		const socket = path.join(transport.runtimeDir, "systemd/private");
		const address = `unix:path=${encodeURIComponent(socket).replaceAll("%2F", "/")}`;
		peer = await openSystemdPrivatePeer(address, {
			uid,
			pid,
			startTime
		}, deadline);
		const currentDestination = await query("GetNameOwner", MANAGER, "s");
		if (typeof currentDestination !== "string" || !/^:[0-9]+\.[0-9]+$/.test(currentDestination)) throw unavailable();
		if (currentDestination !== destination) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		const currentPid = await query("GetConnectionUnixProcessID", destination, "u");
		if (typeof currentPid !== "number" || !Number.isInteger(currentPid) || currentPid <= 0) throw unavailable();
		if (currentPid !== pid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
		peer.verify();
		const retained = peer;
		let unitPath;
		return {
			unit,
			managerUid: uid,
			destination,
			verify: retained.verify,
			close: retained.close,
			async query(args, signatures, until, inspection) {
				retained.verify();
				if (args[1] !== destination) {
					if (typeof args[1] === "string" && /^:[0-9]+\.[0-9]+$/.test(args[1])) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
					throw unavailable();
				}
				if (args[0] === "call") {
					const method = args[4] ?? "";
					const managerRead = [
						"GetUnit",
						"GetUnitFileState",
						"GetUnitProcesses"
					].includes(method);
					const ownedLoad = method === "LoadUnit" && inspection?.managerUid === uid;
					if (method === "LoadUnit" && inspection && inspection.managerUid !== uid) throw new ServiceOwnershipRefusalError("systemd-manager-changed");
					if (managerRead || ownedLoad) {
						if (args[2] !== "/org/freedesktop/systemd1" || args[3] !== `${MANAGER}.Manager` || args[5] !== "s" || typeof args[6] !== "string") throw unavailable();
						if (args[6] !== unit) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
					} else if (method !== "GetProcesses" || args[3] !== `${MANAGER}.Service` || !unitPath || args[2] !== unitPath || args.length !== 5) throw unavailable();
					if (ownedLoad) inspection.assertCurrent();
				} else if (args[0] !== "get-property" || !unitPath || args[2] !== unitPath || ![`${MANAGER}.Unit`, `${MANAGER}.Service`].includes(args[3] ?? "")) throw unavailable();
				const assertCurrent = args[4] === "LoadUnit" ? inspection?.assertCurrent : inspection?.assertReadCurrent ?? inspection?.assertCurrent;
				const values = await retained.query(args, signatures, until, assertCurrent);
				if (args[0] === "call" && ["GetUnit", "LoadUnit"].includes(args[4] ?? "") && values) {
					const [value] = values;
					if (!Array.isArray(value) || value.length !== 1 || typeof value[0] !== "string" || !/^\/org\/freedesktop\/systemd1\/unit\/[A-Za-z0-9_]+$/.test(value[0])) throw unavailable();
					if (unitPath && value[0] !== unitPath) throw new ServiceOwnershipRefusalError("systemd-unit-changed");
					unitPath = value[0];
				}
				return values;
			}
		};
	} catch (error) {
		await peer?.close();
		const refusal = findServiceOwnershipRefusal(error);
		if (refusal) throw refusal;
		return;
	} finally {
		await broker?.close();
	}
}
//#endregion
//#region src/daemon/service.ts
/** Platform service registry and shared gateway service start/repair logic. */
function ignoreServiceWriteResult(write) {
	return async (args) => {
		await write(args);
	};
}
/** Reads the installed service and reports definition drift that must be repaired before launch. */
async function inspectGatewayServiceStartRepair(service, args, expectedPort) {
	const state = await readGatewayServiceState(service, args);
	return {
		state,
		issues: collectGatewayServiceStartRepairIssues(state, expectedPort)
	};
}
async function readGatewayServiceLoadState(service, args = {}) {
	try {
		return { status: await service.isLoaded(args) ? "loaded" : "not-loaded" };
	} catch (error) {
		const refusal = findServiceOwnershipRefusal(error);
		if (refusal) throw refusal;
		return {
			status: "unknown",
			detail: String(error),
			...error instanceof ServiceInspectionError ? { inspectionReason: error.reason } : {}
		};
	}
}
async function readGatewayServiceState(service, input = {}) {
	let args = input;
	const baseEnv = args.env ?? process.env;
	if (service.readCommand === readSystemdServiceExecStart && !args.systemdReadTarget) {
		const installation = await findSystemdGatewayInstallation(baseEnv);
		if (installation.kind === "dueling" && args.requireEffective && args.requireLoadedCommand) throw new ServiceOwnershipRefusalError("systemd-competing-managers");
		const target = installation.kind === "system" ? installation.system : installation.kind === "user" || installation.kind === "dueling" ? installation.user : void 0;
		args = {
			...args,
			systemdInstallation: installation,
			systemdReadTarget: target
		};
	}
	if (service.readCommand === readSystemdServiceExecStart && args.systemdReadTarget?.scope !== "system" && args.requireEffective && args.requireLoadedCommand && !args.systemdReadBinding) {
		const deadline = performance.now() + (args.timeoutMs && args.timeoutMs > 0 ? args.timeoutMs : 5e3);
		return await withSystemdServiceReadBinding(baseEnv, () => admitSystemdServiceReadBinding(baseEnv, deadline), (binding) => {
			const remaining = deadline - performance.now();
			if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
			return readGatewayServiceStateWithBinding(service, {
				...args,
				systemdReadBinding: binding,
				timeoutMs: remaining
			});
		}, deadline);
	}
	return await readGatewayServiceStateWithBinding(service, args);
}
async function readGatewayServiceStateWithBinding(service, args) {
	const baseEnv = args.env ?? process.env;
	const { timeoutMs, systemdReadBinding, systemdReadTarget } = args;
	const deadline = performance.now() + (timeoutMs && timeoutMs > 0 ? timeoutMs : 5e3);
	systemdReadBinding?.verify();
	let absent = await service.isAbsent?.({
		env: baseEnv,
		timeoutMs
	}).catch(() => false);
	const managerAbsent = absent && service.readCommand === readSystemdServiceExecStart;
	systemdReadBinding?.verify();
	let commandInspection;
	const command = absent ? null : args.requireEffective ? await service.readCommand(baseEnv, {
		timeoutMs,
		requireEffective: true,
		...!args.requireLoadedCommand ? { onCommandInspection: (inspection) => {
			commandInspection = inspection;
		} } : {},
		...systemdReadBinding ? { systemdReadBinding } : {},
		...systemdReadTarget ? { systemdReadTarget } : {},
		...args.requireLoadedCommand ? { requireLoaded: true } : {},
		...args.loadForInspection ? { loadForInspection: args.loadForInspection } : {}
	}) : await service.readCommand(baseEnv, {
		timeoutMs,
		...systemdReadTarget ? { systemdReadTarget } : {},
		onCommandInspection: (inspection) => {
			commandInspection = inspection;
		}
	}).catch((error) => {
		const refusal = findServiceOwnershipRefusal(error);
		if (refusal) throw refusal;
		return null;
	});
	const env = mergeGatewayServiceEnv(baseEnv, command);
	args.validateEnvBeforeStatusRead?.(env);
	if (!absent && service.isAbsent && args.requireEffective && args.requireLoadedCommand && command === null) {
		systemdReadBinding?.verify();
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
		absent = await service.isAbsent({
			env,
			timeoutMs: remaining,
			strictCommandAbsent: true
		}).catch(() => false);
		systemdReadBinding?.verify();
		if (performance.now() >= deadline) throw new ServiceInspectionError("systemd-inspection-deadline-exceeded");
	}
	if (absent) {
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
	const readInstalled = async () => command !== null ? true : service.hasInstalledDefinition?.({
		env,
		timeoutMs
	}).catch(() => false) ?? false;
	const readLoadState = () => readGatewayServiceLoadState(service, {
		env: systemdReadBinding ? baseEnv : env,
		timeoutMs
	});
	const readRuntime = () => service.readRuntime(env, {
		timeoutMs,
		...systemdReadTarget ? { systemdReadTarget } : {},
		...commandInspection ? { commandInspection } : {},
		...systemdReadBinding ? { systemdReadBinding } : {},
		...args.requireEffective && args.requireLoadedCommand ? { requireLoaded: true } : {},
		...args.loadForInspection ? { loadForInspection: args.loadForInspection } : {}
	}).catch((error) => createServiceRuntimeInspectionFailure(error));
	const readDefinitionCapability = async () => args.requireEffective ? service.readDefinitionMutationCapability?.({
		env: baseEnv,
		environment: env,
		timeoutMs,
		...systemdReadTarget ? { systemdReadTarget } : {},
		...systemdReadBinding ? { systemdReadBinding } : {},
		...args.requireLoadedCommand ? { requireLoaded: true } : {}
	}).catch(() => ({
		kind: "unknown",
		reason: "inspection-failed"
	})) : void 0;
	const [installed, loadState, runtime, definitionMutationCapability] = getGatewayServiceUpdateNativeCommand() ? [
		await readInstalled(),
		await readLoadState(),
		await readRuntime(),
		await readDefinitionCapability()
	] : await Promise.all([
		readInstalled(),
		readLoadState(),
		readRuntime(),
		readDefinitionCapability()
	]);
	systemdReadBinding?.verify();
	return {
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
}
async function startGatewayService(service, args, expectedPort) {
	const { state, issues: repairIssues } = await inspectGatewayServiceStartRepair(service, { env: args.env }, expectedPort);
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
function createUnsupportedGatewayServiceError(kind) {
	if (process.platform === "freebsd") {
		if (kind === "node") return /* @__PURE__ */ new Error("Node service management is not supported by this CLI on FreeBSD. Run `openclaw node run` for a foreground node host connected to your Gateway.");
		return /* @__PURE__ */ new Error("Gateway service management is not supported by this CLI on FreeBSD. For a pkg install, set openclaw_user to your onboarding account and openclaw_enable=\"YES\" in /etc/rc.conf, then use `service openclaw start` (or stop/restart/status) as root. For a foreground Gateway, run `openclaw gateway run` as your onboarding account.");
	}
	return /* @__PURE__ */ new Error(`Gateway service install not supported on ${process.platform}`);
}
function createUnsupportedGatewayService(kind) {
	const rejectUnsupportedGatewayService = async () => {
		throw createUnsupportedGatewayServiceError(kind);
	};
	return {
		label: "Gateway service",
		loadedText: "available",
		notLoadedText: "not installed",
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
			detail: createUnsupportedGatewayServiceError(kind).message
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
		hasInstalledDefinition: async ({ env }) => await findInstalledSystemdGatewayScope(env ?? process.env) !== null,
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
		if (update.pin || update.expected.stored) {
			const previous = await service.readCommand(args.env);
			args.assertCurrent?.();
			assertDaemonRuntimePinPlan(update.expected, previous);
			assertDaemonRuntimePinCurrent(scope, update.expected);
		}
		await mutate(args);
		if (update.pin || update.expected.stored) {
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
export { resolveGatewayService as a, readGatewayServiceState as i, inspectGatewayServiceStartRepair as n, startGatewayService as o, readGatewayServiceLoadState as r, formatGatewayServiceStartRepairIssues as s, describeGatewayServiceRestart as t };

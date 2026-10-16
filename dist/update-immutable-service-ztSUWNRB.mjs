import { i as getProcessStartTime } from "./pid-alive-CPS_shDt.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { l as withGatewayServiceUpdateAuthority } from "./service-update-authority-CoX8GMUL.mjs";
import { r as fingerprintGatewayServiceDefinition } from "./service-rebind-CQbm-oeP.mjs";
import { o as resolveServiceEntrypoint } from "./service-layout-BNLNn9Ng.mjs";
import { F as execSystemctl, S as captureSystemdServiceIdentity, i as readSystemdServiceExecStartAsRoot, n as readSystemdServiceCommandLocation } from "./systemd-service-files-BXSBYnK_.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Dnqiud_w.mjs";
import { t as parseKeyValueOutput } from "./runtime-parse-CEreG6YC.mjs";
import { n as inspectSystemdProcessMembershipSync } from "./service-process-membership-CUvHuMvA.mjs";
import { n as startSystemdService, r as stopSystemdService } from "./systemd-lifecycle-CWcFMVrn.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
//#region src/infra/update-immutable-service.ts
async function readImmutableService(service, root, generationPath, runtimePath, activation) {
	if (service.scope !== "system" || !/^[A-Za-z0-9_.@:-]+\.service$/u.test(service.unit)) throw new Error("Immutable adoption requires an explicit systemd service unit.");
	const env = { OPENCLAW_SYSTEMD_UNIT: service.unit };
	const target = {
		scope: "system",
		unitName: service.unit,
		unitPath: `/etc/systemd/system/${service.unit}`
	};
	activation?.assertCurrent();
	const location = await readSystemdServiceCommandLocation(env, target);
	activation?.assertCurrent();
	if (!activation?.allowStopped && location.kind !== "command" || location.kind === "command" && !location.command.sourcePath) throw new Error("The immutable Gateway systemd service must already be loaded.");
	if (location.kind === "command") target.unitPath = location.command.sourcePath;
	const command = activation?.allowStopped ? await readSystemdServiceExecStartAsRoot(env, target, service.account, {
		managerUid: 0,
		assertCurrent: activation.assertCurrent
	}) : await readSystemdServiceExecStartAsRoot(env, target, service.account);
	activation?.assertCurrent();
	if (!command || command.reloadPending || !command.sourcePath || location.kind === "command" && command.sourcePath !== target.unitPath) throw new Error("The immutable Gateway service definition could not be verified.");
	target.unitPath = command.sourcePath;
	const runtime = await execSystemctl([
		"--system",
		"show",
		service.unit,
		"--property=Id,LoadState,ActiveState,SubState,MainPID,ControlGroup,TasksCurrent,KillMode,DynamicUser,RootDirectory,RootImage,Job"
	], void 0, 5e3);
	activation?.assertCurrent();
	const properties = parseKeyValueOutput(runtime.stdout, "=");
	if (runtime.code !== 0 || properties.id !== service.unit || properties.loadstate !== "loaded" || ![
		"active",
		...activation?.allowStopped ? ["inactive", "failed"] : [],
		...activation?.allowStarting ? ["activating"] : []
	].includes(properties.activestate ?? "") || properties.dynamicuser !== "no" || properties.rootdirectory !== "" || properties.rootimage !== "") throw new Error("Immutable adoption requires a running systemd service with a fixed account and host filesystem paths.");
	const environment = command.environment ?? {};
	if (environment.OPENCLAW_STATE_DIR !== service.stateDir || environment.OPENCLAW_CONFIG_PATH !== service.configPath || (environment.OPENCLAW_PROFILE?.trim() || null) !== service.profile || command.programArguments.some((argument) => /^--(?:profile|dev)(?:=|$)/u.test(argument))) throw new Error("Immutable service state, config, and profile must match its effective environment; command-line profile overrides are unsupported.");
	const executable = command.programArguments[0];
	const launcher = path.join(root, "bin", "openclaw-gateway");
	if (executable === launcher) {
		if (!(await fs$1.readFile(launcher, "utf8")).startsWith(`#!${runtimePath}\n`)) throw new Error("The immutable launcher does not use the adopted Node executable.");
		return {
			command,
			properties,
			target
		};
	}
	if (activation) throw new Error("Immutable activation requires the packaged stable Gateway launcher; direct generation entrypoints are preparation-only.");
	const entry = resolveServiceEntrypoint(command);
	if (!executable || !path.isAbsolute(executable) || await fs$1.realpath(executable) !== runtimePath || !entry || ![path.join(generationPath, "dist", "index.js"), path.join(root, "current", "dist", "index.js")].includes(entry) || await fs$1.realpath(entry) !== path.join(generationPath, "dist", "index.js")) throw new Error("The systemd Gateway command must use the adopted Node executable and current immutable generation.");
	return {
		command,
		properties,
		target
	};
}
async function verifyImmutableService(service, root, generationPath, runtimePath) {
	await readImmutableService(service, root, generationPath, runtimePath);
}
function readImmutableProcess(pid) {
	const started = getProcessStartTime(pid);
	if (started === null) throw new Error("The immutable Gateway process identity is unavailable.");
	const runtimePath = fs.readlinkSync(`/proc/${pid}/exe`);
	const generationPath = fs.readlinkSync(`/proc/${pid}/cwd`);
	if (getProcessStartTime(pid) !== started) throw new Error("The immutable Gateway process changed during inspection.");
	return {
		processStartTicks: String(started),
		runtimePath,
		generationPath
	};
}
/** Used at the last synchronous effect boundary, never as a persisted grant. */
function assertImmutableServiceProcessCurrent(observed) {
	if (observed.phase !== "running" || observed.pid === null) throw new Error("The immutable Gateway is not running.");
	const current = readImmutableProcess(observed.pid);
	if (current.processStartTicks !== observed.processStartTicks || current.runtimePath !== observed.runtimePath || current.generationPath !== observed.generationPath || inspectSystemdProcessMembershipSync(observed.pid, observed.controlGroup) !== "inside") throw new Error("The immutable Gateway process changed after inspection.");
}
function assertOutsideService(controlGroup) {
	if (inspectSystemdProcessMembershipSync(process.pid, controlGroup) !== "outside") throw new Error("Immutable activation must run outside the Gateway service cgroup.");
}
function immutableCgroupEventsPath(controlGroup) {
	if (!controlGroup.startsWith("/") || controlGroup === "/" || controlGroup.split("/").slice(1).some((part) => !part || part === ".." || part === ".")) throw new Error("The immutable Gateway cgroup cannot be verified.");
	return path.join("/sys/fs/cgroup", controlGroup, "cgroup.events");
}
function cgroupEmpty(controlGroup) {
	const file = immutableCgroupEventsPath(controlGroup);
	try {
		const events = fs.readFileSync(file, "utf8");
		const populated = /^populated ([01])$/mu.exec(events)?.[1];
		if (populated === void 0) throw new Error("The immutable Gateway cgroup population is unavailable.");
		return populated === "0";
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return true;
		throw error;
	}
}
/** Recorded process facts are evidence only; the executor supplies live authority. */
function assertImmutableServiceStoppedCurrent(observed) {
	if (observed.pid !== null) {
		const started = getProcessStartTime(observed.pid);
		if (started === null && fs.lstatSync(`/proc/${observed.pid}`, { throwIfNoEntry: false })) throw new Error("The original immutable Gateway process exit could not be verified.");
		if (String(started) === observed.processStartTicks) throw new Error("The original immutable Gateway process is still alive.");
	}
	if (!cgroupEmpty(observed.controlGroup)) throw new Error("The immutable Gateway cgroup is populated; pointer publication is refused.");
	assertOutsideService(observed.controlGroup);
}
async function inspectImmutableActivationService(params) {
	const { descriptor, generationPath, assertCurrent } = params;
	if (process.platform !== "linux" || process.geteuid?.() !== 0) throw new Error("Immutable activation requires a root Linux updater outside the Gateway service.");
	assertCurrent();
	const { command, properties, target } = await readImmutableService(descriptor.service, descriptor.root, generationPath, descriptor.runtime.path, params);
	assertCurrent();
	if (!/^(?:0|[1-9]\d*)$/u.test(properties.mainpid ?? "")) throw new Error("The immutable Gateway PID could not be inspected.");
	const pid = Number(properties.mainpid) || null;
	const controlGroup = properties.controlgroup ?? "";
	const observedProcess = pid === null ? null : readImmutableProcess(pid);
	const physicalGeneration = observedProcess?.generationPath === generationPath && observedProcess.runtimePath === descriptor.runtime.path;
	let starting = params.allowStarting === true && properties.activestate === "activating" && pid === null;
	if (pid !== null) {
		if (inspectSystemdProcessMembershipSync(pid, controlGroup) !== "inside" || observedProcess?.runtimePath !== descriptor.runtime.path) throw new Error("The immutable Gateway is not running the selected physical generation and runtime.");
		if (!physicalGeneration && params.allowStarting) {
			const argv = fs.readFileSync(`/proc/${pid}/cmdline`, "utf8").split("\0");
			if (argv.at(-1) === "") argv.pop();
			starting = argv[0] === descriptor.runtime.path && argv.length === command.programArguments.length + 1 && command.programArguments.every((argument, index) => argv[index + 1] === argument);
		}
		if (!physicalGeneration && !starting) throw new Error("The immutable Gateway is not running the selected physical generation and runtime.");
		assertOutsideService(controlGroup);
		if (cgroupEmpty(controlGroup)) throw new Error("The running immutable Gateway requires an observable populated cgroup v2.");
		assertCurrent();
	} else if (starting) {
		if (controlGroup) assertOutsideService(controlGroup);
	} else if (!params.allowStopped || !["inactive", "failed"].includes(properties.activestate ?? "") || !/^(?:0|)$/.test(properties.job ?? "missing")) throw new Error("The immutable Gateway is neither running nor fully stopped.");
	else if (controlGroup && !cgroupEmpty(controlGroup)) throw new Error("The stopped immutable Gateway still has processes in its cgroup.");
	const phase = starting ? "starting" : pid === null ? "stopped" : "running";
	const running = phase === "running";
	const definitionDigest = await fingerprintGatewayServiceDefinition({
		...command,
		definitionPaths: [...command.definitionPaths ?? [], path.join(descriptor.root, "bin", "openclaw-gateway")]
	});
	assertCurrent();
	const identity = await captureSystemdServiceIdentity({
		env: {},
		target,
		managerUid: 0,
		rootServiceAccount: descriptor.service.account
	});
	assertCurrent();
	const observation = {
		phase,
		definitionDigest,
		pid,
		processStartTicks: observedProcess?.processStartTicks ?? null,
		generationPath: observedProcess?.generationPath ?? null,
		runtimePath: descriptor.runtime.path,
		controlGroup,
		identity,
		state: {
			installed: true,
			loadState: { status: "loaded" },
			running,
			command,
			env: {
				...command.environment,
				OPENCLAW_SYSTEMD_UNIT: descriptor.service.unit
			},
			runtime: {
				status: phase,
				state: properties.activestate,
				subState: properties.substate,
				...pid === null ? {} : { pid },
				systemd: {
					scope: "system",
					unit: descriptor.service.unit,
					managerUid: 0,
					controlGroup,
					killMode: properties.killmode,
					.../^\d+$/u.test(properties.taskscurrent ?? "") ? { tasksCurrent: Number(properties.taskscurrent) } : {}
				}
			}
		}
	};
	if (running) assertImmutableServiceProcessCurrent(observation);
	return observation;
}
async function controlImmutableService(params, action) {
	const { descriptor, expected } = params;
	if (descriptor.version !== 2 || descriptor.activationEnabled !== true) throw new Error("Immutable service activation requires explicitly enabled adoption.");
	await withGatewayServiceOperationLock(expected.state.env, async (assertNative) => {
		await withGatewayServiceUpdateAuthority(() => {
			params.assertCurrent();
			assertNative();
		}, async (assertCurrent) => {
			const beforeMutation = async () => {
				const current = await inspectImmutableActivationService({
					descriptor,
					generationPath: expected.generationPath ?? await fs$1.realpath(path.join(descriptor.root, "current")),
					allowStopped: action === "start",
					assertCurrent
				});
				assertCurrent();
				if (current.definitionDigest !== expected.definitionDigest || current.pid !== expected.pid || current.processStartTicks !== expected.processStartTicks) throw new Error("The immutable service changed before the native operation.");
			};
			const control = action === "start" ? startSystemdService : stopSystemdService;
			if (expected.phase !== (action === "start" ? "stopped" : "running")) throw new Error("Immutable start requires a stopped service; stop requires the observed process.");
			let dispatchRefusal;
			try {
				await control({
					stdout: params.stdout,
					env: expected.state.env,
					systemdIdentity: expected.identity,
					beforeMutation,
					assertCurrent,
					prepareEffect: params.prepareEffect,
					beforeEffect: () => {
						try {
							assertCurrent();
							params.beforeEffect?.();
							if (expected.pid === null && expected.controlGroup) assertImmutableServiceStoppedCurrent(expected);
							if (expected.pid !== null) {
								assertOutsideService(expected.controlGroup);
								assertImmutableServiceProcessCurrent(expected);
							}
						} catch (error) {
							dispatchRefusal = { error };
							throw error;
						}
					}
				});
			} catch (error) {
				if (action !== "stop" || dispatchRefusal?.error !== error) throw error;
				const current = await inspectImmutableActivationService({
					descriptor,
					generationPath: descriptor.current.path,
					allowStopped: true,
					allowStarting: true,
					assertCurrent
				});
				assertCurrent();
				if (current.phase !== "stopped" || current.definitionDigest !== expected.definitionDigest) throw error;
				assertImmutableServiceStoppedCurrent(expected);
				params.beforeEffect?.();
				return;
			}
			assertCurrent();
			if (action === "stop") {
				const deadline = performance.now() + (params.timeoutMs ?? 36e4);
				while (true) {
					const result = await execSystemctl([
						"--system",
						"show",
						descriptor.service.unit,
						"--property=Id,ActiveState,MainPID,Job"
					], void 0, 5e3);
					assertCurrent();
					const current = parseKeyValueOutput(result.stdout, "=");
					const empty = cgroupEmpty(expected.controlGroup);
					assertCurrent();
					if (result.code === 0 && current.id === descriptor.service.unit && ["inactive", "failed"].includes(current.activestate ?? "") && current.mainpid === "0" && /^(?:0|)$/.test(current.job ?? "missing") && empty && String(getProcessStartTime(expected.pid)) !== expected.processStartTicks) break;
					if (performance.now() >= deadline) throw new Error("The immutable Gateway did not fully stop; recovery remains pending.");
					await setTimeout(100);
					assertCurrent();
				}
			}
		});
	});
}
async function stopImmutableService(params) {
	await controlImmutableService(params, "stop");
}
async function startImmutableService(params) {
	await controlImmutableService(params, "start");
}
//#endregion
export { stopImmutableService as a, startImmutableService as i, assertImmutableServiceStoppedCurrent as n, verifyImmutableService as o, inspectImmutableActivationService as r, assertImmutableServiceProcessCurrent as t };

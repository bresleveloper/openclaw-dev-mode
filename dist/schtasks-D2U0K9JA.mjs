import { i as WINDOWS_TASK_SUPERVISOR_FLAG, l as readWindowsTaskSupervisorRestartExitCode } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { b as uniqueValues, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { f as resolveGatewayServiceDescription, s as NODE_SERVICE_KIND } from "./constants-CJCmIHb-.mjs";
import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { s as readWindowsProcessStartTimeSync } from "./pid-alive-CXdZEzr_.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { b as tryAcquireGatewayLifecycleCleanupCoordinator } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-B2RAsQsF.mjs";
import { i as readWindowsProcessArgsSync, o as readGatewayOwnerLease, t as readWindowsListeningPidsOnPortSync } from "./windows-port-pids-Bid_Huck.mjs";
import { i as parseProcCmdline, t as isGatewayArgv } from "./gateway-process-argv-BVJwTten.mjs";
import { a as spawnPsSync, n as findGatewayPidsOnPortSync } from "./restart-stale-pids-DjtzhbID.mjs";
import { a as getWindowsSystem32ExePath, r as getWindowsPowerShellExePath, t as getWindowsCmdExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { i as spawnWithFallback } from "./spawn-utils-BqNqLiIK.mjs";
import { c as withGatewayServiceInstallationRecovery, i as assertGatewayServiceUpdateCurrent, n as GatewayServiceAuthorityError, o as isUpdateOwnedGatewayServiceCommand } from "./service-update-authority-DujRnzx9.mjs";
import { f as preserveServicePolicyXml } from "./launchd-service-files-Cv2FPjBf.mjs";
import { r as writeFormattedLines, t as formatLine } from "./output-EUQq_O0z.mjs";
import { t as parseCmdScriptCommandLine } from "./cmd-argv-Cqm1e4_m.mjs";
import { n as publishServiceFile, r as readServiceFileState } from "./service-stage-CuqWOVHS.mjs";
import { _ as probeScheduledTaskState, a as quoteSchtasksArg, c as resolveStartupEntryPaths, d as resolveTaskScriptPath, f as resolveTaskUser, g as probeScheduledTaskExists, h as writeTaskXmlTempFile, i as buildTaskScript, l as resolveTaskLauncherScriptPath, m as shouldUseHiddenWindowsTaskLauncher, n as buildScheduledTaskXml, o as readScheduledTaskCommand, p as shouldFallbackToStartupEntry, r as buildStartupLauncherScript, s as resolveStartupEntryPath, t as buildHiddenLauncherScript, u as resolveTaskName, y as encodeWindowsLauncherScript } from "./schtasks-layout-ZxN1sGLi.mjs";
import { t as execSchtasks } from "./schtasks-exec-AWBr696q.mjs";
import { n as mergeGatewayServiceEnv, t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-nAcoRKGt.mjs";
import { n as inspectPortUsage } from "./ports-inspect-DXXAw_y-.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-BuDPZetd.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-De6Bb79N.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { hostname } from "node:os";
//#region src/daemon/schtasks-process.ts
const WINDOWS_FORCED_PROCESS_EXIT_TIMEOUT_MS = 15e3;
function resolveScheduledTaskCommandPort(env, command) {
	return parseTcpPortFromArgs(command?.programArguments) ?? parseTcpPort(command?.environment?.OPENCLAW_GATEWAY_PORT) ?? parseTcpPort(env.OPENCLAW_GATEWAY_PORT);
}
function isNodeHostArgv(programArguments) {
	const normalized = programArguments.map((arg) => normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/")));
	return normalized.some((arg, index) => arg === "node" && normalized[index + 1] === "run");
}
function normalizeProgramArguments(programArguments) {
	return programArguments.map((arg) => normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/")));
}
function matchesInstalledProgramArguments(actualArguments, installedArguments) {
	const actual = normalizeProgramArguments(actualArguments);
	const installed = normalizeProgramArguments(installedArguments);
	return actual.length === installed.length && actual.every((arg, index) => arg === installed[index]);
}
function getSnapshotProcessId(entry) {
	const pid = entry.ProcessId;
	return typeof pid === "number" && Number.isFinite(pid) && pid > 0 ? pid : null;
}
function findInstalledProcessPid(entries, port, installedArguments, matchesProcess, comparableArguments = (argv) => argv) {
	for (const entry of entries) {
		if (!normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "")) continue;
		const argv = parseCmdScriptCommandLine(entry.CommandLine ?? "");
		if (!matchesProcess(argv) || parseTcpPortFromArgs(argv) !== port || !matchesInstalledProgramArguments(comparableArguments(argv), installedArguments)) continue;
		const pid = getSnapshotProcessId(entry);
		if (pid) return pid;
	}
	return null;
}
function matchesInstalledGatewayChildArguments(actualArguments, installedArguments) {
	return readWindowsTaskSupervisorRestartExitCode(actualArguments) !== void 0 && matchesInstalledProgramArguments(actualArguments.slice(0, -1), installedArguments);
}
/** Finds the current supervised child or a legacy directly launched Gateway. */
function findInstalledGatewayChildPid(entries, port, installedArguments) {
	const supervisedPid = findInstalledProcessPid(entries, port, installedArguments, (argv) => matchesInstalledGatewayChildArguments(argv, installedArguments), (argv) => argv.slice(0, -1));
	if (supervisedPid) return supervisedPid;
	return findInstalledProcessPid(entries, port, installedArguments, () => true);
}
async function resolveScheduledTaskProcess(env, matchesProcess) {
	const command = await readScheduledTaskCommand(env).catch(() => null);
	const installedArguments = command?.programArguments;
	if (!installedArguments?.length) return null;
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port) return null;
	const snapshot = readWindowsProcessSnapshot();
	if (!snapshot) return null;
	const pid = findInstalledProcessPid(snapshot, port, installedArguments, matchesProcess);
	return pid ? {
		pid,
		port
	} : null;
}
async function resolveScheduledTaskNodeHostProcess(env) {
	return resolveScheduledTaskProcess(env, isNodeHostArgv);
}
function shouldManageGatewayListenerPort(env) {
	return normalizeLowercaseStringOrEmpty(env.OPENCLAW_SERVICE_KIND) !== NODE_SERVICE_KIND;
}
async function resolveScheduledTaskGatewayContext(env) {
	const command = await readScheduledTaskCommand(env).catch(() => null);
	return {
		port: resolveScheduledTaskCommandPort(env, command),
		probeHosts: await resolveGatewayServiceProbeHosts({
			env,
			command
		})
	};
}
function resolveGatewayListenerPids(listeners) {
	return Array.from(new Set(listeners.filter((listener) => typeof listener.pid === "number" && listener.commandLine && isGatewayArgv(parseCmdScriptCommandLine(listener.commandLine), { allowGatewayBinary: true })).map((listener) => listener.pid)));
}
async function resolveScheduledTaskOwnedGatewayPids(env, context, installedCommand) {
	return (await resolveScheduledTaskGatewayOwnership(env, context, installedCommand))?.pids ?? [];
}
async function resolveScheduledTaskGatewayOwnership(env, context, installedCommand) {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const port = context ? context.port : resolveScheduledTaskCommandPort(env, command);
	if (!port) return null;
	const ownerEnv = mergeGatewayServiceEnv(env, command);
	const owner = readGatewayOwnerLease({ env: ownerEnv });
	const taskName = resolveTaskName(env);
	const isTaskSupervisor = (supervisor) => supervisor?.kind === "schtasks" && supervisor.name?.toLowerCase() === taskName.toLowerCase();
	const hasCurrentProcessIdentity = (candidate) => candidate.state === "live" || candidate.state === "unknown" && candidate.host === hostname() && candidate.startedAt !== null && readWindowsProcessStartTimeSync(candidate.pid, 5e3, ownerEnv) === candidate.startedAt;
	const pids = owner ? owner.port === port && hasCurrentProcessIdentity(owner) && isTaskSupervisor(owner.supervisor) ? [owner.pid] : [] : await resolveLegacyScheduledTaskOwnedGatewayPids(env, context, command);
	let ownerWasValidatedForTermination = false;
	return {
		pids,
		acquireTerminationExclusion() {
			if (owner?.port === port && owner.state !== "dead" && owner.supervisor && !isTaskSupervisor(owner.supervisor)) {
				const supervisor = owner.supervisor;
				const label = supervisor.kind === "external" ? "external supervisor" : `${supervisor.kind} ${supervisor.name ?? "(name unavailable)"}`;
				throw new Error(`Gateway pid ${owner.pid} on port ${port} belongs to ${label}, not Scheduled Task ${taskName}. Run that supervisor's stop or restart command; the Gateway was left running.`);
			}
			if (pids.length > 0) return null;
			if (owner) return null;
			const exclusion = tryAcquireGatewayLifecycleCleanupCoordinator({ databasePath: resolveOpenClawStateSqlitePath(ownerEnv) });
			if (!exclusion) throw new Error("Gateway lifecycle ownership is held without a published identity; leave it running and retry after startup finishes.");
			return exclusion;
		},
		assertOwnerCurrent(pid) {
			const current = readGatewayOwnerLease({ env: ownerEnv });
			if (!owner && !current) return;
			if (owner && !current && ownerWasValidatedForTermination && owner.host === hostname() && owner.startedAt !== null && readWindowsProcessStartTimeSync(pid, 5e3, ownerEnv) === owner.startedAt) return;
			if (!owner || !current || current.owner !== owner.owner || current.pid !== pid || current.port !== port || current.host !== owner.host || current.startedAt !== owner.startedAt || !hasCurrentProcessIdentity(current) || !isTaskSupervisor(current.supervisor)) throw new Error(`Gateway owner changed before terminating process ${pid}`);
			ownerWasValidatedForTermination = true;
		}
	};
}
async function resolveLegacyScheduledTaskOwnedGatewayPids(env, context, installedCommand) {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const installedArguments = command?.programArguments;
	if (!installedArguments?.length) return [];
	const port = context ? context.port : resolveScheduledTaskCommandPort(env, command);
	if (!port) return [];
	const snapshot = readWindowsProcessSnapshot();
	if (process.platform === "win32") {
		if (snapshot) {
			const gatewayPid = findInstalledGatewayChildPid(snapshot, port, installedArguments);
			if (gatewayPid) return [gatewayPid];
			const supervisorPid = findInstalledProcessPid(snapshot, port, [...installedArguments, WINDOWS_TASK_SUPERVISOR_FLAG], () => true);
			if (supervisorPid) return [supervisorPid];
			return [];
		}
		const probeHosts = context?.probeHosts ?? await resolveGatewayServiceProbeHosts({
			env,
			command
		});
		const diagnostics = await inspectPortUsage(port, { probeHosts }).catch(() => null);
		if (diagnostics?.status !== "busy") return [];
		const ownedPids = /* @__PURE__ */ new Set();
		const supervisorArguments = [...installedArguments, WINDOWS_TASK_SUPERVISOR_FLAG];
		for (const listener of diagnostics.listeners) {
			if (typeof listener.pid !== "number") continue;
			const argv = listener.commandLine ? parseCmdScriptCommandLine(listener.commandLine) : readWindowsProcessArgsSync(listener.pid);
			if (!argv || parseTcpPortFromArgs(argv) !== port) continue;
			if (matchesInstalledProgramArguments(argv, installedArguments) || matchesInstalledProgramArguments(argv, supervisorArguments) || matchesInstalledGatewayChildArguments(argv, installedArguments)) ownedPids.add(listener.pid);
		}
		return Array.from(ownedPids);
	}
	const ownedPids = /* @__PURE__ */ new Set();
	const probeHosts = context?.probeHosts ?? await resolveGatewayServiceProbeHosts({
		env,
		command
	});
	const diagnostics = await inspectPortUsage(port, { probeHosts }).catch(() => null);
	if (diagnostics?.status === "busy") for (const listener of diagnostics.listeners) {
		if (typeof listener.pid !== "number" || !listener.commandLine) continue;
		const argv = parseCmdScriptCommandLine(listener.commandLine);
		if (parseTcpPortFromArgs(argv) === port && matchesInstalledProgramArguments(argv, installedArguments)) ownedPids.add(listener.pid);
	}
	return Array.from(ownedPids);
}
/** Describe remaining listeners when ownership verification fails, for actionable errors. */
async function describeUnverifiedPortListeners(port, probeHosts) {
	const diagnostics = await inspectPortUsage(port, probeHosts ? { probeHosts } : void 0).catch(() => null);
	const listeners = diagnostics?.status === "busy" ? diagnostics.listeners : [];
	if (!listeners || listeners.length === 0) return "";
	const described = listeners.map((listener) => {
		const pid = typeof listener.pid === "number" ? listener.pid : null;
		const argv = listener.commandLine ? parseCmdScriptCommandLine(listener.commandLine) : null;
		const identity = argv ? isGatewayArgv(argv, { allowGatewayBinary: true }) ? "openclaw gateway" : "not an openclaw gateway" : "argv unavailable";
		const name = listener.command ?? "unknown";
		return pid ? `pid ${pid} (${name}, ${identity})` : `${name} (${identity})`;
	});
	const hint = listeners.map((listener) => listener.pid).filter((pid) => typeof pid === "number").length ? ` If one of these is this gateway, stop it with "Stop-Process -Id <pid> -Force" and retry.` : "";
	return ` Remaining listener(s): ${described.join(", ")}. If gateway.cmd redirects output, quote the entire redirection target, including environment variables.${hint}`;
}
async function resolveListenerBackedScheduledTaskRuntime(env) {
	if (!shouldManageGatewayListenerPort(env)) {
		const matched = await resolveScheduledTaskNodeHostProcess(env);
		return matched ? {
			status: "running",
			pid: matched.pid,
			detail: `Node host process detected for gateway port ${matched.port}.`
		} : null;
	}
	const command = await readScheduledTaskCommand(env).catch(() => null);
	const context = { port: resolveScheduledTaskCommandPort(env, command) };
	const pids = await resolveScheduledTaskOwnedGatewayPids(env, context, command);
	return pids.length > 0 ? {
		status: "running",
		pid: pids[0],
		detail: `Gateway process detected for gateway port ${context.port}.`
	} : null;
}
async function terminateScheduledTaskNodeHost(env, assertCurrent) {
	const matched = await resolveScheduledTaskNodeHostProcess(env);
	if (!matched) return [];
	await terminateGatewayProcessTree(matched.pid, 300, assertCurrent);
	return [matched.pid];
}
async function terminateScheduledTaskGatewayListeners(env, context, assertCurrent) {
	if (!shouldManageGatewayListenerPort(env)) return [];
	const resolvedContext = context ?? await resolveScheduledTaskGatewayContext(env);
	if (!resolvedContext.port) return [];
	const ownership = await resolveScheduledTaskGatewayOwnership(env, resolvedContext);
	if (!ownership) return [];
	const exclusion = ownership.acquireTerminationExclusion();
	try {
		for (const pid of ownership.pids) await terminateGatewayProcessTree(pid, 300, () => {
			assertCurrent?.();
			ownership.assertOwnerCurrent(pid);
		});
		return ownership.pids;
	} finally {
		exclusion?.release();
	}
}
function probeProcessState(pid) {
	if (process.platform === "win32") {
		const snapshot = readWindowsProcessSnapshot();
		if (snapshot) return snapshot.some((entry) => getSnapshotProcessId(entry) === pid) ? "alive" : "missing";
		return probeWindowsTasklistProcessState(pid);
	}
	try {
		process.kill(pid, 0);
		return "alive";
	} catch (err) {
		return err.code === "ESRCH" ? "missing" : "unknown";
	}
}
function probeWindowsTasklistProcessState(pid) {
	const tasklist = spawnSync(getWindowsSystem32ExePath("tasklist.exe"), [
		"/FI",
		`PID eq ${pid}`,
		"/FO",
		"CSV",
		"/NH"
	], {
		env: resolveServiceManagerEnv(),
		encoding: "utf8",
		timeout: 1500,
		windowsHide: true
	});
	if (tasklist.error || tasklist.status !== 0) return "unknown";
	return tasklist.stdout.split(/\r?\n/).some((line) => line.includes(`,"${pid}",`)) ? "alive" : "missing";
}
async function waitForProcessExit(pid, timeoutMs, probe = probeProcessState) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (probe(pid) === "missing") return true;
		await sleep(100);
	}
	return probe(pid) === "missing";
}
async function terminateGatewayProcessTree(pid, graceMs, assertCurrent) {
	assertGatewayServiceUpdateCurrent();
	assertCurrent?.();
	if (process.platform !== "win32") {
		killProcessTree(pid, { graceMs });
		return;
	}
	const taskkillPath = getWindowsSystem32ExePath("taskkill.exe");
	const graceful = spawnSync(taskkillPath, [
		"/T",
		"/PID",
		String(pid)
	], {
		env: resolveServiceManagerEnv(),
		stdio: "ignore",
		timeout: 5e3,
		windowsHide: true
	});
	if (await waitForProcessExit(pid, graceful.status === 0 && !graceful.error ? graceMs : 0, probeWindowsTasklistProcessState)) return;
	assertGatewayServiceUpdateCurrent();
	assertCurrent?.();
	const forced = spawnSync(taskkillPath, [
		"/F",
		"/T",
		"/PID",
		String(pid)
	], {
		env: resolveServiceManagerEnv(),
		stdio: "ignore",
		timeout: 5e3,
		windowsHide: true
	});
	if (forced.error || forced.status !== 0) {
		if (probeProcessState(pid) === "missing") return;
		throw new Error(`taskkill could not terminate gateway process ${pid}`);
	}
	if (!await waitForProcessExit(pid, WINDOWS_FORCED_PROCESS_EXIT_TIMEOUT_MS, probeWindowsTasklistProcessState) && probeWindowsTasklistProcessState(pid) === "alive") throw new Error(`gateway process ${pid} is still running after taskkill`);
}
async function waitForGatewayPortRelease(port, timeoutMs = 5e3, options) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if ((await inspectPortUsage(port, options?.probeHosts ? { probeHosts: options.probeHosts } : void 0).catch(() => null))?.status === "free") return true;
		await sleep(250);
	}
	return false;
}
function readWindowsProcessSnapshot() {
	if (process.platform !== "win32") return null;
	const processSnapshot = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		"Get-CimInstance Win32_Process | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress"
	], {
		env: resolveServiceManagerEnv(),
		encoding: "utf8",
		timeout: 5e3,
		windowsHide: true
	});
	if (processSnapshot.error || processSnapshot.status !== 0) return null;
	let parsedSnapshot;
	try {
		parsedSnapshot = JSON.parse(processSnapshot.stdout.trim() || "[]");
	} catch {
		return null;
	}
	const entries = (Array.isArray(parsedSnapshot) ? parsedSnapshot : [parsedSnapshot]).filter((entry) => typeof entry === "object" && entry !== null);
	return entries.length > 0 ? entries : null;
}
async function assertReplacementPortAvailableForTakeover(params) {
	if (!shouldManageGatewayListenerPort(params.env)) return;
	const port = resolveScheduledTaskCommandPort(params.env, {
		programArguments: params.programArguments,
		...params.environment ? { environment: params.environment } : {}
	});
	if (!port) throw new Error("Could not verify the replacement Windows Scheduled Task port.");
	const probeHosts = await resolveGatewayServiceProbeHosts({
		env: params.env,
		command: {
			programArguments: params.programArguments,
			...params.environment ? { environment: Object.fromEntries(Object.entries(params.environment).filter((entry) => typeof entry[1] === "string")) } : {}
		}
	});
	const diagnostics = await inspectPortUsage(port, { probeHosts }).catch(() => null);
	if (!diagnostics) throw new Error(`Could not inspect replacement gateway port ${port}.`);
	if (diagnostics.status === "free") return;
	if (diagnostics.status !== "busy") throw new Error(`Could not verify replacement gateway port ${port}.`);
	const allowedPids = /* @__PURE__ */ new Set();
	if (params.fallbackPid) allowedPids.add(params.fallbackPid);
	if (process.platform === "win32") {
		const snapshot = readWindowsProcessSnapshot();
		if (snapshot) {
			const replacementPid = findInstalledProcessPid(snapshot, port, params.programArguments, () => true);
			if (replacementPid) allowedPids.add(replacementPid);
		}
	}
	const listenerPids = diagnostics.listeners.map((listener) => listener.pid);
	if (listenerPids.length > 0 && listenerPids.every((pid) => typeof pid === "number" && pid > 0 && allowedPids.has(pid))) return;
	throw new Error(`replacement gateway port ${port} is occupied by an unverified process`);
}
//#endregion
//#region src/infra/gateway-processes.ts
const GATEWAY_PS_PROBE_TIMEOUT_MS = 1e3;
/** Read command argv for a PID using the current platform's process APIs. */
function readGatewayProcessArgsSync(pid) {
	if (process.platform === "linux") try {
		return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
	} catch {
		return null;
	}
	if (process.platform === "darwin") {
		const ps = spawnPsSync([
			"-o",
			"command=",
			"-p",
			String(pid)
		], GATEWAY_PS_PROBE_TIMEOUT_MS);
		if (ps.error || ps.status !== 0) return null;
		const command = ps.stdout.trim();
		return command ? command.split(/\s+/) : null;
	}
	if (process.platform === "win32") return readWindowsProcessArgsSync(pid);
	return null;
}
/** Signal a PID only after its argv matches a gateway process. */
function signalVerifiedGatewayPidSync(pid, signal) {
	const args = readGatewayProcessArgsSync(pid);
	if (!args || !isGatewayArgv(args, { allowGatewayBinary: true })) throw new Error(`refusing to signal non-gateway process pid ${pid}`);
	try {
		process.kill(pid, signal);
	} catch (err) {
		if (err.code !== "ESRCH") throw err;
	}
}
/** Find listener PIDs on `port` and keep only verified gateway processes. */
function findVerifiedGatewayListenerPidsOnPortSync(port) {
	const rawPids = process.platform === "win32" ? readWindowsListeningPidsOnPortSync(port) : findGatewayPidsOnPortSync(port);
	return uniqueValues(rawPids).filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid).filter((pid) => {
		const args = readGatewayProcessArgsSync(pid);
		return args != null && isGatewayArgv(args, { allowGatewayBinary: true });
	});
}
/** Format gateway PIDs for human-facing diagnostics. */
function formatGatewayPidList(pids) {
	return pids.join(", ");
}
const SCHEDULED_TASK_FALLBACK_TIMEOUT_MS = 15e3;
/** Read policy independently of runtime state; unavailable policy is not disabled. */
async function isScheduledTaskEnabled(args) {
	const observed = probeScheduledTaskState(resolveTaskName(args.env ?? process.env), args.timeoutMs);
	if (observed.status !== "found" || typeof observed.enabled !== "boolean") throw new Error("Scheduled Task enable policy could not be inspected.");
	return observed.enabled;
}
async function assertSchtasksAvailable() {
	const res = await execSchtasks(["/Query"]);
	if (res.code !== 0) {
		const detail = res.stderr || res.stdout;
		throw new Error(`schtasks unavailable: ${detail || "unknown error"}`.trim());
	}
}
async function isStartupEntryInstalled(env) {
	for (const startupEntryPath of resolveStartupEntryPaths(env)) try {
		await fs$1.access(startupEntryPath);
		return true;
	} catch {}
	return false;
}
async function removeStartupEntries(env, stdout, assertCurrent) {
	for (const startupEntryPath of resolveStartupEntryPaths(env)) {
		assertCurrent?.();
		try {
			assertGatewayServiceUpdateCurrent();
			await fs$1.unlink(startupEntryPath);
			stdout.write(`${formatLine("Removed Windows login item", startupEntryPath)}\n`);
		} catch (error) {
			if (error.code !== "ENOENT") throw createStartupEntryRemovalError(error);
		}
	}
}
function createStartupEntryRemovalError(error) {
	const code = error.code;
	return new Error(`Windows login item removal failed${code ? ` (${code})` : ""}. Check permissions and retry.`, { cause: code ? { code } : void 0 });
}
async function waitForScheduledTaskRunningEvidence(env) {
	const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
	while (true) {
		const probe = probeScheduledTaskState(resolveTaskName(env));
		if (probe.status === "found" && probe.state === 4) return true;
		if (Date.now() >= deadline) return false;
		await sleep(250);
	}
}
async function isRegisteredScheduledTask(env) {
	return (await execSchtasks([
		"/Query",
		"/TN",
		resolveTaskName(env)
	]).catch(() => ({
		code: 1,
		stdout: "",
		stderr: ""
	}))).code === 0;
}
async function launchFallbackTaskScript(env, installedCommand, assertCurrent) {
	if (isUpdateOwnedGatewayServiceCommand()) throw new Error("UPDATE_NATIVE_AUTHORITY: update-owned native commands require Task Scheduler; standalone startup fallback is unsupported.");
	const scriptPath = resolveTaskScriptPath(env);
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env) : installedCommand;
	if (command?.programArguments.length) {
		const programArguments = command.environment?.OPENCLAW_SERVICE_KIND === "gateway" ? [...command.programArguments, WINDOWS_TASK_SUPERVISOR_FLAG] : command.programArguments;
		const { child } = await spawnWithFallback({
			assertCurrent,
			argv: programArguments,
			options: {
				cwd: command.workingDirectory || void 0,
				detached: true,
				env: mergeProcessEnv([process.env, command.environment]),
				stdio: "ignore",
				windowsHide: true
			}
		});
		child.unref();
		return;
	}
	await (await fs$1.open(scriptPath, "r")).close();
	const scriptProbe = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-NonInteractive",
		"-EncodedCommand",
		Buffer.from("$ErrorActionPreference='Stop'; [System.IO.File]::OpenRead($env:OPENCLAW_TASK_SCRIPT).Dispose()", "utf16le").toString("base64")
	], {
		env: {
			...resolveServiceManagerEnv(),
			OPENCLAW_TASK_SCRIPT: scriptPath
		},
		stdio: "ignore",
		windowsHide: true
	});
	if (scriptProbe.error) throw scriptProbe.error;
	if (scriptProbe.status !== 0) throw Object.assign(/* @__PURE__ */ new Error("Windows login item script is not readable"), { code: "EACCES" });
	const { child } = await spawnWithFallback({
		assertCurrent,
		argv: [
			getWindowsCmdExePath(),
			"/d",
			"/s",
			"/v:off",
			"/c",
			"\"\"%OPENCLAW_TASK_SCRIPT%\"\""
		],
		options: {
			detached: true,
			env: {
				...process.env,
				OPENCLAW_TASK_SCRIPT: scriptPath
			},
			stdio: "ignore",
			windowsHide: true,
			windowsVerbatimArguments: true
		}
	});
	child.unref();
}
async function resolveFallbackRuntime(env, installedCommand, mode = "observe") {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port) return {
		status: "unknown",
		detail: shouldManageGatewayListenerPort(env) ? "Startup-folder login item installed; gateway port unknown." : "Startup-folder login item installed; node gateway port unknown."
	};
	const installedArguments = command?.programArguments;
	if (!shouldManageGatewayListenerPort(env)) {
		const snapshot = readWindowsProcessSnapshot();
		if (!snapshot) return {
			status: "unknown",
			detail: `Startup-folder login item installed; could not inspect node host process for gateway port ${port}.`
		};
		const pid = installedArguments?.length ? findInstalledProcessPid(snapshot, port, installedArguments, isNodeHostArgv) : null;
		return pid ? {
			status: "running",
			pid,
			detail: `Startup-folder login item installed; node host process detected for gateway port ${port}.`
		} : {
			status: "stopped",
			detail: `Startup-folder login item installed; no node host process detected for gateway port ${port}.`
		};
	}
	const shouldInspectProcess = process.platform === "win32" && Boolean(installedArguments?.length);
	const snapshot = shouldInspectProcess ? readWindowsProcessSnapshot() : null;
	const processPid = snapshot && installedArguments ? findInstalledGatewayChildPid(snapshot, port, installedArguments) : null;
	if (processPid) return {
		status: "running",
		pid: processPid,
		detail: `Startup-folder login item installed; matching gateway process detected for port ${port}.`
	};
	const requireCommandOwnership = mode === "control" && process.platform === "win32";
	if (requireCommandOwnership) {
		if (!installedArguments?.length) return {
			status: "unknown",
			detail: `Startup-folder login item installed; persisted command unavailable for gateway port ${port}.`
		};
		if (!snapshot) return {
			status: "unknown",
			detail: `Startup-folder login item installed; could not verify the installed process for gateway port ${port}.`
		};
	}
	const probeHosts = await resolveGatewayServiceProbeHosts({
		env,
		command
	});
	const diagnostics = await inspectPortUsage(port, { probeHosts }).catch(() => null);
	if (!diagnostics) return {
		status: "unknown",
		detail: `Startup-folder login item installed; could not inspect port ${port}.`
	};
	if (diagnostics.status !== "busy") {
		const status = diagnostics.status === "free" && !(shouldInspectProcess && !snapshot) ? "stopped" : "unknown";
		return {
			status,
			detail: status === "unknown" && diagnostics.status === "free" ? `Startup-folder login item installed; no listener detected on port ${port}, but process inspection was unavailable.` : `Startup-folder login item installed; no gateway listener detected on port ${port}.`
		};
	}
	const matchedGatewayPids = resolveGatewayListenerPids(diagnostics.listeners);
	const scopedListenerPids = new Set(diagnostics.listeners.map((listener) => listener.pid));
	const verifiedGatewayPids = findVerifiedGatewayListenerPidsOnPortSync(port).filter((pid) => scopedListenerPids.has(pid));
	const ownedGatewayPids = matchedGatewayPids.length > 0 ? matchedGatewayPids : verifiedGatewayPids;
	if (ownedGatewayPids.length > 0) return requireCommandOwnership ? {
		status: "unknown",
		detail: `Startup-folder login item installed; gateway listener on port ${port} does not match the persisted command.`
	} : {
		status: "running",
		pid: ownedGatewayPids[0],
		detail: `Startup-folder login item installed; verified gateway listener detected on port ${port}.`
	};
	return {
		status: "unknown",
		detail: `Startup-folder login item installed; port ${port} is busy, but the listener is not a verified gateway process.`
	};
}
function isScheduledTaskDefinitelyNotRunning(taskName) {
	const probe = probeScheduledTaskState(taskName);
	if (probe.status !== "found") return false;
	return probe.state === 1 || probe.state === 3;
}
async function readWindowsStartupFallbackRuntimeForUpdate(env) {
	if (!await isStartupEntryInstalled(env)) return null;
	const taskExists = probeScheduledTaskExists(resolveTaskName(env));
	if (taskExists === null) throw new Error("Could not verify whether the Windows Scheduled Task exists.");
	return taskExists ? null : resolveFallbackRuntime(env, void 0, "control");
}
const FALLBACK_TAKEOVER_REPROBE_TIMEOUT_MS = 5e3;
const FALLBACK_TAKEOVER_REPROBE_INTERVAL_MS = 250;
async function waitForFallbackTakeoverRuntime(env, installedCommand, initialRuntime, previousRuntime) {
	let runtime = initialRuntime;
	const deadline = Date.now() + FALLBACK_TAKEOVER_REPROBE_TIMEOUT_MS;
	while (runtime.status !== "running" && Date.now() < deadline) {
		await sleep(FALLBACK_TAKEOVER_REPROBE_INTERVAL_MS);
		runtime = await resolveFallbackRuntime(env, installedCommand, "control").catch((err) => ({
			status: "unknown",
			detail: `Could not re-inspect the existing Windows login item: ${String(err)}`
		}));
	}
	if (runtime.status === "stopped" && previousRuntime.status === "running") {
		const previousPid = previousRuntime.pid;
		if (!previousPid || probeProcessState(previousPid) !== "missing") return {
			status: "unknown",
			detail: "The previously running Windows login item has not exited cleanly."
		};
	}
	return runtime;
}
async function resolveControllableFallbackRuntime(env) {
	const runtime = await resolveFallbackRuntime(env, void 0, "control");
	if (runtime.status === "unknown") throw new Error(runtime.detail ?? "Could not verify Windows login item ownership.");
	return runtime;
}
async function stopStartupEntry(env, stdout, onMutation, assertCurrent) {
	const runtime = await resolveControllableFallbackRuntime(env);
	if (runtime.pid) await terminateGatewayProcessTree(runtime.pid, 300, assertCurrent);
	onMutation?.();
	stdout.write(`${formatLine("Stopped Windows login item", resolveTaskName(env))}\n`);
}
async function terminateInstalledStartupRuntime(env, assertCurrent) {
	if (!await isStartupEntryInstalled(env)) return;
	const runtime = await resolveControllableFallbackRuntime(env);
	if (runtime.pid) await terminateGatewayProcessTree(runtime.pid, 300, assertCurrent);
}
async function restartStartupEntry(env, stdout, onMutation, assertCurrent) {
	const runtime = await resolveControllableFallbackRuntime(env);
	if (runtime.pid) {
		await terminateGatewayProcessTree(runtime.pid, 300, assertCurrent);
		onMutation?.("stop");
	}
	await launchFallbackTaskScript(env, void 0, assertCurrent);
	onMutation?.("restart");
	stdout.write(`${formatLine("Restarted Windows login item", resolveTaskName(env))}\n`);
	return { outcome: "completed" };
}
async function startStartupEntry(env, stdout, onMutation, assertCurrent) {
	await launchFallbackTaskScript(env, void 0, assertCurrent);
	onMutation?.();
	stdout.write(`${formatLine("Started Windows login item", resolveTaskName(env))}\n`);
}
async function isScheduledTaskInstalled(args) {
	const effectiveEnv = args.env ?? process.env;
	return await isRegisteredScheduledTask(effectiveEnv) || await isStartupEntryInstalled(effectiveEnv);
}
async function readScheduledTaskRuntime(env = process.env, opts) {
	const probe = probeScheduledTaskState(resolveTaskName(env), opts?.timeoutMs);
	if (probe.status === "missing") return await isStartupEntryInstalled(env) ? resolveFallbackRuntime(env) : {
		status: "stopped",
		missingUnit: true
	};
	if (probe.status === "unknown") return {
		...createServiceRuntimeInspectionFailure(probe.detail, probe.timeoutMs),
		missingUnit: false
	};
	const status = probe.state === 4 ? "running" : probe.state === 1 || probe.state === 3 ? "stopped" : "unknown";
	const observedRuntime = await resolveListenerBackedScheduledTaskRuntime(env);
	return {
		...observedRuntime,
		status: status === "unknown" ? status : observedRuntime?.status ?? status,
		state: [
			"Unknown",
			"Disabled",
			"Queued",
			"Ready",
			"Running"
		][probe.state ?? 0],
		lastRunTime: probe.lastRunTime,
		lastRunResult: probe.lastRunResult
	};
}
//#endregion
//#region src/daemon/schtasks-update-recovery.ts
/** A failed native compensation, distinct from an untouched update refusal. */
var ScheduledTaskAutoStartRecoveryError = class extends AggregateError {
	#serviceEnv;
	constructor(errors, message, serviceEnv) {
		super(errors, message, { cause: errors.at(-1) });
		this.name = "ScheduledTaskAutoStartRecoveryError";
		this.#serviceEnv = { ...serviceEnv };
	}
	get serviceEnv() {
		return this.#serviceEnv;
	}
};
//#endregion
//#region src/daemon/schtasks-control.ts
function runtimeSignature(runtime) {
	return [
		runtime?.state,
		runtime?.lastRunTime,
		runtime?.lastRunResult,
		runtime?.detail
	].filter(Boolean).join("|");
}
async function shouldFallbackScheduledTaskLaunch(params) {
	const readLaunchObservation = async () => {
		const runtime = await readScheduledTaskRuntime(params.env).catch(() => null);
		if (runtime?.status === "running") return {
			state: "running",
			signature: runtimeSignature(runtime)
		};
		if (runtime?.status !== "stopped") return {
			state: "other",
			signature: runtimeSignature(runtime)
		};
		if (runtime.lastRunResult === "267011") return {
			state: "not-yet-run",
			signature: runtimeSignature(runtime)
		};
		return runtime.lastRunResult === "0" ? {
			state: "stopped-success",
			signature: runtimeSignature(runtime)
		} : {
			state: "other",
			signature: runtimeSignature(runtime)
		};
	};
	const hasLaunchEvidence = async () => {
		const command = await readScheduledTaskCommand(params.env).catch(() => null);
		const installedArguments = command?.programArguments;
		const taskPort = resolveScheduledTaskCommandPort(params.env, command);
		const manageGatewayPort = shouldManageGatewayListenerPort(params.env);
		if (manageGatewayPort && taskPort) {
			const probeHosts = await resolveGatewayServiceProbeHosts({
				env: params.env,
				command
			});
			if ((await resolveScheduledTaskOwnedGatewayPids(params.env, {
				port: taskPort,
				probeHosts
			}, command)).length > 0) return true;
		}
		const scriptPathNeedle = normalizeLowercaseStringOrEmpty(params.scriptPath.replaceAll("/", "\\"));
		if (!scriptPathNeedle) return false;
		const entries = readWindowsProcessSnapshot();
		if (!entries) return false;
		if (entries.some((entry) => normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "").replaceAll("/", "\\").includes(scriptPathNeedle))) return true;
		if (!taskPort) return false;
		if (!installedArguments?.length) return false;
		return findInstalledProcessPid(entries, taskPort, installedArguments, manageGatewayPort ? (argv) => isGatewayArgv(argv, { allowGatewayBinary: true }) : isNodeHostArgv) != null;
	};
	let previous = await readLaunchObservation();
	if (previous.state !== "not-yet-run" && previous.state !== "stopped-success") return false;
	const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
	while (Date.now() < deadline) {
		await sleep(250);
		const current = await readLaunchObservation();
		if (current.state !== "not-yet-run" && current.state !== "stopped-success") return false;
		if (current.state === "not-yet-run" && previous.state === "not-yet-run" && current.signature !== previous.signature) return false;
		if (previous.state === "stopped-success" && current.state === "not-yet-run") return false;
		previous = current;
		if (await hasLaunchEvidence()) return false;
	}
	return true;
}
async function runScheduledTaskOrThrow(params) {
	params.assertCurrent?.();
	const run = await execSchtasks([
		"/Run",
		"/TN",
		params.taskName
	]);
	if (run.code !== 0) throw new Error(`schtasks run failed: ${run.stderr || run.stdout}`.trim());
	params.onMutation?.();
	if (!await shouldFallbackScheduledTaskLaunch({
		env: params.env,
		scriptPath: params.scriptPath
	})) return "scheduled-task";
	if (params.allowFallback !== false && !shouldManageGatewayListenerPort(params.env)) {
		await launchFallbackTaskScript(params.env, void 0, params.assertCurrent);
		return "direct-fallback";
	}
	throw new Error(`Scheduled Task ${params.taskName} did not start within ${SCHEDULED_TASK_FALLBACK_TIMEOUT_MS / 1e3}s after schtasks /Run; refusing a direct fallback because the queued task could still start.`);
}
function parseScheduledTaskXmlEnabled(output) {
	const normalized = output.replace(/^\uFEFF/u, "").replaceAll(String.fromCharCode(0), "");
	const settings = /<Settings(?:\s[^>]*)?>([\s\S]*?)<\/Settings>/iu.exec(normalized)?.[1];
	if (settings === void 0) return null;
	const enabled = /<Enabled>\s*(true|false)\s*<\/Enabled>/iu.exec(settings)?.[1];
	return enabled === void 0 ? true : enabled.toLowerCase() === "true";
}
function setScheduledTaskXmlEnabled(xml, enabled) {
	if (parseScheduledTaskXmlEnabled(xml) === null) throw new Error("Scheduled Task enabled state could not be inspected.");
	return xml.replace(/(<Settings(?:\s[^>]*)?>)([\s\S]*?)(<\/Settings>)/iu, (_match, open, body, close) => {
		const value = `<Enabled>${enabled}</Enabled>`;
		const field = /<Enabled>\s*(true|false)\s*<\/Enabled>/iu;
		return `${open}${field.test(body) ? body.replace(field, value) : `${value}${body}`}${close}`;
	});
}
async function readScheduledTaskDefinition(env) {
	const result = await execSchtasks([
		"/Query",
		"/TN",
		resolveTaskName(env),
		"/XML"
	]);
	const xml = result.stdout.replace(/^\uFEFF/u, "").replaceAll(String.fromCharCode(0), "");
	if (result.code !== 0 || !/<Task[\s>]/u.test(xml)) throw new Error("Scheduled Task definition could not be inspected.");
	return xml;
}
async function restoreScheduledTaskDefinition(params) {
	const current = await readScheduledTaskDefinition(params.env);
	const enabled = parseScheduledTaskXmlEnabled(current);
	if (enabled === null) throw new Error("Scheduled Task enabled state could not be preserved.");
	const temporary = await writeTaskXmlTempFile(setScheduledTaskXmlEnabled(params.xml, enabled));
	try {
		await params.beforeWrite();
		if (await readScheduledTaskDefinition(params.env) !== current) throw new Error("Scheduled Task changed before restoration.");
		params.assertCurrent();
		if ((await execSchtasks([
			"/Create",
			"/F",
			"/TN",
			resolveTaskName(params.env),
			"/XML",
			temporary
		])).code !== 0) throw new Error("Scheduled Task definition could not be restored.");
	} finally {
		await fs$1.rm(path.dirname(temporary), {
			recursive: true,
			force: true
		});
	}
}
async function changeScheduledTaskEnabledState(params) {
	const taskName = resolveTaskName(params.env);
	if (!params.enabled) {
		const query = await execSchtasks([
			"/Query",
			"/TN",
			taskName,
			"/XML"
		]);
		if (query.code !== 0) {
			if (probeScheduledTaskExists(taskName) === false) return false;
			const detail = (query.stderr || query.stdout).trim() || "unknown error";
			throw new Error(`schtasks XML query failed: ${detail}`);
		}
		const enabled = parseScheduledTaskXmlEnabled(query.stdout);
		if (enabled === null) throw new Error("schtasks XML query did not expose the task enabled state");
		if (!enabled) return false;
	}
	const action = params.enabled ? "/ENABLE" : "/DISABLE";
	await params.beforeMutation?.();
	params.assertCurrent?.();
	const result = await execSchtasks([
		"/Change",
		"/TN",
		taskName,
		action
	]);
	if (result.code !== 0) {
		const detail = (result.stderr || result.stdout).trim() || "unknown error";
		const changeError = /* @__PURE__ */ new Error(`schtasks ${params.enabled ? "enable" : "disable"} failed: ${detail}`);
		if (!params.enabled && params.restoreOnFailure !== false) try {
			await params.beforeMutation?.();
			params.assertCurrent?.();
			const restore = await execSchtasks([
				"/Change",
				"/TN",
				taskName,
				"/ENABLE"
			]);
			if (restore.code !== 0) {
				const restoreDetail = (restore.stderr || restore.stdout).trim() || "unknown error";
				throw new Error(`schtasks enable failed: ${restoreDetail}`);
			}
		} catch (restoreError) {
			throw new ScheduledTaskAutoStartRecoveryError([changeError, restoreError], `Scheduled Task disable failed and its enabled state could not be restored: ${changeError.message}; ${String(restoreError)}`, params.env);
		}
		throw changeError;
	}
	return true;
}
async function suspendScheduledTaskAutoStartForUpdate(env = process.env, options) {
	const assertCaller = options?.assertCurrent;
	return withGatewayServiceOperationLock(env, async (assertNative) => changeScheduledTaskEnabledState({
		env,
		enabled: false,
		...options,
		assertCurrent: () => {
			assertNative();
			assertCaller?.();
		}
	}));
}
async function resumeScheduledTaskAutoStartAfterUpdate(env = process.env, options) {
	const assertCaller = options?.assertCurrent;
	return withGatewayServiceOperationLock(env, async (assertNative) => changeScheduledTaskEnabledState({
		env,
		enabled: true,
		...options,
		assertCurrent: () => {
			assertNative();
			assertCaller?.();
		}
	}));
}
async function shouldControlStartupEntry(env) {
	try {
		await assertSchtasksAvailable();
	} catch (err) {
		if (!await isStartupEntryInstalled(env)) throw err;
		return true;
	}
	return !await isRegisteredScheduledTask(env) && await isStartupEntryInstalled(env);
}
async function stopScheduledTask({ stdout, env, onMutation, assertCurrent }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) {
		await stopStartupEntry(effectiveEnv, stdout, () => reportMutation("startup-entry-stop"), assertCurrent);
		return;
	}
	const taskName = resolveTaskName(effectiveEnv);
	assertCurrent?.();
	const res = await execSchtasks([
		"/End",
		"/TN",
		taskName
	]);
	if (res.code !== 0 && !isScheduledTaskDefinitelyNotRunning(taskName)) throw new Error(`schtasks end failed: ${res.stderr || res.stdout}`.trim());
	reportMutation("schtasks-stop");
	const manageGatewayPort = shouldManageGatewayListenerPort(effectiveEnv);
	const stopContext = manageGatewayPort ? await resolveScheduledTaskGatewayContext(effectiveEnv) : null;
	const stopPort = stopContext?.port ?? null;
	if (manageGatewayPort) await terminateScheduledTaskGatewayListeners(effectiveEnv, stopContext ?? void 0, assertCurrent);
	else await terminateScheduledTaskNodeHost(effectiveEnv, assertCurrent);
	await terminateInstalledStartupRuntime(effectiveEnv, assertCurrent);
	if (stopPort) {
		const probeHosts = stopContext?.probeHosts ?? [];
		if (!await waitForGatewayPortRelease(stopPort, 5e3, { probeHosts })) {
			const listenerDetails = await describeUnverifiedPortListeners(stopPort, probeHosts);
			throw new Error(`gateway port ${stopPort} is still busy after stop; remaining listener ownership could not be verified.${listenerDetails}`);
		}
	}
	stdout.write(`${formatLine("Stopped Scheduled Task", taskName)}\n`);
}
async function startScheduledTask({ stdout, env, onMutation, assertCurrent, preserveAutoStart }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) {
		if (preserveAutoStart) throw new Error("Captured Scheduled Task registration is unavailable; refusing login-item fallback.");
		await startStartupEntry(effectiveEnv, stdout, () => reportMutation("startup-entry-start"), assertCurrent);
		return;
	}
	const taskName = resolveTaskName(effectiveEnv);
	await runScheduledTaskOrThrow({
		taskName,
		assertCurrent,
		allowFallback: preserveAutoStart !== true,
		env: effectiveEnv,
		scriptPath: resolveTaskScriptPath(effectiveEnv),
		onMutation: () => reportMutation("schtasks-start")
	});
	stdout.write(`${formatLine("Started Scheduled Task", taskName)}\n`);
}
async function restartRegisteredScheduledTask(params) {
	const taskName = resolveTaskName(params.env);
	params.assertCurrent?.();
	if ((await execSchtasks([
		"/End",
		"/TN",
		taskName
	])).code === 0) params.onEndMutation?.();
	const manageGatewayPort = shouldManageGatewayListenerPort(params.env);
	const restartContext = manageGatewayPort ? await resolveScheduledTaskGatewayContext(params.env) : null;
	const restartPort = restartContext?.port ?? null;
	if (params.mode.kind === "standard") {
		if (manageGatewayPort) await terminateScheduledTaskGatewayListeners(params.env, restartContext ?? void 0, params.assertCurrent);
		else await terminateScheduledTaskNodeHost(params.env, params.assertCurrent);
		await terminateInstalledStartupRuntime(params.env, params.assertCurrent);
	} else {
		const replacementRuntime = await resolveFallbackRuntime(params.env, void 0, "control");
		if (replacementRuntime.status === "unknown") throw new Error(replacementRuntime.detail ?? "Could not verify the replacement Windows Scheduled Task process.");
		if (replacementRuntime.status === "running" && replacementRuntime.pid) await terminateGatewayProcessTree(replacementRuntime.pid, 300, params.assertCurrent);
	}
	if (restartPort) {
		const probeHosts = restartContext?.probeHosts ?? [];
		if (!await waitForGatewayPortRelease(restartPort, 5e3, { probeHosts })) {
			if (params.mode.kind === "fallback-takeover") throw new Error(`replacement gateway port ${restartPort} is occupied by an unverified process`);
			const listenerDetails = await describeUnverifiedPortListeners(restartPort, probeHosts);
			throw new Error(`gateway port ${restartPort} is still busy before restart; remaining listener ownership could not be verified.${listenerDetails}`);
		}
	}
	const activation = await runScheduledTaskOrThrow({
		taskName,
		assertCurrent: params.assertCurrent,
		env: params.env,
		scriptPath: resolveTaskScriptPath(params.env),
		...params.onRunMutation ? { onMutation: params.onRunMutation } : {}
	});
	const shouldRemoveStartup = activation === "scheduled-task" && !params.preserveDefinition && await isStartupEntryInstalled(params.env);
	if (activation === "scheduled-task" && (params.mode.kind === "fallback-takeover" || shouldRemoveStartup)) {
		const hasRunningEvidence = await waitForScheduledTaskRunningEvidence(params.env);
		if (params.mode.kind === "fallback-takeover" && !hasRunningEvidence) {
			params.assertCurrent?.();
			await execSchtasks([
				"/End",
				"/TN",
				taskName
			]);
			const failedRuntime = await resolveFallbackRuntime(params.env, void 0, "control").catch(() => null);
			if (failedRuntime?.status === "running" && failedRuntime.pid) await terminateGatewayProcessTree(failedRuntime.pid, 300, params.assertCurrent);
			throw new Error("Replacement Windows Scheduled Task did not produce running evidence.");
		}
		if (shouldRemoveStartup && hasRunningEvidence) await removeStartupEntries(params.env, params.stdout, params.assertCurrent);
	}
	params.stdout.write(`${formatLine("Restarted Scheduled Task", taskName)}\n`);
	return { outcome: "completed" };
}
async function restartScheduledTask({ preserveDefinition, stdout, env, onMutation, assertCurrent }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) return restartStartupEntry(effectiveEnv, stdout, (kind) => reportMutation(kind === "stop" ? "startup-entry-stop" : "startup-entry-restart"), assertCurrent);
	return restartRegisteredScheduledTask({
		preserveDefinition,
		assertCurrent,
		env: effectiveEnv,
		stdout,
		mode: { kind: "standard" },
		onEndMutation: () => reportMutation("schtasks-end"),
		onRunMutation: () => reportMutation("schtasks-restart")
	});
}
//#endregion
//#region src/daemon/schtasks-install-files.ts
async function publishTaskFile(file) {
	await publishServiceFile({
		filePath: file.path,
		contents: file.contents,
		mode: 384
	});
}
async function backupScheduledTaskDefinition(env, scriptPath) {
	const taskName = resolveTaskName(env);
	const readXml = async () => {
		try {
			return await readScheduledTaskDefinition(env);
		} catch (error) {
			assertGatewayServiceUpdateCurrent();
			if (probeScheduledTaskExists(taskName) === false) return null;
			throw new Error(`Could not back up Scheduled Task ${taskName} before replacement.`, { cause: error });
		}
	};
	const original = await readXml();
	const originalRuntime = original === null ? null : probeScheduledTaskState(taskName);
	const backupPath = `${scriptPath}.task.xml.bak`;
	if (original !== null) {
		assertGatewayServiceUpdateCurrent();
		await fs$1.mkdir(path.dirname(backupPath), { recursive: true });
		await publishTaskFile({
			path: backupPath,
			contents: Buffer.concat([Buffer.from([255, 254]), Buffer.from(original, "utf16le")])
		});
	}
	let receipt = original;
	let changed = false;
	let unsettled = false;
	const withoutEnabled = (xml) => xml === null ? null : setScheduledTaskXmlEnabled(xml, false);
	const assertReceipt = async (disabled = false) => {
		const current = unsettled ? null : await readXml();
		if (unsettled || (disabled ? withoutEnabled(current) !== withoutEnabled(receipt) : current !== receipt)) throw new Error(`Scheduled Task ${taskName} registration ownership could not be verified.`);
	};
	return {
		registered: original !== null,
		retainRecovery: () => {
			unsettled = true;
		},
		recordRegistration: async () => {
			changed = true;
			unsettled = true;
			receipt = await readXml();
			if (receipt === null) throw new Error(`Scheduled Task ${taskName} registration disappeared after replacement.`);
			unsettled = false;
		},
		restore: async (files, activated) => {
			await files.assertPublished();
			await assertReceipt();
			if (changed || activated) {
				if ((await execSchtasks([
					"/Change",
					"/TN",
					taskName,
					"/DISABLE"
				])).code !== 0) throw new Error(`Could not disable Scheduled Task ${taskName} before restoring it.`);
				await execSchtasks([
					"/End",
					"/TN",
					taskName
				]);
				const probe = probeScheduledTaskState(taskName);
				if (probe.status !== "found" || probe.enabled !== false || !isScheduledTaskDefinitelyNotRunning(taskName)) throw new Error(`Scheduled Task ${taskName} may still be queued or running.`);
				if (activated) {
					const runtime = await resolveFallbackRuntime(env, void 0, "control");
					if (runtime.status === "running") {
						if (shouldManageGatewayListenerPort(env)) await terminateScheduledTaskGatewayListeners(env);
						else await terminateScheduledTaskNodeHost(env);
					}
					if (runtime.status === "unknown" || (await resolveFallbackRuntime(env, void 0, "control")).status !== "stopped") throw new Error(`Scheduled Task ${taskName} replacement process did not settle.`);
				}
				await assertReceipt(true);
			}
			const restoredFiles = await files.restore();
			if (!changed && !activated) return restoredFiles;
			if (original === null) {
				if ((await execSchtasks([
					"/Delete",
					"/F",
					"/TN",
					taskName
				])).code !== 0) throw new Error(`Could not remove replacement Scheduled Task ${taskName}.`);
			} else {
				await restoreScheduledTaskDefinition({
					env,
					xml: original,
					beforeWrite: () => assertReceipt(true),
					assertCurrent: assertGatewayServiceUpdateCurrent
				});
				receipt = setScheduledTaskXmlEnabled(original, false);
				await assertReceipt();
				if (originalRuntime?.status !== "found" || typeof originalRuntime.enabled !== "boolean" || originalRuntime.state !== 1 && originalRuntime.state !== 3 && originalRuntime.state !== 4) throw new Error(`Scheduled Task ${taskName} previous running state could not be verified.`);
				if (originalRuntime.enabled) {
					await resumeScheduledTaskAutoStartAfterUpdate(env, { beforeMutation: assertReceipt });
					receipt = setScheduledTaskXmlEnabled(original, true);
					await assertReceipt();
				}
				if (originalRuntime.state === 4) {
					const restoreDisabled = !originalRuntime.enabled;
					try {
						if (restoreDisabled) await resumeScheduledTaskAutoStartAfterUpdate(env, { beforeMutation: assertReceipt });
						if ((await execSchtasks([
							"/Run",
							"/TN",
							taskName
						])).code !== 0 || restoreDisabled && !await waitForScheduledTaskRunningEvidence(env)) throw new Error(`Scheduled Task ${taskName} previous launch did not confirm completion.`);
					} finally {
						if (restoreDisabled) {
							await suspendScheduledTaskAutoStartForUpdate(env, {
								beforeMutation: () => assertReceipt(true),
								restoreOnFailure: false
							});
							await assertReceipt();
						}
					}
					if (!await waitForScheduledTaskRunningEvidence(env)) throw new Error(`Scheduled Task ${taskName} previous running state could not be restored.`);
				}
			}
			return true;
		}
	};
}
/** Capture every launcher before replacing any part of the runnable definition. */
async function publishScheduledTaskFiles(files, definitionTransaction) {
	if (definitionTransaction) {
		for (const file of files) {
			assertGatewayServiceUpdateCurrent();
			await fs$1.mkdir(path.dirname(file.path), { recursive: true });
			await publishServiceFile({
				filePath: file.path,
				contents: file.contents,
				mode: 384,
				definitionTransaction
			});
		}
		return;
	}
	const snapshots = await withGatewayServiceInstallationRecovery(() => Promise.all(files.map(async (file) => {
		const before = await readServiceFileState(file.path);
		const previous = before ? await fs$1.readFile(file.path) : null;
		if (previous && sha256Hex(previous) !== before?.sha256) throw new Error(`Task launcher changed during backup: ${file.path}`);
		return {
			...file,
			original: before && previous ? {
				contents: previous,
				state: before
			} : null,
			after: before,
			prepared: null,
			changed: false
		};
	})), async () => false);
	const assertPublished = async () => {
		for (const file of snapshots) {
			const current = await readServiceFileState(file.path);
			const prepared = file.prepared;
			if (prepared) {
				if (current && [
					"dev",
					"ino",
					"sha256",
					"mode",
					"size",
					"mtimeMs"
				].every((key) => current[key] === prepared[key])) {
					file.after = current;
					file.changed = true;
				} else if (!isDeepStrictEqual(current, file.after)) throw new Error(`Task launcher changed during publication: ${file.path}`);
				file.prepared = null;
			}
			if (!isDeepStrictEqual(current, file.after)) throw new Error(`Task launcher changed after publication: ${file.path}`);
		}
	};
	const publish = (file, contents, mode) => publishServiceFile({
		filePath: file.path,
		contents,
		mode,
		definitionTransaction: {
			assertCurrent: assertGatewayServiceUpdateCurrent,
			beforeWrite: assertPublished,
			filePrepared: async (_source, temporary) => {
				const prepared = temporary === null ? null : await readServiceFileState(temporary);
				if (!prepared) throw new Error(`Task launcher publication was not staged: ${file.path}`);
				await assertPublished();
				file.prepared = prepared;
			},
			fileWritten: assertPublished,
			taskPrepared: async () => {},
			taskWritten: async () => {}
		}
	});
	const restore = async () => {
		await assertPublished();
		const changed = snapshots.filter((file) => file.changed);
		for (const file of changed.toReversed()) if (file.original) await publish(file, file.original.contents, file.original.state.mode);
		else {
			await assertPublished();
			assertGatewayServiceUpdateCurrent();
			await fs$1.unlink(file.path);
			file.after = null;
		}
		await assertPublished();
		return changed.length > 0;
	};
	return withGatewayServiceInstallationRecovery(async () => {
		for (const directory of new Set(files.map((file) => path.dirname(file.path)))) {
			assertGatewayServiceUpdateCurrent();
			await fs$1.mkdir(directory, { recursive: true });
		}
		for (const file of snapshots) if (file.original) await publishTaskFile({
			path: `${file.path}.bak`,
			contents: file.original.contents
		});
		for (const file of snapshots) await publish(file, file.contents, 384);
		return {
			restore,
			assertPublished
		};
	}, restore);
}
//#endregion
//#region src/daemon/schtasks-install.ts
const CALLER_OWNED_SERVICE_IDENTITY_KEYS = [
	"OPENCLAW_LAUNCHD_LABEL",
	"OPENCLAW_SYSTEMD_UNIT",
	"OPENCLAW_WINDOWS_TASK_NAME"
];
function resolveScheduledTaskRenderEnv(env, environment) {
	if (!environment) return env;
	const merged = {
		...env,
		...environment
	};
	for (const key of CALLER_OWNED_SERVICE_IDENTITY_KEYS) {
		const value = env[key]?.trim();
		if (value) merged[key] = value;
	}
	return merged;
}
function resolveScheduledTaskScriptEnvironment(taskEnv, environment) {
	const scriptEnv = environment ? { ...environment } : {};
	for (const key of CALLER_OWNED_SERVICE_IDENTITY_KEYS) {
		const value = taskEnv[key]?.trim();
		if (value) scriptEnv[key] = value;
	}
	return Object.keys(scriptEnv).length > 0 ? scriptEnv : void 0;
}
const SCHEDULED_TASK_ACTIVATION_KEYS = [
	"OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER",
	"OPENCLAW_TASK_SCRIPT_NAME",
	"OPENCLAW_TASK_SCRIPT",
	"OPENCLAW_SERVICE_KIND",
	"OPENCLAW_GATEWAY_PORT",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_PROFILE"
];
function resolveScheduledTaskActivationEnv(env, environment) {
	if (!environment) return env;
	const activationEnv = { ...env };
	for (const key of SCHEDULED_TASK_ACTIVATION_KEYS) {
		const value = environment[key];
		if (value !== void 0) activationEnv[key] = value;
	}
	return activationEnv;
}
async function writeScheduledTaskScript({ env, programArguments, workingDirectory, environment, description, definitionTransaction }) {
	const taskEnv = resolveScheduledTaskRenderEnv(env, environment);
	const scriptPath = resolveTaskScriptPath(taskEnv);
	const taskLaunchPath = resolveTaskLauncherScriptPath(taskEnv, scriptPath);
	const taskDescription = resolveGatewayServiceDescription({
		env: taskEnv,
		description
	});
	const script = buildTaskScript({
		description: taskDescription,
		programArguments,
		workingDirectory,
		environment: resolveScheduledTaskScriptEnvironment(taskEnv, environment)
	});
	const files = [{
		path: scriptPath,
		contents: encodeWindowsLauncherScript({
			format: "cmd",
			content: script
		})
	}];
	if (taskLaunchPath !== scriptPath) {
		const launcher = buildHiddenLauncherScript({
			description: taskDescription,
			scriptPath,
			taskSupervisor: environment?.OPENCLAW_SERVICE_KIND === "gateway"
		});
		files.push({
			path: taskLaunchPath,
			contents: encodeWindowsLauncherScript({
				format: "vbs",
				content: launcher
			})
		});
	}
	return {
		scriptPath,
		taskLaunchPath,
		taskDescription,
		recovery: await publishScheduledTaskFiles(files, definitionTransaction)
	};
}
async function stageScheduledTask({ stdout, ...args }) {
	const { scriptPath } = await writeScheduledTaskScript(args);
	writeFormattedLines(stdout, [{
		label: "Staged task script",
		value: scriptPath
	}], { leadingBlankLine: true });
	return { scriptPath };
}
async function updateExistingScheduledTask(params) {
	if (!(params.registration?.registered ?? await isRegisteredScheduledTask(params.env))) return null;
	if (!params.definitionTransaction) {
		assertGatewayServiceUpdateCurrent();
		const change = await execSchtasks([
			"/Change",
			"/TN",
			params.taskName,
			"/TR",
			params.quotedLaunchPath
		]);
		if (change.code === 124) {
			params.registration?.retainRecovery();
			throw new Error("Scheduled Task registration change did not confirm completion.");
		}
		if (change.code !== 0) return null;
	}
	const { expectedXml } = params;
	const upgradeXmlPath = await writeTaskXmlTempFile(expectedXml);
	try {
		await params.definitionTransaction?.taskPrepared(expectedXml);
		params.definitionTransaction?.assertCurrent();
		assertGatewayServiceUpdateCurrent();
		const upgraded = await execSchtasks([
			"/Create",
			"/F",
			"/TN",
			params.taskName,
			"/XML",
			upgradeXmlPath
		]);
		if (upgraded.code === 124) {
			params.registration?.retainRecovery();
			throw new Error("Scheduled Task registration did not confirm completion.");
		}
		if (upgraded.code !== 0) {
			const detail = (upgraded.stderr || upgraded.stdout).trim() || "unknown error";
			const message = `Scheduled Task definition upgrade failed: ${detail}`;
			if (params.definitionTransaction) throw new Error(message);
			params.warn?.(`Scheduled Task ${params.taskName} launch command was refreshed, but XML settings (including battery settings) were not: ${detail}. Inspect Task Scheduler and retry the service installation to refresh those settings.`);
		} else await params.definitionTransaction?.taskWritten(expectedXml);
	} finally {
		await fs$1.rm(path.dirname(upgradeXmlPath), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	await params.registration?.recordRegistration();
	await params.definitionTransaction?.beforeWrite();
	assertGatewayServiceUpdateCurrent();
	params.onActivation?.();
	const activation = await runScheduledTaskOrThrow({
		taskName: params.taskName,
		env: params.env,
		scriptPath: params.scriptPath,
		assertCurrent: params.definitionTransaction?.assertCurrent,
		allowFallback: params.definitionTransaction ? false : void 0
	});
	writeFormattedLines(params.stdout, [{
		label: "Updated Scheduled Task",
		value: params.taskName
	}, {
		label: "Task script",
		value: params.scriptPath
	}], { leadingBlankLine: true });
	return activation;
}
async function activateScheduledTask(params) {
	const taskDescription = params.description ?? "OpenClaw Gateway";
	const taskName = resolveTaskName(params.env);
	const quotedLaunchPath = quoteSchtasksArg(params.taskLaunchPath);
	let expectedXml = buildScheduledTaskXml({
		taskDescription,
		taskUser: resolveTaskUser(params.env),
		launchPath: params.taskLaunchPath
	});
	if (params.definitionTransaction?.preservePolicy?.length) expectedXml = preserveServicePolicyXml(expectedXml, await readScheduledTaskDefinition(params.env), params.definitionTransaction.preservePolicy, "Task");
	const existingActivation = await updateExistingScheduledTask({
		...params,
		taskName,
		quotedLaunchPath,
		expectedXml
	});
	if (existingActivation) return existingActivation;
	const xmlPath = await writeTaskXmlTempFile(expectedXml);
	let create;
	try {
		const xmlArgs = [
			"/Create",
			"/F",
			"/TN",
			taskName,
			"/XML",
			xmlPath
		];
		await params.definitionTransaction?.taskPrepared(expectedXml);
		params.definitionTransaction?.assertCurrent();
		assertGatewayServiceUpdateCurrent();
		create = await execSchtasks(xmlArgs);
		if (create.code === 0) await params.definitionTransaction?.taskWritten(expectedXml);
	} finally {
		await fs$1.rm(path.dirname(xmlPath), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	if (create.code !== 0) {
		if (create.code === 124) {
			params.registration?.retainRecovery();
			throw new Error("Scheduled Task registration did not confirm completion.");
		}
		const detail = create.stderr || create.stdout;
		if (shouldFallbackToStartupEntry({
			code: create.code,
			detail
		})) {
			if (isUpdateOwnedGatewayServiceCommand() || params.definitionTransaction) throw new Error("UPDATE_NATIVE_AUTHORITY: update-owned native commands require Task Scheduler; startup fallback is unsupported.");
			const startupEntryPath = resolveStartupEntryPath(params.env);
			assertGatewayServiceUpdateCurrent();
			await fs$1.mkdir(path.dirname(startupEntryPath), { recursive: true });
			const useHiddenLauncher = shouldUseHiddenWindowsTaskLauncher(params.env);
			const launcher = useHiddenLauncher ? buildHiddenLauncherScript({
				description: taskDescription,
				scriptPath: params.scriptPath,
				taskSupervisor: params.env.OPENCLAW_SERVICE_KIND === "gateway"
			}) : buildStartupLauncherScript({
				description: taskDescription,
				scriptPath: params.scriptPath
			});
			assertGatewayServiceUpdateCurrent();
			await publishServiceFile({
				filePath: startupEntryPath,
				contents: encodeWindowsLauncherScript({
					format: useHiddenLauncher ? "vbs" : "cmd",
					content: launcher
				}),
				mode: 384
			});
			params.registration?.retainRecovery();
			await launchFallbackTaskScript(params.env);
			writeFormattedLines(params.stdout, [{
				label: "Installed Windows login item",
				value: startupEntryPath
			}, {
				label: "Task script",
				value: params.scriptPath
			}], { leadingBlankLine: true });
			return "startup-fallback";
		}
		throw new Error(`schtasks create failed: ${detail}`.trim());
	}
	await params.registration?.recordRegistration();
	await params.definitionTransaction?.beforeWrite();
	assertGatewayServiceUpdateCurrent();
	params.onActivation?.();
	const activation = await runScheduledTaskOrThrow({
		taskName,
		env: params.env,
		scriptPath: params.scriptPath,
		assertCurrent: params.definitionTransaction?.assertCurrent,
		allowFallback: params.definitionTransaction ? false : void 0
	});
	writeFormattedLines(params.stdout, [{
		label: "Installed Scheduled Task",
		value: taskName
	}, {
		label: "Task script",
		value: params.scriptPath
	}], { leadingBlankLine: true });
	return activation;
}
async function installScheduledTask(args) {
	let restoreTask;
	let staged;
	const warn = args.warn ?? ((message) => args.stdout.write(`${message}\n`));
	let activationAttempted = false;
	const install = async () => {
		const installedCommand = await readScheduledTaskCommand(args.env).catch(() => null);
		const fallbackEnv = resolveScheduledTaskActivationEnv(args.env, installedCommand?.environment);
		const startupEntryInstalled = !args.definitionTransaction && await isStartupEntryInstalled(fallbackEnv);
		let startupRuntime = startupEntryInstalled ? await resolveFallbackRuntime(fallbackEnv, installedCommand, "control").catch(() => null) : null;
		if (startupEntryInstalled && args.startupFallbackTakeoverRuntime?.status === "running" && startupRuntime?.status !== "running") startupRuntime = await waitForFallbackTakeoverRuntime(fallbackEnv, installedCommand, startupRuntime ?? { status: "unknown" }, args.startupFallbackTakeoverRuntime);
		if (startupEntryInstalled && (!startupRuntime || startupRuntime.status === "unknown")) throw new Error(startupRuntime?.detail ?? "Could not verify the existing Windows login item before Scheduled Task migration.");
		const activationEnv = resolveScheduledTaskActivationEnv(args.env, args.environment);
		if (startupRuntime) {
			const fallbackPid = startupRuntime.status === "running" ? startupRuntime.pid : void 0;
			if (startupRuntime.status === "running" && !fallbackPid) throw new Error("Could not verify the existing Windows login item process.");
			await assertReplacementPortAvailableForTakeover({
				env: activationEnv,
				programArguments: args.programArguments,
				...args.environment ? { environment: args.environment } : {},
				...fallbackPid ? { fallbackPid } : {}
			});
		}
		if (!args.definitionTransaction) restoreTask = await backupScheduledTaskDefinition(activationEnv, resolveTaskScriptPath(resolveScheduledTaskRenderEnv(args.env, args.environment)));
		staged = await writeScheduledTaskScript(args);
		const activation = await activateScheduledTask({
			env: activationEnv,
			stdout: args.stdout,
			warn,
			scriptPath: staged.scriptPath,
			taskLaunchPath: staged.taskLaunchPath,
			description: staged.taskDescription,
			definitionTransaction: args.definitionTransaction,
			registration: restoreTask,
			onActivation: () => {
				activationAttempted = true;
			}
		});
		assertGatewayServiceUpdateCurrent();
		if (activation !== "scheduled-task") return { scriptPath: staged.scriptPath };
		const takeoverRuntime = startupRuntime?.status === "stopped" ? await resolveFallbackRuntime(fallbackEnv, installedCommand, "control").catch(() => startupRuntime) : startupRuntime;
		if (takeoverRuntime?.status === "running" && takeoverRuntime.pid) {
			await terminateGatewayProcessTree(takeoverRuntime.pid, 300);
			let scheduledTaskRunAccepted = false;
			try {
				await restartRegisteredScheduledTask({
					env: activationEnv,
					stdout: args.stdout,
					mode: { kind: "fallback-takeover" },
					onRunMutation: () => {
						scheduledTaskRunAccepted = true;
					}
				});
			} catch (err) {
				if (!scheduledTaskRunAccepted) await launchFallbackTaskScript(fallbackEnv, installedCommand);
				throw err;
			}
		} else if (takeoverRuntime?.status === "stopped" && await waitForScheduledTaskRunningEvidence(activationEnv)) await removeStartupEntries(activationEnv, args.stdout);
		assertGatewayServiceUpdateCurrent();
		return { scriptPath: staged.scriptPath };
	};
	if (args.definitionTransaction) return install();
	return withGatewayServiceInstallationRecovery(install, async () => {
		if (!staged?.recovery || !restoreTask) return false;
		return restoreTask.restore(staged.recovery, activationAttempted);
	}).catch((error) => {
		if (error instanceof GatewayServiceAuthorityError && error.outcome === "recovery-pending" || error instanceof AggregateError) warn("Scheduled Task recovery did not confirm completion; a queued task may still start. Inspect Task Scheduler before restoring any .bak launcher or task XML files beside the task script.");
		throw error;
	});
}
async function uninstallScheduledTask({ env, stdout }) {
	await assertSchtasksAvailable();
	const taskName = resolveTaskName(env);
	const query = await execSchtasks([
		"/Query",
		"/TN",
		taskName
	]);
	const queryDetail = normalizeLowercaseStringOrEmpty(query.stderr || query.stdout);
	const exists = query.code === 0 ? true : queryDetail.includes("cannot find the file") ? false : probeScheduledTaskExists(taskName);
	if (exists === null) throw new Error(`Could not verify whether Scheduled Task ${taskName} exists.`);
	if (exists) {
		const deletion = await execSchtasks([
			"/Delete",
			"/F",
			"/TN",
			taskName
		]);
		if (deletion.code !== 0) {
			const detail = (deletion.stderr || deletion.stdout).trim() || "unknown error";
			throw new Error(`schtasks delete failed: ${detail}`);
		}
	}
	await removeStartupEntries(env, stdout);
	const scriptPath = resolveTaskScriptPath(env);
	const parsedScriptPath = path.parse(scriptPath);
	const launcherPaths = uniqueStrings([resolveTaskLauncherScriptPath(env, scriptPath), path.join(parsedScriptPath.dir, `${parsedScriptPath.name}.vbs`)]);
	for (const launcherPath of launcherPaths) {
		if (launcherPath === scriptPath) continue;
		try {
			await fs$1.unlink(launcherPath);
			stdout.write(`${formatLine("Removed task launcher", launcherPath)}\n`);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
	}
	for (const backupPath of uniqueStrings([
		`${scriptPath}.bak`,
		`${scriptPath}.task.xml.bak`,
		...launcherPaths.map((launcherPath) => `${launcherPath}.bak`)
	])) await fs$1.unlink(backupPath).catch((error) => {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	});
	try {
		await fs$1.unlink(scriptPath);
		stdout.write(`${formatLine("Removed task script", scriptPath)}\n`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		stdout.write(`Task script not found at ${scriptPath}\n`);
	}
}
//#endregion
export { readWindowsStartupFallbackRuntimeForUpdate as _, restartScheduledTask as a, signalVerifiedGatewayPidSync as b, setScheduledTaskXmlEnabled as c, suspendScheduledTaskAutoStartForUpdate as d, ScheduledTaskAutoStartRecoveryError as f, readScheduledTaskRuntime as g, isScheduledTaskInstalled as h, readScheduledTaskDefinition as i, startScheduledTask as l, isScheduledTaskEnabled as m, stageScheduledTask as n, restoreScheduledTaskDefinition as o, isScheduledTaskDefinitelyNotRunning as p, uninstallScheduledTask as r, resumeScheduledTaskAutoStartAfterUpdate as s, installScheduledTask as t, stopScheduledTask as u, findVerifiedGatewayListenerPidsOnPortSync as v, formatGatewayPidList as y };

import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
import { i as WINDOWS_TASK_SUPERVISOR_FLAG, l as readWindowsTaskSupervisorRestartExitCode } from "./windows-task-supervisor-contract-DlaAkrWJ.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { p as resolveGatewayServiceDescription, s as NODE_SERVICE_KIND } from "./constants-BLghGsId.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { b as uniqueValues, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { t as killProcessTree } from "./kill-tree-ecObdMeW.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { u as readWindowsProcessStartTimeSync } from "./pid-alive-CPS_shDt.mjs";
import { t as resolveRuntimeArgs } from "./runtime-worker-url-DoBSDhBS.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-8uSpDbMY.mjs";
import { n as SUPPORTED_NODE_VERSIONS } from "./node-version-DdJ6cN09.mjs";
import { a as isSqliteLockError, u as sqliteExtendedResultCode } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { d as tryAcquireGatewayStateOwner } from "./gateway-state-owner-DmHycK5o.mjs";
import { r as resolveGatewayTaskScriptPath } from "./paths-DMJOvLwv.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { a as getWindowsSystem32ExePath, r as getWindowsPowerShellExePath, t as getWindowsCmdExePath } from "./windows-install-roots-Qi4d52Il.mjs";
import { n as resolveTaskUser, t as resolveServiceManagerEnv } from "./service-process-env-C6isS50W.mjs";
import { c as withGatewayServiceInstallationRecovery, i as assertGatewayServiceUpdateCurrent, n as GatewayServiceAuthorityError, o as isUpdateOwnedGatewayServiceCommand } from "./service-update-authority-CoX8GMUL.mjs";
import { i as readServiceFileState, n as matchesServiceFilePublication, r as publishServiceFile } from "./service-stage-DxRqPldv.mjs";
import { r as fingerprintGatewayServiceDefinition } from "./service-rebind-CQbm-oeP.mjs";
import { t as createServiceRuntimeInspectionFailure } from "./service-runtime-Cbp6mAbj.mjs";
import { t as classifyOpenClawArgv } from "./gateway-process-argv-DMAY-YPv.mjs";
import { t as parseWindowsNativeCommandLine } from "./windows-command-line-BrVAurm9.mjs";
import { a as readGatewayLockProcessCmdline, d as readWindowsProcessArgsSync, l as readWindowsPortUsageSync, r as readGatewayOwnerLease, s as readWindowsListeningPidsOnPortSync } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { n as findGatewayPidsOnPortSync } from "./restart-stale-pids-BSJ5Iyx5.mjs";
import { n as spawnWithFallback } from "./spawn-utils-CNJQGGPF.mjs";
import { i as isGatewayDistEntrypointPath, n as buildGatewayInstallEntrypointCandidates, r as findFirstAccessibleGatewayEntrypoint, t as buildGatewayDistEntrypointCandidates } from "./gateway-entrypoint-CRhfnUxj.mjs";
import { n as resolveBrewOpenClawPath } from "./brew-BMTI2ldy.mjs";
import { n as GATEWAY_SERVICE_STOP_TIMEOUT_MS } from "./gateway-shutdown-budget-v-vGFkEN.mjs";
import "./windows-powershell-spawn-DDmi3G9M.mjs";
import { a as readScheduledTaskCommand, b as probeScheduledTaskState, c as resolveStartupEntryPaths, d as shouldFallbackToStartupEntry, f as shouldUseHiddenWindowsTaskLauncher, g as ScheduledTaskInspectionError, h as encodeWindowsLauncherScript, i as quoteSchtasksArg, l as resolveTaskLauncherScriptPath, n as buildStartupLauncherScript, o as readStartupEntryCommand, p as assertTaskInspectionDeadline, r as buildTaskScript, s as resolveStartupEntryPath, t as buildHiddenLauncherScript, u as resolveTaskName, v as prepareScheduledTaskSettlement, y as probeScheduledTaskExists } from "./schtasks-layout-BWyDzx-H.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
import { t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-CowMnBnJ.mjs";
import { f as preserveServicePolicyXml } from "./launchd-service-files-BNJoYP-S.mjs";
import { r as writeFormattedLines, t as formatLine } from "./output-EUQq_O0z.mjs";
import { t as withGatewayServiceOperationLock } from "./service-operation-lock-Dnqiud_w.mjs";
import { n as inspectPortUsage } from "./ports-inspect-54fwKbFD.mjs";
import { t as createGatewayLifecycleMutationReporter } from "./service-mutation-BITjAaaK.mjs";
import { i as resolveGatewayHeapExecArgv } from "./gateway-heap-DTqeZ8TX.mjs";
import { n as writeTaskXmlTempFile, r as execSchtasks, t as buildScheduledTaskXml } from "./schtasks-xml-Yphk-Yhk.mjs";
import { r as isGatewayProtocolResponseError } from "./protocol-request-BMUN1re6.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { hostname } from "node:os";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
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
//#region src/daemon/program-args.ts
/** Builds runtime command arguments for gateway and node service installs. */
const OPENCLAW_WRAPPER_ENV_KEY = "OPENCLAW_WRAPPER";
const canAccessEntrypoint = (candidate) => fs$1.access(candidate).then(() => true, () => false);
async function resolveCliEntrypointPathForService() {
	const argv1 = process.argv[1];
	if (!argv1) throw new Error("Unable to resolve CLI entrypoint path");
	const normalized = path.resolve(argv1);
	const resolvedPath = await fs$1.realpath(normalized).catch(() => normalized);
	if (resolvedPath.includes(`${path.sep}.pnpm${path.sep}`)) {
		const { resolveOpenClawPackageRoot } = await import("./openclaw-root-Cr3tCNk3.mjs");
		const { resolvePnpmGlobalInstallOwner } = await import("./update-global-DvjQYduD.mjs");
		const packageRoot = await resolveOpenClawPackageRoot({ argv1: normalized });
		const owner = packageRoot ? await resolvePnpmGlobalInstallOwner(packageRoot) : null;
		if (packageRoot && owner && await fs$1.realpath(owner.packageRoot).catch(() => null) === await fs$1.realpath(packageRoot).catch(() => void 0)) {
			const stableEntrypoint = await findFirstAccessibleGatewayEntrypoint(buildGatewayInstallEntrypointCandidates(owner.packageRoot), canAccessEntrypoint);
			if (stableEntrypoint) return stableEntrypoint;
		}
	}
	if (isGatewayDistEntrypointPath(resolvedPath)) {
		const preferredDistEntrypoint = await findFirstAccessibleGatewayEntrypoint(buildGatewayDistEntrypointCandidates(normalized, resolvedPath), canAccessEntrypoint);
		if (preferredDistEntrypoint) return preferredDistEntrypoint;
		if (isGatewayDistEntrypointPath(normalized) && normalized !== resolvedPath && await canAccessEntrypoint(normalized)) return normalized;
		return resolvedPath;
	}
	const distCandidates = buildDistCandidates(resolvedPath, normalized);
	const entrypoint = await findFirstAccessibleGatewayEntrypoint(distCandidates, canAccessEntrypoint);
	if (entrypoint) return entrypoint;
	throw new Error(`Cannot find built CLI at ${distCandidates.join(" or ")}. Run "pnpm build" first, or use dev mode.`);
}
function buildDistCandidates(...inputs) {
	const roots = [];
	for (const inputPath of inputs) {
		const baseDir = path.dirname(inputPath);
		roots.push(path.resolve(baseDir, ".."), baseDir);
		const parts = inputPath.split(path.sep);
		const binIndex = parts.lastIndexOf(".bin");
		if (binIndex > 0 && parts[binIndex - 1] === "node_modules") roots.push(path.join(parts.slice(0, binIndex).join(path.sep), path.basename(inputPath)));
	}
	return [...new Set(roots.flatMap(buildGatewayInstallEntrypointCandidates))];
}
function resolveRepoRootForDev() {
	const argv1 = process.argv[1];
	if (!argv1) throw new Error("Unable to resolve repo root");
	const parts = path.resolve(argv1).split(path.sep);
	const srcIndex = parts.lastIndexOf("src");
	if (srcIndex === -1) throw new Error("Dev mode requires running from repo (src/entry.ts)");
	return parts.slice(0, srcIndex).join(path.sep);
}
async function resolveOpenClawWrapperPath(inputPath) {
	const trimmed = inputPath?.trim();
	if (!trimmed) return;
	const resolved = path.resolve(trimmed);
	try {
		if (!(await fs$1.stat(resolved)).isFile()) throw new Error("not a regular file");
		await fs$1.access(resolved, constants.X_OK);
	} catch (error) {
		const detail = error instanceof Error ? ` (${error.message})` : "";
		throw new Error(`${OPENCLAW_WRAPPER_ENV_KEY} must point to an executable file: ${resolved}${detail}`, { cause: error });
	}
	return resolved;
}
async function resolveCliProgramArguments(params) {
	const wrapperPath = await resolveOpenClawWrapperPath(params.wrapperPath);
	if (wrapperPath) return { programArguments: [wrapperPath, ...params.args] };
	if (!params.runtimePath?.trim()) throw new Error(params.runtime === "bun" ? "No supported Bun runtime was selected for the daemon. Install Bun 1.4 or newer with WAL-reset-safe node:sqlite, then retry." : `No supported Node runtime was selected for the daemon. Install Node ${SUPPORTED_NODE_VERSIONS}, then retry.`);
	const runtimePath = params.runtimePath;
	if (params.dev) {
		const repoRoot = resolveRepoRootForDev();
		const devCliPath = path.join(repoRoot, "src", "entry.ts");
		await fs$1.access(devCliPath);
		return {
			programArguments: params.runtime === "bun" ? [
				runtimePath,
				...resolveRuntimeArgs(params.runtime),
				devCliPath,
				...params.args
			] : [
				runtimePath,
				"--import",
				"tsx",
				devCliPath,
				...params.args
			],
			workingDirectory: repoRoot
		};
	}
	const cliEntrypointPath = await resolveCliEntrypointPathForService();
	return { programArguments: [
		runtimePath,
		...resolveRuntimeArgs(params.runtime),
		await resolveBrewOpenClawPath(cliEntrypointPath) ?? cliEntrypointPath,
		...params.args
	] };
}
async function resolveGatewayProgramArguments(params) {
	const gatewayArgs = [
		"gateway",
		"--port",
		String(params.port)
	];
	if (params.allowUnconfigured) gatewayArgs.push("--allow-unconfigured");
	const result = await resolveCliProgramArguments({
		args: gatewayArgs,
		dev: params.dev,
		runtime: params.runtime,
		runtimePath: params.runtimePath,
		wrapperPath: params.wrapperPath
	});
	if (params.runtime === "node" && !params.wrapperPath?.trim()) result.programArguments.splice(1, 0, ...resolveGatewayHeapExecArgv(params.existingCommand));
	return result;
}
async function resolveNodeProgramArguments(params) {
	const args = [
		"node",
		"run",
		"--host",
		params.host,
		"--port",
		String(params.port)
	];
	if (params.tls === false && !params.tlsFingerprint) args.push("--no-tls");
	else if (params.tls || params.tlsFingerprint) args.push("--tls");
	if (params.tlsFingerprint) args.push("--tls-fingerprint", params.tlsFingerprint);
	if (params.contextPath) args.push("--context-path", params.contextPath);
	if (params.nodeId) args.push("--node-id", params.nodeId);
	if (params.displayName) args.push("--display-name", params.displayName);
	if (params.installedAppsSharing !== void 0) args.push(params.installedAppsSharing ? "--share-installed-apps" : "--no-share-installed-apps");
	if (params.allCommands) args.push("--all-commands");
	else if (params.commands !== void 0) args.push("--commands", params.commands.join(","));
	return resolveCliProgramArguments({
		args,
		dev: params.dev,
		runtime: params.runtime,
		runtimePath: params.runtimePath,
		wrapperPath: params.wrapperPath
	});
}
//#endregion
//#region src/daemon/schtasks-port-diagnostics.ts
async function describeUnverifiedPortListeners(port, probeHosts) {
	const diagnostics = await inspectPortUsage(port, probeHosts ? { probeHosts } : void 0).catch(() => null);
	const listeners = diagnostics?.status === "busy" ? diagnostics.listeners : [];
	if (!listeners || listeners.length === 0) return "";
	const described = listeners.map((listener) => {
		const pid = typeof listener.pid === "number" ? listener.pid : null;
		const argv = listener.commandLine ? parseWindowsNativeCommandLine(listener.commandLine) : null;
		const identity = argv ? classifyOpenClawArgv(argv, { command: "gateway" }).kind === "openclaw" ? "openclaw gateway" : "not an openclaw gateway" : "argv unavailable";
		const name = listener.command ?? "unknown";
		return pid ? `pid ${pid} (${name}, ${identity})` : `${name} (${identity})`;
	});
	const hint = listeners.map((listener) => listener.pid).filter((pid) => typeof pid === "number").length ? ` If one of these is this gateway, stop it with "Stop-Process -Id <pid> -Force" and retry.` : "";
	return ` Remaining listener(s): ${described.join(", ")}. If gateway.cmd redirects output, quote the entire redirection target, including environment variables.${hint}`;
}
//#endregion
//#region src/daemon/schtasks-process-snapshot.ts
/** Bounded native Windows process snapshots; callers own interpretation and control. */
function getSnapshotProcessId(entry) {
	const pid = entry.ProcessId;
	return typeof pid === "number" && Number.isFinite(pid) && pid > 0 ? pid : null;
}
/** Only fully readable rows can support a negative process-match observation. */
function isCompleteWindowsProcessSnapshot(entries) {
	const candidates = entries.filter((entry) => entry.ProcessId !== 0);
	return candidates.length > 0 && candidates.every((entry) => getSnapshotProcessId(entry) !== null && typeof entry.CommandLine === "string" && (parseWindowsNativeCommandLine(entry.CommandLine)?.length ?? 0) > 0);
}
function readWindowsProcessSnapshot(timeoutMs) {
	if (process.platform !== "win32" || timeoutMs !== void 0 && (!Number.isFinite(timeoutMs) || timeoutMs < 1)) return null;
	const processTimeoutMs = Math.min(resolveIntegerOption(timeoutMs, 5e3), 5e3);
	const processSnapshot = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		[
			"$ErrorActionPreference='Stop'",
			"$json = Get-CimInstance Win32_Process -ErrorAction Stop | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress",
			"$bytes = [Text.Encoding]::UTF8.GetBytes($json)",
			"[Console]::OpenStandardOutput().Write($bytes, 0, $bytes.Length)"
		].join("; ")
	], {
		env: resolveServiceManagerEnv(),
		encoding: "utf8",
		timeout: processTimeoutMs,
		windowsHide: true
	});
	if (processSnapshot.error || processSnapshot.status !== 0) return null;
	const parsedSnapshot = safeParseJson(processSnapshot.stdout.trim() || "[]");
	const entries = (Array.isArray(parsedSnapshot) ? parsedSnapshot : [parsedSnapshot]).filter((entry) => typeof entry === "object" && entry !== null);
	return entries.length > 0 ? entries : null;
}
//#endregion
//#region src/daemon/schtasks-sqlite.ts
function isScheduledTaskSqliteSharingError(error) {
	return process.platform === "win32" && (isSqliteLockError(error) || [
		1546,
		4618,
		4874
	].includes(sqliteExtendedResultCode(error) ?? -1));
}
async function retryScheduledTaskLeaseRead(read) {
	for (const deadline = Date.now() + 15e3;;) try {
		return read();
	} catch (error) {
		if (!isScheduledTaskSqliteSharingError(error) || Date.now() >= deadline) throw error;
		await sleep(Math.min(100, deadline - Date.now()));
	}
}
//#endregion
//#region src/daemon/schtasks-process.ts
const WINDOWS_FORCED_PROCESS_EXIT_TIMEOUT_MS = 15e3;
function resolveScheduledTaskCommandPort(env, command) {
	return parseTcpPortFromArgs(command?.programArguments) ?? parseTcpPort(command?.environment?.OPENCLAW_GATEWAY_PORT) ?? parseTcpPort(env.OPENCLAW_GATEWAY_PORT);
}
function isNodeHostArgv(programArguments) {
	const normalized = normalizeProgramArguments(programArguments);
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
function findInstalledProcessPid(entries, port, installedArguments, matchesProcess, comparableArguments = (argv) => argv) {
	for (const entry of entries) {
		if (!normalizeLowercaseStringOrEmpty(entry.CommandLine ?? "")) continue;
		const argv = parseWindowsNativeCommandLine(entry.CommandLine ?? "");
		if (!argv || !matchesProcess(argv) || parseTcpPortFromArgs(argv) !== port || !matchesInstalledProgramArguments(comparableArguments(argv), installedArguments)) continue;
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
	return findInstalledProcessPid(entries, port, installedArguments, (argv) => readWindowsTaskSupervisorRestartExitCode(argv) !== void 0, (argv) => argv.slice(0, -1)) ?? findInstalledProcessPid(entries, port, installedArguments, () => true);
}
async function resolveScheduledTaskNodeHostProcess(env, installedCommand) {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const installedArguments = command?.programArguments;
	if (!installedArguments?.length) return null;
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port) return null;
	const snapshot = readWindowsProcessSnapshot();
	if (!snapshot) return null;
	const pid = findInstalledProcessPid(snapshot, port, installedArguments, isNodeHostArgv);
	return pid ? {
		pid,
		port
	} : null;
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
	return Array.from(new Set(listeners.flatMap((listener) => typeof listener.pid === "number" && listener.commandLine && classifyOpenClawArgv(parseWindowsNativeCommandLine(listener.commandLine) ?? [], {
		command: "gateway",
		pid: listener.pid
	}).kind === "openclaw" ? [listener.pid] : [])));
}
async function resolveScheduledTaskOwnedGatewayPids(env, context, installedCommand) {
	return (await resolveScheduledTaskGatewayOwnership(env, context, installedCommand))?.pids ?? [];
}
async function resolveScheduledTaskGatewayOwnership(env, context, installedCommand, captureExisting = false) {
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
	const port = context ? context.port : resolveScheduledTaskCommandPort(env, command);
	if (!port) return null;
	const ownerEnv = mergeGatewayServiceEnv(env, command);
	const owner = await retryScheduledTaskLeaseRead(() => readGatewayOwnerLease({ env: ownerEnv }));
	const taskName = resolveTaskName(env);
	const isTaskSupervisor = (supervisor) => supervisor?.kind === "schtasks" && supervisor.name?.toLowerCase() === taskName.toLowerCase();
	const hasCurrentProcessIdentity = (candidate) => candidate.state === "live" || candidate.state === "unknown" && candidate.host === hostname() && candidate.startedAt !== null && readWindowsProcessStartTimeSync(candidate.pid, 5e3, ownerEnv) === candidate.startedAt;
	const pids = owner ? owner.port === port && hasCurrentProcessIdentity(owner) && isTaskSupervisor(owner.supervisor) ? [owner.pid] : [] : await resolveLegacyScheduledTaskOwnedGatewayPids(env, context, command);
	if (captureExisting && owner && pids.length > 0) pids.push(...(await resolveLegacyScheduledTaskOwnedGatewayPids(env, context, command)).filter((pid) => pid !== owner.pid));
	const starts = /* @__PURE__ */ new Map();
	const changed = /* @__PURE__ */ new Error("Gateway owner changed before terminating the captured process");
	const matchesOwner = (current, pid) => owner && (pid !== owner.pid || hasCurrentProcessIdentity(current)) && current.owner === owner.owner && current.pid === owner.pid && current.port === owner.port && current.host === owner.host && current.startedAt === owner.startedAt && isTaskSupervisor(current.supervisor);
	return {
		owner,
		pids,
		changed,
		acquireTerminationExclusion() {
			if (process.platform === "win32" && starts.size === 0) for (const pid of pids) starts.set(pid, pid === owner?.pid ? owner.startedAt : readWindowsProcessStartTimeSync(pid, 5e3, ownerEnv));
			if (owner?.port === port && owner.state !== "dead" && owner.supervisor && !isTaskSupervisor(owner.supervisor)) {
				const { kind, name } = owner.supervisor;
				const label = kind === "external" ? "external supervisor" : `${kind} ${name}`;
				throw new Error(`Gateway pid ${owner.pid} on port ${port} belongs to ${label}, not Scheduled Task ${taskName}. Run that supervisor's stop or restart command; the Gateway was left running.`);
			}
			if (pids.length > 0 || owner && owner.state !== "dead") return null;
			const exclusion = tryAcquireGatewayStateOwner(resolveOpenClawStateSqlitePath(ownerEnv));
			if (!exclusion) throw new Error("Gateway lifecycle ownership is held without a published identity; leave it running and retry after startup finishes.");
			return exclusion;
		},
		assertOwnerCurrent(pid) {
			if (pid !== void 0 && starts.has(pid) && (starts.get(pid) === null || readWindowsProcessStartTimeSync(pid, 5e3, ownerEnv) !== starts.get(pid))) throw changed;
			const current = readGatewayOwnerLease({
				env: ownerEnv,
				current: true
			});
			if (!current && (pid === void 0 || !owner || starts.has(pid))) return;
			if (!current || !matchesOwner(current, pid)) throw changed;
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
	if (process.platform === "win32" && snapshot) {
		const gatewayPid = findInstalledGatewayChildPid(snapshot, port, installedArguments);
		if (gatewayPid) return [gatewayPid, ...snapshot.filter((entry) => getSnapshotProcessId(entry) !== gatewayPid).flatMap((row) => findInstalledGatewayChildPid([row], port, installedArguments) ?? [])];
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
		const argv = listener.commandLine ? parseWindowsNativeCommandLine(listener.commandLine) : process.platform === "win32" ? readWindowsProcessArgsSync(listener.pid) : null;
		if (!argv || parseTcpPortFromArgs(argv) !== port) continue;
		if (matchesInstalledProgramArguments(argv, installedArguments) || process.platform === "win32" && (matchesInstalledProgramArguments(argv, supervisorArguments) || matchesInstalledGatewayChildArguments(argv, installedArguments))) ownedPids.add(listener.pid);
	}
	return Array.from(ownedPids);
}
/** A completed native snapshot distinguishes no match from unavailable inspection. */
async function readBoundedScheduledTaskProcess(env, deadlineMs, installedCommand) {
	const remaining = () => {
		const value = deadlineMs - performance.now();
		if (!Number.isFinite(value) || value <= 0) throw new Error("Scheduled Task inspection deadline expired.");
		return value;
	};
	remaining();
	const command = installedCommand === void 0 ? await awaitWithinDeadline(() => readScheduledTaskCommand(env, { timeoutMs: remaining() }).catch((error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		return null;
	}), deadlineMs, () => performance.now()) : installedCommand;
	if (command === ABSOLUTE_DEADLINE_EXPIRED) throw new Error("Scheduled Task inspection deadline expired.");
	remaining();
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port || !command?.programArguments.length) return null;
	const snapshot = readWindowsProcessSnapshot(remaining());
	remaining();
	if (!snapshot || !snapshot.some((entry) => getSnapshotProcessId(entry) !== null)) return null;
	const pid = shouldManageGatewayListenerPort(env) ? findInstalledGatewayChildPid(snapshot, port, command.programArguments) : findInstalledProcessPid(snapshot, port, command.programArguments, isNodeHostArgv);
	const complete = pid !== null || isCompleteWindowsProcessSnapshot(snapshot);
	remaining();
	return complete ? {
		port,
		pid
	} : null;
}
async function resolveListenerBackedScheduledTaskRuntime(env, deadlineMs, installedCommand) {
	if (deadlineMs !== void 0) {
		const observed = await readBoundedScheduledTaskProcess(env, deadlineMs, installedCommand);
		return observed?.pid ? {
			status: "running",
			pid: observed.pid,
			detail: `Matching installed process detected for gateway port ${observed.port}.`
		} : null;
	}
	if (!shouldManageGatewayListenerPort(env)) {
		const matched = await resolveScheduledTaskNodeHostProcess(env, installedCommand);
		return matched ? {
			status: "running",
			pid: matched.pid,
			detail: `Node host process detected for gateway port ${matched.port}.`
		} : null;
	}
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch(() => null) : installedCommand;
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
async function terminateScheduledTaskGatewayListeners(env, context, assertCurrent, stop) {
	const windows = process.platform === "win32";
	const ownership = shouldManageGatewayListenerPort(env) ? await resolveScheduledTaskGatewayOwnership(env, context, void 0, true) : null;
	if (!ownership) {
		if (stop && windows && shouldManageGatewayListenerPort(env)) throw new Error("Gateway identity unavailable; stop refused and Gateway preserved.");
		await stop?.end();
		return [];
	}
	const exclusion = ownership.acquireTerminationExclusion();
	const resources = exclusion ? createOpenClawDatabaseMaintenanceScope({
		assertOwnerCurrent: exclusion.assertCurrent,
		assertDatabaseAccess: exclusion.assertDatabaseAccess
	}) : void 0;
	const terminate = async () => {
		const settle = stop && windows ? prepareScheduledTaskSettlement(resolveTaskName(env)) : null;
		try {
			const owner = ownership.owner;
			if (stop && windows && owner && ownership.pids.includes(owner.pid)) {
				let dispatched = false;
				try {
					const { callGatewayCli } = await import("./call-CWvmXO5x.mjs");
					await callGatewayCli({
						method: "gateway.stop.request",
						params: { target: {
							pid: owner.pid,
							ownerId: owner.owner,
							port: owner.port
						} },
						localPortOverride: owner.port,
						sharedStateMode: "read-only",
						allowLocalBackendAuthNone: true,
						requiredMethods: ["gateway.stop.request"],
						assertDispatchCurrent: () => {
							assertGatewayServiceUpdateCurrent();
							assertCurrent?.();
							ownership.assertOwnerCurrent(owner.pid);
							dispatched = true;
						}
					});
				} catch (error) {
					if (isGatewayProtocolResponseError(error)) dispatched = false;
				}
				await waitForProcessExit(owner.pid, dispatched ? GATEWAY_SERVICE_STOP_TIMEOUT_MS : 0);
			}
			if (stop && !windows) await stop.end();
			for (const pid of ownership.pids) {
				if (stop && windows && await waitForProcessExit(pid, 0)) continue;
				await retryScheduledTaskLeaseRead(() => ownership.assertOwnerCurrent(pid));
				await terminateGatewayProcessTree(pid, 300, () => {
					assertCurrent?.();
					ownership.assertOwnerCurrent(pid);
				});
			}
			if (stop && !exclusion) await retryScheduledTaskLeaseRead(ownership.assertOwnerCurrent);
		} catch (error) {
			if (!stop || !ownership.pids.length || !isScheduledTaskSqliteSharingError(error)) throw error;
			for (const pid of ownership.pids) if (!await waitForProcessExit(pid, 15e3)) throw new Error("Gateway still alive; refusing another state writer.", { cause: error });
			stop.onRecovery?.();
			stop.warn("SQLite owner inspection is locked after stop; continuing with the port check.");
		}
		if (ownership.pids.length > 0) stop?.onStopped?.();
		if (settle && stop) {
			const fact = await settle(() => {
				assertGatewayServiceUpdateCurrent();
				assertCurrent?.();
			}, stop.end);
			stop.onSettlement?.(fact);
			if (fact.status === "replaced") throw ownership.changed;
			if (fact.status === "unavailable") {
				if (!stop.restart || !ownership.pids.length) throw new Error("Task settlement unavailable; stop unverified.", { cause: fact });
				stop.warn("Task settlement unavailable after Gateway exit; attempting /Run.");
			}
		}
		return ownership.pids;
	};
	const errors = [];
	try {
		return await (resources ? resources.run(terminate) : terminate());
	} catch (error) {
		errors.push(error);
		if (!stop || error !== ownership.changed) throw error;
		stop.warn("Gateway replacement or unverified process preserved during stop.");
		return null;
	} finally {
		try {
			await resources?.close();
			exclusion?.release();
		} catch (error) {
			errors.push(error);
			throwSqliteLifecycleErrors(errors, "Scheduled Task stop and state cleanup failed");
		}
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
async function waitForProcessExit(pid, timeoutMs) {
	const probe = process.platform === "win32" ? probeWindowsTasklistProcessState : probeProcessState;
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
	if (await waitForProcessExit(pid, graceful.status === 0 && !graceful.error ? graceMs : 0)) return;
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
	if (!await waitForProcessExit(pid, WINDOWS_FORCED_PROCESS_EXIT_TIMEOUT_MS)) throw new Error(`gateway process ${pid} exit could not be confirmed after taskkill`);
}
async function waitForGatewayPortRelease(port, timeoutMs = 5e3, options) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if ((await inspectPortUsage(port, options?.probeHosts ? { probeHosts: options.probeHosts } : void 0).catch(() => null))?.status === "free") return true;
		await sleep(250);
	}
	return false;
}
//#endregion
//#region src/infra/gateway-processes.ts
function inspectGatewayProcess(pid, context) {
	try {
		const options = {
			...context,
			pid,
			command: "gateway"
		};
		const identity = classifyOpenClawArgv(readGatewayLockProcessCmdline(pid, process.platform, 1e3, void 0, context.env) ?? [], options);
		return identity.kind === "openclaw" || process.platform !== "win32" ? identity : classifyOpenClawArgv([], {
			...options,
			owner: readGatewayOwnerLease({
				...context,
				current: true
			})
		});
	} catch {
		return {
			kind: "unclassified",
			reason: "process ownership inspection failed"
		};
	}
}
/** Reinspect argv or current recorded ownership immediately before signaling. */
function signalVerifiedGatewayPidSync(pid, signal, context = {}) {
	if (inspectGatewayProcess(pid, context).kind !== "openclaw") throw new Error(`refusing to signal non-gateway process pid ${pid}`);
	try {
		process.kill(pid, signal);
	} catch (err) {
		if (err.code !== "ESRCH") throw err;
	}
}
/** Find listener PIDs on `port` and keep only verified gateway processes. */
function findVerifiedGatewayListenerPidsOnPortSync(port, context = {}) {
	const rawPids = process.platform === "win32" ? readWindowsListeningPidsOnPortSync(port) : findGatewayPidsOnPortSync(port);
	return uniqueValues(rawPids).filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid).filter((pid) => inspectGatewayProcess(pid, {
		...context,
		port
	}).kind === "openclaw");
}
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
async function isStartupEntryInstalled(env, deadlineMs, requireEffective = false) {
	if (deadlineMs !== void 0 && (!Number.isFinite(deadlineMs) || performance.now() >= deadlineMs)) throw new Error("Scheduled Task inspection deadline expired.");
	for (const startupEntryPath of resolveStartupEntryPaths(env)) {
		const installed = await awaitWithinDeadline(async () => {
			try {
				await fs$1.access(startupEntryPath);
				return true;
			} catch (error) {
				if (requireEffective && !hasErrnoCode(error, "ENOENT")) throw error;
				return false;
			}
		}, deadlineMs, () => performance.now());
		if (installed === ABSOLUTE_DEADLINE_EXPIRED) throw new Error("Scheduled Task inspection deadline expired.");
		if (installed) return true;
	}
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
		const remaining = deadline - Date.now();
		if (remaining <= 0) return false;
		const probe = probeScheduledTaskState(resolveTaskName(env), remaining);
		if (Date.now() >= deadline) return false;
		if (probe.status === "found" && probe.state === 4) return true;
		await sleep(250);
	}
}
async function isRegisteredScheduledTask(env) {
	try {
		return (await execSchtasks([
			"/Query",
			"/TN",
			resolveTaskName(env)
		])).code === 0;
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		return false;
	}
}
async function launchFallbackTaskScript(env, installedCommand, assertCurrent) {
	if (isUpdateOwnedGatewayServiceCommand()) throw new Error("UPDATE_NATIVE_AUTHORITY: update-owned native commands require Task Scheduler; standalone startup fallback is unsupported.");
	const scriptPath = resolveGatewayTaskScriptPath(env);
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
/** Inspect an exact login item without borrowing a same-name Scheduled Task's state. */
async function readStartupEntryState(startupEntryPath, args) {
	const deadline = args.timeoutMs === void 0 ? void 0 : performance.now() + args.timeoutMs;
	const capture = async () => {
		const contents = [];
		return {
			command: await readStartupEntryCommand(startupEntryPath, {
				deadline,
				onLauncherContent: (content) => contents.push(content)
			}),
			contents
		};
	};
	let command = null;
	let env = args.env ?? process.env;
	try {
		const captured = await capture();
		command = captured.command;
		env = mergeGatewayServiceEnv(env, command);
		args.validateEnvBeforeStatusRead?.(env);
		let runtime = await resolveFallbackRuntime(env, command, "control", deadline).catch((error) => createServiceRuntimeInspectionFailure(error, args.timeoutMs));
		if (!isDeepStrictEqual(await capture(), captured)) throw new Error("Startup launcher changed during runtime inspection.");
		if (deadline !== void 0 && performance.now() >= deadline) runtime = createServiceRuntimeInspectionFailure("Startup runtime inspection timed out.", args.timeoutMs);
		return {
			installed: true,
			loadState: { status: "loaded" },
			running: runtime.status === "running",
			env,
			command,
			runtime,
			...runtime.inspectionReason ? { inspectionReason: runtime.inspectionReason } : {}
		};
	} catch (error) {
		if (!(error instanceof ScheduledTaskInspectionError) || error.timeoutMs === void 0) throw error;
		const runtime = createServiceRuntimeInspectionFailure(error, args.timeoutMs);
		return {
			installed: command !== null,
			loadState: {
				status: "unknown",
				detail: runtime.inspectionFailure.detail
			},
			running: false,
			env,
			command,
			runtime,
			...runtime.inspectionReason ? { inspectionReason: runtime.inspectionReason } : {}
		};
	}
}
async function resolveFallbackRuntime(env, installedCommand, mode = "observe", deadlineMs) {
	const unknownRuntime = (detail) => ({
		status: "unknown",
		detail: `Startup-folder login item installed; ${detail}`
	});
	if (deadlineMs !== void 0) {
		const observed = await readBoundedScheduledTaskProcess(env, deadlineMs, installedCommand);
		if (observed && performance.now() < deadlineMs) {
			if (observed.pid) return {
				status: "running",
				pid: observed.pid,
				detail: `Matching installed process detected for gateway port ${observed.port}.`
			};
			if (!shouldManageGatewayListenerPort(env)) return {
				status: "stopped",
				detail: `Startup-folder login item installed; no node host process detected for gateway port ${observed.port}.`
			};
			const portState = readWindowsPortUsageSync(observed.port, deadlineMs - performance.now());
			if (performance.now() < deadlineMs && portState === "free") return {
				status: "stopped",
				detail: `Startup-folder login item installed; no gateway process or listener detected for port ${observed.port}.`
			};
		}
		return unknownRuntime("process ownership or port availability could not be verified within the inspection budget.");
	}
	const command = installedCommand === void 0 ? await readScheduledTaskCommand(env).catch((error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		return null;
	}) : installedCommand;
	const port = resolveScheduledTaskCommandPort(env, command);
	if (!port) return unknownRuntime(shouldManageGatewayListenerPort(env) ? "gateway port unknown." : "node gateway port unknown.");
	const installedArguments = command?.programArguments;
	if (!shouldManageGatewayListenerPort(env)) {
		const snapshot = readWindowsProcessSnapshot();
		if (!snapshot) return unknownRuntime(`could not inspect node host process for gateway port ${port}.`);
		const pid = installedArguments?.length ? findInstalledProcessPid(snapshot, port, installedArguments, isNodeHostArgv) : null;
		return {
			status: pid ? "running" : "stopped",
			...pid ? { pid } : {},
			detail: `Startup-folder login item installed; ${pid ? "" : "no "}node host process detected for gateway port ${port}.`
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
		if (!installedArguments?.length) return unknownRuntime(`persisted command unavailable for gateway port ${port}.`);
		if (!snapshot) return unknownRuntime(`could not verify the installed process for gateway port ${port}.`);
	}
	const probeHosts = await resolveGatewayServiceProbeHosts({
		env,
		command
	});
	const diagnostics = await inspectPortUsage(port, { probeHosts }).catch((error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		return null;
	});
	if (!diagnostics) return unknownRuntime(`could not inspect port ${port}.`);
	if (diagnostics.status !== "busy") {
		const status = diagnostics.status === "free" && !(shouldInspectProcess && !snapshot) ? "stopped" : "unknown";
		return {
			status,
			detail: status === "unknown" && diagnostics.status === "free" ? `Startup-folder login item installed; no listener detected on port ${port}, but process inspection was unavailable.` : `Startup-folder login item installed; no gateway listener detected on port ${port}.`
		};
	}
	const matchedGatewayPids = resolveGatewayListenerPids(diagnostics.listeners);
	const scopedListenerPids = new Set(diagnostics.listeners.map((listener) => listener.pid));
	const verifiedGatewayPids = findVerifiedGatewayListenerPidsOnPortSync(port, { env: mergeGatewayServiceEnv(env, command) }).filter((pid) => scopedListenerPids.has(pid));
	const ownedGatewayPids = matchedGatewayPids.length > 0 ? matchedGatewayPids : verifiedGatewayPids;
	if (ownedGatewayPids.length > 0) return requireCommandOwnership ? unknownRuntime(`gateway listener on port ${port} does not match the persisted command.`) : {
		status: "running",
		pid: ownedGatewayPids[0],
		detail: `Startup-folder login item installed; verified gateway listener detected on port ${port}.`
	};
	return unknownRuntime(`port ${port} is busy, but the listener is not a verified gateway process.`);
}
function isScheduledTaskDefinitelyNotRunning(taskName) {
	const probe = probeScheduledTaskState(taskName, 5e3);
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
		runtime = await resolveFallbackRuntime(env, installedCommand, "control").catch((err) => {
			if (hasCommandProcessCleanupError(err)) throw err;
			return {
				status: "unknown",
				detail: `Could not re-inspect the existing Windows login item: ${String(err)}`
			};
		});
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
	const timeoutMs = args.timeoutMs ?? 6e4;
	const deadlineMs = performance.now() + timeoutMs;
	const probe = probeScheduledTaskState(resolveTaskName(effectiveEnv), timeoutMs);
	if (probe.status === "unknown") throw new ScheduledTaskInspectionError(probe);
	assertTaskInspectionDeadline(deadlineMs);
	return probe.status === "found" || await isStartupEntryInstalled(effectiveEnv, deadlineMs, args.requireEffective);
}
async function readScheduledTaskRuntime(env = process.env, opts) {
	const deadlineMs = opts?.timeoutMs === void 0 ? void 0 : performance.now() + opts.timeoutMs;
	const probe = probeScheduledTaskState(resolveTaskName(env), opts?.timeoutMs);
	if (probe.status === "missing") return await isStartupEntryInstalled(env, deadlineMs, opts?.requireEffective) ? resolveFallbackRuntime(env, void 0, "observe", deadlineMs) : {
		status: "stopped",
		missingUnit: true
	};
	if (probe.status === "unknown") return {
		...createServiceRuntimeInspectionFailure(probe.detail, probe.timeoutMs),
		missingUnit: false
	};
	const status = probe.state === 4 ? "running" : probe.state === 1 || probe.state === 3 ? "stopped" : "unknown";
	const observedRuntime = await resolveListenerBackedScheduledTaskRuntime(env, deadlineMs, opts?.requireLoaded ? await readScheduledTaskCommand(env, {
		...opts,
		timeoutMs: deadlineMs === void 0 ? void 0 : deadlineMs - performance.now()
	}) : void 0);
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
	const readLaunchObservation = async (timeoutMs) => {
		const runtime = await readScheduledTaskRuntime(params.env, { timeoutMs }).catch(() => null);
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
		return findInstalledProcessPid(entries, taskPort, installedArguments, manageGatewayPort ? (argv) => classifyOpenClawArgv(argv, { command: "gateway" }).kind === "openclaw" : isNodeHostArgv) != null;
	};
	let previous = await readLaunchObservation();
	if (previous.state !== "not-yet-run" && previous.state !== "stopped-success") return false;
	const deadline = Date.now() + SCHEDULED_TASK_FALLBACK_TIMEOUT_MS;
	while (Date.now() < deadline) {
		await sleep(250);
		const current = await readLaunchObservation(5e3);
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
			await params.beforeMutation?.("restore");
			params.assertCurrent?.("restore");
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
		assertCurrent: (phase) => {
			assertNative();
			assertCaller?.(phase);
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
async function stopScheduledTask(params) {
	const env = params.env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(params.onMutation);
	if (await shouldControlStartupEntry(env)) {
		await stopStartupEntry(env, params.stdout, () => reportMutation("startup-entry-stop"), params.assertCurrent);
		return;
	}
	const replaced = await stopRegisteredScheduledTask({
		...params,
		env,
		onEndMutation: () => reportMutation("schtasks-stop")
	});
	params.stdout.write(`${formatLine(replaced ? "Preserved replacement Gateway" : "Stopped Scheduled Task", resolveTaskName(env))}\n`);
}
async function stopRegisteredScheduledTask({ env, stdout, assertCurrent, warn, onEndMutation, restart = false, onSettlement, onRecovery }) {
	const taskName = resolveTaskName(env);
	const manageGatewayPort = shouldManageGatewayListenerPort(env);
	const stopContext = manageGatewayPort ? await resolveScheduledTaskGatewayContext(env) : null;
	const stopPort = stopContext?.port ?? null;
	const terminated = await terminateScheduledTaskGatewayListeners(env, stopContext ?? void 0, assertCurrent, {
		warn: warn ?? ((message) => stdout.write(`Warning: ${message}\n`)),
		onStopped: onEndMutation,
		restart,
		onSettlement,
		onRecovery,
		end: async () => {
			assertCurrent?.();
			const res = await execSchtasks([
				"/End",
				"/TN",
				taskName
			]);
			if (!restart && res.code !== 0 && !isScheduledTaskDefinitelyNotRunning(taskName)) throw new Error(`schtasks end failed: ${res.stderr || res.stdout}`.trim());
			if (!restart || res.code === 0) onEndMutation?.();
		}
	});
	if (!manageGatewayPort) {
		await terminateScheduledTaskNodeHost(env, assertCurrent);
		await terminateInstalledStartupRuntime(env, assertCurrent);
	}
	if (terminated !== null && stopPort) {
		const probeHosts = stopContext?.probeHosts ?? [];
		if (!await waitForGatewayPortRelease(stopPort, 5e3, { probeHosts })) {
			const listenerDetails = await describeUnverifiedPortListeners(stopPort, probeHosts);
			throw new Error(`gateway port ${stopPort} is still busy ${restart ? "before restart" : "after stop"}; remaining listener ownership could not be verified.${listenerDetails}`);
		}
	}
	return terminated === null;
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
	const policy = preserveAutoStart ? null : probeScheduledTaskState(taskName);
	if (policy?.status === "unknown") throw new ScheduledTaskInspectionError(policy);
	if (policy?.status === "missing") throw new Error("Selected Scheduled Task registration is unavailable.");
	if (policy?.status === "found" && policy.enabled === false) {
		const serviceKind = shouldManageGatewayListenerPort(effectiveEnv) ? "gateway" : "node";
		const readSelectedCommand = async () => {
			const paths = [];
			const command = await readScheduledTaskCommand(effectiveEnv, {
				requireEffective: true,
				requireLoaded: true,
				onLauncherContent: (_content, sourcePath) => paths.push(sourcePath)
			});
			if (!command) throw new Error("Selected Scheduled Task command is unavailable; refusing to enable it.");
			const classified = classifyOpenClawArgv(command.programArguments, {
				command: serviceKind,
				cwd: command.workingDirectory,
				requirePackageIdentity: true
			});
			if (classified.kind === "openclaw" && classified.packageIdentity) paths.push(classified.packageIdentity.entrypoint, path.join(classified.packageIdentity.root, "package.json"));
			else {
				const wrapper = resolveEnvironmentValue(command.environment, OPENCLAW_WRAPPER_ENV_KEY, "win32")?.trim();
				const executable = command.programArguments[0] ?? "";
				const selectedCommand = getRootOptionAwareCommandPath(["node", ...command.programArguments], 1)[0];
				if (!wrapper || !path.win32.isAbsolute(wrapper) || path.win32.parse(wrapper).root.length === 1 || path.win32.normalize(wrapper).toLowerCase() !== path.win32.normalize(executable).toLowerCase() || selectedCommand !== serviceKind) throw new Error("Selected Scheduled Task is not the requested OpenClaw service; refusing to enable it.");
				await resolveOpenClawWrapperPath(wrapper);
				paths.push(wrapper);
			}
			return {
				...command,
				definitionPaths: [.../* @__PURE__ */ new Set([...command.definitionPaths ?? [], ...paths])]
			};
		};
		const before = await fingerprintGatewayServiceDefinition(await readSelectedCommand());
		const assertSelected = async () => {
			if (await fingerprintGatewayServiceDefinition(await readSelectedCommand()) !== before) throw new Error("Selected Scheduled Task command changed before start.");
			assertCurrent?.();
		};
		await changeScheduledTaskEnabledState({
			env: effectiveEnv,
			enabled: true,
			beforeMutation: assertSelected,
			assertCurrent
		});
		reportMutation("enable");
		await assertSelected();
	}
	await runScheduledTaskOrThrow({
		taskName,
		assertCurrent,
		allowFallback: preserveAutoStart !== true,
		env: effectiveEnv,
		scriptPath: resolveGatewayTaskScriptPath(effectiveEnv),
		onMutation: () => reportMutation("schtasks-start")
	});
	stdout.write(`${formatLine("Started Scheduled Task", taskName)}\n`);
}
async function restartRegisteredScheduledTask(params) {
	const facts = {};
	const taskName = resolveTaskName(params.env);
	if (params.mode.kind === "standard") {
		if (await stopRegisteredScheduledTask({
			...params,
			restart: true,
			onSettlement: (fact) => facts.taskSettlement = fact,
			onRecovery: () => facts.restartRecovery = "sqlite-owner-read"
		})) throw Object.assign(/* @__PURE__ */ new Error("Gateway ownership changed; restart unverified."), facts);
	} else {
		const { port, probeHosts } = shouldManageGatewayListenerPort(params.env) ? await resolveScheduledTaskGatewayContext(params.env) : {
			port: null,
			probeHosts: []
		};
		params.assertCurrent?.();
		if ((await execSchtasks([
			"/End",
			"/TN",
			taskName
		])).code === 0) params.onEndMutation?.();
		const replacementRuntime = await resolveFallbackRuntime(params.env, void 0, "control");
		if (replacementRuntime.status === "unknown") throw new Error(replacementRuntime.detail ?? "Could not verify the replacement Windows Scheduled Task process.");
		if (replacementRuntime.status === "running" && replacementRuntime.pid) await terminateGatewayProcessTree(replacementRuntime.pid, 300, params.assertCurrent);
		if (port && !await waitForGatewayPortRelease(port, 5e3, { probeHosts })) throw new Error(`replacement gateway port ${port} is occupied by an unverified process`);
	}
	const activation = await runScheduledTaskOrThrow({
		taskName,
		assertCurrent: params.assertCurrent,
		env: params.env,
		scriptPath: resolveGatewayTaskScriptPath(params.env),
		...params.onRunMutation ? { onMutation: params.onRunMutation } : {}
	}).catch((error) => {
		throw Object.assign(toErrorObject(error, "Scheduled Task restart failed."), facts);
	});
	if (facts.taskSettlement?.status === "unavailable") throw Object.assign(/* @__PURE__ */ new Error("/Run accepted; restart unverified: task settlement unavailable."), facts);
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
	return {
		outcome: "completed",
		...facts
	};
}
async function restartScheduledTask({ preserveDefinition, stdout, env, onMutation, assertCurrent, warn }) {
	const effectiveEnv = env ?? process.env;
	const reportMutation = createGatewayLifecycleMutationReporter(onMutation);
	if (await shouldControlStartupEntry(effectiveEnv)) return restartStartupEntry(effectiveEnv, stdout, (kind) => reportMutation(kind === "stop" ? "startup-entry-stop" : "startup-entry-restart"), assertCurrent);
	return restartRegisteredScheduledTask({
		warn,
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
				if (matchesServiceFilePublication(current, prepared)) {
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
	const scriptPath = resolveGatewayTaskScriptPath(taskEnv);
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
	let updating = params.registration?.registered ?? await isRegisteredScheduledTask(params.env);
	if (updating && !params.definitionTransaction) {
		assertGatewayServiceUpdateCurrent();
		const change = await execSchtasks([
			"/Change",
			"/TN",
			taskName,
			"/TR",
			quotedLaunchPath
		]);
		if (change.code === 124) {
			params.registration?.retainRecovery();
			throw new Error("Scheduled Task registration change did not confirm completion.");
		}
		updating = change.code === 0;
	}
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
		if (create.code === 124) {
			params.registration?.retainRecovery();
			throw new Error("Scheduled Task registration did not confirm completion.");
		}
		if (create.code !== 0 && updating) {
			const detail = (create.stderr || create.stdout).trim() || "unknown error";
			if (params.definitionTransaction) throw new Error(`Scheduled Task definition upgrade failed: ${detail}`);
			params.warn?.(`Scheduled Task ${taskName} launch command was refreshed, but XML settings (including battery settings) were not: ${detail}. Inspect Task Scheduler and retry the service installation to refresh those settings.`);
		} else if (create.code === 0) await params.definitionTransaction?.taskWritten(expectedXml);
	} finally {
		await fs$1.rm(path.dirname(xmlPath), {
			recursive: true,
			force: true
		}).catch(() => {});
	}
	if (create.code !== 0 && !updating) {
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
		label: updating ? "Updated Scheduled Task" : "Installed Scheduled Task",
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
		if (!args.definitionTransaction) restoreTask = await backupScheduledTaskDefinition(activationEnv, resolveGatewayTaskScriptPath(resolveScheduledTaskRenderEnv(args.env, args.environment)));
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
	const scriptPath = resolveGatewayTaskScriptPath(env);
	const parsedScriptPath = path.parse(scriptPath);
	const launcherPath = path.join(parsedScriptPath.dir, `${parsedScriptPath.name}.vbs`);
	if (launcherPath !== scriptPath) try {
		await fs$1.unlink(launcherPath);
		stdout.write(`${formatLine("Removed task launcher", launcherPath)}\n`);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	for (const backupPath of uniqueStrings([
		`${scriptPath}.bak`,
		`${scriptPath}.task.xml.bak`,
		`${launcherPath}.bak`
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
async function assertReplacementPortAvailableForTakeover(params) {
	if (!shouldManageGatewayListenerPort(params.env)) return;
	const command = {
		programArguments: params.programArguments,
		environment: Object.fromEntries(Object.entries(params.environment ?? {}).filter((entry) => typeof entry[1] === "string"))
	};
	const port = resolveScheduledTaskCommandPort(params.env, command);
	if (!port) throw new Error("Could not verify the replacement Windows Scheduled Task port.");
	const probeHosts = await resolveGatewayServiceProbeHosts({
		env: params.env,
		command
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
export { resolveNodeProgramArguments as C, resolveGatewayProgramArguments as S, ScheduledTaskAutoStartRecoveryError as T, readWindowsStartupFallbackRuntimeForUpdate as _, restartScheduledTask as a, signalVerifiedGatewayPidSync as b, setScheduledTaskXmlEnabled as c, suspendScheduledTaskAutoStartForUpdate as d, isScheduledTaskDefinitelyNotRunning as f, readStartupEntryState as g, readScheduledTaskRuntime as h, readScheduledTaskDefinition as i, startScheduledTask as l, isScheduledTaskInstalled as m, stageScheduledTask as n, restoreScheduledTaskDefinition as o, isScheduledTaskEnabled as p, uninstallScheduledTask as r, resumeScheduledTaskAutoStartAfterUpdate as s, installScheduledTask as t, stopScheduledTask as u, findVerifiedGatewayListenerPidsOnPortSync as v, resolveOpenClawWrapperPath as w, OPENCLAW_WRAPPER_ENV_KEY as x, formatGatewayPidList as y };

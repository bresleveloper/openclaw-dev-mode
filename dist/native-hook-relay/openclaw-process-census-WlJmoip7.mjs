import { D as escapeRegExp } from "./redact-tYkqLD33.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-B0Qv4xHQ.mjs";
import { t as createSubsystemLogger } from "./subsystem-Y9GXTYwe.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as resolveRuntimeScriptPosition, t as isBunRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { t as readProcessGroupMembers } from "./service-child-group-ownership-BhyJ_XSS.mjs";
import { a as referencesRetainedArtifact, i as readProcessWorkingDirectories, n as classifyOpenClawEntrypointPath, o as getRootOptionAwareCommandPath, r as readProcessPackageIdentity, s as parseWindowsNativeCommandLine, t as classifyOpenClawArgv } from "./gateway-process-argv-5BlLLUnW.mjs";
import fsSync from "node:fs";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import os from "node:os";
import { listProcesses, readProcessCommand } from "@openclaw/proc-safe/inspect";
//#region src/infra/container-environment.ts
let containerEnvironmentCache;
function isContainerEnvironment() {
	return containerEnvironmentCache ??= detectContainerEnvironment();
}
function detectContainerEnvironment() {
	if (process.env.FLY_MACHINE_ID?.trim() && process.env.FLY_APP_NAME?.trim()) return true;
	for (const sentinelPath of [
		"/.dockerenv",
		"/run/.containerenv",
		"/var/run/.containerenv"
	]) try {
		fsSync.accessSync(sentinelPath, fsSync.constants.F_OK);
		return true;
	} catch {}
	try {
		const cgroup = fsSync.readFileSync("/proc/1/cgroup", "utf8");
		if (/\/docker\/|cri-containerd-[0-9a-f]|containerd\/[0-9a-f]{64}|\/kubepods[/.]|\blxc\b/.test(cgroup)) return true;
	} catch {}
	return false;
}
//#endregion
//#region src/process/supervisor/darwin-process-command.ts
let reportedForeignArguments = false;
/** Exact argv, or observed foreign ownership when Darwin denies argument inspection.
* Callers that never consult the service marker skip the environment: some macOS
* argument images end without the separator that bounds it. */
function readDarwinProcessCommand(pid, owner, options = {}) {
	try {
		const command = readProcessCommand(pid, options.serviceMarker === false ? {} : { environmentKeys: ["OPENCLAW_SERVICE_MARKER"] });
		if (!command) return;
		const serviceMarker = command.environment.OPENCLAW_SERVICE_MARKER;
		return {
			argv: [...command.argv],
			executable: command.executable,
			...serviceMarker === void 0 ? {} : { serviceMarker }
		};
	} catch (cause) {
		if (!(cause instanceof ProcSafeError)) throw cause;
		if (cause.code === "unsupported-platform" && process.platform === "darwin") throw new Error("Cannot inspect Darwin process arguments under Rosetta; run OpenClaw with native arm64 Node.js.", { cause });
		if (cause.code !== "access-denied" && cause.code !== "operation-failed") throw cause;
		if (isPidDefinitelyDead(pid)) return;
		if (owner === "different") {
			if (!reportedForeignArguments) {
				reportedForeignArguments = true;
				createSubsystemLogger("process/census").debug("Unreadable Darwin arguments for another UID do not establish capture custody.", {
					pid,
					code: cause.code
				});
			}
			return {
				argvUnavailable: true,
				owner
			};
		}
		throw new Error(`Could not classify PID ${pid}: cannot inspect Darwin arguments (${cause.code}).`, { cause });
	}
}
//#endregion
//#region src/shared/rosetta-translation.ts
let translated;
/**
* Whether this x86_64 Darwin process is running under Rosetta.
*
* Darwin process-argument inspection remains unavailable under translation in
* proc-safe. The census uses this fact to name the supported native runtime.
*/
function isRosettaTranslatedProcess() {
	if (process.platform !== "darwin" || process.arch !== "x64") return false;
	translated ??= os.cpus()[0]?.model.includes("Apple") === true;
	return translated;
}
//#endregion
//#region src/infra/windows-process-census.ts
/** Missing fields never establish absence for same-user or unknown-owner work. */
function readWindowsProcessCensus(timeoutMs) {
	return listProcesses({
		timeoutMs,
		includeCommand: true
	}).flatMap(({ pid, owner, identity, command }) => {
		if (pid === 0 || pid === 4 || identity?.exited) return [];
		return [{
			pid,
			...identity ? {
				parentPid: identity.parentPid,
				startIdentity: String(Math.floor(identity.startTimeMicros / 1e3))
			} : {},
			...command?.commandLine === void 0 ? {} : { commandLine: command.commandLine },
			...command?.cwd === void 0 ? {} : { cwd: command.cwd },
			...owner === "different" ? { foreignOwner: true } : {}
		}];
	});
}
//#endregion
//#region src/infra/openclaw-process-census.ts
const workerEntrypoints = Object.values(runtimeProcessEntrypoints).flatMap((entry) => [path.posix.normalize(`src/infra/${entry.sourceWorkerName}.ts`), `dist/${entry.distWorkerPath}`]);
function isStandardSystemdUserManager(command) {
	return command !== void 0 && "argv" in command && command.argv.length === 2 && command.argv[1] === "--user" && (command.argv[0] === "/usr/lib/systemd/systemd" || command.argv[0] === "/lib/systemd/systemd");
}
function isStandardSystemdLoginProcess(command, parentCommand, inspectorUid) {
	if (process.platform !== "linux" || inspectorUid === void 0 || command?.uid !== inspectorUid || !("argv" in command)) return false;
	return isStandardSystemdUserManager(command) || command.argv.length === 1 && command.argv[0] === "(sd-pam)" && parentCommand?.uid === command.uid && isStandardSystemdUserManager(parentCommand);
}
function classifyProcessArtifactCustody(command, pid, cwd, parentCommand) {
	try {
		const argv = command && "argv" in command ? command.argv : [];
		if ([...argv, cwd ?? ""].some(referencesRetainedArtifact)) return { kind: "holder" };
		if (!command) throw new Error("process command is unavailable");
		if ("argvUnavailable" in command || command.argv.length === 0) return { kind: "non-holder" };
		const { serviceMarker } = command;
		const options = {
			pid,
			cwd: cwd ?? "",
			serviceMarker,
			additionalEntrypoints: workerEntrypoints,
			inspectPackage: true
		};
		const identity = classifyOpenClawArgv(argv, options);
		if (identity.kind === "openclaw") return { kind: "holder" };
		if (identity.kind === "unclassified" && identity.cause !== "runtime-syntax") throw new Error(identity.reason);
		const { position, operands } = resolveRuntimeScriptPosition(argv);
		if (!cwd || !path.isAbsolute(cwd)) {
			const inspectorUid = process.getuid?.();
			if (cwd === void 0 && identity.kind === "other" && typeof position !== "number" && position.kind === "not-runtime" && (command.owner === "different" || command.uid !== void 0 && inspectorUid !== void 0 && command.uid !== inspectorUid || isStandardSystemdLoginProcess(command, parentCommand, inspectorUid))) return { kind: "non-holder" };
			throw new Error("working directory is unavailable");
		}
		if (typeof position !== "number" && position.kind === "not-runtime") return { kind: "non-holder" };
		let scripts = {};
		if (typeof position !== "number") {
			const pkg = readProcessPackageIdentity(cwd, true);
			if (pkg.name === "openclaw") return { kind: "holder" };
			scripts = pkg.scripts;
		}
		for (const { value, module } of operands) {
			let candidate = value;
			if (module) {
				if (value.startsWith("file:")) candidate = fileURLToPath(value);
				else if (!path.isAbsolute(value) && !value.startsWith("./") && !value.startsWith("../")) throw new Error("runtime module package identity is unavailable");
			} else if (isBunRuntime(argv[0] ?? "") && !/[\\/]/u.test(value) && !path.extname(value) && typeof scripts[value] === "string" && scripts[value].trim()) continue;
			const evidence = classifyOpenClawEntrypointPath(candidate, options);
			if (evidence.kind === "unclassified") throw new Error(evidence.reason);
			if (evidence.kind === "openclaw") return { kind: "holder" };
		}
		return { kind: "non-holder" };
	} catch (error) {
		return {
			kind: "unresolved",
			reason: error instanceof Error ? error.message : String(error)
		};
	}
}
function inspectOtherOpenClawProcesses(handoff) {
	const result = {
		matchingPids: [],
		unverifiedPids: []
	};
	try {
		if (process.platform === "linux" && isContainerEnvironment()) throw new Error("Host process visibility cannot be established from this container. Run Doctor on the host after stopping OpenClaw containers that share its temporary directory.");
		const windows = process.platform === "win32";
		const deadline = Date.now() + (handoff ? 15e3 : 1e3);
		const native = windows && handoff ? [...readWindowsProcessCensus(15e3)] : void 0;
		const nativeByPid = new Map(native?.map((entry) => [entry.pid, entry]));
		const processes = native?.map(({ pid, parentPid, commandLine }) => {
			const argv = commandLine ? parseWindowsNativeCommandLine(commandLine) : null;
			return {
				pid,
				state: "",
				command: argv?.length && parentPid !== void 0 ? {
					ppid: parentPid,
					argv
				} : void 0
			};
		}) ?? [...readProcessGroupMembers(handoff ? 15e3 : 1e3, { readDarwinCommand: handoff ? (pid, owner) => readDarwinProcessCommand(pid, owner, { serviceMarker: false }) : readDarwinProcessCommand })];
		const byPid = new Map(processes.map((entry) => [entry.pid, entry]));
		const current = byPid.get(process.pid);
		if (!current || !handoff && processes.some((entry) => !entry.command || process.platform === "linux" && !("argv" in entry.command))) throw new Error("OpenClaw process census is incomplete.");
		const directories = native ? new Map(native.map(({ pid, cwd }) => [pid, cwd])) : readProcessWorkingDirectories(processes.map(({ pid }) => pid));
		const launchers = /* @__PURE__ */ new Set();
		const ancestors = /* @__PURE__ */ new Set([process.pid]);
		let child = current;
		let parentPid = current.command?.ppid ?? 0;
		while (parentPid > 0) {
			const parent = byPid.get(parentPid);
			if (!parent?.command || ancestors.has(parentPid)) {
				if (handoff) break;
				throw new Error("OpenClaw process ancestry is incomplete.");
			}
			const parentStart = nativeByPid.get(parentPid)?.startIdentity;
			const childStart = nativeByPid.get(child.pid)?.startIdentity;
			if (windows && (!parentStart || !childStart || BigInt(parentStart) >= BigInt(childStart))) break;
			ancestors.add(parentPid);
			if ("argv" in parent.command) {
				const { argv, serviceMarker } = parent.command;
				const identity = classifyOpenClawArgv(argv, {
					pid: parentPid,
					serviceMarker,
					cwd: directories.get(parentPid) ?? "",
					additionalEntrypoints: workerEntrypoints
				});
				if (identity.kind === "openclaw" && identity.entryIndex !== void 0 && getRootOptionAwareCommandPath(["node", ...argv.slice(identity.entryIndex)], 1)[0] === (handoff ? "update" : "doctor")) launchers.add(parentPid);
			}
			child = parent;
			parentPid = parent.command.ppid;
		}
		const normalize = (value) => windows ? value.replaceAll("\\", "/").replace(/\/{2,}\?\/UNC\//gi, "//").replace(/\/{2,}\?\//g, "").replace(/\/{2,}/g, "/").toLowerCase() : value;
		const paths = handoff?.artifactPaths.flatMap((value) => [value.replace(/[\\/]+$/, ""), pathToFileURL(value, { windows }).href]) ?? [];
		const literal = (value) => escapeRegExp(normalize(value));
		const matches = new RegExp(`(?:^|[^\\w-])(?:${literal(handoff?.runId ?? "")}(?=$|[^\\w-])|(?:${paths.map(literal).join("|") || "(?!)"})(?=$|[/\\s"'\x60);,\\]]))`);
		for (const { pid, state, command } of processes) {
			if (handoff && Date.now() >= deadline) throw new Error("Process census deadline exceeded");
			if (pid === process.pid || launchers.has(pid)) continue;
			if ((state?.startsWith("Z") || handoff) && isPidDefinitelyDead(pid)) continue;
			const argv = command && "argv" in command ? command.argv : void 0;
			if (handoff) {
				if (!windows && argv?.length === 0) continue;
				const observation = nativeByPid.get(pid);
				const cwd = directories.get(pid);
				if ([
					...argv ?? [],
					observation?.commandLine ?? "",
					cwd ?? ""
				].some((value) => matches.test(normalize(value)))) {
					result.matchingPids.push(pid);
					continue;
				}
				const inspectorUid = process.getuid?.();
				const foreign = observation?.foreignOwner || command?.owner === "different" || command?.uid !== void 0 && inspectorUid !== void 0 && command.uid !== inspectorUid;
				if ((!argv || cwd === void 0) && !foreign && !isStandardSystemdLoginProcess(command, byPid.get(command?.ppid ?? 0)?.command, inspectorUid)) {
					result.unverifiedPids.push(pid);
					if (windows) result.error = "Retry update repair as Administrator using the same Windows account.";
				}
				continue;
			}
			const custody = classifyProcessArtifactCustody(command, pid, directories.get(pid), byPid.get(command?.ppid ?? 0)?.command);
			if (custody.kind === "unresolved") throw new Error(`Could not classify PID ${pid}: ${custody.reason}`);
			if (custody.kind === "holder") result.matchingPids.push(pid);
		}
	} catch (error) {
		const pid = /Could not classify PID (\d+):/.exec(error instanceof Error ? error.message : "");
		if (handoff && pid) result.unverifiedPids.push(Number(pid[1]));
		result.error = !handoff ? `Could not inspect OpenClaw processes: ${String(error)}` : isRosettaTranslatedProcess() ? "Host process census is unavailable under Rosetta; run openclaw update repair with native arm64 Node.js." : "Host process census is incomplete; verify process-inspection permissions and retry update repair.";
	}
	return handoff ? result : result.error ? { error: result.error } : { pids: result.matchingPids };
}
//#endregion
export { inspectOtherOpenClawProcesses };

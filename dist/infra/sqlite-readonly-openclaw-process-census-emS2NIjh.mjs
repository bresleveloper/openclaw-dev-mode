import { gt as normalizeLowercaseStringOrEmpty, k as escapeRegExp, rt as extractErrorCode, t as createSubsystemLogger, wt as isRecord } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { O as readProcessGroupMembers } from "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { a as runtimeProcessEntrypoints, n as isNodeRuntime, r as resolveRuntimeScriptPosition, t as isBunRuntime } from "./sqlite-readonly-runtime-binary-aVOs5Y3K.mjs";
import { at as isPidDefinitelyDead, st as resolveDiagnosticProcessEnv } from "./sqlite-readonly-location.worker.js";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { ProcSafeError } from "@openclaw/proc-safe/errors";
import { listProcesses, readProcessCommand } from "@openclaw/proc-safe/inspect";
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
//#region src/process/windows-command-line.ts
/** Parse an Arguments field; it does not contain the executable's special first token. */
function parseWindowsNativeArguments(value) {
	const args = [];
	let index = 0;
	while (index < value.length) {
		while (/[ \t]/.test(value.charAt(index))) index++;
		if (index === value.length) break;
		let argument = "";
		let quoted = false;
		while (index < value.length) {
			let backslashes = 0;
			while (value[index] === "\\") {
				backslashes++;
				index++;
			}
			if (value[index] === "\"") {
				argument += "\\".repeat(Math.floor(backslashes / 2));
				if (backslashes % 2 === 1) {
					argument += "\"";
					index++;
				} else if (quoted && value[index + 1] === "\"") {
					argument += "\"";
					index += 2;
				} else {
					quoted = !quoted;
					index++;
				}
				continue;
			}
			argument += "\\".repeat(backslashes);
			if (index === value.length || !quoted && /[ \t]/.test(value.charAt(index))) break;
			argument += value.charAt(index++);
		}
		args.push(argument);
	}
	return args;
}
/** Parse a native process command line; argv[0] preserves backslashes before quotes. */
function parseWindowsNativeCommandLine(value) {
	if (value.includes("\0")) return null;
	let index = 0;
	while (/[ \t]/.test(value.charAt(index))) index++;
	if (index === value.length) return [];
	let executable = "";
	let quoted = false;
	while (index < value.length && (quoted || !/[ \t]/.test(value.charAt(index)))) {
		const character = value.charAt(index++);
		if (character === "\"") quoted = !quoted;
		else executable += character;
	}
	if (quoted || !executable) return null;
	return [executable, ...parseWindowsNativeArguments(value.slice(index))];
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
const ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
const ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set([
	"--profile",
	"--log-level",
	"--container"
]);
/** Returns whether a token can be consumed as a root option value. */
function isValueToken(arg) {
	if (!arg || arg === "--") return false;
	if (!arg.startsWith("-")) return true;
	return /^-\d+(?:\.\d+)?$/.test(arg);
}
/** Consume required root values by their Commander role before startup policy is selected. */
function consumeRootCommandOptionToken(args, index) {
	return consumeKnownOptionToken(args, index, ROOT_BOOLEAN_FLAGS, ROOT_VALUE_FLAGS, "command-path");
}
/** Read positional command tokens while accepting root options at any pre-terminator position. */
function getRootOptionAwareCommandPath(argv, depth) {
	const args = argv.slice(2);
	const path = [];
	let literal = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg) break;
		if (!literal && arg === "--") {
			if (path.length > 0) break;
			literal = true;
			continue;
		}
		const consumed = literal ? 0 : consumeRootCommandOptionToken(args, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (!literal && arg.startsWith("-")) continue;
		path.push(arg);
		if (path.length >= depth) break;
	}
	return path;
}
function consumeKnownOptionToken(args, index, booleanFlags, valueFlags, mode) {
	const arg = args[index];
	if (!arg || arg === "--" || !arg.startsWith("-")) return 0;
	const equalsIndex = arg.indexOf("=");
	const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
	if (booleanFlags.has(flag)) return equalsIndex === -1 ? 1 : 0;
	if (!valueFlags.has(flag)) return 0;
	if (equalsIndex !== -1) return mode === "command-path" || arg.slice(equalsIndex + 1).trim() ? 1 : 0;
	if (mode === "command-path") return args[index + 1] !== void 0 ? 2 : 0;
	return isValueToken(args[index + 1]) ? 2 : 0;
}
//#endregion
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
		fs.accessSync(sentinelPath, fs.constants.F_OK);
		return true;
	} catch {}
	try {
		const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
		if (/\/docker\/|cri-containerd-[0-9a-f]|containerd\/[0-9a-f]{64}|\/kubepods[/.]|\blxc\b/.test(cgroup)) return true;
	} catch {}
	return false;
}
function isLegacyPluginSourceCaptureName(name) {
	return name.startsWith("openclaw-plugin-build-") || name.startsWith("openclaw-model-catalog-");
}
//#endregion
//#region src/infra/gateway-process-argv.ts
function normalizeProcArg(arg) {
	return normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/"));
}
const ENTRY_CANDIDATES = [
	"openclaw.mjs",
	"dist/index.js",
	"dist/entry.js",
	"scripts/run-node.mjs",
	"src/entry.ts",
	"src/index.ts"
];
function referencesRetainedArtifact(value) {
	return value.split(/[\\/=]/u).some((part) => isLegacyPluginSourceCaptureName(part) || /^openclaw-update-runtime-[A-Za-z0-9]{6}$/u.test(part));
}
/** Only absent nested manifests permit ancestor lookup; unreadable identities stay unresolved. */
function readProcessPackageIdentity(directory, searchParents = false) {
	for (let current = directory;;) {
		let manifest;
		try {
			manifest = JSON.parse(fs.readFileSync(path.join(current, "package.json"), "utf8"));
		} catch (error) {
			const parent = path.dirname(current);
			if (searchParents && extractErrorCode(error) === "ENOENT" && parent !== current && path.basename(current) !== "node_modules") {
				current = parent;
				continue;
			}
			throw new Error("could not read package identity", { cause: error });
		}
		if (!isRecord(manifest) || typeof manifest.name !== "string" || !manifest.name.trim() || manifest.name !== manifest.name.trim()) throw new Error("package identity has no valid name");
		return {
			name: manifest.name,
			scripts: isRecord(manifest.scripts) ? manifest.scripts : {}
		};
	}
}
function readProcessWorkingDirectories(pids) {
	const requested = new Set(pids.filter((pid) => Number.isSafeInteger(pid) && pid > 0));
	const directories = /* @__PURE__ */ new Map();
	if (requested.size === 0) return directories;
	if (process.platform === "linux") {
		for (const pid of requested) try {
			directories.set(pid, fs.readlinkSync(`/proc/${pid}/cwd`));
		} catch {}
		return directories;
	}
	try {
		if (process.platform === "darwin") {
			const result = spawnSync("/usr/sbin/lsof", [
				"-a",
				"-p",
				[...requested].join(","),
				"-d",
				"cwd",
				"-F0pn"
			], {
				encoding: "utf8",
				timeout: 5e3,
				maxBuffer: 4194304,
				env: resolveDiagnosticProcessEnv()
			});
			if (result.error || result.status !== 0 && result.status !== 1) return directories;
			const fields = result.stdout.split("\0");
			fields.pop();
			const ambiguous = /* @__PURE__ */ new Set();
			let pid;
			for (const raw of fields) {
				const field = raw.replace(/^\n/, "");
				if (field.startsWith("p")) {
					const candidate = /^p(\d+)$/.exec(field);
					pid = candidate && requested.has(Number(candidate[1])) ? Number(candidate[1]) : void 0;
				} else if (pid !== void 0 && field.startsWith("n") && path.isAbsolute(field.slice(1))) {
					if (directories.has(pid)) {
						directories.delete(pid);
						ambiguous.add(pid);
					} else if (!ambiguous.has(pid)) directories.set(pid, field.slice(1));
				}
			}
		}
	} catch {}
	return directories;
}
/** Generic script names identify OpenClaw only inside a verified package root. */
function classifyEntrypoint(args, opts = {}) {
	const exe = normalizeProcArg(args[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
	if (!opts.requirePackageIdentity && (exe.endsWith("/openclaw") || exe === "openclaw")) return {
		kind: "openclaw",
		entryIndex: 0
	};
	const entryIndex = /(?:^|\/)openclaw\.mjs$/.test(exe) ? 0 : resolveRuntimeScriptPosition(args).position;
	if (typeof entryIndex !== "number") return entryIndex.kind === "unclassified" ? {
		kind: "unclassified",
		cause: "runtime-syntax",
		reason: entryIndex.reason
	} : { kind: "other" };
	const script = args[entryIndex];
	if (opts.inspectPackage && !opts.requirePackageIdentity && opts.cwd && path.isAbsolute(opts.cwd) && isBunRuntime(args[0] ?? "") && !/[\\/]/u.test(script) && !path.extname(script)) {
		const pkg = readProcessPackageIdentity(opts.cwd, true);
		const task = pkg.scripts[script];
		if (typeof task === "string" && task.trim()) return pkg.name === "openclaw" ? { kind: "openclaw" } : { kind: "other" };
	}
	const identity = classifyOpenClawEntrypointPath(script, opts);
	return identity.kind === "openclaw" ? {
		...identity,
		entryIndex
	} : identity;
}
/** Path evidence is shared with cleanup even when launcher syntax is unfamiliar. */
function classifyOpenClawEntrypointPath(script, opts = {}) {
	const normalized = normalizeProcArg(script);
	if (!opts.requirePackageIdentity && /(?:^|\/)openclaw\.mjs$/.test(normalized)) return { kind: "openclaw" };
	const entrypoints = [...ENTRY_CANDIDATES, ...opts.additionalEntrypoints ?? []];
	let scriptPath = script;
	if (!path.isAbsolute(script)) {
		const cwd = opts.cwd ?? (opts.pid === void 0 ? void 0 : readProcessWorkingDirectories([opts.pid]).get(opts.pid));
		if (!cwd || !path.isAbsolute(cwd)) return {
			kind: "unclassified",
			cause: "cwd",
			reason: "working directory is unavailable"
		};
		scriptPath = path.resolve(cwd, script);
	}
	let resolved;
	let directory;
	try {
		resolved = fs.realpathSync(scriptPath);
		if (opts.inspectPackage && !opts.requirePackageIdentity && referencesRetainedArtifact(resolved)) return { kind: "openclaw" };
		const stat = opts.requirePackageIdentity || opts.inspectPackage ? fs.statSync(resolved) : void 0;
		if (opts.requirePackageIdentity && !stat?.isFile()) return {
			kind: "unclassified",
			cause: "script",
			reason: `entrypoint is not a regular file: ${script}`
		};
		directory = stat?.isDirectory() ?? false;
	} catch {
		return {
			kind: "unclassified",
			cause: "script",
			reason: "could not resolve script"
		};
	}
	const resolvedNormalized = normalizeProcArg(resolved);
	const entry = directory ? void 0 : entrypoints.find((candidate) => resolvedNormalized.endsWith(`/${candidate}`));
	if (!entry && (!opts.inspectPackage || opts.requirePackageIdentity)) return { kind: "other" };
	const root = entry ? resolved.slice(0, -entry.length) : directory ? resolved : path.dirname(resolved);
	try {
		return readProcessPackageIdentity(root, !entry && !directory).name === "openclaw" ? {
			kind: "openclaw",
			...opts.requirePackageIdentity ? { packageIdentity: {
				root: path.resolve(root),
				entrypoint: resolved
			} } : {}
		} : { kind: "other" };
	} catch (error) {
		return {
			kind: "unclassified",
			cause: "package-identity",
			reason: error instanceof Error ? error.message : String(error)
		};
	}
}
/** One classification for process owners, command consumers, and diagnostics. */
function classifyOpenClawArgv(args, opts = {}) {
	const { command, owner, pid, port } = opts;
	if (!opts.requirePackageIdentity && command === "gateway" && owner?.pid === pid && owner?.state === "live" && (port === void 0 || owner.port === port)) return { kind: "openclaw" };
	const executable = normalizeProcArg(args[0] ?? "").split("/").at(-1)?.replace(/\.(exe|cmd|bat)$/, "") ?? "";
	if (!opts.requirePackageIdentity && /^openclaw-[a-z0-9-]+$/.test(executable)) return !command || executable === `openclaw-${command}` ? { kind: "openclaw" } : { kind: "other" };
	const identity = classifyEntrypoint(args, opts);
	if (command) return identity.kind === "openclaw" && normalizeProcArg(getRootOptionAwareCommandPath(["node", ...args.slice(identity.entryIndex)], 1)[0] ?? "") !== command ? { kind: "other" } : identity;
	if (identity.kind === "openclaw" || !opts.requirePackageIdentity && args.some((arg) => arg.replaceAll("\\", "/").split("/").some(isLegacyPluginSourceCaptureName))) return identity.kind === "openclaw" ? identity : { kind: "openclaw" };
	let marker = opts.serviceMarker;
	if (pid !== void 0 && process.platform === "linux" && (isNodeRuntime(executable) || isBunRuntime(executable) || executable === "tsx")) try {
		marker = fs.readFileSync(`/proc/${pid}/environ`, "utf8").split("\0").find((entry) => entry.startsWith("OPENCLAW_SERVICE_MARKER="))?.slice(24);
	} catch (error) {
		return {
			kind: "unclassified",
			cause: "service-marker",
			reason: `process identity inspection failed (${extractErrorCode(error) ?? "unavailable"})`
		};
	}
	return !opts.requirePackageIdentity && marker === "openclaw" ? { kind: "openclaw" } : identity;
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

import { r as resolveRuntimeScriptPosition, t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { o as getRootOptionAwareCommandPath } from "./cli-root-options-DGcy1qRg.mjs";
import { o as isPidDefinitelyDead } from "./pid-alive-CPS_shDt.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { t as isRosettaTranslatedProcess } from "./rosetta-translation-DvPrY0r4.mjs";
import { t as readDarwinProcessCommand } from "./darwin-process-command-PlE2gtQ3.mjs";
import { a as readProcessWorkingDirectories, i as readProcessPackageIdentity, n as classifyOpenClawEntrypointPath, o as referencesRetainedArtifact, t as classifyOpenClawArgv } from "./gateway-process-argv-DMAY-YPv.mjs";
import { t as parseWindowsNativeCommandLine } from "./windows-command-line-BrVAurm9.mjs";
import { r as readProcessGroupMembers } from "./service-child-group-ownership-CZVLqXzR.mjs";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
//#region src/infra/windows-process-census.ts
let native;
function loadNative() {
	if (process.arch !== "x64" && process.arch !== "arm64") throw new Error("Windows process census requires a 64-bit runtime.");
	const koffi = createRequire(import.meta.url)("koffi");
	const kernel = koffi.load("kernel32.dll");
	const security = koffi.load("advapi32.dll");
	const nt = koffi.load("ntdll.dll");
	const enumerate = kernel.func("int32_t __stdcall K32EnumProcesses(void *, uint32_t, void *)");
	const open = kernel.func("void * __stdcall OpenProcess(uint32_t, int32_t, uint32_t)");
	const close = kernel.func("int32_t __stdcall CloseHandle(void *)");
	const error = kernel.func("uint32_t __stdcall GetLastError()");
	const exitCode = kernel.func("int32_t __stdcall GetExitCodeProcess(void *, void *)");
	const times = kernel.func("int32_t __stdcall GetProcessTimes(void *, void *, void *, void *, void *)");
	const read = kernel.func("int32_t __stdcall ReadProcessMemory(void *, uintptr_t, void *, size_t, void *)");
	const query = nt.func("int32_t __stdcall NtQueryInformationProcess(void *, uint32_t, void *, uint32_t, void *)");
	const equalSid = security.func("int32_t __stdcall EqualSid(void *, void *)");
	const sessions = koffi.load("wtsapi32.dll");
	const owners = sessions.func("int32_t __stdcall WTSEnumerateProcessesW(void *, uint32_t, uint32_t, void *, void *)");
	const free = sessions.func("void __stdcall WTSFreeMemory(void *)");
	const memory = (handle, address, length) => {
		const bytes = Buffer.alloc(length);
		const returned = Buffer.alloc(8);
		if (!address || !read(handle, address, bytes, length, returned) || returned.readBigUInt64LE() !== BigInt(length)) throw new Error("Process memory is unreadable.");
		return bytes;
	};
	const parameters = (handle, observation) => {
		const basic = Buffer.alloc(48);
		const wow64 = Buffer.alloc(8);
		const returned = Buffer.alloc(4);
		if (query(handle, 0, basic, basic.length, returned) < 0 || returned.readUInt32LE() !== basic.length || basic.readBigUInt64LE(32) !== BigInt(observation.pid) || query(handle, 26, wow64, wow64.length, returned) < 0 || returned.readUInt32LE() !== wow64.length) throw new Error("Process identity or architecture is unavailable.");
		const narrow = wow64.readBigUInt64LE() !== 0n;
		const pointer = (bytes, offset) => narrow ? BigInt(bytes.readUInt32LE(offset)) : bytes.readBigUInt64LE(offset);
		const peb = narrow ? wow64.readBigUInt64LE() : basic.readBigUInt64LE(8);
		const address = pointer(memory(handle, peb, narrow ? 20 : 40), narrow ? 16 : 32);
		const header = memory(handle, address, narrow ? 72 : 128);
		const string = (offset) => {
			try {
				const length = header.readUInt16LE(offset);
				if (!length || length % 2 || length > header.readUInt16LE(offset + 2)) return;
				const value = pointer(header, offset + (narrow ? 4 : 8));
				const location = header.readUInt32LE(8) & 1 ? value : address + value;
				return memory(handle, location, length).toString("utf16le");
			} catch {
				return;
			}
		};
		observation.parentPid = Number(basic.readBigUInt64LE(40));
		observation.commandLine = string(narrow ? 64 : 112);
		observation.cwd = string(narrow ? 36 : 56);
	};
	return (deadline) => {
		const bytes = Buffer.alloc(262144);
		const returned = Buffer.alloc(4);
		if (!enumerate(bytes, bytes.length, returned) || returned.readUInt32LE() >= bytes.length || returned.readUInt32LE() % 4) throw new Error("Windows process enumeration is incomplete.");
		const pids = new Uint32Array(bytes.buffer, bytes.byteOffset, returned.readUInt32LE() / 4);
		const snapshot = new Map(Array.from(pids, (pid) => [pid, 0n]));
		const allocation = Buffer.alloc(8);
		try {
			try {
				if (owners(null, 0, 1, allocation, returned) && returned.readUInt32LE() <= 65536) {
					const records = Buffer.from(koffi.decode(allocation.readBigUInt64LE(), "uint8_t", returned.readUInt32LE() * 24));
					for (let offset = 0; offset < records.length; offset += 24) snapshot.set(records.readUInt32LE(offset + 4), records.readBigUInt64LE(offset + 16));
				}
			} catch {
				snapshot.forEach((_sid, pid) => snapshot.set(pid, 0n));
			}
			const self = snapshot.get(process.pid);
			const observations = Array.from(snapshot, ([pid, owner]) => {
				if (Date.now() >= deadline) throw new Error("Windows process census exceeded its deadline.");
				if (pid === 0 || pid === 4) return;
				const observation = { pid };
				if (self && owner && !equalSid(self, owner)) observation.foreignOwner = true;
				const handle = open(1040, 0, pid) ?? (error() === 87 ? null : open(4096, 0, pid));
				if (!handle) return error() === 87 ? void 0 : observation;
				try {
					const state = Buffer.alloc(4);
					const known = exitCode(handle, state);
					if (!known || state.readUInt32LE() !== 259) return known ? void 0 : observation;
					const created = Buffer.alloc(8);
					if (times(handle, created, Buffer.alloc(8), Buffer.alloc(8), Buffer.alloc(8)) && created.readBigUInt64LE()) observation.startIdentity = String(Number(created.readBigUInt64LE() / 10000n - 11644473600000n));
					try {
						parameters(handle, observation);
					} catch {}
				} finally {
					close(handle);
				}
				return observation;
			});
			if (Date.now() >= deadline) throw new Error("Windows process census exceeded its deadline.");
			return observations.filter((observation) => observation !== void 0);
		} finally {
			if (allocation.readBigUInt64LE()) free(allocation.readBigUInt64LE());
		}
	};
}
/** Missing fields never establish absence for same-user or unknown-owner work. */
function readWindowsProcessCensus(timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	return (native ??= loadNative())(deadline);
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
			if (cwd === void 0 && identity.kind === "other" && typeof position !== "number" && position.kind === "not-runtime" && command.uid !== void 0 && inspectorUid !== void 0 && (command.uid !== inspectorUid || isStandardSystemdLoginProcess(command, parentCommand, inspectorUid))) return { kind: "non-holder" };
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
		}) ?? [...readProcessGroupMembers(handoff ? 15e3 : 1e3, { readDarwinCommand: readDarwinProcessCommand })];
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
				const foreign = observation?.foreignOwner || command?.uid !== void 0 && inspectorUid !== void 0 && command.uid !== inspectorUid;
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
export { inspectOtherOpenClawProcesses as t };

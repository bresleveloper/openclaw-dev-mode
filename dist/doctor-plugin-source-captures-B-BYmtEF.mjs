import { n as isNodeRuntime, t as isBunRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { o as getRootOptionAwareCommandPath } from "./cli-root-options-vGuJ5JgW.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BKwhAL2c.mjs";
import { i as isPidDefinitelyDead } from "./pid-alive-CXdZEzr_.mjs";
import { D as walkDirectory } from "./fs-safe-BAPek8At.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir, T as resolveNewStateDir } from "./paths-DehQwyE0.mjs";
import { n as isLegacyPluginSourceCaptureName } from "./plugin-source-capture-path-DVlzzTlh.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { t as removeTemporaryArtifacts } from "./temp-artifact-cleanup-D_2UpyuT.mjs";
import { n as isOpenClawArgv } from "./gateway-process-argv-BVJwTten.mjs";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as readProcessGroupMembers } from "./service-child-group-ownership-Qp-X4dOa.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as formatBytes } from "./doctor-disk-space-DxWGTqXn.mjs";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
//#region src/process/supervisor/darwin-process-command.ts
let native;
function loadNative() {
	const koffi = createRequire(import.meta.url)("koffi");
	const system = koffi.load("/usr/lib/libSystem.B.dylib");
	const sysctl = system.func("int sysctl(const int *name, unsigned int namelen, void *oldp, size_t *oldlenp, const void *newp, size_t newlen)");
	const pidPath = koffi.load("/usr/lib/libproc.dylib").func("int proc_pidpath(int pid, void *buffer, uint32_t buffersize)");
	const csops = system.func("int csops(int pid, unsigned int ops, void *useraddr, size_t usersize)");
	const size = Buffer.alloc(8);
	const argMax = Buffer.alloc(4);
	size.writeBigUInt64LE(4n);
	if (sysctl(new Int32Array([1, 8]), 2, argMax, size, null, 0) !== 0 || argMax.readInt32LE() <= 4) throw new Error("Darwin process argument limit is unavailable");
	const buffer = Buffer.alloc(argMax.readInt32LE());
	return {
		readArguments(pid) {
			size.writeBigUInt64LE(BigInt(buffer.length));
			if (sysctl(new Int32Array([
				1,
				49,
				pid
			]), 3, buffer, size, null, 0) !== 0) return { errno: koffi.errno() };
			const length = Number(size.readBigUInt64LE());
			if (length < 4 || length > buffer.length) throw new Error(`Incomplete Darwin process arguments for PID ${pid}`);
			return { bytes: buffer.subarray(0, length) };
		},
		executable(pid) {
			const executableBuffer = Buffer.alloc(4096);
			const length = pidPath(pid, executableBuffer, executableBuffer.length);
			const end = executableBuffer.indexOf(0);
			return length > 0 && length <= executableBuffer.length && end > 0 ? executableBuffer.toString("utf8", 0, end) : void 0;
		},
		isPlatformBinary(pid) {
			const flags = Buffer.alloc(4);
			return csops(pid, 0, flags, flags.length) === 0 && (flags.readUInt32LE() & 67108865) === 67108865;
		}
	};
}
function parseArguments(bytes, pid) {
	const argc = bytes.readInt32LE();
	let offset = bytes.indexOf(0, 4);
	if (argc <= 0 || argc > bytes.length || offset <= 4) throw new Error(`Invalid Darwin process arguments for PID ${pid}`);
	while (offset < bytes.length && bytes[offset] === 0) offset++;
	const argv = [];
	for (let index = 0; index < argc; index++) {
		const end = bytes.indexOf(0, offset);
		if (end < 0) throw new Error(`Truncated Darwin process arguments for PID ${pid}`);
		argv.push(bytes.toString("utf8", offset, end));
		offset = end + 1;
	}
	return argv;
}
function isForeignNativeExecutable(executable, uid) {
	return !(uid === process.getuid?.() || isNodeRuntime(executable) || isBunRuntime(executable) || /^openclaw(?:-|$)/i.test(path.basename(executable)) || /\.app(?:\/|$)/i.test(executable) || /\/(?:Python|Ruby|Perl|Tcl|Tk|JavaVM|JavaScriptCore)\.framework\//i.test(executable) || executable.includes("/bin/") || executable.includes("/openclaw-plugin-build-"));
}
/** Exact argv, or explicit kernel-executable evidence for a foreign system service. */
function readDarwinProcessCommand(pid, uid) {
	native ??= loadNative();
	const result = native.readArguments(pid);
	if ("bytes" in result) return { argv: parseArguments(result.bytes, pid) };
	if (isPidDefinitelyDead(pid)) return;
	const executable = native.executable(pid);
	if (executable && isForeignNativeExecutable(executable, uid) && native.isPlatformBinary(pid)) return {
		argvUnavailable: true,
		executable,
		uid
	};
	throw new Error(`Cannot inspect Darwin arguments for live PID ${pid} (errno ${result.errno})`);
}
//#endregion
//#region src/infra/openclaw-process-census.ts
const workerSuffixes = Object.values(runtimeProcessEntrypoints).flatMap((entry) => [path.posix.normalize(`/infra/${entry.sourceWorkerName}.ts`), `/${entry.distWorkerPath}`]);
function isDoctorLauncher(argv) {
	const entry = argv.findIndex((arg) => isOpenClawArgv([arg]));
	return entry >= 0 && getRootOptionAwareCommandPath(["node", ...argv.slice(entry)], 1)[0] === "doctor";
}
function isOpenClawProcess(argv) {
	const executable = (argv[0] ?? "").replaceAll("\\", "/");
	return isOpenClawArgv(argv) || /^openclaw-[a-z0-9-]+$/i.test(executable.split("/").at(-1) ?? "") || argv.some((arg) => arg.replaceAll("\\", "/").split("/").some(isLegacyPluginSourceCaptureName)) || argv.some((arg) => workerSuffixes.some((suffix) => arg.replaceAll("\\", "/").endsWith(suffix)));
}
/** Incomplete process inspection never authorizes reclamation of unowned scratch. */
function inspectOtherOpenClawProcesses() {
	try {
		if (process.platform === "linux" && isContainerEnvironment()) throw new Error("Host process visibility cannot be established from this container. Run Doctor on the host after stopping OpenClaw containers that share its temporary directory.");
		const processes = [...readProcessGroupMembers(1e3, { readDarwinCommand: readDarwinProcessCommand })];
		const byPid = new Map(processes.map((entry) => [entry.pid, entry]));
		const current = byPid.get(process.pid);
		if (!current?.command || processes.some((entry) => !entry.command)) throw new Error("OpenClaw process census is incomplete.");
		const launchers = /* @__PURE__ */ new Set();
		const ancestors = /* @__PURE__ */ new Set([process.pid]);
		let parentPid = current.command.ppid;
		while (parentPid > 0) {
			const parent = byPid.get(parentPid);
			if (!parent?.command || ancestors.has(parentPid)) throw new Error("OpenClaw process ancestry is incomplete.");
			ancestors.add(parentPid);
			if ("argv" in parent.command && isDoctorLauncher(parent.command.argv)) launchers.add(parentPid);
			parentPid = parent.command.ppid;
		}
		return { pids: processes.filter(({ pid, state, command }) => {
			if (pid === process.pid || launchers.has(pid)) return false;
			if (state.startsWith("Z") && isPidDefinitelyDead(pid)) return false;
			return command && "argv" in command ? isOpenClawProcess(command.argv) : false;
		}).map(({ pid }) => pid) };
	} catch (error) {
		return { error: `Could not inspect OpenClaw processes: ${String(error)}` };
	}
}
//#endregion
//#region src/plugins/plugin-source-capture-report.ts
async function readLegacyCapture(directory) {
	const identity = await fs.lstat(directory);
	if (!identity.isDirectory()) return;
	try {
		await fs.lstat(path.join(directory, "owner.sqlite"));
		return;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return identity;
	}
}
async function inspectLegacyCapture(directory, warn) {
	const identity = await readLegacyCapture(directory);
	if (!identity) return;
	const scan = await walkDirectory(directory, { symlinks: "include" });
	let complete = scan.failedDirs.length === 0;
	for (const failure of scan.failedDirs) warn(failure.path, failure.error);
	let bytes = 0;
	let changedAtMs = Math.max(identity.birthtimeMs, identity.ctimeMs);
	for (const entry of scan.entries) try {
		const stat = await fs.lstat(entry.path);
		changedAtMs = Math.max(changedAtMs, stat.birthtimeMs, stat.ctimeMs);
		if (stat.isFile()) bytes += stat.size;
	} catch (error) {
		complete = false;
		warn(entry.path, error);
	}
	return {
		path: directory,
		bytes,
		identity,
		changedAtMs,
		complete
	};
}
/** Legacy captures span old service environments as well as the selected state. */
async function inspectLegacyPluginSourceCaptureRoots(stateDir, temporaryDirectories = []) {
	const directories = /* @__PURE__ */ new Set();
	const roots = [];
	const warnings = [];
	const warn = (file, error) => {
		if (!hasErrnoCode(error, "ENOENT")) warnings.push(`Could not inspect ${file}: ${String(error)}`);
	};
	for (const candidate of [
		path.join(stateDir, "tmp"),
		tmpdir(),
		...process.platform === "win32" ? [] : ["/tmp"],
		...temporaryDirectories
	]) try {
		const directory = await fs.realpath(candidate);
		if (directories.has(directory)) continue;
		directories.add(directory);
		const candidates = await walkDirectory(directory, {
			maxDepth: 1,
			symlinks: "skip",
			include: (entry) => entry.kind === "directory" && isLegacyPluginSourceCaptureName(entry.name)
		});
		for (const failure of candidates.failedDirs) warn(failure.path, failure.error);
		for (const entry of candidates.entries) try {
			const capture = await inspectLegacyCapture(entry.path, warn);
			if (capture) roots.push(capture);
		} catch (error) {
			warn(entry.path, error);
		}
	} catch (error) {
		warn(candidate, error);
	}
	roots.sort((left, right) => left.path.localeCompare(right.path));
	return {
		roots,
		totalBytes: roots.reduce((bytes, root) => bytes + root.bytes, 0),
		warnings
	};
}
/** The Doctor owner must retain maintenance and recheck the host census before each removal. */
async function pruneLegacyPluginSourceCaptures(report, assertCurrent) {
	const removed = [];
	const skipped = [];
	const warnings = [];
	let blockedReason;
	const mayProceed = () => {
		try {
			assertCurrent();
			return true;
		} catch (error) {
			blockedReason = String(error);
			return false;
		}
	};
	if (mayProceed()) for (const root of report.roots) try {
		const current = await inspectLegacyCapture(root.path, (file, error) => {
			warnings.push(`Could not inspect ${file}: ${String(error)}`);
		});
		if (!current || current.identity.dev !== root.identity.dev || current.identity.ino !== root.identity.ino) {
			skipped.push({
				path: root.path,
				reason: "capture identity or custody changed"
			});
			continue;
		}
		if (!current.complete) {
			skipped.push({
				path: root.path,
				reason: "capture inspection is incomplete"
			});
			continue;
		}
		if (current.changedAtMs >= performance.timeOrigin) {
			skipped.push({
				path: root.path,
				reason: "created or changed during the current process"
			});
			continue;
		}
		if (!mayProceed()) break;
		await removeTemporaryArtifacts(root.path, "Legacy plugin capture");
		if (await fs.lstat(root.path).catch((error) => {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		})) warnings.push(`Could not remove ${root.path}; see the capture cleanup warning.`);
		else removed.push(current);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) warnings.push(`Could not reclaim ${root.path}: ${String(error)}`);
	}
	return {
		removed,
		skipped,
		warnings,
		blockedReason
	};
}
//#endregion
//#region src/commands/doctor-plugin-source-captures.ts
async function noteLegacyPluginSourceCaptures(env, shouldRepair = false) {
	const temporaryDirectories = [
		env.TMPDIR,
		env.TMP,
		env.TEMP
	].filter((directory) => Boolean(directory?.trim()));
	temporaryDirectories.push(path.join(resolveNewStateDir(() => resolveRequiredHomeDir(env)), "tmp"));
	const warnings = [];
	try {
		const { resolveGatewayService } = await import("./service-CZPrn7FT.mjs");
		const command = await resolveGatewayService().readCommand(env, {
			requireLoaded: true,
			timeoutMs: 5e3
		});
		for (const definition of [command, command?.managedDefinition]) {
			const directory = definition?.environment?.TMPDIR;
			if (directory?.trim()) {
				if (path.isAbsolute(directory)) temporaryDirectories.push(directory);
				else if (definition?.workingDirectory) temporaryDirectories.push(path.resolve(definition.workingDirectory, directory));
				else warnings.push("The managed service records a relative TMPDIR without a working directory; its legacy captures could not be inspected.");
			}
		}
	} catch (error) {
		warnings.push(`Could not inspect the managed service temporary directory: ${String(error)}`);
	}
	const report = await inspectLegacyPluginSourceCaptureRoots(resolveStateDir(env), temporaryDirectories);
	warnings.push(...report.warnings);
	const lines = [];
	if (report.roots.length > 0) {
		lines.push(`${report.roots.length} legacy plugin capture root(s), ${formatBytes(report.totalBytes)} in known regular files.`, ...report.roots.map((root) => `- ${quoteCliArg(root.path)} (${formatBytes(root.bytes)})`), "They will be reclaimed at the next maintenance.");
		if (shouldRepair) {
			const maintenance = getOpenClawDatabaseMaintenanceScope();
			const result = await pruneLegacyPluginSourceCaptures(report, () => {
				if (!maintenance?.ownsSchemaMaintenance) throw new Error("Doctor does not hold Gateway maintenance; legacy captures were preserved.");
				maintenance.assertAdmission();
				const census = inspectOtherOpenClawProcesses();
				if ("error" in census) throw new Error(census.error);
				if (census.pids.length > 0) throw new Error(`Other OpenClaw processes are still running (PIDs: ${census.pids.join(", ")}).`);
				maintenance.assertAdmission();
			});
			if (result.removed.length > 0) lines.push(`Removed ${result.removed.length} legacy plugin capture root(s), ${formatBytes(result.removed.reduce((bytes, root) => bytes + root.bytes, 0))}.`, ...result.removed.map((root) => `Removed ${quoteCliArg(root.path)} (${formatBytes(root.bytes)}).`));
			if (result.blockedReason) lines.push(`Legacy capture cleanup skipped: ${result.blockedReason}`);
			lines.push(...result.skipped.map((root) => `Kept ${quoteCliArg(root.path)}: ${root.reason}.`));
			warnings.push(...result.warnings);
		}
	}
	if (warnings.length > 0) lines.push("Legacy capture inspection or cleanup was incomplete; sizes may be partial.", ...warnings);
	if (lines.length > 0) note(lines.join("\n"), "Legacy plugin captures");
}
//#endregion
export { noteLegacyPluginSourceCaptures };

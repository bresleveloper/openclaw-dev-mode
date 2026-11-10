import { spawn } from "node:child_process";
import { constants } from "node:os";
import path from "node:path";
import fs from "node:fs";
//#region \0rolldown/runtime.js
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
//#endregion
//#region scripts/lib/managed-child-process.mts
/** Return the conventional shell exit code for a signal. */
function signalExitCode(signal) {
	const signalNumber = signalNumberFor(signal);
	return signalNumber ? 128 + signalNumber : 1;
}
function signalNumberFor(signal) {
	switch (signal) {
		case "SIGHUP": return 1;
		case "SIGINT": return 2;
		case "SIGTERM": return 15;
		default: return constants.signals?.[signal] ?? 0;
	}
}
//#endregion
//#region packages/normalization-core/src/mountinfo-path.ts
__esmMin((() => {}))();
const MOUNT_PATH_OCTAL_ESCAPE_RE = /\\([0-7]{3})/g;
/** Decodes an octal-escaped path field from a Linux procfs mount table. */
function decodeMountInfoPath(value) {
	return value.replace(MOUNT_PATH_OCTAL_ESCAPE_RE, (_match, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
}
//#endregion
//#region scripts/lib/process-memory.mts
const DEFAULT_CGROUP_V2_MOUNT_PATH = "/sys/fs/cgroup";
const DEFAULT_CGROUP_V1_MEMORY_MOUNT_PATH = "/sys/fs/cgroup/memory";
const PROC_SELF_CGROUP_PATH = "/proc/self/cgroup";
const PROC_SELF_MOUNTINFO_PATH = "/proc/self/mountinfo";
const CGROUP_V2_MEMORY_LIMIT_FILES = ["memory.max", "memory.high"];
const CGROUP_V1_MEMORY_LIMIT_FILES = ["memory.limit_in_bytes"];
function parseCgroupMemoryLimitBytes(value) {
	const trimmed = value.trim();
	if (trimmed === "" || trimmed === "max" || !/^\d+$/u.test(trimmed)) return null;
	const parsed = BigInt(trimmed);
	if (parsed < 0n || parsed > BigInt(Number.MAX_SAFE_INTEGER)) return null;
	return Number(parsed);
}
function resolveCgroupMountPoints(params = {}) {
	const fsImpl = params.fs ?? fs;
	let rawMountinfo = "";
	try {
		rawMountinfo = fsImpl.readFileSync(PROC_SELF_MOUNTINFO_PATH, "utf8");
	} catch {}
	const unified = [];
	const v1Memory = [];
	for (const line of rawMountinfo.split("\n")) {
		const [fields, describe] = line.split(" - ");
		const mountFields = (fields ?? "").split(" ");
		const rawRoot = mountFields[3];
		const rawMountPoint = mountFields[4];
		const [fsType, , superOptions] = (describe ?? "").split(" ");
		if (!rawMountPoint || !rawRoot) continue;
		const root = decodeMountInfoPath(rawRoot);
		const mountPoint = decodeMountInfoPath(rawMountPoint);
		if (fsType === "cgroup2") unified.push({
			mountPoint,
			observed: true,
			root
		});
		else if (fsType === "cgroup" && (superOptions ?? "").split(",").includes("memory")) v1Memory.push({
			mountPoint,
			observed: true,
			root
		});
	}
	return {
		unified: unified.length > 0 ? unified : [{
			mountPoint: DEFAULT_CGROUP_V2_MOUNT_PATH,
			observed: false,
			root: "/"
		}],
		v1Memory: v1Memory.length > 0 ? v1Memory : [{
			mountPoint: DEFAULT_CGROUP_V1_MEMORY_MOUNT_PATH,
			observed: false,
			root: "/"
		}]
	};
}
function relativeCgroupPath(mountRoot, cgroupPath) {
	if (cgroupPath.split("/").includes("..")) return null;
	if (mountRoot === "/") return cgroupPath;
	const mountRootSegments = mountRoot.split("/").filter(Boolean);
	if (mountRootSegments.length > 0 && mountRootSegments.every((segment) => segment === "..")) return null;
	if (mountRootSegments.includes("..")) return null;
	if (cgroupPath === "/") return null;
	if (cgroupPath === mountRoot) return "/";
	return cgroupPath.startsWith(`${mountRoot}/`) ? cgroupPath.slice(mountRoot.length) : null;
}
function resolveCgroupMemoryLimitPaths(params = {}) {
	const fsImpl = params.fs ?? fs;
	let rawCgroup = "";
	let cgroupRecordReadFailed = false;
	try {
		rawCgroup = fsImpl.readFileSync(PROC_SELF_CGROUP_PATH, "utf8");
	} catch {
		cgroupRecordReadFailed = (params.platform ?? process.platform) === "linux";
	}
	const paths = [];
	const addHierarchy = (mounts, limitFiles, cgroupPath, hierarchyFile) => {
		const initialPathCount = paths.length;
		let addedObservedPath = false;
		let hierarchyMetadataUnreadable = false;
		for (const mount of mounts) {
			const mountInitialPathCount = paths.length;
			const relative = relativeCgroupPath(mount.root, cgroupPath);
			if (relative === null) continue;
			const segments = relative.split("/").filter(Boolean);
			for (let depth = segments.length; depth >= 0; depth -= 1) {
				if (hierarchyFile && depth < segments.length) try {
					const hierarchyPath = path.join(mount.mountPoint, ...segments.slice(0, depth), hierarchyFile);
					const hierarchyMode = fsImpl.readFileSync(hierarchyPath, "utf8").trim();
					if (hierarchyMode === "0") break;
					if (hierarchyMode !== "1") {
						hierarchyMetadataUnreadable = true;
						break;
					}
				} catch {
					hierarchyMetadataUnreadable = true;
					break;
				}
				for (const limitFile of limitFiles) paths.push(path.join(mount.mountPoint, ...segments.slice(0, depth), limitFile));
			}
			addedObservedPath ||= mount.observed && paths.length > mountInitialPathCount;
		}
		return {
			added: paths.length > initialPathCount,
			addedObservedPath,
			hierarchyMetadataUnreadable
		};
	};
	const mounts = resolveCgroupMountPoints(params);
	let sawMemoryRecord = false;
	let sawObservedV2Mapping = false;
	let sawObservedV2Root = false;
	let sawUnreadableV1HierarchyMetadata = false;
	let sawV1MemoryRecord = false;
	let sawUnresolvedCgroupLimit = false;
	for (const line of rawCgroup.split("\n")) {
		const record = /^\d+:([^:]*):(.*)$/u.exec(line);
		if (!record) continue;
		const controllers = record[1] ?? "";
		if (controllers === "") {
			sawMemoryRecord = true;
			const cgroupPath = record[2] ?? "";
			sawObservedV2Root ||= cgroupPath === "/" && mounts.unified.some((mount) => mount.observed && mount.root === "/");
			const resolved = addHierarchy(mounts.unified, CGROUP_V2_MEMORY_LIMIT_FILES, cgroupPath);
			sawObservedV2Mapping ||= resolved.addedObservedPath;
			sawUnresolvedCgroupLimit ||= !resolved.added;
		} else if (controllers.split(",").includes("memory")) {
			sawMemoryRecord = true;
			sawV1MemoryRecord = true;
			const resolved = addHierarchy(mounts.v1Memory, CGROUP_V1_MEMORY_LIMIT_FILES, record[2] ?? "", "memory.use_hierarchy");
			sawUnreadableV1HierarchyMetadata ||= resolved.hierarchyMetadataUnreadable;
			sawUnresolvedCgroupLimit ||= !resolved.added;
		}
	}
	if (!sawMemoryRecord) {
		for (const mount of mounts.unified) addHierarchy([mount], CGROUP_V2_MEMORY_LIMIT_FILES, mount.root);
		for (const mount of mounts.v1Memory) addHierarchy([mount], CGROUP_V1_MEMORY_LIMIT_FILES, mount.root);
	}
	return {
		paths,
		cgroupRecordReadFailed,
		sawMemoryRecord,
		sawObservedV2Mapping,
		sawObservedUnconstrainedV2Root: sawObservedV2Root && !sawV1MemoryRecord,
		sawUnresolvedCgroupLimit,
		sawUnreadableV1HierarchyMetadata,
		sawV1MemoryRecord
	};
}
/** Verify actual kernel containment, rather than accepting an environment or manager claim. */
function hasLinuxMemoryContainment(maxBytes, params = {}, scope) {
	if ((params.platform ?? process.platform) !== "linux") return false;
	const resolved = resolveCgroupMemoryLimitPaths(params);
	if (!resolved.sawObservedV2Mapping || resolved.cgroupRecordReadFailed || resolved.sawUnresolvedCgroupLimit) return false;
	const files = params.fs ?? fs;
	return resolved.paths.some((file) => {
		if (path.basename(file) !== "memory.max") return false;
		if (scope && path.basename(path.dirname(file)) !== scope) return false;
		try {
			const limit = parseCgroupMemoryLimitBytes(files.readFileSync(file, "utf8"));
			const directory = path.dirname(file);
			return limit !== null && limit > 0 && limit <= maxBytes && files.readFileSync(path.join(directory, "memory.swap.max"), "utf8").trim() === "0" && files.readFileSync(path.join(directory, "memory.oom.group"), "utf8").trim() === "1";
		} catch {
			return false;
		}
	});
}
//#endregion
//#region scripts/lib/managed-memory-launcher.mts
const [rawLimit, scope, shell, bin, ...args] = process.argv.slice(2);
const maxBytes = Number(rawLimit);
if (!scope || !bin || shell !== "true" && shell !== "false" || !Number.isSafeInteger(maxBytes) || maxBytes <= 0 || !hasLinuxMemoryContainment(maxBytes, {}, scope)) {
	console.error("[memory] The owned cgroup has no verified memory/swap limit; semantic command was not started. Use a cgroup-v2 host with a user systemd manager or a bounded Crabbox.");
	process.exitCode = 75;
} else {
	const env = {
		...process.env,
		NODE_OPTIONS: process.env.OPENCLAW_MANAGED_NODE_OPTIONS ?? ""
	};
	delete env.OPENCLAW_MANAGED_NODE_OPTIONS;
	const child = spawn(bin, args, {
		env,
		stdio: "inherit",
		shell: shell === "true"
	});
	let received;
	let exitSignal;
	const remember = (signal) => {
		received ??= signal;
	};
	const handlers = [
		"SIGINT",
		"SIGTERM",
		"SIGHUP"
	].map((signal) => [signal, () => remember(signal)]);
	for (const [signal, handler] of handlers) process.on(signal, handler);
	process.exitCode = await new Promise((resolve) => {
		child.once("error", (error) => {
			console.error(error);
			resolve(75);
		});
		child.once("exit", (status, signal) => {
			exitSignal = received ?? signal ?? void 0;
			resolve(exitSignal ? signalExitCode(exitSignal) : status ?? 75);
		});
	});
	for (const [signal, handler] of handlers) process.off(signal, handler);
	if (exitSignal) {
		if (exitSignal !== "SIGKILL" && exitSignal !== "SIGSTOP") {
			const reset = () => {};
			process.on(exitSignal, reset);
			process.off(exitSignal, reset);
		}
		process.kill(process.pid, exitSignal);
	}
}
//#endregion
export {};

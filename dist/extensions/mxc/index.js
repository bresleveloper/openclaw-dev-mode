import { createRequire } from "node:module";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import * as path$1 from "node:path";
import path, { posix, win32 } from "node:path";
import { buildPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { formatPluginConfigIssue, mapPluginConfigIssues } from "openclaw/plugin-sdk/extension-shared";
import { MAX_TIMER_TIMEOUT_SECONDS } from "openclaw/plugin-sdk/number-runtime";
import { z } from "zod";
import { createWritableRenameTargetResolver, registerSandboxBackend, resolvePreferredOpenClawTmpDir } from "openclaw/plugin-sdk/sandbox";
import * as fs$1 from "node:fs";
import fs, { lstatSync, mkdtempSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { extractErrorCode, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { isPathInside, removePathWithinRoot, resolvePathPrefixSync, root } from "openclaw/plugin-sdk/file-access-runtime";
import { runCommandBuffered } from "openclaw/plugin-sdk/process-runtime";
import { FsSafeError } from "openclaw/plugin-sdk/security-runtime";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
//#region extensions/mxc/src/config.ts
const MXC_CONTAINMENTS = ["process", "processcontainer"];
const MXC_NETWORK_MODES = ["none", "default"];
const DEFAULT_CONTAINMENT = "process";
const DEFAULT_NETWORK = "none";
const DEFAULT_TIMEOUT_SECONDS = 120;
const DEFAULT_DEBUG = false;
const nonEmptyTrimmedString = (message) => z.string({ error: message }).trim().min(1, { error: message });
const MxcPluginConfigSchema = z.strictObject({
	mxcBinaryPath: nonEmptyTrimmedString("mxcBinaryPath must be a non-empty string").describe("Absolute path to the MXC executor (wxc-exec.exe). When unset, the executor is discovered from the installed @microsoft/mxc-sdk.").optional(),
	containment: z.enum(MXC_CONTAINMENTS, { error: `containment must be one of ${MXC_CONTAINMENTS.join(", ")}` }).describe("Windows containment mode. 'process' and 'processcontainer' currently both resolve to the Windows ProcessContainer sandbox.").optional(),
	network: z.enum(MXC_NETWORK_MODES, { error: `network must be one of ${MXC_NETWORK_MODES.join(", ")}` }).describe("Outbound network policy. 'none' blocks all network; 'default' allows outbound access via the internetClient capability.").optional(),
	timeoutSeconds: z.number({ error: `timeoutSeconds must be a number between 1 and ${MAX_TIMER_TIMEOUT_SECONDS}` }).min(1, { error: "timeoutSeconds must be a number >= 1" }).max(MAX_TIMER_TIMEOUT_SECONDS, { error: `timeoutSeconds must be a number <= ${MAX_TIMER_TIMEOUT_SECONDS}` }).describe("Per-command execution timeout in seconds. Capped to the sandbox policy baseline timeout when both are set.").optional(),
	debug: z.boolean({ error: "debug must be a boolean" }).describe("Forward verbose debug output from the MXC SDK launcher.").optional(),
	mxcPolicyPaths: z.array(nonEmptyTrimmedString("mxcPolicyPaths must be an array of non-empty strings"), { error: "mxcPolicyPaths must be an array of non-empty strings" }).describe("Absolute MXC policy file paths applied on top of the built-in sandbox baseline policy.").optional()
});
function createMxcPluginConfigSchema() {
	return buildPluginConfigSchema(MxcPluginConfigSchema, { safeParse(value) {
		if (value === void 0) return {
			success: true,
			data: void 0
		};
		const parsed = MxcPluginConfigSchema.safeParse(value);
		if (parsed.success) return {
			success: true,
			data: parsed.data
		};
		return {
			success: false,
			error: { issues: mapPluginConfigIssues(parsed.error.issues) }
		};
	} });
}
function resolveConfig(value) {
	if (value === void 0) return {
		mxcBinaryPath: void 0,
		containment: DEFAULT_CONTAINMENT,
		network: DEFAULT_NETWORK,
		timeoutSeconds: DEFAULT_TIMEOUT_SECONDS,
		debug: DEFAULT_DEBUG
	};
	const parsed = MxcPluginConfigSchema.safeParse(value);
	if (!parsed.success) {
		const message = formatPluginConfigIssue(parsed.error.issues[0]);
		throw new Error(`Invalid mxc plugin config: ${message}`);
	}
	const config = parsed.data;
	const resolved = {
		mxcBinaryPath: config.mxcBinaryPath,
		containment: config.containment ?? DEFAULT_CONTAINMENT,
		network: config.network ?? DEFAULT_NETWORK,
		timeoutSeconds: config.timeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS,
		debug: config.debug ?? DEFAULT_DEBUG,
		mxcPolicyPaths: resolveMxcPolicyPaths(config.mxcPolicyPaths)
	};
	if (config.timeoutSeconds !== void 0) resolved.timeoutSecondsConfigured = true;
	return resolved;
}
function resolveMxcPolicyPaths(value) {
	if (value === void 0) return;
	return value.map((entry, index) => {
		if (!isAbsolutePath(entry)) throw new Error(`Invalid mxc plugin config: mxcPolicyPaths[${index}] must be an absolute path`);
		return entry;
	});
}
function isAbsolutePath(value) {
	return win32.isAbsolute(value) || posix.isAbsolute(value);
}
//#endregion
//#region extensions/mxc/src/binary-resolver.ts
/**
* Resolve the bin/ directory inside the installed @microsoft/mxc-sdk package.
* Returns the arch-specific subdirectory (x64 or arm64) if available.
*/
function resolveSdkBinDir() {
	try {
		const sdkPkgPath = createRequire(import.meta.url).resolve("@microsoft/mxc-sdk/package.json");
		const sdkRoot = path$1.dirname(sdkPkgPath);
		const arch = process.arch === "arm64" ? "arm64" : "x64";
		const archBin = path$1.join(sdkRoot, "bin", arch);
		if (fs$1.existsSync(archBin)) return archBin;
		const flatBin = path$1.join(sdkRoot, "bin");
		if (fs$1.existsSync(flatBin)) return flatBin;
	} catch {}
	return null;
}
function resolveMxcBinaryPath(configOverride) {
	if (configOverride) {
		const resolvedOverride = path$1.win32.isAbsolute(configOverride) ? configOverride : path$1.resolve(configOverride);
		if (!fs$1.existsSync(resolvedOverride)) throw new Error(`MXC binary not found at configured path: ${configOverride}`);
		return resolvedOverride;
	}
	const binaryName = "wxc-exec.exe";
	const sdkBinDir = resolveSdkBinDir();
	const binaryPath = sdkBinDir ? path$1.join(sdkBinDir, binaryName) : void 0;
	if (!binaryPath || !fs$1.existsSync(binaryPath)) throw new Error(`MXC executor "${binaryName}" not found. Install @microsoft/mxc-sdk or set mxcBinaryPath in config.`);
	return binaryPath;
}
//#endregion
//#region extensions/mxc/src/path-comparison.ts
function normalizeMxcPathForComparison(value) {
	const resolved = path.resolve(value);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
//#endregion
//#region extensions/mxc/src/workspace-skill-mounts.ts
const MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS = [".openclaw", "sandbox-skills"];
function containerJoin(root, ...parts) {
	const normalizedRoot = root.endsWith("/") && root !== "/" ? root.slice(0, -1) : root;
	const suffix = parts.map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
	return suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot;
}
function resolveMaterializedSandboxSkillsWorkspaceDir(rootDir) {
	return path.join(rootDir, ...MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS);
}
function isExistingMxcSkillMountSource(params) {
	try {
		if (!lstatSync(params.hostPath).isDirectory()) return false;
		return isPathInside(realpathSync(path.resolve(params.rootDir)), realpathSync(path.resolve(params.hostPath)));
	} catch {
		return false;
	}
}
function resolveMxcReadOnlySkillMounts(params) {
	if (params.workspaceAccess !== "rw") return [];
	const materializedSkillsWorkspaceDir = params.skillsWorkspaceDir ?? resolveMaterializedSandboxSkillsWorkspaceDir(params.agentWorkspaceDir);
	return [
		{
			hostPath: path.join(params.agentWorkspaceDir, "skills"),
			containerPath: containerJoin(params.workdir, "skills"),
			rootDir: params.agentWorkspaceDir
		},
		{
			hostPath: path.join(params.agentWorkspaceDir, ".agents", "skills"),
			containerPath: containerJoin(params.workdir, ".agents", "skills"),
			rootDir: params.agentWorkspaceDir
		},
		{
			hostPath: path.join(materializedSkillsWorkspaceDir, "skills"),
			containerPath: containerJoin(params.workdir, ...MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS, "skills"),
			rootDir: materializedSkillsWorkspaceDir
		}
	].filter((mount) => isExistingMxcSkillMountSource({
		rootDir: mount.rootDir,
		hostPath: mount.hostPath
	})).map(({ hostPath, containerPath }) => ({
		hostPath,
		containerPath
	}));
}
//#endregion
//#region extensions/mxc/src/fs-bridge.ts
function createMxcFsBridge(params) {
	return new MxcFsBridge(params.sandbox);
}
var MxcFsBridge = class {
	constructor(sandbox) {
		this.sandbox = sandbox;
		this.resolveRenameTargets = createWritableRenameTargetResolver((target) => this.resolveTarget(target), (target, action) => this.ensureWritable(target, action));
		this.defaultContainerRoot = path.resolve(sandbox.containerWorkdir);
		this.protectedSkillMounts = resolveMxcProtectedSkillMounts(sandbox);
		this.workspaceMounts = resolveWorkspaceMounts(sandbox);
	}
	resolvePath(params) {
		const target = this.resolveTarget(params);
		return {
			hostPath: target.hostPath,
			relativePath: target.relativePath,
			containerPath: target.containerPath
		};
	}
	get pathMappings() {
		return [...this.protectedSkillMounts, ...this.workspaceMounts];
	}
	async readFile(params) {
		const target = this.resolveTarget(params);
		return await (await root(target.mount.hostRoot)).readBytes(target.relativePath, {
			hardlinks: "reject",
			...params.maxBytes === void 0 ? {} : { maxBytes: params.maxBytes }
		});
	}
	async readDirectory(params) {
		const target = this.resolveTarget(params);
		return (await (await root(target.mount.hostRoot)).list(target.relativePath, { withFileTypes: true })).map(({ name, isDirectory }) => ({
			name,
			isDirectory
		}));
	}
	async writeFile(params) {
		const target = this.resolveTarget(params);
		this.ensureWritable(target, "write files");
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		await (await root(target.mount.hostRoot)).write(target.relativePath, buffer, { mkdir: params.mkdir !== false });
	}
	async createFileExclusive(params) {
		const target = this.resolveTarget(params);
		this.ensureWritable(target, "create files");
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		try {
			await (await root(target.mount.hostRoot)).create(target.relativePath, buffer, { mkdir: params.mkdir !== false });
			return "created";
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "already-exists") return "exists";
			throw error;
		}
	}
	async mkdirp(params) {
		const target = this.resolveTarget(params);
		this.ensureWritable(target, "create directories");
		if (target.relativePath.length === 0) return;
		await (await root(target.mount.hostRoot)).mkdir(target.relativePath);
	}
	async remove(params) {
		const target = this.resolveTarget(params);
		this.ensureWritable(target, "remove files");
		await removePathWithinRoot({
			rootDir: target.mount.hostRoot,
			relativePath: target.relativePath,
			recursive: params.recursive,
			force: params.force ?? false
		});
	}
	async rename(params) {
		const { from: source, to: target } = this.resolveRenameTargets(params);
		if (normalizeMxcPathForComparison(source.mount.hostRoot) !== normalizeMxcPathForComparison(target.mount.hostRoot)) throw new Error(`Sandbox rename must stay within the same mounted root: ${source.containerPath} -> ${target.containerPath}`);
		const root$1 = await root(source.mount.hostRoot);
		const targetParent = path.dirname(target.relativePath);
		if (targetParent !== "." && targetParent !== "") await root$1.mkdir(targetParent);
		await root$1.move(source.relativePath, target.relativePath, { overwrite: true });
	}
	async stat(params) {
		const target = this.resolveTarget(params);
		const root$2 = await root(target.mount.hostRoot);
		if (!await root$2.exists(target.relativePath)) return null;
		const stats = await root$2.stat(target.relativePath);
		return {
			type: stats.isDirectory ? "directory" : stats.isFile ? "file" : "other",
			size: stats.size,
			mtimeMs: stats.mtimeMs
		};
	}
	resolveTarget(params) {
		const input = params.filePath.trim();
		const cwd = params.cwd?.trim() ? path.resolve(params.cwd) : this.defaultContainerRoot;
		const containerPath = path.isAbsolute(input) ? path.resolve(input) : path.resolve(cwd, input);
		for (const mount of [...this.protectedSkillMounts, ...this.workspaceMounts]) {
			if (!isPathInside(mount.containerRoot, containerPath)) continue;
			const mountRelativePath = path.relative(mount.containerRoot, containerPath);
			return {
				hostPath: path.join(mount.hostRoot, mountRelativePath),
				relativePath: mountRelativePath,
				containerPath,
				mount
			};
		}
		const allowedRoots = [...new Set(this.workspaceMounts.map((mount) => mount.containerRoot))].join(", ");
		throw new Error(`Path escapes sandbox root (${allowedRoots}; container root ${this.sandbox.containerWorkdir}): ${params.filePath}. Use a path under ${this.sandbox.containerWorkdir}\\ instead.`);
	}
	ensureWritable(target, action) {
		if (!target.mount.writable) throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
	}
};
function resolveWorkspaceMounts(sandbox) {
	const containerRoot = path.resolve(sandbox.containerWorkdir);
	const workspaceDir = path.resolve(sandbox.workspaceDir);
	const agentWorkspaceDir = path.resolve(sandbox.agentWorkspaceDir);
	const writable = sandbox.workspaceAccess === "rw";
	const mounts = [{
		hostRoot: writable ? agentWorkspaceDir : workspaceDir,
		containerRoot,
		writable
	}];
	if (sandbox.workspaceAccess === "ro" && normalizeMxcPathForComparison(agentWorkspaceDir) !== normalizeMxcPathForComparison(workspaceDir)) mounts.push({
		hostRoot: agentWorkspaceDir,
		containerRoot: agentWorkspaceDir,
		writable: false
	});
	return dedupeAndSortMounts(mounts);
}
function resolveMxcProtectedSkillMounts(sandbox) {
	return dedupeAndSortMounts(resolveMxcReadOnlySkillMounts({
		agentWorkspaceDir: sandbox.agentWorkspaceDir,
		skillsWorkspaceDir: sandbox.skillsWorkspaceDir,
		workdir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess
	}).map((mount) => ({
		hostRoot: path.resolve(mount.hostPath),
		containerRoot: path.resolve(mount.containerPath),
		writable: false
	})));
}
function dedupeAndSortMounts(mounts) {
	const deduped = /* @__PURE__ */ new Map();
	for (const mount of mounts) {
		const key = `${normalizeMxcPathForComparison(mount.hostRoot)}::${normalizeMxcPathForComparison(mount.containerRoot)}`;
		if (!deduped.has(key)) deduped.set(key, mount);
	}
	return [...deduped.values()].toSorted((left, right) => right.containerRoot.length - left.containerRoot.length || right.hostRoot.length - left.hostRoot.length);
}
//#endregion
//#region extensions/mxc/src/sandbox-baseline.ts
function firstNonBlankEnv(...values) {
	return values.find((value) => value?.trim());
}
function resolveSandboxTempDir(env = {}) {
	return firstNonBlankEnv(env.TEMP, env.TMP) ?? "C:\\Windows\\Temp";
}
function resolveBaselineReadonlyPaths(env) {
	const systemRoot = firstNonBlankEnv(env.SystemRoot, env.WINDIR) ?? "C:\\Windows";
	const programFiles = firstNonBlankEnv(env.ProgramFiles, env.ProgramW6432) ?? "C:\\Program Files";
	const programFilesX86 = firstNonBlankEnv(env["ProgramFiles(x86)"]) ?? "C:\\Program Files (x86)";
	return [.../* @__PURE__ */ new Set([
		programFiles,
		programFilesX86,
		win32.join(systemRoot, "System32"),
		win32.join(systemRoot, "SysWOW64")
	])];
}
//#endregion
//#region extensions/mxc/src/windows-command.ts
function resolveCmdShell() {
	return process.env.ComSpec?.trim() || "cmd.exe";
}
function buildCommandLine(commandScript, args) {
	const shell = resolveCmdShell();
	if (args.length === 0) return `${shell} /d /s /c "${commandScript}"`;
	const escapedArgs = args.map(cmdArgumentEscape).join(" ");
	return `${shell} /d /s /c "${cmdArgumentEscape(commandScript)} ${escapedArgs}"`;
}
function cmdArgumentEscape(value) {
	return `"${value.replaceAll("^", "^^").replaceAll("%", "%%").replaceAll(`"`, `""`)}"`;
}
function createWindowsCommandBridge(params) {
	if (!params.args || params.args.length === 0) return {
		command: params.script,
		cleanup: () => {}
	};
	const bridgeDir = mkdtempSync(path.join(params.tempDir, ".openclaw-mxc-cmd-"));
	const commandFile = path.join(bridgeDir, `${randomBytes(8).toString("hex")}.cmd`);
	try {
		writeFileSync(commandFile, `@echo off\r\n${params.script}`, {
			flag: "wx",
			mode: 384
		});
	} catch (err) {
		rmSync(bridgeDir, {
			force: true,
			recursive: true
		});
		throw err;
	}
	return {
		command: commandFile,
		cleanup: () => rmSync(bridgeDir, {
			force: true,
			recursive: true
		})
	};
}
//#endregion
//#region extensions/mxc/src/windows-env.ts
const WINDOWS_PROCESS_ENV_DEFAULT_KEYS = [
	"SystemRoot",
	"SystemDrive",
	"ComSpec",
	"WINDIR",
	"PATH",
	"PATHEXT",
	"TEMP",
	"TMP",
	"USERPROFILE",
	"APPDATA",
	"LOCALAPPDATA",
	"ProgramData",
	"ALLUSERSPROFILE",
	"ProgramFiles",
	"ProgramFiles(x86)",
	"ProgramW6432",
	"CommonProgramFiles",
	"CommonProgramFiles(x86)",
	"CommonProgramW6432",
	"PUBLIC",
	"HOMEDRIVE",
	"HOMEPATH",
	"USERNAME",
	"USERDOMAIN",
	"COMPUTERNAME",
	"OS",
	"PROCESSOR_ARCHITECTURE",
	"PROCESSOR_IDENTIFIER",
	"PROCESSOR_LEVEL",
	"PROCESSOR_REVISION",
	"NUMBER_OF_PROCESSORS"
];
const LAUNCHER_ENV_KEYS = [
	"SystemRoot",
	"SystemDrive",
	"ComSpec",
	"WINDIR",
	"PATH",
	"PATHEXT",
	"TEMP",
	"TMP",
	"USERPROFILE",
	"APPDATA",
	"LOCALAPPDATA",
	"ProgramFiles",
	"ProgramFiles(x86)",
	"ProgramW6432"
];
function getEnvValueCaseInsensitive(env, key) {
	const exact = env[key];
	if (exact !== void 0) return exact;
	const normalizedKey = key.toLowerCase();
	return Object.entries(env).find(([candidate]) => candidate.toLowerCase() === normalizedKey)?.[1];
}
function setCaseInsensitiveEnvEntry(entries, key, value) {
	if (!key || key.includes("=") || value === void 0) return;
	entries.set(key.toLowerCase(), {
		key,
		value
	});
}
function normalizeWindowsProcessEnvRecord(callerEnv, hostEnv = process.env) {
	const entries = /* @__PURE__ */ new Map();
	for (const key of WINDOWS_PROCESS_ENV_DEFAULT_KEYS) setCaseInsensitiveEnvEntry(entries, key, getEnvValueCaseInsensitive(hostEnv, key));
	for (const [key, value] of Object.entries(callerEnv)) setCaseInsensitiveEnvEntry(entries, key, value);
	return [...entries.values()].toSorted((a, b) => a.key.localeCompare(b.key)).map(({ key, value }) => `${key}=${value}`);
}
function buildLauncherEnv(hostEnv = process.env) {
	const env = {};
	for (const key of LAUNCHER_ENV_KEYS) {
		const value = getEnvValueCaseInsensitive(hostEnv, key);
		if (value !== void 0) env[key] = value;
	}
	return env;
}
//#endregion
//#region extensions/mxc/src/mxc-container-config.ts
const MXC_SCHEMA_VERSION = "0.7.0-alpha";
function resolveCurrentBaselineContext(projectDir) {
	return {
		projectDir: path.resolve(projectDir),
		hostEnv: {
			SystemRoot: process.env.SystemRoot,
			WINDIR: process.env.WINDIR,
			ProgramFiles: process.env.ProgramFiles,
			ProgramW6432: process.env.ProgramW6432,
			"ProgramFiles(x86)": process.env["ProgramFiles(x86)"],
			TEMP: process.env.TEMP,
			TMP: process.env.TMP
		}
	};
}
function resolveMxcWorkspaceContext(params) {
	const workspaceAccess = params.workspaceAccess ?? "rw";
	const workspaceDir = path.resolve(params.workdir);
	const agentWorkspaceDir = path.resolve(params.agentWorkspaceDir ?? params.workdir);
	return {
		workspaceDir,
		agentWorkspaceDir,
		activeWorkspaceDir: workspaceAccess === "rw" ? agentWorkspaceDir : workspaceDir,
		...params.skillsWorkspaceDir ? { skillsWorkspaceDir: path.resolve(params.skillsWorkspaceDir) } : {},
		workdir: workspaceDir,
		workspaceAccess
	};
}
function resolveMxcRuntimeWorkdir(workspace, requestedWorkdir) {
	if (workspace.workspaceAccess !== "rw") return path.resolve(requestedWorkdir);
	const relativePath = path.relative(workspace.workspaceDir, requestedWorkdir);
	return relativePath === "" ? workspace.activeWorkspaceDir : path.join(workspace.activeWorkspaceDir, relativePath);
}
function buildMxcContainerConfig(params) {
	const networkAllowed = params.config.network === "default";
	const filesystem = buildFilesystemConfig({
		baseline: params.baseline,
		context: params.baselineContext,
		sandboxTempDir: params.sandboxTempDir,
		workspace: params.workspace
	});
	const processEnv = normalizeWindowsProcessEnvRecord({
		...params.env,
		TEMP: params.sandboxTempDir,
		TMP: params.sandboxTempDir
	});
	return {
		version: MXC_SCHEMA_VERSION,
		containerId: params.containerId,
		containment: params.config.containment,
		lifecycle: {
			destroyOnExit: true,
			preservePolicy: false
		},
		process: {
			commandLine: buildCommandLine(params.command, params.args ?? []),
			cwd: params.workdir,
			env: processEnv,
			timeout: resolveProcessTimeoutSeconds(params.config, params.baseline) * 1e3
		},
		filesystem,
		ui: {
			disable: true,
			clipboard: "none",
			injection: false
		},
		network: {
			defaultPolicy: networkAllowed ? "allow" : "block",
			enforcementMode: "capabilities"
		},
		processContainer: {
			leastPrivilege: true,
			capabilities: networkAllowed ? ["internetClient"] : [],
			ui: {
				isolation: "container",
				desktopSystemControl: false,
				systemSettings: "none",
				ime: false
			}
		}
	};
}
function buildFilesystemConfig(params) {
	const readwritePathSpecs = [];
	const readonlyPathSpecs = [];
	const workspace = params.workspace;
	if (workspace.workspaceAccess === "rw") readwritePathSpecs.push(requiredFilesystemPath(workspace.activeWorkspaceDir));
	else {
		readonlyPathSpecs.push(requiredFilesystemPath(workspace.workspaceDir));
		if (workspace.workspaceAccess === "ro" && normalizeMxcPathForComparison(workspace.agentWorkspaceDir) !== normalizeMxcPathForComparison(workspace.workspaceDir)) readonlyPathSpecs.push(requiredFilesystemPath(workspace.agentWorkspaceDir));
	}
	readonlyPathSpecs.push(...resolveBaselineReadonlyPaths(params.context.hostEnv).map((candidatePath) => optionalFilesystemPath(path.resolve(candidatePath))), ...params.baseline.configuredPaths.readonlyPaths.map(createConfiguredFilesystemPath), ...resolveMxcProtectedSkillPolicyPaths(workspace).map(optionalFilesystemPath));
	const projectDirPath = params.context.projectDir;
	if (params.workspace.workspaceAccess === "rw") readwritePathSpecs.push(requiredFilesystemPath(projectDirPath));
	else readonlyPathSpecs.push(requiredFilesystemPath(projectDirPath));
	readwritePathSpecs.push(requiredFilesystemPath(path.resolve(params.sandboxTempDir)));
	readwritePathSpecs.push(...params.baseline.configuredPaths.readwritePaths.map(createConfiguredFilesystemPath));
	const protectedSkillPolicyPaths = resolveMxcProtectedSkillPolicyPaths(params.workspace);
	assertNoMxcReadwriteReadonlyOverlap({
		readwritePaths: resolveExistingFilesystemPaths(readwritePathSpecs, "readwrite"),
		readonlyPaths: protectedSkillPolicyPaths
	});
	const readonlyPaths = resolveExistingFilesystemPaths(readonlyPathSpecs, "read-only");
	const readwritePaths = resolveExistingFilesystemPaths(readwritePathSpecs, "readwrite");
	assertNoMxcReadwriteReadonlyOverlap({
		readwritePaths,
		readonlyPaths
	});
	return {
		readonlyPaths,
		deniedPaths: void 0,
		readwritePaths
	};
}
function resolveMxcProtectedSkillPolicyPaths(context) {
	const deduped = /* @__PURE__ */ new Map();
	for (const mount of resolveMxcReadOnlySkillMounts(context)) {
		const hostPath = path.resolve(mount.hostPath);
		deduped.set(normalizeMxcPathForComparison(hostPath), hostPath);
		const containerPath = path.resolve(mount.containerPath);
		deduped.set(normalizeMxcPathForComparison(containerPath), containerPath);
	}
	return [...deduped.values()];
}
function resolveExistingFilesystemPaths(pathSpecs, accessLabel) {
	const deduped = /* @__PURE__ */ new Map();
	for (const pathSpec of pathSpecs) {
		const key = normalizeMxcPathForComparison(pathSpec.path);
		const existing = deduped.get(key);
		if (existing) {
			existing.required ||= pathSpec.required;
			for (const source of pathSpec.sources ?? []) existing.sources.add(source);
			continue;
		}
		deduped.set(key, {
			path: pathSpec.path,
			required: pathSpec.required,
			sources: new Set(pathSpec.sources ?? [])
		});
	}
	const resolvedPaths = [];
	for (const pathSpec of deduped.values()) {
		if (hostPathExists(pathSpec.path)) {
			resolvedPaths.push(pathSpec.path);
			continue;
		}
		if (!pathSpec.required) continue;
		throw new Error(buildMissingFilesystemPathMessage(pathSpec.path, accessLabel, pathSpec.sources));
	}
	return resolvedPaths;
}
function requiredFilesystemPath(pathValue) {
	return {
		path: path.resolve(pathValue),
		required: true
	};
}
function optionalFilesystemPath(pathValue) {
	return {
		path: path.resolve(pathValue),
		required: false
	};
}
function createConfiguredFilesystemPath(pathEntry) {
	return {
		path: path.resolve(pathEntry.path),
		required: true,
		sources: pathEntry.sources
	};
}
function buildMissingFilesystemPathMessage(pathValue, accessLabel, sources) {
	const sourceLabel = [...sources].join(", ");
	if (sourceLabel) return `MXC sandbox ${accessLabel} path ${pathValue} configured by ${sourceLabel} is missing on the host. Recreate the path or update the policy file before launching the sandbox.`;
	return `MXC sandbox ${accessLabel} path ${pathValue} does not exist on the host.`;
}
function resolveProcessTimeoutSeconds(config, baseline) {
	if (config.timeoutSecondsConfigured === true) return Math.min(config.timeoutSeconds, baseline.process.timeoutSeconds);
	return baseline.process.timeoutSeconds;
}
function assertNoMxcReadwriteReadonlyOverlap(params) {
	for (const readwritePath of params.readwritePaths) for (const readonlyPath of params.readonlyPaths) if (pathsOverlap(readwritePath, readonlyPath)) throw new Error(`MXC readwrite path ${readwritePath} overlaps read-only path ${readonlyPath}. Windows MXC cannot safely enforce nested read-only overlays under writable paths.`);
}
function pathsOverlap(first, second) {
	const left = normalizeMxcPathForComparison(first);
	const right = normalizeMxcPathForComparison(second);
	return isPathInside(left, right) || isPathInside(right, left);
}
function hostPathExists(candidatePath) {
	try {
		statSync(candidatePath);
		return true;
	} catch (err) {
		if (isNodeError$1(err)) return false;
		throw err;
	}
}
function isNodeError$1(err) {
	return err instanceof Error && "code" in err;
}
//#endregion
//#region extensions/mxc/src/plugin-root.ts
function isMxcPluginRoot(dir) {
	return fs.existsSync(path.join(dir, "openclaw.plugin.json")) && fs.existsSync(path.join(dir, "package.json"));
}
function resolveMxcPluginRoot(moduleUrl = import.meta.url) {
	let cursor = path.dirname(fileURLToPath(moduleUrl));
	for (let i = 0; i < 6; i += 1) {
		if (isMxcPluginRoot(cursor)) return cursor;
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	throw new Error(`[mxc] cannot locate plugin root from ${moduleUrl}`);
}
function resolveMxcLauncherPath(moduleUrl = import.meta.url) {
	const root = resolveMxcPluginRoot(moduleUrl);
	const sourceLauncher = path.join(root, "src", "mxc-spawn-launcher.mjs");
	const rootDistLauncher = path.join(root, "mxc-spawn-launcher.mjs");
	const packageDistLauncher = path.join(root, "dist", "mxc-spawn-launcher.mjs");
	if (fs.existsSync(sourceLauncher)) return sourceLauncher;
	if (fs.existsSync(rootDistLauncher)) return rootDistLauncher;
	if (fs.existsSync(packageDistLauncher)) return packageDistLauncher;
	throw new Error(`[mxc] launcher not found; searched ${sourceLauncher}, ${rootDistLauncher}, and ${packageDistLauncher}`);
}
//#endregion
//#region extensions/mxc/src/sandbox-policy-loader.ts
const stringArraySchema = z.array(z.string());
const hardeningBooleanSchema = z.literal(true);
const filesystemPolicySchema = z.object({
	restrictToProjectDir: hardeningBooleanSchema.optional(),
	additionalReadonlyPaths: stringArraySchema.optional(),
	additionalReadwritePaths: stringArraySchema.optional()
}).strict();
const processPolicySchema = z.object({ timeoutSeconds: z.number().finite().min(1).optional() }).strict();
const SandboxPolicyLayerSchema = z.object({
	filesystem: filesystemPolicySchema.optional(),
	process: processPolicySchema.optional()
}).strict();
function loadSandboxBaselinePolicy(options = {}) {
	return mergeSandboxPolicyLayers((options.policyPaths ?? []).map(readSandboxPolicyFile));
}
function readSandboxPolicyFile(policyPath) {
	try {
		return parseSandboxPolicyLayer(JSON.parse(readFileSync(policyPath, "utf-8")), policyPath);
	} catch (err) {
		throw policyFileError(policyPath, err);
	}
}
function parseSandboxPolicyLayer(value, sourceLabel) {
	const parsed = SandboxPolicyLayerSchema.safeParse(value);
	if (!parsed.success) throw new TypeError(formatSandboxPolicyIssue(sourceLabel, parsed.error.issues[0]));
	const filesystem = parsed.data.filesystem;
	const readonlyPaths = normalizeConfiguredPaths(filesystem?.additionalReadonlyPaths, sourceLabel, "filesystem.additionalReadonlyPaths");
	const readwritePaths = normalizeConfiguredPaths(filesystem?.additionalReadwritePaths, sourceLabel, "filesystem.additionalReadwritePaths");
	return {
		process: parsed.data.process,
		configuredPaths: {
			readonlyPaths,
			readwritePaths
		}
	};
}
function mergeSandboxPolicyLayers(layers) {
	const timeoutCandidates = [300];
	const configuredPathMaps = {
		readonlyPaths: /* @__PURE__ */ new Map(),
		readwritePaths: /* @__PURE__ */ new Map()
	};
	for (const policy of layers) {
		mergeConfiguredPathEntries(configuredPathMaps.readonlyPaths, policy.configuredPaths.readonlyPaths);
		mergeConfiguredPathEntries(configuredPathMaps.readwritePaths, policy.configuredPaths.readwritePaths);
		const timeoutSeconds = policy.process?.timeoutSeconds;
		if (timeoutSeconds !== void 0) timeoutCandidates.push(timeoutSeconds);
	}
	return {
		process: { timeoutSeconds: Math.min(...timeoutCandidates) },
		configuredPaths: {
			readonlyPaths: [...configuredPathMaps.readonlyPaths.values()],
			readwritePaths: [...configuredPathMaps.readwritePaths.values()]
		}
	};
}
function mergeConfiguredPathEntries(target, entries) {
	for (const entry of entries) {
		const existing = target.get(entry.path);
		if (!existing) {
			target.set(entry.path, entry);
			continue;
		}
		target.set(entry.path, {
			path: entry.path,
			sources: [.../* @__PURE__ */ new Set([...existing.sources, ...entry.sources])]
		});
	}
}
function normalizeConfiguredPaths(values, sourceLabel, field) {
	if (!values || values.length === 0) return [];
	const deduped = /* @__PURE__ */ new Map();
	for (const [index, value] of values.entries()) {
		const source = `${sourceLabel}.${field}[${index}]`;
		const trimmed = value.trim();
		if (trimmed.length === 0) throw new TypeError(`Sandbox policy field ${source} must not be blank.`);
		if (!win32.isAbsolute(trimmed)) throw new TypeError(`Sandbox policy field ${source} must be an absolute Windows path.`);
		const normalized = win32.normalize(trimmed);
		assertConfiguredPathExists(normalized, source);
		const existing = deduped.get(normalized);
		if (!existing) {
			deduped.set(normalized, {
				path: normalized,
				sources: [source]
			});
			continue;
		}
		deduped.set(normalized, {
			path: normalized,
			sources: [.../* @__PURE__ */ new Set([...existing.sources, source])]
		});
	}
	return [...deduped.values()];
}
function assertConfiguredPathExists(pathValue, source) {
	try {
		statSync(pathValue);
	} catch (err) {
		if (isNodeError(err)) {
			if (err.code === "ENOENT") throw new Error(`Sandbox policy path ${pathValue} configured by ${source} does not exist on the host. Create the path or update the policy file.`, { cause: err });
			throw new Error(`Sandbox policy path ${pathValue} configured by ${source} is not accessible on the host: ${formatErrorMessage(err)}`, { cause: err });
		}
		throw err;
	}
}
function policyFileError(policyPath, err) {
	if (isNodeError(err) && err.code === "ENOENT") return new Error(`Configured sandbox policy file ${policyPath} does not exist. Remove it from mxcPolicyPaths or create the file.`, { cause: err });
	return new Error(`Failed to load sandbox policy file at ${policyPath}: ${formatErrorMessage(err)}`, { cause: err instanceof Error ? err : void 0 });
}
function formatSandboxPolicyIssue(sourceLabel, issue) {
	if (!issue) return `Sandbox policy at ${sourceLabel} is invalid.`;
	if (issue.path.length === 0 && issue.code === "invalid_type") return `Sandbox policy at ${sourceLabel} must be a JSON object.`;
	const fieldLabel = `${sourceLabel}${formatIssuePath(issue.path)}`;
	if (issue.code === "unrecognized_keys" && issue.keys.length > 0) return `Sandbox policy field ${fieldLabel}.${issue.keys[0]} is not supported.`;
	if (issue.code === "invalid_type" && issue.path.length === 1) return `Sandbox policy section ${fieldLabel} must be a JSON object.`;
	if (issue.code === "too_small") return `Sandbox policy field ${fieldLabel} must be a positive number.`;
	return `Sandbox policy field ${fieldLabel} ${issue.message}.`;
}
function formatIssuePath(pathSegments) {
	let label = "";
	for (const segment of pathSegments) {
		if (typeof segment === "number") {
			label += `[${segment}]`;
			continue;
		}
		label += `.${String(segment)}`;
	}
	return label;
}
function isNodeError(err) {
	return err instanceof Error && "code" in err;
}
//#endregion
//#region extensions/mxc/src/mxc-backend.ts
const CONTAINER_ID_MAX_LEN = 64;
function uniqueContainerId(runtimeId) {
	const suffix = randomBytes(4).toString("hex");
	return `${runtimeId.length + suffix.length + 1 > CONTAINER_ID_MAX_LEN ? runtimeId.slice(0, CONTAINER_ID_MAX_LEN - suffix.length - 1) : runtimeId}-${suffix}`;
}
function cleanupLauncherPayloadFile(token) {
	if (token && typeof token === "object" && "payloadDir" in token && typeof token.payloadDir === "string") {
		rmSync(token.payloadDir, {
			force: true,
			recursive: true
		});
		if ("sandboxTempDir" in token && typeof token.sandboxTempDir === "string") rmSync(token.sandboxTempDir, {
			force: true,
			recursive: true
		});
	}
}
function createSandboxTempDir(hostEnv) {
	return mkdtempSync(path.join(resolveSandboxTempDir(hostEnv), "openclaw-mxc-sandbox-"));
}
function resolveWorkdirInsideWorkspace(workspaceDir, workdir) {
	const workspace = realpathForExistingPath(workspaceDir, "sandbox workspace");
	try {
		const { existingPath, unresolvedSegments } = resolvePathPrefixSync(workdir);
		const candidate = path.join(existingPath, ...unresolvedSegments);
		if (!isPathInside(workspace, candidate)) throw new Error(`MXC sandbox workdir ${workdir} is outside the sandbox workspace ${workspaceDir}. Use a workdir inside the sandbox workspace.`);
		if (statSync(candidate).isDirectory()) return candidate;
	} catch (err) {
		if (isMissingPathError(err)) throw new Error(`MXC sandbox workdir ${workdir} does not exist.`, { cause: err });
		throw err;
	}
	throw new Error(`MXC sandbox workdir ${workdir} is not a directory.`);
}
function realpathForExistingPath(value, label) {
	try {
		return realpathSync(path.resolve(value));
	} catch (err) {
		if (isMissingPathError(err)) throw new Error(`MXC ${label} ${value} does not exist.`, { cause: err });
		throw err;
	}
}
function isMissingPathError(err) {
	const code = extractErrorCode(err);
	return code === "ENOENT" || code === "ENOTDIR";
}
function createMxcLauncherPayload(config, payload, usePty, sandboxTempDir) {
	const payloadJson = JSON.stringify({
		config: payload,
		options: {
			debug: config.debug ?? false,
			executablePath: resolveMxcBinaryPath(config.mxcBinaryPath),
			...!usePty ? { usePty: false } : {}
		}
	});
	const payloadDir = mkdtempSync(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-mxc-payload-"));
	const payloadFile = path.join(payloadDir, "payload.json");
	try {
		writeFileSync(payloadFile, payloadJson, {
			flag: "wx",
			mode: 384
		});
	} catch (err) {
		rmSync(payloadDir, {
			force: true,
			recursive: true
		});
		throw err;
	}
	return {
		payloadDir,
		payloadFile,
		sandboxTempDir
	};
}
/**
* Creates a SandboxBackendHandle for a specific session.
*/
function createMxcSandboxBackendHandle(params) {
	const baseline = loadSandboxBaselinePolicy({ policyPaths: params.config.mxcPolicyPaths });
	return {
		id: "mxc",
		runtimeId: params.runtimeId,
		runtimeLabel: params.runtimeId,
		workdir: params.workdir,
		workdirValidation: "backend",
		async validateWorkdir(workdir) {
			try {
				return resolveWorkdirInsideWorkspace(params.workdir, workdir);
			} catch (err) {
				if (err instanceof Error && err.message.startsWith("MXC sandbox workdir")) return null;
				throw err;
			}
		},
		capabilities: {},
		async buildExecSpec({ command, workdir, env, usePty }) {
			const effectiveWorkdir = resolveWorkdirInsideWorkspace(params.workdir, workdir ?? params.workdir);
			const workspaceAccess = params.workspaceAccess ?? "rw";
			const workspace = resolveMxcWorkspaceContext({
				...params,
				workspaceAccess
			});
			const runtimeWorkdir = resolveMxcRuntimeWorkdir(workspace, effectiveWorkdir);
			const baselineContext = resolveCurrentBaselineContext(workspace.activeWorkspaceDir);
			const sandboxTempDir = createSandboxTempDir(baselineContext.hostEnv);
			try {
				const payload = buildMxcContainerConfig({
					config: params.config,
					baseline,
					baselineContext,
					containerId: uniqueContainerId(params.runtimeId),
					command,
					sandboxTempDir,
					workdir: runtimeWorkdir,
					workspace,
					env
				});
				const payloadFile = createMxcLauncherPayload(params.config, payload, usePty, sandboxTempDir);
				return {
					argv: [
						process.execPath,
						resolveMxcLauncherPath(),
						"--payload-file",
						payloadFile.payloadFile
					],
					env: buildLauncherEnv(),
					stdinMode: usePty ? "pipe-open" : "pipe-closed",
					finalizeToken: payloadFile
				};
			} catch (err) {
				rmSync(sandboxTempDir, {
					force: true,
					recursive: true
				});
				throw err;
			}
		},
		async finalizeExec({ token }) {
			cleanupLauncherPayloadFile(token);
		},
		createFsBridge: ({ sandbox }) => createMxcFsBridge({ sandbox }),
		async runShellCommand(cmdParams) {
			const restrictiveConfig = {
				...params.config,
				network: "none",
				timeoutSeconds: 30,
				timeoutSecondsConfigured: true
			};
			const effectiveWorkdir = path.resolve(params.workdir);
			const workspaceAccess = params.workspaceAccess ?? "rw";
			const workspace = resolveMxcWorkspaceContext({
				...params,
				workspaceAccess
			});
			const runtimeWorkdir = resolveMxcRuntimeWorkdir(workspace, effectiveWorkdir);
			const baselineContext = resolveCurrentBaselineContext(workspace.activeWorkspaceDir);
			const sandboxTempDir = createSandboxTempDir(baselineContext.hostEnv);
			let commandBridge;
			try {
				commandBridge = createWindowsCommandBridge({
					args: cmdParams.args,
					script: cmdParams.script,
					tempDir: sandboxTempDir
				});
				const execInput = Buffer.isBuffer(cmdParams.stdin) ? cmdParams.stdin : Buffer.from(cmdParams.stdin ?? "", "utf-8");
				const payloadFile = createMxcLauncherPayload(restrictiveConfig, buildMxcContainerConfig({
					config: restrictiveConfig,
					baseline,
					baselineContext,
					containerId: uniqueContainerId(params.runtimeId),
					command: commandBridge.command,
					args: cmdParams.args,
					sandboxTempDir,
					workdir: runtimeWorkdir,
					workspace,
					env: {}
				}), false, sandboxTempDir);
				const argv = [
					process.execPath,
					resolveMxcLauncherPath(),
					"--payload-file",
					payloadFile.payloadFile
				];
				try {
					const result = await runCommandBuffered(argv, {
						baseEnv: buildLauncherEnv(),
						input: execInput,
						maxOutputBytes: {
							stdout: 10485760,
							stderr: 10485760
						},
						signal: cmdParams.signal,
						timeoutMs: 3e4
					});
					if (cmdParams.signal?.aborted) throw cmdParams.signal.reason instanceof Error ? cmdParams.signal.reason : result.error ?? /* @__PURE__ */ new Error("MXC command aborted");
					const { stdout, stderr } = result;
					const code = result.termination === "exit" ? result.code ?? 1 : 1;
					if ((result.termination !== "exit" || code !== 0) && !cmdParams.allowFailure) {
						const commandError = result.error ?? /* @__PURE__ */ new Error(result.termination === "exit" ? `MXC command exited with code ${code}` : `MXC command terminated: ${result.termination}`);
						throw Object.assign(commandError, {
							stdout,
							stderr,
							status: code
						});
					}
					return {
						stdout,
						stderr,
						code
					};
				} finally {
					cleanupLauncherPayloadFile(payloadFile);
				}
			} finally {
				commandBridge?.cleanup();
				rmSync(sandboxTempDir, {
					force: true,
					recursive: true
				});
			}
		}
	};
}
/** Manager for `openclaw sandbox list` and `openclaw sandbox remove`. */
const mxcSandboxBackendManager = {
	async describeRuntime() {
		return {
			running: false,
			actualConfigLabel: "mxc-process",
			configLabelMatch: true
		};
	},
	async removeRuntime() {}
};
//#endregion
//#region extensions/mxc/src/mxc-backend-factory.ts
function sanitizeRuntimeId(value) {
	if (/:workspace:[a-f0-9]{32}$/i.test(value.trim())) return `openclaw-mxc-workspace-${createHash("sha256").update(value).digest("hex").slice(0, 32)}`;
	const slug = value.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
	const hash = createHash("sha256").update(value).digest("hex").slice(0, 8);
	return `openclaw-mxc-${slug || "sandbox"}-${hash}`;
}
/** Factory function called by OpenClaw when sandbox.backend=mxc. */
function createMxcSandboxBackendFactory(config) {
	return async function createMxcSandboxBackend(params) {
		if ((params.cfg.docker.binds?.length ?? 0) > 0) throw new Error("MXC sandbox backend does not support sandbox.docker.binds.");
		return createMxcSandboxBackendHandle({
			config,
			runtimeId: sanitizeRuntimeId(params.scopeKey),
			workdir: params.workspaceDir,
			agentWorkspaceDir: params.agentWorkspaceDir,
			...params.skillsWorkspaceDir ? { skillsWorkspaceDir: params.skillsWorkspaceDir } : {},
			workspaceAccess: params.cfg.workspaceAccess
		});
	};
}
//#endregion
//#region extensions/mxc/src/readiness.ts
const MxcProbeOutputSchema = z.object({
	tier: z.enum([
		"base-container",
		"appcontainer-bfs",
		"appcontainer-dacl"
	]).optional(),
	warnings: z.array(z.string()).default([]),
	error: z.string().optional()
});
function resolveWindowsSystemExecutable(name) {
	const systemRoot = process.env.SystemRoot || process.env.WINDIR;
	return path.win32.join(systemRoot || "C:\\Windows", "System32", name);
}
function probeMxcIsolationTier(executablePath) {
	const notReady = (reason, cause) => new Error(`[mxc] MXC Windows ProcessContainer sandbox is not ready: ${reason}. Run "${executablePath}" --probe for host details. The selected executor must be compatible with MXC 0.8.0 and support --probe. If mxcBinaryPath points to an older executor, update it or unset plugins.entries.mxc.config.mxcBinaryPath and restart the Gateway to use the bundled SDK executor.`, cause === void 0 ? void 0 : { cause });
	let output;
	try {
		output = execFileSync(executablePath, ["--probe"], {
			encoding: "utf-8",
			stdio: "pipe",
			timeout: 15e3,
			windowsHide: true
		});
	} catch (error) {
		throw notReady(`the MXC host probe failed${error instanceof Error && error.message ? `: ${error.message.trim()}` : ""}`, error);
	}
	let probe;
	try {
		probe = JSON.parse(output);
	} catch (error) {
		throw notReady("the MXC host probe did not return JSON", error);
	}
	const parsed = MxcProbeOutputSchema.safeParse(probe);
	if (!parsed.success) throw notReady("the MXC host probe returned an unexpected result", parsed.error);
	const { tier, warnings, error } = parsed.data;
	if (!tier) throw notReady(`MXC cannot select an isolation tier on this host (${error || "the probe reported no isolation tier"})`);
	return {
		tier,
		warnings
	};
}
function isSystemDrivePrepared() {
	const systemDrive = process.env.SystemDrive || "C:";
	let output;
	try {
		output = execFileSync(resolveWindowsSystemExecutable("icacls.exe"), [`${systemDrive}\\`], {
			encoding: "utf-8",
			stdio: "pipe",
			timeout: 5e3,
			windowsHide: true
		});
	} catch {
		return true;
	}
	return output.includes("S-1-15-2-1") || output.includes("APPLICATION PACKAGES");
}
function systemDrivePrepWarning(systemDrive) {
	return `[mxc] MXC sandbox host preparation incomplete: the system drive root (${systemDrive}\\) does not grant directory access to AppContainer processes, so directory listing (e.g. \`dir\`) inside the sandbox will fail with "Access is denied". Basic read/write workloads still run.\nFix (one-time, elevated): wxc-host-prep prepare-system-drive (ships with @microsoft/mxc-sdk).`;
}
/**
* Emits an advisory warning when the system drive is not prepared for
* AppContainer directory access. Non-fatal: the sandbox still activates.
*/
function warnMxcHostPrepIfNeeded() {
	if (process.platform !== "win32") return;
	if (!isSystemDrivePrepared()) console.warn(systemDrivePrepWarning(process.env.SystemDrive || "C:"));
}
/**
* Fails plugin activation unless MXC's host probe selects an isolation tier for
* `executablePath`. Degradation warnings from the probe are reported but do not
* block activation.
*/
function assertMxcReadiness(params) {
	if (process.platform !== "win32") return;
	const probe = probeMxcIsolationTier(params.executablePath);
	if (probe.warnings.length > 0) console.warn(`[mxc] MXC sandbox is using the ${probe.tier} isolation tier: ${probe.warnings.join("; ")}`);
}
//#endregion
//#region extensions/mxc/src/plugin.ts
function registerMxcPlugin(api) {
	if (api.registrationMode !== "full") return;
	const config = resolveConfig(api.pluginConfig);
	if (process.platform !== "win32") {
		console.warn(`[mxc] Sandbox backend is Windows-only and not available on ${process.platform}. Plugin will be dormant.`);
		return;
	}
	let mxcBinaryPath;
	try {
		mxcBinaryPath = resolveMxcBinaryPath(config.mxcBinaryPath);
	} catch (err) {
		const reason = err instanceof Error ? err.message : String(err);
		throw new Error(`[mxc] MXC sandbox backend cannot load: ${reason}. Install @microsoft/mxc-sdk or set mxcBinaryPath.`, { cause: err });
	}
	assertMxcReadiness({ executablePath: mxcBinaryPath });
	warnMxcHostPrepIfNeeded();
	const unregister = registerSandboxBackend("mxc", {
		factory: createMxcSandboxBackendFactory(config),
		manager: mxcSandboxBackendManager
	});
	api.lifecycle.registerRuntimeLifecycle({
		id: "mxc-sandbox-cleanup",
		cleanup: ({ reason, sessionKey, runId }) => {
			if (sessionKey !== void 0 || runId !== void 0) return;
			if (reason === "disable" || reason === "restart") unregister();
		}
	});
}
//#endregion
//#region extensions/mxc/index.ts
var mxc_default = definePluginEntry({
	id: "mxc",
	name: "MXC Sandbox Execution",
	description: "OS-level sandboxed tool execution via MXC: runs commands in a Windows ProcessContainer with configured MXC policy files.",
	configSchema: createMxcPluginConfigSchema(),
	register: registerMxcPlugin
});
//#endregion
export { mxc_default as default };

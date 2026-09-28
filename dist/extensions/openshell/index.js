import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { buildRemoteCommand, buildRemoteWorkdirValidationCommand, buildValidatedExecRemoteCommand, createRemoteShellSandboxFsBridge, createSshSandboxSessionFromConfigText, createWritableRenameTargetResolver, disposeSshSandboxSession, prepareSshSandboxExec, registerSandboxBackend, resolvePreferredOpenClawTmpDir, resolveReadOnlyWorkspaceSkillMounts, runPluginCommandWithTimeout, runSshSandboxCommand, sanitizeEnvVars, shellEscape, withTempWorkspace } from "openclaw/plugin-sdk/sandbox";
import { createHash } from "node:crypto";
import fsSync from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { movePathWithCopyFallback } from "@openclaw/fs-safe/atomic";
import { createDeferred, formatPluginConfigIssue, mapPluginConfigIssues } from "openclaw/plugin-sdk/extension-shared";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { FsSafeError, canonicalPathFromExistingAncestor, extractErrorCode } from "openclaw/plugin-sdk/security-runtime";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { MAX_TIMER_TIMEOUT_SECONDS } from "openclaw/plugin-sdk/number-runtime";
import { z } from "zod";
import { assertNoSymlinkParents, canonicalPathFromExistingAncestor as canonicalPathFromExistingAncestor$1, isPathInside, root } from "openclaw/plugin-sdk/file-access-runtime";
import pLimit from "p-limit";
//#region extensions/openshell/src/cli.ts
function buildOpenShellBaseArgv(config) {
	const argv = [config.command];
	if (config.gateway) argv.push("--gateway", config.gateway);
	if (config.gatewayEndpoint) argv.push("--gateway-endpoint", config.gatewayEndpoint);
	if (config.workspace) argv.push("--workspace", config.workspace);
	return argv;
}
function applyGatewayEndpointToSshConfig(params) {
	const endpoint = params.gatewayEndpoint?.trim();
	if (!endpoint) return params.configText;
	return params.configText.replace(/^(\s*ProxyCommand\s+)(.*)$/m, (line, prefix, command) => {
		if (!command.includes("ssh-proxy")) return line;
		if (/(^|\s)--server(\s|=)|(^|\s)--gateway-endpoint(\s|=)/.test(command)) return line;
		return `${prefix}${command} --server ${shellEscape(endpoint)}`;
	});
}
async function runOpenShellCli(params) {
	return await runPluginCommandWithTimeout({
		argv: [...buildOpenShellBaseArgv(params.context.config), ...params.args],
		cwd: params.cwd,
		timeoutMs: params.timeoutMs ?? params.context.timeoutMs ?? params.context.config.timeoutMs,
		env: process.env
	});
}
async function createOpenShellSshSession(params) {
	const result = await runOpenShellCli({
		context: params.context,
		args: [
			"sandbox",
			"ssh-config",
			params.context.sandboxName
		]
	});
	if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox ssh-config failed");
	return await createSshSandboxSessionFromConfigText({ configText: applyGatewayEndpointToSshConfig({
		configText: result.stdout,
		gatewayEndpoint: params.context.config.gatewayEndpoint
	}) });
}
//#endregion
//#region extensions/openshell/src/config.ts
const DEFAULT_COMMAND = "openshell";
const DEFAULT_MODE = "mirror";
const DEFAULT_SOURCE = "openclaw";
const DEFAULT_REMOTE_WORKSPACE_DIR = "/sandbox";
const DEFAULT_REMOTE_AGENT_WORKSPACE_DIR = "/agent";
const DEFAULT_TIMEOUT_MS = 12e4;
const OPEN_SHELL_MANAGED_REMOTE_ROOTS = [DEFAULT_REMOTE_WORKSPACE_DIR, DEFAULT_REMOTE_AGENT_WORKSPACE_DIR];
function normalizeProviders(value) {
	const seen = /* @__PURE__ */ new Set();
	const providers = [];
	for (const entry of value ?? []) {
		const normalized = entry.trim();
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		providers.push(normalized);
	}
	return providers;
}
const nonEmptyTrimmedString = (message) => z.string({ error: message }).trim().min(1, { error: message });
const openShellManagedRemotePath = (fieldName) => nonEmptyTrimmedString(`${fieldName} must be a non-empty string`).regex(/^\/(?:sandbox|agent)(?:\/|$)/, { error: (issue) => String(issue.input).startsWith("/") ? `OpenShell ${fieldName} must stay under /sandbox or /agent` : `OpenShell ${fieldName} must be absolute` }).refine((value) => isManagedOpenShellRemotePath(path.posix.normalize(value)), { error: `OpenShell ${fieldName} must stay under /sandbox or /agent` });
const openShellWorkspaceName = z.string({ error: "workspace must be a valid OpenShell workspace name" }).trim().min(1, { error: "workspace must be a valid OpenShell workspace name" }).max(19, { error: "workspace must be at most 19 characters" }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "workspace must contain lowercase alphanumeric characters or single hyphens and must not start or end with a hyphen" });
const OpenShellPluginConfigSchema = z.strictObject({
	mode: z.enum(["mirror", "remote"], { error: "mode must be one of mirror, remote" }).optional(),
	command: nonEmptyTrimmedString("command must be a non-empty string").optional(),
	gateway: nonEmptyTrimmedString("gateway must be a non-empty string").optional(),
	gatewayEndpoint: nonEmptyTrimmedString("gatewayEndpoint must be a non-empty string").optional(),
	workspace: openShellWorkspaceName.optional(),
	from: nonEmptyTrimmedString("from must be a non-empty string").optional(),
	policy: nonEmptyTrimmedString("policy must be a non-empty string").optional(),
	providers: z.array(z.string({ error: "providers must be an array of strings" }).trim().min(1, { error: "providers must be an array of strings" }), { error: "providers must be an array of strings" }).optional(),
	gpu: z.boolean({ error: "gpu must be a boolean" }).optional(),
	autoProviders: z.boolean({ error: "autoProviders must be a boolean" }).optional(),
	remoteWorkspaceDir: openShellManagedRemotePath("remoteWorkspaceDir").optional(),
	remoteAgentWorkspaceDir: openShellManagedRemotePath("remoteAgentWorkspaceDir").optional(),
	timeoutSeconds: z.number({ error: `timeoutSeconds must be a number between 1 and ${MAX_TIMER_TIMEOUT_SECONDS}` }).min(1, { error: "timeoutSeconds must be a number >= 1" }).max(MAX_TIMER_TIMEOUT_SECONDS, { error: `timeoutSeconds must be a number <= ${MAX_TIMER_TIMEOUT_SECONDS}` }).optional()
});
function isManagedOpenShellRemotePath(value) {
	return OPEN_SHELL_MANAGED_REMOTE_ROOTS.some((root) => value === root || value.startsWith(`${root}/`));
}
function normalizeOpenShellRemotePath(value, fallback, fieldName = "remote path") {
	const candidate = value ?? fallback;
	const normalized = path.posix.normalize(candidate.trim() || fallback);
	if (!normalized.startsWith("/")) throw new Error(`OpenShell ${fieldName} must be absolute: ${candidate}`);
	if (!isManagedOpenShellRemotePath(normalized)) throw new Error(`OpenShell ${fieldName} must stay under ${OPEN_SHELL_MANAGED_REMOTE_ROOTS.join(" or ")}: ${candidate}`);
	return normalized;
}
function createOpenShellPluginConfigSchema() {
	return buildPluginConfigSchema(OpenShellPluginConfigSchema, { safeParse(value) {
		if (value === void 0) return {
			success: true,
			data: void 0
		};
		const parsed = OpenShellPluginConfigSchema.safeParse(value);
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
function resolveOpenShellPluginConfig(value) {
	if (value === void 0) return {
		mode: DEFAULT_MODE,
		command: DEFAULT_COMMAND,
		gateway: void 0,
		gatewayEndpoint: void 0,
		workspace: void 0,
		from: DEFAULT_SOURCE,
		policy: void 0,
		providers: [],
		gpu: false,
		autoProviders: true,
		remoteWorkspaceDir: DEFAULT_REMOTE_WORKSPACE_DIR,
		remoteAgentWorkspaceDir: DEFAULT_REMOTE_AGENT_WORKSPACE_DIR,
		timeoutMs: DEFAULT_TIMEOUT_MS
	};
	const parsed = OpenShellPluginConfigSchema.safeParse(value);
	if (!parsed.success) {
		const message = formatPluginConfigIssue(parsed.error.issues[0]);
		throw new Error(`Invalid openshell plugin config: ${message}`);
	}
	const cfg = parsed.data;
	return {
		mode: cfg.mode ?? DEFAULT_MODE,
		command: cfg.command ?? DEFAULT_COMMAND,
		gateway: cfg.gateway,
		gatewayEndpoint: cfg.gatewayEndpoint,
		workspace: cfg.workspace,
		from: cfg.from ?? DEFAULT_SOURCE,
		policy: cfg.policy,
		providers: normalizeProviders(cfg.providers),
		gpu: cfg.gpu ?? false,
		autoProviders: cfg.autoProviders ?? true,
		remoteWorkspaceDir: normalizeOpenShellRemotePath(cfg.remoteWorkspaceDir, DEFAULT_REMOTE_WORKSPACE_DIR, "remoteWorkspaceDir"),
		remoteAgentWorkspaceDir: normalizeOpenShellRemotePath(cfg.remoteAgentWorkspaceDir, DEFAULT_REMOTE_AGENT_WORKSPACE_DIR, "remoteAgentWorkspaceDir"),
		timeoutMs: typeof cfg.timeoutSeconds === "number" ? Math.floor(cfg.timeoutSeconds * 1e3) : DEFAULT_TIMEOUT_MS
	};
}
//#endregion
//#region extensions/openshell/src/workspace-roots.ts
function remotePathDepth(remote) {
	return remote.split("/").filter(Boolean).length;
}
function workspaceRootOwnerOrder(owner) {
	return owner === "workspace" ? 0 : 1;
}
function isOpenShellRemotePathInside(root, candidate) {
	const relative = path.posix.relative(root, candidate);
	return relative === "" || relative !== ".." && !relative.startsWith("../") && !path.posix.isAbsolute(relative);
}
function orderOpenShellWorkspaceRoots(roots) {
	return roots.toSorted((a, b) => remotePathDepth(a.remote) - remotePathDepth(b.remote) || workspaceRootOwnerOrder(a.owner) - workspaceRootOwnerOrder(b.owner));
}
function resolveOpenShellWorkspaceRoot(roots, candidate) {
	return roots.toSorted((a, b) => remotePathDepth(b.remote) - remotePathDepth(a.remote) || workspaceRootOwnerOrder(a.owner) - workspaceRootOwnerOrder(b.owner)).find((root) => isOpenShellRemotePathInside(root.remote, candidate));
}
//#endregion
//#region extensions/openshell/src/fs-bridge.ts
function createOpenShellFsBridge(params) {
	return new OpenShellFsBridge(params.sandbox, params.backend);
}
var OpenShellFsBridge = class {
	constructor(sandbox, backend) {
		this.sandbox = sandbox;
		this.backend = backend;
		this.resolveRenameTargets = createWritableRenameTargetResolver((target) => this.resolveTarget(target), (target, action) => this.ensureWritable(target, action, true));
	}
	resolvePath(params) {
		const target = this.resolveTarget(params);
		return {
			hostPath: target.hostPath,
			relativePath: target.relativePath,
			containerPath: target.containerPath
		};
	}
	async readFile(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		let opened;
		try {
			await assertLocalPathSafety({
				target,
				allowFinalSymlinkForUnlink: false
			});
			const root$1 = await root(target.mountHostRoot);
			if (params.maxBytes !== void 0) return (await root$1.read(path.relative(target.mountHostRoot, hostPath), {
				hardlinks: "reject",
				maxBytes: params.maxBytes
			})).buffer;
			opened = await root$1.open(path.relative(target.mountHostRoot, hostPath), { hardlinks: "reject" });
			try {
				return await opened.handle.readFile();
			} finally {
				await opened.handle.close();
			}
		} catch (err) {
			throw new Error(`Sandbox boundary checks failed; cannot read files: ${target.containerPath}`, { cause: err });
		}
	}
	async readDirectory(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: false
		});
		return (await (await root(target.mountHostRoot)).list(relativeToRoot(target, hostPath), { withFileTypes: true })).map(({ name, isDirectory }) => ({
			name,
			isDirectory
		}));
	}
	async writeFile(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		this.ensureWritable(target, "write files");
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: false
		});
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		await (await root(target.mountHostRoot)).write(path.relative(target.mountHostRoot, hostPath), buffer, { mkdir: params.mkdir });
		await this.backend.syncLocalPathToRemote(hostPath, target.containerPath);
	}
	async createFileExclusive(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		this.ensureWritable(target, "create files");
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: false
		});
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const root$2 = await root(target.mountHostRoot);
		try {
			await root$2.create(path.relative(target.mountHostRoot, hostPath), buffer, { mkdir: params.mkdir !== false });
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "already-exists") return "exists";
			throw error;
		}
		await this.backend.syncLocalPathToRemote(hostPath, target.containerPath);
		return "created";
	}
	async mkdirp(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		this.ensureWritable(target, "create directories");
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: false
		});
		await this.backend.mkdirpRemotePath(target.containerPath, params.signal);
		await mkdirLocalRootPath({
			hostPath,
			target
		});
	}
	async remove(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		this.ensureWritable(target, "remove files", params.recursive);
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: true
		});
		await this.backend.removeRemotePath(target.containerPath, {
			recursive: params.recursive ?? false,
			signal: params.signal,
			ignoreMissing: params.force !== false
		});
		await removeLocalRootPath({
			force: params.force,
			hostPath,
			recursive: params.recursive,
			target
		});
	}
	async rename(params) {
		const { from, to } = this.resolveRenameTargets(params);
		const fromHostPath = this.requireHostPath(from);
		const toHostPath = this.requireHostPath(to);
		await assertLocalPathSafety({
			target: from,
			allowFinalSymlinkForUnlink: true
		});
		await assertLocalPathSafety({
			target: to,
			allowFinalSymlinkForUnlink: false
		});
		await assertRenameSourceSupported(fromHostPath);
		if (from.mountHostRoot !== to.mountHostRoot) throw new Error("OpenShell cross-root mirror renames require pinned fs-safe support");
		await assertSameDeviceRenameSupported({
			fromHostPath,
			root: from.mountHostRoot,
			toHostPath
		});
		await this.backend.renameRemotePath(from.containerPath, to.containerPath, params.signal);
		await moveLocalRootPath({
			from,
			fromHostPath,
			to,
			toHostPath
		});
	}
	async stat(params) {
		const target = this.resolveTarget(params);
		const hostPath = this.requireHostPath(target);
		const stats = await fsPromises.lstat(hostPath).catch(() => null);
		if (!stats) return null;
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: false
		});
		return {
			type: stats.isDirectory() ? "directory" : stats.isFile() ? "file" : "other",
			size: stats.size,
			mtimeMs: stats.mtimeMs
		};
	}
	ensureWritable(target, action, includeDescendants = false) {
		if (this.sandbox.workspaceAccess === "ro" || !target.writable || includeDescendants && this.readOnlyMounts().some((mount) => isOpenShellRemotePathInside(target.containerPath, mount.containerPath))) throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
	}
	readOnlyMounts() {
		const workdirs = [this.sandbox.containerWorkdir];
		if (this.sandbox.workspaceAccess !== "none" && path.resolve(this.sandbox.workspaceDir) !== path.resolve(this.sandbox.agentWorkspaceDir)) workdirs.push(this.backend.remoteAgentWorkspaceDir || "/agent");
		return [...workdirs.flatMap((workdir) => resolveReadOnlyWorkspaceSkillMounts({
			...this.sandbox,
			workdir
		})), ...this.sandbox.readOnlyResourceMounts ?? []];
	}
	requireHostPath(target) {
		if (!target.hostPath) throw new Error(`OpenShell mirror bridge requires a local host path: ${target.containerPath}`);
		return target.hostPath;
	}
	containerMounts(readOnlyMounts = this.readOnlyMounts()) {
		const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
		const agentRoot = path.resolve(this.sandbox.agentWorkspaceDir);
		const hasAgentMount = this.sandbox.workspaceAccess !== "none" && workspaceRoot !== agentRoot;
		const agentContainerRoot = (this.backend.remoteAgentWorkspaceDir || "/agent").replace(/\\/g, "/");
		const containerMounts = [{
			remote: this.sandbox.containerWorkdir.replace(/\\/g, "/"),
			owner: "workspace",
			value: {
				hostRoot: workspaceRoot,
				writable: this.sandbox.workspaceAccess !== "ro"
			}
		}, ...hasAgentMount ? [{
			remote: agentContainerRoot,
			owner: "agent",
			value: {
				hostRoot: agentRoot,
				writable: this.sandbox.workspaceAccess === "rw"
			}
		}] : []];
		containerMounts.unshift(...readOnlyMounts.map((mount) => ({
			remote: mount.containerPath,
			owner: resolveOpenShellWorkspaceRoot(containerMounts, mount.containerPath)?.owner ?? "workspace",
			value: {
				hostRoot: path.resolve(mount.hostPath),
				writable: false
			}
		})));
		return containerMounts;
	}
	get pathMappings() {
		return this.containerMounts().toSorted((a, b) => Number(a.owner === "agent") - Number(b.owner === "agent")).map((mount) => ({
			hostRoot: mount.value.hostRoot,
			containerRoot: mount.remote
		}));
	}
	resolveTarget(params) {
		const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
		const agentRoot = path.resolve(this.sandbox.agentWorkspaceDir);
		const hasAgentMount = this.sandbox.workspaceAccess !== "none" && workspaceRoot !== agentRoot;
		const agentContainerRoot = (this.backend.remoteAgentWorkspaceDir || "/agent").replace(/\\/g, "/");
		const workspaceContainerRoot = this.sandbox.containerWorkdir.replace(/\\/g, "/");
		const input = params.filePath.trim();
		const readOnlyMounts = this.readOnlyMounts();
		const containerMounts = this.containerMounts(readOnlyMounts);
		const resolveContainerTarget = (containerPath) => {
			const containerMount = resolveOpenShellWorkspaceRoot(containerMounts, containerPath);
			if (!containerMount) return;
			const relative = path.posix.relative(containerMount.remote, containerPath) || "";
			const hostPath = relative ? path.resolve(containerMount.value.hostRoot, ...relative.split("/")) : containerMount.value.hostRoot;
			if (!isPathInside(containerMount.value.hostRoot, hostPath)) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${input}`);
			return {
				hostPath,
				relativePath: containerMount.owner === "agent" ? relative ? containerMount.remote + "/" + relative : containerMount.remote : path.posix.relative(workspaceContainerRoot, containerPath),
				containerPath: relative ? path.posix.join(containerMount.remote, relative) : containerMount.remote,
				mountHostRoot: containerMount.value.hostRoot,
				writable: containerMount.value.writable
			};
		};
		const containerCwd = params.cwd?.replace(/\\/g, "/");
		const cwdMount = containerCwd ? resolveOpenShellWorkspaceRoot(containerMounts, containerCwd) : void 0;
		const containerInput = path.posix.isAbsolute(input) ? input : cwdMount || !params.cwd ? path.posix.resolve(containerCwd ?? workspaceContainerRoot, input) : void 0;
		if (containerInput) {
			const target = resolveContainerTarget(containerInput);
			if (target) return target;
			if (cwdMount || containerMounts.some((mount) => input === mount.remote || input.startsWith(`${mount.remote}/`))) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${input}`);
		}
		const cwd = params.cwd ? path.resolve(params.cwd) : workspaceRoot;
		const hostPath = path.isAbsolute(input) ? path.resolve(input) : path.resolve(cwd, input);
		for (const mount of readOnlyMounts) if (isPathInside(mount.hostPath, hostPath)) {
			const relative = path.relative(mount.hostPath, hostPath).split(path.sep).join(path.posix.sep);
			return expectResolvedContainerTarget(resolveContainerTarget(path.posix.join(mount.containerPath, relative)), input);
		}
		if (isPathInside(workspaceRoot, hostPath)) {
			const relative = path.relative(workspaceRoot, hostPath).split(path.sep).join(path.posix.sep);
			return expectResolvedContainerTarget(resolveContainerTarget(path.posix.join(workspaceContainerRoot, relative)), input);
		}
		if (hasAgentMount && isPathInside(agentRoot, hostPath)) {
			const relative = path.relative(agentRoot, hostPath).split(path.sep).join(path.posix.sep);
			return expectResolvedContainerTarget(resolveContainerTarget(path.posix.join(agentContainerRoot, relative)), input);
		}
		throw new Error(`Path escapes sandbox root (${workspaceRoot}): ${params.filePath}`);
	}
};
function expectResolvedContainerTarget(target, input) {
	if (!target) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${input}`);
	return target;
}
async function mkdirLocalRootPath(params) {
	const relativePath = relativeToRoot(params.target, params.hostPath);
	if (!relativePath) return;
	await (await root(params.target.mountHostRoot)).mkdir(relativePath);
}
async function removeLocalRootPath(params) {
	const root$3 = await root(params.target.mountHostRoot);
	const relativePath = relativeToRoot(params.target, params.hostPath);
	try {
		if (params.force === false) await fsPromises.lstat(params.hostPath);
		const targets = params.recursive && !relativePath ? await root$3.list("") : [relativePath];
		for (const target of targets) await root$3.remove(target, {
			force: params.force !== false,
			...params.recursive ? {
				recursive: true,
				order: "sorted",
				maxEntries: Infinity,
				maxDepth: Infinity
			} : {}
		});
	} catch (err) {
		if (params.force !== false && isNotFoundError(err)) return;
		throw err;
	}
}
async function moveLocalRootPath(params) {
	const root$4 = await root(params.from.mountHostRoot);
	const fromRelativePath = relativeToRoot(params.from, params.fromHostPath);
	const toRelativePath = relativeToRoot(params.to, params.toHostPath);
	await mkdirParentPath(root$4, toRelativePath);
	await root$4.move(fromRelativePath, toRelativePath, { overwrite: true });
}
async function mkdirParentPath(root, relativePath) {
	const parentPath = path.dirname(relativePath);
	if (parentPath === "." || parentPath === "") return;
	await root.mkdir(parentPath);
}
function relativeToRoot(target, hostPath) {
	const relativePath = path.relative(target.mountHostRoot, hostPath);
	return relativePath === "." ? "" : relativePath;
}
async function assertRenameSourceSupported(fromHostPath) {
	const stats = await fsPromises.lstat(fromHostPath);
	if (stats.isSymbolicLink()) throw new Error("Sandbox symlink rename sources are not supported by the local mirror bridge");
	if (stats.isFile() && stats.nlink > 1) throw new Error("Sandbox hardlinked rename sources are not supported by the local mirror bridge");
}
async function assertSameDeviceRenameSupported(params) {
	const sourceStats = await fsPromises.lstat(params.fromHostPath);
	const destinationParentStats = await nearestExistingDirectoryStats({
		root: params.root,
		targetPath: path.dirname(params.toHostPath)
	});
	if (sourceStats.dev !== destinationParentStats.dev) throw new Error("OpenShell cross-device mirror renames require pinned fs-safe support");
}
async function nearestExistingDirectoryStats(params) {
	const rootPath = path.resolve(params.root);
	let cursor = path.resolve(params.targetPath);
	while (isPathInside(rootPath, cursor)) {
		const stats = await fsPromises.lstat(cursor).catch((err) => {
			if (isNotFoundError(err)) return null;
			throw err;
		});
		if (stats) {
			if (!stats.isDirectory()) throw new Error(`Sandbox rename destination parent is not a directory: ${cursor}`);
			return stats;
		}
		const next = path.dirname(cursor);
		if (next === cursor) break;
		cursor = next;
	}
	return await fsPromises.lstat(rootPath);
}
function isNotFoundError(err) {
	return err instanceof FsSafeError && err.code === "not-found" || typeof err === "object" && err !== null && "code" in err && err.code === "ENOENT";
}
async function assertLocalPathSafety(params) {
	const { hostPath, mountHostRoot } = params.target;
	if (!hostPath) throw new Error(`Missing local host path for ${params.target.containerPath}`);
	const canonicalRoot = await fsPromises.realpath(mountHostRoot).catch((error) => {
		if (isNotFoundError(error)) return path.resolve(mountHostRoot);
		throw error;
	});
	const unlinkSymlink = params.allowFinalSymlinkForUnlink && hostPath !== mountHostRoot && (await fsPromises.lstat(hostPath).catch((error) => {
		if (isNotFoundError(error)) return null;
		throw error;
	}))?.isSymbolicLink();
	const candidate = unlinkSymlink ? path.resolve(canonicalRoot, path.relative(mountHostRoot, hostPath)) : await canonicalPathFromExistingAncestor$1(hostPath);
	if (!isPathInside(canonicalRoot, candidate)) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${params.target.containerPath}`);
	await assertNoSymlinkParents({
		rootDir: mountHostRoot,
		targetPath: unlinkSymlink ? path.dirname(hostPath) : hostPath,
		messagePrefix: `Sandbox boundary checks failed: ${params.target.containerPath}`
	});
}
//#endregion
//#region extensions/openshell/src/mirror.ts
const DEFAULT_OPEN_SHELL_MIRROR_EXCLUDE_DIRS = [
	"hooks",
	"git-hooks",
	".git"
];
const COPY_TREE_FS_CONCURRENCY = 16;
function createExcludeMatcher(excludeDirs) {
	const excluded = new Set((excludeDirs ?? []).map((d) => normalizeLowercaseStringOrEmpty(d)));
	return (name) => excluded.has(normalizeLowercaseStringOrEmpty(name));
}
const runLimitedFs = pLimit(COPY_TREE_FS_CONCURRENCY);
async function lstatIfExists(targetPath) {
	return await runLimitedFs(fsPromises.lstat, targetPath).catch((error) => {
		if (extractErrorCode(error) === "ENOENT") return null;
		throw error;
	});
}
async function reconcileMirrorPath(params) {
	const targetStats = await lstatIfExists(params.targetPath);
	if (targetStats && !targetStats.isDirectory() && !targetStats.isFile()) return true;
	const sourceStats = params.sourcePath ? await runLimitedFs(fsPromises.lstat, params.sourcePath) : null;
	const sourceDir = sourceStats?.isDirectory() ? params.sourcePath : void 0;
	const sourceFile = sourceStats?.isFile() ? params.sourcePath : void 0;
	if (!params.replace && !sourceDir && !sourceFile) return false;
	if (sourceDir || targetStats?.isDirectory()) {
		if (targetStats && !targetStats.isDirectory()) await runLimitedFs(fsPromises.rm, params.targetPath, { force: true });
		const preservedEntries = await reconcileMirrorDirectory({
			sourceDir,
			targetDir: params.targetPath,
			replace: params.replace
		});
		if (sourceDir || preservedEntries) return preservedEntries;
		await runLimitedFs(fsPromises.rmdir, params.targetPath);
	} else if (targetStats) await runLimitedFs(fsPromises.rm, params.targetPath, { force: true });
	if (sourceFile) await runLimitedFs(fsPromises.copyFile, sourceFile, params.targetPath);
	return false;
}
async function reconcileMirrorDirectory(params) {
	const { sourceDir } = params;
	const isExcluded = createExcludeMatcher(params.excludeDirs);
	await runLimitedFs(fsPromises.mkdir, params.targetDir, { recursive: true });
	const sourceEntries = new Set(sourceDir ? await runLimitedFs(async () => await fsPromises.readdir(sourceDir)) : []);
	const targetEntries = params.replace ? await runLimitedFs(async () => await fsPromises.readdir(params.targetDir)) : [];
	const results = await Promise.allSettled([.../* @__PURE__ */ new Set([...sourceEntries, ...targetEntries])].filter((entry) => !isExcluded(entry)).map((entry) => reconcileMirrorPath({
		sourcePath: sourceDir && sourceEntries.has(entry) ? path.join(sourceDir, entry) : void 0,
		targetPath: path.join(params.targetDir, entry),
		replace: params.replace
	})));
	let preservedEntries = false;
	for (const result of results) {
		if (result.status === "rejected") throw result.reason;
		preservedEntries ||= result.value;
	}
	return preservedEntries;
}
async function replaceDirectoryContents(params) {
	await reconcileMirrorDirectory({
		...params,
		replace: true
	});
}
async function stageDirectoryContents(params) {
	await reconcileMirrorDirectory({
		...params,
		replace: false
	});
}
//#endregion
//#region extensions/openshell/src/backend.ts
const openShellWorkspaceOperations = new KeyedAsyncQueue();
let openShellDetachedCreateSupport;
const MATERIALIZED_SKILLS_REMOTE_PARTS = [".openclaw", "sandbox-skills"];
function buildOpenShellDirectoryUploadArgs(params) {
	return [
		"sandbox",
		"upload",
		"--no-git-ignore",
		params.sandboxName,
		params.localPath,
		`${normalizeRemotePath(params.remotePath)}/`
	];
}
const REMOTE_MANAGED_ROOTS_EMPTY_SCRIPT = "for root in \"$@\"; do if [ -d \"$root\" ] && [ -n \"$(ls -A \"$root\")\" ]; then printf \"1\\n\"; exit 0; fi; done; printf \"0\\n\"";
const PINNED_REMOTE_PATH_MUTATION_SCRIPT = [
	"set -eu",
	"die() { echo \"$1\" >&2; exit 1; }",
	"validate_basename() {",
	"  case \"$1\" in \"\"|\".\"|\"..\"|*/*) die \"unsafe remote basename: $1\" ;; esac",
	"}",
	"pin_dir() {",
	"  root=\"$1\"",
	"  relative=\"$2\"",
	"  create=\"$3\"",
	"  case \"$root\" in /*) ;; *) die \"remote root must be absolute: $root\" ;; esac",
	"  root=\"${root%/}\"",
	"  [ -n \"$root\" ] || root=\"/\"",
	"  if [ -L \"$root\" ]; then die \"unsafe remote root symlink: $root\"; fi",
	"  mkdir -p -- \"$root\"",
	"  canonical_root=\"$(cd \"$root\" && pwd -P)\"",
	"  current=\"$canonical_root\"",
	"  relative=\"${relative#/}\"",
	"  while [ -n \"$relative\" ]; do",
	"    part=\"${relative%%/*}\"",
	"    if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"    [ -n \"$part\" ] || continue",
	"    case \"$part\" in \".\"|\"..\") die \"unsafe remote directory component: $part\" ;; esac",
	"    if [ \"$current\" = \"/\" ]; then next=\"/$part\"; else next=\"$current/$part\"; fi",
	"    if [ -L \"$next\" ]; then die \"unsafe remote directory symlink: $next\"; fi",
	"    if [ -e \"$next\" ]; then",
	"      if [ ! -d \"$next\" ]; then die \"unsafe remote directory component: $next\"; fi",
	"    else",
	"      if [ \"$create\" != \"1\" ]; then die \"remote directory not found: $next\"; fi",
	"      mkdir -- \"$next\"",
	"    fi",
	"    current=\"$next\"",
	"  done",
	"  printf \"%s\\n\" \"$current\"",
	"}",
	"pin_dir_or_missing() {",
	"  root=\"$1\"",
	"  relative=\"$2\"",
	"  missing_ok=\"$3\"",
	"  case \"$root\" in /*) ;; *) die \"remote root must be absolute: $root\" ;; esac",
	"  root=\"${root%/}\"",
	"  [ -n \"$root\" ] || root=\"/\"",
	"  if [ -L \"$root\" ]; then die \"unsafe remote root symlink: $root\"; fi",
	"  if [ ! -d \"$root\" ]; then",
	"    if [ -e \"$root\" ]; then die \"unsafe remote root component: $root\"; fi",
	"    if [ \"$missing_ok\" = \"1\" ]; then printf \"\\n\"; return 0; fi",
	"    die \"remote directory not found: $root\"",
	"  fi",
	"  canonical_root=\"$(cd \"$root\" && pwd -P)\"",
	"  current=\"$canonical_root\"",
	"  relative=\"${relative#/}\"",
	"  while [ -n \"$relative\" ]; do",
	"    part=\"${relative%%/*}\"",
	"    if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"    [ -n \"$part\" ] || continue",
	"    case \"$part\" in \".\"|\"..\") die \"unsafe remote directory component: $part\" ;; esac",
	"    if [ \"$current\" = \"/\" ]; then next=\"/$part\"; else next=\"$current/$part\"; fi",
	"    if [ -L \"$next\" ]; then die \"unsafe remote directory symlink: $next\"; fi",
	"    if [ -e \"$next\" ]; then",
	"      if [ ! -d \"$next\" ]; then die \"unsafe remote directory component: $next\"; fi",
	"    else",
	"      if [ \"$missing_ok\" = \"1\" ]; then printf \"\\n\"; return 0; fi",
	"      die \"remote directory not found: $next\"",
	"    fi",
	"    current=\"$next\"",
	"  done",
	"  printf \"%s\\n\" \"$current\"",
	"}",
	"operation=\"$1\"",
	"case \"$operation\" in",
	"  mkdirp)",
	"    pin_dir \"$2\" \"$3\" 1 >/dev/null",
	"    ;;",
	"  remove)",
	"    validate_basename \"$4\"",
	"    parent=\"$(pin_dir_or_missing \"$2\" \"$3\" \"${5:-0}\")\"",
	"    [ -n \"$parent\" ] || exit 0",
	"    target=\"$parent/$4\"",
	"    if [ -d \"$target\" ] && [ ! -L \"$target\" ]; then rm -rf -- \"$target\"; elif [ -e \"$target\" ] || [ -L \"$target\" ]; then rm -f -- \"$target\"; fi",
	"    ;;",
	"  removefile)",
	"    validate_basename \"$4\"",
	"    parent=\"$(pin_dir_or_missing \"$2\" \"$3\" \"${5:-0}\")\"",
	"    [ -n \"$parent\" ] || exit 0",
	"    target=\"$parent/$4\"",
	"    if [ -d \"$target\" ] && [ ! -L \"$target\" ]; then rmdir -- \"$target\"; elif [ -e \"$target\" ] || [ -L \"$target\" ]; then rm -f -- \"$target\"; fi",
	"    ;;",
	"  rename)",
	"    src_parent=\"$(pin_dir \"$2\" \"$3\" 0)\"",
	"    validate_basename \"$4\"",
	"    dst_parent=\"$(pin_dir \"$5\" \"$6\" 1)\"",
	"    validate_basename \"$7\"",
	"    if [ -L \"$dst_parent/$7\" ]; then die \"unsafe remote rename target symlink: $dst_parent/$7\"; fi",
	"    if [ -d \"$dst_parent/$7\" ]; then die \"unsafe remote rename target directory: $dst_parent/$7\"; fi",
	"    mv -- \"$src_parent/$4\" \"$dst_parent/$7\"",
	"    ;;",
	"  *)",
	"    die \"unknown remote path mutation: $operation\"",
	"    ;;",
	"esac"
].join("\n");
const ENSURE_OPEN_SHELL_REMOTE_REAL_DIRECTORY_SCRIPT = [
	"set -e",
	"target=\"$1\"",
	"root=\"${2:-$1}\"",
	"replace_blocking=\"${3:-0}\"",
	"case \"$target\" in /*) ;; *) echo \"remote directory must be absolute: $target\" >&2; exit 1 ;; esac",
	"case \"$root\" in /*) ;; *) echo \"remote root must be absolute: $root\" >&2; exit 1 ;; esac",
	"target=\"${target%/}\"",
	"root=\"${root%/}\"",
	"[ -n \"$target\" ] || target=\"/\"",
	"[ -n \"$root\" ] || root=\"/\"",
	"case \"$target/\" in \"$root\"/*|\"$root/\") ;; *) echo \"remote directory must stay under root: $target\" >&2; exit 1 ;; esac",
	"for path_to_check in \"$target\" \"$root\"; do",
	"  relative=\"${path_to_check#/}\"",
	"  while [ -n \"$relative\" ]; do",
	"    part=\"${relative%%/*}\"",
	"    if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"    [ -n \"$part\" ] || continue",
	"    case \"$part\" in \".\"|\"..\") echo \"unsafe remote directory component: $part\" >&2; exit 1 ;; esac",
	"  done",
	"done",
	"if [ -L \"$root\" ]; then echo \"unsafe remote root symlink: $root\" >&2; exit 1; fi",
	"mkdir -p -- \"$root\"",
	"canonical_root=\"$(cd \"$root\" && pwd -P)\"",
	"relative=\"${target#\"$root\"}\"",
	"relative=\"${relative#/}\"",
	"current=\"$canonical_root\"",
	"while [ -n \"$relative\" ]; do",
	"  part=\"${relative%%/*}\"",
	"  if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"  [ -n \"$part\" ] || continue",
	"  if [ \"$current\" = \"/\" ]; then next=\"/$part\"; else next=\"$current/$part\"; fi",
	"  if [ -L \"$next\" ]; then",
	"    if [ \"$replace_blocking\" != \"1\" ]; then echo \"unsafe remote directory symlink: $next\" >&2; exit 1; fi",
	"    rm -rf -- \"$next\"",
	"  elif [ -e \"$next\" ] && [ ! -d \"$next\" ]; then",
	"    if [ \"$replace_blocking\" != \"1\" ]; then echo \"unsafe remote directory component: $next\" >&2; exit 1; fi",
	"    rm -rf -- \"$next\"",
	"  fi",
	"  if [ -e \"$next\" ]; then",
	"    [ -d \"$next\" ] || { echo \"unsafe remote directory component: $next\" >&2; exit 1; }",
	"  else",
	"    mkdir -- \"$next\"",
	"  fi",
	"  current=\"$next\"",
	"done"
].join("\n");
function buildOpenShellSshExecEnv() {
	return sanitizeEnvVars(process.env).allowed;
}
function createOpenShellSandboxBackendFactory(params) {
	return async (createParams) => await createOpenShellSandboxBackend({
		...params,
		createParams
	});
}
function createOpenShellSandboxBackendManager(params) {
	return {
		async describeRuntime({ entry, config }) {
			const execContext = {
				config: resolveOpenShellPluginConfigFromConfig(config, params.pluginConfig),
				sandboxName: entry.containerName
			};
			const result = await runOpenShellCli({
				context: execContext,
				args: [
					"sandbox",
					"get",
					entry.containerName,
					"--output",
					"json"
				]
			});
			const configuredSource = execContext.config.from;
			return {
				running: result.code === 0 && parseOpenShellSandboxPhase(result.stdout) === "Ready",
				actualConfigLabel: entry.image,
				configLabelMatch: entry.image === configuredSource
			};
		},
		async removeRuntime({ entry, config }) {
			const result = await runOpenShellCli({
				context: {
					config: resolveOpenShellPluginConfigFromConfig(config, params.pluginConfig),
					sandboxName: entry.containerName
				},
				args: [
					"sandbox",
					"delete",
					entry.containerName
				]
			});
			if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox delete failed");
		}
	};
}
async function createOpenShellSandboxBackend(params) {
	if ((params.createParams.cfg.docker.binds?.length ?? 0) > 0) throw new Error("OpenShell sandbox backend does not support sandbox.docker.binds.");
	const resolvedSandboxName = resolveOpenShellSandboxName({
		scopeKey: params.createParams.scopeKey,
		registeredRuntimeIds: params.createParams.registeredRuntimeIds
	});
	const sandboxName = resolvedSandboxName.sandboxName;
	const execContext = {
		config: params.pluginConfig,
		sandboxName
	};
	return new OpenShellSandboxBackendImpl({
		createParams: params.createParams,
		execContext,
		legacyRuntimeAdopted: resolvedSandboxName.legacyRuntimeAdopted,
		remoteWorkspaceDir: params.pluginConfig.remoteWorkspaceDir,
		remoteAgentWorkspaceDir: params.pluginConfig.remoteAgentWorkspaceDir
	}).asHandle();
}
var OpenShellSandboxBackendImpl = class {
	constructor(params) {
		this.params = params;
		this.handle = null;
		this.ensurePromise = null;
		this.remoteSeedPending = false;
	}
	asHandle() {
		if (this.handle) return this.handle;
		const runRemoteShellScript = (command) => this.params.execContext.config.mode === "mirror" ? this.runWorkspaceOperation(() => this.runRemoteShellScript(command), command.signal) : this.runRemoteShellScript(command);
		const handle = {
			id: "openshell",
			runtimeId: this.params.execContext.sandboxName,
			runtimeLabel: this.params.execContext.sandboxName,
			workdir: this.params.remoteWorkspaceDir,
			env: this.params.createParams.cfg.docker.env,
			mode: this.params.execContext.config.mode,
			configLabel: this.params.execContext.config.from,
			configLabelKind: "Source",
			workdirValidation: "backend",
			validateWorkdir: async (workdir) => await this.validateWorkdir(workdir),
			workdirRoots: [this.params.remoteWorkspaceDir, this.params.remoteAgentWorkspaceDir],
			remoteWorkspaceDir: this.params.remoteWorkspaceDir,
			remoteAgentWorkspaceDir: this.params.remoteAgentWorkspaceDir,
			buildExecSpec: async ({ command, workdir, env, usePty }) => {
				const pending = await this.prepareExec({
					command,
					workdir,
					env,
					usePty
				});
				return {
					argv: pending.argv,
					env: buildOpenShellSshExecEnv(),
					stdinMode: "pipe-open",
					finalizeToken: pending.token
				};
			},
			finalizeExec: async ({ token }) => {
				await this.finalizeExec(token);
			},
			runShellCommand: runRemoteShellScript,
			createFsBridge: ({ sandbox }) => this.params.execContext.config.mode === "remote" ? createRemoteShellSandboxFsBridge({
				sandbox,
				runtime: handle
			}) : this.createMirrorFsBridge(sandbox),
			runRemoteShellScript
		};
		this.handle = handle;
		return handle;
	}
	createMirrorFsBridge(sandbox) {
		const bridge = createOpenShellFsBridge({
			sandbox,
			backend: {
				remoteAgentWorkspaceDir: this.params.remoteAgentWorkspaceDir,
				mkdirpRemotePath: (remotePath, signal) => this.mkdirpRemotePath(remotePath, signal),
				removeRemotePath: (remotePath, params) => this.removeRemotePath(remotePath, params),
				renameRemotePath: (from, to, signal) => this.renameRemotePath(from, to, signal),
				syncLocalPathToRemote: (localPath, remotePath) => this.syncLocalPathToRemote(localPath, remotePath)
			}
		});
		return {
			get pathMappings() {
				return bridge.pathMappings;
			},
			resolvePath: (params) => bridge.resolvePath(params),
			readFile: (params) => this.runWorkspaceOperation(() => bridge.readFile(params), params.signal),
			readDirectory: (params) => this.runWorkspaceOperation(() => bridge.readDirectory(params), params.signal),
			writeFile: (params) => this.runWorkspaceOperation(() => bridge.writeFile(params), params.signal),
			createFileExclusive: (params) => this.runWorkspaceOperation(() => bridge.createFileExclusive(params), params.signal),
			mkdirp: (params) => this.runWorkspaceOperation(() => bridge.mkdirp(params), params.signal),
			remove: (params) => this.runWorkspaceOperation(() => bridge.remove(params), params.signal),
			rename: (params) => this.runWorkspaceOperation(() => bridge.rename(params), params.signal),
			stat: (params) => this.runWorkspaceOperation(() => bridge.stat(params), params.signal)
		};
	}
	async runWorkspaceOperation(operation, signal) {
		signal?.throwIfAborted();
		const lease = await this.acquireWorkspaceLease();
		try {
			signal?.throwIfAborted();
			return await operation();
		} finally {
			lease.release();
		}
	}
	async acquireWorkspaceLease() {
		const { config, sandboxName } = this.params.execContext;
		const keys = [`host:${await canonicalPathFromExistingAncestor(this.params.createParams.workspaceDir)}`, `runtime:${JSON.stringify([
			config.gatewayEndpoint ?? "",
			config.gateway ?? "",
			config.workspace ?? process.env.OPENSHELL_WORKSPACE ?? "",
			sandboxName
		])}`].toSorted();
		const releases = [];
		for (const key of keys) {
			const acquired = createDeferred();
			openShellWorkspaceOperations.enqueue(key, () => new Promise(acquired.resolve));
			releases.push(await acquired.promise);
		}
		return { release: () => {
			for (const release of releases.toReversed()) release();
		} };
	}
	async prepareExec(params) {
		const remoteWorkdir = params.workdir ?? this.params.remoteWorkspaceDir;
		const remoteCommand = buildValidatedExecRemoteCommand({
			command: params.command,
			workdir: remoteWorkdir,
			env: {}
		});
		const workspaceLease = this.params.execContext.config.mode === "mirror" ? await this.acquireWorkspaceLease() : void 0;
		try {
			await this.ensureSandboxExists();
			if (workspaceLease) {
				await this.syncWorkspaceToRemote();
				this.remoteSeedPending = false;
			}
			const sshSession = await createOpenShellSshSession({ context: this.params.execContext });
			try {
				const prepared = await prepareSshSandboxExec({
					session: sshSession,
					remoteCommand,
					env: params.env,
					tty: params.usePty
				});
				return {
					argv: prepared.argv,
					token: {
						workspaceLease,
						cleanup: async () => {
							try {
								await prepared.cleanup();
							} finally {
								await disposeSshSandboxSession(sshSession);
							}
						}
					}
				};
			} catch (error) {
				await disposeSshSandboxSession(sshSession);
				throw error;
			}
		} catch (error) {
			workspaceLease?.release();
			throw error;
		}
	}
	async validateWorkdir(workdir) {
		if (this.params.execContext.config.mode === "mirror") return await this.runWorkspaceOperation(() => this.validateMirrorWorkdir(workdir));
		await this.ensureSandboxExists();
		const sshSession = await createOpenShellSshSession({ context: this.params.execContext });
		try {
			const result = await runSshSandboxCommand({
				session: sshSession,
				remoteCommand: buildRemoteWorkdirValidationCommand({
					workdir,
					root: this.resolveWorkdirValidationRoot(workdir)
				}),
				allowFailure: true
			});
			return result.code === 0 ? result.stdout.toString("utf8").trim() || null : null;
		} finally {
			await disposeSshSandboxSession(sshSession);
		}
	}
	resolveWorkdirValidationRoot(workdir) {
		try {
			const normalized = normalizeRemotePath(workdir);
			return resolveOpenShellWorkspaceRoot([{
				remote: normalizeRemotePath(this.params.remoteWorkspaceDir),
				owner: "workspace",
				value: void 0
			}, {
				remote: normalizeRemotePath(this.params.remoteAgentWorkspaceDir),
				owner: "agent",
				value: void 0
			}], normalized)?.remote ?? this.params.remoteWorkspaceDir;
		} catch {
			return this.params.remoteWorkspaceDir;
		}
	}
	async validateMirrorWorkdir(workdir) {
		const normalized = normalizeRemotePath(workdir);
		const roots = this.workspaceUploadRoots();
		if (!roots.some((root) => isOpenShellRemotePathInside(root.remote, normalized))) return null;
		const { cfg, skillsWorkspaceDir } = this.params.createParams;
		if (cfg.workspaceAccess === "rw" && skillsWorkspaceDir) roots.push({
			remote: resolveRemoteMaterializedSkillsWorkspaceDir(this.params.remoteWorkspaceDir),
			local: skillsWorkspaceDir,
			owner: "workspace"
		});
		let createdAncestor = false;
		for (const root of roots.toReversed()) {
			if (!isOpenShellRemotePathInside(root.remote, normalized)) {
				createdAncestor ||= isOpenShellRemotePathInside(normalized, root.remote);
				continue;
			}
			if (createdAncestor) return normalized;
			const relative = path.posix.relative(root.remote, normalized);
			if (!relative) return normalized;
			const parts = relative.split("/");
			if (DEFAULT_OPEN_SHELL_MIRROR_EXCLUDE_DIRS.some((excluded) => excluded === normalizeLowercaseStringOrEmpty(parts[0]))) return null;
			let local = root.local;
			for (const part of root.local === skillsWorkspaceDir ? ["", ...parts] : parts) {
				local = path.join(local, part);
				if (!(await fsPromises.lstat(local).catch(() => null))?.isDirectory()) return null;
			}
			return normalized;
		}
		return createdAncestor ? normalized : null;
	}
	async finalizeExec(token) {
		const workspaceLease = token?.workspaceLease ?? (this.params.execContext.config.mode === "mirror" ? await this.acquireWorkspaceLease() : void 0);
		try {
			if (this.params.execContext.config.mode === "mirror") await this.syncWorkspaceFromRemote();
		} finally {
			try {
				await token?.cleanup();
			} finally {
				workspaceLease?.release();
			}
		}
	}
	async runRemoteShellScript(params) {
		await this.ensureSandboxExists();
		if (this.params.execContext.config.mode === "mirror") await this.maybeSeedRemoteWorkspace();
		return await this.runRemoteShellScriptInternal(params);
	}
	async mkdirpRemotePath(remotePath, signal) {
		const target = this.resolveRemoteTarget(remotePath);
		await this.runPinnedRemotePathMutation({
			args: [
				"mkdirp",
				target.root,
				target.relativePath
			],
			signal
		});
	}
	async removeRemotePath(remotePath, params) {
		const target = this.resolveRemoteTarget(remotePath);
		await this.runPinnedRemotePathMutation({
			args: [
				params?.recursive ? "remove" : "removefile",
				target.root,
				path.posix.dirname(target.relativePath) === "." ? "" : path.posix.dirname(target.relativePath),
				path.posix.basename(target.relativePath),
				params?.ignoreMissing ? "1" : "0"
			],
			signal: params?.signal
		});
	}
	async renameRemotePath(fromRemotePath, toRemotePath, signal) {
		const from = this.resolveRemoteTarget(fromRemotePath);
		const to = this.resolveRemoteTarget(toRemotePath);
		await this.runPinnedRemotePathMutation({
			args: [
				"rename",
				from.root,
				path.posix.dirname(from.relativePath) === "." ? "" : path.posix.dirname(from.relativePath),
				path.posix.basename(from.relativePath),
				to.root,
				path.posix.dirname(to.relativePath) === "." ? "" : path.posix.dirname(to.relativePath),
				path.posix.basename(to.relativePath)
			],
			signal
		});
	}
	async runRemoteShellScriptInternal(params) {
		const session = await createOpenShellSshSession({ context: this.params.execContext });
		try {
			return await runSshSandboxCommand({
				session,
				remoteCommand: buildRemoteCommand([
					"/bin/sh",
					"-c",
					params.script,
					"openclaw-openshell-fs",
					...params.args ?? []
				]),
				stdin: params.stdin,
				allowFailure: params.allowFailure,
				signal: params.signal
			});
		} finally {
			await disposeSshSandboxSession(session);
		}
	}
	async syncLocalPathToRemote(localPath, remotePath) {
		await this.ensureSandboxExists();
		await this.maybeSeedRemoteWorkspace();
		const target = this.resolveRemoteTarget(remotePath);
		const stats = await fsPromises.lstat(localPath).catch(() => null);
		if (!stats) {
			await this.runPinnedRemotePathMutation({ args: [
				"remove",
				target.root,
				path.posix.dirname(target.relativePath) === "." ? "" : path.posix.dirname(target.relativePath),
				path.posix.basename(target.relativePath),
				"1"
			] });
			return;
		}
		if (stats.isSymbolicLink()) {
			await this.runPinnedRemotePathMutation({ args: [
				"remove",
				target.root,
				path.posix.dirname(target.relativePath) === "." ? "" : path.posix.dirname(target.relativePath),
				path.posix.basename(target.relativePath),
				"1"
			] });
			return;
		}
		if (stats.isDirectory()) {
			await this.mkdirpRemotePath(remotePath);
			return;
		}
		await this.runPinnedRemotePathMutation({ args: [
			"mkdirp",
			target.root,
			path.posix.dirname(target.relativePath) === "." ? "" : path.posix.dirname(target.relativePath)
		] });
		const result = await runOpenShellCli({
			context: this.params.execContext,
			args: [
				"sandbox",
				"upload",
				"--no-git-ignore",
				this.params.execContext.sandboxName,
				localPath,
				remotePath
			],
			cwd: this.params.createParams.workspaceDir
		});
		if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox upload failed");
	}
	async runPinnedRemotePathMutation(params) {
		return await this.runRemoteShellScript({
			script: PINNED_REMOTE_PATH_MUTATION_SCRIPT,
			args: params.args,
			signal: params.signal
		});
	}
	resolveRemoteTarget(remotePath) {
		const normalized = normalizeRemotePath(remotePath);
		const root = resolveOpenShellWorkspaceRoot([{
			remote: normalizeRemotePath(this.params.remoteWorkspaceDir),
			owner: "workspace",
			value: void 0
		}, {
			remote: normalizeRemotePath(this.params.remoteAgentWorkspaceDir),
			owner: "agent",
			value: void 0
		}], normalized)?.remote;
		if (root) {
			const relativePath = path.posix.relative(root, normalized);
			return {
				root,
				relativePath: relativePath === "." ? "" : relativePath
			};
		}
		throw new Error(`Remote path escapes OpenShell managed roots: ${remotePath}`);
	}
	async ensureSandboxExists() {
		if (this.ensurePromise) return await this.ensurePromise;
		const initialize = async () => {
			await this.ensureSandboxExistsInner();
			if (this.params.execContext.config.mode === "remote" && !await this.maybeSeedRemoteWorkspace()) await this.syncSkillsWorkspaceToRemote();
		};
		this.ensurePromise = this.params.execContext.config.mode === "remote" ? this.runWorkspaceOperation(initialize) : initialize();
		try {
			await this.ensurePromise;
		} catch (error) {
			this.ensurePromise = null;
			throw error;
		}
	}
	async ensureSandboxExistsInner() {
		const getResult = await runOpenShellCli({
			context: this.params.execContext,
			args: [
				"sandbox",
				"get",
				this.params.execContext.sandboxName
			],
			cwd: this.params.createParams.workspaceDir
		});
		if (getResult.code === 0) {
			if (this.params.legacyRuntimeAdopted) {
				const phase = await this.resolveLegacyRuntimePhase();
				if (!phase) throw this.buildLegacyRuntimeUnavailableError("OpenShell did not report a lifecycle phase for this sandbox.");
				if (phase !== "Ready") throw this.buildLegacyRuntimeUnavailableError(`OpenShell reports phase "${phase}".`);
			}
			if (this.params.execContext.config.mode === "remote" && await this.remoteManagedRootsEmpty()) this.remoteSeedPending = true;
			return;
		}
		if (this.params.legacyRuntimeAdopted) throw this.buildLegacyRuntimeUnavailableError(getResult.stderr.trim());
		if (!/\bsandbox not found\b/iu.test(getResult.stderr)) throw new Error(getResult.stderr.trim() || "openshell sandbox get failed");
		const detachedCreateSupported = await this.supportsDetachedSandboxCreation();
		const createArgs = [
			"sandbox",
			"create",
			"--name",
			this.params.execContext.sandboxName,
			"--from",
			this.params.execContext.config.from,
			...this.params.execContext.config.policy ? ["--policy", this.params.execContext.config.policy] : [],
			...this.params.execContext.config.gpu ? ["--gpu"] : [],
			...this.params.execContext.config.autoProviders ? ["--auto-providers"] : ["--no-auto-providers"],
			...this.params.execContext.config.providers.flatMap((provider) => ["--provider", provider]),
			...detachedCreateSupported ? [
				"--detach",
				"--",
				"sleep",
				"infinity"
			] : ["--", "true"]
		];
		const createResult = await runOpenShellCli({
			context: this.params.execContext,
			args: createArgs,
			cwd: this.params.createParams.workspaceDir,
			timeoutMs: Math.max(this.params.execContext.config.timeoutMs, 3e5)
		});
		if (createResult.code !== 0) throw new Error(createResult.stderr.trim() || "openshell sandbox create failed");
		this.remoteSeedPending = true;
	}
	async supportsDetachedSandboxCreation() {
		const { config } = this.params.execContext;
		const cliIdentity = JSON.stringify([
			config.command,
			config.gatewayEndpoint ?? "",
			config.gateway ?? "",
			config.workspace ?? process.env.OPENSHELL_WORKSPACE ?? ""
		]);
		let support = openShellDetachedCreateSupport?.key === cliIdentity ? openShellDetachedCreateSupport.promise : void 0;
		if (!support) {
			support = (async () => {
				const result = await runOpenShellCli({
					context: this.params.execContext,
					args: [
						"sandbox",
						"create",
						"--help"
					],
					cwd: this.params.createParams.workspaceDir
				});
				if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox create capability check failed");
				return /^\s*--detach(?:\s|$)/mu.test(result.stdout);
			})();
			openShellDetachedCreateSupport = {
				key: cliIdentity,
				promise: support
			};
		}
		try {
			return await support;
		} catch (error) {
			if (openShellDetachedCreateSupport?.promise === support) openShellDetachedCreateSupport = void 0;
			throw error;
		}
	}
	async resolveLegacyRuntimePhase() {
		const pageSize = 100;
		for (let offset = 0;; offset += pageSize) {
			const listResult = await runOpenShellCli({
				context: this.params.execContext,
				args: [
					"sandbox",
					"list",
					"--limit",
					String(pageSize),
					"--offset",
					String(offset),
					"--output",
					"json"
				],
				cwd: this.params.createParams.workspaceDir
			});
			if (listResult.code !== 0) throw this.buildLegacyRuntimeUnavailableError(listResult.stderr.trim());
			const page = parseOpenShellSandboxPhasePage(listResult.stdout, this.params.execContext.sandboxName);
			if (!page) throw this.buildLegacyRuntimeUnavailableError("OpenShell returned malformed sandbox lifecycle data.");
			if (page.phase) return page.phase;
			if (page.count < pageSize) return;
		}
	}
	buildLegacyRuntimeUnavailableError(detail) {
		const recreateCommand = `openclaw sandbox recreate --session ${shellEscape(this.params.createParams.scopeKey)}`;
		return new Error([
			`Registered legacy OpenShell sandbox "${this.params.execContext.sandboxName}" is not usable.`,
			detail,
			`OpenClaw will not recreate this retired runtime name. Run \`${recreateCommand}\` to migrate this scope to the current naming format.`
		].filter(Boolean).join(" "));
	}
	workspaceUploadRoots() {
		const { createParams, remoteWorkspaceDir, remoteAgentWorkspaceDir } = this.params;
		const roots = [{
			remote: remoteWorkspaceDir,
			owner: "workspace",
			value: createParams.workspaceDir
		}];
		if (createParams.cfg.workspaceAccess !== "none" && path.resolve(createParams.agentWorkspaceDir) !== path.resolve(createParams.workspaceDir)) roots.push({
			remote: remoteAgentWorkspaceDir,
			owner: "agent",
			value: createParams.agentWorkspaceDir
		});
		return orderOpenShellWorkspaceRoots(roots).map(({ remote, owner, value: local }) => ({
			remote,
			local,
			owner
		}));
	}
	async syncWorkspaceToRemote() {
		const roots = this.workspaceUploadRoots();
		for (const [index, root] of roots.entries()) {
			const containingRoot = roots.slice(0, index).toReversed().find((candidate) => isOpenShellRemotePathInside(candidate.remote, root.remote));
			await this.runRemoteShellScriptInternal({
				script: `${ENSURE_OPEN_SHELL_REMOTE_REAL_DIRECTORY_SCRIPT}\nfind "$1" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +`,
				args: [
					root.remote,
					containingRoot?.remote ?? root.remote,
					containingRoot ? "1" : "0"
				]
			});
			await this.uploadPathToRemote(root.local, root.remote);
		}
		await this.syncSkillsWorkspaceToRemote();
	}
	async syncSkillsWorkspaceToRemote() {
		if (this.params.createParams.cfg.workspaceAccess !== "rw" || !this.params.createParams.skillsWorkspaceDir) return;
		const remoteSkillsWorkspaceDir = resolveRemoteMaterializedSkillsWorkspaceDir(this.params.remoteWorkspaceDir);
		await this.runRemoteShellScriptInternal({
			script: `${ENSURE_OPEN_SHELL_REMOTE_REAL_DIRECTORY_SCRIPT}\nfind "$1" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +`,
			args: [remoteSkillsWorkspaceDir, this.params.remoteWorkspaceDir]
		});
		const stats = await fsPromises.lstat(this.params.createParams.skillsWorkspaceDir).catch(() => null);
		if (!stats?.isDirectory() || stats.isSymbolicLink()) return;
		await this.uploadPathToRemote(this.params.createParams.skillsWorkspaceDir, remoteSkillsWorkspaceDir);
	}
	async syncWorkspaceFromRemote() {
		const remoteSkillsWorkspaceDir = resolveRemoteMaterializedSkillsWorkspaceDir(this.params.remoteWorkspaceDir);
		const roots = this.workspaceUploadRoots();
		for (const [index, root] of roots.entries()) {
			if (root.owner === "agent") continue;
			await withTempWorkspace({
				rootDir: resolveOpenShellTmpRoot(),
				prefix: "openclaw-openshell-sync-"
			}, async ({ dir: tmpDir }) => {
				const result = await runOpenShellCli({
					context: this.params.execContext,
					args: [
						"sandbox",
						"download",
						this.params.execContext.sandboxName,
						root.remote,
						tmpDir
					],
					cwd: this.params.createParams.workspaceDir
				});
				if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox download failed");
				const preservedShadows = [];
				const failures = [];
				try {
					for (const shadowedRoot of roots.slice(index + 1)) {
						if (root.remote === shadowedRoot.remote || !isOpenShellRemotePathInside(root.remote, shadowedRoot.remote)) continue;
						const relativeParts = path.posix.relative(root.remote, shadowedRoot.remote).split("/").filter(Boolean);
						await removeDownloadedWorkspacePath(tmpDir, relativeParts);
						await moveLocalShadowAside({
							workspaceDir: root.local,
							tmpDir,
							relativeParts,
							preservedShadows
						});
					}
					const relativeSkillsPath = path.posix.relative(root.remote, remoteSkillsWorkspaceDir);
					if (relativeSkillsPath === "" || !relativeSkillsPath.startsWith("../") && !path.posix.isAbsolute(relativeSkillsPath)) await removeDownloadedWorkspacePath(tmpDir, relativeSkillsPath.split("/").filter(Boolean));
					if (root.owner === "workspace") await moveLocalShadowAside({
						workspaceDir: root.local,
						tmpDir,
						relativeParts: MATERIALIZED_SKILLS_REMOTE_PARTS,
						preservedShadows
					});
					await replaceDirectoryContents({
						sourceDir: tmpDir,
						targetDir: root.local,
						excludeDirs: DEFAULT_OPEN_SHELL_MIRROR_EXCLUDE_DIRS
					});
				} catch (error) {
					failures.push(error);
				}
				const retained = [];
				for (const preserved of preservedShadows.toReversed()) {
					if (preserved.sourceRetired) try {
						const cleanupFailure = await restoreLocalShadow(preserved);
						if (cleanupFailure) failures.push(cleanupFailure);
						continue;
					} catch (error) {
						failures.push(error);
					}
					retained.push(`${preserved.receipt.path} (workspace path: ${preserved.shadowPath})`);
				}
				if (retained.length > 0 || failures.length > 1) {
					const recovery = retained.length > 0 ? ` Inspect the recovery paths ${retained.join("; ")}. Remaining workspace entries were preserved; compare both paths before recovering or deleting either copy.` : "";
					throw new AggregateError(failures, `OpenShell mirror synchronization failed: ${failures.map(String).join("; ")}.${recovery}`, { cause: failures[0] });
				}
				if (failures.length > 0) throw failures[0];
			});
		}
	}
	async uploadPathToRemote(localPath, remotePath) {
		await withTempWorkspace({
			rootDir: resolveOpenShellTmpRoot(),
			prefix: "openclaw-openshell-upload-"
		}, async ({ dir: tmpDir }) => {
			const remoteRootName = path.posix.basename(normalizeRemotePath(remotePath));
			const stagedRoot = path.join(tmpDir, remoteRootName);
			await stageDirectoryContents({
				sourceDir: localPath,
				targetDir: stagedRoot,
				excludeDirs: DEFAULT_OPEN_SHELL_MIRROR_EXCLUDE_DIRS
			});
			for (const entry of (await fsPromises.readdir(stagedRoot)).toSorted()) {
				const result = await runOpenShellCli({
					context: this.params.execContext,
					args: buildOpenShellDirectoryUploadArgs({
						sandboxName: this.params.execContext.sandboxName,
						localPath: path.join(stagedRoot, entry),
						remotePath
					}),
					cwd: this.params.createParams.workspaceDir
				});
				if (result.code !== 0) throw new Error(result.stderr.trim() || "openshell sandbox upload failed");
			}
		});
	}
	async remoteManagedRootsEmpty() {
		return (await this.runRemoteShellScriptInternal({
			script: REMOTE_MANAGED_ROOTS_EMPTY_SCRIPT,
			args: [this.params.remoteWorkspaceDir, this.params.remoteAgentWorkspaceDir]
		})).stdout.toString("utf8").trim() === "0";
	}
	async maybeSeedRemoteWorkspace() {
		if (!this.remoteSeedPending) return false;
		this.remoteSeedPending = false;
		try {
			await this.syncWorkspaceToRemote();
			return true;
		} catch (error) {
			this.remoteSeedPending = true;
			throw error;
		}
	}
};
function resolveOpenShellPluginConfigFromConfig(config, fallback) {
	const pluginConfig = config.plugins?.entries?.openshell?.config;
	if (!pluginConfig) return fallback;
	return resolveOpenShellPluginConfig(pluginConfig);
}
function buildOpenShellSandboxName(scopeKey) {
	const trimmed = scopeKey.trim() || "session";
	if (/:workspace:[a-f0-9]{32}$/i.test(trimmed)) {
		const hash = createHash("sha256").update(trimmed).digest("hex").slice(0, 20);
		return `oc-${BigInt(`0x${hash}`).toString(36).padStart(16, "0")}`;
	}
	return `oc-${createHash("sha256").update(trimmed).digest("hex").slice(0, 16)}`;
}
function buildLegacyOpenShellSandboxName(scopeKey) {
	const trimmed = scopeKey.trim() || "session";
	const safe = normalizeLowercaseStringOrEmpty(trimmed).replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
	const hash = Array.from(trimmed).reduce((acc, char) => (acc * 33 ^ char.charCodeAt(0)) >>> 0, 5381);
	return `openclaw-${safe || "session"}-${hash.toString(16).slice(0, 8)}`;
}
function resolveOpenShellSandboxName(params) {
	const sandboxName = buildOpenShellSandboxName(params.scopeKey);
	if (params.registeredRuntimeIds?.includes(sandboxName)) return {
		sandboxName,
		legacyRuntimeAdopted: false
	};
	const legacySandboxName = buildLegacyOpenShellSandboxName(params.scopeKey);
	if (params.registeredRuntimeIds?.includes(legacySandboxName)) return {
		sandboxName: legacySandboxName,
		legacyRuntimeAdopted: true
	};
	return {
		sandboxName,
		legacyRuntimeAdopted: false
	};
}
function parseOpenShellSandboxPhasePage(stdout, sandboxName) {
	try {
		const parsed = JSON.parse(stdout);
		if (!Array.isArray(parsed)) return;
		for (const entry of parsed) {
			if (!entry || typeof entry !== "object") continue;
			const record = entry;
			if (record.name === sandboxName && typeof record.phase === "string") return {
				count: parsed.length,
				phase: record.phase
			};
		}
		return { count: parsed.length };
	} catch {
		return;
	}
}
function parseOpenShellSandboxPhase(stdout) {
	try {
		const parsed = JSON.parse(stdout);
		if (typeof parsed !== "object" || parsed === null || !("phase" in parsed)) return;
		return typeof parsed.phase === "string" ? parsed.phase : void 0;
	} catch {
		return;
	}
}
function resolveRemoteMaterializedSkillsWorkspaceDir(remoteWorkspaceDir) {
	const root = remoteWorkspaceDir.replace(/\\/g, "/").replace(/\/+$/, "") || "/";
	return path.posix.join(root, ...MATERIALIZED_SKILLS_REMOTE_PARTS);
}
async function removeDownloadedWorkspacePath(tmpDir, parts) {
	if (parts.length === 0) {
		for (const entry of await fsPromises.readdir(tmpDir)) await fsPromises.rm(path.join(tmpDir, entry), {
			recursive: true,
			force: true
		});
		return;
	}
	let cursor = tmpDir;
	for (const [index, part] of parts.entries()) {
		const next = path.join(cursor, part);
		const stats = await fsPromises.lstat(next).catch(() => null);
		if (!stats) return;
		if (index === parts.length - 1) {
			await fsPromises.rm(next, {
				recursive: true,
				force: true
			});
			return;
		}
		if (stats.isSymbolicLink() || !stats.isDirectory()) {
			await fsPromises.rm(next, {
				recursive: true,
				force: true
			});
			return;
		}
		cursor = next;
	}
}
async function moveLocalShadowAside(params) {
	const shadowPath = path.join(params.workspaceDir, ...params.relativeParts);
	const parentStats = await fsPromises.lstat(path.dirname(shadowPath)).catch(() => null);
	if (!parentStats?.isDirectory() || parentStats.isSymbolicLink()) return;
	const shadowStats = await fsPromises.lstat(shadowPath).catch(() => null);
	if (!shadowStats || shadowStats.isSymbolicLink()) return;
	const preserveRoot = await fsPromises.mkdtemp(path.join(path.dirname(params.tmpDir), "openclaw-openshell-preserve-"));
	let preserved;
	await movePathWithCopyFallback({
		from: shadowPath,
		to: path.join(preserveRoot, "shadow"),
		onDestinationPublished: (receipt) => {
			preserved = {
				receipt,
				shadowPath,
				sourceRetired: false
			};
			params.preservedShadows.push(preserved);
		}
	});
	if (preserved) preserved.sourceRetired = true;
}
function assertPreservedShadowIdentity(receipt) {
	const stat = fsSync.lstatSync(receipt.path, { bigint: true });
	if (stat.isSymbolicLink() || stat.dev !== receipt.dev || stat.ino !== receipt.ino || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error(`Refusing to restore an unverified workspace shadow: ${receipt.path}`);
}
async function restoreLocalShadow(preserved) {
	const { shadowPath, receipt } = preserved;
	const assertBackup = () => assertPreservedShadowIdentity(receipt);
	const parentPath = path.dirname(shadowPath);
	const parentStats = await fsPromises.lstat(parentPath).catch(() => null);
	if (parentStats?.isSymbolicLink()) throw new Error(`Refusing to restore workspace shadow through symlink parent: ${parentPath}`);
	if (parentStats && !parentStats.isDirectory()) {
		assertBackup();
		await fsPromises.rm(parentPath, {
			recursive: true,
			force: true
		});
	}
	assertBackup();
	await fsPromises.mkdir(parentPath, { recursive: true });
	assertBackup();
	await fsPromises.rm(shadowPath, {
		recursive: true,
		force: true
	});
	await movePathWithCopyFallback({
		from: receipt.path,
		to: shadowPath,
		assertBeforeMutation: assertBackup
	});
	try {
		await fsPromises.rmdir(path.dirname(receipt.path));
	} catch (error) {
		return new Error(`Workspace shadow was restored at ${shadowPath}, but preservation directory cleanup failed at ${path.dirname(receipt.path)}`, { cause: error });
	}
}
function resolveOpenShellTmpRoot() {
	return path.resolve(resolvePreferredOpenClawTmpDir());
}
function normalizeRemotePath(remotePath) {
	const normalized = path.posix.normalize(remotePath.replace(/\\/g, "/"));
	if (!path.posix.isAbsolute(normalized)) throw new Error(`OpenShell remote path must be absolute: ${remotePath}`);
	return normalized;
}
//#endregion
//#region extensions/openshell/index.ts
var openshell_default = definePluginEntry({
	id: "openshell",
	name: "OpenShell Sandbox",
	description: "OpenShell-backed sandbox runtime for agent exec and file tools.",
	configSchema: createOpenShellPluginConfigSchema(),
	register(api) {
		if (api.registrationMode !== "full") return;
		const pluginConfig = resolveOpenShellPluginConfig(api.pluginConfig);
		const unregister = registerSandboxBackend("openshell", {
			factory: createOpenShellSandboxBackendFactory({ pluginConfig }),
			manager: createOpenShellSandboxBackendManager({ pluginConfig }),
			resolveWorkdir: () => pluginConfig.remoteWorkspaceDir
		});
		api.lifecycle.registerRuntimeLifecycle({
			id: "openshell-sandbox-cleanup",
			cleanup: ({ reason, sessionKey, runId }) => {
				if (sessionKey !== void 0 || runId !== void 0) return;
				if (reason === "disable" || reason === "restart") unregister();
			}
		});
	}
});
//#endregion
export { openshell_default as default };

import { a as runOpenShellCli, i as createOpenShellSshSession, n as resolveOpenShellPluginConfig, t as createOpenShellPluginConfigSchema } from "./.setup/config-xMr6yx5f.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { buildRemoteCommand, buildRemoteWorkdirValidationCommand, buildValidatedExecRemoteCommand, createRemoteShellSandboxFsBridge, createWritableRenameTargetResolver, disposeSshSandboxSession, prepareSshSandboxExec, registerSandboxBackend, resolvePreferredOpenClawTmpDir, resolveReadOnlyWorkspaceSkillMounts, runSshSandboxCommand, sanitizeEnvVars, shellEscape, withTempWorkspace } from "openclaw/plugin-sdk/sandbox";
import { asOptionalRecord, normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import fsSync from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { movePathWithCopyFallback } from "@openclaw/fs-safe/atomic";
import { GUEST_FILESYSTEM_PYTHON } from "@openclaw/fs-safe/guest";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { enqueueKeyedTask } from "openclaw/plugin-sdk/keyed-async-queue";
import { lstatIfExists } from "openclaw/plugin-sdk/path-existence-runtime";
import { FsSafeError, canonicalPathFromExistingAncestor, extractErrorCode } from "openclaw/plugin-sdk/security-runtime";
import { safeParseJson } from "openclaw/plugin-sdk/text-utility-runtime";
import { assertNoSymlinkParents, isPathInside, root } from "openclaw/plugin-sdk/file-access-runtime";
import pLimit from "p-limit";
// extensions/openshell/src/workspace-roots.ts
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
// extensions/openshell/src/fs-bridge.ts
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
		const hostPath = target.hostPath;
		try {
			return (await (await root(target.mountHostRoot)).read(relativeToRoot(target, hostPath), {
				hardlinks: "reject",
				maxBytes: params.maxBytes ?? Infinity
			})).buffer;
		} catch (err) {
			throw new Error(`Sandbox boundary checks failed; cannot read files: ${target.containerPath}`, { cause: err });
		}
	}
	async readDirectory(params) {
		const target = this.resolveTarget(params);
		const hostPath = target.hostPath;
		const root$1 = await root(target.mountHostRoot);
		const entries = [];
		for await (const { name, isDirectory } of root$1.entries(relativeToRoot(target, hostPath), { order: "sorted" })) entries.push({
			name,
			isDirectory
		});
		return entries;
	}
	async writeFile(params) {
		await this.writeLocalFile(params, "write");
	}
	async createFileExclusive(params) {
		return this.writeLocalFile(params, "create");
	}
	async writeLocalFile(params, method) {
		const target = this.resolveTarget(params);
		const hostPath = target.hostPath;
		this.ensureWritable(target, method === "create" ? "create files" : "write files");
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const root$2 = await root(target.mountHostRoot);
		try {
			await root$2[method](relativeToRoot(target, hostPath), buffer, {
				mkdir: method === "create" ? params.mkdir !== false : params.mkdir,
				mutationSymlinks: "reject"
			});
		} catch (error) {
			if (method === "create" && error instanceof FsSafeError && error.code === "already-exists") return "exists";
			throw error;
		}
		await this.backend.syncLocalPathToRemote(hostPath, target.containerPath);
		return "created";
	}
	async mkdirp(params) {
		const target = this.resolveTarget(params);
		this.ensureWritable(target, "create directories");
		await assertLocalPathSafety({
			target,
			allowFinalSymlinkForUnlink: false
		});
		await this.backend.mkdirpRemotePath(target.containerPath, params.signal);
		const relativePath = relativeToRoot(target, target.hostPath);
		if (relativePath) await (await root(target.mountHostRoot)).mkdir(relativePath);
	}
	async remove(params) {
		const target = this.resolveTarget(params);
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
			recursive: params.recursive,
			target
		});
	}
	async rename(params) {
		const { from, to } = this.resolveRenameTargets(params);
		await assertLocalPathSafety({
			target: from,
			allowFinalSymlinkForUnlink: true
		});
		await assertLocalPathSafety({
			target: to,
			allowFinalSymlinkForUnlink: false
		});
		await assertRenameSupported(from, to);
		await this.backend.renameRemotePath(from.containerPath, to.containerPath, params.signal);
		const root$3 = await root(from.mountHostRoot);
		const fromRelativePath = relativeToRoot(from, from.hostPath);
		const toRelativePath = relativeToRoot(to, to.hostPath);
		const parentPath = path.dirname(toRelativePath);
		if (parentPath !== "." && parentPath !== "") await root$3.mkdir(parentPath);
		await root$3.move(fromRelativePath, toRelativePath, { overwrite: true });
	}
	async stat(params) {
		const target = this.resolveTarget(params);
		const hostPath = target.hostPath;
		const stats = await lstatIfExists(hostPath, "ENOENT");
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
	containerMounts() {
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
		containerMounts.unshift(...this.readOnlyMounts().map((mount) => ({
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
		const workspaceContainerRoot = this.sandbox.containerWorkdir.replace(/\\/g, "/");
		const input = params.filePath;
		const containerMounts = this.containerMounts();
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
		for (const mount of containerMounts) if (isPathInside(mount.value.hostRoot, hostPath)) {
			const relative = path.relative(mount.value.hostRoot, hostPath).split(path.sep).join(path.posix.sep);
			const target = resolveContainerTarget(path.posix.join(mount.remote, relative));
			if (!target) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${input}`);
			return target;
		}
		throw new Error(`Path escapes sandbox root (${workspaceRoot}): ${params.filePath}`);
	}
};
async function removeLocalRootPath(params) {
	const root$4 = await root(params.target.mountHostRoot);
	const relativePath = relativeToRoot(params.target, params.target.hostPath);
	try {
		if (params.force === false) await fsPromises.lstat(params.target.hostPath);
		const targets = params.recursive && !relativePath ? (await root$4.list("")).map((name) => relativeToRoot(params.target, path.join(params.target.hostPath, name))) : [relativePath];
		for (const target of targets) await root$4.remove(target, {
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
function relativeToRoot(target, hostPath) {
	const relativePath = path.relative(target.mountHostRoot, hostPath);
	return relativePath ? `.${path.sep}${relativePath}` : "";
}
async function assertRenameSupported(from, to) {
	const stats = await fsPromises.lstat(from.hostPath);
	if (stats.isSymbolicLink()) throw new Error("Sandbox symlink rename sources are not supported by the local mirror bridge");
	if (stats.isFile() && stats.nlink > 1) throw new Error("Sandbox hardlinked rename sources are not supported by the local mirror bridge");
	if (from.mountHostRoot !== to.mountHostRoot) throw new Error("OpenShell cross-root mirror renames require pinned fs-safe support");
	const destinationParentStats = await nearestExistingDirectoryStats({
		root: from.mountHostRoot,
		targetPath: path.dirname(to.hostPath)
	});
	if (stats.dev !== destinationParentStats.dev) throw new Error("OpenShell cross-device mirror renames require pinned fs-safe support");
}
async function nearestExistingDirectoryStats(params) {
	const rootPath = path.resolve(params.root);
	let cursor = path.resolve(params.targetPath);
	while (isPathInside(rootPath, cursor)) {
		const stats = await lstatIfExists(cursor, "ENOENT");
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
	return err instanceof FsSafeError && err.code === "not-found" || extractErrorCode(err) === "ENOENT";
}
async function assertLocalPathSafety(params) {
	const { hostPath, mountHostRoot } = params.target;
	const unlinkSymlink = params.allowFinalSymlinkForUnlink && hostPath !== mountHostRoot && (await lstatIfExists(hostPath, "ENOENT"))?.isSymbolicLink();
	await assertNoSymlinkParents({
		rootDir: mountHostRoot,
		targetPath: unlinkSymlink ? path.dirname(hostPath) : hostPath,
		messagePrefix: `Sandbox boundary checks failed: ${params.target.containerPath}`
	});
}
// extensions/openshell/src/mirror.ts
const DEFAULT_OPEN_SHELL_MIRROR_EXCLUDE_DIRS = [
	"hooks",
	"git-hooks",
	".git"
];
const NESTED_GIT_EXCLUDE_DIRS = [".git"];
const COPY_TREE_FS_CONCURRENCY = 16;
function createExcludeMatcher(excludeDirs, literalNames = false) {
	const excluded = new Set((excludeDirs ?? []).map((d) => normalizeLowercaseStringOrEmpty(d)));
	return (name) => excluded.has(literalNames ? name.toLowerCase() : normalizeLowercaseStringOrEmpty(name));
}
const runLimitedFs = pLimit(COPY_TREE_FS_CONCURRENCY);
async function reconcileMirrorPath(params) {
	const targetStats = await runLimitedFs(lstatIfExists, params.targetPath, "ENOENT");
	if (targetStats && !targetStats.isDirectory() && !targetStats.isFile()) return "other";
	const sourceStats = params.sourcePath ? await runLimitedFs(fsPromises.lstat, params.sourcePath) : null;
	const sourceDir = sourceStats?.isDirectory() ? params.sourcePath : void 0;
	const sourceFile = sourceStats?.isFile() ? params.sourcePath : void 0;
	if (!params.replace && !sourceDir && !sourceFile) return "none";
	if (sourceDir || targetStats?.isDirectory()) {
		if (targetStats && !targetStats.isDirectory()) await runLimitedFs(fsPromises.rm, params.targetPath, { force: true });
		const preservedEntries = await reconcileMirrorDirectory({
			sourceDir,
			targetDir: params.targetPath,
			relativePath: params.relativePath,
			replace: params.replace,
			excludeDirs: params.excludeDirs
		});
		if (sourceFile && preservedEntries === "metadata") throw new Error(`OpenShell mirror cannot replace ${JSON.stringify(params.relativePath)}: the host directory contains repository metadata; download the sandbox file directly with the OpenShell CLI before another mirrored command discards it.`);
		if (sourceDir || preservedEntries !== "none") return preservedEntries;
		await runLimitedFs(fsPromises.rmdir, params.targetPath);
	} else if (targetStats) await runLimitedFs(fsPromises.rm, params.targetPath, { force: true });
	if (sourceFile) await runLimitedFs(fsPromises.copyFile, sourceFile, params.targetPath);
	return "none";
}
async function reconcileMirrorDirectory(params) {
	const { sourceDir } = params;
	const isExcluded = createExcludeMatcher(params.excludeDirs, params.excludeDirs === NESTED_GIT_EXCLUDE_DIRS);
	const nestedExcludeDirs = isExcluded(".git") ? NESTED_GIT_EXCLUDE_DIRS : void 0;
	await runLimitedFs(fsPromises.mkdir, params.targetDir, { recursive: true });
	const sourceEntries = new Set(sourceDir ? await runLimitedFs(() => fsPromises.readdir(sourceDir)) : []);
	const targetEntries = params.replace ? await runLimitedFs(() => fsPromises.readdir(params.targetDir)) : [];
	const results = await Promise.allSettled([.../* @__PURE__ */ new Set([...sourceEntries, ...targetEntries])].filter((entry) => !isExcluded(entry)).map((entry) => reconcileMirrorPath({
		sourcePath: sourceDir && sourceEntries.has(entry) ? path.join(sourceDir, entry) : void 0,
		targetPath: path.join(params.targetDir, entry),
		relativePath: params.relativePath ? `${params.relativePath}/${entry}` : entry,
		replace: params.replace,
		excludeDirs: nestedExcludeDirs
	})));
	let preservedEntries = targetEntries.some(isExcluded) ? "metadata" : "none";
	const errors = [];
	for (const result of results) {
		if (result.status === "rejected") {
			errors.push(result.reason);
			continue;
		}
		if (result.value === "metadata" || preservedEntries === "none") preservedEntries = result.value;
	}
	if (errors.length > 1) throw new AggregateError(errors, errors.map((error) => error instanceof Error ? error.message : String(error)).join("; "));
	if (errors.length === 1) throw errors[0];
	return preservedEntries;
}
async function replaceDirectoryContents(params) {
	await reconcileMirrorDirectory({
		...params,
		relativePath: "",
		replace: true
	});
}
async function stageDirectoryContents(params) {
	await reconcileMirrorDirectory({
		...params,
		relativePath: "",
		replace: false
	});
}
// extensions/openshell/src/backend.ts
const openShellWorkspaceOperations = /* @__PURE__ */ new Map();
let openShellDetachedCreateSupport;
const MATERIALIZED_SKILLS_REMOTE_PARTS = [".openclaw", "sandbox-skills"];
const REMOTE_MANAGED_ROOTS_EMPTY_SCRIPT = "for root in \"$@\"; do if [ -d \"$root\" ] && [ -n \"$(ls -A \"$root\")\" ]; then printf \"1\\n\"; exit 0; fi; done; printf \"0\\n\"";
const OPEN_SHELL_GUEST_MUTATION_PYTHON = `
import os, sys
guest = sys.argv.pop(1)
ignore_missing_parent = sys.argv.pop(1) == '1'
operation = sys.argv[1]
for index in ((2, 5) if operation == 'rename' else (2,)):
    root = sys.argv[index].rstrip('/') or '/'
    sys.argv[index] = root
    if not os.path.isabs(root) or os.path.islink(root):
        raise OSError('unsafe remote root: ' + root)
    if operation != 'remove':
        os.makedirs(root, exist_ok=True)
if operation == 'rename':
    target = os.path.join(sys.argv[5], sys.argv[6], sys.argv[7])
    if os.path.islink(target) or os.path.isdir(target):
        raise OSError('unsafe remote rename target: ' + target)
try:
    exec(guest)
except FileNotFoundError:
    if operation != 'remove' or not ignore_missing_parent:
        raise
`;
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
function createOpenShellSandboxBackendFactory(params) {
	return async (createParams) => {
		if ((createParams.cfg.docker.binds?.length ?? 0) > 0) throw new Error("OpenShell sandbox backend does not support sandbox.docker.binds.");
		const { sandboxName, legacyRuntimeAdopted } = resolveOpenShellSandboxName({
			scopeKey: createParams.scopeKey,
			registeredRuntimeIds: createParams.registeredRuntimeIds
		});
		return new OpenShellSandboxBackendImpl({
			createParams,
			execContext: {
				config: params.pluginConfig,
				sandboxName
			},
			legacyRuntimeAdopted,
			remoteWorkspaceDir: params.pluginConfig.remoteWorkspaceDir,
			remoteAgentWorkspaceDir: params.pluginConfig.remoteAgentWorkspaceDir
		}).asHandle();
	};
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
			const execContext = {
				config: resolveOpenShellPluginConfigFromConfig(config, params.pluginConfig),
				sandboxName: entry.containerName
			};
			const result = await runOpenShellCli({
				context: execContext,
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
					env: sanitizeEnvVars(process.env).allowed,
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
		const bridge = new OpenShellFsBridge(sandbox, {
			remoteAgentWorkspaceDir: this.params.remoteAgentWorkspaceDir,
			mkdirpRemotePath: (remotePath, signal) => this.mkdirpRemotePath(remotePath, signal),
			removeRemotePath: (remotePath, params) => this.removeRemotePath(remotePath, params),
			renameRemotePath: (from, to, signal) => this.renameRemotePath(from, to, signal),
			syncLocalPathToRemote: (localPath, remotePath) => this.syncLocalPathToRemote(localPath, remotePath)
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
		const acquired = createDeferred();
		enqueueKeyedTask({
			tails: openShellWorkspaceOperations,
			keys,
			task: () => new Promise(acquired.resolve)
		});
		return { release: await acquired.promise };
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
			let root = this.params.remoteWorkspaceDir;
			try {
				root = this.resolveRemoteTarget(workdir).root;
			} catch {}
			const result = await runSshSandboxCommand({
				session: sshSession,
				remoteCommand: buildRemoteWorkdirValidationCommand({
					workdir,
					root
				}),
				allowFailure: true
			});
			return result.code === 0 ? result.stdout.toString("utf8").trim() || null : null;
		} finally {
			await disposeSshSandboxSession(sshSession);
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
			if (DEFAULT_OPEN_SHELL_MIRROR_EXCLUDE_DIRS.some((excluded) => excluded === normalizeLowercaseStringOrEmpty(parts[0])) || parts.slice(1).some((part) => part.toLowerCase() === ".git")) return null;
			let local = root.local;
			for (const part of root.local === skillsWorkspaceDir ? ["", ...parts] : parts) {
				local = path.join(local, part);
				if (!(await lstatIfExists(local, "ENOENT"))?.isDirectory()) return null;
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
				"remove",
				target.root,
				path.posix.dirname(target.relativePath) === "." ? "" : path.posix.dirname(target.relativePath),
				path.posix.basename(target.relativePath),
				params?.recursive ? "1" : "0",
				"1"
			],
			ignoreMissingParent: params?.ignoreMissing,
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
				path.posix.basename(to.relativePath),
				"1"
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
		const stats = await lstatIfExists(localPath, "ENOENT");
		if (!stats || stats.isSymbolicLink()) {
			await this.removeRemotePath(remotePath, {
				recursive: true,
				ignoreMissing: true
			});
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
		await this.uploadFileToRemote(localPath, remotePath);
	}
	async uploadFileToRemote(localPath, remotePath) {
		await this.runCli([
			"sandbox",
			"upload",
			"--no-git-ignore",
			this.params.execContext.sandboxName,
			localPath,
			remotePath
		], "openshell sandbox upload failed");
	}
	async runCli(args, failureMessage, timeoutMs) {
		const result = await runOpenShellCli({
			context: this.params.execContext,
			args,
			cwd: this.params.createParams.workspaceDir,
			...timeoutMs === void 0 ? {} : { timeoutMs }
		});
		if (failureMessage && result.code !== 0) throw new Error(result.stderr.trim() || failureMessage);
		return result;
	}
	async runPinnedRemotePathMutation(params) {
		return await this.runRemoteShellScript({
			script: "python_script=\"$1\"; shift; python3 -c \"$python_script\" \"$@\"",
			args: [
				OPEN_SHELL_GUEST_MUTATION_PYTHON,
				GUEST_FILESYSTEM_PYTHON,
				params.ignoreMissingParent ? "1" : "0",
				...params.args
			],
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
		const getResult = await this.runCli([
			"sandbox",
			"get",
			this.params.execContext.sandboxName,
			"--output",
			"json"
		]);
		if (getResult.code === 0) {
			if (this.params.legacyRuntimeAdopted) {
				const phase = parseOpenShellSandboxPhase(getResult.stdout);
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
		await this.runCli(createArgs, "openshell sandbox create failed", Math.max(this.params.execContext.config.timeoutMs, 3e5));
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
				const result = await this.runCli([
					"sandbox",
					"create",
					"--help"
				], "openshell sandbox create capability check failed");
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
		const stats = await lstatIfExists(this.params.createParams.skillsWorkspaceDir, "ENOENT");
		await this.runRemoteShellScriptInternal({
			script: `${ENSURE_OPEN_SHELL_REMOTE_REAL_DIRECTORY_SCRIPT}\nfind "$1" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +`,
			args: [remoteSkillsWorkspaceDir, this.params.remoteWorkspaceDir]
		});
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
				await this.runCli([
					"sandbox",
					"download",
					this.params.execContext.sandboxName,
					root.remote,
					tmpDir
				], "openshell sandbox download failed");
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
					await moveLocalShadowAside({
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
			for (const entry of (await fsPromises.readdir(stagedRoot)).toSorted()) await this.uploadFileToRemote(path.join(stagedRoot, entry), `${normalizeRemotePath(remotePath)}/`);
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
function parseOpenShellSandboxPhase(stdout) {
	const parsed = asOptionalRecord(safeParseJson(stdout));
	return typeof parsed?.phase === "string" ? parsed.phase : void 0;
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
		const stats = await lstatIfExists(next, "ENOENT");
		if (!stats) return;
		if (index === parts.length - 1 || stats.isSymbolicLink() || !stats.isDirectory()) {
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
	const parentStats = await lstatIfExists(path.dirname(shadowPath), "ENOENT");
	if (!parentStats?.isDirectory() || parentStats.isSymbolicLink()) return;
	const shadowStats = await lstatIfExists(shadowPath, "ENOENT");
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
	const parentStats = await lstatIfExists(parentPath, "ENOENT");
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
// extensions/openshell/index.ts
var openshell_default = definePluginEntry({
	id: "openshell",
	name: "OpenShell Sandbox",
	description: "OpenShell-backed sandbox runtime for agent exec and file tools.",
	configSchema: createOpenShellPluginConfigSchema(),
	register(api) {
		api.registerCli(async ({ program, config }) => {
			const { registerOpenShellWorkerCli } = await import("./.setup/worker-cli-XLe-0Q5X.mjs");
			registerOpenShellWorkerCli(program, config);
		}, { descriptors: [{
			name: "openshell",
			description: "Manage OpenShell brokered workers",
			hasSubcommands: true
		}] });
		if (api.registrationMode !== "full") return;
		const pluginConfig = resolveOpenShellPluginConfig(api.pluginConfig);
		const workspace = pluginConfig.worker?.agentWorkspace;
		if (workspace) api.on("before_prompt_build", (_event, context) => {
			if (context.agentId !== workspace.agentId) return;
			const config = api.runtime.config.current();
			const workspaces = asOptionalRecord(config.plugins?.entries?.["file-transfer"]?.config?.workspaces);
			const binding = asOptionalRecord(workspaces?.[workspace.agentId]);
			if (typeof binding?.nodeId !== "string" || binding.remoteRoot !== workspace.remoteRoot) return;
			return { appendSystemContext: "This agent's canonical workspace documents are on paired node " + JSON.stringify(binding.nodeId) + " under " + JSON.stringify(binding.remoteRoot) + ". Use file_fetch and file_write with that node and an absolute document path, subject to the existing file policy. Ordinary read/write/edit/exec tools address this session's task workspace, not those shared agent documents. Do not create a local shadow or fall back to Gateway files when the node is unavailable." };
		});
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
export { openshell_default as default };

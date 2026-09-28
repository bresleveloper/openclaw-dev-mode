import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { a as openRootFile, s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { i as resolveSandboxHostPathViaExistingAncestor, t as getSandboxHostPathPolicyKey } from "./host-paths-drWtkcBg.mjs";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import { o as resolveSandboxTmpfsMounts } from "./workspace-mounts-COSMZIQN.mjs";
import { h as runDockerSandboxShellCommand, n as parseSandboxStatMtimeMs, o as buildPinnedMutationPlan, r as parseSandboxStatSize, s as GUEST_FILESYSTEM_CREATE_EXISTS_EXIT_CODE, u as parseDirectoryEntries } from "./fs-bridge-stat-parse-D4P15W-X.mjs";
import { t as SANDBOX_FILE_IDENTITY } from "./file-mutation-identity-BnGq6bcM.mjs";
import { a as resolveSandboxFsPathWithMounts, i as resolveSandboxFsMount, t as buildSandboxFsMounts } from "./fs-paths-DFN3paLR.mjs";
import fs from "node:fs";
import { promisify } from "node:util";
import path from "node:path";
//#region src/agents/sandbox/fs-bridge-path-safety.ts
/**
* Host/container path safety guard for the sandbox filesystem bridge.
*
* Proves requested container paths stay inside allowed mounts before host paths are opened or mutated.
*/
function sandboxBoundaryError(action, containerPath, error) {
	if (error instanceof Error && !(error instanceof FsSafeError && error.code === "not-file")) return error;
	return new Error(`Sandbox boundary checks failed; cannot ${action}: ${containerPath}`, { cause: error });
}
/** Validates sandbox fs bridge paths against mount, symlink, and writability boundaries. */
var SandboxFsPathGuard = class {
	constructor(params) {
		this.mountsByContainer = params.mountsByContainer.map((mount) => ({
			hostRoot: mount.hostRoot,
			containerRoot: mount.containerRoot,
			writable: mount.writable,
			source: mount.source,
			canonicalHostRoot: resolveSandboxHostPathViaExistingAncestor(mount.hostRoot)
		}));
		this.runCommand = params.runCommand;
		this.containerOnlyMounts = params.containerOnlyMounts ?? [];
	}
	async assertPathChecks(checks) {
		for (const check of checks) await this.assertPathSafety(check.target, check.options);
	}
	async assertPathSafety(target, options) {
		const allowedType = options.allowedType === "file-or-directory" ? this.pathIsExistingDirectory(target.hostPath) ? "directory" : "file" : options.allowedType;
		const guarded = await this.openBoundaryWithinRequiredMount(target, options.action, {
			aliasPolicy: options.aliasPolicy,
			allowedType
		});
		await this.assertGuardedPathSafety(target, {
			...options,
			allowedType
		}, guarded);
	}
	async openReadableFile(target, signal) {
		const resolved = await this.resolveCanonicalReadTarget(target, "read files", signal);
		const opened = await this.openBoundaryWithinRequiredMount(resolved.target, "read files");
		if (!opened.ok) throw sandboxBoundaryError("read files", target.containerPath, opened.error);
		try {
			if (getSandboxHostPathPolicyKey(resolved.canonicalHostPath) !== getSandboxHostPathPolicyKey(opened.path)) throw new Error(`Sandbox path is hidden by another mount: ${target.containerPath}. Use the mounted container path directly.`);
		} catch (error) {
			fs.closeSync(opened.fd);
			throw error;
		}
		return opened;
	}
	async resolveCanonicalEndpoint(containerPath, options) {
		const canonicalPath = await this.resolveCanonicalContainerPath({
			containerPath,
			allowFinalSymlinkForUnlink: false,
			resolveIdentity: options?.identity,
			signal: options?.signal
		});
		const mount = resolveSandboxFsMount(this.mountsByContainer, canonicalPath, this.containerOnlyMounts, { containerOnlyAsUnmapped: options?.identity });
		const relative = mount ? path.posix.relative(mount.containerRoot, canonicalPath).split("/") : [];
		return {
			containerPath: canonicalPath,
			mount,
			hostPath: mount ? path.resolve(mount.hostRoot, ...relative) : void 0,
			canonicalHostPath: mount ? path.resolve(mount.canonicalHostRoot, ...relative) : void 0
		};
	}
	async resolveFileIdentity(target, signal) {
		const resolved = await this.resolveCanonicalEndpoint(target.containerPath, {
			identity: true,
			signal
		});
		return resolved.canonicalHostPath ?? `container:${resolved.containerPath}`;
	}
	async resolveCanonicalReadTarget(target, action, signal) {
		const resolved = await this.resolveCanonicalEndpoint(target.containerPath, { signal });
		if (!resolved.mount || !resolved.hostPath || !resolved.canonicalHostPath) throw new Error(`Sandbox path escapes allowed mounts; cannot ${action}: ${resolved.containerPath}`);
		return {
			target: {
				...target,
				containerPath: resolved.containerPath,
				hostPath: resolved.hostPath,
				writable: resolved.mount.writable
			},
			canonicalHostPath: resolved.canonicalHostPath
		};
	}
	resolveRequiredMount(containerPath, action) {
		const lexicalMount = this.resolveMountByContainerPath(containerPath);
		if (!lexicalMount) throw new Error(`Sandbox path escapes allowed mounts; cannot ${action}: ${containerPath}`);
		return lexicalMount;
	}
	finalizePinnedEntry(params) {
		const relativeParentPath = path.posix.relative(params.mount.containerRoot, params.parentPath);
		if (relativePathEscapesContainerRoot(relativeParentPath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.targetPath}`);
		return {
			mountRootPath: params.mount.containerRoot,
			relativeParentPath: relativeParentPath === "." ? "" : relativeParentPath,
			basename: params.basename
		};
	}
	async assertGuardedPathSafety(target, options, guarded) {
		if (!guarded.ok) {
			if (guarded.reason !== "path") {
				if (!(guarded.reason === "io" && options.allowedType === "directory" && this.pathIsExistingDirectory(target.hostPath))) throw sandboxBoundaryError(options.action, target.containerPath, guarded.error);
			}
		} else fs.closeSync(guarded.fd);
		const canonicalContainerPath = await this.resolveCanonicalContainerPath({
			containerPath: target.containerPath,
			allowFinalSymlinkForUnlink: options.aliasPolicy?.allowFinalSymlinkForUnlink === true
		});
		const canonicalMount = this.resolveRequiredMount(canonicalContainerPath, options.action);
		if (options.requireWritable === "subtree" && this.containerOnlyMounts.some((mask) => isPathInsideContainerRoot(canonicalContainerPath, mask))) throw new Error(`Sandbox subtree contains a container-only mount; cannot ${options.action}: ${target.containerPath}. Use exec to access this mount.`);
		if (options.requireWritable && (!canonicalMount.writable || options.requireWritable === "subtree" && this.mountsByContainer.some((mount) => !mount.writable && isPathInsideContainerRoot(canonicalContainerPath, mount.containerRoot)))) throw new Error(`Sandbox path is read-only; cannot ${options.action}: ${target.containerPath}`);
	}
	async openBoundaryWithinRequiredMount(target, action, options) {
		const lexicalMount = this.resolveRequiredMount(target.containerPath, action);
		return await openRootFile({
			absolutePath: target.hostPath,
			rootPath: lexicalMount.hostRoot,
			boundaryLabel: "sandbox mount root",
			rejectSymlinks: false,
			aliasPolicy: options?.aliasPolicy,
			allowedType: options?.allowedType
		});
	}
	resolvePinnedEntry(target, action) {
		const basename = path.posix.basename(target.containerPath);
		if (!basename || basename === "." || basename === "/") throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
		const parentPath = normalizeContainerPathCore(path.posix.dirname(target.containerPath));
		const mount = this.resolveRequiredMount(parentPath, action);
		return this.finalizePinnedEntry({
			mount,
			parentPath,
			basename,
			targetPath: target.containerPath,
			action
		});
	}
	async resolveAnchoredSandboxEntry(target, action) {
		const basename = path.posix.basename(target.containerPath);
		if (!basename || basename === "." || basename === "/") throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
		const parentPath = normalizeContainerPathCore(path.posix.dirname(target.containerPath));
		const canonicalParentPath = await this.resolveCanonicalContainerPath({
			containerPath: parentPath,
			allowFinalSymlinkForUnlink: false
		});
		this.resolveRequiredMount(canonicalParentPath, action);
		return {
			canonicalParentPath,
			basename
		};
	}
	async resolveAnchoredPinnedEntry(target, action) {
		const anchoredTarget = await this.resolveAnchoredSandboxEntry(target, action);
		const mount = this.resolveRequiredMount(anchoredTarget.canonicalParentPath, action);
		return this.finalizePinnedEntry({
			mount,
			parentPath: anchoredTarget.canonicalParentPath,
			basename: anchoredTarget.basename,
			targetPath: target.containerPath,
			action
		});
	}
	/**
	* Resolves the canonical mutation destination so callers can authorize the
	* real target before pinning. File-backed actions resolve the canonical
	* parent and re-attach the requested basename; directory actions
	* (`options.directory`) canonicalize the directory itself, which an
	* existing alias may rename, and tolerate the mount root.
	*/
	async resolveCanonicalMutationTarget(target, action, options) {
		if (options?.directory) {
			const canonicalPath = await this.resolveCanonicalContainerPath({
				containerPath: target.containerPath,
				allowFinalSymlinkForUnlink: false
			});
			this.resolveRequiredMount(canonicalPath, action);
			return canonicalPath;
		}
		const anchoredTarget = await this.resolveAnchoredSandboxEntry(target, action);
		this.resolveRequiredMount(anchoredTarget.canonicalParentPath, action);
		return anchoredTarget.canonicalParentPath === "/" ? `/${anchoredTarget.basename}` : `${anchoredTarget.canonicalParentPath}/${anchoredTarget.basename}`;
	}
	async resolveAnchoredPinnedDirectoryEntry(target, action) {
		const containerPath = await this.resolveCanonicalContainerPath({
			containerPath: target.containerPath,
			allowFinalSymlinkForUnlink: false
		});
		return this.resolvePinnedDirectoryEntry({
			...target,
			containerPath
		}, action);
	}
	resolvePinnedDirectoryEntry(target, action) {
		const mount = this.resolveRequiredMount(target.containerPath, action);
		const relativePath = path.posix.relative(mount.containerRoot, target.containerPath);
		if (relativePathEscapesContainerRoot(relativePath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${action}: ${target.containerPath}`);
		return {
			mountRootPath: mount.containerRoot,
			relativePath: relativePath === "." ? "" : relativePath
		};
	}
	pathIsExistingDirectory(hostPath) {
		try {
			return fs.statSync(hostPath).isDirectory();
		} catch {
			return false;
		}
	}
	resolveMountByContainerPath(containerPath) {
		const normalized = normalizeContainerPathCore(containerPath);
		return resolveSandboxFsMount(this.mountsByContainer, normalized, this.containerOnlyMounts);
	}
	async resolveCanonicalContainerPath(params) {
		const script = [
			"set -eu",
			"target=\"$1\"",
			"allow_final=\"$2\"",
			"identity=\"$3\"",
			"suffix=\"\"",
			"read_canonical() {",
			"  canonical=$(readlink -n -f -- \"$cursor\" && printf .) || return",
			"  canonical=${canonical%.}",
			"}",
			"probe=\"$target\"",
			"if [ \"$allow_final\" = \"1\" ] && [ -L \"$target\" ]; then probe=${target%/*}; probe=${probe:-/}; fi",
			"cursor=\"$probe\"",
			"while [ ! -e \"$cursor\" ] && [ ! -L \"$cursor\" ]; do",
			"  parent=${cursor%/*}; parent=${parent:-/}",
			"  if [ \"$parent\" = \"$cursor\" ]; then break; fi",
			"  base=${cursor##*/}",
			"  suffix=\"/$base$suffix\"",
			"  cursor=\"$parent\"",
			"done",
			"if [ \"$identity\" = \"1\" ]; then",
			"  while ! read_canonical; do",
			"    parent=${cursor%/*}; parent=${parent:-/}",
			"    if [ \"$parent\" = \"$cursor\" ]; then canonical=\"$target\"; suffix=\"\"; break; fi",
			"    base=${cursor##*/}",
			"    suffix=\"/$base$suffix\"",
			"    cursor=\"$parent\"",
			"  done",
			"else",
			"  read_canonical",
			"fi",
			"printf \"%s%s\\n\" \"$canonical\" \"$suffix\""
		].join("\n");
		const canonical = (await this.runCommand(script, {
			args: [
				params.containerPath,
				params.allowFinalSymlinkForUnlink ? "1" : "0",
				params.resolveIdentity ? "1" : "0"
			],
			signal: params.signal
		})).stdout.toString("utf8").replace(/\n$/, "");
		if (!canonical.startsWith("/")) throw new Error(`Failed to resolve canonical sandbox path: ${params.containerPath}`);
		return normalizeContainerPathCore(canonical);
	}
};
//#endregion
//#region src/agents/sandbox/fs-bridge-shell-command-plans.ts
/** Builds a stat command that anchors the path at its canonical parent before reading metadata. */
function buildStatPlan(target, anchoredTarget) {
	return {
		checks: [{
			target,
			options: { action: "stat files" }
		}],
		script: "set -eu\ncd -- \"$1\"\nLC_ALL=C stat -c \"%F|%s|%y\" -- \"$2\"",
		args: [anchoredTarget.canonicalParentPath, anchoredTarget.basename],
		allowFailure: true
	};
}
//#endregion
//#region src/agents/sandbox/fs-bridge.ts
/**
* Sandbox filesystem bridge implementation.
*
* Resolves container paths to mounted host paths and executes guarded reads, writes, stats, renames, and deletes.
*/
const readFileAsync = promisify(fs.readFile);
const PINNED_MUTATION_ACTION_LABELS = {
	write: "write files",
	create: "create files",
	mkdir: "create directories",
	remove: "remove files",
	"copy-destination": "copy files"
};
/** Create the filesystem bridge for local Docker-style mounted sandboxes. */
function createSandboxFsBridge(params) {
	return new SandboxFsBridgeImpl(params.sandbox, params.containerOnlyMounts);
}
var SandboxFsBridgeImpl = class {
	constructor(sandbox, containerOnlyMounts) {
		this.sandbox = sandbox;
		this.mounts = buildSandboxFsMounts(sandbox);
		this.containerOnlyMounts = containerOnlyMounts ?? resolveSandboxTmpfsMounts(sandbox.docker.tmpfs).map((mount) => mount.containerPath);
		const mountsByContainer = [...this.mounts].toSorted((a, b) => b.containerRoot.length - a.containerRoot.length);
		this.pathGuard = new SandboxFsPathGuard({
			mountsByContainer,
			containerOnlyMounts: this.containerOnlyMounts,
			runCommand: (script, options) => this.runCommand(script, options)
		});
	}
	resolvePath(params) {
		const target = this.resolveResolvedPath(params);
		return {
			hostPath: target.hostPath,
			relativePath: target.relativePath,
			containerPath: target.containerPath
		};
	}
	get pathMappings() {
		return this.mounts;
	}
	async [SANDBOX_FILE_IDENTITY](params) {
		return this.pathGuard.resolveFileIdentity(this.resolveResolvedPath(params), params.signal);
	}
	async resolvePinnedMutationTarget(params) {
		const target = this.resolveResolvedPath(params);
		const canonicalPath = await this.pathGuard.resolveCanonicalMutationTarget(target, PINNED_MUTATION_ACTION_LABELS[params.action], { directory: params.action === "mkdir" });
		return {
			policyPath: canonicalPath,
			pinnedPath: canonicalPath
		};
	}
	async readFile(params) {
		const target = this.resolveResolvedPath(params);
		return this.readPinnedFile(target, params.maxBytes, params.signal);
	}
	async readDirectory(params) {
		const target = this.resolveResolvedPath(params);
		const result = await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "readdir",
				check: {
					target,
					options: {
						action: "list directories",
						allowedType: "directory"
					}
				},
				pinned: await this.pathGuard.resolveAnchoredPinnedDirectoryEntry(target, "list directories")
			}),
			signal: params.signal
		});
		return parseDirectoryEntries(result.stdout.toString("utf8"));
	}
	async copyFile(params) {
		const source = this.resolveResolvedPath({
			filePath: params.sourcePath,
			cwd: params.cwd
		});
		const destination = this.resolveResolvedPath({
			filePath: params.destinationPath,
			cwd: params.cwd
		});
		this.ensureWriteAccess(destination, "copy files");
		const sourceCheck = {
			target: source,
			options: {
				action: "copy files",
				allowedType: "file"
			}
		};
		const destinationCheck = {
			target: destination,
			options: {
				action: "copy files",
				requireWritable: true
			}
		};
		await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "copy",
				sourceCheck,
				destinationCheck,
				source: await this.pathGuard.resolveAnchoredPinnedEntry(source, "copy files"),
				destination: await this.resolveMutationPin(destination, params.pinnedPath, "copy files"),
				mkdir: params.mkdir !== false
			}),
			signal: params.signal
		});
	}
	async writeFile(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "write files");
		const writeCheck = {
			target,
			options: {
				action: "write files",
				requireWritable: true
			}
		};
		await this.pathGuard.assertPathSafety(target, writeCheck.options);
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const pinnedWriteTarget = await this.resolveMutationPin(target, params.pinnedPath, "write files");
		await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "write",
				check: writeCheck,
				pinned: pinnedWriteTarget,
				mkdir: params.mkdir !== false
			}),
			stdin: buffer,
			signal: params.signal
		});
	}
	async createFileExclusive(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "create files");
		const createCheck = {
			target,
			options: {
				action: "create files",
				requireWritable: true
			}
		};
		await this.pathGuard.assertPathSafety(target, createCheck.options);
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const pinnedCreateTarget = await this.resolveMutationPin(target, params.pinnedPath, "create files");
		const result = await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "create",
				check: createCheck,
				pinned: pinnedCreateTarget,
				mkdir: params.mkdir !== false
			}),
			allowFailure: true,
			stdin: buffer,
			signal: params.signal
		});
		if (result.code === GUEST_FILESYSTEM_CREATE_EXISTS_EXIT_CODE) return "exists";
		if (result.code !== 0) throw new Error(`sandbox create failed for ${target.containerPath}: ${result.stderr.toString("utf8").trim()}`);
		return "created";
	}
	async mkdirp(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "create directories");
		const mkdirCheck = {
			target,
			options: {
				action: "create directories",
				requireWritable: true,
				allowedType: "directory"
			}
		};
		await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "mkdirp",
				check: mkdirCheck,
				pinned: this.pathGuard.resolvePinnedDirectoryEntry(params.pinnedPath === void 0 ? target : this.authorizedPinnedTarget(target, params.pinnedPath, "create directories", { directory: true }), "create directories")
			}),
			signal: params.signal
		});
	}
	async remove(params) {
		const target = this.resolveResolvedPath(params);
		this.ensureWriteAccess(target, "remove files");
		const removeCheck = {
			target,
			options: {
				action: "remove files",
				requireWritable: params.recursive ? "subtree" : true,
				allowedType: "file-or-directory"
			}
		};
		await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "remove",
				check: removeCheck,
				pinned: this.pathGuard.resolvePinnedEntry(params.pinnedPath === void 0 ? target : this.authorizedPinnedTarget(target, params.pinnedPath, "remove files"), "remove files"),
				recursive: params.recursive,
				force: params.force
			}),
			signal: params.signal
		});
	}
	async rename(params) {
		const from = this.resolveResolvedPath({
			filePath: params.from,
			cwd: params.cwd
		});
		const to = this.resolveResolvedPath({
			filePath: params.to,
			cwd: params.cwd
		});
		this.ensureWriteAccess(from, "rename files");
		this.ensureWriteAccess(to, "rename files");
		const fromCheck = {
			target: from,
			options: {
				action: "rename files",
				requireWritable: "subtree",
				allowedType: "file-or-directory"
			}
		};
		const toCheck = {
			target: to,
			options: {
				action: "rename files",
				requireWritable: "subtree",
				allowedType: "file-or-directory"
			}
		};
		await this.runCheckedCommand({
			...buildPinnedMutationPlan({
				kind: "rename",
				sourceCheck: fromCheck,
				destinationCheck: toCheck,
				source: this.pathGuard.resolvePinnedEntry(from, "rename files"),
				destination: this.pathGuard.resolvePinnedEntry(to, "rename files")
			}),
			signal: params.signal
		});
	}
	async stat(params) {
		const target = this.resolveResolvedPath(params);
		const resolved = await this.pathGuard.resolveCanonicalReadTarget(target, "stat files", params.signal);
		const anchoredTarget = await this.pathGuard.resolveAnchoredSandboxEntry(target, "stat files");
		const result = await this.runPlannedCommand(buildStatPlan(resolved.target, anchoredTarget), params.signal);
		if (result.code !== 0) {
			const stderr = result.stderr.toString("utf8");
			if (stderr.includes("No such file or directory")) return null;
			const message = stderr.trim() || `stat failed with code ${result.code}`;
			throw new Error(`stat failed for ${target.containerPath}: ${message}`);
		}
		const [typeRaw, sizeRaw, mtimeRaw] = result.stdout.toString("utf8").trim().split("|");
		return {
			type: coerceStatType(typeRaw),
			size: parseSandboxStatSize(sizeRaw),
			mtimeMs: parseSandboxStatMtimeMs(mtimeRaw)
		};
	}
	async runCommand(script, options = {}) {
		const backend = this.sandbox.backend;
		if (backend) return await backend.runShellCommand({
			script,
			args: options.args,
			stdin: options.stdin,
			allowFailure: options.allowFailure,
			signal: options.signal
		});
		return await runDockerSandboxShellCommand({
			containerName: this.sandbox.containerName,
			script,
			args: options.args,
			stdin: options.stdin,
			allowFailure: options.allowFailure,
			signal: options.signal
		});
	}
	async readPinnedFile(target, maxBytes, signal) {
		const opened = await this.pathGuard.openReadableFile(target, signal);
		try {
			if (maxBytes === void 0) return await readFileAsync(opened.fd);
			if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new RangeError("maxBytes must be a non-negative safe integer");
			const initialStat = fs.fstatSync(opened.fd);
			if (!initialStat.isFile()) throw new Error(`Sandbox read requires a regular file: ${target.containerPath}`);
			if (initialStat.size > maxBytes) throw new RangeError(`File exceeds ${maxBytes} bytes`);
			const data = await readFileDescriptorBounded(opened.fd, maxBytes);
			const finalStat = fs.fstatSync(opened.fd);
			if (!finalStat.isFile() || finalStat.size > maxBytes) throw new RangeError(`File exceeds ${maxBytes} bytes`);
			return data;
		} finally {
			fs.closeSync(opened.fd);
		}
	}
	async runCheckedCommand(plan) {
		await this.pathGuard.assertPathChecks(plan.checks);
		if (plan.recheckBeforeCommand) await this.pathGuard.assertPathChecks(plan.checks);
		return await this.runCommand(plan.script, {
			args: plan.args,
			stdin: plan.stdin,
			allowFailure: plan.allowFailure,
			signal: plan.signal
		});
	}
	async runPlannedCommand(plan, signal) {
		return await this.runCheckedCommand({
			...plan,
			signal
		});
	}
	ensureWriteAccess(target, action) {
		if (this.sandbox.workspaceAccess === "ro" || !target.writable) throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
	}
	resolveResolvedPath(params) {
		return resolveSandboxFsPathWithMounts({
			filePath: params.filePath,
			cwd: params.cwd ?? this.sandbox.workspaceDir,
			defaultWorkspaceRoot: this.sandbox.workspaceDir,
			defaultContainerRoot: this.sandbox.containerWorkdir,
			mounts: this.mounts,
			containerOnlyMounts: this.containerOnlyMounts
		});
	}
	/**
	* Pins a mutation for a destination the caller already authorized via
	* resolvePinnedMutationTarget. The canonical path is pinned lexically so no
	* sandbox-writable path component is resolved again after authorization;
	* the no-follow pinned walk then fails closed on any post-authorization
	* swap instead of redirecting the mutation.
	*/
	async resolveMutationPin(target, pinnedPath, action) {
		if (pinnedPath === void 0) return await this.pathGuard.resolveAnchoredPinnedEntry(target, action);
		return this.pathGuard.resolvePinnedEntry(this.authorizedPinnedTarget(target, pinnedPath, action), action);
	}
	authorizedPinnedTarget(target, pinnedPath, action, options) {
		const canonicalPath = normalizeContainerPathCore(pinnedPath);
		if (!options?.directory && path.posix.basename(canonicalPath) !== path.posix.basename(target.containerPath)) throw new Error(`Pinned sandbox destination does not match the requested path; cannot ${action}: ${target.containerPath}`);
		return {
			...target,
			containerPath: canonicalPath
		};
	}
};
function coerceStatType(typeRaw) {
	if (!typeRaw) return "other";
	const normalized = normalizeOptionalLowercaseString(typeRaw) ?? "";
	if (normalized.includes("directory")) return "directory";
	if (normalized.includes("file")) return "file";
	return "other";
}
//#endregion
export { createSandboxFsBridge as t };

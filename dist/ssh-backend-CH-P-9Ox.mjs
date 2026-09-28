import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { i as resolveRootPath } from "./boundary-path-BzetEUdq.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { D as listAgentEntriesWithSource, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { _ as secretRefKey } from "./ref-contract-BVi3ykLT.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { a as normalizeEnvVarKey } from "./host-env-security-D7wdDMke.mjs";
import "./exec-shcN2-sN.mjs";
import { i as isPlainCommandExitFailure } from "./exec-result-C4wNdxxi.mjs";
import { o as spawnCommand } from "./exec-spawn-B7redWCL.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DVMYGogL.mjs";
import { x as SANDBOX_COMMAND_MAX_BUFFER_BYTES } from "./constants-D1dHTp_E.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { t as hashTextSha256 } from "./hash-DZK-8tRm.mjs";
import { n as sanitizeEnvVars } from "./sanitize-env-vars-C8Jo3pLt.mjs";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import { r as resolveReadOnlyWorkspaceSkillMounts } from "./workspace-mounts-COSMZIQN.mjs";
import { n as resolveSandboxAgentId } from "./shared-ByhrzAKj.mjs";
import { a as buildPinnedMutationArgs, c as GUEST_FILESYSTEM_READ_NOT_FOUND_EXIT_CODE, i as SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL, l as GUEST_FILESYSTEM_RENAME_NO_REPLACE_PYTHON, n as parseSandboxStatMtimeMs, r as parseSandboxStatSize, s as GUEST_FILESYSTEM_CREATE_EXISTS_EXIT_CODE, t as hasMultipleHardlinks, u as parseDirectoryEntries } from "./fs-bridge-stat-parse-D4P15W-X.mjs";
import { t as SANDBOX_FILE_IDENTITY } from "./file-mutation-identity-BnGq6bcM.mjs";
import { n as runtimeSandboxSecretOwnerId, t as assertRuntimeSandboxSecretOwnerAvailable } from "./runtime-sandbox-secret-owner-B82x0BeI.mjs";
import { t as parseSshTarget } from "./ssh-tunnel-D-X-TgXs.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/agents/sandbox/fs-bridge-rename-targets.ts
/**
* Shared writable-target resolution for sandbox fs bridge rename operations.
*/
/** Resolves both rename endpoints and verifies write access before command execution. */
function resolveWritableRenameTargets(params) {
	const action = params.action ?? "rename files";
	const from = params.resolveTarget({
		filePath: params.from,
		cwd: params.cwd
	});
	const to = params.resolveTarget({
		filePath: params.to,
		cwd: params.cwd
	});
	params.ensureWritable(from, action);
	params.ensureWritable(to, action);
	return {
		from,
		to
	};
}
/** Adapter used by bridge implementations that pass resolver callbacks separately. */
function resolveWritableRenameTargetsForBridge(params, resolveTarget, ensureWritable) {
	return resolveWritableRenameTargets({
		...params,
		resolveTarget,
		ensureWritable
	});
}
/** Creates a reusable resolver bound to a bridge's target and permission helpers. */
function createWritableRenameTargetResolver(resolveTarget, ensureWritable) {
	return (params) => resolveWritableRenameTargetsForBridge(params, resolveTarget, ensureWritable);
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge-paths.ts
/** Pure mount and path helpers for the remote sandbox filesystem bridge. */
function resolveRemoteMountByContainerPath(mounts, containerPath) {
	return mounts.toSorted((a, b) => b.containerRoot.length - a.containerRoot.length || mountPriority(b) - mountPriority(a)).find((mount) => isPathInsideContainerRoot(mount.containerRoot, containerPath)) ?? null;
}
function resolveRemoteMountByLocalPath(mounts, localPath) {
	return mounts.toSorted((a, b) => b.localRoot.length - a.localRoot.length || mountPriority(b) - mountPriority(a)).find((mount) => isPathInside(mount.localRoot, localPath)) ?? null;
}
function buildRemoteProtectedSkillRoots(params) {
	const roots = [
		path.posix.join(params.workspaceContainerRoot, "skills"),
		path.posix.join(params.workspaceContainerRoot, ".agents", "skills"),
		path.posix.join(params.workspaceContainerRoot, ".openclaw", "sandbox-skills", "skills")
	];
	if (params.includeAgentMount) roots.push(path.posix.join(params.agentContainerRoot, "skills"), path.posix.join(params.agentContainerRoot, ".agents", "skills"), path.posix.join(params.agentContainerRoot, ".openclaw", "sandbox-skills", "skills"));
	return roots;
}
function mountPriority(mount) {
	if (mount.source === "protectedSkill") return 2;
	if (mount.source === "agent") return 1;
	return 0;
}
function normalizeContainerPath(value) {
	const normalized = normalizeContainerPathCore(value.trim() || "/");
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
function toPosixRelative(root, candidate) {
	return path.relative(root, candidate).split(path.sep).filter(Boolean).join(path.posix.sep);
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge-canonical-path.ts
/** Canonical path resolution for remote shell-backed sandbox mounts. */
async function resolveRemoteCanonicalPath(params) {
	const script = [
		"set -eu",
		"target=\"$1\"",
		"allow_final=\"$2\"",
		"suffix=\"\"",
		"probe=\"$target\"",
		"if [ \"$allow_final\" = \"1\" ] && [ -L \"$target\" ]; then probe=$(dirname -- \"$target\"); fi",
		"cursor=\"$probe\"",
		"while [ ! -e \"$cursor\" ] && [ ! -L \"$cursor\" ]; do",
		"  parent=$(dirname -- \"$cursor\")",
		"  if [ \"$parent\" = \"$cursor\" ]; then break; fi",
		"  base=$(basename -- \"$cursor\")",
		"  suffix=\"/$base$suffix\"",
		"  cursor=\"$parent\"",
		"done",
		"canonical=$(readlink -f -- \"$cursor\")",
		"canonical_root=$(readlink -f -- \"$3\")",
		"printf \"%s%s\\n%s\\n\" \"$canonical\" \"$suffix\" \"$canonical_root\""
	].join("\n");
	const [canonicalRaw = "", canonicalRootRaw = ""] = (await params.runRemoteShellScript({
		script,
		args: [
			params.containerPath,
			params.allowFinalSymlinkForUnlink ? "1" : "0",
			params.mountRootPath
		],
		signal: params.signal
	})).stdout.toString("utf8").trim().split("\n");
	if (!canonicalRaw || !canonicalRootRaw) throw new Error(`Sandbox path canonicalization failed; cannot ${params.action}: ${params.containerPath}`);
	const canonicalPath = normalizeContainerPath(canonicalRaw);
	const canonicalMountRoot = normalizeContainerPath(canonicalRootRaw);
	const relative = path.posix.relative(canonicalMountRoot, canonicalPath);
	if (relativePathEscapesContainerRoot(relative)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`);
	return {
		canonicalPath,
		canonicalMountRoot,
		logicalPath: relative === "." ? params.mountRootPath : normalizeContainerPath(path.posix.join(params.mountRootPath, relative))
	};
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge-pinned-frame.ts
/**
* Pinned mutation frame helpers for the remote shell-backed sandbox bridge.
*
* An already-authorized pinned destination is converted into the canonical
* frame the mutation helper walks. Only the infrastructure-owned mount root
* alias is re-read; sandbox-writable path components are never followed
* again, so a post-authorization swap fails the containment check instead of
* redirecting the mutation.
*/
/** Maps a resolver action to the mutation action label used in errors. */
const REMOTE_PINNED_ACTION_LABELS = {
	write: "write files",
	create: "create files",
	mkdir: "create directories",
	remove: "remove files",
	"copy-destination": "copy files"
};
function remotePinnedActionLabel(action) {
	return REMOTE_PINNED_ACTION_LABELS[action];
}
/**
* Builds the canonical frame for an already-authorized pinned destination.
* File-backed operations pin the canonical parent (the filename is stripped
* and re-attached by the caller); directory operations pin the directory
* itself, which an existing alias may have renamed.
*/
async function resolveRemotePinnedCanonicalFrame(params) {
	const pinnedPath = normalizeContainerPath(params.pinnedPath);
	const probePath = params.directory ? pinnedPath : path.posix.dirname(pinnedPath);
	const canonicalMountRoot = normalizeContainerPath((await params.runRemoteShellScript({
		script: "canonical_root=$(readlink -f -- \"$1\")\nprintf \"%s\\n\" \"$canonical_root\"",
		args: [params.mountRootPath],
		signal: params.signal
	})).stdout.toString("utf8").trim());
	if (!canonicalMountRoot.startsWith("/")) throw new Error(`Sandbox path canonicalization failed; cannot ${params.action}: ${pinnedPath}`);
	const relative = path.posix.relative(canonicalMountRoot, probePath);
	if (relativePathEscapesContainerRoot(relative)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${pinnedPath}`);
	return {
		canonicalPath: probePath,
		canonicalMountRoot,
		logicalPath: relative === "." ? params.mountRootPath : normalizeContainerPath(path.posix.join(params.mountRootPath, relative))
	};
}
/**
* Validates a pre-authorized pinned destination against the requested entry.
* File-backed pins must preserve the requested basename so the mutation lands
* on the authorized entry; directory pins authorize the full directory, which
* an existing alias may rename.
*/
function authorizedRemotePinnedPath(pinnedPath, containerPath, action, options) {
	if (pinnedPath === void 0) return;
	const canonical = normalizeContainerPath(pinnedPath);
	if (!options?.directory && path.posix.basename(canonical) !== path.posix.basename(containerPath)) throw new Error(`Pinned sandbox destination does not match the requested path; cannot ${action}: ${containerPath}`);
	return canonical;
}
/**
* Resolves the pinned mutation entry for a remote destination. Mount policy
* is resolved in the logical namespace, but the mutation is pinned to the
* canonical root so a legitimate symlinked workspace root is not reopened.
*/
async function resolveRemotePinnedTarget(params, deps) {
	const basename = params.directory ? "" : path.posix.basename(params.containerPath);
	if (!params.directory && (!basename || basename === "." || basename === "/")) throw new Error(`Invalid sandbox entry target: ${params.containerPath}`);
	const { canonicalPath, canonicalMountRoot, logicalPath } = params.pinnedCanonicalPath !== void 0 ? await resolveRemotePinnedCanonicalFrame({
		pinnedPath: params.pinnedCanonicalPath,
		directory: params.directory === true,
		mountRootPath: params.mountRootPath,
		action: params.action,
		signal: params.signal,
		runRemoteShellScript: (command) => deps.runRemoteShellScript(command)
	}) : await deps.resolveCanonicalPath({
		containerPath: normalizeContainerPath(params.directory ? params.containerPath : path.posix.dirname(params.containerPath)),
		mountRootPath: params.mountRootPath,
		action: params.action,
		allowFinalSymlinkForUnlink: params.allowFinalSymlinkForUnlink,
		signal: params.signal
	});
	const mount = resolveRemoteMountByContainerPath(deps.mounts, logicalPath);
	if (!mount) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`);
	if (params.requireWritable && !mount.writable) throw new Error(`Sandbox path is read-only; cannot ${params.action}: ${params.containerPath}`);
	if (params.requireWritable) await deps.assertRemoteProtectedPathWritable({
		containerPath: path.posix.join(logicalPath, basename),
		action: params.action,
		displayPath: params.containerPath,
		signal: params.signal,
		includeDescendants: params.includeDescendants
	});
	const relativeParentPath = path.posix.relative(canonicalMountRoot, canonicalPath);
	if (relativePathEscapesContainerRoot(relativeParentPath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`);
	return {
		mountRootPath: canonicalMountRoot,
		relativeParentPath: relativeParentPath === "." ? "" : relativeParentPath,
		basename
	};
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge.ts
/**
* Remote shell-backed sandbox filesystem bridge.
*
* Resolves sandbox paths against uploaded remote mounts and performs guarded operations through backend shell commands.
*/
/** Create the filesystem bridge for remote shell-backed sandbox runtimes. */
function createRemoteShellSandboxFsBridge(params) {
	return new RemoteShellSandboxFsBridge(params.sandbox, params.runtime);
}
var RemoteShellSandboxFsBridge = class {
	constructor(sandbox, runtime) {
		this.sandbox = sandbox;
		this.runtime = runtime;
		this.resolveRenameTargets = createWritableRenameTargetResolver((target) => this.resolveTarget(target), (target, action) => this.ensureWritable(target, action));
	}
	resolvePath(params) {
		const target = this.resolveTarget(params);
		return {
			relativePath: target.relativePath,
			containerPath: target.containerPath
		};
	}
	get pathMappings() {
		const mounts = this.getMounts();
		return [...new Set(mounts.map((mount) => mount.containerRoot))].map((containerRoot) => ({
			hostRoot: resolveRemoteMountByContainerPath(mounts, containerRoot).localRoot,
			containerRoot
		}));
	}
	async [SANDBOX_FILE_IDENTITY](params) {
		const target = this.resolveTarget(params);
		const { canonicalPath } = await this.resolveCanonicalPath({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "identify files",
			signal: params.signal
		});
		return canonicalPath;
	}
	async readFile(params) {
		return (await this.readFileWithSource(params)).data;
	}
	async readFileWithSource(params) {
		if (params.maxBytes !== void 0 && (!Number.isSafeInteger(params.maxBytes) || params.maxBytes < 0)) throw new RangeError("Sandbox file read limit must be a non-negative safe integer.");
		const target = this.resolveTarget(params);
		const relativePath = path.posix.relative(target.mountRootPath, target.containerPath);
		if (relativePath === "" || relativePath === "." || relativePathEscapesContainerRoot(relativePath)) throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
		const pinned = await this.resolvePinnedTarget({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "read files",
			signal: params.signal
		});
		const result = await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "read",
				pinned,
				maxBytes: params.maxBytes
			}),
			signal: params.signal,
			allowFailure: true
		});
		if (result.code === GUEST_FILESYSTEM_READ_NOT_FOUND_EXIT_CODE) throw Object.assign(/* @__PURE__ */ new Error(`Sandbox file not found: ${target.containerPath}`), { code: "ENOENT" });
		if (result.code !== 0) throw new Error(`Sandbox read failed (${result.code}): ${result.stderr.toString("utf8").trim()}`);
		const logicalPath = path.posix.join(target.mountRootPath, pinned.relativeParentPath, pinned.basename);
		const source = resolveRemoteMountByContainerPath(this.getMounts(), logicalPath);
		return {
			data: result.stdout,
			canonicalPath: path.posix.join(pinned.mountRootPath, pinned.relativeParentPath, pinned.basename),
			...source?.source === "workspace" ? { workspaceRelativePath: path.posix.relative(source.containerRoot, logicalPath) } : {}
		};
	}
	async readDirectory(params) {
		const target = this.resolveTarget(params);
		const pinned = await this.resolvePinnedTarget({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "list directories",
			directory: true,
			signal: params.signal
		});
		const result = await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "readdir",
				pinned: {
					mountRootPath: pinned.mountRootPath,
					relativePath: pinned.relativeParentPath
				}
			}),
			signal: params.signal
		});
		return parseDirectoryEntries(result.stdout.toString("utf8"));
	}
	async copyFile(params) {
		const source = this.resolveTarget({
			filePath: params.sourcePath,
			cwd: params.cwd
		});
		const destination = this.resolveTarget({
			filePath: params.destinationPath,
			cwd: params.cwd
		});
		await this.ensureRemoteWritable(destination, "copy files", params.signal);
		await this.assertNoHardlinkedFile({
			containerPath: destination.containerPath,
			action: "copy files",
			signal: params.signal
		});
		const sourcePinned = await this.resolvePinnedTarget({
			containerPath: source.containerPath,
			mountRootPath: source.mountRootPath,
			action: "copy files",
			signal: params.signal
		});
		const destinationPinned = await this.resolvePinnedTarget({
			containerPath: destination.containerPath,
			mountRootPath: destination.mountRootPath,
			action: "copy files",
			requireWritable: true,
			pinnedCanonicalPath: authorizedRemotePinnedPath(params.pinnedPath, destination.containerPath, "copy files"),
			signal: params.signal
		});
		await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "copy",
				source: sourcePinned,
				destination: destinationPinned,
				mkdir: params.mkdir !== false
			}),
			signal: params.signal
		});
	}
	async writeFile(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "write files", params.signal);
		const pinned = await this.resolvePinnedTarget({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "write files",
			requireWritable: true,
			pinnedCanonicalPath: authorizedRemotePinnedPath(params.pinnedPath, target.containerPath, "write files"),
			signal: params.signal
		});
		await this.assertNoHardlinkedFile({
			containerPath: target.containerPath,
			action: "write files",
			signal: params.signal
		});
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "write",
				pinned,
				mkdir: params.mkdir !== false
			}),
			stdin: buffer,
			signal: params.signal
		});
	}
	async createFileExclusive(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "create files", params.signal);
		const pinned = await this.resolvePinnedTarget({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "create files",
			requireWritable: true,
			pinnedCanonicalPath: authorizedRemotePinnedPath(params.pinnedPath, target.containerPath, "create files"),
			signal: params.signal
		});
		const buffer = Buffer.isBuffer(params.data) ? params.data : Buffer.from(params.data, params.encoding ?? "utf8");
		const result = await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "create",
				pinned,
				mkdir: params.mkdir !== false
			}),
			stdin: buffer,
			allowFailure: true,
			signal: params.signal
		});
		if (result.code === GUEST_FILESYSTEM_CREATE_EXISTS_EXIT_CODE) return "exists";
		if (result.code !== 0) throw new Error(`Sandbox create failed for ${target.containerPath}: ${result.stderr.toString("utf8").trim()}`);
		return "created";
	}
	async mkdirp(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "create directories", params.signal);
		const relativePath = path.posix.relative(target.mountRootPath, target.containerPath);
		if (relativePathEscapesContainerRoot(relativePath)) throw new Error(`Sandbox path escapes allowed mounts; cannot create directories: ${target.containerPath}`);
		if (relativePath === "" || relativePath === ".") return;
		const pinned = await this.resolvePinnedTarget({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "create directories",
			requireWritable: true,
			directory: true,
			pinnedCanonicalPath: authorizedRemotePinnedPath(params.pinnedPath, target.containerPath, "create directories", { directory: true }),
			signal: params.signal
		});
		await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "mkdirp",
				pinned: {
					mountRootPath: pinned.mountRootPath,
					relativePath: pinned.relativeParentPath
				}
			}),
			signal: params.signal
		});
	}
	async remove(params) {
		const target = this.resolveTarget(params);
		await this.ensureRemoteWritable(target, "remove files", params.signal, params.recursive);
		if (!await this.remotePathExists(target.containerPath, params.signal)) {
			if (params.force === false) throw new Error(`Sandbox path not found; cannot remove files: ${target.containerPath}`);
			return;
		}
		const pinned = await this.resolvePinnedTarget({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "remove files",
			requireWritable: true,
			includeDescendants: params.recursive,
			allowFinalSymlinkForUnlink: true,
			pinnedCanonicalPath: authorizedRemotePinnedPath(params.pinnedPath, target.containerPath, "remove files"),
			signal: params.signal
		});
		await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "remove",
				pinned,
				recursive: params.recursive,
				force: params.force
			}),
			signal: params.signal,
			allowFailure: params.force !== false
		});
	}
	async rename(params) {
		const { from, to } = this.resolveRenameTargets(params);
		await this.ensureRemoteWritable(from, "rename files", params.signal, true);
		await this.ensureRemoteWritable(to, "rename files", params.signal, true);
		const fromPinned = await this.resolvePinnedTarget({
			containerPath: from.containerPath,
			mountRootPath: from.mountRootPath,
			action: "rename files",
			requireWritable: true,
			includeDescendants: true,
			allowFinalSymlinkForUnlink: true,
			signal: params.signal
		});
		const toPinned = await this.resolvePinnedTarget({
			containerPath: to.containerPath,
			mountRootPath: to.mountRootPath,
			action: "rename files",
			requireWritable: true,
			includeDescendants: true,
			signal: params.signal
		});
		await this.runMutation({
			args: buildPinnedMutationArgs({
				kind: "rename",
				source: fromPinned,
				destination: toPinned
			}),
			signal: params.signal
		});
	}
	async stat(params) {
		const target = this.resolveTarget(params);
		if (!await this.remotePathExists(target.containerPath, params.signal)) return null;
		const { canonicalPath } = await this.resolveCanonicalPath({
			containerPath: target.containerPath,
			mountRootPath: target.mountRootPath,
			action: "stat files",
			signal: params.signal
		});
		await this.assertNoHardlinkedFile({
			containerPath: canonicalPath,
			action: "stat files",
			signal: params.signal
		});
		const [kindRaw = "", sizeRaw = "0", mtimeRaw = "0"] = (await this.runtime.runRemoteShellScript({
			script: "set -eu\nLC_ALL=C stat -c \"%F|%s|%y\" -- \"$1\"",
			args: [canonicalPath],
			signal: params.signal
		})).stdout.toString("utf8").trim().split("|");
		return {
			type: kindRaw === "directory" ? "directory" : kindRaw === "regular file" ? "file" : "other",
			size: parseSandboxStatSize(sizeRaw),
			mtimeMs: parseSandboxStatMtimeMs(mtimeRaw)
		};
	}
	getMounts() {
		const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
		const agentRoot = path.resolve(this.sandbox.agentWorkspaceDir);
		const workspaceContainerRoot = normalizeContainerPath(this.runtime.remoteWorkspaceDir);
		const agentContainerRoot = normalizeContainerPath(this.runtime.remoteAgentWorkspaceDir);
		const hasAgentMount = this.sandbox.workspaceAccess !== "none" && agentRoot !== workspaceRoot;
		const mounts = [{
			localRoot: workspaceRoot,
			containerRoot: workspaceContainerRoot,
			writable: this.sandbox.workspaceAccess !== "ro",
			source: "workspace"
		}];
		if (hasAgentMount) mounts.push({
			localRoot: agentRoot,
			containerRoot: agentContainerRoot,
			writable: this.sandbox.workspaceAccess === "rw",
			source: "agent"
		});
		for (const workdir of [workspaceContainerRoot, ...hasAgentMount ? [agentContainerRoot] : []]) mounts.push(...resolveReadOnlyWorkspaceSkillMounts({
			...this.sandbox,
			workdir
		}).map((mount) => ({
			localRoot: mount.hostPath,
			containerRoot: mount.containerPath,
			writable: false,
			source: "protectedSkill"
		})));
		for (const resource of this.sandbox.readOnlyResourceMounts ?? []) mounts.push({
			localRoot: resource.hostPath,
			containerRoot: resource.containerPath,
			writable: false,
			source: "protectedSkill"
		});
		return mounts;
	}
	resolveTarget(params) {
		const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
		const mounts = this.getMounts();
		const input = params.filePath.trim();
		const inputPosix = input.replace(/\\/g, "/");
		const maybeContainerMount = path.posix.isAbsolute(inputPosix) ? resolveRemoteMountByContainerPath(mounts, normalizeContainerPath(inputPosix)) : null;
		if (maybeContainerMount) return this.toResolvedPath({
			mount: maybeContainerMount,
			containerPath: normalizeContainerPath(inputPosix)
		});
		const hostCwd = params.cwd ? path.resolve(params.cwd) : workspaceRoot;
		const hostCandidate = path.isAbsolute(input) ? path.resolve(input) : path.resolve(hostCwd, input);
		const hostMount = resolveRemoteMountByLocalPath(mounts, hostCandidate);
		if (hostMount) {
			const relative = toPosixRelative(hostMount.localRoot, hostCandidate);
			return this.toResolvedPath({
				mount: hostMount,
				containerPath: relative ? path.posix.join(hostMount.containerRoot, relative) : hostMount.containerRoot
			});
		}
		if (params.cwd) {
			const cwdPosix = params.cwd.replace(/\\/g, "/");
			if (path.posix.isAbsolute(cwdPosix)) {
				const cwdContainer = normalizeContainerPath(cwdPosix);
				const cwdMount = resolveRemoteMountByContainerPath(mounts, cwdContainer);
				if (cwdMount) {
					const containerPath = normalizeContainerPath(path.posix.resolve(cwdContainer, inputPosix));
					const targetMount = resolveRemoteMountByContainerPath(mounts, containerPath) ?? cwdMount;
					return this.toResolvedPath({
						mount: targetMount,
						containerPath
					});
				}
			}
		}
		throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${params.filePath}`);
	}
	toResolvedPath(params) {
		const relative = path.posix.relative(params.mount.containerRoot, params.containerPath);
		if (relativePathEscapesContainerRoot(relative)) throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${params.containerPath}`);
		return {
			relativePath: params.mount.source === "workspace" || params.mount.source === "protectedSkill" ? relative === "." ? "" : path.posix.relative(this.runtime.remoteWorkspaceDir, params.containerPath) : relative === "." ? params.mount.containerRoot : `${params.mount.containerRoot}/${relative}`,
			containerPath: params.containerPath,
			writable: params.mount.writable,
			mountRootPath: params.mount.containerRoot,
			source: params.mount.source
		};
	}
	ensureWritable(target, action) {
		if (this.sandbox.workspaceAccess === "ro" || !target.writable) throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
	}
	async ensureRemoteWritable(target, action, signal, includeDescendants = false) {
		this.ensureWritable(target, action);
		await this.assertRemoteProtectedPathWritable({
			containerPath: target.containerPath,
			action,
			signal,
			includeDescendants
		});
	}
	async assertRemoteProtectedPathWritable(params) {
		const roots = /* @__PURE__ */ new Set([...this.getMounts().filter((mount) => !mount.writable).map((mount) => mount.containerRoot), ...buildRemoteProtectedSkillRoots({
			workspaceContainerRoot: normalizeContainerPath(this.runtime.remoteWorkspaceDir),
			agentContainerRoot: normalizeContainerPath(this.runtime.remoteAgentWorkspaceDir),
			includeAgentMount: this.sandbox.workspaceAccess !== "none" && path.resolve(this.sandbox.agentWorkspaceDir) !== path.resolve(this.sandbox.workspaceDir)
		})]);
		for (const root of roots) if ((isPathInsideContainerRoot(root, params.containerPath) || params.includeDescendants && isPathInsideContainerRoot(params.containerPath, root)) && await this.remotePathExists(root, params.signal)) throw new Error(`Sandbox path is read-only; cannot ${params.action}: ${params.displayPath ?? params.containerPath}`);
	}
	async remotePathExists(containerPath, signal) {
		return (await this.runtime.runRemoteShellScript({
			script: "if [ -e \"$1\" ] || [ -L \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
			args: [containerPath],
			signal
		})).stdout.toString("utf8").trim() === "1";
	}
	async resolveCanonicalPath(params) {
		return await resolveRemoteCanonicalPath({
			...params,
			runRemoteShellScript: async (command) => await this.runtime.runRemoteShellScript(command)
		});
	}
	async assertNoHardlinkedFile(params) {
		const output = (await this.runtime.runRemoteShellScript({
			script: [
				"if [ ! -e \"$1\" ] && [ ! -L \"$1\" ]; then exit 0; fi",
				"stats=$(LC_ALL=C stat -c \"%F|%h\" -- \"$1\")",
				"printf \"%s\\n\" \"$stats\""
			].join("\n"),
			args: [params.containerPath],
			signal: params.signal,
			allowFailure: true
		})).stdout.toString("utf8").trim();
		if (!output) return;
		const [kind = "", linksRaw = "1"] = output.split("|");
		if (kind === "regular file" && hasMultipleHardlinks(linksRaw)) throw new Error(`Hardlinked path is not allowed under sandbox mount root: ${params.containerPath}`);
	}
	async resolvePinnedMutationTarget(params) {
		const target = this.resolveTarget(params);
		const action = remotePinnedActionLabel(params.action);
		const { canonicalPath, logicalPath } = await this.resolveCanonicalPath({
			containerPath: normalizeContainerPath(params.action === "mkdir" ? target.containerPath : path.posix.dirname(target.containerPath)),
			mountRootPath: target.mountRootPath,
			action,
			signal: params.signal
		});
		if (!resolveRemoteMountByContainerPath(this.getMounts(), logicalPath)) throw new Error(`Sandbox path escapes allowed mounts; cannot ${action}: ${target.containerPath}`);
		if (params.action === "mkdir") return {
			policyPath: logicalPath,
			pinnedPath: canonicalPath
		};
		const basename = path.posix.basename(target.containerPath);
		return {
			policyPath: normalizeContainerPath(path.posix.join(logicalPath, basename)),
			pinnedPath: normalizeContainerPath(path.posix.join(canonicalPath, basename))
		};
	}
	resolvePinnedTarget(params) {
		return resolveRemotePinnedTarget(params, {
			mounts: this.getMounts(),
			resolveCanonicalPath: (canonicalParams) => this.resolveCanonicalPath(canonicalParams),
			assertRemoteProtectedPathWritable: (protectedParams) => this.assertRemoteProtectedPathWritable(protectedParams),
			runRemoteShellScript: (command) => this.runtime.runRemoteShellScript(command)
		});
	}
	async runMutation(params) {
		return await this.runtime.runRemoteShellScript({
			script: [
				"set -eu",
				`python_script=${SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL}`,
				"python3 -c \"$python_script\" \"$@\""
			].join("\n"),
			args: params.args,
			stdin: params.stdin,
			signal: params.signal,
			allowFailure: params.allowFailure
		});
	}
};
//#endregion
//#region src/agents/sandbox/remote-shell-bootstrap-python.ts
const REMOVE_OWNED_STAGE = [
	"def remove_owned_stage(staging):",
	"    try:",
	"        root = os.lstat(staging)",
	"    except FileNotFoundError:",
	"        return",
	"    if not stat.S_ISDIR(root.st_mode):",
	"        raise OSError(errno.ENOTDIR, 'bootstrap staging path is not a directory', staging)",
	"    def restore_directories(directory):",
	"        mode = os.lstat(directory).st_mode",
	"        if not stat.S_ISDIR(mode):",
	"            return",
	"        # Tar can restore readonly or unsearchable modes after extracting children.",
	"        # Change only owned directories, before traversing them; never follow links.",
	"        os.chmod(directory, stat.S_IMODE(mode) | 0o700, follow_symlinks=False)",
	"        with os.scandir(directory) as entries:",
	"            for entry in entries:",
	"                if entry.is_dir(follow_symlinks=False):",
	"                    restore_directories(entry.path)",
	"    restore_directories(staging)",
	"    shutil.rmtree(staging)"
].join("\n");
const PUBLISH_REMOTE_WORKSPACE = [
	"import ctypes, errno, os, shutil, stat, sys",
	GUEST_FILESYSTEM_RENAME_NO_REPLACE_PYTHON,
	REMOVE_OWNED_STAGE,
	"staging, destination = sys.argv[1:]",
	"parent = os.path.dirname(destination)",
	"if os.path.dirname(staging) != parent:",
	"    raise ValueError('bootstrap staging must share the destination parent')",
	"parent_fd = os.open(parent, os.O_RDONLY | os.O_DIRECTORY)",
	"try:",
	"    try:",
	"        rename_no_replace(parent_fd, os.path.basename(staging), parent_fd, os.path.basename(destination))",
	"    except OSError as error:",
	"        if error.errno not in (errno.EEXIST, errno.ENOTEMPTY):",
	"            raise OSError(error.errno, 'atomic no-replace directory publication failed; a supported remote rename primitive and writable parent directory are required: ' + str(error), destination) from error",
	"        winner = os.lstat(os.path.basename(destination), dir_fd=parent_fd)",
	"        if not stat.S_ISDIR(winner.st_mode):",
	"            raise",
	"        remove_owned_stage(staging)",
	"finally:",
	"    os.close(parent_fd)"
].join("\n");
const CLEANUP_REMOTE_WORKSPACE_STAGE = [
	"import errno, os, shutil, stat, sys",
	REMOVE_OWNED_STAGE,
	"remove_owned_stage(sys.argv[1])"
].join("\n");
//#endregion
//#region src/agents/sandbox/remote-shell-command.ts
/** Shared remote-shell quoting, workdir validation, and directory contracts. */
function shellEscape(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
/** Build a remote shell command from literal argv entries. */
function buildRemoteCommand(argv) {
	return argv.map((entry) => shellEscape(entry)).join(" ");
}
function assertValidExecRemoteCommand(command) {
	const frames = [{
		kind: "root",
		quote: "plain",
		escaping: false,
		parenDepth: 0
	}];
	const pendingHeredocs = [];
	for (let index = 0; index < command.length; index += 1) {
		const frame = frames.at(-1);
		if (!frame) throw new Error("Malformed SSH/OpenShell exec command: parser state underflow.");
		const char = command.charAt(index);
		if (frame.escaping) {
			frame.escaping = false;
			continue;
		}
		if (frame.quote === "single") {
			if (char === "'") frame.quote = "plain";
			continue;
		}
		if (char === "\\") {
			frame.escaping = true;
			continue;
		}
		if (frame.quote === "double") {
			if (char === "\"") {
				frame.quote = "plain";
				continue;
			}
			if (char === "`") {
				frames.push(createExecCommandFrame("backtick"));
				continue;
			}
			if (char === "$" && command[index + 1] === "(" && command[index + 2] === "(") {
				frames.push(createExecCommandFrame("arithmetic", 2));
				index += 2;
				continue;
			}
			if (char === "$" && command[index + 1] === "(") {
				frames.push(createExecCommandFrame("command-substitution", 1));
				index += 1;
			}
			continue;
		}
		if (frame.kind === "arithmetic") {
			if (char === "(") {
				frame.parenDepth += 1;
				continue;
			}
			if (char === ")") {
				frame.parenDepth -= 1;
				if (frame.parenDepth === 0) frames.pop();
			}
			continue;
		}
		if (char === "\n") {
			const frameHeredocs = pendingHeredocs.filter((pending) => pending.frameDepth === frames.length);
			if (frameHeredocs.length > 0) {
				index = skipHeredocBodies(command, index + 1, frameHeredocs) - 1;
				for (const pending of frameHeredocs) pendingHeredocs.splice(pendingHeredocs.indexOf(pending), 1);
				continue;
			}
		}
		if (frame.kind === "backtick" && char === "`") {
			frames.pop();
			continue;
		}
		if (char === "'") {
			frame.quote = "single";
			continue;
		}
		if (char === "\"") {
			frame.quote = "double";
			continue;
		}
		if (char === "`") {
			frames.push(createExecCommandFrame("backtick"));
			continue;
		}
		if (char === "$" && command[index + 1] === "(" && command[index + 2] === "(") {
			frames.push(createExecCommandFrame("arithmetic", 2));
			index += 2;
			continue;
		}
		if (char === "$" && command[index + 1] === "(") {
			frames.push(createExecCommandFrame("command-substitution", 1));
			index += 1;
			continue;
		}
		if (char === "#" && isShellCommentStart(command, index)) {
			index = skipShellComment(command, index) - 1;
			continue;
		}
		if (char === "<") {
			const heredoc = readHeredoc(command, index);
			if (heredoc) {
				pendingHeredocs.push({
					...heredoc.pending,
					frameDepth: frames.length
				});
				index = heredoc.endIndex - 1;
				continue;
			}
			const placeholder = readPlaceholderToken(command, index);
			if (placeholder) throw new Error(`Malformed SSH/OpenShell exec command: unresolved placeholder token ${placeholder}.`);
		}
		if (frame.kind === "command-substitution") {
			if (char === "(") {
				frame.parenDepth += 1;
				continue;
			}
			if (char === ")") {
				frame.parenDepth -= 1;
				if (frame.parenDepth === 0) frames.pop();
			}
		}
	}
	if (frames.at(-1)?.escaping) throw new Error("Malformed SSH/OpenShell exec command: trailing backslash escape.");
	if (pendingHeredocs.length > 0) {
		const pending = pendingHeredocs.at(0);
		if (!pending) throw new Error("Malformed SSH/OpenShell exec command: parser state underflow.");
		throw new Error(`Malformed SSH/OpenShell exec command: unterminated here-doc ${pending.delimiter}.`);
	}
	for (const frame of frames.toReversed()) {
		if (frame.quote === "single") throw new Error("Malformed SSH/OpenShell exec command: unclosed single quote.");
		if (frame.quote === "double") throw new Error("Malformed SSH/OpenShell exec command: unclosed double quote.");
		if (frame.kind === "backtick") throw new Error("Malformed SSH/OpenShell exec command: unterminated backtick command substitution.");
		if (frame.kind === "command-substitution") throw new Error("Malformed SSH/OpenShell exec command: unterminated command substitution.");
		if (frame.kind === "arithmetic") throw new Error("Malformed SSH/OpenShell exec command: unterminated arithmetic expansion.");
	}
}
/** Build the wrapped remote `/bin/sh -c` command for sandbox exec. */
function buildExecRemoteCommand(params) {
	if (Object.keys(params.env).length > 0) throw new Error("SSH sandbox environment requires secure script staging; use prepareSshSandboxExec.");
	return buildRemoteCommand([
		"/bin/sh",
		"-c",
		params.workdir ? `cd ${shellEscape(params.workdir)} && ${params.command}` : params.command
	]);
}
/** Validate and build a remote exec command for untrusted model input. */
function buildValidatedExecRemoteCommand(params) {
	assertValidExecRemoteCommand(params.command);
	return buildExecRemoteCommand(params);
}
const VALIDATE_REMOTE_WORKDIR_SCRIPT = [
	"set -e",
	"target=\"$1\"",
	"root=\"$2\"",
	"case \"$target\" in /*) ;; *) echo \"remote directory must be absolute: $target\" >&2; exit 1 ;; esac",
	"case \"$root\" in /*) ;; *) echo \"remote root must be absolute: $root\" >&2; exit 1 ;; esac",
	"target=\"${target%/}\"",
	"root=\"${root%/}\"",
	"[ -n \"$target\" ] || target=\"/\"",
	"[ -n \"$root\" ] || root=\"/\"",
	"if [ \"$root\" != \"/\" ]; then",
	"  case \"$target/\" in \"$root\"/*|\"$root/\") ;; *) echo \"remote directory must stay under root: $target\" >&2; exit 1 ;; esac",
	"fi",
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
	"if [ ! -d \"$root\" ]; then echo \"remote root not found: $root\" >&2; exit 1; fi",
	"canonical_root=\"$(cd \"$root\" && pwd -P)\"",
	"relative=\"${target#\"$root\"}\"",
	"relative=\"${relative#/}\"",
	"current=\"$canonical_root\"",
	"while [ -n \"$relative\" ]; do",
	"  part=\"${relative%%/*}\"",
	"  if [ \"$part\" = \"$relative\" ]; then relative=\"\"; else relative=\"${relative#*/}\"; fi",
	"  [ -n \"$part\" ] || continue",
	"  if [ \"$current\" = \"/\" ]; then next=\"/$part\"; else next=\"$current/$part\"; fi",
	"  if [ -L \"$next\" ]; then echo \"unsafe remote directory symlink: $next\" >&2; exit 1; fi",
	"  if [ ! -d \"$next\" ]; then echo \"remote directory not found: $next\" >&2; exit 1; fi",
	"  current=\"$next\"",
	"done",
	"printf \"%s\\n\" \"$current\""
].join("\n");
function buildRemoteWorkdirValidationCommand(params) {
	return buildRemoteCommand([
		"/bin/sh",
		"-c",
		VALIDATE_REMOTE_WORKDIR_SCRIPT,
		"openclaw-validate-workdir",
		params.workdir,
		params.root
	]);
}
function createExecCommandFrame(kind, parenDepth = 0) {
	return {
		kind,
		quote: "plain",
		escaping: false,
		parenDepth
	};
}
function readPlaceholderToken(command, index) {
	const match = /^<[A-Za-z][A-Za-z0-9_-]*>/.exec(command.slice(index));
	if (!match) return null;
	if (command[index - 1] === "=") return match[0];
	if (isLikelyGeneratedWorkflowPlaceholder(command, index)) return match[0];
	const next = command[index + match[0].length];
	if (next === void 0 || /[\r\n;&|)]/.test(next)) return match[0];
	if (next === " " || next === "	") return hasRedirectionTargetAfter(command, index + match[0].length) ? null : match[0];
	return null;
}
function hasRedirectionTargetAfter(command, index) {
	let cursor = index;
	while (command.charAt(cursor) === " " || command.charAt(cursor) === "	") cursor += 1;
	const next = command.charAt(cursor);
	return next !== "" && !/[;&|()<>\r\n]/.test(next);
}
function isLikelyGeneratedWorkflowPlaceholder(command, index) {
	const prefix = command.slice(0, index);
	const segmentStart = Math.max(prefix.lastIndexOf("\n"), prefix.lastIndexOf(";"), prefix.lastIndexOf("&"), prefix.lastIndexOf("|"), prefix.lastIndexOf("("), prefix.lastIndexOf("`")) + 1;
	const currentCommand = prefix.slice(segmentStart).trim();
	return /^workflow(?:\s+[A-Za-z0-9._/-]+)*$/.test(currentCommand);
}
function readHeredoc(command, index) {
	if (command[index + 1] !== "<" || command[index + 2] === "<") return null;
	let cursor = index + 2;
	const stripLeadingTabs = command[cursor] === "-";
	if (stripLeadingTabs) cursor += 1;
	while (command[cursor] === " " || command[cursor] === "	") cursor += 1;
	const delimiter = readHeredocDelimiter(command, cursor);
	if (!delimiter) throw new Error("Malformed SSH/OpenShell exec command: missing here-doc delimiter.");
	return {
		pending: {
			delimiter: delimiter.value,
			stripLeadingTabs
		},
		endIndex: delimiter.endIndex
	};
}
function readHeredocDelimiter(command, index) {
	let cursor = index;
	let delimiter = "";
	let quote = "plain";
	let escaping = false;
	while (cursor < command.length) {
		const char = command[cursor];
		if (escaping) {
			delimiter += char;
			escaping = false;
			cursor += 1;
			continue;
		}
		if (quote === "single") {
			if (char === "'") quote = "plain";
			else delimiter += char;
			cursor += 1;
			continue;
		}
		if (quote === "double") {
			if (char === "\"") quote = "plain";
			else if (char === "\\") escaping = true;
			else delimiter += char;
			cursor += 1;
			continue;
		}
		if (char === "\\") {
			escaping = true;
			cursor += 1;
			continue;
		}
		if (char === "'") {
			quote = "single";
			cursor += 1;
			continue;
		}
		if (char === "\"") {
			quote = "double";
			cursor += 1;
			continue;
		}
		if (isHeredocDelimiterTerminator(char)) break;
		delimiter += char;
		cursor += 1;
	}
	if (quote !== "plain" || escaping) throw new Error("Malformed SSH/OpenShell exec command: unterminated here-doc delimiter.");
	return delimiter ? {
		value: delimiter,
		endIndex: cursor
	} : null;
}
function isHeredocDelimiterTerminator(char) {
	return char === void 0 || /\s/.test(char) || [
		";",
		"&",
		"|",
		"(",
		")",
		"<",
		">"
	].includes(char);
}
function skipHeredocBodies(command, index, pendingHeredocs) {
	let cursor = index;
	for (const pending of pendingHeredocs) {
		let found = false;
		while (cursor <= command.length) {
			const lineEnd = command.indexOf("\n", cursor);
			const endIndex = lineEnd === -1 ? command.length : lineEnd;
			const rawLine = command.slice(cursor, endIndex);
			const normalizedLine = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
			const line = pending.stripLeadingTabs ? normalizedLine.replace(/^\t+/, "") : normalizedLine;
			cursor = lineEnd === -1 ? command.length : lineEnd + 1;
			if (line === pending.delimiter) {
				found = true;
				break;
			}
			if (lineEnd === -1) break;
		}
		if (!found) throw new Error(`Malformed SSH/OpenShell exec command: unterminated here-doc ${pending.delimiter}.`);
	}
	return cursor;
}
function isShellCommentStart(command, index) {
	const previous = command[index - 1];
	return previous === void 0 || /[\s;&|()]/.test(previous);
}
function skipShellComment(command, index) {
	const newlineIndex = command.indexOf("\n", index);
	return newlineIndex === -1 ? command.length : newlineIndex;
}
const ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT = [
	"set -e",
	"target=\"$1\"",
	"root=\"${2:-$1}\"",
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
	"  if [ -L \"$next\" ]; then echo \"unsafe remote directory symlink: $next\" >&2; exit 1; fi",
	"  if [ -e \"$next\" ]; then",
	"    if [ ! -d \"$next\" ]; then echo \"unsafe remote directory component: $next\" >&2; exit 1; fi",
	"  else",
	"    mkdir -- \"$next\"",
	"  fi",
	"  current=\"$next\"",
	"done"
].join("\n");
//#endregion
//#region src/agents/sandbox/remote-shell-backend.ts
async function createRemoteShellSandboxBackend(params, options) {
	if ((params.cfg.docker.binds?.length ?? 0) > 0) throw new Error("Remote shell sandbox backend does not support sandbox.docker.binds.");
	const runtimePaths = options.preprovisionedWorkdir ? resolvePreprovisionedRuntimePaths(options.preprovisionedWorkdir) : resolveRemoteShellRuntimePaths(params.cfg.ssh.workspaceRoot, params.scopeKey);
	return new RemoteShellSandboxBackendImpl({
		createParams: params,
		preprovisionedWorkdir: options.preprovisionedWorkdir,
		backendId: options.backendId ?? params.cfg.backend,
		runtimeId: options.runtimeId,
		configLabel: options.configLabel,
		configLabelKind: options.configLabelKind,
		createSession: options.createSession,
		runtimePaths
	}).asHandle();
}
var RemoteShellSandboxBackendImpl = class {
	constructor(params) {
		this.params = params;
		this.ensurePromise = null;
		this.refreshedSkillsForNextExecWorkdir = null;
		this.pendingExecs = /* @__PURE__ */ new WeakMap();
	}
	asHandle() {
		return {
			id: this.params.backendId,
			runtimeId: this.params.runtimeId ?? this.params.runtimePaths.runtimeId,
			runtimeLabel: this.params.runtimeId ?? this.params.runtimePaths.runtimeId,
			workdir: this.params.runtimePaths.remoteWorkspaceDir,
			env: this.params.createParams.cfg.docker.env,
			configLabel: this.params.configLabel,
			configLabelKind: this.params.configLabelKind,
			workdirValidation: "backend",
			validateWorkdir: async (workdir) => await this.validateWorkdir(workdir),
			discardPreparedWorkdir: (workdir) => this.discardPreparedWorkdir(workdir),
			workdirRoots: [this.params.runtimePaths.remoteWorkspaceDir, ...this.params.preprovisionedWorkdir ? [] : [this.params.runtimePaths.remoteAgentWorkspaceDir]],
			remoteWorkspaceDir: this.params.runtimePaths.remoteWorkspaceDir,
			remoteAgentWorkspaceDir: this.params.runtimePaths.remoteAgentWorkspaceDir,
			buildExecSpec: async ({ command, workdir, env, usePty }) => {
				const remoteWorkdir = workdir ?? this.params.runtimePaths.remoteWorkspaceDir;
				const remoteCommand = buildValidatedExecRemoteCommand({
					command,
					workdir: remoteWorkdir,
					env: {}
				});
				await this.ensureRuntime();
				const session = await this.createSession();
				try {
					if (!this.consumeRefreshedSkillsForNextExec(remoteWorkdir)) await this.refreshRemoteSkillsWorkspace(session);
					this.params.createParams.assertRuntimeCurrent?.();
					const prepared = await session.prepareExec({
						remoteCommand,
						env,
						tty: usePty
					});
					try {
						this.params.createParams.assertRuntimeCurrent?.();
					} catch (error) {
						await prepared.cleanup();
						throw error;
					}
					const finalizeToken = {};
					this.pendingExecs.set(finalizeToken, {
						session,
						cleanup: prepared.cleanup
					});
					return {
						argv: prepared.argv,
						env: prepared.env,
						cwd: prepared.cwd,
						stdinMode: "pipe-open",
						assertCurrent: this.params.createParams.assertRuntimeCurrent,
						finalizeToken
					};
				} catch (error) {
					await session.dispose();
					throw error;
				}
			},
			finalizeExec: async ({ token }) => {
				if (!token || typeof token !== "object") return;
				const pending = this.pendingExecs.get(token);
				if (!pending) return;
				this.pendingExecs.delete(token);
				try {
					await pending.cleanup();
				} finally {
					await pending.session.dispose();
				}
			},
			runShellCommand: async (command) => await this.runRemoteShellScript(command),
			createFsBridge: ({ sandbox }) => createRemoteShellSandboxFsBridge({
				sandbox,
				runtime: this.asHandle()
			}),
			runRemoteShellScript: async (command) => await this.runRemoteShellScript(command)
		};
	}
	async createSession() {
		this.params.createParams.assertRuntimeCurrent?.();
		const session = await this.params.createSession();
		try {
			this.params.createParams.assertRuntimeCurrent?.();
			return session;
		} catch (error) {
			await session.dispose();
			throw error;
		}
	}
	async ensureRuntime() {
		if (this.ensurePromise) return await this.ensurePromise;
		this.ensurePromise = this.ensureRuntimeInner();
		try {
			await this.ensurePromise;
		} catch (error) {
			this.ensurePromise = null;
			throw error;
		}
	}
	async ensureRuntimeInner() {
		if (this.params.preprovisionedWorkdir) return;
		const session = await this.createSession();
		let stagingRoot;
		try {
			this.params.createParams.assertRuntimeCurrent?.();
			if ((await session.runCommand({ remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				"if [ -d \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
				"openclaw-sandbox-check",
				this.params.runtimePaths.runtimeRootDir
			]) })).stdout.toString("utf8").trim() === "1") return;
			const candidate = `${this.params.runtimePaths.runtimeRootDir}.bootstrap-${randomUUID()}`;
			this.params.createParams.assertRuntimeCurrent?.();
			await session.runCommand({ remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				"mkdir -p -- \"$1\" && (umask 077; mkdir -- \"$2\")",
				"openclaw-sandbox-stage",
				path.posix.dirname(candidate),
				candidate
			]) });
			stagingRoot = candidate;
			this.params.createParams.assertRuntimeCurrent?.();
			await session.uploadDirectory({
				localDir: this.params.createParams.workspaceDir,
				remoteDir: path.posix.join(stagingRoot, "workspace"),
				remoteRootDir: stagingRoot
			});
			if (this.params.createParams.cfg.workspaceAccess !== "none" && path.resolve(this.params.createParams.agentWorkspaceDir) !== path.resolve(this.params.createParams.workspaceDir)) {
				this.params.createParams.assertRuntimeCurrent?.();
				await session.uploadDirectory({
					localDir: this.params.createParams.agentWorkspaceDir,
					remoteDir: path.posix.join(stagingRoot, "agent"),
					remoteRootDir: stagingRoot
				});
			}
			this.params.createParams.assertRuntimeCurrent?.();
			await session.runCommand({ remoteCommand: buildRemoteCommand([
				"python3",
				"-c",
				PUBLISH_REMOTE_WORKSPACE,
				stagingRoot,
				this.params.runtimePaths.runtimeRootDir
			]) });
			stagingRoot = void 0;
		} finally {
			if (stagingRoot) await session.runCommand({
				remoteCommand: buildRemoteCommand([
					"python3",
					"-c",
					CLEANUP_REMOTE_WORKSPACE_STAGE,
					stagingRoot
				]),
				allowFailure: true
			}).catch(() => void 0);
			await session.dispose();
		}
	}
	async validateWorkdir(workdir) {
		await this.ensureRuntime();
		const session = await this.createSession();
		let refreshedSkillsForWorkdir = null;
		try {
			if (isRemotePathInsideRoot(this.params.runtimePaths.remoteSkillsWorkspaceDir, workdir)) {
				await this.refreshRemoteSkillsWorkspace(session);
				refreshedSkillsForWorkdir = workdir;
				this.refreshedSkillsForNextExecWorkdir = workdir;
			}
			this.params.createParams.assertRuntimeCurrent?.();
			const result = await session.runCommand({
				remoteCommand: buildRemoteWorkdirValidationCommand({
					workdir,
					root: this.resolveWorkdirValidationRoot(workdir)
				}),
				allowFailure: true
			});
			const resolvedWorkdir = result.code === 0 ? result.stdout.toString("utf8").trim() : "";
			if (refreshedSkillsForWorkdir) this.refreshedSkillsForNextExecWorkdir = resolvedWorkdir || null;
			return resolvedWorkdir || null;
		} catch (error) {
			if (refreshedSkillsForWorkdir && this.refreshedSkillsForNextExecWorkdir === refreshedSkillsForWorkdir) this.refreshedSkillsForNextExecWorkdir = null;
			throw error;
		} finally {
			await session.dispose();
		}
	}
	discardPreparedWorkdir(workdir) {
		if (this.refreshedSkillsForNextExecWorkdir === workdir) this.refreshedSkillsForNextExecWorkdir = null;
	}
	consumeRefreshedSkillsForNextExec(workdir) {
		if (this.refreshedSkillsForNextExecWorkdir !== workdir) {
			this.refreshedSkillsForNextExecWorkdir = null;
			return false;
		}
		this.refreshedSkillsForNextExecWorkdir = null;
		return true;
	}
	resolveWorkdirValidationRoot(workdir) {
		return [this.params.runtimePaths.remoteAgentWorkspaceDir, this.params.runtimePaths.remoteWorkspaceDir].find((root) => isRemotePathInsideRoot(root, workdir)) ?? this.params.runtimePaths.remoteWorkspaceDir;
	}
	async refreshRemoteSkillsWorkspace(session, signal) {
		if (this.params.preprovisionedWorkdir || this.params.createParams.cfg.workspaceAccess !== "rw" || !this.params.createParams.skillsWorkspaceDir) return;
		await this.clearRemoteDirectory(session, this.params.runtimePaths.remoteSkillsWorkspaceDir, signal);
		const hasSkills = await isExistingDirectory(this.params.createParams.skillsWorkspaceDir);
		signal?.throwIfAborted();
		if (!hasSkills) return;
		this.params.createParams.assertRuntimeCurrent?.();
		await session.uploadDirectory({
			localDir: this.params.createParams.skillsWorkspaceDir,
			remoteDir: this.params.runtimePaths.remoteSkillsWorkspaceDir,
			remoteRootDir: this.params.runtimePaths.runtimeRootDir,
			signal
		});
	}
	async clearRemoteDirectory(session, remoteDir, signal) {
		signal?.throwIfAborted();
		this.params.createParams.assertRuntimeCurrent?.();
		await session.runCommand({
			remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				`${ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT}\nfind "$1" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +`,
				"openclaw-sandbox-clear",
				remoteDir,
				this.params.runtimePaths.runtimeRootDir
			]),
			signal
		});
	}
	async runRemoteShellScript(params) {
		params.signal?.throwIfAborted();
		await this.ensureRuntime();
		params.signal?.throwIfAborted();
		const session = await this.createSession();
		try {
			params.signal?.throwIfAborted();
			await this.refreshRemoteSkillsWorkspace(session, params.signal);
			params.signal?.throwIfAborted();
			this.params.createParams.assertRuntimeCurrent?.();
			return await session.runCommand({
				remoteCommand: buildRemoteCommand([
					"/bin/sh",
					"-c",
					params.script,
					"openclaw-sandbox-fs",
					...params.args ?? []
				]),
				stdin: params.stdin,
				allowFailure: params.allowFailure,
				signal: params.signal
			});
		} finally {
			await session.dispose();
		}
	}
};
async function isExistingDirectory(dir) {
	try {
		return (await fs.stat(dir)).isDirectory();
	} catch {
		return false;
	}
}
function normalizeRemotePath(input) {
	const normalized = path.posix.normalize(input.replace(/\\/g, "/"));
	return normalized === "/" ? normalized : normalized.replace(/\/+$/g, "");
}
function isRemotePathInsideRoot(root, candidate) {
	const normalizedRoot = normalizeRemotePath(root);
	const normalizedCandidate = normalizeRemotePath(candidate);
	return normalizedCandidate === normalizedRoot || (normalizedRoot === "/" ? normalizedCandidate.startsWith("/") : normalizedCandidate.startsWith(`${normalizedRoot}/`));
}
function resolveRemoteShellRuntimePaths(workspaceRoot, scopeKey) {
	const runtimeId = buildRemoteShellRuntimeId(scopeKey);
	const runtimeRootDir = path.posix.join(workspaceRoot, runtimeId);
	return {
		runtimeId,
		runtimeRootDir,
		remoteWorkspaceDir: path.posix.join(runtimeRootDir, "workspace"),
		remoteAgentWorkspaceDir: path.posix.join(runtimeRootDir, "agent"),
		remoteSkillsWorkspaceDir: path.posix.join(runtimeRootDir, "workspace", ".openclaw", "sandbox-skills")
	};
}
function resolvePreprovisionedRuntimePaths(params) {
	const remoteWorkspaceDir = params.remoteWorkspaceDir;
	if (!path.posix.isAbsolute(remoteWorkspaceDir) || remoteWorkspaceDir === "/" || path.posix.normalize(remoteWorkspaceDir) !== remoteWorkspaceDir || remoteWorkspaceDir.endsWith("/")) throw new Error("Preprovisioned remote workdir must be an absolute non-root path.");
	const runtimeId = params.runtimeId.trim();
	if (!runtimeId) throw new Error("Preprovisioned remote runtime id must be a non-empty string.");
	return {
		runtimeId,
		runtimeRootDir: remoteWorkspaceDir,
		remoteWorkspaceDir,
		remoteAgentWorkspaceDir: remoteWorkspaceDir,
		remoteSkillsWorkspaceDir: path.posix.join(remoteWorkspaceDir, ".openclaw", "sandbox-skills")
	};
}
function buildRemoteShellRuntimeId(scopeKey) {
	const trimmed = scopeKey.trim() || "session";
	if (/:workspace:[a-f0-9]{32}$/i.test(trimmed)) return `openclaw-ssh-workspace-${hashTextSha256(trimmed).slice(0, 32)}`;
	const safe = normalizeLowercaseStringOrEmpty(trimmed).replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
	const hash = Array.from(trimmed).reduce((acc, char) => (acc * 33 ^ char.charCodeAt(0)) >>> 0, 5381);
	return `openclaw-ssh-${safe || "session"}-${hash.toString(16).slice(0, 8)}`;
}
//#endregion
//#region src/agents/sandbox/secret-owner.ts
const SSH_SECRET_KEYS = [
	"identityData",
	"certificateData",
	"knownHostsData"
];
/** Rejects cold or unmaterialized SSH credentials before any host SSH fallback is possible. */
function assertSshSandboxSecretOwnerAvailable(params) {
	if (params.agentId) assertRuntimeSandboxSecretOwnerAvailable(params.agentId);
	if (!params.config) return;
	const defaultsSsh = params.config.agents?.defaults?.sandbox?.ssh;
	const agentSsh = params.agentId && params.scope !== "shared" ? resolveAgentConfig(params.config, params.agentId)?.sandbox?.ssh : void 0;
	const normalizedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	const agentSource = normalizedAgentId ? listAgentEntriesWithSource(params.config).find(({ entry }) => normalizeAgentId(entry.id) === normalizedAgentId)?.source : void 0;
	const unresolved = [];
	for (const key of SSH_SECRET_KEYS) {
		const usesAgentValue = Boolean(agentSsh && Object.hasOwn(agentSsh, key));
		const value = usesAgentValue ? agentSsh?.[key] : defaultsSsh?.[key];
		const ref = coerceSecretRef(value, params.config.secrets?.defaults);
		if (!ref) continue;
		unresolved.push({
			path: usesAgentValue && agentSource ? agentSource.kind === "entries" ? `agents.entries.${agentSource.key}.sandbox.ssh.${key}` : `agents.list.${agentSource.index}.sandbox.ssh.${key}` : `agents.defaults.sandbox.ssh.${key}`,
			refKey: secretRefKey(ref)
		});
	}
	if (unresolved.length > 0) throw new SecretSurfaceUnavailableError({
		ownerKind: "capability",
		ownerId: runtimeSandboxSecretOwnerId(params.agentId ?? "shared"),
		state: "unavailable",
		paths: unresolved.map((entry) => entry.path),
		refKeys: unresolved.map((entry) => entry.refKey),
		reason: "configured SSH secret reference was not materialized"
	});
}
//#endregion
//#region src/agents/sandbox/remote-shell-transport.ts
/** Remote-shell transport operations shared by SSH and provider-owned execution. */
/** Build all remote I/O from one provider-owned local command boundary. */
function createRemoteShellSandboxSession(options) {
	const runCommand = async (params, checkCurrent = true) => {
		const command = options.buildCommand(params);
		if (command.argv.length === 0) throw new Error("Remote shell command argv is empty");
		if (checkCurrent) options.assertCurrent?.();
		params.signal?.throwIfAborted();
		const result = await spawnCommand(command.argv, {
			baseEnv: command.env,
			cwd: command.cwd,
			cancelSignal: params.signal,
			encoding: "buffer",
			input: params.stdin ?? Buffer.alloc(0),
			maxBuffer: SANDBOX_COMMAND_MAX_BUFFER_BYTES,
			reject: false,
			stripFinalNewline: false
		});
		if (params.signal?.aborted || result.isCanceled) throw createAbortError("Aborted");
		if (result.failed && !isPlainCommandExitFailure(result)) throw toErrorObject(result, "Remote shell command execution failed");
		const stdout = Buffer.from(result.stdout);
		const stderr = Buffer.from(result.stderr);
		const exitCode = result.exitCode ?? (result.failed ? 1 : 0);
		if (exitCode !== 0 && !params.allowFailure) {
			const message = options.formatFailure?.(stderr.toString("utf8"), exitCode) ?? (stderr.toString("utf8").trim() || `remote shell exited with code ${exitCode}`);
			throw Object.assign(new Error(message), {
				code: exitCode,
				stdout,
				stderr
			});
		}
		return {
			stdout,
			stderr,
			code: exitCode
		};
	};
	return {
		runCommand,
		uploadDirectory: (params) => uploadDirectoryToRemoteCommand(params, options),
		prepareExec: (params) => prepareRemoteShellExec(params, options, runCommand),
		dispose: options.dispose ?? (async () => {})
	};
}
async function prepareRemoteShellExec(params, options, runCommand) {
	const env = params.tty && params.env.TERM === void 0 ? {
		TERM: "xterm-256color",
		...params.env
	} : params.env;
	for (const [key, value] of Object.entries(env)) {
		if (normalizeEnvVarKey(key, { portable: true }) !== key) throw new Error(`Invalid sandbox environment variable name ${JSON.stringify(key)}; use a POSIX variable name.`);
		if (value.includes("\0")) throw new Error(`Invalid sandbox environment variable ${JSON.stringify(key)}; values must not contain NUL bytes.`);
	}
	const remoteDir = `/tmp/openclaw-sandbox-exec-${randomUUID()}`;
	const remoteScript = `${remoteDir}/exec.sh`;
	const script = [
		"#!/bin/sh",
		"set -e",
		`rm -rf -- ${shellEscape(remoteDir)}`,
		...Object.entries(env).map(([key, value]) => `export ${key}=${shellEscape(value)}`),
		`exec ${params.remoteCommand}`,
		""
	].join("\n");
	const cleanup = async () => {
		await runCommand({
			remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				"rm -rf -- \"$1\"",
				"openclaw-sandbox-exec-cleanup",
				remoteDir
			]),
			allowFailure: true
		}, false);
	};
	try {
		await runCommand({
			remoteCommand: buildRemoteCommand([
				"/bin/sh",
				"-c",
				"umask 077 && mkdir -- \"$1\" && cat > \"$1/exec.sh\" && chmod 700 \"$1/exec.sh\"",
				"openclaw-sandbox-exec-stage",
				remoteDir
			]),
			stdin: script
		});
		return {
			...options.buildCommand({
				remoteCommand: buildRemoteCommand(["/bin/sh", remoteScript]),
				tty: params.tty
			}),
			cleanup
		};
	} catch (error) {
		await cleanup().catch(() => void 0);
		throw error;
	}
}
async function uploadDirectoryToRemoteCommand(params, options) {
	await assertSafeUploadSymlinks(params.localDir, params.signal);
	const remoteCommand = buildRemoteCommand([
		"/bin/sh",
		"-c",
		`${ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT}\ntar -xf - -C "$1"`,
		"openclaw-sandbox-upload",
		params.remoteDir,
		params.remoteRootDir ?? params.remoteDir
	]);
	const command = options.buildCommand({ remoteCommand });
	const [executable, ...args] = command.argv;
	if (!executable) throw new Error("Remote shell command argv is empty");
	const tarEnv = sanitizeEnvVars(process.env).allowed;
	await new Promise((resolve, reject) => {
		options.assertCurrent?.();
		params.signal?.throwIfAborted();
		const tar = spawn("tar", [
			"-C",
			params.localDir,
			"-cf",
			"-",
			"."
		], {
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			env: tarEnv,
			signal: params.signal
		});
		const remote = spawn(executable, args, {
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: command.env,
			cwd: command.cwd,
			signal: params.signal
		});
		const tarStderr = [];
		const remoteStdout = [];
		const remoteStderr = [];
		let tarClosed = false;
		let remoteClosed = false;
		let tarCode = 0;
		let remoteCode = 0;
		let tarSignal = null;
		let remoteSignal = null;
		let failure;
		let settled = false;
		const fail = (error) => {
			if (settled || failure) return;
			failure = toErrorObject(error, "Non-Error rejection");
			for (const child of [tar, remote]) try {
				child.kill("SIGKILL");
			} catch {}
			maybeResolve();
		};
		tar.on("error", fail);
		remote.on("error", fail);
		tar.on("close", (code, signal) => {
			tarClosed = true;
			tarCode = code;
			tarSignal = signal;
			maybeResolve();
		});
		remote.on("close", (code, signal) => {
			remoteClosed = true;
			remoteCode = code;
			remoteSignal = signal;
			maybeResolve();
		});
		tar.stderr?.on("data", (chunk) => tarStderr.push(Buffer.from(chunk)));
		tar.stderr?.on("error", fail);
		tar.stdout?.on("error", fail);
		remote.stdout?.on("data", (chunk) => remoteStdout.push(Buffer.from(chunk)));
		remote.stdout?.on("error", fail);
		remote.stderr?.on("data", (chunk) => remoteStderr.push(Buffer.from(chunk)));
		remote.stderr?.on("error", fail);
		remote.stdin?.on("error", fail);
		function maybeResolve() {
			if (settled || !tarClosed || !remoteClosed) return;
			settled = true;
			if (failure) {
				reject(failure);
				return;
			}
			if (tarCode === null) {
				reject(/* @__PURE__ */ new Error(`tar exited from signal ${tarSignal ?? "unknown"}`));
				return;
			}
			if (tarCode !== 0) {
				reject(new Error(Buffer.concat(tarStderr).toString("utf8").trim() || `tar exited with code ${tarCode}`));
				return;
			}
			if (remoteCode === null) {
				reject(/* @__PURE__ */ new Error(`remote exited from signal ${remoteSignal ?? "unknown"}`));
				return;
			}
			if (remoteCode !== 0) {
				reject(new Error(Buffer.concat(remoteStderr).toString("utf8").trim() || `remote exited with code ${remoteCode}`));
				return;
			}
			resolve();
		}
		try {
			if (tar.stdout && remote.stdin) tar.stdout.pipe(remote.stdin);
		} catch (error) {
			fail(error);
		}
	});
}
async function assertSafeUploadSymlinks(localDir, signal) {
	const rootDir = path.resolve(localDir);
	await walkDirectory(rootDir);
	async function walkDirectory(currentDir) {
		signal?.throwIfAborted();
		const entries = await fs.readdir(currentDir, { withFileTypes: true });
		for (const entry of entries) {
			signal?.throwIfAborted();
			const entryPath = path.join(currentDir, entry.name);
			if (entry.isSymbolicLink()) {
				try {
					await resolveRootPath({
						absolutePath: entryPath,
						rootPath: rootDir,
						boundaryLabel: "Remote sandbox upload tree"
					});
				} catch (error) {
					const relativePath = path.relative(rootDir, entryPath).split(path.sep).join("/");
					throw new Error(`Remote sandbox upload refuses symlink escaping the workspace: ${relativePath}`, { cause: error });
				}
				continue;
			}
			if (entry.isDirectory()) await walkDirectory(entryPath);
		}
	}
}
//#endregion
//#region src/agents/sandbox/ssh.ts
/**
* SSH sandbox transport helpers.
*
* Materializes temporary SSH config, validates remote shell snippets, runs commands, and uploads workspace trees.
*/
function normalizeInlineSshMaterial(contents, filename) {
	const normalizedEscapedNewlines = contents.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\\r\\n/g, "\\n").replace(/\\r/g, "\\n");
	const expanded = filename === "identity" || filename === "certificate.pub" ? normalizedEscapedNewlines.replace(/\\n/g, "\n") : normalizedEscapedNewlines;
	return expanded.endsWith("\n") ? expanded : `${expanded}\n`;
}
function buildSshFailureMessage(stderr, exitCode) {
	const trimmed = stderr.trim();
	if (trimmed.includes("error in libcrypto") && (trimmed.includes("Load key \"") || trimmed.includes("Permission denied (publickey)"))) return `${trimmed}\nSSH sandbox failed to load the configured identity. The private key contents may be malformed (for example CRLF or escaped newlines). Prefer identityFile when possible.`;
	return trimmed || (exitCode !== void 0 ? `ssh exited with code ${exitCode}` : "ssh exited with a non-zero status");
}
/** Build the local ssh argv for a prepared sandbox session. */
function buildSshSandboxArgv(params) {
	return [
		params.session.command,
		"-F",
		params.session.configPath,
		...params.tty ? [
			"-tt",
			"-o",
			"RequestTTY=force"
		] : [
			"-T",
			"-o",
			"RequestTTY=no"
		],
		params.session.host,
		params.remoteCommand
	];
}
/** Create a temporary SSH session from already-rendered ssh config text. */
async function createSshSandboxSessionFromConfigText(params) {
	const host = params.host?.trim() || parseSshConfigHost(params.configText);
	if (!host) throw new Error("Failed to parse SSH config output.");
	return await createSshSandboxSession(params.command?.trim() || "ssh", host, () => params.configText);
}
/** Create a temporary SSH session from structured sandbox SSH settings. */
async function createSshSandboxSessionFromSettings(settings) {
	const parsed = parseSshTarget(settings.target);
	if (!parsed) throw new Error(`Invalid sandbox SSH target: ${settings.target}`);
	return await createSshSandboxSession(settings.command.trim() || "ssh", "openclaw-sandbox", async (configDir) => {
		const materializedIdentity = settings.identityData ? await writeSecretMaterial(configDir, "identity", settings.identityData) : void 0;
		const materializedCertificate = settings.certificateData ? await writeSecretMaterial(configDir, "certificate.pub", settings.certificateData) : void 0;
		const materializedKnownHosts = settings.knownHostsData ? await writeSecretMaterial(configDir, "known_hosts", settings.knownHostsData) : void 0;
		const identityFile = materializedIdentity ?? resolveOptionalLocalPath(settings.identityFile);
		const certificateFile = materializedCertificate ?? resolveOptionalLocalPath(settings.certificateFile);
		const knownHostsFile = materializedKnownHosts ?? resolveOptionalLocalPath(settings.knownHostsFile);
		assertSshConfigLineValue(identityFile, "identityFile");
		assertSshConfigLineValue(certificateFile, "certificateFile");
		assertSshConfigLineValue(knownHostsFile, "knownHostsFile");
		const lines = [
			"Host openclaw-sandbox",
			`  HostName ${parsed.host}`,
			`  Port ${parsed.port}`,
			"  BatchMode yes",
			"  ConnectTimeout 5",
			"  ServerAliveInterval 15",
			"  ServerAliveCountMax 3",
			`  StrictHostKeyChecking ${settings.strictHostKeyChecking ? "yes" : "no"}`,
			`  UpdateHostKeys ${settings.updateHostKeys ? "yes" : "no"}`
		];
		if (parsed.user) lines.push(`  User ${parsed.user}`);
		if (knownHostsFile) lines.push(`  UserKnownHostsFile ${quoteSshConfigPath(knownHostsFile)}`);
		else if (!settings.strictHostKeyChecking) lines.push("  UserKnownHostsFile /dev/null");
		if (identityFile) lines.push(`  IdentityFile ${quoteSshConfigPath(identityFile)}`);
		if (certificateFile) lines.push(`  CertificateFile ${quoteSshConfigPath(certificateFile)}`);
		if (identityFile || certificateFile) lines.push("  IdentitiesOnly yes");
		return `${lines.join("\n")}\n`;
	});
}
/** Remove temporary SSH config and materialized secret files. */
async function disposeSshSandboxSession(session) {
	await fs.rm(path.dirname(session.configPath), {
		recursive: true,
		force: true
	});
}
function commandSession(session) {
	return createRemoteShellSandboxSession({
		buildCommand: ({ remoteCommand, tty }) => ({
			argv: buildSshSandboxArgv({
				session,
				remoteCommand,
				tty
			}),
			env: sanitizeEnvVars(process.env).allowed
		}),
		assertCurrent: session.assertCurrent,
		formatFailure: buildSshFailureMessage
	});
}
/** Run a remote command through SSH and return buffered stdout/stderr. */
async function runSshSandboxCommand(params) {
	return commandSession(params.session).runCommand(params);
}
/** Stage exec environment privately, keeping the established SSH cleanup contract. */
async function prepareSshSandboxExec(params) {
	const prepared = await commandSession(params.session).prepareExec(params);
	return {
		argv: prepared.argv,
		cleanup: prepared.cleanup
	};
}
/** Stream a local directory with the shared guarded tar pipeline. */
async function uploadDirectoryToSshTarget(params) {
	return commandSession(params.session).uploadDirectory(params);
}
function parseSshConfigHost(configText) {
	return configText.match(/^\s*Host\s+(\S+)/m)?.[1]?.trim() || null;
}
function resolveSshTmpRoot() {
	return path.resolve(resolvePreferredOpenClawTmpDir() ?? os.tmpdir());
}
async function createSshSandboxSession(command, host, buildConfigText) {
	const configDir = await fs.mkdtemp(path.join(resolveSshTmpRoot(), "openclaw-sandbox-ssh-"));
	const configPath = path.join(configDir, "config");
	try {
		await writePrivateFile(configPath, await buildConfigText(configDir));
		return {
			command,
			configPath,
			host
		};
	} catch (error) {
		await fs.rm(configDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		throw error;
	}
}
function assertSshConfigLineValue(value, field) {
	if (value && /[\r\n"]/.test(value)) throw new Error(`SSH sandbox ${field} must not contain line breaks or double quotes.`);
}
function quoteSshConfigPath(value) {
	return /\s/.test(value) ? `"${value}"` : value;
}
function resolveOptionalLocalPath(value) {
	const trimmed = value?.trim();
	return trimmed ? resolveUserPath(trimmed) : void 0;
}
async function writeSecretMaterial(dir, filename, contents) {
	const pathname = path.join(dir, filename);
	await writePrivateFile(pathname, normalizeInlineSshMaterial(contents, filename));
	return pathname;
}
async function writePrivateFile(pathname, contents) {
	await fs.writeFile(pathname, contents, {
		encoding: "utf8",
		mode: 384
	});
	await fs.chmod(pathname, 384);
}
//#endregion
//#region src/agents/sandbox/ssh-backend.ts
/** SSH backend lifecycle hooks for probing and removing remote sandbox copies. */
const sshSandboxBackendManager = {
	async describeRuntime({ entry, config, agentId }) {
		const effectiveAgentId = agentId ?? resolveSandboxAgentId(entry.sessionKey);
		const cfg = resolveSandboxConfigForAgent(config, effectiveAgentId);
		if (cfg.backend !== "ssh" || !cfg.ssh.target) return {
			running: false,
			actualConfigLabel: cfg.ssh.target,
			configLabelMatch: false
		};
		assertSshSandboxSecretOwnerAvailable({
			config,
			scope: cfg.scope,
			agentId: effectiveAgentId
		});
		const runtimePaths = resolveRemoteShellRuntimePaths(cfg.ssh.workspaceRoot, entry.sessionKey);
		const session = await createSshSandboxSessionFromSettings({
			...cfg.ssh,
			target: cfg.ssh.target
		});
		try {
			return {
				running: (await runSshSandboxCommand({
					session,
					remoteCommand: buildRemoteCommand([
						"/bin/sh",
						"-c",
						"if [ -d \"$1\" ]; then printf \"1\\n\"; else printf \"0\\n\"; fi",
						"openclaw-sandbox-check",
						runtimePaths.runtimeRootDir
					])
				})).stdout.toString("utf8").trim() === "1",
				actualConfigLabel: cfg.ssh.target,
				configLabelMatch: entry.image === cfg.ssh.target
			};
		} finally {
			await disposeSshSandboxSession(session);
		}
	},
	async removeRuntime({ entry, config, agentId }) {
		const effectiveAgentId = agentId ?? resolveSandboxAgentId(entry.sessionKey);
		const cfg = resolveSandboxConfigForAgent(config, effectiveAgentId);
		if (cfg.backend !== "ssh" || !cfg.ssh.target) return;
		assertSshSandboxSecretOwnerAvailable({
			config,
			scope: cfg.scope,
			agentId: effectiveAgentId
		});
		const runtimePaths = resolveRemoteShellRuntimePaths(cfg.ssh.workspaceRoot, entry.sessionKey);
		const session = await createSshSandboxSessionFromSettings({
			...cfg.ssh,
			target: cfg.ssh.target
		});
		try {
			const result = await runSshSandboxCommand({
				session,
				remoteCommand: buildRemoteCommand([
					"/bin/sh",
					"-c",
					"rm -rf -- \"$1\"",
					"openclaw-sandbox-remove",
					runtimePaths.runtimeRootDir
				]),
				allowFailure: true
			});
			if (result.code !== 0) {
				const detail = result.stderr.toString("utf8").trim() || `exit ${result.code}`;
				throw new Error(`Failed to remove SSH sandbox runtime ${entry.containerName}: ${detail}`);
			}
		} finally {
			await disposeSshSandboxSession(session);
		}
	}
};
async function createSshSandboxBackendInternal(params, preprovisionedWorkdir) {
	const target = params.cfg.ssh.target;
	if (!target) throw new Error("Sandbox backend \"ssh\" requires agents.defaults.sandbox.ssh.target.");
	return createRemoteShellSandboxBackend(params, {
		backendId: "ssh",
		configLabel: target,
		configLabelKind: "Target",
		preprovisionedWorkdir,
		createSession: async () => {
			const session = await createSshSandboxSessionFromSettings({
				...params.cfg.ssh,
				target
			});
			session.assertCurrent = params.assertRuntimeCurrent;
			return {
				runCommand: (command) => runSshSandboxCommand({
					...command,
					session
				}),
				uploadDirectory: (upload) => uploadDirectoryToSshTarget({
					...upload,
					session
				}),
				prepareExec: async (exec) => ({
					...await prepareSshSandboxExec({
						...exec,
						session
					}),
					env: sanitizeEnvVars(process.env).allowed
				}),
				dispose: () => disposeSshSandboxSession(session)
			};
		}
	});
}
/** Create a static SSH sandbox using the shared remote workspace lifecycle. */
async function createSshSandboxBackend(params) {
	return createSshSandboxBackendInternal(params);
}
/** Adopt a placement-owned worktree without mirroring local files into it. */
async function createPreprovisionedSshSandboxBackend(params, preprovisionedWorkdir) {
	return createSshSandboxBackendInternal(params, preprovisionedWorkdir);
}
//#endregion
export { resolveWritableRenameTargetsForBridge as C, resolveWritableRenameTargets as S, buildRemoteWorkdirValidationCommand as _, createSshSandboxSessionFromConfigText as a, createRemoteShellSandboxFsBridge as b, prepareSshSandboxExec as c, createRemoteShellSandboxSession as d, assertSshSandboxSecretOwnerAvailable as f, buildRemoteCommand as g, buildExecRemoteCommand as h, buildSshSandboxArgv as i, runSshSandboxCommand as l, resolveRemoteShellRuntimePaths as m, createSshSandboxBackend as n, createSshSandboxSessionFromSettings as o, createRemoteShellSandboxBackend as p, sshSandboxBackendManager as r, disposeSshSandboxSession as s, createPreprovisionedSshSandboxBackend as t, uploadDirectoryToSshTarget as u, buildValidatedExecRemoteCommand as v, createWritableRenameTargetResolver as x, shellEscape as y };

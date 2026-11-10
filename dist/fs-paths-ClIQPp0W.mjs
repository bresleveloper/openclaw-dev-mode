import { h as shortenPathWithHome } from "./utils-gjJ-tD2q.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as resolveSandboxHostPathViaExistingAncestor, n as isSandboxHostPathAbsolute } from "./host-paths-C5NtLpi_.mjs";
import { s as normalizeSandboxInputPath, u as resolveSandboxInputPath } from "./sandbox-paths-CgSBSdCM.mjs";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import { a as resolveSandboxMountSelection, i as resolveSandboxBindMounts } from "./workspace-mounts-DWoMJ-OS.mjs";
import os from "node:os";
import path from "node:path";
//#region src/agents/sandbox/fs-paths.ts
function buildSandboxFsMounts(sandbox) {
	return resolveSandboxMountSelection({
		workspaceDir: sandbox.workspaceDir,
		agentWorkspaceDir: sandbox.agentWorkspaceDir,
		skillsWorkspaceDir: sandbox.skillsWorkspaceDir,
		workdir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess,
		binds: sandbox.docker.binds,
		readOnlyResourceMounts: sandbox.readOnlyResourceMounts
	}).mounts.map((mount) => ({
		hostRoot: path.resolve(mount.hostPath),
		containerRoot: mount.containerPath,
		writable: !mount.readOnly,
		source: mount.source
	}));
}
function resolveWritableSandboxBindHostRoots(binds) {
	const parsedBinds = parseSandboxBindMounts(binds);
	const readonlyRoots = parsedBinds.filter((bind) => !bind.writable).map((bind) => bind.hostRoot);
	return [...new Set(parsedBinds.filter((bind) => bind.writable && !readonlyRoots.some((root) => isPathInside(bind.hostRoot, root))).map((bind) => bind.hostRoot))];
}
function hasSandboxBindContainerPathAliases(binds) {
	return parseSandboxBindMounts(binds).some((mount) => mount.hostRoot !== mount.containerRoot);
}
function hasSandboxBindReadonlyHostShadows(binds) {
	const parsedBinds = parseSandboxBindMounts(binds);
	const writableRoots = parsedBinds.filter((bind) => bind.writable).map((bind) => bind.hostRoot);
	const readonlyRoots = parsedBinds.filter((bind) => !bind.writable).map((bind) => bind.hostRoot);
	return writableRoots.some((writableRoot) => readonlyRoots.some((readonlyRoot) => isPathInside(writableRoot, readonlyRoot)));
}
function parseSandboxBindMounts(binds) {
	return resolveSandboxBindMounts(binds).map((mount) => ({
		hostRoot: path.resolve(mount.hostPath),
		containerRoot: mount.containerPath,
		writable: !mount.readOnly
	}));
}
function resolveSandboxFsPathWithMounts(params) {
	const mountsByContainer = params.mounts.toSorted(compareMountsByContainerPath);
	const workspaceAlias = {
		hostRoot: path.resolve(params.defaultWorkspaceRoot),
		containerRoot: params.defaultContainerRoot,
		writable: false,
		source: "workspace"
	};
	const mountsByHost = [...params.mounts, workspaceAlias].toSorted((a, b) => {
		if ((a === workspaceAlias || b === workspaceAlias) && path.relative(a.hostRoot, b.hostRoot) === "") return Number(b === workspaceAlias) - Number(a === workspaceAlias);
		return compareMountsByHostPath(a, b);
	});
	const input = params.filePath;
	const inputPosix = normalizePosixInput(normalizeSandboxInputPath(input));
	if (path.posix.isAbsolute(inputPosix)) {
		const containerMount = mountsByContainer.find((mount) => isPathInsideContainerRoot(mount.containerRoot, inputPosix));
		if (containerMount) {
			resolveSandboxFsMount(mountsByContainer, inputPosix, params.containerOnlyMounts);
			return resolveMountedContainerPath(containerMount, inputPosix, params.defaultContainerRoot);
		}
	}
	if (!isSandboxHostPathAbsolute(inputPosix)) {
		const cwdMount = findMountByHostPath(mountsByHost, path.resolve(params.cwd));
		const cwd = cwdMount ? mountedHostPathToContainer(cwdMount) : normalizePosixInput(params.cwd);
		const containerCandidate = normalizeContainerPathCore(path.posix.resolve(cwdMount || path.posix.isAbsolute(cwd) ? cwd : params.defaultContainerRoot, inputPosix));
		const containerMount = resolveSandboxFsMount(mountsByContainer, containerCandidate, params.containerOnlyMounts);
		if (containerMount) return resolveMountedContainerPath(containerMount, containerCandidate, params.defaultContainerRoot);
	}
	const hostMount = findMountByHostPath(mountsByHost, resolveSandboxInputPath(input, params.cwd));
	if (hostMount) {
		const containerPath = mountedHostPathToContainer(hostMount);
		const visibleMount = resolveSandboxFsMount(mountsByContainer, containerPath, params.containerOnlyMounts);
		if (visibleMount) return resolveMountedContainerPath(visibleMount, containerPath, params.defaultContainerRoot);
	}
	if (path.posix.isAbsolute(inputPosix)) resolveSandboxFsMount(mountsByContainer, inputPosix, params.containerOnlyMounts);
	const containerRoot = normalizeContainerPathCore(params.defaultContainerRoot);
	let workspaceRoot = shortenPathWithHome(path.resolve(params.defaultWorkspaceRoot), {
		home: os.homedir(),
		prefix: "~"
	});
	if (workspaceRoot.startsWith(`~${path.sep}`)) workspaceRoot = workspaceRoot.replaceAll(path.sep, path.posix.sep);
	throw new Error(`Path escapes sandbox root (${workspaceRoot}; container root ${containerRoot}): ${input}. Use a path under ${containerRoot}/ instead.`);
}
function resolveMountedContainerPath(mount, requestedPath, defaultContainerRoot) {
	const rel = path.posix.relative(mount.containerRoot, requestedPath);
	const hostPath = rel ? path.resolve(mount.hostRoot, ...rel.split("/").filter(Boolean)) : mount.hostRoot;
	const containerPath = rel ? path.posix.join(mount.containerRoot, rel) : mount.containerRoot;
	const relativePath = path.posix.relative(defaultContainerRoot, containerPath);
	return {
		hostPath,
		containerPath,
		relativePath: relativePathEscapesContainerRoot(relativePath) ? containerPath : relativePath,
		writable: mount.writable
	};
}
function compareMountsByContainerPath(a, b) {
	return b.containerRoot.length - a.containerRoot.length || MOUNT_SOURCE_PRIORITY[b.source] - MOUNT_SOURCE_PRIORITY[a.source];
}
function compareMountsByHostPath(a, b) {
	return b.hostRoot.length - a.hostRoot.length || MOUNT_SOURCE_PRIORITY[b.source] - MOUNT_SOURCE_PRIORITY[a.source];
}
const MOUNT_SOURCE_PRIORITY = {
	workspace: 0,
	agent: 1,
	bind: 2,
	protectedSkill: 3
};
function resolveSandboxFsMount(mounts, target, containerOnlyMounts = [], options) {
	let mount = null;
	for (const entry of mounts) if (isPathInsideContainerRoot(entry.containerRoot, target) && (!mount || entry.containerRoot.length > mount.containerRoot.length)) mount = entry;
	if (containerOnlyMounts.some((mask) => isPathInsideContainerRoot(mask, target) && (!mount || mask.length >= mount.containerRoot.length))) {
		if (options?.containerOnlyAsUnmapped) return null;
		throw new Error(`Sandbox path is container-only: ${target}. Use exec to access this mount; file tools require a host-backed bind mount.`);
	}
	return mount;
}
function findMountByHostPath(mounts, target) {
	const lexical = mounts.find((mount) => isPathInside(mount.hostRoot, path.resolve(target)));
	if (lexical) return {
		mount: lexical,
		relativeHostPath: path.relative(lexical.hostRoot, target)
	};
	for (const mount of mounts) {
		const relativeHostPath = relativePathInsideHost(mount.hostRoot, target);
		if (relativeHostPath !== null) return {
			mount,
			relativeHostPath
		};
	}
	return null;
}
function relativePathInsideHost(root, target) {
	const canonicalRoot = resolveSandboxHostPathViaExistingAncestor(path.resolve(root));
	const resolvedTarget = path.resolve(target);
	const canonicalTargetParent = resolveSandboxHostPathViaExistingAncestor(path.dirname(resolvedTarget));
	const canonicalTarget = path.resolve(canonicalTargetParent, path.basename(resolvedTarget));
	return isPathInside(canonicalRoot, canonicalTarget) ? path.relative(canonicalRoot, canonicalTarget) : null;
}
function mountedHostPathToContainer(params) {
	return params.relativeHostPath ? path.posix.join(params.mount.containerRoot, normalizePosixInput(params.relativeHostPath)) : params.mount.containerRoot;
}
function normalizePosixInput(value) {
	return value.split(path.sep).join(path.posix.sep);
}
//#endregion
export { resolveSandboxFsPathWithMounts as a, resolveSandboxFsMount as i, hasSandboxBindContainerPathAliases as n, resolveWritableSandboxBindHostRoots as o, hasSandboxBindReadonlyHostShadows as r, buildSandboxFsMounts as t };

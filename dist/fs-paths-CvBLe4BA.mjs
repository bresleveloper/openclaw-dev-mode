import { g as shortenPathWithHome } from "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as resolveSandboxHostPathViaExistingAncestor, n as isSandboxHostPathAbsolute } from "./host-paths-C5NtLpi_.mjs";
import { s as normalizeSandboxInputPath, u as resolveSandboxInputPath } from "./sandbox-paths-Br7HP2l8.mjs";
import { n as normalizeContainerPathCore, r as relativePathEscapesContainerRoot, t as isPathInsideContainerRoot } from "./path-utils-Drbu0ZHc.mjs";
import { a as resolveSandboxMountSelection, i as resolveSandboxBindMounts } from "./workspace-mounts-foAiMu-T.mjs";
import path from "node:path";
import os from "node:os";
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
	const roots = [];
	const seen = /* @__PURE__ */ new Set();
	for (const parsed of parsedBinds) {
		if (!parsed.writable || seen.has(parsed.hostRoot) || readonlyRoots.some((root) => isPathInside(parsed.hostRoot, root))) continue;
		seen.add(parsed.hostRoot);
		roots.push(parsed.hostRoot);
	}
	return roots;
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
			return resolveMountedContainerPath({
				mount: containerMount,
				containerPath: inputPosix,
				defaultContainerRoot: params.defaultContainerRoot
			});
		}
	}
	if (!isSandboxHostPathAbsolute(inputPosix)) {
		const containerCandidate = resolveRelativeContainerCandidate({
			inputPosix,
			cwd: params.cwd,
			defaultContainerRoot: params.defaultContainerRoot,
			mountsByHost
		});
		const containerMount = resolveSandboxFsMount(mountsByContainer, containerCandidate, params.containerOnlyMounts);
		if (containerMount) return resolveMountedContainerPath({
			mount: containerMount,
			containerPath: containerCandidate,
			defaultContainerRoot: params.defaultContainerRoot
		});
	}
	const hostMount = findMountByHostPath(mountsByHost, resolveSandboxInputPath(input, params.cwd));
	if (hostMount) {
		const relHost = hostMount.relativeHostPath;
		const relPosix = relHost ? relHost.split(path.sep).join(path.posix.sep) : "";
		const containerPath = relPosix ? path.posix.join(hostMount.mount.containerRoot, relPosix) : hostMount.mount.containerRoot;
		const visibleMount = resolveSandboxFsMount(mountsByContainer, containerPath, params.containerOnlyMounts);
		if (visibleMount) return resolveMountedContainerPath({
			mount: visibleMount,
			containerPath,
			defaultContainerRoot: params.defaultContainerRoot
		});
	}
	if (path.posix.isAbsolute(inputPosix)) resolveSandboxFsMount(mountsByContainer, inputPosix, params.containerOnlyMounts);
	const escapeMessage = formatSandboxRootEscapeMessage({
		input,
		defaultWorkspaceRoot: params.defaultWorkspaceRoot,
		defaultContainerRoot: params.defaultContainerRoot
	});
	throw new Error(escapeMessage);
}
function resolveMountedContainerPath(params) {
	const rel = path.posix.relative(params.mount.containerRoot, params.containerPath);
	const hostPath = rel ? path.resolve(params.mount.hostRoot, ...rel.split("/").filter(Boolean)) : params.mount.hostRoot;
	const containerPath = rel ? path.posix.join(params.mount.containerRoot, rel) : params.mount.containerRoot;
	return {
		hostPath,
		containerPath,
		relativePath: toDisplayRelative({
			containerPath,
			defaultContainerRoot: params.defaultContainerRoot
		}),
		writable: params.mount.writable
	};
}
function resolveRelativeContainerCandidate(params) {
	const cwdMount = findMountByHostPath(params.mountsByHost, path.resolve(params.cwd));
	if (cwdMount) {
		const relHost = cwdMount.relativeHostPath;
		const relPosix = relHost ? relHost.split(path.sep).join(path.posix.sep) : "";
		const containerCwd = relPosix ? path.posix.join(cwdMount.mount.containerRoot, relPosix) : cwdMount.mount.containerRoot;
		return normalizeContainerPathCore(path.posix.resolve(containerCwd, params.inputPosix));
	}
	const cwdPosix = normalizePosixInput(params.cwd);
	if (path.posix.isAbsolute(cwdPosix)) return normalizeContainerPathCore(path.posix.resolve(cwdPosix, params.inputPosix));
	return normalizeContainerPathCore(path.posix.resolve(params.defaultContainerRoot, params.inputPosix));
}
function formatSandboxRootEscapeMessage(params) {
	const containerRoot = normalizeContainerPathCore(params.defaultContainerRoot);
	let workspaceRoot = shortenPathWithHome(path.resolve(params.defaultWorkspaceRoot), {
		home: os.homedir(),
		prefix: "~"
	});
	if (workspaceRoot.startsWith(`~${path.sep}`)) workspaceRoot = workspaceRoot.replaceAll(path.sep, path.posix.sep);
	return `Path escapes sandbox root (${workspaceRoot}; container root ${containerRoot}): ${params.input}. Use a path under ${containerRoot}/ instead.`;
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
function toDisplayRelative(params) {
	const rel = path.posix.relative(params.defaultContainerRoot, params.containerPath);
	return relativePathEscapesContainerRoot(rel) ? params.containerPath : rel;
}
function normalizePosixInput(value) {
	return value.split(path.sep).join(path.posix.sep);
}
//#endregion
export { resolveSandboxFsPathWithMounts as a, resolveSandboxFsMount as i, hasSandboxBindContainerPathAliases as n, resolveWritableSandboxBindHostRoots as o, hasSandboxBindReadonlyHostShadows as r, buildSandboxFsMounts as t };

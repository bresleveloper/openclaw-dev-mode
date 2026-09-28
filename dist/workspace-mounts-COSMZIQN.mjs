import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { a as splitSandboxBindSpec, i as resolveSandboxHostPathViaExistingAncestor } from "./host-paths-drWtkcBg.mjs";
import { g as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./constants-D1dHTp_E.mjs";
import { n as MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS } from "./sandbox-workspace-paths-UF9Y-Qu5.mjs";
import { n as normalizeContainerPathCore } from "./path-utils-Drbu0ZHc.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/sandbox/workspace-mounts.ts
/**
* Sandbox workspace mount argument builder.
*
* Creates Docker bind specs for writable workspaces and read-only skill source mounts.
*/
function containerJoin(root, ...parts) {
	const normalizedRoot = root.endsWith("/") && root !== "/" ? root.slice(0, -1) : root;
	const suffix = parts.map((part) => part.replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
	return suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot;
}
function normalizeMountContainerPath(containerPath) {
	return normalizeContainerPathCore(containerPath).replace(/\/+$/, "") || "/";
}
/** Hidden workspace used to materialize non-workspace skills for rw sandboxes. */
function resolveMaterializedSandboxSkillsWorkspaceDir(rootDir) {
	return path.join(rootDir, ...MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS);
}
/** Returns true when a skill mount source exists inside the canonical mount root. */
function isExistingWorkspaceSkillMountSource(params) {
	try {
		if (!fs.lstatSync(params.hostPath).isDirectory()) return false;
	} catch {
		return false;
	}
	const agentRoot = resolveSandboxHostPathViaExistingAncestor(path.resolve(params.rootDir));
	const canonicalSource = resolveSandboxHostPathViaExistingAncestor(path.resolve(params.hostPath));
	return isPathInside(agentRoot, canonicalSource);
}
/** Protects managed skills inside writable shared or private sandbox workspaces. */
function resolveReadOnlyWorkspaceSkillMounts(params) {
	if (params.workspaceAccess === "ro") return [];
	const rootDir = params.workspaceAccess === "none" ? params.workspaceDir : params.agentWorkspaceDir;
	const mounts = [{
		hostPath: path.join(rootDir, "skills"),
		containerPath: containerJoin(params.workdir, "skills"),
		rootDir
	}, {
		hostPath: path.join(rootDir, ".agents", "skills"),
		containerPath: containerJoin(params.workdir, ".agents", "skills"),
		rootDir
	}];
	if (params.workspaceAccess === "rw") {
		const materializedSkillsWorkspaceDir = params.skillsWorkspaceDir ?? resolveMaterializedSandboxSkillsWorkspaceDir(rootDir);
		mounts.push({
			hostPath: path.join(materializedSkillsWorkspaceDir, "skills"),
			containerPath: containerJoin(params.workdir, ...MATERIALIZED_SANDBOX_SKILLS_WORKSPACE_PARTS, "skills"),
			rootDir: materializedSkillsWorkspaceDir
		});
	}
	return mounts.filter((mount) => isExistingWorkspaceSkillMountSource({
		rootDir: mount.rootDir,
		hostPath: mount.hostPath
	})).map(({ hostPath, containerPath }) => ({
		hostPath,
		containerPath
	}));
}
/** Resolves Gateway-local sources before the container lifecycle selects daemon paths. */
function resolveWorkspaceMounts(params) {
	const { workspaceDir, agentWorkspaceDir, workdir, workspaceAccess } = params;
	const mounts = [{
		hostPath: workspaceDir,
		containerPath: workdir,
		readOnly: workspaceAccess === "ro",
		source: "workspace"
	}];
	if (workspaceAccess !== "none" && workspaceDir !== agentWorkspaceDir) mounts.push({
		hostPath: agentWorkspaceDir,
		containerPath: SANDBOX_AGENT_WORKSPACE_MOUNT,
		readOnly: workspaceAccess === "ro",
		source: "agent"
	});
	const skills = params.readOnlyWorkspaceSkillMounts ?? resolveReadOnlyWorkspaceSkillMounts(params);
	for (const { hostPath, containerPath } of skills) mounts.push({
		hostPath,
		containerPath,
		readOnly: true,
		source: "protectedSkill"
	});
	return mounts;
}
/** Select exact-target winners without rewriting the operator's daemon-host bind strings. */
function selectSandboxBindMounts(binds) {
	const selected = /* @__PURE__ */ new Map();
	for (const bind of binds ?? []) {
		const parsed = splitSandboxBindSpec(bind);
		selected.set(parsed ? normalizeMountContainerPath(parsed.container) : bind, bind);
	}
	return [...selected.values()];
}
function resolveSandboxBindMounts(binds) {
	return selectSandboxBindMounts(binds).flatMap((bind) => {
		const parsed = splitSandboxBindSpec(bind);
		if (!parsed?.host || !path.posix.isAbsolute(parsed.container)) return [];
		return [{
			hostPath: parsed.host,
			containerPath: normalizeMountContainerPath(parsed.container),
			readOnly: parsed.options.toLowerCase().split(",").some((option) => option.trim() === "ro"),
			source: "bind"
		}];
	});
}
/** One selection owns container creation, file projection, and file-tool permissions. */
function resolveSandboxMountSelection(params) {
	const readOnlyWorkspaceSkillMounts = resolveReadOnlyWorkspaceSkillMounts(params);
	const managed = resolveWorkspaceMounts({
		...params,
		readOnlyWorkspaceSkillMounts
	});
	const resources = params.readOnlyResourceMounts ?? [];
	const protectedTargets = new Set([...readOnlyWorkspaceSkillMounts, ...resources].map((mount) => normalizeMountContainerPath(mount.containerPath)));
	const allowed = (params.binds ?? []).filter((bind) => {
		const spec = splitSandboxBindSpec(bind);
		return !spec || !protectedTargets.has(normalizeMountContainerPath(spec.container));
	});
	const custom = selectSandboxBindMounts(allowed);
	const mounts = /* @__PURE__ */ new Map();
	for (const mount of managed) {
		const containerPath = normalizeMountContainerPath(mount.containerPath);
		mounts.set(containerPath, {
			...mount,
			containerPath
		});
	}
	for (const mount of resolveSandboxBindMounts(custom)) mounts.set(mount.containerPath, mount);
	for (const resource of resources) {
		const containerPath = normalizeMountContainerPath(resource.containerPath);
		mounts.set(containerPath, {
			hostPath: resource.hostPath,
			containerPath,
			readOnly: true,
			source: "protectedSkill"
		});
	}
	return {
		mounts: [...mounts.values()],
		custom,
		skippedBinds: (params.binds ?? []).filter((bind) => !allowed.includes(bind)),
		readOnlyWorkspaceSkillMounts
	};
}
/** Docker keeps the final ro/rw flag; Podman rejects conflicting flags before creation. */
function sandboxMountOptionsReadOnly(options) {
	let readOnly = false;
	for (const option of options.split(",")) if (option === "ro" || option === "rw") readOnly = option === "ro";
	return readOnly;
}
function resolveSandboxTmpfsMounts(tmpfs) {
	const mounts = /* @__PURE__ */ new Map();
	for (const spec of tmpfs ?? []) {
		const separator = spec.indexOf(":");
		const target = separator === -1 ? spec : spec.slice(0, separator);
		const options = separator === -1 ? "" : spec.slice(separator + 1);
		const containerPath = normalizeMountContainerPath(target);
		mounts.set(containerPath, {
			containerPath,
			readOnly: sandboxMountOptionsReadOnly(options)
		});
	}
	return [...mounts.values()];
}
//#endregion
export { resolveSandboxMountSelection as a, resolveSandboxBindMounts as i, resolveMaterializedSandboxSkillsWorkspaceDir as n, resolveSandboxTmpfsMounts as o, resolveReadOnlyWorkspaceSkillMounts as r, sandboxMountOptionsReadOnly as s, normalizeMountContainerPath as t };

import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as CONFIG_DIR } from "./utils-gjJ-tD2q.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { s as isDefaultStateDir } from "./paths-orClZ-2Z.mjs";
import { r as resolveWorkspaceSkillDirectories } from "./workspace-skill-roots-CL28VeX5.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { w as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as resolvePluginSkillRoots, o as resolvePluginSkillRootsFromMetadata } from "./plugin-skills-Du3r4DEy.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-D4CgBm6V.mjs";
import { a as resolveSkillsUserHomeDir, i as resolvePluginSkillsDir } from "./local-loader-DuDhVnOL.mjs";
import { t as resolveBundledSkillsDir } from "./bundled-dir--MDSYPfU.mjs";
import path from "node:path";
//#region src/skills/loading/workspace-skill-sources.ts
/** Gateway-installed sources stay local; only workspace-owned files cross the boundary. */
function splitSkillSourcePlan(plan, execution = {}) {
	const isWorkspaceOwned = (root) => root.tier === "workspace" || (root.tier === "managed" || root.tier === "extra") && !plan.pluginSkillRoots.some((plugin) => plugin.dir === root.dir) && isPathInside(plan.workspaceDir, root.dir);
	const roots = plan.roots.map((root, order) => ({
		...root,
		order
	}));
	const gatewayRoots = roots.filter((root) => !isWorkspaceOwned(root));
	const workspaceRoots = roots.filter(isWorkspaceOwned);
	return {
		gatewayExecutionWorkspaceDir: execution.executionWorkspaceFileHost === "gateway" ? execution.executionWorkspaceDir : void 0,
		workspaceExecutionWorkspaceDir: execution.executionWorkspaceFileHost === "gateway" ? void 0 : execution.executionWorkspaceDir,
		gatewayRoots,
		gatewayPlan: {
			...plan,
			roots: gatewayRoots
		},
		workspacePlan: {
			...plan,
			roots: workspaceRoots,
			pluginSkillRoots: [],
			pluginSkillsDir: void 0,
			bundledSkillsDir: void 0,
			stateDir: void 0,
			userHomeDir: void 0,
			managedSkillsDir: workspaceRoots.find((root) => root.tier === "managed")?.dir ?? path.join(plan.workspaceDir, "skills")
		}
	};
}
function resolveCustodianSkillAgentId(config, agentId, workspaceOnly = false) {
	const owner = config ? tryResolveAmbientOwnerAgentId(config) : void 0;
	return !workspaceOnly && agentId && owner && normalizeAgentId(agentId) === owner ? owner : void 0;
}
/** Source selection and precedence are shared by local discovery and provisioned remote discovery. */
function resolveWorkspaceSkillSourcePlan(workspaceDir, opts) {
	const workspaceOnly = opts?.workspaceOnly === true;
	const userHomeDir = resolveSkillsUserHomeDir();
	const pluginSkillsDir = opts?.pluginSkillsDir ?? resolvePluginSkillsDir();
	const managedSkillsDir = opts?.managedSkillsDir ?? path.join(CONFIG_DIR, "skills");
	const bundledSkillsDir = workspaceOnly ? void 0 : opts?.bundledSkillsDir ?? resolveBundledSkillsDir();
	const pluginParams = {
		workspaceDir,
		config: opts?.config,
		pluginSkillsDir
	};
	const pluginSkillRoots = workspaceOnly ? [] : opts?.pluginSkillRoots ?? (opts?.pluginMetadataSnapshot ? resolvePluginSkillRootsFromMetadata({
		...pluginParams,
		metadataSnapshot: opts.pluginMetadataSnapshot
	}) : resolvePluginSkillRoots(pluginParams));
	const roots = [];
	if (!workspaceOnly) {
		roots.push(...normalizeTrimmedStringList(opts?.config?.skills?.load?.extraDirs ?? []).map((dir) => ({
			dir: resolveUserPath(dir),
			source: "openclaw-extra",
			tier: "extra"
		})));
		roots.push(...pluginSkillRoots.map((root) => ({
			...root,
			source: "openclaw-extra",
			tier: "extra"
		})));
		if (bundledSkillsDir) {
			roots.push({
				dir: bundledSkillsDir,
				source: "openclaw-bundled",
				tier: "bundled"
			});
			if (resolveCustodianSkillAgentId(opts?.config, opts?.agentId)) roots.push({
				dir: path.join(path.dirname(bundledSkillsDir), "custodian-skills"),
				source: "openclaw-custodian",
				tier: "bundled"
			});
		}
		if (opts?.config && opts.agentId) roots.push({
			dir: resolveWorkshopSkillsDir(opts.config, opts.agentId),
			source: "openclaw-workshop",
			tier: "workshop"
		});
		roots.push({
			dir: managedSkillsDir,
			source: "openclaw-managed",
			tier: "managed"
		});
		if (isDefaultStateDir()) roots.push({
			dir: path.resolve(userHomeDir ?? ".", ".agents", "skills"),
			source: "agents-skills-personal",
			tier: "personal"
		});
	}
	roots.push(...resolveWorkspaceSkillDirectories(workspaceDir, workspaceOnly).map(({ dir, source }) => ({
		dir,
		source,
		tier: "workspace"
	})));
	const worktreeRoot = opts?.config?.worktreeRoot ?? path.join(resolveStateDir(), "worktrees");
	for (const root of roots) root.worktree = isPathInside(worktreeRoot, root.dir);
	return {
		roots,
		allowSymlinkTargets: normalizeTrimmedStringList(opts?.config?.skills?.load?.allowSymlinkTargets ?? []).map((dir) => resolveUserPath(dir)),
		pluginSkillsDir,
		pluginSkillRoots,
		managedSkillsDir,
		bundledSkillsDir,
		stateDir: CONFIG_DIR,
		userHomeDir,
		workspaceDir
	};
}
//#endregion
export { resolveWorkspaceSkillSourcePlan as n, splitSkillSourcePlan as r, resolveCustodianSkillAgentId as t };

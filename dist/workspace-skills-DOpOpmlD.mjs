import { t as runNodeWorkspaceWorker } from "./workspace-worker-DNLnIjz-.mjs";
import path from "node:path";
//#region extensions/file-transfer/src/workspace-skills.ts
/** Native Skills retain discovery and installation; this adapter supplies node IO. */
function createNodeWorkspaceSkills(options) {
	const mapPath = (value) => {
		const relative = path.relative(options.workspaceDir, value);
		return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative) ? path.posix.join(options.remoteRoot, ...relative.split(path.sep)) : value;
	};
	const mapSources = (request) => {
		if (path.resolve(request.sourcePlan.workspaceDir) !== options.workspaceDir) throw new Error("Skill request does not match the configured workspace");
		const plan = request.sourcePlan;
		return {
			...request,
			executionWorkspaceDir: request.executionWorkspaceDir && mapPath(request.executionWorkspaceDir),
			sourcePlan: {
				...plan,
				workspaceDir: options.remoteRoot,
				stateDir: plan.stateDir && mapPath(plan.stateDir),
				managedSkillsDir: mapPath(plan.managedSkillsDir),
				pluginSkillsDir: plan.pluginSkillsDir && mapPath(plan.pluginSkillsDir),
				bundledSkillsDir: plan.bundledSkillsDir && mapPath(plan.bundledSkillsDir),
				roots: plan.roots.map((root) => ({
					...root,
					dir: mapPath(root.dir)
				})),
				pluginSkillRoots: plan.pluginSkillRoots.map((root) => ({
					...root,
					dir: mapPath(root.dir)
				})),
				allowSymlinkTargets: plan.allowSymlinkTargets?.map(mapPath)
			}
		};
	};
	async function call(operation, request, signal) {
		const active = signal ? AbortSignal.any([options.signal, signal]) : options.signal;
		return JSON.parse(await runNodeWorkspaceWorker(options, "workspace.skills", {
			operation,
			request: JSON.stringify(request),
			watch: false
		}, active));
	}
	return {
		loadSkills: (request) => call("discovery", {
			...request,
			...mapSources(request)
		}),
		async watchSkills(request, onChange, signal) {
			await runNodeWorkspaceWorker(options, "workspace.skills", {
				operation: "watch",
				request: JSON.stringify(mapSources(request)),
				watch: true
			}, AbortSignal.any([options.signal, signal]), (line) => {
				const event = JSON.parse(line);
				if (event !== "change" && event !== "unavailable") throw new Error("Invalid Skill change notification");
				onChange(event);
			});
		},
		skillResources: {
			readInstructions: (filePath, { signal }) => call("readInstructions", { filePath }, signal),
			resolveExplicitSkill: (selection) => call("resolveResource", selection),
			readSkillFiles: (skill, { allowMissingRoot }) => call("readResources", {
				skill,
				allowMissingRoot
			})
		},
		installSkillDependencies: (request) => call("installDependencies", request)
	};
}
//#endregion
export { createNodeWorkspaceSkills };

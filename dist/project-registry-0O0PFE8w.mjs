import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { O as withAgentRosterFactsBatch, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B69mLcu_.mjs";
import { u as runGit } from "./git-CljZIJM8.mjs";
import { i as insideGitCheckout } from "./workspace-git-CiP8oVHR.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/projects/project-checkout.ts
const PROJECT_CHECKOUT_LEASE_MS = 3e4;
const PROJECT_CHECKOUT_WAIT_MS = 3e4;
var ProjectCheckoutError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "ProjectCheckoutError";
	}
};
async function withProjectCheckoutLifecycle(repoRoot, options, run) {
	return await withOpenClawStateLease({
		scope: "projects.checkout",
		key: repoRoot,
		signal: options.signal,
		database: {
			scope: "shared",
			options
		},
		leaseMs: PROJECT_CHECKOUT_LEASE_MS,
		waitMs: PROJECT_CHECKOUT_WAIT_MS,
		leaseLabel: "project checkout lease",
		operationLabel: "projects.checkout.lease"
	}, run);
}
async function resolveProjectDirectory(projectPath) {
	const requested = await fs.realpath(projectPath).catch(() => {
		throw new ProjectCheckoutError(`project path does not exist: ${projectPath}`);
	});
	if (!(await fs.stat(requested).catch(() => null))?.isDirectory()) throw new ProjectCheckoutError(`project path is not a directory: ${projectPath}`);
	return requested;
}
async function resolveProjectCheckout(projectPath) {
	const requested = await resolveProjectDirectory(projectPath);
	if (!insideGitCheckout(requested)) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const rootResult = await runGit(requested, ["rev-parse", "--show-toplevel"], { operation: "project.checkout" });
	if (rootResult.code !== 0) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const repoRoot = await fs.realpath(rootResult.stdout.trim()).catch(() => {
		throw new ProjectCheckoutError(`project checkout root is unavailable: ${projectPath}`);
	});
	if ((await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], { operation: "project.checkout" })).code !== 0) throw new ProjectCheckoutError(`project checkout has no commits: ${projectPath}`);
	const originResult = await runGit(repoRoot, [
		"config",
		"--get",
		"remote.origin.url"
	], { operation: "project.checkout" });
	const originUrl = originResult.code === 0 ? originResult.stdout.trim() : "";
	return {
		path: requested,
		repoRoot,
		...originUrl ? { originUrl } : {}
	};
}
//#endregion
//#region src/projects/project-registration.ts
async function prepareProjectRegistration(input) {
	const { path: requestedPath, name, originUrl, source } = input;
	const checkout = await resolveProjectCheckout(requestedPath);
	return {
		requestedPath,
		project: {
			displayName: name?.trim() || path.basename(checkout.repoRoot) || "Project",
			repoRoot: checkout.repoRoot,
			originUrl: originUrl ?? checkout.originUrl,
			source
		}
	};
}
async function registerPreparedProjectRegistry(prepared, lease, context, onRegistered, assertCurrent) {
	const current = await resolveProjectCheckout(prepared.project.repoRoot);
	lease.assertOwned();
	if (current.repoRoot !== prepared.project.repoRoot) throw new ProjectCheckoutError(`project checkout changed while registering: ${prepared.requestedPath}`);
	const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-operation-8gGJurRc.mjs");
	return await runWithOpenClawStateLeaseWorker(lease, context, async (scope, identity) => {
		const project = await scope.execute({
			type: "projects.insert",
			input: {
				project: prepared.project,
				lease: identity
			}
		});
		onRegistered?.();
		return project;
	}, assertCurrent ? {
		assertCurrent,
		beforeCommit: assertCurrent
	} : void 0);
}
//#endregion
//#region src/projects/project-registry.ts
function workspaceProject(cfg, agentId) {
	const repoRoot = resolveAgentWorkspaceDir(cfg, agentId);
	return {
		id: `workspace:${agentId}`,
		displayName: path.basename(repoRoot) || agentId,
		repoRoot,
		source: "workspace",
		agentId
	};
}
function compareProjects(left, right) {
	const leftName = left.displayName.toLowerCase();
	const rightName = right.displayName.toLowerCase();
	if (leftName !== rightName) return leftName < rightName ? -1 : 1;
	return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}
async function registerProjectRegistry(input, options = {}) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.path,
		env
	});
	const prepared = await prepareProjectRegistration({
		...input,
		source: "registered"
	});
	return await withProjectCheckoutLifecycle(prepared.project.repoRoot, {
		path: context.admission.databasePath,
		env
	}, (lease) => registerPreparedProjectRegistry(prepared, lease, context));
}
function listWorkspaceProjects(cfg) {
	return withAgentRosterFactsBatch(cfg, () => listAgentIds(cfg).map((agentId) => workspaceProject(cfg, agentId)).toSorted(compareProjects));
}
async function listProjectRegistry(cfg, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const workspaces = listWorkspaceProjects(cfg);
	const { executeExistingOpenClawStateRead } = await import("./openclaw-state-db-readonly-DM1-BlkK.mjs");
	const stored = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "projects.list",
		input: void 0
	}, {
		context,
		current: true
	});
	return [...workspaces, ...stored?.projects ?? []].toSorted(compareProjects);
}
function resolveWorkspaceProject(cfg, id) {
	if (!id.startsWith("workspace:")) return;
	const agentId = id.slice(10);
	return listAgentIds(cfg).includes(agentId) ? workspaceProject(cfg, agentId) : void 0;
}
async function resolveProjectRegistry(cfg, id, options = {}) {
	if (id.startsWith("workspace:")) return resolveWorkspaceProject(cfg, id);
	return await readStoredProjectRegistry(captureOpenClawStateWorkerContext(options), id);
}
async function readStoredProjectRegistry(context, id) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "projects.resolve",
		input: { id }
	});
}
/** Retain the original database and reacquire the selected checkout for each finite operation. */
async function selectStoredProjectRegistry(id, options = {}) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.path,
		env
	});
	const signal = options.signal;
	const project = await readStoredProjectRegistry(context, id);
	if (!project) return;
	const repoRoot = project.repoRoot;
	return {
		project,
		withRollback: async (run) => await withProjectCheckoutLifecycle(repoRoot, {
			path: context.admission.databasePath,
			env
		}, async (lease) => {
			const { withOpenClawStateLeaseWorkerAdmission } = await import("./openclaw-state-lease-worker-owner-BdC2bRUO.mjs");
			return await withOpenClawStateLeaseWorkerAdmission(lease, context.admission.databasePath, async (admission) => await run(() => {
				context.admission.assertCurrent();
				admission.assertCurrent();
			}));
		}),
		withCurrent: async (run) => {
			const acquisition = new AbortController();
			const abortAcquisition = () => acquisition.abort(signal?.reason);
			signal?.addEventListener("abort", abortAcquisition, { once: true });
			if (signal?.aborted) abortAcquisition();
			try {
				return await withProjectCheckoutLifecycle(repoRoot, {
					path: context.admission.databasePath,
					env,
					signal: acquisition.signal
				}, async (lease) => {
					signal?.removeEventListener("abort", abortAcquisition);
					const operationSignal = signal ? AbortSignal.any([signal, lease.signal]) : lease.signal;
					try {
						const { withOpenClawStateLeaseWorkerAdmission } = await import("./openclaw-state-lease-worker-owner-BdC2bRUO.mjs");
						const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
						return await withOpenClawStateLeaseWorkerAdmission(lease, context.admission.databasePath, async (admission) => {
							const assertCheckoutCurrent = () => {
								context.admission.assertCurrent();
								admission.assertCurrent();
							};
							const assertCurrent = () => {
								assertCheckoutCurrent();
								operationSignal.throwIfAborted();
							};
							return await runOpenClawStateWorkerOperation(context, async (scope) => {
								const current = await scope.execute({
									type: "projects.resolve",
									input: { id }
								});
								assertCurrent();
								return await run({
									project: current,
									assertCurrent,
									assertCheckoutCurrent,
									signal: operationSignal
								});
							}, {
								assertCurrent,
								createAdmission: admission.createAdmission
							});
						});
					} finally {
						signal?.addEventListener("abort", abortAcquisition, { once: true });
						if (signal?.aborted) abortAcquisition();
					}
				});
			} finally {
				signal?.removeEventListener("abort", abortAcquisition);
			}
		}
	};
}
async function resolveRecordedProjectRoot(projectPath, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const repoRoot = await fs.realpath(projectPath).catch(() => void 0);
	if (!repoRoot) return;
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "projects.findRoot",
		input: { repoRoot }
	});
}
async function removeProjectRegistry(project, options = {}) {
	const selectedProject = {
		id: project.id,
		repoRoot: project.repoRoot,
		source: project.source,
		originUrl: project.originUrl
	};
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.path,
		env
	});
	return await withProjectCheckoutLifecycle(selectedProject.repoRoot, {
		path: context.admission.databasePath,
		env
	}, async (lease) => {
		const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-operation-8gGJurRc.mjs");
		return await runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
			type: "projects.remove",
			input: {
				project: selectedProject,
				lease: identity
			}
		}));
	});
}
//#endregion
export { resolveProjectRegistry as a, selectStoredProjectRegistry as c, ProjectCheckoutError as d, resolveProjectCheckout as f, removeProjectRegistry as i, prepareProjectRegistration as l, withProjectCheckoutLifecycle as m, listWorkspaceProjects as n, resolveRecordedProjectRoot as o, resolveProjectDirectory as p, registerProjectRegistry as r, resolveWorkspaceProject as s, listProjectRegistry as t, registerPreparedProjectRegistry as u };

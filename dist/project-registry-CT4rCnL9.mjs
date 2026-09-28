import { O as listAgentIds, l as resolveAgentWorkspaceDir, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { d as runGit, o as insideGitCheckout } from "./git-DSwuA7YL.mjs";
import { i as removeProjectCheckoutReferenceInDatabase, t as ensureProjectRegistrySchema } from "./project-registry.kernel-BVX6sQ_I.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/projects/project-checkout.ts
const PROJECT_CHECKOUT_LEASE_MS = 3e4;
const PROJECT_CHECKOUT_WAIT_MS = 3e4;
var ProjectCheckoutError = class extends Error {
	constructor(message) {
		super(message);
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
	const rootResult = await runGit(requested, ["rev-parse", "--show-toplevel"]);
	if (rootResult.code !== 0) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const repoRoot = await fs.realpath(rootResult.stdout.trim()).catch(() => {
		throw new ProjectCheckoutError(`project checkout root is unavailable: ${projectPath}`);
	});
	if ((await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	])).code !== 0) throw new ProjectCheckoutError(`project checkout has no commits: ${projectPath}`);
	const originResult = await runGit(repoRoot, [
		"config",
		"--get",
		"remote.origin.url"
	]);
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
async function registerPreparedProjectRegistry(prepared, lease, context, onRegistered) {
	const current = await resolveProjectCheckout(prepared.project.repoRoot);
	lease.assertOwned();
	if (current.repoRoot !== prepared.project.repoRoot) throw new ProjectCheckoutError(`project checkout changed while registering: ${prepared.requestedPath}`);
	const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-storage-BosGL_vJ.mjs");
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
	});
}
async function registerResolvedProject(input, options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.path,
		env
	});
	const prepared = await prepareProjectRegistration(input);
	return await withProjectCheckoutLifecycle(prepared.project.repoRoot, {
		path: context.admission.databasePath,
		env
	}, (lease) => registerPreparedProjectRegistry(prepared, lease, context));
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
	return await registerResolvedProject({
		...input,
		source: "registered"
	}, options);
}
function listWorkspaceProjects(cfg) {
	return withAgentRosterFactsBatch(cfg, () => listAgentIds(cfg).map((agentId) => workspaceProject(cfg, agentId)).toSorted(compareProjects));
}
async function listProjectRegistry(cfg, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const workspaces = listWorkspaceProjects(cfg);
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
	const stored = await executeOpenClawStateWorker(context, {
		type: "projects.list",
		input: void 0
	});
	return [...workspaces, ...stored].toSorted(compareProjects);
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
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
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
			const { withOpenClawStateLeaseWorkerAdmission } = await import("./openclaw-state-lease-worker-owner-rJ3Kk1PT.mjs");
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
						const { withOpenClawStateLeaseWorkerAdmission } = await import("./openclaw-state-lease-worker-owner-rJ3Kk1PT.mjs");
						const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
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
function removeProjectCheckoutReference(project, lease, options = {}) {
	ensureProjectRegistrySchema(options);
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		lease.assertOwnedInTransaction(sqlite);
		return removeProjectCheckoutReferenceInDatabase(sqlite, project);
	}, options, { operationLabel: "projects.registry.checkout-reference.remove" });
}
async function resolveProjectCloneRefreshOwner(project, lease, context) {
	const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-storage-BosGL_vJ.mjs");
	return await runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "projects.resolveRefreshOwner",
		input: {
			project,
			lease: identity
		}
	}));
}
async function resolveRecordedProjectRoot(projectPath, options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const repoRoot = await fs.realpath(projectPath).catch(() => void 0);
	if (!repoRoot) return;
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
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
		const { runWithOpenClawStateLeaseWorker } = await import("./openclaw-state-lease-worker-storage-BosGL_vJ.mjs");
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
export { removeProjectRegistry as a, resolveRecordedProjectRoot as c, prepareProjectRegistration as d, registerPreparedProjectRegistry as f, withProjectCheckoutLifecycle as g, resolveProjectDirectory as h, removeProjectCheckoutReference as i, resolveWorkspaceProject as l, resolveProjectCheckout as m, listWorkspaceProjects as n, resolveProjectCloneRefreshOwner as o, ProjectCheckoutError as p, registerProjectRegistry as r, resolveProjectRegistry as s, listProjectRegistry as t, selectStoredProjectRegistry as u };

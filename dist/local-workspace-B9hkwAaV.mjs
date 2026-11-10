import { i as withWorktreeAllocationLease } from "./allocation-qJnLlg7h.mjs";
import { n as setWorktreePreparationTemplate, r as startWorktreePreparationPhase, t as markManagedWorktreePreparation } from "./preparation-timing-BalEUWpk.mjs";
import { r as getSandboxInputStager, t as bindSandboxInputStager } from "./input-staging-as6U58RD.mjs";
import { n as resolveLocalWorkspaceOwner, r as withLocalWorkspaceProjection } from "./local-workspace-projection-DYypmjFp.mjs";
import path from "node:path";
//#region src/agents/sandbox/local-workspace.ts
/** A writable project is an exact managed projection, never a role-policy override. */
async function prepareLocalSandboxWorkspace(params) {
	const owner = await resolveLocalWorkspaceOwner(params);
	if (!owner) return;
	try {
		markManagedWorktreePreparation();
		if (params.sandbox.backend !== "docker" && params.sandbox.backend !== "podman") throw new Error("Managed guest projects require a local Docker or Podman sandbox; this backend cannot safely reconcile a local managed checkout");
		const existing = await withLocalWorkspaceProjection(owner, (state) => state.reuse());
		let workspaceDir;
		if (existing) {
			setWorktreePreparationTemplate("reused");
			workspaceDir = existing;
		} else if (params.cfg.worktreeAcceleration === false) workspaceDir = await withLocalWorkspaceProjection(owner, (state) => state.prepare());
		else {
			const allocated = startWorktreePreparationPhase("allocate");
			try {
				workspaceDir = await withWorktreeAllocationLease({
					env: owner.env ?? process.env,
					signal: params.signal,
					commitGuard: owner.assertCurrent,
					workerAuthority: owner.workerAuthority
				}, (allocation) => {
					allocated();
					return withLocalWorkspaceProjection({
						...owner,
						workerAuthority: allocation.workerAuthority
					}, (state) => state.prepare({
						sandbox: params.sandbox,
						allocation
					}));
				});
			} finally {
				allocated();
			}
		}
		owner.assertCurrent();
		return {
			workspaceDir,
			workspaceCwd: path.join(workspaceDir, path.relative(owner.worktree.path, params.workspaceDir ?? owner.worktree.path)),
			assertCurrent: owner.assertCurrent,
			provision: async (run, signal) => await withLocalWorkspaceProjection(owner, async () => {
				owner.assertCurrent();
				const result = await run();
				owner.assertCurrent();
				return result;
			}, {
				provision: true,
				signal
			}),
			checkpoint: async () => {
				await withLocalWorkspaceProjection(owner, (state) => state.synchronize("canonical"));
			},
			[Symbol.dispose]: () => owner[Symbol.dispose]()
		};
	} catch (error) {
		owner[Symbol.dispose]();
		throw error;
	}
}
/** All harnesses use the same backend/bridge, including native Codex execution. */
function bindLocalSandboxWorkspace(sandbox, projection) {
	const backend = sandbox.backend;
	if (!backend) throw new Error("Managed guest project has no sandbox execution owner");
	const prepareCleanup = backend.prepareProcessCleanup?.bind(backend);
	if (prepareCleanup) backend.prepareProcessCleanup = (env) => {
		projection.assertCurrent();
		return prepareCleanup(env);
	};
	const shell = backend.runShellCommand.bind(backend);
	backend.runShellCommand = (params) => projection.provision(async () => {
		params.signal?.throwIfAborted();
		projection.assertCurrent();
		return await shell(params);
	}, params.signal);
	const build = backend.buildExecSpec.bind(backend);
	const finalize = backend.finalizeExec?.bind(backend);
	backend.buildExecSpec = async (params) => {
		let spec;
		try {
			return await projection.provision(async () => {
				projection.assertCurrent();
				spec = await build(params);
				projection.assertCurrent();
				const assertCurrent = spec.assertCurrent;
				return {
					...spec,
					assertCurrent: () => {
						projection.assertCurrent();
						assertCurrent?.();
					}
				};
			});
		} catch (error) {
			if (spec) await finalize?.({
				status: "failed",
				exitCode: null,
				timedOut: false,
				token: spec.finalizeToken
			});
			throw error;
		}
	};
	backend.finalizeExec = async (params) => {
		await finalize?.(params);
		await projection.checkpoint();
	};
	const bridge = sandbox.fsBridge;
	if (!bridge) throw new Error("Managed guest project has no filesystem bridge");
	const mutate = async (operation) => {
		projection.assertCurrent();
		try {
			return await operation();
		} finally {
			await projection.checkpoint();
		}
	};
	const writeFile = bridge.writeFile.bind(bridge);
	const mkdirp = bridge.mkdirp.bind(bridge);
	const remove = bridge.remove.bind(bridge);
	const rename = bridge.rename.bind(bridge);
	const copyFile = bridge.copyFile?.bind(bridge);
	const createFileExclusive = bridge.createFileExclusive?.bind(bridge);
	bridge.writeFile = (params) => mutate(() => writeFile(params));
	bridge.mkdirp = (params) => mutate(() => mkdirp(params));
	bridge.remove = (params) => mutate(() => remove(params));
	bridge.rename = (params) => mutate(() => rename(params));
	if (copyFile) bridge.copyFile = (params) => mutate(() => copyFile(params));
	if (createFileExclusive) bridge.createFileExclusive = (params) => mutate(() => createFileExclusive(params));
	const stageInput = getSandboxInputStager(bridge);
	if (stageInput) bindSandboxInputStager(bridge, (params) => mutate(() => projection.provision(() => stageInput(params), params.signal)));
}
//#endregion
export { bindLocalSandboxWorkspace, prepareLocalSandboxWorkspace };

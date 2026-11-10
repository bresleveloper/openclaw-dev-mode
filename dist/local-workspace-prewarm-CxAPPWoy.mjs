import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { a as withWorktreeMutationLease } from "./allocation-qJnLlg7h.mjs";
import { c as withWorktreeRunEnd } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { l as withWorktreeSources, p as resolveWorktreeBase } from "./service-preparation-BPHRuGZn.mjs";
import { n as resolveRepository } from "./repository-paths-D7rjAU03.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { n as prepareLocalWorkspaceTemplate } from "./local-workspace-template-9sK35phw.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/gateway/worker-environments/local-workspace-prewarm.ts
const log = createSubsystemLogger("agents/worktrees");
async function prewarmLocalWorkspaceTemplates(params) {
	const config = params.getConfig();
	if (config.worktreeAcceleration === false) return;
	const controller = new AbortController();
	const signal = AbortSignal.any([params.signal, controller.signal]);
	const unsubscribe = sessionChanges.subscribe((change) => {
		if ("all" in change && typeof change.scope === "string" && change.scope.startsWith("config")) controller.abort();
	});
	const commitGuard = () => {
		if (params.getConfig() !== config) controller.abort();
		signal.throwIfAborted();
	};
	const env = process.env;
	try {
		for (const agentId of listAgentIds(config)) {
			const sandbox = resolveSandboxConfigForAgent(config, agentId);
			if (sandbox.backend !== "docker" && sandbox.backend !== "podman") continue;
			try {
				commitGuard();
				const repository = await resolveRepository(resolveAgentWorkspaceDir(config, agentId));
				await withWorktreeRunEnd(env, () => withWorktreeMutationLease({
					env,
					signal,
					commitGuard,
					id: `template-prewarm:${agentId}`
				}, (guard) => withWorktreeSources(env, async (retainRepository) => {
					await retainRepository({
						...guard,
						repository
					});
					const base = await resolveWorktreeBase(repository.repoRoot, void 0, signal, guard.commitGuard);
					const templateRoot = path.join(await fs.realpath(resolveStateDir(env)), "worktree-projections");
					guard.commitGuard();
					await fs.mkdir(templateRoot, {
						recursive: true,
						mode: 448
					});
					await (await prepareLocalWorkspaceTemplate({
						source: repository.repoRoot,
						repoRoot: repository.repoRoot,
						baseCommit: base.commit,
						temporaryRoot: templateRoot,
						templateRoot,
						env,
						sandbox,
						guard: {
							...guard,
							signal: guard.signal ?? signal
						}
					}))?.record.release();
				})));
			} catch {
				if (signal.aborted) return;
				log.debug(`sandbox dependency template prewarm unavailable for agent ${agentId}`);
			}
		}
	} finally {
		unsubscribe();
	}
}
//#endregion
export { prewarmLocalWorkspaceTemplates };

import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { t as runTasksWithConcurrency } from "../run-with-concurrency-Dtu208ef.mjs";
import { c as withGitWorkerContext, s as serializeGitWorkerFailure } from "../git-worker-context-Bo3RTsYA.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-sMsYUF1K.mjs";
//#region src/infra/git-operation.worker.ts
serveWorkerTasks(async (input, channel, control) => {
	try {
		if (!channel || !isRecord(input) || typeof input.type !== "string" || !isRecord(input.input)) throw new Error("Git worker requires a typed operation and host channel");
		const command = input;
		channel.consumeInput();
		return {
			ok: true,
			value: await withGitWorkerContext(channel, () => {
				switch (command.type) {
					case "workspace.inventory.select":
					case "workspace.inventory.existing":
					case "workspace.inventory.paths":
					case "workspace.inventory.staged-directories": return import("../workspace-inventory-computation.runtime-8nHxsIxp.mjs").then(({ executeWorkspaceInventoryComputation }) => executeWorkspaceInventoryComputation(command));
					case "workspace.manifest.capture":
					case "workspace.manifest.snapshot":
					case "workspace.manifest.parse":
					case "workspace.manifest.serialize":
					case "workspace.manifest.overlay":
					case "workspace.manifest.pair":
					case "workspace.manifest.staged":
					case "workspace.manifest.entries":
					case "workspace.manifest.file":
					case "workspace.manifest.nodes":
					case "workspace.reconcile.preflight": return import("../workspace-manifest-computation.runtime-DpRnkwK8.mjs").then(({ executeWorkspaceManifestComputation }) => executeWorkspaceManifestComputation(command));
					case "workspace.manifest.stage-input":
					case "workspace.manifest.tree-input":
					case "workspace.manifest.remote-capture": return control.runNativeSection(async () => {
						const { executeWorkspaceManifestComputation } = await import("../workspace-manifest-computation.runtime-DpRnkwK8.mjs");
						return await executeWorkspaceManifestComputation(command, control.throwIfCancelled);
					});
					case "workspace.artifacts": return import("../workspace-result-inventory.runtime-BZZPj5m5.mjs").then(({ collectStagedWorkerArtifacts }) => collectStagedWorkerArtifacts(command.input));
					case "worktree.eviction-purge": return control.runNativeSection(async () => {
						const { executeGitWorktreeOperation } = await import("../git-worktree-operations.runtime-m37LzP-C.mjs");
						return await executeGitWorktreeOperation(command);
					});
					case "worktree.snapshot-verify-exact":
					case "worktree.snapshot":
					case "worktree.provisioning-inspection":
					case "worktree.cleanup-inspection":
					case "worktree.cleanup-fingerprint":
					case "worktree.eviction-classify":
					case "worktree.eviction-source":
					case "worktree.eviction-repositories":
					case "worktree.git-size":
					case "worktree.checkout-transition-size":
					case "worktree.directory-size": return import("../git-worktree-operations.runtime-m37LzP-C.mjs").then(({ executeGitWorktreeOperation }) => executeGitWorktreeOperation(command));
					case "repository.identities": return import("../repository-paths-L4jISQBg.mjs").then(async ({ resolveRepositoryIdentity }) => (await runTasksWithConcurrency({
						tasks: command.input.roots.map((root) => () => resolveRepositoryIdentity(root)),
						limit: 4
					})).results);
					case "repository.branches": return import("../branches.runtime-By0raqz5.mjs").then(({ readRepositoryBranches }) => readRepositoryBranches(command.input.repoRoot, command.input));
					case "checkout.revision": return import("../control-ui-session-prs-git.runtime-Zjon4Oka.mjs").then(({ readCheckoutGitRevision }) => readCheckoutGitRevision(command.input));
					case "checkout.context": return import("../control-ui-session-prs-git.runtime-Zjon4Oka.mjs").then(({ readCheckoutGitContext }) => readCheckoutGitContext(command.input.root, command.input.githubHost));
					case "pull-request.branch-comparison": return import("../control-ui-session-prs-git.runtime-Zjon4Oka.mjs").then(({ readPullRequestBranchComparison }) => readPullRequestBranchComparison(command.input));
					case "pull-request.branch-facts": return import("../control-ui-session-prs-git.runtime-Zjon4Oka.mjs").then(({ readPullRequestBranchFacts }) => readPullRequestBranchFacts(command.input));
					case "checkout.diff": return import("../session-diff.runtime-BnjM0vtX.mjs").then(({ collectCheckoutDiff }) => collectCheckoutDiff(command.input));
					case "checkout.baseline": return import("../session-diff.runtime-BnjM0vtX.mjs").then(({ collectCheckoutDiffBaseline }) => collectCheckoutDiffBaseline(command.input));
				}
				throw new Error("Unsupported Git worker operation");
			}, command.filesystemRefs)
		};
	} catch (error) {
		return {
			ok: false,
			error: serializeGitWorkerFailure(error)
		};
	}
}, { transferList: (reply) => reply.ok && reply.value instanceof Uint8Array && reply.value.buffer instanceof ArrayBuffer ? [reply.value.buffer] : [] });
//#endregion
export {};

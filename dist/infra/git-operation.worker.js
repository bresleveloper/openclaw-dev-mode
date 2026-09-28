import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-CwtaNZgU.mjs";
import { o as serializeGitWorkerFailure, s as withGitWorkerContext } from "../git-worker-context-Cywc-SH2.mjs";
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
					case "workspace.inventory.staged-directories": return import("../workspace-inventory-computation.runtime-BW4cPVQ5.mjs").then(({ executeWorkspaceInventoryComputation }) => executeWorkspaceInventoryComputation(command));
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
					case "workspace.reconcile.preflight": return import("../workspace-manifest-computation.runtime-DPWqLnrB.mjs").then(({ executeWorkspaceManifestComputation }) => executeWorkspaceManifestComputation(command));
					case "workspace.manifest.stage-input":
					case "workspace.manifest.tree-input": return control.runNativeSection(async () => {
						const { executeWorkspaceManifestComputation } = await import("../workspace-manifest-computation.runtime-DPWqLnrB.mjs");
						return await executeWorkspaceManifestComputation(command, control.throwIfCancelled);
					});
					case "workspace.artifacts": return import("../workspace-result-inventory.runtime-Dmq6N87d.mjs").then(({ collectStagedWorkerArtifacts }) => collectStagedWorkerArtifacts(command.input));
					case "worktree.snapshot-verify-exact":
					case "worktree.snapshot":
					case "worktree.provisioning-inspection":
					case "worktree.cleanup-inspection":
					case "worktree.git-size":
					case "worktree.checkout-transition-size":
					case "worktree.directory-size": return import("../git-worktree-operations.runtime-BSGyyHKI.mjs").then(({ executeGitWorktreeOperation }) => executeGitWorktreeOperation(command));
					default: return import("../git-read-operations.runtime-CdHNh8W_.mjs").then(({ executeGitReadOperation }) => executeGitReadOperation(command));
				}
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

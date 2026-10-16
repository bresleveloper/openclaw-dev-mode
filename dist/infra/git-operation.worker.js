import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
import { o as serializeGitWorkerFailure, s as withGitWorkerContext } from "../git-worker-context-BSo6KDXb.mjs";
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
					case "workspace.inventory.staged-directories": return import("../workspace-inventory-computation.runtime-BSCOkw1w.mjs").then(({ executeWorkspaceInventoryComputation }) => executeWorkspaceInventoryComputation(command));
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
					case "workspace.reconcile.preflight": return import("../workspace-manifest-computation.runtime-BDkWBoNT.mjs").then(({ executeWorkspaceManifestComputation }) => executeWorkspaceManifestComputation(command));
					case "workspace.manifest.stage-input":
					case "workspace.manifest.tree-input":
					case "workspace.manifest.remote-capture": return control.runNativeSection(async () => {
						const { executeWorkspaceManifestComputation } = await import("../workspace-manifest-computation.runtime-BDkWBoNT.mjs");
						return await executeWorkspaceManifestComputation(command, control.throwIfCancelled);
					});
					case "workspace.artifacts": return import("../workspace-result-inventory.runtime-BrrzB8rQ.mjs").then(({ collectStagedWorkerArtifacts }) => collectStagedWorkerArtifacts(command.input));
					case "worktree.snapshot-verify-exact":
					case "worktree.snapshot":
					case "worktree.provisioning-inspection":
					case "worktree.cleanup-inspection":
					case "worktree.git-size":
					case "worktree.checkout-transition-size":
					case "worktree.directory-size": return import("../git-worktree-operations.runtime-DSJuHlQ2.mjs").then(({ executeGitWorktreeOperation }) => executeGitWorktreeOperation(command));
					default: return import("../git-read-operations.runtime-izEV1wye.mjs").then(({ executeGitReadOperation }) => executeGitReadOperation(command));
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

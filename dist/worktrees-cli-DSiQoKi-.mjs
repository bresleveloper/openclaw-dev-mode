import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BRdXcJHh.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { Option } from "commander";
//#region src/cli/worktrees-cli.ts
function printJson(value) {
	defaultRuntime.writeJson(value);
}
async function readExactStateRequest(filename) {
	if (!filename) return;
	const { readFile } = await import("node:fs/promises");
	const { exactStateRetirementSchema } = await import("./snapshot-exact-state-contract-DiDtFYuk.mjs");
	return exactStateRetirementSchema.parse(JSON.parse(await readFile(filename, "utf8")));
}
function printRecord(record, json) {
	if (json) {
		printJson(record);
		return;
	}
	defaultRuntime.log(`${record.id}\t${record.path}`);
}
function registerWorktreesCli(program) {
	const worktrees = program.command("worktrees").description("Create, inspect, restore, and clean up managed worktrees");
	worktrees.command("list").description("List active and restorable managed worktrees").option("--json", "Output JSON", false).action(async (opts) => {
		const { managedWorktrees } = await import("./service-BSrAmEtE.mjs");
		const records = await managedWorktrees.list();
		if (opts.json) {
			printJson({ worktrees: records });
			return;
		}
		if (records.length === 0) {
			defaultRuntime.log("No managed worktrees.");
			return;
		}
		defaultRuntime.log(renderTable({
			width: getTerminalTableWidth(),
			columns: [
				{
					key: "ID",
					header: "ID",
					minWidth: 16,
					flex: true
				},
				{
					key: "Repo",
					header: "Repo",
					minWidth: 18,
					flex: true
				},
				{
					key: "Branch",
					header: "Branch",
					minWidth: 18,
					flex: true
				},
				{
					key: "Status",
					header: "Status",
					minWidth: 10
				}
			],
			rows: records.map((record) => ({
				ID: record.id,
				Repo: record.repoRoot,
				Branch: record.branch,
				Status: record.removedAt ? "restorable" : "active"
			}))
		}).trimEnd());
	});
	worktrees.command("create").description("Create a managed worktree").argument("<repoRoot>", "Source git checkout").option("--name <name>", "Managed worktree name").option("--base-ref <ref>", "Git ref to branch from").option("--source-profile <name>", "Repository source profile; repeat to combine (default: full source)", (value, previous) => [...previous ?? [], value]).option("--json", "Output JSON", false).action(async (repoRoot, opts) => {
		const { managedWorktrees } = await import("./service-BSrAmEtE.mjs");
		printRecord(await managedWorktrees.create({
			repoRoot,
			name: opts.name,
			baseRef: opts.baseRef,
			...opts.sourceProfile?.length ? { profiles: opts.sourceProfile } : {},
			ownerKind: "manual"
		}), opts.json === true);
	});
	worktrees.command("remove").description("Snapshot and remove a managed worktree").argument("<id>", "Managed worktree id").option("--force", "Remove even if snapshot creation fails", false).addOption(new Option("--if-lossless", "Remove without force only when clean and published").conflicts("force")).addOption(new Option("--exact-state <file>", "Retire detached checkout using an owner-fenced exact-state JSON request").conflicts(["force", "ifLossless"])).option("--json", "Output JSON", false).action(async (id, opts) => {
		const { managedWorktrees } = await import("./service-BSrAmEtE.mjs");
		if (opts.ifLossless) {
			const removed = await managedWorktrees.removeIfLossless(id);
			const cleanup = (await managedWorktrees.listRegistryRecords()).find((record) => record.id === id)?.runEndCleanup;
			if (opts.json) printJson({
				removed,
				cleanup
			});
			else defaultRuntime.log(removed ? `Removed ${id} without force.` : `Retained ${id}: ${cleanup?.outcome ?? "cleanup not admitted"}.`);
			return;
		}
		const exactState = await readExactStateRequest(opts.exactState);
		const result = await managedWorktrees.remove({
			id,
			...exactState ? { exactState } : {},
			reason: "manual-delete",
			allowSnapshotLoss: opts.force
		});
		if (opts.json) printJson(result);
		else defaultRuntime.log(result.recoveryPath ? `Retired ${id}; original source retained at ${result.recoveryPath} for the snapshot recovery period.` : result.snapshotError ? `Removed ${id} without a snapshot: ${result.snapshotError}` : `Removed ${id}.`);
	});
	worktrees.command("restore").description("Restore a managed worktree from its snapshot").option("--recover-exact-state <file>", "Reconcile a completed but unfinalized exact-state retirement using its original JSON request").argument("<id>", "Managed worktree id").option("--json", "Output JSON", false).action(async (id, opts) => {
		const { managedWorktrees } = await import("./service-BSrAmEtE.mjs");
		const recoverExactState = await readExactStateRequest(opts.recoverExactState);
		printRecord(await managedWorktrees.restore({
			id,
			...recoverExactState ? { recoverExactState } : {}
		}), opts.json === true);
	});
	worktrees.command("gc").description("Run managed worktree cleanup now").option("--json", "Output JSON", false).action(async (opts) => {
		const { formatWorktreeGcResult } = await import("./gc-result-BitHKd7s.mjs");
		const { createManagedWorktreeOwnerPolicy } = await import("./owner-protection-nSW_LZYa.mjs");
		const { managedWorktrees, resolveWorktreeCleanupLimits } = await import("./service-BSrAmEtE.mjs");
		const { getRuntimeConfig } = await import("./config/config.js");
		const cfg = getRuntimeConfig();
		const limits = resolveWorktreeCleanupLimits();
		const result = await managedWorktrees.gc({
			limits,
			...createManagedWorktreeOwnerPolicy(cfg)
		});
		if (opts.json) printJson(result);
		else defaultRuntime.log(formatWorktreeGcResult(result));
		if (result.outcome === "partial") {
			const { exitCliAfterOutput } = await import("./one-shot-exit-DFhtxTFN.mjs");
			exitCliAfterOutput(defaultRuntime, 1);
		}
	});
	applyParentDefaultHelpAction(worktrees);
}
//#endregion
export { registerWorktreesCli };

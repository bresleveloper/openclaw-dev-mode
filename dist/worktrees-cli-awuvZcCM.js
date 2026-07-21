import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-C8LxvJgx.js";
import { a as managedWorktrees } from "./service-CZP996nB.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
//#region src/cli/worktrees-cli.ts
function printJson(value) {
	defaultRuntime.writeJson(value);
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
	worktrees.command("create").description("Create a managed worktree").argument("<repoRoot>", "Source git checkout").option("--name <name>", "Managed worktree name").option("--base-ref <ref>", "Git ref to branch from").option("--json", "Output JSON", false).action(async (repoRoot, opts) => {
		printRecord(await managedWorktrees.create({
			repoRoot,
			name: opts.name,
			baseRef: opts.baseRef,
			ownerKind: "manual"
		}), opts.json === true);
	});
	worktrees.command("remove").description("Snapshot and remove a managed worktree").argument("<id>", "Managed worktree id").option("--force", "Remove even if snapshot creation fails", false).option("--json", "Output JSON", false).action(async (id, opts) => {
		const result = await managedWorktrees.remove({
			id,
			reason: "manual-delete",
			force: opts.force
		});
		if (opts.json) printJson(result);
		else defaultRuntime.log(result.snapshotError ? `Removed ${id} without a snapshot: ${result.snapshotError}` : `Removed ${id}.`);
	});
	worktrees.command("restore").description("Restore a managed worktree from its snapshot").argument("<id>", "Managed worktree id").option("--json", "Output JSON", false).action(async (id, opts) => {
		printRecord(await managedWorktrees.restore({ id }), opts.json === true);
	});
	worktrees.command("gc").description("Run managed worktree cleanup now").option("--json", "Output JSON", false).action(async (opts) => {
		const result = await managedWorktrees.gc();
		if (opts.json) printJson(result);
		else defaultRuntime.log(`Removed ${result.removed.length}; deleted ${result.orphansDeleted} orphans; pruned ${result.snapshotsPruned} snapshots.`);
	});
	applyParentDefaultHelpAction(worktrees);
}
//#endregion
export { registerWorktreesCli };

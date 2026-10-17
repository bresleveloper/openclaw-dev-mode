import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-BTjjxElt.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-BvdPXRCn.mjs";
import { realpathSync, statSync } from "node:fs";
import { Option } from "commander";
//#region src/cli/worktrees-cli.ts
function mutateWorktree(method, capability, input, run) {
	return runWithLocalStateOwner({
		method,
		params: input,
		target: typeof input.id === "string" ? input.id : "managed worktrees",
		requiredCapabilities: [capability],
		recoveryCommand: "openclaw worktrees list --json",
		runLocal: async ({ env, config, signal, assertCurrent }) => {
			const { ManagedWorktreeService } = await import("./service-obfLq1v6.mjs");
			assertCurrent();
			return run(new ManagedWorktreeService({
				env,
				getConfig: () => config
			}), {
				signal,
				commitGuard: assertCurrent
			}, config);
		}
	});
}
async function readExactStateRequest(filename) {
	if (!filename) return;
	const { readFile } = await import("node:fs/promises");
	const { exactStateRetirementSchema } = await import("./snapshot-exact-state-contract-DiDtFYuk.mjs");
	return exactStateRetirementSchema.parse(JSON.parse(await readFile(filename, "utf8")));
}
function printRecord(record, json) {
	if (json) {
		defaultRuntime.writeJson(record);
		return;
	}
	defaultRuntime.log(`${record.id}\t${record.path}`);
}
function registerWorktreesCli(program) {
	const worktrees = program.command("worktrees").description("Create, inspect, restore, and clean up managed worktrees");
	worktrees.command("list").description("List active and restorable managed worktrees").option("--json", "Output JSON", false).action(async (opts) => {
		const { managedWorktrees } = await import("./service-obfLq1v6.mjs");
		const records = await managedWorktrees.list();
		if (opts.json) {
			defaultRuntime.writeJson({ worktrees: records });
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
		const target = realpathSync.native(repoRoot);
		const identity = statSync(target, { bigint: true });
		const input = {
			repoRoot: target,
			name: opts.name,
			baseRef: opts.baseRef,
			...opts.sourceProfile?.length ? { profiles: [...opts.sourceProfile] } : {}
		};
		printRecord(await runWithLocalStateOwner({
			method: "worktrees.create",
			params: {
				...input,
				expectedRepoIdentity: `${identity.dev}:${identity.ino}`
			},
			target,
			recoveryCommand: "openclaw worktrees list --json",
			assertTargetCurrent: () => {
				const current = statSync(target, { bigint: true });
				if (current.dev !== identity.dev || current.ino !== identity.ino) throw new Error("Source repository changed; rerun worktrees create.");
			},
			runLocal: async ({ env, config, signal, assertCurrent }) => {
				const { ManagedWorktreeService } = await import("./service-obfLq1v6.mjs");
				assertCurrent();
				return new ManagedWorktreeService({
					env,
					getConfig: () => config
				}).create({
					...input,
					ownerKind: "manual",
					signal,
					commitGuard: assertCurrent
				});
			}
		}), opts.json === true);
	});
	worktrees.command("remove").description("Snapshot and remove a managed worktree").argument("<id>", "Managed worktree id").option("--force", "Remove even if snapshot creation fails", false).addOption(new Option("--if-lossless", "Remove without force only when clean and published").conflicts("force")).addOption(new Option("--exact-state <file>", "Retire detached checkout using an owner-fenced exact-state JSON request").conflicts(["force", "ifLossless"])).option("--json", "Output JSON", false).action(async (id, opts) => {
		const exactState = await readExactStateRequest(opts.exactState);
		const result = await mutateWorktree("worktrees.remove", GATEWAY_SERVER_CAPS.WORKTREES_REMOVE_OWNER, {
			id,
			force: opts.force,
			ifLossless: opts.ifLossless,
			exactState
		}, async (service, guard) => {
			if (opts.ifLossless) return {
				removed: await service.removeIfLossless(id, guard),
				cleanup: (await service.listRegistryRecords()).find((record) => record.id === id)?.runEndCleanup
			};
			return service.remove({
				id,
				...guard,
				...exactState ? { exactState } : {},
				reason: "manual-delete",
				allowSnapshotLoss: opts.force
			});
		});
		if (opts.ifLossless) {
			const { removed, cleanup } = result;
			if (opts.json) defaultRuntime.writeJson({
				removed,
				cleanup
			});
			else defaultRuntime.log(removed ? `Removed ${id} without force.` : `Retained ${id}: ${cleanup?.outcome ?? "cleanup not admitted"}.`);
			return;
		}
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(result.recoveryPath ? `Retired ${id}; original source retained at ${result.recoveryPath} for the snapshot recovery period.` : result.snapshotError ? `Removed ${id} without a snapshot: ${result.snapshotError}` : `Removed ${id}.`);
	});
	worktrees.command("retire-snapshot").description("Retire one removed snapshot whose source is retained elsewhere").argument("<id>", "Removed managed worktree id").requiredOption("--expected-ref <ref>", "Exact snapshot ref").requiredOption("--expected-oid <oid>", "Exact snapshot commit").requiredOption("--removed-at <milliseconds>", "Exact recorded removal time").requiredOption("--retained-ref <ref>", "Retained branch or remote-tracking source ref").requiredOption("--retained-oid <oid>", "Exact retained source commit").option("--json", "Output JSON", false).action(async (id, opts) => {
		const input = {
			id,
			expectedSnapshotRef: opts.expectedRef,
			expectedSnapshotOid: opts.expectedOid,
			expectedRemovedAt: Number(opts.removedAt),
			retainedSourceRef: opts.retainedRef,
			expectedRetainedSourceOid: opts.retainedOid
		};
		const result = await mutateWorktree("worktrees.retireSnapshot", GATEWAY_SERVER_CAPS.WORKTREES_RETIRE_SNAPSHOT_OWNER, input, (service, guard) => service.retireSnapshot({
			...input,
			...guard
		}));
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(`Retired snapshot ${id}.`);
	});
	worktrees.command("recover-removal").description("Resume interrupted removal from its original clean snapshot").argument("<id>", "Managed worktree id").requiredOption("--snapshot <oid>", "Expected pending snapshot commit").option("--json", "Output JSON", false).action(async (id, opts) => {
		const input = {
			id,
			snapshot: opts.snapshot
		};
		const result = await mutateWorktree("worktrees.recoverRemoval", GATEWAY_SERVER_CAPS.WORKTREES_RECOVER_REMOVAL_OWNER, input, (service, guard) => service.recoverRemoval({
			...input,
			...guard
		}));
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(`Completed removal of ${id}; original snapshot retained.`);
	});
	worktrees.command("restore").description("Restore a managed worktree from its snapshot").option("--recover-exact-state <file>", "Reconcile a completed but unfinalized exact-state retirement using its original JSON request").argument("<id>", "Managed worktree id").option("--json", "Output JSON", false).action(async (id, opts) => {
		const recoverExactState = await readExactStateRequest(opts.recoverExactState);
		const input = {
			id,
			...recoverExactState ? { recoverExactState } : {}
		};
		printRecord(await mutateWorktree("worktrees.restore", GATEWAY_SERVER_CAPS.WORKTREES_RESTORE_OWNER, input, (service, guard) => service.restore({
			...input,
			...guard
		})), opts.json === true);
	});
	worktrees.command("gc").description("Run managed worktree cleanup now").option("--json", "Output JSON", false).action(async (opts) => {
		const { formatWorktreeGcResult } = await import("./gc-result-BSEBg1zq.mjs");
		const result = await mutateWorktree("worktrees.gc", GATEWAY_SERVER_CAPS.WORKTREES_GC_OWNER, {}, async (service, guard, config) => {
			const { createManagedWorktreeOwnerPolicy } = await import("./owner-protection-eMihPYks.mjs");
			const { resolveWorktreeCleanupLimits } = await import("./service-obfLq1v6.mjs");
			return service.gc({
				...guard,
				limits: resolveWorktreeCleanupLimits(),
				retryDeferred: true,
				...createManagedWorktreeOwnerPolicy(config)
			});
		});
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(formatWorktreeGcResult(result));
		if (result.outcome === "partial") {
			const { exitCliAfterOutput } = await import("./one-shot-exit-BwX7kJPB.mjs");
			exitCliAfterOutput(defaultRuntime, 1);
		}
	});
	applyParentDefaultHelpAction(worktrees);
}
//#endregion
export { registerWorktreesCli };
